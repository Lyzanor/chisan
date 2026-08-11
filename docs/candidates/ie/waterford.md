# Waterford — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/waterford.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/waterford>, plus each producer
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

## Ready to verify — 9

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Billy Murphy Craft Butchers | Waterford | Carne | www.billymurphy.ie | — | 52.250137, -7.136335 | OSM node/7985139815 |
| Dunphy's Butchers | Waterford | Carne | www.waterfordshoppingcentrelisduggan.com/dunphys ⚠ | — | 52.2502296, -7.137041 | OSM node/660310485 |
| Curraghmore Whiskey Ltd | Portlaw (nearest, 3 km) | Destilados y licores | www.curraghmorewhiskey.com | 089 988 7724 | 52.290146899999996, -7.359272099999999 | [FarmFinder](https://farmfinder.ie/producer/curraghmore-whiskey-ltd); via Bord Bia Origin Green |
| O'Connell Whiskey Merchants | Kilmacthomas (nearest, 1.2 km) | Destilados y licores | wdoconnell.com | (051) 340 044 | 52.200986699999994, -7.406964899999999 | [FarmFinder](https://farmfinder.ie/producer/oconnell-whiskey-merchants); via Bord Bia Origin Green |
| GIY | Ardkeen (nearest, 0.6 km) | Fruta y verdura ? | giy.ie/pages/weekly-veg-box | 051 584422 | 52.2470868, -7.0809359 | [FarmFinder](https://farmfinder.ie/producer/giy); via Food Culture Ireland |
| E Flahavan & Sons Ltd | Kilmacthomas (nearest, 0.4 km) | Otros | flahavans.ie | (051) 294 107 | 52.2101005, -7.4252702 | [FarmFinder](https://farmfinder.ie/producer/e-flahavan-and-sons-ltd); via Bord Bia Origin Green |
| Flavahans | Kilmacthomas (nearest, 1.6 km) | Otros | flahavans.ie ⚠ | (051) 294 107 | 52.2192321, -7.4333254 | [FarmFinder](https://farmfinder.ie/producer/flavahans); via SuperValu Food Academy |
| Newbard Organic Farm Ltd | Cappoquin (nearest, 3.5 km) | Otros | www.newbardfarm.com | 0851893774 | 52.1724543, -7.9131569 | [FarmFinder](https://farmfinder.ie/producer/newbard-organic-farm-ltd); via Food Culture Ireland |
| The Italian Bakery | Waterford | Pan y cereal | thestableyard.ie/italian-bakery ⚠ | — | 52.2613298, -7.112283 | OSM node/10011652111 |

## Needs one more fact — 25

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Dawn Grannagh (registered as Dawn Meats Ireland UC T/A Dawn Grannagh) | Grannagh | Carne | — | — | — | DAFM meat 350 |
| Fresh Food Courtyard | Dungarvan (nearest, 1.6 km) | Carne | — | 058 75830 | 52.084175, -7.616104 | [FarmFinder](https://farmfinder.ie/producer/fresh-food-courtyard); via Irish Butchers Guild |
| Jack Molloy & Son | Ferrybank (nearest, 0.5 km) | Carne | — | — | 52.265025, -7.111876 | [FarmFinder](https://farmfinder.ie/producer/jack-molloy-and-son); via Associated Craft Butchers of Ireland |
| McGrath's Family Butchers | Lismore (nearest, 1.1 km) | Carne | — | — | 52.1306, -7.918522 | [FarmFinder](https://farmfinder.ie/producer/mcgrath-s-family-butchers); via Associated Craft Butchers of Ireland |
| Molloy's Butchers Ardkeen | Waterford (nearest, 0.2 km) | Carne | — | — | 52.258018, -7.116226 | [FarmFinder](https://farmfinder.ie/producer/molloy-s-butchers-ardkeen); via Associated Craft Butchers of Ireland |
| Murphy Quality Meats (registered as Billy Murphy T/A Murphy Quality Meats) | Waterford | Carne | — | — | — | DAFM meat 2618 |
| O'Flynn Meats | Gracedieu | Carne | — | — | — | DAFM meat 2477 |
| Philip Egan Meats | Waterford | Carne | — | — | — | DAFM meat 2827 |
| The Old Distillery | Clashmore (nearest, 1 km) | Destilados y licores | — | — | 52.008814, -7.8178592 | OSM way/775650532 |
| GIY Organic Veg Box | — | Fruta y verdura | giy.ie/pages/giy-organic-veg-box | — | — | [FarmFinder](https://farmfinder.ie/producer/giy-organic-veg-box); via FarmFinder Team |
| Baldwin's Farmhouse Ice Cream (registered as Mr Thomas Baldwin) | Killeenagh, Knockanore, Co. Waterford | Helados | — | — | — | DAFM dairy IE1943 |
| Ballyconnery Bó (registered as Carmel & John Kiely) | Currabaha_x000D_ Colligan_x000D_ Dungarvan_x000D_ Co | Lácteos y quesos | — | — | — | DAFM dairy IE2195 |
| Early Bird Free Range Eggs | Tooraneena (nearest, 1.5 km) | Lácteos y quesos | — | 087 650 6486 | 52.1916967, -7.7338947 | [FarmFinder](https://farmfinder.ie/producer/early-bird-free-range-eggs); via SuperValu Food Academy |
| Freezin' Friesian (registered as Lisfield Dairy Ltd) | Ballyhussa Kilmacthomas Co Waterford | Lácteos y quesos | — | — | — | DAFM dairy IE2151 |
| Irish Gourmet Butter (registered as William Sharpe) | Unit 8, 9 & | Lácteos y quesos | — | — | — | DAFM dairy IE2128 |
| Knockanore Farmhouse Cheese Co Ltd | Ballyneety Knockanore Co Waterford | Lácteos y quesos | — | — | — | DAFM dairy IE1837 |
| Mahon Valley Milk Ltd | Union Road Kilmacthomas Co | Lácteos y quesos | — | — | — | DAFM dairy IE2212 |
| Colette O' Connell | Waterford (nearest, 0.6 km) | Otros | — | 086 3904817 · coletteoconnell@ymail.com | 52.2609997, -7.1119081 | [FarmFinder](https://farmfinder.ie/producer/colette-o-connell); via NIHBS |
| Haven lodge hens and ducks | Mahon Bridge (nearest, 3 km) | Otros | — | — | 52.19089753364514, -7.45898377249963 | [FarmFinder](https://farmfinder.ie/producer/haven-lodge-hens-and-ducks); via yourhonestybox.com |
| Lismore Food Company | Cappoquin (nearest, 0.9 km) | Otros | — | — | 52.151046, -7.936399 | [FarmFinder](https://farmfinder.ie/producer/lismore-food-company); via SuperValu Food Academy |
| PineGroveCottage | Middle Third (nearest, 1.7 km) | Otros | — | — | 52.22055450835145, -7.206743772384486 | [FarmFinder](https://farmfinder.ie/producer/pinegrovecottage); via yourhonestybox.com |
| Tiramisu Da' Costa Family | Waterford (nearest, 0.7 km) | Otros | — | Dacostafamily@outlook.ie | 52.2555382, -7.1090808 | [FarmFinder](https://farmfinder.ie/producer/tiramisu-da-costa-family); via NeighbourFood |
| Whole Living Nutrition | Waterford (nearest, 0.6 km) | Otros | — | wholelivingnutrition1@gmail.com | 52.2609997, -7.1119081 | [FarmFinder](https://farmfinder.ie/producer/whole-living-nutrition); via NeighbourFood |
| Aishu Patisserie | Decies-without-Drum (nearest, 5 km) | Pan y cereal ? | — | aishpatisserie@gmail.com | 52.1509131, -7.6577982 | [FarmFinder](https://farmfinder.ie/producer/aishu-patisserie); via NeighbourFood |
| Seagull Bakery | Waterford | Pan y cereal | — | — | — | [FarmFinder](https://farmfinder.ie/producer/seagull-bakery) |

## Name and county only — 27

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Billy Burke Fish & Poultry | — | Carne | listed | — | [FarmFinder](https://farmfinder.ie/producer/billy-burke-fish-and-poultry) |
| Molloys Butchers | Waterford | Carne | shop=butcher | +353 51 375 333 | OSM node/5556721530 |
| Coffee House Lane | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/coffee-house-lane) |
| Dugarvan Brewing Company | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/dugarvan-brewing-company) |
| Hopfully Brewing | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/hopfully-brewing) |
| Metalman Brewing | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/metalman-brewing) |
| Blackwater Distillery | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/blackwater-distillery) |
| Clashganny Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/clashganny-farm) |
| Clinton, Olivia | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/clinton-olivia) |
| Garraí Mara Organic Farm | — | Otros | Farm; Organic, Vegetables, Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/garra-mara-organic-farm) |
| Ginger & Co. | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/ginger-and-co) |
| Glenpatrick | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/glenpatrick) |
| Granny Maddocks Pantry | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/granny-maddocks-pantry) |
| GROW HQ | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/grow-hq) |
| J. O'Doherty | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/j-odoherty-waterford) |
| Meitheal Trá na Rinne Teo | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/meitheal-tr-na-rinne-teo) |
| Niamh's Trawler Catch | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/niamhs-trawler-catch-waterford) |
| Viking Irish Drinks | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/viking-irish-drinks) |
| Waterford City Saturday Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/waterford-city-saturday-market) |
| Beatha Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/beatha-bakery) |
| Dún Artisan Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/d-n-artisan-bakery) |
| The Bakehouse Tramore | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/the-bakehouse-tramore) |
| Walsh's Bakery | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate, remaining), About; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/walsh-s-bakery) |
| Dungarvan Shellfish Ltd | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/dungarvan-shellfish-ltd) |
| Flanagan Fish Merchant | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/flanagan-fish-merchant-waterford) |
| Ronan's Fish Shop | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/ronans-fish-shop-waterford) |
| Legacy Cider | — | Sidra | listed | — | [FarmFinder](https://farmfinder.ie/producer/legacy-cider) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
