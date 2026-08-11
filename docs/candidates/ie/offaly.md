# Offaly — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/offaly.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/offaly>, plus each producer
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
| KO Kombucha | Rath (nearest, 0.3 km) | Bebidas sin alcohol | www.kokombucha.com | +353896011926 · tracy@kokombucha.com | 53.1361722, -7.8103408 | [FarmFinder](https://farmfinder.ie/producer/ko-kombucha); via NeighbourFood |
| Bon Chocolatiers | Tullamore (nearest, 1.2 km) | Chocolate ? | www.bonchocolatiers.ie | 086 867 0304 | 53.2730685, -7.485558600000001 | [FarmFinder](https://farmfinder.ie/producer/bon-chocolatiers); via Bord Bia Origin Green |
| Perrys Preserves | Streamstown (nearest, 3.1 km) | Conservas ? | www.wildirishforagers.ie ⚠ | 085 747 6761 | 53.466066, -7.596433 | [FarmFinder](https://farmfinder.ie/producer/perrys-preserves); via SuperValu Food Academy |
| Irish Casing Company | Tullamore (nearest, 0.5 km) | Otros | www.irishcasings.com | (057) 932 1714 | 53.2686315, -7.4935722999999985 | [FarmFinder](https://farmfinder.ie/producer/irish-casing-company); via Bord Bia Origin Green |
| Slieve Bloom Organics | Pollagh (nearest, 5 km) | Otros | www.slievebloomorganics.ie | 086 053 0102 · info@slievebloomorganics.ie | 53.2344303, -7.7338716 | [FarmFinder](https://farmfinder.ie/producer/slieve-bloom-organics); via Food Culture Ireland |

## Needs one more fact — 18

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Ashgate Farm Meats (registered as Clive Clarke T/A Ashgate Farm Meats) | Dunkerrin | Carne | — | — | — | DAFM meat 2754 |
| Bergin Family Butchers Edenderry | Edenderry (nearest, 2 km) | Carne | — | (046) 973 1180 | 53.330402, -7.034772 | [FarmFinder](https://farmfinder.ie/producer/bergin-family-butchers-edenderry); via Associated Craft Butchers of Ireland |
| Brophil Meats | Tullamore (nearest, 1.6 km) | Carne | — | (057) 935 1534 | 53.275629, -7.480245 | [FarmFinder](https://farmfinder.ie/producer/brophil-meats); via Associated Craft Butchers of Ireland |
| Carroll Cuisine UC | Tullamore | Carne | — | — | — | DAFM meat 741 |
| CR Tormey & Sons Tullamore | Tullamore (nearest, 2.2 km) | Carne | — | 057 9321426 | 53.285876, -7.490508 | [FarmFinder](https://farmfinder.ie/producer/cr-tormey-and-sons-tullamore); via Irish Butchers Guild |
| Healy Family Meats Ltd (registered as Michael Healy T/A Healy Family Meats Ltd) | Banagher | Carne | — | — | — | DAFM meat 3034 |
| John Dwyer Butchers | Birr (nearest, 1.3 km) | Carne | — | (052) 915 6350 | 53.082726, -7.926144 | [FarmFinder](https://farmfinder.ie/producer/john-dwyer-butchers); via Associated Craft Butchers of Ireland |
| Rudds Fine Foods (registered as Sean Loughnane (Galway) Ltd. T/A Rudds Fine Foods) | Birr | Carne | — | — | — | DAFM meat 800 |
| Tullamore Meats Co-Operative | Tullamore | Carne | — | — | — | DAFM meat 2337 |
| Slieve Bloom Brewing Co. | Kinnitty | Cerveza | — | +353579137001 · info@slievebloombrewing.com | — | [FarmFinder](https://farmfinder.ie/producer/slieve-bloom-brewing-co) |
| Tullamore Distillery | Tullamore (nearest, 1.3 km) | Destilados y licores | — | — | 53.2551212, -7.4963075 | OSM way/624790362 |
| Ballyteige | Capppancur (nearest, 3.7 km) | Huevos | — | — | 53.293368514326275, -7.392497337252659 | [FarmFinder](https://farmfinder.ie/producer/ballyteige); via yourhonestybox.com |
| Kilcormac | Kilcormac (nearest, 1.2 km) | Huevos | — | — | 53.18373857894415, -7.734216137335114 | [FarmFinder](https://farmfinder.ie/producer/kilcormac); via yourhonestybox.com |
| Susies Shed | Mucklagh (nearest, 0.3 km) | Huevos | — | — | 53.25203777290189, -7.5474727526259615 | [FarmFinder](https://farmfinder.ie/producer/susies-shed); via yourhonestybox.com |
| The Bake shed | Mucklagh (nearest, 2.7 km) | Huevos | — | — | 53.27430515696024, -7.5593969225804925 | [FarmFinder](https://farmfinder.ie/producer/the-bake-shed); via yourhonestybox.com |
| Boora Dairy Company Ltd | Leamore Tullamore Co Offaly | Lácteos y quesos | — | — | — | DAFM dairy IE2155 |
| Ballybryan Farm | Rhode (nearest, 0 km) | Otros | — | +353831823177 · lalor20@yahoo.com | 53.3495675, -7.1990013 | [FarmFinder](https://farmfinder.ie/producer/ballybryan-farm); via NeighbourFood |
| Rose Manufacturing Ltd | Edenderry (nearest, 0.8 km) | Otros | — | (046) 973 2346 | 53.339320799999996, -7.057790799999999 | [FarmFinder](https://farmfinder.ie/producer/rose-manufacturing-ltd); via Bord Bia Origin Green |

## Name and county only — 36

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Feighery’s Farm Beetroot Juice | — | Bebidas sin alcohol | Beverage; also FarmFinder https://farmfinder.ie/producer/feighery-s-farm | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/feigherys-farm-beetroot-juice/) |
| William Grant and Sons | — | Bebidas sin alcohol | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/william-grant-and-sons/) |
| The Little Coffee Co | — | Café | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/the-little-coffee-co/) |
| Hereford & More | — | Carne | Meats | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/hereford-more/) |
| Island Farm Foods | — | Carne | Farm; Organic, NeighbourFood, Beef, Lamb | — | [FarmFinder](https://farmfinder.ie/producer/island-farm-foods) |
| Midlands Fine Foods Ltd. | — | Carne | Meats | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/midlands-fine-foods-ltd/) |
| Pigs on the Green | — | Carne | Meats | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/pigs-on-the-green/) |
| Quarrymount Free Range Meats | — | Carne | Meats, Organic | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/quarrymount-free-range-meats/) |
| Rudd’s | — | Carne | Meats, Prepared Foods | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/rudds/) |
| Bog Standard Whiskey | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/bog-standard-whiskey) |
| BiaSol | — | Comida preparada | Prepared Foods, Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/biasol/) |
| Mount Briscoe Organic Farm | — | Conservas | Organic, Preserves | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/mount-briscoe-organic-farm/) |
| Wild Irish Foragers | — | Conservas | Preserves | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/wild-irish-foragers/) |
| Attinkee Farm | — | Fruta y verdura | Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/attinkee-farm/) |
| Coolnagrower Organic Produce Ltd | — | Fruta y verdura | listed | — | [FarmFinder](https://farmfinder.ie/producer/coolnagrower-organic-produce-ltd) |
| Fox Covert Farm | — | Fruta y verdura | Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/fox-covert-farm/) |
| Garryhinch Wood Exotic Mushrooms | — | Fruta y verdura | Organic, Produce; also FarmFinder https://farmfinder.ie/producer/garryhinch-exotic-mushrooms | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/garryhinch-wood-exotic-mushrooms/) |
| Mooney’s Organics Lough Boora Farm | — | Fruta y verdura | Organic, Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/mooneys-organics-lough-boora-farm/) |
| Booley Foods | — | Lácteos y quesos | Dairy | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/booley-foods/) |
| Boora Bainne | — | Lácteos y quesos | Beverage, Dairy | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/boora-bainne/) |
| Glenisk | — | Lácteos y quesos | Dairy, Organic | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/glenisk/) |
| Ború Honey | — | Miel | Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/boru-honey/) |
| Grennan, Gerard | — | Otros | listed; also OSM way/174012022 | — | [FarmFinder](https://farmfinder.ie/producer/grennan-gerard) |
| Keeney, Patrick J | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/keeney-patrick-j) |
| Kirwan, James | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/kirwan-james) |
| Lough Boora Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/lough-boora-organic-farm) |
| McIntyre, Ann - Organic Suckler Herd | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/mcintyre-ann-organic-suckler-herd) |
| Walsh, Francis | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/walsh-francis) |
| Weir, Eugene | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/weir-eugene) |
| Ali’s Kitchen | — | Pan y cereal | Bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/alis-kitchen/) |
| Cêline’s Homemade Cooking | — | Pan y cereal | Bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/celines-homemade-cooking/) |
| Little Sister Bakes | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/little-sister-bakes) |
| O’Donohues Bakery | — | Pan y cereal | Bakery; also FarmFinder https://farmfinder.ie/producer/the-penny-loaf-co-odonohues-bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/odonohues-bakery/) |
| Paul Hurst Artisan Baker | — | Pan y cereal | Producer; Organic, Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/paul-hurst-artisan-baker) |
| The Flatbread Company t/a Simpli Baked | — | Pan y cereal | Bakery; also FarmFinder https://farmfinder.ie/producer/simpli-baked | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/the-flatbread-company-t-a-simpli-baked/) |
| Treat Box Patisserie | — | Pan y cereal | Bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/treat-box-patisserie/) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
