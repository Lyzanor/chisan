# Verificación provincial de Málaga

Ledger inicial para planificar y reanudar la revisión profunda de
`data/csv/andalucia/malaga.csv`. El CSV es la fuente de verdad. La evidencia
estructurada por fila debe vivir en `data/evidence/andalucia/malaga.jsonl` a
medida que se revise cada lote (fichero creado al cerrar el lote 1).

El procedimiento general es `docs/VERIFICATION_TECHNIQUES.md`; este documento no
lo duplica, solo fija el snapshot, las particularidades de Málaga y el plan de
lotes. Los contratos viven en `docs/CSV_CONTRACT.md`,
`docs/EVIDENCE_CONTRACT.md` y `docs/EDITORIAL_POLICY.md`.

Este ledger está pensado para que cualquier agente pueda seguirlo de forma
autónoma: lee "Reglas duras para Málaga", "Flujo por lote" y la fila del lote en
curso; no necesitas releer el manual entero por lote.

## Estado

- Inicio: 2026-07-03.
- Snapshot inicial: **405 filas**; **65 `verificado`**, **6 `parcial`** y **334
  `pendiente`**.
- Venta online inicial: **25 `sí`**, **40 `no`** y **340 `no comprobado`**.
- `Canal de venta`: **0/405 filas informado**. Los 25 `sí` son una cuarentena
  dura: deben reauditarse y quedar con canal válido (`ecommerce`, `whatsapp`,
  `email`, `telefono`, `suscripcion` o `marketplace`) o corregirse a `no`/`no
  comprobado`.
- Tras lote 1 (2026-07-03): **404 filas** por 1 fusión; **86 `verificado`**, **9
  `parcial`** y **309 `pendiente`**. Venta online: **37 `sí`**, **36 `no`** y
  **331 `no comprobado`**. Los 12 `sí` resueltos en lote 1 tienen `Canal de
  venta`; todavía quedan `sí` heredados de otros lotes sin canal.
- Tras lote 2 (2026-07-04): **404 filas**; **96 `verificado`**, **10 `parcial`**
  y **298 `pendiente`**. Venta online: **45 `sí`**, **34 `no`** y **325 `no
  comprobado`**. El lote 2 añade 9 `sí` con canal y corrige 2 `no` heredados
  (`Nevaillo` a `sí` y `Sierra de Tejeda` a `no comprobado`).
- **Anomalía clave: provincia enorme con verificados heredados sin evidencia.**
  Málaga tiene más filas que Granada y una mezcla de 65 `verificado`, 6
  `parcial` y 25 `Venta online=sí`, pero no existe ledger de evidencia
  provincial. Nada queda dado por bueno: los `verificado` y `parcial` heredados
  se reauditan dentro de su lote, especialmente si además tienen venta online sin
  canal.
- **Los 40 `Venta online=no` heredados también se revisan.** Un `no` solo debe
  quedar cuando se haya comprobado que no hay mecanismo de pedido remoto vigente.
  Si la revisión no permite cerrarlo, degradar a `no comprobado`. Un `sí` nuevo o
  heredado exige canal y evidencia actual.
- Reparto por categoría (16): **Aceite 74**, **Pan y pastelería 62**, **Bodega
  61**, **Charcutería 41**, **Fruta y verdura 31**, **Lácteos y quesos 31**,
  **Despensa artesanal 29**, **Miel 19**, **Cerveza artesana 13**, **Aceitunas y
  encurtidos 11**, **Huevos 11**, **Café 8**, **Chocolate 6**, **Aromáticas y
  condimentos 4**, **Helados 2**, **Pescado 2**. Aceite, pan y bodega suman
  197/405 = 49% del catálogo.
- Territorio muy concentrado en cabeceras pero con cola larga: **Málaga 66**,
  **Ronda 36**, **Vélez-Málaga 33**, **Antequera 32**, **Coín 23**, Alhaurín el
  Grande 14, Alhaurín de la Torre 8, Cártama 8, Colmenar 8, Arriate 7,
  Campillos 7 y después muchos municipios con 1-6 filas.
- Imágenes: **245/405 con `imagen`, 160 sin**. Revisar imágenes solo después de
  estabilizar identidad, `slug`, fusiones y purgas.
