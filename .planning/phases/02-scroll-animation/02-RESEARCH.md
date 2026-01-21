# Phase 2: Scroll & Animation - Research

**Researched:** 2026-01-20
**Domain:** Scroll-driven animations, smooth scrolling, accessibility
**Confidence:** HIGH

## Summary

Phase 2 transforms the static Phase 1 foundation into a premium scroll-driven experience. The project already uses Framer Motion extensively (HeroSection, FeatureSection, AboutSection, FAQSection all use `motion` components with `whileInView`), so the animation infrastructure is in place. The key additions are:

1. **Lenis smooth scroll** - Replaces native CSS smooth scroll with buttery-smooth momentum scrolling
2. **Active section tracking** - Intersection Observer-based scroll spy for nav highlighting
3. **Enhanced animations** - Staggered reveals, parallax effects, and accordion improvements
4. **Accessibility** - `prefers-reduced-motion` support via Framer Motion's built-in APIs
5. **Performance** - 60fps guaranteed via compositor-only properties (transform, opacity)

**Primary recommendation:** Use Lenis for smooth scroll (integrates cleanly with existing Framer Motion), implement scroll spy with native Intersection Observer (no additional library needed), and leverage Framer Motion's `MotionConfig` with `reducedMotion="user"` for accessibility.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lenis | 1.1.x | Smooth scroll | Industry standard from darkroom.engineering, used by major studios |
| framer-motion | 12.x | Animations | Already installed (12.23.26), provides scroll hooks and motion values |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-intersection-observer | 9.x | Scroll spy alternative | Only if native API feels too verbose |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Lenis | Locomotive Scroll | Lenis is lighter, better React support, more active development |
| Lenis | Native CSS only | Native lacks momentum/inertia feel, Lenis adds "premium" touch |
| Custom scroll spy | react-scrollspy | Custom is simpler for 4 sections, avoids bundle bloat |

**Installation:**
```bash
npm install lenis
```

Note: `lenis/react` is included in the main package - no separate installation needed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── SmoothScrollProvider.tsx    # Lenis wrapper at app root
│   └── Header.tsx                  # Enhanced with active section state
├── hooks/
│   └── useActiveSection.ts         # Intersection Observer scroll spy
└── lib/
    └── motion.ts                   # Shared animation variants
```

### Pattern 1: Lenis Provider Setup
**What:** Wrap app root in ReactLenis for global smooth scroll
**When to use:** Always - single integration point for smooth scrolling
**Example:**
```typescript
// Source: https://github.com/darkroomengineering/lenis
import { ReactLenis } from 'lenis/react';

function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,           // Smooth interpolation (0-1, lower = smoother)
        duration: 1.2,       // Animation duration when not using lerp
        smoothWheel: true,   // Smooth mouse wheel
        syncTouch: false,    // iOS can be unstable with this
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

### Pattern 2: Scroll Spy with Intersection Observer
**What:** Track which section is currently visible for nav highlighting
**When to use:** For active nav highlighting requirement (NAV-06)
**Example:**
```typescript
// Source: https://blog.maximeheckel.com/posts/scrollspy-demystified/
import { useState, useEffect, useRef } from 'react';

const sectionIds = ['hero', 'features', 'about', 'faq', 'pricing'];

function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -50% 0px', // Account for fixed header (80px)
        threshold: 0
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return activeSection;
}
```

