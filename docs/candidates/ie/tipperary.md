# Tipperary — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/tipperary.csv`. Nothing recorded here is verified or
approved for publication. Resolve each lead under the normal CSV and evidence
workflow and prune it from this file.

## Official register and OpenStreetMap sweep (2026-08-11)

Sources, all read 2026-08-11:

- DAFM register of approved and registered meat establishments —
  `AllApprovedPlants_2026.xlsx` and `AllApprovedPlants_2026_Formerly_LA_Plants.xlsx`
  from <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
  Publishes approval number, name, town, county and which activities are approved.
- DAFM register of milk and dairy establishments, published 17 July 2026, from the
  same page. Publishes legal name, trading name, address, species and the
  establishment's own size class.
- FSAI list of HSE-approved establishments —
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>. Publishes approval
  number, trading name, address, county, business type and activity.
- OpenStreetMap food-production and food-shop tags via Overpass.
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/tipperary>.
- Midlands Food & Drink Directory —
  <https://www.midlandsireland.ie/food-and-drink-directory/> (its
  `producers_directory` REST collection). Covers only Laois, Longford, Offaly
  and Westmeath.

What these establish, and what they do not: an approval proves that the named
establishment is registered for that activity at that address as of the published
date. It does not prove a current own-brand offer, a public contact, remote
ordering, or that the unit sells to the public at all — a great many exist to
process for other businesses, and the register lists industrial plants beside
farmhouse ones. An OSM tag proves only what a mapper recorded, and its county
here is the tag's own where present and inferred from position otherwise. The
Midlands directory is self-submitted by the businesses in it, so it shows how a
producer presents itself, not an audited fact, and it publishes no contact
details. FarmFinder is an aggregator that republishes other directories and cites
them per entry, so it is broad but second-hand and can carry stale or
auto-generated rows. Every lead below is a `hold`: confirm identity, qualifying
activity, productive municipality and a current contact on the producer's own
source before admission.

Category shown is the tag or register activity mapped onto the shared registry;
it is a starting guess, not a decision.

