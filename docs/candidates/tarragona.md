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


**Total inicial: 214 · cribado editorial 2026-06-15 · deduplicado local 2026-06-16.**

## Estado de revisión (cribado 2026-06-15)
- **DO Terra Alta: HECHA.** 17 integradas en `tarragona.csv` (todas `verificado`): Bàrbara Forés, Bielsa Ruano, Arrufí, Bernaví, Frisach, Josep Vicens, La Botera, Xavier Clua, Cellers Tarroné, Coma d'en Bonet, Edetària, Essència de Lluna, Herència Altés, Sant Josep Vins, Vins del Tros, Les Vinyes del Convent, Celler Menescal. **Descartadas 2:** *Catedral del Vi* = Cooperativa Pinellense (ya estaba) y *Comebé* = consorci Memorial Batalla de l'Ebre (no es celler).
- **Ya las teníamos (quitar de Conca):** *Agrícola de la Conca* (= fila Montblanc) y *Agrícola de Barberà* (= Coop. Agrícola de Barberà de la Conca).
- **Duplicados entre DOs (contar 1 vez):** Castell d'Or (Conca+Tgn), Clos Mogador (Priorat+Montsant), Josep Grau Viticultor (Priorat+Montsant), Noguerals (Priorat+Montsant).
- **Alias de web → nombre real (Priorat):** `www-arethealpriorat-com`=Aretheal Priorat · `https-closalkio-com`=Clos Alkio · `www-vinyesforermassard-com`=Les Vinyes Forer Massard.
- **DO Tarragona: HECHA.** 10 integradas (`verificado`): Biopaumerà, Castell d'Or, Coop. Vila-rodona, Celler 9+, Caves Magrinyà Calaf, Celler Pedrola (Camí de Sirga), Coop. Sant Isidre de Vilabella, Estol Verd, Terra Cellars, Vinya Janine. **Descartadas 2:** *Bodegas Embotelladoras* (sin ficha, nombre de embotellador, no verificable como KM0) y *Mas dels Frares* (bodega experimental de la Facultat d'Enologia URV, no es productor de consumo). *Castell d'Or* integrada aquí resuelve también el duplicado de Conca.
- **Conca de Barberà: HECHA.** 18 integradas en `tarragona.csv` (`verificado`): Aymar, Carles Andreu, Clos Montblanc, Costador, La Llena, Mas Foraster (Josep Foraster), Pla de la Masó, Mas de la Sabatera, Rendé Masdéu, Rosa Maria Torres, Sanstravé, Vega Aixalà, Vins de Pedra, Cellers Domenys, Família Torres-Milmanda, Gabor, Gerida, Succés Vinícola. **Descartadas:** Bodegas 1898 (sin ficha), Single Vineyards Collectors (sin ficha, négoci), Vins i Caves Portell (= Coop. Vinícola de Sarral, ya presente). **Movida a lleida.csv (provincia Lleida, no Tarragona):** *Cara Nord Celler* (`cara-nord-celler-el-vilosell`). **Diferidas (sin ficha Google localizable):** Abadia de Poblet (marca de Celler Tintoré, Vimbodí), Celler Mas de la Creu (Barberà), Celler Mas de la Pansa (Barberà).
- **DO Montsant: HECHA + VERIFICADA (2026-06-21).** 44 filas nuevas en `tarragona.csv` (`Bodega`): **41 `verificado`, 3 `parcial`** (Spectacle Vins, Viñas del Montsant/Morlanda, El Vi dels 20 — sin web/canal comprobable hoy). Coordenadas afinadas (29 precisas Nominatim/web, 14 a centroide); `Venta online` comprobada producto a producto (**15 `sí`** con botiga propia o marketplace; resto `no`/`no comprobado`). Incluye los 3 `dup-of` canónicos en Priorat (Clos Mogador, Josep Grau, Noguerals). **Sin fila nueva:** *Venus la Universal – Sindicat la Figuera* (mismo productor, fusionado en `venus-la-universal-falset`) y *Agricola Ulldemolins* (ya presente como Aceite). **Homónimo:** override `el molar`→Priorat en `municipios-overrides.json`.
- **Dudoso encaje pendiente (Priorat):** Unió Fruits SCCL (coop de fruta).
- **Revisión local de duplicados 2026-06-16:** comparado contra `npx pnpm list:province tarragona` y `npx pnpm list:province tarragona --categoria Bodega`. Las secciones cerradas quedan con casillas `[x]` y `already-present`, `rejected`, `moved` o `dup-of` para no reabrirlas.
- **Fusión resuelta (2026-06-21):** *Agricola Ulldemolins* = `agricola-dulldemolins-ulldemolins` (`Aceite`, `parcial`), cuya fila ya recoge "vinos DO Montsant"; no se crea fila nueva.
- **Pendiente útil:** DOQ Priorat (~108, ya descontados los 3 `dup-of` integrados vía Montsant) + 3 diferidas de Conca. Al integrar Priorat, resolver primero los alias de web ya anotados.


