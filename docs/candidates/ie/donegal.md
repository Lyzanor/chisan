# Donegal — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/ulster/donegal.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/donegal>.
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

### Production signal — 61 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Kombucha Na Dálaigh | — | Bebidas sin alcohol | listed | — | FarmFinder https://farmfinder.ie/producer/kombucha-na-dalaigh |
| Corveen Glen (registered as Hugh Gallagher T/A Corveen Glen) | Derrybeg | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2994 |
| EWS Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/ews-butchers |
| Foyle Donegal (registered as Donegal Meat Processors T/A Foyle Donegal) | Carrigans | Carne | Meat Preparations | — | DAFM meat 292 |
| Frizzell's Craft Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/frizzell-s-craft-butchers |
| Glenside Bacon Company (registered as Ballyboden Ltd T/A Glenside Bacon Company) | Glenties | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 550 |
| KP Gallen Foods Limited | Unit 2 & 3 Thorn RoadLetterkenny | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4112 |
| McCarron's Butchers (registered as Brian McCarron T/A McCarron's Butchers) | Raphoe | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2926 |
| McGee Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/mcgee-butchers |
| Noone's Poultry | Clonmany | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 3001 |
| Twin Towns Quality Meats (registered as John Gallagher T/A Twin Towns Quality Meats) | Castlefinn | Carne | Minced Meat, Meat Products Non RTE | — | DAFM meat 3005 |
| Donegal Brewing Company | Ballyshannon | Cerveza | craft=brewery | diceys.com · +353719851371 · sales@diceys.com | OSM node/9094594628 |
| Dopey Dick Brewing Company | — | Cerveza | craft=brewery; product=craft_beer | www.dopeydick.co.uk | OSM way/682374549 |
| Northbound Brewing | — | Cerveza | craft=brewery; product=craft_beer | www.northboundbrewery.com | OSM node/8639876849 |
| Otterbank Brewing Company | Muff | Cerveza | craft=brewery | otterbankbrewing@gmail.com | OSM node/9094841894 |
| Ardara Distillery | — | Destilados y licores | craft=distillery | www.sliabhliagdistillers.com | OSM way/1072070010 |
| Quality Sea Veg | — | Fruta y verdura | Producer; Fruit, Vegetables, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/quality-sea-veg |
| Green Pastures Donegal | Convoy Lifford Co. Donegal | Lácteos y quesos | Bovine, Caprine, SMALL - MEDIUM | — | DAFM dairy IE1058 |
| Gupta's Sweets & Snacks (registered as Shailly Aggarwal) | Unit 1, Bunnagee Business | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2180 |
| HDI Ltd (registered as Hassett Dairy Ingredients Ltd) | Ballyshannon IT Centre Portnason | Lácteos y quesos | N/A, TRADER | — | DAFM dairy 1708 |
| Natural Dairies | Convoy Co Donegal | Lácteos y quesos | Bovine, DRINKING MILK PLANT | — | DAFM dairy IE1426 |
| Nomadic Foods Ltd | Crossroads Killygordon Co Donegal | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1105 |
| The Milk Bar (registered as Shannon Porter) | Lusticle Carrigans Lifford Co | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2166 |
| Bentley and Sons | — | Miel | Producer; Honey, Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/bentley-and-sons |
| Algaran Teo - Organic Seaweed Products Manufacturer | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/algaran-teo-organic-seaweed-products-manufacturer |
| Algaran Teo Health & Beauty Products | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/algaran-teo-health-and-beauty-products |
| Atlanfish Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/atlanfish-ltd |
| Atlantic Dawn | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/atlantic-dawn |
| Ballyholey Farm Shop | — | Otros | Farm; Farm Gate, Farm Shops Ireland; also FarmFinder https://farmfinder.ie/producer/ballyholey-farm | — | FarmFinder https://farmfinder.ie/producer/ballyholey-farm-shop |
| Bells Isle Seafoods Ltd/ Irish Oysters Harvest Ltd. | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bells-isle-seafoods-ltd-irish-oysters-harvest-ltd |
| Boeshill Organics | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/boeshill-organics |
| Coco Milis | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/coco-milis |
| Donegal Rapeseed Oil | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/donegal-rapeseed-oil |
| Donegal Sea Salt | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/donegal-sea-salt |
| Drioglann Sliabh Liag CGA | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/drioglann-sliabh-liag-cga |
| Drioglann Thir Chonaill Teoranta | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/drioglann-thir-chonaill-teoranta |
| Errigal Bay | — | Otros | listed; also FarmFinder https://farmfinder.ie/producer/errigal | — | FarmFinder https://farmfinder.ie/producer/errigal-bay |
| Gallagher Bros Ltd & Ocean Farm Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gallagher-bros-ltd-and-ocean-farm-ltd |
| Gallagher’s Quality Meats | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gallaghers-quality-meats |
| Glenborin | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/glenborin |
| Killybegs Seafoods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/killybegs-seafoods |
| Lakeside farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lakeside-farm |
| Living Green | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/living-green |
| Mallow Mia | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mallow-mia |
| Mc Bride Fishing | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mc-bride-fishing |
| Norfish Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/norfish-ltd |
| Procklis | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/procklis |
| Sliogeisc na Rossan | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sliogeisc-na-rossan |
| Tullyhouse Organic Farm, Co. Donegal | — | Otros | Farm; IOA Member, Organic, Vegetables, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/tullyhouse-organic-farm-co-donegal |
| Ulster Mead Co. | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ulster-mead-co |
| Wild Fuschia Bakehouse | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wild-fuschia-bakehouse |
| Belle's Kitchen | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/belle-s-kitchen |
| Blas Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/blas-bakery |
| Blistered Bread | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/blistered-bread |
| Gallaghers Bakery | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/gallaghers-bakery |
| Odonnells Bakery | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/odonnells-bakery |
| Promise Gluten Free | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/promise-gluten-free |
| Atlantic Treasures Fish Shop | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/atlantic-treasures-fish-shop-donegal |
| Premier Fish Products | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/premier-fish-products |
| Sean Ward (Fish Exports) Ltd | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/sean-ward-fish-exports-ltd |
| Shines Seafood | — | Pescado | Producer; Seafood, SuperValu Food Academy; also FarmFinder https://farmfinder.ie/producer/killybegs-catch-ltd-shines-seafood | — | FarmFinder https://farmfinder.ie/producer/shines-seafood |

