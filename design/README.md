# Chisan design

The visual system: rules, tokens, brand assets, and the web mapping.
Nothing here reads catalog data, accounts or infrastructure — and nothing there
carries visual decisions.

The active release is **v0.3 — The Passage**. Its philosophy is quiet
precision: the producer, place and evidence lead; the interface connects them
without flattening their differences.

```
foundations/tokens.css   colour, type, space, shape, motion tokens
adapters/web.css         maps those tokens onto the web surface
brand/assets/            the two approved logo rasters
references/              decision boards and inspiration (never imported)
qa/design-qa.md          what was decided and rejected, per surface
```

## Boundary — read this first

`app/_components/site-root-shell.tsx` imports, in this order:

```
app/globals.css  →  foundations/tokens.css  →  adapters/web.css
```

`tokens.css` is the only place brand colours, spacing and radii are declared. It
also publishes the older `--accent` / `--radius` names that `globals.css` still
consumes, so `globals.css` cannot render without it. Semantic product colours,
such as errors and verification states, remain with their product contract.

`adapters/web.css` currently styles the header, footer, account and language
menu, category chips, location onboarding, wordmark and map. Most remaining
catalog, profile, account and admin presentation is still `app/globals.css` or
a page-owned CSS module. Those files consume the mapped tokens and remain in
scope for design work even though they live outside this folder.

## Checking

```bash
pnpm check:design
```

Eight rules, each with a baseline: the violation count on the day the rule was
written. The check fails when a count rises, so the app can only move toward the
system. Fix a violation, then lower its baseline — the script tells you the
number. `--list <rule>` prints the offending lines.

## Colour

| Token | Value | Role |
|---|---:|---|
| `rice-paper` | `#F5F1E8` | Page field |
| `surface` | `#FFFDF8` | Controls, raised surfaces |
| `surface-muted` | `#ECE8DE` | Table headers, quiet fills |
| `ink` | `#1D201B` | Text, wordmark, dark surfaces |
| `stone` | `#686C66` | Secondary text, map labels |
| `hairline` | `#D7D3C9` | Rules, borders, map geometry |
| `moss` | `#52614C` | Primary action, focus, active selection |
| `moss-dark` | `#344237` | Text on `moss-pale` |
| `moss-pale` | `#E5E8E1` | Quiet selected state |

Every other pair meets WCAG AA. These three do not — never use them:

- `stone` on `surface-muted` (4.37) → use `ink`
- `stone` on `moss-pale` (4.32) → use `moss-dark`
- `hairline` on `rice-paper` (1.33) → decorative only; a meaningful edge needs
  `stone` or darker

Moss is functional: less visual area than the content it supports. No gradients,
tinted shadows, saturated fields or colour-coded card sets. Status colours
(error, warning, success, verification) belong to their product contract.

## Type

One family: **Noto Sans**, with the Noto or system fallback per script. No serif
anywhere in a fallback chain.

| Role | Weight | Size | Line height |
|---|---|---|---|
| Display | 500 | 48–88px | 0.98–1.05 |
| Heading | 500 | 28–40px | 1.1–1.2 |
| Body | 400 | 16–18px | 1.55–1.7 |
| Interface | 500 | 14–16px | 1.35–1.5 |
| Metadata | 500 | 12–13px | 1.4, `0.04em` |

`next/font` loads 400, 500 and 700. CSS uses only 400 and 500 — hierarchy comes
from size, position and space, never from weight. 700 belongs to `<strong>` and
`<b>`, where the browser applies it and the meaning is in the markup. Nothing
under 12px. Reading column 58–64 characters.

## Space, shape, line

- Base 4px. Scale `4 8 12 16 24 32 48 64 96 128`. Every padding, margin and gap
  lands on a step.
- Shell up to 1440px, gutters 20–40px. Discovery is asymmetric 5/7 or 4/8; data
  tools use strict grids.
- Radius: `0` structural, `4px` control, `8px` compact object.
- `999px` is for filters and tags only — things you can toggle or remove. Never
  navigation, buttons, badges or links.
