# Current design QA

Active system: [Product in the light](../README.md). Earlier verification is
preserved in [history](history/README.md); it does not specify the current brand.

## 2026-09-20 — Free gallery completion

The free gallery editor was checked at 390×844 first, then 1280×900, in a
temporary local fixture rendering the actual component without account writes.
Spanish and Catalan labels were reviewed. The fixture was removed afterward.

- Camera frames stack on mobile and form three columns on wide screens; text
  remains readable and the mobile document has no horizontal overflow.
- Zero and two photos show progress and optional photo ideas. At five photos,
  the frames disappear and upload is disabled. Published and new proposal photos
  remain distinct; the count is derived locally, without telemetry or storage.
- Selecting a frame without rights confirmation focuses the checkbox and shows
  its error. Confirming rights enables the existing upload action. No test image
  was uploaded and no claim or proposal was submitted.
- The Pro editor retains its product target selector and does not show the free
  five-photo progress indicator.
- The former hero invitation now sits beside the gallery. Its existing viewer
  checks are retained; members receive a direct link to the gallery editor.
- Release follow-up: the public Aceites Oro Bailén profile rendered correctly
  at 390×844 and 1280×900 in an isolated checkout with accounts disabled. The
  mobile document had no horizontal overflow. The signed-in invitation and
  authenticated publication were not exercised against a live account.

Validation: lint, TypeScript, production build, docs, design, database schema,
account/content/data/localization and all remaining unit suites passed. The
initial `verify:ai` run was interrupted at `test:behavior` by the shared dev
server lock; its later HTTP retry also hit local proxy errors. Release preflight
closed that gap: after `pnpm install --frozen-lockfile`, `PORT=3220 pnpm
test:behavior` passed in an isolated checkout containing the exact application
changes, including guide-to-producer links, redirects, robots and sitemap. The
five suites following the HTTP gate had already passed separately. No source
workaround or production credentials were needed for the retry.

## 2026-09-19 — Shelf analysis feedback and usage

Visual review: **passed** at 390×844 first, then 1440×1000, using the authenticated
local owner and staff pages. Both pages fit without horizontal overflow. Receipt
and exhausted allowance are visible, the analysis button is disabled at zero
remaining attempts, and manual correction stays in an optional disclosure. The
staff diagnostics correctly report missing historical token usage as unknown.

The staff page now leads with receipt/processing/result state, refreshes pending
analysis, displays the shared attempt allowance and exposes safe API diagnostics
and reported token usage. Manual point correction and catalog search are secondary
disclosures. Owner copy confirms receipt and explains stopped analysis without
asking the owner to place points. `pnpm verify:ai` passed, including automatic
point creation and usage/error recording with a simulated provider.

A subsequent local pilot with a valid API key verified the live pending-to-ready
refresh, reported usage and owner proposal. Four controlled attempts on one real
portrait shelf photo exposed misplaced points on other rows and price cards.
Adding image dimensions alone did not resolve this. A temporary coordinate grid
on the inference copy improved the observed placement; the displayed original
remains unchanged. The last inference produced 17 automatic points linked to
seven catalog producers. Review then excluded two points with an incorrect brand
attribution, leaving 15 points for six producers with their automatic coordinates
unchanged. The staff correction was saved as a proposal, without owner publication
or another model call. Unmatched observations remain excluded.

The final photo was checked at 390×844 first, then 1440×1000: no horizontal
overflow, points on the corresponding products, and no inference grid shown.
Photo-to-map and map-to-photo selection worked; unchecking a proposed producer
removed its points and checking it again restored them. Publication was left to
the owner. This single-photo pilot does not establish general recognition or
positioning accuracy; some points remain near label edges, catalog name matching
leaves legible brands unresolved, and a valid catalog name does not by itself
prove the model's brand attribution.

## 2026-09-18 — Map visitor location marker and locate control

Visual review: **passed** at 390×844 and 1280×900.

A transient, client-side locator marker ("blue dot" with animated pulsing halo) indicates the visitor's position on all Leaflet discovery and profile maps once location is detected. A dedicated locate button allows centering on the visitor.

