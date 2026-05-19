---
name: Optimization Suite
colors:
  surface: '#f3fcef'
  surface-dim: '#d3ddd0'
  surface-bright: '#f3fcef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf6e9'
  surface-container: '#e7f1e3'
  surface-container-high: '#e2ebde'
  surface-container-highest: '#dce5d8'
  on-surface: '#151e16'
  on-surface-variant: '#3c4a3c'
  inverse-surface: '#2a332a'
  inverse-on-surface: '#eaf3e6'
  outline: '#6c7b6b'
  outline-variant: '#bbcbb9'
  surface-tint: '#006e2e'
  primary: '#006e2e'
  on-primary: '#ffffff'
  primary-container: '#03c75a'
  on-primary-container: '#004c1e'
  inverse-primary: '#3ee271'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#9e4135'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff8c7c'
  on-tertiary-container: '#76241b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#67ff8d'
  primary-fixed-dim: '#3ee271'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a9'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#7e2a20'
  background: '#f3fcef'
  on-background: '#151e16'
  surface-variant: '#dce5d8'
typography:
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Noto Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-bold:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 32px
  gutter: 24px
  card-padding: 24px
  input-padding: 12px
---

## Brand & Style

The design system is built on the principles of **Corporate Modernism**, heavily inspired by the clean, efficient, and high-trust aesthetics of the Naver Smart Store ecosystem. It prioritizes data clarity and functional utility above all else, ensuring that complex SEO metrics are digestible and actionable.

The visual language is characterized by:
- **Functional Clarity:** High contrast between text and surfaces to minimize cognitive load.
- **Data-First Architecture:** A structured hierarchy that emphasizes key performance indicators (KPIs) through purposeful whitespace and consistent alignment.
- **Professionalism:** A balanced mix of vibrant brand colors and sophisticated neutrals to evoke reliability and technical authority.
- **Modern Softness:** While the system is structured, the use of soft corners and subtle shadows ensures the interface feels approachable and user-friendly.

## Colors

The palette is centered around the iconic brand green, used strategically for primary actions and success states. 

- **Primary Green (#03C75A):** Reserved for core "Growth" actions, positive SEO trends, and primary navigation highlights.
- **Secondary Navy (#1E293B):** Used for primary buttons and high-level headers to provide a grounded, professional contrast to the vibrant green.
- **Background & Surface:** The application uses a "Layered White" approach. The base background is a cool light gray, while interactive modules and data containers sit on pure white surfaces to create distinct visual separation.
- **Semantic Accents:** Standardized red and amber are utilized strictly for critical errors or optimization warnings, ensuring they stand out against the predominantly green/neutral interface.

## Typography

This design system utilizes **Noto Sans** for its exceptional multi-language legibility and neutral, systematic appearance. 

- **Hierarchy:** Use `headline-lg` for dashboard page titles and `headline-md` for card titles. 
- **Body Text:** `body-md` is the workhorse for general data display and descriptions. `body-sm` should be used for secondary meta-data or tooltips.
- **Labels:** Small, bold labels are utilized for table headers and tag descriptions to maintain high readability even at small scales.
- **Weights:** Reserve `700` (Bold) for critical numbers or primary headers. Use `400` (Regular) for all long-form content to prevent visual fatigue.

## Layout & Spacing

The layout follows a **Fixed-Width Dashboard** philosophy for the main content area, centered within the viewport or alongside a fixed sidebar.

- **Grid:** A 12-column grid is used for the main dashboard content. Components should typically span 3, 4, 6, or 12 columns.
- **Rhythm:** An 8px base unit governs all spacing. Vertical margins between sections should be `base * 4` (32px), while internal card components should use `base * 3` (24px).
- **Sidebar:** The navigation sidebar is fixed at 240px width, providing a stable anchor for the fluid content area.
- **Mobile Adaptation:** On mobile devices, the 12-column grid collapses into a single column. Horizontal margins reduce from 32px to 16px to maximize screen real estate for data tables.

## Elevation & Depth

Visual hierarchy is achieved through a combination of **Tonal Layering** and **Subtle Ambient Shadows**.

- **Level 0 (Background):** The `#F5F6F7` gray background acts as the canvas.
- **Level 1 (Cards/Surface):** All primary content modules sit on white containers (`#FFFFFF`). These use a 1px border of `#E5E7EB` and no shadow for a flat, clean look in high-density areas.
- **Level 2 (Active/Floating):** Modals, dropdowns, and "hovered" card states utilize a soft ambient shadow (Blur: 12px, Y: 4px, Color: `rgba(0,0,0,0.05)`) to indicate interactivity and depth.
- **Depth through Color:** Interaction states (like button presses) are indicated by a 10% darkening of the primary or secondary color rather than a change in shadow elevation.

## Shapes

The design system employs a **Rounded** shape language to soften the analytical nature of the data.

- **Component Radius:** Buttons, input fields, and small cards use a 0.5rem (8px) corner radius.
- **Large Container Radius:** Major dashboard modules and modal containers use a 1rem (16px) corner radius to define large content areas clearly.
- **Interactive Elements:** Checkboxes use a 4px radius, while radio buttons remain fully circular. Tags and chips should use a pill-shape (fully rounded) to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Navy background (`#1E293B`) with white text. Used for "Add Project" or "Export Data".
- **Action:** Green background (`#03C75A`) with white text. Used for "Optimize Now" or "Save Changes".
- **Outline:** 1px gray border with navy text. Used for secondary actions like "Cancel" or "Filter".

### Cards
- White background, 8px rounded corners, and a subtle 1px border. 
- Use a header section within cards with a light gray bottom border to separate titles from data.

### Input Fields
- White background with a 1px `#E5E7EB` border. 
- On focus, the border transitions to Primary Green (`#03C75A`) with a subtle green outer glow.
- Labels sit above the field in `label-bold` style.

### SEO Status Chips
- **Optimized:** Light green tint background with dark green text.
- **Needs Review:** Light orange tint background with dark orange text.
- **Critical:** Light red tint background with dark red text.

### Data Tables
- Clean, borderless rows with a light gray background on hover.
- Header row should have a subtle gray background (`#FAFBFC`) to anchor the column titles.