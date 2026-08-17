# Sligo — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/sligo.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/sligo>, plus each producer
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

## Held after verification — 0

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

Nothing from that tier is still open in this county.

## Needs one more fact — 5

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| B Bowes Ltd | Sligo | Carne | — | — | — | DAFM meat 2802 |
| Burns Farm Meats LTD | Grange | Carne | — | — | — | DAFM meat 2516 |
| Sherlock Meats Ballisodare | Beltra (nearest, 1.2 km) | Carne | — | (071) 916 7985 | 54.22348, -8.634067 | [FarmFinder](https://farmfinder.ie/producer/sherlock-meats-ballisodare); via Associated Craft Butchers of Ireland |
| Wynne Meats | Bellaghy (nearest, 5.6 km) | Carne | — | — | 53.99553, -8.727012 | [FarmFinder](https://farmfinder.ie/producer/wynne-meats); via Associated Craft Butchers of Ireland |
| Sweet Beat Sligo | Sligo (nearest, 0.7 km) | Otros | — | 087 601 3440 | 54.272455, -8.480222 | [FarmFinder](https://farmfinder.ie/producer/sweet-beat-sligo); via SuperValu Food Academy |

## Name and county only — 12

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Farmreared.com | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/farmreared-com) |
| Knocknarea Farm Shop | — | Carne | Farm; Vegetables, Fruit, Beef, Lamb | — | [FarmFinder](https://farmfinder.ie/producer/knocknarea-farm-shop) |
| Lough Bralee Organic Farm | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/lough-bralee-organic-farm) |
| Rare Ruminare - Clive Bright | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/rare-ruminare-clive-bright) |
| Tubbertelly Farm - Dexter Beef Direct | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/tubbertelly-farm-dexter-beef-direct) |
| Lough Gill Brewing Co. | — | Cerveza | Producer; Beer, Farm Gate, Online | — | [FarmFinder](https://farmfinder.ie/producer/lough-gill-brewing-co) |
| Common Shore | — | Lácteos y quesos | Farm; Vegetables, Fruit, Dairy, Eggs | — | [FarmFinder](https://farmfinder.ie/producer/common-shore) |
| Homeland Plus | Sligo | Otros | shop=farm | +353 71 916 1879 | OSM way/252286409 |
| Crean Cottage Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/crean-cottage-bakery) |
| The Hungry Moose | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/the-hungry-moose) |
| Sligo Oysters | — | Pescado | Producer; Seafood, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/sligo-oysters) |
| Wild Atlantic Shellfish Limited | — | Pescado | Producer; Origin Green Member, Seafood, Bord Bia Origin Green | — | [FarmFinder](https://farmfinder.ie/producer/wild-atlantic-shellfish-limited) |


## Craft beer sweep (2026-08-13)

Sectorial discovery sweep for independent craft breweries and microbreweries in Co. Sligo.

| Candidate | Municipio | Category | Website | Instagram | Notes / Facility |
|---|---|---|---|---|---|

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
