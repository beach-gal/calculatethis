# CalculateThis.org Design Guidelines

## Design Approach

**Design System Foundation**: Material Design + Modern SaaS patterns
- **Rationale**: Utility-focused tool requiring clarity, accessibility, and efficiency
- **Principles**: Clear hierarchy, generous spacing, consistent patterns, scannable information architecture

## Typography System

**Font Stack**:
- Primary: Inter (Google Fonts) - weights 400, 500, 600, 700
- Monospace: JetBrains Mono - for numerical inputs/outputs

**Hierarchy**:
- Hero Headlines: 3xl-5xl, weight 700, tight leading
- Page Titles: 2xl-3xl, weight 600
- Section Headers: xl-2xl, weight 600
- Calculator Labels: base-lg, weight 500
- Body Text: base, weight 400, relaxed leading
- Input Fields: base, weight 400
- Results/Output: lg-xl, weight 600, monospace

## Layout System

**Spacing Units**: Tailwind 2, 4, 6, 8, 12, 16, 20, 24 (consistent rhythm)

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl inner containers
- Content sections: max-w-6xl centered
- Calculator interfaces: max-w-4xl for optimal usability
- Dashboards: max-w-screen-2xl with sidebar layouts

**Grid Patterns**:
- Calculator Gallery: 3-column on desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), single mobile
- Feature Cards: 3-column grid with equal heights
- Dashboard Metrics: 4-column stat cards reducing to 2 on tablet
- Admin Tables: Full-width responsive tables with horizontal scroll

## Core Components

**Navigation**:
- Sticky header with site logo, mega-menu for calculator categories, search bar, auth CTA
- Mega-menu: Opens on hover with categorized calculator grid (6-8 categories, 5-6 items each)
- Mobile: Hamburger menu with accordion category navigation
- Breadcrumbs: Implement on all calculator/dashboard pages for wayfinding

**Calculator Interface Components**:
- Input Groups: Label above, input field, helper text below, validation messaging
- Numerical Inputs: Large touch targets (h-12), right-aligned monospace text, clear units
- Action Buttons: Primary "Calculate" button (large, prominent), secondary "Reset" button
- Results Display: Dedicated card with prominent output, step-by-step breakdown accordion, visual charts where applicable
- Related Calculators: Horizontal scrolling carousel at bottom

**Cards**:
- Calculator Cards: Icon top-left, title, brief description, usage count badge, hover lift effect
- Elevation: Base shadow, hover shadow-lg for interactive cards
- Padding: p-6 for standard cards, p-8 for feature cards

**Form Elements**:
- Input Fields: h-12, rounded-lg borders, px-4 padding, focus ring treatment
- Buttons: h-12 standard, h-10 compact, rounded-lg, medium weight text
- Checkboxes/Radios: Large 20px touch targets, custom styled
- Dropdowns: Native select with custom arrow, matching input styling

**Authentication Forms**:
- Centered card layout (max-w-md), generous internal padding (p-8)
- OAuth buttons: Full-width with provider icons (Google, GitHub)
- Divider: "OR" centered between OAuth and email forms
- Link hierarchy: Primary CTA button, secondary text links below

**Dashboard Layout**:
- Left sidebar (w-64): Logo, navigation sections, collapse on mobile
- Main content: Full-width metrics row, recent activity feed, favorites grid
- Metrics Cards: Icon, label, large number, trend indicator
- Activity Timeline: Left-aligned timestamps, calculator icons, action descriptions

**Admin Interface**:
- Two-column layout: Navigation sidebar (w-72) + content area
- Data Tables: Sortable headers, row actions dropdown, pagination
- Quick Actions Toolbar: Bulk operations, filters, search
- Status Indicators: Dot badges for active/inactive states

## Images

**Hero Section** (Homepage):
- Large hero image: Professional workspace with calculator, charts, documents - modern, bright, productive atmosphere
- Placement: Full-width section, min-h-[500px], image as background with overlay gradient for text readability
- Hero Content: Centered over image - headline, subheadline, search bar, category quick-links
- Buttons on Image: Implement backdrop-blur-md background for buttons placed over hero image

**Calculator Category Pages**:
- Category hero: Relevant contextual images (finance calculators = charts/graphs, health = wellness imagery)
- Smaller height: min-h-[300px]

**Supporting Images**:
- Feature section illustrations: 3 custom spots showing calculator usage scenarios
- Trust indicators: Partner logos, certification badges (placed in dedicated section)
- No images needed for: Auth pages, dashboard, admin, individual calculator pages

## Animation & Interaction

**Minimal Animation Approach**:
- Hover states: Subtle scale (scale-105), shadow transitions only
- Page transitions: Fade-in content on load (300ms)
- Calculator results: Slide-down result card with 400ms ease
- Avoid: Scroll animations, parallax, complex transitions

## Page-Specific Layouts

**Homepage**:
1. Hero with search (500px height, image background)
2. Popular Calculators Grid (3-column, 9 items visible)
3. Category Navigation Cards (6 large cards, 2-column on mobile)
4. Feature Benefits (3-column with icons, descriptions)
5. Trust Section (usage stats, testimonials)
6. CTA Section (newsletter signup + calculator request form)

**Calculator Page**:
1. Breadcrumb navigation
2. Page title + description (max-w-3xl)
3. Calculator Interface (2-column: inputs left, results right on desktop)
4. Information Accordion (formulas, examples, FAQs)
5. Related Calculators Carousel

**Dashboard**:
1. Welcome header with user stats
2. Favorites Grid (masonry layout)
3. Recent Calculations Timeline
4. Recommended Calculators Section

## Accessibility Requirements

- ARIA labels on all interactive elements
- Skip navigation links
- Keyboard navigation for calculator inputs (tab order)
- Focus indicators: 2px outline with offset
- Form validation: Inline error messages with icons
- Color contrast: Ensure AA compliance minimum
- Screen reader announcements for calculator results

**Consistent Implementation**: All form inputs, text fields, buttons, and interactive elements maintain identical styling, spacing, and accessibility patterns across authentication, calculators, dashboard, and admin interfaces.