| Surface | Decision and observed result |
| --- | --- |
| Visitor locator dot | Styled as an elevated blue circle (`#2563eb`, 14px) with crisp 2.5px white border and soft drop shadow. An outer halo ring (32px) animates a gentle pulse (`chisan-locator-pulse`) to provide immediate recognition similar to standard navigation apps. A tooltip displays "Tu ubicación". Under `prefers-reduced-motion: reduce`, the pulse animation is disabled while keeping the static marker visible. |
| Map locate button | Positioned at top-right of the map with standard 44×44 px minimum interactive target. Uses `@phosphor-icons/react` `NavigationArrowIcon` (or spinner when resolving). When location is already known, tapping pans smoothly to the user position. When inactive, it queries and centers. |
| Mobile first (390px) | Tested within the catalog area map and producer profile map. The control button does not collide with attribution or floating elements. On touch screens, the 44px target is easily tapped without misclicks. |
| Privacy invariant | Position coordinates remain strictly in ephemeral React memory (`visitor-position.ts`) and are never written to disk, local storage, URL params or telemetry. |

## 2026-09-18 — One-square C across logo, app icon and QR

Visual review: **passed** in an isolated production build at the browser pane's
desktop width and at 375×812.

A new identity sheet replaces `brand/chisan-reference.png`. The initial C now
carries one detached square in its upper-right opening; the lower-right arm
belongs to the C itself. The sheet is the wordmark alone, with no separate icon
artwork and no alpha channel, so the export pipeline changed as well as the
pixels. The previous two-square C is retired; Git preserves it.

| Surface | Decision and observed result |
| --- | --- |
| Silhouette source | The sheet is opaque where the old one carried alpha, so `build-favicon.cjs` derives coverage from the red channel (ink 2, paper 254) instead of reading source alpha. One path serves either kind of sheet and keeps the antialiased edge. Wordmark exports still take flat forest `#00563F`, which normalises the sheet's lighter `#026D4D` ink. No glyph is redrawn. |
| App icon | No icon artwork is supplied any more, so it is composited rather than extracted: the same C reversed on a full-bleed forest square. The corner radius (0.192 of the side, fitted over 54 rows of the old corner) and the glyph inset (0.649) are measured from the earlier supplied icon, so the container keeps its approved proportions. It now uses brand forest `#00563F` where the supplied artwork was `#02593C`, which aligns the icon with `themeColor` and the `moss` token. |
| Wordmark proportions | The new wordmark is flatter: 1485×339 against the old 1494×397. `.chisan-wordmark` carries the real ratio, so at the unchanged 7rem width the header logo renders 112×25.6 px instead of 112×29.8 — about 14% shorter. The width tokens are deliberately left alone; recovering the earlier optical weight is a separate judgement, not part of adopting the artwork. |
| Header and footer | Header wordmark read clearly at both widths and the footer wordmark at 96×21.9 px on its light surface. `link[rel=icon]`, the 512 px PNG icon and the 180 px Apple touch icon all resolved, and `/favicon.ico` returned 200. |
| Profile QR | No code change: the canvas and the download both consume `public/brand/chisan-mark.svg`, so regenerating the asset is enough. The excavated area stays a fixed 160 px box in an 880 px level-H code, so the new silhouette cannot change decodability, but it was decoded anyway. |

The QR dialog needs the account database, authentication and a premium
entitlement, so it was not driven in the browser. Instead the label was
reproduced from the component's own props (880 px, level H, `marginSize` 4,
moss for producer and ink for selection, the mark excavated at 160 px) and
independently decoded: producer short and long and selection short and long all
returned their exact URLs, with finder patterns intact. Producer profile pages
were not rendered in this pass; nothing in the change is route-specific.

`pnpm check:design` reported no blocking regression. `lint`, `check:docs`,
`test:i18n` and `test:behavior` passed.

## 2026-09-17 — Producer hero claim CTA for unverified profiles

Visual review: **passed** at 390×844 and 1280×900.

An unverified producer profile now includes a prominent call-to-action block inside the hero section (`.detail-hero-claim`), inviting the producer to verify and claim their listing with clear, immediate incentives (verified producer badge, direct contact control, free 5-photo showcase). No visitor statistics or counters are shown.

