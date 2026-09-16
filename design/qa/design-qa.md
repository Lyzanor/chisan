# Current design QA

Active system: [Product in the light](../README.md). Earlier verification is
preserved in [history](history/README.md); it does not specify the current brand.

## 2026-09-16 — Category ambient backgrounds above the map

Implementation review: **static checks passed; live visual review pending**.

| Surface | Decision and observed result |
| --- | --- |
| Category decoration | The two ambient image layers now start at the top of the producer profile and are both anchored above the map, including the narrow layout. The map remains a separate readable surface. |
| Otros | Added the existing rural landscape illustration as the ambient image for the catch-all category, keeping the image generic and free of producer-specific content. |

The local browser review could not run because the sandbox refused the dev-server
port and the elevated retry was unavailable.

## 2026-09-16 — Province counts on dense national maps

- Country and nearby maps with more than 200 mapped results over several
  provinces show one count per province below zoom 8 instead of every exact
  point. Placement tests with the live catalog found that separate labels for all
  50 provinces fit only from zoom 7 (95 overlapping pairs at zoom 5), so counts
  that would touch combine at the larger count and name every province in their
  tooltip and accessible label. Merging into the nearest instead of the first
  overlapping count produced no more coherent groups; the deterministic rule stays.
- Verified the isolated production build at 1440×1000 and 390×844. Spain opened
  at zoom 5 with 12 counts and no producer layers (previously about 12,200
  points, each with a visual and a hit-area circle); at 390 px it opened at
  zoom 4 with 5 counts and no horizontal overflow.
- Activating the combined Catalonia/Huesca count moved to zoom 7 with all 50
  province counts separate; Barcelona then opened at zoom 9 with its exact points.
  Zooming out returned 50 counts at zoom 7 and 31 at zoom 6. A selected producer
  kept its exact point and anchored card above the counts. Keyboard focus opens
  a count's tooltip; Enter opened Baleares at zoom 8 (318 points) and kept focus
  on the map.
- `queso` (1,361 national results) showed 14 counts, `queso cabrales` (27) kept
  exact points, and the Barcelona province page kept all 2,371 points at zoom 7.
  While the national catalog loads, the map now says so instead of reporting
  invalid coordinates. Console output showed only the local Vercel Analytics 404.

## 2026-09-16 — Guide article layout: initial table of contents, full-width reading, producer grid and expanded map

Visual review: **passed** at 1440 × 1024 and 390 × 844.

### Fidelity review and corrections

| Surface | Decision and observed result |
| --- | --- |
| Table of contents | Relocated the index ("En esta guía") from a sticky 240px sidebar to an opening editorial block at the beginning of the article right after the cover image. Numbered sections are displayed in a responsive auto-fit grid (`minmax(min(100%, 300px), 1fr)`) with clean inline text links and integrated auxiliary links ("Nuestro criterio editorial" and "Fuentes y revisión") on a subtle bottom rule. |
| Article container | Removed the 2-column sidebar constraint (`.articleLayout`), allowing the article to occupy the full page width (`1216px` at 1440px viewport). Maintained optimal typographic reading measure (`max-width: 68ch`) on body paragraphs and list items. |
| Producer selection | Replaced the forced horizontal slider (`overflow-x: auto` / `scroll-snap-type`) with a responsive CSS grid (`repeat(auto-fill, minmax(min(100%, 340px), 1fr))`). Producers display 3 cards across desktop without horizontal overflow or hidden cards, 2 cards on medium viewports, and 1 card on mobile viewports. |
| Guide map | Expanded the interactive map container to full article width (`1216px` on desktop) and increased its height from 420px to 560px on desktop (440px on tablet, 360px on mobile). Markers and interactive cards have ample room across the territory without vertical cramping. |

## 2026-09-15 — Producer profile photo enlarge button and preview removal

Visual review: **passed** at 1440 × 1024 and 390 × 844.

### Fidelity review and corrections

| Surface | Decision and observed result |
| --- | --- |
| Profile photo gallery | Removed the enlarge overlay button and dialog preview on click from both the single photo and multi-photo gallery. Clicking or tapping the photo no longer opens the enlargement modal, preventing accidental triggers during page scroll and mobile touch interaction. Standalone images retain thumbnail switching and touch swipe navigation. Full-size photo viewing remains available directly via native browser context ("open image in new tab"). |

## 2026-09-14 — Product imagery, illustrated footer and QR invitation

Visual review: **passed** at 1440 × 1024 and 390 × 844. The approved
[image reference](../references/product-in-the-light.png) is 1487 × 1058;
it was compared with the rendered implementation together, using the desktop
viewport above and a separate narrow-screen check.

### Fidelity review and corrections

