# Candidatos — Córdoba

> Origen: pasada **DO menos cubiertas** (`docs/candidates/do-huecos.md`). Cada
> sección corresponde a un lote de esa pasada. **Estado: `unverified`** —
> deduplicado contra `data/csv/andalucia/cordoba.csv` por nombre normalizado (y
> web/teléfono donde constaban). Antes de integrar: re-deduplicar con
> `npx pnpm list:province cordoba`, confirmar actividad/dirección/web, aplicar
> las reglas duras de triaje del ledger y decidir `verificacion` y `Venta online`.

## DO Montilla-Moriles (lote 1 de do-huecos)

> Fuente de partida: registro de operadores del Consejo Regulador
> (<https://www.montillamoriles.es/es/la-denominacion/operadores-inscritos.html>,
> paginado por JS) + directorio *We Love Montilla Moriles*
> (<https://welovemontillamoriles.es/bodegas-lagares-tonelerias/>, 37 bodegas +
> 17 lagares + 8 tonelerías) + fichas del Consejo. Dedup 2026-07-09.
> **Ya en el CSV (excluidas):** Alvear, Robles, El Monte, Hathor, La Aurora
> (coop.), Ruiz-Canela (Lucena), Lagar La Primilla, Lagar Los Raigones, Montes y
> Compañía. **Tonelerías excluidas** (fabricantes de barricas, B2B, no vendible
> al consumidor). Municipio = donde se produce (17 municipios de la DO en el sur
> de Córdoba).

### Bodegas con web/venta confirmada (prioridad) — ✅ integrado 2026-07-10 (lote 1.3a)

> **8 altas** (7 `verificado` + 1 `parcial`); VO=sí en Doblas, Santa Magdalena,
> BJN. **⚠ grupo Pérez Barquero resuelto**: su web no menciona el grupo y tiene
> marca/escaparate propios → se crea solo Pérez Barquero; **Gracia Hermanos queda
> diferida** (misma propiedad, sin escaparate propio confirmado). Doblas
> confirmada = A. Doblas Martos (mismo teléfono). Delgado: marca es «Segunda
> **Bota**», no «Segunda Bandera». BJN es cooperativa con tienda propia → se
> mantiene. Cruz Conde queda `parcial` (web con fallos técnicos). Slugs:
> `bodegas-perez-barquero-montilla`, `bodegas-cruz-conde-montilla`,
> `bodegas-toro-albala-aguilar-de-la-frontera`, `bodegas-doblas-moriles`,
> `lagar-blanco-montilla`, `lagar-de-santa-magdalena-moriles`,
> `bodegas-delgado-puente-genil`, `bodegas-jesus-nazareno-baena`.

- [ ] **Bodegas Pérez Barquero** — Bodega. Montilla.
  <https://perezbarquero.com/> · 957 650 500. Fundada 1905, marca histórica de la
  DO con tienda online → pista `Venta online=sí`. ⚠ **Grupo**: comparte propiedad
  con **Bodegas Gracia (Gracia Hermanos)**, **Compañía Vinícola del Sur** y
  **Tomás García** (140 ha). Antes de crear varias filas, confirmar qué marcas
  venden con escaparate propio y cuáles son solo B2B/graneles del grupo.
- [ ] **Bodegas Cruz Conde** — Bodega. Montilla (Ronda del Canillo, 4).
  <https://www.bodegascruzconde.es/> · tienda <http://tienda.bodegascruzconde.com/>
  · 957 651 250. Tienda online activa → pista `Venta online=sí`.
- [ ] **Bodegas Toro Albalá** — Bodega. Aguilar de la Frontera.
  <https://www.toroalbala.com/> · fundada 1922. PX de largo envejecimiento muy
  reputados; enoturismo y venta → pista `Venta online=sí`.
- [ ] **Bodegas Doblas** — Bodega. Moriles.
  <https://www.bodegasdoblas.com/tienda/>. Tienda online propia → pista
  `Venta online=sí`. ⚠ En el registro figura como **A. Doblas Martos**
  (bodegas@adoblasmartos.com, 957 537 942): confirmar si es la misma entidad.
- [ ] **Lagar Blanco** — Bodega/Lagar. Sierra de Montilla (Montilla).
  <https://www.lagarblanco.es/>. Lagar familiar con enoturismo y venta → pista
  `Venta online=sí`.