## Ruta del Trepat i Vins de la Conca de Barberà  ·  ✅ HECHA (18 integradas; ver «Estado de revisión» arriba)

Fuente: https://www.doconcadebarbera.com/cellers-de-la-d-o-conca-de-barbera/


- [ ] **Abadia de Poblet (Vimbodí i Poblet)** — deferred: posible marca de Celler Tintoré; sin ficha Google localizable. Reconfirmar antes de crear fila.
- [x] **Aymar Vitivinícoles (Vimbodí i Poblet)** — already-present: `aymar-vitivinicoles-vimbodi-i-poblet`
- [x] **Bodegas 1898 (Horta d'Avinyó)** — rejected: sin ficha verificable como productor local
- [x] **Cara Nord Celler (El Vilosell)** — movida a `lleida.csv` como `cara-nord-celler-el-vilosell`
- [x] **Castell d'Or (L'Espluga de Francolí)** — already-present: `castell-dor-lespluga-de-francoli`
- [x] **Celler Carles Andreu (Pira)** — already-present: `celler-carles-andreu-pira`
- [x] **Celler Clos Montblanc (Barberà de la Conca)** — already-present: `clos-montblanc-barbera-de-la-conca`
- [x] **Celler Costador Terroirs Mediterranis (Barberà de la Conca)** — already-present: `celler-costador-barbera-de-la-conca`
- [x] **Celler La Llena (Vilanova de Prades)** — already-present: `celler-la-llena-vilanova-de-prades`
- [ ] **Celler Mas de la Creu (Barberà de la Conca)** — deferred: sin ficha Google localizable. Reconfirmar existencia/ubicación antes de crear fila.
- [ ] **Celler Mas de la Pansa (Barberà de la Conca)** — deferred: sin ficha Google localizable. Reconfirmar existencia/ubicación antes de crear fila.
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
- [x] **Clos Mogador** — DOQ Priorat — already-present (vía DO Montsant): `clos-mogador-gratallops`; <https://www.doqpriorat.org/cellers/clos-mogador-sl/>
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
- [ ] **Clos Alkio** — DOQ Priorat — alias-resolved: `https-closalkio-com`; confirmar nombre legal/ficha antes de integrar
- [ ] **Joan Ametller** — DOQ Priorat — <https://www.doqpriorat.org/cellers/joan-ametller-sl/>
- [x] **Josep Grau Viticultors** — DOQ Priorat — already-present (vía DO Montsant): `josep-grau-viticultor-capcanes`; <https://www.doqpriorat.org/cellers/josep-grau-viticultors-sl/>
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
- [x] **Noguerals** — DOQ Priorat — already-present (vía DO Montsant): `celler-noguerals-cornudella-de-montsant`; <https://www.doqpriorat.org/cellers/noguerals-scp/>
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
- [ ] **Torres Priorat** — DOQ Priorat — not-auto-duplicate: relacionado con Torres, pero no fusionar con `familia-torres-milmanda-vimbodi-i-poblet` sin verificar sede y productor; <https://www.doqpriorat.org/cellers/torres-priorat-sl/>
- [ ] **Trossos del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/trossos-del-priorat/>
- [ ] **Unio Fruits** — DOQ Priorat — dudoso: coop de fruta; revisar encaje KM0 antes de integrar; <https://www.doqpriorat.org/cellers/unio-fruits-sccl/>
- [ ] **Vinicola del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/vinicola-del-priorat-sccl/>
- [ ] **Viticultors del Priorat** — DOQ Priorat — <https://www.doqpriorat.org/cellers/viticultors-del-priorat-sl/>
- [ ] **Viticultors Mas den Gil** — DOQ Priorat — <https://www.doqpriorat.org/cellers/viticultors-mas-den-gil-sl/>
- [ ] **Aretheal Priorat** — DOQ Priorat — alias-resolved: `www-arethealpriorat-com`; confirmar nombre legal/ficha antes de integrar
- [ ] **Les Vinyes Forer Massard** — DOQ Priorat — alias-resolved: `www-vinyesforermassard-com`; confirmar nombre legal/ficha antes de integrar


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
