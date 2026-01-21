# Architecture Patterns: Premium Scroll-Animated Landing Pages

**Domain:** Single-page scroll-animated landing pages
**Researched:** 2026-01-20
**Confidence:** HIGH

## Executive Summary

Premium scroll-animated landing pages in 2026 follow a component-based architecture with three core systems: **Section Components** (content), **Scroll Manager** (position tracking), and **Animation Orchestrator** (visual effects). The architecture analyzed from superconscious-app.webflow.io and current React patterns reveals a layered approach where scroll position drives animation state through well-defined boundaries.

**Key architectural decision:** Use Framer Motion (already installed) as the primary animation library with native Intersection Observer for visibility detection. GSAP ScrollTrigger is more powerful but has steeper learning curve; Framer Motion integrates naturally with existing React patterns in this codebase.

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    App/Page Layer                        │
│  - Layout container (Index.tsx)                          │
│  - Fixed header with nav links                           │
│  - Section mounting points                               │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│ Scroll       │  │ Section          │
│ Manager      │  │ Components       │
│              │  │                  │
│ - Position   │─▶│ - OverviewSection│
│ - Active ID  │  │ - FeaturesSection│
│ - Direction  │  │ - AboutSection   │
└──────┬───────┘  │ - FAQSection     │
       │          │ - PricingSection │
       │          └────────┬─────────┘
       │                   │
       └──────────┬────────┘
                  ▼
       ┌──────────────────┐
       │ Animation        │
       │ Orchestrator     │
       │                  │
       │ - Scroll triggers│
       │ - View triggers  │
       │ - Variants       │
       └──────────────────┘
```

### Data Flow

```
User Scrolls
    │
    ▼
Scroll Event (passive listener)
    │
    ▼
requestAnimationFrame batches update
    │
    ▼
Scroll Manager updates position state
    │
    ├─▶ Header: Updates active nav link
    │
    └─▶ Section Components: Trigger animations via Intersection Observer
            │
            ▼
        Animation Orchestrator applies motion variants
```

## Component Structure

### 1. App/Page Layer

**File:** `src/pages/ScrollLandingPage.tsx` (new)

**Responsibility:**
- Render fixed header with section nav links
- Mount section components in order
- Provide scroll context to children
- Apply CSS scroll-behavior or scroll-snap if needed

**Example Structure:**
```tsx
<ScrollProvider>
  <FixedHeader sections={sections} />
  <main>
    <OverviewSection id="overview" />
    <FeaturesSection id="features" />
    <AboutSection id="about" />
    <FAQSection id="faq" />
    <PricingSection id="pricing" />
  </main>
  <Footer />
