# Laois — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/laois.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/laois>, plus each producer
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

## Ready to verify — 1

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Agvance Nutrition | Ballyfin (nearest, 1.5 km) | Otros | agvance.ie | (057) 851 0155 | 53.0522852, -7.398504099999999 | [FarmFinder](https://farmfinder.ie/producer/agvance-nutrition); via Organic Trust |

## Needs one more fact — 11

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Bob's Butchers | Abbeyleix (nearest, 1 km) | Carne | — | (057) 869 2145 | 52.90526, -7.349656 | [FarmFinder](https://farmfinder.ie/producer/bob-s-butchers); via Associated Craft Butchers of Ireland |
| Feighery's Butchers | Borris (nearest, 0.9 km) | Carne | — | (057) 866 6838 | 53.039483, -7.295049 | [FarmFinder](https://farmfinder.ie/producer/feighery-s-butchers); via Associated Craft Butchers of Ireland |
| Michael Keegan | Mountrath | Carne | — | — | — | DAFM meat 2501 |
| OrganicMeat.ie | — | Carne | www.organicmeat.ie | — | — | [FarmFinder](https://farmfinder.ie/producer/organicmeat-ie); via FarmFinder Team |
| Dunmore Produce Ltd | Ballacolla (nearest, 5.1 km) | Fruta y verdura ? | — | (057) 873 6263 | 52.859531, -7.3823669 | [FarmFinder](https://farmfinder.ie/producer/dunmore-produce-ltd); via Bord Bia Origin Green |
| Freerange eggs | Portarlington (nearest, 3.5 km) | Huevos | — | — | 53.13303749560513, -7.214670583399254 | [FarmFinder](https://farmfinder.ie/producer/freerange-eggs); via yourhonestybox.com |
| LS Eggs | Cullohill (nearest, 1.6 km) | Huevos | — | — | 52.80588070552569, -7.464689122275847 | [FarmFinder](https://farmfinder.ie/producer/ls-eggs); via yourhonestybox.com |
| Timahoe | Timahoe (nearest, 1.2 km) | Huevos | — | — | 52.95069200347066, -7.197082191483517 | [FarmFinder](https://farmfinder.ie/producer/timahoe); via yourhonestybox.com |
| Bracklone Dairies Ltd | Lea, Portarlington, Co. Laois, | Lácteos y quesos | — | — | — | DAFM dairy IE2182 |
| Baking Brunette | Clonaslee (nearest, 1.9 km) | Otros | — | — | 53.15352261708415, -7.544965822015539 | [FarmFinder](https://farmfinder.ie/producer/baking-brunette); via yourhonestybox.com |
| Leo Dunne Organics | Ballacolla (nearest, 5.1 km) | Otros | — | (057) 873 6263 | 52.859531, -7.3823669 | [FarmFinder](https://farmfinder.ie/producer/leo-dunne-organics); via Organic Trust |

## Name and county only — 37

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Moore’s Drinks | — | Bebidas sin alcohol | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/moores-drinks/) |
| Seccoto Coffee | — | Café | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/seccoto-coffee/) |
| The Good Bean Coffee Roastery | — | Café | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/the-good-bean-coffee-roastery/) |
| Castlewood Organic Farm | — | Carne | Meats, Organic | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/castlewood-organic-farm/) |
| Coolanowle Organic Meats | — | Carne | Meats, Organic | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/coolanowle-organic-meats/) |
| Fiorbhia Farm | — | Carne | Meats | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/fiorbhia-farm/) |
| Quarrymount Free Range Meats | — | Carne | Meats, Organic | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/quarrymount-free-range-meats/) |
| 12 Acres Brewing Co. | — | Cerveza | Producer; Beer, Farm Gate, Online, remaining) | — | [FarmFinder](https://farmfinder.ie/producer/12-acres-brewing-co) |
| Ballykilcavan Brewing Company | — | Cerveza | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/ballykilcavan-brewing-company/) |
| First Ireland Spirits | — | Cerveza | Producer; Origin Green Member, Beer, Cider, Spirits | — | [FarmFinder](https://farmfinder.ie/producer/first-ireland-spirits) |
| Munster Brewery | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/munster-brewery) |
| Origin Spirits Ltd | — | Cerveza | Producer; Origin Green Member, Beer, Cider, Spirits | — | [FarmFinder](https://farmfinder.ie/producer/origin-spirits-ltd) |
| Ballyrider House Granola | — | Comida preparada | Prepared Foods | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/ballyrider-house-granola/) |
| ÍON Oil | — | Comida preparada | Organic, Prepared Foods | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/ion-oil/) |
| Le Skinny Chef | — | Comida preparada | Prepared Foods | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/le-skinny-chef/) |
| O’Mimo’s Chilli Madness | — | Comida preparada | Prepared Foods, Preserves | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/omimos-chilli-madness/) |
| The Jungle Food Company | — | Comida preparada | Prepared Foods | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/the-jungle-food-company/) |
| G’s Gourmet Jams | — | Conservas | Preserves | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/gs-gourmet-jams/) |
| Rose Cottage Fruit Farm | — | Conservas | Preserves, Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/rose-cottage-fruit-farm/) |
| Temptation Chocolates | — | Dulces y repostería | Confectionery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/temptation-chocolates/) |
| Bowfield Farm | — | Fruta y verdura | Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/bowfield-farm/) |
| Edmundburry Greens | — | Fruta y verdura | Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/edmundburry-greens/) |
| Farmer J’s | — | Fruta y verdura | Organic, Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/farmer-js/) |
| Garryhinch Wood Exotic Mushrooms | — | Fruta y verdura | Organic, Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/garryhinch-wood-exotic-mushrooms/) |
| Granstown Free Range Eggs | — | Fruta y verdura | Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/granstown-free-range-eggs/) |
| The Merry Mill | — | Fruta y verdura | Organic, Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/the-merry-mill-2/) |
| The Village Dairy | — | Lácteos y quesos | Dairy, Organic | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/the-village-dairy/) |
| Ballyhubbock Farm | — | Otros | Farm; Food Culture Ireland | — | [FarmFinder](https://farmfinder.ie/producer/ballyhubbock-farm) |
| Fitzpatrick, John | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/fitzpatrick-john) |
| McLoughlin, Sheila | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/mcloughlin-sheila) |
| Aghaboe Farm Foods | — | Pan y cereal | Bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/aghaboe-farm-foods/) |
| Cocoa Couture | — | Pan y cereal | Bakery, Confectionery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/cocoa-couture/) |
| Mary Lowry’s Home Baking | — | Pan y cereal | Bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/mary-lowrys-home-baking/) |
| Milano Waffles | — | Pan y cereal | Bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/milano-waffles/) |
| Mueller & O’Connell Bakery | — | Pan y cereal | Bakery; also OSM node/411618911 | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/mueller-oconnell-bakery/) |
| Zephyr Yard | — | Pan y cereal | Bakery, Confectionery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/zephyr-yard/) |
| Al's Fish Shop | — | Pescado | Producer; Seafood | — | [FarmFinder](https://farmfinder.ie/producer/als-fish-shop) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
