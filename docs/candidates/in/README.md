# India discovery methods

Apply the [shared candidate workflow](../README.md) and the
[India rules and source ceilings](../../../data/csv/in/AGENTS.md). Per-area
queries, cutoffs and unresolved candidates belong in `<area>.md`.

## Reusable techniques

- **Producer site plus `/products.json`.** Many producer stores use Shopify.
  `GET <domain>/products.json?limit=3` can confirm an active catalog; a 404 or
  HTML response only means the site is not exposing Shopify at that route.
- **Homepage narrative before contact details.** Contact pages often publish a
  corporate office. Search the homepage and about text for the estate, garden,
  winery or plant before assigning the productive location.
- **OpenStreetMap for a known identity.** A producer POI may help place an
  already identified urban brewery or shop, but OSM should not be used as a
  national producer roster.
