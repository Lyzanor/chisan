# Verificación provincial de Huelva

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/andalucia/huelva.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila debe vivir en `data/evidence/andalucia/huelva.jsonl` a
medida que se revise cada lote (el fichero aún no existe; se crea en el lote 1
que cierre decisiones).

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento no
lo duplica, solo fija el snapshot, las particularidades de Huelva y el plan de
lotes. Los contratos viven en `docs/CSV_CONTRACT.md`,
`docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`.

Este ledger está pensado para que cualquier agente pueda seguirlo de forma
autónoma: lee "Reglas duras para Huelva", "Flujo por lote" y la fila del lote en
curso; no necesitas releer el manual entero por lote.

## Estado

- Inicio: 2026-07-01.
- Snapshot inicial: **134 filas**; 0 `verificado`, 0 `parcial`, **134
  `pendiente`**.
- Venta online inicial: **0 `sí`, 0 `no`, 134 `no comprobado`**.
- `Canal de venta`: **0/134 filas informado**. Como no hay `Venta online=sí`
  heredados, no hay cuarentena masiva de venta online; cada `sí` que aparezca
  debe quedar con canal válido (`ecommerce`, `whatsapp`, `email`, `telefono`,
  `suscripcion` o `marketplace`) y evidencia actual.
- **Anomalía clave: todo está pendiente, pero el riesgo no es homogéneo.** Huelva
  mezcla productores muy claros (DOP Jabugo, bodegas del Condado, IGP Garbanzo,
  salazones/mojama) con muchas filas hortofrutícolas y de panadería de capital
  que pueden ser centrales, exportadores B2B, tiendas, sucursales o negocios con
  presencia pública muy débil. La primera pasada debe separar productor/elaborador
  real de comercio, restaurante, marca sin unidad productiva o colectivo no
  productor.
- Reparto por categoría (11): **Fruta y verdura 38**, **Pan y pastelería 29**,
  **Aceite 16**, **Charcutería 12**, **Pescado 9**, **Helados 8**, **Bodega 7**,
  **Miel 7**, **Cerveza artesana 3**, **Lácteos y quesos 3**, **Legumbres 2**.
  Fruta/berries y panadería suman 67/134 = 50% del catálogo.
- Territorio: **37 municipios**. Cabeceras: Huelva 43, Aracena 8, Almonte 6,
  Bollullos Par del Condado 6, Moguer 6, Palos de la Frontera 6, Gibraleón 5,
  Lepe 5, Isla Cristina 4 y Rociana del Condado 4. La capital concentra
  panaderías, heladerías y varias frutas/berries con riesgo de municipio heredado
  incorrecto.
- Imágenes: **79/134 con `imagen`, 55 sin imagen**. Huecos principales: Pan y
  pastelería 22, Fruta y verdura 14, Helados 7, Charcutería 3, Miel 3 y Aceite 3.
  Revisar imágenes solo después de estabilizar identidad, `slug`, fusiones y
  purgas.
- Enlaces iniciales: **web 92/134**, `Instagram` 76/134, `Facebook` 43/134,
  `Google Maps` 134/134, `telefono` 122/134, **correo 0/134**, `direccion`
  134/134, `lat`/`lon` 134/134. El correo está vacío en toda la provincia; no lo
  rellenes salvo que la fuente sea directa y aporte valor.
- Calidad inicial:
  - `node scripts/audit-csv.js --mode=contract data/csv/andalucia/huelva.csv`
    devuelve **0 errores, 0 warnings, status OK**.
  - `node scripts/audit-csv.js --mode=quality --summary-only
    data/csv/andalucia/huelva.csv` devuelve **0 errores, 5 warnings** y 64 avisos
    suprimidos por opcionales ausentes.
- Warnings iniciales de geo-check:
  - `oro-de-ostur-huelva`: 47,4 km de Huelva; centroide más cercano Manzanilla.
  - `berries-los-mimbrales-s-l-huelva`: 42,3 km de Huelva; más cerca de Almonte.
  - `frutas-borja-sl-huelva`: 41,8 km de Huelva; más cerca de Almonte.
  - `panaderia-la-artesana-del-condado-huelva`: 37,7 km de Huelva; más cerca de
    Bollullos Par del Condado.
  - `pesasur-s-a-huelva`: 39,8 km de Huelva; más cerca de Ayamonte.
- Evidencia inicial: no existe `data/evidence/andalucia/huelva.jsonl`. Huelva no
  está en cobertura estricta (`data/evidence/coverage.json`).
