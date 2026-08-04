# Verificación provincial de Málaga

Ledger operativo para completar por lotes la revisión de
`data/csv/andalucia/malaga.csv`. El CSV es la fuente de verdad; la procedencia
por fila vive en `data/evidence/andalucia/malaga.jsonl`.

Los criterios generales son `docs/EDITORIAL_POLICY.md` y
`docs/VERIFICATION_TECHNIQUES.md`. Este documento solo conserva el snapshot,
los riesgos locales y el avance de Málaga.

## Estado

> ⚑ **Antes de tocar Málaga, lee esto.** La rama `codex/verifica-malaga-lotes-1-2`
> tiene 6 commits de lotes 1-21 que **no** están en `main`, pero está
> **superada**, no viva: su último commit es del 2026-07-06 y `main` completó su
> propia pasada de Málaga el 2026-07-17 (`c943c33`), además de la purga de
> imágenes `6d8c1fa`. La rama va 224 commits por detrás. Aun así **no está
> vacía**: tiene 20 slugs que `main` no tiene y `main` tiene 8 que ella no
> (algunos son renombrados, p. ej. `caserissimo-mijas` frente a
> `caserissimo-fuengirola`). Decidir si se rescata alguno es una tarea propia;
> **no** fusionarla a ciegas. `main` es la fuente de verdad para Málaga.

- **Lote MA-V-a (2026-07-28, carril V).** Alcance: las 14 filas de
  `check:defects --check canal-sin-clasificar`. **11 cerradas a `ecommerce`**
  con el mecanismo comprobado en vivo. Resultados que valen más que el token:
  - **Tropicado baja de `Venta online=sí` a `no comprobado`**: su Shopify no
    tiene ni un producto publicado (`/products.json` devuelve 0) y la empresa
    (Zenith Area SL) se describe como importadora/exportadora hortofrutícola.
    Queda además una **duda de alcance abierta**: puede ser comercializadora, no
    productora. No se resuelve aquí, es carril R1.
  - **Dos dominios que no casaban con el nombre resultaron ser correctos**, no
    webs cruzadas: `ladomadorayelleon.es` es la matriz que produce La Axarca, y
    `mieldelatorre.com` es el sitio oficial del Ingenio de Frigiliana.
  - `naturmel.es` redirige a `mielysolomiel.es`: `web` actualizada.
  - **2 residuales que NO hay que reabrir sin cambiar el contrato**:
    `miel-el-chozo` (la fuente confirma venta online pero no identifica
    mecanismo) y `quesos-argudo` (**vende por DM de Instagram y Facebook, y el
    enum de `Canal de venta` no tipifica mensajería social**). Esto último es un
    hueco real del contrato, anotado en `docs/es/BACKLOG.md`.
- Inicio: 2026-07-16.
- Snapshot inicial: **405 filas**; **65 `verificado`**, **6 `parcial`** y
  **334 `pendiente`**.
- Venta online inicial: **25 `sí`**, **40 `no`** y **340 `no comprobado`**.
  Ninguno de los 25 `sí` heredados tenía `Canal de venta`; deben reauditarse
  dentro de su lote sectorial.
- Evidencia inicial: no existía
  `data/evidence/andalucia/malaga.jsonl`. Los 65 `verificado` heredados tampoco
  tenían procedencia estructurada y no se dan por revisados.
- Imágenes: **245/405** filas con `imagen`; 160 sin imagen. Se revisan después
  de estabilizar identidades, municipios, fusiones y purgas.
- Cobertura de enlaces: web 345/405, Facebook 232/405, Instagram 213/405,
  Google Maps 405/405. Contacto: teléfono 401/405 y correo 400/405.
- Auditoría de calidad inicial: **0 errores, 9 warnings** y 120 ausencias
  opcionales suprimidas. Hay una fila sin pareja completa de coordenadas.
- Categorías principales: Aceite 74, Pan y pastelería 62, Bodega 61,
  Charcutería 41, Lácteos y quesos 31, Fruta y verdura 31, Despensa artesanal
  29 y Miel 19.

## Riesgos locales

1. **Volumen y estados heredados.** Se revisan `pendiente`, `parcial` y
   `verificado`; el estado previo no sustituye una fuente actual.
2. **Venta heredada sin canal.** Los 25 `sí` iniciales están incompletos. Cada
   uno debe acabar con mecanismo vigente y `Canal de venta`, o degradarse a
   `no comprobado`/`no` según la evidencia.
3. **Identidades genéricas y categorías dudosas.** Varias filas parecen
   comercios, restauración o denominaciones genéricas; el lote debe probar
   elaboración propia antes de mantenerlas.
4. **Municipio comercial frente a unidad productiva.** Málaga capital aparece
   como contacto de fincas situadas en otros municipios. Prima la unidad donde
   se produce o elabora y se corrigen slug, imagen y evidencia cuando proceda.
5. **Enlaces de Maps autocompletados.** Un `place_id` puede pertenecer a un
   monumento o negocio homónimo. Se elimina o corrige si no representa al
   productor.

## Plan de lotes

| Lotes | Alcance | Estado |
|---|---|---|
| 1 | Aceite: 100 Caños → Aceite Periana (10 filas) | completado |
| 2 | Aceite: Cortijo El Solano → Aceites Tapia (10 filas) | completado |
| 3 | Aceite: Agro-Olivarera Riogordo → El Molino de Colmenar (10 filas) | completado |
| 4 | Aceite: Molino Don Félix → IFM (10 filas) | completado |
| 5 | Aceite: Insigne AOVE → Lujo del Paladar (10 filas) | completado |
| 6 | Aceite: Molino La Molina → Puente Don Manuel (10 filas) | completado |
| 7 | Aceite: Quinto Toro → Ntra. Sra. de las Nieves (10 filas) | completado |
| 8 | Aceite: 4 `verificado` heredados restantes | completado |
| 9 | Bodega: Alacena del Ángel → Gonzalo Beltrán (10 filas) | completado |
| 10 | Bodega: Gross Hermanos → Ucopaxa (10 filas) | completado |
| 11 | Bodega: Vetas → Bodegas Manilva (10 filas) | completado |
| 12 | Bodega y triaje: Morosanto → Destilerías El Tajo (10 filas) | completado |
| 13 | Bodega: cierre de pendientes y triaje (10 filas) | completado |
| 14 | Bodega: seis `verificado` heredados (Descalzos Viejos → Samsara) | completado |
| 15 | Bodega: cinco heredados restantes y cierre sectorial | completado |
| 16 | Pan y pastelería: primer bloque de Antequera (10 filas) | completado |
| 17 | Pan y pastelería: cierre de Antequera y arco interior (10 filas) | completado |
| 18 | Pan y pastelería: Málaga capital (10 filas) | completado |
| 19 | Pan y pastelería: Málaga/Axarquía (10 filas) | completado |
| 20 | Pan y pastelería: interior y costa (10 filas) | completado |
| 21 | Pan y pastelería: 5 filas restantes | completado |
| 22 | Pan y pastelería: 7 `verificado` heredados sin evidencia | completado |
| 23-27 | Charcutería por interior y costa/capital | pendiente |
| 28-34 | Lácteos y quesos + Fruta y verdura | pendiente |
| 35-39 | Despensa artesanal + Miel, con triaje fuerte de alcance | pendiente |
| 40-42 | Cerveza artesana, Café, Aromáticas, Aceitunas y Huevos | pendiente |
| 43-45 | Chocolate, Helados, Pescado y categorías menores | pendiente |
| 46 | Flecos, `parcial`, venta heredada, duplicados, imágenes y cierre | pendiente |

Los rangos se recalibraron tras el lote 3 para mantener lotes reales de unas 10
filas: todavía quedaban 44 aceites sin reauditar, no un único bloque. Pueden
volver a dividirse si aparecen demasiadas correcciones de identidad o purga.
Cada lote termina con evidencia reconciliada y validación de los ficheros
tocados.

## Avance

### Lote 1 — Aceite, primer bloque (2026-07-16)

- 10 filas revisadas: **9 `verificado`** y **1 `parcial`** (`El Molino de
  Guaro`, web propia en reconstrucción y actividad apoyada por catálogo fiable).
- Venta online resuelta en 7 filas: Santa Catalina Mártir, Monsalud, Finca Rosa
  Alta, Molino del Arco, Mondrón, Oliburgo y Aceite Periana.
- Finca Rosa Alta corregida de Málaga capital a su unidad productiva en
  **Archidona**; slug e imagen renombrados con registro `merge`.
- Castillo de la Estrella dejó de apuntar al monumento homónimo: corregidos
  domicilio, teléfono, enlace de Maps y coordenadas aproximadas de la calle.
- Estado tras el lote: **74 `verificado`**, **7 `parcial`**, **324
  `pendiente`**. Venta online: **32 `sí`** (7 con canal revisado), 40 `no` y
  333 `no comprobado`.

### Lote 2 — Aceite, segundo bloque (2026-07-16)

- 10 filas resueltas: **6 `verificado`**, **1 `parcial`** y **3 purgas**.
- Purgas por `out-of-scope`: Aceites El Niño y Aceites Málaga son envasadores y
  comercializadores industriales sin almazara/olivar local acreditado; Aceites
  Esenciales Eva elabora cosmética y aromaterapia, no alimentos.
- Venta online confirmada en Cortijo El Solano (email), Aceites de Ardales,
  Aceites Gil Luna, Molisur, Monttosa y Tapia (ecommerce).
- Aceites Sierra de Yeguas queda `parcial`: la cooperativa y su actividad están
  respaldadas por fuentes fiables actuales, pero su web oficial devuelve 502 y
  no hay fuente propia accesible que permita cerrar `verificado` ni la venta.
- Estado tras el lote: **402 filas**; **80 `verificado`**, **8 `parcial`**,
  **314 `pendiente`**. Venta online: **38 `sí`** (13 con canal revisado), 40
  `no` y 324 `no comprobado`.

### Lote 3 — Aceite, tercer bloque (2026-07-16)

- 10 filas revisadas: **6 `verificado`** y **4 `parcial`**, sin purgas.
- Venta online confirmada en 5 filas: Finca Las Morenas, Oro Al-Andalus,
  Finca La Tortaita y Burgoliva mediante ecommerce; Tesoro Español mediante
  pedido telefónico publicado en su web.
- Al-Jaque se recategorizó a **Despensa artesanal**: su actividad documentada
  son mermeladas, conservas, patés, licores y cremas, no aceite. El Carrero de
  Alfarnate se recategorizó a **Pan y pastelería** por su elaboración actual de
  rosco carrero y otros dulces tradicionales.
