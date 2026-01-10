# Referral System Integration Testing Guide

Este documento describe cómo probar el flujo completo del sistema de referidos de Jokers of Neon usando AppsFlyer.

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO DE REFERIDO                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  REFERIDOR (Usuario A)                    REFERIDO (Usuario B)               │
│  ─────────────────────                    ────────────────────               │
│                                                                              │
│  1. Genera link de referido               4. Hace click en el link           │
│     ↓                                        ↓                               │
│  2. Comparte el link                      5. AppsFlyer registra click        │
│     ↓                                        ↓                               │
│  3. Se logea evento af_invite             6. Se instala la app               │
│                                              ↓                               │
│                                           7. AppsFlyer envía attribution     │
│                                              (Deferred Deep Link)            │
│                                              ↓                               │
│                                           8. App recibe deep link data       │
│                                              ↓                               │
│                                           9. Usuario crea cuenta             │
│                                              ↓                               │
│                                           10. Frontend llama /api/referral   │
│                                               /claim con los datos           │
│                                              ↓                               │
│                                           11. Backend registra el claim      │
│                                               y marca milestones             │
│                                              ↓                               │
│  12. Referidor recibe reward  ←──────────  Backend distribuye rewards        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Pre-requisitos

### 1. Configuración de AppsFlyer Dashboard

- [ ] OneLink template configurado con ID: `H5hv`
- [ ] Deep linking habilitado
- [ ] Parámetros de deep link configurados:
  - `deep_link_value`: identificador del tipo de deep link
  - `deep_link_sub1`: código de referido (username)
  - `deep_link_sub2`: dirección del referidor

### 2. Configuración de iOS

- [ ] `appInviteOneLinkID` configurado en `AppDelegate.swift`
- [ ] Associated Domains configurados en `App.entitlements`:
  - `applinks:jokersofneon.onelink.me`
  - `applinks:onelink.me`
- [ ] Universal Links funcionando

### 3. Configuración del Backend

- [ ] Tablas de Supabase creadas:
  - `referral_codes`
  - `referral_claims`
  - `referral_milestones`
  - `device_registrations`
- [ ] API endpoints funcionando:
  - `POST /api/referral/claim`
  - `POST /api/referral/create-code`
  - `GET /api/referral/stats/:user_address`
  - `POST /api/referral/milestone`
  - `POST /api/referral/check-rewards`

## Pasos de Testing

### Test 1: Generación de Link de Referido

**Objetivo**: Verificar que el referidor puede generar un link de referido.

**Pasos**:

1. Login con Usuario A (referidor)
2. Ir a la sección de referidos
3. Generar link de referido

**Verificación en consola iOS (Xcode)**:
```
[AppsFlyerBridge] Generating invite URL - code: username_a, address: 0x1234...
[AppsFlyerBridge] Invite URL generated: https://jokersofneon.onelink.me/...
```

**Verificación en logs JS**:
```javascript
[AppsFlyer] Generating native invite URL... { referralCode: "username_a", referrerAddress: "0x1234..." }
[AppsFlyer] Invite URL generated: https://...
```

**Código de prueba manual**:
```typescript
import { generateNativeInviteUrl, logReferralInvite } from './utils/appsflyer';

// Generar link
const url = await generateNativeInviteUrl("mi_username", "0xMI_ADDRESS");
console.log("Link generado:", url);

// Logear que se compartió
await logReferralInvite("mi_username", "0xMI_ADDRESS", "whatsapp");
```

### Test 2: Click en Link de Referido

**Objetivo**: Verificar que AppsFlyer registra el click correctamente.

**Pasos**:

1. En un dispositivo SIN la app instalada
2. Abrir el link de referido generado
3. Verificar que redirige al App Store

**Verificación en AppsFlyer Dashboard**:
- Ver que hay un nuevo "Click" registrado
- Verificar parámetros del click:
  - `deep_link_value`: "referral"
  - `deep_link_sub1`: username del referidor
  - `deep_link_sub2`: address del referidor

### Test 3: Instalación y Deferred Deep Link

**Objetivo**: Verificar que después de instalar, la app recibe los datos de atribución.

**Pasos**:

1. Después de hacer click en el link, instalar la app desde App Store
2. Abrir la app por primera vez
3. Esperar a que AppsFlyer envíe los datos de conversión

