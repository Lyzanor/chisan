# Verificación provincial de Jaén

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/andalucia/jaen.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila vive en `data/evidence/andalucia/jaen.jsonl` y se amplía a
medida que se revise cada lote.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento no
lo duplica, solo fija el snapshot, las particularidades de Jaén y el plan de
lotes. Los contratos viven en `docs/CSV_CONTRACT.md`,
`docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`.

Este ledger está pensado para que cualquier agente pueda seguirlo de forma
autónoma: lee "Reglas duras para Jaén", "Flujo por lote" y la fila del lote en
curso; no necesitas releer el manual entero por lote.

## Estado inicial

- Inicio: 2026-07-03.
- Snapshot inicial: **145 filas**; **7 `verificado`**, **2 `parcial`** y **136
  `pendiente`**.
- Venta online inicial: **3 `sí`**, 0 `no` y **142 `no comprobado`**.
- `Canal de venta`: **1/145 filas informado**. Solo
  `los-tres-manantiales-marmolejo` tiene `Venta online=sí` con
  `Canal de venta=ecommerce` y evidencia JSONL. Los otros 2 `sí` heredados
  (`embutidos-artesanos-la-abuela-laura-frailes` y
  `pasteleria-pascuala-navas-de-san-juan`) están en `pendiente` y sin canal:
  tratarlos como anomalía de venta hasta reauditar.
- Evidencia inicial: `data/evidence/andalucia/jaen.jsonl` existe con **1
  registro** (`los-tres-manantiales-marmolejo`, `keep`, 2026-06-30). Las otras 8
  filas no pendientes no tienen evidencia local suficiente y deben reauditarse en
  su lote.
- `data/evidence/coverage.json`: Jaén no está marcada como provincia con cobertura
  estricta.
- Imágenes: **0/145 filas con `imagen`** y la carpeta
  `public/productores/andalucia/jaen/` no tiene assets. No enriquecer imágenes
  hasta estabilizar identidad, `slug`, fusiones y purgas.
- Enlaces iniciales: 111/145 con `web`, 75/145 con `Instagram`, 14/145 con
  `Facebook`, 145/145 con `Google Maps`, 143/145 con `telefono`, 138/145 con
  `correo`, 145/145 con `direccion` y 145/145 con `lat`/`lon`.
- Calidad inicial:
  - `node scripts/audit-csv.js --mode=contract data/csv/andalucia/jaen.csv`
    devuelve **0 errores, 0 warnings, status OK**.
  - `node scripts/audit-csv.js --mode=quality --summary-only
    data/csv/andalucia/jaen.csv` devuelve **0 errores, 2 warnings** y 63 avisos
    suprimidos por opcionales ausentes.
- Warnings iniciales de geo-check:
  - `mo-molina-olivares-jaen`: 32,5 km de Jaén; centroide más cercano Alcaudete
    (0,6 km).
  - `panaderia-panciencia-segura-de-la-sierra`: 16,3 km de Segura de la Sierra;
    centroide más cercano Génave (0,0 km).
- Modo: primera pasada profunda. Prioridad: cerrar identidad, alcance, municipio,
  venta online y evidencia de las 145 filas heredadas antes de añadir candidatos
  nuevos.

Reparto por categoría del snapshot inicial:

| Categoría | Filas |
|---|---:|
| Aceite | 44 |
| Charcutería | 28 |
| Pan y pastelería | 25 |
| Aperitivos | 14 |
| Lácteos y quesos | 8 |
| Bodega | 6 |
| Miel | 6 |
| Aromáticas y condimentos | 4 |
| Conservas | 4 |
| Cerveza artesana | 3 |
| Fruta y verdura | 2 |
| Café | 1 |

## Avance tras lote 1

- Lote 1 cerrado: 2026-07-03.
- Snapshot tras lote 1: **145 filas**; **22 `verificado`**, **2 `parcial`** y
  **121 `pendiente`**.
