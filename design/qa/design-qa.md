# Design QA log

One entry per reviewed surface: what was decided, what was rejected, and why.
Not a checklist — that lives in [`../README.md`](../README.md). Reference only
evidence committed to this repo; local capture paths rot.

## 2026-09-05 — Public agent access without a new visual control

final result: passed

Reviewed the existing Granja La Pasiega profile at 1440 × 1000 and 390 × 844.
The page retains its profile, map and contact presentation with no horizontal
overflow; the agent adapter renders no widget or additional interaction target.
Browsers without WebMCP retain the same public page and JSON discovery links.
The updated How we work trust section also fits both widths: Chisan is the
public catalog source, supporting sources are explained globally, and ownership
confirmation stays distinct from the premium last-approved-change date.

Chrome 152 with `--enable-features=WebMCP` registered all three native tools.
Coverage, a Barcelona cheese search and an ID-based detail lookup completed
against the local production build. The detail kept the search result's exact
identity. On a same-document navigation from how-we-work to contact, the tools
went from three to zero. The only browser console error was the existing local
404 for Vercel Analytics, which is not served by `next start`.

Kept the integration independent of layout and account DOM. Visibility checks
are shared by HTML and the API; lifecycle, cancellation and disclosure boundaries
are covered by `scripts/test-webmcp.ts`, `scripts/test-public-expanded.ts` and
`scripts/test-catalog-agents.ts`. The full `pnpm verify:ai` gate passed.

## 2026-09-03 — Catalog microinteractions and feedback states

final result: passed

- Pointer hover and keyboard focus on a producer row temporarily emphasize its
  map point and keep the URL unchanged. Marker hover exposes the matching
  producer in the fixed contextual card, including when its row is outside the
  rendered list window. Only an explicit click persists `highlight` and zooms.
- Area-scale views use compact exact-coordinate points below zoom 11 and restore
  category pictograms from zoom 11. A separate 44px hit area keeps the points
  usable without inflating their visual footprint.
- Search highlighting preserves the original spelling in producer names,
  municipalities, category labels and descriptions while matching without
  diacritics.
- Map tooltips present producer, municipality and primary category without
  implying an outbound action. Their restrained reveal and the filter-pill
  press state use existing motion and colour tokens and honour reduced motion.
- The location action has distinct idle, locating, resolved and failed states.
  Manual selection invalidates a pending lookup; raw device position remains
  transient and successful navigation is never delayed for an animation.
- QR copy feedback replaces the action label for 1.5 seconds, keeps the button
  width stable, announces success once and returns without a toast.

This supersedes the earlier all-zoom pictogram rule for dense area overviews.
Rejected: automatic list reordering on marker hover, artificial location-success
delays, an animation dependency and global toast feedback for copying.

## 2026-09-02 — Producer distance from the visitor

final result: passed

Reviewed the Spanish Formatgeria La Cleda profile at desktop width and 390 ×
844, with the new control immediately above the existing location card.

- Idle desktop state: `design/qa/producer-distance-desktop-idle.png`
- Calculated desktop state: `design/qa/producer-distance-desktop-result.png`
- Calculated mobile state: `design/qa/producer-distance-mobile-result.png`
- The compact surface uses existing spacing, color, radius, type and focus
  tokens. Its action remains 44px high and becomes full-width on mobile.
- At 390px the document width stayed exactly 390px. The scoped accessibility
  audit reported no violations.
- The Spanish result rendered as an approximate straight-line distance with
  locale-aware number formatting. Permission denial also produced a local,
  non-blocking message.
- Profiles without both reviewed producer coordinates omit the control. Page
  load never requests device location; only the explicit action does.
- Network inspection after calculation showed no request containing the
  visitor position or calculated distance.

Rejected: automatic location requests, persisted visitor coordinates, road
distance or travel-time claims, and showing an unusable control when the
producer has no reviewed point.

## 2026-09-02 — Persistent mobile roster and category markers at every zoom

final result: passed

Reviewed `/es/barcelona` with the area map at its opening zoom and in the narrow
mobile layout.

- The mobile area roster is visible from initial render and remains attached
  below the map. Search and map interaction no longer control a separate list
  disclosure state.
- Every producer point uses its existing colourful category pictogram from the
  opening zoom onward. The 24px default and 32px selected treatments keep the
  existing 44px interaction target.
- Profile selection rosters retain their disclosure because they do not share
  the area search-and-map composition.

This explicit follow-up supersedes the earlier preference for overview circles
and the collapsed mobile area roster. Rejected: black overview points, closing
the area roster from search or map interaction, and expanding the pictograms
beyond their compact marker sizes.

