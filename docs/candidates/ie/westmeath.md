# Westmeath — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/leinster/westmeath.csv`. Nothing recorded here is verified or
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
- FarmFinder Ireland county listing — <https://farmfinder.ie/county/westmeath>.
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

### Production signal — 55 leads

Registered for making a product, mapped with a production craft tag, or
listed as a producer by the regional directory.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Richmount Cordial Company | — | Bebidas sin alcohol | Producer; Food Culture Ireland | — | FarmFinder https://farmfinder.ie/producer/richmount-cordial-company |
| The Irish Craft Soda Co. | — | Bebidas sin alcohol | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/the-irish-craft-soda-co/ |
| Bell Lane Coffee | — | Café | Beverage; also FarmFinder https://farmfinder.ie/producer/bell-lane-coffee-limited | — | Midlands directory https://www.midlandsireland.ie/producers_directory/bell-lane-coffee/ |
| Red Rooster Coffee | — | Café | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/red-rooster-coffee/ |
| Slow Roast – Sandwiches & Coffee | — | Café | Prepared Foods | — | Midlands directory https://www.midlandsireland.ie/producers_directory/slow-roast-sandwiches-coffee/ |
| Co. Westmeath | — | Carne | Producer; IOA Member, Organic, Beef, Lamb; also FarmFinder https://farmfinder.ie/producer/westmeath-lamb; also FarmFinder https://farmfinder.ie/producer/produce-vending-machine-westmeath | — | FarmFinder https://farmfinder.ie/producer/co-westmeath |
| CR Tormey & Sons Mullingar | — | Carne | Producer; Irish Butchers Guild, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/cr-tormey-and-sons-mullingar |
| Greene Farm (registered as Greene Farm Fine Foods Limited T/A Greene Farm) | Rathowen | Carne | Meat Products RTE | — | DAFM meat 838 |
| Herterich Artisan Butchers ltd | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/herterich-artisan-butchers-ltd |
| JJ Quinn Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/jj-quinn-butchers |
| Lenihan's Butchers | — | Carne | Producer; Beef, Lamb, Pork, Poultry; also OSM node/2134155281 | — | FarmFinder https://farmfinder.ie/producer/lenihan-s-butchers |
| Lough Owel Organic Farm | — | Carne | Meats, Organic | — | Midlands directory https://www.midlandsireland.ie/producers_directory/lough-owel-organic-farm/ |
| Mr Crumb (registered as Quality Irish Food Ltd T/A Mr Crumb) | Mullingar | Carne | Meat Products Non RTE | — | DAFM meat 152 |
| Murtagh's Organic Farm | — | Carne | Farm; Organic, Beef, Lamb, Pork | — | FarmFinder https://farmfinder.ie/producer/murtagh-s-organic-farm |
| Pigs on the Green (registered as Fergus Dunne T/A Pigs on the Green) | Tyrellspass | Carne | Minced Meat, Meat Preparations, Meat Products Non RTE | — | DAFM meat 3030 |
| Seamus Bracken Butcher Shop | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | FarmFinder https://farmfinder.ie/producer/seamus-bracken-butcher-shop |
| Troy Meats | — | Carne | Producer; Beef, Lamb, Pork, Poultry; via Irish Meat Producers Directory | — | FarmFinder https://farmfinder.ie/producer/troy-meats |
| Waldron Family Meats | — | Carne | Meats | — | Midlands directory https://www.midlandsireland.ie/producers_directory/waldron-family-meats/ |
| Balliskeen House Artisan Produce | — | Comida preparada | Prepared Foods, Preserves | — | Midlands directory https://www.midlandsireland.ie/producers_directory/balliskeen-house-artisan-produce/ |
| Bastion Kitchen | — | Comida preparada | Prepared Foods | — | Midlands directory https://www.midlandsireland.ie/producers_directory/bastion-kitchen/ |
| Kilbeggan Organic Foods | — | Comida preparada | Organic, Prepared Foods | — | Midlands directory https://www.midlandsireland.ie/producers_directory/kilbeggan-organic-foods/ |
| Fore Distillery and Barrel and Bean Cafe | — | Destilados y licores | Beverage; also FarmFinder https://farmfinder.ie/producer/fore-distillery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/fore-distillery-and-barrel-and-bean-cafe/ |
| Kilbeggan Distillery | — | Destilados y licores | Beverage | — | Midlands directory https://www.midlandsireland.ie/producers_directory/kilbeggan-distillery/ |
| An Olivia Chocolate | — | Dulces y repostería | Confectionery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/an-olivia-chocolate/ |
| Bon Chocolatiers | — | Dulces y repostería | Confectionery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/bon-chocolatiers/ |
| Kilbeggan Handmade Chocolate Cafe | — | Dulces y repostería | Confectionery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/kilbeggan-handmade-chocolate-cafe/ |
| Sugar Plum Sweetery | — | Dulces y repostería | Confectionery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/sugar-plum-sweetery/ |
| An Ghrian Glas Farm | — | Fruta y verdura | Organic, Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/an-ghrian-glas-farm/ |
| Balrath West Farm | — | Huevos | listed; Eggs, Farm Gate, yourhonestybox.com | — | FarmFinder https://farmfinder.ie/producer/balrath-west-farm |
| Barbavilla Dairy | — | Lácteos y quesos | Dairy | — | Midlands directory https://www.midlandsireland.ie/producers_directory/barbavilla-dairy/ |
| Bonny Bó (registered as Clonbonny Dairies Ltd) | Clonbonny Athlone Co Westmeath | Lácteos y quesos | B, C, O, SMALL | — | DAFM dairy IE2188 |
| Our Creamery (registered as Peter Pavlov) | Barba Villa Demesne, Collinstown, | Lácteos y quesos | Bovine & Caprine, SMALL | — | DAFM dairy IE2169 |
| Ballymore Honey | — | Miel | Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/ballymore-honey/ |
| Honey Harvest | — | Miel | listed | — | FarmFinder https://farmfinder.ie/producer/honey-harvest |
| Killucan Honey Farm | — | Miel | Produce | — | Midlands directory https://www.midlandsireland.ie/producers_directory/killucan-honey-farm/ |
| Athlone | — | Otros | Producer; IOA Member, Organic | — | FarmFinder https://farmfinder.ie/producer/athlone |
| Ballard Organic Farm - Pat Lalor | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/ballard-organic-farm-pat-lalor |
| Butler, Declan | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/butler-declan |
| Cornahir Dexter - David Couper | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/cornahir-dexter-david-couper |
| Glenidan Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/glenidan-organic-farm |
| Irish Organic Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/irish-organic-association |
| Lake County Association | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/lake-county-association |
| Loughpark Farms | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/loughpark-farms |
| Neo's Covers | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/neo-s-covers |
| OâRourke, Ken | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/o-rourke-ken |
| OâSullivan, Rose | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/o-sullivan-rose |
| Rathcam Organic Farm | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/rathcam-organic-farm |
| Sweet Rose Remedies | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/sweet-rose-remedies |
| Wines Direct Ltd | — | Otros | listed | — | FarmFinder https://farmfinder.ie/producer/wines-direct-ltd |
| BreaDelicious | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | FarmFinder https://farmfinder.ie/producer/breadelicious |
| Magico Bakery | — | Pan y cereal | Bakery; also OSM node/10004186971 | — | Midlands directory https://www.midlandsireland.ie/producers_directory/magico-bakery/ |
| Novel-T Cakes | — | Pan y cereal | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/novel-t-cakes/ |
| Rosaleen’s Kitchen | — | Pan y cereal | Bakery | — | Midlands directory https://www.midlandsireland.ie/producers_directory/rosaleens-kitchen/ |
| The Fish Market | — | Pescado | Producer; Seafood | — | FarmFinder https://farmfinder.ie/producer/the-fish-market-westmeath |
| Willies Seafood | — | Pescado | Producer; Seafood, SuperValu Food Academy | — | FarmFinder https://farmfinder.ie/producer/willies-seafood |

