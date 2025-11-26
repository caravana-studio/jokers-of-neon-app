# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jokers of Neon is a roguelike deck-builder card game built fully on-chain using Dojo Engine (a Starknet framework). It's inspired by Balatro mechanics where players accumulate points through poker hands and enhance their deck with special cards and modifiers. The game is designed for mobile-first experiences with native iOS and Android apps via Capacitor.

## Common Development Commands

### Install Dependencies
```bash
npm i --legacy-peer-deps
```
Note: Always use `--legacy-peer-deps` flag due to dependency version conflicts in the Dojo ecosystem.

### Development
```bash
npm run dev              # Start Vite dev server
npm run build           # TypeScript compile + Vite build
npm run preview         # Preview production build
```

### Code Quality
```bash
npm run lint            # ESLint check
npm test               # Run Vitest tests
```

### Dojo Contract Bindings
```bash
npm run generate        # Generate TypeScript bindings from Dojo contracts
```

After running `generate`, **manual post-processing is required**:
1. Open `src/dojo/typescript/contracts.gen.ts`
2. Find and replace all instances of `"jokers_of_neon_core"` with `DOJO_NAMESPACE`
3. Add at the top of the file:
   ```typescript
   const DOJO_NAMESPACE = import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";
   ```

### GraphQL Code Generation
```bash
npm run codegen         # Generate TypeScript types from GraphQL schema
```

### Native App Development
For iOS and Android builds using Capacitor:
```bash
npm run build           # Build web assets first
npx cap copy            # Copy to native projects
npx cap open ios        # Open Xcode
npx cap open android    # Open Android Studio
```
See [NATIVE-APPS.md](NATIVE-APPS.md) for complete release procedures.

## Architecture

### Blockchain Layer (Dojo Engine)
The game runs fully on-chain using Dojo Engine, a framework built on Starknet:
- **Contract Setup**: [src/dojo/setup.ts](src/dojo/setup.ts) initializes Dojo provider, Torii client (for entity sync), and burner wallet manager
- **Generated Bindings**: `src/dojo/typescript/` contains auto-generated TypeScript bindings from Cairo contracts
  - `contracts.gen.ts` - Contract system calls
  - `models.gen.ts` - Entity schemas
  - `defineContractComponents.ts` - Component definitions for RECS
- **World Entity System**: Uses RECS (React Entity Component System) from `@dojoengine/recs`
- **Game Actions**: [src/dojo/useGameActions.tsx](src/dojo/useGameActions.tsx) and [src/dojo/useShopActions.tsx](src/dojo/useShopActions.tsx) expose high-level game operations (create game, play hand, buy items)

### State Management
The app uses **Zustand** for client-side state:
- [src/state/useGameStore.ts](src/state/useGameStore.ts) - Main game state (hands, discards, rounds, points)
- [src/state/useCurrentHandStore.ts](src/state/useCurrentHandStore.ts) - Selected cards in current hand
- [src/state/useShopStore.ts](src/state/useShopStore.ts) - Store items and purchases
- [src/state/useDeckStore.ts](src/state/useDeckStore.ts) - Player's deck composition
- [src/state/useAnimationStore.ts](src/state/useAnimationStore.ts) - Animation state coordination

### Wallet Integration
Two-layer wallet system in [src/dojo/WalletContext.tsx](src/dojo/WalletContext.tsx):
1. **Cartridge Controller Connector** (`@cartridge/connector`) - Session keys for gasless transactions
2. **Burner Wallets** - Local temporary wallets for development/testing

### Context Providers
Key React contexts in [src/providers/](src/providers/):
- `DojoProvider` - Dojo client and contract access
- `WalletProvider` - Wallet connection state
- `StarknetProvider` - Starknet network configuration
- `GameProvider` - Game-specific state and logic
- `StoreProvider` - Shop state during rounds
- `FeatureFlagProvider` - Feature toggles (uses `rox-browser`)

### Routing
[src/AppRoutes.tsx](src/AppRoutes.tsx) defines all routes:
- `/` - Home/lobby (NewHome)
- `/my-games` - Active games list
- `/store` - Between-round shop
- `/map` - Game progression map
- `/deck` - View current deck
- `/tutorial` - Tutorial game flow
- `/gameover/:gameId` - End game results

