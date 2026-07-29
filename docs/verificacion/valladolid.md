# Verificación provincial de Valladolid

Ledger para planificar y reanudar la primera pasada profunda de
`data/csv/castilla-y-leon/valladolid.csv`. El CSV es la fuente de verdad y la
evidencia por decisión vive en
`data/evidence/castilla-y-leon/valladolid.jsonl`, que se crea con el lote 1.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
solo fija el snapshot, los riesgos locales y el alcance exacto de cada lote.
Los contratos son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

Para ejecutar un lote basta con leer Estado, Reglas locales, la fila de la
worklist y la lista exacta de slugs del lote. No se deben tocar filas de otro
lote «de paso»: cualquier hallazgo cruzado se anota aquí para resolverlo en su
lote. La revisión se detiene en cuanto la evidencia sea suficiente; no se
persiguen campos opcionales que no cambien la decisión.

## Estado

- Inicio: 2026-07-11. Modo: primera pasada profunda de las 213 filas heredadas;
  no añadir candidatos nuevos hasta el cierre transversal.
- Snapshot inicial: **213 filas**; **210 `pendiente`, 2 `parcial`, 1
  `verificado`**. Las tres filas no pendientes se reauditan con el mismo estándar.
- Venta online inicial: **3 `sí`, 0 `no`, 210 `no comprobado`**. Los tres `sí`
  (`confiteria-guijarro-tudela-de-duero`,
  `bodegas-de-los-herederos-del-marques-de-riscal-rueda` y
  `rueda-cheesemonger-rueda`) quedan en cuarentena: deben demostrar hoy el
  mecanismo de pedido y recibir `Canal de venta` o degradarse.
- Categorías: Bodega 82; Pan y pastelería 47; Lácteos y quesos 23;
  Charcutería 13; Miel 10; Fruta y verdura 8; Frutos secos 8; Aceite 6;
  Despensa artesanal 6; Cerveza artesana 5; Huevos 2; y una fila de Harinas y
  cereales, Trufa y setas y Chocolate.
- Enlaces iniciales: web 188/213, Instagram 127/213, Facebook 3/213, Google Maps
  213/213, teléfono 209/213, correo 125/213. Imágenes 139/213; no se enriquecen
  en esta pasada, salvo borrar o renombrar activos al purgar/fusionar/cambiar slug.
- Coordenadas: 212/213. `fonseca-mediero-s-l-fresno-el-viejo` carece de lat/lon
  y no puede quedar `verificado` sin resolverlas. Calidad inicial: 0 errores y
  1 warning: `bodega-emina-rueda-olmedo` cae a 17,7 km del centroide de Olmedo
  y a 1,6 km del de Medina del Campo; resolver municipio productivo o coordenadas.
- Evidencia y candidatos: no existían
  `data/evidence/castilla-y-leon/valladolid.jsonl` ni
  `docs/candidates/valladolid.md` al inicio. Valladolid no figura en
  `data/evidence/coverage.json`.
- Identificadores compartidos a resolver, sin fusionar automáticamente:
  - Grupo Matarromera: `abro-biotec-laguna-de-duero`,
    `sin-alcohol-valbuena-de-duero`, `bodega-matarromera-valbuena-de-duero` y
    `almazara-oliduero-medina-del-campo` comparten teléfono; las tres primeras
    también correo. Pueden ser unidades productivas distintas del mismo grupo.
  - Quesos Quevedo: `quesos-quevedo-valladolid` y
    `fabrica-de-quesos-s-quevedo-valoria-la-buena` comparten teléfono, dominio e
    Instagram; resolver si son fábrica + punto comercial o un duplicado real.
  - Protos: `bodegas-protos-d-o-rueda-la-seca` y `bodegas-protos-penafiel`
    comparten dominio e Instagram; mantener ambas solo si son instalaciones
    productivas distintas.
  - Yllera: `bodega-historica-enoturismo-yllera-rueda` y
    `yllera-bodegas-y-vinedos-rueda` comparten Instagram; resolver visita
    histórica frente a unidad productiva y evitar duplicar una misma bodega.
  - El Bombón: `el-bombon-cisterniga` y `pasteleria-el-bombon-valladolid`
    comparten Instagram; resolver obradores/sucursales frente a duplicado.
