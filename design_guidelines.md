# Design Guidelines: Social Calendar App

## Design Approach
**Selected Approach:** Reference-Based Design drawing inspiration from Spotify (music discovery aesthetic), Airbnb (card-based browsing), and Linear (modern calendar UI)

**Rationale:** Event discovery apps thrive on visual appeal and intuitive browsing. Users want to feel excited about events through compelling imagery and effortless navigation. The design prioritizes visual engagement while maintaining "dead simple" usability.

## Core Design Principles
1. **Visual-First Discovery:** Lead with imagery - team logos, artist photos, venue atmospheres
2. **Effortless Navigation:** Clear hierarchy, minimal cognitive load, intuitive interactions
3. **Personality Through Color:** Event categories distinguished by thoughtful color coding
4. **Dark Mode Native:** Modern entertainment-focused aesthetic with exceptional contrast

## Color Palette

### Dark Mode (Primary)
- **Background Primary:** 222 15% 11% (deep charcoal)
- **Background Secondary:** 222 13% 15% (elevated surfaces, cards)
- **Background Tertiary:** 222 12% 20% (hover states, subtle elevation)
- **Text Primary:** 0 0% 98% (high contrast)
- **Text Secondary:** 0 0% 70% (metadata, labels)
- **Text Tertiary:** 0 0% 50% (disabled, low emphasis)

### Light Mode (Secondary)
- **Background Primary:** 0 0% 99%
- **Background Secondary:** 0 0% 96%
- **Text Primary:** 222 15% 15%
- **Text Secondary:** 222 12% 40%

### Brand & Accent Colors
- **Primary Brand:** 230 65% 58% (vibrant blue - for sports events, primary CTAs)
- **Music Accent:** 280 55% 62% (purple - for concerts/music events)
- **Success/Saved:** 142 70% 45% (green for bookmarked events)
- **Warning/Urgent:** 25 85% 60% (orange for limited tickets, trending)

## Typography

**Font Stack:** 
- Primary: 'Inter' via Google Fonts (clean, modern, excellent readability)
- Fallback: system-ui, -apple-system, sans-serif

**Type Scale:**
- Hero/Display: text-5xl to text-6xl, font-bold (event titles, onboarding headlines)
- Page Headers: text-3xl to text-4xl, font-semibold (section titles)
- Card Titles: text-xl, font-semibold (event names in feed)
- Body Text: text-base, font-normal (descriptions, details)
- Metadata: text-sm, font-medium (dates, venues, prices)
- Labels: text-xs to text-sm, font-medium, uppercase tracking-wide (category tags)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 8, 12, 16, 24
- Tight spacing: p-2, gap-2 (compact elements)
- Standard spacing: p-4, gap-4, m-8 (most UI components)
- Generous spacing: p-8, py-12, py-24 (section padding, major separations)

**Container Strategy:**
- Max width: max-w-7xl for main content
- Calendar container: max-w-6xl (optimal for week/month views)
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

**Responsive Breakpoints:**
- Mobile: base (single column)
- Tablet: md:grid-cols-2 (two-column layouts)
- Desktop: lg:grid-cols-3 (three-column event grids)

## Component Library

### Authentication & Onboarding
- **Login Screen:** Centered card with Replit Auth buttons, clean white/dark card on subtle gradient background
- **Onboarding Flow:** Multi-step wizard with progress indicator, large searchable selection cards for teams/artists, prominent "Skip for now" option

### Navigation
- **Top Nav:** Fixed header with logo left, profile/settings right, clean divider border
- **Mobile Nav:** Bottom tab bar with Calendar, Discover, Saved, Profile icons

### Calendar Component
- **Week View (Default):** 7-column grid, today highlighted with brand color accent, events as colored pills with icons
- **Day View:** Vertical timeline with hour markers, events as cards with full details
- **Month View:** Compact grid, color-coded dots for event types, hover reveals event names
- **Calendar Controls:** Clean toggle buttons for view modes, date picker dropdown

### Event Cards
- **Feed Cards:** 
  - Aspect ratio 16:9 or 3:2 image/logo at top
  - Event title (text-xl font-semibold)
  - Metadata row: date icon + date, venue icon + venue name
  - Price badge in corner (if available)
  - Category color accent on left border (4px)
  - Hover: subtle lift (shadow-lg) and scale(1.02)

- **Detail Page Hero:**
  - Full-width banner image with gradient overlay
  - Event title (text-5xl), date, venue overlaid
  - CTA buttons: Save (outline), Share (outline), Add to Calendar (solid)
  - Ticket pricing and vendor links below hero

### Filters & Search
- **Search Bar:** Prominent with icon, rounded-lg, dark mode optimized
- **Filter Pills:** Rounded-full chips for categories (Sports, Music, etc.), active state with brand color fill
- **Date Range Picker:** Subtle calendar dropdown

### Interactive Elements
- **Buttons:**
  - Primary: bg-brand, rounded-lg, px-6 py-3, font-medium, shadow hover effect
  - Outline: border-2, bg-transparent with backdrop-blur when on images
  - Icon buttons: rounded-full, p-3, subtle hover background
  
- **Cards:** rounded-xl, subtle border in dark mode, shadow on hover, smooth transitions

## Images

**Required Images:**
1. **Event Cards:** Team logos (circular or square), artist photos, venue exteriors - aspect ratio 16:9 or 3:2
2. **Event Detail Hero:** Wide banner images (21:9 or 16:9) - stadium atmosphere for sports, concert stage for music
3. **Category Icons:** Sports (🏈), Music (🎵), Theater (🎭) - use icon library or emoji
4. **Profile/Onboarding:** Team logos, artist thumbnails for preference selection

**Image Treatment:**
- Rounded corners (rounded-lg to rounded-xl)
- Subtle overlays for text readability
- Lazy loading for performance

## Animations

**Minimal & Purposeful:**
- Card hover: transform scale(1.02), transition 200ms
- Page transitions: Simple fade or slide (300ms)
- Calendar event additions: Brief highlight flash
- Loading states: Subtle skeleton screens (not spinners)
- **Avoid:** Excessive parallax, auto-playing carousels, bouncing elements

## Accessibility
- Maintain WCAG AA contrast ratios in dark mode
- Focus states: 2px outline with brand color
- Keyboard navigation for calendar (arrow keys)
- Screen reader labels for icon-only buttons
- Color-blind friendly event categorization (use icons + color)

---

**Design Philosophy:** The app should feel like a curated discovery experience - visually engaging enough to inspire spontaneous event attendance, yet organized enough to never feel overwhelming. Every element should either inform, delight, or get out of the way.