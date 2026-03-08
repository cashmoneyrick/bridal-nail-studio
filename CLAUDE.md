# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev        # Start dev server (localhost:8080)
npm run build      # Production build
npm run build:dev  # Development build
npm run lint       # ESLint check
npm run preview    # Preview production build
```

No testing framework is configured — there are no test files, test libraries, or test scripts.

## Architecture Overview

This is a React + Vite + TypeScript e-commerce application for a custom press-on nail business (YourPrettySets).

### Tech Stack
- **Build:** Vite with React SWC plugin
- **State:** Zustand 5 (with localStorage persistence)
- **Backend:** Supabase (auth, profiles, orders, edge functions)
- **UI:** shadcn/ui components (49 primitives) + Tailwind CSS
- **Data fetching:** @tanstack/react-query
- **Animations:** Framer Motion
- **Carousels:** embla-carousel (with autoplay/auto-scroll)
- **Forms:** react-hook-form + zod validation
- **Charts:** Recharts
- **Routing:** React Router DOM v6
- **Toasts:** Sonner + shadcn/ui toast
- **Fonts:** Playfair Display (display headings) + Inter (body text)

### Source Structure
```
src/
├── pages/              # Route components (22 pages)
├── components/         # UI components (91 files total)
│   ├── ui/             # shadcn/ui primitives (49 files)
│   └── create/         # Custom Studio designer steps (14 files)
├── stores/             # Zustand stores (6 files)
├── hooks/              # Custom hooks (4 files)
├── lib/                # Utilities (6 files)
├── assets/             # Hero images, product photos
└── integrations/       # Supabase client and types
    └── supabase/

supabase/
├── config.toml         # Supabase CLI config
├── functions/          # Edge Functions (4 functions)
└── migrations/         # Database migrations (12 SQL files)
```

### Routes & Pages

| Route | Page | Notes |
|-------|------|-------|
| `/` | Index | Homepage |
| `/shop` | Shop | Product listing |
| `/product/:handle` | ProductDetail | Single product view |
| `/create` | Create | Custom Studio designer (standalone, no footer) |
| `/club` | NailClub | Membership program |
| `/how-to` | HowTo | Guide hub |
| `/how-to/sizing` | HowToSizing | Sizing guide |
| `/how-to/application` | HowToApplication | Application guide |
| `/how-to/troubleshooting` | HowToTroubleshooting | Troubleshooting guide |
| `/how-to/removal` | HowToRemoval | Removal guide |
| `/how-to/bridal` | HowToBridal | Bridal guide |
| `/contact` | Contact | Contact form |
| `/cart` | Cart | Shopping cart |
| `/favorites` | Favorites | Liked products |
| `/auth` | Auth | Login/signup |
| `/account` | Account | Account dashboard |
| `/account/perfect-fit` | PerfectFitProfile | Nail sizing profile |
| `/settings` | AccountSettings | Account settings |
| `/settings/addresses` | Addresses | Saved addresses |
| `/orders` | OrderHistory | Order history |
| `/payment` | PaymentMethods | Payment methods |
| `*` | NotFound | 404 page |

### State Management (Zustand Stores)
- **authStore** — User auth, session, profile (Supabase-backed)
- **cartStore** — Shopping cart (localStorage persisted)
- **nailProfilesStore** — Saved nail sizes (localStorage + Supabase sync)
- **customStudioStore** — Multi-step custom design state
- **favoritesStore** — Liked products
- **discountCodesStore** — Promo/discount codes (apply, track, mark used)

### Custom Hooks
- **use-mobile** — Mobile viewport detection
- **use-toast** — Toast notification hook (shadcn/ui)
- **useNailProfileSync** — Migrates local nail profiles to Supabase on login
- **useScrollReveal** — Scroll-triggered reveal animations

### Lib Utilities
- **products.ts** — Product data (sampleProducts array)
- **pricing.ts** — Custom Studio pricing logic
- **colorRecipes.ts** — Nail color recipe definitions
- **logger.ts** — Error logging
- **uploadCustomArtwork.ts** — Custom artwork uploads to Supabase storage
- **utils.ts** — General utilities (cn helper for className merging)

### Key Features
- **Custom Studio** (`/create`) — Multi-step nail designer: shape, length, finish, effects, colors, rhinestones, charms, nail art, accent nails. Pricing logic in `src/lib/pricing.ts`. Components in `src/components/create/`
- **Nail Club** — Membership program with monthly drops, discount codes, birthday gifts (BirthdaySurpriseSection, MembershipSection, MonthlyDropSection)
- **Email Marketing** — Popup signup with seasonal promotions (EmailPopup, EmailSignup)
- **FAQ Chatbot** — Floating chatbot widget (FaqChatbot, conditionally hidden on /create route)
- **Perfect Fit Profile** — Nail measurement/sizing system
- **How-To Guides** — 5 guide pages (Application, Bridal, Removal, Sizing, Troubleshooting)

### Global Components (rendered in App.tsx)
- `AuthInitializer` — Initializes Supabase auth on mount
- `Toaster` / `Sonner` — Toast notifications (dual system)
- `EmailPopup` — Email signup modal
- `FaqChatbotConditional` — FAQ chatbot (hidden on /create)
- `ScrollToTop` — Scroll-to-top button

### Supabase

**Tables:**
- `profiles` — User profile info
- `nail_profiles` — Saved size measurements
- `custom_orders` — Custom nail design orders (shape, length, finish, colors, effects, rhinestones_tier, charms_tier, accent_nails, artwork details, estimated_price, status)
- `birthday_claims` — Birthday gift redemptions (gift_type, year, discount_code, shipped, address_snapshot)

**Edge Functions** (`supabase/functions/`):
- `create-custom-order` — Creates a custom nail order
- `faq-chat` — FAQ chatbot backend
- `subscribe-newsletter` — Newsletter subscription
- `update-order-images` — Updates order images after upload

### Key Patterns
- Product data lives in `src/lib/products.ts` (sampleProducts array)
- Custom studio pricing logic in `src/lib/pricing.ts`
- Auth initializes via `AuthInitializer` component in App.tsx
- `useNailProfileSync` hook migrates local profiles to Supabase on login
- `useScrollReveal` hook for scroll-triggered animations
- Error logging via `src/lib/logger.ts`
- Custom artwork uploads via `src/lib/uploadCustomArtwork.ts`
- Path alias: `@` maps to `./src`
- shadcn/ui configured via `components.json` in project root

## Business Context

YourPrettySets is a custom handmade press-on nail business. NOT exclusively bridal — we serve all customers wanting custom press-on nails. The website is for product showcase and lead generation.

## Design Direction

- Luxury editorial aesthetic (inspired by Glossier, Olive & June)
- NO generic template looks
- Color palette: sage green, dusty blue, cream, and forest green (CSS vars in index.css)
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