- Enlaces iniciales: **web 345/405**, `Instagram` 213/405, `Facebook` 232/405,
  `Google Maps` 405/405, `telefono` 401/405, `correo` 400/405, `direccion`
  405/405, `lat`/`lon` 404/405.
- Calidad inicial:
  - `node scripts/audit-csv.js --mode=contract data/csv/andalucia/malaga.csv`
    devuelve **0 errores, 0 warnings, status OK**.
  - `node scripts/audit-csv.js --mode=quality --summary-only
    data/csv/andalucia/malaga.csv` devuelve **0 errores, 9 warnings** y 120
    avisos suprimidos por opcionales ausentes.
- Warnings iniciales de geo-check o ubicación:
  - `aceite-finca-rosa-alta-malaga`: 45,0 km de Málaga; centroide más cercano
    Archidona.
  - `aceites-cortijo-el-solano-antequera`: 15,5 km de Antequera; centroide más
    cercano Humilladero.
  - `frutos-secos-esteban-fuengirola`: 22,4 km de Fuengirola; centroide más
    cercano Málaga.
  - `gazpacheria-malaguena-pizarra`: 26,1 km de Pizarra; centroide más cercano
    Málaga.
  - `ibericos-langenal-arriate`: 22,1 km de Arriate; centroide más cercano
    Faraján.
  - `la-huertezuela-alozaina`: 30,3 km de Alozaina; centroide más cercano
    Alhaurín de la Torre.
  - `lagar-del-chorro-torremolinos`: 38,0 km de Torremolinos; centroide más
    cercano Valle de Abdalajís.
  - `nueces-de-ronda-malaga`: 62,7 km de Málaga; centroide más cercano Arriate.
  - `panaderia-nuestra-senora-de-las-nieves-gaucin`: 83,4 km de Gaucín;
    centroide más cercano Málaga.
- Fila sin coordenadas: `agasur-s-c-a-el-taraja`. Revisar si `El Taraja` debe
  mantenerse como localidad submunicipal, corregirse a municipio oficial o quedar
  con centroide honesto.
- Evidencia inicial: no existía `data/evidence/andalucia/malaga.jsonl`; se creó
  en lote 1 con 29 decisiones. Málaga no está en cobertura estricta
  (`data/evidence/coverage.json`).
- Modo: primera pasada profunda. Prioridad: cerrar la calidad de las 405 filas
  heredadas antes de añadir candidatos nuevos.

## Zonas de Málaga para lotear

- **Málaga capital y área metropolitana**: Málaga, Rincón de la Victoria,
  Torremolinos, Alhaurín de la Torre y parte de la Costa del Sol. Mucho obrador,
  café, cerveza, tienda con obrador y negocios urbanos cuyo alcance productivo
  debe probarse, no asumirse.
- **Axarquía y Montes orientales**: Vélez-Málaga, Torrox, Frigiliana, Cómpeta,
  Sayalonga, Sedella, Moclinejo, Almáchar, El Borge, Canillas de Aceituno,
  Alcaucín, Periana, Riogordo, Colmenar, Benamargosa, Cútar, Algarrobo, La
  Viñuela, Nerja y Arenas. Pasas, moscatel, fruta tropical, aceite, miel de caña,
  panadería y embutidos locales.
- **Antequera, Nororma y Guadalteba**: Antequera, Archidona, Campillos, Alameda,
  Fuente de Piedra, Mollina, Humilladero, Sierra de Yeguas, Cuevas Bajas, Cuevas
  de San Marcos, Villanueva de Tapia, Villanueva del Trabuco, Villanueva del
  Rosario, Villanueva de la Concepción, Almargen, Teba y Alfarnate. Aceite DOP
  Antequera, molletes/mantecados, queserías y cooperativas.
- **Serranía de Ronda y Valle del Genal**: Ronda, Arriate, Montecorto, Benaoján,
  Montejaque, Gaucín, Algatocín, Benalauría, Benarrabá, Faraján, Igualeja, Cortes
  de la Frontera y Pujerra. Vino de Ronda, castaña, embutidos, quesos, aceite y
  productores de montaña.
- **Guadalhorce y Sierra de las Nieves**: Coín, Alhaurín el Grande, Cártama,
  Pizarra, Álora, Alozaina, Tolox, Yunquera, El Burgo, Casarabonela, Guaro,
  Almogía, Monda y Ardales. Aceituna Aloreña, huerta, cítricos, huevos,
  queserías, miel y obradores.
