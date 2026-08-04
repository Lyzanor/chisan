# Verificación provincial de Huesca

Ledger para planificar y reanudar la primera pasada profunda de
`data/csv/aragon/huesca.csv`. El CSV es la fuente de verdad y la evidencia por
decisión vive en `data/evidence/aragon/huesca.jsonl`.

El procedimiento general es `docs/es/VERIFICATION_TECHNIQUES.md`; este documento
solo conserva el snapshot, los riesgos locales, el alcance exacto y el avance.
Los contratos son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote pendiente
   de menor número. No releer el CSV, el JSONL o este documento completos.
2. Confirmar que Huesca no tiene cambios concurrentes y localizar únicamente
   los slugs del lote en CSV, evidencia, candidatos e imágenes.
3. Resolver primero exclusiones, duplicados y enlaces ajenos. Después comprobar
   identidad, actividad productora y municipio; auditar venta online aparte.
4. Detener la investigación cuando la decisión sea sólida. No completar campos
   opcionales ni imágenes salvo que cambien la decisión o queden huérfanos.
5. Editar quirúrgicamente con un parser CSV, mantener LF y añadir o sustituir
   una línea JSONL por decisión con `reviewedBy: "codex-huesca-2026-07"`.
6. Actualizar solo el snapshot, la fila del lote y las excepciones reutilizables.
   Validar el lote antes de pasar al siguiente.

No se tocan filas de otro lote «de paso». Un hallazgo cruzado se anota aquí y se
resuelve en su lote. Los lotes solo se recalculan tras purgas o merges.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con un bloqueo real documentado; `parcial` es un
  cierre válido cuando existe un techo registral, secundario o técnico real.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Todos los `Venta online=sí|no` están demostrados y cada `sí` tiene un canal
  válido; la reventa independiente no cuenta como venta del productor.
- No quedan duplicados editoriales, enlaces ajenos ni imágenes huérfanas. CSV y
  evidencia están reconciliados y `npx pnpm verify:data` termina sin incidencias
  atribuibles a Huesca.
- `data/evidence/coverage.json` solo se actualiza al cerrar la pasada completa.

## Estado

- Inicio: **2026-07-15**. Modo: primera pasada profunda de las 114 filas
  heredadas; no se añaden candidatos nuevos antes del cierre transversal.
- Snapshot inicial: **114 filas**; **79 `pendiente`, 1 `parcial`, 34
  `verificado`**. Las 35 filas no pendientes se reauditan con el mismo estándar.
- Venta online inicial: **114 `no comprobado`**. Toda decisión de venta debe
  resolverse independientemente de la verificación de identidad.
- Categorías principales: Bodega 26; Lácteos y quesos 19; Charcutería 10; Pan y
  pastelería 9; Aceite 7; Miel, Cerveza artesana y Trufa y setas 5 cada una; y
  28 filas repartidas entre categorías menores.
- Cobertura inicial: web 105/114, Instagram 53/114, Facebook 1/114, Google Maps
  114/114, teléfono 109/114, correo 103/114, coordenadas 107/114 e imagen 46/114.
  No se enriquecen imágenes en esta pasada; solo se retiran o renombran al
  purgar, fusionar o corregir un slug.
- Evidencia inicial: no existe ledger provincial. Huesca no figura en
  `data/evidence/coverage.json` y no existe nota de candidatos provincial.
- Calidad inicial: contrato con **0 errores y 0 avisos**; auditoría de calidad
  con **0 errores y 1 aviso**. El aviso de `eboca` es un homónimo territorial:
  Cuarte es la localidad incorporada al municipio de Huesca, no Cuarte de
  Huerva, y se corrige en el índice de overrides al cerrar HU-01.
- Tras HU-01 (2026-07-15): **114 filas**; **70 `pendiente`, 2 `parcial`, 42
  `verificado`**. Nueve fichas quedan verificadas con ecommerce propio y Eboca
  añade además suscripción; Azafrán de Sobrarbe queda parcial y `no comprobado`
  porque la actividad reciente solo está sostenida por fuentes institucionales
  y su dominio termina en una imagen 404 ajena. Venta provincial: **9 `sí`** y
  **105 `no comprobado`**. Se corrigieron cuatro teléfonos, dos correos, dos
  direcciones y el enlace HTTPS de Molino de Bolea. El override de Cuarte elimina
  el falso aviso geográfico y la auditoría provincial queda en 0 incidencias.