- Almazara Gálvez, Al-Jaque, El Carrero y El Molino de Colmenar quedan
  `parcial`: las fuentes propias faltan, están vacías o no ofrecen una señal
  actual suficiente, y la continuidad depende de directorios o prensa.
- Finca La Tortaita conserva Archidona como municipio, pero se eliminó el
  código postal 29003, que corresponde a Málaga capital. Riogordo acredita
  tienda física y venta en comercios, no un mecanismo remoto utilizable.
- Estado tras el lote: **402 filas**; **86 `verificado`**, **12 `parcial`** y
  **304 `pendiente`**. Venta online: **43 `sí`** (18 con canal revisado), 40
  `no` y 319 `no comprobado`.

### Lote 4 — Aceite, cuarto bloque (2026-07-16)

- 10 filas resueltas: **9 `verificado`** y una fusión, sin nuevos `parcial`.
- `garo-campillos` se fusionó con `aove-tesoro-espanol-campillos`: Garo y
  Tesoro Español son marcas de la misma unidad productiva Aceituna Verde, con
  web, dirección y teléfonos idénticos. Se eliminó la imagen del duplicado.
- Cuatro categorías heredadas se corrigieron: Familia Hevilla y Cooperativa
  Guadalhorce Ecológico a **Fruta y verdura**, Hijos de Cordobilla a **Pan y
  pastelería** y Hutesa a **Aceitunas y encurtidos**.
- Venta remota confirmada en Molino Don Félix, Finca La Torre y Gotas de Gloria
  (ecommerce), Familia Hevilla (teléfono) y Hacienda de Colchado (formulario de
  pedido/email). Guadalhorce Ecológico, Hijos de Cordobilla y Hutesa quedan
  `no`; IFM conserva `no comprobado` porque toda su tienda está temporalmente
  sin existencias.
- Estado tras el lote: **401 filas**; **95 `verificado`**, **12 `parcial`** y
  **294 `pendiente`**. Venta online: **48 `sí`** (23 con canal revisado), 43
  `no` y 310 `no comprobado`.

### Lote 5 — Aceite, quinto bloque (2026-07-16)

- 10 filas revisadas: **8 `verificado`** y **2 `parcial`**, sin purgas.
- Cuatro categorías heredadas se corrigieron: Jamones y Embutidos Andrés Ramos
  a **Charcutería**, La Huerta de Carmen a **Fruta y verdura**, La Molienda
  Verde a **Despensa artesanal** y Lujo del Paladar a **Pescado**.
- Lagar del Chorro se corrigió de Torremolinos a su unidad productiva en
  **El Chorro, Álora**; slug e imagen se renombraron con registro `merge`. El
  cambio redujo de 8 a 7 los avisos geográficos heredados de la provincia.
- Venta online confirmada por ecommerce en Insigne AOVE, La Laguna de Fuente de
  Piedra, La Molienda Verde, La Recíproca, La Samiaja, Lagar del Chorro y Lujo
  del Paladar. La Huerta de Carmen conserva `no comprobado`: su web acredita
  producción, pero no un mecanismo concreto de pedido remoto.
- Andrés Ramos y La Cañada del Sacristán quedan `parcial`: el primero depende
  de fuentes empresariales actuales sin fuente propia accesible; el segundo
  combina una mención turística municipal actual con una declaración directa
  de producción ecológica antigua.
- Estado tras el lote: **401 filas**; **103 `verificado`**, **14 `parcial`** y
  **284 `pendiente`**. Venta online: **55 `sí`** (30 con canal revisado), 43
  `no` y 303 `no comprobado`. Quedan 60 filas en Aceite: 38 `verificado`, 5
  `parcial` y 17 `pendiente`; 7 de los `verificado` aún son heredados sin
  reauditar.

### Lote 6 — Aceite, sexto bloque (2026-07-16)

- 10 filas resueltas: **7 `verificado`**, **2 `parcial`** y **1 purga**.
- Oleum Alcazaba se purgó por `out-of-scope`: su web la define como envasadora
  que selecciona materias primas y comercializa AOVE, sin acreditar olivar ni
  almazara local propia. Se aplicó el mismo criterio que a las envasadoras
  excluidas en el lote 2 y se eliminó su imagen.
- NONNA se recategorizó a **Helados** y queda `parcial`: tras perder su fábrica
  de Cajiz en abril de 2026, ha reanudado producción provisional y reabierto
  tiendas, pero la unidad productiva definitiva sigue en transición. Productos
  Marcos se recategorizó a **Pan y pastelería** por su obrador artesanal de
  dulces activo desde 1960.
- Natur-Aceites queda `parcial`: directorios actuales confirman la almazara de
  Casarabonela, pero su antiguo dominio ahora pertenece a una multinacional
  guatemalteca ajena y se retiró del CSV para evitar una falsa atribución.
- Venta remota confirmada en Molino La Molina (email), Molino del Hortelano y
  Montexaquez (ecommerce), NONNA (WhatsApp), Olivarera San Benito (email) y
  Puente Don Manuel (ecommerce). Montes del Guadalhorce y Productos Marcos
  quedan `no` tras revisar sus catálogos y contactos sin mecanismo de pedido.
- Estado tras el lote: **400 filas**; **110 `verificado`**, **16 `parcial`** y
  **274 `pendiente`**. Venta online: **61 `sí`** (36 con canal revisado), 45
  `no` y 294 `no comprobado`. Quedan 57 filas en Aceite: 44 `verificado`, 6
  `parcial` y 7 `pendiente`; 7 de los `verificado` aún son heredados sin
  reauditar.

### Lote 7 — Aceite, séptimo bloque (2026-07-16)

- 10 filas resueltas: cinco `pendiente` pasaron a **`verificado`**, dos se
  eliminaron y tres `verificado` heredados quedaron reauditados.
- Quinto Toro se fusionó con `aceite-oliburgo-el-burgo`: ambas marcas proceden
  de la misma unidad productiva Almazara Limonte SCA en el Polígono Los Bujeos
  de El Burgo. Ribera del Genil se purgó por `not-producer`: todos sus datos
  públicos pertenecían a Isla del Genil, una casa rural, no a un productor.
- Sabores Caseros y Tortas Carmen Lupiáñez se recategorizaron a **Pan y
  pastelería**. El primero elabora mantecados y confitería; el segundo elabora
  tortas de aceite, donde el AOVE es ingrediente y no el producto final.
- Venta remota confirmada en Almazara de Ronda y Terraverne (ecommerce), Tortas
  Carmen Lupiáñez (email y teléfono), Aceites Los Romanes (ecommerce) y Nuestra
  Señora de las Nieves/Nevaillo (ecommerce). Esta última cambió de `no` a `sí`
  y se corrigió su dominio vigente. Rioliva conserva `no comprobado` porque su
  catálogo rotulado como tienda solo permite consultar precio.
- Estado tras el lote: **398 filas**; **115 `verificado`**, **16 `parcial`** y
  **267 `pendiente`**. Venta online: **65 `sí`** (41 con canal revisado), 45
  `no` y 288 `no comprobado`. Ya no quedan aceites `pendiente`: las 53 filas de
  Aceite son 47 `verificado` y 6 `parcial`; quedan cuatro `verificado` heredados
  por reauditar en el lote 8.

### Lote 8 — Aceite, cierre sectorial (2026-07-16)

- Se reauditaron los cuatro `verificado` heredados restantes: **tres conservan
  `verificado`** y San Isidro Labrador/Sierra de Tejeda baja a **`parcial`**.
- San Isidro mantiene actividad productiva y venta directa local acreditadas
  por dos directorios turísticos institucionales actuales, pero carece de
  fuente propia accesible. Se corrigieron domicilio, teléfono y correo, y la
  venta pasó de `no` a `no comprobado`.
- SCAAVO se recategorizó de **Aceite** a **Aceitunas y encurtidos**. Su propia
  revista indicaba en 2024 que la construcción de una almazara seguía pendiente,
  mientras la campaña 2024/25 acredita elaboración actual de aceituna de mesa
  cocida; se eliminó del CSV la afirmación incorrecta de almazara propia.
- San Cosme y San Damián y Olivarera del Trabuco conservan `no`: sus webs
  propias acreditan la actividad olivarera y ofrecen contacto general o venta
  física, pero no tienda ni instrucción concreta de pedido remoto. SCAAVO
  también conserva `no` por publicar únicamente su tienda gourmet física.
- Estado tras el lote: **398 filas**; **114 `verificado`**, **17 `parcial`** y
  **267 `pendiente`**. Venta online: **65 `sí`** (41 con canal revisado), 44
  `no` y 289 `no comprobado`. El sector Aceite queda cerrado con **52 filas**:
  45 `verificado`, 7 `parcial` y ninguna `pendiente` ni heredada sin reauditar.

### Lote 9 — Bodega, primer bloque (2026-07-16)

- 10 filas resueltas: nueve `pendiente` pasan a **`verificado`** y Dimobe,
  heredada como `verificado`, queda reauditada.
- Alacena del Ángel se recategorizó de **Bodega** a **Despensa artesanal**: es
  un obrador de platos andaluces preparados y pasteurizados, donde el vino es
  ingrediente. Su tienda mantiene productos disponibles con carrito.
- Antigua Casa de Guardia se corrigió desde la taberna de Alameda Principal a
  su unidad productiva en **Finca El Romerillo, Olías**. Se sustituyeron las
  coordenadas de la taberna por las de la finca y se retiró un enlace de
  Instagram que era solo un hashtag; la tienda oficial actual permite comprar
  sus vinos propios.
- Venta por ecommerce confirmada en Alacena del Ángel, Antigua Casa de Guardia,
  Cortijo La Fuente, Doña Felisa, Fabio Coullet, Fernández Bolet y García
  Hidalgo. Dimobe pasa de `no` a `no comprobado` porque todo su catálogo figura
  sin existencias; Badman y Gonzalo Beltrán también quedan `no comprobado` al
  no poder cerrar un flujo remoto utilizable.
- Se actualizaron el dominio vigente de Badman, varias webs a HTTPS, las
  direcciones de Dimobe y Cortijo La Fuente y descripciones genéricas por datos
  productivos concretos.
- Estado tras el lote: **398 filas**; **123 `verificado`**, **17 `parcial`** y
  **258 `pendiente`**. Venta online: **72 `sí`** (48 con canal revisado), 43
  `no` y 283 `no comprobado`. Quedan **60 bodegas**: 23 `verificado`, 1
  `parcial` y 36 `pendiente`.

### Lote 10 — Bodega, segundo bloque (2026-07-16)

