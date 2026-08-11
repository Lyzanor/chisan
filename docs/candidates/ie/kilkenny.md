# Kilkenny — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/kilkenny.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/kilkenny>, plus each producer
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
| Grogan & Brown Artisan Butchers | Johnswell (nearest, 0.7 km) | Carne | groganandbrownbutchers.com | 056 7764799 | 52.705917, -7.179298 | [FarmFinder](https://farmfinder.ie/producer/grogan-and-brown-artisan-butchers); via Irish Butchers Guild |
| Costello's Brewing Co. | Kilkenny | Cerveza | www.costellosbrewco.ie | +353868102320 | — | [FarmFinder](https://farmfinder.ie/producer/costellos-brewing-co) |
| Sullivan's Brewing Co. | Kilkenny | Cerveza | www.sullivansbrewingcompany.com | +353 56 779 7980 · info@sullivansbrewingcompany.com | — | [FarmFinder](https://farmfinder.ie/producer/sullivans-brewing-co) |
| Iverk Produce ltd | Piltown (nearest, 0.9 km) | Fruta y verdura ? | www.iverkproduce.com | (051) 437 030 | 52.3420281, -7.331642699999999 | [FarmFinder](https://farmfinder.ie/producer/iverk-produce-ltd); via Bord Bia Origin Green |
| Little Milk Company | Kilkenny (nearest, 2.8 km) | Lácteos y quesos | thelittlemill.ie/where-to-buy | (056) 772 7551 | 52.650753, -7.292469 | [FarmFinder](https://farmfinder.ie/producer/little-milk-company); via SuperValu Food Academy |
| Store-All Logistics | Slieverue (nearest, 0.7 km) | Otros | www.store-all.ie | (051) 831 200 | 52.288941699999995, -7.0638599 | [FarmFinder](https://farmfinder.ie/producer/store-all-logistics); via Organic Trust |
| The Cookie Co-op | Kilkenny | Pan y cereal | www.thecookiecoop.ie | +353 86 887 2045 · info@thecookiecoop.ie | 52.6508129, -7.2538099 | OSM node/11056743300 |

## Needs one more fact — 24

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Breagagh Valley Artisan Meats | Kilkenny (nearest, 1.7 km) | Carne | — | 087 674 3008 | 52.639851, -7.233273 | [FarmFinder](https://farmfinder.ie/producer/breagagh-valley-artisan-meats) |
| Callan Bacon Company Ltd | Callan | Carne | — | — | — | DAFM meat 528 |
| Callan Premium Foods LTD | Callan | Carne | — | — | — | DAFM meat 2771 |
| John Murphy Family Butchers | Callan (nearest, 2 km) | Carne | — | (056) 770 6529 | 52.532316, -7.380482 | [FarmFinder](https://farmfinder.ie/producer/john-murphy-family-butchers); via Associated Craft Butchers of Ireland |
| Kiely Meats (Waterford) Ltd | Kilmacow | Carne | — | — | — | DAFM meat 559 |
| Lavistown Sausages | Kilkenny (nearest, 5.1 km) | Carne | — | 087 674 3008 | 52.617853, -7.3053 | [FarmFinder](https://farmfinder.ie/producer/lavistown-sausages); via SuperValu Food Academy |
| Namo Production Kitchen | Castle BlundenStable BlockKilkenny R95 X | Carne | — | — | — | FSAI HSE 4114 |
| O'Brien Butchers | Bonnettsrath | Carne | — | — | — | DAFM meat 2414 |
| TCF Foods Ltd | Ferrybank | Carne | — | — | — | DAFM meat 2843 |
| Tynan Meats Limited | Johnstown | Carne | — | — | — | DAFM meat 2474 |
| Tynan's Butchers | Johnswell (nearest, 2.8 km) | Carne | — | (044) 934 8633 | 52.726189, -7.187928 | [FarmFinder](https://farmfinder.ie/producer/tynan-s-butchers); via Associated Craft Butchers of Ireland |
| Eamonn's Organic Produce | Kilfane (nearest, 3.4 km) | Fruta y verdura ? | — | — | 52.5687098, -7.1889831 | [FarmFinder](https://farmfinder.ie/producer/eamonn-s-organic-produce); via NeighbourFood |
| Mooncoin Homegrown Beetroot | Thornback (nearest, 1 km) | Fruta y verdura | — | (051) 895 113 | 52.692863, -7.300076 | [FarmFinder](https://farmfinder.ie/producer/mooncoin-homegrown-beetroot); via SuperValu Food Academy |
| Gort Fia Honesty Shed | Emil (nearest, 2.5 km) | Huevos | — | — | 52.3251403285018, -7.246669002661596 | [FarmFinder](https://farmfinder.ie/producer/gort-fia-honesty-shed); via yourhonestybox.com |
| Knockdrinna Farmhouse Foods Ltd. | Main Street Stoneyford Co | Lácteos y quesos | — | — | — | DAFM dairy IE1911 |
| Robson's Cheese (registered as Raquel Alves) | Team Dynamics Kilkenny Ltd | Lácteos y quesos | — | — | — | DAFM dairy IE2129 |
| Aiden's Honey | Ballyragget (nearest, 2.3 km) | Miel | — | aidenshoney@gmail.com | 52.8005048, -7.3534889 | [FarmFinder](https://farmfinder.ie/producer/aiden-s-honey); via NeighbourFood |
| Ballyhenebry Farms | Ballyragget (nearest, 2.3 km) | Otros | — | ballyhenebryfarms@gmail.com | 52.8005048, -7.3534889 | [FarmFinder](https://farmfinder.ie/producer/ballyhenebry-farms); via NeighbourFood |
| Farrell’s Focus on Plants | Kilkenny (nearest, 0 km) | Otros | — | +35351850105 · carmelfarrel@gmail.com | 52.6506255, -7.2514438 | [FarmFinder](https://farmfinder.ie/producer/farrell-s-focus-on-plants); via NeighbourFood |
| Kyle Lodge Farm | Ballyragget (nearest, 2.3 km) | Otros | — | johnwalker@eircom.net | 52.8005048, -7.3534889 | [FarmFinder](https://farmfinder.ie/producer/kyle-lodge-farm); via NeighbourFood |
| Living and Growing | Callan (nearest, 0.2 km) | Otros | — | info@livingandgrowing.ie | 52.5517301, -7.3815786 | [FarmFinder](https://farmfinder.ie/producer/living-and-growing); via NeighbourFood |
| Mount Callan | Callan (nearest, 1.8 km) | Otros | — | — | 52.537224, -7.400034 | [FarmFinder](https://farmfinder.ie/producer/mount-callan); via SuperValu Food Academy |
| Arán Deli Bakery | Kilkenny (nearest, 0.7 km) | Pan y cereal | — | — | 52.656452, -7.2469916 | OSM node/9911732332 |
| Cakeface Lab | Kilkenny (nearest, 0.7 km) | Pan y cereal | — | — | 52.6558209, -7.2557636 | OSM node/8346115546 |

## Name and county only — 15

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Goatsbridge Trout Farm | — | Carne | Farm; NeighbourFood, Beef, Lamb, Pork; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/goatsbridge-trout-farm) |
| John Joe Cullen | Kilkenny (nearest, 0.5 km) | Carne | shop=butcher | +353 56 7764899 | OSM node/8279388549 |
| Ballykeefe Distillery | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/ballykeefe-distillery) |
| Regan Organic Farm | — | Fruta y verdura | Farm; IOA Member, Organic, Fruit, Vegetables | — | [FarmFinder](https://farmfinder.ie/producer/regan-organic-farm-co-wexford) |
| Nore Valley Park | — | Huevos | Farm; Eggs, Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/nore-valley-park) |
| Knockdrinna Farmhouse Cheese | — | Lácteos y quesos | Farm; Dairy, Eggs, Cheese, Farm Gate; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/knockdrinna-farmhouse-cheese) |
| Drumeen Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/drumeen-organic-farm) |
| Riversfield Organic Farm | — | Otros | Farm; IOA Member, Organic, Vegetables, Farm Gate | — | [FarmFinder](https://farmfinder.ie/producer/riversfield-organic-farm-co-kilkenny) |
| Ryeland House Cookery | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/ryeland-house-cookery) |
| Speltbaker | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/speltbaker) |
| Aran Bakery & Cafe | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/aran-bakery-and-cafe) |
| Blanco Nino | — | Pan y cereal | Producer; Bread & Bakery, Food Culture Ireland | — | [FarmFinder](https://farmfinder.ie/producer/blanco-nino) |
| Burdock & Bay | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/burdock-and-bay) |
| Lekker Food Co | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/lekker-food-co) |
| Le Caveau Wine Merchants | — | Vino | listed | — | [FarmFinder](https://farmfinder.ie/producer/le-caveau-wine-merchants) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
