# Candidatos — Barcelona (pasada «flujo 2026»)

> Fichero creado el 2026-07-14 como ledger de la **pasada de ampliación por
> flujo** de Barcelona. El catálogo BCN está maduro (2.491 filas, 1ª pasada de
> verificación completa, ~80% dedup en barridos genéricos), así que esta pasada
> NO barre registros-foto-fija: busca el **flujo** (productores nacidos
> 2024-2026 y deltas de fuentes vivas) y se blinda contra re-evaluar
> descartados. Formato estándar de `docs/candidates/README.md`.
> **Aviso de coordinación**: solo esta pasada escribe aquí; añadir secciones
> nuevas sin tocar las anteriores.

## Protocolo por sesión

1. Abrir la tabla «Estado de lotes» y coger el primer lote `pendiente` (o
   continuar el `en curso`). Respetar el GO/NO-GO tras el lote 1.
2. Descubrir candidatos de la fuente del lote y pasarlos por el **triple
   filtro**, en este orden: (a) sección «Descartados — no re-evaluar» de este
   fichero, (b) dedup contra `data/csv/catalunya/barcelona.csv` (dominio +
   teléfono normalizado + marca Y razón social con acentos plegados y guarda
   de categoría), (c) gate de encaje (abajo).
3. Anotar cada candidato en su sección de lote con estado
   (`unverified`/`accepted`/`rejected`/`already-present`), fuente y motivo.
4. Verificar 1-a-1 e integrar según el flujo del README (evidencia JSONL,
   `check:csv:changed` iterando, `verify:data` al cerrar; si `npx` falla,
   scripts directos con `bash`/`node`).
5. Actualizar la tabla de estado + Bitácora, y la memoria de sesión si cambia
   el estado global de la pasada.

## Reglas fijas de la pasada

- **Gate de encaje**: productor real con marca propia (dominio que redirige al
  grupo = etiqueta del grupo → fuera); no maquila ni grupo industrial/masa; no
  distribuidor/retail puro; provincia y municipio según **su propia web**, no
  el registro/fuente. Además, por ser pasada de recientes: **señal de
  actividad viva** ≤ 6 meses (post, reseña, venta) — sin ella, no alta.
- **`verificado` vs `parcial`**: `verificado` exige fuente viva leída en vivo
  que confirme identidad + actividad + municipio; web propia caída/SPA sin
  render → tope `parcial`. Solo-fuente-secundaria → `parcial`.
- **`Venta online=sí`** solo con checkout propio (o del grupo matriz de
  calidad) visto en vivo; marketplaces de terceros → `no comprobado`.
- **Regla de parada por veta**: si una fuente rinde < ~1 alta por cada 5-6
  candidatos revisados de forma sostenida, cerrar el lote con
  `descartado (yield)` y pasar al siguiente.
- **Trazabilidad**: anotar la fuente en cada alta (columna «Fuente» de la
  bitácora) para aprender qué veta rinde en Barcelona.
- **Snapshots (frente B)**: al cruzar una fuente viva, guardar el listado
  crudo (nombre·municipio·web) en `docs/candidates/barcelona-snapshot-[fuente].md`
  para que la siguiente pasada sea un diff, no un re-triaje.

## Estado de lotes

Frentes: **0** blindaje · **A** nacidos 2024-2026 (eje temporal explícito) ·
**B** fuentes vivas por deltas.

