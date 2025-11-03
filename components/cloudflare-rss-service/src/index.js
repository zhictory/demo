/**
 * Cloudflare Workers RSS Service
 * 提供 RSS 订阅源，兼容 Fluent Reader
 */

class RSSService {
  constructor() {
    // 示例数据源 - 可以替换为实际的数据源
    this.dataSources = [
      {
        id: 'tech-news',
        title: '技术新闻',
        description: '最新的技术资讯和新闻',
        link: 'https://example.com/tech-news',
        items: []
      },
      {
        id: 'blog-posts',
        title: '博客文章',
        description: '个人博客文章更新',
        link: 'https://example.com/blog',
        items: []
      }
    ];
  }

  // 生成 RSS XML
  generateRSS(feedData) {
    const { title, description, link, items } = feedData;
    
    let rss = '<?xml version="1.0" encoding="UTF-8"?>\n';
    rss += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
    rss += '  <channel>\n';
    rss += '    <title>' + this.escapeXml(title) + '</title>\n';
    rss += '    <description>' + this.escapeXml(description) + '</description>\n';
    rss += '    <link>' + this.escapeXml(link) + '</link>\n';
    rss += '    <atom:link href="' + this.escapeXml(link) + '/rss" rel="self" type="application/rss+xml" />\n';
    rss += '    <language>zh-cn</language>\n';
    rss += '    <lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>\n';
    rss += '    <generator>Cloudflare Workers RSS Service</generator>\n';

    items.forEach(item => {
      rss += '    <item>\n';
      rss += '      <title>' + this.escapeXml(item.title) + '</title>\n';
      rss += '      <description>' + this.escapeXml(item.description || '') + '</description>\n';
      rss += '      <link>' + this.escapeXml(item.link) + '</link>\n';
      rss += '      <guid isPermaLink="true">' + this.escapeXml(item.link) + '</guid>\n';
      rss += '      <pubDate>' + new Date(item.pubDate).toUTCString() + '</pubDate>\n';
      if (item.author) {
        rss += '      <author>' + this.escapeXml(item.author) + '</author>\n';
      }
      if (item.categories) {
        item.categories.forEach(cat => {
          rss += '      <category>' + this.escapeXml(cat) + '</category>\n';
        });
      }
      rss += '    </item>\n';
    });

    rss += '  </channel>\n';
    rss += '</rss>';

    return rss;
  }

  // XML 转义
  escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#039;');
  }

  // 获取示例数据
  async getSampleData(feedId) {
    // 这里可以从数据库、API 或其他数据源获取数据
    const sampleItems = [
      {
        title: 'Cloudflare Workers 发布新功能',
        description: 'Cloudflare Workers 推出了更多强大的功能，让边缘计算更加便捷。',
        link: 'https://example.com/news/1',
        pubDate: new Date(Date.now() - 86400000).toISOString(), // 1天前
        author: 'Tech Team',
        categories: ['技术', 'Cloudflare']
      },
      {
        title: 'RSS 阅读器最佳实践',
        description: '如何选择和使用 RSS 阅读器，包括 Fluent Reader 的使用技巧。',
        link: 'https://example.com/blog/rss-best-practices',
        pubDate: new Date(Date.now() - 172800000).toISOString(), // 2天前
        author: 'Blog Author',
        categories: ['RSS', '工具']
      },
      {
        title: '前端开发趋势 2024',
        description: '探索 2024 年前端开发的最新趋势和技术栈。',
        link: 'https://example.com/blog/frontend-trends-2024',
        pubDate: new Date(Date.now() - 259200000).toISOString(), // 3天前
        author: 'Frontend Team',
        categories: ['前端', '趋势']
      }
    ];

    return sampleItems;
  }

  // 处理 RSS 请求
  async handleRSSRequest(url) {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(part => part);
    
    // 默认返回第一个数据源
    let feedId = pathParts[pathParts.length - 1];
    if (!feedId || feedId === 'rss') {
      feedId = this.dataSources[0].id;
    }

    const feedData = this.dataSources.find(feed => feed.id === feedId);
    if (!feedData) {
      return new Response('RSS feed not found', { status: 404 });
    }

    // 获取数据
    feedData.items = await this.getSampleData(feedId);
    
    // 生成 RSS
    const rss = this.generateRSS(feedData);
    
    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 缓存5分钟
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  // 处理根路径请求，显示可用的 RSS 源
  async handleRootRequest(url) {
    const origin = new URL(url).origin;
    const feedsList = this.dataSources.map(feed => 
      '<li><a href="/rss/' + feed.id + '">' + feed.title + '</a> - ' + feed.description + '</li>'
    ).join('');

    const html = '<!DOCTYPE html>\n' +
      '<html lang="zh-CN">\n' +
      '<head>\n' +
      '    <meta charset="UTF-8">\n' +
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '    <title>RSS Service</title>\n' +
      '    <style>\n' +
      '        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }\n' +
      '        h1 { color: #333; }\n' +
      '        .feed-list { background: #f5f5f5; padding: 20px; border-radius: 8px; }\n' +
      '        .feed-list li { margin: 10px 0; }\n' +
      '        .feed-list a { color: #0066cc; text-decoration: none; }\n' +
      '        .feed-list a:hover { text-decoration: underline; }\n' +
      '        .usage { background: #e8f4fd; padding: 15px; border-radius: 8px; margin-top: 20px; }\n' +
      '    </style>\n' +
      '</head>\n' +
      '<body>\n' +
      '    <h1>RSS 订阅服务</h1>\n' +
      '    <div class="feed-list">\n' +
      '        <h2>可用的 RSS 源：</h2>\n' +
      '        <ul>' + feedsList + '</ul>\n' +
      '    </div>\n' +
      '    <div class="usage">\n' +
      '        <h2>使用方法：</h2>\n' +
      '        <p>在 RSS 阅读器（如 Fluent Reader）中添加以下订阅链接：</p>\n' +
      '        <ul>\n' +
      '            <li><code>' + origin + '/rss/tech-news</code></li>\n' +
      '            <li><code>' + origin + '/rss/blog-posts</code></li>\n' +
      '        </ul>\n' +
      '    </div>\n' +
      '</body>\n' +
      '</html>';

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=600'
      }
    });
  }
}

// Cloudflare Workers 主处理函数
export default {
  async fetch(request, env, ctx) {
    const rssService = new RSSService();
    const url = new URL(request.url);

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // 只处理 GET 和 HEAD 请求
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // 根路径显示可用源列表
      if (url.pathname === '/' || url.pathname === '') {
        return await rssService.handleRootRequest(url);
      }

      // RSS 请求
      if (url.pathname.includes('/rss')) {
        return await rssService.handleRSSRequest(url);
      }

      // 404
      return new Response('Not found', { status: 404 });
    } catch (error) {
      console.error('RSS Service Error:', error);
      return new Response('Internal server error', { status: 500 });
    }
  }
};
