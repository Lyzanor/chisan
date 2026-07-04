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
- Venta online inicial: **152 `no comprobado`**, 0 `sí`, 0 `no`. `Canal de
  venta`: 0/152. No hay cuarentena heredada: cada `sí` que se cree nace ya con
  canal y evidencia; cada `no` exige comprobación real.
- Tras lote 1: VO **9 `sí`** (9/9 con `Canal de venta`), 0 `no`, 142 `no
  comprobado`.
- Tras lote 2: VO **23 `sí`** (23/23 con `Canal de venta`), 0 `no`, 128 `no
  comprobado`.
- Imágenes: **0/151**. Las imágenes NO forman parte de esta pasada; quedan
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
  - `quesos-miguel-avila` (lote 6): coordenadas a 0,2 km del centroide de
    Burgohondo pero municipio «Ávila». Decidir si el municipio o las
    coordenadas están mal.
  - `miel-artesanal-la-carrera` (lote 10): coordenadas a 0,2 km de Villanueva
    de Ávila pero municipio «La Carrera» (62 km). Ojo: existe otra fila de
    miel en La Carrera (`miel-artesanal-la-picorea-la-carrera`); resolver
    identidad de ambas a la vez.
- **Municipios que no están en `data/reference/municipios.json`** (12): estas
  filas no tienen protección del geo-check (se saltan en silencio), así que
  hay que validar sus coordenadas a mano en su lote.
  - Probables pedanías o nombres no oficiales — corregir `municipio` al
    municipio oficial INE y conservar la localidad en `direccion`:
    **Vicolozano** (entidad de Ávila; 2 filas), **El Raso** (pedanía de
    Candeleda), ~~**La Estación** (zona de Las Navas del Marqués)~~ **resuelto
    lote 1**, **Palacios** (resolver con la fuente; coords 40.5427,-4.8502,
    Valle Amblés), **Tornadizos de Arévalo** (no existe como municipio; coords
    junto a Arévalo; resolver), **Navandrinal** (probable entidad de San Juan
    del Molinillo; confirmar).
  - Aparentan municipios oficiales que faltan en la referencia — confirmar
    contra el INE y, si es así, NO tocar la fila; anotar aquí el hueco de
    referencia: **Solana de Ávila**, **La Carrera**, **Pedro-Rodríguez**,
    **San Esteban de los Patos**, **Cabezas de Alambre**, **Salvadiós**.
- Duplicados: sin duplicados exactos por nombre. Sospechas a resolver en su
  lote: `obrador-de-angel-las-navas-del-marques` vs
  `pasteleria-obrador-de-angel-luanje-avila` (lote 7);
  `frutos-secos-loli-flores-y-jimenez-avila` vs
  `panaderia-flores-y-jimenez-avila` (mismo grupo familiar, ¿misma unidad?);
  `agropecuaria-la-serrota-santa-maria-del-arroyo` vs
  `embutidos-la-serrota-sl-solosancho`;
  `miel-artesanal-la-carrera` vs `miel-artesanal-la-picorea-la-carrera`.
- Evidencia: Ávila no está en `data/evidence/coverage.json` (se decide al
  cerrar la pasada completa). Ledger en
  `data/evidence/castilla-y-leon/avila.jsonl` (32 registros tras lote 2: 30
  `keep`, 1 `purge`, 1 `merge`).

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
| 3 | Bodega · DO Cebreros y bajo Alberche | 12 | ⬜ | 3 sin web; Daniel Ramos, 7 Navas, Fuentegalana. |
| 4 | Bodega · alto Alberche, Tiétar y Moraña | 12 | ⬜ | Comando G; Ursu agua mineral (recat/purga); restaurante-bodega Lanzahíta; Moraña atípica. |
| 5 | Pan y pastelería · provincial | 17 | ⬜ | 12 sin web; resolver municipio «Palacios». |
| 6 | Lácteos y quesos · provincial | 14 | ⬜ | Ornua industrial (probable purga); geo-warning Quesos Miguel; Vicolozano→Ávila. |
| 7 | Dulces y repostería + Chocolate | 14 | ⬜ | Santa Teresa (limpiar nombre); Elgorriaga alcance; posible dup Obrador de Ángel. |
| 8 | Legumbres + Huevos + Frutos secos | 16 | ⬜ | IGP El Barco; fila genérica «Judías del Barco»; Tornadizos de Arévalo; granjas. |
| 9 | Aceite + Fruta y verdura | 16 | ⬜ | Almazaras cooperativas sin web; aceituneras → posible recat; El Raso→Candeleda. |
| 10 | Miel + Despensa + Aromáticas + Cerveza + Helados + Otros | 20 | ⬜ | Geo-warning miel La Carrera; pimentón de Candeleda; caracoles; heladerías. |
| 11 | Cierre transversal provincial | 152 | ⬜ | Dedup, VO completo, municipios/geo resueltos, evidencia coherente, `verify:data`, decidir `coverage.json`. |

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

