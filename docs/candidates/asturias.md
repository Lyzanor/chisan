# Asturias — plan de verificación por lotes

> Ledger operativo iniciado el **2026-07-11**. El CSV sigue siendo la fuente de
> verdad y `data/evidence/asturias/asturias.jsonl` guardará las decisiones. Esta
> nota solo conserva el plan, las incidencias compartidas y el progreso.

## Línea base

- CSV: `data/csv/asturias/asturias.csv`.
- 410 filas: **1 `verificado` · 213 `parcial` · 196 `pendiente`**.
- Sin ledger de evidencia provincial al inicio.
- Las 173 promociones a `parcial` del commit `9091a49` fueron mecánicas
  (coordenadas + enlaces + descripción + contacto/social), no verificaciones
  editoriales con los tres claims actuales. Todas deben revisarse.
- Familias iniciales, disjuntas por prioridad: 136 con algún enlace propio o
  mixto; 91 con `gapmedia.es`; 70 de importación Maps con CP en el slug; 36 con
  nombre registral/certificación; 33 del registro Faba; 27 del registro Sidra;
  8 del sello de morcilla/chorizo; 9 sin canal propio.

## Definición de «completado»

1. No quedan filas sin decisión editorial revisada en esta pasada.
2. `pendiente` solo sobrevive si se documenta un bloqueo real; `parcial` es un
   cierre válido cuando el techo es registral o secundario.
3. Cada cambio de verificación, venta, purga o merge tiene registro JSONL.
4. Enlaces ajenos se eliminan; los fallos técnicos no se convierten en bajas.
5. Duplicados, no productores, cierres y fuera de provincia se resuelven antes
   de medir cobertura.
6. Cada lote pasa `check:csv:changed`, `check:evidence:changed` y `diff --check`;
   el cierre provincial pasa `verify:data`.

## Orden de trabajo

Los lotes se recalculan después de merges/purgas. Tamaño objetivo: **10–16
filas**; se permite un lote mayor cuando una única fuente regulatoria resuelve
un bloque homogéneo.

### Fase 0 — higiene y riesgo alto

- [x] **AST-00 — fuente y estructura**: confirmar propiedad de dominios
  compartidos (`gapmedia.es`, Faba, Sidra y sello cárnico), detectar municipios
  corruptos y fijar las fuentes oficiales que se reutilizarán.
- [x] **AST-01 — duplicados exactos A**: La Boalesa, Alta Sierra/AST,
  Arango/Ca'l Caseiro/Cárnicas Arango, El Remediu, Naveda, Gastro Garden,
  Finca La Huerta y Pablo Álvarez/Casa Gómez.
- [x] **AST-02 — duplicados exactos B**: Collera, L'Arbeyal, La Collada,
  Picurriellu/Valle Oscuru, Casa Martín, Molín del Medio/Valle de Peón,
  Novalín/Orizón y Val de Boides/Zapica.
- [x] **AST-03 — filas corruptas y `Venta online` heredada**: corregir los cinco
  municipios que contienen CP/email; auditar las 20 filas `sí` y 25 filas `no`
  iniciales (42 decisiones residuales después de AST-01/02).

### Fase 1 — canales propios o claramente atribuibles (familia inicial: 136)

- [x] **AST-10 — bodegas**: nueve filas residuales del bloque provincial.
- [x] **AST-11 — bebidas y café**: 15 filas residuales revisadas.
- [x] **AST-12 — pescado y conservas**: 10 filas residuales revisadas.
- [x] **AST-13 — lácteos con canal propio y duplicados**: 10 filas revisadas.
- [x] **AST-14 — carne/charcutería con canal propio**: 10 filas revisadas.
- [x] **AST-15 — carne/charcutería residual con canal público**: 11 filas.
- [x] **AST-16 — miel/huevos con canal público**: 16 filas revisadas.
- [x] **AST-17 — fruta/verdura con canal propio**: 16 filas revisadas.
- [x] **AST-18 — pan/dulces y preparados con canal propio**: 16 filas.
  Una fuente oficial actual puede cerrar identidad, actividad y municipio; la
  venta se decide por separado.

### Fase 2 — directorio heredado `gapmedia.es` (familia inicial: 91)

- [x] **AST-20 — cárnicos, preparados y primeras legumbres**: 16 fichas
  heredadas resueltas como 15 unidades actuales.
- [x] **AST-21 — primeras queserías DOP**: 15 unidades de Cabrales, Gamonéu y
  Afuega'l Pitu revisadas y normalizadas.
- [x] **AST-22 — segundas queserías**: 15 unidades de Gamonéu, Cabrales, Los
  Beyos y lácteos artesanos revisadas.
- [x] **AST-23 — terceras queserías**: 15 fichas resueltas como 14 unidades;
  se consolidó el duplicado de Toriello.
- [x] **AST-24 — cárnicos certificados y primeras fabas**: 15 unidades
  revisadas y normalizadas.
- [x] **AST-25 — fabas residuales**: último lote del directorio heredado,
  agrupado por consejo o
  categoría. `gapmedia.es` no se conservará como web del productor si no le
  pertenece. Buscar primero canal propio; si solo queda ficha institucional o
  consejo regulador, el techo es `parcial`.

### Fase 3 — importación Maps con CP en slug (familia inicial: 70)

- [x] **AST-30 — primera importación Maps**: 14 fichas de quesos, miel,
  charcutería y arándanos revisadas.
- [x] **AST-31 — segunda importación Maps**: 11 fichas de fruta, huerta y queso
  revisadas y normalizadas.
- [x] **AST-32 — obradores y productores residuales Maps**: nueve fichas
  revisadas, incluida la sucesión Endúlzame → Orígenes en Vegadeo.
- [x] **AST-33 — queserías, miel y transformados**: diez fichas resueltas como
  nueve productores actuales y un consorcio comercial fuera de alcance.
- [x] **AST-34 — último lote recalculado de fase 3**: ocho fichas de Faba
  Asturiana normalizadas y tres bloqueos reales conservados como pendientes.

### Fase 4 — bloques regulatorios homogéneos

- [x] **AST-40 a AST-42 — certificaciones mixtas**: 36 filas (DOP/IGP/COPAE y
  Alimentos del Paraíso) que no hayan entrado en fases anteriores.
