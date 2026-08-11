# Tipperary — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/tipperary.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/tipperary>, plus each producer
  page for its structured website, coordinates and upstream source.
- Midlands Food & Drink Directory,
  <https://www.midlandsireland.ie/food-and-drink-directory/> (Laois, Longford,
  Offaly and Westmeath only).
- OpenStreetMap food-production and food-shop tags via Overpass.

Every website below was resolved and probed on 2026-08-11: a URL that returned
NXDOMAIN, was unreachable, or was a mangled address such as
`http://info@example.ie` has been removed rather than carried, because a
directory keeps publishing a link long after the domain lapses. A 403 is recorded
as alive, not dead.

Ceilings. A register approval proves the establishment is registered for that
activity at that address on the published date — not a current own-brand offer,
a public contact, remote ordering, or that it sells to the public. FarmFinder's
structured fields (website, coordinates, the upstream directory it cites) are
usable, but its prose is auto-generated and must never be copied into
`descripcion`. The Midlands directory is self-submitted. An OSM tag proves only
what a mapper recorded. Every entry here is still a `hold`.

`Municipio?` is a candidate, not a decision: where the source gave no town it is
the nearest settlement to the published coordinates, with the distance shown.
Confirm it against the producer's own address before it enters a CSV.

Category is the register activity or tag mapped onto the shared registry — a
starting guess. A trailing `?` means it was inferred from the trade name or the
domain because the source stated none.

A `⚠` on a website means the domain shares no word with the trade name. That is
often legitimate — Drioglann Loch Measc trades as Lough Mask Distillery, Con Traas
as The Apple Farm — but it is also what a parent company, a stockist or a
mis-scrape looks like, so check it before copying the URL into `web`.

Removed in this pass as out of scope: national-scale brands, hospitality
(cafés, restaurants, pubs), retail and forecourt names, resale-only shop tags
(delicatessen, confectioner, cheesemonger), abattoir or cutting-plant approvals
with no own offer and no directory backing, and bare OSM nodes carrying no
website, phone or email to verify against.

