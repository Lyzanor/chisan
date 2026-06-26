# Verificación provincial de Cantabria

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/cantabria/cantabria.csv`. El CSV es la fuente de verdad. La
evidencia estructurada por fila debe vivir en
`data/evidence/cantabria/cantabria.jsonl` a medida que se revise cada lote.

## Estado

- Inicio: 2026-06-21.
- Snapshot inicial: 469 filas; 6 `verificado`, 40 `parcial`,
  423 `pendiente`.
- Venta online inicial: 28 `sí`, 9 `no`, 432 `no comprobado`.
- `Canal de venta`: 0/469 filas informado. Las 28 filas con
  `Venta online=sí` deben reauditarse y quedar con canal (`ecommerce`,
  `whatsapp`, `email`, `telefono`, `suscripcion` o `marketplace`) o corregirse.
- Imágenes: 208/469 filas con `imagen`, 261 sin imagen. Revisar imágenes
  después de estabilizar identidad, `slug`, fusiones y purgas.
- Enlaces iniciales: 257/469 filas con `web`, 135/469 con `Instagram`,
  469/469 con `Google Maps`.
- Calidad inicial: `node scripts/audit-csv.js --mode=quality --summary-only
  data/csv/cantabria/cantabria.csv` devuelve 0 errores, 358 warnings y
  4 avisos suprimidos por opcionales ausentes en filas verificadas. Los avisos
  son mayoritariamente falta de redes, contacto o descripciones cortas; no son
  bloqueo, pero orientan la revisión.
- Evidencia inicial: no existe `data/evidence/cantabria/cantabria.jsonl` y
  Cantabria no está en cobertura estricta (`data/evidence/coverage.json`
  contiene Álava, Vizcaya, Guipúzcoa, La Rioja y Navarra).
- Tras lote 1 (2026-06-21): 463 filas activas; 36 `verificado`, 33
  `parcial`, 394 `pendiente`. Venta online: 45 `sí`, 8 `no`, 410
  `no comprobado`; 23/45 `sí` ya tienen `Canal de venta`. Evidencia:
  37 registros en `data/evidence/cantabria/cantabria.jsonl` (31 `keep`,
  6 `purge`).
- Modo: primera pasada profunda pendiente. Prioridad: cerrar calidad de las
  469 filas heredadas antes de añadir candidatos nuevos.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`. Cada lote debe
revisar identidad, actividad productora, municipio, enlaces conservados, venta
online y canal; editar solo sus filas; añadir evidencia JSONL para decisiones
materiales; y cerrar con `npx pnpm verify:data`.

## Reglas duras para Cantabria

1. No dar por buenas las 6 filas `verificado` ni las 40 `parcial` heredadas:
   se reauditan cuando llegue su lote o en el cierre transversal.
2. Las 28 filas con `Venta online=sí` no tienen canal. Hasta confirmar un
   mecanismo de pedido remoto vigente, el `sí` queda en cuarentena editorial.
3. En panaderías, pastelerías, confiterías, sobaos y quesadas, distinguir
   obrador/elaborador de cafetería, despacho, tienda, restaurante o marca sin
   obrador propio demostrado.
4. En charcutería y carne, distinguir explotación, matadero, obrador o fábrica
   de carnicería minorista. Una carnicería solo entra si hay elaboración propia,
   cría propia o unidad productiva dentro de alcance.
5. En conservas, anchoas y pescado, separar conservera/elaborador de pescadería,
   tienda de producto local, distribuidor o marca comercial sin elaboración
   cántabra demostrada.
6. En quesos, lácteos y miel, los registros DOP/IGP/ODECA apoyan existencia o
   pertenencia sectorial, pero no sustituyen una fuente propia, ficha individual
   fuerte o perfil oficial para `verificado`.
7. En bodegas, orujos, sidra, cerveza y café, confirmar elaborador real y
   canal de pedido. Una visita, experiencia, catálogo o tienda física no prueba
   venta online de producto.
8. Revisar duplicados aparentes antes de invertir tiempo en dos filas: `Quesería
   Javier Campo/Casa Campo`, `Quesos de Ruesga`, `Anchoas Sanfilippo/Conservas
   San Filippo`, familias de `Sordo`, `Los Arcos`, `María Luisa`, `Sobaos y
   Quesadas Figueras` y nombres genéricos como `Carnicería`.
