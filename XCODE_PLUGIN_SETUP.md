# 📱 Guía: Registrar AppsFlyerPlugin en Xcode

Esta guía te explica paso a paso cómo verificar y registrar el plugin de AppsFlyer en Xcode.

## ✅ Paso 1: Abrir el proyecto en Xcode

1. Abre **Finder** y navega a:
   ```
   /Users/dub/Desktop/caravana/jokers-of-neon-app/ios/App
   ```

2. Busca el archivo **`App.xcworkspace`** (⚠️ IMPORTANTE: NO uses `App.xcodeproj`, usa el `.xcworkspace`)

3. Haz doble clic en **`App.xcworkspace`** para abrirlo en Xcode

   > 💡 **Nota**: Si Xcode no está instalado, puedes descargarlo desde el App Store o desde [developer.apple.com](https://developer.apple.com/xcode/)

---

## ✅ Paso 2: Verificar que el archivo existe

1. En Xcode, mira el panel izquierdo (llamado **Navigator** o **Project Navigator**)
   
2. Busca la carpeta **`App`** (debería estar expandida)

3. Dentro de la carpeta `App`, busca el archivo **`AppsFlyerPlugin.swift`**

   ```
   App/
   ├── AppDelegate.swift
   ├── AppsFlyerPlugin.swift  ← Este archivo debería estar aquí
   ├── Info.plist
   ├── Assets.xcassets
   └── ...
   ```

### Si el archivo NO aparece:

**Opción A: El archivo existe pero no está en Xcode**

1. En Finder, verifica que el archivo existe en:
   ```
   ios/App/App/AppsFlyerPlugin.swift
   ```

2. En Xcode, haz clic derecho en la carpeta **`App`** (en el panel izquierdo)

3. Selecciona **"Add Files to 'App'..."**

4. Navega hasta `ios/App/App/AppsFlyerPlugin.swift`

5. Asegúrate de que estén marcadas estas opciones:
   - ✅ **"Copy items if needed"** (desmarcado - NO copiar)
   - ✅ **"Add to targets: App"** (marcado - SÍ agregar al target)

6. Haz clic en **"Add"**

---

## ✅ Paso 3: Verificar que el archivo está en el Target

Este es el paso más importante. Necesitas asegurarte de que el archivo esté compilando con tu app.

### Método 1: Verificar en el File Inspector

1. Haz clic en el archivo **`AppsFlyerPlugin.swift`** en el panel izquierdo

2. Mira el panel derecho de Xcode (llamado **Inspector** o **File Inspector**)

3. Busca la sección **"Target Membership"**

4. Asegúrate de que **`App`** esté marcado (✅)

   ```
   Target Membership
   ☑ App
   ```

### Método 2: Verificar en Build Phases

1. Haz clic en el proyecto **`App`** (el icono azul en la parte superior del panel izquierdo)

2. Selecciona el target **`App`** (debería estar seleccionado por defecto)

3. Haz clic en la pestaña **"Build Phases"** (arriba en el centro)

4. Expande la sección **"Compile Sources"**

5. Busca **`AppsFlyerPlugin.swift`** en la lista

   ```
   Compile Sources
   ├── AppDelegate.swift
   ├── AppsFlyerPlugin.swift  ← Debería estar aquí
   └── ...
   ```

### Si NO está en "Compile Sources":

1. Haz clic en el botón **"+"** en la parte inferior de "Compile Sources"

2. Busca y selecciona **`AppsFlyerPlugin.swift`**

3. Haz clic en **"Add"**

---

## ✅ Paso 4: Verificar que no hay errores

1. En Xcode, presiona **⌘ + B** (Cmd + B) para compilar el proyecto

2. Mira la parte inferior de Xcode (el panel de **Issues**)

3. Si hay errores, deberían aparecer en rojo

### Errores comunes y soluciones:

**Error: "No such module 'AppsFlyerLib'"**
- **Solución**: Asegúrate de haber ejecutado `pod install` (ya lo hiciste ✅)
- Cierra y vuelve a abrir Xcode
- Limpia el build: **Product → Clean Build Folder** (⌘ + Shift + K)

**Error: "Cannot find type 'CAPPlugin'"**
- **Solución**: El archivo necesita importar Capacitor correctamente
- Verifica que el import esté: `import Capacitor`

**Error: "AppsFlyerPlugin.swift is not a member of target 'App'"**
- **Solución**: Sigue el Paso 3 para agregarlo al target

---

## ✅ Paso 5: Probar que funciona

1. Conecta un dispositivo iOS o selecciona un simulador

2. Presiona **⌘ + R** (Cmd + R) para ejecutar la app

3. Si compila y ejecuta sin errores, ¡está funcionando! ✅

---

## 🎯 Resumen Visual

```
Xcode Project Structure:
┌─────────────────────────────────────┐
│ App (Project)                       │
│ └── App (Target)                    │
│     └── Build Phases                │
│         └── Compile Sources         │
│             ├── AppDelegate.swift   │
│             └── AppsFlyerPlugin.swift ← Debe estar aquí
└─────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### El archivo no aparece en Xcode

**Solución rápida:**
1. Cierra Xcode
2. Abre Terminal
3. Ejecuta:
   ```bash
   cd /Users/dub/Desktop/caravana/jokers-of-neon-app/ios/App
   pod install
   ```
4. Abre Xcode de nuevo

### Xcode no reconoce el archivo

1. En Xcode: **File → Close Project**
2. Elimina estos archivos/folders (si existen):
   - `ios/App/DerivedData`
   - `ios/App/build`
3. Abre el proyecto de nuevo
4. **Product → Clean Build Folder** (⌘ + Shift + K)
5. Compila de nuevo (⌘ + B)

### El plugin no funciona en runtime

1. Verifica que el archivo esté en "Compile Sources" (Paso 3)
2. Verifica que no haya errores de compilación
3. Revisa la consola de Xcode cuando ejecutas la app
4. Busca mensajes que empiecen con `[AppsFlyer]`

---

## ✅ Checklist Final

Antes de continuar, verifica:

- [ ] El archivo `AppsFlyerPlugin.swift` aparece en el panel izquierdo de Xcode
- [ ] El archivo está marcado en "Target Membership" → App
- [ ] El archivo aparece en "Build Phases" → "Compile Sources"
- [ ] El proyecto compila sin errores (⌘ + B)
- [ ] La app se ejecuta sin crashes

Si todos los items están marcados, ¡el plugin está correctamente registrado! 🎉

---

## 📞 ¿Necesitas ayuda?

Si después de seguir estos pasos aún tienes problemas:

1. Toma una captura de pantalla del error
2. Verifica que el archivo existe en Finder
3. Revisa la consola de Xcode para mensajes de error específicos