- **Costa occidental**: Marbella, Estepona, Mijas, Fuengirola, Casares y Manilva.
  Riesgo de tiendas, restaurantes, sedes comerciales o fichas turísticas frente a
  unidad productiva real; Manilva entra especialmente por viña/pasas.

## Reglas duras para Málaga

1. **Reauditar `pendiente`, `parcial` y `verificado`.** No existe evidencia
   provincial; los 65 `verificado` heredados no son cierre editorial. Cuando
   llegue su lote, cada fila debe quedar con decisión actual (`verificado`,
   `parcial`, `pendiente`, `purge` o `merge`) y evidencia coherente.
2. **Venta online en cuarentena.** Los 25 `sí` no tienen canal. Ninguno se da por
   bueno hasta confirmar un pedido remoto vigente y utilizable. Si la fuente solo
   muestra catálogo, reventa en terceros, visitas, tienda física o formulario
   ambiguo, usar `no comprobado`. Un `sí` siempre lleva `Canal de venta`.
3. **Revisar los 40 `no` heredados.** No heredar `no` como hecho negativo. Si se
   comprobó venta física sin remoto, mantener `no` con evidencia; si no se puede
   demostrar, usar `no comprobado`.
4. **"Sabor a Málaga" orienta, no verifica por sí solo.** La marca/directorio
   provincial es útil para descubrir y cotejar, pero puede incluir comercios,
   restaurantes, ferias y entidades promocionales. Como fuente única normalmente
   sostiene como máximo `parcial`; para `verificado` hace falta fuente propia,
   perfil oficial, ficha real de Google o marketplace verificable.
5. **Aceite (74) = DOP Antequera + almazaras dispersas.** Entra la almazara,
   cooperativa olivarera o marca ligada a molturación/elaboración propia.
   Distingue del olivarero sin unidad elaboradora, envasador, distribuidor o marca
   comercial. Los warnings `aceite-finca-rosa-alta-malaga` y
   `aceites-cortijo-el-solano-antequera` se resuelven en los lotes de aceite.
6. **Bodega (61) = DOP Málaga, Sierras de Málaga y Pasas de Málaga.** Separar
   bodega con viña/crianza/elaboración propia de vinoteca, distribuidor, vermut o
   destilería. El consejo regulador apoya pertenencia, no venta online. Ronda
   concentra 21 bodegas y la mayor parte de los `sí` heredados.
7. **Pasas, moscatel y fruta tropical de la Axarquía.** La DOP Pasas de Málaga y
   la DOP Chirimoya Costa Tropical Granada-Málaga son anclas de contexto, no
   sustituyen fuente propia. Cooperativas y SAT pueden entrar si producen o
   comercializan producto propio local; una central/exportador B2B no prueba venta
   online a consumidor.
8. **Pan y pastelería (62) exige obrador.** Mollete y mantecados de Antequera,
   panaderías de capital y obradores rurales entran si elaboran. Una cafetería,
   despacho, sucursal o tienda sin obrador probado queda `parcial` o fuera de
   alcance según evidencia. Revisar con cuidado `panaderia-nuestra-senora-de-las-
   nieves-gaucin`, cuyo geo-warning apunta a Málaga capital.
9. **Charcutería (41) = elaborador/secadero, no carnicería por defecto.** Benaoján,
   Ronda, Arriate, Colmenar y Axarquía concentran muchas filas. Una carnicería solo
   entra si hay elaboración propia, obrador, secadero o marca productora. Vigilar
   recategorizaciones obvias: `jamones-alameda-alameda` está en Bodega y
   `jamones-y-embutidos-andres-ramos-benarraba` está en Aceite.
10. **Lácteos y quesos (31) = cabra malagueña y queserías artesanas.** Entra la
    quesería con elaboración propia y, si procede, ganadería/leche local. Premios,
    asociación o catálogo de quesos apoyan existencia, pero no venta online.
    Revisar `agasur-s-c-a-el-taraja` por municipio/coordenadas ausentes.
11. **Aceituna Aloreña y encurtidos.** Distingue aceitunera/elaborador de punto de
    venta, distribuidor o tienda gourmet. La DOP Aloreña de Málaga es apoyo de
    operador/producto; no sustituye fuente propia ni prueba venta remota.