| Surface | Decision and observed result |
| --- | --- |
| Hero claim block | Positioned immediately following the producer title and badge row inside the hero grid. Styled with an earthen tinted container (`rgba(98, 125, 110, 0.08)` / `rgba(98, 125, 110, 0.2)` border), 12px radius, Outfit typography, and a prominent badge icon (`SealCheckIcon`). |
| Visual hierarchy & contrast | The CTA card provides clear visual distinction from the rest of the hero without overwhelming the identity. In pending state (`.detail-hero-claim--pending`), warm amber tone (`rgba(224, 159, 62, 0.1)`) and `ClockIcon` signal in-review status. |
| Touch target & responsiveness | The action button/link (`.detail-hero-claim__action`) maintains a minimum height of 44px with 16px horizontal padding. On mobile (390px), the content stacks cleanly with full-width button and no horizontal overflow. On wider viewports (≥32rem container), it aligns in a single row with the action right-aligned. |
| Conditional rendering | Only rendered for profiles without an active verified owner and where the viewer is not already an active member. Server-side check with fallback ensures no layout shifts or broken profiles if database is unavailable. |

## 2026-09-17 — Mobile first

Visual review: **passed** in an isolated production build at 390×844 first, then 1280×900.

The phone is now the primary surface and the base of a future web-based app. An
audit of home, country, Barcelona discovery, a profile and the guide library at
390 px found no horizontal overflow; the problems were scrolling and touch
targets. Account pages need the account database and were not rendered.

| Surface | Decision and observed result |
| --- | --- |
| Discovery roster | On narrow screens the persistent roster was a 196 px scroll box inside the page (about one and a half rows of 400). It now scrolls with the page (a 44,973 px list with no inner scroller). Activating a map point at scroll 250 kept scroll 250, opened the card above the point, wrote `highlight` and appended the row at the end without reordering. At 1280 px the side column still scrolls on its own (486 px list). |
| Roster actions | "Mostrar más" rendered as an unstyled native button at every width. It now uses the white secondary button of the profile distance tool (44 px, `moss` edge, 8 px radius, Outfit 500); the national-catalog retry shares the class but was not triggered. The result count aligns with the rows. |
| Touch targets | The discovery and country breadcrumb links were 15 px tall and now have a 44 px target without changing the line; a point 12 px above or below still hits the link, 30 px below hits the heading. Guide topic links grew from 20 to 44 px tall, the "Más categorías" chip from 42 to 44 px wide and the header wordmark link from 25 to 44 px tall with the mark unchanged. |
| Safe areas | The sticky header adds `env(safe-area-inset-top)`; header height stayed 72 px at 390 px and 80 px at 1280 px, where the inset is zero. |

`pnpm check:design` now notes new `max-width` viewport queries (baseline 31).
Console errors were only the local Vercel Analytics 404s.

## 2026-09-16 — Stronger cover, caption disclosure and one-line place and category

Visual review: **passed** in an isolated production build at the 350 px browser pane and 1280×900.

| Surface | Decision and observed result |
| --- | --- |
| Cover | Taller and free of text beneath it: 320 px at 1280 px (was 282) and 224 px at 350 px (was 200). The name row alone overlaps the photograph by 60 px on desktop. |
| Captions | Caption and credit now sit behind a 44 px info disclosure at the top right of the cover and of each strip photo. Closed by default; a real click in the pane opened and closed it, and the open panel stayed inside the photo (262×88 px on a 270×202 strip photo). |
| Place and category | Municipality and categories form one 13 px line below the cover edge (`Santa Coloma de Gramenet · Otros`, `Gelida · Vermut · Vino`). At 350 px, "Otros" no longer drops to its own row. With four simulated items the municipality truncates first and categories stay whole; 8 px of room keeps the focus ring unclipped. |
| Cut width | The line below the cover no longer widens the cut. At 350 px the pending status wraps inside the name block instead of running under the photograph; with an identity image, only the image enters a 96 px cut and a 58-character name uses the full width below the photo. |
| Strip on narrow screens | Photos are 192 px tall at 350 px so the next one peeks in (257 px photo in a 284 px strip). |

No horizontal overflow at 350 px for the demo, Vins Ollé or `100% Conill (Albert Puig)`.

## 2026-09-16 — Producer cover, identity image and public photo strip

Visual review: **passed** in an isolated production build at 1280×900 and 375×812.

