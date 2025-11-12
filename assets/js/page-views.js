/**
 * 页面浏览量统计
 * 从 Cloudflare Workers API 获取 GA4 真实数据
 * 仅在文章详情页生效
 */

(function() {
    'use strict';

    // Cloudflare Workers API 端点
    const API_ENDPOINT = 'https://geekhuashan-pageviews.geekhuashan.workers.dev';

    const CACHE_DURATION = 5 * 60 * 1000; // 缓存 5 分钟
    const RETRY_DELAY = 3000; // 失败后 3 秒重试

    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageViews);
    } else {
        initPageViews();
    }

    function initPageViews() {
        const viewContainer = document.querySelector('.page-views');
        if (!viewContainer) return; // 非文章页面，不执行

        const pageUrl = viewContainer.getAttribute('data-page-url');
        const viewCountElement = viewContainer.querySelector('.view-count');
        if (!pageUrl || !viewCountElement) return;

        // 1. 先显示缓存数据（如果有）
        const cachedData = getCachedViewCount(pageUrl);
        if (cachedData && cachedData.views !== undefined) {
            viewCountElement.textContent = formatViewCount(cachedData.views);
        }

        // 2. 从 Cloudflare Workers API 获取最新数据
        fetchPageViews(pageUrl)
            .then(function(data) {
                if (data && data.views !== undefined) {
                    viewCountElement.textContent = formatViewCount(data.views);
                    setCachedViewCount(pageUrl, data);
                }
            })
            .catch(function(error) {
                console.warn('获取浏览量失败:', error);
                // 失败后显示缓存或默认值
                if (!cachedData) {
                    viewCountElement.textContent = '-';
                }
            });
    }

    /**
     * 从 Cloudflare Workers API 获取页面浏览量
     */
    async function fetchPageViews(pageUrl) {
        const url = `${API_ENDPOINT}?path=${encodeURIComponent(pageUrl)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API 请求失败: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * 获取缓存的浏览量数据
     */
    function getCachedViewCount(pageUrl) {
        try {
            const cacheKey = 'ga4_view_cache_' + pageUrl;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                const now = Date.now();
                if (now - data.timestamp < CACHE_DURATION) {
                    return data;
                }
            }
        } catch (e) {
            console.warn('读取缓存失败:', e);
        }
        return null;
    }

    /**
     * 设置缓存的浏览量数据
     */
    function setCachedViewCount(pageUrl, data) {
        try {
            const cacheKey = 'ga4_view_cache_' + pageUrl;
            const cacheData = {
                views: data.views,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (e) {
            console.warn('保存缓存失败:', e);
        }
    }

    /**
     * 格式化浏览量显示
     * 1000+ 显示为 1k+
     * 10000+ 显示为 10k+
     */
    function formatViewCount(count) {
        if (count >= 10000) {
            return Math.floor(count / 1000) + 'k+';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1).replace('.0', '') + 'k+';
        } else {
            return count.toString();
        }
    }
})();
