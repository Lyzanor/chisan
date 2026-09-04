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
  location they publish. They do not by themselves prove current activity, a
  public own offer or online sales.
- Municipal markets, food routes and fair rosters are discovery sources and may
  list retailers, hospitality, associations or sales points rather than
  qualifying producers.
- The Catalan *venda de proximitat* register accredits a named operator to sell
  its own output by direct sale or short circuit, and publishes the
  accreditation, holder, declared trade name, municipality and declared
  products. One record therefore carries identity, own productive output, offer
  and municipality, and can admit a row on its own at `pendiente`. It does not
  establish current activity, a first-party channel or online sales.
- The CCPAE *guia d'operadors* is a Catalonia-wide organic certification
  register, not a provincial producer directory. One record supports the
  operator, its certified activity class and the municipality it publishes;
  most records are raw agricultural activity rather than elaboration, and
  logistics, distribution, industrial oils and importers are registered beside
  producers. It carries no operator registration date, so it cannot be narrowed
  to recent entries, and it publishes no open dataset. Query it by certified
  elaboration activity, or by comarca keeping only the elaboration rows, rather
  than sweeping the register; its annual *Guia d'Operadors* PDF is the
  parseable alternative. The subset that carries a brand and a sellable own
  offer already reaches the catalog through the *venda de proximitat* register,
  Xarxa Productes de la Terra, Gastroteca and mercats de pagès, which carry the
  same organic distinction.
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
