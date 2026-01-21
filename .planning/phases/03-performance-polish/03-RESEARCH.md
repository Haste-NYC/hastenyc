# Phase 3: Performance & Polish - Research

**Researched:** 2026-01-21
**Domain:** Core Web Vitals, bundle optimization, image compression, 60fps animations
**Confidence:** HIGH

## Summary

Phase 3 focuses on achieving production-ready performance: LCP < 2.5s, INP < 200ms, CLS < 0.1, and 60fps scroll animations. The current build analysis reveals several critical issues that must be addressed:

1. **Critical image problem:** `adobe-max-conference.jpg` is 2.94MB - this single file will destroy LCP scores
2. **Bundle size warning:** 745KB main bundle exceeds 500KB threshold - needs code splitting
3. **Font loading:** Google Fonts loaded via external CDN adds latency and potential CLS
4. **No image optimization:** JPG/PNG assets served unoptimized, no WebP/AVIF conversion
5. **Animations already optimized:** Phase 2 established compositor-only properties (transform, opacity)

The path to compliance involves: image optimization with modern formats, bundle splitting with vendor chunks, font self-hosting with preload, and lazy loading below-the-fold content.

**Primary recommendation:** Install `vite-plugin-image-optimizer` with Sharp for automatic WebP/AVIF conversion, implement manual chunks for React/Framer Motion/Radix, and self-host Inter + Space Grotesk fonts with preload hints.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite-plugin-image-optimizer | 1.1.x | Image compression | Uses Sharp.js, supports WebP/AVIF, integrates with Vite build |
| sharp | 0.33.x | Image processing | Industry standard, 4-5x faster than ImageMagick |
| web-vitals | 4.x | CWV measurement | Official Google library, reports LCP/INP/CLS |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| rollup-plugin-visualizer | 5.x | Bundle analysis | Debug bundle size, identify bloat |
| vite-plugin-compression | 0.5.x | Gzip/Brotli | Pre-compress assets for CDN |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vite-plugin-image-optimizer | vite-plugin-imagemin | imagemin is deprecated, Sharp is actively maintained |
| Self-host fonts | Google Fonts CDN | CDN adds extra DNS lookup, can't preload effectively |
| Manual chunks | Auto splitting | Manual gives precise control over cache boundaries |

**Installation:**
```bash
npm install -D vite-plugin-image-optimizer sharp rollup-plugin-visualizer
npm install web-vitals
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/
│   ├── images/           # Source images (will be optimized at build)
│   └── fonts/            # Self-hosted woff2 files
├── components/
│   └── OptimizedImage.tsx  # Wrapper with loading="lazy" + dimensions
└── lib/
    └── webVitals.ts      # CWV reporting setup
```

### Pattern 1: Vite Image Optimization Config
**What:** Automatic WebP/AVIF conversion during build
**When to use:** Always - reduces image sizes by 50-95%
**Example:**
```typescript
// vite.config.ts
// Source: https://github.com/FatehAK/vite-plugin-image-optimizer
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80, lossless: false },
      avif: { quality: 65, lossless: false },
    }),
  ],
});
```

### Pattern 2: Manual Chunk Splitting
**What:** Separate vendor libraries into cacheable chunks
**When to use:** When bundle > 500KB, or for long-term caching
**Example:**
```typescript
// vite.config.ts
// Source: https://vite.dev/config/build-options
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion', 'lenis'],
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            // Only include Radix components actually used
          ],
        },
      },
    },
  },
});
```

### Pattern 3: Font Self-Hosting with Preload
**What:** Self-host fonts and preload critical weights
**When to use:** Always for predictable LCP and zero CLS from font swap
**Example:**
```html
<!-- index.html -->
<!-- Source: https://web.dev/articles/font-best-practices -->
<head>
  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/space-grotesk-var.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Inline critical font-face (avoids render-blocking CSS) -->
  <style>
    @font-face {
      font-family: 'Inter';
      src: url('/fonts/inter-var.woff2') format('woff2');
      font-weight: 100 900;
      font-display: swap;
      font-style: normal;
    }
    @font-face {
      font-family: 'Space Grotesk';
      src: url('/fonts/space-grotesk-var.woff2') format('woff2');
      font-weight: 300 700;
      font-display: swap;
      font-style: normal;
    }
  </style>
</head>
```

