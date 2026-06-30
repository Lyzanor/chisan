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
- Tras lote 2 (2026-06-29): 104 filas; 27 `verificado`, 3 `parcial`, 74
  `pendiente`. Venta online: 23 `sí`, 0 `no`, 81 `no comprobado`; **23/23 `sí`
  con canal** (21 `ecommerce`, 2 `marketplace`). Coordenadas: 83/104 (geocodificada
  Bodega Las Virtudes). Evidencia: 30 registros. Municipio de Casa Agrícola Pepe
  Mendoza corregido `L'Alfàs del Pi`→`Llíber` (unidad productiva real).
- Tras lote 3 (2026-06-29): 103 filas (1 purga: Mateo e Hijo, empresa de
  servicios agrícolas, no productor); 33 `verificado`, 7 `parcial`, 63
  `pendiente` (3 residuales sin rastro: M. Rosario García, Carla Aguilera, Frutas
  SIN). Venta online: 28 `sí`, 0 `no`, 75 `no comprobado`; **28/28 `sí` con canal**
  (26 `ecommerce`, 2 `marketplace`). Coordenadas: 84/103. Evidencia: 42 registros
  (40 `keep`, 1 `merge`, 1 `purge`). Medi Natural recategorizado a `Bodega`;
  slug de casa-agricola realineado a `-lliber`.
