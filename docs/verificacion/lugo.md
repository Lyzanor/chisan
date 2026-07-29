# Verificación provincial de Lugo

Ledger para planificar y reanudar la primera pasada profunda de
`data/csv/galicia/lugo.csv`. El CSV es la fuente de verdad y la evidencia por
decisión vive en `data/evidence/galicia/lugo.jsonl`.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
solo fija el snapshot, los riesgos locales y el alcance exacto de cada lote.
Los contratos son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote activo.
2. Confirmar que ninguna fila de Lugo tiene cambios concurrentes.
3. Investigar primero exclusiones, duplicados y unidad productiva; detenerse
   cuando identidad, actividad productora y municipio tengan evidencia suficiente.
4. Resolver `Venta online` de forma independiente. Una tienda de un proyecto
   relacionado o un revendedor no demuestra venta remota de la fila.
5. Editar el CSV de forma estructurada, añadir o sustituir una línea JSONL por
   decisión y actualizar aquí el resumen del lote.
6. Pasar `check:csv:changed`, `check:evidence`,
   `check:evidence:changed` y `git diff --check`. El cierre pasa
   `verify:data`.

No se tocan filas de otro lote «de paso»: los hallazgos cruzados se anotan para
su lote. Los lotes se recalculan solo después de merges o purgas.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con bloqueo real documentado; `parcial` es un
  resultado final válido cuando la evidencia tiene un techo registral o secundario.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Identidad, obrador/municipio, categoría, enlaces y contactos pertenecen al
  productor; los fallos técnicos no se interpretan como cierre.
- Todos los `Venta online=sí|no` están demostrados y los `sí` tienen canal.
- No quedan duplicados editoriales ni imágenes huérfanas; evidencia y CSV están
  reconciliados y `pnpm verify:data` termina sin incidencias de Lugo.
- Lugo se añade a `data/evidence/coverage.json` solo al cerrar la pasada.

## Estado

- Inicio: **2026-07-16**. Modo: continuar la primera pasada profunda de las
  **141 filas** existentes; no añadir candidatos nuevos hasta el cierre.
- Snapshot inicial: **141 filas**; **60 `pendiente`, 35 `parcial`, 46
  `verificado`**.
- Venta online inicial: **5 `sí`, 1 `no`, 135 `no comprobado`**.
- Pendientes iniciales por categoría: Lácteos y quesos 13; Bodega 12; Miel 8;
  Charcutería 7; Pescado 5; Pan y pastelería 4; Cerveza artesana 2; y 9
  categorías con una fila.
- Evidencia inicial: **45 `keep` y 1 `merge`**. Lugo no figura todavía en
  `data/evidence/coverage.json`.
- El árbol tenía trabajo concurrente en Sevilla al iniciar; queda expresamente
  fuera de este expediente.
- Tras LU-01 (2026-07-16): **141 filas**; **48 `pendiente`, 36 `parcial`,
  57 `verificado`**. Las 12 fichas se conservaron: 11 verificadas y Don
  Gabino parcial por techo institucional al no poder leerse su web con
  certificado inválido. Venta online: **11 `sí`, 1 `no`, 129 `no
  comprobado`**; se acreditaron cinco ecommerce y Airas Moniz quedó resuelta
  como pedido telefónico. Evidencia acumulada:
  **57 `keep` y 1 `merge`**. No hubo cambios de slugs ni imágenes.
- Tras LU-02 (2026-07-16): **141 filas**; **36 `pendiente`, 38 `parcial`,
  67 `verificado`**. Las 12 bodegas se conservaron: 10 verificadas y Guímaro
  y Lucenza parciales por techo secundario. Venta online: **19 `sí`, 1
  `no`, 121 `no comprobado`**; quedaron acreditados ocho ecommerce propios
  o de grupo oficial. Evidencia acumulada: **69 `keep` y 1 `merge`**. No
  hubo cambios de slugs ni imágenes.

## Reglas y riesgos locales

1. En queserías DOP, el consejo regulador confirma inscripción, identidad y
   ubicación, pero sin fuente primaria actual suele dejar techo `parcial`.