- [x] **AST-43 a AST-45 — Faba Asturiana IGP**: 33 filas, lotes de 11. El
  registro prueba lo que publique, pero no actividad actual ni venta por sí
  solo; comprobar aliases/marcas antes de conservar dos unidades.
- [x] **AST-46 a AST-48 — Sidra de Asturias DOP**: 27 filas, lotes de 9. Separar
  marca comercial, llagar y razón social; revisar los tres grupos con teléfono
  compartido antes de decidir merges.
- [x] **AST-49 — sello cárnico**: 8 filas de morcilla/chorizo, con cruce contra
  charcuterías ya existentes.

### Fase 5 — residuales y cierre

- [x] **AST-50 — sin canal propio**: 9 filas iniciales y cualquier residual
  que quede sin evidencia suficiente.
- [x] **AST-51 — reconciliación**: roster final, evidencia↔CSV, enlaces ajenos,
  coordenadas/municipio, `Venta online` y canales.
- [x] **AST-52 — imágenes**: solo para identidades y slugs estabilizados; no
  bloquear el cierre editorial si no hay activo usable.
- [x] **AST-53 — puerta final**: `npx pnpm verify:data`, resumen de purgas,
  merges, verificaciones, parciales y bloqueos justificados.

## Incidencias iniciales

- Municipios corruptos: `ca-llechi-queso-casin-d-o-p-callechi-hotmail`,
  `industrias-carnicas-tineo-33877`, `embutidos-el-horreo-33199`,
  `cafes-batrakof-33580`, `cafes-oquendo-33192`.
- Hay 16 grupos con teléfono exacto compartido. Coincidencia de teléfono es
  señal de revisión, no prueba automática de merge.
- `gapmedia.es` aparece como `web` en 91 filas y debe evaluarse como fuente
  común, no asumirse como sitio oficial individual.
- La métrica de salida no será «todo verificado»: será **todo revisado y con la
  decisión más fuerte que permita la evidencia**.

## Registro de avance

| Lote | Estado | Filas iniciales | Resultado | Validación |
|---|---:|---:|---|---|
| AST-00 | completado | 161 enlaces | Retiradas 161 webs ajenas o colectivas; 410 filas intactas | `check:csv:changed` |
| AST-01 | completado | 17 | 9 unidades: 6 verificadas, 3 parciales; -8 filas y 11 merges trazables | CSV + evidence OK |
| AST-02 | completado | 18 | 10 unidades: 4 verificadas, 6 parciales; -8 filas y 15 merges trazables | CSV + evidence OK |
| AST-03 | completado | 47 incidencias | 5 municipios corruptos + 42 ventas residuales; 1 cierre, 2 slugs geográficos extra, 40 verificadas totales | CSV + evidence OK |
| AST-10 | completado | 9 bodegas | 7 verificadas, 1 parcial; -1 cierre, 5 ventas online y 5 slugs/identidades corregidos | CSV + evidence OK |
| AST-11 | completado | 15 bebidas/cafés | 12 verificadas, 1 parcial, 1 pendiente justificada; -1 cierre, 9 ecommerce y 10 slugs/identidades corregidos | CSV + evidence OK |
| AST-12 | completado | 10 pescado/conservas | 9 verificadas; -1 no productor, 6 ecommerce, 2 ventas presenciales y 7 slugs corregidos | CSV + evidence OK |
| AST-13 | completado | 10 lácteos | 7 unidades: 5 verificadas, 2 parciales; -3 duplicados netos, 4 ecommerce y 2 ventas presenciales | CSV + evidence OK |
| AST-14 | completado | 10 carne/charcutería | 7 verificadas, 2 parciales y 1 pendiente; 5 ecommerce, 1 venta presencial y 9 slugs corregidos | CSV + evidence OK |
| AST-15 | completado | 11 carne/charcutería | 7 verificadas y 4 parciales; 6 ventas remotas, 5 slugs corregidos y ningún cierre inferido de fallos técnicos | CSV + evidence OK |
| AST-16 | completado | 16 miel/huevos | 14 unidades: 13 verificadas y 1 parcial; -1 actividad cerrada, -1 duplicado neto, 9 ventas remotas y 15 slugs trazados | CSV + evidence OK |
| AST-17 | completado | 16 fruta/verdura | 14 verificadas y 2 parciales; 10 ventas remotas, 2 ventas presenciales y 14 slugs trazados | CSV + evidence OK |
| AST-18 | completado | 16 pan/dulces/preparados | 15 unidades verificadas; -1 duplicado neto, 14 ventas remotas, 1 presencial y 11 slugs trazados | CSV + evidence OK |
| AST-20 | completado | 16 fichas `gapmedia` | 15 unidades: 7 verificadas y 8 parciales; -1 duplicado neto, 3 ventas remotas y 15 slugs trazados | CSV + evidence OK |
| AST-21 | completado | 15 queserías DOP | 15 verificadas; 1 venta presencial, 15 identidades/concejos y 15 slugs trazados | CSV + evidence OK |
| AST-22 | completado | 15 queserías/lácteos | 10 verificadas y 5 parciales; 4 ventas remotas y 15 identidades/concejos trazados | CSV + evidence OK |
| AST-23 | completado | 15 fichas queseras | 14 unidades: 10 verificadas y 4 parciales; -1 duplicado neto y 15 slugs históricos trazados | CSV + evidence OK |
| AST-24 | completado | 15 cárnicos/legumbres | 7 verificadas y 8 parciales; 3 ventas remotas y 15 identidades/concejos trazados | CSV + evidence OK |
| AST-25 | completado | 15 productores de faba | 1 verificada y 14 parciales; 15 marcas/identidades y concejos trazados | CSV + evidence OK |
| AST-30 | completado | 14 fichas Maps | 8 verificadas y 5 parciales; -1 comercio no productor, 5 ventas remotas y 13 slugs/concejos trazados | CSV + evidence OK |
| AST-31 | completado | 11 fichas Maps | 7 verificadas y 4 parciales; 3 ventas remotas y 11 slugs/concejos trazados | CSV + evidence OK |
| AST-32 | completado | 9 fichas residuales | 7 verificadas y 1 parcial; -1 obrador cerrado, 1 venta remota y 3 slugs/concejos trazados | CSV + evidence OK |
| AST-33 | completado | 10 quesos/miel/transformados | 9 verificadas; -1 mayorista no productor, 4 ventas remotas y 8 slugs/identidades trazados | CSV + evidence OK |
| AST-34 | completado | 11 residuales | 8 productores de faba normalizados y 3 bloqueos reales documentados | CSV + evidence OK |
| AST-40–45/49 | completado por reconciliación | 77 referencias regulatorias iniciales | Cubiertas en los lotes editoriales previos y recontadas contra el roster final, sin unidades huérfanas | CSV + evidence OK |
| AST-46–48 | completado | 27 marcas sidreras | 23 productores actuales; 4 marcas fusionadas con su llagar y contactos contrastados | CSV + evidence OK |
| AST-50 | completado | 45 filas sin `keep` al auditar | 44 unidades actuales reconciliadas y La Corte purgada por cierre; 0 filas actuales sin evidencia | CSV + evidence OK |
| AST-51 | completado | 375 filas | 375 slugs únicos y 375 `keep` únicos; corregido el teléfono erróneo compartido J. Tomás/Vallina | CSV + evidence OK |
| AST-52 | completado | activos locales | Auditoría de imágenes limpia; la baja de Agua de Borines retira su activo huérfano | `check:images` OK |
| AST-53 | completado | puerta provincial | Contrato CSV, imágenes y 5.038 registros de evidencia sin errores ni avisos | `verify:data` OK |