| Surface | Decision and observed result |
| --- | --- |
| Gallery visibility | Every profile shows its reviewed standalone gallery; ownership and premium no longer gate it. The fictional demo `es:12439` now shows its five standalone photos without account state. |
| Cover | The first landscape gallery photo of at least 1,200 px becomes a low cover: 282 px tall at 1280 px (previously a 416 px trial) and 200 px on mobile. Portrait, small or missing photos produce no cover. |
| Name in the cover | The name block cuts into the lower-left edge, so the name shares the photograph's level; the photograph continues to its right. Concave corners repeat the 16 px (desktop) and 12 px (mobile) radius. A coincident-edge seam seen at fractional scaling was removed by extending each white surface one line past the photo edge. |
| Identity image | Vins Ollé's reviewed logo shows as a 117×88 tile beside the name without a cover. A simulated logo, follow button and a 58-character name inside a cover stayed readable: the tile moves above the name on mobile and 48 px of photograph remains beside the cut. |
| No filler | `100% Conill (Albert Puig)` has no `imagen` or gallery and renders no header image; the generic placeholder is not used in the header. |
| Photo strip | Four demo photos share one 202 px row at their own ratio before Details on desktop; on mobile they are 208 px tall and scroll sideways (1,145 px content in a 309 px keyboard-focusable strip). The hover rule scales to 1.03 inside the rounded frame only under `(hover: hover)` and is removed for reduced motion; the pane's synthetic pointer did not trigger `:hover`, so the rule and clipping were checked in computed styles. |

The page had no horizontal overflow at 375 px. Console errors were only the local
Vercel Analytics 404s.

## 2026-09-16 — Peninsula opening view for dense national maps

- The national view framed every mapped producer, so the Canary Islands pulled
  Spain to a corner beside North Africa. Country maps above 200 mapped results
  now open on their main connected cluster with a 24px margin. Simulating
  Leaflet's fit with the live catalog showed that dropping the islands alone,
  with the previous 20% margin, still opened at zoom 5 at 1280 px and zoom 4 on
  mobile; the pixel margin adds that level at both widths.
- Isolated production build: Spain opened at zoom 6 at 1440×1000 and 1280×800
  (31 counts, 20 of them single provinces; before, zoom 5 with 12 counts at
  1440 px and, in the fit simulation, zoom 4 with 5 at 1280 px) and at zoom 5 at
  390×844 (12 counts; previously zoom 4 with 5), without horizontal overflow. Only the combined Canary count was outside the view, and
  one zoom-out step on mobile brought it back.
- `queso` (1,361 results) opened at zoom 6 with only its 59 Canary producers
  outside; `gofio` (8, all in the Canaries) kept the full-set framing; the
  Barcelona province page kept zoom 9 with 2,371 points. Console output showed
  only the local Vercel Analytics 404s.

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


## 2026-09-19 — Shared selection shelf photos

Checked the real selection explorer, upload form and staff point editor with a
local, disposable schematic fixture at 390×844 first, then 1440×1000. No real
shelf photo, account mutation, provider request or WhatsApp message was used.
The fixture route and SVG were removed after verification.

- Map above photo, 44px photo buttons, shared selection in both directions and
  all repeated products highlighted. Zoom doubles the image inside its own
  horizontal viewport without page overflow. Basic profiles retain their map
  and roster when no reviewed shelf exists.
- Compact producer link keeps the selected product's context close to the photo.
  Fixed incorrect colour-token references found during visual inspection; point
  numbers and selected rings now have visible contrast. Normalized centres use
  the actual image ratio, with no cover crop. The existing visitor location
  control remains; no device position was requested during this check.
- Added Leaflet container resize observation: all three test producers remain
  inside the compact map after initial layout and a desktop/mobile resize.
- Staff can add a point, assign its producer, edit label text and change the
  percentage position by keyboard. The editor stacks on phones and uses two
  columns on wide screens. Upload consent uses the entire text label as its
  touch target. Long unbroken labels and a Japanese producer name do not create
  horizontal page overflow.
- Integration tests use migrated PGlite databases for receipt, permissions,
  review/version conflicts, publication, withdrawal, shared AI allowance and
  replay protection. This fixture-based browser check does not verify live
  recognition accuracy or the configured Meta delivery pipeline.
