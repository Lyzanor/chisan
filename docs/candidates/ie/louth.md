# Louth — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/louth.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/louth>.
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

### Production signal — 78 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Dreambeans Coffee | — | Café | listed | — | FarmFinder https://farmfinder.ie/producer/dreambeans-coffee |
| Ashbrook Farms LTD | Knockbridge | Carne | Minced Meat | — | DAFM meat 2786 |
| Callaghan's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also FarmFinder https://farmfinder.ie/producer/peter-callaghan-butchers-and-deli | — | FarmFinder https://farmfinder.ie/producer/callaghan-s-butchers |
| Carnivore Meats LTD | Dundalk | Carne | Minced Meat | — | DAFM meat 3033 |
| Commins Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/commins-butchers |
| Coyle Vac Pack LTD | Dundalk | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2334 |
| Dublin Meat Company | — | Carne | Producer; Beef, Lamb, Pork, Poultry; via Irish Meat Producers Directory | — | FarmFinder https://farmfinder.ie/producer/dublin-meat-company |
| Firren Foods LTD | Ardee | Carne | Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2309 |
| German Salami Co. (Dundalk) Ltd | Dundalk | Carne | Meat Products RTE | — | DAFM meat 764 |
| Hanratty Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/hanratty-butchers |
| Haynestown Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry; via Irish Meat Producers Directory | — | FarmFinder https://farmfinder.ie/producer/haynestown-meats |
| Hilton Foods (Irl) Ltd. | Drogheda | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/hilton-foods | — | DAFM meat 409 |
| HSE Louth Meath Mental Health Services | St. Brigid's HospitalKells RoadArdee | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4082 |
| Larry's Butcher & Deli | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/larry-s-butcher-and-deli |
| McCormick's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/mccormick-s-butchers |
| Morgan Meats (registered as Failte Foods LTD T/A Morgan Meats) | Omeath | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2818 |
| P & A Quinn LTD | Dundalk | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2308 |
| Rocksalt Catering Production Kitchen | Dundalk | Carne | Meat Products Non RTE | — | DAFM meat 3045 |
| Tavanamore Meats | Dundalk | Carne | Minced Meat | — | DAFM meat 2302 |
| Tony Kieran LTD | Dundalk | Carne | Cutting only; also FarmFinder https://farmfinder.ie/producer/tony-kieran-butchers | — | DAFM meat 2563 |
| Tuite's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/tuite-s-butchers |
| Bradys Cider | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/bradys-cider |
| Carlingford Brewing Co. | Carlingford | Cerveza | listed; also OSM node/10151144758 | carlingfordbrewing.ie · +353429397519 · info@carlingfordbrewing.ie | FarmFinder https://farmfinder.ie/producer/carlingford-brewing-co |
| Dundalk Bay Brewery Co | Dundalk | Cerveza | listed; also OSM way/260466694 | www.dbbd.ie · info@dbbd.ie | FarmFinder https://farmfinder.ie/producer/dundalk-bay-brewery-co |
| Lilys Tea Shop | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/lilys-tea-shop |
| Cooley Distillery | — | Destilados y licores | craft=distillery | — | OSM way/193196918 |
| Kinahans Irish Whiskey Limited | — | Destilados y licores | listed | — | FarmFinder https://farmfinder.ie/producer/kinahans-irish-whiskey-limited |
| Crilly's Sweets | — | Dulces y repostería | craft=confectionery | — | OSM node/11084286273 |
| Anaverna Vegetables, Herbs & Fruit | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/anaverna-vegetables-herbs-fruit |
| Belview Egg Farm Ltd | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/belview-egg-farm-ltd |
| Egg Vending Machine (Louth) | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/egg-vending-machine-louth |
| Feckin Clogher Milk Ltd | Garrigee House Almondstown Clogherhead | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2172 |
| King of Kefir | — | Lácteos y quesos | Producer; Dairy, Eggs, Preserves, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/king-of-kefir |
| Muchgrange Farm Ltd | Muchgrange Greenore Dundalk Co | Lácteos y quesos | Bovine, SMALL; also OSM node/12118620415 | — | DAFM dairy IE2162 |
| Muchgrange Milk | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/muchgrange-milk |
| Seabank Dairies Ltd | Seabank House Dublin Road | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2161 |
| Drogheda Honey | — | Miel | Producer; Preserves, Honey, Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/drogheda-honey |
| Lannleire Honey | — | Miel | listed | — | FarmFinder https://farmfinder.ie/producer/lannleire-honey |
| Alo Sokraki Organicos | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/alo-sokraki-organicos |
| Ballapousta Bakes | — | Otros | listed; Preserves, Farm Gate, yourhonestybox.com, remaining) | — | FarmFinder https://farmfinder.ie/producer/ballapousta-bakes |
| Ballymakenny Farm | — | Otros | Farm; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/ballymakenny-farm |
| Boyne Valley Group | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/boyne-valley-group |
| Brownie delight | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/brownie-delight |
| Caboose | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/caboose |
| Cooley Oysters Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cooley-oysters-ltd |
| County Louth Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/county-louth-association |
| Fierce Mild | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/fierce-mild |
| Fishermans Catch | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/fishermans-catch-louth |
| Food Vending Machine (Louth) | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/food-vending-machine-louth |
| Forever Flowers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/forever-flowers |
| Forge Field Farm Shop | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/forge-field-farm-shop |
| Fyffes | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/fyffes |
| Great Northern Distillery | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/great-northern-distillery |
| Hawthorn Wellness | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/hawthorn-wellness |
| Hickeys Farm Shop | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/hickeys-farm-shop |
| Ken Boyle | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ken-boyle |
| KooKee | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kookee |
| Lordship | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lordship |
| Loughanmore Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/loughanmore-farm |
| Nu Infusions | — | Otros | Producer; IOA Member, Organic, Irish Organic Association, Honesty Box | — | FarmFinder https://farmfinder.ie/producer/nu-infusions |
| O'Neills Flowers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/o-neills-flowers |
| Oriel Marine Extracts | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/oriel-marine-extracts |
| Produce Vending Machine (Marshes Avenue, Louth) | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/produce-vending-machine-marshes-avenue-louth |
| Produce Vending Machine (Sandy Lane, Louth) | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/produce-vending-machine-sandy-lane-louth |
| Rians Butt Nuggets | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rians-butt-nuggets |
| Silver Hill Duck | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/silver-hill-duck |
| Spud Shack | — | Otros | Farm; Vegetables, Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/spud-shack |
| The Spoonful Food Company Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-spoonful-food-company-ltd |
| Trinity Green farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/trinity-green-farm |
| Unglu-d | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/unglu-d |
| Urban Indian | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/urban-indian |
| Valentia Island Vermouth | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/valentia-island-vermouth |
| Dunany Flour | — | Pan y cereal | Producer; Bread & Bakery; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/dunany-flour |
| East Coast Bakehouse | — | Pan y cereal | Producer; Bread & Bakery, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/east-coast-bakehouse |
| Fine Feckin Foods | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/fine-feckin-foods |
| Carlingford Oyster Company Ltd | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/carlingford-oyster-company-ltd |
| Morgans Fine Fish | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/morgans-fine-fish |
| Dan Kelly's Cider | — | Sidra | listed | — | FarmFinder https://farmfinder.ie/producer/dan-kellys-cider |