### Hallazgos AST-01

- `Ca'l Caseiro` y Cárnicas Arango son productores distintos; el CSV había
  asignado a Ca'l Caseiro el teléfono de Arango. Se corrigieron teléfono y
  contacto con el directorio vigente de la IGP Chosco de Tineo.
- Se normalizaron tres identidades públicas y sus municipios en slug:
  `alta-sierra-de-tineo`, `gastro-garden-pilona` y
  `finca-la-huerta-navia`.
- Alta Sierra, Cárnicas Arango, El Remediu y Embutidos Naveda tienen tienda
  propia vigente; sus ventas quedan resueltas como `sí|ecommerce`.
- Casa Gómez es la explotación de Pablo Álvarez Fernández en Yerbo; la web
  oficial no publica un mecanismo de pedido remoto y se mantiene `no`.

### Hallazgos AST-02

- El directorio visual de lagares certificados de 2026 separa Sidra J. Tomás
  (marca Molín del Medio) de Sidra Vallina (marca Valle de Peón), aunque publica
  el mismo teléfono. Se conservaron como unidades distintas.
- El mismo registro separa Sidra Buznego (Zapica) de Llagar Castañón (Val de
  Boides). La coincidencia de teléfono no se convirtió en un merge.
- Se corrigieron identidades de marca a productor y municipios en L'Arbeyal,
  La Collada, Casa Martín, Sidra J. Tomás, Sidra Vallina, Sidra Orizón y Sidra
  Buznego.
- El dominio heredado de Quesería La Collada redirigía a un negocio ajeno y se
  retiró. El de Sidra Orizón redirige a su dominio oficial actual `.es` y se
  actualizó.
- Estado tras AST-02: **394 filas · 12 verificadas · 203 parciales · 179
  pendientes**.

### Hallazgos AST-03

- Se corrigieron los cinco slugs contaminados por código postal o correo y,
  durante el control de venta, otros dos errores geográficos: El Sentir de
  Braña está en Tineo (Agüera de Carriles es la localidad) y Arándanos El
  Bregón está en Nava, no en Villaviciosa. COPAE aportó coordenadas y contacto
  actuales para este último.
- Las 18 ventas heredadas como `sí` siguen teniendo un mecanismo remoto
  utilizable. Se tipificaron 16 como ecommerce; El Campón Eco usa
  teléfono/correo/suscripción y Confitería La Playa acepta encargos por correo
  y teléfono, no mediante pasarela de pago.
- Entre los 24 `no` residuales, Diego Verdú ya dispone de ecommerce y seis
  casos sin canal propio comprobable pasaron prudentemente a `no comprobado`.
  El resto conserva `no` tras revisar sus canales vigentes.
- Agua de Borines se eliminó: su propia web declara finalizada la actividad de
  envasado tras la COVID-19. También se retiró su imagen local.
- Estado tras AST-03: **393 filas · 40 verificadas · 176 parciales · 177
  pendientes**; venta online: **28 `sí` · 19 `no` · 346 `no comprobado`**.

### Hallazgos AST-10

- Se sustituyó la identidad histórica de Bodegas Antón Chicote por Casa
  Manunca, que asumió la misma bodega de Limés en 2022. El sitio actual confirma
  actividad y contacto, pero no pedido remoto.
- Se normalizaron al concejo cinco slugs que contenían localidades: La Verdea,
  Monasterio de Corias, VidAs, Vitheras y Casa Manunca.
- La Verdea, Monasterio de Corias, VidAs, Vitheras y Dominio del Urogallo
  mantienen ecommerce utilizable. La tienda enlazada por Siluvio tenía todas
  las referencias agotadas y permanece honestamente en `no comprobado`.
- Bodegas Chacón Buelta se eliminó: figura inactiva, con cierre provisional de
  hoja registral en 2025 y fuera del bloque vigente de bodegas DOP.
- Estado tras AST-10: **392 filas · 47 verificadas · 170 parciales · 175
  pendientes**.

### Hallazgos AST-11

- Scone, Ordum, Asturias Brewing Company y Caleya mantienen tiendas propias
  utilizables. Asgaya y Vagamar están activas, pero sus páginas de tienda no
  permiten hoy completar un pedido concreto; quedan en `no comprobado`.
- Cotoya sigue activa y participa en ToliviaFest 2026. Se corrigieron al
  concejo los slugs de Naviega (`Navia`), Vagamar (`Valdés`) y Cotoya (`Siero`).
- Cerveza Nurse permanece `pendiente`: la marca y su entidad están activas en
  Oviedo, pero un directorio municipal indica que no dispone de fábrica propia
  y no se localizó la unidad productiva; además, su `/shop` devuelve 404.
