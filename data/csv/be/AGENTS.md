# Belgium

## Operating state
- Priorities: review inherited rows and investigate decisions through
  area-scoped source passes.

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
