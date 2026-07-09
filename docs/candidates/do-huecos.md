# Candidatos — DO/DOP/IGP menos cubiertas (pasada por lotes)

> Origen: análisis 2026-07-09 cruzando las principales denominaciones de origen
> españolas (vino, aceite, queso, jamón/embutido) contra los CSV por provincia,
> con conteo por categoría y por municipios del núcleo de cada denominación.
> Este documento es el **ledger de la pasada**: plan de lotes, fuentes y estado.
> Los candidatos NO viven aquí: se escriben en `docs/candidates/[provincia].md`
> con el formato estándar de `docs/candidates/README.md`. Esta pasada es de
> **descubrimiento** (fase A); la verificación e integración al CSV es fase
> aparte y sigue los 6 pasos del README de esta carpeta.

## Cómo usar este documento

1. Lee **Reglas duras de triaje** y el **Flujo por lote** (una vez).
2. Elige el primer lote `pendiente` de la **Worklist**, márcalo `en curso`.
3. Trabaja SOLO ese lote: una DO (o grupo comarcal) → una provincia destino.
4. Al terminar, actualiza la fila del lote (estado, fecha, conteos) y añade
   aprendizajes en **Estado** si los hay.
5. No toques CSVs ni otros ficheros en esta pasada: solo
   `docs/candidates/[provincia].md` y este ledger. Un commit por lote,
   tipo `Candidatos DO: lote N — <denominación>`.

## Diagnóstico (snapshot 2026-07-09)

Cobertura actual medida sobre `data/csv/**` (filas de la categoría relevante en
los municipios núcleo de cada denominación). Tamaños de registro aproximados,
a confirmar al abrir cada lote.

| Denominación | Provincia | Cobertura actual | Registro aprox. |
|---|---|---|---|
| DO Montilla-Moriles | Córdoba | 9 bodegas (7 en zona) | ~60 bodegas |
| DOP aceite Baena / Priego / Montoro-Adamuz / Lucena | Córdoba | 28 aceites (8 en núcleo DOP) | decenas de almazaras/envasadoras |
| DOP Jabugo + Sierra de Aracena | Huelva | 7 charcuterías en la sierra | ~30 industrias inscritas + secaderos |
| DO Condado de Huelva (vino y vinagre) | Huelva | 7 bodegas | ~30 bodegas |
| DOP Los Pedroches (jamón) | Córdoba | 14 charcuterías en comarca | ~30 operadores |
| DOP Sierra Mágina / Sierra de Segura / Sierra de Cazorla | Jaén | 44 aceites (15 en zonas DOP) | ~100 almazaras entre las tres |
| DO Ribeiro / Valdeorras / Monterrei (+ Ribeira Sacra ourensana) | Ourense | 26 bodegas | ~300 inscritas en conjunto |
| DOP Jamón de Teruel | Teruel | 10 charcuterías en toda la provincia | ~30 secaderos |
| DOP Aceite del Bajo Aragón + Melocotón de Calanda | Teruel | 7 aceites (1 en núcleo) | ~40 almazaras |

Segunda ola: planificada el 2026-07-09 tras cerrar la primera (lotes 1–13).
Ver **Diagnóstico segunda ola** y **Worklist de lotes (segunda ola)** más abajo.

Bien cubiertas — no buscar por ahí: Rioja, Ribera del Duero burgalesa, Toro,
Bierzo, Rías Baixas, Priorat/Montsant (Rutes del Vi ya encolado), Penedès/Cava,
quesos de Asturias/Cantabria, Idiazábal, Majorero, sidras, Guijuelo, Dehesa de
Extremadura, Cantimpalos, aceites de Estepa/Antequera/Granada, legumbres IGP.

## Reglas duras de triaje

- **Fuente primaria = registro de operadores del consejo regulador** (bodegas,
  almazaras, secaderos, industrias inscritas). Es la lista de partida, no la
  verdad: el sello DO prueba que existe y produce, no que encaje. Confirmar por
  web/GMaps que cada operador **vende al público con marca propia**.
- **Excluir**: cooperativas de servicios o secciones de crédito sin marca de
  consumo; maquila/B2B puro (cura o embotella para terceros, precedente
  Jamones Albarracín); comercializadoras/envasadoras sin producción propia;
  explotaciones ganaderas tipo registro REGA; grandes grupos industriales.
  Las cooperativas agrarias **sí** entran si venden con marca propia
  (tienda física/online o punto de venta en almazara/bodega).
- **Municipio = donde se produce**, no la sede fiscal (precedente Cumbres del
  Segura). Si la denominación cruza provincias, solo operadores de la
  provincia del lote; anotar el resto como pista para su provincia sin abrirla.
- **Dedup obligatorio antes de escribir**: `grep -i` no pliega acentos.
  Deduplicar contra el CSV por dominio raíz, teléfono normalizado y nombre sin
  acentos (snippet abajo). Resultado `already-present` se anota con su slug
  solo si aporta (p. ej. corrige web o municipio); si no, se omite.
- **Tamaño de lote: 15–25 candidatos escritos máximo.** Si el registro da para
  más, trocear por subzona/municipio y anotar en la worklist dónde se quedó el
  corte para el siguiente lote.
- **Formato de entrada** (el de esta carpeta, ver `teruel.md` como ejemplo):
  checkbox + nombre (y razón social si difiere) + categoría normalizada
  (`Bodega`, `Aceite`, `Charcutería`, `Lácteos y quesos`, `Fruta y verdura`…)
  + municipio + web/teléfono + fuente (URL del registro o ruta de búsqueda)
  + avisos `⚠` (posible grupo/duplicado, web caída, encaje dudoso). Estado
  `unverified` en la cabecera del bloque, con fecha del dedup.
