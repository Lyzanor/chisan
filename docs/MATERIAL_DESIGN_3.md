# Material Design 3 (M3) en el proyecto

El proyecto utiliza los **design tokens** de [Material Design 3](https://m3.material.io/) para colores, formas, elevación y movimiento, sin añadir la librería de componentes (sin MUI ni Material Web). La referencia de theming en web es [Material Web – Theming](https://material-web.dev/theming/color/).

## Tokens usados

- **Color**: `--md-sys-color-primary`, `--md-sys-color-on-primary`, `--md-sys-color-surface`, `--md-sys-color-on-surface`, `--md-sys-color-on-surface-variant`, `--md-sys-color-outline`, `--md-sys-color-primary-container`, etc.
- **Shape**: `--md-sys-shape-corner-*` (extra-small 4px → extra-large 28px, full 9999px).
- **Elevation**: `--md-sys-elevation-level1`, `level2`, `level3`.
- **Motion**: `--md-sys-motion-duration-short1`, `medium1`, etc.
- **State layers**: `--md-sys-color-surface-hover`, `surface-focus`, `surface-pressed`.

El verde KM0 (`#2f7a4f`) está definido como `--md-sys-color-primary`. El resto de superficies y contenedores siguen la paleta M3 (surface, surface-container-*).

## Tipografía

- **Títulos**: Fraunces (variable `--font-fraunces`).
- **Cuerpo**: Roboto 400/500/700 (variable `--font-roboto`), tipografía estándar de M3.

## Componentes alineados con M3

- Top app bar (móvil): superficie, elevación 1, touch target 48px.
- Navigation drawer: superficie, ítems con state layers (hover/pressed), ítem activo con `primary-container`.
- Botones: filled (primary), sin borde, transiciones cortas.
- Chips: filtros con estado activo en `primary-container`.
- Cards de productor: `surface-container-lowest`, bordes con `outline-variant`, esquinas `shape-corner-large`.

## Cambiar el tema

Para ajustar solo el color primario, modifica en `app/globals.css`:

```css
:root {
  --md-sys-color-primary: #2f7a4f;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #b4f0ce;
  --md-sys-color-on-primary-container: #00210f;
  /* ... */
}
```

El resto de tokens (surface, outline, etc.) puede mantenerse o afinarse según la [guía de color M3](https://m3.material.io/styles/color/the-color-system/overview).
