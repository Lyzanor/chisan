# Donegal — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/ulster/donegal.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/donegal>, plus each producer
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

## Held after verification — 7

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Ardara Distillery | Destilados y licores | The SiteGround challenge escalates to a captcha that has to be solved by hand, so the site cannot be read by any automated route or by an agent. It needs a person in a browser. |
| Donegal Brewing Company | Cerveza | The site carried for Donegal Brewing Company is diceys.com, the Dicey Reilly's off-licence in Ballyshannon; the retail site does not establish the brewery as a productive unit. |
| Kombucha Na Dálaigh | Bebidas sin alcohol | Kombucha Na Dálaigh publishes no address; its candidate municipio Cloughaneely is an inferred nearest settlement 5.2 km from the source coordinate. |
| Living Green | Otros | The SiteGround challenge did not clear in a browser session either; on this host it sometimes auto-redirects and sometimes escalates to a hand-solved captcha. It needs a person in a browser. |
| Mallow Mia | Otros | Mallow Mia publishes only 'from Co. Donegal'; its candidate municipio Newtown Cunningham is an inferred nearest settlement 4.7 km from the source coordinate. |
| Northbound Brewing | Cerveza | The site answers a SiteGround bot challenge (HTTP 202 with an sgcaptcha redirect) on every automated route tried, including a second user-agent, both schemes and the www variant. A challenge is not a dead site: the lead is unresolved, not excluded, and needs a browser session. |
| Quality Sea Veg | Fruta y verdura | The shop is behind a maintenance notice, but the catalogue behind it names the range — organic sea herbs and sea veg, dulse and sweet kombu crisps, wakame noodle soup and carragheen — and publishes 074 954 2159. Identity and qualifying activity are settled; the municipio is not, because the candidate Keadue is an inferred nearest settlement 1.7 km from the source coordinate, and remote ordering cannot be reviewed while the shop is down. |

