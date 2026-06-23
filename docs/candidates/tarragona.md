# Candidatos — Cellers de la Xarxa de Rutes del Vi de Catalunya

> Origen: cruce de los cellers de las 9 Rutas del Vi de Catalunya (proyecto Xarxa de
> Rutes del Vi, govern.cat, jun-2026) contra `tarragona.csv`. Lista obtenida de las webs
> oficiales de cada DO / consejo regulador (registro completo, más amplio que el
> subconjunto de ~244 cellers «visitables» que cita la nota de prensa).
>
> **Estado: sin verificar.** Cada celler es un negocio real listado por su DO, pero
> antes de integrarlo hay que (1) re-deduplicar con `npx pnpm list:province tarragona`,
> (2) confirmar web/ubicación/actividad y (3) decidir `verificacion` y `Venta online`.
> Generado el 2026-06-15.
>
> **⮕ Cierre (2026-06-23):** completada la verificación profunda de `tarragona.csv`
> (68 `pendiente` legacy → 0; estado y lotes en `docs/tarragona-verificacion.md`).
> Resueltos los diferidos de Conca: **Mas de la Pansa integrado**, **Mas de la Creu**
> confirmado real (municipio por fijar), **Abadia de Poblet** rechazado (marca de
> Tintoré). Duplicado **Mas Martinet** fusionado. Esta nota queda como histórico de
> la expansión de vino; no es cola de revisión.


**Total inicial: 214 · cribado editorial 2026-06-15 · deduplicado local 2026-06-16.**