### Facility or shopfront only — 37 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Ardlawn Meats | Carlingford | Carne | Slaughtering only | — | DAFM meat 612 |
| Barry's | — | Carne | shop=butcher | — | OSM way/436014019 |
| D. Farrell | — | Carne | shop=butcher | — | OSM way/238361128 |
| Des Savage butchers | — | Carne | shop=butcher | — | OSM node/2557549888 |
| Dromena Foods | Castlebellingham | Carne | Cutting only | — | DAFM meat 2306 |
| Joe Traynor Ltd. | — | Carne | shop=butcher | — | OSM node/2657344733 |
| John Magee Butcher | — | Carne | shop=butcher | — | OSM way/1463139690 |
| Justin Callaghan & Sons | Drogheda | Carne | shop=butcher | — | OSM node/10120837441 |
| M&M Meats | — | Carne | shop=butcher | — | OSM node/4745443294 |
| Martin Commins | Ardee | Carne | Slaughtering only | — | DAFM meat 3011 |
| Mc Cormick's Pork Butchers | Dundalk | Carne | shop=butcher | — | OSM node/2458236703 |
| McArdle Meats | — | Carne | shop=butcher | — | OSM node/2696984124 |
| McCORMICKS | — | Carne | shop=butcher | — | OSM node/3101457591 |
| McEvoy's | — | Carne | shop=butcher | — | OSM node/342206969 |
| MICHAEL WHITE & SONS | — | Carne | shop=butcher | — | OSM node/2988567849 |
| Stephen Rooney | — | Carne | shop=butcher | — | OSM node/8571719073 |
| Taste of Gullion | — | Carne | shop=butcher | — | OSM way/1183770560 |
| Tuites | — | Carne | shop=butcher | — | OSM node/12474267118 |
| White's Butchers | — | Carne | shop=butcher | — | OSM way/844057392 |
| NearyNógs Stoneground Chocolates | — | Chocolate | shop=chocolate | www.nearynogs.com | OSM way/1177474088 |
| Candyford | — | Dulces y repostería | shop=confectionery | — | OSM node/6204545990 |
| Finlay's Sweet Shop | Ardee | Dulces y repostería | shop=confectionery | — | OSM node/7967035887 |
| Huckleberry’s Ice Cream | — | Dulces y repostería | shop=confectionery | — | OSM node/3318996954 |
| Mauds | — | Dulces y repostería | shop=confectionery | — | OSM way/861217686 |
| The Candy Shop | — | Dulces y repostería | shop=confectionery | — | OSM node/3085778904 |
| Tirlán Limited | Dublin Rd Drogheda Co | Lácteos y quesos | Bovine, DRINKING MILK PLANT; national-scale brand | — | DAFM dairy IE1405 |
| ABP Foods | — | Otros | listed; national-scale brand | — | FarmFinder https://farmfinder.ie/producer/abp-foods |
| Kieran's Deli | Drogheda | Otros | shop=deli | — | OSM node/10120837417 |
| Killeavy Castle Farm Store | — | Otros | shop=farm | — | OSM node/12926126845 |
| Mc Creesh's Avenue Deli | Dundalk | Otros | shop=deli | +353 42 9331574 | OSM way/360126385 |
| Meigh Farm Shop | — | Otros | shop=farm | — | OSM node/5343780085 |
| The Butler's Pantry | Blackrock | Otros | shop=deli | thebutlerspantry.ie · +353 1 284 3933 | OSM node/3583952398 |
| Caffreys | Ardee | Pan y cereal | shop=bakery | — | OSM node/4344862590 |
| Corn Dolly Bakery | — | Pan y cereal | shop=bakery | — | OSM node/3488379707 |
| Homebakery | — | Pan y cereal | shop=bakery | — | OSM node/1585082920 |
| Sunray | — | Pan y cereal | shop=bakery | — | OSM way/832351143 |
| The Home Bakery | — | Pan y cereal | shop=bakery | www.thehomebakery.ie · +353 42 933 4392 | OSM node/2989107649 |
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
| Dundalk Bay Brewery | — | facebook.com/Dundalk-Bay-Brewery |
| Jumping Church Brewery | — | jumpingchurchbrewery.ie |
| Pearse Lyons Brewery | — | facebook.com/thefoxesrock |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
