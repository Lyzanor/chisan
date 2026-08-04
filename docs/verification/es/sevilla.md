# Verificación provincial de Sevilla

Ledger de ejecución para cerrar la revisión profunda de
`data/csv/andalucia/sevilla.csv`. El CSV es la fuente de verdad y la evidencia
por decisión vive en `data/evidence/andalucia/sevilla.jsonl` desde el lote 1.

El procedimiento general está en `docs/es/VERIFICATION_TECHNIQUES.md`; este
documento fija únicamente el snapshot, los riesgos provinciales y la secuencia
de lotes. Los contratos siguen en `docs/CSV_CONTRACT.md`,
`docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`.

## Estado

- Inicio: 2026-07-15.
- Snapshot inicial: **291 filas**; **73 `verificado`**, **21 `parcial`** y
  **197 `pendiente`**.
- Venta online inicial: **31 `sí`**, **16 `no`** y **244 `no comprobado`**.
  Ninguna de las 31 filas con `sí` tenía `Canal de venta`; se consideran en
  cuarentena hasta que el lote correspondiente confirme el mecanismo actual.
- Campos iniciales: web 237/291, Facebook 80/291, Instagram 124/291, Google
  Maps 291/291, teléfono 270/291, correo 258/291, dirección 291/291,
  coordenadas 289/291 e imagen 158/291.
- Las dos filas sin coordenadas son `productos-alimentarios-quesi-s-l-osuna` y
  `quesos-los-vazquez-castilleja-del-campo`; se resolverán en el lote de
  lácteos, no con una geocodificación especulativa separada de su identidad.
- Calidad inicial: contrato OK sin errores ni warnings. El audit de calidad
  muestra dos geo-warnings: Hacienda Guzmán a 15,4 km del centroide de La
  Rinconada y Enboca a 70,8 km de Sevilla, más cerca de La Puebla de Cazalla.
- No existía `data/evidence/andalucia/sevilla.jsonl` ni ledger provincial de
  verificación. Sevilla no figura en `data/evidence/coverage.json`.
- Modo: primera pasada profunda sobre las 197 filas pendientes, seguida de una
  revisión transversal de los 94 estados heredados antes de declarar cierre.

- Tras lote 1 / pendientes de `Fruta y verdura` (2026-07-15): **291 filas**;
  **76 `verificado`**, **21 `parcial`** y **194 `pendiente`**. Se verifican las
  tres filas, se corrige Kombucha-T a `Bebidas` y Tala Foods a `Conservas`, y
  Bioalcores queda como la única de las tres que permanece en `Fruta y
  verdura`. Venta online: **33 `sí`**, 16 `no` y 242 `no comprobado`; los dos
  nuevos `sí` tienen canal `ecommerce`. Evidencia: 3 registros `keep`.

- Tras lote 2 / pendientes de `Cerveza artesana` (2026-07-15): **290 filas**
  tras fusionar el duplicado de 8 Huellas; **79 `verificado`**, **23 `parcial`**
  y **188 `pendiente`**. Se verifican Pergara, Mond, Fermentados del Aljarafe y
  Vandalia con tienda activa; Desiderata y la fila superviviente de 8 Huellas
  quedan `parcial`. Venta online: **37 `sí`**, 16 `no` y 237 `no comprobado`;
  los cuatro nuevos `sí` tienen canal `ecommerce`. Evidencia acumulada: 10
  registros (9 `keep` + 1 `merge`).

- Tras lote 3a / pendientes de `Miel` (2026-07-15): **290 filas**;
  **86 `verificado`**, **25 `parcial`** y **179 `pendiente`**. Los nueve casos
  quedan resueltos: siete `verificado` y dos `parcial`; Valle de la Osa y
  Tierra Palaciega pasan a `Conservas`. Se sanea mediante `merge` el slug
  importado de Miel La Puebla. Venta online: **43 `sí`**, 16 `no` y 231
  `no comprobado`; los seis nuevos `sí` tienen canal `ecommerce`. Evidencia
  acumulada: 20 registros (18 `keep` + 2 `merge`).

- Tras lote 3b / categorías minoritarias (2026-07-15): **290 filas**;
  **94 `verificado`**, **26 `parcial`** y **170 `pendiente`**. Ocho casos
  quedan `verificado` y Lacase queda `parcial`; no hay purgas ni fusiones.
  Venta online: **47 `sí`**, 16 `no` y 227 `no comprobado`; los cuatro nuevos
  `sí` tienen canal `ecommerce`. Evidencia acumulada: 29 registros (27 `keep`
  + 2 `merge`).

- Tras lote 4 / `Aceite` I (2026-07-15): **290 filas**; **106
  `verificado`**, **26 `parcial`** y **158 `pendiente`**. Se resuelven los 12
  casos como `verificado`; diez acreditan pedido remoto actual y Puebla Oliva
  y Soberbio quedan en `no comprobado` como marcas distintas de Oleand.
  Venta online: **57 `sí`**, 16 `no` y 217 `no comprobado`; todos los nuevos
  `sí` tienen canal válido. Evidencia acumulada: 41 registros (39 `keep` + 2
  `merge`).

- Tras lote 5 / `Aceite` II (2026-07-15): **290 filas**; **118
  `verificado`**, **26 `parcial`** y **146 `pendiente`**. Las 12 filas quedan
  verificadas; once acreditan tienda propia y Enboca permanece en `no
  comprobado`. Se corrige el municipio, nombre, teléfono, slug e imagen de
  Enboca, y se actualizan los dominios de We The Legend, 1881 y Herriza de la
  Lobilla. Venta online: **68 `sí`**, 16 `no` y 206 `no comprobado`; no quedan
  aceites pendientes. Evidencia acumulada: 54 registros (51 `keep` + 3
  `merge`).

