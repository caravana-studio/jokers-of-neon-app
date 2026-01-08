# 🔗 Configuración de Referral Links - jokersofneon.com?ref=username

## 📋 Resumen

El sistema ahora usa el **username** como referral code, generando links del formato:
```
https://jokersofneon.com?ref=dubzn
```

## 🔄 Flujo Completo

### 1. Generar Referral Code

El código de referido ahora es el username del usuario:

```typescript
import { createReferralCode } from "./api/referral";
import { fetchProfile } from "./api/profile";

// Opción 1: Pasar username explícitamente
const referralCode = await createReferralCode(userAddress, "dubzn");

// Opción 2: Obtener username del perfil automáticamente
const profile = await fetchProfile(userAddress);
const referralCode = await createReferralCode(userAddress, profile.username);
```

### 2. Generar Link de Referido

```typescript
import { generateReferralLink } from "./api/referral";

const link = generateReferralLink(referralCode);
// Resultado: "https://jokersofneon.com?ref=dubzn"
```

### 3. Configurar Redirección en el Servidor

El dominio `jokersofneon.com` necesita redirigir a AppsFlyer OneLink. Hay dos opciones:

#### Opción A: Redirección Simple (Recomendada)

Configurar en tu servidor/web (Vercel, Netlify, etc.) una redirección:

**Vercel (`vercel.json`)**:
```json
{
  "redirects": [
    {
      "source": "/",
      "has": [
        {
          "type": "query",
          "key": "ref"
        }
      ],
      "destination": "https://app.appsflyer.com/YOUR_ONELINK_ID?deep_link_value=referral&deep_link_sub1=:ref&deep_link_sub2=:referrer_address&campaign=referral&media_source=user_invite",
      "permanent": false
    }
  ]
}
```

**Nginx**:
```nginx
location / {
    if ($arg_ref) {
        return 302 https://app.appsflyer.com/YOUR_ONELINK_ID?deep_link_value=referral&deep_link_sub1=$arg_ref&deep_link_sub2=$arg_referrer&campaign=referral&media_source=user_invite;
    }
    # ... resto de tu configuración
}
```

#### Opción B: Página de Redirección (Más Control)

Crear una página en `jokersofneon.com` que:
1. Lee el parámetro `?ref=username`
2. Obtiene la dirección del referidor desde la base de datos
3. Genera el OneLink de AppsFlyer con todos los parámetros
4. Redirige al OneLink

**Ejemplo (`public/redirect/index.html`)**:
```html
<!DOCTYPE html>
<html>
<head>
  <script>
    // Obtener parámetro ref
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    
    if (ref) {
      // Llamar a API para obtener referrer_address
      fetch(`https://api.jokersofneon.com/api/referral/get-referrer?referral_code=${ref}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.referrer_address) {
            // Generar OneLink
            const oneLinkId = 'YOUR_ONELINK_ID';
            const oneLink = `https://app.appsflyer.com/${oneLinkId}?deep_link_value=referral&deep_link_sub1=${ref}&deep_link_sub2=${data.referrer_address}&campaign=referral&media_source=user_invite`;
            window.location.href = oneLink;
          } else {
            // Redirigir a home si no se encuentra
            window.location.href = 'https://jokersofneon.com';
          }
        });
    } else {
      window.location.href = 'https://jokersofneon.com';
    }
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>
```

### 4. AppsFlyer OneLink Configuration

En el dashboard de AppsFlyer:

1. **Crear OneLink Template**:
   - Nombre: "Referral Link"
   - deep_link_value: `referral`
   - deep_link_sub1: `{referral_code}` (username)
   - deep_link_sub2: `{referrer_address}` (Starknet address)

2. **Configurar Redirecciones**:
   - iOS: `https://apps.apple.com/app/id6749147020`
   - Android: Play Store URL

3. **Universal Links (iOS)**:
   - Configurar Associated Domain: `applinks:jokersofneon.com`
   - Agregar `apple-app-site-association` en tu servidor

### 5. Universal Links Setup

Para que `jokersofneon.com?ref=username` abra directamente la app (si está instalada):

**Archivo: `public/.well-known/apple-app-site-association`**:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.id6749147020",
        "paths": ["*"]
      }
    ]
  }
}
```

**Archivo: `public/.well-known/assetlinks.json`** (Android):
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.jokersofneon.play",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

## 🔧 Cambios en el Código

### Backend

- ✅ `createReferralCode` ahora acepta `username` como parámetro
- ✅ Si no se proporciona, obtiene el username del perfil
- ✅ Usa el username directamente como referral code (lowercase)
- ✅ Valida que el username sea único

### Frontend

- ✅ `createReferralCode` acepta username opcional
- ✅ `generateReferralLink` crea links del formato `jokersofneon.com?ref=username`
- ✅ `generateAppsFlyerOneLink` genera el OneLink completo

## 📱 Cómo Funciona

1. **Usuario comparte link**: `https://jokersofneon.com?ref=dubzn`
2. **Click en el link**:
   - Si tiene la app: Universal Link abre la app directamente
   - Si no tiene la app: Redirige a OneLink → App Store
3. **AppsFlyer procesa**:
   - OneLink redirige al App Store
   - Después de instalar, AppsFlyer detecta la atribución
   - Deep link se resuelve con `deep_link_sub1=dubzn`
4. **App procesa**:
   - `AppDelegate.swift` extrae `referral_code` (dubzn)
   - Frontend llama a `/api/referral/claim` con el código
   - Backend busca el username en `referral_codes` y obtiene `referrer_address`

## 🗄️ Base de Datos

La tabla `referral_codes` ahora almacena:
- `referral_code`: El username (ej: "dubzn")
- `user_address`: La dirección del referidor

## ⚠️ Consideraciones

1. **Usernames únicos**: Si dos usuarios tienen el mismo username, solo el primero puede usarlo como referral code
2. **Case insensitive**: Los usernames se convierten a lowercase para consistencia
3. **Validación**: El username debe cumplir con el formato: `/^[a-zA-Z0-9._-]+$/` (3-15 caracteres)

## 🧪 Testing

1. **Generar código**:
   ```typescript
   const code = await createReferralCode(address, "dubzn");
   // code = "dubzn"
   ```

2. **Generar link**:
   ```typescript
   const link = generateReferralLink("dubzn");
   // link = "https://jokersofneon.com?ref=dubzn"
   ```

3. **Probar redirección**:
   - Abrir `https://jokersofneon.com?ref=dubzn` en navegador
   - Verificar que redirige a AppsFlyer OneLink
   - Verificar que OneLink redirige al App Store

4. **Probar deep link**:
   - Con la app instalada, abrir el link
   - Verificar que la app se abre
   - Verificar logs de AppsFlyer en Xcode
