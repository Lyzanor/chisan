# Laois — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/laois.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/laois>.
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

### Production signal — 53 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Moore’s Drinks | — | Bebidas sin alcohol | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/moores-drinks/ |
| Seccoto Coffee | — | Café | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/seccoto-coffee/ |
| The Good Bean Coffee Roastery | — | Café | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/the-good-bean-coffee-roastery/ |
| Bob's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/bob-s-butchers |
| Castlewood Organic Farm | — | Carne | Meats, Organic | — | Midlands directory https://www.midlandsireland.ie/producers_directory/castlewood-organic-farm/ |
| Coolanowle Organic Meats | — | Carne | Meats, Organic | — | Midlands directory https://www.midlandsireland.ie/producers_directory/coolanowle-organic-meats/ |
| Feighery's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/feighery-s-butchers |
| Fiorbhia Farm | — | Carne | Meats | — | Midlands directory https://www.midlandsireland.ie/producers_directory/fiorbhia-farm/ |
| Michael Keegan | Mountrath | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2501 |
| OrganicMeat.ie | — | Carne | listed; Organic, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/organicmeat-ie |
| Quarrymount Free Range Meats | — | Carne | Meats, Organic | — | Midlands directory https://www.midlandsireland.ie/producers_directory/quarrymount-free-range-meats/ |
| 12 Acres Brewing Co. | — | Cerveza | Producer; Beer, Farm Gate, Online, remaining) | — | FarmFinder https://farmfinder.ie/producer/12-acres-brewing-co |
| Ballykilcavan Brewing Company | — | Cerveza | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/ballykilcavan-brewing-company/ |
| First Ireland Spirits | — | Cerveza | Producer; Origin Green Member, Beer, Cider, Spirits | — | FarmFinder https://farmfinder.ie/producer/first-ireland-spirits |
| Munster Brewery | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/munster-brewery |
| Origin Spirits Ltd | — | Cerveza | Producer; Origin Green Member, Beer, Cider, Spirits | — | FarmFinder https://farmfinder.ie/producer/origin-spirits-ltd |
| Ballyrider House Granola | — | Comida preparada | Prepared Foods | — | Midlands directory https://www.midlandsireland.ie/producers_directory/ballyrider-house-granola/ |
| ÍON Oil | — | Comida preparada | Organic, Prepared Foods | — | Midlands directory https://www.midlandsireland.ie/producers_directory/ion-oil/ |
| Le Skinny Chef | — | Comida preparada | Prepared Foods | — | Midlands directory https://www.midlandsireland.ie/producers_directory/le-skinny-chef/ |
| O’Mimo’s Chilli Madness | — | Comida preparada | Prepared Foods, Preserves | — | Midlands directory https://www.midlandsireland.ie/producers_directory/omimos-chilli-madness/ |
| The Jungle Food Company | — | Comida preparada | Prepared Foods | — | Midlands directory https://www.midlandsireland.ie/producers_directory/the-jungle-food-company/ |
| G’s Gourmet Jams | — | Conservas | Preserves | — | Midlands directory https://www.midlandsireland.ie/producers_directory/gs-gourmet-jams/ |
| Rose Cottage Fruit Farm | — | Conservas | Preserves, Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/rose-cottage-fruit-farm/ |
| Temptation Chocolates | — | Dulces y repostería | Confectionery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/temptation-chocolates/ |
| Bowfield Farm | — | Fruta y verdura | Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/bowfield-farm/ |
| Edmundburry Greens | — | Fruta y verdura | Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/edmundburry-greens/ |
| Farmer J’s | — | Fruta y verdura | Organic, Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/farmer-js/ |
| Garryhinch Wood Exotic Mushrooms | — | Fruta y verdura | Organic, Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/garryhinch-wood-exotic-mushrooms/ |
| Granstown Free Range Eggs | — | Fruta y verdura | Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/granstown-free-range-eggs/ |
| The Merry Mill | — | Fruta y verdura | Organic, Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/the-merry-mill-2/ |
| Egg Vending Machine (Ballinakill Road, Laois) | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/egg-vending-machine-ballinakill-road-laois |
| Egg Vending Machine (R432, Laois) | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/egg-vending-machine-r432-laois |
| Freerange eggs | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/freerange-eggs |
| LS Eggs | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/ls-eggs |
| Timahoe | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com | — | FarmFinder https://farmfinder.ie/producer/timahoe |
| Bracklone Dairies Ltd | Lea, Portarlington, Co. Laois, | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2182 |
| The Village Dairy | — | Lácteos y quesos | Dairy, Organic | — | Midlands directory https://www.midlandsireland.ie/producers_directory/the-village-dairy/ |
| Agvance Nutrition | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/agvance-nutrition |
| Baking Brunette | — | Otros | listed; Preserves, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/baking-brunette |
| Ballyhubbock Farm | — | Otros | Farm; Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/ballyhubbock-farm |
| Dunamaise Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dunamaise-association |
| Dunmore Produce Ltd | — | Otros | Producer; Origin Green Member, Bord Bia Origin Green | — | FarmFinder https://farmfinder.ie/producer/dunmore-produce-ltd |
| Fitzpatrick, John | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/fitzpatrick-john |
| Leo Dunne Organics | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/leo-dunne-organics |
| McLoughlin, Sheila | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mcloughlin-sheila |
| Sile Farm & Nursery | — | Otros | listed; Baked Goods, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/sile-farm-nursery |
| Aghaboe Farm Foods | — | Pan y cereal | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/aghaboe-farm-foods/ |
| Cocoa Couture | — | Pan y cereal | Bakery, Confectionery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/cocoa-couture/ |
| Mary Lowry’s Home Baking | — | Pan y cereal | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/mary-lowrys-home-baking/ |
| Milano Waffles | — | Pan y cereal | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/milano-waffles/ |
| Mueller & O’Connell Bakery | — | Pan y cereal | Bakery; also OSM node/411618911 | — | Midlands directory https://www.midlandsireland.ie/producers_directory/mueller-oconnell-bakery/ |
| Zephyr Yard | — | Pan y cereal | Bakery, Confectionery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/zephyr-yard/ |
| Al's Fish Shop | — | Pescado | Producer; Seafood | — | FarmFinder https://farmfinder.ie/producer/als-fish-shop |