- Tras lote 6 / `Bodega` I (2026-07-15): **290 filas**; **126
  `verificado`**, **29 `parcial`** y **135 `pendiente`**. Ocho filas quedan
  verificadas y Solana de la Bernarda, Bodegas Cazallo y Fuente Fría quedan
  `parcial` por falta de fuente propia actual suficientemente inspeccionable.
  Se corrigen municipio, slug e imagen de Andalusí Destilerías a Carmona.
  Venta online: **75 `sí`**, 16 `no` y 199 `no comprobado`; siete canales
  nuevos quedan documentados. Evidencia acumulada: 66 registros (62 `keep` +
  4 `merge`).

- Tras lote 7 / `Bodega` II (2026-07-15): **290 filas**; **136
  `verificado`**, **30 `parcial`** y **124 `pendiente`**. Diez filas quedan
  verificadas y Destilerías Rigo queda `parcial`; ya no quedan bodegas
  pendientes. Se corrigen dominios y contactos actuales, especialmente Dehesa
  del Zarco, Bodegas Salado y Góngora. Venta online: **83 `sí`**, 16 `no` y
  191 `no comprobado`; ocho mecanismos nuevos quedan documentados. Evidencia
  acumulada: 77 registros (73 `keep` + 4 `merge`).

- Tras lote 8 / `Charcutería` (2026-07-15): **290 filas**; **146
  `verificado`**, **38 `parcial`** y **106 `pendiente`**. Diez filas quedan
  verificadas y ocho parciales; no hay purgas, fusiones ni duplicados entre los
  tres obradores de Las Navas. Venta online: **94 `sí`**, 16 `no` y 180 `no
  comprobado`; los once nuevos `sí` tienen canal válido. Evidencia acumulada:
  95 registros (91 `keep` + 4 `merge`).

- Tras lote 9 / `Lácteos y quesos` (2026-07-15): **290 filas**; **157
  `verificado`**, **44 `parcial`** y **89 `pendiente`**. Once filas quedan
  verificadas y seis parciales; ya no quedan lácteos pendientes. CorSevilla se
  reubica desde la sede de Cazalla a su quesería de El Pedroso, con corrección
  de slug e imagen. Se completan las coordenadas de Quesí y Quesos Los
  Vázquez, por lo que las 290 filas ya tienen latitud y longitud. Venta online:
  **102 `sí`**, 16 `no` y 172 `no comprobado`; los ocho nuevos `sí` tienen
  canal válido. Evidencia acumulada: 113 registros (108 `keep` + 5 `merge`).

- Tras lote 10 / `Aceitunas y encurtidos` + `Aperitivos` (2026-07-15):
  **290 filas**; **174 `verificado`**, **46 `parcial`** y **70 `pendiente`**.
  Diecisiete filas quedan verificadas y dos parciales; no quedan pendientes en
  ninguna de las dos categorías. Se actualizan identidades y dominios tras la
  fusión de Oleand Manzanilla Olive y se trasladan los mapas de Frutos Secos
  San Blas y Patatas Fritas Umbrete desde sus despachos a las fábricas. Venta
  online: **112 `sí`**, 16 `no` y 162 `no comprobado`; diez tiendas propias
  nuevas quedan documentadas. Evidencia acumulada: 132 registros (127 `keep` +
  5 `merge`).

- Tras lote 11 / `Conservas` + `Despensa artesanal` (2026-07-15): **289
  filas**; **183 `verificado`**, **49 `parcial`** y **57 `pendiente`**. Nueve
  filas quedan verificadas, tres parciales y Grupo Buzón se purga por ser un
  distribuidor sin producción propia atribuible. Se reclasifican cinco
  elaboradores a `Comida preparada` y dos a `Conservas`; ya no quedan filas en
  `Despensa artesanal`. Venta online: **115 `sí`**, 16 `no` y 158 `no
  comprobado`; Majao, Mariscos Espinosa y Salsas Quietud suman tres tiendas
  propias. Evidencia acumulada: 145 registros (139 `keep` + 5 `merge` + 1
  `purge`).

- Tras lote 12 / `Pan y pastelería` I (2026-07-15): **289 filas**; **196
  `verificado`**, **55 `parcial`** y **38 `pendiente`**. Trece filas quedan
  verificadas y seis parciales. Los Artesanos se corrige a `Comida preparada`
  y se actualiza a la identidad, catálogo y planta actual de DFS Food. Venta
  online: **125 `sí`**, 16 `no` y 148 `no comprobado`; diez mecanismos de
  pedido quedan documentados. Evidencia acumulada: 164 registros (158 `keep`
  + 5 `merge` + 1 `purge`).

- Tras lote 13 / `Pan y pastelería` II (2026-07-15): **289 filas**; **214
  `verificado`**, **56 `parcial`** y **19 `pendiente`**. Dieciocho filas
  quedan verificadas y Confitería Cabrera parcial. Venta online: **138 `sí`**,
  18 `no` y 133 `no comprobado`; trece mecanismos quedan documentados.
  Evidencia acumulada: 183 registros (177 `keep` + 5 `merge` + 1 `purge`).

