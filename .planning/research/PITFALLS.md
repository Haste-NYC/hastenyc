# Domain Pitfalls: Premium Scroll-Animated Landing Pages

**Domain:** Premium one-page scrolling websites with advanced scroll animations
**Researched:** 2026-01-20
**Overall Confidence:** HIGH (verified with official documentation and multiple authoritative sources)

## Executive Summary

Premium scroll-animated landing pages face four critical pitfall categories: Performance (jank, dropped frames), Design (over-animation, gimmicky feel), Accessibility (motion sickness, vestibular disorders), and Integration (React Router conflicts, SPA navigation).

**Critical insight from 2026 research:** Landing pages are no longer trying to impress with flashy effects—they prioritize answering questions fast. Only 66.6% of websites meet Core Web Vitals thresholds, and scroll effects are often the metric that breaks first when performance degrades.

**Key risk:** Approximately 35% of adults over 40 experience motion sensitivity. Failing to implement `prefers-reduced-motion` excludes a significant user segment and violates accessibility standards.

---

## Critical Pitfalls

### Pitfall 1: Main Thread Scroll Listeners (Performance Apocalypse)

**What goes wrong:** Attaching scroll event listeners that query DOM position on every scroll event causes catastrophic jank. Scroll events fire dozens to hundreds of times per second, and `getBoundingClientRect()` forces expensive style recalc and layout operations that block the main thread.

**Why it happens:** Developers write intuitive but performance-killing code:
```javascript
// DEADLY PATTERN - DO NOT USE
window.addEventListener('scroll', () => {
  const rect = element.getBoundingClientRect(); // Forces synchronous layout
  element.style.transform = `translateY(${rect.top}px)`; // Repeated writes
});
```

**Consequences:**
- Missed frame budget (16.667ms for 60fps, 8.333ms for 120Hz displays)
- Jank visible to users as stuttering scroll
- High CPU usage, battery drain on mobile
- Complete failure on lower-powered mobile devices
- Core Web Vitals degradation (Interaction to Next Paint fails)

**Prevention:**

1. **Use Intersection Observer API** (runs off main thread):
```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger animation when element enters viewport
      }
    });
  },
  { threshold: 0.1 }
);
```

2. **For scroll-linked animations, use CSS `animation-timeline: scroll()`** (native 2026 standard, runs on compositor thread):
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fade-in linear;
  animation-timeline: scroll();
}
```

3. **If JavaScript required, use passive listeners + throttling:**
```javascript
window.addEventListener('scroll', throttledHandler, { passive: true });
```

4. **GSAP ScrollTrigger** or **Framer Motion scroll** handle this correctly (use library, don't roll your own)

**Detection:**
- Chrome DevTools Performance tab shows long tasks during scroll
- Frame rate drops below 60fps in performance monitor
- "Jank" entries in console when DevTools "Rendering" tab has "Frame Rendering Stats" enabled

**Phase mapping:** Phase 1 (Foundation) must establish scroll architecture. Later refactoring is extremely expensive.

**Sources:**
- [Chrome Speed - Investigating scroll/animation jank](https://chromium.googlesource.com/chromium/src/+/main/docs/speed/debug-janks.md)
- [How to Create Performant Scroll Animations in React](https://www.nray.dev/blog/how-to-create-performant-scroll-animations-in-react/)
- [Firefox Scroll-linked Effects Performance](https://firefox-source-docs.mozilla.org/performance/scroll-linked_effects.html)

---

### Pitfall 2: Animating Non-Compositor Properties

**What goes wrong:** Animating CSS properties other than `transform` and `opacity` forces animations onto the main thread where they compete with JavaScript execution, causing jank and missed frames.

**Why it happens:** Developers animate intuitively obvious properties:
```css
/* WRONG - Forces layout recalculation every frame */
@keyframes slide-in {
  from { left: -100px; }
  to { left: 0; }
}