## 2026-09-02 — Map-selected row and streamlined producer profile

final result: passed

Reproduced a Barcelona marker selection whose producer fell outside the first
400 nearby-prioritized rows, then reviewed the Casa Salieri profile at desktop
width.

- Marker activation now appends only the missing selected row, highlights it
  and scrolls it into view. The original 400-row order remains unchanged.
- The producer profile removes the repeated Map / Categories / Information
  bar; the breadcrumb remains the catalog-context navigation.
- Public email is presented as `Contactar`, and Facebook joins Instagram in the
  same compact action group. No secondary text-link strip remains.
- Account and ownership actions render after the location map and before the
  related-category section.
- The tested map and profile states had no horizontal overflow.

Rejected: moving the selected producer to the top of the roster, reordering the
nearby base list, retaining two visual tiers of contact links, and removing the
breadcrumb together with the repeated navigation bar.

## 2026-09-02 — Stable nearby-first producer list

final result: passed

Reviewed `/es/barcelona` at desktop width and at 390×844, then traversed three
consecutive producer rows with keyboard focus while allowing every linked map
movement to finish.

- The list is one continuous roster with producers near the opening map view
  first. The former `Show more` / map-only scope control is absent in desktop
  and mobile layouts.
- Starting pointer or keyboard navigation locks only the displayed order. Map
  focus, the active row, the category marker and the linked producer card keep
  updating; all tested row positions stayed byte-for-byte identical.
- The mobile disclosure exposes the same roster without horizontal overflow.
  The producer profile removes both redundant `Back to map` links while keeping
  the breadcrumb intact.

Rejected: reordering the DOM after each producer-focused map movement, a
one-way replacement for the removed scope toggle, and removing the profile
breadcrumb.

## 2026-09-02 — Printable profile QR labels

final result: passed

Reviewed the producer profile at 1280×900 and 390×844 using
`profile-qr-producer-desktop.png` and `profile-qr-producer-mobile.png`. The
collapsed control is visible directly below the profile hero; opening it shows
the Chisan wordmark, an unmodified high-correction QR with its full quiet zone,
and the producer name inside a `moss` rule. The mobile label is 310px wide in a
390px viewport with zero horizontal overflow.

The download action generated a 1200×1600 PNG. Its destination is the canonical
parameter-free producer URL. Public user selections reuse the same component
with the default `ink` rule, while private profiles expose no active label.

Rejected: a logo over the QR modules, green QR modules, route parameters in the
encoded URL and an always-expanded label that would dominate the profile.

## 2026-09-02 — Search and linked colourful producer preview

final result: passed

Source captures: `lovable-source-map-list.png` and
`lovable-source-producer-profile.png`. Implementation evidence:
`lovable-search-hover-color-icons.png`, `lovable-profile-color-icon.png`,
`lovable-map-color-icons-mobile.png` and
`lovable-profile-color-icon-mobile.png`. The paired reviews are retained as
`lovable-color-icons-map-comparison.png` and
`lovable-color-icons-profile-comparison.png`.

- The area search filters the already-loaded canonical producers by name,
  locality, category and description. It adds no catalog overlay and writes no
  search state to the public route.
- Overview zooms keep the compact 12/20px circles. At neighbourhood zooms the
  existing colourful category pictogram replaces the circle inside a 24px
  surface disc; hover, focus or selection grows only that producer to 32px.
  The pictogram markers retain 44px pointer targets.
- Pointer hover and keyboard focus now preview one producer across the list,
  map and shared producer card. The `moss-pale` row and `moss` edge make the
  relationship legible without changing `highlight`; click remains the durable
  selection. This explicit linked-preview requirement supersedes the earlier
  rejection of selected-list treatment.
- Producer profiles repeat the same category pictogram at 18px in a restrained
  40px framed surface. Existing hero, facts and map framing remain intact.
- No `Ver todos` control is present. At 390×844 the search, list disclosure and
  profile remain free of horizontal overflow, and the mobile list toggle stays
  visible. Desktop and mobile browser checks reported no console errors.

Rejected: large monochrome category glyphs, category pictograms at continental
overview zooms, a new producer data source, copying the reference typography,
and retaining a redundant `Ver todos` action.

## 2026-09-01 — Terminal-accent brand family

final result: passed

Compared the two approved ImageGen references with the production rasters in
`chisan-brand-terminal-accent-comparison.png`, then reviewed the wordmark in the
home header and footer. Focused implementation captures are stored beside this
log.

- The compact `c` keeps its original alpha silhouette and uses exactly two
  short `moss` terminal caps. The wordmark repeats the treatment only on the
  four natural terminals of `c` and `s`; `h`, `i`, `a` and `n` stay `ink`.
