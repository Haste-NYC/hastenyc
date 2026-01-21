# Coding Conventions

**Analysis Date:** 2026-01-20

## Naming Patterns

**Files:**
- PascalCase for component files: `Header.tsx`, `PricingPlans.tsx`, `ProtectedRoute.tsx`
- camelCase for utility/hook files: `useCheckout.ts`, `use-toast.ts`
- kebab-case for UI component library: `alert-dialog.tsx`, `input-otp.tsx`, `scroll-area.tsx`
- Config files use camelCase or descriptive names: `stripe.ts`, `index.css`

**Functions:**
- PascalCase for React components: `Header`, `PricingPlans`, `AuthProvider`, `ScrollToTop`
- camelCase for utility functions and hooks: `useCheckout()`, `cn()`, `getStripe()`, `getPrice()`, `handleSelectPlan()`
- camelCase for event handlers: `handleSignOut()`, `handleSelectPlan()`, `onSubmit()`
- Prefix handler functions with `handle` or `on` pattern consistently

**Variables:**
- camelCase for state and local variables: `isLoading`, `isAuthenticated`, `user`, `selectedPlan`, `isYearly`
- camelCase for constants: `API_URL`, `AUTH_STORAGE_KEY` (or SCREAMING_SNAKE_CASE when truly constant)
- Boolean variables prefixed with `is`, `has`, `can`, `should`: `isLoading`, `isAuthenticated`, `isEnterprise`

**Types:**
- PascalCase for interfaces and types: `User`, `AuthContextType`, `CheckoutParams`, `UseCheckoutReturn`, `PricingTier`, `ProtectedRouteProps`, `SignInFormValues`
- Suffix with `Props` for component prop interfaces: `PricingPlansProps`, `ProtectedRouteProps`
- Suffix with `Type` for context types: `AuthContextType`
- Suffix with `Return` for hook return types: `UseCheckoutReturn`

## Code Style

**Formatting:**
- No explicit formatter configured (Prettier not detected in config files)
- ESLint enabled with TypeScript support
- Consistent use of semicolons throughout codebase
- Double quotes for strings (observed in all files)
- Trailing commas in multi-line objects/arrays

**Linting:**
- ESLint with TypeScript plugin and React hooks plugin
- Config: `eslint.config.js`
- Disabled rule: `@typescript-eslint/no-unused-vars` (set to "off")
- React Refresh warnings for non-component exports (set to "warn")
- React Hooks rules enforced

**TypeScript Settings:**
- Relaxed type checking enabled
- `noImplicitAny: false` - allows implicit any types
- `noUnusedParameters: false` - unused parameters not flagged
- `noUnusedLocals: false` - unused local variables not flagged
- `strictNullChecks: false` - null/undefined checks relaxed
- `strict: false` - overall strict mode disabled

## Import Organization

**Order:**
1. React and React ecosystem imports: `import { useState } from "react"`
2. External libraries: `import { useForm } from "react-hook-form"`, `import { zodResolver } from "@hookform/resolvers/zod"`
3. Local context/auth imports: `import { useAuth } from "@/contexts/AuthContext"`
4. Component imports: `import { Button } from "@/components/ui/button"`
5. Config imports: `import { stripeConfig } from "@/config/stripe"`
6. Utility imports: `import { cn } from "@/lib/utils"`
7. Icon/SVG imports: `import { Check, Users, Building2 } from "lucide-react"`

**Path Aliases:**
- `@/` resolves to `src/` directory
- Used consistently: `@/components/ui/button`, `@/hooks/useCheckout`, `@/contexts/AuthContext`, `@/config/stripe`, `@/lib/utils`

## Error Handling

**Patterns:**
- Try-catch blocks for async operations in hooks: `useCheckout.ts` wraps fetch calls
- Explicit error throwing with descriptive messages: `throw new Error("Email and password are required")`
- Context hooks validate usage with throw statements: `throw new Error("useAuth must be used within an AuthProvider")`
- Error propagation via toast notifications: `toast.error(errorMessage)` in `useCheckout.ts`
- Conditional error handling with type guards: `err instanceof Error ? err.message : 'Checkout failed'`
- State management of errors: `[error, setError] = useState<string | null>(null)`

**Console Usage:**
- Minimal logging observed
- Only found in `NotFound.tsx`: `console.error("404 Error: User attempted to access non-existent route:", location.pathname)`
- Generally not used for debugging in production components

## Logging

**Framework:** console (minimal/fallback usage)

**Patterns:**
- Primarily relies on component state and error boundaries
- Error logging only in edge cases (404 handling)
- Use `sonner` toast library for user-facing notifications
- Use `@/components/ui/toaster` for system notifications

## Comments

**When to Comment:**
- Inline comments for non-obvious logic: `// Singleton pattern to avoid creating multiple Stripe instances`
- Context explanations for API behavior: `// For demo purposes, accept any valid email/password format`
- Section headers in JSX: `{/* Header */}`, `{/* Form */}`, `{/* Billing Toggle */}`
- Warnings about important behaviors: `{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}`

**JSDoc/TSDoc:**
- Minimal usage observed
- Not required for simple functions
- Type definitions preferred over JSDoc comments

## Function Design

**Size:**
- Most functions 20-50 lines
- Keep components focused on single responsibility
- Extract repeated logic into separate functions: `getPrice()`, `getMonthlyEquivalent()`, `getYearlySavings()`

**Parameters:**
- Use destructuring for component props: `const Header = () => {}`
- Use object destructuring for hook parameters: `{ priceId, customerEmail }`
- Typed interfaces for function parameters: `CheckoutParams`, `PricingPlansProps`

**Return Values:**
- Hooks return objects with named properties: `{ isLoading, error, startCheckout }`
- Components return JSX.Element implicitly
- No null returns in components (prefer conditional rendering)
- Early returns for conditional logic patterns

## Module Design

**Exports:**
- Default exports for React components: `export default Header`
- Named exports for utility functions: `export function useAuth()`, `export function cn(...)`
- Named exports for constants: `export const stripeConfig = {...}`
- Named exports for types/interfaces: `export interface User {}`, `export interface AuthContextType {}`

**Barrel Files:**
- Not observed in the codebase
- Direct imports from files preferred

## Component Patterns

**Functional Components:**
- Arrow function pattern used in most places: `const Header = () => {}`
- Named function for provider components: `export function AuthProvider({ children }: { children: ReactNode })`
- React.forwardRef used for forwarding refs in UI components: `Button` component

**State Management:**
- `useState` for local component state
- Context API for global auth state (AuthContext)
- React Query (`@tanstack/react-query`) available but not heavily used
- localStorage for client-side persistence of auth data

**Styling:**
- Tailwind CSS utility classes exclusively
- Inline className strings for dynamic styles
- gradients: `bg-gradient-to-r from-pink-500 to-purple-500`
- Dark theme with black background and gray/pink accents
- Class variance authority (CVA) for component variants in UI library

---

*Convention analysis: 2026-01-20*
