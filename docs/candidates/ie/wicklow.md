# Wicklow — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/wicklow.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/wicklow>.
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

### Production signal — 80 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Irish Decal Products Ltd. T/A Brady's Coffee Company | — | Café | listed | — | FarmFinder https://farmfinder.ie/producer/irish-decal-products-ltd-t-a-bradys-coffee-company |
| McCabe's Coffee LTD | — | Café | listed; also FarmFinder https://farmfinder.ie/producer/mccabess-hand-roasted-coffee | — | FarmFinder https://farmfinder.ie/producer/mccabes-coffee-ltd |
| Avoca Handweavers Limited | Central Production Unit | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (ready to eat) | — | FSAI HSE 4019 |
| Butler's Pantry | 16-17 Southern Cross Business ParkBoghal | Carne | Not Stated; Meat Products (ready to eat) | — | FSAI HSE 4004 |
| Dale Meats Ltd | Bray | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2375 |
| Derek Dunne Craft Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/7800897566 | — | FarmFinder https://farmfinder.ie/producer/derek-dunne-craft-butchers |
| Dun Luain Foods Ltd | Dunlavin | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2641 |
| Dunnes of Wicklow | Rathnew | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2696 |
| Eugene's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/eugene-s-butchers |
| Farrelly's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/farrelly-s-butchers |
| Frank Doyle FD Meats | Bray | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also OSM node/9307607880 | — | DAFM meat 2912 |
| Gather and Gather Ltd. | Unit 3 | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4088 |
| Glenhaven Foods (Arklow) Unlimited Company | Arklow | Carne | Minced Meat, Meat Preparations, Meat Products RTE | — | DAFM meat 830 |
| Italicatessen Ltd | Block F Newtown Business & Enterprise Ce | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4071 |
| Keith Grant Master Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/keith-grant-master-butchers |
| Le Paysan of Wicklow Limited | Unit W11 Wicklow Enterprise ParkThe Murr | Carne | Manufacturer; Meat Products (ready to eat); also FarmFinder https://farmfinder.ie/producer/le-paysan | — | FSAI HSE 4072 |
| Little Dinners Ltd | Enterprise Unit 2Rathdrum | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (not ready to eat) | — | FSAI HSE 4018 |
| Mitchell's Village Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/mitchell-s-village-butchers |
| Nutriquick Limited | Unit 4 Blessington Industrial EstateBles | Carne | Manufacturer; Meat Products (ready to eat) | — | FSAI HSE 4066 |
| Pilgrim's Food Masters Ireland Ltd | Shillelagh | Carne | Meat Preparations, Meat Products RTE | — | DAFM meat 501 |
| The Good Life Company (registered as Steven Goode T/A The Good Life Company) | Arklow | Carne | Meat Products Non RTE | — | DAFM meat 2893 |
| The Hatchery (registered as Glenhaven Foods (Arklow) Unlimited T/A The Hatchery) | Avoca | Carne | Meat Preparations | — | DAFM meat 2058 |
| Beaky Dargus Brewing Co. | Grangecon | Cerveza | listed; also OSM way/931414898 | +353868963643 · beakydargus@gmail.com | FarmFinder https://farmfinder.ie/producer/beaky-dargus-brewing-co |
| Rí-Rá Brewing Co. | Kilcoole | Cerveza | listed; also OSM node/11383946783 | www.ri-ra.beer | FarmFinder https://farmfinder.ie/producer/r-r-brewing-co |
| The Great Eastern Brewing Co. | Wicklow | Cerveza | listed; also OSM node/11420062256 | greateasternbrewing@gmail.com | FarmFinder https://farmfinder.ie/producer/the-great-eastern-brewing-co |
| Vartry Coffee | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/vartry-coffee |
| Glendalough Distillery | — | Destilados y licores | craft=distillery | www.glendaloughdistillery.com | OSM node/6473071071 |
| Glendalough Irish Whiskey | — | Destilados y licores | listed | — | FarmFinder https://farmfinder.ie/producer/glendalough-irish-whiskey |
| An Tairseach Organic Veg Box | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/an-tairseach-organic-veg-box |
| O'Hanlon's Herbs | — | Fruta y verdura | Producer; Origin Green Member, Fruit, Vegetables, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/o-hanlon-s-herbs |
| Goldenhill Farmhouse Ice cream (registered as Aoife and Damien Clarke) | Goldenhill Farm Goldenhill Three | Helados | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1927 |
| The Fluffy Ladies’ Eggs | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/the-fluffy-ladies-eggs |
| Ballyhubbock Farm (registered as Mr George Finlay & Ms Hanna Sheerin) | Ballyhubbock Farm Ballyhubbock Lower | Lácteos y quesos | Ovine, SMALL - MEDIUM | — | DAFM dairy IE2136 |
| Coolattin Cheddar | — | Lácteos y quesos | Producer; Cheese, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/coolattin-cheddar |
| Fusco Connell (registered as Fusco Foods Ltd) | Kilcoole Industrial Estate Unit | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy 1719 |
| Acton’s | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/actons |
| Altidore Farm - Philip Emmet | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/altidore-farm-philip-emmet |
| Ashford Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ashford-beekeepers-association |
| Atlantic Aromatics Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/atlantic-aromatics-ltd |
| Bees 4 Me 2 | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bees-4-me-2 |
| Bomar Ltd - Bomar Aromatherapy | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bomar-ltd-bomar-aromatherapy |
| Castleruddery Organic Farm | — | Otros | Farm; Organic, Vegetables, Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/castleruddery-organic-farm |
| Clarkes Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/clarkes-farm |
| Daisy Cottage Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/daisy-cottage-farm |
| Denis Healy - Certified Organic Grower | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/denis-healy-certified-organic-grower |
| Dr Coys Health Foods | — | Otros | Producer; Vegetables, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/dr-coys-health-foods |
| Drea, Sean | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/drea-sean |
| Garden County Organics | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/garden-county-organics |
| Glenhaven Quality Foods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/glenhaven-quality-foods |
| GoBia Ltd. | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gobia-ltd |
| Irish Botanica | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/irish-botanica |
| Irish Pure | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/irish-pure |
| Janets Country Fayre Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/janets-country-fayre-ltd |
| Keadeen Mountain Farms | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/keadeen-mountain-farms |
| Killruddery Farm Shop | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/killruddery-farm-shop |
| Kilmullen Farm | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/kilmullen-farm |
| Kush Seafarms Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kush-seafarms-ltd |
| Miena's | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mienas |
| Monika's Biscuits | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/monika-s-biscuits |
| National Organic Products Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/national-organic-products-ltd |
| Organic Delights - Denis Healy | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/organic-delights-denis-healy |
| Organic Life | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/organic-life |
| Powerscourt Distillery | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/powerscourt-distillery |
| Roundwood Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/roundwood-association |
| Sally Gap Foods | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/sally-gap-foods |
| Sussed Nutrition Limited | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sussed-nutrition-limited |
| Tara, Kilmurray south, Red Lane | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/tara-kilmurray-south-red-lane |
| The BrookLodge Hotel | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-brooklodge-hotel |
| the Happy Pear | — | Otros | Producer; SuperValu Food Academy; also FarmFinder https://farmfinder.ie/producer/the-happy-pear-farm-veg-box | — | FarmFinder https://farmfinder.ie/producer/the-happy-pear |
| The Shepherd’s Pantry | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-shepherds-pantry |
| Tinahely Farm Shop, Restaurant & Children's Activity Barn | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/tinahely-farm-shop-restaurant-and-children-s-activity-barn |
| Waterfall Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/waterfall-farm |
| Wicklow Rapeseed Oil | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wicklow-rapeseed-oil |
| Wicklow Town Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wicklow-town-market |
| Wicklow Way Wines | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wicklow-way-wines |
| Wicklow Wolf | — | Otros | listed; also FarmFinder https://farmfinder.ie/producer/wicklow-wolf-brewing-co | — | FarmFinder https://farmfinder.ie/producer/wicklow-wolf |
| Firehouse Bakery | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/firehouse-bakery |
| Grá Arán | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/gr-ar-n |
| Slow Dough Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/slow-dough-bakery |
| Stone Oven Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/stone-oven-bakery |

