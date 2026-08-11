# Leitrim — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/leitrim.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/leitrim>.
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

### Production signal — 28 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Bennett's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/bennett-s-butchers |
| Campbell Meats | Drumshanbo | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2939 |
| Chef In A Box LTD | Drumshanbo | Carne | Meat Products Non RTE | — | DAFM meat 3054 |
| Declan McCarthy Meats | Ballinamore | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2820 |
| Gunning, Tadhg and Sean | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/gunning-tadhg-and-sean |
| McNally, Mario and Maureen Kelleher-McNally | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/mcnally-mario-and-maureen-kelleher-mcnally |
| Micheal Scollan Meats | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/micheal-scollan-meats |
| Reynolds Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM way/251217877 | — | FarmFinder https://farmfinder.ie/producer/reynolds-butchers |
| PJ Rigney Distillery | — | Cerveza | Producer; Origin Green Member, Beer, Cider, Spirits | — | FarmFinder https://farmfinder.ie/producer/pj-rigney-distillery |
| Morans Mega Jam Ltd | — | Conservas | Producer; Preserves, Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/morans-mega-jam-ltd |
| Scotts Irish Whisky | — | Destilados y licores | craft=distillery | scottsirish.com · +44 28 6865 8568 · it@scottsirish.com | OSM way/995887984 |
| The Organic Centre | — | Fruta y verdura | Farm; Organic, Fruit, Vegetables; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/the-organic-centre |
| Arroo Honesty | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/arroo-honesty |
| Shannon Box | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/shannon-box |
| Blake’s Always Organic (registered as John Brennan & Seán McGloin) | The Enterprise Centre Hill | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2229 |
| Leitrim Hill Creamery | Drumcong, Carrick-on-Shannon, Co. Leitrim, | Lácteos y quesos | Bovine, Caprine, SMALL | — | DAFM dairy IE2183 |
| The Little Roadside Hub | — | Lácteos y quesos | listed; Eggs, Dairy, Farm Gate, yourhonestybox.com | — | FarmFinder https://farmfinder.ie/producer/the-little-roadside-hub |
| Artessa | — | Otros | Producer; Organic, Organic Trust Licensee, Farm Gate, Organic Trust | — | FarmFinder https://farmfinder.ie/producer/artessa |
| Bluebell Organic Farm | — | Otros | Farm; IOA Member, Organic, Vegetables, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/bluebell-organic-farm |
| Dugdales | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dugdales |
| Honestly Farm Kitchen Carrick on Shannon | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/honestly-farm-kitchen-carrick-on-shannon |
| National Organic Training Skillnet | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/national-organic-training-skillnet |
| Sligo/Leitrim Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sligo-leitrim-association |
| The French Market Ltd. | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-french-market-ltd |
| Bits & Bytes Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/bits-and-bytes-bakery |
| Carrig Rua Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/carrig-rua-bakery |
| Dromod Boxty | — | Pan y cereal | Producer; Bread & Bakery, Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/dromod-boxty |
| Redbank Seafood | — | Pescado | Producer; Seafood, SuperValu Food Academy, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/redbank-seafood |

### Facility or shopfront only — 14 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Aidan Wrynne Meats | Mohill | Carne | Cutting only | — | DAFM meat 3032 |
| Clarkes Butchers | Drumkeeran | Carne | shop=butcher | +353 71 964 8010 | OSM way/1068067690 |
| D Boyd | — | Carne | shop=butcher | — | OSM node/1445781342 |
| Damien Thornton | Manorhamilton | Carne | Slaughtering only | — | DAFM meat 2393 |
| Logan | — | Carne | shop=butcher | — | OSM way/247023300 |
| Logans | — | Carne | shop=butcher | — | OSM way/248329118 |
| McBrien Cannoboe Market | — | Carne | shop=butcher | +353 71 964 4692 | OSM node/5084742133 |
| McHughes Butcher | — | Carne | shop=butcher | +353 71 964 5172 | OSM node/5083609971 |
| Michael Scollan Butcher | — | Carne | shop=butcher | +353 71 964 5948 | OSM node/5084750024 |
| Sean Rooney | Kinlough | Carne | Slaughtering only | — | DAFM meat 2404 |
| Thornton Victualler's | — | Carne | shop=butcher | — | OSM node/13965800801 |
| Cumiskey's Siopa Milsean | — | Dulces y repostería | shop=confectionery | — | OSM node/2073940583 |
| The Hidden Corner | — | Lácteos y quesos | shop=cheese | — | OSM node/6407466098 |
| Country Market | — | Otros | shop=farm | — | OSM way/248347053 |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated and were not swept: Guaranteed Irish
  (member area behind a login), the Irish Organic Association producer finder
  (returns no content without a browser) and the Bord Bia directory (403).
- County food networks exist for several counties (Tipperary, Mayo and others)
  and are not yet scoped; foodcultureireland.ie carries an all-island producer
  directory.
