# Madrid · verificación profunda — manual + estado

> Ledger reanudable de la verificación campo a campo de `data/csv/madrid/madrid.csv`.
> Una sesión nueva debe poder retomar **solo con este archivo**. No es fuente de verdad: la verdad
> es el CSV (columna `verificacion`). Hermano del proceso de Barcelona
> (`docs/barcelona-verificacion.md`); el detalle histórico vive en el git log de este archivo.

## Reglas duras (no negociables)

1. Evidencia > afirmaciones. No te fíes de lo que ya pone la fila: hay `Venta online=sí`, webs y
   GMaps **mal auto-rellenados**. Confírmalo o corrígelo.
2. Nunca inventes un productor ni un dato. Mejor vacío que falso.
3. Enlace que apunta a una entidad ajena = desinformación → **blanquéalo**, aunque el campo quede vacío.
4. Borra una fila solo con evidencia fuerte: sin match en registro **y** sin presencia real.
5. Un fetch fallido (SSL/http/timeout/ECONNREFUSED) **no** es un sitio muerto: confirma por búsqueda
   antes de blanquear una web.
6. **GMaps de Madrid no cuenta como enlace para `verificado`**: 220 de 223 enlaces son search-queries
   autogeneradas (`maps/search/?api=1&query=…`). El audit las acepta; este manual no. Para
   `verificado` exige web/IG/FB reales del productor, o sustituye el GMaps por su ficha real.
   El search-query puede quedarse (no es desinformación), pero no es "el ≥1 enlace".

## Estado actual (2026-06-12)

- Filas: **223** · verificado **219** · parcial **4** · pendiente **0**.
- Modo: **MANTENIMIENTO TRANSVERSAL** tras verificación zonal y cierre residual (40 lotes, 44 sub-lotes).
- **Cerrados: Lotes 1-40. No quedan filas pendientes; 4 registros permanecen `parcial` por techo
  de evidencia y no deben promoverse sin una nueva fuente primaria propia.**
- Auditoría profunda de `Venta online=sí`: **149/177 filas actualmente en `sí` revisadas** en orden
  del CSV; se han auditado 150 registros y uno pasó a `no comprobado`. El siguiente lote empieza
  en `bodegas-licinia-morata-de-tajuna`.
- Fuera de esa auditoría de mantenimiento, reabrir Madrid solo ante nueva evidencia primaria o una
  alta/baja real de productor; no quedan lotes de verificación editorial abiertos.
- Herencia (por qué el estado es así; detalle en `git log -- data/csv/madrid/madrid.csv`):
  - El `parcial` masivo (177) viene de la pasada Google Places 2026-06-05 (`e52d661`): significa
    "existe en Places", **no** verificación web. Coords 100% validadas (geo-check ≤15 km): no las
    toques salvo que corrijas dirección/municipio; entonces re-geocodifica y pasa el geo-check.
  - Los 50 `pendiente` vienen de la integración de candidatos: 0 teléfonos, 0 Instagram, webs tipo
    `https://www.<nombre>.com` plausibles pero **sin comprobar** (los docs de candidatos mezclaban
    reales con inventados). Máximo riesgo.
  - `Venta online` tras los cuarenta lotes: **177 `sí`**, 12 `no comprobado`, 34 `no`.

## Procedimiento (cada lote)

1. Lee este archivo entero.
2. Toma la primera zona ⬜ de la **worklist** (más abajo).
3. Lista su lote priorizando riesgo (pendientes primero, luego `VO=sí` sin confirmar):
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
4. Verifica cada fila por web y contra los registros madrileños → "Decisión por fila", "Patrones"
   y "Fuentes de cotejo".
5. Aplica los cambios con la plantilla Python → sección "Edición del CSV". Nunca a mano fila a fila.
6. Valida: `npx pnpm check:csv:changed` y después `npx pnpm verify:data`.
7. Actualiza este archivo: bloque "Estado actual" + fila de la worklist (✅, fecha, nota de 1 línea).

## Edición del CSV

- **EOL = LF** en todos los CSV del repo (forzado por `.gitattributes`). Abre con `newline=""`.
  Comprobación final:
  ```bash
  python3 -c "b=open('data/csv/madrid/madrid.csv','rb').read(); print('LF ok' if b.count(b'\r')==0 else 'PROBLEMA: se ha colado CRLF')"
  ```
- Modifica **solo** las líneas cuyo `slug` está en tu lote; el resto byte-idéntico.
- Multiagente: toca solo `madrid.csv`, este ledger y `public/productores/madrid/madrid/`.
  `git add` explícito de tus rutas; nunca `git add -A` ni `git checkout` del CSV.
