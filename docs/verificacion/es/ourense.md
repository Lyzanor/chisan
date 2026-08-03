# Verificación provincial de Ourense

Ledger para planificar y reanudar la verificación profunda de
`data/csv/galicia/ourense.csv`. El CSV es la fuente de verdad y la evidencia por
decisión vive en `data/evidence/galicia/ourense.jsonl`.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
fija el snapshot, los riesgos locales y el alcance de los lotes. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote activo.
2. Confirmar que no hay cambios concurrentes en Ourense.
3. Investigar primero identidad, exclusiones, duplicados y unidad productiva.
4. Resolver `Venta online` de forma independiente; el enlace de un revendedor no
   demuestra venta remota del productor.
5. Editar el CSV de forma estructurada, añadir o sustituir una línea JSONL por
   decisión y actualizar aquí el resumen del lote.
6. Pasar `check:csv:changed`, `check:evidence`, `check:evidence:changed` y
   `git diff --check`. El cierre provincial pasa `verify:data`.

Los lotes agrupan de 6 a 12 filas por categoría o fuente común. No se añaden
candidatos nuevos hasta terminar la primera pasada de las filas existentes.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con bloqueo real documentado; `parcial` es un
  resultado final válido cuando la evidencia tiene techo registral o secundario.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Identidad, unidad productiva, municipio, categoría, enlaces y contactos
  pertenecen al productor; los fallos técnicos no se interpretan como cierre.
- Todos los `Venta online=sí|no` están demostrados y los `sí` tienen canal.
- No quedan duplicados editoriales ni imágenes huérfanas; evidencia y CSV están
  reconciliados y `pnpm verify:data` termina sin incidencias de Ourense.
- Ourense se añade a `data/evidence/coverage.json` solo al cerrar la pasada.

## Estado

- Inicio: **2026-07-18**. Primera pasada profunda de las **168 filas**
  existentes; no añadir candidatos hasta el cierre.
- Snapshot inicial: **168 filas**; **60 `pendiente`, 32 `parcial`, 76
  `verificado`**.
- El árbol tenía trabajo concurrente en Sevilla al iniciar; queda expresamente
  fuera de este expediente.
- Tras OR-01 (2026-07-18): **168 filas**; **51 `pendiente`, 32 `parcial`, 85
  `verificado`**. Las nueve bodegas se conservaron y quedaron verificadas.
  Venta online acreditada por ecommerce propio o de grupo oficial en ocho;
  Coto de Gomariz conserva `no comprobado`. No hubo cambios de slugs ni
  imágenes. Se actualizaron cuatro enlaces web antiguos y el teléfono de Casal
  de Armán desde su web específica de bodega.
- Tras OR-02 (2026-07-18): **168 filas**; **44 `pendiente`, 32 `parcial`, 92
  `verificado`**. Las siete bodegas se conservaron y quedaron verificadas.
  Venta online acreditada por ecommerce propio o de grupo oficial en cinco;
  Roandi y Rafael Palacios conservan `no comprobado`. Se corrigieron dos
  identidades públicas con `merge` e imagen renombrada: `Virxe de Galir` →
  **Virgen del Galir** y `Bodega Cooperativa Jesús Nazareno` → **Vinos Barco**.
- Tras OR-03 (2026-07-18): **168 filas**; **38 `pendiente`, 32 `parcial`, 98
  `verificado`**. Las seis bodegas se conservaron y quedaron verificadas.
  Venta online acreditada por ecommerce propio o de grupo oficial en cinco;
  Crego e Monaguillo conserva `no comprobado`. No hubo cambios de slug ni de
  imagen.
- Tras OR-04 (2026-07-18): **168 filas**; **35 `pendiente`, 33 `parcial`, 100
  `verificado`**. Ponte da Boga y Ronsel do Sil quedaron verificadas con
  ecommerce propio; Adega Vella quedó `parcial` por techo registral y mantuvo
  `no comprobado`. No hubo cambios de slug ni de imagen.
