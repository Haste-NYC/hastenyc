# Architecture

**Analysis Date:** 2026-01-20

## Pattern Overview

**Overall:** Layered Client-Server with React Frontend and Express Backend

**Key Characteristics:**
- Client-side routing with React Router for SPA navigation
- State management via Context API (Auth) and React Query (server state)
- Backend API layer for payment processing and external integrations
- Separation of concerns: presentational components, page components, business logic
- Centralized configuration for external services (Stripe)

## Layers

**Presentation Layer:**
- Purpose: Renders UI components and handles user interactions
- Location: `src/components/`, `src/pages/`
- Contains: React functional components, UI primitives from shadcn/ui, page layouts
- Depends on: Context (Auth), Hooks (useCheckout, useAuth), utilities (cn)
- Used by: React Router and App component

**Page Layer:**
- Purpose: Represents top-level routes and composes sections/components
- Location: `src/pages/`
- Contains: Full-page components (Index, SignIn, Checkout, Blog posts, Account)
- Depends on: Presentation components, Context, Hooks, utilities
- Used by: Router in App.tsx

**Business Logic Layer:**
- Purpose: Handles authentication, form processing, checkout flow
- Location: `src/contexts/AuthContext.tsx`, `src/hooks/useCheckout.ts`
- Contains: Auth state management, form submission logic, API calls
- Depends on: localStorage, fetch API, external services (Stripe)
- Used by: Page components and presentation components

**Configuration Layer:**
- Purpose: Centralizes external service configuration and validation
- Location: `src/config/stripe.ts`
- Contains: Stripe API keys and price IDs from environment variables
- Depends on: Environment variables (VITE_*)
- Used by: Utility functions and hooks

**Utility Layer:**
- Purpose: Provides shared helper functions and initialization
- Location: `src/lib/utils.ts`, `src/lib/stripe.ts`
- Contains: CSS class merging (cn), Stripe singleton instance
- Depends on: External libraries (clsx, tailwind-merge, @stripe/stripe-js)
- Used by: Everywhere

**API/Server Layer:**
- Purpose: Handles server-side payment processing and integrations
- Location: `server.js` (Express backend)
- Contains: Stripe checkout session creation, health checks
- Depends on: Stripe SDK, Express, CORS, environment configuration
- Used by: Frontend via fetch calls from useCheckout hook

**Root Provider Layer:**
- Purpose: Wraps application with required providers and contexts
- Location: `src/main.tsx`
- Contains: HelmetProvider (SEO), AuthProvider, App component initialization
- Depends on: React DOM, contexts, App component
- Used by: Browser entry point

## Data Flow

**Authentication Flow:**

1. User navigates to /signin or /signup
2. SignIn/SignUp page renders with React Hook Form + Zod validation
3. User submits credentials
4. AuthContext.signIn/signUp called with validated data
5. Demo mode: stores user in localStorage under "haste_users" key
6. AuthProvider updates user state and persists to AUTH_STORAGE_KEY in localStorage
7. Page redirects based on returnUrl parameter or to home
8. On app mount, AuthProvider loads user from localStorage to restore session

**Checkout/Payment Flow:**

1. User navigates to /checkout (protected route)
2. ProtectedRoute checks isAuthenticated via useAuth hook
3. If not authenticated, redirects to /signin with returnUrl
4. Checkout page displays PricingPlans component
5. User selects plan (monthly/yearly) via handleSelectPlan callback
6. Selected plan stored in component state
7. User clicks "Continue to Payment"
8. useCheckout hook calls POST /api/create-checkout-session via fetch
9. Server creates Stripe checkout session with priceId and customerEmail
10. Server returns session.url
11. Frontend redirects to Stripe Checkout (window.location.href = url)
12. After Stripe payment, redirects to /checkout/success with session_id

**Page Navigation Flow:**

1. User clicks link or navigates via URL
2. React Router matches path in App.tsx Routes
3. Route must be placed ABOVE "*" catch-all route (documented in code)
4. ScrollToTop component scrolls to top on pathname change
5. Page component renders with appropriate layout
6. SEO component updates meta tags via Helmet

**State Management:**

- **Auth State:** Managed by AuthContext, persisted to localStorage
  - User data (id, email, name, subscriptionStatus)
  - Authentication flags (isAuthenticated, isLoading)
  - Methods (signIn, signUp, signOut, updateSubscriptionStatus)

- **Server State:** Managed by React Query (TanStack Query)
  - QueryClient created in App.tsx
  - Used for managing async server requests and caching

