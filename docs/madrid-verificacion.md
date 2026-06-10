# Madrid · verificación profunda — manual + estado

> Ledger reanudable de la verificación campo a campo de `data/csv/madrid/madrid.csv`.
> Una sesión nueva (sin memoria de la anterior) debe poder retomar **solo con este archivo**.
> Es evidencia de trabajo, no fuente de verdad: la verdad es el CSV + la columna `verificacion`.
> Hermano del proceso de Barcelona (`docs/barcelona-verificacion.md`), adaptado a los patrones de Madrid.
>
> **Principio rector (no negociable):** dar peso a la **verificación real** y a la **solidez del CSV**.
> - Evidencia > afirmaciones. No te fíes de lo que ya pone la fila: hay `Venta online=sí`, webs y
>   GMaps **mal auto-rellenados**. Confírmalo o corrígelo.
> - Niveles honestos: `verificado` solo con cotejo contra fuente primaria/fiable; `parcial` si solo
>   hay fuente secundaria o registro; `pendiente` si no se ha revisado.
> - Nunca inventes un productor ni un dato. Mejor vacío que falso.
> - Elimina desinformación (enlaces a entidades ajenas) aunque implique dejar el campo vacío.
> - Purga/borra filas solo con evidencia fuerte (cotejo de registro + ausencia de presencia real).

## Estado actual (2026-06-10)

- Filas: **227** · `verificado` **0** · `parcial` **177** · `pendiente` **50**.
- Modo: **verificación profunda por zonas**, lote a lote bajo demanda (~25 filas/lote, ~9-11 sub-lotes).
- **Cerrados:** ninguno. **Siguiente:** Lote 1 = Las Vegas y Sureste, sub-lote 1a.
- Herencia (contexto que explica el estado, ver `git log -- data/csv/madrid/madrid.csv`):
  - 2026-06-05 (`e52d661`): pasada de **geolocalización + Google Places** (237→227): coords 100%,
    direcciones reales ~210, municipios normalizados, 24 place_ids ajenos saneados, 3 dups fusionados,
    7 cierres purgados. **Ojo:** ese `parcial` masivo = "existe en Google Places", **no** verificación web.
  - Los 50 `pendiente` vienen en su mayoría de la **integración de candidatos** (`e7cf459` y posteriores):
    0 teléfonos, 0 Instagram, y webs tipo `https://www.<nombre>.com` plausibles pero **sin comprobar**
    (los docs de candidatos mezclaban productores reales con inventados).
  - `Venta online`: **126 `sí`** heredados sin confirmar checkout (104 parcial + 22 pendiente),
    99 `no comprobado`, solo 2 `no`. Trátalo como auto-rellenado: hay que confirmarlo fila a fila.
  - `Google Maps`: **227/227 son URLs de búsqueda autogeneradas** (`maps/search/?api=1&query=…`),
    no enlaces a la ficha real. El audit las acepta como "enlace", este manual **no** (ver gotchas).

## Cómo retomar en 1 minuto

