# Codebase Structure

**Analysis Date:** 2026-01-20

## Directory Layout

```
hastenyc/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # shadcn/ui primitive components (50+ components)
│   │   ├── Header.tsx          # Navigation header with logo
│   │   ├── Footer.tsx          # Site footer
│   │   ├── HeroSection.tsx     # Landing page hero
│   │   ├── FeatureSection.tsx  # Feature showcase
│   │   ├── CTASection.tsx      # Call-to-action banner
│   │   ├── VideoSection.tsx    # Embedded video player
│   │   ├── PricingPlans.tsx    # Pricing table with monthly/yearly toggle
│   │   ├── ProtectedRoute.tsx  # Auth-protected route wrapper
│   │   ├── SEO.tsx             # Meta tags and structured data
│   │   ├── Breadcrumbs.tsx     # Navigation breadcrumbs
│   │   └── RelatedArticles.tsx # Blog post related articles
│   ├── pages/                   # Full-page route components
│   │   ├── Index.tsx           # Home page (/)
│   │   ├── Blog.tsx            # Blog listing page
│   │   ├── BlogPost.tsx        # Individual blog post template
│   │   ├── blog/               # Blog post implementations
│   │   │   └── BlogIndex.tsx   # Alternative blog listing
│   │   ├── studio/             # Studio brand pages
│   │   │   ├── StudioHome.tsx
│   │   │   ├── Work.tsx
│   │   │   ├── Press.tsx
│   │   │   ├── Talent.tsx
│   │   │   └── Inquire.tsx
│   │   ├── product/            # Product pages
│   │   │   ├── ProductHome.tsx
│   │   │   ├── Privacy.tsx
│   │   │   ├── Terms.tsx
│   │   │   └── Refund.tsx
│   │   ├── SignIn.tsx          # Authentication sign in
│   │   ├── SignUp.tsx          # Authentication sign up
│   │   ├── Checkout.tsx        # Stripe checkout flow
│   │   ├── CheckoutSuccess.tsx # Post-payment confirmation
│   │   ├── Account.tsx         # User account dashboard
│   │   ├── StyleGuide.tsx      # UI component showcase
│   │   ├── NotFound.tsx        # 404 error page
│   │   ├── Terms.tsx           # Terms of service
│   │   ├── Privacy.tsx         # Privacy policy
│   │   ├── Refund.tsx          # Refund policy
│   │   ├── FigmaSchemaPost.tsx       # Blog post content
│   │   ├── EntertainmentShakeupPost.tsx
│   │   ├── VfxStoragePost.tsx
│   │   └── FinalCutProPost.tsx
│   ├── contexts/               # React Context providers
│   │   └── AuthContext.tsx    # Authentication state management
│   ├── hooks/                  # Custom React hooks
│   │   ├── useCheckout.ts     # Stripe checkout session creation
│   │   ├── use-toast.ts       # Toast notifications
│   │   └── use-mobile.tsx     # Mobile viewport detection
│   ├── config/                 # Configuration and constants
│   │   └── stripe.ts          # Stripe API keys and price IDs
│   ├── lib/                    # Utility functions
│   │   ├── utils.ts           # CSS class merging (cn utility)
│   │   └── stripe.ts          # Stripe singleton instance
│   ├── assets/                 # Static images and media
│   ├── App.tsx                # Root app component with routing
│   ├── main.tsx               # React DOM mount point
│   ├── index.css              # Global styles (Tailwind imports)
│   └── vite-env.d.ts          # Vite environment types
├── .planning/                  # GSD planning documents
│   └── codebase/
├── public/                     # Static assets served directly
├── server.js                   # Express backend API server
├── vite.config.ts             # Vite build configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint rules
├── package.json               # Dependencies and scripts
├── prd.json                   # Ralph automation task list
├── CLAUDE.md                  # Project-specific instructions
├── BLOG_POST_TEMPLATE.md      # Blog post structure template
├── RALPH_INSTRUCTIONS.md      # Ralph agent loop instructions
└── ralph.sh                   # Ralph automation script
```