- Venta online tras lote 1: **15 `sí`**, 0 `no` y **130 `no comprobado`**.
- `Canal de venta`: **13/145 filas informado**. Las 12 ventas `sí` resueltas en
  lote 1 quedan con `Canal de venta=ecommerce`; siguen pendientes las dos
  anomalías heredadas de La Abuela Laura y Pastelería Pascuala hasta sus lotes.
- Evidencia tras lote 1: **17 registros JSONL** en
  `data/evidence/andalucia/jaen.jsonl` (1 inicial + 15 `keep` del lote 1 + 1
  `merge` por corrección de slug).
- Decisiones clave del lote 1:
  - 15/15 filas cerradas como `verificado`; 0 purgas.
  - 12/15 con venta online `sí` vía `ecommerce`.
  - 3/15 quedan con venta online `no comprobado`: `arte-oleum-beas-de-segura`,
    `el-torito-bravo-aceite-de-oliva-virgen-extra-campillo-de-arenas` y
    `s-c-a-san-antonio-abad-arquillos`.
  - `s-c-a-san-antonio-abad-carcheles` se corrige a
    `s-c-a-san-antonio-abad-arquillos`; la fuente oficial sitúa la cooperativa en
    Arquillos, no en Cárcheles.
  - Se normalizan direcciones/contactos de Unolivo, Cortijo de la Torre, Haza La
    Centenosa, Pradolivo, Oleícola San Francisco, La Perla de Mágina, Trujal del
    Mágina, Aceites Sierra Sur, SCA San Roque de Cárcheles y Vadolivo.
  - La antigua web de Virgen de la Campiña se sustituye por la página canónica de
    El Trovador para la Cooperativa Agraria San Roque de Arjonilla.

## Avance tras lotes 2-5

- Lotes 2-5 cerrados: 2026-07-03.
- Snapshot tras lotes 2-5: **145 filas**; **63 `verificado`**, **17 `parcial`**
  y **65 `pendiente`**.
- Venta online tras lotes 2-5: **48 `sí`**, 0 `no` y **97 `no comprobado`**.
- `Canal de venta`: **47/145 filas informado**. Queda una anomalía heredada
  fuera de estos lotes (`pasteleria-pascuala-navas-de-san-juan`) hasta el lote 7.
- Evidencia tras lotes 2-5: **73 registros JSONL** en
  `data/evidence/andalucia/jaen.jsonl`.
- Decisiones clave:
  - Aceite II: 13/14 filas `verificado`, 1 `parcial`, 11 ventas online
    resueltas.
  - Aceite III: 14/15 filas `verificado`, 1 `parcial`, 12 ventas online
    resueltas; `los-tres-manantiales-marmolejo` queda revalidado.
  - Charcutería I: 9/14 filas `verificado`, 5 `parcial`, 7 ventas online
    resueltas; `embutidos-artesanos-la-abuela-laura-frailes` queda como
    `marketplace` y ya no tiene canal vacío.
  - Charcutería II: 6/14 filas `verificado`, 8 `parcial`, 5 ventas online
    resueltas.
  - `cooperativa-hortofruticola-san-marcos-torres` pasa de `Charcutería` a
    `Fruta y verdura` porque la fila describe cerezas de Torres, no cárnicos.
  - `mo-molina-olivares-jaen` se verifica por web oficial y Degusta Jaén, pero se
    conserva documentado el warning geográfico: la ficha institucional sostiene
    Jaén capital y a la vez publica una coordenada cerca de Alcaudete.
  - Se normalizan enlaces/canales de venta para Don Verde Vida, Sensolive, Pico
    Cabañas, Oleocampo, Bravoleum, Toledano/La Fábrica, Carnes J. Madrid y
    Embutidos Gómez.

## Zonas de Jaén para lotear

- **Sierra Sur y Alcalá**: Alcalá la Real, Alcaudete, Frailes, Noalejo,
  Valdepeñas de Jaén, Cabra del Santo Cristo, Campillo de Arenas, Cárcheles y
  entorno. Aceite, queserías, embutidos, vino y obradores.
- **Sierra Mágina y centro-sur**: Cambil, Huelma, Jimena, Mancha Real, Torres,
  Jamilena y Martos. Aceite DOP Sierra Mágina, panadería y pequeños elaboradores.