- The development shell still reports its pre-existing WebMCP input-schema
  serialization notices and development Clerk warning. No shelf-specific
  console error remained after correcting the temporary fixture image source.
- `pnpm verify:ai` passed with external database access disabled and a dedicated
  local server, including eight shelf integration tests and sixteen WhatsApp
  tests. The migration was exercised in PGlite; no live migration, paid inference
  or production activation was performed.

## 2026-09-19 — Staff admission before shelf analysis

Checked the changed review and upload components with a disposable local
fixture at 390×844 and 1440×1000. The fixture and schematic image were removed.
The admission explanation and action fit both layouts without horizontal
overflow. Publication stays disabled for a received photo even when a valid
manual point exists; the owner sees "Pendiente de admisión por Chisan".

- Uploads through either channel leave a `received` photo and do not schedule
  inference. Only an active staff review action admits it. Saving manual points,
  duplicate submissions and stale admission requests cannot bypass this step.
- `pnpm verify:ai` passed, including nine shelf integration tests and sixteen
  WhatsApp tests. Migration coverage confirms that old pending jobs return to
  admission, retain their points and invalidate in-flight results.
- Applied the required migrations to the isolated local PostgreSQL database
  after a backup, checked the migration registry, and enabled shelves locally
  with one shared AI attempt. No paid inference or WhatsApp delivery was used
  during verification; recognition quality remains for the user's photo test.
- The browser fixture retained the existing development Clerk and WebMCP
  serialization notices; no admission-specific error was observed.
- Local development requests to account pages stalled, so the final local
  smoke check used the validated Next build with `pnpm start --hostname
  localhost --port 3000`. Both account and review routes correctly redirect an
  anonymous visitor to sign-in; the Clerk test-instance form rendered. The
  authenticated photo flow remains for the user's test. No public deployment
  was performed.

## 2026-09-19 — Public follows and owner shelf proposals

Checked the proposal, upload and supporting review UI with disposable local
fixtures at 390×844 first and 1440×1000. Both widths had no horizontal overflow.
The fixtures used existing local imagery and simulated matches, without account
writes or paid inference, and were removed after verification.

- Map and photo select each other. Unchecking a producer removes its markers
  and points from the preview; clearing all choices disables publication.
- Selected producers, the permanent profile handle and canonical municipality
  appear in one owner confirmation form. A failed publication keeps choices and
  inputs and restores the button. Private-profile publication is explained.
- Ready proposals can be published by the owner. Review state has no publish
  control. Staff can prepare a proposal and resolve uncertain labels; their
  screen no longer offers admission or publication on behalf of an owner.
- Following is public. Per-favorite sharing and account attribution switches
  are removed, with aligned onboarding, profile and privacy text.
- Existing development WebMCP schema-serialization notices remain unrelated;
  no shelf-specific rendering error was observed. Recognition quality and a
  real authenticated photo upload remain for the user's one-call local pilot.
- `pnpm verify:ai` passed, including eleven shelf tests and the existing account,
  WhatsApp, catalog and behavior suites. The migration preserves legacy follows
  and private/unlisted whole-profile settings in isolated database tests.
- Applied migration `0020` only to the verified local PostgreSQL instance after
  validating a recoverable backup. Its runtime registry matches the repository;
  the shared allowance remains one attempt, with zero consumed. WhatsApp stays
  disabled locally. No public deployment or paid inference was performed.


## 2026-09-20 — Immersive mobile catalog map

Final result: passed.

Adapted the user's Fever and Alltrails screenshots to the existing Chisan web
catalog. This is an interaction/layout adaptation, not a reproduction of their
brands, content or device chrome. Both supplied images are 574×1280 pixels.
The comparison removes the Fever status/home chrome (80px top, 38px bottom)
and the Alltrails browser chrome (170px top), then fits each content crop in a
390×844 panel beside the Chisan capture. The temporary combined comparison was
inspected at `/tmp/chisan-map-reference-comparison.png`.

Evidence (browser CSS size and screenshot pixels match at 1×):

- `map-immersive-mobile.png`: 390×844, `/es/barcelona?highlight=55`, Abadal
  selected, closed sheet. Search and categories end at y=129; the map spans
  the full 390px width and the remaining 715px, beneath the card and sheet.
