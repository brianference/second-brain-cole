# Second Brain Dashboard

A Notion-like unified memory system integrating mem0 + Supermemory + files + tasks with powerful search, timeline view, and analytics.

## 🎨 Features

- **Indigo Night Theme** - Beautiful dark glassmorphic design with 56 design elements
- **Unified Search** - Powerful search with gradient focus and autocomplete
- **Timeline View** - Chronological visualization with activity heatmap
- **Stats Dashboard** - Analytics with charts and key metrics
- **Memory Cards** - Glassmorphic cards with multiple variants
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Deployment:** Cloudflare Pages

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🏗️ Build

```bash
npm run build
```

This creates a static export in the `out/` directory.

## 🌐 Deployment to Cloudflare Pages

### Option 1: Wrangler CLI (Recommended)

```bash
# Install Wrangler globally if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
wrangler pages deploy out --project-name=second-brain-cole
```

### Option 2: Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** > **Create a project**
3. Choose **Direct Upload**
4. Upload the contents of the `out/` directory
5. Set project name: `second-brain-cole`
6. Click **Deploy**

Your dashboard will be live at: `https://second-brain-cole.pages.dev`

### Option 3: Git Integration

1. Push this repository to GitHub/GitLab
2. In Cloudflare Pages, connect to your repository
3. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
4. Click **Save and Deploy**

## 📁 Project Structure

```
second-brain-dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── styles/            # Theme CSS
├── components/            # React components
│   ├── layout/           # Layout components (CommandBar, Sidebar)
│   ├── memory/           # Memory card components
│   ├── timeline/         # Timeline view
│   └── stats/            # Stats dashboard
├── lib/                  # Utilities and sample data
├── types/                # TypeScript type definitions
└── out/                  # Build output (gitignored)
```

## 🎨 Design Specifications

This dashboard follows a comprehensive design specification with:
- 56 documented design elements
- Indigo Night color palette with glassmorphic effects
- Accessibility standards (WCAG 2.1 AA compliant)
- Responsive breakpoints for all screen sizes

See design specs in `/root/.openclaw/workspace-designer/`:
- `SECOND-BRAIN-DASHBOARD-DESIGN-SPEC.md`
- `COMPONENT-BREAKDOWN.md`
- `QUICK-START-GUIDE.md`
- `VISUAL-MOCKUP-DESCRIPTIONS.md`

## 🔧 Configuration

### Custom Domain

After deployment, you can add a custom domain:
1. Go to your Cloudflare Pages project
2. Navigate to **Custom domains**
3. Add your domain
4. Update DNS records as instructed

### Environment Variables

Currently, the dashboard uses sample data. To integrate real data sources:
1. Add API endpoints in `lib/api.ts`
2. Set environment variables in Cloudflare Pages settings
3. Update components to fetch from real APIs

## 📝 Customization

### Theme Colors

Edit `app/styles/theme.css` to customize colors:
```css
:root {
  --indigo-400: #6366f1;  /* Primary accent */
  --purple-500: #8b5cf6;   /* Secondary accent */
  /* ... more colors */
}
```

### Sample Data

Edit `lib/sampleData.ts` to customize the sample memories, timeline entries, and stats.

## 🐛 Troubleshooting

### Build Issues

If you encounter build errors:
```bash
rm -rf .next out node_modules
npm install
npm run build
```

### Deployment Issues

Ensure the `out/` directory contains:
- `index.html`
- `_next/` directory with static assets
- `_headers` file for caching

## 📄 License

MIT

## 👤 Author

Cole - Second Brain Dashboard Phase 1

---

**Built with ❤️ using Next.js, TypeScript, and the Indigo Night design system**
