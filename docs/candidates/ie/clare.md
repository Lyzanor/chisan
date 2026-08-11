# Clare — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/clare.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/clare>.
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

### Production signal — 60 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| B.Molloy Master Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/11893639455 | — | FarmFinder https://farmfinder.ie/producer/b-molloy-master-butchers |
| Burren Premium Beef | — | Carne | Farm; Beef, Lamb, Pork, Poultry; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/burren-premium-beef |
| Burren Smokehouse | — | Carne | Producer; IOA Member, Organic, Beef, Lamb; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/burren-smokehouse |
| C & M Foods | Tulla | Carne | Meat Products Non RTE | — | DAFM meat 2325 |
| Champion Meats | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/champion-meats |
| Denver Morrissey Butchers | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/denver-morrissey-butchers |
| EFG In-Flight Limited | Knockbeg PointShannon Airport | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (ready to eat) | — | FSAI HSE 4038 |
| Fitzgibbon's of Kildysart | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/fitzgibbon-s-of-kildysart |
| Francis Frawley Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/francis-frawley-butchers |
| Gourmet Game LTD | Scariff | Carne | Meat Preparations | — | DAFM meat 2838 |
| Hickie's Victualler | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/hickie-s-victualler |
| Joey Kavanagh Craft Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also FarmFinder https://farmfinder.ie/producer/kavanagh-s-craft-butchers | — | FarmFinder https://farmfinder.ie/producer/joey-kavanagh-craft-butchers |
| Kelly's Meat Store Kilrush | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/5026696023 | — | FarmFinder https://farmfinder.ie/producer/kelly-s-meat-store-kilrush |
| Lunasa Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry; via Irish Meat Producers Directory | — | FarmFinder https://farmfinder.ie/producer/lunasa-farm |
| Meeres Pork Products | Quin | Carne | Meat Preparations; also FarmFinder https://farmfinder.ie/producer/meeres | — | DAFM meat 2324 |
| Summerhill Meats LTD (registered as Edward Joyce T/A Summerhill Meats LTD) | Meelick | Carne | Minced Meat | — | DAFM meat 2536 |
| Dooliner Beer | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/dooliner-beer |
| The Clare Jam Company Ltd | — | Conservas | listed; also OSM way/489660590 | — | FarmFinder https://farmfinder.ie/producer/the-clare-jam-company-ltd |
| Bunratty Mead and Liqueur Company | — | Destilados y licores | listed | — | FarmFinder https://farmfinder.ie/producer/bunratty-mead-and-liqueur-company |
| Lahinch Seaweed | — | Fruta y verdura | Producer; Fruit, Vegetables, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/lahinch-seaweed |
| Moyhill Community Farm | — | Fruta y verdura | listed; Organic, Fruit, Vegetables, Delivery; via Curated B2C Directory; also FarmFinder https://farmfinder.ie/producer/moyhill-farm | — | FarmFinder https://farmfinder.ie/producer/moyhill-community-farm |
| The Veg Box | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/the-veg-box |
| Linnalla Pure Ice cream | Linnalla ice cream New | Helados | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1932 |
| ABC Nutrition Ltd | Cratloemoyle Co Clare V95 | Lácteos y quesos | n/a, Medium | — | DAFM dairy IE2209 |
| ABC Nutritionals Ltd (registered as ABC Nutrition Ltd) | Unit 7A, Knockbeg Point | Lácteos y quesos | Bovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/abc-nutritionals | — | DAFM dairy IE2144 |
| Aillwee Burren Gold Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/aillwee-burren-gold-cheese |
| Aillwee Cave Co Ltd | Aillwee Cave Co ltd | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1833 |
| Bainne Bó (registered as Pure Pastures Dairy Ltd) | Moughna, Miltown Malbay, Co. | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2184 |
| Cratloe Hills Sheep's Cheese (registered as Sean Fitzgerald) | Brickhill Cratloe Co Clare | Lácteos y quesos | Ovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/cratloe-hills-cheese | — | DAFM dairy IE1820 |
| Inagh Farmhouse Cheese Ltd | Inagh Farmhouse Cheese, Ennistymon, | Lácteos y quesos | Caprine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/inagh-farmhouse-cheese; also FarmFinder https://farmfinder.ie/producer/inagh-farmhouse-cheese-st-tola | — | DAFM dairy IE1822 |
| Kilshanny Cheese | — | Lácteos y quesos | Producer; Dairy, Eggs, Cheese, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/kilshanny-cheese |
| Milk Vending Machine (Clare) | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/milk-vending-machine-clare |
| St Tola Irish Goat Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/st-tola-irish-goat-cheese |
| Sitalane Honey | — | Miel | listed | — | FarmFinder https://farmfinder.ie/producer/sitalane-honey |
| Wild Honey Inn | — | Miel | listed | — | FarmFinder https://farmfinder.ie/producer/wild-honey-inn |
| Ardboula Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ardboula-farm |
| Banner Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/banner-beekeepers-association |
| Bodyke | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bodyke |
| Burren view farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/burren-view-farm |
| Buzzing Meadows Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/buzzing-meadows-farm |
| Dromoland Castle | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/dromoland-castle |
| Hurst Botanicals | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/hurst-botanicals |
| Irish Seed Savers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/irish-seed-savers |
| Kellys Meat Store | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kellys-meat-store |
| Moy Hill Farm | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/moy-hill-farm |
| Noel Clancy | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/noel-clancy |
| Rene Cusack | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rene-cusack-clare |
| Ryan's Butchers & Deli | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ryan-s-butchers-and-deli |
| Saint Tola | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/saint-tola |
| Savage Craic | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/savage-craic |
| Siar Photography | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/siar-photography |
| The Burren Butcher | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-burren-butcher |
| The Churros Factory | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-churros-factory |
| Wild Irish Seaweeds | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wild-irish-seaweeds |
| Fairy Dust Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/fairy-dust-bakery |
| Hazelwood Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/hazelwood-bakery |
| Hugo's Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/hugo-s-bakery |
| Naturally Wild Sourdough | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/naturally-wild-sourdough |
| CS Fish Ltd. | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/cs-fish-ltd-clare |
| Machrihanish Smokehouse | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/machrihanish-smokehouse |

