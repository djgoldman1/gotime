# GoTime - Chicago Event Discovery Platform

## Overview

GoTime is a social calendar application focused on event discovery in Chicago. The platform provides personalized recommendations for sporting events, concerts, and entertainment, combining visual-first design with intelligent user preference tracking. Users can browse events through an intuitive calendar interface, save favorites, and receive recommendations based on their selected teams, artists, and venues.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack React Query for server state management and data fetching

**UI Component System**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library (New York style variant)
- Tailwind CSS for utility-first styling with extensive customization
- Class Variance Authority (CVA) for component variant management

**Design System**
- Dark mode as primary theme with light mode support
- Custom color palette: sports (blue), music (purple), success (green), warning (orange)
- Inter font family via Google Fonts
- Custom CSS variables for theming, elevation states, and button borders
- Responsive design with mobile breakpoint at 768px

**State Management**
- React Query for asynchronous server state
- Local component state with React hooks
- No global state management library (intentionally kept simple)

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Custom middleware for request logging and JSON body parsing
- HTTP-only architecture (no WebSocket connections)

**API Design Pattern**
- RESTful endpoints under `/api` prefix
- User-centric routes: `/api/user/:userId`, `/api/user/:userId/preferences`
- Type-safe request/response handling with Zod validation
- Consistent error handling with appropriate HTTP status codes

**Data Layer**
- Storage abstraction pattern (`IStorage` interface) for database operations
- `DbStorage` implementation using Drizzle ORM
- Separation of concerns: routes → storage layer → database

### Database Architecture

**ORM & Database**
- Drizzle ORM with PostgreSQL dialect
- Neon serverless PostgreSQL via `@neondatabase/serverless`
- WebSocket constructor configuration for serverless compatibility
- Schema-first approach with `drizzle-zod` integration for runtime validation

**Schema Design**
- **users** table: Basic user info with onboarding completion tracking
- **user_preferences** table: Flexible preference storage with type-based categorization (teams, artists, venues)
- Cascade deletion on user preferences when users are removed
- Auto-generated identity columns for primary keys

**Migration Strategy**
- Schema definitions in `shared/schema.ts` for frontend/backend sharing
- Drizzle Kit for schema push and migration management
- Database provisioning checked at startup with environment variable validation

### Project Structure

**Monorepo Layout**
- `/client` - React frontend with Vite
- `/server` - Express backend
- `/shared` - Shared TypeScript types and database schema
- Path aliases: `@/` for client source, `@shared/` for shared code, `@assets/` for static assets

**Build & Deployment**
- Development: Concurrent Vite dev server with Express middleware mode
- Production: Vite builds client to `dist/public`, esbuild bundles server to `dist`
- Single-command start for production serving

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Comprehensive set of accessible component primitives (accordion, dialog, dropdown, popover, tabs, toast, tooltip, etc.)
- **shadcn/ui**: Pre-built component implementations based on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command palette component for search functionality
- **date-fns**: Date manipulation and formatting
- **react-day-picker**: Calendar date picker component
- **Recharts**: Charting library (configured but not actively used)

### Database & Backend Services
- **Neon**: Serverless PostgreSQL database provider
- **Drizzle ORM**: Type-safe database toolkit
- **connect-pg-simple**: PostgreSQL session store (installed but sessions not implemented)

### Development Tools
- **Replit Plugins**: Development banner, cartographer, and runtime error modal for Replit environment
- **TypeScript**: Full type coverage across client, server, and shared code
- **ESBuild**: Fast bundling for production server code
- **PostCSS**: CSS processing with Autoprefixer

### Design Assets
- **Google Fonts**: Inter font family
- **Generated Images**: Team logos and event imagery stored in `attached_assets/generated_images/`

### Notable Architectural Decisions

**Why Express + Vite instead of Next.js**: Provides clear separation between frontend and backend, simpler deployment model, and direct control over server middleware and routing.

**Why Drizzle over Prisma**: Lighter weight, better TypeScript inference, SQL-like query builder that's closer to raw SQL for learning and control.

**Why Radix UI + Tailwind**: Maximum flexibility and customization while maintaining accessibility standards. No opinionated styling framework lock-in.

**Why TanStack Query**: Declarative data fetching with built-in caching, background refetching, and optimistic updates eliminates the need for complex state management.

**No Authentication System**: Currently using simple user ID-based routing without session management or authentication. This is intentional for MVP phase but should be implemented before production.