- **Pistas útiles, no decisiones**: si el operador tiene tienda online, anotar
  «pista `Venta online=sí`»; la decisión se toma en fase de integración.

### Snippet de dedup (desde la raíz del repo)

```bash
python3 - <<'EOF'
import csv, re, unicodedata
PROV = 'data/csv/andalucia/cordoba.csv'   # CSV de la provincia del lote
CANDIDATOS = [                            # (nombre, web, telefono) del registro
    ("Bodegas Ejemplo", "https://www.ejemplo.es/tienda", "957 12 34 56"),
]
def norm_txt(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii','ignore').decode()
    return re.sub(r'[^a-z0-9]+',' ', s.lower()).strip()
def norm_web(u):
    u = (u or '').lower().strip()
    u = re.sub(r'^https?://(www\.)?','',u)
    return u.split('/')[0]
def norm_tel(t):
    t = re.sub(r'\D','', t or '')
    return t[-9:] if len(t) >= 9 else t
rows = list(csv.DictReader(open(PROV, newline='', encoding='utf-8')))
idx_web = {norm_web(r['web']): r['slug'] for r in rows if r['web']}
idx_tel = {norm_tel(r['telefono']): r['slug'] for r in rows if r['telefono']}
idx_nom = {norm_txt(r['nombre']): r['slug'] for r in rows}
for nom, web, tel in CANDIDATOS:
    hits = set()
    if norm_web(web) in idx_web: hits.add(idx_web[norm_web(web)])
    if norm_tel(tel) in idx_tel: hits.add(idx_tel[norm_tel(tel)])
    if norm_txt(nom) in idx_nom: hits.add(idx_nom[norm_txt(nom)])
    print(('DUP  ' + ','.join(sorted(hits))) if hits else 'NEW  ', nom)
EOF
```

## Flujo por lote

1. **Abrir la fuente**: localizar el registro de operadores en la web oficial
   del consejo regulador (búsqueda: `consejo regulador <DO> bodegas|almazaras|
   secaderos inscritos`). Confirmar el dominio oficial — los de la worklist
   son orientativos. Si el consejo no publica listado, fuentes alternativas
   por este orden: web de la DO/ruta oficial de turismo, listados de la
   consejería autonómica, directorios sectoriales; anotar la ruta usada.
2. **Volcar la lista bruta** (nombre, municipio, web/teléfono si los da) al
   scratchpad de la sesión, no al repo.
3. **Dedup** contra el CSV de la provincia con el snippet de arriba; apuntar
   los `already-present` relevantes.
4. **Triar** cada operador nuevo con las reglas duras (vendible, marca propia,
   municipio de producción, categoría) y quedarse con 15–25.
5. **Escribir** las entradas en `docs/candidates/[provincia].md`. Si el
   fichero no existe, crearlo con cabecera de origen (fuente, fecha, estado
   `unverified`, método de dedup). Si existe (caso `teruel.md`), añadir una
   sección nueva `## <DO> (lote N de do-huecos)` sin tocar lo anterior.
6. **Cerrar el lote**: actualizar la fila de la worklist (estado ✅, fecha,
   `brutos → nuevos tras dedup → escritos`), anotar aprendizajes en Estado,
   commit de los dos ficheros de docs.
7. **No integrar en el mismo lote.** La integración (verificar, fila de 20
   columnas, evidencia JSONL, `check:csv:changed`, `verify:data`) sigue el
   README de esta carpeta y puede hacerla otro agente/sesión.

## Worklist de lotes (primera ola)

| Lote | Denominación | Provincia → destino | Fuente de partida (confirmar dominio) | Estado |
|---|---|---|---|---|
| 1 | DO Montilla-Moriles | Córdoba → `cordoba.md` | Consejo Regulador (montillamoriles.es), registro de bodegas | ✅ 2026-07-09 (54 brutos → 45 tras dedup → 24 escritos) |
| 2 | DOP Baena + Priego de Córdoba (aceite) | Córdoba → `cordoba.md` | Consejos DOP Baena y DOP Priego de Córdoba | ✅ 2026-07-09 (33 brutos → 29 tras dedup → 24 escritos; 4 envasadoras Priego diferidas) |
| 3 | DOP Montoro-Adamuz + Lucena (aceite) | Córdoba → `cordoba.md` | Consejos de ambas DOP | ✅ 2026-07-09 (~15 brutos → 11 tras dedup → 11 escritos) |
| 4 | DOP Los Pedroches (jamón) | Córdoba → `cordoba.md` | Consejo DOP Los Pedroches, operadores inscritos | ✅ 2026-07-09 (20 brutos → 8 tras dedup → 8 escritos) |
| 5 | DOP Jabugo + secaderos Sierra de Aracena | Huelva → `huelva.md` | Consejo DOP Jabugo, industrias inscritas | ✅ 2026-07-09 (28 brutos → 26 tras dedup → 16 escritos; ~10 grupos/mataderos excluidos) |
| 6 | DO Condado de Huelva (vino y vinagre) | Huelva → `huelva.md` | Consejo Regulador Condado de Huelva | ✅ 2026-07-09 (31 brutos → 24 tras dedup → 13 escritos + 8 coops + 3 dudosas en nota; enriquecido) |
| 7 | DOP Sierra Mágina (aceite) | Jaén → `jaen.md` | Consejo (sierramagina.org), almazaras | ✅ 2026-07-09 (18 brutos → 16 tras dedup → 16 escritos) |
| 8 | DOP Sierra de Segura + Sierra de Cazorla (aceite) | Jaén → `jaen.md` | Consejos de ambas DOP | ✅ 2026-07-09 (34 brutos → 30 tras dedup → 25 escritos + 4 resto + 1 excluido; corte por tope) |
| 9 | DO Ribeiro | Ourense → `ourense.md` | Consejo (ribeiro.wine), adegas inscritas | ✅ 2026-07-09 (89 brutos → 83 tras dedup → 24 escritas con web; ≈59 en nota) |
| 10 | DO Valdeorras + DO Monterrei | Ourense → `ourense.md` | Consejos de ambas DO | ✅ 2026-07-09 (≈53 brutos → ~37 tras dedup → 25 escritas; resto en nota) |
| 11 | DO Ribeira Sacra (solo municipios ourensanos) | Ourense → `ourense.md` | Consejo Ribeira Sacra; cruzar con `lugo.md` sin abrir Lugo | ✅ 2026-07-09 (CSV oficial 89 → 16 en Ourense → 13 escritas; ~73 son de Lugo) |
| 12 | DOP Jamón de Teruel | Teruel → `teruel.md` (sección nueva) | Consejo (jamondeteruel.com), secaderos | ✅ 2026-07-09 (47 marcas → 23 secaderos escritos; distribuidores/grandes grupos excluidos) |
| 13 | DOP Aceite del Bajo Aragón + Melocotón de Calanda | Teruel → `teruel.md` (sección nueva) | Consejos de ambas DOP | ✅ 2026-07-09 (27 aceite→15 Teruel + 2 melocotón; 10 aceite y 3 melocotón son de Zaragoza) |

