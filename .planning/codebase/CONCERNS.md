# Codebase Concerns

**Analysis Date:** 2026-01-20

## Security Concerns

**Exposed Test Keys in Version Control:**
- Issue: Live Stripe test keys (publishable and secret) are committed to `.env.local` in the repository
- Files: `.env.local`
- Impact: Test keys compromised; production secret keys could accidentally be committed; environment variables exposed to anyone with repository access
- Fix approach: Remove `.env.local` from git history, add to `.gitignore`, use secure secrets management (GitHub Secrets, 1Password, Vault), rotate keys immediately

**Mock Authentication System Without Backend Validation:**
- Issue: Authentication is entirely client-side localStorage-based with no server-side verification. Users can modify their auth state by editing browser storage
- Files: `src/contexts/AuthContext.tsx`, `src/pages/SignIn.tsx`, `src/pages/SignUp.tsx`
- Impact: Complete loss of security for protected routes; users can forge any identity; subscription status is not verified; checkout can be triggered for any price ID without validation
- Fix approach: Implement proper backend authentication (OAuth, JWT tokens signed server-side, secure httpOnly cookies), validate subscription status on backend before allowing access to protected resources

**Passwords Not Hashed or Validated:**
- Issue: Passwords are accepted without validation or hashing. Comment states "For demo purposes, accept any valid email/password format" but no validation layer exists
- Files: `src/contexts/AuthContext.tsx` (lines 50-83, 85-111)
- Impact: Credentials stored in localStorage in plain text if ever implemented for real; no protection against weak passwords; users' security entirely compromised
- Fix approach: Implement proper password hashing (bcrypt, argon2) on backend; never store passwords in localStorage; use secure session management

**Unvalidated Email Input in Checkout:**
- Issue: Customer email from checkout is passed directly to Stripe without validation
- Files: `src/pages/Checkout.tsx`, `src/hooks/useCheckout.ts`, `server.js`
- Impact: Potential for typos to go unvalidated; fraud risk with intentionally bad emails; Stripe rate limiting if bot sends invalid emails repeatedly
- Fix approach: Validate email format on frontend and backend before creating session

**API Redirect Without Verification:**
- Issue: `window.location.href` is used to redirect to Stripe checkout URL without verifying it's actually a valid Stripe URL
- Files: `src/hooks/useCheckout.ts` (line 43)
- Impact: Potential open redirect vulnerability if API compromised; phishing vector if URL intercepted
- Fix approach: Validate URL starts with official Stripe domain before redirecting, use iframe for Stripe Checkout or embedded components instead of full redirect

## Authentication & Authorization Issues

**ProtectedRoute Doesn't Validate Subscription Status:**
- Issue: `/checkout` and `/account` routes are protected only by authentication, not subscription status
- Files: `src/components/ProtectedRoute.tsx`, `src/App.tsx` (lines 63-65)
- Impact: Non-paying users can access checkout page repeatedly; account page shows subscription mockups but lacks any real permission checks
- Fix approach: Create multiple route protection levels; check subscription status for paid-tier routes; implement backend authorization checks

**No CSRF Protection:**
- Issue: Checkout endpoint accepts POST requests without CSRF token validation
- Files: `server.js` (lines 30-59)
- Impact: Cross-site request forgery attacks possible; attacker could trigger checkout from malicious site
- Fix approach: Implement CSRF token validation using middleware, use SameSite cookie flags, add origin validation

**No Rate Limiting:**
- Issue: `/api/create-checkout-session` endpoint has no rate limiting
- Files: `server.js` (lines 30-59)
- Impact: Attackers can spam checkout sessions, causing high Stripe API costs; DDoS vector
- Fix approach: Implement per-IP/per-user rate limiting, add request throttling middleware

## Data Storage & State Management Issues

**Insecure localStorage Use for Auth State:**
- Issue: User objects (including emails) stored unencrypted in localStorage with predictable keys
- Files: `src/contexts/AuthContext.tsx` (lines 22-48, 104-108, 122-131)
- Impact: Any JavaScript code on page can access auth tokens; XSS vulnerabilities expose all user data; shared computers leak credentials
- Fix approach: Store minimal data in localStorage (only CSRF token if needed); use httpOnly secure cookies for auth tokens; implement session validation on every sensitive action

