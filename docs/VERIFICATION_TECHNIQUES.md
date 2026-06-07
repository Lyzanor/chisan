# Técnicas de verificación y enriquecimiento (CSVs de provincia)

Notas transversales destiladas de varias pasadas por provincias. Amplían el *Discovery protocol* de
`AGENTS.md`. **Principio: peso a la verificación real y a la solidez del CSV** — no te fíes de lo que ya
pone la fila; muchos campos vienen auto-rellenados y mal. Ejemplo trabajado: `docs/barcelona-verificacion.md`.

## Los enlaces autogenerados NO son fiables — verifica, no confíes

- La columna `Google Maps` lleva un `query_place_id` que con frecuencia apunta a **otro negocio**
  (visto: "POMA ARQUITECTURA" para un productor de aceite; un audiólogo / pediatra / una carretera en
  filas de Madrid — ~25 de 211). Igual con `web`/`Instagram`/`Facebook` auto-rellenados (vistos apuntando
  a una gestoría, la Diputació, una joyería, la página *privacy* de Facebook, un dominio de apuestas).
- Antes de dar por bueno un enlace, confirma que es de **ese** productor y municipio. Si apunta a una
  entidad ajena, **blanquéalo** (no dejes desinformación). Pero: un *fetch* que falla por SSL/http/timeout
  ≠ sitio muerto — confirma por búsqueda antes de borrar; solo blanquea si la web **carga** y muestra otro
  negocio (o dominio caducado/parked).

## Deduplicar sin que los acentos rompan el match

- `grep -i` **no pliega acentos** (`garcia` ≠ `García`) → se pierden duplicados ya presentes. Normaliza
  (NFD + quitar marcas) antes de comparar.
- Deduplica por **dominio web normalizado** (sin `https`/`www`) **+ teléfono en dígitos** (sin `+34`), no
  por nombre. Un grupo puede esconder dos marcas; dos productores pueden compartir teléfono/finca sin ser
  el mismo.

## Registros catalanes

### DAR — venda de proximitat (productores de venta directa)
- Dataset Socrata legible por máquina `xmyy-7xqi`:
  `curl "https://analisi.transparenciacatalunya.cat/resource/xmyy-7xqi.csv?$limit=5000"`.
  Columnas: `nom_productor` (`COGNOM1 COGNOM2, NOM`), `num_acreditacio`, `nif`, `adreca`, `municipi`,
  `comarca`, `productes`, `tel_fon`, `correu`, `marca_comercial`, etc.
- Úsalo para confirmar que una fila de registro es un productor real. Exige **match de entidad exacto**
  (apellidos **y** `municipi`), no solo apellido. Match → como mucho `parcial` (registro ≠ venta online
  viva); aprovecha para corregir `tel`/`correu`/`productes`/`marca`. **Caveat:** solo se publican quienes
  consintieron, así que "no constar" no prueba inexistencia.

### REGA — explotacions ramaderes (NO son productores vendibles)
- Algunas provincias se rellenaron con explotaciones ganaderas del REGA. Señal: la descripció contiene
  *"inscrita en el Registre d'explotacions ramaderes"*; suelen ser `Lácteos y quesos`, `pendiente`, **sin
  contacto**, pero **con coordenadas → salen en el mapa como si vendieran**.
- Constar en REGA prueba que la granja existe, no que venda al público (triaje en Girona: 0/12 con venta
  directa verificable; la mayoría entregan a cooperativas). Trátalas como **candidatas a poda**; conserva
  solo las que demuestren obrador + venta directa. Al rescatar una, confirma que su web/red es del mismo
  negocio y municipio (trampa de homónimos).

## Rellenar `lat`/`lon` faltantes (Nominatim)

- Geocodifica `direccion + municipio + ", España"` con Nominatim (rate-limit ~1,1 s, `countrycodes=es`,
  User-Agent propio). **Valida** cada pin contra el centroide del municipio en
  `data/reference/municipios.json` (haversine): ≤15 km → usa el geocode; >15 km o falla → **fallback al
  centroide** (ubicación honesta a nivel localidad); ni uno ni otro → déjalo en blanco.
- No hay `GOOGLE_MAPS_API_KEY` en el proyecto: `place_id`/coords no se autogeneran (por eso los place_id
  heredados son poco fiables, ver arriba).

## Disciplina al editar CSV grandes

- Los CSV pueden ser **CRLF**: edítalos preservando el fin de línea de cada fila (Python con `newline=""`),
  modifica solo las líneas de tu lote y deja el resto byte-idéntico (un `read()/write()` en modo texto
  reescribe todo el fichero). Valida con `git diff --numstat` que el nº de líneas tocadas es el esperado.
- Script efímero en `/tmp`, **no commitear** (AGENTS prohíbe generadores como fuente de verdad).
