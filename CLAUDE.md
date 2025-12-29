# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

This is a React-based web application for Conform Studio, built with TypeScript and modern web technologies.

### Key Technology Stack
- **Vite** - Build tool and dev server
- **React 18** with React Router for client-side routing
- **TypeScript** - With relaxed type checking (no implicit any warnings, no unused parameter warnings)
- **Shadcn/ui** - Comprehensive component library (50+ components in `/src/components/ui`)
- **Tailwind CSS** - Utility-first CSS with custom brand colors and animations
- **React Query (TanStack Query)** - Server state management
- **React Hook Form + Zod** - Form handling and validation

### Project Structure
- `/src/pages/` - Page components (Index, BlogPost, FigmaSchemaPost, NotFound)
- `/src/components/ui/` - Shadcn UI components (extensive library)
- `/src/assets/` - Static images and media files
- `/src/lib/` - Utility functions
- `/src/hooks/` - Custom React hooks
- `@/` - Path alias configured to `/src/` directory

### Routing
Routes are defined in `src/App.tsx`. When adding new routes, ensure they are placed ABOVE the catch-all "*" route to prevent 404 handling from intercepting them.

### TypeScript Configuration
The project uses relaxed TypeScript settings:
- `noImplicitAny: false`
- `noUnusedParameters: false`
- `noUnusedLocals: false`
- `strictNullChecks: false`

### Important Notes
- This is a Lovable.dev project with automatic Git synchronization
- No test framework is currently configured
- The project uses both Toaster and Sonner for notifications
- Path imports use the `@/` alias (e.g., `@/components/ui/button`)