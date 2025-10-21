# Winbro Training Reels

A modern SaaS platform for manufacturing training through microlearning videos. Built with React, TypeScript, Tailwind CSS, and Vite.

## Features Implemented

### ✅ Core Infrastructure
- **Modern React Stack**: React 18, TypeScript, Vite with SWC
- **Design System**: Custom Winbro color palette and typography
- **UI Components**: Shadcn/ui components with custom styling
- **Routing**: React Router with protected routes
- **State Management**: TanStack React Query for server state
- **API Layer**: Axios-based API client with interceptors
- **Authentication**: Complete auth flow with hooks

### ✅ Pages & Features
- **Landing Page**: Marketing site with hero, features, testimonials
- **Authentication**: Login, Signup, Password Reset, Email Verification
- **Dashboard**: User dashboard with stats, activity feed, recommendations
- **Content Library**: Browse and search training clips
- **Placeholder Pages**: All major routes with basic structure

### ✅ Design System
- **Color Palette**: Deep Teal (#0B6B6F), Warm Amber (#F3A712), Cool Slate (#2F3A44)
- **Typography**: Inter font family with proper hierarchy
- **Components**: Custom-styled Shadcn components
- **Animations**: Tailwind CSS animations and transitions
- **Responsive**: Mobile-first responsive design

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v3, Shadcn/ui
- **State**: TanStack React Query, React Hook Form
- **Validation**: Zod schema validation
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Charts**: Recharts (ready for implementation)

## Project Structure

```
src/
├── components/ui/          # Shadcn UI components
├── pages/                 # Page components
├── hooks/                 # Custom React hooks
├── api/                   # API layer
├── types/                 # TypeScript type definitions
├── lib/                   # Utilities and helpers
└── contexts/              # React contexts
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Key Features

### Authentication System
- Email/password authentication
- Password strength validation
- Password reset flow
- Email verification
- SSO integration ready

### Dashboard
- Library overview with statistics
- Recent activity feed
- Recommended content
- Quick actions
- Pinned libraries

### Content Management
- Searchable clip library
- Grid/list view modes
- Filtering capabilities
- Responsive design

### Design System
- Consistent color palette
- Typography hierarchy
- Component variants
- Animation system
- Accessibility features

## Next Steps

The foundation is complete and ready for:
- Video player implementation
- Content upload interface
- Course builder
- Learning management system
- Admin tools
- Analytics dashboard
- Payment integration

## Development Notes

- All components follow the Winbro design system
- TypeScript strict mode enabled
- ESLint configured for code quality
- Responsive design implemented
- Accessibility considerations included
- Performance optimized with Vite

## Build Status

✅ **Build Successful** - All TypeScript compilation and Vite bundling working correctly.

The application is ready for development and can be extended with additional features as needed.
