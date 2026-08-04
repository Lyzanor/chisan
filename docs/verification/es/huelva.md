# Verificación provincial de Huelva

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/andalucia/huelva.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila debe vivir en `data/evidence/andalucia/huelva.jsonl` a
medida que se revise cada lote (el fichero se creó en el lote 1 y se amplía en
cada cierre).

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
- Tras lote 2 / Fruta y verdura Costa occidental + Condado disperso
  (2026-07-02): **132 filas** tras 1 purga (`sonrojas-palos-de-la-frontera`);
  **25 `verificado`, 4 `parcial`, 103 `pendiente`**. Venta online: **1 `sí`**
  (`freson-de-palos-palos-de-la-frontera`, canal `ecommerce`), 0 `no`, **131
  `no comprobado`**. Evidencia: **31 registros** en
  `data/evidence/andalucia/huelva.jsonl` (29 `keep` + 1 `merge` + 1 `purge`).
  Se corrige Green Valley Berries a Villablanca, Valle Ancho sale de
  `Fruta y verdura` a `Legumbres y cereales`, y permanecen 4 filas parciales por
  falta de fuente propia fuerte.
- Tras lotes 3-5 / cierre de `Fruta y verdura` y `Pan y pastelería`
  (2026-07-02): **127 filas** tras 3 purgas y 2 fusiones adicionales;
  **48 `verificado`, 12 `parcial`, 67 `pendiente`**. Venta online: **11 `sí`**,
  0 `no`, **116 `no comprobado`**; todos los `sí` tienen canal informado.
  Evidencia: **67 registros** en `data/evidence/andalucia/huelva.jsonl` (60
  `keep` + 3 `merge` + 4 `purge`). No quedan filas pendientes en `Fruta y
  verdura` ni en `Pan y pastelería`. Quedan 4 warnings de calidad: 2
  geo-warnings leves en fincas de Almonte y 2 de lotes posteriores
  (`oro-de-ostur-huelva`, `pesasur-s-a-huelva`).
- Tras lotes 6-7 / `Aceite` y `Charcutería` (2026-07-02): **125 filas** tras 2
  fusiones adicionales; **71 `verificado`, 15 `parcial`, 39 `pendiente`**.
  Venta online: **30 `sí`**, 0 `no`, **95 `no comprobado`**; todos los `sí`
  tienen canal informado. Evidencia: **95 registros** en
  `data/evidence/andalucia/huelva.jsonl` (86 `keep` + 5 `merge` + 4 `purge`).
  No quedan filas pendientes en `Fruta y verdura`, `Pan y pastelería`, `Aceite`
  ni `Charcutería`. El geo-warning de `oro-de-ostur-huelva` queda resuelto al
  corregirse a **Manzanilla**; quedan 3 warnings de calidad: dos fincas de
  Almonte y `pesasur-s-a-huelva`.
- Tras lotes 8-11 / cierre sectorial pendiente (2026-07-02): **120 filas** tras
  3 purgas y 2 fusiones adicionales; **99 `verificado`, 21 `parcial`, 0
  `pendiente`**. Venta online: **48 `sí`**, 0 `no`, **72 `no comprobado`**;
  todos los `sí` tienen canal informado. Evidencia: **134 registros** en
  `data/evidence/andalucia/huelva.jsonl` (120 `keep` + 7 `merge` + 7 `purge`).
  No quedan lotes sectoriales pendientes; queda solo el lote 12 de cierre
  transversal. El geo-warning de `pesasur-s-a-huelva` queda resuelto al corregirse
  a **Ayamonte**; quedan 2 warnings de calidad en fincas de Almonte.
