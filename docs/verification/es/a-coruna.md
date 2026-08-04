# Verificación provincial de A Coruña

Ledger para planificar y reanudar la primera pasada profunda de
`data/csv/galicia/a-coruna.csv`. El CSV es la fuente de verdad y la evidencia
por decisión vive en `data/evidence/galicia/a-coruna.jsonl`.

El procedimiento general es `docs/es/VERIFICATION_TECHNIQUES.md`; este documento
solo fija el snapshot, los riesgos locales y el alcance exacto de cada lote.
Los contratos son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote activo.
2. Confirmar que ninguna fila del lote tiene cambios concurrentes.
3. Investigar primero exclusiones, duplicados y propiedad de enlaces; detenerse
   cuando identidad, actividad productora y municipio tengan evidencia suficiente.
4. Resolver `Venta online` de forma independiente y no perseguir campos
   opcionales que no cambien la decisión.
5. Editar con parser CSV, sustituir o añadir una línea JSONL por decisión y
   actualizar aquí únicamente el resumen del lote y las incidencias reutilizables.
6. Pasar `check:csv:changed`, `check:evidence`,
   `check:evidence:changed` y `git diff --check`. El cierre pasa `verify:data`.

No se tocan filas de otro lote «de paso»: los hallazgos cruzados se anotan para
su lote. Los lotes se recalculan solo después de merges o purgas.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con bloqueo real documentado; `parcial` es un
  resultado final válido cuando la evidencia tiene un techo registral o secundario.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Identidad, municipio, categoría, enlaces y contactos pertenecen al productor;
  los fallos técnicos no se interpretan como cierre.
- Todos los `Venta online=sí|no` están demostrados y los `sí` tienen canal válido.
- No quedan duplicados editoriales ni imágenes huérfanas; evidencia y CSV están
  reconciliados y `pnpm verify:data` termina sin incidencias de A Coruña.
- La provincia se añade a `data/evidence/coverage.json` solo al cerrar la pasada.

## Estado

- Inicio: **2026-07-12**. Modo: primera pasada profunda de las 173 filas
  heredadas; no añadir candidatos nuevos hasta el cierre transversal.
- Snapshot inicial: **173 filas**; **166 `pendiente`, 5 `parcial`, 2
  `verificado`**. Las siete filas no pendientes también se reauditan.
- Venta online inicial: **1 `sí`, 1 `no`, 171 `no comprobado`**. Ambas decisiones
  resueltas pertenecen a altas recientes y se revalidan con su evidencia.
- Categorías principales: Pan y pastelería 55; Lácteos y quesos 26; Fruta y
  verdura 21; Pescado 14; Bodega 8; Charcutería 7; Café, Helados y Miel 6 cada
  una; Chocolate 5; Conservas 4; y 15 filas en categorías menores.
- Cobertura inicial: web 124/173, Instagram 103/173, Facebook 17/173, Google
  Maps 173/173, teléfono 162/173, correo 53/173, coordenadas 144/173 e imagen
  105/173. Las imágenes no se enriquecen durante la pasada; solo se retiran o
  renombran al purgar, fusionar o corregir un slug.
- Evidencia inicial: 7 `keep`, todos de altas del 2026-07-10. No hay `merge` ni
  `purge`. A Coruña no figura todavía en `data/evidence/coverage.json`.
- Calidad estructural inicial: contrato y auditoría de calidad sin errores ni
  avisos para A Coruña.
- Tras AC-01 (2026-07-12): **162 filas**; **150 `pendiente`, 6 `parcial`, 6
  `verificado`**. El lote resolvió sus 16 fichas como 4 verificadas, 1 parcial,
  10 purgas industriales y 1 merge. Venta online: 3 `sí`, 3 `no` y 156 `no
  comprobado`. Evidencia acumulada: 12 `keep`, 10 `purge` y 1 `merge`. Se
  retiraron siete imágenes huérfanas; quedan 98 activos provinciales.
- Tras AC-02 (2026-07-12): **161 filas**; **135 `pendiente`, 9 `parcial`, 17
  `verificado`**. El lote resolvió sus 15 fichas como 11 verificadas, 3
  parciales y 1 purga, con 2 merges de slug por identidad o municipio. Venta
  online: 13 `sí`, 3 `no` y 145 `no comprobado`. Evidencia acumulada: 26
  `keep`, 11 `purge` y 3 `merge`. Se retiró la imagen de Casa Nordés y se
  renombró la de La Despensa D'Lujo; quedan 97 activos provinciales.
- Tras AC-03 (2026-07-12): **156 filas**; **122 `pendiente`, 11 `parcial`, 23
  `verificado`**. El lote resolvió sus 13 fichas como 6 verificadas, 2
  parciales y 5 purgas por marca duplicativa, gran grupo o comercialización sin
  producción propia. Venta online: 16 `sí`, 6 `no` y 134 `no comprobado`.
  Evidencia acumulada: 34 `keep`, 16 `purge` y 3 `merge`. Se retiraron cuatro
  imágenes huérfanas; quedan 93 activos provinciales.
- Tras AC-04 (2026-07-12): **156 filas**; **110 `pendiente`, 12 `parcial`, 34
  `verificado`**. Las 12 fichas del lote se conservaron: 11 verificadas y Carmen
  Quesos parcial por techo registral. Venta online: 21 `sí`, 12 `no` y 123 `no
  comprobado`; cinco canales directos nuevos quedaron resueltos. Evidencia
  acumulada: 46 `keep`, 16 `purge` y 3 `merge`. No hubo cambios de imágenes.
- Tras AC-05 (2026-07-12): **156 filas**; **102 `pendiente`, 10 `parcial`, 44
  `verificado`**. Las 15 fichas se conservaron: 12 verificadas y 3 parciales,
  sin purgas. Venta online: 28 `sí`, 14 `no` y 114 `no comprobado`; siete
  canales remotos nuevos quedaron resueltos. Evidencia acumulada: 54 `keep`,
  16 `purge` y 3 `merge`. No hubo cambios de imágenes.
- Tras AC-06 (2026-07-13): **156 filas**; **91 `pendiente`, 16 `parcial`, 49
  `verificado`**. Las 11 fichas se conservaron: 5 verificadas y 6 parciales,
  sin purgas. Venta online: 31 `sí`, 15 `no` y 110 `no comprobado`; se
  resolvieron tres ventas remotas y una ausencia de canal. Evidencia acumulada:
  65 `keep`, 16 `purge` y 4 `merge`. No hubo cambios de imágenes.
