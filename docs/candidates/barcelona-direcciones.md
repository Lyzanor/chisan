# Barcelona — direcciones sin resolver (backfill Google Maps)

Backfill desde el `query_place_id` de la columna Google Maps. De 163 filas sin `direccion`, **13** se rellenaron con alta confianza (nombre del negocio + municipio coincidentes). Las **150** de abajo NO se tocaron: el place_id apunta a sitio dudoso/equivocado (centroide del municipio, negocio sin relación, otra provincia, o solo un nombre de calle). Requieren verificación manual antes de aceptar.

| slug | Google devuelve (nombre) | dirección sugerida | motivo descarte |
|---|---|---|---|
| `aguilera-campana-emili-sallent` | Sallent | 08650 Sallent, Barcelona, España | centroide municipio / sin calle |
| `alonso-bofarull-maria-de-la-luz-gurb` | Instal·lacions Bofarull | Carrer de Bofarull, 42, Sant Andreu, 08027 Barcelona, España | nombre no casa / posible negocio equivocado |
| `altamon-terrassa` | Altamon S.L. | Ctra. Rubí a Terrassa, BP-1503, Km 19, 5, BAJO(NAVE 5, 08192 Sant Quirze del Vallès, Barcelona, España | nombre no casa / posible negocio equivocado |
| `alves-pardo-elisabet-esparreguera` | Elisabet libros Esparreguera | Plaça de la Creu, 3, 08292 Esparreguera, Barcelona, España | nombre no casa / posible negocio equivocado |
| `angel-pardes-carrera-santa-coloma-de-gramenet` | Pardo | Plaça de Ferran de Sagarra, 6, 08922 Santa Coloma de Gramenet, Barcelona, España | nombre no casa / posible negocio equivocado |
| `anglerill-gine-maria-olvan` | rasa d'Anglerill | rasa d'Anglerill, 25290, Lleida, España | nombre no casa / posible negocio equivocado |
| `anna-molner-ventura-torrelles-de-llobregat` | Torrelles de Llobregat | 08629 Torrelles de Llobregat, Barcelona, España | centroide municipio / sin calle |
| `antoni-ferrer-ingles-sant-quinti-de-mediona` | Sant Quintí de Mediona | 08777 Sant Quintí de Mediona, Barcelona, España | centroide municipio / sin calle |
| `antoni-vidal-ribas-vic` | Vidal Ribas | Carrer de València, 643, Sant Martí, 08026 Barcelona, España | nombre no casa / posible negocio equivocado |
| `antonia-sedano-mellado-prat-de-llobregat` | El Prat de Llobregat | El Prat de Llobregat, Barcelona, España | centroide municipio / sin calle |
| `aragues-carrera-david-santa-maria-de-merles` | Santa Maria de Merlès | 08517 Santa Maria de Merlès, Barcelona, España | centroide municipio / sin calle |
| `artcava-avinyonet-del-penedes` | ARTCAVA WINERY | Masia Can Batlle, s/n, 08793 Avinyó Nou, Barcelona, España | nombre no casa / posible negocio equivocado |
| `artemis-cosmetica-barcelona` | Artemiss, Centro de belleza, salud y bienestar | 91, entresol 3a, Carrer d'Eiximenis, Sant Andreu, 08030 Barcelona, España | nombre no casa / posible negocio equivocado |
| `associacio-pastinaca-cornella-de-llobregat` | Asoc. CORNCRENATA | Carrer de Joaquim Rubió i Ors, 224, 08940 Cornellà de Llobregat, Barcelona, España | nombre no casa / posible negocio equivocado |
| `aureli-martinez-sanchez-caldes-de-montbui` | Clínicum | Pg. de Gràcia, 121, Gràcia, 08008 Barcelona, España | nombre no casa / posible negocio equivocado |
| `aurora-del-camp-scp-teia` | Teià | Teià, Barcelona, España | centroide municipio / sin calle |
| `badosa-teba-roger-sant-vicenc-dels-horts` | Real Club de Tenis Barcelona | Carrer de Bosch i Gimpera, 5-13, Les Corts, 08034 Barcelona, España | nombre no casa / posible negocio equivocado |
| `bruach-galian-maria-angeles-sant-boi-de-llobregat` | Sant Boi de Llobregat | 08830 Sant Boi de Llobregat, Barcelona, España | centroide municipio / sin calle |
| `butzbach-williot-michele-barcelona` | Barcelona | Barcelona, España | centroide municipio / sin calle |
| `cal-bitxot-km-0-prat-de-llobregat` | Cal Jaume del Bitxot | Diseminado Bunyola, 7, 08820 Barcelona, España | nombre no casa / posible negocio equivocado |
| `cal-pastera-ripollet` | Cal Pastera | DS Marina, 6, 08830 Sant Boi de Llobregat, Barcelona, España | nombre no casa / posible negocio equivocado |
| `cal-terrisco-josep-salvans-macia-olost` | Cal Terrisco | 08516 Olost, Barcelona, España | centroide municipio / sin calle |
| `calverons-scp-torello` | Mas el Casó de Calverons | 27VP+8G, 08570 Torelló, Barcelona, España | nombre no casa / posible negocio equivocado |
| `calves-ferrer-jordi-vallcebre` | Vallcebre | Vallcebre, Barcelona, España | centroide municipio / sin calle |
| `campos-sarroca-eugenio-olesa-de-montserrat` | La Pasión de Olesa de Montserrat | Plaça de l'Oli, s/n, 08640 Olesa de Montserrat, Barcelona, España | nombre no casa / posible negocio equivocado |
| `camps-rovirosa-josep-olivella` | Carrer de Guillem Rovirosa | Carrer de Guillem Rovirosa, 08818 Olivella, Barcelona, España | nombre no casa / posible negocio equivocado |
| `can-gallego-viticultors-scp-cabrera-digualada` | Celler Mas dels Clavers Finca Can Gallego | Finca, 08718 Can Gallego, Barcelona, España | nombre no casa / posible negocio equivocado |
| `can-nadal-torrelavit` | Can Nadal | 08410 Can Nadal, Barcelona, España | centroide municipio / sin calle |
| `canals-marimon-xavier-torrelles-de-foix` | LAFITTE • Manufacturas Metálicas Canals | Avinguda de Pau Claris, 36, 08760 Martorell, Barcelona, España | nombre no casa / posible negocio equivocado |
| `capdevila-gibert-carlos-sant-boi-de-llobregat` | Juan Carlos | Carrer Jaume Balmes, 2, 08830 Sant Boi de Llobregat, Barcelona, España | nombre no casa / posible negocio equivocado |
| `carola-diaz-aguado-antonio-barcelona` | Antonio Aguado Sedano | Carrer de l'Estatut, 15, 08182 Sant Feliu de Codines, Barcelona, España | nombre no casa / posible negocio equivocado |
| `carolina-obiol-pino-castellfollit-del-boix` | Castellfollit del Boix | 08255 Castellfollit del Boix, Barcelona, España | centroide municipio / sin calle |
| `carreras-masso-raimundo-cubelles` | Universidad Autónoma de Barcelona (UAB) | Plaça Cívica, 08193 Bellaterra, Barcelona, España | nombre no casa / posible negocio equivocado |
| `carretero-ariza-angel-barcelona` | Angel Torres Ariza | Carrer de Florència, 63, 08921 Santa Coloma de Gramenet, Barcelona, España | nombre no casa / posible negocio equivocado |
| `casals-rosell-agusti-sant-julia-de-cerdanyola` | Esplai del Roser | Av. d'Espanya, 21, 08290 Cerdanyola del Vallès, Barcelona, España | nombre no casa / posible negocio equivocado |
| `casilda-guiu-guiu-bigues-i-riells` | Monasterio de Sant Miquel del Fai | BV-1485, Km. 7, 08416 Riells del fai, Barcelona, España | nombre no casa / posible negocio equivocado |
| `cava-canals-i-munne-sant-sadurni-danoia` | Bodegas Canals & Munné Vinos y Cavas. Visitas Sant Sadurni | Carretera de San Sadurní a, Carrer de Vilafranca, Km 0.5, 08770 Sant Sadurní d'Anoia, Barcelona, España | nombre no casa / posible negocio equivocado |
| `cava-i-cellers-j-lluc-torrelavit` | Vinya Escudé - Celler Jordi Lluch | Barri Les Casetes del Raspall, s/n, 08777 Sant Quintí de Mediona, Barcelona, España | nombre no casa / posible negocio equivocado |
| `caves-avinyo-avinyonet-del-penedes` | CAVA AVINYÓ | Masia Can Fontanals, 08793, Barcelona, España | nombre no casa / posible negocio equivocado |
| `caves-masia-el-mas-la-granada` | Caves El Mas Ferrer | Carrer de Sant Sebastià, 25, 08739 Barcelona, España | nombre no casa / posible negocio equivocado |
| `caves-naveran-torrelavit` | Cavas Naveran | Término municipal, C-15, km 27, 08775 Torrelavit, Barcelona, España | nombre no casa / posible negocio equivocado |
| `caves-soler-jove-sant-sadurni-danoia` | Caves Soler Jové | Finca Prunamala, Parcel·la 2, 08770, 08770, Barcelona, España | nombre no casa / posible negocio equivocado |
| `celler-de-can-miret-sant-pere-de-ribes` | Masia Can MIRET | Polígon Sector L, 08450, Barcelona, España | nombre no casa / posible negocio equivocado |
| `celler-el-mas-pujo-vilafranca-del-penedes` | El Mas Pujó | Masia Mas Pujó, s/n, 08730, Barcelona, España | nombre no casa / posible negocio equivocado |
| `celler-marti-serda-santa-fe-del-penedes` | marti serda | 08792 Santa Fe del Penedès, Barcelona, España | centroide municipio / sin calle |
| `cellers-torres-sant-marti-sarroca` | Familia Torres - Centro de Visitas | Finca el Maset, s/n, 08796 Pacs del Penedès, Barcelona, España | nombre no casa / posible negocio equivocado |
| `christian-ferrero-aristegui-llinars-del-valles` | Llinás del Vallés | Llinás del Vallés, Barcelona, España | centroide municipio / sin calle |
| `collell-carrillo-lidia-perafita` | Perafita | 08589 Perafita, Barcelona, España | centroide municipio / sin calle |
| `covides-sant-sadurni-danoia` | Covides Agrobotiga Sant Sadurní d'Anoia | Cooperativa Vinícola Prunamala, C-532, 08770, Barcelona, España | nombre no casa / posible negocio equivocado |
| `cunicula-pilar-scp-calaf` | Passatge del Pilar | Passatge del Pilar, 08280 Calaf, Barcelona, España | nombre no casa / posible negocio equivocado |
| `daniel-calvet-canet-sant-llorenc-savall` | Sant Llorenç Savall | 08212 Sant Llorenç Savall, Barcelona, España | centroide municipio / sin calle |
| `del-pot-petit-rubi` | Del Pot Petit Melmelada Artesana i més | Carrer del Tennis, 8, 08191 Rubí, Barcelona, España | nombre no casa / posible negocio equivocado |
| `delgado-vinals-ana-maria-santpedor` | Santpedor | 08251 Santpedor, Barcelona, España | centroide municipio / sin calle |
| `dirk-madriles-helm-castelltercol` | Castellterçol | 08183 Castellterçol, Barcelona, España | centroide municipio / sin calle |
| `dunnings-emily-sarah-olerdola` | Olérdola | Olérdola, Barcelona, España | centroide municipio / sin calle |
| `eduardo-diaz-alvarez-molins-de-rei` | Ajuntament de Molins de Rei | Plaça de Catalunya, 1, 08750 Molins de Rei, Barcelona, España | nombre no casa / posible negocio equivocado |
| `eduardo-sanchez-iniesta-tordera` | Tordera | 08490 Tordera, Barcelona, España | centroide municipio / sin calle |
| `el-celler-guell-sitges` | Bodegas Güell | El Celler Güell, 08860 Sitges, Barcelona, España | nombre no casa / posible negocio equivocado |
| `emili-gallart-arenys-de-munt` | El Centro Arenys de Munt | Rambla Francesc Macià, 57, 08358 Arenys de Munt, Barcelona, España | nombre no casa / posible negocio equivocado |
| `farre-masip-teresita-barcelona` | Dra Miralles Masip, Montserrat | Carrer de Trafalgar, 62, Ciutat Vella, 08010 Barcelona, España | nombre no casa / posible negocio equivocado |
| `farre-solanes-montserrat-castellar-del-valles` | Passatge de Montserrat Roig | Passatge de Montserrat Roig, 08211 Castellar del Vallès, Barcelona, España | nombre no casa / posible negocio equivocado |
| `flores-puigvert-marcal-sant-pere-de-torello` | Sant Pere de Torelló | 08572 Sant Pere de Torelló, Barcelona, España | centroide municipio / sin calle |
| `font-vinas-jaume-collsuspina` | Font de Sant Jaume | Unnamed Road, 08769, 08769, Barcelona, España | nombre no casa / posible negocio equivocado |
| `francesc-x-jane-sole-santa-fe-del-penedes` | Santa Fe del Penedès | 08792 Santa Fe del Penedès, Barcelona, España | centroide municipio / sin calle |
| `granja-puigcercos-borreda` | Granja Can Puig | Carrer Major, 73, 08810 Sant Pere de Ribes, Barcelona, España | nombre no casa / posible negocio equivocado |
| `griselda-planas-riera-odena` | Dalmau Motor Igualada - Concessionari Oficial Volkswagen | Carrer d'Alemanya, 17, 08700 Igualada, Barcelona, España | nombre no casa / posible negocio equivocado |
| `guiu-aran-maria-sabadell` | Sabadell | Sabadell, Barcelona, España | centroide municipio / sin calle |
| `gurria-zendrera-luis-martin-barcelona` | Luis Miguel Angel Martín | Carrer de Monterols, 15, 3º3ª, Sarrià-Sant Gervasi, 08034 Barcelona, España | nombre no casa / posible negocio equivocado |
| `ibertruf-pere-muxi-rubio-avia` | Muxí Muebles | Carrer d'Òdena, 32, 08700 Igualada, Barcelona, España | nombre no casa / posible negocio equivocado |
| `izquierdo-jimenez-eva-maria-sant-esteve-sesrovires` | Sant Esteve Sesrovires | 08635 Sant Esteve Sesrovires, Barcelona, España | centroide municipio / sin calle |
| `jane-fernandez-josep-cardona` | Jané (Oficinas de empresa) | Polígono Riera Caldes, Carrer dels Mercaders, 34, 08184 Palau-solità i Plegamans, Barcelona, España | nombre no casa / posible negocio equivocado |
| `jaume-illa-alibes-moia` | Carrer de Nazari Alibés | Carrer de Nazari Alibés, El Moianès, 08180 Moià, Barcelona, España | nombre no casa / posible negocio equivocado |
| `jaume-masana-canela-pujalt` | Café Menssana - Healthy Food Restaurante & Brunch | Carrer de Sardenya, 48, Sant Martí, 08005 Barcelona, España | nombre no casa / posible negocio equivocado |
| `jaume-torrents-vilanova-i-la-geltru` | Materials Torrents | Carr. Granollers El masnou, s/n, 08410 Barcelona, España | nombre no casa / posible negocio equivocado |
| `joan-marce-casas-avinyonet-del-penedes` | Avinyonet del Penedés | Avinyonet del Penedés, Barcelona, España | centroide municipio / sin calle |
| `joan-marquez-tarres-pineda-de-mar` | Policia Local de Pineda de Mar | Carrer Sant Joan, 63, 08397 Pineda de Mar, Barcelona, España | nombre no casa / posible negocio equivocado |
| `joan-orriols-fontanills-premia-de-mar` | Carrer de Joan Maragall | Carrer de Joan Maragall, 08330 Premià de Mar, Barcelona, España | nombre no casa / posible negocio equivocado |
| `joaquin-vila-gelabert-viladecans` | Viladecans | 08840 Viladecans, Barcelona, España | centroide municipio / sin calle |
| `jordana-verdaguer-roser-saldes` | MUHBA Vil·la Joana | Ctra. de l'Església, 104, Sarrià-Sant Gervasi, 08017 Barcelona, España | nombre no casa / posible negocio equivocado |
| `jordi-i-rosa-arenys-de-munt` | Detalls Rosa S.L | Rambla Riera i Penya, 39, 08358 Arenys de Munt, Barcelona, España | nombre no casa / posible negocio equivocado |
| `jose-jofre-masagur-tordera` | La Casa de Hermes | Carrer Puigvert, 53, 08490 Tordera, Barcelona, España | nombre no casa / posible negocio equivocado |
| `jose-manuel-latorre-palet-garriga` | TORRESPAL VALLES, S.L.U. | MARESME 2, NAVE N, 08185, Barcelona, España | nombre no casa / posible negocio equivocado |
| `josep-cabanas-sola-taradell` | Taradell | 08552 Taradell, Barcelona, España | centroide municipio / sin calle |
| `josep-ignasi-molins-ferrer-seva` | MOLINS Defensa Penal | Av. Diagonal, 399, Eixample, 08008 Barcelona, España | nombre no casa / posible negocio equivocado |
| `josep-lloret-grau-sant-marti-sesgueioles` | Sant Martí Sesgueioles | 08282 Sant Martí Sesgueioles, Barcelona, España | centroide municipio / sin calle |
| `josep-tubau-portell-borreda` | Pedró de Tubau | 08607 Sant Jaume de Frontanyà, Barcelona, España | centroide municipio / sin calle |
| `juan-carlos-ruiz-alarcon-suria` | Súria | 08260 Súria, Barcelona, España | centroide municipio / sin calle |
| `juan-ramon-taberner-borraz-gava` | Gavá | Gavá, Barcelona, España | centroide municipio / sin calle |
| `juvitu-sl-viladecans` | Juvitu S.L | 72PJ+M9, 08840, Barcelona, España | nombre no casa / posible negocio equivocado |
| `la-746-sat-abrera` | Abrera | 08630 Abrera, Barcelona, España | centroide municipio / sin calle |
| `las-vilas-de-collsacabra-sat-1509-cat-rupit-i-pruit` | Collsacabra | Vall de Sau Collsacabra, Girona, España | centroide municipio / sin calle |
| `llobet-guix-xavier-santa-margarida-i-els-monjos` | Santa Margarita y Monjós | Santa Margarita y Monjós, Barcelona, España | centroide municipio / sin calle |
| `llop-vallverdu-josep-piera` | Llop Gestió Esportiva SL | Carrer de la Constitució, 2 3r, 3A, 08960 Sant Just Desvern, Barcelona, España | nombre no casa / posible negocio equivocado |
| `lluis-mauri-puig-tona` | Tona | 08551 Tona, Barcelona, España | centroide municipio / sin calle |
| `lopez-carrasco-susana-sant-vicenc-de-castellet` | Jordi Largo Fotògraf | Carrer Gran, 47, baixos, 08295 Sant Vicenç de Castellet, Barcelona, España | nombre no casa / posible negocio equivocado |
| `magdalena-ferrer-gil-mollet-del-valles` | Clínica Olivé Gumà | Carrer del Torrent de l'Olla, 1, Gràcia, 08012 Barcelona, España | nombre no casa / posible negocio equivocado |
| `manel-adell-domingo-barcelona` | Jordi Adell | Rda. de Sant Pere, 25, 3º 2ª, Eixample, 08010 Barcelona, España | nombre no casa / posible negocio equivocado |
| `manresa-bigas-santiago-tordera` | Pont Vell de Manresa | Pont Vell, 08241 Manresa, Barcelona, España | nombre no casa / posible negocio equivocado |
| `manuel-oliveras-pujadas-canovelles` | MANEL PUJADAS MASJUAN | Carrer d'Alfons IV, 65, 1-B, 08402 Granollers, Barcelona, España | nombre no casa / posible negocio equivocado |
| `marce-casas-josep-ma-avinyonet-del-penedes` | Masía del Marqués - Casa Sepulcre | Barri del Sepulcre, s/n, 08734 Sant Miquel d'Olèrdola, Barcelona, España | nombre no casa / posible negocio equivocado |
| `martin-rosell-petit-mataro` | Productes Martín - Des de 1970 - Botiga i Canal Professional | Carrer d'Esteve Albert, 35, 08304 Mataró, Barcelona, España | nombre no casa / posible negocio equivocado |
| `mas-buret-santa-magdalena-de-montbui` | Mas Buret | Masia Mas Buret - Disseminat s/n, 08710 El Saió, Barcelona, España | nombre no casa / posible negocio equivocado |
| `mas-casa-blanca-josep-cabanas-sola-taradell` | Mas Casablanca | Mas Casablanca, 08552 Taradell, Barcelona, España | nombre no casa / posible negocio equivocado |
| `masamara-martorelles` | Massamara Taperia Restaurante | Rambla de Sant Jordi, 36, 08291 Ripollet, Barcelona, España | nombre no casa / posible negocio equivocado |
| `maset-del-lleo-subirats` | Maset | C-15, Km.19, 08792 La Granada, Barcelona, España | nombre no casa / posible negocio equivocado |
| `mel-de-les-valls-del-montcau-sant-llorenc-savall` | Mels de Can Monràs Nou | 08187 Santa Eulàlia de Ronçana, Barcelona, España | centroide municipio / sin calle |
| `melsana-terrassa` | Malagana, casa de menjars. | Carrer de la Rasa, 23, 08221 Terrassa, Barcelona, España | nombre no casa / posible negocio equivocado |
| `mirgin-scp-tiana` | Tiana | Tiana, Barcelona, España | centroide municipio / sin calle |
| `modesto-garcia-moll-barcelona` | Hospital de la Santa Creu i Sant Pau | Carrer de Sant Quintí, 89, Horta-Guinardó, 08041 Barcelona, España | nombre no casa / posible negocio equivocado |
| `molins-sala-pere-seva` | Seva | 08553 Seva, Barcelona, España | centroide municipio / sin calle |
| `mora-capablanca-manel-barcelona` | Cal Manel | Carrer de Nàpols, 103, Eixample, 08013 Barcelona, España | nombre no casa / posible negocio equivocado |
| `o-prats-oriol-prats-pedrals-garriga` | GALVANICAS PRAS, S.A. | Pol. Ind. Els Batzacs (els xops), nave 13, 08186 Lliçà de Vall, Barcelona, España | nombre no casa / posible negocio equivocado |
| `ojeda-pelaez-pedro-torello` | Torelló | Torelló, Barcelona, España | centroide municipio / sin calle |
| `oms-molist-pere-sora` | Sora | 08588 Sora, Barcelona, España | centroide municipio / sin calle |
| `pagerols-agricultura-b-i-o-agradable-castellbisbal` | Planeses Agricultura Regenerativa | Mas Planeses, s/n, 17850 Sant Ferriol, Girona, España | nombre no casa / posible negocio equivocado |
| `pardes-carrera-angel-santa-coloma-de-gramenet` | Santa Coloma de Gramanet | Santa Coloma de Gramanet, Barcelona, España | centroide municipio / sin calle |
| `pere-muxi-rubio-avia` | Avià | 08610 Avià, Barcelona, España | centroide municipio / sin calle |
| `pere-oms-molist-sora` | Oxfam Intermón (Oficinas centrales) | Edifici DMOURA4, Carrer del Treball, 100, Sant Martí, 08019 Barcelona, España | nombre no casa / posible negocio equivocado |
| `pujols-parramon-miquel-roda-de-ter` | Parramon + Tahull arquitectes | Carrer de Dalmau, 11, Sants-Montjuïc, 08014 Barcelona, España | nombre no casa / posible negocio equivocado |
| `quintana-puig-pere-oris` | El horno Montbau, panaderos artesanos - Panaderos & Pasteleros Puig | Carrer de la Poesia, 1, Horta-Guinardó, 08035 Barcelona, España | nombre no casa / posible negocio equivocado |
| `raimundo-carreras-masso-cubelles` | Cubelles | 08880 Cubelles, Barcelona, España | centroide municipio / sin calle |
| `ramon-capdevila-miranda-prats-de-llucanes` | Prats de Lluçanès | 08513 Prats de Lluçanès, Barcelona, España | centroide municipio / sin calle |
| `riera-malet-maria-palafolls` | Estética Marlac | Plaça de les Valls d'Ax, 08389 Palafolls, Barcelona, España | nombre no casa / posible negocio equivocado |
| `roca-puig-maria-dolors-la-granada` | Fruita de Cal Roca | 9PF8+47, 08792 La Granada, Barcelona, España | nombre no casa / posible negocio equivocado |
| `rocio-i-rafael-sant-joan-despi` | Residencia San Rafael Arcángel | Carrer de Rius i Taulet, 17, 08970 Sant Joan Despí, Barcelona, España | nombre no casa / posible negocio equivocado |
| `roser-jordana-verdaguer-saldes` | Saldes | 08697 Saldes, Barcelona, España | centroide municipio / sin calle |
| `roses-alsina-scp-castellvi-de-la-marca` | Alsina & Sardà | Barri Les Tarumbes, s/n, 08733 El Pla del Penedès,Barcelona, Barcelona, España | nombre no casa / posible negocio equivocado |
| `roset-gamisans-josep-maria-puig-reig` | Josep M. Puig i Marí, Nefrólogo | Passeig de Manuel Girona, 33, Sarrià-Sant Gervasi, 08034 Barcelona, España | nombre no casa / posible negocio equivocado |
| `rossell-salva-josep-arenys-de-mar` | Rossell Xarcuteria | Carrer Horta Matanzas, 6, Local 1, 08350 Arenys de Mar, Barcelona, España | nombre no casa / posible negocio equivocado |
| `salagean-runcan-ileana-valeria-manresa` | Manresa | Manresa, Barcelona, España | centroide municipio / sin calle |
| `sanguesa-millan-maria-merce-capellades` | Capellades | Capellades, Barcelona, España | centroide municipio / sin calle |
| `sat-n-716-granja-la-gonima-moia` | Ctra. C-59 - La Gónima | El Moianès, 08180, Barcelona, España | nombre no casa / posible negocio equivocado |
| `sauri-abella-josep-arenys-de-mar` | Arxiu Històric Fidel Fita, municipal d'Arenys de Mar | Riera del Bisbe Pol, 10, 08350 Arenys de Mar, Barcelona, España | nombre no casa / posible negocio equivocado |
| `sergio-pinol-teruel-sant-feliu-de-llobregat` | Sant Feliu de Llobregat | 08980 Sant Feliu de Llobregat, Barcelona, España | centroide municipio / sin calle |
| `serra-fabre-jordi-centelles` | Fundació Jordi Sierra i Fabra | Carrer de Carreras i Candi, 80, Sants-Montjuïc, 08028 Barcelona, España | nombre no casa / posible negocio equivocado |
| `serra-vila-montserrat-tordera` | Massimo Dutti (Oficinas centrales) | Polígono Inditex, Av. Verge de Montserrat, S/N, 08490 Tordera, Barcelona, España | nombre no casa / posible negocio equivocado |
| `serrabassa-punti-santiago-vic` | Casa Glamour | Rambla de Sant Domènec, 10, 08500 Vic, Barcelona, España | nombre no casa / posible negocio equivocado |
| `serrat-sanjaume-joan-arenys-de-munt` | Ayuntamiento de Arenys de Munt | Rambla Francesc Macià, 59, 08358 Arenys de Munt, Barcelona, España | nombre no casa / posible negocio equivocado |
| `simon-garros-montserrat-casserres` | Avinguda Montserrat | Avinguda Montserrat, 08693 Casserres, Barcelona, España | nombre no casa / posible negocio equivocado |
| `susana-lopez-carrasco-sant-vicenc-de-castellet` | Jordi Largo Fotògraf | Carrer Gran, 47, baixos, 08295 Sant Vicenç de Castellet, Barcelona, España | nombre no casa / posible negocio equivocado |
| `tantina-riera-salvador-caldes-de-montbui` | Sant Salvador | Sant Salvador, 08140, Barcelona, España | nombre no casa / posible negocio equivocado |
| `tomas-sabate-jordi-collbato` | Collbató | 08293 Collbató, Barcelona, España | centroide municipio / sin calle |
| `torrentsgeneros-vila-jose-manresa` | Torrents Autocolor, S.L | 21-23, Carrer de Sant Cristòfol, 08243 Manresa, Barcelona, España | nombre no casa / posible negocio equivocado |
| `torres-avellana-miquel-pujalt` | Torre Salvana | Barri de Can Julià, 08690 Santa Coloma de Cervelló, Barcelona, España | nombre no casa / posible negocio equivocado |
| `vila-gelabert-joaquin-viladecans` | La Salchicha Peleona | Carrer de Jaume Abril, 62, 64, 08840 Viladecans, Barcelona, España | nombre no casa / posible negocio equivocado |
| `vilajeliu-serra-joan-tordera` | Viveros Jalpi SL | GI-600, 08490 Tordera, Barcelona, España | nombre no casa / posible negocio equivocado |
| `vins-grau-castellfollit-del-boix` | Vinos y Licores Grau | Carrer de Torroella, 163, 17200 Palafrugell, Girona, España | nombre no casa / posible negocio equivocado |
| `viorica-caucean-sallent` | Espai cultural Fàbrica Vella | Carrer Camp de la Bota, 5, 08650 Sallent, Barcelona, España | nombre no casa / posible negocio equivocado |
| `xavier-garces-fisas-sant-vicenc-de-torello` | Sant Vicenç de Torelló | 08571 Sant Vicenç de Torelló, Barcelona, España | centroide municipio / sin calle |
| `xavier-oliva-peris-prat-de-llobregat` | Dr. Xavier Martín Oliva | Carrer de Pau Claris, 120, 1º 1ª, Eixample, 08009 Barcelona, España | nombre no casa / posible negocio equivocado |
