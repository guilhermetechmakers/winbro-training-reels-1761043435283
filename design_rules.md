# Design Rules for This Project

## Project Design Pattern: ---
## Visual Style

### Color Palette:
- Primary background: #F7F8FA (off-white, used for main canvas and sidebar backgrounds)
- Content background: #FFFFFF (pure white for cards and main content areas)
- Sidebar icons: #AEB2B8 (muted gray for inactive/secondary icons)
- Primary text: #23272F (dark, near-black for high contrast headings and body text)
- Secondary text: #575C66 (medium gray for less prominent details)
- Accent yellow: #FFF7C2 (light yellow background chip), #FFD600 (bold yellow for status highlights)
- Accent blue: #E4F0FF (light blue chip), #2F80ED (primary blue for tags and highlights)
- Accent green: #DFF5EA (light green chip), #34C759 (green for status/labels)
- Accent red: #FF3B30 (progress bars, status indicators)
- Borders/dividers: #E4E7EC (light gray for subtle separation)
- Avatar backgrounds: Soft, pastel tones for differentiation

### Typography & Layout:
- Font family: Modern sans-serif (e.g., Inter, Helvetica Neue, or similar)
- Font weights: Regular for body, Medium for labels, Bold for headings
- Heading hierarchy: Large, bold headings; medium-weight subheadings; clear visual separation
- Spacing: Generous padding (24–32px for main sections), consistent 16px–24px between elements
- Alignment: Left-aligned text, strong vertical rhythm, clear section grouping
- Typography treatments: Rounded chip/badge text, uppercase for tags, subtle color coding for context

### Key Design Elements

