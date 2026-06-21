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
| 2 | Lácteos y quesos I | 27 | 27 | 0 | 0 | 0 | ⬜ | De `andia-lacteos-de-cantabria` a `queseria-artesanal-siete-villas`. Priorizar DOP/IGP, granjas y queserías con web propia. |
| 3 | Lácteos y quesos II | 27 | 22 | 5 | 0 | 3 | ⬜ | De `queseria-ecologica-los-tiemblos` a `delicatessen-la-ermita`. Revisar duplicados de Ruesga y Javier Campo/Casa Campo. |
| 4 | Pescado y conservas I | 27 | 27 | 0 | 0 | 0 | ⬜ | De `anchoas-dobleuve` a `conservas-lolin`. Confirmar conservera real frente a marca, tienda o distribuidor. |
| 5 | Pescado y conservas II | 27 | 20 | 7 | 0 | 5 | ⬜ | De `conservas-lotamar` a `consorcio-espanol-conservero`. Reauditar todos los `sí` y el posible duplicado Sanfilippo. |
| 6 | Charcutería I | 28 | 28 | 0 | 0 | 0 | ⬜ | De `carnicas-campurriana-sl` a `carniceria-fermin`. Alto riesgo de carnicerías sin elaboración propia. |
| 7 | Charcutería II | 28 | 28 | 0 | 0 | 0 | ⬜ | De `carniceria-fernando` a `carniceria-mariana`. Revisar nombres genéricos y filas sin web/red. |
| 8 | Charcutería III | 28 | 28 | 0 | 0 | 0 | ⬜ | De `carniceria-mary` a `charcuteria-charo-y-juan`. Priorizar duplicados de municipios y pruebas de obrador. |
| 9 | Charcutería IV | 28 | 27 | 1 | 0 | 1 | ⬜ | De `charcuteria-joel-pastor` a `ganaderia-la-lejuca`. Incluye más fábricas/embutidos y la única venta heredada del bloque. |
| 10 | Fruta, verdura, huevos y legumbres | 33 | 27 | 3 | 3 | 4 | ⬜ | Incluye arándanos, huerta, huevos, legumbres y tres verificados heredados. Revisar ecológico y ventas por contacto. |
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