- The reverse raster uses `surface` for the letterforms and retains the same
  `moss` caps, avoiding a CSS filter that would recolour the signature.
- The favicon contains 16, 32, 48 and 256px PNG frames generated from the
  compact mark. All three production rasters contain only their approved body
  colour, `moss` and alpha.
- The first comparison found a P2 dark edge around several green terminals.
  Rebuilding the colour mask against the original raster geometry removed it;
  the second comparison has clean diagonal joins at every size.

Rejected: colouring every letter, enlarging the terminal caps into wedges,
putting green inside QR modules, and filtering the reverse logo into a single
colour.

## 2026-09-01 — Spain-first project summary

final result: passed

The neutral home now opens with the project promise and concise explanatory
copy, then presents the active catalog as a separate section. With Spain as the
sole published manifest, the catalog section uses one full-width Spain entry;
standby countries create no empty cards, placeholder controls or visual noise.
Location remains an optional action inside the catalog section, and manual
navigation still works without browser permission or JavaScript.

Rejected: a country-launch dashboard, disabled country cards, standby badges
and a Spain-specific component fork. The layout continues to render the
manifest-published collection and returns naturally to a multi-country grid
when more than one country is published.

## 2026-09-01 — Shared producer-map selection contract

final result: passed

Reviewed the selected state on the Barcelona area map and a producer-detail
map at a 360px mobile viewport. Both use the same 20px moss point, 3px surface
outline and selected rendering order; the area map also uses the shared
lazy-image name-description surface and outside/Escape dismissal.

The public-profile controller now crosses the same map boundary with the exact
`country:producer_id` key. Its map points and list rows select and focus each
other, selection is represented by the canonical `highlight` query, and its
mobile list uses the same attached disclosure as area discovery. Producers
without valid coordinates remain ordinary profile links.

Because the local account feature is intentionally disabled, the profile
controller was visually exercised with a temporary non-persisted component
fixture instead of manufacturing account state. At 360px, the attached list
opened without horizontal overflow, selecting a row closed it and focused the
card, and an unmapped producer ignored a manual highlight. At 1280px, map,
card and grouped list formed the same two-column composition as area discovery.
Back/Forward restored selection and outside activation cleared it. The fixture
also confirmed that Back returns from producer B to producer A. With the mobile
list open, the first Escape closed the disclosure and kept A selected; the
second cleared A and returned focus to the map. The fixture was removed after
review; no account or database state changed. Shared source contracts,
account-domain tests, lint and the production build provide the retained
regression evidence.

Rejected: a second marker renderer, profile-only selected styling, a selected
list-row treatment, duplicate profile links and eager list imagery.

## 2026-09-01 — Nearby-first producer map selection

final result: passed

Source: `../references/inspiration-alltrails-explore.png` and the supplied
AllTrails selected-trail mobile states. Implementation evidence:
`implementation-area-explorer-nearby-desktop.png`,
`implementation-area-explorer-nearby-mobile-closed.png`,
`implementation-area-explorer-nearby-mobile.png` and
`area-explorer-nearby-comparison.png`.

Reviewed `/es/barcelona?category=Pan+y+cereal&highlight=pastisseria-duch-abrera`
with 1440×900 and 390×844 browser window overrides, plus `/jp/tokyo` at
390×844. The retained captures show the resulting 1440×816 and 390×816 page
viewports; the lower-left `N` is the local Next.js development indicator, not
product UI. There is no horizontal overflow, visible producer totals or
selected-list styling.

- Default producer points are now 12px dark-moss circles. The selected point is
  a 20px moss circle with a 3px surface outline and is painted above the other
  points; the separate 28px interaction target remains unchanged.
- The default list contains only producers inside the current map bounds and
  follows distance from the map centre rather than alphabetic order. Panning or
  zooming updates it. A zero-result viewport has localized guidance. `Ver más`
  appends the broader mapped list after the nearby results, focuses the first
  newly exposed producer and can return to the map-only scope; every exposed
  row can therefore resolve to a marker.
- Selecting a list row updates and focuses the map point while the row itself
  remains visually neutral. The separate `Seleccionado` label is removed.
- The selected producer surface adds one lazy-loaded canonical producer image.
  No producer image is mounted when there is no selection, and the whole
  name-image-description surface remains the profile link.
- The mobile list remains attached beneath the map without a shadow. Its open
  state raises the moss border and pale-moss background enough to show the
  disclosure change without returning to a floating sheet.

The comparison retained AllTrails' map-led selection, nearby-result hierarchy
and compact selected surface without adopting route overlays, clusters or
floating control stacks.

## 2026-09-01 — Compact Barcelona area explorer