| Lote | Frente | Fuente / alcance | Tamaño est. | Estado | Revisados | Altas |
|---|---|---|---|---|---:|---:|
| 0 | 0 | Reconstruir descartes históricos desde git (`529e83b`, `d58771d`, pasada atípicos) + purgas de `docs/verificacion/barcelona.md` → rellenar «Descartados — no re-evaluar» | — | ✅ 2026-07-14 | 618 slugs + 12 pre-CSV | — |
| 1 | A | **Cata de rendimiento**: muestra Benvinguts a Pagès 2026 (prov. BCN) + prensa comarcal 2025-26 (Regió7, El 9 Nou) | ~20 sonda | ✅ 2026-07-14 | 31 netos (52 fichas) | 5 + 1 mejora |
| — | — | **GO/NO-GO**: si el lote 1 rinde ≥ ~1 alta/5-6 revisados, seguir con 2-7; si no, saltar al frente B | — | **GO matizado (2026-07-14)**: 5+1/31 ≈ umbral justo → seguir con 3-6; lote 2 reducido a residual; lote 7 NO-GO (prensa no indexa) | — | — |
| 2 | A | Benvinguts a Pagès 2026 completo, prov. BCN por comarcas (priorizar Berguedà, Moianès/Lluçanès, Anoia rural) | ~30-50 | pendiente | | |
| 3 | A | Cerveseras: Barcelona Beer Challenge 2025/26 (medallistas nuevos) + GECAN altas recientes | ~15-25 | ✅ 2026-07-15 — veta saturada | ~10 netos | 1 |
| 4 | A | Vino: Premis Vinari 2025/26 + vino natural (Vella Terra y ferias afines) — debutantes DO Alella / Pla de Bages / Penedès | ~15-25 | pendiente | | |
| 5 | A | Formatgeries: Lactium (Vic) ediciones 2025/26 + Millor Formatge Català | ~10-20 | pendiente | | |
| 6 | A | Verkami: campañas de alimentación 2024-26 en prov. BCN (obradores, cerveseras, formatgeries) | ~10-20 | pendiente | | |
| 7 | A | Prensa comarcal, barrido sistemático por cabecera («obre obrador», «nova formatgeria», «celler nou»… 2025-26): Regió7, El 9 Nou, Nació Digital comarcal, Tot locals, VIA Empresa | ~20-40 | pendiente (condicionado a yield 1-6) | | |
| 8 | A | BORME constituciones 2025-26 CNAE alimentario prov. BCN — red de arrastre, ruidosa | ~30+ brutos | opcional | | |
| 9 | B | Gastroteca.cat: cruce contra CSV + snapshot | ~40 brutos | pendiente | | |
| 10 | B | Xarxa Productes de la Terra (Diputació BCN): cruce + snapshot | ~40 brutos | pendiente | | |
| 11 | B | Mercats de pagès municipals + Slow Food Mercat de la Terra BCN: cruce + snapshot | ~20-30 | pendiente | | |
| 12 | B | CCPAE prov. BCN: si publica fecha de alta, solo altas 2024-26; si no, snapshot para deltas futuros | ~20-40 | pendiente | | |

Colas finas donde priorizar dentro de cada lote (huecos del catálogo actual):
Conservas (7), Frutos secos (9), Aromáticas (9), Harinas (3), Aceitunas y
encurtidos (2), Hidromiel (1), Licores (11), Miel (23), Aceite (28), Pescado
(27, confradías Maresme/Garraf) y tipos emergentes (vino natural,
microdestilerías, espirulina). **Evitar** Pan/Charcutería/Fruta genéricos: el
dedup se come el esfuerzo.

## Descartados — no re-evaluar

> Rellenado en el lote 0 (2026-07-14, git archaeology). Cada entrada: nombre ·
> municipio · motivo del descarte · commit/fuente donde se decidió. Los
> descartes nuevos de esta pasada se añaden aquí también, para que las sesiones
> futuras no los re-pesquen.

**Filas que salieron del CSV (618)** → snapshot completo en
[`barcelona-snapshot-descartados-git.md`](barcelona-snapshot-descartados-git.md)
(purgas de la verificación ~490 + dedup 119 pares `309dffd` + fusiones y
renombres). El filtro (a) del protocolo = grep del candidato **en ese snapshot
y en las tablas de abajo**. Hit en el snapshot → mirar el motivo con
`git show <commit>` antes de decidir: fusión/renombre = ya está (lo confirma el
dedup (b)); «sin rastro en 2026-06» + fuente viva nueva = reconsiderable,
anotándolo aquí.

**Descartes que nunca entraron al CSV** (no aparecen en el snapshot):