- Tras OR-05 (2026-07-18): **168 filas**; **31 `pendiente`, 34 `parcial`, 103
  `verificado`**. Lácteos da Limia, Santa Mariña de Loureiro y Queixos Ángel
  quedaron verificadas; Touza Vella quedó `parcial`. Queixos Ángel acredita
  pedido por teléfono y correo; los dos elaboradores B2B quedaron con venta
  online `no`. No hubo cambios de slug ni de imagen.
- Tras OR-06 (2026-07-18): **168 filas**; **25 `pendiente`, 35 `parcial`, 108
  `verificado`**. Cinco proyectos apícolas quedaron verificados y con venta
  remota acreditada; Miel de Aldea del Norte quedó `parcial` y mantuvo
  `no comprobado`. No hubo cambios de slug ni de imagen.
- Tras OR-07 (2026-07-18): **168 filas**; **19 `pendiente`, 37 `parcial`, 112
  `verificado`**. Aceites Abril, Cabreiroá, Aguas de Sousas y Granjas Baldomero
  quedaron verificadas; Novoa Natura y Agua de Fontenova quedaron `parcial`.
  Aceites Abril acredita ecommerce y Cabreiroá el marketplace oficial de su
  grupo; Sousas y Baldomero quedaron con venta online `no`. No hubo cambios de
  slug ni de imagen.
- Tras OR-08 (2026-07-18): **168 filas**; **13 `pendiente`, 37 `parcial`, 118
  `verificado`**. Las seis centrales, cooperativas y transformadores quedaron
  verificadas. Patacas Conde, Cuevas Marron Glacé, Amarelante y Sofragal
  acreditan ecommerce; Gallega de Patatas y Castañas Moral quedaron con venta
  online `no`. La sede de Gallega de Patatas está en Sandiás, no en Xinzo; se
  corrigieron slug, imagen, dirección, mapa y coordenadas con registro `merge`.
- Tras OR-09 (2026-07-18): **168 filas**; **5 `pendiente`, 40 `parcial`, 123
  `verificado`**. Forno do Carlos, Doña Bica, Pura Vila, Fina Rei y Confitería
  Sila quedaron verificadas; Forno da María José, Forno da Ana y Bica Mantecada
  Lalo quedaron `parcial`. Cuatro proyectos acreditan venta remota y Sila quedó
  con venta online `no`. El obrador de Pura Vila está en Cenlle, no en
  Ribadavia; se corrigieron slug, imagen, dirección y mapa con registro `merge`.
- Tras OR-10 (2026-07-18): **168 filas**; **0 `pendiente`, 40 `parcial`, 128
  `verificado`**. Las cinco filas quedaron verificadas. Cafés Las
  Antillas-Campos, Coren y Embutidos de la Montaña de Entrimo acreditan
  ecommerce propio; Chocolatería Cándido y Cerveza Laza quedaron con venta
  online `no`. No hubo cambios de slug ni de imagen.
- Cierre OR-11 (2026-07-18): **168 filas**; **0 `pendiente`, 42 `parcial`, 126
  `verificado`**. Todas las filas tienen un `keep` vigente y Ourense entra en
  cobertura estricta. Se resolvieron ocho ventas remotas adicionales: siete
  ecommerce propios y el marketplace de Panadería Vilanova. Cumbres de
  Trevinca y Bica do Val de Laza se ajustaron a `parcial` por falta de fuente
  primaria; no hubo nuevas altas, bajas, cambios de slug ni imágenes.

## Reglas y riesgos locales

1. Los consejos reguladores de Ribeiro, Valdeorras, Monterrei y Ribeira Sacra
   confirman inscripción y localización, pero sin fuente primaria viva suelen
   dejar techo `parcial`.
2. Distinguir bodega, marca, grupo y viñedo. Una tienda de grupo cuenta cuando la
   propia bodega la enlaza y la referencia está disponible con pedido utilizable.
3. Los contactos de distribución o exportación no bastan por sí solos para
   `Venta online=sí`; debe existir un mecanismo concreto de pedido remoto.