final result: passed

Source: `../references/inspiration-alltrails-explore.png` and the supplied
AllTrails selected-trail mobile state. Implementation evidence:
`implementation-area-explorer-compact-mobile.png`,
`implementation-area-explorer-compact-desktop.png` and
`area-explorer-alltrails-comparison.png`.

Reviewed `/es/barcelona?category=Pan+y+cereal&highlight=pastisseria-duch-abrera`
with 1440×900 and 390×844 browser viewport overrides. The mobile document has
no horizontal overflow (375 = 375 after the browser scrollbar), no error alert
or framework overlay appeared, and the local server reported no runtime error
during the interaction pass.

- The header now reads `Chisan · España · Barcelona`; the separate area line
  and visible producer totals are gone. The count remains screen-reader status.
- The category rail keeps every category and horizontal swipe, while its
  browser scrollbar is visually hidden.
- Default points remain 6px dark-pine circles and selection is an 8px
  dark-pine map state with a surface outline and separate 28px hit target. Map
  and list selection both update the canonical `highlight` query without a
  competing highlighted list row.
- The selected producer is one linked name-and-description surface. Pointer
  activation outside it and Escape remove `highlight` with replacement history,
  so no separate `Ver todos` control is needed.
- On mobile the producer disclosure is structurally attached below the map,
  full width and shadowless. It closes on outside activation, Escape returns
  focus to its toggle, and list selection closes it then focuses the selected
  producer surface.
- Producer rows show the locality name directly, without a `Municipio` prefix.
  The area selector lives with language and account actions in the top account
  menu; authenticated greeting and Favorites remain intact.
- A previously authorized, same-area device position may select 4–12 nearby
  producers within a bounded 25km fallback. The exact coordinate stays inside
  that local selection, is discarded immediately and never reaches the map,
  URL or storage.

The comparison retained AllTrails' compact map hierarchy and bottom access to
results without adopting route overlays, clusters, floating control stacks or
trail-specific imagery.

## 2026-09-01 — Public catalog inclusion criteria

final result: passed

Reviewed `/how-we-work` at 1440×900 in English and 390×844 in Spanish. All
seven explanatory regions retain a logical heading order, the mobile document
has no horizontal overflow (390 = 390), and the page and home route render
without a framework error overlay. The only browser message is the expected
local `/_vercel/insights` 404.

- Inclusion is now explicit: public identity, material production, a current
  own offer, productive place, connected evidence and a current distinct unit.
- Registers, associations, guides, maps, seals and certifications are described
  as claim-scoped evidence, never automatic admission. Commercial presence,
  popularity and resale likewise do not prove production.
- Missing evidence keeps a proposed unit outside the public catalog. Existing
  profiles are re-reviewed before a changed criterion leads to correction,
  merging, relocation or removal.
- The new sections reuse the existing flat editorial composition and list
  treatment. No card grid, badge, status colour or new visual primitive was
  introduced.

Rejected: country-specific certification requirements, retailer or restaurant
percentage thresholds, discretionary inclusion for perceived interest, and a
publication-time promise that the review workflow does not support.

## 2026-08-31 — Public favorite maps by proximity

Reviewed the public-profile list and map composition against the area catalog
pattern. Runtime profile capture remains a post-migration smoke check; this pass
did not mutate a connected account database merely to manufacture visual state.

- Shared producers are presented in three explicit sections: the profile's base
  municipality, the rest of its catalog area, and all remaining areas.
- Every row retains its category icon, municipality and bounded current catalog
  description. Empty sections remain visible so the grouping does not disappear
  when a profile has no nearby favorite yet.
- The first map frame uses the nearest section with valid coordinates while all
  mapped favorites remain available. Proximity does not change marker colour,
  producer evidence, ranking or authorization.
- Base location is a required, labelled account setting with grouped catalog-area
  options and a municipality field; help text explains its presentation-only
  effect.

## 2026-08-31 — Typography brought onto the system

Reviewed home, the Spain province index and the Barcelona catalog map at
1440×900, plus Japanese Hokkaido at 375×812. No horizontal overflow
(375 = 375). Fonts load; the only console errors are `/_vercel/insights` 404s,
which do not exist locally.

- Authored CSS weight is now 400 or 500 everywhere, including display headings
  and account-language controls that were outside that deliberate range.
- `h1`–`h6` were inheriting the browser's 700 because no rule set their weight.
  They are 500 now; size alone carries the hierarchy.
- Eleven components use `<strong>` as a label and already size it, so the rule
  that sizes it now sets 500 too. Without this the labels outweighed the page
  heading. `<strong>` in prose keeps the browser's bold, which is why weight 700
  stays loaded.
