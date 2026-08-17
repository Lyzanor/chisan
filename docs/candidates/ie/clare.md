# Clare — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/clare.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/clare>, plus each producer
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

## Held after verification — 2

Every lead that was ready to verify was fetched on 2026-08-11. The ones below did not resolve; the reason is recorded so the next pass starts from it rather than repeating the fetch.

| Lead | Category | Why it is still open |
|---|---|---|
| Kilshanny Cheese | Lácteos y quesos | The site carried for Kilshanny Cheese is st-tola.ie, a different Clare cheesemaker; Kilshanny Farmhouse Cheese needs its own current source. |
| Lahinch Seaweed | Fruta y verdura | The site carried for Lahinch Seaweed is wildatlanticseaweedbaths.com, a seaweed bathhouse at Doolin Pier; the URL must not be carried and the seaweed harvester needs its own source. |

## Needs one more fact — 28

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| C & M Foods | Tulla | Carne | — | — | — | DAFM meat 2325 |
| Champion Meats | Roslevan, Ennis (nearest, 1.5 km) | Carne | — | 065 6823906 | 52.855962, -8.982935 | [FarmFinder](https://farmfinder.ie/producer/champion-meats); via Irish Butchers Guild |
| Denver Morrissey Butchers | Shannon (nearest, 2.6 km) | Carne | — | 061 708184 | 52.690606, -8.867851 | [FarmFinder](https://farmfinder.ie/producer/denver-morrissey-butchers); via Irish Butchers Guild |
| EFG In-Flight Limited | Knockbeg PointShannon Airport | Carne | — | — | — | FSAI HSE 4038 |
| Fitzgibbon's of Kildysart | Newmarket-on-Fergus (nearest, 3.6 km) | Carne | — | (065) 683 2508 | 52.769037, -8.945285 | [FarmFinder](https://farmfinder.ie/producer/fitzgibbon-s-of-kildysart); via Associated Craft Butchers of Ireland |
| Francis Frawley Butchers | Roslevan, Ennis (nearest, 1.3 km) | Carne | — | (065) 682 0876 | 52.852651, -8.979491 | [FarmFinder](https://farmfinder.ie/producer/francis-frawley-butchers); via Associated Craft Butchers of Ireland |
| Gourmet Game LTD | Scariff | Carne | — | — | — | DAFM meat 2838 |
| Hickie's Victualler | Killone Abbey (nearest, 2.5 km) | Carne | — | (065) 905 6027 | 52.785048, -8.991038 | [FarmFinder](https://farmfinder.ie/producer/hickie-s-victualler); via Associated Craft Butchers of Ireland |
| Joey Kavanagh Craft Butchers | Bodyke (nearest, 4.7 km) | Carne | — | (061) 921 698 | 52.853818, -8.54844 | [FarmFinder](https://farmfinder.ie/producer/joey-kavanagh-craft-butchers); via Associated Craft Butchers of Ireland |
| Kelly's Meat Store Kilrush | Kilrush (nearest, 0.8 km) | Carne | — | (065) 905 2818 | 52.633353, -9.481232 | [FarmFinder](https://farmfinder.ie/producer/kelly-s-meat-store-kilrush); via Associated Craft Butchers of Ireland |
| Kellys Meat Store | Kilrush (nearest, 0.1 km) | Carne ? | — | (065) 905 2818 | 52.6392834, -9.4849876 | [FarmFinder](https://farmfinder.ie/producer/kellys-meat-store); via SuperValu Food Academy |
| Meeres Pork Products | Quin | Carne | — | — | — | DAFM meat 2324 |
| Summerhill Meats LTD (registered as Edward Joyce T/A Summerhill Meats LTD) | Meelick | Carne | — | — | — | DAFM meat 2536 |
| The Burren Butcher | Roslevan, Ennis (nearest, 1.6 km) | Carne ? | — | +3536173206 · burrenbutcher@gmail.com | 52.8572575, -8.9374359 | [FarmFinder](https://farmfinder.ie/producer/the-burren-butcher); via NeighbourFood |
| The Veg Box | Na Forbacha (nearest, 1.1 km) | Fruta y verdura | — | — | 53.15051015347416, -9.103243674284803 | [FarmFinder](https://farmfinder.ie/producer/the-veg-box); via yourhonestybox.com |
| Linnalla Pure Ice cream | Linnalla ice cream New | Helados | — | — | — | DAFM dairy IE1932 |
| ABC Nutrition Ltd | Cratloemoyle Co Clare V95 | Lácteos y quesos | — | — | — | DAFM dairy IE2209 |
| ABC Nutritionals Ltd (registered as ABC Nutrition Ltd) | Unit 7A, Knockbeg Point | Lácteos y quesos | — | — | — | DAFM dairy IE2144 |
| Aillwee Cave Co Ltd | Aillwee Cave Co ltd | Lácteos y quesos | — | — | — | DAFM dairy IE1833 |
| Bainne Bó (registered as Pure Pastures Dairy Ltd) | Moughna, Miltown Malbay, Co. | Lácteos y quesos | — | — | — | DAFM dairy IE2184 |
| Cratloe Hills Sheep's Cheese (registered as Sean Fitzgerald) | Brickhill Cratloe Co Clare | Lácteos y quesos | — | — | — | DAFM dairy IE1820 |
| Inagh Farmhouse Cheese Ltd | Inagh Farmhouse Cheese, Ennistymon, | Lácteos y quesos | — | — | — | DAFM dairy IE1822 |
| Wild Honey Inn | Lisdoonvarna (nearest, 0.5 km) | Miel | — | — | 53.028661199999995, -9.2959186 | [FarmFinder](https://farmfinder.ie/producer/wild-honey-inn); via SuperValu Food Academy |
| Bodyke | Scarriff (nearest, 3 km) | Otros | — | — | 52.93536749828212, -8.514781298659816 | [FarmFinder](https://farmfinder.ie/producer/bodyke); via yourhonestybox.com |
| Burren view farm | Crusheen (nearest, 2.4 km) | Otros | — | — | 52.92147420966053, -8.917070337531744 | [FarmFinder](https://farmfinder.ie/producer/burren-view-farm); via yourhonestybox.com |
| Buzzing Meadows Farm | Roslevan, Ennis (nearest, 1.6 km) | Otros | — | 0871684952 | 52.8572575, -8.9374359 | [FarmFinder](https://farmfinder.ie/producer/buzzing-meadows-farm); via Food Culture Ireland |
| The Churros Factory | Roslevan, Ennis (nearest, 1.6 km) | Otros | — | thechurrosfactoryireland@gmail.com | 52.8572575, -8.9374359 | [FarmFinder](https://farmfinder.ie/producer/the-churros-factory); via NeighbourFood |
| Machrihanish Smokehouse | Lisdoonvarna (nearest, 0.3 km) | Pescado | — | — | 53.0280128, -9.2921637 | [FarmFinder](https://farmfinder.ie/producer/machrihanish-smokehouse); via SuperValu Food Academy |

## Name and county only — 18

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Burren Premium Beef | — | Carne | Farm; Beef, Lamb, Pork, Poultry; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/burren-premium-beef) |
| Burren Smokehouse | — | Carne | Producer; IOA Member, Organic, Beef, Lamb; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/burren-smokehouse) |
| Donnie O'Keefe | Roslevan, Ennis (nearest, 2.3 km) | Carne | shop=butcher | +353 65 682 3906 | OSM node/11878666373 |
| Lunasa Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry; via Irish Meat Producers Directory | — | [FarmFinder](https://farmfinder.ie/producer/lunasa-farm) |
| Bunratty Mead and Liqueur Company | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/bunratty-mead-and-liqueur-company) |
| Sitalane Honey | — | Miel | listed | — | [FarmFinder](https://farmfinder.ie/producer/sitalane-honey); via yourhonestybox.com |
| Ardboula Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/ardboula-farm) |
| Moy Hill Farm | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | [FarmFinder](https://farmfinder.ie/producer/moy-hill-farm) |
| Noel Clancy | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/noel-clancy) |
| Rene Cusack | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/rene-cusack-clare) |
| Wild Irish Seaweeds | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/wild-irish-seaweeds) |
| Andy's Bakery | Roslevan, Ennis (nearest, 2.1 km) | Pan y cereal | shop=bakery | +353 89 403 9088 · andys.bakery.ennis@gmail.com | OSM node/11891435611 |
| Fairy Dust Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/fairy-dust-bakery) |
| Hazelwood Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/hazelwood-bakery) |
| Hugo's Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/hugo-s-bakery) |
| Naturally Wild Sourdough | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/naturally-wild-sourdough) |
| CS Fish Ltd. | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/cs-fish-ltd-clare) |


## Craft beer sweep (2026-08-13)

Sectorial discovery sweep for independent craft breweries and microbreweries in Co. Clare.

| Candidate | Municipio | Category | Website | Instagram | Notes / Facility |
|---|---|---|---|---|---|

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
