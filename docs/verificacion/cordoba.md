# Verificación provincial de Córdoba

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/andalucia/cordoba.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila vive en `data/evidence/andalucia/cordoba.jsonl` y se
amplía a medida que se revise cada lote.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`. Este documento
fija el snapshot, las particularidades de Córdoba y el plan de lotes; no duplica
los contratos de `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` ni
`docs/EDITORIAL_POLICY.md`.

## Estado inicial

- Inicio: 2026-07-01.
- Snapshot inicial: **154 filas**; 0 `verificado`, 0 `parcial`,
  154 `pendiente`.
- Venta online inicial: **0 `sí`, 0 `no`, 154 `no comprobado`**.
- `Canal de venta`: **0/154 filas informado**. Como no hay `sí` heredados, no
  hay cuarentena masiva de venta online; aun así cada lote debe decidir venta
  remota cuando la fuente la muestre o cuando se revise explícitamente.
- Imágenes: **102/154 filas con `imagen`, 52 sin imagen**. Revisar imágenes solo
  después de estabilizar identidad, `slug`, fusiones y purgas.
- Enlaces iniciales: 120/154 con `web`, 100/154 con `Instagram`, 75/154 con
  `Facebook`, 154/154 con `Google Maps`, 142/154 con `telefono`, 84/154 con
  `correo`, 154/154 con `direccion`.
- Calidad inicial: `node scripts/audit-csv.js --mode=quality --summary-only
  data/csv/andalucia/cordoba.csv` devuelve **0 errores, 5 warnings** y 56 avisos
  suprimidos por opcionales ausentes.
- Warnings iniciales de geo-check: revisar municipio/coordenadas de
  `aceites-hacienda-penillas-cordoba`, `almazara-castillo-del-valle-cordoba`,
  `monteoliva-cordobesa-s-l-cordoba`,
  `megustaeljamon-secadero-jamones-ibericos-valle-de-los-pedroches-cordoba` y
  `granja-ahuevo-cordoba`.
- Evidencia inicial: no existe `data/evidence/andalucia/cordoba.jsonl`.
- Modo: primera pasada profunda. No añadir productores nuevos durante esta fase
  salvo decisión explícita; primero cerrar la calidad de las 154 filas heredadas.
- Tras lote 1 / Aceite I (2026-07-01): 154 filas; **14 `verificado`, 0
  `parcial`, 140 `pendiente`**. Venta online: **13 `sí`, 0 `no`, 141 `no
  comprobado`**; 13/13 filas con `Venta online=sí` tienen
  `Canal de venta=ecommerce`. Evidencia: **14 registros** en
  `data/evidence/andalucia/cordoba.jsonl` (fichero creado en este lote).
  Calidad: 0 errores, 2 warnings y 55 opcionales suprimidos. Se corrigen los
  municipios de Hacienda Peñillas a Luque, Castillo del Valle a Belalcázar y
  Monteoliva Cordobesa a Montilla; quedan warnings geográficos para
  `megustaeljamon...` y `granja-ahuevo...`.
- Tras lotes 2-5 / Aceite II, bebidas y charcutería (2026-07-01): **146
  filas** tras 8 purgas; **66 `verificado`, 4 `parcial`, 76 `pendiente`**.
  Venta online: **53 `sí`, 0 `no`, 93 `no comprobado`**. Evidencia Córdoba:
  **78 registros**. Calidad Córdoba: 0 errores, **1 warning** y 50 opcionales
  suprimidos; queda solo `granja-ahuevo-cordoba` para el lote 9. Se resuelve el
  warning de `megustaeljamon...` corrigiendo el municipio a Hinojosa del Duque.
- Tras lote 6 / Pan y pastelería (2026-07-01): **145 filas** tras 1 fusión;
  **86 `verificado`, 5 `parcial`, 54 `pendiente`**. Venta online: **61 `sí`,
  0 `no`, 84 `no comprobado`**. Evidencia Córdoba: **100 registros**. Calidad
  Córdoba: 0 errores, **1 warning** y 42 opcionales suprimidos; sigue pendiente
  solo el warning de `granja-ahuevo-cordoba` para el lote 9.
- Tras lotes 7-8 / Lácteos, quesos, miel, helados y chocolate (2026-07-01):
  **141 filas** tras 4 purgas; **116 `verificado`, 5 `parcial`, 20
  `pendiente`**. Venta online: **77 `sí`, 0 `no`, 64 `no comprobado`**.
  Evidencia Córdoba: **134 registros**. Calidad Córdoba: 0 errores, **1
  warning** y 30 opcionales suprimidos; queda pendiente el lote 9 final y el
  warning de `granja-ahuevo-cordoba`.
- Tras lote 9 final / varios pequeños (2026-07-01): **138 filas** tras 2 purgas
  y 1 fusión adicionales; **130 `verificado`, 8 `parcial`, 0 `pendiente`**.
  Venta online: **88 `sí`, 0 `no`, 50 `no comprobado`**. Evidencia Córdoba:
  **154 registros**. Calidad Córdoba: 0 errores, **0 warnings** y 28 opcionales
  suprimidos. Los 5 geo-warnings iniciales quedan resueltos.

Reparto por categoría del snapshot inicial:

| Categoría | Filas |
|---|---:|
| Charcutería | 33 |
| Aceite | 28 |
| Pan y pastelería | 22 |
| Miel | 13 |
| Helados | 10 |
| Bodega | 9 |
| Lácteos y quesos | 8 |
| Aceitunas y encurtidos | 5 |
| Licores | 5 |
| Legumbres | 4 |
| Cerveza artesana | 3 |
| Chocolate | 3 |
| Despensa artesanal | 3 |
| Huevos | 3 |
| Aperitivos | 2 |
| Fruta y verdura | 2 |
| Pescado | 1 |

## Reglas duras para Córdoba

1. Todas las filas parten en `pendiente`: no dar por buena ninguna web, red,
   ficha de Maps, imagen, coordenada ni venta online heredada.
2. No hay `Venta online=sí` heredados. Promocionar a `sí` solo con pedido remoto
   vigente y utilizable; una web informativa, catálogo, precio, distribuidor o
   marketplace ajeno no basta.
3. Córdoba capital concentra 50 filas y mezcla obradores, comercios, heladerías,
   charcuterías y marcas. Distinguir elaborador/productor de tienda, restaurante,
   distribuidor o despacho sin elaboración propia demostrada.
4. En aceite, confirmar almazara, cooperativa, finca con molturación/elaboración
   propia o marca ligada a productor. No convertir una marca, distribuidor o
   comercializadora sin molino propio en `verificado`.
5. En vinos, licores y cerveza, distinguir bodega/destilería/fábrica real de
   enoteca, bar, distribuidor o marca sin elaboración. Las rutas o directorios
   sectoriales apoyan existencia, pero no prueban actividad actual ni venta.
6. En charcutería, especialmente Los Pedroches, confirmar secadero, fábrica,
   obrador cárnico, ganadería con elaboración o marca productora. Una carnicería
   minorista solo entra si acredita elaboración propia.
7. En pan, pastelería, chocolate y helados, exigir obrador o fabricación propia.
   Una cafetería, heladería de reventa o despacho sin obrador probado queda como
   máximo `parcial` o fuera de alcance según la evidencia.
8. En quesos y miel, una feria, premio, directorio o comercio local apoya
   existencia, pero para `verificado` debe haber fuente propia, ficha individual
   fiable o registro con match claro de entidad y municipio.
9. En legumbres, aceitunas, huevos, fruta, despensa y pescado, revisar el riesgo
   de distribuidora, central, supermercado o producto genérico. Mantener solo
   productores/elaboradores dentro del alcance del catálogo.
10. Resolver los cinco geo-warnings iniciales como riesgo temprano. Si la
    coordenada apunta a un municipio real distinto, corregir `municipio`; si es
    un homónimo de centroide, añadir override; no mover coordenadas a ojo.
11. Mantener `slug` estable. Solo desaparece por purga o fusión justificada y
    registrada en evidencia.
12. No enriquecer imágenes en bloque. Tras estabilizar identidad y `slug`, usar
    `npx pnpm enrich:images --provincia cordoba` solo como exploración y aplicar
    por `slug` tras inspección.

## Fuentes de cotejo iniciales

Estas fuentes orientan la búsqueda; no sustituyen la comprobación de una fuente
propia o ficha real cuando la decisión sea `verificado`.

- Consejos reguladores y sellos de aceite cordobés: DOP Baena, DOP Priego de
  Córdoba, DOP Montoro-Adamuz y DOP Aceite de Lucena, más webs de almazaras y
  cooperativas.
- Consejo Regulador Montilla-Moriles: bodegas, lagares, vinagres y vinos
  generosos; como apoyo sectorial, no como prueba de tienda online.
- DOP Los Pedroches y fuentes sectoriales del ibérico: secaderos, fábricas,
  marcas inscritas y fichas oficiales con match de entidad.
- Rute, Puente Genil y Subbética: destilerías, obradores, membrillo, dulces,
  queserías y turismo/comarca como apoyo secundario.
- CAAE, Landaluz, Calidad Certificada y otros registros alimentarios andaluces:
  útiles para existencia, certificación y razón social; por sí solos suelen
  sostener `parcial`.
- Ayuntamientos, mancomunidades, ferias agroalimentarias, prensa local y Google
  Maps: fuentes secundarias para resolver dudas, nunca sustituto único si la
  actividad productora queda materialmente dudosa.
- Webs, tiendas y perfiles oficiales ya presentes en el CSV: primera fuente si
  pertenecen claramente al productor y no a directorios o terceros.

## Plan de ejecución

Lotes agrupados por sector y por fuente compartida. Tamaño objetivo: 13-22 filas.
Los lotes 1-9 cubren el snapshot inicial de 154 filas sin solaparse; el lote 10
es cierre transversal.

1. **Lotes 1-2: Aceite (28 filas).** Crear el JSONL, fijar el estándar de
   evidencia y resolver 3 de los 5 geo-warnings iniciales. Usar DOPs y fuentes
   de almazaras/cooperativas para separar productor, marca y comercializadora.
2. **Lote 3: Bodega, licores y cerveza (17 filas).** Montilla-Moriles, Rute y
   cerveceras artesanas. Confirmar elaboración propia, web oficial y venta remota
   solo si hay tienda o pedido utilizable.
3. **Lotes 4-5: Charcutería (33 filas).** Separar productores/secaderos de
   carnicerías o comercios minoristas; resolver el geo-warning de
   `megustaeljamon...`.
4. **Lote 6: Pan y pastelería (22 filas).** Obradores de Córdoba capital,
   Subbética, Rute y Villanueva; distinguir obrador de despacho.
5. **Lote 7: Lácteos y quesos + miel (21 filas).** Queserías y apícolas con
   fuente propia o registro fiable; aceptar `parcial` cuando solo haya directorio
   o presencia secundaria.
6. **Lote 8: Helados + chocolate (13 filas).** Obrador/fabricación propia frente
   a heladería o chocolatería minorista; revisar venta por ecommerce solo si la
   tienda está viva.
7. **Lote 9: Aceitunas, legumbres, huevos, despensa, aperitivos, fruta y pescado
   (20 filas).** Lote heterogéneo para triaje de productores pequeños,
   distribuidoras y elaboradores; resolver el geo-warning de `granja-ahuevo`.
8. **Lote 10: cierre transversal.** Objetivo: 0 pendientes, evidencia coherente,
   ventas online con canal, deduplicación, geo-warnings resueltos o documentados e
   imágenes sin errores.

## Worklist inicial

Leyenda de estado: `Pendiente`, `En curso`, `Hecho`. Los lotes parten por
categoría y orden actual del CSV; **congela los `slug` al iniciar cada lote**. Si
un lote fusiona o purga filas, recalcula los bloques siguientes antes de
iniciarlos.

| # | Lote | Categorías / alcance | Filas | Pend. | Parcial | Verif. | VO=sí | Estado | Notas iniciales |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | Aceite I | Primeras 14 filas de `Aceite` en orden CSV | 14 | 0 | 0 | 14 | 13 | Hecho | Cerrado 2026-07-01. JSONL creado. 13 ecommerce confirmados; Almazara Adamuz queda `no comprobado`. Corrige web/directorio de Torresur, webs canónicas y municipios de Hacienda Peñillas, Castillo del Valle y Monteoliva. |
| 2 | Aceite II | Resto de `Aceite` | 14 | 0 | 1 | 13 | 10 | Hecho | Cerrado 2026-07-01. Olisur queda `parcial`; 10 nuevos ecommerce/email confirmados; Finca Duernas y Puerto Carretas quedan sin venta remota comprobada. |
| 3 | Bodega, licores y cerveza | `Bodega`, `Licores`, `Cerveza artesana` | 17 | 0 | 1 | 16 | 12 | Hecho | Cerrado 2026-07-01. Bodegas Montes y Compañía queda `parcial`; 12 ventas remotas confirmadas entre tiendas propias y ecommerce. |
| 4 | Charcutería I | Primeras 16 filas de `Charcutería` en orden CSV | 16 | 0 | 2 | 7 | 5 | Hecho | Cerrado 2026-07-01. 7 purgas por tienda/no productor u otra provincia; Familia Moreno se corrige a Villanueva de Córdoba y `megustaeljamon...` a Hinojosa del Duque. |
| 5 | Charcutería II | Resto de `Charcutería` | 17 | 0 | 0 | 16 | 13 | Hecho | Cerrado 2026-07-01. 1 purga (`Nemesio`) por falta de productor; 13 ventas remotas confirmadas y 3 productores quedan `no comprobado`. |
| 6 | Pan y pastelería | `Pan y pastelería` | 22 | 0 | 1 | 20 | 8 | Hecho | Cerrado 2026-07-01. 1 fusión de duplicado (`horno-de-lena-la-tradicion-cordoba` -> `la-tradicion-cordoba`); Pastelería Nati queda `parcial`; 8 ventas remotas confirmadas. |
| 7 | Lácteos, quesos y miel | `Lácteos y quesos`, `Miel` | 21 | 0 | 0 | 19 | 14 | Hecho | Cerrado 2026-07-01. 2 purgas: Miel de San Benito por otra provincia y Miel Valle de los Pedroches por derivar a tienda de material apícola sin productor alimentario actual. 14 ventas remotas confirmadas. |
| 8 | Helados y chocolate | `Helados`, `Chocolate` | 13 | 0 | 0 | 11 | 2 | Hecho | Cerrado 2026-07-01. 2 purgas por cafetería/tienda sin obrador productor: La Fábrica de Chocolate y Sabor a Chocolate. D'Torres queda con WhatsApp y Montalbán con ecommerce. |
| 9 | Varios pequeños | `Aceitunas y encurtidos`, `Legumbres`, `Huevos`, `Despensa artesanal`, `Aperitivos`, `Fruta y verdura`, `Pescado` | 20 | 0 | 3 | 14 | 11 | Hecho | Cerrado 2026-07-01. 2 purgas (`campina-verde...`, `supramar...`) y 1 fusión (`granja-ahuevo-cordoba` -> `productos-moreno...`). Se resuelve el warning de `granja-ahuevo`. |
| 10 | Cierre transversal provincial | Todas | 138 | 0 | 8 | 130 | 88 | Hecho | Córdoba queda cerrada: 0 pendientes, 0 warnings de calidad, evidencia coherente y assets huérfanos retirados. |

## Lote 1 - Aceite I

Revisión de las primeras 14 filas de `Aceite` en orden CSV (2026-07-01).
Resultado: **14 filas activas**, **14 `verificado`**, 0 `parcial`, 0 purgas;
venta online **13 `sí` (todas `ecommerce`)** y 1 `no comprobado`. Crea
`data/evidence/andalucia/cordoba.jsonl` con 14 registros `keep`.

Decisiones relevantes:

- **Venta online confirmada (`ecommerce`)**: Palacios Gutiérrez, Almazara Gómez
  Cano / Caserío de Hornerico, Olivarera Ntra. Sra. de Guadalupe, Saboroliva,
  Aceites Torresur, Alma de Cántaro, Almazaras de la Subbética, OleoGaia, Miluma,
  Hacienda Peñillas, Almazara Castillo del Valle, Hacienda Fuencubierta y
  Monteoliva Cordobesa. Todos quedan con `Canal de venta=ecommerce`.
- **`no comprobado`**: Almazara Adamuz. El dominio heredado redirige al sitio del
  grupo Azzayt, que confirma el centro productivo de Adamuz, pero no se confirmó
  una tienda o pedido remoto directo para consumidor.
- **Correcciones de municipio por geo-warning**: Hacienda Peñillas pasa de
  Córdoba a **Luque**; Almazara Castillo del Valle pasa de Córdoba a
  **Belalcázar**; Monteoliva Cordobesa pasa de Córdoba a **Montilla**. Los `slug`
  quedan estables.
- **Enlace ajeno corregido**: Aceites Torresur tenía como `web` un directorio del
  Ayuntamiento de Bujalance; se sustituye por el dominio productor
  `torrebujalance.com`, que confirma almazara, contacto, ubicación y tienda.
- **Normalizaciones menores**: Almazara Gómez Cano y Almazara Castillo del Valle
  salen del all-caps heredado; varias webs se canonicalizan a HTTPS o raíz
  estable; Alma de Cántaro corrige un Facebook genérico roto.

Snapshot tras lote 1:

- Filas CSV: 154
- Verificación: 14 verificado, 0 parcial, 140 pendiente
- Venta online: 13 sí, 0 no, 141 no comprobado
- Canal de venta informado: 13/13 productores con `Venta online=sí`
- Evidencia Córdoba: 14 registros JSONL
- Calidad Córdoba: 0 errores, 2 warnings; quedan `megustaeljamon...` y
  `granja-ahuevo...` para lotes posteriores.

## Lote 2 - Aceite II

Revisión del resto de `Aceite` (2026-07-01). Resultado: **14 filas activas**,
**13 `verificado`**, **1 `parcial`**, 0 purgas; venta online **10 `sí`** y 4
`no comprobado`. Se añaden 14 registros `keep` al JSONL.

Decisiones relevantes:

- **`parcial`**: Olisur Aceites S.L. No se localizó fuente propia operativa; se
  conserva por registro/directorio y Maps, sin venta remota comprobada.
- **Venta online confirmada**: Renacer, Virgen de la Oliva SAT, Fuenteoliva,
  Juan Colín, Pago Las Monjas, Arteoliva, Oleopalma, Gomeoliva, Cortijo El Canal
  y Las Valdesas. Fuenteoliva queda con canal `email`; el resto, `ecommerce`.
- **`no comprobado`**: Peña de Baena, Finca Duernas y Agrícola Sierra Morena /
  Almazara Puerto Carretas. Hay fuente oficial suficiente para verificar
  identidad y actividad, pero no pedido remoto directo vigente.
- **Normalizaciones**: Pago Las Monjas y Agrícola Sierra Morena salen de nombres
  heredados ruidosos; Renacer, Cortijo El Canal, Finca Duernas y otros dominios
  pasan a URLs canónicas HTTPS cuando corresponde.

## Lote 3 - Bodega, Licores y Cerveza

Revisión de `Bodega`, `Licores` y `Cerveza artesana` (2026-07-01). Resultado:
**17 filas activas**, **16 `verificado`**, **1 `parcial`**, 0 purgas; venta
online **12 `sí`** y 5 `no comprobado`. Se añaden 17 registros `keep`.

Decisiones relevantes:

- **`parcial`**: Bodegas Montes y Compañía. No se encontró canal propio; se
  mantiene por directorio bodeguero y Maps.
- **Venta online confirmada**: Lagar La Primilla, Ruiz Canela, Alvear, Robles,
  La Aurora, Lagar Los Raigones, Bodegas Hathor, Pacharán Tía Arantza, Anís de
  Raza, Destilerías Altamirano, Cervezas Califa y Perro Flaco.
- **`no comprobado`**: Bodegas El Monte, Mil Paladares de la Ñ, Anís Machaquito
  y Cervezas Bandolera. Las fuentes oficiales sostienen identidad y elaboración,
  pero no se confirmó pedido remoto directo.
- **Normalizaciones**: Cooperativa La Aurora pasa a Bodegas La Aurora S.C.A.;
  Anís de Raza y Destilerías Altamirano se acentúan/capitalizan; Bandolera pasa
  de la web cooperativa genérica al dominio de marca.

## Lotes 4-5 - Charcutería

Revisión de las 33 filas iniciales de `Charcutería` (2026-07-01). Resultado:
**25 filas activas**, **23 `verificado`**, **2 `parcial`**, **8 purgas**; venta
online **18 `sí`** y 7 `no comprobado`. Se añaden 56 registros `keep` y 8
tombstones `purge` al JSONL.

Decisiones relevantes:

- **Purgas por no productor**: Carnes y Chacinas MªCarmen Cantarero, El Ermitaño
  del Valle, Jamones Calixto, Jamones Encina de la Dehesa y Jamones y Embutidos
  Nemesio. Las fuentes revisadas apuntan a carnicería/charcutería o tienda sin
  secadero, fábrica u obrador cárnico propio.
- **Purgas por otra provincia**: Chacinas Manuel Castillo, Jamones Faustino
  Prieto y Victoriano Pérez. Eran tiendas o delegaciones en Córdoba de
  productores de Extremadura o Salamanca.
- **`parcial`**: Ibéricos Azoche y Jamones Hetesa. Hay evidencia de identidad y
  actividad suficiente para conservarlos, pero falta una fuente propia/localidad
  productiva completamente cerrada.
- **Correcciones geográficas**: Familia Moreno se corrige de la tienda de
  Córdoba al productor de Villanueva de Córdoba; `megustaeljamon...` se corrige
  a Hinojosa del Duque, resolviendo el warning geográfico.
- **Venta online confirmada**: 18 productores de charcutería quedan con canal
  (`ecommerce` o `marketplace`). Los canales `marketplace` se usan solo cuando
  la venta confirmada es en Diputación Córdoba Shopping.

Snapshot tras lotes 2-5:

- Filas CSV: 146
- Verificación: 66 verificado, 4 parcial, 76 pendiente
- Venta online: 53 sí, 0 no, 93 no comprobado
- Canal de venta informado: 53/53 productores con `Venta online=sí`
- Evidencia Córdoba: 78 registros JSONL
- Calidad Córdoba: 0 errores, 1 warning; queda `granja-ahuevo-cordoba` para el
  lote 9.

## Lote 6 - Pan y Pastelería

Revisión de las 22 filas iniciales de `Pan y pastelería` (2026-07-01).
Resultado: **21 filas activas**, **20 `verificado`**, **1 `parcial`**, **1
fusión**; venta online **8 `sí`** y 13 `no comprobado`. Se añaden 21 registros
`keep` y 1 registro `merge` al JSONL.

Decisiones relevantes:

- **Fusión de duplicado**: `horno-de-lena-la-tradicion-cordoba` se fusiona en
  `la-tradicion-cordoba`. Las fuentes oficiales de La Tradición publican las
  sedes de Manolete y Vista Alegre como el mismo obrador/productor.
- **`parcial`**: Pastelería Artesana Nati. Sabor a Córdoba 2025 la lista con
  producto, contacto y web, pero el dominio publicado devolvía HTTP 500 durante
  la revisión; queda conservada sin fuente propia operativa.
- **Venta online confirmada**: Paulina Martos, Cooperativa Guadajoz, Horno La
  Tradición, Obrador San Rafael, Pastelerías Roldán, Pan El Vacar, Castillo de
  Moriles y La Flor de Rute. El canal es `ecommerce` salvo La Tradición
  (`telefono`) y Pan El Vacar (`marketplace`).
- **Correcciones de localización/enlaces**: Cañadú pasa a Calle Vázquez Aroca;
  Ruano's pasa al Obrador Artesano David Ruano en Rafael de la Hoz Arderius; se
  limpian enlaces sociales genéricos de Dulcisan, Ruano's y Rosypan.
- **Sin purgas de imagen**: la fila fusionada no tenía `imagen`, por lo que no
  genera asset huérfano.

Snapshot tras lote 6:

- Filas CSV: 145
- Verificación: 86 verificado, 5 parcial, 54 pendiente
- Venta online: 61 sí, 0 no, 84 no comprobado
- Canal de venta informado: 61/61 productores con `Venta online=sí`
- Evidencia Córdoba: 100 registros JSONL
- Calidad Córdoba: 0 errores, 1 warning; queda `granja-ahuevo-cordoba` para el
  lote 9.

## Lote 7 - Lácteos, Quesos y Miel

Revisión de `Lácteos y quesos` y `Miel` (2026-07-01). Resultado: **19 filas
activas**, **19 `verificado`**, **2 purgas**; venta online **14 `sí`** y 5
`no comprobado`. Se añaden 19 registros `keep` y 2 tombstones `purge`.

Decisiones relevantes:

- **Queserías verificadas**: El Palancar, Marqués del Valle, Calaveruela, La
  Chacha Sebastiana, Fuente La Sierra, Cortijo La Calzada, Plazuelo y Los
  Balanchares. Se limpian enlaces genéricos heredados y se normalizan webs
  canónicas cuando había tienda propia.
- **Venta online confirmada**: El Palancar, Marqués del Valle, Calaveruela,
  Fuente La Sierra, Plazuelo, Los Balanchares, Reina de la Subbética, Corduba
  Miel, Fuentecillas, Moramiel Oro, Apioliva, Caprichos del Guadalquivir,
  VerdeMiel y Mielinizate.
- **Purgas**: `miel-de-san-benito-el-viso` queda fuera por otra provincia; las
  fuentes localizan Miel de San Benito en Almodóvar del Campo / Valle de
  Alcudia. `miel-valle-de-los-pedroches-pozoblanco` queda fuera porque el
  dominio heredado redirige a Apícola Los Pedroches, tienda de material apícola,
  sin evidencia actual de productor alimentario de miel.
- **Sin imagen huérfana**: se elimina
  `public/productores/andalucia/cordoba/miel-valle-de-los-pedroches-pozoblanco.webp`
  al purgar la fila.

## Lote 8 - Helados y Chocolate

Revisión de `Helados` y `Chocolate` (2026-07-01). Resultado: **11 filas
activas**, **11 `verificado`**, **2 purgas**; venta online **2 `sí`** y 9
`no comprobado`. Se añaden 11 registros `keep` y 2 tombstones `purge`.

Decisiones relevantes:

- **Heladerías verificadas**: Buonisssimo, Cremería di Vaniglia, D'Torres,
  Escoda, Jijona de Córdoba, La Flor de Levante 1934, Nocciolata, Piamonte
  D'Ambrosio, Piacerino y Heladería de Montalbán. Se exige obrador/fabricación
  propia o fuente oficial equivalente, no solo ficha de Maps.
- **Venta online confirmada**: D'Torres por encargos en WhatsApp y Heladería de
  Montalbán por tienda con carrito/pedido.
- **Chocolate**: queda Vescera Délice, verificada por perfil oficial y Sabor a
  Córdoba 2025 como productor de bombones con base de dátil. La venta remota
  queda `no comprobado`.
- **Purgas**: `la-fabrica-de-chocolate-cordoba` y
  `sabor-a-chocolate-cordoba` quedan fuera por no acreditar obrador/productor:
  las fuentes las describen como cafetería o tienda/churrería.

Snapshot tras lotes 7-8:

- Filas CSV: 141
- Verificación: 116 verificado, 5 parcial, 20 pendiente
- Venta online: 77 sí, 0 no, 64 no comprobado
- Canal de venta informado: 77/77 productores con `Venta online=sí`
- Evidencia Córdoba: 134 registros JSONL
- Calidad Córdoba: 0 errores, 1 warning; queda `granja-ahuevo-cordoba` para el
  lote 9 final.

## Lote 9 - Varios Pequeños

Revisión de `Aceitunas y encurtidos`, `Legumbres`, `Huevos`, `Despensa
artesanal`, `Aperitivos`, `Fruta y verdura` y `Pescado` (2026-07-01).
Resultado: **17 filas activas**, **14 `verificado`**, **3 `parcial`**, **2
purgas** y **1 fusión**; venta online **11 `sí`** y 6 `no comprobado`. Se
añaden 17 registros `keep`, 2 tombstones `purge` y 1 registro `merge`.

Decisiones relevantes:

- **Venta online confirmada**: Aceitunas Torrent, Brigantes Benamejí, Productos
  Moreno / Granja Ahuevo, Aceitunas El Rinconcillo, Hermisenda, Legumbres Manuel
  Baena Cañadas, Vega de la Breña, Membrillo San Lorenzo, Snack Adara, Membrillo
  El Quijote y Membrillo La Góndola. Los canales quedan diferenciados entre
  `ecommerce`, `marketplace`, `whatsapp`, `telefono` y `email`.
- **`parcial` por techo de evidencia**: Legumbres Ortiz, Legumbres Manuel Baena
  Cañadas y Aceitunas Lanzas. Se conservan por fuente individual/marketplace o
  directorio fiable, pero sin fuente propia operativa suficiente para cierre
  fuerte.
- **Fusión y geo-warning resuelto**: `granja-ahuevo-cordoba` se fusiona en
  `productos-moreno-granja-a-huevo-castro-del-rio`. Ambas fuentes apuntan a la
  misma unidad de Castro del Río; la fila duplicada era la que arrastraba el
  warning geográfico inicial.
- **Purgas por no productor**: `campina-verde-ecosol-s-l-cordoba`, por ser
  comercializadora/exportadora de frutas y hortalizas ecológicas de terceros, y
  `supramar-pozoblanco`, por ser marisquería/selección y entrega de pescado y
  marisco sin producción o elaboración propia.
- **Correcciones de datos**: Membrillo San Lorenzo corrige la lectura heredada
  de `Guadix` a Ctra. Estepa-Guadix, km 18,3, Puente Genil; La Góndola corrige
  dirección a Bailén 9; Brigantes, Chips by Raquel, Legumbres Baena, Snack Adara
  y otros normalizan contacto y webs canónicas.
- **Sin assets huérfanos**: se eliminan las imágenes de `granja-ahuevo-cordoba`
  y `supramar-pozoblanco` junto con la fila fusionada/purgada.

## Cierre Provincial

Snapshot final tras los lotes 1-9:

- Filas CSV: 138
- Verificación: 130 verificado, 8 parcial, 0 pendiente
- Venta online: 88 sí, 0 no, 50 no comprobado
- Canal de venta informado: 88/88 productores con `Venta online=sí`
- Evidencia Córdoba: 154 registros JSONL
- Calidad Córdoba: 0 errores, 0 warnings
- Imágenes: sin errores ni warnings en `check:images`
- Estado: primera pasada profunda cerrada; futuras tareas pueden centrarse en
  ampliación, mantenimiento de parciales o enriquecimiento selectivo de imágenes.

## Flujo por lote

Detalle completo en `docs/VERIFICATION_TECHNIQUES.md`. Por lote:

1. Proteger el trabajo existente:

   ```bash
   git status --short
   npx pnpm list:province cordoba
   ```

   Acotar con `--categoria` cuando el lote sea sectorial.

2. Congelar los `slug` del lote en el orden actual del CSV.
3. Priorizar: duplicados, enlaces ajenos, no productores y geo-warnings;
   después fuentes propias fáciles; después venta remota.
4. Investigar hasta evidencia suficiente para identidad, actividad productora,
   municipio y venta remota. No perseguir opcionales que no cambian la decisión.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote.
6. Crear o actualizar una línea en `data/evidence/andalucia/cordoba.jsonl` por
   cada fila revisada, purga, fusión, cambio de `verificacion`, cambio de
   `Venta online` o canal. Para filas `verificado`, conservar claims
   `identity`/`producer-activity`/`municipality`, no solo `online-sales`.
7. Validar al iterar:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   ```

