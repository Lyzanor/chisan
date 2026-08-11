# Wexford — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/wexford.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/wexford>.
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

### Production signal — 77 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Naturally Cordial Ltd | — | Bebidas sin alcohol | listed | — | FarmFinder https://farmfinder.ie/producer/naturally-cordial-ltd |
| The Farm Shop Wexford & The Cheeky cow Coffee | — | Café | listed | — | FarmFinder https://farmfinder.ie/producer/the-farm-shop-wexford-and-the-cheeky-cow-coffee |
| Alan Redmond Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/alan-redmond-butchers |
| Butchers Best | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/butchers-best |
| Doyle & Sons Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/doyle-and-sons-butchers |
| Drover Foods Ltd | Wexford | Carne | Minced Meat, Meat Preparations, Meat Products RTE | — | DAFM meat 546 |
| Finan Smokehouse | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/finan-smokehouse |
| Furlong Family Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/furlong-family-butchers |
| John Pettitt | Murrintown | Carne | Minced Meat, Meat Preparations | — | DAFM meat 3053 |
| Kavanagh Meats Enniscorthy ULC | Enniscorthy | Carne | Minced Meat, Meat Preparations | — | DAFM meat 404 |
| Kennedy's Butchers Bunclody | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/kennedy-s-butchers-bunclody |
| M&M Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/mandm-meats |
| O'Neills Dry Cure Bacon Co (registered as O'Neills Foods LTD T/A O'Neills Dry Cure Bacon Co) | Enniscorthy | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2851 |
| Pettits Kitchen | Sleedagh Farm Sleedagh Murrintown | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4093 |
| Richie Doyle Butcher | Wexford | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/10916751777 | richiedoylebutchers.ie · +353 53 912 3634 | FarmFinder https://farmfinder.ie/producer/richie-doyle-butcher |
| Zanna Cookhouse Limited (Clonard) | Whitemill Industrial estateClonardWexfor | Carne | Manufacturer; Meat Products (not ready to eat); also FarmFinder https://farmfinder.ie/producer/zanna-cookhouse-ltd | — | FSAI HSE 4092 |
| Brennan's Brewery | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/brennans-brewery |
| Clever Man | Wexford | Cerveza | craft=brewery | — | OSM node/10816143284 |
| Yellowbelly Beer | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/yellowbelly-beer |
| Stafford Spirits Ltd | — | Destilados y licores | listed | — | FarmFinder https://farmfinder.ie/producer/stafford-spirits-ltd |
| Ballycross Apple Farm | — | Fruta y verdura | Farm; Fruit, Vegetables, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/ballycross-apple-farm |
| Greenhill Fruit Farm Ltd | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/greenhill-fruit-farm-ltd |
| Greens Berry Farm | — | Fruta y verdura | Farm; Fruit, Vegetables, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/greens-berry-farm |
| Natural Ice cream Wholesale Ltd | Unit 12 Wexford Enterprise | Helados | Bovine, SMALL - MEDIUM | — | DAFM dairy IE 1997 |
| Egg & Spud Shed | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/egg-spud-shed |
| Coolhull Farm Ltd | Strandfield Business Park, Rosslare | Lácteos y quesos | Bovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/coolhull-farm-paganini | — | DAFM dairy IE1009 |
| FairField farm fresh milk | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/fairfield-farm-fresh-milk |
| Future Nutrition Ltd | Railway Stores Templeshannon Enniscorthy | Lácteos y quesos | Bovine, size not stated; also FarmFinder https://farmfinder.ie/producer/future-nutrition | — | DAFM dairy 1718 |
| Killowen Farm (registered as Greenvalley Farms Ltd) | Killowen Farm The Beeches | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1875 |
| Killowen Yoghurt | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/killowen-yoghurt |
| Nutricia Infant Nutrition Irl Ltd | Rocklands Wexford | Lácteos y quesos | Bovine, INFANT FORMULA | — | DAFM dairy 1704 |
| Saltrock Dairy Ltd | Kildermot Gorey Co Wexford | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2167 |
| Tara Hill Honey | — | Miel | listed | — | FarmFinder https://farmfinder.ie/producer/tara-hill-honey |
| Aldridge Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/aldridge-farm |
| Atlantis of Kilmore Quay | Wexford | Otros | listed; also OSM node/11756473277 | www.atlantisofkilmorequay.ie | FarmFinder https://farmfinder.ie/producer/atlantis-of-kilmore-quay |
| Bean and Goose | — | Otros | Producer; NeighbourFood, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/bean-and-goose |
| Clone/Ferns | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/clone-ferns |
| County Wexford Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/county-wexford-association |
| Courtown Sea Angling Centre | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/courtown-sea-angling-centre-wexford |
| Fat tomato | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/fat-tomato-wexford |
| Gilbert, Shay | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gilbert-shay |
| Gorey Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gorey-association |
| Green's Farm Shop | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/greens-farm-shop |
| Isle of Crackers | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/isle-of-crackers |
| J. Caxard | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/j-caxard-wexford |
| Jacob Blackcurrants | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/jacob-blackcurrants |
| Karoo Farmshop & Cafe | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/karoo-farmshop-and-cafe |
| Kavanagh, Andy | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kavanagh-andy |
| Kilmore seafresh | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kilmore-seafresh |
| Kingfisher Fresh Ltd/ Wild Irish Seafoods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kingfisher-fresh-ltd-wild-irish-seafoods |
| Mannion’s Farm Shop | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/mannion-s-farm-shop |
| Marlfield House | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/marlfield-house |
| New Ross Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/new-ross-beekeepers-association |
| Ocean Leaves | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ocean-leaves |
| OUTCAST BRANDS | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/outcast-brands |
| Produce Vending Machine (Wexford) | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/produce-vending-machine-wexford |
| Rathgarogue Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rathgarogue-organic-farm |
| Regan Organic Farm | — | Otros | Farm; Organic, Vegetables, Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/regan-organic-farm |
| Sadies Hen house | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sadies-hen-house |
| Slaney Farms Produce Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/slaney-farms-produce-ltd |
| Slaney Valley | — | Otros | Producer; SuperValu Food Academy, remaining), About, About FarmFinder | — | FarmFinder https://farmfinder.ie/producer/slaney-valley |
| Sofrimar | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sofrimar |
| South Wexford Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/south-wexford-beekeepers-association |
| Stafford's Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/stafford-s-butchers |
| Thai Gold - Thai Food Co Limited | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/thai-gold-thai-food-co-limited |
| The Hot box | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-hot-box |
| The Saucy Butcher | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-saucy-butcher |
| The Strand Cahore | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-strand-cahore |
| Trudies Catering Kitchen ltd. | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/trudies-catering-kitchen-ltd |
| Wexford Home Preserves | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wexford-home-preserves |
| Wexford Town Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wexford-town-market |
| Wheelock Fruits | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wheelock-fruits |
| Wilton Mills | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wilton-mills |
| Irish Pride Bakery | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/irish-pride-bakery |
| Meyler's Fish Merchants | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/meylers-fish-merchants-wexford |
| Seaview Fresh Fish Shop | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/seaview-fresh-fish-shop-wexford |
| The Wine Buff Gorey | — | Vino | listed | — | FarmFinder https://farmfinder.ie/producer/the-wine-buff-gorey |

