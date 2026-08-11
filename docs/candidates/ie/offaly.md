# Offaly — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/offaly.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/offaly>.
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

### Production signal — 63 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Feighery’s Farm Beetroot Juice | — | Bebidas sin alcohol | Beverage; also FarmFinder https://farmfinder.ie/producer/feighery-s-farm | — | Midlands directory https://www.midlandsireland.ie/producers_directory/feigherys-farm-beetroot-juice/ |
| KO Kombucha | — | Bebidas sin alcohol | listed | — | FarmFinder https://farmfinder.ie/producer/ko-kombucha |
| William Grant and Sons | — | Bebidas sin alcohol | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/william-grant-and-sons/ |
| The Little Coffee Co | — | Café | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/the-little-coffee-co/ |
| Ashgate Farm Meats (registered as Clive Clarke T/A Ashgate Farm Meats) | Dunkerrin | Carne | Minced Meat, Meat Products Non RTE | — | DAFM meat 2754 |
| Bergin Family Butchers Edenderry | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/bergin-family-butchers-edenderry |
| Brophil Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/9956779938 | — | FarmFinder https://farmfinder.ie/producer/brophil-meats |
| Carroll Cuisine UC | Tullamore | Carne | Meat Products RTE; also FarmFinder https://farmfinder.ie/producer/carroll-cuisine-ul | — | DAFM meat 741 |
| CR Tormey & Sons Tullamore | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/cr-tormey-and-sons-tullamore |
| Healy Family Meats Ltd (registered as Michael Healy T/A Healy Family Meats Ltd) | Banagher | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 3034 |
| Hereford & More | — | Carne | Meats | — | Midlands directory https://www.midlandsireland.ie/producers_directory/hereford-more/ |
| Island Farm Foods | — | Carne | Farm; Organic, NeighbourFood, Beef, Lamb | — | FarmFinder https://farmfinder.ie/producer/island-farm-foods |
| John Dwyer Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/john-dwyer-butchers |
| Midlands Fine Foods Ltd. | — | Carne | Meats | — | Midlands directory https://www.midlandsireland.ie/producers_directory/midlands-fine-foods-ltd/ |
| Pigs on the Green | — | Carne | Meats | — | Midlands directory https://www.midlandsireland.ie/producers_directory/pigs-on-the-green/ |
| Quarrymount Free Range Meats | — | Carne | Meats, Organic | — | Midlands directory https://www.midlandsireland.ie/producers_directory/quarrymount-free-range-meats/ |
| Rudd’s | — | Carne | Meats, Prepared Foods | — | Midlands directory https://www.midlandsireland.ie/producers_directory/rudds/ |
| Rudds Fine Foods (registered as Sean Loughnane (Galway) Ltd. T/A Rudds Fine Foods) | Birr | Carne | Minced Meat, Meat Preparations, Meat Products RTE, Meat Products Non RTE | — | DAFM meat 800 |
| Tullamore Meats Co-Operative | Tullamore | Carne | Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/tullamore | — | DAFM meat 2337 |
| Bog Standard Whiskey | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/bog-standard-whiskey |
| Slieve Bloom Brewing Co. | Kinnitty | Cerveza | listed; also OSM way/931946382 | slievebloombrewing.com · +353579137001 · info@slievebloombrewing.com | FarmFinder https://farmfinder.ie/producer/slieve-bloom-brewing-co |
| BiaSol | — | Comida preparada | Prepared Foods, Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/biasol/ |
| Mount Briscoe Organic Farm | — | Conservas | Organic, Preserves | — | Midlands directory https://www.midlandsireland.ie/producers_directory/mount-briscoe-organic-farm/ |
| Wild Irish Foragers | — | Conservas | Preserves | — | Midlands directory https://www.midlandsireland.ie/producers_directory/wild-irish-foragers/ |
| Tullamore Distillery | — | Destilados y licores | craft=distillery | — | OSM way/624790362 |
| Attinkee Farm | — | Fruta y verdura | Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/attinkee-farm/ |
| Fox Covert Farm | — | Fruta y verdura | Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/fox-covert-farm/ |
| Garryhinch Wood Exotic Mushrooms | — | Fruta y verdura | Organic, Produce; also FarmFinder https://farmfinder.ie/producer/garryhinch-exotic-mushrooms | — | Midlands directory https://www.midlandsireland.ie/producers_directory/garryhinch-wood-exotic-mushrooms/ |
| Mooney’s Organics Lough Boora Farm | — | Fruta y verdura | Organic, Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/mooneys-organics-lough-boora-farm/ |
| The Red Shed Organic Farm and Nursery | — | Fruta y verdura | Organic, Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/the-red-shed-organic-farm-and-nursery/ |
| Ballyteige | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/ballyteige |
| Egan Farm Vending | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/egan-farm-vending |
| Kilcormac | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/kilcormac |
| Susies Shed | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/susies-shed |
| The Bake shed | — | Huevos | listed; Eggs, Preserves, Farm Gate, yourhonestybox.com | — | FarmFinder https://farmfinder.ie/producer/the-bake-shed |
| Booley Foods | — | Lácteos y quesos | Dairy | — | Midlands directory https://www.midlandsireland.ie/producers_directory/booley-foods/ |
| Boora Bainne | — | Lácteos y quesos | Beverage, Dairy | — | Midlands directory https://www.midlandsireland.ie/producers_directory/boora-bainne/ |
| Boora Dairy Company Ltd | Leamore Tullamore Co Offaly | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2155 |
| Glenisk | — | Lácteos y quesos | Dairy, Organic | — | Midlands directory https://www.midlandsireland.ie/producers_directory/glenisk/ |
| Mossfield Organic Farm | Clareen Birr Offaly | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1953 |
| Ború Honey | — | Miel | Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/boru-honey/ |
| Ballybryan Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ballybryan-farm |
| Bon Chocolatiers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bon-chocolatiers |
| Coolnagrower Organic Produce Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/coolnagrower-organic-produce-ltd |
| County Offaly Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/county-offaly-association |
| Grennan, Gerard | — | Otros | listed; also OSM way/174012022 | — | FarmFinder https://farmfinder.ie/producer/grennan-gerard |
| Irish Casing Company | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/irish-casing-company |
| Keeney, Patrick J | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/keeney-patrick-j |
| Kirwan, James | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kirwan-james |
| Lough Boora Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lough-boora-organic-farm |
| McIntyre, Ann - Organic Suckler Herd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mcintyre-ann-organic-suckler-herd |
| Perrys Preserves | — | Otros | Producer; Preserves, SuperValu Food Academy, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/perrys-preserves |
| Rose Manufacturing Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rose-manufacturing-ltd |
| Slieve Bloom Organics | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/slieve-bloom-organics |
| Walsh, Francis | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/walsh-francis |
| Weir, Eugene | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/weir-eugene |
| Ali’s Kitchen | — | Pan y cereal | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/alis-kitchen/ |
| Cêline’s Homemade Cooking | — | Pan y cereal | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/celines-homemade-cooking/ |
| Little Sister Bakes | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/little-sister-bakes |
| O’Donohues Bakery | — | Pan y cereal | Bakery; also FarmFinder https://farmfinder.ie/producer/the-penny-loaf-co-odonohues-bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/odonohues-bakery/ |
| Paul Hurst Artisan Baker | — | Pan y cereal | Producer; Organic, Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/paul-hurst-artisan-baker |
| The Flatbread Company t/a Simpli Baked | — | Pan y cereal | Bakery; also FarmFinder https://farmfinder.ie/producer/simpli-baked | — | Midlands directory https://www.midlandsireland.ie/producers_directory/the-flatbread-company-t-a-simpli-baked/ |
| Treat Box Patisserie | — | Pan y cereal | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/treat-box-patisserie/ |

### Facility or shopfront only — 9 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Crossan's | — | Carne | shop=butcher | — | OSM node/2894521242 |
| D. L. Cullinane | Birr | Carne | shop=butcher | — | OSM node/10601474240 |
| Garry Daly Meats | — | Carne | shop=butcher | — | OSM way/271242996 |
| Irish Country Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry; national-scale brand | — | FarmFinder https://farmfinder.ie/producer/irish-country-meats |
| P. Browne | — | Carne | shop=butcher | — | OSM way/268783847 |
| Peter Dunican | — | Carne | shop=butcher | — | OSM node/1609219934 |
| Rosderra Irish Meats Group ULC | Edenderry | Carne | Meat Preparations; national-scale brand; also FarmFinder https://farmfinder.ie/producer/rosderra-irish-meats-group | — | DAFM meat 356 |
| William Browne | Ferbane | Carne | Slaughtering only | — | DAFM meat 2430 |
| C&G Flynn | — | Pan y cereal | shop=bakery | — | OSM node/4327830096 |
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
| River Shannon Brewery | — | rivershannonbrewery.com |
| Slieve Bloom Brewing | — | facebook.com/pikemanbrewing |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