### Facility or shopfront only — 34 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Anthony McGettigan | Milford | Carne | Slaughtering only | — | DAFM meat 2440 |
| Boggs | — | Carne | shop=butcher | — | OSM node/1622874544 |
| Byrnes Meats | — | Carne | shop=butcher | — | OSM node/9712767240 |
| C & J Meats Ireland | Lifford | Carne | Slaughtering, Cutting only | — | DAFM meat 604 |
| C. MCloone & Sons | Killybegs | Carne | shop=butcher | — | OSM way/835848857 |
| Carrick Butchers | — | Carne | shop=butcher | — | OSM way/314164467 |
| Charles Gallagher | Castlefinn | Carne | Slaughtering only | — | DAFM meat 2433 |
| Clonmany | — | Carne | shop=butcher | — | OSM node/10860553333 |
| Doherty's Butchers | Letterkenny | Carne | shop=butcher | — | OSM node/4775028419 |
| Donal McCauley Butchers | — | Carne | shop=butcher | — | OSM node/1925700613 |
| Eddie Walsh & Sons | — | Carne | shop=butcher | — | OSM node/9590285543 |
| Jonathan Kerr | Ramelton | Carne | Slaughtering only | — | DAFM meat 2483 |
| McColgan's Butchers | — | Carne | shop=butcher | — | OSM way/949054015 |
| McGaherns | — | Carne | shop=butcher | — | OSM node/9700699963 |
| McGavigan Meats LTD (registered as Liam McGavigan T/A McGavigan Meats LTD) | Lifford | Carne | Cutting only | — | DAFM meat 3038 |
| McMonagle's Family Butcher | — | Carne | shop=butcher | — | OSM way/949053945 |
| Millbridge Meats | — | Carne | shop=butcher | — | OSM node/4000935308 |
| O'Flynns Quality Meats | — | Carne | shop=butcher | — | OSM node/13041289484 |
| Patrick Patton & Sons | — | Carne | shop=butcher | — | OSM node/2807396167 |
| Paul's Butchers | — | Carne | shop=butcher | — | OSM node/13050269184 |
| Sean's Butchers | — | Carne | shop=butcher | — | OSM node/778525917 |
| Shiel's Butchers | — | Carne | shop=butcher | — | OSM node/1279160996 |
| Swilly Meats | Letterkenny | Carne | shop=butcher | — | OSM node/1295137475 |
| Walsh Butchers | Ballintra | Carne | Slaughtering only | — | DAFM meat 2420 |
| Molly's Sweet Shop | — | Dulces y repostería | shop=confectionery | — | OSM node/2400789784 |
| Yummies | — | Dulces y repostería | shop=confectionery | — | OSM node/1454843894 |
| Aurivo Consumer Foods Ltd | Crossroads Killygordon Co Donegal | Lácteos y quesos | Bovine, DRINKING MILK PLANT; national-scale brand | — | DAFM dairy IE1419 |
| Nomadic Dairy | — | Lácteos y quesos | shop=dairy | www.nomadic-dairy.com · +353 74 914 9678 · hello@nomadic-dairy.com | OSM node/7966971679 |
| Culmore Farm Shop | Culmore | Otros | shop=farm | — | OSM node/13948712211 |
| Egg Nest | — | Otros | shop=farm | — | OSM node/14082008585 |
| The Green Man | — | Otros | shop=deli | — | OSM node/3075437444 |
| Daniel Doherty's Bakery Ltd. | — | Pan y cereal | shop=bakery | — | OSM way/1043082664 |
| Mc Colgan's Foodhall | — | Pan y cereal | shop=bakery | — | OSM node/2675958567 |
| The Bakery Ebrington | — | Pan y cereal | shop=bakery | — | OSM node/12228095017 |
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
| Donegal Brewing Co. | — | donegalbrewingcompany.com |
| Otterbank Brewing and Blending | — | otterbankbrewing.com |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