2. En Ribeira Sacra, distinguir bodega, marca, razón social y viñedo. El
   directorio del consejo no demuestra por sí solo actividad actual ni venta.
3. En miel y pequeñas explotaciones, un programa institucional acredita lo que
   publique, pero no convierte una ficha histórica en actividad primaria actual.
4. En pescado, separar armador, lonja, mayorista, comercializadora y elaborador:
   solo la unidad productora o transformadora entra en catálogo.
5. La tienda de Muuhlloa vende cosmética y productos de Milhulloa; no demuestra
   por sí sola venta online de la leche o yogures de Granxa Maruxa.
6. Una plataforma con cuenta, condiciones de venta o catálogo sin precio y sin
   pedido utilizable no basta para `Venta online=sí`.
7. Revisar específicamente los dos avisos geográficos anotados en candidatos:
   Mel Casa Miranda y A Carqueixa.

## Worklist

Tamaño objetivo: 6–12 filas, agrupadas por categoría y fuente común.

| Lote | Alcance | Filas iniciales | Estado | Riesgo principal |
|---:|---|---:|---|---|
| LU-00 | Higiene, snapshot y partición | 141 | ✅ 2026-07-16 | Sevilla concurrente aislada; 60 pendientes |
| LU-01 | Queserías y lácteos principales | 12 | ✅ 2026-07-16 | 11 verificadas, 1 parcial; 6 ventas remotas resueltas |
| LU-02 | Bodegas pendientes | 12 | ✅ 2026-07-16 | 10 verificadas, 2 parciales y 8 ecommerce |
| LU-03 | Miel + aromáticas | 9 | ✅ 2026-07-16 | 9 verificadas, 7 ventas remotas y 2 municipios corregidos |
| LU-04 | Charcutería + huevos | 8 | ✅ 2026-07-16 | 7 verificadas, 1 parcial y 7 ecommerce/canales directos |
| LU-05 | Pescado + conservas | 6 | ✅ 2026-07-16 | 3 verificadas y 3 purgas por cierre/alcance |
| LU-06 | Pan, cerveza, café y chocolate | 8 | ✅ 2026-07-16 | 7 verificadas, 1 parcial y 7 ecommerce |
| LU-07 | Lácteo residual + despensa y huerta | 5 | ✅ 2026-07-16 | 5 verificadas y 4 ventas remotas |
| LU-08 | Reauditoría de parciales, enlaces, geografía y cobertura | 36 | ✅ 2026-07-16 | 35 keeps revisados, 1 cierre, cobertura estricta |

## LU-01 — Queserías y lácteos principales

Decisiones cerradas el 2026-07-16:

- `verificado` + ecommerce: Daniberto, Don Crisanto, Prestes, Lácteos Lorán y
  Queixos Castelo de Brañas.
- `verificado` + pedido por teléfono: Airas Moniz.
- `verificado`, venta no comprobada: Casleiras, Leitigal, Arqueixal, Sen Máis
  y Granxa Maruxa.
- `parcial`, venta no comprobada: Don Gabino. El directorio municipal y el
  consejo regulador confirman obrador y actividad, pero la web propia no fue
  legible por un certificado incompatible.

Incidencias reutilizables:

- Sen Máis usa una plataforma de comercio, pero la ficha revisada no ofrecía
  precio ni carrito; se mantiene `no comprobado`.
- La tienda de Muuhlloa acredita la relación y la actividad de Granxa Maruxa,
  pero su ecommerce es de cosmética/plantas, no de los lácteos de esta fila.
- Airas Moniz publica un teléfono específico de pedidos, suficiente para canal
  `telefono` aunque no haya carrito.

## LU-02 — Bodegas pendientes

Decisiones cerradas el 2026-07-16:

- `verificado` + ecommerce: Abadía da Cova/Adegas Moure, Regina Viarum,
  Rectoral de Amandi, Algueira, Vía Romana, Finca Míllara, Casa Moreiras y Pazo
  de La Cuesta.
