# Kerry — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/kerry.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/kerry>, plus each producer
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

## Held after verification — 7

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Catherine's Bakery | Pan y cereal | Catherinescafeandbakery.com is Catherines Cafe & Bakery, a breakfast and takeaway café in the Liberties, Dublin — a hospitality business, and in Dublin rather than the Kerry file it was listed in. |
| Derrynane Smokehouse | Carne | The site carried for Derrynane Smokehouse is ringofkerry.net, the Derrynane Bay House B&B; the URL must not be carried. |
| Dingle Peninsula Cheese | Lácteos y quesos | The site carried for Dingle Peninsula Cheese is thelittlecheeseshop.ie, a Dingle cheese shop that sources and matures other makers' cheese; the cheesemaker needs its own source. |
| Dingle Pie Company | Otros | The site carried for Dingle Pie Company is thedinglepub.com, an entertainment venue; the pie maker needs its own source. |
| OrganiGo | Otros | OrganiGo describes itself as a ready-to-eat organic vegetable producer but the live site sells compliance training and consultancy; what it currently produces is unresolved. |
| Seamus O'Sullivan Master Butchers | Carne | The site carried for Seamus O'Sullivan Master Butchers is blocalcard.com, a customer loyalty-card platform; the URL must not be carried. |
| the Little Cheese Company | Lácteos y quesos | The Little Cheese Company and Dingle Peninsula Cheese were filed against the same shop site, thelittlecheeseshop.ie; neither identity is established by it. |