- **Campiña Norte, Andújar y La Loma**: Andújar, Arjona, Arjonilla, Bailén,
  Baeza, Begíjar, Jabalquinto, Lahiguera, Torredelcampo, Torredonjimeno, Úbeda,
  Villatorres y Villanueva de la Reina. Almazaras, snacks, panadería y cárnicos.
- **Capital y área metropolitana**: Jaén y su entorno inmediato. Concentra 16
  filas y mezcla almazaras/marcas, cárnicos, obradores, aperitivos y posibles
  errores de municipio.
- **Sierra de Cazorla, Segura y Las Villas**: Beas de Segura, Cazorla, La Puerta
  de Segura, Orcera, Peal de Becerro, Pozo Alcón, Puente de Génave, Quesada,
  Santiago-Pontones, Segura de la Sierra, Siles, Villacarrillo y Villanueva del
  Arzobispo. Aceite DOP, cordero/embutido, miel, queserías y obradores.
- **El Condado y norte**: La Carolina, Navas de San Juan, Santisteban del Puerto,
  Vilches y Montizón. Aromáticas, conservas, aceite, dulces y posibles productores
  de escala pequeña con poca huella web.

## Reglas duras para Jaén

1. **Reauditar también las filas no pendientes.** Hay 7 `verificado` y 2
   `parcial`, pero solo una fila tiene evidencia JSONL. Cuando llegue su lote,
   cada una debe quedar con evidencia `keep`, mantenerse/ajustarse o degradarse si
   la fuente no sostiene identidad, actividad productora y municipio.
2. **Resolver los 3 `sí` heredados.** `los-tres-manantiales-marmolejo` ya tiene
   canal y evidencia, pero puede revalidarse en Aceite III. `La Abuela Laura` y
   `Pastelería Pascuala` no pueden seguir como `sí` sin `Canal de venta`: confirmar
   canal vigente o volver a `no comprobado`.
3. **Aceite domina la provincia.** Entran almazaras, cooperativas con actividad
   oleícola real, fincas/productores con elaboración propia o marcas ligadas a
   molino. Distinguir de envasador, comercializadora, distribuidor, marca blanca o
   industrial B2B sin productor Km0 claro.
4. **Los consejos y sellos apoyan, no sustituyen.** DOP/IGP y registros sectoriales
   sirven para existencia y encaje, pero `verificado` necesita fuente propia, ficha
   individual fiable o match claro de entidad, actividad y municipio.
5. **Vigilar categorías arrastradas.** `Aguas Sierra Cazorla` no debería cerrarse
   como `Bodega` sin revisar si corresponde a bebidas/agua; vermuts pueden requerir
   `Licores` o `Bebidas`; `Heladería Lalola` puede ser `Helados`; `Artechoc` y
   `Chocolivate` pueden estar mejor fuera de `Miel`; `Salinas Don Diego` en
   `Pan y pastelería` exige revisión de alcance real.
6. **Charcutería no equivale a carnicería.** Mantener carnicerías solo si hay
   obrador, secadero, elaboración propia o marca productora acreditada. Si solo es
   despacho/minorista, máximo `parcial` o purga según evidencia.
7. **Pan y pastelería exige obrador.** Confirmar horno, confitería, obrador o
   fabricación propia. Cafeterías, despachos y puntos de venta sin elaboración
   demostrada no deben cerrarse como `verificado`.
8. **Aperitivos mezcla artesanos e industria.** Patatas, aceitunas, garrapiñadas,
   pistachos y snacks deben revisarse por unidad productiva local. Un grupo
   alimentario nacional o marca adquirida no queda dentro por defecto si la
   actividad local/productora no es clara.
9. **Lácteos y quesos son el bloque heredado más avanzado.** No asumir que los 6
   `verificado` son definitivos: añadir evidencia completa, revisar los 2
   `parcial` y confirmar venta remota sin rellenar canales por inercia.
10. **Miel, chocolate y aromáticas requieren productor real.** Confirmar apicultor
    con colmenas propias, elaborador de chocolate/confitería, cultivo/envasado de
    aromáticas o actividad agrícola propia; no basta un comercio gourmet.
