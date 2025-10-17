# Design Guidelines: MERN Admin Dashboard

## Design Approach
**System Selected:** Modern Admin Dashboard Pattern (inspired by Linear, Vercel, Stripe)
**Justification:** Utility-focused admin application requiring efficiency, data clarity, and professional aesthetics for agent management and data distribution workflows.

## Core Design Principles
- **Clarity First:** Information hierarchy optimized for quick task completion
- **Minimal Distraction:** Clean interfaces with purposeful color usage
- **Data Density:** Efficient use of space for tables and lists without overwhelming users
- **Workflow Efficiency:** Streamlined flows from login → agent management → CSV distribution

## Color Palette

**Dark Mode (Primary):**
- Background: 222 15% 6% (deep charcoal)
- Surface: 222 15% 10% (elevated panels)
- Border: 222 15% 18% (subtle divisions)
- Primary: 240 75% 65% (professional blue)
- Success: 142 76% 45% (confirmation green)
- Error: 0 84% 60% (alert red)
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 70%

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Border: 220 13% 91%
- Primary: 240 75% 55%
- Text Primary: 222 15% 10%
- Text Secondary: 222 15% 45%

## Typography
- **Font Families:** 
  - Primary: 'Inter', system-ui, sans-serif (body, UI)
  - Monospace: 'JetBrains Mono', monospace (data, IDs)
- **Scale:**
  - Headings: text-2xl to text-4xl, font-semibold
  - Body: text-sm to text-base, font-normal
  - Labels: text-xs to text-sm, font-medium, uppercase tracking-wide
  - Data Tables: text-sm, tabular-nums

## Layout System
**Spacing Units:** Consistent use of 2, 4, 6, 8, 12, 16 (p-2, p-4, p-6, p-8, p-12, p-16)
**Grid System:** 
- Dashboard: Sidebar (240px fixed) + Main content (flex-1)
- Content max-width: max-w-7xl mx-auto
- Form layouts: max-w-md for focused input
- Table layouts: Full width with horizontal scroll on mobile

## Component Library

### Navigation
- **Sidebar Navigation:** Fixed left sidebar (w-60) with logo, main nav items, user profile at bottom
- **Top Bar:** Sticky header with breadcrumbs, search, notifications, user menu
- **Navigation Items:** Hover states with subtle background (bg-opacity-10), active state with border-l-2 accent

### Authentication
- **Login Card:** Centered card (max-w-md) with subtle shadow, rounded-xl borders
- **Form Inputs:** Outlined style with focus:ring-2 ring-primary
- **Error States:** Text-error with shake animation on invalid credentials

### Agent Management
- **Agent Cards/Table:** Toggle between card grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) and data table view
- **Add Agent Form:** Modal overlay with form in max-w-lg container
- **Agent Details:** Name (text-lg font-semibold), email/phone (text-sm text-secondary), action buttons (icon-only or icon+text)

### CSV Upload & Distribution
- **Upload Zone:** Dashed border drop zone (border-dashed border-2) with file icon, drag-drop states
- **File Validation:** Inline feedback with checkmarks (success) or error icons
- **Distribution Display:** Accordion/tabs showing each agent with their assigned items count
- **Data Table:** Striped rows (odd:bg-surface), sortable headers, pagination controls

### Data Display
- **Tables:** Clean minimal style, hover:bg-surface/50, sticky headers
- **Status Badges:** Rounded-full px-3 py-1 text-xs with semantic colors
- **Empty States:** Centered illustrations with helpful text and primary action button
- **Loading States:** Skeleton screens matching component structure

### Forms
- **Input Fields:** Consistent height (h-10), rounded-md, focus states with ring
- **Select Dropdowns:** Custom styled to match input aesthetic
- **Validation:** Inline error messages (text-xs text-error mt-1)
- **Submit Buttons:** Primary color, disabled:opacity-50, loading spinner on submit

### Modals & Overlays
- **Modal Backdrop:** backdrop-blur-sm bg-black/50
- **Modal Content:** Slide-in animation, rounded-lg, max-w-lg to max-w-2xl based on content
- **Confirmation Dialogs:** Simple 2-button layout (Cancel + Confirm action)

## Data Visualization
- **Distribution Stats:** Card-based stats showing total items, agents, avg items per agent
- **Progress Indicators:** Linear progress bars showing distribution completion
- **Agent Load Display:** Visual representation of item distribution (bar charts or progress rings)

## Interactions & Animations
- **Page Transitions:** Minimal fade-in (150ms) on route changes
- **Hover States:** Subtle scale (scale-[1.02]) on interactive cards
- **Loading:** Spinner for async operations, skeleton for initial loads
- **Drag & Drop:** Visual feedback with border color change and scale transform

## Responsive Behavior
- **Mobile (<768px):** Stack navigation to bottom tab bar, collapse sidebar
- **Tablet (768-1024px):** Collapsible sidebar, 2-column layouts
- **Desktop (>1024px):** Full sidebar, 3-column grids, expanded tables

## Images
No hero images needed for this admin dashboard. Focus on:
- **Empty State Illustrations:** Simple SVG illustrations for empty agent list, no uploads yet
- **User Avatars:** Circular avatars for admin and agents (use initials fallback)
- **File Type Icons:** CSV/XLSX/XLS icons for upload validation display

## Accessibility
- Maintain WCAG AA contrast ratios in both themes
- Keyboard navigation for all interactive elements (focus:ring-2)
- ARIA labels for icon-only buttons
- Form labels properly associated with inputs
- Error announcements for screen readers