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
| 2 | Aceite · DOP Poniente de Granada (Loja/Montefrío/Íllora/Huétor Tájar) | 19 | ⬜ | Coops olivareras del Poniente; tienda propia vs reventa. |
| 3 | Aceite · Vega + Alpujarra/Lecrín + Alhama + Costa + resto | 18 | ⬜ | Aquí caen sospechosos industriales (IFFCO, restaurante-firmvm). |
| 4 | Bodega · Vega + Poniente + Montes/Norte (DOP Granada) | 22 | ⬜ | Viña propia vs distribuidor; destilerías→Licores. |
| 5 | Bodega · Contraviesa-Alpujarra + Costa Tropical + Guadix/Baza | 22 | ⬜ | Vino de altura; ron de caña de Motril; `frutas-los-cursos`→Fruta. |
| 6 | Charcutería · IGP Jamón de Trevélez + Alpujarra/Lecrín | 17 | ⬜ | Secaderos de Trevélez; secadero vs carnicería-despacho. |
| 7 | Charcutería · Vega + Poniente + Altiplano (Cordero Segureño) + Guadix | 16 | ⬜ | Embutido del Altiplano; obrador con curado propio. |
| 8 | Fruta y verdura · Costa Tropical (DOP Chirimoya, aguacate, mango) | 15 | ⬜ | Productor/coop vs manipulador-exportador B2B. |
| 9 | Fruta y verdura · Vega + IGP Espárrago Huétor-Tájar + Altiplano legumbres | 14 | ⬜ | Espárrago IGP; legumbres del Altiplano. |
| 10 | Pan y pastelería · IGP Pan de Alfacar + Vega + piononos de Santa Fe | 15 | ⬜ | 9 filas de Alfacar (IGP); obrador con horno propio. |
| 11 | Pan y pastelería · Alpujarra + Costa + Poniente + Altiplano + Guadix | 13 | ⬜ | Obradores de comarca; despacho vs obrador. |
| 12 | Lácteos y quesos · Alpujarra + Costa + Vega + Lecrín | 13 | ⬜ | Cabra de la Alpujarra; leche propia vs marca. |
| 13 | Lácteos y quesos · Poniente (Montefrío) + Montes + Altiplano + Guadix | 13 | ⬜ | Queso de Montefrío; quesería con ganadería propia. |
| 14 | Aperitivos + Chocolate | 18 | ⬜ | Frutos secos (almendra/pistacho), tostaderos; elaborador vs B2B. |
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