### Pattern 3: Staggered Fade-In Variants
**What:** Parent-child variant pattern for staggered reveals
**When to use:** Feature sections, list items, any grouped content
**Example:**
```typescript
// Source: https://motion.dev/docs/stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

// Usage with whileInView
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Pattern 4: Parallax with useScroll + useTransform
**What:** Scroll-linked background movement for depth effect
**When to use:** Hero section background (desktop only per requirements)
**Example:**
```typescript
// Source: https://blog.olivierlarose.com/tutorials/background-image-parallax
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function HeroWithParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"] // Track from top to when it leaves
  });

  // Move background slower than scroll (0.3 = 30% of scroll speed)
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Gradient background */}
      </motion.div>
      {/* Content */}
    </section>
  );
}
```

### Pattern 5: Reduced Motion Configuration
**What:** Respect user's motion preferences at app level
**When to use:** Always - wrap entire app for TECH-03 requirement
**Example:**
```typescript
// Source: https://motion.dev/docs/react-accessibility
import { MotionConfig } from 'framer-motion';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        {/* App content */}
      </SmoothScrollProvider>
    </MotionConfig>
  );
}
```

With `reducedMotion="user"`:
- Transform and layout animations are disabled when preference is set
- Opacity and color animations still work (non-vestibular)
- Users who haven't set a preference see full animations

### Anti-Patterns to Avoid
- **Scroll jacking:** Never override scroll behavior in ways that feel unnatural. Lenis enhances, doesn't hijack.
- **Animating layout properties:** Never animate `height`, `width`, `left`, `top` - causes layout thrashing, kills 60fps.
- **Over-using will-change:** Don't add to every element - causes memory bloat. Only use on elements that WILL animate.
- **Forgetting exit animations:** With Radix Accordion, you must use `data-state` attributes for CSS or `forceMount` for Framer Motion.
- **Motion on mobile touch:** Lenis `syncTouch: true` can be unstable on iOS < 16. Avoid unless tested thoroughly.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scroll | Custom RAF loop | Lenis | Handles wheel, touch, keyboard, resize, edge cases |
| Scroll spy | Manual scroll listener | Intersection Observer | Async, performant, no scroll jank |
| Staggered animations | setTimeout loops | Framer Motion variants | Handles timing, spring physics, interruptions |
| Reduced motion | Manual matchMedia | MotionConfig | Built-in, SSR-safe, cascades to all children |
| Parallax | Manual scroll math | useScroll + useTransform | Handles all edge cases, spring interpolation |

**Key insight:** All these problems have edge cases (resize, orientation change, rapid state changes) that libraries handle. Custom solutions inevitably miss cases.

## Common Pitfalls

### Pitfall 1: Lenis + Native Scroll Conflict
**What goes wrong:** Calling `window.scrollTo()` bypasses Lenis, causing jarring jumps
**Why it happens:** Existing code uses native scroll (Header.tsx, HeroSection.tsx)
**How to avoid:** Use `lenis.scrollTo()` method instead via useLenis hook
**Warning signs:** Smooth scroll works but anchor links jump

```typescript
// WRONG - bypasses Lenis
window.scrollTo({ top: offset, behavior: 'smooth' });

// RIGHT - uses Lenis
import { useLenis } from 'lenis/react';

const lenis = useLenis();
lenis?.scrollTo('#section', { offset: -80 }); // Negative offset for header
```

### Pitfall 2: Intersection Observer Threshold Misconfiguration
**What goes wrong:** Multiple sections trigger active state simultaneously, or wrong section highlighted
**Why it happens:** Threshold and rootMargin not tuned for fixed header
**How to avoid:** Use `-80px 0px -50% 0px` rootMargin (80px header, bottom half threshold)
**Warning signs:** Active state flickers or highlights wrong section near boundaries

### Pitfall 3: Accordion Height Animation Jank
**What goes wrong:** Content clips or height jumps instead of smooth expand
**Why it happens:** Radix uses CSS variables for height, not Framer Motion
**How to avoid:** Current Shadcn accordion uses CSS animations with `--radix-accordion-content-height`. This already works. For smoother easing, update `tailwind.config.ts` animation duration/easing, don't try to replace with Framer Motion.
**Warning signs:** Content visible before container expands, jumpy animation

### Pitfall 4: Parallax on Mobile
**What goes wrong:** Janky parallax, battery drain, poor touch response
**Why it happens:** Mobile browsers throttle scroll events, GPU less powerful
**How to avoid:** Disable parallax on mobile with media query or hook
**Warning signs:** Choppy scroll on mobile devices

```typescript
const isMobile = useMediaQuery('(max-width: 768px)');
const y = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '30%']);
```

### Pitfall 5: Performance with Many Animated Elements
**What goes wrong:** Dropped frames, scroll lag when multiple sections animate
**Why it happens:** Too many elements animating simultaneously
**How to avoid:** Use `viewport={{ once: true }}` so elements only animate once
**Warning signs:** FPS drops below 60 when scrolling through page

## Code Examples

Verified patterns from official sources:

### Lenis Scroll To Section (with header offset)
```typescript
// Source: https://github.com/darkroomengineering/lenis
import { useLenis } from 'lenis/react';

