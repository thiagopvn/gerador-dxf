# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Development Commands

```bash
# Development
npm run dev                 # Start Next.js dev server (http://localhost:3000)
npm run build              # Build for production
npm run start              # Start production server

# Code Quality
npm run lint               # Run Next.js linter
npm run type-check         # TypeScript type checking with tsc --noEmit

# Database Setup
npm run db:seed            # Populate Firestore with data from /data folder
npm run db:admin           # Create admin user (admin@remarcacao.com / Admin@2024!)
```

## 🏗️ Architecture Overview

### Core Architecture Principles
- **100% Serverless**: All backend logic lives in Next.js API Routes. No Express.js, custom servers, or file-based databases (SQLite).
- **Firebase Stack**: Authentication (JWT), Firestore (database), Admin SDK for server-side operations
- **Component-Driven UI**: Reusable components in `/components/ui` and `/components/layout`
- **Type Safety**: Full TypeScript implementation with strict mode enabled

### Key Technical Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Firebase Firestore (NoSQL)
- **Auth**: Firebase Authentication with JWT tokens and role-based access
- **DXF Generation**: OpenType.js for text vectorization + dxf-writer for CAD file generation
- **Deployment**: Vercel-ready (serverless)

## 🔐 Authentication Flow

1. **Client Login**: User authenticates at `/login` using Firebase Auth SDK
2. **Token Management**: Firebase SDK manages JWT tokens automatically
3. **API Calls**: All requests to `/app/api/*` must include `Authorization: Bearer <token>` header
4. **Server Verification**: Every API route verifies token using Firebase Admin SDK and extracts user `uid` and `customClaims` (roles)

## 📁 Project Structure

```
/app/                      # Next.js App Router
  /api/                   # Serverless API endpoints
    /generate-dxf/        # DXF file generation
    /users/               # User management CRUD
    /brands/              # Brand management
    /models/              # Model management
    /font-mappings/       # Font configuration
  /admin/                 # Admin panel pages (requires admin role)
  /dashboard/             # User dashboard (brand/model selection)
  /login/                 # Authentication page

/components/
  /ui/                    # Atomic components (Button, Card, Input, Modal)
  /layout/                # Layout components (Header, PageWrapper, ModalWrapper)
  /(feature-specific)/    # Complex components (BrandSelection, ModelSelection, DXFGenerationModal)

/lib/
  firebase.ts             # Firebase Client SDK config
  firebase-admin.ts       # Firebase Admin SDK config
  types.ts               # TypeScript type definitions
  utils.ts               # Utility functions (cn for className merging)

/data/                    # Static data sources (synced to Firestore)
  brands.ts              # Brand definitions
  models.ts              # Model definitions by brand
  fontMappings.ts        # Font configurations per model/year

/public/
  /fonts/                # Font files (.ttf/.otf) for DXF generation
  /logos/                # Brand logos for UI

/scripts/                # Database setup scripts
```

## 🎨 Design System

### Color Palette (Tailwind CSS classes)
- **Backgrounds**: `bg-background` (#111111), `bg-card` (#1a1a1a)
- **Text**: `text-foreground` (#ffffff), `text-muted` (#a0a0a0)
- **Primary**: `bg-primary` / `text-primary` (#E50914 - red), `hover:bg-primary-hover` (#f40612)
- **Borders**: `border-border` (#2a2a2a)

### Component Guidelines
- Always use existing UI components from `/components/ui/`
- Follow existing patterns for new components
- Use `'use client'` directive for components with React hooks or browser events
- Implement loading states (skeletons/spinners) for async operations
- Handle errors gracefully with user-friendly messages

## 🔑 Critical Development Rules

1. **Serverless Only**: Never introduce server-dependent code, Express.js, or file-based databases
2. **Security First**: All API routes must validate JWT tokens and check user roles
3. **Component Reuse**: Always use existing UI components instead of custom styling
4. **Type Safety**: Maintain TypeScript strict mode, no `any` types
5. **Firebase Integration**: All data operations through Firestore, no local file storage for data
6. **Error Handling**: Always provide clear error messages and loading states

## 🔒 API Security Pattern

Every API route must follow this pattern:

```typescript
// 1. Verify authentication token
const token = await verifyToken(request);
if (!token) return unauthorized();

// 2. Check user role/permissions
if (token.role !== 'admin') return forbidden();

// 3. Execute business logic
// ...
```

## 🚫 Avoid These Patterns

- Creating custom servers or Express.js endpoints
- Using SQLite or file-based databases
- Direct file system operations for data storage
- Ignoring the existing component library
- Skipping authentication checks in API routes
- Adding comments unless explicitly requested
- Creating documentation files unless asked

## 📝 Important Notes

- The application is designed for Vercel deployment (100% serverless)
- Firebase credentials should be configured in `.env.local`
- Admin access: `admin@remarcacao.com` / `Admin@2024!`
- All fonts for DXF generation must be placed in `/public/fonts/`
- Brand logos should be in `/public/logos/`