- Columnas (0-based, cabecera canónica): 0 slug · 1 nombre · 2 municipio · 3 categoria ·
  4 productos estrella · 5 direccion · 6 descripcion · 7 horario · 8 telefono · 9 correo · 10 web ·
  11 Facebook · 12 Instagram · 13 Google Maps · 14 lat · 15 lon · 16 imagen · 17 verificacion ·
  18 Venta online · 19 Canal de venta.
- Contrato: `verificado` exige coords + ≥1 enlace **real** (regla dura 6); `categoria` ∈
  `VALID_CATEGORIES` de `scripts/audit-csv.js`; `telefono` E.164 (`+34…`).
- Imágenes: ruta canónica `/productores/madrid/madrid/<slug>.webp` (~140/227 filas la tienen).
  Al borrar una fila con `imagen`, borra también su `.webp`. Logo/imagotipo antes que foto;
  nunca `enrich:images --apply` en bloque.

### Plantilla de edición (column-aware, EOL-safe)

```python
import csv, io
PATH="data/csv/madrid/madrid.csv"
CHANGES={ "slug-aqui": {17:"verificado", 18:"sí", 19:"ecommerce"} }   # idx_columna: valor
DELETE=set()                                                          # slugs a borrar
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

## Decisión por fila

Comprueba campo a campo contra la fuente (web propia + ficha real de Google):

- `nombre`/`municipio` coinciden con la fuente (la dirección/coords pueden delatar otro municipio).
- `direccion` + `lat`/`lon` coherentes (geo-check ≤15 km); coords ya validadas, no tocar sin motivo.
- `telefono`/`correo`/`web` vivos y **del productor** — en `pendiente` la web puede ser **inventada**:
  que el dominio cargue no basta, tiene que ser *su* dominio.
- `Instagram`/`Facebook` = perfil oficial real.
- `Google Maps`: si verificas, intenta sustituir el search-query por la ficha real.
- `imagen` = logo/imagotipo.
- `Venta online` + `Canal de venta` → regla de abajo.

Después clasifica:

| Lo que encuentras | Acción |
|---|---|
| Fuente primaria cuadra (web propia, ficha real, perfil oficial) | `verificacion=verificado` |
| Solo registro (M Producto/CAEM/DO) o fuente secundaria; o existe pero no elabora (revende/sirve) | `verificacion=parcial` |
| No has podido revisarla | déjala `pendiente` |
| Sin rastro + sin registro; o dup; o mal fichada (fuera de la Comunidad, no productor) | **purgar** la fila (+ su `.webp`) |

## Venta online / Canal de venta

Decide por **canal de pedido online vivo HOY**:

- `sí` + canal: carrito/checkout propio → `ecommerce`; marketplace/Glovo → `marketplace`;
  pedido por WhatsApp → `whatsapp`; pedido por email/teléfono → `email`/`telefono`;
  cestas recurrentes → `suscripcion`. Varios → pipe: `ecommerce|whatsapp`.
- `no`: solo web informativa, "en construcción", o solo tienda física / venta en mercados.
- `no comprobado`: no puedes confirmarlo (web caída temporal ≠ no vende).
- No afirmes `sí` sin evidencia; no degrades a `no` a la ligera. Los 126 `sí` heredados se
  confirman o se corrigen uno a uno.
- `Canal de venta` solo cuando `Venta online=sí`; si no, vacío.

## Patrones (reconoce y actúa)

1. **Marca consolidada con web propia** (bodegas DO, cerveceras, queserías, tostadores) → fetch web,
   confirma negocio + checkout → `verificado`.
2. **Candidato integrado con web plausible** (la mayoría de los 50 `pendiente`: sin tel, sin IG,
   web `https://www.<nombre>.com`) → verifica que el dominio carga **y** es del productor.
   Inventada/parked → blanquear y buscar la real; sin rastro alguno → purgar.
3. **`Venta online=sí` auto-rellenado** → web viva pero sin carrito ni canal de pedido → corrige a
   `no`/`no comprobado` aunque la fila diga `sí`.
4. **Web = directorio o tercero** (esmadrid.com, guías, ayuntamientos, revistas) → blanquear y
   buscar la propia; sin rastro propio → patrón 7 / purga.
5. **Elaborador urbano de la capital** (tostador, cervecera, obrador, chocolatería): elabora in situ
   → es productor. El café/bar que **solo sirve** producto de terceros no lo es → `parcial`, `VO=no`,
   candidata a purga si ni elabora ni vende.
6. **Tienda/frutería que revende** (incl. paradas de mercado sin obrador ni cultivo propio) →
   `parcial` y anotar; purga si claramente solo distribución.