9. Muchos valores de `municipio` parecen localidades o barrios. Contrastar
   municipio, dirección, Maps y coordenadas antes de corregir; no mover puntos
   por intuición si el centroide o la localidad explica la distancia.
10. Un sitio HTTP, certificado roto, timeout o bloqueo no prueba baja.
    Contrastar con búsqueda, perfil oficial, Maps, registro o fuente local
    antes de borrar web, venta o fila.
11. No añadir nuevos candidatos durante esta primera pasada salvo decisión
    explícita. Primero cerrar la calidad de las 469 filas heredadas.

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   npx pnpm list:province cantabria
   ```

2. Tomar el primer lote `⬜` de la worklist y congelar sus `slug` antes de
   investigar. Para lotes por categoría partida, usar el orden actual dentro
   de la categoría; si un lote fusiona o purga filas, recalcular los bloques
   siguientes antes de iniciarlos:

   ```bash
   node --input-type=module - <<'JS'
   import fs from "node:fs";
   import { parse } from "csv-parse/sync";

   const PATH = "data/csv/cantabria/cantabria.csv";
   const CATS = new Set(["Charcutería"]); // ajustar por lote
   const CHUNK_SIZE = 28;                 // ajustar por lote
   const CHUNK_INDEX = 0;                 // 0 = primer bloque

   const rows = parse(fs.readFileSync(PATH, "utf8"), {
     columns: true,
     skip_empty_lines: true,
   });

   const sel = rows
     .filter((r) => CATS.has(r.categoria))
     .slice(CHUNK_INDEX * CHUNK_SIZE, (CHUNK_INDEX + 1) * CHUNK_SIZE);

   for (const r of sel) {
     console.log(
       r.slug, "|", r.verificacion, "| VO=", r["Venta online"],
       "|", r.municipio, "| web=", Boolean(r.web),
       "| ig=", Boolean(r.Instagram), "| maps=", Boolean(r["Google Maps"])
     );
   }
   JS
   ```

3. Priorizar dentro del lote: duplicados y no productores, luego `pendiente`,
   luego `parcial`, luego `Venta online=sí`, luego enlaces o municipios
   dudosos.
4. Investigar hasta evidencia suficiente. No recopilar datos opcionales si no
   cambian la decisión.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote.
6. Crear o actualizar una línea en `data/evidence/cantabria/cantabria.jsonl`
   para cada fila con alta de evidencia, cambio de `verificacion`, cambio de
   `Venta online`, canal, purga o fusión.
7. Validar durante la iteración:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   ```

8. Al cerrar el lote:

   ```bash
   npx pnpm verify:data
   ```

9. Actualizar este ledger: snapshot si cambia, estado del lote, fecha y una
   nota corta con verificadas, parciales, purgas/fusiones y residuales.

## Fuentes de cotejo iniciales

Estas fuentes orientan la búsqueda, pero no sustituyen la comprobación de una
fuente propia o ficha real cuando la decisión sea `verificado`.

- ODECA / Sabe a Norte: marca de calidad diferenciada, productos DOP/IGP,
  Calidad Controlada y operadores (`https://www.alimentosdecantabria.com/`,
  `https://aplicacionesweb.cantabria.es/odeca/ext/operadores/home`).
- Producción ecológica: buscador de operadores de ODECA y REGOE estatal
  (`https://www.mapa.gob.es/es/alimentacion/temas/produccion-eco/regoe`).
- Quesos y lácteos: DOP Picón Bejes-Tresviso, DOP Queso Nata de Cantabria,
  DOP Quesucos de Liébana, ODECA y fuentes propias de cada quesería.
- Miel: DOP Miel de Liébana, ODECA, registros apícolas y fuentes propias.
- Panadería y dulces: IGP Sobao Pasiego, productores adheridos a ODECA/Sabe a
  Norte, webs propias de obrador y perfiles oficiales.
- Carne y charcutería: IGP Carne de Cantabria, registros de ODECA, ganaderías,
  obradores, fábricas y carnicerías con elaboración propia demostrada.
- Conservas y anchoas: ODECA/Sabe a Norte, webs propias de conserveras,
  perfiles oficiales, registros mercantiles/sectoriales y fuentes locales solo
  como apoyo.