- Riesgos de alcance evidentes a comprobar: ABRO BIOTEC puede ser proveedor de
  extractos para industria, no productor alimentario de venta pública; FADISPAN
  parece federación/asociación; TODO CATERING y algunos comercios urbanos pueden
  ser servicios o reventa; las carnicerías solo se mantienen si elaboran producto
  propio; las visitas/enoturismo no crean una segunda bodega por sí solas.
- Tras lote 1 (2026-07-11): **211 filas** (−2: merge de Verartes en Huerta Luis
  San José y purga de Almazara Norte como `not-producer`); **196 `pendiente`, 4
  `parcial`, 11 `verificado`**. Venta online: **10 `sí`, 2 `no`, 199 `no
  comprobado`**; 7/10 `sí` ya tienen canal y permanecen en cuarentena los tres
  heredados de lotes 3, 10 y 13. Evidencia: 16 registros (12 `keep`, 3 `merge`,
  1 `purge`). Identidad actualizada `oleogourmet-ataquines` →
  `eman-vara-gourmet-ataquines`; ABRO BIOTEC corregida de Laguna a Valbuena de
  Duero y recategorizada como Despensa artesanal. Oligueva y Espárragos Velón
  quedan `parcial` por carecer de fuente propia operativa; se retiraron sus
  contactos de dominio caído. Imágenes: 137/211 tras borrar los dos activos
  huérfanos de las filas eliminadas.
- Tras lote 2 (2026-07-11): **208 filas** (−3: cierres/purgas de Bodesgueva,
  ADHUC Tempus y La Nieta); **182 `pendiente`, 6 `parcial`, 20 `verificado`**.
  Venta online: **17 `sí`, 4 `no`, 187 `no comprobado`**; 14/17 `sí` ya tienen
  canal y permanecen en cuarentena los tres heredados. Evidencia acumulada: 33
  registros (23 `keep`, 6 `merge`, 4 `purge`). Se normalizaron Tinto Jaramiel →
  Bodegas Honorato Calleja; Rodríguez y Sanzo de la oficina de Valladolid a la
  bodega de Rueda; y Montevital de Valladolid a Villanubla, esta última aún
  `parcial`. Imágenes: 137/208; el activo de Montevital se renombró con su slug.
- Tras lote 3 (2026-07-11): **207 filas** (−1: el espacio histórico de Yllera
  se fusionó con su unidad productiva); **168 `pendiente`, 6 `parcial`, 33
  `verificado`**. Venta online: **28 `sí`, 5 `no`, 174 `no comprobado`**;
  26/28 `sí` tienen canal y quedan en cuarentena dos heredados de lotes 10 y 13.
  Evidencia acumulada: 48 registros (36 `keep`, 8 `merge`, 4 `purge`). La
  antigua identidad Bodegas Ontañón se actualizó a Bodegas Rippa Dorii. Imágenes:
  136/207 tras retirar el activo duplicado de la bodega histórica de Yllera.
- Tras lote 4 (2026-07-11): **206 filas** (−1: purga de Teodoro Recio en
  liquidación); **156 `pendiente`, 6 `parcial`, 44 `verificado`**. Venta online:
  **38 `sí`, 6 `no`, 162 `no comprobado`**; 36/38 `sí` tienen canal. Evidencia
  acumulada: 61 registros (47 `keep`, 9 `merge`, 5 `purge`). Emina Rueda se
  corrigió de Olmedo a Medina del Campo, incluido slug e imagen, eliminando el
  warning geográfico. Se confirmó que Protos La Seca y Protos Peñafiel son
  instalaciones productivas distintas. Imágenes: 136/206.
- Tras lote 5 (2026-07-11): **206 filas**; **145 `pendiente`, 7 `parcial`, 54
  `verificado`**. Venta online: **46 `sí`, 10 `no`, 150 `no comprobado`**;
  44/46 `sí` tienen canal. Evidencia acumulada: 75 registros (59 `keep`, 11
  `merge`, 5 `purge`). J. Flores se normalizó a Bodegas Jota Flores y `De Tilio`
  a la marca correcta Detilio, incluido slug e imagen. La Olmilla queda `parcial`
  por no acreditar claramente elaboración propia continuada. Imágenes: 136/206.
