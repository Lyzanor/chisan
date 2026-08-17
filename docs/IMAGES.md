# Imágenes de productores

Este documento define el flujo visual: elección de fuente, composición,
aplicación y revisión. El contrato del campo `imagen` vive en
`docs/CSV_CONTRACT.md`; `npx pnpm check:images` valida los activos publicados.

Una imagen es opcional. Revisa primero la identidad y el `slug`: dejar la celda
vacía es preferible a publicar una marca equivocada.

## Qué imagen usar

Prefiere una identidad visual atribuible al productor:

1. `Organization.logo` del JSON-LD de su web oficial.
2. Logo o imagotipo publicado en esa web.
3. `og:image` oficial cuando muestre claramente la marca.
4. Foto de perfil de un canal social oficial.
5. Favicon de resolución suficiente.
6. Fuente institucional o reputada solo cuando no exista un canal propio usable.

Logo o imagotipo tiene prioridad sobre una foto de producto. Una foto propia
puede ser el fallback cuando representa inequívocamente al productor. No uses
stock, IA, competidores, directorios genéricos, ayudas públicas, premios ni el
primer resultado del ranking sin mirarlo.

La marca de una matriz, grupo o denominación no sustituye automáticamente la
del productor. Puede ser correcta únicamente cuando esa es también su identidad
pública atribuible. Si la unidad no publica identidad visual propia, deja
`imagen` vacía.

`enrich:images` solo inspecciona la URL de `web` ya publicada en el CSV. No
descubre fuentes fuera de esa web ni verifica propiedad, licencias o identidad;
el ranking ordena candidatos y la revisión humana decide.

## Formato final

- Nuevo activo: WebP de **1600×1200** (4:3), calidad 90.
- Ruta canónica:
  `/productores/<country>/<region>/<area>/<slug>.webp`.
- Fondo para logos: `#F3F0E8`, composición centrada y con aire visible.
- Lado largo del logo: alrededor de 960 px.
- No escales logos ni fotos por encima de 3× el original.
- Rechaza fuentes con menos de 200 px en el lado largo.
- No guardes originales, hojas de contacto ni variantes dentro de `public/`.
- Un activo nuevo por productor; otros formatos históricos siguen siendo
  válidos, pero los archivos de más de 2 MiB requieren revisión y normalización.

El cromado de fondos claros y el oscurecido de tinta casi blanca son
topológicos: eliminan solo el fondo conectado al borde y conservan huecos
interiores. Nunca se aplican a una imagen clasificada como foto.

## Flujo seguro de enriquecimiento

Instala las dependencias opcionales solo cuando vayas a buscar o componer
imágenes:

```bash
python3 -m pip install -r scripts/requirements-image-tools.txt
```

### 1. Generar candidatos

```bash
npx pnpm enrich:images --area [area] --contact-sheet .tmp/images/[area]
```

Se puede añadir `--slug [slug]` para revisar uno solo y `--allow-photos` cuando
se estén considerando fotos. El directorio de salida debe estar vacío para no
mezclar hojas de ejecuciones distintas.

El comando no modifica el catálogo. Genera:

- hojas con la composición final de cada candidato;
- `candidates.json`, con URL, score, dimensiones y SHA-256 completo de la
  composición mostrada.

### 2. Elegir visualmente

Comprueba que la imagen pertenece al productor, no a su matriz, agencia web,
plugin, sello, directorio o programa de financiación. El identificador corto de
la hoja corresponde al inicio del `digest` completo de `candidates.json`.

### 3. Aplicar exactamente lo aprobado

```bash
npx pnpm enrich:images --area [area] --apply \
  --slug [slug] --candidate [sha256]
```

Usa `--replace` únicamente para sustituir una imagen ya publicada y repite
`--allow-photos` si el candidato aprobado era una foto. Si la exploración usó un
`--threshold` o `--max-candidates` distinto, repítelo al aplicar.

`--apply` exige un solo `slug` y un digest revisado. Vuelve a descargar los
candidatos, acepta solo el contenido cuyo hash coincide, deriva la ruta canónica
y cambia únicamente la celda `imagen`. Si el CSV cambia durante la operación,
aborta sin escribir. No existe aplicación masiva ni selección automática del
primer candidato.

Después revisa el diff y ejecuta:

```bash
npx pnpm check:images
```

## Auditoría del catálogo

`check:images` bloquea rutas inseguras, extensiones no admitidas, referencias
ausentes y contenido que no parece una imagen reconocible. Mantiene como avisos
las migraciones no destructivas: ruta o nombre no canónico, WebP con otras
dimensiones, extensión que no coincide con el contenido, activo huérfano o más
de 2 MiB.

El resumen muestra cobertura, peso, formatos históricos y clusters de hashes
duplicados. Para listar estos últimos:

```bash
npx pnpm check:images -- --duplicates
```

Un mismo hash puede ser legítimo dentro de un grupo o productor multilocal. En
marcas sin relación suele revelar un logo de plugin, mercado, directorio,
premio, institución o financiación. El hash es una señal de revisión, nunca una
decisión automática, y no detecta la basura que aparece una sola vez.

## Basura visual frecuente

- consentimiento, accesibilidad, chat, pagos, loaders y placeholders;
- logos del tema, CMS, hosting o agencia que construyó la web;
- ayudas, administraciones, turismo, rutas, certificaciones y premios;
- marcas de directorios o mercados que alojan a varios productores;
- capturas completas, banners, iconos sociales y tarjetas vacías;
- identidad de la matriz cuando no es la identidad pública del productor.

La lista es orientativa y nunca reemplaza el barrido visual. Nuevos patrones
locales deben influir en la revisión del área; no se convierten automáticamente
en reglas globales para otros países.
