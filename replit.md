# CalculateThis.org - Online Calculator Platform

## Overview

CalculateThis.org is a comprehensive online calculator platform offering over 200 calculators across multiple categories (Math, Finance, Health, and Other). The application provides both authenticated and unauthenticated experiences, with authenticated users able to track their calculation history. Built with a modern TypeScript stack, the platform features a React frontend with shadcn/ui components and an Express backend with PostgreSQL database storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as build tool and dev server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with CSS variables for theming

**Design Decisions:**
- **Component Library Choice**: Uses shadcn/ui (Radix UI + Tailwind) instead of a traditional component library. This provides accessible, unstyled components that can be customized while maintaining consistency. Components are copied into the project rather than imported from a package, allowing full control.
- **Routing Strategy**: Wouter chosen over React Router for its minimal footprint and simpler API. The application uses a centralized Router component in App.tsx that handles authentication-aware route rendering.
- **State Management**: TanStack Query handles all server state, eliminating need for Redux/Context API for data fetching. Custom hooks (useAuth) encapsulate query logic.
- **Styling Approach**: Tailwind with CSS variables allows theme customization through HSL color values defined in index.css. Supports both light and dark modes through class-based theme switching.

**Key Architectural Patterns:**
- Path aliases (@/, @shared/) configured in both tsconfig.json and vite.config.ts for clean imports
- Custom query client with default options (no refetch on window focus, infinite stale time)
- Credential-based authentication flow with session cookies
- Responsive design with mobile-first breakpoints

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js
- TypeScript with ESM modules
- Drizzle ORM for database operations
- Neon serverless PostgreSQL driver
- Passport.js with OpenID Connect for Replit authentication
- express-session with connect-pg-simple for session storage

**Design Decisions:**
- **Database ORM**: Drizzle chosen for type-safe database queries with minimal runtime overhead. Schema defined in shared/schema.ts allows type sharing between frontend and backend.
- **Session Management**: PostgreSQL-backed sessions (connect-pg-simple) instead of memory/Redis for persistence across server restarts. Required for Replit deployment environment.
- **Monorepo Structure**: Client and server code in same repository with shared schema types. Build process handles both frontend (Vite) and backend (esbuild) compilation.
- **API Design**: RESTful endpoints under /api prefix. Authentication middleware (isAuthenticated) protects sensitive routes.
- **Development Experience**: Vite dev server proxies API requests in development. Custom logging middleware tracks API response times and payloads.

**Storage Layer (server/storage.ts):**
- Interface-based design (IStorage) allows swapping implementations
- DatabaseStorage implements all CRUD operations using Drizzle
- Separates concerns: routes handle HTTP, storage handles data access

### Database Schema

**PostgreSQL with Drizzle ORM:**

**Core Tables:**
1. **sessions**: Express session storage (required for authentication)
   - sid (primary key), sess (jsonb), expire (timestamp with index)

2. **users**: User profiles from Replit Auth
   - id, email, firstName, lastName, profileImageUrl, timestamps
   - Automatically populated via OIDC integration

3. **calculator_usage**: Tracks user calculation history
   - References users table (nullable for unauthenticated calculations)
   - Stores inputs (jsonb), result (text), calculator metadata

4. **calculators**: Calculator definitions (prepared for dynamic calculators)
   - name, slug, category, description, configuration

**Schema Design Decisions:**
- JSONB columns for flexible input/configuration storage without schema migrations
- UUID primary keys (gen_random_uuid()) for distributed system compatibility
- Nullable user references on calculator_usage allows tracking anonymous usage
- Timestamps with defaultNow() for audit trails
- Drizzle-zod integration generates validation schemas from database schema

### Authentication & Authorization

**Replit Authentication (OpenID Connect):**
- Required integration for Replit deployment environment
- Strategy: Passport.js with openid-client library
- Flow: OAuth2/OIDC with authorization code flow
- Session-based authentication with PostgreSQL storage

