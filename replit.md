# Overview

This is a lottery analysis web application called "THE CHEAT" that tracks Pick 3 and Pick 4 lottery numbers, analyzing patterns, gaps, streaks, and repeats to help users identify trends. The application provides statistical insights into lottery drawings including which numbers haven't hit in a while (gaps/droughts), which numbers are hitting frequently (hot streaks), and which numbers show repeat patterns. It also includes an ROI calculator to help users understand potential returns on their lottery investments.

The application uses a modern full-stack architecture with React frontend, Express backend, and PostgreSQL database with Drizzle ORM.

## Recent Changes (October 5, 2025)

**Uniform Layout Structure:** All three analysis pages (Gaps, Streaks, Repeats) now follow an identical layout structure while maintaining unique color themes:

1. **Hero Box** - Page-specific colored header with title (Red for Gaps, Green for Streaks, Purple for Repeats)
2. **Quick Stats** - Three-column statistics card
3. **Search & Filter** - Search input and sort dropdown
4. **Data Table** - Main analysis table with detailed information
5. **Number Grid Preview** - Grid of 40 number boxes showing filtered results

**Search Functionality:** All pages now have consistent search filtering that updates both the data table and number grid preview simultaneously. The search uses case-insensitive number matching.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Problem:** Need a modern, responsive UI with real-time data visualization for lottery analysis.

**Solution:** React-based Single Page Application (SPA) with TypeScript, using Vite as the build tool and development server.

**Key Components:**
- **UI Framework:** React 18+ with TypeScript for type safety
- **Routing:** Wouter for lightweight client-side routing
- **State Management:** Zustand for global state (game type selection), TanStack Query for server state management and data fetching
- **Component Library:** Radix UI primitives with shadcn/ui for accessible, customizable components
- **Styling:** Tailwind CSS with custom design tokens, dark theme with gold/orange accent colors
- **Form Handling:** React Hook Form with Zod validation

**Rationale:** This stack provides excellent developer experience with hot module reloading, strong typing, and efficient data caching. TanStack Query eliminates the need for manual cache management and provides automatic background refetching.

## Backend Architecture

**Problem:** Need a simple, fast API server to serve lottery data and perform calculations.

**Solution:** Express.js REST API with TypeScript, using ESM modules.

**Key Design Decisions:**
- **RESTful API endpoints:** Simple GET routes for data retrieval (`/api/gaps/:gameType`, `/api/streaks/:gameType`, etc.)
- **Middleware:** Express JSON parsing with raw body capture for potential webhook integrations
- **Development Mode:** Vite middleware integration for seamless dev experience
- **Production Mode:** Static file serving with pre-built client assets
- **Storage Abstraction:** Interface-based storage layer (`IStorage`) allowing for easy swapping of data sources

**Pros:** 
- Simple, well-understood REST architecture
- Easy to extend with new endpoints
- TypeScript provides type safety across client and server

**Cons:**
- No built-in real-time capabilities (would need WebSockets if required)
- Session management not currently implemented

## Data Storage

**Problem:** Need to store and query lottery draw history, analysis results, and watch lists efficiently.

**Solution:** PostgreSQL database with Drizzle ORM for type-safe queries.

**Database Schema:**
- **lottery_draws:** Historical draw data (number, date, game type, draw type, fireball)
- **gap_analysis:** Tracks numbers that haven't appeared (drought tracking)
- **streak_analysis:** Tracks numbers appearing frequently (hot numbers)
- **repeat_analysis:** Tracks numbers with repeating patterns (weekly, consecutive, same day)
- **quad_triple_watch:** Tracks special patterns (quads for Pick 4, triples for Pick 3)

**Key Features:**
- UUID primary keys for all tables
- Timestamp tracking for auditing
- Status fields for categorizing severity/activity levels
- PostgreSQL-specific features via `@neondatabase/serverless`

**Rationale:** Drizzle provides excellent TypeScript integration with schema-to-type generation via `drizzle-zod`. PostgreSQL offers robust querying capabilities for complex lottery analysis patterns.

## Authentication & Authorization

**Status:** Not currently implemented. The application appears to be public-facing without user accounts.

**Future Consideration:** Session management infrastructure is partially in place (`connect-pg-simple` dependency) suggesting user accounts may be planned.

## Code Organization

**Monorepo Structure:**
- `/client` - React frontend application
  - `/src/pages` - Route components (landing, gaps, streaks, repeats, watch, calculator)
  - `/src/components` - Reusable UI components including shadcn/ui library
  - `/src/hooks` - Custom React hooks for data fetching and utilities
  - `/src/lib` - Utility functions
- `/server` - Express backend
  - `index.ts` - Application entry point
  - `routes.ts` - API route definitions
  - `storage.ts` - Data access layer interface
  - `vite.ts` - Vite integration for development
- `/shared` - Shared TypeScript types and schemas
  - `schema.ts` - Database schema and Zod validation schemas
- `/migrations` - Database migration files (Drizzle Kit)

**Path Aliases:**
- `@/*` - Client source files
- `@shared/*` - Shared schemas and types

## Build & Deployment

**Development:**
- `npm run dev` - Starts Express server with Vite middleware for HMR
- TypeScript compilation happens on-the-fly via `tsx`

**Production:**
- `npm run build` - Builds client with Vite, bundles server with esbuild
- `npm start` - Runs production server from `/dist`
- Client assets served from `/dist/public`

**Database:**
- `npm run db:push` - Pushes schema changes to database using Drizzle Kit

# External Dependencies

## Database
- **PostgreSQL** via Neon Database (`@neondatabase/serverless`) - Serverless Postgres with WebSocket connections
- **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`) - Type-safe database toolkit
- **Connection Pooling:** Built into Neon's serverless driver

## UI Component Libraries
- **Radix UI** - Unstyled, accessible component primitives (accordion, dialog, dropdown, select, tabs, toast, etc.)
- **shadcn/ui** - Pre-styled Radix components with Tailwind CSS
- **Lucide React** - Icon library
- **Embla Carousel** - Carousel/slider component
- **cmdk** - Command menu component

## Utilities
- **TanStack Query** - Server state management and data fetching
- **React Hook Form** - Form state management
- **Zod** - Runtime schema validation
- **date-fns** - Date manipulation
- **Zustand** - Lightweight state management
- **Wouter** - Minimal routing library
- **class-variance-authority** - CSS variant management
- **tailwind-merge** - Tailwind class merging utility

## Build Tools
- **Vite** - Build tool and dev server
- **esbuild** - Fast JavaScript bundler (for server builds)
- **tsx** - TypeScript execution for Node.js
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS transformation tool

## Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` - Error overlay
- `@replit/vite-plugin-cartographer` - Development tooling
- `@replit/vite-plugin-dev-banner` - Development banner

## API Endpoints Structure

**Current Endpoints:**
- `GET /api/gaps/:gameType` - Returns gap analysis data
- `GET /api/streaks/:gameType` - Returns streak analysis data  
- `GET /api/repeats/:gameType` - Returns repeat pattern data
- `GET /api/watch/:gameType` - Returns quad/triple watch numbers
- `GET /api/stats/:gameType` - Returns game statistics (referenced in code but not shown in routes)
- `GET /api/search/:gameType?q=` - Search functionality (referenced in hooks but not shown in routes)
- `POST /api/calculate-roi` - ROI calculation endpoint (referenced in calculator page but not shown in routes)

**Missing Implementation:** The storage layer interface is defined but concrete implementation is not shown in the provided files, suggesting it needs to be completed.