- Tras lote 6 (2026-07-11): **206 filas**; **132 `pendiente`, 8 `parcial`, 66
  `verificado`**. Venta online: **55 `sí`, 13 `no`, 138 `no comprobado`**;
  53/55 `sí` tienen canal. Evidencia acumulada: 90 registros (72 `keep`, 13
  `merge`, 5 `purge`). Se normalizaron Bodega Win Sin Alcohol y Bodega Verónica
  Salgado, incluida la imagen de esta última. Páramo de la Esgueva queda `parcial`
  por dominio caído y ausencia de fuente propia actual, pese a marca renovada y
  pertenencia al censo provincial. Imágenes: 136/206.

## Reglas locales

1. Bodega se coteja primero con DO Rueda, DO Ribera del Duero y DO Cigales, pero
   un registro solo sostiene `parcial`; actividad actual y municipio requieren
   fuente propia o ficha individual verificadora.
2. En Rueda, Peñafiel, Pesquera, Valbuena y Quintanilla se revisan con especial
   cuidado duplicados de grupo, sede fiscal frente a bodega real y centros de
   visita separados de la unidad productiva.
3. Para venta online vinícola, la reventa por una vinoteca ajena no basta. Se
   busca tienda propia o colectiva oficial y se confirma precio, carrito y pedido.
4. Queserías: separar fábrica, marca y tienda. Una misma marca con punto de venta
   en Valladolid y fábrica en otro municipio suele ser una sola unidad productiva.
5. Charcutería, panadería, despensa y comercios urbanos: una tienda o restaurante
   no entra por sí solo; debe constar elaboración propia dentro del alcance.
6. Fruta, piñón, miel y huevos: directorios y registros apoyan existencia, pero
   una explotación o almacén no demuestra venta pública ni actividad actual.
7. Municipio significa unidad productiva, no sede social ni tienda. Ante cambio
   material se corrige slug y se deja `merge` del slug histórico.
8. Un fallo de web no prueba cierre. Las purgas exigen fuente suficiente y
   conservan tombstone en el JSONL.

## Fuentes de cotejo

- Consejos reguladores de DO Rueda, DO Ribera del Duero y DO Cigales.
- Tierra de Sabor y directorios institucionales de Diputación/Ayuntamientos como
  apoyo, nunca como única fuente verificadora de actividad actual.
- Web, tienda, red social o ficha Maps oficial de cada productor.
- Registros sanitarios, ecológicos o de figuras de calidad solo para las
  afirmaciones que realmente publican.

## Cierre

- Snapshot final: **195 filas**; **151 `verificado`, 44 `parcial`, 0
  `pendiente`**. Se registran 195 decisiones `keep`, 20 `merge` y 14 `purge`.
- Venta online tras Ola 3: **111 `sí`, 66 `no`, 18 `no comprobado`**; los 111 casos
  positivos tienen un `Canal de venta` válido.
- Cobertura: 194/195 Google Maps, 193/195 coordenadas y 123/195 imágenes.
  Los únicos huecos geográficos corresponden a dos filas `parcial`: La
  Fabulosa no publica la finca exacta y Fonseca Mediero solo permite ubicar la
  calle, no el número con precisión suficiente. No se inventan coordenadas.
- Auditoría transversal: sin pendientes, duplicados editoriales, errores de
  contrato ni descripciones genéricas. Las tres señales restantes de plantilla
  cruzada son productores mixtos reales: Concejo del Monte y los espárragos
  Belloso y Velón en fresco y conserva.
- Puerta final: `npx pnpm verify:data` revalidada el 2026-07-29 con 0 errores, 0
  avisos de imágenes y 0 incidencias de evidencia.

### Ola 3 · Venta online y texto (2026-07-29)

- **44 → 18 `no comprobado`**: tres pedidos directos demostrados —Vinesenti,
  Miel Sandonís y Las Mermeladas de Alison— y 23 negocios actuales sin
  mecanismo remoto público.
- Los 18 residuales tienen incertidumbre concreta: dominios caídos o
  inaccesibles, catálogo detrás de cuenta, fuente propia ausente o actividad
  comercial que no puede confirmarse. OLIGUEVA se mantiene `parcial`: la
  sociedad figura inactiva y sus canales han desaparecido, pero no consta aún
  una extinción registral que permita `purge:closed`.
- **34 descripciones de plantilla eliminadas**: narraban que la fila se había
  incorporado al catálogo y revisado con Google Maps, sin aportar un hecho del
  productor. También se corrige Helios de `Pan y pastelería` a `Despensa
  artesanal`, se normaliza la gama truncada de El Gran Cardenal y se condensan
  textos promocionales extensos en Oligueva, Montevital y los dos productores
  de espárrago.

