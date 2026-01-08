# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jokers of Neon is a roguelike deck-builder card game (inspired by Balatro) that runs fully on-chain using the Dojo framework on Starknet. The frontend is a React app with Capacitor for iOS/Android native builds.

## Commands

```bash
# Install dependencies (legacy peer deps required)
npm i --legacy-peer-deps

# Development
npm run dev                    # Start dev server
npm run dev:shop              # Start standalone shop dev server

# Build
npm run build                  # Production build
npm run build:shop            # Build standalone shop
npm run build:all             # Build all variants

# Code Generation
npm run generate              # Generate Dojo contract bindings (requires sozo)
npm run codegen               # Generate GraphQL types

# Testing & Linting
npm run test                  # Run tests with vitest
npm run lint                  # ESLint check
```

**After running `npm run generate`:** Manually update `src/dojo/typescript/contracts.gen.ts`:
1. Replace all `"jokers_of_neon_core"` with `DOJO_NAMESPACE`
2. Add at top: `const DOJO_NAMESPACE = import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";`

## Architecture

### State Management

**Zustand Stores** (`src/state/`):
- `useGameStore` - Game state (score, plays, cash, level, rounds, powers, cards)
- `useCurrentHandStore` - Current hand/play state
- `useDeckStore` - Deck management
- `useShopStore` - Shop/purchase state
- `useProfileStore` - User profile data
- `useAnimationStore` - Animation states

**Context Providers** (`src/providers/`):
- `GameProvider` - Game logic & actions (play/discard/shop operations)
- `StoreProvider` - Shop state
- `CardAnimationsProvider` - Card animation effects
- `SettingsProvider` - Audio/game settings
- `SeasonPassProvider` - Season pass tracking
- `RevenueCatProvider` - In-app purchases

### Dojo Integration (Blockchain)

- `dojoConfig.ts` - Dojo configuration (RPC/Torii URLs)
- `src/dojo/setup.ts` - Initializes Torii client and contract components
- `src/dojo/DojoContext.tsx` - Provides Dojo setup to app
- `src/dojo/WalletContext.tsx` - Wallet/burner account management
- `src/dojo/useGameActions.tsx` - Game action dispatchers
- `src/dojo/typescript/contracts.gen.ts` - Generated contract bindings

**Data Flow:**
1. `setup()` initializes Torii client & contract components
2. `useGameActions()` dispatches transactions to smart contracts
3. Contract events update Zustand stores
4. UI re-renders from store changes

### Directory Structure

```
src/
├── api/                    # Backend API calls
├── components/             # Reusable UI components
├── constants/              # Game constants (animations, icons, plays)
├── dojo/                   # Blockchain integration layer
│   ├── controller/         # Account & transaction controllers
│   ├── queries/            # Contract data fetching
│   └── typescript/         # Generated bindings
├── hooks/                  # Custom React hooks
├── pages/                  # Route-level pages
├── providers/              # Context providers
├── state/                  # Zustand stores
├── theme/                  # Chakra UI theme
├── types/                  # TypeScript types
└── utils/                  # Utility functions
```

### Key Technologies

- **UI**: Chakra UI, Framer Motion, React Spring, Three.js
- **State**: Zustand, React Context
- **Web3**: @dojoengine/*, Starknet.js, Cartridge connector
- **Data**: GraphQL (graphql-request), React Query
- **Mobile**: Capacitor (iOS/Android), RevenueCat (IAP)
- **Build**: Vite, TypeScript

### Routing

React Router v6 in `AppRoutes.tsx`. Key routes:
- `/` - Home
- `/game-page` - Active game
- `/deck`, `/manage`, `/shop` - Deck/card management
- `/store` - Purchases/packs
- `/leaderboard`, `/tournament` - Competitions

### Patterns

- **Provider Composition** - Multiple nested context providers
- **Store-Driven UI** - Zustand stores as single source of truth
- **Loaders** - `GameStoreLoader`, `ShopStoreLoader` fetch data before rendering
- **Feature Flags** - Rox integration for gradual rollouts

## Environment Variables

See `.env_example` for required variables including:
- `VITE_RPC_URL` - Starknet RPC endpoint
- `VITE_TORII_URL` - Torii indexer URL
- `VITE_DOJO_NAMESPACE` - Contract namespace