### Facility or shopfront only — 21 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Anthony & Padraig Farrelly | Delgany | Carne | Slaughtering only; also OSM node/12179178429 | — | DAFM meat 2651 |
| Crimin Family Butcher | — | Carne | shop=butcher | — | OSM node/6314948025 |
| D. Murphy | Tinahely | Carne | shop=butcher | +353 402 38127 | OSM way/1110328121 |
| Flemings | — | Carne | shop=butcher | — | OSM node/5408203497 |
| Food Factory | — | Carne | shop=butcher | — | OSM node/6159161516 |
| Gerry Mitchell | — | Carne | shop=butcher | — | OSM node/5571552657 |
| Jimmy K Family Butcher | — | Carne | shop=butcher | — | OSM node/12476302199 |
| Joe's the Butchers | — | Carne | shop=butcher | — | OSM node/7040558857 |
| Keith Brandy Master Butchers | — | Carne | shop=butcher | — | OSM node/7673774447 |
| Moore's Family Butchers | — | Carne | shop=butcher | — | OSM node/4929081553 |
| Orlik | — | Carne | shop=butcher | — | OSM node/1866489776 |
| Traditional Butcher | — | Carne | shop=butcher | — | OSM node/13830876445 |
| Wonca's | — | Dulces y repostería | shop=confectionery | — | OSM node/6316821040 |
| Donovans of Enniskerry | — | Otros | shop=deli | — | OSM way/199469466 |
| Alaska Bakes | Rathnew | Pan y cereal | shop=bakery | — | OSM node/11418767236 |
| Amazing Cakes | — | Pan y cereal | shop=bakery | amazingcakes.ie | OSM node/8404601594 |
| Forno | Bray | Pan y cereal | shop=bakery | — | OSM node/5964059295 |
| Keegan's Home Bakery | Bray | Pan y cereal | shop=bakery | — | OSM way/767839697 |
| La Fig Earth stone baking | — | Pan y cereal | shop=bakery | — | OSM node/7673774452 |
| Scéal Bakery | — | Pan y cereal | shop=bakery | www.scealbakery.com | OSM node/11636095682 |
| The Larder | Bray | Pan y cereal | shop=bakery | — | OSM node/9307607881 |
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
| Larkin's Brewing Co. | — | larkins.beer |
| O Brother Brewing | Kilcoole | obrotherbrewing.com |
| Wicklow Brewery | — | wicklowbrewery.ie |
| Wicklow Wolf Brewing Company | — | wicklowwolf.com |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
