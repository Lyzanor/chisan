# Kildare — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/kildare.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/kildare>, plus each producer
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

## Ready to verify — 23

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Juice Press Orchards | Rathmore (nearest, 3 km) | Bebidas sin alcohol | www.mulrines.ie ⚠ | (074) 913 1009 | 53.2437317, -6.5541287 | [FarmFinder](https://farmfinder.ie/producer/juice-press-orchards); via Bord Bia Origin Green |
| Cribbin Family Butchers | Johnstown (nearest, 3.7 km) | Carne | www.cribbinbutchers.ie | 045 888750 | 53.209753, -6.651576 | [FarmFinder](https://farmfinder.ie/producer/cribbin-family-butchers); via Irish Butchers Guild |
| Gorman Butchers | Castledermot (nearest, 3.5 km) | Carne ? | www.ogormanmeats.ie | (059) 914 4714 | 52.8860754, -6.8092609 | [FarmFinder](https://farmfinder.ie/producer/gorman-butchers); via SuperValu Food Academy |
| Morell Meats | Ballyoulster (nearest, 1.4 km) | Carne | dawnmeats.com ⚠ | (046) 955 1041 | 53.348195, -6.532303 | [FarmFinder](https://farmfinder.ie/producer/morell-meats); via Associated Craft Butchers of Ireland |
| Nolan Butchers of Kilcullen | Newbridge (nearest, 2.9 km) | Carne | nolansofkilcullen.com | (045) 481 229 | 53.194775, -6.832809 | [FarmFinder](https://farmfinder.ie/producer/nolan-butchers-of-kilcullen); via Associated Craft Butchers of Ireland |
| O'Gorman Meats Castledermot | Allen (nearest, 0.3 km) | Carne | www.ogormanmeats.ie | (059) 914 4201 | 53.233663, -6.860866 | [FarmFinder](https://farmfinder.ie/producer/o-gorman-meats-castledermot); via Associated Craft Butchers of Ireland |
| Lily O'Brien's Chocolates | Newbridge (nearest, 1.2 km) | Chocolate ? | www.lilyobriens.ie | (045) 486 800 | 53.165658199999996, -6.805249 | [FarmFinder](https://farmfinder.ie/producer/lily-obriens-chocolates); via Bord Bia Origin Green |
| Buitelaar Production (IRE) | Castledermot (nearest, 2 km) | Otros | buitelaaragriculture.com | (059) 916 2588 | 52.90874350000001, -6.8085355 | [FarmFinder](https://farmfinder.ie/producer/buitelaar-production-ire); via Bord Bia Origin Green |
| Burtown House | Kildare (nearest, 0.6 km) | Otros | www.burtownhouse.ie | (059) 862 3865 | 53.15673, -6.917597 | [FarmFinder](https://farmfinder.ie/producer/burtown-house-co-kildare); via Irish Organic Association |
| CROP | Maddenstown (nearest, 2.2 km) | Otros | www.crop.ie | +35387639050 | 53.1596699, -6.8453071 | [FarmFinder](https://farmfinder.ie/producer/crop); via NeighbourFood |
| Dawn Farms | Johnstown (nearest, 1.6 km) | Otros | www.dawnfarms.ie | (045) 875 555 | 53.2330334, -6.644237 | [FarmFinder](https://farmfinder.ie/producer/dawn-farms); via Bord Bia Origin Green |
| DSG Packaging Ltd | Ladytown (nearest, 0.7 km) | Otros | dsgpack.ie ⚠ | (045) 884 200 | 53.2035839, -6.7431613 | [FarmFinder](https://farmfinder.ie/producer/dsg-packaging-ltd); via Organic Trust |
| Fused by Fiona Uyema | Kilcullen (nearest, 2.8 km) | Otros | fusedbyfionauyema.com | (045) 481 791 | 53.154336199999996, -6.753938499999999 | [FarmFinder](https://farmfinder.ie/producer/fused-by-fiona-uyema); via Bord Bia Origin Green |
| Green Isle Foods | Johnstown (nearest, 1.4 km) | Otros | www.greenislefoods.ie | (045) 574 574 | 53.232437399999995, -6.6401672 | [FarmFinder](https://farmfinder.ie/producer/green-isle-foods); via Bord Bia Origin Green |
| Hoffmanns Fine Foods | Rosemount (nearest, 2.2 km) | Otros | www.redmondfinefoods.ie | (045) 883 570 | 53.413751, -7.639219 | [FarmFinder](https://farmfinder.ie/producer/hoffmanns-fine-foods); via SuperValu Food Academy |
| Jane Russells | Drumraney (nearest, 0.8 km) | Otros | janerussells.ie | (045) 480 100 | 53.481133, -7.762545 | [FarmFinder](https://farmfinder.ie/producer/jane-russells); via SuperValu Food Academy |
| Lullymore Foods | Ballycumber (nearest, 1.7 km) | Otros | www.lullymoreheritagepark.com | (045) 870 238 | 53.323398, -7.70944 | [FarmFinder](https://farmfinder.ie/producer/lullymore-foods); via SuperValu Food Academy |
| Moyallon Foods | Clane (nearest, 0.5 km) | Otros | www.ballymooneyfoods.com ⚠ | (045) 892 000 | 53.2965571, -6.688676 | [FarmFinder](https://farmfinder.ie/producer/moyallon-foods); via SuperValu Food Academy |
| Nellys Simply Soup | Johnstown (nearest, 1.5 km) | Otros | www.nellysdublin.com | (01) 598 4608 | 53.2324931, -6.642644700000001 | [FarmFinder](https://farmfinder.ie/producer/nellys-simply-soup); via SuperValu Food Academy |
| Pharmapac Ltd | Ladytown (nearest, 0.7 km) | Otros | www.pharmapac.ie | (045) 447 516 | 53.2033573, -6.743764499999999 | [FarmFinder](https://farmfinder.ie/producer/pharmapac-ltd); via Organic Trust |
| Brigid's Cake Room | Clane (nearest, 0 km) | Pan y cereal | www.brigidscakeroom.ie | — | 53.29231, -6.6859489 | OSM node/11284926922 |
| Lekker Food Collection | Thomastown | Pan y cereal | www.lekkerfoodco.ie | — | 52.526129, -7.1385535 | OSM node/8657163857 |
| Natural Bakery | Maynooth | Pan y cereal | thenaturalbakery.ie | +353 1 5048 357 · maynoothtnb@gmail.com | 53.3819009, -6.5941229 | OSM node/788664368 |

## Needs one more fact — 42

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Ballymooney Foods Limited | Clane | Carne | — | — | — | DAFM meat 2967 |
| Bergin Family Foodstore | Newbridge (nearest, 3.7 km) | Carne | — | (045) 881 038 | 53.184369, -6.855466 | [FarmFinder](https://farmfinder.ie/producer/bergin-family-foodstore); via Associated Craft Butchers of Ireland |
| Bergin's Food Yard | East Wall (nearest, 0.9 km) | Carne | — | (045) 881 038 | 53.353647, -6.248198 | [FarmFinder](https://farmfinder.ie/producer/bergin-s-food-yard); via Associated Craft Butchers of Ireland |
| Coyne Butchers | Kilcock (nearest, 6.1 km) | Carne | — | (01) 628 9066 | 53.379525, -6.590313 | [FarmFinder](https://farmfinder.ie/producer/coyne-butchers); via Associated Craft Butchers of Ireland |
| Dawn Farm Foods Ltd | Naas | Carne | — | — | — | DAFM meat 734 |
| Dawn Kildare (registered as Dawn Meats Ireland UC T/A Dawn Kildare) | Kildare | Carne | — | — | — | DAFM meat 268 |
| Gormley Family Butchers | Prosperous (nearest, 1.4 km) | Carne | — | 085 123 0309 | 53.276069, -6.762335 | [FarmFinder](https://farmfinder.ie/producer/gormley-family-butchers); via Associated Craft Butchers of Ireland |
| Haynestown Meats Limited | Naas | Carne | — | — | — | DAFM meat 2712 |
| International Meat Ingredients Ltd (IMI Ltd) | Naas | Carne | — | — | — | DAFM meat 757 |
| James Nolan | Kilcullen | Carne | — | — | — | DAFM meat 2332 |
| JJ Young and Sons (registered as Celbridge Meats T/A JJ Young and Sons) | Clane | Carne | — | — | — | DAFM meat 2719 |
| Kildare County Turkeys | Rathmuck | Carne | — | — | — | DAFM meat 2706 |
| McConnon Meats | Rathangan | Carne | — | — | — | DAFM meat 2333 |
| Newbridge Foods Ltd | Newbridge | Carne | — | — | — | DAFM meat 754 |
| Newbridge Meats Ltd | Newbridge | Carne | — | — | — | DAFM meat 570 |
| Niall & James O'Gorman | Castledermot | Carne | — | — | — | DAFM meat 2653 |
| O’Brien Fine Foods UC | Naas | Carne | — | — | — | DAFM meat 2313 |
| Paddy Byrne Craft Butchers | Kildare (nearest, 0.5 km) | Carne | — | (045) 521 998 | 53.153973, -6.90268 | [FarmFinder](https://farmfinder.ie/producer/paddy-byrne-craft-butchers); via Associated Craft Butchers of Ireland |
| The Culinary Food Group (registered as TCFG Naas Limited T/A The Culinary Food Group) | Naas | Carne | — | — | — | DAFM meat 2005 |
| The Irish Biltong Company LTD | Naas | Carne | — | — | — | DAFM meat 2968 |
| Tommy's Butchers Maynooth | Maynooth | Carne | — | +35316286317 | 53.366718, -6.591603 | [FarmFinder](https://farmfinder.ie/producer/tommy-s-butchers-maynooth); via Associated Craft Butchers of Ireland |
| Walsh Butchers Kilcock | Dunmurry West (nearest, 2.7 km) | Carne | — | (01) 628 4119 | 53.186475, -6.89607 | [FarmFinder](https://farmfinder.ie/producer/walsh-butchers-kilcock); via Associated Craft Butchers of Ireland |
| Watkins Butchers | Confey (nearest, 1.1 km) | Carne | — | (01) 624 4540 | 53.374473, -6.476591 | [FarmFinder](https://farmfinder.ie/producer/watkins-butchers); via Associated Craft Butchers of Ireland |
| Donadea Organic Veg | Rathcoffey (nearest, 4.2 km) | Fruta y verdura | — | — | 53.35518501627575, -6.736456806234985 | [FarmFinder](https://farmfinder.ie/producer/donadea-organic-veg); via yourhonestybox.com |
| Graze Dairies Ltd | Chestnut Lane Downings Prosperous | Lácteos y quesos | — | — | — | DAFM dairy IE2193 |
| Killadoon Milk (registered as Killadoon Farm Ltd) | Killadoon Celbridge Co Kildare | Lácteos y quesos | — | — | — | DAFM dairy IE2186 |
| Lily's Limited | Green Road Newbridge Co | Lácteos y quesos | — | — | — | DAFM dairy 1720 |
| Ballyfair Farm | Cutbush (nearest, 0.6 km) | Otros | — | — | 53.11849040332373, -6.8367799688702355 | [FarmFinder](https://farmfinder.ie/producer/ballyfair-farm); via yourhonestybox.com |
| Featherfield farm | Lullymore (nearest, 0.3 km) | Otros | — | — | 53.2799856667946, -6.944104752605028 | [FarmFinder](https://farmfinder.ie/producer/featherfield-farm); via yourhonestybox.com |
| Graze diary | Prosperous (nearest, 1.4 km) | Otros | — | — | 53.27726512826108, -6.766807806580492 | [FarmFinder](https://farmfinder.ie/producer/graze-diary); via yourhonestybox.com |
| Kehoe’s Happy Hens | Prosperous (nearest, 3 km) | Otros | — | — | 53.30698384142131, -6.7238801681274 | [FarmFinder](https://farmfinder.ie/producer/kehoe-s-happy-hens); via yourhonestybox.com |
| Larkfield | Athy (nearest, 3.1 km) | Otros | — | — | 52.9812592816585, -7.033244937486607 | [FarmFinder](https://farmfinder.ie/producer/larkfield); via yourhonestybox.com |
| Nicholas Cullen | Kildare (nearest, 0.9 km) | Otros | — | 087 661 1019 | 53.161439, -6.919826 | [FarmFinder](https://farmfinder.ie/producer/nicholas-cullen-the-curragh-co-kildare); via Irish Organic Association |
| Ohh Goodies | Athy (nearest, 1.1 km) | Otros | — | — | 52.98685242233968, -6.973781815148996 | [FarmFinder](https://farmfinder.ie/producer/ohh-goodies); via yourhonestybox.com |
| Richard Milligan | Clane (nearest, 1.8 km) | Otros | — | — | 53.2756646, -6.6901089 | [FarmFinder](https://farmfinder.ie/producer/richard-milligan); via NeighbourFood |
| Selling from farm shop | Athy | Otros | — | — | — | [FarmFinder](https://farmfinder.ie/producer/selling-from-farm-shop-athy-co-kildare) |
| Springfield Farm | Hempstown (nearest, 1.5 km) | Otros | — | — | 53.19473261422196, -6.5209016394666826 | [FarmFinder](https://farmfinder.ie/producer/springfield-farm); via yourhonestybox.com |
| Staplestown Honesty Hut | Coill Dubh (nearest, 4.7 km) | Otros | — | — | 53.32875603696136, -6.775940737226064 | [FarmFinder](https://farmfinder.ie/producer/staplestown-honesty-hut); via yourhonestybox.com |
| The Healthy Hub | Athgarvan (nearest, 1.3 km) | Otros | — | +353877767880 · thehealthyhub321@gmail.com | 53.1544581, -6.8183615 | [FarmFinder](https://farmfinder.ie/producer/the-healthy-hub); via NeighbourFood |
| Bakehouse No.5 | Kilcock (nearest, 6 km) | Pan y cereal ? | — | — | 53.371326411228175, -6.597833721851848 | [FarmFinder](https://farmfinder.ie/producer/bakehouse-no-5); via yourhonestybox.com |
| Cake Bake shed | Grangemore (nearest, 1.4 km) | Pan y cereal | — | — | 53.11760680285103, -6.734913837384572 | [FarmFinder](https://farmfinder.ie/producer/cake-bake-shed); via yourhonestybox.com |
| Home Bake Cakes Ltd | Thomastown | Pan y cereal | — | — | 52.5336678, -7.1395229 | OSM node/11827258879 |

## Name and county only — 18

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Colm Coffey's | Kilmeage (nearest, 0.2 km) | Carne | shop=butcher | +353 45 890844 | OSM node/463710882 |
| Farrington’s Brewery | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/farringtons-brewery) |
| Kildare Brewing Company | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/kildare-brewing-company) |
| The Dew Drop Brewhouse | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-dew-drop-brewhouse) |
| Two Sisters Brewing | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/two-sisters-brewing) |
| Gibney's preserves | — | Conservas | listed | — | [FarmFinder](https://farmfinder.ie/producer/gibney-s-preserves) |
| Camphill Communities of Ireland - Camphill Community Grangebeg | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/camphill-communities-of-ireland-camphill-community-grangebeg) |
| Cooke, Joseph | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/cooke-joseph) |
| Grabacoffee | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/grabacoffee) |
| Kildare Farm Foods | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/kildare-farm-foods) |
| Mairead Smyth | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/mairead-smyth) |
| Nurney Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/nurney-farm) |
| Crean's Place | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/crean-s-place) |
| Grá Pizza | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/gr-pizza) |
| Ali's Fish Shop | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/alis-fish-shop-kildare) |
| East Coast Seafood | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/east-coast-seafood) |
| Nick's Fish Newbridge | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/nicks-fish-newbridge-kildare) |
| The Fish Market | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-fish-market) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
