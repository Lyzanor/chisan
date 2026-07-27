# Verificación provincial de Palencia

Ledger para planificar y reanudar la verificación profunda de
`data/csv/castilla-y-leon/palencia.csv`. El CSV es la fuente de verdad y la
evidencia por decisión vive en `data/evidence/castilla-y-leon/palencia.jsonl`.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
fija el snapshot, los riesgos locales y el alcance de los lotes. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

> **⚑ 1ª PASADA CERRADA el 2026-07-27.** 126 filas, 0 pendientes, 126/126 con
> `keep`, `verify:data` verde y Palencia en `coverage.json`. Lo que sigue son
> los residuales de la 2ª pasada, listados al final de Estado. No reabrir lotes
> cerrados sin motivo nuevo.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote activo.
2. Confirmar que no hay cambios concurrentes en Palencia.
3. Resolver primero los **duplicados declarados**: aquí son el defecto
   dominante y hay que decidirlos antes de verificar nada (Reglas locales 2).
4. Corregir el `municipio` cuando el volcado trajo una localidad menor: **16
   filas escapan al geo-check** y ninguna es un municipio real (Reglas locales 3).
5. Resolver `Venta online` desde cero: el valor heredado es honesto
   (`no comprobado` en 139 de 143), así que no hay nada que deshacer.
6. Editar el CSV de forma estructurada, añadir una línea JSONL por decisión y
   actualizar aquí el resumen del lote.
7. Pasar `check:csv:changed`, `check:evidence:changed` y `git diff --check`.
   El cierre provincial pasa `verify:data`.

Los lotes agrupan de 8 a 17 filas por categoría o zona. No se añaden candidatos
nuevos hasta terminar la primera pasada de las filas existentes.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con bloqueo real documentado; `parcial` es un
  resultado final válido cuando la evidencia tiene techo registral o secundario.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Todos los `Venta online=sí|no` están demostrados y los `sí` tienen canal.
- Cero filas fuera del geo-check y cero avisos de distancia.
- Palencia se añade a `data/evidence/coverage.json` solo al cerrar la pasada.

## Estado

- Inicio: **2026-07-27**. Primera pasada profunda de las **143 filas**
  existentes; no añadir candidatos hasta el cierre.
- Snapshot inicial: **143 filas**; **138 `pendiente`, 1 `parcial`, 4
  `verificado`**. Venta online: **3 `sí` (0 con canal), 1 `no`, 139 `no
  comprobado`**.
- Evidencia inicial: **el fichero JSONL no existe**; 0 registros para 143 filas.
- Imágenes: **3 de 143 filas con imagen** (140 sin); queda fuera de esta pasada
  salvo purga de basura detectada al paso.
- Avisos de data-quality: **43** (2 de distancia, 41 de descripción repetida).
  Filas fuera del geo-check: **16**.
- El árbol tenía trabajo concurrente en Badajoz al iniciar; queda expresamente
  fuera de este expediente.
- Tras PA-01 (2026-07-27): **142 filas** (−1 fusión); **122 `pendiente`, 5
  `parcial`, 15 `verificado`**. Venta online: **10 `sí` (8 con canal), 1 `no`,
  131 `no comprobado`**. Evidencia: **18 registros** (16 `keep`, 2 `merge`); se
  estrena `data/evidence/castilla-y-leon/palencia.jsonl`. Filas fuera del
  geo-check: **16 → 13**; avisos de data-quality: **43 → 40**. Filas con
  `correo`: **5 → 14**. Los dos `sí` sin canal que quedan son heredados
  (Galletas Gullón y Embutidos Lidia Caminero) y se resuelven en su lote.
- Tras PA-02 (2026-07-27): **138 filas** (−3 fusiones, −1 purga); **112
  `pendiente`, 6 `parcial`, 20 `verificado`**. Venta online: **12 `sí` (10 con
  canal), 1 `no`, 125 `no comprobado`**. Evidencia: **28 registros** (22 `keep`,
  5 `merge`, 1 `purge`). Filas fuera del geo-check: **13 → 9**; avisos de
  data-quality: **40 → 36**. Filas con `correo`: **19**.
- Tras PA-03 (2026-07-27): **138 filas**; **100 `pendiente`, 10 `parcial`, 28
  `verificado`**. Venta online: **14 `sí` (13 con canal), 1 `no`, 123 `no
  comprobado`**. Evidencia: **41 registros** (35 `keep`, 5 `merge`, 1 `purge`).
  Avisos de data-quality: **36 → 31**. Filas con `correo`: **27**. **Bloque de
  charcutería cerrado: 0 pendientes de las 23 filas** con las que empezó.
- Tras PA-04 (2026-07-27): **134 filas** (−3 fusiones, −1 purga); **88
  `pendiente`, 11 `parcial`, 35 `verificado`**. Venta online: **18 `sí`
  (18/18 con canal), 1 `no`, 115 `no comprobado`**. Evidencia: **54 registros**
  (43 `keep`, 9 `merge`, 2 `purge`). Filas fuera del geo-check: **9 → 8**.
  Filas con `correo`: **34**. **Ya no queda ningún `sí` sin canal.** El lote
  absorbió también el trío de Torquemada, así que **PA-05 se queda en 6 filas**.
- Tras PA-05 y PA-06 (2026-07-27): **133 filas** (−1 purga); **72 `pendiente`,
  17 `parcial`, 44 `verificado`**. Venta online: **28 `sí` (28/28 con canal),
  105 `no comprobado`**; ya no queda ningún `no`. Evidencia: **74 registros**
  (61 `keep`, 10 `merge`, 3 `purge`). Filas fuera del geo-check: **8 → 7**;
  queda **un solo aviso de distancia**, el de Panadería Ayuela, que es un
  homónimo del fichero de referencia (ver Reglas locales 4). Filas con `correo`:
  **44**. Cerrados los bloques de bodega, bebidas y miel.
- Tras PA-07 (2026-07-27): **128 filas** (−2 fusiones, −3 purgas); **56
  `pendiente`, 24 `parcial`, 48 `verificado`**. Venta online: **31 `sí` (31/31
  con canal), 97 `no comprobado`**. Evidencia: **90 registros** (72 `keep`, 12
  `merge`, 6 `purge`). Avisos de data-quality: **31 → 14**. Filas con `correo`:
  **47**.
- Tras PA-08 (2026-07-27): **128 filas**; **34 `pendiente`, 37 `parcial`, 57
  `verificado`**. Venta online: **37 `sí` (37/37 con canal), 91 `no
  comprobado`**. Evidencia: **112 registros** (94 `keep`, 12 `merge`, 6
  `purge`). Avisos de data-quality: **14 → 5**, y **cero avisos de distancia**.
  Filas con `correo`: **54**. **Bloque de pan y pastelería cerrado: 0
  pendientes de las 38 filas** con las que empezó. Lo que queda son 34 filas de
  ocho categorías menores.
