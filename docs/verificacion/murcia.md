# Verificación provincial de Murcia

Ledger para planificar y reanudar la primera revisión profunda de
`data/csv/murcia/murcia.csv`. El CSV es la fuente de verdad. La evidencia
estructurada vive en `data/evidence/murcia/murcia.jsonl` desde el cierre de
MR-01.

El procedimiento general sigue `docs/VERIFICATION_TECHNIQUES.md`; los contratos
viven en `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`. Este documento conserva el snapshot, los riesgos
provinciales y una worklist congelada. No convierte la evidencia en requisito
contractual: la usa para demostrar que las decisiones heredadas se han revisado
con el estándar editorial vigente.

## Cómo reanudar

1. Leer `git status --short`, Estado inicial, Reglas y riesgos locales y solo el
   lote pendiente de menor número.
2. Confirmar que Murcia no tiene cambios concurrentes. Localizar únicamente los
   slugs del lote en CSV, evidencia, candidatos e imágenes.
3. Resolver primero identidad, alcance, duplicados, unidad productiva y
   municipio. Auditar `Venta online` después y de forma independiente.
4. Detener la investigación cuando la decisión sea sólida. No completar campos
   opcionales ni enriquecer imágenes salvo que cambien una decisión o queden
   huérfanas por una purga, fusión o corrección de slug.
5. Editar el CSV con un parser CSV, mantener LF y añadir o sustituir una línea
   JSONL por decisión con `reviewedBy: "codex-murcia-2026-07"`.
6. Actualizar en este ledger solo el snapshot, la fila del lote y las
   excepciones reutilizables. Validar el lote antes de pasar al siguiente.

No se tocan filas de otro lote «de paso». Un hallazgo cruzado se anota aquí y se
resuelve en su lote. Si una fila se recategoriza, permanece en el lote congelado
que contiene su slug.

## Definición de completado

- Las 219 filas heredadas tienen una decisión editorial revisada en esta pasada.
  Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- `pendiente` solo sobrevive con un bloqueo real documentado; `parcial` es un
  cierre válido cuando existe un techo registral, secundario o técnico.
- Los 123 `sí` y 80 `no` heredados se comprueban de nuevo como afirmaciones
  dinámicas. Cada `sí` vigente tiene uno o más canales válidos; los casos no
  inspeccionables vuelven a `no comprobado`.
- No quedan duplicados editoriales, enlaces ajenos, imágenes huérfanas ni
  desajustes de identidad sin decidir. Los avisos geográficos se corrigen o se
  justifican con evidencia suficiente.
- CSV y evidencia están reconciliados. Murcia entra en
  `data/evidence/coverage.json` solo al cerrar la pasada completa.
- `npx pnpm verify:data` termina sin incidencias atribuibles a Murcia.

## Estado inicial

- Inicio: **2026-07-28**. Modo: primera pasada profunda de las **219 filas**
  heredadas. No se añaden candidatos antes del cierre transversal.
- Snapshot: **94 `verificado`**, **125 `parcial`** y **0 `pendiente`**. Los 219
  estados son heredados: ninguno sustituye la revisión actual ni recibe crédito
  previo por estar fuera de `pendiente`.
- Venta online: **123 `sí`**, **80 `no`** y **16 `no comprobado`**. Los **219
  canales están vacíos**, incluidos los 123 `sí`; toda la provincia requiere
  reauditoría de venta.
- Categorías: Bodega 39; Pan y pastelería 33; Fruta y verdura 21; Aceite 19;
  Lácteos y quesos 16; Conservas 16; Cerveza artesana, Aromáticas y condimentos,
  Charcutería y Miel 11 cada una; Pescado 6; Helados y Licores 5 cada una; Arroz
  y Café 3 cada una; Sal, Aperitivos, Otros y Aceitunas y encurtidos 2 cada una;
  Chocolate 1.
- Cobertura: dirección y descripción 219/219; Google Maps 216/219; coordenadas
  215/219; web 196/219; imagen 148/219; Instagram 122/219; teléfono 114/219;
  correo 110/219 y Facebook 62/219. Los huecos opcionales no se completan por
  cuota.
- Evidencia inicial: no existe `data/evidence/murcia/murcia.jsonl` y Murcia no
  figura en `data/evidence/coverage.json`.
- Diario y candidatos: este archivo es el primer ledger provincial. No existe
  `docs/candidates/murcia.md`; la pasada no amplía el catálogo hasta estabilizar
  las 219 filas actuales.
- Puertas iniciales: contrato **0 errores y 0 avisos**; calidad **0 errores y 10
  avisos**, todos geográficos. El único Google Maps repetido es una búsqueda
  genérica de Jumilla compartida por cuatro bodegas, no una ficha individual.
- Imágenes: 148/219. Se conservan las válidas, se mueven al corregir un slug y
  se eliminan al purgar una fila. No hay enriquecimiento masivo en esta pasada.

## Estado actual

- Tras **MR-07 (2026-07-28)**: **125 `verificado`**, **93 `parcial`** y **0
  `pendiente`** sobre 218 filas.
- Venta online: **123 `sí`**, **66 `no`** y **29 `no comprobado`**. Hay **38
  canales `ecommerce`**, seis `telefono`, dos `email|telefono`, uno
  `ecommerce|telefono`, uno `marketplace`, uno `whatsapp|telefono` y uno
  `whatsapp|email|telefono`; 168 filas conservan el canal vacío, incluidas las
  decisiones ya auditadas como `no` o `no comprobado`.
- Evidencia: **89 decisiones** en el JSONL provincial: 81 `keep` vigentes,
  siete tombstones `merge` y un `purge`. La cobertura total sigue abierta y
  Murcia no entra todavía en `data/evidence/coverage.json`.