</ScrollProvider>
```

**Communicates with:**
- ScrollProvider (provides scroll state)
- Header (consumes active section)
- Section components (mount points)

---

### 2. Scroll Manager

**Files:**
- `src/contexts/ScrollContext.tsx` (new)
- `src/hooks/useScrollPosition.ts` (new)
- `src/hooks/useActiveSection.ts` (new)

**Responsibility:**
- Track current scroll position
- Determine active section based on viewport position
- Provide scroll direction (up/down)
- Handle smooth scroll navigation to sections

**Key Pattern:**
Use `useRef` for scroll position (avoid re-render thrashing) and `useState` for active section ID (triggers nav updates).

**Performance Strategy:**
```tsx
// Passive listener + requestAnimationFrame throttling
useEffect(() => {
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollPosition();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**State Shape:**
```tsx
interface ScrollState {
  scrollY: number;
  direction: 'up' | 'down' | null;
  activeSection: string;
  scrollToSection: (id: string) => void;
}
```

**Communicates with:**
- Header (provides activeSection)
- Section components (receives section registration)

---

### 3. Section Components

**Files:**
- `src/components/sections/OverviewSection.tsx` (new)
- `src/components/sections/FeaturesSection.tsx` (new)
- `src/components/sections/AboutSection.tsx` (new)
- `src/components/sections/FAQSection.tsx` (new)
- `src/components/sections/PricingSection.tsx` (new)

**Responsibility:**
- Render section content
- Register with Scroll Manager (for active detection)
- Trigger animations when in viewport
- Provide scroll anchor point

**Common Pattern:**
```tsx
const OverviewSection = ({ id }: { id: string }) => {
  const ref = useRef<HTMLElement>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  return (
    <motion.section
      id={id}
      ref={mergeRefs([ref, inViewRef])}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      {/* Content */}
    </motion.section>
  );
};
```

**Communicates with:**
- Scroll Manager (registers for active detection)
- Animation Orchestrator (applies variants)

---

### 4. Animation Orchestrator

**Files:**
- `src/animations/scrollVariants.ts` (new)
- `src/animations/animationConfig.ts` (new)

**Responsibility:**
- Define animation variants for different states
- Provide timing/easing configurations
- Export reusable animation patterns

**Pattern Library:**

Based on superconscious-app.webflow.io analysis, common patterns include:

```tsx
// View-triggered fade + scale
export const fadeScale = {
  hidden: {
    opacity: 0,
    scale: 0.6,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1] // cubic-bezier from superconscious
    }
  }
};

// Scroll-linked parallax (for hero backgrounds)
export const parallaxY = {
  initial: { y: 0 },
  scroll: { y: '-24rem' } // shifts during scroll
};

// Staggered children (for feature cards)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};
```

**Communicates with:**
- Section components (consumed as props)

---

### 5. Fixed Header with Navigation

**File:** `src/components/FixedHeader.tsx` (modify existing Header.tsx)

**Responsibility:**
- Render logo and navigation links
- Highlight active section link
- Handle smooth scroll to section on click
- Remain fixed during scroll

**Pattern:**
```tsx
const FixedHeader = ({ sections }: { sections: SectionConfig[] }) => {
  const { activeSection, scrollToSection } = useScrollContext();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur">
      <nav>
        <Logo />
        <ul>
          {sections.map(section => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={activeSection === section.id ? 'active' : ''}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
```

**Communicates with:**
- Scroll Manager (consumes activeSection, calls scrollToSection)

---

## Scroll Position Tracking

### Approach 1: Intersection Observer (Recommended)

**Why:** Native browser API, runs off main thread, excellent performance, no manual scroll math.

**Pattern:**
```tsx
// In each section component
import { useInView } from 'react-intersection-observer';

const { ref, inView } = useInView({
  threshold: 0.3, // 30% visible
  triggerOnce: false, // re-trigger when scrolling back
  onChange: (inView, entry) => {
    if (inView) {
      // Notify scroll manager this section is active
      setActiveSection(entry.target.id);
    }
  }
});
```

**Library:** Use `react-intersection-observer` (need to install) or implement custom hook with native Intersection Observer API.

**Benefits:**
- No scroll event listeners needed for visibility
- Efficient (runs off main thread)
- Declarative per-component

---

### Approach 2: Scroll Event + Position Calculation

**Why:** Needed for effects that change continuously during scroll (parallax, progress bars).

**Pattern:**
```tsx
const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  const directionRef = useRef<'up' | 'down' | null>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      const currentScroll = window.scrollY;

      // Determine direction
      if (currentScroll > lastScrollRef.current) {
        directionRef.current = 'down';
      } else if (currentScroll < lastScrollRef.current) {
        directionRef.current = 'up';
      }

      lastScrollRef.current = currentScroll;
      setScrollY(currentScroll);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, direction: directionRef.current };
};
```

**Performance Notes:**
- Always use `{ passive: true }` for scroll listeners
- Batch updates with requestAnimationFrame (limits to 60fps max)
- Use `useRef` for values that don't need to trigger renders

---

## Animation Orchestration Patterns

### Pattern 1: View-Triggered Animations (Most Common)

**Use case:** Fade in section content when it enters viewport.

**Implementation:**
```tsx
<motion.div
  initial="hidden"
  animate={inView ? "visible" : "hidden"}
  variants={fadeScale}
>
  {content}
</motion.div>
```

**Benefits:**
- Simple, declarative
- Works with Intersection Observer
- Good performance (no continuous scroll tracking)

**When to use:** 95% of section content (text, images, cards)

---

### Pattern 2: Scroll-Linked Animation (Sparingly)

**Use case:** Background parallax, progress indicators that change continuously.

**Implementation:**
```tsx
import { useScroll, useTransform, motion } from 'framer-motion';

const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

<motion.div style={{ y }}>
  {background}
</motion.div>
```

**Performance cost:** Higher (continuously updates during scroll).

**When to use:**
- Hero background parallax
- Scroll progress indicators
- Special "wow" moments (1-2 per page max)

**2026 Design Philosophy:** Use sparingly. Per research, "constant motion is avoided" in modern premium landing pages.

---

### Pattern 3: Staggered Children

**Use case:** Animating lists (features, FAQ items) with sequential timing.

**Implementation:**
```tsx
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate={inView ? "visible" : "hidden"}
>
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**When to use:** Feature grids, FAQ accordions, testimonial lists

---

## Smooth Scroll Navigation

### CSS-First Approach (Recommended)

**Why:** Zero JavaScript, excellent browser support in 2026, performant.

```css
html {
  scroll-behavior: smooth;
}
```

**Click handler:**
```tsx
const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};
```

**Benefits:**
- Native browser optimization
- Works without JavaScript
- Respects user prefers-reduced-motion

**Polyfill:** If targeting older browsers, use `smoothscroll-polyfill` (but likely unnecessary in 2026).

---

### JavaScript Library Approach (If More Control Needed)

**Library:** react-scroll or custom implementation

```tsx
import { scroller } from 'react-scroll';

const scrollToSection = (id: string) => {
  scroller.scrollTo(id, {
    duration: 800,
    smooth: 'easeInOutQuart',
    offset: -80 // account for fixed header
  });
};
```

**When to use:**
- Need custom easing
- Need precise offset control for fixed header
- Need callbacks (onComplete, onCancel)

---

## Optional: CSS Scroll Snap

**Use case:** Enforce full-screen sections that "snap" into place.

```css
.scroll-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
}