- 10 filas resueltas: seis `pendiente` pasan a **`verificado`**, Lascas de
  Pedernal y Niño de la Salina quedan **`parcial`**, y Cuesta de la Viña/Jorge
  Bonet baja de `verificado` heredado a **`parcial`**.
- Cuesta de la Viña conserva identidad, viñedo ecológico y actividad apoyados
  por la Ruta del Vino 2025 y el consejo regulador, pero su dominio propio ya
  no resuelve; se retiró la web, se actualizó el correo y la venta quedó `no
  comprobado`. Lascas carece de fuente propia reciente accesible y la web de
  Niño de la Salina solo muestra mantenimiento, por lo que tampoco se elevan
  con fuentes externas.
- Los Frutales se actualizó tras su reapertura en 2026 con Joaquín Fernández.
  El antiguo dominio `.com` redirige ahora a una web indonesia ajena y se
  sustituyó por el dominio oficial `.es`, junto con su correo y teléfono.
- Venta por ecommerce confirmada en Gross Hermanos, La Melonera, Los Frutales,
  Lunares de Ronda, Nilva y Ucopaxa. Kieninger conserva `no comprobado` porque
  su propia portada anuncia que la tienda volverá próximamente; no se trató el
  catálogo anterior como compra vigente.
- También se corrigieron el correo erróneo de Gross, el código postal duplicado
  de Lunares, protocolos web y las descripciones genéricas por actividad y
  productos concretos.
- Estado tras el lote: **398 filas**; **128 `verificado`**, **20 `parcial`** y
  **250 `pendiente`**. Venta online: **77 `sí`** (54 con canal revisado), 42
  `no` y 279 `no comprobado`. Quedan **60 bodegas**: 28 `verificado`, 4
  `parcial` y 28 `pendiente`.

### Lote 11 — Bodega, tercer bloque (2026-07-16)

- 10 filas resueltas: nueve `pendiente` pasan a **`verificado`** y Carpe Diem,
  heredada como `verificado`, queda reauditada.
- Venta por ecommerce confirmada en Vetas, Victoria Ordóñez, Carpe Diem,
  Excelencia, Jorge Ordóñez Málaga y Málaga Virgen. Bentomiz publica un
  teléfono y WhatsApp específico para venta de vinos, que se incorporó como
  contacto principal y canal remoto.
- Almijara, Antakira y Bodegas Manilva quedan `no`: sus webs acreditan
  elaboración y actividad, pero solo ofrecen tienda física, catálogo
  informativo, visitas o contacto general, sin una instrucción concreta de
  pedido remoto.
- Bodegas Almijara se corrigió desde un código postal de Canillas de Albaida a
  su dirección productiva en **Cómpeta** y se actualizó también la consulta de
  Maps. En Manilva se conserva HTTP porque responde correctamente mientras su
  certificado HTTPS no es válido.
- Se actualizaron teléfonos, protocolos, productos y descripciones genéricas;
  Carpe Diem incorporó el canal que faltaba en su `sí` heredado.
- Estado tras el lote: **398 filas**; **137 `verificado`**, **20 `parcial`** y
  **241 `pendiente`**. Venta online: **83 `sí`** (61 con canal revisado), 45
  `no` y 270 `no comprobado`. Quedan **60 bodegas**: 37 `verificado`, 4
  `parcial` y 19 `pendiente`.

### Lote 12 — Bodega y triaje de categorías (2026-07-16)

- 10 filas resueltas: nueve `pendiente` pasan a **`verificado`** y Sánchez
  Rosado, heredada como `verificado`, queda reauditada.
- Tres categorías se corrigieron: Campo de Benamayor a **Fruta y verdura** por
  su producción de pasas, higos, deshidratados y fruta tropical; Capricho a
  **Helados**; y V-Gama La Cruz de Piedra a **Despensa artesanal** por su
  obrador de platos preparados.
- Venta remota confirmada en Morosanto, Quitapenas, Campo de Benamayor y
  Destilerías El Tajo (ecommerce), y en Capricho y V-Gama (WhatsApp). Pérez
  Hidalgo y La Capuchina quedan `no comprobado`; esta última oculta precios y
  botones de compra pese a conservar estructura de catálogo.
- Cezar y Sánchez Rosado quedan `no`: sus webs acreditan viñedo y elaboración,
  pero solo ofrecen información, catas o contacto general sin una instrucción
  concreta de pedido remoto.
- La sociedad antigua Destilerías El Tajo SL figura inactiva, pero no se purgó:
  el aviso legal actual identifica a **Ruiz Iborra SL** como titular y
  responsable de la elaboración en la misma dirección de Ronda, con tienda
  operativa. Se actualizaron entidad operativa, teléfono y HTTPS.
- También se corrigieron la dirección corporativa de Campo de Benamayor, la
  finca y contacto de Cezar, teléfonos, correos, productos y descripciones.
- Estado tras el lote: **398 filas**; **146 `verificado`**, **20 `parcial`** y
  **232 `pendiente`**. Venta online: **89 `sí`** (67 con canal revisado), 46
  `no` y 263 `no comprobado`. Quedan **57 bodegas**: 43 `verificado`, 4
  `parcial` y 10 `pendiente`.

### Lote 13 — Bodega, cierre de pendientes (2026-07-16)

- Las 10 bodegas pendientes se resolvieron: seis pasan a **`verificado`** y
  cuatro quedan **`parcial`** por falta de fuente propia actual accesible: Gin
  Alborán, Jamones Alameda, La Huerta de Carolina y Sabor a Mango.
- Siete categorías heredadas se corrigieron: El Cerdito Andaluz y Jamones
  Alameda a **Charcutería**; El Reloj a **Aromáticas y condimentos**; Hermanos
  Montañez a **Pan y pastelería**; La Huerta de Carolina y TurboJam a
  **Despensa artesanal**; y Sabor a Mango a **Fruta y verdura**.
- Venta online confirmada en Huerto de la Condesa y TurboJam por ecommerce, y
  en El Reloj por su teléfono específico de pedidos. El Cerdito Andaluz,
  Hermanos Montañez y Licores de la Abuela quedan `no` tras revisar catálogos y
  contactos sin mecanismo remoto.
- El dominio heredado de Sabor a Mango redirige a una web ajena y se retiró.
  La identidad y actividad se conservan parcialmente por el registro de marca
  concedido en 2026 y fuentes empresariales actuales. Jamones Alameda figura
  activa, pero su dominio responde 403; se mantiene parcial sin inventar una
  fuente propia accesible.
- Estado tras el lote: **398 filas**; **152 `verificado`**, **24 `parcial`** y
  **222 `pendiente`**. Venta online: **92 `sí`** (70 con canal revisado), 49
  `no` y 257 `no comprobado`. Bodega ya no tiene pendientes: **50 filas**, 45
  `verificado` y 5 `parcial`; queda reauditar los heredados del cierre
  sectorial.

### Lote 14 — Bodega, primera reauditoría heredada (2026-07-16)

- Se reauditaron seis bodegas heredadas: Descalzos Viejos, Cortijo Los
  Aguilares, F. Schatz, Sedella Vinos, Vinos Conrad y Samsara Wines. Las seis
  conservan **`verificado`** con evidencia actual reconciliada.
- Descalzos Viejos publica pedidos por WhatsApp y correo; Los Aguilares mantiene
  tienda con carrito; y Sedella instruye a pedir por email y detalla portes.
  Se incorporaron esos canales y Sedella pasó de `no` a **`sí`**.
- Los `sí` heredados de Vinos Conrad y Samsara bajan a **`no`**. Conrad tiene
  un producto WooCommerce oculto tras el modo «próximamente», que no constituye
  una compra utilizable, y su web pública solo presenta vinos, visitas y
  contacto. Samsara reserva WhatsApp, email y formulario para las catas, sin
  instrucción de pedido remoto de vino.
- F. Schatz conserva `no`: su web actual anuncia venta de vino en la propia
  bodega, pero no a distancia. Se corrigieron protocolos web, correos y las
  referencias actuales de Conrad y Samsara.
- Estado tras el lote: **398 filas**; **152 `verificado`**, **24 `parcial`** y
  **222 `pendiente`**. Venta online: **91 `sí`** (73 con canal revisado), 50
  `no` y 257 `no comprobado`. Bodega sigue con **50 filas**, 45 `verificado`,
  5 `parcial` y ninguna `pendiente`; quedan cinco heredadas por reauditar.

### Lote 15 — Bodega, cierre sectorial (2026-07-16)

- Se cerraron las cinco heredadas restantes: Krauel conserva **`verificado`**,
  Ramos-Paul sube de `parcial` a **`verificado`**, Pasos Largos y Gomara bajan
  a **`parcial`**, y La Sangre de Ronda se purga por cierre.
- El BORME inscribió en enero de 2026 la disolución y extinción de Bodega La
  Sangre de Ronda SL. El espacio actual de la misma dirección se presenta como
  antigua bodega, centro cultural, catas y tienda gourmet, y declara que el
  inmueble fue anteriormente productivo; no se atribuyó ese nuevo negocio a la
  unidad cerrada.
- Pasos Largos conserva producto registrado en 2024 y respaldo territorial,
  pero su dominio ya no resuelve y las señales actuales son indirectas. Gomara
  figura inactiva y con cierre registral, aunque un directorio institucional
  actual aún sitúa elaboración para una marca ajena en sus instalaciones; se
  mantiene `parcial` hasta poder identificar al operador actual, sin inventar
  correo ni venta.
- La tienda de Krauel está actualmente vacía y su antiguo producto devuelve
  404, por lo que el `sí` heredado baja a **`no`**. Ramos-Paul, en cambio,
  mantiene tienda con precios y carrito funcional: pasa a **`sí`** por
  ecommerce y se corrigen sus contactos, dirección y coordenadas, que antes
  coincidían erróneamente con Vinos Conrad.
- Estado tras el lote: **397 filas**; **150 `verificado`**, **25 `parcial`** y
  **222 `pendiente`**. Venta online: **91 `sí`** (74 con canal revisado), 48
  `no` y 258 `no comprobado`. Bodega queda cerrada con **49 filas**: 43
  `verificado`, 6 `parcial`, ninguna `pendiente` y ninguna heredada sin
  reauditar.

### Lote 16 — Pan y pastelería, primer bloque de Antequera (2026-07-16)

- Se revisaron 10 filas de entrada: siete pasan a **`verificado`**, dos quedan
  **`parcial`** y el duplicado heredado Mantecados Sancho Melero se fusiona con
  Grupo Sancho Melero. La fila conservada usa la identidad corporativa y el
  contacto actual del grupo; su tienda oficial mantiene compra directa.