@keyframes grow {
  from { width: 100px; height: 100px; }
  to { width: 200px; height: 200px; }
}
```

**Consequences:**
- Main thread bottleneck during animation
- Cumulative Layout Shift (CLS) violations (Core Web Vitals failure)
- Visual jank, especially on mobile
- Cannot achieve 60fps on lower-powered devices

**Prevention:**

**Use ONLY these compositor-friendly properties:**
- `transform` (translate, scale, rotate, skew)
- `opacity`

```css
/* CORRECT - GPU accelerated, compositor thread */
@keyframes slide-in {
  from { transform: translateX(-100px); }
  to { transform: translateX(0); }
}

@keyframes grow {
  from { transform: scale(1); }
  to { transform: scale(2); }
}
```

**For parallax effects:**
```css
.parallax {
  transform: translate3d(0, calc(var(--scroll-progress) * -100px), 0);
  /* translate3d forces hardware acceleration */
}

@media (prefers-reduced-motion: reduce) {
  .parallax {
    transform: none; /* Disable for accessibility */
  }
}
```

**Detection:**
- DevTools Performance tab shows purple "Rendering" bars during animation
- "Forced reflow" warnings in console
- CLS score above 0.1 in Lighthouse/Core Web Vitals

**Phase mapping:** Establish in Phase 1 animation architecture. Document allowed properties in design system.

**Sources:**
- [Cumulative Layout Shift (CLS) - Web.dev](https://web.dev/articles/cls)
- [Optimize Cumulative Layout Shift - Web.dev](https://web.dev/articles/optimize-cls)
- [Web Animation Performance Fundamentals](https://www.freecodecamp.org/news/web-animation-performance-fundamentals/)

---

### Pitfall 3: Missing `prefers-reduced-motion` Implementation

**What goes wrong:** Scroll animations trigger vestibular disorders in users with motion sensitivity, causing dizziness, nausea, and headaches. Parallax scrolling is particularly problematic as it mimics real movement that confuses the inner ear.

**Why it happens:**
- Developers don't know about the accessibility requirement
- Assume "reduce motion" means "slow down animations" (WRONG)
- Forget to test with the setting enabled
- Only implement in CSS, ignore JavaScript animations

**Consequences:**
- WCAG 2.1 violation (Success Criterion 2.3.3: Animation from Interactions)
- 35% of adults over 40 experience motion sensitivity—excluding significant user base
- Legal accessibility compliance issues
- Physical harm to users (nausea, dizziness, migraines)

**Prevention:**

**1. CSS Implementation (REQUIRED):**
```css
/* Default: Full animations */
.hero {
  animation: parallax 1s ease-in-out;
  transform: translateY(calc(var(--scroll) * 0.5px));
}

/* User preference: Reduce motion */
@media (prefers-reduced-motion: reduce) {
  .hero {
    animation: none;
    transform: none; /* Disable parallax */
  }

  /* Replace with subtle opacity transitions if needed */
  .hero {
    transition: opacity 0.2s;
  }
}
```

**2. React Hook (REQUIRED for JavaScript animations):**
```javascript
// Custom hook for SSR-safe motion preference detection
function usePrefersReducedMotion() {
  // Default to true for SSR (conservative approach)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Usage with Framer Motion
function Component() {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
      }}
    />
  );
}
```

**3. GSAP Integration:**
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  gsap.to('.element', {
    scrollTrigger: {
      trigger: '.element',
      scrub: true
    },
    x: 100
  });
}
```

**4. Common Mistake - Don't do this:**
```css
/* WRONG - Removes ALL transitions including important UI feedback */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

**Better: Selective reduction**
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable parallax and scroll-triggered animations */
  .parallax, .scroll-animate { animation: none; }

  /* Keep essential UI transitions (form inputs, buttons) */
  .button { transition: background-color 0.2s; }
  .form-input { transition: border-color 0.15s; }
}
```

**Detection:**
- Enable "Reduce Motion" in OS settings (macOS: System Settings > Accessibility > Display)
- Test with setting enabled—animations should be minimal or replaced
- Lighthouse accessibility audit flags missing implementation

**Phase mapping:** Must be in Phase 1. Retrofitting is difficult and often incomplete.

