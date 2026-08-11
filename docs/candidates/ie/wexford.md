# Wexford — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/wexford.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/wexford>, plus each producer
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

## Held after verification — 6

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Boyle's Butchers | Carne | Boylesbutchers.ie serves a "Coming soon" placeholder while the site is rebuilt. That is not proof of closure; the butcher needs another current source. |
| Firehouse Bakery | Pan y cereal | Firehouse Bakery publishes its bakery and cookery school at Delgany, Co. Wicklow alongside Wexford and Cork Eircodes; which unit belongs in Wexford is unresolved. |
| Kelly's Bakery | Pan y cereal | The SiteGround challenge did not clear in a browser session either; on this host it sometimes auto-redirects and sometimes escalates to a hand-solved captcha. It needs a person in a browser. |
| OUTCAST BRANDS | Otros | Blood Monkey Gin publishes a brand and shop for Outcast Brands but no distillery, address or production detail; whether a productive unit exists in Wexford is unresolved. |
| Stafford Spirits Ltd | Destilados y licores | Jackfordspirits.com serves a Plesk default page with no site behind it; Stafford Spirits needs a current source and the URL must not be carried. |
| Wilton Mills | Otros | Wilton Mills at Bree publishes a small organic farm with animals and accommodation but no food offer; what it sells is unresolved. |

