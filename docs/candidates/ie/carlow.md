# Carlow — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/carlow.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/carlow>, plus each producer
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

## Ready to verify — 7

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Murphy's Butchers Tullow | Tullow (nearest, 1 km) | Carne | murphysbutcherstullow.ie | (059) 915 1316 | 52.792034, -6.729626 | [FarmFinder](https://farmfinder.ie/producer/murphy-s-butchers-tullow); via Associated Craft Butchers of Ireland |
| Walsh Whiskey | Palatine (nearest, 2.3 km) | Destilados y licores | www.walshwhiskey.com | (059) 913 3232 | 52.853632, -6.8840135 | [FarmFinder](https://farmfinder.ie/producer/walsh-whiskey); via Bord Bia Origin Green |
| Codd Mushrooms | Tullow (nearest, 5.4 km) | Fruta y verdura | www.coddmushrooms.ie | (059) 916 3031 | 52.8472976, -6.7592206 | [FarmFinder](https://farmfinder.ie/producer/codd-mushrooms); via Bord Bia Origin Green |
| Émile Pâtissier Ltd | Carlow (nearest, 2.1 km) | Otros | www.cowgirl.ie ⚠ | (059) 913 0573 | 52.841651899999995, -6.9070798 | [FarmFinder](https://farmfinder.ie/producer/mile-p-tissier-ltd); via Bord Bia Origin Green |
| Flying Tumbler | Nurney (nearest, 2.4 km) | Otros | flyingtumbler.com | — | 52.7451961, -6.8758341 | [FarmFinder](https://farmfinder.ie/producer/flying-tumbler); via Bord Bia Origin Green |
| Moyleabbey Organic | Shandon (nearest, 0.2 km) | Otros | www.burrensmokehouse.com/) ⚠ | (059) 862 3800 | 51.902941, -8.472326 | [FarmFinder](https://farmfinder.ie/producer/moyleabbey-organic-co-kildare); via Irish Organic Association |
| Tuismitheoirí na Gaeltachta | Fennagh (nearest, 3 km) | Otros | www.tuismitheoiri.ie | +35391869571 · eolas@tuismitheoiri.ie | 52.6906096, -6.8249424 | [FarmFinder](https://farmfinder.ie/producer/tuismitheoir-na-gaeltachta); via NeighbourFood |

## Needs one more fact — 17

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Ballon Meats Ltd | Ballon | Carne | — | — | — | DAFM meat 392 |
| Clonmore Meats | Killeshin | Carne | — | — | — | DAFM meat 2499 |
| Matthew Kearney & Sons LTD | Carlow | Carne | — | — | — | DAFM meat 2531 |
| McAssey Butchers | Kernanstown (nearest, 2.6 km) | Carne | — | (059) 915 9243 | 52.803516, -6.856235 | [FarmFinder](https://farmfinder.ie/producer/mcassey-butchers); via Associated Craft Butchers of Ireland |
| Sheehan Meats | Bennekerry | Carne | — | — | — | DAFM meat 2530 |
| Galway Chocolate House | Fennagh (nearest, 3 km) | Chocolate | — | +353874379888 | 52.6906096, -6.8249424 | [FarmFinder](https://farmfinder.ie/producer/galway-chocolate-house); via NeighbourFood |
| Royal Oak Stores | Royaloak (nearest, 0.2 km) | Destilados y licores | — | — | 52.7025386, -6.9847294 | OSM way/561537789 |
| Lisnavagh Walled Garden Box | — | Fruta y verdura | www.lisnavagh.com | — | — | [FarmFinder](https://farmfinder.ie/producer/lisnavagh-walled-garden-box); via FarmFinder Team |
| Tipperary Organic Ice Cream | c/o Healy Fine Foods | Helados | — | — | — | DAFM dairy IE1010 |
| Carlow Cheese (registered as Elizabeth Bradley) | Ballybrommell Fenagh Co Carlow | Lácteos y quesos | — | — | — | DAFM dairy IE1917 |
| Coolattin Cheddar Ltd | Knockeen Tullow Co Carlow | Lácteos y quesos | — | — | — | DAFM dairy IE1925 |
| The Village Dairy | Clonmore Killeshin Carlow | Lácteos y quesos | — | — | — | DAFM dairy IE2007 |
| Helens Home Bakes | Tullow (nearest, 1.1 km) | Otros | — | — | 52.8069431915917, -6.723790045300925 | [FarmFinder](https://farmfinder.ie/producer/helens-home-bakes); via yourhonestybox.com |
| Johnstown Honesty hut | Kernanstown (nearest, 2.6 km) | Otros | — | — | 52.83333631025581, -6.843933845276861 | [FarmFinder](https://farmfinder.ie/producer/johnstown-honesty-hut); via yourhonestybox.com |
| The Haggart Farm | Carlow (nearest, 1.3 km) | Otros | — | Jimbosami@gmail.com | 52.839404, -6.9455032 | [FarmFinder](https://farmfinder.ie/producer/the-haggart-farm); via NeighbourFood |
| O Hanlons organic farm | St Mullin's (nearest, 0.8 km) | Pan y cereal | — | — | 52.476409493533836, -6.901732363440157 | [FarmFinder](https://farmfinder.ie/producer/o-hanlons-organic-farm); via yourhonestybox.com |
| Sweet Baking Mama | Carlow (nearest, 0.6 km) | Pan y cereal | — | +353 85 873 0700 | 52.8357919, -6.9326592 | OSM node/12876907403 |

## Name and county only — 12

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Sunshine Juice Ltd | — | Bebidas sin alcohol | listed | — | [FarmFinder](https://farmfinder.ie/producer/sunshine-juice-ltd) |
| Coppenagh House Farm Shop | — | Carne | Farm; Beef, Pork, Fruit, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/coppenagh-house-farm-shop) |
| Quarrymount Meats and Farm Ltd | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | [FarmFinder](https://farmfinder.ie/producer/quarrymount-meats-and-farm-ltd) |
| Carlow Brewing | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/carlow-brewing) |
| Royal Oak Distillery Ltd | — | Cerveza | Producer; Origin Green Member, Beer, Cider, Spirits | — | [FarmFinder](https://farmfinder.ie/producer/royal-oak-distillery-ltd) |
| Malone Fruit Farm | — | Fruta y verdura | Farm; Fruit, Vegetables, Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/malone-fruit-farm) |
| Rings Farm | — | Otros | Farm; IOA Member, Organic, Vegetables, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/rings-farm) |
| Builín Úr | — | Pan y cereal | Producer; Organic, Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/buil-n-r) |
| Plur Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/plur-bakery) |
| Mary's Fish Galway | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/mary-s-fish-galway) |
| Craigies Cider | — | Sidra | Producer; Cider, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/craigies-cider) |
| Falling Apple Cider | — | Sidra | Producer; Cider, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/falling-apple-cider) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