## Reglas y riesgos locales

1. **Cero pendientes no demuestra una pasada.** Se reauditan las 219 filas,
   incluidas las 94 `verificado`. Una fuente registral o de consejo regulador
   normalmente topa en `parcial`; para `verificado` hace falta una fuente
   verificadora leída en vivo que sostenga identidad, actividad y municipio.
2. **Venta online parte de cero editorial.** Los 203 valores afirmativos o
   negativos son dinámicos y no tienen evidencia provincial. Una tienda propia
   o canal de pedido vigente implica `sí` y canal; catálogo, formulario
   genérico, enoturismo, venta B2B o reventa independiente no bastan. Un fallo
   técnico deja `no comprobado`, no `no`.
3. **Escala industrial y pertenencia a grupos se deciden explícitamente.**
   Estrella de Levante, ElPozo, Central Quesera Montesinos, Ricardo Fuentes y
   otras operaciones grandes no se conservan ni se purgan solo por tamaño. Hay
   que demostrar una unidad productiva murciana con identidad propia y encaje en
   el alcance del catálogo.
4. **Productor, cooperativa, exportador y comercializador no son sinónimos.**
   En fruta y verdura, pescado, especias y congelados se debe comprobar cultivo,
   captura, elaboración o transformación propia. Un almacén, subasta,
   comercializadora o exportadora sin producción demostrada queda fuera aunque
   tenga sede, catálogo y venta.
5. **Obrador frente a tienda.** Panaderías, confiterías, carnicerías, heladerías
   y brewpubs entran solo cuando elaboran. Un comercio o local hostelero que
   revende producto ajeno se purga como `not-producer`; la duda se conserva, no
   se convierte en cierre.
6. **Vino requiere unidad y territorio.** Los consejos de Jumilla, Bullas y
   Yecla apoyan pertenencia, identidad y municipio, pero no prueban por sí solos
   actividad actual ni ecommerce. En grupos con varias bodegas se verifica la
   unidad del CSV, no la sede corporativa.
7. **Geografía antes que cosmetización.** Resolver en su lote los diez avisos:
   `casa-rojo-jumilla`, `queseria-artesanal-ameco-murcia`,
   `cafes-bernal-murcia`, `la-zarcillera-lorca`,
   `sabores-de-tallante-cartagena`, `bodega-sierra-norte-jumilla`,
   `apicultura-apiperez`, `bodegas-contreras-lorca`,
   `encurtidos-murcianos-mula` y `panaderia-busquets-cartagena`. Si el problema
   es un homónimo territorial, se corrige el override de referencia, no una
   coordenada válida.
8. **Slugs con topónimo discordante son una señal, no una orden de renombrar.**
   Revisar especialmente `bodegas-delampa-yecla` en Jumilla,
   `queso-la-yerbera-lorca` en Cartagena,
   `confiteria-espinosa-caravaca-de-la-cruz` en Murcia,
   `grupo-lucas-torre-pacheco` en Murcia,
   `kernel-export-torre-pacheco` en Los Alcázares y
   `embutidos-escamez-lorca` en Bullas. Mantener un slug correcto; si la
   identidad o unidad heredada es materialmente errónea, corregir CSV, imagen y
   referencias y dejar un `merge` desde el slug antiguo.
9. **Maps genérico no es localización individual.** Olimendros, Bodegas Xenysel,
   Parajes del Valle y Bodegas Ribera del Juá comparten la búsqueda genérica de
   Jumilla. Sustituirla solo cuando exista una ficha o dirección fiable propia;
   no fabricar un `place_id`.
10. **Primero auditar, después descubrir.** Los registros y directorios pueden
    revelar candidatos, pero se anotan para una fase posterior. No mezclar una
    expansión abierta con la reconciliación de las 219 decisiones heredadas.

## Fuentes provinciales de cotejo

Usar primero fuentes actuales del productor y después fuentes institucionales
para contrastar. Antes de empezar un sector, localizar la página vigente de la
fuente; no conservar en el ledger una URL por memoria o por resultados
indexados.

| Sector | Ancla de contraste | Uso y límite |
|---|---|---|
| Vino | Consejos reguladores de Jumilla, Bullas y Yecla | Inscripción, unidad y municipio; por sí solos topan en `parcial`. |
| Quesos | Consejo de la DOP Quesos de Murcia | Elaboradores inscritos y denominación; comprobar actividad propia actual. |
| Arroz | Consejo regulador de Arroz de Calasparra | Operadores y producto protegido; distinguir cooperativa productora de marca o distribuidor. |
| Pimentón | Consejo regulador de Pimentón de Murcia | Empresas inscritas y alcance; no demuestra venta remota. |
| Ecológico | CAERM | Certificación y operadores; contrastar identidad pública y actividad comercial vigente. |
| Artesanía alimentaria | Registro o directorio vigente de la Región de Murcia | Descubrimiento y apoyo; una ficha institucional no sustituye la fuente verificadora. |
| Actividad local | Sitios oficiales, redes propias, Maps y fuentes municipales | Confirmar unidad, municipio y vigencia; no inferir producción desde el rótulo comercial. |

## Plan y worklist congelada

MR-01 a MR-15 cubren exactamente los **219 slugs iniciales sin solaparse**.
No recalcular la membresía si una fila se purga, fusiona o recategoriza. MR-16
es el cierre transversal y puede revisar cualquier excepción documentada.