### Facility or shopfront only — 22 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| A& S Meats | — | Carne | shop=butcher | — | OSM node/2777365760 |
| Andrew Sheil | — | Carne | shop=butcher | — | OSM node/863167580 |
| Clonmore Meats | — | Carne | shop=butcher | — | OSM node/842804804 |
| James Mulhall | Ballickmoyler | Carne | Slaughtering only | — | DAFM meat 2749 |
| JM Grath | Rathdowney | Carne | shop=butcher | — | OSM node/11091238353 |
| John Cahill | Rathdowney | Carne | Slaughtering only; also OSM node/11091246740 | — | DAFM meat 2502 |
| Kenna's Family Butcher | Durrow | Carne | shop=butcher | — | OSM node/9923182229 |
| M.J Keegan | — | Carne | shop=butcher | — | OSM node/5556021728 |
| Meadow Meats (registered as Dawn Meats Ireland UC T/A Meadow Meats) | Rathdowney | Carne | Slaughtering, Cutting only | — | DAFM meat 311 |
| P. Hennessy | — | Carne | shop=butcher | — | OSM node/9777834686 |
| Pat & Paul Harding | — | Carne | shop=butcher | — | OSM node/7813507898 |
| Pius Hennessy | Durrow | Carne | Slaughtering only | — | DAFM meat 2503 |
| PJ Delaney | Castletown | Carne | Slaughtering only | — | DAFM meat 2500 |
| The Butcher's Block | — | Carne | shop=butcher | — | OSM node/12905489146 |
| The Buther's Stop | — | Carne | shop=butcher | — | OSM node/2777265572 |
| Williams' Butchers | Abbeyleix | Carne | shop=butcher | — | OSM node/5250445723 |
| Odlums | — | Comida preparada | Prepared Foods; national-scale brand | — | Midlands directory https://www.midlandsireland.ie/producers_directory/odlums/ |
| Tirlán Oat Mill | — | Comida preparada | Prepared Foods; national-scale brand | — | Midlands directory https://www.midlandsireland.ie/producers_directory/tirlan-oat-mill/ |
| Martleys Sweetshop & Newsagents | — | Dulces y repostería | shop=confectionery | — | OSM node/7813507909 |
| McCormack's | Portlaoise | Otros | shop=deli | — | OSM node/7813507928 |
| Woods Bakery and Store | — | Pan y cereal | shop=bakery | — | OSM node/2342128789 |
| Ali's Fish Shop | — | Pescado | shop=seafood | — | OSM node/2777366171 |
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
| 12 Acres Brewing Company | Clonmore, Killeshin — flagged CLOSED | 12acresbrewing.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