- Metadata rules below the 12px floor that relied on boldness for legibility
  were raised to 12px rather than kept bold.
- All 19 serif fallback chains removed. They rendered Noto Sans today but would
  have dropped every heading to Georgia if the webfont failed. `--font-fraunces`
  and `--font-roboto`, both aliases of the sans, are gone.
- The retired `#2f7a4f` palette is out of the bundle, including a decorative
  radial gradient the system does not allow.
- `th` on the producer profile was `stone` on `surface-muted` — 4.37:1, below
  AA — and still 700, since the heading rule did not cover it. Both fixed, along
  with the four other rules using that pair. Ink on `surface-muted` is 13.47:1.
  No authored 700 declaration remains; semantic `<strong>` text may still use
  the browser's bold weight and Leaflet continues to own its control styling.

## 2026-08-30 — Shell, catalog map, category rail

Reviewed at 1440×900 and 390×844 on Madrid (245 producers, 239 mapped),
switching category to `Vino` (191 → 33 points) and selecting via `highlight`.
Current evidence: `implementation-home-desktop.png`,
`implementation-map-circles-6px-desktop.png`,
`implementation-map-circles-selected.png` and
`implementation-map-circles-mobile.png`.

- Producer points are 6px solid dark-pine circles at full opacity and 8px when
  selected. The earlier 4px pass was too faint and 10px hollow points were
  unreadable at Madrid density.
- Leaflet path colours are set explicitly from tokens, or the generated SVG
  keeps Leaflet's blue defaults underneath the design CSS.
- The wordmark ships as a CSS background from the imported raster. The optimized
  image wrapper reserved the space but did not paint reliably in the header.
- All 23 categories stay in the rail. Collapsing them into one selector hid the
  catalog's breadth and dropped the familiar icons.
- Mobile rail bleed matches the page inset; wider bleed pushed the document 6px
  past 390px.
- **Rejected:** The Join as a repeated map marker, with and without a backing
  tile — at catalog density it read as branding and slowed location reading.
  Clustering, jitter and heatmaps, in every pass.

## 2026-08-30 — Language inside the account menu

Reviewed signed-out, signed-in and 390px mobile states, plus area and producer
pages in alternate locales. Evidence is retained in the
`account-menu-implementation-*` and `implementation-language-*` captures.

- Language has one visible owner inside the account menu; catalog pages retain
  their exact locale URLs through a non-rendering registration bridge.
- Removing the duplicate page-level switcher leaves no empty container or
  compensating spacer. Long labels wrap and every menu control is at least 44px.
- Signed-out access, signed-in favorites and sign-out remain available without
  turning global navigation into decorative capsules.

## 2026-08-30 — Default producer image

`public/productores/generica.webp`, exercised at
`/us/nevada/jacobs-family-berry-farm`, a row with no `imagen` value. Tactile
paper and negative space in the standard palette. Dropped the retired `KM0`
wordmark, the leaf map pin and every literal food motif. No text in the image,
so the localized alt text stays the accessible description.

## 2026-08-30 — How Chisan works

Reviewed at 1265×712 and 390×844, English and Spanish, with `/our-purpose` and
`/about` redirecting to `/how-we-work`. The longer title keeps the existing
two-line editorial treatment instead of introducing a landing-page pattern; the
numbered process and trust principles stay flat content, not card grids.

Note: stitched full-page captures visually repeat sections. Use focused viewport
captures for visual judgement.

## 2026-09-02 — Premium QR opt-in

Reviewed the producer detail at 1283px after making the printable QR label an
explicit premium preference. A producer without both an active entitlement and
the `profileQrEnabled` opt-in renders no QR disclosure, leaves no empty slot
between the hero and following content, and keeps document width equal to the
viewport. The account-side activation reuses the existing premium callout,
field, checkbox and button primitives; no new colour, shape or elevation rule
was introduced. Producer and public-selection labels retain their existing moss
and ink physical treatments after activation.

## 2026-09-02 — Premium video, team and history

The expanded producer block now presents one external YouTube link, the
producer-authored team and history prose, and the last approved producer-change
date. It reuses the existing premium section, heading, link and 75-character
prose measure without introducing new tokens or CSS. YouTube stays an explicit
external link rather than an embedded player, avoiding an automatic third-party
request. Empty values leave no placeholders, and the entire set still fails
closed with the producer entitlement so base-profile layout is unchanged.

## 2026-09-04 — Project organization and related producer content

Reviewed locally in Chrome at 1440×1000 and 390×844. The ordered stylesheets
retain the existing home, catalog and producer layouts. `/es/barcelona` keeps
its roster visible on mobile without document overflow. Hover and selection
preserve the roster order; selection updates `highlight`, Escape clears it,
and searching `penedes` highlights the original `Penedès` text.

