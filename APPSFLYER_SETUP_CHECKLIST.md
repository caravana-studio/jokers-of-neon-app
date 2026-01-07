# ✅ Checklist de Setup - AppsFlyer Referral System

## 📱 iOS Setup

### 1. Podfile
- [x] AppsFlyerFramework agregado al Podfile
- [x] Ejecutar `pod install` en `ios/App/`

### 2. AppDelegate.swift
- [x] AppsFlyer SDK inicializado
- [x] DeepLinkDelegate configurado
- [x] AppsFlyerLibDelegate implementado
- [x] Deep link handling implementado

### 3. AppsFlyerBridge.swift
- [x] Plugin de Capacitor creado
- [x] **IMPORTANTE**: Asegurarse de que el archivo esté agregado al target en Xcode
  - Abrir `App.xcworkspace`
  - Verificar que `AppsFlyerBridge.swift` esté en el target "App"
  - Si no está, arrastrarlo al proyecto y marcar "Copy items if needed"

### 4. Info.plist
- [x] URL Schemes configurados (`jokers://`)
- [ ] Verificar Associated Domains si usas Universal Links

### 5. App.entitlements
- [x] Associated Domains configurado (`applinks:jokersofneon.com`)

## 🔧 Frontend Setup

### 1. TypeScript Files
- [x] `src/utils/appsflyerReferral.ts` - Utilidades para manejar referidos
- [x] `src/utils/appsflyerReferral.web.ts` - Web fallback
- [x] `src/hooks/useAppsFlyerReferral.tsx` - Hook para procesar referidos
- [x] `src/api/referral.ts` - API client para endpoints de referidos

### 2. App.tsx
- [x] `initAppsFlyerReferralListener()` llamado en useEffect
- [x] `useAppsFlyerReferral()` hook agregado

## 🗄️ Backend Setup

### 1. Database Migration
- [x] `migrations/create_referral_system.sql` creado
- [ ] **EJECUTAR**: Ejecutar la migración en Supabase
  ```sql
  -- Copiar y pegar el contenido de create_referral_system.sql en Supabase SQL Editor
  ```

### 2. API Routes
- [x] `src/routes/referral.routes.ts` creado
- [x] `src/controllers/referral.controller.ts` creado
- [x] Routes registradas en `src/index.ts`

### 3. Endpoints Disponibles
- [x] `POST /api/referral/claim` - Reclamar código de referido
- [x] `POST /api/referral/attribution` - Registrar atribución
- [x] `POST /api/referral/create-code` - Crear código de referido
- [x] `GET /api/referral/stats/:user_address` - Estadísticas de referidos
- [x] `POST /api/referral/milestone` - Registrar hito
- [x] `POST /api/referral/check-rewards` - Verificar y distribuir recompensas

## 🎯 AppsFlyer Dashboard Setup

### 1. OneLink Template
- [ ] Crear OneLink template en AppsFlyer Dashboard
- [ ] Configurar parámetros:
  - `deep_link_value`: "referral"
  - `deep_link_sub1`: `{referral_code}` (dinámico)
  - `deep_link_sub2`: `{referrer_address}` (dinámico)
- [ ] Configurar redirecciones:
  - iOS: App Store URL
  - Android: Play Store URL

### 2. Universal Links (iOS)
- [ ] Configurar Associated Domain en AppsFlyer
- [ ] Configurar `apple-app-site-association` en tu servidor
  - Debe estar en `https://jokersofneon.com/.well-known/apple-app-site-association`
  - Debe incluir el App ID: `id6749147020`

## 🧪 Testing

### 1. Compilación
- [ ] Compilar proyecto iOS: `⌘ + B` en Xcode
- [ ] Verificar que no hay errores de compilación

### 2. Deep Link Testing
- [ ] Generar link de referido con OneLink
- [ ] Abrir link en Safari (no en la app)
- [ ] Verificar redirección al App Store
- [ ] Instalar app y verificar que se detecta el referral

### 3. Deferred Deep Link Testing
- [ ] Desinstalar app
- [ ] Abrir link de referido
- [ ] Instalar app desde Xcode
- [ ] Abrir app y verificar que se detecta el referral

### 4. API Testing
- [ ] Probar `POST /api/referral/create-code`
- [ ] Probar `POST /api/referral/claim`
- [ ] Probar `POST /api/referral/milestone`
- [ ] Probar `GET /api/referral/stats/:user_address`

## 📝 Próximos Pasos

### 1. Integrar Registro de Hitos
- [ ] Registrar `account_created` cuando se crea perfil
- [ ] Registrar `games_played_5` y `games_played_10` cuando se juegan juegos
- [ ] Registrar `level_5` y `level_10` cuando se sube de nivel

### 2. Implementar Distribución de Recompensas
- [ ] Implementar lógica real en `checkAndDistributeRewards`
- [ ] Agregar packs a `claimable_packs`
- [ ] Agregar XP al perfil
- [ ] Mintear cartas si es necesario
- [ ] Otorgar season pass si es necesario

### 3. UI para Referidos
- [ ] Crear componente para mostrar código de referido
- [ ] Crear componente para mostrar estadísticas
- [ ] Crear componente para mostrar recompensas ganadas
- [ ] Crear componente para compartir link de referido

## 🔍 Debugging

### Logs a Revisar

**iOS (Xcode Console)**:
- `[AppsFlyer] Conversion data received`
- `[AppsFlyer] Deep link found`
- `[AppsFlyer] Referral code: ...`
- `[AppsFlyer] Referrer address: ...`

**JavaScript (Browser Console)**:
- `[AppsFlyer] Conversion data received: ...`
- `[AppsFlyer] Deep link data received: ...`
- `[AppsFlyer] Referral processed successfully`

**API (Server Logs)**:
- `[API] POST /api/referral/claim - referee: ...`
- `[API] POST /api/referral/milestone - user: ...`

## ⚠️ Problemas Comunes

### 1. Plugin no se registra
- Verificar que `AppsFlyerBridge.swift` esté en el target
- Verificar que Capacitor esté correctamente configurado

### 2. Deep links no funcionan
- Verificar que `handleOpen` y `continue` estén llamados en AppDelegate
- Verificar que OneLink esté correctamente configurado
- Verificar Associated Domains en App.entitlements

### 3. Referral no se detecta
- Verificar logs de AppsFlyer en Xcode
- Verificar que los parámetros del OneLink sean correctos
- Verificar que el hook `useAppsFlyerReferral` esté activo

### 4. API errors
- Verificar que la migración SQL se haya ejecutado
- Verificar que las tablas existan en Supabase
- Verificar que el API key sea correcto