## Diagnóstico segunda ola (snapshot 2026-07-09)

Medido sobre `data/csv/**` al cerrar la primera ola. Mismas reglas duras y mismo
flujo por lote que la primera; los tamaños de registro son aproximados, a
confirmar al abrir cada lote.

| Hueco | Provincia | Cobertura actual | Registro aprox. |
|---|---|---|---|
| DOP Montes de Toledo (aceite) | Toledo | 9 aceites en toda la provincia | ~50 almazaras (parte toledana) |
| DOP Montes de Toledo + Aceite Campo de Montiel | Ciudad Real | 7 aceites | decenas |
| DOP Arzúa-Ulloa + Queixo Tetilla | A Coruña | 19 queserías (15 filas en comarca Arzúa-Melide) | ~20 queserías DOP en la provincia |
| DOP Queso Manchego (parte conquense) | Cuenca | 13 queserías | decenas inscritas |
| 5 DO insulares (Tacoronte-Acentejo, Valle Güímar, Valle Orotava, Ycoden-Daute-Isora, Abona) | S.C. Tenerife | 28 bodegas | ~80–100 inscritas |
| DO Navarra (bodegas, huecos rurales) | Navarra | 30 bodegas | ~90 inscritas |
| DO Cariñena + Campo de Borja + Calatayud | Zaragoza | 40 bodegas (las grandes ya están) | ~100 entre las tres |
| DO Utiel-Requena + DOP Arroz de Valencia | Valencia | 42 filas en la zona U-R (todas las categorías); 8 menciones de arroz | ~90 bodegas + molinos de arroz |
| Ribera del Duero soriana | Soria | 17 bodegas | ~25 en la parte soriana |

Colas de la primera ola con **datos ya en mano** (lotes baratos): Ribeira Sacra
de Lugo (~73 adegas del CSV oficial volcado en el lote 11), empresas zaragozanas
del Bajo Aragón/Melocotón (13, capturadas en el lote 13), corte 2 del Ribeiro
(~59 colleiteiros), resto de Valdeorras (~19) y Monterrei (12).

**Mini-colas que NO abren lote** (ya están anotadas con datos en su fichero de
candidatos; se resuelven en fase de integración): resto Segura (4, en `jaen.md`),
envasadoras de Priego (4, en `cordoba.md`), cooperativas del Condado (8, en
`huelva.md`), cooperativas de Montilla-Moriles (6, en `cordoba.md`).

## Worklist de lotes (segunda ola)

Primero las colas con datos en mano (14–17), después descubrimiento nuevo
ordenado por tamaño de hueco (18–26).