- El Águila Negra se purgó: la fábrica histórica cerró en 1993 y el edificio
  tiene ahora destino administrativo, por lo que no es un productor vigente.
- Los cinco tostadores revisados tienen ecommerce activo. Mundicafés se movió
  de la ubicación heredada de Trasona a su tostadero vigente en Lugones,
  Siero; Toscaf se normalizó al municipio de Pravia.
- Estado tras AST-11: **391 filas · 59 verificadas · 162 parciales · 170
  pendientes**; venta online: **42 `sí` · 20 `no` · 329 `no comprobado`**.

### Hallazgos AST-12

- Acueo, Conservas Eutimio, Costera, La Polar, El Viejo Pescador y Remo
  disponen de ecommerce propio utilizable. La tienda de Anchoas Hazas tenía
  todo el catálogo agotado y queda prudentemente en `no comprobado`.
- Conservas Laurel y Telva mantienen actividad y catálogo propios, pero no un
  mecanismo de pedido remoto; se clasifican como `no` tras revisar sus canales.
- Pescados La Chucha se eliminó como `not-producer`: su web explica que compra
  el pescado en lonja y lo revende, sin pesca, cultivo ni elaboración propia.
- Se normalizaron al concejo Eutimio y Telva (`Colunga`) y Remo (`Gijón`),
  además de retirar cuatro códigos postales incrustados en slugs.
- Estado tras AST-12: **390 filas · 68 verificadas · 153 parciales · 169
  pendientes**; venta online: **48 `sí` · 22 `no` · 320 `no comprobado`**.

### Hallazgos AST-13

- Se consolidaron tres duplicados editoriales: las dos fichas de Quesu Ovín,
  las dos de Rebollín y las dos de Quesos de Taramundi. Cada familia representa
  una única unidad productiva, no productos distintos.
- Rebollín está en La Espina, concejo de Salas. Quesos de Taramundi conserva
  esa marca, pero su canal propio publica hoy Llano de Castelo, Piantón
  (`Vegadeo`); queda `parcial` por el conflicto con fichas institucionales que
  aún lo sitúan genéricamente en Taramundi.
- Quesería Abredo, La Borbolla, Los Caserinos y Rebollín mantienen ecommerce
  propio. La Chivita y Quesos de Taramundi solo presentan producto/contacto y
  quedan en `no`; Ovín sigue en `no comprobado` por el fallo técnico del dominio.
- Abredo se normalizó a Coaña y La Chivita a Peñamellera Baja; los slugs dejaron
  de incorporar descripciones promocionales o sellos de calidad.
- Estado tras AST-13: **387 filas · 73 verificadas · 145 parciales · 169
  pendientes**; venta online: **52 `sí` · 24 `no` · 311 `no comprobado`**.

### Hallazgos AST-14

- Se corrigieron ocho concejos que contenían localidades o una ubicación
  heredada errónea: ASTURsabor (`Siero`), Carnicerías García (`Carreño`), Casa
  Milia (`Aller`), Pellico (`Cabrales`), Hermanos Cortina (`Teverga`), La
  Aldea (`Tineo`), Productos Artesanos Astur (`Lena`) y Cárnicas Cueva
  (`Siero`). Nueve slugs quedaron normalizados y trazados con `merge`.
- ASTURsabor, Carnicerías García, Casa Milia, Ganadería Aramburu y Embutidos
  La Aldea mantienen ecommerce propio utilizable. Cárnicas Cueva presenta
  fábrica y catálogo, pero no pedido remoto, por lo que queda en `no`.
- Embutidos JP se conserva en Noreña: aunque su web corporativa publica el
  domicilio social y origen en Piloña, la ficha técnica revisada en 2025, la
  marca registrada y su canal comercial atribuyen la planta a Cotobarques
  4–6. Su “tienda” conduce a contacto B2B y no acredita compra online.
- Pellico y Hermanos Cortina quedan `parcial`: identidad, producción y concejo
  están respaldados, pero sus canales no permiten cerrar actividad comercial
  dinámica ni pedido remoto. Productos Artesanos Astur sigue `pendiente`: la
  sociedad presenta actividad mercantil reciente, pero no se encontró un canal
  público actual que confirme producción.
- Estado tras AST-14: **387 filas · 80 verificadas · 138 parciales · 169
  pendientes**; venta online: **57 `sí` · 25 `no` · 305 `no comprobado`**.

### Hallazgos AST-15

- Bioastur figura hoy como cooperativa en Poo (`Llanes`), no como una unidad
  aislada en Porrúa. El dominio propio está aparcado y se retiró, pero el
  registro de economía social mantiene la entidad; por eso queda `parcial`, no
  purgada.
- Embutidos Taramundi S.L. es la razón social que opera públicamente como
  Carnes Los Gallegos en Pravia. Se consolidó esa identidad comercial y su
  ecommerce. También tienen tienda activa Pico de Fiel, Francisco Martínez,
  Embutidos del Río y Santulaya; Casería de los Valles acepta encargos por
  teléfono o correo con entrega acordada.
- El dominio histórico de Francisco Martínez redirige al sitio oficial nuevo y
  vigente. Los fallos TLS/403 de El Bosque de Cardes y Embutidos Belmonte se
  contrastaron con catálogos y registros recientes: ambas empresas se conservan
  `parcial` y sin resolver venta remota.
- Gancedo queda verificado por su canal propio y presencia en la feria de Tineo
  2026, pero transportar a toda España no demuestra por sí solo cómo cursar un
  pedido. Carnicería del Chus permanece `parcial`: elabora preparados bajo
  petición, aunque COPAE la clasifica como comercio.
- Estado tras AST-15: **387 filas · 87 verificadas · 137 parciales · 163
  pendientes**; venta online: **63 `sí` · 25 `no` · 299 `no comprobado`**.

### Hallazgos AST-16

- Olaya Miel y Miel Río Aller son dos marcas del mismo operador, Artesanos de
  Cuevas S.L., y comparten planta en Felechosa. Se consolidaron en una sola
  unidad de Aller, conservando ambas marcas y la tienda activa de Olaya.