- Padepan se corrige de Antequera a **Mollina**, municipio donde ya estaban su
  dirección y coordenadas, con cambio de slug y registro `merge`. Permanece
  `parcial` porque la fuente propia opera bajo el nombre Horno Don Mollete y el
  vínculo nominal actual con Padepan solo queda explícito en el directorio
  institucional. La web es informativa, por lo que la venta queda en `no`.
- Delicias de Antequera, Horno San Pancracio, Hermanos Paradas Pedraza, La
  Antequerana y Piobiem quedan en **`sí`** por ecommerce; Hermanos Paradas
  publica además pedidos por WhatsApp. Picos Granados queda en `no` tras
  revisar su web informativa sin mecanismo remoto.
- La Joya de Antequera queda `parcial`: prensa reciente acredita producción
  activa y el contacto coincide con el catálogo institucional, pero no se
  encontró una fuente propia actual accesible para cerrar identidad y venta.
  Se retiró la antigua URL móvil de Facebook que estaba colocada como web.
- Estado tras el lote: **396 filas**; **156 `verificado`**, **27 `parcial`** y
  **213 `pendiente`**. Venta online: **96 `sí`** (80 con canal revisado), 50
  `no` y 250 `no comprobado`. Pan y pastelería queda con **67 filas**: 20
  `verificado`, 4 `parcial` y 43 `pendiente`.

### Lote 17 — Pan y pastelería, cierre de Antequera y arco interior (2026-07-16)

- Se resolvieron 10 entradas: siete quedan **`verificado`**, dos **`parcial`**
  y Molletes Padilla se purga como identidad inexistente. El dominio, correo y
  teléfono heredados no producen ninguna entidad comprobable; sus coordenadas
  eran el centro genérico de Antequera y la investigación apunta a una mezcla
  editorial entre el apellido de una apoderada y otra sociedad real, no a una
  marca productora que deba conservarse.
- Mollete San Roque y Piquitos San Roque se mantienen como unidades productivas
  separadas del mismo grupo: ambas tienen instalaciones, certificados IFS 2025
  y catálogo propios, y venden mediante el ecommerce oficial del grupo.
  Torcadul, Doblado Torres y Piquitos Rubio también pasan a `sí` por tiendas
  propias con productos, precios y carrito operativos.
- Mantecados La Aguilera se corrige a su marca vigente **Mantecados Aguilera**,
  con cambio de slug documentado mediante `merge`. La licencia municipal de
  2025 ubica el obrador en calle Antiquaria 8; la tienda propia aporta el
  teléfono actual, compra, pago y envíos. Se retiraron el correo y las
  coordenadas genéricas heredadas.
- Spiga Negra se recategoriza a **Pasta artesana**: es un molino ecológico y
  obrador de pasta y harinas de Humilladero, con tienda propia. Horno de Leña
  Pinto queda `parcial` pese a su actividad documentada en 2025, por faltar una
  fuente propia accesible; Pastelería El Molinero queda `parcial` y `sí` por el
  marketplace de un distribuidor local que vende sus dulces de horno de leña.
- Estado tras el lote: **395 filas**; **162 `verificado`**, **28 `parcial`** y
  **205 `pendiente`**. Venta online: **104 `sí`** (88 con canal revisado), 49
  `no` y 242 `no comprobado`. Pan y pastelería queda con **65 filas**: 25
  `verificado`, 5 `parcial` y 35 `pendiente`.

### Lote 18 — Pan y pastelería, Málaga capital (2026-07-16)

- Se resolvieron 10 entradas: ocho quedan **`verificado`**, La Molineta queda
  **`parcial`** y BioMarun se purga por cierre. La ficha actual de BioMarun
  registra cierre permanente y reseñas posteriores al incendio del local, sin
  señal de reapertura; no se fusiona con La Molineta pese a compartir dirección
  histórica, porque el directorio institucional las trata como identidades
  distintas y no existe fuente que pruebe una sucesión.
- La fila heredada Dulces Rivas mezclaba una marca distinta con la dirección y
  el teléfono de **Panadería Confitería El Niño Rivas**. Se corrigen nombre y
  slug con registro `merge`, y se retiran el correo y Facebook mal atribuidos.
  La panadería actual queda `verificado/no` al no publicar un mecanismo remoto
  utilizable.
- Cristo Rey se traslada del despacho de Rotonda de Suárez a su obrador real de
  calle Ter 67, con contactos y coordenadas actuales; vende por ecommerce y
  teléfono. El Mimbre se traslada igualmente de una tienda antigua al obrador
  de calle Graham Bell 6 y queda `sí` por ecommerce y WhatsApp.
- Tejeros y Ñanduti quedan `sí` por ecommerce y marketplace, respectivamente.
  Horno de Leña Martín se actualiza a calle Lara Castañeda 6 y queda
  `no comprobado`; Pan Huertas queda `no` tras revisar su web profesional sin
  precio, carrito ni instrucción concreta de pedido.
- Postres Truffel sigue activo en La Gitanilla, pero su dominio heredado es una
  página de aparcamiento de Arsys; se retira y la venta queda `no comprobado`.
  La Molineta permanece `parcial/no comprobado` porque la actividad solo está
  respaldada por directorios actuales y no por una fuente propia accesible.
- Estado tras el lote: **394 filas**; **170 `verificado`**, **29 `parcial`** y
  **195 `pendiente`**. Venta online: **108 `sí`** (92 con canal revisado), 51
  `no` y 235 `no comprobado`. Pan y pastelería queda con **64 filas**: 33
  `verificado`, 6 `parcial` y 25 `pendiente`.

### Lote 19 — Pan y pastelería, Málaga y Axarquía (2026-07-16)

- Se revisaron 10 filas: nueve quedan **`verificado`** y Panadería Ntra. Sra.
  de Monsalud queda **`parcial`**. Esta última conserva respaldo institucional
  y ficha de ubicación coincidente, pero no dispone de fuente propia accesible
  ni señal dinámica suficiente para cerrar actividad o venta.
- Celi Ali Gluten Free y Pastelería Ramos pasan a **`sí`** por ecommerce: sus
  tiendas mantienen productos, precios y carrito. Artesanos Ángulo queda `sí`
  por email porque su contacto oficial invita expresamente a realizar pedidos;
  se corrigen identidad comercial, dirección y correo de Industria Confitera
  Colmenar.
- Panadería Salvador queda `sí` por teléfono: la web propia publica un horario
  específico de pedidos junto al contacto, y una adjudicación de 2026 confirma
  actividad en Benajarafe. Se actualizan dominio y correo.
- La Sagrada Familia II se traslada del despacho heredado de Vivar Téllez a la
  sede productiva de Panificadora Hermanos Lucena en calle Benavente 6, con
  teléfono, mapa y coordenadas actuales. Queda `no`, al igual que Tres Espigas
  y Guijarro, tras revisar sus webs informativas sin mecanismo de pedido.
- Confitería Claudio queda `no`: una entrevista de enero de 2026 confirma que
  solo vende presencialmente. Dulces María Conejo sigue activa y participó en
  ferias de 2025, pero hornodecampos.es ya no resuelve y la venta queda
  `no comprobado`.
- Estado tras el lote: **394 filas**; **179 `verificado`**, **30 `parcial`** y
  **185 `pendiente`**. Venta online: **112 `sí`** (96 con canal revisado), 55
  `no` y 227 `no comprobado`. Pan y pastelería queda con **64 filas**: 42
  `verificado`, 7 `parcial` y 15 `pendiente`.

### Lote 20 — Pan y pastelería, interior y costa (2026-07-16)

- Se revisaron 10 filas: ocho quedan **`verificado`** y Confitería Plaza y
  Framancha quedan **`parcial`**. En ambos casos se acredita el obrador y su
  vínculo municipal, pero falta una fuente propia accesible y suficientemente
  actual para resolver actividad y venta remota.
- Molino de Harina Almogía se recategoriza a **Harinas y cereales**: su web
  propia confirma la molienda a la piedra, el catálogo y pedidos por teléfono
  o correo. Safrante se recategoriza a **Condimentos**, porque fabrica extracto
  de azafrán, sales aromatizadas y sazonadores; su dominio está en construcción
  y queda `no`.
- Mondat Baker actualiza sede productiva y contactos con su catálogo de abril
  de 2026 y queda `sí` por teléfono y email. Pan Bendito queda `sí` por
  ecommerce y Confitería Guzmán por pedidos telefónicos. Agüepan se traslada
  de la tienda heredada de calle Jimena al obrador del polígono Ntra. Sra. de
  Lourdes.
- El Pan de la Curruca queda `verificado/no` por actividad artesana documentada
  en diciembre de 2025 sin mecanismo remoto de compra. Zapelia se mueve a su
  sede productiva de calle la Cruz 16, se retira el dominio roto y queda `no`;
  su fabricación y surtido siguen respaldados por fuentes de 2026.
- Estado tras el lote: **394 filas**; **187 `verificado`**, **32 `parcial`** y
  **175 `pendiente`**. Venta online: **116 `sí`** (100 con canal revisado), 59
  `no` y 219 `no comprobado`. Pan y pastelería queda con **62 filas**: 48
  `verificado`, 9 `parcial` y 5 `pendiente`.

### Lote 21 — Pan y pastelería, cierre sectorial (2026-07-16)

- Se revisaron las cinco filas pendientes: cuatro quedan **`verificado`** y
  Panadería Nuestra Señora de las Nieves queda **`parcial`**. Su obrador real
  está en calle Tenería 25 de Gaucín, no en Málaga capital; se corrigen
  dirección, mapa y coordenadas y desaparece la advertencia territorial. Sin
  fuente propia actual accesible, la venta sigue `no comprobado`.
- Encurtidos Almario se recategoriza a **Aceitunas y encurtidos**. El Consejo
  Regulador confirma que transforma Aloreña de Málaga DOP y su participación en
  la feria provincial de mayo de 2026 acredita actividad reciente. Se retiran
  los dominios que ya no resuelven.
- Dulces del Califa queda `sí` por ecommerce y WhatsApp: su tienda mantiene
  productos, precios, carrito y acceso al chat empresarial. Pan Piña actualiza
  número del obrador, teléfono, HTTPS y redes oficiales; su web sigue siendo
  informativa y queda `no`.
- Good Pastelería participa como obrador productor en dos ferias provinciales
  de abril y mayo de 2026. Se retiran un correo institucional ajeno y un enlace
  compartido de Facebook colocado como web; queda `verificado/no comprobado`.
