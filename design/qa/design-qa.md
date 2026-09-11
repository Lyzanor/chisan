# Design QA log

One entry per reviewed surface: what was decided, what was rejected, and why.
Not a checklist — that lives in [`../README.md`](../README.md). Reference only
evidence committed to this repo; local capture paths rot.

## 2026-09-08 — Guides published inside the Spanish catalog scope

final result: local QA passed; production release pending

The library moved from `/guias` to `/es/guias`. The articles describe Spanish
producers and link into Spanish provinces, so their URLs now sit in the same
scope as the pages they send readers to, and the first path segment keeps
meaning the same thing everywhere on the site. The old paths permanently
redirect, so published links and the header entry point keep working.

Presentation is unchanged: the pages left their own editorial root layout and
joined the catalog root layout, which builds the identical header, footer and
language menu from the same shared shell. Only the language-menu href differs —
it now points at the country scope rather than at the guide index.

Rejected: a second root layout group holding `/es/guias`. It would have kept the
old shell duplicated and forced a full document load whenever a reader moved
between an article and a province listing.

Checked at 1440 x 1000 and 375 x 812 on the index and the cheese article. No
horizontal overflow at either width; the canonical URL, the `es` document
language and the topic anchors are unchanged apart from the new prefix.

## 2026-09-07 — Community suggestions for unclaimed producers

final result: authenticated local QA passed; production release pending

A reader who is signed in may correct a producer nobody has claimed. The entry
point is one more control in the existing `.producer-account-actions` row on the
public profile, next to «Reclamar este productor», so account and ownership
actions stay in one block after the location and factual details, as the profile
section contract requires. It is offered only while the producer has no verified
owner; a verified owner keeps the row exactly as it was.

Rejected: per-section «sugerir» links scattered through the profile. They would
have added an interactive control to sections that exist only when their CSV
value does, and the profile already carries one place where account actions live.
The section choice moved into the flow instead: `/cuenta/sugerencias/nueva` first
asks which part of the ficha to correct, then renders only that part's fields.
That keeps the form small, avoids a client-side section switcher, and means the
form can never blank a field it does not show.

The account and operations surfaces reuse existing classes only — no new CSS.
`account-content`, `account-section-heading`, `account-callout`,
`account-record-list`, `account-form--wide`, `account-form-grid`,
`account-field`, `account-field-error`, `account-inline-actions`,
`account-status--<status>` and, in `/admin/sugerencias`, `admin-filter-tabs`,
`admin-search-form`, `admin-pagination` and `account-review-list`. Suggestion
statuses deliberately reuse the existing producer-change vocabulary
(`pending`, `approved`, `rejected`, `withdrawn`, `applied`) so the status chips
already have their tone and no new colour enters the system.

Checked at 1440 x 1000 and 390 x 844. No horizontal overflow at either width.
The field grid is two columns wide and one column narrow. Every control on the
new account and operations pages measures 44px tall through `.account-button`.

Authenticated evidence: checked with the existing Clerk Development instance and
an isolated PostgreSQL 16 Docker database on 2026-09-07. All 15 migrations were
applied with `pnpm db:migrate`; `pnpm db:assert-current` matched the repository.
No Production database was migrated or used for these writes.

The public anonymous suggestion link returned through Google/Clerk to the exact
producer section selector after sign-in with an onboarded account. A first-time
local account instead required the existing welcome acknowledgement, then opened
the account dashboard; automatic continuation through first-time onboarding is
not claimed by this check. The selector exposed seven sections. Contact submitted
only a `web` patch; unrelated fields stayed intact. Description exposed its paired
source-language selector. Unchanged values, non-HTTP(S) websites and short source
notes were rejected, with invalid form values preserved. Invalid and absent
producer keys showed the catalog escape route.

The browser exercised submission, withdrawal, acceptance, rejection of a short
review note, rejection of an invalid commit SHA, and a simulated publication
using a 40-character fixture SHA in the isolated database. Acceptance left
`applied_at` empty and created no memberships. An accepted suggestion blocked a
second submission for the same section; publication unlocked it. Both pending
and accepted states count as open; accepted rows have no withdrawal control.
Local owner fixtures hid suggestions with and without a session, and a member
opening the form directly reached the producer editor. The owner fixture was
revoked after verification. Search matched producer name, suggestion UUID,
section and country; 28 isolated rows exercised both pages and state filters.
Publication fixtures are test data, not claims that catalog edits were published.
The service tests cover attempts to publish a pending suggestion.

