# Chisan design

The visual system: rules, tokens, brand assets, and the web mapping.
This guide owns the visual system. Components consume its tokens while their
product contracts own data, permissions and meaning.

The active design is **v0.7 — One field**. It keeps v0.6's clean white page,
light Outfit headings, forest-green actions and documentary photography, and
turns them into one system: every value comes from a token, every repeated
element comes from one primitive, and motion is fluid but quiet. A button,
a card, an eyebrow or a section heading looks the same on every page.

```
foundations/tokens.css     every colour, type role, space, shape, shadow, curve and layer
foundations/base.css       element defaults: type, links, focus, form fields, tables
foundations/motion.css     keyframes, scroll reveals, view transitions, reduced motion
adapters/primitives.css    buttons, links, eyebrows, chips, cards, panels, badges
adapters/brand.css         wordmark, mark and Chisan's character
adapters/shell.css         header, header and bottom navigation, page containers, footer
adapters/map.css           the shared map: Leaflet chrome, markers, locator, selection card
adapters/map-explorer.css  immersive discovery, header search, card strip and results sheet
adapters/discovery.css     home hero and location card, province choice, selections
adapters/producer-profile.css  the edge-to-edge producer profile
adapters/profile-qr.css    printable QR invitation, dialog and sticker
adapters/accounts.css      sign-in, account workspace, forms, reviews and producer tools
adapters/category-themes.css   soft ingredient photography in category margins
adapters/native-colors.json    generated native colour projection; never edit directly
brand/chisan-reference.png     supplied identity sheet (pixel source)
brand/assets/            generated metadata and icon exports
public/brand/            lossless SVG wrappers for the supplied identity
references/              selected image direction and external inspiration
prototypes/              standalone HTML explorations; not runtime assets
qa/design-qa.md          current visual verification
qa/history/              dated historical checks, not current specifications
```

## Mobile first

The phone is Chisan's primary surface and the base of a future web-based app.
The Android/iOS foundation now lives in `apps/mobile`; see
[Mobile apps](../docs/MOBILE_APPS.md). Its colors are generated from the same
foundation with `pnpm build:mobile-tokens`, and its native layout reuses the
existing font and brand assets.
Design and review public and account surfaces at 390px first. Wider screens add
columns, density and side-by-side context, never a capability the phone lacks.
Administration remains usable on a phone but may favour wide screens.

- Base styles serve the narrow layout and `min-width` queries enhance it.
  Existing `max-width` rules migrate when their surface is reworked;
  `pnpm check:design` notes new ones.
- Touch is the primary input. Every action works by touch alone; hover and
  pointer-dwell previews only add to it, with hover styles under `(hover: hover)`.
- Primary content normally scrolls with the page. Forms and articles retain
  that flow. The immersive discovery map uses the viewport, with a native
  horizontal card strip and an explicitly opened, independently scrolling
  results sheet. Menus and dialogs may also scroll within their own bounds.
- The viewport covers the display (`viewport-fit=cover`), so sticky and fixed
  edges add the matching `env(safe-area-inset-*)`.
- Every screen can be left through its own navigation (header, breadcrumbs or
  back links) without browser controls. Public routes remain the deep links
  described in [Catalog web](../docs/CATALOG_WEB.md).

## Ownership and working defaults

`app/globals.css` is the one ordered entry point, imported by
`app/_components/site-root-shell.tsx`:

```
tokens → base → motion → primitives → brand → shell → map → map-explorer
       → discovery → producer-profile → profile-qr → accounts → category-themes
```

Administration adds `app/styles/admin.css` from its own layout. Component CSS
modules load with their components and consume the same tokens.

- `tokens.css` is the only place raw values live: brand and state colours,
  type roles, spacing, radii, shadows, durations, curves and layers. Brand
  colours stay literal hex so `pnpm build:mobile-tokens` can project them.
  Semantic product states (danger, warning, info, success) are tokens too;
  their meaning stays with their product contract.
- Earlier names (`--accent`, `--line`, `--radius`, `--muted`, …) remain as
  aliases so older rules and parallel work keep resolving. New rules use the
  `--chisan-*` names.
- Each component's styles live in exactly one place. A surface file never
  resets another file's rule; if a selector needs different values, change
  its owner. `!important` is reserved for `.visually-hidden` and the
  reduced-motion switch.
- CSS modules rename their keyframes and classes. A module refers to shared
  primitives with `:global(.chisan-…)` and never names a global keyframe; page
  entries use the `.chisan-enter` utilities in markup instead.

