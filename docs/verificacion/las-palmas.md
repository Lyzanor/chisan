# Verificación provincial de Las Palmas

Ledger de ejecución para la revisión profunda de
`data/csv/canarias/las-palmas.csv`. El CSV es la fuente de verdad y la
procedencia por decisión vive en `data/evidence/canarias/las-palmas.jsonl`.

## Estado

- Inicio: 2026-07-19.
- Snapshot inicial: **122 filas**; **0 `verificado`**, **14 `parcial`** y
  **108 `pendiente`**.
- Tras lote 1 / duplicados evidentes de queserías: **119 filas**; **0
  `verificado`**, **17 `parcial`** y **102 `pendiente`**. Se fusionan las
  variantes de Campo de Guía, Cortijo de Caideros y Altos de Moya, se
  sustituyen datos heredados sin respaldo y se conserva en cada caso el slug
  que mejor representa la identidad pública. Venta online: las tres filas
  supervivientes quedan en `no comprobado`. Evidencia: 3 `keep` + 3 `merge`.
- Tras lote 2 / bodegas de Gran Canaria: **119 filas**; **5 `verificado`**,
  **20 `parcial`** y **94 `pendiente`**. Se verifican Los Berrazales, Las
  Tirajanas, Frontón de Oro, Bentayga y San Juan; Ventura, Mondalón y Plaza
  Perdida quedan parciales por falta de canal propio actual. Plaza Perdida se
  corrige de Santa Brígida a Las Palmas de Gran Canaria, con slug e imagen
  coherentes. Venta online: Bentayga `sí` mediante marketplace oficial, cuatro
  bodegas `no` tras revisar sus canales y tres `no comprobado`. Evidencia
  acumulada: 11 `keep` + 4 `merge`.
- Tras lote 3a / bodegas principales de Lanzarote: **119 filas**; **12
  `verificado`**, **20 `parcial`** y **87 `pendiente`**. Se verifican El
  Grifo, La Geria, Rubicón, Vega de Yuco, Stratvs, Vulcano y Los Bermejos.
  Vega de Yuco se corrige de Yaiza a Tías con slug e imagen coherentes. Venta
  online: El Grifo, La Geria, Vega de Yuco y Vulcano `sí` por ecommerce;
  Rubicón, Stratvs y Los Bermejos `no` tras revisar sus canales propios.
  Evidencia acumulada: 18 `keep` + 5 `merge`.
- Tras lote 3b / bodegas pequeñas de Lanzarote: **119 filas**; **16
  `verificado`**, **23 `parcial`** y **80 `pendiente`**. Se verifican Guiguan,
  Martinón, La Florida y Tisalaya; Reymar, El Chupadero y Puro Rofe quedan
  parciales porque su actividad actual solo puede vincularse mediante fuentes
  institucionales o sectoriales. Martinón y Puro Rofe se corrigen de Yaiza a
  Tías con slug e imagen coherentes. Venta online: Martinón `sí` por ecommerce;
  Guiguan, La Florida y Tisalaya `no`; las tres filas parciales permanecen en
  `no comprobado`. Evidencia acumulada: 25 `keep` + 7 `merge`.
- Tras lote 4a / bodegas y aceites de Fuerteventura: **117 filas**; **17
  `verificado`**, **26 `parcial`** y **74 `pendiente`**. Conatvs queda
  verificada; Gavias del Sordo, Teguerey y Hacienda Jiménez–Tres Olivos quedan
  parciales por depender de fuentes institucionales o sectoriales. Se purgan
  las filas sintéticas Aceite Jagüey y Aceite de Finca Torres, sin entidad
  demostrable, y la imagen asociada a Jagüey. Venta online: Conatvs `no`; las
  tres filas parciales siguen en `no comprobado`. Evidencia acumulada: 29
  `keep` + 7 `merge` + 2 `purge`.
