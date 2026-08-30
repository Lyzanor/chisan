# Chisan v0.3 design QA

## Evidence

- Identity source: `design/references/v0.3/chisan-wordmark-first-board.png`
- Selected map-mark source: `design/references/v0.3/chisan-marker-join-board.png`
- Category-bar source: `design/qa/category-bar-source-v0.2.png`
- Tonal references: `design/references/inspiration-giftee-home.png` and
  `design/references/inspiration-sanko-mobilefirst.png`
- Desktop home: `design/qa/implementation-home-desktop.png`
- Desktop catalog map: `design/qa/implementation-map-join-desktop.png`
- Mobile catalog map: `design/qa/implementation-map-join-mobile.png`
- Browser: Codex in-app browser against the local Next.js development server
- Desktop viewport: 1440 x 900 CSS pixels, device scale factor 1
- Mobile viewport: 390 x 844 CSS pixels, device scale factor 1

The selected Join board, the previous category bar, and the new desktop and
mobile implementations were opened together for the final visual comparison.

## States exercised

- Home route with the wordmark, localized tagline, location onboarding, and
  reversed footer wordmark.
- Madrid catalog with all categories: 245 producers found and 239 represented
  on the map model.
- Category selection changed to `Vino`; the URL updated to `?category=Vino`
  without a full-page navigation and the rendered marker set changed from 191
  viewport points to 33.
- Producer selection through `highlight`; exactly one Join marker received the
  selected treatment.
- Mobile header, horizontally scrolling category rail, map, and result layout.

## Visual comparison

### Typography and logo

- The selected wordmark asset is used directly; it is not reconstructed with a
  web font or CSS drawing.
- Noto Sans is loaded once through `next/font` and mapped through the design
  tokens. The live tagline remains localized product copy, separate from the
  logo asset.
- The compact mark is reserved for favicon/avatar contexts.

### Color, spacing, and surfaces

- Ink `#1d201b`, rice paper `#f5f1e8`, and moss `#52614c` match the selected
  direction.
- The header is a flat composition with a hairline divider; structural cards
  and controls avoid excessive capsules and shadow.
- Giftee informs the restrained negative space and editorial quiet. Sanko's
  mobile-first filter rhythm informs the legible, always-visible category rail;
  neither reference is copied as a template.
- Desktop and mobile captures show no horizontal overflow. At 390 px,
  `documentElement.clientWidth` and `scrollWidth` both measured 390 px.

### Map

- Producer locations remain exact catalog coordinates: no clustering, jitter,
  heatmap, or geographic displacement was introduced.
- Every default point uses the selected two-bracket Join at 18 px in pine,
  centered on its exact coordinate. It has no backing tile, so dense areas read
  as a field of producers rather than a stack of cards.
- The selected Join grows to 20 px inside a 28 px rice-paper surface with a
  moss emphasis ring.
- All 23 category options remain present in one horizontal icon-and-label rail.
  The rail scrolls on narrow screens while the map keeps visual priority.

### Image quality and copy

- Both logo files are full-resolution RGBA assets and remain sharp at their
  rendered sizes.
- The footer uses the same wordmark asset in reverse rather than a second
  drawing.
- Existing product copy and localization remain intact.

## Issues found and resolved

- P1: the initial optimized-image wrapper reserved the wordmark space but did
  not paint reliably in the tested header state. Resolved by using the same
  imported image asset as a CSS background through the brand adapter.
- P2: the consolidated category selector hid the breadth of the catalog and
  removed the familiar category icons. Superseded after user review by
  restoring the complete category rail and refining its v0.3 styling.
- P2: a selected Leaflet marker could retain its default icon when only URL
  state changed. Resolved by keying the marker to its selection state and
  verifying the highlighted treatment.
- P2: the first Join implementation placed every mark on a small white tile,
  making dense regions noisy. Resolved by keeping the real SVG asset bare and
  using only a subtle map-contrast halo.
- P2: the first mobile category-rail override extended the document by 6 px.
  Resolved by matching the rail bleed to the catalog page inset; the final
  390 px viewport measures a 390 px document width.

## Final checklist

- [x] Reference and implementation compared in one visual review.
- [x] Desktop and mobile layouts inspected.
- [x] Primary category and producer-selection interactions exercised.
- [x] All 23 categories remain discoverable in the visible rail.
- [x] Exact-coordinate producer density remains legible without clustering.
- [x] No browser console errors or warnings in the final state.
- [x] No remaining P0, P1, or P2 visual defects.
- [x] Design source is isolated under `design/`; no CSV or infrastructure
  contract is owned by the design system.

final result: passed