## Worklist

| Lote | Alcance | Filas | Estado | Riesgo principal |
|---:|---|---:|---|---|
| 1 | Aceite + Fruta y verdura | 14→12 | ✅ 2026-07-11 | 10 verificadas, 2 parciales, 1 merge neto y 1 purga; 7 `sí`, 2 `no` |
| 2 | Bodega · Cigales, Esgueva y capital | 14→11 | ✅ 2026-07-11 | 9 verificadas, 2 parciales, 3 purgas; 7 `sí`, 2 `no` |
| 3 | Bodega · Rueda | 14→13 | ✅ 2026-07-11 | 13 verificadas; 1 merge; 12 `sí`, 1 `no` |
| 4 | Bodega · La Seca, Olmedo, Serrada y Pozaldez | 12→11 | ✅ 2026-07-11 | 11 verificadas, 1 purga; 10 `sí`, 1 `no`; Emina corregida |
| 5 | Bodega · Peñafiel | 12 | ✅ 2026-07-11 | 11 verificadas, 1 parcial; 8 `sí`, 4 `no`; 2 slugs corregidos |
| 6 | Bodega · Pesquera, Valbuena y entorno | 13 | ✅ 2026-07-11 | 12 verificadas, 1 parcial; 9 `sí`, 3 `no`; 2 slugs corregidos |
| 7 | Bodega · Quintanillas, sur y Campos | 17 | ✅ 2026-07-11 | 12 verificadas, 5 parciales; 8 `sí`, 3 `no`; Chapirete corregida |
| 8 | Charcutería + Huevos | 15→14 | ✅ 2026-07-11 | 11 verificadas, 3 parciales; 7 `sí`, 4 `no`; 2 slugs corregidos y 1 purga |
| 9 | Lácteos y quesos A | 12→11 | ✅ 2026-07-11 | 11 verificadas; 5 `sí`, 6 `no`; Quevedo fusionado con su fábrica |
| 10 | Lácteos y quesos B | 11 | ✅ 2026-07-11 | 10 verificadas, 1 parcial; 7 `sí`, 3 `no`; Quevedo resuelta en lote 9 |
| 11 | Miel + cerveza + cereales + trufa | 17→15 | ✅ 2026-07-11 | 12 verificadas, 3 parciales; 10 `sí`, 2 `no`; 2 purgas |
| 12 | Frutos secos + despensa + chocolate | 15→11 | ✅ 2026-07-11 | 9 verificadas, 2 parciales; 6 `sí`, 3 `no`; 4 purgas y 1 slug corregido |
| 13 | Pan y pastelería · sur y este | 15 | ✅ 2026-07-11 | 5 verificadas, 10 parciales; 4 `sí`, 2 `no`; Panadería Blanco corregida |
| 14 | Pan y pastelería · provincial | 15 | ✅ 2026-07-11 | 8 verificadas, 7 parciales; 3 `sí`, 5 `no`; tienda El Bombón fusionada |
| 15 | Pan y pastelería · Valladolid | 17→14 | ✅ 2026-07-11 | 7 verificadas, 7 parciales; 4 `sí`, 3 `no`; 2 purgas, 1 merge y Marga corregida |
| 16 | Cierre transversal | residual | ✅ 2026-07-11 | 0 pendientes; dedup y geo limpios; 2 parciales conservan huecos no inferibles; `verify:data` OK |

## Alcance exacto

### Lote 1 · Aceite + Fruta y verdura (14)

`oleogourmet-ataquines`, `abro-biotec-laguna-de-duero`,
`oligueva-renedo-de-esgueva`, `concejo-del-monte-alimentos-ecologicos-alaejos`,
`horcaol-olmedo`, `ajos-pitirri-portillo`,
`esparragos-belloso-tudela-de-duero`, `esparragos-velon-tudela-de-duero`,
`huerta-luis-san-jose-tudela-de-duero`, `inea-finca-ecologica-valladolid`,
`verartes-valladolid`, `almazara-norte-cisterniga`,
`almazara-pago-de-valdecuevas-medina-de-rioseco`,
`almazara-oliduero-medina-del-campo`.

### Lote 2 · Bodega — Cigales, Esgueva y capital (14)