12. **Miel, miel de caña y mermeladas.** Apicultor con colmenas propias,
    ingenio/elaborador de miel de caña o obrador de mermeladas pueden entrar, pero
    deben estar correctamente categorizados: algunas filas de mermeladas están en
    `Miel` por arrastre y pueden requerir `Mermeladas` o `Conservas y mermeladas`.
13. **Café (8) = tostador/obrador, no cafetería.** Málaga capital concentra 7
    filas. Entra el tostador o marca con tueste propio; una cafetería que solo
    sirve café queda fuera o `parcial` si el obrador no se acredita.
14. **Cerveza artesana (13) = fábrica o brewpub elaborador.** Un bar, restaurante
    o marca sin fábrica real no basta. La venta en bares o distribuidores no
    cuenta como `Venta online=sí`.
15. **Huevos y granja.** Confirmar explotación avícola/granja y municipio. Si la
    fila es una tienda, pasta, platos preparados o marca sin granja, recategorizar
    o purgar. `la-artesana-de-la-pasta-malaga` en `Huevos` es sospechosa de
    recategorización a `Pasta artesana`/`Despensa artesanal`.
16. **Pescado y conservas.** Solo hay 2 filas y una está en Mollina: revisar si es
    conservera/elaborador real o distribuidor/logística. Las IGP Caballa y Melva
    de Andalucía apoyan contexto para conserveras, no bastan como fuente única.
17. **Categorías heredadas con nombres contradictorios.** Revisar sin esperar a
    que el validator avise: `encurtidos-almario-ronda` en `Pan y pastelería`,
    `patatas-fritas-y-aperitivos-paco-jose-malaga` en `Fruta y verdura`,
    `bizcocheria-lulapai-malaga` y `dulces-del-mar-rincon-de-la-victoria` en
    `Lácteos y quesos`, `con-sabor-tradicional-v-gama-la-cruz-de-piedra-coin` en
    `Bodega`, y similares. Cambia `categoria` cuando la fuente lo sostenga; no
    cambies `slug` salvo identidad/municipio erróneo, duplicado o petición
    explícita.
18. **No purgar con evidencia débil.** Muchas filas sin web son negocios locales
    reales; la falta de dominio no prueba baja. Para purgar exige duplicado, no
    productor, fuera de provincia, cierre o ausencia suficientemente contrastada.
19. **URLs difíciles no prueban nada negativo.** HTTP, TLS, DNS, bloqueo, age-gate
    o Cloudflare solo crean incertidumbre. Confirmar por búsqueda, perfil oficial,
    Maps, registro, consejo regulador o fuente local antes de borrar web, venta o
    fila.
20. **No añadir candidatos nuevos en esta primera pasada** salvo decisión
    explícita. Málaga ya parte con 405 filas; primero cerrar identidad, alcance,
    venta online y evidencia del snapshot heredado.

## Fuentes de cotejo iniciales

Orientan la búsqueda; no sustituyen la comprobación de una fuente propia o ficha
real cuando la decisión sea `verificado`. Confirma el dominio oficial al citarlo.

- **Sabor a Málaga** (`saboramalaga.es`, Diputación de Málaga): directorio y marca
  promocional provincial. Útil para descubrimiento y contacto; como fuente única,
  capar normalmente en `parcial` porque puede incluir comercios, restaurantes y
  promoción.
- **Consejo Regulador de las D.O. Málaga, Sierras de Málaga y Pasas de Málaga**
  (`vinomalaga.com`): bodegas, vinos de Ronda/Axarquía/Manilva/Norte y pasas.
- **DOP Aceite de Antequera** (`doantequera.org`): almazaras, marcas y contexto
  de aceite del norte provincial.
- **DOP Aceituna Aloreña de Málaga** (`alorenademalaga.com`): operadores,
  elaboradores y puntos de venta de aceituna aloreña.
- **DOP Chirimoya Costa Tropical Granada-Málaga** (`crchirimoya.com`): contexto
  para fruta tropical de Vélez-Málaga, Torrox, Frigiliana, Algarrobo y Nerja.
- **IGP Caballa de Andalucía e IGP Melva de Andalucía**
  (`caballaymelvadeandalucia.com`): apoyo para conserveras; revisar si hay
  elaborador malagueño real, no solo distribuidor.