| Lote | Denominación / cola | Provincia → destino | Fuente de partida | Estado |
|---|---|---|---|---|
| 14 | DO Ribeira Sacra — adegas de Lugo (cola lote 11) | Lugo → `lugo.md` (sección nueva) | CSV oficial ya volcado (`ribeirasacra.org/bodegas_csv.php`) | ✅ 2026-07-09 (88 brutos → 70 en Lugo → 48 tras dedup → 24 escritas; ~23 colleiteiros en corte 2, Damm excluida) |
| 15 | Aceite Bajo Aragón + Melocotón de Calanda — empresas de Zaragoza (cola lote 13) | Zaragoza → `zaragoza.md` (nuevo) | Datos capturados en lote 13 (aceitedelbajoaragon.es, melocotondecalanda.com) | ✅ 2026-07-09 (11 aceite + 6 melocotón Zaragoza → 7 ya en CSV → 8 escritas; comarca ya bastante cubierta) |
| 16 | DO Ribeiro — corte 2 (colleiteiros restantes, ~59) | Ourense → `ourense.md` | Fichas `ribeiro.wine` (método fetch del lote 9) | ✅ 2026-07-09 (89 registro − 30 tratados = 59 → 24 con web propia escritas; ~34 sin dominio en nota corte 3) |
| 17 | DO Valdeorras (registro completo, resto ~19) + DO Monterrei resto (12) | Ourense → `ourense.md` | Consejo Valdeorras (listado completo) + fichas Monterrei | ◐ 2026-07-09 (Monterrei resto 13 escritas; **Valdeorras resto ~19 DIFERIDO** — listado JS/age-gate, necesita PDF o navegador) |
| 18 | DOP Montes de Toledo (aceite) — parte toledana | Toledo → `toledo.md` (nuevo) | Consejo (**domontesdetoledo.com**), almazaras/envasadoras | ✅ 2026-07-09 (30 certificados → 7 ya en CSV + 5 son de Ciudad Real → 19 Toledo escritos; pista CR anotada para lote 19) |
| 19 | DOP Montes de Toledo (parte CR) + DOP Aceite Campo de Montiel | Ciudad Real → `ciudad-real.md` (nuevo) | Consejo Montes de Toledo + **coop. 2º grado Campo de Montiel** (el consejo no publica registro) | ✅ 2026-07-09 (**hueco menor del estimado**: 7 netos — 2 Montes de Toledo + 5 socias Campo de Montiel con ⚠ maquila; +3 pistas fuera de DOP; Montes Norte excluido) |
| 20 | DOP Arzúa-Ulloa + DOP Queixo Tetilla (queserías coruñesas) | A Coruña → `a-coruna.md` (nuevo) | `queixotetilla.org/nuestros-elaboradores/` (**arzua-ulloa.org muerto**) | ✅ 2026-07-09 (**sin hueco real**: 10 coruñesas en Tetilla → 7 ya en CSV, 1 gran grupo → **2 escritas**; Arzúa-Ulloa sin registro público; +3 pistas otras provincias) |
| 21 | DOP Queso Manchego — queserías de Cuenca | Cuenca → `cuenca.md` (nuevo) | Consejo (`quesomanchego.es/en/manufacturers/`, JSON en `wp-json/…/pages/10148`) | ✅ 2026-07-09 (65 inscritas 4 prov. → 12 Cuenca → 7 en CSV + **2 alias** → **3 escritas**; +7 correcciones a filas y pistas Toledo 7 / CR 4 / Albacete 5) |
| 22 | 5 DO insulares de Tenerife (vino) | S.C. Tenerife → `santa-cruz-de-tenerife.md` (sección nueva) | Consejos insulares / Casa del Vino de Tenerife | pendiente |
| 23 | DO Navarra — bodegas (huecos rurales) | Navarra → `navarra.md` (sección nueva) | Consejo (navarrawine.com), bodegas inscritas | pendiente |
| 24 | DO Cariñena + Campo de Borja + Calatayud | Zaragoza → `zaragoza.md` | Consejos de las tres DO | pendiente |
| 25 | DO Utiel-Requena + DOP Arroz de Valencia | Valencia → `valencia.md` (nuevo) | Consejos (utielrequena.org, arrozdevalencia.org) | pendiente |
| 26 | Ribera del Duero soriana — resto del registro | Soria → `soria.md` (nuevo) | Consejo Ribera del Duero, filtro municipios sorianos | pendiente |

Avisos ya conocidos para esta ola: (a) lote 14 — cruzar contra `lugo.md`
existente (pasada de capitales, aún sin commitear) antes de escribir; (b) lote
15/24 comparten destino `zaragoza.md`: el que abra segundo añade sección sin
tocar la del primero; (c) lote 20 — Tetilla ampara toda Galicia: solo operadores
de A Coruña, anotar el resto como pista sin abrir; (d) lote 21 — riesgo alto de
homónimos de queserías manchegas entre Cuenca/Toledo/Ciudad Real/Albacete
(cuidar slug y provincia); (e) lote 26 — hueco menor: si al abrir el registro la
parte soriana ya está ≥80% cubierta, cerrarlo como «sin hueco real» y no forzar
candidatos.

## Estado

- 2026-07-09: pasada creada tras el análisis de cobertura DO. Ningún lote
  abierto. Los ficheros destino `cordoba.md`, `huelva.md`, `jaen.md` y
  `ourense.md` no existen aún (se crean en su primer lote); `teruel.md` existe
  (pasada de capitales 2026-07-08) y se amplía con secciones nuevas.
- 2026-07-09: **lote 1 (DO Montilla-Moriles) cerrado.** Fuente: registro de
  operadores del Consejo (paginado por JS, solo rinde 6 por página vía WebFetch)
  + directorio *We Love Montilla Moriles* (37 bodegas + 17 lagares + 8 tonelerías)
  como lista bruta completa. Ya en `cordoba.md` nuevo (creado en este lote): 24
  candidatos `unverified`. Excluidas por dedup 9 filas ya en CSV (Alvear, Robles,
  El Monte, Hathor, La Aurora, Ruiz-Canela, La Primilla, Los Raigones, Montes y
  Compañía) y las 8 tonelerías (B2B, no vendible). Aprendizajes: (a) el listado
  oficial es JS-paginado, usar el directorio *welove* como bruto; (b) fuerte
  aviso de **grupo Pérez Barquero** (Gracia Hermanos / Cía. Vinícola del Sur /
  Tomás García) — resolver marcas antes de crear varias filas; (c) 6 cooperativas
  (C) y Navisa (graneles) quedan como triaje aparte en fase de integración.
