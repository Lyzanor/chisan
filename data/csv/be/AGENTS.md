# Belgium

## Operating state
- Public catalog status: standby. Keep catalog, evidence, account and
  repository-wide validation state maintained, but do not publish or index it.
- Pause routine discovery, enrichment, translation and geolocation updates.
  Resume them only through an explicit country-scoped instruction.

## Country rules
- `municipio` is the official municipality, never a deelgemeente or postal
  locality. Preserve its Dutch, French or German public spelling.
- Registered office and productive unit often differ, especially for contract
  brewing. Place the row where the qualifying production occurs.
- Flemish, Walloon and Brussels address services fuzzy-match silently. Accept a
  result only when street and postcode agree with the requested address.

## Source ceilings
- The inherited rows came from Zythos, Apaq-W and Walloon product rosters. They
  support only the identity, membership or location they publish; they do not
  establish current activity or online sales.
- A Zythos address may be a registered office rather than a brewhouse, so it
  cannot establish the productive municipality by itself.