- Estado tras el lote: **394 filas**; **191 `verificado`**, **33 `parcial`** y
  **170 `pendiente`**. Venta online: **117 `sí`** (101 con canal revisado), 60
  `no` y 217 `no comprobado`. Pan y pastelería queda sin pendientes con **61
  filas**: 51 `verificado` y 10 `parcial`; la reconciliación posterior detecta
  siete `verificado` heredados todavía sin evidencia y los deriva al lote 22.

### Lote 22 — Pan y pastelería, heredados sin evidencia (2026-07-16)

- Se reauditaron los siete `verificado` heredados que no habían entrado en los
  lotes por estado. Todos conservan **`verificado`** y Pan y pastelería queda
  ahora sí con cobertura de evidencia para sus 61 filas actuales.
- Panificadora Serrano pasa de `no` a **`sí` por teléfono**: la web publica
  horario de pedidos y reparto al día siguiente. Panadería Alba también pasa a
  `sí` por tartas encargables por teléfono y La Boulangerie d'Irene por sus
  llamadas explícitas a realizar pedidos.
- Obrador Máximo mantiene `sí`, ahora con canal telefónico documentado, y se
  corrige de la Estación a la Panadería Máximo de calle Fuente 34, con teléfono,
  mapa y coordenadas actuales. La actividad y la distribución nacional siguen
  documentadas en 2025.
- El Colmenero se traslada a su sede productiva de calle Cruz 19 y actualiza
  teléfono, correo, mapa y coordenadas. Baja de `sí` sin canal a **`no`**: el
  carrito es una plantilla vacía y los productos no tienen precio ni acción de
  compra. Hermanos Martos y Tortas La Caleteña quedan igualmente `no` tras la
  revisión de sus mecanismos actuales.
- Estado tras el lote: **394 filas**; **191 `verificado`**, **33 `parcial`** y
  **170 `pendiente`**. Venta online: **119 `sí`** (105 con canal revisado), 58
  `no` y 217 `no comprobado`. Pan y pastelería queda cerrado editorialmente con
  **61 filas y 61 decisiones actuales cubiertas por evidencia**.

### Lote 23 — Charcutería, 1/4 (2026-07-16)

- Se revisaron diez filas: ocho quedan **`verificado`** y Almodóvar Productos
  Cárnicos y Carnicería Josefina quedan **`parcial`**. Josefina mantiene una
  actividad comercial vigente y oferta de elaborados, pero ninguna fuente
  accesible atribuye inequívocamente su fabricación a la propia carnicería.
- Aúpa Gourmet se recategoriza de Charcutería a **Platos preparados** y actualiza
  sede y teléfono: su actividad real es la elaboración de croquetas para HORECA.
  Cadelmar pasa a **Pescado y conservas** por su planta de transformación de
  pescado; se retira el antiguo dominio, hoy convertido en una página de
  aparcamiento. Almodóvar pasa a **Carnes** y corrige municipio postal y teléfono.
- Adorín corrige dirección y correo; Aragón, Diego, El Perdi, Hnos López y María
  sustituyen textos genéricos por sus elaboraciones documentadas. El Perdi mueve
  su Facebook a la columna correcta y María actualiza sede, mapa y web propia.
- La revisión de canales deja siete filas en **`no`** y mantiene Almodóvar y
  Cadelmar en `no comprobado` por sus webs fallidas y la incertidumbre resultante.
  Ninguna fila del lote acredita un pedido remoto utilizable.
- Estado tras el lote: **394 filas**; **199 `verificado`**, **35 `parcial`** y
  **160 `pendiente`**. Venta online: **119 `sí`** (105 con canal revisado), 66
  `no` y 209 `no comprobado`. Charcutería queda con **41 filas**, de las cuales
  28 siguen pendientes; sus diez decisiones ya revisadas tienen evidencia.

### Lote 24 — Charcutería, 2/4 (2026-07-16)

- Las diez filas revisadas pasan a **`verificado`**. JF CÁRNIKO 2020 se
  recategoriza a **Carnes** por su actividad mayorista de carnes y elaborados de
  marca blanca; también actualiza identidad, teléfono y correo.
- Carnicería Pepi pierde el correo `ventas@carniceriapepi.es`: el dominio
  pertenece hoy a una carnicería distinta de Córdoba. Rivero corrige su portal
  del 21 al 19; Casa Maribel actualiza teléfono; EmbuAxarquía corrige el dominio
  de correo; Díaz Aranda incorpora la identidad productiva Dimor Guadalhorce.
- Gamarro actualiza correo y horario; su catálogo Prestashop no tiene precios ni
  compra. Moreno Plaza migra al dominio canónico `.com` y añade contactos y
  redes actuales. Las dos quedan `no`, igual que los demás catálogos meramente
  informativos del lote.
- La Abuela Loli queda **`sí` por ecommerce** tras actualizarse a avenida de la
  Libertad 90: su WooCommerce publica productos, precios, carrito y transporte
  refrigerado. Peláez corrige la sede de Nueva 67 a 65 y queda **`sí` por
  ecommerce y teléfono**, con pagos y envío frío en 24-48 horas.
- Estado tras el lote: **394 filas**; **209 `verificado`**, **35 `parcial`** y
  **150 `pendiente`**. Venta online: **121 `sí`** (107 con canal revisado), 74
  `no` y 199 `no comprobado`. Charcutería queda con **40 filas**: 19
  `verificado`, 3 `parcial` y 18 pendientes; las 19 revisadas tienen evidencia.

### Lote 25 — Charcutería, 3/4 (2026-07-16)

- Se revisaron diez filas: nueve quedan **`verificado`** y Huesal **`parcial`**,
  al no disponer de una fuente propia reciente que eleve el directorio
  institucional a confirmación plena de actividad. Huesal corrige además su
  sede desde Marcos Zapata a Obispo Salvador de los Reyes 7.
- Especias Pedroza pasa de Charcutería a **Especias** y FAMADESA a **Carnes**.
  La primera acredita una tienda Prestashop activa; FAMADESA documenta
  producción cárnica integral y un pedido explícito por WhatsApp.
- Hnos. Fernández sustituye el antiguo comercio por la fábrica de Cárnicas La
  Cala en calle Casares 46. Ibéricos Yunquera corrige teléfono y elimina el
  correo institucional de Sabor a Málaga; Perdiguero actualiza móvil, HTTPS y
  coordenadas; Icarben adopta su tienda actual y sus coordenadas publicadas.
- Ibéricos LanGenal corrige el error territorial heredado: la finca Guadarrín y
  la unidad productiva están en **Faraján**, no en Arriate. Se migran slug e
  imagen y se deja evidencia `merge` del identificador antiguo. Con ello
  desaparece el aviso de distancia que producía esa fila.
- Especias Pedroza, ARO, Icarben, LanGenal y Alto Genal quedan **`sí` por
  ecommerce**; FAMADESA, **`sí` por WhatsApp**. Hnos. Fernández, Huesal,
  Ibéricos Yunquera y Perdiguero quedan `no` tras revisar sus mecanismos
  publicados.
- Estado tras el lote: **394 filas**; **218 `verificado`**, **36 `parcial`** y
  **140 `pendiente`**. Venta online: **127 `sí`** (113 con canal revisado), 78
  `no` y 189 `no comprobado`. Charcutería queda con **38 filas**: 26
  `verificado`, 4 `parcial` y 8 pendientes; hay **216 filas actuales** cubiertas
  por evidencia.

### Lote 26 — Charcutería, cierre (2026-07-16)

- Se revisaron las ocho filas restantes y todas quedan **`verificado`**.
  Charcutería ya no tiene pendientes: conserva 34 filas, con 30 `verificado` y
  4 `parcial` editoriales.
- Cuatro clasificaciones genéricas se corrigen: La Victoria pasa a **Carnes**
  porque su planta de Campillos es una sala de despiece; Especias Sánchez y
  Productos Laure pasan a **Especias**; Trafrut Cano pasa a **Conservas y
  mermeladas** por su dulce de membrillo.
- La web renovada de La Victoria identifica expresamente las fábricas de Écija
  y Campillos. Melgar mueve la unidad productiva a calle Ronda 8; su dominio
  responde 503 por HTTP y HTTPS y se conserva, dejando la venta online en `no
  comprobado` sin confundir un fallo de acceso con cierre.
- Prolongo queda **`sí` por ecommerce y WhatsApp**; Especias Sánchez, Productos
  Laure y Trafrut Cano, **`sí` por ecommerce**. Rimicol y Rondasal actualizan
  catálogo y situación con fuentes de 2025-2026 y quedan `no` al no publicar
  pedido remoto; La Victoria queda igualmente `no` como catálogo B2B.
- Estado tras el lote: **394 filas**; **226 `verificado`**, **36 `parcial`** y
  **132 `pendiente`**. Venta online: **131 `sí`** (117 con canal revisado), 81
  `no` y 182 `no comprobado`. Hay **224 filas actuales** cubiertas por evidencia.

### Lote 27 — Lácteos y quesos, 1/3 (2026-07-16)

- Se revisaron diez filas y todas quedan **`verificado`**. Solo Agammasur, Flor
  Bermeja y El Pastor del Valle eran queserías: las tres actualizan catálogo,
  contacto y canal de venta; Agammasur y El Pastor acreditan ecommerce, y Flor
  Bermeja, pedido telefónico con entrega publicada.
- Siete altas genéricas estaban mal clasificadas. Bizcochería Lulapai, Casa Kiki,
  La Cheesequería, Dulces del Mar, Las Delicias de Mi Noe y Luzana pasan a **Pan
  y pastelería**; El Piave pasa a **Helados**. Se sustituyen en todas los textos
  lácteos ficticios por la actividad productiva documentada.
- Casa Kiki deja de apuntar a una tienda y pasa al obrador de calle Benadalid 50,
  nave 5. La Cheesequería actualiza nombre, local y correo; El Piave migra a
  HTTPS. Las seis filas con pedido remoto demostrable quedan `sí` por sus canales
  correspondientes; Luzana conserva `no comprobado` porque su dominio muestra
  una página expirada, aunque actividad, identidad y obrador sí quedan verificados.
- Estado tras el lote: **394 filas**; **236 `verificado`**, **36 `parcial`** y
  **122 `pendiente`**. Venta online: **140 `sí`** (126 con canal revisado), 81
  `no` y 173 `no comprobado`. Lácteos y quesos queda con **24 filas**: 9
  `verificado`, 1 `parcial` y 14 pendientes; hay **234 filas actuales** cubiertas
  por evidencia.