- Tras AC-07 (2026-07-13): **155 filas**; **76 `pendiente`, 22 `parcial`, 57
  `verificado`**. El lote resolvió sus 15 fichas como 8 verificadas, 6
  parciales y 1 purga por producción fuera de la provincia, con 2 correcciones
  de slug y municipio. Venta online: 34 `sí`, 17 `no` y 104 `no comprobado`;
  quedaron acreditados tres ecommerce y dos ausencias de canal. Evidencia
  acumulada: 79 `keep`, 17 `purge` y 6 `merge`. Se retiró la imagen de Avícola
  Tratante; quedan 92 activos provinciales.
- Tras AC-08 (2026-07-13): **152 filas**; **63 `pendiente`, 22 `parcial`, 67
  `verificado`**. Las 13 fichas iniciales se resolvieron en 10 verificadas, 2
  purgas y 1 consolidación duplicativa, además de una corrección de slug y
  municipio. Venta online: 41 `sí`, 20 `no` y 91 `no comprobado`; se
  acreditaron cinco ecommerce, tres suscripciones y dos pedidos por WhatsApp.
  Evidencia acumulada: 89 `keep`, 19 `purge` y 8 `merge`. Se retiraron tres
  imágenes y se renombró la de Café Veracruz; quedan 89 activos provinciales.
- Tras AC-09 (2026-07-13): **152 filas**; **52 `pendiente`, 23 `parcial`, 77
  `verificado`**. Las 11 fichas se conservaron: 10 verificadas y Chocolates
  Mariño parcial por techo institucional, sin purgas ni merges. Venta online:
  50 `sí`, 21 `no` y 81 `no comprobado`; se acreditaron cinco ecommerce, tres
  marketplaces y un canal de pedidos por correo. Evidencia acumulada: 100
  `keep`, 19 `purge` y 8 `merge`. No hubo cambios de imágenes.
- Tras AC-10 (2026-07-13): **148 filas**; **39 `pendiente`, 25 `parcial`, 84
  `verificado`**. Las 13 fichas iniciales se resolvieron en 7 verificadas, 2
  parciales, 2 purgas y 2 consolidaciones, además de una corrección de slug y
  municipio. Venta online: 53 `sí`, 25 `no` y 70 `no comprobado`; quedaron
  acreditados un ecommerce, dos pedidos por teléfono y uno por correo.
  Evidencia acumulada: 109 `keep`, 21 `purge` y 11 `merge`. Se retiraron tres
  imágenes duplicadas o huérfanas y se renombró la de La Nueva; quedan 86
  activos provinciales.
- Tras AC-11 (2026-07-13): **148 filas**; **26 `pendiente`, 26 `parcial`, 96
  `verificado`**. Las 13 fichas se conservaron: 12 verificadas y Panadería
  Tarrío parcial por techo secundario, con una corrección de slug y municipio
  para Gestal. Venta online: 60 `sí`, 29 `no` y 59 `no comprobado`; quedaron
  acreditados tres ecommerce, dos marketplaces y dos pedidos telefónicos.
  Evidencia acumulada: 122 `keep`, 21 `purge` y 12 `merge`. No hubo cambios de
  imágenes; quedan 86 activos provinciales.
- Tras AC-12 (2026-07-13): **148 filas**; **13 `pendiente`, 27 `parcial`, 108
  `verificado`**. Las 13 fichas se conservaron: 12 verificadas y Panadería
  Vázquez parcial por techo secundario. A Maquía, Xallas, San José y Lenatt se
  corrigieron desde tiendas o domicilios sociales a sus obradores reales, con
  cuatro slugs e imágenes renombrados. Venta online: 67 `sí`, 31 `no` y 50 `no
  comprobado`; quedaron acreditados cinco ecommerce, un teléfono y un WhatsApp. Evidencia
  acumulada: 135 `keep`, 21 `purge` y 16 `merge`. Se mantienen 86 imágenes
  activas provinciales.
- Tras AC-13 (2026-07-13): **148 filas**; **0 `pendiente`, 28 `parcial`, 120
  `verificado`**. Las 13 fichas se conservaron: 12 verificadas y Melanger
  parcial por el cierre de su tienda física y la continuidad productiva en
  ferias sin ubicación estable confirmada. Mantecados das Pontes se normalizó a
  Pastelería Artesana Mari con `merge` histórico. Venta online: 71 `sí`, 39
  `no` y 38 `no comprobado`; quedaron acreditados dos ecommerce, un canal por
  teléfono y correo y un marketplace. Evidencia acumulada: 148 `keep`, 21
  `purge` y 17 `merge`. No hubo cambios de imágenes; se mantienen 86 activos
  provinciales.
- Tras AC-14 (2026-07-13): **148 filas**; **0 `pendiente`, 28 `parcial`, 120
  `verificado`**. Se releyeron las 28 decisiones parciales y se mantuvieron sus
  techos de evidencia; las 148 filas conservadas tienen un `keep` vigente.
  Venta online: 72 `sí`, 38 `no` y 38 `no comprobado`; Do Pincho pasa a pedido
  telefónico por reparto actual. Se auditaron las 99 webs activas, se corrigió
  el dominio canónico de A Factoría do Lume y se retiró el enlace TLS roto de
  Conservas Ría de Arosa. Essenzo Cacao se fijó en la dirección institucional
  vigente de Rúa Amparo López Jean 2. La imagen duplicada de Bico de Xeado se
  retiró de Granxa O Cancelo; quedan 85 imágenes activas, sin hashes repetidos.
  Evidencia acumulada: 148 `keep`, 21 `purge` y 17 `merge`.
- Tras AC-15 (2026-07-15): puerta final cerrada con las **148 filas** y sus
  decisiones reconciliadas una a una contra evidencia: **120 `verificado`, 28
  `parcial` y 0 `pendiente`**; venta remota: **72 `sí`, 38 `no` y 38 `no
  comprobado`**. La provincia entra en cobertura estricta y `verify:data`
  termina sin incidencias de contrato, imágenes o evidencia.

## Reglas y riesgos locales

1. Separar unidad productiva, sede social, tienda y marca. El municipio es el
   de elaboración; una corrección material de identidad o municipio exige slug,
   imagen y `merge` desde el slug histórico.
2. Grandes grupos y cooperativas no se excluyen por tamaño de forma automática:
   aplicar el alcance editorial vigente y documentar la razón si se purgan. Son
   prioritarios Estrella Galicia, Frinsa, Jealsa, Calvo, Congalsa, Cerdeimar,
   Feiraco, Aira, Xallas y Ruta Xacobea/TGT.
3. Las DOP Queixo Tetilla y Arzúa-Ulloa confirman lo que publique su registro,
   pero por sí solas suelen dejar la fila en `parcial`. Distinguir razón social,
   fábrica y marca comercial.
4. En pescado y conservas, una comercializadora, importadora o distribuidora no
   entra sin elaboración propia provincial demostrada.
5. En panadería, pastelería, café, helado y charcutería, una tienda o cafetería
   no basta: debe acreditarse obrador o elaboración propia dentro del alcance.