- 2026-07-09: **lote 2 (DOP Baena + DOP Priego de Córdoba, aceite) cerrado.**
  Fuentes limpias con web por entidad: `dobaena.com/nuestras-empresas-y-marcas/`
  (17) y `dopriegodecordoba.es/empresas-aove/` (10 almazaras + 6 envasadoras).
  Dedup por dominio+nombre: 4 ya en CSV (Peña de Baena, Guadalupe, Almazaras de
  la Subbética, Gomeoliva). Escritas 24 almazaras con producción propia (15
  Baena + 9 Priego) en `cordoba.md`. Aprendizajes: (a) casi todas son
  cooperativas olivareras con marca propia → entran, pero confirmar que no sean
  solo graneles/servicios; (b) dos homónimos «Olivarera San Isidro» (Baena vs
  Fuente Tójar) y colisión de marca «Monteoliva» (Cabra DOP Baena vs Monteoliva
  Cordobesa de Montilla ya en CSV) → cuidar slug; (c) 4 envasadoras/
  comercializadoras de Priego (Vizcántar, Legatum, Olivasi, XY) diferidas como
  nota, a triar por producción propia (posible corte siguiente).
- 2026-07-09: **lote 3 (DOP Aceite de Lucena + DOP Montoro-Adamuz) cerrado.**
  Lucena: registro `dolucena.es` (8 inscritas); Montoro-Adamuz sin listado web
  limpio, reconstruido de fuentes del consejo/DCOOP. 11 escritos. Aprendizajes:
  (a) **Aceites Fuente Grande (Lucena) = grupo Gomeoliva** (ya en CSV) → excluida;
  (b) 5 de las 7 cooperativas de Montoro-Adamuz son del **grupo DCOOP/Cordoliva**
  (granel/B2B): confirmar marca de consumo propia antes de integrar (Madre del Sol
  es la más fuerte, marca «Olivar de Sierra»); (c) «La Unión de Montilla» cruza con
  el lote 1 (misma coop hace vino y aceite) → decidir 1 o 2 filas.
- 2026-07-09: **lote 4 (DOP Los Pedroches, jamón) cerrado.** Fuente:
  «Industrias adscritas» del consejo (20 con web). **Comarca ya muy cubierta**:
  12/20 ya en CSV → solo 8 net-new escritos. Aprendizajes: (a) dedup por dominio
  fue decisivo (nombres razón social ≠ nombre CSV); (b) **COVAP** es gran grupo
  cooperativo con marca de consumo fuerte → listado con ⚠, decisión de tamaño
  diferida a integración; (c) «La Embajada del Jamón» posible comercializadora,
  confirmar secadero propio.
- 2026-07-09: **lotes 5, 6 y 7 cerrados** (Huelva y Jaén; `huelva.md` y `jaen.md`
  creados). **Nota de método:** los registros oficiales de estos tres consejos
  (`dopjabugo.es`, `docondadodehuelva.es`, `sierramagina.org`) bloquean el fetch
  anónimo (403/404) y los dos MCP de navegador no estaban disponibles (extensión
  Chrome sin conectar; Control Chrome sin permiso de automatización de macOS). Se
  reconstruyeron desde: la página `/en/bodegas/` de Jabugo (sí responde, 28
  empresas), directorio Apolo y Baco para el Condado (31 bodegas) y buscador +
  `degustajaen`/`aove.sierramagina.org` para Sierra Mágina (16 marcas).
  Aprendizajes: (a) **lote 5 Jabugo** — muchas inscritas son **grandes grupos**
  (ElPozo, Cinco Jotas/Sánchez Romero Carvajal, Loriente Piqueras, Montesierra,
  Industrias Reunidas) o **mataderos** B2B → excluidos por regla dura; quedan 16
  secaderos familiares. Falso positivo de dedup: «Jamones Lazo» matcheó USISA por
  «sa**lazo**nera» (es NEW). (b) **lote 6 Condado** — el consejo ampara también
  Vinagre y Vino Naranja del Condado (mismas bodegas): anotar al verificar; 8
  cooperativas van en nota (confirmar marca vs granel). (c) **lote 7 Sierra
  Mágina** — casi todo cooperativas con marca propia de AOVE; listadas con su
  marca comercial para facilitar encontrar web en verificación.
- 2026-07-09: **pasada de enriquecimiento** (Chrome ya disponible) sobre los
  lotes 5, 6 y 7. Se añadieron web + teléfono + marca comercial a **todos** los
  candidatos de Jabugo (16/16) y Sierra Mágina (16/16), casi todos con tienda
  online (pista `Venta online=sí`). Hallazgos que cambian el triaje: (a) **Hnos
  Castaño Fernández** (Jabugo) usa la marca «Tartessos» → **probable duplicado**
  de «Jamones Tartessos» ya en CSV (verificar; corregiría municipio a Cumbres
  Mayores); (b) Condado: **Clemente Neble** está **extinguida** (excluida),
  **Doñana** y **Espina** parecen marcas de bodegas ya en CSV (Privilegio del
  Condado y Sauci) → movidas a nota de dudosas; (c) **Jamones Benito e Hijos**
  (Jabugo) sin web confirmada (posible confusión con Ibéricos Benito de Arahal).
  Las bodegas pequeñas de Bollullos (Camacho, Acosta, Juncales, J. y M. Martín,
  Escolar, Manzanillera) no tienen web localizable: marcadas «sin web, confirmar».
- 2026-07-09: **lote 8 (DOP Sierra de Segura + DOP Sierra de Cazorla) cerrado.**
  Registros leídos del **directorio oficial vía navegador** (Chrome): Segura
  `dosierradesegura.com` (24 almazaras con municipio+tel) y Cazorla
  `desierracazorla.es` (10 con web+tel). 30 net-new → escritos 25 (7 Cazorla +
  18 Segura), 4 Segura en «resto» y Jaencoop excluido (gran grupo). Aprendizajes:
  (a) el dedup por nombre da **muchos falsos positivos por homónimos** en Jaén
  (varios «San Isidro Labrador», «San Francisco», «San Marcos», «La Vicaría» en
  municipios distintos) → verificados uno a uno, dup real solo Potosí 10 (Segura)
  y Encarnación/Vadolivo/La Bética (Cazorla); (b) las almazaras de Cazorla traen
  web propia en el registro (10/10); las de Segura solo tel, enriquecidas las
  marcas notables (Oro Tradicional, Sierra de Génave, Cortijo La Zarza, The Green
  Gold «Oh!», Chorro de Oro); (c) municipio de The Green Gold resuelto: Hornos de
  Segura.