**Implementation Details:**
- setupAuth() initializes OIDC discovery, passport strategies, and session middleware
- isAuthenticated middleware protects routes requiring authentication
- User profile sync: OIDC claims automatically update user table on login
- Tokens stored in session; refresh handled by openid-client library
- Memoized OIDC config (1-hour cache) to reduce discovery endpoint calls

**Authorization Pattern:**
- Currently simple authenticated/unauthenticated model
- User ID from session claims (req.user.claims.sub) used for data isolation
- Future: Role-based access control can be added via users table

### External Dependencies

**Third-Party Services:**
1. **Neon PostgreSQL**: Serverless PostgreSQL database
   - WebSocket-based connection pooling
   - DATABASE_URL environment variable required
   - @neondatabase/serverless driver with ws library

2. **Replit Authentication Service**: 
   - OIDC provider at replit.com/oidc
   - Required environment variables: REPL_ID, SESSION_SECRET, ISSUER_URL, REPLIT_DOMAINS
   - Handles user identity and profile management

3. **Google Fonts**: 
   - Inter and Roboto Mono font families
   - Preconnected in HTML for performance

**Build & Development Tools:**
- Vite with React plugin and custom Replit plugins
- esbuild for backend bundling (production)
- tsx for TypeScript execution (development)
- Tailwind CSS with autoprefixer
- Drizzle Kit for database migrations

**Component Dependencies:**
- Extensive Radix UI component collection (30+ packages)
- react-hook-form with @hookform/resolvers for form validation
- date-fns for date manipulation
- lucide-react for icons
- class-variance-authority and clsx for conditional styling

**Calculator Engine Architecture (October 2025):**

The calculator system uses a scalable registry-based architecture for managing 200+ calculators:

**Core Components:**
1. **calculatorConfig.ts (289 lines)**: Registry mapping each calculator slug to:
   - Handler type (arithmetic, geometry, finance, conversion, health, etc.)
   - Required form fields array
   - Imperial unit preferences

2. **calculatorHandlers.ts (1079 lines)**: Calculation logic organized by handler type:
   - handleArithmetic: Basic math, ratios, fractions, expression evaluation
   - handlePercentage, handleStatistics, handleNumberTheory, handleAlgebra
   - handleGeometry, handleTrigonometry
   - handleConversion: Unit conversions with imperial defaults (lbs, ft, °F, mph, gal)
   - handleLoan, handleInvestment, handleSalary, handleTaxDiscount
   - handleHealthBMI, handleHealthCalories, handleHealthFitness
   - handleDateTime, handleGrade, handleConstruction
   - handleText, handleRandom, handleGenerator, handleOther

3. **calculatorEngineNew.ts (117 lines)**: Routing engine that:
   - Looks up calculator configuration from registry
   - Routes to appropriate handler based on handler type
   - Handles errors gracefully with user-friendly messages

4. **calculatorFormsNew.ts**: Dynamic form field generator:
   - Maps field IDs to predefined form field configurations
   - Provides sensible fallbacks for unmapped fields
   - Smart text vs number field detection
   - Handles common fields like expression, value, percentage, principal, rate, weight, etc.

**Design Decisions:**
- Registry pattern allows easy addition of new calculators
- Handler-based grouping reduces code duplication
- Data-driven form generation eliminates manual form definitions
- Imperial units as default for all conversions (per requirements)
- Safe expression evaluation for basic/scientific calculators using Function constructor
- All calculators share common UI/UX patterns

**Security:**
- Expression evaluation sanitizes input to only allow safe characters
- Invalid/malicious expressions rejected with clear error messages
- No eval() usage - uses Function constructor in strict mode

**Static Data:**
- Calculator definitions in client/src/data/calculators.ts (200+ entries)
- Provides name, slug, category, description for UI display
- Complemented by calculatorConfig.ts for execution logic
- Future: Migrate to database-driven calculator definitions

