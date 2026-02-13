# Deployment Guide - Second Brain Dashboard

## 🎯 Quick Deployment to Cloudflare Pages

### Prerequisites

1. Cloudflare account (free tier works)
2. Wrangler CLI installed: `npm install -g wrangler`

### Automated Deployment

Run the deployment script:

```bash
./deploy-cloudflare.sh
```

This will:
1. Build the project (if not already built)
2. Authenticate with Cloudflare
3. Deploy to `second-brain-cole.pages.dev`

### Manual Deployment Steps

#### 1. Build the Project

```bash
npm run build
```

This creates a static export in `out/` directory.

#### 2. Deploy with Wrangler

```bash
# Login to Cloudflare
wrangler login

# Deploy to Pages
wrangler pages deploy out --project-name=second-brain-cole
```

#### 3. Access Your Dashboard

Your dashboard will be live at: **https://second-brain-cole.pages.dev**

## 🌐 Alternative Deployment Methods

### Method 1: Cloudflare Dashboard (Drag & Drop)

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** > **Pages**
3. Click **Create application** > **Upload assets**
4. Drag the `out/` folder contents
5. Name: `second-brain-cole`
6. Click **Deploy site**

### Method 2: GitHub Integration (CI/CD)

1. Create a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Second Brain Dashboard"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. In Cloudflare Dashboard:
   - Go to **Pages** > **Create application**
   - Choose **Connect to Git**
   - Select your repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `out`
   - Click **Save and Deploy**

3. Future deployments are automatic on push to `main`

## ⚙️ Build Configuration

### Next.js Configuration

The project is configured for static export in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

### Headers Configuration

Custom headers are set in `out/_headers`:
- Security headers (X-Frame-Options, CSP, etc.)
- Cache control for static assets
- CORS headers (if needed)

## 🔧 Custom Domain Setup

After deployment, add a custom domain:

1. Go to your Cloudflare Pages project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `brain.yourdomain.com`)
5. Cloudflare will provide DNS records to add
6. Add DNS records in your domain's DNS settings
7. Wait for DNS propagation (usually < 5 minutes)

### DNS Records Example

If using `brain.yourdomain.com`:

```
Type: CNAME
Name: brain
Target: second-brain-cole.pages.dev
Proxy: Enabled (orange cloud)
```

## 🚀 Performance Optimization

### Automatic Optimizations by Cloudflare Pages

- ✅ Global CDN distribution (300+ locations)
- ✅ Automatic SSL/TLS certificates
- ✅ HTTP/2 and HTTP/3 support
- ✅ Brotli compression
- ✅ DDoS protection
- ✅ Edge caching

### Build Optimizations

The project includes:
- Code splitting (automatic by Next.js)
- CSS minification
- Image optimization (placeholder for future)
- Tree shaking

## 📊 Monitoring & Analytics

### Enable Web Analytics

1. In Cloudflare Dashboard, go to your Pages project
2. Click **Analytics** tab
3. Enable **Web Analytics**
4. View real-time visitor data, page views, and performance metrics

### Performance Monitoring

Use Lighthouse (built into Chrome DevTools):
```bash
lighthouse https://second-brain-cole.pages.dev --view
```

Target scores:
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >90

## 🔄 Deployment Workflow

### Development → Staging → Production

1. **Development**
   ```bash
   npm run dev
   # Test at http://localhost:3000
   ```

2. **Preview Build**
   ```bash
   npm run build
   npx serve out
   # Test static build locally at http://localhost:3000
   ```

3. **Deploy to Staging**
   ```bash
   wrangler pages deploy out --project-name=second-brain-staging
   # Test at https://second-brain-staging.pages.dev
   ```

4. **Deploy to Production**
   ```bash
   wrangler pages deploy out --project-name=second-brain-cole
   # Live at https://second-brain-cole.pages.dev
   ```

## 🔐 Environment Variables

If you need to add environment variables (for future API integration):

### Via Wrangler

```bash
wrangler pages secret put API_KEY
# Enter value when prompted
```

### Via Dashboard

1. Go to project **Settings** > **Environment variables**
2. Click **Add variable**
3. Enter name and value
4. Choose environment (Production/Preview)
5. Click **Save**

### In Code

```typescript
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

Note: Variables must be prefixed with `NEXT_PUBLIC_` to be exposed to the browser.

## 📝 Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test build locally: `npx serve out`
- [ ] Verify all pages load correctly
- [ ] Check responsive design (mobile/tablet/desktop)
- [ ] Test search functionality
- [ ] Verify timeline view renders correctly
- [ ] Check stats dashboard displays data
- [ ] Review browser console for errors
- [ ] Run Lighthouse audit (target >90 performance)
- [ ] Update README with deployment URL
- [ ] Add custom domain (optional)
- [ ] Enable Web Analytics in Cloudflare

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next out node_modules
npm install
npm run build
```

### Deployment Fails

1. Check Wrangler is logged in: `wrangler whoami`
2. Re-login if needed: `wrangler login`
3. Verify project name is available
4. Check build output exists: `ls out/`

### 404 Errors After Deployment

1. Verify `out/index.html` exists
2. Check `next.config.ts` has `output: 'export'`
3. Ensure no dynamic routes (not supported in static export)

### Styling Issues

1. Verify `globals.css` and `theme.css` are imported
2. Check CSS modules are properly named: `*.module.css`
3. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)

## 📞 Support

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Next.js Docs:** https://nextjs.org/docs
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/

---

**Ready to deploy! 🚀**

Run `./deploy-cloudflare.sh` to get started.
