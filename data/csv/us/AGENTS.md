# United States

## Operating state
- Phase: population. The state-level tree has a first national pass from USDA directories and producer-facing sources. Derive live row queues with `npx pnpm check:defects --country us`.
- Active lane: re-verify sparse directory rows and resolve the candidates whose product or current activity remains unsupported; keep unresolved sweeps in `docs/candidates/us/<area>.md` and closed decisions in `data/evidence/us/**`.

## Country rules
- `region` is one of the nine U.S. Census Bureau divisions and `area` is a state or the District of Columbia. Puerto Rico and the other U.S. territories are outside this tree because Census assigns them to no region or division.
- `municipio` is the city, town, village, borough, census-designated place or other named community containing the productive unit. A county, parish, borough/census area in Alaska or ZIP Code is not a substitute, and a USPS mailing city may differ from the unit's physical community.
- The Census place centroid catalog deliberately drops a name when it resolves to distinct places more than 10 km apart. Many repeated U.S. place names therefore have no geographic gate; do not force a match from the state abbreviation or ZIP Code.
- Tribal ownership, reservation location and federal recognition are separate claims. A productive unit on tribal land is eligible under the shared policy, but neither a tribal enterprise nor a reservation name identifies the food or drink producer by itself.
- State registrations and license labels vary. Resolve the public producer identity and the productive address rather than treating an LLC, permit holder, co-packer or mailing office as the unit.

## Source ceilings
- USDA Local Food Directories describe retail and wholesale market outlets. An on-farm market or single-farm CSA can identify a candidate unit; a farmers market, food hub or multi-farm CSA does not identify its vendors or prove that the operator makes an own product.
- The USDA Organic Integrity Database supports certification status, certified scope and the operation details it publishes. It does not by itself prove a current consumer-facing identity, an own offer, the exact productive site or online sales.
- Federal alcohol permits, brewery notices, winery registries and label approvals support only the licensee, premises or approved label they name. They do not establish current production, brand ownership, an own offer or a public sales channel.
- State agriculture departments and commodity associations range from regulated establishment lists to self-submitted marketing directories. Establish each source's admission claims in the active area note; without a current direct source, a directory listing normally caps a row at `parcial`.
