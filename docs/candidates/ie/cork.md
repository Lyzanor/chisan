# Cork — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/cork.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/cork>, plus each producer
  page for its structured website, coordinates and upstream source.
- Midlands Food & Drink Directory,
  <https://www.midlandsireland.ie/food-and-drink-directory/> (Laois, Longford,
  Offaly and Westmeath only).
- OpenStreetMap food-production and food-shop tags via Overpass.

Every website below was resolved and probed on 2026-08-11: a URL that returned
NXDOMAIN, was unreachable, or was a mangled address such as
`http://info@example.ie` has been removed rather than carried, because a
directory keeps publishing a link long after the domain lapses. A 403 is recorded
as alive, not dead.

Ceilings. A register approval proves the establishment is registered for that
activity at that address on the published date — not a current own-brand offer,
a public contact, remote ordering, or that it sells to the public. FarmFinder's
structured fields (website, coordinates, the upstream directory it cites) are
usable, but its prose is auto-generated and must never be copied into
`descripcion`. The Midlands directory is self-submitted. An OSM tag proves only
what a mapper recorded. Every entry here is still a `hold`.

`Municipio?` is a candidate, not a decision: where the source gave no town it is
the nearest settlement to the published coordinates, with the distance shown.
Confirm it against the producer's own address before it enters a CSV.

Category is the register activity or tag mapped onto the shared registry — a
starting guess. A trailing `?` means it was inferred from the trade name or the
domain because the source stated none.

A `⚠` on a website means the domain shares no word with the trade name. That is
often legitimate — Drioglann Loch Measc trades as Lough Mask Distillery, Con Traas
as The Apple Farm — but it is also what a parent company, a stockist or a
mis-scrape looks like, so check it before copying the URL into `web`.

Removed in this pass as out of scope: national-scale brands, hospitality
(cafés, restaurants, pubs), retail and forecourt names, resale-only shop tags
(delicatessen, confectioner, cheesemonger), abattoir or cutting-plant approvals
with no own offer and no directory backing, and bare OSM nodes carrying no
website, phone or email to verify against.