6. En huerta, miel y huevos, una explotación o asociación puede confirmar
   producción, pero los directorios de terceros no prueban actividad actual ni
   venta online.
7. Reventa por comercios independientes no demuestra venta online del productor.
   Revisar carrito/pedido usable o canal propio/colectivo oficial actual.
8. Un fallo HTTP, TLS, DNS, bloqueo o timeout no prueba cierre. Las purgas por
   cierre o inexistencia necesitan contraste suficiente.

### Colisiones iniciales que no implican merge automático

- `bico-de-xeado-bergondo` y `granxa-o-cancelo-mino` comparten dominio; resolver
  si son marca y explotación de una misma unidad o actividades distinguibles.
- `oxoco-pontedeume` y `panaderia-patricio-pontedeume` comparten teléfono.
- `sabor-galego-sigueiro` y `postres-xacobe-sigueiro` comparten teléfono.
- `casa-beade-paderne` y `conexion-mandeo-paderne` comparten coordenadas.
- La nota de candidatos identifica `alimentos-ruta-xacobea-o-pino` como posible
  planta del Grupo TGT y pide revisar su alcance.

## Fuentes de cotejo

- Sitio, tienda, red social o ficha Maps gestionada por el productor.
- Consejos reguladores de Queixo Tetilla, Arzúa-Ulloa y las figuras vinícolas o
  agroalimentarias que correspondan, limitando los claims a lo publicado.
- Xunta/AGACAL, concellos, diputación, registros sanitarios o ecológicos y
  directorios institucionales como apoyo, no como prueba automática de venta.
- Fuentes mercantiles y prensa fiable solo para contradicciones, sucesiones,
  cierres, propiedad de grupos o ausencia de canal propio difícil de demostrar.

## Worklist

Tamaño objetivo: 12–16 filas. El lote 1 resuelve riesgos transversales antes de
que sus filas contaminen los bloques por categoría.

| Lote | Alcance | Filas iniciales | Estado | Riesgo principal |
|---:|---|---:|---|---|
| AC-00 | Higiene, snapshot y partición | 173 | ✅ 2026-07-12 | Estructura limpia; 4 colisiones y 10 grupos prioritarios |
| AC-01 | Grupos, alcance y colisiones | 16→5 | ✅ 2026-07-12 | 4 verificadas, 1 parcial, 10 purgas y 1 merge |
| AC-02 | Bebidas, bodega y despensa | 15→14 | ✅ 2026-07-12 | 11 verificadas, 3 parciales, 1 purga y 2 merges |
| AC-03 | Pescado y conservas residuales | 13→8 | ✅ 2026-07-12 | 6 verificadas, 2 parciales y 5 purgas; 3 ventas remotas |
| AC-04 | Lácteos y quesos A | 12 | ✅ 2026-07-12 | 11 verificadas, 1 parcial y 5 ventas directas |
| AC-05 | Lácteos B + miel | 15 | ✅ 2026-07-12 | 12 verificadas, 3 parciales y 7 ventas remotas |
| AC-06 | Huerta A | 11 | ✅ 2026-07-13 | 5 verificadas, 6 parciales, 1 merge y 3 ventas remotas |
| AC-07 | Huerta B + huevos + aromáticas | 15→14 | ✅ 2026-07-13 | 8 verificadas, 6 parciales, 1 purga, 2 merges y 3 ecommerce |
| AC-08 | Charcutería + café | 13→10 | ✅ 2026-07-13 | 10 verificadas, 2 purgas, 1 consolidación y 1 slug corregido |
| AC-09 | Chocolate, helados y preparados | 11 | ✅ 2026-07-13 | 10 verificadas, 1 parcial y 9 ventas remotas |
| AC-10 | Pan y pastelería A | 13→9 | ✅ 2026-07-13 | 7 verificadas, 2 parciales, 2 purgas, 2 consolidaciones y 1 slug corregido |
| AC-11 | Pan y pastelería B | 13 | ✅ 2026-07-13 | 12 verificadas, 1 parcial, 7 ventas remotas y 1 slug corregido |
| AC-12 | Pan y pastelería C | 13 | ✅ 2026-07-13 | 12 verificadas, 1 parcial y 4 obradores geográficos corregidos |
| AC-13 | Pan y pastelería D | 13 | ✅ 2026-07-13 | 12 verificadas, 1 parcial y 1 identidad corregida |
| AC-14 | Reconciliación provincial | residual | ✅ 2026-07-13 | 28 parciales revalidadas, 99 webs y 85 imágenes auditadas |
| AC-15 | Puerta final | provincia | ✅ 2026-07-15 | `verify:data` y cobertura estricta completas |

## Alcance exacto

### AC-01 · Grupos, alcance y colisiones (16)

`hijos-de-rivera-estrella-galicia-a-coruna`, `frinsa-ribeira`,
`jealsa-rianxeira-boiro`, `grupo-calvo-carballo`,
`congalsa-a-pobra-do-caraminal`, `grupo-cerdeimar-camarinas`, `feiraco-ames`,
`aira-melide`, `cooperativa-xallas-santa-comba`,
`alimentos-ruta-xacobea-o-pino`, `bico-de-xeado-bergondo`,
`granxa-o-cancelo-mino`, `oxoco-pontedeume`,
`panaderia-patricio-pontedeume`, `sabor-galego-sigueiro`,
`postres-xacobe-sigueiro`.

### AC-02 · Bebidas, bodega y despensa (15)

`licores-berrimes-lousame`, `casa-nordes-vedra`, `adega-valdes-vedra`,
`pazo-de-galegos-vedra`, `adegas-bordel-abegondo`,
`bodega-eduardo-rilo-bergondo`, `adega-lorenzo-bescansa-betanzos`,
`pagos-de-brigante-betanzos`, `casa-beade-paderne`,
`conexion-mandeo-paderne`, `lutega-abegondo`, `val-do-traba-noia`,
`bonilla-a-la-vista-arteixo`, `porto-muinos-cerceda`,
`la-despensa-dlujo-carballo`.

### AC-03 · Pescado y conservas residuales (13)

`conservas-escuris-a-pobra-do-caraminal`, `pescados-loureda-a-coruna`,
`stolt-sea-farm-carnota`, `percebemar-a-coruna`,
`conservas-la-pureza-carino`, `catrineta-conservera-outes`,
`conservas-ria-de-arosa-a-pobra-do-caraminal`, `conservas-cortizo-rianxo`,
`conservas-boya-camarinas`, `a-pementeira-padron`,
`as-camposeiras-oleiros`, `mesquiteira-santiago`, `tofu-landeira-cambre`.

### AC-04 · Lácteos y quesos A (12)