.section {
  scroll-snap-align: start;
  min-height: 100vh;
}
```

**Trade-offs:**
- **PRO:** Very smooth, native behavior
- **CON:** Users lose fine-grained scroll control
- **CON:** Can feel jarring on mobile

**Recommendation:** Don't use for your use case. Research shows 2026 trend is toward "clear visual chapters" but user-controlled scrolling. Scroll snap removes user control.

---

## Performance Optimization

### 1. Lazy Load Heavy Content

```tsx
// Don't mount all sections immediately if they contain heavy content
const FeaturesSection = lazy(() => import('./sections/FeaturesSection'));

<Suspense fallback={<SectionSkeleton />}>
  <FeaturesSection />
</Suspense>
```

**When to use:** Sections with video, heavy images, or complex animations.

---

### 2. Use will-change Sparingly

```css
/* Only on elements actively animating */
.animating {
  will-change: transform, opacity;
}
```

**Warning:** Overuse creates performance problems. Apply only during animation, remove after.

---

### 3. Prefer Transform and Opacity

**Fast (GPU-accelerated):**
- `transform: translateX/Y/Z`, `scale`, `rotate`
- `opacity`

**Slow (triggers layout):**
- `top`, `left`, `width`, `height`
- `margin`, `padding`

**Framer Motion automatically uses transforms** for x, y, scale properties.

---

### 4. IntersectionObserver Thresholds

```tsx
const { ref, inView } = useInView({
  threshold: 0.3, // Trigger at 30% visibility
  rootMargin: '0px 0px -10% 0px', // Trigger slightly before entering
  triggerOnce: false // Re-trigger on scroll back up
});
```

**Tuning:**
- **threshold: 0.3** balances early animation with avoiding false triggers
- **rootMargin** can offset trigger point (useful for late/early starts)
- **triggerOnce: false** allows animations to replay when scrolling back

---

## Implementation Order

Build in this order to establish proper dependencies:

### Phase 1: Foundation (No animations yet)
1. **Create section components** with static content
   - Start with `OverviewSection.tsx` as template
   - Copy structure for Features, About, FAQ, Pricing
   - Just HTML/CSS, no animations yet

2. **Add section IDs and routing**
   - Give each section an `id` prop
   - Test anchor links work (`/#overview`, `/#features`)

3. **Apply CSS smooth scroll**
   - Add `scroll-behavior: smooth` to global CSS
   - Test clicking anchor links scrolls smoothly

**Why this order:** Establishes structure and navigation before complexity.

---

### Phase 2: Scroll Management
4. **Create ScrollContext**
   - Implement `useScrollPosition` hook with passive listener + RAF
   - Implement `useActiveSection` hook with Intersection Observer
   - Create `ScrollProvider` component

5. **Update Header for active state**
   - Consume `activeSection` from context
   - Highlight active nav link
   - Add section nav links (Overview, Features, etc.)

