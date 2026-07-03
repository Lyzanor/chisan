# Verificación provincial de Granada

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/andalucia/granada.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila debe vivir en `data/evidence/andalucia/granada.jsonl` a
medida que se revise cada lote (el fichero aún no existe; se crea en el lote 1).

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento no
lo duplica, solo fija el snapshot, las particularidades de Granada y el plan de
lotes. Los contratos viven en `docs/CSV_CONTRACT.md`, `docs/EVIDENCE_CONTRACT.md`
y `docs/EDITORIAL_POLICY.md`.

Este ledger está pensado para que **Sonnet 5** lo siga de forma autónoma: lee
«Reglas duras para Granada», «Flujo por lote» y la fila del lote en curso; no
necesitas releer el manual entero por lote.

## Estado

- Inicio: 2026-07-01.
- Snapshot inicial: **278 filas**; 0 `verificado`, **51 `parcial`**, 227
  `pendiente`. Es la provincia más grande abordada tras Barcelona y Madrid.
- Venta online inicial: **2 `sí`, 0 `no`, 276 `no comprobado`**.
- `Canal de venta`: **0/278 filas informado**. Los 2 `sí` (ambos `pendiente`, sin
  canal) se reauditan; el resto se rellena al confirmar tienda propia vigente.
- **Anomalía de venta online (al contrario que Castellón/Cádiz).** Aquí el default
  del contrato se respetó casi por completo (276 `no comprobado`, 0 `no`), así que
  **no hay cuarentena masiva de `sí` ni reauditoría de `no`**. El foco NO es la
  venta: es **cerrar la calidad de identidad de 278 filas heredadas sin una sola
  `verificado`**. La venta online se resuelve a favor (`no comprobado`→`sí` con
  canal) cuando un productor tenga tienda propia funcional.
- **Anomalía de verificación (clave del plan).** 0 `verificado` y 51 `parcial`
  heredados. A diferencia de Cádiz (0 `parcial`, 39 `verificado`), aquí **nada está
  dado por bueno** y hay 51 `parcial` que reauditar (promover a `verificado` con
  fuente propia, mantener `parcial` con motivo, o purgar si no es productor Km0).
  Los 51 `parcial` están repartidos: Bodega 10, Aceite 9, Fruta y verdura 7, Pan y
  pastelería 6, Miel 6, Lácteos 5, Charcutería 5, y 1 en Despensa/Cerveza/Chocolate.
- **Sospecha de padding de registro mercantil (el análogo Granada del REGA).**
  Muchas filas traen razón social en MAYÚSCULAS con «S.L.»/«SL»/«S.A.T.» y algunas
  son claramente industriales, refinadoras, B2B o multinacionales (p. ej. `IFFCO
  Iberia`, `Swiss Agro S.L.`, `Zenesur Iberia`). Huele a volcado de registro de
  empresas, no a curación de productores Km0. Triaje duro por lote: refinador/
  envasador/distribuidor/proveedor B2B de ingredientes sin producto artesano ni
  venta propia → purga; artesano real con forma jurídica «S.L.» se queda.
- Reparto por categoría (13): **Aceite 56, Bodega 44, Charcutería 33, Fruta y
  verdura 29, Pan y pastelería 28, Lácteos y quesos 26, Aperitivos 16, Miel 13,
  Despensa artesanal 10, Comida preparada 8, Conservas 8, Cerveza artesana 5,
  Chocolate 2**. Aceite y Bodega dominan (100/278 = 36%).
- Territorio muy disperso: **122 municipios**. Cabeceras: Granada 19, Loja 10,
  Motril 10, Alfacar 9, Guadix 8, Huéscar 8, Baza 7, Almuñécar 6, Atarfe 5, Huétor
  Tájar 5, Padul 5, Puebla de Don Fadrique 5. El resto son colas largas de 1-4
  filas por pueblo. La geografía cruza seis-siete comarcas muy distintas (ver más
  abajo), lo que obliga a lotear por sector **y** zona.
- Imágenes: **193/278 con `imagen`, 85 sin** (Pan 16, Fruta 14, Aceite 13, Bodega
  12, Charcutería 8…). Revisar imágenes **después** de estabilizar identidad,
  `slug`, fusiones y purgas.
- Enlaces iniciales: **web 251/278**, `Instagram` 140/278, `Facebook` 124/278,
  `Google Maps` 278/278, `telefono` 277/278, `correo` 267/278, `direccion`
  278/278, `lat`/`lon` 278/278. `web` (27 sin) e Instagram/Facebook son los huecos.
- Calidad inicial: `node scripts/audit-csv.js --mode=quality --summary-only
  data/csv/andalucia/granada.csv` devuelve **0 errores, 1 warning** y 123 avisos
  suprimidos por opcionales ausentes. `--mode=contract` sobre el fichero: **0
  errores, 0 warnings, status OK** → **sin saltos de geo >100 km** (contrato OK).
- Sin `slug` duplicados (0). El sufijo-pueblo del `slug` **no** es fiable como
  municipio (varios `slug` acaban en un pueblo y su columna `municipio` dice otro,
  p. ej. `iffco-iberia-alhama` → municipio *Escúzar*): fíate de `municipio`+coords.
- Evidencia inicial: **no existe** `data/evidence/andalucia/granada.jsonl` (sí
  existen `almeria`, `cadiz`, `cordoba`, `jaen`). Granada **no** está en cobertura
  estricta (`data/evidence/coverage.json`; solo `andalucia/cadiz`).
- Tras lote 1 / Aceite · Montes de Granada + Guadix/Marquesado (2026-07-01): 278
  filas; **16 `verificado`, 49 `parcial`, 213 `pendiente`**. Venta online: **16
  `sí`, 0 `no`, 262 `no comprobado`**; 14/16 `sí` con `Canal de venta` (los 2 `sí`
  heredados —frutas-los-cursos, segral— siguen sin canal, se resuelven en sus
  lotes). Evidencia: **19 registros** `keep` en
  `data/evidence/andalucia/granada.jsonl` (fichero creado). **0 purgas**; los 5
  `parcial` heredados del lote promovidos a `verificado`.
- Tras lotes 2-5 / Aceite completo + Bodega completo (2026-07-02): **274 filas**
  (−4: 2 purgas por no-productor —FIRMVM restaurante, Alquería de los Lentos hotel—,
  1 purga industrial —IFFCO— y 1 fusión —OMED Venchipa→O-Med—). **88 `verificado`,
  40 `parcial`, 146 `pendiente`**. Venta online: **71 `sí`, 0 `no`, 203 `no
  comprobado`**; 70/71 `sí` con canal (falta solo Segral, lote 16). Evidencia:
  **100 registros**. Los sectores Aceite (lotes 1-3) y Bodega (4-5) quedan
  cerrados; 16 recategorizaciones sacaron el ruido del cajón «Bodega» (Licores 8,
  Bebidas 2, Hidromiel 1, Mostos y zumos 1, Conservas +1, Despensa +1, Fruta +1) y
  Cerveza artesana sube a 6 (Selva-GR).
- Tras lotes 6-14 / Charcutería + Fruta y verdura + Pan + Lácteos + Aperitivos
  (2026-07-02): **267 filas** (−7 en estos lotes: 6 purgas + 0; total provincial 10
  purgas + 1 merge). **200 `verificado`, 23 `parcial`, 44 `pendiente`**. Venta
  online: **121 `sí`, 0 `no`, 146 `no comprobado`**; 120/121 `sí` con canal (falta
  solo Segral). Evidencia: **225 registros** (214 keep, 10 purge, 1 merge). Sectores
  cerrados: Charcutería (6-7), Fruta y verdura (8-9), Pan y pastelería (10-11),
  Lácteos y quesos (12-13). Lote 14 (Aperitivos+Chocolate) **parcial 9/18** (los 9
  restantes bloqueados por límite temporal de la API web; se retoman tras el reset).
  Nuevas categorías creadas al recategorizar el ruido del volcado: **Pescado**
  (Cobasal, Leivamar), **Carnes** (El Moralejo, Cárnicas Luján, Cosegur), **Helados**
  (×4) y **Huevos** (Jabalcón, Aviguardal, Ecotemple).