- Modo: primera pasada profunda. Prioridad: cerrar la calidad de las 134 filas
  heredadas antes de añadir candidatos nuevos.
- Tras lote 1 / Fruta y verdura Doñana-Moguer-Lucena-Bonares (2026-07-01):
  **133 filas** tras 1 fusión (`berrynest-sat-n-h-0023-almonte` ->
  `bionest-o-berrynest-almonte`); **13 `verificado`, 0 `parcial`, 120
  `pendiente`**. Venta online: **0 `sí`, 0 `no`, 133 `no comprobado`**; 0 canales
  informados. Evidencia: **14 registros** en
  `data/evidence/andalucia/huelva.jsonl` (13 `keep` + 1 `merge`). Calidad Huelva:
  0 errores, **5 warnings** residuales, todos en lotes posteriores.

## Zonas de Huelva para lotear

- **Sierra de Aracena y Picos de Aroche**: Aracena, Jabugo, Cortegana, Alájar,
  Corteconcepción, Santa Bárbara de Casa, Encinasola. Jamón y paleta DOP Jabugo,
  queserías, miel y cerveza local.
- **Condado de Huelva y Campiña**: Bollullos Par del Condado, La Palma del
  Condado, Rociana, Escacena del Campo, Paterna del Campo, Niebla, Villarrasa,
  Beas, Trigueros, San Bartolomé de la Torre, Gibraleón. Vino, vinagre, vino
  naranja, aceite, garbanzo y panadería local.
- **Entorno Doñana / frutos rojos**: Almonte, Bonares, Lucena del Puerto, Moguer,
  Palos de la Frontera, Hinojos. Fresa, berries y cooperativas hortofrutícolas;
  mucho riesgo de central/exportador B2B.
- **Costa occidental y litoral**: Ayamonte, Isla Cristina, Lepe, Cartaya, Punta
  Umbría, Villablanca. Salazones, mojama, pescado, acuicultura, berries y
  heladerías costeras.
- **Capital y área metropolitana**: Huelva, Aljaraque, San Juan del Puerto.
  Muchas panaderías/heladerías/tiendas y varias entidades hortofrutícolas cuyo
  municipio o unidad productiva puede no estar en la capital.
- **Andévalo y Cuenca Minera**: Valverde del Camino, Villanueva de los
  Castillejos, El Campillo, Minas de Riotinto. Miel, cítricos, aceite, ibéricos y
  cerveza local.

## Reglas duras para Huelva

1. **Todo parte en `pendiente`.** No des por buena ninguna web, red, ficha de
   Maps, imagen, coordenada, categoría ni venta online heredada. Huelva empieza
   sin filas `verificado` ni `parcial`.
2. **Venta online sin cuarentena masiva.** Todas las filas están en
   `no comprobado`, así que no hay `sí` heredados que corregir. Promociona a
   `sí` solo si hoy hay pedido remoto concreto y utilizable; una web, catálogo,
   lista de productos, distribuidor o tienda de terceros no basta.
3. **Fruta y verdura es el lote de mayor riesgo.** Berries/fresas/cítricos pueden
   ser productor, cooperativa, SAT, central de manipulado, comercializadora,
   exportador o marca B2B. Entra el productor/cooperativa con actividad agraria o
   elaboración local clara; queda como máximo `parcial` si solo hay registro o
   directorio; fuera de alcance si la entidad es pura intermediación, logística,
   distribución o marca sin unidad productiva provincial demostrada.
4. **No confundas comercio B2B con venta online.** Muchas hortofrutícolas venden
   por contrato, exportación o mayorista; eso no es `Venta online=sí`. Para
   consumidor final exige tienda propia, formulario/pedido explícito, WhatsApp,
   email o teléfono publicado para pedidos.
5. **Pan y pastelería de Huelva capital exige obrador.** Hay 24 filas de capital
   y varios nombres genéricos. Entra el obrador/panadería/confitería que elabora;
   una cafetería, despacho, sucursal de venta o tienda sin obrador probado queda
   `parcial` o fuera de alcance según evidencia. Revisa posibles duplicados de
   marca/sucursal antes de mantener varias filas.
6. **Helados: obrador o fabricación propia.** Una heladería minorista no entra
   por defecto si solo revende. Mantener solo si acredita elaboración propia,
   obrador, marca productora o actividad artesana verificable.