## Checking

```bash
pnpm check:design
```

The checker reports style drift and catches mechanical regressions: raw values
outside the tokens, undefined `--chisan-*` properties, authored weights other
than the tokens, and undersized interactive targets. Style findings are review
prompts. Use `--list <rule>` to inspect locations; judge contrast, focus and
responsive behavior in the browser. A count alone cannot prove accessibility.

Preserve readable contrast, keyboard operation, clear focus, honest maps and
reduced-motion support. The palette, type roles, shapes and map density are
current product decisions. A justified change may revise them with visual QA.

## Colour

| Token            |     Value | Role                                           |
| ---------------- | --------: | ---------------------------------------------- |
| `rice-paper`     | `#FFFFFF` | Pure white page field                           |
| `surface`        | `#FFFFFF` | Controls, raised surfaces                      |
| `surface-muted`  | `#F6F7F6` | Quiet neutral fills: placeholders, fields, facts |
| `ink`            | `#18221C` | Text, dark surfaces                            |
| `stone`          | `#59645D` | Secondary text, map labels                     |
| `hairline`       | `#DFE5E1` | Decorative rules and card edges                |
| `field-line`     | `#848E87` | Form control boundaries (3:1 on white)         |
| `moss`           | `#00563F` | Forest green action, focus, selection          |
| `moss-dark`      | `#003D2D` | Dark green text, hover and inverse panels      |
| `moss-pale`      | `#EDF3EF` | Tint panels, selected and hover fills          |
| `moss-line`      | `#B3CCC5` | Secondary button and chip outlines, link rules |

State colours pair a text, a line and a pale fill: `danger` `#9D2B22`,
`warning` `#6B4A0C`, `info` `#174B70`, and `success-line` `#87B397` beside
moss. Derived layers are `scrim` (modal backdrop), `glass` (translucent
navigation) and the `inverse-*` whites used on dark panels.

White, soft greys and forest green remain the shared interface palette. The
page stays white. Tinted surfaces use `moss-pale` only; `surface-muted` fills
small things (fields, placeholders, fact tiles) and never a whole section, so
two nearly equal greens never sit side by side.

Category decoration uses generic high-key ingredient photographs with white
margins, soft edges and the shared ambient-opacity token. Place them in the
outer body margins below the header, never as a hero banner or behind
meaningful text, controls or geography. The first reviewed assets cover
`Lácteos y quesos` and `Vino`; other categories stay white until they have a
reviewed matching asset. Do not assign cheese to ice cream or grapes to every
spirit merely because their former colour tokens shared a family.

The category filter sets the catalog image; a producer's primary category sets
the profile image. Hover does not change the background. Decoration is contained
by `.site-content`, so it cannot paint over the footer. The map keeps more of
its natural colour; its labels and geometry remain authoritative. Photographs,
markers and controls are not desaturated. Category imagery never conveys
verification, ownership, price, entitlement or a particular producer's products.

Use `field-line` or darker for meaningful control boundaries; `hairline` is
decorative only. Text uses `ink`, `stone` or `moss-dark` on light surfaces and
`surface` on green or dark surfaces. Check actual foreground/background pairs.

Keep decorative photography separate from reading surfaces. Do not add
tinted control shadows or colour-coded card sets. The wordmark and QR C use
solid forest green with the supplied silhouette; the app icon reverses that
silhouette white on a forest square.

## Type

Primary family: **Outfit**, self-hosted as a variable font. **Noto Sans** remains
the fallback before the existing script-specific system fonts. Prefer sans-serif
fallbacks; choose a script-appropriate fallback when it better preserves legibility.

Sizes are roles, not numbers. Fluid roles grow between a 360px and a 1280px
viewport; nothing is smaller than 12px.

| Role token         | Size     | Weight | Leading | Use                                        |
| ------------------ | -------- | ------ | ------- | ------------------------------------------ |
| `font-display`     | 40–80px  | 350    | 1.02    | Landing and library heroes                 |
| `font-title`       | 30–52px  | 350    | 1.06    | Page titles; landing section headings (400) |
| `font-heading`     | 24–36px  | 400    | 1.15    | Section headings on content pages          |
| `font-subheading`  | 20–24px  | 400    | 1.3     | Card and list titles, h3                   |
| `font-lead`        | 18–20px  | 400    | 1.5–1.7 | Introductions and long-form reading        |
| `font-body`        | 16px     | 400    | 1.5     | Body text                                  |
| `font-ui`          | 15px     | 500    | 1.35    | Buttons, navigation, list titles           |
| `font-small`       | 14px     | 400/500| 1.35–1.5| Secondary text, chips, descriptions        |
| `font-caption`     | 13px     | 400    | 1.5     | Metadata, captions, helper text            |
| `font-micro`       | 12px     | 500    | 1.35    | Eyebrows (uppercase, 0.08em), badges, legal |
| `font-stat`        | 48–96px  | 350    | 1       | A single headline figure                   |

