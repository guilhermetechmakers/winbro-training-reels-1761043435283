# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations


### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Elevated surfaces for depth

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

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

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

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
- Sufficient color contrast
- Respect reduced motion preferences

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


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

# Winbro Training Reels - Development Blueprint

Winbro Training Reels is a SaaS web platform that captures, curates, and delivers 20–30 second microlearning videos tied to manufacturing machines, processes, and tooling. It provides tenant-aware, searchable libraries, a course builder with integrated quizzes and certificate issuance, admin moderation and analytics, secure enterprise authentication (SSO/SCIM), and subscription billing. The product targets operators, technicians, trainers, and customer admins to replace paper manuals and tribal knowledge with searchable, verified video clips and structured learning.

## 1. Pages (UI Screens)

- Login / Signup
  - Purpose: Entry point for users and enterprise sign-in; supports email/password, SSO, and social pilot logins.
  - Key sections/components:
    - Toggle Tabs: Login / Signup
    - Email/Password Form: email, password, remember me
    - SSO Buttons: Enterprise SSO (SAML), Google Workspace Oauth
    - Password Strength Meter (signup)
    - Terms Checkbox & Link
    - Forgot Password link
    - Toaster notifications (error & success)

- Password Reset
  - Purpose: Secure recovery flow with rate-limiting.
  - Key sections/components:
    - Request Form: email input + submit
    - Confirmation Screen: email sent instructions
    - Reset Form (tokenized via emailed link): new password, confirm password
    - Password Rules & Strength indicators
    - Rate-limit & Captcha hints

- Email Verification
  - Purpose: Validate user email after signup or on-demand.
  - Key sections/components:
    - Verification Status Banner (success/failure)
    - Resend Verification Button (cooldown)
    - Support link
    - Auto-redirect to Dashboard on success

- Landing Page (Marketing)
  - Purpose: Public product marketing, demo request, and conversion.
  - Key sections/components:
    - Hero: headline, subhead, 15s demo autoplay-muted
    - Primary CTA (Request Demo) and Secondary CTA (Sign Up)
    - Feature highlights: icons for Short Videos, Searchable Library, Course Builder, Certification
    - How It Works (3-step diagram)
    - Customer logos & testimonials carousel
    - Pricing snapshot with CTA
    - Footer: Terms, Privacy, Contact, Blog

- Dashboard (User Home)
  - Purpose: Personalized entry for learners/trainers showing assigned libraries and activities.
  - Key sections/components:
    - Top Nav: global search, notifications, user menu, help
    - Quick Search Bar with autosuggest
    - Library Overview Cards (Clips, Courses, Certificates, Bookmarks)
    - Recent Activity Feed
    - Recommended Clips & Pinned Customer Library
    - Callouts: pending quizzes, expiring certs

- Clip Viewer (Player Page / Modal)
  - Purpose: Primary viewing experience for microclips with metadata and collaborative notes.
  - Key sections/components:
    - Adaptive HLS Video Player (quality selector, speed, PiP)
    - Clip Metadata Panel: title, machine model, process, tooling, author, publish date, tags
    - Transcript & Timestamps: clickable synced timeline
    - Annotations/Notes & Comments (mentions)
    - Actions: Bookmark, Add to Course, Report Issue, Share, Download (permissioned)
    - Related Clips suggestions

- Content Library / Browse
  - Purpose: Searchable, faceted browsing of clips.
  - Key sections/components:
    - Filter Sidebar: machine model, process, tags, author, date range, skill level
    - Sort Options & Grid/List Toggle
    - Clip Cards: thumbnail with play overlay, title, duration, tags, actions
    - Pagination / Infinite Scroll
    - Transcript preview & caption indicator

