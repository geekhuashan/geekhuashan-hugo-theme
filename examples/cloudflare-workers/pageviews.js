/**
 * Cloudflare Workers - Google Analytics 4 页面浏览量 API
 * 从 GA4 Data API 获取真实的页面浏览量数据
 *
 * 环境变量需求：
 * - GA4_PROPERTY_ID: GA4 属性 ID（如 "123456789"）
 * - GA4_CREDENTIALS: Google Cloud 服务账号 JSON 密钥（完整 JSON 字符串）
 */

// CORS 白名单（您的博客域名）
const ALLOWED_ORIGINS = [
  'https://yourdomain.com',
  'http://localhost:1313',  // 本地开发
  'http://localhost:1314'
];

// 缓存时长：5 分钟（Cloudflare KV 或 Cache API）
const CACHE_DURATION = 300; // 秒

export default {
  async fetch(request, env) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // 仅允许 GET 请求
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const url = new URL(request.url);
      const path = url.searchParams.get('path');

      if (!path) {
        return jsonResponse({ error: 'Missing path parameter' }, 400, request);
      }

      // 检查缓存
      const cacheKey = `pageviews:${path}`;
      const cachedData = await getCachedData(cacheKey, env);
      if (cachedData) {
        return jsonResponse(cachedData, 200, request, true);
      }

      // 从 GA4 API 获取数据
      const pageViews = await fetchGA4PageViews(path, env);

      const responseData = {
        path: path,
        views: pageViews,
        updatedAt: new Date().toISOString(),
        cached: false
      };

      // 缓存结果
      await setCachedData(cacheKey, responseData, env);

      return jsonResponse(responseData, 200, request);

    } catch (error) {
      console.error('Error:', error);
      return jsonResponse({
        error: 'Failed to fetch page views',
        message: error.message
      }, 500, request);
    }
  }
};

/**
 * 从 Google Analytics Data API 获取页面浏览量
 */
async function fetchGA4PageViews(pagePath, env) {
  const propertyId = env.GA4_PROPERTY_ID;
  const credentials = JSON.parse(env.GA4_CREDENTIALS);

  // 1. 获取 Google OAuth2 访问令牌
  const accessToken = await getGoogleAccessToken(credentials);

  // 2. 调用 GA4 Data API
  const apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const requestBody = {
    dateRanges: [
      {
        startDate: '2020-01-01', // 从博客上线日期开始
        endDate: 'today'
      }
    ],
    dimensions: [
      { name: 'pagePath' }
    ],
    metrics: [
      { name: 'screenPageViews' }
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'EXACT',
          value: pagePath
        }
      }
    }
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GA4 API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // 解析浏览量
  if (data.rows && data.rows.length > 0) {
    return parseInt(data.rows[0].metricValues[0].value);
  }

  return 0; // 无数据则返回 0
}

/**
 * 获取 Google OAuth2 访问令牌（使用服务账号）
 */
async function getGoogleAccessToken(credentials) {
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtClaimSet = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  // 生成 JWT
  const jwt = await signJWT(jwtHeader, jwtClaimSet, credentials.private_key);

  // 交换访问令牌
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to obtain access token');
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

/**
 * 使用 RS256 签名 JWT（Cloudflare Workers 兼容版本）
 */
async function signJWT(header, payload, privateKeyPem) {
  const encoder = new TextEncoder();

  // Base64URL 编码
  const base64UrlEncode = (data) => {
    return btoa(String.fromCharCode(...new Uint8Array(data)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  // 导入私钥
  const pemContents = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  );

  // 签名
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(unsignedToken)
  );

  const encodedSignature = base64UrlEncode(signature);
  return `${unsignedToken}.${encodedSignature}`;
}

/**
 * 从缓存获取数据（使用 Cloudflare Cache API）
 */
async function getCachedData(key, env) {
  // 优先使用 KV 存储（如果配置了）
  if (env.PAGEVIEWS_KV) {
    const cached = await env.PAGEVIEWS_KV.get(key, 'json');
    return cached;
  }

  // 降级：使用 Cache API
  const cache = caches.default;
  const cacheUrl = `https://cache.internal/${key}`;
  const cachedResponse = await cache.match(cacheUrl);

  if (cachedResponse) {
    return await cachedResponse.json();
  }

  return null;
}

/**
 * 设置缓存数据
 */
async function setCachedData(key, data, env) {
  // 优先使用 KV 存储
  if (env.PAGEVIEWS_KV) {
    await env.PAGEVIEWS_KV.put(key, JSON.stringify(data), {
      expirationTtl: CACHE_DURATION
    });
    return;
  }

  // 降级：使用 Cache API
  const cache = caches.default;
  const cacheUrl = `https://cache.internal/${key}`;
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `max-age=${CACHE_DURATION}`
    }
  });

  await cache.put(cacheUrl, response);
}

/**
 * 处理 CORS
 */
function handleCORS(request) {
  const origin = request.headers.get('Origin');

  const headers = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return new Response(null, { status: 204, headers });
}

/**
 * 返回 JSON 响应（带 CORS）
 */
function jsonResponse(data, status = 200, request, fromCache = false) {
  const origin = request.headers.get('Origin');

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': `public, max-age=${CACHE_DURATION}`
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  if (fromCache) {
    headers['X-Cache'] = 'HIT';
  }

  return new Response(JSON.stringify(data), { status, headers });
}
