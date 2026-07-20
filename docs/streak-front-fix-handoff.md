# Handoff de frontend: presentación y actualización de daily streak

Fecha: 2026-07-20

Branch de trabajo: `fix/streak-flow-rebuild`

## Resumen ejecutivo

El backend y el worker completan correctamente el daily streak. El fallo actual
está en el frontend:

1. La app consulta la presentación una sola vez, antes de que el worker termine.
2. Si la API responde `not_completed_today`, la app no vuelve a consultar.
3. El streak visible queda con el valor cargado al iniciar sesión y no se
   actualiza cuando cambia el cache del backend.

Para la primera corrección alcanza con modificar la app. No es necesario cambiar
API, worker ni contratos.

La regla principal es: **ninguna consulta o retry de streak puede bloquear una
transición normal del juego**.

## Evidencia del caso real

Caso auditado:

- Game ID: `15060`
- Period ID: `20654`
- Misión: `daily-play-hand`
- XP: `10`

Secuencia registrada en Supabase:

| Hora UTC | Estado |
| --- | --- |
| 17:49:14 | Worker insertó `daily_mission_pending` con streak proyectado `1` |
| 17:49:15 | Se encoló `xp.mission_completed` |
| 17:49:27 | La transacción fue confirmada |
| 17:49:27 | `player_streaks` quedó confirmado con streak `1` |

El endpoint live terminó devolviendo:

```json
{
  "current_streak": 1,
  "effective_streak": 1,
  "last_completed_day": "20654",
  "sync_status": "confirmed"
}
```

La tabla `player_streak_presentations` no tenía un receipt para el jugador y el
período. La presentación seguía disponible, pero el frontend ya había recibido
un primer `show: false` y no volvió a consultar.

## Causa raíz

### Carrera de tiempos en la presentación

La app llama a:

```text
POST /api/profile/streak/:player/presentation/claim
```

desde Home, Rewards, Summary y Store. Si esa llamada ocurre antes de que el
worker escriba el estado pending/confirmed, la API responde:

```text
show: false
reason: not_completed_today
```

Ese resultado es correcto para el instante de la consulta. El problema es que
la app lo interpreta como definitivo.

### Estado visual desactualizado

`ProfileTile` lee el streak desde `useProfileStore`. El store obtiene el valor al
iniciar sesión o montar el componente, pero no recibe ninguna señal cuando el
worker termina varios segundos después.

El backend no puede modificar un Zustand store que ya vive en el navegador. La
app necesita actualizarlo mediante polling, refetch o una suscripción.

## Por qué antes parecía funcionar

El claim one-shot existe desde el feature original de presentación, incorporado
en `04bd183f Add daily streak presentation and profile entry point`.

Los casos exitosos dependían del timing:

- El worker terminaba antes de que el usuario presionara continuar.
- El usuario llegaba a Home después de la confirmación.
- El componente se remontaba y hacía otra consulta.

No era un flujo determinista. Cambios posteriores hicieron más visible una
carrera que ya existía.

## Archivos actuales involucrados

### Detección de misión

- `src/utils/handleXPEvents.ts`
- `src/utils/playEvents/getDailyMissionCompleteEvent.ts`

`handleXPEvents` ya detecta que una daily mission fue completada, reproduce el
sonido, muestra el toast y registra el milestone de referral. Este es el punto
correcto para solicitar una verificación de presentación en segundo plano.

### Claims directos que deben eliminarse

- `src/pages/NewHome/NewHome.tsx`
- `src/components/RewardsDetail.tsx`
- `src/pages/SummaryPage.tsx`
- `src/pages/store/StoreElements/useNextLevelButton.tsx`

Actualmente estas pantallas llaman directamente a `claimStreakPresentation`.
Algunas esperan la respuesta dentro de su flujo de navegación y Summary puede
mostrar un loader mientras consulta.

### Estado visual

- `src/state/useProfileStore.ts`
- `src/components/ProfileTile.tsx`

El store necesita una operación explícita para aplicar un nuevo streak status o
refrescarlo sin bloquear la pantalla.

### Navegación

- `src/utils/streakPresentation.ts`
- `src/pages/StreakIncreasedPage.tsx`

La navegación y las continuaciones existentes pueden reutilizarse. Lo que debe
cambiar es cuándo se descubre y entrega la presentación.

## Diseño frontend propuesto

### 1. Store de coordinación en memoria

Crear un único store de presentación con un estado equivalente a:

```ts
type StreakPresentationState = {
  requestedAddress: string | null;
  requestedAt: number | null;
  checking: boolean;
  retryCount: number;
  pendingPresentation: StreakPresentationClaimApiData | null;
};
```

Responsabilidades:

- Deduplicar múltiples eventos/effects de React.
- Recordar que existe una misión diaria que requiere verificación.
- Guardar el resultado exitoso hasta llegar a una ruta segura.
- Cancelar la tarea si cambia la cuenta o se desmonta la app.
- Mantener todo en memoria. Si se cierra la app, se acepta perder el intento en
  esta primera versión.

No es obligatorio confiar en el `periodId` parseado por la app para iniciar el
check. El backend devuelve el período definitivo cuando el claim está listo.

### 2. Trigger desde `handleXPEvents`

Cuando existe al menos un `dailyMissionEvent` válido:

```ts
requestStreakPresentationCheck(address);
```

Esta llamada debe ser síncrona y no debe esperarse con `await`.

