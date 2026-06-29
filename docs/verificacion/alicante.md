# Verificación provincial de Alicante

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/comunitat-valenciana/alicante.csv`. El CSV es la fuente de verdad. La
evidencia estructurada por fila debe vivir en
`data/evidence/comunitat-valenciana/alicante.jsonl` a medida que se revise cada
lote (el fichero aún no existe; se crea en el lote 1).

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento no
lo duplica, solo fija el snapshot, las particularidades de Alicante y el plan de
lotes. Los contratos viven en `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md`
y `docs/EDITORIAL_POLICY.md`. Provincias hermanas ya cerradas o en curso de la
misma comunidad: `docs/verificacion/castellon.md` (cerrada) y
`docs/verificacion/valencia.md` (cerrada salvo cierre transversal); reutiliza sus
fuentes de cotejo (DOP/IGP/DO de la Comunitat Valenciana) y criterios.

## Estado

- Inicio: 2026-06-29.
- Snapshot inicial: **104 filas**; **0 `verificado`, 0 `parcial`, 104
  `pendiente`**.
- Venta online inicial: **0 `sí`, 0 `no`, 104 `no comprobado`**.
- `Canal de venta`: **0/104 filas informado**.
- **Particularidad de partida (clave del plan): Alicante está «virgen».** A
  diferencia de Castellón (relleno automático: 84 `sí`/75 `no`) y Valencia (103
  `parcial` heredados + 96 `sí` sin canal), aquí **nada** está revisado: todas las
  filas están en el valor por defecto (`pendiente`, `no comprobado`, sin canal).
  No hay anomalía de relleno que descontar ni `sí`/`parcial` heredados que
  reauditar, pero tampoco hay trabajo previo: **cada una de las 104 filas se
  construye desde cero**. El riesgo no es heredar un dato falso, sino promover por
  inercia; cada `verificado` exige su fuente y cada cambio de `Venta online` exige
  evidencia (no basta con dejar el `no comprobado` por defecto cuando hay canal
  real comprobable).
- Coordenadas: **79/104 con `lat`/`lon`; 25 sin**. El contrato exige coordenadas
  para `verificado` (cf. La Imperfecta en Valencia, que quedó `parcial` por
  faltarle coords). Esas 25 filas necesitarán geocodificarse (Nominatim validado
  ≤15 km contra centroide de `municipios.json`, fallback a centroide) antes de
  poder cerrarse en `verificado`.
- Imágenes: **48/104 con `imagen`, 56 sin**. Revisar imágenes **después** de
  estabilizar identidad, `slug`, fusiones y purgas.
- Enlaces iniciales: 85/104 con `web`, 74/104 con `Instagram`, 56/104 con
  `Facebook`, 83/104 con `Google Maps`, 80/104 con `telefono`, 79/104 con
  `correo`, 104/104 con `direccion`, 104/104 con `descripcion`, 7/104 con
  `horario`.
- Calidad inicial: `node scripts/audit-csv.js --mode=quality --summary-only
  data/csv/comunitat-valenciana/alicante.csv` devuelve **0 errores, 1 warning y
  65 avisos suprimidos** por opcionales ausentes. Los warnings orientan, no
  bloquean.
- Evidencia inicial: no existe `data/evidence/comunitat-valenciana/alicante.jsonl`
  y Alicante **no** está en cobertura estricta (`data/evidence/coverage.json`:
  Álava, Vizcaya, Guipúzcoa, La Rioja, Navarra, Girona, Lleida, Cantabria y
  Castellón).
- Pares con teléfono compartido detectados (posible fusión, a resolver en cierre):
  - `joan-bellod-paya-beneixama` (Aceite) ↔ `bine-i-xama-beneixama` (Frutos secos)
    — mismo teléfono `+34675436823`, mismo municipio (Beneixama).
  - `l-olivateria-bio-olives-almudaina` (Conservas) ↔ `rosa-gil-almudaina` (Fruta
    y verdura) — mismo teléfono `+34670225122`, mismo municipio (Almudaina).
- Tras lote 1 (2026-06-29): 104 filas; 12 `verificado`, 3 `parcial`, 89
  `pendiente`. Venta online: 12 `sí`, 0 `no`, 92 `no comprobado`; **12/12 `sí`
  con canal** (11 `ecommerce`, 1 `marketplace`). Coordenadas: 82/104 (geocodificadas
  Castell de la Costurera, Joan Bellod y La Rectoria de Pego con centroide). Creado
  `data/evidence/comunitat-valenciana/alicante.jsonl`: 15 registros (todos `keep`).
- Modo: primera pasada profunda. Prioridad: cerrar la calidad de las 104 filas
  heredadas antes de añadir candidatos nuevos.

## Reglas duras para Alicante

1. **Estado virgen, no «promover por inercia».** Ninguna fila está revisada: cada
   `verificado` necesita fuente propia o ficha individual fuerte; cada `parcial`
   queda con motivo explícito. El defecto `no comprobado` en venta online es el
   punto de partida correcto, pero hay que convertirlo a `sí`(+canal)/`no`/`no
   comprobado` con evidencia real, no dejarlo por comodidad cuando exista canal
   comprobable.
2. **Coordenadas para `verificado`.** 25 filas no tienen `lat`/`lon`. Antes de
   cerrar una de esas en `verificado`, geocodifica (validación ≤15 km contra
   centroide de `municipios.json`, fallback a centroide). Si no es posible fijar
   ubicación fiable, el techo es `parcial`.
3. **Bilingüismo valencià/castellano.** Municipios y nombres aparecen en ambas
   lenguas: Elche/Elx, Jijona/Xixona, Villajoyosa/La Vila Joiosa, Alcoy/Alcoi,
   Monóvar/Monòver, Hondón de las Nieves/El Fondó de les Neus, Pinoso/el Pinós,
   frente a grafías ya en valencià (Xaló, Canyada, L'Alfàs del Pi, L'Alqueria
   d'Asnar, Mutxamel, El Ràfol d'Almúnia, Sanet i Negrals). Al deduplicar y casar
   entidad, normaliza acentos **y** variante lingüística; no trates dos grafías
   del mismo municipio o marca como entidades distintas.
4. **Geo-homónimos y municipios pequeños.** Vigila el interior montañoso (El
   Comtat / la Marina): Almudaina, Balones, Quatretondeta, Benifallim, Confrides,
   Relleu, Planes, Tollos, Agres; `Canyada` (Alt Vinalopó) y `Salinas` (Alt
   Vinalopó) pueden colisionar con homónimos de otras provincias. Si un bloque cae
   lejos de su centroide, corrige `data/reference/municipios-overrides.json`; no
   muevas productores correctos. Ejecuta `check:csv` para detectar saltos >100 km.
5. **Turrón de Jijona/Xixona (IGP Jijona y Turrón de Alicante).** Los 6 turroneros
   están en «Otros». Distingue obrador/elaborador real con fábrica en Jijona de
   marca sin obrador propio. **Ojo al duplicado aparente Picó:** `turrones-pico`
   (Turrones Picó) y `turrones-hijos-de-manuel-pico` son empresas **distintas**;
   confírmalo y no fusiones. Las grandes marcas (1880 = Almendra y Miel SA, El
   Artesano, Primitivo Rovira, Pablo Garrigós Ibáñez) siguen siendo productoras;
   confirma actividad y canal real (muchas tienen ecommerce propio robusto).
6. **Chocolate de Villajoyosa.** Valor, Clavileño y Marcos Tonda son chocolateros
   históricos con fábrica en La Vila Joiosa. Confirma elaboración propia (no mera
   marca) y canal; Valor es grande pero sigue fabricando en el municipio.
7. **Bodega — DO Alicante.** Confirmar elaborador real y canal de pedido.
   Subzonas: fondillón y moscatel de la Marina Alta (Xaló, Pedreguer, Teulada),
   tintos monastrell del Vinalopó (Monóvar, Pinoso, Petrer, Villena, Algueña) y la
   Foia de Castalla/Canyada. Bocopa (Petrer) y Enrique Mendoza/Pepe Mendoza
   (L'Alfàs) son los grandes. Los cellers suelen bloquear WebFetch (age-gate,
   Cloudflare, TLS): antes de cerrar en `no`/`no comprobado`, busca tienda en
   dominio o subdominio de marca aparte.
8. **Licores.** Cantueso y herbero de la Sierra Mariola (Alcoy/zona), anís
   (Destilerías Tenis, Monforte del Cid), mistela y licores de Beneixama y Vall de
   Gallinera; reutilizan fuentes vinícolas. Confirmar destilería/elaboración propia
   frente a marca o embotellador.
9. **Aceite — DOP Aceite de la Comunitat Valenciana.** Distinguir
   almazara/elaborador de olivareros sueltos, cooperativas solo comercializadoras
   y marcas sin molino propio. Núcleo en la Montaña/El Comtat (Alfafara, Planes,
   Cocentaina, Balones, Benifallim, Torremanzanas) y Vinalopó/Vega Baja.
10. **Fruta y verdura (bloque mayor, 24 filas) y figuras de calidad de Alicante.**
    Separar productor/cooperativa con venta directa de comercializadora, almacén,
    exportador o ecommerce de reventa. Apoyan pertenencia, no actividad ni venta:
    DOP Granada Mollar de Elche y dátil del Palmeral de Elche (Baix Vinalopó); DOP
    Uva de Mesa Embolsada del Vinalopó (Novelda, Monforte, La Romana, Hondón,
    Agost); DOP Cerezas de la Montaña de Alicante (Vall de Gallinera, El Comtat);
    DOP Níspero Callosa d'en Sarrià; Vega Baja (Orihuela, Almoradí, Callosa de
    Segura): cítricos (IGP Cítricos Valencianos), alcachofa y hortícolas.
11. **Salazones y pescado.** En la costa (Santa Pola, Guardamar, Villajoyosa, El
    Campello, Dénia) separar salazonera/conservera/elaborador (p. ej. Salazones
    Roma, Villajoyosa) de lonja, cofradía, pescadería o distribuidor.
12. **Lácteos, quesos y miel.** Queserías de la Montaña/Comtat y costa; apicultura
    del interior (Salinas, Xaló, El Ràfol, L'Alqueria d'Asnar) y de Elche/Orihuela.
    Registros, ferias y directorios apoyan existencia o pertenencia, pero no
    sustituyen una fuente propia, ficha individual fuerte o perfil oficial para
    `verificado`.
13. **Productos atípicos emergentes.** Caracoles (Helix Donaire, Elche),
    espirulina (Aitana Espirulina, Guadalest), ganadería caprina (La Cabrera,
    Elche): son productores reales emergentes; se verifican con el mismo criterio,
    no se descartan por ser atípicos.
14. Un sitio HTTP, certificado roto, timeout o bloqueo no prueba baja. Contrastar
    con búsqueda, perfil oficial, Maps, registro o fuente local antes de borrar
    web, venta o fila.
15. No añadir candidatos nuevos durante esta primera pasada salvo decisión
    explícita. Primero cerrar la calidad de las 104 filas heredadas.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la comprobación de una fuente propia o ficha
real cuando la decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Marca de calidad / Agricultura GVA**: registros y contexto de productos
  amparados de la Comunitat Valenciana.
- **DO Alicante / Vinos Alicante** (consell regulador): bodegas y cellers
  inscritos; fondillón y moscatel de la Marina Alta.
- **IGP Jijona y Turrón de Alicante** (Consejo Regulador del Turrón de Jijona y
  Turrón de Alicante): turroneros amparados de Xixona.
- **DOP Aceite de la Comunitat Valenciana**: almazaras y marcas amparadas.
- **DOP Uva de Mesa Embolsada del Vinalopó**, **DOP Granada Mollar de Elche**,
  **DOP Cerezas de la Montaña de Alicante**, **DOP Níspero Callosa d'en Sarrià** y
  dátil del Palmeral de Elche: hortofrutícolas amparados.
- **IGP Cítricos Valencianos**: cotejo para cítricos de la Vega Baja.
- **CAECV** (Comité d'Agricultura Ecològica de la Comunitat Valenciana): buscador
  de operadores ecológicos; útil para existencia y municipio, no para venta.
- Comarcas y turismo: El Comtat, l'Alcoià, la Marina Alta/Baixa, Vinalopó (Alt,
  Mitjà i Baix), Vega Baja, l'Alacantí; portales gastronómicos y ferias.
- Contexto local secundario: ayuntamientos, prensa local reciente, Google Maps y
  redes oficiales; nunca como sustituto único de actividad productora si queda
  duda material.

## Plan de ejecución

Lotes agrupados por sector (y por geografía en el bloque grande de Fruta y
verdura) para reutilizar fuentes (consells reguladors, marcas DOP/IGP) y aplicar
la regla dura correspondiente. Tamaño 12–17 filas. Los lotes 1–7 cubren el
snapshot de 104 sin solaparse; el 8 es cierre transversal.

1. Lotes 1–2 (Aceite + aceitunas/aromáticas; Bodega + licores): sectores con
   consell regulador. Objetivo: crear el primer JSONL y fijar el criterio práctico
   de venta online en Alicante (todo parte de `no comprobado`).
2. Lotes 3–4 (Fruta y verdura, partida en Sur y Norte): el bloque mayor; separar
   productor de comercializadora con apoyo de las DOP del Vinalopó, Elche, Vega
   Baja y la Montaña.
3. Lote 5 (Turrón + chocolate + pan/pastelería + helados + aperitivos): el dulce
   de Jijona y Villajoyosa; obrador vs marca, confirmar canal (ecommerce fuerte).
4. Lote 6 (Lácteos y quesos + miel): núcleo rural de la Montaña/Comtat y costa.
5. Lote 7 (Cerveza + café + conservas + charcutería + pescado + otros atípicos):
   los sectores pequeños y heterogéneos.
6. Lote 8: cierre transversal. Objetivo: 0 `pendiente`, `Canal de venta` en todos
   los `sí`, los 2 pares de teléfono resueltos (fusión o entidades distintas),
   geo sin saltos, evidencia para todas las filas activas y provincia lista para
   cobertura estricta si se decide activarla.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes parten por categoría
(y geografía) en el orden actual del CSV; **congela los `slug` al iniciar cada
lote**. Si un lote fusiona o purga filas, recalcula los bloques siguientes antes
de iniciarlos. El lote 8 es auditoría transversal y puede revisar filas ya
tocadas.

| # | Lote | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Aceite + Aceitunas/encurtidos + Aromáticas | 15 | 0 | 3 | 12 | 12 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 1». 0 purgas; 12 verif, 3 parcial (Joan Bellod, La Rectoria de Pego, Selma); 12 `sí` (11 ecommerce, 1 marketplace). Web OR d'Olea .net→.com; FB rotos eliminados (Terol, Rontonar); dirección+tel de Carmencita. |
| 2 | Bodega + Licores | 15 | 15 | 0 | 0 | 0 | ⬜ | Bodega 12 (DO Alicante: Bocopa, Mendoza, Volver, Monóvar, Xaló, Faelo, Las Virtudes…), Licores 3 (Alonso, Casa Carmen, Tenis/anís). Age-gate/TLS en cellers. |
| 3 | Fruta y verdura I — Vega Baja, Vinalopó y Elche | 14 | 14 | 0 | 0 | 0 | ⬜ | Orihuela ×4, Elche ×6 (dátil/granada/palmera), Algueña, La Romana, Hondón, Agost (uva de mesa Vinalopó). DOP Granada Mollar, Uva Embolsada, IGP Cítricos. |
| 4 | Fruta y verdura II — Marina/Comtat + Frutos secos | 12 | 12 | 0 | 0 | 0 | ⬜ | FV norte 10 (Vall de Gallinera ×2 cerezas, Pedreguer, Benidoleig, Relleu, Adsubia, Agres, Almudaina=`rosa-gil`, Canyada, Sanet) + Frutos secos 2 (Bine i Xama, Vall de Seta). DOP Cerezas Montaña. |
| 5 | Turrón + chocolate + pan/pastelería + helados + aperitivos | 15 | 15 | 0 | 0 | 0 | ⬜ | Turrón Jijona 6 (Picó ≠ Hijos de Manuel Picó; 1880, El Artesano, Primitivo Rovira, Garrigós), Chocolate Villajoyosa 3, Pan 4, Helados Alacant 1, Salinitas 1. IGP Jijona. |
| 6 | Lácteos y quesos + Miel | 16 | 16 | 0 | 0 | 0 | ⬜ | Lácteos 9 (queserías Comtat/costa: Mutxamel, Callosa, Monóvar, Tibi, Alcoy, Elche ×3, Santa Pola), Miel 7 (Salinas, Elche ×2, Xaló, Orihuela, L'Alqueria d'Asnar, El Ràfol). |
| 7 | Cerveza, café, conservas, charcutería, pescado y otros | 17 | 17 | 0 | 0 | 0 | ⬜ | Cerveza 4, Café 2 (D'Origen, Jurado), Conservas 3 (incl. `l-olivateria` par de tel. con Rosa Gil L4), Charcutería 2, Pescado 2 (salazones), Otros 4 (mermeladas, Helix caracoles, espirulina, ganadería cabra). |
| 8 | Cierre transversal provincial | 104 | — | — | — | — | ⬜ | Duplicados (2 pares de tel.), bilingüismo, homónimos, canales en todos los `sí`, geocoding de las 25 sin coords, evidencia completa, imágenes y decisión de cobertura estricta. |

## Flujo por lote (resumen)

Detalle completo en `docs/VERIFICATION_TECHNIQUES.md`. Por lote:

1. `git status --short` y `npx pnpm list:province alicante` (acota con
   `--categoria` para el lote).
2. Congelar los `slug` del lote en el orden actual del CSV.
3. Priorizar: duplicados/no productores/fuera de provincia → `pendiente` con
   fuente propia fácil → canal de venta real (todo parte de `no comprobado`) →
   enlaces/municipios dudosos → geocoding de las filas sin coords del lote.
4. Investigar hasta evidencia suficiente; no recolectar opcionales que no cambien
   la decisión.
5. Editar quirúrgicamente el CSV (parser, LF, solo los `slug` del lote).
6. Crear/actualizar una línea en
   `data/evidence/comunitat-valenciana/alicante.jsonl` por cada alta de evidencia,
   cambio de `verificacion`, cambio de `Venta online`/canal, purga o fusión.
7. Validar al iterar: `npx pnpm check:csv:changed` y `npx pnpm check:evidence:changed`.
8. Cerrar el lote: `npx pnpm verify:data`.
9. Actualizar este ledger: snapshot si cambia, estado del lote, fecha y nota
   corta (verificadas, parciales, purgas/fusiones, residuales).

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada para pausar.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga/fusión tiene registro
  `purge`/`merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente; cada `no`/`no comprobado` revisado tiene razón clara.
