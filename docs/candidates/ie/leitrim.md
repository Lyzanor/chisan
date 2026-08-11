# Leitrim — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/leitrim.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/leitrim>, plus each producer
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
| Morans Mega Jam Ltd | Dowra (nearest, 4.3 km) | Conservas | www.moransmegajam.ie | (049) 436 7556 | 54.1401622, -8.0524782 | [FarmFinder](https://farmfinder.ie/producer/morans-mega-jam-ltd); via Food Culture Ireland |
| Scotts Irish Whisky | Rossinver (nearest, 3.5 km) | Destilados y licores | scottsirish.com | +44 28 6865 8568 · it@scottsirish.com | 54.4169666, -8.0862675 | OSM way/995887984 |
| Artessa | Carrick-on-Shannon (nearest, 1 km) | Otros | www.artessa.ie | (071) 959 0120 | 53.9458889, -8.0748759 | [FarmFinder](https://farmfinder.ie/producer/artessa); via Organic Trust |
| National Organic Training Skillnet | Drumshanbo (nearest, 1.2 km) | Otros | nots.ie ⚠ | (071) 964 0688 | 54.0393993, -8.0316168 | [FarmFinder](https://farmfinder.ie/producer/national-organic-training-skillnet); via Organic Trust |
| The French Market Ltd. | Dowra (nearest, 1.7 km) | Otros | www.thefrenchmarket.ie | — | 54.1247, -8.0025 | [FarmFinder](https://farmfinder.ie/producer/the-french-market-ltd); via Organic Trust |

## Needs one more fact — 11

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Bennett's Butchers | Manorhamilton (nearest, 1.6 km) | Carne | — | — | 54.292758, -8.169545 | [FarmFinder](https://farmfinder.ie/producer/bennett-s-butchers); via Associated Craft Butchers of Ireland |
| Campbell Meats | Drumshanbo | Carne | — | — | — | DAFM meat 2939 |
| Chef In A Box LTD | Drumshanbo | Carne | — | — | — | DAFM meat 3054 |
| Declan McCarthy Meats | Ballinamore | Carne | — | — | — | DAFM meat 2820 |
| Micheal Scollan Meats | Ballinamore (nearest, 1.2 km) | Carne | — | 071 9645948 | 54.040438, -7.806787 | [FarmFinder](https://farmfinder.ie/producer/micheal-scollan-meats); via Irish Butchers Guild |
| Reynolds Butchers | Shannon (nearest, 0.5 km) | Carne | — | 086 263 9002 | 52.710952, -8.863517 | [FarmFinder](https://farmfinder.ie/producer/reynolds-butchers); via Associated Craft Butchers of Ireland |
| Arroo Honesty | Buckode (nearest, 0.6 km) | Huevos | — | — | 54.42612955881273, -8.217577321052273 | [FarmFinder](https://farmfinder.ie/producer/arroo-honesty); via yourhonestybox.com |
| Shannon Box | Drumkeeran (nearest, 7.4 km) | Huevos | — | — | 54.18314854685319, -8.031095836579532 | [FarmFinder](https://farmfinder.ie/producer/shannon-box); via yourhonestybox.com |
| Blake’s Always Organic (registered as John Brennan & Seán McGloin) | The Enterprise Centre Hill | Lácteos y quesos | — | — | — | DAFM dairy IE2229 |
| Leitrim Hill Creamery | Drumcong, Carrick-on-Shannon, Co. Leitrim, | Lácteos y quesos | — | — | — | DAFM dairy IE2183 |
| The Little Roadside Hub | Killarga (nearest, 1.5 km) | Lácteos y quesos | — | — | 54.243215645252, -8.207068936534258 | [FarmFinder](https://farmfinder.ie/producer/the-little-roadside-hub); via yourhonestybox.com |

## Name and county only — 15

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Clarkes Butchers | Drumkeeran | Carne | shop=butcher | +353 71 964 8010 | OSM way/1068067690 |
| Gunning, Tadhg and Sean | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/gunning-tadhg-and-sean) |
| McBrien Cannoboe Market | Ballinamore (nearest, 0.4 km) | Carne | shop=butcher | +353 71 964 4692 | OSM node/5084742133 |
| McHughes Butcher | Ballinamore (nearest, 0.3 km) | Carne | shop=butcher | +353 71 964 5172 | OSM node/5083609971 |
| McNally, Mario and Maureen Kelleher-McNally | — | Carne | Farm; Organic, Organic Trust Licensee, Beef, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/mcnally-mario-and-maureen-kelleher-mcnally) |
| Michael Scollan Butcher | Ballinamore (nearest, 0.3 km) | Carne | shop=butcher | +353 71 964 5948 | OSM node/5084750024 |
| PJ Rigney Distillery | — | Cerveza | Producer; Origin Green Member, Beer, Cider, Spirits | — | [FarmFinder](https://farmfinder.ie/producer/pj-rigney-distillery) |
| The Organic Centre | — | Fruta y verdura | Farm; Organic, Fruit, Vegetables; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/the-organic-centre) |
| Bluebell Organic Farm | — | Otros | Farm; IOA Member, Organic, Vegetables, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/bluebell-organic-farm) |
| Dugdales | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/dugdales) |
| Honestly Farm Kitchen Carrick on Shannon | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/honestly-farm-kitchen-carrick-on-shannon) |
| Bits & Bytes Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/bits-and-bytes-bakery) |
| Carrig Rua Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/carrig-rua-bakery) |
| Dromod Boxty | — | Pan y cereal | Producer; Bread & Bakery, Food Culture Ireland | — | [FarmFinder](https://farmfinder.ie/producer/dromod-boxty) |
| Redbank Seafood | — | Pescado | Producer; Seafood, SuperValu Food Academy, Honesty Box | — | [FarmFinder](https://farmfinder.ie/producer/redbank-seafood) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
