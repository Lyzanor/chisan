# Verificación provincial de Cádiz

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/andalucia/cadiz.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila debe vivir en `data/evidence/andalucia/cadiz.jsonl` a medida
que se revise cada lote (el fichero aún no existe; se crea en el lote 1).

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento no
lo duplica, solo fija el snapshot, las particularidades de Cádiz y el plan de
lotes. Los contratos viven en `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md`
y `docs/EDITORIAL_POLICY.md`.

Este ledger está pensado para que **Sonnet 5** lo siga de forma autónoma: lee
«Reglas duras para Cádiz», «Flujo por lote» y la fila del lote en curso; no
necesitas releer el manual entero por lote.

## Estado

- Inicio: 2026-06-30.
- Snapshot inicial: **162 filas**; 39 `verificado`, 0 `parcial`, 123 `pendiente`.
- Venta online inicial: **21 `sí`, 0 `no`, 141 `no comprobado`**.
- `Canal de venta`: **0/162 filas informado**. Los 21 `sí` deben reauditarse y
  quedar con canal (`ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion` o
  `marketplace`) o corregirse a `no`/`no comprobado`.
- **Anomalía de venta online (clave del plan).** A diferencia de Castellón, aquí
  el default del contrato se respetó (141 `no comprobado`, 0 `no`), así que **no
  hay que reauditar `no` masivamente**. El foco es la **cuarentena de los 21
  `sí`**: ninguno tiene canal y 19 de los 21 son `verificado` heredado. Hasta
  confirmar un pedido remoto vigente y utilizable (tienda propia, no reventa de
  terceros), el `sí` no se da por bueno.
- Verificación heredada concentrada en **Bodega (19 de los 39 `verificado`)**;
  resto repartido (Pan y pastelería 6, Aceite 3, Fruta y verdura 3, Lácteos 2,
  Pescado 2, y 1 en Cerveza, Dulces, Charcutería y Licores). No se dan por buenas.
- Imágenes: 110/162 con `imagen`, 52 sin. Revisar imágenes **después** de
  estabilizar identidad, `slug`, fusiones y purgas.
- Enlaces iniciales: 151/162 con `web`, 114/162 con `Instagram`, 114/162 con
  `Facebook`, 162/162 con `Google Maps`, 154/162 con `telefono`, 133/162 con
  `correo`, 162/162 con `direccion`, 162/162 con `lat`/`lon`.
- Calidad inicial: `node scripts/audit-csv.js --mode=quality --summary-only
  data/csv/andalucia/cadiz.csv` devuelve **0 errores, 3 warnings** y 38 avisos
  suprimidos por opcionales ausentes. Geo sin saltos >100 km (contrato OK).
- Evidencia inicial: **no existe** `data/evidence/andalucia/cadiz.jsonl` (sí
  existe ya `data/evidence/andalucia/almeria.jsonl`). Cádiz **no** está en
  cobertura estricta (`data/evidence/coverage.json`).
- Tras lote 1 / Bodega Sanlúcar+Chipiona+Trebujena (2026-06-30): 162 filas; **48
  `verificado`, 1 `parcial`, 113 `pendiente`**. Venta online: **29 `sí`, 0 `no`,
  133 `no comprobado`**; 12/29 `sí` con `Canal de venta`. Evidencia: **17 registros**
  en `data/evidence/andalucia/cadiz.jsonl` (todos `keep`; fichero creado en este lote).
- Tras lote 2 / Bodega Jerez+El Puerto (2026-06-30): 162 filas; **58 `verificado`,
  1 `parcial`, 103 `pendiente`**. Venta online: **34 `sí`, 0 `no`, 128 `no
  comprobado`**; 20/34 `sí` con `Canal de venta`. Evidencia: **34 registros**. Dos
  recategorizaciones Bodega→**Licores** (Rives, Destilerías Pico): Bodega baja a 50,
  Licores sube a 4.
- Tras lote 3 / Bodega Sierra+resto (2026-06-30): Bodega cierra los 3 lotes del
  Marco/Tierra de Cádiz. 16 `verificado`, 2 `parcial` (Bodega Ambrosio, Hermanos
  Holgado). 3 municipios corregidos de «Cádiz» a su pueblo real (Guardi→Arcos,
  Miguel Domecq→Jerez, las coords ya estaban allí).
- Tras lote 4 / Pescado (2026-06-30): **1 purga** (Frigoríficos Costa Sur,
  mayorista de congelados) y **1 fusión** (Salpesca SL = razón social de La Chanca).
  16 filas activas; almadraba/conservas de Barbate. Gadira y El Rey de Oros = misma
  empresa (Productos de Almadraba S.L.), se mantienen como marcas hermanas.
- Tras lote 5 / Lácteos y quesos (2026-06-30): quesos payoyo de la Sierra. 1
  recategorización Lácteos→**Despensa artesanal** (Finca Arcadia: era «Huevos», en
  realidad ajo negro ecológico). 4 queserías artesanas sin web → `parcial`. Andazul:
  `sí` heredado demotido a `no comprobado` (sin tienda propia).
- Snapshot tras lotes 3-5: **160 filas** (−2); **93 `verificado`, 8 `parcial`, 59
  `pendiente`**; VO **61 `sí`, 0 `no`, 99 `no comprobado`**; 52/61 `sí` con canal;
  evidencia **87 registros**.
- Tras lote 6 / Aceite (2026-07-01): DOP Sierra de Cádiz + Tierra de Cádiz. **1
  purga** (Guadaceite = envasador/distribuidor de aceites comestibles para
  hostelería, sin almazara propia). De las 14 activas: 10 flips `no comprobado`→`sí`
  (almazara + tienda propia) y 2 cuarentenas resueltas (Taramilla, Agrosetenil →
  canal ecommerce); 2 quedan `no comprobado` (Los Horgazales, Molino El Vínculo:
  reales, sin tienda propia). 2 webs corregidas (Almazara las Pilas, Los Horgazales).
- Snapshot tras lote 6: **159 filas** (−1); **104 `verificado`, 8 `parcial`, 47
  `pendiente`**; VO **71 `sí`, 0 `no`, 88 `no comprobado`**; 64/71 `sí` con canal;
  evidencia **102 registros**.
- Tras lotes 7-9 (2026-07-01): cerrados Pan+Dulces, Charcutería+Despensa y
  Cerveza+Miel+Fruta+Sal+Licores. **0 purgas**; 1 recategorización (Indi&Co
  Despensa→Licores); 2 anomalías `sí`→`no comprobado` (Algaeca, Licores
  Grazalemeños); 6 `parcial` nuevos (4 conventos de clausura, salina UCA, licores
  sin web). Detalle en «Lote 7/8/9».