El referral milestone, toast y sonido continúan funcionando como hasta ahora.

### 3. Polling desacoplado de la navegación

Un coordinator montado cerca de `App` observa el request y consulta el endpoint
existente en segundo plano.

Comportamiento sugerido:

- Una sola request activa por cuenta.
- Timeout individual corto por request.
- Backoff progresivo, por ejemplo `2s`, `3s`, `5s`, con máximo estable.
- Continuar mientras la app siga abierta, la cuenta no cambie y la presentación
  no haya sido encontrada.
- `show: false` agenda otro intento; no cambia rutas ni loaders.
- Errores de red hacen retry en background; no afectan el juego.
- `show: true` guarda `pendingPresentation` y termina el polling.

El endpoint actual consume el receipt cuando devuelve `show: true`. Bajo la
suposición acordada de que la app permanece abierta, el resultado puede guardarse
en memoria hasta llegar a una ruta segura.

### 4. Entrega sólo en rutas seguras

La presentación no debe interrumpir una mano en curso.

Rutas o límites seguros:

- Rewards
- Summary
- Store al salir
- Map
- Home

Cuando existe `pendingPresentation`, el coordinator navega a
`/streak-increased` con la continuación apropiada. Si todavía no existe resultado,
la navegación normal continúa inmediatamente.

### 5. Actualización inmediata del contador

Al recibir `show: true`:

1. Aplicar `presentation.streak` a `useProfileStore` de forma inmediata.
2. Hacer un `fetchStreakStatus` en segundo plano para sincronizar protectores,
   estado efectivo y otros campos.
3. Actualizar el store con la respuesta confirmada cuando llegue.

También conviene hacer un refetch no bloqueante al montar Home. Ese refetch no
debe mostrar un loader global.

### 6. Parser y test de receipt

El parser actual de `MissionCompletedV2Event` debe tener un test con el layout
real capturado. El receipt observado contiene dos felts de metadata antes del
payload completo.

El test debe verificar al menos:

- Player correcto.
- `periodType = daily`.
- `periodId = 20654`.
- Mission/template ID.
- XP `10`.
- Game ID.

Aunque el coordinator no necesite el period ID para arrancar, el parser debe
dejar de producir datos incorrectos para toasts, logs y futuras integraciones.

## Cambios que no deben repetirse

- No esperar polling dentro de `handleContinue`, `handleNextLevelClick` o
  effects que controlan loaders de página.
- No mantener un loader full-screen esperando la convergencia del worker.
- No crear un endpoint long-poll que la UI espere antes de navegar.
- No ejecutar retries infinitos dentro de una Promise esperada por navegación.
- No llamar `claimStreakPresentation` simultáneamente desde cuatro pantallas.
- No mover el receipt de presentación a core/profile. Es estado de entrega de UI,
  no estado económico on-chain.
- No usar el milestone de referral como fuente autoritativa del streak.

## ¿Hace falta tocar backend?

No para esta primera versión.

El worker del caso auditado:

- Recibió `MissionCompletedV2Event`.
- Escribió el estado pending.
- Encoló la operación correcta.
- Confirmó la transacción.
- Actualizó el cache a streak `1`.

La API también devuelve correctamente el cache confirmado.

Una mejora futura podría separar:

- `peek`: descubrir una presentación sin consumirla.
- `claim/ack`: consumirla cuando monta la pantalla.

Eso daría mayor durabilidad frente a cierres o crashes, pero no es requisito para
el alcance actual.

## Logs no relacionados con streak

### `Unknown VITE_ENV="aws-mainnet"`

`getManifest.ts` no reconoce `aws-mainnet` como alias local y muestra un warning.
Luego descarga correctamente `manifest_aws-mainnet.json`, que sí contiene
`MissionCompletedV2Event`. No fue la causa del fallo de streak.

Conviene ajustar el fallback para reconocer `aws-mainnet` y `aws-testnet`, pero
debe hacerse como un fix separado de configuración/logging.

### `claimLives Invalid transaction nonce`

Es una carrera del adapter/session de Cavos durante login. No afecta la misión ni
el worker de streak. Debe tratarse en un fix separado.

### Referral `PGRST116`

La API intenta obtener un único referral y no encuentra filas. Luego maneja el
caso como usuario no referido. Es ruido de logs, no un error de streak.

## Criterios de aceptación

1. Completar una misión nunca demora ni bloquea el avance de ronda.
2. Con worker demorado 20 segundos, la navegación continúa y la presentación
   aparece posteriormente en una ruta segura.
3. El contador visible cambia de `0` a `1` sin recargar ni cerrar la app.
4. Un timeout de API no muestra loader global ni bloquea botones.
5. Eventos duplicados inician un solo polling.
6. React Strict Mode/effects duplicados no muestran dos presentaciones.
7. El mismo período no se presenta dos veces.
8. La presentación conserva la continuación correcta hacia Map, Rewards,
   Summary o Home.
9. Si no hubo misión diaria, no se inicia polling persistente.
10. Cambiar de cuenta cancela completamente el polling anterior.
11. El parser devuelve `periodId = 20654` para el receipt de prueba capturado.
12. `npm run build` y los tests de store/polling/parser pasan.

## Alcance de deployment

Para este fix mínimo se redeploya solamente la app.

API, worker y contratos quedan sin cambios mientras los tests no detecten una
regresión adicional.