- Tras lote 14 / `Pan y pastelería` III (2026-07-15): **289 filas**; **220
  `verificado`**, **69 `parcial`** y **0 `pendiente`**. Seis filas quedan
  verificadas y trece parciales; la primera pasada de los 197 pendientes queda
  cerrada. Venta online: **147 `sí`**, 18 `no` y 124 `no comprobado`; nueve
  mecanismos quedan documentados. Evidencia acumulada: 202 registros (196
  `keep` + 5 `merge` + 1 `purge`).

## Riesgos editoriales de Sevilla

1. **Estados heredados sin ledger.** `verificado` o `parcial` no sustituyen una
   revisión actual. Se preservan mientras se cierran pendientes, pero el lote
   transversal debe revisar identidad, actividad, municipio, venta online y
   enlaces de las 94 filas heredadas.
2. **Nombres concatenados.** Muchas filas mezclan marca, razón social y persona
   física. Limpiar `nombre` para mostrar la identidad pública sin cambiar un
   slug correcto; cambiar slug solo si codifica una identidad o municipio
   erróneos y registrar `merge` cuando corresponda.
3. **Estepa y panadería.** Estepa concentra 28 filas, 19 pendientes, con posible
   duplicidad entre marca, fábrica, obrador y despacho. Exigir elaboración
   propia y cotejar IGP Mantecados y Polvorones de Estepa cuando proceda.
4. **Sierra Norte.** Cazalla, Constantina, Alanís, El Pedroso, El Real de la
   Jara y municipios próximos mezclan bodegas, destilerías, ibéricos, queserías
   y miel. Un comercio o una marca turística no prueba unidad productiva.
5. **Aceite y aceituna.** Distinguir almazara/envasador/productor de distribuidor
   puro. DOP Estepa y registros institucionales apoyan identidad y municipio,
   pero no actividad actual ni venta online por sí solos.
6. **Venta online heredada.** Todo `sí` debe acabar con canal válido y evidencia
   actual de pedido remoto. Catálogo, exportación B2B, formulario genérico o
   reventa no bastan para `ecommerce`.
7. **Google Maps no basta para `verificado`.** Una ficha puede confirmar
   ubicación, pero debe existir evidencia de elaboración. Nombres genéricos de
   panadería, catering, heladería, carnicería o confitería exigen especial
   cuidado.
8. **Imágenes al final.** No enriquecer imágenes hasta estabilizar identidad,
   slug, fusiones y purgas de cada lote.

## Plan de lotes

| Lote | Alcance pendiente inicial | Filas | Estado |
|---|---|---:|---|
| 1 | `Fruta y verdura` | 3 | cerrado 2026-07-15 |
| 2 | `Cerveza artesana` | 6 | cerrado 2026-07-15 |
| 3a | Miel | 9 | cerrado 2026-07-15 |
| 3b | Categorías minoritarias | 9 | cerrado 2026-07-15 |
| 4 | Aceite I | 12 | cerrado 2026-07-15 |
| 5 | Aceite II | 12 | cerrado 2026-07-15 |
| 6 | Bodega I | 11 | cerrado 2026-07-15 |
| 7 | Bodega II | 11 | cerrado 2026-07-15 |
| 8 | Charcutería | 18 | cerrado 2026-07-15 |
| 9 | Lácteos y quesos | 17 | cerrado 2026-07-15 |
| 10 | Aceitunas y encurtidos + Aperitivos | 19 | cerrado 2026-07-15 |
| 11 | Conservas + Despensa artesanal | 13 | cerrado 2026-07-15 |
| 12 | Pan y pastelería I | 19 | cerrado 2026-07-15 |
| 13 | Pan y pastelería II | 19 | cerrado 2026-07-15 |
| 14 | Pan y pastelería III | 19 | cerrado 2026-07-15 |
| 15 | Cierre transversal de 94 estados heredados, canales, geo y duplicados | 94 | pendiente |

El lote 3 se dividió en Miel (9) y categorías minoritarias: Aromáticas y
condimentos (2), Café (2), Helados (2), Arroz (1), Chocolate (1) y Huevos (1).
Los demás lotes de 12-19 filas también pueden subdividirse si aparecen
fusiones, cierres o investigación contradictoria.

## Flujo por lote

1. Confirmar el snapshot con `npx pnpm list:province Sevilla` y filtros por
   categoría; buscar duplicados por marca, razón social, teléfono, dominio y
   dirección antes de editar.
2. Revisar sitio oficial/tienda/red oficial y una fuente institucional o
   regulatoria cuando aporte municipio, certificación o identidad. Un fallo de
   fetch se contrasta por otra vía antes de retirar un enlace.
3. Resolver identidad, alcance, municipio, categoría y actividad antes de
   venta online. Usar `parcial` si hay fuente fiable pero no una fuente propia o
   verificadora suficiente.
4. Editar CSV y una línea JSONL por decisión; registrar purgas y fusiones como
   tombstones. Actualizar este ledger con el resultado y el nuevo snapshot.
5. Ejecutar `check:csv:changed` y `check:evidence:changed` durante el lote y
   `npx pnpm verify:data` al cerrar el cambio.

## Lote 1 - Pendientes de Fruta y verdura

Fecha: 2026-07-15. Resultado: 3 `keep`, todos `verificado`; 0 purgas y 0
fusiones.

- `kombucha-t-handcrafted-drinks-joseph-kyle-graham-bollullos-de-la-mitacion`:
  nombre público limpiado, categoría corregida a `Bebidas`, web pasada a HTTPS
  y venta online confirmada como `sí` / `ecommerce`.