- **Snapshot tras lote 9 — primera pasada de contenido cerrada**: **159 filas**;
  **145 `verificado`, 14 `parcial`, 0 `pendiente`**; VO **96 `sí`, 0 `no`, 63 `no
  comprobado`**; **96/96 `sí` con `Canal de venta`**; evidencia **162 registros**.
  Solo queda el lote 10 (cierre transversal) antes de `coverage.json`.
- **Lote 10 / cierre transversal cerrado (2026-07-01) — PASADA COMPLETA**: 0
  pendientes; municipios señalados verificados (correctos); web ajena de Destraperlo
  eliminada; dedup limpio; geo OK (1 aviso rústico no bloqueante); evidencia 159/159;
  `andalucia/cadiz` añadida a `data/evidence/coverage.json`. `verify:data` verde.
  Cádiz queda con la primera pasada **cerrada de extremo a extremo**.
- Modo: primera pasada profunda. Prioridad: cerrar la calidad de las filas
  heredadas antes de añadir candidatos nuevos.

## Reglas duras para Cádiz

1. No dar por buenas las 39 filas `verificado` heredadas: se reauditan cuando
   llegue su lote o en el cierre transversal. No hay `parcial` heredado.
2. **Venta online en cuarentena de los `sí`.** Ningún `sí` tiene canal: hasta
   confirmar un mecanismo de pedido remoto vigente y utilizable, el `sí` no se da
   por bueno. La distribución (0 `no`, 141 `no comprobado`) sugiere que el default
   se respetó, así que **no** hace falta reauditar todos los `no comprobado`;
   basta resolver bien los 21 `sí` y los `no comprobado` que toque su lote.
3. **Marco de Jerez (sector dominante, 52 bodegas = un tercio del catálogo).** El
   Marco mezcla casas históricas grandes con bodegas pequeñas, almacenistas y
   cooperativas. Criterio de alcance Km0: entra la **bodega del Marco con crianza
   propia** (cría/saca en el territorio, DO Jerez-Xérès-Sherry / Manzanilla-
   Sanlúcar / Vinagre de Jerez / Brandy de Jerez). Distingue y trata con cuidado:
   - **almacenista/embotellador sin crianza propia** o marca sin bodega → no entra
     por defecto;
   - **distribuidor/vinoteca** que solo revende → fuera de alcance;
   - el Consejo Regulador apoya **pertenencia**, no actividad ni venta.
   La venta del sherry online es habitual, **pero la reventa por terceros**
   (Vinissimus, Bodeboca, El Corte Inglés, distribuidores) **no** cuenta como `sí`:
   exige tienda propia de la bodega o de su consejo/colectivo.
4. **Vinos de la Tierra de Cádiz (fuera del Marco).** Bodegas de la Sierra, Arcos,
   Chiclana (viña de la tierra), Prado del Rey y mostos: ampáralas con la IGP Vinos
   de la Tierra de Cádiz, no con la DO del sherry. No mezcles ambos sellos.
5. **Pescado: almadraba, salazones y conservas.** Barbate (núcleo, 9 filas), Conil,
   Zahara de los Atunes, Tarifa, Sanlúcar (langostino), Chipiona. Atún rojo de
   almadraba, mojama, salazones, conservas. Distingue **conservera/salazonera/
   elaborador** (entra) de **lonja, cofradía de pescadores, pescadería o
   distribuidor** (fuera de alcance, como las cofradías purgadas en Castellón).
   `Langostino de Sanlúcar` y similares son marca/producto colectivo, no un
   productor.
6. **Lácteos: queso payoyo y de la Sierra de Cádiz.** Núcleo en Villaluenga del
   Rosario, Benaocaz, Grazalema, El Bosque, Ubrique (queso payoyo de cabra payoya y
   oveja grazalemeña). Quesería con leche/ganadería propia entra; feria, concurso
   (World Cheese Awards) o registro apoyan existencia, no sustituyen fuente propia
   ni venta. `Payoyo` es además marca registrada de una quesería concreta: no
   confundas la marca con la denominación genérica del queso.
7. **Aceite: DOP Sierra de Cádiz.** Olvera, Zahara de la Sierra, Setenil,
   Algodonales, Espera, Alcalá del Valle. Distingue **almazara/elaborador** de
   olivarero suelto, cooperativa solo comercializadora y marca sin molino propio.
8. **Dulces: IGP Alfajor de Medina Sidonia + conventos.** Alfajores, amarguillos y
   tortas de Medina-Sidonia (IGP), pestiños, conventos de clausura (El Puerto,
   Sanlúcar). El obrador/convento elaborador entra; distingue de confitería-despacho
   sin elaboración propia demostrada. La IGP apoya pertenencia, no venta.
9. **Sal: salinas artesanas de la Bahía.** Flor de sal y sal artesana de las salinas
   de la Bahía de Cádiz (San Fernando, Chiclana, Puerto Real, Cádiz). La salina
   artesana elaboradora entra; distingue de la explotación salinera industrial pura.
10. **Charcutería: chacinas de la Sierra y retinto.** Embutidos de la Sierra de
    Cádiz y carne de retinto (raza autóctona de La Janda/Campo de Gibraltar). Obrador
    elaborador o ganadería con despiece/curado propio entra; carnicería minorista
    solo con elaboración propia demostrada.
11. **«de la Frontera» y homónimos geográficos.** Muchos municipios «de la Frontera»
    (Jerez, Arcos, Chiclana, Conil, Vejer). Vigila homónimos entre provincias
    (p. ej. `Villamartín` existe en Cádiz y fuera). Si un bloque cae lejos de su
    centroide por homónimo, corrige `data/reference/municipios-overrides.json`; no
    muevas productores correctos. Ejecuta `check:csv` para detectar saltos >100 km.
12. Un sitio HTTP, certificado roto, timeout o bloqueo (las webs de bodega suelen
    bloquear WebFetch por age-gate de alcohol o Cloudflare) **no prueba** baja.
    Contrasta con búsqueda, perfil oficial, Maps, registro o fuente local antes de
    borrar web, venta o fila.
13. No purgar con evidencia débil: exige duplicado, fuera de alcance/provincia, baja
    clara o ausencia suficientemente contrastada.
14. No añadir candidatos nuevos durante esta primera pasada salvo decisión
    explícita. Primero cerrar la calidad de las 162 filas heredadas.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la comprobación de una fuente propia o ficha
real cuando la decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Consejo Regulador de las DD.OO. Jerez-Xérès-Sherry, Manzanilla-Sanlúcar de
  Barrameda y Vinagre de Jerez** (`sherry.wine`): bodegas inscritas del Marco;
  ancla principal de Bodega. Brandy de Jerez (IG) como sello complementario.
- **IGP Vinos de la Tierra de Cádiz**: bodegas fuera del Marco (Sierra, Arcos,
  Chiclana, Prado del Rey).
- **DOP Aceite Sierra de Cádiz** (consejo regulador): almazaras y marcas amparadas.
- **IGP Alfajor de Medina Sidonia** (consejo regulador): obradores amparados.
- **Marca «Sabor a Cádiz»** (Diputación de Cádiz): directorio gastronómico
  provincial; buen ancla de descubrimiento y cotejo (análoga a Ruta de Sabor en
  Castellón).