- **Component State:** Local useState for UI-specific state
  - Form values in SignIn/SignUp (managed by React Hook Form)
  - Selected plan in Checkout page
  - Loading states in hooks

## Key Abstractions

**AuthContext Hook (useAuth):**
- Purpose: Provides centralized access to authentication state and methods
- Location: `src/contexts/AuthContext.tsx`
- Pattern: Context + Custom Hook for convenient consumption
- Usage: `const { user, isAuthenticated, signIn, signOut } = useAuth()`

**ProtectedRoute Component:**
- Purpose: Enforces authentication requirement on routes
- Location: `src/components/ProtectedRoute.tsx`
- Pattern: HOC-style wrapper that conditionally renders or redirects
- Usage: `<Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />`

**useCheckout Hook:**
- Purpose: Encapsulates Stripe checkout session creation logic
- Location: `src/hooks/useCheckout.ts`
- Pattern: Custom hook for side effects and API integration
- Returns: { isLoading, error, startCheckout }
- Integration: Connects frontend to backend /api/create-checkout-session endpoint

**cn Utility Function:**
- Purpose: Merges Tailwind CSS classes with conflict resolution
- Location: `src/lib/utils.ts`
- Pattern: Utility combining clsx + tailwind-merge
- Usage: `className={cn("px-4", condition && "bg-red-500")}`

**Stripe Singleton:**
- Purpose: Ensures single Stripe instance to avoid duplicate initializations
- Location: `src/lib/stripe.ts`
- Pattern: Lazy initialization with promise caching
- Usage: `const stripe = await getStripe()`

**PricingPlans Component:**
- Purpose: Reusable pricing table with monthly/yearly toggle
- Location: `src/components/PricingPlans.tsx`
- Pattern: Controlled component with callbacks
- Props: onSelectPlan, selectedPriceId, onScheduleCall

**SEO Component:**
- Purpose: Manages meta tags and structured data via Helmet
- Location: `src/components/SEO.tsx`
- Pattern: Wrapper for react-helmet-async
- Usage: Handles title, description, canonical, video schema, OpenGraph

## Entry Points

**Browser Entry Point:**
- Location: `src/main.tsx`
- Triggers: Initial page load
- Responsibilities: DOM mounting, provider wrapping, initial render

**App Component:**
- Location: `src/App.tsx`
- Triggers: Root component render
- Responsibilities: Route definitions, global provider setup (QueryClient, TooltipProvider, Toasters)

**Page Components:**
- Location: `src/pages/*.tsx`
- Triggers: Route matching in React Router
- Responsibilities: Page-specific layout and composition

**Server API Entry Point:**
- Location: `server.js` port 3001
- Triggers: POST /api/create-checkout-session
- Responsibilities: Stripe session creation, CORS handling

## Error Handling

**Strategy:** Try-catch with user-facing toast notifications via Sonner

**Patterns:**

1. **Form Validation Errors:**
   - Zod schema validation on client
   - FormMessage component displays field-level errors
   - Example: `src/pages/SignIn.tsx` email/password validation

2. **API Errors:**
   - useCheckout catches fetch errors
   - Sets error state and shows toast.error()
   - Example: `src/hooks/useCheckout.ts` lines 47-50

3. **Auth Errors:**
   - AuthContext.signIn/signUp throw Error on validation failure
   - Page components catch and display via toast
   - Example: `src/pages/SignIn.tsx` lines 59-60

4. **Demo Data Errors:**
   - AuthContext uses try-catch when parsing localStorage JSON
   - Silently removes corrupted data

## Cross-Cutting Concerns

**Logging:**
- Minimal logging, primarily in server.js for API calls
- Client-side uses console (no dedicated logger)
- Browser dev tools for debugging

**Validation:**
- Client: Zod schemas in form pages (SignIn, SignUp)
- Server: Stripe config validation via validateStripeConfig()
- Form values validated by React Hook Form before submission

**Authentication:**
- Demo mode: localStorage-based user storage
- Production-ready: Uses AuthContext interface for future API integration
- Protected routes via ProtectedRoute component wrapper
- Auth state persists across page reloads via useEffect in AuthProvider

**Environment Configuration:**
- Frontend: Environment variables via VITE_ prefix (vite-specific)
- Server: Reads from .env.local or environment
- Stripe config centralized in `src/config/stripe.ts`
- API URL configurable via VITE_API_URL in useCheckout hook

---

*Architecture analysis: 2026-01-20*