### Lote 28 — Lácteos y quesos, 2/3 (2026-07-16)

- Se revisaron siete filas: seis quedan **`verificado`** y SAT Los Productos de
  la Cabra Malagueña queda **`parcial`**. CABRAMA confirma la entidad colectiva,
  sus productos y sede en El Pozuelo, pero no documenta con actualidad suficiente
  qué gamas fabrica hoy directamente la SAT; por eso no se fuerza la verificación.
- El Arquillo sustituye su texto genérico por la ganadería y fabricación propias
  y queda `sí` por ecommerce. Crestellina migra a su nueva marca, dominio Shopify,
  teléfono y horario, también con ecommerce. El Pastor del Torcal corrige la sede
  a calle Extremadura y queda `sí` por ecommerce y WhatsApp.
- Quesos Argudo incorpora la marca Cabraline y sus perfiles propios; el catálogo
  sectorial actual publica pedidos por mensajería social, por lo que queda `sí`,
  aunque sin token de canal porque el contrato no tipifica esa vía. El Alcornocal
  mueve la unidad productiva de la tienda de calle Real a calle Mirador 10 y queda
  `sí` por teléfono y correo, con reparto nacional documentado.
- El Llano Jaral queda verificado como fábrica activa de Hnos. Vargas Jiménez. Su
  dominio responde y el colectivo local vende productos, pero los lotes de queso
  están agotados y no se confirmó un pedido propio vigente: conserva `no
  comprobado`. La SAT queda `no` tras revisar la web actual sin pedido remoto.
- Estado tras el lote: **394 filas**; **242 `verificado`**, **37 `parcial`** y
  **115 `pendiente`**. Venta online: **145 `sí`** (130 con canal tipificado), 82
  `no` y 167 `no comprobado`. Lácteos y quesos queda con **24 filas**: 15
  `verificado`, 2 `parcial` y 7 pendientes; hay **241 filas actuales** cubiertas
  por evidencia.

### Lote 29 — Lácteos y quesos, cierre (2026-07-16)

- Las seis filas productivas revisadas quedan **`verificado`** y Lácteos y
  quesos se cierra sin pendientes: 22 filas, 20 verificadas y 2 parciales
  editoriales. Santa Gema pasa a **Helados** al confirmarse su fábrica artesana
  en Rincón de la Victoria y su catálogo de helados, sorbetes, tartas y granizados.
- El Porticatero corrige su fábrica a Cañadilla de Víquez 48 y queda `sí` por
  WhatsApp y correo. La Cañada del Capitán corrige el código postal y queda `sí`
  por WhatsApp y teléfono; su checkout está en mantenimiento y no se cuenta como
  ecommerce. La Hortelana incorpora web, nave 12 y catálogo real, y queda `sí`
  por WhatsApp mientras su nueva tienda web sigue en obras.
- La Laja actualiza sede, catálogo y exclusividad de leche vacuna propia. Su
  página llamada Tienda está en modo catálogo, sin precios ni pedido, y queda
  `no`. Santa María del Cerro corrige código postal y correo, elimina un dominio
  comprometido que redirigía a sitios ajenos y queda `sí` por pedido telefónico.
  Santa Gema acredita reparto telefónico desde su heladería propia.
- La fila `agasur-s-c-a-el-taraja` se fusiona con
  `agammasur-s-c-a-colmenar`: AGASUR y AGAMMA formalizaron en 2023 la cooperativa
  AGAMMASUR, que hoy produce las mismas marcas El Pinsapo y Montes de Málaga en
  Colmenar. Se elimina así el falso municipio heredado «El Taraja» y se deja
  evidencia `merge`; la fila no tenía imagen que migrar.
- Estado tras el lote: **393 filas**; **248 `verificado`**, **37 `parcial`** y
  **108 `pendiente`**. Venta online: **150 `sí`** (135 con canal tipificado), 83
  `no` y 160 `no comprobado`. Hay **247 filas actuales** cubiertas por evidencia.

### Lote 30 — Miel, cierre (2026-07-16)

- Se revisaron las nueve filas pendientes de Miel: ocho quedan **`verificado`**
  y Apícola Luca queda **`parcial`**. La categoría Miel se cierra sin pendientes:
  seis filas, cinco verificadas y una parcial editorial. Apícola Luca mantiene
  identidad, municipio y contactos propios, pero no ofrece una señal pública
  reciente suficiente para afirmar actividad productiva actual; además se retira
  `pinturaslucas.com`, que pertenecía a un negocio ajeno.
- Biotrap pasa a **Helados**: fabrica sorbetes y helados ecológicos y veganos,
  no miel, y queda `no` tras revisar su web informativa sin pedido remoto. La
  Borgeña pasa a **Frutos secos** por su elaboración de pasas moscatel, higos y
  derivados, y Mermelada La Higuera pasa a **Conservas y mermeladas**; ambas
  quedan `sí` por ecommerce propio.
- Bee Garden y Naturdis quedan `sí` por ecommerce con catálogo, carrito y envío.
  Miel El Chozo queda `sí` porque una guía actual de compra confirma disponibilidad
  online, pero sin token de canal al no identificar un mecanismo concreto; se
  elimina la página de calendario ajena y una dirección puntual no acreditada.
  Apícola Milosi y Miel Agustín quedan `no comprobado`: su actividad y elaboración
  están acreditadas, pero no se encontró un pedido remoto vigente verificable.
- Estado tras el lote: **393 filas**; **256 `verificado`**, **38 `parcial`** y
  **99 `pendiente`**. Venta online: **155 `sí`** (139 con canal tipificado), 84
  `no` y 154 `no comprobado`. Hay **256 filas actuales** cubiertas por evidencia.

### Lote 31 — Aceitunas y encurtidos, cierre (2026-07-16)

- Ocho de las nueve filas pendientes quedan **`verificado`** y Aceitunas Yoliva
  queda **`parcial`**: su identidad y ubicación están sostenidas, pero falta una
  fuente propia o actual que detalle suficientemente su elaboración. La categoría
  se cierra sin pendientes: 14 filas, 12 verificadas y 2 parciales.
- Aceitunas Chicón Lebrón y Aceitunas Chicón S.L. se conservan como entidades
  distintas: tienen CIF, sede, fábrica y canales propios diferentes. Chicón
  Lebrón queda `sí` por pedidos mayoristas telefónicos con entrega; Chicón S.L.
  queda `no` al mantener solo una página de contacto sin pedido remoto.
- Bravo, Copusan y Manzaoliva quedan `sí` por ecommerce propio. El Alamillo queda
  `no` tras revisar su catálogo informativo sin compra. Aceitunas Lima mantiene
  `no comprobado`: actividad 2025, sede y elaboración quedan acreditadas, pero no
  un canal remoto vigente.
- `caserissimo-mijas` se corrige a `caserissimo-fuengirola`: es un obrador de
  **Pan y pastelería** de Fuengirola, no una aceitunera de Mijas. Se añade la
  evidencia de fusión exigida por el cambio de slug; no había imagen que migrar.
- Estado tras el lote: **393 filas**; **264 `verificado`**, **39 `parcial`** y
  **90 `pendiente`**. Venta online: **159 `sí`** (143 con canal tipificado), 86
  `no` y 148 `no comprobado`. Hay **265 filas actuales** cubiertas por evidencia.

### Lote 32 — Cerveza artesana y Chocolate, cierre (2026-07-16)

- Se revisaron las seis cerveceras y seis chocolaterías pendientes: diez filas
  quedan **`verificado`** y Cerveza Puente Nuevo queda **`parcial`**. Las dos
  categorías se cierran sin pendientes: Cerveza artesana tiene 12 filas, 10
  verificadas y 2 parciales; Chocolate queda con 3 filas, todas verificadas.
- 3Monos, Rondeña y Gaitanejo quedan `sí` por ecommerce propio. Eukel conserva
  `no comprobado`: fábrica y actividad reciente están sostenidas, pero no un
  pedido remoto. Puente Nuevo mantiene identidad histórica y vínculo con
  Arriate, pero no actividad productiva reciente suficiente; se retiran la
  dirección, mapa y coordenadas erróneas de Ronda sin inferir un cierre.
- Cervezas Victoria pasa a **Bebidas** porque su fábrica es industrial, no una
  microcervecera artesana, y queda `no`: la web vende reservas de visitas, no
  cerveza. Campo Bética actualiza su identidad a Biochoc y sustituye un dominio
  comprometido por el sitio limpio del fabricante; no se pudo confirmar pedido
  remoto y queda `no comprobado`.
- Maychoco queda `sí` por ecommerce y La Pinocha `sí` por marketplace. Roe-Roe
  Casa Lola y The Coven pasan a **Pan y pastelería**: la primera es pastelería,
  no chocolatería, y la segunda un obrador de masa madre con ecommerce. Tree
  Natural Bars pasa a **Snacks artesanos** y queda `sí` por ecommerce propio.
- Estado tras el lote: **393 filas**; **275 `verificado`**, **40 `parcial`** y
  **78 `pendiente`**. Venta online: **166 `sí`** (150 con canal tipificado), 87
  `no` y 140 `no comprobado`. Hay **277 filas actuales** cubiertas por evidencia.

### Lote 33 — Café, Aromáticas, Helados y Pescado, cierre (2026-07-16)

- Se revisaron las doce filas pendientes: once quedan **`verificado`** y Bio
  CETEC **`parcial`**. Café se cierra con 8 filas verificadas; Aromáticas y
  condimentos con 3 verificadas y 1 parcial; Helados con 5 verificadas y 1
  parcial; y Pescado con sus 3 filas verificadas.
- Los cinco tostadores quedan `sí` por ecommerce propio. Artisan normaliza
  identidad, dirección y dominio; Carambuco mueve fábrica, mapa y coordenadas de
  avenida de Molière a Escritor Sancho Guerrero 8-10; La Hacienda y Mokasol
  sustituyen textos genéricos por sus procesos reales; Nerja Coffee Roasters
  actualiza dominio, correo, horario y catálogo.
- Bio CETEC acredita SAT, nave y transformación de stevia y moringa, pero no una
  señal actual suficiente para verificar actividad productiva: queda `parcial/no
  comprobado` y pierde dominio, correo y coordenadas no sostenidos. Safrina
  incorpora la identidad Triselecta y queda `sí` por la tienda oficial de La Casa
  del Azafrán. Revival pasa de Aromáticas a **Despensa artesanal** y queda `sí`
  por ecommerce de su espirulina cultivada y procesada en Coín.
