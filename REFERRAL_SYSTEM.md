# 🎯 Sistema de Referidos con AppsFlyer - Jokers of Neon

## 📋 Resumen

Sistema completo de referidos integrado con AppsFlyer que permite:
- **Deep Linking y Deferred Deep Linking**: Links que redirigen al App Store y detectan instalaciones
- **Atribución de instalaciones**: Saber si un usuario instaló desde un link de referido
- **Tracking de hitos**: Registrar cuando usuarios referidos cumplen objetivos
- **Recompensas basadas en hitos**: Otorgar recompensas al referidor cuando el referido cumple hitos

## 🔄 Flujo Completo

### 1. Usuario A genera link de referido

```typescript
import { createReferralCode } from "./api/referral";

const referralCode = await createReferralCode(userAddress);
// Ejemplo: "0x1234-ABCD"

// Generar OneLink de AppsFlyer con:
// - deep_link_value: "referral"
// - deep_link_sub1: referralCode
// - deep_link_sub2: userAddress (referrer)
```

**Link resultante**: `https://app.appsflyer.com/onelink/...?deep_link_value=referral&deep_link_sub1=0x1234-ABCD&deep_link_sub2=0x5678...`

### 2. Usuario B hace click en el link

- **Si tiene la app instalada**: Deep link directo → App se abre
- **Si NO tiene la app**: Redirige a App Store → Usuario instala → App se abre

### 3. AppsFlyer detecta la atribución

En `AppDelegate.swift`:
- `onConversionDataSuccess`: Se llama cuando AppsFlyer detecta la instalación
- `didResolveDeepLink`: Se llama cuando se resuelve el deep link

Los datos se envían a JavaScript vía `AppsFlyerBridge` plugin.

### 4. Frontend procesa los datos

En `useAppsFlyerReferral` hook:
- Detecta datos de referral pendientes
- Llama a `/api/referral/claim` para registrar el referral
- Guarda la información para tracking de hitos

### 5. Usuario B cumple hitos

Cuando el usuario referido cumple hitos (crea cuenta, juega juegos, etc.):
- Se llama a `/api/referral/milestone` para registrar el hito
- El sistema verifica si hay recompensas pendientes

### 6. Recompensas al referidor

Cuando se cumplen hitos:
- Se llama a `/api/referral/check-rewards` para el referidor
- Se otorgan recompensas (packs, XP, cartas, season pass)
- Se actualiza el perfil del referidor

## 📊 Estructura de Datos

### Parámetros OneLink

Para el sistema de referidos, usamos estos parámetros en los links:

- `deep_link_value`: `"referral"` (indica que es un link de referido)
- `deep_link_sub1`: `referral_code` (código de referido, ej: "0x1234-ABCD")
- `deep_link_sub2`: `referrer_address` (dirección Starknet del referidor)

### Hitos Definidos

Los hitos que se pueden trackear:

1. **`account_created`**: Usuario crea su cuenta
   - Recompensa: 1 pack

2. **`games_played_5`**: Usuario juega 5 juegos
   - Recompensa: 100 XP

3. **`games_played_10`**: Usuario juega 10 juegos
   - Recompensa: 1 pack

4. **`level_5`**: Usuario alcanza nivel 5
   - Recompensa: 500 XP

5. **`level_10`**: Usuario alcanza nivel 10
   - Recompensa: 1 pack

## 🔧 Integración en el Código

### Registrar hito cuando se crea cuenta

En `src/state/useProfileStore.ts` o donde se crea el perfil:

```typescript
import { registerMilestone } from "../api/referral";

// Cuando se crea el perfil
await createProfileApi(userAddress, username, avatarId);
await registerMilestone(userAddress, "account_created");
```

### Registrar hito cuando se juega un juego

En `src/providers/GameProvider.tsx`:

```typescript
import { registerMilestone } from "../api/referral";
import { getReferralStats } from "../api/referral";

// Después de crear un juego
const gameId = await createGame(...);

// Obtener stats del usuario para saber cuántos juegos ha jugado
const stats = await getProfileStats(userAddress);
const gamesPlayed = stats.games_played || 0;

// Registrar hitos
if (gamesPlayed === 5) {
  await registerMilestone(userAddress, "games_played_5", 5);
}
if (gamesPlayed === 10) {
  await registerMilestone(userAddress, "games_played_10", 10);
}
```