### Pattern 4: LCP Image Prioritization
**What:** Mark hero image as high priority, lazy load others
**When to use:** The largest visible element should load first
**Example:**
```tsx
// HeroSection.tsx
// Source: https://web.dev/articles/optimize-lcp

// LCP image - high priority, no lazy loading
<img
  src={heroImage}
  alt="Hero"
  width={1200}
  height={675}
  fetchPriority="high"
  decoding="async"
/>

// Below-fold images - lazy loaded
<img
  src={featureImage}
  alt="Feature"
  width={800}
  height={450}
  loading="lazy"
  decoding="async"
/>
```

### Pattern 5: Web Vitals Monitoring
**What:** Report CWV metrics to analytics
**When to use:** Production monitoring for real-user metrics
**Example:**
```typescript
// src/lib/webVitals.ts
// Source: https://github.com/GoogleChrome/web-vitals
import { onCLS, onINP, onLCP } from 'web-vitals';

export function reportWebVitals() {
  onCLS((metric) => {
    console.log('CLS:', metric.value);
    // Send to analytics: gtag, mixpanel, etc.
  });

  onINP((metric) => {
    console.log('INP:', metric.value);
  });

  onLCP((metric) => {
    console.log('LCP:', metric.value);
  });
}
```

### Anti-Patterns to Avoid
- **Lazy loading LCP image:** Never use `loading="lazy"` on the hero/LCP element - guarantees poor LCP
- **Over-preloading:** Max 2-3 preload hints - more congests bandwidth
- **Missing image dimensions:** Always set width/height to prevent CLS
- **Animating layout properties:** Never animate width/height/margin - causes reflow, kills 60fps
- **Third-party font services:** Google Fonts CDN adds extra connection, unpredictable latency

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Manual Sharp scripts | vite-plugin-image-optimizer | Integrates with build, handles all formats |
| WebP/AVIF fallbacks | Custom picture elements | Plugin generates formats automatically | Edge cases in format detection |
| Bundle analysis | Manual size checks | rollup-plugin-visualizer | Visual treemap, identifies exact bloat |
| CWV measurement | Custom performance API | web-vitals library | Handles edge cases, official Google library |
| Font loading | Manual @font-face | fontsource or self-host template | Subsetting, variable fonts, preload |

**Key insight:** Performance optimization has many edge cases (browser quirks, format support, timing). Libraries handle these; custom solutions miss cases.

## Common Pitfalls

### Pitfall 1: Large Unoptimized Images
**What goes wrong:** 2.94MB hero image causes 5+ second LCP
**Why it happens:** Source images used directly without compression
**How to avoid:**
- Convert to WebP/AVIF (90%+ size reduction)
- Resize to max display size (e.g., 1920px width)
- Use `<picture>` for format fallbacks
**Warning signs:** Lighthouse flags "Serve images in next-gen formats"

### Pitfall 2: Render-Blocking Google Fonts
**What goes wrong:** Font request blocks initial render, causes FOUT/CLS
**Why it happens:** External CSS blocks rendering while fonts download
**How to avoid:**
- Self-host fonts with `font-display: swap`
- Preload critical fonts
- Use system font stack as fallback with matching metrics
**Warning signs:** Lighthouse flags "Eliminate render-blocking resources"

### Pitfall 3: Monolithic JavaScript Bundle
**What goes wrong:** 745KB bundle delays interactivity
**Why it happens:** All code in single chunk, no code splitting
**How to avoid:**
- Split vendor chunks (react, motion, radix)
- Use dynamic imports for below-fold components
- Remove unused dependencies (audit Radix components)
**Warning signs:** Vite warning "chunks larger than 500KB"

### Pitfall 4: Layout Shift from Images Without Dimensions
**What goes wrong:** Content jumps as images load
**Why it happens:** Browser doesn't know image size until loaded
**How to avoid:**
- Always set width and height attributes
- Use aspect-ratio CSS for responsive images
- Reserve space with skeleton/placeholder
**Warning signs:** CLS score > 0.1, visible "jump" during load

### Pitfall 5: Over-Animating on Mobile
**What goes wrong:** Choppy scroll, battery drain, poor INP
**Why it happens:** Mobile GPUs less powerful, touch events throttled
**How to avoid:**
- Phase 2 already disables parallax on mobile
- Use `viewport={{ once: true }}` for scroll animations
- Test on real devices, not just Chrome DevTools
**Warning signs:** Frame drops below 60fps on mid-range devices

## Code Examples

Verified patterns from official sources:

### Complete Vite Config for Performance
```typescript
// vite.config.ts
// Source: https://vite.dev/config/build-options
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 65 },
    }),
    mode === 'production' && visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
    }),
  ].filter(Boolean),
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion', 'lenis'],
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
          ],
        },
      },
    },
  },
}));
```

