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

## Held after verification — 9

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Borrisoleigh Bottling Ltd | Otros | Bblco.ie serves an under-construction placeholder; Borrisoleigh Bottling needs a current source. |
| Compsey Creamery | Lácteos y quesos ? | Compsey Creamery publishes cream cheese, mascarpone and cottage cheese made for foodservice providers, manufacturers and processors; whether it has an own offer attributable through sale is unresolved. |
| Golden Irish Eggs | Huevos | The site carried for Golden Irish Eggs is magnersfarm.com, a regenerative farm trading as Magners Farm; the identities differ and the farm publishes no Irish address. |
| Golden Island | Otros | The SiteGround challenge did not clear in a browser session either; on this host it sometimes auto-redirects and sometimes escalates to a hand-solved captcha. It needs a person in a browser. |
| Green Goose | Otros | The site carried for Green Goose is thegreen1918.ie, a Borrisokane bar and restaurant; the URL must not be carried. |
| Kilkenny Cheese Limited | Lácteos y quesos | Kilkenny Cheese is a Tirlán and Royal A-ware joint venture whose plant sits at Belview on the Kilkenny-Waterford border under an X91 Eircode; the lead was filed in the tipperary note and its area is unresolved. |
| Ribworld | Otros | RibWorld publishes a business-to-business rib and pulled-pork range under Sofina Foods with no consumer offer or own address; scope and location are unresolved. |
| Tipperary Coop | Otros | Arratipp publishes Tipperary Co-op's dairy ingredients, powders and agri retail arms; whether an own consumer food offer exists is unresolved. |
| Tipperary Organic Ice Cream | Helados | The site carried for Tipperary Organic Ice Cream is arratippstores.ie, an ArraTipp DIY, agri and hardware store; the URL must not be carried. |

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
