# Meath — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/meath.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/meath>, plus each producer
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

## Held after verification — 12

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| A Bit on the Side | Otros | A Bit on the Side publishes no address; its candidate municipio Moylagh is an inferred nearest settlement 1.2 km from the source coordinate. |
| AP Fine Foods Ltd | Otros | AP Fine Foods publishes brands and a shared Ráth Chairn contact with O'Brien Fine Foods but no production site or own address; identity and location are unresolved. |
| Battle of The Butters | Otros | The site carried for Battle of The Butters is the Battle of the Boyne Visitor Centre page on heritageireland.ie; the URL must not be carried. |
| Brogan's Butchers | Carne | The published URL returns 404. A missing page is not proof of closure: the producer needs a current URL before it can be resolved. |
| Callaghan Butchers Bettystown | Carne | The SiteGround challenge did not clear in a browser session either; on this host it sometimes auto-redirects and sometimes escalates to a hand-solved captcha. It needs a person in a browser. |
| Clarkes Fresh Fruit | Fruta y verdura | The SiteGround challenge did not clear in a browser session either; on this host it sometimes auto-redirects and sometimes escalates to a hand-solved captcha. It needs a person in a browser. |
| Filligans | Otros | The meath note filed Filligans against finnegansfarm.ie, the Finnegan's Farm site; the Filligans identity is not established by it. |
| Gleeson Meats Navan | Carne | Gleesons Fresh Foods publishes shops in Navan and several Dublin locations with Dublin Eircodes only; which unit is productive and where is unresolved. |
| Gorse Foods | Otros | Pegus.ie answers a Cloudflare interstitial; a challenge is not a dead site, and Gorse Foods needs a second route. |
| Lir Chocolates | Chocolate ? | Lir Chocolates publishes no address; its candidate municipio Kilcarn is an inferred nearest settlement 1.3 km from the source coordinate. |
| O'Brien Fine Foods | Otros | O'Brien Fine Foods publishes brands and partnerships but no production site; the lead's coordinate sits at Ráth Chairn while the company's plant is not named on the site. |
| The Studio Coffee | Café | The Studio Coffee Roasters publishes no address; its candidate municipio is the joint census town Laytown-Bettystown-Mornington, inferred 1.3 km from the source coordinate. |

