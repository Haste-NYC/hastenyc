# Roadmap: Conform Studio Website Redesign

## Overview

Transform the current placeholder site into a premium one-page scrolling experience that converts film/TV professionals into trial signups. Starting with a complete static foundation (all sections, content, responsive layout), we'll layer in scroll management and animations, then optimize for 60fps performance and Core Web Vitals. The result: a $500k Apple-launch-feel marketing site built on the existing React/TypeScript/Tailwind stack.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Static Foundation** - All sections with content, layout, responsive design (no animations)
- [x] **Phase 2: Scroll & Animation** - Scroll infrastructure, view-triggered animations, scroll-linked effects
- [ ] **Phase 3: Performance & Polish** - Optimization, Core Web Vitals, accessibility validation

## Phase Details

### Phase 1: Static Foundation
**Goal**: Complete one-page layout with all sections, content, and responsive design—functional but not yet animated
**Depends on**: Nothing (first phase)
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, HERO-01, HERO-02, HERO-03, HERO-04, HERO-06, FEAT-01, FEAT-03, FEAT-04, FEAT-05, ABOUT-01, ABOUT-02, ABOUT-03, FAQ-01, FAQ-03, PRICE-01, PRICE-02, PRICE-03, PRICE-04, PRICE-05, TECH-01
**Success Criteria** (what must be TRUE):
  1. User can navigate to all sections (Overview, Features, About, FAQ, Pricing) via fixed header navigation
  2. User can click "Start Trial" CTA and page scrolls smoothly to pricing section
  3. User sees all content on mobile devices with proper responsive layout (no horizontal scroll, readable text)
  4. User sees bold headline, value proposition, product screenshot, and primary CTA in hero section
  5. User sees 4 feature sections with UI screenshots, bold statistics, and generous negative space
  6. User sees FAQ accordion that expands/collapses questions
  7. User sees three pricing tiers (Freelancer, Studio, Enterprise) with monthly/yearly toggle and feature lists
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Navigation & Page Structure
- [x] 01-02-PLAN.md — Hero & Features Sections
- [x] 01-03-PLAN.md — About, FAQ & Pricing Sections

### Phase 2: Scroll & Animation
**Goal**: Premium scroll-driven experience with buttery-smooth animations, view-triggered reveals, and scroll-linked effects
**Depends on**: Phase 1
**Requirements**: NAV-06, HERO-05, FEAT-02, FAQ-02, PRICE-06, TECH-02, TECH-03, TECH-04
**Success Criteria** (what must be TRUE):
  1. User sees active section highlighted in navigation as they scroll through the page
  2. User experiences smooth, buttery scroll feel (Lenis integration) across all sections
  3. User sees hero section fade in on page load with ethereal gradient background
  4. User sees feature sections reveal with staggered fade-in animations as they scroll into view
  5. User sees FAQ accordion expand/collapse with smooth animations
  6. User sees pricing card hover states with smooth transitions
  7. User with motion sensitivity sees simplified animations (prefers-reduced-motion support)
  8. User on desktop sees subtle parallax effect in hero section background
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Scroll Infrastructure (Lenis + MotionConfig)
- [x] 02-02-PLAN.md — Animations & Polish (active nav, parallax, hover states)

### Phase 3: Performance & Polish
**Goal**: 60fps scroll performance, Core Web Vitals compliance, and production-ready optimization
**Depends on**: Phase 2
**Requirements**: TECH-05
**Success Criteria** (what must be TRUE):
  1. User experiences 60fps scroll performance on desktop (validated via Chrome DevTools)
  2. User experiences fast page load (LCP < 2.5s) validated via Lighthouse
  3. User on mobile device experiences acceptable performance (tested on iPhone SE and mid-range Android)
  4. Site passes Core Web Vitals thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1)
**Plans**: 2 plans

Plans:
- [ ] 03-01-PLAN.md — Build Optimization (image compression + bundle splitting)
- [ ] 03-02-PLAN.md — Font & LCP Optimization (self-host fonts + Web Vitals monitoring)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Static Foundation | 3/3 | Complete | 2026-01-20 |
| 2. Scroll & Animation | 2/2 | Complete | 2026-01-21 |
| 3. Performance & Polish | 0/2 | Not started | - |
