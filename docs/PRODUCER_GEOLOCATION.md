# Producer Geolocation

This contract covers how to source and review producer coordinates. The published
`lat`/`lon` representation and distance gates live in `docs/CSV_CONTRACT.md`;
decision provenance lives in `docs/EVIDENCE_CONTRACT.md`.

Coordinates represent the productive unit in the row: a farm, winery,
workshop, factory, mill, or equivalent facility. They do not represent a head
office, shop, distributor, accommodation, or an approximate locality reference.
An empty pair is recoverable incomplete knowledge; a plausible but wrong point
is a false public claim.

## Evidence chain

Keep three steps separate:

1. A location source connects the producer to a published address, holding,
   plot, or point.
2. A geocoder turns that description into candidates. It does not prove the
   address or the role of the place.
3. Editorial review decides whether a candidate represents the productive unit.

Stabilize the row identity first. A matching name, address or Maps listing does
not establish the place's productive role or current activity; a centroid check
catches gross errors but proves neither identity nor exactness.

## Source order

Use the first source that establishes the productive unit's actual point:

1. Coordinates or an unambiguous pin published by the producer for the
   productive unit.
2. A productive address published by the producer and geocoded with a suitable
   official or reliable service.
3. A productive address from a registry, council, or institutional directory,
   matched to the producer's public identity.
4. A producer-specific POI matched by address plus a distinctive detail such
   as phone, domain, email, or productive location.

Check normalized addresses and homonyms rather than accepting geocoder output.
For multi-site, aggregated, dispersed or mobile activity, use only a point whose
role is supported; otherwise retain the municipality and supported address and
leave both coordinates empty. Do not substitute a municipality, postcode,
street or industrial-estate centre for an unconfirmed producer point.

## Queries and candidate precision

Use WGS84 coordinates, constrain searches by country and include only published
address components. Reconcile candidates by identity and role; neither the
nearest result nor a normalized address is automatically correct. Keep queries,
provider responses and precision in the temporary review artifact, not the CSV
or evidence ledger. Ranking orders candidates; it never approves them.

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

The distance thresholds and reporting contract live in `docs/CSV_CONTRACT.md`.
A valid distance does not make a point correct, and a skipped municipality is
not a pass. If good coordinates conflict with a bad or ambiguous centroid, fix
`data/reference/municipality-overrides.json` or the reference data; never move
the producer.

## Google Maps links

`direccion`, `lat`/`lon`, and `Google Maps` must identify the same unit and
role. Publish only a reviewed listing matched by identity, address, role and a
distinctive detail. A coordinate pin, text search or Place ID candidate is not
enough. If no matching listing exists, leave `Google Maps` empty and retain any
supported coordinates. Canonical URL representation lives in
`docs/CSV_CONTRACT.md`.

## Municipality references and providers

When only the municipality is supportable, leave `lat` and `lon` empty.
`data/reference/municipalities.json` supports geographic consistency checks;
its centroids are not producer coordinates. A coincidence with a centroid is a
review signal, not proof that an existing point is wrong. Check its provenance
before correcting or clearing it. Use
`data/reference/municipality-overrides.json` for in-country homonyms rather than
moving correct producer coordinates. Provider output is always a candidate, not
a hidden source of truth; follow its terms and limits.

The maintenance utility is exposed as
`npx pnpm build:municipalities -- --only <country>`. Its default merge preserves
committed keys while adding newly supported ones. Treat `--refresh` as a
separate reviewed reference-data change because it may move existing centroids.

## Evidence and closure

For a reviewed add, re-verification or material correction, prefer a `keep`
record whose supporting source carries the `location` claim. A geocoder and
address source receive only the claims they actually support. Keep durable
conflicts or unusual distances in evidence and queries or rankings in the
temporary artifact.

Compare the intended changes by `(country, producer_id)` with the publication
baseline. Explain every cleared point from its sources or recorded provenance,
and inspect additions, corrections and removals separately. An unavailable
website or missing historical claim alone does not invalidate an existing point.
Keep unrelated cells and producer identities unchanged in a location-only pass.

Close the batch under `docs/EDITORIAL.md` and `AGENTS.md`. Recheck identity and
productive role, inspect only the intended diff, and read centroid-match and
skipped counts: a green gate proves neither complete coverage nor exact locations.