- Tras lote 12 / cierre transversal final (2026-07-02): Huelva queda cerrada en
  **120 filas**, **99 `verificado`**, **21 `parcial`**, **0 `pendiente`**.
  Venta online se mantiene en **48 `sí`**, 0 `no`, **72 `no comprobado`**, con
  canal informado en todos los `sí` y sin canales en filas no comprobadas.
  Evidencia completa: **134 registros** (120 `keep` + 7 `merge` + 7 `purge`).
  Se añade `andalucia/huelva` a `data/evidence/coverage.json`. Los dos warnings
  residuales (`berries-los-mimbrales-s-l-huelva` y `frutas-borja-sl-huelva`) se
  aceptan como fincas reales de Almonte en banda leve 15-100 km, muy por debajo
  del bloqueo de 100 km.

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
| 2 | Fruta y verdura · Costa occidental + Condado disperso | 17 | ✅ | Cerrado 2026-07-02. 12 `verificado`, 4 `parcial`, 1 purga (`SONROJAS`) y 1 venta online confirmada (`Fresón de Palos`, `ecommerce`). Green Valley Berries se corrige a Villablanca; Valle Ancho se recategoriza fuera de fruta. |
| 3 | Fruta y verdura · Huelva capital | 7 | ✅ | Cerrado 2026-07-02. 3 `verificado`, 1 `parcial`, 3 purgas (`FRUTEVA`, `Jesús Kiko`, `Surberry`), sin nuevos `sí` de venta online. Los Mimbrales y Frutas Borja se corrigen a Almonte. |
| 4 | Pan y pastelería I | 15 | ✅ | Cerrado 2026-07-02. 13 filas activas: 9 `verificado`, 4 `parcial`, 2 fusiones (`Guillén Navarro` -> `Confitería Guillén`; `Panadería Gaspar Huelva` -> `Panadería Gaspar San Juan`). 5 nuevos `sí`. |
| 5 | Pan y pastelería II | 14 | ✅ | Cerrado 2026-07-02. 11 `verificado`, 3 `parcial`, 0 purgas/fusiones. `panaderia-la-artesana-del-condado-huelva` se corrige a Bollullos Par del Condado. 5 nuevos `sí`. |
| 6 | Aceite | 16 | ✅ | Cerrado 2026-07-02. 15 filas activas: 13 `verificado`, 2 `parcial`, 1 fusión (`Oleodiel` -> `Cooperativa Nuestra Señora de la Oliva / Oleodiel`). 10 nuevos `sí`. `Oro de Ostur` se corrige a Manzanilla; `Aceitunas Ropero` se recategoriza fuera de aceite. |
| 7 | Charcutería | 12 | ✅ | Cerrado 2026-07-02. 11 filas activas: 10 `verificado`, 1 `parcial`, 1 fusión (`Jamones y Embutidos Vázquez` -> `Ibéricos Vázquez`). 9 nuevos `sí`. |
| 8 | Pescado | 9 | ✅ | Cerrado 2026-07-02. 7 filas activas: 6 `verificado`, 1 `parcial`, 1 purga (`Fripesa`) y 1 fusión (`Tienda USISA` -> `Unión Salazonera Isleña`). 5 nuevos `sí`. `PESASUR` se corrige a Ayamonte. |
| 9 | Bodega + Legumbres | 9 | ✅ | Cerrado 2026-07-02. 8 filas activas: 8 `verificado`, 1 purga (`Garbanzo de Escacena IGP`) por sello/no productor. 8 nuevos `sí`. |
| 10 | Miel + Lácteos y quesos | 10 | ✅ | Cerrado 2026-07-02. 9 filas activas: 6 `verificado`, 3 `parcial`, 1 purga (`Apimundi`) y recategorización de `Ambrosio` a `Pan y pastelería`. 5 nuevos `sí`. |
| 11 | Helados + Cerveza artesana | 11 | ✅ | Cerrado 2026-07-02. 10 filas activas: 8 `verificado`, 2 `parcial`, 1 fusión (`Xhambit` -> `Heladería Valenciana Costa de la Luz / Xhambit`). Sin nuevos `sí`. |
| 12 | Cierre transversal provincial | 120 | ✅ | Cerrado 2026-07-02. 0 pendientes, evidencia completa, 48 `sí` con canal, 7 fusiones/purgas documentadas, imágenes sin errores y `andalucia/huelva` añadido a `coverage.json`. Se aceptan 2 geo-warnings leves de fincas de Almonte. |

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

## Lote 2 - Fruta y verdura Costa occidental + Condado disperso

Revisión de 17 filas iniciales de fruta/berries/cítricos en Aljaraque, El
Campillo, Gibraleón, Lepe, Palos de la Frontera, Rociana del Condado, San Juan
del Puerto y Villablanca (2026-07-02).