- 2026-07-09: **lote 9 (DO Ribeiro) cerrado.** `ourense.md` creado. Registro
  grande (89 adegas/colleiteiros en `ribeiro.wine`); leído vía navegador y
  **enriquecido en el mismo paso**: web propia, municipio (de la dirección real,
  no la sede del consejo) y coordenadas extraídos de cada ficha con `fetch`
  same-origin en lote. Escritas 24 adegas consolidadas con web; ≈59 (colleiteiros)
  en nota para cortes siguientes. Aprendizajes: (a) las fichas del consejo traen
  web+dirección+coords → gran atajo para enriquecer Galicia; (b) ⚠ **Casar de
  Vide** es del Grupo Matarromera y **GRM** es Grupo Reboreda-Morgadío (grupos
  grandes) → marcados; (c) ⚠ **Dominio do Bibei** figura en Ribeiro pero es
  sobre todo Ribeira Sacra → lote 11, cuidar dup.
- 2026-07-09: **lote 10 (DO Valdeorras + DO Monterrei) cerrado.** Valdeorras:
  el listado web carga por JS con age-gate → usado el **PDF oficial** (24 bodegas
  con web; registro completo ~43, resto por volcar). Monterrei: directorio web
  (29 adegas), municipio por CP de cada ficha; las fichas **no** traen web propia
  (solo la ruta del vino) → webs buscadas aparte para las 10 escritas. 25 escritas
  (15 Valdeorras + 10 Monterrei), resto en nota. Aprendizajes: (a) concello por
  bodega de Valdeorras quedó a confirmar (el PDF no lo da limpio); (b) ⚠ **Jorge
  Ordóñez** (négociant/grupo Málaga) y **Terras do Cigarrón** (grupo Adegas
  Galegas/Martín Códax) marcados por posible grupo; (c) Tabú es de Oímbra (no
  Verín), corregido.
- 2026-07-09: **lote 11 (DO Ribeira Sacra, municipios ourensanos) cerrado.**
  Chrome se cayó a mitad, pero se localizó el **endpoint CSV oficial del consejo**
  (`ribeirasacra.org/bodegas_csv.php?idioma=es`, delimitador `;`, provincia
  embebida en la dirección). Filtrado a Ourense: 16 adegas (subzonas Ribeiras do
  Sil, Quiroga-Bibei y 2 en A Peroxa); 3 dups → 13 escritas. **~73 adegas son de
  Lugo** → pista para `lugo.md`, sin abrirlo. Resuelto el cruce del lote 9:
  **Dominio do Bibei** es Ribeira Sacra (Manzaneda), tratado aquí. ⚠ Colisión de
  marca «Alodio» entre Bodegas Costoya y Adega Cachín (ambas A Teixeira). Truco:
  muchos consejos exponen un CSV/endpoint de descarga aunque la web sea JS.
- 2026-07-09: **lotes 12 y 13 (Teruel) cerrados → primera ola COMPLETA (1–13).**
  Lote 12: «Nuestra Gente» del consejo del jamón trae las marcas con web; 47
  enlaces → filtrados distribuidores y grandes grupos (Espuña, Noel, Vall
  Companys, Eroski, Térvalis-Airesano, Arco Iris, La Garriga, Los Alcores…) y los
  ya listados (Rokelin, Las Torres, Albarracín, La Serranía, Aragonia, Sierra
  Palomera) → 23 secaderos net-new con web (municipio a confirmar en su mayoría).
  ⚠ **Centelles y Buj** aparece en Jamón de Teruel y en DOP Jabugo (lote 5):
  cuidar duplicado entre provincias. Lote 13: página de productores del Aceite del
  Bajo Aragón con dirección/tel/marca → 15 almazaras de Teruel (10 son de
  Zaragoza, pista para `zaragoza.md`); melocotón comparte cooperativas con el
  aceite (una sola fila) + 2 frutícolas específicas; 3 comercializadoras de
  melocotón son de Zaragoza. `teruel.md` (que estaba sin commitear de la pasada de
  capitales) queda versionado con estas dos secciones nuevas.
- 2026-07-09: **segunda ola planificada** (lotes 14–26, ningún lote abierto).
  Diagnóstico medido sobre los CSV: los huecos grandes son aceite de Montes de
  Toledo (9 aceites en Toledo, 7 en CR), quesos Arzúa-Ulloa/Tetilla (A Coruña),
  manchego de Cuenca y las 5 DO insulares de Tenerife (28 bodegas vs ~80–100
  inscritas). Utiel-Requena resultó **más cubierto de lo esperado** (42 filas en
  la zona) → baja prioridad (lote 25); Ribera soriana ya tiene 17 bodegas →
  lote 26 con permiso explícito de cerrarse como «sin hueco real». Lotes 14–17
  son colas de la primera ola con datos en mano (baratos). Las mini-colas
  (Segura, envasadoras Priego, coops Condado/Montilla) NO abren lote: se
  resuelven en integración. Reglas duras y flujo por lote: los mismos de la
  primera ola.