- Tras lote 4 (2026-06-29): 100 filas (3 bajas: 2 fusiones —joan-bellod→bine-i-xama,
  rosa-gil→l-olivateria— y 1 purga —Riera d'Agres, albergue rural). 39
  `verificado`, 9 `parcial`, 52 `pendiente` (residual sin rastro: Finca El Serrat).
  Venta online: 31 `sí`, 0 `no`, 69 `no comprobado`; **31/31 `sí` con canal** (29
  `ecommerce`, 2 `marketplace`). Coordenadas: 87/100. Evidencia: 53 registros (48
  `keep`, 3 `merge`, 2 `purge`). **Resueltos los 2 pares de teléfono detectados al inicio.**
- Tras lote 5 (2026-06-29): 100 filas; 54 `verificado`, 9 `parcial`, 37
  `pendiente`. Venta online: 40 `sí`, 0 `no`, 60 `no comprobado`; **40/40 `sí` con
  canal** (38 `ecommerce`, 2 `marketplace`). Coordenadas: 92/100. Evidencia: 68
  registros. 4 webs ajenas/aparcadas corregidas a la oficial (1880, Pablo Garrigós,
  Clavileño, Helados Alacant); confirmado Turrones Picó ≠ Hijos de Manuel Picó.
- Tras lote 6 (2026-06-29): 100 filas; 69 `verificado`, 9 `parcial`, 22
  `pendiente`. Venta online: 49 `sí`, 0 `no`, 51 `no comprobado`; **49/49 `sí` con
  canal** (47 `ecommerce`, 2 `marketplace`). Coordenadas: 94/100. Evidencia: 83
  registros. Queserías y apicultores con leche/colmenas propias; 1 pendiente sin
  rastro (María Rosario Ortega, miel Salinas).
- Tras lote 7 (2026-06-29): 99 filas (1 purga: Cervezas Spigha, cerrada); 84
  `verificado`, 10 `parcial`, 5 `pendiente`. Venta online: 58 `sí`, 0 `no`, 41 `no
  comprobado`; **58/58 `sí` con canal** (56 `ecommerce`, 2 `marketplace`).
  Coordenadas: 94/99. Evidencia: 100 registros. **Lotes de sector 1-7 cerrados;
  quedan solo 5 pendientes residuales (sin rastro) para el cierre transversal.**
- Tras lote 8 / cierre (2026-06-29): 98 filas (1 purga: Carla Aguilera SL, vínculo
  con distribuidora de fitosanitarios, no productor). **84 `verificado`, 10
  `parcial`, 4 `pendiente`**. Venta online: 58 `sí`, 0 `no`, 40 `no comprobado`;
  **58/58 `sí` con canal** (56 `ecommerce`, 2 `marketplace`). **Coordenadas: 98/98**.
  Imágenes: 47/98. Evidencia: 101 registros (94 `keep`, 3 `merge`, 4 `purge`).
  Dedup transversal sin duplicados; geo sin saltos >100 km. **PRIMERA PASADA
  PROFUNDA CERRADA.** No se añade a `coverage.json` por 4 pendientes residuales sin
  rastro digital (productores particulares a confirmar en campo/mantenimiento).
- Modo: primera pasada profunda **cerrada** (2026-06-29). El CSV sigue vivo: las
  afirmaciones dinámicas (actividad, venta online) se revisan en mantenimiento. Los
  4 pendientes residuales y los candidatos nuevos quedan para pasadas futuras.

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
| 2 | Bodega + Licores | 15 | 0 | 0 | 15 | 11 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 2». 0 purgas; 15 verif; 11 `sí` (10 ecommerce, 1 marketplace Algueña), 4 no comprobado. Pepe Mendoza→Llíber; Algueña web .com→.es; +tel Mendoza/Bocopa/Xaló; Las Virtudes geocodificada. Casa Carmen entra por licor Cirereta. |
| 3 | Fruta y verdura I — Vega Baja, Vinalopó y Elche | 14 | 3 | 5 | 6 | 5 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 3». 1 purga (Mateo e Hijo=servicios), 5 `sí` ecommerce. 3 pendientes sin rastro (M. Rosario García, Carla Aguilera/vínculo Agrofitovial, Frutas SIN). Medi Natural→Bodega. |
| 4 | Fruta y verdura II — Marina/Comtat + Frutos secos | 12 | 1 | 3 | 6 | 3 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 4». 2 merges (Joan Bellod→Bine i Xama; Rosa Gil→L'Olivateria), 1 purga (Riera d'Agres=albergue rural). 3 `sí` ecommerce. 1 pendiente (Finca El Serrat). IGP Cerezas Montaña. |
| 5 | Turrón + chocolate + pan/pastelería + helados + aperitivos | 15 | 0 | 0 | 15 | 9 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 5». 15 verif, 0 purgas; 9 `sí` ecommerce. Picó≠Hijos de Manuel Picó confirmado. 4 webs ajenas/aparcadas corregidas (1880, Garrigós, Clavileño, Helados Alacant). |
| 6 | Lácteos y quesos + Miel | 16 | 1 | 0 | 15 | 9 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 6». 15 verif, 0 purgas; 9 `sí` ecommerce. 1 pendiente (María Rosario Ortega). Melífera web→melibera.es. |
| 7 | Cerveza, café, conservas, charcutería, pescado y otros | 17 | 0 | 1 | 15 | 9 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 7». 1 purga (Spigha=cerrada), 1 parcial (Aitana Espirulina=cesó producción). 9 `sí` ecommerce. L'Olivateria recibió el merge de Rosa Gil. |
| 8 | Cierre transversal provincial | 98 | 4 | 10 | 84 | 58 | ✅ | Cerrado 2026-06-29. Detalle en «Lote 8». 1 purga (Carla Aguilera=fitosanitarios). Dedup OK, geo OK, 98/98 coords. 4 pendientes residuales sin rastro. No añadido a `coverage.json`. |

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

## Lote 2 - Bodega + Licores

Revisión de las 15 fichas (12 `Bodega`, 3 `Licores`) el 2026-06-29. Resultado
editorial: 15 filas activas (0 purgas, 0 fusiones), **15 `verificado`, 0
`parcial`**; venta online **11 `sí`** (10 `ecommerce`, 1 `marketplace`), 0 `no`, 4
`no comprobado`. URL y claims por fila en
`data/evidence/comunitat-valenciana/alicante.jsonl`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`, tienda propia con carrito):** Fondillón
  Luis XIV (Toneles Centenarios), Enrique Mendoza, Bocopa, Volver (tienda en
  vinosbodegasvolver.com), Casa Agrícola Pepe Mendoza, Monóvar (tienda del grupo
  MGWines), Bodegas Xaló, Faelo (tienda vinosladama.com), Destilerías Tenis (tienda
  palomatenis.es) y Las Virtudes.
- **Venta online (`marketplace`):** `vinos-de-alguena-alguena` (Bodega Cooperativa
  de Algueña), vía La Despensa de Alicante; su web propia tiene age-gate y el
  dominio `.com` no respondía.
- **`verificado` sin venta remota (`no comprobado`):** La Cueva de Baco (Bizum solo
  para reservas de visita, sin carrito), Cup de la Muntanya/Celler de Planes (venta
  directa y catas), Licores Alonso (botón de tienda no operativo) y Casa Carmen.
- **Corrección de municipio:** `casa-agricola-pepe-mendoza-lliber` →
  **Llíber**. Pepe Mendoza Casa Agrícola SLU (proyecto independiente del hijo,
  distinto de Bodegas Enrique Mendoza, **no se fusiona**) elabora en la Finca de
  Abargues, Pla de Lliber; las coordenadas del CSV caían a 1,8 km del centroide de
  Llíber, no de L'Alfàs (donde está solo la sede fiscal).
- **Casa Carmen (Alpatró, Vall de Gallinera):** entra como productora por el licor
  de cereza **Cirereta** que elabora con cerezas propias, además de ser tienda de
  productos de proximidad.
- **Fallos técnicos tratados como tales (no baja):** certificado TLS inválido
  (Bodegas Monóvar) o caducado (Bodegas Faelo), `.com` con ECONNREFUSED y age-gate
  (Algueña). En los tres se confirmó actividad y canal por fuentes alternativas.
- **Correcciones de enlaces/contacto:** Algueña web `.com`→`.es` (dominio
  operativo) y Facebook roto eliminado; teléfonos añadidos a Enrique Mendoza
  (+34965888639), Bocopa (+34966950489) y Xaló (+34966480034); dirección de Celler
  de Planes completada (Carrer del Vi).
- **Geocodificación:** Bodega Las Virtudes (centroide de Villena, requisito de
  `verificado`). Quedan 21/104 filas sin coordenadas.

Snapshot tras lote 2: 104 filas; 27 `verificado`, 3 `parcial`, 74 `pendiente`;
venta online 23 `sí`, 0 `no`, 81 `no comprobado`; canal 23/23; evidencia 30
registros (todos `keep`).

## Lote 3 - Fruta y verdura I (Vega Baja, Vinalopó y Elche)

Revisión de las 14 fichas de `Fruta y verdura` del sur (Orihuela ×4, Elche ×6,
Algueña, La Romana, Hondón de las Nieves, Agost) el 2026-06-29. Resultado
editorial: **6 `verificado`, 4 `parcial`, 3 `pendiente`, 1 purga**; venta online
5 `sí` (todas `ecommerce`), 0 `no`, resto `no comprobado`. URL y claims por fila en
`data/evidence/comunitat-valenciana/alicante.jsonl`.

Decisiones relevantes:

- **Purga (no productor):** `mateo-e-hijo-orihuela`. Su web (mateoehijo.com)
  revela una **empresa de servicios** agrícolas (plantación, injerto, poda,
  transporte con grúas, construcción y ferretería industrial) en La Murada, no un
  productor de fruta. Fuera de alcance; imagen eliminada.
- **Venta online confirmada (`ecommerce`):** Finca La Mollaneta (Greenmandarin,
  cítricos eco/biodinámicos DEMETER, 18 ha, tienda citricosecologicos.eu), Eco-Citric
  (cítricos eco CAAE, Orihuela), Vivir la Tierra (coop agroecológica, cestas a
  domicilio), Serrano Valero (dátiles/licores de la palmera de Elche, +140 años) y
  TodoPalmera (dátiles eco; ésta queda `parcial`).
- **`parcial` (4):** TodoPalmera (negocio mixto dátiles + jardinería/servicios;
  cultivo propio no confirmado), Uvas Amaia (uva embolsada del Vinalopó, Agost; web
  vacía/en construcción), Finca El Poliol (granada Mollar DOP, CAECV, Elche; sin
  fuente propia verificadora, el FB es un grupo) y Medi Natural (ver recategorización).
- **`verificado` sin venta remota (`no comprobado`):** Biograna SAT (granada Mollar
  eco; compra solo por formulario + transferencia, sin checkout; estacional) y Uvas
  Cabrera (uva moscatel de mesa, 5 generaciones desde 1895; web con ECONNREFUSED en
  la revisión, fallo técnico tratado como tal).
- **Pendientes residuales (3, sin rastro suficiente, a reinvestigar en el cierre):**
  `m-rosario-garcia-elche` (sin web ni rastro), `carla-aguilera-s-l-orihuela`
  (su contacto es Agrofitovial, distribuidora de fitosanitarios; sin rastro como
  productor de fruta) y `frutas-sin-orihuela` (rastro indirecto de cítricos
  naturales en La Murada, sin fuente citable). Quedan `pendiente`/`no comprobado`,
  sin registro de evidencia.
- **Recategorización:** `medi-natural-alguena` Fruta y verdura → **Bodega** (es una
  marca de vino tinto ecológico DO Alicante elaborado en Algueña; solo FB + Verema
  → `parcial`).
- **Correcciones de enlaces/contacto:** web Eco-Citric `eco-citric.es`→`ecocitric.es`;
  Facebook roto (`profile.php`) eliminado en Greenmandarin y Vivir la Tierra; web de
  Vivir la Tierra → `vivirlatierra.es`; correo ajeno eliminado en Uvas Cabrera.
- **Slug realineado (por agente paralelo):** `casa-agricola-pepe-mendoza-l-alfas-del-pi`
  → `casa-agricola-pepe-mendoza-lliber` (slug + imagen + tombstone `merge`), para
  alinear con el municipio Llíber corregido en el lote 2.
- **Geocodificación (centroide):** Biograna SAT (Elche, requisito de `verificado`) y
  Medi Natural (Algueña). Las 3 filas `pendiente` quedan sin coordenadas.

Snapshot tras lote 3: 103 filas; 33 `verificado`, 7 `parcial`, 63 `pendiente`;
venta online 28 `sí`, 0 `no`, 75 `no comprobado`; canal 28/28; evidencia 42
registros (40 `keep`, 1 `merge`, 1 `purge`).

## Lote 4 - Fruta y verdura II (Marina/Comtat + Frutos secos)

Revisión de 12 fichas (10 `Fruta y verdura` del norte + 2 `Frutos secos`) el
2026-06-29. Resultado editorial: **6 `verificado`, 3 `parcial`, 1 `pendiente`, 2
fusiones, 1 purga**; venta online 3 `sí` (todas `ecommerce`). URL y claims por fila
en `data/evidence/comunitat-valenciana/alicante.jsonl`.

Decisiones relevantes:

- **Fusiones (resuelven los 2 pares de teléfono del snapshot inicial):**
  - `joan-bellod-paya-beneixama` (Aceite, lote 1) → **`bine-i-xama-beneixama`**
    (Frutos secos): misma unidad productiva (titular Joan Bellod Payà, C/ Nueva de la
    Aurora 76, mismo teléfono y correo; Bine i Xama SL en registro). Bine i Xama
    queda `parcial` (sin web ni tienda).
  - `rosa-gil-almudaina` (Fruta y verdura) → **`l-olivateria-bio-olives-almudaina`**
    (Conservas, se verifica en el lote 7): Rosa Gil es la titular de L'Olivateria
    (mismo teléfono +34670225122, misma Almudaina; cultiva fruta y elabora olivas).
- **Purga (no productor):** `riera-d-agres-alberg-rural-agres` es un **albergue
  rural / agroturismo** (alojamiento) en Agres; los productos locales que ofrece se
  compran en tiendas. Fuera de alcance.
- **Venta online confirmada (`ecommerce`):** Cerezas de Alicante (coop, IGP Cerezas
  Montaña de Alicante; tienda + marketplace), Naranjas Masil (citricultor 3ª gen.) y
  Planeta ECO (finca eco, tienda Shopify).
- **`verificado` sin venta remota (`no comprobado`):** Mas del Masero (Fruitec SL,
  fruticultor eco desde 1950, Canyada), Agrivall (cereza eco, Vall de Gallinera) y
  Vall de Seta agroalimentaria (frutos secos, Quatretondeta). Webs con fallo técnico
  (ECONNREFUSED/TLS) tratadas como tal, no como baja.
- **`parcial`:** Bine i Xama (ver fusión), Roberto Daniel Mayordomo (fruta/cítricos
  en Adsubia; solo FB/IG) y L'Hort de Neli (horticultura eco certificada en
  Pedreguer; solo directorio Molt de Gust + prensa, sin fuente propia verificadora).
- **Pendiente residual (sin rastro, a reinvestigar en el cierre):** `finca-el-serrat-relleu`.
- **Correcciones:** web de Planeta ECO limpiada (fbclid); dirección de L'Hort de Neli
  a Partida la Xara 30; geocodificadas (centroide) Bine i Xama, Vall de Seta, Mas del
  Masero, Roberto Daniel Mayordomo y L'Hort de Neli.

Snapshot tras lote 4: 100 filas; 39 `verificado`, 9 `parcial`, 52 `pendiente`;
venta online 31 `sí`, 0 `no`, 69 `no comprobado`; canal 31/31; evidencia 53
registros (48 `keep`, 3 `merge`, 2 `purge`).

## Lote 5 - Turrón + chocolate + pan/pastelería + helados + aperitivos

Revisión de 15 fichas (6 turroneros de Jijona, 3 chocolateros de Villajoyosa, 4
pan/pastelería, 1 helados, 1 aperitivos) el 2026-06-29. Resultado editorial: **15
`verificado`, 0 purgas**; venta online 9 `sí` (todas `ecommerce`), 0 `no`, 6 `no
comprobado`. Todos son fabricantes/obradores reales. URL y claims por fila en
`data/evidence/comunitat-valenciana/alicante.jsonl`.

Decisiones relevantes:

- **Turrón de Jijona (IGP):** confirmado que **Turrones Picó (1920) e Hijos de
  Manuel Picó (1770) son empresas distintas** (no se fusionan). Con tienda propia:
  El Artesano (Mira y Llorens SA, tienda tiendaturron.com), 1880 (Almendra y Miel
  SA), Primitivo Rovira (1850, la más antigua), Pablo Garrigós Ibáñez e Hijos de
  Manuel Picó. Picó queda `no comprobado` (web informativa sin carrito).
- **Chocolate de Villajoyosa:** Valor (fábrica propia) y Marcos Tonda (1793, tienda
  /carrito) con `ecommerce`; Clavileño (1882) `no comprobado` (perfil de suministro
  a retail/industrial, sin tienda B2C).
- **4 webs ajenas/aparcadas corregidas a la oficial:** `1880.es` (aparcada) →
  `turron1880.com`; `turronesydulces.com` (distribuidor ajeno "Turrones Fabián") →
  `pablogarrigos.com`; `clavileno.com` (plataforma educativa de matemáticas) →
  `chocolatesclavileno.com`; `helados-alacant.com` (blog, domain squatting) →
  `heladosalacant.com`. Además `turronespico.com` → `turronpico.com` (redirect).
- **Pan y pastelería:** Raúl Asencio (1758, Aspe; tienda /tienda-online) con
  `ecommerce`; Better Pan (masa madre, Alicante), Roque Artesanos (1972, Castalla) y
  Le Pain Tranquille (Orba) quedan `verificado`/`no comprobado` (obradores sin
  tienda online).
- **Otros:** Helados Alacant (Grupo Alacant, fábrica en San Vicente del Raspeig;
  fabricante industrial sin tienda B2C → `no comprobado`); Salinitas Artesanos
  (snacks horneados, Callosa de Segura; tienda salinitas.shop → `ecommerce`).
- **Geocodificación (centroide):** Hijos de Manuel Picó (Jijona), Le Pain Tranquille
  (Orba), Better Pan (Alicante), Roque Artesanos (Castalla) y Salinitas (Callosa de
  Segura).

Snapshot tras lote 5: 100 filas; 54 `verificado`, 9 `parcial`, 37 `pendiente`;
venta online 40 `sí`, 0 `no`, 60 `no comprobado`; canal 40/40; evidencia 68
registros (63 `keep`, 3 `merge`, 2 `purge`).

## Lote 6 - Lácteos y quesos + Miel

Revisión de 16 fichas (9 queserías, 7 miel) el 2026-06-29. Resultado editorial:
**15 `verificado`, 1 `pendiente`, 0 purgas**; venta online 9 `sí` (todas
`ecommerce`), 0 `no`, 6 `no comprobado` (verificados). Todas las queserías y
apicultores activos son productores reales con leche o colmenas propias. URL y
claims por fila en `data/evidence/comunitat-valenciana/alicante.jsonl`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`, tienda propia):** La Vaquería del Camp
  d'Elx (~140 vacas propias), Quesería San Antonio (Queronsa), Quesos Muñoz,
  Alcaprone, Quesos Cantó d'Elx; Melíbera (miel de Elche), El Serralet (apicultura
  +80 años), L'Abella Mel (4ª generación) y Orimiel (Huerta de Orihuela).
