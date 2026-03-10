# Roguelike PoC (Front-only)

## Qué incluye
- Dominio tipado en `src/domain/roguelike/*`.
- Capa de acceso a datos desacoplada (`GameApi`) en `src/gameApi/*`.
- `MockGameApi` con persistencia en `localStorage`.
- Stores Zustand para progreso meta, run activa y UI de unlock.
- Runtime store mock para loop jugable (`/demo -> /rewards -> /map -> /store`).
- Rutas UI PoC:
  - `/roguelike`
  - `/roguelike/prepare`
  - `/roguelike/post-run`
  - `/demo` (round jugable con cartas reales)
  - `/rewards` (mock rewards)
  - `/map` (mock map por instancia de run)
  - `/store` (shop mock con tabs desbloqueadas)

## Modo de ejecución
- Por defecto usa mock.
- Podés forzarlo con env:

```bash
VITE_GAME_API_MODE=mock npm run dev
```

La persistencia PoC usa la key `ROGUELIKE_POC_STATE_V1`.

## Cómo conectar provider real después
1. Implementar `ContractGameApi` en `src/gameApi/contract/ContractGameApi.ts` cumpliendo la interfaz `GameApi`.
2. Mantener mismos tipos de dominio (`src/domain/roguelike/types.ts`).
3. Cambiar el provider por env:

```bash
VITE_GAME_API_MODE=contract npm run dev
```

No hace falta reescribir componentes ni stores: sólo cambiar implementación de `GameApi`.