8. Cerrar el lote:

   ```bash
   npx pnpm verify:data
   ```

9. Actualizar este ledger con fecha, estado del lote, snapshot si cambia y nota
   corta: verificadas, parciales, purgas/fusiones, ventas resueltas y riesgos
   residuales.

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo pausa explícita documentada.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga o fusión tiene registro
  JSONL tipo `purge` o `merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente; cada `no`/`no comprobado` revisado tiene razón clara cuando sea una
  decisión material.
- No quedan enlaces ajenos, dominios aparcados, URLs inventadas, fichas Maps
  genéricas usadas como prueba fuerte ni horarios que remitan a canales
  inexistentes.
- No quedan duplicados aparentes sin decisión explícita.
- Los 5 geo-warnings iniciales están corregidos o justificados.
- Las imágenes se revisan después de estabilizar identidad y `slug`; ninguna
  fila purgada conserva imagen huérfana.
- `npx pnpm verify:data` pasa antes de considerar cerrada la provincia.
- Cuando las 154 filas iniciales queden cerradas, valorar añadir
  `andalucia/cordoba` a `data/evidence/coverage.json` en el mismo cambio que
  complete la evidencia provincial.

## Decisiones que deben quedar especialmente anotadas

- Promociones a `verificado` sustentadas solo por fuentes no propias: explicar
  por qué la fuente individual es suficientemente fiable.
- `parcial` por techo de evidencia: directorio, registro, prensa o Maps sin
  fuente propia operativa.
- Purgas por no productor, comercio minorista, baja, duplicado, fuera de
  provincia o entidad sin rastro suficiente.
- Cambios de municipio/coordenadas en las 5 filas con geo-warning inicial.
- Aceite: almazara/productor frente a marca, comercializadora o tienda.
- Charcutería: secadero/fábrica/obrador frente a carnicería minorista.
- Pan, helados y chocolate: obrador/fabricación propia frente a despacho,
  cafetería o revendedor.
- Bodega/licores/cerveza: canal propio frente a reventa de terceros.
- Cualquier fila sin web propia que quede `verificado`: fuente concreta que
  sostiene identidad, actividad y municipio.

## Ola 3 · Venta sin resolver (2026-07-29)

- Corte actual: **199 filas** · 177 `verificado` · 22 `parcial` · venta
  136 `sí` · 0 `no` · 63 `no comprobado`.
- Se acreditan nueve canales: ecommerce en Peña de Baena, Anís Machaquito,
  Finca Duernas, Bodegas El Monte, Aceites Vizcántar, Bodegas El Gallo,
  Cervezas Bandolera y Bodegas Delgado; Lagar Blanco publica pedidos por llamada
  o WhatsApp.
- Se sustituyen seis descripciones de plantilla por información productiva
  propia: Peña de Baena, Machaquito, Finca Duernas, El Monte, Bandolera y
  Dulcisan. La cola `descripcion-generica` baja de 87 a 81.
- Bodegas El Gallo se corrige de Montilla a Buen Suceso 3, Córdoba: municipio,
  dirección, coordenadas, contactos y slug. El slug anterior conserva registro
  `merge`; la web propia y el Consejo Regulador sostienen la identidad.
- Aceites Vizcántar y El Gallo pasan a `verificado` al estar de nuevo legibles
  sus fuentes propias. Los bloqueos, mantenimientos y tiendas sin producto
  permanecen en `no comprobado`.

### Tanda CO-V-2 (2026-07-31)

- Se revisan **10 filas** y el corte queda en **198 filas** · 177 `verificado`
  · 21 `parcial` · venta 137 `sí` · 6 `no` · 55 `no comprobado`.
- Se resuelven siete decisiones de venta: Vénoor Délices pasa a `sí`
  (`ecommerce`) y Almazara Adamuz, Legumbres Ortiz, Ibérico de Cardeña, Chips
  by Raquel, Pastrami Romera Martínez y Buonisssimo Gelato pasan a `no` tras
  revisar sus canales propios actuales.
- Vescera Délice se actualiza a **Vénoor Délices**: nuevo slug, marca,
  categoría, gama, web, redes y contactos, conservando un registro `merge`.
  La tienda propia ofrece carrito, precios y envíos 24/48 h.
- Se purga **Bodegas Montes y Compañía** (`not-producer`): la sociedad consta
  como mayorista de vinos y vinagres y la dirección es un punto de venta, sin
  bodega, elaboración propia ni marca productora localizada.
- Se corrige Legumbres Ortiz del número 35 al **55** del polígono El
  Junquillo; Pastrami incorpora teléfono público; Olisur pierde un Instagram
  genérico sin atribución fiable. Ibéricos Azoche y Olisur permanecen en
  `no comprobado` por limitaciones técnicas o ambigüedad del canal.
- Se concretan productos y actividad en nueve fichas. La cola
  `descripcion-generica` baja de **81 a 75** y `venta-sin-resolver` de **63 a
  55**.

### Tanda CO-V-3 (2026-07-31)

- Se revisan **10 filas** y el corte queda en **198 filas** · 176 `verificado`
  · 22 `parcial` · venta 139 `sí` · 12 `no` · 47 `no comprobado`.
- Se confirman dos tiendas propias: **Bodegas Toro Albalá** publica productos,
  precio, stock, carrito y envíos a Península y Baleares; **El Canito** ofrece
  elaborados de caza e ibéricos con carrito y envío a toda España. Ambas pasan
  a `sí` (`ecommerce`).
- Aguilar Sánchez Alimentaria, David Ruano, Legumbres Baena, Carnes Montoro,
  Pérez Barquero y Sucesores de Morales pasan a `no`: sus canales vigentes
  muestran catálogo, puntos físicos o atención profesional, pero no pedido
  remoto directo para consumidor.
- **Mielsico** se corrige de Moriles a Córdoba capital y deja de atribuirse a
  Castillo de Moriles. Cambian slug, dirección, coordenadas, teléfono, correo,
  gama y descripción; el dominio se retira por certificado no válido y portada
  de proveedor. Queda `parcial` y conserva `no comprobado`, con registro
  `merge` desde `mielsico-moriles`.
- David Ruano pierde también su web pública: aunque conserva contenido del
  obrador, está comprometida con enlaces y artículos de casinos ajenos. Se
  mantiene el Instagram propio, se concreta la ficha y se resuelve la venta.
- Cortijo La Calzada incorpora paraje, carretera y gama de quesos; permanece en
  `no comprobado` porque la web devuelve 403 y las referencias de pedido son
  contradictorias. La cola `descripcion-generica` baja de **75 a 73** y
  `venta-sin-resolver` de **55 a 47**.

### Tanda CO-V-4 (2026-07-31)

- Se revisan **10 filas** y el corte queda en **198 filas** · 176 `verificado`
  · 22 `parcial` · venta 141 `sí` · 19 `no` · 38 `no comprobado`.
- **Dulcisan** pasa a `sí` (`telefono`): su página vigente publica literalmente
  dos teléfonos para pedidos y consultas. **Panadería Artesana de Villarrubia**
  pasa a `sí` (`telefono|whatsapp`): ofrece encargos personalizados y enlaza
  ambos mecanismos desde su fuente propia.
- Piamonte D'Ambrosio, Horno de la Cruz, Mil Paladares de la Ñ, Hermanos
  Rodríguez Barbancho, La Chacha Sebastiana, Aceitunas El Mesto y Agrícola
  Sierra Morena–Puerto Carretas pasan a `no`. Sus canales actuales muestran
  servicios, catálogos, distribución profesional o compra física en la finca,
  pero no un pedido remoto directo para consumidor.
- **Nocciolata** conserva `no comprobado`: la web anuncia que su tienda online
  sigue en obras y abrirá próximamente. La indisponibilidad temporal no se
  convierte artificialmente en ausencia de venta.
- Se corrigen el horario oficial de Piamonte y el horario mal formateado de
  Villarrubia; Horno de la Cruz distingue despacho y obrador con sus códigos
  postales; Nocciolata incorpora el segundo local. Las diez fichas ganan gamas
  y textos productivos específicos —marcas, variedades, trayectoria y método—.
  `descripcion-generica` baja de **73 a 68** y `venta-sin-resolver` de **47 a
  38**.

### Tanda CO-V-5 (2026-07-31)

- Se revisan **10 filas** y el corte queda en **198 filas** · 176 `verificado`
  · 22 `parcial` · venta 144 `sí` · 22 `no` · 32 `no comprobado`.
- **Cañadú**, **Horno La Molina** y **Rosypan** pasan a `sí` (`telefono`): los
  dos primeros publican encargos junto a su número y Rosypan añade reparto a
  domicilio y una llamada expresa a encargar por teléfono.
- **La Miga**, **La Catalana 1890** y **Gómez Priego** pasan a `no`. Sus
  perfiles propios muestran respectivamente compra en tienda, puntos de venta
  y ubicación física, pero no tienda, reparto ni instrucciones de pedido
  remoto para consumidor.
- La Piedra Escrita, Jamones Hetesa, Pastelería Nati y Delicias Artesanas Cris
  conservan `no comprobado`: Meta oculta o no aporta actividad utilizable en
  dos casos y los otros dos carecen de canal propio. Una reseña sobre un envío
  de Hetesa no se atribuye como política comercial del productor.
- Se corrige Horno La Molina del número **34 al 36** según su perfil oficial.
  Las diez fichas sustituyen la descripción de plantilla por gama, método,
  trayectoria o servicio concretos: pastelería clásica y origen en 1948,
  productos sin lactosa, jamón de Los Pedroches, pan sin añadidos, pestiños de
  pellizco y reparto local, entre otros. `descripcion-generica` baja de **68 a
  58** y `venta-sin-resolver` de **38 a 32**.
