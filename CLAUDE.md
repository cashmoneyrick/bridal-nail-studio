# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start dev server (localhost:8080)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Architecture Overview

This is a React + Vite + TypeScript e-commerce application for a nail studio business.

### Tech Stack
- **Build:** Vite with React SWC plugin
- **State:** Zustand (with localStorage persistence)
- **Backend:** Supabase (auth, profiles, orders)
- **UI:** shadcn/ui components + Tailwind CSS
- **Forms:** react-hook-form + zod validation
- **Routing:** React Router DOM v6

### Source Structure
```
src/
├── pages/           # Route components
├── components/      # UI components
│   ├── ui/          # shadcn/ui primitives
│   └── custom-studio/
├── stores/          # Zustand stores
├── hooks/           # Custom hooks
├── lib/             # Utilities (products, pricing, etc.)
└── integrations/    # Supabase client and types
```

### State Management (Zustand Stores)
- **authStore** - User auth, session, profile (Supabase-backed)
- **cartStore** - Shopping cart (localStorage persisted)
- **nailProfilesStore** - Saved nail sizes (localStorage + Supabase sync)
- **customStudioStore** - Multi-step custom design state
- **favoritesStore** - Liked products

### Key Patterns
- Product data lives in `src/lib/products.ts` (sampleProducts array)
- Custom studio pricing logic in `src/lib/pricing.ts`
- Auth initializes via `AuthInitializer` component in App.tsx
- `useNailProfileSync` hook migrates local profiles to Supabase on login
- Path alias: `@` maps to `./src`

### Supabase Tables
- `profiles` - User profile info
- `nail_profiles` - Saved size measurements
- `custom_orders` - Custom nail design orders
- `birthday_claims` - Birthday gift redemptions

## Business Context

YourPrettySets is a custom handmade press-on nail business. NOT exclusively bridal — we serve all customers wanting custom press-on nails. The website is for product showcase and lead generation.

## Design Direction

- Luxury editorial aesthetic (inspired by Glossier, Olive & June)
- NO generic template looks
- Color palette: dusty rose and cream
- Mobile and desktop are equally important
- Prioritize clean typography and asymmetric layouts

## Workflow Preferences

- Make incremental changes over large rewrites
- Ask 3-5 clarifying questions before making changes to avoid assumptions
- One feature or fix at a time
- Prioritize user-facing functionality and conversion optimization over technical perfection
- Rank work by customer impact, not technical complexity

## Rules

- NEVER change the color palette without explicit permission
- NEVER delete files without asking first
- ALWAYS show what you plan to change before doing it
- When unsure, ask — don't guess