- Tras lotes 15-16 + flecos del 14 / Miel + Conservas + Despensa + Comida
  preparada + Cerveza + Aperitivos restantes (2026-07-02): **266 filas** (−1: 1
  merge; total provincial 10 purgas + 2 merge). **242 `verificado`, 15 `parcial`,
  9 `pendiente`**. Venta online: **153 `sí` (153/153 con canal), 0 `no`, 113 `no
  comprobado`**. Evidencia: **269 registros** (257 keep, 10 purge, 2 merge). Todos
  los sectores del snapshot inicial revisados; solo restan **9 filas `pendiente`**
  bloqueadas por webs muertas + límite de la API de búsqueda (reset), a cerrar en
  la pasada de cierre: `granada-beer-company`, `deshidratados-isa-rus`,
  `churros-guillen`, `mieleria-la-duquesa`, `jomail-1973`, `veggins`, `zenesur-iberia`,
  `el-hesillero`, `dekum`. Nuevas recats crean **Aceitunas y encurtidos**,
  **Mermeladas** y **Especias**; el sí heredado de Segral queda resuelto (0 `sí`
  sin canal). Nueva fusión: Salsas y Especias Sierra Nevada → Doctor Salsas.
- Modo: primera pasada profunda. Prioridad: cerrar la calidad de las 278 filas
  heredadas (incluidos los 51 `parcial`) antes de añadir candidatos nuevos.

## Comarcas de Granada (para lotear por zona)

Granada es enorme y heterogénea; conviene anclar cada lote a su comarca y su
sello de calidad:

- **Vega de Granada**: capital, Atarfe, Albolote, Maracena, Peligros, Pulianas,
  Santa Fe, Fuente Vaqueros, Chauchina, Láchar, Cúllar Vega, Las Gabias, Ogíjares,
  Armilla, Alhendín, Gójar, Cájar, Huétor Vega, Monachil. Hortícola y pan.
- **Alfacar–Víznar**: Alfacar, Víznar, Huétor Santillán, Cogollos Vega. **IGP Pan
  de Alfacar** (9 filas solo en Alfacar).
- **Costa Tropical**: Motril, Salobreña, Almuñécar–La Herradura, Jete, Otívar,
  Lentegí, Ítrabo, Molvízar, Vélez de Benaudalla, Gualchos–Castell de Ferro.
  **DOP Chirimoya de la Costa Tropical**, aguacate, mango, caña de azúcar.
- **Valle de Lecrín y Alpujarra**: Dúrcal, Padul, Nigüelas, El Valle, Lanjarón,
  Órgiva, Trevélez, Cádiar, Bérchules, Bubión, Capileira, Pampaneira, Pórtugos,
  Torvizcón, Ugíjar, Válor. **IGP Jamón de Trevélez**, miel, vino de altura.
- **Poniente Granadino**: Loja, Montefrío, Íllora, Algarinejo, Huétor Tájar,
  Villanueva Mesía, Moraleda de Zafayona, Salar, Zagra, Moclín. **DOP Poniente de
  Granada** (aceite), **IGP Espárrago de Huétor-Tájar**, queso de Montefrío.
- **Alhama / El Temple**: Alhama de Granada, Arenas del Rey, Cacín, Ventas de
  Huelma, Escúzar, Agrón, Chimeneas. (Ojo: el CSV usa a la vez «Alhama» y «Alhama
  de Granada» — normalizar.)
- **Montes de Granada**: Iznalloz, Deifontes, Colomera, Benalúa de las Villas,
  Montejícar, Píñar, Guadahortuna, Torre-Cardela, Campotéjar. **DOP Montes de
  Granada** (aceite).
- **Guadix y el Marquesado**: Guadix, Benalúa, Purullena, Diezma, La Peza,
  Cogollos de Guadix, Alquife, Jerez del Marquesado, Lanteira, Dólar, Huéneja.
- **Baza – Huéscar (Altiplano / Noreste)**: Baza, Caniles, Zújar, Benamaurel,
  Cúllar, Huéscar, Puebla de Don Fadrique, Galera, Orce, Castilléjar, Castril.
  **IGP Cordero Segureño**, legumbres, pistacho emergente, aceite.

## Reglas duras para Granada

1. **Reauditar `pendiente` Y `parcial`.** No hay ninguna fila `verificado`
   heredada, así que **nada está dado por bueno**. Los 51 `parcial` no son un techo
   fijo: cuando llegue su lote, promuévelos a `verificado` con fuente propia,
   mantenlos `parcial` con motivo documentado (existe pero sin fuente propia
   operativa) o púrgalos si no son productor Km0.
2. **Venta online: sin cuarentena masiva.** 276 `no comprobado`, 0 `no`, 2 `sí`
   (ambos `pendiente`, sin canal): el default se respetó. **No** reaudites en bloque
   los `no comprobado`. Resuelve bien los 2 `sí` y sube `no comprobado`→`sí` (con
   `Canal de venta` y evidencia de pedido remoto vigente en **tienda propia**, no
   reventa de terceros como Amazon/marketplaces) cuando el productor la tenga.
3. **Padding de registro mercantil (triaje duro).** Sospecha de las razones
   sociales en MAYÚSCULAS «S.L./SL/S.A.T.» y de nombres industriales. Distingue:
   - **artesano/elaborador Km0 con forma jurídica S.L.** → se queda;
   - **refinador / envasador / distribuidor / proveedor B2B de ingredientes /
     multinacional** sin producto artesano propio ni venta directa → fuera de
     alcance, purga con evidencia (p. ej. `IFFCO Iberia`, `Swiss Agro`, revisar).
   No purgues por el mero hecho de ser «S.L.»; purga por ser no-productor Km0.
4. **Recategorizaciones esperables.** El volcado trae categorías mal puestas:
   - `frutas-los-cursos-sl-almunecar` está como **Bodega** y es fruta tropical
     (uno de los 2 `sí`) → **Fruta y verdura**;
   - `restaurante-firmvm-almunecar` está como **Aceite** y es un restaurante →
     revisar (recategorizar o purgar si no elabora/vende producto propio);
   - ginebras/destilerías puestas como **Bodega** (`gin-zari`, `ginevia`, etc.) →
     **Licores** si son destilería;
   - varios **Aperitivos** son multicategoría (Bioartesa, Conservas Toro López,
     Higuera Alpujarreña, Tapia): elige la categoría dominante real.
   Cambia la `categoria`, no el `slug` (el `slug` es identidad estable).
5. **Aceite (56, sector dominante) = dos DOP + resto.** **DOP Montes de Granada**
   (Iznalloz/Deifontes/Colomera/Montes) y **DOP Poniente de Granada** (Loja/
   Montefrío/Íllora/Huétor Tájar). Entra la **almazara/molino con molturación
   propia**; distingue del **refinador/envasador/distribuidor** (fuera) y del
   olivarero suelto o cooperativa solo comercializadora. El consejo apoya
   pertenencia, no actividad ni venta.
6. **Bodega (44) = DOP Granada + altura + Costa.** **DOP Granada / Vinos de
   Granada** y vinos de la tierra (Contraviesa-Alpujarra, Laderas del Genil, altura
   de Sierra Nevada). Entra la bodega con **viña y crianza propias**; distingue de
   vinoteca/distribuidor. Trata aparte destilerías (ginebra/ron de caña de Motril)
   → `Licores`. La venta de vino online por terceros no cuenta como `sí`.
7. **Charcutería (33) = IGP Jamón de Trevélez + Cordero Segureño.** Secaderos de
   la Alpujarra alta (**IGP Jamón de Trevélez**: Trevélez, Juviles, Bérchules) y
   cordero/embutido del Altiplano (**IGP Cordero Segureño**, Huéscar/Baza). Entra
   el **secadero/obrador con curación propia**; carnicería minorista solo con
   elaboración propia demostrada; distingue de la mera carnicería-despacho.
8. **Fruta y verdura (29) = Costa Tropical + Vega + Altiplano.** **DOP Chirimoya
   de la Costa Tropical**, aguacate y mango (Motril, Almuñécar, Jete); **IGP
   Espárrago de Huétor-Tájar**; hortícola de la Vega; legumbres del Altiplano.
   Cuidado: muchas empresas de la Costa son **manipuladores/exportadores B2B**
   (SAT, comercializadoras) sin venta directa → `no comprobado` salvo tienda propia;
   distingue del productor/cooperativa que sí vende Km0.
9. **Pan y pastelería (28) = IGP Pan de Alfacar + piononos de Santa Fe.** Pan de
   **Alfacar/Víznar** (IGP), piononos de **Santa Fe**, obradores de comarca. Entra
   el **obrador con horno propio**; distingue del despacho/panadería que revende.
10. **Lácteos y quesos (26) = cabra de la Alpujarra + Montefrío.** Queserías de
    cabra de la Alpujarra y de los Montes, queso de **Montefrío**. Entra la
    **quesería con leche/ganadería propia**; feria o concurso apoyan existencia, no
    fuente propia ni venta.
