# Cavan — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/ulster/cavan.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/cavan>.
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

### Production signal — 44 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Barry Johns Sausages | Poles | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2908 |
| Cavan Country Produce | Unit 4 Cootehill Enterprise ParkCootehil | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4121 |
| Choice Cuts | Swanlinbar | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2715 |
| Flynn's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/12596303354 | — | FarmFinder https://farmfinder.ie/producer/flynn-s-butchers |
| Gaynor and Sons | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/11784670122 | — | FarmFinder https://farmfinder.ie/producer/gaynor-and-sons |
| Lynch's Victualler's | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/lynch-s-victualler-s |
| M & M Meats | Bailieboro | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 3012 |
| Manor Farm (registered as Carton Brothers T/A Manor Farm) | Shercock | Carne | Minced Meat, Meat Preparations | — | DAFM meat 803 |
| McCarren Meats UC | Cavan | Carne | Meat Preparations, Meat Products Non RTE; also OSM way/332003659 | — | DAFM meat 608 |
| McGurren's Artisan Butchers | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork; also OSM node/11805566639 | — | FarmFinder https://farmfinder.ie/producer/mcgurren-s-artisan-butchers |
| Sheelin Meats | Finea | Carne | Minced Meat, Meat Products RTE | — | DAFM meat 2448 |
| Sullivan Centre Kitchen | Cathedral RoadCavan | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4113 |
| Bréifne Gael Brewing | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/breifne-gael-brewing |
| Áine Handmade Chocolate | — | Chocolate | listed | — | FarmFinder https://farmfinder.ie/producer/ine-handmade-chocolate |
| Moran's Mega Jam | — | Conservas | listed | — | FarmFinder https://farmfinder.ie/producer/morans-mega-jam |
| Mushrooms and Love | — | Fruta y verdura | Producer; Fruit, Vegetables, Food Culture Ireland, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/mushrooms-and-love |
| Ice Cream Treats Ltd | Killashandra Enterprise Centre Portaliff | Helados | Bovine, TRADER | — | DAFM dairy 1715 |
| Andrews Free Range Farm Fresh Hen and Duck Eggs | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/andrews-free-range-farm-fresh-hen-and-duck-eggs |
| Anna May Daly | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/anna-may-daly |
| Ben's Eggs | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/bens-eggs |
| Cluck & Collect free range eggs | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/cluck-collect-free-range-eggs |
| Forest Hill Farm | — | Huevos | Farm; Vegetables, Fruit, Eggs, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/forest-hill-farm |
| Vending machine | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, remaining); also FarmFinder https://farmfinder.ie/producer/egg-vending-machine-lisannymore-road-cavan; also FarmFinder https://farmfinder.ie/producer/egg-vending-machine-main-street-cavan; also FarmFinder https://farmfinder.ie/producer/egg-vending-machine-dublin-road-cavan | — | FarmFinder https://farmfinder.ie/producer/vending-machine |
| Abbott Ireland | Dromore West Cootehill Co | Lácteos y quesos | Bovine, INFANT FORMULA | — | DAFM dairy 1701 |
| Andrew and Aodhagon Smith | Farnadolly Crossdoney Co. Cavan | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2192 |
| Corleggy Cheese (registered as Silke Cropp) | Corleggy Cheeses, Corleggy, Belturbet, | Lácteos y quesos | Bovine, Caprine, Ovine, SMALL - MEDIUM | — | DAFM dairy IE1816 |
| Maudabawn Co-op Creamery | Maudabawn Cootehill Co Cavan | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1513 |
| Corduff Organic Farm, Ballinagh,Co Cavan | — | Miel | Farm; IOA Member, Organic, Preserves, Honey | — | FarmFinder https://farmfinder.ie/producer/corduff-organic-farm-ballinagh-co-cavan |
| Muff Honey | — | Miel | listed; Baked Goods, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/muff-honey |
| Alpha Organics - Richard Moeran | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/alpha-organics-richard-moeran |
| Blissful Bites Bake Shed | — | Otros | listed; Preserves, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/blissful-bites-bake-shed |
| Body Aura Therapies | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/body-aura-therapies |
| Breffni Foods | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/breffni-foods |
| Corlegggy Cheeses | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/corlegggy-cheeses |
| County Cavan Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/county-cavan-association |
| Digges Beekeepers’ Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/digges-beekeepers-association |
| Killycavan Cakes & Bakes | — | Otros | listed; Preserves, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/killycavan-cakes-bakes |
| Lilliput Trading Company | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lilliput-trading-company |
| Rathkenny Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rathkenny-farm |
| sauceman ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sauceman-ltd |
| Stoney, Susan | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/stoney-susan |
| Temple Farms Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/temple-farms-ltd |
| Clucks of The Bridge | — | Pan y cereal | listed; Eggs, Bread & Bakery, Farm Gate, yourhonestybox.com | — | FarmFinder https://farmfinder.ie/producer/clucks-of-the-bridge |
| Cullys Craft Bakery | — | Pan y cereal | Producer; Bread & Bakery, Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/cullys-craft-bakery |