- 2026-07-09: **lote 14 (Ribeira Sacra, adegas lucenses) cerrado.** Reusado el
  endpoint CSV del consejo (lote 11): 88 brutos → 70 en Lugo (18 de Ourense, ya
  tratadas). Dedup mejorado (sufijos societarios S.L./C.B./S.A.T. + marca sin
  acentos): 22 ya en `lugo.csv` (Algueira, Tear, Petrón, Finca Míllara, Proencia,
  Guímaro, Moure/Abadía da Cova, Regina Viarum, Rectoral de Amandi, Nogueira,
  Cabo do Mundo, Val de Quiroga, Lareu, Vía Romana, Alma das Donas, Casa
  Moreiras, Don Bernardino, Adega Cruceiro, Pazo de la Cuesta, Atrium Vitis,
  Lucenza, Condado de Sequeiras) → 48 net-new. Escritas **24** (con web/marca
  consolidada) en `lugo.md`; ~23 micro-colleiteiros de nombre personal sin web
  en nota «corte 2» (repesca futura). **Adega Damm** (grupo Estrella Damm)
  excluida. Aprendizajes: (a) el header del CSV trae entidades HTML con `;`
  (`DIRECCI&OACUTE;N`) que rompen el split → cabecera manual; (b) el dedup de
  Ribeira Sacra necesita plegar sufijos societarios y comparar por marca
  comercial (muchas filas del CSV usan la marca, no la razón social); (c) ⚠
  colisión de marca «Castro Candaz» entre Virxen dos Remedios, Bodegas
  CastroCandaz y Martín Códax → resolver titularidad al verificar.
- 2026-07-09: **lotes 15, 16 y 17 abiertos** (colas de la primera ola).
  **Lote 15 (Zaragoza)**: `zaragoza.md` creado. Registros del Consejo Aceite del
  Bajo Aragón (`aceitedelbajoaragon.es/productores/`, 11 empresas zaragozanas) y
  Melocotón de Calanda (`melocotondecalanda.com/autenticos-productores/`, 6). La
  comarca Caspe/Maella/Belchite ya está bastante en CSV → 7 ya presentes, 8
  escritas. Solapan aceite↔melocotón: Coop. San Lorenzo/Magalia (ya en CSV) y
  Frutícola Maellana/Fruma (nueva). **Lote 16 (Ribeiro corte 2)**: reusado el
  `fetch` de fichas del lote 9 sobre las 59 restantes de
  `ribeiro.wine/es/bodegas-y-colleiteiros`; 24 con dominio propio escritas, ~34
  colleiteiros sin web propia (solo enlace footer `wineinmoderation.eu`) en nota
  corte 3; Dominio do Bibei fuera (es Ribeira Sacra). **Lote 17 (Monterrei/
  Valdeorras corte 2)**: Monterrei resto 13 escritas (12 de la nota + Valderello
  nueva) con teléfono de ficha `/bodegas/<slug>/`; ⚠ Minius = marca de Adegas
  Valmiñor. **Valdeorras resto ~19 diferido**: `dovaldeorras.gal/bodegas/` es JS
  puro tras age-gate (sin nombres en HTML ni `wp-json`, no hay CPT) → reabrir con
  el PDF del consejo o navegador. Aprendizajes: (a) Calanda expone las empresas en
  `/autenticos-productores/` (HTML) aunque `/empresas/` sea JS; (b) las fichas de
  Monterrei muestran la dirección/web del **consejo**, no la de la adega (solo el
  teléfono es propio); (c) el enlace `wineinmoderation.eu` en las fichas del
  Ribeiro es del footer, no la web de la bodega.
- 2026-07-09: **lote 18 (DOP Montes de Toledo, aceite — parte toledana) cerrado.**
  `toledo.md` creado. El dominio de la worklist (`mtoledo.org`) no resuelve; el
  real es **`domontesdetoledo.com`** (bloquea sin UA de navegador). Fuente limpia:
  «Empresas certificadas» (30 en vigor) + ficha `/slug/` por empresa con dirección
  completa, web y email. De 30: 7 ya en CSV, **5 son de Ciudad Real** (Malagón,
  Grupo Montes Norte, El Progreso/Villarrubia, Dehesa El Molinillo/Retuerta,
  Judisan-Moraga → anotados como pista para el lote 19, que comparte esta DOP) y
  **19 escritos de Toledo**. Aprendizajes: (a) la DOP cruza provincia → filtrar por
  municipio de la ficha, no por el consejo; (b) ⚠ IFAMA es del grupo Arzuaga
  Navarro; (c) ⚠ el consejo enlaza la ficha de «Aceites Toledo S.A.» (Los Yébenes)
  bajo la entrada «Coop. Ntra. Sra. de la Antigua de Mora» → escrito con aviso de
  verificar si es operador propio; (d) homónimos de cooperativas «San Sebastián» y
  «Ntra. Sra. de la Antigua» en varios municipios → cuidar slug/municipio.