- Bodegas, orujos y sidra: IGP Vino de la Tierra Costa de Cantabria, IGP Vinos
  de la Tierra de Liébana, ODECA, bodegas/destilerías propias y rutas de vino
  solo como apoyo.
- Cerveza, café, chocolate, despensa y huerta: fuentes propias, perfiles
  oficiales, Sabe a Norte, ferias/mercados institucionales y directorios
  sectoriales como apoyo secundario.
- Contexto local secundario: ayuntamientos, comarcas, turismo de Cantabria,
  prensa local reciente, Google Maps y redes oficiales; nunca como sustituto
  único de actividad productora si queda duda material.

## Plan de ejecución

1. Lotes 1-5: sectores con fuentes sectoriales claras y varios `Venta online=sí`
   heredados. Objetivo: crear el primer JSONL y limpiar ventas sin canal.
2. Lotes 6-9: charcutería/carne. Objetivo: separar productores reales de
   carnicerías minoristas y documentar purgas/fusiones con especial cuidado.
3. Lotes 10-12: huerta, despensa, chocolate y miel. Objetivo: resolver
   operadores ecológicos, DOP/IGP y productores pequeños con evidencia mínima.
4. Lotes 13-17: pan, pastelería, sobaos y quesadas. Objetivo: comprobar obrador,
   venta y duplicados de cadenas o familias comerciales.
5. Lote 18: cierre transversal. Objetivo: 0 pendientes, `Canal de venta` en
   todos los `sí`, evidencia para todas las filas activas y Cantabria lista
   para cobertura estricta.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes 1-17 cubren el
snapshot inicial de 469 filas sin solaparse. Los lotes partidos usan el orden
actual del CSV dentro de su categoría; congelar los `slug` al iniciar cada
lote. El lote 18 es una auditoría transversal de cierre y puede revisar filas
ya tocadas.