| nombre | municipio real | motivo | fuente |
|---|---|---|---|
| Destilerías MG / Gin Mare | Vilanova i la Geltrú | industrial multinacional (Brown-Forman, ~100 empleados) — exclusión editorial no-km0 | pasada atípicos 2026-06-24 (commits `4e4c5bb`/`613a92d`) |
| Vermut Berichó (Bardinet) | — | solo reventa de terceros, sin elaboración con presencia propia | pasada atípicos 2026-06-24 |
| Kombutxa | Mataró | no es marca distinta: producto de Mūn Ferments, ya en CSV (`mun-kombucha-mun-ferments-sl-mataro`) | pasada atípicos 2026-06-24 |
| Yamaaoi (wasabi) · Castanya de Viladrau | Viladrau = **Girona** | fuera de provincia | pasada atípicos 2026-06-24 |
| Kenshô (sake) | Delta de l'Ebre = **Tarragona** | fuera de provincia | pasada atípicos 2026-06-24 |
| Joan Grill (vins) | Aiguamúrcia/Pla de Manlleu = **Tarragona** | fuera de provincia (aunque vinifique en el Viver de Vilafranca) | pasada atípicos 2026-06-24 |
| Escatafood (garum) · SOLÉS (anxoves) | L'Escala/Empordà = **Girona** | fuera de provincia | pasada atípicos 2026-06-24 |
| Safrà del Montsec · Caviar Nacarii · harinas de cereal antiguo | Montsec/Vall d'Aran/Garrigues = **Lleida** | fuera de provincia | pasada atípicos 2026-06-24 |
| Hofmann — centro Badalona | Badalona | infraestructura de producción/I+D, no fila nueva: la marca ya está (`pastisseria-hofmann-barcelona-ciutat-vella`) | nota candidatos 2026-06-05 (`529e83b`) |
| Parallelo Gelato — Time Out Market | Barcelona | punto de venta, no productor nuevo: ya está (`parallelo-gelato-barcelona-gracia`) | nota candidatos 2026-06-05 (`529e83b`) |

**Alias «ya estaba» que el cruce automático NO caza** (falsos negativos por
nombre corto/slug pegado — no re-añadir):

| nombre en fuentes | fila existente | nota | fuente |
|---|---|---|---|
| «Roca» / AT Roca | `at-roca-pacs-del-penedes` | municipio real Avinyonet del Penedès (slug hereda Pacs); reubicada en lote 89 de verificación | nota Rutes del Vi (`d58771d`) |
| Celler Sant Miquel d'Oló | `celler-sant-miquel-dolo-santa-maria-dolo` | — | nota Rutes del Vi (`d58771d`) |