- **Asociación Quesos de Málaga** (`quesosdemalaga.es`) y **CABRAMA**
  (`cabrama.com`): queserías, cabra malagueña y chivo lechal como contexto
  sectorial. No prueban venta online por sí solos.
- **CAAE, Landaluz, Gusto del Sur / Calidad Certificada y registros públicos**:
  útiles para existencia, certificación y razón social; como fuente única suelen
  sostener como máximo `parcial`.
- Webs, tiendas, perfiles oficiales y fichas reales de Google Maps ya presentes
  en el CSV: primera fuente si pertenecen claramente al productor.
- Ayuntamientos, mancomunidades, turismo comarcal, prensa local reciente y ferias:
  fuentes secundarias para resolver dudas, nunca sustituto único si actividad
  productora, municipio o venta quedan materialmente dudosos.

## Plan de ejecución

Lotes agrupados por sector, zona y riesgo para reutilizar fuentes y aplicar la
regla dura correspondiente. Tamaño objetivo: 9-29 filas. Los lotes 1-21 cubren el
snapshot inicial de 405 sin solaparse; el lote 22 es cierre transversal.

1. **Lotes 1-4: Aceite (74 filas).** Empezar por el sector más grande y resolver
   la DOP Antequera, almazaras de Axarquía, cooperativas de Guadalhorce/Sierra de
   las Nieves y los geo-warnings iniciales.
2. **Lotes 5-7: Bodega (61 filas).** Ronda/Serranía primero por concentración de
   `verificado` y `Venta online=sí`; después Málaga/Axarquía y finalmente
   Antequera/Mollina/Guadalhorce/Manilva.
3. **Lotes 8-10: Pan y pastelería (62 filas).** Antequera y molletes/mantecados;
   capital/metropolitana; luego Axarquía, Guadalhorce y Serranía.
4. **Lotes 11-12: Charcutería (41 filas).** Serranía/Genal/Antequera y después
   Málaga/Axarquía/Guadalhorce/Costa; foco en carnicería vs elaborador.
5. **Lotes 13-14: Fruta y verdura (31 filas).** Axarquía tropical y costa;
   después Guadalhorce/Málaga/Ronda/Antequera y los geo-warnings de fruta/despensa.
6. **Lotes 15-16: Lácteos y quesos (31 filas).** Antequera/Serranía y después
   Málaga/Axarquía/Guadalhorce/Sierra de las Nieves.
7. **Lotes 17-18: Despensa artesanal + Pescado/Helados (33 filas).** Primero
   Axarquía/Málaga; después Guadalhorce/Serranía/Antequera y sectores pequeños de
   alto riesgo de recategorización.
8. **Lote 19: Miel + aromáticas/condimentos (23 filas).** Apicultura, miel de
   caña, mermeladas y plantas aromáticas; corregir categoría si procede.
9. **Lote 20: Cerveza artesana + Café (21 filas).** Fábrica/tostador frente a bar,
   restaurante o cafetería sin producción.
10. **Lote 21: Aceitunas/encurtidos + Huevos + Chocolate (28 filas).** DOP
    Aloreña, granjas, obradores de chocolate y recategorizaciones.
11. **Lote 22: Cierre transversal.** Objetivo: 0 pendientes salvo pausa explícita,
    `Canal de venta` en todos los `sí`, evidencia coherente para filas activas,
    purgas/fusiones documentadas, dedup, geo-warnings resueltos o aceptados,
    imágenes revisadas y provincia lista para `coverage.json` si se decide marcar
    cobertura completa.

## Worklist inicial

Leyenda: `⬜` pendiente, `🟨` en curso, `✅` hecho. Los lotes parten por
categoría/zona en el orden actual del CSV; **congela los `slug` al iniciar cada
lote**. Si un lote fusiona o purga filas, recalcula los bloques siguientes antes
de iniciarlos. El lote 22 es auditoría transversal y puede revisar filas ya
tocadas.

Las columnas `Pend./Parcial/Verif./VO=sí` reflejan el contenido inicial del lote,
no el resultado; se actualizan al cerrar cada lote.