Responsive browser evidence (full-page captures, viewport sizes 1440 x 1000 and
390 x 844): [profile wide](2026-09-07-suggestions/profile-1440.png),
[profile narrow](2026-09-07-suggestions/profile-390.png),
[selector wide](2026-09-07-suggestions/selector-1440.png),
[selector narrow](2026-09-07-suggestions/selector-390.png),
[contact wide](2026-09-07-suggestions/contact-1440.png),
[contact narrow](2026-09-07-suggestions/contact-390.png),
[operations wide](2026-09-07-suggestions/admin-1440.png), and
[operations narrow](2026-09-07-suggestions/admin-390.png).
The signed-in header initially overflowed to 428px on the 390px viewport. Allowing
the account navigation and menu to shrink in the mobile adapter keeps the full
page at 390px, while retaining the full accessible account label. All four
surfaces now match their viewport width. Account navigation, queue filters and
the four-column diff use their existing local horizontal scroll containers.
The screenshots retain the development indicator; it is not production UI.

Known deviation, not introduced here: `app/styles/accounts.css` gives
`.producer-account-actions a` and `.producer-account-actions button` a 38px
`min-height` and a `999px` radius, which conflicts with the 44px target rule and
with pills being reserved for filters and tags.
`design/adapters/experience.css` already upgrades `.account-button`,
`.back-link` and `.detail-actions a` but not these descendant selectors, so the
favourite, claim and new suggestion controls all measure 38px. The new control
matches its siblings rather than introducing a second treatment inside one row;
bringing the whole block to 44px is a deliberate change to existing controls and
was left for its own decision. `pnpm check:design` is unaffected: `small-target`
counts the existing rule once and stays at its baseline of 7.

Verification commands: `pnpm db:migrate`, `pnpm db:assert-current`, and the
`pnpm verify:ai` stages. The initial gate passed through the behavior stage's
unit checks but could not start a second dev server while local QA owned the
Next.js dev lock. Resumed with `BASE_URL=http://localhost:3000 pnpm test:behavior`
and then `pnpm test:content`, `pnpm test:agents`, `pnpm test:guides`; all passed.
`pnpm check:docs` passed again after recording this evidence. The ignored local
`scratch/` directory was parked outside the repository during the build and
restored afterward.

## 2026-09-06 — Spanish public presentation

final result: passed with local verification limits

The public shell, home, information pages, accounts and shared producer selections
use Spanish. Spain publishes only Spanish at every catalog depth. The single-option
language selector is hidden; administration has an independent English root layout
so navigation cannot retain the other surface's language. Existing translated
resources, source-authored producer facts and stable Spanish URLs are retained.

Reviewed the home at 1440 × 1000 and 390 × 844 with browser screenshots. The longer
Spanish headline and province summary wrap within their surfaces. Reviewed
`/es/cantabria/panaderia-la-pasiega` at the same widths through its rendered DOM:
Spanish navigation, category, location, distance, detail and related-producer
labels, with no horizontal overflow. The canonical address retains its original
source wording. Profile raster capture timed out; DOM and viewport checks passed.

Local production previews report the expected missing Vercel Analytics script.
The development preview also reported WebMCP schema serialization warnings from
unchanged agent-tool code. Authentication was disabled locally, so account and
admin authorization are covered by automated tests rather than a live signed-in
browser session. No production deployment was performed.

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

## 2026-09-06 — Catalog radius search

- Added a native distance disclosure below the area search toolbar. The current
  province remains the explicit scope. Manual coordinates or an opt-in device
  position combine with category and text; no visitor position enters a URL or
  persistent storage. The map and roster consume the same filtered producer set.
- Chromium against the local production build, Spanish at 1440×1000 and 390×844,
  plus English at 390×844: no horizontal overflow; controls remain labelled and
  at least 44px high. Screenshots: `output/playwright/radius-wide.png`,
  `output/playwright/radius-mobile.png`, `output/playwright/radius-mobile-en.png`.
- Barcelona centre 41.39, 2.17: 25 km returned 926 catalog matches; 5 km combined
  with `queso` returned 6. These are QA observations, not maintained counts.
  A 0,0 centre returned no rows; removal restored matching rows. Invalid latitude
  was rejected. Browser geolocation was emulated for success, denial and a late
  callback after cancellation; cancellation did not reactivate the filter.
- TypeScript, lint, production build, design checks, API tests (including spatial
  validation/pagination) and geography tests passed. `verify:ai` reached behavior
  checks but its new dev server could not acquire the existing dev lock. Behavior
  passed when rerun with `BASE_URL=http://localhost:3000`; remaining content,
  agent and guide suites passed separately. Other preceding gate stages passed.
- Browser console contained the expected local Vercel Analytics script 404 and
  stylesheet preload warnings; no radius-filter runtime errors were observed.

### Producer-list placement refinement

The final control lives in the producer-list header, replacing the full-width
search-toolbar disclosure above. An 18px sliders icon and small chevron use a
44px button with an accessible distance label, expanded state and controlled
panel. The active radius remains visible while collapsed. Escape closes the
panel and restores trigger focus. Options expand within the list rather than
covering the map.

