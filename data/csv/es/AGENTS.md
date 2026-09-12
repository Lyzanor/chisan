# Spain

## Operating state
- Public catalog status: published and the primary operating scope.
- Priorities: targeted area discovery, translation and geolocation coverage,
  and ongoing review of individual rows in a mature catalog.

## Country rules
- `municipio` is the official municipality, not a barrio, distrito, pedanía,
  parroquia or comarca; retain the smaller locality in `direccion`.
- Place a row in the province of the productive unit, not the province of a head
  office, regulatory council, appellation or retail outlet.
- Preserve the producer's and authority's public Spanish, Catalan, Galician or
  Basque spelling; do not translate proper names for uniformity.
- CartoCiudad may normalize the road type. Accept a candidate only when name,
  number, postcode and municipality match an independently published productive
  address.
- An *alhóndiga* that auctions members' lots is a marketplace: the produce
  leaves under the buyer's identity, so it is `not-producer`. A hortofruit
  cooperative, SAT or commercialiser that puts that same output on the market
  under its own name or brand is a governed producer collective and qualifies.

## Source ceilings
- Denomination councils, certification registers and autonomous or provincial
  producer directories support only the membership, product, identity or
  location they publish. Their claims depend on the exact register. The explicit admission exception
  below uses a currently maintained authorization as indirect evidence; a generic
  certification or establishment record is insufficient.
- Municipal markets, food routes and fair rosters are discovery sources and may
  list retailers, hospitality, associations or sales points rather than
  qualifying producers.
- The Catalan *venda de proximitat* register accredits a named operator to sell
  its own output by direct sale or short circuit, and publishes the
  accreditation, holder, declared trade name, municipality and declared
  products. One record carries identity, own productive output and offer, and
  can admit a row on its own at `pendiente`. It does not establish current
  activity, a first-party channel or online sales. Two limits bound it. Its
  address and municipality are the accreditation holder's declared address, not
  the productive unit, so a city address places no grove, vineyard or flock and
  leaves the placement question open. And a livestock accreditation is a
  permission to sell meat rather than evidence that butchered product reaches
  consumers: sixteen such rows in Barcelona were purged as `out-of-scope` once
  the municipal establishment census showed only a stockbreeding holding, so
  check that census before admitting a meat or raw-milk holder on the register
  alone. Prefer the live open dataset over the published PDF listing, whose
  entries can be a decade old.
- The CCPAE *guia d'operadors* is a Catalonia-wide organic certification
  register, not a provincial producer directory. One record supports the
  operator, its certified activity class and the municipality it publishes;
  most records are raw agricultural activity rather than elaboration, and
  logistics, distribution, industrial oils and importers are registered beside
  producers. It carries no operator registration date, so it cannot be narrowed
  to recent entries, and it publishes no open dataset. Query it by certified
  elaboration activity, or by comarca keeping only the elaboration rows, rather
  than sweeping the register; its annual *Guia d'Operadors* PDF is the
  parseable alternative. Cross-check plausible identities against the catalog and sources such as
  *venda de proximitat*, Xarxa Productes de la Terra, Gastroteca and mercats de
  pagès before adding leads. Coverage in those sources is not assumed complete.
- RIAAC records an establishment and its registered activity class. Like the
  RGSEAA it supports the entity, that activity class and the registered address
  only; it never admits a row by itself, whatever the activity class says.
- The RGSEAA sanitary register supports the legal entity, its registered
  activity class and the industrial address it publishes. It does not establish
  a public producer identity, a brand, a current own offer, current activity or
  online sales, and its `localidad` is that address's locality, which may be a
  pedanía rather than the official municipality. A registration whose only
  category is storage, packing, distribution or import is not by itself
  qualifying elaboration.
- The RGSEAA also publishes a whole-register XLSX listing beside its search. The
  listing carries the registration number, company name, industrial address,
  province, CCAA and activity class, and no municipality, trade name, product or
  contact column. It is a corroboration source, not a discovery queue: the
  register keys on the company name while the catalog keys on the public trade
  name, so a name that does not appear there is not absent, and a plurality of
  its rows carry only the polyvalent storage, distribution, transport, packing
  and import class, which is not qualifying elaboration.
- The Castilla-La Mancha direct-sale register accredits a named holder to sell
  its own declared products, and publishes the registration number, holder,
  province, municipality, products and sale modalities. Like the Catalan
  register it can admit a row at `pendiente`. Two limits bound it. It records one
  entry per product line, so several entries may be the same holder and the
  record count is not a producer count; de-duplicate by holder before a batch.
  And its `Modalidades de venta` names the channels the holder is authorized to
  use, including `Venta on line`, which is a permission rather than a channel
  seen usable: it never sets `Venta online`. Its `Descargar` control exports the
  whole result set as latin-1 CSV, and that export truncates a company name at
  nineteen characters while leaving a personal name intact, so resolve a cut
  legal name elsewhere before publishing it as an identity.