- Confitería Daver pasa de Helados a **Pan y pastelería**, acorde con su obrador
  actual, y queda `sí` por ecommerce. La fila malagueña de Casa Mira adopta la
  identidad y canales de **Dimas Mira e Hijos** y elimina web y perfiles de la
  turronería madrileña independiente; queda `sí` por ecommerce.
- Pesquemar queda `no`: mantiene planta de semiconservas activa en Mollina, pero
  el sitio suspendido describía distribución mayorista sin pedido remoto.
  Pinchomanía adopta su tienda Todo Ahumados y queda `sí` por ecommerce con
  transporte refrigerado.
- Estado tras el lote: **393 filas**; **286 `verificado`**, **41 `parcial`** y
  **66 `pendiente`**. Venta online: **176 `sí`** (160 con canal tipificado), 88
  `no` y 129 `no comprobado`. Hay **289 filas actuales** cubiertas por evidencia.

### Lote 34 — Huevos, cierre (2026-07-16)

- Se revisaron las diez filas pendientes: nueve quedan **`verificado`** y Granja
  Casado **`parcial`**. La categoría Huevos queda cerrada con 8 filas verificadas
  y 1 parcial; las otras dos identidades se reclasifican a su actividad real.
- Avícola el Pinar adopta la identidad pública **Huevos El Pinar**, corrige la
  afirmación falsa de huevos camperos y actualiza web, teléfono y correo; queda
  `sí` por pedidos directos por email y teléfono. Granja Salvi queda `sí` por
  WhatsApp, con catálogo 2026 y reparto propio, y Huevos AMA `sí` por su ficha
  profesional de presupuesto en marketplace.
- Huevos y Gallinas Campechanas acredita selección, envasado y reparto local a
  domicilio y queda `sí` por teléfono. Huerta Río Grande queda `no`: su web
  actual confirma huevos y pacanas ecológicos, pero no ofrece pedido remoto.
  Las Pencas queda `no comprobado` al no poder demostrarse un mecanismo vigente.
- Granja Casado conserva identidad, ubicación y teléfono, pero no tiene señal
  propia actual suficiente para elevar la actividad a verificada; se elimina el
  correo genérico de Sabor a Málaga. **La Artesana de la Pasta** pasa de Huevos a
  **Pasta artesana** y queda `no comprobado`; se retira una guía ajena y el
  dominio propio no resuelve.
- La Huertezuela abandona el falso punto de Mercamálaga: la parcela productiva
  418 del polígono 1 de Alozaina y sus coordenadas se obtienen del Catastro, con
  lo que desaparece el aviso territorial. Queda `no` tras revisar su web
  informativa. **Panificadora Casares** pasa de Huevos a **Pan y pastelería** y
  queda `sí` por el correo específico de pedidos y teléfono publicados.
- Estado tras el lote: **393 filas**; **295 `verificado`**, **42 `parcial`** y
  **56 `pendiente`**. Venta online: **181 `sí`** (165 con canal tipificado), 90
  `no` y 122 `no comprobado`. Hay **307 filas actuales** cubiertas por evidencia.

### Lote 35 — Despensa artesanal, identidades A-C (2026-07-16)

- Se revisaron doce filas: nueve quedan **`verificado`**, Aceitunas Fernández
  **`parcial`** y dos se purgan. Las tres aceituneras pasan a **Aceitunas y
  encurtidos**; Castillo queda `sí` por ecommerce, Lucena `no` tras revisar su
  catálogo propio y Fernández `no comprobado` por falta de señal productiva
  propia reciente.
- Skandia pasa a **Pescado y conservas** y queda `sí` por ecommerce nacional;
  Doña Amelia pasa a **Platos preparados** y queda `sí` por su tienda de crema
  de ajoblanco. Avomix pasa a **Salsas** y queda `no`: fabrica guacamole, pulpas,
  hummus y salsas mediante HPP, pero el sitio actual sólo ofrece catálogo B2B.
- BMaro pasa a **Flores**, acorde con su cultivo de flores comestibles y
  microhierbas en Maro, y queda `no`. Caprisur y La Torcaleña pasan a **Carne**:
  la primera queda `sí` por ecommerce de chivo lechal y la segunda `sí` por
  encargos mediante WhatsApp y teléfono. Chivo de Canillas pasa a **Platos
  preparados** y queda `sí` por ecommerce de cabrito asado listo para calentar.
- Se purgan **Churrería Reme**, establecimiento hostelero y food truck sin
  producto alimentario envasado, y **Coín Pa Comérselo**, marca promocional del
  mercado colectivo del Guadalhorce, no una unidad productiva. Se elimina la
  imagen huérfana de Churrería Reme.
- Estado tras el lote: **391 filas**; **304 `verificado`**, **43 `parcial`** y
  **44 `pendiente`**. Venta online: **187 `sí`** (171 con canal tipificado), 93
  `no` y 111 `no comprobado`. Hay **309 filas actuales** cubiertas por evidencia.

### Lote 36 — Despensa artesanal, identidades E-H (2026-07-16)

- Se revisaron nueve filas: seis quedan **`verificado`** y Ecobalcón, Extra
  Natural y Gazpachería Malagueña **`parcial`**. Ninguna conserva la categoría
  genérica: Ecobalcón y Hortícola Sierra pasan a **Fruta y verdura**; El Tío de
  las Papas a **Snacks artesanos**; Embrujo del Sur a **Vermut y vinos de
  licor**; Extra Natural a **Pan y pastelería**; Frumaco-FRUDEL a **Salsas**;
  Gazpachería Malagueña a **Platos preparados**; y las dos molineras a **Harinas
  y cereales**.
- Ecobalcón abandona la ficha turística del Balcón de Europa y se ubica en la
  cooperativa de C. Carretera 10; se elimina su dominio aparcado y queda
  `parcial/no comprobado`. Extra Natural actualiza obrador, teléfono y
  coordenadas a C. Río Fuengirola 13 y pierde la web de otro negocio; también
  queda `parcial/no comprobado` por falta de actividad propia reciente.
- La fila de Gazpachería Malagueña mezclaba al elaborador de Pizarra con un
  restaurante homónimo de C. Somera en Málaga. Se restituyen C. Islandia 14,
  teléfono y coordenadas del obrador de gazpacho, salmorejo y ajoblanco
  envasados; queda `parcial/no comprobado` y desaparece el aviso territorial.
- El Tío de las Papas y Embrujo del Sur quedan `sí` por sus ecommerce activos.
  Frumaco queda `no`: la planta de guacamole del Grupo TROPS continúa activa y
  su dominio presenta un fallo de base de datos, no un cierre, pero sus canales
  públicos revisados son corporativos/B2B sin pedido remoto.
- Harinas La Fuensanta y Harinera El Molino quedan `sí` por ecommerce, con
  identidad molinera, gamas y contactos normalizados. Hortícola Sierra queda
  `sí` por su tienda con carrito y envíos nacionales, además de actualizar web
  y correo.
- Estado tras el lote: **391 filas**; **310 `verificado`**, **46 `parcial`** y
  **35 `pendiente`**. Venta online: **192 `sí`** (176 con canal tipificado), 94
  `no` y 105 `no comprobado`. Hay **318 filas actuales** cubiertas por evidencia.

### Lote 37 — Despensa artesanal, cierre (2026-07-16)

- Se revisaron las ocho filas restantes y todas quedan **`verificado`**. La
  categoría Despensa artesanal queda sin pendientes: Las Delicias de la Yaya
  pasa a **Platos preparados**; Paltavo a **Salsas**; Pronaxa a **Conservas
  vegetales**; Reyes Gutiérrez a **Fruta y verdura**; y Guerrero, Pescados y
  Mariscos Rodríguez, Román y Martos y Sanamar a **Pescado y conservas**.
- Las Delicias acredita obrador y una gama propia de croquetas y preparados; se
  actualiza el correo y queda `sí` por ecommerce. Paltavo acredita procesado HPP
  de salsas de aguacate, tomate y mango mediante la web del grupo y Salón
  Gourmets 2025; corrige código postal y correo y queda `no`, pues sus canales
  son corporativos/B2B.
- Guerrero no se reduce a distribución: mantiene salas propias de corte,
  fileteado, cocción y envasado, boquerones en vinagre, anchoas y quinta gama;
  actualiza HTTPS y correo y queda `no`, ya que Merca Guerrero es tienda física.
  Pescados Rodríguez también acredita sala homologada, empacado a medida y
  conservas artesanales; pasa a `no` tras revisar su catálogo y tienda física.
- Pronaxa abandona la falsa dirección del parque tecnoalimentario y se ubica en
  C. San Pedro de la Viña 4, con coordenadas aproximadas de esa calle. Su web
  propia confirma elaboración artesanal de pimientos asados con leña de olivo;
  queda `no`. Reyes Gutiérrez acredita producción y exportación de mango y
  aguacate desde 1993 y queda `no` por su sitio corporativo sin pedido remoto.
- Román y Martos conserva encaje como productor por su sala de despiece y la
  marca Akaituna, atún rojo capturado por su propio buque y procesado tras la
  pesca; corrige código postal, HTTPS y correo y queda `sí` por teléfono de
  pedidos 24 horas. Sanamar acredita 1.850 toneladas elaboradas en 2025 y sala
  propia de corte, glaseado y envasado; queda `no` por catálogo B2B informativo.
- Estado tras el lote: **391 filas**; **318 `verificado`**, **46 `parcial`** y
  **27 `pendiente`**. Venta online: **194 `sí`** (178 con canal tipificado), 100
  `no` y 97 `no comprobado`. Hay **326 filas actuales** cubiertas por evidencia.

### Lote 38 — Fruta y verdura, A-C (2026-07-16)

- Se revisaron las diez filas entre Aguacates Dehesa Alta y Cooperativa
  Agrícola de Estepona. Siete quedan **`verificado`**, Biovega **`parcial`**,
  Cítrica de Pizarra se purga por cierre y Cítricos Valero por no corresponder a
  un productor. Además, bioBética se fusiona con la ficha ya existente Campo
  Bética (Biochoc), la misma empresa y unidad productiva.
- Aguacates Dehesa Alta queda `sí` por ecommerce estacional de aguacate Hass
  propio. BEMA adopta la identidad BemaTropik, domicilio y correo actuales, y
  queda `sí` por una tienda con precios, stock, carrito y envío desde la finca.
  Almensur pasa a **Frutos secos**, corrige la sede y queda `no`: su web muestra
  catálogo, pero no precio ni flujo de pedido; se conserva HTTP porque el
  certificado HTTPS no corresponde al dominio.
