# Imágenes de productores

Manual del flujo de imágenes: formato, fuentes, calidad, naming, tooling y
auditoría de basura. El contrato del campo `imagen` (ruta, extensiones,
validación) vive en `docs/CSV_CONTRACT.md` § Producer image contract; la
validación se cierra con `npx pnpm check:images`.

Revisa las imágenes después de estabilizar identidad y `slug`. Prefiere logo o
imagotipo oficial antes que foto de producto.

`npx pnpm enrich:images --provincia [provincia]` sirve para explorar. Usa
`--apply --slug [slug]` solo tras inspeccionar el candidato. No aceptes
banners, iconos, ayudas públicas, imágenes ajenas ni el primer resultado por
puntuación.

## Formato y composición

- Activo final preferido: **1600x1200 WebP** (4:3 horizontal), calidad `>= 88`,
  en `/productores/<comunidad>/<provincia>/<slug>.webp`.
- Fondo plano `#F3F0E8`; logo centrado con alrededor de 10% de margen por lado.
  El lado más largo del logo debería quedar en torno a 960 px o menos.
- Mantén visible el fondo alrededor del logo. No estires el logo para rellenar
  el lienzo.
- Otros formatos válidos por contrato (`.png`, `.jpg`, `.avif`, etc.) siguen
  siendo aceptables, pero usa `.webp` para activos nuevos.

## Fuente visual

Prioridad de búsqueda, deteniéndote en el primer activo usable:

1. Logo PNG/JPG en la web oficial.
2. `og:image` de la web oficial si muestra marca.
3. Foto de perfil de Instagram/Facebook oficial.
4. Favicon de alta resolución.
5. Fuentes reputadas (DOP/IGP, turismo, prensa) solo si los canales propios no ofrecen nada usable.

Prefiere marca sobre foto de producto. Usa foto propia del productor solo si no
hay logo usable o si esa foto es parte reconocible de la identidad. No uses
stock, IA, competidores ni imágenes de portales genéricos.

## Calidad y tratamiento

- No escales más de **3x** el lado largo original; por encima de eso el resultado
  se ve borroso.
- Tras escalar más de `1.2x`, aplica enfoque suave.
- En logos JPG sin alfa, puedes convertir blancos casi puros (`R,G,B >= 240`) a
  transparente antes de componer. No apliques este cromado a fotografías.
- Si la única fuente tiene menos de unos 200 px en el lado largo, deja el logo
  pequeño pero nítido o usa una foto propia representativa; anótalo en el cambio.

## Naming y tooling

- El nombre del archivo debe coincidir con el `slug` del CSV y el path debe
  reflejar la provincia: `/productores/<comunidad>/<provincia>/<slug>.webp`.
- Un activo por productor. No guardes variantes ni originales de trabajo en
  `public/`.
- Usa el script compartido en dry-run:
  ```bash
  npx pnpm enrich:images --provincia [provincia]
  ```
- Si el destino canónico no coincide con el CSV stem, pasa
  `--asset-provincia <comunidad>/<provincia>`.
- Instala las herramientas opcionales solo cuando vayas a usar enriquecimiento:
  ```bash
  python3 -m pip install -r scripts/requirements-image-tools.txt
  ```
- El script no escribe nada por defecto. Revisa candidato, score, dimensiones y
  URL; aplica solo por `--slug`. Usa `--allow-photos` únicamente cuando una foto
  propia sea el fallback buscado.
- `--apply` reescribe el CSV con `csv.writer` (CRLF): reconvierte a LF después
  (`perl -i -pe 's/\r\n/\n/g'`) y comprueba con `git diff` que solo cambió `imagen`.
- Tras aplicar, QA visual **desde los `.webp` guardados** (no desde las URLs de origen):
  el apply puede guardar un candidato distinto al primero aceptable.
- Cierra cambios de imagen con `npx pnpm check:images`.

## Basura conocida y auditoría por hash

El scorer puntúa alto activos que no son la marca. Firmas confirmadas (auditorías 2026-06/07):
logos de plugins y consentimiento (CookieYes, GDPR, iconos de accesibilidad), temas y paneles web
(WordPress, BRIDGE, Divi, Plesk, "FUSE"), hosting (IONOS), directorios (QDQ), banners de subvención
(Kit Digital, Plan de Recuperación, FEADER/UE, Gobierno/Generalitat), marcas de directorio provincial
(Alimentos de Guadalajara, Sabores Almería, Gusto Cádiz), sellos ajenos (Guild of Fine Food, DOP/premios),
iconos de red social sueltos, burbujas de chat y tarjetas en blanco.

Auditoría retroactiva barata sin red: agrupa `public/productores/**/*.webp` por hash (`md5 -r`).
**El mismo hash en marcas sin relación = basura** (vacía la celda `imagen` y borra el asset);
el mismo hash dentro de un grupo empresarial o multi-local (Torres, Protos, Baluard…) es legítimo.
La pasada 2026-07-17 (commit `6d8c1fa`) purgó así 130 imágenes en 19 provincias: los 27 clusters
cross-marca inspeccionados resultaron ser todos basura. El hash no caza basura que aparece una sola
vez: para eso sigue haciendo falta barrido visual por provincia (montajes con fondo gris/contraste).