- `verificado`, venta no comprobada: Adega Tear y Condado de Sequeiras.
- `parcial`, venta no comprobada: Guímaro y Lucenza.

Incidencias reutilizables:

- Las tiendas oficiales de los grupos HGA, Vinos y Bodegas Gallegas y Méndez
  Rojo cuentan como canal del productor cuando la propia bodega las enlaza y la
  referencia está disponible con carrito.
- Condado de Sequeiras muestra botones «Comprar», pero la propia página aclara
  que la venta online estará disponible próximamente; prevalece la ausencia de
  pedido actual.
- Guímaro conserva dominio propio, pero solo muestra mantenimiento. La fuente
  sectorial actual confirma elaboración y municipio, sin elevarla sobre el
  techo parcial.
- Lucenza permanece parcial: consejo regulador y prensa reciente sostienen la
  ficha, pero no tiene fuente primaria propia ni venta remota demostrada.

## LU-03 — Miel y aromáticas

Decisiones cerradas el 2026-07-16:

- Las nueve fichas quedaron `verificado`.
- Venta remota acreditada: Milhulloa mediante la tienda colectiva oficial de
  Muuhlloa (`marketplace`); Mel do Neira, Colmenar Melcellus, Toxal Riba y Mel
  Melosa mediante ecommerce propio; Mel Casa da Torre por WhatsApp/email; Mel
  Casa Miranda por teléfono/email con envíos bajo consulta.
- Apiocastro y Abella Meiga quedan con venta `no comprobado`: sus fuentes
  confirman productor, contacto y ubicación, pero no un pedido remoto concreto.
- Se corrigieron dos municipios y slugs sin alterar las coordenadas: Mel do
  Neira pasó de Becerreá a **Baralla** (`mel-do-neira-baralla`) porque Valados y
  Neira de Rei pertenecen a ese concello; Mel Casa Miranda pasó de O Corgo a
  **Baleira** (`mel-casa-miranda-baleira`) porque Mendreiras y A Marronda están
  en Baleira. Ambas correcciones llevan `merge` e imagen renombrada.
- Apiocastro actualizó móvil y correo desde su contacto oficial; Melcellus
  actualizó la dirección a Carretera de San Pedro 63 desde su web y aviso legal.

Estado tras LU-03: **141 filas**; **27 `pendiente`, 38 `parcial`, 76
`verificado`**. Venta online: **26 `sí`, 1 `no`, 114 `no comprobado`**.
Evidencia acumulada: **78 `keep` y 3 `merge`**.

## LU-04 — Charcutería y huevos

Decisiones cerradas el 2026-07-16:

- `verificado` + ecommerce: Traloagro, Embutidos Suarna, Casa Castelao,
  Jamones González, Cárnicas Teijeiro y Pazo de Vilane.
- `verificado` + ecommerce/WhatsApp/teléfono: A Carqueixa.
- `parcial`, venta no comprobada: Capones de Vilalba Maricarmen. La actividad
  estacional y Vilalba están sostenidas por prensa/directorio, pero el dominio
  propio no fue legible y no se confirmó pedido actual.
- A Carqueixa conserva municipio Cervantes, pero deja de mostrar como dirección
  productiva su puesto de la plaza de abastos de Lugo: se usa la sede de Casa
  Rectoral, San Román, con el centroide de referencia de Cervantes.
- Cárnicas Teijeiro pasa de la carnicería minorista de Calvo Sotelo/Liberdade a
  la fábrica y sala de despiece de San Lázaro 15, Sarria, con contacto productivo.
- Casa Castelao corrige el CP a 27116; Embutidos Suarna actualiza móvil y correo.
- Pazo de Vilane no vende huevos por ecommerce, pero sí mermeladas elaboradas
  con fruta propia y ya incluidas en la ficha; por ello la venta online cuenta.

Estado tras LU-04: **141 filas**; **19 `pendiente`, 39 `parcial`, 83
`verificado`**. Venta online: **33 `sí`, 1 `no`, 107 `no comprobado`**.
Evidencia acumulada: **86 `keep` y 3 `merge`**.

## LU-05 — Pescado, conservas y Fontecelta