const Header = () => {
  const lenis = useLenis();

  const scrollToSection = (id: string) => {
    lenis?.scrollTo(`#${id}`, {
      offset: -80,  // Header height
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Expo out
    });
  };

  return (
    <nav>
      <a onClick={() => scrollToSection('features')}>Features</a>
    </nav>
  );
};
```

### Hero Fade-In Animation
```typescript
// Source: https://motion.dev/docs/react-animation
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] // Cubic bezier for premium feel
    }
  },
};

// Usage - animates on page load
<motion.div
  initial="hidden"
  animate="visible"
  variants={heroVariants}
>
```

### Pricing Card Hover States
```typescript
// Source: Existing pattern, enhanced with Framer Motion
const PricingCard = ({ tier }) => {
  return (
    <motion.div
      whileHover={{
        y: -4,  // Subtle lift
        transition: { duration: 0.2 }
      }}
      className="transition-shadow hover:shadow-lg hover:shadow-purple-500/10"
    >
      <Card>...</Card>
    </motion.div>
  );
};
```

### Accordion with Enhanced Animation
```css
/* Source: https://www.radix-ui.com/primitives/docs/guides/animation */
/* Update tailwind.config.ts keyframes for smoother accordion */
keyframes: {
  "accordion-down": {
    from: { height: "0", opacity: "0" },
    to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
    to: { height: "0", opacity: "0" },
  },
},
animation: {
  "accordion-down": "accordion-down 0.3s cubic-bezier(0.87, 0, 0.13, 1)",
  "accordion-up": "accordion-up 0.3s cubic-bezier(0.87, 0, 0.13, 1)",
},
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| useViewportScroll | useScroll | Framer Motion v6 | New API, easier integration |
| Locomotive Scroll | Lenis | 2022-2023 | Lighter, better maintained |
| react-scroll | Native + Lenis | 2023+ | No dependencies, better UX |
| Manual matchMedia | MotionConfig reducedMotion | Framer Motion v10 | Automatic, SSR-safe |

**Deprecated/outdated:**
- `useViewportScroll`: Replaced by `useScroll` in Framer Motion v6+
- `@studio-freight/lenis`: Now just `lenis` - package renamed
- `@studio-freight/react-lenis`: Now `lenis/react` - subpath export

## Open Questions

Things that couldn't be fully resolved:

1. **Lenis + Radix ScrollArea interaction**
   - What we know: Both try to control scroll behavior
   - What's unclear: Potential conflicts if ScrollArea used inside Lenis root
   - Recommendation: Test if any components use ScrollArea; may need to exclude from Lenis

2. **Safari 60fps cap**
   - What we know: Lenis docs mention Safari caps at 60fps (not 120fps like other browsers)
   - What's unclear: Impact on perceived smoothness
   - Recommendation: Accept limitation, 60fps is still "buttery smooth"

3. **iOS Safari < 16 touch issues**
   - What we know: Lenis `syncTouch` can be unstable on older iOS
   - What's unclear: User base iOS version distribution
   - Recommendation: Keep `syncTouch: false` (default) for stability

## Sources

### Primary (HIGH confidence)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) - Installation, API, React integration
- [Motion.dev docs](https://motion.dev/docs) - useScroll, stagger, accessibility
- [Radix UI Animation Guide](https://www.radix-ui.com/primitives/docs/guides/animation) - Accordion patterns

### Secondary (MEDIUM confidence)
- [Scroll Spy with Intersection Observer](https://blog.maximeheckel.com/posts/scrollspy-demystified/) - Implementation pattern
- [Background Parallax Tutorial](https://blog.olivierlarose.com/tutorials/background-image-parallax) - useTransform pattern
- [web.dev Animation Performance](https://web.dev/animations-and-performance/) - 60fps guidelines

### Tertiary (LOW confidence)
- Various Medium/Dev.to articles for implementation patterns - cross-verified with official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Lenis and Framer Motion are well-documented, already in use
- Architecture: HIGH - Patterns verified with official docs
- Pitfalls: MEDIUM - Some based on community reports, not direct testing
- Parallax on mobile: MEDIUM - General best practice, needs device testing

**Research date:** 2026-01-20
**Valid until:** 2026-02-20 (stable libraries, patterns unlikely to change)