### Facility or shopfront only — 27 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| ABP Slaney (registered as Anglo Beef Processors Ireland UC T/A ABP Slaney) | Bunclody | Carne | Meat Preparations; national-scale brand | — | DAFM meat 296 |
| Boyle's Butchers | New Ross | Carne | shop=butcher | boylesbutchers.ie | OSM node/11805245596 |
| Butcher's Best | New Ross | Carne | shop=butcher | — | OSM node/13063150420 |
| Christopher Byrne | Enniscorthy | Carne | Slaughtering, Cutting only | — | DAFM meat 2360 |
| Christy Byrne | Camolin | Carne | shop=butcher | — | OSM node/6240053102 |
| Irish Country Meats Camolin (registered as Anglo Beef Processors Ireland UC T/A Irish Country Meats Camolin) | Camolin | Carne | Minced Meat, Meat Preparations; national-scale brand | — | DAFM meat 367 |
| Regan Organic Produce | Enniscorthy | Carne | Slaughtering, Cutting only | — | DAFM meat 2877 |
| Richard Doyle | Cleariestown | Carne | Slaughtering only | — | DAFM meat 2350 |
| T. Cahill Craft Butcher | Ferns | Carne | shop=butcher | tcahillcraftbutcher.ie | OSM node/1768112943 |
| Wickham Bros. | Enniscorthy | Carne | shop=butcher | — | OSM node/9353932865 |
| Bridget's Sweet Boutique | New Ross | Dulces y repostería | shop=confectionery | — | OSM node/11802635145 |
| Kandyland | Courtown | Dulces y repostería | shop=confectionery | — | OSM node/4237372758 |
| Mags Jelly Heaven | Wexford | Dulces y repostería | shop=confectionery | — | OSM node/4953007432 |
| Ann McDonald's | New Ross | Otros | shop=deli | www.annmcdonaldscafe.com | OSM node/884332268 |
| Green Acres Store | Wexford | Otros | shop=deli | greenacres.ie/collections/all?sort_by=best-selling | OSM node/10736657514 |
| Kelly's Deli | Rosslare | Otros | shop=deli | — | OSM way/515012413 |
| Myles Doyle | Gorey | Otros | shop=deli | myselectgrocer.com | OSM node/1680832124 |
| Wholesome Health Store | Gorey | Otros | shop=deli | — | OSM node/3647707203 |
| Bakehouse | New Ross | Pan y cereal | shop=bakery | www.thebakehouse.ie | OSM node/8220671195 |
| Doughnuts and Hotdogs | Courtown | Pan y cereal | shop=bakery | — | OSM node/1950904076 |
| Elsa Bakes | Wexford | Pan y cereal | shop=bakery | — | OSM node/11001611365 |
| Firehouse Bakery | Gorey | Pan y cereal | shop=bakery | thefirehouse.ie | OSM node/12281721844 |
| Kelly's Bakery | Wexford | Pan y cereal | shop=bakery | kellysbakery.ie | OSM node/6731908545 |
| Sweet Passion | Camolin | Pan y cereal | shop=bakery | — | OSM node/6502224012 |
| Yola | Wexford | Pan y cereal | shop=bakery | yolabakery.ie | OSM node/6121093474 |
| Niamh's Trawler Catch | New Ross | Pescado | shop=seafood | — | OSM node/11805226055 |
| Ronan's Fish Shop | New Ross | Pescado | shop=seafood | www.duncannonfish.com | OSM node/7884685626 |
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
| YellowBelly Beer Ltd | — | yellowbellybeer.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
