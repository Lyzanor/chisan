# Chisan design language

Status: active foundation, v0.3 — The Passage.

Chisan is the quiet shared layer that helps people see local production as it
really exists: many independent producers, exact places and trustworthy facts,
connected without being flattened into sameness.

The visual philosophy is **quiet precision**. Japanese influence appears in
reduction, proportion, negative space, irregular balance and material honesty.
It never appears as borrowed ornament or literal cultural symbolism.

The brand promise remains exactly **Connecting local food.**

## 1. Design principles

### Reality stays visible

The producer, place and evidence lead. Interface styling must never obscure the
number of producers, move a coordinate, inflate a trust signal or make a
category look more important than the catalog supports.

### Connection does not erase difference

Chisan creates a shared passage between independent places. The system should
align and relate information without making every producer, region or culture
look identical.

### Space is structure

Whitespace defines hierarchy, pace and relationships. Do not replace it with
cards, shadows, labels or decorative dividers. A boundary exists only when it
clarifies behaviour or ownership.

### One signal at a time

A view has one dominant heading, one primary action and one active colour.
Quiet elements remain quiet. Selection, verification and location must have
different, explicit meanings.

### Exact before expressive

Coordinates, counts, names and evidence are product content, not material for
visual approximation. Expression belongs in proportion, typography,
photography and rhythm—not in altered facts.

### Global by construction

Layouts expand for translation, typography respects the writing system, and no
locale is treated as a decorative variant of another.

## 2. Logo: The Passage

The primary logo is the custom lower-case wordmark **chisan**. It is the whole
identity in normal contexts; it is not paired with a decorative symbol.

Its construction is intentionally quiet:

- the open `c` begins the name with an invitation rather than a seal;
- broad, low-contrast forms feel approachable without becoming soft or playful;
- compact joins and open counters create a rhythm of meeting and continuation;
- lower case keeps the brand present but non-institutional.

The compact `c` glyph is a crop of the same identity, reserved for favicons,
app avatars and places where the wordmark cannot remain legible. It is not a
second logo and does not appear beside the wordmark merely as decoration.

### Logo rules

- Use the wordmark whenever at least 88 px of horizontal space is available.
- Use the compact glyph below that threshold or for square system icons.
- Primary colour is `ink`; reverse is rice paper or white.
- Minimum sizes are 88 px wide for the wordmark and 16 px for the glyph.
- Clear space is one compact-glyph stroke width on every side.
- Keep the tagline separate and live; never bake it into the logo asset.
- Do not redraw the logo with a font or recreate it with CSS or inline SVG.
- Do not add containers, outlines, shadows, gradients or multiple colours.

Avoid literal food, leaf, map-pin, seal, torii, ensō, calligraphic, rising-sun,
network-node and generic technology motifs. The Japanese influence belongs to
the system, not the iconography.

## 3. Colour

The interface is neutral by default. Moss is functional and should occupy less
visual area than the content it supports.

| Token | Value | Role |
|---|---:|---|
| `rice-paper` | `#F5F1E8` | Page field |
| `surface` | `#FFFDF8` | Controls and necessary raised surfaces |
| `ink` | `#1D201B` | Text, wordmark and producer points |
| `stone` | `#686C66` | Secondary text and map labels |
| `hairline` | `#D7D3C9` | Rules, borders and map geometry |
| `moss` | `#52614C` | Primary action, focus and active selection |
| `moss-pale` | `#E5E8E1` | Quiet selected state |

Large saturated areas, tinted shadows, gradients and colour-coded card
collections are outside the system. Semantic status colours remain product
tokens and must not be repurposed as brand decoration.

## 4. Typography

The product voice uses **Noto Sans** with appropriate system or Noto fallbacks
for each script. The custom wordmark is an image asset, not a font setting.

- Display: 500, 48–88 px, line-height `0.98–1.05`.
- Section heading: 500–600, 28–40 px, line-height `1.1–1.2`.
- Body: 400, 16–18 px, line-height `1.55–1.7`, maximum 64 characters.
- Interface: 500–600, 14–16 px, line-height `1.35–1.5`.
- Metadata: 500–600, 12–13 px, line-height `1.4`, `0.04em` tracking.

Use size, position and space before weight. Do not use a display serif, ultra
light body copy, all-caps paragraphs or novelty type as a shortcut to identity.

## 5. Layout, shape and line

- Base spacing unit: 4 px; scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.
- Shell: up to 1440 px with 20–40 px responsive gutters.
- Reading column: 58–64 characters.
- Discovery composition: asymmetric 5/7 or 4/8; data tools use strict grids.
- Structural radius: 0; control radius: 4; compact object radius: 8.
- Pill shapes are reserved for removable or toggleable filters and tags.
- Border: 1 px `hairline`; selected border: 1 px `moss`.
- Default shadow: none; overlays alone may use a restrained shadow.

A card exists only when its content behaves as one independent, selectable or
reusable object. Avoid floating stacks, oversized headings, decorative badges,
gratuitous rounded rectangles and repeated capsules.

## 6. Maps and density

The map is a factual field, not a summary graphic.

- Every mapped producer is represented by one point at its exact coordinate.
- Do not cluster, aggregate, jitter, offset or replace producers with heatmaps.
- At overview scale, points are 4–5 px ink dots with a larger invisible hit area.
- Only the selected producer gains a moss ring; selection never changes position.
- Land is rice paper, controls are surface, geometry is hairline and labels are stone.
- Filters use one selector or a restrained list; do not cover the map with pills.
- Counts remain visible as text, while producer density remains visible spatially.

## 7. Imagery and motion

Photography is documentary: real production, people, products and places in
available light. Do not use generic produce baskets, staged rustic props or
images that imply unsupported facts.

Motion gives orientation, never spectacle. Use 120–160 ms for immediate
feedback, 180–220 ms for components and 280–360 ms for large map or page
changes. Prefer opacity and 4–8 px movement; honour `prefers-reduced-motion`.

## 8. Voice, accessibility and trust

Write calmly, concretely and with source awareness. Prefer exact nouns and
plain uncertainty over promotional language. Keep **Connecting local food.**
exact, including its final period.

Meet WCAG AA, keep pointer targets at least 44 by 44 px, preserve visible
labels and logical heading order, and never place essential text inside an
image. Visual prominence must never imply stronger evidence or verification.

## 9. Anti-slop review

Before approving a surface, ask:

- Are capsules being used as decoration rather than interaction?
- Are there unnecessary cards, shadows, gradients or oversized titles?
- Does any icon or flourish communicate nothing specific to Chisan?
- Has density been hidden instead of organised?
- Is an active colour being used without an active meaning?
- Could the same hierarchy be clearer with alignment and space alone?

If the answer is yes, remove before adding.