## Needs one more fact — 33

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Alan Redmond Butchers | Gorey (nearest, 1.7 km) | Carne | — | — | 52.662541, -6.281166 | [FarmFinder](https://farmfinder.ie/producer/alan-redmond-butchers); via Associated Craft Butchers of Ireland |
| Butchers Best | Rosbercon (village) (nearest, 0.3 km) | Carne | — | — | 52.398459, -6.955513 | [FarmFinder](https://farmfinder.ie/producer/butchers-best); via Associated Craft Butchers of Ireland |
| Doyle & Sons Butchers | Wexford (nearest, 1 km) | Carne | — | — | 52.333322, -6.474135 | [FarmFinder](https://farmfinder.ie/producer/doyle-and-sons-butchers); via Associated Craft Butchers of Ireland |
| Drover Foods Ltd | Wexford | Carne | — | — | — | DAFM meat 546 |
| Furlong Family Butchers | Gorey (nearest, 1.7 km) | Carne | — | — | 52.662308, -6.300649 | [FarmFinder](https://farmfinder.ie/producer/furlong-family-butchers); via Associated Craft Butchers of Ireland |
| John Pettitt | Murrintown | Carne | — | — | — | DAFM meat 3053 |
| Kavanagh Meats Enniscorthy ULC | Enniscorthy | Carne | — | — | — | DAFM meat 404 |
| Kennedy's Butchers Bunclody | Bunclody (nearest, 0.9 km) | Carne | — | — | 52.644109, -6.65966 | [FarmFinder](https://farmfinder.ie/producer/kennedy-s-butchers-bunclody); via Associated Craft Butchers of Ireland |
| M&M Meats | Enniscorthy (nearest, 0.8 km) | Carne | — | — | 52.504906, -6.554778 | [FarmFinder](https://farmfinder.ie/producer/mandm-meats); via Associated Craft Butchers of Ireland |
| O'Neills Dry Cure Bacon Co (registered as O'Neills Foods LTD T/A O'Neills Dry Cure Bacon Co) | Enniscorthy | Carne | — | — | — | DAFM meat 2851 |
| Pettits Kitchen | Sleedagh Farm Sleedagh Murrintown | Carne | — | — | — | FSAI HSE 4093 |
| Stafford's Butchers | Enniscorthy (nearest, 0.9 km) | Carne ? | — | — | 52.495043, -6.558051 | [FarmFinder](https://farmfinder.ie/producer/stafford-s-butchers); via Associated Craft Butchers of Ireland |
| The Saucy Butcher | Wexford (nearest, 1 km) | Carne ? | — | — | 52.346395, -6.466512 | [FarmFinder](https://farmfinder.ie/producer/the-saucy-butcher); via Associated Craft Butchers of Ireland |
| Zanna Cookhouse Limited (Clonard) | Whitemill Industrial estateClonardWexfor | Carne | — | — | — | FSAI HSE 4092 |
| Clever Man | Wexford | Cerveza | — | — | 52.3289618, -6.4927969 | OSM node/10816143284 |
| Wexford Home Preserves | Wexford (nearest, 0.1 km) | Conservas ? | — | — | 52.339667, -6.461931 | [FarmFinder](https://farmfinder.ie/producer/wexford-home-preserves); via SuperValu Food Academy |
| Greenhill Fruit Farm Ltd | Bree (nearest, 3.2 km) | Fruta y verdura | — | 086 825 7389 | 52.440025299999995, -6.6511301 | [FarmFinder](https://farmfinder.ie/producer/greenhill-fruit-farm-ltd); via Bord Bia Origin Green |
| Natural Ice cream Wholesale Ltd | Unit 12 Wexford Enterprise | Helados | — | — | — | DAFM dairy IE 1997 |
| Egg & Spud Shed | Craanford (nearest, 3.2 km) | Huevos | — | — | 52.65491285359227, -6.375598222387905 | [FarmFinder](https://farmfinder.ie/producer/egg-spud-shed); via yourhonestybox.com |
| Coolhull Farm Ltd | Strandfield Business Park, Rosslare | Lácteos y quesos | — | — | — | DAFM dairy IE1009 |
| FairField farm fresh milk | Enniscorthy (nearest, 2.8 km) | Lácteos y quesos | — | +353871313380 | 52.5041658, -6.6065339 | [FarmFinder](https://farmfinder.ie/producer/fairfield-farm-fresh-milk); via NeighbourFood |
| Future Nutrition Ltd | Railway Stores Templeshannon Enniscorthy | Lácteos y quesos | — | — | — | DAFM dairy 1718 |
| Killowen Farm (registered as Greenvalley Farms Ltd) | Killowen Farm The Beeches | Lácteos y quesos | — | — | — | DAFM dairy IE1875 |
| Saltrock Dairy Ltd | Kildermot Gorey Co Wexford | Lácteos y quesos | — | — | — | DAFM dairy IE2167 |
| Tara Hill Honey | Wexford (nearest, 0.8 km) | Miel | — | — | 52.335461, -6.451159 | [FarmFinder](https://farmfinder.ie/producer/tara-hill-honey); via SuperValu Food Academy |
| Aldridge Farm | Duncannon (nearest, 2.1 km) | Otros | — | — | 52.21256482189792, -6.903731738058232 | [FarmFinder](https://farmfinder.ie/producer/aldridge-farm); via yourhonestybox.com |
| Clone/Ferns | Johnswell (nearest, 4.9 km) | Otros | — | — | 52.73188713847757, -7.224506799041479 | [FarmFinder](https://farmfinder.ie/producer/clone-ferns); via yourhonestybox.com |
| Fat tomato | Ballyoughter (nearest, 3.1 km) | Otros | — | — | 52.591571161486115, -6.398107678072393 | [FarmFinder](https://farmfinder.ie/producer/fat-tomato-wexford); via yourhonestybox.com |
| Isle of Crackers | Ballygarrett (nearest, 2.4 km) | Otros | — | 087 398 3248 | 52.5922415, -6.2153588 | [FarmFinder](https://farmfinder.ie/producer/isle-of-crackers); via SuperValu Food Academy |
| Jacob Blackcurrants | Bree (nearest, 2.8 km) | Otros | — | +353539239570 · birnamlodge@gmail.com | 52.4601875, -6.6065155 | [FarmFinder](https://farmfinder.ie/producer/jacob-blackcurrants); via NeighbourFood |
| Sadies Hen house | Camolin (nearest, 3.5 km) | Otros | — | — | 52.626356703535365, -6.473089953093369 | [FarmFinder](https://farmfinder.ie/producer/sadies-hen-house); via yourhonestybox.com |
| Slaney Valley | Curracloe (nearest, 2 km) | Otros | — | — | 52.411232, -6.388304 | [FarmFinder](https://farmfinder.ie/producer/slaney-valley); via SuperValu Food Academy |
| The Hot box | Ferns (nearest, 2.1 km) | Otros | — | — | 52.57916523141672, -6.479853068470551 | [FarmFinder](https://farmfinder.ie/producer/the-hot-box); via yourhonestybox.com |

## Name and county only — 24

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Naturally Cordial Ltd | — | Bebidas sin alcohol | listed | — | [FarmFinder](https://farmfinder.ie/producer/naturally-cordial-ltd) |
| The Farm Shop Wexford & The Cheeky cow Coffee | — | Café | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-farm-shop-wexford-and-the-cheeky-cow-coffee) |
| T. Cahill Craft Butcher | Ferns | Carne | shop=butcher | — | OSM node/1768112943 |
| Brennan's Brewery | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/brennans-brewery) |
| Yellowbelly Beer | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/yellowbelly-beer) |
| Ballycross Apple Farm | — | Fruta y verdura | Farm; Fruit, Vegetables, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/ballycross-apple-farm) |
| Greens Berry Farm | — | Fruta y verdura | Farm; Fruit, Vegetables, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/greens-berry-farm) |
| Killowen Yoghurt | — | Lácteos y quesos | listed | — | [FarmFinder](https://farmfinder.ie/producer/killowen-yoghurt); via NeighbourFood |
| Courtown Sea Angling Centre | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/courtown-sea-angling-centre-wexford) |
| Gilbert, Shay | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/gilbert-shay) |
| Green's Farm Shop | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/greens-farm-shop) |
| J. Caxard | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/j-caxard-wexford) |
| Kavanagh, Andy | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/kavanagh-andy) |
| Kilmore seafresh | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/kilmore-seafresh) |
| Mannion’s Farm Shop | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/mannion-s-farm-shop) |
| Regan Organic Farm | — | Otros | Farm; Organic, Vegetables, Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/regan-organic-farm) |
| Sofrimar | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/sofrimar) |
| The Strand Cahore | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-strand-cahore) |
| Wexford Town Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/wexford-town-market) |
| Wheelock Fruits | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/wheelock-fruits) |
| Irish Pride Bakery | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/irish-pride-bakery) |
| Kingfisher Fresh Ltd/ Wild Irish Seafoods | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/kingfisher-fresh-ltd-wild-irish-seafoods) |
| Meyler's Fish Merchants | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/meylers-fish-merchants-wexford) |
| Seaview Fresh Fish Shop | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/seaview-fresh-fish-shop-wexford) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
