# Candidates — South Africa

Reusable methods only. Per-area state lives in `<area>.md`.

## What works

- **The sub-route publishes the contact; nobody publishes the address.** The
  WOSA member index names about a thousand wine members and gives a website and
  nothing else. A regional wine route — Stellenbosch, Constantia, Durbanville,
  Franschhoek, Robertson, Breedekloof, Wellington, Darling, Elgin, Swartland —
  adds an email, a phone and a site per member, and a street address for only a
  small minority: on the Stellenbosch route twelve of a hundred and three member
  pages render a map and the rest render none. Fill a district from its route,
  use WOSA to see what the route is missing, and expect to open the producer's
  own site to place the row.
- **A WordPress listing site is in its sitemap even when its archive is not.**
  `wineroute.co.za` renders members through a JavaScript map and does not expose
  its `wineries` type over the REST API, but `wp-sitemap-posts-wineries-1.xml`
  lists every member page. Try the sitemap before concluding a directory cannot
  be read; `wp-json/wp/v2/types` tells you which post type to look for.
- **On a listing page, read the map component and not the map defaults.** The
  Wilcity theme prints `defaultMapCenter` — the same point on every page in the
  site — well above the listing's own `:lat-lng='{"lat":"…","lng":"…"}'` and its
  `listing-ggmap-url`, which carry the real address. Taking the first
  coordinate in the document gives every producer the same location.
- **Resolve a town to its district by joining Wikidata to the Treasury
  registry.** Wikidata gives settlement → local municipality through `P131+`,
  and
  `municipaldata.treasury.gov.za/api/cubes/municipalities/facts?page_size=400`
  gives every local municipality a `parent_code` that is its district. Joining
  the two places roughly 2.900 South African place names in an area folder
  without geocoding anything. About twenty municipalities were renamed after
  their Wikidata label was written — Camdeboo, Lukhanji, Tlokwe, Mookgophong
  among them — so their towns fall through the join and need placing by hand.

## What does not work

- **OpenStreetMap as a sweep.** The producer crafts and farm shops together
  return about 130 named objects for the whole country, and a third of those
  carry no website. It seeds a province with no association; it does not cover
  one.
- **The SA Olive member directory.** The site runs a Directorist install whose
  public listing type holds a single record, and no membership list is published
  elsewhere on it. Olive producers have to be reached through the regional
  routes, which list them alongside wineries.
- **Four association domains do not resolve at all**:
  `craftbrewersassociation.co.za`, `beerassociation.co.za`,
  `sacheesefestival.co.za` and `sabio.org.za` all fail to connect rather than
  returning an error, so beer, cheese and honey have no national list to start
  from.
- **`stellenboschwineroutes.com` is not the Stellenbosch route.** It redirects
  to a single member's own site. The route is `wineroute.co.za`.

## Identity traps

- **Repair the WOSA URL before calling a producer unreachable.** About
  twenty-five entries store the website with the scheme doubled, arriving as
  `http://www.https://advini.com/` or `http://www.www/absolutesstylewines.co.za`.
  The domain inside is usually right.
- **A member of an export body is not necessarily a farm.** WOSA membership
  covers négociants, brand owners and groups with no cellar of their own, and
  supermarket brands appear beside century-old estates. The row is the
  productive unit.
- **The route does not respect the municipal boundary.** Stellenbosch Wine
  Routes members sit at Faure, Somerset West and Philadelphia, which are inside
  the City of Cape Town, not the Cape Winelands. Place the row from its town.
