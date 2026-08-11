# Kilkenny — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/kilkenny.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/kilkenny>.
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

### Production signal — 48 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Breagagh Valley Artisan Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry; via Irish Meat Producers Directory | — | FarmFinder https://farmfinder.ie/producer/breagagh-valley-artisan-meats |
| Callan Bacon Company Ltd | Callan | Carne | Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/callan-bacon-co-ltd | — | DAFM meat 528 |
| Callan Premium Foods LTD | Callan | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2771 |
| Goatsbridge Trout Farm | — | Carne | Farm; NeighbourFood, Beef, Lamb, Pork; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/goatsbridge-trout-farm |
| Grogan & Brown Artisan Butchers | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/grogan-and-brown-artisan-butchers |
| John Murphy Family Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/john-murphy-family-butchers |
| Kiely Meats (Waterford) Ltd | Kilmacow | Carne | Meat Preparations, Meat Products RTE, Meat Products Non RTE | — | DAFM meat 559 |
| Lavistown Sausages | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/lavistown-sausages |
| Namo Production Kitchen | Castle BlundenStable BlockKilkenny R95 X | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4114 |
| O'Brien Butchers | Bonnettsrath | Carne | Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/o-brien-s-butchers-kilkenny; also OSM node/10095399797 | — | DAFM meat 2414 |
| TCF Foods Ltd | Ferrybank | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/lisduggan-farm-foods-registered-as-tcf-foods-ltd | — | DAFM meat 2843 |
| Tynan Meats Limited | Johnstown | Carne | Minced Meat | — | DAFM meat 2474 |
| Tynan's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/tynan-s-butchers |
| Costello's Brewing Co. | Kilkenny | Cerveza | listed; also OSM way/154998922 | www.costellosbrewco.ie · +353868102320 | FarmFinder https://farmfinder.ie/producer/costellos-brewing-co |
| Sullivan's Brewing Co. | Kilkenny | Cerveza | listed; also OSM node/9110591195 | www.sullivansbrewingcompany.com · +353 56 779 7980 · info@sullivansbrewingcompany.com | FarmFinder https://farmfinder.ie/producer/sullivans-brewing-co |
| Mooncoin Homegrown Beetroot | — | Fruta y verdura | Producer; Fruit, Vegetables, SuperValu Food Academy; also FarmFinder https://farmfinder.ie/producer/mooncoin-beetroot | — | FarmFinder https://farmfinder.ie/producer/mooncoin-homegrown-beetroot |
| Regan Organic Farm, Co. Wexford | — | Fruta y verdura | Farm; IOA Member, Organic, Fruit, Vegetables | — | FarmFinder https://farmfinder.ie/producer/regan-organic-farm-co-wexford |
| Gort Fia Honesty Shed | — | Huevos | listed; Eggs, Vegetables, Baked Goods, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/gort-fia-honesty-shed |
| Nore Valley Park | — | Huevos | Farm; Eggs, Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/nore-valley-park |
| Callan Co-Operative & Dairy Society | West St Callan Co | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1510 |
| Knockdrinna Farmhouse Cheese | — | Lácteos y quesos | Farm; Dairy, Eggs, Cheese, Farm Gate; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/knockdrinna-farmhouse-cheese |
| Knockdrinna Farmhouse Foods Ltd. | Main Street Stoneyford Co | Lácteos y quesos | Bovine, Caprine, Ovine, SMALL - MEDIUM | — | DAFM dairy IE1911 |
| Little Milk Company | — | Lácteos y quesos | Producer; Dairy, Eggs, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/little-milk-company |
| Robson's Cheese (registered as Raquel Alves) | Team Dynamics Kilkenny Ltd | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2129 |
| Aiden's Honey | — | Miel | listed | — | FarmFinder https://farmfinder.ie/producer/aiden-s-honey |
| Ballyhenebry Farms | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ballyhenebry-farms |
| Ballykeefe Distillery | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ballykeefe-distillery |
| Drumeen Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/drumeen-organic-farm |
| Eamonn's Organic Produce | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/eamonn-s-organic-produce |
| Farrell’s Focus on Plants | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/farrell-s-focus-on-plants |
| Iverk Produce ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/iverk-produce-ltd |
| Kyle Lodge Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kyle-lodge-farm |
| Living and Growing | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/living-and-growing |
| Mid Kilkenny Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mid-kilkenny-beekeepers-association |
| Mount Callan | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/mount-callan |
| Riversfield Organic Farm, Co. Kilkenny | — | Otros | Farm; IOA Member, Organic, Vegetables, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/riversfield-organic-farm-co-kilkenny |
| Ryeland House Cookery | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ryeland-house-cookery |
| South Kilkenny Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/south-kilkenny-association |
| Speltbaker | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/speltbaker |
| Store-All Logistics | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/store-all-logistics |
| Aran Bakery & Cafe | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/aran-bakery-and-cafe |
| Arán Deli Bakery | — | Pan y cereal | craft=bakery | — | OSM node/9911732332 |
| Blanco Nino | — | Pan y cereal | Producer; Bread & Bakery, Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/blanco-nino |
| Burdock & Bay | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/burdock-and-bay |
| Cakeface Lab | — | Pan y cereal | craft=bakery | — | OSM node/8346115546 |
| Lekker Food Co | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/lekker-food-co |
| The Cookie Co-op | Kilkenny | Pan y cereal | craft=bakery | www.thecookiecoop.ie · +353 86 887 2045 · info@thecookiecoop.ie | OSM node/11056743300 |
| Le Caveau Wine Merchants | — | Vino | listed | — | FarmFinder https://farmfinder.ie/producer/le-caveau-wine-merchants |

