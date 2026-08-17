# Cavan — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/ulster/cavan.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/cavan>, plus each producer
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
| Ben's Eggs | Huevos | The site carried for Ben's Eggs is eggspress.ie, which sells egg vending machines rather than eggs; the egg producer behind the lead needs its own source. |

## Needs one more fact — 25

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Barry Johns Sausages | Poles | Carne | — | — | — | DAFM meat 2908 |
| Cavan Country Produce | Unit 4 Cootehill Enterprise ParkCootehil | Carne | — | — | — | FSAI HSE 4121 |
| Choice Cuts | Swanlinbar | Carne | — | — | — | DAFM meat 2715 |
| Flynn's Butchers | Stradone (nearest, 4.8 km) | Carne | — | (071) 985 3277 | 53.944557, -7.289734 | [FarmFinder](https://farmfinder.ie/producer/flynn-s-butchers); via Associated Craft Butchers of Ireland |
| Gaynor and Sons | Ballinagh (nearest, 0.7 km) | Carne | — | (049) 433 7607 | 53.9313922, -7.4064977 | [FarmFinder](https://farmfinder.ie/producer/gaynor-and-sons); via Associated Craft Butchers of Ireland |
| Lynch's Victualler's | Clonliffe (nearest, 0.8 km) | Carne | — | — | 53.362236, -6.261534 | [FarmFinder](https://farmfinder.ie/producer/lynch-s-victualler-s); via Associated Craft Butchers of Ireland |
| M & M Meats | Bailieboro | Carne | — | — | — | DAFM meat 3012 |
| Manor Farm (registered as Carton Brothers T/A Manor Farm) | Shercock | Carne | — | — | — | DAFM meat 803 |
| McCarren Meats UC | Cavan | Carne | — | — | — | DAFM meat 608 |
| McGurren's Artisan Butchers | Crossdoney (nearest, 2.2 km) | Carne | — | 049 9522163 | 53.953181, -7.40114 | [FarmFinder](https://farmfinder.ie/producer/mcgurren-s-artisan-butchers); via Irish Butchers Guild |
| Sheelin Meats | Finea | Carne | — | — | — | DAFM meat 2448 |
| Sullivan Centre Kitchen | Cathedral RoadCavan | Carne | — | — | — | FSAI HSE 4113 |
| Mushrooms and Love | Cavan (nearest, 3.8 km) | Fruta y verdura | — | 087 384 0900 | 53.9971842, -7.4171698 | [FarmFinder](https://farmfinder.ie/producer/mushrooms-and-love); via Food Culture Ireland |
| Andrews Free Range Farm Fresh Hen and Duck Eggs | Stradone (nearest, 3.9 km) | Huevos | — | — | 53.935476951831525, -7.209525552109921 | [FarmFinder](https://farmfinder.ie/producer/andrews-free-range-farm-fresh-hen-and-duck-eggs); via yourhonestybox.com |
| Anna May Daly | Finternagh (nearest, 3.1 km) | Huevos | — | — | 53.849608759073455, -7.008110967517051 | [FarmFinder](https://farmfinder.ie/producer/anna-may-daly); via yourhonestybox.com |
| Cluck & Collect free range eggs | Kingscourt (nearest, 4.6 km) | Huevos | — | — | 53.902097605765675, -6.875076980403885 | [FarmFinder](https://farmfinder.ie/producer/cluck-collect-free-range-eggs); via yourhonestybox.com |
| Andrew and Aodhagon Smith | Farnadolly Crossdoney Co. Cavan | Lácteos y quesos | — | — | — | DAFM dairy IE2192 |
| Corleggy Cheese (registered as Silke Cropp) | Corleggy Cheeses, Corleggy, Belturbet, | Lácteos y quesos | — | — | — | DAFM dairy IE1816 |
| Corduff Organic Farm | Ballinagh | Miel | — | — | — | [FarmFinder](https://farmfinder.ie/producer/corduff-organic-farm-ballinagh-co-cavan) |
| Muff Honey | Kingscourt (nearest, 3.7 km) | Miel | — | — | 53.903206843952155, -6.860673952134411 | [FarmFinder](https://farmfinder.ie/producer/muff-honey); via yourhonestybox.com |
| Blissful Bites Bake Shed | Stradone (nearest, 4.8 km) | Otros | — | — | 53.9952589993785, -7.286761606038292 | [FarmFinder](https://farmfinder.ie/producer/blissful-bites-bake-shed); via yourhonestybox.com |
| Body Aura Therapies | Cavan (nearest, 0 km) | Otros | — | +353863811433 · michelle.greenan12@gmail.com | 53.9911042, -7.3603119 | [FarmFinder](https://farmfinder.ie/producer/body-aura-therapies); via NeighbourFood |
| Corlegggy Cheeses | — | Otros | www.corleggycheeses.ie | +353499522930 · corleggy@gmail.com | — | [FarmFinder](https://farmfinder.ie/producer/corlegggy-cheeses); via NeighbourFood |
| Lilliput Trading Company | Ballyhaise (nearest, 2.2 km) | Otros | — | — | 54.034975, -7.2937023 | [FarmFinder](https://farmfinder.ie/producer/lilliput-trading-company); via NeighbourFood |
| Clucks of The Bridge | Finternagh (nearest, 6.1 km) | Pan y cereal | — | — | 53.88829375926385, -7.073149852145653 | [FarmFinder](https://farmfinder.ie/producer/clucks-of-the-bridge); via yourhonestybox.com |

## Name and county only — 8

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Forest Hill Farm | — | Huevos | Farm; Vegetables, Fruit, Eggs, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/forest-hill-farm) |
| Alpha Organics - Richard Moeran | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/alpha-organics-richard-moeran) |
| Rathkenny Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/rathkenny-farm) |
| Stoney, Susan | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/stoney-susan) |
| Temple Farms Ltd | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/temple-farms-ltd) |
| Cullys Craft Bakery | — | Pan y cereal | Producer; Bread & Bakery, Food Culture Ireland | — | [FarmFinder](https://farmfinder.ie/producer/cullys-craft-bakery) |
| Killycavan Cakes & Bakes | — | Pan y cereal | listed; Preserves, Farm Gate, yourhonestybox.com, Honesty Box | — | [FarmFinder](https://farmfinder.ie/producer/killycavan-cakes-bakes); via yourhonestybox.com |


## Craft beer sweep (2026-08-13)

Sectorial discovery sweep for independent craft breweries and microbreweries in Co. Cavan.

| Candidate | Municipio | Category | Website | Instagram | Notes / Facility |
|---|---|---|---|---|---|

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