**Verificación en consola iOS (Xcode)**:
```
[AppsFlyer] Conversion data received
[AppsFlyer] Non-organic install - Source: user_invite, Campaign: referral
[AppsFlyer] Deep link found
[AppsFlyer] Deep link value: referral, isDeferred: true
[AppsFlyer] Referral code: username_a
[AppsFlyer] Referrer address: 0x1234...
[AppsFlyer] Deep link data sent to JavaScript
```

**Verificación en logs JS**:
```javascript
[AppsFlyer Referral] Deep link received: referral, username_a
[AppsFlyer Referral] Loaded stored referral data
```

### Test 4: Registro del Claim

**Objetivo**: Verificar que cuando el usuario referido se registra, el claim se procesa correctamente.

**Pasos**:

1. Usuario B crea una cuenta en la app
2. El sistema detecta los datos de referido pendientes
3. Se hace la llamada al backend para registrar el claim

**Verificación en logs JS**:
```javascript
[AppsFlyer Referral] Conversion data received: Non-organic
[useAppsFlyerReferral] Processing referral for user: 0xUSER_B_ADDRESS
[AppsFlyer Referral] Claim result: { success: true, referrer_address: "0x1234..." }
```

**Verificación en Backend logs**:
```
[Referral] Claim request - referee: 0xUSER_B, code: username_a
[Referral] Claim created - referrer: 0x1234..., referee: 0xUSER_B
```

**Verificación en Supabase**:
```sql
SELECT * FROM referral_claims
WHERE referee_address = '0xUSER_B_ADDRESS';
```

Debe mostrar:
- `referrer_address`: dirección del Usuario A
- `referral_code`: username del Usuario A
- `flagged_as_fraud`: false
- `reward_given`: false

### Test 5: Milestone y Rewards

**Objetivo**: Verificar que los milestones se registran y las rewards se distribuyen.

**Pasos**:

1. Usuario B completa el milestone "account_created"
2. Verificar que el milestone se registra
3. Llamar al endpoint de distribución de rewards

**Request al backend**:
```bash
# Registrar milestone
curl -X POST http://localhost:3001/api/referral/milestone \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "user_address": "0xUSER_B_ADDRESS",
    "milestone_type": "account_created"
  }'

# Verificar y distribuir rewards
curl -X POST http://localhost:3001/api/referral/check-rewards \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "referrer_address": "0xUSER_A_ADDRESS"
  }'
```

**Verificación en Supabase**:
```sql
SELECT * FROM referral_milestones
WHERE referee_address = '0xUSER_B_ADDRESS';
```

### Test 6: Anti-Fraude

**Objetivo**: Verificar que el sistema detecta intentos de fraude.

**Casos a probar**:

1. **Self-referral**: Usuario intenta usar su propio código
2. **Same device**: Dos usuarios en el mismo dispositivo

**Test Self-Referral**:
```bash
curl -X POST http://localhost:3001/api/referral/claim \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "referee_address": "0x1234",
    "referral_code": "my_username",
    "referrer_address": "0x1234"
  }'
```

Debe responder:
```json
{
  "success": false,
  "error": "Self-referral not allowed",
  "flagged_as_fraud": true
}
```

## Debugging Tools

### Ver logs en tiempo real (iOS)

```bash
# En Xcode: Product > Scheme > Edit Scheme > Run > Arguments
# Agregar environment variable: CFNETWORK_DIAGNOSTICS=3

# Filtrar logs de AppsFlyer en Console.app:
# process:JokersOfNeon AND message CONTAINS "AppsFlyer"
```

### Ver logs en React Native Debugger

```javascript
// Agregar temporalmente en App.tsx o main.tsx
import { getPendingReferralData, getPendingConversionData } from './utils/appsflyerReferral';

// En algún efecto o handler
console.log("Pending referral:", getPendingReferralData());
console.log("Pending conversion:", getPendingConversionData());
```

### Verificar localStorage

```javascript
// En DevTools Console
localStorage.getItem('appsflyer_referral_data');
localStorage.getItem('appsflyer_conversion_data');
localStorage.getItem('appsflyer_referral_processed');
```

### Query Supabase directamente