**User Database in localStorage:**
- Issue: All registered users stored in a single localStorage key `haste_users` as JSON array
- Files: `src/contexts/AuthContext.tsx` (lines 61-71, 105-108, 123-131)
- Impact: No data persistence across sessions; no real user database; all user data lost on browser clear; XSS compromise exposes all users; no privacy controls
- Fix approach: Implement real backend database (PostgreSQL, MongoDB); use secure session management; never store user list on frontend

**Subscription Status Mocked But Not Persisted:**
- Issue: Subscription status changed via `updateSubscriptionStatus` but only stored in localStorage, never synced with actual Stripe subscription
- Files: `src/contexts/AuthContext.tsx` (lines 117-133)
- Impact: Subscription status can be manually edited in localStorage; misleads users about actual payment status; metrics unreliable
- Fix approach: Query subscription status from Stripe API on every relevant page; store only minimal session data; sync subscription status via webhook from Stripe

## Architecture & Design Issues

**Duplicate Page Files Not Consolidated:**
- Issue: Multiple conflicting copies of same pages exist in different directories
- Files:
  - `src/pages/BlogPost.tsx` vs `src/pages/blog/BlogPost.tsx`
  - `src/pages/FigmaSchemaPost.tsx` vs `src/pages/blog/FigmaSchemaPost.tsx`
  - `src/pages/Privacy.tsx` vs `src/pages/product/Privacy.tsx`
  - `src/pages/Terms.tsx` vs `src/pages/product/Terms.tsx`
  - `src/pages/Refund.tsx` vs `src/pages/product/Refund.tsx`
- Impact: Unclear which version is canonical; routing issues if wrong version used; maintenance burden with duplicates; confusion for new developers
- Fix approach: Delete unused copies; consolidate to single source of truth; update routes to use correct paths; ensure no orphaned imports

**Multiple Routing Paths for Same Content:**
- Issue: `App.tsx` imports from `src/pages/` but `src/pages/blog/`, `src/pages/product/`, and `src/pages/studio/` subdirectories also exist
- Files: `src/App.tsx` (lines 1-75)
- Impact: Routing inconsistency; some pages unreachable from main router; dead code; unclear URL structure
- Fix approach: Audit all routes; consolidate redundant subdirectories; establish single routing convention; document URL structure

**No Error Boundary:**
- Issue: Application lacks error boundaries to catch React component errors
- Files: `src/App.tsx`
- Impact: Single component error crashes entire app; no graceful error handling; poor user experience on failures
- Fix approach: Add ErrorBoundary component to catch React errors; implement error fallback UI; log errors for debugging

**Hardcoded Pricing Data:**
- Issue: Pricing tiers hardcoded in component instead of fetched from backend
- Files: `src/pages/Checkout.tsx` (lines 18-21), `src/components/PricingPlans.tsx`
- Impact: Can't update prices without code changes; no A/B testing capability; pricing out of sync with Stripe
- Fix approach: Fetch pricing from backend or Stripe API; cache with React Query; invalidate on interval

## Performance Issues

**No Lazy Loading of Pages:**
- Issue: All page components imported upfront in `App.tsx`
- Files: `src/App.tsx` (lines 7-25)
- Impact: Initial bundle size larger; unused pages loaded; slow first paint for users not visiting all routes
- Fix approach: Use React.lazy() and Suspense for route-based code splitting

**Multiple Toast Libraries Loaded:**
- Issue: Both `@radix-ui/react-toast` and `sonner` imported but unclear which is primary
- Files: `src/App.tsx` (lines 1-2), package.json
- Impact: Unnecessary bundle weight; confusing which to use in new code; duplicate functionality
- Fix approach: Choose one toast library; remove unused one; update all components to use chosen solution

**Large Component Files:**
- Issue: Several page components exceed 300 lines, mixing content, logic, and styling
- Files:
  - `src/components/ui/sidebar.tsx` (637 lines)
  - `src/pages/EntertainmentShakeupPost.tsx` (354 lines)
  - `src/pages/FinalCutProPost.tsx` (333 lines)
