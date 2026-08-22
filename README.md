# CAL8bit

Calculadora retro estilo CRT/pixel construida con React Native y Expo SDK 57. Funciona en Android (Expo Go o APK) y navegador web.

## Caracteristicas

- Modo basico y cientifico (sin, cos, tan, ln, log, raiz, potencias, factorial, constantes pi/e)
- Boton de borrado progresivo (un caracter a la vez)
- Panel de memoria con historial de operaciones guardadas automaticamente
- 5 temas visuales: retro, amber, cyber, blood, mono
- Efectos configurables: scanlines, brillo del display, forma de botones
- Pantalla ajustable (chica / media / grande)
- Interfaz bilingue: espanol e ingles
- Layout responsive (telefono y tablet)

## Tecnologias

| Herramienta | Version |
|---|---|
| Expo | ~57 |
| React Native | 0.86 |
| React | 19.2 |
| react-native-safe-area-context | ~5.7 |

## Instalacion

```bash
git clone https://github.com/kipzitox/cal8bit.git
cd cal8bit
npm install
npx expo start
```

Escanear el QR con la app **Expo Go** (Android) o presionar `w` para abrirlo en el navegador.

## Compilar APK

### Opcion 1 - Local (requiere JDK 17+ y Android SDK)

```bash
npx expo prebuild --clean --platform android
cd android
.\gradlew assembleRelease
```

El APK queda en `android/app/build/outputs/apk/release/app-release.apk`

### Opcion 2 - Nube con EAS Build

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

## Estructura del proyecto

```
cal8bit/
├── App.js              # Toda la aplicacion (logica + UI)
├── app.json            # Configuracion de Expo
├── eas.json            # Perfiles de compilacion EAS
├── babel.config.js     # Configuracion de Babel
└── assets/             # Iconos y splash screen
```

## Licencia

MIT