`bodesgueva-amusquillo`, `tinto-jaramiel-amusquillo`,
`bodega-cooperativa-cigales-cigales`, `bodegas-hijos-de-felix-salas-corcos`,
`bodega-el-recodo-esguevillas-de-esgueva`, `bodega-amalio-del-pozo-mucientes`,
`bodegas-mucy-mucientes`, `bodegas-sinforiano-mucientes`,
`adhuc-tempus-valladolid`, `bodega-rodriguez-sanzo-valladolid`,
`montevital-valladolid`, `bodega-la-luz-de-cigales-cigales`,
`bodega-ovidio-garcia-cigales`, `bodega-la-nieta-fuensaldana`.

### Lote 3 · Bodega — Rueda (14)

`bodegas-y-vinedos-pandora-rueda`, `palacio-de-bornos-rueda`,
`bodega-entrevidas-rueda`, `bodega-finca-montepedroso-rueda`,
`bodega-gotica-rueda`, `bodega-grupo-valdecuevas-rueda-rueda`,
`bodega-historica-enoturismo-yllera-rueda`, `bodega-pagos-del-rey-rueda-rueda`,
`bodegas-de-los-herederos-del-marques-de-riscal-rueda`,
`bodegas-menade-rueda`, `bodegas-mocen-rueda`, `bodegas-ontanon-rueda`,
`bodegas-viore-rueda`, `yllera-bodegas-y-vinedos-rueda`.

### Lote 4 · Bodega — La Seca, Olmedo, Serrada y Pozaldez (12)

`bodega-cuatro-rayas-la-seca`, `bodegas-teodoro-recio-la-seca`,
`bodegas-nidia-olmedo`, `bodega-de-crianza-de-pozaldez-pozaldez`,
`bodega-diez-siglos-de-verdejo-serrada`, `bodegas-de-alberto-serrada`,
`bodegas-campo-eliseo-la-seca`, `bodegas-protos-d-o-rueda-la-seca`,
`bodega-emina-rueda-olmedo`, `bodegas-eresma-la-soterrana-olmedo`,
`bodegas-y-vinedos-la-mejorada-olmedo`, `bodegas-rueda-perez-pozaldez`.

### Lote 5 · Bodega — Peñafiel (12)

`bodega-teofilo-reyes-penafiel`, `bodegas-j-flores-penafiel`,
`vinos-themera-penafiel`, `bodega-convento-de-oreja-s-l-penafiel`,
`bodega-la-olmilla-penafiel`, `bodega-pago-de-carraovejas-penafiel`,
`bodegas-marcos-penafiel`, `bodegas-penafalcon-sl-penafiel`,
`bodegas-penafiel-penafiel`, `bodegas-protos-penafiel`,
`bodegas-zifar-penafiel`, `de-tilio-bodega-boutique-penafiel`.

### Lote 6 · Bodega — Pesquera, Valbuena y entorno (13)

`sin-alcohol-valbuena-de-duero`, `bodega-ebano-castrillo-de-duero`,
`bodegas-briego-fompedraza`, `melida-wines-melida`,
`bodega-ascension-repiso-bocos-pesquera-de-duero`,
`manchon-mieres-bodega-pesquera-de-duero`,
`paramo-de-la-esgueva-pesquera-de-duero`, `valdebodega-san-bernardo`,
`bodega-matarromera-valbuena-de-duero`, `bodegas-lleiroso-valbuena-de-duero`,
`bodega-dehesa-de-los-canonigos-pesquera-de-duero`,
`bodega-tinto-pesquera-pesquera-de-duero`,
`bodegas-emilio-moro-s-l-ribera-del-duero-pesquera-de-duero`.

### Lote 7 · Bodega — Quintanillas, sur y Campos (17)

`vinas-murillo-alcazaren`, `meoriga-mayorga`,
`bodegas-la-granadilla-nava-del-rey`, `bodegas-valdehermoso-nava-del-rey`,
`bodegas-y-vinedos-arbas-pinel-de-arriba`, `bodega-arroyo-izquierdo-puras`,
`3-ases-bodegas-y-vinedos-quintanilla-de-arriba`,
`bodega-sarmentero-quintanilla-de-arriba`,
`3-elementos-quintanilla-de-onesimo`,
`bodegas-vega-de-yuso-quintanilla-de-onesimo`,
`vinedos-y-bodegas-ribon-quintanilla-de-onesimo`,
`elias-mora-san-roman-de-hornija`,
`bodega-juan-ponce-de-leon-santervas-de-campos`, `heredad-de-uruena-uruena`,
`bodegas-vicente-sanz-valdestillas`,
`bodegas-arzuaga-navarro-quintanilla-de-onesimo`, `bodega-muelas-tordesillas`.