**Sources:**
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [W3C: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Josh Comeau: Accessible Animations in React](https://www.joshwcomeau.com/react/prefers-reduced-motion/)
- [Motion.dev: React Accessibility](https://motion.dev/docs/react-accessibility)

---

### Pitfall 4: React Router Scroll Position Conflicts

**What goes wrong:** When navigating between routes in React Router, the browser maintains scroll position from the previous page instead of scrolling to top. Worse, smooth scroll animations conflict with page transitions, causing visible jumps and disorienting navigation.

**Why it happens:**
- SPAs use `history.pushState` API, so browser doesn't restore scroll natively
- Content renders asynchronously, browser doesn't know page height during navigation
- Scroll animations run during route transition, creating timing conflicts
- ScrollTrigger instances aren't destroyed on unmount in SPAs

**Consequences:**
- User navigates to new page, sees middle of content (confusing)
- Page "jumps" mid-animation during navigation
- ScrollTrigger calculations become stale on subsequent visits
- Memory leaks from undestroyed ScrollTrigger instances

**Prevention:**

**1. React Router `<ScrollRestoration>` Component:**
```javascript
// App.tsx
import { ScrollRestoration } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        {/* Your routes */}
      </Routes>
      <ScrollRestoration
        getKey={(location) => location.pathname}
      />
    </>
  );
}
```

**2. Force Scroll to Top on Route Change:**
```javascript
// Use useLayoutEffect to prevent visible jump
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Use "instant" to avoid conflict with animations
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Add to App.tsx
<ScrollToTop />
<Routes>...</Routes>
```

**3. GSAP ScrollTrigger Cleanup (CRITICAL):**
```javascript
// In component with ScrollTrigger
useEffect(() => {
  // Create ScrollTriggers
  const triggers = gsap.utils.toArray('.animate').map(elem => {
    return ScrollTrigger.create({
      trigger: elem,
      // ... config
    });
  });

  // REQUIRED: Cleanup on unmount
  return () => {
    triggers.forEach(trigger => trigger.kill());
  };
}, []);
```

**4. Framer Motion Page Transitions:**
```javascript
// AnimatePresence for route transitions
import { AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    <Route path="/" element={
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Home />
      </motion.div>
    } />
  </Routes>
</AnimatePresence>
```

**5. Avoid Global Smooth Scroll:**
```css
/* WRONG - Conflicts with React Router navigation */
html {
  scroll-behavior: smooth;
}

/* BETTER - Apply selectively to anchor links only */
a[href^="#"] {
  scroll-behavior: smooth;
}
```

**Detection:**
- Navigate between pages, check if scroll position persists
- Look for "ScrollTrigger not updating" after navigation
- Memory leaks visible in Chrome DevTools Memory profiler

**Phase mapping:** Phase 2 (Navigation Integration) must establish patterns. Every scroll-animated page must follow cleanup protocol.

**Sources:**
- [React Router Scroll Restoration](https://www.dhiwise.com/post/understanding-react-router-scroll-restoration-a-beginners-guide)
- [GSAP ScrollTrigger SPA Issues](https://gsap.com/community/forums/topic/37475-gsap-scrolltrigger-doesnt-run-on-route-change-react-router-v6-route-transition-with-framer-motion/)
- [Fixing Scroll Position in React Router](https://medium.com/@caden0002/fixing-scroll-position-issues-in-react-router-scroll-to-top-on-navigation-86bcfbdfc9db)

---

## Moderate Pitfalls

### Pitfall 5: Over-Animation (Gimmicky Feel)

**What goes wrong:** Excessive motion makes the site feel amateur, distracts from content, and slows down conversions. Landing pages in 2026 are designed for speed and clarity, not to impress with flashy effects.

**Why it happens:**
- Designers discover animation libraries and use every feature
- Confusing "more animation" with "premium feel"
- Not understanding Apple's restraint (they use animation purposefully)
- Lack of testing with real users showing decision fatigue

**Consequences:**
- 7% reduction in conversions per 1-second delay
- Users leave before understanding value proposition
- Brand perceived as unprofessional or gimmicky
- Cognitive overload prevents decision-making

**Prevention:**

**Design Principles:**
1. **One focal point per screen** - Don't animate everything
2. **Purpose over decoration** - Animation guides attention, doesn't demand it
3. **Subtle over spectacular** - Small transitions beat big flourishes
4. **Static is valid** - Not every element needs motion

**Animation Budget:**
- Entrance animations: 2-3 elements max per viewport
- Parallax: 1 background layer only
- Scroll-triggered: Key sections only (hero, CTA, feature highlights)
- Continuous motion: Avoid entirely (battery drain, distraction)

**Apple-inspired restraint:**
- Use scale transforms sparingly (1.0 to 1.05, not 1.0 to 1.5)
- Fade + subtle movement, not dramatic entrances
- Typography animations for emphasis, not decoration
- Product/image reveals, not text block animations

**Testing protocol:**
1. Show to someone unfamiliar with project
2. Ask "What is this page about?" immediately
3. If they can't answer in 5 seconds, reduce animation
4. Track scroll depth—if users bounce before key content, animations are blocking

**Detection:**
- User testing shows confusion or distraction
- Bounce rate high despite traffic quality
- Time to conversion longer than competitor benchmarks
- Heat maps show users not reaching CTAs

**Phase mapping:** Phase 3 (Animation Polish) should include user testing checkpoint before production.

**Sources:**
- [Landing Page Design Trends 2026](https://graphicdesignjunction.com/2026/01/landing-page-design-trends-2026/)
- [Scrolling Effects in Web Design 2026](https://www.digitalsilk.com/digital-trends/scrolling-effects/)
- [Top 20 Animated Landing Page Examples](https://www.svgator.com/blog/animated-landing-pages-examples/)

---

### Pitfall 6: Mobile Performance Degradation

**What goes wrong:** Animations that work smoothly on desktop completely fail on mobile due to weaker hardware, aggressive JavaScript throttling by iOS, and touch interaction conflicts.

**Why it happens:**
- Testing only on desktop or high-end devices
- Not understanding iOS Safari's JavaScript suspension during scroll
- Assuming mobile is just "smaller desktop"
- Ignoring battery impact of continuous animations

**Consequences:**
- Jank and stuttering on mobile (where most users are)
- Animations don't fire at all on iOS during scroll
- Horizontal overflow scroll bars appear unexpectedly
- Battery drain causes device heating
- Core Web Vitals failure on mobile (Google's primary ranking signal)

**Prevention:**

**1. Disable Heavy Animations on Mobile:**
```javascript
const shouldAnimate = window.innerWidth >= 768 &&
                     !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (shouldAnimate) {
  // Initialize scroll animations
}
```

**2. Use CSS Media Queries:**
```css
/* Mobile: no parallax */
.hero {
  background-attachment: scroll;
}

/* Desktop only: enable parallax */
@media (min-width: 768px) {
  .hero {
    background-attachment: fixed;
  }
}
```

**3. Framer Motion Responsive Config:**
```javascript
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{
    duration: window.innerWidth >= 768 ? 0.6 : 0.3,
  }}
/>
```

**4. Horizontal Overflow Fix:**
```css
/* Prevent animations causing horizontal scroll */
body {
  overflow-x: hidden;
}

.animate {
  /* Ensure transforms don't exceed viewport */
  max-width: 100vw;
}
```

**5. Test on Real Devices:**
- iPhone SE (low-powered iOS device)
- Mid-range Android (Samsung Galaxy A series)
- Throttle CPU in Chrome DevTools (4x slowdown)
- Test with battery saver mode enabled

**Detection:**
- Chrome DevTools Device Mode with CPU throttling
- Real device testing shows stuttering
- PageSpeed Insights mobile score significantly lower than desktop
- Users report "laggy" experience on mobile

**Phase mapping:** Phase 1 must establish mobile-first animation strategy. Phase 4 (Mobile Optimization) validates with real devices.

**Sources:**
- [Mobile Scroll Animation Performance](https://www.digitalsilk.com/digital-trends/scrolling-effects/)
- [Smooth Scroll Animations for Mobile](https://medium.com/@hanzla123/how-to-implement-smooth-scroll-animations-for-mobile-devices-efc587b1cca5)
- [Motion UI Trends 2026](https://lomatechnology.com/blog/motion-ui-trends-2026/2911)

---

### Pitfall 7: GSAP ScrollTrigger Common Mistakes

**What goes wrong:** ScrollTrigger is powerful but has specific patterns that break when misused. Nesting ScrollTriggers, animating same properties multiple times, and hardcoded values cause unexpected jumps and calculation errors.

**Why it happens:**
- Library documentation not fully read
- Copying code snippets without understanding
- Timeline + ScrollTrigger interaction misunderstood
- Not accounting for dynamic content

**Consequences:**
- Animations jump instead of smoothly transitioning
- ScrollTrigger positions miscalculated on resize
- Scroll positions don't match animation progress
- Pinned elements cause layout shift
- Memory leaks in SPAs

**Prevention:**

**1. Don't Nest ScrollTriggers in Timeline Tweens:**
```javascript
// WRONG - Conflicting control mechanisms
const tl = gsap.timeline();
tl.to('.elem1', { x: 100, scrollTrigger: { trigger: '.elem1' } });
tl.to('.elem2', { x: 200, scrollTrigger: { trigger: '.elem2' } });

// CORRECT - Apply ScrollTrigger to parent timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});
tl.to('.elem1', { x: 100 });
tl.to('.elem2', { x: 200 });
```

**2. Use Function-Based Values for Responsive:**
```javascript
// WRONG - Hardcoded values don't update on resize
ScrollTrigger.create({
  start: 'top top',
  end: 'bottom+=500', // Fixed value
});

// CORRECT - Function recalculates on refresh
ScrollTrigger.create({
  start: 'top top',
  end: () => `+=${document.querySelector('.section').offsetHeight}`,
  invalidateOnRefresh: true
});
```

**3. Animating Same Property Multiple Times:**
```javascript
// WRONG - Jumps from 100 back to 0, then to 200
gsap.to('.elem', { x: 100, scrollTrigger: { trigger: '.trigger1' } });
gsap.to('.elem', { x: 200, scrollTrigger: { trigger: '.trigger2' } });

// CORRECT - Use fromTo with current value
gsap.to('.elem', { x: 100, scrollTrigger: { trigger: '.trigger1' } });
gsap.fromTo('.elem',
  { x: 100 }, // Starting from previous end value
  { x: 200, scrollTrigger: { trigger: '.trigger2' } }
);
```

**4. Refresh After Dynamic Content:**
```javascript
// After AJAX load or image load
ScrollTrigger.refresh();

// Or wait for images
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
```

**5. React Cleanup:**
```javascript
useEffect(() => {
  const ctx = gsap.context(() => {
    // Create ScrollTriggers here
  });

  // Cleanup all ScrollTriggers in context
  return () => ctx.revert();
}, []);
```

**Detection:**
- Animations jump unexpectedly
- ScrollTrigger markers don't align with elements
- Positions wrong after window resize
- Console warnings about conflicting tweens

**Phase mapping:** Phase 2 (Animation Implementation) must establish ScrollTrigger patterns. Code review required.

**Sources:**
- [ScrollTrigger Tips & Mistakes - Official GSAP](https://gsap.com/resources/st-mistakes/)
- [Most Common ScrollTrigger Mistakes](https://gsap.com/community/st-mistakes/)
- [Problems with ScrollTriggers in ReactJS](https://gsap.com/community/forums/topic/34803-problems-with-scrolltriggers-in-reactjs/)

---

### Pitfall 8: Core Web Vitals Impact

**What goes wrong:** Scroll animations degrade Core Web Vitals metrics (LCP, INP, CLS), harming SEO and user experience. Only 66.6% of websites meet thresholds, and animations are often the breaking point.

**Why it happens:**
- Large images/videos used in scroll animations delay LCP
- JavaScript animation libraries block rendering
- Layout shifts during animation trigger CLS
- Scroll handlers delay input response (INP)

**Consequences:**
- Google search ranking penalty
- Lower visibility in search results
- User perception of "slow" site despite fast server
- Conversion rate impact (users leave before engagement)

**Prevention:**

**1. Optimize LCP (Largest Contentful Paint < 2.5s):**
```html
<!-- Preload critical images -->
<link rel="preload" as="image" href="/hero-image.jpg" fetchpriority="high">

<!-- Use modern formats with fallbacks -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero" loading="eager">
</picture>
```

**2. Optimize INP (Interaction to Next Paint < 200ms):**
```javascript
// Use passive listeners for scroll
window.addEventListener('scroll', handler, { passive: true });

// Debounce/throttle expensive operations
const throttledHandler = throttle(() => {
  // Expensive work
}, 100);

// Use requestAnimationFrame for visual updates
requestAnimationFrame(() => {
  element.style.transform = `translateY(${offset}px)`;
});
```

**3. Optimize CLS (Cumulative Layout Shift < 0.1):**
```css
/* Reserve space for lazy-loaded images */
.image-container {
  aspect-ratio: 16 / 9;
}

/* Only animate transform and opacity */
.animate {
  transform: translateY(50px);
  opacity: 0;
  transition: transform 0.6s, opacity 0.6s;
}

.animate.visible {
  transform: translateY(0);
  opacity: 1;
}
```

**4. Lazy Load Animation Libraries:**
```javascript
// Don't load GSAP until needed
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    import('gsap').then(({ gsap }) => {
      // Initialize animations
    });
    observer.disconnect();
  }
});

observer.observe(document.querySelector('.animated-section'));
```

**5. Monitor Metrics:**
```javascript
// Real User Monitoring
import { onCLS, onINP, onLCP } from 'web-vitals';

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
```

**Detection:**
- PageSpeed Insights shows failing metrics
- Chrome DevTools Lighthouse audit
- Search Console Core Web Vitals report
- Real user monitoring (RUM) data

**Phase mapping:** Phase 1 establishes performance budget. Phase 5 (Optimization) validates metrics before launch.

**Sources:**
- [Core Web Vitals Guide - DebugBear](https://www.debugbear.com/docs/metrics/core-web-vitals)
- [Understanding Core Web Vitals - Google](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Scrolling Effects and Performance 2026](https://www.digitalsilk.com/digital-trends/scrolling-effects/)

---

## Minor Pitfalls

### Pitfall 9: Framer Motion Bundle Size

**What goes wrong:** Framer Motion includes all features in bundle regardless of usage, increasing JavaScript payload by 30-60KB (gzipped), impacting initial page load.

**Why it happens:** Library isn't modular, can't tree-shake unused features.

**Consequences:** Slower initial load, especially on mobile networks.

**Prevention:**
- Code split: Load Framer Motion only for animated routes
- Consider Motion One (lighter alternative, 5KB) for simple animations
- Use CSS animations where possible for above-fold content

**Phase mapping:** Phase 1 architecture decision (GSAP vs Framer Motion).

**Sources:**
- [Framer vs GSAP Comparison](https://pentaclay.com/blog/framer-vs-gsap-which-animation-library-should-you-choose)
- [Migrate from GSAP to Motion](https://motion.dev/docs/migrate-from-gsap-to-motion)

---

### Pitfall 10: Forgetting `will-change` Cleanup

**What goes wrong:** Using `will-change` CSS property to optimize animations but not removing it after animation completes, wasting memory.

**Why it happens:** Developers add `will-change: transform` but forget it reserves resources continuously.

**Consequences:** Increased memory usage, especially with many animated elements.

**Prevention:**
```javascript
element.addEventListener('mouseenter', () => {
  element.style.willChange = 'transform';
});

element.addEventListener('animationend', () => {
  element.style.willChange = 'auto'; // Clean up
});
```

**Phase mapping:** Phase 3 animation implementation code review.

---

## Integration-Specific Pitfalls

### Pitfall 11: Auth Route Scroll Conflicts

**What goes wrong:** Protected routes with scroll animations break when user isn't authenticated—redirect happens mid-animation, causing visual glitches.

**Why it happens:** Auth check runs after component mount, ScrollTrigger initializes before redirect.

**Consequences:** Users see animation start then page suddenly changes.

**Prevention:**
```javascript
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't render animations until auth resolved
  if (isLoading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <AnimatedPage />; // Only renders if authenticated
}
```

**Phase mapping:** Phase 2 when integrating with existing auth.

---

### Pitfall 12: Viewport Units on Mobile Safari

**What goes wrong:** `100vh` on mobile Safari includes address bar height, causing elements to be cut off or overflow when address bar is visible.

**Why it happens:** Safari's dynamic viewport changes as user scrolls and address bar appears/disappears.

**Consequences:** Hero sections cut off, CTAs hidden below fold.

**Prevention:**
```css
/* Use dvh (dynamic viewport height) for mobile Safari */
.hero {
  height: 100dvh; /* Dynamic - excludes address bar */
  min-height: -webkit-fill-available; /* Fallback for older browsers */
}

/* Or use JavaScript */
.hero {
  height: calc(var(--vh, 1vh) * 100);
}
```

```javascript
// Set CSS variable
const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

window.addEventListener('resize', setVH);
setVH();
```

**Phase mapping:** Phase 1 mobile foundation.

---

## Phase-Specific Research Flags

| Phase Topic | Likely Pitfall | Research Needed |
|-------------|----------------|-----------------|
| Phase 1: Foundation | Main thread scroll listeners, compositor properties | Standard patterns, LOW research needed |
| Phase 2: React Router Integration | Scroll restoration, ScrollTrigger cleanup | MEDIUM research needed - test SPA navigation edge cases |
| Phase 3: Accessibility | prefers-reduced-motion implementation | LOW research needed - well-documented standards |
| Phase 4: Mobile Optimization | iOS Safari performance, viewport units | MEDIUM research needed - device-specific testing |
| Phase 5: Performance Audit | Core Web Vitals impact | HIGH research needed - real user monitoring data |
| Phase 6: Animation Polish | Over-animation, user testing | HIGH research needed - user feedback analysis |

---

## Project-Specific Risks

Based on project context (React Router, auth flows, Framer Motion already installed):

**Highest Risk:**
1. **React Router scroll conflicts** - Existing SPA needs careful scroll restoration strategy
2. **Auth redirect timing** - ScrollTrigger initialization must wait for auth resolution
3. **Framer Motion bundle size** - Already installed, but may need code splitting for performance

**Medium Risk:**
4. **Mobile Safari viewport** - Existing landing page may already have issues
5. **prefers-reduced-motion** - Not likely implemented, needs full accessibility pass

**Lower Risk:**
6. **GSAP patterns** - If using Framer Motion instead, less concern
7. **Core Web Vitals** - Can monitor and optimize iteratively

---

## Testing Checklist

Before launch, verify:

- [ ] Scroll animations achieve 60fps on iPhone SE and mid-range Android
- [ ] `prefers-reduced-motion` tested with OS setting enabled
- [ ] React Router navigation scrolls to top, no animation jumps
- [ ] Auth redirects don't show animation flash
- [ ] Mobile Safari viewport height works with/without address bar
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] PageSpeed Insights: 90+ on mobile and desktop
- [ ] No horizontal scroll on mobile (all breakpoints)
- [ ] Animations disabled if JavaScript fails (progressive enhancement)
- [ ] User testing confirms animations guide (not distract) attention

---

## Quick Reference: Do's and Don'ts

**DO:**
- Use Intersection Observer for viewport detection
- Animate only `transform` and `opacity`
- Implement `prefers-reduced-motion` in CSS and JavaScript
- Clean up ScrollTriggers on unmount
- Test on real mobile devices
- Monitor Core Web Vitals continuously

**DON'T:**
- Attach scroll event listeners without throttling/passive
- Animate `width`, `height`, `top`, `left`, or `margin`
- Assume all users want motion (accessibility!)
- Hard-code animation values (use functions for responsive)
- Skip mobile performance testing
- Over-animate—subtle wins over spectacular

---

## Confidence Assessment

| Area | Confidence | Source Quality |
|------|------------|----------------|
| Performance Pitfalls | HIGH | Official Chrome, Firefox docs + verified with Web.dev |
| Accessibility | HIGH | W3C WCAG, MDN, React accessibility experts |
| GSAP ScrollTrigger | HIGH | Official GSAP documentation and community forum |
| React Router Integration | MEDIUM | Community best practices, official React Router docs |
| Mobile Optimization | HIGH | Multiple 2026 sources + mobile browser documentation |
| Design (Over-animation) | MEDIUM | Industry trend analysis, landing page research |
| Core Web Vitals | HIGH | Google official documentation, monitoring tools |

Overall confidence: **HIGH** - Critical pitfalls verified with authoritative sources and official documentation.