11. **Resolver los dos geo-warnings en su lote.** Si la coordenada apunta a un
    municipio real distinto, corregir `municipio`; si es un caso de centroide,
    documentarlo o añadir override. No mover coordenadas a ojo.
12. **No añadir candidatos nuevos durante esta pasada** salvo decisión explícita.
    Primero cerrar las 145 filas heredadas, evidencia y deduplicación.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la comprobación de una fuente propia o ficha
real cuando la decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Degusta Jaén / Diputación de Jaén** y sellos provinciales como Jaén Selección:
  anclas útiles de descubrimiento y contraste provincial.
- **IGP Aceite de Jaén**, **DOP Sierra de Cazorla**, **DOP Sierra Mágina** y
  **DOP Sierra de Segura**: almazaras, cooperativas, marcas amparadas y contexto
  oleícola.
- **Vino de la Tierra / IGP Sierra Sur de Jaén** y fuentes de bodegas locales:
  Marcelino Serrano, Campoameno, vermuts y bebidas; revisar recategorizaciones.
- **IGP Cordero Segureño** y fuentes de Sierra de Segura/Cazorla: apoyo para
  cárnicos, pero no sustituye prueba de obrador/secadero o venta.
- **Gusto del Sur / Calidad Certificada / Landaluz / CAAE**: registros andaluces
  útiles para existencia, certificación y razón social; por sí solos suelen
  sostener como máximo `parcial`.
- Webs, tiendas, perfiles oficiales y fichas reales de Google Maps ya presentes
  en el CSV: primera fuente si pertenecen claramente al productor.
- Ayuntamientos, comarcas, turismo de Sierra Mágina, Sierra de Segura/Cazorla,
  Sierra Sur, prensa local y ferias agroalimentarias: fuentes secundarias para
  resolver dudas, nunca sustituto único si actividad productora, municipio o venta
  quedan materialmente dudosos.

## Plan de ejecución

Lotes agrupados por sector y riesgo. Tamaño objetivo: 10-15 filas salvo cierre.
Los lotes 1-11 cubren el snapshot inicial de 145 sin solaparse; el lote 12 es
cierre transversal.

1. **Lotes 1-3: Aceite (44 filas).** Sector dominante. Dividir en tres bloques en
   el orden actual de la categoría para cerrar rápido DOP/IGP, almazaras,
   cooperativas y marcas. Resolver el geo-warning de `mo-molina-olivares-jaen` en
   el lote 2 y reauditar `los-tres-manantiales-marmolejo` en el lote 3.
2. **Lotes 4-5: Charcutería (28 filas).** Separar obrador/secadero/productor de
   carnicería o despacho; resolver el `sí` heredado de La Abuela Laura en el lote
   4.
3. **Lotes 6-7: Pan y pastelería (25 filas).** Obradores de Jaén/Linares y resto
   provincial; resolver el `sí` heredado de Pastelería Pascuala y el geo-warning
   de `panaderia-panciencia-segura-de-la-sierra` en el lote 7.
4. **Lote 8: Aperitivos (14 filas).** Patatas, aceitunas, garrapiñadas,
   pistachos y snacks; triaje de industria/grupo vs elaborador local.
5. **Lote 9: Lácteos y quesos + Miel (14 filas).** Reauditar los 8 lácteos y
   cerrar apicultores/chocolate/miel con fuente propia o `parcial` documentado.
6. **Lote 10: Bodega + Cerveza artesana + Café (10 filas).** Bodegas, vermuts,
   cerveza y café; recategorizar agua/vermut cuando corresponda.
7. **Lote 11: Conservas + Aromáticas y condimentos + Fruta y verdura (11 filas).**
   Lote heterogéneo para gazpacho, conservas, ajo, stevia, aromáticas, hortícola
   y San Marcos; distinguir productor/elaborador de comercio o distribuidor.
8. **Lote 12: cierre transversal.** Objetivo: 0 pendientes, `Canal de venta` en
   todos los `sí`, evidencia coherente para filas activas, purgas/fusiones
   documentadas, deduplicación, geo-warnings resueltos o aceptados e imágenes
   listas para enriquecimiento posterior.

