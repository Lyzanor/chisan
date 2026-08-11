# Dublin — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/dublin.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/dublin>.
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

### Production signal — 163 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Katie's Kombucha | — | Bebidas sin alcohol | listed | — | FarmFinder https://farmfinder.ie/producer/katie-s-kombucha |
| Calendar Coffee | — | Café | listed | — | FarmFinder https://farmfinder.ie/producer/calendar-coffee |
| Cloud Picker Coffee | — | Café | listed | — | FarmFinder https://farmfinder.ie/producer/cloud-picker-coffee |
| Fixx Coffee | — | Café | listed | — | FarmFinder https://farmfinder.ie/producer/fixx-coffee |
| Keelings Farm & Coffee Shop | — | Café | listed; also OSM way/675737985 | — | FarmFinder https://farmfinder.ie/producer/keelings-farm-and-coffee-shop |
| Asian Artisan Food Limited | Unit B Ground Floor | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4090 |
| Ballymaguire Foods Limited | RathmooneyLuskDublin | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4008 |
| Baxter's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/baxter-s-butchers |
| Boojum Ltd | Unit 26B North City Business ParkNorth R | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4057 |
| Boxty House Limited | Unit 3 | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4094 |
| Brady's Butchers Belvedere Road | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork; also OSM way/486623213 | — | FarmFinder https://farmfinder.ie/producer/brady-s-butchers-belvedere-road |
| Brady's Butchers Fairview | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/brady-s-butchers-fairview |
| Brady's Butchers Newcastle | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/brady-s-butchers-newcastle |
| Brady's Butchers Templeogue | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/brady-s-butchers-templeogue |
| Brambles Café Deli Ltd. | Unit 4C | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (ready to eat) | — | FSAI HSE 4030 |
| Carney Quality Meats Ltd | Coolock | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/carney-quality-meats | — | DAFM meat 2765 |
| Courtney's Factory Shop Ltd | Tallaght | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2979 |
| CPK Compass Group | Unit A8 KingswoodKingswood Business Park | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4085 |
| Crag Meat Supply Ltd | Clondalkin | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2952 |
| Dnata Catering Ireland Limited | Units 5 and 6 Dublin Airport Logistics P | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4075 |
| Donnybrook Fair LTD | Donnybrook | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/donnybrook-fair | — | DAFM meat 2833 |
| Doyle Catering Meats | Rathcoole | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also DAFM meat 3013; also OSM node/6267769985 | doylecateringmeats.com · +353 1 458 9905 · info@doylecateringmeats.com | DAFM meat 2358 |
| Dublin Central Kitchen | Unit D | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4097 |
| Dublin Meat Company (registered as DPB Meats Ltd T/A Dublin Meat Company) | Swords | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also OSM node/4549711708 | www.dublinmeatcompany.com · +353 1 210 8681 | DAFM meat 2903 |
| Egan Meats | Terenure | Carne | Minced Meat, Meat Products Non RTE | — | DAFM meat 2672 |
| Elita Meats or Ryan Meats (registered as Elite Quality Meats Ltd T/A Elita Meats or Ryan Meats) | Finglas | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2052 |
| Emaan Meal Solutions Irl Limited | Unit 1 -3Cookstown Industrial EstateTall | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (ready to eat) | — | FSAI HSE 4053 |
| Emamou Food Ltd | Clondalkin | Carne | Minced Meat | — | DAFM meat 2982 |
| FX Buckley Products Ltd | Rathcoole | Carne | Minced Meat, Meat Preparations, Meat Products RTE, Meat Products Non RTE; also OSM node/1712114849 | — | DAFM meat 2359 |
| Gahan Meats Ltd | Finglas | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also OSM node/13390821669 | — | DAFM meat 2466 |
| Gold Medal Meats Ltd | Palmerstown | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2691 |
| Golden Bake Limited | Coolock | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 4033 |
| Granby Ltd. | Dublin 1 | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 779 |
| Hicks of Dun Laoghaire (registered as Dun Laoghaire Food Company T/A Hicks of Dun Laoghaire) | Dun Laoghaire | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2984 |
| Itsa | 56A Blackthorn RoadSandyford Industrial | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4067 |
| KC Peaches Ireland Limited | Unit 10 Trinity Enterprise CentrePearse | Carne | Manufacturer; Meat Products (not ready to eat); also FarmFinder https://farmfinder.ie/producer/kc-peaches | — | FSAI HSE 4049 |
| Kelly Bros Butchers Ltd | Clondalkin | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2396 |
| Kerrigan's Factory Shop Ltd | Baldoyle | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2951 |
| La Rousse Foods LTD | Nangor Rd | Carne | Minced Meat, Meat Products Non RTE | — | DAFM meat 2368 |
| Lotts & Co | 47A Marlborough RoadDonnybrookDublin 4 | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4096 |
| M & K Meats Ltd | Rathcoole | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also OSM node/6269981826 | — | DAFM meat 2343 |
| Market Street Food Halls Limited | Unit 7G Swords Business ParkSwords K67X0 | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4107 |
| Morehampton Foods Limited | Unit E20 Cloverhill Industrial EstateClo | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (not ready to eat) | — | FSAI HSE 4035 |
| O' Mahony Meats Ltd | Malahide Rd | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2372 |
| Oishii Foods Limited | Unit 17 Naas Road Business ParkMuirfield | Carne | Manufacturer; Products (ready to eat) | — | FSAI HSE 4108 |
| Parkwest Kitchen | A3 Canal Bank | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4087 |
| Pieman | Ace Enterprise Park | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4111 |
| QFL Quality Food Network (registered as DDLM T/A QFL Quality Food Network) | Ballycoolin | Carne | Meat Products Non RTE | — | DAFM meat 2848 |
| Quality First Limited | Muirfield | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2410 |
| Robinson Meats (registered as H & D Meats Ltd T/A Robinson Meats) | Chapelizod | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 782 |
| Sandyford Meats Ltd | Sandyford | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2376 |
| Smokin Bones Production LTD | Oxnamtown Lane | Carne | Meat Products Non RTE | — | DAFM meat 2074 |
| Soup Cafe | Units 3 & 478 Furze Road | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (not ready to eat) | — | FSAI HSE 4043 |
| Spice Village Indian Cuisine | Unit 4C | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4115 |
| Sysco Foods Ireland Unlimited Company | Killamonan | Carne | Meat Preparations | — | DAFM meat 2881 |
| Tender Meats Ltd. | Clondalkin | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 538 |
| The Tram Café Limited | Unit 131D Slaney RoadDublin Industrial E | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4109 |
| Tom Whelan Meat Products Ltd | Clondalkin | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2356 |
| Whelans of Dublin Pudding Manufacturers Ltd | Bluebell | Carne | Meat Products Non RTE | — | DAFM meat 2357 |
| Bear Market Coffee | — | Cerveza | Producer; Dublin Food Chain, Beer, Cider, Spirits | — | FarmFinder https://farmfinder.ie/producer/bear-market-coffee |
| Bob's Juice Bar | — | Cerveza | Producer; Dublin Food Chain, Beer, Cider, Spirits | — | FarmFinder https://farmfinder.ie/producer/bob-s-juice-bar |
| Changing Times Brewery | Glasnevin | Cerveza | craft=brewery; product=beer | www.changingtimesbrewery.com | OSM node/12415312348 |
| Hopkins & Hopkins Brewing Company | Dublin | Cerveza | craft=brewery; product=beer | www.hopburgh.com | OSM node/10775555715 |
| Jack Smyth Brewing Company | Tallaght | Cerveza | craft=brewery | www.boxtyhouse.ie · +35314140032 · info@boxtyhouse.ie | OSM node/9100218750 |
| Sanor | — | Cerveza | craft=brewery | — | OSM node/12638656543 |
| The 5 Lamps Brewery | Dublin | Cerveza | craft=brewery; product=craft beer | the5lampsbrewery.com | OSM way/525723347 |
| The Old Schoolhouse | Swords | Cerveza | microbrewery; product=craft beer | theoldschoolhouse.ie · +353 1 8404 160 · info@theoldschoolhouse.ie | OSM way/228009652 |
| Third Circle Brewing | — | Cerveza | craft=brewery; product=craft_beer | www.thirdcircle.ie/index.html | OSM node/8638179434 |
| Urban Brewing | Dublin | Cerveza | craft=brewery; product=craft beer | www.urbanbrewing.ie · +353 1 568 5989 | OSM node/5073432440 |
| Pearse Lyons | Dublin | Destilados y licores | craft=distillery | www.pearselyonsdistillery.com · +353 1 691 6000 · info@pearselyonsdistillery.com | OSM way/239059341 |
| Roe & Co Distillery | Dublin | Destilados y licores | craft=distillery | www.roeandcowhiskey.com | OSM node/9984256981 |
| Airfield Estate | Upper Kilmacud Road Dundrum | Lácteos y quesos | Bovine, DRINKING MILK PLANT | — | DAFM dairy IE2103 |
| Aoife McNally | McNally Family Farm Balrickard | Lácteos y quesos | Bovine, Caprine, SMALL - MEDIUM | — | DAFM dairy IE1955 |
| Bainne Bó (registered as Yvonne and Alan Fitzachary) | Hillcrest, St. Margaret's, Swords, | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2181 |
| Dixon Transport Ltd | Food Central Warehouses 5 | Lácteos y quesos | milk, COLD STORE | — | DAFM dairy IE2224 |
| Dreamvision Ventures (registered as Mohini Gangaram) | Unit 21, Ace Enterprise | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2221 |
| Dublin Farm Dairies Ltd | Kilreesk St. Margarets Co. | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2202 |
| Dublin Hills Goats Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/dublin-hills-goats-cheese |
| Dubliner Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/dubliner-cheese |
| Dublins Hill Goats Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/dublins-hill-goats-cheese |
| Fusco Foods Ltd | 56, Spruce Avenue Stillorgan | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy 1722 |
| Gleneely Foods Limited | Unit 5 Kilcarbery Park, | Lácteos y quesos | N/A, SMALL - MEDIUM | — | DAFM dairy IE2109 |
| Lilliput Trading Co (registered as Lilliput Artisan Foods Ltd) | Unit 3, 53 Arbour | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2211 |
| McArdle Transport Ltd | Hollystown Dublin 15 D15 | Lácteos y quesos | milk, COLD STORE | — | DAFM dairy IE2225 |
| Simple True Foods (registered as Simple True Ltd) | Unit 21, Ace Enterprise | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2232 |
| Strathroy Dairy Ltd | Unit 105, Northwest Business | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING); also DAFM dairy IE2218 | — | DAFM dairy IE1520 |
| Tim McGlynn | Oldcourt Hill Farm Oldcourt | Lácteos y quesos | Caprine, SMALL | — | DAFM dairy IE2173 |
| Traditional Cheese Company Ltd | Unit 244, Holly Road | Lácteos y quesos | N/A, SMALL - MEDIUM | — | DAFM dairy IE1879 |
| Beechpark Eco Farm | — | Miel | Farm; Preserves, Honey, Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/beechpark-eco-farm |
| Asia Market Dublin | — | Otros | Producer; Dublin Food Chain | — | FarmFinder https://farmfinder.ie/producer/asia-market-dublin |
| Avoca | — | Otros | Producer; Dublin Food Chain | — | FarmFinder https://farmfinder.ie/producer/avoca |
| Balfe Street Deli | — | Otros | Producer; Dublin Food Chain | — | FarmFinder https://farmfinder.ie/producer/balfe-street-deli |
| Blazing Salads | — | Otros | Producer; Dublin Food Chain, Organic | — | FarmFinder https://farmfinder.ie/producer/blazing-salads |
| Bushy Park Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bushy-park-market |
| Butcher.ie | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/butcher-ie |
| Cavistons | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cavistons |
| Clondalkin Cheesemaker | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/clondalkin-cheesemaker |
| Cornucopia | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cornucopia |
| Corrigan's Butchers Finglas | Dublin | Otros | listed; also OSM way/561372020 | www.corrigansbutchers.com | FarmFinder https://farmfinder.ie/producer/corrigan-s-butchers-finglas |
| Cosgrave's The Butcher Shop Ballybrack | Dublin | Otros | listed; also OSM way/570457157; also OSM node/5561973810 | — | FarmFinder https://farmfinder.ie/producer/cosgrave-s-the-butcher-shop-ballybrack |
| Cosgrave's The Butcher Shop Clarehall | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cosgrave-s-the-butcher-shop-clarehall |
| Cosgrave's The Butcher Shop Crumlin | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cosgrave-s-the-butcher-shop-crumlin |
| Cosgrave's The Butcher Shop Santry | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cosgrave-s-the-butcher-shop-santry |
| Country Crest Farmshop | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/country-crest-farmshop |
| Dalkey Handmade Food | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dalkey-handmade-food |
| Dalkey Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dalkey-market |
| Dempsey & Byrne | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dempsey-and-byrne |
| Donovan's Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/donovan-s-butchers |
| Dublin Bay Prawns | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dublin-bay-prawns |
| Dublin Cookie Company | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dublin-cookie-company |
| Dublin Flea Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dublin-flea-market |
| Dublin Food Co-op Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dublin-food-co-op-market |
| Dublin Herbalist | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dublin-herbalist |
| Dublin Herbalists | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dublin-herbalists |
| Dublin Port Company Markets | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dublin-port-company-markets |
| Dublin Roasters | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dublin-roasters |
| Dun Laoghaire People's Park Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dun-laoghaire-people-s-park-market |
| Dun Laoghaire Sunday Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dun-laoghaire-sunday-market |
| Edward Doyle Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/edward-doyle-butchers |
| Ennis Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ennis-butchers |
| Etherson Family Butchers | Dublin | Otros | listed; also OSM way/651183208 | — | FarmFinder https://farmfinder.ie/producer/etherson-family-butchers |
| F.X. Buckley Deansgrange | Deansgrange | Otros | listed; also OSM node/3703279059 | www.fxbuckleybutchers.ie · +353 1 558 4680 | FarmFinder https://farmfinder.ie/producer/f-x-buckley-deansgrange |
| F.X. Buckley Rathcoole | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/f-x-buckley-rathcoole |
| F.X. Buckley Rathfarnham | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/f-x-buckley-rathfarnham |
| Fallon & Byrne | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/fallon-and-byrne |
| Flower & Bean Cafe | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/flower-and-bean-cafe |
| Full Circle Roasters | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/full-circle-roasters |
| Gleeson Meats Balbriggan | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gleeson-meats-balbriggan |
| Gleeson Meats Blanchardstown | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gleeson-meats-blanchardstown |
| Gleeson's Artane | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gleeson-s-artane |
| Goodness Grains | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/goodness-grains |
| Green Saffron | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/green-saffron |
| Higgins Family Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/higgins-family-butchers |
| Homespun | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/homespun |
| Honest to Goodness Market Glasnevin | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/honest-to-goodness-market-glasnevin |
| Honest2Goodness Market (Glasnevin | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/honest2goodness-market-glasnevin |
| Howth Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/howth-market |
| J.W. Smyth Butchers | Raheny | Otros | listed; also OSM way/313827643 | — | FarmFinder https://farmfinder.ie/producer/j-w-smyth-butchers |
| Keogh's Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/keogh-s-farm |
| Kerrigan Butchers Donaghmede | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kerrigan-butchers-donaghmede |
| Kerrigan Butchers Malahide | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kerrigan-butchers-malahide |
| Kerrigans Butchers | — | Otros | listed; also OSM way/1352202358 | — | FarmFinder https://farmfinder.ie/producer/kerrigans-butchers |
| King's Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/king-s-butchers |
| Leavy's Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/leavy-s-butchers |
| Lilliput Stores | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lilliput-stores |
| Listons Food Store | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/listons-food-store |
| An Bácús Beag | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/an-b-c-s-beag |
| Arun Bakery | Dublin | Pan y cereal | Producer; Dublin Food Chain, Bread & Bakery; also OSM node/305313396 | — | FarmFinder https://farmfinder.ie/producer/arun-bakery |
| Blossom Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/blossom-bakery |
| Bread 41 | Dublin | Pan y cereal | Producer; Organic, Bread & Bakery, Artisan Bread, Sourdough; via Real Bread Ireland / Irish Bakeries Directory; also OSM node/12161713561 | — | FarmFinder https://farmfinder.ie/producer/bread-41 |
| Bread Nation | — | Pan y cereal | Producer; Dublin Food Chain, Bread & Bakery | — | FarmFinder https://farmfinder.ie/producer/bread-nation |
| Brother Hubbard | — | Pan y cereal | Producer; Dublin Food Chain, Bread & Bakery, remaining), About | — | FarmFinder https://farmfinder.ie/producer/brother-hubbard |
| Camerino Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/camerino-bakery |
| Coghlans Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/coghlans-bakery |
| Craft Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/craft-bakery |
| Elliots Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/elliots-bakery |
| Gerry's Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/gerry-s-bakery |
| Skinny Batch Food Co. | Lusk | Pan y cereal | craft=bakery | — | OSM way/744545070 |
| Beshoffs Brothers | — | Pescado | Producer; Dublin Food Chain, Seafood | — | FarmFinder https://farmfinder.ie/producer/beshoffs-brothers |
| Kish Fish | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/kish-fish |
| Nectar Wines | — | Vino | craft=winery | — | OSM node/4686048744 |
| Pinto Wines | — | Vino | craft=winery | — | OSM node/11178988551 |
| Solera Wine Merchants Limited | Dublin | Vino | craft=winery | www.solera.ie · +353 1 1547 0562 | OSM node/12114580057 |

