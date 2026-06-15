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


**Total inicial: 214 · revisado 2026-06-15.**

## Estado de revisión (cribado 2026-06-15)
- **DO Terra Alta: HECHA.** 17 integradas en `tarragona.csv` (todas `verificado`): Bàrbara Forés, Bielsa Ruano, Arrufí, Bernaví, Frisach, Josep Vicens, La Botera, Xavier Clua, Cellers Tarroné, Coma d'en Bonet, Edetària, Essència de Lluna, Herència Altés, Sant Josep Vins, Vins del Tros, Les Vinyes del Convent, Celler Menescal. **Descartadas 2:** *Catedral del Vi* = Cooperativa Pinellense (ya estaba) y *Comebé* = consorci Memorial Batalla de l'Ebre (no es celler).
- **Ya las teníamos (quitar de Conca):** *Agrícola de la Conca* (= fila Montblanc) y *Agrícola de Barberà* (= Coop. Agrícola de Barberà de la Conca).
- **Duplicados entre DOs (contar 1 vez):** Castell d'Or (Conca+Tgn), Clos Mogador (Priorat+Montsant), Josep Grau Viticultor (Priorat+Montsant), Noguerals (Priorat+Montsant).
- **Slugs de web → nombre real (Priorat):** `www-arethealpriorat-com`=Aretheal Priorat · `https-closalkio-com`=Clos Alkio · `www-vinyesforermassard-com`=Les Vinyes Forer Massard.
- **DO Tarragona: HECHA.** 10 integradas (`verificado`): Biopaumerà, Castell d'Or, Coop. Vila-rodona, Celler 9+, Caves Magrinyà Calaf, Celler Pedrola (Camí de Sirga), Coop. Sant Isidre de Vilabella, Estol Verd, Terra Cellars, Vinya Janine. **Descartadas 2:** *Bodegas Embotelladoras* (sin ficha, nombre de embotellador, no verificable como KM0) y *Mas dels Frares* (bodega experimental de la Facultat d'Enologia URV, no es productor de consumo). *Castell d'Or* integrada aquí resuelve también el duplicado de Conca.
- **Conca de Barberà: HECHA.** 18 integradas en `tarragona.csv` (`verificado`): Aymar, Carles Andreu, Clos Montblanc, Costador, La Llena, Mas Foraster (Josep Foraster), Pla de la Masó, Mas de la Sabatera, Rendé Masdéu, Rosa Maria Torres, Sanstravé, Vega Aixalà, Vins de Pedra, Cellers Domenys, Família Torres-Milmanda, Gabor, Gerida, Succés Vinícola. **Descartadas:** Bodegas 1898 (sin ficha), Single Vineyards Collectors (sin ficha, négoci), Vins i Caves Portell (= Coop. Vinícola de Sarral, ya presente). **A lleida.csv (provincia Lleida, no Tarragona):** *Cara Nord Celler* (El Vilosell, 41.3825/0.9473, web caranordceller.com, sí/ecommerce) — pendiente de añadir a `lleida.csv`. **Diferidas (sin ficha Google localizable):** Abadia de Poblet (marca de Celler Tintoré, Vimbodí), Celler Mas de la Creu (Barberà), Celler Mas de la Pansa (Barberà).
- **Dudoso encaje pendiente (Priorat):** Unió Fruits SCCL (coop de fruta).
- **Pendiente:** DO Montsant (~43), DOQ Priorat (~108). Cara Nord (Lleida) + 3 diferidas de Conca.


## Ruta del Trepat i Vins de la Conca de Barberà  ·  ✅ HECHA (18 integradas; ver «Estado de revisión» arriba)

Fuente: https://www.doconcadebarbera.com/cellers-de-la-d-o-conca-de-barbera/


