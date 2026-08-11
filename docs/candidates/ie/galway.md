# Galway — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/galway.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/galway>.
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

### Production signal — 105 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Andarl Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/andarl-farm |
| Beard Brothers Meat LTD | Loughrea | Carne | Minced Meat | — | DAFM meat 3044 |
| Brady's Butchers Athenry | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/brady-s-butchers-athenry |
| Burke Butchers Kinvara | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/burke-butchers-kinvara |
| Connemara Mountain Lamb, Co. Galway | — | Carne | listed | — | FarmFinder https://farmfinder.ie/producer/connemara-mountain-lamb-co-galway |
| Connemara Smokehouse | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/connemara-smokehouse |
| Cope Community Catering | Unit 5 | Carne | Manufacturer; Meat Products (not ready to eat) | — | FSAI HSE 4086 |
| CR Tormey & Sons Galway | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/cr-tormey-and-sons-galway |
| Curleys Quality Foods | CarrowbrowneCastlegar | Carne | Unknown; Meat Products (ready to eat) | — | FSAI HSE 4061 |
| Divilly's Ltd. | Oranmore | Carne | Minced Meat, Meat Preparations, Meat Products RTE | — | DAFM meat 576 |
| Duffy's Excel Warehouse | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/duffy-s-excel-warehouse |
| Galmere Fresh Foods Ltd. | Ballybrit Upper Industrial EstateMonivea | Carne | Meat and meat products Cat. I (Cooked Meat); Meat Products (not ready to eat); also FarmFinder https://farmfinder.ie/producer/galmere-fresh-foods | — | FSAI HSE 4041 |
| Geraghty Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/geraghty-butchers |
| Gourmet Sandwiches Ltd. | DerrybrienLoughrea | Carne | Meat & meat products I: Cooked meat (WHS); Meat Products (ready to eat) | — | FSAI HSE 4062 |
| Gourmet Tart Company Ltd | Unit 1 Block 13Ballybane Industrial Esta | Carne | Meat & meat products I: Cooked meat (WHS); Meat Products (ready to eat) | — | FSAI HSE 4051 |
| Justin Flannery | Peterswell | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2558 |
| Kinvara Smoked Salmon | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/kinvara-smoked-salmon |
| Loughnane Family Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/loughnane-family-butchers |
| M.P.G Foods Ltd | CregboyCregboyClaregalway | Carne | Small Meat Manufacturing Plant; Meat Products (ready to eat) | — | FSAI HSE 4009 |
| McGeough's Connemara Fine Foods | Oughterard | Carne | Minced Meat, Meat Preparations, Meat Products RTE, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/connemara-fine-foods | — | DAFM meat 2438 |
| Meats Direct (registered as Dermot Duffy T/A Meats Direct) | Gort | Carne | Minced Meat | — | DAFM meat 2958 |
| Moycullen Meats | Moycullen | Carne | Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2326 |
| Portumna Pastry Ltd. | Portumna | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/portumna-pastry-limited | — | DAFM meat 761 |
| S & S Duffy Meats LTD | Gort | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2871 |
| Sean Loughnane (Galway) Ltd | Tuam | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 551 |
| Williams Gate Limited | Tuam Road | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2428 |
| Boffin Brewing | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/boffin-brewing |
| Connemara Brewing Co. | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/connemara-brewing-co |
| Tribe Irish Gin School | Galway | Destilados y licores | craft=distillery | tribegin.ie | OSM node/10207487947 |
| Green Earth Organics | — | Fruta y verdura | Farm; Organic, Fruit, Vegetables, Delivery; via Curated B2C Directory | — | FarmFinder https://farmfinder.ie/producer/green-earth-organics |
| Terryland Fruit & Veg Market | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/terryland-fruit-and-veg-market |
| An Bosca Uibheacha - The Egg Box | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/an-bosca-uibheacha-the-egg-box |
| Anna and Lucia’s eggs from happy hens | — | Huevos | listed | — | FarmFinder https://farmfinder.ie/producer/anna-and-lucia-s-eggs-from-happy-hens |
| Mad Yolk Farm & Sauna Experiences | — | Huevos | Farm; Eggs, Farm Gate, Farm Shops Ireland, remaining) | — | FarmFinder https://farmfinder.ie/producer/mad-yolk-farm-and-sauna-experiences |
| Cais Gabhair Arann Teoranta | Oughill killronan Inis Mor | Lácteos y quesos | Caprine, SMALL - MEDIUM | — | DAFM dairy IE1991 |
| Cais Na Tire Sheep Cheese | — | Lácteos y quesos | listed | — | FarmFinder https://farmfinder.ie/producer/cais-na-tire-sheep-cheese |
| Cuan Mhuire CLG | Coolarne Turloughmore Co Galway | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2208 |
| Galway Cheese (registered as Annelar Ltd) | An Teach Tui, Gurteen | Lácteos y quesos | Bovine, Caprine, SMALL - MEDIUM | — | DAFM dairy IE1981 |
| Killeen Farmhouse Cheese (registered as Marion Roeleveld) | Manufacturing Address Loughanroe East | Lácteos y quesos | Bovine ,Caprine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/killeen-cheese | — | DAFM dairy IE1912 |
| Kylemore Farmhouse Cheese (registered as Ms Teresa Roche) | Kylemore Abbey Loughrea Co | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2132 |
| Sabanero Artisan Cheese (registered as Dayana Maltese) | Unit 4 Westside Enterprise | Lácteos y quesos | Bovine, SMALL - MEDIUM; also OSM way/1499793758 | +353 91 4417 266 | DAFM dairy IE2118 |
| Village Creamery Ltd | Kiltulla Oranmore Co Galway | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2219 |
| A NATURAL LIFE by Dr Suraya Diaz | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/a-natural-life-by-dr-suraya-diaz |
| Ahascragh Distillers Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ahascragh-distillers-ltd |
| Ali's | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/alis-galway |
| An Garraí Glas | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/an-garrai-glas |
| Barry John Sausages | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/barry-john-sausages |
| Beechlawn Organic Farm, Co. Galway | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/beechlawn-organic-farm-co-galway |
| Blakes Always Organic Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/blakes-always-organic-ltd |
| Castle farm preserves | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/castle-farm-preserves |
| Connemara Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/connemara-beekeepers-association |
| Connemara Organic Seaweeds Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/connemara-organic-seaweeds-ltd |
| Coole Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/coole-farm |
| Feirmeoir Beag Glas | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/feirmeoir-beag-glas |
| Galway Bay Seafoods | — | Otros | listed; also OSM way/150786614 | — | FarmFinder https://farmfinder.ie/producer/galway-bay-seafoods |
| Galway Flower Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/galway-flower-farm |
| Gannet Fishmongers | — | Otros | listed; also OSM node/1946374472 | gannet.fish@gmail.com | FarmFinder https://farmfinder.ie/producer/gannet-fishmongers |
| Grá Chocolates | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gr-chocolates |
| Gran Grans Foods LTD | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gran-grans-foods-ltd |
| GreenEarth Organics, Co. Galway | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/greenearth-organics-co-galway |
| Huitre Du Connemara | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/huitre-du-connemara |
| ISPG Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ispg-ltd |
| Kilbeg Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kilbeg-organic-farm |
| Killoscobe | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/killoscobe |
| Leahy Beekeeping | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/leahy-beekeeping |
| Loughmountain Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/loughmountain-farm |
| May's Place | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/may-s-place |
| McDonagh Butchers Kilkerrin | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mcdonagh-butchers-kilkerrin |
| McGrath Butchers Mervue | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mcgrath-butchers-mervue |
| Micil Distillery | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/micil-distillery |
| Mike Walsh Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mike-walsh-butchers |
| Mohans Oysters | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mohans-oysters |
| Moran's Meats Clifden | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/moran-s-meats-clifden |
| Moycullen Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/moycullen-market |
| Niall & Elaine Kelly | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/niall-and-elaine-kelly |
| Nibbed | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/nibbed |
| O'Donoghue Butchers Gort | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/o-donoghue-butchers-gort |
| Oranmore organic farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/oranmore-organic-farm |
| Roger Finnerty & Sons Galway | — | Otros | listed; also OSM node/6918295477 | — | FarmFinder https://farmfinder.ie/producer/roger-finnerty-and-sons-galway |
| Roger Finnerty & Sons Oughterard | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/roger-finnerty-and-sons-oughterard |
| Saraâs Choice | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sara-s-choice |
| Sheridans Cheesemongers Box | Galway | Otros | listed; also OSM node/9922919275 | sheridanscheesemongers.com/shops/galway-cheese-shop · +353 91 564 829 | FarmFinder https://farmfinder.ie/producer/sheridans-cheesemongers-box |
| Shramore Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/shramore-organic-farm |
| The Fisherman Factory Shop | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-fisherman-factory-shop-galway |
| The Foods of Athenry | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-foods-of-athenry |
| The Green Bee | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-green-bee |
| The Multidimensional Natural Medicine Institute | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-multidimensional-natural-medicine-institute |
| The Savage Garden | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-savage-garden |
| Tony Carroll's Family Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/tony-carroll-s-family-butchers |
| Bread Heaven Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/bread-heaven-bakery |
| Builin Blasta Cafe and Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/builin-blasta-cafe-and-bakery |
| Friendly Fermenistas | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/friendly-fermenistas |
| Granum Bakehouse | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/granum-bakehouse |
| Hapi Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/hapi-bakery |
| Joyce Country Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/joyce-country-bakery |
| Magpie Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/magpie-bakery |
| Mortons Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/mortons-bakery |
| Sheridans Bakery | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/sheridans-bakery |
| So Doh! Sourdough Renvyle | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/so-doh-sourdough-renvyle |
| Soda Bread Queen | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/soda-bread-queen |
| Woodfired Bread | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/woodfired-bread |
| Ali's Fish Market | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/alis-fish-market-galway |
| Mary's Fish Shop | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/marys-fish-shop-galway |
| Moran's Oyster Cottage | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/moran-s-oyster-cottage |
| Solaris Tea | — | Té e infusiones | listed | — | FarmFinder https://farmfinder.ie/producer/solaris-tea |