- Create / Upload Content
  - Purpose: Upload and author new clips with metadata, transcription, and review workflow.
  - Key sections/components:
    - Drag-and-Drop Uploader & Mobile URL upload
    - Capture Template Checklist & filming guidance
    - Metadata Form: title, machine, process, tools, tags, skill level, customer assignment
    - Auto-transcription editor & confidence indicators
    - Thumbnail Selector & Trim controls
    - Publish Controls: save draft, submit for review, publish
    - Validation & Warnings (duration, file type)

- Course Builder (Authoring Interface)
  - Purpose: Assemble clips into structured training with embedded quizzes and publishing controls.
  - Key sections/components:
    - Course Canvas: drag-and-drop sequence with modules/sections
    - Clip Picker: search + multi-select add
    - Quiz Editor: create MCQ/short answer questions and place at nodes
    - Settings Panel: passing threshold, attempts, certificate template, visibility
    - Versioning & Publish Controls: draft/publish/schedule
    - Preview Mode (learner simulation)

- Learning Player (Course View)
  - Purpose: Learner-facing course playback enforcing sequencing and quizzes.
  - Key sections/components:
    - Progress Tracker (module & overall progress)
    - Clip Player per step (embedded clips)
    - In-line Quiz Modal with validation
    - Completion Certificate issuance (PDF + badge)
    - Back/Next navigation with lock/unlock logic

- Quiz & Certificate Page
  - Purpose: Show quiz results, remediation, and certificate access.
  - Key sections/components:
    - Score Summary & attempts info
    - Feedback per question with remediation clip links
    - Certificate Card: view/download/share & verification URL/QR
    - Retake CTA (if allowed)

- Edit / Manage Content (Editor/Admin)
  - Purpose: Review, edit, moderate, and allocate clips.
  - Key sections/components:
    - Content Table: filters, status labels (draft/review/published/archived)
    - Bulk Actions: assign, tag, archive, export
    - Clip Detail Editor: metadata & transcript editor, re-transcode request
    - Moderation Tools: report queue, reason codes, comment history
    - Activity & Version History panel

- Admin Dashboard
  - Purpose: Platform metrics and ops tasks for Winbro admins.
  - Key sections/components:
    - KPI Cards: clips published, views (30d), active users, certificates issued
    - Charts: daily views, uploads, search success rate, per-customer usage
    - Outstanding Tasks: review queue, flagged content
    - Customer List Quick Links

- Admin - User Management
  - Purpose: Invite and manage organization users and roles.
  - Key sections/components:
    - User Table: name, email, role, status, last login
    - Invite Modal: single & CSV bulk invites
    - Role Editor (RBAC)
    - Session Management: force logout, session audit
    - SCIM/Sync Status

- Settings / Preferences (Org-level)
  - Purpose: Organization config: library allocation, SSO, branding, billing contact.
  - Key sections/components:
    - Organization Info & branding upload
    - Library Allocation: assigned machine models & quotas
    - SSO & Provisioning: SAML metadata, SCIM toggle
    - Certificate Template Editor
    - Data Retention & Export settings

- Checkout / Payment
  - Purpose: Subscription purchase, seat count, and payment.
  - Key sections/components:
    - Plan Selector (tiers)
    - Billing Details Form
    - Payment Form (Stripe Elements)
    - Promo Code input & validation
    - Invoice & billing preferences
    - Confirmation & provisioning summary

- Order / Transaction History
  - Purpose: View and download invoices and receipts.
  - Key sections/components:
    - Transaction Table with filters
    - Invoice Viewer & download
    - Export CSV

- Analytics & Reports
  - Purpose: Detailed analytics for content and learner outcomes.
  - Key sections/components:
    - Prebuilt Reports (views by clip, top searches, completion rates)
    - Custom Report Builder (filters, group by)
    - Export & Schedule (CSV/PDF)
    - Heatmaps & engagement funnels

- Help / About / Docs
  - Purpose: Onboarding, capture best-practices, support.
  - Key sections/components:
    - Searchable docs & FAQ
    - Capture templates & checklists
    - API docs
    - Contact Support form & live chat widget
    - Onboarding checklist & changelog