- **Cierre de la 1ª pasada (2026-07-27)**: **126 filas** (de 143; −8 purgas y
  −9 fusiones); **0 `pendiente`, 48 `parcial`, 78 `verificado`**. Venta online:
  **46 `sí` (46/46 con canal), 80 `no comprobado`**. Evidencia: **148
  registros** — 126 `keep` (cobertura **126/126**), 8 `purge` y 14 `merge`.
  **Cero avisos de data-quality, cero filas fuera del geo-check, cero avisos de
  distancia y ningún `sí` sin canal.** Filas con `correo`: **de 5 a 76**; con
  `web`: 84. `verify:data` verde sobre los 50 CSV.
  **Palencia entra en `data/evidence/coverage.json`** (39 provincias): el
  criterio del contrato es que el ledger cubra todas las filas actuales, y aquí
  además no queda ninguna pendiente.
  El único dominio y el único teléfono repetidos que quedan son los de Puebla
  Luis, que son dos sociedades distintas en el mismo portal y están
  documentadas como tal.
  Residuales para la 2ª pasada: **123 de 126 filas sin imagen**; cuatro encajes
  de escala marcados (Galletas Gullón, Valle de San Juan, Chocolates Trapa y
  Cabo Vírgenes); tres dudas materiales productor/distribuidor (Repostería El
  Cisne, Sabor de Castilla y Avícola Melero); y **nueve dominios propios caídos
  o secuestrados** que, si reviven, subirían su fila de `parcial` a
  `verificado`.

## Reglas y riesgos locales

1. **El volcado tiene una sola procedencia declarada y es institucional.** La
   descripción de plantilla termina en «desde **Alimentos de Palencia**» (107
   filas) o «tras revisión complementaria» (30). Alimentos de Palencia es la
   marca de promoción agroalimentaria de la Diputación, no un registro de
   actividad: acredita que la empresa figuró en el catálogo, no que produzca hoy
   ni que venda. Es fuente **de apoyo**, así que por sí sola techa en `parcial`.
2. **Los duplicados son el defecto dominante y están declarados.** Ocho dominios
   y siete teléfonos se repiten, casi siempre por parejas de filas del mismo
   negocio con dos rótulos. Los grupos a decidir:
   - `embutidos-cervera` / `morcillas-cervera` / `carne-de-cervera-y-de-la-montana-palentina` (Cervera de Pisuerga)
   - `casa-tubero` / `embutidos-virgen-del-brezo-s-l` / `productos-virgen-del-brezo` (Santibáñez de la Peña)
   - `morcillas-de-cornon` / `morcillas-de-la-pena` (Cornón de la Peña)
   - `cecinas-valle-de-villarramiel` / `cecinas-y-embutidos-hnos-caballero-rojo`
   - `queseria-villa-de-la-nava` / `queseria-artesanal-villa-de-la-nava-lacteos`
   - `legumbres-puebla-luis` / `quesos-y-lacteos-puebla-luis` (La Serna)
   - `pagos-de-negredo-vinedos` (Palencia) / `pagos-de-negredo` (Palenzuela)
   - `la-tahona-de-sahagun` / `panaderia-y-pasteleria-en-palencia-la-tahona-de-sahagun`
   - `agropal` / `hortalizas-salus` (comparten `agropalsc.com`)
   - `bodega-esteban-araujo` / `destileria-esteban-araujo` / `vermu-corito` (mismo teléfono, Torquemada)
   - `pasteleria-polo` / `v-polo-montse-s-l` y `panaderia-reposteria-productos-santiago` / `panaderia-productos-santiago`, a comprobar.
   Dirección o teléfono compartidos **no** obligan a fusionar: solo la misma
   unidad productiva (`docs/EDITORIAL_POLICY.md` § Related entities).
3. **`municipio` trae la localidad, no el término, en 16 filas** (11 %), y
   ninguna de las 16 existe en `municipios.json`: Cillamayor, Cornón de la Peña,
   Fuente-Andrino, Cascón de la Nava, **Tierra de Campos** (que es una comarca,
   no un lugar), Velillas del Duque, Villanueva de los Nabos, Lagunilla de la
   Vega, Menaza, Moslares de la Vega, Gozón de Ucieza, Camesa de Valdivia,
   Villafría de la Peña, Arenillas de San Pelayo y San Salvador de Cantamuda.
   Se corrigen en el lote de cada fila poniendo el término real y dejando la
   localidad en `direccion`.
4. **Los dos avisos de distancia iniciales tenían causas opuestas.** En
   `abiamiel-saldana` (28 km de Saldaña, 0,3 km de Abia de las Torres) mandaba
   la coordenada y el municipio estaba mal: resuelto en PA-06. En
   `panaderia-ayuela-mazariegos` (98,5 km) **el dato malo está en el fichero de
   referencia**: `municipios.json` guarda `mazariegos` con un centroide de
   Burgos (42,11 / −3,53) en vez del municipio palentino. Se arregla con
   `data/reference/municipios-overrides.json`, no tocando la fila; el override
   puede ser un objeto suelto porque **es la única fila `Mazariegos` de los 50
   CSV**, así que no colisiona con nadie.
5. **Hay `web` que no son del productor**: `larutadelqueso.es` (Quesos Matilla,
   ya vaciada en PA-01) y `turismocastillayleon.com` (Obrador Pedro I) son
   directorios, y `disfrutolonatural.es` (Artesanas de Boedo) hay que comprobar
   de quién es. Un directorio nunca es fuente verificante.
   `quesoscantarillos.blogspot.com` **sí** es del productor, solo que congelado
   en 2012: eso no lo convierte en directorio, lo deja en `parcial`.
6. **Palencia no tiene mar y hay cinco filas de pescado.** Cabo Vírgenes,
   Merpacífico, Cocimar y Aquadomus son candidatas a mayorista o distribuidor;
   solo la Piscifactoría de Campoo produce por definición. Hay que resolver el
   encaje antes que la identidad.
7. **Escala industrial que hay que decidir explícitamente**: Galletas Gullón
   (galletera con presencia global), Chocolates Trapa (marca de grupo), Agropal
   (cooperativa agroalimentaria grande) y Cascajares. El criterio es identidad
   local y producto propio, no tamaño, pero cada una necesita su decisión.
8. **`correo` está prácticamente vacío**: solo 5 de 143 filas lo traen. Es el
   campo más barato de completar mientras se lee la web de contacto.