- [ ] **Lagar de Santa Magdalena** — Bodega/Lagar. Moriles.
  <https://www.vinoslagardesantamagdalena.com/>. Lagar con soleras y enoturismo
  → pista `Venta online=sí`.
- [ ] **Bodegas Delgado** — Bodega. Puente Genil (C. Cosano, 2).
  fino@bodegasdelgado.com · 957 600 085. Marca «Segunda Bandera». Confirmar web y
  venta.
- [ ] **Bodegas Jesús Nazareno (BJN)** — Bodega (cooperativa con marca propia).
  Baena (Av. Cañete de las Torres, 33). <https://www.bjn1963.com/> ·
  bjn@bjn1963.com · 957 670 225. ⚠ Cooperativa: entra si vende con marca de
  consumo (marca BJN); confirmar tienda/venta al público.

### Bodegas del registro (municipio a confirmar) — ✅ 6 integradas 2026-07-10 (lote 1.3f)

> **6 altas** (4 `verificado`+VO=sí: Navarro, Del Pino, Galán Portero, Luque; 2
> `parcial`: El Gallo web sin contenido, Bonilla sin web). **Gracia Hermanos
> diferida** (grupo Pérez Barquero). **Diferidas por no encontrar web/venta ni
> municipio fiable** (registro-only, siguiente pasada): Bodegas Único, Sillero, El
> Pujío, Maillo, Mora Chacón, El Gallo (⚠ ya integrada parcial), Lagar Cañada
> Navarro, Lagar Cabriñana. Slugs altas: `bodegas-navarro-montilla`,
> `bodegas-del-pino-montalban-de-cordoba`, `bodegas-galan-portero-montilla`,
> `bodegas-luque-dona-mencia`, `bodegas-el-gallo-montilla`,
> `bodegas-bonilla-aguilar-de-la-frontera`.

- [ ] **Bodegas Navarro** — Bodega. Montilla. Marca histórica de la DO; confirmar
  web oficial y venta.
- [ ] **Bodegas Gracia (Gracia Hermanos)** — Bodega. Montilla. ⚠ Mismo grupo que
  Pérez Barquero: no crear fila hasta resolver el aviso de grupo de arriba.
- [ ] **Bodegas Luque** — Bodega. Doña Mencía. PX y generosos DO Montilla-Moriles;
  confirmar web y venta.
- [ ] **Bodegas Del Pino** — Bodega. Montalbán de Córdoba. Confirmar web/venta.
- [ ] **Bodegas Bonilla (Aragón Bonilla Hermanos)** — Bodega. Aguilar de la
  Frontera (C. Ancha, 127). bodegasbonilla@hotmail.com · 957 660 760.
- [ ] **Bodegas Galán Portero** — Bodega. Montilla/Moriles (confirmar). Ficha:
  <https://www.montillamoriles.es/bodegas/listado/galan-portero/>.
- [ ] **Bodegas Único** — Bodega. Montilla (confirmar). Confirmar web/venta.
- [ ] **Bodegas Sillero** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas El Pujío** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas Maillo** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas Mora Chacón** — Bodega. Confirmar municipio, web y venta.
- [ ] **Bodegas El Gallo** — Bodega. Montilla (confirmar). Confirmar web/venta.
- [ ] **Lagar Cañada Navarro** — Bodega/Lagar. Sierra de Montilla (Montilla).
  Confirmar web y venta.
- [ ] **Bodegas Cabriñana / Lagar Cabriñana (Rockera Cabriñana)** — Bodega/Lagar.
  Sierra de Montilla (Montilla). bodegascabrillana@gmail.com · 957 335 386.
  Confirmar web y venta.

> ⚠ **Cooperativas del registro (triar aparte):** «Bodegas La Unión», «Bodegas
> N. Sra. Rosario», «Bodegas San Acacio» (Montemayor), «Bodegas San Jerónimo»,
> «Bodegas Vitivinícola Local» (Aguilar), «Bodegas La Purísima. Vinolea» aparecen
> marcadas como cooperativas (C) en el directorio. Entran **solo** si venden con
> marca de consumo propia (tienda física/online). Verificar una a una antes de
> crear fila; excluir las que sean sección de servicios/graneles.
> ⚠ **Navisa** (Montilla) es industrial/graneles: verificar si tiene marca de
> consumo antes de considerarla.

## DOP Baena + DOP Priego de Córdoba (aceite, lote 2 de do-huecos)