**Descartes del lote 1 (2026-07-14, fuente: directorio BAP tot-l'any):**

| nombre | municipio | motivo |
|---|---|---|
| Cal Joanet | Vilafranca del Penedès | restaurante |
| Can Xarina | Collsuspina | restaurante |
| Cal Ticus | Sant Sadurní d'Anoia | restaurante (cuina de mercat amb productes propis, però punt de consum) |
| Can Candelich | Cànoves i Samalús | restaurante |
| El Cigró d'Or | Vilafranca del Penedès | restaurante (guia Michelin, Mercat de la Carn) — el nom enganya, no és obrador de llegums |
| El Rebost de la Torre / L'Era d'Estiu | Sallent | restaurant del grup La Torre; la granja ja está (`granja-torre-den-roca-la-torre-sallent`) |
| Bacasis, DeVici, La Forkilla, Bar Sport, Cafè del Mig, Taverna1913, La Taverna del Ciri, Marisqueria La Flor, Il Piatto, ClubHouse27, Menjab | varios | restaurantes/bares del directorio BAP (no revisados 1-a-1: fuera por tipo) |
| Bolet Casa Modernista | Castellví de la Marca | hotel rural de la família Bolet; la marca celler ja está (`caves-bolet-mas-lluet-…`) |
| Cal Grau de la Llavinera | Sant Pere Sallavinera | turisme rural |
| Cal Cabreta | Cardona | casa rural |
| Els Plans de Cornet | Sallent | allotjament (avaibook) |
| Ca l'Estamenya | Perafita | allotjament |
| Baluard de Ferreres · Volta de Ferreres | Olvan | casa de turisme rural |
| Cal Cisteller | Olvan | casa rural |
| Casanova de Noet | Avià | casa de camp (lloguer 15 pers.) |
| Les Feixes de Coaner | Sant Mateu de Bages | masia turística (1595) |
| El Teixell | Olost | casa rural (les formatges del voltant són de Garduixeres, ja valorada en verificación) |
| Can Passerells | Sant Vicenç de Torelló | lloguer rural |
| Mas la Casavella | Les Masies de Voltregà | turisme rural |
| Les Corts de Biosca (Biosca i el Mas) | Sant Mateu de Bages (Castelltallat) | turisme rural |
| Villa Maria | Santa Maria de Palautordera | allotjament Montseny |
| Ca la Julita | Castellbell i el Vilar | enoturisme/turisme rural (≠ Cervesa La Julita de St. Quirze, ja en CSV) |
| Mas Postius | Muntanyola | turisme rural i ramader, sense producte de marca pròpia visible |
| Cal Negri | Vilafranca del Penedès | apartaments turístics (el nom és pel gat dels amos) |
| El Molí de la Barita | Viladrau = **Girona** | fuera de provincia |
| Red Passion Berries (gerds) | Viladrau = **Girona** | fuera de provincia |

**Descartes del lote 3 (2026-07-15, cerveseras BBC/GECAN):**

| nombre | municipio | motivo |
|---|---|---|
| Edge Brewing | Barcelona (Poblenou) | **cerrada** (vendida 2020, Foursquare «Now Closed», dominio muerto) |
| As Cervesa Artesana | Vilanova del Vallès (zona) | ascervesa.com **secuestrada** (blog spam de viajes); sin señal viva |
| Celler de Cervesa Artesana HOPe | Sant Sadurní d'Anoia (zona) | cervesahope.com **secuestrada** (tienda electrónica china); sin señal viva |
| l'Estupenda / El Brètol | Sant Cugat del Vallès | dominio lestupenda.com aparcado (DonDominio); sin señal viva — reconsiderable con señal |
| Ausesken | Sta. Eulàlia de Riuprimer (Osona) | DNS muerto, sin rastro 2025-26 — reconsiderable con señal |
| BlackLab Brewhouse | Barcelona (Barceloneta) | cerrada (SL en liquidación, Time Out «cerrado», web vacía) pese a medallas BBC 2025 |
| Cerveseras BBC 25/26 fuera de provincia | — | Attik=Málaga · Kosmonauta=Cantabria · La Spontanerie=Francia · GRO Brewers=Girona · Cervesa Minera=St. Joan de les Abadesses (Girona) · Marina=Blanes · La Calavera=St. Joan Abadesses · Popaire=Blanes · Moska/Poch's/La Selvaseria=Girona · El Gall Negre y Ctretze y Lo Vilot y Casa Dalmases y Noguera y Lo Perot y La Vella Caravana=Lleida · Les Clandestines/La Gardenia/La Mula/L'Anjub/Redhop Salomó=Tarragona · Trulla=Nuoro (IT) · Radiocraft=Roma (IT) · Fresh Beer 30 Km=Shanghái · La Cànibal=Madrid (prior, sin verificar) · Badalà/Hopsters/Qubeer=no localizadas (probable IT/extranjero) |

Contexto útil: los 7 candidatos de la nota de junio (Vibra, Fonik, MCava, A27,
Holy Madre, Hijos de Nata, Baluard El Magatzem) acabaron **todos integrados** —
de las notas históricas de candidatos no queda nada pendiente ni descartado.
Huecos que la pasada atípicos no pudo llenar con productor BCN de marca propia
(no insistir sin señal nueva): castaña, azafrán, trufa/setas frescas
(producción mayorista anónima vía Mercabarna).

## Candidatos por lote

### Lote 1 — cata de rendimiento (2026-07-14) ✅

Fuente A: directorio tot-l'any de `benvingutsapages.cat` (773 fichas, 249 en
comarcas de la prov. BCN, 195 con pinta de productor tras filtrar
restaurantes/alojamiento por slug; 52 fichas bajadas y trabajadas). Fuente B:
prensa comarcal vía buscador — **0 resultados útiles en 3 búsquedas** (Regió7 y
El 9 Nou apenas indexan; requeriría navegación cabecera a cabecera).

**Altas (5):**

