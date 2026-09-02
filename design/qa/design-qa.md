# Design QA log

One entry per reviewed surface: what was decided, what was rejected, and why.
Not a checklist — that lives in [`../README.md`](../README.md). Reference only
evidence committed to this repo; local capture paths rot.

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
