# Monaghan — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/ulster/monaghan.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/monaghan>, plus each producer
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

## Ready to verify — 5

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Annalitten Foods Ltd | Castleblayney (nearest, 4.5 km) | Huevos | annalitteneggs.ie | (042) 974 3623 | 54.0846127, -6.706800899999999 | [FarmFinder](https://farmfinder.ie/producer/annalitten-foods-ltd); via Bord Bia Origin Green |
| The Nestbox Egg Company | Oram (nearest, 1.8 km) | Huevos | www.goldenirish.com ⚠ | (042) 974 0000 | 54.1378419, -6.71671 | [FarmFinder](https://farmfinder.ie/producer/the-nestbox-egg-company); via Bord Bia Origin Green |
| Greenfield Foods Ltd | Smithborough (nearest, 4.4 km) | Otros | www.greenfieldfoods.ie | (047) 57014 | 54.2420732, -7.1347861 | [FarmFinder](https://farmfinder.ie/producer/greenfield-foods-ltd); via Bord Bia Origin Green |
| Lough Egish Foods | Threemilehouse (nearest, 5.9 km) | Otros | www.swiftfinefoods.com ⚠ | (042) 974 5435 | 54.180126, -6.977547 | [FarmFinder](https://farmfinder.ie/producer/lough-egish-foods); via SuperValu Food Academy |
| Monaghan Mushrooms Group | Castleshane (nearest, 4 km) | Setas ? | www.monaghan-mushrooms.com | (047) 38200 | 54.266734199999995, -6.9052544000000005 | [FarmFinder](https://farmfinder.ie/producer/monaghan-mushrooms-group); via Bord Bia Origin Green |

## Needs one more fact — 24

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Arthur Mallon Foods Ltd | Monaghan | Carne | — | — | — | DAFM meat 406 |
| Connolly Meats Ltd | Scotstown | Carne | — | — | — | DAFM meat 795 |
| Eamon Byrne Butchers | Castleshane (nearest, 4.3 km) | Carne | — | 042 974096 | 54.269123, -6.910021 | [FarmFinder](https://farmfinder.ie/producer/eamon-byrne-butchers); via Irish Butchers Guild |
| Farney Foods Ltd | Carrickmacross | Carne | — | — | — | DAFM meat 2315 |
| Feldhues Gmbh Fleishwaren Production | Clones | Carne | — | — | — | DAFM meat 738 |
| Grove Farm (registered as Grove Turkeys Ltd T/A Grove Farm) | Smithboro | Carne | — | — | — | DAFM meat 807 |
| IGWT Poultry Services Ltd | Castleblayney | Carne | — | — | — | DAFM meat 855 |
| Karro McGee ROI Ltd | Castleblayney | Carne | — | — | — | DAFM meat 2023 |
| Larmer's Butchers Newbliss | Ballinode (nearest, 0.6 km) | Carne | — | 047 54132 | 54.269555, -7.024147 | [FarmFinder](https://farmfinder.ie/producer/larmer-s-butchers-newbliss); via Irish Butchers Guild |
| Malone Food Products | Castleblayney | Carne | — | — | — | DAFM meat 790 |
| McCaughey Foods (registered as Flamewood Ltd. T/A McCaughey Foods) | Castleblayney | Carne | — | — | — | DAFM meat 575 |
| Pilgrim's Food Masters Ireland Limited | Carrickmacross | Carne | — | — | — | DAFM meat 747 |
| Provincial Agri Foods Limited | Carrickmacross | Carne | — | — | — | DAFM meat 2068 |
| Rangeland Foods | Castleblayney | Carne | — | — | — | DAFM meat 717 |
| Silver Hill Foods UC | Emyvale | Carne | — | — | — | DAFM meat 801 |
| St Davnets Hospital Centralised Kitchen | HSE | Carne | — | — | — | FSAI HSE 4074 |
| Stillorgan Trading Post Limited | Swift Fine Foods | Carne | — | — | — | FSAI HSE 4025 |
| The Real Meal Company | Monaghan | Carne | — | — | — | DAFM meat 2977 |
| Creeve | Ballybay (nearest, 3.4 km) | Huevos | — | — | 54.098676801377906, -6.9068979658673095 | [FarmFinder](https://farmfinder.ie/producer/creeve); via yourhonestybox.com |
| Katies Fabulous eggs | Ballybay (nearest, 5.2 km) | Huevos | — | — | 54.176426514709824, -6.910679605900542 | [FarmFinder](https://farmfinder.ie/producer/katies-fabulous-eggs); via yourhonestybox.com |
| Mullinacross | Ballybay (nearest, 2.4 km) | Huevos | — | — | 54.108227091326015, -6.9009105134186495 | [FarmFinder](https://farmfinder.ie/producer/mullinacross); via yourhonestybox.com |
| Grove Turkeys LTD. | Smithborough (nearest, 1.5 km) | Otros | — | (047) 53000 | 54.2249346, -7.102019299999999 | [FarmFinder](https://farmfinder.ie/producer/grove-turkeys-ltd); via Bord Bia Origin Green |
| McBride Trevor | Ballinode (nearest, 4.8 km) | Otros | — | 087 7683111 · trevor@mcbridesbees.com | 54.2485576, -6.9688855 | [FarmFinder](https://farmfinder.ie/producer/mcbride-trevor); via NIHBS |
| The Wrens nest | Threemilehouse (nearest, 5.4 km) | Pan y cereal | — | — | 54.176828231767466, -6.995542121242336 | [FarmFinder](https://farmfinder.ie/producer/the-wrens-nest); via yourhonestybox.com |

## Name and county only — 13

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Camphill Community Ballybay - Camphill Community of Ireland | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/camphill-community-ballybay-camphill-community-of-ireland) |
| Crawley, Kenny | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/crawley-kenny) |
| Subh Fraoċ Bán | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/subh-fraoc-ban) |
| The Grazing Goat | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-grazing-goat) |
| Todd, Malachy - Organic Farm. | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/todd-malachy-organic-farm) |
| Carleton Cakes | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate, Honesty Box; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/carleton-cakes) |
| Celtic Crumb | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/celtic-crumb) |
| Dinkins Bakery | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/dinkins-bakery) |
| Drummully Boxty | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/drummully-boxty) |
| Matilda's Bakery | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/matilda-s-bakery) |
| McCaghey Turkeys Farm Shop & Bakery | — | Pan y cereal | Farm; Bread & Bakery, Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/mccaghey-turkeys-farm-shop-and-bakery) |
| The Gluten Free Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-gluten-free-bakery) |
| Sole & Sea | — | Pescado | Producer; Seafood | — | [FarmFinder](https://farmfinder.ie/producer/sole-and-sea-monaghan) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
