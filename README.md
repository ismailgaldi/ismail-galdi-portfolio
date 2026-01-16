# Ismail Galdi — Portfolio Website

A premium, cinematic, scroll-driven one-page portfolio with 3D WebGL elements and crisp micro-interactions.

![Preview](https://via.placeholder.com/1200x630/0B0D10/B6FF3B?text=Ismail+Galdi+Portfolio)

## ✨ Features

- **Cinematic Scroll Experience** — Smooth scrolling with Lenis, GSAP ScrollTrigger animations
- **3D WebGL Hero** — Interactive Three.js scene with mouse-follow and scroll-linked effects
- **Pinned Horizontal Scroll** — Projects section with smooth horizontal scrubbing
- **Micro-interactions** — Hover effects, focus rings, animated text reveals
- **Accessible** — Keyboard navigation, focus traps, reduced motion support
- **Responsive** — Mobile-first design with performance fallbacks
- **Production Ready** — Optimized build, lazy loading, code splitting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` folder.

## 📁 Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── public/                 # Static assets
└── src/
    ├── main.js             # Entry point
    ├── styles/
    │   ├── main.css        # CSS entry (imports all)
    │   ├── tokens.css      # Design tokens (★ customize here)
    │   ├── base.css        # Reset and global styles
    │   ├── components.css  # Reusable components
    │   └── sections/       # Per-section styles
    ├── js/
    │   ├── app.js          # Main orchestrator
    │   ├── utils/          # Utilities (splitText, lazyLoad, etc.)
    │   ├── components/     # UI components (nav, modal, form)
    │   ├── sections/       # Section animations
    │   └── three/          # Three.js scene
    └── assets/             # Images, icons
```

## 🎨 Customization

### Colors (src/styles/tokens.css)

```css
:root {
  --background: #0B0D10;     /* Page background */
  --surface: #11151B;        /* Cards, inputs */
  --text: #F5F7FA;           /* Primary text */
  --text-muted: rgba(245, 247, 250, 0.65);
  --accent: #B6FF3B;         /* ★ Change this for brand color */
  --accent-rgb: 182, 255, 59; /* ★ RGB values of accent */
  --border: rgba(245, 247, 250, 0.12);
}
```

### Typography

The default font is **Space Grotesk**. To change:

1. Update the Google Fonts link in `index.html`
2. Update `--font-family` in `tokens.css`

### Content

**Personal Info** — Edit directly in `index.html`:
- Name, role, tagline in Hero section
- Bio text in About section
- Social links in Contact section

**Projects** — Edit in `index.html` (Projects section):
- Update project titles, descriptions, tags
- Replace placeholder images
- Edit case study data in `src/js/components/modal.js`

**Services** — Edit in `index.html` (Services section)

### 3D Object (src/js/three/heroScene.js)

The default is an abstract TorusKnot. To change:
- Replace the geometry in `createAbstractShape()`
- Load a custom GLTF model
- Adjust materials and lighting

## 🖼️ Adding Real Images

Replace placeholder images:

1. Add images to `public/images/`
2. Update `index.html` with actual `<img>` tags:
   ```html
   <img src="/images/project-1.jpg" alt="SkyBank Mobile" loading="lazy" />
   ```
3. For lazy loading, use `data-lazy`:
   ```html
   <img data-lazy="/images/project-1.jpg" alt="..." />
   ```

## ⚡ Performance Checklist

- [x] Lazy load images (IntersectionObserver)
- [x] Three.js pauses when not visible
- [x] Limited pixel ratio on mobile (max 2x)
- [x] Code splitting for Three.js and GSAP
- [x] No layout thrash (transforms/opacity only)
- [x] Minimal DOM queries (cached)
- [x] Deferred non-critical JS
- [x] will-change used sparingly

## ♿ Accessibility Checklist

- [x] Semantic HTML (h1→h2→h3 hierarchy)
- [x] Keyboard navigable
- [x] Visible focus rings (`:focus-visible`)
- [x] `prefers-reduced-motion` support
- [x] Modal focus trap
- [x] Form labels and ARIA attributes
- [x] Alt text for images
- [x] Color contrast meets WCAG AA

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

1. Build the project: `npm run build`
2. Drag `dist/` folder to Netlify

### Static Hosting

The `dist/` folder contains static files. Upload to any static host:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Vite | Build tool & dev server |
| GSAP + ScrollTrigger | Animations & scroll effects |
| Lenis | Smooth scrolling |
| Three.js | 3D WebGL graphics |
| Vanilla JS | No framework overhead |

## 📄 License

Free to use for personal portfolios. Attribution appreciated.

---

Built with ❤️ and motion by [Ismail Galdi](https://ismailgaldi.com)
