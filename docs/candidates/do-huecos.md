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

Segunda ola (huecos medios, no abrir hasta cerrar la primera): Utiel-Requena y
Arroz de Valencia (Valencia), Montes de Toledo (Toledo/Ciudad Real),
Arzúa-Ulloa/Tetilla (A Coruña), queso manchego de Cuenca, DO Navarra (rural),
DOs insulares de Tenerife, Ribera del Duero soriana, Cariñena/Campo de
Borja/Calatayud (Zaragoza).

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
| 10 | DO Valdeorras + DO Monterrei | Ourense → `ourense.md` | Consejos de ambas DO | pendiente |
| 11 | DO Ribeira Sacra (solo municipios ourensanos) | Ourense → `ourense.md` | Consejo Ribeira Sacra; cruzar con `lugo.md` sin abrir Lugo | pendiente |
| 12 | DOP Jamón de Teruel | Teruel → `teruel.md` (sección nueva) | Consejo (jamondeteruel.com), secaderos | pendiente |
| 13 | DOP Aceite del Bajo Aragón + Melocotón de Calanda | Teruel → `teruel.md` (sección nueva) | Consejos de ambas DOP | pendiente |

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
- Coordinación: en la rama activa hay verificación de Burgos en curso; esta
  pasada no toca CSVs, así que no interfiere. Si al abrir un lote
  `git status --short` muestra a otro agente trabajando la provincia destino,
  elegir otro lote.
