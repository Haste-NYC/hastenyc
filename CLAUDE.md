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

## Testing and Development

**IMPORTANT**: Use the `/web-dev` skill for all debugging, development, and testing tasks that require visual verification.

The `/web-dev` skill will:
- Launch the Vite dev server on an available port
- Open Chrome with Claude for Chrome extension attached
- Enable visual testing, screenshot capture, and browser automation

```bash
# In Claude Code, run:
/web-dev
```

This provides access to:
- Live screenshots of the running app
- Click, type, scroll interactions
- Console log monitoring
- Network request inspection
- Element finding by description

## Project Architecture

This is a React-based web application for Haste Conform Studio, built with TypeScript and modern web technologies.

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

## Ralph - Autonomous Agent Loop

This project includes Ralph, an autonomous agent loop system that uses Claude Code to implement features from a PRD (Product Requirements Document).

### How Ralph Works

1. **Fresh context per iteration** - Each iteration spawns a new Claude Code instance with no memory
2. **State persists through files** - `prd.json`, `progress.txt`, and git history maintain state
3. **One story per iteration** - Agent picks highest priority incomplete story and implements it
4. **Quality gates** - Each story must pass typecheck/lint before marking complete

### Ralph Files

| File | Purpose |
|------|---------|
| `ralph.sh` | Main loop script |
| `prd.json` | Task list with user stories (create this for each feature) |
| `prd.json.example` | Template for prd.json format |
| `progress.txt` | Append-only learning log (auto-created) |
| `RALPH_INSTRUCTIONS.md` | Instructions passed to each iteration |
| `.ralph/archive/` | Previous completed runs |

### Usage

```bash
# Step 1: Create a PRD
claude  # then use /prd skill to generate PRD markdown

# Step 2: Convert PRD to prd.json
claude  # then use /ralph skill to convert to JSON format

# Step 3: Run the loop
./ralph.sh           # Default: 10 iterations max
./ralph.sh 20        # Custom iteration limit
```

### Creating Good User Stories

Stories must be completable in ONE context window:

**Right-sized:**
- Add a component to an existing page
- Update server action logic
- Add a form field with validation
- Create a new API endpoint

**Too big (split these):**
- "Build entire dashboard"
- "Add authentication system"
- "Refactor the API layer"

### Story Dependencies

Order stories by dependency (earlier stories cannot depend on later ones):
1. Schema/database changes
2. Backend/server actions
3. UI components
4. Dashboard/aggregation views

### Skills

- `/web-dev` - Launch dev server with Chrome for visual testing/debugging
- `/prd` - Generate a PRD from a feature description (asks clarifying questions)
- `/ralph` - Convert PRD markdown to prd.json format
