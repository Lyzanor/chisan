# Current Chisan identity

The supplied [identity sheet](chisan-reference.png) is the authority. The logo
is the **Chisan wordmark**. Its initial C carries one detached square in the
upper-right opening; the lower-right arm belongs to the C itself. The sheet
supplies no separate icon, so the app icon sets that same forest C on a rounded
rice-paper square, matching the site surface. The same initial C appears in
producer and selection QR centres.

| Resource | Use |
| --- | --- |
| `assets/chisan-wordmark-ink.png` | Forest wordmark on white |
| `assets/chisan-wordmark-reverse.png` | White wordmark on dark surfaces |
| `assets/chisan-mark-ink.png` | Standalone one-square C, including QR centres |
| `assets/chisan-icon-light.png` | App icon, 512 px, forest C on rice paper |
| `assets/chisan-icon-apple.png` | Apple touch icon, 180 px |
| `public/brand/chisan-wordmark.svg` | Website wordmark, lossless raster wrapper |
| `public/brand/chisan-mark.svg` | Website C, lossless raster wrapper |
| `app/favicon.ico` | Browser favicon, 16/32/48/256 px |

Run `node design/brand/build-favicon.cjs` from the repository root to regenerate
all these exports together. These SVG wrappers are not vector masters. Preserve
the supplied silhouette, proportions and the detached square. Do not typeset the
logo. The previous two-square C, dot, terminal-accent and leaf identities are
retired; Git preserves them. Dated QA screenshots are historical evidence, not
brand assets.

Page imagery follows [the image direction](../imagery.md).
