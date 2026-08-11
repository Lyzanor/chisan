# Louth — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/louth.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/louth>, plus each producer
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

## Held after verification — 6

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Callaghan's Butchers | Carne | The site answers a SiteGround bot challenge (HTTP 202 with an sgcaptcha redirect) on every automated route tried, including a second user-agent, both schemes and the www variant. A challenge is not a dead site: the lead is unresolved, not excluded, and needs a browser session. |
| Commins Butchers | Carne | The site answers a SiteGround bot challenge (HTTP 202 with an sgcaptcha redirect) on every automated route tried, including a second user-agent, both schemes and the www variant. A challenge is not a dead site: the lead is unresolved, not excluded, and needs a browser session. |
| Haynestown Meats | Carne | Haynestown Meats publishes only a trade counter at Toughers Business Park, Naas, Co. Kildare; the site does not place a productive unit in Louth. |
| King of Kefir | Lácteos y quesos | King of Kefir publishes no address. Its candidate municipio Clara sits on a source coordinate in Co. Offaly while its phone is a Drogheda number, so the location is unresolved. Its category is water kefir, a non-dairy drink, not Lácteos y quesos. |
| KooKee | Otros | KooKee publishes no address; its candidate municipio Dundalk is an inferred nearest settlement 1.3 km from the source coordinate. |
| The Home Bakery | Pan y cereal | Thehomebakery.ie answers a Cloudflare interstitial to a plain fetch. A challenge is not a dead site; the bakery needs a second route before it can be resolved. |

