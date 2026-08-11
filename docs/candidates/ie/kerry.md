# Kerry — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/kerry.csv`. Nothing recorded here is verified or
approved for publication. Resolve each lead under the normal CSV and evidence
workflow and prune it from this file.

## Official register and OpenStreetMap sweep (2026-08-11)

Sources, all read 2026-08-11:

- DAFM register of approved and registered meat establishments —
  `AllApprovedPlants_2026.xlsx` and `AllApprovedPlants_2026_Formerly_LA_Plants.xlsx`
  from <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
  Publishes approval number, name, town, county and which activities are approved.
- DAFM register of milk and dairy establishments, published 17 July 2026, from the
  same page. Publishes legal name, trading name, address, species and the
  establishment's own size class.
- FSAI list of HSE-approved establishments —
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>. Publishes approval
  number, trading name, address, county, business type and activity.
- OpenStreetMap food-production and food-shop tags via Overpass.
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/kerry>.
- Midlands Food & Drink Directory —
  <https://www.midlandsireland.ie/food-and-drink-directory/> (its
  `producers_directory` REST collection). Covers only Laois, Longford, Offaly
  and Westmeath.

What these establish, and what they do not: an approval proves that the named
establishment is registered for that activity at that address as of the published
date. It does not prove a current own-brand offer, a public contact, remote
ordering, or that the unit sells to the public at all — a great many exist to
process for other businesses, and the register lists industrial plants beside
farmhouse ones. An OSM tag proves only what a mapper recorded, and its county
here is the tag's own where present and inferred from position otherwise. The
Midlands directory is self-submitted by the businesses in it, so it shows how a
producer presents itself, not an audited fact, and it publishes no contact
details. FarmFinder is an aggregator that republishes other directories and cites
them per entry, so it is broad but second-hand and can carry stale or
auto-generated rows. Every lead below is a `hold`: confirm identity, qualifying
activity, productive municipality and a current contact on the producer's own
source before admission.

Category shown is the tag or register activity mapped onto the shared registry;
it is a starting guess, not a decision.

