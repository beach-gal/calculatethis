# CalculateThis.org - Online Calculator Platform

## Overview

CalculateThis.org is a comprehensive online calculator platform offering over 200 calculators across multiple categories (Math, Finance, Health, and Other). It provides both authenticated and unauthenticated experiences, with authenticated users able to track their calculation history. The platform aims to be a go-to resource for a wide range of calculation needs, from everyday math to specialized financial and health metrics. A key ambition is to enable users to create custom calculators using AI, significantly expanding the platform's utility and user engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Technologies

The platform is built with a modern TypeScript stack, featuring a React frontend (Vite, Wouter, TanStack Query, shadcn/ui, Tailwind CSS) and an Express.js backend (Node.js, Drizzle ORM, Neon PostgreSQL).

### Frontend Architecture

- **Component Library**: shadcn/ui (Radix UI + Tailwind) for customizable, accessible components. Components are copied into the project for full control.
- **Routing**: Wouter for lightweight client-side routing, handling authentication-aware rendering.
- **State Management**: TanStack Query manages all server state, reducing the need for traditional state management libraries for data fetching.
- **Styling**: Tailwind CSS with CSS variables enables flexible theming, including light and dark modes.

### Backend Architecture

- **Database ORM**: Drizzle ORM provides type-safe database interactions with PostgreSQL.
- **Session Management**: `express-session` with `connect-pg-simple` ensures persistent session storage in PostgreSQL, suitable for the Replit deployment environment.
- **Monorepo**: Client and server code share a single repository, including shared TypeScript schema types.
- **API Design**: RESTful endpoints (`/api` prefix) with authentication middleware for protected routes.

### Database Schema

PostgreSQL is used with Drizzle ORM. Key tables include:
- `sessions`: Stores Express session data.
- `users`: Stores user profiles from Replit Auth (OIDC).
- `calculator_usage`: Tracks calculation history for both authenticated and unauthenticated users.
- `calculators`: Stores definitions for dynamic calculators.
- `ad_codes`: Manages advertisement code snippets.
- `admin_users`: Defines platform administrators.
- `settings`: Stores key-value site configurations.

### Authentication & Authorization

- **Replit Authentication (OpenID Connect)**: Leverages Passport.js and `openid-client` for seamless integration with Replit's OIDC provider.
- **Session-based**: Authentication relies on PostgreSQL-backed sessions.
- **Authorization**: Simple authenticated/unauthenticated model, with an `isAdmin` middleware for admin-specific routes.

### Calculator Engine

- **Registry-based Architecture**: A `calculatorConfig.ts` registry maps calculator slugs to handler types and form fields.
- **Handler-based Logic**: `calculatorHandlers.ts` contains calculation logic categorized by type (arithmetic, finance, health, conversion, etc.).
- **Dynamic Forms**: `calculatorFormsNew.ts` generates dynamic form fields based on configurations, providing sensible fallbacks and smart type detection.
- **Unit Conversions**: Defaults to imperial units for all conversions.

### AI-Powered Custom Calculator Builder

- **Overview**: Allows users to describe a calculator in plain English, and AI generates a functional calculator.
- **AI Generation**: Uses Replit AI Integrations (OpenAI-compatible) to generate calculator name, description, input fields, and `mathjs` formula.
- **Secure Formula Execution**: Formulas are executed server-side with a multi-layered security architecture:
    1.  **Character Whitelist**: Allows safe math operators, comparisons (`<`, `>`, `=`), ternary operators (`?`, `:`), and logical operators (`!`, `&`, `|`).
    2.  **Pattern Blocklist**: Blocks dangerous patterns (e.g., `[]`, `.` for property access, keywords like `eval`, statement separators).
    3.  **Input Validation**: Converts all user inputs to numbers and rejects invalid values.
    4.  **Safe Evaluation**: Uses `mathjs.evaluate()` which is AST-based and prevents arbitrary code execution.
    5.  **Result Validation**: Ensures results are valid numbers.

### Admin Dashboard

- **Purpose**: Provides centralized management for site configuration (advertising, administrators, contact settings).
- **Access Control**: Protected by `isAuthenticated` and `isAdmin` middleware.
- **Features**:
    -   **Ad Codes Management**: Add, activate, and manage ad snippets.
    -   **Administrators Management**: Add/remove admin users.
    -   **Settings Management**: Configure site settings like contact email.

### Ad Placement System

- **Purpose**: Display active ad codes across all calculator pages with strategic placement.
- **Component**: Reusable AdSlot component that fetches and renders ads by location.
- **Locations**: header (top of pages), sidebar (right side on calculator pages), inline (between content), footer (bottom of pages).
- **Page Coverage**: Landing page, individual calculator pages, and AI-generated calculator pages all include ad placements.
- **Ad Rotation**: Randomly selects one ad when multiple active ads exist for a location.
- **Global Toggle**: Admins can enable/disable all ads globally via Settings tab to adjust spacing. Uses public `/api/settings/ads_enabled` endpoint accessible to all users.
- **Integration**: Managed through admin dashboard; changes take effect immediately on page reload.

### Community Built Calculators

- **Purpose**: Showcase user-created AI calculators on the homepage to inspire and engage visitors.
- **Creator Attribution**: Users can optionally add their name when creating calculators, which is displayed with special purple styling on featured calculators.
- **Featured System**: Admins can mark calculators as "featured" to display them in the Community Built section on the landing page.
- **Admin Management**: New "Community Calculators" tab in admin dashboard lists all AI-generated calculators with toggle switches to feature/unfeature them.
- **Display**: Featured calculators appear in a dedicated section on the homepage with special styling (gradient backgrounds, AI-Generated badges, creator names).
- **Schema**: `calculators` table includes `featured` column (0 or 1), `creator_name` (nullable varchar), and `fields` (jsonb) to store field definitions.
- **API**: 
  - Public endpoint `/api/calculators/featured/list` returns up to 6 featured calculators for homepage display
  - Public endpoint `/api/calculators/slug/:slug` fetches individual calculators by slug for viewing
- **Routes**: 
  - `/custom-calculator` - AI calculator builder
  - `/custom-calculator/:slug` - View individual saved calculator with inputs and calculation
  - `/community-calculators` - Browse all featured community calculators
- **Landing Page Display**: Compact teaser showing 3 featured calculators with a "View All" link to the dedicated community page.

## External Dependencies

1.  **Neon PostgreSQL**: Serverless PostgreSQL database solution.
2.  **Replit Authentication Service**: OIDC provider for user identity.
3.  **Google Fonts**: Inter and Roboto Mono font families for typography.
4.  **Vite**: Build tool and development server.
5.  **esbuild**: Backend bundling for production.
6.  **tsx**: TypeScript execution for development.
7.  **Tailwind CSS**: Utility-first CSS framework.
8.  **Drizzle Kit**: Database migration tool.
9.  **Radix UI**: Unstyled component primitives (via shadcn/ui).
10. **react-hook-form**: Form validation.
11. **date-fns**: Date manipulation utility.
12. **lucide-react**: Icon library.
13. **mathjs**: For safe mathematical expression evaluation in custom calculators.