## Directory Purposes

**src/components:**
- Purpose: Houses all reusable React components
- Contains: UI primitives (button, card, input, etc.), layout components, feature components
- Key files: PricingPlans.tsx (pricing table), ProtectedRoute.tsx (auth guard), SEO.tsx (meta tags)

**src/components/ui:**
- Purpose: shadcn/ui component library
- Contains: 50+ pre-built Radix UI based components with Tailwind styling
- Auto-generated from CLI, follows shadcn conventions
- Import via `@/components/ui/[component]`

**src/pages:**
- Purpose: Top-level route components representing full pages
- Contains: Page layouts, route-specific logic, integration of smaller components
- Organization: Public pages at top level, grouped pages in subdirectories (blog/, studio/, product/)

**src/contexts:**
- Purpose: React Context providers for global state
- Contains: AuthContext for authentication state management
- Pattern: Context + useAuth() custom hook for consumption

**src/hooks:**
- Purpose: Custom React hooks for logic reuse
- Contains: useCheckout (Stripe API), use-toast (notifications), use-mobile (viewport)
- Pattern: Encapsulate side effects, state, and external integrations

**src/config:**
- Purpose: Centralized configuration for external services
- Contains: Stripe API keys, price IDs, validation functions
- Usage: Import config values, validate on startup

**src/lib:**
- Purpose: Utility functions and helper modules
- Contains: cn() for class merging, getStripe() for Stripe singleton
- Usage: Application-wide utilities

**src/assets:**
- Purpose: Static images, videos, logos used in components
- Contains: SVG icons (embedded in components), media files
- Import: Direct file imports or via public/ for unprocessed assets

**public/:**
- Purpose: Static assets served directly without processing
- Contains: favicon, fonts, large media files
- Access: Via root path `/` in HTML/CSS

**server.js:**
- Purpose: Express backend for server-side operations
- Contains: Stripe checkout session creation, health check endpoint, CORS setup
- Port: Configured via PORT env var (default 3001)

## Key File Locations

**Entry Points:**

- `src/main.tsx`: React DOM entry point, wraps app with providers (HelmetProvider, AuthProvider)
- `src/App.tsx`: Root component, defines all routes, initializes QueryClient and UI providers
- `server.js`: Express API server, runs on port 3001, handles /api endpoints
- `index.html`: HTML template loaded by Vite, root div for React

**Configuration:**

- `vite.config.ts`: Build tool config, defines @ alias to src/, dev server port 8080
- `tsconfig.json`: TypeScript compiler options, relaxed settings (no strict null checks)
- `tailwind.config.ts`: Tailwind CSS customizations, custom brand colors, animations
- `src/config/stripe.ts`: Stripe API configuration, loads from environment variables
- `.env.local`: Local environment variables (not committed), contains API keys

**Core Logic:**

- `src/contexts/AuthContext.tsx`: Authentication state, user data persistence via localStorage
- `src/hooks/useCheckout.ts`: Stripe checkout flow, API integration to /api/create-checkout-session
- `src/components/ProtectedRoute.tsx`: Route authentication guard, redirects to signin if not authenticated
- `src/pages/SignIn.tsx`: Sign in form with Zod validation, integrates with useAuth
- `src/pages/Checkout.tsx`: Subscription checkout UI, plan selection and payment flow

**Testing & Style:**

- `src/pages/StyleGuide.tsx`: UI component showcase and testing ground
- No test framework currently configured (Jest/Vitest not set up)

## Naming Conventions

**Files:**

- `*.tsx`: React components with JSX (PascalCase, e.g., `Header.tsx`, `PricingPlans.tsx`)
- `*.ts`: Non-JSX TypeScript utilities and hooks (camelCase, e.g., `useCheckout.ts`, `stripe.ts`)
- Page components: PascalCase matching route names (e.g., `SignIn.tsx`, `Checkout.tsx`)
- Feature components: PascalCase for what they display (e.g., `HeroSection.tsx`, `CTASection.tsx`)
- Utility files: camelCase (e.g., `utils.ts`, `stripe.ts`)