### Lote 3 · Bodega — DO Cebreros y bajo Alberche (12)

```text
bodega-llano-las-navas-cebreros · Cebreros  (SIN WEB)
indiano-gredos-la-bodega-azul-cebreros · Cebreros  (SIN WEB)
ruben-diaz-viticultor-vinadores-de-gredos-sl-cebreros · Cebreros
soto-manrique-vina-y-olivo-cebreros · Cebreros  (SIN WEB)
tierras-de-cebreros-cebreros · Cebreros
daniel-ramos-el-tiemblo · El Tiemblo
bodega-don-juan-del-aguila-el-barraco · El Barraco
bodega-7-navas-garnacha-alto-alberche-navaluenga · Navaluenga
bodega-clemente-peral-san-juan-de-la-nava · San Juan de la Nava
rico-nuevo-viticultores-burgohondo · Burgohondo
bodega-finca-fuentegalana-navahondilla · Navahondilla
chato-ganan-navahondilla · Navahondilla
```

Avisos: la DO Cebreros apoya pertenencia (regla 6); para los `SIN WEB`
buscar perfil oficial o ficha del consejo antes de degradar.

### Lote 4 · Bodega — alto Alberche, Tiétar y Moraña (12)

```text
bodegas-castellanas-villanueva-de-avila · Villanueva de Ávila
comando-g-villanueva-de-avila · Villanueva de Ávila
las-pedreras-villanueva-de-avila · Villanueva de Ávila  (SIN WEB)
vda-viticultores-villanueva-de-avila · Villanueva de Ávila
10-delirios-bodegas-y-vinedos-navatalgordo · Navatalgordo
bodega-alma-rural-navatalgordo · Navatalgordo
bodega-nietos-de-senora-maria-navandrinal · Navandrinal
bodega-el-callejon-san-esteban-del-valle · San Esteban del Valle
restaurante-y-bodega-huellas-del-tietar-lanzahita · Lanzahíta
bodega-teo-legido-castellanos-de-zapardiel · Castellanos de Zapardiel
vina-alondra-langa · Langa
aguas-minerales-de-avila-ursu-el-oso · El Oso
```

Avisos: Ursu no es bodega (regla 6); el restaurante-bodega de Lanzahíta,
alcance de restauración; Navandrinal es municipio a confirmar (regla 19);
las tres filas de La Moraña necesitan prueba de elaboración real.

### Lote 5 · Pan y pastelería — provincial (17)

```text
don-pan-avila · Ávila  (SIN WEB)
panaderia-bolleria-marisol-avila · Ávila
panaderia-flores-y-jimenez-avila · Ávila
la-vieja-tahona-arevalo · Arévalo  (SIN WEB)
panaderia-artesanal-el-barraco · El Barraco  (SIN WEB)
la-tahona-de-barraco-el-barraco · El Barraco  (SIN WEB)
panaderia-horno-viejo-hoyos-del-espino · Hoyos del Espino  (SIN WEB)
panaderia-el-horno-del-marques-las-navas-del-marques · Las Navas del Marqués  (SIN WEB)
panaderia-de-flora-martiherrero-martiherrero · Martiherrero
panaderia-bolleria-rafael-hernandez-c-b-munogalindo · Muñogalindo  (SIN WEB)
tahona-araujo-narrillos-de-san-leonardo · Narrillos de San Leonardo  (SIN WEB)
panaderia-la-tahona-pasteleria-navaluenga · Navaluenga  (SIN WEB)
tahona-pan-navaluenga · Navaluenga  (SIN WEB)
panaderia-la-candelaria-palacios · Palacios  (SIN WEB)
panaderia-o-munoz-san-martin-de-la-vega-del-alberche · San Martín de la Vega del Alberche  (SIN WEB)
panaderia-garrosa-solosancho · Solosancho
la-tahona-de-sotillo-panificadora-vda-angel-sanchidrian-sotillo-de-la-adrada · Sotillo de la Adrada
```

