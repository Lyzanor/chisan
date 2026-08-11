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

## Held after verification — 15

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Barryroe Cooperative | Otros | Barryroe Co-Operative publishes an agri retail, feed and milk business with a Eurospar; whether an own food offer under its own producer identity exists is unresolved. |
| D.P Murphy & Sons | Carne | The site carried for D.P Murphy & Sons is patrickmurphyandsons.ie, a smokeless coal and solid fuel supplier; the URL must not be carried. |
| Dan Moloney's Butchers | Carne | The domain serves a password-protected "Site Under Maintenance" page. A maintenance page is not proof of closure; the lead is unresolved. |
| Hegarty Cheese | Lácteos y quesos | Hegarty Cheese publishes only 'made near Cork city'; its candidate municipio Ballintemple is an inferred urban nearest settlement that does not match a farmhouse dairy. |
| Horgan Meats | Carne ? | The site carried for Horgan Meats is horgans.com, Horgan's Delicatessen Supplies at Mitchelstown, a food wholesaler; a different identity and a distributor rather than a producer. |
| Lee Valley Eggs | Huevos | Leevalleyireland.com is Lee Valley Ireland, a clothing and gifts business at Inchigeela founded by the Hurley family — not the egg producer. The URL must not be carried and the producer needs its own source. |
| MoonFish | Pescado | Moonfish.ie no longer resolves to the producer: the domain now serves the Hosting Ireland site. A lapsed domain is not proof of closure and the URL must not be carried. |
| O'Mahony Family Butchers | Carne | The SiteGround challenge did not clear in a browser session either; on this host it sometimes auto-redirects and sometimes escalates to a hand-solved captcha. It needs a person in a browser. |
| Sheehan Brothers Glanmire | Otros | Sheehan Brothers Butchers publishes shops at Mallow, Glanmire, Kanturk and St Luke's Cross without naming a productive unit; which one the row would represent is unresolved. |
| Sheehan Brothers St Luke Cross | Otros | See the Sheehan Brothers Glanmire record; the St Luke's Cross entry is another shop of the same business. |
| The Grumpy Bakers | Pan y cereal | The Grumpy Bakers publishes outlets in both Midleton and Cork city without naming where it bakes; the productive unit is unresolved. |
| The Menu Cakery | Pan y cereal | The Menu Cakery publishes a T12 Cork city Eircode while its lead coordinate sits at Halfway; the municipality is unresolved. |
| The Stuffed Olive | Pan y cereal | The Stuffed Olive in Bantry publishes a café, food and wine store with ready meals, salads and cakes; which of it is own production rather than resale is unresolved. |
| West Cork Eggs | Huevos | The SiteGround challenge escalates to a captcha that a person has to solve, in a real browser as well as every automated route. Reading it needs a person, not another fetch. |
| West Cork Sea Salt | Otros | West Cork Sea Salt publishes no address; its candidate municipio South Parish is an inferred Cork city nearest settlement that contradicts the West Cork name. |

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