Resultado: **16 filas activas**, **12 `verificado`**, **4 `parcial`** y **1
purga**. Venta online: **1 `sí`** (`Fresón de Palos`, canal `ecommerce`) y el
resto `no comprobado`. Se añaden 17 registros de evidencia (16 `keep` + 1
`purge`).

Decisiones relevantes:

- **Purga**: `sonrojas-palos-de-la-frontera` se elimina porque las fuentes
  disponibles describen a Ernesto Rojas / SONROJAS como intermediación y comercio
  mayorista, no como productor con unidad productiva propia.
- **Venta online confirmada**: `freson-de-palos-palos-de-la-frontera` pasa a
  `Venta online=sí` y `Canal de venta=ecommerce`; la tienda oficial mantiene
  productos con carrito, envíos y pago seguro.
- **Parciales por evidencia débil**:
  `empresa-fresas-tres-palos-palos-fra-palos-de-la-frontera`,
  `frescarily-sl-palos-de-la-frontera`,
  `spain-berries-palos-de-la-frontera` y
  `valle-ancho-s-coop-andaluza-san-juan-del-puerto` quedan `parcial` por depender
  de Maps, directorios o registros sin fuente propia suficiente.
- **Corrección de municipio/categoría**: `green-valley-berries-lepe` conserva el
  slug estable pero pasa a municipio **Villablanca**; `valle-ancho...` sale de
  `Fruta y verdura` y queda en `Legumbres y cereales`.
- **Normalizaciones**: se corrigen nombres, webs HTTPS, correos y descripciones
  para Plus Berries, Rio Tinto Organic Citrus, Frescitrus, AgroMartín, Berries
  Costaluz, Green Valley Berries, Masiá Ciscar, Gorofres, Lujovi, Perlahuelva y
  SAT Condado. También se retiran enlaces heredados genéricos de Facebook en
  Berries Costaluz y Gorofres.

## Lote 3 - Fruta y verdura Huelva capital

Revisión de 7 filas iniciales de berries/fruta con sede o ficha en Huelva
capital (2026-07-02).

Resultado: **4 filas activas**, **3 `verificado`**, **1 `parcial`** y **3
purgas**. Venta online: todas las filas activas quedan `no comprobado`. Se
añaden 7 registros de evidencia (4 `keep` + 3 `purge`).

Decisiones relevantes:

- **Purgas**: `fruteva-huelva` se elimina por ser tienda/reparto online de fruta,
  no productor; `frutas-huelva-la-luz-s-l-jesus-kiko-huelva` y
  `surberry-huelva` se eliminan por evidencia de actividad mayorista o
  comercializadora sin unidad productora propia acreditada.
- **Corrección de municipio**: `berries-los-mimbrales-s-l-huelva` y
  `frutas-borja-sl-huelva` pasan de Huelva a **Almonte** por dirección/finca
  oficial. Quedan en warning leve de distancia por ubicación de finca, no por
  municipio heredado incorrecto.
- **Parcial conservador**: `berryworld-huelva` queda `parcial`; hay equipo local,
  red de productores y centro I+D en Huelva, pero no una unidad productora propia
  claramente acreditada.
- **Verificados**: Los Mimbrales, Frutas Borja y Onubafruit quedan como
  productores/cooperativa reales; ninguna fuente confirmó pedido directo a
  consumidor.

## Lote 4 - Pan y pastelería I

Revisión de las primeras 15 filas de `Pan y pastelería` en el orden congelado
del CSV (2026-07-02).

Resultado: **13 filas activas**, **9 `verificado`**, **4 `parcial`** y **2
fusiones**. Venta online: **5 `sí`** con canales `whatsapp`, `telefono`,
`marketplace` o `ecommerce` según fuente. Se añaden 15 registros de evidencia
(13 `keep` + 2 `merge`).

Decisiones relevantes:

- **Fusión de marca/sucursal**: `confiteria-guillen-navarro-s-l-huelva` se
  fusiona en `confiteria-guillen-huelva`; la fuente oficial presenta dos
  despachos y obrador bajo la misma Confitería Guillén.
- **Fusión de punto de venta**: `panaderia-gaspar-huelva` se fusiona en
  `panaderia-gaspar-san-juan-del-puerto`; Huelva queda documentado como punto de
  venta/sucursal de la panadería de San Juan del Puerto.
