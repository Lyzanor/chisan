# Chisan brand assets

The active identity is **v0.3 — The Passage**.

## Runtime assets

- `assets/chisan-wordmark-ink.png` — primary lower-case wordmark with alpha.
- `assets/chisan-mark-ink.png` — compact `c` glyph for square system contexts.
- `assets/chisan-map-marker.svg` — The Join, the cartographic producer marker.

The wordmark and compact glyph are high-resolution RGBA masters generated from
the approved option 1 reference. The Join is the approved source vector selected
from the v0.3 identity board. Runtime sizing, selection treatment and accessible
text live in the small web adapter rather than in duplicate logo files.

## Usage

- Use the wordmark in headers, footers and any context at least 88 px wide.
- Use the compact glyph only for favicons, avatars and very small attribution.
- Use The Join for exact producer locations on maps; keep its centre on the
  catalog coordinate and reserve the moss ring for selection.
- Keep the tagline as live text and localise it independently.
- Give an image empty alternative text when its link already has an accessible
  name; otherwise use `chisan`.
- Do not rebuild the wordmark from a font, SVG path, CSS geometry or text glyph.
- Do not import anything from `references/` into production.

The application adapter is
`components/brand/chisan-brand.tsx`. Replacing an identity requires new assets
here and one adapter update; it does not require changes to catalog data or
infrastructure.

See [`PROVENANCE.md`](PROVENANCE.md) for the final asset-generation prompts.
