# Limerick — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/limerick.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/limerick>.
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

### Production signal — 65 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Bailey Foods | William St | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2781 |
| Bio Science Nutrition Ireland | Skule HillFedamore | Carne | Food Packer; Highly refined products | — | FSAI HSE 4117 |
| Cappercullen Foods Ltd | Unit 1 Limerick Food CentrePearse RoadRa | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4099 |
| Cotter Organic Lamb T/A | — | Carne | listed | — | FarmFinder https://farmfinder.ie/producer/cotter-organic-lamb-t-a |
| Enda Aherne | Limerick | Carne | Minced Meat, Meat Products Non RTE | — | DAFM meat 2900 |
| Glen Aine Foods Ltd | Knocklong | Carne | Meat Products RTE | — | DAFM meat 564 |
| Hook and Ladder | Unit One | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4077 |
| Jack Spratt Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM way/283766359 | — | FarmFinder https://farmfinder.ie/producer/jack-spratt-butchers |
| James Shanahan Ltd | Pallaskenry | Carne | Meat Products Non RTE | — | DAFM meat 2695 |
| Jim Flavin | Annacottty | Carne | Cutting only; also FarmFinder https://farmfinder.ie/producer/jim-flavin-craft-butcher | — | DAFM meat 2782 |
| McDermott Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/3935996823 | — | FarmFinder https://farmfinder.ie/producer/mcdermott-butchers |
| McMahon Quality Meats | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/mcmahon-quality-meats |
| McMahon's Biltong (registered as Ivor McMahon's T/A McMahon's Biltong) | Ballysimon | Carne | Meat Products RTE | — | DAFM meat 3020 |
| O'Connell Beef | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/o-connell-beef |
| O'Connell's Butchers Limerick | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/3658416408 | — | FarmFinder https://farmfinder.ie/producer/o-connell-s-butchers-limerick |
| O'Connor Butchers | Kilmallock | Carne | Slaughtering only; also FarmFinder https://farmfinder.ie/producer/o-connor-butchers-dromcollogher; also OSM node/13970815361 | — | DAFM meat 2485 |
| O'Sullivan Butchers Kilmallock | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/13092334087 | — | FarmFinder https://farmfinder.ie/producer/o-sullivan-butchers-kilmallock |
| Old World Master Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/old-world-master-butchers |
| Paddy McMahon Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/6708173536 | — | FarmFinder https://farmfinder.ie/producer/paddy-mcmahon-butchers |
| Pat O'Connor Meat | Raheen | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2745 |
| Rigneys Farm Curraghchase Freerange Pork (registered as Caroline Rigney T/A Rigneys Farm Curraghchase Freerange Pork) | Kilcornan | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2991 |
| Seamus Butler Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/seamus-butler-meats |
| Shuttington Holdings Unlimited Company | Bruree Food Centre40 Acres | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4120 |
| Tim's Table | The Kitchen HubUNIT 3A Crossagalla indus | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4119 |
| Tom Brouder Athea Homemade Puddings | Loughill | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2625 |
| JJ's Craft Brewing | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/jjs-craft-brewing |
| Treaty City Brewery | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/treaty-city-brewery |
| Limerick Spirits Company Limited | — | Destilados y licores | listed | — | FarmFinder https://farmfinder.ie/producer/limerick-spirits-company-limited |
| Noinin Organic Herb & Vegetable Farm | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/noinin-organic-herb-vegetable-farm |
| Abington Foods (registered as Glenstal Foods Ltd) | Abington Rectory Murroe Co | Lácteos y quesos | N/A, TRADER | — | DAFM dairy 1705 |
| Cahill Cheese | — | Lácteos y quesos | Producer; Dairy, Eggs, Cheese, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/cahill-cheese |
| Cuan Mhuire CLG | Cuan Mhuire Bruree Co | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2199 |
| Dansko Foods Partnership | Unit 6, Kilmallock Ind | Lácteos y quesos | milk, COLD STORE; also FarmFinder https://farmfinder.ie/producer/dansko-foods-ltd | — | DAFM dairy IE2215 |
| GoBia Ltd CP Ingredients Ltd Real Ingredients Ltd (registered as GoBia Ltd) | Unit 7 Limerick Food | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1985 |
| Hannah Quinn Mulligan | Tory Hill House Kilmallock | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2201 |
| HL Commodity Foods (MFG) Ltd | Emly Rd Hospital Limerick | Lácteos y quesos | n/a, SMALL - MEDIUM | — | DAFM dairy IE1116 |
| JOD Food Products Ltd | JOD Food Products, Effin | Lácteos y quesos | n/a, SMALL - MEDIUM | — | DAFM dairy IE1059 |
| Limerick Liquid Milk Producers Co Op Society Ltd | Ballycannon, Croagh, Rathkeale, Co. | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1502 |
| SJ Cheese Limited | The Hill Ballyhahill Co | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2185 |
| Wyeth Nutritionals Ireland Ltd | Askeaton Co Limerick V94 | Lácteos y quesos | Bovine, INFANT FORMULA | — | DAFM dairy 1703 |
| Old Cottage Honey | — | Miel | listed | — | FarmFinder https://farmfinder.ie/producer/old-cotage-honey |
| Bramble Cottage Produce | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bramble-cottage-produce |
| Canteen | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/canteen |
| Corick farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/corick-farm |
| County Limerick Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/county-limerick-beekeepers-association |
| Donegan, John | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/donegan-john |
| Glenstal Foods Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/glenstal-foods-ltd |
| Happy Food at Home | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/happy-food-at-home |
| Harpers Coffeehouse | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/harpers-coffeehouse |
| HL Commodity Foods Manufacturing LTD | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/hl-commodity-foods-manufacturing-ltd |
| Juspy | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/juspy |
| Kerry Farm Shop | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kerry-farm-shop |
| Key Ingredients Europe Limited | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/key-ingredients-europe-limited |
| Premier Molasses Co Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/premier-molasses-co-ltd |
| Sadlier's | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sadliers-limerick |
| Seeds Ireland | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/seeds-ireland |
| Tory Hill House | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/tory-hill-house |
| VARDEBI | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/vardebi |
| Baking 4U | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/baking-4u |
| Bread Shop Limerick | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/bread-shop-limerick |
| Murphys Home Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/murphys-home-bakery |
| Sunflower Bakery | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/sunflower-bakery |
| Rene Cusack Fish | — | Pescado | Producer; Seafood; also OSM node/5015273763; also OSM node/7914412837 | — | FarmFinder https://farmfinder.ie/producer/rene-cusack-fish |
| Saddlers | — | Pescado | Producer; Seafood | — | FarmFinder https://farmfinder.ie/producer/saddlers-limerick |
| SeaBreeze | — | Pescado | Producer; Seafood, remaining), About, About FarmFinder | — | FarmFinder https://farmfinder.ie/producer/seabreeze-limerick |