4. En miel y pequeñas explotaciones, una ficha institucional o de calidad no
   demuestra por sí sola actividad primaria actual.
5. Revisar con especial cuidado productores industriales o marcas nacionales:
   la existencia de planta en Ourense no garantiza encaje en el alcance KM0.

## Worklist

| Lote | Alcance | Filas iniciales | Estado | Riesgo principal |
|---:|---|---:|---|---|
| OR-00 | Higiene, snapshot y partición | 168 | ✅ 2026-07-18 | Sevilla concurrente aislada; 60 pendientes |
| OR-01 | Bodegas iniciales Ribeiro + Valdeorras | 9 | ✅ 2026-07-18 | 9 verificadas; 8 ecommerce; 1 venta no comprobada |
| OR-02 | Bodegas Valdeorras restantes | 7 | ✅ 2026-07-18 | 7 verificadas; 5 ecommerce; 2 identidades corregidas |
| OR-03 | Bodegas Monterrei | 6 | ✅ 2026-07-18 | 6 verificadas; 5 ecommerce; 1 venta no comprobada |
| OR-04 | Bodegas Ribeira Sacra | 3 | ✅ 2026-07-18 | 2 verificadas con ecommerce; 1 parcial por techo registral |
| OR-05 | Lácteos y quesos | 4 | ✅ 2026-07-18 | 3 verificadas; 1 parcial; corregida leche de cabra |
| OR-06 | Miel | 6 | ✅ 2026-07-18 | 5 verificadas con venta remota; 1 parcial |
| OR-07 | Aceite, aguas y huevos | 6 | ✅ 2026-07-18 | 4 verificadas; 2 parciales; Fontenova no duplicada |
| OR-08 | Patata, castaña y frutos secos | 6 | ✅ 2026-07-18 | 6 verificadas; 4 ecommerce; Gallega trasladada a Sandiás |
| OR-09 | Pan y pastelería | 8 | ✅ 2026-07-18 | 5 verificadas; 3 parciales; Pura Vila trasladada a Cenlle |
| OR-10 | Café, chocolate, charcutería y cerveza | 5 | ✅ 2026-07-18 | 5 verificadas; 3 ecommerce; 2 consumo en local |
| OR-11 | Reauditoría de parciales, enlaces, geografía y cobertura | 32 | ✅ 2026-07-18 | 168/168 `keep`; 42 parciales con techo explícito; cobertura estricta |

## OR-01 — Bodegas iniciales Ribeiro + Valdeorras

Decisiones cerradas el 2026-07-18:

- `verificado` + ecommerce: Viña Costeira, Casal de Armán, Ramón do Casar,
  Adega Sameirás, Pazo Casanova, Alan de Val, Bodegas Godeval y A Coroa.
- `verificado`, venta no comprobada: Coto de Gomariz.

Incidencias reutilizables:

- Casal de Armán dispone de una web específica de bodega distinta del dominio
  histórico del alojamiento; esta confirma viñedo, elaboración, tienda y el
  teléfono actual de la bodega.
- Pazo Casanova y Godeval enlazan desde sus sitios oficiales tiendas de sus
  grupos con referencias disponibles y carrito; cuentan como ecommerce oficial.
- Coto de Gomariz publica WhatsApp y correo de comercialización, pero el contexto
  es distribución por mercados y no demuestra un pedido minorista concreto.
- Adega Sameirás mostró contenido oficial indexado y tienda con entrega, aunque
  el acceso directo fue intermitente durante la revisión; el fallo técnico no se
  interpretó como inactividad.

## OR-02 — Bodegas Valdeorras restantes

Decisiones cerradas el 2026-07-18:

- `verificado` + ecommerce: Virgen del Galir, Quinta da Peza, Viña Somoza,
  Adega Joaquín Rebolledo y Vinos Barco.
- `verificado`, venta no comprobada: Adega Roandi y Rafael Palacios.

Incidencias reutilizables:

- La marca oficial es **Virgen del Galir**, no la traducción `Virxe de Galir`.
  La bodega enlaza la tienda de su grupo CVNE, con nueve referencias disponibles;
  se corrigieron slug, nombre, código postal e imagen.
- La cooperativa legal Jesús Nazareno se presenta y comercializa actualmente
  como **Vinos Barco**. Es la misma unidad productiva de O Barco, no una alta
  nueva; se corrigieron nombre, slug, imagen y enlaces dejando un `merge`.
- Rafael Palacios tiene sede y contacto de bodega en A Rúa, pero el proyecto y
  sus viñedos están en Val do Bibei, municipio de O Bolo. La fila mantiene el
  municipio de la sede productiva y explicita ambas localizaciones; las ventas
  de comercios independientes no acreditan canal propio.
- Quinta da Peza publica hoy la bodega en la N-120 PK 467, Fontei; se actualizaron
  dirección y contactos desde la web oficial. Su tienda tiene catorce productos.
- Roandi conserva `no comprobado`: su web viva confirma actividad, viñedos y
  ubicación, pero no ofrece tienda ni un mecanismo concreto de pedido remoto.

## OR-03 — Bodegas Monterrei

Decisiones cerradas el 2026-07-18:

- `verificado` + ecommerce: Gargalo, Bodegas Ladairo, Fragas do Lecer / Fraga
  do Corvo, Vía Arxéntea y Pazos del Rey.
- `verificado`, venta no comprobada: Crego e Monaguillo.

Incidencias reutilizables:

- Fragas do Lecer es la bodega familiar Boo-Rivero de Vilaza y presenta hoy el
  proyecto como **Fraga do Corvo**, dentro de Grandes Pagos Gallegos. La tienda
  oficial del grupo mantiene referencias comprables; se aclaró el nombre sin
  cambiar el slug estable.
- Pazos del Rey enlaza desde su propia web la tienda del grupo Terra Selecta,
  con referencias disponibles y compra; la dirección se precisó como
  Albarellos de Monterrei.
- Crego e Monaguillo publica un formulario que permite dirigir consultas al
  departamento comercial, pero no una tienda ni un procedimiento concreto de
  pedido; por eso conserva `Venta online=no comprobado`.
- Gargalo, Ladairo y Vía Arxéntea mantienen tiendas propias con productos,
  precios y carrito. Se normalizaron enlaces HTTPS y se incorporaron contactos
  oficiales.

## OR-04 — Bodegas Ribeira Sacra

Decisiones cerradas el 2026-07-18:

- `verificado` + ecommerce: Adega Ponte da Boga y Ronsel do Sil.
- `parcial`, venta no comprobada: Adega Vella.

Incidencias reutilizables:

- Ponte da Boga mantiene una web oficial viva que confirma la bodega histórica,
  viñedos y elaboración al pie de Castro Caldelas. Su tienda propia ofrece vinos
  con precios, carrito y condiciones de compra; se actualizó nombre singular,
  dirección, correo y HTTPS.
- Ronsel do Sil confirma dos hectáreas de viñedo y elaboración artesanal en
  Sacardebois. Su tienda propia mantiene catálogo, precios, carrito y pedido; se
  corrigieron el código postal y los datos de contacto.
- El directorio actual del Consejo Regulador confirma actividad, viñedos,
  elaboración, marcas y contactos de Adega Vella Xeracións. El dominio oficial
  histórico redirige a `adegavella.es`, pero el destino agotó el tiempo de
  respuesta durante la revisión. El fallo no se interpreta como cierre, aunque
  impide superar el techo `parcial` o acreditar venta remota.

## OR-05 — Lácteos y quesos

Decisiones cerradas el 2026-07-18:

- `verificado`, venta `no`: Lácteos da Limia y Cooperativa Santa Mariña de
  Loureiro.
- `verificado` + pedido por teléfono y correo: Queixos Ángel.
- `parcial`, venta no comprobada: Touza Vella Queixería.

Incidencias reutilizables:

- Lácteos da Limia fabrica en Xinzo desde 1996 y distribuye a hostelería,
  comercio y mayoristas. Su web completa no ofrece pedido minorista remoto; se
  corrigieron nombre, dirección, código postal, teléfono y correo.
- Santa Mariña de Loureiro confirma elaboración actual y puntos de venta en
  cadenas de supermercados. El formulario se dirige a establecimientos que
  quieran comercializar sus productos, no a pedidos minoristas; se clasificó
  `Venta online=no`.
- Queixos Ángel publica expresamente que los pedidos pueden hacerse por teléfono
  o correo. La web confirma elaboración propia con leche cruda de vaca y negocio
  familiar en la Praza de Abastos desde 1949.
- Touza Vella estaba descrita erróneamente como quesería de oveja. El proyecto
  cría cabras y elabora queso de leche cruda de su propia ganadería. Su web viva
  es demasiado escueta y no mantiene la tienda mencionada por el directorio
  territorial, por lo que conserva techo `parcial` y venta `no comprobado`.

## OR-06 — Miel

Decisiones cerradas el 2026-07-18:

- `verificado` + ecommerce: Mel do Caminero, Mel Aialma y Mel Montes do Xurés.
- `verificado` + pedido por WhatsApp/teléfono: Raíña Celta.
- `verificado` + pedido por WhatsApp: Polemel.
- `parcial`, venta no comprobada: Miel de Aldea del Norte.

Incidencias reutilizables:

- Raíña Celta identifica a Andrea y Brais como apicultores y documenta todo el
  proceso en O Irixo. Los pedidos con envío nacional se realizan expresamente
  por WhatsApp o teléfono.
- Mel do Caminero produce miel de sus propias colmenas en A Merca y mantiene
  tienda con miel, propóleo, experiencias y apadrinamiento, carrito y
  condiciones de compra.
- Aialma mantiene tienda propia con miel cruda de sus colmenas de Souteliño y
  polen de montaña; se actualizaron dirección, correo y HTTPS.
- Polemel sí estaba viva bajo HTTPS aunque no aparecía inicialmente indexada.
  Su antigua tienda externa devuelve indisponibilidad, pero la web propia ofrece
  catálogo, precios, envío peninsular y pedido por WhatsApp; ese es el único
  canal clasificado.
- La marca oficial usa **Mel Montes do Xurés**. La explotación familiar publica
  productos, precios, cesta, entrega, pago seguro y datos de elaboración en
  Lobios.
- Miel de Aldea del Norte aparece en un mapeo territorial de 2024 y en una ficha
  empresarial actual, pero carece de fuente primaria accesible y de un proceso
  explícito de pedido remoto; por eso conserva `parcial` y `no comprobado`.

## OR-07 — Aceite, aguas y huevos

Decisiones cerradas el 2026-07-18:

- `verificado` + ecommerce: Aceites Abril.
- `verificado` + marketplace oficial de grupo: Cabreiroá.
- `verificado`, venta `no`: Aguas de Sousas y Granjas Baldomero.
- `parcial`, venta no comprobada: Novoa Natura y Agua de Fontenova.

Incidencias reutilizables:

- Aceites Abril es una envasadora industrial, pero mantiene una unidad productiva
  pertinente: **Colleita Propia**, AOVE elaborado con aceituna exclusivamente
  gallega de más de cien productores. Su tienda propia acredita ecommerce.
- Novoa Natura cultiva olivos en San Mamede de Palmés y elabora un AOVE de
  edición limitada. Solo se obtuvo respaldo del portal sectorial Aceite de
  Galicia, sin fuente primaria o pedido remoto; queda `parcial`.
- Cabreiroá pertenece a Hijos de Rivera y mantiene su planta de extracción y
  envasado en Verín. Bigcrafters es el canal online operado por la corporación y
  ofrece referencias de la marca; se clasifica `marketplace`.