10. **Envasar legumbre cuenta como producir en Palencia, por excepción de
    provincia** (decisión editorial del 2026-07-27, misma figura que León con
    su legumbre y su fruta). La alubia de la Vega de Saldaña, el garbanzo y la
    lenteja de Tierra de Campos llegan al mercado a través de legumbreras que
    compran a los agricultores de la comarca, seleccionan y envasan con marca
    propia; sin ellas la provincia perdería la identidad de mercado de su
    producto más característico. Legumbres La Vega lo dice sin rodeos —«nosotros
    no elaboramos nada, es el campo el que nos proporciona»— y aun así se
    conserva. **No es un cambio del criterio general** de
    `docs/EDITORIAL_POLICY.md`: es una excepción acotada a esta provincia y a
    esta cadena, y la línea sigue estando en el origen local del producto y en
    la marca propia. Afecta a Leguminor, La Vega, La Vieja Olma, Puebla Luis y a
    la línea de legumbre de Agropal.
11. Señales baratas que **sí** salen limpias: 143/143 con `direccion`, `horario`,
   `productos estrella`, `Google Maps` y lat/lon; **101 filas con web** y ningún
   dominio de directorio salvo los cuatro del punto 5. El volcado partió de
   fichas reales: el trabajo es de duplicado, encaje y canal, no de descartar
   nombres inventados.

## Worklist

| Lote | Alcance | Filas | Estado | Riesgo principal |
|---:|---|---:|---|---|
| PA-00 | Higiene, snapshot y partición | 143 | ✅ 2026-07-27 | 138 pendientes; 143 VO sin resolver; 11 grupos de duplicados; 16 filas fuera del geo-check |
| PA-01 | Lácteos y quesos | 17 | ✅ 2026-07-27 | 11 verif, 5 parcial, 1 fusión; 3 municipios corregidos y 1 slug renombrado |
| PA-02 | Charcutería — Montaña Palentina y norte | 10 | ✅ 2026-07-27 | 5 verif, 1 parcial, 3 fusiones, 1 purga (la marca de garantía); 4 municipios corregidos |
| PA-03 | Charcutería — Tierra de Campos, Cerrato y capital | 13 | ✅ 2026-07-27 | 9 verif, 4 parcial; las cecinas de Villarramiel eran 3 empresas, no 2; cierra el bloque |
| PA-04 | Bodega (+ el trío Esteban Araujo de PA-05) | 13 | ✅ 2026-07-27 | 8 verif, 1 parcial, 3 fusiones, 1 purga (centro de enoturismo); 2 recategorizadas |
| PA-05 | Cerveza, licores y chocolate | 7 | ✅ 2026-07-27 | 4 verif, 3 parcial; tres dominios aparcados o caídos, uno de ellos heredado como verificado |
| PA-06 | Miel | 12 | ✅ 2026-07-27 | 8 verif, 3 parcial, 1 purga (era de Madrid); resuelto el aviso de 28 km |
| PA-07 | Pan y pastelería — Palencia capital | 16 | ✅ 2026-07-27 | 5 verif, 6 parcial, 2 fusiones, 3 purgas (2 despachos de un obrador leonés y un distribuidor) |
| PA-08 | Pan y pastelería — resto de la provincia (absorbe PA-09) | 22 | ✅ 2026-07-27 | 10 verif, 12 parcial; cierra el bloque y el aviso de 98,5 km, que era del fichero de referencia |
| PA-09 | — | — | ✅ absorbido por PA-08 | |
| PA-10 | Despensa artesanal y conservas | 12 | ✅ 2026-07-27 | 9 verif, 2 parcial, 1 purga (distribuidor); 7 recategorizadas |
| PA-11 | Fruta, verdura, legumbres, huevos, pescado, helados y setas (absorbe PA-12) | 22 | ✅ 2026-07-27 | 12 verif, 9 parcial, 1 purga (artefacto del volcado); 7 recategorizadas, 4 municipios corregidos |
| PA-12 | — | — | ✅ absorbido por PA-11 | |
| PA-13 | Cierre: reauditoría, coverage y geo-provenance | 126 | ✅ 2026-07-27 | Data-quality y geo-check a cero; 126/126 con `keep`; en coverage.json |

## PA-00 — Higiene, snapshot y partición

Cerrado el 2026-07-27. Sin cambios en datos: solo diagnóstico y partición.

Hallazgos que condicionan toda la pasada, en Reglas locales. En una línea: el
CSV de Palencia **es un volcado de un catálogo institucional real**, no una
lista inventada, y por eso sus defectos son sistemáticos: la misma empresa
entrando dos veces con dos rótulos (11 grupos), la localidad puesta como término
municipal (16 filas) y `Venta online` intacto en las 143 filas.

La provincia se concentra en **pan y pastelería (38)**, **charcutería (23)**,
**lácteos y quesos (17)** y **miel (12)**, que definen la partición de arriba.

## PA-01 — Lácteos y quesos

Decisiones cerradas el 2026-07-27 sobre las 17 filas del bloque: **11
verificadas, 5 parciales y 1 fusión**, sin purgas.

- `verificado` + ecommerce (6): La Oveja Que Bala, Puebla Luis, Lagunilla y La
  Olmeda, Lavega, La Antigua (Villaumbrales) y Campos Góticos.
- `verificado` + pedido publicado sin carrito (2): Villa de la Nava
  (`telefono|email`) y Gamazo (`email`).
- `verificado`, venta no comprobada (3): Quesos Cerrato, Quesos Latinos y Valle
  de San Juan.
- `parcial` (5): Yogur Valsolana, Quesos San Martín Frómista, Leal de Fuentes
  Carrionas, Quesos Matilla y Quesos Cantarillos.
- `merge`: `queseria-artesanal-villa-de-la-nava-lacteos-fuentes-de-nava` →
  `queseria-villa-de-la-nava-fuentes-de-nava`.
- Renombrado: `quesos-latinos-34810` → `quesos-latinos-aguilar-de-campoo`.

Incidencias reutilizables:

- **Dirección compartida no basta para fusionar, y aquí hay un caso de cada
  cosa.** Las dos filas de Villa de la Nava comparten calle, número, teléfono,
  dominio y coordenadas, y Alimentos de Palencia solo la lista una vez: misma
  unidad, fusión. En cambio Puebla Luis son **dos sociedades distintas en el
  mismo portal** —Quesería Artesanal del Río Carrión, S.L. para el queso y
  Ovinos del Carrión, S.L. para la alubia—, con dos altas separadas en el
  registro: se quedan las dos filas. El registro de la Diputación es lo que
  desambigua en los dos sentidos.
- **Un slug puede codificar un código postal.** `quesos-latinos-34810` traía
  además «en 34810» dentro de la `descripcion`. El 34810 es el CP compartido de
  Menaza y Nestar, las dos localidades de Aguilar de Campoo; la empresa publica
  Nestar y el volcado geocodificó Menaza. Mismo término municipal por las dos
  vías.
- **Tres localidades puestas como municipio**, todas de la vega del Carrión:
  Lagunilla de la Vega→Bustillo de la Vega, Moslares de la Vega→Renedo de la
  Vega y Menaza→Aguilar de Campoo. En los tres se conservó el slug y la
  localidad pasó a `direccion`.