`queixeria-barral-arzua`, `queizuar-queserias-bama-touro`, `galmesan-arzua`,
`queinaga-curtis`, `casa-grande-de-xanceda-mesia`,
`cooperativa-campo-capela-a-capela`, `queixos-moeche`,
`lacteos-terra-de-melide`, `queseria-brexeo-sobrado`, `carmen-quesos-arzua`,
`queserias-del-eume-as-pontes`, `queseria-de-mi-tierra-carballo`.

### AC-05 · Lácteos y quesos B + miel (15)

`granxa-ameixeira-oza-cesuras`, `granxa-cagiao-paderne`,
`bo-queixo-boqueixon`, `queixos-brigantia-as-somozas`,
`queixos-verbas-arzua`, `lacteos-breton-irixoa`,
`lacteos-o-casal-san-sadurnino`, `queixo-fresco-sillobre-fene`,
`granxa-louran-monfero`, `o-enredo-do-abelleiro-arzua`, `erica-mel-arzua`,
`casa-do-mel-as-pontes`, `apicola-abellamel-a-pobra-do-caraminal`,
`apigal-porto-do-son`, `apia-natura-oza-cesuras`.

### AC-06 · Huerta A (11)

`horta-da-lousa-cerceda`, `os-biosbardos-cambre`,
`la-huerta-de-antia-oza-cesuras`, `acastrexa-cambre`,
`granxas-de-lousada-irixoa`, `finca-o-castelo-abegondo`,
`frutas-geixade-abegondo`, `terras-de-bordel-abegondo`,
`horta-millarada-arteixo`, `a-horta-de-ana-carral`,
`a-horta-do-monte-carral`.

### AC-07 · Huerta B + huevos + aromáticas (15)

`agrodayca-coiros`, `a-horta-de-sueirina-curtis`, `finca-bouzon-curtis`,
`horta-daterra-mino`, `a-horta-de-porta-oleiros`, `lua-de-dexo-oleiros`,
`labrecos-oza-cesuras`, `enflor-paderne`, `seitura-paderne`,
`leirinas-de-uz-sada`, `avicola-tratante-naron`,
`granxa-o-caxigo-cerdido`, `orballo-paderne`,
`a-factoria-do-lume-naron`, `agrecogaliza-bergondo`.

### AC-08 · Charcutería + café (13)

`garcia-candal-a-coruna`, `pio-do-saleiro-a-coruna`, `carnicosa-a-coruna`,
`carnicas-anzo-santiago`, `carnes-y-embutidos-hercules-a-coruna`,
`productos-carnicos-dominguez-vimianzo`, `sadepor-a-coruna`,
`cafes-siboney-a-coruna`, `waco-coffee-a-coruna`,
`cafe-veracruz-arteixo`, `cafes-lua-carballo`, `onda-cafe-a-coruna`,
`dona-barbara-obrador-a-coruna`.

### AC-09 · Chocolate, helados y preparados (11)

`teoata-chocolate-santiago`, `late-late-chocolate-a-coruna`,
`chocolates-marino-carballo`, `essenzo-cacao-culleredo`,
`helados-la-ibi-a-coruna`, `heladeria-colon-a-coruna`,
`heladeria-puerta-real-a-coruna`, `xearte-brigitte-santiago`,
`the-bio-factory-a-coruna`, `lume-alimentacion-a-coruna`,
`legumbres-morgade-carballo`.

### AC-10 · Pan y pastelería A (13)

`pan-da-moa-santiago`, `horno-sanbrandan-a-coruna`,
`panaderia-da-cunha-carral`, `grupo-da-cunha-carral`,
`panificadora-german-neda`, `a-tafona-do-preguntoiro-santiago`,
`pastelaria-la-perla-santiago`, `dulcepan-a-coruna`, `do-pincho-carral`,
`panaderia-la-nueva-de-neda-ferrol`, `a-balsa-laracha`,
`o-corrosco-do-pan-a-coruna`, `obrador-san-francisco-a-coruna`.

### AC-11 · Pan y pastelería B (13)

`migas-a-coruna`, `pasteleria-naya-culleredo`, `confiteria-berna-a-coruna`,
`tartitis-santiago`, `sancosa-piedras-de-santiago`, `habaziro-a-coruna`,
`delicias-coruna-as-pontes`, `tahona-a-coruna`, `panaderia-tarrio-melide`,
`panaderia-carral-o-burgo`, `pandelino-a-coruna`, `o-pettit-a-coruna`,
`panaderia-gestal-a-coruna`.

### AC-12 · Pan y pastelería C (13)

`panaderia-vazquez-a-coruna`, `a-maquia-oleiros`, `panadaria-xallas-ames`,
`panaderia-puente-ferrol`, `confiteria-gascon-ferrol`,
`pasteleria-valencia-ultramar-ferrol`,
`panaderia-pasteleria-san-jose-padron`, `confiteria-flory-a-coruna`,
`tartas-lestedo-boqueixon`, `algareira-vimianzo`,
`d-casa-dubraseda-noia`, `lenatt-a-coruna`, `mama-teresa-doces-arzua`.

### AC-13 · Pan y pastelería D (13)

`maruxas-de-nata-san-sadurnino`, `melanger-pasteleria-betanzos`,
`mantecados-das-pontes-as-pontes`, `viuda-domingo-lopez-as-pontes`,
`panaderia-tonita-as-pontes`, `primicias-raina-vilasantar`,
`amasarte-a-coruna`, `farinarium-a-coruna`, `horno-san-amaro-ferrol`,
`panaderia-agra-a-coruna`, `olivella-cakes-a-coruna`,
`arca-do-millo-a-coruna`, `the-vanessa-bakery-a-coruna`.

## Registro de avance