Decisiones cerradas el 2026-07-16:

- `verificado` + ecommerce/email/teléfono: Conservas Faro de Burela. Su
  tienda propia ofrece catálogo, precios y carrito, además de contacto para
  gestionar envíos; se actualizan HTTPS y correo.
- `verificado`, venta no comprobada: Fontecelta y Armadores de Burela - ABSA.
  Fontecelta mantiene manantial y planta de envasado en Céltigos; se corrigen
  CP y correo. ABSA se conserva como colectivo directamente formado por
  armadores y vinculado a su flota, no por su papel de gestora de la lonja;
  se actualiza la dirección a Puerto Pesquero s/n.
- Purga `closed`: Conservas Curricán. La producción cesó definitivamente a
  mediados de diciembre de 2025 por jubilación de sus propietarias.
- Purga `not-producer`: De la Lonja a la Mesa y Pescados Chileno. Sus propias
  fuentes describen compra/comercialización, acondicionamiento y distribución
  de pescado de lonja, sin captura, cría ni elaboración propia dentro del
  alcance del catálogo. Se eliminan también sus dos imágenes.

Estado tras LU-05: **138 filas**; **13 `pendiente`, 39 `parcial`, 86
`verificado`**. Venta online: **34 `sí`, 1 `no`, 103 `no comprobado`**.
Evidencia acumulada: **89 `keep`, 3 `merge` y 3 `purge`**.

## LU-06 — Pan, cerveza, café y chocolate

Decisiones cerradas el 2026-07-16:

- `verificado` + ecommerce: Daveiga - Mariñeiras, Cervexa Artesá Aloumiña,
  Bubela Artesá, Panadería Pallares, Confitería La Alianza, Cafés Candelas y
  Bombones Moreno.
- `parcial`, venta no comprobada: Panadería Suso. Dos fuentes secundarias
  actuales sostienen la panadería y Friol, pero no se pudo leer una fuente
  primaria suficiente; el reparto local citado no acredita pedido remoto.
- Daveiga actualiza HTTPS, correo y su dirección registral a la parcela A-3 D;
  su tienda propia actual sustituye el antiguo estado sin venta directa.
- Aloumiña pasa al dominio vigente `aloumiña.gal` (codificado en el CSV), con
  correo y tienda propia. Bubela normaliza HTTPS.
- Pallares añade correo y confirma ecommerce/envíos en el año de su 150
  aniversario. La Alianza y Candelas actualizan HTTPS y correo.
- La identidad comercial actual de Chocolates Moreno es **Bombones Moreno**;
  se conserva el slug ligado a la sociedad, se actualiza el nombre visible y
  la unidad de Ramón González 8 con teléfono, correo, web y tienda propios.
- Panadería Suso actualiza su unidad a Polígono A Gándara, parcela 28, y añade
  el correo publicado por los directorios actuales.

Estado tras LU-06: **138 filas**; **5 `pendiente`, 40 `parcial`, 93
`verificado`**. Venta online: **41 `sí`, 1 `no`, 96 `no comprobado`**.
Evidencia acumulada: **97 `keep`, 3 `merge` y 3 `purge`**.

## LU-07 — Lácteo residual, despensa y huerta

Decisiones cerradas el 2026-07-16:

- Las cinco fichas quedan `verificado`: Terras da Mariña, Alibós Galicia,
  Champivil, A Horta da SancoVeiga y Queserías Sarrianas.
- Ecommerce acreditado: Terras da Mariña y Queserías Sarrianas. Champivil
  añade soporte por WhatsApp; A Horta da SancoVeiga añade WhatsApp y correo.
- Alibós queda con venta `no comprobado`: produce y transforma castaña de sus
  soutos y de terceros en Monterroso, pero el catálogo visible está orientado
  a industria, restauración y exportación, sin pedido minorista utilizable.
- Champivil corrige el CP de Mourence a 27280 y actualiza horario y teléfono al
  móvil de atención por WhatsApp publicado en su tienda actual.