#### Card Design:
- Style: Rounded corners (12px radius), white backgrounds, subtle drop shadows (#E4E7EC, very soft)
- Borders: Thin, light gray borders for card separation
- Hover state: Slight shadow lift and border color accentuation
- Visual hierarchy: Bold title at top, lighter body text, metadata and avatars at bottom, progress bar in color for status

#### Navigation:
- Sidebar: Vertical left navigation, minimal icon set, active state with filled background (#E4F0FF or #F7F8FA)
- Subsections: Collapsible/expandable project lists with clear label hierarchy
- Active state: Highlighted background, bold text, accent left border
- Breadcrumbs: Top navigation with muted dividers and clear section titles

#### Data Visualization:
- Progress bars: Rounded, colored bars (accent colors for state: yellow, green, red)
- Chips/tags: Pill-shaped, pastel backgrounds, colored text to indicate category/status
- Minimal charting, focusing on status visuals and completion bars

#### Interactive Elements:
- Buttons: Rounded corners, medium size, solid or outlined with accent color fills (#2F80ED for primary, #E4F0FF for secondary)
- Form elements: Rounded input fields, subtle border with focus accent color
- Microinteractions: Hover glow for cards/buttons, icon color shift on hover
- Hover effects: Soft background fill and/or shadow lift

### Design Philosophy
This interface embodies:
- A clean, modern, and highly functional SaaS aesthetic
- Minimalist but warm, with ample white space and soft color accents for clarity
- Emphasis on usability: clear visual hierarchy, easy navigation, and immediate comprehension of status and progress
- Professional, approachable, and trustworthy, balancing efficiency with visual comfort
- Visual strategy prioritizes quick scanning, low cognitive load, and delightful micro-interactions for engagement

This project follows the "---
## Visual Style

### Color Palette:
- Primary background: #F7F8FA (off-white, used for main canvas and sidebar backgrounds)
- Content background: #FFFFFF (pure white for cards and main content areas)
- Sidebar icons: #AEB2B8 (muted gray for inactive/secondary icons)
- Primary text: #23272F (dark, near-black for high contrast headings and body text)
- Secondary text: #575C66 (medium gray for less prominent details)
- Accent yellow: #FFF7C2 (light yellow background chip), #FFD600 (bold yellow for status highlights)
- Accent blue: #E4F0FF (light blue chip), #2F80ED (primary blue for tags and highlights)
- Accent green: #DFF5EA (light green chip), #34C759 (green for status/labels)
- Accent red: #FF3B30 (progress bars, status indicators)
- Borders/dividers: #E4E7EC (light gray for subtle separation)
- Avatar backgrounds: Soft, pastel tones for differentiation

### Typography & Layout:
- Font family: Modern sans-serif (e.g., Inter, Helvetica Neue, or similar)
- Font weights: Regular for body, Medium for labels, Bold for headings
- Heading hierarchy: Large, bold headings; medium-weight subheadings; clear visual separation
- Spacing: Generous padding (24–32px for main sections), consistent 16px–24px between elements
- Alignment: Left-aligned text, strong vertical rhythm, clear section grouping
- Typography treatments: Rounded chip/badge text, uppercase for tags, subtle color coding for context

### Key Design Elements

#### Card Design:
- Style: Rounded corners (12px radius), white backgrounds, subtle drop shadows (#E4E7EC, very soft)
- Borders: Thin, light gray borders for card separation
- Hover state: Slight shadow lift and border color accentuation
- Visual hierarchy: Bold title at top, lighter body text, metadata and avatars at bottom, progress bar in color for status

#### Navigation:
- Sidebar: Vertical left navigation, minimal icon set, active state with filled background (#E4F0FF or #F7F8FA)
- Subsections: Collapsible/expandable project lists with clear label hierarchy
- Active state: Highlighted background, bold text, accent left border
- Breadcrumbs: Top navigation with muted dividers and clear section titles

#### Data Visualization:
- Progress bars: Rounded, colored bars (accent colors for state: yellow, green, red)
- Chips/tags: Pill-shaped, pastel backgrounds, colored text to indicate category/status
- Minimal charting, focusing on status visuals and completion bars

#### Interactive Elements:
- Buttons: Rounded corners, medium size, solid or outlined with accent color fills (#2F80ED for primary, #E4F0FF for secondary)
- Form elements: Rounded input fields, subtle border with focus accent color
- Microinteractions: Hover glow for cards/buttons, icon color shift on hover
- Hover effects: Soft background fill and/or shadow lift

### Design Philosophy
This interface embodies:
- A clean, modern, and highly functional SaaS aesthetic
- Minimalist but warm, with ample white space and soft color accents for clarity
- Emphasis on usability: clear visual hierarchy, easy navigation, and immediate comprehension of status and progress
- Professional, approachable, and trustworthy, balancing efficiency with visual comfort
- Visual strategy prioritizes quick scanning, low cognitive load, and delightful micro-interactions for engagement" design pattern.
All design decisions should align with this pattern's best practices.

## SaaS App Pattern

### Authentication & Onboarding
**Clear user flows:**
- Implement clear authentication flows
- Social login options (Google, GitHub)
- Email verification process
- Password reset functionality
- Create intuitive onboarding experience
- Progressive onboarding (don't overwhelm)
- Interactive tutorials or product tours
- Welcome screens with clear next steps

### Settings & Configuration
**User control:**
- Design settings pages with clear sections
- Use tabs or sidebar navigation for settings categories
- Provide helpful descriptions for each setting
- Include reset to defaults option
- Show save indicators and success feedback
- Implement unsaved changes warnings

### Feature Management
**Progressive disclosure:**
- Use progressive disclosure for complex features
- Add helpful tooltips and documentation links
- Provide contextual help throughout the app
- Include empty states with guidance
- Feature discovery through onboarding

### Billing & Subscriptions
**Clear pricing:**
- Implement billing/subscription management UI
- Clear pricing tiers and feature comparison
- Usage metrics and limits display
- Upgrade/downgrade flows
- Invoice history and download options

---

---

## General Design Principles

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Dark mode with elevated surfaces

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)
- Test colors in both light and dark modes

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)
- Adjust shadow intensity based on theme (lighter in dark mode)

---

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast (both themes)
- Respect reduced motion preferences

---

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions
9. **Be Themeable** - Support both dark and light modes seamlessly

---

