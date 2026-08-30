# Chisan design language

Status: foundation proposal (v0.2). This document defines the visual direction;
it does not authorize a site-wide migration by itself.

Chisan's design idea is **quiet utility**. The product should become almost
invisible around the producer, the place and the evidence. Its Japanese
influence lives in space, proportion, reduction and material honesty—not in
decorative cultural references.

The brand promise remains exactly **Connecting local food.**

## 1. Direction

Chisan should feel:

- **Clear:** one hierarchy and one obvious next action.
- **Quiet:** near-monochrome, spacious and free of decorative effects.
- **Exact:** factual content and interaction states never become ambiguous.
- **Rooted:** real places and production lead; the brand provides the frame.
- **Global:** typography and layout work across writing systems without making
  any locale look secondary.

The shorthand is **one typeface, one ink, one field colour and meaningful
space**.

## 2. Principles

### Space is the primary material

Whitespace defines groups, pace and importance. Do not replace space with
cards, shadows, separators or labels. Empty space must make the reading order
clear.

### One visual decision at a time

A screen may have one dominant heading, one primary action and one active
colour. If everything is framed or emphasised, nothing is.

### Asymmetry, then alignment

Use asymmetric 5/7 or 4/8 compositions for discovery and editorial pages.
Inside each region, alignment is strict. Data-heavy tools remain regular grids.

### Material honesty

Texture belongs to real photography. The interface stays flat and clean. Never
simulate paper grain, ink bleed or handmade imperfection over catalog data.

## 3. Logo

### Primary logo: wordmark only

The primary Chisan logo is the lower-case wordmark **chisan**. It uses `Noto
Sans Medium`, with optical kerning and `0.01em` tracking. There is no symbol,
tagline, coloured dot or enclosing shape in the primary logo.

Lower case makes the identity quieter and less institutional. In prose,
metadata and product copy, the name remains **Chisan** with an initial capital.

The wordmark should be converted to outlines only after the exact font build
and spacing are approved. Until then, it remains live type.

### Functional mark: The Join

The separate functional mark is reserved for favicons, app icons, compact map
attribution and avatars. Two opposing field outlines almost meet around a
precise central gap:

- the two shapes are distinct local places;
- the shared axis is connection;
- the open middle keeps the system participatory rather than closed.

It is not a monogram and should not be interpreted as a letter. It contains no
circle, dot, leaf, map pin or Japanese character.

### Logo rules

- Use the wordmark alone whenever at least 72 px of horizontal space exists.
- Use the functional mark only when the wordmark cannot remain legible.
- Primary colour: `sumi`; reverse colour: white; optional brand colour: `pine`.
- Clear space: one wordmark letter-height on every side.
- Minimum sizes: 16 px for the mark; 72 px wide for the wordmark.
- Never place the mark and wordmark together merely to decorate a header.
- Never use gradients, shadows, outlines, containers or multicolour variants.
- Never add the tagline inside the logo.

Avoid ensō circles, seals, torii, rising suns, imitation calligraphy, sakura and
any literal “Japanese” decoration. The influence belongs to the system, not the
iconography.

The editable functional mark is
[`docs/brand/chisan-mark.svg`](brand/chisan-mark.svg).

## 4. Colour

Chisan is neutral by default. Pine is the only brand colour and should occupy
less visual area than the content it supports.

| Token | Hex | Role |
|---|---:|---|
| `washi` | `#F7F7F3` | Warm page canvas |
| `white` | `#FFFFFF` | Controls and elevated surfaces |
| `sumi` | `#151815` | Text, logo and dark surfaces |
| `stone` | `#666B66` | Secondary text |
| `hairline` | `#D9DCD6` | Borders, rules and map geometry |
| `pine` | `#40584A` | Primary action, link and active selection |
| `pine-pale` | `#E7ECE8` | Quiet selected or expanded state |

Core pairs meet WCAG AA for normal text: sumi on washi `16.66:1`, stone on
washi `5.07:1`, pine on washi `7.21:1` and white on pine `7.74:1`.

### Colour behaviour

- Most screens use only washi, white, sumi, stone and hairline.
- Pine appears on the main action, active navigation and selected map point.
- Error, warning, success and verification colours are semantic product tokens,
  not brand decoration. They follow their owning contracts.
- Never use colour alone to communicate state.
- Avoid gradients, tinted shadows, colour-coded card collections and large
  saturated backgrounds.

## 5. Typography