Verified on the local production build at 1440×1000 and 390×844: opening,
manual-coordinate filtering, active-radius display, collapse and Escape; no
horizontal overflow. Evidence: `output/playwright/radius-list-wide-open.png`,
`output/playwright/radius-list-wide-closed.png`,
`output/playwright/radius-list-mobile-open.png` and
`output/playwright/radius-list-mobile-closed.png`.
The final full gate passed with `BASE_URL=http://localhost:3000 pnpm verify:ai`,
using the production server for behavior tests to preserve the other dev session.

## 2026-09-06 — Premium producer image editor and demo gallery

- Browser verification used the production form, media HTTP handlers, proposal
  service and renderer in an isolated local fixture with all account migrations.
  Its temporary authentication and PostgreSQL fixture are not release files.
- At 1440×1000 and 390×844: upload target selection, permission acknowledgement,
  private preview, descriptions and captions, save/reload, reorder, remove/undo
  and submission to review worked. The submitted comparison loaded the private
  image. The mobile editor had no horizontal overflow and image actions remained
  at least 44px high. New images explicitly say they are pending review.
- Browser testing caught Next.js normalizing the request URL to localhost. The
  same-origin guard now compares the browser Origin with the actual Host and
  scheme; a regression test also rejects a forged forwarded host.
- The public renderer showed three product images and five standalone gallery
  images, each loaded once, without horizontal overflow at either width. Every
  demo image has a visible fictional/AI caption and credit. The images use the
  same preparation pipeline as producer uploads.
- Automated tests cover decoding and metadata removal, exact producer premium
  permission, private previews, draft persistence, immutable submitted media,
  ownership validation in PostgreSQL, and image bytes bound to the publication
  commit. A real Neon backup branch passed the additive migration rehearsal
  inside a rolled-back transaction.


## 2026-09-06 — Product purchase details and update dates

- Added optional shop URL and EUR price to the premium product editor, with
  decimal keyboard input, comma normalization, explicit field labels and a
  server-owned product date. Public cards show the price, relative update label,
  shop hostname and an external-link button; exact dates remain in semantic
  `time` elements with an accessible label and tooltip.
- The requested Spanish labels are “Actualizado esta semana”, “Actualizado este
  mes” and “Actualizado en el último año”, followed by exact dates for older
  records. Week/month boundaries use UTC, with Monday as the week's start.
- Chrome checks at 390 × 844 and 1440 × 1000 covered public cards and the real
  editor components using an isolated local PostgreSQL-compatible fixture. No
  horizontal overflow; shop buttons were 72 px high at the narrow width and
  retained visible keyboard focus. Catalan labels and source-language fallback
  were checked on the narrow public view.
- Browser flow: enter `3,85`, normalize to `3.85`, reject a non-HTTP(S) URL with a
  specific product/field message while preserving input, correct and save,
  reload the draft, remove optional price/URL, inspect preview, then submit and
  inspect before/after review. A fresh editor load had no console errors. An
  earlier development hydration warning came from toggling the native preview
  disclosure before hydration during rapid reload; fresh-load verification did
  not reproduce it. Fixture-only image-LCP advice does not apply to below-fold
  profile product images.
- Chisan ES12439 has three clearly fictional prices (3.80, 6.50, 9.90 EUR), dated
  2026-09-06, with example buttons linking to its own profile. Clicking a demo
  button opened a separate tab. The public API marks the demo explicitly, and
  its JSON-LD contains no offers. The real account's pending proposal was kept.
- Local screenshots: `scratch/product-commerce/public-mobile.png`,
  `scratch/product-commerce/editor-mobile.png`, and
  `scratch/product-commerce/editor-desktop.png`. Temporary QA routes, fixture
  database and server configuration are excluded from the release.

## 2026-09-06 — Similar nearby producers on producer profiles

- Added a final profile section headed “Productores similares cerca”, with up
  to three linked producer cards ordered by straight-line distance among
  published producers sharing a canonical category.
- The card exposes the reviewed image, name, municipality, shared category and
  distance. It uses three columns at wide widths and one column at narrow
  widths; unsupported coordinates or matches beyond 100 km are omitted rather
  than represented as nearby.
- Browser QA on `/es/barcelona/abadal-avinyo` at 390×844 and 1440×1000 showed
  exactly three cards, no horizontal overflow, one 324px mobile column and
  three equal 353px desktop columns. The first recommendation navigated to the
  expected canonical Celler Sanmartí profile. No Next.js error overlay was
  present; existing local account/content fallbacks and WebMCP serialization
  warnings remained unrelated to this section.

## 2026-09-06 — Click-to-load producer video

- Replaced the expanded profile's external-only YouTube link with a responsive
  integrated player. The initial state shows the video's official YouTube
  thumbnail beneath a restrained ink overlay, a native button, visible focus
  and concise disclosure that the thumbnail comes from YouTube.
- The profile loads that thumbnail from `i.ytimg.com` but receives no YouTube
  iframe on initial render. One explicit click
  creates a privacy-enhanced `youtube-nocookie.com` iframe from the validated
  11-character video ID and starts playback in place. Source tracking and time
  query parameters are not forwarded. A 44 px direct YouTube link remains as a
  fallback for JavaScript, embedding or player failures.