### Lote 8 · Charcutería + Huevos (15)

`embutidos-maruja-cigales`, `grupo-hermi-cisterniga`,
`embutidos-antolin-e-hijos-montemayor-de-pililla`,
`carniceria-conce-traspinedo`, `carniceria-eva-traspinedo`,
`carne-t-marcos-valladolid`, `carnes-y-embutidos-el-arco-villabragima`,
`carniceria-juan-carlos-villabragima`, `carnicas-arego-villalon-de-campos`,
`la-fabulosa-huevos-de-oca-valladolid`, `caballo-blanco-villalon-de-campos`,
`embutidos-canibano-collantes-bolanos-de-campos`,
`embutidos-de-carpio-sl-carpio`,
`carniceria-artesana-diez-herrero-cogeces-del-monte`,
`embutidos-ballesteros-s-l-valladolid`.

### Lote 9 · Lácteos y quesos A (12)

`queseria-zucca-portillo`, `sirga-medina-de-rioseco`,
`el-gran-cardenal-medina-del-campo`, `queseria-gamazo-carbajosa-melgar-de-arriba`,
`queseria-artesanal-de-muzientes-mucientes`,
`queseria-artesanal-la-cruz-del-pobre-pedrajas-de-san-esteban`,
`canarejal-pollos`, `granja-cantagrullas-ramiro`, `queseria-campoveja-serrada`,
`quesos-quevedo-valladolid`, `queseria-hernandez-garcia-villalba-de-los-alcores`,
`queseria-las-cortas-villalba-de-los-alcores`.

### Lote 10 · Lácteos y quesos B (11)

`fabrica-de-quesos-de-villalon-de-campos-villalon-de-campos`,
`queseria-montequesos-villanubla`, `quesos-el-zarzal-laguna-de-duero`,
`la-quesera-de-rueda-lacteos-artesanos-medina-sl-rueda`,
`quesos-felix-armando-sanz-s-l-serrada`, `queserias-entrepinares-valladolid`,
`fabrica-de-quesos-s-quevedo-valoria-la-buena`,
`quesos-valdeovejas-villanueva-de-los-caballeros`,
`fonseca-mediero-s-l-fresno-el-viejo`, `rueda-cheesemonger-rueda`,
`flor-de-esgueva-penafiel`.

### Lote 11 · Miel + cerveza + cereales + trufa (17)

`cerveza-milana-montemayor-de-pililla`,
`cerveceria-las-llaves-de-san-pedro-san-pedro-de-latarce`,
`el-secreto-del-abad-valladolid`,
`harinera-emilio-esteban-renedo-de-esgueva`, `miel-zumbando-castromonte`,
`miel-los-montes-torozos-la-santa-espina`, `miel-sandonis-portillo`,
`pecorea-san-pedro-de-latarce`, `miel-79-tiedra`, `mielegante-torrelobaton`,
`trufa-viva-cogeces-del-monte`,
`cerveza-artesanal-patagonia-aldeamayor-de-san-martin`,
`cervezas-la-sardon-de-duero`, `la-miel-de-amable-castronuno`,
`amor-miel-valladolid`, `miel-de-pablo-viloria-del-henar`,
`miel-montes-de-valveni-valoria-la-buena`.

### Lote 12 · Frutos secos + despensa + chocolate (15)

`el-pescador-de-villagarcia-valladolid`, `todo-catering-valladolid`,
`biopinon-pedrajas-de-san-esteban`,
`pinones-luis-y-joaquin-lozano-pedrajas-de-san-esteban`,
`teresa-mate-pinones-de-la-tierra-pedrajas-de-san-esteban`,
`wamba-nuts-valladolid`, `valnut-villagarcia-de-campos`,
`aceitunas-y-conservas-anfe-valladolid`,
`da-silva-imagina-chocolate-artesanal-valladolid`,
`los-secretos-de-mi-angel-valladolid`, `frutos-secos-alcazaren-alcazaren`,
`frutos-secos-dani-medina-del-campo`, `frutos-secos-pekas-medina-del-campo`,
`las-mermeladas-de-alison-uruena`, `las-recetas-de-anita-mayorga`.