### Facility or shopfront only — 33 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Argue Meats | Cootehill | Carne | Slaughtering, Cutting only | — | DAFM meat 2557 |
| Argue's Butchers | — | Carne | shop=butcher | — | OSM node/11787182649 |
| Blacks Butchers | Bailieborough | Carne | Slaughtering, Cutting only; also OSM node/12682129229 | — | DAFM meat 2647 |
| Brogan's Butchers | — | Carne | shop=butcher | — | OSM node/12249306256 |
| Conaty Butchers | — | Carne | shop=butcher | — | OSM node/11699184218 |
| Crowe's Butchers | — | Carne | shop=butcher | — | OSM node/11715236674 |
| Crowes Meats Barry Johns | — | Carne | shop=butcher | — | OSM way/253239344 |
| Cunningham Bacon and Pork | — | Carne | shop=butcher | — | OSM node/11805515008 |
| Donnelly's Family Butchers | — | Carne | shop=butcher | — | OSM node/11506995247 |
| Harry's Butchers | Cootehill | Carne | shop=butcher | — | OSM node/11169497879 |
| Heery Meats | Bawnbnoy | Carne | Slaughtering, Cutting only | — | DAFM meat 2447 |
| HERD Craft Butchers | — | Carne | shop=butcher | — | OSM node/13167821490 |
| K Fitzsimons Butchers | — | Carne | shop=butcher | — | OSM way/1121451780 |
| Leonard Lynch | Ballyjamesduff | Carne | Slaughtering, Cutting only | — | DAFM meat 2655 |
| Liffey Meats (registered as Liffey Meats (Cavan) UC. T/A Liffey Meats) | Ballyjamesduff | Carne | Minced Meat, Meat Preparations; national-scale brand | — | DAFM meat 325 |
| Lynch's Victuallers | — | Carne | shop=butcher | — | OSM way/1089329022 |
| Maguire's Victualler | — | Carne | shop=butcher | — | OSM way/992813362 |
| Michael Gaynor | Ballinagh | Carne | Slaughtering, Cutting only | — | DAFM meat 2636 |
| Paddy Gaynor Craft Butchers | — | Carne | shop=butcher | — | OSM node/11784670253 |
| Pat O'Reilly | — | Carne | shop=butcher | — | OSM way/1119483391 |
| Patrick Gaynor | Ballinagh | Carne | Slaughtering, Cutting only | — | DAFM meat 2637 |
| Tavan Meats | Mullagh | Carne | Slaughtering only | — | DAFM meat 2993 |
| Áine's Hand Made Chocolates | — | Chocolate | shop=chocolate | — | OSM node/8044242511 |
| Tuck Shop | — | Dulces y repostería | shop=confectionery | — | OSM node/12918885719 |
| Lakeland Dairies Co-op Society Ltd | Killeshandra Co Cavan | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING); national-scale brand | — | DAFM dairy IE1516 |
| Blacks of Bailieborough Deli | — | Otros | shop=deli | — | OSM node/12682129230 |
| Carol's home bakery | — | Pan y cereal | shop=bakery | — | OSM node/2444800093 |
| Cully's Craft Bakery | Arva | Pan y cereal | shop=bakery | — | OSM way/1111141129 |
| Delicious | — | Pan y cereal | shop=bakery | — | OSM way/1121451709 |
| Dinkin's Home Bakery & Cafe | — | Pan y cereal | shop=bakery | — | OSM node/11787337711 |
| LJ's Bakery | — | Pan y cereal | shop=bakery | — | OSM node/12745770701 |
| Maudie's | — | Pan y cereal | shop=bakery | — | OSM node/3073304633 |
| The Corner Bakery | — | Pan y cereal | shop=bakery | — | OSM node/11784670255 |
## Corleggy Cheese — no current source (2026-08-11)

`corleggy.com` returns NXDOMAIN, confirmed on 2026-08-11 by a second route (no A
and no NS record), so the farmhouse cheese producer known by that name has no
usable current web source here. `cais.ie`, the farmhouse cheesemakers'
association that would normally carry it, is NXDOMAIN as well.

To resolve: establish whether the productive unit is still active from an
official register or another current source before any row. A dead domain is not
evidence of closure.

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
