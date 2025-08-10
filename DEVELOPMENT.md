# DEVELOPMENT.md

Development guide and architecture documentation for the Open MES system.

## Project Overview

Modern Manufacturing Execution System (MES) - A React-based web application with Supabase backend for managing production operations, quality control, and resource tracking.

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, React Router
- **Backend**: Supabase (PostgreSQL, Realtime, Auth, RLS)
- **State Management**: Zustand, React Query (TanStack Query)
- **UI Components**: Lucide Icons, Framer Motion, Chart.js
- **Build Tools**: Vite, PostCSS, ESLint

## Common Commands

```bash
# Development
npm install          # Install dependencies
npm run dev         # Start dev server (port 3000)
npm run build       # Create production build
npm run preview     # Preview production build
npm run lint        # Run ESLint

# Database (Supabase)
supabase link --project-ref [project-ref]  # Link to Supabase project
supabase db push                          # Apply migrations
```

## Project Architecture

### Frontend Structure
```
src/
├── components/     # Reusable UI components (Layout, LoadingSpinner, ProtectedRoute)
├── contexts/       # Auth context with Supabase integration
├── lib/           # Supabase client configuration
├── pages/         # Page components (Dashboard, Products, Machines, etc.)
├── styles/        # Global styles and TailwindCSS
└── utils/         # Helper functions
```

### Database Schema (Supabase)
- **products**: Product catalog with specifications
- **machines**: Equipment with status tracking (operational/maintenance/idle)
- **employees**: Users with roles (admin/manager/operator/viewer/demo)
- **productions**: Production runs with status tracking
- **quality_checks**: Quality inspection records
- **materials**: Inventory management
- **maintenance_records**: Equipment maintenance history
- **error_reports**: Production issue tracking

### Key Features
1. **Authentication**: Supabase Auth with demo mode support
2. **Real-time Updates**: Live production and machine status via Supabase Realtime
3. **Role-based Access**: RLS policies for data security
4. **Demo Mode**: Read-only access for testing (demo@mes-system.com)
5. **Responsive Design**: Mobile-friendly interface

### Security & Permissions
- Row Level Security (RLS) enabled on all tables
- Demo users have read-only access
- Role hierarchy: admin > manager > operator > viewer > demo
- Environment variables for sensitive configuration

### Important Files
- `.env`: Supabase credentials (copy from .env.example)
- `supabase/migrations/`: Database schema and RLS policies
- `src/lib/supabase.js`: Supabase client configuration
- `src/contexts/AuthContext.jsx`: Authentication logic