7. **Charcutería/Jabugo.** Entra el secadero, fábrica, bodega de curación o marca
   productora de ibérico con actividad real en la provincia. DOP Jabugo apoya
   pertenencia y origen, pero no prueba tienda online. Vigila duplicados de marca
   (`Vázquez`, rutas/turismo de jamón) y carnicerías/despachos sin elaboración.
8. **Bodega/Condado.** Usar DOP Condado de Huelva, DOP Vinagre del Condado de
   Huelva e IGP Vino Naranja del Condado de Huelva como anclas. Entra la bodega o
   cooperativa vinícola con elaboración propia; vinoteca, distribuidor o marca sin
   bodega quedan fuera. La reventa por terceros no cuenta como venta online.
9. **Pescado y salazones.** IGP Mojama de Isla Cristina es el ancla para mojama y
   salazones. Distingue conservera/salazonera/elaborador de tienda, mayorista,
   congelados, pescadería, acuicultura sin producto directo o distribuidor.
   `Tienda USISA` y `Unión Salazonera Isleña S.A. - USISA` deben revisarse juntas
   por posible duplicado tienda/fabricante.
10. **Aceite.** Confirmar almazara, cooperativa olivarera, marca ligada a molino
    propio o elaborador real. No verificar una marca, aceitunera, distribuidor o
    cooperativa solo comercializadora como aceite si no hay producción propia.
    `Aceitunas Ropero` puede requerir recategorización si el producto principal no
    es aceite.
11. **Legumbres.** La IGP Garbanzo de Escacena certifica producto y operadores;
    no conviertas el sello o consejo regulador en productor. La cooperativa puede
    entrar si produce/comercializa garbanzo propio; una fila genérica de la IGP se
    purga o fusiona si no representa un productor.
12. **Miel y lácteos.** Exigir apicultor con colmenas propias o quesería con
    elaboración propia. Actividades educativas, talleres, rutas o tiendas solo
    cuentan si también acreditan producción alimentaria.
13. **Cerveza artesana.** Confirmar fábrica/obrador cervecero real. Un restaurante
    con cerveza de terceros no basta; un brewpub puede entrar si elabora in situ y
    se puede verificar.
14. **Resolver geo-warnings en sus lotes.** Si la coordenada apunta a un municipio
    real distinto, corrige `municipio`; si hay homónimo de centroide, añade
    override. No muevas coordenadas a ojo y no cambies `slug` salvo purga/fusión.
15. Un sitio HTTP, certificado roto, timeout, bloqueo o red social sin carga **no
    prueba** baja. Contrasta con búsqueda, perfil oficial, Maps, registro,
    consejo regulador o fuente local antes de borrar web, venta o fila.
16. No añadir candidatos nuevos durante esta primera pasada salvo decisión
    explícita. Primero cerrar identidad, alcance, venta y evidencia del snapshot
    de 134 filas.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la comprobación de una fuente propia o ficha
real cuando la decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **DOP Jabugo**: secaderos y operadores de jamón/paleta de la Sierra de Aracena
  y Picos de Aroche.
- **DOP Condado de Huelva**, **DOP Vinagre del Condado de Huelva** e **IGP Vino
  Naranja del Condado de Huelva**: bodegas, cooperativas y productos vitivinícolas
  del Condado.
- **IGP Garbanzo de Escacena**: operadores y contexto de legumbre; cuidado con
  filas que representen el sello, no un productor.
- **IGP Mojama de Isla Cristina** y Consejo Regulador de la Mojama: salazones y
  elaboradores de Ayamonte, Isla Cristina, Lepe y Cartaya.
- **Freshuelva** y asociaciones/ferias de frutos rojos: útiles para identificar
  empresas hortofrutícolas, pero por sí solas suelen sostener como máximo
  existencia/sector, no venta directa ni actividad actual al consumidor.
- **Gusto del Sur / Calidad Certificada / Landaluz / CAAE**: registros andaluces
  útiles para existencia, certificación y razón social; no sustituyen fuente
  propia cuando haga falta `verificado`.
- Webs, tiendas, perfiles oficiales y fichas reales de Google Maps ya presentes
  en el CSV: primera fuente si pertenecen claramente al productor.
- Ayuntamientos, mancomunidades, turismo comarcal, prensa local y rutas
  gastronómicas: fuentes secundarias para resolver dudas, nunca sustituto único si
  actividad productora, municipio o venta quedan materialmente dudosos.

## Plan de ejecución

