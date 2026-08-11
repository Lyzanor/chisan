# Limerick — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/limerick.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/limerick>, plus each producer
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

## Ready to verify — 11

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Old World Master Butchers | Limerick (nearest, 0.3 km) | Carne | www.michaeloloughlinbutchers.ie ⚠ | (061) 414 102 | 52.667792, -8.625249 | [FarmFinder](https://farmfinder.ie/producer/old-world-master-butchers); via Associated Craft Butchers of Ireland |
| Limerick Spirits Company Limited | Limerick (nearest, 0.3 km) | Destilados y licores | thomondgatewhiskey.com ⚠ | (061) 414 900 | 52.662749, -8.622283 | [FarmFinder](https://farmfinder.ie/producer/limerick-spirits-company-limited); via Bord Bia Origin Green |
| Noinin Organic Herb & Vegetable Farm | Adare (nearest, 5 km) | Fruta y verdura | www.noinin.ie | +35361640822 · noininherbalproducts@gmail.com | 52.5188316, -8.7958347 | [FarmFinder](https://farmfinder.ie/producer/noinin-organic-herb-vegetable-farm); via NeighbourFood |
| Cahill Cheese | Castletroy (nearest, 0.3 km) | Lácteos y quesos | cahillscheese.ie | (069) 62365 | 52.666261, -8.54844 | [FarmFinder](https://farmfinder.ie/producer/cahill-cheese); via SuperValu Food Academy |
| Old Cottage Honey | Abington (nearest, 2.4 km) | Miel | www.oldcottagehoney.ie | — | 52.6331155, -8.4544145 | [FarmFinder](https://farmfinder.ie/producer/old-cotage-honey); via Food Culture Ireland |
| Glenstal Foods Ltd | Abington (nearest, 1.5 km) | Otros | www.glenstalfoods.com | (061) 386 511 | 52.6339744, -8.397619599999999 | [FarmFinder](https://farmfinder.ie/producer/glenstal-foods-ltd); via Bord Bia Origin Green |
| HL Commodity Foods Manufacturing LTD | Hospital (nearest, 0.3 km) | Otros | hlcf.ie ⚠ | (061) 383 801 | 52.4724606, -8.4277828 | [FarmFinder](https://farmfinder.ie/producer/hl-commodity-foods-manufacturing-ltd); via Bord Bia Origin Green |
| Juspy | Limerick (nearest, 0.6 km) | Otros | www.juspy.com | leonie@juspy.com | 52.6614759, -8.6293975 | [FarmFinder](https://farmfinder.ie/producer/juspy); via NeighbourFood |
| Key Ingredients Europe Limited | Annacotty (nearest, 1.7 km) | Otros | www.keyingredients.ie | (061) 358 977 | 52.662613, -8.507509599999999 | [FarmFinder](https://farmfinder.ie/producer/key-ingredients-europe-limited); via Bord Bia Origin Green |
| Premier Molasses Co Ltd | Foynes (nearest, 1.1 km) | Otros | premiermolasses.ie | (069) 65311 | 52.612946099999995, -9.1009867 | [FarmFinder](https://farmfinder.ie/producer/premier-molasses-co-ltd); via Organic Trust |
| Seeds Ireland | Garryowen (nearest, 2.2 km) | Otros | www.seedsireland.ie | (061) 320 900 | 52.6498706, -8.586414 | [FarmFinder](https://farmfinder.ie/producer/seeds-ireland); via Organic Trust |

## Needs one more fact — 31

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Bailey Foods | William St | Carne | — | — | — | DAFM meat 2781 |
| Bio Science Nutrition Ireland | Skule HillFedamore | Carne | — | — | — | FSAI HSE 4117 |
| Cappercullen Foods Ltd | Unit 1 Limerick Food CentrePearse RoadRa | Carne | — | — | — | FSAI HSE 4099 |
| Enda Aherne | Limerick | Carne | — | — | — | DAFM meat 2900 |
| Glen Aine Foods Ltd | Knocklong | Carne | — | — | — | DAFM meat 564 |
| Hook and Ladder | Unit One | Carne | — | — | — | FSAI HSE 4077 |
| Jack Spratt Butchers | Limerick (nearest, 1 km) | Carne | — | (061) 419 935 | 52.672297, -8.615691 | [FarmFinder](https://farmfinder.ie/producer/jack-spratt-butchers); via Associated Craft Butchers of Ireland |
| James Shanahan Ltd | Pallaskenry | Carne | — | — | — | DAFM meat 2695 |
| Jim Flavin | Annacottty | Carne | — | — | — | DAFM meat 2782 |
| McDermott Butchers | Loughnavalley (nearest, 4.5 km) | Carne | — | (061) 377 192 | 53.496827, -7.592666 | [FarmFinder](https://farmfinder.ie/producer/mcdermott-butchers); via SuperValu Food Academy |
| McMahon Quality Meats | Abbeyfeale (nearest, 0.3 km) | Carne | — | 068 31342 | 52.382369, -9.306351 | [FarmFinder](https://farmfinder.ie/producer/mcmahon-quality-meats); via Irish Butchers Guild |
| McMahon's Biltong (registered as Ivor McMahon's T/A McMahon's Biltong) | Ballysimon | Carne | — | — | — | DAFM meat 3020 |
| O'Connell Beef | Limerick (nearest, 0.7 km) | Carne | — | (061) 414 819 | 52.6596935, -8.626615 | [FarmFinder](https://farmfinder.ie/producer/o-connell-beef); via SuperValu Food Academy |
| O'Connell's Butchers Limerick | Moyross (nearest, 0.7 km) | Carne | — | (061) 414 819 | 52.676091, -8.639495 | [FarmFinder](https://farmfinder.ie/producer/o-connell-s-butchers-limerick); via Associated Craft Butchers of Ireland |
| O'Connor Butchers | Kilmallock | Carne | — | — | — | DAFM meat 2485 |
| O'Sullivan Butchers Kilmallock | Kilmallock (nearest, 2.5 km) | Carne | — | (063) 98023 | 52.38727, -8.58155 | [FarmFinder](https://farmfinder.ie/producer/o-sullivan-butchers-kilmallock); via Associated Craft Butchers of Ireland |
| Paddy McMahon Butchers | Garryowen (nearest, 0.2 km) | Carne | — | (061) 417 868 | 52.658556, -8.611861 | [FarmFinder](https://farmfinder.ie/producer/paddy-mcmahon-butchers); via Associated Craft Butchers of Ireland |
| Pat O'Connor Meat | Raheen | Carne | — | — | — | DAFM meat 2745 |
| Rigneys Farm Curraghchase Freerange Pork (registered as Caroline Rigney T/A Rigneys Farm Curraghchase Freerange Pork) | Kilcornan | Carne | — | — | — | DAFM meat 2991 |
| Seamus Butler Meats | Limerick (nearest, 0.3 km) | Carne | — | — | 52.664717, -8.628089 | [FarmFinder](https://farmfinder.ie/producer/seamus-butler-meats); via Associated Craft Butchers of Ireland |
| Shuttington Holdings Unlimited Company | Bruree Food Centre40 Acres | Carne | — | — | — | FSAI HSE 4120 |
| Tim's Table | The Kitchen HubUNIT 3A Crossagalla indus | Carne | — | — | — | FSAI HSE 4119 |
| Tom Brouder Athea Homemade Puddings | Loughill | Carne | — | — | — | DAFM meat 2625 |
| Bramble Cottage Produce | Adare (nearest, 5 km) | Fruta y verdura ? | — | kmacwallace@gmail.com | 52.5188316, -8.7958347 | [FarmFinder](https://farmfinder.ie/producer/bramble-cottage-produce); via NeighbourFood |
| Cuan Mhuire CLG | Cuan Mhuire Bruree Co | Lácteos y quesos | — | — | — | DAFM dairy IE2199 |
| GoBia Ltd CP Ingredients Ltd Real Ingredients Ltd (registered as GoBia Ltd) | Unit 7 Limerick Food | Lácteos y quesos | — | — | — | DAFM dairy IE1985 |
| Hannah Quinn Mulligan | Tory Hill House Kilmallock | Lácteos y quesos | — | — | — | DAFM dairy IE2201 |
| HL Commodity Foods (MFG) Ltd | Emly Rd Hospital Limerick | Lácteos y quesos | — | — | — | DAFM dairy IE1116 |
| JOD Food Products Ltd | JOD Food Products, Effin | Lácteos y quesos | — | — | — | DAFM dairy IE1059 |
| SJ Cheese Limited | The Hill Ballyhahill Co | Lácteos y quesos | — | — | — | DAFM dairy IE2185 |
| Corick farm | Adare (nearest, 5 km) | Otros | — | eoin1992@gmail.com | 52.5188316, -8.7958347 | [FarmFinder](https://farmfinder.ie/producer/corick-farm); via NeighbourFood |

## Name and county only — 20

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Cotter Organic Lamb T/A | — | Carne | listed | — | [FarmFinder](https://farmfinder.ie/producer/cotter-organic-lamb-t-a) |
| Michael O' Loughlin | Limerick (nearest, 0.4 km) | Carne | shop=butcher | +353 61 414 102 | OSM node/5005535559 |
| The Market Butcher | Newcastle West (nearest, 0.3 km) | Carne | shop=butcher | +353 69 61398 | OSM node/10821584792 |
| JJ's Craft Brewing | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/jjs-craft-brewing) |
| Treaty City Brewery | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/treaty-city-brewery) |
| Canteen | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/canteen) |
| Donegan, John | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/donegan-john) |
| Happy Food at Home | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/happy-food-at-home) |
| Harpers Coffeehouse | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/harpers-coffeehouse) |
| Kerry Farm Shop | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/kerry-farm-shop) |
| Sadlier's | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/sadliers-limerick) |
| Tory Hill House | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/tory-hill-house) |
| VARDEBI | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/vardebi) |
| Baking 4U | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/baking-4u) |
| Bread Shop Limerick | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/bread-shop-limerick) |
| Murphys Home Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/murphys-home-bakery) |
| Sunflower Bakery | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/sunflower-bakery) |
| Rene Cusack Fish | — | Pescado | Producer; Seafood; also OSM node/5015273763; also OSM node/7914412837 | — | [FarmFinder](https://farmfinder.ie/producer/rene-cusack-fish) |
| Saddlers | — | Pescado | Producer; Seafood | — | [FarmFinder](https://farmfinder.ie/producer/saddlers-limerick) |
| SeaBreeze | — | Pescado | Producer; Seafood, remaining), About, About FarmFinder | — | [FarmFinder](https://farmfinder.ie/producer/seabreeze-limerick) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
