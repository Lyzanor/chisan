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

## Ready to verify — 21

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Irish Decal Products Ltd. T/A Brady's Coffee Company | Kilcoole (nearest, 0.7 km) | Café | www.bradyscoffee.ie | (01) 201 1016 | 53.1002005, -6.061385899999999 | [FarmFinder](https://farmfinder.ie/producer/irish-decal-products-ltd-t-a-bradys-coffee-company); via Bord Bia Origin Green |
| McCabe's Coffee LTD | Newtownmountkennedy (nearest, 0.6 km) | Café | mccabecoffee.com/?utm_source=google&utm_medium=gbp | (01) 437 0877 | 53.0850363, -6.105825200000001 | [FarmFinder](https://farmfinder.ie/producer/mccabes-coffee-ltd); via Bord Bia Origin Green |
| Rí-Rá Brewing Co. | Kilcoole | Cerveza | www.ri-ra.beer ⚠ | — | — | [FarmFinder](https://farmfinder.ie/producer/r-r-brewing-co) |
| Glendalough Distillery | Newtownmountkennedy (nearest, 0.6 km) | Destilados y licores | www.glendaloughdistillery.com | — | 53.084955, -6.1071463 | OSM node/6473071071 |
| O'Hanlon's Herbs | Glenealy (nearest, 1.3 km) | Fruta y verdura | www.ohanlonherbs.ie | (0404) 44999 | 52.9779251, -6.1526829 | [FarmFinder](https://farmfinder.ie/producer/o-hanlon-s-herbs); via SuperValu Food Academy |
| Bees 4 Me 2 | Wicklow (nearest, 0.6 km) | Miel ? | irishhoney.ie ⚠ | 087 967 6515 · bees4me2@gmail.com | 52.9802376, -6.0414184 | [FarmFinder](https://farmfinder.ie/producer/bees-4-me-2); via irishhoney.ie |
| Atlantic Aromatics Ltd | Little Bray (nearest, 0.3 km) | Otros | www.atlanticaromatics.com | (01) 286 5399 | 53.205268, -6.1166011 | [FarmFinder](https://farmfinder.ie/producer/atlantic-aromatics-ltd); via Organic Trust |
| Bomar Ltd - Bomar Aromatherapy | Kilcoole (nearest, 1.4 km) | Otros | bomar.ie | (01) 287 5110 | 53.106015, -6.0439845 | [FarmFinder](https://farmfinder.ie/producer/bomar-ltd-bomar-aromatherapy); via Organic Trust |
| Dr Coys Health Foods | Greystones (nearest, 0.7 km) | Otros | www.drcoys.ie | (01) 287 1074 | 53.1504365, -6.0716092 | [FarmFinder](https://farmfinder.ie/producer/dr-coys-health-foods); via SuperValu Food Academy |
| Glenhaven Quality Foods | Arklow (nearest, 2.2 km) | Otros | www.glenhaven.ie | (0402) 39000 | 52.8126445, -6.1541812 | [FarmFinder](https://farmfinder.ie/producer/glenhaven-quality-foods); via Bord Bia Origin Green |
| GoBia Ltd. | Wicklow (nearest, 0.8 km) | Otros | www.gobia.com | — | 52.9809, -6.0446 | [FarmFinder](https://farmfinder.ie/producer/gobia-ltd); via Bord Bia Origin Green |
| Irish Botanica | Wicklow (nearest, 0.9 km) | Otros | www.irishbotanica.ie | — | 52.9808, -6.0458 | [FarmFinder](https://farmfinder.ie/producer/irish-botanica); via Organic Trust |
| Irish Pure | Baltinglass (nearest, 1.6 km) | Otros | www.pureirishice.ie | (059) 645 0195 | 52.9321219, -6.691573 | [FarmFinder](https://farmfinder.ie/producer/irish-pure); via SuperValu Food Academy |
| Janets Country Fayre Ltd | Kilcoole (nearest, 0.6 km) | Otros | www.janetscountryfayre.com/products | (01) 201 8008 | 53.1032214, -6.0716657 | [FarmFinder](https://farmfinder.ie/producer/janets-country-fayre-ltd); via Food Culture Ireland |
| Keadeen Mountain Farms | Kiltegan (nearest, 3.7 km) | Otros | keadeenmountainfarms.ie | 0857382876 | 52.9255438, -6.6488505 | [FarmFinder](https://farmfinder.ie/producer/keadeen-mountain-farms); via Food Culture Ireland |
| Miena's | Wicklow (nearest, 0.8 km) | Otros | www.mienas.ie | — | 52.9809, -6.0446 | [FarmFinder](https://farmfinder.ie/producer/mienas); via Bord Bia Origin Green |
| National Organic Products Ltd | Bray (nearest, 2.1 km) | Otros | www.nationalorganic.com | (01) 901 2761 | 53.1825981, -6.1166949 | [FarmFinder](https://farmfinder.ie/producer/national-organic-products-ltd); via Organic Trust |
| Sally Gap Foods | Wicklow (nearest, 4.1 km) | Otros | www.powerscourthotel.com ⚠ | (01) 274 8888 | 52.952106, -6.077518 | [FarmFinder](https://farmfinder.ie/producer/sally-gap-foods); via SuperValu Food Academy |
| Sussed Nutrition Limited | Rathnew (nearest, 2.1 km) | Otros | www.wicklowrapeseedoil.ie ⚠ | (0404) 79574 | 52.9722402, -6.0767413 | [FarmFinder](https://farmfinder.ie/producer/sussed-nutrition-limited); via Bord Bia Origin Green |
| Amazing Cakes | Little Bray (nearest, 0.5 km) | Pan y cereal | amazingcakes.ie | — | 53.2076698, -6.115059 | OSM node/8404601594 |
| Scéal Bakery | Greystones (nearest, 0.9 km) | Pan y cereal | www.scealbakery.com | — | 53.1517561, -6.066916 | OSM node/11636095682 |

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