Lotes agrupados por sector, zona y riesgo para reutilizar fuentes y aplicar la
regla dura correspondiente. Tamaño objetivo: 7-17 filas. Los lotes 1-11 cubren el
snapshot inicial de 134 sin solaparse; el lote 12 es cierre transversal.

1. **Lotes 1-3: Fruta y verdura (38 filas).** Sector dominante y de mayor riesgo
   B2B. Empezar por Doñana/Moguer/Lucena, seguir Costa/Palos/Lepe/Rociana y
   cerrar con Huelva capital y los geo-warnings.
2. **Lotes 4-5: Pan y pastelería (29 filas).** Obradores de capital y pueblos;
   revisar duplicados/sucursales y el warning de `panaderia-la-artesana-del-condado`.
3. **Lote 6: Aceite (16 filas).** Almazaras y cooperativas; resolver
   `oro-de-ostur-huelva` y posibles recategorizaciones.
4. **Lote 7: Charcutería (12 filas).** DOP Jabugo, secaderos y marcas ibéricas;
   separar fabricante/secadero de tienda, ruta o duplicado.
5. **Lote 8: Pescado (9 filas).** Mojama, salazones y conservas de la costa;
   revisar USISA, mayoristas/congelados y el warning de `pesasur-s-a-huelva`.
6. **Lote 9: Bodega + Legumbres (9 filas).** DOP/IGP del Condado y Garbanzo de
   Escacena; distinguir bodega/cooperativa/productor de sello colectivo.
7. **Lote 10: Miel + Lácteos y quesos (10 filas).** Apicultores, queserías y
   actividades educativas; conservar `parcial` cuando solo haya fuente secundaria.
8. **Lote 11: Helados + Cerveza artesana (11 filas).** Obrador/fábrica frente a
   heladería minorista o restaurante sin producción propia.
9. **Lote 12: Cierre transversal.** Objetivo: 0 pendientes, `Canal de venta` en
   todos los `sí`, evidencia coherente para filas activas, purgas/fusiones
   documentadas, dedup, geo-warnings resueltos o aceptados y provincia lista para
   `coverage.json` si se decide marcar cobertura completa.

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   npx pnpm list:province huelva
   ```

2. Tomar el primer lote `⬜` de la worklist y congelar sus `slug` antes de
   investigar. Para lotes por categoría, usar el orden actual del CSV dentro de
   esas categorías:

   ```bash
   node --input-type=module - <<'JS'
   import fs from "node:fs";
   import { parse } from "csv-parse/sync";

   const PATH = "data/csv/andalucia/huelva.csv";
   const CATS = new Set(["Fruta y verdura"]); // ajustar por lote

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

3. Priorizar dentro del lote: duplicados/fusiones, no productores, warnings de
   municipio/coordenadas, enlaces ajenos o directorios, luego venta online y
   pendientes con fuente propia fácil de comprobar.
4. Investigar hasta evidencia suficiente. Detenerse cuando identidad, actividad
   productora, municipio y venta remota estén decididos.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote. Crear `data/evidence/andalucia/huelva.jsonl` en el primer lote
   que cierre decisiones.
6. Añadir o sustituir una línea JSONL para cada fila con alta de evidencia, cambio
   de `verificacion`, cambio de `Venta online`, canal, purga o fusión. Para una
   fila `verificado`, la evidencia debe sostener `identity`, `producer-activity` y
   `municipality`, no solo `online-sales`.
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

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes parten por
categoría/zona en el orden actual del CSV; **congela los `slug` al iniciar cada
lote**. Si un lote fusiona o purga filas, recalcula los bloques siguientes antes
de iniciarlos. El lote 12 es auditoría transversal y puede revisar filas ya
tocadas.