- Tras lote 4b / aceites de Gran Canaria: **113 filas**; **19 `verificado`**,
  **27 `parcial`** y **67 `pendiente`**. Oro Canario se corrige de Santa Lucía
  a Agüimes y queda verificado con pedido directo; Caserío de Temisas queda
  verificado con venta física y el aceite municipal de Santa Lucía, parcial.
  Se purgan Lomo de La Cruz, Finca Los Encinos y El Trull por inexistentes, y
  la atribución de aceite a Finca Condal porque la entidad produce vino, no
  aceite. Venta online: Oro Canario `sí` por WhatsApp y marketplace; Caserío de
  Temisas `no`; Santa Lucía `no comprobado`. Evidencia acumulada: 32 `keep` +
  8 `merge` + 6 `purge`.
- Tras lote 5a / primeras queserías de Gran Canaria: **113 filas**; **21
  `verificado`**, **31 `parcial`** y **61 `pendiente`**. Se verifican La Gloria
  y Quesos Bolaños mediante sus webs propias; Lomo del Palo, Madre Vieja,
  Ganadería Naroy y Cortijo de Pavón quedan parciales porque su continuidad y
  datos dependen de directorios institucionales. Naroy conserva correctamente
  Tejeda y se corrige el slug heredado con sufijo Ingenio; también se reparan
  tres geolocalizaciones y numerosos contactos inventados. Venta online: Lomo
  del Palo y Bolaños `sí` por WhatsApp; La Gloria `no`; las otras tres filas
  permanecen en `no comprobado`. Evidencia acumulada: 38 `keep` + 9 `merge` +
  6 `purge`.
- Tras lote 5b / queserías de Gran Canaria: **113 filas**; **23 `verificado`**,
  **35 `parcial`** y **55 `pendiente`**. Se verifican Era del Cardón y la
  Quesería Artesanal del Rosario mediante sus canales propios; Los Guedes,
  Amurga, Quesos de Naranjo y El Draguillo quedan parciales con continuidad
  respaldada por premios y fuentes institucionales de 2024-2026. Era del
  Cardón se corrige de Santa Lucía a Agüimes en el slug, como ya indicaban su
  municipio y dirección. Venta online: Era del Cardón `sí` por ecommerce y
  WhatsApp; Del Rosario `no` tras separar la reserva de experiencias de la
  venta remota de queso; las otras cuatro siguen en `no comprobado`.
  Evidencia acumulada: 44 `keep` + 10 `merge` + 6 `purge`.
- Tras lote 5c / cierre de queserías de Gran Canaria: **113 filas**; **26
  `verificado`**, **38 `parcial`** y **49 `pendiente`**. Se verifican La
  Caldera, Lomo Gallego y Quesos San Mateo mediante sus canales propios; Finca
  Fuente Morales, La Pastora y Los Castañeros quedan parciales, con actividad
  reciente pero sin canal propio inspeccionable. Se corrigen productos,
  contactos y la dirección de La Caldera, y se distingue a Fuente Morales como
  marca elaborada por Juan Suárez e Hijos sin fusionarla con otra unidad.
  Venta online: La Caldera `sí` por WhatsApp y San Mateo `sí` por teléfono y el
  mercado digital insular; Lomo Gallego `no`; las tres filas parciales quedan
  en `no comprobado`. Evidencia acumulada: 50 `keep` + 10 `merge` + 6 `purge`.
- Tras lote 6a / principales queserías de Fuerteventura: **113 filas**; **29
  `verificado`**, **41 `parcial`** y **43 `pendiente`**. Se verifican Quesos de
  Tetir, Grupo Ganaderos de Fuerteventura–Maxorata y Julián Díaz; La Villa,
  Guriamen y Felipa La Montañeta quedan parciales. Maxorata se traslada de la
  sede comercial de Puerto del Rosario a su centro productivo de Tuineje, y la
  fila ficticia de Felipa en Tiscamanita se reconstruye en Casillas del Ángel.
  Las tres webs propias revisadas no ofrecen pedido remoto: Venta online=`no`;
  el resto queda `no comprobado`. Evidencia acumulada: 56 `keep` + 12 `merge`
  + 6 `purge`.