- **Ventas remotas confirmadas**: Obrador Moito Bom (`whatsapp`), La Grosera
  (`whatsapp|telefono|marketplace`), Confitería Guillén (`telefono`), Dulce
  Pecado Bakery (`whatsapp`) y Jacuaçu (`ecommerce`).
- **Parciales por falta de obrador fuerte**: El Horno de Ana, La Dulcería de
  Santa Bárbara, Panadería Artesanal y Panadería La Antigua quedan `parcial`.
- **Verificados sin venta online**: La Repostería de Pi, Confitería Alvarado,
  Nova Ruiz y Horno San Ramón acreditan obrador/elaboración, pero no pedido
  remoto vigente de consumidor.

## Lote 5 - Pan y pastelería II

Revisión de las 14 filas restantes de `Pan y pastelería`, incluyendo pueblos y
el geo-warning de La Artesana del Condado (2026-07-02).

Resultado: **14 filas activas**, **11 `verificado`**, **3 `parcial`**, 0 purgas
y 0 fusiones. Venta online: **5 `sí`**. Se añaden 14 registros de evidencia
(`keep`).

Decisiones relevantes:

- **Corrección de municipio**: `panaderia-la-artesana-del-condado-huelva` pasa a
  **Bollullos Par del Condado** con dirección normalizada de la fábrica de picos
  y regañás.
- **Ventas remotas confirmadas**: Abuela Canalla (`ecommerce|marketplace`), El
  Buen Gusto (`ecommerce|marketplace`), Tartería Las Alemanas (`telefono`),
  DulcesCake.sj (`whatsapp`) y Panadería Gaspar (`whatsapp`).
- **Verificados sin venta online**: Dioni, El Olam, La Artesana del Condado, San
  José, Horno Santa Inés y Tody acreditan elaboración/obrador, pero no un canal
  de pedido directo que se haya marcado como `sí`.
- **Parciales por evidencia insuficiente de obrador propio**: La Espiga,
  Pastelería Yugoslava Emilia y El Capricho de Mayra.

## Lote 6 - Aceite

Revisión de 16 filas de `Aceite` en almazaras y cooperativas del Condado,
Campiña, Sierra y Andévalo (2026-07-02).

Resultado: **15 filas activas**, **13 `verificado`**, **2 `parcial`** y **1
fusión**. Venta online: **10 `sí`** con canales `ecommerce`,
`ecommerce|telefono` o `ecommerce|whatsapp`. Se añaden 16 registros de evidencia
(15 `keep` + 1 `merge`).

Decisiones relevantes:

- **Fusión**: `oleodiel-gibraleon` se fusiona en
  `cooperativa-nuestra-senora-de-la-oliva-gibraleon`; la fila canónica queda
  como `Oleodiel / Cooperativa Nuestra Señora de la Oliva`.
- **Corrección de municipio**: `oro-de-ostur-huelva` pasa de Huelva a
  **Manzanilla**, resolviendo el geo-warning inicial.
- **Recategorización**: `aceitunas-ropero-huelva` sale de `Aceite` y queda en
  `Aceitunas y encurtidos`, `parcial`, por falta de fuente propia fuerte sobre
  elaboración.
- **Ventas online confirmadas**: Raigal, Aceites Candón, Olibeas, Oleodiel, Oro
  de Ostur, Olipaterna, Torre de Oliva, Oleocampiña, Aceites Calderay y
  OleoBlanca.
- **Verificados sin venta online**: Olionuba, Oleosierra y Olivar de Huelva
  acreditan actividad oleícola, pero no un canal actual de pedido directo.
- **Parcial conservador**: Villaoliva / Cooperativa Agrícola Olivarera de
  Villarrasa queda `parcial` porque la evidencia localizada procede de
  directorios sectoriales y no de fuente propia.

## Lote 7 - Charcutería

Revisión de 12 filas de `Charcutería` en Sierra de Aracena, Jabugo, Cortegana,
Corteconcepción, Huelva capital y Andévalo (2026-07-02).

Resultado: **11 filas activas**, **10 `verificado`**, **1 `parcial`** y **1
fusión**. Venta online: **9 `sí`** con canales `ecommerce`,
`ecommerce|telefono|email`. Se añaden 12 registros de evidencia (11 `keep` + 1
`merge`).

Decisiones relevantes:

- **Fusión**: `jamones-y-embutidos-vazquez-aracena` se fusiona en
  `ibericos-vazquez-fabrica-y-secadero-de-jamones-de-bellota-aracena`; la fila
  canónica queda como `Ibéricos Vázquez / Jamones y Embutidos Vázquez`.
- **Ventas online confirmadas**: Jamones Sierra de Arias Montano, Ibéricos
  Vázquez, Niño Manuel, Segundín, Jamones Eíriz, La Serranía de Macías, Jamones
  Tartessos, Jamones Tomás Castaño y Jamones Carvajal.
- **Verificado sin venta online**: Jamones Asensio acredita secadero/tienda en
  Villanueva de los Castillejos, pero no se confirmó flujo actual de compra
  directa.
- **Parcial conservador**: `secadero-aracena-aracena` queda `parcial`; hay
  identidad y localización, pero no fuente propia fuerte de actividad productora
  actual.

## Lote 8 - Pescado

Revisión de 9 filas de pescado, acuicultura, conservas y salazones de Ayamonte,
Cartaya, Huelva, Isla Cristina y Lepe (2026-07-02).

Resultado: **7 filas activas**, **6 `verificado`**, **1 `parcial`**, **1
purga** y **1 fusión**. Venta online: **5 `sí`** con canal `ecommerce`. Se
añaden 9 registros de evidencia (7 `keep` + 1 `merge` + 1 `purge`).

Decisiones relevantes:

- **Purga**: `fripesa-s-a-huelva` se elimina porque la fuente oficial la presenta
  como comercializadora/distribuidora, no como productor o elaborador.
- **Fusión**: `tienda-usisa-isla-cristina-isla-cristina` se fusiona en
  `union-salazonera-islena-s-a-usisa-isla-cristina`; la tienda es un punto de
  venta de la misma USISA, no un productor separado.
- **Corrección de municipio**: `pesasur-s-a-huelva` pasa a **Ayamonte**,
  resolviendo el geo-warning inicial.
- **Ventas online confirmadas**: Huelvamar/Gambalucía, Conservas Concepción,
  PESASUR, USISA y Salazones del Terrón.
- **Parcial conservador**: CAIM queda `parcial` porque la evidencia disponible
  procede de directorios/Maps y no de una fuente propia pública fuerte.
- **Recategorizaciones**: acuicultura y alguicultura pasan a
  `Pescado y acuicultura`; conserveras y salazoneras a `Pescado y conservas`.

## Lote 9 - Bodega + Legumbres

Revisión de 9 filas de bodegas del Condado de Huelva y Garbanzo de Escacena
(2026-07-02).

Resultado: **8 filas activas**, todas `verificado`, **1 purga** y **8 nuevos
`sí`** de venta online, todos con canal `ecommerce`. Se añaden 9 registros de
evidencia (8 `keep` + 1 `purge`).

Decisiones relevantes:

- **Purga**: `garbanzo-de-escacena-igp-escacena-del-campo` se elimina porque
  representaba el sello/IGP, no un productor. La cooperativa operadora queda en
  `cooperativa-andaluza-campo-de-tejada-escacena-del-campo`.
- **Bodegas verificadas con ecommerce**: Andrade, Iglesias, Oliveros, Privilegio
  del Condado / Vinícola del Condado, Sauci, Infante y Contreras Ruiz.
- **Legumbre verificada con ecommerce**: Campo de Tejada S.C.A. queda como
  productor/comercializador de Garbanzo de Escacena IGP con tienda online.

## Lote 10 - Miel + Lácteos y Quesos

Revisión de 10 filas de apicultura, miel y queserías, incluyendo actividades
educativas vinculadas a abejas (2026-07-02).

Resultado: **9 filas activas**, **6 `verificado`**, **3 `parcial`** y **1
purga**. Venta online: **5 `sí`**; EscomsMiel queda con
`ecommerce|whatsapp`, Ambrosio con `whatsapp` y las tres queserías con
`ecommerce`. Se añaden 10 registros de evidencia (9 `keep` + 1 `purge`).

Decisiones relevantes:

- **Purga**: `apimundi-educacion-ambiental-a-traves-de-las-abejas-cortegana` se
  elimina porque sus canales oficiales acreditan educación ambiental/conservación
  de abejas, no producción alimentaria catalogable.