**Directories:**

- `components/`: lowercase (contains component files)
- `pages/`: lowercase (contains page files)
- `hooks/`, `contexts/`, `lib/`, `config/`, `assets/`: lowercase
- Feature subdirectories: lowercase (e.g., `blog/`, `studio/`, `product/`)

**Component/Function Names:**

- React components: PascalCase (e.g., `function Header() {}`)
- Custom hooks: camelCase with `use` prefix (e.g., `function useCheckout() {}`)
- Utility functions: camelCase (e.g., `cn()`, `validateStripeConfig()`)
- Interfaces/Types: PascalCase (e.g., `User`, `AuthContextType`, `CheckoutParams`)

**Variables/Constants:**

- Variables: camelCase (e.g., `const isAuthenticated = true`)
- Constants: SCREAMING_SNAKE_CASE if module-level (e.g., `AUTH_STORAGE_KEY`)
- Array/Collection names: Plural (e.g., `users`, `tiers`, `features`)

## Where to Add New Code

**New Feature - Complete UI Page:**

1. Create page component in `src/pages/[FeatureName].tsx`
   - Compose using existing components and hooks
   - Import context/hooks as needed
   - Example structure: SEO → Header → Content sections → Footer

2. Add route in `src/App.tsx` ABOVE the "*" catch-all route
   - ```typescript
     <Route path="/path-to-feature" element={<FeatureName />} />
     ```

3. If authentication required, wrap with ProtectedRoute:
   - ```typescript
     <Route path="/path-to-feature" element={<ProtectedRoute><FeatureName /></ProtectedRoute>} />
     ```

**New Component - Reusable Feature:**

1. Create component in `src/components/[ComponentName].tsx`
   - Accept props for customization
   - Export as default
   - Document prop interface if complex

2. If UI primitive missing, add to `src/components/ui/` via shadcn CLI:
   - `npx shadcn-ui@latest add [component-name]`

**New Hook - Business Logic:**

1. Create hook in `src/hooks/use[HookName].ts`
   - Export function starting with `use`
   - Return object with state and handlers
   - Example: `useCheckout` returns `{ isLoading, error, startCheckout }`

**New Utility Function:**

1. Add to `src/lib/utils.ts` if general purpose (CSS, helpers)
2. Create new file in `src/lib/` if module-specific (e.g., `stripe.ts`, `api.ts`)

**New API Endpoint:**

1. Add handler to `server.js`
2. Follow pattern: route definition → validation → logic → response
3. Endpoints mounted at `/api/*` path
4. Called from frontend via fetch with API_URL env var

**New Page Section/Component:**

1. Create in `src/components/[SectionName].tsx`
   - Typically composed of multiple UI primitives
   - Examples: HeroSection, FeatureSection, CTASection

2. Import and use in page component:
   - ```typescript
     import MySection from "@/components/MySection";
     // ... in JSX
     <MySection prop1="value" prop2={state} />
     ```

## Special Directories

**src/components/ui:**
- Purpose: Shadcn component library
- Generated: Yes (via CLI, not manually created)
- Committed: Yes (committed to repo)
- Usage: Import individual components via `@/components/ui/[component]`

**node_modules:**
- Purpose: npm dependencies
- Generated: Yes (via npm install)
- Committed: No (.gitignore excludes)

**dist/**:
- Purpose: Production build output
- Generated: Yes (via npm run build)
- Committed: No (.gitignore excludes)

**public/**:
- Purpose: Static files served directly
- Generated: No (user-created)
- Committed: Yes
- Usage: Large assets, fonts, favicon

**.env.local:**
- Purpose: Local environment variables
- Generated: No (manual setup)
- Committed: No (.gitignore excludes)
- Usage: Contains API keys and secrets

---

*Structure analysis: 2026-01-20*
