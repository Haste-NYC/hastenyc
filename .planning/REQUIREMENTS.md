# Requirements: Conform Studio Website Redesign

**Defined:** 2025-01-20
**Core Value:** Convert visitors into trial signups through a visually stunning, scroll-driven experience

## v1 Requirements

### Navigation

- [ ] **NAV-01**: Fixed header with section navigation (Overview, Features, About, FAQ)
- [ ] **NAV-02**: Smooth scroll to sections on nav click
- [ ] **NAV-03**: Prominent "Start Trial" CTA button scrolls to pricing
- [ ] **NAV-04**: "Sign In" link in header
- [ ] **NAV-05**: Mobile-responsive hamburger menu
- [ ] **NAV-06**: Active section highlighting in nav on scroll

### Hero

- [ ] **HERO-01**: Bold headline with clear value proposition
- [ ] **HERO-02**: Subheadline explaining the product
- [ ] **HERO-03**: Primary CTA ("Start Free Trial")
- [ ] **HERO-04**: Ethereal gradient background (x.ai style dark/soft)
- [ ] **HERO-05**: Fade-in animation on page load
- [ ] **HERO-06**: Product screenshot (no video - focus on screenshots and animations)

### Features

- [ ] **FEAT-01**: Feature sections for 4 priority categories: Core Conversion, Timeline Preservation, Advanced Effects, Quality Control
- [ ] **FEAT-02**: Scroll-triggered reveal animations (staggered fade-in)
- [ ] **FEAT-03**: Big bold statistics section: "300X faster", "100% accurate", "TPN+ compliant"
- [ ] **FEAT-04**: UI screenshots pulled from develop branch showing actual product panels
- [ ] **FEAT-05**: Full-height sections with generous negative space

### About

- [ ] **ABOUT-01**: Haste NYC company story (parent company background, production roots)
- [ ] **ABOUT-02**: Trust signals (TPN+ compliant, built for studios)
- [ ] **ABOUT-03**: Dark minimal styling with subtle background treatment

### FAQ

- [ ] **FAQ-01**: Accordion with common questions
- [ ] **FAQ-02**: Smooth expand/collapse animations
- [ ] **FAQ-03**: Dark themed styling

### Pricing

- [ ] **PRICE-01**: Three tiers displayed (Freelancer, Studio, Enterprise)
- [ ] **PRICE-02**: Monthly/yearly billing toggle
- [ ] **PRICE-03**: Feature list per tier
- [ ] **PRICE-04**: Clear CTA buttons per tier
- [ ] **PRICE-05**: "Most Popular" badge on Studio tier
- [ ] **PRICE-06**: Hover states on pricing cards

### Technical

- [ ] **TECH-01**: Mobile-responsive across all breakpoints
- [ ] **TECH-02**: Lenis smooth scroll integration
- [ ] **TECH-03**: prefers-reduced-motion support (accessibility)
- [ ] **TECH-04**: 60fps scroll animations (compositor-only properties)
- [ ] **TECH-05**: Core Web Vitals optimized (LCP < 2.5s)

## v2 Requirements

### Enhanced Animations

- **ANI-01**: Hero parallax effect (desktop only)
- **ANI-02**: Scroll progress indicator in header
- **ANI-03**: Stats counter animation on scroll into view
- **ANI-04**: Micro-interactions on buttons and cards

### Advanced Features

- **ADV-01**: Video background in hero section
- **ADV-02**: Interactive product demo embed
- **ADV-03**: Glassmorphism card effects
- **ADV-04**: Customer testimonials section

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog redesign | Separate project, existing blog works |
| Studio/production pages | This is product page only |
| New subscription tiers | Using existing Freelancer/Studio/Enterprise |
| Backend changes | Leveraging existing auth/Stripe |
| Scroll-jacking | Anti-pattern, hurts UX |
| Autoplay video with sound | Anti-pattern per research |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 1 | Pending |
| NAV-02 | Phase 1 | Pending |
| NAV-03 | Phase 1 | Pending |
| NAV-04 | Phase 1 | Pending |
| NAV-05 | Phase 1 | Pending |
| NAV-06 | Phase 2 | Pending |
| HERO-01 | Phase 1 | Pending |
| HERO-02 | Phase 1 | Pending |
| HERO-03 | Phase 1 | Pending |
| HERO-04 | Phase 1 | Pending |
| HERO-05 | Phase 2 | Pending |
| HERO-06 | Phase 1 | Pending |
| FEAT-01 | Phase 1 | Pending |
| FEAT-02 | Phase 2 | Pending |
| FEAT-03 | Phase 1 | Pending |
| FEAT-04 | Phase 1 | Pending |
| FEAT-05 | Phase 1 | Pending |
| ABOUT-01 | Phase 1 | Pending |
| ABOUT-02 | Phase 1 | Pending |
| ABOUT-03 | Phase 1 | Pending |
| FAQ-01 | Phase 1 | Pending |
| FAQ-02 | Phase 2 | Pending |
| FAQ-03 | Phase 1 | Pending |
| PRICE-01 | Phase 1 | Pending |
| PRICE-02 | Phase 1 | Pending |
| PRICE-03 | Phase 1 | Pending |
| PRICE-04 | Phase 1 | Pending |
| PRICE-05 | Phase 1 | Pending |
| PRICE-06 | Phase 2 | Pending |
| TECH-01 | Phase 1 | Pending |
| TECH-02 | Phase 2 | Pending |
| TECH-03 | Phase 2 | Pending |
| TECH-04 | Phase 2 | Pending |
| TECH-05 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2025-01-20*
*Last updated: 2025-01-20 after initial definition*