### Facility or shopfront only — 195 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| A&F Meats | — | Carne | shop=butcher | — | OSM node/11178968168 |
| Acres Family Butcher | Dublin | Carne | shop=butcher | — | OSM way/963331900 |
| Asian Foods Butchers | — | Carne | shop=butcher | — | OSM node/3740250975 |
| Boylans | Rush | Carne | shop=butcher | — | OSM node/12520942544 |
| Brady's | — | Carne | shop=butcher | — | OSM way/1074353190 |
| Brady's Craft Butcher | Dublin | Carne | shop=butcher | — | OSM way/314264812 |
| Branagan's Craft Butchers | — | Carne | shop=butcher | — | OSM node/1563623744 |
| Brendan's Of Crumlin | Dublin | Carne | shop=butcher | www.brendansbutchers.com · +353 1 4551687 | OSM node/2995287588 |
| Brian's Family Butchers | — | Carne | shop=butcher | — | OSM node/3126035955 |
| Bridge Butchers | Dublin | Carne | shop=butcher | — | OSM node/6795621375 |
| Brown's Family Butchers | Dublin | Carne | shop=butcher | — | OSM node/2991107249 |
| Buffy's Butchers | — | Carne | shop=butcher | — | OSM node/2940556705 |
| Burkes The Butchers | — | Carne | shop=butcher | — | OSM node/3077675595 |
| Butcher's Block | — | Carne | shop=butcher | — | OSM node/8952233568 |
| C&C Family Butchers | — | Carne | shop=butcher | — | OSM node/890724796 |
| C&N Meats | — | Carne | shop=butcher | — | OSM node/1473502331 |
| Castle Mill Butchers | — | Carne | shop=butcher | — | OSM node/1824060138 |
| Clarkes Family Butchers | Dublin | Carne | shop=butcher | — | OSM way/971275799 |
| Collier | — | Carne | shop=butcher | — | OSM node/6657669750 |
| Colm Levey | — | Carne | shop=butcher | — | OSM node/2370676334 |
| Corrigans Butchers | Glasnevin | Carne | shop=butcher | +353 1 834 4643 | OSM way/958601191 |
| Cosgraves | — | Carne | shop=butcher | — | OSM node/10600228584 |
| County Meats | Dublin | Carne | shop=butcher | +353 1 454 2820 | OSM node/2991107253 |
| Curtis Family Butcher | — | Carne | shop=butcher | — | OSM way/967683932 |
| Dawn Meats Ireland | Ballymount | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; national-scale brand | — | DAFM meat 2899 |
| Des | — | Carne | shop=butcher | — | OSM way/138542102 |
| Donabate Village Butchers | Donabate | Carne | shop=butcher | — | OSM node/3004207094 |
| Donovans of Rathgar | Dublin | Carne | shop=butcher | — | OSM node/3039675540 |
| Dowling's Butchers | Dublin | Carne | shop=butcher | — | OSM node/3680296596 |
| Doyles Butchers | — | Carne | shop=butcher | — | OSM node/14005410596 |
| Eddie Lloyd & Sons | — | Carne | shop=butcher | +353 1 453 4616 | OSM way/706807524 |
| Ennis Butcher's | — | Carne | shop=butcher | — | OSM node/768231920 |
| Fenlons | — | Carne | shop=butcher | fenelons.ie · +353 1 288 1185 | OSM node/1056711326 |
| Fine Food Dining LTD | Naas Rd | Carne | Cutting only | — | DAFM meat 2855 |
| Flemings Butchers | Kilmacud | Carne | shop=butcher; also OSM node/12641066220 | www.flemingsfoods.ie · +353 1 296 7998 | OSM node/7968720915 |
| Frank's Pork Shop | Dublin | Carne | shop=butcher | — | OSM node/1361340486 |
| Green Valley Meats Factory Shop | Dublin | Carne | shop=butcher | — | OSM node/6795635485 |
| Hackets Family Butchers | Rush | Carne | shop=butcher | — | OSM node/12504285003 |
| Hannigans | — | Carne | shop=butcher | — | OSM node/638364604 |
| Hick's | Dún Laoghaire | Carne | shop=butcher | hicks.ie · +353 1 280 1433 · dunlaoghairefoodco@gmail.com | OSM node/6178795475 |
| Hicks of Dalkey | Dalkey | Carne | shop=butcher | +353 1 285 9568 | OSM node/9566311503 |
| Higgin's | — | Carne | shop=butcher | — | OSM node/6676979027 |
| Hogans Butchers | — | Carne | shop=butcher | — | OSM node/2405703095 |
| Howley's Butcher | Lusk | Carne | shop=butcher | — | OSM node/10720146882 |
| J. Downey & Son | Dublin | Carne | shop=butcher | www.organicfoodsireland.com · +353 1 4909239 | OSM node/3104886052 |
| James Whelan | Dublin | Carne | shop=butcher | — | OSM node/4396967814 |
| John Byrne & Sons | Dublin | Carne | shop=butcher | — | OSM node/2885644007 |
| John O'Reilly | Mount Merrion | Carne | shop=butcher | — | OSM way/70749444 |
| JW Smiths Butcher | — | Carne | shop=butcher | jwsmythbutchers.ie | OSM node/1947468213 |
| Keogh's | — | Carne | shop=butcher | — | OSM way/965411028 |
| Keogh's Butchers | — | Carne | shop=butcher | — | OSM node/1500501202 |
| Kimex Ireland Ltd | Inchicore | Carne | Cutting only | — | DAFM meat 2837 |
| La Tradizione LTD | Clondalkin | Carne | Cutting only | — | DAFM meat 3046 |
| Larry's Marino Fair | Dublin | Carne | shop=butcher | marketfair.ie | OSM way/975311026 |
| Lawlor's Butchers | Dublin | Carne | shop=butcher; also OSM node/4368865472 | — | OSM node/564926478 |
| Mahon's Butchers | Dublin | Carne | shop=butcher | — | OSM node/2940666222 |
| Market Butcher | — | Carne | shop=butcher | themarketbutchers.ie · +353 1 458 7942 | OSM node/6269981825 |
| McKenna's Meats | — | Carne | shop=butcher | — | OSM way/1050698603 |
| McLoughlin's Butchers & Deli | — | Carne | shop=butcher | — | OSM node/5862048415 |
| McLoughlins | — | Carne | shop=butcher | — | OSM node/12636352979 |
| Miku's Butchers | — | Carne | shop=butcher | — | OSM node/11178960004 |
| O'Coileain | — | Carne | shop=butcher | — | OSM node/959243525 |
| O'Rourke's Butchers | Dublin | Carne | shop=butcher | — | OSM way/973141977 |
| O'Toole's | — | Carne | shop=butcher | — | OSM node/878495558 |
| P. Byrne & Sons | Dublin | Carne | shop=butcher | — | OSM node/5419527348 |
| P&P Meats | Dublin | Carne | shop=butcher | — | OSM node/6192788848 |
| Palmetstown Meats | — | Carne | shop=butcher | — | OSM way/249629273 |
| Paul's Family Butchers | — | Carne | shop=butcher | — | OSM node/2988931461 |
| Redmond's Butchers | — | Carne | shop=butcher | — | OSM node/458220907 |
| Reinhardt's Finest Quality Meats | — | Carne | shop=butcher | — | OSM node/2298361020 |
| The Butchers Kitchen | — | Carne | shop=butcher | — | OSM node/5629484883 |
| The Butchery | Naul | Carne | shop=butcher | — | OSM node/4432291082 |
| The Finglas Meat Market | — | Carne | shop=butcher | — | OSM node/4022416800 |
| The Scarlet Heifer | — | Carne | shop=butcher | www.thescarletheifer.com | OSM node/10951811254 |
| TJ's Butcher | — | Carne | shop=butcher | — | OSM way/1281253554 |
| Tony Higgins | — | Carne | shop=butcher | — | OSM node/1540781089 |
| Village Butcher | Dublin | Carne | shop=butcher; also OSM way/893376288 | — | OSM node/2396152605 |
| Village meats | — | Carne | shop=butcher | — | OSM node/3233585897 |
| Ward's | — | Carne | shop=butcher | — | OSM way/969938175 |
| Whelan's Butchers & Deli | — | Carne | shop=butcher | — | OSM node/5862048414 |
| Chez Emily Chocolate | The Ward | Chocolate | shop=chocolate | chezemily.ie · +353 1 835 2252 · sales@chezemily.ie | OSM way/1230714741 |
| Dolce Desserts | Dublin | Dulces y repostería | shop=confectionery | www.dolcedessertsdublin.com/home | OSM node/13032224401 |
| Kingdom of Sweets | Dublin | Dulces y repostería | shop=confectionery | www.kingdomofsweets.co.uk | OSM node/6073175694 |
| Morilles Coffee | — | Dulces y repostería | shop=confectionery | — | OSM way/802015348 |
| Planet Candy | Dublin | Dulces y repostería | shop=confectionery | — | OSM node/3493931988 |
| Temple Snack | Dublin | Dulces y repostería | shop=confectionery | — | OSM node/12035318310 |
| Valley News | — | Dulces y repostería | shop=confectionery | — | OSM node/6313378896 |
| Iciar | Dublin | Lácteos y quesos | shop=cheese | — | OSM node/3906732140 |
| Ornua Co-operative Ltd | Grattan House Mount Street | Lácteos y quesos | N/A, TRADER; national-scale brand | — | DAFM dairy 1707 |
| Sheridan's | Dublin | Lácteos y quesos | shop=cheese; also OSM node/4396967816; also OSM way/273206920 | — | OSM node/4368865473 |
| 147 Deli | Dublin | Otros | shop=deli | — | OSM way/252809420 |
| A taste of Spain | Dublin | Otros | shop=deli | — | OSM node/4223705251 |
| Baxter & Greene | — | Otros | shop=deli | — | OSM node/4531981157 |
| Bijou Deli | Dublin | Otros | shop=deli | www.bijoudeli.ie | OSM node/3036071390 |
| Blu Apple Kitchen | Dublin | Otros | shop=deli | — | OSM node/2507794452 |
| Coffee Deli | Dublin | Otros | shop=deli | — | OSM node/2991107255 |
| Conatys | — | Otros | shop=deli | — | OSM way/90611817 |
| Declan & Donal's | — | Otros | shop=deli | declananddonal.com · +353 85 201 7721 · dohora.1@gmail.com | OSM node/13556732301 |
| Deli-licious | — | Otros | shop=deli | +353 1 455 7797 | OSM node/2995293835 |
| Eccles Townhouse | Dublin | Otros | shop=deli | — | OSM node/2573726983 |
| Hotel chocolat | Dublin | Otros | shop=deli | — | OSM node/10079508004 |
| Humble | Dublin | Otros | shop=deli | — | OSM node/2301566073 |
| Jaffa On the Quay | Dublin | Otros | shop=deli | jaffa.ie · +353 1 633 4853 · pat@jaffa.ie | OSM node/3092292622 |
| Kari Stores | — | Otros | shop=deli | — | OSM node/7154459195 |
| Kennedy's Food Store | — | Otros | shop=deli | — | OSM way/314233868 |
| Kennedys | — | Otros | shop=deli | — | OSM way/233507010 |
| Kenure Perk | Rush | Otros | shop=deli | — | OSM node/12527591912 |
| Maxol | — | Otros | shop=deli | — | OSM node/5374590530 |
| Minetta | — | Otros | shop=deli | — | OSM node/6652247602 |
| Moreish | Donabate | Otros | shop=deli | — | OSM node/9383018955 |
| Munch & Co. | — | Otros | shop=deli | — | OSM node/6261616566 |
| Olive Deli | — | Otros | shop=deli | olive.ie · +353 1 849 0310 | OSM node/5809849224 |
| Ollie's Deli | Donabate | Otros | shop=deli | — | OSM node/5671003014 |
| Polski Sklep | Dublin | Otros | shop=deli | — | OSM node/5585403354 |
| Polskie Delikatesy | — | Otros | shop=deli | +353 1 826 6790 | OSM node/6345581739 |
| Rowans | — | Otros | shop=deli | — | OSM way/570457160 |
| Saladbox | Dublin | Otros | shop=deli | — | OSM node/6041643782 |
| Shop Easi | — | Otros | shop=deli | — | OSM node/2363257124 |
| Skerries Organic Farm | — | Otros | shop=farm | — | OSM node/12627550495 |
| Small Changes | Dublin | Otros | shop=deli | www.smallchanges.ie · +353 1 552 6147 | OSM way/942944690 |
| Spicy Deals | Dublin | Otros | shop=deli | — | OSM node/3579557651 |
| Strawberry Punnets Honesty Box | — | Otros | shop=farm | — | OSM node/14056226301 |
| Sunglowshop | — | Otros | shop=farm | — | OSM node/14064154101 |
| Tasty Options | — | Otros | shop=deli | — | OSM node/5400353566 |
| The Butlers Pantry | Dublin | Otros | shop=deli; also OSM node/11940298913 | www.thebutlerspantry.ie · +353 1 660 8490 | OSM node/4554246007 |
| The Lovely Food Company | Dublin | Otros | shop=deli | www.lovelyfood.ie · +353 1 4927717 | OSM node/2579495153 |
| The Yard | — | Otros | shop=deli | — | OSM node/13418182989 |
| Thomas's of Foxrock | — | Otros | shop=deli | — | OSM node/10951811284 |
| Toons Bridge Dairy | Dublin | Otros | shop=deli | www.toonsbridgedairy.com · +35314443877 | OSM node/5337172888 |
| Treat | — | Otros | shop=deli | — | OSM way/651183220 |
| Waterfall Farm | — | Otros | shop=farm | www.waterfallfarm.ie | OSM way/171894836 |
| Artybaker | — | Pan y cereal | shop=bakery | artybaker.com | OSM node/13544379821 |
| Baked | Dublin | Pan y cereal | shop=bakery | — | OSM node/2980317232 |
| Bakelicious | — | Pan y cereal | shop=bakery | — | OSM node/3550798020 |
| Baker Street | — | Pan y cereal | shop=bakery | — | OSM node/11522373456 |
| Bear Lemon | Dublin | Pan y cereal | shop=bakery | — | OSM way/741013953 |
| Beaumont Bakery | Dublin | Pan y cereal | shop=bakery | — | OSM node/5419527349 |
| Betsys | — | Pan y cereal | shop=bakery | — | OSM node/11387999727 |
| Black Sheep coffee | — | Pan y cereal | shop=bakery | — | OSM node/1031024459 |
| Brown Bag Bakery | — | Pan y cereal | shop=bakery | www.brownbagbakery.ie | OSM node/13759613436 |
| Butler's Pantry | — | Pan y cereal | shop=bakery; also OSM node/2885644005 | thebutlerspantry.ie · +353 1 288 5505 | OSM node/2301397536 |
| Cinnamood | Dublin | Pan y cereal | shop=bakery | cinnamoodrolls.com | OSM way/353991662 |
| Clarke's Home Bakery | — | Pan y cereal | shop=bakery | — | OSM way/659972601 |
| Comptoir | Dublin | Pan y cereal | shop=bakery | — | OSM node/2439265698 |
| Cookie Monster | Dublin | Pan y cereal | shop=bakery | — | OSM way/229057387 |
| Cremore Bakery | Glasnevin | Pan y cereal | shop=bakery | +353 1 804 1942 | OSM way/958564199 |
| Croissantly | Dún Laoghaire | Pan y cereal | shop=bakery | croissantlybakery.ie · hello@croissantly.com | OSM node/6184690202 |
| Crumbles Bakery | Dublin 12 | Pan y cereal | shop=bakery | — | OSM way/1462070864 |
| Donnelly's Bakery | Dublin | Pan y cereal | shop=bakery | — | OSM way/975311030 |
| Elliot's | — | Pan y cereal | shop=bakery | — | OSM node/4899884232 |
| Fable Bakery | — | Pan y cereal | shop=bakery | fablebakery.com | OSM node/13566318201 |
| Filipino Bakery | Dublin | Pan y cereal | shop=bakery | — | OSM node/1956582489 |
| Fothergill's Delicatessen | Dublin | Pan y cereal | shop=bakery | — | OSM node/564926482 |
| Gaillot et Gray | — | Pan y cereal | shop=bakery | — | OSM node/6421393839 |
| Goldribbon | — | Pan y cereal | shop=bakery | — | OSM node/5405991623 |
| Hansel & Gretel | Dublin | Pan y cereal | shop=bakery | — | OSM way/231192204 |
| il Valentino | Dublin | Pan y cereal | shop=bakery | www.ilvalentino.ie | OSM node/3338276450 |
| J&K's Corner | — | Pan y cereal | shop=bakery | — | OSM node/6749206543 |
| Krust Bakery | Dublin | Pan y cereal | shop=bakery | — | OSM node/559854617 |
| La Boulangerie Francaise | — | Pan y cereal | shop=bakery | — | OSM node/639076143 |
| Ladurée Dublin | Dublin | Pan y cereal | shop=bakery | ladureeireland.com | OSM node/5212682322 |
| Liffeyside | Dublin | Pan y cereal | shop=bakery | — | OSM node/6257799722 |
| Little Honey | — | Pan y cereal | shop=bakery | — | OSM node/14054163579 |
| Lumley's Bakery | — | Pan y cereal | shop=bakery | +353 1 473 3553 | OSM node/7072121643 |
| Mannings Bakery & Café | Dublin | Pan y cereal | shop=bakery; also OSM node/9563596229 | — | OSM node/1473450253 |
| Padoca | Dublin | Pan y cereal | shop=bakery | — | OSM node/6144855291 |
| Pane Creme | Dublin | Pan y cereal | shop=bakery | — | OSM node/662969432 |
| Phoenix Home Bakery | Dublin | Pan y cereal | shop=bakery | — | OSM node/4029779542 |
| Russell Street Bakery | Dublin | Pan y cereal | shop=bakery | — | OSM node/11741914281 |
| Sugarloaf | — | Pan y cereal | shop=bakery | — | OSM way/658163881 |
| Tasty Treats Bakery | — | Pan y cereal | shop=bakery | — | OSM node/5862048419 |
| The Bretzel Bakery | — | Pan y cereal | shop=bakery | www.bretzel.ie · +353 1 4759445 · bretzelshop@bretzel.ie | OSM node/1408878833 |
| The Food Shop | — | Pan y cereal | shop=bakery | — | OSM way/68577039 |
| The Green Door | — | Pan y cereal | shop=bakery | — | OSM node/3874513562 |
| The Natural Bakery | — | Pan y cereal | shop=bakery | www.thenaturalbakery.ie · +353 1 5584 497 · orders@thenaturalbakery.ie | OSM node/3750529749 |
| The One 2 Vue Shop | — | Pan y cereal | shop=bakery | — | OSM node/3465653399 |
| The Orange Tree Bakery | Dublin | Pan y cereal | shop=bakery | orangetreethebakeryshop.com | OSM node/2983580708 |
| Thunder's Bakery | — | Pan y cereal | shop=bakery | — | OSM way/972046297 |
| Thunders home bakery | — | Pan y cereal | shop=bakery; also OSM node/11724881359; also OSM way/233507043 | thundersbakery.ie · +353 1 4558 171 | OSM node/2939213024 |
| Twist | Dublin | Pan y cereal | shop=bakery | www.twistbakerydublin.com · info@twistbakerydublin.com | OSM node/5109507722 |
| Yami Yami | — | Pan y cereal | shop=bakery | yami-yami.ie · hello@yami-yami.ie | OSM node/13525591401 |
| Al's Fish Shop | — | Pescado | shop=seafood | — | OSM way/138542100 |
| Connolly's Fish Company | Dublin | Pescado | shop=seafood | — | OSM node/564926485 |
| George's Fish Shop | Dún Laoghaire | Pescado | shop=seafood | georgesfishshop.com · +353 1 230 3011 · info@georgesfishshop.com | OSM node/6204207097 |
| Georges Fish Shop | — | Pescado | shop=seafood | — | OSM node/1835454827 |
| Hanlon | Dublin | Pescado | shop=seafood | — | OSM node/4396967815 |
| Meat 'n' Plaice | — | Pescado | shop=seafood | +353 1 848 6839 · selectseafoods@hotmail.co.uk | OSM node/5391266556 |
| Muldoons Fresh Fish & Poultry | Dublin | Pescado | shop=seafood | — | OSM way/973141976 |
| Mulloy's | — | Pescado | shop=seafood | — | OSM node/1228651142 |
| Nicky's Plaice | — | Pescado | shop=seafood | — | OSM node/1228651138 |
| Ray's Catch | — | Pescado | shop=seafood | — | OSM node/5515321819 |
| Reid's | — | Pescado | shop=seafood | — | OSM node/1228651140 |
| Roberts of Dalkey | Dalkey | Pescado | shop=seafood | robertsofdalkey.ie · +353 1 557 0037 | OSM way/237916666 |
| The Catch Fish Shop | Cornelscourt | Pescado | shop=seafood | thecatchfishshop.ie · +353 1 289 2111 | OSM node/4272190209 |
| Wright's of Marino | Dublin | Pescado | shop=seafood | — | OSM node/3481459333 |
## Teeling Whiskey — municipality and address unresolved (2026-08-11)

Source: <http://www.teelingwhiskey.com/>, read 2026-08-11. The producer's own site
establishes identity, the products and that the distillery is in Dublin, and it
sells online. It publishes no street address, phone or email on the pages read,
so the productive `municipio` inside County Dublin is not yet pinned.

To resolve: read the distillery's own visit or contact page for the address.
Note `dublin` is dropped from the built centroid catalog as ambiguous and is
supplied instead by `municipality-overrides.json`.

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
| Four Provinces Brewery Co. | Dublin | fourprovinces.ie |
| Hope Beer | Dublin | hopebeer.ie |
| LINEMAN | — | lineman.ie |
| Porterhouse Brew Co. | Glasnevin | porterhousebrewco.ie |
| Priory Brewing | — | priorybrewing.ie |
| Rascals Brewing Co | Rathcoole | rascalsbrewing.com |
| Stone Barrel Brewing Co | — | stonebarrelbrewing.ie |
| Third Barrel Brewing | — | thirdbarrel.com |
| Whiplash Beer | — | whiplashbeer.com |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