```sql
-- Ver todos los claims
SELECT
  rc.id,
  rc.referrer_address,
  rc.referee_address,
  rc.referral_code,
  rc.flagged_as_fraud,
  rc.reward_given,
  rc.created_at
FROM referral_claims rc
ORDER BY rc.created_at DESC
LIMIT 20;

-- Ver milestones pendientes de reward
SELECT
  rm.*,
  rc.referee_address,
  rc.referrer_address
FROM referral_milestones rm
JOIN referral_claims rc ON rm.referral_claim_id = rc.id
WHERE rm.reward_given = false;

-- Ver stats de un referidor
SELECT
  COUNT(*) as total_claims,
  COUNT(*) FILTER (WHERE flagged_as_fraud = false) as valid_claims,
  COUNT(*) FILTER (WHERE flagged_as_fraud = true) as fraud_claims
FROM referral_claims
WHERE referrer_address = '0xREFERRER_ADDRESS';
```

## Checklist Final de Testing

- [ ] **Generación de link**: Link se genera correctamente con todos los parámetros
- [ ] **Evento af_invite**: Se logea cuando el usuario comparte
- [ ] **Deferred Deep Link**: Datos llegan después de instalar
- [ ] **Claim se registra**: Backend guarda el claim correctamente
- [ ] **Anti-fraude funciona**: Self-referral y same-device son detectados
- [ ] **Milestone se registra**: Backend registra milestones del referido
- [ ] **Reward se distribuye**: Referidor recibe su reward

## Troubleshooting

### El link no se genera

1. Verificar que `appInviteOneLinkID` esté configurado en `AppDelegate.swift`
2. Verificar que el OneLink template existe en AppsFlyer dashboard
3. Revisar logs de Xcode para errores

### No llegan datos de deep link

1. Verificar Associated Domains en Xcode
2. Verificar que el dispositivo tiene iOS 14+
3. Verificar que el usuario no tiene "Limit Ad Tracking" habilitado
4. Esperar unos segundos después de abrir la app

### Claim falla con "Invalid referral code"

1. Verificar que el código de referido existe en `referral_codes`
2. Verificar que el username está en lowercase
3. Verificar que la API key es correcta

### Reward no se distribuye

1. Verificar que el milestone existe y `reward_given = false`
2. Verificar que hay un claim válido (no fraud)
3. Verificar que `queueTransaction` funciona correctamente

## Logs de Referencia

### Flujo exitoso completo

```
# iOS Console (Usuario A - Referidor)
[AppsFlyer] SDK configured - DevKey: GXf..., AppID: 6749..., OneLinkID: H5hv
[AppsFlyerBridge] Generating invite URL - code: player_one, address: 0xAAA...
[AppsFlyerBridge] Invite URL generated: https://jokersofneon.onelink.me/H5hv?...
[AppsFlyerBridge] Logging invite - channel: whatsapp, code: player_one

# iOS Console (Usuario B - Referido, después de instalar)
[AppsFlyer] SDK configured - DevKey: GXf..., AppID: 6749..., OneLinkID: H5hv
[AppsFlyer] Conversion data received
[AppsFlyer] Non-organic install - Source: user_invite, Campaign: referral
[AppsFlyer] Deep link found
[AppsFlyer] Deep link value: referral, isDeferred: true
[AppsFlyer] Referral code: player_one
[AppsFlyer] Referrer address: 0xAAA...
[AppsFlyerBridge] Sending deep link to JavaScript

# JavaScript Console (Usuario B)
[AppsFlyer Referral] Deep link received: referral, player_one
[AppsFlyer] CUID set: 0xBBB...
[AppsFlyer Referral] Claim result: { success: true, referrer_address: "0xAAA..." }
[AppsFlyer Referral] Milestone registered: account_created

# Backend Logs
[Referral] Claim request - referee: 0xBBB..., code: player_one
[Referral] Claim created - referrer: 0xAAA..., referee: 0xBBB...
[Referral] Milestone - user: 0xBBB..., type: account_created
[Referral] Milestone created - referrer: 0xAAA..., type: account_created
[Referral] Distributing rewards for: 0xAAA...
[Referral] Pack 1 queued for 0xAAA...
[Referral] Distributed 1 rewards to 0xAAA...
```