| Surface | Decision and observed result |
| --- | --- |
| Page background | White header; small cheese/wine still lifes blurred in the outer body margins. First pass was almost invisible at 24px desktop gutters; 80px wide-discovery gutters and 0.28 shared opacity expose the food without painting over text or map geography. |
| Map and list | The map remains the larger column. Tile saturation increased from 0.35 to 0.75. Focus on Caterí Cuinant Formatges highlights its row and opens the existing preview beside its map point. The production map remains taller than the illustration and uses the actual catalog and reviewed images. No fictional reference producers or invented list photos were copied. |
| Profile | Pinullet retains its real photo, identity, links and map. Ingredient imagery sits below the header and behind the outer margins. At 390px, the photo, actions and text remain readable without horizontal overflow. |
| Footer | Replaced the fixed page decoration that could cover the footer with a bounded absolute layer. The full navigation and illustrated landscape are visible below Pinullet. The delivery cyclist begins when the scene enters view and makes one 18-second pass. Its transform changed during the browser check; iteration count is one. |
| QR interaction | Shared producer/selection invitation transitions from the supplied C to a QR icon on hover/focus. The native dialog opens with a short rise/fade, closes by button, Escape or backdrop, returns focus to its trigger, and locks background scrolling. Wide layout uses two columns; mobile stacks content with internal scrolling and no horizontal overflow. |

The reference establishes imagery and atmosphere, not a replacement catalog
layout. Typography keeps the approved light Outfit foundation. Other categories
stay white until a matching image has been reviewed. The footer includes all
existing public links, rather than the reference's three illustrative links.

### Functional checks

- QR copy returned the exact canonical `https://chisan.app/es/barcelona/chisan`.
- Actual downloaded producer and long Japanese selection PNGs were decoded with
  `jsQR`: both were 1200 × 1600 and contained their expected canonical URLs.
- Producer QR eligibility and opt-in remain at the existing server boundary.
  The local review used the real shared component in a temporary route, removed
  before the release gate. No account or database writes were performed.
- White/background/ink contrast, clear focus, 44px close target and semantic
  dialog naming were reviewed. Reduced-motion CSS suppresses the QR entrance,
  decorative journey and hover displacement; this fallback was inspected in
  code, not through a changed operating-system preference.
- `scripts/test-profile-qr.ts`: five checks passed. Focused ESLint passed.
- `pnpm verify:ai` completed successfully, including lint, production build,
  data/contracts and behavior tests. Frozen-lockfile install was unchanged.
  A concurrent candidates-documentation commit was then fast-forwarded;
  documentation was checked again before publishing.
- Local development still reports the pre-existing catalog-tool schema
  serialization diagnostic from unchanged code, plus a lazy-footer LCP advisory
  on the short temporary fixture. Neither is evidence of a new production error.

### Captures

- [Dairy map and linked preview, desktop](product-light-dairy-map-desktop.png)
- [Wine map, desktop](product-light-wine-map-desktop.png)
- [Wine map, mobile](product-light-wine-map-mobile.png)
- [Profile, mobile](product-light-profile-mobile.png)
- [Profile footer, desktop](product-light-profile-footer-desktop.png)
- [Footer, mobile](product-light-footer-mobile.png)
- [Producer QR, desktop](product-light-qr-desktop.png)
- [Long Japanese selection QR, mobile](product-light-qr-mobile.png)

Brand cleanup removes obsolete v0.2/v0.3 references from active resources and
places dated QA in `history/`. The current identity owner is
[brand/README.md](../brand/README.md); its wordmark and favicon are separate.


## 2026-09-15 — National search in the existing explorer

- Added the country/current-province/nearby selector beside the existing search
  field. Province URLs retain their province default. Full public base descriptions
  and featured-product summaries now use the same literal relevance logic as the
  API; no expanded products, stemming, synonym expansion or new editorial fields.
- Verified the isolated production build at 1440×1000 and 390×844, including the
  long Santa Cruz de Tenerife scope label, with no horizontal overflow.
  Evidence: [desktop](national-search-desktop.png), [mobile](national-search-mobile.png).
- `miel de brezo` returned 66 national results with the exact-name Cantabria
  producer first; its list link opened the correct Cantabria profile. Empty
  queries, Back/Forward, and retained text/scope worked. Existing map-point
  anchored previews and province navigation were preserved from current main.
- A 50 km manual radius around the test point (41.2, 1.7) included Barcelona and
  Tarragona. Selecting nearby did not request geolocation; the explicit action
  handled a simulated denial and a subsequent successful position. Coordinates
  remained in browser memory and absent from navigation/transport parameters.
- A simulated national transport 503 showed retry without partial results;
  removing the failure and retrying restored the full national search. API tests
  also verify revision changes, bounded pages, full-text matching and identical
  browser/API ordering. The list retains unmapped producers outside radius mode.
- `pnpm install --frozen-lockfile --offline` and the complete `pnpm verify:ai`
  passed in the isolated release worktree. Local production-build console output
  included the expected unavailable Vercel Analytics script and CSS preload
  notices; no search runtime error was observed. Earlier shared-worktree QA had
  a local server collision; the isolated guide-route and full behavior checks passed.
