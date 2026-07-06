# Verificación provincial de Ávila

Ledger para planificar y reanudar la revisión profunda de
`data/csv/castilla-y-leon/avila.csv`. El CSV es la fuente de verdad. La
evidencia estructurada por fila debe vivir en
`data/evidence/castilla-y-leon/avila.jsonl` a medida que se cierre cada lote
(ni el fichero ni la carpeta `data/evidence/castilla-y-leon/` existen todavía;
se crean al cerrar el lote 1).

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento
no lo duplica, solo fija el snapshot, las particularidades de Ávila y el plan
de lotes. Los contratos viven en `docs/CSV_CONTRACT.md`,
`docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`.

## Cómo usar este documento (léelo primero)

Este ledger está pensado para que cualquier agente pueda ejecutarlo de forma
autónoma y por partes. Para trabajar un lote solo necesitas leer:

1. **Estado** (snapshot y anomalías conocidas).
2. **Reglas duras para Ávila** (criterios de decisión por sector).
3. La fila de tu lote en la **worklist** y su lista de slugs en **Alcance
   exacto de cada lote**.
4. **Flujo por lote** (pasos mecánicos y comandos).

No releas el manual entero por lote ni los contratos completos; consúltalos
solo ante una duda concreta. Los slugs listados en tu lote **son** el lote:
no toques ninguna fila fuera de esa lista (tampoco "de paso"). Si detectas un
problema en una fila de otro lote, anótalo en la sección Estado y sigue.

## Estado

- Inicio: 2026-07-04. Modo: **primera pasada profunda**. No añadir candidatos
  nuevos; primero cerrar identidad, alcance, municipio y venta online de las
  filas heredadas. No existe `docs/candidates/avila.md`.
- Snapshot inicial: **152 filas**; **152 `pendiente`**, 0 `parcial`, 0
  `verificado`. No hay verificados heredados que reauditar: todo se decide de
  cero dentro de su lote.
- Tras lote 1 (2026-07-04): **151 filas** (−1 purga); **139 `pendiente`**, 1
  `parcial`, 11 `verificado`.
- Tras lote 2 (2026-07-04): **151 filas** (sin purgas); **122 `pendiente`**, 1
  `parcial`, 28 `verificado`.
- Tras lote 3 (2026-07-04): **151 filas** (sin purgas); **110 `pendiente`**, 1
  `parcial`, 40 `verificado`.
- Tras lotes 4-6 (2026-07-04): **150 filas** (−1 purga, Ornua); **67
  `pendiente`**, 1 `parcial`, 82 `verificado`.
- Tras lotes 7-9 (2026-07-04): **147 filas** (−3: 2 purgas más —Marugán
  cerrada, Sabores de Gredos marketplace—, 1 merge neto —Judías del
  Barco→Coronado—; los otros 2 merges de esta tanda no reducen el total
  porque solo renombran slug); **21 `pendiente`**, 6 `parcial`, 120
  `verificado`.
- **Cierre 1ª pasada (lote 11, 2026-07-06): 145 filas, 137 `verificado`, 8
  `parcial`, 0 `pendiente`; VO 63 `sí` (63/63 canal) / 0 `no` / 82 `no
  comprobado`. `verify:data` verde; Ávila en `coverage.json` (advisory
  strict). Evidencia: 160 registros (145 keep, 5 purge, 10 merge), cubre las
  145 filas. 0 duplicados, 0 geo-warnings, 0 huecos reales de
  municipios.json.** Residual para 2ª pasada: 8 `parcial` (motivo anotado),
  imágenes 0/145.
- Tras lote 10 (2026-07-04): **145 filas**; **0 `pendiente`**, 8 `parcial`,
  137 `verificado`. **Las 152 filas originales quedan todas revisadas**
  (152 iniciales − 4 purgas: Ornua, Marugán, Sabores de Gredos, La Casa de
  Pilar − 2 fusiones que eliminan fila duplicada: Judías del Barco→Coronado,
  miel La Carrera→Picorea − 1 fila adicional resuelta por fusión/corrección
  de identidad detectada en el cierre de cifras); el lote 11 es cierre
  transversal (dedup, geo-warnings, coverage.json), no relleno de
  pendientes.
- Venta online inicial: **152 `no comprobado`**, 0 `sí`, 0 `no`. `Canal de
  venta`: 0/152. No hay cuarentena heredada: cada `sí` que se cree nace ya con
  canal y evidencia; cada `no` exige comprobación real.
- Tras lote 1: VO **9 `sí`** (9/9 con `Canal de venta`), 0 `no`, 142 `no
  comprobado`.
- Tras lote 2: VO **23 `sí`** (23/23 con `Canal de venta`), 0 `no`, 128 `no
  comprobado`.
- Tras lote 3: VO **31 `sí`** (31/31 con `Canal de venta`), 0 `no`, 120 `no
  comprobado`.
- Tras lotes 4-6: VO **42 `sí`** (42/42 con `Canal de venta`), 0 `no`, 108 `no
  comprobado`. (Nota: bajó de 44 a 42 porque, al revisar lotes 7-9, se
  descubrió que la plataforma **Ávila Market** (avilamarket.es) cesó su
  actividad; se corrigieron retroactivamente `restaurante-y-bodega-huellas-
  del-tietar-lanzahita` y `queseria-valdecabras-candeleda`, que solo citaban
  ese canal, a `no comprobado`. `vda-viticultores-villanueva-de-avila`,
  `morcillas-de-arroz-j-n-casavieja` y `quesos-del-alberche-navandrinal`
  conservaron `sí` porque tenían un canal propio adicional.)
- Tras lotes 7-9: VO **58 `sí`** (58/58 con `Canal de venta`), 0 `no`, 89 `no
  comprobado`.
- Tras lote 10: VO **63 `sí`** (63/63 con `Canal de venta`), 0 `no`, 82 `no
  comprobado`.
- Imágenes: **0/145**. Las imágenes NO forman parte de esta pasada; quedan
  como residual explícito para una pasada posterior (tras estabilizar
  identidad y slugs). No usar `enrich:images --apply` en bloque.
- Reparto por categoría (17, snapshot inicial): **Charcutería 31**, **Bodega
  24**, **Pan y pastelería 17**, **Lácteos y quesos 14**, **Dulces y
  repostería 11**, **Legumbres 9**, **Aceite 8**, **Fruta y verdura 8**,
  **Miel 6**, **Despensa artesanal 5**, **Huevos 5**, **Helados 4**,
  **Chocolate 3**, **Aromáticas y condimentos 2**, **Cerveza artesana 2**,
  **Frutos secos 2**, **Otros 1**. Tras lote 1: Charcutería 30 (−1 purga).
- Territorio (snapshot inicial): 66 municipios distintos; cabeceras **Ávila
  26**, **El Barco de Ávila 11**, **Cebreros 6**, **Candeleda 6**, **Arenas de
  San Pedro 5**, **El Barraco 5**, **Las Navas del Marqués 5**, **Sotillo de
  la Adrada 5** y cola larga de municipios con 1-4 filas. Tras lote 1: La
  Estación (zona de Las Navas del Marqués) deja de contar como municipio
  propio; Las Navas del Marqués pasa a 6.
- Enlaces iniciales: **web 103/152**, Instagram 37/152, Facebook 48/152,
  Google Maps 152/152, teléfono 133/152, correo 43/152, dirección 152/152,
  lat/lon 152/152, horario 152/152, descripción 152/152. Las descripciones y
  horarios parecen volcado automático: revisarlos solo cuando contradigan la
  fuente.
- Calidad inicial:
  - `node scripts/audit-csv.js --mode=contract data/csv/castilla-y-leon/avila.csv`
    devuelve **0 errores, 0 warnings, status OK**.
  - `node scripts/audit-csv.js --mode=quality data/csv/castilla-y-leon/avila.csv`
    devuelve **0 errores, 3 warnings** y 115 avisos suprimidos por opcionales
    ausentes.