- Tras lote 6b / cierre de queserías de Fuerteventura: **110 filas**; **30
  `verificado`**, **42 `parcial`** y **38 `pendiente`**. Ganadería La Pared
  queda verificada y Río Cabras, parcial. Se fusionan El Tofio con Grupo
  Ganaderos de Fuerteventura, La Pastorita/Pastorcita con Ganadería La Pared y
  la fila sintética El Río con la identidad real Río Cabras; Cabo Sargento se
  purga por inexistente. La Pared no tiene pedido remoto y Río Cabras queda en
  `no comprobado`. Evidencia acumulada: 58 `keep` + 15 `merge` + 7 `purge`.
- Tras lote 7 / queserías de Lanzarote: **110 filas**; **34 `verificado`**, **44
  `parcial`** y **32 `pendiente`**. Se verifican El Faro, Rubicón, Finca de Uga
  y Montaña Blanca mediante sus webs propias; Flor de Luz queda parcial con
  respaldo institucional y premios de 2026. Tinache también queda parcial: las
  fuentes turísticas y municipales aún lo recogen, pero un directorio lo marca
  cerrado y no hay actividad reciente suficiente para resolver la
  contradicción. Rubicón vende por ecommerce y WhatsApp; El Faro tiene la
  tienda temporalmente desactivada, y Finca de Uga y Montaña Blanca solo
  publican venta física. Se corrigen direcciones, contactos, productos y
  enlaces inventados en las seis filas. Evidencia acumulada: 64 `keep` + 15
  `merge` + 7 `purge`.
- Tras lote 8 / charcutería, pan y pastelería: **102 filas**; **35
  `verificado`**, **52 `parcial`** y **15 `pendiente`**. San Antonio queda
  verificada con pedido ecommerce; Los Nueces, Terorero, Nublo, Antoñita,
  Doramas, Amaro, la dulcería del Mercado de Haría y La Paneteca quedan
  parciales. Terorero, Nublo y Amaro admiten encargos por teléfono y el mercado
  digital insular. Se corrigen cuatro municipios o identidades, se fusiona la
  panadería genérica de Ingenio con Amaro y se purgan siete filas sintéticas
  sin productor demostrable. Se renombran tres imágenes válidas y se eliminan
  dos asociadas a purgas. Evidencia acumulada: 73 `keep` + 22 `merge` + 14
  `purge`.
- Tras lote 9 / bebidas y categorías minoritarias: **100 filas**; **46
  `verificado`**, **54 `parcial`** y **0 `pendiente`**. Se verifican Finca La
  Laja, Arehucas, Tenefé, Mieles Tejeda, Jaira, Galotia, Janubio, Aloe Plus,
  Nao, Vidaloe y Salinas del Carmen; El Almendro de Guayadeque y Sidra Niebla
  quedan parciales por depender de fuentes institucionales o de terceros.
  Galotia se corrige de la capital a Santa Lucía de Tirajana y la miel
  genérica de Guayadeque se migra a la identidad real de Ingenio. Se purgan
  Aloe Vera Las Palmas, inexistente, y El Matorral, cuya web demuestra que es
  una empresa de Almáchar (Málaga); también se elimina la imagen asociada a
  esta última. Se resuelven los canales remotos como ecommerce, marketplace,
  teléfono, correo o WhatsApp cuando la fuente lo ofrece expresamente.
  Evidencia acumulada: 86 `keep` + 24 `merge` + 16 `purge`.
