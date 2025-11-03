# Cloudflare Workers RSS 服务

一个基于 Cloudflare Workers 的 RSS 订阅服务，专门为 Fluent Reader 等 RSS 阅读器提供标准化的 RSS 源。

## 功能特性

- ✅ 标准 RSS 2.0 格式输出
- ✅ 完全兼容 Fluent Reader
- ✅ 支持多个 RSS 源
- ✅ 自动 XML 转义，防止注入攻击
- ✅ CORS 支持，允许跨域访问
- ✅ 缓存优化，减少响应时间
- ✅ 边缘计算，全球低延迟
- ✅ 零成本部署（免费额度内）

## 项目结构

```
cloudflare-rss-service/
├── src/
│   └── index.js          # 主要服务逻辑
├── wrangler.toml         # Cloudflare Workers 配置
├── test.html            # 本地测试页面
└── README.md            # 项目文档
```

## 快速开始

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 部署服务

```bash
cd cloudflare-rss-service
wrangler deploy
```

### 4. 获取服务 URL

部署成功后，Wrangler 会显示你的 Workers URL，格式类似：
`https://rss-service.your-subdomain.workers.dev`

## 使用方法

### RSS 源地址

部署后，你可以通过以下 URL 访问 RSS 源：

- 技术新闻: `https://your-worker-url.workers.dev/rss/tech-news`
- 博客文章: `https://your-worker-url.workers.dev/rss/blog-posts`

### 在 Fluent Reader 中添加

1. 打开 Fluent Reader
2. 点击"添加订阅"
3. 输入 RSS 源地址
4. 点击"确认"添加

### 支持的端点

| 端点 | 描述 | 格式 |
|------|------|------|
| `/` | 服务首页，显示可用 RSS 源 | HTML |
| `/rss` | 默认 RSS 源（技术新闻） | RSS/XML |
| `/rss/tech-news` | 技术新闻 RSS 源 | RSS/XML |
| `/rss/blog-posts` | 博客文章 RSS 源 | RSS/XML |

## 自定义配置

### 修改 RSS 源

编辑 `src/index.js` 中的 `dataSources` 数组：

```javascript
this.dataSources = [
  {
    id: 'your-feed-id',
    title: '你的 RSS 源标题',
    description: 'RSS 源描述',
    link: 'https://your-website.com',
    items: [] // 将通过 getSampleData 方法填充
  }
];
```

### 自定义数据源

修改 `getSampleData` 方法来从实际数据源获取内容：

```javascript
async getSampleData(feedId) {
  // 示例：从外部 API 获取数据
  const response = await fetch('https://api.example.com/posts');
  const posts = await response.json();
  
  return posts.map(post => ({
    title: post.title,
    description: post.content,
    link: post.url,
    pubDate: post.published_at,
    author: post.author,
    categories: post.tags
  }));
}
```

### 环境变量

在 `wrangler.toml` 中添加环境变量：

```toml
[vars]
API_BASE_URL = "https://api.example.com"
CACHE_DURATION = "300"
```

在代码中使用：

```javascript
const apiUrl = env.API_BASE_URL;
```

## 高级配置

### 自定义域名

1. 在 Cloudflare Dashboard 中添加自定义域名
2. 在 `wrangler.toml` 中配置：

```toml
[[routes]]
pattern = "rss.yourdomain.com"
zone_name = "yourdomain.com"
```

### 使用 KV 存储缓存

1. 创建 KV 命名空间：

```bash
wrangler kv:namespace create "RSS_CACHE"
wrangler kv:namespace create "RSS_CACHE" --preview
```

2. 在 `wrangler.toml` 中配置：

```toml
[[kv_namespaces]]
binding = "RSS_CACHE"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

3. 在代码中使用缓存：

```javascript
// 在 fetch 函数中
async fetch(request, env, ctx) {
  const cacheKey = `rss:${feedId}`;
  let cached = await env.RSS_CACHE.get(cacheKey);
  
  if (cached) {
    return new Response(cached, {
      headers: { 'Content-Type': 'application/rss+xml' }
    });
  }
  
  // 生成新的 RSS 内容
  const rss = await generateRSS(feedData);
  
  // 缓存结果
  ctx.waitUntil(env.RSS_CACHE.put(cacheKey, rss, { expirationTtl: 300 }));
  
  return new Response(rss, {
    headers: { 'Content-Type': 'application/rss+xml' }
  });
}
```

## 测试

### 本地测试

1. 启动本地开发服务器：

```bash
wrangler dev
```

2. 打开浏览器访问 `http://localhost:8787`
3. 使用 `test.html` 进行功能测试

### 测试页面功能

- ✅ 服务状态检查
- ✅ RSS 格式验证
- ✅ 内容预览
- ✅ Fluent Reader 兼容性测试

## RSS 格式规范

本服务生成的 RSS 2.0 格式包含以下标准元素：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>频道标题</title>
    <description>频道描述</description>
    <link>频道链接</link>
    <atom:link href="RSS源地址" rel="self" type="application/rss+xml" />
    <language>zh-cn</language>
    <lastBuildDate>最后构建时间</lastBuildDate>
    <generator>Cloudflare Workers RSS Service</generator>
    
    <item>
      <title>文章标题</title>
      <description>文章描述</description>
      <link>文章链接</link>
      <guid isPermaLink="true">文章唯一标识</guid>
      <pubDate>发布时间</pubDate>
      <author>作者</author>
      <category>分类</category>
    </item>
  </channel>
</rss>
```

## 性能优化

### 缓存策略

- **浏览器缓存**: 5分钟 (Cache-Control: max-age=300)
- **边缘缓存**: 通过 Cloudflare 自动缓存
- **KV 存储**: 可选的持久化缓存

### 响应时间

- **全球平均延迟**: < 50ms
- **冷启动时间**: < 100ms
- **热响应时间**: < 10ms

## 故障排除

### 常见问题

1. **RSS 无法解析**
   - 检查 XML 格式是否正确
   - 确认 Content-Type 为 `application/rss+xml`

2. **CORS 错误**
   - 确认已正确设置 CORS 头部
   - 检查请求方法是否为 GET/HEAD/OPTIONS

3. **部署失败**
   - 检查 `wrangler.toml` 配置
   - 确认已登录 Cloudflare 账户

### 调试方法

1. 使用浏览器开发者工具检查网络请求
2. 查看 Workers 日志：`wrangler tail`
3. 使用 `test.html` 进行本地测试

## 成本分析

### Cloudflare Workers 免费额度

- **请求次数**: 100,000 次/天
- **CPU 时间**: 10ms/请求
- **内存**: 128MB

### 预估使用量

- **小型博客**: < 1,000 请求/天
- **中型网站**: < 10,000 请求/天
- **大型服务**: < 100,000 请求/天

## 安全考虑

- ✅ XML 注入防护（自动转义）
- ✅ CORS 策略配置
- ✅ 请求方法限制
- ✅ 错误信息过滤
- ✅ 输入验证

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持 RSS 2.0 格式
- Fluent Reader 兼容性
- 基础缓存功能

---

**注意**: 这是一个示例项目，生产环境使用前请根据实际需求进行安全性和性能优化。