Weights are three tokens: display 350, heading 400 and interface 500. 700
belongs to `<strong>` and `<b>`, where the browser applies it. Tracking tightens
with size (`tracking-display`, `-title`, `-heading`) and opens only for
uppercase eyebrows (`tracking-caps`). Reading measure is `measure` (64ch).

## Space, shape, line

- Base 4px. Space tokens `1 2 3 4 5 6 8 10 12 16 20 24 32` (4–128px). Roles:
  `gutter` (16–40px), `section-gap` (48–96px) and `panel-padding` (20–48px).
- Containers: `container` 1280px for the shell and landing pages,
  `container-wide` 1440px for discovery and administration,
  `container-content` 960px for forms and Descubrir, `container-reading` 720px.
  The header and footer span the viewport and inset their content to the same
  left edge as the page (`--site-inset`); full-bleed pages set
  `--site-header-inset` to the plain gutter.
- Radius: `0` structural, `xs` 4px badges and highlights, `control` 8px,
  `object` 12px cards, `panel` 16–20px large surfaces, `pill` for toggles and
  filters only — things you can toggle or remove. Never navigation, buttons,
  badges or links.
- Border 1px `hairline`; selected 1px `moss`. Focus is a 2px `moss` `outline`
  with 3px offset, on every interactive element.
- A card exists only when its content is one selectable, reusable object.
- Panels come in three treatments only: outline (white with a hairline), tint
  (`moss-pale`) and inverse (`moss-dark`). A page alternates plain sections
  with a few panels; twin calls to action use the same treatment.

## Elevation

The page is flat. Only what floats gets a shadow: `shadow-control` for map
controls and floating buttons, `shadow-raised` for a hovered card lifting 2px,
`shadow-overlay` for menus, tooltips, sheets and the selected map card, and
`shadow-modal` for dialogs. Navigation uses the translucent `glass` fill with
blur; an opaque white remains when backdrop filtering is unavailable.

## Primitives

Compose these classes; a component keeps only its own layout.

- `.chisan-button` — secondary by default (white, `moss-line` outline).
  Modifiers: `--primary` (forest fill), `--quiet`, `--inverse` (on dark
  panels), `--danger`, `--lg` (52px), `--block`, `--icon` (44px square).
  One primary action per group. `.account-button` is a deprecated alias.
- `.chisan-link` — an underlined inline action; `--inverse` on dark panels.
- `.chisan-arrow` on a trailing ↗ icon: it leans toward its destination on
  hover. Links that leave for another page use the up-right arrow.
- `.chisan-eyebrow` — the small uppercase moss line above a heading.
  `.catalog-kicker` is a deprecated alias.
- `.catalog-chip` — toggles and filters, the only pill; `.is-active` fills it
  dark green.
- `.chisan-card` with `.chisan-card__media` — one selectable object; lifts on
  hover and its image eases in.
- `.chisan-panel` with `--outline`, `--tint` or `--inverse`.
- `.chisan-badge` with `--neutral`, `--warning`, `--danger` or `--info`.
- `.chisan-disclosure` — a details element whose content opens with its height.
- `.chisan-skeleton`, `.chisan-spin` — loading states.

## Map

One point per producer, at its exact coordinate. Keep source coordinates
unchanged; dense discovery may group their presentation only while navigation,
counts and access to each producer remain clear. Never change coordinates just
to improve appearance.

- Country discovery groups by province below zoom 8 when more than
  200 mapped results span several provinces. Each province shows its count in a
  32px `moss-dark` label with `surface` figures and a 44px target, placed on its
  producer point nearest the province median. Counts that would touch combine at
  the larger count, and their tooltip and accessible name list every province.
  Activating one zooms towards its producers: a single province opens at zoom 8
  or closer, a combined count separates its provinces first. A previewed producer keeps its
  exact point above the counts. Province pages, selections and guides never group.
- A country view with more than 200 mapped results opens on its main connected
  cluster (results within about 300 km) with a 24px margin. Farther clusters
  holding under a tenth of the results, such as the Canary Islands, stay on the
  map one pan away; results that mainly lie there open there instead.