- **Cádiz Turismo / Rutas del Atún de Almadraba** (Barbate, Conil, Zahara,
  Tarifa): contexto para Pescado/almadraba.
- **Quesos Payoyo y asociaciones queseras de la Sierra de Cádiz**; concursos
  (World Cheese Awards, Premios Alimentos de España) apoyan existencia, no venta.
- **CAAE** (Comité Andaluz de Agricultura Ecológica): buscador de operadores
  ecológicos andaluces.
- **Landaluz** (Asociación Empresarial Alimentos de Andalucía): industria
  agroalimentaria andaluza con marca.
- Comarcas y turismo: Sierra de Cádiz, La Janda, Campo de Gibraltar, Bahía de
  Cádiz, Costa Noroeste (Sanlúcar/Chipiona/Rota), Jerez y su entorno.
- Contexto local secundario: ayuntamientos, prensa local reciente, Google Maps y
  redes oficiales; nunca como sustituto único de actividad productora si queda
  duda material.

## Plan de ejecución

Lotes agrupados por sector/zona para reutilizar fuentes (consells reguladores,
marca Sabor a Cádiz) y aplicar la regla dura correspondiente. Tamaño 15–22 filas.
Los lotes 1–9 cubren el snapshot de 162 sin solaparse; el 10 es cierre transversal.

1. **Lotes 1–3 (Bodega, 52 filas).** El sector dominante, partido por zona del
   Marco de Jerez. Objetivo: crear el primer JSONL, fijar el alcance Km0 del Marco
   y resolver la cuarentena de venta (la mayoría de los 21 `sí` son bodegas).
2. **Lote 4 (Pescado).** Almadraba/atún de Barbate, salazones y conservas; separar
   conservera de lonja/cofradía/pescadería.
3. **Lote 5 (Lácteos y quesos).** Queso payoyo y de la Sierra; quesería con leche
   propia vs marca/feria.
4. **Lote 6 (Aceite).** DOP Sierra de Cádiz; almazara vs comercializadora.
5. **Lote 7 (Pan y pastelería + Dulces y repostería).** Obradores, conventos, IGP
   Alfajor de Medina Sidonia; obrador vs despacho.
6. **Lote 8 (Charcutería + Despensa artesanal).** Chacinas de la Sierra y retinto;
   triaje del cajón heterogéneo «Despensa artesanal».
7. **Lote 9 (Cerveza + Miel + Fruta y verdura + Sal + Licores).** Sectores
   pequeños; salinas artesanas de la Bahía, mieles de la Sierra, cerveceras.
8. **Lote 10 (cierre transversal).** Objetivo: 0 pendientes, `Canal de venta` en
   todos los `sí`, evidencia para todas las filas activas, dedup y geo, y provincia
   lista para `coverage.json`.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes parten por
categoría/zona en el orden actual del CSV; **congela los `slug` al iniciar cada
lote**. Si un lote fusiona o purga filas, recalcula los bloques siguientes antes de
iniciarlos. El lote 10 es auditoría transversal y puede revisar filas ya tocadas.

Las columnas `Pend./Parcial/Verif./VO=sí` reflejan el **objetivo/contenido inicial
del lote**, no el resultado; se actualizan al cerrar cada lote (como en
`castellon.md`).

| # | Lote | Filas | Estado | Notas iniciales |
|---|---|---:|---|---|
| 1 | Bodega · Sanlúcar + Chipiona + Trebujena | 17 | ✅ | Cerrado 2026-06-30. Detalle en «Lote 1». 16 `verificado`, 1 `parcial` (La Mayetería), 0 purgas. 12 `sí` (todas `ecommerce`), de ellas 8 flips `no comprobado`→`sí`. JSONL creado (17 reg.). Enlaces ajenos corregidos: Argüeso (dominio caducado→prepmo.com), Yuste (ECONNREFUSED→yustebodegas.com), Cota 45 y La Mayetería (web=directorio gustocadiz), Herencia Yacente (FB de fotógrafo), Vinos de Albarizas (IG vacío). |
| 2 | Bodega · Jerez de la Frontera + El Puerto de Santa María | 17 | ✅ | Cerrado 2026-06-30. Detalle en «Lote 2». 17 `verificado`, 0 purgas. 8 `sí` (ecommerce), de ellas 7 flips. 2 demociones `sí`→`no comprobado` (Faustino González y Santa Petronila: solo reventa de terceros). 2 recategorizaciones Bodega→Licores (Rives, Destilerías Pico). Enlaces corregidos: Faustino González (DNS muerto→bodegasfaustinogonzalez.com), Emilio Hidalgo (.htm 404→apex), 4 Ojos (web aparcada→eliminada, IG→@bodega4ojoswines). |
| 3 | Bodega · Sierra de Cádiz y resto | 18 | ✅ | Cerrado 2026-06-30. Detalle en «Lote 3». 16 `verificado`, 2 `parcial` (Bodega Ambrosio, Hermanos Holgado), 0 purgas. 11 `sí` (ecommerce). Municipios corregidos: Guardi→Arcos, Miguel Domecq→Jerez (coords ya correctas). Webs ajenas/typos: Ambrosio (gustocadiz), Vinificate (aparcada), Primitivo Collantes (typo), Vinos Oceánicos (vinoteca ajena→raulmorenoyague). |
| 4 | Pescado | 18 | ✅ | Cerrado 2026-06-30. Detalle en «Lote 4». **1 purga** (Frigoríficos Costa Sur = mayorista congelados) + **1 fusión** (Salpesca SL→La Chanca). 16 activas, 13 `verificado`, 1 `parcial` (Perumasa). 11 `sí` (ecommerce). Gadira/El Rey de Oros = misma empresa (Productos de Almadraba), marcas hermanas. |
| 5 | Lácteos y quesos | 17 | ✅ | Cerrado 2026-06-30. Detalle en «Lote 5». 12 `verificado`, 4 `parcial` (queserías sin web: Mangana, La Covacha, El Saltillo, Como los de antes). 10 `sí` (ecommerce). Finca Arcadia recategorizada→Despensa artesanal (era «Huevos», es ajo negro). Andazul `sí`→`no comprobado`. Doña Casilda municipio→San José del Valle. |
| 6 | Aceite | 15 | ✅ | Cerrado 2026-07-01. Detalle en «Lote 6». **1 purga** (Guadaceite = envasador/distribuidor de aceites comestibles, sin almazara). 14 activas: **12 `verificado`/`sí`/ecommerce** (10 flips + 2 cuarentenas resueltas: Taramilla, Agrosetenil) y **2 `verificado`/`no comprobado`** (Los Horgazales, El Vínculo: reales, sin tienda propia). Webs corregidas: Almazara las Pilas (301→aceitemolinolaspilas.com), Los Horgazales (→almazaraloshorgazales.com). |
| 7 | Pan y pastelería + Dulces y repostería | 21 | ✅ | Cerrado 2026-07-01. Detalle en «Lote 7». 0 purgas: 17 verificado (9 `sí`/ecommerce, 8 `no comprobado`) + 4 `parcial` (conventos de clausura sin web propia: torno). Web corregida: Cienpalacios (aparcada→cienpalacios.es). |
| 8 | Charcutería + Despensa artesanal | 17 | ✅ | Cerrado 2026-07-01. Detalle en «Lote 8». 0 purgas, todas verificado: 11 `sí`/ecommerce, 6 `no comprobado`. Recat. Despensa→Licores (Indi&Co, destilería). Algaeca `sí`→`no comprobado` (B2B). Web: Embutidos Gazules (.com→.es). |
| 9 | Cerveza + Miel + Fruta y verdura + Sal + Licores | 22 | ✅ | Cerrado 2026-07-01. Detalle en «Lote 9». 0 purgas: 20 verificado (12 `sí`/ecommerce, 8 `no comprobado`) + 2 `parcial` (Salina de La Esperanza=salina UCA; Licores Grazalemeños sin web). Anomalía corregida: Licores Grazalemeños `sí`→`no comprobado`. Web: Cerveza Besaro (www muerto→apex). |
| 10 | Cierre transversal provincial | 159 | ✅ | Cerrado 2026-07-01. Detalle en «Lote 10». 0 pendientes; municipios señalados verificados (Kombuchería/Hermanillas/La Pedriza correctos por dirección+coords); web ajena de Destraperlo eliminada (dominio secuestrado con spam de casino); dedup limpio (3 casos de marcas hermanas ya documentados); geo OK (1 aviso rústico: Miguel Domecq); evidencia 162 reg. (159/159 filas activas); `andalucia/cadiz` añadida a `coverage.json`. |