| candidato | slug | verif | VO | nota |
|---|---|---|---|---|
| Mels de Can Monràs Nou (Sta. Eulàlia de Ronçana) | `mels-de-can-monras-nou-santa-eulalia-de-roncana` | verificado | no comprobado | ~400 arnes transhumants, premis mel de romaní/Millor Mel Catalana 2023; web viva, tenda sense carret confirmat |
| Mas Palou (El Pla del Penedès) | `mas-palou-el-pla-del-penedes` | verificado | sí/ecommerce | celler masia medieval, vins ancestrals eco 2024 + oli; shop.maspalou.com checkout viu |
| Granja Guirigall (El Pla del Penedès) | `granja-guirigall-el-pla-del-penedes` | parcial | no comprobado | IGP Raça Penedesenca des de 2006; granjaguirigall.com DNS caigut el 2026-07-14 (no morta: indexada amb botiga) — recomprobar |
| Biomasia Ca n'Oliveró (Castellbisbal) | `biomasia-ca-nolivero-castellbisbal` | parcial | no comprobado | 20 ha eco des de 2000 (Pere Botifoll), cistelles; sense web pròpia (FB) |
| Maset de la Costa (Piera) | `maset-de-la-costa-piera` | parcial | no comprobado | agroturisme + oli marca pròpia L'Oli del Maset (eco CCPAE); activitat oleícola sense datació fresca |

**Mejora (1):** fila-registro `calderon-cabrera-jose-armando-…` renombrada a
**MielHada** (`mielhada-barcelona-horta-guinardo`): marca del apicultor (+300
arnes, mateixa adreça/email), botiga WooCommerce vista en viu → verificado,
VO sí/ecommerce; GMaps aliè «Escalope Armando» blanquejat; coords Nominatim.

**Ya estaban (dedup, 16):** Formatges de Lluçà · El Jardí dels Sentits · Granja
Torre d'en Roca · Horta Can Calafell · La Mel de l'Avi Joan · La Vaqueria
d'Osona · Les Cabres d'en Peyu · Formatgeria La Frasera · Mel dels Erms · Oli
la Xerona · Ca n'Aleix de la Madrona · Mas Buret · estapé1920 (=Hort de
Proximitat SLU) · Bodegues Sumarroca · Covides · Caves Bolet (via el hotel
Bolet Casa Modernista).

**Rechazos de gate (25)** → añadidos a «Descartados» (restaurantes 7 ·
alojamiento/turisme rural 16 · fuera de provincia 2, ver tabla).

