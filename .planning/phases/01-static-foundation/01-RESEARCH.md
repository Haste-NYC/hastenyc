# Phase 1: Static Foundation - Research

**Researched:** 2026-01-20
**Domain:** React one-page landing page with smooth scroll navigation
**Confidence:** HIGH

## Summary

Phase 1 builds a complete static one-page landing page with sections for Overview (Hero), Features, About, FAQ, and Pricing. The existing codebase already has many reusable components (Header, HeroSection, FeatureSection, CTASection, Footer, PricingPlans) but they need to be adapted for a one-page scroll layout with section-based navigation.

The codebase uses React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui, and Framer Motion for animations (currently installed). The existing design already implements a dark, minimal aesthetic with ethereal gradient backgrounds similar to the VideoSection component.

**Key findings:**
- **Reuse over rebuild**: Most components can be adapted, not rebuilt from scratch
- **Native CSS smooth scroll**: Modern browsers support `scroll-behavior: smooth` natively
- **React Router hash links**: Use custom `scrollIntoView()` implementation rather than external libraries
- **Shadcn Sheet component**: Already installed for mobile hamburger menu
- **Existing gradient patterns**: VideoSection shows proven radial-gradient blur technique

**Primary recommendation:** Adapt existing components into section wrappers with IDs, implement custom smooth scroll using native browser APIs, use Shadcn Sheet for mobile menu, and extend the existing gradient background pattern from VideoSection to the hero.

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.x | UI framework | Project standard, already in use |
| React Router | 6.30.1 | Client-side routing | Already installed, handles hash navigation |
| Tailwind CSS | Latest | Utility-first CSS | Project standard, extensive custom theme |
| Framer Motion | 12.23.26 | Animation library | Already used in HeroSection, VideoSection |
| Shadcn/ui | Latest | Component library | 50+ components already installed |

### Supporting (Already Available)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-accordion | 1.2.11 | Accessible accordion | FAQ section |
| @radix-ui/react-dialog | 1.1.14 | Sheet/drawer (mobile menu) | Mobile hamburger navigation |
| lucide-react | 0.462.0 | Icon library | Menu icons, chevrons, checkmarks |
| class-variance-authority | 0.7.1 | Button variants | Already used in existing Button component |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom scroll implementation | react-router-hash-link | External dependency vs native API (prefer native) |
| Custom scroll | react-scroll | Heavier library, not needed with CSS `scroll-behavior: smooth` |
| Radix Dialog/Sheet | react-burger-menu | Shadcn Sheet is already installed and styled |

**Installation:**
```bash
# No new packages needed - everything is already installed
npm install  # Just ensure dependencies are up to date
```

## Architecture Patterns

### Recommended Project Structure

One-page architecture with section-based components:

```
src/
├── pages/
│   └── Index.tsx                    # One-page layout container
├── components/
│   ├── Header.tsx                   # UPDATE: Add nav links + mobile menu
│   ├── HeroSection.tsx              # UPDATE: Add ethereal background
│   ├── FeatureSection.tsx           # UPDATE: Restructure into 4 categories
│   ├── AboutSection.tsx             # NEW: Company story + trust signals
│   ├── FAQSection.tsx               # NEW: Accordion with common questions
│   ├── PricingSection.tsx           # WRAPPER: Use existing PricingPlans component
│   ├── PricingPlans.tsx             # REUSE: Existing component (no changes)
│   ├── Footer.tsx                   # REUSE: Already good
│   └── ui/
│       ├── accordion.tsx            # REUSE: For FAQ
│       ├── sheet.tsx                # REUSE: For mobile menu
│       └── button.tsx               # REUSE: Already has hero variant
```

### Pattern 1: Section ID-Based Navigation

**What:** Each section has an `id` attribute, nav links use hash fragments
**When to use:** One-page layouts with anchor-based navigation
**Example:**
```typescript
// Header.tsx - Navigation structure
const navLinks = [
  { label: "Overview", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Pricing", href: "#pricing" }
];

// Index.tsx - Section structure
<main>
  <section id="hero"><HeroSection /></section>
  <section id="features"><FeatureSection /></section>
  <section id="about"><AboutSection /></section>
  <section id="faq"><FAQSection /></section>
  <section id="pricing"><PricingSection /></section>
</main>
```

### Pattern 2: Native Smooth Scroll (CSS-First)