1. Lee este archivo entero (estado + patrones + gotchas).
2. Elige la siguiente zona de la **worklist** (más abajo) en orden de impacto.
3. Extrae su lote priorizando riesgo (pendientes primero, luego `VO=sí` sin confirmar):
   ```bash
   python3 - <<'PY'
   import csv
   ZONA="Las Vegas y Sureste"   # <-- zona objetivo
   Z={
   'Capital':['Madrid','Madrid - Arganzuela','Madrid - Carabanchel','Madrid - Centro','Madrid - Chamartín','Madrid - Fuencarral','Madrid - Latina','Madrid - Puente de Vallecas','Madrid - Retiro','Madrid - Salamanca','Madrid - San Blas-Canillejas','Madrid - Tetuán'],
   'Sierra Norte y Jarama':['Braojos','Buitrago del Lozoya','Bustarviejo','Colmenar Viejo','El Molar','Fuente el Saz de Jarama','Gargantilla del Lozoya','Guadalix de la Sierra','La Hiruela','Lozoya','Madarcos','Manzanares el Real','Miraflores de la Sierra','Montejo de la Sierra','Navarredonda y San Mamés','Puebla de la Sierra','Rascafría','Robledillo de la Jara','Soto del Real','Talamanca de Jarama','Torrelaguna','Torremocha de Jarama','Venturada','Tres Cantos','Alcobendas','San Sebastián de los Reyes'],
   'Guadarrama y Noroeste':['Alpedrete','Becerril de la Sierra','El Boalo','Collado Villalba','Guadarrama','Los Molinos','Moralzarzal','San Lorenzo de El Escorial','Valdemorillo','Las Rozas de Madrid','Villanueva del Pardillo'],
   'Sierra Oeste y Suroeste':['San Martín de Valdeiglesias','Cadalso de los Vidrios','Cenicientos','Pelayos de la Presa','Villa del Prado','Navas del Rey','Aldea del Fresno','Villamantilla','Colmenar del Arroyo','Fresnedillas de la Oliva','Santa María de la Alameda','Navalcarnero','Brunete'],
   'Las Vegas y Sureste':['Aranjuez','Arganda del Rey','Belmonte de Tajo','Campo Real','Carabaña','Chinchón','Ciempozuelos','Colmenar de Oreja','Fuentidueña de Tajo','Morata de Tajuña','Perales de Tajuña','Rivas-Vaciamadrid','San Martín de la Vega','Tielmes','Titulcia','Valdelaguna','Valdilecha','Valdemoro','Villaconejos','Villarejo de Salvanés','Loeches'],
   'Henares y Este':['Alcalá de Henares','Ajalvir','Camarma de Esteruelas','Cobeña','Coslada','Daganzo de Arriba','Meco','Santorcaz','Torrejón de Ardoz','Pezuela de las Torres','Nuevo Baztán','Mejorada del Campo'],
   'Sur metropolitano':['Fuenlabrada','Móstoles','Leganés','Humanes de Madrid','Getafe','Pinto','Alcorcón','Moraleja de Enmedio','Arroyomolinos'],
   }
   rows=list(csv.DictReader(open('data/csv/madrid/madrid.csv',encoding='utf-8',newline='')))
   sel=[r for r in rows if r['municipio'].strip() in Z[ZONA] and r['verificacion'].strip()!='verificado']
   sel.sort(key=lambda r:(r['verificacion'].strip()!='pendiente', r['Venta online'].strip()!='sí', r['web'].strip()==''))
   for r in sel[:25]:
       print(r['slug'],'|',r['verificacion'],'| VO=',r['Venta online'],'|',r['categoria'],'|',r['municipio'],'| web=',r['web'][:38])
   PY
   ```
4. Verifica cada fila por web (ver **protocolo** y **patrones**).
5. Edita con el **script column-aware EOL-safe** (plantilla más abajo). Nunca a mano fila a fila.
6. Valida: `npx pnpm check:csv:changed` → `npx pnpm verify:data`. Actualiza este ledger.

## ⚠️ Gotchas técnicos (leer antes de editar)

- **EOL: LF (`\n`), como todos los CSV del repo** (norma global desde 2026-06-10, forzada por
  `.gitattributes`). La plantilla de edición de abajo preserva el EOL de cada línea; al terminar
  comprueba que sigue LF puro:
  ```bash
  python3 -c "b=open('data/csv/madrid/madrid.csv','rb').read(); print('LF ok' if b.count(b'\r')==0 else 'PROBLEMA: se ha colado CRLF')"
  ```
- **No reescribas todo el fichero.** Modifica solo las líneas cuyo `slug` está en tu lote; el resto
  byte-idéntico. Preserva el trabajo de otros agentes y mantiene el diff pequeño.
- **Multiagente:** toca solo `madrid.csv`, este ledger y `public/productores/madrid/madrid/`.
  Al commitear, `git add` explícito de tus rutas; nunca `git add -A`/`git checkout` del CSV.