| # | Lote | Filas | Estado | Notas iniciales |
|---|---|---:|---|---|
| 1 | Fruta y verdura · Doñana/Moguer/Lucena/Bonares | 14 | ✅ | Cerrado 2026-07-01. 13 filas activas `verificado`, 0 `parcial`, 0 purgas, 1 fusión (`Berrynest SAT` -> `Bionest / Berrynest SAT`). Todas quedan `Venta online=no comprobado`; sin tienda directa a consumidor confirmada. JSONL creado con 14 registros. |
| 2 | Fruta y verdura · Costa occidental + Condado disperso | 17 | ⬜ | Aljaraque, El Campillo, Gibraleón, Lepe, Palos de la Frontera, Rociana y San Juan del Puerto. Revisar cooperativas, marcas B2B y venta directa. |
| 3 | Fruta y verdura · Huelva capital | 7 | ⬜ | Lote pequeño por riesgo: `berries-los-mimbrales-s-l-huelva` y `frutas-borja-sl-huelva` tienen geo-warning hacia Almonte; revisar municipio/unidad productiva. |
| 4 | Pan y pastelería I | 15 | ⬜ | Primeras 15 filas de `Pan y pastelería` en orden CSV. Obrador vs despacho/cafetería; muchas sin imagen ni web. |
| 5 | Pan y pastelería II | 14 | ⬜ | Resto de `Pan y pastelería`. Incluye pueblos y `panaderia-la-artesana-del-condado-huelva`, cuyo geo-warning apunta a Bollullos Par del Condado. |
| 6 | Aceite | 16 | ⬜ | Almazaras/cooperativas del Condado, Sierra y Andévalo. Resolver `oro-de-ostur-huelva` (geo-warning hacia Manzanilla) y revisar `Aceitunas Ropero` como posible recategorización. |
| 7 | Charcutería | 12 | ⬜ | DOP Jabugo, secaderos y marcas ibéricas. Revisar duplicados de Vázquez, rutas/turismo y marcas con tiendas frente a fábrica/secadero. |
| 8 | Pescado | 9 | ⬜ | Mojama, salazones, conservas, acuicultura y mayoristas. Revisar USISA tienda/fabricante y `pesasur-s-a-huelva` (geo-warning hacia Ayamonte). |
| 9 | Bodega + Legumbres | 9 | ⬜ | Bodegas del Condado y Garbanzo de Escacena. Distinguir bodega/cooperativa/productor de consejo o sello colectivo. |
| 10 | Miel + Lácteos y quesos | 10 | ⬜ | Apicultores, queserías y actividades educativas. `Apimundi` puede ser educación ambiental si no acredita producto alimentario. |
| 11 | Helados + Cerveza artesana | 11 | ⬜ | Obrador/fábrica frente a heladería minorista o restaurante. Revisar `Restaurante & Brewery Ruben's` como brewpub real o restaurante. |
| 12 | Cierre transversal provincial | 134 | ⬜ | 0 pendientes; canales en todos los `sí`; evidencia coherente; dedup; geo-warnings resueltos/aceptados; imágenes sin errores; posible `coverage.json`. |

## Lote 1 - Fruta y verdura Doñana/Moguer/Lucena/Bonares

Revisión de 14 filas iniciales de berries/cooperativas en Almonte, Bonares,
Lucena del Puerto y Moguer (2026-07-01).

Resultado: **13 filas activas**, todas `verificado`, 0 `parcial`, 0 purgas y **1
fusión**. Venta online: todas quedan `no comprobado` porque las fuentes propias
confirman producción/comercialización profesional, pero no un canal directo de
pedido a consumidor. Se crea `data/evidence/andalucia/huelva.jsonl` con 14
registros (13 `keep` + 1 `merge`).

Decisiones relevantes:

- **Fusión**: `berrynest-sat-n-h-0023-almonte` se fusiona en
  `bionest-o-berrynest-almonte`; la fuente oficial Bionest identifica la entidad
  como BERRYNEST SAT H-0023.
- **Normalizaciones de nombre/web/contacto**: Bionest/Berrynest, Fres Capricho /
  Guaperal, Bonafrú, Costa de Huelva / CoopHuelva, Pilonar Berries, Fruta de
  Andalucía, Cuna de Platero, Grufesa y Sabor de Huelva.
- **Enlace ajeno/inútil retirado**: `bonafru...` pierde el Facebook heredado
  `profile.php`, que no identificaba una ficha estable.
- **Sin `sí` de venta online**: todos los productores son reales, pero las webs
  revisadas son corporativas/B2B o formularios de contacto; no se confirmó
  ecommerce ni pedido remoto directo de consumidor final.

## Cierre esperado

La primera pasada se considera completa cuando:

- no queda ninguna fila `pendiente`;
- cada fila activa tiene evidencia JSONL coherente con `verificacion`, `Venta
  online` y `Canal de venta`;
- todas las purgas/fusiones tienen tombstone en evidencia;
- no queda `Canal de venta` en filas sin `Venta online=sí`;
- los 5 geo-warnings iniciales se han corregido o aceptado con motivo;
- `npx pnpm verify:data` pasa;
- el ledger refleja el snapshot final y, solo si la cobertura es completa, se
  decide si añadir `andalucia/huelva` a `data/evidence/coverage.json`.