Reparto por categoría (snapshot inicial, para cuadrar los lotes): Bodega 52
(lotes 1–3), Pescado 18 (4), Lácteos y quesos 17 (5), Aceite 15 (6), Dulces y
repostería 11 + Pan y pastelería 10 (7), Charcutería 9 + Despensa artesanal 8 (8),
Cerveza 6 + Miel 5 + Fruta y verdura 5 + Sal 4 + Licores 2 (9). Total 162.

## Flujo por lote (resumen)

Detalle completo en `docs/VERIFICATION_TECHNIQUES.md`. Por lote:

1. `git status --short` y `npx pnpm list:province cadiz` (acota con `--categoria`
   para el lote).
2. Congelar los `slug` del lote en el orden actual del CSV.
3. Priorizar: duplicados/enlaces ajenos/no productores → `pendiente` con fuente
   propia fácil → `Venta online=sí` sin canal (cuarentena) → enlaces/municipios
   dudosos.
4. Investigar hasta evidencia suficiente; no recolectar opcionales que no cambien
   la decisión.
5. Editar quirúrgicamente el CSV (parser CSV, LF, solo los `slug` del lote).
6. Crear/actualizar una línea en `data/evidence/andalucia/cadiz.jsonl` por cada
   alta de evidencia, cambio de `verificacion`, cambio de `Venta online`/canal,
   purga o fusión. Conserva claims `identity`/`producer-activity`/`municipality`
   en las filas `verificado` (no solo `online-sales`), o `check:evidence` lo
   rechaza.
7. Validar al iterar: `npx pnpm check:csv:changed` y
   `npx pnpm check:evidence:changed`.