- **Un fallo TLS del fetcher no es un dominio muerto.** `valledesanjuan.com` da
  «unable to verify the first certificate» y en navegador carga entero, con ©
  2026 y las dos plantas publicadas. Sin abrirlo por otra vía la fila habría
  caído a `parcial` por un problema de cadena de certificados.
- **Ni un carrito invisible es una tienda cerrada.** El fetcher no veía el botón
  de compra de Campos Góticos; en navegador es una PrestaShop completa con
  carrito, precios de 14,43 a 64,71 € y control de stock.
- **La escala se decidió por identidad, no por tamaño, y quedó anotada.** Valle
  de San Juan tiene ~200 empleados, 8,5 M kg y es interproveedor de Mercadona
  desde 2011, pero nació en 1998 en Villarrabé, tiene dos plantas propias en la
  provincia y marca y catálogo propios: se conserva y se marca para revisar en
  la 2ª pasada. Quesos Latinos (5.000 m², desde 2005) entra por lo mismo:
  fábrica propia en la provincia y marca propia (Productos Campesino).
- **Una cooperativa de primer grado con marca propia entra**, y su producto en
  tiendas de terceros no es su canal: Quesos Cerrato aparece en vinosribera y
  yourspanishshop, que son minoristas independientes → `no comprobado`.
- **Una fila no era láctea.** Leal de Fuentes Carrionas elabora **queso vegano
  de frutos secos**; se recategoriza a `Despensa artesanal`. La categoría del
  volcado siguió al nombre del producto, no a la materia prima.
- **Un blog propio congelado no es un directorio, pero tampoco verifica.** El de
  Quesos Cantarillos es suyo y publica dirección y teléfonos correctos, pero su
  contenido más nuevo es un recorte de 2012 y un «próximamente empezaremos la
  producción»; Iberinform marca la sociedad como inactiva. No hay prueba de
  cierre → no se purga, pero queda `parcial`.
- **Sin web ni redes propias no hay `verificado`, por bueno que sea el rastro.**
  Yogur Valsolana (prensa regional, obrador con dirección) y Quesos San Martín
  Frómista (directorio del ayuntamiento, ferias de 2021 y 2023, 47 reseñas en
  Maps) son productores reales y activos, pero solo con fuentes de apoyo: techo
  `parcial`. **Google Maps no sirvió como fuente verificante en esta pasada**
  porque el acceso queda detrás de un muro de consentimiento.
- **Un enlace social del volcado puede no ser del productor.** Las dos filas de
  Villa de la Nava traían el Instagram `chaconisima`, sin relación acreditada
  con la quesería: se vació y se puso su página de Facebook. Quesos Latinos
  traía `facebook.com/profile.php` sin id, que no lleva a ninguna parte.
- **Ojo a los homónimos queseros.** «Quesos Hermanos Gamazo» es de Melgar de
  Arriba (Valladolid); el de esta fila es José Gamazo Benito, de Quintana del
  Puente. Llegaba además sin `web` teniendo dominio propio con precios.
- **`correo` es lo más barato de completar**: nueve de estas filas publicaban el
  suyo en su propia página de contacto (de 5 a 14 en toda la provincia).

## PA-02 — Charcutería: Montaña Palentina y norte

Decisiones cerradas el 2026-07-27 sobre las 10 filas del bloque: **5
verificadas, 1 parcial, 3 fusiones y 1 purga**.

- `verificado` + ecommerce (2): Embutidos Cillamayor y Morcillas de
  Fuenteandrino.
- `verificado`, venta no comprobada (3): Embutidos Cervera, Casa Tubero y
  Productos Virgen del Brezo.
- `parcial` (1): Morcillas de La Peña.
- `purge:not-producer` (1): Carne de Cervera y de la Montaña Palentina.
- `merge` (3): `morcillas-cervera` → `embutidos-cervera`,
  `morcillas-de-cornon` → `morcillas-de-la-pena` y
  `embutidos-virgen-del-brezo-s-l` → `casa-tubero`.

Incidencias reutilizables:

- **La purga es una marca de garantía, no una empresa.** «Carne de Cervera y de
  la Montaña Palentina» es la MG reconocida por Itacyl que gestiona la
  **Asociación CAMPA**: 25 ganaderos, 21 ayuntamientos, 16 carnicerías y 3
  mataderos, con sede exactamente en la Av. de Aguilar, 38D que traía la fila.
  Es el mismo caso que la IGP Mantecadas de Astorga en León, y en Palencia
  merece vigilancia porque el volcado sale de un catálogo institucional que
  mezcla productores y sellos.
- **Dos marcas iguales en el mismo pueblo pueden ser dos empresas de sectores
  distintos.** En Santibáñez de la Peña conviven **Embutidos Virgen del Brezo,
  S.L. «Casa Tubero»** (C/ Virgen del Mar, tel. 979 860 404, `.es`) y
  **Productos Virgen del Brezo, S.A.**, que desde 1958 fabrica **hojaldres,
  palmeras y galletas** con unos 80 empleados (Ctra. la Valdavia, tel. 979 860
  003, `.com`). El volcado las traía a las dos como `Charcutería`. La segunda se
  recategoriza a `Pan y pastelería`. La señal que las separa es que **el dominio
  distinto llevaba a un negocio distinto**, no a la matriz.
- **La regla de los tres duplicados de este lote fue la misma**: mismo
  `place_id` de Google + mismo teléfono + mismo dominio = misma unidad. Y la
  regla contraria funcionó igual de bien: las dos «Virgen del Brezo» no
  compartían ninguno de los tres.
- **Cuando el registro y la calle no coinciden, hay que dejarlo escrito.**
  Alimentos de Palencia sitúa Morcillas de La Peña en «Calle Mayor Fon, 14,
  34878 Fontecha» —localidad de **Respenda** de la Peña—, mientras el portal de
  Turismo de la Montaña Palentina y Google la ponen en Calle Mayor, 14 de
  **Cornón** de la Peña, localidad de Santibáñez de la Peña. Se mantiene Cornón
  por doble coincidencia y la fila queda `parcial`, con la discrepancia anotada
  en la evidencia en vez de resuelta a ojo.
- **Cuatro localidades más puestas como municipio**: Cillamayor→Barruelo de
  Santullán, Cornón de la Peña→Santibáñez de la Peña, Fuente-Andrino→Villaherreros
  (fue municipio hasta 1973) y la grafía `Santibañez` sin tilde.
- **Dos dominios propios legibles solo por HTTP**: `morcillascervera.es` falla
  el handshake TLS y `virgendelbrezo.es` no tiene certificado. Los dos cargan y
  son suyos. Van ya, con `valledesanjuan.com` de PA-01, **tres sitios propios de
  esta provincia que el fetcher da por muertos y no lo están**.