| Lote | Fecha | Resultado | Validación |
|---|---|---|---|
| AC-00 | 2026-07-12 | Snapshot, riesgos y partición completa de la provincia | CSV sin cambios; calidad inicial OK |
| AC-01 | 2026-07-12 | 4 verificadas, 1 parcial, 10 purgas industriales y Sabor Galego→Casa Xacobe | CSV + evidence + images OK |
| AC-02 | 2026-07-12 | 11 verificadas, 3 parciales, 1 purga industrial, 2 slugs corregidos y 10 ventas remotas | CSV + evidence + images OK |
| AC-03 | 2026-07-12 | 6 verificadas, 2 parciales, 5 purgas y 3 ventas ecommerce | CSV + evidence + images OK |
| AC-04 | 2026-07-12 | 11 verificadas, 1 parcial, 0 purgas y 5 ventas directas | CSV + evidence + images OK |
| AC-05 | 2026-07-12 | 12 verificadas, 3 parciales, 0 purgas y 7 ventas remotas | CSV + evidence + images OK |
| AC-06 | 2026-07-13 | 5 verificadas, 6 parciales, 0 purgas, Horta de Aranga→Terras de Bordel y 3 ventas remotas | CSV + evidence + images OK |
| AC-07 | 2026-07-13 | 8 verificadas, 6 parciales, 1 purga, 2 slugs corregidos y 3 ecommerce | CSV + evidence + images OK |
| AC-08 | 2026-07-13 | 10 verificadas, 2 purgas, García Candal→Pío do Saleiro y Café Veracruz→Arteixo | CSV + evidence + images OK |
| AC-09 | 2026-07-13 | 10 verificadas, 1 parcial, 0 purgas y 9 ventas remotas | CSV + evidence + images OK |
| AC-10 | 2026-07-13 | 7 verificadas, 2 parciales, 2 purgas, Da Cunha y La Perla consolidadas y La Nueva corregida a Neda | CSV + evidence + images OK |
| AC-11 | 2026-07-13 | 12 verificadas, 1 parcial, 0 purgas, 7 ventas remotas y Gestal corregida a Arteixo | CSV + evidence + images OK |
| AC-12 | 2026-07-13 | 12 verificadas, 1 parcial, 0 purgas, 7 ventas remotas y 4 obradores geográficos corregidos | CSV + evidence + images OK |
| AC-13 | 2026-07-13 | 12 verificadas, 1 parcial, 0 purgas, 4 ventas remotas y Mantecados das Pontes→Artesana Mari | CSV + evidence + images OK |
| AC-14 | 2026-07-13 | Reconciliación de 148 keeps, 28 parciales, 99 webs, dedup, geo, ventas e imágenes | CSV + evidence + images + data quality OK |

### Hallazgos AC-01

- Bico de Xeado (planta de helados en Bergondo) y Granxa O Cancelo (granja
  lechera en Miño) son unidades productivas distintas de la misma cooperativa;
  ambas se conservan verificadas.
- OXÓCO y Panadería Patricio comparten dirección, pero son obradores distintos.
  Se corrigieron sus teléfonos y contactos; OXÓCO vende por ecommerce y Patricio
  reparte pedidos por teléfono en el área de Pontedeume.
- Sabor Galego y Casa Xacobe son dos marcas de Postres Caseros SL en el mismo
  obrador de Sigüeiro. Se consolidaron en `postres-xacobe-sigueiro`, parcial
  porque sus dos dominios no resuelven y solo quedan fuentes institucionales.
- Estrella Galicia, Frinsa, Jealsa, Nauterra/Calvo, Congalsa, Cerdeimar,
  Feiraco/CLUN, AIRA y Ruta Xacobea/TGT se purgaron como grandes grupos
  industriales. Cooperativa Xallas se purgó porque su actividad acreditada es
  servicio ganadero, pienso, almacén y economato, no elaboración alimentaria
  humana propia.
- `conservas-boya-camarinas`, incluida en AC-03, es una marca de Cerdeimar y
  debe resolverse allí contra la purga del grupo, sin mantener un duplicado de
  marca industrial.

### Hallazgos AC-02

- Casa Nordés se purgó como centro productivo y de visitas de Osborne, gran
  grupo industrial fuera del alcance provincial aplicado en AC-01.
- El dominio histórico de Pazo de Galegos fue reutilizado como blog de viajes
  y juego. Se retiró el enlace ajeno; la bodega queda `parcial` con fuentes
  sectoriales actuales y venta no comprobada.
- Bodega Eduardo Rilo se normalizó a `bodegas-rilo-bergondo`, identidad pública
  de la tercera generación, con tienda propia operativa.
- La Despensa D'Lujo se corrigió de la antigua dirección comercial de Carballo
  a su explotación y sede de Coristanco: nuevo slug, categoría `Legumbres`,
  contacto, coordenadas honestas de localidad e imagen renombrada.
- Casa Beade y Conexión Mandeo comparten sede y administrador, pero son
  sociedades y proyectos vinícolas distintos. Casa Beade queda verificada;
  Conexión Mandeo, parcial por falta de canal propio y actividad reciente
  suficientemente fuerte.
- LUTEGA no elabora cerveza: se recategorizó como `Aromáticas y condimentos`.
  La cooperativa cultiva y procesa lúpulo y admite pedidos o reservas de cosecha
  por teléfono y correo.

### Hallazgos AC-03

- Escurís y Boya se purgaron como marcas de Jealsa y Cerdeimar, respectivamente:
  mantenerlas habría duplicado los grupos industriales ya excluidos en AC-01.
  Stolt Sea Farm también queda fuera de alcance como división acuícola global
  del grupo cotizado Stolt-Nielsen.
- Percebemar se purgó porque su propia web lo sitúa como comprador en lonja y
  tienda de capturas ajenas. Catrineta se purgó como marca comercial: selecciona
  y encarga producto a conserveras artesanas, pero sus fundadores no elaboran.
- Pescados Loureda sí aporta transformación alimentaria real —selección,
  despiece y porcionado de pescado fresco— en una microempresa local. Queda
  verificada, aunque su canal es B2B y no admite venta remota minorista.
- La Pureza, Cortizo y A Pementeira mantienen ecommerce propio operativo. As
  Camposeiras y Tofu Landeira quedan verificadas con venta online `no`: sus webs
  vigentes remiten a puntos físicos o contacto, sin carrito ni pedido remoto.
- Conservas Ría de Arosa se conserva como fábrica gallega diferenciada de
  Conservas Ortiz, acreditada en el registro sanitario actual. Queda `parcial`
  porque el dominio dedicado falla y no hay canal propio comprobable.
  Mesquiteira también queda `parcial`: el registro de Artesanía Alimentaria y
  suministros institucionales recientes prueban actividad, pero falta una fuente
  propia actual.

### Hallazgos AC-04

- `Queizuar / Queixerías Bama` no era una mezcla accidental: la relación de
  expositores de la Festa do Queixo 2026 identifica a Queizuar SL como
  Queixerías Bama, y ambas webs comparten fábrica y teléfono. Se conserva la
  identidad conjunta y se registra pedido directo por `email`.
- Casa Grande de Xanceda, Campo Capela y Terra de Melide mantienen ecommerce
  propio con productos disponibles y carrito. Brexeo documenta la tramitación
  de pedidos y contacto directo por teléfono o correo.
- Barral, Galmesán, Queinaga, Lácteos de Moeche, Queserías del Eume y Quesería
  de Mi Tierra quedan con venta online `no`: sus webs son catálogos o páginas de
  contacto sin compra minorista. La antigua página «Tienda» de Barral conserva
  un módulo WooCommerce vacío y remite a puntos de venta físicos.
- Carmen Quesos se conserva `parcial`: el directorio vigente de Artesanía
  Alimentaria prueba elaboración de derivados lácteos, dirección y contacto,
  pero no se localizó una fuente propia actual que concrete catálogo o canal.