### Production signal — 102 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Ard Beginish Production Kitchen | RenardCahirciveen | Carne | Manufacturer; Products (not ready to eat) | — | FSAI HSE 4100 |
| CA Meats LTD | Annascaul | Carne | Minced Meat | — | DAFM meat 2940 |
| Con's Restaurant | DireencallaughDaurosKenmare | Carne | Manufacturer; Products (not ready to eat) | — | FSAI HSE 4098 |
| Country Pork Killarney | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/country-pork-killarney |
| Country Stores Castlegregory | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/country-stores-castlegregory |
| Derrynane Smokehouse | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/derrynane-smokehouse |
| Eddie Wadding Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/eddie-wadding-butchers |
| Garveys Gourmet Kitchen | Unit 5 Monavalley Industrial EstateMonav | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4101 |
| Gortamullen Bakery Ltd. | Unit 3 | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (ready to eat) | — | FSAI HSE 4042 |
| John Browne's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/john-browne-s-butchers |
| John Griffin Butchers LTD | Listowel | Carne | Minced Meat, Meat Preparations; also FarmFinder https://farmfinder.ie/producer/john-griffin-butchers | — | DAFM meat 2889 |
| Kerry Food Market Limited | Unit 9 | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4103 |
| Kieran Burns | Sneem | Carne | Meat Products Non RTE | — | DAFM meat 2505 |
| Killarney Meat Company LTD | Killarney | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2841 |
| Millers (registered as Iveragh Meats Ltd T/A Millers) | Killarney | Carne | Minced Meat | — | DAFM meat 2858 |
| On the Wild Side (registered as Oliver Beaujouan T/A On the Wild Side) | Castlegregory | Carne | Meat Preparations, Meat Products RTE | — | DAFM meat 2797 |
| Piog Pies (registered as Brid Ni Mhathuna T/A Piog Pies) | Tralee | Carne | Meat Products Non RTE | — | DAFM meat 2795 |
| Pork Lane Bistro | — | Carne | listed | — | FarmFinder https://farmfinder.ie/producer/pork-lane-bistro |
| Prestige Foods Ltd | Listowel | Carne | Meat Products Non RTE | — | DAFM meat 157 |
| Putog Teoranta | Kenmare | Carne | Meat Preparations | — | DAFM meat 3051 |
| Seamus O'Sullivan Master Butchers | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/seamus-o-sullivan-master-butchers |
| Skellig Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/skellig-meats |
| Sneem Black Pudding | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/sneem-black-pudding |
| Sneem Meats Ltd | Sneem | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2758 |
| T Cronin & Sons | Killarney | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2816 |
| Thomas Ashe | Annascaul | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2523 |
| Dick Mac’s Brewery | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/dick-macs-brewery |
| Killarney Brewing Co. | — | Cerveza | listed; also OSM way/1039046039 | — | FarmFinder https://farmfinder.ie/producer/killarney-brewing-co |
| McGills Brewery | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/mcgills-brewery |
| Portmagee Distilling and Brewing Company Ltd. | — | Cerveza | listed; also OSM node/12974270187 | www.portmageewhiskey.com · +353 87 701 5479 · info@portmageewhiskey.com | FarmFinder https://farmfinder.ie/producer/portmagee-distilling-and-brewing-company-ltd |
| Skellig Six18 Distillery | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/skellig-six18-distillery |
| Tom Crean Brewery | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/tom-crean-brewery |
| Torc Brewing Co. | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/torc-brewing-co |
| Teeling Whiskey Company | — | Destilados y licores | craft=distillery | teelingwhiskey.com · +353 1 531 0888 · hello@teelingwhiskey.com | OSM way/228705547 |
| Kenmare Ice Cream (registered as MarMc Ltd) | 4 Henry St Kenmare | Helados | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1952 |
| McCarthys Ice Cream (registered as Joanna McCarthy) | 3 Main St. Ballybunion, | Helados | Bovine, SMALL - MEDIUM | — | DAFM dairy 1921 |
| Murphy's Ice Cream (registered as Milseoga Ui Mhurchu Idirnaisiunta Teo) | Baile Na Buaile Unit | Helados | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1012 |
| Sliabh Mish eggs | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/sliabh-mish-eggs |
| Bainne Blasta Ltd | Upper Muckenagh Lixnaw Listowel | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2213 |
| Beal Organic Cheese Ltd | Beal Lodge Asdee Co | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1812 |
| Daly Transport Ltd | Dooneen Castleisland Co Kerry | Lácteos y quesos | milk, COLD STORE | — | DAFM dairy IE2226 |
| Derreenaclaurig Cheese (registered as Harry Van Der Zanden) | Derreenaclaurig Sneem Co Kerry | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1876 |
| Dingle Farm (registered as Dingle Farmhouse Products Ltd) | Baile Ghainín Beag Ballydavid | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1888 |
| Dingle Goats Cheese (registered as Angela O'Hanlon) | Lack Inch Co Kerry | Lácteos y quesos | Caprine, SMALL - MEDIUM | — | DAFM dairy IE2137 |
| Dingle Peninsula Cheese | — | Lácteos y quesos | Producer; Dairy, Eggs, Cheese, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/dingle-peninsula-cheese |
| Glen View Farm (registered as Jenny Keane) | Tubbertoureen Moyvane Co. Kerry | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2214 |
| Kells Bay Cheese (registered as Kerry Cow Farm Ltd) | Tobarnora Kells Bay Cahirciveen | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2010 |
| Kerry Agribusiness Ltd (registered as Kerry Creameries Ltd) | Kerry Group Corporate Head | Lácteos y quesos | Bovine, MILK PURCHASER (NON PROCESSING) | — | DAFM dairy IE1511 |
| Kerry Kefir Ltd. | Tralee Rd Castleisland Co | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2150 |
| Lee Strand Co-Operative Creamery ltd | Ballymullen Tralee Co Kerry | Lácteos y quesos | Bovine, DRINKING MILK PLANT | — | DAFM dairy IE1066 |
| Muckross Creamery (registered as John and Catherine Fleming) | Scartlea Muckross Killarney Co | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2142 |
| Once Upon a Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/once-upon-a-cheese |
| Sean Coles O'Sullivan | Ardea West Tuoist Kenmare | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2207 |
| the Little Cheese Company | — | Lácteos y quesos | listed; also OSM node/2799130455 | thelittlecheeseshop.ie · dinglecheeseshop@gmail.com | FarmFinder https://farmfinder.ie/producer/the-little-cheese-company |
| Valentia Island Farmhouse Dairy Ltd | Kilbeg Valentia Island Co | Lácteos y quesos | Caprine, SMALL - MEDIUM | — | DAFM dairy IE1929 |
| Wilma Silvius O'Connor | Ardmoniel Killorglin Co Kerry, | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1844 |
| Derrynane Honey Farm | — | Miel | Farm; Preserves, Honey, Farm Gate; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/derrynane-honey-farm |
| All Real Nutrition | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/all-real-nutrition |
| Ardfert Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ardfert-farm |
| Ballyhar Farm Produce | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ballyhar-farm-produce |
| Beoir Chorca Duibhne | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/beoir-chorca-duibhne |
| BioAtlantis Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bioatlantis-ltd |
| Blasta Delights | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/blasta-delights |
| Bricín | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bric-n |
| Celtic Donuts | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/celtic-donuts |
| Dingle Pie Company | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/dingle-pie-company |
| Dingle Sea Salt | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dingle-sea-salt |
| Dingle Sushi | — | Otros | Producer; Preserves, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/dingle-sushi |
| Folláin | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/foll-in |
| Gairdín Beag | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gaird-n-beag |
| Gortbrack Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gortbrack-organic-farm |
| Groyne | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/groyne |
| Inch House | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/inch-house |
| Jeremiah OâDonnell | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/jeremiah-o-donnell |
| Leagh Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/leagh-farm |
| Lee Strand Cooperative Creamery Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lee-strand-cooperative-creamery-ltd |
| Lion.L Raw Kitchen | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lion-l-raw-kitchen |
| Lorge Chocolatier | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lorge-chocolatier |
| Manna Organic Store | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/manna-organic-store |
| Micilín Muc | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/micil-n-muc |
| OrganiGo | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/organigo |
| Poppa Dom's Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/poppa-dom-s-farm |
| Skellig Distillers Limited | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/skellig-distillers-limited |
| Spa Seafoods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/spa-seafoods |
| Terry's Butchers Tralee | — | Otros | listed; also FarmFinder https://farmfinder.ie/producer/tralee | — | FarmFinder https://farmfinder.ie/producer/terry-s-butchers-tralee |
| The Cultured Couple | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-cultured-couple |
| Thomas Kavanagh | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/thomas-kavanagh |
| West of Dingle | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/west-of-dingle |
| Yesca's Flowers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/yesca-s-flowers |
| Bácús Bhréanainn | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/b-c-s-bhr-anainn |
| Emilie's Ireland | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/emilie-s-ireland |
| Jacks Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/jacks-bakery |
| Puccini's Coffee & More | Kenmare | Pan y cereal | craft=bakery | — | OSM node/11076152462 |
| Real Bread Killarney | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/real-bread-killarney |
| Wild Sage Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/wild-sage-bakery |
| Fishery Smokehouse Ltd | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/fishery-smokehouse-ltd |
| Patrick Cronin Organic Shellfish Ltd | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/patrick-cronin-organic-shellfish-ltd |
| Quinlan's Kerry Fish | — | Pescado | listed; also FarmFinder https://farmfinder.ie/producer/quinlans-kerry | — | FarmFinder https://farmfinder.ie/producer/quinlans-kerry-fish |
| Shamrock Shellfish | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/shamrock-shellfish |
| Smoked Salmon Direct | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/smoked-salmon-direct |
| Spillane Seafood | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/spillane-seafood-kerry |
| The Village Fish Shop | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/the-village-fish-shop-kerry |

### Facility or shopfront only — 49 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Billy Kissane | Listowel | Carne | Cutting only | — | DAFM meat 2736 |
| Burke's Butchers | Killorglin | Carne | shop=butcher | burkesbutchers.com · +353 66 976 2689 | OSM node/13967956502 |
| Cahillanes | Killorglin | Carne | shop=butcher | — | OSM node/13967956509 |
| Darren & Dave's Fish and Poultry | — | Carne | shop=butcher | — | OSM node/12176894243 |
| Denis Hickey Quality Meats | Barraduff | Carne | shop=butcher | — | OSM node/10581520108 |
| Diarmiud's Family Butcher | — | Carne | shop=butcher | +353 66 714 2634 · diarmuid-reidy@hotmail.com | OSM node/1423985043 |
| J.J. Walshes | — | Carne | shop=butcher | — | OSM node/278733886 |
| Jerome Cahill | Killorglin | Carne | Cutting only | — | DAFM meat 2996 |
| John Burke | Castlemaine | Carne | Slaughtering, Cutting only | — | DAFM meat 2506 |
| John McDonnell | Ballyheigue | Carne | Slaughtering only | — | DAFM meat 3019 |
| John West & Sons LTD | Tralee | Carne | Cutting only | — | DAFM meat 2527 |
| Kennelly Quality Meats | Ballybunnion | Carne | Cutting only; also OSM node/7946273985 | — | DAFM meat 2526 |
| M Burke | — | Carne | shop=butcher | — | OSM node/13340637721 |
| Maguire’s Butchers | Tralee | Carne | shop=butcher | +353 66 711 9740 | OSM way/605862012 |
| Matt the Butcher | Tralee | Carne | shop=butcher | +353 66 712 9790 | OSM node/13019580380 |
| Miller's Meats | — | Carne | shop=butcher | — | OSM node/12188612533 |
| Peter O'Sullivan | — | Carne | shop=butcher | +353 87 6577239 | OSM node/6600952780 |
| Roger O'Sullivan | Kenmare | Carne | Slaughtering only | — | DAFM meat 2591 |
| Scariff Meats | — | Carne | shop=butcher | — | OSM node/2165112598 |
| Scarrif Meats (registered as Michael O'Shea T/A Scarrif Meats) | Waterville | Carne | Slaughtering only | — | DAFM meat 2901 |
| Smyth's Butchers | — | Carne | shop=butcher | — | OSM node/6240781732 |
| Stack's | — | Carne | shop=butcher | — | OSM node/13392648145 |
| Tim Jones Butchers | — | Carne | shop=butcher | — | OSM node/13171723136 |
| Waddings Butchers | — | Carne | shop=butcher | — | OSM node/13818406853 |
| Lorge Chocolatiere | — | Chocolate | shop=chocolate | — | OSM node/2583527710 |
| Olde Sweet Shop | — | Dulces y repostería | shop=confectionery | — | OSM way/293789090 |
| Olde Sweet Shoppe | — | Dulces y repostería | shop=confectionery | — | OSM node/6327913502 |
| Right Buy Martin's | — | Dulces y repostería | shop=confectionery | +353 66 714 2274 | OSM node/12710056601 |
| Skelligs Chocolate Factory | Ballinskelligs | Dulces y repostería | shop=confectionery | www.skelligschocolate.com · +353 66 947 9119 | OSM node/1545081812 |
| Teach Milseáin - House of Sweets | Kenmare | Dulces y repostería | shop=confectionery | — | OSM node/5670413137 |
| The Cheese Shop | Tralee | Lácteos y quesos | shop=cheese | +353 87 625 5788 | OSM way/979393947 |
| Gossip | — | Otros | shop=deli | +353 64 6645106 | OSM node/1830721523 |
| Heidi Ryan's Wholesome Food | Kenmare | Otros | shop=deli | — | OSM node/13956236275 |
| Kingdom Food and Wine Store | Tralee | Otros | shop=deli | — | OSM way/1408397188 |
| Bakeology | — | Pan y cereal | shop=bakery | — | OSM node/1412421802 |
| Catherine's Bakery | — | Pan y cereal | shop=bakery | catherinescafeandbakery.com | OSM node/13739763829 |
| Christy's Homebakery | Tralee | Pan y cereal | shop=bakery | — | OSM node/13019390986 |
| Courtney's Bakery | — | Pan y cereal | shop=bakery | — | OSM node/1400852947 |
| Eileen's Bakery, Deli & Coffee Shop | — | Pan y cereal | shop=bakery | +353 66 714 3417 | OSM node/12714081201 |
| Gabi's Bakery and Coffee House | Killorglin | Pan y cereal | shop=bakery | +353 87 002 9242 | OSM node/5609411522 |
| K&T Bakery | — | Pan y cereal | shop=bakery | — | OSM node/13911755062 |
| Kelly's | — | Pan y cereal | shop=bakery | — | OSM node/1830721526 |
| Lovin' Catering | — | Pan y cereal | shop=bakery | lovincatering.com · +353 1 454 4912 · lovincatering@gmail.com | OSM node/1403258746 |
| Moloney's Cake Shop | Castleisland | Pan y cereal | shop=bakery | +353 66 714 1636 · moloneyscakeshop102@hotmail.com | OSM node/1423985010 |
| O'Mahony's Bakery | Tralee | Pan y cereal | shop=bakery | — | OSM node/12921753279 |
| Petit Delice | — | Pan y cereal | shop=bakery | — | OSM node/13907719976 |
| West Cove Bakery | — | Pan y cereal | shop=bakery | — | OSM node/1391385286 |
| Quinlan's Fish Shop | — | Pescado | shop=seafood | — | OSM node/13171723135 |
| Star Seafood Fish Shop | — | Pescado | shop=seafood | — | OSM node/14081176701 |
## Irish craft beer directory sweep (2026-08-11)

Source: <https://irishcraftbeer.ie/breweries/>, read 2026-08-11. The directory
publishes a brewery name, a county, sometimes a town, and a URL, and flags some
entries as closed. It establishes none of those as current, does not give the
productive town for most entries, and its county attribution is unreliable — it
lists Big Hand Brewery under Dublin behind a Welsh domain. Every entry below is
therefore a `hold` lead: confirm identity, qualifying activity, productive
municipality, a public contact and the remote-order status on the producer's own
current source before admission.

| Lead | Location as listed | Listed domain |
|---|---|---|
| Dick Mack's Brewhouse | — | dickmackspub.com |
| Dingle Brewing Company | — | — |
| Killarney Brewing Company | — | killarneybrewing.com |
| McGill's Brewery | — | mcgillsbrewery.com |
| Tom Crean Brewery Kenmare | — | tomcreanbrewerykenmare.ie |
| Torc Brewing | — | torcbrewing.ie |
| West Kerry Brewery | Reask, Dingle Peninsula | westkerrybrewery.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