- Verified in the in-app Chromium browser at 1440 × 1000 and 390 × 844. The
  official 1280 × 720 thumbnail loaded before interaction. The desktop player
  measured 880 × 495; mobile measured 310 × 200, satisfying the
  embedded-player minimum while keeping document width equal to 390 px. Both
  sizes loaded the real test video, exposed a descriptive iframe title and
  fullscreen permission, and produced no console errors.
- The temporary `/youtube-qa` route and generated test layout were removed after
  verification. The production component remains inside the existing premium
  visibility gate; profiles without a reviewed video render no player or gap.
## 2026-09-06 — Account photos and producer favorite attribution

- Added a row of up to five overlapping circular avatars and a remaining count,
  following the supplied reference within Chisan's existing palette. One native
  disclosure opens the paginated roster; there is no automatic scrolling or
  animation. The whole summary is an accessible pointer/keyboard target.
- The roster names only active accounts with explicit attribution opt-in. Only
  public profiles are linked; private and unlisted profiles show a name/photo
  without exposing their handle. An honest zero state and retry state are
  included. Public selection maps retain their existing explicit membership.
- Chrome at 1440 × 1000 and 390 × 844 verified stacked avatars, opening, 24-to-30
  pagination, opening/closing with Enter, opt-out reducing the count and removing the name, image upload,
  replacement/removal, the initials fallback and the linked public map/avatar.
  The narrow roster and public profile have no horizontal overflow. The new
  preference label has a 44px minimum height; list links and buttons meet the
  same target. A Japanese display name was included without truncation.
- Tests used fictitious accounts and synthetic silhouette images in a separate
  local PGlite fixture with the real migration, query, upload/read handlers and
  components. Fixture authentication and routes are not release files. Webpack
  development emitted existing WebMCP schema-serialization warnings; the
  application production build and account behavior checks passed.
- All stages of `verify:ai` passed in the isolated validation copy after updating
  the migration inventory. Google was then enabled in the production Clerk
  instance with sign-up/sign-in and email-subaddress protection. Both `/registro`
  and `/acceso` show Google alongside email. Clicking Google opens the account
  selector for `chisan.app` with the configured client and exact callback, without
  an OAuth error. This was the pre-deployment authentication check; importing a
  real Google photo remains unverified.
- Production follow-up: a seven-day Neon backup and successful transactional
  rehearsal/rollback preceded migration `0013`. The exact committed DDL was
  applied through the authenticated SQL editor with an advisory lock and
  canonical registry fingerprint checks, since direct migration credentials
  were unavailable locally. Existing account/favorite counts were preserved.
  This additive empty-table release used the database snapshot; it did not
  export Clerk identities or introduce a global account-write outage.
- Release `0c0cf476` passed the full `verify:ai` gate and the public/disabled-account
  Preview checks. Its Git-triggered production deployment reached READY. The
  authenticated runtime reports 14/14 migrations and healthy permissions. The
  profile photo control and unchecked attribution preference render, and the
  real producer roster expands to its accurate empty opt-in state without
  console errors. The production account retained its initials; no real user
  photo, favorite or visibility preference was changed for testing.

## 2026-09-08 — Premium production, seasonality and commercial details

- Added source-language production methods, independently dated news,
  certification tokens with explicit issuer/scope text, visit booking, professional
  sales/contact and direct-order conditions inside the premium visibility boundary.
  Product cards show usual season and an optional seasonal special, plus format
  beside the recorded price. Official and private certification are distinguished;
  the Chisan demo explicitly states that its certification is fictional.
- The premium owner statistics lead with current favorites from active accounts,
  including private saves only as an aggregate. Copy explains that this is interest,
  not orders. Existing public supporter attribution remains separately opt-in.
- Browser checked the actual local Chisan public profile at 390 and 1440 px using
  a temporary entitlement in the isolated local QA database. No horizontal overflow.
  Screenshots: `2026-09-08-premium-fields/profile-390.png` and `profile-1440.png`.
- A temporary local component fixture exercised the real product controls and
  statistics with Catalan copy at both widths (`components-390.png`,
  `components-1440.png`). Clearing every month removed both season fields and
  disabled the special checkbox; the form stayed within 390 px. The fixture and
  its illustrative counters are not shipped or written to production analytics.
  Backend integration tests cover the real authorization and aggregate query;
  this component check is not an authenticated owner end-to-end submission.

## 2026-09-08 — Following and publication-backed community timeline

- Reframed favorites as following throughout the Spanish public/account UI,
  navigation, privacy controls and producer statistics. Existing selection and
  attribution choices retain their meanings. The old favorites URL redirects.
