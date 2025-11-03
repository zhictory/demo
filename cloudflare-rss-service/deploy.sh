#!/bin/bash

# Cloudflare Workers RSS 服务部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署 Cloudflare Workers RSS 服务..."

# 检查是否安装了 Wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI 未安装"
    echo "请运行: npm install -g wrangler"
    exit 1
fi

echo "✅ Wrangler CLI 已安装"

# 检查是否已登录 Cloudflare
echo "🔍 检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ 未登录 Cloudflare"
    echo "请运行: wrangler login"
    exit 1
fi

echo "✅ 已登录 Cloudflare"

# 检查项目文件是否存在
if [ ! -f "src/index.js" ]; then
    echo "❌ 找不到 src/index.js 文件"
    exit 1
fi

if [ ! -f "wrangler.toml" ]; then
    echo "❌ 找不到 wrangler.toml 文件"
    exit 1
fi

echo "✅ 项目文件检查通过"

# 部署服务
echo "📦 正在部署到 Cloudflare Workers..."
wrangler deploy

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo ""
    echo "📋 RSS 服务信息:"
    echo "   - 服务名称: rss-service"
    echo "   - 部署时间: $(date)"
    echo ""
    echo "🔗 RSS 源地址:"
    echo "   - 技术新闻: https://rss-service.your-subdomain.workers.dev/rss/tech-news"
    echo "   - 博客文章: https://rss-service.your-subdomain.workers.dev/rss/blog-posts"
    echo ""
    echo "📖 使用说明:"
    echo "   1. 在 Fluent Reader 中添加上述 RSS 链接"
    echo "   2. 访问服务首页查看所有可用源"
    echo "   3. 使用 test.html 进行本地测试"
    echo ""
    echo "🛠️  管理命令:"
    echo "   - 查看日志: wrangler tail"
    echo "   - 本地开发: wrangler dev"
    echo "   - 重新部署: wrangler deploy"
else
    echo "❌ 部署失败"
    exit 1
fi
