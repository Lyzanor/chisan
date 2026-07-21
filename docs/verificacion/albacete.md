# Verificación provincial de Albacete

Ledger para planificar y reanudar la verificación profunda de
`data/csv/castilla-la-mancha/albacete.csv`. El CSV es la fuente de verdad y la
evidencia por decisión vive en `data/evidence/castilla-la-mancha/albacete.jsonl`.

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
fija el snapshot, los riesgos locales y el alcance de los lotes. Los contratos
aplicables son `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md` y
`docs/EDITORIAL_POLICY.md`.

## Cómo reanudar

1. Leer `git status --short`, Estado, Reglas locales y solo el lote activo.
2. Confirmar que no hay cambios concurrentes en Albacete.
3. Investigar primero identidad, exclusiones, duplicados y unidad productiva.
4. Resolver `Venta online` de forma independiente y desde cero: en esta
   provincia el valor heredado **no es prueba de nada** (ver Reglas locales).
5. Editar el CSV de forma estructurada, añadir o sustituir una línea JSONL por
   decisión y actualizar aquí el resumen del lote.
6. Pasar `check:csv:changed`, `check:evidence:changed` y `git diff --check`.
   El cierre provincial pasa `verify:data`.

Los lotes agrupan de 7 a 12 filas por categoría, DO o fuente común. No se
añaden candidatos nuevos hasta terminar la primera pasada de las filas
existentes.

## Definición de completado

- No queda ninguna fila sin decisión editorial revisada en esta pasada.
- `pendiente` solo sobrevive con bloqueo real documentado; `parcial` es un
  resultado final válido cuando la evidencia tiene techo registral o secundario.
- Cada fila conservada tiene un `keep` vigente y cada baja o consolidación un
  `purge` o `merge` trazable.
- Todos los `Venta online=sí|no` están demostrados y los `sí` tienen canal.
- Ninguna fila conserva un directorio como `web` propia.
- Albacete se añade a `data/evidence/coverage.json` solo al cerrar la pasada.

## Estado

- Inicio: **2026-07-21**. Primera pasada profunda de las **116 filas**
  existentes; no añadir candidatos hasta el cierre.
- Snapshot inicial: **116 filas**; **112 `pendiente`, 2 `parcial`, 2
  `verificado`**. Venta online: **75 `sí`, 41 `no comprobado`**, pero solo
  **2 de esos 75 `sí` tienen canal** y solo 2 filas están verificadas.
- Evidencia inicial: **3 registros** para 116 filas.
- Imágenes: **115 de 116 filas sin imagen**; queda fuera de esta pasada.
- El árbol tenía trabajo concurrente en Sevilla, Las Palmas, Santa Cruz de
  Tenerife y Cáceres al iniciar; queda expresamente fuera de este expediente.
- Tras AB-01 (2026-07-21): **116 filas**; **105 `pendiente`, 2 `parcial`, 9
  `verificado`**. Las siete queserías se conservaron y quedaron verificadas;
  seis acreditan ecommerce propio y Quesos Tornero queda `no comprobado`. Se
  sustituyeron dos webs de directorio por el dominio real (Finca La Cuadra) o
  por vacío (Quesos Tornero) y se corrigieron dirección, teléfono y correo de
  Dehesa de Los Llanos y El Minayero. No hubo cambios de slug ni imágenes.
- Tras AB-02 (2026-07-21): **115 filas**; **98 `pendiente`, 0 `parcial`, 17
  `verificado`**. Siete queserías quedaron verificadas, seis con ecommerce
  propio y Quesos La Torre `no comprobado`. Blincos S.L. se fusionó en Quesos
  Rodanoble (misma unidad productiva) y Vega Sotuélamos se trasladó de
  Chinchilla a El Bonillo, donde está su fábrica, con cambio de slug y `merge`.
  Se sustituyeron dos dominios muertos por el vivo (vegamancha → vegasotuelamos,
  rodanoble.es → rodanoble.com).
- Tras AB-03 (2026-07-21): **115 filas**; **90 `pendiente`, 3 `parcial`, 22
  `verificado`**. Cerrado el bloque lácteo completo (25 filas). Siete queserías
  verificadas y dos `parcial` por falta de fuente primaria viva (Tiriez, con el
  dominio extinto, y Segama, sin web). Se añadió el desambiguador `robledo` a
  `data/reference/municipios-overrides.json`, con lo que las filas fuera del
  geo-check bajan de 2 a 1.

## Reglas y riesgos locales

1. **El `Venta online=sí` heredado es ruido.** 75 filas lo declaran y solo 2
   acreditan canal, con 112 filas sin verificar. Se trata cada valor como no
   resuelto y se vuelve a decidir contra la fuente; sin canal demostrado en vivo
   el resultado es `no comprobado`, no `sí`.
