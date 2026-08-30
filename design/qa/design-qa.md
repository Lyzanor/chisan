# Chisan v0.3 design QA

## Evidence

- Identity source: `design/references/v0.3/chisan-wordmark-first-board.png`
- Previous map-mark exploration: `design/references/v0.3/chisan-marker-join-board.png`
- Current map reference: `design/references/inspiration-alltrails-explore.png`
- Category-bar source: `design/qa/category-bar-source-v0.2.png`
- Tonal references: `design/references/inspiration-giftee-home.png` and
  `design/references/inspiration-sanko-mobilefirst.png`
- Desktop home: `design/qa/implementation-home-desktop.png`
- Desktop catalog map: `design/qa/implementation-map-circles-desktop.png`
- Final 6 px map: `design/qa/implementation-map-circles-6px-desktop.png`
- Selected producer: `design/qa/implementation-map-circles-selected.png`
- Mobile catalog map: `design/qa/implementation-map-circles-mobile.png`
- Account-menu source: `design/qa/account-menu-source-desktop.png`
- Signed-out account menu:
  `design/qa/account-menu-implementation-signed-out-open.png`
- Signed-in account menu, closed and open:
  `design/qa/account-menu-implementation-signed-in-closed.png` and
  `design/qa/account-menu-implementation-signed-in-open.png`
- Mobile account menu: `design/qa/account-menu-implementation-mobile-open.png`
- Language-placement source captures:
  `design/qa/source-language-area-before.png` and
  `design/qa/source-language-profile-before.png`
- Language-placement implementation captures:
  `design/qa/implementation-language-area-after.png`,
  `design/qa/implementation-language-profile-after.png`, and
  `design/qa/implementation-language-account-menu.png`
- Language-placement mobile captures:
  `design/qa/implementation-language-area-mobile.png` and
  `design/qa/implementation-language-profile-mobile.png`
- Browser: Codex in-app browser against the local Next.js development server
- Desktop viewport: 1440 x 900 CSS pixels, device scale factor 1
- Mobile viewport: 390 x 844 CSS pixels, device scale factor 1

The loaded AllTrails source and the new desktop implementation were captured at
the same 1440 x 900 viewport and opened together for the final visual
comparison. The current Chisan header and both account states were likewise
captured at the same viewport and opened together before mobile inspection.
The language-placement source and implementation captures are also 1440 x 900
pixels at a 1440 x 900 CSS viewport and device scale factor 1. Their matching
area and producer states were opened in one combined comparison. The focused
region was already fully legible in those captures, so no additional crop was
needed. Because Clerk is not configured in the local preview, the account-menu
capture and route-change check used a temporary signed-out render harness; that
harness was reverted and is absent from the final diff.

## States exercised

- Home route with the wordmark, localized tagline, location onboarding, and
  reversed footer wordmark.
- Madrid catalog with all categories: 245 producers found and 239 represented
  on the map model.
- Category selection changed to `Vino`; the URL updated to `?category=Vino`
  without a full-page navigation and the rendered marker set changed from 191
  viewport points to 33.
- A marker hover exposed the producer name, and a click opened the existing
  producer popup and profile link.
- Producer selection through `highlight`; exactly one circle received the
  selected treatment while the other 190 visible circles stayed unchanged.
- Signed-out account menu with the `Mi cuenta` summary, language selection,
  sign-in and registration actions.
- Signed-in account menu with localized `Hola, Aiko`, language selection,
  account, favorites and sign-out actions.
- Barcelona area and Cal Garrigosa profile with no standalone language control.
- Account-menu registration on Barcelona exposed `Català`, `Español`, and
  `English`; selecting `Català` navigated to `/ca-es/barcelona`, updated the
  document language to `ca`, and retained the single language-control location.
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

### Account menu

- The closed control stays aligned with the quiet header and becomes the
  localized greeting only after Chisan resolves the signed-in display name.
- The open panel uses one hairline, a white surface and square structural
  corners. Language and account actions are rows rather than another family of
  capsules.
- The same language options already supplied by each catalog view feed the
  header menu, so area-level locale availability and URLs are not duplicated.
- At 390 px the panel stays within the viewport and every control retains a
  minimum 40–44 px interaction target.
- Area, country, and producer views now register their exact locale URLs through
  a non-rendering bridge. The visible language control lives only inside the
  account menu; the removed standalone control leaves no empty container or
  compensating spacer.

### Language-placement comparison

- Fonts and typography are unchanged; removing the duplicate control does not
  alter the existing Noto Sans hierarchy, wrapping, or optical weight.
- Area spacing improves because the province selector now owns the header-control
  column. On producer profiles, the back link and breadcrumb move up by the exact
  height of the removed language row without introducing an arbitrary gap.
- Colors and tokens are unchanged. No replacement surface, capsule, or accent
  was introduced.
- Image crops and asset rendering are identical before and after the change.
- Existing labels and localized content remain intact; only the duplicate
  presentation of the language choices was removed.

### Map

- Producer locations remain exact catalog coordinates: no clustering, jitter,
  heatmap, or geographic displacement was introduced.
- AllTrails informed the compact circle grammar and selected-state hierarchy;
  Chisan keeps its own pine, moss and rice-paper tokens and does not adopt
  clustered count pills.
- Every default point is a map-native 6 px solid dark-pine circle at full opacity,
  centred on its exact coordinate. Dense areas read as a field of quiet points
  rather than outlined objects.
- The selected circle grows to 8 px, remains dark pine and gains a 2 px
  rice-paper outline without changing position.
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
- P2: even without the backing tile, repeating The Join at catalog density made
  the map feel too branded and reduced the speed of reading locations. Resolved
  after user review by replacing it with compact map-native circles and
  removing the superseded runtime marker asset.