11. **Aperitivos (16) = frutos secos y snacks.** Almendra de la Alpujarra/Lecrín/
    Alhama, **pistacho** emergente del Altiplano (Baza/Benamaurel), patatas fritas
    artesanas, tostaderos. Entra el **elaborador/tostadero**; distingue del
    comerciante/intermediario B2B de frutos secos sin elaboración propia.
12. **Miel (13) = Miel de Granada (Alpujarra/Lújar/Sierra Nevada).** Entra el
    **apicultor con colmenas propias**; distingue del envasador/reenvasador.
13. **Homónimos, etiquetas de municipio y geo.** El CSV mezcla «Alhama» y «Alhama
    de Granada»; hay `slug` cuyo sufijo-pueblo no coincide con su `municipio`.
    Normaliza etiqueta usando `municipio`+coords, no el `slug`. Vigila homónimos
    entre provincias (Alhama existe en Almería/Murcia; Cájar, Galera, etc.). Geo
    inicial OK (0 saltos >100 km); si un bloque cae lejos por homónimo, corrige
    `data/reference/municipios-overrides.json`, no muevas productores correctos.
14. Un sitio HTTP, certificado roto, timeout o bloqueo (age-gate de alcohol,
    Cloudflare) **no prueba** baja. Contrasta con búsqueda, perfil oficial, Maps,
    registro o fuente local antes de borrar web, venta o fila.
15. No purgar con evidencia débil: exige duplicado, fuera de alcance/provincia,
    industrial/B2B claro, cierre o ausencia suficientemente contrastada. Pero
    **espera más purgas que en Cádiz** por el padding de registro.
16. No añadir candidatos nuevos durante esta primera pasada salvo decisión
    explícita. Primero cerrar la calidad de las 278 filas heredadas.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la comprobación de una fuente propia o ficha
real cuando la decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Sabor Granada** (marca de calidad de la Diputación de Granada): directorio
  gastronómico provincial; el ancla principal de descubrimiento y cotejo (análoga a
  «Sabor a Cádiz» / «Ruta de Sabor» en Castellón).
- **DOP Montes de Granada** y **DOP Poniente de Granada** (consejos reguladores):
  almazaras y marcas amparadas; anclas de Aceite.
- **IGP Jamón de Trevélez** (consejo regulador): secaderos amparados de la
  Alpujarra alta; ancla de Charcutería. **IGP Cordero Segureño** para el Altiplano.
- **DOP Granada / Vinos de Granada** (consejo regulador): bodegas inscritas;
  vinos de la tierra Contraviesa-Alpujarra y Laderas del Genil como sello
  complementario de altura.
- **IGP Pan de Alfacar** (consejo regulador): obradores amparados; ancla de Pan.
- **DOP Chirimoya de la Costa Tropical de Granada-Málaga** e **IGP Espárrago de
  Huétor-Tájar** (consejos reguladores): anclas de Fruta y verdura.
- **CAAE** (Comité Andaluz de Agricultura Ecológica): buscador de operadores
  ecológicos andaluces.
- **Landaluz** (Asociación Empresarial Alimentos de Andalucía): industria
  agroalimentaria andaluza con marca.
- Comarcas y turismo: Alpujarra, Costa Tropical, Guadix–Marquesado, Baza–Huéscar
  (Altiplano / Geoparque de Granada), Poniente Granadino, Montes, Vega de Granada,
  Valle de Lecrín, Alhama.
- Contexto local secundario: ayuntamientos, prensa local reciente, Google Maps y
  redes oficiales; nunca como sustituto único de actividad productora si queda duda.

## Plan de ejecución

Lotes agrupados por sector y comarca para reutilizar fuentes (consejos
reguladores, marca Sabor Granada) y aplicar la regla dura correspondiente. Tamaño
13–22 filas. Los lotes 1–16 cubren el snapshot de 278 sin solaparse; el 17 es
cierre transversal.

1. **Lotes 1–3 (Aceite, 56 filas).** El sector dominante, partido por DOP/zona:
   Montes de Granada, Poniente de Granada, y Vega/Alpujarra/Alhama/Costa/resto.
   Objetivo: crear el primer JSONL, fijar el alcance Km0 (almazara con molino vs
   envasador/refinador/distribuidor) y empezar a purgar el padding industrial.
2. **Lotes 4–5 (Bodega, 44 filas).** DOP Granada + vinos de altura; separar bodega
   con viña propia de vinoteca/distribuidor y sacar destilerías a `Licores`.
   Resolver el `sí` anómalo de `frutas-los-cursos` (recategorizar a Fruta).
3. **Lotes 6–7 (Charcutería, 33 filas).** IGP Jamón de Trevélez (Alpujarra) +
   Cordero Segureño (Altiplano); secadero/obrador vs carnicería-despacho.
4. **Lotes 8–9 (Fruta y verdura, 29 filas).** Costa Tropical (DOP Chirimoya,
   aguacate/mango) + Vega/IGP Espárrago de Huétor-Tájar/Altiplano; productor/coop
   vs manipulador-exportador B2B.
5. **Lotes 10–11 (Pan y pastelería, 28 filas).** IGP Pan de Alfacar + piononos de
   Santa Fe + obradores de comarca; obrador con horno vs despacho.
6. **Lotes 12–13 (Lácteos y quesos, 26 filas).** Cabra de la Alpujarra + queso de
   Montefrío + resto; quesería con leche propia vs marca/feria.
7. **Lote 14 (Aperitivos + Chocolate, 18 filas).** Frutos secos (almendra,
   pistacho), snacks y tostaderos; elaborador vs intermediario B2B.
8. **Lote 15 (Miel + Conservas, 21 filas).** Miel de Granada (Alpujarra/Sierra
   Nevada) y conserveras; apicultor con colmenas propias vs envasador.
9. **Lote 16 (Despensa artesanal + Comida preparada + Cerveza artesana, 23
   filas).** Cajón heterogéneo (cafés, especias, azafrán, salsas, croquetas) +
   cerveceras; resolver el `sí` anómalo de `segral-cerveza-artesana`.
10. **Lote 17 (cierre transversal).** 0 pendientes, `Canal de venta` en todos los
    `sí`, evidencia para todas las filas activas, dedup y geo, normalización de
    etiquetas de municipio, e imágenes de las purgas; provincia lista para
    `coverage.json`.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes parten por
categoría/zona en el orden actual del CSV; **congela los `slug` al iniciar cada
lote**. Si un lote fusiona o purga filas, recalcula los bloques siguientes antes
de iniciarlos. El lote 17 es auditoría transversal y puede revisar filas ya
tocadas.

Las columnas `Pend./Parcial/Verif./VO=sí` reflejan el **contenido inicial del
lote**, no el resultado; se actualizan al cerrar cada lote (como en `cadiz.md`).