- **Orden de columnas (0-based), 20 columnas (cabecera canónica del repo):** 0 slug · 1 nombre ·
  2 municipio · 3 categoria · 4 productos estrella · 5 direccion · 6 descripcion · 7 horario ·
  8 telefono · 9 correo · 10 web · 11 Facebook · 12 Instagram · 13 Google Maps · 14 lat · 15 lon ·
  16 imagen · 17 verificacion · 18 Venta online · 19 Canal de venta.
- **`Google Maps` autogenerado NO es evidencia.** El audit acepta cualquier GMaps no vacío como
  "enlace externo" para `verificado`, pero aquí todos son `maps/search/?api=1&query=…`. Regla del
  manual (más estricta que el audit): para `verificado` exige **web/IG/FB reales del productor** o
  sustituye el GMaps por el enlace a la **ficha real** del negocio. El search-query puede quedarse
  (no es desinformación), pero no cuenta como el "≥1 enlace".
- **Coords ya validadas** (pasada Places 06/2026, geo-check ≤15 km). No las toques salvo que
  corrijas la dirección/municipio; en ese caso re-geocodifica y pasa el geo-check.
- **Teléfonos en E.164 estricto** (`+34…`): el audit bloquea otros formatos.
- **Imágenes:** ruta canónica `/productores/madrid/madrid/<slug>.webp` (140/227 filas la tienen).
  Al borrar una fila con imagen, borra también su `.webp` (huérfana → warning en `check:images`).
  Preferir logo/imagotipo a foto de producto; nunca `enrich:images --apply` en bloque.

### Lote 0 (estructural): columna `Canal de venta` — ✅ HECHO (2026-06-10)

Resuelto por la unificación de estructura de todo el repo: los 50 CSV comparten ahora la cabecera
canónica de 20 columnas con `Canal de venta` al final (vacía = sin clasificar). El valor sigue
siendo opcional y warning-only; anótalo en los lotes cuando confirmes `VO=sí`.

### Plantilla de edición column-aware (EOL-safe)
```python
import csv, io
PATH="data/csv/madrid/madrid.csv"
CHANGES={ "slug-aqui": {17:"verificado", 18:"sí"} }   # idx_columna: valor
DELETE=set()                                           # slugs a borrar
with open(PATH,encoding="utf-8",newline="") as f: lines=f.readlines()
out=[]
for line in lines:
    eol="\r\n" if line.endswith("\r\n") else ("\n" if line.endswith("\n") else "")
    body=line[:-len(eol)] if eol else line
    slug=body.split(",",1)[0]
    if slug in DELETE: continue
    if slug in CHANGES:
        f0=next(csv.reader(io.StringIO(body)))
        for i,v in CHANGES[slug].items(): f0[i]=v
        o=io.StringIO(); csv.writer(o,lineterminator="").writerow(f0); body=o.getvalue()
    out.append(body+eol)
open(PATH,"w",encoding="utf-8",newline="").writelines(out)
```

## Protocolo por fila (verificación profunda)

Contrasta cada fila contra **fuente primaria** (web propia + ficha real de Google) y, cuando aplique,
contra los **registros madrileños** (ver más abajo). Confirma `Venta online` con un canal de pedido vivo HOY.

- [ ] `nombre` / `municipio` coinciden con la fuente (la dirección/coords pueden delatar otro municipio)
- [ ] `categoria` ∈ `VALID_CATEGORIES` (`scripts/audit-csv.js`)
- [ ] `direccion` + `lat`/`lon` coherentes (geo-check ≤15 km)
- [ ] `telefono` / `correo` / `web` vivos y **del productor** (no de un tercero) — en pendientes, la web
      puede ser **inventada**: dominio vivo no basta, tiene que ser *su* dominio