- `dietaecologica-com-bioalcores-el-viso-del-alcor`: identidad normalizada a
  Bioalcores / Dieta Ecológica, descripción y productos corregidos, redes
  oficiales añadidas y tienda confirmada como `sí` / `ecommerce`.
- `talafoods-transformados-agricolas-los-alcores-el-viso-del-alcor`: nombre
  limpiado a Tala Foods y categoría corregida a `Conservas`; web oficial
  confirma fábrica y transformación en El Viso, sin venta minorista remota
  comprobada.

Tras este lote no quedan filas `pendiente` en la categoría `Fruta y verdura`.

## Lote 2 - Pendientes de Cerveza artesana

Fecha: 2026-07-15. Resultado: 4 `keep` en `verificado`, 1 `keep` en
`parcial`, 1 `merge` y revisión adicional de la fila superviviente de 8
Huellas, degradada a `parcial`.

- Pergara, Mond, Fermentados Artesanales del Aljarafe y Vandalia tienen sitio
  oficial, actividad elaboradora y tienda con productos/precios/carrito; las
  cuatro quedan `sí` / `ecommerce`.
- Fermentados Artesanales del Aljarafe pasa a `Bebidas` porque su actividad
  incluye cerveza, kombucha, hidromiel, braggot y vinos de fruta.
- Desiderata queda `parcial`: Prodetur mantiene una ficha reciente de la
  fábrica, pero `beeranddreams.com` no resuelve y `desiderata.es` devuelve 410.
- `cerveza-artesana-8-huellas-los-palacios-y-villafranca` se fusiona en
  `cervezas-8-huellas-los-palacios-y-villafranca`; se corrigen teléfono,
  correo, Google Maps y coordenadas. La fila superviviente queda `parcial`
  porque el dominio solo devuelve una restricción por país y no ofrece una
  fuente propia inspeccionable en esta revisión.

Tras este lote no quedan filas `pendiente` en `Cerveza artesana`.

## Lote 3a - Pendientes de Miel

Fecha: 2026-07-15. Resultado: 7 `keep` en `verificado`, 2 `keep` en
`parcial`, 1 `merge` de slug y 0 purgas.

- Sierras Andaluzas, Apilore, La Colmena de Teo, Loramiel y María de Miel
  confirman actividad apícola y tienda propia activa; todas quedan `sí` /
  `ecommerce`.
- Tierra Palaciega pasa a `Conservas`: su web oficial acredita conservas y
  salsas de tomate de cosecha propia y tienda activa.
- Obrador Valle de la Osa pasa a `Conservas`; fuentes institucionales y la
  venta actual en CorSevilla confirman sus mermeladas de Constantina. Esa
  reventa independiente no se computa como venta online propia.
- Sierra del Castillo y Miel La Puebla de los Infantes quedan `parcial` al
  disponer solo de fuente institucional reciente, sin fuente propia
  inspeccionable.
- El slug importado de Miel La Puebla contenía el nombre personal, la palabra
  «Miel» y el correo. Se corrige a
  `miel-la-puebla-de-los-infantes-la-puebla-de-los-infantes` y se registra el
  `merge` desde el slug histórico.

Tras este lote no quedan filas `pendiente` en `Miel`.

## Lote 3b - Categorías minoritarias

Fecha: 2026-07-15. Resultado: 8 `keep` en `verificado`, 1 `keep` en
`parcial`, 0 purgas y 0 fusiones.

- Café AB, Aloe Vera Las Coronas, Obrador Helados Estepa y Arroz Doña Ana
  acreditan elaboración y tienda propia activa; quedan `sí` / `ecommerce`.
- Chocolates Mamá Goye, Helados La Valenciana y Campo Alcor confirman obrador
  o granja propios, pero no un pedido remoto utilizable; permanecen en
  `no comprobado`.
- Cafés Mocaibo queda `verificado` con la ficha institucional 2026 y su ficha
  de Maps. El dominio propio presenta un control anti-bot y la tienda citada
  por terceros devuelve 502, por lo que no se afirma venta online.
- Lacase queda `parcial`: Prodetur confirma a Plantaroma y el envasado de
  garbanzos y aromáticas de Marchena, pero no se localizó una fuente propia
  actual inspeccionable.

Tras este lote no quedan pendientes en `Aromáticas y condimentos`, `Arroz`,
`Café`, `Chocolate`, `Helados` ni `Huevos`.

## Lote 8 - Pendientes de Charcutería

Fecha: 2026-07-15. Resultado: 10 `keep` en `verificado`, 8 `keep` en
`parcial`, 0 purgas y 0 fusiones.

- Los Romeros de Alanís, Jamones Caballero, Ibéricos Benito, El Capellán,
  Gisur, La Unión 1890, Dehesa Navera, Salazones González, Procavi y Campos
  Carnes Ecológicas quedan `verificado` con fuente propia actual.
- Embutidos El Romeral, Ibérico Sierra de Cazalla Rivero, Nortecaza,
  Carnicería Manoli, Hnos. Gutiérrez Bermejo, El Descansillo, Embutidos El
  Manantial y D'Cabo quedan `parcial`: la actividad está respaldada por
  Prodetur u otras fuentes recientes, pero falta una fuente propia actual
  suficientemente inspeccionable.
- Se confirma que Carnicería Manoli, Dehesa Navera y Hnos. Gutiérrez Bermejo
  son unidades productivas distintas de Las Navas de la Concepción.