| # | Lote | Filas | Estado | Notas iniciales |
|---|---|---:|---|---|
| 1 | Aceite · DOP Montes de Granada + Guadix/Marquesado | 19 | ✅ | Cerrado 2026-07-01. Detalle en «Lote 1». 16 `verificado` (5 `parcial` heredados promovidos) + 3 `parcial` nuevos, **0 purgas**; 14 `sí`/ecommerce. JSONL creado (19 reg.). Web Echinac→aceitesechinac.es. |
| 2 | Aceite · Poniente + El Temple/Alhama | 17 | ✅ | Cerrado 2026-07-02. Detalle en «Lote 2». **1 purga** (IFFCO = multinacional B2B) + **1 fusión** (OMED Venchipa→O-Med, misma Venchipa S.L.). 15 activas: 15 `verificado`, 14 `sí` (13 ecommerce + AOVE Baby whatsapp). Municipio Santa Ana Loja→Salar. |
| 3 | Aceite · Vega + Alpujarra/Lecrín + Alhama + Costa + Altiplano | 20 | ✅ | Cerrado 2026-07-02. Detalle en «Lote 3». **1 purga** (FIRMVM = restaurante). 19 activas: 17 `verificado` + 2 `parcial` (B.olivar, Calanté); 14 `sí`/ecommerce. Municipio «Costa»→Almuñécar (Tropicual); webs Sulayr/Cortijo Los Almendros corregidas, basura «http://.» fuera. |
| 4 | Bodega · Vega/Temple/Lecrín + Guadix/Marquesado | 22 | ✅ | Cerrado 2026-07-02. Detalle en «Lote 4». **1 purga** (Alquería de los Lentos = hotel rural). 21 activas: 20 `verificado` + 1 `parcial` (Caballo, web aparcada); 14 `sí`/ecommerce. **10 recategorizaciones** (5 Licores, Víver→Despensa, Espadafor+Retornable→Bebidas, Juan Ranas→Conservas, Granadajuice→Mostos y zumos). Municipios: Ginevia→Alhama de Granada, Liber Lecrin→Padul, Señorío de Nevada Cónchar→Villamena. |
| 5 | Bodega · Altiplano + Contraviesa-Alpujarra + Costa | 22 | ✅ | Cerrado 2026-07-02. Detalle en «Lote 5». 0 purgas: 20 `verificado` + 2 `parcial` (Grupo Collados = hotel-restaurante sin producción confirmada; Los Barrancos sin fuente propia); 14 `sí`/ecommerce. **6 recategorizaciones** (El Mondero+Ron Montero+Rosas→Licores, La Runa→Hidromiel, Frutas Los Cursos→Fruta y verdura con su `sí` heredado resuelto, Selva-GR→Cerveza artesana con web añadida). |
| 6-7 | Charcutería (Trevélez IGP + Altiplano Segureño) | 33 | ✅ | Cerrado 2026-07-02. Detalle en «Lote 6-7». **2 purgas** (Tu Jamón al Corte = cortador de eventos; Jamones Nicolás = en liquidación + dominio secuestrado). 31 activas: 29 verif + 2 parcial (Mariscal, El Zalandro); 22 `sí`/eco. Recat Cobasal→Pescado. Municipio Zurita Juncaril→Albolote; webs Puente Viejo/Al-Andaluzza. |
| 8-9 | Fruta y verdura (Costa DOP Chirimoya + Vega/Altiplano IGP Espárrago) | 30 | ✅ | Cerrado 2026-07-02. Detalle en «Lote 8-9». **3 purgas** (Agrologística Alborán en liquidación, OPP pesquera, Llano Fresh Trade = trader sin fincas). 26 activas: 24 verif + 2 parcial (Adania, COVECOL); 9 `sí`. **5 recats** (Leivamar→Pescado; El Moralejo/Cárnicas Luján/Cosegur→Carnes; El Chango→Charcutería). Municipios Costa→Los Guájares, Vega→Valderrubio, Loja→Huétor Tájar. Web Los Fresnos (casino) fuera. |
| 10-11 | Pan y pastelería (IGP Pan de Alfacar + comarcas) | 28 | ✅ | Cerrado 2026-07-02. Detalle en «Lote 10-11». **1 purga** (Grupo Abades = hostelería/áreas de servicio). 27 activas todas verif; 5 `sí`/eco. Rey Fernando (piononos Santa Fe) llega en L12-13 (estaba en Lácteos). 5 obradores IGP de Alfacar sin web promovidos por registro IGP. Municipio Magda→Padul; webs Bonachera/Artesa fuera. |
| 12-13 | Lácteos y quesos (cabra Alpujarra + Montefrío) | 26 | ✅ | Cerrado 2026-07-02. Detalle en «Lote 12-13». **1 purga** (Puleva = industria Lactalis). 25 activas todas verif; 10 `sí`/eco. **8 recats** (4 helados→Helados; Rey Fernando→Pan; Jabalcón/Aviguardal/Ecotemple→Huevos). Municipio Aserradero Salar→Alhama de Granada, Jabalcón→Benamaurel; webs Montefrieño/Jabalcón/Aviguardal fuera. |
| 14 | Aperitivos + Chocolate | 18 | ✅ | Cerrado 2026-07-02 (parte 2ª tras reset). 0 purgas; 16 verif + 2 parcial (Bioartesa mayorista eco, Swiss Agro filial suiza B2B); 9 `sí`/eco. Recat Conservas Toro López→Aceitunas y encurtidos. Municipio Donaire→Escúzar; webs Patatas La Rivera (muerta) fuera, Sol de Alba typo. |
| 15 | Miel + Conservas | 21 | 🟨 | Cerrado salvo 3 (2026-07-02). Miel: apicultores con colmenas propias (Arana, Garciolo, El Purche, Apivera, El Abuelo Rafael, Finca La Patrona, Apipadul whatsapp) + **recats** (Rufino→Conservas, Loma y Vega/Cruz del Viso→Mermeladas, Valle y Vega→Fruta y verdura). Conservas: Riofrío Caviar→Pescado, Granada La Palma→Fruta y verdura, La Frubense/Centro Sur/La Pauleña. **Pend.: jomail, dekum, mieleria-la-duquesa.** |
| 16 | Despensa + Comida preparada + Cerveza | 23 | 🟨 | Cerrado salvo 6 (2026-07-02). Cafés (La Malicia, Sol y Crema), té (Granada Tea), azafrán (Oasis), churros (KingChurro), croquetas (Mi Croqueta, Olé Mis Croquetas), cerveceras (Segral resuelto, San Torcuato, Portolobo, Albayzinera). **Fusión** Salsas Sierra Nevada→Dr. Salsas. **Recats** Ruca→Especias, Eduardo Sanz→Fruta y verdura. Mariscos Apolo→parcial. **Pend.: granada-beer, deshidratados-isa-rus, zenesur, el-hesillero, veggins, churros-guillen.** |
| 15 | Miel + Conservas | 21 | ⬜ | Miel de Granada; apicultor con colmenas propias. |
| 16 | Despensa artesanal + Comida preparada + Cerveza artesana | 23 | ⬜ | Cajón heterogéneo; `segral-cerveza`→resolver `sí`. |
| 17 | Cierre transversal provincial | 278 | ⬜ | 0 pendientes; canal en todos los `sí`; evidencia completa; geo/dedup; `coverage.json`. |

Reparto por categoría (snapshot inicial, para cuadrar los lotes): Aceite 56
(lotes 1–3), Bodega 44 (4–5), Charcutería 33 (6–7), Fruta y verdura 29 (8–9),
Pan y pastelería 28 (10–11), Lácteos y quesos 26 (12–13), Aperitivos 16 +
Chocolate 2 (14), Miel 13 + Conservas 8 (15), Despensa artesanal 10 + Comida
preparada 8 + Cerveza artesana 5 (16). Total 278.

## Flujo por lote (resumen)

Detalle completo en `docs/VERIFICATION_TECHNIQUES.md`. Por lote:

1. `git status --short` y `npx pnpm list:province granada` (acota con `--categoria`
   para el lote).
2. Congelar los `slug` del lote en el orden actual del CSV.
3. Priorizar: no-productores/industriales/duplicados/enlaces ajenos → `parcial`
   heredado a reauditar → `pendiente` con fuente propia fácil → los 2 `sí` sin
   canal → enlaces/municipios/categorías dudosas.
4. Investigar hasta evidencia suficiente; no recolectar opcionales que no cambien
   la decisión.
5. Editar quirúrgicamente el CSV (parser CSV, LF, solo los `slug` del lote).
6. Crear/actualizar una línea en `data/evidence/andalucia/granada.jsonl` por cada
   alta de evidencia, cambio de `verificacion`, cambio de `Venta online`/canal,
   purga o fusión. Conserva claims `identity`/`producer-activity`/`municipality`
   en las filas `verificado` (no solo `online-sales`), o `check:evidence` lo
   rechaza.
7. Validar al iterar: `npx pnpm check:csv:changed` y
   `npx pnpm check:evidence:changed`.
