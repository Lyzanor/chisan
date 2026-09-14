# Current design QA

Active system: [Product in the light](../README.md). Earlier verification is
preserved in [history](history/README.md); it does not specify the current brand.

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