- **Una fila llegaba sin `web` teniendo tienda propia**: Morcillas de
  Fuenteandrino vende en `morcillasdefuenteandrino.com` de 5 a 81 €, con
  expediciones los martes. Segundo caso tras Quesos Gamazo: **en este volcado la
  ausencia de `web` no significa que no exista**.

## PA-03 — Charcutería: Tierra de Campos, Cerrato y capital (cierra el bloque)

Decisiones cerradas el 2026-07-27 sobre las 13 filas restantes: **9 verificadas
y 4 parciales**, sin purgas ni fusiones. **El bloque de charcutería queda
cerrado: 0 pendientes de las 23 filas con las que empezó la provincia.**

- `verificado` + ecommerce (3): Morcilla de Villada, Selectos de Castilla y
  Embutidos Lidia Caminero (que ya era `sí` y solo le faltaba el canal).
- `verificado`, venta no comprobada (6): Cárnicas Campos de Castilla, Cárnicas
  Odriozola, Industrias Cárnicas Santa Marina, Peñafría, Precocinados La
  Montaña del Cristo y Cecinas Hnos. Caballero Rojo.
- `parcial` (4): Carnicería M. Prieto, Carnicería José Agustín, Cecinas
  Emeterio Sánchez y Cecinas Valle de Villarramiel.

Incidencias reutilizables:

- **El duplicado que anunciaba PA-00 no existía: eran tres empresas, no dos.**
  Villarramiel tiene tres cecineras de equino inscritas —Hnos. Caballero Rojo,
  Emeterio Sánchez y Fernández Villarramiel, S.L. (marca Cecinas Fernández, hoy
  Cecinas Valle de Villarramiel)— y el volcado **le copió a la tercera la
  dirección, el teléfono, el dominio y el Facebook de la primera**. Dominio y
  teléfono compartidos son buena señal de duplicado, pero **cuando el registro
  publica una dirección distinta, lo que hay es contaminación del scrape**. Se
  corrigieron los cuatro campos en vez de fusionar.
- **Dos dominios propios muertos de verdad**, y esta vez comprobado con `dig`,
  no con el fetcher: `cecinasemeteriosanchez.com` y
  `cecinasvalledevillarramiel.com` son NXDOMAIN en apex y en `www`, aunque el
  registro de la Diputación los siga publicando. Se vació `web` y las dos filas
  quedan `parcial`. **Contrasta con los tres sitios de PA-01 y PA-02 que solo
  parecían muertos**: la diferencia la da la resolución DNS, no el fetch.
- **Un mayorista con cebadero propio no es un mayorista.** Cárnicas Odriozola se
  describe como cría, despiece y distribución con flota refrigerada y estuvo a
  un paso de la purga, pero tiene cebaderos propios en Villalobón y Villamartín
  con 600-800 terneras y elabora salchichas, chorizos y hamburguesas de receta
  propia. La línea sigue estando en la producción propia con marca, no en el
  canal.
- **Y una carnicería de pueblo con obrador tampoco es un despacho.** M. Prieto
  (Grijota) y José Agustín (Villada) entraron en el sector productor de
  Alimentos de Palencia **con sus propios elaborados en banda azul**. Es el caso
  simétrico de los despachos urbanos que se purgaron en León: aquí el registro
  acredita la elaboración.
- **Dos filas estaban en la categoría equivocada.** Selectos de Castilla, S.A.
  es una empresa hispano-francesa de **foie gras y derivados de pato** desde
  1989 → `Pato y derivados`; y La Montaña del Cristo es sobre todo
  **precocinados de casquería** (callos, morro, oreja) → `Comida preparada`.
- **Un municipio más corregido, y por el polígono.** La Montaña del Cristo
  figuraba en Villalobón y su propia web da C/ Francia, 10 con CP **34004**, que
  es Palencia capital. El polígono de la calle Francia reparte filas entre los
  dos términos y aquí el volcado eligió mal.
- **Tres maneras de que una «tienda» no sea un canal, todas en este lote**: la
  de Peñafría es un catálogo con «Más info.» sin precios; la de Santa Marina es
  una entrada de menú cuya ruta da 404 y cuya clientela declarada son
  detallistas y hostelería; y la de La Montaña del Cristo directamente no
  existe, pese a que una lectura rápida del sitio la daba por hecha. Las tres
  son `no comprobado`.

## PA-04 — Bodega (y el trío Esteban Araujo)

Decisiones cerradas el 2026-07-27 sobre las 10 filas de bodega **más las dos de
licores que resultaron ser la misma casa**: **8 verificadas, 1 parcial, 3
fusiones y 1 purga**. Con esto **el bloque de bodega queda cerrado**.

- `verificado` + ecommerce (4): Carreprado, Remigio Salas Jalón (Las Luceras),
  Señorío de Valdesneros y Esteban Araujo (vermú Corito).
- `verificado`, venta no comprobada (4): Pagos de Negredo, Bodegas Barrialba,
  Fuentes de Lebanza y —recategorizadas— las dos del punto siguiente.
- `parcial` (1): Basileo Vino de Reyes.
- `purge:not-producer` (1): La Zarcera del barrio de bodegas.
- `merge` (3): `pagos-de-negredo-vinedos-palencia` → `…-palenzuela`,
  `destileria-esteban-araujo-torquemada` y `vermu-corito-torquemada` →
  `bodega-esteban-araujo-torquemada`.

Incidencias reutilizables:

- **La purga es un centro de enoturismo, no una bodega.** La Zarcera se
  inauguró en 2020 sobre la única casa familiar del barrio de bodegas de
  Baltanás y es aula de cata, taberna y tienda de productos del Cerrato —Mejor
  Establecimiento de Enoturismo de España 2022—. **El propio volcado lo
  delataba: su Facebook y su Instagram eran los de `turismocerrato`.** Cuando
  las redes de una fila apuntan a una marca turística, conviene mirar antes que
  verificar.
- **Tres filas para una casa.** Bodega Esteban Araujo, Destilería Esteban Araujo
  y Vermú Corito comparten teléfono, municipio y familia; la Ruta del Vino
  Arlanza describe la visita como «la bodega familiar y la antigua destilería
  Esteban», y Alimentos de Palencia inscribe **una sola ficha con 19 productos**
  que incluye los siete Coritos. Corito es marca, no empresa. Se consolidan en
  una fila recategorizada a `Licores y vermut`.
- **Un dominio del registro puede estar hoy en venta.** El registro publica
  `bodegaestebanaraujo.com`, que sirve «Comprar este dominio | More domains at
  Seo.Domains». Es el patrón de Mas Asturias en León: **un dominio caducado y
  re-registrado responde 200 y es peor que uno muerto**. Se sustituyó por
  `coritovermu.es`, que está vivo.
- **Una tienda puede vivir en un tercer dominio del productor.** Remigio Salas
  tiene `lasluceras.com` (301 a `lasluceras.es`) para la marca y
  `remigiosalas.com` para vender; este último devuelve 403 al fetcher y en
  navegador enseña cajas de seis de 36,95 a 69,95 € con portes gratis. Y el
  vermú Corito vende en una tienda SumUp propia, que también da 403.
  **Tres tiendas de este lote solo se pudieron ver por navegador.**