- `map-immersive-mobile-list.png`: 390×844, Café filter and Cafés Soriano
  selected, open sheet. The matching row is revealed and the list reaches the
  bottom edge without map controls painting over it.
- `map-immersive-desktop.png`: 1440×1000, the same Abadal selection, a 360px
  roster and 1080px map. The active result stays reachable after resizing.
- Also inspected at 320×568: search, scope, menu, categories, location, card
  and list handle stay inside the viewport; document width remains 320px.

The full-view comparison confirms the icon/search/menu header and category
strip from Alltrails, and the overlaid card/expandable roster pattern from
Fever. Focused inspection of the header, card and sheet verified type wrapping,
44px targets, visible focus and layer ordering. Chisan keeps Outfit, the forest
palette, existing category pictograms, reviewed imagery and exact producer
coordinates. The header and controls use shared colour/shape tokens; card
photographs retain their supplied content and may include source whitespace.
App copy describes producers and territory, with no borrowed event/trail copy.

Comparison iterations and fixes:

- P2: map controls appeared above the expanded sheet. Isolated the map stage's
  stacking context; final open-sheet evidence has no controls over the roster.
- P2: an inherited 352px list-body cap left unused space in the open sheet.
  Removed that cap for this viewport surface; the final list fills its panel.
- P2: releasing a mouse drag over a newly revealed row could change its preview.
  Pointer hover previews now apply only to the wide roster; opening the phone
  sheet retains the selection. Touch and keyboard keep their own interactions.
- P2: a selected row hidden on a phone could remain below the fold after a wide
  resize. Observe the roster's available size and reveal the pending selection
  once the row fits, without scrolling the map or changing the producer order.
  The wide roster has no height transition; the final resize check shows the
  complete selected row inside its scrollable bounds.

Interaction checks covered native horizontal scroll in both directions,
previous/next controls, marker-to-card selection, stable ordering, an explicit
selection beyond the initial list page, upward/downward sheet dragging, tap and
Escape, category and text filtering, empty results, national loading and scope,
producer-profile navigation, browser Back and restored selection. The carousel
mounts at most seven slides while reaching every result; the full roster keeps
its existing 400-result incremental loading. Profile navigation restores the
ordinary header, footer and page scrolling.

Validation: `pnpm verify:ai` passed its build, design, account, data, geography
and editorial gates, then encountered HTTP 500 in the pre-existing development
server during guide-route checks (server logs: `spawn EBADF` and proxy socket
hang-ups). Re-ran `test:behavior` against the compiled local server on port 3001;
it and the remaining content, agent, guide, WhatsApp and shelf suites passed.
After final interaction fixes, `pnpm verify` and focused catalog/browser checks
passed again. `check:docs`, `check:design` and `git diff --check` passed.
Existing style notices remain non-blocking; new map control targets are 44px
or larger and motion respects reduced-motion preferences.

The clean compiled preview reported no browser console errors. The development
server retains its earlier WebMCP serialization notices. No native location
permission was requested during QA; real-device safe-area/keyboard behavior
remains a device-level follow-up. No account write, catalog change, commit,
GitHub push or public deployment was performed.

## 2026-09-20 — Compact discovery and shared producer following

Passed after refinement at phone, intermediate, short-wide and desktop sizes.

Refined the immersive map after user review. Category controls keep 44px touch
areas and equal visible 8px gaps to the search row and map. Inactive categories
show their existing pictograms; selection, pointer hover and keyboard focus
unfold the 12px label. Reduced motion disables that transition. The scope filter
is a small icon opening an animated panel; focusing search opens the same panel.
Header menus preserve map selection and the account trigger renders immediately.
Narrow headers use the compact menu icon; roomy headers retain the full account
trigger with the sign-in label or the existing personalized greeting.
Roomy discovery containers show every available category in the same row without
a plus control; overflow remains horizontally scrollable. Narrow ones retain
the compact primary row and expandable additional categories.

The 44px sheet handle uses concise count/Map copy. In tall maps its collapsed
132px surface previews a real result, moving the card strip upward with a visible gap; opening
uses up to 92% of the map. Photo rows have an independent 44px person-plus follow
control, with person-check for an existing follow. Profiles use the same action
and visible label. Guests open registration with the current route and filters
as their return path. Follow state is shared within the session; account reads,
desired-state writes, pending actions and failures remain server-authorized.

