# Mayo — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/mayo.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/mayo>.
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

### Production signal — 56 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Achill Mountain Lamb | — | Carne | Farm; Beef, Lamb, Pork, Poultry; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/achill-mountain-lamb |
| Andarl Farm Ltd | Castlebar | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2950 |
| Calvey's on-Farm Abattoir Butchers | — | Carne | Farm; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/calvey-s-on-farm-abattoir-butchers |
| Carolan's Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/carolan-s-meats |
| Clive's Butcher Shop | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/clive-s-butcher-shop |
| Dunleavy Meats Ltd. | Ballina | Carne | Slaughtering, Cutting only; also FarmFinder https://farmfinder.ie/producer/dunleavy-meats-limited | — | DAFM meat 407 |
| Gerry Joyce Meats | Castlebar | Carne | Meat Products Non RTE | — | DAFM meat 2402 |
| Keane's Meats Newport | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/keane-s-meats-newport |
| Kelly's of Newport (Artisan Butchers) LTD | Newport | Carne | Meat Preparations, Meat Products RTE, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/kelly-s-of-newport-artisan-butchers | — | DAFM meat 2405 |
| Martin Jennings Wholesale Ltd | Ballinrobe | Carne | Slaughtering, Cutting only; also FarmFinder https://farmfinder.ie/producer/martin-jennings-wholesale-limited | — | DAFM meat 372 |
| MJI Meats Ltd | Ballyhaunis | Carne | Minced Meat | — | DAFM meat 2595 |
| Moran Butchers & Deli | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/moran-butchers-and-deli |
| Nourfoods | Ballyhaunis | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2812 |
| Reilly Butchers Bangor | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/reilly-butchers-bangor |
| Ryan's Food Emporium | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/ryan-s-food-emporium |
| Tolan's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/2217794823 | — | FarmFinder https://farmfinder.ie/producer/tolan-s-butchers |
| Tony Carolan | Castlebar | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2684 |
| Western Brand Group Unlimited | Ballyhaunis | Carne | Minced Meat, Meat Preparations; also FarmFinder https://farmfinder.ie/producer/western-brand-group | — | DAFM meat 818 |
| IrishAmerican Distillery | — | Destilados y licores | craft=distillery | www.irishamericanwhiskeys.com · +353 98 47898 | OSM way/184683107 |
| The Connacht Whiskey Company | — | Destilados y licores | craft=distillery | — | OSM way/472648066 |
| Market Tea Rooms | — | Dulces y repostería | craft=confectionery | — | OSM node/3107171978 |
| An Siopa Beag | — | Huevos | listed; Eggs, Baked Goods, Preserves, Farm Gate | — | FarmFinder https://farmfinder.ie/producer/an-siopa-beag |
| Castlebar | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com, remaining) | — | FarmFinder https://farmfinder.ie/producer/castlebar |
| Hollie’s Farm eggs | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/hollie-s-farm-eggs |
| Bioshell Teoranta | Carrowteige Ballina Co Mayo | Lácteos y quesos | N/A, TRADER | — | DAFM dairy 1717 |
| Cuinneóg Ltd | Shraheens Balla Castlebar Co | Lácteos y quesos | Bovine, TRADER; also FarmFinder https://farmfinder.ie/producer/cuinneog-butter | — | DAFM dairy 1728 |
| Dozio's of Mayo Ltd | Barroe Carracastle Ballaghaderreen Co. | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2113 |
| Knockatee Cheese | — | Lácteos y quesos | Producer; Dairy, Eggs, Cheese, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/knockatee-cheese |
| Michael McGrath & Sinéad Moran | Gleann Buí Farm Aghamore | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2196 |
| Rockfield Dairy Ltd | Unit 2, Clar Business | Lácteos y quesos | Ovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/rockfield-dairy | — | DAFM dairy IE 2004 |
| Velvet Cloud Sheep Yogurt | — | Lácteos y quesos | Producer; Dairy, Eggs, SuperValu Food Academy, Honesty Box; also FarmFinder https://farmfinder.ie/producer/velvet-cloud | — | FarmFinder https://farmfinder.ie/producer/velvet-cloud-sheep-yogurt |
| Velvet Cloud Yoghurt | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/velvet-cloud-yoghurt |
| Ballyhaunis Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ballyhaunis-beekeepers-association |
| BenRock Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/benrock-farm |
| Blackshell Farm Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/blackshell-farm-ltd |
| Blas Glas | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/blas-glas |
| Boherhallagh Bees | — | Otros | listed; Baked Goods, Farm Gate, yourhonestybox.com, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/boherhallagh-bees |
| Connamara Smoke House | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/connamara-smoke-house-mayo |
| Connemara Seafoods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/connemara-seafoods |
| County Mayo Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/county-mayo-association |
| Drioglann Acla Teoranta | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/drioglann-acla-teoranta |
| Drioglann Loch Measc Teo | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/drioglann-loch-measc-teo |
| Eamonn McDonagh | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/eamonn-mcdonagh |
| Enniscoe Organic Garden | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/enniscoe-organic-garden |
| Erris Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/erris-association |
| Gleann Buí Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gleann-bu-farm |
| Hill Valley Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/hill-valley-farm |
| West Coast Crab Sales Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/west-coast-crab-sales-ltd |
| Westport Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/westport-association |
| Clare Island Oven | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/clare-island-oven |
| Cornrue Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory; also OSM node/12049533532 | www.cornrue.com | FarmFinder https://farmfinder.ie/producer/cornrue-bakery |
| The Butty Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/the-butty-bakery |
| Clarkes Salmon Smokery | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/clarkes-salmon-smokery |
| The Fish Shop | — | Pescado | listed; also FarmFinder https://farmfinder.ie/producer/duanes-fish-shop-mayo | — | FarmFinder https://farmfinder.ie/producer/the-fish-shop-mayo |
| Savoir Fare | — | Vino | craft=winery | — | OSM node/10696843800 |
| The Gallery | — | Vino | craft=winery | — | OSM node/10696875389 |

