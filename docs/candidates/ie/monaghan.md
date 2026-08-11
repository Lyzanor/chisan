# Monaghan — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/ulster/monaghan.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/monaghan>.
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

### Production signal — 45 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Arthur Mallon Foods Ltd | Monaghan | Carne | Minced Meat, Meat Preparations; also FarmFinder https://farmfinder.ie/producer/arthur-mallon-foods | — | DAFM meat 406 |
| Connolly Meats Ltd | Scotstown | Carne | Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/connolly-meats | — | DAFM meat 795 |
| Eamon Byrne Butchers | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork; also OSM node/11489824232 | — | FarmFinder https://farmfinder.ie/producer/eamon-byrne-butchers |
| Farney Foods Ltd | Carrickmacross | Carne | Meat Products RTE | — | DAFM meat 2315 |
| Feldhues Gmbh Fleishwaren Production | Clones | Carne | Meat Products RTE | — | DAFM meat 738 |
| Grove Farm (registered as Grove Turkeys Ltd T/A Grove Farm) | Smithboro | Carne | Minced Meat, Meat Preparations | — | DAFM meat 807 |
| IGWT Poultry Services Ltd | Castleblayney | Carne | Minced Meat, Meat Preparations; also FarmFinder https://farmfinder.ie/producer/igwt-poultry-services | — | DAFM meat 855 |
| Karro McGee ROI Ltd | Castleblayney | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2023 |
| Larmer's Butchers Newbliss | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/larmer-s-butchers-newbliss |
| Mallon's Food Hall | Monaghan | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/9853187937 | +353 47 81623 | FarmFinder https://farmfinder.ie/producer/mallon-s-food-hall |
| Malone Food Products | Castleblayney | Carne | Meat Products RTE | — | DAFM meat 790 |
| McCaughey Foods (registered as Flamewood Ltd. T/A McCaughey Foods) | Castleblayney | Carne | Meat Products RTE | — | DAFM meat 575 |
| Pilgrim's Food Masters Ireland Limited | Carrickmacross | Carne | Meat Preparations, Meat Products RTE | — | DAFM meat 747 |
| Provincial Agri Foods Limited | Carrickmacross | Carne | Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2068 |
| Rangeland Foods | Castleblayney | Carne | Minced Meat, Meat Preparations | — | DAFM meat 717 |
| Silver Hill Foods UC | Emyvale | Carne | Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/silver-hill-farm-foods-shop | — | DAFM meat 801 |
| St Davnets Hospital Centralised Kitchen | HSE | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4074 |
| Stillorgan Trading Post Limited | Swift Fine Foods | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4025 |
| The Real Meal Company | Monaghan | Carne | Meat Products RTE | — | DAFM meat 2977 |
| Annalitten Foods Ltd | — | Huevos | Producer; Origin Green Member, Eggs, Bord Bia Origin Green | — | FarmFinder https://farmfinder.ie/producer/annalitten-foods-ltd |
| Creeve | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/creeve |
| Katies Fabulous eggs | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/katies-fabulous-eggs |
| Mullinacross | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/mullinacross |
| The Nestbox Egg Company | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/the-nestbox-egg-company |
| Doapey CA & DS Ltd | Aghabog Co Monaghan | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1512 |
| Newbaze Ireland Nutrition Food Co Ltd | Carrickmacross Industrial Estate Carrickmacross | Lácteos y quesos | Bovine, TRADER | — | DAFM dairy 1714 |
| Camphill Community Ballybay - Camphill Community of Ireland | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/camphill-community-ballybay-camphill-community-of-ireland |
| Crawley, Kenny | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/crawley-kenny |
| Greenfield Foods Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/greenfield-foods-ltd |
| Grove Turkeys LTD. | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/grove-turkeys-ltd |
| Lough Egish Foods | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/lough-egish-foods |
| McBride Trevor | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mcbride-trevor |
| Monaghan Mushrooms Group | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/monaghan-mushrooms-group |
| Subh Fraoċ Bán | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/subh-fraoc-ban |
| The Grazing Goat | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-grazing-goat |
| Todd, Malachy - Organic Farm. | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/todd-malachy-organic-farm |
| Carleton Cakes | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate, Honesty Box; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/carleton-cakes |
| Celtic Crumb | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/celtic-crumb |
| Dinkins Bakery | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/dinkins-bakery |
| Drummully Boxty | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/drummully-boxty |
| Matilda's Bakery | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/matilda-s-bakery |
| McCaghey Turkeys Farm Shop & Bakery | — | Pan y cereal | Farm; Bread & Bakery, Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/mccaghey-turkeys-farm-shop-and-bakery |
| The Gluten Free Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/the-gluten-free-bakery |
| The Wrens nest | — | Pan y cereal | listed; Eggs, Vegetables, Preserves, Bread & Bakery | — | FarmFinder https://farmfinder.ie/producer/the-wrens-nest |
| Sole & Sea | — | Pescado | Producer; Seafood | — | FarmFinder https://farmfinder.ie/producer/sole-and-sea-monaghan |

