# Galway — open leads (2026-08-11)

Discovery workspace for unresolved producer leads. Target CSV:
`data/csv/ie/connacht/galway.csv`. Nothing here is verified or approved
for publication. Resolve each lead under the normal CSV and evidence workflow
and prune it from this file.

## Sourcing (2026-08-11)

Sources, all read 2026-08-11:

- DAFM registers of approved meat establishments and of milk and dairy
  establishments (the latter published 17 July 2026), from
  <https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/dafm-approved-establishments/>.
- FSAI list of HSE-approved establishments,
  <https://oapi.fsai.ie/HSEApprovedEstablishments.aspx>.
- FarmFinder Ireland, <https://farmfinder.ie/county/galway>, plus each producer
  page for its structured website, coordinates and upstream source.
- Midlands Food & Drink Directory,
  <https://www.midlandsireland.ie/food-and-drink-directory/> (Laois, Longford,
  Offaly and Westmeath only).
- OpenStreetMap food-production and food-shop tags via Overpass.

Every website below was resolved and probed on 2026-08-11: a URL that returned
NXDOMAIN, was unreachable, or was a mangled address such as
`http://info@example.ie` has been removed rather than carried, because a
directory keeps publishing a link long after the domain lapses. A 403 is recorded
as alive, not dead.

Ceilings. A register approval proves the establishment is registered for that
activity at that address on the published date — not a current own-brand offer,
a public contact, remote ordering, or that it sells to the public. FarmFinder's
structured fields (website, coordinates, the upstream directory it cites) are
usable, but its prose is auto-generated and must never be copied into
`descripcion`. The Midlands directory is self-submitted. An OSM tag proves only
what a mapper recorded. Every entry here is still a `hold`.

`Municipio?` is a candidate, not a decision: where the source gave no town it is
the nearest settlement to the published coordinates, with the distance shown.
Confirm it against the producer's own address before it enters a CSV.

Category is the register activity or tag mapped onto the shared registry — a
starting guess. A trailing `?` means it was inferred from the trade name or the
domain because the source stated none.

A `⚠` on a website means the domain shares no word with the trade name. That is
often legitimate — Drioglann Loch Measc trades as Lough Mask Distillery, Con Traas
as The Apple Farm — but it is also what a parent company, a stockist or a
mis-scrape looks like, so check it before copying the URL into `web`.

Removed in this pass as out of scope: national-scale brands, hospitality
(cafés, restaurants, pubs), retail and forecourt names, resale-only shop tags
(delicatessen, confectioner, cheesemonger), abattoir or cutting-plant approvals
with no own offer and no directory backing, and bare OSM nodes carrying no
website, phone or email to verify against.

## Ready to verify — 21

