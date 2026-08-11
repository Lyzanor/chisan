# Roscommon — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/roscommon.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/roscommon>.
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

### Production signal — 25 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Ballaghadereen Bacon Factory Ltd | Ballaghdereen | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 395 |
| Ballymore Organic Farm | — | Carne | Farm; Organic, Organic Trust Licensee, IOA Member, Beef | — | FarmFinder https://farmfinder.ie/producer/ballymore-organic-farm |
| Castlemine Farm LTD | Roscommon | Carne | Minced Meat, Meat Preparations; also FarmFinder https://farmfinder.ie/producer/castlemine-farm | — | DAFM meat 2941 |
| Cunniffe's Bacon Factory | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/cunniffe-s-bacon-factory |
| Curley, Seamus & Elsie | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/curley-seamus-and-elsie |
| Do Me A Flavour (registered as VOA Foods UC T/A Do Me A Flavour) | Athlone | Carne | Meat Preparations; also FarmFinder https://farmfinder.ie/producer/voa-foods-t-a-do-me-a-flavour | — | DAFM meat 2178 |
| Drumanilra Organic Farm | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/drumanilra-organic-farm |
| Gannon, James and Mary Scally | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/gannon-james-and-mary-scally |
| Gilligan Farm Fresh Meats | Fourmilehouse | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/gilligan-s-farm | — | DAFM meat 2383 |
| Hillside Organic & Holistic Farm | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/hillside-organic-and-holistic-farm |
| Michael Waldron Meats LTD | Athlone | Carne | Minced Meat, Meat Preparations, Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2412 |
| Mr John Webb | Castlerea | Carne | Meat Products Non RTE | — | DAFM meat 2621 |
| Oliver Carty UC | Athlone | Carne | Meat Preparations, Meat Products RTE, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/oliver-carty-and-family | — | DAFM meat 784 |
| Tynan, Martin | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/tynan-martin |
| Black Donkey Brewing Co. | — | Cerveza | Producer; Beer, Farm Gate, Online | — | FarmFinder https://farmfinder.ie/producer/black-donkey-brewing-co |
| Diffleys Family Farm | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/diffleys-family-farm |
| Mine Farm | — | Otros | Farm; SuperValu Food Academy, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/mine-farm |
| Noble | — | Otros | Producer; Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/noble |
| Sean Butler | — | Otros | Producer; Organic, Organic Trust Licensee, Farm Gate, Organic Trust | — | FarmFinder https://farmfinder.ie/producer/sean-butler |
| Suck Valley Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/suck-valley-association |
| Waldron Family Meats | — | Otros | Producer; Origin Green Member, Bord Bia Origin Green | — | FarmFinder https://farmfinder.ie/producer/waldron-family-meats |
| Almond Artisan Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/almond-artisan-bakery |
| Pastry Attack! | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/pastry-attack |
| Píosa Cake | — | Pan y cereal | listed; Preserves, Farm Gate, yourhonestybox.com | — | FarmFinder https://farmfinder.ie/producer/p-osa-cake |
| The Best Free From | — | Pan y cereal | Producer; Bread & Bakery, Delivery, Online, Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/the-best-free-from |

### Facility or shopfront only — 13 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Benedict Morris Slaughterhouse | Elphin | Carne | Slaughtering only | — | DAFM meat 2411 |
| Boyle Country Meats | Boyle | Carne | Slaughtering, Cutting only | — | DAFM meat 2697 |
| Connelly's Butchers | Creagh | Carne | shop=butcher | — | OSM node/3779499140 |
| Cunniffes Butchers | Ballaghaderreen | Carne | shop=butcher | — | OSM node/1554850311 |
| Eamon Coogan | Boyle | Carne | shop=butcher | — | OSM node/2471541169 |
| Kepak Athleague | Athleague | Carne | Meat Preparations; national-scale brand | — | DAFM meat 313 |
| Michael Cull Meats | Elphin | Carne | Cutting only | — | DAFM meat 2735 |
| Oliver Harte | Athleague | Carne | Slaughtering only | — | DAFM meat 2727 |
| Oliver McDermott | Frenchpark | Carne | shop=butcher | +353 94 987 0031 | OSM node/6899140424 |
| P. McGrath | Boyle | Carne | shop=butcher | — | OSM node/2471644908 |
| Regan's Butchers | Ballaghaderreen | Carne | shop=butcher | — | OSM node/1554850292 |
| Aurivo | — | Lácteos y quesos | Producer; Origin Green Member, Dairy, Bord Bia Origin Green; national-scale brand | — | FarmFinder https://farmfinder.ie/producer/aurivo |
| Benny's Deli & Bakery | Castlerea | Pan y cereal | shop=bakery | www.bennysdeli.com | OSM way/843036059 |
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
| Black Donkey Brewing | Srah, Ballinlough | blackdonkeybeer.com |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