- Procavi se mantiene dentro del catálogo: su web acredita producción integral
  de carne de pavo y centro cárnico en Marchena. El Descansillo también produce
  y transforma carne; se retira `agromoron.com` porque carga una página
  genérica y el dominio actual publicado no resolvió durante la revisión.
- Once filas acreditan pedido remoto: siete tiendas propias, Gisur por correo y
  tres productores por teléfono conforme al directorio de venta de Prodetur.
  En los otros siete casos se mantiene `no comprobado`.

Tras este lote no quedan filas `pendiente` en `Charcutería`.

## Lote 9 - Pendientes de Lácteos y quesos

Fecha: 2026-07-15. Resultado: 11 `keep` en `verificado`, 6 `keep` en
`parcial`, 1 `merge` de slug y 0 purgas.

- Dehesa Castilblanco, CorSevilla, Embutidos y Quesos Corral, Finca Dehesa
  Frías, Quesos Aguilar, La Saucedilla, wellDone Lácticos, La Verea Andaluza,
  Quesos Torrelareina, Quesería Cabañil y Quesos Los Vázquez quedan
  `verificado` con fuentes propias actuales.
- Rancho Villalba, Lácteos La Noria, Flor de Cazalla, Anda la Oveja, Quesos
  Mena y Quesí quedan `parcial`: su actividad productiva está respaldada por
  fuentes institucionales recientes, pero falta una fuente propia actual y
  suficientemente inspeccionable en cada caso.
- CorSevilla se corrige a `corsevilla-el-pedroso`: su web y una publicación de
  2026 sitúan la elaboración quesera en Finca Las Viñas, El Pedroso, no en la
  sede central de Cazalla de la Sierra. Se trasladan municipio, dirección,
  coordenadas e imagen y se registra el `merge` del slug histórico.
- Quesí y Quesos Los Vázquez reciben dirección y coordenadas verificadas de
  sus instalaciones en Osuna y Castilleja del Campo; con ello ya no quedan
  filas sin coordenadas en la provincia.
- Ocho filas acreditan pedido remoto actual: CorSevilla, Corral, Dehesa Frías,
  La Saucedilla y Cabañil mediante tienda propia; Quesos Aguilar por teléfono;
  wellDone y La Verea por WhatsApp. El resto permanece en `no comprobado`.

Tras este lote no quedan filas `pendiente` en `Lácteos y quesos`.

## Lote 10 - Pendientes de Aceitunas y encurtidos + Aperitivos

Fecha: 2026-07-15. Resultado: 17 `keep` en `verificado`, 2 `keep` en
`parcial`, 0 purgas y 0 fusiones.

- Las diez aceituneras quedan `verificado`: La Sabrosita, La Prieta de Oro,
  Labradores de la Campiña, Jolca, Industria Aceitunera Marciense, Aceitunas
  La Andaluza, La Pedrereña, Cobelén, Aceitunas Escamilla y Oleand Manzanilla
  Olive cuentan con fuente propia actual que acredita producción o envasado.
- Frutos Secos San Blas, Salysol, Patatas Fritas Bandera, Frutos Secos Alfer,
  Altramuces Saladitos, La Papa que Llevas y Patatas Fritas Umbrete quedan
  `verificado`. Hijas de Cástulo y Las de Pruna quedan `parcial` porque su
  actividad está confirmada por Prodetur, pero falta una fuente propia actual
  suficientemente inspeccionable.
- Se corrige la web de La Sabrosita a su dominio de marca; Labradores de la
  Campiña recupera su dominio propio; La Prieta estrena su dominio actual y la
  fila de Manzanilla Olive se actualiza a la entidad fusionada Oleand
  Manzanilla Olive sin perder la planta productiva de Utrera.
- Frutos Secos San Blas pasa del punto de venta de La Red a su fábrica del
  polígono Los Palillos. Patatas Fritas Umbrete pasa del despacho urbano a la
  fábrica de La Era Empedrada; se corrigen dirección, teléfono, mapa y
  coordenadas en ambos casos.
- Diez productores acreditan `ecommerce`: La Sabrosita, Labradores de la
  Campiña, La Pedrereña, Cobelén, Oleand Manzanilla Olive, Frutos Secos San
  Blas, Salysol, Patatas Fritas Bandera, Altramuces Saladitos y La Papa que
  Llevas. Los otros nueve permanecen en `no comprobado`.

Tras este lote no quedan filas `pendiente` en `Aceitunas y encurtidos` ni en
`Aperitivos`.

## Lote 11 - Pendientes de Conservas + Despensa artesanal

Fecha: 2026-07-15. Resultado: 9 `keep` en `verificado`, 3 `keep` en
`parcial`, 1 `purge` y 0 fusiones.

- Las Marismas de Lebrija, La Tomatería Palaciega, Majao, Salsas Quietud,
  Catering Hermanos González, Emfacar, Pimientos Casa García, Tu Otra Cocina y
  Mariscos Espinosa quedan `verificado` con fuente propia actual.
- Capón de Galera, Arroces y Salsas Doña Elena y Salsas Moja quedan `parcial`:
  las fuentes recientes confirman elaboración, pero sus dominios están caídos,
  vacíos o no existe una fuente propia actual suficientemente inspeccionable.
- Grupo Buzón se elimina junto con su imagen. Su web se define como distribuidor
  que selecciona productos, marcas y proveedores para horeca y la sociedad
  declara distribución y comercialización, sin una gama propia atribuible.
- Capón de Galera y Pimientos Casa García pasan a `Conservas`. Catering
  Hermanos González, Emfacar, Tu Otra Cocina y Mariscos Espinosa pasan a
  `Comida preparada`; se corrigen productos y descripciones conforme a su
  actividad real.
