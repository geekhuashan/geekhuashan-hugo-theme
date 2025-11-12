# Cloudflare Workers - GA4 页面浏览量示例

这是一个可选的集成示例，为 Hugo 博客提供 Google Analytics 4 实时页面浏览量统计功能。

## 📦 完整项目

**推荐使用完整项目仓库（包含详细文档和部署指南）**：

👉 [geekhuashan/hugo-ga4-pageviews](https://github.com/geekhuashan/hugo-ga4-pageviews)

## 📁 本目录说明

本目录提供的是简化版示例代码，适合快速参考和自定义修改。如果你想直接部署使用，建议 clone 上述完整项目。

## 🚀 快速开始

### 1. 复制文件

```bash
cp -r examples/cloudflare-workers/ ~/my-pageviews-worker/
cd ~/my-pageviews-worker/
```

### 2. 安装依赖

```bash
npm install
```

### 3. 登录 Cloudflare

```bash
npx wrangler login
```

### 4. 配置环境变量

需要两个密钥：

```bash
# GA4 Property ID（在 GA4 后台查看）
npx wrangler secret put GA4_PROPERTY_ID

# Google Cloud 服务账号 JSON（需要先在 GCP 创建服务账号）
npx wrangler secret put GA4_CREDENTIALS
```

### 5. 修改配置

编辑 `wrangler.toml`：

```toml
name = "your-blog-pageviews"  # 改为你的项目名
```

编辑 `pageviews.js`：

```javascript
const ALLOWED_ORIGINS = [
  'https://yourdomain.com',     // 改为你的域名
  'http://localhost:1313'
];
```

### 6. 部署

```bash
npx wrangler deploy
```

## 📋 前置要求

1. **Google Cloud 服务账号**
   - 在 [Google Cloud Console](https://console.cloud.google.com/) 创建项目
   - 启用 Google Analytics Data API
   - 创建服务账号并下载 JSON 密钥

2. **GA4 授权**
   - 在 GA4 管理后台添加服务账号的邮箱
   - 授予"查看者"权限

3. **Cloudflare 账号**
   - 注册 [Cloudflare Workers](https://workers.cloudflare.com/)
   - 免费计划提供 100,000 请求/天

## 📖 详细文档

更多信息请参考：
- [完整项目文档](https://github.com/geekhuashan/hugo-ga4-pageviews)
- [Cloudflare Workers 官方文档](https://developers.cloudflare.com/workers/)
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)

## 🔧 文件说明

- `pageviews.js` - Workers 主函数（已去敏感化）
- `wrangler.toml` - Workers 配置文件（模板）
- `package.json` - npm 依赖列表
- `README.md` - 本文件

## 💡 使用提示

### API 调用示例

```javascript
// 前端 JavaScript
fetch('https://your-worker.workers.dev?path=/posts/my-article/')
  .then(res => res.json())
  .then(data => {
    console.log(`浏览量: ${data.views}`);
  });
```

### 缓存策略

Workers 使用 5 分钟缓存，减少对 GA4 API 的调用次数。缓存优先级：
1. Cloudflare KV（如果配置了）
2. Cache API（自动降级）

### 监控和调试

```bash
# 查看实时日志
npx wrangler tail

# 查看部署状态
npx wrangler deployments list
```

## ⚠️ 注意事项

1. **敏感信息**：不要将 GA4 凭证提交到 Git，使用 `wrangler secret` 管理
2. **CORS 配置**：确保 `ALLOWED_ORIGINS` 包含你的域名
3. **免费额度**：注意 Cloudflare Workers 和 GA4 API 的免费额度限制

## 🤝 获取帮助

遇到问题？
- 查看 [完整项目的 FAQ](https://github.com/geekhuashan/hugo-ga4-pageviews#faq)
- 提交 [Issue](https://github.com/geekhuashan/hugo-ga4-pageviews/issues)