| Lote | Alcance inicial | Filas | Estado | Foco |
|---|---|---:|---|---|
| MR-01 | Bodega · Jumilla | 20 | Cerrado · 2026-07-28 | 19 verificadas, una parcial; 16 ecommerce, tres no y un no comprobado; tres cambios de slug trazados. |
| MR-02 | Bodega · Bullas, Cehegín y Moratalla | 12 | Cerrado · 2026-07-28 | Diez verificadas y dos parciales; ocho ecommerce, un pedido remoto multicanal, un no y dos no comprobados; dos cambios de slug trazados. |
| MR-03 | Bodega · Yecla y resto provincial | 7 | Cerrado · 2026-07-28 | Siete verificadas; cinco ecommerce y dos no; sin bajas ni cambios de slug. |
| MR-04 | Pan y pastelería · Murcia | 11 | Cerrado · 2026-07-28 | Diez conservadas: nueve verificadas y una parcial; una baja, siete ventas remotas y dos cambios de slug/identidad trazados. |
| MR-05 | Pan y pastelería · Cartagena, costa y este | 10 | Cerrado · 2026-07-28 | Seis verificadas y cuatro parciales; cinco ventas remotas, dos no y tres no comprobadas; sin bajas ni cambios de slug. |
| MR-06 | Pan y pastelería · noroeste, Altiplano y Guadalentín | 12 | Cerrado · 2026-07-28 | Siete verificadas y cinco parciales; cinco ventas remotas, un no y seis no comprobadas; un cambio de identidad y slug trazado. |
| MR-07 | Fruta y verdura · Vega Alta, Altiplano, Pliego y Librilla | 10 | Cerrado · 2026-07-28 | Ocho verificadas y dos parciales; tres ventas remotas, cuatro no y tres no comprobadas; sin bajas ni cambios de slug. |
| MR-08 | Fruta y verdura · Campo de Cartagena, Guadalentín y resto | 11 | Pendiente | Exportadores, grupos, unidad productiva y alcance. |
| MR-09 | Aceite | 19 | Pendiente | Almazara real, marca, finca, municipio y venta actual. |
| MR-10 | Lácteos y quesos | 16 | Pendiente | Quesería frente a central/grupo, actividad y cuatro `no comprobado`. |
| MR-11 | Conservas, aceitunas y encurtidos | 18 | Pendiente | Transformación propia, encaje de salazones y venta B2B. |
| MR-12 | Cerveza, licores, aperitivos y chocolate | 19 | Pendiente | Fábrica/obrador frente a brewpub o marca; canales actuales. |
| MR-13 | Condimentos, arroz, sal y café | 19 | Pendiente | Elaboración/envasado, productos protegidos y tostadero real. |
| MR-14 | Charcutería y pescado | 17 | Pendiente | Obrador/captura/transformación frente a tienda o mayorista; escala. |
| MR-15 | Miel, helados y `Otros` | 18 | Pendiente | Apicultor/obrador real y resolución de categorías residuales. |
| MR-16 | Cierre transversal | Todas | Pendiente | Evidencia, venta/canales, geo, dedup, enlaces, imágenes y puertas. |

### Resultado de MR-01

- Se conservaron las 20 unidades del lote: 19 quedan `verificado` y Bodegas
  Ribera del Juá queda `parcial`. Su ficha institucional sigue viva, pero no
  hubo una fuente verificadora propia legible ni un canal de venta comprobable;
  el `sí` heredado pasa a `no comprobado`.
- Se corrigieron tres identidades sin cambiar el total provincial:
  `hacienda-del-carche-jumilla` → `esencia-wines-cellars-jumilla`,
  `bodegas-delampa-yecla` → `bodegas-delampa-jumilla` y
  `bodegas-vina-campanero-jumilla` →
  `bodegas-nido-de-cuco-jumilla`. Los slugs antiguos permanecen como `merge` en
  evidencia; ninguna de las tres filas tenía imagen que mover.
- De los 17 `sí` y tres `no` heredados resultaron 16 `sí` con canal
  `ecommerce`, tres `no` y un `no comprobado`. Casa Castillo baja de `sí` a
  `no`; la reventa independiente no cuenta. Nido de Cuco sube de `no` a `sí`
  por su tienda actual. Bodega El Nido se mantiene en `no`: la tienda del grupo
  no ofrece los vinos de esa unidad.
- Se actualizaron dominios y contactos obsoletos de Delampa, Ego, Xenysel,
  Parajes del Valle y las tres identidades corregidas. Las búsquedas Maps
  genéricas de Xenysel, Parajes del Valle y Ribera del Juá se sustituyeron por
  búsquedas nominativas con dirección; Xenysel, Parajes y Esencia conservan un
  centroide municipal honesto hasta disponer de coordenadas individuales
  fiables.
- Los avisos de Casa Rojo y Sierra Norte se aceptan: las fuentes actuales sitúan
  ambas unidades en parajes rurales de Jumilla y explican la distancia al
  centroide. Permanecen como avisos de calidad, no como errores.

### Resultado de MR-02

- Se conservaron las 12 unidades: diez quedan `verificado` y dos `parcial`.
  Bodegas Madroñal conserva apoyo de directorio, pero sus dominios publicados
  no resuelven; San Isidro mantiene actividad institucional acreditada hasta
  diciembre de 2026, pero su web heredada no es legible. En ambos casos la
  ausencia de fuente verificadora propia viva impide mantener `verificado`.
- Se corrigieron dos slugs territoriales sin variar el total provincial:
  `bodegas-lavia-bullas` → `bodegas-lavia-cehegin` y
  `bodega-pura-vina-bullas` → `bodega-pura-vina-cehegin`. Lavia está en la
  parcela 38 de Venta del Pino, Cehegín; Pura Viña elabora en el P.I. El
  Muladar de Cehegín aunque su web conserve una dirección de visitas en Fuente
  Carrasca. La imagen de Pura Viña se movió con el slug y ambos nombres
  antiguos quedan como `merge` en evidencia.