8. Cerrar el lote: `npx pnpm verify:data`.
9. Actualizar este ledger: snapshot si cambia, estado del lote en la worklist,
   fecha y nota corta (verificadas, parciales, purgas/fusiones, residuales). Añade
   una sección «Lote N — …» con las decisiones relevantes, como en `cadiz.md`.

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada para pausar.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga/fusión tiene registro
  `purge`/`merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente (tienda propia o del consejo/colectivo, no reventa de terceros); cada
  `no`/`no comprobado` revisado tiene razón clara.
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas como prueba
  fuerte ni categorías/municipios claramente erróneos sin corregir.
- No quedan duplicados aparentes sin decisión explícita; sin colisiones
  geográficas por homónimo sin override.
- Las imágenes se revisan solo tras estabilizar identidad y `slug`; al purgar una
  fila con `imagen`, se elimina el archivo referenciado si no lo usa otra fila.
- `npx pnpm verify:data` pasa antes de cerrar cada lote y antes del cierre
  provincial.
- Cuando las 278 filas iniciales queden cerradas, añadir `andalucia/granada` a
  `data/evidence/coverage.json` en el mismo cambio que complete la evidencia
  provincial.

## Decisiones que deben quedar especialmente anotadas

- **Padding de registro purgado**: por qué cada industrial/refinador/envasador/
  distribuidor/B2B queda fuera de alcance Km0 (o por qué se rescata como artesano).
- **Alcance Km0 del Aceite**: por qué entra cada almazara (molturación propia) o
  por qué se trata como envasador/comercializadora sin molino.
- Promociones desde registro/feria/DOP a `verificado`: qué fuente propia, perfil
  oficial o ficha individual supera el techo de `parcial` (importa por los 51
  `parcial` heredados).
- Cualquier productor sin web propia que quede `verificado`: la fuente concreta.
- Recategorizaciones (Bodega→Fruta/Licores, Aceite→otra, Aperitivos multicategoría):
  qué producto real define la categoría.
- Secadero/obrador vs carnicería-despacho en Charcutería; obrador vs despacho en
  Pan; quesería con leche propia vs marca en Lácteos.
- Manipulador/exportador B2B vs productor Km0 en Fruta y verdura de la Costa.
- Cambios de `Venta online` (sobre todo `no comprobado`→`sí` con tienda propia, y
  la resolución de los 2 `sí` heredados sin canal).
- Purgas por no productor, industrial/B2B, cierre, duplicado, otra provincia o
  entidad sin rastro suficiente.
- Normalización de etiquetas de municipio (p. ej. «Alhama»→«Alhama de Granada») y
  overrides de centroide creados para homónimos.

## Lote 1 — Aceite · DOP Montes de Granada + Guadix/Marquesado

Revisión de las 19 fichas de `Aceite` de los Montes de Granada (15: Benalúa de las
Villas, Bogarre, Campotéjar, Colomera, Darro, Deifontes, Domingo Pérez, Gobernador,
Guadahortuna, Iznalloz, Montejícar, Montillana ×2, Píñar ×2) y Guadix/Marquesado
(4: Diezma, Guadix ×2, Villanueva de las Torres) (2026-07-01). Resultado: 19 filas
activas (**0 purgas**), **16 `verificado`, 3 `parcial`**; venta online **14 `sí`
(todas `ecommerce`), 0 `no`, 5 `no comprobado`**. Crea
`data/evidence/andalucia/granada.jsonl` (19 registros `keep`).

Sector muy sólido: casi todas son almazaras/cooperativas olivareras (S.C.A./S.A.T.)
con molino propio y tienda online funcional. El padding industrial temido no
apareció en esta zona; el trabajo fue confirmar la tienda propia, promover los 5
`parcial` heredados y triar tres fichas sin web.

Decisiones relevantes:

- **Los 5 `parcial` heredados, promovidos a `verificado`** (almazara/cooperativa
  real confirmada por su propia web): Santa Isabel/ORO MOLIDO (Campotéjar), Oleomera
  (Colomera), Varaila (Domingo Pérez; web con certificado caducado, no prueba baja),
  Virgen de la Cabeza (Montejícar) y Perpetuo Socorro/Diez+Oro (Diezma, desde 1944).
- **Venta online confirmada con tienda propia (`ecommerce`) — 14 `sí`, todos flips
  `no comprobado`→`sí`**: Conde de Benalúa (tienda en amargaypica.com), D'Villalta,
  Santa Isabel, Oleomera, Daromas, San Isidro de Deifontes (marca Fuente de Dios),
  Bio Vergara, Maquila, Iznaoliva (DOP Montes de Granada), Almazara Montillana,
  Dehesa de Búlar (marca Oilé), Campopineda, Perpetuo Socorro y Echinac. Carrito
  confirmado (en Montillana y Campopineda se comprobó la página de tienda).
- **`verificado`/`no comprobado`** (cooperativa real sin tienda online propia):
  Varaila (Domingo Pérez) y Virgen de la Cabeza (Montejícar; web = portal de socios).
- **`parcial`** (existen por ficha de Google Maps con `place_id`, pero sin fuente
  propia que confirme actividad/tienda): Molino de Carrilla (Villanueva de las
  Torres; web propia mínima en Vercel), Salvoreta (Montillana; AOVE picual, en Sabor
  Granada, sin web) y Campo de Aviación (Guadix; empresa nueva de aceite ecológico,
  solo gmail + teléfono). Los tres marcados para revisar/purgar en pasadas futuras.
- **Enlace corregido**: `aceites-echinac-guadix` — web heredada `aceites-echinac.com`
  hace 301 a `aceitesechinac.es` (dominio activo con tienda) → corregida. Echinac
  (Guadix, desde 1964) es marca-envasadora con AOVE propio y certificación ecológica
  CAAE, listada en Sabor Granada → `verificado`/`sí`; si una pasada futura confirma
  que no molturan olivar propio, revisar alcance.
- **Nota de identidad**: el `slug` `dehesa-de-bular-s-l-montes` termina en «-montes»
  pero el municipio correcto es **Píñar** (Búlar Bajo); se mantiene el `slug` estable.
- **Daromas** (Darro): proyecto agroecológico multiproducto (AOVE propio +
  conservas/guisos); se mantiene en `Aceite` por su línea de AOVE, con tienda propia
  → `verificado`/`sí`.

Snapshot tras lote 1:

- Filas CSV: 278
- Verificación: 16 verificado, 49 parcial, 213 pendiente
- Venta online: 16 sí, 0 no, 262 no comprobado
- Canal de venta informado: 14/16 productores con `Venta online=sí`
- Evidencia Granada: 19 registros JSONL (todos `keep`; fichero creado)

## Lote 2 — Aceite · Poniente + El Temple/Alhama

Revisión de las 17 fichas de `Aceite` del Poniente (Loja ×3, Salar, Zagra,
Villanueva Mesía, Íllora ×3 + Alomartes, Pinos Puente) y El Temple/Alhama (Ventas
de Huelma, Ácula, La Malahá, Escúzar, Alhama de Granada, Alhendín) (2026-07-02).
Resultado: **15 filas activas** (1 purga + 1 fusión), **15 `verificado`, 0
`parcial`**; venta online **14 `sí` (13 `ecommerce` + 1 `whatsapp`), 0 `no`, 1 `no
comprobado`**. +17 registros (15 keep, 1 purge, 1 merge).

Decisiones relevantes:

- **Purga (out-of-scope) — primer padding industrial confirmado**:
  `iffco-iberia-alhama` (planta en Escúzar). Filial del grupo multinacional IFFCO
  (34 plantas, 12 países): refinador/envasador B2B sin venta minorista ni producto
  Km0. Imagen eliminada.
- **Fusión**: `omed-venchipa-s-l-acula` → `o-med-aceites-ventas-de-huelma`.
  Venchipa S.L. es la razón social de O-Med (misma dirección Ctra. Ácula-Ventas de
  Huelma km 1, mismos IG/FB); la fila duplicada apuntaba a su web de oleoturismo
  (experienciasomedoil.com, sin tienda).
- **Municipio corregido**: Santa Ana de Salar, etiqueta Loja→**Salar** (cooperativa
  fundada por olivareros de Salar; coords a ~7 km de Salar y ~19 de Loja).
- **Venta online (13 ecommerce)**: Loxa, Santa Ana de Salar, Cerro Gordo (Ventorros
  de San José), Oleosalar (Don Emilio/Inena), San Lorenzo de Zagra (Castillo de
  Zahra, DOP Poniente), Aceites Morales (Escóznar), Lucio Milenium, Roldán Oliva
  (1895; su web da timeouts, tienda confirmada por búsqueda), Propios del Guadiana,
  O-Med, Torres Morente/Maeva, Los Tajos (promovida de `parcial`) y La Purísima.
  **AOVE Baby** = primer canal `whatsapp` de la provincia (almazara CAAE/Kosher en
  Villanueva Mesía; segunda sede en Cárchel, Jaén; pedido por botones de WhatsApp
  en su propia web).
- **Alcance de las grandes**: Torres Morente/Aceites Maeva entra como
  productor-envasador integrado (molino de origen 1930), análogo a las casas
  grandes de Cádiz; anotado el matiz de escala en la evidencia.
- **`no comprobado`**: Casería de la Virgen (Alomartes; DOP Poniente, ecológica,
  4 generaciones; su web dio timeout y no hay tienda confirmada).

## Lote 3 — Aceite · Vega + Alpujarra/Lecrín + Costa + Altiplano + resto

Revisión de las 20 fichas de `Aceite` restantes (Alfacar, Almuñécar, Castril,
Cortes de Baza, «Costa», Cájar, Dílar, Freila, Granada ×2, Gójar, Huéscar, Jun,
Lentegí, Monachil, Nigüelas, Padul, Pinos del Valle, Puebla de Don Fadrique,
Órgiva) (2026-07-02). Resultado: **19 filas activas** (1 purga), **17 `verificado`,
2 `parcial`**; venta online **14 `sí` (ecommerce), 0 `no`, 5 `no comprobado`**.
Cierra el sector Aceite (lotes 1-3). +20 registros (19 keep, 1 purge).

Decisiones relevantes:

- **Purga (not-producer)**: `restaurante-firmvm-almunecar`. Es un restaurante de
  Almuñécar (así lo cubre la prensa local), sin rastro de finca/almazara/marca
  propia; categoría Aceite heredada errónea.
- **Municipio inválido corregido**: `mangrove-studios-sl-costa` tenía municipio
  «Costa» (no existe) → **Almuñécar** (C. Amapola 3, CP 18690; coords en La
  Herradura). Es **Tropicual** (Tropicual Mangrove S.L.), productor ecológico real
  de AOVE picual con olivares en Cuevas del Campo y Jaén → `verificado`/`no
  comprobado` (venta por contacto, sin carrito).
- **Webs corregidas**: Finca Sulayr («http://Finca.sulayr.com» malformada →
  fincasulayr.com, con tienda), Cortijo Los Almendros (www no resuelve → apex) y
  B.olivar (web basura «http://.» eliminada).
- **`parcial`**: `b-olivar-granada` (solo ficha Maps con place_id en la Chana) y
  `calante-padul` (dirección en Sabor Granada, sin web). Revisar/purgar en cierre.
- **Venta online (14 ecommerce)**: San Sebastián de Alfacar (Albojaira, DOP
  Montes), Coop. Castril (Suerte Somera, promovida), Habitat AOVE (AlVelAl,
  promovida), Quaryat Dillar, Verdefrey (Freila), Alma de Luna (fundación con
  olivos propios en Chauchina), Reyes Rivero, La Soledad de Huéscar (tienda en
  dominio hermano .es, promovida), Picón de Murillo, Aneas (Lentegí), Finca Sulayr,
  Navarro García (Nigüelas), Orovalle/San Roque (Pinos del Valle) y Arkilakis.
- **`no comprobado` con motivo**: Tropicual y Cortijo Los Almendros (sin carrito
  confirmado), La Flor de la Alpujarra (web 503; coop. real de Órgiva con almazara
  desde 2009; reventa por tiendas comarcales).

## Lote 4 — Bodega · Vega/Temple/Lecrín + Guadix/Marquesado

Revisión de 22 fichas de `Bodega` (Albolote, Alhama, Arenas del Rey, Atarfe ×2,
Cijuela, Cónchar, Deifontes, Granada ×3, La Malahá, Lecrín, Nigüelas + Benalúa,
Cogollos de Guadix, Dólar, Gorafe, La Peza, Polícar ×2, Caniles) (2026-07-02).
Resultado: **21 filas activas** (1 purga), **20 `verificado`, 1 `parcial`**; venta
online **14 `sí` (ecommerce; Víver además `suscripcion`), 0 `no`, 7 `no
comprobado`**. +22 registros (21 keep, 1 purge).

El cajón «Bodega» del volcado era en realidad un mixto de destilerías, kombucha,
zumos y hoteles: **10 recategorizaciones** y 3 municipios corregidos.

Decisiones relevantes:

- **Purga (not-producer)**: `niwalas-rural-s-l-niguelas` (Alquería de los Lentos).
  Hotel rural de 2 estrellas con restaurante/spa en un molino del s. XVI; ni bodega
  ni producción propia. Imagen eliminada.
- **Recategorizaciones**: Bodega→**Licores** ×5 (Gin-Zarí, Ginevia, Destilerías
  Joaquín Alonso, By Curro Premium, Destilerías Liber); →**Despensa artesanal**
  (Víver, kombucha/kéfir, como La Kombuchería de Cádiz); →**Bebidas** ×2
  (Industrias Espadafor 1939 —GINSIN/Champín, planta propia de 37.500 m²— y La
  Retornable —bebidas vegetales eco retornables km0, Cijuela—); →**Conservas**
  (Juan Ranas/Pura Salsa S.L., tomate frito de Arenas del Rey); →**Mostos y
  zumos** (Granadajuice, zumo de granada HPP en Mercagranada).
- **Municipios corregidos**: Ginevia «Alhama»→Alhama de Granada (normalización);
  Liber «Lecrin»→**Padul** (Pol. La Paloma, CP 18640, coords junto a Padul);
  Señorío de Nevada «Cónchar»→**Villamena** (Cónchar es núcleo de Villamena).
- **Webs corregidas**: Víver (301→viverdrinks.com), Señorío de Nevada
  (senoriodenevada.com con certificado ajeno→senoriodenevada.es), Al Zagal
  (.es→.com), Vertijana (vertijana.com muerta→bodegasvertijana.es), Pago de
  Almaraes (mayúsculas→https minúsculas), Bodegas Caballo (dominio aparcado/en
  venta→eliminada).
- **DOP Granada, venta online (ecommerce)**: Señorío de Nevada (boutique propia),
  Fontedei, Anchurón (finca en Darro, oficina de la fila en Granada), Pago de
  Almaraes, Al Zagal (Rey Zagal; su web bloquea el fetch con 403, tienda confirmada
  por búsqueda), Méndez Moya (promovida; eco vegana sin sulfitos), Muñana (200 ha a
  1.188 m), Vilaplana (promovida) + Ginevia, By Curro (marcas propias Vermú de
  Garage/Road 78, elaboración en Liber; nota de alcance por su rama distribuidora),
  Granadajuice, Espadafor, Liber (tiendaliber.com) y Víver.
- **`parcial`**: Bodegas Caballo (Polícar; real según Peñín y directorios, pero
  dominio aparcado y sin fuente propia operativa).
- **`no comprobado`**: Gin-Zarí, Joaquín Alonso, Juan Ranas (certificado caducado),
  La Retornable (venta en tiendas eco físicas), Cerro de las Cruces y Vertijana
  (sin tienda).

## Lote 5 — Bodega · Altiplano + Contraviesa-Alpujarra + Costa

Revisión de las 22 fichas de `Bodega` restantes (Galera ×3, Baza, Huéscar, Puebla
de Don Fadrique + Albondón, Albuñol ×2, Cádiar, Cástaras, Lobras, Murtas, Polopos,
Torvizcón ×2, Ugíjar, Lanjarón + Almuñécar, Jete, Lobres, Motril) (2026-07-02).
Resultado: 22 filas activas (**0 purgas**), **20 `verificado`, 2 `parcial`**; venta
online **14 `sí` (ecommerce), 0 `no`, 8 `no comprobado`**. Cierra el sector Bodega
(lotes 4-5). +22 registros keep.

Decisiones relevantes:

- **Anomalía `sí` heredada resuelta**: `frutas-los-cursos-sl-almunecar` no es
  bodega: es fruta tropical de la Costa (chirimoya DOP, línea premium Dulzonea) →
  recategorizada a **Fruta y verdura**, `verificado`, y su `sí` queda confirmado
  con tienda propia (`ecommerce`).
- **Recategorizaciones**: →**Licores** ×3 (Destilerías Rosas de Baza, Bodegas El
  Mondero —ron de caña de Lobres— y Ron Montero —destilería emblemática de Motril,
  1963, tienda oficial en subdominio—); →**Hidromiel** (La Runa S.C.A., Lanjarón);
  →**Cerveza artesana** (Selva-GR, Huéscar: cervecera en una antigua bodega de
  vino con manantial propio; **web añadida** https://selva-gr.es, la fila no tenía).
- **Contraviesa-Alpujarra, viñedo propio de altura**: Los Martos (promovida;
  tienda en /info), Poeta en Nueva York (Rambla Huarea, «la bodega más pequeña de
  España», tienda propia), Cuatro Vientos, Haza del Lino (restaurante-bodega con
  cosecha propia), La Divisa y Piedras Blancas (Torvizcón, eco/veganas, tienda),
  Dominio de Buenavista/Vinos Veleta (promovida, tienda). **Barranco Oscuro**
  (referente del vino natural, viñedos más altos de Europa) y **García de
  Verdevique** promovidas a `verificado` pero `no comprobado` (la compra de
  Barranco Oscuro remite a gourmethunters = reventa de terceros; Verdevique solo
  contacto). **Nazaríes** (1979, Cerro del Gato) promovida; su https da error TLS
  (no prueba baja).
- **`parcial` (2)**: Grupo Collados (Puebla de Don Fadrique; las fuentes lo ligan
  al hotel-restaurante Collados de la Sagra, web muerta, sin producción propia
  confirmada → candidato a purga en el cierre) y Bodega Los Barrancos (Lobras; 8 ha
  eco bien documentadas por prensa, pero sin web/redes propias ni ficha Maps con
  place_id → techo parcial, como La Mayetería en Cádiz).
- **Costa**: Calvente (Jete, tienda), El Mondero y Ron Montero con tienda propia.
- **Altiplano**: Carayol y Castellar (Los Pedros, tienda), Jaraíz (17 ha,
  promovida, sin tienda), Domingo y Quiles (web mínima propia, `no comprobado`).

Snapshot tras lotes 2-5 (sectores Aceite y Bodega cerrados):

- Filas CSV: 274 (−4: 3 purgas + 1 fusión)
- Verificación: 88 verificado, 40 parcial, 146 pendiente
- Venta online: 71 sí, 0 no, 203 no comprobado
- Canal de venta informado: 70/71 (falta solo Segral, se resuelve en el lote 16)
- Evidencia Granada: 100 registros JSONL (96 keep, 3 purge, 1 merge)
- Categorías tras recats: Aceite 53, Charcutería 33, Fruta y verdura 30, Pan 28,
  Bodega 27, Lácteos 26, Aperitivos 16, Miel 13, Despensa 11, Conservas 9,
  Licores 8, Comida preparada 8, Cerveza artesana 6, Bebidas 2, Chocolate 2,
  Mostos y zumos 1, Hidromiel 1

## Lote 6-7 — Charcutería (IGP Jamón de Trevélez + Cordero Segureño del Altiplano)

Revisión de las 33 fichas de `Charcutería` (2026-07-02). Resultado: **31 filas
activas** (2 purgas), **29 `verificado`, 2 `parcial`**; venta online **22 `sí`
(ecommerce), 0 `no`, 7 `no comprobado`**. +33 registros (31 keep, 2 purge).

- **Núcleo IGP Jamón de Trevélez / Alpujarra** (secaderos de altura, todos
  `verificado`): Nevadensis, Puente Viejo (web lasoleratrevelez.com→jamonespuenteviejo.es),
  Vallejo (Mejor Serrano de España 2018), Antonio Álvarez (Tienda Maruja), Juviles
  (>10.000 m² de secaderos, eco), Diego Martín (Pórtugos), Muñoz (Yegen), Jamonzar
  (Dúrcal, granja propia), Casa Rosendo (Capileira), El Mirador (Güéjar Sierra),
  Granadul (Guadix). Casi todos con tienda propia (`sí`); El Mirador, Granadul y
  Casa Rosendo `no comprobado` (sin e-commerce propio / reventa por terceros).
- **Altiplano / Cordero Segureño y embutido**: Familia Piernas, Doña Carmen (1940),
  Quesada Carpio y Granadinos (Baza/Caniles), Pili y Manolo, Entre-Sierras (halal),
  La Sagra, Al-Andaluzza (embutido halal de ternera), Carnicería Molina, Loli.
- **Purga (not-producer)**: `tu-jamon-al-corte-maracena` (servicio de corte de jamón
  para eventos + reventa de terceros, no elabora).
- **Purga (closed)**: `jamones-nicolas-s-l-gojar` (secadero histórico **en
  liquidación** según registro; su dominio sirve contenido pornográfico — secuestrado,
  patrón Destraperlo).
- **Recategorización**: `salazones-cobasal-s-l-baza` (sardina en salazón/ahumados) →
  **Pescado**.
- **`parcial`**: Mariscal Delicatessen (web «en construcción», perfil de tienda
  delicatessen sin producción propia) y El Zalandro (Puebla de Don Fadrique; sin
  rastro como productor, web muerta → eliminada).
- **Municipio**: Cárnicas Zurita «Juncaril» (polígono)→Albolote. Webs: Al-Andaluzza
  añadida; Puente Viejo corregida.

## Lote 8-9 — Fruta y verdura (Costa Tropical + Vega/Altiplano)

Revisión de las 30 fichas de `Fruta y verdura` (2026-07-02). Resultado: **26 filas
activas** (3 purgas + 1 ya cerrada en L5), **24 `verificado`, 2 `parcial`**; venta
online **9 `sí`, 0 `no`, 17 `no comprobado`**. +29 registros (26 keep, 3 purge).

- **Costa Tropical (chirimoya DOP, aguacate, mango)**: Villa Frutas Tropicales,
  Finca El Pinero, Ecoaguacates, Agrojete, El Grupo S.C.A., Frutas Fajardo, Bio
  Procam (coop eco, tienda procam.bio), Finca del Edén, Arraigo (Los Guájares). Los
  con finca propia + tienda → `sí`; coops/manipuladores B2B → `no comprobado`.
- **Vega + IGP Espárrago de Huétor-Tájar + Altiplano**: Los Fresnos, Los Gallombares
  (líder europeo del espárrago verde), COSAFRA, Neparola, Neva Ajos, Nude Fruit
  Lovers, Hortoventas (SAT), Benafru (mayor melocotón eco de España), Maitena del
  Genil (cereza), Las Torcas. Predominan coops/SAT B2B → `verificado`/`no comprobado`.
- **Purga (closed)**: Agrologística Alborán (comercializadora **en liquidación**).
- **Purga (not-producer)**: OPP de Productores Pesqueros de Motril (entidad asociativa
  pesquera, no productor).
- **Purga (out-of-scope)**: Llano Fresh Trade (trader/exportador sin fincas propias).
- **Recategorizaciones**: Leivamar (pescado con barco propio)→**Pescado**; El Moralejo
  (ternera eco) y Cárnicas Luján (pajuna de Sierra Nevada)→**Carnes**; Cosegur (coop
  de Cordero Segureño IGP)→**Carnes**; Carnicería El Chango (embutido propio)→**Charcutería**.
- **`parcial`**: Adania Fruit (e-commerce sin confirmar finca propia) y COVECOL (coop
  citada, web ajena acrol.com → eliminada).
- **Municipios**: Arraigo «Guájar-Fondón»→Los Guájares; Neva Ajos «Vega»→Valderrubio;
  COSAFRA Loja→Huétor Tájar. Web Los Fresnos (dominio secuestrado con spam de casino)
  eliminada.

## Lote 10-11 — Pan y pastelería (IGP Pan de Alfacar + comarcas)

Revisión de las 28 fichas de `Pan y pastelería` (2026-07-02). Resultado: **27 filas
activas** (1 purga), **27 `verificado`, 0 `parcial`**; venta online **5 `sí`
(ecommerce), 0 `no`, 22 `no comprobado`**. +28 registros (27 keep, 1 purge).

- **IGP Pan de Alfacar** (obradores de Alfacar/Víznar; masa madre, agua de la fuente,
  horno de solera): San Juan (1910, distribuidor), Eduardo Vílchez, Enrique Fernández,
  Horno de Gabriel, Geni, Diego Fernández e Hijos, Zarina (obrador + academia). Los 5
  sin web se promueven por el registro del consejo regulador IGP + ficha Maps.
- **Obradores de comarca (`verificado`)**: Pan de mi Pueblo (Dílar, tienda), La Tarta
  de la Madre de Cris (tartas de queso, tienda), La Gracia de Dios (1920, CAAE), Horno
  del Progreso (1987), Soto (Guadix), La Victoria y El Campillero (Huéscar), Flor de
  Vainilla (galletas de diseño), Balada, Al-Andalus Delicatessen (Lanjarón), Bonachera
  y Repostería Lojeña (Roscos de Loja, ambos obradores autorizados), Panadería Molino
  (Motril), Maritoñi (Ogíjares, tienda), Miguel el Dulcero (Válor, turrón, tienda),
  Gerardo (Órgiva, CAAE), Manolín (Alhama), Peinado (Chauchina), Magda Sweet Cakes,
  Artesa Food (Baza).
- **`sí`/ecommerce**: Pan de mi Pueblo, La Tarta de la Madre de Cris, Repostería
  Lojeña, Maritoñi, Miguel el Dulcero.
- **Purga (not-producer)**: Grupo Abades (grupo de hostelería/áreas de servicio, no
  obrador).
- **Municipio**: Magda Sweet Cakes Granada→Padul; La Victoria «Huescar»→Huéscar. Webs:
  Bonachera (era un email)→roscosdeloja.com; Artesa Food (dominio muerto) eliminada.

## Lote 12-13 — Lácteos y quesos (cabra de la Alpujarra + Montefrío)

Revisión de las 26 fichas de `Lácteos y quesos` (2026-07-02). Resultado: **25 filas
activas** (1 purga), **25 `verificado`, 0 `parcial`**; venta online **10 `sí`
(ecommerce), 0 `no`, 15 `no comprobado`**. +26 registros (25 keep, 1 purge). Fuerte
recategorización: el cajón mezclaba queserías con heladerías y granjas de huevos.

- **Queserías de cabra/oveja (17)**: Júrtiga (1.400 cabras propias), Vico, Los
  Pastoreros (coop, vaca), Granja Maravillas (vaquería propia), De Leyva (finca
  propia), Collados, La Vieja Buchaca (eco), La Peza, Las RRR (7 Super-Gold WCA), Los
  Teatinos, Maíta, Cortijo El Aserradero, Montefrieño (Montes Occidentales), Quesería
  Motril (La Montejaqueña), Casa GonAy, La Cueva del Torilejo (cueva, leche cruda),
  Venta del Chaleco. Con tienda propia → `sí`; sin e-commerce/reventa → `no comprobado`.
- **Recategorización → Helados**: Helados Granada, Nordwik, La Perla (1932),
  IberGelato (municipio «Vega»→Atarfe). Todas fabricación propia; sin e-commerce.
- **Recategorización → Pan y pastelería**: Rey Fernando (Santa Fe) — obrador de
  **piononos de Santa Fe** con tienda propia (pionono.eu), `sí`/ecommerce.
- **Recategorización → Huevos**: Granja Jabalcón (huevos de oca; municipio «Cuevas del
  Barranco»→Benamaurel; dominio caducado/en venta eliminado), Aviguardal (huevos eco;
  web muerta eliminada), Ecotemple (huevos eco, no queso).
- **Purga (out-of-scope)**: Puleva (industria láctea del grupo Lactalis).
- **Municipio/web**: Aserradero Salar→Alhama de Granada; Montefrieño (ficha ajena
  gff.co.uk)→quesomontefrieno.es.

## Lote 14 — Aperitivos + Chocolate (PARCIAL 9/18)

Revisión parcial (2026-07-02): 9 de 18 fichas cerradas; las 9 restantes quedan
`pendiente` por agotarse el límite temporal de la API de búsqueda/fetch web (se
retoman tras el reset). Resultado de las 9: **7 `verificado`, 2 `parcial`**; venta
online **6 `sí` (ecommerce), 3 `no comprobado`**. +9 registros keep.

- **`verificado`/`sí` (elaborador con tienda propia)**: Pistachos Luna (Baza,
  producción propia, Shopify), Almendras Alhambra (coop 1980, ~1.095 socios),
  Peñagallo (patatas fritas de Dúrcal, 1988), Frutos Secos EYMA (Gójar) y La Cometa
  (Huéscar), Chocolates Sierra Nevada (Pitres, obrador).
- **`verificado`/`no comprobado`**: Almendras Donaire (elaborador de almendra ibérica;
  municipio Alhama→**Escúzar**, CITAI; sin tienda, B2B).
- **`parcial`**: Bioartesa (Castilléjar; comercio mayorista de eco de terceros, sin
  confirmar elaboración propia) y Swiss Agro (filial del grupo suizo Swiss Gourmet,
  pistacho B2B sin venta directa). Ambas a revisar/definir alcance en el cierre.
- **Pendientes (9, siguiente pasada)**: Patatas La Rivera (Baza), El Elefante Rosa
  (Guadix), Conservas Toro López / Aceitunas Vega Toro (Huétor Tájar, probable recat
  a Aceitunas/Conservas), Tapia (Lecrín), Higuera Alpujarreña (higos secos, Motril),
  Dr. Salsas (Ogíjares), Tostaderos Sol de Alba (Peligros), SAT Pistalgra (Benamaurel,
  pistacho, sin web), Chocolates Abuela Ili (Pampaneira).

## Lote 14 (cierre) + Lote 15 — Aperitivos restantes, Miel, Conservas

Cierre de los flecos de Aperitivos/Chocolate (bloqueados en la 1ª parte) y del lote
15 (Miel + Conservas) (2026-07-02). En estas categorías el volcado vuelve a
esconder productos mal etiquetados: buena parte de «Miel» eran conservas/mermeladas
y buena parte de «Conservas» eran fruta/pescado.

- **Aperitivos (frutos secos y snacks, `verificado`)**: Pistachos Luna, Almendras
  Alhambra (coop), Peñagallo (patatas de Dúrcal), EYMA, La Cometa, Tapia (almendra),
  El Elefante Rosa (tienda hermana), Almendras Donaire (Escúzar), SAT Pistalgra
  (Benamaurel), Patatas La Rivera (Baza, web muerta), Tostaderos Sol de Alba (typo
  web corregido). **Dr. Salsas** (chiles propios, tienda) absorbe la razón social
  hermana Salsas y Especias Sierra Nevada (fusión). **Chocolate**: Abuela Ili
  (obrador, Pampaneira) y Sierra Nevada (Pitres). Parciales heredados que se
  mantienen: Bioartesa (mayorista eco) y Swiss Agro (filial suiza B2B).
- **Recat Aperitivos→Aceitunas y encurtidos**: Conservas Toro López / Vegatoro.
- **Miel (apicultores con colmenas propias, `verificado`)**: Arana Miel, Martín
  Garciolo, Miel El Purche, Apivera, El Abuelo Rafael (4ª gen.), Finca La Patrona
  (miel+pistacho+AOVE), Apipadul (DOP Miel de Granada, canal whatsapp), Feysol
  Nature (1944, sin tienda).
- **Recats desde «Miel»**: Rufino 1949 (conservas artesanas)→Conservas; Loma y Vega
  (mermeladas subtropicales) y La Cruz del Viso (mermeladas)→Mermeladas; Valle y
  Vega (coop agroecológica)→Fruta y verdura.
- **Conservas (`verificado`)**: La Frubense (deshidratados eco), Centro Sur (IGP
  Espárrago de Huétor-Tájar + conservas Los Monteros/Cesurca), La Pauleña
  (mermeladas del Lecrín), Indesfal/Trezesferas (perlas gourmet, B2B, `no
  comprobado`).
- **Recats desde «Conservas»**: **Riofrío Caviar** (piscifactoría propia de
  esturión, primer caviar eco del mundo)→Pescado; **Granada La Palma** (coop del
  tomate, 710 socios, Adora/Amela)→Fruta y verdura.
- **Pendientes (bloqueadas)**: Jomail 1973 (caracoles; web muerta), Dekum (Lecrín;
  certificado caducado), Mielería La Duquesa (Cájar; solo Instagram).

## Lote 16 — Despensa artesanal + Comida preparada + Cerveza artesana

Revisión (2026-07-02). Cajón heterogéneo de cafés, especias, azafrán, churros y
croquetas + cerveceras.

- **Despensa artesanal (`verificado`/tienda propia)**: Granada Tea Company
  (blending propio de té, Aromas de Al-Ándalus), Grupo La Malicia y Cafés Sol&Crema
  (tostadores de café), Azafrán del Oasis (coop del Altiplano), KingChurro (churros
  ultracongelados), Castril Natural (AOVE eco + cosmética natural, promovida).
- **Comida preparada**: Caña Nature (gazpacho/salmorejo HPP; municipio Alhama→
  **Escúzar**), Olé Mis Croquetas / Cárnicas Genil, Mi Croqueta (Una de Croquetas).
  Todas con tienda propia. **Mariscos Apolo** → `parcial` (distribuidor de congelado
  con cocedero propio; perfil dominante de distribuidor, revisar/purgar en cierre).
- **Recats desde «Comida preparada»**: Productos Ruca (especias para industria
  cárnica)→Especias; Eduardo Sanz (productor de patata + IV/V gama)→Fruta y verdura
  (municipio «Vega»→Granada).
- **Fusión**: Salsas y Especias Sierra Nevada S.L. → Doctor Salsas (misma empresa,
  301; ficha en Aperitivos).
- **Cerveza artesana (`verificado`)**: **Segral** (Almuñécar; resuelve el `sí`
  heredado del snapshot, ahora con canal), San Torcuato / Sotarez (Benalúa, brew
  hub), La Albayzinera (Granada, promovida) con tienda; Portolobo (Huétor Santillán;
  age-gate bloqueó la tienda → `no comprobado`).
- **Pendientes (bloqueadas)**: Granada Beer Company (web muerta), Deshidratados Isa
  Rus (Baza; sin web), Zenesur Iberia (Guadix; web muerta), El Hesillero (Huétor
  Tájar; sin web), Veggins (Granada; error de certificado), Churros Guillén
  (Benamaurel; sin web).

Snapshot tras lotes 15-16 (+ flecos del 14):

- Filas CSV: 266 (−1 merge)
- Verificación: 242 verificado, 15 parcial, 9 pendiente
- Venta online: 153 sí (153/153 con canal), 0 no, 113 no comprobado
- Evidencia Granada: 269 registros JSONL (257 keep, 10 purge, 2 merge)