Chisan uses one family: **Noto Sans**. Japanese uses **Noto Sans JP**; other
scripts use the corresponding Noto Sans family or the best system fallback.
This gives the product one quiet voice while respecting each writing system.

- Wordmark: 500, lower case, `0.01em` tracking.
- Display: 500, 48–88 px, line-height `0.96–1.05`, tracking `-0.035em`.
- Section heading: 500, 28–40 px, line-height `1.1–1.2`, tracking `-0.02em`.
- Body: 400, 16–18 px, line-height `1.55–1.7`, maximum `64ch`.
- Interface: 500, 14–16 px, line-height `1.35–1.5`.
- Metadata: 500, 12–13 px, line-height `1.4`, tracking `0.04em`.

Do not use a display serif, ultra-light weights, all-caps paragraphs or bold as
the default hierarchy. Use size, position and space before increasing weight.
The normal product range is 400–600; 700 is reserved for exceptional compact
legibility needs.

## 6. Layout and spacing

Use a 4 px base with the scale `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

- Shell: up to 1440 px, with 20–40 px responsive gutters.
- Reading column: 58–64 characters.
- Desktop grid: 12 columns; mobile grid: 4 columns.
- Discovery/editorial composition: 5/7 or 4/8.
- Section space: normally 64–128 px.
- Component space: normally 8–24 px.
- Align related text to one edge; centre only short, isolated statements.

One page should normally contain one dominant surface. A card exists only when
its contents behave as one selectable or independently reusable object.

## 7. Shape and line

- Radius: 0 px for structural regions, 4 px for controls, 8 px for compact
  cards. Use 999 px only for tags and filters.
- Border: 1 px `hairline`; selected border: 1 px `pine`.
- Icon stroke: 1.5 px at 20–24 px, square or subtly rounded caps.
- Default shadow: none.
- Overlay shadow only: `0 16px 40px rgb(21 24 21 / 10%)`.

Avoid decorative containers, glass effects, soft blobs, oversized radii,
floating card stacks and more than two border styles on one screen.

## 8. Interface behaviour

- Primary buttons are rectangular, pine and compact; never pill-shaped.
- Secondary actions are text links or white controls with a hairline border.
- Navigation uses spacing and a single active rule, not capsules around every
  destination.
- Filters and tags may use pills because their shape communicates a removable
  or toggleable value.
- Tables and evidence views favour rules, alignment and whitespace over cards.
- Focus rings are 2 px pine with at least 2 px offset.

## 9. Imagery and maps

Photography is documentary and specific: real production, real people, real
products and real places in available light. Colour remains natural and
restrained. Do not add interface texture to make weak photography feel
“crafted”.

Avoid generic produce baskets, staged rustic props and imagery that implies an
unsupported producer fact.

Maps use washi land, white controls, hairline geometry and stone labels.
Producer points use sumi; the active producer alone uses pine with a white
ring. Location, verification and ownership must remain visually distinct.

## 10. Motion

- Immediate feedback: 120–160 ms.
- Component transition: 180–220 ms.
- Large map/page transition: 280–360 ms.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Movement is limited to opacity and 4–8 px position changes.
- Honour `prefers-reduced-motion`; never animate continuously for decoration.

## 11. Voice

The written tone is calm, concrete and source-aware.

- Lead with the place, producer or action.
- Prefer short sentences and exact nouns.
- State uncertainty plainly.
- Prefer “Find producers in Girona” to “Unlock a local journey”.
- Prefer “Source pending review” to decorative trust language.
- Never call a producer “artisan” unless the catalog evidence supports it.
- Keep **Connecting local food.** exact, including its final period.

## 12. Accessibility and trust

- Meet WCAG AA contrast for text and meaningful controls.
- Minimum pointer target: 44 by 44 px.
- Never place essential text inside an image.
- Preserve visible labels and logical heading order.
- Components expand for translation rather than truncating meaning.
- Visual prominence must never imply stronger verification or evidence.

## 13. Migration order

1. Approve the lower-case wordmark, functional mark and reduced palette.
2. Produce outlined wordmark and favicon exports.
3. Replace Fraunces and Roboto with the approved Noto Sans configuration.
4. Map existing CSS variables to the v0.2 semantic tokens.
5. Apply the system to the shared shell and one area page as a vertical slice.
6. Verify mobile, Japanese, long translations, maps, focus and contrast.
7. Extend through producer, account and administrative surfaces.

The visual overview is
[`docs/brand/chisan-design-board.svg`](brand/chisan-design-board.svg).