7. **Productor de registro sin presencia web** (consta en M Producto/CAEM/DO) → match de entidad
   (nombre + municipio) → `parcial` + corrige productos/contacto con el registro. Sin match + sin
   presencia → purgar.
8. **Mal fichada** (fuera de la Comunidad, categoría equivocada, explotación no vendible) → purgar;
   si es real en otra provincia, flag sin tocar su CSV.
9. **Web muerta vs secuestrada**: fetch falla → NO borres (regla dura 5); web carga pero muestra un
   negocio ajeno (parked, en venta, spam) → blanquear + bajar a `parcial`/`pendiente`.

## Fuentes de cotejo madrileñas (el "DAR" de Madrid)

No hay dataset descargable tipo Socrata; el cotejo es por buscador. Si aparece uno
(datos.comunidad.madrid / datos.gob.es), crear `scripts/match-madrid.mjs` análogo a `match-dar.mjs`.

- **M Producto Certificado** (~505 empresas): buscador en `comunidad.madrid/info/productores`.
  Match de entidad → `parcial` mínimo; corrige productos/contacto con la ficha.
- **CAEM** (agricultura ecológica): operadores en `caem.es/operadores/`; complementa con TRACES.
  Útil para huertas/cestas eco (Rivas, Aranjuez, Sierra Norte).
- **D.O. Vinos de Madrid** (`vinosdemadrid.es`): subzonas Arganda (~28 bodegas), Navalcarnero (~5),
  San Martín de Valdeiglesias (~18), El Molar. Bodega que dice DO y no consta → sospecha.
- **Denominaciones menores** (por búsqueda): Aceitunas de Campo Real, Aceite de Madrid (AOVE),
  IGP Carne de la Sierra de Guadarrama, Anís de Chinchón.
- **Mercados de productores** (secundarias): Día de Mercado de la Cámara Agraria, Mercado de
  Productores del Planetario, mercados agroecológicos — confirman venta directa, no venta online.
- No constar en un registro voluntario no prueba inexistencia; pero sin registro **y** sin
  presencia web/Google, justifica la purga.

## Worklist (por zonas)

Leyenda: ⬜ pendiente · 🟨 en curso · ✅ hecho. Zonas según el script del procedimiento
(104 municipios, 223 filas). Dentro de cada lote: pendientes primero, luego `VO=sí` sin confirmar.