**Why this order:** Scroll tracking must exist before animations can respond to it.

---

### Phase 3: Animation System
6. **Install react-intersection-observer**
   ```bash
   npm install react-intersection-observer
   ```

7. **Create animation variants file**
   - Define `fadeScale`, `staggerContainer`, `staggerItem` variants
   - Export reusable timing configs

8. **Add view-triggered animations to sections**
   - Start with OverviewSection
   - Use `useInView` hook + Framer Motion variants
   - Test animation triggers when scrolling to section

**Why this order:** Build variants library before applying to components.

---

### Phase 4: Polish
9. **Add staggered animations to lists**
   - Feature cards
   - FAQ items

10. **Add scroll-linked effects** (1-2 max)
    - Hero background parallax if desired
    - Scroll progress indicator if needed

11. **Performance audit**
    - Check for scroll jank with DevTools Performance tab
    - Reduce animations if needed
    - Add `will-change` only where necessary

**Why this order:** Core functionality complete, now enhance and optimize.

---

## Build Dependencies

**Order rationale:**

```
Static Sections
    │
    ▼
Section IDs + CSS Smooth Scroll
    │
    ▼
Scroll Context (position tracking)
    │
    ▼
Active Section Detection (Intersection Observer)
    │
    ▼
Header Active State
    │
    ▼
Animation Variants
    │
    ▼
View-Triggered Animations per Section
    │
    ▼
Staggered Animations
    │
    ▼
(Optional) Scroll-Linked Effects
```

Each layer depends on the previous layer being complete. Building out of order causes rework.

---

## Technology Decisions

### Animation Library: Framer Motion ✓

**Already installed** (`"framer-motion": "^12.23.26"`)

**Why chosen:**
- Integrates naturally with React patterns
- Declarative API matches existing component style (see HeroSection.tsx)
- Excellent TypeScript support
- Good performance for view-triggered animations
- Built-in scroll utilities (`useScroll`, `useTransform`)

**Alternative considered:** GSAP ScrollTrigger
- More powerful for complex timeline animations
- Steeper learning curve
- Imperative API less React-idiomatic
- Would require `gsap.registerPlugin(ScrollTrigger)` setup

**Decision:** Stick with Framer Motion for consistency with existing codebase.

---

### Scroll Position: Intersection Observer API (native)

**Why chosen:**
- Native browser API (no library needed)
- Runs off main thread (excellent performance)
- Perfect for "is section visible?" detection
- Simpler than scroll event math

**Library wrapper:** Install `react-intersection-observer` for React-friendly hook
```bash
npm install react-intersection-observer
```

**Alternative considered:** Manual scroll event + getBoundingClientRect()
- More work
- Worse performance
- Only needed if IO doesn't meet requirements (it will)

---

### Smooth Scroll: CSS scroll-behavior (native)

**Why chosen:**
- Zero JavaScript
- Respects `prefers-reduced-motion`
- Excellent browser support in 2026
- Performant (browser-optimized)