- PitaSana se eliminó como productora de huevos: la granja comercial cesó y el
  proyecto actual es Acougo, dedicado a convivencia y actividades rurales y
  culturales. La existencia de gallinas en el espacio no equivale a una venta
  vigente de huevos.
- Zángana, Aula de la Miel, Casa El Campo, Ería de Valles, La Puela, La
  Realera, La Calduya y Artesanos de Cuevas mantienen ecommerce propio. Casa
  Garzea vende sus huevos online mediante marketplace. EcoJusto queda
  `parcial`: COPAE confirma producción en Villaviciosa, pero el dominio falla
  por TLS y no se encontró pedido remoto actual.
- Se corrigieron, entre otros, Villanueva a Santo Adriano, Alles a Peñamellera
  Alta, Fontoria/Luarca a Valdés, Brañes a Oviedo, Centenales y Villares de
  Arriba a Ibias, Sanzo a Pesoz, Villamejín a Proaza y Forniellas a Cangas del
  Narcea. `Valdebueyes` era un topónimo corrupto: Floreziendo está en
  Valdebois, Ibias, confirmado por una actividad institucional de junio de 2026.
- El Curtín de Ibias conserva actividad reciente, pero su tienda devuelve hoy
  404; su venta vuelve a `no comprobado`. Floreziendo, Valles del Trubia y El
  Truébano muestran producción/contacto, no un pedido remoto utilizable.
- Estado tras AST-16: **385 filas · 100 verificadas · 129 parciales · 156
  pendientes**; venta online: **72 `sí` · 25 `no` · 288 `no comprobado`**.

### Hallazgos AST-17

- Se corrigieron varias localidades tratadas como municipio: La Peña pasó a
  Salas; El Berrón y Muñó a Siero; Puerto de Vega a Navia; Alea a
  Ribadesella; Inguanzo a Cabrales; Fuentes a Villaviciosa; y Lugo de Llanera
  a Llanera. Vesana se trasladó de la antigua dirección corporativa de Gijón a
  la planta alimentaria oficial de Luanco (`Gozón`).
- Arándanos del Nora es la misma explotación que hoy publica COPAE y su tienda
  como Finca Santa Rosa. Se normalizó la identidad sin duplicar la unidad.
  Arándanos de Inguanzo y Arándanos de los Picos de Europa, en cambio, se
  conservaron separados: tienen teléfonos y canales públicos distintos.
- Mantienen ecommerce Don Ramiro, Agrecoastur, Arándanos de los Picos de
  Europa, Arándanos y Manzanas de Muñó, El Cierrón, Finca Santa Rosa, El
  Llano y Finca El Ribeiro. Villa Melba y Vesana aceptan pedidos remotos por
  teléfono. El Molín de la Vega y El Caleyu concentran la venta en el mercado
  o la autorrecolección presencial y quedan en `no`.
- El Molín del Bao queda `parcial`: el censo electoral agrario definitivo de
  2025 confirma la sociedad y el concejo de Navia, pero su dominio ya no
  resuelve y la ficha externa que anuncia tienda enlaza precisamente a ese
  canal caído. Golden Berry conserva actividad de physalis integrada en el
  agroturismo actual de la misma titular, sin pedido remoto comprobable.
- Estado tras AST-17: **385 filas · 114 verificadas · 120 parciales · 151
  pendientes**; venta online: **82 `sí` · 27 `no` · 276 `no comprobado`**.

### Hallazgos AST-18

- Asturcilla y Confusión Comidas son dos líneas de Kikiricoop y comparten
  operador y nave en Santolaya de Cabranes. Se consolidaron en una sola unidad
  con comida preparada, catering y crema de avellanas y cacao; ambos canales
  de venta siguen representados en la evidencia.
- Se corrigieron tres ubicaciones que describían tiendas o localidades en vez
  del obrador y el concejo: Cremela produce en Cabranes, no en su heladería de
  Cangas de Onís; Repostería Casino está en Cornellana (`Salas`); y Panadería
  Trubia está en el concejo de Oviedo. Speltastur se normalizó a Lena y VERNA a
  Santo Adriano.
- Tienen ecommerce Carajitos del Profesor, Speltastur, Repostería Casino,
  VERNA, Cremela, Panduru, Camilo de Blas, La Luarquesa y Rustic Queen.
  Kikiricoop combina tienda y WhatsApp; Pachamama y Coquetina trabajan por
  teléfono/correo; Panadería Trubia acepta teléfono/WhatsApp; Limonge toma
  encargos telefónicos.
- El dominio de Pachamama ya no resuelve, pero el canal social, el directorio
  de La Panera y la ficha comercial vigente coinciden en obrador, titulares,
  contacto y trabajo únicamente por pedido. El dominio antiguo de Carajitos
  redirige a una ruta Wix rota: se sustituyó por la tienda Wix funcional.
- Obrador Sisón queda en `no`: su web propia ofrece horario y puntos de venta
  presenciales, pero no pedido remoto ni envío de producto.
- Estado tras AST-18: **384 filas · 129 verificadas · 107 parciales · 148
  pendientes**; venta online: **96 `sí` · 28 `no` · 260 `no comprobado`**.

### Hallazgos AST-20

- El padrón vigente de Chosco de Tineo normaliza San Roque como Aires de San
  Roque y actualiza teléfono y correo. La Tinetense confirma expresamente que
  no tiene pedido web pero sí gestiona pedidos telefónicos; Embutidos Beyo
  publica envío nacional y contacto directo.
- Yolanda Rodríguez Fernández y Fabas El Romeo eran dos filas de una sola
  explotación. El Consejo Regulador publica `El Romeo` como marca de Yolanda
  en Villapedre (`Navia`) y reúne los dos teléfonos, por lo que se consolidaron
  sin arrastrar como vigente la afirmación de venta online de un catálogo de
  2021.
- Se sustituyeron nombres personales o certificaciones incrustadas por cinco
  marcas actuales: Finca La Granda, El Texu, La Salense, Monasterio de Bárcena
  y El Madreñeru. Los concejos se corrigieron a Siero, Salas, Tineo y Pravia
  donde correspondía; el respaldo exclusivamente regulatorio mantiene esas
  fichas en `parcial`.