- **`verificado` sin venta remota (`no comprobado`):** El de Sereix (premios World
  Cheese Awards, sin tienda), Lácteos Segarra (B2B: Mercadona/Carrefour/El Corte
  Inglés), Quesería Los Molinos, Quesería del Valle de Tibi; en miel, Israel Martínez
  (apicultor con FB/IG propios) y Bona Mel Organic (web en reconstrucción).
- **Pendiente residual (sin rastro):** `maria-rosario-ortega-perez-salinas` (miel,
  Salinas; sin web ni redes). A reinvestigar en el cierre.
- **Correcciones:** web de Melífera `meliferaelche.es`→`melibera.es` (redirect) y
  Facebook roto eliminado; geocodificadas (centroide) Alcaprone (Alcoy) y Orimiel
  (Orihuela).

Snapshot tras lote 6: 100 filas; 69 `verificado`, 9 `parcial`, 22 `pendiente`;
venta online 49 `sí`, 0 `no`, 51 `no comprobado`; canal 49/49; evidencia 83
registros (78 `keep`, 3 `merge`, 2 `purge`).

## Lote 7 - Cerveza, café, conservas, charcutería, pescado y otros atípicos

Revisión de 17 fichas (4 cerveza, 2 café, 3 conservas, 2 charcutería, 2 pescado, 4
«Otros» atípicos) el 2026-06-29. Resultado editorial: **15 `verificado`, 1
`parcial`, 1 purga**; venta online 9 `sí` (todas `ecommerce`), 0 `no`, 7 `no
comprobado`. URL y claims por fila en
`data/evidence/comunitat-valenciana/alicante.jsonl`.

