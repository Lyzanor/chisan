# Chisan v0.3 design QA

## Evidence

- Source reference: `design/references/v0.3/chisan-wordmark-first-board.png`
- Desktop home: `design/qa/implementation-home-desktop.png`
- Desktop catalog map: `design/qa/implementation-map-desktop.png`
- Mobile catalog map: `design/qa/implementation-map-mobile.png`
- Browser: Codex in-app browser against the local Next.js development server
- Desktop viewport: 1440 x 900 CSS pixels, device scale factor 1
- Mobile viewport: 390 x 844 CSS pixels, device scale factor 1

The source board and all three implementation captures were opened together for
the final visual comparison.

## States exercised

- Home route with the wordmark, localized tagline, location onboarding, and
  reversed footer wordmark.
- Madrid catalog with all categories: 245 producers found and 239 represented
  on the map model.
- Category selection changed to `Vino` and back to all categories; the URL and
  producer result set updated without a full-page navigation.
- Producer selection through `highlight`; the selected point changed from the
  5 px field mark to the 9 px ink mark with rice-paper and moss rings.
- Mobile header, category selector, map, and result layout.

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
- Desktop and mobile captures show no horizontal overflow. At 390 px,
  `documentElement.clientWidth` and `scrollWidth` both measured 390 px.

### Map

- Producer locations remain exact catalog coordinates: no clustering, jitter,
  heatmap, or geographic displacement was introduced.
- The default point is a 5 px ink dot with a quiet rice-paper edge. The selected
  point is 9 px and receives the moss emphasis ring.
- The category ribbon was replaced by one native selector so the point field
  remains the dominant visual signal.

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
- P2: the category capsule ribbon competed with the producer field. Resolved by
  consolidating categories into a single selector.
- P2: a selected Leaflet marker could retain its default icon when only URL
  state changed. Resolved by keying the marker to its selection state and
  verifying the highlighted treatment.

## Final checklist

- [x] Reference and implementation compared in one visual review.
- [x] Desktop and mobile layouts inspected.
- [x] Primary category and producer-selection interactions exercised.
- [x] No browser console errors or warnings in the final state.
- [x] No remaining P0, P1, or P2 visual defects.
- [x] Design source is isolated under `design/`; no CSV or infrastructure
  contract is owned by the design system.

final result: passed