- FabEo queda verificado en Abres (`Vegadeo`) por la web actual de los mismos
  titulares y el padrón IGP. Finca El Cabillón publica actividad y
  disponibilidad en julio de 2026 y admite pedidos por WhatsApp, correo y
  teléfono. La Mediana conserva su canal social atribuido por el directorio
  comercial y el consejo regulador.
- Torto Astur permanece `parcial` y se le retiró el Facebook ajeno de La
  Cerezal. Haba Garden se corrigió de la localidad Zureda al concejo de Lena,
  pero no se promovió porque las referencias de actividad y reparto halladas
  son históricas y el canal social no permitió comprobar contenido reciente.
- Estado tras AST-20: **383 filas · 136 verificadas · 109 parciales · 138
  pendientes**; venta online: **99 `sí` · 28 `no` · 256 `no comprobado`**.

### Hallazgos AST-21

- El listado certificado de Cabrales permitió separar marca, titular y
  concejo. Ángel Díaz Herrero sigue como marca pública de la quesería cuya
  razón social es Encarnación Bada; Arangas y El Teyedu son dos marcas de la
  unidad de Andrea Fernández en Rozagás (`Peñamellera Alta`). El Colladín, El
  Duje, Dionisia López, Ganadería Rieses y Juan José Bada se normalizaron a
  `Cabrales` en vez de usar Tielve o Sotres como municipio.
- Cueva del Molín figura en el padrón actual en Carreña, no en Póo de
  Cabrales. El registro y el mapa se actualizaron sin convertir esa corrección
  cercana en una falsa duplicidad.
- La ruta histórica de El Huervu en el Consejo de Gamonéu publica hoy la
  identidad La Huertona, con teléfono y correo nuevos. Corao, El Recuestu y
  Gumartini pertenecen a `Cangas de Onís`; Cuevas de Quiliama, La Huertona y
  Enrique Remis a `Onís`.
- Ca Sanchu sigue entre las siete queserías activas de Afuega'l Pitu en 2026.
  La ficha turística oficial limita la comercialización publicada a tiendas,
  mercado de Grado y visitas, por lo que queda `no` en venta remota; no se
  extrapoló ese criterio a las otras queserías sin una declaración equivalente.
- Estado tras AST-21: **383 filas · 151 verificadas · 105 parciales · 127
  pendientes**; venta online: **99 `sí` · 29 `no` · 255 `no comprobado`**.

### Hallazgos AST-22

- La Casina de Cebia, La Llosa, La Solana, Pastora Mayor y Pregondón se
  conservaron `parcial`: existen identidad y ubicación coherentes, pero no se
  confirmó su certificación o actividad actual con la misma fuerza que en el
  padrón regulatorio. En particular, la antigua ruta de La Solana en la web de
  Gamonéu muestra hoy otra quesería, por lo que se retiró la afirmación DOP.
- La Cuerre y La Desña se normalizaron a `Onís`; La Torre, Vega de Fana,
  Priédamu y Priena a `Cangas de Onís`; La Pandiella, Los Puertos, La Llosa y
  Pastora Mayor a `Cabrales`. Miyares se corrigió como localidad de La
  Saregana dentro de `Sariego`.
- La Pandiella y Vega de Fana tienen producto atribuible en marketplaces
  actuales. Picu'l Sella fue el único elaborador de Beyos reconocido en el
  concurso de 2025 y conserva venta en marketplace. La Saregana mantiene
  ecommerce propio con preparación semanal y envío refrigerado.
- Los Puertos se vinculó a la elaboradora Rosa Bada Herrero mediante el padrón
  certificado; no se confundió la marca comercial con una segunda quesería.
- Estado tras AST-22: **383 filas · 161 verificadas · 103 parciales · 119
  pendientes**; venta online: **103 `sí` · 29 `no` · 251 `no comprobado`**.

### Hallazgos AST-23

- Las dos fichas heredadas de Quesería Toriello correspondían al mismo obrador
  de Igena y se consolidaron en una sola unidad de Cangas de Onís, manteniendo
  la identidad y los contactos publicados por el Consejo Regulador.
- D'Onao, Toriello, Uberdón, Vega Ceñal y Vega de Ario figuran en el padrón
  vigente de elaboradores de Gamonéu. Rojo Prieto, Valfríu y Vicente Tolosa se
  confirmaron en el padrón actual de Cabrales.
- Quesera del Cares mantiene web propia y actividad quesera pública; Temia
  aparece entre los elaboradores activos del certamen Afuega'l Pitu de 2026.
- Bárcena, Rogelio López Campo, Soberón y Trestayéu se conservaron `parcial`:
  mantienen identidad pública y localización coherente, pero no se confirmó su
  condición de elaboradores certificados en el padrón vigente consultado.
- Estado tras AST-23: **382 filas · 171 verificadas · 100 parciales · 111
  pendientes**; venta online: **103 `sí` · 29 `no` · 250 `no comprobado`**.

### Hallazgos AST-24

- Las seis fichas cárnicas se normalizaron a sus empresas y concejos reales:
  El Chico y Enastur en Noreña, El Cuco en Oviedo, La Unión en Salas, Vallina
  en Castrillón y Maybe en Siero. Todas mantienen actividad pública y figuran
  en la Marca de Garantía de chorizo y morcilla asturianos.
- Vallina mantiene ecommerce propio mediante Puxa. El Cuco admite encargos por
  teléfono y correo a través de Bienastur. Una búsqueda adicional localizó la
  tienda propia de Fabas La Rasa, por lo que también quedó `sí|ecommerce`.
- La Rasa se verificó además por su web propia y por el Consejo Regulador. Las
  otras siete explotaciones incluidas en el listado de venta primaria se
  dejaron prudentemente `parcial` cuando no había una segunda señal dinámica.
- Fabes El Moreno conserva identidad histórica y contacto en Villaviciosa,
  pero no aparece en el listado actual de venta primaria; se mantuvo `parcial`
  sin atribuir certificación vigente.
- Estado tras AST-24: **382 filas · 178 verificadas · 108 parciales · 96
  pendientes**; venta online: **106 `sí` · 29 `no` · 247 `no comprobado`**.

