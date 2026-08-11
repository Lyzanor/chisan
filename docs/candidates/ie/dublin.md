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

## Held after verification — 38

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Artybaker | Pan y cereal | Artybaker publishes four Dublin Eircodes and no single address; which is the bakery is unresolved. |
| Blazing Salads | Fruta y verdura ? | Blazing Salads publishes a vegan wholefood deli with a click-and-collect menu; which of its range it makes rather than resells is unresolved. |
| Butcher.ie | Carne ? | Butcher.ie publishes no address; its candidate municipio Smithfield is an inferred nearest settlement 1.4 km from the source coordinate. |
| Cinnamood | Pan y cereal | Cinnamood publishes a German-language specialty bakery brand with no Dublin address or production site. |
| Clondalkin Cheesemaker | Otros | See the Dublin Hills Goats Cheese record; same distributor site. |
| Cornucopia | Otros | The SiteGround challenge did not clear in a browser session either; on this host it sometimes auto-redirects and sometimes escalates to a hand-solved captcha. It needs a person in a browser. |
| Corrigan's Butchers Finglas | Carne ? | Corrigan's Butchers publishes Drumcondra (D09) and Finglas (D11) shops without naming a productive unit; which one the row would represent is unresolved. |
| Cosgrave's The Butcher Shop Ballybrack | Carne ? | Cosgraves Butchers was filed four times (Ballybrack, Clarehall, Crumlin, Santry) against one site, and each lead's candidate municipio contradicts its branch name; the productive unit is unresolved. |
| Cosgrave's The Butcher Shop Clarehall | Carne ? | See the Cosgraves Ballybrack record; same site, branch municipio contradicted by the candidate coordinate. |
| Cosgrave's The Butcher Shop Crumlin | Carne ? | See the Cosgraves Ballybrack record; same site, branch municipio contradicted by the candidate coordinate. |
| Cosgrave's The Butcher Shop Santry | Carne ? | See the Cosgraves Ballybrack record; same site, branch municipio contradicted by the candidate coordinate. |
| Dempsey & Byrne | Otros | The site carried for Dempsey & Byrne is davybyrnes.com, a Dublin pub; the URL must not be carried. |
| Doyle Catering Meats | Carne | Doylecateringmeats.com now serves a parked page of sponsored listings; the URL must not be carried and Doyle Catering Meats needs a current source. |
| Dublin Flea Market | Otros | The site returns a near-empty body (745 bytes) with no producer content; the lead is unresolved and needs another source. |
| Dublin Hills Goats Cheese | Lácteos y quesos | Three cheese leads (Dublin Hills Goats Cheese, Dublins Hill Goats Cheese, Clondalkin Cheesemaker) were filed against traditionalcheese.ie, a specialty cheese distributor; none of the three identities is established by it. |
| Dubliner Cheese | Lácteos y quesos | The site carried for Dubliner Cheese is sheridanscheesemongers.com, a cheesemonger; the Dubliner brand is made elsewhere and needs its own source. |
| Dublins Hill Goats Cheese | Lácteos y quesos | See the Dublin Hills Goats Cheese record; same distributor site. |
| Ennis Butchers | Carne ? | Ennis Butchers publishes only 'Rialto, Dublin' with no address, and its candidate municipio is the generic 'Southside'. |
| F.X. Buckley Deansgrange | Otros | F.X. Buckley was filed three times (Deansgrange, Rathcoole, Rathfarnham) against one site that describes only the Deansgrange shop; the productive unit is unresolved. |
| F.X. Buckley Rathcoole | Otros | See the F.X. Buckley Deansgrange record; same site, branch unresolved. |
| F.X. Buckley Rathfarnham | Otros | See the F.X. Buckley Deansgrange record; same site, branch unresolved. |
| Fable Bakery | Pan y cereal | Fable Bakery publishes a D02 Eircode and delivery to offices but no address or bakery location. |
| Fenlons | Carne | Fenelons publishes no address; its candidate municipio Stillorgan is inferred from the source coordinate. |
| Gleeson Meats Balbriggan | Carne ? | Gleesons Fresh Foods was filed for Balbriggan and Blanchardstown against one site whose Eircodes name neither; the productive unit is unresolved. See also the meath lead. |
| Gleeson Meats Blanchardstown | Carne ? | See the Gleesons Balbriggan record; same site, branch unresolved. |
| Hick's | Carne | The published URL returns 404. A missing page is not proof of closure: the producer needs a current URL before it can be resolved. |
| Honest to Goodness Market Glasnevin | Otros | The site carried for Honest to Goodness Market Glasnevin is the Glasnevin Food Market page at 38a Barrow Road, Dublin 11; whether it is a producer or a market venue is unresolved. |
| il Valentino | Pan y cereal | Il Valentino serves an unconfigured site titled 'Your Site Title' carrying two Dublin Eircodes; the bakery needs a current source. |
| Jack Smyth Brewing Company | Cerveza | The site carried for Jack Smyth Brewing Company is boxtyhouse.ie, Gallagher's Boxty House restaurant; the URL must not be carried. |
| Kerrigan Butchers Donaghmede | Carne ? | Kerrigans Butchers was filed three times against two sites; the Flipdish listing names 58b Grange Drive, Baldoyle while the candidate municipios say Sandymount, Malahide and Leopardstown. The productive unit is unresolved. |
| Kerrigan Butchers Malahide | Carne ? | See the Kerrigans Donaghmede record; same business, branch unresolved. |
| Kerrigans Butchers | Carne ? | See the Kerrigans Donaghmede record; this lead points at the Flipdish ordering page rather than the producer's own site. |
| Larry's Marino Fair | Carne | The site answers HTTP 402 on every automated route tried; the lead is unresolved and needs a browser session. |
| Leavy's Butchers | Carne ? | Colm Leavy Butchers publishes no address; its candidate municipio East Wall is an inferred nearest settlement 1.5 km from the source coordinate. |
| Roberts of Dalkey | Pescado | Robertsofdalkey.ie serves an empty Apache directory index, so no site stands behind the domain. That is not proof of closure; the producer needs another current source and the URL must not be carried. |
| The 5 Lamps Brewery | Cerveza | The 5 Lamps publishes a Dublin beer brand with no brewery, address or production detail; whether a productive unit exists is unresolved. |
| The Scarlet Heifer | Carne | The Scarlet Heifer publishes Leopardstown and Foxrock shops under a D18 Eircode without naming a productive unit. |
| Yami Yami | Pan y cereal | Yami Yami publishes 'Fresh daily in Charlestown' with no address; Charlestown is a shopping centre rather than a town, so the municipality is unresolved. |

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