**What:** Use native CSS `scroll-behavior: smooth` for basic scrolling, enhance with JS for offset
**When to use:** Modern browsers (2026 standard support is excellent)
**Example:**
```css
/* index.css - Already has this! */
html {
  scroll-behavior: smooth;
}
```

```typescript
// For fixed header offset compensation
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;

  const headerOffset = 80; // Height of fixed header
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};
```

### Pattern 3: Fixed Header with Responsive Behavior

**What:** Desktop shows full nav, mobile collapses to hamburger using Shadcn Sheet
**When to use:** One-page layouts with multiple nav links
**Example:**
```typescript
// Header.tsx structure
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur">
      {/* Desktop nav - hidden on mobile */}
      <nav className="hidden md:flex">
        {navLinks.map(link => (
          <a href={link.href} onClick={(e) => {
            e.preventDefault();
            scrollToSection(link.href.slice(1));
          }}>
            {link.label}
          </a>
        ))}
      </nav>

      {/* Mobile hamburger - shown on mobile */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger className="md:hidden">
          <Menu />
        </SheetTrigger>
        <SheetContent side="right">
          {/* Mobile nav links */}
        </SheetContent>
      </Sheet>
    </header>
  );
};
```

### Pattern 4: Ethereal Gradient Background

**What:** Radial gradient with blur and low opacity creates soft glow effect (x.ai style)
**When to use:** Hero sections, feature highlights
**Example:**
```typescript
// Source: VideoSection.tsx shows working implementation
<section className="relative">
  {/* Ethereal gradient background */}
  <div
    className="absolute pointer-events-none z-0"
    style={{
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "200vw",
      height: "200vh",
      background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(30, 120, 255, 0.4) 0%, rgba(59, 130, 246, 0.2) 20%, rgba(59, 130, 246, 0.08) 35%, transparent 55%)",
    }}
  />

  {/* Content with higher z-index */}
  <div className="relative z-10">
    {/* Hero content */}
  </div>
</section>
```

**Alternative approach (multi-color):**
```css
/* For multi-color ethereal effect */
.ethereal-gradient {
  position: absolute;
  pointer-events: none;
  background:
    radial-gradient(ellipse 40% 40% at 30% 50%, rgba(255, 100, 200, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 50% 50% at 70% 60%, rgba(100, 150, 255, 0.15) 0%, transparent 50%);
  filter: blur(80px);
}
```

### Pattern 5: Full-Height Sections with Viewport Units

**What:** Use `min-h-screen` or `min-h-[calc(100vh-80px)]` for full-height sections accounting for fixed header
**When to use:** Hero and feature showcase sections
**Example:**
```typescript
// Hero section - full viewport height minus header
<section className="min-h-[calc(100vh-80px)] flex items-center justify-center">
  <HeroSection />
</section>

// Other sections - minimum full height but can expand
<section className="min-h-screen py-24">
  <FeatureSection />
</section>
```

### Pattern 6: Section Wrapper Component (Optional)

**What:** DRY wrapper for consistent section styling and ID management
**When to use:** When you have 5+ sections with similar structure
**Example:**
```typescript
interface PageSectionProps {
  id: string;
  className?: string;
  fullHeight?: boolean;
  children: React.ReactNode;
}

const PageSection = ({ id, className, fullHeight, children }: PageSectionProps) => (
  <section
    id={id}
    className={cn(
      "relative",
      fullHeight && "min-h-screen",
      className
    )}
  >
    {children}
  </section>
);

// Usage in Index.tsx
<PageSection id="hero" fullHeight>
  <HeroSection />
</PageSection>
```

### Anti-Patterns to Avoid

- **Installing react-router-hash-link**: Not needed - native APIs work better with custom offset control
- **Using onClick without preventDefault**: Causes page jump before smooth scroll fires
- **Absolute positioning sections**: Makes responsive behavior difficult, use relative/static flow
- **Not accounting for header height**: Sections end up hidden under fixed header
- **Inline styles everywhere**: Use Tailwind classes, only use inline styles for dynamic gradients

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile menu drawer | Custom slide-in drawer with portal | Shadcn Sheet (already installed) | Accessibility, focus trap, ESC handling, animations built-in |
| Accordion for FAQ | Custom expand/collapse with state | Shadcn Accordion (@radix-ui) | ARIA attributes, keyboard navigation, single/multiple modes |
| Smooth scroll with offset | Manual scroll calculations | Native `scrollIntoView()` + offset calculation | Browser-optimized, handles edge cases |
| Responsive breakpoints | Custom useMediaQuery | Tailwind responsive classes | Consistent with project, SSR-safe |
| Button variants | CSS modules or inline styles | Existing Button component with CVA | Already has hero/outline variants defined |