- Area overviews use exact-coordinate 6px `moss-dark` points below zoom 11;
  from zoom 11, each producer uses its existing colourful category pictogram
  in a 24px `surface` disc. The active or previewed producer grows above its
  neighbours, keeps a `moss` edge and retains the same 44px interaction target.
- Land `rice-paper`, controls `surface`, geometry `hairline`, labels `stone`.
- Roomy containers show every available category in one scrollable icon row
  without a disclosure button. Narrow ones keep the primary row and a disclosure
  for additional categories. Labels unfold on selection, hover or keyboard focus.
- The collapsed results sheet shows only its centered drag grip within a 44px
  interaction target. Its accessible label retains the count. Opening the sheet exposes
  the scope and full paginated roster without adding a heading above the map.
- The discovery list uses one continuous mapped roster, with producers near the
  current opening view first and no map-only scope. Once list navigation begins,
  that order stays fixed so map focus cannot move a row beneath the pointer or
  keyboard focus.
- Marker activation highlights and reveals the matching producer row. When the
  selected producer falls outside the bounded base roster, append that one row
  without reordering the existing results, then scroll it into view.
- Search and the province/country scope share one field in the site header,
  between the brand mark and the header navigation. Location remains an explicit
  floating map action; there is no separate nearby option in the scope selector.
  At 760px and below the header navigation gives way to a fixed bottom bar; the
  results-sheet handle, card strip and map controls stay above it.
- Searching filters the approved public base fields without introducing another
  catalog source. Text, category, scope and explicit selection retain their
  existing shareable URL state.
- Hovering or focusing a list row previews the exact producer on the map and
  linked producer surface. A restrained `moss-pale` row treatment preserves
  the connection. In area discovery, clicking or pressing Enter opens the
  producer profile; pointer dwell (120 ms) or keyboard focus centers its map
  preview without changing the URL. Marker activation remains the durable
  URL selection. The large selected surface is the only map preview: synchronized
  maps do not also show a producer tooltip.
- On small area-discovery screens, the map fills the available width and height.
  The bottom card strip and markers share one selection. Native sideways swipe
  selects the adjacent result and focuses its exact coordinate; marker activation
  reveals its card. The order locks when navigation begins. The carousel mounts
  at most seven neighbouring cards while retaining every result as a destination.
  Its first card highlights a point without forcing a zoom or changing the URL.
  A 44px bottom handle opens the full roster by upward drag, tap or keyboard;
  downward drag, tap or Escape closes it. The collapsed panel identifies the
  result count and geographic scope without previewing an arbitrary producer;
  roster rows are hidden and not keyboard reachable until the sheet opens.
  Roomy maps show the roster alongside the map. Safe-area padding and dynamic viewport
  height keep controls inside the display. Public selections and editorial guide
  maps reuse this same carousel, roster and non-modal sheet inside their page.
- Responsive composition follows container size, including embedded maps and
  folded/unfolded windows. Header gutters and sidebar width vary within bounded
  ranges; cards stay centered and readable. The account label and full category
  row appear independently when each has room. Short maps use smaller cards and
  a handle-only collapsed sheet; short, sufficiently wide maps use a sidebar.
  Controls and attribution move above cards when the remaining map column is
  narrow. Resizing preserves selection and reveals its row without page jumps.
- Public selections and their private previews show exactly the chosen producers.
  Fit the whole mapped set on opening and preserve one stable roster, including
  unmapped profile links. Geography never groups or ranks a selection. Keep the
  map above the optional QR invitation; title and description provide context.
- A selected producer and its immediate carousel neighbours may load reviewed
  catalog imagery lazily. Roster rows also show a lazy producer photograph and
  a separate 44px follow action. No producer imagery is preloaded by map points.

### Map component contract

There is one producer-map stack. Pages configure it; they never redraw markers
or redefine selection styles.