Decisiones relevantes:

- **Purga (cierre):** `cervezas-spigha-alcoy`. La Cervecería Alcoiana (Cervezas
  Spigha) **cerró definitivamente** tras casi 10 años (prensa sectorial). Fuera de
  alcance.
- **`parcial` por cese de actividad:** `aitana-espirulina-guadalest`. Según su propia
  web **ya no produce espirulina comercialmente** (ahora talleres, visitas y
  educación); actividad productora actual cesada → techo `parcial`, `no comprobado`.
- **Venta online confirmada (`ecommerce`):** Cerveza Gorgos, Cervezas Althaia
  (web→cervezasalthaia.com), D·Origen Coffee, Tomachaf/Ibarra Abadía (web→tomachaf.es),
  L'Olivateria (recibió el merge de Rosa Gil del lote 4), La Capsana (embutidos
  1920), Salazones Vicente Romá, El Capricho del Abuelo (salazones) y El Rincón de
  las Mermeladas / El Perolet.
- **`verificado` sin venta remota (`no comprobado`):** Cerveza Santa Faz (su dominio
  cervezasantafaz.com está en venta → web eliminada), Cafés Jurado (tostadero 1912,
  sin carrito propio), La Vieja Dolores (conservas de alcachofa, venta vía terceros),
  Embutidos Hortanatura, Ganadería La Cabrera (caprina regenerativa, web inactiva) y
  Hélix Donaire (caracoles ecológicos).