### Facility or shopfront only — 28 leads

An abattoir, cutting plant or retail shopfront. The source places food
activity here but establishes no production of an own sellable product, so these
need the heavier triage: many will turn out to process for other businesses or to
be resale only.

| Lead | Town | Category | Source signal | Contact | Ref |
|---|---|---|---|---|---|
| Cannon and Cole | — | Carne | shop=butcher | — | OSM node/4874378779 |
| Daly's Family Butchers | Tyrrellspass | Carne | shop=butcher | — | OSM node/14052027179 |
| Dawn Meats Kilbeggan (registered as Dawn Meats Ireland UC T/A Dawn Meats Kilbeggan) | Kilbeggan | Carne | Cutting only; national-scale brand | — | DAFM meat 574 |
| Dunnings Traditional Butcher | — | Carne | shop=butcher | +353 90 649 4480 | OSM node/11079423540 |
| Horan’s Pork | — | Carne | shop=butcher | — | OSM way/923909616 |
| Hugh Murray | Kilbeggan | Carne | Slaughtering only | — | DAFM meat 2624 |
| Hynes Quality Meats | — | Carne | shop=butcher | — | OSM node/11070973543 |
| James McBride | — | Carne | shop=butcher | — | OSM node/8541054354 |
| Joe Tynan | Mullingar | Carne | Slaughtering only | — | DAFM meat 2688 |
| John Coll Butchers LTD | Delvin | Carne | Slaughtering only | — | DAFM meat 2975 |
| John Gillivan's Moate Meats | — | Carne | shop=butcher | — | OSM way/1088380143 |
| John Quinn | Kinnegad | Carne | Slaughtering only | — | DAFM meat 3029 |
| Kepak Kilbeggan Unlimited Company | Kilbeggan | Carne | Slaughtering only; national-scale brand | — | DAFM meat 2007 |
| L & N Family Butcher | — | Carne | shop=butcher | — | OSM node/8617717254 |
| L. Claffey | — | Carne | shop=butcher | — | OSM node/13988092188 |
| Pat Smith Craft Butcher | — | Carne | shop=butcher | — | OSM node/11059789309 |
| Peter Gillivan & Son | — | Carne | shop=butcher | — | OSM way/1520888771 |
| Scally's Family Butcher | — | Carne | shop=butcher | — | OSM node/3095771584 |
| Sheelin Meats | — | Carne | shop=butcher | www.sheelinmeats.ie · +353 44 934 1664 | OSM node/13109364138 |
| Simon's Craft Butcher | — | Carne | shop=butcher | — | OSM node/3076499241 |
| Troys Abattoir Limited | Mullingar | Carne | Slaughtering only | — | DAFM meat 2663 |
| Tynan's | — | Carne | shop=butcher | — | OSM node/3127806748 |
| McGrath's Sweet Shop | — | Dulces y repostería | shop=confectionery | — | OSM way/303386948 |
| Mr Simms Olde Sweet Shoppe | — | Dulces y repostería | shop=confectionery | — | OSM way/303029682 |
| S. Mactréinfir | — | Dulces y repostería | shop=confectionery | — | OSM way/303375713 |
| Celebration Cakes | — | Pan y cereal | shop=bakery | — | OSM way/301033362 |
| Miller & Cook | — | Pan y cereal | shop=bakery | — | OSM way/303383779 |
| O’Hehirs | — | Pan y cereal | shop=bakery | — | OSM node/8617703196 |
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
| Dead Centre Brewing | — | deadcentrebrewing.com |

## Remaining search work

- The official establishment registers (DAFM approved establishments, FSAI
  approved food premises) have not been scoped for this county. They are the
  exhaustive-registry lane and nothing here substitutes for them.
- No category outside the ones named above has been swept for this county.