## Worklist inicial

Leyenda: `Pendiente`, `En curso`, `Hecho`. Los lotes parten por categoría en el
orden actual del CSV; **congela los `slug` al iniciar cada lote**. Si un lote
fusiona, purga o recategoriza filas, recalcula los bloques siguientes antes de
iniciarlos. El lote 12 es auditoría transversal y puede revisar filas ya tocadas.

Las columnas `Pend./Parcial/Verif./VO=sí` reflejan el **contenido inicial del
lote**, no el resultado; se actualizan al cerrar cada lote.

| # | Lote | Alcance | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Aceite I | Primeras 15 filas de `Aceite` en orden CSV | 15 | 0 | 0 | 15 | 12 | Hecho | Cerrado el 2026-07-03: 15 `verificado`, 12 `ecommerce`, 3 venta `no comprobado`; corrección de slug/municipio San Antonio Abad Cárcheles -> Arquillos; 0 purgas. |
| 2 | Aceite II | Siguientes 14 filas de `Aceite` | 14 | 0 | 1 | 13 | 11 | Hecho | Cerrado el 2026-07-03: `nuestro-aroma-cazorla` queda `parcial`; se acepta/documenta el geo-warning de `mo-molina-olivares-jaen`; 0 purgas. |
| 3 | Aceite III | Resto de `Aceite` | 15 | 0 | 1 | 14 | 12 | Hecho | Cerrado el 2026-07-03: `senorio-de-las-almenas-ubeda` queda `parcial`; `los-tres-manantiales-marmolejo` revalidado; 0 purgas. |
| 4 | Charcutería I | Primeras 14 filas de `Charcutería` | 14 | 0 | 5 | 9 | 7 | Hecho | Cerrado el 2026-07-03: La Abuela Laura queda `sí` vía `marketplace`; carnicerías sin fuente fuerte quedan `parcial`; 0 purgas. |
| 5 | Charcutería II | Resto de `Charcutería` congelado al inicio | 14 | 0 | 8 | 6 | 5 | Hecho | Cerrado el 2026-07-03: San Marcos recategorizado a `Fruta y verdura`; carnicerías sin fuente fuerte quedan `parcial`; 0 purgas. |
| 6 | Pan y pastelería I | Primeras 13 filas de `Pan y pastelería` | 13 | 13 | 0 | 0 | 0 | Pendiente | Jaén capital, Guarromán, Jódar y Linares inicial; obrador vs despacho. |
| 7 | Pan y pastelería II | Resto de `Pan y pastelería` | 12 | 12 | 0 | 0 | 1 | Pendiente | Resolver `pasteleria-pascuala-navas-de-san-juan` (`sí` sin canal) y `panaderia-panciencia-segura-de-la-sierra` geo-warning. |
| 8 | Aperitivos | `Aperitivos` | 14 | 14 | 0 | 0 | 0 | Pendiente | Patatas, aceitunas, pistachos, snacks y garrapiñadas; triaje de industria/grupo vs productor local. |
| 9 | Lácteos, quesos y miel | `Lácteos y quesos`, `Miel` | 14 | 6 | 2 | 6 | 0 | Pendiente | Reauditar todos los no pendientes; revisar `Heladería Lalola`, `Artechoc` y `Chocolivate` por posible recategorización. |
| 10 | Bodega, cerveza y café | `Bodega`, `Cerveza artesana`, `Café` | 10 | 10 | 0 | 0 | 0 | Pendiente | Bodegas, vermuts, cerveza, café y `Aguas Sierra Cazorla`; recategorizar cuando el producto real no sea bodega. |
| 11 | Conservas, aromáticas y fruta | `Conservas`, `Aromáticas y condimentos`, `Fruta y verdura` | 11 | 10 | 1 | 0 | 0 | Pendiente | Gazpacho, aceitunas/conservas, stevia, aromáticas, ajo, hortícola y San Marcos; confirmar productor/elaborador real. |
| 12 | Cierre transversal provincial | Todas | 145 | 65 | 17 | 63 | 48 | Pendiente | 0 pendientes; evidencia completa; ventas online con canal; dedup; geo; imágenes preparadas para fase posterior; decidir `coverage.json`. |

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   npx pnpm list:province jaen
   ```

2. Tomar el primer lote `Pendiente` de la worklist y congelar sus `slug` antes de
   investigar. Para lotes por categoría, usar el orden actual del CSV dentro de
   esas categorías:

   ```bash
   node --input-type=module - <<'JS'
   import fs from "node:fs";
   import { parse } from "csv-parse/sync";

   const PATH = "data/csv/andalucia/jaen.csv";
   const CATS = new Set(["Aceite"]); // ajustar por lote

   const rows = parse(fs.readFileSync(PATH, "utf8"), {
     columns: true,
     skip_empty_lines: true,
   });

   for (const r of rows.filter((row) => CATS.has(row.categoria))) {
     console.log(
       r.slug, "|", r.verificacion, "| VO=", r["Venta online"],
       "|", r.municipio, "| web=", Boolean(r.web),
       "| ig=", Boolean(r.Instagram), "| maps=", Boolean(r["Google Maps"])
     );
   }
   JS
   ```

3. Priorizar dentro del lote: duplicados/fusiones, no productores, categorías
   materialmente erróneas, warnings de municipio/coordenadas, `sí` sin canal,
   enlaces ajenos/directorios, luego pendientes con fuente propia fácil.
4. Investigar hasta evidencia suficiente. Detenerse cuando identidad, actividad
   productora, municipio y venta remota estén decididos.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote.
6. Añadir o sustituir una línea JSONL para cada fila con alta de evidencia, cambio
   de `verificacion`, cambio de `Venta online`, canal, purga o fusión. Para una
   fila `verificado`, la evidencia debe sostener `identity`, `producer-activity`
   y `municipality`, no solo `online-sales`.
7. Validar durante la iteración:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   git diff --check
   ```