**Key insight:** Shadcn/ui components are Radix UI primitives with Tailwind styling. They handle accessibility, keyboard navigation, focus management, and ARIA attributes automatically. Don't rebuild what's already there.

## Common Pitfalls

### Pitfall 1: Fixed Header Covering Section Content
**What goes wrong:** When clicking nav links, section headers end up hidden under the fixed header
**Why it happens:** Default browser anchor scrolling doesn't account for fixed headers
**How to avoid:**
```typescript
// Option 1: JavaScript offset calculation (recommended)
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  const headerOffset = 80;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
};

// Option 2: CSS scroll-margin-top on sections
section {
  scroll-margin-top: 80px; /* Height of fixed header */
}
```
**Warning signs:** Section titles are cut off at the top when navigating

### Pitfall 2: Mobile Viewport Height Issues
**What goes wrong:** On mobile, `100vh` includes browser UI, causing content to be cut off
**Why it happens:** Mobile browsers have dynamic toolbars that change viewport height
**How to avoid:**
- Use `min-h-screen` (Tailwind) or `min-height: 100vh` for full-page sections
- Don't use `max-h-screen` unless you want strict height limits
- For hero sections, consider `min-h-[calc(100vh-80px)]` to account for header
- Avoid `h-screen` (strict height) on content-heavy sections

**Warning signs:** Content gets cut off on mobile, users can't scroll to see everything

### Pitfall 3: Sheet (Mobile Menu) Not Closing on Navigation
**What goes wrong:** User clicks a nav link in mobile menu, page scrolls but menu stays open
**Why it happens:** Forgot to call `setMobileMenuOpen(false)` in nav click handler
**How to avoid:**
```typescript
const handleNavClick = (id: string) => {
  scrollToSection(id);
  setMobileMenuOpen(false); // Close mobile menu
};

// In Sheet navigation links
<a href={`#${link.id}`} onClick={(e) => {
  e.preventDefault();
  handleNavClick(link.id);
}}>
  {link.label}
</a>
```
**Warning signs:** QA reports "menu doesn't close on mobile"

### Pitfall 4: Gradient Background Performance
**What goes wrong:** Large blur values on gradients cause performance issues, especially on mobile
**Why it happens:** CSS `filter: blur()` is expensive; large blur radius + large element = slow
**How to avoid:**
- Keep blur values reasonable (40px-80px max)
- Use `pointer-events: none` on gradient overlays
- Position gradients absolutely and limit their size
- Test on mid-range mobile devices

**Warning signs:** Choppy scrolling, low FPS on mobile, janky animations

### Pitfall 5: Section IDs Conflicting with Existing Routes
**What goes wrong:** Section ID like `#pricing` conflicts with route `/pricing`
**Why it happens:** React Router and hash fragments can interfere
**How to avoid:**
- Use unique section IDs that don't match route names: `#pricing-section`, `#hero`, `#faq-section`
- Or namespace all sections: `#section-pricing`, `#section-hero`
- Current project has no `/pricing` route, so `#pricing` is safe
**Warning signs:** Navigation doesn't work, console errors about routing

### Pitfall 6: Framer Motion Animation Conflicts
**What goes wrong:** Components animate in every time they're scrolled into view, even after first render
**Why it happens:** `whileInView` without `viewport={{ once: true }}` triggers repeatedly
**How to avoid:**
```typescript
// Good - animates once
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
>

// Bad - animates every scroll
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
>
```
**Warning signs:** Elements keep animating as user scrolls up and down

## Code Examples

Verified patterns from existing codebase and official sources:

### Example 1: Fixed Header with Navigation
```typescript
// Header.tsx - Enhanced version with navigation
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const HasteLogo = () => (/* existing SVG */);

const navLinks = [
  { label: "Overview", id: "hero" },
  { label: "Features", id: "features" },
  { label: "About", id: "about" },
  { label: "FAQ", id: "faq" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    setMobileMenuOpen(false);
  };

  const scrollToPricing = () => scrollToSection("pricing");

  return (
    <header className="fixed top-0 w-full z-50 py-4 px-6 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <a href="/" className="hover:opacity-80 transition-opacity">
          <HasteLogo />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.id);
              }}
              className="text-foreground/80 hover:text-foreground text-sm uppercase tracking-wider transition-colors"
            >
              {link.label}
            </a>
          ))}

          <Button onClick={scrollToPricing} variant="hero" size="lg">
            Start Trial
          </Button>

          <a href="/signin" className="text-foreground/80 hover:text-foreground text-sm uppercase tracking-wider transition-colors">
            Sign In
          </a>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.id);
                  }}
                  className="text-foreground text-lg uppercase tracking-wider"
                >
                  {link.label}
                </a>
              ))}
              <Button onClick={scrollToPricing} variant="hero" size="lg" className="w-full">
                Start Trial
              </Button>
              <a href="/signin" className="text-foreground/80 text-center text-lg uppercase tracking-wider">
                Sign In
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Header;
```

### Example 2: FAQ Section with Accordion
```typescript
// FAQSection.tsx - New component
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How fast is the conform process?",
    answer: "Haste Conform Studio completes complex conform tasks at 300X the speed of human teams. What once took days now takes seconds, without sacrificing accuracy."
  },
  {
    question: "Is my media secure?",
    answer: "Your media never leaves your pipeline. Our platform is privacy-forward, built for TPN-compliant environments, and trusted by industry leaders."
  },
  {
    question: "What formats do you support?",
    answer: "We support migration between Adobe Premiere, DaVinci Resolve, Avid Media Composer, and Pro Tools. More integrations are coming soon."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes! We offer a 7-day free trial for all new users. No credit card required to start."
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center mb-12 uppercase tracking-wide"
        >
          Frequently Asked Questions
        </motion.h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/40 rounded-lg px-6 bg-card/30"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 text-sm md:text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
```

### Example 3: Hero Section with Ethereal Gradient
```typescript
// HeroSection.tsx - Enhanced with gradient background
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import conformLogo from "@/assets/conform-studio-logo.png";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center px-6 pt-32 pb-16 min-h-[calc(100vh-80px)]">
      {/* Ethereal gradient background - similar to VideoSection */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200vw",
          height: "200vh",
          background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(200, 100, 255, 0.3) 0%, rgba(150, 100, 255, 0.15) 20%, rgba(100, 150, 255, 0.08) 35%, transparent 55%)",
        }}
      />

      <div className="text-center max-w-5xl mx-auto space-y-2 relative z-10">
        {/* Existing hero content */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-foreground text-xs md:text-sm uppercase tracking-[0.25em] mb-4"
        >
          Introducing from HASTE.NYC
        </motion.p>

        {/* Rest of existing hero content */}
      </div>
    </section>
  );
};

export default HeroSection;
```