### Facility or shopfront only — 21 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| ABP Clones (registered as Anglo Beef Processors Ireland UC T/A ABP Clones) | Clones | Carne | Minced Meat, Meat Preparations; national-scale brand | — | DAFM meat 378 |
| Bill's Butchers | Ballybay | Carne | shop=butcher | — | OSM node/11495592264 |
| Carrick Butcher & Deli | Carrickmacross | Carne | shop=butcher | — | OSM node/11492954574 |
| Charley Meats Ltd | Castleshane | Carne | Slaughtering, Cutting only; also OSM node/13248210476 | — | DAFM meat 2997 |
| Duffys Pork & Bacon Ltd | Castleblayney | Carne | Cutting only | — | DAFM meat 2328 |
| Gerard & Martin Quinn | Ballybay | Carne | Slaughtering only | — | DAFM meat 2649 |
| Hugh Maguire & Son | Clones | Carne | shop=butcher | — | OSM node/11454003679 |
| Kepak Ballybay | Ballybay | Carne | Minced Meat, Meat Preparations; national-scale brand | — | DAFM meat 2038 |
| Nolan's | Carrickmacross | Carne | shop=butcher | — | OSM node/11368196817 |
| Quinn's Quality Meats | Castleblayney | Carne | shop=butcher | — | OSM node/11493933183 |
| Shortt's Butchers | — | Carne | shop=butcher | — | OSM node/11490136335 |
| Shortts Ltd | Castleblaney | Carne | Slaughtering, Cutting only | — | DAFM meat 2462 |
| Treanor Poultry (registered as Adrian Treanor T/A Treanor Poultry) | Knocaconny | Carne | Cutting only | — | DAFM meat 2750 |
| Walsh's | Carrickmacross | Dulces y repostería | shop=confectionery | — | OSM node/9348222485 |
| Lakeland Dairies | — | Lácteos y quesos | Producer; Dairy, Bord Bia Origin Green; national-scale brand | — | FarmFinder https://farmfinder.ie/producer/lakeland-dairies |
| Cake Studio | Caledon | Pan y cereal | shop=bakery | — | OSM node/13437614759 |
| Dinkin’s Home Bakery | Monaghan | Pan y cereal | shop=bakery | — | OSM way/381863959 |
| Dinkins Coffee Shop | — | Pan y cereal | shop=bakery | — | OSM node/5176844113 |
| Hilltop Deli | — | Pan y cereal | shop=bakery | — | OSM node/11495617183 |
| Homebake | Carrickmacross | Pan y cereal | shop=bakery | — | OSM node/11368196818 |
| McJamee's | — | Pan y cereal | shop=bakery | — | OSM node/11493016174 |
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
| Brehon Brewhouse | Dunelty | brehonbrewhouse.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