### AI-Powered Custom Calculator Builder (October 2025)

**Overview:**
The custom calculator builder allows users to describe any calculator in plain English, and AI generates a fully functional calculator instantly. Accessible via `/custom-calculator` with a prominent "NEW" badge on the homepage.

**Architecture:**
1. **Frontend (client/src/pages/custom-calculator.tsx):**
   - Text input for user description
   - AI generation triggered via OpenAI-compatible Replit AI Integrations
   - Dynamic form rendering based on AI-generated field definitions
   - Calculation execution via secure server-side API

2. **Backend API Endpoints:**
   - `POST /api/generate-calculator`: AI generation using Replit AI Integrations (GPT-4)
   - `POST /api/execute-custom-calculator`: Secure server-side formula evaluation

**AI Generation (server/routes.ts):**
- Uses Replit AI Integrations (OpenAI-compatible endpoint)
- No separate API key required - billed to Replit credits
- AI prompt constrains formulas to simple mathematical expressions only
- Generates: calculator name, description, input fields, mathjs formula, result label/unit

**Secure Formula Execution:**
The custom calculator execution endpoint implements defense-in-depth security to prevent remote code execution (RCE):

**Multi-Layer Security Architecture:**

1. **Layer 1 - Character Whitelist:**
   - Regex: `/^[a-zA-Z0-9+\-*/()\s.,]+$/`
   - Only allows: letters, numbers, math operators (+, -, *, /), parentheses, spaces, dots, commas
   - Blocks ALL other characters including brackets, quotes, special symbols

2. **Layer 2 - Pattern Blocklist:**
   - Blocks property access: `[]`, `.`
   - Blocks string literals: `'`, `"`, `` ` ``
   - Blocks template syntax: `$`
   - Blocks assignments: `=`
   - Blocks dangerous keywords (case-insensitive): constructor, prototype, __proto__, globalThis, process, require, import, eval, Function, Object, Array, String

3. **Layer 3 - Input Validation:**
   - All user inputs converted to numbers via parseFloat()
   - Rejects NaN and Infinity values
   - Only numeric scope passed to mathjs evaluator

4. **Layer 4 - Safe Expression Evaluation:**
   - Uses `mathjs.evaluate(formula, scope)` for evaluation
   - mathjs uses AST-based parsing (no eval(), no Function constructor)
   - Cannot execute arbitrary JavaScript code
   - Only mathematical expressions can be evaluated

5. **Layer 5 - Result Validation:**
   - Result must be typeof 'number'
   - Result must be finite (not Infinity or NaN)
   - Formatted server-side with label and unit

**Allowed Mathematical Operations:**
- Arithmetic: +, -, *, /, ()
- Functions: sqrt(), ceil(), floor(), round(), abs(), min(), max(), pow()
- Variables: Input field IDs from AI-generated schema

**Example Flow:**
1. User: "Calculate paint needed for a room"
2. AI generates: 
   - Fields: length, width, height
   - Formula: `ceil((2 * (length + width) * height) / 350)`
   - Label: "Paint Needed", Unit: "gallons"
3. User enters: 12, 10, 8
4. Server validates and evaluates: `ceil((2 * (12 + 10) * 8) / 350)` = 2
5. Result: "Paint Needed: 2 gallons"

**Security Validation (Architect-Approved):**
- ✅ Prevents property access exploits
- ✅ Blocks string concatenation attacks
- ✅ Rejects template literal injection
- ✅ Stops prototype pollution attempts
- ✅ Prevents Node.js global access
- ✅ Blocks function constructor usage
- ✅ AST-based evaluation prevents eval-based RCE
- ✅ Multi-layer defense ensures no single bypass works

**Design Decisions:**
- Server-side execution only (never client-side) for security
- mathjs chosen for AST-based parsing over eval/Function
- AI prompt constrains output to mathjs-compatible expressions
- Replit AI Integrations eliminates API key management burden
- Imperial units as default for all generated calculators