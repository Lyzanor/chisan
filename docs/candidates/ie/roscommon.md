# Roscommon — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/roscommon.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/roscommon>, plus each producer
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

## Ready to verify — 3

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Waldron Family Meats | Brideswell (nearest, 3.9 km) | Carne ? | www.waldronmeats.ie | (090) 648 8220 | 53.47356, -8.1435836 | [FarmFinder](https://farmfinder.ie/producer/waldron-family-meats); via Bord Bia Origin Green |
| Sean Butler | Castlerea (nearest, 0.4 km) | Otros | www.hillsideholisticfarm.ie ⚠ | 087 230 8152 | 53.769724599999996, -8.4954593 | [FarmFinder](https://farmfinder.ie/producer/sean-butler); via Organic Trust |
| Benny's Deli & Bakery | Castlerea | Pan y cereal | www.bennysdeli.com | — | 53.7691966, -8.4949112 | OSM way/843036059 |

## Needs one more fact — 11

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Ballaghadereen Bacon Factory Ltd | Ballaghdereen | Carne | — | — | — | DAFM meat 395 |
| Castlemine Farm LTD | Roscommon | Carne | — | — | — | DAFM meat 2941 |
| Cunniffe's Bacon Factory | Ballaghaderreen (nearest, 1.1 km) | Carne | — | (094) 986 0623 | 53.910851, -8.584676 | [FarmFinder](https://farmfinder.ie/producer/cunniffe-s-bacon-factory); via Associated Craft Butchers of Ireland |
| Do Me A Flavour (registered as VOA Foods UC T/A Do Me A Flavour) | Athlone | Carne | — | — | — | DAFM meat 2178 |
| Gilligan Farm Fresh Meats | Fourmilehouse | Carne | — | — | — | DAFM meat 2383 |
| Michael Waldron Meats LTD | Athlone | Carne | — | — | — | DAFM meat 2412 |
| Mr John Webb | Castlerea | Carne | — | — | — | DAFM meat 2621 |
| Oliver Carty UC | Athlone | Carne | — | — | — | DAFM meat 784 |
| Diffleys Family Farm | Tarmonbarry (nearest, 0.8 km) | Huevos | — | — | 53.74327722924097, -7.920666752255875 | [FarmFinder](https://farmfinder.ie/producer/diffleys-family-farm); via yourhonestybox.com |
| Noble | Ballintober South (nearest, 7.6 km) | Otros | — | 0852852282 | 53.6982695, -8.2182508 | [FarmFinder](https://farmfinder.ie/producer/noble); via Food Culture Ireland |
| Píosa Cake | Strokestown (nearest, 5.4 km) | Pan y cereal | — | — | 53.796633806901234, -8.028910952215092 | [FarmFinder](https://farmfinder.ie/producer/p-osa-cake); via yourhonestybox.com |

## Name and county only — 12

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Ballymore Organic Farm | — | Carne | Farm; Organic, Organic Trust Licensee, IOA Member, Beef | — | [FarmFinder](https://farmfinder.ie/producer/ballymore-organic-farm) |
| Curley, Seamus & Elsie | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/curley-seamus-and-elsie) |
| Drumanilra Organic Farm | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/drumanilra-organic-farm) |
| Gannon, James and Mary Scally | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/gannon-james-and-mary-scally) |
| Hillside Organic & Holistic Farm | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/hillside-organic-and-holistic-farm) |
| Oliver McDermott | Frenchpark | Carne | shop=butcher | +353 94 987 0031 | OSM node/6899140424 |
| Tynan, Martin | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/tynan-martin) |
| Black Donkey Brewing Co. | — | Cerveza | Producer; Beer, Farm Gate, Online | — | [FarmFinder](https://farmfinder.ie/producer/black-donkey-brewing-co) |
| Mine Farm | — | Otros | Farm; SuperValu Food Academy, Honesty Box | — | [FarmFinder](https://farmfinder.ie/producer/mine-farm) |
| Almond Artisan Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/almond-artisan-bakery) |
| Pastry Attack! | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/pastry-attack) |
| The Best Free From | — | Pan y cereal | Producer; Bread & Bakery, Delivery, Online, Food Culture Ireland | — | [FarmFinder](https://farmfinder.ie/producer/the-best-free-from) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