Products, gallery and named links reuse the expanded-profile section and tokens.
A temporary local fixture exercised the actual component with fictional text,
long labels, an imageless product and generic images. Product previews stay at
most 320px wide; gallery images keep their aspect ratio and become one column
on mobile. Images loaded, links measured at least 44px high, and both viewport
widths had no horizontal overflow. The fixture route was removed after review;
no example producer facts or entitlement were published.

The ordinary Brot Agrològic profile still renders its base description and
server JSON-LD in Spanish and Catalan, without an expanded block in the local
account configuration. Public entitlement logic is retained; this check did
not activate a paid account. Browser checks found no uncaught page errors.
Development-only notices included unavailable local Vercel analytics, the
existing selection-image dimension warning and the fixture's lazy-image LCP
notice. Captures are local `.tmp/reorg-area-{wide,mobile}.png` and
`.tmp/reorg-content-{wide,mobile}.png`.


## 2026-09-04 — Producer QR and explicit selection QR

Reviewed the shared selection renderer in a temporary local fixture at
1280×633 and 390×844 with account writes disabled. Synthetic map coordinates
exercised widely separated points; no catalog rows were changed for this QA.
The map framed both points, the stable roster retained all three selected
producers including the unmapped one, and document width stayed within the
viewport. Selecting a row changed only `highlight`; Escape cleared it without
reordering the roster. An unmapped row opened its current producer profile.
Empty selections and selections with no coordinates retained honest messages
and usable producer links. The mobile roster kept its attached disclosure.

The QR disclosure follows the map so the selection remains the primary surface.
Outside roster dismissal now happens on click: collapsing it on pointerdown
moved a QR control below the roster before that control received its click.
Verified that opening the QR from an expanded roster succeeds in one click.
No new visual tokens, marker design or business classification were introduced.

Both label downloads were inspected and decoded using macOS Vision. Each PNG
is 1200×1600 and decodes to the expected canonical `https://chisan.app` path,
without query, fragment or alternate-language prefix. Selection labels use the
optional selection title; producer labels retain their existing presentation.
Artifacts remain local under `output/playwright/qr-selection-*.png`,
`output/playwright/selection-label.png` and `output/playwright/producer-label.png`.
The fixture route was removed. Browser checks found no uncaught page errors;
the local Vercel analytics endpoint returned the existing development-only 404.
The base producer page remained usable while account-dependent QR and ownership
blocks reported their controlled unavailable state.

Account migrations and the activation lifecycle were tested in isolated PGlite:
private and suspended accounts, private favorites, retired and standby rows,
stale previews, empty selections, entitlement expiry/revocation, metadata
preservation and audited disable actions. This is not an authenticated
Production browser test: the new migration and release smoke check remain
Operations preflight requirements.

Release preflight on 2026-09-05: the exact QR change passed `pnpm verify:ai`
in an isolated checkout based on `cbc69b98`. A seven-day Neon schema-and-data
branch, `backup-qr-selection-0009-20260905`, was created from Production main.
Migration `0009` succeeded in a transaction rolled back on that branch, then
committed on Production main. A fresh query confirmed ten migrations, the exact
new migration hash, and nullable title/description columns of 160/600 characters.


## 2026-09-05 — Producer product editor

Reviewed the real profile form at 1440×1000 and 390×844 in the in-app browser.
A temporary local route used the actual submission service with an isolated
PGlite database and synthetic authenticated member; Production database writes
were disabled. The route was removed after verification.

Products appear before the base fields, with existing typography, borders and
spacing tokens. Add focuses the new name; keyboard-accessible 44px controls
change order and remove an item, with an undo action. Verified adding a product,
reordering, undoing removal, saving without a review note, reloading the saved
draft, and submitting with a note. The resulting review shows the added item
and the changed positions separately. Invalid names preserve input and focus a
Spanish error summary. Pending requests disable fields, and the status separates
unsaved changes, saved drafts and submission for review.

Both widths have no document overflow. The mobile check exposed existing base
checkboxes inheriting full input width; compact checkbox sizing now keeps labels
within the form. Product names, descriptions and language controls remain usable
at the narrow width. No browser console errors were observed. This check proves
the isolated editing flow, not authenticated Production publication.

## 2026-09-05 — Fluent discovery and navigation

Implemented the requested modernization on the existing application. Inspected
the initial home and Barcelona explorer, then the updated home, province
selector, explorer, account dropdown and Abadal profile in the in-app browser.
Wide checks used 1440×1000 (with initial captures at 1265×712); narrow checks
used 390×844. The inspected pages have no horizontal document overflow.