- Bodega Monastrell se corrige de Cehegín a Bullas según la dirección del
  Consejo y su geolocalización, junto al límite municipal. Su web ofrece
  envío a domicilio por teléfono, WhatsApp o correo, por lo que pasa de `no` a
  `sí` con los tres canales.
- De los nueve `sí` y tres `no` heredados resultan nueve `sí`, un `no` y dos
  `no comprobado`. Ocho filas acreditan `ecommerce`; Bodegas Lavia usa la
  tienda oficial de MGWines. Tercia de Ulea baja de `sí` a `no`: publica
  precios, pero no carrito ni instrucciones de pedido remoto y la reventa
  independiente no cuenta como canal propio.
- Se actualizaron dominios, teléfonos o contactos obsoletos de Balcona, Lavia,
  Carrascalejo, Carreño, Tercia de Ulea, Hydria, Madroñal y San Isidro. Las
  coordenadas de Tercia se sustituyeron por las publicadas por la propia
  bodega; Pura Viña conserva un centroide municipal honesto hasta disponer de
  geolocalización individual fiable.

### Resultado de MR-03

- Se conservaron y verificaron las siete bodegas del lote. No hubo bajas,
  fusiones ni cambios de municipio o slug; la ubicación rural publicada de
  Bodegas Contreras en Avilés justifica su aviso de distancia respecto del
  centroide de Lorca.
- Cinco unidades acreditan `ecommerce`: Barahonda, Bodegas Castaño, Bodegas
  Evine, Bodegas Contreras y Conde de Montornés. Bodega Madrid Romero queda en
  `no` porque su supuesta tienda es una plantilla genérica de Wix sin vinos
  propios ni pedido utilizable. Viñavista también queda en `no`: su web
  presenta vino a granel para clientes profesionales, sin carrito ni
  instrucción explícita de pedido remoto para consumidor.
- Se actualizaron descripciones editoriales, direcciones o contactos de las
  siete unidades y se corrigieron dominios canónicos. La escritura de
  `Zahorí` se normalizó en Conde de Montornés.

### Resultado de MR-04

- Se conservaron diez de las once filas: nueve quedan `verificado` y
  Confitería Roses permanece `parcial`, porque su página vigente sostiene
  identidad, local y contacto pero no demuestra suficientemente elaboración
  propia actual. La antigua Confitería Viena se purga como identidad cerrada:
  tras su adquisición y reforma, la marca desapareció y el local reabrió en
  2025 bajo la enseña Pastelerías Luis Miguel. La posible alta del adquirente
  queda para la fase de descubrimiento.
- `confiteria-espinosa-caravaca-de-la-cruz` se corrige a
  `confiteria-espinosa-murcia`: su obrador está en Floridablanca, Murcia, y no
  en Caravaca. La imagen se movió con el slug y el nombre antiguo queda como
  `merge` en evidencia.
- Siete unidades acreditan venta remota: cinco mediante `ecommerce`, Zaher por
  teléfono y Consuegra por correo o teléfono. La Peladilla y Roses quedan en
  `no`. Maite pasa a `no comprobado`: su obrador está verificado, pero el único
  acceso aparente a pedido remoto devolvió un error técnico y no justifica
  forzar un negativo.
- Se corrigieron contactos, direcciones, descripciones o dominios canónicos de
  las diez filas conservadas. Andrés Mármol se actualizó a su dirección actual
  de Pintor Pedro Cano 30; El Pan de San Miguel se verificó mediante su web
  propia y su canal promovido en Too Good To Go.

### Resultado de MR-05

- Se conservaron las diez filas: seis quedan `verificado` y cuatro `parcial`.
  San Vicente, Artesanos San Ramón, Mariquita La del Pan y Noelia y Fran no
  disponen de una fuente verificadora propia legible suficiente; se mantienen
  cuando directorios actuales y fuentes locales sostienen identidad, municipio
  y, cuando corresponde, elaboración.
- Cinco unidades acreditan venta remota: Pedrín y UP! Obrador mediante
  `ecommerce`, Mariquita La del Pan y Noelia y Fran por teléfono, y Otón por
  correo o teléfono. Busquets y Horno Artesano Baños quedan en `no`. San
  Vicente, José Antonio y San Ramón quedan en `no comprobado`; los dos últimos
  sufrieron barreras técnicas en sus dominios y no se convirtió el fallo en un
  negativo.
- Panadería Busquets corrigió su dirección pública a calle Marín 12 y Horno
  Artesano Baños a avenida Juan Carlos I 21. El `sí` heredado de Horno Baños se
  retiró porque el enlace de tienda devuelve 404 y la web solo ofrece
  información o reservas locales. Otón, por el contrario, publica instrucciones
  explícitas de encargo por correo y teléfono.
- Se actualizaron nombres comerciales, contactos, descripciones y dominios
  canónicos. No hubo bajas, fusiones ni cambios de slug o imagen en el lote.

### Resultado de MR-06

- Se conservaron las doce filas: siete quedan `verificado` y cinco `parcial`.
  Dulces Brocal, Libricos Yecla, Panadería y Alimentación Paloma, Bizcochos
  Borrachos de Ojós Joaquinito y Mari Rosi carecen de una fuente verificadora
  propia legible suficiente; las fuentes institucionales o directorios actuales
  sostienen identidad, municipio y, cuando corresponde, elaboración.
- Cinco unidades acreditan venta remota: Espejo por tienda y teléfono, La
  Lorquina y Naber por teléfono, y Todopan y Roch mediante `ecommerce`. El
  Porvenir queda en `no`: su web anuncia entrega, pero no ofrece mecanismo de
  pedido y presenta el formulario únicamente para consultas.