- Privacy Policy / Terms / Cookie Policy
  - Purpose: Legal and compliance pages with downloads and consent management.
  - Key sections/components:
    - Full policy text + download buttons
    - Cookie consent controls & category toggles

- 404 Not Found / 500 Server Error
  - Purpose: Friendly error handling and fallback navigation.
  - Key sections/components:
    - Suggested links, search, home CTA
    - Error messaging, retry button, support contact

- Loading / Success States (Global)
  - Purpose: Reusable UI for async feedback and long-running jobs.
  - Key sections/components:
    - Loading spinner & progress bar
    - Success toast/modal
    - Job status panel with polling (transcoding, exports)

## 2. Features

- User Authentication & Security
  - Technical details:
    - JWT access + refresh tokens stored in secure httpOnly cookies
    - Password hashing: bcrypt/argon2
    - Email verification tokens with expiry
    - Rate limiting & IP throttling on auth endpoints
    - 2FA (TOTP, RFC6238) optional
    - Enterprise SSO: SAML integration and OAuth2 for Google Workspace
    - SCIM v2 provisioning support for enterprise
  - Implementation notes:
    - Use identity library (Auth0 or self-hosted gateway) for SSO orchestration or build SAML/OAuth handlers.
    - Enforce secure cookie, SameSite, and TLS. Log auth events.

- Role-Based Access Control (RBAC)
  - Technical details:
    - Roles: Admin, Trainer, Learner, Customer Admin, Reviewer
    - Permission matrix persisted in DB (role -> resource -> actions)
    - Tenant-aware multi-tenant isolation
    - Support impersonation (support/admin) with audit logs
  - Implementation notes:
    - Enforce server-side permission checks; mirror minimal checks client-side for UX.
    - Provide admin UI to edit roles & permissions.

- Video Upload & Processing
  - Technical details:
    - Direct resumable/multipart uploads to S3 using presigned URLs
    - Media processing pipeline: transcode to HLS renditions + MP4 fallback; generate thumbnails
    - Job queue (e.g., AWS Step Functions, Lambda, or Celery) with webhook/status callbacks
    - Virus scanning on upload; file validation (duration, format)
  - Implementation notes:
    - Limit clip duration to 20–30s with warnings in UI.
    - Store original + renditions; lifecycle policies to manage cost.

- Auto-Transcription & Transcript Editing
  - Technical details:
    - Use AWS Transcribe / Google Speech-to-Text with time-coded captions
    - Store transcript segments and confidence scores
    - Provide transcript editor that writes back corrected text
  - Implementation notes:
    - Use transcript confidence to surface suggested edits; store both original & edited transcripts.

- Search & Filter (Full-Text + Faceted)
  - Technical details:
    - Use OpenSearch / Elasticsearch for indexing transcripts, metadata, tags
    - Support fuzzy search, synonyms, autocomplete, and autosuggest
    - Server-side faceting and cursor-based pagination
  - Implementation notes:
    - Weight scoring: machine model, tags, transcript relevance, recency, customer assignment
    - Capture search analytics for tuning relevance.

- Adaptive Video Player & Transcript Sync
  - Technical details:
    - Use Video.js / Shaka Player for HLS with adaptive bitrate
    - Playback token (signed URL or short TTL) authorization
    - Sync transcript highlighting via timecodes; clickable timestamps
    - Accessibility: captions, keyboard nav, ARIA labels
  - Implementation notes:
    - Integrate PiP, playback speed, loop, and quality selector. Provide offline caching heuristics.

- Course Builder & Learning Flow
  - Technical details:
    - Course data model: course -> modules -> ordered nodes (clip or quiz)
    - Versioning: drafts, publishes, schedule publish
    - State machine for learner progress and locks
  - Implementation notes:
    - Prevent circular references; validate prerequisites on save.
    - Provide preview as learner with test data.