### Lote 13 · Pan y pastelería — sur y este (15)

`deliciass-centro-de-reposteria-creativa-arrabal-de-portillo`,
`mantecados-estilita-arrabal-de-portillo`,
`mantecados-molpeceres-arrabal-de-portillo`, `dulces-f-soria-campaspero`,
`dulces-vela-iscar`, `pasteleria-isma-iscar`,
`reposteria-la-giralda-de-castilla-matapozuelos`, `panaderia-blanco-olmedo`,
`pasteleria-artesana-el-harnero-pedrajas-de-san-esteban`,
`pastelleria-y-dulces-galicia-tordesillas`,
`confiteria-guijarro-tudela-de-duero`, `dulces-pariente-villaverde-de-medina`,
`pasteleria-reposteria-vg-la-casita-alaejos`,
`panaderia-artesanal-miga-y-miel-iscar`,
`panaderia-obrador-castellano-laguna-de-duero`.

### Lote 14 · Pan y pastelería — provincial (15)

`el-bombon-cisterniga`, `el-dulce-confiteria-pasteleria-cisterniga`,
`reposteria-artesana-la-tia-melitona-fresno-el-viejo`,
`panaderia-roman-fuensaldana`, `productos-el-villar-gallegos-de-hornija`,
`la-flor-de-castilla-medina-de-rioseco`,
`panaderia-elias-marcos-medina-de-rioseco`,
`panaderia-julia-san-pedro-de-latarce`,
`dulces-artesanos-pedepa-santovenia-de-pisuerga`,
`panaderia-la-cruz-villabragima`, `tahona-de-chari-villanubla`,
`dulces-y-conservas-helios-arroyo-de-la-encomienda`, `obrador-la-amona-cigales`,
`madapan-panaderia-obrador-cafe-mayorga`,
`el-obrador-de-torrecilla-torrecilla-de-la-orden`.

### Lote 15 · Pan y pastelería — Valladolid capital (17)

`belaria-valladolid`, `churreria-chocolateria-marga-valladolid`,
`fadispan-pan-de-valladolid-valladolid`, `pasteleria-menta-y-chocolate-valladolid`,
`bucle-reposteria-y-cafe-valladolid`, `el-obrador-valladolid`,
`matizes-pasteleria-valladolid`, `obrador-al-pan-pan-valladolid`,
`obrador-balbino-valladolid`, `obrador-de-canutillos-ruben-valladolid`,
`obrador-tahona-coque-valladolid`, `pan-pastas-y-reposteria-artesana-valladolid`,
`pasteleria-cundo-valladolid`, `pasteleria-el-bombon-valladolid`,
`pasteleria-liebana-valladolid`,
`reposteria-artesana-naranja-y-chocolate-s-l-valladolid`,
`reposteria-valentin-valladolid`.

## Flujo por lote

1. Confirmar que el worktree no contiene cambios ajenos sobre Valladolid.
2. Leer solo las filas del lote y buscar duplicados por nombre, dominio,
   teléfono, correo, dirección y grupo.
3. Investigar identidad, actividad productora, municipio y enlaces. Auditar
   venta online aparte. Detenerse cuando la decisión sea sólida.
4. Editar el CSV con parser, preservando las 20 columnas y LF. Añadir una línea
   JSONL por `keep`, `purge` o `merge` con `reviewedBy: "gpt-5.6-sol"`.
5. Actualizar Estado y worklist con el snapshot y excepciones del lote.
6. Ejecutar `npx pnpm check:csv:changed`, `npx pnpm check:evidence`,
   `npx pnpm check:evidence:changed` y `git diff --check`. Revisar el diff
   acotado a Valladolid antes de continuar.

## Cierre transversal

- Reauditar cualquier `pendiente`, `parcial`, `sí` y `no` residual.
- Repetir deduplicación normalizada y resolver todos los identificadores
  compartidos anotados.
- Corregir el geo-warning y la fila sin coordenadas; comprobar imágenes
  huérfanas tras purgas/merges.
- Decidir `coverage.json` solo si cada fila actual tiene un `keep` vigente.
- Ejecutar `npx pnpm verify:data`, revisar `git diff --stat`, `git diff --check`
  y el diff final del CSV/JSONL/ledger.
