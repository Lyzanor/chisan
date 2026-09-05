# Chisan design

The visual system: rules, tokens, brand assets, and the web mapping.
This guide owns the visual system. Components consume its tokens while their
product contracts own data, permissions and meaning.

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

## Ownership and working defaults

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
catalog, profile, account and admin presentation is still `app/globals.css` (ordered imports from `app/styles/`) or
a page-owned CSS module. Those files consume the mapped tokens and remain in
scope for design work even though they live outside this folder.

## Checking

```bash
pnpm check:design
```

The checker reports style drift and catches narrow mechanical accessibility
regressions. Style choices are defaults, not permanent prohibitions. Use
`--list <rule>` to inspect locations; judge contrast, focus and responsive
behavior in the browser. A count alone cannot prove accessibility.

Preserve readable contrast, keyboard operation, clear focus, honest maps and
reduced-motion support. The palette, type scale, shapes and map density are
current product decisions. A justified change may revise them with visual QA.

## Colour

| Token           |     Value | Role                                    |
| --------------- | --------: | --------------------------------------- |
| `rice-paper`    | `#F5F1E8` | Page field                              |
| `surface`       | `#FFFDF8` | Controls, raised surfaces               |
| `surface-muted` | `#ECE8DE` | Table headers, quiet fills              |
| `ink`           | `#1D201B` | Text, wordmark, dark surfaces           |
| `stone`         | `#686C66` | Secondary text, map labels              |
| `hairline`      | `#D7D3C9` | Rules, borders, map geometry            |
| `moss`          | `#52614C` | Primary action, focus, active selection |
| `moss-dark`     | `#344237` | Text on `moss-pale`                     |
| `moss-pale`     | `#E5E8E1` | Quiet selected state                    |

Every other pair meets WCAG AA. These three do not — never use them:

- `stone` on `surface-muted` (4.37) → use `ink`
- `stone` on `moss-pale` (4.32) → use `moss-dark`
- `hairline` on `rice-paper` (1.33) → decorative only; a meaningful edge needs
  `stone` or darker

Moss is functional: less visual area than the content it supports. No gradients,
tinted shadows, saturated fields or colour-coded card sets. Status colours
(error, warning, success, verification) belong to their product contract.

## Type

One family: **Noto Sans**, with the Noto or system fallback per script. Prefer sans-serif fallbacks; choose a script-appropriate fallback when it
better preserves legibility.

| Role      | Weight | Size    | Line height   |
| --------- | ------ | ------- | ------------- |
| Display   | 500    | 48–88px | 0.98–1.05     |
| Heading   | 500    | 28–40px | 1.1–1.2       |
| Body      | 400    | 16–18px | 1.55–1.7      |
| Interface | 500    | 14–16px | 1.35–1.5      |
| Metadata  | 500    | 12–13px | 1.4, `0.04em` |

`next/font` loads 400, 500 and 700. The current CSS defaults to 400 and 500, using size, position and space
for hierarchy. A different weight is a design decision to evaluate in context. 700 belongs to `<strong>` and
`<b>`, where the browser applies it and the meaning is in the markup. Nothing
under 12px. Reading column 58–64 characters.

## Space, shape, line

- Base 4px. Scale `4 8 12 16 24 32 48 64 96 128`. Prefer these steps for padding, margin and gaps; optical corrections and
  responsive dimensions may use other values when justified.
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

One point per producer, at its exact coordinate. The current map uses individual points without clustering. Keep source
coordinates unchanged; a future density treatment may group their presentation
when navigation, counts and access to each producer remain clear. Never change
coordinates just to improve appearance.

- Area overviews use exact-coordinate 6px `moss-dark` points below zoom 11;
  from zoom 11, each producer uses its existing colourful category pictogram
  in a 24px `surface` disc. The active or previewed producer grows above its
  neighbours, keeps a `moss` edge and retains the same 44px interaction target.
- Land `rice-paper`, controls `surface`, geometry `hairline`, labels `stone`.
- All categories stay in one scrollable filter bar, one icon and label each.
- Result counts remain available to assistive technology; visual density stays
  visible spatially without a redundant total.
- The discovery list uses one continuous mapped roster, with producers near the
  current opening view first and no map-only scope. Once list navigation begins,
  that order stays fixed so map focus cannot move a row beneath the pointer or
  keyboard focus.
- Marker activation highlights and reveals the matching producer row. When the
  selected producer falls outside the bounded base roster, append that one row
  without reordering the existing results, then scroll it into view.
- Searching filters producer name, locality, category and description without
  introducing another catalog source or changing the URL.
- Hovering or focusing a list row previews the exact producer on the map and
  linked producer surface. A restrained `moss-pale` row treatment preserves
  the connection; clicking remains the durable URL selection.
- On small area-discovery screens, the producer list is an always-visible,
  attached roster below the map. Profile producer selections may use an
  attached non-modal disclosure; its open state uses `moss-pale` and a `moss`
  edge, never a floating shadow.
- Public selections and their private previews show exactly the chosen producers.
  Fit the whole mapped set on opening and preserve one stable roster, including
  unmapped profile links. Geography never groups or ranks a selection. Keep the
  map above the optional QR disclosure; title and description provide context.
- A selected producer may load one reviewed 4:3 catalog image lazily. Lists and
  map points never preload producer imagery.

### Map component contract