## Ready to verify — 44

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Bresnan's | Cork | Carne | bresnans.ie | — | 51.8776096, -8.4377473 | OSM node/12895153197 |
| Clonakilty Black Pudding | Clonakilty (nearest, 1.8 km) | Carne | www.clonakiltyblackpudding.ie/visitor-centre | (023) 883 4835 | 51.60863, -8.884067 | [FarmFinder](https://farmfinder.ie/producer/clonakilty-black-pudding); via SuperValu Food Academy |
| Coughlan's Meats | Cork | Carne | www.coughlanmeats.com | +353 21 427 2068 · alan@coughlanmeats.com | 51.8976617, -8.4744097 | OSM way/915559663 |
| D.P Murphy & Sons | Midleton (nearest, 2.1 km) | Carne | www.patrickmurphyandsons.ie | (021) 431 7317 | 51.927465, -8.172469 | [FarmFinder](https://farmfinder.ie/producer/d-p-murphy-and-sons); via Associated Craft Butchers of Ireland |
| Dan Moloney's Butchers | Bandon (nearest, 1.2 km) | Carne | danmoloneys.ie | (023) 884 4206 | 51.74618, -8.725461 | [FarmFinder](https://farmfinder.ie/producer/dan-moloney-s-butchers); via Associated Craft Butchers of Ireland |
| Davidson's Craft Butchers | Whitechurch (nearest, 3.8 km) | Carne | davidsonscraftbutchers.com | (021) 451 8184 | 51.9477, -8.525134 | [FarmFinder](https://farmfinder.ie/producer/davidson-s-craft-butchers); via Associated Craft Butchers of Ireland |
| Durcan Meats | Cork | Carne | www.tomdurcanmeats.ie | +353 21 427 9141 · info@tomdurcanmeats.ie | 51.895579, -8.480421 | [FarmFinder](https://farmfinder.ie/producer/durcan-meats); via Associated Craft Butchers of Ireland |
| Feoil O' Criostoir | Ballincollig (nearest, 0.9 km) | Carne | www.foc.ie ⚠ | (021) 487 5533 | 51.886894, -8.57506 | [FarmFinder](https://farmfinder.ie/producer/feoil-o-criostoir); via Associated Craft Butchers of Ireland |
| Horgan Meats | Kilbeheny (nearest, 2.4 km) | Carne ? | www.horgans.com | (025) 41200 | 52.273883, -8.2130044 | [FarmFinder](https://farmfinder.ie/producer/horgan-meats); via SuperValu Food Academy |
| Jim Crowley Craft Butchers | Midleton Abbey (nearest, 0.4 km) | Carne ? | www.jimcrowleybutchers.com | 021 4613542 | 51.907356, -8.166078 | [FarmFinder](https://farmfinder.ie/producer/jim-crowley-craft-butchers); via Irish Butchers Guild |
| McCarthy Meats | Wilton (nearest, 0.6 km) | Carne ? | mccarthysmeatmarket.ie | (021) 434 6218 | 51.8796067, -8.5166631 | [FarmFinder](https://farmfinder.ie/producer/mccarthy-meats); via SuperValu Food Academy |
| O'Crualaoi Butchers Ballincollig | Ballincollig (nearest, 0.8 km) | Carne ? | www.ocrualaoi.com | +353 21 439 9034 | 51.883085, -8.578344 | [FarmFinder](https://farmfinder.ie/producer/o-crualaoi-butchers-ballincollig); via Irish Butchers Guild |
| O'Crualaoi Butchers Fermoy | Fermoy (nearest, 1.9 km) | Carne ? | www.ocrualaoi.com | 025 49100 | 52.124976, -8.276551 | [FarmFinder](https://farmfinder.ie/producer/o-crualaoi-butchers-fermoy); via Irish Butchers Guild |
| O'Crualaoi Butchers Wilton | Knockraha (nearest, 4.4 km) | Carne ? | www.ocrualaoi.com | 021 4343003 | 51.978253, -8.396225 | [FarmFinder](https://farmfinder.ie/producer/o-crualaoi-butchers-wilton); via Irish Butchers Guild |
| O'Mahony Family Butchers | Cork | Carne | www.omahonysbutchers.com | +353 21 427 0254 · info@omahonysbutchers.com | 51.8975737, -8.4747974 | OSM way/915559615 |
| Blarney Brewing Company | Cork | Cerveza | www.blarneybrewing.ie | sales@blarneybrewing.ie | 51.9179004, -8.4755764 | OSM node/13371533172 |
| Original 7 | Cork | Cerveza | www.original7.ie | hey@original7.ie | 51.9012167, -8.4820193 | OSM node/11010844910 |
| Koko Kinsale | Kinsale | Chocolate | www.kokokinsale.com | +353 86 781 5591 | 51.7050804, -8.522173 | OSM node/7380807024 |
| The Chocolate Shop | Cork | Chocolate | www.chocolate.ie | +353 21 425 4448 | 51.8979107, -8.4740632 | OSM way/915559638 |
| Clonakilty Distillery | Clonakilty | Destilados y licores | www.clonakiltydistillery.ie | +353 23 884 0635 | 51.6214545, -8.88618 | OSM way/60709213 |
| Lee Valley Eggs | Millstreet (nearest, 1.9 km) | Huevos | leevalleyireland.com | (026) 49170 | 52.0452349, -9.0734329 | [FarmFinder](https://farmfinder.ie/producer/lee-valley-eggs); via SuperValu Food Academy |
| West Cork Eggs | Shandon (nearest, 1.1 km) | Huevos | www.skeaghanore.ie ⚠ | (028) 37428 | 51.908883, -8.487831 | [FarmFinder](https://farmfinder.ie/producer/west-cork-eggs); via SuperValu Food Academy |
| Hegarty Cheese | Ballintemple (nearest, 1 km) | Lácteos y quesos | www.hegartycheese.ie | 089 471 5020 | 51.8939942, -8.4200939 | [FarmFinder](https://farmfinder.ie/producer/hegarty-cheese); via SuperValu Food Academy |
| Irish Natural Yogurt | Clonakilty (nearest, 1.2 km) | Lácteos y quesos | www.irish-yogurts.ie | (023) 883 4745 | 51.6196465, -8.9088265 | [FarmFinder](https://farmfinder.ie/producer/irish-natural-yogurt); via SuperValu Food Academy |
| Killowen Yogurt | Carrignavar (nearest, 1.9 km) | Lácteos y quesos | killowen.ie | (053) 924 4819 | 51.973493, -8.462931 | [FarmFinder](https://farmfinder.ie/producer/killowen-yogurt); via SuperValu Food Academy |
| Kinsale Mead Co | Kinsale | Miel ? | www.kinsalemeadco.ie | +353 21 477 3538 | — | [FarmFinder](https://farmfinder.ie/producer/kinsale-mead-co) |
| Barryroe Cooperative | Blackpool (nearest, 2.3 km) | Otros | www.barryroeco-op.ie | (023) 884 0000 | 51.934858, -8.471157 | [FarmFinder](https://farmfinder.ie/producer/barryroe-cooperative); via SuperValu Food Academy |
| Irish Yogurts | Mahon (nearest, 0.7 km) | Otros | www.irish-yogurts.ie | (023) 883 4745 | 51.894434, -8.400869 | [FarmFinder](https://farmfinder.ie/producer/irish-yogurts); via SuperValu Food Academy |
| McCarthy's Of Kanturk | Whitechurch (nearest, 2.3 km) | Otros | www.mccarthysofkanturk.ie | — | 51.960946, -8.516206 | [FarmFinder](https://farmfinder.ie/producer/mccarthy-s-of-kanturk); via Associated Craft Butchers of Ireland |
| Sheehan Brothers Glanmire | Cork | Otros | sheehanbrothersbutchers.com | +353 21 450 5075 | 51.916368, -8.397643 | [FarmFinder](https://farmfinder.ie/producer/sheehan-brothers-glanmire); via Associated Craft Butchers of Ireland |
| Sheehan Brothers St Luke Cross | Metropolitan Cork (nearest, 0.5 km) | Otros | sheehanbrothersbutchers.com | (021) 450 5075 | 51.903402, -8.462432 | [FarmFinder](https://farmfinder.ie/producer/sheehan-brothers-st-luke-cross); via Associated Craft Butchers of Ireland |
| West Cork Sea Salt | South Parish (nearest, 0.7 km) | Otros | www.westcorkseasalt.ie | — | 51.896207, -8.4823 | [FarmFinder](https://farmfinder.ie/producer/west-cork-sea-salt); via Food Culture Ireland |
| Cameron Bakery | Cork (nearest, 0.6 km) | Pan y cereal | www.cameronbakery.com | +353 21 241 3977 · cameronbakery@gmail.com | 51.8975276, -8.4802573 | OSM node/6196444287 |
| Diva Boutique Bakery | Ballinspittle | Pan y cereal | www.divaboutiquebakery.com | +353 21 477 8465 | — | [FarmFinder](https://farmfinder.ie/producer/diva-boutique-bakery) |
| The Grumpy Bakers | Cork (nearest, 0.3 km) | Pan y cereal | www.thegrumpybakers.ie | +353 86 107 1393 | 51.8978587, -8.4756481 | OSM node/12539294502 |
| The Menu Cakery | Halfway | Pan y cereal | themenucakery.com | +353 87 414 8020 | 51.8046718, -8.5699016 | OSM node/13609763271 |
| The Natural Foods Bakery Blackrock | Cork | Pan y cereal | www.thenaturalfoodsbakery.com | +353 21 461 4555 | 51.8973959, -8.413391 | OSM way/593521751 |
| The Stuffed Olive | Bantry | Pan y cereal | thestuffedolive.wordpress.com | +353 27 55883 · thestuffedolive@gmail.com | 51.6790992, -9.4502889 | OSM node/3080325234 |
| Ballycotton Seafood Ltd | Garryvoe | Pescado | www.ballycottonseafood.ie | +353 21 427 2093 · info@ballycottonseafood.ie | 51.871511, -8.01885 | OSM node/2753231727 |
| Belvelly Smoked Salmon | Belvelly (nearest, 0.7 km) | Pescado | www.frankhederman.com ⚠ | +353 21 481 1089 · shipping@frankhederman.com | 51.8850996, -8.3101924 | OSM way/512070981 |
| Hederman's Smoke House | Cork | Pescado | www.frankhederman.com | +353 21 481 1089 · shipping@frankhederman.com | 51.897592, -8.4742214 | OSM way/915559620 |
| MoonFish | Fermoy | Pescado | moonfish.ie | — | 52.1375458, -8.2756923 | OSM node/2277800332 |
| The Good Fish Co | Kinsale | Pescado | www.goodfish.ie | +353 21 477 7443 | 51.7061219, -8.5247337 | OSM node/5282651632 |
| Killahora Orchards | Montenotte (nearest, 0.2 km) | Sidra ? | killahoraorchards.ie/?utm_source=google&utm_medium=organic&utm_campaign=gbp | 086 171 3763 | 51.907423, -8.440655 | [FarmFinder](https://farmfinder.ie/producer/killahora-orchards); via SuperValu Food Academy |

## Needs one more fact — 107

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| A. O'Reilly & Sons (registered as Donagh O'Reilly, T/A A. O'Reilly & Sons) | Youghal | Carne | — | +353 21 427 0925 · donagh.aoreilly@gmail.com | — | DAFM meat 2394 |
| Ballineen Fine Foods Ltd | Bandon | Carne | — | — | — | DAFM meat 792 |
| Ballyburden Meat Processors LTD | Ballincollig | Carne | — | — | — | DAFM meat 2366 |
| C.L. Meats Ltd | Kinsale Rd | Carne | — | — | — | DAFM meat 2538 |
| Caherbeg Free Range Pork Ltd | Rosscarbery | Carne | — | — | — | DAFM meat 2303 |
| Castleview Meats Ltd | Macroom | Carne | — | — | — | DAFM meat 2321 |
| Clifford's Craft Butchers & Foodstore | Waterfall (nearest, 2.4 km) | Carne | — | (021) 466 7336 | 51.855318, -8.520365 | [FarmFinder](https://farmfinder.ie/producer/clifford-s-craft-butchers-and-foodstore); via Associated Craft Butchers of Ireland |
| Clonakilty Food Company UC | Western Rd., Clonakilty | Carne | — | — | — | DAFM meat 780 |
| Cormac O'Connor (Pork & Bacon) Ltd | Mayfield | Carne | — | — | — | DAFM meat 2949 |
| Daniel P Murphy | Midleton | Carne | — | — | — | DAFM meat 2528 |
| Days of Whitegate | Ballygarvan (nearest, 1.4 km) | Carne | — | (021) 466 1223 | 51.834009, -8.486632 | [FarmFinder](https://farmfinder.ie/producer/days-of-whitegate); via Associated Craft Butchers of Ireland |
| Dromscarra Poultry | Kiskeam (nearest, 2.4 km) | Carne | — | — | 52.166704278925366, -9.125109700524936 | [FarmFinder](https://farmfinder.ie/producer/dromscarra-poultry); via yourhonestybox.com |
| Feoil Na Fleisce Teoranta | Baile Mhuirne | Carne | — | — | — | DAFM meat 2318 |
| Fermoy Meat (registered as Andrius Kralikas T/A Fermoy Meat) | Fermoy | Carne | — | — | — | DAFM meat 2897 |
| Finn's Butchers | Sunday's Well (nearest, 0.7 km) | Carne ? | — | (025) 24138 | 51.90001, -8.489082 | [FarmFinder](https://farmfinder.ie/producer/finn-s-butchers); via Associated Craft Butchers of Ireland |
| Fitzgerald Butchers (registered as Bary Fitzgerald Butchers Ltd T/A Fitzgerald Butchers) | Fermoy | Carne | — | — | — | DAFM meat 2469 |
| Green Saffron Spices Limited | Unit 5 | Carne | — | — | — | FSAI HSE 4045 |
| Gubbeen Farm House Products LTD | Schull | Carne | — | — | — | DAFM meat 2317 |
| Hanley's Puddings LTD | Mitchelstown | Carne | — | — | — | DAFM meat 2320 |
| Hodgins Sausages LTD | Mitchelstown | Carne | — | — | — | DAFM meat 2305 |
| Irish Bacon Slicers Ltd | Ballincollig | Carne | — | — | — | DAFM meat 560 |
| Jerry Nolan Meat Wholesalers LTD | Fairhill | Carne | — | — | — | DAFM meat 2701 |
| Kinsale Bay Food Company Ltd | CHR Hansen BuildingRohan Industrial Esta | Carne | — | — | — | FSAI HSE 4048 |
| La Charcuterie Irlandaise LTD | Douglas | Carne | — | — | — | DAFM meat 2864 |
| McCarthy's Meat Market (registered as Foxbrook Foods LTD T/A McCarthy's Meat Market) | Wilton | Carne | — | — | — | DAFM meat 3014 |
| MI J. O'Neill | Clonakilty | Carne | — | — | — | DAFM meat 2459 |
| Michael Twomey Butchers LTD | Macroom | Carne | — | — | — | DAFM meat 2669 |
| O'Farrell Meats Ltd | Midleton | Carne | — | — | — | DAFM meat 2011 |
| O'Flynn Foods LTD | Wilton | Carne | — | — | — | DAFM meat 2917 |
| O'Leary Family Butchers | Mahon (nearest, 3.3 km) | Carne ? | — | (029) 70146 | 51.860932, -8.406278 | [FarmFinder](https://farmfinder.ie/producer/o-leary-family-butchers); via Associated Craft Butchers of Ireland |
| Paddy O'Donoghue | Bantry | Carne | — | — | — | DAFM meat 2452 |
| Putog Teoranta | Cork | Carne | — | — | — | DAFM meat 2798 |
| Quigley Meats LTD | Ballincollig | Carne | — | — | — | DAFM meat 2518 |
| Sage 2 Go Ltd | Production KitchenUnit B Dosco Industria | Carne | — | — | — | FSAI HSE 4104 |
| Scally Butchers | Clonakilty (nearest, 0.7 km) | Carne ? | — | — | 51.6241868, -8.8825973 | [FarmFinder](https://farmfinder.ie/producer/scally-butchers); via SuperValu Food Academy |
| Secret Recipe Ltd | Ballincollig | Carne | — | — | — | DAFM meat 2840 |
| Shannon Vale Foods | Clonakilty | Carne | — | — | — | DAFM meat 814 |
| Skeaghanore Duck (registered as Eugene & Helena Hickey T/A Skeaghanore Duck) | Skeaghanore | Carne | — | — | — | DAFM meat 2894 |
| Staunton Foods Ltd. | Timoleague | Carne | — | — | — | DAFM meat 380 |
| The Chicken Inn | Ballyvolane | Carne | — | — | — | DAFM meat 2948 |
| Tim Murphy | Bantry | Carne | — | — | — | DAFM meat 2456 |
| Ummera Smoke Products LTD (registered as Ummera Smoke House LTD T/A Ummera Smoke Products LTD) | Timoleague | Carne | — | — | — | DAFM meat 2316 |
| Munster Brewery | Youghal (nearest, 1.6 km) | Cerveza | — | — | 51.9530456, -7.8694208 | OSM node/8639889131 |
| Nine White Deer | Baile Mhic Íre | Cerveza | — | — | 51.9364065, -9.1465026 | OSM node/13926668831 |
| Páirc Gnó Bhaile Mhic Íre | Ballymakeera | Cerveza | — | — | 51.93625, -9.1465469 | OSM way/691209721 |
| Jameson Distillery Midleton | Midleton Abbey (nearest, 0.6 km) | Destilados y licores | — | — | 51.9138187, -8.1683088 | OSM node/395572119 |
| West Cork Distillers | Skibbereen (nearest, 1 km) | Destilados y licores | — | — | 51.5574207, -9.2685177 | OSM way/192275347 |
| Dooley's | Rathcormack | Dulces y repostería | — | — | 52.0775091, -8.2822782 | OSM way/400792978 |
| Bushbys Strawberries | Kilmeen and Rossmore (nearest, 3.7 km) | Fruta y verdura ? | — | — | 51.65280272695478, -9.025389453812231 | [FarmFinder](https://farmfinder.ie/producer/bushbys-strawberries); via yourhonestybox.com |
| Healy’s Home Grown Veg | Kilmichael (nearest, 3 km) | Fruta y verdura | — | — | 51.823450087071464, -9.044413907274295 | [FarmFinder](https://farmfinder.ie/producer/healy-s-home-grown-veg); via yourhonestybox.com |
| Free Range Eggs | Aherla (nearest, 2 km) | Huevos | — | — | 51.84003287937233, -8.732549681807647 | [FarmFinder](https://farmfinder.ie/producer/free-range-eggs); via yourhonestybox.com |
| Anabio Technologies Ltd | IDA Business Park, Carrigtwohill, | Lácteos y quesos | — | — | — | DAFM dairy IE2127 |
| Ardsallagh Goat Products  Ltd | Ardsallagh Farm Woodstock Carrigtohill | Lácteos y quesos | — | — | — | DAFM dairy IE1872 |
| Ballinrostig Organic Cheese | Mayfield (nearest, 4.3 km) | Lácteos y quesos | — | — | 51.951262, -8.444228 | [FarmFinder](https://farmfinder.ie/producer/ballinrostig-organic-cheese); via Irish Organic Association |
| Ballymaloe Cookery School (registered as Ballymaloe Cookery School Ltd) | Shanagarry Co Cork P25 | Lácteos y quesos | — | — | — | DAFM dairy IE2158 |
| Beechers Handmade Cheese | Bishopstown (nearest, 1.7 km) | Lácteos y quesos | — | (026) 41907 | 51.891638, -8.537863 | [FarmFinder](https://farmfinder.ie/producer/beechers-handmade-cheese); via SuperValu Food Academy |
| Bluebell Falls Ltd | Ballinakill East Newtownshandrum Charleville | Lácteos y quesos | — | — | — | DAFM dairy IE1984 |
| Bo Rua Farm (registered as Norma Dinneen Limited) | Bó Rua Farm Ballyknock | Lácteos y quesos | — | — | — | DAFM dairy IE2133 |
| Carrigaline Farmhouse Cheese Ltd | The Rock Carrigaline Co | Lácteos y quesos | — | — | — | DAFM dairy IE1846 |
| Cléire Goats (registered as Ed & Duncan Harper) | Cape Clear Island Skibbereen | Lácteos y quesos | — | — | — | DAFM dairy IE1007 |
| Clona Dairy Products Ltd | Sand Quay Clonakilty Co | Lácteos y quesos | — | — | — | DAFM dairy IE1431 |
| Coastal Trading & Consulting Ltd. | Costal Lodge Garryvoe Ladysbridge | Lácteos y quesos | — | — | — | DAFM dairy IE1914 |
| Coolea Farmhouse Cheese Ltd (Cais Cuil Aodha Teo) | Milleens Coolea Macroom Co. | Lácteos y quesos | — | — | — | DAFM dairy IE1856 |
| Coolmore Farmhouse Ltd | The Forge The Old | Lácteos y quesos | — | — | — | DAFM dairy IE2204 |
| Cybercolours Ltd | National Food Innovation Hub, | Lácteos y quesos | — | — | — | DAFM dairy 1724 |
| Dairy Concepts IRL (registered as Poldertron Ltd) | c/o Moorepark Technology Ltd | Lácteos y quesos | — | — | — | DAFM dairy IE2126 |
| Dan Hegary Cheese (registered as Dan Hegarty) | Church Rd Whitechurch Co | Lácteos y quesos | — | — | — | DAFM dairy IE1902 |
| Desmond Cheese | Ballyphehane (nearest, 0.4 km) | Lácteos y quesos | — | 086 210 5267 | 51.886273, -8.480876 | [FarmFinder](https://farmfinder.ie/producer/desmond-cheese); via SuperValu Food Academy |
| Durrus Cheese Ltd | Coomkeen Durrus Bantry Co | Lácteos y quesos | — | — | — | DAFM dairy IE1802 |
| Fermoy Natural Cheese | Fermoy (nearest, 1.7 km) | Lácteos y quesos | — | (025) 31310 | 52.12739, -8.28536 | [FarmFinder](https://farmfinder.ie/producer/fermoy-natural-cheese); via SuperValu Food Academy |
| Galvins Farms Fresh Milk Ltd | Clashavanna, Kilbrittain, Bandon, Co. | Lácteos y quesos | — | — | — | DAFM dairy IE2164EC |
| Gloun Cross Dairy (registered as Elizabeth O'Donovan) | Gloun North Dunmanway Co. | Lácteos y quesos | — | — | — | DAFM dairy IE2115 |
| Greenfield Yogurts (registered as Jonathan Owens) | Monanimy, Killavullen, Mallow, Co | Lácteos y quesos | — | — | — | DAFM dairy IE2134 |
| Gubbeen Farmhouse Products Ltd | Gubbeen Schull Co Cork | Lácteos y quesos | — | — | — | DAFM dairy IE1819 |
| Hak Dairy Farms Ltd | Ballymacowen Clonakilty Co Cork | Lácteos y quesos | — | — | — | DAFM dairy IE2198 |
| JDS Foods Ltd. | JDS Foods Ltd Churchfield | Lácteos y quesos | — | — | — | DAFM dairy IE2139 |
| Kanturk Dairy (registered as North Cork Co-operative Creameries Ltd) | Dromalour Kanturk Co Cork | Lácteos y quesos | — | — | — | DAFM dairy IE1427 |
| Lapland Farm (registered as Melvin and Heather Smith) | Lapland Farm Douglas Cork | Lácteos y quesos | — | — | — | DAFM dairy IE2220 |
| Leahy's Open Farm Ltd | Condonstown Dungourney Co Cork | Lácteos y quesos | — | — | — | DAFM dairy IE2148 |
| Lullaby Milk (registered as Bainne Codladh Ltd) | Knockardrahan Kanturk Co Cork | Lácteos y quesos | — | — | — | DAFM dairy IE2143 |
| Macroom Buffalo Cheese Products Ltd. | Cloncud Kilnamartyra, Macroom, Co. | Lácteos y quesos | — | — | — | DAFM dairy IE2009 |
| Milleens Cheese Ltd | Quinlan Steele, Milleens Cheese | Lácteos y quesos | — | — | — | DAFM dairy IE1851 |
| Mitchelstown Cheese | Togher (nearest, 2.5 km) | Lácteos y quesos | — | (025) 31310 | 51.85669, -8.492274 | [FarmFinder](https://farmfinder.ie/producer/mitchelstown-cheese); via SuperValu Food Academy |
| Moorepark Technology Ltd | Moorepark Teagasc Fermoy Co | Lácteos y quesos | — | — | — | DAFM dairy IE1104 |
| Nutrition Supplies (registered as Nutrition Supplies & Services Ltd) | Killountain Innishannon Co Cork | Lácteos y quesos | — | — | — | DAFM dairy IE2165 |
| Old Head Milk (registered as Stephen McCarthy) | Ballymackean Old Head Kinsale | Lácteos y quesos | — | — | — | DAFM dairy IE2210 |
| Rostellan Dairy (registered as Joe Morrissey Ltd) | Knockanemorney Farm Rostellan Midleton | Lácteos y quesos | — | — | — | DAFM dairy IE2189 |
| Round Tower Cheese (registered as Michael O'Donovan) | Farranmareen Enniskeane Co Cork | Lácteos y quesos | — | — | — | DAFM dairy IE1845 |
| Ryans Farm Dairy Products | Ahaliskey Farm Ballinascarthy Clonakilty | Lácteos y quesos | — | — | — | DAFM dairy IE2222 |
| Sunview Goats (registered as Brian & Ann Bond) | Sunview Farm Terelton Macroom | Lácteos y quesos | — | — | — | DAFM dairy IE2000 |
| The Frozen Churn (registered as Anne Barrett CMA Farm Partnership) | Liscubba Lyre Clonakilty Co | Lácteos y quesos | — | — | — | DAFM dairy IE2206 |
| The Good Dairy Company (registered as The Good Dairy Company Ltd) | Killowen Nohoval Kinsale Co. | Lácteos y quesos | — | — | — | DAFM dairy IE2175 |
| The Lost Valley Dairy & Creamery (registered as Michael Parle) | Carrignamuc, Inchigeelagh, Macroom, Co | Lácteos y quesos | — | — | — | DAFM dairy IE2153 |
| The Proper Dairy Company (registered as Coleville Dairy Company Ltd) | C/o Moorepark Technologies Ltd | Lácteos y quesos | — | — | — | DAFM dairy IE2154 |
| Toons Bridge Dairy | Knocknaheeny (nearest, 3.1 km) | Lácteos y quesos | — | (021) 480 6500 | 51.933318, -8.523024 | [FarmFinder](https://farmfinder.ie/producer/toons-bridge-dairy) |
| Toonsbridge Dairy LTD | Macroom Co Cork | Lácteos y quesos | — | +353 86 341 3601 · jenny@therealoliveco.com | — | DAFM dairy IE1967 |
| William Mc Sweeney | Bealick Macroom Co Cork | Lácteos y quesos | — | — | — | DAFM dairy IE2231 |
| Bosca Beag | Skibbereen (nearest, 2.8 km) | Otros | — | — | 51.544057175575055, -9.223294104571341 | [FarmFinder](https://farmfinder.ie/producer/bosca-beag); via yourhonestybox.com |
| Camus Farm | Clonakilty | Otros | — | — | — | [FarmFinder](https://farmfinder.ie/producer/camus-farm-clonakilty-co-cork) |
| Cillian Ronayne | Blackpool (nearest, 0.8 km) | Otros | — | 083 002 3523 | 51.912901, -8.462163 | [FarmFinder](https://farmfinder.ie/producer/cillian-ronayne-co-cork); via Irish Organic Association |
| Dromahane | Drommahane (nearest, 1.5 km) | Otros | — | — | 52.09847969068552, -8.710095838142704 | [FarmFinder](https://farmfinder.ie/producer/dromahane); via yourhonestybox.com |
| Lucey's 1880 | Mallow (nearest, 0.5 km) | Otros | — | 022 21130 | 52.126903, -8.645525 | [FarmFinder](https://farmfinder.ie/producer/lucey-s-1880); via Irish Butchers Guild |
| O'Driscoll Victuallers | Skibbereen (nearest, 1.1 km) | Otros | — | (021) 436 9387 | 51.542198, -9.275605 | [FarmFinder](https://farmfinder.ie/producer/o-driscoll-victuallers); via Associated Craft Butchers of Ireland |
| On The Pigs Back | Ballinlough (nearest, 1.6 km) | Otros | — | (021) 461 7832 | 51.881852, -8.424967 | [FarmFinder](https://farmfinder.ie/producer/on-the-pigs-back); via SuperValu Food Academy |
| Sheehan Brothers Kanturk | Blarney (nearest, 1.4 km) | Otros | — | (029) 50849 | 51.923136, -8.554348 | [FarmFinder](https://farmfinder.ie/producer/sheehan-brothers-kanturk); via Associated Craft Butchers of Ireland |
| Sheehan Brothers Mallow | Annabella (nearest, 1.8 km) | Otros | — | (022) 21724 | 52.149013, -8.642119 | [FarmFinder](https://farmfinder.ie/producer/sheehan-brothers-mallow); via Associated Craft Butchers of Ireland |
| The Good Food Shop | Shandon (nearest, 0.5 km) | Otros | — | — | 51.904045, -8.48288 | [FarmFinder](https://farmfinder.ie/producer/the-good-food-shop-co-cork); via Irish Organic Association |

## Name and county only — 31

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Joe’s Farm Crisps | — | Aperitivos | listed | — | [FarmFinder](https://farmfinder.ie/producer/joe-s-farm-crisps) |
| Cork Coffee Roasters | — | Café | listed | — | [FarmFinder](https://farmfinder.ie/producer/cork-coffee-roasters) |
| Barrett Butchers | Kinsale | Carne | shop=butcher | +353 21 4772 204 | OSM node/5282651636 |
| Best Meats | Cork | Carne | shop=butcher | +353 21 427 0563 | OSM way/915559617 |
| Dan Moloney's Meat Centre | Bandon | Carne | shop=butcher; also OSM way/915559653 | +353 23 884 4206 | OSM node/6377683079 |
| Kathleen Noonan | Cork | Carne | shop=butcher | +353 87 297 1895 · majellamul@hotmail.co.uk | OSM way/915559657 |
| Moynihan's Poultry | Cork | Carne | shop=butcher | +353 21 427 2614 · noel@shannonvalefoods.ie | OSM relation/18937461 |
| O'Sullivan's Poultry | Cork | Carne | shop=butcher | +353 21 427 6514 · corkpoultryandgame@gmail.com | OSM way/915559639 |
| The Cork Meat Company | Ballincollig | Carne | shop=butcher | +353 21 487 5304 | OSM node/7159631655 |
| BeeWild | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/beewild) |
| Bessborough Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/bessborough-farm) |
| Glenbrook Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/glenbrook-farm) |
| Kildinan Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/kildinan-farm) |
| Rostellan Farm Shop | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/rostellan-farm-shop) |
| Schull Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/schull-market) |
| Waterfall Farms | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/waterfall-farms) |
| WestCork Biscuit Co | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/westcork-biscuit-co) |
| Yellow Belly Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/yellow-belly-farm) |
| Brendan McCarthy Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/brendan-mccarthy-bakery) |
| Coolagh Bakes | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/coolagh-bakes) |
| Cupcakes by Katie | Blarney (nearest, 0.6 km) | Pan y cereal | shop=bakery | +353 87 235 9046 | OSM node/6052834689 |
| Lough Hyne Cottage Bread | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/lough-hyne-cottage-bread) |
| Silke Cropp Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/silke-cropp-bakery) |
| Stauntons Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/stauntons-bakery) |
| The Alternative Bread Company | Cork | Pan y cereal | shop=bakery | +353 21 425 1347 · natbread.abc@gmail.com | OSM way/915559658 |
| Wild Bakery | — | Pan y cereal | listed; also FarmFinder https://farmfinder.ie/producer/wild-flour-bakery-kinsale | — | [FarmFinder](https://farmfinder.ie/producer/wild-bakery) |
| Wildflour Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/wildflour-bakery) |
| Bantry Bay Mussels | — | Pescado | Producer; Origin Green Member, Seafood, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/bantry-bay-mussels) |
| Clancy's Fresh Fish | Macroom | Pescado | shop=seafood | +353 26 43570 | OSM node/11564421206 |
| K. O'Connell Fishmongers | Cork | Pescado | shop=seafood | +353 21 427 6380 · freshfish@eircom.net | OSM way/1374182957 |
| Stonewell Cider | — | Sidra | listed | — | [FarmFinder](https://farmfinder.ie/producer/stonewell-cider) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