- **El domicilio social no es la bodega, y aquí pasó dos veces.** Basileo figura
  en dos calles distintas de Palencia capital según qué registro se mire, y su
  bodega y sus 10 hectáreas están en la finca Lancha Quebrada de **Herrera de
  Valdecañas** (se renombró el slug); Pagos de Negredo tenía una fila en su
  despacho de la Av. Casado del Alisal y otra en la bodega de la N-622, y se
  quedó la de **Palenzuela**.
- **Dos filas no eran de su categoría.** Fuentes de Lebanza es una envasadora de
  **agua mineral natural** —la primera de España con certificación CAAE para
  agua—, no una bodega; el propio CSV ya lo decía en `productos estrella` y
  nadie lo había mirado. Y el trío de Torquemada pasa a `Licores y vermut`.
- **Una localidad más puesta como municipio**: San Salvador de Cantamuda, que es
  la capital municipal de **La Pernía**.
- **Un enlace a un marketplace colectivo no basta.** Pagos de Negredo anuncia
  «Conoce nuestros vinos en Market Tierra de Sabor» y su propio enlace de tienda
  apunta a un dominio mal escrito (`pagosdenegreso.com`). Sin ver el escaparate
  funcionando, es `no comprobado`.

## PA-05 — Cerveza, licores y chocolate

Decisiones cerradas el 2026-07-27 sobre las 7 filas restantes del bloque de
bebidas: **4 verificadas y 3 parciales**, sin purgas ni fusiones.

- `verificado` + ecommerce (3): Cerveza Vereda, Cervezas Yesta Agrobeer y
  Chocolates Trapa.
- `verificado`, venta no comprobada (1): Aguardientes y Licores Doncel.
- `parcial` (3): Cervezas Bresañ, Destilería Zumaque y Aguardientes Gonqui.

Incidencias reutilizables:

- **Tres dominios propios caídos en siete filas**, y cada uno de una forma
  distinta: `bresan.es` da 404 del hosting en apex, en www y en rutas internas
  indexadas; `destileriazumaque.com` rechaza HTTPS y por HTTP sirve una
  **página de aparcamiento de dominios**; y `gonqui.com` responde 200 con la
  página de mantenimiento de su proveedor web (Solyeca, S.L.), sin un solo dato
  de la empresa. Los tres responden algo, y ninguno acredita nada.
- **Una fila heredada como `verificado` no lo estaba.** Cervezas Bresañ llegaba
  de una pasada anterior con `verificado` y `Venta online = no`; hoy su sitio
  está entero caído, así que baja a `parcial` y el `no` pasa a `no comprobado`:
  **un `no` es una afirmación sobre la ausencia de canal, y sin canales que
  revisar no se sostiene**. Es el aviso de que el estado heredado también hay
  que auditarlo.
- **La escala industrial vuelve a decidirse por identidad.** Chocolates Trapa
  factura 85 M€ con 175-200 empleados, pero nació en 1891 en el monasterio
  trapense de San Isidro de Dueñas, fabrica allí y desde 2013 es del palentino
  Grupo Europraline. Mismo criterio que Valle de San Juan en PA-01.
- **Una ficha en Agroterra no es canal propio**: es un marketplace de terceros,
  como los minoristas que revenden Quesos Cerrato.

## PA-06 — Miel

Decisiones cerradas el 2026-07-27 sobre las 12 filas del bloque: **8
verificadas, 3 parciales y 1 purga**. Es el bloque con más `sí` de la
provincia: **8 de 11 filas conservadas venden a distancia**.

- `verificado` + ecommerce (6): Miel Felya, Miel El Camino, Miel Gran Dujo,
  Miel de la Ecla, Miel Las Carboneras y —resuelta la venta— Miel Valdesú
  (`telefono|whatsapp|email`).
- `verificado` + whatsapp (1): Mieles Brezos del Norte y Miel Oso Pardo.
- `verificado`, venta no comprobada (1): Abiamiel Pedro.
- `parcial` (3): Miel Cuestas de Pan, Miel Inés y Oro del Cerrato.
- `purge:other-province` (1): Miel Gaia.

Incidencias reutilizables:

- **La purga estaba escrita en el propio slug.** `miel-gaia-mejorada-del-campo`
  llevaba el municipio real en el identificador mientras `municipio` decía
  Husillos y `direccion` era «34419 Husillos, Palencia» sin calle. Dulce Gaia
  Miel está en Calle Mayor, 7 de **Mejorada del Campo (Madrid)**, como publica
  su página de contacto. **Cuando el slug y el municipio se contradicen, hay que
  mirar**: es la comprobación más barata de todas.
- **El aviso de distancia acertó, y lo que estaba mal era el municipio.**
  Abiamiel figuraba en Saldaña, a 28 km de su centroide y a 0,3 km del de Abia
  de las Torres; su propia web dice «Ctra. de Osorno-Saldaña Km. 5, en el pueblo
  de Abia de las Torres». El nombre de la marca ya lo decía. Se renombró el
  slug.
- **Y el segundo aviso no era de la fila sino del fichero de referencia.**
  `municipios.json` guarda `mazariegos` con un centroide de Burgos, así que la
  panadería de Mazariegos (Palencia) sale a 98,5 km. Se corrige en
  `municipios-overrides.json` (ver Reglas locales 4).
- **Una fila heredada como `verificado` bajó por un certificado caducado.** Oro
  del Cerrato tiene una WooCommerce viva, pero su TLS expiró el 12 de julio de
  2026 y el navegador no la abre; solo se leyó forzando la verificación. Un
  dominio propio que no se puede abrir techa en `parcial`, y la tienda queda sin
  comprobar. Es el segundo estado heredado que no se sostenía, tras Bresañ.
- **La tienda puede estar en la plataforma del pueblo.** Miel Felya no vende en
  su dominio sino en `mielfelya.palenciadigital.com`, un escaparate propio con
  su copyright y sus precios. Cuenta como canal propio, a diferencia de la ficha
  de Agroterra de Gonqui.
- **Dos localidades más puestas como municipio**: Gozón de Ucieza→Loma de Ucieza
  (fue municipio hasta los setenta) y la grafía `Santibañez de Ecla` sin tilde.
- **Un dominio propio muerto no siempre deja al productor sin sitio.** Abiamiel
  perdió `abiamielpedro.com` (NXDOMAIN) pero mantiene vivo su weebly, que es
  donde publica dirección y teléfonos.

## PA-07 — Pan y pastelería: Palencia capital

Decisiones cerradas el 2026-07-27 sobre las 16 filas de la capital: **5
verificadas, 6 parciales, 2 fusiones y 3 purgas**.