- Campo Bética absorbe el duplicado bioBética y actualiza web, contacto, gama y
  venta `sí`: el ecommerce ofrece cremas Biochoc, cacao soluble y AOVE con
  precios, carrito y envíos. Se elimina la imagen redundante del slug fusionado.
  Biovega corrige dirección, teléfono y gama hortícola, pero queda
  `parcial/no comprobado` porque las fuentes propias no aportan actividad
  reciente suficiente.
- Castañas Valgenal pasa a **Frutos secos**, actualiza teléfono y queda `no` por
  catálogo corporativo. Cítricos El Romeral acredita cosecha propia, envasado y
  línea ecológica y queda `no`. La Cooperativa Agrícola de Estepona acredita la
  comercialización por subasta de las cosechas de sus socios y queda `no`; el
  correo de pedidos corresponde a insumos agrícolas, no a fruta a distancia.
- Cítrica de Pizarra se purga: la fuente histórica resuelve su actividad, pero
  el directorio empresarial la marca inactiva y el dominio no resuelve.
  Cítricos Valero se purga porque web, teléfono y dirección pertenecen a
  Agrícola Miguel Valero, un comercio y taller de maquinaria de Cártama, no a
  un productor alimentario de Coín; se elimina también su imagen.
- Estado tras el lote: **388 filas**; **324 `verificado`**, **47 `parcial`** y
  **17 `pendiente`**. Venta online: **197 `sí`** (181 con canal tipificado), 104
  `no` y 87 `no comprobado`. Hay **333 filas actuales** cubiertas por evidencia.

### Lote 39 — Fruta y verdura, E-N (2026-07-16)

- Se revisaron diez filas: siete quedan **`verificado`**, Frutas Rocío y Frutos
  Secos Esteban **`parcial`**, y Hay Mango se purga por cierre. Frutos Secos
  Esteban se corrige de Fuengirola a Málaga capital y Nueces de Ronda de Málaga
  a Ronda; ambos cambios incluyen slug, imagen y registro de fusión.
- Exotic Fruit Box queda `sí` por ecommerce de cajas tropicales y actualiza
  HTTPS y contacto. Finca La Juntilla adopta su marca actual **BioJuntilla** y
  queda `sí`: Diego Díaz mantiene cultivo propio ecológico, precios, carrito y
  reparto semanal. Frutas Montosa actualiza dirección, gama y contactos y queda
  `no`, pues sus canales actuales son corporativos/B2B.
- Frutas Rocío queda `parcial/no comprobado`: existe como mayorista y su objeto
  contempla explotaciones agrícolas, pero no hay fuente propia actual que
  delimite producto propio. Frutos Secos Esteban pasa a **Frutos secos** y
  corrige municipio, pero también queda `parcial/no comprobado` por falta de
  señal propia reciente y de pedido verificable.
- Grupo Hermanos Gallego acredita elaboración de cuarta gama y zumos en su
  planta, actualiza web y correo y queda `sí` por pedidos expresos mediante
  teléfono y email. Haza del Palmar pasa a **Frutos secos** y queda `no`: su
  nuez pecana ecológica mantiene uso comercial actual, pero no pedido remoto.
  Productos Domínguez también pasa a **Frutos secos**, actualiza dirección y
  HTTPS y queda `no` por catálogo corporativo.
- Nueces de Ronda corrige la unidad productiva a Finca La Molinilla, Ronda, y
  queda `sí` por ecommerce estacional con precios, carrito y condiciones. Hay
  Mango se purga: el BOE documenta la conclusión de la liquidación y extinción
  de la sociedad en 2021, sin continuidad productiva posterior acreditada.
- Estado tras el lote: **387 filas**; **331 `verificado`**, **49 `parcial`** y
  **7 `pendiente`**. Venta online: **201 `sí`** (185 con canal tipificado), 107
  `no` y 79 `no comprobado`. Hay **342 filas actuales** cubiertas por evidencia.

### Lote 40 — Fruta y verdura y snacks, cierre (2026-07-16)

- Se revisaron las siete filas pendientes finales: seis quedan
  **`verificado`** y Pecán del Sur **`parcial`**. Con este lote, el CSV de
  Málaga queda sin ninguna fila `pendiente`.
- Organic Passion adopta la identidad vigente **Giallo Royal (Organic
  Passion)**, actualiza teléfono y HTTPS y queda `sí` por ecommerce de fruta
  exótica y subtropical ecológica, con disponibilidad estacional. Sigfrido
  Fruit actualiza sede, correo y HTTPS y también queda `sí`: la tienda mantiene
  cajas con precios, carrito, condiciones y envíos, distinguiendo cultivo
  propio de fruta seleccionada a agricultores colaboradores.
- Patatas Paco José y Patatas Fritas Millán pasan de la categoría errónea
  **Fruta y verdura** a **Snacks artesanos**. Ambas acreditan elaboración
  artesanal propia y quedan `no`: Paco José tiene productos WooCommerce sin
  precio ni acción de compra, mientras Millán publica catálogo y contacto para
  venta mayorista, sin mecanismo de pedido remoto.
- Pitayas La Mística acredita cultivo artesanal y ecológico de pitaya roja en
  la Axarquía y queda `no` por sitio informativo. TROPS acredita producción,
  selección y envasado de mango y aguacate de sus más de 3.000 socios y queda
  `no`, pues su web vigente remite al consumidor a fruterías físicas.
- Pecán del Sur pasa a **Frutos secos** y conserva la ficha como
  `parcial/no comprobado`: las fuentes resuelven cultivo, pelado y envasado y
  su instalación de Alhaurín, pero la última señal productiva sólida localizada
  es de 2021 y `pecandelsur.es` ya no resuelve. Se retira la web sin inferir un
  cierre que no está probado.
- Estado tras el lote: **387 filas**; **337 `verificado`**, **50 `parcial`** y
  **0 `pendiente`**. Venta online: **203 `sí`** (187 con canal tipificado), 111
  `no` y 73 `no comprobado`. Hay **349 filas actuales** cubiertas por evidencia
  y **376 registros** en el ledger provincial.

### Auditoría final — duplicados y activos (2026-07-16)

- La comparación de nombres, teléfonos, correos, dominios y referencias de
  mapa detectó cuatro grupos de contactos compartidos. Se conservan como líneas
  diferenciadas SCAAVO/Bodegas Carpe Diem, las dos fábricas contiguas de Grupo
  San Roque y Embutidos Melgar/Quesería La Arriateña; sus productos, marcas o
  instalaciones diferenciadas están documentados y no son duplicados
  accidentales.
- **Mermeladas Málaga** sí se fusiona con **La Gitanilla (Alma Melosa)**: ambas
  fichas comparten teléfono y el aviso legal vigente identifica como titular a
  Mermelada Mango Málaga S.L. Se conserva la web y sede actuales, se corrige la
  categoría a **Mermeladas**, se tipifica el ecommerce y se elimina la imagen
  del slug antiguo.
- Estado final tras la deduplicación: **386 filas**; **336 `verificado`**, **50
  `parcial`** y **0 `pendiente`**. Venta online: **202 `sí`** (188 con canal
  tipificado), 111 `no` y 73 `no comprobado`. Hay **350 filas actuales**
  cubiertas por evidencia y **378 registros** en el ledger provincial.

### Ola 3 — venta sin resolver (2026-07-29)

- Se revisaron las **74** filas que seguían con `Venta online=no comprobado`.
  Bodegas y Viñedos de la Capuchina pasa a **`sí` por `ecommerce`**: su tienda
  oficial vuelve a publicar vinos y aceite propios con precio, stock y carrito.
- Se mantienen sin resolver las tiendas vacías o incompletas: Tropicado no
  publica productos, Apícola Milosi presenta artículos sin precio de compra,
  IFM conserva todo el catálogo agotado y Rioliva muestra precio cero y
  “consultar precio”. Los fallos 403, TLS, DNS o servidor tampoco se convierten
  en un `no`.
- Se retiran **cinco webs** que ya no son utilizables: tres dominios sin DNS,
  la página de proveedor caducada de Luzana y `lamelifera.com`, que actualmente
  pertenece a un laboratorio ecuatoriano ajeno a la ficha de Mijas. Se eliminan
  además los dos correos asociados a dominios incorrectos o sin DNS y se
  actualizan los textos de contacto.
- Estado provincial: **386 filas**; venta online **202 `sí`**, 111 `no` y
  **73 `no comprobado`**. Verificación: 336 `verificado` y 50 `parcial`.

Fuentes principales:
<https://bodegalacapuchina.es/>,
<https://bodegalacapuchina.es/producto/capuchina-vieja-moscatel-seco/> y
<https://lamelifera.com/nosotros/>.

### Ola 3 — segunda pasada de venta sin resolver (2026-07-31)

- Se reabrieron las **73** filas residuales con el sitio renderizado cuando el
  HTML inicial no bastaba. Trece pasan a **`no`** tras recorrer la web oficial,
  sus productos y el contacto vigente sin encontrar tienda operativa, checkout
  ni una instrucción concreta de pedido remoto. Cadelmar sale además del CSV:
  el BORME inscribió la disolución voluntaria y extinción de la sociedad en
  octubre de 2025. Permanecen 59 sin resolver por bloqueo, fallo técnico,
  tienda vacía o disponibilidad temporal.
- Entre las negativas confirmadas están 100 Caños, Castillo de la Estrella,
  Aceites Sierra de Yeguas, Agro-Olivarera Riogordo, Gonzalo Beltrán, Niño de
  la Salina, Pérez Hidalgo, El Carrero, El Molino de Colmenar, Frutos Secos
  Esteban, La Huerta de Carmen, Miel Agustín y Quesos El Llano Jaral. No se usa
  como `no` ningún 403, DNS, 500/503, catálogo agotado o tienda incompleta.
- Aceites Sierra de Yeguas recupera su sitio oficial vigente, normaliza HTTPS y
  pasa a `verificado`; su descripción incorpora los más de 200 socios, la
  almazara y la extracción en frío. Se eliminan también los horarios editoriales
  del tipo «Consultar web» en las filas resueltas.
- La auditoría de producto deja **0 `plantilla-cruzada`** (antes 9):
  Destilerías El Tajo y Gin Alborán se corrigen a `Licores`; las otras siete
  fichas reciben productos específicos que sí corresponden a su categoría.
  Las descripciones se reescriben con datos propios —subastas de Estepona,
  escala de Piquitos San Roque, proceso de Domínguez y gamas reales—.

Estado tras esta tanda: **385 filas**; **336 `verificado`** y 49 `parcial`.
Venta online: **202 `sí`**, 124 `no` y **59 `no comprobado`**.