- Quizzes, Scoring & Certificate Issuance
  - Technical details:
    - Quiz engine supports MCQ and short answer; auto-grading for MCQ
    - Store attempts, timestamps, scoring, and remediation links
    - Certificate generation: signed PDF with unique ID/QR & verification URL; tamper-evident signing (HMAC or PKI)
  - Implementation notes:
    - Allow certificate templates with org branding and expiry rules.
    - Support audit export of attempt logs.

- Notifications & Messaging
  - Technical details:
    - Transactional email via SendGrid; templating for events (verify, reset, notifications)
    - In-app notification store with read/unread
    - Webhooks for custom integrations
  - Implementation notes:
    - Throttle notification delivery, support unsubscribe and preferences.

- Subscription Billing & Payment
  - Technical details:
    - Integrate Stripe for subscriptions, invoicing, coupon support
    - Data model for seats, proration, per-equipment allocation
    - Webhook handlers for payment events and provisioning logic
  - Implementation notes:
    - Provide admin UI to manage invoices, issue credits, and export billing CSV.

- Admin & Moderation Tools
  - Technical details:
    - Moderation queue model with statuses and reason codes
    - Audit logs for admin actions (immutable)
    - Support impersonation for support with clear audit trail
  - Implementation notes:
    - Bulk moderation actions and reassign clips to customers.

- Analytics & Reporting
  - Technical details:
    - Event ingestion (Kafka/managed) with ETL to Snowflake/BigQuery
    - Pre-aggregated metrics for dashboard UI
    - Exportable and scheduled reports (CSV/PDF)
  - Implementation notes:
    - Track events: clip.view, search.query, course.start/complete, quiz.attempt, certificate. Include context (user, tenant, clipId).

- Performance, Caching & Backup
  - Technical details:
    - CDN (CloudFront / Cloudflare) for HLS/segments & static assets
    - Redis for caching frequent queries and session store
    - DB backups daily; object storage lifecycle & versioning
  - Implementation notes:
    - Cache search results for repeated queries with short TTL and invalidate on content changes.

- Privacy, Compliance & Security Controls
  - Technical details:
    - Data retention policies per org config
    - Encryption at rest (S3/EBS) and in-flight (TLS)
    - RBAC, tenant isolation, and audit logs
  - Implementation notes:
    - Provide org-level settings to adjust retention and export data.

## 3. User Journeys

- Visitor → Request Demo / Signup
  1. Land on Landing Page; read features and view hero demo.
  2. Click Request Demo or Sign Up CTA.
  3. Fill demo request form or signup (email/password or SSO).
  4. If signup: receive email verification; verify to continue.
  5. For enterprise: Admin configures SAML/SCIM via Settings.

- New Customer Onboarding (Customer Admin)
  1. Customer Admin signs up / is invited.
  2. Verify email and optionally complete org settings.
  3. Set SSO (optional) and provisioning via SCIM.
  4. Configure library allocation: select machine models and seat counts.
  5. Winbro provisions assigned clips or uploads per onboarding plan.
  6. Invite users (bulk CSV/SCIM) and assign roles.
  7. Training managers build courses or assign curated content.
  8. Receive analytics and scheduled reports.

- Upload & Publish Clip (Uploader/Trainer)
  1. Navigate to Create / Upload Content.
  2. Upload file via drag-and-drop (resumable) or mobile URL.
  3. Fill metadata, assign customer(s), select machine model.
  4. Auto-transcription runs; edit transcript if needed.
  5. Trim clip, choose thumbnail, set publish state (draft/submit for review/publish).
  6. Clip enters moderation queue if required; reviewer approves or requests edits.
  7. Once published, clip is indexed and available to assigned tenant libraries.

- Search & View Clip (Learner)
  1. From Dashboard or global search, enter query.
  2. Use facets to narrow by machine, process, tags.
  3. Select clip card to open Clip Viewer.
  4. Watch adaptive HLS clip with transcript sync.
  5. Add note, bookmark, or add clip to a course.
  6. If unresolved, report issue to moderator.