## Needs one more fact — 24

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Corveen Glen (registered as Hugh Gallagher T/A Corveen Glen) | Derrybeg | Carne | — | — | — | DAFM meat 2994 |
| EWS Butchers | Donegal (nearest, 2.3 km) | Carne | — | (074) 972 2595 | 54.666065, -8.093342 | [FarmFinder](https://farmfinder.ie/producer/ews-butchers); via Associated Craft Butchers of Ireland |
| Foyle Donegal (registered as Donegal Meat Processors T/A Foyle Donegal) | Carrigans | Carne | — | — | — | DAFM meat 292 |
| Frizzell's Craft Butchers | Bundoran (nearest, 1.2 km) | Carne | — | (071) 983 3857 | 54.468773, -8.269402 | [FarmFinder](https://farmfinder.ie/producer/frizzell-s-craft-butchers); via Associated Craft Butchers of Ireland |
| Gallagher’s Quality Meats | Ballybofey and Stranorlar (nearest, 0.3 km) | Carne ? | — | 074 9131548 | 54.7995181, -7.7787971 | [FarmFinder](https://farmfinder.ie/producer/gallaghers-quality-meats); via Food Culture Ireland |
| Glenside Bacon Company (registered as Ballyboden Ltd T/A Glenside Bacon Company) | Glenties | Carne | — | — | — | DAFM meat 550 |
| KP Gallen Foods Limited | Unit 2 & 3 Thorn RoadLetterkenny | Carne | — | — | — | FSAI HSE 4112 |
| McCarron's Butchers (registered as Brian McCarron T/A McCarron's Butchers) | Raphoe | Carne | — | — | — | DAFM meat 2926 |
| McGee Butchers | Letterkenny (nearest, 2.3 km) | Carne | — | (074) 917 6567 | 54.94151, -7.744506 | [FarmFinder](https://farmfinder.ie/producer/mcgee-butchers); via Associated Craft Butchers of Ireland |
| Noone's Poultry | Clonmany | Carne | — | — | — | DAFM meat 3001 |
| Twin Towns Quality Meats (registered as John Gallagher T/A Twin Towns Quality Meats) | Castlefinn | Carne | — | — | — | DAFM meat 3005 |
| Dopey Dick Brewing Company | Lenamore (nearest, 2 km) | Cerveza | — | — | 55.0378465, -7.3262577 | OSM way/682374549 |
| Otterbank Brewing Company | Muff | Cerveza | — | otterbankbrewing@gmail.com | 55.0663849, -7.2627862 | OSM node/9094841894 |
| Drioglann Thir Chonaill Teoranta | Loch an Iúir (nearest, 2.5 km) | Destilados y licores ? | — | (074) 956 2376 | 55.0230349, -8.265090299999999 | [FarmFinder](https://farmfinder.ie/producer/drioglann-thir-chonaill-teoranta); via Bord Bia Origin Green |
| Green Pastures Donegal | Convoy Lifford Co. Donegal | Lácteos y quesos | — | — | — | DAFM dairy IE1058 |
| Gupta's Sweets & Snacks (registered as Shailly Aggarwal) | Unit 1, Bunnagee Business | Lácteos y quesos | — | — | — | DAFM dairy IE2180 |
| Natural Dairies | Convoy Co Donegal | Lácteos y quesos | — | — | — | DAFM dairy IE1426 |
| Nomadic Foods Ltd | Crossroads Killygordon Co Donegal | Lácteos y quesos | — | — | — | DAFM dairy IE1105 |
| Donegal Rapeseed Oil | Ballindrait (nearest, 4.8 km) | Otros | — | 0749145386 | 54.8787434, -7.5729879 | [FarmFinder](https://farmfinder.ie/producer/donegal-rapeseed-oil); via Food Culture Ireland |
| Donegal Sea Salt | Churchill (nearest, 8.5 km) | Otros | — | 0861682589 | 54.9207542, -7.9523852 | [FarmFinder](https://farmfinder.ie/producer/donegal-sea-salt); via Food Culture Ireland |
| Glenborin | Donegal (nearest, 4 km) | Otros | — | — | 54.68205911619954, -8.144975688090735 | [FarmFinder](https://farmfinder.ie/producer/glenborin); via yourhonestybox.com |
| Lakeside farm | Cionn Caslach (nearest, 2.2 km) | Otros | — | — | 55.05722772588809, -8.340444735070662 | [FarmFinder](https://farmfinder.ie/producer/lakeside-farm); via yourhonestybox.com |
| Procklis | Kilmacrenan (nearest, 1.2 km) | Otros | — | — | 55.038429225454415, -7.79059625123909 | [FarmFinder](https://farmfinder.ie/producer/procklis); via yourhonestybox.com |
| Blas Bakery | Brinlack (nearest, 1.5 km) | Pan y cereal | — | — | 55.129245867235916, -8.272880181880875 | [FarmFinder](https://farmfinder.ie/producer/blas-bakery); via yourhonestybox.com |

## Name and county only — 26

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Drioglann Sliabh Liag CGA | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/drioglann-sliabh-liag-cga) |
| Ulster Mead Co. | — | Miel | listed | — | [FarmFinder](https://farmfinder.ie/producer/ulster-mead-co) |
| Algaran Teo - Organic Seaweed Products Manufacturer | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/algaran-teo-organic-seaweed-products-manufacturer) |
| Atlanfish Ltd | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/atlanfish-ltd) |
| Atlantic Dawn | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/atlantic-dawn) |
| Ballyholey Farm Shop | — | Otros | Farm; Farm Gate, Farm Shops Ireland; also FarmFinder https://farmfinder.ie/producer/ballyholey-farm | — | [FarmFinder](https://farmfinder.ie/producer/ballyholey-farm-shop) |
| Boeshill Organics | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/boeshill-organics) |
| Coco Milis | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/coco-milis) |
| Errigal Bay | — | Otros | listed; also FarmFinder https://farmfinder.ie/producer/errigal | — | [FarmFinder](https://farmfinder.ie/producer/errigal-bay) |
| Gallagher Bros Ltd & Ocean Farm Ltd | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/gallagher-bros-ltd-and-ocean-farm-ltd) |
| Norfish Ltd | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/norfish-ltd) |
| Sliogeisc na Rossan | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/sliogeisc-na-rossan) |
| Tullyhouse Organic Farm | — | Otros | Farm; IOA Member, Organic, Vegetables, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/tullyhouse-organic-farm-co-donegal) |
| Belle's Kitchen | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/belle-s-kitchen) |
| Blistered Bread | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/blistered-bread) |
| Gallaghers Bakery | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/gallaghers-bakery) |
| Odonnells Bakery | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/odonnells-bakery) |
| Promise Gluten Free | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/promise-gluten-free) |
| Wild Fuschia Bakehouse | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/wild-fuschia-bakehouse) |
| Atlantic Treasures Fish Shop | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/atlantic-treasures-fish-shop-donegal) |
| Bells Isle Seafoods Ltd/ Irish Oysters Harvest Ltd. | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/bells-isle-seafoods-ltd-irish-oysters-harvest-ltd) |
| Killybegs Seafoods | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/killybegs-seafoods) |
| Mc Bride Fishing | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/mc-bride-fishing) |
| Premier Fish Products | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/premier-fish-products) |
| Sean Ward (Fish Exports) Ltd | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/sean-ward-fish-exports-ltd) |
| Shines Seafood | — | Pescado | Producer; Seafood, SuperValu Food Academy; also FarmFinder https://farmfinder.ie/producer/killybegs-catch-ltd-shines-seafood | — | [FarmFinder](https://farmfinder.ie/producer/shines-seafood) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