- El dominio histórico de Aguas de Sousas aparece deshabilitado, pero la web
  canónica actual es `sousas.com`. La planta de Verín sigue activa y en
  ampliación; no ofrece pedido minorista remoto.
- Fontenova no es un duplicado de Cabreiroá ni de Sousas: tiene manantial,
  sociedad y planta propios. Su producción comercial actual es reducida y local
  mientras tramita una nueva planta; se corrigió el teléfono, que antes era el
  de Cabreiroá, y se mantiene techo `parcial`.
- Granjas Baldomero confirma producción y envasado propios en Celanova y
  distribución regional. Su web no ofrece pedido remoto, por lo que se fija
  `Venta online=no`.

## OR-08 — Patata, castaña y frutos secos

Decisiones cerradas el 2026-07-18:

- `verificado` + ecommerce: Patacas Conde, Cuevas Marron Glacé, Amarelante y
  Sofragal.
- `verificado`, venta `no`: Gallega de Patatas y Castañas Moral.

Incidencias reutilizables:

- Patacas Conde no acredita cultivo propio: es una central que recibe patata de
  agricultores de A Limia y la clasifica, envasa y distribuye. La tienda propia
  mantiene catálogo, precios, pedido, pago y envío peninsular.
- Gallega de Patatas estaba ubicada erróneamente en Xinzo de Limia. Su web,
  aviso legal, mapa y certificado sitúan la sede en A Brea, Vilariño das
  Poldras, **Sandiás**. Se corrigieron municipio, slug, imagen, dirección,
  coordenadas y contactos dejando un `merge`; el catálogo corporativo no ofrece
  pedido minorista remoto.
- Cuevas transforma castaña gallega en San Cibrao das Viñas y mantiene tienda
  propia con carrito, compra y envío. Se normalizaron dirección oficial, HTTPS
  y gama.
- Amarelante recupera soutos, cultiva castaña ecológica y elabora derivados en
  Manzaneda. Su tienda propia acredita ecommerce; se actualizaron teléfono,
  correo y productos.
- Castañas Moral trabaja con pequeños agricultores locales y realiza selección,
  pesado, envasado y distribución desde O Barco. Se precisó su papel de central
  comercializadora y la parcela 17; la web es informativa y no permite pedido
  minorista remoto.
- Sofragal selecciona, seca y envasa castaña y elabora harina y repostería en
  Luintra. Su tienda admite compra y pago seguro, con recogida en tienda.

## OR-09 — Pan y pastelería

Decisiones cerradas el 2026-07-18:

- `verificado` + ecommerce: Doña Bica, Pura Vila y Fina Rei.
- `verificado` + pedido por teléfono y correo: Forno do Carlos.
- `verificado`, venta `no`: Confitería Sila.
- `parcial`, venta no comprobada: Forno da María José, Forno da Ana y Bica
  Mantecada Lalo.

Incidencias reutilizables:

- Forno do Carlos mantiene web primaria, certificación IGP, encargos y envío a
  toda España mediante contacto; se clasificaron teléfono y correo.
- Forno da María José y Forno da Ana siguen en el listado vigente de operadores
  certificados de Pan de Cea. Sin web o perfil primario que confirme un proceso
  actual de pedido remoto, conservan techo `parcial` y `no comprobado`.
- Bica Mantecada Lalo aparece en la guía oficial de Castro Caldelas y en una
  ficha empresarial actual como obrador mayorista, pero carece de fuente
  primaria accesible; se corrigió el teléfono y queda `parcial`.
- Doña Bica estrenó dominio canónico propio con tienda, productos, precios y
  carrito. Se sustituyó el antiguo `donabica.es` por `donabicaverin.es` y se
  añadió el correo.
- Pura Vila abrió una tienda en Ribadavia, pero el obrador que fabrica los
  productos está en Saa, **Cenlle**. Se corrigieron municipio, slug, imagen,
  dirección y mapa dejando un `merge`; la tienda propia acredita ecommerce.
