# Meath — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/meath.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/meath>.
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

### Production signal — 91 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| The Studio Coffee | — | Café | listed | — | FarmFinder https://farmfinder.ie/producer/the-studio-coffee |
| Alright Pumpkin | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/alright-pumpkin |
| Andrew Mahon | Drumree | Carne | Meat Preparations | — | DAFM meat 2780 |
| Ashbourne Meat Processors | — | Carne | Producer; Beef, Lamb, Pork, Poultry; via Irish Meat Producers Directory | — | FarmFinder https://farmfinder.ie/producer/ashbourne-meat-processors |
| Ballymad Farm | — | Carne | Farm; NeighbourFood, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/ballymad-farm |
| Brogan's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/brogan-s-butchers |
| Callaghan Butchers Bettystown | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/callaghan-butchers-bettystown |
| Cullentra Farm Shop & Open Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/cullentra-farm-shop-and-open-farm |
| Elmgrove Irish Flower Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/elmgrove-irish-flower-farm |
| Euro Farm Foods (registered as Cooksgrove Ltd. T/A Euro Farm Foods) | Duleek | Carne | Slaughtering, Cutting only; also FarmFinder https://farmfinder.ie/producer/cooksgrove-ltd-t-a-euro-farm-foods | — | DAFM meat 297 |
| Farm House Foods (registered as DC Meats LTD T/A Farm House Foods) | Dunshaughlin | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 3039 |
| Gleeson Meats Navan | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/gleeson-meats-navan |
| Hogan's Turkeys Limited | Kells | Carne | Minced Meat, Meat Preparations | — | DAFM meat 827 |
| Hogans Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/hogans-farm |
| Hugh Maguire Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; via Irish Meat Producers Directory | — | FarmFinder https://farmfinder.ie/producer/hugh-maguire-butchers |
| Killua Castle (registered as Luna Ventures Limited T/A Killua Castle) | Kells | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 3016 |
| Lorenzen's LTD (registered as Charlie Walshe T/A Lorenzen's LTD) | Kilmessan | Carne | Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/lorenzen-s-butchers | — | DAFM meat 2959 |
| Meath Sunflower Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/meath-sunflower-farm |
| Murtagh Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/murtagh-meats |
| Newbarn Farm Shop | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/newbarn-farm-shop |
| PC Meats | Enfield | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2961 |
| Robert's Butchery & Smokehouse LTD | Navan | Carne | Minced Meat, Meat Products RTE | — | DAFM meat 3035 |
| Rustic Kitchen (registered as Nugent Foods LTD T/A Rustic Kitchen) | Ashbourne | Carne | Meat Products Non RTE | — | DAFM meat 2884 |
| Ryan's Farm (registered as Iaroo LTD T/A Ryan's Farm) | Kells | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2769 |
| The Smokin'Butcher LTD | Navan | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/the-smokin-butcher | — | DAFM meat 3036 |
| The Whole Hoggs (registered as Peter Whelan T/A The Whole Hoggs) | Slane | Carne | Meat Preparations | — | DAFM meat 2972 |
| The Wooded Pig (registered as Bird Farm Ltd T/A The Wooded Pig) | Tara | Carne | Meat Products RTE | — | DAFM meat 2916 |
| Thomas Doherty (registered as Thomas Doherty Meats (Kells) LTD T/A Thomas Doherty) | Kells | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2966 |
| Boann Distillery | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/boann-distillery |
| Bulmers Ireland | — | Cerveza | craft=brewery; product=beer | — | OSM node/11983111404 |
| Slane Distillery | — | Destilados y licores | craft=distillery; product=whiskey | www.slaneirishwhiskey.com | OSM relation/9278985 |
| Clarkes Fresh Fruit | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/clarkes-fresh-fruit |
| Egg & Vegetable Vending Machine (Dunshaughlin) | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/egg-and-vegetable-vending-machine-dunshaughlin |
| Egg Vending Machine (Gardenrath Road Upper, Meath) | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/egg-vending-machine-gardenrath-road-upper-meath |
| Egg Vending Machine (Main Street, Meath) | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/egg-vending-machine-main-street-meath |
| Egg Vending Machine (Oldcastle Road, Meath) | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/egg-vending-machine-oldcastle-road-meath |
| Fresh Eggs and Potatoes | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/fresh-eggs-and-potatoes |
| Rathcore Eggs | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/rathcore-eggs |
| Bonnybo milk | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/bonnybo-milk |
| Boyne Valley Cheese (registered as Michael Finegan) | Mullagha Farm Slane Co. | Lácteos y quesos | Caprine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/boyne-valley-farmhouse-cheese | — | DAFM dairy IE2121 |
| Complex Nutrition Ltd | Unit 36 Navan Enterprise | Lácteos y quesos | N/A, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/complex-nutrition-limited | — | DAFM dairy IE1988 |
| Emeri Nutrition Co. Limited | IDA Business Park Johnstown, | Lácteos y quesos | N/A, size not stated | — | DAFM dairy 1712 |
| Four Acre Foods (registered as Four Acre Family Farm Foods Ltd) | Unit 1, Oaktree Business | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2190 |
| Gleann Gabhra | — | Lácteos y quesos | Producer; Dairy, Eggs, Cheese, Farm Gate; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/gleann-gabhra |
| McGrane's Milk Barn (registered as Conor & Mark McGrane) | Walterstown, Garlow Cross, Navan, | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2163 |
| McGranes Milk Barn | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/mcgranes-milk-barn |
| Shamsini Dairy (registered as Bashar Alawad) | Stackallen Slane Co. Meath | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2230 |
| Sheridan's Cheesemongers Ltd | Virginia Rd Station Virginia | Lácteos y quesos | N/A, SMALL - MEDIUM; also OSM node/8007216614 | sheridanscheesemongers.com · +353 46 9245110 · warehouse@sheridanscheesemongers.com | DAFM dairy IE1949 |
| The Milk Well Ltd | The Milk Well Ltd. | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2205 |
| Riverpark Honey | — | Miel | listed | — | FarmFinder https://farmfinder.ie/producer/riverpark-honey |
| A Bit on the Side | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/a-bit-on-the-side |
| AP Fine Foods Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ap-fine-foods-ltd |
| Battle of The Butters | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/battle-of-the-butters |
| BR Marketing Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/br-marketing-ltd |
| Celtic Chocolates | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/celtic-chocolates |
| Conynghams | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/conynghams |
| Coole Swan | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/coole-swan |
| Dominic Gryson | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dominic-gryson |
| Filligans | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/filligans |
| Finnegan's Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/finnegans-farm |
| Flowers by Izzy | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/flowers-by-izzy |
| Gorse Foods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gorse-foods |
| Highdell Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/highdell-organic-farm |
| Katelyns Konfections | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/katelyns-konfections |
| Kerrigan's Mushrooms | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kerrigans-mushrooms |
| Lir Chocolates | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lir-chocolates |
| Maperath Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/maperath-farm |
| McCormack Family Farms | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mccormack-family-farms |
| Meade Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/meade-farm |
| Meadowsweet Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/meadowsweet-organic-farm |
| Megs Desserts | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/megs-desserts |
| Michael McDermott | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/michael-mcdermott |
| Navan | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/navan |
| Newgrange Gold Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/newgrange-gold-ltd |
| O'Brien Fine Foods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/obrien-fine-foods |
| Primrose Pantry | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/primrose-pantry |
| Rathkennery Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rathkennery-farm |
| Rock Farm Slane | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rock-farm-slane |
| Ryans' Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ryans-organic-farm |
| Shackletons Milling Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/shackletons-milling-ltd |
| Shalvanstown Organic Farm, Co. Meath | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/shalvanstown-organic-farm-co-meath |
| Sonairte | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sonairte |
| Spice Atlas | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/spice-atlas |
| Swainstown Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/swainstown-farm |
| The Royal County Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-royal-county-association |
| Think Twice | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/think-twice |
| Baska Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/baska-bakery |
| Kells Wholemeal | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/kells-wholemeal |
| Ruby’s Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/rubys-bakery |
| Connolly Seafood | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/connolly-seafood-meath |
| The Cider Mill | — | Sidra | listed | — | FarmFinder https://farmfinder.ie/producer/the-cider-mill |