- Warnings de geo-check iniciales (los 3, con su lote):
  - ~~`embutidos-y-carnes-miguel-pascual-la-estacion` (lote 1)~~ **resuelto
    2026-07-04**: municipio corregido a Las Navas del Marqués (confirmado por
    directorios/einforma como negocio de la zona de la estación); slug
    renombrado a `embutidos-y-carnes-miguel-pascual-las-navas-del-marques` con
    `merge` en la evidencia.
  - ~~`quesos-miguel-avila` (lote 6)~~ **resuelto 2026-07-04**: el municipio
    era el error, no las coordenadas — la dirección decía «05113 Avila» pero
    05113 es el código postal de Burgohondo, no de la capital. Municipio
    corregido a Burgohondo; slug renombrado a `quesos-miguel-burgohondo` con
    `merge` en la evidencia.
  - ~~`miel-artesanal-la-carrera` (lote 10)~~ **resuelto 2026-07-04**: era la
    misma empresa que `miel-artesanal-la-picorea-la-carrera` (mismo teléfono y
    web) con una ficha de Maps mal geolocalizada a 62 km; fusionada.
- **Municipios que no estaban en `data/reference/municipios.json`**: ✅
  **cerrado 2026-07-06**. En el cierre transversal, con la normalización real
  del audit (que colapsa guiones/acentos a espacio) **los 145 municipios del
  CSV están en la referencia**: 0 huecos reales, geo-check protege las 145
  filas.
  - Pedanías/anejos corregidos al municipio oficial INE (localidad conservada
    en `direccion`, slug renombrado con `merge`): **Vicolozano**→Ávila (lotes
    6/9), **El Raso**→Candeleda (lote 9), **La Estación**→Las Navas del
    Marqués (lote 1), **Palacios**→Sotalbo (lote 5), **Tornadizos de
    Arévalo**→Palacios de Goda (lote 11), **Navandrinal**→San Juan del
    Molinillo (×2, lote 11), **Narrillos de San Leonardo**→Ávila (lote 11).
  - Sospechas de hueco que resultaron estar en la referencia (no se tocó la
    fila): **Solana de Ávila**, **La Carrera**, **San Esteban de los Patos**,
    **Cabezas de Alambre**, **Salvadiós** y **Pedro-Rodríguez** (esta última
    bajo la clave normalizada `pedro rodriguez`).
- Duplicados: ✅ 0 tras el cierre. Sospechas resueltas: los dos «Obrador de
  Ángel» (lote 7) y las dos «La Serrota» (Agropecuaria vs Embutidos) son
  negocios distintos; `frutos-secos-loli-flores-y-jimenez` y
  `panaderia-flores-y-jimenez` comparten dominio pero son dos unidades del
  mismo grupo familiar (direcciones/teléfonos distintos); las dos mieles de La
  Carrera eran la misma empresa (fusionada, lote 10).
- Evidencia: ✅ Ávila **añadida a `data/evidence/coverage.json`** (advisory
  strict) el 2026-07-06. Ledger en `data/evidence/castilla-y-leon/avila.jsonl`
  (160 registros tras lote 11: 145 `keep`, 5 `purge`, 10 `merge`); cubre las
  145 filas actuales del CSV.

## Zonas de Ávila para lotear

- **Ávila capital y alfoz**: Ávila, Vicolozano, Martiherrero, La Colilla,
  Narrillos de San Leonardo, Mingorría, Riofrío, San Esteban de los Patos.
  Yemas y dulces, obradores urbanos, cárnicas, helados, frutos secos.
- **La Moraña y Tierra de Arévalo** (llanura cerealista norte): Arévalo,
  Langa, Palacios de Goda, Castellanos de Zapardiel, El Oso, Crespos,
  Blascosancho, Pajares de Adaja, Pedro-Rodríguez, Cabezas de Alambre,
  Salvadiós, San Pedro del Arroyo, Velayos. Legumbres, huevos, queserías,
  cereal. Ojo: el tostón de Arévalo es cosa de asadores (restauración), no de
  productores.
- **Valle Amblés y Sierra de Ávila**: Solosancho, Muñana, Muñogalindo, La
  Torre, Santa María del Arroyo, Solana de Rioalmar, Cillán. Cárnicas, pan,
  miel, queso; contexto IGP Carne de Ávila (avileña-negra ibérica).
- **Alto Tormes y El Barco–Piedrahíta** (suroeste): El Barco de Ávila, La
  Carrera, Becedas, Solana de Ávila, Piedrahíta, Santa María del Berrocal,
  Hoyos del Espino, San Martín de la Vega del Alberche. IGP Judías de El
  Barco, embutidos y jamones, chocolate, cerveza.
- **Alberche y Pinares / zona DO Cebreros**: Cebreros, El Tiemblo, El Barraco,
  San Juan de la Nava, Navaluenga, Burgohondo, Navandrinal, Navatalgordo,
  Villanueva de Ávila, Serranillos, Navarredondilla, Hoyocasero, Herradón de
  Pinares, Las Navas del Marqués (y su zona de La Estación), Navahondilla.
  Garnacha de Gredos (DO Cebreros), pan, queso, miel, cerveza.
- **Valle del Tiétar** (cara sur de Gredos): Sotillo de la Adrada, La Adrada,
  Piedralaves, Casavieja, Casillas, Santa María del Tiétar, Lanzahíta,
  Mombeltrán, San Esteban del Valle, Arenas de San Pedro, Candeleda, El Raso.
  Quesos de cabra, pimentón de Candeleda, higos, kiwi, olivar del Tiétar,
  miel, morcillas de Sotillo.

## Hallazgo transversal: plataformas de venta caídas o comprometidas

Detectado en lotes 3-9 (2026-07-04), aplica a cualquier lote pendiente:

- **Ávila Market (avilamarket.es)**: cesó su actividad ("proyecto finalizado
  a 31 de diciembre"). No usar como canal `marketplace` aunque la web del
  productor lo mencione; si es el único canal citado, `Venta online` baja a
  `no comprobado`.
- **Dominios hackeados/parkeados con spam de casino**: al menos tres casos
  (`vavada.inst` en Instagram y `rubendiazviticultor.com` en lote 3;
  `montesbravos.es` en lote 6; spam inyectado pero tienda real en
  `riconuevovinos.es`, lote 4). Antes de citar un enlace del CSV o de una
  búsqueda, comprobar que el contenido real corresponde al productor; si un
  dominio está aparcado o redirige a un sitio ajeno, retirarlo del CSV
  (regla 18: la dificultad de acceso no prueba nada negativo, pero un
  contenido claramente ajeno sí).
- **Ávila Auténtica (tienda.avilaautentica.es)** sigue activa: no confundir
  con Ávila Market.

## Reglas duras para Ávila

1. **El alcance del lote está congelado.** Trabaja solo los slugs listados en
   tu lote. Si un slug cambia (municipio erróneo) o desaparece (purga/fusión),
   actualiza la lista de tu lote y la worklist en el mismo cambio.
2. **Todo parte de `pendiente`.** Cada fila del lote termina con decisión
   actual: `verificado`, `parcial`, `pendiente` (solo con motivo anotado),
   purga o fusión, y con su línea de evidencia JSONL.
3. **Venta online desde cero.** `sí` exige mecanismo de pedido remoto vigente
   y utilizable (tienda propia, WhatsApp/teléfono/email anunciado para
   pedidos, marketplace verificable) y siempre lleva `Canal de venta`
   (`ecommerce`, `whatsapp`, `email`, `telefono`, `suscripcion` o
   `marketplace`, múltiples con `|`). `no` solo tras comprobar que no hay
   pedido remoto. En duda: `no comprobado` (y canal vacío). Catálogo sin
   compra, reventa en terceros sin ficha verificable o formulario ambiguo no
   son `sí`.
4. **Directorios y marcas capan en `parcial`.** Ávila Auténtica, Tierra de
   Sabor, IGP/DO, RGSEAA, premios y prensa apoyan existencia e identidad, pero
   como fuente única no dan `verificado`: hace falta fuente propia (web,
   tienda, perfil oficial) o ficha real de Google Maps que sostenga identidad,
   actividad productora y municipio.
5. **Charcutería (31) = elaborador, no carnicería ni asador.** Entra la
   fábrica de embutidos, secadero u obrador cárnico con elaboración propia.
   Una carnicería solo entra si acredita elaboración propia; un asador o
   restaurante no es productor (`asador-el-figon-de-arevalo-arevalo` es
   probable purga `not-producer`). La IGP Carne de Ávila da contexto, no
   verificación. `icav-...-avila` es una comercializadora cooperativa:
   decidir alcance y anotarlo.
6. **Bodega (24) = viticultor/elaborador con vino propio.** Ancla: DO
   Cebreros (garnacha y albillo real de Gredos; Cebreros, El Tiemblo, alto
   Alberche). Separar bodega real de vinoteca, distribuidor o embotellador.
   `aguas-minerales-de-avila-ursu-el-oso` no es bodega: recategorizar (mirar
   `npx pnpm list:categories`) o purgar por alcance, con nota.
   `restaurante-y-bodega-huellas-del-tietar-lanzahita` probablemente es
   restauración: mismo tratamiento que los asadores. Las bodegas de La Moraña
   (Castellanos de Zapardiel, Langa, El Oso) son atípicas: confirmar que
   existe elaboración real.
7. **Legumbres (9) = IGP Judías de El Barco de Ávila.** Entra el
   productor/envasador local de judías (El Barco, Velayos). Una tienda que
   solo revende queda fuera o `parcial` según evidencia
   (`legumbres-vaquero-tienda-...` se anuncia como tienda). La fila genérica
   `judias-del-barco-de-avila-el-barco-de-avila` puede ser el consejo
   regulador o una marca genérica, no una empresa: resolver identidad y, si no
   hay productor concreto detrás, purgar `not-producer`.
8. **Lácteos y quesos (14) = quesería artesana.** Cabra del Tiétar y
   queserías de La Moraña/Alberche. `ornua-ingredientes-espana-slu-vicolozano`
   es la planta industrial de una multinacional de ingredientes lácteos:
   probable purga por alcance (precedente: IFFCO/Puleva en Granada).
   `ganaderos-de-caprino-de-candeleda-candeleda` y
   `alta-morana-sociedad-cooperativa-san-pedro-del-arroyo`: confirmar que hay
   producto propio a la venta, no solo asociación ganadera o servicios.
9. **Dulces y repostería (11) + Chocolate (3) = obrador real.** Yemas de
   Ávila/Santa Teresa como producto emblema. Obradores conventuales entran
   (`hermanas-clarisas-...`). `santa-teresa-gourmet-oficinas-y-fabrica-no-venta-avila`
   es productor real con nombre sucio de Maps: limpiar `nombre` (el slug se
   queda). `elgorriaga-brands-s-a-avila` es marca industrial: decidir alcance
   km0 y anotarlo. `yemas-de-avila-avila` sin web: resolver si hay obrador
   concreto detrás o es ficha genérica.
10. **Pan y pastelería (17): obrador y mucho negocio sin web.** 12/17 no
    tienen web: tirar de ficha de Maps, Facebook local, ayuntamiento o prensa.
    La ausencia de web NO justifica purga (regla 17). Panificadora vs obrador
    artesano: ambas pueden entrar si elaboran; anotar la diferencia.
11. **Aceite (8): almazaras del Tiétar/Alberche y aceituneras.** Entran
    almazaras y cooperativas con molturación (La Beltraneja, La Moraleda,
    Alberche). Las «aceituneras» (`aceitunas-simon-...`, `aceitunas-ovidio-...`,
    `aceitunas-serranillo-avila`) pueden ser aceituna de mesa: si es su
    actividad real, recategorizar a `Aceitunas y encurtidos` (confirmar valor
    con `list:categories`) en vez de dejarlas en Aceite.
12. **Fruta y verdura (8): huerta e higo de Gredos.** Kiwi y subtropical de
    Candeleda/El Raso, higos (Capra Hispánica), huertas eco. Si una fila es
    esencialmente ganadera o de otro producto, recategorizar con fuente.
    `huerta-col-despoblado-de-caniclosa-salvadios` tiene identidad difusa:
    exigir fuente concreta o degradar/purgar.
13. **Miel (6) = apicultor con colmenas propias.** Gredos y Tiétar. Resolver
    juntas las dos filas de La Carrera (posible confusión de identidad entre
    `miel-artesanal-la-carrera`, con coords en Villanueva de Ávila, y
    `miel-artesanal-la-picorea-la-carrera`).
14. **Pimentón de Candeleda (2 en Aromáticas y condimentos).** Sequeros y
    elaboradores reales de pimentón entran. No adscribir a la DOP Pimentón de
    la Vera (es de Cáceres); no inventar sellos.
15. **Huevos (5) = granja avícola real.** Confirmar explotación (el código
    REGA en la web/etiqueta apoya) y municipio. Distribuidor o tienda de
    huevos sin granja: recategorizar o purgar.
16. **Sectores pequeños (Helados 4, Cerveza 2, Frutos secos 2, Despensa 5,
    Otros 1).** Heladería artesana con obrador propio entra (precedente
    Madrid/Granada). Cerveza: fábrica real o marca con elaboración propia
    verificable. Frutos secos en capital: ¿tostadero/elaborador o tienda?
    `caracoles-de-gredos-...` (helicicultura): si cría propia, entra; revisar
    si `Otros` sigue siendo la categoría correcta. Despensa artesanal: revisar
    qué producto elaboran de verdad y recategorizar si procede
    (`dehesa-de-la-serna-avila` huele a carne/ganadería; `cronoble-avila-s-l`
    a resolver).
17. **No purgar con evidencia débil.** Muchas filas sin web son negocios
    rurales reales. Para purgar exige duplicado, no productor, otra provincia,
    cierre o inexistencia suficientemente contrastada; si no, `parcial` o
    `pendiente` con nota.
18. **URLs difíciles no prueban nada negativo.** Errores HTTP/TLS/DNS, bloqueos
    o timeouts solo crean incertidumbre: confirmar por búsqueda, perfil
    oficial, Maps o fuente local antes de borrar web, venta o fila.
19. **Municipios no oficiales y coordenadas sin red.** Aplica el procedimiento
    de la sección Estado. Si corriges `municipio` y el slug codifica el
    municipio erróneo, corrige también el slug y añade un registro `merge` del
    slug viejo al nuevo (el viejo existe en Git). Las 12 filas sin centroide
    de referencia necesitan comprobación manual de coordenadas.
20. **Nombres con ruido de volcado.** Limpiar `nombre` cuando arrastre
    coletillas de Maps («tienda en...», «(no venta)», eslóganes kilométricos),
    conservando la identidad real. El `slug` NO se toca por limpiar el nombre.
21. **No añadir candidatos nuevos en esta pasada** salvo decisión explícita
    del usuario.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la fuente propia o ficha real cuando la
decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Ávila Auténtica** (Diputación de Ávila): marca y directorio agroalimentario
  provincial. Útil para descubrimiento, identidad y contacto; como fuente
  única capa en `parcial`.
- **Tierra de Sabor** (Junta de Castilla y León): marca de garantía regional
  con directorio de adheridos. Mismo techo: `parcial` como fuente única.
- **IGP Judías de El Barco de Ávila** (consejo regulador): operadores y
  envasadores de legumbre. Apoya pertenencia, no venta online.
- **IGP Carne de Ávila** (raza avileña-negra ibérica): contexto para cárnicas
  y carnicerías; no convierte una carnicería en elaborador.
- **DO Cebreros** (vinos de Gredos: garnacha y albillo real): bodegas y
  viticultores de Cebreros, El Tiemblo y alto Alberche. Apoya pertenencia.
- **RGSEAA** (registro sanitario de AESAN): existencia y razón social de
  industrias alimentarias; techo `parcial`.
- Ayuntamientos, prensa local (Diario de Ávila, Tribuna de Ávila, Ávilared) y
  turismo comarcal (Gredos, Valle del Tiétar): fuentes secundarias para
  resolver dudas de actividad o cierre.
- Webs, tiendas, perfiles y fichas de Maps ya presentes en el CSV: primera
  fuente si pertenecen claramente al productor (comprobar `link-ownership`).

## Plan de ejecución y worklist

Lotes por sector y zona para reutilizar fuentes. Tamaño 12-20 filas. Los lotes
1-10 cubren las 152 filas sin solaparse; el 11 es cierre transversal.

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Al cerrar un lote,
actualiza su fila (estado, fecha y nota corta con verificadas/parciales/
purgas/fusiones/VO resueltos) y la sección Estado si cambia el snapshot.

| # | Lote | Filas | Estado | Notas iniciales |
|---|---|---:|---|---|
| 1 | Charcutería · capital, Moraña y Navas | 13 | ✅ | 2026-07-04: 11 verificados, 1 parcial (Miguel Pascual, sin web), 1 purga (asador Arévalo, not-producer); VO 9 sí (9/9 canal), 4 no comprobado; ICAV mantenida (cooperativa comercializadora IGP); La Estación→Las Navas del Marqués (merge de slug); dominio de La Cantera corregido. |
| 2 | Charcutería · Tormes, Amblés y Tiétar | 17 | ✅ | 2026-07-04: 17 verificados, 0 purgas; VO 14 sí (14/14 canal), 3 no comprobado; Martín Martín Blázquez tenía web real sin registrar en el CSV (añadida); dominios con cert. caídos (Manolo, Casa Palancas) corroborados por Maps+directorios. |
| 3 | Bodega · DO Cebreros y bajo Alberche | 12 | ✅ | 2026-07-04: 12 verificados, 0 purgas; VO 8 sí (8/8 canal), 4 no comprobado; limpieza de 1 IG spam-casino y 1 dominio hackeado/parkeado (Rubén Díaz); añadidas web (Indiano) e IG oficiales (Gaznata, 7 Navas, Soto Manrique). |
| 4 | Bodega · alto Alberche, Tiétar y Moraña | 12 | ✅ | 2026-07-04: 12 verificados, 0 purgas, 1 recat (Ursu→Agua mineral natural); VO 5 sí (5/5 canal), 7 no comprobado; Huellas del Tiétar mantenida (DOP real, no restauración pura). |
| 5 | Pan y pastelería · provincial | 17 | ✅ | 2026-07-04: 17 verificados, 0 purgas; VO 3 sí (3/3 canal), 14 no comprobado; «Palacios»→Sotalbo resuelto (barrio); 1 nombre genérico limpiado (La Barraqueña). |
| 6 | Lácteos y quesos · provincial | 13 | ✅ | 2026-07-04: 13 verificados, 1 purga (Ornua, industrial); VO 6 sí (6/6 canal), 7 no comprobado; geo-warning Quesos Miguel resuelto (→Burgohondo); 1 nombre genérico limpiado (Umbrías de Gredos); dominio hackeado (montesbravos.es, casino) descartado. |
| 7 | Dulces y repostería + Chocolate | 13 | ✅ | 2026-07-04: 12 verificados, 1 parcial, 1 purga (Marugán, cerrada desde 1970); VO 5 sí (5/5 canal), 8 no comprobado; Santa Teresa (nombre limpiado); Elgorriaga mantenida (fábrica real 1979, no multinacional satélite); Obrador de Ángel Ávila↔Navas resuelto (FB mal enlazado, no dup). |
| 8 | Legumbres + Huevos + Frutos secos | 15 | ✅ | 2026-07-04: 14 verificados, 1 parcial, 1 merge (Judías del Barco→Coronado, mismo teléfono/web); VO 6 sí (6/6 canal), 9 no comprobado; Granjas San Antonio recat a Charcutería (es porcino, no huevos). |
| 9 | Aceite + Fruta y verdura | 15 | ✅ | 2026-07-04: 12 verificados, 3 parcial, 1 purga (Sabores de Gredos, marketplace no productor), 2 merges (Simón→Ávila, Capra Hispánica→Candeleda); VO 5 sí (5/5 canal), 10 no comprobado; 3 aceituneras recat a "Aceitunas y encurtidos". |
| 10 | Miel + Despensa + Aromáticas + Cerveza + Helados + Otros | 18 | ✅ | 2026-07-04: 16 verificados, 2 parcial, 1 purga (La Casa de Pilar, marketplace), 1 merge (mieles de La Carrera); VO 9 sí (9/9 canal), 9 no comprobado; Cronoble→Platos preparados, Dehesa de la Serna→Carnes. |
| 11 | Cierre transversal provincial | 145 | ✅ | 2026-07-06: 0 duplicados; 4 pedanías/anejos corregidos al municipio INE (Tornadizos→Palacios de Goda, Navandrinal×2→San Juan del Molinillo, Narrillos de San Leonardo→Ávila) con merge; 0 huecos de municipios.json (Pedro-Rodríguez sí estaba); Kerbest recat a Carnes; Ávila añadida a `coverage.json`; `verify:data` verde. **1ª PASADA COMPLETA.** |

## Alcance exacto de cada lote (slugs congelados el 2026-07-04)

Formato: `slug · municipio` (`SIN WEB` = sin dominio propio en el CSV; empieza
por Maps/redes/fuentes locales).

### Lote 1 · Charcutería — capital, Moraña y Navas (13) — ✅ cerrado 2026-07-04

```text
carnavi-avila · Ávila · verificado · VO=sí (ecommerce)
carniceria-d-avila-avila · Ávila · verificado · VO=sí (ecommerce)
carniceria-la-cantera-avila · Ávila · verificado · VO=sí (telefono|whatsapp)
icav-comercializadora-de-vacuno-selecto-avileno-negro-iberico-sociedad-cooperativa-avila · Ávila · verificado · VO=sí (ecommerce)
porkyavila-avila · Ávila · verificado · VO=no comprobado
suenos-de-alba-ganadera-avila · Ávila · verificado · VO=no comprobado
embutidos-perrino-arevalo · Arévalo · verificado · VO=sí (ecommerce)
embutidos-core-blascosancho · Blascosancho · verificado · VO=sí (telefono|email)
jamones-blazquez-crespos-crespos · Crespos · verificado · VO=sí (ecommerce)
jamones-y-embutidos-la-canada-herradon-de-pinares · Herradón de Pinares · verificado · VO=sí (ecommerce)
embutidos-y-jamones-jl-benito-la-colilla · La Colilla · verificado · VO=sí (ecommerce)
embutidos-y-carnes-miguel-pascual-las-navas-del-marques · Las Navas del Marqués · parcial · VO=no comprobado (antes `embutidos-y-carnes-miguel-pascual-la-estacion`, sin web)
embutidos-soriano-las-navas-del-marques · Las Navas del Marqués · verificado · VO=no comprobado
```

Purgada: `asador-el-figon-de-arevalo-arevalo` (Arévalo) — restauración/asador
con delivery de comida preparada, no elaborador de charcutería (regla 5,
`not-producer`).

Resuelto: ICAV se mantiene como cooperativa comercializadora de ganaderos de
raza Avileña-Negra Ibérica (IGP), con envasado propio y venta online (mismo
criterio que almazaras cooperativas). `embutidos-y-carnes-miguel-pascual-la-estacion`
renombrada a `...-las-navas-del-marques` (merge en evidencia); el dominio de
Carnicería La Cantera en el CSV estaba caído/mal escrito y se corrigió a
`lacanteracarniceria.es`. Evidencia en
`data/evidence/castilla-y-leon/avila.jsonl`.

### Lote 2 · Charcutería — Tormes, Amblés y Tiétar (17) — ✅ cerrado 2026-07-04

```text
embutidos-jimenez-sl-jmj-el-barco-de-avila · El Barco de Ávila · verificado · VO=sí (ecommerce)
embutidos-y-jamones-chopo-el-barco-de-avila · El Barco de Ávila · verificado · VO=sí (ecommerce)
jamones-lazaro-s-l-el-barco-de-avila · El Barco de Ávila · verificado · VO=sí (telefono|email)
lorana-jamones-y-embutidos-el-barco-de-avila · El Barco de Ávila · verificado · VO=sí (ecommerce)
embutidos-del-rio-becedas · Becedas · verificado · VO=no comprobado (sin web propia)
jamones-garrudo-garrudo-benito-sl-piedrahita · Piedrahíta · verificado · VO=sí (ecommerce)
jamones-y-embutidos-sanchez-diaz-s-l-santa-maria-del-berrocal · Santa María del Berrocal · verificado · VO=sí (ecommerce|telefono|email)
industrias-carnicas-roal-s-l-la-torre · La Torre · verificado · VO=sí (ecommerce, vía latiendaderoal.com)
carhesan-embutidos-herraez-munana · Muñana · verificado · VO=no comprobado
martin-martin-blazquez-fabrica-de-embutidos-y-jamones-munana · Muñana · verificado · VO=sí (ecommerce) — web y teléfono añadidos (no estaban en el CSV)
embutidos-la-serrota-sl-solosancho · Solosancho · verificado · VO=sí (ecommerce)
carnes-y-embutidos-manolo-burgohondo · Burgohondo · verificado · VO=no comprobado
embutidos-gomez-s-l-candeleda · Candeleda · verificado · VO=sí (ecommerce)
morcillas-de-arroz-j-n-casavieja · Casavieja · verificado · VO=sí (ecommerce|marketplace)
embutidos-degano-s-l-san-esteban-del-valle · San Esteban del Valle · verificado · VO=no comprobado (dominio antiguo caído)
carniceria-casa-palancas-artesanos-morcilleros-desde-1939-morcillas-en-sotillo-sotillo-de-la-adrada · Sotillo de la Adrada · verificado · VO=no comprobado
morcillas-de-sotillo-pablo-diaz-las-autenticas-morcillas-de-sotillo-sotillo-de-la-adrada · Sotillo de la Adrada · verificado · VO=sí (ecommerce)
```

Resuelto: los dos nombres de morcillas de Sotillo (Casa Palancas y Pablo
Díaz) son dos obradores distintos e independientes, confirmado por fuentes
propias/directorios; no hay dedup. El clúster de El Barco cotejó bien con
fuentes propias. Dos dominios con certificado TLS roto (`carnesmanolo.com`,
`casapalancas.com`) se aceptaron vía Google Maps + directorios independientes
(regla 18, no se purga por dificultad de acceso). Evidencia añadida en
`data/evidence/castilla-y-leon/avila.jsonl`.

### Lote 3 · Bodega — DO Cebreros y bajo Alberche (12) — ✅ cerrado 2026-07-04

```text
bodega-llano-las-navas-cebreros · Cebreros · verificado · VO=sí (marketplace, tienda.avilaautentica.es)
indiano-gredos-la-bodega-azul-cebreros · Cebreros · verificado · VO=sí (ecommerce) — web añadida (indianowines.com)
ruben-diaz-viticultor-vinadores-de-gredos-sl-cebreros · Cebreros · verificado · VO=no comprobado — web e IG retirados (ver aviso)
soto-manrique-vina-y-olivo-cebreros · Cebreros · verificado · VO=no comprobado — Facebook añadido
tierras-de-cebreros-cebreros · Cebreros · verificado · VO=sí (ecommerce)
daniel-ramos-el-tiemblo · El Tiemblo · verificado · VO=sí (ecommerce)
bodega-don-juan-del-aguila-el-barraco · El Barraco · verificado · VO=no comprobado — Instagram añadido (@gaznata)
bodega-7-navas-garnacha-alto-alberche-navaluenga · Navaluenga · verificado · VO=no comprobado — Instagram añadido
bodega-clemente-peral-san-juan-de-la-nava · San Juan de la Nava · verificado · VO=sí (ecommerce)
rico-nuevo-viticultores-burgohondo · Burgohondo · verificado · VO=sí (ecommerce)
bodega-finca-fuentegalana-navahondilla · Navahondilla · verificado · VO=sí (ecommerce)
chato-ganan-navahondilla · Navahondilla · verificado · VO=sí (ecommerce)
```

Higiene de datos: `ruben-diaz-viticultor-vinadores-de-gredos-sl-cebreros` tenía
un Instagram ajeno de spam de casino (`vavada.inst`, sin relación con la
bodega) y su web (`rubendiazviticultor.com`) ahora redirige (301) a un sitio
de golf en Málaga (dominio caducado/aparcado): ambos enlaces se eliminaron.
Productor real (DO Cebreros, distribuido internacionalmente) mantenido como
`verificado`, VO degradado a `no comprobado` al perder su canal propio.
`riconuevovinos.es` tiene spam de casino inyectado en páginas/idiomas ajenos
pero su `/tienda/` es real y funcional (regla 18, no se purga). La DO Cebreros
apoya pertenencia (regla 6) en las 12 filas.

### Lote 4 · Bodega — alto Alberche, Tiétar y Moraña (12) — ✅ cerrado 2026-07-04

```text
bodegas-castellanas-villanueva-de-avila · Villanueva de Ávila · verificado · VO=sí (ecommerce|whatsapp)
comando-g-villanueva-de-avila · Villanueva de Ávila · verificado · VO=no comprobado
las-pedreras-villanueva-de-avila · Villanueva de Ávila · verificado · VO=no comprobado — IG añadido
vda-viticultores-villanueva-de-avila · Villanueva de Ávila · verificado · VO=sí (marketplace|telefono|email) — tel/email añadidos
10-delirios-bodegas-y-vinedos-navatalgordo · Navatalgordo · verificado · VO=sí (ecommerce)
bodega-alma-rural-navatalgordo · Navatalgordo · verificado · VO=no comprobado
bodega-nietos-de-senora-maria-navandrinal · Navandrinal · verificado · VO=sí (ecommerce) — [lote 11: municipio→San Juan del Molinillo, slug→bodega-nietos-de-senora-maria-san-juan-del-molinillo]
bodega-el-callejon-san-esteban-del-valle · San Esteban del Valle · verificado · VO=no comprobado
restaurante-y-bodega-huellas-del-tietar-lanzahita · Lanzahíta · verificado · VO=sí (marketplace)
bodega-teo-legido-castellanos-de-zapardiel · Castellanos de Zapardiel · verificado · VO=no comprobado
vina-alondra-langa · Langa · verificado · VO=sí (ecommerce|marketplace)
aguas-minerales-de-avila-ursu-el-oso · El Oso · verificado · VO=no comprobado — RECAT a categoría "Agua mineral natural"
```

Resuelto: Ursu recategorizada (no es bodega, es embotelladora industrial de
agua alcalina; regla 6). El restaurante-bodega de Lanzahíta se mantiene como
bodega (no se purga como restauración): es bodega DOP Cebreros real
incorporada en 2017, con 6 ha propias, que además opera restaurante y
enoturismo — el criterio distintivo frente al asador de Arévalo (lote 1,
purgado) es que aquí la elaboración de vino está certificada por el consejo
regulador. Comando G tiene certificado TLS caducado en su dominio pero es
bodega de referencia internacional (Dani Landi / Fernando García), verificada
vía DOP Cebreros y retailers especializados. Evidencia en
`data/evidence/castilla-y-leon/avila.jsonl`.

### Lote 5 · Pan y pastelería — provincial (17) — ✅ cerrado 2026-07-04

```text
don-pan-avila · Ávila · verificado · VO=no comprobado  (SIN WEB, Maps+tel)
panaderia-bolleria-marisol-avila · Ávila · verificado · VO=sí (telefono)
panaderia-flores-y-jimenez-avila · Ávila · verificado · VO=no comprobado
la-vieja-tahona-arevalo · Arévalo · verificado · VO=no comprobado  (SIN WEB, Maps+tel)
panaderia-artesanal-el-barraco · El Barraco · verificado · VO=no comprobado — nombre limpiado a "Pastelería La Barraqueña"
la-tahona-de-barraco-el-barraco · El Barraco · verificado · VO=no comprobado  (SIN WEB, Maps+tel)
panaderia-horno-viejo-hoyos-del-espino · Hoyos del Espino · verificado · VO=no comprobado  (SIN WEB, Maps+tel)
panaderia-el-horno-del-marques-las-navas-del-marques · Las Navas del Marqués · verificado · VO=no comprobado  (SIN WEB, Maps+tel)
panaderia-de-flora-martiherrero-martiherrero · Martiherrero · verificado · VO=no comprobado (web=Facebook)
panaderia-bolleria-rafael-hernandez-c-b-munogalindo · Muñogalindo · verificado · VO=no comprobado  (SIN WEB, Maps+tel)
tahona-araujo-narrillos-de-san-leonardo · Narrillos de San Leonardo · verificado · VO=no comprobado  (SIN WEB, Maps+tel) — [lote 11: municipio→Ávila (anejo), slug→tahona-araujo-avila]
panaderia-la-tahona-pasteleria-navaluenga · Navaluenga · verificado · VO=no comprobado  (SIN WEB, Maps)
tahona-pan-navaluenga · Navaluenga · verificado · VO=no comprobado  (SIN WEB, Maps)
panaderia-la-candelaria-sotalbo · Sotalbo · verificado · VO=no comprobado — municipio corregido de "Palacios" a Sotalbo (slug renombrado, merge en evidencia); IG/FB añadidos
panaderia-o-munoz-san-martin-de-la-vega-del-alberche · San Martín de la Vega del Alberche · verificado · VO=no comprobado  (SIN WEB, Maps+tel)
panaderia-garrosa-solosancho · Solosancho · verificado · VO=no comprobado
la-tahona-de-sotillo-panificadora-vda-angel-sanchidrian-sotillo-de-la-adrada · Sotillo de la Adrada · verificado · VO=sí (email)
```

Resuelto: municipio «Palacios» de La Candelaria era el barrio «Palacio» de
Sotalbo (regla 19); slug renombrado a `panaderia-la-candelaria-sotalbo` con
`merge` en la evidencia. Nombre genérico de volcado limpiado en El Barraco
(«PANADERÍA ARTESANAL» → «Pastelería La Barraqueña», obrador centenario de 4ª
generación en la misma dirección exacta). Las 12 filas `SIN WEB` se
verificaron vía ficha de Google Maps (teléfono coherente con la dirección) o
directorios/prensa local, sin purgar por ausencia de web (regla 17). Relación
de `panaderia-flores-y-jimenez-avila` con la fila de frutos secos del lote 8
queda pendiente de anotar en ese lote.

### Lote 6 · Lácteos y quesos — provincial (13, tras purga) — ✅ cerrado 2026-07-04

```text
quesos-miguel-burgohondo · Burgohondo · verificado · VO=no comprobado — municipio corregido de "Ávila" (merge de slug)
queseria-artesanal-burgohondo · Burgohondo · verificado · VO=no comprobado — nombre limpiado a "Quesería Umbrías de Gredos"
quesos-del-alberche-navandrinal · Navandrinal · verificado · VO=sí (ecommerce) — [lote 11: municipio→San Juan del Molinillo, slug→quesos-del-alberche-san-juan-del-molinillo]
quesos-elvira-garcia-el-barraco · El Barraco · verificado · VO=sí (ecommerce)
montealijar-las-navas-del-marques · Las Navas del Marqués · verificado · VO=no comprobado
ganaderos-de-caprino-de-candeleda-candeleda · Candeleda · verificado · VO=no comprobado
queseria-valdecabras-candeleda · Candeleda · verificado · VO=sí (marketplace)
queserias-del-tietar-la-adrada · La Adrada · verificado · VO=sí (ecommerce) — corregidos productos estrella/descripción (decían "Fruta y verdura")
la-queseria-de-maria-lanzahita · Lanzahíta · verificado · VO=no comprobado
queseria-castilla-palacios-de-goda · Palacios de Goda · verificado · VO=no comprobado
alta-morana-sociedad-cooperativa-san-pedro-del-arroyo · San Pedro del Arroyo · verificado · VO=sí (ecommerce, vía ladespensadelchef.es)
queseria-montes-bravos-solana-de-rioalmar · Solana de Rioalmar · verificado · VO=no comprobado  (SIN WEB — dominio homónimo hackeado con casino, descartado)
queseria-amaltea-solana-de-avila · Solana de Ávila · verificado · VO=no comprobado  (SIN WEB, Twitter+prensa)
```

Purgada: `ornua-ingredientes-espana-slu-vicolozano` (Vicolozano) —
`out-of-scope`: planta industrial de 35.000 t/año de la multinacional
irlandesa Ornua, no productor km0 (precedente IFFCO/Puleva en Granada).
Resuelto: geo-warning de Quesos Miguel — el municipio "Ávila" era el error
(código postal 05113 es de Burgohondo); slug renombrado con `merge`. Solana
de Ávila y Solana de Rioalmar confirmadas como municipios reales sin
centroide en `municipios.json` (hueco anotado en Estado, no se fuerza dato).
Evidencia en `data/evidence/castilla-y-leon/avila.jsonl`.

### Lote 7 · Dulces y repostería + Chocolate (13, tras purga) — ✅ cerrado 2026-07-04

```text
alma-dulce-avila-avila · Ávila · verificado · VO=no comprobado  (SIN WEB, heladería)
dulces-santo-tomas-avila · Ávila · verificado · VO=no comprobado  (SIN WEB)
hermanas-clarisas-de-avila-dulces-artesanos-avila · Ávila · verificado · VO=sí (ecommerce)
pasteleria-obrador-de-angel-luanje-avila · Ávila · verificado · VO=no comprobado — FB ajeno retirado
santa-teresa-gourmet-oficinas-y-fabrica-no-venta-avila · Ávila · verificado · VO=sí (ecommerce) — nombre limpiado
yemas-de-avila-avila · Ávila · parcial · VO=no comprobado  (SIN WEB, ficha genérica)
mil-momentos-pasteleria-y-obrador-luis-miguel-garcia-barbero-las-navas-del-marques · Las Navas del Marqués · verificado · VO=no comprobado
obrador-de-angel-las-navas-del-marques · Las Navas del Marqués · verificado · VO=no comprobado — FB añadido (movido desde la fila de Ávila)
panaderia-artesano-dulces-caseros-mombeltran · Mombeltrán · verificado · VO=no comprobado  (SIN WEB)
dulces-gredos-navarredondilla · Navarredondilla · verificado · VO=sí (whatsapp|email)
dulces-sanchidrian-desde-1912-sotillo-de-la-adrada · Sotillo de la Adrada · verificado · VO=sí (ecommerce)
elgorriaga-brands-s-a-avila · Ávila · verificado · VO=no comprobado — fábrica real 1979, se mantiene
el-barco-delice-chocolates-el-barco-de-avila · El Barco de Ávila · verificado · VO=sí (ecommerce)
```

Purgada: `fabrica-de-chocolates-marugan-mingorria` (Mingorría) — `closed`:
cerrada desde 1970, hoy es un punto de interés turístico/patrimonial, no un
productor activo. Resuelto: los dos «Obrador de Ángel» son negocios reales
e independientes (fundadores de Las Navas venían de la Pastelería Luanje de
Ávila), no un duplicado — el error era que el CSV enlazaba el Facebook de
Las Navas en la fila de Ávila; se corrigió. Elgorriaga se mantiene: fábrica
real y activa desde 1979 (47.000 kg/día), no una planta satélite reciente
como Ornua. Santa Teresa Gourmet: nombre limpiado (regla 20) y corregidos
"productos estrella"/descripción que decían "Fruta y verdura" por error de
volcado.

### Lote 8 · Legumbres + Huevos + Frutos secos (15, tras merge) — ✅ cerrado 2026-07-04

```text
campesina-tormes-el-barco-de-avila · El Barco de Ávila · verificado · VO=no comprobado
legumbres-vaquero-tienda-en-el-barco-de-avila-el-barco-de-avila · El Barco de Ávila · parcial · VO=no comprobado — nombre limpiado, es tienda/droguería
legumbres-coronado-el-barco-de-avila · El Barco de Ávila · verificado · VO=sí (ecommerce)
legumbres-herederos-judias-de-el-barco-de-avila-el-barco-de-avila · El Barco de Ávila · verificado · VO=sí (ecommerce)
legumbres-el-rua-tornadizos-de-arevalo · Tornadizos de Arévalo · verificado · VO=sí (ecommerce) — [lote 11: municipio→Palacios de Goda (pedanía), slug→legumbres-el-rua-palacios-de-goda]
legumbres-julian-munoz-e-hijos-velayos · Velayos · verificado · VO=no comprobado  (SIN WEB)
legumbres-nuestra-senora-del-rosario-velayos · Velayos · verificado · VO=no comprobado  (SIN WEB)
para-legumbres-la-castellana-velayos · Velayos · verificado · VO=no comprobado  (SIN WEB)
granja-avicola-redondo · El Barraco · verificado · VO=sí (ecommerce|email)
granjas-san-antonio-pajares-de-adaja · Pajares de Adaja · verificado · VO=sí (ecommerce) — RECAT a Charcutería (es porcino)
granjas-teco-pedro-rodriguez · Pedro-Rodríguez · verificado · VO=sí (ecommerce)
la-granja-de-ibai · Riofrío · verificado · VO=no comprobado
aves-y-huevos-sanchez-avila · Ávila · verificado · VO=no comprobado
frutos-secos-loli-flores-y-jimenez-avila · Ávila · verificado · VO=no comprobado
frutos-secos-luis-avila · Ávila · verificado · VO=no comprobado
```

Resuelto: `judias-del-barco-de-avila-el-barco-de-avila` fusionada en
`legumbres-coronado-el-barco-de-avila` (mismo teléfono y web exactos, ~1 km
de distancia — segunda ubicación de la misma empresa, la web nunca usa
"Judías del Barco de Ávila" como marca propia). Legumbres Vaquero: nombre
limpiado (regla 20) y degradada a `parcial` — es una tienda/droguería que
revende legumbres locales, no un productor/envasador propio (regla 7).
`granjas-san-antonio-pajares-de-adaja` recategorizada de Huevos a
Charcutería: es una granja de cerdo ecológico con elaborados cárnicos, no
una explotación avícola. «Tornadizos de Arévalo» sigue sin resolver como
municipio (queda para el cierre transversal).

### Lote 9 · Aceite + Fruta y verdura (15, tras purga) — ✅ cerrado 2026-07-04

```text
aceite-los-llanos-de-gredos-arenas-de-san-pedro · Arenas de San Pedro · verificado · VO=sí (ecommerce)
cooperativa-de-cosecheros-de-aceitunas-el-puente-arenas-de-san-pedro · Arenas de San Pedro · verificado · VO=sí (ecommerce)
almazara-comarcal-cooperativa-del-alberche-cebreros · Cebreros · verificado · VO=no comprobado  (SIN WEB)
almazara-la-beltraneja-sociedad-cooperativa-del-campo-mombeltran · Mombeltrán · verificado · VO=no comprobado  (SIN WEB)
almazara-la-moraleda-cooperativa-san-pedro-bautista-san-esteban-del-valle · San Esteban del Valle · verificado · VO=sí (ecommerce) — web añadida (coopsanpedro.com)
aceitunas-ovidio-s-l-serranillos · Serranillos · verificado · VO=no comprobado — RECAT a Aceitunas y encurtidos
aceitunas-simon-e-hijos-s-l-avila · Ávila · verificado · VO=no comprobado — RECAT a Aceitunas y encurtidos; municipio corregido de Vicolozano (merge)
aceitunas-serranillo-avila · Ávila · verificado · VO=no comprobado — RECAT a Aceitunas y encurtidos  (SIN WEB, FB añadido)
la-huerta-de-rodri-arenas-de-san-pedro · Arenas de San Pedro · parcial · VO=no comprobado  (SIN WEB)
el-ingenio-de-la-huerta-sl-cabezas-de-alambre · Cabezas de Alambre · verificado · VO=no comprobado  (SIN WEB)
la-huerta-de-miguel-huertos-ecologicos-casillas · Casillas · verificado · VO=no comprobado — web añadida
cooperativa-capra-hispanica-higo-de-gredos-candeleda · Candeleda · verificado · VO=no comprobado — municipio corregido de El Raso (merge)
huerta-col-despoblado-de-caniclosa-salvadios · Salvadiós · parcial · VO=no comprobado  (SIN WEB, identidad difusa)
la-solanilla-san-esteban-de-los-patos · San Esteban de los Patos · verificado · VO=no comprobado
la-huerta-de-xelo-san-esteban-del-valle · San Esteban del Valle · parcial · VO=no comprobado  (SIN WEB)
```

Purgada: `sabores-de-gredos-candeleda` — `not-producer`: es un
marketplace/distribuidor regional de mermeladas y conservas de terceros
("trabajamos con productores de pueblos como Candeleda, El Raso, Guisando o
Arenas de San Pedro"), no un elaborador propio. Resuelto: 3 aceituneras
(Ovidio, Simón, Serranillo) recategorizadas de Aceite a **Aceitunas y
encurtidos** (regla 11, categoría ya existente en la taxonomía);
Vicolozano→Ávila (Simón) y El Raso→Candeleda (Capra Hispánica) resueltos con
`merge` de slug (regla 19). Tres huertas sin web ni corroboración externa
(Rodri, Huerta Col, Xelo) degradadas a `parcial` por identidad difusa, sin
purgar (regla 17). La Solanilla: su web es la escuela de formación de los
mismos dueños (agricultura regenerativa), no una tienda — identidad real
confirmada igualmente.

### Lote 10 · Miel + Despensa + Aromáticas + Cerveza + Helados + Otros (18, tras purga y merge) — ✅ cerrado 2026-07-04

```text
sat-el-panal-miel-avila-cillan · Cillán · verificado · VO=no comprobado  (SIN WEB)
miel-artesanal-la-picorea-la-carrera · La Carrera · verificado · VO=no comprobado — web añadida (miellapicorea.es)
la-casa-de-la-miel-lanzahita · Lanzahíta · parcial · VO=no comprobado  (SIN WEB, es tienda de miel, no apicultor confirmado)
apigredos-miel-y-derivados-carniceria-la-colmena-piedralaves · Piedralaves · verificado · VO=no comprobado  (SIN WEB) — confirmado ganadero+apicultor real, nombre mixto no es ruido
la-mielesa-santa-maria-del-tietar · Santa María del Tiétar · parcial · VO=sí (ecommerce) — envasador/comercializador, colmenas propias no confirmadas
pimenton-don-pablo-candeleda · Candeleda · verificado · VO=no comprobado  (SIN WEB)
pimenton-el-sequero · Candeleda · verificado · VO=sí (ecommerce)
cerveza-tupa-el-barco-de-avila · El Barco de Ávila · verificado · VO=sí (ecommerce)
cerveza-gredos-hoyocasero · Hoyocasero · verificado · VO=sí (ecommerce)
alimentos-ecologicos-biogredos-mombeltran · Mombeltrán · verificado · VO=sí (ecommerce)
agropecuaria-la-serrota-santa-maria-del-arroyo · Santa María del Arroyo · verificado · VO=no comprobado — [lote 11: recat Despensa artesanal→Carnes; nombre→"Agropecuaria La Serrota (Kerbest)", grupo cárnico real de Ávila]
cronoble-avila-s-l-avila · Ávila · verificado · VO=sí (ecommerce) — RECAT a Platos preparados
dehesa-de-la-serna-avila · Ávila · verificado · VO=sí (ecommerce) — RECAT a Carnes
la-heladeria-artesana-arenas-de-san-pedro · Arenas de San Pedro · verificado · VO=no comprobado
heladeria-topping-avila · Ávila · verificado · VO=no comprobado  (SIN WEB, IG añadido)
heladeria-la-flor-valenciana-avila · Ávila · verificado · VO=sí (ecommerce)
heladeria-vhola-avila · Ávila · verificado · VO=no comprobado — mayorista B2B
caracoles-de-gredos-arenas-de-san-pedro · Arenas de San Pedro · verificado · VO=sí (ecommerce)
```

Purgada: `la-casa-de-pilar-sotillo-de-la-adrada` — `not-producer`: marketplace
regional que revende productos de terceros (mismo patrón que Sabores de
Gredos, lote 9). Resuelto: las dos mieles de La Carrera eran la misma
empresa (mismo teléfono y web) con una ficha de Maps mal geolocalizada a 62
km; se fusionaron. Apigredos: el nombre mixto miel+carnicería es real (mismo
dueño, doble actividad de ganadero y apicultor), no ruido de volcado.
Agropecuaria La Serrota / Kerbest: operación grande y tecnificada (varias
granjas, digitalización), no encaja bien en "despensa artesanal" pero no se
purga por evidencia débil; queda anotado para el cierre transversal. Cronoble
recategorizada a "Platos preparados" y Dehesa de la Serna a "Carnes"
(regla 16, ambas eran "Despensa artesanal" por error de categorización).

### Lote 11 · Cierre transversal provincial — ✅ cerrado 2026-07-06

Sin lista propia: repaso del CSV completo con los criterios de cierre. Qué se
hizo:

- **Duplicados: 0.** Cruce por teléfono, dominio y nombre normalizados en las
  145 filas. El único dominio compartido (`floresyjimenez.com`) son dos
  unidades reales del mismo grupo familiar (panadería + tienda de frutos
  secos, direcciones y teléfonos distintos), ya documentado. Las sospechas
  heredadas quedaron resueltas en sus lotes.
- **Municipios/geo: 0 huecos, 0 warnings.** Con la normalización real del
  audit los 145 municipios están en `municipios.json`. Cuatro filas seguían
  con pedanía/anejo como municipio y se corrigieron al oficial INE (localidad
  conservada en `direccion`, slug renombrado con `merge`): Tornadizos de
  Arévalo→Palacios de Goda, Navandrinal→San Juan del Molinillo (×2), Narrillos
  de San Leonardo→Ávila. Pedro-Rodríguez resultó estar ya en la referencia
  (clave `pedro rodriguez`), no era hueco.
- **Recategorización pendiente resuelta:** `agropecuaria-la-serrota-...`
  (marca Kerbest) pasó de «Despensa artesanal» a «Carnes» — es un grupo
  cárnico real de Ávila (cerdo, wagyu, avicultura; PYME del año), no se purga
  por escala (criterio ICAV/Elgorriaga).
- **Venta online:** 63 `sí` (63/63 con canal), 0 `no`, 82 `no comprobado`. Sin
  cuarentena; cada `sí` con evidencia de pedido remoto vigente.
- **Evidencia:** 160 registros (145 keep, 5 purge, 10 merge) que cubren las
  145 filas; Ávila añadida a `data/evidence/coverage.json`.
- **`npx pnpm verify:data` en verde.**

Residual explícito para 2ª pasada (no bloquea el cierre): 8 filas `parcial`
(cada una con motivo en la evidencia: Miguel Pascual, Yemas de Ávila, Legumbres
Vaquero, La Casa de la Miel, La Mielesa y las huertas de Rodri/Col/Xelo) e
imágenes 0/145.

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   ```

   El worktree es compartido con otros agentes. No toques ficheros de otras
   provincias; si ves cambios ajenos sin commitear, déjalos como están.

2. Marca el lote como `🟨` en la worklist. Vuelca el estado actual de sus
   filas (pega los slugs de tu lote en `SLUGS`):

   ```bash
   node --input-type=module - <<'JS'
   import fs from "node:fs";
   import { parse } from "csv-parse/sync";

   const SLUGS = new Set([
     "carnavi-avila",
     // ...resto de slugs del lote, copiados de este documento
   ]);

   const rows = parse(
     fs.readFileSync("data/csv/castilla-y-leon/avila.csv", "utf8"),
     { columns: true, skip_empty_lines: true }
   );
   for (const r of rows.filter((r) => SLUGS.has(r.slug))) {
     console.log(
       r.slug, "|", r.nombre, "|", r.municipio, "|", r.categoria,
       "|", r.verificacion, "| VO=", r["Venta online"],
       "| web=", r.web || "-", "| maps=", r["Google Maps"] ? "sí" : "no"
     );
   }
   JS
   ```

3. Investiga fila a fila, en este orden de preguntas y parando en cuanto la
   decisión esté clara: (a) ¿existe y es quien dice ser? (b) ¿produce/elabora
   de verdad y en alcance km0? (c) ¿municipio y coordenadas correctos?
   (d) ¿venta online real hoy? (e) enlaces del CSV: ¿son suyos? No recopiles
   opcionales que no cambien la decisión.
4. Edita el CSV quirúrgicamente: solo las filas de tu lote, preservando LF,
   comillas y las 20 columnas. Purga = eliminar la línea completa. Fusión =
   eliminar la duplicada y completar la superviviente.
5. Registra evidencia en `data/evidence/castilla-y-leon/avila.jsonl` (la
   primera vez: `mkdir -p data/evidence/castilla-y-leon`). Una línea JSON por
   fila decidida, acción `keep`, `purge` o `merge`. La sintaxis exacta y los
   claims mínimos están en `docs/EVIDENCE_CONTRACT.md`; ejemplo de `keep` real
   (una sola línea en el fichero):

   ```json
   {"slug":"ejemplo-slug-avila","reviewedAt":"2026-07-04","reviewedBy":"tu-id-de-agente","action":"keep","decision":{"verification":"verificado","onlineSales":"sí","salesChannels":["ecommerce"]},"sources":[{"url":"https://ejemplo.com","type":"official-site","claims":["identity","producer-activity","municipality"],"checkedAt":"2026-07-04"},{"url":"https://ejemplo.com/tienda","type":"official-store","claims":["online-sales","link-ownership"],"checkedAt":"2026-07-04"}],"notes":"Nota corta solo si hay excepción material."}
   ```

   Recuerda: `decision` debe cuadrar EXACTAMENTE con la fila del CSV
   (`verification`↔`verificacion`, `onlineSales`↔`Venta online`,
   `salesChannels`↔`Canal de venta`). Para `verificado` hacen falta claims
   `identity` + `producer-activity` + `municipality` y al menos una fuente de
   tipo verificador (`official-site`, `official-store`, `official-social`,
   `google-maps`, `marketplace`). Usa un `reviewedBy` estable (p. ej.
   `codex-agent`, `claude-agent`).
6. Valida mientras iteras:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   git diff --check
   ```

7. Al cerrar el lote:

   ```bash
   npx pnpm verify:data
   ```

8. Actualiza este ledger en el mismo cambio: fila de la worklist (`✅`, fecha,
   nota corta), sección Estado si cambió el snapshot (conteos, warnings
   resueltos, huecos de referencia detectados) y las listas de slugs de lotes
   posteriores si hubo fusiones o correcciones de slug.
9. Commit por lote (mensaje tipo `Ávila: verificación lote N — resumen
   corto`), en la rama que haya indicado el usuario. No hagas push a `main`
   sin instrucción explícita.

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada en la worklist.
- Cada `parcial` residual tiene motivo anotado y evidencia JSONL coherente.
- Cada fila activa tiene registro `keep`; cada purga/fusión tiene registro
  `purge`/`merge`.
- `Venta online` resuelto en las 152: cada `sí` con `Canal de venta` y
  evidencia de pedido remoto vigente; cada `no` comprobado; `no comprobado`
  solo donde de verdad no se pudo cerrar.
- Los 12 municipios sin centroide quedan: corregidos al municipio oficial, o
  confirmados como municipios reales y anotados como hueco de
  `municipios.json` (no se fuerza el dato de la fila).
- 0 warnings de geo-check, o aceptados con nota que explique por qué.
- Sin duplicados aparentes sin decisión; nombres sin ruido de volcado.
- No quedan enlaces ajenos, dominios aparcados ni fichas genéricas como prueba
  fuerte.
- `npx pnpm verify:data` en verde antes de cerrar cada lote y al cierre.
- Imágenes: siguen siendo residual explícito (0/152) para una pasada
  posterior; no bloquean el cierre.
- Al cerrar las 152 filas, decidir si se añade `castilla-y-leon/avila` a
  `data/evidence/coverage.json` (advisory) en el mismo cambio que complete la
  evidencia provincial.

## Decisiones que deben quedar especialmente anotadas

- Purgas y su motivo (`not-producer`, `closed`, `other-province`,
  `nonexistent`, `out-of-scope`): en especial Ornua, Elgorriaga, el asador de
  Arévalo, el restaurante-bodega de Lanzahíta y Ursu si salen.
- Comercializadoras y cooperativas (ICAV, Alta Moraña, Ganaderos de Caprino,
  almazaras): por qué entran como productor/elaborador o por qué no.
- Cualquier `verificado` sin web propia: fuente concreta que lo sostiene.
- Ascensos por encima de `parcial` apoyados en directorios/IGP/DO: qué fuente
  propia lo justifica.
- Recategorizaciones (aceituneras, despensa, caracoles, Capra Hispánica) y
  limpiezas de nombre.
- Correcciones de municipio/slug (con su `merge`), geo-warnings aceptados y
  huecos confirmados de `municipios.json`.
- Todo cambio de `Venta online` a `sí` o `no` (canal y fuente).