Route-specific data loaders:
- `GameStoreLoader` - Loads game state for gameplay pages
- `ShopStoreLoader` - Loads shop data

### Environment Configuration
Key environment variables in `.env`:
- `VITE_RPC_URL` - Starknet RPC endpoint
- `VITE_TORII_URL` - Torii indexer URL (for entity queries)
- `VITE_GRAPHQL_URL` - GraphQL endpoint for Torii
- `VITE_DOJO_NAMESPACE` - Contract namespace (default: `jokers_of_neon_core`)
- `VITE_TOURNAMENT_NAMESPACE` - Tournament contract namespace
- `VITE_FM_APP_KEY` - Feature flag service key
- `VITE_DEV` - Development mode flag
- `VITE_DISABLE_VRF` - Disable verifiable random function (for testing)

Two configurations provided:
- **SLOT** (default) - Cartridge hosted infrastructure
- **LOCAL** - Local katana/torii instance

### Internationalization
Uses `i18next` with namespaces:
- `game`, `home`, `store`, `cards`, `tutorials`, `intermediate-screens`, `plays`, `achievements`, `map`, `docs`
- Translation files in `public/locales/`

### Audio System
[src/providers/AudioPlayerProvider.tsx](src/providers/AudioPlayerProvider.tsx) manages:
- Background music loops
- Sound effects (SFX)
- Uses Capacitor Native Audio on mobile, Howler.js on web
- Volume controls in settings

### Animation Coordination
[src/components/animations/](src/components/animations/) contains specialized animations:
- Card flip animations
- Particle effects (fireworks, patterns)
- Special card activation animations
- Hand-level animations

The animation system uses Framer Motion and custom orchestration to sequence game events.

### Mobile/Native Considerations
- Capacitor plugins for native functionality (haptics, preferences, audio)
- Native app version checking ([src/pages/VersionMismatch.tsx](src/pages/VersionMismatch.tsx))
- Mobile browser blocking (forces native app on mobile devices)
- Asset preloading strategy different for web vs native

## Testing
Tests use Vitest with React Testing Library:
- Unit tests in `src/utils/tests/` (especially hand checking logic)
- Component tests co-located with components
- Mock utilities in `src/testUtils/`

Run single test file:
```bash
npm test -- src/utils/tests/checkHand/basic.test.ts
```

## Important Patterns

### Transaction Handling
All blockchain transactions follow this pattern (see [src/dojo/useGameActions.tsx](src/dojo/useGameActions.tsx)):
1. Call `showTransactionToast()` to show pending toast
2. Execute contract call via `client.{system}.{method}(account, ...args)`
3. Parse transaction receipt events
4. Call `updateTransactionToast()` with success/failure
5. Handle achievement notifications via `handleAchievements()`

### Entity Synchronization
Torii client syncs on-chain entities to local RECS components. The pattern:
1. Query entities by game ID
2. Use `setEntities()` to hydrate local components
3. React components subscribe via `useComponentValue()` or `useEntityQuery()`

### Feature Flags
Check feature availability:
```typescript
import { useFeatureFlagEnabled } from './featureManagement/useFeatureFlagEnabled';

const isEnabled = useFeatureFlagEnabled('feature_name');
```

### Card Identification
Cards are identified by:
- `idx` - Unique card instance ID
- Card type enum (Traditional, Neon, Joker, Modifier, Special)
- Suit and value for traditional cards
Use `getCardUniqueId()` utility for consistent card keys.

## Related Repositories

This frontend connects to:
- **jokers-of-neon-core** - Cairo/Dojo smart contracts (referenced in `npm run generate`)
- Contracts must be deployed and manifest updated before frontend can connect

## Common Gotchas

1. **Always use `--legacy-peer-deps`** when installing packages
2. **Manual namespace replacement required** after `npm run generate`
3. **Burner wallets need initialization** - First run may create wallets automatically
4. **Torii must be running** for entity queries to work
5. **Asset preloading** - Large assets preloaded on init, may cause delays on first load
6. **Transaction event parsing** - Event keys must match contract event names (see `DojoEvents` enum)