- Se corrigieron la fábrica de Lácteos de Moeche a Abade, el teléfono vigente de
  Quesería de Mi Tierra y los contactos de todo el bloque. Queserías del Eume y
  Mi Tierra reciben coordenadas honestas de núcleo/calle al no disponer de un
  punto de portal público verificable.

### Hallazgos AC-05

- Verbas y Lácteos Bretón superan el techo parcial de sus altas recientes: sus
  webs propias completas acreditan elaboración y catálogo. Verbas mantiene
  ecommerce; Bretón solo documenta distribución en comercios y queda con venta
  online `no`.
- Granxa Lourán sigue activa pese a la contradicción mercantil heredada. Su
  perfil propio, la feria de 2026 y el escaparate de Seitura 22 acreditan el
  Requeixo Restrebas y su venta mediante el marketplace colectivo oficial.
- O Enredo do Abelleiro, Erica Mel, Abellamel, Apigal y APIA Natura mantienen
  tiendas propias operativas. Se actualizaron HTTPS, contactos y direcciones
  cuando la fuente oficial era más precisa.
- Casa do Mel se describe ahora como asociación y servicio colectivo apícola,
  no como productor individual. Queda `parcial`: existe un proyecto público de
  extracción y envasado, pero no se acreditó todavía un producto colectivo
  actual ni un canal de venta remoto.
- Bo-Queixo y Queixo Fresco Sillobre también quedan `parcial`: registros,
  ferias y prensa reciente confirman actividad, pero no se localizó fuente
  propia verificadora. Granxa Ameixeira sí se verifica por su perfil propio y
  certificación ecológica, aunque su venta al consumidor sigue no comprobada.
- Granxa Cagiao se corrige de la dirección heredada de Sartaña a Medín 19, con
  correo y coordenadas del núcleo. Su presencia actual acredita tienda física y
  distribución, sin pedido remoto.

### Hallazgos AC-06

- Horta da Lousa se amplía a `Fruta, verdura y granja`: su actividad actual
  combina huerta y vivero ecológicos con Ternera Gallega Suprema. La web propia
  es informativa y no ofrece compra ni pedido remoto, por lo que queda
  verificada con venta online `no`.
- Os Biosbardos mantiene una tienda propia con carrito, recogida y envío
  peninsular. Se corrigieron el teléfono heredado, el correo, el perfil de
  Instagram y el código postal publicado en su contacto actual.
- Acastrexa no es una explotación hortícola genérica, sino un obrador artesano
  de conservas, mermeladas, condimentos y repostería. Se recategorizó y se
  registró su escaparate de la cooperativa POD como `marketplace`.
- Finca O Castelo sigue recibiendo pedidos semanales por WhatsApp y repartiendo
  a particulares. Se registra `telefono`, se añade su Facebook propio y se
  retira el dominio heredado, que falla por TLS. Granxas de Lousada también
  queda verificada por actividad ecológica actual, pero sin método remoto
  suficientemente concreto; sus coordenadas se fijan al núcleo de Lousada.
- La identidad histórica Horta de Aranga ha pasado a publicarse como Terras de
  Bordel manteniendo propietario, teléfono y finca de Bordel. Se corrigen nombre,
  dirección, correo y slug, con `merge` desde `horta-de-aranga-abegondo`.
- La Huerta de Antía, Frutas Geixade, Terras de Bordel, Horta Millarada, A Horta
  de Ana y A Horta do Monte quedan `parcial`: directorios institucionales,
  registros o prensa reciente prueban actividad, pero falta una fuente propia
  actual inspeccionable. Se actualizaron sus contactos; Geixade recibe
  coordenadas honestas del núcleo de Sarandós.

### Hallazgos AC-07

- Avícola Tratante se retira de A Coruña: la propia empresa explica que trasladó
  progresivamente toda la producción, clasificación y envasado a Dozón
  (Pontevedra). La ubicación de Narón es comercial y se elimina también su
  imagen.
- Granxa O Caxigo no produce huevos en Moeche. Es una explotación de vacuno
  lechero situada en A Rañoa, Cerdido; se corrigen municipio, categoría,
  dirección, coordenadas y slug, con `merge` desde el identificador histórico.
  A Factoría do Lume también publica ahora su obrador en Narón y recibe el mismo
  tratamiento desde el antiguo slug de A Coruña.
- Orballo, Seitura y A Factoría do Lume mantienen ecommerce propio operativo.
  AgroDayca distribuye su producción hortícola a través de Gadis y Enflor trabaja
  por contacto con restauración, de modo que ambas quedan con venta online `no`.
- Finca Bouzón, Lúa de Dexo, Labrecos, AgroDayca, Enflor, Seitura, Orballo y A
  Factoría do Lume quedan verificadas mediante fuentes propias vigentes. En los
  casos de venta directa sin procedimiento remoto explícito se conserva `no
  comprobado`.
- A Horta de Sueiriña, Horta Daterra, A Horta de Porta, Leiriñas de Uz, Granxa O
  Caxigo y AgrecoGaliza quedan `parcial`. A Horta de Porta presenta señales
  contradictorias —directorio institucional actual frente a cese en la antigua
  dirección—, insuficientes tanto para verificar como para purgar. Los demás
  carecen de una fuente propia actual inspeccionable.

### Hallazgos AC-08

- García Candal Alimentación y Pío do Saleiro representaban la misma sala de
  despiece y elaboración de Juan de la Cierva 46-48. Se conserva la identidad
  productiva `pio-do-saleiro-a-coruna`, se registra el pedido oficial por
  WhatsApp y se retira la imagen redundante del grupo.
- Cárnicas Anzo se purga: su obrador y contacto productivo están en el Polígono
  Lalín 2000, Pontevedra, mientras Santa Lucía 76 de Santiago es una tienda.
  Onda Café también sale del catálogo: es hostelería y encarga en Madrid el
  tueste de su café, por lo que no acredita elaboración cafetera provincial.
- Café Veracruz se corrige desde la boutique de Avenida Finisterre al tostadero
  real de Touriñana 58, Meicende (Arteixo), con nuevo slug, dirección,
  coordenadas, contacto e imagen renombrada. Siboney se mueve igualmente de su
  boutique al tostadero de Pasteur 14, sin cambiar municipio ni slug.
- Siboney, Waco, Café Veracruz y Cafés Lúa mantienen tiendas propias operativas.
  Waco, Veracruz y Lúa ofrecen además suscripciones; se actualizan los dominios,
  contactos y perfiles vigentes de los cuatro tostadores.
- Productos Cárnicos Domínguez vende por ecommerce desde su obrador de Baíñas;
  Pío do Saleiro y Carnes y Embutidos Hércules reciben pedidos por WhatsApp.
  Carnicosa y Sadepor quedan verificadas por sacrificio, despiece o fabricación,
  pero con venta online `no` al trabajar mediante atención profesional y
  contacto comercial sin procedimiento remoto de compra.
