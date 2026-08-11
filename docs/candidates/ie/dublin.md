# Dublin — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/dublin.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/dublin>, plus each producer
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

## Ready to verify — 65

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Butcher.ie | Smithfield (nearest, 1.4 km) | Carne ? | butcher.ie | — | 53.345748, -6.298829 | [FarmFinder](https://farmfinder.ie/producer/butcher-ie) |
| Corrigan's Butchers Finglas | Dublin | Carne ? | www.corrigansbutchers.com | 01 8344643 | 53.387873, -6.306395 | [FarmFinder](https://farmfinder.ie/producer/corrigan-s-butchers-finglas); via Irish Butchers Guild |
| Cosgrave's The Butcher Shop Ballybrack | Dublin | Carne ? | www.cosgraves.ie | (01) 275 1817 | 53.337023, -6.195526 | [FarmFinder](https://farmfinder.ie/producer/cosgrave-s-the-butcher-shop-ballybrack); via Associated Craft Butchers of Ireland |
| Cosgrave's The Butcher Shop Clarehall | Fairview (nearest, 0.2 km) | Carne ? | www.cosgraves.ie | (01) 871 2003 | 53.363253, -6.229016 | [FarmFinder](https://farmfinder.ie/producer/cosgrave-s-the-butcher-shop-clarehall); via Associated Craft Butchers of Ireland |
| Cosgrave's The Butcher Shop Crumlin | Priorswood (nearest, 1.5 km) | Carne ? | www.cosgraves.ie | (01) 455 0329 | 53.406877, -6.217805 | [FarmFinder](https://farmfinder.ie/producer/cosgrave-s-the-butcher-shop-crumlin); via Associated Craft Butchers of Ireland |
| Cosgrave's The Butcher Shop Santry | Walkinstown (nearest, 0.6 km) | Carne ? | www.cosgraves.ie | (01) 842 5534 | 53.330661, -6.339357 | [FarmFinder](https://farmfinder.ie/producer/cosgrave-s-the-butcher-shop-santry); via Associated Craft Butchers of Ireland |
| Doyle Catering Meats | Rathcoole | Carne | doylecateringmeats.com | +353 1 458 9905 · info@doylecateringmeats.com | — | DAFM meat 2358 |
| Dublin Meat Company (registered as DPB Meats Ltd T/A Dublin Meat Company) | Swords | Carne | www.dublinmeatcompany.com | +353 1 210 8681 | — | DAFM meat 2903 |
| Ennis Butchers | Southside (nearest, 0.5 km) | Carne ? | www.ennisbutchers.ie | (01) 454 9282 | 53.335411, -6.270729 | [FarmFinder](https://farmfinder.ie/producer/ennis-butchers) |
| Etherson Family Butchers | Dublin | Carne ? | www.ethersonsbutchers.ie | (01) 868 2046 | 53.289995, -6.233187 | [FarmFinder](https://farmfinder.ie/producer/etherson-family-butchers); via Associated Craft Butchers of Ireland |
| Fenlons | Stillorgan (nearest, 0.3 km) | Carne | fenelons.ie ⚠ | +353 1 288 1185 | 53.2893247, -6.2008221 | OSM node/1056711326 |
| Gleeson Meats Balbriggan | Poppintree (nearest, 0.6 km) | Carne ? | www.gleesonsfreshfoods.ie | (01) 841 6481 | 53.395022, -6.284747 | [FarmFinder](https://farmfinder.ie/producer/gleeson-meats-balbriggan); via Associated Craft Butchers of Ireland |
| Gleeson Meats Blanchardstown | The Liberties (nearest, 0.4 km) | Carne ? | www.gleesonsfreshfoods.ie | (01) 822 1814 | 53.33834, -6.281009 | [FarmFinder](https://farmfinder.ie/producer/gleeson-meats-blanchardstown); via Associated Craft Butchers of Ireland |
| Hick's | Dún Laoghaire | Carne | hicks.ie | +353 1 280 1433 · dunlaoghairefoodco@gmail.com | 53.2928077, -6.137495 | OSM node/6178795475 |
| Higgins Family Butchers | Harmonstown (nearest, 1 km) | Carne ? | www.higginsbutchers.ie | (01) 839 0090 | 53.387207, -6.185824 | [FarmFinder](https://farmfinder.ie/producer/higgins-family-butchers) |
| J.W. Smyth Butchers | Raheny | Carne ? | www.jwsmythbutchers.ie | (01) 831 3862 | 53.397222, -6.0785 | [FarmFinder](https://farmfinder.ie/producer/j-w-smyth-butchers); via Associated Craft Butchers of Ireland |
| JW Smiths Butcher | Portmarnock (nearest, 0 km) | Carne | jwsmythbutchers.ie ⚠ | — | 53.4214194, -6.1369418 | OSM node/1947468213 |
| Kerrigan Butchers Donaghmede | Sandymount (nearest, 0.5 km) | Carne ? | www.kerriganmeats.ie | (01) 847 6869 | 53.324254, -6.199449 | [FarmFinder](https://farmfinder.ie/producer/kerrigan-butchers-donaghmede); via Associated Craft Butchers of Ireland |
| Kerrigan Butchers Malahide | Malahide (nearest, 0.8 km) | Carne ? | kerrigans.ie | (01) 845 1529 | 53.456736, -6.161012 | [FarmFinder](https://farmfinder.ie/producer/kerrigan-butchers-malahide); via Associated Craft Butchers of Ireland |
| Kerrigans Butchers | Leopardstown (nearest, 0.9 km) | Carne ? | kerrigans.flipdish.menu/?utm_source=GBP.website&utm_medium=GBP&utm_campaign=br14087-website | (01) 845 1529 | 53.271424, -6.18861 | [FarmFinder](https://farmfinder.ie/producer/kerrigans-butchers) |
| Larry's Marino Fair | Dublin | Carne | marketfair.ie | — | 53.3709415, -6.2388245 | OSM way/975311026 |
| Leavy's Butchers | East Wall (nearest, 1.5 km) | Carne ? | colmleavybutchers.ie | (01) 295 6877 | 53.348331, -6.213431 | [FarmFinder](https://farmfinder.ie/producer/leavy-s-butchers); via Associated Craft Butchers of Ireland |
| The Scarlet Heifer | Foxrock (nearest, 0.6 km) | Carne | www.thescarletheifer.com | — | 53.2663402, -6.1834408 | OSM node/10951811254 |
| Changing Times Brewery | Glasnevin | Cerveza | www.changingtimesbrewery.com | — | 53.3724219, -6.2935584 | OSM node/12415312348 |
| Jack Smyth Brewing Company | Tallaght | Cerveza | www.boxtyhouse.ie ⚠ | +35314140032 · info@boxtyhouse.ie | 53.2932581, -6.3537734 | OSM node/9100218750 |
| The 5 Lamps Brewery | Dublin | Cerveza | the5lampsbrewery.com | — | 53.3359545, -6.2658686 | OSM way/525723347 |
| The Old Schoolhouse | Swords | Cerveza | theoldschoolhouse.ie | +353 1 8404 160 · info@theoldschoolhouse.ie | 53.4567343, -6.2228014 | OSM way/228009652 |
| Pearse Lyons | Dublin | Destilados y licores | www.pearselyonsdistillery.com | +353 1 691 6000 · info@pearselyonsdistillery.com | 53.3437206, -6.2894327 | OSM way/239059341 |
| Roe & Co Distillery | Dublin | Destilados y licores | www.roeandcowhiskey.com ⚠ | — | 53.3438825, -6.2858094 | OSM node/9984256981 |
| Blazing Salads | Dunsink (nearest, 1.4 km) | Fruta y verdura ? | www.blazingsalads.com | (01) 671 8288 | 53.374769, -6.339413 | [FarmFinder](https://farmfinder.ie/producer/blazing-salads); via Dublin Food Chain |
| Dublin Hills Goats Cheese | Southside (nearest, 0.4 km) | Lácteos y quesos | www.traditionalcheese.ie ⚠ | (01) 409 0400 | 53.34115, -6.265495 | [FarmFinder](https://farmfinder.ie/producer/dublin-hills-goats-cheese); via Food Culture Ireland |
| Dubliner Cheese | Perrystown (nearest, 1 km) | Lácteos y quesos | www.sheridanscheesemongers.com ⚠ | (01) 679 3143 | 53.310163, -6.327195 | [FarmFinder](https://farmfinder.ie/producer/dubliner-cheese); via SuperValu Food Academy |
| Dublins Hill Goats Cheese | Balally (nearest, 1.7 km) | Lácteos y quesos | www.traditionalcheese.ie ⚠ | (01) 409 0400 | 53.272901, -6.253993 | [FarmFinder](https://farmfinder.ie/producer/dublins-hill-goats-cheese); via SuperValu Food Academy |
| Toons Bridge Dairy | Dublin | Lácteos y quesos ? | www.toonsbridgedairy.com | +35314443877 | 53.3423661, -6.2643889 | OSM node/5337172888 |
| Asia Market Dublin | East Wall (nearest, 1 km) | Otros | www.asiamarket.ie | (01) 409 7072 | 53.348996, -6.248265 | [FarmFinder](https://farmfinder.ie/producer/asia-market-dublin); via Dublin Food Chain |
| Avoca | Poppintree (nearest, 2 km) | Otros | www.avoca.com/en/stores-and-cafes/suffolk-street?utm_source=google-my-business/suffolk-street&utm_medium=organic&utm_campaign=web-link&utm_content= | (01) 677 4215 | 53.397164, -6.313149 | [FarmFinder](https://farmfinder.ie/producer/avoca); via Dublin Food Chain |
| Clondalkin Cheesemaker | Southside (nearest, 0.6 km) | Otros | www.traditionalcheese.ie | (01) 409 0400 | 53.342951, -6.265709 | [FarmFinder](https://farmfinder.ie/producer/clondalkin-cheesemaker); via Dublin Food Chain |
| Cornucopia | Dunsink (nearest, 0.8 km) | Otros | www.cornucopia.ie | (01) 677 7583 | 53.382827, -6.330023 | [FarmFinder](https://farmfinder.ie/producer/cornucopia); via Dublin Food Chain |
| Dalkey Handmade Food | Killiney (nearest, 1.8 km) | Otros | www.dalkeyhandmadesoaps.ie | 087 131 7497 | 53.274571, -6.092275 | [FarmFinder](https://farmfinder.ie/producer/dalkey-handmade-food); via SuperValu Food Academy |
| Dempsey & Byrne | Monkstown (nearest, 1.1 km) | Otros | davybyrnes.com | (01) 472 1010 | 53.286116, -6.142417 | [FarmFinder](https://farmfinder.ie/producer/dempsey-and-byrne); via Associated Craft Butchers of Ireland |
| Dublin Flea Market | Grangegorman (nearest, 0.3 km) | Otros | www.libertymarket.ie | (01) 280 8683 | 53.353468, -6.274491 | [FarmFinder](https://farmfinder.ie/producer/dublin-flea-market); via Dublin Food Chain |
| Dublin Herbalist | Southside (nearest, 0.2 km) | Otros | theirishherbalist.ie | 086 341 6252 | 53.338871, -6.261449 | [FarmFinder](https://farmfinder.ie/producer/dublin-herbalist); via SuperValu Food Academy |
| Dublin Herbalists | Southside (nearest, 0.1 km) | Otros | www.dublinherbalists.ie | 083 106 7630 | 53.336309, -6.263927 | [FarmFinder](https://farmfinder.ie/producer/dublin-herbalists); via Dublin Food Chain |
| Dublin Port Company Markets | Broadstone (nearest, 0.9 km) | Otros | thegreendoor.ie ⚠ | 085 855 2665 | 53.357637, -6.263926 | [FarmFinder](https://farmfinder.ie/producer/dublin-port-company-markets); via Dublin Food Chain |
| F.X. Buckley Deansgrange | Deansgrange | Otros | www.fxbuckleybutchers.ie | +353 1 558 4680 | 53.360035, -6.305426 | [FarmFinder](https://farmfinder.ie/producer/f-x-buckley-deansgrange); via Associated Craft Butchers of Ireland |
| F.X. Buckley Rathcoole | Coolock (nearest, 1.2 km) | Otros | www.fxbuckleybutchers.ie | (01) 401 3925 | 53.381714, -6.217596 | [FarmFinder](https://farmfinder.ie/producer/f-x-buckley-rathcoole); via Associated Craft Butchers of Ireland |
| F.X. Buckley Rathfarnham | Rathfarnham (nearest, 1.5 km) | Otros | fxbuckleybutchers.ie | (01) 493 2547 | 53.287734, -6.272383 | [FarmFinder](https://farmfinder.ie/producer/f-x-buckley-rathfarnham); via Associated Craft Butchers of Ireland |
| Honest to Goodness Market Glasnevin | Ballygall (nearest, 0.5 km) | Otros | glasnevinfoodmarket.com | — | 53.380645, -6.269895 | [FarmFinder](https://farmfinder.ie/producer/honest-to-goodness-market-glasnevin); via Dublin Food Chain |
| Keogh's Farm | Southside (nearest, 0.9 km) | Otros | www.keoghs.ie | (01) 843 3175 | 53.341164, -6.251365 | [FarmFinder](https://farmfinder.ie/producer/keogh-s-farm); via Dublin Food Chain |
| Lilliput Stores | Ballygall (nearest, 1.1 km) | Otros | www.lilliputstores.com | (01) 672 9516 | 53.380486, -6.291307 | [FarmFinder](https://farmfinder.ie/producer/lilliput-stores); via Dublin Food Chain |
| Artybaker | Pembroke Township (nearest, 1.2 km) | Pan y cereal | artybaker.com | — | 53.3395505, -6.2373039 | OSM node/13544379821 |
| Brown Bag Bakery | Blanchardstown (nearest, 0.4 km) | Pan y cereal | www.brownbagbakery.ie | — | 53.3836691, -6.3818952 | OSM node/13759613436 |
| Butler's Pantry | Blackrock (nearest, 0.8 km) | Pan y cereal | thebutlerspantry.ie | +353 1 288 5505 | 53.3007344, -6.1891885 | OSM node/2301397536 |
| Cinnamood | Dublin | Pan y cereal | cinnamoodrolls.com | — | 53.3496722, -6.2596616 | OSM way/353991662 |
| Croissantly | Dún Laoghaire | Pan y cereal | croissantlybakery.ie | hello@croissantly.com | 53.2918611, -6.136701 | OSM node/6184690202 |
| Fable Bakery | Dún Laoghaire (nearest, 1.2 km) | Pan y cereal | fablebakery.com | — | 53.2901041, -6.1313661 | OSM node/13566318201 |
| il Valentino | Dublin | Pan y cereal | www.ilvalentino.ie | — | 53.3426047, -6.2390303 | OSM node/3338276450 |
| Ladurée Dublin | Dublin | Pan y cereal | ladureeireland.com | — | 53.3429671, -6.2621548 | OSM node/5212682322 |
| The Bretzel Bakery | Portobello (nearest, 0.4 km) | Pan y cereal | www.bretzel.ie | +353 1 4759445 · bretzelshop@bretzel.ie | 53.3312357, -6.2649791 | OSM node/1408878833 |
| Twist | Dublin | Pan y cereal | www.twistbakerydublin.com | info@twistbakerydublin.com | 53.3460014, -6.2619494 | OSM node/5109507722 |
| Yami Yami | Poppintree (nearest, 1.4 km) | Pan y cereal | yami-yami.ie | hello@yami-yami.ie | 53.403672, -6.3032756 | OSM node/13525591401 |
| George's Fish Shop | Dún Laoghaire | Pescado | georgesfishshop.com | +353 1 230 3011 · info@georgesfishshop.com | 53.2857425, -6.1547564 | OSM node/6204207097 |
| Roberts of Dalkey | Dalkey | Pescado | robertsofdalkey.ie | +353 1 557 0037 | 53.2773914, -6.1038197 | OSM way/237916666 |
| Fallon & Byrne | Dunsink (nearest, 1.1 km) | Vino ? | www.fallonandbyrne.com/our-restaurants/the-wine-cellar | (01) 472 1010 | 53.389468, -6.321975 | [FarmFinder](https://farmfinder.ie/producer/fallon-and-byrne); via Dublin Food Chain |
| Solera Wine Merchants Limited | Dublin | Vino | www.solera.ie | +353 1 1547 0562 | 53.3541766, -6.2954937 | OSM node/12114580057 |

## Needs one more fact — 75

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Asian Artisan Food Limited | Unit B Ground Floor | Carne | — | — | — | FSAI HSE 4090 |
| Ballymaguire Foods Limited | RathmooneyLuskDublin | Carne | — | — | — | FSAI HSE 4008 |
| Baxter's Butchers | Glenview, Tallaght (nearest, 1.5 km) | Carne | — | (01) 841 7255 | 53.301661, -6.336392 | [FarmFinder](https://farmfinder.ie/producer/baxter-s-butchers); via Associated Craft Butchers of Ireland |
| Boojum Ltd | Unit 26B North City Business ParkNorth R | Carne | — | — | — | FSAI HSE 4057 |
| Boxty House Limited | Unit 3 | Carne | — | — | — | FSAI HSE 4094 |
| Brady's Butchers Belvedere Road | Blackrock (nearest, 0.7 km) | Carne | — | 01 8557329 | 53.297942, -6.187025 | [FarmFinder](https://farmfinder.ie/producer/brady-s-butchers-belvedere-road); via Irish Butchers Guild |
| Brady's Butchers Fairview | Chapelizod (nearest, 1.2 km) | Carne | — | (01) 855 0850 | 53.352673, -6.332265 | [FarmFinder](https://farmfinder.ie/producer/brady-s-butchers-fairview); via Associated Craft Butchers of Ireland |
| Brady's Butchers Templeogue | Pembroke Township (nearest, 1.9 km) | Carne | — | 01 4508638 | 53.342834, -6.212073 | [FarmFinder](https://farmfinder.ie/producer/brady-s-butchers-templeogue); via Irish Butchers Guild |
| Carney Quality Meats Ltd | Coolock | Carne | — | — | — | DAFM meat 2765 |
| Courtney's Factory Shop Ltd | Tallaght | Carne | — | — | — | DAFM meat 2979 |
| CPK Compass Group | Unit A8 KingswoodKingswood Business Park | Carne | — | — | — | FSAI HSE 4085 |
| Crag Meat Supply Ltd | Clondalkin | Carne | — | — | — | DAFM meat 2952 |
| Dnata Catering Ireland Limited | Units 5 and 6 Dublin Airport Logistics P | Carne | — | — | — | FSAI HSE 4075 |
| Donnybrook Fair LTD | Donnybrook | Carne | — | — | — | DAFM meat 2833 |
| Donovan's Butchers | Pembroke Township (nearest, 0.7 km) | Carne ? | — | (01) 457 0724 | 53.323581, -6.231637 | [FarmFinder](https://farmfinder.ie/producer/donovan-s-butchers); via Associated Craft Butchers of Ireland |
| Dublin Central Kitchen | Unit D | Carne | — | — | — | FSAI HSE 4097 |
| Edward Doyle Butchers | Killiney (nearest, 2.3 km) | Carne ? | — | (01) 285 9873 | 53.281553, -6.092073 | [FarmFinder](https://farmfinder.ie/producer/edward-doyle-butchers); via Associated Craft Butchers of Ireland |
| Egan Meats | Terenure | Carne | — | — | — | DAFM meat 2672 |
| Elita Meats or Ryan Meats (registered as Elite Quality Meats Ltd T/A Elita Meats or Ryan Meats) | Finglas | Carne | — | — | — | DAFM meat 2052 |
| Emaan Meal Solutions Irl Limited | Unit 1 -3Cookstown Industrial EstateTall | Carne | — | — | — | FSAI HSE 4053 |
| Emamou Food Ltd | Clondalkin | Carne | — | — | — | DAFM meat 2982 |
| FX Buckley Products Ltd | Rathcoole | Carne | — | — | — | DAFM meat 2359 |
| Gahan Meats Ltd | Finglas | Carne | — | — | — | DAFM meat 2466 |
| Gold Medal Meats Ltd | Palmerstown | Carne | — | — | — | DAFM meat 2691 |
| Golden Bake Limited | Coolock | Carne | — | — | — | DAFM meat 4033 |
| Granby Ltd. | Dublin 1 | Carne | — | — | — | DAFM meat 779 |
| Hicks of Dun Laoghaire (registered as Dun Laoghaire Food Company T/A Hicks of Dun Laoghaire) | Dun Laoghaire | Carne | — | — | — | DAFM meat 2984 |
| Itsa | 56A Blackthorn RoadSandyford Industrial | Carne | — | — | — | FSAI HSE 4067 |
| KC Peaches Ireland Limited | Unit 10 Trinity Enterprise CentrePearse | Carne | — | — | — | FSAI HSE 4049 |
| Kelly Bros Butchers Ltd | Clondalkin | Carne | — | — | — | DAFM meat 2396 |
| Kerrigan's Factory Shop Ltd | Baldoyle | Carne | — | — | — | DAFM meat 2951 |
| King's Butchers | Rathfarnham (nearest, 1.9 km) | Carne ? | — | (01) 493 3895 | 53.285268, -6.268998 | [FarmFinder](https://farmfinder.ie/producer/king-s-butchers); via Associated Craft Butchers of Ireland |
| La Rousse Foods LTD | Nangor Rd | Carne | — | — | — | DAFM meat 2368 |
| Lotts & Co | 47A Marlborough RoadDonnybrookDublin 4 | Carne | — | — | — | FSAI HSE 4096 |
| M & K Meats Ltd | Rathcoole | Carne | — | — | — | DAFM meat 2343 |
| Market Street Food Halls Limited | Unit 7G Swords Business ParkSwords K67X0 | Carne | — | — | — | FSAI HSE 4107 |
| Morehampton Foods Limited | Unit E20 Cloverhill Industrial EstateClo | Carne | — | — | — | FSAI HSE 4035 |
| O' Mahony Meats Ltd | Malahide Rd | Carne | — | — | — | DAFM meat 2372 |
| Oishii Foods Limited | Unit 17 Naas Road Business ParkMuirfield | Carne | — | — | — | FSAI HSE 4108 |
| Parkwest Kitchen | A3 Canal Bank | Carne | — | — | — | FSAI HSE 4087 |
| Pieman | Ace Enterprise Park | Carne | — | — | — | FSAI HSE 4111 |
| QFL Quality Food Network (registered as DDLM T/A QFL Quality Food Network) | Ballycoolin | Carne | — | — | — | DAFM meat 2848 |
| Quality First Limited | Muirfield | Carne | — | — | — | DAFM meat 2410 |
| Robinson Meats (registered as H & D Meats Ltd T/A Robinson Meats) | Chapelizod | Carne | — | — | — | DAFM meat 782 |
| Sandyford Meats Ltd | Sandyford | Carne | — | — | — | DAFM meat 2376 |
| Smokin Bones Production LTD | Oxnamtown Lane | Carne | — | — | — | DAFM meat 2074 |
| Spice Village Indian Cuisine | Unit 4C | Carne | — | — | — | FSAI HSE 4115 |
| Sysco Foods Ireland Unlimited Company | Killamonan | Carne | — | — | — | DAFM meat 2881 |
| Tender Meats Ltd. | Clondalkin | Carne | — | — | — | DAFM meat 538 |
| The Tram Café Limited | Unit 131D Slaney RoadDublin Industrial E | Carne | — | — | — | FSAI HSE 4109 |
| Tom Whelan Meat Products Ltd | Clondalkin | Carne | — | — | — | DAFM meat 2356 |
| Whelans of Dublin Pudding Manufacturers Ltd | Bluebell | Carne | — | — | — | DAFM meat 2357 |
| Hopkins & Hopkins Brewing Company | Dublin | Cerveza | — | — | 53.3492827, -6.2761105 | OSM node/10775555715 |
| Sanor | Ballymount (nearest, 1.5 km) | Cerveza | — | — | 53.3259345, -6.3665244 | OSM node/12638656543 |
| Third Circle Brewing | Walkinstown (nearest, 0.8 km) | Cerveza | — | — | 53.3311589, -6.349899 | OSM node/8638179434 |
| Urban Brewing | Dublin | Cerveza | — | +353 1 568 5989 | 53.3491172, -6.2480644 | OSM node/5073432440 |
| Airfield Estate | Upper Kilmacud Road Dundrum | Lácteos y quesos | — | — | — | DAFM dairy IE2103 |
| Aoife McNally | McNally Family Farm Balrickard | Lácteos y quesos | — | — | — | DAFM dairy IE1955 |
| Bainne Bó (registered as Yvonne and Alan Fitzachary) | Hillcrest, St. Margaret's, Swords, | Lácteos y quesos | — | — | — | DAFM dairy IE2181 |
| Dreamvision Ventures (registered as Mohini Gangaram) | Unit 21, Ace Enterprise | Lácteos y quesos | — | — | — | DAFM dairy IE2221 |
| Dublin Farm Dairies Ltd | Kilreesk St. Margarets Co. | Lácteos y quesos | — | — | — | DAFM dairy IE2202 |
| Fusco Foods Ltd | 56, Spruce Avenue Stillorgan | Lácteos y quesos | — | — | — | DAFM dairy 1722 |
| Gleneely Foods Limited | Unit 5 Kilcarbery Park, | Lácteos y quesos | — | — | — | DAFM dairy IE2109 |
| Lilliput Trading Co (registered as Lilliput Artisan Foods Ltd) | Unit 3, 53 Arbour | Lácteos y quesos | — | — | — | DAFM dairy IE2211 |
| Simple True Foods (registered as Simple True Ltd) | Unit 21, Ace Enterprise | Lácteos y quesos | — | — | — | DAFM dairy IE2232 |
| Tim McGlynn | Oldcourt Hill Farm Oldcourt | Lácteos y quesos | — | — | — | DAFM dairy IE2173 |
| Traditional Cheese Company Ltd | Unit 244, Holly Road | Lácteos y quesos | — | — | — | DAFM dairy IE1879 |
| Gleeson's Artane | Smithfield (nearest, 0.5 km) | Otros | — | (01) 831 4590 | 53.350754, -6.285703 | [FarmFinder](https://farmfinder.ie/producer/gleeson-s-artane); via Associated Craft Butchers of Ireland |
| Green Saffron | Stillorgan (nearest, 0.7 km) | Otros | — | 083 010 3092 | 53.286686, -6.186574 | [FarmFinder](https://farmfinder.ie/producer/green-saffron); via Dublin Food Chain |
| Listons Food Store | Broadstone (nearest, 0.4 km) | Otros | — | (01) 405 4779 | 53.352247, -6.261102 | [FarmFinder](https://farmfinder.ie/producer/listons-food-store); via Dublin Food Chain |
| Arun Bakery | Dublin | Pan y cereal | — | — | — | [FarmFinder](https://farmfinder.ie/producer/arun-bakery) |
| Bread 41 | Dublin | Pan y cereal | — | — | — | [FarmFinder](https://farmfinder.ie/producer/bread-41) |
| Skinny Batch Food Co. | Lusk | Pan y cereal | — | — | 53.5230622, -6.1675742 | OSM way/744545070 |
| Nectar Wines | Sandyford (nearest, 0 km) | Vino | — | — | 53.2700978, -6.2248661 | OSM node/4686048744 |
| Pinto Wines | Clonturk (nearest, 0.3 km) | Vino | — | — | 53.3675477, -6.2552677 | OSM node/11178988551 |

## Name and county only — 51

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Katie's Kombucha | — | Bebidas sin alcohol | listed | — | [FarmFinder](https://farmfinder.ie/producer/katie-s-kombucha) |
| Calendar Coffee | — | Café | listed | — | [FarmFinder](https://farmfinder.ie/producer/calendar-coffee) |
| Cloud Picker Coffee | — | Café | listed | — | [FarmFinder](https://farmfinder.ie/producer/cloud-picker-coffee) |
| Dublin Roasters | — | Café | listed | — | [FarmFinder](https://farmfinder.ie/producer/dublin-roasters) |
| Fixx Coffee | — | Café | listed | — | [FarmFinder](https://farmfinder.ie/producer/fixx-coffee) |
| Full Circle Roasters | — | Café | listed | — | [FarmFinder](https://farmfinder.ie/producer/full-circle-roasters) |
| Keelings Farm & Coffee Shop | — | Café | listed; also OSM way/675737985 | — | [FarmFinder](https://farmfinder.ie/producer/keelings-farm-and-coffee-shop) |
| Brady's Butchers Newcastle | — | Carne | Producer; Beef, Lamb, Pork, Poultry | (01) 458 0156 | [FarmFinder](https://farmfinder.ie/producer/brady-s-butchers-newcastle); via Associated Craft Butchers of Ireland |
| Brendan's Of Crumlin | Dublin | Carne | shop=butcher | +353 1 4551687 | OSM node/2995287588 |
| Corrigans Butchers | Glasnevin | Carne | shop=butcher | +353 1 834 4643 | OSM way/958601191 |
| County Meats | Dublin | Carne | shop=butcher | +353 1 454 2820 | OSM node/2991107253 |
| Eddie Lloyd & Sons | Crumlin (nearest, 1.8 km) | Carne | shop=butcher | +353 1 453 4616 | OSM way/706807524 |
| Flemings Butchers | Kilmacud | Carne | shop=butcher; also OSM node/12641066220 | +353 1 296 7998 | OSM node/7968720915 |
| Hicks of Dalkey | Dalkey | Carne | shop=butcher | +353 1 285 9568 | OSM node/9566311503 |
| J. Downey & Son | Dublin | Carne | shop=butcher | +353 1 4909239 | OSM node/3104886052 |
| Market Butcher | Newcastle (nearest, 1.4 km) | Carne | shop=butcher | +353 1 458 7942 | OSM node/6269981825 |
| Bear Market Coffee | — | Cerveza | Producer; Dublin Food Chain, Beer, Cider, Spirits | — | [FarmFinder](https://farmfinder.ie/producer/bear-market-coffee) |
| Chez Emily Chocolate | The Ward | Chocolate | shop=chocolate | +353 1 835 2252 · sales@chezemily.ie | OSM way/1230714741 |
| Goodness Grains | — | Legumbres y cereales | listed | — | [FarmFinder](https://farmfinder.ie/producer/goodness-grains) |
| Beechpark Eco Farm | — | Miel | Farm; Preserves, Honey, Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/beechpark-eco-farm) |
| Bushy Park Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/bushy-park-market) |
| Cavistons | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/cavistons) |
| Country Crest Farmshop | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/country-crest-farmshop) |
| Dalkey Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/dalkey-market) |
| Dublin Bay Prawns | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/dublin-bay-prawns) |
| Dublin Cookie Company | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/dublin-cookie-company) |
| Dublin Food Co-op Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/dublin-food-co-op-market) |
| Dun Laoghaire People's Park Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/dun-laoghaire-people-s-park-market) |
| Dun Laoghaire Sunday Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/dun-laoghaire-sunday-market) |
| Homespun | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/homespun) |
| Honest2Goodness Market (Glasnevin | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/honest2goodness-market-glasnevin) |
| Howth Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/howth-market) |
| Waterfall Farm | Bluebell (nearest, 2.9 km) | Otros | shop=farm | — | OSM way/171894836 |
| An Bácús Beag | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/an-b-c-s-beag) |
| Blossom Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/blossom-bakery) |
| Bread Nation | — | Pan y cereal | Producer; Dublin Food Chain, Bread & Bakery | — | [FarmFinder](https://farmfinder.ie/producer/bread-nation) |
| Brother Hubbard | — | Pan y cereal | Producer; Dublin Food Chain, Bread & Bakery, remaining), About | — | [FarmFinder](https://farmfinder.ie/producer/brother-hubbard) |
| Camerino Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/camerino-bakery) |
| Coghlans Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/coghlans-bakery) |
| Craft Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/craft-bakery) |
| Cremore Bakery | Glasnevin | Pan y cereal | shop=bakery | +353 1 804 1942 | OSM way/958564199 |
| Elliots Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/elliots-bakery) |
| Gerry's Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/gerry-s-bakery) |
| Lumley's Bakery | Crumlin (nearest, 1.4 km) | Pan y cereal | shop=bakery | +353 1 473 3553 | OSM node/7072121643 |
| The Natural Bakery | Stillorgan (nearest, 0.3 km) | Pan y cereal | shop=bakery | +353 1 5584 497 · orders@thenaturalbakery.ie | OSM node/3750529749 |
| The Orange Tree Bakery | Dublin | Pan y cereal | shop=bakery | — | OSM node/2983580708 |
| Thunders home bakery | Grangegorman (nearest, 0.6 km) | Pan y cereal | shop=bakery; also OSM node/11724881359; also OSM way/233507043 | +353 1 4558 171 | OSM node/2939213024 |
| Beshoffs Brothers | — | Pescado | Producer; Dublin Food Chain, Seafood | — | [FarmFinder](https://farmfinder.ie/producer/beshoffs-brothers) |
| Kish Fish | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/kish-fish) |
| Meat 'n' Plaice | Whitehall (nearest, 0.4 km) | Pescado | shop=seafood | +353 1 848 6839 · selectseafoods@hotmail.co.uk | OSM node/5391266556 |
| The Catch Fish Shop | Cornelscourt | Pescado | shop=seafood | +353 1 289 2111 | OSM node/4272190209 |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