**Residual del directorio BAP (queda para un lote 2 recortado):** fichas con
layout distinto que fallaron el parseo (Can Talamàs, Ca la Tona, Ca l'Ignasi,
Farmlab Rupit, Vicissim S.A., Cal Miguelon, 9Cèntric) + cola Alt Penedès no
revisada (Cal Pere del Maset, Can Batlle, Mirador de les Caves, El Celler de
l'Ordal, Sant Jordi Ca la Katy, La Posada, Menjab Igualada) + J&M Pagesos
(horta genérica; tel compartit amb Cal Mexica/Espai Agrari Baixa Tordera —
possible dup, cola a evitar).

**Yield: 5 altas + 1 mejora / 31 candidatos netos revisados ≈ 1 alta per 5-6 →
GO justo en el umbral**, con matices: la veta BAP es de una sola pasada (ya
casi agotada aquí) y la prensa por buscador rinde 0. Decisión: **GO hacia los
lotes 3-6** (fuentes de eventos/premios, indexables); lote 2 queda reducido al
residual de arriba; **lote 7 (prensa sistemática) NO-GO** salvo navegación
directa de cabeceras.

### Lote 3 — cerveseras BBC + GECAN (2026-07-15) ✅

Fuentes: PDFs oficiales de premiados del Barcelona Beer Challenge
([2026](https://barcelonabeerchallenge.com/wp-content/uploads/2026/04/Premiados-Web-2026.pdf),
[2025](https://factoriadecerveza.com/wp-content/uploads/2025/04/Medallas-Barcelona-Beer-Challenge-2025.pdf))
+ mapa de socios GECAN (KML del MyMaps embebido en gecan.info, 37 socios).

**Resultado clave: la veta cervecera BCN está saturada.** Los ~11 medallistas
BBC 25/26 de la provincia ya estaban TODOS en el CSV (Maresme Brewery, Dehum,
La Barberenca, La Cervesera Artesana, La Pirata, Bierboi, Espiga, Montseny,
Reptilian, Almogàver, Els Minairons). El flujo nuevo del BBC (rookies) es de
fuera: Kosmonauta=Cantabria, La Spontanerie=Francia, Attik=Málaga. Y del mapa
GECAN (desactualizado, ~2019-21), de 10 socios BCN no presentes en el CSV,
la mayoría están muertos.

**Alta (1):** Cervesa Cornèlia (Cornellà de Llobregat) —
`cervesa-cornelia-cornella-de-llobregat`, parcial, VO no comprobado. Coop SCCL
de 2014, socia GECAN (instalación propia), check-ins Untappd dic-25/ene-26;
sin web propia.

**Ya estaban (2):** Malta 51 SL = Bertus (Rubí) · +Malta = Mas Malta (Sta.
Perpètua).

**Diferidos (residual, comprobar IG/in situ antes de alta):** Vic Brew (Vic;
vicbrew.com indexada con botiga pero conexión rechazada desde aquí, sin señal
fresca legible) · Societat Cervesera Artesenca (Artés; web = shell JS sin
contenido, Untappd hasta 2025) · ART Cervesers (Canovelles, Can Partegàs; web
viva con WooCommerce pero sitemap congelado desde 2022-04, tel +34619941582).

**Rechazos (a Descartados):** Edge Brewing (cerrada), As Cervesa, HOPe,
l'Estupenda/El Brètol, Ausesken (ver tabla).

**Yield: 1 alta / ~10 netos revisados → por debajo del umbral.** La cola
cervecera se cierra; los diferidos quedan como residual barato.

## Bitácora

| Fecha | Lote | Sesión/agente | Resultado |
|---|---|---|---|
| 2026-07-14 | — | Claude (planificación) | Creado el ledger; pasada definida en 3 frentes y 13 lotes; pendiente lote 0 |
| 2026-07-15 | 3 | Claude | ✅ Lote 3 cerrado: BBC 25/26 (PDFs oficiales) + mapa GECAN → **1 alta** (Cervesa Cornèlia, parcial) sobre ~10 netos; los 11 medallistas BBC de la provincia ya estaban; mapa GECAN desactualizado (Edge cerrada, As/HOPe secuestradas, Estupenda aparcada, Ausesken muerta); 3 diferidos (Vic Brew, Artesenca, ART Cervesers). CSV 2496→2497, gates verdes. **Veta cervecera cerrada → siguiente: lote 4 (Vinari + vino natural)** |
| 2026-07-14 | 1 | Claude | ✅ Lote 1 (cata) cerrado: 52 fichas BAP prov. BCN trabajadas → **5 altas** (Mels de Can Monràs Nou verif, Mas Palou verif VO=sí, Granja Guirigall parcial, Biomasia Ca n'Oliveró parcial, Maset de la Costa parcial) **+ 1 mejora** (fila registro → MielHada, verif VO=sí) + 16 ya estaban + 25 rechazos (a Descartados). Prensa comarcal vía buscador: 0/3 búsquedas → lote 7 NO-GO. CSV 2491→2496; evidencia 7 registros; gates verdes (csv/images/evidence OK). **GO matizado → siguiente: lote 3 (cerveseras BBC/GECAN)** |
| 2026-07-14 | 0 | Claude | ✅ Lote 0 cerrado. Arqueología de los 220 commits del CSV → **618 slugs salidos** volcados a `barcelona-snapshot-descartados-git.md` (purgas verificación ~490 + dedup 119 pares + fusiones/renombres). Sección «Descartados» rellenada: 10 descartes pre-CSV de la pasada atípicos + 2 «no añadir fila» de la nota de junio (Hofmann Badalona, Parallelo TOM) + 2 alias «ya estaba» de Rutes del Vi (AT Roca, Sant Miquel d'Oló). Los 7 candidatos de junio 2026 acabaron todos integrados. Siguiente: **lote 1** (cata de rendimiento, GO/NO-GO) |
