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
- **connect-pg-simple**: PostgreSQL session store for secure sessions
- **Ticketmaster Discovery API**: Real-time event data for Chicago area
- **Spotify Web API**: Artist search and user's top artists for personalized music preferences

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

## Recent Development Session (October 23, 2025)

### ✅ Completed Features

**1. Replit Auth Integration**
- Implemented secure authentication with OAuth support (Google, GitHub, Apple, email/password)
- Users can log in without needing a Replit account
- Session management with PostgreSQL-backed sessions
- User creation/upsert during OAuth callback
- Protected all user-specific API routes with authentication middleware

**2. Ticketmaster API Integration**
- Connected to Ticketmaster Discovery API
- Fetching 400+ real Chicago events (200 sports + 200 music)
- Intelligent filtering based on user preferences (teams, artists, venues)
- Rate limiting protection with sequential API calls and delays
- Event categorization (sports vs music)

**3. Smart Event Recommendation System**
- Fetch all Chicago events approach for maximum flexibility
- Filter events client-side based on user preferences
- Currently showing all music events (relaxed filtering for better discovery)
- Team-based filtering working perfectly
- Venue-based filtering

**4. Advanced Calendar Features**
- **Smart Date Navigation**: Dynamic title format based on view mode
  - Day view: "Wed, October 23, 2025"
  - Week view: "Oct 23-29, 2025"
  - Month view: "October 2025"
- **Context-Aware Navigation**: Arrows increment by day/week/month based on current view
- **Logo Quick Reset**: Click GoTime logo to return to Week view with today's date
- **Month-to-Day Drilldown**: Click date numbers in month view to switch to day view
- **Date-Filtered Recommendations**: Recommended Events section automatically filters based on selected date range
  - Day view shows only events on that specific day
  - Week view shows events in that week
  - Month view shows events in that month
- Fixed date filtering - events now correctly match calendar dates
- Month view: Click event icon to see detail popup
- Larger event icons (6x6 pixels) in month view
- Shows up to 6 events per day in month view
- Removed color legend from month view for cleaner UI

**5. Database Schema**
- Users table with onboarding completion tracking
- User preferences table (teams, artists, venues)
- Proper cascade deletion
- Session storage table

**6. Security Fixes**
- Added authentication guards to all user-specific routes
- Session userId validation (prevents unauthorized access)
- Fixed onboarding preference submission (removed null itemImage issue)

**7. Spotify Integration** (October 23, 2025 - Latest)
- Integrated Spotify Web API via Replit connector for OAuth handling
- Live artist search during onboarding using Spotify's catalog (300ms debounced)
- "Import from Spotify" button fetches user's top 100 artists
- Automatic deduplication with existing selections
- Remote artist tracking in UI - searched/imported artists persist in badge list
- Token caching with automatic refresh for performance
- Loading states for search and import operations
- Success/error toast notifications for user feedback

### 🎨 Current Features

- **400+ Real Chicago Events** from Ticketmaster API
- **Spotify Integration** for artist discovery and import
- **Interactive Calendar** with day/week/month views
- **Smart Filtering** by teams, artists, and venues
- **Secure Authentication** with multiple OAuth providers
- **Beautiful Dark Mode** design
- **Responsive Layout** works on all devices

### 🔔 IMPORTANT REMINDERS

**⚠️ TO DO WHEN ON DESKTOP:**

1. **CONNECT TO GITHUB** 
   - Open Git pane (left sidebar)
   - Click "Create new repository on GitHub"
   - Name: `gotime`
   - Description: "Intelligent event discovery and calendar web app for Chicago"
   - Commit message: "Initial commit - GoTime MVP with Ticketmaster integration"
   - This enables issue tracking and collaboration

2. **PUBLISH THE APP**
   - Click "Publish" or "View Deployments" button
   - Choose "Autoscale" deployment type
   - Get public URL (gotime.replit.app)
   - Share with anyone - no Replit account required!

### 📋 Known Issues to Track

- EventDetailModal missing description attribute (accessibility warning)
- Consider adding caching for Ticketmaster API responses
- Music filtering could be enhanced with genre-based filtering
- Could add favorite/saved events feature
- Monitor Spotify connector credential rotation in production logs
- Consider persisting Spotify artist IDs alongside names for richer future features

### 🚀 Next Steps

1. Connect to GitHub (when on desktop)
2. Publish the app to production
3. Set up GitHub Issues for bug tracking
4. Monitor Spotify integration metrics (search/import success rates)
5. Consider adding:
   - Event caching to reduce API calls
   - User favorites/bookmarks
   - Email notifications for upcoming events
   - Calendar export (iCal/Google Calendar)
   - Genre-based music filtering
   - Spotify playlist creation from favorited events