### Registrar hito cuando sube de nivel

En `src/utils/handleXPEvents.ts` o donde se maneja el nivel:

```typescript
import { registerMilestone } from "../api/referral";

// Cuando el usuario sube de nivel
if (newLevel === 5) {
  await registerMilestone(userAddress, "level_5", 5);
}
if (newLevel === 10) {
  await registerMilestone(userAddress, "level_10", 10);
}
```

### Verificar y distribuir recompensas

Cuando un referidor quiere ver sus recompensas:

```typescript
import { checkAndDistributeRewards } from "../api/referral";

// Verificar y distribuir recompensas pendientes
await checkAndDistributeRewards(referrerAddress);
```

## 🗄️ Base de Datos

### Tablas Creadas

1. **`referral_codes`**: Códigos de referido por usuario
2. **`referral_claims`**: Registro de cuando un usuario usa un código
3. **`device_registrations`**: Tracking de dispositivos (anti-fraude)
4. **`referral_milestones`**: Hitos cumplidos por usuarios referidos

### Migración

Ejecutar la migración SQL:

```bash
# En Supabase o tu cliente SQL
psql -f migrations/create_referral_system.sql
```

## 🔐 Anti-Fraude

El sistema incluye varias protecciones:

1. **Self-referral**: No permite que un usuario se refiera a sí mismo
2. **Device tracking**: Detecta si referidor y referido comparten dispositivo
3. **IP hashing**: IPs se hashean para privacidad
4. **Device fingerprinting**: Tracking de dispositivos únicos

## 📱 AppsFlyer Bridge

El plugin `AppsFlyerBridge.swift` permite comunicación entre Swift y JavaScript:

- **Conversión de datos**: Instalación atribuida
- **Deep links**: Links de referido resueltos

Los datos se envían vía eventos de Capacitor que se escuchan en `appsflyerReferral.ts`.

## 🎁 Sistema de Recompensas

### Configuración de Recompensas

Las recompensas se configuran en `referral.controller.ts` en la función `checkAndDistributeRewards`:

```typescript
const rewardRules: Record<string, { type: string; amount: number }> = {
  'account_created': { type: 'pack', amount: 1 },
  'games_played_5': { type: 'xp', amount: 100 },
  'games_played_10': { type: 'pack', amount: 2 },
  'level_5': { type: 'xp', amount: 500 },
  'level_10': { type: 'pack', amount: 3 },
};
```

### Tipos de Recompensas

- **`pack`**: Pack ID (se agrega a `claimable_packs`)
- **`xp`**: Cantidad de XP (se agrega al perfil)
- **`card`**: Card ID (se mintea una carta)
- **`season_pass`**: Season pass (se otorga season pass)

### Distribución de Recompensas

**TODO**: Implementar la lógica real de distribución en `checkAndDistributeRewards`:

1. Para packs: Agregar a `claimable_packs` en el perfil
2. Para XP: Agregar XP al perfil
3. Para cartas: Mintear carta vía NFT controller
4. Para season pass: Otorgar season pass

## 🧪 Testing

### Testing de Deep Links

1. Genera un link de referido con OneLink
2. Abre el link en Safari (no en la app)
3. Si no tienes la app: Debería redirigir al App Store
4. Si tienes la app: Debería abrirla directamente
5. Revisa los logs de Xcode para ver los datos de AppsFlyer

### Testing de Deferred Deep Linking

1. Desinstala la app
2. Genera un link de referido
3. Abre el link → Redirige al App Store
4. Instala la app desde Xcode
5. Abre la app
6. AppsFlyer debería detectar la atribución y llamar `didResolveDeepLink`

## 📝 Próximos Pasos

1. **Implementar distribución real de recompensas** en `checkAndDistributeRewards`
2. **Integrar registro de hitos** en los puntos clave del código
3. **Crear UI para mostrar referidos** (código, stats, recompensas)
4. **Configurar OneLink template** en el dashboard de AppsFlyer
5. **Testing end-to-end** del flujo completo

## 🔗 Referencias

- [AppsFlyer iOS SDK Integration](https://dev.appsflyer.com/hc/docs/integrate-ios-sdk)
- [AppsFlyer Unified Deep Linking](https://dev.appsflyer.com/hc/docs/dl_ios_unified_deep_linking)
- [AppsFlyer User Invite](https://dev.appsflyer.com/hc/docs/dl_ios_user_invite)