### Production signal — 105 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Cashel Fine Foods (registered as Una O'Dwyer Ltd T/A Cashel Fine Foods) | Cashel | Carne | Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/una-o-dwyer-ltd-t-a-cashel-fine-foods | — | DAFM meat 2635 |
| Compass Catering Services Ireland Ltd | Rearcross CookhouseNorth Tipperary Food | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4070 |
| Crawfords Farm | — | Carne | Farm; Organic, NeighbourFood, Dairy, Eggs | — | FarmFinder https://farmfinder.ie/producer/crawfords-farm |
| Crowe Farm Poultry LTD | Dundrum | Carne | Minced Meat, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/crowe-s-farm | — | DAFM meat 2976 |
| Crowe Meats LTD | Dundrum | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2580 |
| D & F Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/d-and-f-butchers |
| Derrykearne Foods LTD | Roscrea | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 3041 |
| Devaney's Dinners | DromTemplemore | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4080 |
| Dew Valley Foods Ltd | Thurles | Carne | Meat Products RTE, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/dew-valley-foods | — | DAFM meat 753 |
| Eamon Ryan | Golden | Carne | Meat Products RTE | — | DAFM meat 2867 |
| Honey Vale Foods Limited | Cahir | Carne | Meat Products Non RTE | — | DAFM meat 513 |
| JWB Retail Sales LTD | Clonmel | Carne | Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2572 |
| Lewis Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM way/580239086 | — | FarmFinder https://farmfinder.ie/producer/lewis-butchers |
| Martin O'Dwyer | Cashel | Carne | Slaughtering, Cutting only; also DAFM meat 3048; also FarmFinder https://farmfinder.ie/producer/martin-o-dwyer-family-butchers | — | DAFM meat 2571 |
| Midland Fine Foods LTD | Birr | Carne | Meat Preparations | — | DAFM meat 2920 |
| O'Dwyer Butchers Killenaule | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/o-dwyer-butchers-killenaule |
| O'Malley's Craft Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/o-malley-s-craft-butchers |
| Oakpark Foods (registered as Honeyvale Foods Ltd. T/A Oakpark Foods) | Clonmel | Carne | Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/oakpark-foods-limited | — | DAFM meat 2056 |
| Paddy O'Dwyer Quality Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/paddy-o-dwyer-quality-meats |
| Quality Meats Thurles | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/quality-meats-thurles |
| Renegade Trading | Cashel | Carne | Meat Preparations | — | DAFM meat 3047 |
| Rib World (registered as M & M Walshe Ltd. T/A Rib World) | Fethard | Carne | Meat Products RTE, Meat Products Non RTE | — | DAFM meat 799 |
| St. Lukes Main Kitchen | Western RoadClonmel | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4110 |
| Templetuohy Farm Fresh Foods Ltd | Cashel | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2892 |
| The Gourmet Butcher | Clonmel | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 3037 |
| Thurles Bacon | Thurles | Carne | Meat Products RTE | — | DAFM meat 2436 |
| Whelan Food & Meat Processors | Fethard | Carne | Meat Products Non RTE | — | DAFM meat 3052 |
| Castlegrace Distillery | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/castlegrace-distillery |
| DejaBrew | — | Cerveza | craft=brewery | — | OSM node/12918706181 |
| The Apple Farm | — | Cerveza | Farm; NeighbourFood, Fruit, Vegetables, Beer; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/the-apple-farm |
| Crossogue Preserves | — | Fruta y verdura | Producer; Fruit, Vegetables, Preserves, Online; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/crossogue-preserves |
| Tipperary Organic Ice Cream | — | Helados | Producer; Organic, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/tipperary-organic-ice-cream |
| Golden Irish Eggs | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/golden-irish-eggs |
| Boulabane Cheese Co Ltd | Boulabane Roscrea Tipperary | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1930 |
| Cais Na Tire Limited | Cloninaha Ballinderry Co Tipperary | Lácteos y quesos | N/A, SMALL - MEDIUM | — | DAFM dairy IE1996 |
| Cashel Blue Cheese | — | Lácteos y quesos | Producer; Dairy, Eggs, Cheese, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/cashel-blue-cheese |
| Cashel Farmhouse Cheesemakers (registered as J & L Grubb Ltd) | Cashel Farmhouse Cheesemakers, Beechmount, | Lácteos y quesos | Bovine, Ovine, SMALL - MEDIUM | — | DAFM dairy IE 1823 |
| Celtic Euro Foods (registered as Mocklershill Euro Foods Ltd) | Mocklershill Cashel Co. Tipperary | Lácteos y quesos | Bovine, TRADER | — | DAFM dairy 1726 |
| Centenary Thurles Co op Society | Templemore RD Thurles Co | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1514 |
| Cooleeney Cheese (registered as Marchminder Ltd) | Cooleeney Moyne Thurles Co | Lácteos y quesos | Bovine, Caprine, SMALL - MEDIUM | — | DAFM dairy IE1838 |
| Crawford's Farm (registered as Crawford's Farm Ltd) | Garraun Lane Cloughjordan Co. | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2125 |
| Drombane Co-op | Drombane Thurles Co Tipperary, | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1501 |
| Fairgreen Ingredients Ltd | Knockanrawley Tipperary Town Co | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1947 |
| Kilkenny Cheese Limited | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/kilkenny-cheese-limited |
| Mullinahone Co-Operative Dairy Society | Mullinahone Thurles Co Tipperary | Lácteos y quesos | B, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1525 |
| Shan Óg Dairy (registered as John Shanahan) | Fishmoyne Drom Borrisoleigh Co. | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2138 |
| The Blues Creamery Ltd | Newtown Aherlow Co Tipperary | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2187 |
| The Tipperary Cheese Company Ltd | Middle Piece Two-Mile-Borris Thurles | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1829 |
| Thurles Fresh Cream Milk Ltd | Templemore Rd. Thurles Co | Lácteos y quesos | Bovine, DRINKING MILK PLANT | — | DAFM dairy IE1433 |
| Galtee Honey Farm | — | Miel | listed; also OSM node/6502219216 | — | FarmFinder https://farmfinder.ie/producer/galtee-honey-farm |
| Annie's Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/annies-organic-farm |
| Barbara Russell Catering | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/barbara-russell-catering-2 |
| Borrisoleigh Bottling Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/borrisoleigh-bottling-ltd |
| Bulmer's Ireland | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bulmers-ireland |
| Clogheen | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/clogheen |
| Cloncannon Biofarm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cloncannon-biofarm |
| Compsey Creamery | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/compsey-creamery |
| Con Traas Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/con-traas-ltd |
| Cúlbhac Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/c-lbhac-farm |
| Emerald Oils | — | Otros | Producer; Preserves, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/emerald-oils |
| Filligans Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/filligans-ltd |
| Fine Fins | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/fine-fins-tipperary |
| Folains Preserves | — | Otros | Producer; Preserves, SuperValu Food Academy, remaining), About | — | FarmFinder https://farmfinder.ie/producer/folains-preserves |
| Galtee Valley | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/galtee-valley |
| Golden Island | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/golden-island |
| Good Herdsmen Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/good-herdsmen-ltd |
| Gordons goodies | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gordons-goodies |
| Green Goose | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/green-goose |
| Hayes' Farm of Tipperary | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/hayes-farm-of-tipperary |
| Mad Beans Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mad-beans-ltd |
| Magner's Farm Box | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/magners-farm-box |
| Mags Home Baking | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mags-home-baking |
| Mai's Cafe | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mai-s-cafe |
| Nancys Fancies | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/nancys-fancies |
| Newcastle | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/newcastle |
| North Tipperary Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/north-tipperary-beekeepers-association |
| NutShed | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/nutshed |
| O'Brien's Farm Shop | Nenagh | Otros | listed; also OSM way/282689195; also OSM node/338651159 | — | FarmFinder https://farmfinder.ie/producer/obriens-farm-shop |
| O'Donnells Crisps | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/odonnells-crisps |
| Oak Park Foods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/oak-park-foods |
| Ponaire Limited | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ponaire-limited |
| Ribworld | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ribworld |
| Rivesci | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rivesci |
| Robert A Merry & Co Limited | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/robert-a-merry-and-co-limited |
| Rocker Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rocker-organic-farm |
| Ross & Amy Jackson | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ross-and-amy-jackson |
| Sean Loughnane (Galway) Limited | — | Otros | listed; also OSM node/1251978712 | — | FarmFinder https://farmfinder.ie/producer/sean-loughnane-galway-limited |
| Seymour Organics, Co. Tipperary | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/seymour-organics-co-tipperary |
| Slievenamon View Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/slievenamon-view-organic-farm |
| Soil Renew Ireland Limited | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/soil-renew-ireland-limited |
| South Tipperary Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/south-tipperary-association |
| The Friendly Farmer | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-friendly-farmer |
| The Little Deer | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-little-deer |
| The Pastry Studio | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-pastry-studio |
| Tipperary Boutique Distillery Limited | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/tipperary-boutique-distillery-limited |
| Tipperary Coop | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/tipperary-coop |
| Tullahay Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/tullahay-farm |
| Alla's Patisserie | — | Pan y cereal | craft=bakery | — | OSM node/11348413286 |
| Bart Pawlukojc and his wife Nicole Server | — | Pan y cereal | Producer; Bread & Bakery | — | FarmFinder https://farmfinder.ie/producer/bart-pawlukojc-and-his-wife-nicole-server |
| Hickeys Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/hickeys-bakery |
| In Season Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/in-season-bakery |
| The Bread Shed | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/the-bread-shed |
| Daly's Seafood | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/dalys-seafood-tipperary-osm-637028 |
| Adams Cider Company | — | Sidra | listed | — | FarmFinder https://farmfinder.ie/producer/adams-cider |
| Longways Cider | — | Sidra | listed | — | FarmFinder https://farmfinder.ie/producer/longways-cider |

