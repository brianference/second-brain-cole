#!/bin/bash

# Second Brain Dashboard - Cloudflare Pages Deployment Script
# Usage: ./deploy-cloudflare.sh

echo "🚀 Deploying Second Brain Dashboard to Cloudflare Pages..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if out directory exists
if [ ! -d "out" ]; then
    echo "❌ Build directory 'out' not found. Running build..."
    npm run build
fi

echo "📦 Build directory ready!"
echo ""

# Login to Cloudflare (if not already logged in)
echo "🔐 Checking Cloudflare authentication..."
wrangler whoami || wrangler login

echo ""
echo "🌐 Deploying to Cloudflare Pages..."
echo "Project name: second-brain-cole"
echo ""

# Deploy to Cloudflare Pages
wrangler pages deploy out --project-name=second-brain-cole

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your dashboard should be live at:"
echo "https://second-brain-cole.pages.dev"
echo ""