| # | Lote | Filas | Pend./Parcial/Verif./VO=sí | Estado | Notas iniciales |
|---|---|---:|---|---|---|
| 1 | Aceite · Antequera/Nororma/Guadalteba | 29 | 25 / 0 / 4 / 0 | ✅ | Cerrado 2026-07-03: 28 activas (25 `verificado`, 3 `parcial`), 1 merge `aove-tesoro-espanol-campillos` -> `garo-campillos`, 12 `Venta online=sí` con canal. Recategorizadas: Hutesa, El Carrero, Sabores Caseros y Ribera del Genil. |
| 2 | Aceite · Axarquía/Montes orientales | 14 | 11 / 0 / 3 / 1 | ✅ | Cerrado 2026-07-04: 14 activas (13 `verificado`, 1 `parcial`), 9 `Venta online=sí` con canal. Recategorizadas: Hijos de Cordobilla y Tortas Carmen Lupiáñez a `Pan y pastelería`, Lujo del Paladar a `Despensa artesanal`. |
| 3 | Aceite · Guadalhorce/Sierra de las Nieves/Costa | 22 | 22 / 0 / 0 / 0 | ⬜ | Coín, Alhaurín, Cártama, Pizarra, El Burgo, Ardales, Casabermeja, Torremolinos. Resolver `aceite-finca-rosa-alta-malaga` y `lagar-del-chorro-torremolinos`. |
| 4 | Aceite · Serranía de Ronda + capital/flecos | 9 | 9 / 0 / 0 / 0 | ⬜ | Ronda, Montejaque, Benalauría/Benarrabá y Málaga capital; vigilar recategorización de `jamones-y-embutidos-andres-ramos-benarraba`. |
| 5 | Bodega · Ronda y Serranía | 25 | 15 / 1 / 9 / 5 | ⬜ | DOP Sierras de Málaga/Ronda; mucha cuarentena de venta online heredada. Revisar `bodega-ramos-paul-ronda` (`parcial`). |
| 6 | Bodega · Málaga capital + Axarquía | 21 | 17 / 0 / 4 / 1 | ⬜ | Vino Málaga, pasas, vermut, moscatel y destilados posibles. Revisar categoría de `gin-alboran-velez-malaga`, `la-huerta-de-carolina-velez-malaga` y `vermu-krauel-malaga`. |
| 7 | Bodega · Antequera/Mollina/Guadalhorce/Manilva | 15 | 13 / 0 / 2 / 1 | ⬜ | Mollina, Manilva, Cártama, Coín y Norte. Revisar `con-sabor-tradicional-v-gama-la-cruz-de-piedra-coin` y `jamones-alameda-alameda`. |
| 8 | Pan y pastelería · Antequera/Nororma | 20 | 17 / 1 / 2 / 1 | ⬜ | Molletes, mantecados y obradores; revisar `mantecados-la-aguilera-antequera` (`parcial`) y el `sí` de Sancho Melero. |
| 9 | Pan y pastelería · Málaga capital/metropolitana | 17 | 15 / 0 / 2 / 0 | ⬜ | Obradores urbanos, panificadoras y pastelerías; exigir obrador propio y limpiar enlaces o categorías urbanas dudosas. |
| 10 | Pan y pastelería · Axarquía/Guadalhorce/Serranía | 25 | 20 / 0 / 5 / 2 | ⬜ | Panaderías rurales, obradores, Ronda y Coín. Resolver geo-warning de `panaderia-nuestra-senora-de-las-nieves-gaucin`; revisar `encurtidos-almario-ronda`. |
| 11 | Charcutería · Serranía/Genal + Antequera | 15 | 13 / 0 / 2 / 1 | ⬜ | Benaoján, Arriate, Ronda, Genal y Antequera. Foco secadero/obrador vs carnicería; resolver `ibericos-langenal-arriate`. |
| 12 | Charcutería · Málaga/Axarquía/Guadalhorce/Costa | 26 | 25 / 0 / 1 / 0 | ⬜ | Carnicerías y cárnicas de capital, Axarquía, Coín, Cártama, Álora y costa; muchas sin web, no purgar sin contraste fuerte. |
| 13 | Fruta y verdura · Axarquía tropical + costa | 12 | 9 / 0 / 3 / 2 | ⬜ | Aguacate, mango, pasas/fruta tropical y cooperativas. Resolver `tropicado`, `MANCATE`, `S.C.A. San Isidro de El Borge` y posible venta online. |
| 14 | Fruta y verdura · Guadalhorce/Málaga/Ronda/Antequera | 19 | 18 / 0 / 1 / 1 | ⬜ | Huerta, cítricos, berries/frutos secos y geo-warnings: `frutos-secos-esteban-fuengirola`, `nueces-de-ronda-malaga`, `la-huertezuela-alozaina`. |
| 15 | Lácteos y quesos · Antequera/Serranía | 9 | 6 / 0 / 3 / 0 | ⬜ | Queserías de cabra, Norte y Serranía; revisar Cabraline, Rey Cabra, La Arriateña y fuentes sin web. |
| 16 | Lácteos y quesos · Málaga/Axarquía/Guadalhorce/Sierra Nieves | 22 | 18 / 1 / 3 / 0 | ⬜ | Queserías y posibles dulces mal categorizados. Resolver `agasur-s-c-a-el-taraja`, `quesos-sierra-de-las-nieves-alozaina` (`parcial`) y recats. |
| 17 | Despensa artesanal · Axarquía + Málaga | 14 | 14 / 0 / 0 / 0 | ⬜ | Gazpachos, mermeladas, pastas, conservas y despensa urbana; revisar enlaces, categoría y productor real. |
| 18 | Despensa artesanal · Guadalhorce/Serranía/Antequera + Pescado/Helados | 19 | 19 / 0 / 0 / 0 | ⬜ | Despensa de Coín/Antequera/Ronda, 2 pescados y 2 helados. Resolver `gazpacheria-malaguena-pizarra` y riesgo de distribuidor en pescado. |
| 19 | Miel + aromáticas/condimentos | 23 | 12 / 2 / 9 / 5 | ⬜ | Apicultura, miel de caña, mermeladas y aromáticas. Resolver 5 `sí` heredados, `miel-piedra-solana-colmenar` y `miel-la-melifera-mijas` (`parcial`). |
| 20 | Cerveza artesana + Café | 21 | 11 / 1 / 9 / 5 | ⬜ | Fábricas de cerveza, brewpubs y tostadores. Resolver 5 `sí` heredados, `attik-brewing-malaga` (`parcial`) y cafeterías/tostadores. |
| 21 | Aceitunas/encurtidos + Huevos + Chocolate | 28 | 25 / 0 / 3 / 0 | ⬜ | DOP Aloreña, granjas y obradores de chocolate. Revisar `la-artesana-de-la-pasta-malaga` y huevos/granja frente a tienda. |
| 22 | Cierre transversal provincial | 405 | 334 / 6 / 65 / 25 | ⬜ | Dedup, 0 pendientes o residuales documentados, todos los `sí` con canal, evidencia completa para filas activas, imágenes y geo-warnings. |