```
components/map/producers-map.tsx                 public map boundary
components/map/producers-map-inner.tsx           private Leaflet renderer
components/map/producer-map-selection-card.tsx   linked selected surface
components/map/producer-map-carousel.tsx         bounded native card strip
components/map/producer-collection-map.tsx       shared embedded selections
components/map/producer-map-roster-row.tsx       photo, profile link and follow
components/catalog-search-control.tsx           integrated animated scope menu
components/catalog-results-sheet.tsx            touch/keyboard roster disclosure
components/map/use-dismissible-producer-map-selection.ts  outside/Escape dismissal
components/area-explorer.tsx                     area filters and URL state
components/producer-selection-explorer.tsx       explicit selection and URL state
components/guides/guide-map.tsx                  progressive editorial selections
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

On a multi-producer map, marker activation selects and focuses its exact point,
paints it above its neighbours and exposes the shared linked
name-description-image surface. In area discovery, pointer hover and keyboard
focus preview that same surface without writing `highlight`, and list links
open the profile directly. Explicit account selection maps retain their
selection controller and exact chosen membership.
The `highlight` query records selection; Escape, outside activation and browser
Back/Forward clear or restore it. Initial and nearby framing never imply
selection. Embedded guide maps keep this state local to each widget and use the
same linked card, point focus and dismissal controller. Items without coordinates
remain ordinary profile links rather than pretending to select a missing point.

A producer-detail map renders its sole producer in fixed selected state and
keeps that contextual point non-interactive. It does not repeat the selected
card or open a self-referential popup because the page itself is that surface.
Every interactive category pictogram uses the full 44px target, including at
overview zooms. Fixed detail points are non-essential map context.

## Physical presence and producer origins

`ProducerSelectionExplorer` presents one reviewed image (event plan or shelf),
one geographic origin map and one shared producer card. At phone width the two
panels stack in a viewport-bounded workspace; at 48rem container width they sit
side by side. Expanding either panel keeps the other mounted as a compact
reference, retaining map state and image pan. Grid transitions respect reduced
motion. Image scaling preserves its aspect ratio, including portrait shelves.

Physical positions use 44px targets. Overlapping targets open a position chooser
rather than sending the visitor to an arbitrary producer. A collective position
then lists its producers. Selecting a producer on the map highlights all its
image appearances; an optional occurrence selector picks an exact product or
position. One searchable results sheet supports names, products and stand
numbers. Keyboard opening focuses search, Escape returns to its handle, and
covered panels become inert while the sheet is open.

Event pages bring the viewer immediately after compact identity, date, venue and
navigation actions. A bottom disclosure retains coordinates, descriptions and
source credits. Producer totals come from the resolved unique identities, not
from image marker or category counts. Event and shelf storage, permissions and
publication remain governed by their own contracts.

## Producer profile

Country, area and municipality share a compact context row below the producer
name. Category pictograms replace visible category labels in that row and in
related-producer cards. Profile pictograms link to their catalog filters and
retain the localized category as their accessible name and tooltip.
Location labels link to their catalog filters.
The municipality filter matches the full municipality and
has a visible removal control, preserving category and search intersections.

The follow action uses the shared catalog chip style in a small menu beside the producer name;
compact roster rows use the same person icon with an accessible name. A followed
producer shows person-check. This represents a relationship with a producer and
their updates, consistently with Chisan's participation model. Compact map rows
still work in one tap.
Guests always see the action and open registration with their current route as
the return destination. Signed-in users see one session-backed follow state
across maps and profiles; pending and unavailable states never pretend to be
saved or empty. Premium visibility remains independent of ownership.

The header shows the reviewed `imagen` identity beside the name at phone and
wide widths; it never promotes a gallery photograph to a cover. Logos are
composed on the page white, so a free-standing identity tile or thumbnail
carries a hairline edge; media that fills a bordered card relies on the card's
edge. The breadcrumb
contains country, area and municipality without repeating the producer name,
followed by the category. A missing identity or gallery leaves no placeholder.
Captions and credits wait behind a small info disclosure on each photograph.
The description uses the full reading width; contact, website and social links
wrap as one fluid row.

Verified ownership receives an explicit badge beside the name and an explanation
in the trust strip immediately below the hero. Unclaimed profiles have no
verification badge. Editorial `pendiente` places an accessible exclamation icon beside the name;
the explanation stays in the trust strip.
The trust strip shows the last approved change when present and the public source
URLs and consultation dates for any profile with a keep record. Never expose
claim status, claimant identity or private review notes.

The official website appears prominently with its address, while Instagram,
Facebook and Google Maps appear as labeled external links showing only the
service name.
Contact and call actions both lead to the email/telephone widget, which sits
below opening hours beside the location; telephone-only profiles remain usable.
The composer prepares email in the visitor's own application and explains that
before continuing.

Featured product tags and approved product cards share one section. Its small
plus action opens the existing editor for an eligible member, or the shared Pro
onboarding with the producer context. The information section uses the same
quiet plus control for completing reviewed facts. A dedicated
"shop" action opens the reviewed store page (online shop, else marketplace,
else subscription); without one, an online shop action falls back to the
official website. Channels are listed only when there is more than one, avoiding
a duplicate label beside the only shop link. With multiple channels, a `no` or
`no comprobado` online-sales value remains a quiet status. The public API also
exposes the reviewed store URL for agents. Location shares a row with reviewed opening hours
and the contact widget. Preserve the
source's days and ranges without inferring open/closed state. Directions is the
green primary visit action; the transient distance tool uses a white secondary
button. Directions uses Google Maps' universal directions URL with a reviewed
coordinate or address as destination and no origin: Google Maps uses device
location when available, otherwise asks for a starting point. Chisan neither
requests nor stores the visitor's position for this link. See the [Google Maps URL contract](https://developers.google.com/maps/documentation/urls/get-started#directions-action).

The profile fills the viewport with no outer side margins. Every block after
the hero is a section with the page gutter, a hairline divider and one shared
vertical rhythm (`--profile-section-space`), including sections that components
add later. The name row aligns with the page gutter. All approved standalone
photos form a strip before “How we produce”: one row at honest aspect ratios
that scrolls sideways when the screen is narrow or the gallery is long. Long
production-method prose uses a minimal native read-more disclosure.
Pointer hover scales a photo to 1.03 within its frame; the photos open nothing,
and reduced motion removes the emphasis.
Pro product cards align their commerce footers despite different description
lengths. On phones, equal-width cards swipe sideways with a visible hint of the
next card and keyboard scrolling. Approved links use the shared thumbnail card,
with their associated product image or the reviewed producer identity, without
fetching remote website previews. They render as visual destination
cards; no remote preview
image is inferred. The producer QR is not part of the public profile; its owner
downloads the sticker from the account. Short visit and order facts form one group;
certifications keep their exact scope and link back to recorded public sources.
B2B has a separate section and leads eligible buyers toward their professional
account. The current single CSV news notice renders as a dated feed item, with
an owner-only prompt to submit another reviewed notice; it is not an archive.
Beside the gallery, a compact invitation offers free profile completion to an
unclaimed producer and preserves its identity through sign-in. A pending claimant
sees their request link; active members go directly to the gallery editor. Other
visitors to a verified producer see no invitation. This replaces the hero claim
invitation. Public profiles never show empty photo frames or an incompleteness badge.
The free gallery editor shows its current photo count against the five-photo
allowance, with published photos and new proposal photos counted separately.
Up to three camera frames suggest subjects for the next photo; they are optional
ideas, not claims about missing subject matter. Frames use the existing upload
and rights confirmation controls and disappear when the allowance is filled.
Progress is derived from editor state; it creates no stored score or telemetry.
Followers have a dedicated section, showing only opted-in public attribution and
explicitly labeling that count. Community suggestions sit beside the Details
heading, next to the editorial notice they correct. The closing section after
related discovery only addresses the producer: a claim invitation for an
unverified profile, or its members' editing links. Visitors to a verified
profile see no closing section. Claimed producers keep their existing editor
workflow.

Related discovery shows up to three nearby producers that share a canonical
category. Each recommendation is one compact linked card with the reviewed image
beside the producer name, municipality, shared-category pictogram and straight-line
distance. Cards fill as many columns as fit and collapse to one on narrow
screens. Missing coordinates or nearby matches omit unsupported cards; the
layout never invents proximity to fill a row.

## Brand

The standard logo is **Chisan**, exactly as supplied in
`brand/chisan-reference.png`. Its initial C carries one detached square in the
upper-right opening; the lower-right arm belongs to the C itself. The sheet supplies
the wordmark alone, so the app icon reverses that same C on a forest square rather
than extracting separate artwork. The same initial C is extracted for producer and
selection QR centres. Current exports and their roles are listed in
[brand/README.md](brand/README.md).

- Use the wordmark above 112px of width and the C for square affordances.
- Preserve the supplied proportions and the detached square; do not redraw or typeset it.
- Keep the tagline as separate live text and the reversed logo as the same silhouette.
- No extra containers, motifs or app icon appended to the wordmark.
- `public/brand/chisan-wordmark.svg`, `chisan-wordmark-ink.svg`, `chisan-mark.svg`
  and `chisan-mark-ink.svg` preserve the existing public URLs as lossless embedded-PNG
  wrappers. These are raster-derived assets, not newly traced vector masters. The
  supplied pixels remain the authority.

Profile QR labels are wall and entrance stickers (100 × 127.9 mm): a white
rounded card with a thin outer rule, the wordmark, a hairline divider, the code
and a solid bottom band carrying one uppercase line, "Productor local" or
"Nuestros productores" in the locale. Forest green marks producer stickers and
neutral ink marks selection stickers, a 100% monochrome distinction across the
rule, wordmark, code, centre C and band. The code keeps square data modules
while its three finder patterns are drawn as the Chisan C: a one-module ring
opened at the upper right with the detached square in the opening. It uses H
error correction and the approved C in a small excavated centre; the white card
around it is the quiet zone. `ProfileQrSticker` draws the on-screen SVG and
`drawProfileQrSticker` paints the same `PROFILE_QR_STICKER` layout into a
2150 × 2750 px PNG with transparent corners. Independently decode representative
short and long profile/selection URLs and actual downloaded labels before
release. Neither colour implies verification, ownership or a reviewed
restaurant/shop classification.

Sizing and alt text live in `components/brand/chisan-brand.tsx`. Give an image
empty alt text when its link already has an accessible name.

## Motion, voice, access

Motion orients: it confirms an action, connects two states or brings content
into view. Durations are tokens — `motion-instant` 100ms (press),
`motion-immediate` 160ms (colour and state), `motion-component` 260ms (menus,
disclosures, cards), `motion-page` 480ms (page arrival, sheets) and
`motion-reveal` 720ms (content entering view). Curves are `ease` (a quint
ease-out for most movement), `ease-in-out` for loops, and `ease-spring` /
`ease-pop`, gentle `linear()` springs for sheets, menus, markers, icons and
indicators, with cubic fallbacks.

- Press: buttons, chips and controls scale to 0.95–0.97 while pressed.
- Hover: cards lift 2px onto `shadow-raised` and their image eases to 1.04;
  trailing arrows lean toward their destination.
- Arrival: page content rises once (`PageMotion`); hero headings, statements
  and cards use the `.chisan-enter` steps in markup.
- Reveal: `data-reveal` sections and `data-reveal-stagger` children rise into
  place once on intersection, including streamed sections. Server-rendered
  content stays visible until enhancement; reduced motion and browsers without
  IntersectionObserver keep it visible. Already visible items do not wait for
  scrolling. The footer's landscape gently moves beneath overlapping links,
  with the mascot at one corner.
- The header's rule appears once the page scrolls beneath it; the active
  header link grows an underline and the active bottom-bar tab a soft green
  indicator.
- Full document navigations between root layouts crossfade through
  `@view-transition`, with the header and bottom bar held in place.

Honour `prefers-reduced-motion`, including changes made while the page is
open: one switch in `motion.css` removes every animation and transition, and
scroll reveals and view transitions only run under `no-preference`. Never
animate thousands of result rows or delay navigation.

Header navigation uses direct links rather than a menu. Its first link opens
Actividad; on Actividad it becomes Mapa, so it always leads elsewhere. The
account link shows the signed-in display name, otherwise Mi cuenta, and opens
the account, or sign-in for guests. A language select follows only on pages
available in more than one language. At 760px and below the header navigation
is hidden and a fixed 56px bottom bar offers Actividad, Mapa and account tabs.
Both Mapa links return to the last catalog page visited in this browser tab
(guides excluded), then the saved area, then Madrid. The account link and
bottom-bar tabs mark the current section; the account tabs mark the current
page.

Page arrival does not remount its children or intercept browser navigation.
`NavigationLink` retains Next.js Link semantics, prefetching and modified clicks;
its pending indicator follows the actual router state. Map cards, the result roster
and category filter links keep prefetch disabled. Province links open
directly in the compact country overview, with no duplicate selector. Producer
search in the site header keeps a compact footprint and filters the existing
map/list inline. A small filter button showing the current scope opens one
animated in-place menu: the whole country first, then the province switch. The
switch is a bounded, searchable list grouped by region, with a visible current
selection and a recoverable empty state. Matching ignores accents and includes
region names. Choosing another province navigates to it; choosing the whole
country or the current province changes the search scope. Hovering an option
never navigates. Escape closes the open menu and returns focus to its button;
outside pointer or focus movement also closes it. A closed menu never captures
Escape from another control. Standard Tab/Enter/Escape operation remains
accessible. There are no custom global keyboard shortcuts or command palette.
There is no native scope select. Location stays in the explicit map control.
Loading and failure messages distinguish unavailable national data from an empty search.
The category strip keeps equal visible breathing room above and below its
44px controls. Compact pictograms reveal their 12px names on selection, keyboard
focus or pointer hover; touch never depends on hover to identify the active filter. Full base
text is indexed independently of short, match-centred list previews. Text
results retain shared relevance order even when the map moves. Country results
show each producer's municipality and province and retain its own profile URL.

The white footer groups readable forest-green links in three columns on wide
screens. On phones the groups are short native disclosures that open with their
height. The illustrated panorama closes the page in its own band below the legal
line, so it never sits behind text. Chisan's square character replaces the former
delivery bicycle in that scene. Decoration never captures pointer or keyboard input.

The selection QR invitation uses the supplied C, which crossfades upward into
the QR icon on hover/focus. Activation opens a native modal dialog with a brief
fade and rise. It keeps focus inside, supports Escape and outside dismissal,
restores trigger focus and locks background scroll. The producer sticker renders
in place in the owner's account beside its download and copy actions.
Area filters and producer selection update the URL through Next.js-integrated
browser history, using the already loaded area model. Back, Forward and shared
URLs retain the same meaning without fetching the area on every interaction.
The search index is derived once per model and language from the same public
fields; typing does not repeatedly normalize every producer's prose. Deferred
result updates keep the input responsive, memoized rows avoid rerendering the
whole roster on hover, and cancelled pointer previews do not queue map movement.
The active row has a fine green rule and soft fill. Its photo card sits in the
shared bottom carousel with a clear gap above the roster. Hover/focus previews
on the wide area roster do not alter URLs or order. Marker activation and swipe
retain the existing explicit selection; card and row links open the profile.
Opening header menus does not dismiss the selected producer. Every multi-producer
map uses these shared components; single-producer location maps retain their
static contextual marker.

Producer photography is documentary — real production, people and places in
available light. It remains sharp and truthful. Generic category decoration is
a separate brand layer: high-key food still lifes, genuine-looking texture,
natural colour, pure-white margins and very low display opacity. Generated
category assets must never become a real producer's product photo or evidence.
The footer uses fine forest-green pen/engraving with sparse gold accents;
its illustrated places are generic. See [imagery.md](imagery.md)
for the reusable image direction and provenance.

Write with exact nouns and plain uncertainty. The current Spanish public tagline is **Conecta con lo que se produce cerca de ti**.
The English tagline **Connecting local food.** remains available for English surfaces. Layouts expand for translation rather than
truncate; no locale is a variant of another.

Pointer targets at least 44×44px, except for the documented dense-map point
target paired with its synchronized list control. Visible labels, logical
heading order, no essential text inside an image. Prominence never implies
stronger evidence.

## Before you ship

- [ ] Every colour, size, weight, radius, shadow, duration and curve is a token.
- [ ] Buttons, links, eyebrows, chips, cards, panels and badges compose the
      primitives rather than restating them.
- [ ] Every space value is on the 4px scale.
- [ ] Pills only on toggles and filters; panels only outline, tint or inverse.
- [ ] Targets 44×44px, apart from the documented dense-map exception; focus
      visible as an outline.
- [ ] Designed and checked at 390px first, with no horizontal overflow.
- [ ] Every action works by touch alone; hover only adds.
- [ ] Checked in one long or non-Latin locale.

Record material decisions and browser evidence in [`qa/design-qa.md`](qa/design-qa.md).
Routine edits that preserve the system need only the verification relevant to
the change. Avoid duplicating the same design rule in product contracts.

## Regenerating the brand assets

Run `node design/brand/build-favicon.cjs`. The generator extracts the wordmark
and its initial C from `design/brand/chisan-reference.png`, deriving the silhouette
from ink coverage because the sheet is flat forest ink on opaque paper. It applies
flat forest/white to those silhouettes and pads the standalone C for the QR quiet
area. The app icon composites the reversed C on a forest rounded square, keeping
the corner radius and inner inset ratios measured from the earlier supplied icon.
It writes the public SVG wrappers, metadata PNGs and `app/favicon.ico` with 16, 32,
48 and 256px frames. The Apple export is flattened on forest green for the system
mask. The generator refuses a sheet whose dimensions no longer match its measured
crop boxes. No font tracing or image-model redraw occurs.

Outfit's font and license live in `app/_fonts/`; the QR sticker's canvas typography
consumes the resolved interface font. Review the exports visually and independently decode
actual short/long producer and selection downloads whenever the mark changes.

## References

- `references/product-in-the-light.png` — user-selected image direction,
  refined to keep photography small, soft and in the page background.
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