8. Al cerrar un lote o un bloque de lotes:

   ```bash
   npx pnpm verify:data
   ```

9. Actualizar este ledger: snapshot si cambia, estado del lote, fecha y nota corta
   con verificadas, parciales, purgas/fusiones, ventas resueltas y residuales.

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada para pausar.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga/fusión tiene registro
  `purge`/`merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente; los dos `sí` heredados sin canal quedan resueltos.
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas como prueba
  fuerte ni categorías/municipios claramente erróneos sin corregir.
- Los geo-warnings iniciales quedan corregidos, aceptados con motivo o trasladados
  a override si el problema es de centroide.
- No quedan duplicados aparentes sin decisión explícita.
- Las imágenes se enriquecen solo después de estabilizar identidad y `slug`.
- `npx pnpm verify:data` pasa antes del cierre provincial.
- Cuando las 145 filas iniciales queden cerradas y la evidencia cubra filas
  activas, purgas y fusiones, decidir si añadir `andalucia/jaen` a
  `data/evidence/coverage.json` en el mismo cambio.

## Decisiones que deben quedar especialmente anotadas

- Grandes aceiteras, envasadores o marcas: por qué entran como productor Km0 o por
  qué salen por escala/actividad B2B/distribución.
- Promociones de DOP/IGP/directorio a `verificado`: qué fuente individual supera
  el techo de `parcial`.
- Los 2 `sí` heredados sin canal y cualquier nuevo `no comprobado` -> `sí`.
- Cambios de categoría en bebidas, vermuts, helados, chocolate/miel, salinas,
  aromáticas o aperitivos.
- Carnicería-despacho vs obrador/secadero en `Charcutería`.
- Obrador real vs despacho/cafetería en `Pan y pastelería`.
- Cualquier fila verificada sin web propia: fuente exacta que sostiene identidad,
  actividad y municipio.
- Purgas por no productor, industrial/B2B, duplicado, cierre, otra provincia o
  ausencia suficientemente contrastada.
- Normalizaciones de municipio y resolución de los geo-warnings de Jaén/Alcaudete
  y Segura de la Sierra/Génave.