Reparto por categoría (snapshot inicial, para cuadrar los lotes): Aceite 74
(1-4), Bodega 61 (5-7), Pan y pastelería 62 (8-10), Charcutería 41 (11-12),
Fruta y verdura 31 (13-14), Lácteos y quesos 31 (15-16), Despensa artesanal 29
+ Pescado 2 + Helados 2 (17-18), Miel 19 + Aromáticas y condimentos 4 (19),
Cerveza artesana 13 + Café 8 (20), Aceitunas y encurtidos 11 + Huevos 11 +
Chocolate 6 (21). Total 405.

Reparto actual tras lote 2: Aceite 66, Pan y pastelería 66, Bodega 61,
Charcutería 41, Despensa artesanal 31, Fruta y verdura 31, Lácteos y quesos 31,
Miel 19, Cerveza artesana 13, Aceitunas y encurtidos 12, Huevos 11, Café 8,
Chocolate 6, Aromáticas y condimentos 4, Helados 2, Pescado 2. Total 404.

## Flujo por lote

1. Antes de empezar:

   ```bash
   git status --short
   npx pnpm list:province malaga
   ```

   En Málaga, acota casi siempre con `--categoria` o con `rg` por municipio para
   no abrir rosters enormes.

2. Tomar el primer lote `⬜` de la worklist y congelar sus `slug` antes de
   investigar. Para lotes por categoría, usar el orden actual del CSV dentro de
   esas categorías:

   ```bash
   node --input-type=module - <<'JS'
   import fs from "node:fs";
   import { parse } from "csv-parse/sync";

   const PATH = "data/csv/andalucia/malaga.csv";
   const CATS = new Set(["Aceite"]); // ajustar por lote

   const rows = parse(fs.readFileSync(PATH, "utf8"), {
     columns: true,
     skip_empty_lines: true,
   });

   for (const r of rows.filter((row) => CATS.has(row.categoria))) {
     console.log(
       r.slug, "|", r.verificacion, "| VO=", r["Venta online"],
       "|", r.municipio, "| web=", Boolean(r.web),
       "| ig=", Boolean(r.Instagram), "| maps=", Boolean(r["Google Maps"])
     );
   }
   JS
   ```