### Facility or shopfront only — 36 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Boyne Valley Meats Ltd | Garristown | Carne | Cutting only | — | DAFM meat 2012 |
| Brady's Butchers | Newcastle | Carne | shop=butcher | — | OSM node/6266246323 |
| Brogans Butchers | — | Carne | shop=butcher | — | OSM way/844222271 |
| Coogan Meats Ltd | Trim | Carne | Slaughtering, Cutting only | — | DAFM meat 2352 |
| David's | — | Carne | shop=butcher | — | OSM node/1676709603 |
| Dawn Meats Slane (registered as Dawn Meats Ireland UC T/A Dawn Meats Slane) | Navan | Carne | Slaughtering only; national-scale brand | — | DAFM meat 384 |
| Eugene Kiely's Butchers | Trim | Carne | shop=butcher | — | OSM node/3397131284 |
| Floods Butchers | Oldcastle | Carne | Slaughtering only | — | DAFM meat 2378 |
| Frank Doolan Butchers | Batterstown | Carne | shop=butcher | — | OSM way/404266943 |
| George's | — | Carne | shop=butcher | — | OSM node/12639035746 |
| Gleeson's Butchers | — | Carne | shop=butcher | — | OSM node/12866849996 |
| High Maguire | Ashbourne | Carne | shop=butcher | — | OSM node/5282137840 |
| Irish Country Meats Navan (registered as Anglo Beef Processors Ireland UC T/A Irish Country Meats Navan) | Navan | Carne | Slaughtering, Cutting only; national-scale brand | — | DAFM meat 363 |
| J Flood | — | Carne | shop=butcher | — | OSM way/1214614817 |
| Kepak Clonee Unlimited Company | Clonee | Carne | Slaughtering only; national-scale brand | — | DAFM meat 317 |
| Liffey Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry; via Irish Meat Producers Directory; national-scale brand | — | FarmFinder https://farmfinder.ie/producer/liffey-meats |
| Macken's Butchers | — | Carne | shop=butcher | — | OSM node/12633267433 |
| Mahon Butchers | Dunshaughlin | Carne | shop=butcher | — | OSM node/1224425343 |
| Sean McGrane | — | Carne | shop=butcher | — | OSM node/1722820753 |
| Shane M. Curran | — | Carne | shop=butcher | — | OSM node/3366687780 |
| The Rare Breed | Ratoath | Carne | shop=butcher | — | OSM node/10307418406 |
| Traditional Meat Company | Oldcastle | Carne | Slaughtering, Cutting only | — | DAFM meat 2732 |
| Chez Emily Chocolate Boutique | — | Chocolate | shop=chocolate | chezemily.ie | OSM node/5282162465 |
| Ciara's Candy | — | Dulces y repostería | shop=confectionery | — | OSM node/11247605264 |
| Tara News | Dunshaughlin | Dulces y repostería | shop=confectionery | — | OSM node/1224425340 |
| Crafted | Dunshaughlin | Otros | shop=deli | — | OSM node/13148418293 |
| New Barn Farm | — | Otros | shop=farm | — | OSM node/2280188841 |
| Annaville Home Bakery | — | Pan y cereal | shop=bakery | — | OSM node/1798089229 |
| Doreens Home Bakery | — | Pan y cereal | shop=bakery | — | OSM way/846052861 |
| Harvest Home | Trim | Pan y cereal | shop=bakery | — | OSM node/3399485864 |
| K + L | — | Pan y cereal | shop=bakery | — | OSM node/6137485020 |
| McCloskey’s | — | Pan y cereal | shop=bakery | — | OSM node/12866875202 |
| Oscar's Home | Trim | Pan y cereal | shop=bakery | — | OSM node/12353704427 |
| Picolina | — | Pan y cereal | shop=bakery | — | OSM way/1187584792 |
| Sweet Planet | Dunshaughlin | Pan y cereal | shop=bakery | dunshaughlinbakery@gmail.com | OSM node/4746018807 |
| The Crusty Corner | Dunboyne | Pan y cereal | shop=bakery | +353 1 8015 763 | OSM node/12241548881 |
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
| Brú Brewery | — | brubrewery.ie |
| Boyne Brewhouse | — | boynebrewhouse.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
