# United States discovery guide

Apply the [shared candidate workflow](../README.md) and the
[United States rules and source ceilings](../../../data/csv/us/AGENTS.md).
This file records reusable national methods only; a state-specific sweep,
cutoff and unresolved queue belong in `docs/candidates/us/<area>.md`.

## National discovery lanes

- The [USDA Local Food Directories](https://www.ams.usda.gov/services/local-regional/food-directories-listings) are useful for locating on-farm markets and single-farm CSAs. Farmers markets and food hubs are outlets or intermediaries: follow them to named vendors, then verify each producer independently.
- The USDA Organic Integrity Database is a certification lookup, not a consumer-producer catalog. Use operation name, scope and address as de-duplication or discovery signals, then establish the current public identity, own offer and productive unit elsewhere.
- Federal alcohol records can expose a legal operator, premises or label. Match that material to the public producer by address, domain, brand or contact; do not equate a permit or approved label with current production.
- State agriculture departments, university extension programs and commodity associations are often the most productive route. Record the exact directory, query, date, covered producer type and source ceiling in the state note because fields and admission criteria differ by program and by state.

## Geography and identity

- The state comes from the productive address, not a headquarters, tasting room, distributor or ZIP Code marketing label. District of Columbia is its own area; a producer in Washington state belongs to `washington`.
- Start with the full street address and identify the physical local jurisdiction. USPS city names can cross municipal boundaries, while rural producers may publish only an unincorporated community.
- `data/reference/municipalities.json` uses the U.S. Census Bureau national Places Gazetteer. Its representative point is a plausibility gate, never the producer coordinate. Incorporated-place and CDP suffixes are removed from lookup labels, and genuinely repeated names are dropped.
- Match homonymous farms and family brands with state plus address and at least one of domain, phone, email, owner or product line. A shared surname or a state-directory name alone is not enough.

## State sweep notes

Create a state file only when a concrete sweep or unresolved lead exists. Keep
the discovery URL, filters, review date, candidate cutoff and missing admission
claims there. Remove resolved entries in the same change that adds their CSV
row or evidence decision; do not maintain a manual state index in this README.
