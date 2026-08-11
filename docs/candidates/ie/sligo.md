# Sligo — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/sligo.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/sligo>.
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

### Production signal — 18 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Carrow Coffee Roasters | — | Café | Producer; Organic, Organic Trust Licensee, Farm Gate, Organic Trust | — | FarmFinder https://farmfinder.ie/producer/carrow-coffee-roasters |
| B Bowes Ltd | Sligo | Carne | Meat Preparations, Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2802 |
| Burns Farm Meats LTD | Grange | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/burns-farm-meats | — | DAFM meat 2516 |
| Farmreared.com | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/farmreared-com |
| Knocknarea Farm Shop | — | Carne | Farm; Vegetables, Fruit, Beef, Lamb | — | FarmFinder https://farmfinder.ie/producer/knocknarea-farm-shop |
| Lough Bralee Organic Farm | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/lough-bralee-organic-farm |
| Rare Ruminare - Clive Bright | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/rare-ruminare-clive-bright |
| Sherlock Meats Ballisodare | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/sherlock-meats-ballisodare |
| Tubbertelly Farm - Dexter Beef Direct | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/tubbertelly-farm-dexter-beef-direct |
| Wynne Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/wynne-meats |
| Lough Gill Brewing Co. | — | Cerveza | Producer; Beer, Farm Gate, Online | — | FarmFinder https://farmfinder.ie/producer/lough-gill-brewing-co |
| Common Shore | — | Lácteos y quesos | Farm; Vegetables, Fruit, Dairy, Eggs | — | FarmFinder https://farmfinder.ie/producer/common-shore |
| Good4u | — | Otros | Producer; SuperValu Food Academy, Honesty Box; also FarmFinder https://farmfinder.ie/producer/good4u-food-nutrition-and-innovations-ltd | — | FarmFinder https://farmfinder.ie/producer/good4u |
| Sweet Beat Sligo | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/sweet-beat-sligo |
| Crean Cottage Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/crean-cottage-bakery |
| The Hungry Moose | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/the-hungry-moose |
| Sligo Oysters | — | Pescado | Producer; Seafood, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/sligo-oysters |
| Wild Atlantic Shellfish Limited | — | Pescado | Producer; Origin Green Member, Seafood, Bord Bia Origin Green | — | FarmFinder https://farmfinder.ie/producer/wild-atlantic-shellfish-limited |

### Facility or shopfront only — 21 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Cavanagh Meats | — | Carne | shop=butcher | — | OSM node/12242140783 |
| Clarkes | — | Carne | shop=butcher | — | OSM node/2611464691 |
| Eamons Meats | — | Carne | shop=butcher | — | OSM node/1083326255 |
| Igoe's | — | Carne | shop=butcher | — | OSM way/165023220 |
| Monaghans | Sligo | Carne | shop=butcher | — | OSM node/2293593219 |
| O' Sullivans | Ballymote | Carne | shop=butcher | — | OSM way/775641817 |
| Sherlocks | — | Carne | shop=butcher | — | OSM node/7182082490 |
| The Meetin' Place | — | Carne | shop=butcher | — | OSM way/775639721 |
| Wynnes Meats | Drumfin | Carne | Slaughtering only | — | DAFM meat 2616 |
| Kennedys | — | Dulces y repostería | shop=confectionery | — | OSM way/764644021 |
| Sligo Wellness Centre | — | Dulces y repostería | shop=confectionery | — | OSM way/868739760 |
| Aurivo Co-operative Society Ltd | Aurivo House Finisklin Business | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING); national-scale brand | — | DAFM dairy IE1524 |
| Aurivo Consumer Foods Ltd | Achonry Ballymote Co Sligo | Lácteos y quesos | milk, COLD STORE; national-scale brand | — | DAFM dairy IE2227 |
| Homeland Plus | Sligo | Otros | shop=farm | +353 71 916 1879 | OSM way/252286409 |
| Kate's Kitchen | Sligo | Otros | shop=deli | kateskitchen.ie | OSM node/2468205731 |
| Tír na nÓg | — | Otros | shop=deli | — | OSM node/2611464705 |
| Bake Shop | — | Pan y cereal | shop=bakery | — | OSM node/3355096801 |
| Gourmet Parlour | Sligo | Pan y cereal | shop=bakery | — | OSM node/2104779018 |
| Le Fournil | — | Pan y cereal | shop=bakery | — | OSM node/1112822307 |
| O' Hehirs | — | Pan y cereal | shop=bakery | — | OSM node/1012183648 |
| John the Fish | — | Pescado | shop=seafood | — | OSM node/1012183644 |
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
| Lough Gill Brewery | — | loughgillbrewery.com |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