- P1: the first circle pass used 10 px hollow points, which remained too large
  at Madrid density, and the generated SVG paths retained Leaflet's blue
  default attributes beneath the design CSS. Resolved after user review with
  4 px solid pine points, an 8 px selected state, and explicit token-backed
  Leaflet path colours so no blue fallback remains.
- P2: the 4 px follow-up was too faint for scanning producer density. Resolved
  with 6 px fully opaque dark-pine points while retaining the existing 8 px
  selected hierarchy and rice-paper outline.
- P2: the first mobile category-rail override extended the document by 6 px.
  Resolved by matching the rail bleed to the catalog page inset; the final
  390 px viewport measures a 390 px document width.
- P2: language choice appeared both in the page content and the account menu,
  splitting ownership of one global preference and adding capsule noise to area
  and producer headers. Resolved by replacing every catalog-page switcher with
  `LanguageMenuRegistration`, removing the old visual component and CSS, and
  verifying the area and profile against
  `design/qa/implementation-language-area-after.png` and
  `design/qa/implementation-language-profile-after.png`. No P0/P1/P2 issue
  remained in the post-fix comparison.

## Final checklist

- [x] Reference and implementation compared in one visual review.
- [x] Desktop and mobile layouts inspected.
- [x] Signed-out and signed-in account-menu states exercised.
- [x] Localized greeting, language selection, favorites and sign-out inspected.
- [x] Standalone language selectors removed from country, area and producer
  views while their exact locale routes remain available in the account menu.
- [x] Account-menu language change exercised from Spanish to Catalan.
- [x] Primary category and producer-selection interactions exercised.
- [x] Marker hover, popup and profile-link state exercised.
- [x] All 23 categories remain discoverable in the visible rail.
- [x] Exact-coordinate producer density remains legible without clustering.
- [x] No browser console errors or warnings in the final state.
- [x] No remaining P0, P1, or P2 visual defects.
- [x] Design source is isolated under `design/`; no CSV or infrastructure
  contract is owned by the design system.

final result: passed

# How Chisan works design QA

## Evidence

- Visual source: `/Users/lyzanor/.codex/visualizations/2026/08/30/01a05428-2776-7760-b2ef-3a56a98f551b/chisan-agentic-audit/03-current-our-purpose.png`
- Desktop implementation: `/Users/lyzanor/.codex/visualizations/2026/08/30/01a05428-2776-7760-b2ef-3a56a98f551b/chisan-agentic-audit/04-how-we-work-desktop.png`
- Combined comparison: `/Users/lyzanor/.codex/visualizations/2026/08/30/01a05428-2776-7760-b2ef-3a56a98f551b/chisan-agentic-audit/05-reference-vs-how-we-work.png`
- Mobile hero: `/Users/lyzanor/.codex/visualizations/2026/08/30/01a05428-2776-7760-b2ef-3a56a98f551b/chisan-agentic-audit/07-how-we-work-mobile.png`
- Mobile process: `/Users/lyzanor/.codex/visualizations/2026/08/30/01a05428-2776-7760-b2ef-3a56a98f551b/chisan-agentic-audit/08-how-we-work-mobile-process.png`
- Browser: Codex in-app browser against the local Next.js development server
- Desktop comparison viewport: 1265 x 712 CSS pixels, device scale factor 1
- Mobile test viewport: 390 x 844 CSS pixels, device scale factor 1

The source and implementation were captured at the same 1265 x 712 viewport,
stacked in one comparison image, and reviewed together. The mobile hero and
catalog-process section were inspected at the narrow breakpoint.

## States exercised

- English `/how-we-work` hero, process, trust, participation, access and footer.
- Spanish server-rendered copy with `chisan_locale=es`.
- Mobile hero and numbered process steps.
- Navigation from `Contact Chisan` to `/contact`.
- Permanent redirects from `/our-purpose` and `/about`.
- Public `/llms.txt`, metadata and structured-data output.
- Useful 404 content for unknown public routes.

## Visual comparison

- The new hero preserves the source surface, border, asymmetrical text column,
  Noto Sans hierarchy, rice-paper background, ink and moss palette.
- The longer title keeps the source's large two-line editorial treatment rather
  than introducing a new landing-page pattern.
- Subsequent sections use the same hairlines, spacing and typographic hierarchy;
  the numbered process and trust principles remain flat content, not card grids.
- At the mobile breakpoint, the layout becomes one clear reading column. The
  measured document width equals its client width (375 CSS pixels), so there is
  no horizontal overflow.
- The existing brand assets remain unchanged and sharp.

## Issues found and resolved

- P1: internal public links initially used plain anchors and failed the Next.js
  lint rule. Resolved by using `next/link`.
- P2: the Catalan behavior assertion still expected the retired purpose and
  GitHub labels. Resolved by checking the new localized footer labels.
- A stitched full-page browser capture visually repeated sections, but DOM
  inspection confirmed one instance of every section and one footer. Focused
  viewport captures were used for the final visual judgment.

## Final checklist

- [x] Reference and implementation reviewed in one combined image.
- [x] Desktop and mobile layouts inspected.
- [x] English and Spanish content verified.
- [x] Primary contact navigation exercised.
- [x] Useful 404 route rendered and inspected.
- [x] No horizontal overflow at the narrow breakpoint.
- [x] No browser console errors or warnings.
- [x] Lint, production build and behavior tests pass.
- [x] No remaining P0, P1 or P2 visual defects.

final result: passed