- **Correcciones:** webs corregidas (Althaia, Tomachaf, El Rincón de las Mermeladas),
  web eliminada (Santa Faz, dominio en venta), Facebook roto fuera (Hortanatura),
  teléfono a Salazones Romá; Ganadería La Cabrera geocodificada (centroide Elche).

Snapshot tras lote 7: 99 filas; 84 `verificado`, 10 `parcial`, 5 `pendiente`; venta
online 58 `sí`, 0 `no`, 41 `no comprobado`; canal 58/58; evidencia 100 registros
(94 `keep`, 3 `merge`, 3 `purge`). Lotes de sector cerrados; restan 5 pendientes
residuales para el cierre transversal (lote 8).

## Lote 8 - Cierre transversal provincial

Pasada de consistencia y cierre de la primera pasada profunda (2026-06-29). No se
añaden productores nuevos; se concilia el conjunto.

- **Pares de teléfono:** ya resueltos en el lote 4 (Joan Bellod→Bine i Xama; Rosa
  Gil→L'Olivateria). Dedup transversal final: **0 teléfonos y 0 dominios web
  duplicados** en las 98 filas.
- **Geo:** `check:csv` sin errores; ningún salto >100 km ni homónimo a corregir
  (Canyada, Salinas y los municipios del Comtat caen en su sitio). **Geocodificadas
  por centroide las 4 filas que quedaban sin coordenadas → 98/98 con `lat`/`lon`.**
- **Pendientes residuales (4), documentados:** `maria-rosario-ortega-perez-salinas`
  (miel), `m-rosario-garcia-elche`, `finca-el-serrat-relleu` y `frutas-sin-orihuela`.
  Son productores particulares **sin ningún rastro digital** (ni web, ni redes
  oficiales, ni directorio) tras búsquedas exhaustivas. No se verifican ni
  parcializan (no hay fuente externa) ni se purgan (ausencia de web ≠ inexistencia;
  cf. regla dura 14): quedan `pendiente` para confirmación en campo/mantenimiento.
- **Purga (no productor):** `carla-aguilera-s-l-orihuela`. Su único rastro
  (teléfono y correo) es Agrofitovial SL, distribuidora mayorista de fitosanitarios
  en Orihuela; sin rastro de actividad productora de fruta → fuera de alcance.
- **Imágenes:** `check:images` sin errores ni huérfanos atribuibles a esta pasada
  (47/98 filas con imagen; su revisión/ampliación queda para mantenimiento).
- **Cobertura:** **no** se añade `comunitat-valenciana/alicante` a
  `data/evidence/coverage.json`: con 4 filas `pendiente` sin registro, el ledger no
  cubre todavía cada fila activa (coverage es advisory y exige cobertura completa).
  Se añadirá cuando se resuelvan los 4 residuales.

Cierre: la primera pasada profunda queda **cerrada**. Resultado global desde el
snapshot inicial (104 filas, todo `pendiente`/`no comprobado`): 98 filas activas,
**84 `verificado`, 10 `parcial`, 4 `pendiente`**; 58 `sí` con canal; 6 bajas (4
purgas + 2 fusiones); 101 registros de evidencia.

Snapshot tras lote 8 (cierre): 98 filas; 84 `verificado`, 10 `parcial`, 4
`pendiente`; venta online 58 `sí`, 0 `no`, 40 `no comprobado`; canal 58/58;
evidencia 101 registros (94 `keep`, 3 `merge`, 4 `purge`).