The headline and entry into the catalog now share the first desktop view. On
mobile, catalog entry precedes the explanatory copy. The sticky header keeps
catalog and account controls reachable; the desktop search shares the explorer
heading row. Surface radii distinguish controls, compact objects and panels.
The mobile map retains its attached, always-visible roster. A first pass made
the map too tall; the final 44svh treatment reveals the roster beneath it while
keeping the map primary. Documentary images, category pictograms, producer
coordinates and URL identities retain their meaning.

Verified search for Abadal, linked list/map selection, opening its actual
profile, category changes, Back/Forward restoring All/Wine, language switching
from Spanish to English while retaining `category=Vino`, and changing Barcelona
to Girona while retaining that filter and English. The account disclosure
closes on Escape and restores summary focus; it closes after language or area
navigation. No account mutation, geolocation permission or Production write
was needed. Signed-in account pages were not browser-tested because this local
environment has no configured authentication; their existing authorization
checks remain in place.

Category and selection updates use the already loaded model through the
[Next.js native history integration](https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api).
Repeated activation of the same URL does not add history entries. Search text
is normalized once per model and language. Prefetch is bounded to the displayed
producer card and chosen province; lists do not request hundreds of profiles.
Navigation indicators use router pending state and page arrival never delays
the route or remounts its children. Reduced-motion CSS and the Web Animations
preference guard were reviewed; OS preference emulation was not run.

Existing development-console warnings from catalog-agent schema serialization
and the local Vercel analytics script were present before the redesign and
remain outside this visual change. The first full gate reached the browser
behavior stage but could not start a second Next dev instance while the preview
held its lock; the preview was stopped before rerunning the complete gate.
The complete `pnpm verify:ai` rerun passed, including the browser-independent
HTTP behavior suite, account and catalog tests, build and data validation.
Follow-up documentation, design and TypeScript checks also passed. No release
or deployment was performed for this change.

## 2026-09-06 — Direct discovery and practical producer profiles

Follow-up to Fluent discovery, using the existing map and producer contracts.

- The country overview uses three compact flowing columns at wide widths and
  one on mobile. Each province is a direct link; its duplicate selector and
  submit button are removed. The account menu retains a quick province switch,
  navigating immediately when a province is chosen.
- Country entry spacing is reduced, including the empty location-status row.
  Desktop search expands on focus (384 px to 512 px observed at the tested
  width); narrow search already fills its available width.
- Area roster links open the producer profile, retaining category context and
  normal browser navigation. Pointer dwell previews after 120 ms; keyboard
  focus previews immediately. Preview centers the exact map point without
  changing the URL. Synchronized maps keep one large card and no duplicate
  producer tooltip; map activation still writes the durable highlight.
- Search has a derived normalized index and deferred result updates. Memoized
  rows retain stable callbacks so preview does not rerender every row. Rapid
  pointer exits cancel pending previews. Existing roster bounds, selected-row
  inclusion and disabled bulk prefetch remain.
- Profile hours are visible in the hero, preserving the published free text.
  Website URL, telephone and labelled social icons have distinct treatments.
  Address, Google Maps directions and opt-in distance share one location block.
  A public-email contact composer prepares a message in the visitor's email
  app, with an explicit explanation before its action. No sending service,
  stored message, new account permission or response-time promise was added.
- Expanded content uses responsive product cards, section links and grouped
  producer stories. Missing hours, website, contact or location omit their
  modules. Existing facts, source languages and visibility rules are retained.
- The footer has one row at 1280 px (all nine links measured at the same top
  coordinate), with deliberate grids on narrower screens.

Browser evidence: in-app Browser at 1280 x 800 and 390 x 844; country overview,
area discovery, Abadal, the complete 0% Gluten Granollers profile and sparse
180º El Masnou profile. No horizontal overflow observed. Search returned Abadal,
keyboard focus showed one card and zero tooltips without a highlight URL, and
clicking the roster opened its profile. Marker activation and Escape wrote and
cleared highlight. Clearing search with the keyboard restored 400 rows; the
Wine filter showed 279 and Back restored 400. English and Girona selection
preserved the locale and closed the account menu without a submit step.

The contact field was filled without sending or opening an external mail app.
Approved fictional products from ES #12439 were rendered in a temporary
development-only visual fixture at both widths; that fixture was removed.
Authenticated premium visibility was not enabled or changed. Gallery semantics
and escaping were covered by the related-content render tests. Reduced-motion
guards were reviewed; the OS preference was not emulated.

