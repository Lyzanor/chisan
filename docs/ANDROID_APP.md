# Aplicación Android (WebView)

El proyecto está configurado para empaquetar la web como una aplicación de Android mediante [Ionic Capacitor](https://capacitorjs.com/).
En lugar de compilar la aplicación para que funcione offline, la aplicación de Android actúa como un "WebView" nativo sin bordes que carga automáticamente la URL pública (`https://km0-nu.vercel.app/`).

Esto significa que:
1. Cualquier actualización que subas a la web en Vercel se reflejará instantáneamente en la aplicación de Android.
2. No necesitas modificar el código de Next.js ni la arquitectura.

## Estructura
- `capacitor.config.ts`: Define la URL de destino (`server.url`) y el nombre de la app.
- Carpeta `android/`: Proyecto nativo de Android Studio autogenerado.

## ¿Cómo abrir y compilar en Android Studio?

1. Abre **Android Studio**.
2. Selecciona **"Open an existing Android Studio project"** (Abrir proyecto existente).
3. Navega hasta la carpeta del proyecto actual y selecciona la subcarpeta `android/`.
4. Espera a que Android Studio descargue Gradle y sincronice el proyecto.
5. Puedes darle al botón verde de "Play" (Run 'app') en la barra superior para ejecutar la app en tu móvil conectado por USB o en el emulador.

### Generar APK / AAB para Google Play
1. En Android Studio, ve al menú superior y selecciona **Build > Generate Signed Bundle / APK...**
2. Si quieres subirla a Google Play, elige **Android App Bundle**. Si solo quieres enviarla para que alguien la pruebe, elige **APK**.
3. Sigue el asistente para crear una llave nueva (Keystore) y genera la aplicación.

## Cambiar detalles de la App (Icono, Nombre)
Si deseas cambiar el ícono y la pantalla de carga fácilmente:
1. Genera un ícono cuadrado de 1024x1024 píxeles (por ejemplo, `icon.png`).
2. Instala la herramienta `@capacitor/assets`:
   ```bash
   npx pnpm i -D @capacitor/assets
   npx capacitor-assets generate --android
   ```
Esto reemplazará automáticamente los recursos antiguos en la carpeta `android`.
