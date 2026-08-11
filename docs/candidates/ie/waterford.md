# Waterford — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/munster/waterford.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/waterford>.
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

### Production signal — 61 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Billy Burke Fish & Poultry | — | Carne | listed | — | FarmFinder https://farmfinder.ie/producer/billy-burke-fish-and-poultry |
| Convenience Foods (registered as Dawn Meats Ireland T/A Convenience Foods) | Kilmacthomas | Carne | Minced Meat, Meat Preparations | — | DAFM meat 318 |
| Dawn Grannagh (registered as Dawn Meats Ireland UC T/A Dawn Grannagh) | Grannagh | Carne | Meat Products Non RTE | — | DAFM meat 350 |
| Fresh Food Courtyard | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/fresh-food-courtyard |
| Jack Molloy & Son | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/jack-molloy-and-son |
| McGrath's Family Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/mcgrath-s-family-butchers |
| Molloy's Butchers Ardkeen | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/molloy-s-butchers-ardkeen |
| Murphy Quality Meats (registered as Billy Murphy T/A Murphy Quality Meats) | Waterford | Carne | Meat Preparations, Meat Products Non RTE | — | DAFM meat 2618 |
| O'Flynn Meats | Gracedieu | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE; also OSM node/11883619465 | — | DAFM meat 2477 |
| Philip Egan Meats | Waterford | Carne | Minced Meat, Meat Preparations | — | DAFM meat 2827 |
| Coffee House Lane | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/coffee-house-lane |
| Dugarvan Brewing Company | — | Cerveza | Producer; Beer, Cider, Spirits, Wine | — | FarmFinder https://farmfinder.ie/producer/dugarvan-brewing-company |
| Hopfully Brewing | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/hopfully-brewing |
| Metalman Brewing | — | Cerveza | listed | — | FarmFinder https://farmfinder.ie/producer/metalman-brewing |
| Curraghmore Whiskey Ltd | — | Destilados y licores | listed | — | FarmFinder https://farmfinder.ie/producer/curraghmore-whiskey-ltd |
| O'Connell Whiskey Merchants | — | Destilados y licores | listed | — | FarmFinder https://farmfinder.ie/producer/oconnell-whiskey-merchants |
| The Old Distillery | — | Destilados y licores | craft=distillery | — | OSM way/775650532 |
| GIY Organic Veg Box | — | Fruta y verdura | listed | — | FarmFinder https://farmfinder.ie/producer/giy-organic-veg-box |
| Baldwin's Farmhouse Ice Cream (registered as Mr Thomas Baldwin) | Killeenagh, Knockanore, Co. Waterford | Helados | Bovine, SMALL - MEDIUM | — | DAFM dairy IE1943 |
| Ballyconnery Bó (registered as Carmel & John Kiely) | Currabaha_x000D_ Colligan_x000D_ Dungarvan_x000D_ Co | Lácteos y quesos | Bovine, SMALL | — | DAFM dairy IE2195 |
| Dawn International Ltd | Confederation House Waterford Business | Lácteos y quesos | N/A, TRADER | — | DAFM dairy 1709 |
| Early Bird Free Range Eggs | — | Lácteos y quesos | Producer; Dairy, Eggs, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/early-bird-free-range-eggs |
| Freezin' Friesian (registered as Lisfield Dairy Ltd) | Ballyhussa Kilmacthomas Co Waterford | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2151 |
| Irish Gourmet Butter (registered as William Sharpe) | Unit 8, 9 & | Lácteos y quesos | Bovine, SMALL - MEDIUM | — | DAFM dairy IE2128 |
| Knockanore Farmhouse Cheese Co Ltd | Ballyneety Knockanore Co Waterford | Lácteos y quesos | Bovine, Ovine, SMALL - MEDIUM; also FarmFinder https://farmfinder.ie/producer/knockanore-cheese | — | DAFM dairy IE1837 |
| Mahon Valley Milk Ltd | Union Road Kilmacthomas Co | Lácteos y quesos | Bovine, Small | — | DAFM dairy IE2212 |
| Aishu Patisserie | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/aishu-patisserie |
| Blackwater Distillery | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/blackwater-distillery |
| Clashganny Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/clashganny-farm |
| Clinton, Olivia | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/clinton-olivia |
| Colette O' Connell | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/colette-o-connell |
| E Flahavan & Sons Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/e-flahavan-and-sons-ltd |
| East Waterford Beekeepers Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/east-waterford-beekeepers-association |
| Flavahans | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/flavahans |
| Garraí Mara Organic Farm | — | Otros | Farm; Organic, Vegetables, Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/garra-mara-organic-farm |
| Ginger & Co. | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ginger-and-co |
| GIY | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/giy |
| Glenpatrick | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/glenpatrick |
| Granny Maddocks Pantry | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/granny-maddocks-pantry |
| GROW HQ | — | Otros | Farm; Farm Gate, Farm Shops Ireland | — | FarmFinder https://farmfinder.ie/producer/grow-hq |
| Haven lodge hens and ducks | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/haven-lodge-hens-and-ducks |
| J. O'Doherty | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/j-odoherty-waterford |
| Lismore Food Company | — | Otros | Producer; SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/lismore-food-company |
| Meitheal Trá na Rinne Teo | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/meitheal-tr-na-rinne-teo |
| Newbard Organic Farm Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/newbard-organic-farm-ltd |
| Niamh's Trawler Catch | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/niamhs-trawler-catch-waterford |
| PineGroveCottage | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/pinegrovecottage |
| The Little Flower House | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/the-little-flower-house |
| Tiramisu Da' Costa Family | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/tiramisu-da-costa-family |
| Viking Irish Drinks | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/viking-irish-drinks |
| Waterford City Saturday Market | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/waterford-city-saturday-market |
| Whole Living Nutrition | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/whole-living-nutrition |
| Beatha Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/beatha-bakery |
| Dún Artisan Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/d-n-artisan-bakery |
| Seagull Bakery | Waterford | Pan y cereal | listed; also OSM node/12602170227 | www.seagullbakeryshop.com | FarmFinder https://farmfinder.ie/producer/seagull-bakery |
| The Bakehouse Tramore | — | Pan y cereal | Producer; Bread & Bakery, Artisan Bread, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/the-bakehouse-tramore |
| Walsh's Bakery | — | Pan y cereal | Producer; Bread & Bakery, Farm Gate, remaining), About; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/walsh-s-bakery |
| Dungarvan Shellfish Ltd | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/dungarvan-shellfish-ltd |
| Flanagan Fish Merchant | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/flanagan-fish-merchant-waterford |
| Ronan's Fish Shop | — | Pescado | listed | — | FarmFinder https://farmfinder.ie/producer/ronans-fish-shop-waterford |
| Legacy Cider | — | Sidra | listed | — | FarmFinder https://farmfinder.ie/producer/legacy-cider |