> Fuente de partida: registro de empresas del Consejo Regulador DOP Baena
> (<https://www.dobaena.com/nuestras-empresas-y-marcas/>, 17 entidades con web) +
> registro AOVE del Consejo Regulador DOP Priego de Córdoba
> (<https://www.dopriegodecordoba.es/empresas-aove/>, 10 almazaras + 6
> envasadoras/comercializadoras). Dedup 2026-07-09 por dominio y nombre
> normalizado. **Ya en el CSV (excluidas):** Peña de Baena, Olivarera Ntra. Sra.
> de Guadalupe (Baena), Almazaras de la Subbética (Carcabuey), Gomeoliva (Priego).
> Casi todas las inscritas son cooperativas olivareras que **sí** entran (venden
> con marca propia en tienda de almazara/online), pero hay que **confirmar caso a
> caso** que no sean solo sección de graneles/servicios. Municipio = donde está la
> almazara. **Corte del lote:** escritas las 24 almazaras con producción propia;
> las envasadoras/comercializadoras puras de Priego quedan como nota al pie para
> triar por producción propia (posible siguiente corte).

### DOP Baena — almazaras/olivareras (15) — ✅ 12 integradas 2026-07-10 (lote 1.3b)

> **12 altas, TODAS `verificado` + `Venta online=sí` (ecommerce)** — lote de
> máximo rendimiento (las almazaras cooperativas de la DOP venden con tienda
> propia). **Correcciones de municipio**: Sucesores de Hnos. López está en
> **Luque** y Olivarera San Isidro en **Castro del Río** (no Baena; esto resuelve
> el ⚠ homónimo con la San Isidro de Fuente Tójar). Aceites de la Salud
> confirmada en Castro del Río. Albendín (Suerte Alta, Aceites Albendín) → municipio
> Baena (Albendín es ELM). Quedan 3 para el siguiente corte: **Monteoliva
> (Cabra)** — distinta de la Monteoliva Cordobesa de Montilla ya en CSV —,
> **Capricho Andaluz** y **osaceite/la niña de mis ojos**. Slugs:
> `olivarera-del-rosario-nueva-carteya`, `olivarera-el-henazar-dona-mencia`,
> `almazara-de-luque`, `sucesores-de-hermanos-lopez-luque`, `zuheroliva-zuheros`,
> `orobaena-baena`, `olivarera-san-isidro-castro-del-rio`, `nunez-de-prado-baena`,
> `olivarera-german-baena`, `aceites-albendin-baena`,
> `olivarera-de-la-salud-castro-del-rio`, `cortijo-de-suerte-alta-baena`.

- [ ] **S.C.A. Olivarera Ntra. Sra. del Rosario** — Aceite. Nueva Carteya.
  <https://aceitedelrosario.es/>. Cooperativa con marca propia; pista tienda →
  `Venta online` a confirmar.
- [ ] **S.C.A. Olivarera Ntra. Sra. de la Consolación (El Henazar)** — Aceite.
  Doña Mencía. <https://tienda.elhenazar.es/>. Tienda online → pista `Venta online=sí`.
- [ ] **S.C.A. Olivarera Almazara de Luque** — Aceite. Luque.
  <https://almazaradeluque.com/>.
- [ ] **Sucesores de Hnos. López, S.A.** — Aceite. Baena. <https://aceiteshl.com/>.
- [ ] **S.C.A. Olivarera Ntra. Sra. del Perpetuo Socorro (Zuheroliva)** — Aceite.
  Zuheros. <https://zuheroliva.com/>.
- [ ] **Orobaena, S.A.T.** — Aceite. Baena. <https://orobaena.es/>.
- [ ] **S.C.A. Olivarera San Isidro** — Aceite. Baena.
  <https://olivarerasanisidro.es/>. ⚠ Homónimo con «Olivarera San Isidro» de
  Fuente Tójar (DOP Priego, abajo): entidades distintas, cuidar slug/municipio.
- [ ] **Núñez de Prado Oliva Virgen S.L.** — Aceite. Baena.
  <https://nunezdeprado.com/>. Marca histórica (aceite «flor», ecológico).
- [ ] **S.C.A. Olivarera Germán Baena** — Aceite. Baena. <https://germanbaenascoa.es/>.
- [ ] **S.C.A. de Labradores y Ganaderos (Aceites Albendín)** — Aceite.
  Albendín (Baena). <https://aceitesalbendin.es/>.
- [ ] **S.C.A. Nuestra Sra. de la Salud** — Aceite. Castro del Río (confirmar).
  <https://aceitesdelasalud.com/>.
- [ ] **Cortijo de Suerte Alta S.L.** — Aceite. Baena. <https://suertealta.es/>.
  Aceite ecológico de finca; pista `Venta online`.
- [x] **Monteoliva (Virgen de la Sierra)** — **accepted →
  `cooperativa-virgen-de-la-sierra-monteoliva-cabra`** (`verificado`, `sí`). Cabra,
  DOP Baena; distinta de Monteoliva Cordobesa (Montilla). ⚠ homónimo de municipio
  «Cabra» con Castel de Cabra (Teruel) en `municipios.json`, resuelto por override.
- [x] **Capricho Andaluz S.L.** — **accepted → `capricho-andaluz-baena`**
  (`verificado`, `sí`). Baena; tienda propia.
- [x] **Aceite la niña de mis ojos** — **rejected: not-producer / other-province**.
  `osaceite.es` es un **distribuidor de Gijón (Asturias)** con +40 años, no una
  almazara de Córdoba (comercializa varias marcas, entre ellas «La Niña de mis
  Ojos»). No crear fila.

### DOP Priego de Córdoba — almazaras (9) — ✅ integrado 2026-07-10 (lote 1.3c)

> **9 altas** (8 `verificado` + 1 `parcial` Toxar por certificado caducado); VO=sí
> en Mueloliva, Manuel Molina, El Lagar, OliBrácana, Zamoranos, La Purísima,
> Aroden. Sucesores de Morales `verificado`/`no comprobado` (web sin tienda). San
> Isidro (Toxar, Fuente-Tójar) es **distinta** de la San Isidro de Castro del Río
> (DOP Baena) del lote anterior. Slugs con prefijo `*-priego-de-cordoba`,
> `marin-serrano-el-lagar-carcabuey`, `olibracana-almedinilla`,
> `aceites-manuel-molina-almedinilla`, `aroden-carcabuey`,
> `olivarera-san-isidro-toxar-fuente-tojar`.

- [ ] **Almazara de Muela / Mueloliva, S.L.** — Aceite. Priego de Córdoba.
  <https://www.mueloliva.es/>. Marca «Venta del Barón», premiada; tienda → pista
  `Venta online=sí`.
- [ ] **D3Olivo Biotechnology (Aroden)** — Aceite. Carcabuey.
  <https://www.aroden.com/>.
- [ ] **Manuel Molina Muñoz e Hijos** — Aceite. Almedinilla.
  <https://www.aceitesmanuelmolina.com/>.
- [ ] **Marín Serrano El Lagar, S.L.** — Aceite. Carcabuey. <https://www.ellagar.es/>.
- [ ] **S.C.A. Ntra. Sra. del Carmen de Almedinilla (Olibracana)** — Aceite.
  Almedinilla. <https://www.olibracana.es/>.
- [ ] **S.C.A. Olivarera La Purísima** — Aceite. Priego de Córdoba.
  <https://www.coopurisimapriego.com/>.
- [ ] **S.C.A. Olivarera Ntra. Sra. del Carmen (Zamoranos)** — Aceite. Zamoranos
  (Priego de Córdoba). <https://www.cooperativazamoranos.com/>.
- [ ] **S.C.A. Olivarera San Isidro (Toxar)** — Aceite. Fuente Tójar.
  <https://www.cooperativatoxar.es/>. ⚠ Ver homónimo San Isidro de Baena arriba.
- [ ] **Sucesores de Morales Morales, S.L.** — Aceite. Priego de Córdoba.
  <https://www.sucesoresdemorales.com/>.

> ⚠ **Envasadoras/comercializadoras de DOP Priego (triar por producción propia
> antes de crear fila — posible siguiente corte):** «Aceites Vizcántar»
> (<https://www.aceitesvizcantar.com/>), «Magna Legatum / Legatum AOVE»
> (<https://www.legatumaove.com/>), «Sponex / Olivasi» (<https://www.olivasi.com/>),
> «X 37 Grados Norte / XY Aceite» (<https://www.xyaceitedeoliva.com/>). Entran solo
> si producen con marca propia y venden al consumidor; excluir las que sean solo
> envasado/comercialización B2B. «Muela-Olives» del registro es la envasadora del
> mismo grupo que Mueloliva (no duplicar).

## DOP Aceite de Lucena + DOP Montoro-Adamuz (aceite, lote 3 de do-huecos)

> Fuentes de partida: registro DOP Aceite de Lucena (<http://dolucena.es/>, 8
> inscritas) + cooperativas inscritas en DOP Montoro-Adamuz
> (<https://montoro-adamuz.org/>; el consejo no publica listado web limpio, lista
> reconstruida de fuentes del consejo/DCOOP). Dedup 2026-07-09 por dominio/nombre.
> **Ya en el CSV / mismo grupo (excluidas):** Gomeoliva (Priego) y **Aceites
> Fuente Grande S.A.** (Lucena) — Fuente Grande es la sociedad agraria del mismo
> grupo que Gomeoliva, que ya está en CSV; Almazaras de la Subbética (Carcabuey,
> ya en CSV vía lote 2); La Aurora (Montilla, ya en CSV). Municipio = donde está
> la almazara.
>
> ⚠ **Aviso de grupo DCOOP (Montoro-Adamuz):** cinco de las inscritas (Madre del
> Sol, Olivarera de Montoro, Ntra. Sra. de la Merced, del Guadiato, San Antonio
> Abad) son cooperativas del **grupo DCOOP/Cordoliva**, que comercializa buena
> parte del aceite a granel/B2B. Entran **solo** si venden con **marca de consumo
> propia** (tienda física/online); si solo aportan aceituna/granel a DCOOP,
> excluir. Confirmar caso a caso.

### DOP Aceite de Lucena (4) + DOP Montoro-Adamuz (7) — ✅ 4 integradas 2026-07-10 (lote 1.3d)

> **4 altas**: Cooperativa Olivarera de Lucena (`verificado`, VO=sí), Cooperativa
> Araceli (`parcial`, TLS), La Unión de Montilla (`verificado`, VO=sí, categoría
> **Aceite y bodega** — resuelve el cruce con «Bodegas La Unión» del lote 1) y
> Madre del Sol de Adamuz (`verificado`, marca de consumo Olivar de Sierra).
> **Diferidas por granel/DCOOP sin marca de consumo propia**: Oleollanos (Rute) y
> **todo el resto de Montoro-Adamuz** (Olivarera de Montoro, Merced, San Antonio
> Abad, Santiago Apóstol/Villanueva del Rey [la nota lo llamaba «San Rafael» y
> «Santiago» por separado: es una sola coop en Villanueva del Rey que vende vía
> DCOOP/Cordoliva], del Guadiato). **Leads net-new detectados con tienda** (fuera
> de la lista original, para pasada futura): Aceites Rosán (`aceitesrosan.es`),
> Aceite Campolio (`aceitecampolio.com`), Lagar de Quirós (`molinodequiros.es`).
> Slugs: `cooperativa-olivarera-de-lucena`, `cooperativa-araceli-lucena`,
> `cooperativa-la-union-de-montilla`, `olivarera-madre-del-sol-adamuz`.

- [ ] **Cooperativa Olivarera de Lucena S.C.A.** — Aceite. Lucena.
  <https://cooperativalucena.es/> · tienda <https://cooperativalucena.es/tienda/>.
  Marca propia y tienda online → pista `Venta online=sí`.
- [ ] **Cooperativa Olivarera Ntra. Sra. de Araceli S.C.A.** — Aceite. Lucena.
  <https://www.cooperativaaraceli.es/>. Marcas propias «Araceli» y «Pagos de
  Aras» (gourmet); confirmar venta al público.
- [ ] **Cooperativa Olivarera de San José 'Oleollanos' S.C.A.** — Aceite.
  Los Llanos de Rute (Rute). Confirmar web y venta.
- [ ] **Cooperativa Agrícola La Unión de Montilla S.C.A.** — Aceite. Montilla.
  ⚠ Cruce con lote 1: la misma cooperativa figura como «Bodegas La Unión (C)» en
  Montilla-Moriles; si se integra, decidir si una fila (aceite + vino) o dos.
  Confirmar marca de consumo propia.

### DOP Montoro-Adamuz (7)

- [ ] **S.C.A. Agrícola Ntra. Madre del Sol** — Aceite. Adamuz. Marca «Olivar de
  Sierra»; la mayor y más premiada de la DOP. ⚠ Comercializa vía Cordoliva/DCOOP:
  confirmar venta con marca propia al consumidor. Portal:
  <https://madredelsol.sbportal.es/>.
- [ ] **S.C.A. Olivarera de Montoro** — Aceite. Montoro. ⚠ Grupo DCOOP; confirmar
  marca de consumo propia.
- [ ] **S.C.A. Olivarera Ntra. Sra. de la Merced** — Aceite. Villafranca de
  Córdoba (confirmar). ⚠ Grupo DCOOP.
- [ ] **S.C.A. del Campo San Antonio Abad** — Aceite. Villaviciosa de Córdoba
  (confirmar). ⚠ Grupo DCOOP.
- [ ] **S.C.A. Olivarera San Rafael** — Aceite. Villanueva del Rey (confirmar).
  Confirmar web/venta. (No confundir con la pastelería «San Rafael 1920» de
  Córdoba, ya en CSV.)
- [ ] **S.C.A. Olivarera Santiago** — Aceite. Montoro (confirmar). Confirmar
  web/venta.
- [ ] **S.C.A. Olivarera del Guadiato** — Aceite. Espiel (confirmar). ⚠ Grupo
  DCOOP.

## DOP Los Pedroches (jamón, lote 4 de do-huecos)

> Fuente de partida: «Industrias adscritas» del Consejo Regulador
> (<https://www.jamondolospedroches.es/industrias-adscritas-2/>, 20 industrias con
> web). Dedup 2026-07-09 por dominio/nombre: **la comarca ya está muy cubierta en
> el CSV** — 12 de las 20 ya presentes (Belloterra/Jamón de Los Pedroches, La
> Encina, Ibéricos de Cardeña, Familia Moreno, IBESA, La Finojosa, MajadaPedroche,
> Camilo Ríos, Señorío de Los Pedroches, Rodríguez Barbancho, David del Valle,
> Dehesas Reunidas). Quedan **8 net-new**. Municipio = donde está el secadero
> (comarca de Los Pedroches, norte de Córdoba).

> ✅ **Lote 1.3e integrado 2026-07-10**: 6 altas (5 `verificado` + `Venta online=sí`;
> Agroibérica `parcial` por TLS). Todas las charcuterías del jamón DOP venden con
> tienda propia. **Excluida COVAP** (gran grupo cooperativo industrial, regla dura).
> **La Embajada del Jamón**: confirmado que es **productor** con secadero propio
> (premio Encina de Oro), pero **diferida por municipio sin confirmar** («Polígono
> Industrial Cárnico», no geocodifica; reabrir con el municipio exacto). Slugs:
> `jamones-era-alta-villanueva-de-cordoba`, `navalpedroche-villanueva-de-cordoba`,
> `dehesa-de-campo-alto-espiel`, `jamon-jarote-villanueva-de-cordoba`,
> `mio-1898-pozoblanco`, `agroiberica-de-pozoblanco`.

- [ ] **Jamones Era Alta S.L.** — Charcutería (jamón ibérico DOP). Villanueva de
  Córdoba (confirmar). <https://jamoneseraalta.es/>.
- [ ] **Navalpedroche S.L.** — Charcutería (jamón ibérico DOP). Villanueva de
  Córdoba (confirmar). <https://navalpedroche.com/>.
- [ ] **Dehesa de Campo Alto S.L.** — Charcutería (jamón ibérico DOP). Confirmar
  municipio. <https://dehesadecampoalto.es/>.
- [ ] **Agroibérica de Pozoblanco S.L.** — Charcutería (jamón ibérico DOP).
  Pozoblanco. <https://agroibericadepozoblanco.es/>.
- [ ] **Jamón Jarote S.L.** — Charcutería (jamón ibérico DOP). Confirmar
  municipio. <https://jamonjarote.com/>.
- [ ] **MIO 1898 S.L.** — Charcutería (jamón ibérico DOP). Confirmar municipio.
  <https://mio1898.com/>.
- [ ] **COVAP, S.C.A.** — Charcutería (jamón ibérico DOP) / lácteos. Pozoblanco.
  <https://www.covap.es/>. Marca de consumo propia y tienda online → pista
  `Venta online=sí`. ⚠ **Gran grupo cooperativo** (Valle de los Pedroches, también
  lácteos/piensos): la regla dura excluye grandes grupos industriales; decidir en
  integración si su fuerte marca de consumo justifica una fila pese al tamaño.
- [ ] **Delicias Ibéricas por el Mundo S.L. (La Embajada del Jamón)** —
  Charcutería (jamón ibérico DOP). Confirmar municipio.
  <https://laembajadadeljamon.com/>. ⚠ Nombre comercial de tienda/comercializadora:
  confirmar que elabora con secadero propio y no es solo venta.