## Needs one more fact — 35

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Andrew Mahon | Drumree | Carne | — | — | — | DAFM meat 2780 |
| Euro Farm Foods (registered as Cooksgrove Ltd. T/A Euro Farm Foods) | Duleek | Carne | — | — | — | DAFM meat 297 |
| Farm House Foods (registered as DC Meats LTD T/A Farm House Foods) | Dunshaughlin | Carne | — | — | — | DAFM meat 3039 |
| Hogan's Turkeys Limited | Kells | Carne | — | — | — | DAFM meat 827 |
| Killua Castle (registered as Luna Ventures Limited T/A Killua Castle) | Kells | Carne | — | — | — | DAFM meat 3016 |
| Lorenzen's LTD (registered as Charlie Walshe T/A Lorenzen's LTD) | Kilmessan | Carne | — | — | — | DAFM meat 2959 |
| Murtagh Meats | Navan (nearest, 1.3 km) | Carne | — | (046) 904 0400 | 53.641221, -6.681301 | [FarmFinder](https://farmfinder.ie/producer/murtagh-meats); via Associated Craft Butchers of Ireland |
| PC Meats | Enfield | Carne | — | — | — | DAFM meat 2961 |
| Robert's Butchery & Smokehouse LTD | Navan | Carne | — | — | — | DAFM meat 3035 |
| Rustic Kitchen (registered as Nugent Foods LTD T/A Rustic Kitchen) | Ashbourne | Carne | — | — | — | DAFM meat 2884 |
| Ryan's Farm (registered as Iaroo LTD T/A Ryan's Farm) | Kells | Carne | — | — | — | DAFM meat 2769 |
| The Smokin'Butcher LTD | Navan | Carne | — | — | — | DAFM meat 3036 |
| The Whole Hoggs (registered as Peter Whelan T/A The Whole Hoggs) | Slane | Carne | — | — | — | DAFM meat 2972 |
| The Wooded Pig (registered as Bird Farm Ltd T/A The Wooded Pig) | Tara | Carne | — | — | — | DAFM meat 2916 |
| Thomas Doherty (registered as Thomas Doherty Meats (Kells) LTD T/A Thomas Doherty) | Kells | Carne | — | — | — | DAFM meat 2966 |
| Bulmers Ireland | Kells (nearest, 1.7 km) | Cerveza | — | — | 53.7377141, -6.8972778 | OSM node/11983111404 |
| Rathcore Eggs | Enfield (nearest, 3.7 km) | Huevos | — | — | 53.44657748025275, -6.845587798260914 | [FarmFinder](https://farmfinder.ie/producer/rathcore-eggs); via yourhonestybox.com |
| Bonnybo milk | Baylin (nearest, 4.2 km) | Lácteos y quesos | — | — | 53.40573490090719, -7.883699806484206 | [FarmFinder](https://farmfinder.ie/producer/bonnybo-milk); via yourhonestybox.com |
| Complex Nutrition Ltd | Unit 36 Navan Enterprise | Lácteos y quesos | — | — | — | DAFM dairy IE1988 |
| Emeri Nutrition Co. Limited | IDA Business Park Johnstown, | Lácteos y quesos | — | — | — | DAFM dairy 1712 |
| Four Acre Foods (registered as Four Acre Family Farm Foods Ltd) | Unit 1, Oaktree Business | Lácteos y quesos | — | — | — | DAFM dairy IE2190 |
| McGrane's Milk Barn (registered as Conor & Mark McGrane) | Walterstown, Garlow Cross, Navan, | Lácteos y quesos | — | — | — | DAFM dairy IE2163 |
| McGranes Milk Barn | Skryne (nearest, 2.6 km) | Lácteos y quesos | — | — | 53.608578896310334, -6.556424221673022 | [FarmFinder](https://farmfinder.ie/producer/mcgranes-milk-barn); via yourhonestybox.com |
| Shamsini Dairy (registered as Bashar Alawad) | Stackallen Slane Co. Meath | Lácteos y quesos | — | — | — | DAFM dairy IE2230 |
| The Milk Well Ltd | The Milk Well Ltd. | Lácteos y quesos | — | — | — | DAFM dairy IE2205 |
| Riverpark Honey | Skryne (nearest, 2.6 km) | Miel | — | — | 53.562724, -6.5667995 | [FarmFinder](https://farmfinder.ie/producer/riverpark-honey); via yourhonestybox.com |
| Katelyns Konfections | Duleek (nearest, 0.7 km) | Otros | — | — | 53.657082902505785, -6.426811567662817 | [FarmFinder](https://farmfinder.ie/producer/katelyns-konfections); via yourhonestybox.com |
| Maperath Farm | Carnaross (nearest, 2.4 km) | Otros | — | +353879027070 · info@maperathfarm.ie | 53.7631732, -6.9267963 | [FarmFinder](https://farmfinder.ie/producer/maperath-farm); via NeighbourFood |
| McCormack Family Farms | Kiltale (nearest, 1.6 km) | Otros | — | (046) 902 5695 | 53.518063299999994, -6.691167900000001 | [FarmFinder](https://farmfinder.ie/producer/mccormack-family-farms); via Bord Bia Origin Green |
| Meadowsweet Organic Farm | Kilcarn (nearest, 3.9 km) | Otros | — | — | 53.60377082387633, -6.626599622471037 | [FarmFinder](https://farmfinder.ie/producer/meadowsweet-organic-farm); via yourhonestybox.com |
| Megs Desserts | Multyfarnham (nearest, 1.1 km) | Otros | — | — | 53.62574893449254, -7.390286183028833 | [FarmFinder](https://farmfinder.ie/producer/megs-desserts); via yourhonestybox.com |
| Navan | Navan (nearest, 2.4 km) | Otros | — | — | 53.664157237754424, -6.650323260263002 | [FarmFinder](https://farmfinder.ie/producer/navan); via yourhonestybox.com |
| Primrose Pantry | Shandonagh (nearest, 2.8 km) | Otros | — | — | 53.546876390237486, -7.433080467746206 | [FarmFinder](https://farmfinder.ie/producer/primrose-pantry); via yourhonestybox.com |
| Spice Atlas | Kilmainhamwood (nearest, 2.7 km) | Otros | — | 0852083882 | 53.8742642, -6.803378 | [FarmFinder](https://farmfinder.ie/producer/spice-atlas); via Food Culture Ireland |
| Think Twice | Yellow Furze (nearest, 2.4 km) | Otros | — | +353861905634 · info@thinktwice.ie | 53.6497514, -6.5884245 | [FarmFinder](https://farmfinder.ie/producer/think-twice); via NeighbourFood |

## Name and county only — 27

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Alright Pumpkin | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | [FarmFinder](https://farmfinder.ie/producer/alright-pumpkin) |
| Ballymad Farm | — | Carne | Farm; NeighbourFood, Beef, Lamb, Pork | — | [FarmFinder](https://farmfinder.ie/producer/ballymad-farm) |
| Cullentra Farm Shop & Open Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | [FarmFinder](https://farmfinder.ie/producer/cullentra-farm-shop-and-open-farm) |
| Hogans Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | [FarmFinder](https://farmfinder.ie/producer/hogans-farm) |
| Meath Sunflower Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | [FarmFinder](https://farmfinder.ie/producer/meath-sunflower-farm) |
| Newbarn Farm Shop | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | [FarmFinder](https://farmfinder.ie/producer/newbarn-farm-shop) |
| Boann Distillery | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/boann-distillery) |
| Fresh Eggs and Potatoes | — | Huevos | listed | — | [FarmFinder](https://farmfinder.ie/producer/fresh-eggs-and-potatoes) |
| Conynghams | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/conynghams) |
| Coole Swan | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/coole-swan) |
| Dominic Gryson | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/dominic-gryson) |
| Highdell Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/highdell-organic-farm) |
| Meade Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/meade-farm) |
| Michael McDermott | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/michael-mcdermott) |
| Rathkennery Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/rathkennery-farm) |
| Rock Farm Slane | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/rock-farm-slane) |
| Ryans' Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/ryans-organic-farm) |
| Shalvanstown Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/shalvanstown-organic-farm-co-meath) |
| Sonairte | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/sonairte) |
| Swainstown Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/swainstown-farm) |
| Baska Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/baska-bakery) |
| Kells Wholemeal | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/kells-wholemeal) |
| Ruby’s Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/rubys-bakery) |
| Sweet Planet | Dunshaughlin | Pan y cereal | shop=bakery | dunshaughlinbakery@gmail.com | OSM node/4746018807 |
| The Crusty Corner | Dunboyne | Pan y cereal | shop=bakery | +353 1 8015 763 | OSM node/12241548881 |
| Connolly Seafood | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/connolly-seafood-meath) |
| The Cider Mill | — | Sidra | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-cider-mill) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