- `verificado` + ecommerce (4): La Casa Dulce, La Repostería de las Monjas,
  Pastelería Polo y —sin tienda pero con obrador— Pastelería Rigodón como
  `verificado` sin canal.
- `parcial` (6): Horno del Duero, Los Cuatro Hermanos, Panificadora de Fuentes,
  Pâtisserie Alló París, Pastelería Lord y Repostería El Cisne.
- `purge:other-province` (2): las dos filas de La Tahona de Sahagún.
- `purge:not-producer` (1): Saborea.
- `merge` (2): `panaderia-reposteria-productos-santiago-palencia` →
  `panaderia-productos-santiago-villada` y `v-polo-montse-s-l-palencia` →
  `pasteleria-polo-palencia`.

Incidencias reutilizables:

- **La capital concentra despachos de obradores de fuera, igual que el Barrio
  Húmedo de León.** La Tahona de Sahagún reparte los papeles en su propia web:
  «León (Sahagún): tienda propia **y obrador tradicional**; Palencia: tiendas
  propias; Valladolid: reparto». Sus dos filas palentinas son despachos de una
  unidad productiva leonesa → `other-province`. Y Productos Santiago tiene «la
  fábrica en Villada y su panadería-pastelería en la calle La Puebla, 11 de
  Palencia»: la fila se traslada a Villada. **En los dos casos el nombre o la
  prensa local lo decían antes que cualquier registro.**
- **Un `nombre` puede ser el título SEO de una web.** La segunda fila de La
  Tahona se llamaba «Panadería y pastelería en Palencia · La Tahona de
  Sahagún», que es literalmente el `<title>` de su página. Buen indicio de que
  el volcado tomó la ficha de Google de un despacho.
- **Un tercer dominio secuestrado**: `pastelerialord.es` redirige 301 a
  `places.thebest100hotels.com`. Con `bodegaestebanaraujo.com` (en venta) y
  `destileriazumaque.com` (aparcado), van tres dominios re-registrados por
  terceros en esta provincia. Se vacían siempre.
- **La purga por encaje no era una panadería.** Saborea se define como
  «distribución de Bebidas y Alimentación» —vino, destilados, conservas y
  gourmet— con almacén en Palencia y tienda en Valladolid. Estaba además en la
  categoría equivocada.
- **La razón social suele explicar el falso duplicado, y aquí lo confirmó.**
  V. Polo-Monse, S.L. **es** Pastelerías Polo: su propia tienda lista los
  productos «por proveedor V. Polo - Monse SL». Se conserva la fila del
  polígono de la calle Italia, que es el obrador, y no la de la Av. Casado del
  Alisal, que es tienda.
- **Dos tiendas que el fetcher daba por vacías sí venden.** La de La Casa Dulce
  (subdominio, plataforma Apanymantel) solo mostraba el lema y en navegador
  tiene carrito, entrega de 5 €, gratis desde 100 € y pedido mínimo de 16 €; la
  de Polo esconde los precios en la ficha de producto pero tiene pago seguro,
  recogida en tienda y envío gratis en Palencia desde 60 €.
- **Una duda material que no se resuelve inventando.** Repostería El Cisne
  tiene CNAE de **comercio al por menor** de pan y confitería, mientras sus
  reseñas describen producto artesano propio. Ni prueba de despacho ni de
  obrador: se queda `parcial` con la contradicción anotada, no purgada.
- **Dos filas llegaban sin redes teniéndolas**: se añadieron el Facebook de
  Horno del Duero y el Instagram de Selecta Panprinz, que abrió en 2025.

## PA-08 — Pan y pastelería: el resto de la provincia (cierra el bloque)

Decisiones cerradas el 2026-07-27 sobre las 22 filas restantes: **10
verificadas y 12 parciales**, sin purgas ni fusiones. **El bloque queda cerrado:
0 pendientes de las 38 filas** con las que empezó la provincia.

- `verificado` + ecommerce (8): Clarisas de Aguilar, Galletas Gullón, Artesanas
  del Boedo, Pastas y Hojaldres UKO, Panadería Salazar, Pastelería Sumendi y La
  Confitería de Villoldo.
- `verificado`, venta no comprobada (2): Pan de Ampudia y Clarisas de
  Calabazanos.
- `parcial` (12): El Negrito, Obrador Pedro I, Panificadora Malanda, Carmelitas
  de Carrión, Horno La Peregrina, Panadería Ayuela, Brígidas de Paredes,
  Panadería Berruguete, La Tahona Cántabra, Panadería Espina, Panificadora El
  Valle, Productos Santiago y Donde Rita.

Incidencias reutilizables:

- **Los conventos son productores de pleno derecho en esta provincia y hay
  cinco.** Clarisas de Aguilar (con tienda online y precios), clarisas de
  Astudillo (el Obrador Pedro I, inaugurado en 2006), clarisas de Calabazanos,
  carmelitas de Carrión y brígidas de Paredes de Nava. Tres de ellas solo
  despachan por el torno, así que su venta es `no comprobado` y su techo
  `parcial` por falta de sitio propio.
- **El volcado pegó a tres filas enlaces de otro.** Obrador Pedro I llevaba como
  `web` la ficha del monasterio en `turismocastillayleon.com` y como redes las
  cuentas `cylesvida` de la Junta; y El Negrito llevaba el Facebook y el
  Instagram de **Pan de Ampudia**. Los cinco enlaces se vaciaron. **Es el mismo
  fallo que las cecinas de Villarramiel en PA-03**: cuando el scrape no
  encuentra la ficha, pega la del vecino.
- **`disfrutolonatural.es` sí era del productor.** PA-00 lo marcó como posible
  directorio y resultó ser la tienda propia de Artesanas del Boedo. Conviene
  abrir antes de descartar.
- **Cuarto y quinto dominios muertos del bloque**: `panaderiaelnegrito.es` con
  el certificado caducado (como Oro del Cerrato) y `panelvalle.com` muerto por
  las dos vías —404 por HTTP y error interno de TLS por HTTPS—. El primero se
  conserva porque es suyo y el fallo es reversible; el segundo se vacía.
- **El aviso de 98,5 km no era un error de la fila.** `municipios.json` guardaba
  `mazariegos` con un centroide de Burgos. Se añadió una entrada en
  `municipios-overrides.json` con el centroide palentino; **es la única fila
  `Mazariegos` de los 50 CSV**, así que el override puede ser un objeto suelto.
  Con eso, la provincia se queda **sin ningún aviso de distancia**.
- **Una localidad más puesta como municipio**: Camesa de Valdivia→Pomar de
  Valdivia, que es además el domicilio social de Panificadora Malanda.
- **La escala máxima de la provincia se resolvió igual que las anteriores.**
  Galletas Gullón se conserva por el mismo criterio que Valle de San Juan y
  Chocolates Trapa —familiar desde 1892, marca propia y fábricas en el propio
  municipio— y queda marcada para revisar en la 2ª pasada, porque es también
  una marca de gran consumo nacional. Aplicar tres criterios distintos dentro
  de una misma provincia habría sido peor que aplicar uno discutible.

