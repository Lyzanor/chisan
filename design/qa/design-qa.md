# Design QA log

One entry per reviewed surface: what was decided, what was rejected, and why.
Not a checklist — that lives in [`../README.md`](../README.md). Reference only
evidence committed to this repo; local capture paths rot.

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
