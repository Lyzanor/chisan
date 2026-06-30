# Verificación provincial de Almería

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/andalucia/almeria.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila debe vivir en
`data/evidence/andalucia/almeria.jsonl` a medida que se revise cada lote.

## Estado inicial

- Inicio: 2026-06-30.
- Snapshot inicial: 102 filas; 0 `verificado`, 0 `parcial`,
  102 `pendiente`.
- Venta online inicial: 1 `sí`, 0 `no`, 101 `no comprobado`.
- `Canal de venta`: 0/102 filas informado. La única fila con
  `Venta online=sí` (`quesos-monteagud-uleila-del-campo`) debe reauditarse
  al principio de su lote y quedar con canal (`ecommerce`, `whatsapp`,
  `email`, `telefono`, `suscripcion` o `marketplace`) o corregirse.
- Imágenes: 67/102 filas con `imagen`, 35 sin imagen. Revisar imágenes solo
  después de estabilizar identidad, `slug`, fusiones y purgas.
- Enlaces iniciales: 91/102 filas con `web`, 53/102 con `Facebook`,
  40/102 con `Instagram`, 102/102 con `Google Maps`.
- Calidad inicial: `node scripts/audit-csv.js --mode=quality --summary-only
  data/csv/andalucia/almeria.csv` devuelve 0 errores, 7 warnings y
  49 avisos suprimidos por opcionales ausentes.
- Warnings iniciales de geo-check: revisar municipio/coordenadas de
  `antigua-alcoholera-almeria`, `bodega-lauricius-almeria`,
  `bodega-palomillo-almeria`, `huertaiberika-almeria`,
  `la-gergalena-almeria`, `salinas-de-cabo-de-gata-nijar` y
  `umai-quinto-sabor-almeria`.
- Evidencia inicial: no existe todavía
  `data/evidence/andalucia/almeria.jsonl`.
- Modo: pasada profunda inicial. No añadir nuevos candidatos durante esta
  primera revisión salvo decisión explícita; primero cerrar la calidad de las
  102 filas heredadas.
- Tras lote 1 (2026-06-30): 102 filas activas; 10 `verificado`, 6 `parcial`,
  86 `pendiente`. Venta online: 7 `sí`, 0 `no`, 95 `no comprobado`; 7/7
  filas con `Venta online=sí` tienen `Canal de venta=ecommerce`. Evidencia:
  16 registros en `data/evidence/andalucia/almeria.jsonl`. Calidad:
  0 errores, 7 warnings y 48 opcionales suprimidos.
- Tras lote 2 (2026-06-30): 102 filas activas; 27 `verificado`, 9 `parcial`,
  66 `pendiente`. Venta online: 21 `sí`, 0 `no`, 81 `no comprobado`; 21/21
  filas con `Venta online=sí` tienen canal. Evidencia: 36 registros. Calidad:
  0 errores, 7 warnings y 48 opcionales suprimidos.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`. Cada lote debe
revisar identidad, actividad productora, municipio, enlaces conservados, venta
online y canal; editar solo sus filas; añadir evidencia JSONL para decisiones
materiales; y cerrar con `npx pnpm verify:data`.

## Reglas duras para Almería

1. Todas las filas parten en `pendiente`: no dar por buena ninguna web, red,
   ficha de Maps, imagen, coordenada ni venta online heredada.
2. Muchas descripciones parecen templadas. Reescribir solo cuando una fuente
   permita una descripción más precisa; no inventar historia, gama ni venta.
3. `Sabores Almería` y otros directorios institucionales ayudan a identificar
   entidades, pero por sí solos solo sostienen `parcial`. Para `verificado`
   hace falta fuente propia, perfil oficial, ficha real de Google o
   marketplace verificable.
4. Revisar topónimos menores con cuidado: San Isidro de Níjar, Campohermoso,
   La Cañada, El Alquián, La Gangosa, El Hijate, Los Guiraos, Los Lujos,
   Los Navarros, El Bobar, Burjulú y Venta del Pobre pueden aparecer como
   núcleo/localidad. Corregir `municipio` solo con evidencia clara y validando
   el geo-check.
5. En hortofrutícolas y cooperativas, distinguir productor, central,
   comercializadora y marca B2B. Una empresa agrícola real puede conservarse,
   pero no afirmar venta directa u online sin canal vigente.
6. En charcutería y jamón, distinguir fábrica/secadero/obrador de carnicería
   minorista. Una carnicería solo entra si hay elaboración propia, secadero,
   sala o marca productora demostrada.
7. En bodegas, licores y cerveza, confirmar elaborador real, ubicación
   provincial y canal de venta. Las rutas turísticas, directorios y tiendas de
   terceros no prueban venta online propia.
8. En aceite, frutos secos y encurtidos, confirmar almazara, explotación,
   cooperativa o elaborador. No convertir una marca, distribuidor o tienda
   sin producción propia en `verificado`.
9. Un `maps/search/?api=1&query=...` autogenerado no es evidencia editorial
   fuerte. Para filas verificadas, intentar conservar una ficha real o aportar
   otra fuente verificadora en el JSONL.
10. Un sitio HTTP, certificado roto, timeout o bloqueo no prueba baja. Buscar
    por nombre, municipio, teléfono, correo o marca antes de blanquear web o
    purgar.
11. No enriquecer imágenes en bloque. Si una fila se purga, eliminar su
    imagen referenciada; si se mantiene, revisar logo/imagotipo al final de
    la pasada o con `enrich:images --apply --slug <slug>` solo tras inspección.

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   npx pnpm list:province almeria
   ```