## Estado de revisión (cribado 2026-06-15)
- **DO Terra Alta: HECHA.** 17 integradas en `tarragona.csv` (todas `verificado`): Bàrbara Forés, Bielsa Ruano, Arrufí, Bernaví, Frisach, Josep Vicens, La Botera, Xavier Clua, Cellers Tarroné, Coma d'en Bonet, Edetària, Essència de Lluna, Herència Altés, Sant Josep Vins, Vins del Tros, Les Vinyes del Convent, Celler Menescal. **Descartadas 2:** *Catedral del Vi* = Cooperativa Pinellense (ya estaba) y *Comebé* = consorci Memorial Batalla de l'Ebre (no es celler).
- **Ya las teníamos (quitar de Conca):** *Agrícola de la Conca* (= fila Montblanc) y *Agrícola de Barberà* (= Coop. Agrícola de Barberà de la Conca).
- **Duplicados entre DOs (contar 1 vez):** Castell d'Or (Conca+Tgn), Clos Mogador (Priorat+Montsant), Josep Grau Viticultor (Priorat+Montsant), Noguerals (Priorat+Montsant).
- **Alias de web → nombre real (Priorat):** `www-arethealpriorat-com`=Aretheal Priorat · `https-closalkio-com`=Clos Alkio · `www-vinyesforermassard-com`=Les Vinyes Forer Massard.
- **DO Tarragona: HECHA.** 10 integradas (`verificado`): Biopaumerà, Castell d'Or, Coop. Vila-rodona, Celler 9+, Caves Magrinyà Calaf, Celler Pedrola (Camí de Sirga), Coop. Sant Isidre de Vilabella, Estol Verd, Terra Cellars, Vinya Janine. **Descartadas 2:** *Bodegas Embotelladoras* (sin ficha, nombre de embotellador, no verificable como KM0) y *Mas dels Frares* (bodega experimental de la Facultat d'Enologia URV, no es productor de consumo). *Castell d'Or* integrada aquí resuelve también el duplicado de Conca.
- **Conca de Barberà: HECHA.** 18 integradas en `tarragona.csv` (`verificado`): Aymar, Carles Andreu, Clos Montblanc, Costador, La Llena, Mas Foraster (Josep Foraster), Pla de la Masó, Mas de la Sabatera, Rendé Masdéu, Rosa Maria Torres, Sanstravé, Vega Aixalà, Vins de Pedra, Cellers Domenys, Família Torres-Milmanda, Gabor, Gerida, Succés Vinícola. **Descartadas:** Bodegas 1898 (sin ficha), Single Vineyards Collectors (sin ficha, négoci), Vins i Caves Portell (= Coop. Vinícola de Sarral, ya presente). **Movida a lleida.csv (provincia Lleida, no Tarragona):** *Cara Nord Celler* (`cara-nord-celler-el-vilosell`). **Diferidas → resueltas (2026-06-23):** Mas de la Pansa integrado (`mas-de-la-pansa-barbera-de-la-conca`); Mas de la Creu confirmado real (Vidbertus, municipio por fijar); Abadia de Poblet rechazado (marca de Celler Tintoré).
- **DO Montsant: HECHA + VERIFICADA (2026-06-21).** 44 filas nuevas en `tarragona.csv` (`Bodega`): **41 `verificado`, 3 `parcial`** (Spectacle Vins, Viñas del Montsant/Morlanda, El Vi dels 20 — sin web/canal comprobable hoy). Coordenadas afinadas (29 precisas Nominatim/web, 14 a centroide); `Venta online` comprobada producto a producto (**15 `sí`** con botiga propia o marketplace; resto `no`/`no comprobado`). Incluye los 3 `dup-of` canónicos en Priorat (Clos Mogador, Josep Grau, Noguerals). **Sin fila nueva:** *Venus la Universal – Sindicat la Figuera* (mismo productor, fusionado en `venus-la-universal-falset`) y *Agricola Ulldemolins* (ya presente como Aceite). **Homónimo:** override `el molar`→Priorat en `municipios-overrides.json`.
- **Dudoso encaje pendiente (Priorat):** Unió Fruits SCCL (coop de fruta).
- **Revisión local de duplicados 2026-06-16:** comparado contra `npx pnpm list:province tarragona` y `npx pnpm list:province tarragona --categoria Bodega`. Las secciones cerradas quedan con casillas `[x]` y `already-present`, `rejected`, `moved` o `dup-of` para no reabrirlas.
- **Fusión resuelta (2026-06-21):** *Agricola Ulldemolins* = `agricola-dulldemolins-ulldemolins` (`Aceite`, `parcial`), cuya fila ya recoge "vinos DO Montsant"; no se crea fila nueva.
- **DOQ Priorat: HECHA (2026-06-22).** 106 cellers integrados en `tarragona.csv` (lotes 1-12), con evidencia en `data/evidence/catalunya/tarragona.jsonl`. **1 diferido:** Gason Expert (= Totó Marqués, municipi/web no fiables). **1 dup-of:** Unió Fruits = `cellers-unio-reus`. Alias de web resueltos (Aretheal, Les Vinyes Forer Massard, Clos Alkio) y nombres reales tras alias (Clos de Lobac=Costers del Siurana, Clos de Lona=Clos de l'Ona, Domini de la Cartoixa=Clos Galena). **Resuelto (2026-06-23):** diferidas de Conca cerradas (Pansa integrado, Creu confirmado/municipio por fijar, Abadia rechazado). Repaso de `no comprobado` del vino iniciado (Lote 8 en `docs/tarragona-verificacion.md`): ~20 revisados, 11→`sí`; ~58 con web quedan como backfill de mantenimiento (no bloqueante).


## Ruta del Trepat i Vins de la Conca de Barberà  ·  ✅ HECHA (18 integradas; ver «Estado de revisión» arriba)

Fuente: https://www.doconcadebarbera.com/cellers-de-la-d-o-conca-de-barbera/


- [x] **Abadia de Poblet (Vimbodí i Poblet)** — rejected (2026-06-23): es una marca/línea de Celler Tintoré, no un productor independiente. No se crea fila.
- [x] **Aymar Vitivinícoles (Vimbodí i Poblet)** — already-present: `aymar-vitivinicoles-vimbodi-i-poblet`
- [x] **Bodegas 1898 (Horta d'Avinyó)** — rejected: sin ficha verificable como productor local
- [x] **Cara Nord Celler (El Vilosell)** — movida a `lleida.csv` como `cara-nord-celler-el-vilosell`
- [x] **Castell d'Or (L'Espluga de Francolí)** — already-present: `castell-dor-lespluga-de-francoli`
- [x] **Celler Carles Andreu (Pira)** — already-present: `celler-carles-andreu-pira`
- [x] **Celler Clos Montblanc (Barberà de la Conca)** — already-present: `clos-montblanc-barbera-de-la-conca`
- [x] **Celler Costador Terroirs Mediterranis (Barberà de la Conca)** — already-present: `celler-costador-barbera-de-la-conca`
- [x] **Celler La Llena (Vilanova de Prades)** — already-present: `celler-la-llena-vilanova-de-prades`
- [~] **Celler Mas de la Creu** — confirmado real (2026-06-23): es Celler Vidbertus, DO Conca de Barberà (web `masdelacreu.com`, IG `@cellermasdelacreu`). **Municipio por confirmar antes de crear fila:** el mas histórico (1860) figura en l'Espluga de Francolí, pero la vinificación se hace en el Viver de Celleristes de Barberà de la Conca y la DO lo lista en Barberà. Resolver sede/coords (vía `masdelacreu.com`) antes de insertar.
- [x] **Celler Mas de la Pansa (Barberà de la Conca)** — INTEGRADO (2026-06-23) como `mas-de-la-pansa-barbera-de-la-conca` (`parcial`, `Venta online=sí`/marketplace). Celler d'Imma Soler (des de 2016), vins ecològics; coords precisas (Nominatim), comprable en Bodeboca/Mentta.
- [x] **Celler Mas de la Sabatera (Montblanc)** — already-present: `celler-mas-de-la-sabatera-montblanc`
- [x] **Celler Mas Foraster (Montblanc)** — already-present: `celler-mas-foraster-montblanc`
- [x] **Celler Pla de la Masó (Barberà de la Conca)** — already-present: `celler-pla-de-la-maso-barbera-de-la-conca`
- [x] **Celler Rendé Masdéu (L'Espluga de Francolí)** — already-present: `celler-rende-masdeu-lespluga-de-francoli`
- [x] **Celler Rosa Mª Torres (Sarral)** — already-present: `celler-rosa-maria-torres-sarral`
- [x] **Celler Sanstravé (Solivella)** — already-present: `celler-sanstrave-solivella`
- [x] **Celler Vega Aixalà  (Vilanova de Prades)** — already-present: `celler-vega-aixala-vilanova-de-prades`
- [x] **Celler Vins de Pedra (Montblanc)** — already-present: `celler-vins-de-pedra-montblanc`
- [x] **Cellers Domenys i Secció de Crèdit (Blancafort, Pira i Rocafort de Queralt)** — already-present: `cellers-domenys-pira`
- [x] **Familia Torres (Vimbodí i Poblet)** — already-present: `familia-torres-milmanda-vimbodi-i-poblet`
- [x] **Gabor Celler (Barberà de la Conca)** — already-present: `gabor-celler-barbera-de-la-conca`
- [x] **Gerida Viticultors (Blancafort)** — already-present: `gerida-viticultors-blancafort`
- [x] **Single Vineyards Collectors (Barberà de la Conca)** — rejected: sin ficha verificable y perfil de négoci
- [x] **Succés Vinícola (Pira)** — already-present: `succes-vinicola-pira`
- [x] **Vins i Caves Portell (Sarral)** — dup-of: `cooperativa-vinicola-de-sarral-sarral`


## Ruta del Vi DOQ Priorat – DO Montsant · cellers DOQ Priorat  ·  111 candidatos

Estado por defecto: `unverified`. No integrar sin nueva comprobación de actividad, ubicación y venta online. Las líneas `canonical-dup` son la entrada que debe sobrevivir si también aparece en DO Montsant.

- [x] **Adrets del Priorat** — integrated: `adrets-del-priorat-torroja-del-priorat` (parcial; Torroja, sense web pròpia localitzable) — <https://www.doqpriorat.org/cellers/adrets-del-priorat/>
- [x] **Adria Domenech Simo** — integrated: `celler-lantic-magatzem-porrera` (nom comercial Celler l'Antic Magatzem, Porrera) — <https://www.doqpriorat.org/cellers/adria-domenech-simo/>
- [x] **Alicia i Josep Viticultors** — integrated: `alicia-i-josep-viticultors-porrera` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/alicia-i-josep-viticultors-sl/>
- [x] **Alvarez Duran Priorat** — integrated: `alvarez-duran-porrera` (verificado; Sal·lustià Àlvarez) — <https://www.doqpriorat.org/cellers/alvarez-duran-priorat-slu/>
- [x] **Alvaro Palacios** — integrated: `alvaro-palacios-gratallops` (verificado; venda per assignació, sense botiga) — <https://www.doqpriorat.org/cellers/alvaro-palacios-sl/>
- [x] **Arrels del Priorat** — integrated: `arrels-del-priorat-gratallops` (parcial; vins rancis, sense web pròpia) — <https://www.doqpriorat.org/cellers/arrels-del-priorat-scp/>
- [x] **Atavus Priorat** — integrated: `atavus-priorat-gratallops` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/atavus-priorat/>
- [x] **Balaguer i Cabre** — integrated: `balaguer-i-cabre-gratallops` (verificado; monovarietals garnatxa) — <https://www.doqpriorat.org/cellers/balaguer-i-cabre-sl/>
- [x] **Balmaprat** — integrated: `celler-balmaprat-porrera` (verificado; petit celler 2008) — <https://www.doqpriorat.org/cellers/balmaprat/>
- [x] **Bodega Bravo Escos** — integrated: `bravo-escos-torroja-del-priorat` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/bodega-bravo-escos-sl/>
- [x] **Bodegas Bg** — integrated: `bodegas-bg-gratallops` (Bordalás García, Gratallops; verificado) — <https://www.doqpriorat.org/cellers/bodegas-bg/>
- [x] **Bodegas Mas Alta** — integrated: `bodegas-mas-alta-la-vilella-alta` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/bodegas-mas-alta-sa/>
- [x] **Bodegas Y Vinedos Cal Grau** — integrated: `bodegas-vinedos-cal-grau-el-molar` (parcial; El Molar, grup Vinos Iberian) — <https://www.doqpriorat.org/cellers/bodegas-y-vinedos-cal-grau/>
- [x] **Buil Gine** — integrated: `buil-gine-gratallops` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/buil-gine-sl/>
- [x] **Burgos Porta** — integrated: `burgos-porta-mas-sinen-poboleda` (Mas Sinén, Poboleda; verificado, botiga online) — <https://www.doqpriorat.org/cellers/burgos-porta/>
- [x] **Cal Batllet Celler Ripoll Sans** — integrated: `cal-batllet-ripoll-sans-gratallops` (verificado; Marc Ripoll Sans) — <https://www.doqpriorat.org/cellers/cal-batllet-celler-ripoll-sans/>
- [x] **Casa Gran del Siurana** — integrated: `casa-gran-del-siurana-bellmunt-del-priorat` (Bellmunt; grup Perelada; verificado) — <https://www.doqpriorat.org/cellers/casa-gran-del-siurana-sl/>
- [x] **Castelo de Pedregosa** — integrated: `castelo-de-pedregosa-bellmunt-del-priorat` (parcial; casa de cava del Penedès amb projecte Celler Nûr a Bellmunt) — <https://www.doqpriorat.org/cellers/castelo-de-pedregosa-sl/>
- [x] **Celler Ardevol i Associats** — integrated: `celler-ardevol-i-associats-porrera` (verificado) — <https://www.doqpriorat.org/cellers/celler-ardevol-i-associats-sl/>
- [x] **Celler Cal Pla** — integrated: `celler-cal-pla-porrera` (verificado; Porrera des de 1814) — <https://www.doqpriorat.org/cellers/celler-cal-pla-sl/>
- [x] **Celler Castellet** — integrated: `celler-castellet-porrera` (verificado) — <https://www.doqpriorat.org/cellers/celler-castellet/>
- [x] **Celler Cecilio** — integrated: `celler-cecilio-gratallops` (verificado, botiga online; des de 1942) — <https://www.doqpriorat.org/cellers/celler-cecilio-sl/>
- [x] **Celler Cesca Vicent** — integrated: `celler-cesca-vicent-gratallops` (verificado; Gratallops, ecològic) — <https://www.doqpriorat.org/cellers/celler-cesca-vicent-sa/>
- [x] **Celler Clos 93 Priorat** — integrated: `celler-clos-93-el-lloar` (El Lloar; verificado, botiga online) — <https://www.doqpriorat.org/cellers/celler-clos-93-priorat-sl/>
- [x] **Celler Cristian Frances Breton** — integrated: `celler-cristian-frances-breto-torroja-del-priorat` (parcial; Torroja, sense web pròpia) — <https://www.doqpriorat.org/cellers/celler-cristian-frances-breton/>
- [x] **Celler Crivelle i Valls** — integrated: `celler-crivelle-i-valls-poboleda` (Poboleda; verificado, botiga online) — <https://www.doqpriorat.org/cellers/celler-crivelle-i-valls-sl/>
- [x] **Celler de Lencastell** — integrated: `celler-de-lencastell-porrera` (Roquers de Porrera; verificado, botiga online) — <https://www.doqpriorat.org/cellers/celler-de-lencastell/>
- [x] **Celler Escoda Palleja** — integrated: `celler-escoda-palleja-torroja-del-priorat` (parcial; Torroja, micro-celler) — <https://www.doqpriorat.org/cellers/celler-escoda-palleja/>
- [x] **Celler Familia Nin Ortiz** — integrated: `celler-familia-nin-ortiz-falset` (Falset, Finca Les Planetes; verificado, biodinàmic) — <https://www.doqpriorat.org/cellers/celler-familia-nin-ortiz-sl/>
- [x] **Celler Familia Sedo Barcelo** — integrated: `celler-familia-sedo-barcelo-bellmunt-del-priorat` (Bellmunt; verificado) — <https://www.doqpriorat.org/cellers/celler-familia-sedo-barcelo/>
- [x] **Celler Joan Simo** — integrated: `celler-joan-simo-porrera` (verificado; Porrera, Les Eres) — <https://www.doqpriorat.org/cellers/celler-joan-simo-sl/>
- [x] **Celler Jordi Domenech** — integrated: `celler-jordi-domenech-poboleda` (parcial; Poboleda, Clos Penat) — <https://www.doqpriorat.org/cellers/celler-jordi-domenech/>
- [x] **Celler Lo** — integrated: `celler-lo-la-vilella-baixa` (verificado; La Vilella Baixa) — <https://www.doqpriorat.org/cellers/celler-lo/>
- [x] **Celler Mas de les Pereres** — integrated: `celler-mas-de-les-pereres-poboleda` (Dirk Hoet / Nunci, Poboleda; verificado) — <https://www.doqpriorat.org/cellers/celler-mas-de-les-pereres-sl/>
- [x] **Celler Mas den Blei** — integrated: `celler-mas-den-blei-la-morera-de-montsant` (La Morera de Montsant; verificado, botiga online) — <https://www.doqpriorat.org/cellers/celler-mas-den-blei/>
- [x] **Celler Mas Doix** — integrated: `celler-mas-doix-poboleda` (Poboleda; verificado, botiga online) — <https://www.doqpriorat.org/cellers/celler-mas-doix-sl/>
- [x] **Celler Pasanau** — integrated: `celler-pasanau-la-morera-de-montsant` (verificado) — <https://www.doqpriorat.org/cellers/celler-pasanau/>
- [x] **Celler Pol Grifoll Declara** — integrated: `cellers-grifoll-declara-el-molar` (El Molar; verificado) — <https://www.doqpriorat.org/cellers/celler-pol-grifoll-declara/>
- [x] **Celler Rosa Ma Bartolome Vernet** — integrated: `celler-bartolome-bellmunt-del-priorat` (nom comercial Celler Bartolomé, Bellmunt; verificado) — <https://www.doqpriorat.org/cellers/celler-rosa-ma-bartolome-vernet/>
- [x] **Celler Sabate** — integrated: `celler-sabate-la-vilella-baixa` (La Vilella Baixa, des de 1910; verificado) — <https://www.doqpriorat.org/cellers/celler-sabate/>
- [x] **Celler Xavier Artiol** — integrated: `celler-xavier-artiol-falset` (parcial; Vins Mas Carlets, Falset) — <https://www.doqpriorat.org/cellers/celler-xavier-artiol/>
- [x] **Cellers Capafons Osso** — integrated: `cellers-capafons-osso-falset` (Falset; verificado) — <https://www.doqpriorat.org/cellers/cellers-capafons-osso-sl/>
- [x] **Cellers de la Cartoixa de Montsalvat** — integrated: `cartoixa-de-montsalvat-la-vilella-alta` (La Vilella Alta; verificado) — <https://www.doqpriorat.org/cellers/cellers-de-la-cartoixa-de-montsalvat-sl/>
- [x] **Cellers de Scala Dei** — integrated: `cellers-de-scala-dei-la-morera-de-montsant` (Escaladei; verificado, botiga online) — <https://www.doqpriorat.org/cellers/cellers-de-scala-dei-sa/>
- [x] **Cellers Melis** — integrated: `cellers-melis-torroja-del-priorat` (Torroja, ecològic; verificado) — <https://www.doqpriorat.org/cellers/cellers-melis/>
- [x] **Cellers Sabate Franquet** — integrated: `cellers-sabate-franquet-torroja-del-priorat` (Torroja; verificado) — <https://www.doqpriorat.org/cellers/cellers-sabate-franquet-sl/>
- [x] **Cellers Tane** — integrated: `cellers-tane-poboleda` (Poboleda; verificado) — <https://www.doqpriorat.org/cellers/cellers-tane/>
- [x] **Cims de Porrera** — integrated: `cims-de-porrera-porrera` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/cims-de-porrera/>
- [x] **Clos Berenguer** — integrated: `clos-berenguer-el-molar` (El Molar; verificado, botiga online) — <https://www.doqpriorat.org/cellers/clos-berenguer-sl/>
- [x] **Clos de Lobac** — integrated: `costers-del-siurana-gratallops` (= Costers del Siurana / Clos de l'Obac, Gratallops; verificado) — <https://www.doqpriorat.org/cellers/clos-de-lobac/>
- [x] **Clos de Lona** — integrated: `clos-de-lona-gratallops` (= Clos de l'Ona, Joan Farreras; parcial, sense web) — <https://www.doqpriorat.org/cellers/clos-de-lona/>
- [x] **Clos Dominic** — integrated: `clos-dominic-porrera` (Porrera; parcial, sense web pròpia) — <https://www.doqpriorat.org/cellers/clos-dominic-sl/>
- [x] **Clos Figueras** — integrated: `clos-figueras-gratallops` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/clos-figueras-sa/>
- [x] **Clos i Terrasses** — integrated: `clos-i-terrasses-gratallops` (= Clos Erasmus, Gratallops; parcial) — <https://www.doqpriorat.org/cellers/clos-i-terrasses/>
- [x] **Clos Mogador** — DOQ Priorat — already-present (vía DO Montsant): `clos-mogador-gratallops`; <https://www.doqpriorat.org/cellers/clos-mogador-sl/>
- [x] **Clos Pachem** — integrated: `clos-pachem-gratallops` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/clos-pachem/>
- [x] **Costers del Priorat** — integrated: `costers-del-priorat-el-molar` (El Molar; verificado, botiga online) — <https://www.doqpriorat.org/cellers/costers-del-priorat/>
- [x] **Devinssi** — integrated: `celler-devinssi-gratallops` (verificado) — <https://www.doqpriorat.org/cellers/devinssi-sl/>
- [x] **Domaines Magrez Espagne** — integrated: `domaines-magrez-espagne-porrera` (Porrera; parcial, sense web pròpia) — <https://www.doqpriorat.org/cellers/domaines-magrez-espagne-sl/>
- [x] **Domini de la Cartoixa** — integrated: `domini-de-la-cartoixa-el-molar` (= Clos Galena, El Molar; verificado, botiga online) — <https://www.doqpriorat.org/cellers/domini-de-la-cartoixa-sl/>
- [x] **Els Villusionistes** — integrated: `els-villusionistes-la-vilella-baixa` (La Vilella Baixa; verificado) — <https://www.doqpriorat.org/cellers/els-villusionistes/>
- [x] **En Numeros Vermells** — integrated: `en-numeros-vermells-gratallops` (Gratallops, vins naturals; verificado) — <https://www.doqpriorat.org/cellers/en-numeros-vermells/>
- [x] **Estriacus** — integrated: `estriacus-el-molar` (El Molar, Mas dels Frares; verificado) — <https://www.doqpriorat.org/cellers/estriacus-sl/>
- [x] **Ferrer Bobet** — integrated: `ferrer-bobet-falset` (Falset; verificado) — <https://www.doqpriorat.org/cellers/ferrer-bobet/>
- [ ] **Gason Expert** — deferred: `gason-expert-slu` = Bodegas Totó Marqués; única adreça localitzable és la del consell (placeholder) i vincle amb Prades (fora de les 9 viles DOQ). Reconfirmar municipi/web abans d'integrar — <https://www.doqpriorat.org/cellers/gason-expert-slu/>
- [x] **Genium Celler** — integrated: `genium-celler-poboleda` (Poboleda; verificado) — <https://www.doqpriorat.org/cellers/genium-celler-sl/>
- [x] **Giol Porrera** — integrated: `giol-porrera-porrera` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/giol-porrera/>
- [x] **Gran Clos** — integrated: `gran-clos-bellmunt-del-priorat` (Bellmunt; verificado, botiga online) — <https://www.doqpriorat.org/cellers/gran-clos/>
- [x] **Gratavinum** — integrated: `gratavinum-gratallops` (Gratallops, no Torroja; verificado, botiga online) — <https://www.doqpriorat.org/cellers/gratavinum-sl/>
- [x] **Hidalgo Albert** — integrated: `celler-hidalgo-albert-poboleda` (Poboleda; verificado) — <https://www.doqpriorat.org/cellers/hidalgo-albert/>
- [x] **Clos Alkio** — integrated: `clos-alkio-gratallops` (Gratallops, Mikko Alkio; verificado, botiga online) — alias `https-closalkio-com` resuelto
- [x] **Joan Ametller** — integrated: `celler-joan-ametller-la-morera-de-montsant` (verificado) — <https://www.doqpriorat.org/cellers/joan-ametller-sl/>
- [x] **Josep Grau Viticultors** — DOQ Priorat — already-present (vía DO Montsant): `josep-grau-viticultor-capcanes`; <https://www.doqpriorat.org/cellers/josep-grau-viticultors-sl/>
- [x] **La Cassola del Priorat** — integrated: `la-cassola-del-priorat-gratallops` (restaurant-celler, Gratallops; verificado) — <https://www.doqpriorat.org/cellers/la-cassola-del-priorat-sl/>
- [x] **La Conreria Dscala Dei** — integrated: `la-conreria-dscala-dei-la-morera-de-montsant` (Escaladei; verificado) — <https://www.doqpriorat.org/cellers/la-conreria-dscala-dei-sl/>
- [x] **Maius Viticultors** — integrated: `maius-viticultors-poboleda` (Poboleda; verificado, botiga online) — <https://www.doqpriorat.org/cellers/maius-viticultors-scp/>
- [x] **Marco Abella** — integrated: `marco-abella-porrera` (Porrera; verificado, botiga online) — <https://www.doqpriorat.org/cellers/marco-abella-sl/>
- [x] **Mas dels Estels** — integrated: `mas-dels-estels-falset` (parcial; ctra. Falset-Bellmunt, municipi aprox. Falset) — <https://www.doqpriorat.org/cellers/mas-dels-estels/>
- [x] **Mas Igneus** — integrated: `mas-igneus-gratallops` (Gratallops; verificado) — <https://www.doqpriorat.org/cellers/mas-igneus/>
- [x] **Mas la Mola** — integrated: `mas-la-mola-poboleda` (Poboleda; verificado) — <https://www.doqpriorat.org/cellers/mas-la-mola/>
- [x] **Mas Martinet Assessoraments** — integrated: `mas-martinet-assessoraments-falset` (marca Les Cousins; Falset; verificado) — <https://www.doqpriorat.org/cellers/mas-martinet-assessoraments-sl/>
- [x] **Mas Martinet Viticultors** — integrated: `mas-martinet-viticultors-falset` (Sara Pérez, Clos Martinet; Falset; verificado) — <https://www.doqpriorat.org/cellers/mas-martinet-viticultors-sl/>
- [x] **Mas Perinet** — integrated: `mas-perinet-poboleda` (Perinet Winery, Poboleda; verificado, botiga online) — <https://www.doqpriorat.org/cellers/mas-perinet-sl/>
- [x] **Meritxell Palleja** — integrated: `meritxell-palleja-gratallops` (marca Nita, Gratallops; verificado) — <https://www.doqpriorat.org/cellers/meritxell-palleja-slu/>
- [x] **Merum Priorati** — integrated: `merum-priorati-porrera` (Porrera, grup Pere Ventura; verificado) — <https://www.doqpriorat.org/cellers/merum-priorati-sl/>
- [x] **Miguel Caldentey Cabre** — integrated: `miguel-caldentey-gratallops` (Quod Agis, Gratallops; parcial, sense web) — <https://www.doqpriorat.org/cellers/miguel-caldentey-cabre/>
- [x] **Mussons Vins** — integrated: `mussons-vins-poboleda` (Poboleda; verificado, botiga online) — <https://www.doqpriorat.org/cellers/mussons-vins-sl/>
- [x] **Noguerals** — DOQ Priorat — already-present (vía DO Montsant): `celler-noguerals-cornudella-de-montsant`; <https://www.doqpriorat.org/cellers/noguerals-scp/>
- [x] **Peters Plot Hodgkinson Mas del Habanero** — integrated: `hodgkinson-mas-del-habanero-falset` (parcial; finca entre Falset i Gratallops, municipi aprox. Falset) — <https://www.doqpriorat.org/cellers/peters-plot-sl-hodgkinson-mas-del-habanero/>
- [x] **Pinord Mas Blanc** — integrated: `mas-blanc-pinord-falset` (finca Mas Blanc, Falset; verificado, botiga online) — <https://www.doqpriorat.org/cellers/pinord-mas-blanc/>
- [x] **Portal del Priorat** — integrated: `portal-del-priorat-gratallops` (Alfredo Arribas, Clos del Portal/El Lloar, oficina Gratallops; verificado) — <https://www.doqpriorat.org/cellers/portal-del-priorat-sl/>
- [x] **Ritme Celler** — integrated: `ritme-celler-la-vilella-alta` (Albert Jané/Acústic, La Vilella Alta; verificado, botiga online) — <https://www.doqpriorat.org/cellers/ritme-celler/>
- [x] **Roca de les Dotze** — integrated: `roca-de-les-dotze-la-vilella-alta` (La Vilella Alta; verificado) — <https://www.doqpriorat.org/cellers/roca-de-les-dotze/>
- [x] **Rotllan Terrones Celler Rotllan Torra** — integrated: `celler-rotllan-torra-torroja-del-priorat` (Torroja; verificado) — <https://www.doqpriorat.org/cellers/rotllan-terrones-sl-celler-rotllan-torra/>
- [x] **Sabate i Mur Vinaters** — integrated: `sabate-i-mur-vinaters-torroja-del-priorat` (Torroja, biodinàmic; verificado) — <https://www.doqpriorat.org/cellers/sabate-i-mur-vinaters/>
- [x] **Sandra Doix Celler** — integrated: `sandra-doix-poboleda` (parcial; projecte Marla, Poboleda) — <https://www.doqpriorat.org/cellers/sandra-doix-celler/>
- [x] **Sangenis i Vaque** — integrated: `sangenis-i-vaque-porrera` (Porrera; verificado, botiga online) — <https://www.doqpriorat.org/cellers/sangenis-i-vaque/>
- [x] **Sao del Coster** — integrated: `sao-del-coster-gratallops` (Gratallops, biodinàmic; verificado) — <https://www.doqpriorat.org/cellers/sao-del-coster/>
- [x] **Sola Classic** — integrated: `sola-classic-bellmunt-del-priorat` (Bellmunt, Mas Hereu; verificado) — <https://www.doqpriorat.org/cellers/sola-classic/>
- [x] **Terra del Priorat** — integrated: `terra-del-priorat-cornudella-de-montsant` (Cornudella de Montsant; verificado, vinoteca online) — <https://www.doqpriorat.org/cellers/terra-del-priorat/>
- [x] **Terra Dominicata** — integrated: `terra-dominicata-la-morera-de-montsant` (hotel-celler, La Morera; verificado) — <https://www.doqpriorat.org/cellers/terra-dominicata-slu/>
- [x] **Terres de Vidalba** — integrated: `terres-de-vidalba-poboleda` (Poboleda; verificado, botiga online) — <https://www.doqpriorat.org/cellers/terres-de-vidalba-sl/>
- [x] **Terroir Al Limit** — integrated: `terroir-al-limit-torroja-del-priorat` (Dominik Huber, Torroja; verificado) — <https://www.doqpriorat.org/cellers/terroir-al-limit-sl/>
- [x] **Torres Priorat** — integrated: `torres-priorat-el-lloar` (verificado; bodega Perpetual a El Lloar, distinta de `familia-torres-milmanda-vimbodi-i-poblet`) — <https://www.doqpriorat.org/cellers/torres-priorat-sl/>
- [x] **Trossos del Priorat** — integrated: `trossos-del-priorat-gratallops` (verificado, botiga online) — <https://www.doqpriorat.org/cellers/trossos-del-priorat/>
- [x] **Unio Fruits** — dup-of: `cellers-unio-reus` (= Grup/Cellers Unió, gran cooperativa multi-DO amb seu a Reus, ja present); sense fila nova — <https://www.doqpriorat.org/cellers/unio-fruits-sccl/>
- [x] **Vinicola del Priorat** — integrated: `vinicola-del-priorat-gratallops` (cooperativa, Gratallops, marca Ònix; verificado) — <https://www.doqpriorat.org/cellers/vinicola-del-priorat-sccl/>
- [x] **Viticultors del Priorat** — integrated: `viticultors-del-priorat-bellmunt-del-priorat` (marca Morlanda, Bellmunt; verificado) — <https://www.doqpriorat.org/cellers/viticultors-del-priorat-sl/>
- [x] **Viticultors Mas den Gil** — integrated: `viticultors-mas-den-gil-bellmunt-del-priorat` (Bellmunt; verificado, botiga online) — <https://www.doqpriorat.org/cellers/viticultors-mas-den-gil-sl/>
- [x] **Aretheal Priorat** — integrated: `aretheal-priorat-falset` (Marc Aguiló, Colls de Porrera/Falset; verificado) — alias `www-arethealpriorat-com` resuelto
- [x] **Les Vinyes Forer Massard** — integrated: `les-vinyes-forer-massard-poboleda` (David Forer MW & Franck Massard, Poboleda; verificado, botiga online) — alias `www-vinyesforermassard-com` resuelto


## Ruta del Vi DOQ Priorat – DO Montsant · cellers DO Montsant  ·  ✅ HECHA + VERIFICADA (44 filas: 41 verificado / 3 parcial; 2 sin fila — ver «Estado de revisión» arriba)

Fuente: https://www.domontsant.com/ + webs propias  ·  Integradas y **verificadas** 2026-06-21: **41 `verificado` / 3 `parcial`** (Spectacle Vins, Viñas del Montsant–Morlanda y El Vi dels 20: sin web/canal propio comprobable hoy). Coordenadas afinadas (29 precisas vía Nominatim/web, 14 a centroide de municipi). `Venta online` comprobada celler a celler: **15 `sí`** (botiga propia o marketplace). Los 3 `dup-of` (canónicos en DOQ Priorat) se resolvieron creando la fila aquí.

- [x] **Acustic Celler** — integrated: `acustic-celler-marca`
- [x] **Agricola Ulldemolins** — already-present (Aceite): `agricola-dulldemolins-ulldemolins` ya recoge "vinos DO Montsant"; sin fila nueva
- [x] **Alfredo Arribas** — integrated: `alfredo-arribas-vins-nus-falset` (marca Vins Nus)
- [x] **Bell Cros** — integrated: `bell-cros-falset`
- [x] **Celler Aibar** — integrated: `celler-aibar-darmos`
- [x] **Celler Anguera Domenech** — integrated: `celler-anguera-domenech-darmos`
- [x] **Celler Cairats** — integrated: `celler-cairats-darmos`
- [x] **Celler Cal Besso** — integrated: `celler-cal-besso-els-guiamets`
- [x] **Celler Cedo Anguera** — integrated: `celler-cedo-anguera-la-serra-dalmos`
- [x] **Celler Clos Mesorah** — integrated: `celler-clos-mesorah-marca`
- [x] **Celler Comunica** — integrated: `celler-comunica-falset`
- [x] **Celler Cooperatiu de Cornudella** — integrated: `celler-cooperatiu-de-cornudella-cornudella-de-montsant`
- [x] **Celler Cooperatiu el Molar** — integrated: `celler-cooperatiu-el-molar-el-molar` (homónimo: override `el molar`→Priorat)
- [x] **Celler de Capcanes** — integrated: `celler-de-capcanes-capcanes`
- [x] **Celler de Lera Mas de les Moreres** — integrated: `celler-de-lera-cornudella-de-montsant`
- [x] **Celler Dosterras** — integrated: `celler-dosterras-marca`
- [x] **Celler Gritelles** — integrated: `celler-gritelles-cornudella-de-montsant`
- [x] **Celler la Placeta** — integrated: `celler-la-placeta-els-guiamets`
- [x] **Celler Laurona** — integrated: `celler-laurona-falset`
- [x] **Celler Mas de les Vinyes** — integrated: `celler-mas-de-les-vinyes-cabaces`
- [x] **Celler Noguerals** — dup-of resuelto: integrated `celler-noguerals-cornudella-de-montsant`
- [x] **Celler Pascona** — integrated: `celler-pascona-falset`
- [x] **Celler Ronadelles** — integrated: `celler-ronadelles-cornudella-de-montsant` (marca Cap de Ruc)
- [x] **Celler Serra Major** — integrated: `celler-serra-major-ulldemolins` (marca Sarroges)
- [x] **Celler Vendrell Rived** — integrated: `celler-vendrell-rived-marca`
- [x] **Cellers Can Blau** — integrated: `cellers-can-blau-el-molar` (Gil Family Estates)
- [x] **Cellers Sant Rafel** — integrated: `cellers-sant-rafel-pradell-de-la-teixeta`
- [x] **Cingles Blaus** — integrated: `cingles-blaus-cornudella-de-montsant`
- [x] **Clos Maria** — integrated: `clos-maria-cornudella-de-montsant`
- [x] **Clos Mogador** — dup-of resuelto: integrated `clos-mogador-gratallops`
- [x] **Coca i Fito** — integrated: `coca-i-fito-el-masroig`
- [x] **Companyia Viticola Sileo** — integrated: `companyia-viticola-sileo-cornudella-de-montsant` (marca Atroca)
- [x] **El Vi dels 20** — integrated: `el-vi-dels-20-falset`
- [x] **Estones Vins** — integrated: `estones-vins-falset`
- [x] **Josep Grau Viticultor** — dup-of resuelto: integrated `josep-grau-viticultor-capcanes`
- [x] **Mas de Labundancia** — integrated: `mas-de-labundancia-el-masroig`
- [x] **Orto Vins** — integrated: `orto-vins-el-masroig`
- [x] **Serra i Barcelo** — integrated: `serra-i-barcelo-els-guiamets`
- [x] **Spectacle Vins** — integrated: `spectacle-vins-falset` (família Barbier / Clos Mogador)
- [x] **Terravinyada** — integrated: `terravinyada-falset`
- [x] **Terroir Sense Fronteres** — integrated: `terroir-sense-fronteres-torroja-del-priorat`
- [x] **Venus la Universal** — integrated: `venus-la-universal-falset`
- [x] **Venus la Universal Sindicat la Figuera** — merged: mismo productor (Sara Pérez/René Barbier), celler de La Figuera; sin fila nueva → `venus-la-universal-falset`
- [x] **Vinas del Montsant** — integrated: `vinas-del-montsant-marca` (marca Morlanda)
- [x] **Vinyes den Gabriel** — integrated: `vinyes-den-gabriel-darmos`
- [x] **Vinyes Domenech** — integrated: `vinyes-domenech-capcanes`

## Ruta del Vi DO Tarragona  ·  ✅ HECHA (10 integradas, 2 descartadas — ver «Estado de revisión» arriba)

Fuente: https://www.dotarragona.cat/


- [x] **Biopaumerà** — already-present: `biopaumera-rasquera`
- [x] **Bodegas Embotelladoras** — rejected: sin ficha de productor local verificable
- [x] **Castell d'Or** — already-present: `castell-dor-lespluga-de-francoli`
- [x] **Celler 9+** — already-present: `celler-9-mes-la-nou-de-gaia`
- [x] **Celler Cooperatiu de Vila-Rodona** — already-present: `celler-cooperatiu-vila-rodona`
- [x] **Celler Magrinyà Calaf** — already-present: `caves-magrinya-calaf-nulles`
- [x] **Celler Mas dels Frares - URV** — rejected: bodega experimental universitaria, no productor de consumo
- [x] **Celler Pedrola** — already-present: `celler-pedrola-miravet`
- [x] **Cooperativa Sant Isidre de Vilabella** — already-present: `cooperativa-sant-isidre-vilabella`
- [x] **Estol Verd Celler** — already-present: `estol-verd-celler-rodonya`
- [x] **Terra Cellars** — already-present: `terra-cellars-les-borges-del-camp`
- [x] **Vinya Janine** — already-present: `vinya-janine-rodonya`


## Ruta del Vi DO Terra Alta  ·  ✅ HECHA (17 integradas, 2 descartadas — ver «Estado de revisión» arriba)

- [x] **Barbara Fores** — already-present: `celler-barbara-fores-gandesa` — <https://www.doterraalta.com/rutadoterraalta/listing-type/barbara-fores/>
- [x] **Bielsa Ruano** — already-present: `bielsa-ruano-vilalba-dels-arcs` — <https://www.doterraalta.com/rutadoterraalta/listing-type/bielsa-ruano/>
- [x] **Catedral del Vi Modernista Celler** — dup-of: `cooperativa-agricola-pinellense-el-pinell-de-brai` — <https://www.doterraalta.com/rutadoterraalta/listing-type/catedral-del-vi-modernista-celler/>
- [x] **Celler Arrufi** — already-present: `celler-arrufi-batea` — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-arrufi/>
- [x] **Celler Bernavi** — already-present: `celler-bernavi-vilalba-dels-arcs` — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-bernavi/>
- [x] **Celler Cal Menescal** — already-present: `celler-menescal-bot` — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-cal-menescal/>
- [x] **Celler Frisach** — already-present: `celler-frisach-corbera-debre` — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-frisach/>
- [x] **Celler Josep Vicens** — already-present: `celler-josep-vicens-gandesa` — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-josep-vicens/>
- [x] **Celler la Botera** — already-present: `celler-la-botera-batea` — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-la-botera/>
- [x] **Celler Xavier Clua** — already-present: `celler-xavier-clua-vilalba-dels-arcs` — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-xavier-clua/>
- [x] **Cellers Tarrone** — already-present: `cellers-tarrone-batea` — <https://www.doterraalta.com/rutadoterraalta/listing-type/cellers-tarrone/>
- [x] **Coma den Bonet** — already-present: `celler-coma-den-bonet-gandesa` — <https://www.doterraalta.com/rutadoterraalta/listing-type/coma-den-bonet/>
- [x] **Comebe** — rejected: consorci Memorial Batalla de l'Ebre, no celler productor — <https://www.doterraalta.com/rutadoterraalta/listing-type/comebe/>
- [x] **Edetaria** — already-present: `edetaria-gandesa` — <https://www.doterraalta.com/rutadoterraalta/listing-type/edetaria/>
- [x] **Essencia de Lluna** — already-present: `essencia-de-lluna-gandesa` — <https://www.doterraalta.com/rutadoterraalta/listing-type/essencia-de-lluna/>
- [x] **Herencia Altes** — already-present: `herencia-altes-batea` — <https://www.doterraalta.com/rutadoterraalta/listing-type/herencia-altes/>
- [x] **Les Vinyes del Convent** — already-present: `les-vinyes-del-convent-horta-de-sant-joan` — <https://www.doterraalta.com/rutadoterraalta/listing-type/les-vinyes-del-convent/>
- [x] **Sant Josep Vins** — already-present: `sant-josep-vins-bot` — <https://www.doterraalta.com/rutadoterraalta/listing-type/sant-josep-vins/>
- [x] **Vins del Tros** — already-present: `vins-del-tros-vilalba-dels-arcs` — <https://www.doterraalta.com/rutadoterraalta/listing-type/vins-del-tros/>