### Facility or shopfront only — 53 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| ABP Cahir (registered as Anglo Beef Processors Ireland UC T/A ABP Cahir) | Cahir | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; national-scale brand | — | DAFM meat 300 |
| ABP Nenagh (registered as Anglo Beef Processors Ireland UC T/A ABP Nenagh) | Nenagh | Carne | Minced Meat; national-scale brand | — | DAFM meat 290 |
| Andrew English | Emly | Carne | Slaughtering only | — | DAFM meat 2579 |
| Ashbourne Meats Roscrea UC | Roscrea | Carne | Slaughtering, Cutting only | — | DAFM meat 382 |
| Brendan Healy | — | Carne | shop=butcher | +353 62 546 90; +353 87 958 6091 | OSM node/8130191112 |
| Brian Lewis | Tipperary | Carne | Slaughtering only | — | DAFM meat 2577 |
| D. O'Shea | — | Carne | shop=butcher | — | OSM node/12947249514 |
| David O'Malley | Tipperary | Carne | Cutting only | — | DAFM meat 2576 |
| Denis's | — | Carne | shop=butcher | — | OSM node/13532985102 |
| Donal Leenane Butcher | — | Carne | shop=butcher | — | OSM way/826239051 |
| Eamonn Ryan Family Butcher | — | Carne | shop=butcher | — | OSM node/5058524820 |
| Edward Lacey | Thurles | Carne | Slaughtering only | — | DAFM meat 2545 |
| Egans | — | Carne | shop=butcher | — | OSM node/1251978718 |
| Fitzgerald | — | Carne | shop=butcher | — | OSM node/1944807590 |
| Fitzpatrick’s | Littleton | Carne | shop=butcher | — | OSM node/9397115398 |
| Georgi's Top Quality Meats | — | Carne | shop=butcher | — | OSM node/12947149284 |
| Hanlon's | Nenagh | Carne | shop=butcher | — | OSM node/1301265299 |
| Joe Hammersly | Cashel | Carne | Slaughtering only | — | DAFM meat 2575 |
| Kennedy | — | Carne | shop=butcher | — | OSM node/11348371365 |
| Laceys Butchers | — | Carne | shop=butcher | — | OSM way/575136694 |
| Liam Gahan Meats | Mullinahone | Carne | Slaughtering, Cutting only | — | DAFM meat 2589 |
| M. Whelan | — | Carne | shop=butcher | — | OSM node/11358570001 |
| Michael & Maurice Whelan | Carrick-on-Suir | Carne | Slaughtering, Cutting only | — | DAFM meat 2573 |
| Noel McNamara Traditional Butcher | — | Carne | shop=butcher | — | OSM node/9454153261 |
| Noel's Butchers | — | Carne | shop=butcher | — | OSM way/580938993 |
| O'Briens | — | Carne | shop=butcher | — | OSM node/11348371336 |
| O'Dwyers Family Butchers (Killenaule) Limited | Killenaule | Carne | Slaughtering only; also OSM node/3174849171 | — | DAFM meat 2584 |
| O'Malleys Butcher | — | Carne | shop=butcher | — | OSM way/580239072 |
| O'Sullivan Butcher's | — | Carne | shop=butcher | — | OSM node/899842968 |
| Paul Tobin | Carrick-on-Suir | Carne | shop=butcher; also OSM node/11358621626 | — | OSM node/7866493558 |
| PJ Aherne Victualers | — | Carne | shop=butcher | — | OSM node/1251978708 |
| Premier Meats | — | Carne | shop=butcher | — | OSM node/12971283386 |
| R Tormey | — | Carne | shop=butcher | — | OSM node/1251966479 |
| Ryan Edmond and Sons | — | Carne | shop=butcher | — | OSM node/912470013 |
| Slievenamon Meats | Thurles | Carne | Cutting only | — | DAFM meat 2493 |
| Thomas Myles | Ardfinnan | Carne | Slaughtering only | — | DAFM meat 2588 |
| Walsh Butchers | Cashel | Carne | Slaughtering only | — | DAFM meat 2582 |
| Walsh's | — | Carne | shop=butcher | — | OSM node/13192539178 |
| melt. | — | Dulces y repostería | shop=confectionery | — | OSM node/12918706180 |
| Arrabawn Co-op Ltd | — | Otros | listed; national-scale brand | — | FarmFinder https://farmfinder.ie/producer/arrabawn-co-op-ltd |
| Burke Farm Machenery | — | Otros | shop=farm | — | OSM node/12980209705 |
| Caplice's Christmas Tree Farm | Cahir | Otros | shop=farm | caplicetrees.christmas | OSM node/5972387456 |
| Country Choice | Nenagh | Otros | shop=deli | www.countrychoice.ie · +3536732596 · info@countrychoice.ie | OSM node/1442384128 |
| Po Polsku | — | Otros | shop=deli | — | OSM node/7844503237 |
| Polish Deli | — | Otros | shop=deli | — | OSM way/575087658 |
| Town House Deli | Tipperary | Otros | shop=deli | townhousedeli.com · +353 62 33594 | OSM node/7741265118 |
| Keogh's | — | Pan y cereal | shop=bakery | — | OSM node/11128245748 |
| Ryan's Of Tipperary | — | Pan y cereal | shop=bakery | — | OSM node/12980196237 |
| The Auld Mill Bakery | — | Pan y cereal | shop=bakery | — | OSM node/7782275602 |
| The Sunnyside | — | Pan y cereal | shop=bakery | — | OSM node/11358512509 |
| The Tipperary Kitchen | Thurles | Pan y cereal | shop=bakery | thetipperarykitchen.ie · +353 504 43257 | OSM node/3346836977 |
| Wood Fired Bakery | — | Pan y cereal | shop=bakery | www.cloughjordanwoodfiredbakery.com | OSM node/2420767407 |
| Zina's Cakes | — | Pan y cereal | shop=bakery | — | OSM node/12947149269 |
## Cashel Farmhouse Cheesemakers — municipality unresolved (2026-08-11)