Province/national discovery, public selections, shelf-linked selections and
guide maps share the carousel, photo roster and sheet. Embedded maps retain
page context and selections retain their original membership/order. The guide
check caught inherited prose styles widening the roster; explicit shared column
layout and width now keep every row and follow action within the map. Single
producer location maps remain static contextual maps.

Browser checks covered 390px and 320px, Barcelona and Madrid, national search,
category selection, disclosure/keyboard operation, profile and registration
navigation, local public-selection swiping and guide-card keyboard navigation.
An explicit selection beyond the first 400 rows stays visible after closing and
reopening the sheet and after a wide resize. Header-menu Escape preserves the
selected marker and card.
Responsive checks covered 320×568, 390×844, 600×800, 720×840, 640×360,
740×430, 820×1180, 1024×768 and 1440×880. Containers govern composition;
header/category transitions are independent of the map's sidebar. The sidebar
varies from 288px to 360px and cards remain centered, capped at 480px. Short
maps reduce the collapsed sheet to its handle and omit card descriptions.
Every checked viewport retained the card and location control inside the map,
without document overflow or card/location overlap. In narrow map columns,
attribution sits on the left above the card, clear of carousel navigation.
Zoom controls use 44px targets even after Leaflet's styles load.
The local account screenshot was kept temporary; no account photo or private
account fixture is included in the repository. No real follow/account write,
registration, migration or public deployment was performed during verification.
Authenticated follow identity and unavailable state have render tests; the
existing isolated database suite covers idempotence and active-account checks.

Final evidence:

- `map-refined-mobile.png`: 390×844, Abadal selected, 64px header and 53px
  category strip, full-width map and compact closed-sheet result preview.
- `map-refined-mobile-list.png`: 390×844, Café roster with producer photographs
  and independent person-plus controls.
- `map-refined-desktop.png`: 1440×880, shared photo roster and selected card.
  All 28 category icons are directly available in the same 53px strip without
  the plus control; selecting an additional category updates the URL/results.
  The strip scrolls internally when needed without widening the document.
- `map-refined-guide.png`: 375×812, embedded guide map with the same expanded
  roster, contained row widths and follow controls.
- `map-responsive-foldable.png`: 720×840, full account label, all categories,
  centered card and bottom roster in an intermediate near-square window.
- `map-responsive-landscape.png`: 740×430, 288px roster, shorter card and map
  controls repositioned to stay clear of the producer content.

`pnpm verify:ai` passed in full against the compiled localhost server. Final
selection/menu adjustments passed `pnpm verify`, the 15 focused map and follow
tests and browser regression checks. Physical device keyboard/safe-area
behavior remains the device-level follow-up from the initial map review.

## 2026-09-21 — Public profile ISR and deferred account state

Production-build browser review covered `/es/barcelona/abadal-avinyo` with
category/highlight query context at 390×844 first, then 1440×900. The title,
description, follow and contact controls, product summary, location map and
nearby producers retain their responsive layout. Neither viewport had document
overflow, and the browser reported no console errors or warnings.

Public HTML is shared across visitors. Account management controls now resolve
privately after sign-in; follower names and avatars load only when opening the
list. Statistics collection is paused while its history remains available to
authorized owners. The browser run disabled accounts and database access;
isolated database tests cover owner/visitor separation, and the production
HTTP regression covers shared cache hits, safe redirects and private headers.
No authenticated browser session or Vercel deployment was exercised.

## 2026-09-21 — Compact mobile results handle

Browser review covered the discovery map at 390×844 first. The closed results
sheet is now a 44px handle with the localized producer count and geographic
scope; Barcelona, Huesca and national search rendered the expected Barcelona,
Huesca and España labels. No roster row or direction icon remains visible while
closed. Opening by touch exposes the full roster while the handle keeps only
its drag bar and a hidden “close list” accessible name.

At 1440×900 the handle remains hidden and the 360px roster stays visible. Both
widths retained the carousel, map controls and list without document overflow
or a framework error overlay. Temporary browser captures were not retained in
the repository. The development console still reports the existing WebMCP
schema serialization warning and absent local Vercel Analytics script; neither
originates in this presentation change.