3. Priorizar dentro del lote: duplicados/fusiones, no productores, geo-warnings,
   enlaces ajenos o directorios, `Venta online=sí` sin canal, `Venta online=no`
   heredado, `parcial` heredados y pendientes con fuente propia fácil.
4. Investigar hasta evidencia suficiente. Detenerse cuando identidad, actividad
   productora, municipio y venta remota estén decididos; no recopilar opcionales
   que no cambien la decisión.
5. Editar quirúrgicamente el CSV con parser, preservando LF y tocando solo los
   `slug` del lote. Crear `data/evidence/andalucia/malaga.jsonl` en el primer
   lote que cierre decisiones.
6. Añadir o sustituir una línea JSONL para cada fila con alta de evidencia,
   cambio de `verificacion`, cambio de `Venta online`, canal, purga o fusión. Para
   una fila `verificado`, la evidencia debe sostener `identity`,
   `producer-activity` y `municipality`, no solo `online-sales`.
7. Validar durante la iteración:

   ```bash
   npx pnpm check:csv:changed
   npx pnpm check:evidence:changed
   git diff --check
   ```

8. Al cerrar un lote o un bloque de lotes:

   ```bash
   npx pnpm verify:data
   ```

9. Actualizar este ledger: snapshot si cambia, estado del lote, fecha y nota corta
   con verificadas, parciales, purgas/fusiones, ventas resueltas y residuales.

## Criterios de cierre de la pasada

- 0 filas `pendiente`, salvo razón explícita documentada para pausar.
- Cada residual `parcial` tiene motivo conocido y evidencia JSONL coherente.
- Cada fila activa tiene evidencia `keep`; cada purga/fusión tiene registro
  `purge`/`merge`.
- Cada `Venta online=sí` tiene `Canal de venta` y evidencia de pedido remoto
  vigente; no queda ningún `sí` heredado sin canal.
- Los 40 `Venta online=no` heredados quedan confirmados con evidencia o corregidos
  a `no comprobado`/`sí` según corresponda.
- No quedan enlaces ajenos, dominios aparcados, fichas Maps genéricas como prueba
  fuerte ni horarios que remitan a canales inexistentes.
- No quedan duplicados aparentes sin decisión explícita; sin colisiones
  geográficas por homónimo o municipio incorrecto sin resolver.
- Las imágenes se revisan solo tras estabilizar identidad y `slug`; al purgar una
  fila con `imagen`, se elimina el archivo referenciado si no lo usa otra fila.
- `npx pnpm verify:data` pasa antes de cerrar cada lote y antes del cierre
  provincial.
- Cuando las 405 filas iniciales queden cerradas, añadir `andalucia/malaga` a
  `data/evidence/coverage.json` en el mismo cambio que complete la evidencia
  provincial, si se decide marcar cobertura completa.

## Decisiones que deben quedar especialmente anotadas

- Alcance Km0 de bodegas grandes, pasas, vermut, destilados o marcas compartidas:
  por qué entra cada unidad productiva o por qué se recategoriza/purga.
- Promociones de directorios, registros, DOP/IGP, ferias o premios a
  `verificado`: qué fuente propia o ficha individual supera el techo de `parcial`.
- Cualquier productor sin web propia que quede `verificado`: fuente concreta y
  motivo.
- Almazaras, cooperativas y SAT: por qué entran como productor/elaborador local o
  por qué se tratan como comercializadora/exportador.
- Obradores vs despachos, cafeterías, restaurantes, heladerías o tiendas.
- Carnicerías y charcuterías: evidencia de elaboración propia/secadero/obrador.
- Cambios de `Venta online`, especialmente `sí` heredado sin canal y `no`
  heredado sin revisión actual.
- Purgas por no productor, cierre, duplicado, otra provincia o entidad sin rastro
  suficiente.
- Correcciones de municipio, geo-warnings aceptados y cualquier override de
  centroide creado para homónimos.