- Las 25 filas sin coordenadas quedan geocodificadas (o documentadas como
  `parcial` por imposibilidad de ubicar).
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas como prueba
  fuerte ni horarios que remitan a canales inexistentes.
- No quedan duplicados aparentes (incluidos los 2 pares de teléfono y variantes
  valencià/castellano) sin decisión explícita; sin colisiones geográficas por
  homónimo sin override.
- Las imágenes se revisan solo tras estabilizar identidad y `slug`; al purgar una
  fila con `imagen`, se elimina el archivo referenciado si no lo usa otra fila.
- `npx pnpm verify:data` pasa antes de cerrar cada lote y antes del cierre
  provincial.
- Cuando las 104 filas iniciales queden cerradas, decidir si añadir
  `comunitat-valenciana/alicante` a `data/evidence/coverage.json` en el mismo
  cambio que complete la evidencia provincial.

## Decisiones que deben quedar especialmente anotadas

- Promociones a `verificado`: qué fuente propia, perfil oficial o ficha individual
  supera el techo de directorio/registro/DOP.
- Cualquier productor sin web propia que quede `verificado`: la fuente concreta.
- Resolución de los 2 pares de teléfono (Beneixama: Joan Bellod Payá / Bine i
  Xama; Almudaina: L'Olivatería Bio / Rosa Gil): fusión o entidades distintas, con
  motivo.
- Turrón Jijona: confirmación de que Turrones Picó e Hijos de Manuel Picó son
  empresas distintas; obrador vs marca en cada turronero.
- Almazaras, cooperativas y comercializadoras: por qué entran como
  elaborador/productor dentro de alcance o por qué se purgan.
- Bodega: tiendas propias, tiendas colectivas oficiales, age-gates y casos de
  reventa independiente descartados; fondillón/moscatel de la Marina.
- Cambios de `Venta online` desde el defecto `no comprobado` (a `sí`+canal o `no`).
- Geocodificación de filas sin coordenadas: método y validación aplicada.
- Purgas por no productor, cierre, duplicado, otra provincia o entidad sin rastro
  suficiente.
- Overrides de centroide creados para homónimos (Canyada, Salinas, municipios del
  Comtat).

## Lote 1 - Aceite + Aceitunas/encurtidos + Aromáticas

Revisión de las 15 fichas (12 `Aceite`, 1 `Aceitunas y encurtidos`, 2 `Aromáticas
y condimentos`) el 2026-06-29. Resultado editorial: 15 filas activas (0 purgas, 0
fusiones), **12 `verificado`, 3 `parcial`**; venta online **12 `sí`** (11
`ecommerce`, 1 `marketplace`), 0 `no`, 3 `no comprobado`. Creado el JSONL
provincial con 15 registros `keep`. URL y claims por fila en
`data/evidence/comunitat-valenciana/alicante.jsonl`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`, tienda propia con carrito):** Agrisanz,
  Alfaoliva (Ramón Terol), OR d'Olea, 9 Oliveres, Castell de la Costurera, Oli de
  la Torre, Rontonar, Señoríos de Relleu, Tossut dels Pouets y Carmencita. Todas
  son almazaras/elaboradores con olivar propio (o, en Carmencita, fabricante de
  especias) y tienda funcional.
- **Venta online (`marketplace`):** `cooperativa-inercomarcal-de-planes-planes`
  (marca El Olivista). Su web propia devolvió HTTP 500 en la revisión (fallo
  técnico, no baja); la compra directa a la cooperativa se canaliza por Despensa
  Mediterránea (marketplace de pequeños productores).
- **`parcial` (3):**
  - `selma-olive-oil-guardamar-del-segura`: Selma Millenary Olive Oil (Hacienda
    Cruz de Galindo). Sede comercial en Guardamar, pero el AOVE Picual se embotella
    en la **Almazara San Vicente de Villacarrillo (Jaén)**; solo aporta un coupage
    de Sierra Mariola y un olivar histórico en la Vega Baja. Sin almazara propia y
    con producto principal de otra provincia, su actividad productora Km0-Alicante
    es dudosa → techo `parcial`. Tiene tienda con carrito → venta `sí` (`ecommerce`).
  - `joan-bellod-paya-beneixama`: productor de aceite del Alt Vinalopó sin web ni
    redes; comparte teléfono `+34675436823` con `bine-i-xama-beneixama` (Frutos
    secos, Bine i Xama SL). Probable misma unidad productiva → **merge a evaluar en
    lote 4/cierre**. Apoyo solo por registro mercantil → `parcial`, `no comprobado`.
  - `desarrollos-alternativos-la-rectoria-de-pego-sl-tormos`: hierbas aromáticas,
    SL real (NIF B54197876) listada en Saborigen, sin web ni tienda → `parcial`,
    `no comprobado`.
- **`verificado` sin venta remota:** `aceitunas-cazorla-alicante`, fabricante de
  aceitunas y encurtidos desde 1958 (marcas La Explanada, La Sota, Campomar, YAK);
  web sin carrito ni canal de pedido remoto confirmado → `no comprobado`.
- **Correcciones de enlaces/contacto:** web de OR d'Olea migrada
  `ordolea.net`→`ordolea.com`; Facebook roto (`profile.php`) eliminado en Ramón
  Terol y Rontonar; dirección de Carmencita corregida a C/ Isaac Peral 46 y
  teléfono `+34965600150` añadido.
- **Geocodificación (centroide de municipio):** Castell de la Costurera (Balones,
  requisito de `verificado`), Joan Bellod (Beneixama) y La Rectoria de Pego
  (Tormos). Quedan 22/104 filas sin coordenadas para lotes posteriores.

Snapshot tras lote 1: 104 filas; 12 `verificado`, 3 `parcial`, 89 `pendiente`;
venta online 12 `sí`, 0 `no`, 92 `no comprobado`; canal 12/12; evidencia 15
registros (todos `keep`).
