# Conform Studio Website Redesign

## What This Is

A premium one-page scrolling website for Conform Studio (by Haste NYC) that showcases AI-powered Premiere Pro to DaVinci Resolve timeline conversion for film and TV post-production. The site launches self-service subscriptions and replaces the current placeholder with a $500k-feel marketing experience worthy of an Apple product launch.

## Core Value

Convert visitors into trial signups through a visually stunning, scroll-driven experience that demonstrates Conform Studio's power and professionalism.

## Requirements

### Validated

- Existing authentication system (sign in/sign up)
- Stripe subscription integration (Freelancer $49/mo, Studio $129/mo, Enterprise custom)
- PricingPlans component with monthly/yearly toggle
- Basic SEO and meta tags

### Active

- [ ] One-page scroll architecture with section navigation
- [ ] Fixed header with smooth scroll to: Overview, Features, About, FAQ
- [ ] Prominent "Start Trial" CTA that scrolls to pricing section
- [ ] Hero section with ethereal gradient background and bold typography
- [ ] Scroll-triggered animations for feature reveals
- [ ] Full-height sections with generous negative space
- [ ] Feature callout sections with UI screenshots/mockups
- [ ] Big bold statistics (300X faster, etc.)
- [ ] About section (Haste NYC / Conform Studio story)
- [ ] FAQ accordion section
- [ ] Pricing section at bottom with existing tier structure
- [ ] Dark minimal aesthetic with soft ethereal gradients
- [ ] Parallax effects on key sections
- [ ] Mobile-responsive design

### Out of Scope

- Video production/editing — using existing assets only
- Backend changes — leveraging existing auth/Stripe
- Blog redesign — keeping existing blog structure
- Studio/production company pages — this is product page only
- New subscription tiers — using existing Freelancer/Studio/Enterprise

## Context

**Current state:** Placeholder site with basic hero, video embed, feature cards, and CTA. Functional but not premium.

**Target audience:** Film/TV post-production professionals — editors, assistant editors, post supervisors at studios, freelancers.

**Competitor inspiration:**
- superconscious-app.webflow.io — scroll-advancing feature animations
- frame.io — parallax, bold stats, UI examples
- x.ai — dark minimal, full-height sections, ethereal gradients, luxury feel
- dreamcut.ai — feature callouts with UI panels, pricing section, FAQ design

**Tech stack:** React, TypeScript, Vite, Tailwind CSS, Shadcn/ui, React Router

**Feature categories to highlight:**
1. Core Conversion (Premiere to Resolve, multi-format import, batch processing)
2. Timeline Preservation (multi-track, frame-accurate, media pool)
3. Advanced Effects (speed ramps, bezier curves, motion keyframes, transitions)
4. Text & Graphics (Essential Graphics, captions/subtitles)
5. Audio (multi-channel, mixdown options)
6. Quality Control (QC analysis, reports, auto-correction)
7. Color & Grading (color nodes, Power Grades)
8. Markers & Metadata (color-coded markers, clip metadata)
9. NDI Output (HasteNDI integration, Fusion-level control)
10. Media Management (smart linking, REF file association)
11. Integration (live Premiere connection, Resolve database access)
12. Workflow Automation (CLI, headless operation)
13. Enterprise Features (OAuth, subscription management, offline grace)
14. Performance (GPU-accelerated, Apple Silicon native)

## Constraints

- **Tech stack**: Must use existing React/TypeScript/Tailwind/Shadcn setup
- **Authentication**: Must integrate with existing auth context and sign in/up flows
- **Payments**: Must use existing Stripe integration and PricingPlans component
- **Assets**: Work with existing images/videos or create CSS-based visuals
- **Browser support**: Modern browsers, Apple Silicon optimized messaging

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| One-page scroll vs multi-page | Inspiration sites use single-page scroll; creates cohesive premium experience | — Pending |
| Dark theme | All inspiration sites are dark; matches professional video editing aesthetic | — Pending |
| Scroll-triggered animations | Key differentiator from current placeholder; superconscious-style reveals | — Pending |

---
*Last updated: 2025-01-20 after initialization*