### Facility or shopfront only — 37 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| ASBA Meats Ltd | Ennis | Carne | Slaughtering only | — | DAFM meat 600 |
| Devane's Butchers | — | Carne | shop=butcher | — | OSM node/10291350827 |
| Donnie O'Keefe | — | Carne | shop=butcher | +353 65 682 3906 | OSM node/11878666373 |
| Eric's Quality Meats | — | Carne | shop=butcher | — | OSM node/488567244 |
| Frank Crawley Butchers | — | Carne | shop=butcher | — | OSM node/11883512197 |
| Gaughan Butchers | — | Carne | shop=butcher | — | OSM node/938675497 |
| Haugh's Butchers | — | Carne | shop=butcher | — | OSM node/12351245841 |
| James & Joseph Kelly | Ennis | Carne | Slaughtering only | — | DAFM meat 2416 |
| James Quinn Quality Meats | — | Carne | shop=butcher | — | OSM node/7865046340 |
| Joey Kavanagh Family Butcher | — | Carne | shop=butcher | — | OSM node/488567254 |
| Keane's Butcher | — | Carne | shop=butcher | — | OSM node/667993003 |
| Keane's Butchers | — | Carne | shop=butcher | — | OSM node/11898357437 |
| Kelly's | — | Carne | shop=butcher | — | OSM node/11891386142 |
| Liam O' Meara Butchers | — | Carne | shop=butcher | — | OSM node/4764960288 |
| Michael Hynes Butchers | — | Carne | shop=butcher | — | OSM way/1374212656 |
| Neil Hawes | — | Carne | shop=butcher | — | OSM relation/7181230 |
| O'Brien's Family Butchers | — | Carne | shop=butcher | — | OSM node/2985046880 |
| Sean Hughes | Kilkee | Carne | Slaughtering only | — | DAFM meat 2567 |
| Hazel Mountain Chocolate Factory & Shop | — | Chocolate | shop=chocolate | — | OSM way/561992467 |
| Mr. Simm's Sweet Shop | — | Dulces y repostería | shop=confectionery | — | OSM node/9625168875 |
| O'Connor's Bakery | — | Dulces y repostería | shop=confectionery | — | OSM node/9625147880 |
| SOS | — | Dulces y repostería | shop=confectionery | — | OSM node/14078523557 |
| Sweet Dreams | — | Dulces y repostería | shop=confectionery | sweetdreams.ie · sweetdreamspartyshop@gmail.com | OSM node/11891386143 |
| Tierneys | — | Dulces y repostería | shop=confectionery | — | OSM node/11893639447 |
| Keating's | — | Otros | shop=deli | — | OSM node/1829863615 |
| Mac’s Place Deli | — | Otros | shop=deli | — | OSM node/13703130097 |
| The Cheese Press | Ennistymon | Otros | shop=deli | +353 65 707 1393 | OSM node/13329941231 |
| Andy's Bakery | — | Pan y cereal | shop=bakery | +353 89 403 9088 · andys.bakery.ennis@gmail.com | OSM node/11891435611 |
| Considine's Bakery | — | Pan y cereal | shop=bakery | — | OSM node/11423244297 |
| Hugo's | — | Pan y cereal | shop=bakery | — | OSM node/12350931891 |
| Nini's Georgian Bakery | — | Pan y cereal | shop=bakery | — | OSM node/11898335825 |
| Nolan's Bakery | — | Pan y cereal | shop=bakery | — | OSM node/1801581027 |
| O'Connors | — | Pan y cereal | shop=bakery; also OSM node/11886316222 | oconnorsbakery.com | OSM node/11883512198 |
| Oh La La | — | Pan y cereal | shop=bakery | — | OSM node/11284543688 |
| Oly's Bakery | — | Pan y cereal | shop=bakery | — | OSM node/9962482104 |
| Sourdo'farrell | Ennis | Pan y cereal | shop=bakery | — | OSM node/9346381005 |
| Unglert's Bakery | — | Pan y cereal | shop=bakery | — | OSM relation/7248490 |
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
| Burren Brewery | — | burrenexperiences.ie/burren-brewery |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