- Brocal, Libricos, Paloma, Joaquinito, Zenón y Mari Rosi quedan en `no
  comprobado`. En Zenón el catálogo con precios está restringido a clientes
  profesionales previamente dados de alta; en Brocal el dominio ya no resuelve
  DNS y en Libricos aparece una barrera técnica. Ninguno se convirtió en un
  negativo por una interfaz inaccesible o ambigua.
- `bizcocheria-artesana-de-ojos-ojos` se corrigió a
  `bizcochos-borrachos-de-ojos-joaquinito`, la identidad pública vigente, y se
  trazó el tombstone `merge`. También se corrigieron el portal y teléfono de
  Ojós, la dirección de Zenón a Padre Lasalde 2, y contactos de Espejo, La
  Lorquina, Todopan, Brocal, Libricos y Naber. No hubo bajas ni cambios de
  imagen en el lote.

### Resultado de MR-07

- Se conservaron las diez filas: ocho quedan `verificado` y dos `parcial`.
  Frutas Esther conserva un techo técnico porque su web bloquea el contenido y
  la producción se sostiene con fuentes registrales; Frutas Torero confirma
  manipulación y exportación, pero su web atribuye las fincas a Hortofrutícola
  Topi y no despeja por completo la unidad productiva.
- Tres unidades acreditan venta remota: Frutas El Ciezano mediante teléfono,
  Vega de Pliego por WhatsApp o teléfono y Frupliego en su escaparate propio de
  Agroboca. Frutas Torero, Campos de Jumilla, Frutas Sopalmo y Toñifruit quedan
  en `no` tras revisar webs actuales sin tienda ni instrucción de pedido.
- Thader Cieza, La Vega de Cieza y Frutas Esther quedan en `no comprobado`.
  Las tiendas estacionales de Thader y La Vega permanecen publicadas, pero
  mostraban todas las cajas no disponibles y sin precio utilizable; el bloqueo
  de Frutas Esther tampoco se convirtió en un negativo.
- Se corrigieron domicilios y contactos de Esther, Torero, La Vega de Cieza,
  El Ciezano, Toñifruit, Vega de Pliego y Frupliego. Frupliego se describe ahora
  correctamente como S.L., no como cooperativa, y Vega de Pliego pasa a avenida
  de Mula, 30176. No hubo bajas, fusiones, cambios de slug ni movimientos de
  imagen.

### Membresía exacta por lote

**MR-01 (20):** `bodegas-luzon-jumilla`,
`bodegas-silvano-garcia-jumilla`, `bodegas-vina-elena-jumilla`,
`bodegas-juan-gil-jumilla`, `bsi-bodegas-san-isidro-jumilla`,
`hacienda-del-carche-jumilla`, `bodegas-carchelo-jumilla`,
`casa-rojo-jumilla`, `bodegas-delampa-yecla`, `bodegas-alceno-jumilla`,
`bodegas-bleda-jumilla`, `ego-bodegas-jumilla`,
`bodega-sierra-norte-jumilla`, `bodegas-olivares`,
`bodegas-xenysel-jumilla`, `parajes-del-valle-jumilla`,
`bodegas-ribera-del-jua-jumilla`, `bodegas-casa-castillo-jumilla`,
`bodega-el-nido-jumilla`, `bodegas-vina-campanero-jumilla`.

**MR-02 (12):** `bodega-balcona-bullas`, `bodega-monastrell-bullas`,
`bodegas-lavia-bullas`, `bodegas-del-rosario-bullas`,
`bodega-carrascalejo-bullas`, `bodegas-carreno-cehegin`,
`la-del-terreno-bullas`, `bodega-tercia-de-ulea-moratalla`,
`bodegas-hydria-cehegin`, `bodegas-madronal-bullas`,
`bodega-pura-vina-bullas`,
`bodega-cooperativa-vinicola-agraria-san-isidro-bullas`.

**MR-03 (7):** `barahonda-yecla`,
`bodega-madrid-romero-torre-pacheco`, `bodegas-castano-yecla`,
`bodegas-evine`, `bodegas-contreras-lorca`, `bodegas-vinavista-yecla`,
`bodega-conde-de-montornes-yecla`.

**MR-04 (11):** `la-colegiala-murcia`,
`confiteria-espinosa-caravaca-de-la-cruz`, `andres-marmol-murcia`,
`pasteleria-bonache`, `pasteleria-zaher`, `confiteria-la-peladilla`,
`confiteria-maite`, `el-pan-de-san-miguel-murcia`,
`confiteria-roses-murcia`, `confiteria-viena-murcia`,
`confiteria-consuegra-murcia`.

**MR-05 (10):** `confiteria-san-vicente-cartagena`,
`panaderia-jose-antonio-san-pedro-del-pinatar`,
`artesanos-san-ramon-fuente-alamo`,
`confiteria-pedrin-san-pedro-del-pinatar`,
`panaderia-busquets-cartagena`, `mariquita-la-del-pan-aguilas`,
`panaderia-y-confiteria-oton-cartagena`, `up-obrador-cartagena`,
`noelia-y-fran-beniel`, `horno-artesano-banos-las-torres-de-cotillas`.

**MR-06 (12):** `confiteria-espejo`, `la-lorquina-lorca`,
`panaderia-el-porvenir-lorca`, `todopan-caravaca-de-la-cruz`,
`dulces-brocal-caravaca-de-la-cruz`, `libricos-yecla-yecla`,
`pasteleria-roch-moratalla`, `panaderia-y-alimentacion-paloma-ulea`,
`bizcocheria-artesana-de-ojos-ojos`, `pasteleria-naber-jumilla`,
`panaderia-zenon-yecla`, `confiteria-y-pasteleria-mari-rosi-yecla`.

