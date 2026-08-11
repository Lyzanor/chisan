# Wicklow — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/wicklow.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/wicklow>, plus each producer
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

## Held after verification — 5

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Dr Coys Health Foods | Otros | Dr. Coy's publishes an office at The Cova, Trafalgar Road, Greystones and a chocolate and health-food range but no production site; whether it makes rather than commissions the range is unresolved. |
| Keadeen Mountain Farms | Otros | Keadeen Mountain Farms publishes only 'Co. Wicklow'; its candidate municipio Kiltegan is an inferred nearest settlement 3.7 km from the source coordinate. |
| National Organic Products Ltd | Otros | National Organic Products publishes the Bunalun Organic grocery brand across many product lines but no production site; whether it makes rather than commissions its range is unresolved. |
| O'Hanlon's Herbs | Fruta y verdura | The site answers a SiteGround bot challenge (HTTP 202 with an sgcaptcha redirect) on every automated route tried, including a second user-agent, both schemes and the www variant. A challenge is not a dead site: the lead is unresolved, not excluded, and needs a browser session. |
| Sally Gap Foods | Otros | The site carried for Sally Gap Foods is powerscourthotel.com, which answers a Cloudflare interstitial; the URL belongs to a hotel and must not be carried. |

## Needs one more fact — 35

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Avoca Handweavers Limited | Central Production Unit | Carne | — | — | — | FSAI HSE 4019 |
| Butler's Pantry | 16-17 Southern Cross Business ParkBoghal | Carne | — | — | — | FSAI HSE 4004 |
| Dale Meats Ltd | Bray | Carne | — | — | — | DAFM meat 2375 |
| Derek Dunne Craft Butchers | Wicklow (nearest, 1.6 km) | Carne | — | — | 52.9848, -6.053539 | [FarmFinder](https://farmfinder.ie/producer/derek-dunne-craft-butchers); via Associated Craft Butchers of Ireland |
| Dun Luain Foods Ltd | Dunlavin | Carne | — | — | — | DAFM meat 2641 |
| Dunnes of Wicklow | Rathnew | Carne | — | — | — | DAFM meat 2696 |
| Eugene's Butchers | Wicklow (nearest, 3.5 km) | Carne | — | — | 53.006186, -6.011362 | [FarmFinder](https://farmfinder.ie/producer/eugene-s-butchers); via Associated Craft Butchers of Ireland |
| Farrelly's Butchers | Ashford (nearest, 1.9 km) | Carne | — | — | 53.027052, -6.113966 | [FarmFinder](https://farmfinder.ie/producer/farrelly-s-butchers); via Associated Craft Butchers of Ireland |
| Frank Doyle FD Meats | Bray | Carne | — | — | — | DAFM meat 2912 |
| Gather and Gather Ltd. | Unit 3 | Carne | — | — | — | FSAI HSE 4088 |
| Glenhaven Foods (Arklow) Unlimited Company | Arklow | Carne | — | — | — | DAFM meat 830 |
| Italicatessen Ltd | Block F Newtown Business & Enterprise Ce | Carne | — | — | — | FSAI HSE 4071 |
| Keith Grant Master Butchers | Wicklow (nearest, 2.5 km) | Carne | — | — | 52.987783, -5.999285 | [FarmFinder](https://farmfinder.ie/producer/keith-grant-master-butchers); via Associated Craft Butchers of Ireland |
| Le Paysan of Wicklow Limited | Unit W11 Wicklow Enterprise ParkThe Murr | Carne | — | — | — | FSAI HSE 4072 |
| Little Dinners Ltd | Enterprise Unit 2Rathdrum | Carne | — | — | — | FSAI HSE 4018 |
| Mitchell's Village Butchers | Ashford (nearest, 0.7 km) | Carne | — | — | 53.00432, -6.118713 | [FarmFinder](https://farmfinder.ie/producer/mitchell-s-village-butchers); via Associated Craft Butchers of Ireland |
| Nutriquick Limited | Unit 4 Blessington Industrial EstateBles | Carne | — | — | — | FSAI HSE 4066 |
| Pilgrim's Food Masters Ireland Ltd | Shillelagh | Carne | — | — | — | DAFM meat 501 |
| The Good Life Company (registered as Steven Goode T/A The Good Life Company) | Arklow | Carne | — | — | — | DAFM meat 2893 |
| The Hatchery (registered as Glenhaven Foods (Arklow) Unlimited T/A The Hatchery) | Avoca | Carne | — | — | — | DAFM meat 2058 |
| Beaky Dargus Brewing Co. | Grangecon | Cerveza | — | +353868963643 · beakydargus@gmail.com | — | [FarmFinder](https://farmfinder.ie/producer/beaky-dargus-brewing-co) |
| The Great Eastern Brewing Co. | Wicklow | Cerveza | — | greateasternbrewing@gmail.com | — | [FarmFinder](https://farmfinder.ie/producer/the-great-eastern-brewing-co) |
| An Tairseach Organic Veg Box | — | Fruta y verdura | www.antairseach.ie | — | — | [FarmFinder](https://farmfinder.ie/producer/an-tairseach-organic-veg-box); via FarmFinder Team |
| Goldenhill Farmhouse Ice cream (registered as Aoife and Damien Clarke) | Goldenhill Farm Goldenhill Three | Helados | — | — | — | DAFM dairy IE1927 |
| The Fluffy Ladies’ Eggs | Kilcoole (nearest, 1.5 km) | Huevos | — | — | 53.11943365664121, -6.071143298751648 | [FarmFinder](https://farmfinder.ie/producer/the-fluffy-ladies-eggs); via yourhonestybox.com |
| Ballyhubbock Farm (registered as Mr George Finlay & Ms Hanna Sheerin) | Ballyhubbock Farm Ballyhubbock Lower | Lácteos y quesos | — | — | — | DAFM dairy IE2136 |
| Coolattin Cheddar | Newcastle (nearest, 2.7 km) | Lácteos y quesos | — | — | 53.031834, -5.998495 | [FarmFinder](https://farmfinder.ie/producer/coolattin-cheddar); via SuperValu Food Academy |
| Fusco Connell (registered as Fusco Foods Ltd) | Kilcoole Industrial Estate Unit | Lácteos y quesos | — | — | — | DAFM dairy 1719 |
| Clarkes Farm | Lacken (nearest, 2.6 km) | Otros | — | — | 53.145708185494, -6.5114664527058 | [FarmFinder](https://farmfinder.ie/producer/clarkes-farm); via yourhonestybox.com |
| Daisy Cottage Farm | Kiltegan (nearest, 2.2 km) | Otros | — | — | 52.89096899514637, -6.581946139080052 | [FarmFinder](https://farmfinder.ie/producer/daisy-cottage-farm); via yourhonestybox.com |
| Organic Delights - Denis Healy | Kiltegan (nearest, 4 km) | Otros | — | 087 248 5826 | 52.9347959, -6.639136799999999 | [FarmFinder](https://farmfinder.ie/producer/organic-delights-denis-healy); via Organic Trust |
| Tara, Kilmurray south, Red Lane | Kilmacanogue (nearest, 2.5 km) | Otros | — | — | 53.14508786352908, -6.137385813928764 | [FarmFinder](https://farmfinder.ie/producer/tara-kilmurray-south-red-lane); via yourhonestybox.com |
| the Happy Pear | Barndarrig (nearest, 4.7 km) | Otros | — | — | 52.928221, -6.045823 | [FarmFinder](https://farmfinder.ie/producer/the-happy-pear); via SuperValu Food Academy |
| Wicklow Rapeseed Oil | Wicklow (nearest, 0.9 km) | Otros | — | — | 52.98112, -6.045236 | [FarmFinder](https://farmfinder.ie/producer/wicklow-rapeseed-oil); via SuperValu Food Academy |
| Wicklow Wolf | Wicklow (nearest, 1.4 km) | Otros | — | — | 52.98897, -6.043142 | [FarmFinder](https://farmfinder.ie/producer/wicklow-wolf); via Food Culture Ireland |

## Name and county only — 24

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| D. Murphy | Tinahely | Carne | shop=butcher | +353 402 38127 | OSM way/1110328121 |
| Vartry Coffee | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/vartry-coffee) |
| Glendalough Irish Whiskey | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/glendalough-irish-whiskey) |
| Powerscourt Distillery | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/powerscourt-distillery) |
| Acton’s | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/actons) |
| Altidore Farm - Philip Emmet | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/altidore-farm-philip-emmet) |
| Castleruddery Organic Farm | — | Otros | Farm; Organic, Vegetables, Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/castleruddery-organic-farm) |
| Denis Healy - Certified Organic Grower | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/denis-healy-certified-organic-grower) |
| Drea, Sean | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/drea-sean) |
| Garden County Organics | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/garden-county-organics) |
| Killruddery Farm Shop | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/killruddery-farm-shop) |
| Kilmullen Farm | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/kilmullen-farm) |
| Kush Seafarms Ltd | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/kush-seafarms-ltd) |
| Monika's Biscuits | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/monika-s-biscuits) |
| Organic Life | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/organic-life) |
| The Shepherd’s Pantry | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-shepherds-pantry) |
| Tinahely Farm Shop, Restaurant & Children's Activity Barn | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/tinahely-farm-shop-restaurant-and-children-s-activity-barn) |
| Waterfall Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/waterfall-farm) |
| Wicklow Town Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/wicklow-town-market) |
| Wicklow Way Wines | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/wicklow-way-wines) |
| Firehouse Bakery | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/firehouse-bakery) |
| Grá Arán | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/gr-ar-n) |
| Slow Dough Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/slow-dough-bakery) |
| Stone Oven Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/stone-oven-bakery) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