There is one producer-map stack. Pages configure it; they never redraw markers
or redefine selection styles.

```
components/map/producers-map.tsx                 public map boundary
components/map/producers-map-inner.tsx           private Leaflet renderer
components/map/producer-map-selection-card.tsx   linked selected surface
components/map/use-dismissible-producer-map-selection.ts  outside/Escape dismissal
components/area-explorer.tsx                     area filters and URL state
components/producer-selection-explorer.tsx       explicit selection and URL state
```

Every marker crosses the public boundary with one opaque key. Area maps use the
area-local slug, profile selections use `country:producer_id`, and a producer
detail fixes its current slug as the selected key. Selection is presentation
state: it never changes identity, coordinates, favorites, grouping or
authorization.

The public boundary exposes three explicit marker interactions: `select` for a
synchronized map and list, `popup` for a standalone browsing map, and `static`
for contextual location. Controllers normally infer `select` from their
selection callback; detail pages state `static` explicitly.

On a multi-producer map, marker and list activation select and focus the same
exact point, paint only that point above its neighbours, and expose the shared
linked name-description-image surface. Pointer hover and keyboard focus may
preview that same linked state without writing `highlight`; only activation
creates durable URL selection.
The `highlight` query records selection; Escape, outside activation and browser
Back/Forward clear or restore it. Initial and nearby framing never imply
selection. Items without coordinates remain ordinary profile links rather than
pretending to select a missing point.

A producer-detail map renders its sole producer in fixed selected state and
keeps that contextual point non-interactive. It does not repeat the selected
card or open a self-referential popup because the page itself is that surface.
Every interactive category pictogram uses the full 44px target, including at
overview zooms. Fixed detail points are non-essential map context.

## Producer profile

The breadcrumb provides the profile's catalog context; the page does not repeat
it with a sticky Map / Categories / Information bar. Website, directions,
telephone, Instagram, Facebook and public email use the same compact action
treatment, with email labelled as a contact action rather than exposing the
address as the primary call to action. Account and ownership actions sit after
the location map and before related-category discovery.

## Brand

The lower-case wordmark **chisan** is the logo, shipped as a raster. The compact
`c` is a crop of it, for favicons, avatars and square icons only — never beside
the wordmark. Short `moss` caps mark both terminals of the compact `c`; the
wordmark repeats that signature only on the natural terminals of `c` and `s`.

- Wordmark above 88px of width, glyph below. Minimums: 88px and 16px.
- Clear space: one glyph stroke width. The primary body is `ink`; the reversed
  body is `surface`. Both retain the `moss` terminal caps.
- Tagline stays separate live text. Never redraw the logo in font, CSS or SVG.
- No containers, outlines, shadows, gradients or colours outside `ink`,
  `surface` and the approved `moss` caps.
- No food, leaf, map-pin, seal, torii, ensō, calligraphy, rising-sun or
  network-node motifs.

Profile QR labels keep the code itself in `ink` on `surface`, with its full
quiet zone and no logo overlay. The producer label has a `moss` outer rule; a
public user's producer selection has an `ink` rule. Use the wordmark on the
physical label and the compact `c` only as the square UI affordance that opens
it. Neither treatment implies verification, ownership, premium status or a
reviewed restaurant/shop classification.

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

Pointer targets at least 44×44px, except for the documented dense-map point
target paired with its synchronized list control. Visible labels, logical
heading order, no essential text inside an image. Prominence never implies
stronger evidence.

## Before you ship

- [ ] Every colour is a token above, and no banned pair.
- [ ] Every space value is on the 4px scale.
- [ ] Every size and weight is in the type table.
- [ ] Pills only on toggles.
- [ ] Targets 44×44px, apart from the documented dense-map exception; focus
      visible as an outline.
- [ ] No horizontal overflow at 390px.
- [ ] Checked in one long or non-Latin locale.

Record material decisions and browser evidence in [`qa/design-qa.md`](qa/design-qa.md).
Routine edits that preserve the system need only the verification relevant to
the change. Avoid duplicating the same design rule in product contracts.

## Regenerating the brand assets

From `references/v0.3/chisan-wordmark-first-board.png`, with an image model:

> Isolate and faithfully recreate only **[the lowercase `chisan` wordmark |
> the compact `c`]** from the board as a crisp, high-resolution transparent PNG
> with an `ink` `#1D201B` body. Preserve **[the custom lowercase proportions,
> open `c`, wide geometric rhythm, single-storey `a` and optical spacing | its
> open circular form, diagonal-cut terminals, weight, aperture and 16px
> legibility]**. Recolour only **[the four natural terminals of `c` and `s` |
> the two terminals of `c`]** with equal short `moss` `#52614C` caps. Keep every
> other pixel and the alpha silhouette unchanged. Include no background,
> tagline, symbol, container, border, shadow, gradient, labels or extra text.

The terminal-accent references were generated with OpenAI image generation
from the approved mark and wordmark. The production rasters preserve the prior
alpha geometry, use only the exact `ink`, `surface` and `moss` colours, and
remain image assets rather than a live-font, CSS or SVG approximation.

## References

- `v0.3/chisan-wordmark-first-board.png` — approved direction and source of the
  production rasters.
- `v0.3/chisan-terminal-accent-mark-reference.png` — approved two-cap compact mark.
- `v0.3/chisan-terminal-accent-wordmark-reference.png` — approved restrained
  `c`/`s` treatment.
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