- Build & Publish Course (Trainer)
  1. Open Course Builder, create new course draft.
  2. Drag clips into module sequence; insert quiz nodes after modules.
  3. Set passing criteria, allowed attempts, certificate template.
  4. Preview course as learner, publish or schedule.
  5. Monitor learner progress & completion via Analytics.

- Complete Course & Get Certificate (Learner)
  1. Learner launches course in Learning Player.
  2. Complete required clips in sequence; take inline quizzes.
  3. On passing threshold, system generates certificate (PDF + QR).
  4. Certificate available in User Profile and can be downloaded/shared.
  5. Admin/trainer receives reporting of completion.

- Admin Moderation Flow (Reviewer/Admin)
  1. Admin checks Admin Dashboard review queue.
  2. Open Clip Detail, play clip, review metadata and transcript.
  3. Approve, request edits, or reject with reason code.
  4. Adjust customer allocations as needed; log action to audit trail.

- Billing & Seat Management (Customer Admin)
  1. View subscription in Settings / Billing.
  2. Change seat counts or plan; checkout/provision via Stripe.
  3. Review invoices and transaction history.
  4. Stripe webhooks update subscription state and provisioning logic.

- Support & Incident (User)
  1. Report issue from Clip Viewer or Help page.
  2. Ticket created in Support system (Zendesk/Freshdesk) via API.
  3. Admin/support uses impersonation (if permitted) to reproduce issue.
  4. Resolution documented and user notified.

## 4. UI Guide