- The Andalucía and Aragón direct-sale datasets publish the accreditation holder
  as a personal name with no declared trade name, so they rarely carry a public
  producer identity on their own. Treat them as discovery only, check the
  dataset's own update date before relying on it, and keep the personal phone
  and email columns out of the catalog.
- A regional directory may publish statistics rather than operators. The Basque
  food-industry directory and four of the five Asturian agri-food datasets
  aggregate establishment counts by subsector and year and name no operator; the
  Asturian `alimentos del paraíso` roster is the exception and does name
  operators. Confirm a dataset names operators before planning a batch around it.
- Two sources are closed to us by their own terms: the Comunitat Valenciana
  organic operator directory forbids economic exploitation or commercial use
  outright, and the La Rioja agri-food industry register is licensed
  non-commercially. Do not use either as a data source.
- The REGEPA code lookup and the Galician direct-sale consultation resolve a
  holding only from an identifier the holder already knows, and publish no
  browsable listing. Neither is a discovery source.
- The Asturian `alimentos del paraíso` roster lists the authorized operators of
  each DOP, IGP and Alimentos del Paraíso Natural figure, one sheet per figure.
  It carries the declared trade name, often beside the holder's own name, and a
  `tienda on-line` column that is the operator's declared claim rather than a
  channel seen usable. Two limits bound it. Only the DOP Cabrales sheet publishes
  a concejo, so for most entries the productive municipality is still open and
  the figure's own comarca is a clue, not a placement. And the IGP sheets
  authorize packers, commercialisers and meat operators beside growers and
  elaborators, so membership alone does not establish a qualifying transforming
  step.
- The CPAEN/NNPEK register is Navarra's organic certification register and
  behaves like the CCPAE one: most of it is raw agricultural activity rather than
  elaboration, and importers, fair-trade distributors, cold-chain logistics,
  retail chains, fodder and non-food operators are certified beside producers.
  Query it by declared transformed products or wine rather than sweeping it. It
  exports the whole result set from its own page with `?excel=1`, so it needs no
  crawling, and the export carries the población and website but leaves the
  operator-type columns empty. It certifies operators seated outside Navarra, so
  check the declared población before placing a row.
- The CRAEGA register is Galicia's organic certification register. Its search
  exports CSV per filter from the site's own AJAX endpoint, but the export
  carries only identity, address and contact: there is no product or activity
  column, so a category cannot be read from it. Query it by the *Industrias*
  activity, which is its elaboration class and returns roughly a fifth of the
  register; *Vegetal* and *Animal* are raw production. The *Apicultura* filter
  returns nothing, which is a register defect rather than an absence. Port
  terminals, cold stores, logistics operators, retail chains, e-commerce sellers
  and agricultural-input suppliers are certified beside producers, several
  operators are seated outside Galicia, and a single retail chain appears once
  per store.
- The Cooperativas Agro-alimentarias directory lists the federation's member
  cooperatives nationally with municipality, province and the sectors each is
  registered for, but it publishes a website for fewer than a tenth of them. A
  registered sector is an activity the cooperative is organized for, not proof
  that a food reaches the market under its own name, and that own-offer question
  is what decides a collective: a cooperative that only supplies its members,
  runs a shop or a credit section, mills or presses for others, or sells in bulk
  to bottlers is not a producer. The directory also mixes first- and
  second-degree cooperatives, and a second-degree group that commercialises
  members' output is not itself a productive unit; place the qualifying unit
  instead. Sectors such as supplies and fuel, member shops, credit sections,
  animal feed, fodder, tobacco, cotton, flowers and forestry are not food.
- Reyno Gourmet separates its member entities by a `tipo_de_entidad` taxonomy
  into *Empresas*, *Comercios* and *Hostelería*, so the shops and hospitality it
  carries are a distinct section rather than a contaminant of the producer list.
  Its records publish the trade name, product types, the quality figures held and
  a map point, but no municipality, and its open REST API returns the whole set
  without crawling. A point is not a placement: resolving it against municipality
  centroids can name a neighbouring municipality, so read the entity page's own
  address before placing a row. Membership records the product type, not current
  activity.
- The Balearic *venda directa* register accredits a named operator to sell its
  own output and publishes the operator, a street or rural address, opening hours
  and sometimes products. Like the Catalan register a record carries identity and
  own productive output, and like it the register does not establish current
  activity. It publishes no municipality field, and its addresses frequently name
  a locality — Sa Ràpita, Son Espanyol, Sant Ferran — rather than the official
  municipality, so read the address rather than deriving a placement from it.
  Resolving Balearic addresses against the shared municipality reference is
  unsafe twice over: that reference carries Castilian exonyms where the source
  and the country rule use the Catalan form, and a road name in an address can
  match a municipality the unit does not sit in.
