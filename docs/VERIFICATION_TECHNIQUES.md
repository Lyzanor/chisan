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

## Pasada de consistencia antes de cerrar una provincia

Esta pasada es distinta de verificar fuentes fila a fila. Busca contradicciones internas y errores
transversales que sobreviven aunque cada productor se haya revisado por separado.

1. **Estructura física y contrato**
   - Confirma cabecera canónica de 20 columnas, `slug` único, LF, UTF-8/NFC, ausencia de espacios
     exteriores y valores cerrados válidos.
   - Itera con `npx pnpm check:csv:changed`; el cierre de una provincia de datos es
     `npx pnpm verify:data`.
2. **Concilia los recuentos**
   - Recalcula filas, estados de `verificacion`, valores de `Venta online`, canales e imágenes.
   - Compara esos totales con el ledger provincial. Un recuento antiguo suele delatar una baja,
     duplicado o cambio de estado no documentado.
3. **Cruza campos dependientes**
   - `Venta online=sí` exige `Canal de venta`; cualquier otro estado exige canal vacío.
   - `ecommerce` necesita `web`; `email`, `correo`; `telefono`/`whatsapp`, `telefono`.
   - Un `horario` como `Consultar web`, `Consultar Instagram` o `Consultar teléfono` solo es válido
     si el campo referido existe. Si no hay fuente pública, deja el horario vacío.
   - `verificado` necesita evidencia de identidad real. Una URL autogenerada
     `maps/search/?api=1&query=...` facilita la búsqueda, pero no demuestra por sí sola que la ficha
     pertenezca al productor.
4. **Deduplica por capas**
   - Compara nombre sin acentos, teléfono, correo, dominio, dirección, coordenadas y `place_id`.
   - Misma dirección + teléfono + correo suele ser una sola entidad o varias marcas del mismo
     operador: conserva un `slug` estable y reúne las marcas si representan la misma unidad productiva.
   - No fusiones automáticamente cooperativa y socio, secciones productivas distintas, negocios en
     naves contiguas ni productores que comparten mercado, finca o edificio. Exige evidencia de
     operador común.
5. **Revisa colisiones geográficas**
   - Lista coordenadas idénticas y pares muy próximos (por ejemplo, ≤100 m). Son señal de triaje,
     no error automático: pueden ser un centroide de municipio, un polígono, un mercado o una finca
     compartida.
   - Si hay dirección concreta y Nominatim la resuelve dentro de 15 km del centroide municipal,
     sustituye el centroide por esa geocodificación. Si no resuelve, conserva el centroide honesto;
     no inventes precisión.
6. **Audita semántica y enlaces**
   - Recorre webs/redes por identidad, no solo por respuesta HTTP. Un 200 de otro negocio es peor que
     un campo vacío; un timeout o TLS fallido no basta para borrar.
   - Para `Venta online=sí`, confirma hoy el mecanismo real de pedido. Catálogo, menú, tienda vacía,
     marketplace histórico o texto legal no prueban compra vigente.
7. **Cierra con trazabilidad**
   - Documenta duplicados fusionados y coincidencias conservadas, incluidas las razones.
   - Registra los fallos transitorios que no causaron bajas, las coordenadas de respaldo mantenidas y
     cualquier techo de evidencia que deje filas en `parcial` o `no comprobado`.
   - Revisa `git diff --check`, el diff completo y el estado de Git antes del commit.

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

- Todos los CSV son **LF** (norma global desde 2026-06-10, forzada por `.gitattributes`): edítalos
  preservando el fin de línea de cada fila (Python con `newline=""`), modifica solo las líneas de tu
  lote y deja el resto byte-idéntico. Si aparece un `\r`, algo lo ha reintroducido — no lo commitees.
  Valida con `git diff --numstat` que el nº de líneas tocadas es el esperado.
- Script efímero en `/tmp`, **no commitear** (AGENTS prohíbe generadores como fuente de verdad).