### Facility or shopfront only — 34 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Bradley Butchers | — | Carne | shop=butcher | — | OSM node/11243818573 |
| D. Murphy | — | Carne | shop=butcher | — | OSM node/11003036861 |
| Dick Dooley | — | Carne | shop=butcher | — | OSM node/11093569343 |
| Donavans Butchers | Rathcoole | Carne | shop=butcher | — | OSM way/595124069 |
| Hanlon's | — | Carne | shop=butcher | — | OSM node/14051982551 |
| John Joe Cullen | — | Carne | shop=butcher | +353 56 7764899 | OSM node/8279388549 |
| John Murphy family butcher | — | Carne | shop=butcher | — | OSM node/7813299366 |
| Kenna Butchers | Kilkenny | Carne | Slaughtering, Cutting only | — | DAFM meat 2475 |
| N. Tynan | — | Carne | shop=butcher | — | OSM way/318740889 |
| P. Kenna | — | Carne | shop=butcher | — | OSM node/2493601493 |
| Prendergast's Butchers | Thomastown | Carne | Slaughtering only | — | DAFM meat 2519 |
| Prime Cut Meats | — | Carne | shop=butcher | — | OSM node/11780213651 |
| Sheelin Meats | Kells | Carne | shop=butcher | — | OSM node/9072224282 |
| Suspects Q's Bakery | — | Carne | shop=butcher | — | OSM node/8098220622 |
| T.Cronin & Sons | Killarney | Carne | shop=butcher | — | OSM node/13171772382 |
| Thomas Doherty Family Butcher | Kells | Carne | shop=butcher | — | OSM node/9074503339 |
| Crave Corner | Kilkenny | Dulces y repostería | shop=confectionery | — | OSM node/6419196040 |
| Fusion | — | Dulces y repostería | shop=confectionery | www.fusiontreatskilkenny.com | OSM node/10242417321 |
| Gino's Gelato | Killarney | Dulces y repostería | shop=confectionery | ginosgelato.com/;https://ginosgelato.com · +353 64 668 6170 · info@ginosgelato.com | OSM node/13977358203 |
| Kitty's Cabin | Kilkenny | Dulces y repostería | shop=confectionery | +353 56 777 1809 · kittyscabin01@gmail.com | OSM node/2531862064 |
| Truffle Fairy | — | Dulces y repostería | shop=confectionery | — | OSM node/2319882129 |
| Glanbia Dairy Nutrition Limited | Leggettsrath Business Park Carlow | Lácteos y quesos | Bovine, TRADER; national-scale brand; also FarmFinder https://farmfinder.ie/producer/glanbia | — | DAFM dairy 1727 |
| Tirlán Limited | Ballyconra Ballyragget Co Kilkenny | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING); national-scale brand; also FarmFinder https://farmfinder.ie/producer/tirl-n; also OSM node/12623210510 | www.tirlanfarmlife.com/store/Kells · +353567728233 | DAFM dairy IE1515 |
| Callan Co-op | — | Otros | shop=farm | — | OSM node/7813299373 |
| Glasraí & Goodies | — | Otros | shop=deli | www.glasraiandgoodies.com | OSM node/4326566128 |
| La Bottega | Kilkenny | Otros | shop=deli | +353 87 428 5886 | OSM node/8384879404 |
| Margherita Deli | — | Otros | shop=deli | margheritabistro.ltd@gmail.com | OSM node/11080992266 |
| Pizza Max | Kilkenny | Otros | shop=deli | +353 56 771 2765 | OSM node/6684201386 |
| Skehana Hill Farm Shop | — | Otros | shop=farm | — | OSM node/13985340836 |
| The Gourmet Store | Kilkenny | Otros | shop=deli | — | OSM node/2157699665 |
| Bake and Roll | Kells | Pan y cereal | shop=bakery | — | OSM node/9074114535 |
| Keogh's Model Bakery | Callan | Pan y cereal | shop=bakery | — | OSM node/7813330400 |
| Mrs Smith's Bakery | Kells | Pan y cereal | shop=bakery | — | OSM node/9074410749 |
| The House of Pretzels | — | Pan y cereal | shop=bakery | — | OSM node/5920370325 |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated and were not swept: Guaranteed Irish
  (member area behind a login), the Irish Organic Association producer finder
  (returns no content without a browser) and the Bord Bia directory (403).
- County food networks exist for several counties (Tipperary, Mayo and others)
  and are not yet scoped; foodcultureireland.ie carries an all-island producer
  directory.