- Tras HU-02 (2026-07-15): **113 filas**; **57 `pendiente`, 4 `parcial`, 52
  `verificado`**. Las 12 fichas del lote quedan en 9 verificadas y 3 parciales;
  además se elimina una fila duplicada de Melsa reservada inicialmente para
  HU-11. Venta provincial: **15 `sí`, 3 `no`, 95 `no comprobado`**; el lote
  confirma 6 ecommerce y 3 casos sin pedido remoto. «El Gnomo del Pirineo» se
  corrige a la identidad pública Chocolates de la Abuela y Melsa se consolida en
  el slug histórico `embutidos-melsa`; ambos cambios dejan registro `merge`.
  Ternera Valle de Aísa se mueve de la tienda de Jaca a la sede ganadera de Aísa.
- Tras HU-03 (2026-07-15): **113 filas**; **47 `pendiente`, 5 `parcial`, 61
  `verificado`**. El lote cierra 9 fichas verificadas y Granja Alto Aragón
  parcial; venta provincial: **20 `sí`, 7 `no` y 86 `no comprobado`**. Se
  corrige Helados Elarte desde la tienda minorista de Huesca al obrador de
  Bierge, La Despensa de Matilde pasa a comida preparada y se elimina la
  atribución no sustentada de huevos camperos en la explotación de Castiello.
  Cinco productores acreditan pedido remoto: cuatro ecommerce y la compra
  directa de Ingrávida por teléfono o correo.
- Tras HU-04 (2026-07-15): **112 filas**; **38 `pendiente`, 5 `parcial`, 69
  `verificado`**. Las ocho fichas conservadas quedan verificadas: seis con
  ecommerce y dos sin pedido remoto. Venta provincial: **26 `sí`, 9 `no` y 77
  `no comprobado`**. Se purga Avi Selection porque es una tienda agregadora de
  marcas ajenas, no el productor de platos preparados descrito por la fila.
  Horno de Leña Esplús se corrige al obrador de Binéfar al que trasladó en 2022
  su producción especializada de magdalenas.
- Tras HU-05 (2026-07-15): **111 filas**; **29 `pendiente`, 5 `parcial`, 77
  `verificado`**. Las ocho queserías conservadas quedan verificadas; cuatro
  mantienen ecommerce, Villa Villera no ofrece pedido remoto y O Xortical,
  ValdeCinca y Queso d’Estrabilla quedan `no comprobado` por cierres temporales
  o falta de un mecanismo actual inequívoco. Venta provincial: **30 `sí`, 10
  `no` y 71 `no comprobado`**. Quesos Benabarre se purga tras el cierre
  definitivo por jubilación comunicado en abril de 2026.
- Tras HU-06 (2026-07-15): **111 filas**; **18 `pendiente`, 7 `parcial`, 86
  `verificado`**. Nueve fichas quedan verificadas y Chesitas y Clavería
  Barrabés, parciales. Venta provincial: **39 `sí`, 10 `no` y 62 `no
  comprobado`**; las nueve ventas resueltas son ocho ecommerce y los pedidos de
  Edra por correo. La Fábrica de Naval pasa a Dulces y repostería, Navasal se
  normaliza como Salinar de Naval y se retira el dominio secuestrado de
  Clavería Barrabés.
- Tras HU-07 (2026-07-15): **111 filas**; **8 `pendiente`, 9 `parcial`, 94
  `verificado`**. Ocho fichas quedan verificadas y Blacko Truffles y Pacharán
  Layán, parciales por falta de fuente primaria útil. Venta provincial: **44
  `sí`, 13 `no` y 54 `no comprobado`**; Sommos, Arilo, Rondadora, Borda y
  Tensina acreditan ecommerce. Se corrige la sede de Tensina a Pigüelo 16 y se
  retira la web vacía de Blacko.
- Tras HU-08 (2026-07-15): **111 filas**; **0 `pendiente`, 15 `parcial`, 96
  `verificado`**. El lote cierra con 3 verificadas y 6 parciales; El Benasqués
  se rebaja desde el `verificado` heredado por falta de fuente primaria actual.
  Venta provincial: **46 `sí`, 13 `no` y 52 `no comprobado`**; Bal de Broto
  acredita ecommerce y Quesos de Senz pedido telefónico desde sus fichas. Se
  geocodifican las tres queserías verificadas y se retiran los dominios caídos
  de Mas del Tano y Quesos Carlina.
