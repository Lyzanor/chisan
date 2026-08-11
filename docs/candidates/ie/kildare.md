# Kildare — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/kildare.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/kildare>.
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

### Production signal — 84 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Juice Press Orchards | — | Bebidas sin alcohol | listed | — | FarmFinder https://farmfinder.ie/producer/juice-press-orchards |
| Ballymooney Foods Limited | Clane | Carne | Minced Meat, Meat Products Non RTE; also FarmFinder https://farmfinder.ie/producer/ballymooney-foods-wild-irish-game | — | DAFM meat 2967 |
| Bergin Family Foodstore | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/bergin-family-foodstore |
| Bergin's Food Yard | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/bergin-s-food-yard |
| Coyne Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/coyne-butchers |
| Cribbin Family Butchers | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/cribbin-family-butchers |
| Dawn Farm Foods Ltd | Naas | Carne | Meat Preparations, Meat Products RTE | — | DAFM meat 734 |
| Dawn Kildare (registered as Dawn Meats Ireland UC T/A Dawn Kildare) | Kildare | Carne | Meat Preparations | — | DAFM meat 268 |
| Gormley Family Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/gormley-family-butchers |
| Haynestown Meats Limited | Naas | Carne | Minced Meat, Meat Preparations, Meat Products RTE | — | DAFM meat 2712 |
| International Meat Ingredients Ltd (IMI Ltd) | Naas | Carne | Meat Preparations, Meat Products RTE | — | DAFM meat 757 |
| James Nolan | Kilcullen | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2332 |
| JJ Young and Sons (registered as Celbridge Meats T/A JJ Young and Sons) | Clane | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2719 |
| Kildare County Turkeys | Rathmuck | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2706 |
| McConnon Meats | Rathangan | Carne | Meat Products Non RTE | — | DAFM meat 2333 |
| Morell Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/morell-meats |
| Newbridge Foods Ltd | Newbridge | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 754 |
| Newbridge Meats Ltd | Newbridge | Carne | Minced Meat, Meat Preparations, Meat Products RTE; also FarmFinder https://farmfinder.ie/producer/mac-s-meats-newbridge | — | DAFM meat 570 |
| Niall & James O'Gorman | Castledermot | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 2653 |
| Nolan Butchers of Kilcullen | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/nolan-butchers-of-kilcullen |
| O’Brien Fine Foods UC | Naas | Carne | Meat Products RTE | — | DAFM meat 2313 |
| O'Gorman Meats Castledermot | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/1994600091 | — | FarmFinder https://farmfinder.ie/producer/o-gorman-meats-castledermot |
| Paddy Byrne Craft Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/paddy-byrne-craft-butchers |
| The Culinary Food Group (registered as TCFG Naas Limited T/A The Culinary Food Group) | Naas | Carne | Meat Products RTE, Meat Products Non RTE | — | DAFM meat 2005 |
| The Irish Biltong Company LTD | Naas | Carne | Meat Products RTE | — | DAFM meat 2968 |
| Tommy's Butchers Maynooth | Maynooth | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/354880890 | +35316286317 | FarmFinder https://farmfinder.ie/producer/tommy-s-butchers-maynooth |
| Walsh Butchers Kilcock | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/2717912987 | — | FarmFinder https://farmfinder.ie/producer/walsh-butchers-kilcock |
| Watkins Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/watkins-butchers |
| Farrington’s Brewery | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/farringtons-brewery |
| Kildare Brewing Company | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/kildare-brewing-company |
| Two Sisters Brewing | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/two-sisters-brewing |
| Donadea Organic Veg | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/donadea-organic-veg |
| Graze Dairies Ltd | Chestnut Lane Downings Prosperous | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2193 |
| Killadoon Milk (registered as Killadoon Farm Ltd) | Killadoon Celbridge Co Kildare | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2186 |
| Lily's Limited | Green Road Newbridge Co | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy 1720 |
| Bakehouse No.5 | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/bakehouse-no-5 |
| Ballyfair Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ballyfair-farm |
| Buitelaar Production (IRE) | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/buitelaar-production-ire |
| Burtown House, Co. Kildare | — | Otros | Producer; IOA Member, Organic, Irish Organic Association, remaining) | — | FarmFinder https://farmfinder.ie/producer/burtown-house-co-kildare |
| Camphill Communities of Ireland - Camphill Community Grangebeg | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/camphill-communities-of-ireland-camphill-community-grangebeg |
| Cooke, Joseph | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cooke-joseph |
| CROP | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/crop |
| Dawn Farms | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dawn-farms |
| DSG Packaging Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/dsg-packaging-ltd |
| Featherfield farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/featherfield-farm |
| Food & Drinks Vending Machine (Kildare) | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/food-and-drinks-vending-machine-kildare |
| Fused by Fiona Uyema | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/fused-by-fiona-uyema |
| Gibney's preserves | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gibney-s-preserves |
| Gorman Butchers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/gorman-butchers |
| Grabacoffee | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/grabacoffee |
| Graze diary | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/graze-diary |
| Green Isle Foods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/green-isle-foods |
| Hoffmanns Fine Foods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/hoffmanns-fine-foods |
| Jane Russells | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/jane-russells |
| Kehoe’s Happy Hens | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/kehoe-s-happy-hens |
| Kildare Farm Foods | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/kildare-farm-foods |
| Larkfield | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/larkfield |
| Lily O'Brien's Chocolates | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lily-obriens-chocolates |
| Lullymore Foods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lullymore-foods |
| Mairead Smyth | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/mairead-smyth |
| Moyallon Foods | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/moyallon-foods |
| Nellys Simply Soup | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/nellys-simply-soup |
| Nicholas Cullen, The Curragh, Co Kildare | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/nicholas-cullen-the-curragh-co-kildare |
| Nurney Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/nurney-farm |
| Ohh Goodies | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ohh-goodies |
| Pharmapac Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/pharmapac-ltd |
| Produce Vending Machine (Kildare) | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/produce-vending-machine-kildare |
| Richard Milligan | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/richard-milligan |
| Selling from farm shop, Athy, Co. Kildare | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/selling-from-farm-shop-athy-co-kildare |
| Springfield Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/springfield-farm |
| Staplestown Honesty Hut | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/staplestown-honesty-hut |
| The Dew Drop Brewhouse | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-dew-drop-brewhouse |
| The Healthy Hub | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-healthy-hub |
| Wild & Green Flower Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wild-green-flower-farm |
| Cake Bake shed | — | Pan y cereal | listed | — | FarmFinder https://farmfinder.ie/producer/cake-bake-shed |
| Crean's Place | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/crean-s-place |
| Grá Pizza | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/gr-pizza |
| Home Bake Cakes Ltd | Thomastown | Pan y cereal | craft=bakery | — | OSM node/11827258879 |
| Lekker Food Collection | Thomastown | Pan y cereal | craft=bakery; product=food | www.lekkerfoodco.ie | OSM node/8657163857 |
| Vitor's Bread Bar | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/vitor-s-bread-bar |
| Ali's Fish Shop | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/alis-fish-shop-kildare |
| East Coast Seafood | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/east-coast-seafood |
| Nick's Fish Newbridge | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/nicks-fish-newbridge-kildare |
| The Fish Market | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/the-fish-market |

