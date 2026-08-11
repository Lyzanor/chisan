# Cork — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/cork.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/cork>.
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

### Production signal — 170 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Cork Coffee Roasters | — | Café | listed | — | FarmFinder https://farmfinder.ie/producer/cork-coffee-roasters |
| A. O'Reilly & Sons (registered as Donagh O'Reilly, T/A A. O'Reilly & Sons) | Youghal | Carne | Meat Products Non RTE; also OSM way/915559652 | +353 21 427 0925 · donagh.aoreilly@gmail.com | DAFM meat 2394 |
| Ballineen Fine Foods Ltd | Bandon | Carne | Meat Products Non RTE | — | DAFM meat 792 |
| Ballyburden Meat Processors LTD | Ballincollig | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2366 |
| C.L. Meats Ltd | Kinsale Rd | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2538 |
| Caherbeg Free Range Pork Ltd | Rosscarbery | Carne | Minced Meat, Meat Preparations, Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2303 |
| Castleview Meats Ltd | Macroom | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2321 |
| Clifford's Craft Butchers & Foodstore | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/clifford-s-craft-butchers-and-foodstore |
| Clonakilty Black Pudding | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/clonakilty-black-pudding |
| Clonakilty Food Company UC | Western Rd., Clonakilty | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 780 |
| Cormac O'Connor (Pork & Bacon) Ltd | Mayfield | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2949 |
| D.P Murphy & Sons | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/d-p-murphy-and-sons |
| Dan Moloney's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/dan-moloney-s-butchers |
| Daniel P Murphy | Midleton | Carne | Minced Meat | — | DAFM meat 2528 |
| Davidson's Craft Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/davidson-s-craft-butchers |
| Days of Whitegate | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/days-of-whitegate |
| Dromscarra Poultry | — | Carne | listed | — | FarmFinder https://farmfinder.ie/producer/dromscarra-poultry |
| Durcan Meats | Cork | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM way/915559637 | www.tomdurcanmeats.ie · +353 21 427 9141 · info@tomdurcanmeats.ie | FarmFinder https://farmfinder.ie/producer/durcan-meats |
| Feoil Na Fleisce Teoranta | Baile Mhuirne | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2318 |
| Feoil O' Criostoir | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/feoil-o-criostoir |
| Fermoy Meat (registered as Andrius Kralikas T/A Fermoy Meat) | Fermoy | Carne | Minced Meat, Meat Preparations; also DAFM meat 3026 | — | DAFM meat 2897 |
| Fitzgerald Butchers (registered as Bary Fitzgerald Butchers Ltd T/A Fitzgerald Butchers) | Fermoy | Carne | Slaughtering only; also FarmFinder https://farmfinder.ie/producer/fitzgerald-s-butchers-fermoy; also OSM node/6699328759 | — | DAFM meat 2469 |
| Green Saffron Spices Limited | Unit 5 | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (ready to eat) | — | FSAI HSE 4045 |
| Gubbeen Farm House Products LTD | Schull | Carne | Minced Meat, Meat Preparations, Meat Products RTE, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/gubbeen-farm | — | DAFM meat 2317 |
| Hanley's Puddings LTD | Mitchelstown | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also OSM node/6699386572 | — | DAFM meat 2320 |
| Hodgins Sausages LTD | Mitchelstown | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2305 |
| Irish Bacon Slicers Ltd | Ballincollig | Carne | Meat Products Non RTE; also OSM node/12115995626 | — | DAFM meat 560 |
| Jerry Nolan Meat Wholesalers LTD | Fairhill | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2701 |
| Kinsale Bay Food Company Ltd | CHR Hansen BuildingRohan Industrial Esta | Carne | Manufacturer; Products (not ready to eat) | — | FSAI HSE 4048 |
| La Charcuterie Irlandaise LTD | Douglas | Carne | Meat Products RTE | — | DAFM meat 2864 |
| McCarthy's Meat Market (registered as Foxbrook Foods LTD T/A McCarthy's Meat Market) | Wilton | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 3014 |
| MI J. O'Neill | Clonakilty | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2459 |
| Michael Twomey Butchers LTD | Macroom | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/michael-twomey-butchers; also FarmFinder https://farmfinder.ie/producer/michael-twomey-butchers-bantry; also OSM node/6485632234 | — | DAFM meat 2669 |
| Murphy's Takeaway Foods LTD | Ballyvolane | Carne | Meat Products Non RTE | — | DAFM meat 3010 |
| O'Farrell Meats Ltd | Midleton | Carne | Minced Meat, Meat Preparations; also OSM node/7557202765 | — | DAFM meat 2011 |
| O'Flynn Foods LTD | Wilton | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2917 |
| Paddy O'Donoghue | Bantry | Carne | Meat Products Non RTE | — | DAFM meat 2452 |
| Putog Teoranta | Cork | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2798 |
| Quigley Meats LTD | Ballincollig | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2518 |
| Sage 2 Go Ltd | Production KitchenUnit B Dosco Industria | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4104 |
| Secret Recipe Ltd | Ballincollig | Carne | Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2840 |
| Shannon Vale Foods | Clonakilty | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 814 |
| Skeaghanore Duck (registered as Eugene & Helena Hickey T/A Skeaghanore Duck) | Skeaghanore | Carne | Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2894 |
| Staunton Foods Ltd. | Timoleague | Carne | Meat Products Non RTE | — | DAFM meat 380 |
| The Chicken Inn | Ballyvolane | Carne | Meat Products RTE | — | DAFM meat 2948 |
| Tim Murphy | Bantry | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2456 |
| Ummera Smoke Products LTD (registered as Ummera Smoke House LTD T/A Ummera Smoke Products LTD) | Timoleague | Carne | Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2316 |
| Blarney Brewing Company | Cork | Cerveza | craft=brewery | www.blarneybrewing.ie · sales@blarneybrewing.ie | OSM node/13371533172 |
| Munster Brewery | — | Cerveza | craft=brewery; product=craft_beer | munsterbrewery.com | OSM node/8639889131 |
| Nine White Deer | Baile Mhic Íre | Cerveza | craft=brewery | — | OSM node/13926668831 |
| Original 7 | Cork | Cerveza | craft=brewery | www.original7.ie · hey@original7.ie | OSM node/11010844910 |
| Páirc Gnó Bhaile Mhic Íre | Ballymakeera | Cerveza | microbrewery | — | OSM way/691209721 |
| Clonakilty Distillery | Clonakilty | Destilados y licores | craft=distillery | www.clonakiltydistillery.ie · +353 23 884 0635 | OSM way/60709213 |
| Jameson Distillery Midleton | — | Destilados y licores | craft=distillery | — | OSM node/395572119 |
| West Cork Distillers | — | Destilados y licores | craft=distillery | — | OSM way/192275347 |
| Dooley's | Rathcormack | Dulces y repostería | craft=confectionery | — | OSM way/400792978 |
| Healy’s Home Grown Veg | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/healy-s-home-grown-veg |
| Free Range Eggs | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/free-range-eggs |
| Lee Valley Eggs | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/lee-valley-eggs |
| West Cork Eggs | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/west-cork-eggs |
| Anabio Technologies Ltd | IDA Business Park, Carrigtwohill, | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2127 |
| AOR International Transport Ltd | Aglish Coachford Co Cork | Lácteos y quesos | milk, COLD STORE | — | DAFM dairy IE2217 |
| Ardsallagh Goat Products  Ltd | Ardsallagh Farm Woodstock Carrigtohill | Lácteos y quesos | Bovine, Caprine, SMALL - MEDIUM | — | DAFM dairy IE1872 |
| Avelway Ltd | Sleenoge Enniskeane Co Cork | Lácteos y quesos | milk, COLD STORE | — | DAFM dairy IE2223 |
| Ballinrostig Organic Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/ballinrostig-organic-cheese |
| Ballymaloe Cookery School (registered as Ballymaloe Cookery School Ltd) | Shanagarry Co Cork P25 | Lácteos y quesos | Bovine, SMALL; also FarmFinder https://farmfinder.ie/producer/ballymaloe-cookery-school-farm | — | DAFM dairy IE2158 |
| Bandon Co-operative Agricultural & Dairy Society | Kilbrogan Bandon Co Cork | Lácteos y quesos | milk, COLD STORE | — | DAFM dairy IE2216 |
| Barryroe Co-operative | Lislevane Bandon Co Cork | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1523 |
| Beechers Handmade Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/beechers-handmade-cheese |
| Bluebell Falls Ltd | Ballinakill East Newtownshandrum Charleville | Lácteos y quesos | Bovine, Caprine, SMALL - MEDIUM | — | DAFM dairy IE1984 |
| Bo Rua Farm (registered as Norma Dinneen Limited) | Bó Rua Farm Ballyknock | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2133 |
| Boherbue Co-Op (registered as Boherbue Agricultural & Dairy Society Ltd.) | Boherbue, Mallow Co Cork | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1504 |
| Carrigaline Farmhouse Cheese Ltd | The Rock Carrigaline Co | Lácteos y quesos | Bovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/carrigaline-farmhouse-cheese | — | DAFM dairy IE1846 |
| Cléire Goats (registered as Ed & Duncan Harper) | Cape Clear Island Skibbereen | Lácteos y quesos | Caprine, SMALL - MEDIUM | — | DAFM dairy IE1007 |
| Clona Dairy Products Ltd | Sand Quay Clonakilty Co | Lácteos y quesos | Bovine, DRINKING MILK PLANT | — | DAFM dairy IE1431 |
| Coastal Trading & Consulting Ltd. | Costal Lodge Garryvoe Ladysbridge | Lácteos y quesos | N/A, SMALL - MEDIUM | — | DAFM dairy IE1914 |
| Coolea Farmhouse Cheese Ltd (Cais Cuil Aodha Teo) | Milleens Coolea Macroom Co. | Lácteos y quesos | Bovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/coolea-farmhouse-cheese-ltd | — | DAFM dairy IE1856 |
| Coolmore Farmhouse Ltd | The Forge The Old | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2204 |
| Cybercolours Ltd | National Food Innovation Hub, | Lácteos y quesos | milk, SMALL | — | DAFM dairy 1724 |
| Dairy Concepts IRL (registered as Poldertron Ltd) | c/o Moorepark Technology Ltd | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2126 |
| Dan Hegary Cheese (registered as Dan Hegarty) | Church Rd Whitechurch Co | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1902 |
| Danone Infant Nutrition Macroom Ltd. | Castleview Macroom Co Cork | Lácteos y quesos | Bovine, INFANT FORMULA BASE POWDER | — | DAFM dairy 1702 |
| Desmond Cheese | — | Lácteos y quesos | Producer; Dairy, Eggs, Cheese, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/desmond-cheese |
| Drinagh Co-op Ltd | Drinagh Co Cork | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1518 |
| Durrus Cheese Ltd | Coomkeen Durrus Bantry Co | Lácteos y quesos | Bovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/durrus-cheese | — | DAFM dairy IE1802 |
| Fermoy Natural Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/fermoy-natural-cheese |
| Galvins Farms Fresh Milk Ltd | Clashavanna, Kilbrittain, Bandon, Co. | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2164EC |
| Gloun Cross Dairy (registered as Elizabeth O'Donovan) | Gloun North Dunmanway Co. | Lácteos y quesos | Bovine, DRINKING MILK PLANT | — | DAFM dairy IE2115 |
| Greenfield Yogurts (registered as Jonathan Owens) | Monanimy, Killavullen, Mallow, Co | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2134 |
| Gubbeen Farmhouse Products Ltd | Gubbeen Schull Co Cork | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1819 |
| Hak Dairy Farms Ltd | Ballymacowen Clonakilty Co Cork | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2198 |
| Hegarty Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/hegarty-cheese |
| Irish Natural Yogurt | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/irish-natural-yogurt |
| JDS Foods Ltd. | JDS Foods Ltd Churchfield | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2139 |
| Kanturk Dairy (registered as North Cork Co-operative Creameries Ltd) | Dromalour Kanturk Co Cork | Lácteos y quesos | Bovine, DRINKING MILK PLANT | — | DAFM dairy IE1427 |
| Killowen Yogurt | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/killowen-yogurt |
| Lapland Farm (registered as Melvin and Heather Smith) | Lapland Farm Douglas Cork | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2220 |
| Leahy's Open Farm Ltd | Condonstown Dungourney Co Cork | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2148 |
| Lisavaird Co-operative Creamery Ltd | Lisavaird, Clonakilty, Co Cork | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1517 |
| Lullaby Milk (registered as Bainne Codladh Ltd) | Knockardrahan Kanturk Co Cork | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2143 |
| Macroom Buffalo Cheese Products Ltd. | Cloncud Kilnamartyra, Macroom, Co. | Lácteos y quesos | Buffalo, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/macroom-buffalo-cheese | — | DAFM dairy IE2009 |
| Milleens Cheese Ltd | Quinlan Steele, Milleens Cheese | Lácteos y quesos | Bovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/milleens-cheese | — | DAFM dairy IE1851 |
| Mitchelstown Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/mitchelstown-cheese |
| Moorepark Technology Ltd | Moorepark Teagasc Fermoy Co | Lácteos y quesos | Bovine, Caprine, Ovine, SMALL - MEDIUM | — | DAFM dairy IE1104 |
| Nutrition Supplies (registered as Nutrition Supplies & Services Ltd) | Killountain Innishannon Co Cork | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2165 |
| Old Head Milk (registered as Stephen McCarthy) | Ballymackean Old Head Kinsale | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2210 |
| Rostellan Dairy (registered as Joe Morrissey Ltd) | Knockanemorney Farm Rostellan Midleton | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2189 |
| Round Tower Cheese (registered as Michael O'Donovan) | Farranmareen Enniskeane Co Cork | Lácteos y quesos | n/a, SMALL - MEDIUM | — | DAFM dairy IE1845 |
| Ryans Farm Dairy Products | Ahaliskey Farm Ballinascarthy Clonakilty | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2222 |
| Sunview Goats (registered as Brian & Ann Bond) | Sunview Farm Terelton Macroom | Lácteos y quesos | Caprine, SMALL - MEDIUM | — | DAFM dairy IE2000 |
| The Frozen Churn (registered as Anne Barrett CMA Farm Partnership) | Liscubba Lyre Clonakilty Co | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2206 |
| The Good Dairy Company (registered as The Good Dairy Company Ltd) | Killowen Nohoval Kinsale Co. | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2175 |
| The Lost Valley Dairy & Creamery (registered as Michael Parle) | Carrignamuc, Inchigeelagh, Macroom, Co | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2153 |
| The Proper Dairy Company (registered as Coleville Dairy Company Ltd) | C/o Moorepark Technologies Ltd | Lácteos y quesos | Bovine, Ovine, Caprine, SMALL - MEDIUM | — | DAFM dairy IE2154 |
| Toons Bridge Dairy | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/toons-bridge-dairy |
| Toonsbridge Dairy LTD | Macroom Co Cork | Lácteos y quesos | Bovine, SMALL - MEDIUM; also OSM way/915559662 | toonsbridgedairy.com · +353 86 341 3601 · jenny@therealoliveco.com | DAFM dairy IE1967 |
| William Mc Sweeney | Bealick Macroom Co Cork | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2231 |
| Available for collection in Ballinrostig | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/available-for-collection-in-ballinrostig |
| Ballymaloe - The Garden Shop | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/ballymaloe-the-garden-shop |
| Barryroe Cooperative | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/barryroe-cooperative |
| BeeWild | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/beewild |
| Bessborough Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bessborough-farm |
| Bosca Beag | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bosca-beag |
| Bushbys Strawberries | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bushbys-strawberries |
| Camus Farm, Clonakilty, Co. Cork | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/camus-farm-clonakilty-co-cork |
| Cillian Ronayne, Co. Cork | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cillian-ronayne-co-cork |
| Dromahane | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dromahane |
| Finn's Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/finn-s-butchers |
| Glenbrook Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/glenbrook-farm |
| Horgan Meats | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/horgan-meats |
| Hurleys Bar | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/hurleys-bar |
| Irish Yogurts | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/irish-yogurts |
| Jim Crowley Craft Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/jim-crowley-craft-butchers |
| Joe’s Farm Crisps | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/joe-s-farm-crisps |
| Kildinan Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kildinan-farm |
| Killahora Orchards | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/killahora-orchards |
| Killavullen Farmers' Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/killavullen-farmers-market |
| Kinsale Mead Co | Kinsale | Otros | listed; also OSM node/6628533734 | www.kinsalemeadco.ie · +353 21 477 3538 | FarmFinder https://farmfinder.ie/producer/kinsale-mead-co |
| Lucey's 1880 | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lucey-s-1880 |
| McCarthy Meats | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mccarthy-meats |
| McCarthy's Of Kanturk | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mccarthy-s-of-kanturk |
| O'Crualaoi Butchers Ballincollig | — | Otros | listed; also OSM node/348903809; also OSM node/6358091008 | www.ocrualaoi.com · +353 21 439 9034 | FarmFinder https://farmfinder.ie/producer/o-crualaoi-butchers-ballincollig |
| O'Crualaoi Butchers Fermoy | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/o-crualaoi-butchers-fermoy |
| O'Crualaoi Butchers Wilton | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/o-crualaoi-butchers-wilton |
| O'Driscoll Victuallers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/o-driscoll-victuallers |
| O'Leary Family Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/o-leary-family-butchers |
| On The Pigs Back | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/on-the-pigs-back |
| Pike Deli | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/pike-deli |
| Rostellan Farm Shop | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rostellan-farm-shop |
| Scally Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/scally-butchers |
| Schull Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/schull-market |
| Sheehan Brothers Glanmire | Cork | Otros | listed; also OSM node/1597765014; also OSM node/2088704792 | +353 21 450 5075 | FarmFinder https://farmfinder.ie/producer/sheehan-brothers-glanmire |
| Sheehan Brothers Kanturk | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sheehan-brothers-kanturk |
| Sheehan Brothers Mallow | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sheehan-brothers-mallow |
| Sheehan Brothers St Luke Cross | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sheehan-brothers-st-luke-cross |
| The Good Food Shop, Co. Cork | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-good-food-shop-co-cork |
| Waterfall Farms | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/waterfall-farms |
| West Cork Sea Salt | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/west-cork-sea-salt |
| WestCork Biscuit Co | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/westcork-biscuit-co |
| Yellow Belly Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/yellow-belly-farm |
| Brendan McCarthy Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/brendan-mccarthy-bakery |
| Coolagh Bakes | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/coolagh-bakes |
| Diva Boutique Bakery | Ballinspittle | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory; also OSM node/6636792804 | www.divaboutiquebakery.com · +353 21 477 8465 | FarmFinder https://farmfinder.ie/producer/diva-boutique-bakery |
| Lough Hyne Cottage Bread | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/lough-hyne-cottage-bread |
| Silke Cropp Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/silke-cropp-bakery |
| Stauntons Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/stauntons-bakery |
| Wild Bakery | — | Pan y cereal | listed; also FarmFinder https://farmfinder.ie/producer/wild-flour-bakery-kinsale | — | FarmFinder https://farmfinder.ie/producer/wild-bakery |
| Wildflour Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/wildflour-bakery |
| Bantry Bay Mussels | — | Pescado | Producer; Origin Green Member, Seafood, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/bantry-bay-mussels |
| Stonewell Cider | — | Sidra | listed | — | FarmFinder https://farmfinder.ie/producer/stonewell-cider |

### Facility or shopfront only — 106 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| ABP Bandon (registered as Anglo Beef Processors Ireland UC T/A ABP Bandon) | Bandon | Carne | Slaughtering, Cutting only; national-scale brand | — | DAFM meat 351 |
| Barrett Butchers | Kinsale | Carne | shop=butcher | +353 21 4772 204 | OSM node/5282651636 |
| Bertie's Butchers | — | Carne | shop=butcher | — | OSM node/414031726 |
| Best Meats | Cork | Carne | shop=butcher | +353 21 427 0563 | OSM way/915559617 |
| Bresnan's | Cork | Carne | shop=butcher; also OSM way/915559646 | bresnans.ie | OSM node/12895153197 |
| Butcher's Block | Douglas | Carne | shop=butcher | — | OSM node/299400325 |
| Byrne's Butchers | — | Carne | shop=butcher | — | OSM node/12323555146 |
| Christopher & Trevor Collins | Castletownbere | Carne | Slaughtering only | — | DAFM meat 2457 |
| Coleman's Butchers | — | Carne | shop=butcher | — | OSM node/4765723762 |
| Collins Poultry (registered as Mary & Joe Collins T/A Collins Poultry) | Killeagh | Carne | Slaughtering only | — | DAFM meat 2888 |
| Collins' Butchers | Dunmanway | Carne | shop=butcher | — | OSM node/8655074552 |
| Cork Meats | — | Carne | shop=butcher | — | OSM node/6699371379 |
| Coughlan's Meats | Cork | Carne | shop=butcher | www.coughlanmeats.com · +353 21 427 2068 · alan@coughlanmeats.com | OSM way/915559663 |
| Cronin Family Butchers | Kanturk | Carne | Slaughtering only | — | DAFM meat 2634 |
| Dan Moloney's Meat Centre | Bandon | Carne | shop=butcher; also OSM way/915559653 | www.moloneys.ie · +353 23 884 4206 | OSM node/6377683079 |
| Dawn Charleville (registered as Dawn Meats Ireland UC T/A Dawn Charleville) | Charleville | Carne | Slaughtering, Cutting only | — | DAFM meat 368 |
| Edmond Clifford | Castlemartyr | Carne | Slaughtering only; also OSM node/2752166307 | — | DAFM meat 2468 |
| Feoil O'Croistoir Teoranta | Balincollig | Carne | Slaughtering, Cutting only | — | DAFM meat 2392 |
| Finn's | Mitchelstown | Carne | shop=butcher | — | OSM node/9949700554 |
| Frank Nolan | — | Carne | shop=butcher | — | OSM node/7280664725 |
| Hanley's Butchers (registered as Timy Considene T/A Hanley's Butchers) | Mitchelstown | Carne | Slaughtering only | — | DAFM meat 2628 |
| Hillbilly's Distribution LTD | Cork | Carne | Cutting only | — | DAFM meat 3031 |
| Ibane Meats LTD | Bandon | Carne | Slaughtering, Cutting only | — | DAFM meat 2453 |
| Jim Crowleys Butcher | — | Carne | shop=butcher | — | OSM node/5822949446 |
| John Buckley Butcher | — | Carne | shop=butcher | — | OSM node/4022485687 |
| John McCarthy | Drimoleague | Carne | Slaughtering, Cutting only | — | DAFM meat 2455 |
| John O'Brien | Killeagh | Carne | shop=butcher | — | OSM node/767267505 |
| John O'Donovan | Dunmanway | Carne | shop=butcher | — | OSM node/6539386993 |
| Kathleen Noonan | Cork | Carne | shop=butcher | +353 87 297 1895 · majellamul@hotmail.co.uk | OSM way/915559657 |
| Kepak Cork | Watergrasshill | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; national-scale brand | — | DAFM meat 329 |
| Malachy O'Sullivan | Charleville | Carne | Slaughtering only | — | DAFM meat 3017 |
| Michael Spillane | Fermoy | Carne | Slaughtering only; also OSM node/6699371374 | — | DAFM meat 2566 |
| Moynihan's Poultry | Cork | Carne | shop=butcher | +353 21 427 2614 · noel@shannonvalefoods.ie | OSM relation/18937461 |
| Nolan's | Kilcullen | Carne | shop=butcher | — | OSM node/4977180515 |
| Nugent's | — | Carne | shop=butcher | — | OSM node/1572838639 |
| O'Callaghan's Butchers | — | Carne | shop=butcher | — | OSM node/13983759487 |
| O'Mahony Family Butchers | Cork | Carne | shop=butcher | www.omahonysbutchers.com · +353 21 427 0254 · info@omahonysbutchers.com | OSM way/915559615 |
| O'Sullivan's Poultry | Cork | Carne | shop=butcher | +353 21 427 6514 · corkpoultryandgame@gmail.com | OSM way/915559639 |
| Paddy Hegarty | — | Carne | shop=butcher | — | OSM node/1591455622 |
| Sean Twomey Butcher | — | Carne | shop=butcher | — | OSM node/9115308165 |
| Sheehans | — | Carne | shop=butcher | — | OSM node/6946307022 |
| Siopa Búistéara | — | Carne | shop=butcher | — | OSM node/7087593175 |
| The Butcher's Court | — | Carne | shop=butcher | — | OSM node/9528186920 |
| The Cork Meat Company | Ballincollig | Carne | shop=butcher | www.corkmeatcompany.ie · +353 21 487 5304 | OSM node/7159631655 |
| The Village Butcher | — | Carne | shop=butcher | — | OSM node/3338034889 |
| Tom Bradley Bacon & Pork | Cork | Carne | shop=butcher | — | OSM way/915559640 |
| Vincent Osborne | — | Carne | shop=butcher | — | OSM node/9975264493 |
| Walsh's Butcher's | — | Carne | shop=butcher | — | OSM node/8758840048 |
| William Walsh (Walsh's Victuallers) | Skibbereen | Carne | Slaughtering only | — | DAFM meat 2461 |
| Blarney Chocolate Factory | — | Chocolate | shop=chocolate | — | OSM node/4864905437 |
| Cocoa Chocolate Boutique | Cork | Chocolate | shop=chocolate | — | OSM node/13428727200 |
| Koko Kinsale | Kinsale | Chocolate | shop=chocolate | www.kokokinsale.com · +353 86 781 5591 | OSM node/7380807024 |
| The Chocolate Shop | Cork | Chocolate | shop=chocolate | www.chocolate.ie · +353 21 425 4448 | OSM way/915559638 |
| Aunty Nellies Gift Emporium | Cork | Dulces y repostería | shop=confectionery | www.auntynellies.ie · +353 21 494 9828 | OSM node/5022642188 |
| Candy Rock Lane | — | Dulces y repostería | shop=confectionery | — | OSM node/13137317109 |
| Sweet Heart | — | Dulces y repostería | shop=confectionery | — | OSM node/12941766594 |
| Sweet Spot | — | Dulces y repostería | shop=confectionery | — | OSM node/13950645500 |
| Torten | — | Dulces y repostería | shop=confectionery | — | OSM node/6699299222 |
| Dairygold Food Ingredients Ltd | Clonmel Rd Mitchelstown Co | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING); national-scale brand | — | DAFM dairy IE1503 |
| Basil | Cork | Otros | shop=deli | — | OSM way/793862713 |
| Bradleys | Cork | Otros | shop=deli | www.bradleysofflicence.ie · +353 21 4270845 · bradleyscork@gmail.com | OSM node/7228354885 |
| Corrib Deli | — | Otros | shop=deli | — | OSM node/12943323959 |
| Delitaly | Cork | Otros | shop=deli | fipy.me/delitaly-911155-ie · +353 86 392 1696 | OSM node/12729544059 |
| Gourmet Pantry | Kinsale | Otros | shop=deli | www.gourmetpantry.ie · +353 21 470 9215 | OSM node/6224747894 |
| Iago | — | Otros | shop=deli | www.iago.ie · +353 21 427 7047 | OSM node/4595900465 |
| James Lynch LTD | — | Otros | shop=farm | — | OSM node/4022463721 |
| Mirabelles | Dunmanway | Otros | shop=deli | — | OSM node/8625586645 |
| Mr. Bells | Cork | Otros | shop=deli | mrbells.ie · +353 21 431 8655 · mrbellfood@hotmail.com | OSM way/915559660 |
| My Goodness | Cork | Otros | shop=deli | www.mygoodnessfood.com · +353 87 935 6652 · mygoodnesscork@gmail.com | OSM way/915559634 |
| Pop Crowley’s | Macroom | Otros | shop=deli | — | OSM node/12641054238 |
| Sam's | — | Otros | shop=deli | — | OSM node/8975363776 |
| Sonny's Deli | — | Otros | shop=deli | — | OSM way/795006814 |
| The Cinnamon Cottage | Rochestown | Otros | shop=deli | cinnamoncottage.ie · +353 21 489 4922 · thecinnamoncottage@gmail.com | OSM node/5088220665 |
| The Real Olive Company | Cork | Otros | shop=deli | www.therealoliveco.com · realolivecork@gmail.com | OSM way/915559661 |
| The Roughty Foodie | Cork | Otros | shop=deli | +353 21 241 7063 · margoannmurphy@yahoo.ie | OSM way/915559656 |
| The Supper Club | Kinsale | Otros | shop=deli | thesupperclub.ie · +353 21 470 9233 · thesupperclubkinsale@gmail.com | OSM node/5028578323 |
| The Trawl Door | — | Otros | shop=deli | +353 86 872 5117 | OSM node/9759283609 |
| Bracken's Bakery | — | Pan y cereal | shop=bakery | — | OSM node/6094205084 |
| Brudairs | — | Pan y cereal | shop=bakery | — | OSM node/1617879096 |
| Cameron Bakery | — | Pan y cereal | shop=bakery | www.cameronbakery.com · +353 21 241 3977 · cameronbakery@gmail.com | OSM node/6196444287 |
| Chamberlain's | — | Pan y cereal | shop=bakery | — | OSM node/5816075535 |
| Cupcake Cottage | — | Pan y cereal | shop=bakery | — | OSM node/4437917092 |
| Cupcakes by Katie | — | Pan y cereal | shop=bakery | +353 87 235 9046 | OSM node/6052834689 |
| Hassets | — | Pan y cereal | shop=bakery | — | OSM node/12536841217 |
| Heaven's Cakes | Bandon | Pan y cereal | shop=bakery | — | OSM node/3906203258 |
| Lynch's Aran na hÉireann | — | Pan y cereal | shop=bakery | — | OSM node/13926668832 |
| Lynch's Bakery and Confectionery | — | Pan y cereal | shop=bakery | — | OSM node/5816298223 |
| Messy Buns | — | Pan y cereal | shop=bakery | — | OSM node/10082146557 |
| MPH Foods | — | Pan y cereal | shop=bakery | — | OSM node/13926668833 |
| Pana Bread | Ballincollig | Pan y cereal | shop=bakery | — | OSM node/1015275691 |
| Rojo Bakery & Deli | — | Pan y cereal | shop=bakery | — | OSM node/13592547357 |
| Seeds Bakery | Kinsale | Pan y cereal | shop=bakery | — | OSM node/11553907421 |
| The Alternative Bread Company | Cork | Pan y cereal | shop=bakery | +353 21 425 1347 · natbread.abc@gmail.com | OSM way/915559658 |
| The Baking Emporium | — | Pan y cereal | shop=bakery | — | OSM node/11127261006 |
| The Grumpy Bakers | — | Pan y cereal | shop=bakery | www.thegrumpybakers.ie · +353 86 107 1393 | OSM node/12539294502 |
| The Menu Cakery | Halfway | Pan y cereal | shop=bakery | themenucakery.com · +353 87 414 8020 | OSM node/13609763271 |
| The Natural Foods Bakery Blackrock | Cork | Pan y cereal | shop=bakery | www.thenaturalfoodsbakery.com · +353 21 461 4555 | OSM way/593521751 |
| The Stuffed Olive | Bantry | Pan y cereal | shop=bakery | thestuffedolive.wordpress.com · +353 27 55883 · thestuffedolive@gmail.com | OSM node/3080325234 |
| Ballycotton Seafood Ltd | Garryvoe | Pescado | shop=seafood; also OSM way/915559671 | www.ballycottonseafood.ie · +353 21 427 2093 · info@ballycottonseafood.ie | OSM node/2753231727 |
| Belvelly Smoked Salmon | — | Pescado | shop=seafood | www.frankhederman.com · +353 21 481 1089 · shipping@frankhederman.com | OSM way/512070981 |
| Clancy's Fresh Fish | Macroom | Pescado | shop=seafood | +353 26 43570 | OSM node/11564421206 |
| Glenmar Shellfish | Union Hall | Pescado | shop=seafood | — | OSM node/1338611178 |
| Hederman's Smoke House | Cork | Pescado | shop=seafood | www.frankhederman.com · +353 21 481 1089 · shipping@frankhederman.com | OSM way/915559620 |
| K. O'Connell Fishmongers | Cork | Pescado | shop=seafood | +353 21 427 6380 · freshfish@eircom.net | OSM way/1374182957 |
| MoonFish | Fermoy | Pescado | shop=seafood | moonfish.ie | OSM node/2277800332 |
| The Good Fish Co | Kinsale | Pescado | shop=seafood | www.goodfish.ie · +353 21 477 7443 | OSM node/5282651632 |
## Cork-specific leads (2026-08-11)

- Gubbeen Farmhouse Products: `gubbeen.com` resolves (A records present) but
  returns HTTP 404 on `/` and on `www`. A 404 on the root is not a dead
  business; find the live producer source before admitting or rejecting.
- Imokilly Regato (PDO) and Timoleague Brown Pudding (PGI) are registered Irish
  protected names attached to this county. The register names the product and
  its area, never the current maker, so each needs its producer identified
  independently.

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
| 9 White Deer Brewery | Killeen, Ballyvourney | 9whitedeer.ie |
| Blacks Kinsale Craft Brewery | Knocknabohilly, Kinsale | blacksbrewery.com |
| Clonakilty Brewing Company | — | facebook.com/Clonakiltybrew |
| Cotton Ball Brewing Co | — | cottonball.ie |
| Eight Degrees Brewing | — | eightdegrees.ie |
| Elbow Lane Brewhouse | — | elbowlane.ie |
| Rising Sons Brewery | — | risingsonsbrewery.com |
| West Cork Brewing Company | — | westcorkbrewingco.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