**Implementation:**
```css
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

**Alternative considered:** react-scroll library
- More control (custom easing, callbacks)
- Adds dependency
- Unnecessary unless need specific easing curves

**Decision:** Start with CSS, upgrade to library only if specific requirements emerge.

---

## Anti-Patterns to Avoid

### 1. Over-Animation

**What:** Every element animates, constant motion during scroll.

**Why bad:**
- Causes distraction and cognitive overload
- Hurts performance
- Feels dated (2026 trend is toward restraint)

**Instead:** Animate on enter (view-triggered), then settle. Reserve continuous scroll animations for 1-2 hero elements max.

---

### 2. Scroll Event Without Throttling

**What:**
```tsx
// BAD
window.addEventListener('scroll', updatePosition);
```

**Why bad:** Fires 100+ times per second, causes jank.

**Instead:**
```tsx
// GOOD
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updatePosition);
    ticking = true;
  }
}, { passive: true });
```

---

### 3. Heavy DOM Manipulation in Scroll Handler

**What:** Reading layout properties (offsetTop, getBoundingClientRect) inside scroll handler.

**Why bad:** Causes layout thrashing (read forces layout recalc, then next read forces another).

**Instead:** Batch all reads, then batch all writes. Or better: use Intersection Observer which doesn't require manual position reading.

---

### 4. useState for Scroll Position

**What:**
```tsx
// BAD
const [scrollY, setScrollY] = useState(0);
```

**Why bad:** Triggers re-render of entire component tree on every scroll frame.

**Instead:**
```tsx
// GOOD
const scrollYRef = useRef(0);
```

Use `useState` only for values that should trigger visual updates (like activeSection for nav highlighting).

---

### 5. Animating Width/Height/Top/Left

**What:**
```tsx
// BAD
animate={{ width: 500 }}
```

**Why bad:** Triggers layout recalculation (expensive).

**Instead:**
```tsx
// GOOD
animate={{ scale: 1.5 }} // uses transform
```

Framer Motion's `x`, `y`, `scale`, `rotate` automatically use transforms (GPU-accelerated).

---

### 6. triggerOnce: true for Single-Page Scroll

**What:**
```tsx
// BAD for this use case
useInView({ triggerOnce: true })
```

**Why bad:** Animation won't replay when scrolling back up.

**Instead:**
```tsx
// GOOD
useInView({ triggerOnce: false })
```

For single-page scroll experiences, users expect animations to replay when returning to sections.

---

## Sources

**Architecture & Patterns:**
- [The Complete Guide to Frontend Architecture Patterns in 2026](https://dev.to/sizan_mahmud0_e7c3fd0cb68/the-complete-guide-to-frontend-architecture-patterns-in-2026-3ioo)
- [Landing Page Design Trends for 2026](https://graphicdesignjunction.com/2026/01/landing-page-design-trends-2026/)
- [Front-end JavaScript Single Page Application Architecture](https://marcobotto.com/blog/frontend-javascript-single-page-application-architecture/)

**Animation Libraries:**
- [Top React Animation Libraries: Framer Motion, GSAP, React Spring, and More](https://dev.to/ciphernutz/top-react-animation-libraries-framer-motion-gsap-react-spring-and-more-4854)
- [Beyond Eye Candy: Top 7 React Animation Libraries for Real-World Apps in 2026](https://www.syncfusion.com/blogs/post/top-react-animation-libraries)
- [GSAP ScrollTrigger Official Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

**Scroll Performance:**
- [Handling Scroll Events Efficiently with Passive Listeners in JavaScript](https://medium.com/@AlexanderObregon/handling-scroll-events-efficiently-with-passive-listeners-in-javascript-bd7d463a5871)
- [How to use scroll-linked animations the right way](https://blog.logrocket.com/use-scroll-linked-animations-right-way/)
- [Mastering the Intersection Observer API 2026: A Complete Guide](https://future.forem.com/sherry_walker_bba406fb339/mastering-the-intersection-observer-api-2026-a-complete-guide-561k)
- [The Essential Guide to Smooth as Butter Scroll Animations with IntersectionObserver](https://thelinuxcode.com/the-essential-guide-to-smooth-as-butter-scroll-animations-with-intersectionobserver/)

**Scroll Position Tracking:**
- [React Intersection Observer - A Practical Guide](https://www.builder.io/blog/react-intersection-observer)
- [Tracking Scroll Position With React Hooks](https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj)
- [How To Handle Scroll Position Like A Pro In React](https://rehanpinjari.medium.com/how-to-handle-scroll-position-like-a-pro-in-react-efa86dfc68a9)

**Navigation & Smooth Scroll:**
- [React scroll - npm](https://www.npmjs.com/package/react-scroll)
- [How To Implement Smooth Scrolling in React](https://www.digitalocean.com/community/tutorials/how-to-implement-smooth-scrolling-in-react)
- [Smooth-Scrolling Anchor Menu in ReactJS](https://medium.com/the-coders-guide-to-javascript/smooth-scrolling-anchor-menu-in-reactjs-175030d0bce2)

**CSS Scroll Features:**
- [Mastering CSS Scroll Snap](https://medium.com/@canozcannn/mastering-css-scroll-snap-smooth-vertical-and-horizontal-experiences-without-javascript-4cd8c03285e7)
- [Practical CSS Scroll Snapping](https://css-tricks.com/practical-css-scroll-snapping/)
- [CSS Scroll Snap Property: Complete Guide with Practical Examples](https://www.lambdatest.com/blog/complete-guide-to-css-scroll-snap-for-awesome-ux/)

**Analyzed Example:**
- [Superconscious App (Webflow)](https://superconscious-app.webflow.io) - Analyzed for GSAP-based scroll animations, section structure, and interaction patterns