- 2026-07-09: **lote 19 (Montes de Toledo parte CR + Campo de Montiel) cerrado.**
  `ciudad-real.md` creado. **Hueco muy menor del estimado** (el diagnóstico decía
  «decenas»; salen 7 netos). Montes de Toledo: de los 5 certificados de CR
  (capturados ya en el lote 18), 1 en CSV (Aceites Malagón), 1 excluido por gran
  grupo (**Grupo Montes Norte**, ~50 M kg/año, 8 coops), 1 ya presente como bodega
  (**Coop. El Progreso**, Villarrubia — doble faceta vino/aceite, decidir fila) →
  **2 netos** (Aceites Moraga/Judisan en Fuente el Fresno; Dehesa El Molinillo en
  Retuerta del Bullaque). Campo de Montiel: **el consejo no publica registro**
  (`dopaceitecampodemontiel.es` con «Listado de almazaras» y «Envasadores» vacíos
  desde 2018; JCCM caída; MAPA solo da la asociación). Vía que funcionó: la
  **cooperativa de 2º grado** (`campodemontiel.com/socios/`), que agrupa las 6
  almazaras de la comarca y **comercializa el aceite de todas** → 1 ya en CSV
  (Fábrica de Aceites San Sebastián) y **5 socias escritas con ⚠ fuerte**: la marca
  y la tienda son de la 2º grado (ya en CSV), así que probablemente son maquila/B2B
  → confirmar marca propia antes de integrar o descartarlas por regla dura.
  Aprendizajes: (a) cuando el consejo no publica registro, la **cooperativa de 2º
  grado / comercializadora comarcal** es el mejor sustituto, pero cuidado: revela
  justo que las socias pueden no ser vendibles; (b) **homónimos graves en CR**:
  «San Gregorio» (Almedina vs Arenales de San Gregorio) y «San Isidro (Labrador)»
  (Villanueva de la Fuente vs Torrenueva vs Pedro Muñoz) → el dedup por nombre da
  falsos positivos, comprobar municipio siempre; (c) 3 almazaras reales fuera de
  ambas DOP (Olivapalacios/Bolaños, Pago Piedrabuena/Ballesteros, COLIVAL/
  Valdepeñas) anotadas como pista provincial, no como candidatas del lote.
- 2026-07-09: **lote 20 (Arzúa-Ulloa + Queixo Tetilla, A Coruña) cerrado.**
  `a-coruna.md` creado. **Sin hueco real** (el diagnóstico esperaba ~20 queserías
  DOP vs 19 filas; la realidad es que ya estaban). *Tetilla*: registro excelente en
  `queixotetilla.org/nuestros-elaboradores/` (24 elaboradores de toda Galicia con
  dirección, CP+concello, tel, contacto y email) → 10 coruñeses, **7 ya en CSV**
  (Barral, Queizuar/Bama, Queinaga, Brexeo, Terra de Melide, Eume, Campo Capela),
  1 excluido por gran grupo → **2 escritos** (Bo-Queixo/Boqueixón, Lácteos Algra/
  As Somozas). *Arzúa-Ulloa*: **no hay registro público** — `arzua-ulloa.org` da
  500 en todas las rutas y el dominio fue **reutilizado por una academia** (visto
  en Wayback); MAPA/AGACAL/`queixosdegalicia.com` solo dan producto y contacto.
  Sus 15 inscritas se solapan con las de Tetilla y con el CSV. Aprendizajes:
  (a) ⚠ **Grupo TGT** (mayor quesero de España) posee **Lácteos Ferrado Verde**
  (excluido) **y Quesería Ruta Xacobea** (O Pino) → esta última **ya es fila del
  CSV** (`alimentos-ruta-xacobea-o-pino`): revisarla con el mismo criterio de
  tamaño; (b) el registro de Tetilla sirve de paso como censo quesero gallego →
  pistas net-new para Lugo (Queixos de Galicia S.L., ⚠ García Baquero),
  Pontevedra (Cobideza) y Ourense (Quesos da Montaña de Entrimo); (c) la **Festa
  do Queixo de Arzúa** (`festadoqueixo.org`, 80 queixarías inscritas en 2025) es
  mucho mejor cantera para A Coruña que las DOP → merece lote propio fuera de
  esta pasada. **→ Hecha el mismo día**: ver `docs/candidates/festa-do-queixo.md`
  (96 expositores, 27 ya en CSV, 7 altas gallegas; la feria resultó **nacional**,
  no coruñesa, y deja ~34 pistas de productores de otras comunidades).
- 2026-07-09: **lote 21 (DOP Queso Manchego, Cuenca) cerrado.** `cuenca.md`
  creado. Fuente óptima: `/en/manufacturers/` (las rutas `/queserias/` y
  `/fabricantes/` dan 404); la lista es un mapa Leaflet, pero el array `places`
  con **las 65 inscritas** (razón social, municipio, **provincia**, CP, tel, email,
  web, coords) viaja dentro del `content.rendered` de
  `wp-json/wp/v2/pages/10148`. Cuenca: 12 → 7 ya en CSV, **2 alias**, **3 netas**
  (Piqmar, San Pedro de Magaceda, López Espada). Aprendizajes: (a) **el aviso (d)
  de la worklist se cumplió, pero por alias, no por homónimos**: el consejo lista
  **razones sociales** y el CSV **marcas** → *S.A.T. Oveman* = Quesería Villadharo
  y *Poves Redondo S.L.L.* = Quesos La Aldea; cruzar siempre razón social ↔ marca
  (email de contacto lo delató); (b) el cruce destapó **7 correcciones a filas de
  `cuenca.csv`**: dos webs apuntan a un directorio ajeno (`gff.co.uk`), y
  `quesera-campo-rus-s-l-cuenca` tiene **slug y municipio mal** (es Santa María del
  Campo Rus); (c) como el JSON trae las 4 provincias, quedan anotadas pistas ya
  deduplicadas: **Toledo 7**, **Ciudad Real 4** (⚠ Despaña/Rocinante) y **Albacete
  5** (⚠ Lactalis y Mantequerías Arias, grandes grupos) — sin abrir esas
  provincias. Tercer lote seguido (19, 20, 21) en que **el hueco medido era mucho
  mayor que el real**: el diagnóstico contó filas de categoría, no operadores DOP.
- Coordinación: en la rama activa hay verificación de Burgos en curso; esta
  pasada no toca CSVs, así que no interfiere. Si al abrir un lote
  `git status --short` muestra a otro agente trabajando la provincia destino,
  elegir otro lote.
