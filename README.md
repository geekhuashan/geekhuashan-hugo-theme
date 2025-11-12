# GeekHuashan Hugo Theme

<h4 align=center>🚀 高度定制化 | 📱 响应式设计 | 🎨 现代化 UI | 🔍 SEO 优化</h4>

> 基于 [Hugo PaperMod](https://github.com/adityatelange/hugo-PaperMod) 的重度定制主题，专为中文博客优化

一个功能丰富、性能卓越的 Hugo 主题，包含 23 个自定义 CSS 模块、智能内容推荐系统、双向链接支持、完整的 AI/Google SEO 优化等企业级特性。

**在线演示**: [geekhuashan.com](https://geekhuashan.com/)

[![Hugo Version](https://img.shields.io/badge/Hugo-v0.135.0+-blue.svg)](https://gohugo.io)
[![License](https://img.shields.io/github/license/geekhuashan/geekhuashan-hugo-theme)](LICENSE)

---

## ✨ 核心特性

### 🎨 23 个模块化 CSS 系统
主题采用模块化 CSS 架构，每个功能独立封装，易于维护和定制。所有 CSS 模块位于 `assets/css/extended/` 目录，主题会自动加载：

- **布局系统**: `fresh-layout.css` - 现代化网格和容器系统
- **组件库**: `fresh-components.css` - 按钮、输入框、徽章等
- **导航系统**: `fresh-navigation.css`, `mobile-menu.css` - 桌面/移动导航
- **文章系统**: `fresh-posts.css`, `related-posts.css` - 文章卡片、推荐系统
- **代码增强**: `code-simple.css`, `chroma-light.css` - 代码高亮、亮暗主题
- **特殊页面**: `about.css`, `category-design.css` - 定制页面布局
- **交互效果**: `animations.css`, `fresh-decorations.css` - 动画和装饰元素
- **SEO 组件**: `faq.css` - Schema.org 标记的 FAQ 组件
- **可视化**: `heatmap-calendar.css`, `page-views.css` - 发布频率热力图、页面浏览量
- **响应式**: `responsive.css`, `lazy-loading.css` - 移动端优化
- **主题样式**: `theme-modern.css`, `theme-freshness.css` - 主题变量和配色
- **工具类**: `compatibility.css`, `search-enhancements.css`, `video.css` - 浏览器兼容、搜索、视频等
- **其他**: `backlinks.css` - 双向链接样式

**自动加载机制**：主题通过 `layouts/partials/head.html` 使用 `resources.Match "css/extended/*.css"` 自动加载所有模块，无需手动配置。

### 🤖 智能内容推荐系统
替代传统的"上一篇/下一篇"导航，采用多维度算法：

- **标签匹配** (权重 200) - 共享标签的文章获得最高优先级
- **分类相似** (权重 150) - 同类别文章次之
- **时间接近** (权重 10) - 发布时间相近的文章略加权
- **智能降级** - 无强关联时显示同类别或最新文章
- **3 列网格布局** - 桌面端三栏展示，移动端自适应单栏
- **丰富卡片信息** - 封面图、标题、摘要、标签、日期一应俱全

配置项见 `hugo.toml` 中的 `[params.relatedPosts]` 部分。

### 🔗 双向链接系统 (Backlinks)
Obsidian 风格的 Wiki 链接支持，实现知识库式内容关联：

```markdown
基础链接: [[tailscale-derp-guide]]
别名链接: [[显示文本|文件名]]
```

**特性**:
- 自动生成"被引用"列表，显示反向链接
- 内部链接：蓝色虚线下划线，悬停变实线
- 失效链接：红色删除线，防止点击
- 引用预览：显示引用上下文的前后文字

**实现**:
- [render-link.html](layouts/_default/_markup/render-link.html) - 拦截 `[[]]` 语法
- [backlinks.html](layouts/partials/backlinks.html) - 扫描并生成反向链接
- [backlinks.css](assets/css/extended/backlinks.css) - 链接样式

### 🔍 AI/Google 双重 SEO 优化

#### AI Agent 优化
专为 ChatGPT、Claude、Perplexity 等 AI 搜索引擎优化：

- ✅ **增强 JSON-LD 结构化数据** - 包含作者 URL、阅读时长、文章章节
- ✅ **FAQ Schema 支持** - 通过 `{{< faq >}}` shortcode 生成 FAQPage 标记
- ✅ **语义化 HTML** - 使用 microdata 属性 (itemscope, itemprop)
- ✅ **AI 爬虫友好** - robots.txt 允许 GPTBot、Claude-Web、PerplexityBot 等

#### Google SEO 优化
完整的传统搜索引擎优化：

- ✅ **自定义 sitemap** - 动态优先级分配（tech: 0.8, read/life: 0.7）
- ✅ **图片 sitemap** - 集成图片索引，优化 Google Images SEO
- ✅ **资源预连接** - DNS prefetch 和 preconnect 加速外部资源
- ✅ **Rich Snippets** - max-image-preview:large, max-snippet:-1
- ✅ **PWA manifest** - 获得移动友好标识
- ✅ **Core Web Vitals 优化** - LCP < 2.5s, INP < 200ms, CLS < 0.1

**实现文件**:
- [schema_json.html](layouts/partials/templates/schema_json.html) - JSON-LD 生成
- [robots.txt](layouts/robots.txt) - 爬虫规则
- [shortcodes/faq.html](layouts/shortcodes/faq.html) - FAQ Schema

### 🖼️ 增强的代码块功能
专为技术博客优化的代码展示：

- **横向滚动** - 长代码行自动滚动，保持格式完整
- **一键复制** - 悬停显示复制按钮，成功后显示"✓ 已复制"反馈
- **自定义滚动条** - Chrome/Safari (WebKit) 和 Firefox 样式统一
- **行号支持** - 兼容 Hugo 行号功能，复制时自动过滤
- **移动端优化** - 小屏设备上始终显示复制按钮

**实现**:
- [code-enhancements.css](assets/css/extended/code-enhancements.css) - 滚动条和按钮样式
- [code-copy.js](assets/js/code-copy.js) - 复制逻辑与 MutationObserver

### 📦 丰富的 Shortcodes
提供多种内容组件，无需编写 HTML：

```markdown
<!-- 折叠区域 -->
{{< collapse "标题" >}}隐藏内容{{< /collapse >}}

<!-- 提示框 -->
{{< fresh-alert type="info/warning/success" >}}提示内容{{< /fresh-alert >}}

<!-- 按钮 -->
{{< fresh-button href="url" text="按钮文字" >}}

<!-- 卡片 -->
{{< fresh-card title="标题" >}}卡片内容{{< /fresh-card >}}

<!-- FAQ (带 Schema.org 标记) -->
{{< faq >}}
{{< faq-item question="问题" >}}答案{{< /faq-item >}}
{{< /faq >}}

<!-- 增强图片 -->
{{< figure src="image.jpg" alt="描述" caption="说明文字" >}}

<!-- 行内图片 -->
{{< inTextImg url="icon.png" >}}

<!-- 视频 -->
{{< video src="video.mp4" >}}

<!-- 原始 HTML -->
{{< rawhtml >}}<custom-element></custom-element>{{< /rawhtml >}}
```

### 🌍 多语言支持
包含 47 种语言文件，轻松扩展到其他语言：

- 默认中文 (zh) 优化
- 菜单项支持 emoji + 文字 (🏠 主页, 🔍 搜索, ⏱ 时间轴)
- 完整 i18n 支持框架

### 🎯 其他特性

- **Fuse.js 搜索** - 快速全文搜索
- **归档页面** - 时间线展示所有文章
- **目录生成** - 自动提取文章标题生成 TOC
- **面包屑导航** - 清晰的导航路径
- **分享按钮** - 社交媒体分享
- **明暗主题** - 自动切换和手动开关
- **Twikoo 评论** - 中文友好的评论系统
- **Google Analytics & AdSense** - 流量统计和广告集成

### 📊 可选集成 - 页面浏览量统计

主题支持通过 Cloudflare Workers 显示真实的 Google Analytics 4 页面浏览量。

**完整部署项目（推荐）**：
👉 [geekhuashan/hugo-ga4-pageviews](https://github.com/geekhuashan/hugo-ga4-pageviews)

**快速开始**：
```bash
# 1. 复制示例代码
cp -r themes/geekhuashan-hugo-theme/examples/cloudflare-workers/ ~/my-worker/

# 2. 安装并部署
cd ~/my-worker/
npm install
npx wrangler login
npx wrangler deploy
```

**特性**：
- ✅ 实时同步 GA4 真实数据
- ✅ 5 分钟智能缓存，节省 API 配额
- ✅ Cloudflare Workers 边缘计算，全球低延迟
- ✅ 免费计划支持 100,000 请求/天

详细文档和配置指南请查看：
- [完整项目仓库](https://github.com/geekhuashan/hugo-ga4-pageviews)（包含详细的 GCP 和 GA4 配置教程）
- [本地示例代码](examples/cloudflare-workers/)（快速参考和自定义修改）

---

## 📥 安装

### 方法 1: Git Submodule (推荐)

```bash
cd your-hugo-site
git submodule add https://github.com/geekhuashan/geekhuashan-hugo-theme.git themes/geekhuashan-hugo-theme
```

### 方法 2: Git Clone

```bash
cd your-hugo-site
git clone https://github.com/geekhuashan/geekhuashan-hugo-theme.git themes/geekhuashan-hugo-theme
```

### 方法 3: 下载 ZIP

从 [Releases](https://github.com/geekhuashan/geekhuashan-hugo-theme/releases) 页面下载最新版本，解压到 `themes/geekhuashan-hugo-theme`。

---

## ⚙️ 配置

### 基础配置

在 `hugo.toml` 中添加：

```toml
theme = "geekhuashan-hugo-theme"
baseURL = "https://example.com/"
languageCode = "zh-CN"
defaultContentLanguage = "zh"
title = "我的博客"

[params]
  description = "博客描述"
  author = "作者名"

  # 启用相关推荐系统
  [params.relatedPosts]
    enable = true
    count = 3
    title = "相关推荐"
    showCover = true
    showExcerpt = true
    showTags = true
    showDate = true

# 相关文章算法配置
[related]
  threshold = 50
  includeNewer = true
  toLower = false
  [[related.indices]]
    name = "tags"
    weight = 200
  [[related.indices]]
    name = "categories"
    weight = 150
  [[related.indices]]
    name = "date"
    weight = 10

# 菜单配置
[[menu.main]]
  identifier = "home"
  name = "🏠 主页"
  url = "/"
  weight = 1

[[menu.main]]
  identifier = "search"
  name = "🔍 搜索"
  url = "/search/"
  weight = 2

[[menu.main]]
  identifier = "archives"
  name = "⏱ 时间轴"
  url = "/archives/"
  weight = 3
```

### 内容组织

```
content/
├── posts/
│   ├── tech/      # 技术文章
│   ├── read/      # 阅读笔记
│   └── life/      # 生活随想
└── _index.md
```

### 文章 Front Matter

```toml
+++
title = "文章标题"
date = "2024-07-29"
lastmod = "2024-07-29"
author = ["作者名"]
draft = false
categories = ["tech"]
tags = ["标签1", "标签2"]
description = "文章描述（100-160字，SEO优化）"
+++
```

---

## 🚀 使用

### 本地开发

```bash
# 预览（包含草稿）
hugo server -D --disableFastRender

# 验证构建警告
hugo --printI18nWarnings --printPathWarnings

# 生产构建
hugo --gc --minify
```

### 创建新文章

```bash
hugo new posts/tech/my-article.md
hugo new posts/read/book-review.md
hugo new posts/life/reflection.md
```

### 使用双向链接

在文章中引用其他文章：

```markdown
参考我之前的文章 [[tailscale-derp-guide]]，了解如何...
详细步骤见 [[完整指南|detailed-guide]]
```

### 添加 FAQ (AI SEO)

```markdown
{{< faq >}}
{{< faq-item question="如何安装主题？" >}}
使用 git submodule 方式安装最方便...
{{< /faq-item >}}
{{< faq-item question="支持哪些功能？" >}}
包含 22 个 CSS 模块、智能推荐、双向链接...
{{< /faq-item >}}
{{< /faq >}}
```

---

## 🎨 定制

### 添加新的 CSS 模块

1. 在 `themes/geekhuashan-hugo-theme/assets/css/extended/` 目录创建新文件 `my-module.css`
2. 编写你的 CSS 样式
3. 重新构建网站，主题会自动加载新模块（通过 `resources.Match` 自动匹配）

**注意**：Hugo 会按文件名字母顺序加载 CSS 文件。如果需要特定加载顺序，可以使用数字前缀命名（如 `01-base.css`, `02-components.css`）。

### 修改布局

覆盖 `layouts/` 目录中的模板文件：

- `layouts/_default/single.html` - 文章详情页
- `layouts/_default/list.html` - 列表页
- `layouts/partials/header.html` - 页头
- `layouts/partials/footer.html` - 页脚

### 调整推荐算法

修改 `hugo.toml` 中的权重：

```toml
[[related.indices]]
  name = "tags"
  weight = 200  # 增加标签权重

[[related.indices]]
  name = "categories"
  weight = 150  # 调整分类权重
```

---

## 📁 项目结构

```
geekhuashan-hugo-theme/
├── archetypes/          # 内容模板
├── assets/
│   ├── css/extended/    # 22 个自定义 CSS 模块
│   └── js/              # JavaScript (代码复制等)
├── i18n/                # 47 种语言文件
├── images/              # 主题截图
├── layouts/
│   ├── _default/        # 默认布局
│   ├── partials/        # 可复用组件
│   │   ├── backlinks.html          # 双向链接
│   │   ├── related_posts.html      # 相关推荐
│   │   └── templates/schema_json.html  # SEO Schema
│   ├── shortcodes/      # 内容组件
│   │   ├── faq.html     # FAQ Schema
│   │   ├── collapse.html
│   │   ├── fresh-*.html
│   │   └── ...
│   └── robots.txt       # AI 爬虫配置
├── static/              # 静态资源
├── LICENSE              # MIT 许可证
├── README.md            # 本文件
└── theme.toml           # 主题元数据
```

---

## 🔧 故障排查

### 样式未正确加载

确认以下几点：
1. CSS 文件位于 `themes/geekhuashan-hugo-theme/assets/css/extended/` 目录
2. 运行 `hugo --gc` 清除缓存后重新构建
3. 检查浏览器开发者工具，确认 CSS 文件被正确加载
4. 如果使用 Hugo 服务器，尝试添加 `--disableFastRender` 标志

### 相关推荐未显示

确保：
1. `[params.relatedPosts]` 中 `enable = true`
2. 文章有足够的 tags 或 categories
3. `[related]` 配置中 `threshold` 不要设置过高（推荐 50）

### 双向链接失效

检查：
1. 链接目标文件是否存在于 `/content/posts/` 下
2. 文件名是否与 `[[]]` 中的名称完全匹配（区分大小写）
3. 是否包含 `.md` 扩展名（应该省略）

### 构建警告

```bash
# 完整验证
hugo --gc --minify --printI18nWarnings --printPathWarnings
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m '新增某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

- [Hugo PaperMod](https://github.com/adityatelange/hugo-PaperMod) - 原始主题
- [Hugo Paper](https://github.com/nanxiaobei/hugo-paper) - PaperMod 的灵感来源
- [Fuse.js](https://github.com/krisk/fuse) - 搜索功能
- [Twikoo](https://github.com/imaegoo/twikoo) - 评论系统

---

## 📮 联系

- 网站: [geekhuashan.com](https://geekhuashan.com/)
- GitHub: [@geekhuashan](https://github.com/geekhuashan)

如果这个主题对您有帮助，欢迎 ⭐️ Star 支持！
