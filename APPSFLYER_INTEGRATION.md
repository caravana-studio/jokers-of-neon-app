# AppsFlyer Integration Guide

## 📋 Resumen

Esta guía documenta la integración de AppsFlyer para iOS en Jokers of Neon. AppsFlyer se utiliza para:
- **Deep Linking y Deferred Deep Linking**: Links que redirigen al App Store y detectan instalaciones
- **Atribución de instalaciones**: Saber si un usuario instaló desde un link de referido
- **Tracking de eventos**: Eventos personalizados para hitos del juego
- **Sistema de referidos**: Generación de links de invitación

## 🔧 Configuración

### Credenciales
- **App ID**: `6749147020`
- **Dev Key**: `GXf8msjiYkKjdxMjgsb6LU`
- **Package Name**: `com.jokersofneon.play`

### Archivos Modificados

1. **Podfile** (`ios/App/Podfile`)
   - Agregado: `pod 'AppsFlyerFramework', '~> 6.14'`

2. **AppDelegate.swift** (`ios/App/App/AppDelegate.swift`)
   - Configuración del SDK de AppsFlyer
   - Manejo de deep links y Universal Links
   - Delegates para conversion data y deep linking

3. **App.entitlements** (`ios/App/App/App.entitlements`)
   - Agregados dominios para Universal Links:
     - `applinks:app.appsflyer.com`
     - `applinks:onelink.me`

4. **AppsFlyerPlugin.swift** (`ios/App/App/AppsFlyerPlugin.swift`)
   - Plugin de Capacitor para bridge JS-Native
   - Métodos: `setCustomerUserId`, `logEvent`, `generateInviteLink`, `getAppsFlyerUID`

5. **appsflyer.ts** (`src/utils/appsflyer.ts`)
   - Utilidad TypeScript para usar AppsFlyer desde el código React
   - Helpers para eventos comunes

## 📦 Instalación

### 1. Instalar dependencias de CocoaPods

```bash
cd ios/App
pod install
```

### 2. Registrar el plugin en Xcode

El plugin `AppsFlyerPlugin.swift` debe estar incluido en el target de Xcode. Si no se registra automáticamente:

1. Abre `App.xcworkspace` en Xcode
2. Agrega `AppsFlyerPlugin.swift` al target `App`
3. Asegúrate de que esté en "Compile Sources"

### 3. Configurar Universal Links (Opcional pero recomendado)

Para que los links de AppsFlyer funcionen correctamente, necesitas configurar:

1. En el dashboard de AppsFlyer, configura tu dominio OneLink
2. Agrega el archivo `apple-app-site-association` a tu servidor web en `jokersofneon.com/.well-known/apple-app-site-association`
3. Verifica que los dominios en `App.entitlements` coincidan con tu configuración

## 🎯 Eventos Personalizados

### Eventos Definidos

Todos los eventos están prefijados con `jn_` (Jokers of Neon):

#### Account Events
- `jn_account_created` - Usuario crea cuenta
- `jn_login` - Usuario inicia sesión

#### Game Events
- `jn_game_started` - Juego iniciado
- `jn_game_completed` - Juego completado
- `jn_game_won` - Juego ganado
- `jn_game_lost` - Juego perdido
- `jn_level_achieved` - Nivel completado
- `jn_round_completed` - Ronda completada

#### Progression Events
- `jn_profile_level_up` - Subida de nivel de perfil
- `jn_daily_mission_completed` - Misión diaria completada
- `jn_achievement_unlocked` - Logro desbloqueado

#### Store Events
- `jn_pack_opened` - Pack abierto
- `jn_pack_purchased` - Pack comprado
- `jn_card_purchased` - Carta comprada
- `jn_season_pass_purchased` - Season Pass comprado
- `jn_powerup_purchased` - Power-up comprado

#### Social Events
- `jn_referral_code_shared` - Código de referido compartido
- `jn_referral_code_used` - Código de referido usado

#### Tutorial Events
- `jn_tutorial_started` - Tutorial iniciado
- `jn_tutorial_completed` - Tutorial completado

## 💻 Uso en el Código

### Importar la utilidad

```typescript
import { 
  setAppsFlyerCustomerUserId, 
  AppsFlyerHelpers,
  AppsFlyerEvents 
} from "../utils/appsflyer";
```

### Ejemplo: Crear cuenta

```typescript
// Cuando se crea un perfil
await createProfileApi(userAddress, username, avatarId);

// Setear Customer User ID
await setAppsFlyerCustomerUserId(userAddress);

// Log evento de cuenta creada
AppsFlyerHelpers.logAccountCreated(userAddress, username);
```

### Ejemplo: Iniciar juego

```typescript
// Cuando se crea un juego
const gameId = await createGame(...);

// Log evento
AppsFlyerHelpers.logGameStarted(gameId, "classic");
```

### Ejemplo: Completar juego

```typescript
// Cuando se completa un juego
AppsFlyerHelpers.logGameCompleted(gameId, score, level, won);
```

### Ejemplo: Generar link de referido