- **Recategorización**: `ambrosio-huelva` sale de `Miel` y queda en
  `Pan y pastelería` como `Ambrosio 1985`; las fuentes oficiales lo identifican
  como obrador/panadería artesanal con pedidos por WhatsApp/teléfono.
- **Ventas online confirmadas**: EscomsMiel, Ambrosio 1985, Monte Robledo,
  Quesos Doñana y Quesería Dehesa Dos Hermanas.
- **Parciales por fuente débil**: Miel Sierra de Aracena / Apifersa, Miel La
  Encarnación y Elías Moreno Sorni / MF Apicultura.
- **Verificado sin venta online**: Mieles La Madroña acredita explotación apícola
  y contacto local, pero no se confirmó canal de compra remota actual.

## Lote 11 - Helados + Cerveza Artesana

Revisión de 11 filas de heladerías con posible elaboración propia y cervezas
artesanas/brewpubs (2026-07-02).

Resultado: **10 filas activas**, **8 `verificado`**, **2 `parcial`** y **1
fusión**. No se confirma ningún nuevo `sí` de venta online. Se añaden 11
registros de evidencia (10 `keep` + 1 `merge`).

Decisiones relevantes:

- **Fusión**: `xhambit-huelva` se fusiona en
  `heladeria-valenciana-costa-de-la-luz-s-l-huelva`; la fila canónica queda como
  `Heladería Valenciana Costa de la Luz / Xhambit`.
- **Heladerías verificadas**: Porto Bello, Pura Vida, Heladería Valenciana /
  Xhambit, El Artesano y Heladería Vega acreditan elaboración propia o actividad
  artesana con fuentes propias/sectoriales suficientes.
- **Parciales por evidencia limitada de obrador**: Caprichos de la Ibense y
  Heladería La Artesana.
- **Cervezas verificadas**: Folks Bier, Ruben's Beer / La Ruben's Brewery &
  Restaurant y Cerveza Odiel acreditan producción cervecera artesana; ninguna
  pasa a `Venta online=sí`.

## Lote 12 - Cierre Transversal Provincial

Auditoría final de la primera pasada profunda de Huelva (2026-07-02).

Resultado: **provincia cerrada** con **120 filas activas**, **99 `verificado`**,
**21 `parcial`** y **0 `pendiente`**. Venta online queda en **48 `sí`**, 0 `no`
y **72 `no comprobado`**. Se añade `andalucia/huelva` a
`data/evidence/coverage.json` porque el ledger cubre todas las filas actuales y
las purgas/fusiones heredadas de la revisión.

Comprobaciones de cierre:

- **Evidencia**: 134 registros en `data/evidence/andalucia/huelva.jsonl` (120
  `keep`, 7 `merge`, 7 `purge`), coherentes con el CSV actual.
- **Venta online**: los 48 `sí` tienen `Canal de venta`; no quedan canales en
  filas con `Venta online=no comprobado`.
- **Deduplicación**: las 7 fusiones quedan documentadas con `targetSlug`; no se
  detectan duplicados sectoriales pendientes en la primera pasada.
- **Purgas**: las 7 filas retiradas tienen tombstone con motivo y fuente.
- **Geo-check**: corregidos los warnings iniciales de `oro-de-ostur-huelva`,
  `panaderia-la-artesana-del-condado-huelva` y `pesasur-s-a-huelva`. Quedan
  aceptados 2 warnings leves:
  `berries-los-mimbrales-s-l-huelva` (16,9 km del centroide de Almonte) y
  `frutas-borja-sl-huelva` (19,6 km), ambos por coordenadas de finca dentro de la
  banda warning 15-100 km y por debajo del bloqueo de 100 km.
- **Imágenes**: las imágenes de filas purgadas/fusionadas se eliminan y el gate
  de imágenes pasa sin errores ni warnings.
- **Candidatos nuevos**: no se añaden candidatos durante esta primera pasada; el
  objetivo era cerrar el snapshot heredado.

## Cierre completado

La primera pasada queda completa porque:

- no queda ninguna fila `pendiente`;
- cada fila activa tiene evidencia JSONL coherente con `verificacion`, `Venta
  online` y `Canal de venta`;