Validation: TypeScript, scoped lint, design and the focused roster/content
tests passed. The full verify:ai run passed through the data, permissions and
geography suites; its HTTP test still expected the removed “Abrir zona” button.
That assertion now checks direct province links and absence of the redundant
selector. HTTP behavior and the remaining content, agent and guide suites then
passed. The final sparse-profile change received TypeScript/lint and another
HTTP behavior check. Existing development console warnings about agent-tool
serialization and localhost analytics were already present before this work.

Release verification: the isolated design-only tree passed frozen-lockfile
installation and the complete pnpm verify:ai gate on 2026-09-06. Parallel guide
and producer-data changes were excluded from this release.

## 2026-09-06 — Markdown guide library

Scope: 31 Spanish editorial guides, `/guias`, article reading, exact producer
selections, progressive maps, homepage highlights, header/footer links and
producer-profile reverse links. The source of each article is a Markdown document
with YAML metadata in `data/guides/es/`; prose and producer commentary remain in
the document body. No JSON article copy or administration editor is published.

Reviewed at 1440 × 1000 and 390 × 844 against the isolated release checkout,
including the published design update and the Lleida/Tarragona coordinate release.
The index groups all 31 entries under six topic anchors. Homepage highlights keep
the cheese, wine and honey introductions deliberately selected. Narrow layouts
retain readable headings, a single column and no horizontal overflow.

The sheep-cheese article loaded three exact producer markers on demand. A marker
opened its popup and its profile link reached La Antigua; the profile showed its
four matching guide links. Text links remain available before loading the map.
Source links, Markdown paragraphs and the editorial-criteria section rendered in
server HTML. The HTTP contract checks every published guide and its profile links.
The unmapped-producer case remains covered by the wine guide and model tests.

Evidence:

- [Desktop library](guides-library-desktop.png)
- [Mobile library](guides-library-mobile.png)
- [Mobile Markdown selection map](guides-markdown-map-mobile.png)
- [Mobile producer reverse links](guides-related-profile-mobile.png)
- [Desktop homepage highlights](guides-home-library-desktop.png)

The development shell still reports the existing WebMCP/Zod server-to-client
serialization warnings; the screenshots show its development issue badge.
No guide-specific rendering or map error was observed. Account, contact and map
renderer behavior outside the guide integration was not changed.


## 2026-09-06 — Guide map selection cards

- Guide markers now use the shared area-map selection card, canonical image and
  description, point focus request and outside/Escape dismissal. Selection remains
  local to each progressive widget; its reviewed membership is unchanged.
- Reused the shared overlay positioning rule outside the catalog page wrapper;
  guide frames retain their 420px desktop and 340px mobile heights.
- Browser QA at 1440 × 1000 and 390 × 844: three cheese-guide markers, image and
  description visible, no legacy Leaflet popup or horizontal overflow, Escape
  returns focus to the map, outside activation clears selection, and the card
  opens the canonical Rey Silo profile. The Asturias area map retains the same
  image/description card at both widths.
- Evidence: [desktop](guides-map-card-desktop.png),
  [mobile](guides-map-card-mobile.png).

## 2026-09-06 — Private producer visit statistics

The premium owner's statistics use four aligned figures (all recorded visits,
today, seven days and 30 days), a quiet moss bar chart and native disclosures for
the daily table and counting rules. Mobile uses a two-column number grid. Counts
are explicitly visits, including repeat openings, with no claim of unique people.
Access links sit beside the existing producer management actions.

Browser QA used the actual statistics and collector components in an isolated
React Strict Mode fixture with the application styles and built Noto Sans fonts,
using synthetic figures rather than a Production account. Checked 1440 × 1000
and 390 × 844, Spanish populated state and Catalan empty state. Neither width
had horizontal overflow; the daily disclosure exposed 30 rows plus its header.
No component runtime errors occurred. The first fixture load's missing favicon
and unhandled POST were fixture setup issues; subsequent runs used a local icon
and intercepted the collector endpoint.

The collector emitted one request on opening under Strict Mode, none on a plain
re-render, a second on remount and a third on reload, all with different event
IDs. A hidden document emitted nothing until visible and did not count repeated
visibility notifications. Do Not Track emitted no request. Each body contained
only country, producer ID and the per-display event ID. Isolated PGlite tests
cover transport replay, concurrent increments, exact premium/owner checks,
revocation/expiry, missing producers, UTC windows and private SQL grants.

- [Desktop statistics](producer-statistics-desktop.png)
- [Mobile statistics](producer-statistics-mobile.png)
- [Catalan empty state](producer-statistics-empty-ca-mobile.png)

Production migration, activation and an authenticated Production smoke check
remain deployment work; these screenshots are not live traffic or production
account evidence.