Avisos: 12 `SIN WEB` — Maps/Facebook/ayuntamiento antes que purgar (reglas 10
y 17); resolver el municipio «Palacios» de La Candelaria (regla 19); anotar
relación de `panaderia-flores-y-jimenez-avila` con la fila de frutos secos del
lote 8.

### Lote 6 · Lácteos y quesos — provincial (14)

```text
quesos-miguel-avila · Ávila  (SIN WEB)
ornua-ingredientes-espana-slu-vicolozano · Vicolozano
queseria-artesanal-burgohondo · Burgohondo  (SIN WEB)
quesos-del-alberche-navandrinal · Navandrinal
quesos-elvira-garcia-el-barraco · El Barraco
montealijar-las-navas-del-marques · Las Navas del Marqués
ganaderos-de-caprino-de-candeleda-candeleda · Candeleda
queseria-valdecabras-candeleda · Candeleda
queserias-del-tietar-la-adrada · La Adrada
la-queseria-de-maria-lanzahita · Lanzahíta
queseria-castilla-palacios-de-goda · Palacios de Goda
alta-morana-sociedad-cooperativa-san-pedro-del-arroyo · San Pedro del Arroyo
queseria-montes-bravos-solana-de-rioalmar · Solana de Rioalmar  (SIN WEB)
queseria-amaltea-solana-de-avila · Solana de Ávila  (SIN WEB)
```

Avisos: Ornua probable purga por alcance (regla 8); geo-warning de Quesos
Miguel (¿Burgohondo?); Vicolozano→Ávila si la fila sobrevive; Solana de Ávila
y Solana de Rioalmar sin centroide de referencia: validar coordenadas a mano.

### Lote 7 · Dulces y repostería + Chocolate (14)

```text
alma-dulce-avila-avila · Ávila  (SIN WEB)
dulces-santo-tomas-avila · Ávila  (SIN WEB)
hermanas-clarisas-de-avila-dulces-artesanos-avila · Ávila
pasteleria-obrador-de-angel-luanje-avila · Ávila
santa-teresa-gourmet-oficinas-y-fabrica-no-venta-avila · Ávila
yemas-de-avila-avila · Ávila  (SIN WEB)
mil-momentos-pasteleria-y-obrador-luis-miguel-garcia-barbero-las-navas-del-marques · Las Navas del Marqués
obrador-de-angel-las-navas-del-marques · Las Navas del Marqués  (SIN WEB)
panaderia-artesano-dulces-caseros-mombeltran · Mombeltrán  (SIN WEB)
dulces-gredos-navarredondilla · Navarredondilla
dulces-sanchidrian-desde-1912-sotillo-de-la-adrada · Sotillo de la Adrada
elgorriaga-brands-s-a-avila · Ávila
fabrica-de-chocolates-marugan-mingorria · Mingorría  (SIN WEB)
el-barco-delice-chocolates-el-barco-de-avila · El Barco de Ávila
```

Avisos: limpiar nombre de Santa Teresa Gourmet (regla 20; sigue siendo la
fábrica real de yemas); Elgorriaga = alcance industrial a decidir (regla 9);
¿los dos «Obrador de Ángel» son el mismo negocio? (dedup); `yemas-de-avila`
sin web puede ser ficha genérica.

### Lote 8 · Legumbres + Huevos + Frutos secos (16)

```text
campesina-tormes-el-barco-de-avila · El Barco de Ávila
judias-del-barco-de-avila-el-barco-de-avila · El Barco de Ávila
legumbres-vaquero-tienda-en-el-barco-de-avila-el-barco-de-avila · El Barco de Ávila
legumbres-coronado-el-barco-de-avila · El Barco de Ávila
legumbres-herederos-judias-de-el-barco-de-avila-el-barco-de-avila · El Barco de Ávila
legumbres-el-rua-tornadizos-de-arevalo · Tornadizos de Arévalo
legumbres-julian-munoz-e-hijos-velayos · Velayos  (SIN WEB)
legumbres-nuestra-senora-del-rosario-velayos · Velayos  (SIN WEB)
para-legumbres-la-castellana-velayos · Velayos  (SIN WEB)
granja-avicola-redondo · El Barraco
granjas-san-antonio-pajares-de-adaja · Pajares de Adaja
granjas-teco-pedro-rodriguez · Pedro-Rodríguez
la-granja-de-ibai · Riofrío
aves-y-huevos-sanchez-avila · Ávila
frutos-secos-loli-flores-y-jimenez-avila · Ávila
frutos-secos-luis-avila · Ávila
```