- Tras lote 10 / cierre transversal: **100 filas**; **50 `verificado`**, **50
  `parcial`** y **0 `pendiente`**. Las 14 filas parciales heredadas quedan
  reabiertas y documentadas: Flor Valsequillo, Arquegran, El Roque y El Parral
  pasan a verificadas mediante canales propios; las demás conservan `parcial`
  con respaldo institucional actual. Se revisa la venta remota en todas ellas,
  se corrigen webs, teléfonos, direcciones y canales, y cada una recibe un
  registro `keep`. Resultado provincial de venta: 33 `sí`, 32 `no` y 35 `no
  comprobado`. Las seis advertencias geográficas restantes son distancias de
  15,7–19,1 km al centroide en municipios extensos; las ubicaciones
  contrastadas pertenecen al municipio declarado y no se alteran para forzar
  el centroide. Evidencia final: 100 `keep` + 24 `merge` + 16 `purge`, sin
  avisos de contrato y sin filas supervivientes carentes de decisión.

## Riesgos provinciales

1. **Filas heredadas con datos plausibles pero no demostrados.** Horarios,
   correos, redes y direcciones deben retirarse si no pertenecen claramente a
   la entidad.
2. **Duplicados en lácteos.** La carga desde World Cheese Awards se solapa con
   queserías anteriores; resolver identidad antes de verificar el bloque.
3. **Tres islas con fuentes distintas.** Gran Canaria, Lanzarote y
   Fuerteventura requieren cotejo con sus cabildos, consejos reguladores y
   canales propios; una ficha registral solo permite `parcial`.
4. **Venta online sin revisar.** Las 122 filas iniciales estaban en `no
   comprobado`; cada lote debe revisar el pedido remoto independientemente de
   la identidad.
5. **Categorías de riesgo.** Charcuterías, carnicerías, aloe y nombres
   genéricos de panadería deben demostrar elaboración propia para permanecer.

## Plan de lotes

| Lote | Alcance | Estado |
|---|---|---|
| 1 | Duplicados evidentes de queserías | cerrado 2026-07-19 |
| 2 | Bodegas de Gran Canaria | cerrado 2026-07-19 |
| 3 | Bodegas de Lanzarote | cerrado 2026-07-19 |
| 4 | Bodegas de Fuerteventura + aceites | cerrado 2026-07-19 |
| 5 | Lácteos y quesos de Gran Canaria | cerrado 2026-07-19 |
| 6 | Lácteos y quesos de Fuerteventura | cerrado 2026-07-19 |
| 7 | Lácteos y quesos de Lanzarote | cerrado 2026-07-19 |
| 8 | Charcutería + pan y pastelería | cerrado 2026-07-19 |
| 9 | Bebidas y categorías minoritarias | cerrado 2026-07-19 |
| 10 | Cierre transversal: 14 parciales heredados, venta, geo y enlaces | cerrado 2026-07-19 |

Los lotes se pueden subdividir cuando aparezcan purgas, fusiones o evidencia
contradictoria. Una pasada solo se cierra con cero `pendiente`, todos los
residuales explicados y `npx pnpm verify:data` correcto.

## Ola 3 — venta-sin-resolver

- Cerrado el 2026-07-29: se revisaron las 35 ventas `no comprobado` y se
  resolvieron 31: 1 `sí` y 30 `no`.
- Hacienda Jiménez - Tres Olivos pasa a `sí` por `email`: su web propia
  vigente publica una llamada explícita «Hacer pedido» que abre un formulario
  operativo. La fuente propia permite también elevar la ficha a `verificado`.
- Se cierra `no` en los demás casos revisados cuando los canales actuales solo
  ofrecen venta directa física, distribución, visitas, catálogo o contacto
  general, sin mecanismo público de pedido remoto.
- Quedan 4 `no comprobado`: El Chupadero (HTTP 522), Puro Rofe (dominio sin
  resolución), Quesos La Villa (fallo TLS) y Quesería Tinache (actividad
  contradictoria).
- Snapshot provincial: 51 `verificado`, 49 `parcial`; venta 34 `sí`, 62 `no`
  y 4 `no comprobado`.