**MR-07 (10):** `frutas-esther-abaran`, `frutas-torero-abaran`,
`cooperativa-thader-cieza`, `la-vega-de-cieza-s-c-a-cieza`,
`frutas-el-ciezano-cieza`, `campos-de-jumilla-jumilla`,
`frutas-sopalmo-jumilla`, `tonifruit-librilla`,
`sociedad-cooperativa-vega-de-pliego-pliego`, `frupliego-pliego`.

**MR-08 (11):** `el-ciruelo-alhama-de-murcia`,
`grupo-lucas-torre-pacheco`, `kernel-export-torre-pacheco`,
`campo-de-lorca-lorca`, `soltir-torre-pacheco`, `perichan-mazarron`,
`alimer-lorca`, `gregal-torre-pacheco`, `el-limonar-de-santomera`,
`camposeven-san-pedro-del-pinatar`, `hortamira-san-javier`.

**MR-09 (19):** `deortegas-yecla`, `casa-pareja-jumilla`,
`olivares-del-sur-abanilla`, `almazara-la-purisima-yecla`,
`almazara-san-diego-lorca`, `almazara-casa-de-la-ermita-jumilla`,
`almazara-valle-de-ricote`, `almazara-esencia-de-cieza`, `coato-totana`,
`el-totanero`, `almazara-llano-y-monte`, `almazara-ramon-perez-fortuna`,
`olimendros-jumilla`, `almazara-leva-lorca`,
`almazara-la-esperanza-calasparra`, `aceites-orico-jumilla`,
`olimel-jumilla`, `hacienda-san-miguel-alhama-de-murcia`,
`almazara-lebor-totana`.

**MR-10 (16):** `queso-la-yerbera-lorca`,
`quesos-ruperto-san-javier`, `quesos-palancares-bullas`,
`central-quesera-montesinos-jumilla`, `queseria-el-roano-lorca`,
`queseria-artesanal-ameco-murcia`, `queseria-el-cabecico-murcia`,
`la-zarcillera-lorca`, `queserias-villavieja-s-l-calasparra`,
`sabores-de-tallante-cartagena`, `queseria-la-granja-del-fraile-aguilas`,
`coagacart-scl-torre-pacheco`,
`especialidades-lacteas-tio-rest-caravaca`,
`quesos-valle-del-carche-jumilla`,
`queseria-hermanos-guardiola-c-b-jumilla`, `campospain-cartagena`.

**MR-11 (18):** `caprichos-del-paladar-murcia`,
`alcurnia-alimentacion-molina-de-segura`, `conservas-el-raal-murcia`,
`valera-salazones`, `pedrin-salazones`, `el-modesto`, `vegasana`,
`agrolarrosa`, `conservas-nicola`, `conservas-el-valle-la-rueda`,
`hida-alimentacion-mula`, `abellan-biofoods-santomera`,
`conservas-sandoval-molina-de-segura`, `villaolivo-totana`,
`conservas-y-mermeladas-p-listo-san-javier`,
`encurtidos-murcianos-mula`,
`aceitunas-y-encurtidos-guillamon-ceuti`,
`conservas-alguazas-alguazas`.

**MR-12 (19):** `cervezas-estrella-de-levante-murcia`, `yakka-murcia`,
`cerveza-icue-cartagena`, `catedra-beer`, `canana-la-brewpub`,
`cerveza-belich`, `cerveza-el-cantero`, `cervezas-ricote-valley-ricote`,
`another-planet-brewing-torre-pacheco`,
`tukan-chocolates-molina-de-segura`, `destilerias-belmonte-murcia`,
`destilerias-bernal-murcia`, `patatas-fritas-acho-molina-de-segura`,
`patatas-rubio-bullas`, `cerveza-bizantina-la-union`,
`cerveza-grana-lorqui`, `anis-flor-de-murcia-cehegin`,
`destilerias-ml-lorqui`, `licores-panocho-molina-de-segura`.

**MR-13 (19):** `cooperativa-virgen-de-la-esperanza-calasparra`,
`arroces-flor-de-calasparra-calasparra`, `arroz-la-campana-calasparra`,
`pimenton-la-pastora-murcia`, `sabater-spices-murcia`,
`pimenton-santo-domingo-totana`, `cafes-salzillo-murcia`,
`cafes-bernal-murcia`, `cafes-jayza-murcia`, `especias-el-explorador`,
`vicente-bravo`, `munoz-y-pujante`, `paprimur`,
`salinera-espanola-san-pedro-del-pinatar`,
`essential-oils-s-l-moratalla`, `cantos-natural-moratalla`,
`lopez-matencio-s-a-alcantarilla`, `j-cano-murcia`, `jumsal-jumilla`.

**MR-14 (17):** `salazones-garre-san-pedro-del-pinatar`,
`salazones-diego-san-pedro-del-pinatar`,
`ricardo-fuentes-e-hijos-cartagena`,
`pescados-albaladejo-san-pedro-del-pinatar`,
`elpozo-alimentacion-alhama-de-murcia`, `embutidos-escamez-lorca`,
`embutidos-debandera-mula`, `embutidos-gilar-jumilla`,
`embutidos-galindo-torre-pacheco`, `chato-murciano-reverte-lorca`,
`embutidos-la-madre-lorca`, `salazones-saez-san-pedro-del-pinatar`,
`airemar-murcia`, `carniceria-el-portusero-torre-pacheco`,
`carniceria-fulgencio-archena`, `embutidos-cehegin-cehegin`,
`los-picones-gourmet-mazarron`.