- Doña Bárbara no tuesta café, pero sí mantiene un obrador visible que hornea
  diariamente bollería y repostería artesanal. Se conserva como `Pan y
  pastelería`, con venta online `no`, y se retira el Instagram duplicado en la
  columna web.

### Hallazgos AC-09

- TeoAta, Late & Late y Essenzo acreditan obradores propios y ecommerce
  operativo. TeoAta pausa los envíos únicamente durante el calor del verano;
  Late & Late distribuye desde su obrador coruñés por transporte refrigerado y
  Essenzo se corrige desde la dirección heredada al polígono A Marisqueira.
- Chocolates Mariño sigue activo y se encamina al centenario en 2027, según el
  Concello de Carballo. Queda `parcial`: su web propia solo ofrece identidad y
  contacto, mientras el proceso artesanal y la actividad actual dependen de
  fuentes institucionales; la venta remota no está comprobada.
- Helados La IBI y Xearte Brigitte mantienen tiendas propias con carrito y
  reparto local. Puerta Real acredita una sala de elaboración en A Coruña y
  enlaza pedidos mediante Just Eat; The Bio Factory fabrica en Pocomaco y vende
  por Glovo. Se actualizan dominios, contactos y coordenadas productivas.
- Heladería Colón queda verificada por elaboración propia y actividad actual,
  pero con venta online `no`: no aparece un procedimiento remoto de pedido.
  Se retira el directorio e-distrito de la columna web y se conserva el perfil
  social propio.
- Lume produce platos de quinta gama en Pocomaco y comercializa referencias
  vigentes mediante el marketplace de La Tienda de Lino. Legumbres Morgade no
  es una explotación agrícola: se describe correctamente como planta de
  selección y acondicionamiento a granel, con pedidos B2B por correo.

### Hallazgos AC-10

- Sanbrandán se purga como gran industria: IPASA está integrada en Monbake y su
  planta coruñesa, con cerca de 30 M€ de facturación, ampliará un 50 % la
  capacidad de masas congeladas. Dulcepan también sale: sus responsables
  explican que el comercio compra pan, empanadas y repostería a obradores
  externos y no acredita elaboración propia.
- Panadería Da Cunha y Grupo Da Cunha eran la misma empresa y compartían imagen.
  Se conserva la marca comercial en el obrador de Os Capelos. La Perla es un
  despacho de Sancosa/Piedras de Santiago; se consolida en la fila de la fábrica
  de Forniños y se deja su verificación para AC-11.
- Panadería La Nueva de Neda se corrige desde el despacho de Esteiro al obrador
  principal de Avenida de Algeciras 89, Neda, con nuevo slug, contacto,
  coordenadas e imagen renombrada. Panificadora Germán también queda fijada a
  su obrador de Neda; ambas webs son catálogos sin pedido remoto.
- Pan da Moa mantiene una tienda Foodlus lanzada en febrero de 2026 con catálogo,
  pago y recogida por franjas. A Balsa declara venta nacional por teléfono y
  correo desde su obrador de Avenida de Caión, y Obrador San Francisco publica
  reservas telefónicas; en este último se retiraron el dominio y el Instagram
  homónimos de Madrid y se añadió el perfil coruñés correcto.
- Do Pincho queda verificada mediante su sitio de negocio con aviso legal y sus
  perfiles propios, pero sin pedido remoto. A Tafona queda `parcial` pese a la
  actividad de obrador documentada en 2026 porque carece de canal propio actual.
  O Corrosco también queda `parcial`: su perfil activo se presenta como despacho
  de productos artesanos y la elaboración solo está respaldada por fuentes
  secundarias; en ambos casos la venta sigue `no comprobado`.

### Hallazgos AC-11

- Sancosa/Piedras de Santiago queda verificada como la unidad productiva que
  sobrevivió a La Perla: fábrica y obrador en Forniños 53, elaboración de
  bombones desde 1991 y tienda con 31 referencias. Se corrige a categoría
  `Chocolate`, código postal, correo y ecommerce.
- Migas y O Pettit mantienen catálogos comprables en Uber Eats; Pandelino y
  Habaziro venden mediante tienda propia. En Habaziro se corrigen Facebook e
  Instagram al identificador `habaziroconcept`; Pandelino se normaliza a HTTPS
  y Migas recibe su perfil propio.
- Tartitis acepta encargos personalizados por teléfono y Panadería Carral
  dispone de reparto a domicilio desde su obrador de O Burgo. Pastelería Naya
  queda verificada por su perfil activo y una entrevista realizada en el
  obrador, pero sin mecanismo remoto inequívoco; su antiguo dominio no resuelve.
- Berna, Delicias Coruña, Tahona y Gestal quedan con venta online `no`: sus webs
  actuales son informativas o de contacto y no aceptan pedidos. Delicias se
  conserva como fábrica local independiente y se elimina la etiqueta
  contradictoria «bollería industrial artesana».
- Gestal se corrige desde el despacho de Antonio Noche López al obrador principal
  de Avenida de Fisterra 169, Arteixo, con nuevo slug, municipio, contacto y
  coordenadas. Tahona mantiene Praza de Lugo porque ese establecimiento integra
  despacho y obrador de panadería y pastelería.
- Panadería Tarrío queda `parcial`: los directorios recientes acreditan actividad,
  especialidades, dirección y contacto en Melide, pero no se localizó una fuente
  propia actual. El botón de WhatsApp de un directorio no basta para afirmar
  pedidos, por lo que la venta permanece `no comprobado`.

### Hallazgos AC-12

- A Maquía se corrige de la tienda de Perillo al obrador central de A
  Marisqueira, Culleredo; Panadería Xallas, del despacho de Bertamiráns a la
  fábrica de Covas, Negreira; y Panadería San José, de la tienda de Padrón al
  obrador histórico de A Cubela, Rois. Los tres slugs e imágenes se renombran y
  cada identidad histórica queda registrada mediante `merge`.
- Lenatt se corrige del domicilio social de A Coruña al obrador de O Amorne,
  Cambre, documentado por Artesanía Alimentaria. También se recategoriza como
  `Dulces y repostería`: produce cremas ecológicas de frutos secos y granolas,
  no pan. Su tienda propia acredita ecommerce.
- Gascón, Valencia Ultramar, A Maquía y Mamá Teresa mantienen tiendas propias
  comprables; Flory acepta encargos por teléfono y Algareira por WhatsApp.
  Tartas Lestedo y D' Casa Dubraseda quedan con venta `no` tras revisar sus
  catálogos y contactos sin encontrar un mecanismo remoto.