### Facility or shopfront only — 59 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Barlow's Organic Farm | Castlerea | Carne | Slaughtering only | — | DAFM meat 2850 |
| Brady Manufacturing | Athenry | Carne | Slaughtering only | — | DAFM meat 2609 |
| Brady's Butcher | — | Carne | shop=butcher | — | OSM way/330976249 |
| Brian Carroll | Athenry | Carne | Slaughtering, Cutting only | — | DAFM meat 3008 |
| Briarhill Butchers | Galway | Carne | shop=butcher | — | OSM node/2103642012 |
| Burke Meats (registered as John Burke T/A Burke Meats) | Gort | Carne | Slaughtering, Cutting only | — | DAFM meat 2594 |
| Burkes Butchers | Milltown | Carne | shop=butcher | burkesbutchers.com | OSM node/13566088416 |
| Des Moran | — | Carne | shop=butcher | — | OSM node/3929625754 |
| Divillys | — | Carne | shop=butcher | divillymeats.ie · +353 91 795 200 · info@divillymeats.com | OSM node/7964718006 |
| Enda Hayes & Sons | — | Carne | shop=butcher | — | OSM node/11154591862 |
| Eugene McEntee | Portumna | Carne | Slaughtering only | — | DAFM meat 2608 |
| Feeney's Butchers | — | Carne | shop=butcher | — | OSM node/9859161448 |
| Geraghty's Family Butcher | — | Carne | shop=butcher | — | OSM node/5098751508 |
| Herterich's Pork Butchers | Galway | Carne | shop=butcher | +353 85 872 7671 | OSM node/1729163821 |
| Hickey Meats | Galway | Carne | shop=butcher | — | OSM node/2217191372 |
| Hugh Anthony O'Donnell | Gort | Carne | Slaughtering only | — | DAFM meat 2479 |
| Mannion's Butcher | — | Carne | shop=butcher | — | OSM node/1809978654 |
| Mark's Meats | — | Carne | shop=butcher | — | OSM node/1813929455 |
| McGeough's Butchers | — | Carne | shop=butcher | — | OSM node/6918382394 |
| McGraths Butcher | — | Carne | shop=butcher | — | OSM node/1730948455 |
| Mike Walsh Butcher | — | Carne | shop=butcher | +353 91 844 023 | OSM way/331441523 |
| Monivea Butchers | — | Carne | shop=butcher | — | OSM node/1988647585 |
| O’ Connor Meat Products 2010 Ltd (registered as Liffey Meats T/A O’ Connor Meat Products 2010 Ltd) | Ballinasloe | Carne | Slaughtering, Cutting only | — | DAFM meat 401 |
| Pat Loughnane & Sons | — | Carne | shop=butcher | — | OSM node/1257321515 |
| Priority Meats | Ballinasloe | Carne | shop=butcher | — | OSM node/9995596127 |
| The Friendly Farmer (registered as Ronan Byrne T/A The Friendly Farmer) | Athenry | Carne | Slaughtering, Cutting only | — | DAFM meat 2876 |
| The Meat Market | — | Carne | shop=butcher | — | OSM node/2102030270 |
| Thomas Lydon | Maam | Carne | Slaughtering, Cutting only | — | DAFM meat 2614 |
| Tony Carroll Family Butcher | — | Carne | shop=butcher | tonycarrollfamilybutchers.ie · +353 90 964 4949 | OSM node/5141100258 |
| Tony Fahy Wholesale Meats LTD | Loughrea | Carne | Cutting only | — | DAFM meat 2386 |
| Tormeys Butchers | Galway | Carne | shop=butcher | — | OSM way/954710183 |
| William's Gate | Galway | Carne | shop=butcher | williamsgate.ie · +353 91 771 604 | OSM node/10299343232 |
| Truffle | Galway | Chocolate | shop=chocolate | www.trufflegalway.com · +353 91 456 484 | OSM node/10136105408 |
| Auntie Nellies | Galway | Dulces y repostería | shop=confectionery | — | OSM node/10676289657 |
| Candyland | — | Dulces y repostería | shop=confectionery | — | OSM node/1742824455 |
| Kenny Joes | — | Dulces y repostería | shop=confectionery | — | OSM node/11139607677 |
| Traditional Cheese Company | — | Lácteos y quesos | shop=cheese | — | OSM node/1944574632 |
| Blackrock Cottage Pantry | Galway | Otros | shop=deli | — | OSM node/1748698925 |
| European Food Store | — | Otros | shop=deli | — | OSM node/2102030226 |
| Galway Asian Foods | — | Otros | shop=deli | — | OSM node/2102298911 |
| Siopa Ionraic | — | Otros | shop=farm | — | OSM way/1475047408 |
| Spice of Life | — | Otros | shop=deli | — | OSM node/6831927469 |
| Terryland Asian Food Market | — | Otros | shop=deli | +353 91 566 849 | OSM node/2102030262 |
| The Gourmet Offensive | Galway | Otros | shop=deli | www2.tgo.ie · +353 91 865 924 | OSM node/10037867447 |
| Tribal Foods | — | Otros | shop=farm | — | OSM node/7944690125 |
| Upick Store | — | Otros | shop=deli | +353 91 581826 | OSM node/2107075591 |
| Alans Bakery | Galway | Pan y cereal | shop=bakery | alanbakeryltd@gmail.com | OSM node/2105124832 |
| BakeBox | Galway | Pan y cereal | shop=bakery | — | OSM node/1865541425 |
| Bridie Murphy's Home Bakery | Galway | Pan y cereal | shop=bakery | — | OSM node/10126780738 |
| Fabrique | — | Pan y cereal | shop=bakery | — | OSM node/7104483500 |
| Hopes Bakery & Coffee Shop | — | Pan y cereal | shop=bakery | — | OSM node/1257321230 |
| La Pause Dessert | — | Pan y cereal | shop=bakery | — | OSM node/8592670549 |
| Little Teapot Bakery | — | Pan y cereal | shop=bakery | www.littleteapotbakery.ie | OSM node/3056104044 |
| O'Connor's Bakery | Galway | Pan y cereal | shop=bakery | www.oconnorsbakery.com/c/locations/44#salthill | OSM node/9393278901 |
| O'Connors | Galway | Pan y cereal | shop=bakery | +353 91 561 757 | OSM node/1865573303 |
| O'Hehirs Bakery & Cafe | Galway | Pan y cereal | shop=bakery | — | OSM node/2103642009 |
| Walsh's Bakery & Coffee Shop | — | Pan y cereal | shop=bakery | — | OSM node/1809978666 |
| Connamara Smoke House | — | Pescado | shop=seafood | — | OSM way/287955764 |
| Duane's Fish Shop | — | Pescado | shop=seafood | — | OSM node/3903629991 |
## Connemara Smokehouse — no current source (2026-08-11)

`connemarasmokehouse.ie` returns NXDOMAIN, confirmed on 2026-08-11 by a second
route. `smokedsalmon.ie`, which search results still surface for Irish smoked
fish, now serves a domain-for-sale page and is not a producer source at all.

To resolve: confirm current activity and the productive town from an official
register or another current source. Neither dead domain supports closure.

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
| Bridewell Brewery | Clifden | bridewellbrewery.ie |
| Connemara Brewing Company | — | connemarabrewery.com |
| Galway Bay Brewery | — | galwaybaybrewery.com |
| Galway Hooker Brewery | — | galwayhooker.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