**MR-15 (18):** `miel-api-rosa-murcia`, `apicola-pinera-cieza`,
`cremoso-postres-moratalla`, `miel-el-colmenero-de-barranda`,
`miel-gimiele`, `miel-fuente-marques`, `apicultura-apiperez`,
`apicola-adrianreolid-calasparra`,
`miel-monasterio-los-jeronimos-murcia`,
`mieles-balsas-fuente-alamo-de-murcia`,
`flor-da-miel-caravaca-de-la-cruz`, `behoney-murcia`,
`confituras-tradicionales-caravaca-de-la-cruz`,
`temperato-felice-gelato-totana`, `helanatura-la-union`,
`puro-helado-murcia`, `helifrusa-lorca`,
`helados-artesanos-venecia-mazarron`.

## Flujo por lote

1. Confirmar el snapshot con `npx pnpm list:province Murcia` y, cuando proceda,
   `--categoria`. Buscar duplicados por identidad, razón social, teléfono,
   dominio, dirección y unidad productiva antes de editar.
2. Revisar una fuente verificadora actual y una fuente institucional o
   regulatoria cuando aporte municipio, certificación o pertenencia. Contrastar
   por otra vía cualquier fallo de DNS, TLS, bloqueo o timeout antes de retirar
   un enlace o degradar una decisión.
3. Resolver en este orden: exclusión/fusión, identidad, producción, municipio,
   categoría y actividad. Después decidir venta online con evidencia propia y
   actual.
4. Editar CSV y JSONL en el mismo cambio. Cada `keep` debe reflejar exactamente
   `verificacion`, `Venta online` y `Canal de venta`; las purgas y fusiones dejan
   tombstone.