```typescript
import { generateAppsFlyerInviteLink } from "../utils/appsflyer";

const inviteLink = await generateAppsFlyerInviteLink(userAddress);
if (inviteLink) {
  // Compartir el link
  await share(inviteLink);
  AppsFlyerHelpers.logReferralCodeShared(referralCode);
}
```

## 🔗 Deep Linking y Referidos

### Flujo de Referidos

1. **Usuario A genera link**:
   ```typescript
   const inviteLink = await generateAppsFlyerInviteLink(userAddress);
   // Link: https://app.appsflyer.com/...?referrer_address=0x123...
   ```

2. **Usuario B hace click**:
   - Si tiene la app: Deep link directo
   - Si no tiene la app: Redirige a App Store

3. **Usuario B instala y abre**:
   - AppsFlyer detecta la atribución
   - Se llama `onConversionDataSuccess` en AppDelegate
   - Los datos se envían a JavaScript vía NotificationCenter

4. **Procesar atribución en tu API**:
   - Crear endpoint para recibir webhooks de AppsFlyer
   - O procesar conversion data en el cliente y enviar a tu API

### Manejar Conversion Data

En `AppDelegate.swift`, los datos de conversión se envían vía `NotificationCenter`. Para recibirlos en JavaScript:

```typescript
// En algún componente o utilidad
import { Capacitor } from "@capacitor/core";

if (Capacitor.isNativePlatform()) {
  // Escuchar notificaciones de AppsFlyer
  // (Esto requiere configuración adicional en el bridge)
}
```

**Recomendación**: Configurar webhooks en el dashboard de AppsFlyer para recibir los datos directamente en tu API.

## 🧪 Testing

### Modo Debug

El SDK está configurado en modo debug en desarrollo:

```swift
#if DEBUG
AppsFlyerLib.shared().isDebug = true
#endif
```

### Verificar Instalación

1. Ejecuta la app en un dispositivo iOS
2. Revisa los logs de Xcode para ver mensajes de AppsFlyer
3. Verifica en el dashboard de AppsFlyer que aparezcan los eventos

### Testing de Deep Links

1. Genera un link de invitación
2. Abre el link en Safari (no en la app)
3. Debería redirigir al App Store si no tienes la app instalada
4. Si tienes la app instalada, debería abrirla directamente

## 📝 Próximos Pasos

### Integración de Eventos

Necesitas integrar los eventos en los siguientes lugares:

1. **Login/Account Creation** (`src/pages/Login.tsx`, `src/state/useProfileStore.ts`)
   - `jn_account_created` cuando se crea perfil
   - `jn_login` cuando se inicia sesión

2. **Game Events** (`src/providers/GameProvider.tsx`)
   - `jn_game_started` en `executeCreateGame`
   - `jn_game_completed` cuando termina el juego
   - `jn_level_achieved` cuando se pasa un nivel

3. **Store Events** (`src/pages/Shop/PackRow.tsx`, `src/providers/StoreProvider.tsx`)
   - `jn_pack_purchased` cuando se compra un pack
   - `jn_pack_opened` cuando se abre un pack
   - `jn_season_pass_purchased` cuando se compra season pass

4. **Progression Events** (`src/utils/handleXPEvents.ts`)
   - `jn_daily_mission_completed` cuando se completa misión
   - `jn_profile_level_up` cuando sube de nivel

### Configurar Webhooks

1. Ve al dashboard de AppsFlyer
2. Configura webhooks para:
   - Install attribution
   - In-app events (opcional)
3. Crea endpoints en tu API para recibir los webhooks
4. Procesa los datos y actualiza tu base de datos de referidos

### OneLink Configuration

1. Crea un template de OneLink en el dashboard
2. Configura los parámetros personalizados (ej: `referrer_address`)
3. Usa el template en `generateInviteLink`

## 🐛 Troubleshooting

### Plugin no se encuentra

Si ves el error "Plugin not available":
1. Verifica que `AppsFlyerPlugin.swift` esté en el target de Xcode
2. Rebuild el proyecto
3. Verifica que CocoaPods instaló correctamente

### Eventos no aparecen en dashboard

1. Verifica que el Dev Key sea correcto
2. Verifica que el App ID sea correcto (solo números, sin "id" prefix)
3. Revisa los logs de Xcode para errores
4. Asegúrate de que la app esté registrada en el dashboard

### Deep Links no funcionan

1. Verifica que los dominios estén en `App.entitlements`
2. Verifica que el archivo `apple-app-site-association` esté en tu servidor
3. Prueba con un dispositivo real (no funciona bien en simulador)

## 📚 Referencias

- [AppsFlyer iOS SDK Docs](https://dev.appsflyer.com/hc/docs/install-ios-sdk)
- [AppsFlyer Deep Linking Guide](https://dev.appsflyer.com/hc/docs/dl_ios_init_setup)
- [AppsFlyer Gaming Events](https://support.appsflyer.com/hc/en-us/articles/360018941117-Recommended-gaming-app-events)
- [OneLink Documentation](https://support.appsflyer.com/hc/en-us/articles/115005248543-OneLink-guide)