### Example 4: Index.tsx One-Page Structure
```typescript
// pages/Index.tsx - Restructured for one-page layout
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Haste Conform Studio - Premiere to Resolve"
        description="Instant project migration from Adobe Premiere to Davinci Resolve. 300X faster, 100% accurate, TPN+ compliant."
        canonical="/"
      />

      <Header />

      <main>
        {/* Hero - full height minus header */}
        <section id="hero" className="pt-20">
          <HeroSection />
        </section>

        {/* Features - full height sections */}
        <section id="features" className="min-h-screen py-24">
          <FeatureSection />
        </section>

        {/* About */}
        <section id="about" className="py-24">
          <AboutSection />
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24">
          <FAQSection />
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <PricingSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery smooth scroll | Native CSS `scroll-behavior: smooth` | ~2020 (widespread support) | Simpler, no dependencies, better performance |
| react-router-hash-link library | Custom `scrollIntoView()` with offset | 2026 (modern browsers) | More control, no dependencies, lighter bundle |
| Custom mobile menu with state | Radix Dialog/Sheet primitives | 2023+ (Radix maturity) | Better accessibility, focus management built-in |
| Fixed `100vh` for mobile | Dynamic viewport units (`dvh`) | 2024+ (browser support) | Handles mobile browser UI correctly |
| Manual media queries in JS | Tailwind responsive classes | Always (Tailwind philosophy) | SSR-safe, consistent, easier to maintain |

**Deprecated/outdated:**
- **react-router-hash-link**: Still works but unnecessary with native APIs
- **react-scroll**: Heavier than needed, native CSS is sufficient
- **jQuery smooth scroll**: Deprecated in modern React projects
- **vh units without fallback**: Use `dvh` or `min-h-screen` for mobile

## Open Questions

Things that couldn't be fully resolved:

1. **Product Screenshots for Features Section**
   - What we know: Requirements call for "UI screenshots from develop branch", assets folder has several product images
   - What's unclear: Which specific screenshots should be used for which feature category (Core Conversion, Timeline Preservation, Advanced Effects, Quality Control)
   - Recommendation: During planning, create placeholder image slots. User will need to provide or select specific screenshots.

2. **About Section Content**
   - What we know: Need "Haste NYC company story" and "trust signals"
   - What's unclear: Specific copy, trust signal badges/logos (TPN+ certification, studio partnerships)
   - Recommendation: Plan component structure with placeholder content, user provides copy during implementation.

3. **Optimal Hero Gradient Colors**
   - What we know: Requirement says "x.ai style ethereal gradient", VideoSection uses blue gradient successfully
   - What's unclear: Should hero use same blue, different color (purple/pink to match brand), or multi-color blend?
   - Recommendation: Plan for configurable gradient colors, test multiple options during implementation.

4. **Mobile Header Height**
   - What we know: Desktop header will be ~80px
   - What's unclear: Mobile header may need different height, affects scroll offset calculations
   - Recommendation: Use CSS variable for header height, make scroll offset calculation dynamic.

5. **Statistics Display in Features**
   - What we know: FEAT-03 requires "300X faster", "100% accurate", "TPN+ compliant" as big bold statistics
   - What's unclear: Should these be separate callout components, integrated into feature descriptions, or a dedicated stats section?
   - Recommendation: Plan dedicated stats component with large typography, place between hero and features or within features section.

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis:
  - `/src/pages/Index.tsx` - Current landing page structure
  - `/src/components/Header.tsx` - Existing header (logo only)
  - `/src/components/HeroSection.tsx` - Hero with Framer Motion animations
  - `/src/components/VideoSection.tsx` - Proven ethereal gradient implementation
  - `/src/components/PricingPlans.tsx` - Complete pricing component (reusable)
  - `/src/components/ui/accordion.tsx` - Radix Accordion (for FAQ)
  - `/src/components/ui/sheet.tsx` - Radix Dialog/Sheet (for mobile menu)
  - `/src/components/ui/button.tsx` - Button with hero variant
  - `/src/index.css` - Already has `scroll-behavior: smooth`
  - `package.json` - Confirmed Framer Motion 12.23.26, React Router 6.30.1

### Secondary (MEDIUM confidence)
- [Scroll to anchor element with React Router V6 - DEV Community](https://dev.to/mindactuate/scroll-to-anchor-element-with-react-router-v6-38op)
- [GitHub - rafgraph/react-router-hash-link](https://github.com/rafgraph/react-router-hash-link)
- [Sticky Headers And Full-Height Elements - Smashing Magazine](https://www.smashingmagazine.com/2024/09/sticky-headers-full-height-elements-tricky-combination/)
- [What Is VH In CSS? 2026 Guide - Elementor](https://elementor.com/blog/vh/)
- [Creating a Hamburger Menu in React - Medium](https://khuang159.medium.com/creating-a-hamburger-menu-in-react-f22e5ae442cb)
- [Advanced glows in CSS - Medium](https://medium.com/ida-mediafoundry/advanced-glows-in-css-371a6d1cb1f)
- [Add a blurry gradient to your HTML code - MagicPattern](https://www.magicpattern.design/blog/add-blurry-gradient-to-your-html-code)

### Tertiary (LOW confidence - general guidance)
- [aesthetics in the ai-era: visual + web design trends for 2026](https://aigoodies.beehiiv.com/p/aesthetics-2026) - Design trends context
- [CSS Gradient Generator](https://cssgradient.io/) - Tool reference
- [47 Best Glowing Effects in CSS [2026] - TestMu AI](https://www.testmu.ai/blog/glowing-effects-in-css/) - CSS techniques

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and in active use
- Architecture: HIGH - Existing components proven in codebase, patterns verified
- Pitfalls: HIGH - Based on common React/Tailwind issues and existing code review
- Gradient techniques: MEDIUM - VideoSection proves concept, WebSearch provides additional techniques
- One-page scroll: HIGH - Native browser APIs, existing CSS, verified React Router v6 patterns

**Research date:** 2026-01-20
**Valid until:** ~2026-03-20 (60 days - stable tech stack, unlikely to change soon)