- Added a continuous reading column with dated, identity-linked entries, a
  clearly marked ownership notice, All/Updates/Activity filters and accessible
  older-page links. Existing undated CSV messages use native disclosures in a
  separate section; there is no invented publication date. Producer composition
  returns to the existing reviewed editor and change-status workflow.
- Browser QA used an isolated Next.js copy and an in-memory PostgreSQL fixture.
  Only the fixture authentication/database adapters were replaced; production
  account pages, follow actions and timeline service were exercised. No live
  account, entitlement, claim or catalog data was mutated. This is not Clerk or
  Production authentication certification.
- Checked 1440×1000 and 390×844. At 390px, the measured document width was 375px
  with no horizontal page overflow. Checked a long Japanese text stress case
  in the disclosure (fixture DOM only), full wrapping and native expansion.
  Fixed the desktop following-count button to keep its label on one line.
- Verified a 20-item first page and a three-item continuation with zero repeated
  IDs; Activity showed only the approved claim. Unfollowing through the real
  action removed all entries and showed zero follows; following again from the
  producer profile restored the feed. Verified the old URL redirect, current
  message disclosure and the community route's link to the existing editor.
- Local evidence: `output/playwright/following-desktop.png`,
  `output/playwright/following-mobile-activity.png`, and
  `output/playwright/following-mobile-long-text.png`; fixture and gate log under
  `scratch/following-qa/`. The development shell logged existing WebMCP schema
  serialization notices and a local Vercel Analytics script 404 on the catalog
  page; these are outside the following components and did not block the flows.
- Validation: `pnpm verify:ai` passed, including database integration covering
  current publication, review states, premium expiry, ownership revocation,
  cross-account/country isolation, routing changes and idempotent follow writes.
  Final focused checks covered TypeScript, i18n, lint, docs and design. Design
  notices were assessed; no blocking design rule regressed.


## 2026-09-09 — C-with-dot identity and profile QR labels

- Replaced the UI wordmark and favicon with the approved exact C-with-dot
  vectors. The same mark is embedded in producer and selection QR codes.
  Reversed wordmarks retain the same silhouette. Raster metadata derives from
  the SVG masters; Outfit is self-hosted with its OFL license and Noto/system
  fallbacks. Headline tracking is -0.02em for readable Outfit spacing.
- Shared surfaces now use pure white, neutral grays and forest green #00563F.
  Removed the former cream/sage brand palette. Routes, catalog behavior and
  account/QR eligibility remain unchanged.
- Inspected the home, loaded Barcelona map/list and QR disclosure at desktop
  and 390px widths. The mobile catalog measured 375px document width inside a
  390px viewport, with no horizontal page overflow. Japanese label text uses
  the fallback stack and wraps correctly.
- Downloaded actual 1200x1600 PNGs from ProfileQrLabel for a normal producer,
  a synthetic long producer URL/name and a Japanese selection label. Apple
  Vision independently decoded all three to their exact URLs, both at full
  size and after reducing the QR region to 300px. Codes retain H correction,
  four quiet modules and a 160px central mark within the 880px canvas. The
  download explicitly paints the loaded SVG to avoid an image-loading race.
- The temporary visual fixture called the real component, bypassed no account
  action and was removed before the release build. No claim of physical print
  testing or authenticated production-owner QA is made.
- Local evidence: /tmp/chisan-brand-evidence/ contains home, loaded catalog,
  QR disclosure screenshots and the three downloaded PNGs. Validation:
  pnpm verify:ai passed on the isolated release tree, including build, data,
  account and behavior checks. Existing Node module-type notices were assessed.

## 2026-09-09 — Homepage reading sections and guide covers

- Kept discovery in the opening two-column composition. Removed the redundant
  manual-choice button; the visible country card and footer catalog anchor
  remain usable without location permission or JavaScript.
- Added the CSV-derived published producer total, illustrated guide headlines,
  producer registration, active-claim/public-profile community cards, free and
  premium plan descriptions, a QR explanation and a compact chisan-chisho close.
  No claimed/premium count is fabricated. Premium links to contact while online
  purchase is inactive; account and producer access remain separate.
- The user authorized active claimed producers and registered users for the
  community section, with Santa Coloma de Gramenet preferred. Only explicitly
  public, active user profiles are discoverable. The server projection exposes
  no owner identity, email, private profile, account ID or image bytes.
- Every guide now owns required cover provenance. Eight licensed Unsplash context
  photographs are shared by related articles, with attribution in the article.
  The headline is the reading link; the duplicate “Leer la guía” action is gone.
  Assets live under `/editorial/guides/` to avoid the legacy `/guias` redirect.
- Sections animate on their first intersection using opacity and a short vertical
  movement. Content remains visible without animation support or JavaScript;
  reduced-motion is checked before starting and cancels animations when changed.
- Browser review at 1440×1000 and 390×844: opening hierarchy, loaded thumbnails,
  guide headline navigation, article cover and attribution, stacked plans, QR
  explanation and footer close. Mobile document width stayed at 390px. Returning
  from a guide via the brand link kept `/` visible with its same-origin referrer.
