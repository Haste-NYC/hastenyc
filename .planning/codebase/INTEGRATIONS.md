# External Integrations

**Analysis Date:** 2026-01-20

## APIs & External Services

**Payment Processing:**
- Stripe (Payment Platform) - Handles subscription billing and checkout
  - SDK/Client: `stripe` (npm, v20.2.0 - server), `@stripe/stripe-js` (v8.6.3 - client)
  - Auth: `STRIPE_SECRET_KEY` (server-side only), `VITE_STRIPE_PUBLISHABLE_KEY` (client-side)
  - Integration File: `src/config/stripe.ts`, `src/hooks/useCheckout.ts`, `server.js`
  - API Endpoint: `/api/create-checkout-session` (POST) - Creates Stripe checkout sessions
  - Modes: Subscription billing with monthly and yearly price options
  - Redirect: Direct user to Stripe checkout at `stripe.checkout.sessions.url`

**Analytics:**
- Google Analytics 4 - Website analytics and user tracking
  - Config ID: `G-Q1MTMK070J`
  - Injected in: `index.html` via gtag script
  - Tracks pageviews and custom events

## Data Storage

**Databases:**
- None configured - Application uses client-side storage only

**Client-Side Storage:**
- localStorage (Browser API)
  - Auth data stored at key `haste_auth_user` (User object)
  - Users list stored at key `haste_users` (Array of User objects)
  - Implementation: `src/contexts/AuthContext.tsx`
  - Data persists across browser sessions

**File Storage:**
- Google Cloud Storage - Referenced in index.html meta tags for social preview images
  - URL: `https://storage.googleapis.com/gpt-engineer-file-uploads/...`
  - Purpose: Open Graph social sharing images
  - Not dynamically accessed by application code

## Authentication & Identity

**Auth Provider:**
- Custom Client-Side Authentication (Demo Mode)
  - Implementation: `src/contexts/AuthContext.tsx` with `AuthProvider` component
  - Approach: localStorage-based, no backend API integration
  - Features:
    - Sign up with name, email, password
    - Sign in with email and password
    - Sign out functionality
    - Subscription status tracking
  - Note: Production would require backend API authentication
  - Protected Routes: `src/components/ProtectedRoute.tsx` guards `/checkout` and `/account` pages

**User Model:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: "active" | "inactive" | "canceled" | null;
}
```

## Monitoring & Observability

**Error Tracking:**
- None detected - No error tracking service (Sentry, LogRocket, etc.) configured

**Logs:**
- Console logging only
  - Server: `server.js` logs errors to console
  - Client: Browser console via React development mode

## CI/CD & Deployment

**Hosting:**
- Lovable.dev - Automatic Git synchronization platform
  - Integration: `lovable-tagger` component tagging in development mode
  - Referenced in project instructions as automatic Git sync

**CI Pipeline:**
- None detected - No GitHub Actions, Jenkins, or other CI service configured

## Environment Configuration

**Required env vars (Frontend):**
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (starts with `pk_test_` or `pk_live_`)
- `VITE_STRIPE_PRICE_MONTHLY` - Stripe price ID for monthly subscription plan
- `VITE_STRIPE_PRICE_YEARLY` - Stripe price ID for yearly subscription plan
- `VITE_API_URL` - Backend API URL (default: `http://localhost:3001`)

**Required env vars (Server/Backend):**
- `STRIPE_SECRET_KEY` - Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `API_PORT` - Port for Express server (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS and redirect URLs (default: `http://localhost:5173`)

**Configuration Files:**
- `.env.local` - Local development environment (Git-ignored)
- `.env.example` - Template with placeholder values

## API Endpoints

**Internal API Server (Express):**

**GET /api/health**
- Purpose: Health check endpoint
- Returns: `{ status: "ok" }`
- Authentication: None

**POST /api/create-checkout-session**
- Purpose: Create Stripe checkout session for subscription
- Request body:
  ```json
  {
    "priceId": "price_1SrAhT...",
    "customerEmail": "user@example.com"
  }
  ```
- Response: `{ url: "https://checkout.stripe.com/..." }`
- Error: `{ error: "error message" }` (400 for missing params, 500 for server errors)
- Authentication: None (email validated on client)
- Middleware: CORS enabled

**Frontend API Calls:**
- Location: `src/hooks/useCheckout.ts`
- Method: Fetch API (no axios)
- Error handling: Toast notifications via `sonner` library

## Webhooks & Callbacks

**Incoming Webhooks:**
- None implemented - No webhook handlers for Stripe events

**Outgoing Webhooks/Callbacks:**
- Stripe Redirect URLs (configured in `server.js`):
  - Success: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
  - Cancel: `${FRONTEND_URL}/checkout`

**Related Pages:**
- `src/pages/CheckoutSuccess.tsx` - Handles post-subscription success
- `src/pages/Checkout.tsx` - Checkout page with form
- `src/pages/Account.tsx` - Account page (protected route)

## CORS Configuration

**Express Server (server.js):**
- Origin: Configured from `FRONTEND_URL` env var (default: `http://localhost:5173`)
- Credentials: `true`
- Methods: Default (GET, POST, etc.)

---

*Integration audit: 2026-01-20*