- Majao, Mariscos Espinosa y Salsas Quietud acreditan `ecommerce`. Los otros
  nueve productores se mantienen en `no comprobado`; contratación de catering,
  contacto B2B y reventa en supermercados no se computan como venta online.

Tras este lote no quedan filas `pendiente` en `Conservas` ni filas de la
categoría `Despensa artesanal`.


## Lote 12 - Pendientes de Pan y pastelería I

Fecha: 2026-07-15. Resultado: 13 `keep` en `verificado`, 6 `keep` en
`parcial`, 0 purgas y 0 fusiones.

- Tragus, Los Artesanos (DFS Food), Artesanos Méndez, Upita de los Reyes,
  Confitería Ortiz, Mantecados Trigo, Panceliac, San Martín de Porres, La
  Tahona de Luis, Pepelnary, Tortas Andrés Gaviño, el Convento de Santa Clara
  de Jesús y E. Moreno quedan `verificado`.
- Productos La Soledad, Pantesano, Picolé Artesanos, El Obrador de Chelín,
  Antiguo Obrador San Joaquín y Confitería Julia Ávalos quedan `parcial`:
  las fuentes públicas actuales confirman elaboración, pero falta una fuente
  propia actual y suficientemente inspeccionable.
- Los Artesanos deja `Pan y pastelería`: la web actual de DFS Food acredita
  que su catálogo principal son platos preparados, además de postres y
  pastelería, y sitúa la planta en Huertordoñez. Se corrigen categoría,
  dirección, mapa, coordenadas, web y descripción.
- Tragus acredita pedido por teléfono y correo; La Tahona de Luis, reparto bajo
  pedido telefónico; Artesanos Méndez, Upita, Ortiz, Trigo, Panceliac, San
  Martín, Pepelnary y Andrés Gaviño disponen de tienda propia. Las otras nueve
  filas permanecen en `no comprobado`.

Tras este lote quedan 38 filas `pendiente`, todas en `Pan y pastelería`.


## Lote 13 - Pendientes de Pan y pastelería II

Fecha: 2026-07-15. Resultado: 18 `keep` en `verificado`, 1 `keep` en
`parcial`, 0 purgas y 0 fusiones.

- Las doce fábricas y obradores de Estepa quedan `verificado`: El Mesías, La
  Despensa de Palacio, La Flor de Estepa, La Fortaleza, La Ponderosa, El Dulce
  Nombre, El Gamo, El Santo, Obrador Real, La Confitera, Picos Atanet y San
  Enrique.
- Pâtisserie Tokyo, La Alacena del Tinao, Special Food Factory, Inés Rosales,
  Picos Artesanos Castilla y Obrador La Hogaza también quedan `verificado`.
  Confitería Cabrera queda `parcial`: dos fuentes provinciales de 2026
  acreditan elaboración, pero falta una fuente propia actual.
- El Gamo se conserva separado de E. Moreno: comparten grupo y sociedad, pero
  la marca histórica mantiene un obrador visitable y producción propia en el
  horno de leña de la calle Écija.
- Special Food Factory pasa a `Aperitivos`, conforme a sus barritas y snacks
  proteicos. La Alacena se corrige a la sede del obrador y a la nueva unidad
  societaria nacida de la escisión de 2025; su venta es exclusivamente física.
- Once fábricas acreditan `ecommerce`; Pâtisserie Tokyo vende por WhatsApp y
  La Hogaza admite reservas por correo o teléfono. La Alacena y Special Food
  Factory quedan en `Venta online=no`; las otras cuatro filas permanecen en
  `no comprobado`.

Tras este lote quedan 19 filas `pendiente`, todas en `Pan y pastelería`.


## Lote 14 - Pendientes de Pan y pastelería III

Fecha: 2026-07-15. Resultado: 6 `keep` en `verificado`, 13 `keep` en
`parcial`, 0 purgas y 0 fusiones.

- Confitería Dovi, Lágrimas de Nebrija, las Clarisas de Marchena y de Morón,
  L'Andalusí y Panadería Obando quedan `verificado` con fuente propia actual.
- Las trece filas restantes quedan establemente en `parcial`: la actividad y
  el municipio están respaldados por fuentes institucionales o prensa fiable,
  pero falta una presencia propia actual suficientemente revisable.
- Se corrigen nombres y catálogos genéricos en las 19 filas. Panadería Azucena
  pasa a la fábrica de La Ventilla y Juan García a la plaza Sacristán Juan de la
  Rocha; se retiran las coordenadas anteriores de ambos puntos por corresponder
  a otros despachos o ubicaciones y no se sustituyen de forma especulativa.
- Se retira el dominio de La Cuesta por estar comprometido con contenido spam
  y devolver error en el TPV, y el de Orangitas porque ya no resuelve.
- Nueve filas acreditan pedido remoto: cuatro tiendas, Dovi, José Dorantes, El
  Chispa y Orangitas por teléfono, y las Clarisas de Morón por correo o teléfono.

Tras este lote no queda ninguna fila `pendiente`. La primera pasada está
cerrada y resta el lote 15 de revisión transversal de los 93 estados heredados
que seguían sin una decisión de evidencia propia.


## Lote 15a - Auditoría transversal de cerveza

Fecha: 2026-07-15. Resultado: 13 `keep`, 2 purgas y 1 fusión.