2. Tomar el primer lote `⬜` de la worklist y congelar sus `slug` antes de
   investigar. Para lotes por categoría, usar el orden actual del CSV dentro
   de esas categorías:

   ```bash
   node --input-type=module - <<'JS'
   import fs from "node:fs";
   import { parse } from "csv-parse/sync";

   const PATH = "data/csv/andalucia/almeria.csv";
   const CATS = new Set(["Charcutería"]); // ajustar por lote

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

3. Priorizar dentro del lote: duplicados y no productores, warnings de
   municipio/coordenadas, `Venta online=sí`, enlaces de directorios o terceros,
   luego pendientes con fuente propia fácil de comprobar.
4. Investigar hasta evidencia suficiente. Detenerse cuando identidad,
   actividad productora, municipio y venta remota estén decididos.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote. Crear `data/evidence/andalucia/almeria.jsonl` en el primer
   lote que cierre decisiones.
6. Añadir o sustituir una línea JSONL para cada fila con alta de evidencia,
   cambio de `verificacion`, cambio de `Venta online`, canal, purga o fusión.
7. Validar durante la iteración:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   ```

8. Al cerrar el lote:

   ```bash
   npx pnpm verify:data
   ```

9. Actualizar este ledger: snapshot si cambia, estado del lote, fecha y nota
   corta con verificadas, parciales, purgas/fusiones, ventas resueltas y
   residuales.

## Fuentes de cotejo iniciales

Estas fuentes orientan la búsqueda, pero no sustituyen la comprobación de una
fuente propia o ficha real cuando la decisión sea `verificado`.

- Webs, tiendas y perfiles oficiales ya presentes en el CSV: primera fuente
  cuando pertenezcan claramente al productor.
- Ficha real de Google Maps: útil para identidad, ubicación, actividad y cierre
  aparente; no usar una URL de búsqueda autogenerada como prueba fuerte.
- `Sabores Almería` y Diputación de Almería: directorio institucional útil para
  existencia, municipio, categoría y contacto; como fuente única capar en
  `parcial`.
- Producción ecológica y operadores alimentarios: REGOE estatal, Junta de
  Andalucía, certificadoras y registros sectoriales cuando haya match de
  entidad.
- Aceite, almendra, aceituna y encurtidos: webs de almazaras/cooperativas,
  registros de calidad, tiendas propias y fichas oficiales.
- Vino, licores y cerveza: consejos o indicaciones geográficas aplicables,
  rutas de vino solo como apoyo, webs/tiendas oficiales y perfiles de bodega.
- Jamón, embutidos y cárnicas: IGP/sector Jamón de Serón si aplica, webs de
  secaderos/fábricas, registros sanitarios publicados y perfiles oficiales.
- Hortofrutícolas: IGP Tomate La Cañada si aplica, cooperativas, centrales,
  marcas comerciales y fuentes propias; distinguir venta al consumidor de B2B.
- Quesos, miel, pan, pescado, salinas y despensa: fuentes propias, registros
  de productores, ayuntamientos/comarcas y prensa local solo como apoyo.