- The shared page shell tracks SPA returns; document referrer/navigation type
  covers root-layout changes and browser history. Unit tests distinguish direct
  entry, same-origin navigation, external entry, reload and history returns.
- Community privacy/revocation integration passed against isolated PGlite. The
  local account database at port 55439 was unavailable, so real member cards and
  account actions could not be browser-verified. The section showed its usable
  registration fallback. Existing WebMCP schema-serialization development
  warnings remain outside this change.
- Release validation runs in an isolated checkout containing only this scope,
  outside the system temporary directory (the report-path test rejects ordinary
  repository paths and assumes the checkout is outside that directory).
- No database schema or environment change is included. The current production
  build confirmed its migration registry on 2026-09-09; the available browser
  session lacks staff access for a fresh system-page assertion. The Git-triggered
  build repeats the migration assertion before publication. Stripe remains
  unprovisioned in the production environment variable inventory.
- The complete `pnpm verify:ai` gate passed on the isolated release tree, including
  the production build, privacy/revocation integration and public route behavior.
- Browser icons moved off the transparent ground onto the white page field. The
  live `rel=icon` and `apple-touch-icon` were a transparent forest mark, so the
  icon disappeared into dark tab chrome and iOS composited it on black; the
  `.ico` shared that ground and was in any case overridden by the PNG link.
  `design/brand/build-favicon.cjs` now derives all three exports from
  `public/brand/chisan-mark.svg`. Frames served by the development server at
  16, 32, 48, 180 and 512px were compared against the previous asset on light
  (#DFE1E5) and dark (#202124) chrome: the mark stays legible on both. The mark
  sits at 400 of 512 units so the 16px frame keeps its counter and dot readable.
  Brand masters under `public/brand/` and `design/brand/` remain transparent.

## 2026-09-08 — Private professional enquiries

- Kept ordinary public email/telephone contact separate from the premium
  professional CTA, which opens an authenticated supply enquiry when enabled.
- Account navigation has a dedicated professional channel; private business
  context and supplier product templates have distinct sections. Product
  templates use native disclosures and the existing account field/button styles.
- Real authenticated local browser QA used the isolated PostgreSQL instance on
  port 55439 and fictional Chisan product/business fixtures. Created a business
  profile and a product-specific enquiry through the UI; opened a separate
  received enquiry as its supplier, explicitly attached terms and sent them.
- Updated the private weekly capacity from 120 to 140 pieces via the supplier
  form; the dated shared offer still displayed 120. Verified ordinary public
  mail contact alongside the professional route and no private delivery-area
  fixture text on the public profile.
- Reviewed the conversation and private template editor at 390×844 and 1440×1000.
  Document width matched viewport width at both sizes; text wrapped and native
  controls remained usable. Replaced initially unstyled inputs with shared
  account-field styling and folded each product's long form independently.
- Service tests cover other accounts and staff without membership, revocation,
  expired premium, suspended accounts, idempotency, stale template versions,
  product retirement, history snapshots, closure and daily enquiry limits.
- Existing development warnings about catalog tool inputSchema serialization
  appeared in the shared app shell; no professional data was involved.
- This record proves local behavior. Production activation requires the migration
  chain and feature flag. The preceding WhatsApp migration prepares inactive
  storage only; its assistant and routes are not part of this release.

## 2026-09-09 — Professional channel activation

- Rehearsed migrations 0015 and 0016 against the recoverable Neon child branch
  `backup-b2b-0016-20260909` (`br-fancy-mud-b20vhxrq`, expires September 16).
  The transaction reached 17 registry entries; rollback restored the backup to 15.
- Applied the same guarded transaction to production before deployment. Verified
  all 17 migration fingerprints and owner `neondb_owner`; all six new tables have
  no PUBLIC privileges. No production conversation or private terms were seeded.
- Enabled `CHISAN_B2B_ENABLED` for the next Production deployment. WhatsApp has
  no routes, provider configuration or account navigation in this release; its
  preceding migration only prepares inactive storage required by the stable chain.
- Preview `chisan-15qkkcn06-lyzanors-projects.vercel.app` built successfully with
  accounts explicitly disabled. Browser checks confirmed the public homepage and
  the disabled-account fallback. Authenticated interaction and responsive checks
  are recorded in the preceding local QA entry.

## 2026-09-09 — Featured category counts on the homepage

- The «Chisan en datos» section now carries twelve category counts under the
  published producer total, drawn with the same registry icons the map uses on
  its markers. Each producer counts once, under the primary category that also
  chooses its marker, so no producer is counted twice through its additional
  categories.
- Only the most numerous categories appear, and «Otros», «Despensa artesanal»
  and «Legumbres y cereales» stay out: a catch-all and two tokens that overlap a
  more specific category and reuse its map icon, which say nothing on their own
  beside a number. The list is a selection, not a breakdown, so its label reads
  «Categorías con más productores» and never claims to add up to the total.
- Rejected: all twenty-nine categories. It read as a taxonomy dump, ran to
  fifteen rows and 800px at 375px wide, and gave the ambiguous tokens the same
  weight as «Vino».
- Rejected: fixed-width columns to align the counts under each other. At every
  width some cell was narrower than «Dulces y repostería», so the longest labels
  wrapped and every row in the grid grew with them. The rows now size to their
  own content and wrap as a group, which keeps each label on one line.
- Rejected: linking each row into the catalog. The `category` query parameter is
  carried by the country route but the area listing filters on the client, so a
  home link could not promise a filtered arrival.
- Rows are quiet hairline outlines with the count in ink and tabular figures, so
  the large green total keeps the emphasis in the section.
- Measured at 1280, 768 and 375px: two, three and seven rows; 80px, 125px and
  301px of rows; no label wrapped and no horizontal page overflow at any width.
  The counts are server-rendered, so they are present before JavaScript.

## 2026-09-09 — Header reduced to brand and account

- The top bar carried the catalog, guides and «Cómo funciona Chisan» on every
  page. All three already live in the footer, so the bar now holds only the
  brand and the account control and stops competing with the page it frames.
  Nothing became unreachable: the footer keeps the same three links on every
  route, and the homepage summary now offers the catalog directly.
- The homepage total gained «Explorar el catálogo de España» immediately under
  «productores en el catálogo», so the number is now a way in rather than a
  statement. It resolves the published country and its destination locale
  through the same helpers the country card uses, and appears only while exactly
  one country is published; with several, the country choice above it is the
  honest entry point.
- Rejected: keeping a catalog link in the bar and dropping only guides and the
  about page. The bar's compass link pointed at `/#choose-country` — the home
  anchor for choosing an area — so from any inner page it sent a reader back to
  the homepage rather than into the catalog they were reading.
- Removed the primary-nav rules from `design/adapters/experience.css`, including
  its two mobile treatments and its reduced-motion selector, rather than leaving
  dead selectors behind. The account control no longer needs its `margin-left`
  override: the header's `space-between` keeps it on the right edge.
- Checked at 1280 and 375px on the homepage and on `/es`. The header measures
  80px and 72px with the brand left and the account control at the right edge,
  no horizontal overflow at either width, and the new link stays a 235px target
  instead of stretching across its column. Development-only WebMCP schema
  warnings are unchanged and outside this change.

## 2026-09-09 — Producer profiles and the free claimed gallery

- The heading now shares its top edge with the photograph. On narrow screens,
  the photograph stays compact beside the name and the summary follows both.
  Municipality and categories are links under the name; the repeated category
  section is removed. Municipality filtering matches the complete normalized
  municipality, combines with category selection, survives producer navigation
  and has a visible removal control.
- The header gallery combines the CSV image with approved standalone images.
  Thumbnails, previous/next controls, enlargement, arrow keys, Escape and focus
  restoration were exercised. Synthetic horizontal touch gestures changed the
  photo without opening the dialog; vertical gestures did not change it.
  Reduced motion disables the image transition. Product-owned photographs stay
  in their product cards, and image enlargement preserves the original ratio.
- Verified means a reviewed producer relationship, explained in the interface;
  it is separate from the quiet premium green header. Pending editorial records
  show a caution and expandable public evidence URLs with consultation dates.
  Unclaimed, non-pending records have no header badge. No private claim material
  or editorial notes are exposed as evidence.
- Contact and call actions target the same telephone/email widget beside Details.
  Website, Instagram, Facebook and the Maps listing display readable URLs;
  query strings remain in the destinations but are omitted from the link text.
  Directions use the reviewed destination in the Google Maps directions action.
  Location and vertical source opening hours share a row; purchase information
  sits beside featured products. Following is top-right, public opted-in
  followers have their own section, and claim/suggestion actions close the page.
- Chromium checks at 1440×1000 and 390×844 covered the controlled Chisan demo
  profile and the pending Ànima Essències profile. A long mixed Japanese/Spanish
  title stayed within the 390px viewport. At 390px the demo title and photo both
  started at y=233px. Telephone/mail links, four public URL links, directions and
  public evidence were inspected on the real pending record. No horizontal page
  overflow was observed. Local screenshots are in `output/playwright/` with the
  `producer-premium-*`, `producer-pending-mobile` and `producer-details-mobile`
  names.
- Premium/verified/following presentation and the free editor were exercised
  with disposable local fixtures, not authenticated production accounts. The
  editor showed 5/5 standalone photos, disabled adding a sixth, and exposed no
  premium product or image-assignment controls. Fixtures were removed before
  the HTTP behavior gate; they never entered the application source tree.
- PGlite integration covered the complete free draft, submission, review and
  publication-lease workflow. Server and SQL checks reject a sixth standalone
  photo, premium product changes, changes to product-owned images and revoked
  membership. Public-reader tests cover free, premium, expiry and unavailable
  account state. Migration `0017_claimed_producer_gallery` is tested locally but
  still needs the Operations preflight and application before deployment.
- Production build, TypeScript, docs, account/data/content/agent suites and HTTP
  behavior checks passed. The full `verify:ai` command stops at six existing
  `no-require-imports` errors in the unrelated, untracked
  `design/brand/qr-identity/build-qr.cjs`; lint excluding that directory and all
  remaining gates passed separately. The design checker reported no blocking
  regression. Existing WebMCP serialization diagnostics and local Vercel
  Analytics 404s remain visible in development and are outside this change.


## 2026-09-09 — Producer profile release and larger mobile photograph

- Follow-up: at widths up to 760px the photograph now spans the content width
  directly after the name, municipality and categories. The inline counter and
  previous/next bar are removed at every width; thumbnails and swipe remain.
  The enlargement viewer retains its keyboard and previous/next controls.
- The controlled demo at 390×844 showed the heading ending at y=299px and the
  photograph starting at y=315px, both 292px wide. There was no horizontal page
  overflow and no visible inline arrow control. This supersedes the compact
  side-by-side mobile decision recorded above.
- The complete `pnpm verify:ai` gate passed in an isolated release checkout with
  frozen-lockfile installation. It excludes all unrelated pending changes,
  including the separate QR generator that blocked lint in the shared checkout.
- Rehearsed migration 0017 on Neon branch `backup-gallery-0017-20260909`
  (`br-small-shape-b2rbr3uo`, expires September 16). The transaction reached the
  reviewed 18-entry fingerprint and passed five/six-photo checks; rollback
  restored the backup to 17 entries. Applied the same guarded transaction to
  Production as `neondb_owner` and verified all 18 migration fingerprints after
  commit. No producer, account or private message rows were created for this
  release.
- Preview `chisan-7ti7qptcp-lyzanors-projects.vercel.app` reached Ready with
  accounts and statistics disabled. Its producer HTML includes the new layout,
  contact widget and public sources. Public and disabled-account behavior was
  checked before pushing the release.

## 2026-09-11 — WhatsApp intake staged without activation

- The producer entry reuses the account layout and explains the pending pilot;
  proposal provenance reuses the private admin definition list and history table.
- Verified the disabled-account fallback at `/cuenta/whatsapp` in a local
  production build at 390×844 and 1440×1000. Text and catalog exit remain legible
  without horizontal clipping. Screenshots are local artifacts under
  `output/playwright/whatsapp-disabled-{mobile,desktop}.png`.
- Preview `chisan-a17oxkp8k-lyzanors-projects.vercel.app` returned the same
  disabled-account fallback. Its callback returned the exact verification
  challenge (200), while POST intake remained unavailable (503).
- The complete `pnpm verify:ai` gate passed, including 13 deterministic WhatsApp
  tests and isolated review/publication workflow coverage. Production's runtime
  diagnostic reported 18/18 migrations and valid permissions. No DDL was needed.
- Authenticated linking, populated admin provenance and live provider intake
  still require the isolated activation smoke checks. This staged release does
  not certify the active producer journey or enable inference.

## 2026-09-11 — Intent clicks in the private producer statistics

- The statistics page now opens with the month's figures in one sentence
  ("Este mes tu ficha se abrió 240 veces y recibió 18 clics…") and a muted line
  for the last complete month. Wording says visits and clicks, never people:
  no visitor identity is recorded, so "personas" would misstate the measurement.
- The totals grid moves from four to three columns so the sixth tile (intent
  clicks) completes a 3×2 block instead of leaving two empty cells. At 640px and
  below it keeps the existing two-column fallback.
- The action breakdown is a label/number list capped at 42rem with hairline
  separators, not a sixth row of large number tiles; five short rows read faster
  than five more chips, and it keeps the visits chart as the page's only display
  of scale. Checked at 1280×1100 and 390×844 against the real stylesheets: three
  and two columns respectively, no horizontal overflow, headline wrapping to
  three lines at the narrow width.
- Public profile: intent targets are `data-producer-intent` attributes on the
  existing server-rendered links, so nothing changes visually and the links keep
  working without JavaScript. One delegated collector counts each action at most
  once per profile display.
- Verified in the production build with statistics enabled on the Agrisanz
  profile: nine marked targets, one POST per action, a second click on the same
  action silent, the hero "Llamar" shortcut and the `tel:` link counted as one
  intention, and a reload counting again. The view collector correctly stayed
  silent while the tab was hidden.
- Not verified in a browser: the statistics page itself, which needs an
  authenticated premium owner and a database. The local QA database
  (127.0.0.1:55439) was not running, so its layout was checked against the real
  stylesheets in a standalone page and its figures by the PGlite behavior tests.
  The dev server hangs compiling `/[catalog]/[area]/[segment]`; this reproduces
  with the change reverted and is unrelated to it.
