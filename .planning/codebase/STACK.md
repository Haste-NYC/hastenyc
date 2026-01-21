# Technology Stack

**Analysis Date:** 2026-01-20

## Languages

**Primary:**
- TypeScript 5.8.3 - Application code, strict null checks disabled, relaxed type checking
- JavaScript (ES2020) - Build configuration and utilities

**Secondary:**
- HTML5 - Document structure and SEO metadata
- CSS3 - Via Tailwind CSS, processed through PostCSS

## Runtime

**Environment:**
- Node.js 22.16.0+ (development and server)
- Browser - React 18.3.1 running in modern browsers (ES2020)

**Package Manager:**
- npm 10.9.2
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 18.3.1 - UI library and component framework
- React Router 6.30.1 - Client-side routing and page navigation
- Vite 5.4.19 - Build tool and development server (port 8080)

**UI & Components:**
- Radix UI (25+ components) - Headless UI component library
- Shadcn/ui (50+ components) - Built on Radix UI, component registry in `src/components/ui/`
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- Lucide React 0.462.0 - Icon library

**State Management:**
- React Query (TanStack Query) 5.83.0 - Server state management via `QueryClientProvider`
- React Context API - Local state for authentication via `AuthContext`
- localStorage - Persistent client-side storage for auth data

**Forms & Validation:**
- React Hook Form 7.61.1 - Form handling and state management
- Zod 3.25.76 - TypeScript-first schema validation

**Animation & Interaction:**
- Framer Motion 12.23.26 - Animation library for React components
- Embla Carousel 8.6.0 - Carousel/slider component library
- React Resizable Panels 2.1.9 - Resizable panel layouts

**Notifications:**
- Sonner 1.7.4 - Toast notifications (primary toast library)
- React Toaster (Radix UI) - Secondary toast/notification system

**Utilities:**
- React Helmet Async 2.0.5 - Dynamic HTML head management (SEO)
- Date-fns 3.6.0 - Date manipulation and formatting
- React Day Picker 8.10.1 - Calendar/date picker component
- Recharts 2.15.4 - React chart library
- CLSX 2.1.1 - Conditional className utility
- Tailwind Merge 2.6.0 - Tailwind CSS class merging

**Terminal/CLI:**
- cmdk 1.1.1 - Command menu component

## Backend & API

**Server:**
- Express 5.2.1 - Node.js web framework for API server
- CORS 2.8.5 - Cross-origin request handling middleware
- dotenv 17.2.3 - Environment variable loading

**Stripe Integration:**
- stripe (npm) 20.2.0 - Stripe Node.js SDK for server-side operations
- @stripe/stripe-js 8.6.3 - Stripe client-side library for frontend

## Build & Development

**Build Tool:**
- Vite 5.4.19 - Fast build tool and dev server with Hot Module Replacement
- @vitejs/plugin-react-swc 3.11.0 - React SWC compiler for faster builds

**CSS Processing:**
- PostCSS 8.5.6 - CSS transformations
- Autoprefixer 10.4.21 - Vendor prefix automation
- Tailwindcss-animate 1.0.7 - Tailwind animation utilities

**Code Quality:**
- ESLint 9.32.0 - JavaScript/TypeScript linting
- @typescript-eslint 8.38.0 - TypeScript-specific ESLint rules
- eslint-plugin-react-hooks 5.2.0 - React hooks linting
- eslint-plugin-react-refresh 0.4.20 - React Fast Refresh validation

**Type Checking:**
- TypeScript 5.8.3 - Language and type system

**Lovable Integration:**
- lovable-tagger 1.1.11 - Component tagging for Lovable.dev platform (development mode only)

## Configuration

**Environment:**
- `.env.local` - Local environment variables (Git-ignored)
- `.env.example` - Template for required environment variables
- `vite.config.ts` - Vite build configuration with React SWC plugin
- `tsconfig.json` - TypeScript configuration with relaxed checking
- `tailwind.config.ts` - Tailwind CSS theme configuration with brand colors
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint rules and plugins
- `components.json` - Shadcn/ui component configuration

**Path Aliases:**
- `@/` maps to `./src/` for clean import paths

## Platform Requirements

**Development:**
- Node.js 22.16.0+
- npm 10.9.2+
- Modern browser with ES2020 support
- Git (for Lovable.dev synchronization)

**Production:**
- Node.js 22.16.0+ (for Express API server)
- Modern browser with ES2020 support
- Stripe account with test/live keys configured
- SSL/TLS certificate for HTTPS

## Scripts

**Development:**
- `npm run dev` - Start Vite dev server (http://localhost:5173)
- `npm run server` - Start Express API server (port from `API_PORT` env var, default 3001)

**Build:**
- `npm run build` - Production build with Vite
- `npm run build:dev` - Development mode build

**Maintenance:**
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

---

*Stack analysis: 2026-01-20*