| # | Zona | Filas | Pend. | VO=sí | Sub-lotes | Estado | Fecha | Notas |
|---|---|---|---|---|---|---|---|---|
| 1 | Las Vegas y Sureste | 59 | 11 | 36 | 3 (1a-1c) | ✅ | 2026-06-10 | 1a-1c: 56 verificados, 3 parciales; 1c corrige contactos, canales y 4 direcciones; sin borrados |
| 2 | Sierra Norte y Jarama | 52 | 13 | 27 | 2 (2a-2b) | ✅ | 2026-06-11 | 2a-2b: 49 verificados, 3 parciales; 2b corrige dominios, sede de Ganademad y canales; sin borrados |
| 3 | Capital | 33 | 3 | 19 | 2 (3a-3b) | ✅ | 2026-06-11 | 32 verificados, 1 parcial; corrige contactos, dominios, canales y coords de La Caníbal; Fábrica Maravillas eliminada como duplicado |
| 4 | Sierra Oeste y Suroeste | 28 | 9 | 13 | 1 | ✅ | 2026-06-11 | 24 verificadas, 4 parciales; corrige Ca' di Mat a Pelayos, reclasifica El Huerto de San Martín y repara contactos/canales; sin borrados |
| 5 | Sur metropolitano | 25 | 4 | 16 | 1 | ✅ | 2026-06-11 | 25 verificadas; confirma tiendas/canales, corrige dominios y contactos y aclara la tienda de Vaca Negra en Arroyomolinos; sin borrados |
| 6 | Henares y Este | 16 | 8 | 8 | 1 | ✅ | 2026-06-11 | 13 verificados, 3 parciales; corrige Las Abejas de Emilio a El Vellón, Maps de Camuy, dominios, contactos y canales; sin borrados |
| 7 | Guadarrama y Noroeste | 12 | 0 | 10 | 1 | ✅ | 2026-06-11 | 12 verificadas; elimina Cervecera Madrileña por duplicar Amiga/MAD91 y corrige ubicación de Gin Monti, contactos y canales |
| 8 | Residual de parciales | 14 | 0 | 1 | 1 | ✅ | 2026-06-11 | 6 verificadas y 8 parciales registrales; corrige el dominio secuestrado de Finca Mariscalas y añade perfiles propios de Artbread, Cuerda Larga y El Guinda |
| 9 | Cierre residual | 8 | 0 | 0 | 1 | ✅ | 2026-06-11 | Elimina Vino de ARRÉN: Agroalimentaria Torremocha S.L. consta extinguida desde 2023; conserva 7 parciales con evidencia registral o secundaria, sin forzar verificaciones |
| 10 | Segunda pasada residual | 7 | 0 | 0 | 1 | ✅ | 2026-06-11 | Verifica Virgen de la Oliva y Gigorro; corrige José Carlos Velasco a Villaconejos; elimina CIDED tras la revocación de su NIF y la desaparición de sus canales; quedan 4 parciales |
| 11 | Cierre de evidencia residual | 4 | 0 | 0 | 1 | ✅ | 2026-06-11 | Mantiene 4 parciales: Lavandas y La Cabaña Blanca constan en mercados de 2026; Té y Vida conserva dominio en mantenimiento; Melones Velasco tiene actividad pública reciente, pero ninguno aporta presencia primaria propia verificable |
| 12 | Auditoría transversal de enlaces y contacto | 223 | 0 | 151 | 1 | ✅ | 2026-06-11 | Revisa 188 webs; retira 5 dominios NXDOMAIN sin borrar productores activos, repara 3 URLs y completa contacto y horario de Panic y Pan.Delirio; sin cambios de verificación |
| 13 | Cierre final | 223 | 0 | 150 | 1 | ✅ | 2026-06-11 | Revisa títulos, redirecciones, duplicados, canales y las 4 parciales; retira de Granja Colmenar una web ajena de León, corrige su WhatsApp, depura el canal obsoleto de Cuerda Larga y completa el correo de Tenta; Madrid queda cerrado |
| 14 | Auditoría profunda de venta no comprobada | 20 | 0 | 0 | 1 | ✅ | 2026-06-11 | Revisa las 20 filas `no comprobado`; confirma ecommerce propio de Finca Mariscalas, ecommerce de Bodega San Andrés en Recespaña y pedidos por correo de Huertos Vega del Tajuña; conserva 17 sin canal vigente demostrable |
| 15 | Segunda auditoría profunda de venta pendiente | 17 | 0 | 0 | 1 | ✅ | 2026-06-11 | Confirma marketplace activo para 4 Monos y Ca' di Mat, y venta a grupos por teléfono de Vega Fértil; migra Huevos El Hortelano a su perfil social vigente; quedan 14 sin canal actual demostrable |
| 16 | Bodegas con venta pendiente | 3 | 0 | 0 | 1 | ✅ | 2026-06-12 | Recupera la web oficial vigente de Pedro García y comprueba su catálogo: el checkout solo vende experiencias, no vino; Mario Sampedro y VegaLuna siguen sin pedido remoto demostrado |
| 17 | Venta directa por redes y contacto | 3 | 0 | 0 | 1 | ✅ | 2026-06-12 | Confirma pedidos por WhatsApp de Las Abejas de Emilio, reservas y reparto telefónico de Huevos El Hortelano y venta a domicilio por teléfono de Cuerda Larga |
| 18 | Consolidación de perfiles y contacto | 3 | 0 | 0 | 1 | ✅ | 2026-06-12 | Completa teléfono, correo y Facebook de El Huerto de San Martín; añade el perfil propio de Melones Velasco y teléfono/Facebook vigentes de El Hortelano |
| 19 | Aceites, mieles y parciales | 5 | 0 | 0 | 1 | ✅ | 2026-06-12 | Revisa Santa Lucía, Santo Cristo, La Cabaña Blanca, Lavandas y Té y Vida; conserva `no comprobado`: hay venta o actividad, pero no un canal remoto actual atribuible |
| 20 | Cierre cruzado de venta pendiente | 11 | 0 | 0 | 1 | ✅ | 2026-06-12 | Contrasta perfiles, registros, dominios, stock y canales de los 11 supervivientes; no fuerza `no` ni `sí` sin evidencia y cierra Madrid en 159 `sí`, 11 `no comprobado` y 53 `no` |
| 21 | Auditoría profunda de `Venta online=no` (1/5) | 11 | 0 | 0 | 1 | ✅ | 2026-06-12 | Confirma ecommerce propio de Trampero y Tenta, reparto telefónico de Granja Vega Alberche y marketplace activo para Don Picón; conserva 7 sin pedido remoto vigente |
| 22 | Auditoría profunda de `Venta online=no` (2/5) | 11 | 0 | 0 | 1 | ✅ | 2026-06-12 | Recupera el pedido online de Biopan, envío telefónico de Peña Rubia y La Pastora, y marketplaces de CCVK y Valleyglesias; conserva 6 sin canal demostrable |
| 23 | Auditoría profunda de `Venta online=no` (3/5) | 11 | 0 | 0 | 1 | ✅ | 2026-06-12 | Confirma encargos telefónicos de Pastelería Jericó y ecommerce propio de Bernabeleva; descarta como evidencia tiendas vacías, catálogos sin checkout y pedidos históricos |
| 24 | Auditoría profunda de `Venta online=no` (4/5) | 10 | 0 | 0 | 1 | ✅ | 2026-06-12 | Confirma pedidos por correo de Saavedra y Prados Montes, más marketplaces activos para Miel San Galindo y Suerte Ampanera; conserva 6 sin canal actual |
| 25 | Auditoría profunda de `Venta online=no` (5/5) | 10 | 0 | 0 | 1 | ✅ | 2026-06-12 | Confirma pedido directo de Santo Mamés y Miel de Verdad, marketplace de Licinia y ecommerce de Novo Mundo; conserva 6 y cierra Madrid en 178 `sí`, 11 `no comprobado` y 34 `no` |
| 26 | Auditoría profunda de `Venta online=sí` (1) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales; actualiza los correos publicados por El Regajal y La Magdalena de Proust y corrige el dominio del correo de Gabarrera |
| 27 | Auditoría profunda de `Venta online=sí` (2) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales y añade el correo oficial de Cristo del Humilladero; conserva Marlon tras comprobar que un fallo puntual de conexión no prueba una baja |
| 28 | Auditoría profunda de `Venta online=sí` (3) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales; actualiza traslado, contacto, horario editorial, Maps y coordenadas de Kaicao y conserva Yam Yam ante un timeout transitorio |
| 29 | Auditoría profunda de `Venta online=sí` (4) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma checkout o canal remoto vigente en las 10 filas, incluida la tienda actual de Capaz; sin cambios editoriales necesarios |
| 30 | Auditoría profunda de `Venta online=sí` (5) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales; renueva teléfonos de Jesús Díaz y La Cabezuela y sustituye dos redirecciones de Facebook por sus perfiles canónicos |
| 31 | Auditoría profunda de `Venta online=sí` (6) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales, incluidos marketplace de Don Picón y pedidos remotos de Peña Rubia y Carmelitanas; sin cambios editoriales |
| 32 | Auditoría profunda de `Venta online=sí` (7) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales y sustituye la redirección antigua de Facebook de Cuarto Lote por su perfil canónico vigente |
| 33 | Auditoría profunda de `Venta online=sí` (8) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales; completa el correo de Las Moradas y sustituye el marketplace de Valleyglesias por su pedido oficial por WhatsApp |
| 34 | Auditoría profunda de `Venta online=sí` (9) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales; actualiza los WhatsApp de pedidos de Vega de San Martín y Alicia Tabernero, y corrige el canal de Vega |
| 35 | Auditoría profunda de `Venta online=sí` (10) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales, incluidos Oleum y la tienda de Vinos Laguna tras su control de edad; completa el correo de Viña Bardela |
| 36 | Auditoría profunda de `Venta online=sí` (11) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales: ocho tiendas activas y pedidos directos por teléfono o correo de Granjas Villarreal y Cafés Otero; sin cambios |
| 37 | Auditoría profunda de `Venta online=sí` (12) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales, incluidos pedidos telefónicos de Jericó y Muñoz Martín; sustituye el dominio de Cero Coffee por su URL canónica |
| 38 | Auditoría profunda de `Venta online=sí` (13) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma nueve canales, incluidos Enigma y Ecolactis pese a fallos transitorios; Aceites Oro pasa a `no comprobado` por catálogo íntegramente agotado y ficha averiada |
| 39 | Auditoría profunda de `Venta online=sí` (14) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales: checkout propio en ocho productores y pedidos vigentes por teléfono o correo de Gigorro y Prados Montes; sin cambios |
| 40 | Auditoría profunda de `Venta online=sí` (15) | 10 | 0 | 10 | 1 | ✅ | 2026-06-12 | Confirma los 10 canales, incluidos pedidos remotos de Huertos Vega, Cuerda Larga y Santo Mamés; actualiza el teléfono publicado para pedidos de El Horno de Ángeles |

## Historial

Cada lote cerrado deja su línea en la worklist (✅, fecha, nota de 1 línea); la evidencia fina va en
el mensaje de commit del lote. Detalle histórico: `git log --follow -p -- docs/madrid-verificacion.md`.
