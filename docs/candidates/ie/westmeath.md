# Westmeath — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/westmeath.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/westmeath>, plus each producer
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

## Held after verification — 1

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Sheelin Meats | Carne | Sheelin Meats runs three butcher shops across Cavan and Westmeath; which of them is a productive unit rather than a retail counter is unresolved. |

## Needs one more fact — 16

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Co. Westmeath | Shandonagh (nearest, 5.6 km) | Carne | — | — | 53.563206, -7.392854 | [FarmFinder](https://farmfinder.ie/producer/co-westmeath); via Irish Organic Association |
| CR Tormey & Sons Mullingar | Mullingar (nearest, 0.4 km) | Carne | — | 044 9345433 | 53.520248, -7.342602 | [FarmFinder](https://farmfinder.ie/producer/cr-tormey-and-sons-mullingar); via Irish Butchers Guild |
| Greene Farm (registered as Greene Farm Fine Foods Limited T/A Greene Farm) | Rathowen | Carne | — | — | — | DAFM meat 838 |
| JJ Quinn Butchers | Loughnavalley (nearest, 1.3 km) | Carne | — | — | 53.497663, -7.524099 | [FarmFinder](https://farmfinder.ie/producer/jj-quinn-butchers); via Associated Craft Butchers of Ireland |
| Lenihan's Butchers | Rathconrath (nearest, 3.3 km) | Carne | — | — | 53.543258, -7.480013 | [FarmFinder](https://farmfinder.ie/producer/lenihan-s-butchers); via Associated Craft Butchers of Ireland |
| Mr Crumb (registered as Quality Irish Food Ltd T/A Mr Crumb) | Mullingar | Carne | — | — | — | DAFM meat 152 |
| Pigs on the Green (registered as Fergus Dunne T/A Pigs on the Green) | Tyrellspass | Carne | — | — | — | DAFM meat 3030 |
| Seamus Bracken Butcher Shop | Mullingar (nearest, 0.3 km) | Carne | — | — | 53.520733, -7.341843 | [FarmFinder](https://farmfinder.ie/producer/seamus-bracken-butcher-shop); via Associated Craft Butchers of Ireland |
| Troy Meats | Meedin (nearest, 1.6 km) | Carne | — | — | 53.4105262, -7.393764900000001 | [FarmFinder](https://farmfinder.ie/producer/troy-meats) |
| Balrath West Farm | Killucan and Rathwire (nearest, 6.9 km) | Huevos | — | — | 53.56398395153135, -7.181591839055216 | [FarmFinder](https://farmfinder.ie/producer/balrath-west-farm); via yourhonestybox.com |
| Bonny Bó (registered as Clonbonny Dairies Ltd) | Clonbonny Athlone Co Westmeath | Lácteos y quesos | — | — | — | DAFM dairy IE2188 |
| Our Creamery (registered as Peter Pavlov) | Barba Villa Demesne, Collinstown, | Lácteos y quesos | — | — | — | DAFM dairy IE2169 |
| Loughpark Farms | Mullingar (nearest, 4 km) | Otros | — | +353872467302 · maireadking1000@gmail.co.com | 53.5577902, -7.3478558 | [FarmFinder](https://farmfinder.ie/producer/loughpark-farms); via NeighbourFood |
| Neo's Covers | Mullingar (nearest, 4 km) | Otros | — | +353874352101 | 53.5577902, -7.3478558 | [FarmFinder](https://farmfinder.ie/producer/neo-s-covers); via NeighbourFood |
| Rathcam Organic Farm | Mullingar (nearest, 4 km) | Otros | — | pickersn@tcd.ie | 53.5577902, -7.3478558 | [FarmFinder](https://farmfinder.ie/producer/rathcam-organic-farm); via NeighbourFood |
| Sweet Rose Remedies | Mullingar (nearest, 4 km) | Otros | — | berniemckane23@gmail.com | 53.5577902, -7.3478558 | [FarmFinder](https://farmfinder.ie/producer/sweet-rose-remedies); via NeighbourFood |

## Name and county only — 32

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| The Irish Craft Soda Co. | — | Bebidas sin alcohol | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/the-irish-craft-soda-co/) |
| Bell Lane Coffee | — | Café | Beverage; also FarmFinder https://farmfinder.ie/producer/bell-lane-coffee-limited | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/bell-lane-coffee/) |
| Red Rooster Coffee | — | Café | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/red-rooster-coffee/) |
| Slow Roast – Sandwiches & Coffee | — | Café | Prepared Foods | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/slow-roast-sandwiches-coffee/) |
| Dunnings Traditional Butcher | Athlone (nearest, 0.4 km) | Carne | shop=butcher | +353 90 649 4480 | OSM node/11079423540 |
| Lough Owel Organic Farm | — | Carne | Meats, Organic | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/lough-owel-organic-farm/) |
| Murtagh's Organic Farm | — | Carne | Farm; Organic, Beef, Lamb, Pork | — | [FarmFinder](https://farmfinder.ie/producer/murtagh-s-organic-farm) |
| Waldron Family Meats | — | Carne | Meats | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/waldron-family-meats/) |
| Balliskeen House Artisan Produce | — | Comida preparada | Prepared Foods, Preserves | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/balliskeen-house-artisan-produce/) |
| Bastion Kitchen | — | Comida preparada | Prepared Foods | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/bastion-kitchen/) |
| Kilbeggan Organic Foods | — | Comida preparada | Organic, Prepared Foods | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/kilbeggan-organic-foods/) |
| Fore Distillery and Barrel and Bean Cafe | — | Destilados y licores | Beverage; also FarmFinder https://farmfinder.ie/producer/fore-distillery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/fore-distillery-and-barrel-and-bean-cafe/) |
| Kilbeggan Distillery | — | Destilados y licores | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/kilbeggan-distillery/) |
| An Olivia Chocolate | — | Dulces y repostería | Confectionery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/an-olivia-chocolate/) |
| Bon Chocolatiers | — | Dulces y repostería | Confectionery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/bon-chocolatiers/) |
| Sugar Plum Sweetery | — | Dulces y repostería | Confectionery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/sugar-plum-sweetery/) |
| An Ghrian Glas Farm | — | Fruta y verdura | Organic, Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/an-ghrian-glas-farm/) |
| Barbavilla Dairy | — | Lácteos y quesos | Dairy | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/barbavilla-dairy/) |
| Ballymore Honey | — | Miel | Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/ballymore-honey/) |
| Killucan Honey Farm | — | Miel | Produce | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/killucan-honey-farm/) |
| Ballard Organic Farm - Pat Lalor | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/ballard-organic-farm-pat-lalor) |
| Butler, Declan | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/butler-declan) |
| Cornahir Dexter - David Couper | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/cornahir-dexter-david-couper) |
| Glenidan Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/glenidan-organic-farm) |
| OâRourke, Ken | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/o-rourke-ken) |
| OâSullivan, Rose | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/o-sullivan-rose) |
| BreaDelicious | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/breadelicious) |
| Magico Bakery | — | Pan y cereal | Bakery; also OSM node/10004186971 | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/magico-bakery/) |
| Novel-T Cakes | — | Pan y cereal | Bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/novel-t-cakes/) |
| Rosaleen’s Kitchen | — | Pan y cereal | Bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/rosaleens-kitchen/) |
| The Fish Market | — | Pescado | Producer; Seafood | — | [FarmFinder](https://farmfinder.ie/producer/the-fish-market-westmeath) |
| Willies Seafood | — | Pescado | Producer; Seafood, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/willies-seafood) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