### Hallazgos AST-25

- Once fichas se reconciliaron con el listado actual de venta primaria de Faba
  Asturiana: Fabes El Curro, Casa Isabelina, Finca Pando, Huert La Vega, Ca
  Manuel, Asturian Beans, El Dorado, Fabas de Llazán, Fabas Tayón, La Sienrina
  y Huerta Orizón.
- Ganadería Moneda, José Antonio Fernández Rodríguez, José Manuel García García
  y Mª Alejandra García-Braga conservaron identidad y contacto históricos, pero
  no aparecen en el listado vigente; quedaron `parcial`, sin inferir cierre.
- Se corrigió el homónimo territorial de El Dorado: Lino González Rodríguez
  produce en Ḷḷanteiru, Tineo. La ficha heredada apuntaba a Villar de Lantero,
  Cangas del Narcea, por lo que se sustituyeron dirección y coordenadas.
- Fabas Tayón mantiene web propia y se verificó como unidad de Riberas, Soto
  del Barco. Su sitio no ofrecía un mecanismo de pedido inequívoco y la venta
  remota quedó `no comprobado`.
- Estado tras AST-25: **382 filas · 179 verificadas · 122 parciales · 81
  pendientes**; venta online: **106 `sí` · 29 `no` · 247 `no comprobado`**.

### Hallazgos AST-30

- Quesería Cabrales 106 se purgó: su web propia y el directorio comercial de
  Gijón la describen como tienda minorista de productos asturianos y tablas por
  encargo, no como unidad elaboradora.
- Quesos de Pría se trasladó de la tienda heredada de Camango a su fábrica de
  La Pesa de Pría, Llanes. La Fontona se normalizó a Cudillero, La Aldeana a
  Llanes y Caxigón a Cabrales.
- Quesos de Pría y Caxigón tienen producto atribuible en marketplaces; La
  Aldeana y Miel y Enjambres mantienen ecommerce. El Colmenar de Carlos declara
  distribución nacional e internacional y pedido por contacto telefónico.
- Duxemiel y Arándanos Pravia se verificaron con señales públicas actuales.
  Miel de Pueblo, Estrella Polar, Cuna y Cenera, Embutidos Laviana y Monte
  Vidal quedaron `parcial` por falta de una fuente primaria actual suficiente.
- Estado tras AST-30: **381 filas · 187 verificadas · 127 parciales · 67
  pendientes**; venta online: **111 `sí` · 30 `no` · 240 `no comprobado`**.

### Hallazgos AST-31

- Se corrigieron cuatro municipios heredados desde localidades o asignaciones
  erróneas: El Puerto está en Valdés, Camín La Playa en Villaviciosa, La Fuelga
  en Ribera de Arriba y Huerta La Enredadera en Corvera de Asturias. Asiegu se
  normalizó al concejo de Cabrales y Castañedo al de Cudillero.
- COPAE aportó identidad, contacto y coordenadas actuales para Arándanos El
  Bondeyo, Huerta La Curtia, Finca La Fuelga, Huerta La Enredadera, La Güerta
  Monga y Quesería Asiegu. El Bondeyo pertenece hoy a Finca Mazaira, S.L., no a
  la razón social heredada DYPWEB S.L.
- Las Hortalizas del Valle y Quesería Asiegu mantienen ecommerce propio con
  productos, precios y envío; Huerta La Enredadera vende mediante la tienda de
  pod. No se atribuyó venta remota a las huertas que solo publican finca,
  mercado o reparto sin mecanismo inequívoco de pedido.
- El Puerto, Camín La Playa, Huerto Las Canaleas y Verduras Maite quedaron
  `parcial`: sus identidades y concejos son coherentes, pero falta una señal
  primaria actual suficiente. El fallo técnico del sitio de Verduras Maite no
  se interpretó como cierre.
- Estado tras AST-31: **381 filas · 194 verificadas · 131 parciales · 56
  pendientes**; venta online: **114 `sí` · 30 `no` · 237 `no comprobado`**.

### Hallazgos AST-32

- El obrador Endúlzame entró en disolución voluntaria en 2023. Una ficha
  agregada aún conserva el nombre histórico, pero sus propias reseñas de 2026
  identifican el negocio actual como Orígenes; la prensa confirma que Andrea
  Castón y Luis Santiago abrieron Orígenes en diciembre de 2025 aprovechando un
  obrador ya equipado. Se conservó la unidad actual y se purgó la cerrada.
- El Despacho y La Trilla mantienen actividad panadera actual en Gijón y
  Oviedo. Boutique del Pan Hermanos Muñiz se normalizó de Candás a Carreño y
  Capiquera de Ceceda a Nava; esta última sigue presente en la planificación
  local de 2027.
- Casa El Cuarto estrenó sitio propio en 2025 y ofrece envío de carne ecológica
  a toda España coordinando pedidos por teléfono o correo; se normalizó Mieldes
  al concejo de Cangas del Narcea.
- Miel El Sastre participó en la presentación del Festival Brasas del Narcea de
  junio de 2026 y quedó verificada. Embutidos Novac se mantuvo `parcial`: se
  corrigieron teléfono, dirección y concejo, pero no apareció una fuente
  primaria actual suficiente.
- Estado tras AST-32: **380 filas · 201 verificadas · 132 parciales · 47
  pendientes**; venta online: **115 `sí` · 30 `no` · 235 `no comprobado`**.

### Hallazgos AST-33

- El Viso y La Peñona se normalizaron a los concejos de Salas y Pravia;
  Sobrecueva figura en el padrón actual de Gamonéu y Victoriano López se
  confirmó como elaborador de Cabrales en Sotres, concejo de Cabrales.
- Santolaya mantiene ecommerce propio para arroz con leche y yogures artesanos.
  Miel de Pertierra se vinculó a la explotación familiar Hermanos Pertierra y a
  la IGP Miel de Asturias, con producto disponible en marketplace.
- Salsas Clavero admite pedidos de productos a la carta por teléfono o correo.
  Quesería Artesanal Lazana tiene producto atribuible en marketplace; su dominio
  propio devolvió 502 y se conservó, sin convertir el fallo en una baja.