## PA-10 — Despensa artesanal y conservas

Decisiones cerradas el 2026-07-27 sobre las 12 filas: **9 verificadas, 2
parciales y 1 purga**. Es el lote con más recategorizaciones de la pasada:
**siete de doce filas estaban en la categoría equivocada**.

- `verificado` + ecommerce (6): Amo Conservas, J.J. Foodie, Cascajares, Damma,
  Delicatessen Mavimar y Productos Alpe.
- `verificado`, venta no comprobada (3): Josango, Conservas Ramos y Agropal.
- `parcial` (2): Sabor de Castilla y Produlca.
- `purge:not-producer` (1): Exlual.

Incidencias reutilizables:

- **Estar en el club de calidad no implica ser productor.** El propio registro
  de la Diputación tipifica a Grupo Exlual como **distribuidor** de alimentos y
  bebidas, con marcas ajenas en catálogo y un solo producto en banda azul —una
  pasta de hojaldre con marca Palentinos, es decir, marca de distribución—. Es
  la primera fila de la provincia que demuestra que la pertenencia a Alimentos
  de Palencia no acredita elaboración propia, y obliga a leer la ficha, no solo
  la lista.
- **`Despensa artesanal` era el cajón de sastre del volcado.** Cascajares y
  Mavimar son `Comida preparada`, Alpe y Produlca `Pan y pastelería`, Damma y
  Sabor de Castilla `Carnes`, J.J. Foodie `Salsas` y Agropal `Legumbres`. De
  las nueve filas de la categoría **no queda ninguna**.
- **Dos casi-purgas que se salvaron por la instalación propia.** Damma parecía
  una tienda online de lechazo IGP y cochinillo de Segovia —producto de otra
  provincia— y tiene **sala de despiece propia** y elaborados artesanos; Agropal
  parecía un suministro agrícola y comercializa con **marca propia Legumbres
  Agropal** la alubia, el garbanzo y la lenteja de sus socios. En los dos casos
  lo decisivo fue la ficha del registro, no la web.
- **Dos dominios más sin contenido**: `sabordecastilla.es` sirve la página por
  defecto del hosting («Welcome to the home of…, upload your website into the
  public_html directory», creada en 2021) y `produlca.com` es NXDOMAIN pese a
  seguir indexado. Se vacían los dos.
- **Una provincia sin mar puede tener conservera de anchoa.** Conservas Ramos
  lleva desde 1935 salando y envasando a mano anchoa del Cantábrico en Herrera
  de Pisuerga. La materia prima de fuera no descalifica: lo que cuenta es dónde
  se elabora.
- **Un enlace a un marketplace colectivo que no carga no es canal.** El «Ir a la
  tienda» de Conservas Ramos apunta al Market de Tierra de Sabor, que sí sería
  escaparate colectivo oficial, pero la URL da 404: `no comprobado`.

## PA-11 — Fruta, verdura, legumbres, huevos, pescado, helados y setas

Decisiones cerradas el 2026-07-27 sobre las 22 filas restantes: **12
verificadas, 9 parciales y 1 purga**. Cierra la primera pasada.

- `verificado` + ecommerce (3): Puebla Luis (legumbre), Cocimar y EntreSetas.
- `verificado`, venta no comprobada (9): Ganadera de la Nava, Helados Fede
  Cuesta, Leguminor, Legumbres La Vega, La Vieja Olma, Cabo Vírgenes,
  Merpacífico, Piscifactoría de Campoo y Micopal.
- `parcial` (9): La Germy, Pistachos Muñoz, Hortalizas Mauri, Hortalizas Salus,
  Granja Pepín, Granja Juanito, Huevos de Campos, Avícola Melero y Aquadomus.
- `purge:nonexistent` (1): «Tierra de Cannpos».

Incidencias reutilizables:

- **La purga era un artefacto del volcado, no una empresa.** «Tierra de
  Cannpos» tenía por nombre una comarca mal escrita, por `municipio` esa misma
  comarca —que abarca cuatro provincias—, por `direccion` el nombre repetido sin
  calle, y ni teléfono ni correo ni web ni redes. Era además la única fila cuyo
  `municipio` no se podía corregir, porque no designaba ningún lugar concreto.
- **Tres filas de «Fruta y verdura» no lo eran**: La Germy es un obrador de
  repostería, Campos de Nava es la **lechera** Ganadera de la Nava y Pistachos
  Muñoz es frutos secos. Y dos de «Pescado» tampoco: Aquadomus envasa **agua
  mineral** —segunda fila de esa categoría tras Fuentes de Lebanza— y la trufa y
  setas pasan a `Setas y hongos` porque ninguna de las dos hace trufa.
- **El último enlace cruzado del volcado.** Hortalizas Salus llevaba la web, el
  Facebook y el Instagram de **Agropal**. Al vaciarlos desaparece el último
  dominio falsamente repetido que PA-00 había marcado como duda: de los once
  grupos de duplicados anunciados, **cuatro eran contaminación del scrape y no
  duplicados** (las cecinas de Villarramiel, Puebla Luis, las dos Virgen del
  Brezo y este).
- **Dos slugs más con código postal en vez de municipio**: `helados-fede-cuesta-34114`
  y `piscifactoria-de-campoo-34815`, que se suman a `quesos-latinos-34810` de
  PA-01. Los tres se renombraron.
- **Cuatro localidades más puestas como municipio**: Cascón de la Nava→Villaumbrales,
  Velillas del Duque→Quintanilla de Onsoña, Villanueva de los Nabos→Villaturde y
  Arenillas de San Pelayo→Buenavista de Valdavia. Con estas, **la provincia se
  queda sin ninguna fila fuera del geo-check**.
- **Corregir el municipio puede crear un aviso de distancia.** Al pasar la
  Piscifactoría de Campoo a Santibáñez de la Peña, sus coordenadas —que
  apuntaban a la dirección administrativa de Aguilar de Campoo— quedaron a 38,7
  km. Se sustituyeron por el centroide del municipio, que es honesto, en vez de
  inventar una precisión para Villafría de la Peña.
- **La legumbrera declara que no cultiva y aun así entra**, por la excepción de
  provincia que se fija en Reglas locales 10. Es la misma figura que León usó
  con sus envasadoras, y conviene que quede escrita como excepción acotada y no
  como criterio general.
- **Tres dudas productor/distribuidor que se quedan como dudas.** Avícola Melero
  (clasificada como mayorista, con nave de polígono y no granja), Sabor de
  Castilla y Repostería El Cisne se quedan `parcial` con la contradicción
  anotada. No hay prueba de reventa pura ni de elaboración propia, y el contrato
  dice que la incertidumbre no se convierte en exclusión.