5. Ejecutar durante el lote:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   git diff --check
   ```

6. Registrar aquí fecha, resultado, excepciones y nuevo snapshot. No copiar
   investigación efímera ni narrar cada búsqueda.
7. En MR-16 reconciliar todos los slugs actuales contra el último `keep`,
   revisar los tombstones, ejecutar `npx pnpm verify:data` y solo entonces
   añadir `murcia/murcia` a `data/evidence/coverage.json`.

## MR-08 — grandes hortofrutícolas

- Cerrado el 2026-07-28: 11 unidades heredadas revisadas, 11 verificadas.
- Venta online: 1 `sí` (Freshvana, tienda propia de Camposeven) y 10 `no`.
- Se corrigieron dos slugs que codificaban un municipio equivocado:
  `grupo-lucas-torre-pacheco` → `grupo-lucas-murcia` y
  `kernel-export-torre-pacheco` → `kernel-export-los-alcazares`; ambos dejan
  tombstone y conservan su imagen con el nombre nuevo.
- Se sustituyó el dominio fallido de Perichán por `perichan.com` y el dominio
  legado de Hortamira por su web vigente `hortamira.com`.
- Snapshot tras MR-08: 218 filas; 136 verificadas, 82 parciales y 0 pendientes.
  Evidencia acumulada: 92 `keep`, 9 `merge` y 1 `purge`.

## MR-09 — aceite y almazaras

- Cerrado el 2026-07-28: 19 filas heredadas revisadas; quedan 17 unidades,
  16 verificadas y 1 parcial.
- Se corrigió `almazara-san-diego-lorca` a
  `almazara-san-diego-puerto-lumbreras`, con tombstone, porque la fábrica está
  en Puerto Lumbreras.
- `almazara-casa-de-la-ermita-jumilla` se fusionó con
  `esencia-wines-cellars-jumilla`: era la misma bodega mal descrita como
  almazara. `el-totanero` se purgó como comercializador sin unidad productiva
  propia; su web atribuye la molturación a VillaOlivo.
- Venta online: 9 `sí`, 7 `no` y 1 `no comprobado`. Se retiraron positivos
  heredados sin compra vigente en COATO, Aceites Orico y Hacienda San Miguel.
- Snapshot tras MR-09: 216 filas; 141 verificadas, 75 parciales y 0 pendientes.
  Evidencia acumulada: 109 `keep`, 11 `merge` y 2 `purge`.

## MR-10 — queserías y lácteos

- Cerrado el 2026-07-28: 16 filas heredadas revisadas; quedan 13 unidades,
  11 verificadas y 2 parciales.
- Se fusionó la marca La Yerbera con su elaboradora COAGACART y se corrigió su
  municipio de Torre Pacheco a Cartagena. AMECO se corrigió de Murcia a Molina
  de Segura. Ambos cambios dejan tombstone y conservan la imagen cuando existía.
- CampoSpain se fusionó con Sabores de Tallante: su aviso legal identifica a
  ETICORENT como titular de la tienda, mientras la comunicación de la quesería
  remite allí la venta de sus elaboraciones. Se purgó El Cabecico por cese de
  actividad quesera documentado.
- Venta online: 7 `sí`, 4 `no` y 2 `no comprobado`. Se incorporaron los canales
  vigentes de Ruperto, El Roano, La Zarcillera, Villavieja, La Granja del
  Fraile y AMECO.
- Snapshot tras MR-10: 213 filas; 144 verificadas, 69 parciales y 0 pendientes.
  Evidencia acumulada: 122 `keep`, 15 `merge` y 3 `purge`.

## MR-11 — conservas y encurtidos

- Cerrado el 2026-07-28: 18 unidades revisadas; 17 verificadas y 1 parcial.
- Se incorporaron las webs vigentes de El Modesto y P. Listo, se normalizaron
  dominios y contactos, y no se detectaron duplicados ni unidades fuera de
  alcance.
- Venta online: 10 `sí`, 7 `no` y 1 `no comprobado`. Se confirmaron tiendas
  activas en El Raal, El Modesto, Agrolarrosa, Nicola, Hida, Abellán Biofoods,
  Villaolivo y Guillamón. Se retiraron positivos heredados sin compra visible
  en Sandoval, P. Listo y Conservas Alguazas; Encurtidos Murcianos queda
  parcial porque su dominio publicado no responde.
- Snapshot tras MR-11: 213 filas; 150 verificadas, 63 parciales y 0 pendientes.
  Evidencia acumulada: 140 `keep`, 15 `merge` y 3 `purge`.

## MR-12 — bebidas, chocolate y aperitivos

- Cerrado el 2026-07-28: 19 unidades revisadas; 16 verificadas y 3 parciales.
- Estrella de Levante, Yakka, Another Planet, Cerveza Grana, Anís Flor de
  Murcia y Destilerías ML pasan a reflejar sus fábricas y canales vigentes. No
  se detectaron duplicados ni exclusiones con evidencia suficiente.
- Venta online: 9 `sí`, 7 `no` y 3 `no comprobado`. Se verificaron las tiendas
  de Yakka, Belich, Ricote Valley, Tukán, Belmonte, Flor de Murcia y
  Destilerías ML; Acho vende mediante Amazon y Another Planet admite pedidos
  desde su web. Cátedra conserva una sección de tienda sin productos públicos.
- Icue, Bizantina y Licores Panocho quedan parciales: las fuentes disponibles
  no permiten demostrar actividad reciente y revisar canales propios.
- Snapshot tras MR-12: 213 filas; 156 verificadas, 57 parciales y 0 pendientes.
  Evidencia acumulada: 159 `keep`, 15 `merge` y 3 `purge`.


## MR-13 — arroz, café, especias y sal

- Cerrado el 2026-07-28: 19 filas heredadas revisadas; quedan 18 unidades,
  14 verificadas y 4 parciales.
- Se corrigieron las identidades territoriales de Cafés Salzillo
  (Murcia → Alcantarilla) y Cafés Bernal (Murcia → Cartagena), con tombstones
  para sus slugs anteriores. “Pimentón Santo Domingo” se excluyó: la entidad
  localizada produce en Aldeanueva del Camino (Extremadura), no en Totana.
- Venta online: 5 `sí`, 9 `no` y 4 `no comprobado`.
  Se verificaron las tiendas de Virgen de la Esperanza, La Pastora, Salzillo,
  Jayza y Salinera Española; se retiraron positivos no demostrados en Essential
  Oils y Jumsal.
- Snapshot tras MR-13: 212 filas; 182 verificadas,
  30 parciales y 0 pendientes.

## MR-14 — salazones, carne y embutidos

- Cerrado el 2026-07-28: 17 unidades revisadas; 15 verificadas y
  2 parciales.
- Embutidos Escámez se corrigió de Lorca a Bullas, donde está su fábrica, y
  conserva tombstone e imagen bajo el slug nuevo. Airemar y Embutidos Gilar
  quedan parciales porque sus dominios no ofrecen evidencia pública suficiente.
- Venta online: 9 `sí`, 6 `no` y 2 `no comprobado`.
  Se confirmaron nueve tiendas; se retiraron positivos heredados sin checkout
  en Escámez, Gilar, Galindo y Embutidos Cehegín.
- Snapshot tras MR-14: 212 filas; 182 verificadas,
  30 parciales y 0 pendientes.

## MR-15 — miel, confituras, postres y helados

- Cerrado el 2026-07-28: 18 unidades revisadas; 16 verificadas y
  2 parciales.
- Se incorporaron las webs propias vigentes de Apícola Piñera y Confituras
  Tradicionales. Cremoso Postres y El Colmenero de Barranda quedan parciales
  por falta de señales actuales suficientes para resolver su venta remota.
- Venta online: 8 `sí`, 8 `no` y 2 `no comprobado`.
  Se conservaron ocho tiendas con compra demostrable y se retiraron positivos
  basados solo en cartas, catálogos o venta presencial.
- Snapshot tras MR-15: 212 filas; 182 verificadas,
  30 parciales y 0 pendientes.
  Evidencia acumulada: 212 `keep`, 18 `merge`
  y 4 `purge`.

## MR-16 — reconciliación y cierre

- Cerrado el 2026-07-28: los 212 slugs actuales tienen un último registro
  `keep` y paridad exacta con `verificacion`, `Venta online` y
  `Canal de venta`; no quedan decisiones huérfanas.
- Se revisaron los 18 tombstones `merge` y los 4 `purge`: ningún slug retirado
  permanece en el CSV y todos los destinos de fusión existen.
- Snapshot final: 212 filas; 182 verificadas, 30 parciales y 0 pendientes.
  Evidencia final: 212 `keep`, 18 `merge` y 4 `purge`.
- Murcia se incorpora a `data/evidence/coverage.json` únicamente después de
  completar esta reconciliación.

## Ola 3 — venta-sin-resolver

- Cerrado el 2026-07-29: se revisaron las 31 ventas `no comprobado` de la
  provincia y se resolvieron 14: 1 `sí` y 13 `no`.
- Panadería José Antonio pasa a `sí` por `ecommerce`: la tienda oficial ofrece
  catálogo, precios, carrito y entrega a domicilio, incluidos envíos
  nacionales.
- Se cierra `no` cuando la presencia pública vigente solo acredita venta
  física, catálogo, contacto general o actividad profesional, sin reparto ni
  instrucciones inequívocas para cursar pedidos remotos.
- Quedan 17 `no comprobado` por fallos de DNS/TLS o servidor, tiendas sin
  existencias, mecanismos restringidos o señales contradictorias. No se
  convierten en `no` mientras el canal no pueda inspeccionarse con fiabilidad.
- Snapshot de venta tras la ola: 109 `sí`, 86 `no` y 17 `no comprobado`.
