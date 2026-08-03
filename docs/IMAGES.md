# Imágenes de productores

Manual del flujo de imágenes: formato, fuentes, calidad, naming, tooling y
auditoría de basura. El contrato del campo `imagen` (ruta, extensiones,
validación) vive en `docs/CSV_CONTRACT.md` § Producer image contract; la
validación se cierra con `npx pnpm check:images`.

Revisa las imágenes después de estabilizar identidad y `slug`. Prefiere logo o
imagotipo oficial antes que foto de producto. No aceptes banners, iconos, ayudas
públicas, imágenes ajenas ni el primer resultado por puntuación.

## Formato y composición

- Activo final preferido: **1600x1200 WebP** (4:3 horizontal), calidad `>= 88`,
  en `/productores/<pais>/<comunidad>/<provincia>/<slug>.webp`.
- Fondo plano `#F3F0E8`; logo centrado con alrededor de 10% de margen por lado.
  El lado más largo del logo debería quedar en torno a 960 px o menos.
- Mantén visible el fondo alrededor del logo. No estires el logo para rellenar
  el lienzo.
- Otros formatos válidos por contrato (`.png`, `.jpg`, `.avif`, etc.) siguen
  siendo aceptables, pero usa `.webp` para activos nuevos.

## Fuente visual

Prioridad de búsqueda, deteniéndote en el primer activo usable:

1. `Organization.logo` del JSON-LD de la web oficial: es el sitio diciendo cuál
   es su marca, en vez de adivinarlo por el nombre del fichero.
2. Logo PNG/JPG en la web oficial.
3. `og:image` de la web oficial si muestra marca.
4. Foto de perfil de Instagram/Facebook oficial.
5. Favicon de alta resolución.
6. Fuentes reputadas (DOP/IGP, turismo, prensa) solo si los canales propios no ofrecen nada usable.

Prefiere marca sobre foto de producto. Usa foto propia del productor solo si no
hay logo usable o si esa foto es parte reconocible de la identidad. No uses
stock, IA, competidores ni imágenes de portales genéricos.

**La marca de la matriz no vale como imagen del productor.** En webs de grupo, el
activo mejor puntuado suele ser el logo del grupo, no el del productor
(HispanoBodegas por Gormaz, Costa Food por Cárnicas Villar, Vichy Catalan por
Monte Pinos, Viñas Familia Gil por Atalaya). Si el productor no publica identidad
propia, **deja la celda vacía**: una celda vacía es recuperable, una imagen
equivocada no se distingue de una correcta sin volver a mirarla.

## Calidad y tratamiento

- No escales más de **3x** el lado largo original; por encima de eso el resultado
  se ve borroso.
- Tras escalar más de `1.2x`, aplica enfoque suave.
- **Suelo de 200 px** en el lado largo: la marca correcta renderizada ilegible
  estropea el mapa igual que la basura y encima parece correcta en el CSV. El
  script intenta antes recuperar el original (WordPress/Shopify lo codifican en
  el nombre, Wix en la ruta).
- El cromado de fondo y el oscurecido de tinta casi blanca son **topológicos**:
  respetan el hueco interior de una letra o un icono. A una fotografía no se le
  aplica ninguno de los dos.

## Naming y tooling

- El nombre del archivo debe coincidir con el `slug` del CSV y el path debe
  reflejar la provincia: `/productores/<pais>/<comunidad>/<provincia>/<slug>.webp`. Un
  activo por productor; no guardes variantes ni originales de trabajo en
  `public/`. Si el destino canónico no coincide con el CSV stem, pasa
  `--asset-provincia <comunidad>/<provincia>`.
- Instala las herramientas opcionales solo cuando vayas a usar enriquecimiento:
  ```bash
  python3 -m pip install -r scripts/requirements-image-tools.txt
  ```

El flujo son tres pasos y **el del medio no es opcional**:

```bash
npx pnpm enrich:images --provincia [provincia] --contact-sheet informe/[provincia]
# mira las hojas; decide productor a productor
npx pnpm enrich:images --provincia [provincia] --apply --slug [slug]
```

`--contact-sheet` compone cada candidato **exactamente como lo guardaría
`--apply`** y los monta en hojas de 15. Lo que apruebas es lo que se escribe. El
score ordena, no juzga: un logo de matriz, un banner de subvención, un sello de
turismo y el logo de la agencia que hizo la web puntúan todos perfectamente.

- El script no escribe nada por defecto y aplica solo por `--slug`. Usa
  `--allow-photos` cuando la foto propia sea el fallback buscado.
- Comprueba con `git diff` que `--apply` solo tocó la columna `imagen`.
- Si al terminar avisa de que una misma imagen sirve a varios productores,
  míralos: el logo compartido de un grupo es legítimo, un sello o un plugin no.
- Cierra cambios de imagen con `npx pnpm check:images`.

## Basura conocida y auditoría por hash

El scorer puntúa alto activos que no son la marca. Firmas confirmadas (auditorías 2026-06/07):
logos de plugins y consentimiento (CookieYes, GDPR, iconos de accesibilidad), temas y paneles web
(WordPress, BRIDGE, Divi, Plesk, "FUSE"), hosting (IONOS), directorios (QDQ), banners de subvención
(Kit Digital, Plan de Recuperación, FEADER/UE, Gobierno/Generalitat), marcas de directorio provincial
(Alimentos de Guadalajara, Sabores Almería, Gusto Cádiz), sellos ajenos (Guild of Fine Food, DOP/premios),
iconos de red social sueltos, burbujas de chat y tarjetas en blanco. Añadidas en 2026-07 (Albacete):
el logo de la agencia que hizo la web («Powered by …»), sellos institucionales y de promoción
(banderas autonómicas, turismo, rutas del vino) y capturas de la web entera.

**Es un atajo, nunca la razón para no mirar el resultado**: la lista es
retrospectiva por construcción y siempre irá una provincia por detrás.

Auditoría retroactiva barata sin red: agrupa `public/productores/**/*.webp` por hash (`md5 -r`).
**El mismo hash en marcas sin relación = basura** (vacía la celda `imagen` y borra el asset);
el mismo hash dentro de un grupo empresarial o multi-local (Torres, Protos, Baluard…) es legítimo.
La pasada 2026-07-17 (commit `6d8c1fa`) purgó así 130 imágenes en 19 provincias: los 27 clusters
cross-marca inspeccionados resultaron ser todos basura. El hash no caza basura que aparece una sola
vez: para eso sigue haciendo falta barrido visual por provincia (montajes con fondo gris/contraste).