- todas las purgas/fusiones tienen tombstone en evidencia;
- no queda `Canal de venta` en filas sin `Venta online=sí`;
- los geo-warnings iniciales se han corregido o aceptado con motivo;
- `npx pnpm verify:data` pasa;
- el ledger refleja el snapshot final y `andalucia/huelva` queda en
  `data/evidence/coverage.json`.

## HU-13 — Ola 3 · venta sin resolver (2026-07-29)

Segunda pasada centrada en las **88 filas con `Venta online=no comprobado`** del
snapshot actual de 150 productores. Se resuelven **7** casos con una vía de
pedido vigente y atribuible al productor:

- **3 ecommerce propios:** Folks Bier, Mieles La Madroña y la tienda oficial de
  Luis Felipe / Bodegas Rubio 1893.
- **4 pedidos asistidos:** Jamones Asensio por WhatsApp, Bodegas Díaz por
  teléfono, Confitería Alvarado por teléfono o correo y Pastelería Dioni por
  formulario/correo o teléfono.

La pasada mejora también el dato publicado: teléfono operativo de pedidos de
Jamones Asensio, teléfono de la tienda Luis Felipe, correo oficial de Dioni,
horarios e instrucciones de encargo de Alvarado y Díaz, y descripciones que ya
no narran la falta de comprobación anterior.

No se fuerza un `sí` cuando solo aparece contacto genérico, reventa de tercero o
una tienda sin existencias: Masiá Ciscar sigue sin producto comprable y la
aparente tienda de Olionuba pertenece a una plantilla compartida ajena. Esos
casos permanecen honestamente en `no comprobado`.

**Estado tras HU-13:** 150 filas; 116 `verificado`, 34 `parcial`, 0
`pendiente`; venta online en **68 `sí`**, 1 `no` y **81 `no comprobado`**. Las 7
decisiones tienen evidencia actualizada y canal accionable.

## HU-14 — Ola 3 · tercera pasada de venta (2026-07-31)

Tercera pasada sobre las **81 ventas aún sin resolver**. Se cierran **33**:

- **2 pedidos asistidos:** La Repostería de Pi y Horno San Ramón aceptan
  encargos por teléfono o correo desde sus páginas oficiales.
- **31 `no`:** se revisaron webs corporativas, catálogos y contactos oficiales
  completos de productores, cooperativas, obradores y secaderos. No se encontró
  checkout ni una instrucción concreta de pedido remoto; un contacto genérico o
  la venta profesional/física no se presenta como venta online.

La mejora no se limita al enum: se incorpora el correo de La Repostería de Pi,
se reescriben las descripciones públicas de Olivar de Huelva, MONTJAM y Jamones
Enrique Castaño, y se retiran tres webs impropias. `caim.es` redirige a la ayuda
genérica del proveedor, el dominio de Panadería San José sirve una página Plesk
y la ficha de Olionuba pertenece a un directorio con plantilla compartida. Se
conservan las redes y contactos válidos.

Permanecen `no comprobado` los fallos técnicos, las tiendas sin existencias y
la falsa tienda de Olionuba. **Estado tras HU-14:** 150 filas; 116 `verificado`,
34 `parcial`; venta online en **70 `sí`**, **32 `no`** y **48 `no comprobado`**.

## HU-15 — Ola 3 · banda 41–60 (2026-08-01)

Pasada focalizada sobre el residual técnico y las fichas con mayor posibilidad
de mejora pública. **Bodegas Juncales** deja de ser una ficha de registro:
su web oficial viva acredita actividad, dirección y una gama de 16 vinos y
vinagres, y publica una sección específica de pedidos por correo o teléfono.
La fila pasa a `verificado` y `Venta online=sí`, incorpora ambos contactos, web,
dirección y una gama útil para el usuario.

No se fuerzan decisiones en los dominios que no funcionan al revisarlos.
Bodegas Acosta y Cerveza Odiel conservan señales recientes de catálogo, pero
sus dominios no resolvían por DNS y la antigua tienda Ecwid de Odiel devolvía
404; siguen en `no comprobado` conforme a la regla de fallo técnico.

**Estado tras HU-15:** 150 filas; **117 `verificado`**, 33 `parcial`, 0
`pendiente`; venta online en **71 `sí`**, 32 `no` y **47 `no comprobado`**.