- Se eliminan Cerveza Taifa y Cerveza Son / Maquila Bar. La antigua unidad de
  Taifa en el Mercado de Triana se transfirió en 2019 y las fuentes actuales la
  marcan cerrada; Maquila y su cerveza SON cerraron definitivamente en junio de
  2024.
- Cervezas Albero se fusiona con Cervezanía / BNKR Beer: son marcas de la misma
  empresa y no dos unidades productivas. El dominio de Cervezanía se retira por
  estar comprometido con contenido de apuestas; la fila unificada queda
  `parcial` y sin venta remota resuelta.
- Río Azul, Guadalquibeer y LaRosa conservan `verificado` y completan su canal
  `ecommerce`. Rancia y Luna del Sur pasan a `verificado` con venta vigente en
  marketplace. Fuegoverde sube a `verificado` por su fuente propia y actividad
  cervecera reciente, pero su venta online queda `no comprobado`.
- Insitu conserva `verificado`, aunque se retira el `no` no acreditado y queda
  en `no comprobado`. Debla baja a `parcial` por las señales contradictorias de
  cierre y la ausencia de un canal propio actual.
- 41420, Nazarena, Cartujana y Bamba quedan `parcial`. En las dos últimas se
  corrigen las direcciones históricas y se evita afirmar actividad presente sin
  una fuente propia reciente.

Tras este sublote hay 286 filas: 219 `verificado`, 67 `parcial` y 0
`pendiente`. Quedan 77 estados heredados por auditar.


## Lote 15b - Auditoría transversal de sectores menores

Fecha: 2026-07-15. Resultado: 15 `keep`, 1 purga y 0 fusiones.

- Setas del Chef se elimina como `not-producer`: su web propia describe una
  actividad de selección, envasado y distribución de setas de otros cultivos.
  Setas y Hongos del Sur sí acredita producción propia y pedidos por correo.
- Once Grados, Reina de los Ángeles y Cooperativa de Marinaleda mantienen
  `verificado` y concretan `ecommerce`. Islanova acredita pedidos por correo y
  teléfono. Yemas El Ecijano pasa a `verificado` con venta en marketplace y se
  traslada de la tienda del centro a la nave productiva de La Fuensanta; las
  coordenadas se sitúan de forma transparente en el centroide del polígono.
- Mare Nostrum, Ibéricos de Constantina y Quesos Sierra de El Real bajan a
  `parcial` por carecer de una fuente propia actual revisable; en Sierra de El
  Real se corrige la dirección a calle Mogoña y se retiran las coordenadas
  antiguas. Quesos Cuatro Tetas también queda `parcial`: la marca se renovó en
  2024, pero su dominio está aparcado.
- Destilerías Reguera, La Latera, Montealbor y Setas y Hongos del Sur conservan
  `verificado`. Se retiran dominios muertos de Reguera y Caracoles Núñez y se
  dejan como `no comprobado` las ventas no demostradas.
- Heligemas se conserva `parcial` como iniciativa productiva de helicicultura
  respaldada institucionalmente, sin atribuirle una venta actual no localizada.

Tras este sublote hay 285 filas: 215 `verificado`, 70 `parcial` y 0
`pendiente`. Quedan 61 estados heredados por auditar.


## Lote 15c - Auditoría transversal de bodegas y aceitunas

Fecha: 2026-07-15. Resultado: 10 `keep`, 0 purgas y 0 fusiones.

- Miura mantiene `verificado` y concreta `ecommerce`: la tienda oficial de
  Grupo Caballero ofrece sus licores con precio y carrito. Fuente Reina también
  conserva `verificado`; su web está en mantenimiento, pero mantiene contacto
  propio y la actividad reciente consta en fuentes municipales.
- Destilerías de Constantina y Señorío de Pazino siguen `verificado`, aunque su
  venta pasa a `no comprobado`: las webs propias muestran los productos, pero
  no una compra actual operativa. Hacienda El Duende y Bodegas Busto bajan a
  `parcial` por carecer de una presencia propia actual suficientemente
  revisable. Joaquín Busto Ayala permanece `parcial` y separado de Bodegas
  Busto, al figurar en otra dirección sin prueba suficiente para fusionarlos.
- Aceitunas Losada conserva `verificado` con su web temporalmente en
  mantenimiento. La Tinaja acredita venta vigente en `marketplace`. Virgen de
  Loreto sube a `verificado` gracias a su web activa y a las noticias de la
  campaña 2025/26; se normalizan nombre, dirección, correo y enlace.

Tras este sublote hay 285 filas: 213 `verificado`, 72 `parcial` y 0
`pendiente`. Quedan 51 estados heredados por auditar.


## Lote 15d - Auditoría transversal de aceite

Fecha: 2026-07-15. Resultado: 12 `keep`, 0 purgas y 0 fusiones.

- Los Garranchales y San Isidro de Gilena acreditan tiendas propias con precio
  y carrito; la segunda sube de `parcial` a `verificado`. Oleoestepa concreta
  también `ecommerce`. Pilares ofrece solicitud directa de producto por
  formulario/correo y San José de Lora de Estepa, presupuesto por WhatsApp.
- Nuestra Señora de la Paz, Sor Ángela de la Cruz, Inmaculada Concepción,
  Fuensanta de Corcoya y San Juan Bautista mantienen `verificado` con webs
  propias activas. En los antiguos `Venta online=no` sin prueba expresa se usa
  `no comprobado`; no tener carrito no demuestra que una cooperativa rechace
  pedidos remotos.
