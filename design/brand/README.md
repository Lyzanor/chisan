# Current Chisan identity

The supplied [identity sheet](chisan-reference.png) is the authority. The logo
is the left **Chisan wordmark only**. Its initial C contains two detached squares.
The separate white C on a forest square at the right is the favicon, never an
extra suffix to the logo. The same initial C appears in producer and selection QR.

| Resource | Use |
| --- | --- |
| `assets/chisan-wordmark-ink.png` | Forest wordmark on white |
| `assets/chisan-wordmark-reverse.png` | White wordmark on dark surfaces |
| `assets/chisan-mark-ink.png` | Standalone two-square C, including QR centres |
| `assets/chisan-icon-light.png` | Supplied favicon, 512 px |
| `assets/chisan-icon-apple.png` | Apple touch icon, 180 px |
| `public/brand/chisan-wordmark.svg` | Website wordmark, lossless raster wrapper |
| `public/brand/chisan-mark.svg` | Website C, lossless raster wrapper |
| `app/favicon.ico` | Browser favicon, 16/32/48/256 px |

Run `node design/brand/build-favicon.cjs` from the repository root to regenerate
all these exports together. These SVG wrappers are not vector masters. Preserve
the supplied silhouette, proportions and both squares. Do not typeset the logo.
The previous dot, terminal-accent and leaf identities are retired; Git preserves
them. Dated QA screenshots are historical evidence, not brand assets.

Page imagery follows [the image direction](../imagery.md).