| # | Lote | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Bodega, orujos, sidra, cerveza y café | 37 | 0 | 1 | 30 | 23 | ✅ | Cerrado el 2026-06-21: 31 filas activas, 6 purgas (`Bodega río Miera`, `Bodegas Cantabras`, `Bodegas Hermanos Ruiz`, `Bodegas Monasterio`, `Café El Milagro`, `Cafés Cantabria`). Queda parcial `Bodegas Behetría`; `Pedales Beer` baja de `sí` a `no comprobado` por falta de canal remoto vigente. |
| 2 | Lácteos y quesos I | 24 | 0 | 2 | 22 | 11 | ✅ | Cerrado el 2026-06-21: 24 filas activas, 2 parciales, 22 verificadas, 3 bajas/merge y canales normalizados en las ventas confirmadas. |
| 3 | Lácteos y quesos II | 24 | 0 | 1 | 23 | 20 | ✅ | Cerrado el 2026-06-22: 24 filas activas, 1 parcial (`queseria-penalon`), 23 verificadas y 3 bajas/merge. |
| 4 | Pescado y conservas I | 26 | 0 | 1 | 25 | 24 | ✅ | Cerrado el 2026-06-22: 26 filas activas, 1 parcial (`conservas-del-norte`), 25 verificadas y 1 baja por cierre. |
| 5 | Pescado y conservas II | 23 | 0 | 1 | 22 | 15 | ✅ | Cerrado el 2026-06-22: 23 filas activas, 1 parcial (`conservas-crespo`), 22 verificadas y 4 bajas/merge. |
| 6 | Charcutería I | 13 | 0 | 1 | 12 | 7 | ✅ | Cerrado el 2026-06-26: 13 filas activas, 15 purgas por comercio minorista/no productor o ficha genérica. Queda parcial `carnicas-patino-carniceria` por sala de despiece sin fuente propia actual. |
| 7 | Charcutería II | 7 | 0 | 0 | 7 | 4 | ✅ | Cerrado el 2026-06-26: 7 productores activos y 21 purgas por carnicería minorista/ficha sin prueba productora. |
| 8 | Charcutería III | 8 | 0 | 2 | 6 | 2 | ✅ | Cerrado el 2026-06-26: 8 activos, 19 purgas y 1 merge (`carniceria-pepin` -> `carniceria-jon-y-nagore`). `casa-el-macho` pasa a panadería/pastelería. |
| 9 | Charcutería IV | 10 | 0 | 1 | 9 | 4 | ✅ | Cerrado el 2026-06-26: 10 activos y 18 purgas; `ganaderia-la-lejuca` baja de venta online heredada a `no comprobado`. |
| 10 | Fruta, verdura, huevos y legumbres | 26 | 0 | 6 | 20 | 12 | ✅ | Cerrado el 2026-06-26: 26 activos de 34 revisados, 8 purgas por vivero/servicio/tienda fuera de alcance o no productor. |
| 11 | Despensa artesanal y chocolate | 20 | 16 | 3 | 1 | 4 | ⬜ | Incluye patatas, mermeladas, fermentados, salsas, chocolate y despensa. Separar productor de tienda/marca. |
| 12 | Miel | 16 | 13 | 3 | 0 | 2 | ⬜ | Revisar DOP Miel de Liébana, apicultores personales, asociaciones y canales de pedido. |
| 13 | Pan y pastelería I | 29 | 29 | 0 | 0 | 0 | ⬜ | De `confiteria-blanco-hojaldres-de-torrelavega` a `panaderia-angel`. Mezcla de confiterías, obradores y primeras panaderías. |
| 14 | Pan y pastelería II | 29 | 29 | 0 | 0 | 0 | ⬜ | De `panaderia-avin` a `panaderia-menesa`. Muchas panaderías sin web; comprobar obrador antes de conservar. |
| 15 | Pan y pastelería III | 29 | 29 | 0 | 0 | 0 | ⬜ | De `panaderia-nel` a `pasteleria-casa-vejo`. Revisar cadenas, sedes y comercios con cafetería. |
| 16 | Pan y pastelería IV | 29 | 29 | 0 | 0 | 0 | ⬜ | De `pasteleria-delicatessen-sucre` a `sobaos-arce`. Entra el bloque de pastelerías y empieza sobaos/quesadas. |
| 17 | Pan y pastelería V | 27 | 15 | 10 | 2 | 3 | ⬜ | De `sobaos-casa-ibanez` a `panificadora-buelna`. Reauditar IGP Sobao Pasiego, verificados heredados y todos los `sí`. |
| 18 | Cierre transversal provincial | 469 | 423 | 40 | 6 | 28 | ⬜ | Recalcular tras lotes 1-17. Revisar duplicados, municipios/localidades, canales, evidencia completa, imágenes residuales y cobertura estricta. |

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo que se documente una razón explícita para pausar
  la provincia antes de cierre.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga o fusión tiene registro
  JSONL tipo `purge` o `merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente.
- Cada `Venta online=no` o `no comprobado` revisado tiene una razón clara en la
  evidencia o en la nota del lote cuando sea una excepción material.
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas usadas
  como prueba fuerte ni horarios que remitan a canales inexistentes.
- No quedan duplicados aparentes sin decisión explícita.
- Las imágenes se revisan solo después de estabilizar identidad y `slug`; si se
  purga una fila con `imagen`, se elimina el archivo referenciado cuando ya no
  lo use otra fila.
- `npx pnpm verify:data` pasa antes de dar por cerrado cualquier lote y antes
  del cierre provincial.
- Cuando las 469 filas iniciales hayan quedado cerradas, añadir
  `cantabria/cantabria` a `data/evidence/coverage.json` en el mismo cambio que
  complete la evidencia provincial.

## Decisiones que deben quedar especialmente anotadas

- Promociones desde registro sectorial a `verificado`: explicar qué fuente
  propia, perfil oficial o ficha individual supera el techo de `parcial`.
- Cualquier productor sin web propia que quede `verificado`: indicar la fuente
  verificadora concreta.
- Carnicerías, panaderías, pastelerías y cafeterías: documentar por qué son
  elaboradores/productores dentro de alcance.
- Conserveras con marca/distribución fuera de Cantabria: documentar dónde está
  la elaboración o por qué se conserva/purga.
- Cambios de `Venta online=sí` heredado a `no` o `no comprobado`.
- Purgas por no productor, cierre, duplicado, otra provincia o entidad sin
  rastro suficiente.

## Lote 2 - Lácteos y quesos (primer bloque)

Revisión de las 27 primeras filas de la categoría `Lácteos y quesos` tras el lote 1. Resultado editorial: 24 productores activos, 2 parciales, 22 verificados, 11 con venta online y 3 bajas/merge.

Decisiones relevantes:

- Corregidos de categoría: `granja-brenas` pasa a `Huevos`; `la-quesona` pasa a `Pan y pastelería`.
- Eliminados por no ser productor único: `casa-lel-queso-artesanal-de-cantabria` y `la-cabanuca-granja-degustacion`.
- Fusionado como duplicado: `granja-javier-campo` -> `queso-picon-de-tresviso-casa-campo-sc`.
- Venta online confirmada en 11 productores: 3 ecommerce, 7 marketplace y 1 mixto WhatsApp/marketplace.

Fuentes base del lote: Iparlat, Piélagos, Andros/ Gobierno de Cantabria, Lácteos El Carmen, Quesos Gomber, Granja Cudaña, Granja Santa Ana, Quesería El Pendo, La Quesona, Granja Las Nieves, Lácteos Bien Aparecida, Lácteos Colindres, La Cántara/El Pasiego, Quesería Alles, Quesería Andara, Quesos El Bardal, La Sobanuca, Quesería Lebanés, 3 Valles Pasiegos y Siete Villas. Las URL concretas quedan en `data/evidence/cantabria/cantabria.jsonl`.

Snapshot tras lote 2:

- Filas CSV: 460
- Verificación: 58 verificados, 35 parciales, 367 pendientes
- Venta online: 56 sí, 8 no, 396 no comprobado
- Canal de venta informado: 34/56 productores con `Venta online=sí`

## Lote 3 - Lácteos y quesos (segundo bloque)

Revisión del segundo bloque de 27 fichas de `Lácteos y quesos`. Resultado editorial: 24 productores activos, 23 verificados, 1 parcial, 20 con venta online y 3 bajas/merge.

Decisiones relevantes:

- Fusionados duplicados: `herederos-de-tomas-ruiz-s-l-la-cavada` -> `la-pasiega-de-pena-pelada`; `quesos-de-ruesga-s-l-la-estela-pena-quebrada` -> `quesos-de-ruesga`.
- Eliminado por no productor verificado: `queseria-la-castrena`, documentada como tienda/minorista sin obrador propio probado.
- Queda parcial `queseria-penalon` por falta de fuente propia actual, aunque hay rastro sectorial histórico.
- Se normalizan canales de venta para queserías con tienda propia o marketplace local.

## Lote 4 - Pescado y conservas (primer bloque)

Revisión de 27 fichas de pescado/conservas desde `anchoas-dobleuve` hasta `conservas-lolin`. Resultado editorial: 26 productores activos, 25 verificados, 1 parcial, 24 con venta online y 1 baja.

Decisiones relevantes:

- Eliminado `conservas-islas-cies` por cierre/subasta de la fábrica de El Astillero.
- `conservas-del-norte` queda parcial: solo se localiza ficha de lugar, sin fuente propia actual.
- La mayoría de conserveras mantienen actividad productora con tienda propia o pedido remoto; `conservas-hoyo-laredo` queda sin venta online comprobada.

## Lote 5 - Pescado y conservas (segundo bloque)

Revisión de 27 fichas de pescado/conservas desde `conservas-lotamar` hasta `consorcio-espanol-conservero`. Resultado editorial: 23 productores activos, 22 verificados, 1 parcial, 15 con venta online y 4 bajas/merge.

Decisiones relevantes:

- Fusionados duplicados: `conservas-sollagua` -> `conservas-velmar-sl`; `conservas-san-filippo` -> `anchoas-sanfilippo`.
- Eliminados: `conservas-maria-pilar-miguel-albo` por sociedad extinguida y `pescados-y-conservas-vegomar-s-l` por distribuidor/mayorista sin elaboración propia demostrada.
- `conservas-crespo` queda parcial porque consta como fabricante pero la nave quedó calcinada en 2025 y falta confirmar continuidad operativa.
- Se normalizan canales de venta para Don Bocarte, Casa Santoña, Consorcio, Las Toñas, Linda Playa, Montebuciero, Pujadó Solano y otras conserveras con tienda propia.

Snapshot tras lote 5:

- Filas CSV: 452
- Verificación: 128 verificados, 26 parciales, 298 pendientes
- Venta online: 107 sí, 7 no, 338 no comprobado
- Canal de venta informado: 93/107 productores con `Venta online=sí`
- Evidencia Cantabria: 145 registros JSONL

## Lote 6 - Charcutería (primer bloque)

Revisión de 28 fichas de charcutería desde `carnicas-campurriana-sl` hasta `carniceria-fermin`. Resultado editorial: 13 productores activos, 12 verificados, 1 parcial, 7 con venta online y 15 purgas.

Decisiones relevantes:

- Conservados como productores o elaboradores: `carnicas-campurriana-sl`, `carnicas-sito`, `carniceria-abel`, `carniceria-alberto`, `carniceria-angel-entrambasaguas`, `carniceria-anton`, `carniceria-charcuteria-la-venta`, `carniceria-cuca-santiurde`, `carniceria-ecologica-las-nieves`, `carniceria-en-santander-la-alqueria`, `carniceria-eno` y `carniceria-equina-fidel-navarro`.
- Queda parcial `carnicas-patino-carniceria`: consta como carnicería con sala de despiece, pero no se localizó fuente propia actual para verificar elaboración vigente.
- Eliminadas 15 filas de carnicería minorista o ficha insuficiente: `carnicas-merino`, `carniceria`, `carniceria-aurora`, `carniceria-avelino-hoyuela`, `carniceria-bra`, `carniceria-carlos-charcuteria`, `carniceria-charcuteria-castillo`, `carniceria-charcuteria-jesus`, `carniceria-charcuteria-jesus-castillo`, `carniceria-cupido-charcuteria`, `carniceria-diaz`, `carniceria-e-laso`, `carniceria-el-pasiego-geli-matamorosa`, `carniceria-ennour-halal` y `carniceria-fermin`.
- Venta remota confirmada: ecommerce en Ángel, La Venta y Cuca; teléfono en Antón y Las Nieves; ecommerce/WhatsApp en La Alquería; ecommerce/teléfono en Fidel Navarro.
- Se borra la imagen de `carniceria-charcuteria-jesus-castillo` al purgar la fila que la referenciaba.

Snapshot tras lote 6:

- Filas CSV: 437
- Verificación: 140 verificados, 27 parciales, 270 pendientes
- Venta online: 114 sí, 7 no, 316 no comprobado
- Canal de venta informado: 100/114 productores con `Venta online=sí`
- Evidencia Cantabria: 173 registros JSONL

## Lote 7 - Charcutería (segundo bloque)

Revisión de 28 fichas desde `carniceria-fernando` hasta `carniceria-mariana`. Resultado editorial: 7 productores activos, todos verificados, 4 con venta online y 21 purgas.

Decisiones relevantes:

- Conservados con fuente propia productora: `carniceria-guillermo`, `carniceria-javier`, `carniceria-jon-y-nagore`, `carniceria-juan-teran`, `carniceria-la-rivera`, `carniceria-lomillos` y `carniceria-los-arroyones`.
- Venta remota confirmada: ecommerce en Javier, Juan Terán y Los Arroyones; teléfono en La Rivera.
- `carniceria-lomillos` se conserva por elaborados propios, pero queda con venta online `no comprobado` porque la web no permitió confirmar pedido remoto vigente.
- Eliminadas 21 filas de carnicería minorista o ficha insuficiente, incluidas las carnicerías genéricas sin web/red propia ni prueba de obrador.
- Se borra la imagen de `carniceria-manolo` al purgar la fila que la referenciaba.

## Lote 8 - Charcutería (tercer bloque)

Revisión de 28 fichas desde `carniceria-mary` hasta `charcuteria-charo-y-juan`. Resultado editorial: 8 productores activos, 6 verificados, 2 parciales, 2 con venta online, 19 purgas y 1 merge.

Decisiones relevantes:

- Conservados como productores o elaboradores: `carniceria-pedro-2`, `carniceria-quintana`, `carniceria-rafa-colindres`, `carniceria-siglo-xxi`, `carniceria-y-charcuteria-jaime` y `casa-el-macho`.
- Quedan parciales `carniceria-miguel-2` y `carniceria-rivero`: hay rastro local específico, pero falta una fuente propia actual para verificarlas.
- Fusionado `carniceria-pepin` -> `carniceria-jon-y-nagore` por compartir web y ámbito comercial con la unidad productora ya verificada.
- `casa-el-macho` pasa de `Charcutería` a `Pan y pastelería`; es obrador de sobaos y quesadas con tienda online, no productor cárnico.
- Venta remota confirmada: ecommerce en `carniceria-quintana` y `casa-el-macho`.
- Se borra la imagen de `carniceria-pepin` al fusionar la fila.

## Lote 9 - Charcutería (cuarto bloque)

Revisión de 28 fichas de charcutería desde `charcuteria-joel-pastor` hasta `ganaderia-la-lejuca`. Resultado editorial: 10 productores activos, 9 verificados, 1 parcial, 4 con venta online y 18 purgas.

Decisiones relevantes:

- Conservados con fuente propia o rastro productor suficiente: `elaboracion-de-productos-carnicos-la-casona`, `embutidos-alto-del-cerro`, `embutidos-la-pepita-s-l`, `embutidos-meli-s-l`, `embutidos-pedro-y-ana-productos-tipicos-de-cantabria`, `fabrica-de-embutidos-el-lebaniego`, `fabrica-de-embutidos-jose-fernandez`, `pueblo-de-picos-productos-carnicos-de-cantabria` y `ganaderia-la-lejuca`.
- Queda parcial `embutidos-la-salada`: hay ficha específica, pero no fuente propia actual.
- Venta remota confirmada: ecommerce en Alto del Cerro, Pedro y Ana, El Lebaniego y José Fernández/Fermartín.
- `ganaderia-la-lejuca` sube a `verificado`, pero baja de `Venta online=sí` a `no comprobado` porque la hoja de pedido vigente aparecía cerrada/obsoleta.
- Eliminadas tiendas gourmet, charcuterías minoristas, restaurante/gastrojamón y filas sin prueba productora.
- Se borran las imágenes de `charcuteria-joel-pastor`, `charcuteria-yanis`, `charcuterias-mayte-s-l` y `la-antigua-embutidos-y-alimentacion-s-l`.

## Lote 10 - Fruta, verdura, huevos y legumbres

Revisión de 34 fichas de arándanos, huerta, huevos y legumbres. Resultado editorial: 26 productores activos, 20 verificados, 6 parciales, 12 con venta online y 8 purgas.

Decisiones relevantes:

- Conservados y verificados con fuente propia: Aranberry, El Valle de Machucón, Forestaciones Los Llanos/Forberry, Arándanos San Jorge, Arándanos Vallecillo, Hortalizas de Liébana, La Tierra del Norte, La Huerta de Manolita, Menguante, Pas Berry, Tarruco, Huevos Camperos del Asón, Granja AVH, Granja Avícola La Encina, Granja Brenas, La Huerta de Chaves, Finca Ecológica La Garita, Las Lindes, Silió Berries y Eco-Tierra Mojada.
- Quedan parciales `arandanos-finca-casares`, `arandanos-imanol`, `ekoberry-arandanos-ecologicos`, `hortalizas-de-los-valles-de-buelna-y-toranzo`, `huerta-ecologica-castaneda` y `huevos-la-gallinuca` por falta de fuente propia actual o web caída.
- Venta remota confirmada: ecommerce en Aranberry, El Valle de Machucón, Forestaciones Los Llanos, La Tierra del Norte y Silió Berries; marketplace en Tarruco; teléfono/WhatsApp en Menguante, Pas Berry, Huevos Camperos del Asón, La Huerta de Chaves, La Garita y Las Lindes.
- Eliminados por fuera de alcance o no productor alimentario directo: `cooperativa-valles-unidos-del-ason`, `huertas-ecologicas-de-soto-de-la-marina`, `la-huerta-de-manrique`, `avicola-cantabria`, `huevos-caseros`, `legumbres-el-leones`, `los-caricos` y `vivero-barbas`.
- Se borran las imágenes de `cooperativa-valles-unidos-del-ason`, `legumbres-el-leones` y `vivero-barbas`.

Snapshot tras lote 10:

- Filas CSV: 370
- Verificación: 178 verificados, 32 parciales, 160 pendientes
- Venta online: 131 sí, 5 no, 234 no comprobado
- Canal de venta informado: 122/131 productores con `Venta online=sí`
- Evidencia Cantabria: 290 registros JSONL