- Panadería Puente se fija al establecimiento elaborador de Río Xubia en vez del
  despacho de Real. Tartas Lestedo se actualiza al domicilio productivo de
  Pazos 19 y D' Casa y Mamá Teresa reciben coordenadas verificables de sus
  obradores.
- Panadería Vázquez queda `parcial`: la identidad y el local siguen respaldados
  por fuentes comerciales y registrales, pero no apareció una presencia propia
  actual que eleve la actividad productora o resuelva la venta remota.

### Hallazgos AC-13

- Maruxas de Nata queda fijada como `Repostería artesana`: su web confirma las
  galletas ecológicas elaboradas a mano en la granja familiar de A Garita. El
  sitio solo ofrece catálogo y puntos de venta, por lo que la venta remota es
  `no`.
- La fila genérica `mantecados-das-pontes-as-pontes` correspondía por dirección,
  teléfono y correo a Pastelería Artesana Mari. Se corrige la identidad y el
  slug; prensa de septiembre de 2025 confirma el relevo de Mari Guerreiro a
  Suso Calvo y la continuidad del obrador. Viuda Domingo López mantiene tienda
  propia comprable y Panadería Toñita queda verificada sin canal remoto.
- Melanger anunció la despedida de su etapa de tienda física, pero su propia
  portada también documenta ventas recientes de Nazariñas y una nueva línea de
  dulces para ferias de julio. Se conserva `parcial`, sin la dirección ni las
  coordenadas del local cerrado y con venta `no comprobado`.
- Primicias Raíña se recategoriza como `Repostería artesana`: la empresa de
  inserción transforma vegetales ecológicos en conservas y dulces sin gluten en
  Vilasantar. Se normaliza el dominio a punycode y se usan coordenadas honestas
  de municipio; su web es informativa y la venta queda `no`.
- Amasarte, Farinarium, Horno San Amaro y Panadería Agra quedan verificadas con
  actividad actual y venta `no`. Farinarium se mueve de la tienda de San Xoán a
  la dirección principal de Paseo de los Puentes publicada por la asociación de
  fabricantes, con contacto y coordenadas corregidos.
- Olivella Cakes admite configuración y pago web o WhatsApp para recogida;
  Arca do Millo gestiona envíos por teléfono y correo mientras termina su
  tienda; y The Vanessa Bakery mantiene catálogo comprable en Uber Eats. Las
  tres se verifican junto con sus coordenadas, y Vanessa recibe teléfono y
  horario actuales.

### Hallazgos AC-14

- Las 28 filas `parcial` se reauditaron una por una. Ninguna dispone de un canal
  propio actual suficiente para elevarla a `verificado`; sus techos registrales,
  institucionales o secundarios quedan documentados y no hay `pendiente`.
- La auditoría concurrente de las 99 webs conservadas no deja fallos. A Factoría
  do Lume pasa al dominio canónico `factoriadolume.com`; el dominio dedicado de
  Conservas Ría de Arosa se retira porque mantiene un fallo TLS, sin inferir de
  ello cierre ni inactividad.
- El directorio institucional de Artesanía Alimentaria sitúa Essenzo Cacao en
  Rúa Amparo López Jean 2, Culleredo. Se corrigen dirección, Maps y coordenadas
  exactas, eliminando la aparente colisión geográfica con A Maquía.
- Do Pincho mantiene actividad y sus redes propias; un directorio local actual
  confirma reparto de pan a domicilio y teléfono directo. Se elimina la página
  Eatbu que devuelve 404 y se resuelve `Venta online=sí` por `telefono`.
- Las coincidencias restantes son relaciones justificadas: OXÓCO/Panadería
  Patricio y Casa Beade/Conexión Mandeo comparten ubicación; Bico de
  Xeado/Granxa O Cancelo comparten cooperativa y correo, pero son unidades
  productivas diferenciadas. No quedan duplicados de identidad, teléfono, web
  ni hash de imagen.
- El archivo de Granxa O Cancelo era una copia exacta del logotipo de Bico de
  Xeado. Se retira de la fila y del directorio; la provincia queda con 85
  imágenes referenciadas y sin recursos huérfanos.

### Resultado AC-15

- Las 148 filas actuales tienen un `keep` vigente y decisión idéntica al CSV;
  las 38 identidades retiradas o corregidas conservan su `purge` o `merge`.
- A Coruña queda añadida a `data/evidence/coverage.json` y el gate final global
  cierra sin incidencias.

## Ola 3 · cierre de la banda 1–40 (2026-07-29)

- Se revisaron las **38** filas que seguían en `no comprobado`: **1** pasa a
  `sí`, **29** a `no`, **7** permanecen `no comprobado` por ambigüedad o fallo
  técnico real y **1** se purga. La provincia queda con **147 filas**:
  73 `sí`, 67 `no` y 7 `no comprobado`.
- **Conservas Ría de Arosa** pasa a `verificado`: se precisan Postmarcos,
  horario y web oficial del grupo, y Club Ortiz acredita ecommerce operativo.
- **Queixo Fresco Sillobre** se corrige a la identidad productora
  **Gandería Sillobre**, con dirección, teléfono, horario y sus dos productos
  actuales. **Panadería Tarrío** recibe el móvil vigente.
- **Granxa O Caxigo** se retira: es una explotación de vacuno dedicada a leche
  mayorista, sin producto elaborado identificable ni canal al consumidor. La
  identidad heredada de Moeche conserva su propia purga de trazabilidad.
- Los siete residuales no se maquillan como `no`: incluyen dominios caídos,
  comercio antiguo contradictorio, reventa independiente o reparto sin método
  público de pedido.

### Residual corto (2026-07-31)

- Se revisan seis perfiles y **Lúa de Dexo** pasa a `Venta online=no`: su canal
  oficial está activo y las fuentes recientes confirman venta directa y catas,
  pero no publican enlace, teléfono ni instrucción de pedido remoto. La ficha
  incorpora más de 280 variedades, Amaralla, Dexchup, mermeladas y tomates
  confitados.
- Los otros cinco no se fuerzan. Lorenzo Bescansa enlaza únicamente revendedores
  independientes; el checkout de Melanger llega hasta el carrito pero no ofrece
  método de pago; Casa Xacobe solo tiene un WhatsApp generado por un directorio;
  Daterra conserva el dominio caído; y A Horta de Porta muestra actividad social
  antigua y una contradicción de ubicación.
- La mejora editorial incluye además el Facebook oficial de Lorenzo Bescansa,
  el horario y siete especialidades de Casa Xacobe, la identidad y línea
  ecológica de **Daterra do País · Horta Daterra**, y la retirada del Instagram
  no disponible de Melanger.
- Snapshot: 147 filas; 122 `verificado`, 25 `parcial`; venta 74 `sí`, 68 `no` y
  5 `no comprobado`.