A live own website plus a municipio candidate: one fetch of that site should settle identity, activity, location and remote ordering.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Brady's Butchers Athenry | Athenry (nearest, 0.4 km) | Carne | www.bradysbutchers.com | (091) 844 009 | 53.299866, -8.752421 | [FarmFinder](https://farmfinder.ie/producer/brady-s-butchers-athenry); via Associated Craft Butchers of Ireland |
| Burkes Butchers | Milltown | Carne | burkesbutchers.com | — | 52.1447423, -9.7180624 | OSM node/13566088416 |
| Connemara Mountain Lamb | Galway (nearest, 0.3 km) | Carne | www.nationalparks.ie/connemara ⚠ | (095) 41054 | 53.272717, -9.053647 | [FarmFinder](https://farmfinder.ie/producer/connemara-mountain-lamb-co-galway); via Irish Organic Association |
| Divillys | Oranmore (nearest, 3.6 km) | Carne | divillymeats.ie | +353 91 795 200 · info@divillymeats.com | 53.2986816, -8.9240286 | OSM node/7964718006 |
| McDonagh Butchers Kilkerrin | Menlo (nearest, 2.6 km) | Carne ? | www.mcgrealsfoods.ie ⚠ | (091) 753 088 | 53.309853, -9.023964 | [FarmFinder](https://farmfinder.ie/producer/mcdonagh-butchers-kilkerrin); via Associated Craft Butchers of Ireland |
| Grá Chocolates | Galway (nearest, 3.6 km) | Chocolate ? | grachocolates.com/collections/shop | 085 229 4653 | 53.291041899999996, -9.0047037 | [FarmFinder](https://farmfinder.ie/producer/gr-chocolates); via Bord Bia Origin Green |
| Truffle | Galway | Chocolate | www.trufflegalway.com | +353 91 456 484 | 53.2736619, -9.0529748 | OSM node/10136105408 |
| Ahascragh Distillers Ltd | Ahascragh (nearest, 0.4 km) | Destilados y licores ? | ahascraghdistillery.com | (090) 968 8935 | 53.396838599999995, -8.3354552 | [FarmFinder](https://farmfinder.ie/producer/ahascragh-distillers-ltd); via Bord Bia Origin Green |
| Tribe Irish Gin School | Galway | Destilados y licores | tribegin.ie | — | 53.2612305, -9.0744791 | OSM node/10207487947 |
| Terryland Fruit & Veg Market | Galway (nearest, 1.4 km) | Fruta y verdura | terrylandfruitandveg.com | (091) 564 495 | 53.283328, -9.041877 | [FarmFinder](https://farmfinder.ie/producer/terryland-fruit-and-veg-market) |
| Leahy Beekeeping | Loughnavalley (nearest, 7.2 km) | Miel ? | leahybeekeeping.com | 083 478 0022 | 53.508932, -7.628425 | [FarmFinder](https://farmfinder.ie/producer/leahy-beekeeping); via SuperValu Food Academy |
| A NATURAL LIFE by Dr Suraya Diaz | Caltra (nearest, 4.8 km) | Otros | www.naturallifebydrdiaz.com | (091) 804 998 | 53.454384, -8.370614 | [FarmFinder](https://farmfinder.ie/producer/a-natural-life-by-dr-suraya-diaz); via Organic Trust |
| Barry John Sausages | Galway (nearest, 0.5 km) | Otros | www.barryjohnsausages.ie | — | 53.2707, -9.0568 | [FarmFinder](https://farmfinder.ie/producer/barry-john-sausages); via Bord Bia Origin Green |
| Blakes Always Organic Ltd | Moycullen (nearest, 3.7 km) | Otros | blakesalwaysorganic.ie | (071) 964 0537 | 53.346645, -9.125971 | [FarmFinder](https://farmfinder.ie/producer/blakes-always-organic-ltd); via Food Culture Ireland |
| Gran Grans Foods LTD | Kilcolgan (nearest, 0.3 km) | Otros | grangransfoods.ie | 087 234 0345 | 53.2114334, -8.8704746 | [FarmFinder](https://farmfinder.ie/producer/gran-grans-foods-ltd); via Bord Bia Origin Green |
| GreenEarth Organics | Galway (nearest, 1.8 km) | Otros | www.greenearthorganics.ie | (091) 793 768 | 53.284701, -9.065346 | [FarmFinder](https://farmfinder.ie/producer/greenearth-organics-co-galway); via Irish Organic Association |
| Nibbed | Athenry (nearest, 2.7 km) | Otros | www.nibbed.ie | — | 53.2871605, -8.7805351 | [FarmFinder](https://farmfinder.ie/producer/nibbed); via Bord Bia Origin Green |
| Saraâs Choice | Moycullen (nearest, 0.3 km) | Otros | www.saraschoice.com | (091) 868 272 | 53.3403523, -9.1835858 | [FarmFinder](https://farmfinder.ie/producer/sara-s-choice); via Organic Trust |
| Sheridans Cheesemongers Box | Galway | Otros | www.sheridanscheesemongers.com | +353 91 564 829 | — | [FarmFinder](https://farmfinder.ie/producer/sheridans-cheesemongers-box); via FarmFinder Team |
| The Multidimensional Natural Medicine Institute | Caltra (nearest, 4.7 km) | Otros | naturallife.institute | (091) 804 998 | 53.454559499999995, -8.3711834 | [FarmFinder](https://farmfinder.ie/producer/the-multidimensional-natural-medicine-institute); via Organic Trust |
| O'Connor's Bakery | Galway | Pan y cereal | www.oconnorsbakery.com/c/locations/44#salthill | — | 53.2614348, -9.0743267 | OSM node/9393278901 |

## Needs one more fact — 43

Either an own website or a register-backed municipio, but not both.

| Lead | Municipio? | Category | Website | Contact | Coordinates | Source |
|---|---|---|---|---|---|---|
| Beard Brothers Meat LTD | Loughrea | Carne | — | — | — | DAFM meat 3044 |
| Burke Butchers Kinvara | Claregalway (nearest, 3.2 km) | Carne | — | (091) 637 250 | 53.349461, -8.990731 | [FarmFinder](https://farmfinder.ie/producer/burke-butchers-kinvara); via Associated Craft Butchers of Ireland |
| Cope Community Catering | Unit 5 | Carne | — | — | — | FSAI HSE 4086 |
| CR Tormey & Sons Galway | Galway (nearest, 1.3 km) | Carne | — | (091) 564 067 | 53.269543, -9.068276 | [FarmFinder](https://farmfinder.ie/producer/cr-tormey-and-sons-galway); via Irish Butchers Guild |
| Curleys Quality Foods | CarrowbrowneCastlegar | Carne | — | — | — | FSAI HSE 4061 |
| Divilly's Ltd. | Oranmore | Carne | — | — | — | DAFM meat 576 |
| Duffy's Excel Warehouse | Ballinasloe (nearest, 2.4 km) | Carne | — | (090) 967 6054 | 53.345407, -8.239788 | [FarmFinder](https://farmfinder.ie/producer/duffy-s-excel-warehouse); via Associated Craft Butchers of Ireland |
| Galmere Fresh Foods Ltd. | Ballybrit Upper Industrial EstateMonivea | Carne | — | — | — | FSAI HSE 4041 |
| Geraghty Butchers | Galway (nearest, 4.8 km) | Carne | — | (090) 967 9414 | 53.2349, -9.010399 | [FarmFinder](https://farmfinder.ie/producer/geraghty-butchers); via Associated Craft Butchers of Ireland |
| Gourmet Sandwiches Ltd. | DerrybrienLoughrea | Carne | — | — | — | FSAI HSE 4062 |
| Gourmet Tart Company Ltd | Unit 1 Block 13Ballybane Industrial Esta | Carne | — | — | — | FSAI HSE 4051 |
| Justin Flannery | Peterswell | Carne | — | — | — | DAFM meat 2558 |
| Loughnane Family Butchers | Loughrea (nearest, 0.8 km) | Carne | — | (091) 841 229 | 53.19046, -8.572047 | [FarmFinder](https://farmfinder.ie/producer/loughnane-family-butchers); via Associated Craft Butchers of Ireland |
| M.P.G Foods Ltd | CregboyCregboyClaregalway | Carne | — | — | — | FSAI HSE 4009 |
| McGeough's Connemara Fine Foods | Oughterard | Carne | — | — | — | DAFM meat 2438 |
| McGrath Butchers Mervue | Menlo (nearest, 1.8 km) | Carne ? | — | (091) 757 790 | 53.320525, -9.075027 | [FarmFinder](https://farmfinder.ie/producer/mcgrath-butchers-mervue); via Associated Craft Butchers of Ireland |
| Meats Direct (registered as Dermot Duffy T/A Meats Direct) | Gort | Carne | — | — | — | DAFM meat 2958 |
| Mike Walsh Butchers | Athenry (nearest, 1 km) | Carne ? | — | (091) 844 023 | 53.311025, -8.74474 | [FarmFinder](https://farmfinder.ie/producer/mike-walsh-butchers); via Associated Craft Butchers of Ireland |
| Moran's Meats Clifden | Clifden (nearest, 1.5 km) | Carne ? | — | — | 53.475711, -10.019331 | [FarmFinder](https://farmfinder.ie/producer/moran-s-meats-clifden); via Associated Craft Butchers of Ireland |
| Moycullen Meats | Moycullen | Carne | — | — | — | DAFM meat 2326 |
| O'Donoghue Butchers Gort | Menlo (nearest, 3.5 km) | Carne ? | — | (091) 632 957 | 53.295465, -9.112102 | [FarmFinder](https://farmfinder.ie/producer/o-donoghue-butchers-gort); via Associated Craft Butchers of Ireland |
| Portumna Pastry Ltd. | Portumna | Carne | — | — | — | DAFM meat 761 |
| S & S Duffy Meats LTD | Gort | Carne | — | — | — | DAFM meat 2871 |
| Sean Loughnane (Galway) Ltd | Tuam | Carne | — | — | — | DAFM meat 551 |
| Tony Carroll's Family Butchers | Ballinasloe (nearest, 1.1 km) | Carne ? | — | (090) 964 4949 | 53.318953, -8.228088 | [FarmFinder](https://farmfinder.ie/producer/tony-carroll-s-family-butchers); via Associated Craft Butchers of Ireland |
| Williams Gate Limited | Tuam Road | Carne | — | — | — | DAFM meat 2428 |
| Castle farm preserves | Dunmore (nearest, 1.7 km) | Conservas ? | — | — | 53.624246062854986, -8.755162775351028 | [FarmFinder](https://farmfinder.ie/producer/castle-farm-preserves); via yourhonestybox.com |
| An Bosca Uibheacha - The Egg Box | Bearna (nearest, 2.9 km) | Huevos | — | — | 53.25586815151088, -9.206721221938695 | [FarmFinder](https://farmfinder.ie/producer/an-bosca-uibheacha-the-egg-box); via yourhonestybox.com |
| Anna and Lucia’s eggs from happy hens | Ahascragh (nearest, 3.4 km) | Huevos | — | — | 53.428533167225815, -8.315576437150934 | [FarmFinder](https://farmfinder.ie/producer/anna-and-lucia-s-eggs-from-happy-hens); via yourhonestybox.com |
| Cais Gabhair Arann Teoranta | Oughill killronan Inis Mor | Lácteos y quesos | — | — | — | DAFM dairy IE1991 |
| Cuan Mhuire CLG | Coolarne Turloughmore Co Galway | Lácteos y quesos | — | — | — | DAFM dairy IE2208 |
| Galway Cheese (registered as Annelar Ltd) | An Teach Tui, Gurteen | Lácteos y quesos | — | — | — | DAFM dairy IE1981 |
| Killeen Farmhouse Cheese (registered as Marion Roeleveld) | Manufacturing Address Loughanroe East | Lácteos y quesos | — | — | — | DAFM dairy IE1912 |
| Kylemore Farmhouse Cheese (registered as Ms Teresa Roche) | Kylemore Abbey Loughrea Co | Lácteos y quesos | — | — | — | DAFM dairy IE2132 |
| Sabanero Artisan Cheese (registered as Dayana Maltese) | Unit 4 Westside Enterprise | Lácteos y quesos | — | +353 91 4417 266 | — | DAFM dairy IE2118 |
| Village Creamery Ltd | Kiltulla Oranmore Co Galway | Lácteos y quesos | — | — | — | DAFM dairy IE2219 |
| An Garraí Glas | An Chré Dhubh (nearest, 2.3 km) | Otros | — | 0838071113 | 53.246242, -9.3651492 | [FarmFinder](https://farmfinder.ie/producer/an-garrai-glas); via Food Culture Ireland |
| Feirmeoir Beag Glas | An Spidéal (nearest, 1.4 km) | Otros | — | — | 53.25751892274169, -9.300150191808198 | [FarmFinder](https://farmfinder.ie/producer/feirmeoir-beag-glas); via yourhonestybox.com |
| Killoscobe | Skehanagh (nearest, 5 km) | Otros | — | — | 53.4427627, -8.5733756 | [FarmFinder](https://farmfinder.ie/producer/killoscobe); via yourhonestybox.com |
| Oranmore organic farm | Oranmore (nearest, 3.6 km) | Otros | — | 087 416 6446 | 53.239715139664206, -8.959139683319163 | [FarmFinder](https://farmfinder.ie/producer/oranmore-organic-farm); via yourhonestybox.com |
| Roger Finnerty & Sons Galway | Galway (nearest, 0.4 km) | Otros | — | (091) 552 255 | 53.275195, -9.046247 | [FarmFinder](https://farmfinder.ie/producer/roger-finnerty-and-sons-galway); via Associated Craft Butchers of Ireland |
| Roger Finnerty & Sons Oughterard | Oughterard (nearest, 3.1 km) | Otros | — | (091) 552 255 | 53.44237, -9.31542 | [FarmFinder](https://farmfinder.ie/producer/roger-finnerty-and-sons-oughterard); via Associated Craft Butchers of Ireland |
| The Green Bee | Casla (nearest, 4.5 km) | Otros | — | — | 53.33137713608033, -9.544781500794885 | [FarmFinder](https://farmfinder.ie/producer/the-green-bee); via yourhonestybox.com |

## Name and county only — 50

The source names the business and its county and little else. Cheapest to resolve in bulk against a sector directory rather than one at a time.

| Lead | Municipio? | Category | Source signal | Contact | Source |
|---|---|---|---|---|---|
| Andarl Farm | — | Carne | Farm; Beef, Lamb, Pork, Poultry; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/andarl-farm) |
| Connemara Smokehouse | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | [FarmFinder](https://farmfinder.ie/producer/connemara-smokehouse) |
| Herterich's Pork Butchers | Galway | Carne | shop=butcher | +353 85 872 7671 | OSM node/1729163821 |
| Kinvara Smoked Salmon | — | Carne | Producer; Beef, Lamb, Pork, Poultry | — | [FarmFinder](https://farmfinder.ie/producer/kinvara-smoked-salmon) |
| Mike Walsh Butcher | Athenry (nearest, 0.3 km) | Carne | shop=butcher | +353 91 844 023 | OSM way/331441523 |
| Tony Carroll Family Butcher | Ballinasloe (nearest, 0.1 km) | Carne | shop=butcher | +353 90 964 4949 | OSM node/5141100258 |
| William's Gate | Galway | Carne | shop=butcher | +353 91 771 604 | OSM node/10299343232 |
| Boffin Brewing | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/boffin-brewing) |
| Connemara Brewing Co. | — | Cerveza | listed | — | [FarmFinder](https://farmfinder.ie/producer/connemara-brewing-co) |
| Micil Distillery | — | Destilados y licores | listed | — | [FarmFinder](https://farmfinder.ie/producer/micil-distillery) |
| Green Earth Organics | — | Fruta y verdura | Farm; Organic, Fruit, Vegetables, Delivery; via Curated B2C Directory | — | [FarmFinder](https://farmfinder.ie/producer/green-earth-organics) |
| Mad Yolk Farm & Sauna Experiences | — | Huevos | Farm; Eggs, Farm Gate, Farm Shops Ireland, remaining) | — | [FarmFinder](https://farmfinder.ie/producer/mad-yolk-farm-and-sauna-experiences) |
| Cais Na Tire Sheep Cheese | — | Lácteos y quesos | listed | — | [FarmFinder](https://farmfinder.ie/producer/cais-na-tire-sheep-cheese) |
| Ali's | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/alis-galway) |
| Beechlawn Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/beechlawn-organic-farm-co-galway) |
| Connemara Organic Seaweeds Ltd | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/connemara-organic-seaweeds-ltd) |
| Coole Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/coole-farm) |
| Huitre Du Connemara | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/huitre-du-connemara) |
| ISPG Ltd | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/ispg-ltd) |
| Kilbeg Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/kilbeg-organic-farm) |
| Loughmountain Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/loughmountain-farm) |
| May's Place | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/may-s-place) |
| Moycullen Market | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/moycullen-market) |
| Niall & Elaine Kelly | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/niall-and-elaine-kelly) |
| Shramore Organic Farm | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/shramore-organic-farm) |
| The Foods of Athenry | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-foods-of-athenry) |
| The Savage Garden | — | Otros | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-savage-garden) |
| Alans Bakery | Galway | Pan y cereal | shop=bakery | alanbakeryltd@gmail.com | OSM node/2105124832 |
| Bread Heaven Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/bread-heaven-bakery) |
| Builin Blasta Cafe and Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/builin-blasta-cafe-and-bakery) |
| Friendly Fermenistas | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/friendly-fermenistas) |
| Granum Bakehouse | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/granum-bakehouse) |
| Hapi Bakery | — | Pan y cereal | Producer; Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/hapi-bakery) |
| Joyce Country Bakery | — | Pan y cereal | Producer; Organic, Bread & Bakery, Sourdough, Farm Gate; via Real Bread Ireland / Irish Bakeries Directory | — | [FarmFinder](https://farmfinder.ie/producer/joyce-country-bakery) |
| Little Teapot Bakery | Galway (nearest, 1.9 km) | Pan y cereal | shop=bakery | — | OSM node/3056104044 |
| Magpie Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/magpie-bakery) |
| Mortons Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/mortons-bakery) |
| O'Connors | Galway | Pan y cereal | shop=bakery | +353 91 561 757 | OSM node/1865573303 |
| Sheridans Bakery | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/sheridans-bakery) |
| So Doh! Sourdough Renvyle | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/so-doh-sourdough-renvyle) |
| Soda Bread Queen | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/soda-bread-queen) |
| Woodfired Bread | — | Pan y cereal | listed | — | [FarmFinder](https://farmfinder.ie/producer/woodfired-bread) |
| Ali's Fish Market | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/alis-fish-market-galway) |
| Galway Bay Seafoods | — | Pescado | listed; also OSM way/150786614 | — | [FarmFinder](https://farmfinder.ie/producer/galway-bay-seafoods) |
| Gannet Fishmongers | — | Pescado | listed; also OSM node/1946374472 | gannet.fish@gmail.com | [FarmFinder](https://farmfinder.ie/producer/gannet-fishmongers) |
| Mary's Fish Shop | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/marys-fish-shop-galway) |
| Mohans Oysters | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/mohans-oysters) |
| Moran's Oyster Cottage | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/moran-s-oyster-cottage) |
| The Fisherman Factory Shop | — | Pescado | listed | — | [FarmFinder](https://farmfinder.ie/producer/the-fisherman-factory-shop-galway) |
| Solaris Tea | — | Té e infusiones | listed | — | [FarmFinder](https://farmfinder.ie/producer/solaris-tea) |

## Remaining search work

- The SFPA register of approved seafood establishments is not yet scoped; its
  index page served no document or table to the fetcher.
- Three national directories are gated: Guaranteed Irish (login), the Irish
  Organic Association producer finder (no content without a browser) and the
  Bord Bia directory (403).
- County food networks exist for several counties and are not yet scoped.
