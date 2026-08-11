# Longford — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/longford.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/longford>.
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
| Richmount Cordial Co. | — | Bebidas sin alcohol | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/richmount-cordial-co/ |
| Lanesbrew Coffee Shop | — | Café | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/lanesbrew-coffee-shop/ |
| Flanagan Farm Produce | — | Carne | Producer; NeighbourFood, Eggs, Poultry, Online | — | FarmFinder https://farmfinder.ie/producer/flanagan-farm-produce |
| Green Pasture Meat Processors Ltd. | Drumlish | Carne | Slaughtering, Cutting only; also FarmFinder https://farmfinder.ie/producer/green-pasture-meat-processors | — | DAFM meat 381 |
| Heaslip, Joseph | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/heaslip-joseph |
| Herterich Artisan Meats | — | Carne | Meats | — | Midlands directory https://www.midlandsireland.ie/producers_directory/herterich-artisan-meats/ |
| Jeanette Hugo of Uncle Boks LTD | Ballinalee | Carne | Meat Preparations, Meat Products RTE | — | DAFM meat 2796 |
| Joan Sullivan | Ballinalee | Carne | Meat Products Non RTE | — | DAFM meat 2783 |
| Louis Herterich | Longford | Carne | Meat Preparations, Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2524 |
| Mitchell Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/mitchell-meats |
| Monaghan's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/monaghan-s-butchers |
| Stewart Family Farm | — | Carne | Farm; Beef, Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/stewart-family-farm |
| Uncle Bok Biltong and Boerewors | — | Carne | Meats | — | Midlands directory https://www.midlandsireland.ie/producers_directory/uncle-bok-biltong-and-boerewors/ |
| St Mel's Brewery | — | Cerveza | Producer; Beer, Farm Gate, Online | — | FarmFinder https://farmfinder.ie/producer/st-mels-brewery |
| Wide Street Brewing | — | Cerveza | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/wide-street-brewing/ |
| Rehoboth Foods | — | Comida preparada | Prepared Foods | — | Midlands directory https://www.midlandsireland.ie/producers_directory/rehoboth-foods/ |
| Lough Ree Distillery | — | Destilados y licores | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/lough-ree-distillery/ |
| Torc Cafe & Foodhall | — | Dulces y repostería | Confectionery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/torc-cafe-foodhall/ |
| McCormack fruit | — | Fruta y verdura | listed; Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/mccormack-fruit |
| O’Halleran Family Farm Ltd | — | Fruta y verdura | Produce; also FarmFinder https://farmfinder.ie/producer/o-halleran-family-farm | — | Midlands directory https://www.midlandsireland.ie/producers_directory/ohalleran-family-farm-ltd/ |
| Clooneen | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/clooneen |
| Carrickfern Pure Irish Honey | — | Miel | listed, category not stated | — | Midlands directory https://www.midlandsireland.ie/producers_directory/carrickfern-pure-irish-honey/ |
| McCormack, Pat & Fiona | — | Miel | Producer; Honey | — | FarmFinder https://farmfinder.ie/producer/mccormack-pat-fiona |
| The Farmhouse Bees and Trees Ltd | — | Miel | Produce; also FarmFinder https://farmfinder.ie/producer/the-farmhouse | — | Midlands directory https://www.midlandsireland.ie/producers_directory/the-farmhouse-bees-and-trees-ltd/ |
| The Farm house | — | Otros | listed; Baked Goods, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/the-farm-house |
| Goodness Grains Gluten Free Bakery | — | Pan y cereal | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/goodness-grains-gluten-free-bakery/ |
| Jammy Rogers Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/jammy-rogers-bakery |
| Heartlands Orchard | — | Sidra | Prepared Foods, Preserves | — | Midlands directory https://www.midlandsireland.ie/producers_directory/heartlands-orchard/ |

### Facility or shopfront only — 9 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Birds Eye Ireland Limited | Longford | Carne | Meat Products Non RTE; national-scale brand | — | DAFM meat 789 |
| Dillons | — | Carne | shop=butcher | — | OSM way/905139317 |
| Kepak Longford | Ballymahon | Carne | Minced Meat, Meat Preparations; national-scale brand | — | DAFM meat 533 |
| Rawles Meat Market | — | Carne | shop=butcher | — | OSM way/286814139 |
| Ronald Rawle | Ballinalee | Carne | Slaughtering, Cutting only | — | DAFM meat 2541 |
| Treats | Ballymahon | Dulces y repostería | shop=confectionery | www.centerparcs.ie/discover-center-parcs/shops/treats.html | OSM node/9183727185 |
| Panelto Bakery | — | Pan y cereal | shop=bakery; national-scale brand | — | OSM node/7982431326 |
| Panelto Foods | — | Pan y cereal | Bakery; national-scale brand | — | Midlands directory https://www.midlandsireland.ie/producers_directory/panelto-foods-2/ |
| Pat the Baker | — | Pan y cereal | Bakery; national-scale brand | — | Midlands directory https://www.midlandsireland.ie/producers_directory/pat-the-baker-2/ |
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
| St. Mel's Brewing | — | stmelsbrewing.com |
| Wide Street Brewing Company | — | widestreetbrewing.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