### Facility or shopfront only — 37 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| A O Conláin | — | Carne | shop=butcher | — | OSM node/4483872858 |
| ABP Rathkeale (registered as Anglo Beef Processors Ireland UC T/A ABP Rathkeale) | Rathkeale | Carne | Slaughtering, Cutting only; national-scale brand | — | DAFM meat 354 |
| Ahearne Victuallers | Limerick | Carne | shop=butcher | — | OSM node/5003867385 |
| Ashgrove Wholesale Ltd (registered as Comida Exports Limited T/A Ashgrove Wholesale Ltd) | Dually | Carne | Slaughtering, Cutting only | — | DAFM meat 609 |
| Barry's | — | Carne | shop=butcher | — | OSM node/13093188070 |
| Denis Greaney & Sons | — | Carne | shop=butcher | — | OSM node/13912115955 |
| E. Morrissey | — | Carne | shop=butcher | — | OSM node/4524493652 |
| Flavins Butchers | — | Carne | shop=butcher | — | OSM node/1334703458 |
| Frank Frawley's | Limerick | Carne | shop=butcher | — | OSM node/5964252996 |
| Garrett's | — | Carne | shop=butcher | — | OSM node/6486669396 |
| Ger Craughan | — | Carne | shop=butcher | — | OSM node/1166686373 |
| J Cooney | — | Carne | shop=butcher | — | OSM node/6708173538 |
| MCs Family Butcher | — | Carne | shop=butcher; also OSM node/13092558506 | — | OSM node/5851875634 |
| Michael O' Loughlin | — | Carne | shop=butcher | +353 61 414 102 | OSM node/5005535559 |
| Nolans of Corbally | — | Carne | shop=butcher | — | OSM node/6783719501 |
| O'Byrne's Butchers | — | Carne | shop=butcher | — | OSM node/6468106184 |
| O'Connor Victualler | — | Carne | shop=butcher | — | OSM node/13979115523 |
| Pat O Connor & Son | — | Carne | shop=butcher | — | OSM node/11559833982 |
| Rory O'Sullivan | Kilmallock | Carne | Slaughtering only | — | DAFM meat 2486 |
| Sean Fitzgerald | Ballylanders | Carne | Slaughtering only; also OSM node/6184439435 | — | DAFM meat 2465 |
| Strand Foods Ltd | Ballaugh | Carne | Cutting only | — | DAFM meat 2880 |
| Sysco Foods Ireland Unlimited Company | Newcastlewest | Carne | Slaughtering, Cutting only | — | DAFM meat 2671 |
| The Market Butcher | — | Carne | shop=butcher | +353 69 61398 | OSM node/10821584792 |
| The Limerick Chocolate Shop | — | Chocolate | shop=chocolate | — | OSM node/5728749717 |
| Candy Castle | — | Dulces y repostería | shop=confectionery | — | OSM node/11559833987 |
| Nom! Treats | — | Dulces y repostería | shop=confectionery | — | OSM node/4524493653 |
| C. O' Neil | — | Otros | shop=farm | — | OSM node/11576189510 |
| Chopped | — | Otros | shop=deli | — | OSM node/5715931470 |
| The Kitchen at Casey's | — | Otros | shop=deli | — | OSM node/5715931469 |
| The River Deli | — | Otros | shop=deli | — | OSM node/4022829961 |
| Bean a Tí | — | Pan y cereal | shop=bakery | — | OSM way/400679506 |
| Freshii | Limerick | Pan y cereal | shop=bakery | — | OSM node/5003987723 |
| Le Petits Plaisirs | — | Pan y cereal | shop=bakery | — | OSM node/2082798235 |
| Marguerites | — | Pan y cereal | shop=bakery | — | OSM node/4001270005 |
| Quigley's | — | Pan y cereal | shop=bakery | — | OSM node/1538737058 |
| Soda Cakes Coffee House | — | Pan y cereal | shop=bakery | — | OSM node/6708141383 |
| The Danes Bakery and Wedding Gallery | — | Pan y cereal | shop=bakery | — | OSM node/5016863960 |
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
| Crew Brewing Co. | — | crewbrewing.ie |
| JJ's Craft Brewing Company | — | jjscraftbrewing.ie |
| Treaty City Brewing | — | treatycitybrewery.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