Avisos: resolver la fila genérica «Judías del Barco de Ávila» (regla 7);
Legumbres Vaquero se anuncia como tienda (limpiar nombre + alcance);
«Tornadizos de Arévalo» no existe como municipio (regla 19); frutos secos de
capital: ¿tostadero o tienda? (regla 16); tres slugs sin sufijo de municipio
(`granja-avicola-redondo`, `la-granja-de-ibai`, `granjas-teco-...`): el slug
NO se cambia por eso.

### Lote 9 · Aceite + Fruta y verdura (16)

```text
aceite-los-llanos-de-gredos-arenas-de-san-pedro · Arenas de San Pedro
cooperativa-de-cosecheros-de-aceitunas-el-puente-arenas-de-san-pedro · Arenas de San Pedro
almazara-comarcal-cooperativa-del-alberche-cebreros · Cebreros  (SIN WEB)
almazara-la-beltraneja-sociedad-cooperativa-del-campo-mombeltran · Mombeltrán  (SIN WEB)
almazara-la-moraleda-cooperativa-san-pedro-bautista-san-esteban-del-valle · San Esteban del Valle  (SIN WEB)
aceitunas-ovidio-s-l-serranillos · Serranillos
aceitunas-simon-e-hijos-s-l-vicolozano · Vicolozano
aceitunas-serranillo-avila · Ávila  (SIN WEB)
la-huerta-de-rodri-arenas-de-san-pedro · Arenas de San Pedro  (SIN WEB)
el-ingenio-de-la-huerta-sl-cabezas-de-alambre · Cabezas de Alambre  (SIN WEB)
sabores-de-gredos-candeleda · Candeleda
la-huerta-de-miguel-huertos-ecologicos-casillas · Casillas  (SIN WEB)
cooperativa-capra-hispanica-higo-de-gredos-el-raso · El Raso  (SIN WEB)
huerta-col-despoblado-de-caniclosa-salvadios · Salvadiós  (SIN WEB)
la-solanilla-san-esteban-de-los-patos · San Esteban de los Patos
la-huerta-de-xelo-san-esteban-del-valle · San Esteban del Valle  (SIN WEB)
```

Avisos: aceituneras → posible recat a `Aceitunas y encurtidos` (regla 11);
Vicolozano→Ávila y El Raso→Candeleda si las filas sobreviven (regla 19); las
almazaras cooperativas sin web se cotejan con ayuntamiento/prensa; Capra
Hispánica mezcla caprino e higos: decidir categoría dominante con fuente.

### Lote 10 · Miel + Despensa + Aromáticas + Cerveza + Helados + Otros (20)

```text
sat-el-panal-miel-avila-cillan · Cillán  (SIN WEB)
miel-artesanal-la-carrera · La Carrera
miel-artesanal-la-picorea-la-carrera · La Carrera  (SIN WEB)
la-casa-de-la-miel-lanzahita · Lanzahíta  (SIN WEB)
apigredos-miel-y-derivados-carniceria-la-colmena-piedralaves · Piedralaves  (SIN WEB)
la-mielesa-santa-maria-del-tietar · Santa María del Tiétar
pimenton-don-pablo-candeleda · Candeleda  (SIN WEB)
pimenton-el-sequero · Candeleda
cerveza-tupa-el-barco-de-avila · El Barco de Ávila
cerveza-gredos-hoyocasero · Hoyocasero
alimentos-ecologicos-biogredos-mombeltran · Mombeltrán
agropecuaria-la-serrota-santa-maria-del-arroyo · Santa María del Arroyo
la-casa-de-pilar-sotillo-de-la-adrada · Sotillo de la Adrada
cronoble-avila-s-l-avila · Ávila
dehesa-de-la-serna-avila · Ávila
la-heladeria-artesana-arenas-de-san-pedro · Arenas de San Pedro
heladeria-topping-avila · Ávila  (SIN WEB)
heladeria-la-flor-valenciana-avila · Ávila
heladeria-vhola-avila · Ávila
caracoles-de-gredos-arenas-de-san-pedro · Arenas de San Pedro
```

Avisos: resolver juntas las dos mieles de La Carrera (geo-warning, regla 13);
Apigredos mezcla miel y carnicería en el nombre: limpiar y decidir categoría;
pimentón de Candeleda (regla 14); despensa con recat probable (regla 16);
heladerías de capital: obrador propio o fuera.

### Lote 11 · Cierre transversal provincial (152)

Sin lista propia: repasa el CSV completo con los criterios de cierre de la
pasada y resuelve residuales de los lotes 1-10.

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