- Fina Rei elabora en el parque empresarial de Chorente, no en la tienda de
  Emilia Pardo Bazán. Se trasladó la ubicación a la unidad productiva y se
  acreditó ecommerce con envíos peninsulares.
- Confitería Sila confirma obrador de horno de leña y distribución profesional
  desde Ventosela. Su web ofrece catálogo y contacto para distribuidores, pero
  no pedido minorista remoto; se fija `Venta online=no`.

## OR-10 — Café, chocolate, charcutería y cerveza

Decisiones cerradas el 2026-07-18:

- `verificado` + ecommerce: Cafés Las Antillas-Campos, Coren y Embutidos de la
  Montaña de Entrimo.
- `verificado`, venta `no`: Chocolatería Cándido y Cerveza Laza.

Incidencias reutilizables:

- Cafés Las Antillas-Campos confirma torrefacción familiar en Ourense y mantiene
  tienda con cafés, variantes, carrito, entrega peninsular y recogida local.
- Chocolatería Cándido encaja por elaboración propia diaria de churros, no como
  fabricante de chocolate. Su oferta es de consumo hostelero en el local y no
  publica pedido remoto.
- Coren es una cooperativa industrial de gran escala, pero mantiene unidad
  productiva pertinente en Santa Cruz de Arrabaldo y productos cárnicos de raíz
  gallega. A Tenda Coren es el ecommerce oficial del grupo, operado desde la
  misma dirección.
- Embutidos de la Montaña de Entrimo confirma elaboración familiar en Ferreiros
  y tienda propia con cesta, pago y envío peninsular; se actualizó su nombre
  público y el correo.
- Cerveza Laza elabora lager artesana sin pasteurizar en la bodega de Ourense y
  mantiene perfil oficial y actividad pública reciente. La venta se limita al
  local de degustación, sin procedimiento remoto publicado.

## OR-11 — Reauditoría, reconciliación y cobertura

Decisiones cerradas el 2026-07-18:

- Cobertura editorial: **168 de 168 filas** con registro `keep` vigente.
- Estado final: **126 `verificado`, 42 `parcial`, 0 `pendiente`**.
- Venta online final: **81 `sí`, 9 `no`, 78 `no comprobado`**.
- Ecommerce acreditado: Queixos O Rexo, Queixería Riola, Quesos Feijóo,
  Queixos Monte Ceo, Bicas O Forno, Bicas de Trives, Panadería Caneda y Bicas
  Eladio.
- Marketplace acreditado: Panadería Vilanova en Correos Market.
- Ajuste a `parcial`: Quesería Cumbres de Trevinca y Bica do Val de Laza.

Incidencias reutilizables:

- La presencia de carrito no basta si no hay oferta disponible. Posada Marron
  Glacé mantiene sitio e infraestructura de tienda, pero el catálogo está vacío
  y las referencias revisadas aparecen agotadas; conserva `no comprobado`.
- Cumbres de Trevinca y Bica do Val de Laza tienen identidad, actividad y
  ubicación respaldadas por fuentes secundarias actuales, pero no fuente
  primaria accesible; su estado coherente es `parcial`.
- A Casa das Bicas conserva `parcial`: registro público y fuentes empresariales
  confirman el obrador de Soutelo Verde, pero no un canal primario o pedido
  remoto. Se actualizaron teléfono, correo y horario.
- Monte Ceo mantiene web oficial viva y tienda con referencias, precios,
  carrito y tramitación de pedido. Se acreditó ecommerce y se retiró la
  afirmación absoluta no demostrada de ser la única explotación gallega.
- Panadería Caneda combina tienda oficial con checkout y confirmación pública
  reciente de envíos peninsulares; Panadería Vilanova vende mediante un perfil
  propio de vendedor en Correos Market.
- Al quedar reconciliadas todas las filas, `galicia/ourense` se incorporó a
  `data/evidence/coverage.json`. El trabajo concurrente de Sevilla permaneció
  fuera del alcance y no fue modificado por este expediente.

## OR-12 — Ola 3 de venta sin resolver

Decisiones cerradas el 2026-07-29:

- Se acreditaron nueve ventas remotas. Posada Marron Glacé, Pazo Tizón, Granxa
  D'Outeiro, Xulia Bande, Adegas Laudes y Bodegas Gómez Sanmartín tienen
  productos actuales con precio y carrito. Eloi Lorenzo, Señorío de Beade y
  Adegas do Rexurdir aceptan pedidos directos por teléfono.
- Posada deja de clasificarse por la portada vacía de su tienda: fichas del
  mismo catálogo muestran numerosas referencias disponibles y añadibles al
  carrito, además de seguimiento de pedidos.
- Granxa D'Outeiro completa dirección productiva en Francelos, teléfono,
  correo, miel y los tres canales publicados: ecommerce, teléfono y email.
  Adegas Laudes añade el móvil y correo oficiales vigentes.
- Adegas do Rexurdir sustituye el dominio `.com` caído por su web oficial
  `.es`, que publica dirección, teléfono y la acción «hacer un pedido».
- Ladeiras do Ribeiro sustituye el dominio caído por `seika.gal`, completa
  móvil y correo, elimina la afirmación incorrecta de tienda propia y conserva
  venta `sí` mediante pedido telefónico con entrega a domicilio.
- Bodegas Loeda normaliza HTTPS, pero conserva `no comprobado`: su política
  menciona una tienda histórica mientras las rutas actuales de tienda y
  carrito devuelven 404 y no existe oferta comprable.

Estado tras OR-12: **168 filas**; **0 `pendiente`, 42 `parcial`, 126
`verificado`**. Venta online: **90 `sí`, 9 `no`, 69 `no comprobado`**.
Evidencia acumulada: **168 `keep` y 5 `merge`**.

## OR-13 — Ola 3: cierre parcial del residual

Decisiones cerradas el 2026-07-31 sobre las 69 filas que seguían sin resolver:
**5 pasan a `sí`, 25 a `no` y 39 permanecen `no comprobado`**.

- Ecommerce acreditado: Adega Vella, Adegas Maleiga, Bodega Santa Marta
  (Viñaredo) y Adega Trasdovento. Las cuatro tiendas ofrecen referencias
  actuales, precios y un carrito/checkout utilizable.
- Pedido directo acreditado: Adega Fernando Cibeira publica expresamente que
  los pedidos se realizan por teléfono o WhatsApp.
- Los 25 `no` corresponden a sitios oficiales vivos cuyos canales actuales se
  revisaron sin hallar tienda ni instrucciones concretas de pedido remoto.
  Catálogos, formularios genéricos y restos técnicos de WooCommerce no se
  contaron como venta.

Mejoras editoriales asociadas:

- **Adegas Maleiga** tiene la adega y el embotellado en San Paio (Ribadavia),
  no en Beade. Se corrigen slug, municipio, dirección, mapa, horario y gama,
  dejando `merge` desde la URL anterior.
- **Bodega Santa Marta** está en Córgomo (Vilamartín de Valdeorras), no en O
  Barco. Se corrigen identidad pública, slug, dirección, contactos y
  coordenadas oficiales, además de incorporar la oferta vigente de la tienda.
- Adega Vella, Touza Vella, Trasdovento, Pazo de Valdeconde y Fazenda Pradio
  suben de `parcial` a `verificado` al existir hoy una fuente primaria viva que
  completa la evidencia territorial previa.
- Se retira `pazodastapias.com`: el dominio muestra una plantilla genérica de
  alojamiento sin identidad de la bodega. No se interpreta como cierre ni como
  prueba de ausencia de venta.
- Se completan productos, contactos, redes, direcciones y descripciones de las
  fichas materiales. La cola `plantilla-cruzada` baja de 1 a 0.

Estado tras OR-13: **168 filas**; **0 `pendiente`, 37 `parcial`, 131
`verificado`**. Venta online: **95 `sí`, 34 `no`, 39 `no comprobado`**.
Evidencia acumulada: **168 `keep` y 7 `merge`**.