2. **Hay directorios usados como `web` propia** en 22 filas: `apoloybaco.com`
   (10), `denominacion-origen-almansa.com` (6), `jumilla.wine` (2),
   `mejordepueblo.com`, `gourmets.net`, `sigfito.es`, `albaceteabierto.es`,
   `zipmec.eu`. Son fuentes de apoyo, no sitio del productor: hay que buscar el
   dominio real y, si no existe, vaciar `web` en vez de conservar el directorio.
3. Las cooperativas vinícolas manchegas venden a granel y a embotelladores. Una
   cooperativa de primer grado que solo elabora para terceros sin marca propia
   es `purge:out-of-scope`; con marca propia al consumidor, se conserva.
4. `Ontalba` figura dos veces (Albatana y Ontur). Verificar si es una sola
   unidad productiva antes de conservar ambas.
5. Queso manchego: distinguir quesería con obrador propio de marca comercial o
   envasador. La DOP Queso Manchego confirma inscripción y localización, pero
   sin fuente primaria viva deja techo `parcial`.
6. Vigilar marcas industriales o de gran escala (Ayuso, Lozano, Champinter):
   la existencia de planta en Albacete no garantiza encaje en el alcance KM0.

## Worklist

| Lote | Alcance | Filas | Estado | Riesgo principal |
|---:|---|---:|---|---|
| AB-00 | Higiene, snapshot y partición | 116 | ✅ 2026-07-21 | 112 pendientes; 73 `sí` sin canal; 22 webs de directorio |
| AB-01 | Lácteos I — Minaya, Ossa, Santa Ana, Albacete | 7 | ✅ 2026-07-21 | 7 verificadas; 6 ecommerce; 2 webs de directorio sustituidas |
| AB-02 | Lácteos II — Chinchilla, Fuente-Álamo, Letur, La Roda, Villamalea, El Bonillo | 8 | ✅ 2026-07-21 | 7 verificadas; 1 merge; Vega Sotuélamos trasladada a El Bonillo |
| AB-03 | Lácteos III — Ontur, Villarrobledo, Lezuza, Munera, La Herrera, Robledo, Mahora | 9 | ✅ 2026-07-21 | 7 verificadas, 2 parciales; 1 dominio extinto; homónimo Robledo resuelto |
| AB-04 | Bodegas DO La Mancha — Villarrobledo I | 7 | ⏳ | Escala industrial (Ayuso) |
| AB-05 | Bodegas DO Almansa | 11 | ⏳ | 6 filas con web de la DO |
| AB-06 | Bodegas DO Manchuela I | 7 | ⏳ | Cooperativas de primer grado |
| AB-07 | Bodegas DO Manchuela II | 12 | ⏳ | Cooperativas de primer grado |
| AB-08 | Bodegas DO Jumilla (Ontur, Hellín, Montealegre) | 7 | ⏳ | Duplicado Ontalba; 2 webs de `jumilla.wine` |
| AB-09 | Bodegas DO La Mancha — La Roda y Villarrobledo II | 7 | ⏳ | Escala industrial (Lozano) |
| AB-10 | Bodegas sin web propia (fuente `apoloybaco`) | 10 | ⏳ | Alto riesgo de purga: graneleras sin marca |
| AB-11 | Aceite y miel | 10 | ⏳ | Pequeñas explotaciones de sierra |
| AB-12 | Azafrán, frutos secos, pan, cerveza, setas, fruta, harina, charcutería | 20 | ⏳ | 4 webs de directorio; azafrán reenvasado |
| AB-13 | Cierre: reauditoría, reconciliación y cobertura | — | ⏳ | Paridad CSV/evidencia y `coverage.json` |

## AB-00 — Higiene, snapshot y partición

Cerrado el 2026-07-21. Sin cambios en datos: solo diagnóstico y partición.

Hallazgos que condicionan toda la pasada:

- El CSV es un volcado sin revisar: 112 de 116 filas en `pendiente` y solo 3
  registros de evidencia. Los estados heredados no son un punto de partida
  fiable, sino el objeto de la revisión.
- La incoherencia dominante es `Venta online=sí` masivo (75 filas) sin canal
  (73) ni verificación. Se reevalúa desde la fuente en cada lote.
- 22 filas usan un directorio como `web`; se resuelven dentro de su lote.
- La provincia se concentra en dos bloques: **61 bodegas** y **25 queserías**,
  que definen la partición junto a un bloque final de categorías menores.

## AB-01 — Lácteos I: Minaya, Ossa de Montiel, Santa Ana y Albacete

Decisiones cerradas el 2026-07-21:

- `verificado` + ecommerce: Quesos El Minayero, Quesería Guijarro Muñoz, Quesos
  Don Eusebio, Quesos Julián Olivas, Dehesa de Los Llanos y Finca La Cuadra.
- `verificado`, venta no comprobada: Quesos Tornero.

Incidencias reutilizables:

- El registro del consejo regulador, `quesomanchego.es/en/manufacturers/`,
  confirma inscripción, municipio y contacto de las queserías DOP; es fuente de
  apoyo y por sí solo deja techo `parcial`.
- Los agregadores `mejordepueblo.com`, `larutadelqueso.es`, `bittersugar.es` y
  similares se citan entre sí y atribuyen «tienda online» a productores que no
  la tienen. No sirven como web propia ni acreditan venta remota.
- Quesos Tornero no tiene dominio propio: su fuente primaria es la página
  oficial de Facebook, viva y con actividad reciente, que basta para
  `verificado` pero no acredita pedido remoto.
- El dominio de Dehesa de Los Llanos migró: `.es` responde 301 hacia `.com`.
  La redirección es cambio de web canónica, no un enlace roto.
- Finca La Cuadra separa domicilio social (C/ Baños 17, Albacete) y unidad
  productiva (quesería de Casa de la Hita). La fila sigue a la unidad
  productiva; ambas están en el término municipal de Albacete.
- El carrito vacío de una tienda WooCommerce no muestra «finalizar compra»: no
  es un checkout roto. El Minayero acredita venta con precios, carrito y tarifa
  de envío publicada.

## AB-02 — Lácteos II: Fuente-Álamo, Letur, La Roda, Villamalea y El Bonillo

Decisiones cerradas el 2026-07-21:

- `verificado` + ecommerce: Quesos Vega Sotuélamos, Quesos Cerrón, El Cantero de
  Letur, Quesos Rodanoble, Quesos La Rueda del Cabriel y Lácteos El Bonillo.
- `verificado`, venta no comprobada: Quesos La Torre de La Roda.
- `merge`: Blincos S.L. → Quesos Rodanoble.

Incidencias reutilizables:

- **Dos filas con la misma dirección y el mismo teléfono son la señal barata de
  duplicado.** Blincos S.L. es la razón social de la quesería Rodanoble; el
  consejo regulador la inscribe por la razón social y el mercado la conoce por
  la marca. Sobrevive el slug de marca y la razón social pasa a la descripción.
- **El pie de web que lista varias sedes decide el municipio.** Vega Sotuélamos
  separa «Fábrica» (Finca Sotuélamos, El Bonillo) de «Maduración y logística»
  (Chinchilla, que es además el domicilio social). La fila sigue a la fábrica.
  Rodanoble separa igual quesería (Alfredo Atienza 18) de carnicería
  (Campoamor 33).
- Los agregadores empresariales dan el domicilio social, que en esta provincia
  suele ser la oficina o la planta de maduración, no el obrador.
- WebFetch recibe 503 con `Retry-After: 86400` de algunos dominios propios
  (quesoslatorre.es) y 404 en portadas que el navegador sí carga. Es bloqueo
  técnico, no sitio muerto: se resolvió con el navegador.
- Una web propia reducida a portada con dirección y teléfono confirma
  identidad, municipio y contacto, pero no acredita venta remota.

## AB-03 — Lácteos III: Ontur, Villarrobledo, Lezuza, Munera, Robledo y Mahora

Decisiones cerradas el 2026-07-21. Con este lote queda cerrado el bloque lácteo
completo de la provincia (25 filas).

- `verificado` + ecommerce: La Casica de Villegas, Quesos Cerro, Roblemancha,
  Quesos Robledal y Quesos El Convento.
- `verificado` + pedido por correo y teléfono: Quesos Pastor de Munera.
- `verificado`, venta no comprobada: Quesos Serrano Flores.
- `parcial`, venta no comprobada: Industrial Quesera Tiriez y Quesos Segama.

Incidencias reutilizables:

- **NXDOMAIN sí es un dominio muerto.** A diferencia de un 503 o un fallo TLS,
  que son bloqueo, `industrial-quesera-tiriez.com` no resuelve ni en apex ni en
  www: el campo `web` se vacía y la fila queda `parcial` por no tener fuente
  primaria viva.
- **Un certificado con otro `altname` significa que el dominio ya no es suyo.**
  `quesoselconvento.com` presenta el certificado de `azabachealbacete.com`; la
  web viva de la quesería es el `.es`.
- WebFetch fuerza HTTPS, así que un sitio antiguo servido solo por HTTP
  (Pastor de Munera) parece caído. Se lee con el navegador.
- «Envío en frío a cualquier punto de España» más correo y teléfono publicados
  por el propio productor es canal acreditado (`email|telefono`), aunque no
  haya carrito.
- Una web propia «en construcción», sin precios ni pedido, verifica identidad y
  actividad pero deja la venta en `no comprobado`.
- Un `municipio` con paréntesis desambiguador («Robledo (Albacete)») deja la
  fila fuera del geo-check. La solución es el nombre oficial más una entrada en
  `municipios-overrides.json`, con **todos** los candidatos homónimos para no
  romper la comunidad ajena.
