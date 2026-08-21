# Producer Geolocation

This guide covers how to source and review producer coordinates. The published
`lat`/`lon` representation and distance gates live in `docs/CSV_CONTRACT.md`;
decision provenance lives in `docs/EVIDENCE_CONTRACT.md`.

Coordinates represent the productive unit in the row: a farm, winery,
workshop, factory, mill, or equivalent facility. They do not represent a head
office, shop, distributor, accommodation, or municipality centre by default.
An empty pair is recoverable incomplete knowledge; a plausible but wrong point
is a false public claim.

## Evidence chain

Keep three claims separate:

1. A location source connects the producer to a published address, holding,
   plot, or point.
2. A geocoder turns that description into candidates. It does not prove the
   address or the role of the place.
3. Editorial review decides whether any candidate is the productive unit in
   the row.

Classify the place as productive, office, sales, hospitality, or unknown during
review. An exact address or matching name does not establish a productive role.
A Maps listing can support location but does not by itself prove current
activity. Proximity to a municipality centroid catches gross errors but does
not prove identity.

Stabilize `nombre`, `producer_id`, `slug`, `municipio`, and the productive-unit
identity before searching for coordinates.

## Source order

Stop when the available precision is honest and useful:

1. Coordinates or an unambiguous pin published by the producer for the
   productive unit.
2. A productive address published by the producer and geocoded with a suitable
   official or reliable service.
3. A productive address from a registry, council, or institutional directory,
   matched to the producer's public identity.
4. A producer-specific POI matched by address plus a distinctive detail such
   as phone, domain, email, or productive location.
5. The municipality centroid as an explicitly approximate fallback.

Do not replace a source address with a geocoder's normalized form without
checking it. A service can drop a street number, change a locality, or choose a
homonym. For multi-site brands, locate the unit that justifies this row and
area. If several units are aggregated and no honest representative point
exists, resolve the row identity or leave the pair empty.

Dispersed or mobile activity, such as beekeeping, fishing, or grazing, may not
have one public productive point. Use public facilities only when a source
connects them to the activity; otherwise retain the municipality and use an
approximate fallback or no coordinates.

## Queries and candidate precision

- Use WGS84 decimal degrees and constrain searches by country.
- Include only address components the source publishes. Never invent a street,
  number, postcode, or locality.
- Search the address and public name separately when combining them degrades
  results, then reconcile candidates by identity.
- Use explainable address variants only. Record which variant produced a
  candidate; normalization does not automatically correct the CSV.
- Use region, area, or municipality centroids to rank candidates, never to make
  the nearest result correct.
- Preserve the exact query, provider, date, stable candidate identifier,
  returned address, and declared precision in the working artifact.
- Respect the country's actual address hierarchy. A truncated plot, block, or
  `banchi` is not a street-level match.
- Cache provider responses by normalized query to avoid duplicate requests and
  keep review reproducible.

Use these working precision labels; they are not CSV values:

| Precision | Editorial meaning |
|---|---|
| `published` | The productive-unit source publishes the point or an unambiguous pin. |
| `address` | Street and number match a confirmed productive address. |
| `poi` | The POI matches identity and another independent detail. |
| `interpolated` | The number is estimated along a road and needs explicit review. |
| `locality` | Only a locality, postcode, or named place resolves; the point is approximate. |
| `centroid` | The municipality centroid is copied as a coarse fallback. |

Ranking orders candidates; it never approves them. A correctly named POI may
be a shop, and a perfect street match may be a corporate office.

A pass is **reviewed** when every in-scope row has a precision or a documented
no-source outcome, **covered** when every row has coordinates including coarse
fallbacks, and **exact** only when every point is accepted at `published`,
`address`, or `poi` precision. Report the status with empty-coordinate,
centroid-fallback, and skipped-municipality counts.

## Acceptance and geographic checks

Accept an exact point only when country, area, and `municipio` are compatible
and at least one condition holds:

- the productive-unit source publishes the point;
- street and number match a confirmed productive address; or
- a POI is matched by address plus a distinctive identity detail.

Manually review interpolated numbers, roads, industrial estates, holdings,
named places, homonyms, and large municipalities. Reject a head office, shop,
accommodation, or different facility even when it lies inside the same
municipality. Do not hide uncertainty by moving a point towards the centroid.

The CSV audit adds a separate safety net:

- over `15 km` and up to `100 km` from the municipality centroid: warning;
- over `100 km`: blocking error;
- municipality absent from reference data: skipped, not passed;
- exact centroid match: counted as an approximate fallback.

A valid distance does not make a point correct. If good coordinates conflict
with a bad or ambiguous centroid, fix
`data/reference/municipality-overrides.json` or the reference data; never move
the producer.

## Google Maps links

`direccion`, `lat`/`lon`, and `Google Maps` must identify the same unit and
role. Publish a Maps URL only for a reviewed listing of that unit:

```text
https://www.google.com/maps/search/?api=1&query=<NAME>%2C<ADDRESS>&query_place_id=<PLACE_ID>
```

The Place ID anchors the accepted listing; `query` is the required fallback.
A coordinate-only pin or text-only search is not a producer listing. Shortened
links and copied interface URLs are not canonical. When the unit has no matching
listing, leave `Google Maps` empty and keep any accepted position in `lat`/`lon`.

Find and inspect Place IDs manually for small batches. Do not call an API that
requires billing, can incur charges, or violates its storage terms. A Place ID
is still only a candidate: open the listing and match identity, address, role,
and an independent detail before publishing it.

Legacy links form a migration queue:

```bash
npx pnpm check:defects --check maps-sin-ficha --country <iso> --list
npx pnpm check:defects --check maps-sin-ficha --area <area> --list
```

Replace a link only after review. If no matching listing exists, clear the link
and retain correct coordinates.

## Municipality fallback and providers

When only the municipality is supportable, copy its centroid from
`data/reference/municipalities.json`. Use the regional override for in-country
homonyms. There is no fallback when the municipality is missing or ambiguous;
fix reference data only when its identity is supportable.

Regenerate the shared municipality catalog from Wikidata with
`node scripts/build-municipality-centroids.js`. It stores centroids by country;
a country absent from that catalog has no geographic gate until support is
added. Use `data/reference/municipality-overrides.json` for supported
in-country homonyms rather than moving correct producer coordinates.

Before using any geocoder, confirm that its terms allow the expected request
volume, caching, permanent storage, publication, and attribution. Follow its
rate limits and identify the client as required. Provider output remains a
candidate, never a hidden source of truth. Country guides may record durable
local false positives or preferred public sources; those rules do not transfer
automatically to other countries.

## Evidence and closure

For a reviewed add, re-verification, or material correction, prefer a `keep`
record whose supporting source carries the `location` claim. The address source
and geocoder may be separate entries and receive only the claims they actually
support. Use `type: "google-maps"` only for a specific listing that was opened
and matched; a generated search URL is not evidence.

Keep only durable conflicts, multiple-facility distinctions, or the reason for
an unusual distance in evidence. Queries, rankings, and transient provider
responses belong in the temporary review artifact.

To close a batch:

1. Recheck the identity and productive address of every accepted `slug`.
2. Inspect the diff; geolocation should not change unrelated fields unless an
   already-open source explicitly supports a bounded incidental correction.
3. Run `npx pnpm check:csv:changed` while iterating and
   `npx pnpm check:evidence:changed` when evidence changes.
4. Finish with `npx pnpm verify:data`.

Always read the fallback and skipped-municipality counts. A green gate proves
structural consistency, not complete coverage or exact locations.
