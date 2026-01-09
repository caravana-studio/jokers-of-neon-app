# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jokers of Neon is a roguelike deck-builder card game built as a React web app with native mobile support via Capacitor. The game runs fully on-chain using the Dojo engine on Starknet.

## Commands

### Development
```bash
npm i --legacy-peer-deps     # Install dependencies (legacy peer deps required)
npm run dev                  # Start development server
npm run dev:shop             # Start standalone shop development server
```

### Building
```bash
npm run build                # Build for production
npm run build:shop           # Build standalone shop
npm run build:all            # Build main app + shop
```

### Testing & Quality
```bash
npm run test                 # Run tests with Vitest
npm run lint                 # Run ESLint on src/
```

### Code Generation
```bash
npm run generate             # Generate Dojo bindings from contracts
npm run codegen              # Generate GraphQL types
```

After running `npm run generate`, manually update `src/dojo/typescript/contracts.gen.ts`:
1. Replace all instances of `"jokers_of_neon_core"` with `DOJO_NAMESPACE`
2. Add at the top: `const DOJO_NAMESPACE = import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";`

### Native Builds (Capacitor)
```bash
npm run build && npx cap copy    # Prepare web assets for native
npx cap open ios                  # Open in Xcode
npx cap open android              # Open in Android Studio
```

## Architecture

### Entry Points
- `src/main.tsx` - Main app entry with loading sequence, provider setup, and version checking
- `src/AppRoutes.tsx` - Route definitions for all pages

### Dojo Integration (Blockchain)
The game uses Dojo engine for on-chain game logic:
- `dojoConfig.ts` - Dojo configuration with RPC/Torii URLs
- `src/dojo/setup.ts` - Initializes Torii client, contract components, and burner wallet
- `src/dojo/DojoContext.tsx` & `WalletContext.tsx` - React contexts for Dojo state
- `src/dojo/useGameActions.tsx` - Game action hooks (play, discard, surrender)
- `src/dojo/useShopActions.tsx` - Shop action hooks (buy items, reroll)
- `src/dojo/queries/` - Data fetching functions from on-chain state
- `src/dojo/typescript/` - Auto-generated contract bindings

### State Management
Uses Zustand stores in `src/state/`:
- `useGameStore.ts` - Main game state (score, cards, powerups, rounds)
- `useShopStore.ts` - Shop state during rounds
- `useCurrentHandStore.ts` - Current hand being played
- `useDeckStore.ts` - Deck management
- `useProfileStore.ts` - Player profile data

### Providers
Key providers in `src/providers/`:
- `GameProvider.tsx` - Game session state and lifecycle
- `StoreProvider.tsx` - In-game store state
- `SettingsProvider.tsx` - Audio/visual settings
- `StarknetProvider.tsx` - Starknet wallet connection
- `RevenueCatProvider.tsx` - In-app purchases
- `TutorialGameProvider.tsx` - Tutorial mode state

### API Layer
- `src/api/` - Backend API calls (profile, season rewards, referrals)
- `src/queries/` - React Query hooks for data fetching
- `src/dojo/queries/` - On-chain data queries via Torii

### Internationalization
Translations in `public/locales/{en,es,pt}/` with namespaces: game, home, store, cards, tutorials, intermediate-screens, plays, achievements, map, docs.

### Key Directories
- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components (Game, Shop, Map, etc.)
- `src/types/` - TypeScript type definitions
- `src/enums/` - Game enums (plays, cards, suits)
- `src/constants/` - Configuration constants
- `src/utils/` - Helper functions

### AppsFlyer Integration (Mobile Attribution & Referrals)
The app uses AppsFlyer for install attribution, deferred deep linking, and referral tracking.

**Frontend (TypeScript):**
- `src/utils/appsflyer.ts` - Core SDK wrapper: event logging, CUID, device ID
- `src/utils/appsflyerReferral.ts` - Deep link/referral handling, API calls to backend
- `src/hooks/useAppsFlyerReferral.tsx` - React hook for processing referral data on login

**iOS Native (Swift):**
- `ios/App/App/AppsFlyerBridge.swift` - Capacitor plugin bridge for SDK communication
- `ios/App/App/AppDelegate.swift` - SDK initialization, delegates for attribution/deep links
- `ios/App/Podfile` - Contains `AppsFlyerFramework` dependency

**Data Flow:**
1. App launch → AppDelegate configures AppsFlyer SDK
2. SDK calls `onConversionDataSuccess` (install attribution) or `didResolveDeepLink` (referral links)
3. Native code posts NotificationCenter events → AppsFlyerBridge picks up → sends to JavaScript
4. `appsflyerReferral.ts` listeners receive data, store in localStorage
5. `useAppsFlyerReferral` hook processes on user login → calls backend API

**Deep Link Parameters:**
- `deep_link_value`: "referral" identifies referral links
- `deep_link_sub1`: referral code (username)
- `deep_link_sub2`: referrer's Starknet address

**Backend API Endpoints (jokers-of-neon-api):**
- `POST /api/referral/claim` - Claim referral code (with anti-fraud checks)
- `POST /api/referral/attribution` - Register install attribution
- `POST /api/referral/milestone` - Register user milestones for rewards
- `POST /api/referral/check-rewards` - Distribute pending rewards

## Environment Configuration

Copy `.env_example` to `.env`. Key variables:
- `VITE_RPC_URL` - Starknet RPC endpoint
- `VITE_TORII_URL` - Torii indexer URL
- `VITE_GRAPHQL_URL` - GraphQL endpoint
- `VITE_DOJO_NAMESPACE` - Dojo contract namespace
- `VITE_DEV` - Enable dev features

## Testing

Tests use Vitest and are located alongside source files or in `__tests__` directories. Example pattern: `src/utils/tests/checkHand/basic.test.ts`

Run a single test file:
```bash
npm run test -- src/utils/versionUtils.test.ts
```
