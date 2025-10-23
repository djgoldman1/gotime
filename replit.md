# GoTime - Chicago Event Discovery Platform

## Overview
GoTime is a social calendar application focused on event discovery in Chicago. It provides personalized recommendations for sporting events, concerts, and entertainment through an intuitive calendar interface. Users can save favorites and receive recommendations based on their selected teams, artists, and venues, combining a visual-first design with intelligent preference tracking. The platform aims to offer a comprehensive solution for discovering and managing events, with future ambitions to expand features like event caching, user notifications, and calendar exports.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Frameworks**: React with TypeScript, Vite, Wouter for routing, TanStack React Query for server state.
- **UI/UX**: Radix UI primitives, shadcn/ui (New York style), Tailwind CSS, Class Variance Authority (CVA).
- **Design System**: Dark mode primary (with light mode support), custom color palette (sports: blue, music: purple), Inter font, responsive design (mobile breakpoint at 768px).
- **State Management**: React Query for asynchronous server state, local component state with React hooks.

### Backend Architecture
- **Server**: Express.js for HTTP server and API routing.
- **API Design**: RESTful endpoints (`/api` prefix), user-centric routes, Zod validation for type-safe requests/responses, consistent error handling.
- **Data Layer**: Storage abstraction (`IStorage` interface) with `DbStorage` using Drizzle ORM, ensuring separation of concerns.

### Database Architecture
- **ORM & Database**: Drizzle ORM with PostgreSQL dialect, Neon serverless PostgreSQL, `drizzle-zod` for runtime validation.
- **Schema**: `users` table, `user_preferences` table (teams, artists, venues), cascade deletion, identity columns for primary keys.
- **Migration**: Drizzle Kit for schema push and migration, schema definitions shared via `shared/schema.ts`.

### Project Structure
- **Monorepo**: `/client` (React frontend), `/server` (Express backend), `/shared` (shared types/schema).
- **Build**: Vite for client, esbuild for server, single-command production start.

### Key Architectural Decisions
- **Express + Vite over Next.js**: For clear frontend/backend separation and direct control.
- **Drizzle over Prisma**: For lighter weight, better TypeScript inference, and SQL-like query builder.
- **Radix UI + Tailwind**: For maximum flexibility, customization, and accessibility.
- **TanStack Query**: For declarative data fetching, caching, and simplified state management.
- **No Authentication System (Initial MVP)**: Intentional for MVP, planned for future implementation. *Note: Authentication has since been implemented using Replit Auth.*

### Implemented Features
- **Replit Auth Integration**: Secure authentication with OAuth (Google, GitHub, Apple, email/password), session management, user creation/upsert.
- **Ticketmaster API Integration**: Fetches 400+ real Chicago events, intelligent filtering by user preferences, rate limiting.
- **Smart Event Recommendation System**: Client-side filtering based on preferences, showing music events, team and venue-based filtering.
- **Advanced Calendar Features**: Dynamic title formatting, context-aware navigation, quick reset to today's date, date-filtered recommendations, month-to-day drilldown.
- **Database Schema**: Users, user preferences, and session tables with proper relationships and security.
- **Security Fixes**: Authentication guards on user-specific routes, session userId validation.
- **Spotify Integration**: Dual authentication strategy (Client Credentials for search, OAuth for import), live artist search (debounced), "Import from Spotify" (requires Extended Quota Mode approval), token caching.
- **Tastes Management Page**: Dedicated `/tastes` page for post-onboarding preference management (teams, artists, venues), real-time updates, integrated Spotify.

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Accessible component primitives.
- **shadcn/ui**: Pre-built components.
- **Lucide React**: Icon library.
- **cmdk**: Command palette.
- **date-fns**: Date manipulation.
- **react-day-picker**: Calendar date picker.
- **Recharts**: Charting library (configured).

### Database & Backend Services
- **Neon**: Serverless PostgreSQL database.
- **Drizzle ORM**: Type-safe database toolkit.
- **connect-pg-simple**: PostgreSQL session store.
- **Ticketmaster Discovery API**: Real-time event data.
- **Spotify Web API**: Artist search and user data.

### Development Tools
- **Replit Plugins**: Development banner, cartographer, runtime error modal.
- **TypeScript**: Type coverage.
- **ESBuild**: Fast bundling for server.
- **PostCSS**: CSS processing.

### Design Assets
- **Google Fonts**: Inter font family.
- **Generated Images**: Team logos and event imagery.