### Facility or shopfront only — 29 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| ABP Waterford (registered as Anglo Beef Processors Ireland UC T/A ABP Waterford) | Waterford | Carne | Slaughtering, Cutting only; national-scale brand | — | DAFM meat 344 |
| Billy Murphy Craft Butchers | Waterford | Carne | shop=butcher | www.billymurphy.ie | OSM node/7985139815 |
| Cappoquin Meats (registered as O'Donoghue Meats Ltd T/A Cappoquin Meats) | Cappoquin | Carne | Cutting only | — | DAFM meat 2779 |
| Country Pork | — | Carne | shop=butcher | — | OSM node/912419647 |
| Dawn Meats Ltd. | Kilmacthomas | Carne | Minced Meat; national-scale brand; also FarmFinder https://farmfinder.ie/producer/dawn-meats-group | — | DAFM meat 2037 |
| Dawn Pork & Bacon (registered as Queally Pig Slaughtering Ltd T/A Dawn Pork & Bacon) | Grannagh | Carne | Meat Products Non RTE; national-scale brand; also FarmFinder https://farmfinder.ie/producer/dawn-pork-and-bacon | — | DAFM meat 332 |
| Dunphy's Butchers | Waterford | Carne | shop=butcher | www.waterfordshoppingcentrelisduggan.com/dunphys | OSM node/660310485 |
| James Whelan | — | Carne | shop=butcher | — | OSM node/11248355855 |
| Michael McGrath Butchers | Lismore | Carne | Slaughtering only | — | DAFM meat 2611 |
| Molloys Butchers | Waterford | Carne | shop=butcher | +353 51 375 333 | OSM node/5556721530 |
| O'Reillys Butchers | Kilmacthomas | Carne | Slaughtering only | — | DAFM meat 2612 |
| Riellys | — | Carne | shop=butcher | — | OSM node/662578501 |
| Victualler Tom Halloran | — | Carne | shop=butcher | — | OSM node/756916099 |
| Widgers Butchers | Waterford | Carne | shop=butcher | — | OSM node/11874644020 |
| Carter's Little Sweet Shop | Waterford | Dulces y repostería | shop=confectionery | thestableyard.ie | OSM node/10011671007 |
| Shake Shack | — | Dulces y repostería | shop=confectionery | — | OSM node/561242430 |
| Knockalara Farmhouse Cheese | — | Lácteos y quesos | shop=cheese | — | OSM node/7785521933 |
| Sheridans Cheesemongers | — | Lácteos y quesos | shop=cheese | sheridanscheesemongers.com · +353 51 874 620 · ardkeenqfs@sheridanscheesemongers.com | OSM node/5574268056 |
| Carbery | — | Otros | listed; national-scale brand | — | FarmFinder https://farmfinder.ie/producer/carbery |
| Lismore Farmers Market | Lismore | Otros | shop=farm | — | OSM node/10857814873 |
| The Stable Yard Deli | Waterford | Otros | shop=deli | thestableyard.ie/the-mediterranean-deli-2 | OSM node/10011657493 |
| Blaa Boy | Waterford | Pan y cereal | shop=bakery | — | OSM node/4018006230 |
| George Harrington | — | Pan y cereal | shop=bakery | — | OSM node/13256061594 |
| Hickey's Bakery | — | Pan y cereal | shop=bakery | — | OSM node/8890618843 |
| O'Gorman's | Clonmel | Pan y cereal | shop=bakery | — | OSM node/7833791183 |
| Sunny South Yeast Bakery & Catering | — | Pan y cereal | shop=bakery | — | OSM node/9602100597 |
| The Italian Bakery | Waterford | Pan y cereal | shop=bakery | thestableyard.ie/italian-bakery | OSM node/10011652111 |
| Walsh's Bakehouse | — | Pan y cereal | shop=bakery | — | OSM node/8945354327 |
| Fine Fins | — | Pescado | shop=seafood | — | OSM node/912419632 |
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
| Dungarvan Brewing Company | — | dungarvanbrewingcompany.com |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