8. Cerrar el lote: `npx pnpm verify:data`.
9. Actualizar este ledger: snapshot si cambia, estado del lote en la worklist,
   fecha y nota corta (verificadas, parciales, purgas/fusiones, residuales). Añade
   una sección «Lote N - …» con las decisiones relevantes, como en `castellon.md`.

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada para pausar.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga/fusión tiene registro
  `purge`/`merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente (tienda propia o del consejo/colectivo, no reventa de terceros); cada
  `no`/`no comprobado` revisado tiene razón clara.
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas como prueba
  fuerte ni horarios que remitan a canales inexistentes.
- No quedan duplicados aparentes sin decisión explícita; sin colisiones
  geográficas por homónimo sin override.
- Las imágenes se revisan solo tras estabilizar identidad y `slug`; al purgar una
  fila con `imagen`, se elimina el archivo referenciado si no lo usa otra fila.
- `npx pnpm verify:data` pasa antes de cerrar cada lote y antes del cierre
  provincial.
- Cuando las 162 filas iniciales queden cerradas, añadir `andalucia/cadiz` a
  `data/evidence/coverage.json` en el mismo cambio que complete la evidencia
  provincial.

## Decisiones que deben quedar especialmente anotadas

- **Alcance Km0 del Marco de Jerez**: por qué entra cada casa grande (crianza
  propia) o por qué se trata como almacenista/embotellador/marca sin bodega.
- Promociones desde registro/feria/DOP a `verificado`: qué fuente propia, perfil
  oficial o ficha individual supera el techo de `parcial`.
- Cualquier productor sin web propia que quede `verificado`: la fuente concreta.
- Almazaras, cooperativas y comercializadoras: por qué entran como
  elaborador/productor dentro de alcance o por qué se purgan.
- Conservera/salazonera vs cofradía/lonja/pescadería en Pescado.
- Obradores vs despachos/confiterías en pan y dulces; conventos elaboradores.
- Cambios de `Venta online` heredado, sobre todo `sí`→`no comprobado` por reventa
  de terceros o tienda no funcional; reventa de sherry por marketplaces ajenos.
- Purgas por no productor, cierre, duplicado, otra provincia o entidad sin rastro
  suficiente.
- Overrides de centroide creados para homónimos (p. ej. Villamartín «de la
  Frontera» u otros).

## Lote 1 - Bodega · Sanlúcar de Barrameda + Chipiona + Trebujena

Revisión de las 17 fichas de `Bodega` en Sanlúcar (13), Chipiona (2) y Trebujena
(2) (2026-06-30). Resultado editorial: 17 filas activas (0 purgas), **16
`verificado`, 1 `parcial`**; venta online **12 `sí` (todas `ecommerce`), 0 `no`,
5 `no comprobado`**. Crea `data/evidence/andalucia/cadiz.jsonl` (17 registros
`keep`). URL y claims por fila en el JSONL.

Casas DO del Marco, casi todas reales y bien documentadas. El trabajo fue resolver
la **cuarentena de venta** (ningún `sí` traía canal) y limpiar **enlaces ajenos**.

Decisiones relevantes:

- **Venta online confirmada con tienda propia (`ecommerce`)** — los 4 `sí`
  heredados quedan con canal y se suman 8 flips `no comprobado`→`sí`:
  - Heredados: Delgado Zuleta (`/tienda/`), Cooperativa Virgen de Palomares
    (`vinosdetrebujena.com/tienda-online/`), César Florido (carrito) y Bodegas
    Barón (`bodegasbaron.es/collections/tienda-online`; su web dio certificado
    caducado en WebFetch, tienda confirmada por búsqueda).
  - Flips: Barbadillo (`/tienda-home/`), La Cigarrera (`/shop/`), Hidalgo La Gitana
    (`/shop`), Católico Agrícola (`/tienda-online/`, marca Los Madroñales),
    Muchada-Léclapart, Herencia Yacente/Manzanilla Elías y **Argüeso** y **Yuste**
    (ver enlaces ajenos).
- **Enlaces ajenos / dominios caducados corregidos**:
  - `bodega-herederos-de-argueso`: dominio heredado `herederosdeargueso.com`
    caducado (301 → `prepmo.com`). La marca San León/Argüeso está operada desde
    2016 por Francisco Yuste; web sustituida por su tienda oficial
    `yustebodegas.com/tienda-bodegas-argueso/` → `verificado`/`sí`.
  - `bodegas-yuste`: web heredada `bodegasyuste.com` no resuelve (ECONNREFUSED);
    dominio vivo `yustebodegas.com` con tienda propia (manzanilla Aurora).
    **Yuste y Argüeso son bodegas/marcas distintas del mismo titular**: se
    mantienen ambas filas (no se fusionan).
  - `cota-45` y `la-mayeteria-sanluquena`: la `web` heredada era una ficha del
    directorio `gustocadiz.com` (Diputación de Cádiz), no la web del productor →
    eliminada.
  - `herencia-yacente-elias-gonzalez-guzman`: el `Facebook` heredado
    (`FotoRicardoSanlucar`) era de un fotógrafo, no de la bodega → eliminado.
    Web propia `manzanillaelias.com` (viñas propias, tienda `/store`) → `verificado`/`sí`.
  - `vinos-de-albarizas`: Instagram heredado roto (`instagram.com/` sin handle) →
    corregido a `@vinosdealbarizas`.
- **`parcial`** (único del lote): `la-mayeteria-sanluquena`. Proyecto real de
  Ramiro Ibáñez con mayetos de Sanlúcar (marca Corta y Raspa), bien documentado en
  prensa especializada, **pero sin fuente propia operativa** (sin web/redes
  propias tras quitar el directorio ajeno) → techo en `parcial`, `no comprobado`.
- **`verificado` sin tienda propia → `no comprobado`** (solo reventa por terceros
  tipo Vinissimus/Bodeboca/Carrefour, que no cuenta como `sí`):
  - `cota-45` (Ramiro Ibáñez, UBE/Agostado/Pandorga; identidad por IG oficial +
    prensa), `bodegas-juan-pinero` (embotella Maruja/Jarona desde 2016; web propia
    falla por TLS, fallo técnico, se mantiene), `barrialto` (Rafael Rodríguez,
    vino natural; web no resolvió por TLS) y `vinos-de-albarizas` (coop. 1977 sin
    tienda online visible).
- **Sin duplicados** pese a vínculos: Cota 45 (bodega propia de Ramiro Ibáñez),
  La Mayetería (proyecto colectivo de mayetos dirigido por él) y Barrialto (marca
  propia de Rafael Rodríguez, también mayeto de La Mayetería) son tres entidades
  distintas → se mantienen las tres.

Snapshot tras lote 1:

- Filas CSV: 162
- Verificación: 48 verificado, 1 parcial, 113 pendiente
- Venta online: 29 sí, 0 no, 133 no comprobado
- Canal de venta informado: 12/29 productores con `Venta online=sí`
- Evidencia Cádiz: 17 registros JSONL (todos `keep`)

## Lote 2 - Bodega · Jerez de la Frontera + El Puerto de Santa María

Revisión de las 17 fichas de `Bodega` en Jerez (9) y El Puerto de Santa María (8)
(2026-06-30). Resultado editorial: 17 filas activas (0 purgas), **17 `verificado`,
0 `parcial`**; venta online **8 `sí` (todas `ecommerce`), 0 `no`, 9 `no
comprobado`**. Evidencia: +17 registros `keep`.

Núcleo del sherry y del brandy: grandes casas (Osborne, Grupo Luis Caballero/Lustau)
junto a bodegas medianas y artesanas, más vinagreras (Páez Morilla, Vinagres de
Yema) y destilerías. El trabajo: cuarentena de venta, alcance del Marco y limpieza
de enlaces/categorías.

Decisiones relevantes:

- **Recategorizaciones Bodega→`Licores`** (categoría errónea heredada; fila correcta):
  `rives-distillery` (destilería de ginebra/vodka/licores, tienda propia
  `tiendarives.es`) y `destilerias-pico` (Cacao Pico/Café Pico, ~2 siglos, tienda
  Prestashop propia). Bodega baja a 50, Licores sube a 4.
- **Cuarentena de venta — 2 demociones `sí`→`no comprobado`** (la cuarentena hace su
  trabajo): `bodegas-faustino-gonzalez` (venta solo por contacto, sin carrito; reventa
  en Lavinia/CVNE) y `bodega-vina-santa-petronila` (web informativa sin tienda; reventa
  en Bodeboca/Encopa). Ninguna vende online por canal propio.
- **Venta online confirmada con tienda propia (`ecommerce`)** — 8 `sí`, de ellas 7
  flips `no comprobado`→`sí`: Osborne (`/es/tienda-online`), Grupo Luis Caballero
  (`caballero.es/tienda/`; productor de Ponche + propietario de Lustau, también
  distribuidor), Bodega de Forlong (ecológica, viña propia), Bodegas Arfe (tienda en
  dominio aparte `bodegasarfe.es/tienda`), Rey Fernando de Castilla (`/tienda-online/`),
  Rives, Destilerías Pico, y se mantiene Bodegas Tradición (`sí` heredado con
  `tienda-online` propia).
- **Enlaces ajenos / dominios rotos corregidos**:
  - `bodegas-faustino-gonzalez`: web heredada `faustinogonzalez.com` no resuelve (DNS
    ENOTFOUND). Dominio real (también del correo e IG) `bodegasfaustinogonzalez.com` →
    sustituida.
  - `bodegas-emilio-hidalgo`: link heredado `hidalgo.com/instalaciones.htm` daba 404
    (deep-link obsoleto). `hidalgo.com` sí es su dominio (confirmado por su página de
    La Panesa) → corregido al apex.
  - `4-ojos-wines`: web heredada `4ojoswines.es` aparcada (placeholder/dominio en
    venta) → eliminada. Instagram corregido de `@4ojoswines` a `@bodega4ojoswines`
    (cuenta real). Bodega verificada por prensa local + IG oficial; solo reventa →
    `no comprobado`.
- **`no comprobado` sin tienda propia** (productor real, sin canal remoto confirmado):
  `bodegas-paez-morilla` (pionera del Vinagre de Jerez + vinos Tierra de Cádiz; «tienda
  online» sin carrito confirmado), `gutierrez-colosia` (web + distribuidores),
  `vinagres-de-yema` (solo contacto), `bodegas-luis-perez` (age-gate, reventa por
  terceros), `bodegas-urium` (web informativa) y `bodegas-emilio-hidalgo`.
- **Alcance Km0 del Marco**: las casas grandes (Osborne, Caballero) entran como
  productores reales del Marco (crianza propia de Jerez/brandy/Ponche), pese a que su
  catálogo mezcle marcas distribuidas. Sin purgas en el lote.

Snapshot tras lote 2:

- Filas CSV: 162
- Verificación: 58 verificado, 1 parcial, 103 pendiente
- Venta online: 34 sí, 0 no, 128 no comprobado
- Canal de venta informado: 20/34 productores con `Venta online=sí`
- Evidencia Cádiz: 34 registros JSONL (todos `keep`)

## Lote 3 - Bodega · Sierra de Cádiz y resto

Revisión de las 18 fichas de `Bodega` fuera del Marco (Arcos 4, Chiclana 3, Prado
del Rey 3, Cádiz 3, Olvera, San Fernando, Rota, Vejer, Setenil) (2026-06-30).
Resultado: 18 filas activas (0 purgas), **16 `verificado`, 2 `parcial`**; venta
online **11 `sí` (ecommerce), 0 `no`, 7 `no comprobado`**. Cierra el sector Bodega
(lotes 1-3). +18 registros.

Decisiones relevantes:

- **Municipios corregidos de «Cádiz» a su pueblo real** (las coordenadas ya
  apuntaban allí; solo la etiqueta estaba mal): `guardi-wines`→Arcos de la Frontera
  (Finca El Higueral), `miguel-domecq`→Jerez de la Frontera (campo de Jerez). Los
  `slug` se mantienen estables. `vinos-oceanicos` se queda en Cádiz (coords en la
  capital).
- **Enlaces ajenos / dominios rotos**: `bodega-ambrosio` y la `web` heredada era el
  directorio gustocadiz.com → eliminada; `bodega-vinificate` web aparcada
  (→lajoyeriawines) → eliminada; `primitivo-collantes` web con typo y TLD erróneo
  (bodegasprimtivocollantes.com) → bodegaprimitivocollantes.es; `vinos-oceanicos`
  web bacovinoteca.com (vinoteca ajena) → raulmorenoyague.com (Raúl Moreno Yagüe).
- **`parcial`**: `bodega-ambrosio` (primer blanco ecológico de Cádiz, perruno,
  Olvera; sin web/redes propias) y `vinos-hermanos-holgado` (vino de pajarete de
  Prado del Rey; web con TLS roto, sin fuente propia; comparte teléfono y correo
  `info@quesospajarete.com` con Quesos Pajarete = mismo operador familiar).
- **Venta online (ecommerce propio)**: Regantío Viejo, Tesalia, El Gato (Rota,
  1957), Etu-vino, Finca Las Mesetas (híbrido ibéricos+vino), Guardi, Miguel Domecq,
  Ibargüen, Manuel Aragón, Coop. Viticultores Chiclaneros y Finca Moncloa (tienda
  oficial de González Byass). `huerta-de-albala` queda `no comprobado` (tienda en
  versión dev; pedidos por tel/email sin confirmar). Rivero y Vinificate
  `no comprobado` (web caída/aparcada, reventa por terceros).

## Lote 4 - Pescado

Revisión de las 18 fichas de `Pescado` (Barbate 9, Conil, Chiclana, El Puerto,
Chipiona, Sanlúcar, Tarifa) (2026-06-30). Resultado: **16 filas activas** (1 purga,
1 fusión), **13 `verificado`, 1 `parcial`**; venta online **11 `sí` (ecommerce), 0
`no`, 4 `no comprobado`**. +18 registros (16 keep, 1 purge, 1 merge).

Decisiones relevantes:

- **Purga (out-of-scope)**: `frigorificos-costa-sur` (Fricosur). Mayorista/
  distribuidor de congelados multi-categoría (CNAE 4638; verduras, carne, marisco,
  helados de «las mejores marcas del sector»), no productor Km0. Imagen eliminada.
- **Fusión**: `salpesca-sl` → `la-chanca-barbate`. Salpesca S.L. es la razón social
  de La Chanca (Barbate); misma unidad productiva. La web heredada de Salpesca era
  el directorio gustodelsur.es (ajeno). Imagen eliminada.
- **Marcas hermanas, no duplicados**: `gadira` y `conservas-el-rey-de-oros` son dos
  marcas de **Productos de Almadraba S.L.** (Barbate, mismo dominio/tienda/teléfono);
  se mantienen ambas como marcas distintas (atún rojo vs conservas).
- **`parcial`**: `perumasa` (ahumados de Barbate; web perumasa.es no resuelve por
  DNS y confirmación pública débil).
- **Venta online (ecommerce propio)**: Petaca Chico (atunrojoalmadraba.com), Herpac,
  La Chanca, Conservera de Tarifa, El Ronqueo, Gadira/El Rey de Oros, Esteros
  Lubimar, Plancton Marino, Conservas Senra, Congelados Amar y Ubago (planta en
  Barbate; tienda del grupo). `no comprobado`: Del'aqua (esteros propios, pedido por
  contacto), Congelados Caromar (procesador sin tienda) y Viandas Cádiz (platos de
  pescado B2B hostelería).

## Lote 5 - Lácteos y quesos

Revisión de las 17 fichas de `Lácteos y quesos` (queso payoyo de la Sierra:
Villaluenga, Benaocaz, Grazalema, El Bosque, Ubrique, etc.) (2026-06-30). Resultado:
**16 filas activas** (1 recategorización fuera), **12 `verificado`, 4 `parcial`**;
venta online **10 `sí` (ecommerce), 0 `no`, 6 `no comprobado`**. +17 registros.

Decisiones relevantes:

- **Recategorización Lácteos→`Despensa artesanal`**: `finca-arcadia-sl`. No es
  «Huevos» ni lácteo: produce **ajo negro ecológico** (desde 1999, Jerez). Productos
  corregidos; tienda propia → `sí`.
- **`parcial` (queserías artesanas sin web propia)**: `queseria-hermanos-mangana`,
  `quesos-la-covacha`, `quesos-el-saltillo` y `quesos-como-los-de-antes` (todas
  payoya real de la Sierra, confirmadas por directorio de queserías payoya y prensa;
  techo por falta de fuente propia operativa).
- **Cuarentena**: `quesos-andazul` (`sí` heredado) → `no comprobado` (queso azul
  premiado, pero web sin tienda, solo contacto). Ubrique queda `no comprobado`
  (venta presencial).
- **Municipio corregido**: `dona-casilda`→San José del Valle (coords ya allí).
- **Webs corregidas**: `quesos-el-bosqueno` typo de dominio (quesoselboque.com →
  quesoselbosque.com).
- **Venta online (ecommerce propio)**: Queso Payoyo, Montealva, El Gazul, Puerto
  Carrillo, La Pastora de Grazalema, El Bosqueño, Pajarete, Doña Casilda, Finca
  Arcadia. `no comprobado`: El Cabrero de Bolonia (200 cabras propias, sin tienda) y
  La Abuela Agustina (web caída por DNS, identidad por redes).
- **Operador compartido**: Quesos Pajarete (Villamartín) y Bodega Hermanos Holgado
  (Prado del Rey, lote 3) comparten teléfono y correo → misma familia, dos productos
  (queso vs vino); se mantienen ambas filas.

## Lote 6 - Aceite

Revisión de las 15 fichas de `Aceite` (DOP Sierra de Cádiz: Olvera, Zahara, Setenil,
Algodonales, Espera, Alcalá del Valle; + Tierra de Cádiz: Vejer, Chiclana, Conil,
Jerez, Villamartín, Prado del Rey) (2026-07-01). Resultado: **14 filas activas** (1
purga), **14 `verificado`, 0 `parcial`**; venta online **12 `sí` (ecommerce), 0 `no`,
2 `no comprobado`**. +15 registros (14 keep, 1 purge).

Sector muy sólido: casi todas son almazaras/cooperativas olivareras con molino y
producción propios y tienda online funcional. El trabajo fue confirmar la tienda
propia (frente a reventa por terceros), separar la almazara del mero
envasador/distribuidor y limpiar dos webs.

Decisiones relevantes:

- **Purga (out-of-scope)**: `guadaceite-chiclana-de-la-frontera` (marca Puerta del
  Sur). No es almazara: es **envasadora/distribuidora de aceites comestibles** para
  hostelería (AOVE, oliva refinado, girasol, semillas, alto oleico, orujo) + mayonesa
  y harinas, sin molino ni producción propia (dominio real `puertasur.es`). Fuera de
  alcance Km0 → purga. Imagen eliminada.
- **Cuarentena de venta resuelta (2 `sí` heredados → canal `ecommerce`)**:
  `molino-de-taramilla-prado-del-rey` (almazara propia, extracción en frío, envasado
  bajo pedido) y `agrosetenil-setenil-de-las-bodegas` (S.C.A. El Agro, 1958, molino
  propio). Ambas con tienda online propia confirmada.
- **Venta online confirmada con tienda propia (`ecommerce`) — 10 flips
  `no comprobado`→`sí`**: Algodoliva (coop. olivarera ecológica CAAE, `/tienda`),
  Almazara las Pilas/Molino las Pilas (>200 años), Bodega Almazara Sancha Pérez
  (bodega-almazara ecológica), Coop. los Remedios-Picasat (almazara + envasado, DOP;
  tienda en dominio hermano `aceitelosremedios.com`), Molino de Espera (molino de 1771,
  familia Vega), Molino el Salado (olivar de montaña, DO Sierra de Cádiz), Oleoconil
  (primer AOVE ecológico de Conil), Oleum Viride (Almazara El Manzanillo, `/tienda`),
  Olivar del Lentisquillo (familiar ecológico CAAE) y SCA Europeos (coop., marca
  Espasierra).
- **`verificado`/`no comprobado`** (almazara propia real, pero **sin tienda online
  propia**; solo contacto y/o reventa por terceros):
  - `los-horgazales-villamartin` (Hacienda Los Horgazales, familia Bonilla; marcas
    Señorío de Villamartín/Oleovilla; primer molino turístico de la provincia). Sin
    carrito propio; reventa por terceros (Alándalus Club) + pedido por tel/email.
  - `almazara-el-vinculo-zahara-de-la-sierra` (molino histórico, molturando desde
    1640, sistema tradicional de prensa y capachos; muy documentado en prensa y
    andalucia.org). Venta en tienda física propia y reventa por terceros (Ronda
    Gourmet, Oliva Oliva); su web propia carga vacía. `verificado` sostenido por
    prensa + Facebook oficial + directorio institucional.
- **Webs corregidas**:
  - `almazara-las-pilas-olvera`: dominio heredado `almazaralaspilas.com` hace 301 al
    dominio activo `aceitemolinolaspilas.com` → corregido.
  - `los-horgazales-villamartin`: web heredada `loshorgazales.com` (http, sin https,
    versión antigua) → dominio activo `almazaraloshorgazales.com`.

Snapshot tras lote 6:

- Filas CSV: 159 (−1 purga)
- Verificación: 104 verificado, 8 parcial, 47 pendiente
- Venta online: 71 sí, 0 no, 88 no comprobado
- Canal de venta informado: 64/71 productores con `Venta online=sí`
- Evidencia Cádiz: 102 registros JSONL (99 keep, 2 purge, 1 merge)

## Lote 7 - Pan y pastelería + Dulces y repostería

Revisión de las 21 fichas (Pan y pastelería 10, Dulces y repostería 11)
(2026-07-01). Resultado: **0 purgas**, **17 `verificado`** (9 `sí`/ecommerce, 8 `no
comprobado`) + **4 `parcial`**. +21 registros. Sector de obradores familiares e IGP
Alfajor de Medina Sidonia; núcleo del trabajo: separar obrador con tienda propia de
obrador sin e-commerce y de convento de clausura sin fuente propia.

Decisiones relevantes:

- **`sí`/ecommerce (obrador propio + tienda propia)**: Abuelo Bread (sin gluten),
  Picos Yeyé (Panificadora Cohollero), Pastelería La Tarifeña, Aromas de Medina,
  Confitería Ntra. Sra. de la Paz, Sobrina de las Trejas (1852) y Tres Martínez
  (1886) + **cuarentenas resueltas**: Panes y Picos Sidonia y Monasterio del Espíritu
  Santo (tienda monástica con envío a España).
- **`verificado`/`no comprobado` (obrador propio con web, sin tienda online)**:
  Pastelería Bernal (1910), La Rosa de Oro (1928), La Exquisita (Galván, FB propio),
  Panadería La Hoya (IG propio), Pastelería Jesús (tienda de terceros apanymantel),
  Pan de Pelayo (1939), Cienpalacios (solo formulario) y Postres La Cobijada (tienda
  en mantenimiento).
- **`parcial` (convento de clausura elaborador, sin web/redes propias; solo torno)**:
  Monasterio de la Piedad (Cádiz), Santa María de Gracia/Santa Rita (Jerez; reparto
  local por WhatsApp), Jesús Nazareno (Chiclana, Torta de las Monjas) y Jesús, María
  y José (Medina-Sidonia).
- **Web corregida**: Cienpalacios (`cienpalacios.com` aparcada en GoDaddy →
  `cienpalacios.es`).

## Lote 8 - Charcutería + Despensa artesanal

Revisión de las 17 fichas activas (Charcutería 9, Despensa artesanal 8; Finca Arcadia
ya cerrada en lote 5) (2026-07-01). Resultado: **0 purgas**, **todas `verificado`**
(11 `sí`/ecommerce, 6 `no comprobado`). +17 registros.

Decisiones relevantes:

- **Charcutería `sí`/ecommerce**: Chacinas El Bosque, Chacinas Méndez, El Bucarito
  (ganadería propia cabra+ibérico), Embutidos Gazules, Montesierra (curado en Jerez) y
  Sabores de Grazalema (cuarentena resuelta). **`no comprobado`**: Chacinas Piñero
  (web 404), La Serrana, Sabores de Paterna (web en construcción, reventa terceros).
- **Despensa `sí`/ecommerce**: Cantizano (conservas vegetales), Conservas Artesanales
  Contigo, La Kombuchería (BioKombucha), PatríaPura (limonadas), Suralgas (algas).
  **`no comprobado`**: Moyseafood (pulpo B2B) y **Algaeca** (cultivo de algas B2B;
  `sí` heredado corregido a `no comprobado`).
- **Recategorización Despensa→`Licores`**: Indi&Co (`indi-drinks`), destilería
  artesanal de ginebra/tónicas de El Puerto; web aparcada → `no comprobado`.
- **Web corregida**: Embutidos Gazules (`.com` con certificado erróneo →
  `embutidosgazules.es`).
- **Municipio a revisar** (cierre): La Kombuchería (web sitúa sede en La Zorrera,
  Cádiz; CSV = Conil).

## Lote 9 - Cerveza + Miel + Fruta y verdura + Sal + Licores

Revisión de las 22 fichas (Cerveza 6, Miel 5, Fruta y verdura 5, Sal 4, Licores 2
pendientes) (2026-07-01). Resultado: **0 purgas**, **20 `verificado`** (12
`sí`/ecommerce, 8 `no comprobado`) + **2 `parcial`**. +22 registros. Cierra la
primera pasada de contenido (0 pendientes).

Decisiones relevantes:

- **Cerveza**: `sí`/ecommerce La Piñonera, Malandar Brewing y Besaro (web `www`
  muerto → apex `cervezabesaro.com/es`). `no comprobado`: Maier (venta en recepción
  de apartamentos), Sherry Beer (venta vía encopa.es) y **Destraperlo** (cooperativa
  Comando Cervecero real, pero su dominio `destraperlo.es` sirve **spam de casino** en
  portada — identidad por IG/prensa, web a revisar en el cierre).
- **Miel**: las 5 son apicultores con colmenas y tienda propias → `sí`/ecommerce
  (Apícola Patiño, Rancho Cortesano, Hermanillas, Las Bravías, Miel El Pinsapar).
- **Fruta y verdura**: `sí` Frusana (cuarentena resuelta). `no comprobado`: La
  Pedriza y Legumbres Pedro (fabricantes sin e-commerce) y las coops Las Virtudes y
  Virgen del Rocío (B2B/socios).
- **Sal**: `sí`/ecommerce GoldSal y Salinas de Chiclana (salina propia + tienda).
  `no comprobado`: EcoSal/San Vicente (sin tienda confirmada). **`parcial`**: Salina
  de La Esperanza (salina de investigación de la UCA; flor de sal recolectada bajo
  marcas de terceros, sin fuente comercial propia).
- **Licores**: `sí` Weisshorn/Soundcask (cuarentena resuelta). **`parcial`**: Licores
  Grazalemeños (productor familiar real sin web/redes; solo reventa por terceros;
  anomalía `sí`→`no comprobado`).
- **Municipios a revisar** (cierre): Hermanillas (web: Pueblo Nuevo/San Roque; CSV =
  Los Barrios), La Pedriza (web: Alcalá; CSV = Chiclana).

## Lote 10 - Cierre transversal provincial

Auditoría transversal final (2026-07-01). Cierra la primera pasada de Cádiz de
extremo a extremo: **159 filas, 145 `verificado`, 14 `parcial`, 0 `pendiente`**; VO
**96 `sí` (96/96 con `Canal de venta`), 0 `no`, 63 `no comprobado`**; evidencia **162
registros** que cubren las **159/159** filas activas (más 2 `purge` y 1 `merge`).

Comprobaciones y resoluciones:

- **Municipios señalados verificados como correctos** (dirección + coordenadas
  coherentes con el municipio del CSV, sin salto de geo): La Kombuchería (Av. de los
  Albañiles, 11140 **Conil**), Hermanillas (Autovía, 11370 **Los Barrios**), La
  Pedriza (Tr.ª Alameda de Solano, 11130 **Chiclana**; Alimentos La Pedriza S.L. está
  en Chiclana desde 1990 aunque se fundó en Alcalá en 1949 — web propia correcta). No
  se cambia ningún municipio.
- **Web ajena eliminada**: `destraperlo-comando-cervecero-jerez` tenía como `web` el
  dominio `destraperlo.es`, **secuestrado** y sirviendo spam de casino en portada y
  subpáginas. Se blanquea la `web`; la cervecera (cooperativa Comando Cervecero) sigue
  siendo real y su canal oficial es el Instagram ya presente. Evidencia actualizada
  (claim `link-ownership`).
- **Dedup limpio**: los únicos identificadores compartidos son casos ya documentados
  de marcas hermanas / mismo operador: Gadira + El Rey de Oros (Productos de Almadraba,
  lote 4), Argüeso + Yuste (mismo titular, lote 1) y Quesos Pajarete + Hnos. Holgado
  (misma familia, lotes 3/5). No hay duplicados nuevos.
- **Geo**: `check:csv` sin errores bloqueantes; único aviso de banda 15-100 km =
  Miguel Domecq (finca del campo de Jerez, 19,2 km del centroide urbano; ubicación
  rústica real, municipio correcto). Se deja.
- **Imágenes**: `check:images` sin errores ni refs rotas; 107/159 con `imagen`, 52
  sin. El enriquecimiento de las 52 restantes queda como tarea opcional futura (no
  bloquea el cierre; el scorer de `enrich:images` requiere revisión por slug).
- **`coverage.json`**: añadida `andalucia/cadiz` a `strictProvinces` (cobertura
  orgánica 159/159, `check:evidence` 0 issues).

Residuales conocidos (no bloquean; para futuras pasadas):

- 14 `parcial` con motivo documentado: 4 queserías payoya (lote 5), Bodega Ambrosio +
  Hnos. Holgado (lote 3), La Mayetería (lote 1), 4 conventos de clausura (lote 7),
  Perumasa (lote 4), Salina de La Esperanza y Licores Grazalemeños (lote 9).
- 52 filas sin `imagen`.
- `Venta online=no comprobado` en 63 filas: productores reales sin tienda propia
  (venta presencial, B2B o reventa por terceros); revisable si abren canal propio.
