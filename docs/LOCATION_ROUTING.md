# Catalog Area Location Routing

## Purpose and boundary

This contract governs the optional use of a visitor's device position on the
neutral `/` page to suggest a covered Chisan catalog area. It owns the
permission experience, client-side area resolution, boundary data, privacy and
failure behavior.

It does not govern producer coordinates. `docs/GEOLOCATION.md` owns the sourcing
and review of public `lat`/`lon` values for productive units. Producer points,
municipality centroids and Google Maps listings do not define catalog-area
containment and must never be used as a substitute for administrative boundary
geometry.

Location resolves only a catalog key:

```text
device position -> (country, area)
```

It neither chooses a language nor changes catalog or account identity. Locale
selection is a separate presentation decision applied after the area is known.

## Sources of truth

Reviewed source geometry and its provenance live under:

```text
data/reference/catalog-area-boundaries/<country>.geojson
data/reference/catalog-area-boundaries/sources.json
```

Each feature is keyed by the exact catalog `(country, area)` from the CSV tree
and may be a polygon or multipolygon. The CSV tree and `country.json` remain the
registry: geometry cannot create, rename, merge or reassign an area. Every
activated feature must record its boundary source, source date and a licence
that permits the repository's processing, redistribution and deployment.

Deployable browser assets live under:

```text
public/generated/catalog-geography/index.json
public/generated/catalog-geography/<country>.json
```

They are deterministic, simplified output built from the reviewed reference
files and are never edited directly. Simplification must preserve the reviewed
border, island, enclave and multipolygon behavior required by fixtures. The
generated index may narrow lookup to a coarse country bounding box; it is not
authority for the final area result.

Every source ledger entry has a `validationFixtures` object with exactly
`inside`, `holes`, `borders`, `islands` and `enclaves`. An island fixture names
an evidence-backed polygon component by `area`, `polygonIndex` and a point
inside it. An enclave fixture names the enclosing area's `polygonIndex` and
interior `ringIndex`, plus the `enclaveArea` that alone covers its point. The
gate checks both forms against the reviewed reference and the simplified
artifact. `islands` and `enclaves` may be empty when the reviewed source does
not establish either classification; never infer those labels merely from a
disjoint component or an interior ring.

Device coordinates are never a source file or source of truth. They are
transient browser input and are discarded after one routing decision.

## Permission and choice experience

The neutral `/` page is the only place that may offer first-visit location
onboarding. It must:

1. Show a first-party explanation and separate **Use my location** and
   **Choose manually** actions.
2. Call `navigator.geolocation.getCurrentPosition()` only after the visitor
   activates **Use my location**. Page load, hydration and a language choice
   must not trigger the native permission prompt.
3. Keep the neutral country listing usable before, during and after the
   request, including when JavaScript or the Geolocation API is unavailable.
   **Choose manually** links to that listing; it never duplicates it in a
   separate selector.
4. Request one normal-accuracy position with `enableHighAccuracy: false`, an
   8-second timeout and a 5-minute `maximumAge`; never use `watchPosition`.
5. On a later visit to `/`, resume a valid saved area by replacing the neutral
   page with that area's published URL. Only `/` resumes, and only from the
   browser that stored the preference.
6. Publish one manual entry point that suppresses the resume: the
   `#choose-country` anchor on `/`, which the global footer catalog link uses.
   The account profile owns the control that forgets the saved area.

An explicit catalog URL always wins. Catalog, area and producer routes never
invoke geolocation and are never redirected because of a current or saved
position.

## Client-side resolution

Point-in-polygon resolution happens entirely in the browser against validated
catalog boundary assets. A successful result must contain exactly one covered
`(country, area)` whose geometry contains the position with enough certainty
given the browser's reported accuracy.

Remain on `/` and show manual choices when:

- permission is denied, the request times out or the API is unavailable;
- reported accuracy is too poor to establish one area;
- the accuracy region touches a reviewed boundary or more than one candidate;
- the point is outside enabled coverage;
- required geometry is missing, invalid or fails to load; or
- resolution produces no result or more than one result.

Do not guess the nearest area, centroid or producer. Do not turn a bounding-box
match into an area result. A country or area is enabled for location routing
only when its intended geometry and ambiguity fixtures pass review; an
uncovered location remains a manual selection even when a nearby catalog area
exists.

The resolver returns only the exact derived catalog key. Navigation then uses
the central catalog URL builder. The location component must not assemble a
short or composite locale path itself.

## Language separation

Physical location and requested language are independent inputs:

```text
(country, area) + explicit/browser language -> published destination URL
```

After area resolution, apply the normal locale-selection order for that area:
an explicit supported preference; the effective territorial preference only
when the browser accepts it among the published matches; otherwise the first
supported browser language; English when no visitor language matched and it is
published; then the country default. The choice selects a destination URL; it
never varies the content of an existing locale URL.

A Barcelona result, for example, may lead to `/ca-es/barcelona`,
`/es/barcelona` or `/en-es/barcelona` according to language preference.
Location alone implies none of those languages. Do not use IP location or an
area result to infer language.

## Privacy and persistence

Browser geolocation is sensitive. Raw latitude, longitude, accuracy and any
derived shape intersection must remain in ephemeral client memory for the
immediate lookup. They must not be sent to Chisan or a reverse-geocoding
provider and must not appear in:

- a URL, query parameter, referrer or navigation state;
- cookies or local storage;
- analytics events, telemetry, logs or error payloads;
- Clerk metadata, PostgreSQL or any account-domain record; or
- support, claim, favorite or producer-change data.

Discard the raw position after success or failure. Persist at most a versioned
local-storage value containing the derived `{ country, area }` preference and
the onboarding dismissal state. Revalidate that key against the current catalog
and storage version before resuming it. The preference belongs to the browser:
it is never written to Clerk, PostgreSQL or any account record, and the profile
control reads and clears the same local value. Language preference is stored
separately and forgetting an area must not alter language, account data,
favorites or claims.

Fetching a lazily loaded country geometry asset may reveal only the coarse
country selected from the public index. No request may contain or encode the
device point.

## Validation and activation

The boundary gate must reject malformed geometry, unknown catalog keys,
duplicate area ownership, missing source metadata or redistribution licence,
and fixture regressions for required borders, islands and enclaves. It must also
detect unintended gaps or overlaps in the sampled activation scope and prove
that generated assets are reproducible from the reviewed sources.

After changing reviewed source geometry or its provenance, regenerate and
inspect the deterministic browser artifacts before running the gate:

```bash
npx pnpm build:catalog-geography
npx pnpm check:catalog-geography
npx pnpm test:catalog-geography
```

Location-routing activation is independent of locale publication. An area may
publish language variants without a boundary, and a validated location may
resolve to the existing default locale before alternate languages launch.
Never guess one input to compensate for the other.

Production smoke checks cover the explanatory prompt, explicit user activation,
success, denial, timeout, ambiguity, outside-coverage fallback, the later-visit
resume, the manual entry point that suppresses it, and the profile forget
control. Network, storage, analytics and account inspection
must confirm that no raw coordinate crossed the client boundary.