## Needs one more fact — 34

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Ashbrook Farms LTD | Knockbridge | Carne | — | — | — | DAFM meat 2786 |
| Carnivore Meats LTD | Dundalk | Carne | — | — | — | DAFM meat 3033 |
| Coyle Vac Pack LTD | Dundalk | Carne | — | — | — | DAFM meat 2334 |
| Firren Foods LTD | Ardee | Carne | — | — | — | DAFM meat 2309 |
| German Salami Co. (Dundalk) Ltd | Dundalk | Carne | — | — | — | DAFM meat 764 |
| Hanratty Butchers | Louth (nearest, 0.2 km) | Carne | — | (042) 937 2206 | 53.947778, -6.533721 | [FarmFinder](https://farmfinder.ie/producer/hanratty-butchers); via Associated Craft Butchers of Ireland |
| Hilton Foods (Irl) Ltd. | Drogheda | Carne | — | — | — | DAFM meat 409 |
| HSE Louth Meath Mental Health Services | St. Brigid's HospitalKells RoadArdee | Carne | — | — | — | FSAI HSE 4082 |
| McCormick's Butchers | Dundalk (nearest, 0.7 km) | Carne | — | (042) 933 2489 | 54.009123, -6.392483 | [FarmFinder](https://farmfinder.ie/producer/mccormick-s-butchers); via Associated Craft Butchers of Ireland |
| Morgan Meats (registered as Failte Foods LTD T/A Morgan Meats) | Omeath | Carne | — | — | — | DAFM meat 2818 |
| P & A Quinn LTD | Dundalk | Carne | — | — | — | DAFM meat 2308 |
| Rocksalt Catering Production Kitchen | Dundalk | Carne | — | — | — | DAFM meat 3045 |
| Tavanamore Meats | Dundalk | Carne | — | — | — | DAFM meat 2302 |
| Tony Kieran LTD | Dundalk | Carne | — | — | — | DAFM meat 2563 |
| Tuite's Butchers | Drogheda (nearest, 2.1 km) | Carne | — | (041) 983 1757 | 53.731773, -6.338016 | [FarmFinder](https://farmfinder.ie/producer/tuite-s-butchers); via Associated Craft Butchers of Ireland |
| Cooley Distillery | Lordship, County Louth (nearest, 2.8 km) | Destilados y licores | — | — | 53.9962284, -6.2215677 | OSM way/193196918 |
| Crilly's Sweets | Omeath (nearest, 8.5 km) | Dulces y repostería | — | — | 54.1499201, -6.3385496 | OSM node/11084286273 |
| Anaverna Vegetables, Herbs & Fruit | Drogheda (nearest, 0.2 km) | Fruta y verdura | — | 086 830 4263 · verelc@gmail.com | 53.7167841, -6.3502558 | [FarmFinder](https://farmfinder.ie/producer/anaverna-vegetables-herbs-fruit); via NeighbourFood |
| Feckin Clogher Milk Ltd | Garrigee House Almondstown Clogherhead | Lácteos y quesos | — | — | — | DAFM dairy IE2172 |
| Muchgrange Farm Ltd | Muchgrange Greenore Dundalk Co | Lácteos y quesos | — | — | — | DAFM dairy IE2162 |
| Muchgrange Milk | Greenore (nearest, 2.4 km) | Lácteos y quesos | — | — | 54.01229249233061, -6.140215921367341 | [FarmFinder](https://farmfinder.ie/producer/muchgrange-milk); via yourhonestybox.com |
| Seabank Dairies Ltd | Seabank House Dublin Road | Lácteos y quesos | — | — | — | DAFM dairy IE2161 |
| Drogheda Honey | Drogheda (nearest, 0.5 km) | Miel | — | (041) 987 0300 | 53.713789, -6.359233 | [FarmFinder](https://farmfinder.ie/producer/drogheda-honey); via Food Culture Ireland |
| Lannleire Honey | Tallanstown (nearest, 1.8 km) | Miel | — | lannleirehoney@gmail.com | 53.9062849, -6.5320502 | [FarmFinder](https://farmfinder.ie/producer/lannleire-honey); via NeighbourFood |
| Alo Sokraki Organicos | Tallanstown (nearest, 1.8 km) | Otros | — | hairtestie@gmail.com | 53.9062849, -6.5320502 | [FarmFinder](https://farmfinder.ie/producer/alo-sokraki-organicos); via NeighbourFood |
| Ballapousta Bakes | Ardee (nearest, 3.8 km) | Otros | — | — | 53.82126912533675, -6.548074906170457 | [FarmFinder](https://farmfinder.ie/producer/ballapousta-bakes); via yourhonestybox.com |
| Boyne Valley Group | Drogheda (nearest, 1.5 km) | Otros | — | (041) 987 0300 | 53.702219899999996, -6.360640399999999 | [FarmFinder](https://farmfinder.ie/producer/boyne-valley-group); via Organic Trust |
| Brownie delight | Tallanstown (nearest, 1.8 km) | Otros | — | +353894843199 · davidmcguinness31@gmail.com | 53.9062849, -6.5320502 | [FarmFinder](https://farmfinder.ie/producer/brownie-delight); via NeighbourFood |
| Ken Boyle | Louth (nearest, 0.4 km) | Otros | — | info@boylesirishpantry.ie | 53.9467319, -6.5330941 | [FarmFinder](https://farmfinder.ie/producer/ken-boyle); via NIHBS |
| Lordship | Lordship, County Louth (nearest, 0.2 km) | Otros | — | — | 53.99797658147533, -6.263879021378545 | [FarmFinder](https://farmfinder.ie/producer/lordship); via yourhonestybox.com |
| Loughanmore Farm | Lordship, County Louth (nearest, 1.2 km) | Otros | — | friederikeeimer1985@gmail.com | 53.9930158, -6.249922 | [FarmFinder](https://farmfinder.ie/producer/loughanmore-farm); via NeighbourFood |
| Rians Butt Nuggets | Ballymascanlan (nearest, 2.2 km) | Otros | — | — | 54.011840771298864, -6.345237628734616 | [FarmFinder](https://farmfinder.ie/producer/rians-butt-nuggets); via yourhonestybox.com |
| Trinity Green farm | Mollyrue (nearest, 4 km) | Otros | — | — | 53.82914572257736, -6.479326206164373 | [FarmFinder](https://farmfinder.ie/producer/trinity-green-farm); via yourhonestybox.com |
| Urban Indian | Tallanstown (nearest, 1.8 km) | Otros | — | urbanindifoods@gmail.com | 53.9062849, -6.5320502 | [FarmFinder](https://farmfinder.ie/producer/urban-indian); via NeighbourFood |

## Name and county only — 20

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Bradys Cider | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/bradys-cider) |
| Lilys Tea Shop | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | [FarmFinder](https://farmfinder.ie/producer/lilys-tea-shop) |
| Great Northern Distillery | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/great-northern-distillery) |
| Kinahans Irish Whiskey Limited | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/kinahans-irish-whiskey-limited) |
| Ballymakenny Farm | — | Otros | Farm; SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/ballymakenny-farm) |
| Caboose | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/caboose) |
| Fierce Mild | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/fierce-mild) |
| Forge Field Farm Shop | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/forge-field-farm-shop) |
| Hawthorn Wellness | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/hawthorn-wellness) |
| Hickeys Farm Shop | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/hickeys-farm-shop) |
| Spud Shack | — | Otros | Farm; Vegetables, Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/spud-shack) |
| Unglu-d | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/unglu-d) |
| Dunany Flour | — | Pan y cereal | Producer; Bread & Bakery; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/dunany-flour) |
| East Coast Bakehouse | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | [FarmFinder](https://farmfinder.ie/producer/east-coast-bakehouse) |
| Fine Feckin Foods | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/fine-feckin-foods) |
| Carlingford Oyster Company Ltd | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/carlingford-oyster-company-ltd) |
| Cooley Oysters Ltd | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/cooley-oysters-ltd) |
| Fishermans Catch | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/fishermans-catch-louth) |
| Morgans Fine Fish | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/morgans-fine-fish) |
| Dan Kelly's Cider | — | Sidra | listed | — | [FarmFinder](https://farmfinder.ie/producer/dan-kellys-cider) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