- Tras HU-09 (2026-07-15): **111 filas**; **0 `pendiente`, 15 `parcial`, 96
  `verificado`**. Las diez fichas heredadas conservan el nivel verificado;
  nueve acreditan ecommerce propio o promovido por el productor y Familia
  Estrada Palacio queda `no comprobado`. Venta provincial: **55 `sí`, 13 `no`
  y 43 `no comprobado`**. Tolosana se mueve del despacho histórico al obrador
  del polígono Canal de Monegros y corrige teléfono, mapa y coordenadas.
- Tras HU-10 (2026-07-15): **111 filas**; **0 `pendiente`, 15 `parcial`, 96
  `verificado`**. Las diez fichas conservan el nivel verificado; ocho acreditan
  ecommerce y Meler y Vilas quedan sin venta remota. Venta provincial: **63
  `sí`, 15 `no` y 33 `no comprobado`**. Blecua sustituye su dominio roto por la
  ficha oficial de González Byass y corrige la dirección productiva.
- Tras HU-11 (2026-07-15): **110 filas**; **0 `pendiente`, 18 `parcial`, 92
  `verificado`**. El lote cierra con 9 verificadas, 3 parciales y la purga de
  Sabor de Pirineo por ser una tienda agregadora, no un elaborador. Venta
  provincial: **71 `sí`, 15 `no` y 24 `no comprobado`**; ocho fichas acreditan
  pedido remoto. Trufa Negra del Pirineo corrige la unidad heredada de Guaso a
  Finca Las Hifas, Aínsa, y El Rinconer pasa del falso obrador de pan sin gluten
  a su producción real, La Miel de Cris.
- Tras HU-12 (2026-07-15): cierre transversal con **110 filas**, **92
  `verificado`, 18 `parcial` y 0 `pendiente`**; venta provincial: **71 `sí`, 15
  `no` y 24 `no comprobado`**. Las 110 filas tienen un `keep` vigente y el
  ledger suma cinco tombstones trazables: dos merges y tres purgas. No hay
  slugs ni nombres normalizados duplicados; el único teléfono compartido es el
  contacto legítimo de Viñas del Vero y Blecua. De 92 webs enlazadas, 83
  responden directamente, ocho bloquean la auditoría automatizada con 403 y
  Mimes conserva el 503 ya documentado; se retira el dominio sin DNS de
  Ingrávida y se mantienen por HTTP dos sitios cuyo HTTPS está mal configurado.
  La provincia entra en cobertura estricta y las auditorías provincial de
  contrato, calidad, evidencia e imágenes cierran con 0 incidencias.
- Tras HU-13 (2026-07-29): la Ola 3 revisa las **24** ventas no resueltas y
  cierra ocho como `no`; venta provincial: **71 `sí`, 23 `no` y 16 `no
  comprobado`**. Permanecen ambiguas las tiendas cerradas temporalmente, los
  dominios rotos y los casos sin canal propio suficiente.

## Reglas locales

- **Cuarte:** conservar la localidad publicada por Eboca. El centroide correcto
  es el de Cuarte (Huesca), no el municipio zaragozano Cuarte de Huerva.
- **Núcleos submunicipales:** el roster usa localidades como Ceresa, Costean,
  Algayón, Buisán, Fosado, Enate o Valonga. No sustituirlas automáticamente por
  el municipio administrativo si la fuente propia usa el núcleo y la ubicación
  es inequívoca.
- **Somontano:** pertenecer a una DO o aparecer en un directorio confirma como
  máximo lo publicado. La ficha institucional no sustituye actividad propia
  actual ni demuestra ecommerce.
- **Venta remota:** las tiendas de terceros que revenden vinos, quesos o trufa
  no cuentan. Exigir tienda propia, canal promovido por el productor o tienda
  oficial de la DO/cooperativa colectiva.
- **Dominio roto:** un fallo de web no prueba cierre. Contrastar redes,
  directorios institucionales y actividad reciente antes de degradar o purgar.

## Lotes