- Impact: Difficult to maintain and test; high cognitive load; tight coupling of concerns
- Fix approach: Extract sections into smaller sub-components; separate data fetching from rendering; use composition pattern

**Math.random() Used in Sidebar Component:**
- Issue: Sidebar component uses `Math.random()` for width calculation
- Files: `src/components/ui/sidebar.tsx` (generates random width between 50-90%)
- Impact: Layout instability on re-renders; inconsistent appearance; potential performance impact
- Fix approach: Remove random behavior; use consistent CSS or responsive design; document why this was added if intentional

## Testing & Quality Issues

**No Test Coverage:**
- Issue: No test files exist anywhere in codebase; no testing framework configured
- Files: No `*.test.ts`, `*.spec.ts` files found
- Impact: No confidence in code changes; regressions introduced silently; refactoring very risky; integration bugs missed
- Fix approach: Add Jest or Vitest configuration; write tests for auth context (critical); add component tests for checkout flow

**No Type Safety for API Responses:**
- Issue: TypeScript strict mode disabled; `noImplicitAny: false`, `noUnusedParameters: false` in tsconfig
- Files: `tsconfig.app.json` (lines 18-22)
- Impact: API responses are `any` type; can't catch runtime errors; refactoring unsafe; developer mistakes hidden
- Fix approach: Enable strict TypeScript checking; fix type errors; add Zod/io-ts for API response validation

**Console.error Left in Production Code:**
- Issue: Console.error call logs to browser console in production
- Files: `src/pages/NotFound.tsx` (logs route pathname on 404)
- Impact: Potential information leak; debugging statements in production
- Fix approach: Remove console logs or gate behind debug flag; use proper error tracking (Sentry)

## Dependency & Version Concerns

**Relaxed TypeScript Configuration:**
- Issue: TypeScript configured with maximum leniency (strict: false, noImplicitAny: false, noUnusedLocals: false)
- Files: `tsconfig.app.json`
- Impact: Silent bugs; unsafe refactoring; hidden type errors; poor developer experience
- Fix approach: Gradually enable strict mode; fix type errors; add ESLint rules to enforce

**Old Stripe API Version:**
- Issue: Stripe API version hardcoded to old version (2025-05-28.basil)
- Files: `server.js` (line 14), `api/create-checkout-session.ts` (line 5)
- Impact: Missing new Stripe features; potential compatibility issues; deprecated endpoints
- Fix approach: Update to latest Stripe API version; review breaking changes; test thoroughly

**Missing Input Validation:**
- Issue: No server-side validation of user inputs; form validation only on frontend
- Files: `server.js` (lines 30-59)
- Impact: Frontend validation bypassed by crafted requests; invalid data reaches Stripe; potential errors
- Fix approach: Add Zod/Joi schema validation on backend for all inputs

## Production Readiness Issues

**No Environment Separation:**
- Issue: Only `FRONTEND_URL` and `API_URL` are environment-aware; Stripe keys hardcoded in `.env.local`
- Files: `.env.local`, `server.js`
- Impact: Can't deploy to multiple environments; test/staging/production keys mixed
- Fix approach: Set up proper environment files (.env.development, .env.staging, .env.production); use build-time substitution

**CORS Wildcard Pattern:**
- Issue: CORS origin configured to accept any localhost variation with hardcoded frontend URL
- Files: `server.js` (lines 18-21)
- Impact: In production, CORS could be misconfigured; only localhost works; cross-origin requests will fail
- Fix approach: Make CORS origins configurable per environment; validate origin properly

**No API Error Handling Consistency:**
- Issue: Checkout endpoint error handling differs from app patterns
- Files: `server.js` (lines 53-58), `src/hooks/useCheckout.ts` (lines 47-50)
- Impact: Inconsistent error reporting; hard to debug; client doesn't handle all error types
- Fix approach: Create standardized error response format; document error codes; test error paths

## Known Functional Gaps