- [ ] **Abadia de Poblet (Vimbodí i Poblet)** — DO Conca de Barberà
- [ ] **Aymar Vitivinícoles (Vimbodí i Poblet)** — DO Conca de Barberà
- [ ] **Bodegas 1898 (Horta d'Avinyó)** — DO Conca de Barberà
- [ ] **Cara Nord Celler (El Vilosell)** — DO Conca de Barberà
- [ ] **Castell d'Or (L'Espluga de Francolí)** — DO Conca de Barberà
- [ ] **Celler Carles Andreu (Pira)** — DO Conca de Barberà
- [ ] **Celler Clos Montblanc (Barberà de la Conca)** — DO Conca de Barberà
- [ ] **Celler Costador Terroirs Mediterranis (Barberà de la Conca)** — DO Conca de Barberà
- [ ] **Celler La Llena (Vilanova de Prades)** — DO Conca de Barberà
- [ ] **Celler Mas de la Creu (Barberà de la Conca)** — DO Conca de Barberà
- [ ] **Celler Mas de la Pansa (Barberà de la Conca)** — DO Conca de Barberà
- [ ] **Celler Mas de la Sabatera (Montblanc)** — DO Conca de Barberà
- [ ] **Celler Mas Foraster (Montblanc)** — DO Conca de Barberà
- [ ] **Celler Pla de la Masó (Barberà de la Conca)** — DO Conca de Barberà
- [ ] **Celler Rendé Masdéu (L'Espluga de Francolí)** — DO Conca de Barberà
- [ ] **Celler Rosa Mª Torres (Sarral)** — DO Conca de Barberà
- [ ] **Celler Sanstravé (Solivella)** — DO Conca de Barberà
- [ ] **Celler Vega Aixalà  (Vilanova de Prades)** — DO Conca de Barberà
- [ ] **Celler Vins de Pedra (Montblanc)** — DO Conca de Barberà
- [ ] **Cellers Domenys i Secció de Crèdit (Blancafort, Pira i Rocafort de Queralt)** — DO Conca de Barberà
- [ ] **Familia Torres (Vimbodí i Poblet)** — DO Conca de Barberà
- [ ] **Gabor Celler (Barberà de la Conca)** — DO Conca de Barberà
- [ ] **Gerida Viticultors (Blancafort)** — DO Conca de Barberà
- [ ] **Single Vineyards Collectors (Barberà de la Conca)** — DO Conca de Barberà
- [ ] **Succés Vinícola (Pira)** — DO Conca de Barberà
- [ ] **Vins i Caves Portell (Sarral)** — DO Conca de Barberà


## Ruta del Vi DOQ Priorat – DO Montsant · cellers DOQ Priorat  ·  111 candidatos

- [ ] **Adrets del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/adrets-del-priorat/>
- [ ] **Adria Domenech Simo** — DOQ Priorat — <https://www.doqpriorat.org/cellers/adria-domenech-simo/>
- [ ] **Alicia i Josep Viticultors** — DOQ Priorat — <https://www.doqpriorat.org/cellers/alicia-i-josep-viticultors-sl/>
- [ ] **Alvarez Duran Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/alvarez-duran-priorat-slu/>
- [ ] **Alvaro Palacios** — DOQ Priorat — <https://www.doqpriorat.org/cellers/alvaro-palacios-sl/>
- [ ] **Arrels del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/arrels-del-priorat-scp/>
- [ ] **Atavus Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/atavus-priorat/>
- [ ] **Balaguer i Cabre** — DOQ Priorat — <https://www.doqpriorat.org/cellers/balaguer-i-cabre-sl/>
- [ ] **Balmaprat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/balmaprat/>
- [ ] **Bodega Bravo Escos** — DOQ Priorat — <https://www.doqpriorat.org/cellers/bodega-bravo-escos-sl/>
- [ ] **Bodegas Bg** — DOQ Priorat — <https://www.doqpriorat.org/cellers/bodegas-bg/>
- [ ] **Bodegas Mas Alta** — DOQ Priorat — <https://www.doqpriorat.org/cellers/bodegas-mas-alta-sa/>
- [ ] **Bodegas Y Vinedos Cal Grau** — DOQ Priorat — <https://www.doqpriorat.org/cellers/bodegas-y-vinedos-cal-grau/>
- [ ] **Buil Gine** — DOQ Priorat — <https://www.doqpriorat.org/cellers/buil-gine-sl/>
- [ ] **Burgos Porta** — DOQ Priorat — <https://www.doqpriorat.org/cellers/burgos-porta/>
- [ ] **Cal Batllet Celler Ripoll Sans** — DOQ Priorat — <https://www.doqpriorat.org/cellers/cal-batllet-celler-ripoll-sans/>
- [ ] **Casa Gran del Siurana** — DOQ Priorat — <https://www.doqpriorat.org/cellers/casa-gran-del-siurana-sl/>
- [ ] **Castelo de Pedregosa** — DOQ Priorat — <https://www.doqpriorat.org/cellers/castelo-de-pedregosa-sl/>
- [ ] **Celler Ardevol i Associats** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-ardevol-i-associats-sl/>
- [ ] **Celler Cal Pla** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-cal-pla-sl/>
- [ ] **Celler Castellet** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-castellet/>
- [ ] **Celler Cecilio** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-cecilio-sl/>
- [ ] **Celler Cesca Vicent** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-cesca-vicent-sa/>
- [ ] **Celler Clos 93 Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-clos-93-priorat-sl/>
- [ ] **Celler Cristian Frances Breton** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-cristian-frances-breton/>
- [ ] **Celler Crivelle i Valls** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-crivelle-i-valls-sl/>
- [ ] **Celler de Lencastell** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-de-lencastell/>
- [ ] **Celler Escoda Palleja** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-escoda-palleja/>
- [ ] **Celler Familia Nin Ortiz** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-familia-nin-ortiz-sl/>
- [ ] **Celler Familia Sedo Barcelo** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-familia-sedo-barcelo/>
- [ ] **Celler Joan Simo** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-joan-simo-sl/>
- [ ] **Celler Jordi Domenech** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-jordi-domenech/>
- [ ] **Celler Lo** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-lo/>
- [ ] **Celler Mas de les Pereres** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-mas-de-les-pereres-sl/>
- [ ] **Celler Mas den Blei** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-mas-den-blei/>
- [ ] **Celler Mas Doix** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-mas-doix-sl/>
- [ ] **Celler Pasanau** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-pasanau/>
- [ ] **Celler Pol Grifoll Declara** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-pol-grifoll-declara/>
- [ ] **Celler Rosa Ma Bartolome Vernet** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-rosa-ma-bartolome-vernet/>
- [ ] **Celler Sabate** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-sabate/>
- [ ] **Celler Xavier Artiol** — DOQ Priorat — <https://www.doqpriorat.org/cellers/celler-xavier-artiol/>
- [ ] **Cellers Capafons Osso** — DOQ Priorat — <https://www.doqpriorat.org/cellers/cellers-capafons-osso-sl/>
- [ ] **Cellers de la Cartoixa de Montsalvat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/cellers-de-la-cartoixa-de-montsalvat-sl/>
- [ ] **Cellers de Scala Dei** — DOQ Priorat — <https://www.doqpriorat.org/cellers/cellers-de-scala-dei-sa/>
- [ ] **Cellers Melis** — DOQ Priorat — <https://www.doqpriorat.org/cellers/cellers-melis/>
- [ ] **Cellers Sabate Franquet** — DOQ Priorat — <https://www.doqpriorat.org/cellers/cellers-sabate-franquet-sl/>
- [ ] **Cellers Tane** — DOQ Priorat — <https://www.doqpriorat.org/cellers/cellers-tane/>
- [ ] **Cims de Porrera** — DOQ Priorat — <https://www.doqpriorat.org/cellers/cims-de-porrera/>
- [ ] **Clos Berenguer** — DOQ Priorat — <https://www.doqpriorat.org/cellers/clos-berenguer-sl/>
- [ ] **Clos de Lobac** — DOQ Priorat — <https://www.doqpriorat.org/cellers/clos-de-lobac/>
- [ ] **Clos de Lona** — DOQ Priorat — <https://www.doqpriorat.org/cellers/clos-de-lona/>
- [ ] **Clos Dominic** — DOQ Priorat — <https://www.doqpriorat.org/cellers/clos-dominic-sl/>
- [ ] **Clos Figueras** — DOQ Priorat — <https://www.doqpriorat.org/cellers/clos-figueras-sa/>
- [ ] **Clos i Terrasses** — DOQ Priorat — <https://www.doqpriorat.org/cellers/clos-i-terrasses/>
- [ ] **Clos Mogador** — DOQ Priorat — <https://www.doqpriorat.org/cellers/clos-mogador-sl/>
- [ ] **Clos Pachem** — DOQ Priorat — <https://www.doqpriorat.org/cellers/clos-pachem/>
- [ ] **Costers del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/costers-del-priorat/>
- [ ] **Devinssi** — DOQ Priorat — <https://www.doqpriorat.org/cellers/devinssi-sl/>
- [ ] **Domaines Magrez Espagne** — DOQ Priorat — <https://www.doqpriorat.org/cellers/domaines-magrez-espagne-sl/>
- [ ] **Domini de la Cartoixa** — DOQ Priorat — <https://www.doqpriorat.org/cellers/domini-de-la-cartoixa-sl/>
- [ ] **Els Villusionistes** — DOQ Priorat — <https://www.doqpriorat.org/cellers/els-villusionistes/>
- [ ] **En Numeros Vermells** — DOQ Priorat — <https://www.doqpriorat.org/cellers/en-numeros-vermells/>
- [ ] **Estriacus** — DOQ Priorat — <https://www.doqpriorat.org/cellers/estriacus-sl/>
- [ ] **Ferrer Bobet** — DOQ Priorat — <https://www.doqpriorat.org/cellers/ferrer-bobet/>
- [ ] **Gason Expert** — DOQ Priorat — <https://www.doqpriorat.org/cellers/gason-expert-slu/>
- [ ] **Genium Celler** — DOQ Priorat — <https://www.doqpriorat.org/cellers/genium-celler-sl/>
- [ ] **Giol Porrera** — DOQ Priorat — <https://www.doqpriorat.org/cellers/giol-porrera/>
- [ ] **Gran Clos** — DOQ Priorat — <https://www.doqpriorat.org/cellers/gran-clos/>
- [ ] **Gratavinum** — DOQ Priorat — <https://www.doqpriorat.org/cellers/gratavinum-sl/>
- [ ] **Hidalgo Albert** — DOQ Priorat — <https://www.doqpriorat.org/cellers/hidalgo-albert/>
- [ ] **«https-closalkio-com» (verificar nom)** — DOQ Priorat
- [ ] **Joan Ametller** — DOQ Priorat — <https://www.doqpriorat.org/cellers/joan-ametller-sl/>
- [ ] **Josep Grau Viticultors** — DOQ Priorat — <https://www.doqpriorat.org/cellers/josep-grau-viticultors-sl/>
- [ ] **La Cassola del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/la-cassola-del-priorat-sl/>
- [ ] **La Conreria Dscala Dei** — DOQ Priorat — <https://www.doqpriorat.org/cellers/la-conreria-dscala-dei-sl/>
- [ ] **Maius Viticultors** — DOQ Priorat — <https://www.doqpriorat.org/cellers/maius-viticultors-scp/>
- [ ] **Marco Abella** — DOQ Priorat — <https://www.doqpriorat.org/cellers/marco-abella-sl/>
- [ ] **Mas dels Estels** — DOQ Priorat — <https://www.doqpriorat.org/cellers/mas-dels-estels/>
- [ ] **Mas Igneus** — DOQ Priorat — <https://www.doqpriorat.org/cellers/mas-igneus/>
- [ ] **Mas la Mola** — DOQ Priorat — <https://www.doqpriorat.org/cellers/mas-la-mola/>
- [ ] **Mas Martinet Assessoraments** — DOQ Priorat — <https://www.doqpriorat.org/cellers/mas-martinet-assessoraments-sl/>
- [ ] **Mas Martinet Viticultors** — DOQ Priorat — <https://www.doqpriorat.org/cellers/mas-martinet-viticultors-sl/>
- [ ] **Mas Perinet** — DOQ Priorat — <https://www.doqpriorat.org/cellers/mas-perinet-sl/>
- [ ] **Meritxell Palleja** — DOQ Priorat — <https://www.doqpriorat.org/cellers/meritxell-palleja-slu/>
- [ ] **Merum Priorati** — DOQ Priorat — <https://www.doqpriorat.org/cellers/merum-priorati-sl/>
- [ ] **Miguel Caldentey Cabre** — DOQ Priorat — <https://www.doqpriorat.org/cellers/miguel-caldentey-cabre/>
- [ ] **Mussons Vins** — DOQ Priorat — <https://www.doqpriorat.org/cellers/mussons-vins-sl/>
- [ ] **Noguerals** — DOQ Priorat — <https://www.doqpriorat.org/cellers/noguerals-scp/>
- [ ] **Peters Plot Hodgkinson Mas del Habanero** — DOQ Priorat — <https://www.doqpriorat.org/cellers/peters-plot-sl-hodgkinson-mas-del-habanero/>
- [ ] **Pinord Mas Blanc** — DOQ Priorat — <https://www.doqpriorat.org/cellers/pinord-mas-blanc/>
- [ ] **Portal del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/portal-del-priorat-sl/>
- [ ] **Ritme Celler** — DOQ Priorat — <https://www.doqpriorat.org/cellers/ritme-celler/>
- [ ] **Roca de les Dotze** — DOQ Priorat — <https://www.doqpriorat.org/cellers/roca-de-les-dotze/>
- [ ] **Rotllan Terrones Celler Rotllan Torra** — DOQ Priorat — <https://www.doqpriorat.org/cellers/rotllan-terrones-sl-celler-rotllan-torra/>
- [ ] **Sabate i Mur Vinaters** — DOQ Priorat — <https://www.doqpriorat.org/cellers/sabate-i-mur-vinaters/>
- [ ] **Sandra Doix Celler** — DOQ Priorat — <https://www.doqpriorat.org/cellers/sandra-doix-celler/>
- [ ] **Sangenis i Vaque** — DOQ Priorat — <https://www.doqpriorat.org/cellers/sangenis-i-vaque/>
- [ ] **Sao del Coster** — DOQ Priorat — <https://www.doqpriorat.org/cellers/sao-del-coster/>
- [ ] **Sola Classic** — DOQ Priorat — <https://www.doqpriorat.org/cellers/sola-classic/>
- [ ] **Terra del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/terra-del-priorat/>
- [ ] **Terra Dominicata** — DOQ Priorat — <https://www.doqpriorat.org/cellers/terra-dominicata-slu/>
- [ ] **Terres de Vidalba** — DOQ Priorat — <https://www.doqpriorat.org/cellers/terres-de-vidalba-sl/>
- [ ] **Terroir Al Limit** — DOQ Priorat — <https://www.doqpriorat.org/cellers/terroir-al-limit-sl/>
- [ ] **Torres Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/torres-priorat-sl/>
- [ ] **Trossos del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/trossos-del-priorat/>
- [ ] **Unio Fruits** — DOQ Priorat — <https://www.doqpriorat.org/cellers/unio-fruits-sccl/>
- [ ] **Vinicola del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/vinicola-del-priorat-sccl/>
- [ ] **Viticultors del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/viticultors-del-priorat-sl/>
- [ ] **Viticultors Mas den Gil** — DOQ Priorat — <https://www.doqpriorat.org/cellers/viticultors-mas-den-gil-sl/>
- [ ] **«www-arethealpriorat-com» (verificar nom)** — DOQ Priorat
- [ ] **«www-vinyesforermassard-com» (verificar nom)** — DOQ Priorat


## Ruta del Vi DOQ Priorat – DO Montsant · cellers DO Montsant  ·  46 candidatos

- [ ] **Acustic Celler** — DO Montsant — <https://www.domontsant.com/celler/acustic-celler/>
- [ ] **Agricola Ulldemolins** — DO Montsant — <https://www.domontsant.com/celler/agricola-ulldemolins/>
- [ ] **Alfredo Arribas** — DO Montsant — <https://www.domontsant.com/celler/alfredo-arribas/>
- [ ] **Bell Cros** — DO Montsant — <https://www.domontsant.com/celler/bell-cros/>
- [ ] **Celler Aibar** — DO Montsant — <https://www.domontsant.com/celler/celler-aibar/>
- [ ] **Celler Anguera Domenech** — DO Montsant — <https://www.domontsant.com/celler/celler-anguera-domenech/>
- [ ] **Celler Cairats** — DO Montsant — <https://www.domontsant.com/celler/celler-cairats/>
- [ ] **Celler Cal Besso** — DO Montsant — <https://www.domontsant.com/celler/celler-cal-besso/>
- [ ] **Celler Cedo Anguera** — DO Montsant — <https://www.domontsant.com/celler/celler-cedo-anguera/>
- [ ] **Celler Clos Mesorah** — DO Montsant — <https://www.domontsant.com/celler/celler-clos-mesorah/>
- [ ] **Celler Comunica** — DO Montsant — <https://www.domontsant.com/celler/celler-comunica/>
- [ ] **Celler Cooperatiu de Cornudella** — DO Montsant — <https://www.domontsant.com/celler/celler-cooperatiu-de-cornudella/>
- [ ] **Celler Cooperatiu el Molar** — DO Montsant — <https://www.domontsant.com/celler/celler-cooperatiu-el-molar/>
- [ ] **Celler de Capcanes** — DO Montsant — <https://www.domontsant.com/celler/celler-de-capcanes/>
- [ ] **Celler de Lera Mas de les Moreres** — DO Montsant — <https://www.domontsant.com/celler/celler-de-lera-mas-de-les-moreres/>
- [ ] **Celler Dosterras** — DO Montsant — <https://www.domontsant.com/celler/celler-dosterras/>
- [ ] **Celler Gritelles** — DO Montsant — <https://www.domontsant.com/celler/celler-gritelles/>
- [ ] **Celler la Placeta** — DO Montsant — <https://www.domontsant.com/celler/celler-la-placeta/>
- [ ] **Celler Laurona** — DO Montsant — <https://www.domontsant.com/celler/celler-laurona/>
- [ ] **Celler Mas de les Vinyes** — DO Montsant — <https://www.domontsant.com/celler/celler-mas-de-les-vinyes/>
- [ ] **Celler Noguerals** — DO Montsant — <https://www.domontsant.com/celler/celler-noguerals/>
- [ ] **Celler Pascona** — DO Montsant — <https://www.domontsant.com/celler/celler-pascona/>
- [ ] **Celler Ronadelles** — DO Montsant — <https://www.domontsant.com/celler/celler-ronadelles/>
- [ ] **Celler Serra Major** — DO Montsant — <https://www.domontsant.com/celler/celler-serra-major/>
- [ ] **Celler Vendrell Rived** — DO Montsant — <https://www.domontsant.com/celler/celler-vendrell-rived/>
- [ ] **Cellers Can Blau** — DO Montsant — <https://www.domontsant.com/celler/cellers-can-blau/>
- [ ] **Cellers Sant Rafel** — DO Montsant — <https://www.domontsant.com/celler/cellers-sant-rafel/>
- [ ] **Cingles Blaus** — DO Montsant — <https://www.domontsant.com/celler/cingles-blaus/>
- [ ] **Clos Maria** — DO Montsant — <https://www.domontsant.com/celler/clos-maria/>
- [ ] **Clos Mogador** — DO Montsant — <https://www.domontsant.com/celler/clos-mogador/>
- [ ] **Coca i Fito** — DO Montsant — <https://www.domontsant.com/celler/coca-i-fito/>
- [ ] **Companyia Viticola Sileo** — DO Montsant — <https://www.domontsant.com/celler/companyia-viticola-sileo/>
- [ ] **El Vi dels 20** — DO Montsant — <https://www.domontsant.com/celler/el-vi-dels-20/>
- [ ] **Estones Vins** — DO Montsant — <https://www.domontsant.com/celler/estones-vins/>
- [ ] **Josep Grau Viticultor** — DO Montsant — <https://www.domontsant.com/celler/josep-grau-viticultor/>
- [ ] **Mas de Labundancia** — DO Montsant — <https://www.domontsant.com/celler/mas-de-labundancia/>
- [ ] **Orto Vins** — DO Montsant — <https://www.domontsant.com/celler/orto-vins/>
- [ ] **Serra i Barcelo** — DO Montsant — <https://www.domontsant.com/celler/serra-i-barcelo/>
- [ ] **Spectacle Vins** — DO Montsant — <https://www.domontsant.com/celler/spectacle-vins/>
- [ ] **Terravinyada** — DO Montsant — <https://www.domontsant.com/celler/terravinyada/>
- [ ] **Terroir Sense Fronteres** — DO Montsant — <https://www.domontsant.com/celler/terroir-sense-fronteres/>
- [ ] **Venus la Universal** — DO Montsant — <https://www.domontsant.com/celler/venus-la-universal/>
- [ ] **Venus la Universal Sindicat la Figuera** — DO Montsant — <https://www.domontsant.com/celler/venus-la-universal-sindicat-la-figuera/>
- [ ] **Vinas del Montsant** — DO Montsant — <https://www.domontsant.com/celler/vinas-del-montsant/>
- [ ] **Vinyes den Gabriel** — DO Montsant — <https://www.domontsant.com/celler/vinyes-den-gabriel/>
- [ ] **Vinyes Domenech** — DO Montsant — <https://www.domontsant.com/celler/vinyes-domenech/>


## Ruta del Vi DO Tarragona  ·  ✅ HECHA (10 integradas, 2 descartadas — ver «Estado de revisión» arriba)

Fuente: https://www.dotarragona.cat/


- [ ] **Biopaumerà** — DO Tarragona
- [ ] **Bodegas Embotelladoras** — DO Tarragona
- [ ] **Castell d'Or** — DO Tarragona
- [ ] **Celler 9+** — DO Tarragona
- [ ] **Celler Cooperatiu de Vila-Rodona** — DO Tarragona
- [ ] **Celler Magrinyà Calaf** — DO Tarragona
- [ ] **Celler Mas dels Frares - URV** — DO Tarragona
- [ ] **Celler Pedrola** — DO Tarragona
- [ ] **Cooperativa Sant Isidre de Vilabella** — DO Tarragona
- [ ] **Estol Verd Celler** — DO Tarragona
- [ ] **Terra Cellars** — DO Tarragona
- [ ] **Vinya Janine** — DO Tarragona


## Ruta del Vi DO Terra Alta  ·  ✅ HECHA (17 integradas, 2 descartadas — ver «Estado de revisión» arriba)

- [ ] **Barbara Fores** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/barbara-fores/>
- [ ] **Bielsa Ruano** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/bielsa-ruano/>
- [ ] **Catedral del Vi Modernista Celler** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/catedral-del-vi-modernista-celler/>
- [ ] **Celler Arrufi** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-arrufi/>
- [ ] **Celler Bernavi** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-bernavi/>
- [ ] **Celler Cal Menescal** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-cal-menescal/>
- [ ] **Celler Frisach** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-frisach/>
- [ ] **Celler Josep Vicens** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-josep-vicens/>
- [ ] **Celler la Botera** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-la-botera/>
- [ ] **Celler Xavier Clua** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/celler-xavier-clua/>
- [ ] **Cellers Tarrone** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/cellers-tarrone/>
- [ ] **Coma den Bonet** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/coma-den-bonet/>
- [ ] **Comebe** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/comebe/>
- [ ] **Edetaria** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/edetaria/>
- [ ] **Essencia de Lluna** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/essencia-de-lluna/>
- [ ] **Herencia Altes** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/herencia-altes/>
- [ ] **Les Vinyes del Convent** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/les-vinyes-del-convent/>
- [ ] **Sant Josep Vins** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/sant-josep-vins/>
- [ ] **Vins del Tros** — DO Terra Alta — <https://www.doterraalta.com/rutadoterraalta/listing-type/vins-del-tros/>
