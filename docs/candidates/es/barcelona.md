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
   fichero, (b) dedup contra `data/csv/es/catalunya/barcelona.csv` (dominio +
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
| 0 | 0 | Reconstruir descartes históricos desde git (`529e83b`, `d58771d`, pasada atípicos) + purgas de `docs/verificacion/es/barcelona.md` → rellenar «Descartados — no re-evaluar» | — | ✅ 2026-07-14 | 618 slugs + 12 pre-CSV | — |
| 1 | A | **Cata de rendimiento**: muestra Benvinguts a Pagès 2026 (prov. BCN) + prensa comarcal 2025-26 (Regió7, El 9 Nou) | ~20 sonda | ✅ 2026-07-14 | 31 netos (52 fichas) | 5 + 1 mejora |
| — | — | **GO/NO-GO**: si el lote 1 rinde ≥ ~1 alta/5-6 revisados, seguir con 2-7; si no, saltar al frente B | — | **GO matizado (2026-07-14)**: 5+1/31 ≈ umbral justo → seguir con 3-6; lote 2 reducido a residual; lote 7 NO-GO (prensa no indexa) | — | — |
| 2 | A | Benvinguts a Pagès 2026 completo, prov. BCN por comarcas (priorizar Berguedà, Moianès/Lluçanès, Anoia rural) | ~30-50 | pendiente | | |
| 3 | A | Cerveseras: Barcelona Beer Challenge 2025/26 (medallistas nuevos) + GECAN altas recientes | ~15-25 | ✅ 2026-07-15 — veta saturada | ~10 netos | 1 |
| 4 | A | Vino: Premis Vinari 2025/26 + vino natural (Vella Terra y ferias afines) — debutantes DO Alella / Pla de Bages / Penedès | ~15-25 | ✅ 2026-07-15 — veta fértil | ~17 netos | 10 |
| 5 | A | Formatgeries: Lactium (Vic) ediciones 2025/26 + Millor Formatge Català | ~10-20 | ✅ 2026-07-15 — veta saturada | 19 | 0 + 2 mejoras |
| 6 | A | Verkami: campañas de alimentación 2024-26 en prov. BCN (obradores, cerveseras, formatgeries) | ~10-20 | ✅ 2026-07-15 | ~9 netos (144 crawl) | 1 |
| 7 | A | Prensa comarcal, barrido sistemático por cabecera («obre obrador», «nova formatgeria», «celler nou»… 2025-26): Regió7, El 9 Nou, Nació Digital comarcal, Tot locals, VIA Empresa | ~20-40 | pendiente (condicionado a yield 1-6) | | |
| 8 | A | BORME constituciones 2025-26 CNAE alimentario prov. BCN — red de arrastre, ruidosa | ~30+ brutos | opcional | | |
| 9 | B | Gastroteca.cat: cruce contra CSV + snapshot | ~40 brutos | ✅ 2026-07-16 — snapshot guardado | 435 fichas BCN (152 netas) | 8 |
| 10 | B | Xarxa Productes de la Terra (Diputació BCN): cruce + snapshot | ~40 brutos | ✅ 2026-07-16 — snapshot guardado | 1.327 fichas (321 netas) | 3 |
| 11 | B | Mercats de pagès municipals + Slow Food Mercat de la Terra BCN: cruce + snapshot | ~20-30 | ✅ 2026-07-16 — snapshot guardado | 50 mdp + 23 SF | 2 |
| 12 | B | CCPAE prov. BCN: si publica fecha de alta, solo altas 2024-26; si no, snapshot para deltas futuros | ~20-40 | ✅ 2026-07-16 — snapshot/delta-base | 5.085 total (sonda Berguedà 63) | 0 |
| 13 | R | **Residual — lote de vino dirigido**: bloque de cellers/cavas del Penedès/Alella/Bages en los snapshots XPT+Gastroteca sin integrar | ~30 brutos | ✅ 2026-07-16 | 23 netos | 23 |
| 14 | R | **Residual — flecos**: diferidos de las shortlists de los lotes 3 y 9 (cerveceras, marcas sueltas) | ~12 | ✅ 2026-07-16 — cierra la pasada | 12 | 1 |

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
**Descartes del lote 4 (2026-07-15, vino Vinari/Vella Terra):**

| nombre | municipio | motivo |
|---|---|---|
| Bardinet Wines (Lacrima Baccus) | — | grupo licorero (Bardinet); etiqueta del grupo — coherente con el descarte de Vermut Berichó |
| Cava Reverté | Salomó = **Tarragona** | fuera de provincia |
| Aida i Luis Vinyaters | Xaló = **Alicante** | fuera de provincia |
| Cellers Vinari fuera de provincia | — | Freixa Rigau=Girona · Carles Andreu/Vinícola del Sarral/Cellers Domenys/Castell del Remei etc.=Tarragona/Lleida · Grup Freixenet=grupo industrial (Segura Viudas ya está como fila propia) |

**Descartes del lote 6 (2026-07-15, Verkami):**

| nombre | municipio | motivo |
|---|---|---|
| Vermutiquín | Barcelona | pack-regalo de vermut «cachondo» sin elaboración propia identificable |
| Cardinale | Gironella | cafè-obrador de dolços i pans (campaña 2025 para equipar cocina) — cola Pan genérico a evitar |
| Salvem la Nova Farga | Barcelona | campaña de rescate (2026) de un negocio sin identidad de productor localizable — probable punt de consum |

**Descartes/residuals del lote 9 (2026-07-16, Gastroteca.cat):**

| nombre | municipio | motivo |
|---|---|---|
| Successors de J. Pont | Balenyà | charcutería **industrial** (planta 15.000 m², export a 17+ países, sin checkout) → gate fuera |
| Mel de Montserrat | Olivella | la web `campomiel.com` es de un apicultor de **La Rioja** (Ventosa); identidad/municipio no cuadran → sin verificar |
| Abellaires d'Osona / La Casa de les Abelles | Sant Pere de Torelló | centro **educativo** apícola; marca/tienda de miel propia no confirmada → residual |
| AS Cervesa, Foscka Ratafia, Fontferri, Can Tortós, Cal Penyasco, Red Passion Berries, Cal Mexicà | varios | ya en «Descartados» de lotes previos/verificación (el filtro (a) los cazó) |

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

### Lote 4 — vino: Premis Vinari 2025 + Vella Terra 2026 (2026-07-15) ✅

Fuentes: [catálogo oficial de guardonats Vinari 2025](https://www.premisvinari.cat/wp-content/uploads/2025/10/Cataleg-2025.pdf)
(13a ed., ~46 cellers) + expositores catalanes de [Vella Terra 2026](https://vellaterra.com/en/artisans/)
(11a ed., feb-2026, 82 bodegas — la participación es señal de actividad fresca).
La edición Vinari 2026 será en otoño (no existe aún).

**La veta del vino aún da**, al contrario que la cervecera: el catálogo BCN
tenía 240 bodegas pero los premiados «de segunda línea» del cava y el vi
natural de ferias seguían fuera.

**Altas (10):** Caves Rimarts (SSd'A, verif) · Canals Nadal (El Pla, verif,
**VO=sí**) · Can Lleó de Vilanoveta (St. Martí Sarroca, verif; Or Vinari +
Vella Terra) · Castell d'Or (Vilafranca, verif, **VO=sí**; coop 2º grado con
marca y botiga → regla Campo de Montiel) · Família Ferrer–Can Sala (St. Quintí
de Mediona, verif; celler de terroir del grupo → regla Valcarlos/Faustino) ·
Bodegues Ametller Civill (St. Martí Sarroca, verif; ¡NO es el grupo retail
Ametller Origen!) · Robert J. Mur/Cellers Most Doré (SSd'A, parcial; webs
caídas) · Ton Rimbau–Porcellànic (Vilobí, verif; vino natural radical) ·
Raïmones (Olèrdola, parcial; **fundado 2021**, nueva generación Mas
Candí/La Salada/RR Sadurní) · Mas Guineu Vinyaters (Torrelles de Foix, verif;
**primeras vinificaciones 2021**).

**Ya estaban (dedup, ~30):** todos los grandes nombres Vinari de la provincia
(Vallformosa, Sumarroca, U més U, Llopart, Albet i Noya, Sabaté i Coca, Giró
Ribot, Rovellats, Oriol Rossell, Maria Rigol Ordi, Canals i Munné, Jaume Giró
i Giró, Miquel Pons, Alsina Sardà, Blancher, Vilarnau, Roger Goulart, Ramon
Canals, Jovani Vins, Aymar, Fargas Fargas, Can Serra dels Exibis, Cellers
Maset, Finca Viladellops, Mas Bertran, Planas Albareda, Júlia Bernet, Celler
Viader, Vins El Cep, Segura Pujadas, Covides…) + de Vella Terra: Castell
d'Age, Loxarel, Mas Candí, El Jardí dels Sentits, Can Lleó.

**Residual (localizar en un lote futuro):** Nini Vins, Celler Sanromà,
Pinyolet Vinyaters, Cas Quitxero (expositores Vella Terra sin localizar —
posible fuera de provincia).

**Yield: 10 altas / ~17 netos revisados → muy por encima del umbral.**

### Lote 5 — formatgeries: Lactium 2026 + concurso (2026-07-15) ✅

Fuentes: [expositores de Lactium 2026](https://vicfires.cat/lactium-la-festa-del-formatge-catala-2026/expositors)
(Vic, 18-19 abr 2026 — la ficha de cada expositor trae dirección+CP+municipio;
35 formatgeries, 19 de la prov. BCN por CP 08xxx) + [palmarés del Concurs
Lactium 2026](https://www.3cat.cat/3catinfo/el-ninot-de-sant-gil-dalbio-millor-formatge-artesa-2026-consultan-la-llista-completa/noticia/3405230/)
(Millor Formatge Català 2026 = Sant Gil d'Albió, **Tarragona**).

**Resultado: veta láctea saturada — 0 altas.** Los 19 expositores BCN y los
premiados del concurso (Cal Músic ×3 ors, Granja Armengol, Làctics Pauet,
Làctics Ubach, Jon Cake) están **todos** ya en el CSV (100 filas de Lácteos;
la pasada Lácteos/Quesos de 10 provincias del 2026-07-04 ya había minado
esto) o en el blindaje (El Quall = obrador comunitario purgado en lote 119
de verificación — el filtro (a) funcionó). Dedup fino resolvió además:
Anna Puig Ramirez = La Petita Ànima (por teléfono) · El Xebec del Collsacabra
SL = razón social de Formatges Riudavets (tel 699650273 en su web) ·
Ubach Formatgers SLU = Làctics Ubach.

**Mejoras (2):**
1. **Fusión Masia Fontirons**: `cabanas-llorens-jordi-espunyola` era dup
   registre↔marca de `masia-fontirons-lespunyola` (mismo tel y web) — purgada
   la de registro (+ webp), merge en evidencia.
2. **Slug Riudavets corregido**: `formatges-riudavets-sora` →
   `formatges-riudavets-lesquirol` (municipio ya decía l'Esquirol; CP 08511
   de la ficha Lactium lo confirma); email de la web añadido, webp renombrado.

**No localizables (residual):** Joan Puig Camprubí (Castellgalí) y Xavier
Subirana Colom (Vic), de las secciones «Amics del formatge»/«Cellers» de
Lactium — sin rastro digital de producto/marca.

**Yield: 0 altas + 2 mejoras / 19 revisados → veta cerrada** (como cerveza:
las ferias sectoriales maduras ya están íntegramente en el catálogo).

### Lote 6 — Verkami, campañas alimentación 2024-26 (2026-07-15) ✅

Fuente: crawl sistemático de la categoría
[43-alimentación de Verkami](https://www.verkami.com/discover/projects/by/most_recent/category/43-alimentacion)
(144 proyectos, 8 páginas `most_recent`, hasta ~2018; la ventana 2024-26 ocupa
las ~3 primeras). Cada ficha de proyecto lleva «Creado en <municipio>» +
estado + creador — el crawl es barato y reutilizable como delta en pasadas
futuras (guardado en scratch; regenerable con el mismo script).

**Alta (1):** Paret Seca Vins (Sta. Margarida i els Monjos) —
`paret-seca-vins-santa-margarida-i-els-monjos`, parcial, **VO sí/ecommerce**
(botiga WooCommerce viva). Vi natural sense sulfits de l'enòleg Ivà Gallego,
nacido en pandemia y financiado por Verkami; en Peñín y con distribución
internacional. Municipio solo por directorio → parcial.

**Ya estaban, con señal fresca (2):** Vallalta Vinícola (campaña ene-2026
para reconstruir el celler tras la caída de un árbol) · Amat & Montané (=
«Vins de Bressol», 4 ediciones de crowdfunding, la 4a en 2026, vi de Sumoll
en ánfora). + viejas campañas de filas existentes: Abirradero (Beertual),
Väcka, La Montnegre (Atorrentada), Artcava, Hoppit (Collbaix).

**Rechazos de gate (3, a Descartados):** Vermutiquín (pack-regalo de vermut
sin elaboración propia) · Cardinale (Gironella; cafè-obrador de dolços, cola
Pan a evitar) · Salvem la Nova Farga (campaña de rescate de un negocio sin
identidad de productor localizable).

**Fuera de ventana/provincia (residual):** Sans Domaine (Llorenç del
Penedès=TGN) · Apadrina un eixam (St. Quirze Safaja, ~2023 — ¿qué apicultor?
comprobar si se abre 2ª pasada) · vinos colaborativos DO Alella (2019-22) ·
formatgeria mòbil El Turó de les Nou Cabres (Matadepera, vieja).

**Yield: 1 alta + 2 señales frescas / ~9 netos de la ventana → veta fina pero
barata**; el 90% de la categoría son libros/juegos/restaurantes que el gate
filtra en segundos.

### Lote 9 — Gastroteca.cat: cruce + snapshot (2026-07-16) ✅

Fuente: archivos `on-comprar` de gastroteca.cat, tipos *compra a pagès* +
*compra a l'elaborador* (crawl paginado servidor; el buscador es JS pero los
archivos de taxonomía renderizan tarjetas con nombre·municipio·web·tel·email).
**1.159 fichas de productor** en toda Catalunya; **435 con demarcació de
Barcelona**. Cruce (dominio+teléfono+nombre plegados, con dedup fino manual)
contra `barcelona.csv`: **276 ya estaban**, 7 en «Descartados», 152 netas.
Snapshot crudo completo en
[`barcelona-snapshot-gastroteca.md`](barcelona-snapshot-gastroteca.md) (línea
base para diffs futuros; 141 fichas quedan como «nuevas sin revisar 1-a-1»,
cola barata para el próximo pase).

**Altas (8):**

| candidato | slug | verif | VO | nota |
|---|---|---|---|---|
| Pairó Fish (Montcada i Reixac) | `pairo-fish-montcada-i-reixac` | verificado | **sí/ecommerce** | elaborador de bacallà (dessalat/salaons/5a gamma), botiga WooCommerce viva; su propia web lo sitúa en Montcada (no Badalona como el directorio) |
| Vinagres Masia Still (St. Pere de Riudebitlles) | `vinagres-masia-still-sant-pere-de-riudebitlles` | verificado | no comprobado | vinagres balsàmics eco artesanos (raïm Penedès); web+IG vivas; «botiga» = punts de venda de terceros (VilaViniteca) → VO nc. Categoría rara |
| Mostatxo (Gelida) | `mostatxo-gelida` | verificado | no comprobado | most natural eco/biodinàmic sin sulfitos; verema 2025 + eventos 2026, IG @mostatxo_most |
| Marmeles (St. Martí de Tous) | `marmeles-sant-marti-de-tous` | parcial | no comprobado | ametlles/anacards caramel·litzats artesanos; marmeles.com **NXDOMAIN** (8.8.8.8), IG @marmelesartesanal + Anoia Turisme vivos → tope parcial. Frutos secos (cola fina) |
| Barret Cerveses (Granollers) | `barret-cerveses-granollers` | parcial | no comprobado | cervesera artesana desde 2012, coop CAC, medallas Berlín/BCN/Lió; barret.cat **NXDOMAIN**, FB+Untappd vivos → parcial |
| Mel Morató – Mel Mas Foradada (Vic) | `mel-morato-mel-mas-foradada-vic` | parcial | no comprobado | apícola Morató-Sanglas (~1200 arnes, 2 marcas); web viva pero antigua (blog 2016); web dice Folgueroles, fiscal en Vic (08500) → parcial |
| La Tofonera (Avià) | `la-tofonera-avia` | parcial | no comprobado | tòfona negra + bolets (Pere Muxí/Laia Aldomà, 2002; premi Generalitat 2012), marca evolucionada a SoTaTerra (IG @sota_terra); latofonera.cat **NXDOMAIN** → parcial. Trufa y setas (cola rara) |
| Lainurvi, llardons artesans (Castellar del Vallès) | `lainurvi-llardons-artesans-castellar-del-valles` | parcial | no comprobado | llardons/cortezas del cerdo artesanos, marca propia; web viva con plantilla genérica, imágenes oct-2025 → parcial |

**Residuals no alta (3, ver tabla Descartados):** Successors de J. Pont
(industrial), Mel de Montserrat (web = apicultor de La Rioja), Abellaires
d'Osona (centro educativo). **Cola sin revisar (141):** destaca un bloque de
~15 cavas/cellers del Penedès establecidos y ausentes (Rosell Gallart, Rosell i
Formosa, Almirall, Mas Xarot, Canals & Casanovas, Caves Bohigas, Ferré Amell,
Coma Romà, Caves Mungust, Cava Martín Soler, Antoni Vilamajó, J. Fortuny…) —
cola vino, pendiente de un lote dirigido; el resto son horta/frutas genéricas
que el gate de encaje filtrará.

**Yield: 8 altas / 152 netas ≈ 1/19**, pero con perfil de frente B (cruce, no
cata): la mayoría del catálogo maduro ya está y el valor está en las **categorías
raras** (vinagres, most, tòfona, frutos secos) que sí aportan y en el snapshot
como base de diffs.

### Lote 10 — Xarxa Productes de la Terra 2025: cruce + snapshot (2026-07-16) ✅

Fuente: **Directori d'empreses i productes de la Xarxa Productes de la Terra
2025** (Diputació de Barcelona, PDF de nov-2025, 266 pág., 12 comarcas de la
provincia). El buscador web es JS y las webs de las fichas van en fuente
decorativa `cid` no decodificable, pero el PDF parsea columna-a-columna
(nombre·municipio·contacto·teléfono·email·producto). **1.328 fichas** →
tras dedup (nombre limpio + nombre-sin-sector·municipio + dominio de email +
teléfono): **911 ya estaban** (≈69%: confirma que el catálogo es exhaustivo),
90 en «Descartados», 2 fuera de provincia (Viladrau=Girona), **321 netas**.
Snapshot crudo completo en
[`barcelona-snapshot-xpt.md`](barcelona-snapshot-xpt.md) (base de diffs).

**Altas (3), todas parcial** (fuente institucional fresca XPT-2025 + secundarias
vivas; ninguna con web propia viva → tope parcial):

| candidato | slug | categoría | nota |
|---|---|---|---|
| Cal Andreuet (Gósol) | `cal-andreuet-gosol` | Legumbres | granja de muntanya de Carles Riu (Sorribes de Gósol, Berguedà, prov. BCN), recupera el **Pèsol Negre del Berguedà** (producte singular) + sucs de poma antics + conserves; feature viu a agricultura.gencat.cat; calandreuet.com caído (NXDOMAIN) |
| Calcite (Isabelle Brunet) | `calcite-vilanova-i-la-geltru` | Bodega | **vino natural** del massís del Garraf (criança biològica/oxidativa, Xarel·lo vermell, Malvasia de Sitges); singular XPT + IG @isabellebrunetbcn + Fira NODE Garraf nov-2025. Distinto del CALCITE de Finca Valldosera (Olèrdola, ya en CSV) |
| Perfum de Fruits (la Garriga) | `perfum-de-fruits-la-garriga` | Mermeladas | obrador de melmelades (20+ varietats); solo consta en el XPT 2025 (institucional fresco), sin web/social localizada |

**Aprendizaje clave — dedup con prefijo de sección:** el PDF lista cada empresa
bajo su(s) sector(es) con el nombre a veces precedido por la cabecera del sector
(«LLEGUMS I DERIVATS X», «VERDURES, HORTALISSES… X»), lo que hacía que el fold
del nombre fallara y produjera falsos «nuevos» (391→324→**321** al añadir la
clave nombre-sin-sector·municipio). Casi todas las candidatas de categoría rara
que parecían nuevas (Noir et Blanc, Conserves Coll, Bouquet d'Hort, Naturaliment
Suquipà, Es IM-Perfect, Agrària Santboiana, Mas Jalech…) resultaron **ya estar**
en el CSV. El valor de frente B está en el **snapshot**, no en el yield de altas.
**Cola sin revisar (321):** mayoría horta/vi/oli/carne genéricos (el gate y el
dedup se los comen); los buckets de valor (mel, destil·leries, peix, bolets) se
rastrearon y estaban prácticamente todos presentes.

### Lote 11 — Mercats de Pagès + Slow Food Mercat de la Terra (2026-07-16) ✅

Fuentes: (1) directori de la **Coordinadora de Mercats de Pagès de Barcelona**
([mercatsdepages.barcelona/productores](https://mercatsdepages.barcelona/productores/),
web de nov-2025, server-render paginado, 50 productors con nom·productes·
procedència·mercats); (2) **Slow Food – Mercat de la Terra**
(mercatdelaterra.barcelona; botiga JS Joomla+Hikashop, sin listado
server-render, pero el pie enumera 23 expositores — leído con navegador).

Estos mercados reúnen pagesos de **toda Catalunya** (viajan a vender en BCN), así
que el filtro clave es **comarca → provincia de Barcelona**. De los 50 de la
Coordinadora: **19 fuera de provincia** (Alt Camp, Tarragonès, Solsonès, Segrià,
Girona, València…), 18 ya en CSV, 1 en Descartados, **12 netas** (prov. BCN). De
los 23 de Slow Food: **0 netas** (solapan con mdp/CSV o son de fuera; La Vestale
ya en CSV; Garrofina=Alt Camp; Terrabuxena y Cal Cols sin rastro verificable →
no alta; Fruits Colomer fruita genèrica). Snapshot completo (con addendum Slow
Food) en [`barcelona-snapshot-mercats-pages.md`](barcelona-snapshot-mercats-pages.md).

**Altas (2), ambas parcial** (directorio fresco nov-2025 + secundarias; sin web
propia viva → tope parcial):

| candidato | slug | categoría | nota |
|---|---|---|---|
| Roca del Cór (Sentmenat) | `roca-del-cor-sentmenat` | Lácteos y quesos | formatgeria de cabra/ovella de ramat propi (Can Padró, Vallès Occ.); mercats de pagès + vídeo «Productors locals»; sin web propia |
| 10Cireres (Torrelles de Llobregat) | `10cireres-torrelles-de-llobregat` | Frutos rojos | cireres ecològiques (Cireres del Baix Llobregat, singular); mdp + FB @10CIRERES + Bio Eco Actual maig-2025; 10cireres.com apunta a CloudFront con cert inválido → sin URL |

**Nuevas no integradas (criterio de evitar genéricos):** Altaire Cosmètica
(cosmética, fuera de scope alimentario), Mares Salvatges (pa/dolços vegans, cola
Pan), Gallecs Verdura i Ous ECO (verdura+ous genérico), El Tros d'Ordal / VilaEco
/ Hortells / Can Mestre / Pinullet / Melmelades Vinyet (**ya estaban** bajo
nombre variante — el fold no los cazó, confirmado con grep preciso).

**Yield: 2/12 netas.** Patrón frente-B confirmado por 3er lote seguido: el pool
km0 del área metropolitana ya está muy cubierto; el valor es el snapshot. **Con
el lote 11 se cierran las fuentes de mercados**; quedan lote 8 (BORME, opcional/
ruidoso) y 12 (CCPAE).

### Lote 12 — CCPAE (operadors ecològics): snapshot/delta-base (2026-07-16) ✅

Fuente: **Guia d'operadors** del CCPAE ([guia.ccpae.org](https://guia.ccpae.org/GD/guiaDirectoriWebCercar.action)).
**Resultado: 0 altas netas — cierre como snapshot/delta-base** (rama «si no
publica fecha → snapshot» del plan), documentado en
[`barcelona-snapshot-ccpae.md`](barcelona-snapshot-ccpae.md).

Motivos (verificados en vivo con navegador, tras descartar datos abiertos —no
existe el dataset— y `curl` —form Struts+Dojo hostil—): **5.085 operadores de
toda Catalunya**, registro-dragnet de certificación dominado por **no-productores**
(logística, distribuidores, aceites industriales, importadores) → como REGA,
soporta a lo sumo `parcial`; **sin fecha de alta** por operador. Sonda del
**Berguedà (63 operadores)**: ~90% en bruto (bosc/pastos/raíces = pagesos), y los
pocos elaboradores **ya en CSV** (Casabella Natura, La Bauma de les Deveses); único
ausente Carn i Bestiar Prat = carne genérica sin señal → no alta. El subconjunto
con marca/vendible/en-provincia **ya fluyó** vía XPT (lote 10, 69% ya-en-CSV, que
arrastra el distintivo CCPAE eco), Gastroteca y mercats. Método para deltas
futuros (filtrar por activitat de elaboració o por comarca+ELABORACIÓN) en el doc.

**⚑ PASADA «FLUJO 2026» — FRENTE B CERRADO.** Lotes 9-12 completos (Gastroteca +8,
XPT +3, mercats+SlowFood +2, CCPAE +0 = **+13 altas**, 2508→2521). Todas las
fuentes vivas por deltas quedan con snapshot-base. Residuales de la pasada: lote 2
(Benvinguts a Pagès residual), lote 7 (prensa, NO-GO), lote 8 (BORME, opcional —no
ejecutado por baja señal/alto ruido). Colas dentro de snapshots: ~15 cavas Penedès
(XPT/Gastroteca) para un lote de vino dirigido.

### Lote 13 — Residual: lote de vino dirigido (2026-07-16) ✅

Reapertura del **único residual de valor** identificado al cerrar el frente B: el
bloque de cellers/cavas que quedaron como «nuevos sin revisar» en los snapshots
de XPT (lote 10) y Gastroteca (lote 9). Método: extraer los candidatos vi/cava de
ambos snapshots, **cruce preciso con grep** (no fold) contra el CSV, verificación
de dominio (DNS + liveness + content-check anti-parking) y geocodificación por
centroide.

De ~59 candidatos brutos (con ruido de parseo del XPT y falsos «mas/masia»), tras
depurar y **descartar los ya presentes** (Can Ràfols dels Caus, Valldolina/
Tutusaus, Can Guilera/Coma Romà=Josep Guilera Riambau, Caves Bohigas, Fèlix
Massana Ràfols, Vins i Caves Cuscó Berga, Alta Alella=misma empresa que la fila
Grape Ale) → **23 altas** (CSV 2521→2544):

- **12 verificado** (web propia viva, content-check OK): Alemany i Corrió
  (Vilafranca, Sot Lefriec), Almirall Cava, Bodega J. Fortuny Fàbregas (**VO=sí**,
  WooCommerce), Bodegas Roura (DO Alella), Cava Martín Soler (Font-rubí, 1965),
  Cava Torné & Bel, Celler Avenc del Garraf (Olesa de Bonesvalls, Parc Garraf),
  Bergonyó i Durall, Jané Santacana, Mas Xarot, Vins Petxina (Manresa, Pla de
  Bages), Can Grau Vell (Els Hostalets de Pierola).
- **11 parcial** (dominio caído/aparcado o sin web, identidad+municipio por
  directorio institucional): Cava Joan Colet, Celler d'Ullastrell (webs no
  legibles en vivo); Caves Mungust, Celler Can Pagès, Celler Joaquim Batlle
  (Tiana, DO Alella; joaquimbatlle.com aparcada), Cuscó i Comas, Celler Puig
  Romeu (dominios NXDOMAIN); Celler Altrabanda (serraladadelamarina.com expirado/
  GoDaddy), Celler Grapissó, Celler Tres Tombs, Esteve i Gibert (sin web).

Evidencia +23, gates verdes. Categoría `Bodega` en todas. Aprendizaje reforzado:
el **grep preciso vs fold** es imprescindible (el fold daba ~26 falsos «nuevos»
que ya estaban bajo variante), y el **content-check anti-parking** cazó dos
dominios muertos que respondían 200 (serralada, joaquimbatlle). **Con esto se
vacía el residual de valor de la pasada.**

### Lote 14 — Residual: flecos de las shortlists (2026-07-16) ✅

Cierre 1-a-1 de los diferidos que quedaron a medio verificar en los lotes 3 y 9.
**Alta (1):** Paul and Pippa (`paul-and-pippa-barbera-del-valles`, parcial, VO nc)
— marca registrada de galetes/crackers eco con web viva y distribución gourmet;
obrador en el Polígon Can Salvatella (Barberà del Vallès) por directorio
profesional (la ficha Gastroteca decía Barcelona = sede).

**Ya estaban (3, grafía engañó al grep del lote 9):** BIO Prasad
(`bio-prasad-produccio-ecologica-pineda-de-mar`) · Mel d'Antany–Pau Bars
(`mel-dantany-pau-bars-vilanova-del-cami`) · ART Cervesers
(`art-cervesers-cervebrew-s-l-llica-d-amunt`).

**Rechazos de gate (3, a Descartados):**

| nombre | municipio | motivo |
|---|---|---|
| Ral d'Avinyó (Grup d'Avinyó) | Avinyó | marca gourmet de **grupo porcino industrial líder con exportación** («3.500 clients del canal alimentari… des de la cria fins a l'exportació») — patrón J. Pont/Gin Mare |
| Sanmartí 1850 | Sabadell | **carnisseria/gallinaires del Mercat Central** (parades 261-263, 6 generacions): retail, vende carne de granjas ajenas (El Toll, wagyu) — no productor |
| Cervesa R115 | Barcelona (Sants) | **SL extinguida feb-2025** (einforma/Empresite) + web congelada ©2020 — patrón BlackLab |

**Sin señal / sin rastro (6, no alta; reconsiderables con señal nueva):**
Bio Aliments Natura (bionaturas.com en mantenimiento) · Cooperativa de Calaf
(coopac.cat NXDOMAIN, sin rastro propio; el conill de Calaf lo vende Agro
Igualada) · Vic Brew (web muerta, Untappd sin fecha fresca legible — 3er intento)
· Societat Cervesera Artesenca/Cerberus (web shell vacío — 3er intento) · 27 Club
Brewery (Badalona; SL activa 2020/cuentas 2023 pero web WP rota y sin señal ≤6m
confirmable) · IDG Gastronomic + Del camp al Plat + Ecoil de Josa (B2B industrial
/ dominio muerto / oli de Josa=Lleida — descartes rápidos ya apuntados en lote 9).

**⚑ Con el lote 14 la pasada queda sin flecos: todo candidato conocido está
integrado, descartado con motivo o marcado reconsiderable-con-señal.**

## Bitácora

| Fecha | Lote | Sesión/agente | Resultado |
|---|---|---|---|
| 2026-07-16 | 14 | Claude | ✅ Lote 14 (flecos) cerrado: 12 diferidos resueltos 1-a-1 → **1 alta** (Paul and Pippa, Barberà del Vallès, parcial), 3 ya estaban (grafía), 3 rechazos de gate (Ral d'Avinyó=grupo industrial, Sanmartí 1850=retail, R115=SL extinguida), 6 sin señal (reconsiderables). CSV 2544→2545, gates verdes. **Pasada flujo 2026 sin flecos pendientes.** |
| 2026-07-16 | 13 | Claude | ✅ Lote 13 (residual, vino dirigido): bloque de cellers/cavas de los snapshots XPT+Gastroteca → **23 altas** (12 verificado, 11 parcial; 1 VO=sí: J. Fortuny Fàbregas) tras cruce preciso con grep y descarte de ~7 ya-presentes. CSV 2521→2544, evidencia +23, gates verdes. Vacía el residual de valor de la pasada; lotes 2/7/8 quedan cerrados por diseño (baja señal). |
| 2026-07-16 | 12 | Claude | ✅ Lote 12 (frente B) cerrado como **snapshot/delta-base, 0 altas**: CCPAE = registro de certificación de toda Catalunya (5.085 operadores), dragnet de baja señal (logística/distribuidores/aceites), sin fecha de alta; no hay dataset abierto y el buscador es Dojo hostil (conducido con navegador). Sonda Berguedà (63): ~90% en bruto, elaboradores ya en CSV. El subconjunto de marca ya entró vía XPT/Gastroteca/mercats. Hallazgo + método de deltas en `barcelona-snapshot-ccpae.md`. **Cierra el frente B (lotes 9-12: +13 altas, 2508→2521).** |
| 2026-07-16 | 11 | Claude | ✅ Lote 11 (frente B) cerrado: directori de la Coordinadora de Mercats de Pagès BCN (50, server-render, filtrado por comarca a prov. BCN) + expositores de Slow Food Mercat de la Terra (23, pie leído con navegador) → **2 altas parcial** (Roca del Cór formatges cabra Sentmenat; 10Cireres cireres eco Torrelles) sobre 12 netas de mdp; Slow Food 0 netas. 19 fuera de prov, 18 ya en CSV. Varias «nuevas» aparentes ya estaban (fold vs grep). Snapshot con addendum Slow Food. CSV 2519→2521, evidencia +2, gates verdes. **Fuentes de mercados cerradas → quedan lote 8 (BORME, opcional) y 12 (CCPAE)** |
| 2026-07-16 | 10 | Claude | ✅ Lote 10 (frente B) cerrado: parseo del PDF del **Directori XPT 2025** (266 pág., 1.328 fichas prov. BCN) + cruce → **3 altas parcial** (Cal Andreuet/Pèsol Negre Gósol; Calcite vi natural Garraf; Perfum de Fruits melmelades la Garriga) sobre 321 netas; **911 ya estaban** (69%, catálogo exhaustivo), 90 descartadas, 2 fuera de prov. Snapshot completo guardado (`barcelona-snapshot-xpt.md`). Aprendizaje: el prefijo de sección del PDF inflaba los falsos-nuevos; casi todas las «raras» aparentes ya estaban. CSV 2516→2519, evidencia +3, gates verdes. **Siguiente: lote 11 (mercats de pagès + Slow Food Mercat de la Terra)** |
| 2026-07-16 | 9 | Claude | ✅ Lote 9 (frente B) cerrado: crawl de gastroteca.cat (archivos pagès+elaborador, 435 fichas BCN) + cruce → **8 altas** (Pairó Fish verif VO=sí; Masia Still y Mostatxo verif; Marmeles/Barret/Mel Morató/La Tofonera/Lainurvi parcial) sobre 152 netas; 276 ya estaban, 7 descartadas, 3 residual. Snapshot completo guardado (`barcelona-snapshot-gastroteca.md`) como base de diffs; 141 sin revisar (bloque de ~15 cavas Penedès como cola vino). CSV 2508→2516, evidencia +8, gates verdes. **Frente B iniciado → siguiente: lote 10 (Xarxa Productes de la Terra, Diputació BCN)** |
| 2026-07-14 | — | Claude (planificación) | Creado el ledger; pasada definida en 3 frentes y 13 lotes; pendiente lote 0 |
| 2026-07-15 | 6 | Claude | ✅ Lote 6 cerrado: crawl de 144 proyectos de Verkami/alimentación (ventana 2024-26 ≈ 3 primeras páginas) → **1 alta** (Paret Seca Vins, vi natural, parcial + VO=sí) + 2 señales frescas para filas existentes (Vallalta Vinícola ene-26; Amat & Montané = Vins de Bressol 4a ed. 2026) + 3 rechazos a Descartados. CSV 2506→2507, gates verdes. **Frente A completado (lotes 0-6; 2 y 7 residuales/NO-GO) → siguiente: frente B, lote 9 (Gastroteca.cat con snapshot)** |
| 2026-07-15 | 5 | Claude | ✅ Lote 5 cerrado: expositores Lactium 2026 (19 BCN, con CP/municipio en ficha) + palmarés del concurso → **0 altas** (todo ya en CSV o en blindaje: El Quall descartado por el filtro (a)) **+ 2 mejoras**: fusión dup Masia Fontirons (registro↔marca por tel/web) y slug de Riudavets corregido a l'Esquirol. CSV 2507→2506 (−1 dup), gates verdes. Veta láctea saturada. **Siguiente: lote 6 (Verkami)** |
| 2026-07-15 | 4 | Claude | ✅ Lote 4 cerrado: catálogo Vinari 2025 (PDF oficial) + expositores Vella Terra 2026 → **10 altas** (7 verif, 2 con VO=sí: Canals Nadal y Castell d'Or; 2 proyectos nacidos 2021: Raïmones y Mas Guineu) sobre ~17 netos; ~35 ya estaban. CSV 2497→2507, evidencia 10 reg., gates verdes. La veta vino rinde 10× la cervecera. Residual: 4 expositores VT sin localizar. **Siguiente: lote 5 (Lactium/formatgeries)** |
| 2026-07-15 | 3 | Claude | ✅ Lote 3 cerrado: BBC 25/26 (PDFs oficiales) + mapa GECAN → **1 alta** (Cervesa Cornèlia, parcial) sobre ~10 netos; los 11 medallistas BBC de la provincia ya estaban; mapa GECAN desactualizado (Edge cerrada, As/HOPe secuestradas, Estupenda aparcada, Ausesken muerta); 3 diferidos (Vic Brew, Artesenca, ART Cervesers). CSV 2496→2497, gates verdes. **Veta cervecera cerrada → siguiente: lote 4 (Vinari + vino natural)** |
| 2026-07-14 | 1 | Claude | ✅ Lote 1 (cata) cerrado: 52 fichas BAP prov. BCN trabajadas → **5 altas** (Mels de Can Monràs Nou verif, Mas Palou verif VO=sí, Granja Guirigall parcial, Biomasia Ca n'Oliveró parcial, Maset de la Costa parcial) **+ 1 mejora** (fila registro → MielHada, verif VO=sí) + 16 ya estaban + 25 rechazos (a Descartados). Prensa comarcal vía buscador: 0/3 búsquedas → lote 7 NO-GO. CSV 2491→2496; evidencia 7 registros; gates verdes (csv/images/evidence OK). **GO matizado → siguiente: lote 3 (cerveseras BBC/GECAN)** |
| 2026-07-14 | 0 | Claude | ✅ Lote 0 cerrado. Arqueología de los 220 commits del CSV → **618 slugs salidos** volcados a `barcelona-snapshot-descartados-git.md` (purgas verificación ~490 + dedup 119 pares + fusiones/renombres). Sección «Descartados» rellenada: 10 descartes pre-CSV de la pasada atípicos + 2 «no añadir fila» de la nota de junio (Hofmann Badalona, Parallelo TOM) + 2 alias «ya estaba» de Rutes del Vi (AT Roca, Sant Miquel d'Oló). Los 7 candidatos de junio 2026 acabaron todos integrados. Siguiente: **lote 1** (cata de rendimiento, GO/NO-GO) |

## Candidatos DAR pendientes de triaje (2026-06)

Movidos aquí al comprimir `docs/verificacion/es/barcelona.md` (2026-07-18). Lista de junio 2026:
**deduplicar contra el CSV antes de usar** — la pasada flujo 2026 (julio) ya integró algunos
(p. ej. Mel Morató, Mels Can Monràs Nou) y otros pueden estar como fila de registro o marca.
No son cola obligatoria; integrar solo tras verificación (protocolo de AGENTS.md).
Productores reales del DAR detectados al cerrar cada municipio; integrarlos solo tras verificación
(protocolo de AGENTS.md). No son cola obligatoria.

- **Manresa/Bages:** AMPANS/Urpina · Calafell (Can Calafell) · CCAgrària (Can Poc Oli)
- **Vic/Osona:** Apícola Morató (Mel Morató) · Pujalt Quero (Xai Torrents del Prat) · Tarres Alcalde (L'Esquellot del Montseny)
- **Badalona:** Abellan Moya (vins) · Conreu Sereny SCCL (horta)
- **Sant Boi:** Central Parc del Baix Llobregat SCCL
- **Sant Sadurní d'Anoia:** Can Font de Muntanya (horta) · Mas Casas Cruïlles (formatges ovella) · Mir CB (embotits) · Ca l'Obaga (verdura) · Arboreco
- **Anoia:** Eixarcolant (Jorba) · La Beneta (Hostalets) · Cigronet de Cal Farrés (Calonge) · Embotits Cal Travé (Llacuna)
- **Alt Penedès:** Coop. Vinícola del Penedès · Marquès Ros (Cal Sis Dits, Vilobí) · Pons Ametller (olives, Vilobí)
- **Garraf:** Agrovilanova SAT (Claramunt Food Service)
- **Subirats:** Castell de Subirats SA · Heretat Guilera SL · Mas Gori · Ràfols Vendrell (Cal Pau Jan) · Caves El Mas Ferrer (Ca l'Avi, cava mètode tradicional des de 1979, elmasferrer.com; la fila «Caves Masia El Mas» mal fichada a La Granada es va purgar al lote 144)
- **Piera:** Borràs Puiggròs (préssecs) · Vallverdú Garriga Roser (oli)
- **Caldes de Montbui:** Vicente López Pablo (horta)
- **Moianès:** Vins Colltor + Celler Sant Miquel (Sta Maria d'Oló) · La Cabreria/Bardissa (formatges, Oló) · Granja La Bassola (Castellterçol)
- **Tordera:** Colldeforns Soler · Llavina Parés (Horta Llavina) · Jordi Manresa (farines) · Ramaderia Can Thos (llet) · Lluís Sagrera (patata)
- **Vilassar de Mar:** Agrícola de Vilassar de Mar SCCL (coop 1918, agrobotiga)
- **Viladecans:** Heretat Mas Tinell (vins) · Vilaeco SL · Ximalls SAT
- **Olesa de Montserrat:** Bolets Petràs (setes fresques/silvestres/seques, Llorenç Petràs «el rei dels bolets» de La Boqueria; pol. ind. Can Singla, boletspetras.com, IG @bolets_petras) — desplaçat del lote 221, on s'havia sobreposat erròniament a Comercial Safaja (SQS)
- **Collsuspina/Moianès:** Ciuró Torras, Albert (conserves vegetals) · Torras Clos, Pere (La Verdella, carn de boví)
- **Mediona/Alt Penedès:** Torres Murgades, Jordi (oli d'oliva i olives)
- **Santpedor/Bages:** Mas Graner, SCCL (xai)
- **Prats de Lluçanès:** Aragües Carrera, David (xai) — desplaçat del lote 249 (fila buida a Sta Maria de Merlès)
- **Avià/Berguedà:** Ginatge (ginebra London Dry de Jordi Millán) — purgat del lote 259; la web gintonic.cat ara és cocteleria d'esdeveniments, cal confirmar si segueix produint el gin abans de reintegrar
- **Figaró-Montmany:** Salvat López de Padilla, Clara (horta: patata, enciam, carabassa, ceba) — DAR no casat
- **Martorelles:** Masia Can Roda Vinyes i Vins SL (So de Can Roda, vins) — DAR no casat
- **Montmajor:** Calabuig Agropecuària SL (carn de boví) — DAR no casat
- **Rajadell:** Fer i Refer SL (Masiets & Perich, pollastre) — DAR no casat
- **Sobremunt:** Agrícola Ramadera Mas Reixach SC (xai) — DAR no casat
- **Vallgorguina:** Plana Perxachs, Maria Carme (cabrum) — DAR no casat
- **Viver i Serrateix:** Gamisans Solà, Carles · Les Cots de Sant Joan SCP (vedella de Ramaders de Muntanya del Berguedà) — DAR no casats
- **Para otros agentes — Tarragona (Baix Penedès), per a `tarragona.csv`:** **Cellers Avgvstvs Forvm** (vins i vinagres Forvm, avgvstvsforvm.com) i **Jané Ventura** (celler ecològic, cava, janeventura.com) — estaven mal fichats a barcelona.csv (El Vendrell, CP 43700), purgats al lote 264. **Bodega Can Marlès** (celler del Penedès + enoturisme, canmarles.com) — mal fichada (El Montmell, CP 43812 Can Ferrer de la Cogullada), purgada al lote 309.
- **Para otros agentes — Lleida, per a `lleida.csv`:** **Cal Andreuet** (explotació agrícola/ramadera ecològica d'alta muntanya: pèsol negre, patates de muntanya, suc de poma; calandreuet.com, IG cal_andreuet) — mal fichat a barcelona.csv (Gósol, CP 25716, província de Lleida), purgat al lote 313. Gósol té més productors al DAR (Morales García, Prathumthong, Riu Bosoms, Solé Fígols) per a lleida.csv.
- **Castellbisbal:** Celler Ca l'Esteve (vins DO Catalunya; "Quitxalla" es su marca, fila purgada)
- **El Masnou:** Jordana Ribas SL (Jordi Jordana Maresme; horta)
- **Cardedeu:** SAT Can Roger (llet ecològica; Agrobotiga La Païssa)
- **Sant Martí Sarroca:** Greenhort SCP (horta) · Molí de Calabuig SL (olives/ordi) · Ràfols Baqués Josep (conserves) · Vidal Bolet Jesús (fruita/horta) · Cellers Montserrat (vins)
- **Cabrera de Mar:** Cultius Jaume's Noe SCP (horta, DAR) · Roig Vins (celler i botiga gourmet nova)
- **Gavà (Mercat de Pagès):** Cal Xim Xim (Mauri Bosch, 30 ha) · Vila Eco by Enric ECO (Xavier Estrada) · Ivern Borrut Josep (DAR). ~~Can Arenols~~ → corregido en `BCN-V1-m` como productor y agrobotiga de Viladecans, con reparto a domicilio |
- **Sant Feliu de Llobregat:** La Rural de Collserola SCCL (Can Ferriol, DAR; horts a la Rierada-Molins ja citats al lote 34)
- **Sant Pere de Ribes:** La Piotxa SCCL (préssecs, espàrrec, espelta; DAR 656577327)
- **Torelló:** Agrària de Torelló SCCL (Patates del Bufet d'Orís; DAR 617331898) · Les Gambires Torelló SL (El Rebost de les Gambires, pollastre; DAR 626305631) · Espai Natura (parada eco al Mercat Municipal, collita pròpia)
- **Granollers:** Figuls Tuset, Pere (Can Figuls, enciam/mongeta; DAR 645932199) · Ventosa Asturgo, Isidro (llet i formatges; DAR 647466330)
- **Santa Coloma de Gramenet:** Horticultura Meya SL (DAR 670246579; probablemente la mateixa família que la fila Horta Meya ja verificada — comprovar abans d'afegir)
- **Esparreguera:** Masia Can Claramunt (verdures i producte de proximitat, masiacanclaramunt.com)
- **Palafolls:** Navarro Sanchez, Juan Manuel (préssecs/pomes/olives; DAR 660562171) · Pla Urrea, Antoni (pastanaga/horta; DAR 629351781)
- **Prats de Lluçanès:** Aragües Carrera, David (xai; DAR 626165004) · Coop. Mas Les Vinyes SCCL (horta+xai+mel, agroforestal)
- **Arenys de Mar:** Hortalisses Tuto SCP (horta; DAR 637855410) · Sala Martinez, Lluís (carxofa/fava; DAR 629303780) · Can Maresma SL (ous/fruita/verdura, parada 14/16 mercat)
- **Argentona:** Oliveras Guiñon, Jose (all/mongeta/tomàquet; DAR 639261000)
- **Avinyonet del Penedès:** Marcé Medialdea, Martí (Martí Marcé, préssecs; DAR 677507426). Los Cuscó Esteve (Joan/Jordi/Lluís) son la família de Cuscó Berga, no añadir.
- **Pineda de Mar:** Cuní Baltrons, Juan (horta; DAR 660364608)
- **Olesa de Montserrat:** Fruits del Bosc Petras SL (marca Fruits del Bosc, aromàtiques; DAR 624073697) — probablement la mateixa família que Bolets Petràs (ya verificada), comprovar abans d'afegir.
- **Barberà del Vallès:** Pons Pujol SCP (vedella; DAR 680947310)
- **Granollers (Palou):** de la lista oficial Productes de Palou, no integrados: Hort de Can Tabaquet (horta eco) · L'Horta de la Tuka (horta+mel) · Can Nicolau SAT (carn) · Els Bardissots (vi) · Fem Horting
- **Gurb:** Agrícola Terricabras Colom SL (marca ACTUS, ceba/calçot/enciam/patata; DAR 606877466)
- **Granollers (ciutat):** Gassó Artesans 1885 (pastisseria gourmet, Cal Ros dels Ocells 4C, gassoartesans.com) — marca real purgada de Lliçà d'Amunt donde figuraba como cansaladeria
- **Palau-solità i Plegamans:** Estrada Llargues, Isidro (mongeta; DAR 659999473)
- **Santa Perpètua de Mogoda:** Pa Artesà del Vallès (obrador 40 anys, Pol. Can Roca, paartesadelvalles.com + restaurant Cal Jaume; els seus enllaços estaven mal posats a la fila Pastisseria Pi de La Llagosta, purgats d'allà al lote 145)
- **Parets del Vallès:** Mestresses S.C. (horta, blat tou, ordi; DAR 661350810)
- **Sant Esteve Sesrovires:** Juscafresa Ferrer, Eugeni (horta/taronges/carxofa; DAR 660823944) · López Cabello, Manel (horta; DAR 693063652)
- **Sallent:** Guitart Quintana, Josep (Essència d'Oli de Cabrianes; DAR 617375377) · La Tomakera SCP (horta; DAR 649195293) · Santasusagna SCP (xai; DAR 617405951)
- **Torrelavit:** Cols Canals, Lluís (Cal Cols, vins+oli; DAR 653162580) · Ruiz Molina, Anna (préssecs; DAR 648725583)
- **Castellfollit del Boix:** Cornellas Prat, Jordi (Cal Rei, conserves; DAR 618762888) · Lladó Oliva, Joan (cigró/mongeta; DAR 608691406)
- **Cubelles:** Poch Lleó, Ciril (oli/horta; DAR 636808594)
- **Font-rubí:** Aranda González, Agustín (oli/pebrot; DAR 639333948) · Celler Cal Costas SL (DAR 654127597) · Ràfols Petit, Jordi (Magna Hortum, horta; DAR 625810165) · Ros Marina Viticultors (Mas Uberni; DAR 686501262)
- **Malgrat de Mar:** Xaubet SCP (horta; DAR 629006100) · Josep Maynou y Bona Verdura (directorio Espai Agrari Baixa Tordera, espaiagraribaixatordera.cat — fuente útil para todo el Alt Maresme/Baixa Tordera)
- **Mollet del Vallès (Gallecs):** ~~Alsina Cusco~~ (integrado en lote 91, reubicado desde Sta. Eulàlia) · Butjosa i Boada Gallecs SCP (marca Ous de Gallecs / "Ou de Gallecs", Laura Blasco; DAR 652303577) · Hereus Can Jornet SL (Can Jornet, farines; DAR 689509161) · Agrobotiga de Gallecs (punt de venda col·lectiu dels pagesos, espairuralgallecs.cat — web http-only, https con cert roto)
- **Sta. Eulàlia de Ronçana:** Monràs Passeta, Alan (Mels Can Monràs Nou; DAR 618094396)
- **Castellterçol:** Esteva Monforte, Enric (horta/col-i-flor/tomàquet; DAR 608925270) · Vall-llosana SCP (vedella; DAR 666545870) · Granja La Bassola SAT (paralela a El Rocall SL ya integrada; DAR 629134275, comprovar si és la mateixa entitat abans d'afegir)
- **Cervelló:** Soldevilla Alonso, Jordi (cireres; DAR 627418908)
- **Montornès del Vallès:** Vallès Oriental = zona DOP de mongeta del ganxet (Montornès, les Franqueses, la Roca); coop Agrària Vallès (agrariavalles.coop) como fuente
- **Bigues i Riells del Fai:** de la lista de productors de l'ajuntament, no integrados: Hortícola Vila (tomàquets/calçots a domicili; elflix@elflix.com, 687083451) · Can Quimet (mongetes i calçots) · Chiva Valls (cereals). Can Sapera y Embotits Guinó (Lliçà de Vall) ya están en el CSV
- **Papiol:** grup Rebrot Pagès (6 pagesos eco del Papiol; Can Font ya integrado, identificar el resto) · catàleg de productors del Parc Natural de Collserola (parcnaturalcollserola.cat) y programa de la Festa de la Cirera — fuentes útiles. Figueras Garriga Ramon (DAR 606701734) ya cubierto por la fila Cal Figueras (hermanos)
- **Sta. Margarida i els Monjos:** directori municipal de cellers i caves (santamargaridaielsmonjos.cat/directori/cellers-i-caves) — fuente útil para más cellers del municipi
- **Seva:** Blansac 2015 SL (marca Formatge Bauma, formatges de llet crua; DAR 617386155) · guia d'empreses de l'ajuntament (seva.cat) — fuente útil
- **Torrelles de Foix:** Heretat Laverna (celler dels Escofet des de 1342, vins eco DO Penedès, primera anyada 2021, ancestrals.cat; vil·la romana a la finca) — no está en el CSV, candidata clara
- **Badia del Vallès:** Carnisseria Cristina Ramacisa SL (Mercat de Badia, Av. Via de la Plata 8) — real en directorios; el ajuntament publica la lista de parades con servei a domicili (badiadelvalles.cat)
- **Terrassa:** Hort del Silenci (hortdelsilenci.com; agricultores y elaboradores eco con almacén en Terrassa; su obrador es la Masia Can Viver de Torrebonica = Agrària Can Viver SL del DAR, fila quimera purgada de Montcada) — no está en el CSV
- **Lluçanès:** portales llucanesataula.cat y turisme.llucanes.cat/tasta/productors-elaboradors — fuentes útiles para toda la comarca; Formatges de Lluçà (Lluçà) y el obrador col·lectiu/formatgeria del Lluçanès (Anna Puig, BCN Agrària) como pistas
- **Santa Susanna:** Agrícola de Santa Susanna SCCL (coop) · Hortalisses Pascual SCP (DAR 636644433) · L'Hort d'en Pol (Pol Pi Pujol, DAR 691857326) · Campeny Solà, Angel (aromàtiques, DAR 685270784)
- **Calldetenes:** Roca Rovira, Antonino (ceba/calçot, DAR 658910605)
- **Cardona:** Cal Pepitu (carnisseria de Cardona amb botiga online lavalldelcardener.cat; vedella, el col·lectiu de Josep Jané/Guillem Flores/Mar Barons — el ramader Jané ja és fila parcial) · Tòfona del Clot de Coma (Josep Malagarriga, DAR 687847550)
- **Casserres:** Casa Barbats Agrícola i Ramadera SL (vedella, Ramaders de Muntanya del Berguedà; DAR 620942009 — ja integrada com a fila "Casa Barbats" parcial) · Cal Trumfet (casa rural amb productes locals)
- **Gelida:** Cartró Parera, Vicenç (prunes/figues/préssecs/peres, DAR 606249984)
- **Abrera:** Sències (agricultura i ramaderia eco en 3 masies d'Abrera/Sitges/Masquefa)
- **Alella:** Bouquet d'Alella SL (marca Bouquet, vins/caves; DAR 670275054)
- **Aguilar de Segarra:** Cal Figuera (ous; citat a directoris del Bages)
- **Avinyó:** Torras Salvans, Ricard (marca Salers el Vinyes, vedella; DAR 620962240)
- **Oristà:** Puig Orriols, Albert (carn de conill; DAR 626898877)