**Manage Subscription Button Non-Functional:**
- Issue: "Manage Subscription" button on Account page has no click handler
- Files: `src/pages/Account.tsx` (lines 110-116)
- Impact: Users can't manage subscriptions; misleading UI; no link to Stripe customer portal
- Fix approach: Integrate Stripe customer portal; handle subscription cancellation; implement billing history view

**Next Billing Date Mock:**
- Issue: Next billing date calculated as hardcoded +1 month, not from Stripe subscription data
- Files: `src/pages/Account.tsx` (lines 13-21)
- Impact: Shows incorrect billing dates; misleads subscribers; inaccurate financial information
- Fix approach: Query actual subscription from Stripe API; display real next billing date

**Checkout Success Page Not Implemented:**
- Issue: `CheckoutSuccess` page likely exists but implementation details unclear
- Files: `src/pages/CheckoutSuccess.tsx`
- Impact: Users don't see confirmation; no order tracking; poor UX after payment
- Fix approach: Display order confirmation; verify session with backend; update user subscription status

**Sign In Return URL Decoded But Not Validated:**
- Issue: `returnUrl` parameter decoded and used in navigation without validation
- Files: `src/pages/SignIn.tsx` (lines 52-57)
- Impact: Potential open redirect vulnerability if returnUrl contains malicious URL
- Fix approach: Whitelist allowed return paths; validate URL is internal; prevent redirects to external domains

## Infrastructure Concerns

**Server.js Is Basic HTTP Not HTTPS:**
- Issue: Express server on port 3001 with no HTTPS or security headers
- Files: `server.js`
- Impact: No encryption in transit; susceptible to MITM attacks; production not ready; cookies not secure
- Fix approach: Add HTTPS with certificates; add security headers middleware; enable helmet.js

**No Logging or Monitoring:**
- Issue: Only basic console.error for errors; no structured logging or error tracking
- Files: `server.js` (line 54)
- Impact: Can't debug production issues; no error tracking; no usage analytics
- Fix approach: Add Winston/Pino logging; integrate Sentry or similar; set up uptime monitoring

**CORS Credentials Flag May Cause Issues:**
- Issue: `credentials: true` combined with specific origin - good practice, but may conflict with frontend
- Files: `server.js` (line 20)
- Impact: Cookies won't be sent if frontend doesn't specify credentials mode; potential CORS errors
- Fix approach: Ensure frontend fetch calls include `credentials: 'include'`; test CORS flow

## Data Integrity Issues

**No Idempotency for Checkout:**
- Issue: Creating checkout session has no idempotency key or deduplication
- Files: `server.js` (lines 30-59)
- Impact: Duplicate requests create multiple sessions; billing confusion; accidental double charges possible
- Fix approach: Add idempotency key to Stripe request; track created sessions to prevent duplicates; implement request deduplication

**Stripe Webhook Handling Missing:**
- Issue: No webhook handlers for Stripe events (subscription created, payment failed, renewal, etc.)
- Files: Not implemented
- Impact: User subscriptions not updated when Stripe events occur; customers never marked as "active"; failed payments not handled
- Fix approach: Implement webhook endpoint for Stripe; handle payment_intent.succeeded, customer.subscription.* events; update user subscription status

## Priority Assessment

**Critical (Fix Before Production):**
1. Remove committed credentials from repository
2. Implement real backend authentication with hashed passwords
3. Add server-side subscription verification
4. Implement Stripe webhook handling
5. Add CSRF protection to API endpoints

**High (Fix Soon):**
1. Enable TypeScript strict mode
2. Add input validation on backend
3. Implement error boundaries
4. Remove localStorage-based user database
5. Add basic test coverage for auth and checkout

**Medium (Fix This Quarter):**
1. Consolidate duplicate page files
2. Add rate limiting to API
3. Implement HTTPS/security headers
4. Add proper logging and error tracking
5. Implement subscription management flow

**Low (Refactoring/Optimization):**
1. Add lazy loading for routes
2. Reduce large component file sizes
3. Remove duplicate toast libraries
4. Add code splitting
5. Remove random styling in sidebar

---

*Concerns audit: 2026-01-20*