### Facility or shopfront only — 45 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Anthony Leneghan | — | Carne | shop=butcher | — | OSM node/4432643223 |
| Byrne's Meats | — | Carne | shop=butcher | — | OSM node/2531730318 |
| Byrnes Meat Market | — | Carne | shop=butcher | — | OSM node/10701796605 |
| Calvey's Family Butchers | — | Carne | shop=butcher | +353 98 43158 | OSM node/6920743987 |
| Curry's | — | Carne | shop=butcher | — | OSM node/3107171972 |
| Dawn Ballyhaunis (registered as Dawn Meats Ireland UC T/A Dawn Ballyhaunis) | Ballyhaunis | Carne | Slaughtering, Cutting only | — | DAFM meat 364 |
| E. J. Phillips | — | Carne | shop=butcher | — | OSM node/3259885863 |
| Ger McGreal | Balla | Carne | Slaughtering only | — | DAFM meat 2703 |
| Gilligan Family Butcher | — | Carne | shop=butcher | — | OSM node/12458800433 |
| Heneghan Butchers LTD | Ballinrobe | Carne | Slaughtering only | — | DAFM meat 2969 |
| Hopkins | — | Carne | shop=butcher | — | OSM node/2918993788 |
| Irvine's Butchery | Bangor | Carne | shop=butcher | — | OSM way/1484763677 |
| James Duffy | Ballyhaunis | Carne | Slaughtering only | — | DAFM meat 2677 |
| James Molloy | Shrule | Carne | Slaughtering only | — | DAFM meat 2704 |
| John Moore | — | Carne | shop=butcher | — | OSM node/4442512265 |
| John Shannon Meats | — | Carne | shop=butcher | — | OSM node/2551761818 |
| JP's Butchers | — | Carne | shop=butcher | — | OSM node/3019001406 |
| Kavanaghs Butchers | Ballina | Carne | shop=butcher | — | OSM node/1184155983 |
| Kettericks Family Butcher | — | Carne | shop=butcher | — | OSM way/445866641 |
| Liam Jennings | Ballinrobe | Carne | Slaughtering only | — | DAFM meat 2683 |
| Martin Calvey | Achill | Carne | Slaughtering only | — | DAFM meat 2708 |
| Mc Greal Meats | — | Carne | shop=butcher | — | OSM way/738804733 |
| Moran's Family Butchers | — | Carne | shop=butcher | — | OSM node/4422022810 |
| Patrick Phillips | Ballyhaunis | Carne | Slaughtering only | — | DAFM meat 2682 |
| Quinns | — | Carne | shop=butcher | — | OSM node/2149770919 |
| Reilly's Quality Meat | — | Carne | shop=butcher | — | OSM way/614448810 |
| Reilly's Victuallers LTD | Ballina | Carne | Slaughtering only | — | DAFM meat 2678 |
| S. Hawshaw | — | Carne | shop=butcher | — | OSM node/10699136350 |
| The Premium Butcher | — | Carne | shop=butcher | — | OSM node/3259901766 |
| Thomas Conroy | Shrule | Carne | Slaughtering only | — | DAFM meat 2686 |
| Elba Chocolates | — | Chocolate | shop=chocolate | — | OSM node/11476381634 |
| Marlene's Chocolate Haven | Westport | Chocolate | shop=chocolate | marleneschochaven.com · +353 86 440 8444 | OSM node/4338636241 |
| Eureka - Something Sweet | — | Dulces y repostería | shop=confectionery | — | OSM way/239366305 |
| Nuggies | — | Dulces y repostería | shop=confectionery | — | OSM node/4478972977 |
| Afro-Asian-Carribbean Shop | — | Otros | shop=deli | — | OSM node/4464852171 |
| Heffernan's Fine Foods | — | Otros | shop=deli | — | OSM node/3107171975 |
| Kate McCormack & Sons | — | Otros | shop=deli | — | OSM node/10696851822 |
| Morans | — | Otros | shop=deli | — | OSM node/1500717125 |
| The Food Store | — | Otros | shop=deli | — | OSM node/3812620508 |
| Western Farming Co-Op | — | Otros | shop=farm | — | OSM node/7858487300 |
| Álainn | — | Pan y cereal | shop=bakery | — | OSM way/319627250 |
| An Builín Blasta | — | Pan y cereal | shop=bakery | — | OSM node/13757178575 |
| Breadski Bakery | — | Pan y cereal | shop=bakery | — | OSM node/7982493052 |
| Cake my Day | — | Pan y cereal | shop=bakery | — | OSM node/4620904916 |
| The Store Next Door | — | Pan y cereal | shop=bakery | +353 98 25003 | OSM way/529166030 |
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
| Mescan Brewery | — | mescanbrewery.com |
| Reel Deel Brewery | — | reeldeelbrewery.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
