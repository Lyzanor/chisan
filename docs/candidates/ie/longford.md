# Longford — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/longford.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/longford>, plus each producer
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

## Needs one more fact — 11

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Flanagan Farm Produce | Ballymahon (nearest, 4.1 km) | Carne | — | eoinflano81@gmail.com | 53.5859317, -7.8204678 | [FarmFinder](https://farmfinder.ie/producer/flanagan-farm-produce); via NeighbourFood |
| Green Pasture Meat Processors Ltd. | Drumlish | Carne | — | — | — | DAFM meat 381 |
| Jeanette Hugo of Uncle Boks LTD | Ballinalee | Carne | — | — | — | DAFM meat 2796 |
| Joan Sullivan | Ballinalee | Carne | — | — | — | DAFM meat 2783 |
| Louis Herterich | Longford | Carne | — | — | — | DAFM meat 2524 |
| Mitchell Meats | Longford (nearest, 2.5 km) | Carne | — | (071) 963 2604 | 53.715782, -7.766883 | [FarmFinder](https://farmfinder.ie/producer/mitchell-meats); via Associated Craft Butchers of Ireland |
| Monaghan's Butchers | Longford (nearest, 0.4 km) | Carne | — | (043) 334 6507 | 53.723729, -7.803721 | [FarmFinder](https://farmfinder.ie/producer/monaghan-s-butchers); via Associated Craft Butchers of Ireland |
| McCormack fruit | Taghshinny (nearest, 2.1 km) | Fruta y verdura | — | — | 53.60430123011415, -7.679048575650338 | [FarmFinder](https://farmfinder.ie/producer/mccormack-fruit); via yourhonestybox.com |
| Clooneen | Roosky (nearest, 4.7 km) | Huevos | — | — | 53.792914862833555, -7.896536321533889 | [FarmFinder](https://farmfinder.ie/producer/clooneen); via yourhonestybox.com |
| McCormack, Pat & Fiona | Longford (nearest, 0.8 km) | Miel | — | 086 3263709 · info@thefarmhouse.ie | 53.7298787, -7.7885399 | [FarmFinder](https://farmfinder.ie/producer/mccormack-pat-fiona); via NIHBS |
| The Farm house | Abbeyshrule (nearest, 0.4 km) | Otros | — | — | 53.584213096565556, -7.656648029086638 | [FarmFinder](https://farmfinder.ie/producer/the-farm-house); via yourhonestybox.com |

## Name and county only — 15

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Richmount Cordial Co. | — | Bebidas sin alcohol | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/richmount-cordial-co/) |
| Heaslip, Joseph | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/heaslip-joseph) |
| Herterich Artisan Meats | — | Carne | Meats | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/herterich-artisan-meats/) |
| Stewart Family Farm | — | Carne | Farm; Beef, Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/stewart-family-farm) |
| Uncle Bok Biltong and Boerewors | — | Carne | Meats | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/uncle-bok-biltong-and-boerewors/) |
| St Mel's Brewery | — | Cerveza | Producer; Beer, Farm Gate, Online | — | [FarmFinder](https://farmfinder.ie/producer/st-mels-brewery) |
| Wide Street Brewing | — | Cerveza | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/wide-street-brewing/) |
| Rehoboth Foods | — | Comida preparada | Prepared Foods | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/rehoboth-foods/) |
| Lough Ree Distillery | — | Destilados y licores | Beverage | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/lough-ree-distillery/) |
| O’Halleran Family Farm Ltd | — | Fruta y verdura | Produce; also FarmFinder https://farmfinder.ie/producer/o-halleran-family-farm | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/ohalleran-family-farm-ltd/) |
| Carrickfern Pure Irish Honey | — | Miel | listed, category not stated | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/carrickfern-pure-irish-honey/) |
| The Farmhouse Bees and Trees Ltd | — | Miel | Produce; also FarmFinder https://farmfinder.ie/producer/the-farmhouse | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/the-farmhouse-bees-and-trees-ltd/) |
| Goodness Grains Gluten Free Bakery | — | Pan y cereal | Bakery | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/goodness-grains-gluten-free-bakery/) |
| Jammy Rogers Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/jammy-rogers-bakery) |
| Heartlands Orchard | — | Sidra | Prepared Foods, Preserves | — | [Midlands directory](https://www.midlandsireland.ie/producers_directory/heartlands-orchard/) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
