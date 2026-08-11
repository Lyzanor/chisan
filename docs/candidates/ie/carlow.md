# Carlow — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/carlow.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/carlow>.
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

### Production signal — 37 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Sunshine Juice Ltd | — | Bebidas sin alcohol | listed | — | FarmFinder https://farmfinder.ie/producer/sunshine-juice-ltd |
| Ballon Meats Ltd | Ballon | Carne | Meat Products Non RTE | — | DAFM meat 392 |
| Clonmore Meats | Killeshin | Carne | Minced Meat | — | DAFM meat 2499 |
| Coppenagh House Farm Shop | — | Carne | Farm; Beef, Pork, Fruit, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/coppenagh-house-farm-shop |
| Matthew Kearney & Sons LTD | Carlow | Carne | Meat Preparations | — | DAFM meat 2531 |
| McAssey Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/mcassey-butchers |
| Murphy's Butchers Tullow | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also FarmFinder https://farmfinder.ie/producer/murphy-butchers | — | FarmFinder https://farmfinder.ie/producer/murphy-s-butchers-tullow |
| Quarrymount Meats and Farm Ltd | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/quarrymount-meats-and-farm-ltd |
| Sheehan Meats | Bennekerry | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2530 |
| Carlow Brewing | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/carlow-brewing |
| Royal Oak Distillery Ltd | — | Cerveza | Producer; Origin Green Member, Beer, Cider, Spirits | — | FarmFinder https://farmfinder.ie/producer/royal-oak-distillery-ltd |
| Galway Chocolate House | — | Chocolate | listed | — | FarmFinder https://farmfinder.ie/producer/galway-chocolate-house |
| Royal Oak Stores | — | Destilados y licores | craft=distillery | — | OSM way/561537789 |
| Walsh Whiskey | — | Destilados y licores | listed | — | FarmFinder https://farmfinder.ie/producer/walsh-whiskey |
| Codd Mushrooms | — | Fruta y verdura | Producer; Fruit, Vegetables, Bord Bia Origin Green | — | FarmFinder https://farmfinder.ie/producer/codd-mushrooms |
| Lisnavagh Walled Garden Box | — | Fruta y verdura | listed; Vegetables, Fruit, Delivery, Online | — | FarmFinder https://farmfinder.ie/producer/lisnavagh-walled-garden-box |
| Malone Fruit Farm | — | Fruta y verdura | Farm; Fruit, Vegetables, Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/malone-fruit-farm |
| Tipperary Organic Ice Cream | c/o Healy Fine Foods | Helados | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1010 |
| Carlow Cheese (registered as Elizabeth Bradley) | Ballybrommell Fenagh Co Carlow | Lácteos y quesos | Bovine, Ovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/carlow-farmhouse-cheese | — | DAFM dairy IE1917 |
| Coolattin Cheddar Ltd | Knockeen Tullow Co Carlow | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1925 |
| The Village Dairy | Clonmore Killeshin Carlow | Lácteos y quesos | Bovine, DRINKING MILK PLANT | — | DAFM dairy IE2007 |
| County Carlow Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/county-carlow-beekeepers-association |
| Émile Pâtissier Ltd | — | Otros | Producer; Origin Green Member, Preserves, Bord Bia Origin Green | — | FarmFinder https://farmfinder.ie/producer/mile-p-tissier-ltd |
| Flying Tumbler | — | Otros | Producer; Origin Green Member, Bord Bia Origin Green | — | FarmFinder https://farmfinder.ie/producer/flying-tumbler |
| Helens Home Bakes | — | Otros | listed; Preserves, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/helens-home-bakes |
| Johnstown Honesty hut | — | Otros | listed; Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/johnstown-honesty-hut |
| Moyleabbey Organic, Co. Kildare | — | Otros | Producer; IOA Member, Organic, Irish Organic Association | — | FarmFinder https://farmfinder.ie/producer/moyleabbey-organic-co-kildare |
| Rings Farm | — | Otros | Farm; IOA Member, Organic, Vegetables, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/rings-farm |
| The Haggart Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-haggart-farm |
| Tuismitheoirí na Gaeltachta | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/tuismitheoir-na-gaeltachta |
| Builín Úr | — | Pan y cereal | Producer; Organic, Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/buil-n-r |
| O Hanlons organic farm | — | Pan y cereal | listed; Eggs, Vegetables, Bread & Bakery, more | — | FarmFinder https://farmfinder.ie/producer/o-hanlons-organic-farm |
| Plur Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/plur-bakery |
| Sweet Baking Mama | — | Pan y cereal | craft=bakery | +353 85 873 0700 | OSM node/12876907403 |
| Mary's Fish Galway | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/mary-s-fish-galway |
| Craigies Cider | — | Sidra | Producer; Cider, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/craigies-cider |
| Falling Apple Cider | — | Sidra | Producer; Cider, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/falling-apple-cider |

### Facility or shopfront only — 10 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Butcher's Best Abattoir Ltd | Bunclody | Carne | Slaughtering, Cutting only | — | DAFM meat 3000 |
| C. Nolan | — | Carne | shop=butcher | — | OSM node/9260676686 |
| Carlow Foods LTD | Fenagh | Carne | Slaughtering, Cutting only | — | DAFM meat 2768 |
| Laurence & James Murphy | Tullow | Carne | Slaughtering, Cutting only | — | DAFM meat 2529 |
| Liffey Meats Ltd | Hacketstown | Carne | Slaughtering only; national-scale brand | — | DAFM meat 2003 |
| Macassy | — | Carne | shop=butcher | — | OSM node/1686388539 |
| Michael Kealy Butchers | — | Carne | shop=butcher | — | OSM node/5140303844 |
| Murphy's Buthers | — | Carne | shop=butcher | — | OSM node/11065435597 |
| O'Dúinne | — | Carne | shop=butcher | — | OSM node/7154556899 |
| Crotty's Bakery | — | Pan y cereal | shop=bakery | — | OSM node/4143595645 |
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
| Carlow Brewing Co | — | carlowbrewing.com |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