- Queserías Sarrianas deja de ser una ficha genérica de un premio: se completa
  con la unidad de San Salvador do Mato, productos, teléfono, correo, HTTPS y
  ecommerce propio con transporte en frío.
- A Horta da SancoVeiga mantiene sus datos, sostenidos por fuente primaria y
  por el programa provincial 2026, que confirma horta/avicultura ecológicas,
  Vilalba, contacto y reparto.

Estado tras LU-07: **138 filas**; **0 `pendiente`, 40 `parcial`, 98
`verificado`**. Venta online: **45 `sí`, 1 `no`, 92 `no comprobado`**.
Evidencia acumulada: **102 `keep`, 3 `merge` y 3 `purge`**.

## LU-08 — Reauditoría y cierre provincial

Decisiones cerradas el 2026-07-16:

- Se revisaron las 36 fichas que todavía no tenían un `keep` propio de esta
  pasada. Las 35 conservadas quedaron reconciliadas uno a uno con el CSV.
- Se purgó `confiteria-madarro-lugo` como `closed`: la sociedad entró en
  concurso en 2024 y en enero de 2026 se subastó, ya vacío, el local que había
  alojado la confitería.
- Se rebajaron a `parcial` Casa Ánxel, Fabas Francisca, Horta Valego,
  Queixería Valado y Mel O Trobo. Las fuentes registrales/sociales sostienen su
  identidad, pero una web caída o la falta de fuente primaria actual impide
  sostener `verificado`.
- Se acreditaron 14 ventas remotas adicionales: Catadoiro, Granxa Casa da
  Fonte, Casa de Outeiro, Atrium Vitis, Val de Quiroga, Aceiroga, Diqueixa,
  Maeloc, Alma das Donas, Don Bernardino, Adega Cruceiro, Bodegas Petrón,
  Bodega Nogueira y Casa Zolle.
- Se actualizaron direcciones productivas o contactos de Fontelas, Mazarico,
  Casa de Outeiro, Val de Quiroga, Diqueixa, Quescrem, Alma das Donas y otras
  fichas con fuente oficial actual.
- Las referencias genéricas del Consejo Regulador de Ribeira Sacra que daban
  404 se sustituyeron por su endpoint CSV oficial vigente. Los 45 resultados
  `parcial` se consideran finales válidos por techo de evidencia, no trabajo
  pendiente.
- Reconciliación final: **137 filas, 137 `keep`, 0 slugs duplicados, 0 filas
  sin evidencia y 0 discrepancias entre CSV y decisión**. Lugo se incorpora a
  `data/evidence/coverage.json` como provincia estricta.

Estado final: **137 filas**; **0 `pendiente`, 45 `parcial`, 92
`verificado`**. Venta online: **59 `sí`, 1 `no`, 77 `no comprobado`**.
Evidencia acumulada: **137 `keep`, 3 `merge` y 4 `purge`**.

## LU-09 — Ola 3 de venta sin resolver

Decisiones cerradas el 2026-07-29:

- Se resolvieron tres ventas remotas: Fontelas Queixería acepta pedidos por
  teléfono; O Galeirón mantiene productos de miel disponibles en su tienda
  propia; y Adegas e Viñedos Lareu publica encargos por teléfono, email y
  WhatsApp, con móvil y correo actualizados.
- Se retiraron los dominios caídos de Casa Ánxel y Rectoral de Gundivós sin
  convertir el fallo técnico en una decisión de venta. La segunda conserva
  respaldo vigente del Consejo Regulador.
- Adega Tear y Condado de Sequeiras normalizan HTTPS. La tienda vacía de la
  primera y el aviso de «próximamente» de la segunda no acreditan compra
  actual, por lo que ambas siguen `no comprobado`.
- Maeloc pasa de la categoría impropia `Bodega` a `Otros`: el producto y la
  actividad descritos son sidra, no vino.

Estado tras LU-09: **137 filas**; **0 `pendiente`, 45 `parcial`, 92
`verificado`**. Venta online: **62 `sí`, 1 `no`, 74 `no comprobado`**.
Evidencia acumulada: **137 `keep`, 3 `merge` y 4 `purge`**.