## Ready to verify — 26

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| O'Donnells Crisps | Kilsheelan (nearest, 0.8 km) | Aperitivos ? | www.odonnellscrisps.com | — | 52.3707748, -7.574152499999999 | [FarmFinder](https://farmfinder.ie/producer/odonnells-crisps); via Bord Bia Origin Green |
| Folains Preserves | Rosegreen (nearest, 2.5 km) | Conservas ? | www.crossoguepreserves.com | (0504) 54416 | 52.490622, -7.839495 | [FarmFinder](https://farmfinder.ie/producer/folains-preserves); via SuperValu Food Academy |
| Crossogue Preserves | Golden (nearest, 2.7 km) | Fruta y verdura | www.crossoguepreserves.com | (0504) 54416 | 52.516409, -7.953332 | [FarmFinder](https://farmfinder.ie/producer/crossogue-preserves) |
| Tipperary Organic Ice Cream | Cashel (nearest, 3.5 km) | Helados | www.tipperary-coop.ie | (062) 33111 | 52.485024, -7.892664 | [FarmFinder](https://farmfinder.ie/producer/tipperary-organic-ice-cream); via SuperValu Food Academy |
| Golden Irish Eggs | Dualla (nearest, 3.6 km) | Huevos | www.magnersfarm.com ⚠ | 086 337 8717 | 52.511272, -7.836576 | [FarmFinder](https://farmfinder.ie/producer/golden-irish-eggs); via SuperValu Food Academy |
| Cashel Blue Cheese | Cashel (nearest, 1.7 km) | Lácteos y quesos | www.cashelblue.com | (052) 613 2797 | 52.503615, -7.875367 | [FarmFinder](https://farmfinder.ie/producer/cashel-blue-cheese); via SuperValu Food Academy |
| Compsey Creamery | Mullinahone (nearest, 2 km) | Lácteos y quesos ? | www.compsey.com | (052) 915 3900 | 52.499572699999995, -7.506629599999999 | [FarmFinder](https://farmfinder.ie/producer/compsey-creamery); via Bord Bia Origin Green |
| Kilkenny Cheese Limited | Templetuohy (nearest, 5.8 km) | Lácteos y quesos | www.kilkennycheese.ie | (0504) 45112 | 52.7337874, -7.6898313 | [FarmFinder](https://farmfinder.ie/producer/kilkenny-cheese-limited); via Bord Bia Origin Green |
| Galtee Honey Farm | Bouladuff (nearest, 3.5 km) | Miel | galteehoney.com | 0876743030 | 52.6848215, -7.8981472 | [FarmFinder](https://farmfinder.ie/producer/galtee-honey-farm); via Food Culture Ireland |
| Borrisoleigh Bottling Ltd | Borrisoleigh (nearest, 0.5 km) | Otros | www.bblco.ie ⚠ | (0504) 50525 | 52.7511619, -7.9571316 | [FarmFinder](https://farmfinder.ie/producer/borrisoleigh-bottling-ltd); via Bord Bia Origin Green |
| Bulmer's Ireland | Priorstown (nearest, 3.1 km) | Otros | www.bulmers.ie | (052) 744 8270 | 52.3611997, -7.6473016 | [FarmFinder](https://farmfinder.ie/producer/bulmers-ireland); via Bord Bia Origin Green |
| Con Traas Ltd | New Inn (nearest, 3.8 km) | Otros | theapplefarm.com ⚠ | — | 52.4738, -7.8943 | [FarmFinder](https://farmfinder.ie/producer/con-traas-ltd); via Organic Trust |
| Emerald Oils | New Inn (nearest, 1.7 km) | Otros | www.emeraldoils.ie | (052) 746 2828 | 52.4448663, -7.8582657 | [FarmFinder](https://farmfinder.ie/producer/emerald-oils); via SuperValu Food Academy |
| Golden Island | Boherlahan (nearest, 4.7 km) | Otros | goldenislandshoppingcentre.ie | (090) 647 6760 | 52.54986, -7.953377 | [FarmFinder](https://farmfinder.ie/producer/golden-island); via Irish Organic Association |
| Good Herdsmen Ltd | Cahir (nearest, 0.5 km) | Otros | www.goodherdsmen.ie | — | 52.373055, -7.931287699999999 | [FarmFinder](https://farmfinder.ie/producer/good-herdsmen-ltd); via Organic Trust |
| Green Goose | Borrisokane (nearest, 0.3 km) | Otros | thegreen1918.ie | (067) 27500 | 52.9931492, -8.1283759 | [FarmFinder](https://farmfinder.ie/producer/green-goose); via Organic Trust |
| Hayes' Farm of Tipperary | Two-Mile Borris (nearest, 2.3 km) | Otros | www.hayesfarm.ie | +35350444325 · sales@tippcheese.ie | 52.6529535, -7.7047285 | [FarmFinder](https://farmfinder.ie/producer/hayes-farm-of-tipperary); via NeighbourFood |
| Nancys Fancies | Cahir (nearest, 1.6 km) | Otros | nancysfancies.ie | 086 878 6398 | 52.3825725, -7.9455217 | [FarmFinder](https://farmfinder.ie/producer/nancys-fancies); via SuperValu Food Academy |
| NutShed | Nenagh (nearest, 0.3 km) | Otros | www.nutshed.ie | — | 52.8608511, -8.200721099999999 | [FarmFinder](https://farmfinder.ie/producer/nutshed); via Bord Bia Origin Green |
| Oak Park Foods | Clonmel (nearest, 2.1 km) | Otros | www.oakparkfoods.ie | (052) 744 1600 | 52.3676548, -7.6911939 | [FarmFinder](https://farmfinder.ie/producer/oak-park-foods); via SuperValu Food Academy |
| Ponaire Limited | Newport (nearest, 0.1 km) | Otros | www.ponaire.ie | (061) 373 713 | 52.7111721, -8.407485099999999 | [FarmFinder](https://farmfinder.ie/producer/ponaire-limited); via Organic Trust |
| Ribworld | Fethard (nearest, 0.9 km) | Otros | www.ribworld.ie | (052) 613 2374 | 52.473188699999994, -7.6917265 | [FarmFinder](https://farmfinder.ie/producer/ribworld); via Bord Bia Origin Green |
| Rivesci | Clonmel (nearest, 0.3 km) | Otros | rivesci.ie | — | 52.3517329, -7.7152932 | [FarmFinder](https://farmfinder.ie/producer/rivesci); via Food Culture Ireland |
| Sean Loughnane (Galway) Limited | Lagganstown (nearest, 2 km) | Otros | www.loughnanes.ie | — | 52.4737, -7.9961 | [FarmFinder](https://farmfinder.ie/producer/sean-loughnane-galway-limited); via Bord Bia Origin Green |
| Soil Renew Ireland Limited | Ardcroney (nearest, 0.6 km) | Otros | soilrenewireland.ie | 086 851 8129 | 52.932505799999994, -8.1493872 | [FarmFinder](https://farmfinder.ie/producer/soil-renew-ireland-limited); via Organic Trust |
| Tipperary Coop | Tipperary (nearest, 0.3 km) | Otros | www.arratipp.ie ⚠ | (062) 33111 | 52.4720942, -8.1618148 | [FarmFinder](https://farmfinder.ie/producer/tipperary-coop); via Bord Bia Origin Green |

## Needs one more fact — 51

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Cashel Fine Foods (registered as Una O'Dwyer Ltd T/A Cashel Fine Foods) | Cashel | Carne | — | — | — | DAFM meat 2635 |
| Compass Catering Services Ireland Ltd | Rearcross CookhouseNorth Tipperary Food | Carne | — | — | — | FSAI HSE 4070 |
| Crowe Farm Poultry LTD | Dundrum | Carne | — | — | — | DAFM meat 2976 |
| Crowe Meats LTD | Dundrum | Carne | — | — | — | DAFM meat 2580 |
| D & F Butchers | Cashel (nearest, 1.1 km) | Carne | — | (062) 51152 | 52.525571, -7.895734 | [FarmFinder](https://farmfinder.ie/producer/d-and-f-butchers); via Associated Craft Butchers of Ireland |
| Derrykearne Foods LTD | Roscrea | Carne | — | — | — | DAFM meat 3041 |
| Devaney's Dinners | DromTemplemore | Carne | — | — | — | FSAI HSE 4080 |
| Dew Valley Foods Ltd | Thurles | Carne | — | — | — | DAFM meat 753 |
| Eamon Ryan | Golden | Carne | — | — | — | DAFM meat 2867 |
| Honey Vale Foods Limited | Cahir | Carne | — | — | — | DAFM meat 513 |
| JWB Retail Sales LTD | Clonmel | Carne | — | — | — | DAFM meat 2572 |
| Lewis Butchers | New Inn (nearest, 3.7 km) | Carne | — | (062) 52570 | 52.472126, -7.900752 | [FarmFinder](https://farmfinder.ie/producer/lewis-butchers); via Associated Craft Butchers of Ireland |
| Martin O'Dwyer | Cashel | Carne | — | — | — | DAFM meat 2571 |
| Midland Fine Foods LTD | Birr | Carne | — | — | — | DAFM meat 2920 |
| O'Dwyer Butchers Killenaule | Cashel (nearest, 1 km) | Carne | — | (052) 915 6350 | 52.52318, -7.899258 | [FarmFinder](https://farmfinder.ie/producer/o-dwyer-butchers-killenaule); via Associated Craft Butchers of Ireland |
| O'Malley's Craft Butchers | Cashel (nearest, 3.7 km) | Carne | — | (062) 51152 | 52.483853, -7.898265 | [FarmFinder](https://farmfinder.ie/producer/o-malley-s-craft-butchers); via Associated Craft Butchers of Ireland |
| Oakpark Foods (registered as Honeyvale Foods Ltd. T/A Oakpark Foods) | Clonmel | Carne | — | — | — | DAFM meat 2056 |
| Paddy O'Dwyer Quality Meats | Cashel (nearest, 1.9 km) | Carne | — | (062) 65561 | 52.529714, -7.871167 | [FarmFinder](https://farmfinder.ie/producer/paddy-o-dwyer-quality-meats); via Associated Craft Butchers of Ireland |
| Quality Meats Thurles | Thurles (nearest, 1 km) | Carne | — | (0504) 20193 | 52.68055, -7.829547 | [FarmFinder](https://farmfinder.ie/producer/quality-meats-thurles); via Associated Craft Butchers of Ireland |
| Renegade Trading | Cashel | Carne | — | — | — | DAFM meat 3047 |
| Rib World (registered as M & M Walshe Ltd. T/A Rib World) | Fethard | Carne | — | — | — | DAFM meat 799 |
| St. Lukes Main Kitchen | Western RoadClonmel | Carne | — | — | — | FSAI HSE 4110 |
| Templetuohy Farm Fresh Foods Ltd | Cashel | Carne | — | — | — | DAFM meat 2892 |
| The Gourmet Butcher | Clonmel | Carne | — | — | — | DAFM meat 3037 |
| Thurles Bacon | Thurles | Carne | — | — | — | DAFM meat 2436 |
| Whelan Food & Meat Processors | Fethard | Carne | — | — | — | DAFM meat 3052 |
| DejaBrew | Thurles (nearest, 0.1 km) | Cerveza | — | — | 52.678887, -7.8131229 | OSM node/12918706181 |
| Boulabane Cheese Co Ltd | Boulabane Roscrea Tipperary | Lácteos y quesos | — | — | — | DAFM dairy IE1930 |
| Cais Na Tire Limited | Cloninaha Ballinderry Co Tipperary | Lácteos y quesos | — | — | — | DAFM dairy IE1996 |
| Cashel Farmhouse Cheesemakers (registered as J & L Grubb Ltd) | Cashel Farmhouse Cheesemakers, Beechmount, | Lácteos y quesos | — | — | — | DAFM dairy IE 1823 |
| Cooleeney Cheese (registered as Marchminder Ltd) | Cooleeney Moyne Thurles Co | Lácteos y quesos | — | — | — | DAFM dairy IE1838 |
| Crawford's Farm (registered as Crawford's Farm Ltd) | Garraun Lane Cloughjordan Co. | Lácteos y quesos | — | — | — | DAFM dairy IE2125 |
| Fairgreen Ingredients Ltd | Knockanrawley Tipperary Town Co | Lácteos y quesos | — | — | — | DAFM dairy IE1947 |
| Shan Óg Dairy (registered as John Shanahan) | Fishmoyne Drom Borrisoleigh Co. | Lácteos y quesos | — | — | — | DAFM dairy IE2138 |
| The Blues Creamery Ltd | Newtown Aherlow Co Tipperary | Lácteos y quesos | — | — | — | DAFM dairy IE2187 |
| The Tipperary Cheese Company Ltd | Middle Piece Two-Mile-Borris Thurles | Lácteos y quesos | — | — | — | DAFM dairy IE1829 |
| Thurles Fresh Cream Milk Ltd | Templemore Rd. Thurles Co | Lácteos y quesos | — | — | — | DAFM dairy IE1433 |
| Clogheen | Clogheen (nearest, 3.9 km) | Otros | — | — | 52.272717752002244, -7.93909410732942 | [FarmFinder](https://farmfinder.ie/producer/clogheen); via yourhonestybox.com |
| Cúlbhac Farm | Newport (nearest, 2.4 km) | Otros | — | +35361525838 · culbhacfarm@gmail.com | 52.7272541, -8.3844321 | [FarmFinder](https://farmfinder.ie/producer/c-lbhac-farm); via NeighbourFood |
| Filligans Ltd | Lagganstown (nearest, 2 km) | Otros | — | — | 52.4737, -7.9961 | [FarmFinder](https://farmfinder.ie/producer/filligans-ltd); via Bord Bia Origin Green |
| Galtee Valley | New Inn (nearest, 3.1 km) | Otros | — | — | 52.463828, -7.908563 | [FarmFinder](https://farmfinder.ie/producer/galtee-valley); via SuperValu Food Academy |
| Gordons goodies | Cahir (nearest, 4 km) | Otros | — | — | 52.3817689, -7.8674207 | [FarmFinder](https://farmfinder.ie/producer/gordons-goodies); via yourhonestybox.com |
| Mad Beans Ltd | Clonmel (nearest, 2 km) | Otros | — | 0863057712 | 52.3710454, -7.7022795 | [FarmFinder](https://farmfinder.ie/producer/mad-beans-ltd); via Food Culture Ireland |
| Newcastle | Newcastle (nearest, 0.3 km) | Otros | — | — | 52.270690780296555, -7.8077835225128975 | [FarmFinder](https://farmfinder.ie/producer/newcastle); via yourhonestybox.com |
| O'Brien's Farm Shop | Nenagh | Otros | — | — | — | [FarmFinder](https://farmfinder.ie/producer/obriens-farm-shop) |
| Seymour Organics | Cashel (nearest, 3.3 km) | Otros | — | — | 52.487048, -7.88916 | [FarmFinder](https://farmfinder.ie/producer/seymour-organics-co-tipperary); via Irish Organic Association |
| Slievenamon View Organic Farm | Bouladuff (nearest, 3.5 km) | Otros | — | slievenamonview@gmail.com | 52.6848215, -7.8981472 | [FarmFinder](https://farmfinder.ie/producer/slievenamon-view-organic-farm); via NeighbourFood |
| The Pastry Studio | Bouladuff (nearest, 3.5 km) | Otros | — | steffan811217@gmail.com | 52.6848215, -7.8981472 | [FarmFinder](https://farmfinder.ie/producer/the-pastry-studio); via NeighbourFood |
| Tullahay Farm | Grangemockler (nearest, 3.2 km) | Otros | — | dairy@tullahayfarm.ie | 52.424063, -7.4784287 | [FarmFinder](https://farmfinder.ie/producer/tullahay-farm); via NeighbourFood |
| Alla's Patisserie | Cahir (nearest, 0 km) | Pan y cereal | — | — | 52.3746423, -7.9252459 | OSM node/11348413286 |
| The Bread Shed | Newcastle (nearest, 2.3 km) | Pan y cereal | — | — | 52.29215954776858, -7.8027270533413855 | [FarmFinder](https://farmfinder.ie/producer/the-bread-shed); via yourhonestybox.com |

## Name and county only — 24

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Brendan Healy | Bansha (nearest, 0.2 km) | Carne | shop=butcher | +353 62 546 90; +353 87 958 6091 | OSM node/8130191112 |
| Crawfords Farm | — | Carne | Farm; Organic, NeighbourFood, Dairy, Eggs | — | [FarmFinder](https://farmfinder.ie/producer/crawfords-farm) |
| Castlegrace Distillery | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/castlegrace-distillery) |
| The Apple Farm | — | Cerveza | Farm; NeighbourFood, Fruit, Vegetables, Beer; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/the-apple-farm) |
| Tipperary Boutique Distillery Limited | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/tipperary-boutique-distillery-limited) |
| Annie's Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/annies-organic-farm) |
| Barbara Russell Catering | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/barbara-russell-catering-2) |
| Cloncannon Biofarm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/cloncannon-biofarm) |
| Fine Fins | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/fine-fins-tipperary) |
| Magner's Farm Box | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/magners-farm-box) |
| Mags Home Baking | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/mags-home-baking) |
| Robert A Merry & Co Limited | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/robert-a-merry-and-co-limited) |
| Rocker Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/rocker-organic-farm) |
| Ross & Amy Jackson | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/ross-and-amy-jackson) |
| The Friendly Farmer | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-friendly-farmer) |
| The Little Deer | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-little-deer) |
| Bart Pawlukojc and his wife Nicole Server | — | Pan y cereal | Producer; Bread & Bakery | — | [FarmFinder](https://farmfinder.ie/producer/bart-pawlukojc-and-his-wife-nicole-server) |
| Hickeys Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/hickeys-bakery) |
| In Season Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/in-season-bakery) |
| The Tipperary Kitchen | Thurles | Pan y cereal | shop=bakery | +353 504 43257 | OSM node/3346836977 |
| Wood Fired Bakery | Cloughjordan (nearest, 0.7 km) | Pan y cereal | shop=bakery | — | OSM node/2420767407 |
| Daly's Seafood | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/dalys-seafood-tipperary-osm-637028) |
| Adams Cider Company | — | Sidra | listed | — | [FarmFinder](https://farmfinder.ie/producer/adams-cider) |
| Longways Cider | — | Sidra | listed | — | [FarmFinder](https://farmfinder.ie/producer/longways-cider) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