## Plan de ejecución

1. Lote 1: categorías pequeñas y la única venta online heredada. Objetivo:
   crear el JSONL, fijar el estándar local y resolver `quesos-monteagud`.
2. Lotes 2-3: aceite, frutos secos, bodega y bebidas. Objetivo: aprovechar
   fuentes sectoriales claras y resolver los warnings geográficos de bodegas.
3. Lote 4: charcutería y jamón. Objetivo: separar productores/secaderos de
   carnicerías o comercios minoristas.
4. Lotes 5-6: hortofrutícolas y conservas. Objetivo: revisar cooperativas,
   marcas B2B, directorios institucionales y warnings de ubicación.
5. Lote 7: cierre transversal. Objetivo: 0 pendientes, ventas online con canal,
   evidencia coherente, imágenes revisadas y geo-warnings resueltos o
   documentados.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes 1-6 cubren el
snapshot inicial de 102 filas sin solaparse. El lote 7 es una auditoría
transversal de cierre y puede revisar filas ya tocadas.

| # | Lote | Categorías | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Lácteos, miel, pan, pescado y despensa | `Lácteos y quesos`, `Miel`, `Pan y pastelería`, `Pescado`, `Despensa artesanal`, `Helados` | 16 | 0 | 6 | 10 | 7 | ✅ | Cerrado el 2026-06-30: 10 verificadas, 6 parciales, 7 ecommerce confirmados. Corrige categorías de La Tautila, La Velezana, El Castillico, Guada, Pichote y Salinas; retira webs no verificables o ajenas; Salinas mantiene geo-warning documentado. |
| 2 | Aceite, frutos secos y encurtidos | `Aceite`, `Frutos secos`, `Aceitunas y encurtidos` | 20 | 0 | 3 | 17 | 14 | ✅ | Cerrado el 2026-06-30: 17 verificadas, 3 parciales, 14 ventas remotas confirmadas. Corrige Castillo de Tabernas a almazara de Tabernas, Luxeapers a Nacimiento, Productos Robles a `Aceite y frutos secos` y Natural Crunch/Vitasnack a `Aperitivos`; La Zalea y Frutos Secos Martínez retiran directorio institucional del campo `web`; Verde Calas queda como canal `telefono`. |
| 3 | Bodega, cerveza y bebidas | `Bodega`, `Cerveza artesana` | 23 | 23 | 0 | 0 | 0 | ⬜ | Incluye warnings de `antigua-alcoholera-almeria`, `bodega-lauricius-almeria` y `bodega-palomillo-almeria`. |
| 4 | Charcutería y jamón | `Charcutería` | 17 | 17 | 0 | 0 | 0 | ⬜ | Separar secaderos/fábricas de carnicerías; revisar concentración de Serón, María, Campohermoso y El Hijate. |
| 5 | Fruta y verdura | `Fruta y verdura` | 15 | 15 | 0 | 0 | 0 | ⬜ | Revisar cooperativas, centrales y marcas B2B; incluye warning de `huertaiberika-almeria`. |
| 6 | Conservas y elaborados vegetales | `Conservas` | 11 | 11 | 0 | 0 | 0 | ⬜ | Incluye warnings de `la-gergalena-almeria` y `umai-quinto-sabor-almeria`; revisar elaborador real vs marca/comercializadora. |
| 7 | Cierre transversal provincial | Todas | 102 | 102 | 0 | 0 | 1 | ⬜ | Auditar duplicados, canales, enlaces ajenos, imágenes, evidencia, geo-warnings residuales y criterios de cierre. |

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo pausa explícita documentada.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga o fusión tiene registro
  JSONL tipo `purge` o `merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente.
- Cada `Venta online=no` o `no comprobado` revisado tiene una razón clara en la
  evidencia o en la nota del lote cuando sea una excepción material.
- No quedan enlaces ajenos, dominios aparcados, URLs inventadas, fichas Maps
  genéricas usadas como prueba fuerte ni horarios que remitan a canales
  inexistentes.
- No quedan duplicados aparentes sin decisión explícita.
- Las 7 advertencias iniciales de geo-check están corregidas o justificadas.
- Imágenes revisadas después de estabilizar identidad y `slug`; ninguna fila
  purgada conserva imagen huérfana.
- `npx pnpm verify:data` pasa antes de considerar cerrada la provincia.