- Nuestra Señora de las Angustias de Alanís y San Plácido bajan a `parcial`:
  las fuentes institucionales o regulatorias actuales confirman producción y
  municipio, pero no se encontró una presencia propia revisable.
- Se actualizan web y contacto de Los Garranchales, la dirección de La Paz, el
  correo de San José y los enlaces HTTPS disponibles.

Tras este sublote hay 285 filas: 212 `verificado`, 73 `parcial` y 0
`pendiente`. Quedan 39 estados heredados por auditar.


## Lote 15e - Auditoría transversal de fruta, verdura y miel

Fecha: 2026-07-15. Resultado: 19 `keep`, 1 purga y 1 corrección de
slug registrada como fusión.

- Parque Norte, Frupal, San Sebastián, Alcafruit y Citran conservan
  `verificado` con fuente propia. Naranjales del Guadalquivir sigue `parcial`.
  Los antiguos `no` sin prueba expresa pasan a `no comprobado`.
- Bioalverde mantiene `verificado` y concreta `ecommerce`; su web enlaza una
  tienda externa operativa. Jacaranda sube a `verificado` con carrito y
  suscripción de cestas. Más Que Lechugas concreta pedidos por WhatsApp, correo
  y teléfono. La Soberana acredita reparto semanal y actualiza dirección y
  contacto. La Campiña de Lebrija sube a `verificado` con su nueva web propia.
- Finca Agroecológica La Inmaculada se corrige de Carmona a El Viso del Alcor:
  cambia a `finca-agroecologica-la-inmaculada-el-viso-del-alcor`, se actualizan
  dirección y contacto, y se eliminan las coordenadas antiguas. Permanece
  `parcial` al no tener una fuente propia actual.
- Miel Deaz, Apinazar y Cabaña Apícola Casta acreditan `ecommerce`. Miel
  Egregia conserva `verificado`, pero se retira la calle no respaldada. La
  Alameña baja a `parcial`; Ketepico y La Golimbra permanecen `parcial`, y en
  esta última se actualiza la nave y se retira el dominio que ya no responde.
- Andaluza de Mieles se elimina como `not-producer`: la web propia describe
  selección y envasado a marca de cliente de mieles de múltiples países, no
  una explotación apícola local.

Tras este sublote hay 284 filas: 212 `verificado`, 72 `parcial` y 0
`pendiente`. Quedan 19 estados heredados por auditar, todos de panadería.


## Lote 15f - Auditoría transversal de panadería heredada

Fecha: 2026-07-15. Resultado: 18 `keep`, 1 purga y 1 corrección de
slug registrada como fusión.

- Domi Vélez, La Colchona, La Estepeña, La Vicaría, El Patriarca, Diego
  Vázquez, Ochoa y Los Ángeles acreditan tiendas propias operativas; se
  concreta `ecommerce`. La Esencia acredita encargos por WhatsApp y Horno
  Nueva Florida, reparto por `marketplace`. Se corrigen los dominios HTTPS de
  La Esencia, La Estepeña, Marchapan y La Campana.
- Ángel Puchi se corrige a `angel-puchi-coria-del-rio`: la fuente propia sitúa
  el obrador en Calle Mimbre de Coria del Río y distingue la dirección de
  Sevilla como mero despacho. Se actualizan municipio, dirección, correo,
  coordenadas, slug e imagen, y la tienda propia confirma `ecommerce`.
- El Torno se elimina como `not-producer`: pertenece a la Catedral de Sevilla
  y distribuye dulces elaborados por conventos de clausura, sin obrador propio
  acreditado.
- La Aurora baja a `parcial`: el fabricante actual y el directorio municipal
  respaldan la identidad histórica y el despacho, pero la web de marca está en
  construcción y no acredita venta remota. La Biblia mantiene `verificado`,
  aunque su catálogo ya no muestra un mecanismo de compra y pasa a `no
  comprobado`.
- Panadería Santa Virginia baja a `parcial`: la asociación panadera y el alta
  mercantil de 2025 apoyan identidad y actividad, pero el dominio está
  desactivado. Confitería La Nevada permanece `parcial` con fuentes locales;
  Marchapan, Cordero y La Campana conservan `verificado` sin atribuirles venta
  online no demostrada.
- Horno Nueva Florida se reubica en su obrador central de Calle La Red Cinco y
  actualiza correo y coordenadas. Se documentan como aproximados los puntos de
  Calle Mimbre y Calle La Red Cinco porque OpenStreetMap aún no numera los
  inmuebles.

Tras este sublote y el cierre de la auditoría hay **283 filas**: **210
`verificado`**, **73 `parcial`** y **0 `pendiente`**. Venta online: **152
`sí`**, **2 `no`** y **129 `no comprobado`**. Las 283 filas finales tienen
evidencia `keep`; el ledger suma 297 registros (283 `keep`, 8 `merge` y 6
`purge`). No quedan estados heredados sin auditar.

## Cierre de validación

- `verify:data`, `check:evidence`, el contrato CSV y el inventario de imágenes
  terminan sin errores ni avisos de evidencia.
- `check:csv:data-quality` conserva un único aviso editorial revisado:
  Hacienda Guzmán está a 15,4 km del centroide de La Rinconada. No es un error
  de municipio ni de coordenadas; el mapa incrustado por la propia hacienda
  coincide con el punto del CSV y la finca ocupa una zona periférica del
  término municipal.
- La completitud provincial queda en 91,7 %. Los huecos restantes son campos
  opcionales de planificación (principalmente imágenes, redes y coordenadas),
  no productores pendientes de verificación.