## Needs one more fact — 48

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Ard Beginish Production Kitchen | RenardCahirciveen | Carne | — | — | — | FSAI HSE 4100 |
| CA Meats LTD | Annascaul | Carne | — | — | — | DAFM meat 2940 |
| Country Pork Killarney | Killarney (nearest, 1.1 km) | Carne | — | (064) 663 1181 | 52.048967, -9.507565 | [FarmFinder](https://farmfinder.ie/producer/country-pork-killarney); via Associated Craft Butchers of Ireland |
| Country Stores Castlegregory | Killarney (nearest, 2.2 km) | Carne | — | (066) 713 9433 | 52.077248, -9.519897 | [FarmFinder](https://farmfinder.ie/producer/country-stores-castlegregory); via Associated Craft Butchers of Ireland |
| Eddie Wadding Butchers | Blennerville (nearest, 4 km) | Carne | — | — | 52.283136, -9.697172 | [FarmFinder](https://farmfinder.ie/producer/eddie-wadding-butchers); via Associated Craft Butchers of Ireland |
| Garveys Gourmet Kitchen | Unit 5 Monavalley Industrial EstateMonav | Carne | — | — | — | FSAI HSE 4101 |
| Gortamullen Bakery Ltd. | Unit 3 | Carne | — | — | — | FSAI HSE 4042 |
| John Browne's Butchers | Fossa (nearest, 3.6 km) | Carne | — | — | 52.04199, -9.552689 | [FarmFinder](https://farmfinder.ie/producer/john-browne-s-butchers); via Associated Craft Butchers of Ireland |
| John Griffin Butchers LTD | Listowel | Carne | — | — | — | DAFM meat 2889 |
| Kieran Burns | Sneem | Carne | — | — | — | DAFM meat 2505 |
| Killarney Meat Company LTD | Killarney | Carne | — | — | — | DAFM meat 2841 |
| Millers (registered as Iveragh Meats Ltd T/A Millers) | Killarney | Carne | — | — | — | DAFM meat 2858 |
| On the Wild Side (registered as Oliver Beaujouan T/A On the Wild Side) | Castlegregory | Carne | — | — | — | DAFM meat 2797 |
| Piog Pies (registered as Brid Ni Mhathuna T/A Piog Pies) | Tralee | Carne | — | — | — | DAFM meat 2795 |
| Prestige Foods Ltd | Listowel | Carne | — | — | — | DAFM meat 157 |
| Putog Teoranta | Kenmare | Carne | — | — | — | DAFM meat 3051 |
| Sneem Meats Ltd | Sneem | Carne | — | — | — | DAFM meat 2758 |
| T Cronin & Sons | Killarney | Carne | — | — | — | DAFM meat 2816 |
| Terry's Butchers Tralee | Ballyseedy (nearest, 2.8 km) | Carne ? | — | (066) 712 6174 | 52.264686, -9.693534 | [FarmFinder](https://farmfinder.ie/producer/terry-s-butchers-tralee); via Associated Craft Butchers of Ireland |
| Thomas Ashe | Annascaul | Carne | — | — | — | DAFM meat 2523 |
| Portmagee Distilling and Brewing Company Ltd. | — | Cerveza | www.portmageewhiskey.com | +353 87 701 5479 · info@portmageewhiskey.com | — | [FarmFinder](https://farmfinder.ie/producer/portmagee-distilling-and-brewing-company-ltd) |
| Kenmare Ice Cream (registered as MarMc Ltd) | 4 Henry St Kenmare | Helados | — | — | — | DAFM dairy IE1952 |
| McCarthys Ice Cream (registered as Joanna McCarthy) | 3 Main St. Ballybunion, | Helados | — | — | — | DAFM dairy 1921 |
| Murphy's Ice Cream (registered as Milseoga Ui Mhurchu Idirnaisiunta Teo) | Baile Na Buaile Unit | Helados | — | — | — | DAFM dairy IE1012 |
| Sliabh Mish eggs | Castlemaine (nearest, 3.3 km) | Huevos | — | — | 52.196212367838136, -9.707175668754449 | [FarmFinder](https://farmfinder.ie/producer/sliabh-mish-eggs); via yourhonestybox.com |
| Bainne Blasta Ltd | Upper Muckenagh Lixnaw Listowel | Lácteos y quesos | — | — | — | DAFM dairy IE2213 |
| Beal Organic Cheese Ltd | Beal Lodge Asdee Co | Lácteos y quesos | — | — | — | DAFM dairy IE1812 |
| Derreenaclaurig Cheese (registered as Harry Van Der Zanden) | Derreenaclaurig Sneem Co Kerry | Lácteos y quesos | — | — | — | DAFM dairy IE1876 |
| Dingle Farm (registered as Dingle Farmhouse Products Ltd) | Baile Ghainín Beag Ballydavid | Lácteos y quesos | — | — | — | DAFM dairy IE1888 |
| Dingle Goats Cheese (registered as Angela O'Hanlon) | Lack Inch Co Kerry | Lácteos y quesos | — | — | — | DAFM dairy IE2137 |
| Glen View Farm (registered as Jenny Keane) | Tubbertoureen Moyvane Co. Kerry | Lácteos y quesos | — | — | — | DAFM dairy IE2214 |
| Kells Bay Cheese (registered as Kerry Cow Farm Ltd) | Tobarnora Kells Bay Cahirciveen | Lácteos y quesos | — | — | — | DAFM dairy IE2010 |
| Kerry Kefir Ltd. | Tralee Rd Castleisland Co | Lácteos y quesos | — | — | — | DAFM dairy IE2150 |
| Lee Strand Co-Operative Creamery ltd | Ballymullen Tralee Co Kerry | Lácteos y quesos | — | — | — | DAFM dairy IE1066 |
| Muckross Creamery (registered as John and Catherine Fleming) | Scartlea Muckross Killarney Co | Lácteos y quesos | — | — | — | DAFM dairy IE2142 |
| Once Upon a Cheese | Farranfore (nearest, 3.7 km) | Lácteos y quesos | — | +353877778723 · onceuponacheesekerry@hotmail.com | 52.1453345, -9.5174011 | [FarmFinder](https://farmfinder.ie/producer/once-upon-a-cheese); via NeighbourFood |
| Sean Coles O'Sullivan | Ardea West Tuoist Kenmare | Lácteos y quesos | — | — | — | DAFM dairy IE2207 |
| Valentia Island Farmhouse Dairy Ltd | Kilbeg Valentia Island Co | Lácteos y quesos | — | — | — | DAFM dairy IE1929 |
| Wilma Silvius O'Connor | Ardmoniel Killorglin Co Kerry, | Lácteos y quesos | — | — | — | DAFM dairy IE1844 |
| Ardfert Farm | Kilmoyley (nearest, 4.6 km) | Otros | — | ardfertdairy@gmail.com | 52.327242, -9.7809541 | [FarmFinder](https://farmfinder.ie/producer/ardfert-farm); via NeighbourFood |
| Celtic Donuts | Farranfore (nearest, 3.7 km) | Otros | — | celticdonuts@gmail.com | 52.1453345, -9.5174011 | [FarmFinder](https://farmfinder.ie/producer/celtic-donuts); via NeighbourFood |
| Groyne | Killorglin (nearest, 1.8 km) | Otros | — | — | 52.09490064766811, -9.765885007461115 | [FarmFinder](https://farmfinder.ie/producer/groyne); via yourhonestybox.com |
| Inch House | Beaufort (nearest, 0.4 km) | Otros | — | — | 52.066712, -9.639451 | [FarmFinder](https://farmfinder.ie/producer/inch-house); via SuperValu Food Academy |
| Jeremiah OâDonnell | Fossa (nearest, 0.8 km) | Otros | — | — | 52.0667, -9.5667 | [FarmFinder](https://farmfinder.ie/producer/jeremiah-o-donnell); via Organic Trust |
| Leagh Farm | Ballyduff (nearest, 1.3 km) | Otros | — | — | 52.4619432084567, -9.65455235321593 | [FarmFinder](https://farmfinder.ie/producer/leagh-farm); via yourhonestybox.com |
| The Cultured Couple | Moyvane (nearest, 0.1 km) | Otros | — | +353868521681 · norma@carralea.ie | 52.5014313, -9.3706916 | [FarmFinder](https://farmfinder.ie/producer/the-cultured-couple); via NeighbourFood |
| Puccini's Coffee & More | Kenmare | Pan y cereal | — | — | 51.878029, -9.5836302 | OSM node/11076152462 |
| Real Bread Killarney | Killorglin (nearest, 0.9 km) | Pan y cereal | — | realbreadkillarney@gmail.com | 52.1127632, -9.7769301 | [FarmFinder](https://farmfinder.ie/producer/real-bread-killarney); via NeighbourFood |

## Name and county only — 35

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Diarmiud's Family Butcher | Castleisland (nearest, 0.2 km) | Carne | shop=butcher | +353 66 714 2634 · diarmuid-reidy@hotmail.com | OSM node/1423985043 |
| Maguire’s Butchers | Tralee | Carne | shop=butcher | +353 66 711 9740 | OSM way/605862012 |
| Matt the Butcher | Tralee | Carne | shop=butcher | +353 66 712 9790 | OSM node/13019580380 |
| Peter O'Sullivan | Sneem (nearest, 0.2 km) | Carne | shop=butcher | +353 87 6577239 | OSM node/6600952780 |
| Beoir Chorca Duibhne | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/beoir-chorca-duibhne) |
| Dick Mac’s Brewery | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/dick-macs-brewery) |
| Killarney Brewing Co. | — | Cerveza | listed; also OSM way/1039046039 | — | [FarmFinder](https://farmfinder.ie/producer/killarney-brewing-co) |
| McGills Brewery | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/mcgills-brewery) |
| Skellig Six18 Distillery | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/skellig-six18-distillery) |
| Tom Crean Brewery | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/tom-crean-brewery) |
| Torc Brewing Co. | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/torc-brewing-co) |
| Derrynane Honey Farm | — | Miel | Farm; Preserves, Honey, Farm Gate; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/derrynane-honey-farm) |
| All Real Nutrition | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/all-real-nutrition) |
| Gairdín Beag | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/gaird-n-beag) |
| Gortbrack Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/gortbrack-organic-farm) |
| Lion.L Raw Kitchen | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/lion-l-raw-kitchen) |
| Manna Organic Store | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/manna-organic-store) |
| Micilín Muc | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/micil-n-muc) |
| Poppa Dom's Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/poppa-dom-s-farm) |
| Thomas Kavanagh | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/thomas-kavanagh) |
| Bácús Bhréanainn | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/b-c-s-bhr-anainn) |
| Eileen's Bakery, Deli & Coffee Shop | Castleisland (nearest, 0.3 km) | Pan y cereal | shop=bakery | +353 66 714 3417 | OSM node/12714081201 |
| Emilie's Ireland | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/emilie-s-ireland) |
| Gabi's Bakery and Coffee House | Killorglin | Pan y cereal | shop=bakery | +353 87 002 9242 | OSM node/5609411522 |
| Jacks Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/jacks-bakery) |
| Moloney's Cake Shop | Castleisland | Pan y cereal | shop=bakery | +353 66 714 1636 · moloneyscakeshop102@hotmail.com | OSM node/1423985010 |
| Wild Sage Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/wild-sage-bakery) |
| Fishery Smokehouse Ltd | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/fishery-smokehouse-ltd) |
| Patrick Cronin Organic Shellfish Ltd | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/patrick-cronin-organic-shellfish-ltd) |
| Quinlan's Kerry Fish | — | Pescado | listed; also FarmFinder https://farmfinder.ie/producer/quinlans-kerry | — | [FarmFinder](https://farmfinder.ie/producer/quinlans-kerry-fish) |
| Shamrock Shellfish | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/shamrock-shellfish) |
| Smoked Salmon Direct | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/smoked-salmon-direct) |
| Spa Seafoods | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/spa-seafoods) |
| Spillane Seafood | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/spillane-seafood-kerry) |
| The Village Fish Shop | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-village-fish-shop-kerry) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