- Border 1px `hairline`; selected 1px `moss`. Focus is a 2px `moss` `outline`
  with 2px offset, on every interactive element.
- No shadow. Overlays alone may use `0 16px 40px rgb(29 32 27 / 10%)`.
- A card exists only when its content is one selectable, reusable object.

## Map

One point per producer, at its exact coordinate. No clustering, jitter, offset
or heatmaps — ever.

- Default: 6px `moss-dark` circle at full opacity, no outline.
- Selected: 8px `moss-dark` fill, 2px `surface` outline, same position.
- Land `rice-paper`, controls `surface`, geometry `hairline`, labels `stone`.
- All categories stay in one scrollable filter bar, one icon and label each.
- Result counts remain available to assistive technology; visual density stays
  visible spatially without a redundant total.

## Brand

The lower-case wordmark **chisan** is the logo, shipped as a raster. The compact
`c` is a crop of it, for favicons, avatars and square icons only — never beside
the wordmark.

- Wordmark above 88px of width, glyph below. Minimums: 88px and 16px.
- Clear space: one glyph stroke width. `ink`, reversed on rice paper or white.
- Tagline stays separate live text. Never redraw the logo in font, CSS or SVG.
- No containers, outlines, shadows, gradients or extra colours.
- No food, leaf, map-pin, seal, torii, ensō, calligraphy, rising-sun or
  network-node motifs.

Sizing and alt text live in `components/brand/chisan-brand.tsx`. Give an image
empty alt text when its link already has an accessible name.

## Motion, voice, access

Motion orients, it does not perform: 140ms feedback, 200ms components, 320ms
map and page changes, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`. Opacity and
4–8px only. Honour `prefers-reduced-motion`.

Photography is documentary — real production, people and places in available
light. Nothing staged, nothing implying an unsupported fact.

Write with exact nouns and plain uncertainty. Keep **Connecting local food.**
exact, including the period. Layouts expand for translation rather than
truncate; no locale is a variant of another.

Pointer targets at least 44×44px. Visible labels, logical heading order, no
essential text inside an image. Prominence never implies stronger evidence.

## Before you ship

- [ ] Every colour is a token above, and no banned pair.
- [ ] Every space value is on the 4px scale.
- [ ] Every size and weight is in the type table.
- [ ] Pills only on toggles.
- [ ] Targets 44×44px, focus visible as an outline.
- [ ] No horizontal overflow at 390px.
- [ ] Checked in one long or non-Latin locale.

Log the decision in [`qa/design-qa.md`](qa/design-qa.md).

## Regenerating the brand assets

From `references/v0.3/chisan-wordmark-first-board.png`, with an image model:

> Isolate and faithfully recreate only **[the lowercase `chisan` wordmark |
> the compact `c`]** from the board as a crisp, high-resolution transparent PNG
> in solid ink `#1D201B`. Preserve **[the custom lowercase proportions, open
> `c`, wide geometric rhythm, single-storey `a` and optical spacing | its open
> circular form, diagonal-cut terminals, weight, aperture and 16px
> legibility]**. Include no background, tagline, symbol, container, border,
> shadow, gradient, labels or extra text.

The two production RGBA rasters were generated with OpenAI image generation
from approved option 1 of that board. They remain image assets rather than a
live-font, CSS or SVG approximation.

## References

- `v0.3/chisan-wordmark-first-board.png` — approved direction and source of the
  production rasters.
- `v0.3/chisan-marker-join-board.png` — The Join marker, superseded by map circles.
- `v0.2/` — earlier board and functional mark.
- `inspiration-giftee-home.png` — capture of <https://giftee.co.jp/> on
  2026-08-30; editorial restraint and asymmetric whitespace.
- `inspiration-sanko-mobilefirst.png` — capture of
  <https://sankoudesign.com/category/mobilefirst/> on 2026-08-30; visible
  filter families and mobile rhythm.
- `inspiration-alltrails-explore.png` — capture of
  <https://www.alltrails.com/explore> on 2026-08-30; small map points and
  selected-state hierarchy. Chisan does not adopt its clustering.

Reference captures explain decisions; they are never runtime imports or page
templates.