### Optimized Image Component
```tsx
// src/components/OptimizedImage.tsx
// Source: https://web.dev/articles/optimize-lcp
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? undefined : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={className}
    />
  );
}
```

### Font Self-Hosting Setup
```css
/* src/styles/fonts.css */
/* Source: https://web.dev/articles/font-best-practices */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
    U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/space-grotesk-var.woff2') format('woff2');
  font-weight: 300 700;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
    U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Fonts CDN | Self-hosted fonts | 2023+ | Better LCP, privacy compliance |
| JPEG/PNG only | WebP primary, AVIF where supported | 2022+ | 50-95% size reduction |
| FID metric | INP metric | March 2024 | Measures all interactions, not just first |
| Single bundle | Manual chunks | Vite 4+ | Better caching, smaller initial load |
| imagemin | Sharp | 2023+ | imagemin deprecated, Sharp actively maintained |

**Deprecated/outdated:**
- `imagemin`: No longer maintained, use Sharp-based solutions
- `FID (First Input Delay)`: Replaced by INP as Core Web Vital in March 2024
- `preact-signals` for React: Not recommended, React 19 compiler handles optimization
- `next/font` outside Next.js: Use manual self-hosting for Vite projects

## Current State Analysis

### Build Output (Current)
```
dist/assets/adobe-max-conference.jpg     2,940.05 kB  // CRITICAL: 2.94MB image
dist/assets/index.js                       745.47 kB  // WARNING: > 500KB
dist/assets/index.css                       77.52 kB  // OK
```

### Expected After Optimization
```
dist/assets/adobe-max-conference.webp      ~100 kB   // 97% reduction
dist/assets/vendor-react.js                ~150 kB   // Cacheable
dist/assets/vendor-motion.js               ~120 kB   // Cacheable
dist/assets/vendor-ui.js                    ~80 kB   // Cacheable
dist/assets/index.js                       ~200 kB   // App code only
dist/assets/index.css                       ~60 kB   // Purged unused
```

### Dependencies to Audit
The project has 25+ Radix UI components installed but likely uses only:
- `@radix-ui/react-accordion` (FAQ section)
- `@radix-ui/react-dialog` (mobile menu)
- `@radix-ui/react-dropdown-menu` (possibly)
- `@radix-ui/react-toast` (notifications)

Unused Radix components add ~20-50KB each to bundle. Recommend auditing and removing unused.

## Open Questions

Things that couldn't be fully resolved:

1. **Exact LCP element identification**
   - What we know: Likely the hero logo image (`conform-studio-logo.png` at 35KB)
   - What's unclear: Need Lighthouse audit to confirm
   - Recommendation: Run Lighthouse after implementation to verify

2. **Font subsetting requirements**
   - What we know: Inter + Space Grotesk are used, Latin characters only
   - What's unclear: Exact glyphs needed
   - Recommendation: Use Google Fonts helper to download subset woff2

3. **Third-party script impact (GA4)**
   - What we know: Google Analytics 4 script in index.html
   - What's unclear: INP impact from gtag calls
   - Recommendation: Measure INP before/after, consider `requestIdleCallback` for analytics

## Sources

### Primary (HIGH confidence)
- [Vite Build Options](https://vite.dev/config/build-options) - Official build configuration
- [web.dev Optimize LCP](https://web.dev/articles/optimize-lcp) - Google's LCP optimization guide
- [web.dev Font Best Practices](https://web.dev/articles/font-best-practices) - Font loading strategies
- [vite-plugin-image-optimizer](https://github.com/FatehAK/vite-plugin-image-optimizer) - Sharp-based image optimization
- [Motion.dev Performance](https://motion.dev/docs/performance) - Framer Motion GPU acceleration

### Secondary (MEDIUM confidence)
- [Self-host Google Fonts](https://www.corewebvitals.io/pagespeed/self-host-google-fonts) - Font self-hosting benefits
- [Optimize INP](https://web.dev/articles/optimize-inp) - INP optimization strategies
- [Optimize CLS](https://web.dev/articles/optimize-cls) - Layout shift prevention

### Tertiary (LOW confidence)
- Bundle analysis reports from vite-bundle-visualizer
- WebSearch results for current best practices (2026)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Vite docs, active libraries
- Architecture: HIGH - Patterns from web.dev, verified with official docs
- Pitfalls: HIGH - Based on current build analysis and established best practices
- Expected results: MEDIUM - Projections based on typical optimization gains

**Research date:** 2026-01-21
**Valid until:** 2026-02-21 (Core Web Vitals thresholds stable, tooling may update)