- [ ] `Instagram` / `Facebook` = perfil oficial real
- [ ] `Google Maps`: si verificas, intenta sustituir el search-query por la ficha real
- [ ] `imagen` = logo/imagotipo (nunca `enrich:images --apply` en bloque)
- [ ] `Venta online` + `Canal de venta` (ver regla)
- [ ] `verificacion` → `verificado` (todo cuadra) / `parcial` (solo secundaria o registro) / `pendiente`

## Regla de `Venta online` / `Canal de venta`

Decisión por **canal de pedido online real**, confirmado hoy:
- **`sí`** si hay: tienda web con carrito/checkout (`ecommerce`); pedido por marketplace/Glovo
  (`marketplace`); "pedir online" por WhatsApp (`whatsapp`); email/teléfono de pedido (`email`/`telefono`);
  cestas por suscripción (`suscripcion`). Varios → pipe: `ecommerce|whatsapp`.
- **`no`** si solo hay web informativa, "en construcción", o solo tienda física / venta en mercados.
- **`no comprobado`** si no puedes confirmarlo. **No** afirmes `sí` sin evidencia; **no** degrades
  a `no` a la ligera (web caída temporal ≠ no vende).
- **Alerta Madrid:** hay 126 `sí` heredados sin confirmar. Espera corregir muchos a `no`/`no comprobado`
  (visto en Barcelona: catálogo sin carrito marcado como `sí`).

## Catálogo de patrones por productor (los de Madrid)

1. **Marca consolidada con web propia** (bodegas DO, cerveceras artesanas, queserías, tostadores):
   `WebFetch` su web → confirma negocio + checkout → `verificado` + `Venta online` según regla. ~1 fetch.
2. **Candidato integrado con web plausible** (la mayoría de los 50 `pendiente`: sin tel, sin IG, web
   `https://www.<nombre>.com`): los docs de candidatos mezclaban reales con **inventados**. Verifica que
   el dominio carga **y** es del productor. Inventada/parked → blanquéala y busca la real; sin rastro
   alguno (ni registro, ni Google, ni prensa local) → **purgar**.
3. **`Venta online=sí` auto-rellenado**: web viva pero sin carrito ni canal de pedido → corrige a
   `no`/`no comprobado` aunque la fila diga `sí`.
4. **Web = directorio o tercero** (esmadrid.com, guías turísticas, ayuntamientos, revistas): no es la
   web del productor → blanquea y busca la propia. Si además no hay rastro propio → patrón 7/purga.
5. **Elaborador urbano de la capital** (tostadores de café, cerveceras, obradores, chocolaterías):
   elabora in situ → es productor, `verificado` si la fuente cuadra. La cafetería/bar que **solo sirve**
   producto de terceros no lo es → `parcial`, `Venta online=no`, candidata a purga si ni elabora ni vende.
6. **Tienda/frutería que revende** (incl. paradas de mercado sin obrador ni cultivo propio): existe
   pero no es productor → `parcial` y anotar; purga si claramente solo distribución.
7. **Productor de registro sin presencia web** (figura en M Producto Certificado / CAEM / DO pero sin
   web propia): match de entidad (nombre + municipio) → `parcial`; aprovecha para corregir
   productos/contacto con los datos del registro. Sin match + sin presencia → **purgar**.
8. **Mal fichada**: fuera de la Comunidad, categoría equivocada, o granja/explotación no vendible →
   **purgar** (o flag para mover, sin tocar el CSV de otra provincia).
9. **Web muerta vs web secuestrada:**
   - Fetch falla por SSL/http/timeout/ECONNREFUSED → **NO** borres la web (un fetch fallido no es un
     sitio muerto); confirma por búsqueda.
   - La web **carga pero muestra un negocio ajeno** (parked, dominio en venta, spam) → **blanquéala**
     (es desinformación) y baja a `parcial`/`pendiente` según el resto.

## Fuentes de cotejo madrileñas (el "DAR" de Madrid)

