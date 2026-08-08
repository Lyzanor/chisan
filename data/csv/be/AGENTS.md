# Belgium — temporary source note

Keep this note only while `data/csv/be/**` lacks per-row evidence.

- The inherited rows come from Zythos, Apaq-W and Walloon product rosters. They
  support only the claims they publish and do not establish current activity or
  online sales.
- Zythos publishes registered offices, not necessarily brewhouses. Contract
  brewing is common, so confirm the productive unit before accepting the stated
  municipality or address.
- `municipio` is the official municipality, never a deelgemeente or postal
  locality. Preserve the municipality's Dutch, French or German public spelling.
- Flemish, Walloon and Brussels address services fuzzy-match silently. Accept a
  result only when street and postcode agree with the requested address.