Source: <https://www.cashelblue.com/>, read 2026-08-11. The producer's own site
establishes identity (Cashel Farmhouse Cheesemakers, J&L Grubb Ltd), the
cheeses (Cashel Blue, Crozier Blue) and the county, and publishes
`+353526131151` and `info@cashelblue.com`. It gives the address only as
"Beechmount Farm, Co. Tipperary, E91 E8W8" — no town or village — and
`municipio` is required, so the row is held.

To resolve: find the town the producer itself publishes for Beechmount Farm, or
an official register entry naming it. The Eircode routing key is not a county or
town name and there is no free Eircode lookup, so it cannot substitute.

## Irish craft beer directory sweep (2026-08-11)

Source: <https://irishcraftbeer.ie/breweries/>, read 2026-08-11. The directory
publishes a brewery name, a county, sometimes a town, and a URL, and flags some
entries as closed. It establishes none of those as current, does not give the
productive town for most entries, and its county attribution is unreliable — it
lists Big Hand Brewery under Dublin behind a Welsh domain. Every entry below is
therefore a `hold` lead: confirm identity, qualifying activity, productive
municipality, a public contact and the remote-order status on the producer's own
current source before admission.

| Lead | Location as listed | Listed domain |
|---|---|---|
| Canvas Brewery | — | canvasbrewery.com |
| Whitefield Brewery | — | whitefieldbrewery.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