No hay (de momento) un dataset descargable tipo Socrata como el DAR catalán; el cotejo es por buscador
web. Si aparece un dataset consultable (datos.comunidad.madrid / datos.gob.es), crear un
`scripts/match-madrid.mjs` análogo a `scripts/match-dar.mjs`.

- **M Producto Certificado** (marca de garantía "Alimentos de Madrid", ~505 empresas): buscador por
  municipio/producto/marca en `comunidad.madrid/info/productores` (portada:
  `comunidad.madrid/m-producto-certificado`). Match de entidad → `parcial` mínimo; corrige
  productos/contacto con la ficha.
- **CAEM** (Comité de Agricultura Ecológica de la Comunidad de Madrid): listado de operadores
  certificados en `caem.es/operadores/`; complementa con el directorio europeo TRACES de operadores eco.
  Útil para huertas/cestas eco (Rivas, Aranjuez, Sierra Norte…).
- **D.O. Vinos de Madrid** (`vinosdemadrid.es`): bodegas adscritas por subzona — **Arganda** (~28
  bodegas), **Navalcarnero** (~5), **San Martín de Valdeiglesias** (~18), **El Molar** (desde 2019).
  Cruza las 34 filas `Bodega` con su subzona; bodega que dice DO y no consta → sospecha.
- **Denominaciones menores** (cotejar por búsqueda, sin URL fija verificada): marca de garantía
  **Aceitunas de Campo Real**, **Aceite de Madrid** (AOVE), IGP **Carne de la Sierra de Guadarrama**,
  D.G. **Anís de Chinchón**. Refuerzan los clústeres de Campo Real, Las Vegas y la Sierra.
- **Mercados de productores** (secundarias): Día de Mercado de la Cámara Agraria, Mercado de
  Productores del Planetario, mercados agroecológicos municipales — confirman que el productor vende
  directo (no confirman venta online).
- **Caveat general:** no constar en un registro voluntario no prueba inexistencia; pero junto a la
  ausencia total de presencia web/Google justifica la purga.

## Worklist priorizada (por zonas)

Leyenda: ⬜ pendiente · 🟨 en curso · ✅ hecho. La asignación municipio→zona es la del script de
"Cómo retomar" (104 municipios, suma 227 filas). Dentro de cada lote: pendientes primero, luego
`VO=sí` sin confirmar, luego el resto.

| # | Zona | Filas | Pend. | VO=sí | Sub-lotes | Estado | Fecha | Notas |
|---|---|---|---|---|---|---|---|---|
| 1 | Las Vegas y Sureste | 59 | 11 | 36 | 3 (1a-1c) | ⬜ | | Aceitunas Campo Real, DO Arganda, huerta Aranjuez/Rivas, Chinchón |
| 2 | Sierra Norte y Jarama | 52 | 13 | 27 | 2 (2a-2b) | ⬜ | | Miel, carne, quesos, huerta; Torremocha/Bustarviejo; IGP Guadarrama |
| 3 | Capital | 34 | 3 | 19 | 2 (3a-3b) | ⬜ | | Tostadores, cerveceras urbanas, obradores; ojo webs-directorio (esmadrid) |
| 4 | Sierra Oeste y Suroeste | 28 | 9 | 13 | 1 | ⬜ | | DO subzona San Martín de Valdeiglesias + Navalcarnero; vino de garnacha |
| 5 | Sur metropolitano | 25 | 4 | 16 | 1 | ⬜ | | Obradores y cerveceras de Fuenlabrada/Móstoles/Humanes/Leganés |
| 6 | Henares y Este | 16 | 8 | 8 | 1 | ⬜ | | **50% pendiente** — máximo riesgo de candidatos inventados |
| 7 | Guadarrama y Noroeste | 13 | 2 | 7 | 1 | ⬜ | | Sierra oeste residencial; quesos/carne/cerveza |

## Registro de lotes cerrados

| Fecha | Lote | Filas | → verificado | otros | Notas |
|---|---|---|---|---|---|
