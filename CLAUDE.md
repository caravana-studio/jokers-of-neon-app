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
- `useAnimationStore.ts` - Animation state
- `useLootBoxStore.ts` - Loot box/pack opening state

### Providers
Key providers in `src/providers/`:
- `GameProvider.tsx` - Game session state and lifecycle
- `StoreProvider.tsx` - In-game store state
- `SettingsProvider.tsx` - Audio/visual settings
- `StarknetProvider.tsx` - Starknet wallet connection
- `RevenueCatProvider.tsx` - In-app purchases
- `TutorialGameProvider.tsx` - Tutorial mode state
- `MapProvider.tsx` - Game map/progression state
- `SeasonPassProvider.tsx` - Season pass functionality

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

**Key Files:**
- `src/utils/appsflyer.ts` - SDK wrapper, link generation (`generateNativeInviteUrl`)
- `src/utils/appsflyerReferral.ts` - Deep link handling, localStorage
- `src/hooks/useAppsFlyerReferral.tsx` - Hook for processing referral on login
- `ios/App/App/AppsFlyerBridge.swift` - Capacitor bridge (event listeners)
- `ios/App/App/AppDelegate.swift` - SDK initialization and deep link delegates

**Referral Link Format:**
```
https://jokersofneon.onelink.me/2BD9?ref=username
```
- OneLink template `2BD9` has `deep_link_value=ref` as default
- The `ref` parameter contains the username (referral code)
- Backend looks up referrer wallet from username in `referral_codes` table

**Backend API (jokers-of-neon-api):**
- `POST /api/referral/claim` - Claim referral (anti-fraud checks)
- `POST /api/referral/create-code` - Create code from username
- `GET /api/referral/stats/:user_address` - Get statistics
- `POST /api/referral/milestone` - Register milestones

**Test Page:** `/referral-test`

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