| Lote | Alcance | Iniciales | Estado | Resultado |
|---|---|---:|---|---|
| HU-01 | `almalech` → `carnicas-ferrer` | 10 | ✅ 2026-07-15 | 9 verificadas, 1 parcial y 9 ventas remotas |
| HU-02 | `elaborados-julian-mairal` → `embutidos-melsa` | 12 | ✅ 2026-07-15 | 9 verificadas, 3 parciales, 6 ecommerce y 2 merges |
| HU-03 | `valle-de-pineta-berries` → `ingravida-la-marmita` | 10 | ✅ 2026-07-15 | 9 verificadas, 1 parcial y 5 ventas remotas |
| HU-04 | `mermeladas-elasun` → `avi-selection` | 9 | ✅ 2026-07-15 | 8 verificadas, 1 purga y 6 ecommerce |
| HU-05 | `quesos-guara` → `quesos-de-radiquero` | 9 | ✅ 2026-07-15 | 8 verificadas, 1 cierre y 4 ecommerce |
| HU-06 | `mallata-gratal` → `bodega-el-vino-del-desierto` | 11 | ✅ 2026-07-15 | 9 verificadas, 2 parciales y 9 ventas remotas |
| HU-07 | `bodega-sommos` → `queso-de-la-litera` | 10 | ✅ 2026-07-15 | 8 verificadas, 2 parciales y 5 ecommerce |
| HU-08 | `la-canabla` → `casa-bergua-queseria` | 9 | ✅ 2026-07-15 | 3 verificadas, 6 parciales y 2 ventas remotas |
| HU-09 | `bodegas-alodia` → `bodegas-lalanne` | 10 | ✅ 2026-07-15 | 10 verificadas, 9 ecommerce y 1 venta no comprobada |
| HU-10 | `bodega-laus` → `pasteleria-vilas` | 10 | ✅ 2026-07-15 | 10 verificadas, 8 ecommerce y 2 sin venta remota |
| HU-11 | `panaderia-lartica` → `el-colmenar-de-angel` | 13 | ✅ 2026-07-15 | 9 verificadas, 3 parciales, 1 purga y 8 ventas remotas |
| HU-12 | Auditoría transversal, candidatos diferidos y cierre | variable | ✅ 2026-07-15 | 0 duplicados, cobertura 110/110 y auditorías limpias |
| HU-13 | Ola 3: residual `venta-sin-resolver` | 24 | ✅ 2026-07-29 | 8 ausencias de venta remota demostradas y 16 ambigüedades conservadas |

## Incidencias reutilizables

- **Azafrán de Sobrarbe:** la actividad se sostiene con fuentes institucionales
  y presencia en la feria de otoño de 2025, pero el dominio heredado redirige a
  una imagen 404 genérica. No tratar el fallo como cierre ni como venta online.
- **Melsa:** las filas `embutidos-melsa` y `embutidos-melsa-graus` eran la misma
  unidad de C/ Barranco 38-40. Se conserva el slug histórico más simple y la
  identidad pública Embutidos Artesanos Melsa.
- **Chocolates de la Abuela:** los enlaces y la ubicación de la fila heredada
  «El Gnomo del Pirineo» pertenecían al obrador de Hostal de Ipiés; se corrigió
  identidad y slug en HU-02.
- **Helados Elarte:** la fila heredada apuntaba a una heladería minorista de
  Huesca. La fuente propia sitúa el obrador y la fabricación en Bierge; la
  página denominada «Tienda» es un directorio de locales físicos, no ecommerce.
- **Granja Alto Aragón:** registros actuales sostienen una explotación avícola
  intensiva en Castiello de Jaca, pero no una oferta comercial directa ni la
  mención heredada «huevos camperos»; queda parcial y sin resolver venta online.
- **Horno de Leña Esplús:** conserva la marca histórica, pero trasladó el
  obrador a Binéfar en 2022 y desde 2014 está especializado en magdalenas; se
  corrigen municipio, sede, mapa, coordenadas y catálogo.
- **Avi Selection:** la web demuestra un ecommerce de selección y reventa de
  múltiples marcas, no elaboración propia de croquetas o platos preparados.
  Se purga como no productor y se retira su imagen huérfana.
- **Quesos Benabarre:** Juan José Baró y Pilar Marqués cerraron definitivamente
  Granja La Fondaña por jubilación tras la última elaboración, anunciada el 1
  de abril de 2026; se purga la fila en vez de mantener directorios desfasados.