- Industrias Lácteas Monteverde se normalizó a su marca pública Queso Tres
  Oscos y a la fábrica de Grandas de Salime. Su web oficial actual no ofrece
  pedido remoto. CATA se purgó: IDEPA lo define como consorcio mayorista con
  sede en Siero, no como unidad elaboradora en Cabrales.
- Estado tras AST-33: **379 filas · 210 verificadas · 132 parciales · 37
  pendientes**; venta online: **119 `sí` · 31 `no` · 229 `no comprobado`**.

### Hallazgos AST-34

- Las ocho fichas heredadas con nombres personales y localidades en el slug se
  normalizaron a sus marcas públicas: Cantona, La Campella, Del Valle, Finca La
  Villa, Palacio de Cotalban, Finca Robledo, El Ventolín y Vegargüelles.
- El padrón actual del consejo regulador corrigió Foyedo a Tineo; Frejulfe y
  Anleo a Navia; Argüelles/Fuentespino a Siero; Cadavedo y Tablizo a Valdés.
  Al ser la única fuente pública actual para siete explotaciones, se mantuvo el
  techo editorial `parcial`.
- Sociedad Civil San Martín no se fusionó con Palacio de Cotalban: el consejo
  la mantiene como envasadora propia en Argüelles, y la fuente histórica
  documenta su marca Vegargüelles y la agrupación de seis productores. Quedó
  `parcial` por la antigüedad de esa segunda fuente.
- Productos Artesanos Astur, Cerveza Nurse y Cafés Batrakof permanecen
  `pendiente`: ya cuentan con evidencia de bloqueo concreta y no se encontró
  prueba pública actual suficiente para resolver su unidad productora.
- Estado tras AST-34: **379 filas · 210 verificadas · 140 parciales · 29
  pendientes**; venta online: **119 `sí` · 31 `no` · 229 `no comprobado`**.

### Hallazgos AST-46 a AST-48

- Las 27 marcas del bloque sidrero se resolvieron como 23 productores actuales.
  G. Costales quedó integrado en Sidra Frutos y otras tres marcas se enlazaron
  con el llagar que las elabora, evitando duplicar marca, empresa y productor.
- El directorio regulatorio de febrero de 2026 confirmó actividad, marcas,
  dirección y certificación; se buscaron señales propias o públicas adicionales
  antes de elevar cada unidad por encima de `parcial`.
- Sidra Muñiz continúa activa, pero se retiró la atribución DOP heredada al no
  figurar como certificada en el padrón actual.
- La coincidencia telefónica entre Sidra J. Tomás y Sidra Vallina era un error
  del PDF agregado: la ficha individual del Consejo Regulador y el sitio de
  Vallina confirman `985 894 052`; J. Tomás conserva `985 894 119`.

### Hallazgos AST-50 a AST-52

- La auditoría de cobertura detectó 45 filas actuales sin un registro `keep`.
  Se revisaron por lotes: 44 se conservaron con evidencia y La Corte se purgó
  porque fuentes de 2025 documentan su cierre y señalan solo dos queserías
  activas de Quesu Casín.
- Se corrigieron identidades, concejos o slugs heredados en productores como
  Quesería Maín, Quesu de Porrúa, El Cabriteru, Demués, Leche Leche, Kiwis de
  Alvariza, Eco Kiwi, Helados Helio Hermanos y Pomares Dulces. Cada cambio de
  slug histórico tiene su `merge`.
- La revisión transversal termina con **375 filas y 375 registros `keep`
  únicos**, sin duplicados de slug ni de teléfono. Recuento editorial:
  **273 `verificado` · 99 `parcial` · 3 `pendiente`**. Venta remota:
  **152 `sí` · 32 `no` · 191 `no comprobado`**.
- Los tres pendientes finales son bloqueos reales ya trazados: Productos
  Artesanos Astur, Cerveza Nurse y Cafés Batrakof. No se degradaron a `parcial`
  sin poder confirmar una unidad productora actual.
- Las cuatro advertencias geográficas son casos limítrofes de 15–17,5 km, no
  errores: El Cuchareru y Quesos de Pría están en el concejo de Llanes; Monte
  Vidal y Bodegas La Muriella, en Cangas del Narcea. Ninguna supera el umbral
  bloqueante de 100 km y las ubicaciones se conservaron.
- La auditoría de imágenes no encontró errores ni avisos. El activo de Agua de
  Borines se retiró junto con la baja ya documentada; no se generaron imágenes
  nuevas para identidades sin un candidato inspeccionado.

### Hallazgos AST-53

- La segunda pasada revisó las 16 filas cuyo canal era `marketplace`. Se
  conservaron los cuatro canales colectivos u oficiales demostrados: la
  plataforma cooperativa pod para Huerta La Enredadera y la tienda del Consejo
  Regulador Sidra de Asturias para Sidra JR, El Gobernador y Cortina.
- Once apariciones en comercios independientes dejaron de contarse como venta
  online del productor. El producto a la venta sigue sirviendo como señal de
  actividad cuando corresponde, pero no demuestra un canal gestionado o
  autorizado por la explotación. La Pandiella sí mantiene pedidos y envíos
  directos por teléfono y correo según Comercio Asturias.
- Miel de Pertierra incorpora su web oficial. Su propia página de tienda indica
  que aún está en obras, por lo que queda `no comprobado` en vez de anticipar
  una venta online futura. Cerveza Cotoya incorpora el correo de contacto que
  publica la ficha actual derivada de OpenStreetMap.
- Productos Artesanos Astur pasa de `pendiente` a `parcial`: la licencia
  histórica acredita la industria de embutidos y el directorio empresarial
  informa de balance 2024, un empleado y CNAE 1013. Se mantiene el techo
  `parcial` porque no apareció un canal público primario actual de producción o
  venta.
- Los dos pendientes finales son bloqueos trazados: Cerveza Nurse tiene marca y
  actividad comercial actuales, pero no unidad productiva confirmada; Cafés
  Batrakof carece de una señal pública reciente suficiente. Estado final:
  **375 filas · 273 `verificado` · 100 `parcial` · 2 `pendiente`**. Venta
  remota: **141 `sí` · 32 `no` · 202 `no comprobado`**.