### Facility or shopfront only — 41 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Amber Ring Europe LTD | Rathangan | Carne | Cutting only | — | DAFM meat 3009 |
| Ashbourne Meat Processors | Naas | Carne | Cutting only | — | DAFM meat 512 |
| Birds Eye Ireland Limited | Naas | Carne | Meat Products Non RTE; national-scale brand | — | DAFM meat 2008 |
| Blair House Charcuterie | Rathmore | Carne | shop=butcher | — | OSM node/10582211896 |
| Butcher's Kitchen | — | Carne | shop=butcher | — | OSM node/745996344 |
| Byrne's | — | Carne | shop=butcher | — | OSM node/635247454 |
| Colm Coffey's | — | Carne | shop=butcher | +353 45 890844 | OSM node/463710882 |
| Coyne Family Butcher | — | Carne | shop=butcher | — | OSM node/335717500 |
| Des Byrne | Skerries | Carne | shop=butcher | — | OSM way/370683708 |
| Feighcullen Farm (registered as William Gray T/A Feighcullen Farm) | Rathangan | Carne | Slaughtering only | — | DAFM meat 2898 |
| Finbar Cribben | Leixlip | Carne | Cutting only | — | DAFM meat 2720 |
| Fitzpatricks | Celbridge | Carne | shop=butcher | — | OSM node/506835403 |
| Hyland Brothers | — | Carne | shop=butcher | — | OSM node/330960263 |
| JJ Youngs | — | Carne | shop=butcher | — | OSM way/263420755 |
| John Ryan | — | Carne | shop=butcher | — | OSM node/2717809553 |
| Leixlip Butchers | — | Carne | shop=butcher | — | OSM node/1558721338 |
| Malones Foodhall | Newbridge | Carne | shop=butcher | — | OSM node/1199380367 |
| Margaret McDonnell | The Curragh | Carne | Slaughtering, Cutting only | — | DAFM meat 2824 |
| Max's Butchers | Newbridge | Carne | shop=butcher | — | OSM node/1276229117 |
| McCarthy Butchers | Rathmore | Carne | shop=butcher | — | OSM node/10582119857 |
| Moyvalley Meats (registered as Moyvalley Meats (IRL) UC  T/A Moyvalley Meats) | Broadford | Carne | Slaughtering, Cutting only | — | DAFM meat 370 |
| O'Rurkes Butcher | — | Carne | shop=butcher | — | OSM node/1107684880 |
| Paddy the Butcher | Kildare | Carne | shop=butcher | — | OSM node/9130507747 |
| Phoenix Enterprises | Naas | Carne | Cutting only | — | DAFM meat 2973 |
| Sean Melia Butcher | — | Carne | shop=butcher | — | OSM node/979920581 |
| Tom Baker's | — | Carne | shop=butcher | — | OSM node/6568653469 |
| Tom Gough and Sons | — | Carne | shop=butcher | — | OSM node/1128909431 |
| Wakins Butcher | — | Carne | shop=butcher | — | OSM node/644007148 |
| Lindt | — | Chocolate | shop=chocolate | — | OSM node/11101358511 |
| Elite Confectionery | — | Dulces y repostería | shop=confectionery | — | OSM way/41720772 |
| Marlee's | Castledermot | Dulces y repostería | shop=confectionery | — | OSM way/1006210875 |
| Tirlán Limited | Ballytore Athy Co Kildare | Lácteos y quesos | Bovine, DRINKING MILK PLANT; national-scale brand | — | DAFM dairy IE1403 |
| Mary-Kathryns Deli | — | Otros | shop=deli | — | OSM node/9467330130 |
| Pawet & Gawet | Newbridge | Otros | shop=deli | — | OSM node/1199341934 |
| Bradbury's | Newbridge | Pan y cereal | shop=bakery | — | OSM node/615216190 |
| Brigid's Cake Room | — | Pan y cereal | shop=bakery | www.brigidscakeroom.ie | OSM node/11284926922 |
| Decobake | — | Pan y cereal | shop=bakery | — | OSM node/2147730972 |
| Facchino's Cafe Bakery | — | Pan y cereal | shop=bakery | — | OSM node/13075659802 |
| Imperial | — | Pan y cereal | shop=bakery | — | OSM node/640764973 |
| Natural Bakery | Maynooth | Pan y cereal | shop=bakery | thenaturalbakery.ie · +353 1 5048 357 · maynoothtnb@gmail.com | OSM node/788664368 |
| No. 1 Bakery | — | Pan y cereal | shop=bakery | — | OSM node/7106586244 |
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
| Kildare Brewing Co. | — | kildarebrewing.ie |
| Rye River Brewing Company | — | ryeriverbrewingco.com |
| The Dew Drop Inn & Brewing Company | — | dewdropinn.ie |
| Trouble Brewing | — | troublebrewing.ie |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
