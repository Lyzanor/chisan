# Mayo — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/mayo.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/mayo>, plus each producer
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

## Held after verification — 2

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| IrishAmerican Distillery | Destilados y licores | IrishAmerican Whiskeys publishes an 'Our Distillery' page but no address or production detail; whether it operates a distillery in Mayo or bonds sourced whiskey is unresolved. |
| Ryan's Food Emporium | Carne | Ryan's Food Emporium in Cong publishes butchery, deli, bakery and catering under one roof; which products it makes rather than resells is unresolved. Its municipio is Cong, not Westport. |

## Needs one more fact — 30

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Andarl Farm Ltd | Castlebar | Carne | — | — | — | DAFM meat 2950 |
| Carolan's Meats | Castlebar (nearest, 0.8 km) | Carne | — | (094) 925 0655 | 53.857824, -9.309544 | [FarmFinder](https://farmfinder.ie/producer/carolan-s-meats); via Associated Craft Butchers of Ireland |
| Clive's Butcher Shop | Aughagower (nearest, 1.6 km) | Carne | — | (094) 925 7489 | 53.750473, -9.454357 | [FarmFinder](https://farmfinder.ie/producer/clive-s-butcher-shop); via Associated Craft Butchers of Ireland |
| Dunleavy Meats Ltd. | Ballina | Carne | — | — | — | DAFM meat 407 |
| Gerry Joyce Meats | Castlebar | Carne | — | — | — | DAFM meat 2402 |
| Keane's Meats Newport | Killawalla (nearest, 6.2 km) | Carne | — | (098) 41466 | 53.708486, -9.410046 | [FarmFinder](https://farmfinder.ie/producer/keane-s-meats-newport); via Associated Craft Butchers of Ireland |
| Kelly's of Newport (Artisan Butchers) LTD | Newport | Carne | — | — | — | DAFM meat 2405 |
| Martin Jennings Wholesale Ltd | Ballinrobe | Carne | — | — | — | DAFM meat 372 |
| MJI Meats Ltd | Ballyhaunis | Carne | — | — | — | DAFM meat 2595 |
| Nourfoods | Ballyhaunis | Carne | — | — | — | DAFM meat 2812 |
| Reilly Butchers Bangor | Ballina (nearest, 0.5 km) | Carne | — | (097) 83558 | 54.112361, -9.162805 | [FarmFinder](https://farmfinder.ie/producer/reilly-butchers-bangor); via Associated Craft Butchers of Ireland |
| Tolan's Butchers | Aughagower (nearest, 1.3 km) | Carne | — | (096) 30039 | 53.752086, -9.463581 | [FarmFinder](https://farmfinder.ie/producer/tolan-s-butchers); via Associated Craft Butchers of Ireland |
| Tony Carolan | Castlebar | Carne | — | — | — | DAFM meat 2684 |
| Western Brand Group Unlimited | Ballyhaunis | Carne | — | — | — | DAFM meat 818 |
| The Connacht Whiskey Company | Ballina (nearest, 1.5 km) | Destilados y licores | — | — | 54.1218331, -9.144966 | OSM way/472648066 |
| Market Tea Rooms | Ballina (nearest, 0.7 km) | Dulces y repostería | — | — | 54.1150422, -9.1558316 | OSM node/3107171978 |
| An Siopa Beag | Crossmolina (nearest, 5.5 km) | Huevos | — | — | 54.141458408277245, -9.271773890585353 | [FarmFinder](https://farmfinder.ie/producer/an-siopa-beag); via yourhonestybox.com |
| Castlebar | Breaffy (nearest, 1.4 km) | Huevos | — | — | 53.8394760860269, -9.21745851410428 | [FarmFinder](https://farmfinder.ie/producer/castlebar); via yourhonestybox.com |
| Hollie’s Farm eggs | Cill Ghallagáin (nearest, 1.1 km) | Huevos | — | — | 54.309519886843944, -9.831690022625523 | [FarmFinder](https://farmfinder.ie/producer/hollie-s-farm-eggs); via yourhonestybox.com |
| Dozio's of Mayo Ltd | Barroe Carracastle Ballaghaderreen Co. | Lácteos y quesos | — | — | — | DAFM dairy IE2113 |
| Michael McGrath & Sinéad Moran | Gleann Buí Farm Aghamore | Lácteos y quesos | — | — | — | DAFM dairy IE2196 |
| Rockfield Dairy Ltd | Unit 2, Clar Business | Lácteos y quesos | — | — | — | DAFM dairy IE 2004 |
| Velvet Cloud Sheep Yogurt | Ballintubber (nearest, 3.5 km) | Lácteos y quesos | — | — | 53.727259, -9.352503 | [FarmFinder](https://farmfinder.ie/producer/velvet-cloud-sheep-yogurt); via SuperValu Food Academy |
| Boherhallagh Bees | Foxford (nearest, 3.2 km) | Miel ? | — | — | 54.00327171612408, -9.082187622299022 | [FarmFinder](https://farmfinder.ie/producer/boherhallagh-bees); via yourhonestybox.com |
| BenRock Farm | Castlebar (nearest, 4.2 km) | Otros | — | 085 846 1892 · Smileyachill@hotmail.com | 53.889691, -9.340686 | [FarmFinder](https://farmfinder.ie/producer/benrock-farm) |
| Hill Valley Farm | Midfield (nearest, 4.5 km) | Otros | — | — | 53.918860931428064, -8.86894514604799 | [FarmFinder](https://farmfinder.ie/producer/hill-valley-farm); via yourhonestybox.com |
| Cornrue Bakery | — | Pan y cereal | www.cornrue.com | — | — | [FarmFinder](https://farmfinder.ie/producer/cornrue-bakery) |
| The Butty Bakery | Ardowen (nearest, 1.8 km) | Pan y cereal | — | — | 54.24975753451119, -10.030421590502558 | [FarmFinder](https://farmfinder.ie/producer/the-butty-bakery); via yourhonestybox.com |
| Savoir Fare | Westport (nearest, 1.1 km) | Vino | — | — | 53.7991255, -9.5226976 | OSM node/10696843800 |
| The Gallery | Westport (nearest, 1.2 km) | Vino | — | — | 53.7990972, -9.5216504 | OSM node/10696875389 |

## Name and county only — 17

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Achill Mountain Lamb | — | Carne | Farm; Beef, Lamb, Pork, Poultry; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/achill-mountain-lamb) |
| Calvey's Family Butchers | Keel (nearest, 1 km) | Carne | shop=butcher | +353 98 43158 | OSM node/6920743987 |
| Calvey's on-Farm Abattoir Butchers | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | [FarmFinder](https://farmfinder.ie/producer/calvey-s-on-farm-abattoir-butchers) |
| Drioglann Acla Teoranta | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/drioglann-acla-teoranta) |
| Velvet Cloud Yoghurt | — | Lácteos y quesos | listed | — | [FarmFinder](https://farmfinder.ie/producer/velvet-cloud-yoghurt) |
| Blackshell Farm Ltd | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/blackshell-farm-ltd) |
| Blas Glas | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/blas-glas) |
| Eamonn McDonagh | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/eamonn-mcdonagh) |
| Enniscoe Organic Garden | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/enniscoe-organic-garden) |
| Gleann Buí Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/gleann-bu-farm) |
| Clare Island Oven | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/clare-island-oven) |
| The Store Next Door | Westport (nearest, 1 km) | Pan y cereal | shop=bakery | +353 98 25003 | OSM way/529166030 |
| Clarkes Salmon Smokery | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/clarkes-salmon-smokery) |
| Connamara Smoke House | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/connamara-smoke-house-mayo) |
| Connemara Seafoods | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/connemara-seafoods) |
| The Fish Shop | — | Pescado | listed; also FarmFinder https://farmfinder.ie/producer/duanes-fish-shop-mayo | — | [FarmFinder](https://farmfinder.ie/producer/the-fish-shop-mayo) |
| West Coast Crab Sales Ltd | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/west-coast-crab-sales-ltd) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