- Color Palette
  - Primary: Deep Teal (#0B6B6F) — primary CTA, nav accents
  - Secondary: Warm Amber (#F3A712) — highlights, badges
  - Accent: Cool Slate (#2F3A44) — text accents, icons
  - Surface: Neutral White (#FFFFFF)
  - Muted Background: Light Gray (#F6F7F8)
  - Success: Green (#2E8B57)
  - Error: Crimson (#D64545)
  - Info: Blue (#2B7AE4)
  - Disabled: Gray (#BAC4C9)
  - Notes: Provide 3-step tonality for hover/active states (10%/20% darker tints).

- Typography
  - Primary font: Inter (var- or system fallback)
  - Secondary font for headings: Source Sans Pro or similar
  - Scale:
    - H1: 32px / 48px line-height
    - H2: 24px / 36px
    - H3: 18px / 28px
    - Body: 14px–16px / 20px line-height
    - Small: 12px for captions
  - Weight usage:
    - Headings: 600–700
    - Body: 400–500
    - Buttons: 600
  - Accessibility: maintain contrast ratios WCAG AA (4.5:1 for normal text).

- Component Specs
  - Buttons:
    - Primary: rounded 6px, primary bg, white text, 12px vertical padding, min-height 40px
    - Secondary: outlined with primary color border
    - Disabled: muted gray, no pointer
    - Icon buttons: 40px square with hover state
  - Inputs & Forms:
    - Rounded 6px, 12px padding, neutral border (#E3E7EA)
    - Error state: border error color + inline message
    - Password strength meter: 4-tier colored bar + textual hint
  - Cards:
    - Elevation level 100 (subtle shadow), 8px radius
    - Clip card: thumbnail (16:9), duration badge top-right, tags row, actions on hover
  - Modals:
    - Centered, overlay dim 50%, close on Esc and outside click optional for non-destructive flows
  - Tables:
    - Compact row height, sortable columns, inline filters
  - Player Chrome:
    - Minimal controls bar with large play control, time, quality selector, captions toggle, PiP
    - Transcript panel dockable right with synchronized highlight
  - Alerts & Toasters:
    - Sticky top-right toasters (short-lived), dismissable; inline alerts for important actions

- Layout Principles
  - Responsive-first grid: 12-column layout desktop, 8-column tablet, single-column mobile
  - Fluid containers: max-width 1200–1400px for dashboard/content pages
  - Navigation:
    - Global top nav for logged-in users with persistent search
    - Left rail (optional) for deep content management in admin views
  - Spacing system: 4px base unit; spacing increments: 8/12/16/24/32/48
  - Breakpoints: mobile (<640px), tablet (641–1024px), desktop (1025–1440px), widescreen (>1440px)

- Visual Style & Component Patterns
  - Design mood: professional, pragmatic, trustworthy, engineering-focused — balance utilitarian UI with approachable microinteractions.
  - Iconography: simple line SVG icons with 2px stroke, filled variants for active states.
  - Microinteractions:
    - Hover elevations for cards and buttons
    - Subtle loading skeletons for lists and cards
    - Smooth transitions for modal open/close (150–200ms)
  - Forms & Validation:
    - Inline validation with friendly guidance; use green check for valid fields
  - Clip Cards:
    - Hover overlays: Play CTA + quick actions (bookmark, add-to-course)
    - Timestamped chapter chips along card footer
  - Course Canvas:
    - Drag handles with snap-grid, inline thumbnails, module collapse/expand
    - Validation badges (missing quiz, unassigned clip)
  - Accessibility:
    - All interactive elements keyboard-focusable with visible focus ring
    - ARIA roles for modals, form alerts, live regions for toasters
    - Captions and transcript accessible to screen readers

- Component Patterns (reusable)
  - Entity Picker: searchable dropdown with fuzzy matching and multi-select chips
  - Faceted Filter: collapsible categories with count badges and clear-all action
  - Bulk Action Toolbar: shows when items selected with primary bulk actions
  - Job Status Tile: progress bar + ETA + action (cancel/retry)
  - Certificate Card: preview, download PDF, QR/verification link, issue date, expiry

- Overall Design Mood
  - Tone: concise, no-frills, industrial-grade reliability
  - Visual emphasis: clarity of information, quick scanability, functional microinteractions
  - Imagery: focus on real equipment hero stills and short demo clips; avoid stock generic imagery
  - Brand usage: prominent logo on marketing & certificates; subtle brand accents in product UI

## Instructions to AI Development Tool

After every development step, refer back to this blueprint to ensure correct implementation. Verify all features and pages are built according to specifications before completing the project. Pay special attention to the UI Guide section and ensure all visual elements follow the design system exactly. Validate the following at each milestone:
- Authentication flows (email, SSO, 2FA, password reset) adhere to token, cookie, and rate-limit rules.
- RBAC enforced server-side and client-side with tenant isolation.
- Upload pipeline uses presigned/resumable uploads, virus scanning, and transcoding job statuses.
- Player implements HLS, transcript sync, and secure playback tokens.
- Search indexes transcripts and metadata, supports facets, autocomplete, and analytics capture.
- Course builder supports drag/drop, quizzes, preview mode, versioning, and publish rules.
- Certificate generation produces signed PDFs with unique verification links/QRs.
- Billing integrates with Stripe and handles seat/patient allocation and webhooks.
- Admin workflows include moderation queue, impersonation, and audit logs.
- Analytics events are captured and ETLed to reporting storage for dashboards.
- UI components respect the color palette, typography, spacing, and accessibility rules.

Verification checklist before sign-off:
- All pages listed in Section 1 implemented and responsive.
- Core features in Section 2 fully functional with tests (unit + integration).
- User journeys in Section 3 validated end-to-end in staging.
- UI components conform to Section 4 specs; run visual regression and accessibility audits.
- Security review passed (auth, encryption, secrets management, rate-limiting).
- Load testing on upload/streaming pipeline and search scale.
- Monitoring/alerts configured (errors, latency, job failures) and support integrations enabled.

Follow this blueprint as the single source of truth for engineering, design, QA, and product teams.

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in RGB format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