- **Tiendas queseras temporales:** O Xortical declara el ecommerce cerrado
  durante el verano y la tienda externa de ValdeCinca está «cerrada por
  descanso». Ninguna se registra como venta activa mientras no acepte pedidos.
- **Queso d’Estrabilla:** el dominio correcto y vigente es `.com`; el `.es`
  heredado redirige a contenido SEO ajeno. El WhatsApp general se conserva como
  contacto, pero no basta por sí solo para acreditar pedido remoto.
- **Chesitas:** el registro aragonés y el portal turístico del valle sostienen
  el obrador y sus productos, pero `chesitas.com` no resuelve. Se conserva como
  parcial sin enlazar el dominio ni resolver venta online.
- **Clavería Barrabés:** figura en el registro artesano de 2025 para los vinos
  Zinca y Bin de Ric, pero su antiguo dominio sirve hoy contenido de apuestas en
  chino. Se retira el enlace por seguridad y queda parcial con contacto
  registral.
- **Blacko Truffles:** el catálogo TuberLabel sostiene plantación, actividad
  estacional y contacto en Nachá, pero la web responde vacía. Se retira el
  enlace y queda parcial sin resolver el canal de pedido.
- **Pacharán Layán:** continúa en el registro artesano de 2025 y en el
  directorio institucional de la Hoya, pero su dominio no resuelve. La evidencia
  secundaria permite conservarlo como parcial, no verificar actividad primaria
  ni venta remota.
- **Mas del Tano:** el directorio institucional y un catálogo quesero de 2025
  chocan con un directorio general que lo marca cerrado y un dominio que no
  resuelve. Sin anuncio fiable de cierre ni fuente primaria actual, queda
  parcial y se retira la web.
- **Casa Bergua:** la sociedad existe y obtuvo calificación ambiental para una
  quesería en Viu de Linás, pero el BOA de enero de 2026 todavía condiciona el
  comienzo a una licencia de inicio. Se describe como proyecto y queda parcial
  hasta acreditar elaboración efectiva.
- **Pastelería Tolosana:** la fila apuntaba al despacho de C/ Izquierdo y a
  coordenadas fuera de Almudévar. La sede y el obrador publicados están en el
  polígono Canal de Monegros, parcela C-1; se usa esa unidad productiva.
- **Blecua:** el antiguo dominio redirige a una página 404 de González Byass.
  Se usa la ficha oficial actual del grupo, que además fija la bodega en el km 3
  de la carretera Barbastro-Naval; la tienda del grupo vende el vino Blecua.
- **Pastelería Vilas:** el dominio sigue sirviendo la web por HTTP, pero su
  certificado HTTPS caducó en 2018. Se conserva el enlace HTTP funcional; el
  catálogo solo describe productos y no admite pedidos remotos.
- **Ingrávida / La Marmita:** identidad, actividad y compra directa quedan
  sustentadas por la web propia recientemente indexada y el directorio de
  productores de Sobrarbe, pero el dominio dejó de resolver por DNS en las
  variantes raíz y `www`. Se retira el enlace sin interpretar el fallo como
  cierre y se conservan teléfono, correo e Instagram vigentes.
- **HTTP heredado funcional:** Aguardientes y Licores Colungo sirve HTTP pero su
  certificado HTTPS no cubre el dominio; Bolets La Mandraula sirve HTTP pero
  falla la negociación TLS. Como en Pastelería Vilas, se conserva el enlace
  funcional y se documenta la excepción en evidencia.
- **Sabor de Pirineo:** la web propia se define como selección y tienda de
  productos de distintos elaboradores. Se purga la atribución heredada de
  fabricación de embutidos porque es un comercio agregador, no un productor.
- **Trufa Negra del Pirineo:** las condiciones propias sitúan la unidad en Finca
  Las Hifas, carretera Aínsa-Margudgued-Boltaña km 5. Se corrige la ubicación
  heredada de Guaso a Aínsa y se actualizan dirección, mapa y coordenadas.
- **Láctea Altoaragón:** se conserva como cooperativa de recogida y
  comercialización de leche de socios, pero no se atribuye elaboración propia
  local de quesos sin fuente primaria; su actividad empresarial declarada es
  mayorista.
