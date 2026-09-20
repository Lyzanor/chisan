# Chisan design

The visual system: rules, tokens, brand assets, and the web mapping.
This guide owns the visual system. Components consume its tokens while their
product contracts own data, permissions and meaning.

The active design is **v0.6 — Product in the light**. Clean white surfaces,
light Outfit headings and forest-green controls frame documentary producer
photographs. Generic ingredient photography softly decorates category margins;
a fine illustrated rural scene closes the page. Small interactions make the
shared components feel responsive without changing catalog or account meaning.

```
foundations/tokens.css   colour, type, space, shape, motion tokens
adapters/web.css         maps those tokens onto the web surface
adapters/experience.css  shared navigation, discovery, profile and account polish
adapters/category-themes.css  soft ingredient photography in category margins
adapters/map-explorer.css     viewport discovery, header search and results sheet
brand/chisan-reference.png   supplied identity sheet (pixel source)
brand/assets/            generated metadata and icon exports
public/brand/            lossless SVG wrappers for the supplied identity
references/              selected image direction and external inspiration
qa/design-qa.md          current visual verification
qa/history/              dated historical checks, not current specifications
```

## Mobile first

The phone is Chisan's primary surface and the base of a future web-based app.
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

`app/_components/site-root-shell.tsx` imports, in this order:

```
app/globals.css  →  foundations/tokens.css  →  adapters/web.css
                →  adapters/experience.css  →  adapters/category-themes.css
                →  adapters/map-explorer.css
```

`tokens.css` is the only place brand colours, spacing and radii are declared. It
also publishes the older `--accent` / `--radius` names that `globals.css` still
consumes, so `globals.css` cannot render without it. Semantic product colours,
such as errors and verification states, remain with their product contract.

`adapters/web.css` styles the wordmark, map primitives and original web mapping.
`adapters/experience.css` owns the shared presentation of navigation, menu motion,
landing pages, discovery, producer profiles and account surfaces. Most remaining
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
| `rice-paper`    | `#FFFFFF` | Pure white page field                    |
| `surface`       | `#FFFFFF` | Controls, raised surfaces               |
| `surface-muted` | `#F6F7F6` | Quiet neutral fills                     |
| `ink`           | `#18221C` | Text, dark surfaces                     |
| `stone`         | `#59645D` | Secondary text, map labels              |
| `hairline`      | `#D8DFDA` | Decorative rules and borders            |
| `moss`          | `#00563F` | Forest green action, focus, selection   |
| `moss-dark`     | `#003D2D` | Dark green text and hover               |
| `moss-pale`     | `#EDF3EF` | Quiet green selected fill                   |

White, soft grays and forest green remain the shared interface palette. The
page stays white. Category decoration uses generic high-key ingredient photographs
with white margins, soft edges and the shared ambient-opacity token. Place them
in the outer body margins below the header, never as a hero banner or behind
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

Use `stone` or darker for meaningful control boundaries; `hairline` is
decorative only. Text uses `ink`, `stone` or `moss-dark` on light surfaces and
`surface` on green or dark surfaces. Check actual foreground/background pairs.

Keep decorative photography separate from reading surfaces. Do not add
tinted control shadows or colour-coded card sets. Status colours belong to their
product contract. The wordmark and QR C use solid forest green with the supplied
silhouette; the app icon reverses that silhouette white on a forest square.

## Type

Primary family: **Outfit**, self-hosted as a variable font. **Noto Sans** remains
the fallback before the existing script-specific system fonts. Prefer sans-serif fallbacks; choose a script-appropriate fallback when it
better preserves legibility.

| Role      | Weight | Size    | Line height   |
| --------- | ------ | ------- | ------------- |
| Display   | 350    | 48–88px | 0.98–1.05     |
| Heading   | 400    | 28–40px | 1.1–1.2       |
| Body      | 400    | 16–18px | 1.55–1.7      |
| Interface | 500    | 14–16px | 1.35–1.5      |
| Metadata  | 500    | 12–13px | 1.4, `0.04em` |

`next/font/local` loads Outfit weights 100–900; Noto Sans loads 400, 500 and 700. Display, heading and interface weights are shared tokens (350, 400 and 500), using size, position and space
for hierarchy. A different weight is a design decision to evaluate in context. 700 belongs to `<strong>` and
`<b>`, where the browser applies it and the meaning is in the markup. Nothing
under 12px. Reading column 58–64 characters.

## Space, shape, line

- Base 4px. Scale `4 8 12 16 24 32 48 64 96 128`. Prefer these steps for padding, margin and gaps; optical corrections and
  responsive dimensions may use other values when justified.
- Shell up to 1440px, gutters 16–24px on small screens and 80px for wide discovery. Discovery is asymmetric 5/7 or 4/8; data
  tools use strict grids.
- Radius: `0` structural, `8px` control, `12px` compact object, `16px` large
  surface. Large map and profile surfaces use the panel token; small screens
  use the object token where space is limited.
- `999px` is for filters and tags only — things you can toggle or remove. Never
  navigation, buttons, badges or links.
- Border 1px `hairline`; selected 1px `moss`. Focus is a 2px `moss` `outline`
  with 2px offset, on every interactive element.
- Overlays alone may use the shared soft shadow. Navigation can use a lightly
  translucent rice-paper background with blur; an opaque fill remains usable
  when backdrop filtering is unavailable.
- A card exists only when its content is one selectable, reusable object.

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
- The results-sheet handle carries the result count. Opening the sheet exposes
  the scope and full paginated roster without adding a heading above the map.
- The discovery list uses one continuous mapped roster, with producers near the
  current opening view first and no map-only scope. Once list navigation begins,
  that order stays fixed so map focus cannot move a row beneath the pointer or
  keyboard focus.
- Marker activation highlights and reveals the matching producer row. When the
  selected producer falls outside the bounded base roster, append that one row
  without reordering the existing results, then scroll it into view.
- Search and the province/country scope share one field in the site header,
  between the brand mark and account menu. Location remains an explicit floating
  map action; there is no separate nearby option in the scope selector.
  The account menu uses a compact icon in narrow headers and its full sign-in
  label or personalized greeting when the header has enough room.
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
  downward drag, tap or Escape closes it. The collapsed panel previews one real
  result when height permits; the remaining rows are hidden and not keyboard
  reachable. Roomy maps show the roster alongside the map. Safe-area padding and dynamic viewport
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

## Producer profile

The breadcrumb provides catalog context. Municipality and category labels below
the name link to their corresponding area filters; no separate category-links
section is repeated. The municipality filter matches the full municipality and
has a visible removal control, preserving category and search intersections.

The follow action is a person-plus icon and label beside the producer name;
compact roster rows use the same person icon with an accessible name. A followed
producer shows person-check. This represents a relationship with a producer and
their updates, consistently with Chisan's participation model. It works in one tap.
Guests always see the action and open registration with their current route as
the return destination. Signed-in users see one session-backed follow state
across maps and profiles; pending and unavailable states never pretend to be
saved or empty. Premium uses its dedicated green header independently of ownership.

The header shows only reviewed material. A landscape gallery photograph becomes
the cover, the page's first and strongest image, and the name row cuts into its
lower-left edge so name and photograph share one level. Concave corners repeat
the cover radius, and part of the photograph always continues beside the cut.
Municipality and categories follow as one compact line below the cover edge,
truncated rather than wrapped. The `imagen` identity image sits beside the name
on wide screens and above it on narrow ones; without a cover, the same block is
ordinary page content. A missing cover, identity image or gallery leaves no
generic, category or placeholder image. Captions and credits wait behind a small
info disclosure on each photograph instead of text beneath it. The description
and the contact, website and social links share two columns on wide screens.

Verified ownership receives an explicit badge beside the name and an explanation
in Details. Unclaimed profiles have no verification badge. Editorial `pendiente`
places its review link beside the name, and Details holds the visible review
notice, contact advice and an optional disclosure of recorded public source URLs
and dates. Never expose claim status, claimant identity or private review notes.

The official website appears prominently with its address, while Instagram,
Facebook and Google Maps appear as labeled external links showing only the
service name.
Contact and call actions both lead to the email/telephone widget, which sits
below opening hours beside the location; telephone-only profiles remain usable.
The composer prepares email in the visitor's own application and explains that
before continuing.

Featured products sit with one sales-channel row. The online shop channel is
itself the purchase link when online sales and the website support it; other
channels are plain labels, and a `no` or `no comprobado` online-sales value
remains a quiet status. Details does not repeat those fields. Location shares a
row with vertical reviewed opening hours and the contact widget. Preserve the
source's days and ranges without inferring open/closed state. Directions is the
green primary visit action; the transient distance tool uses a white secondary
button. Directions uses Google Maps' universal directions URL with a reviewed
coordinate or address as destination and no origin: Google Maps uses device
location when available, otherwise asks for a starting point. Chisan neither
requests nor stores the visitor's position for this link. See the [Google Maps URL contract](https://developers.google.com/maps/documentation/urls/get-started#directions-action).

Profile sections share one compact rhythm: a hairline rule and 24px of vertical
space, with 28px section headings and 18px card headings. Expanded profiles keep
products, links and stories in named sections; their jump links appear only when
both products and links exist. The standalone photos not used as the cover form
a strip after the visit section and before Details: one row at honest aspect
ratios that scrolls sideways when the screen is narrow or the gallery is long.
Pointer hover scales a photo to 1.03 within its frame; the photos open nothing,
and reduced motion removes the emphasis.
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
beside the producer name, municipality, shared category and straight-line
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
- `public/brand/chisan-wordmark.svg` and `chisan-mark.svg` preserve the existing
  public URLs as lossless embedded-PNG wrappers. These are raster-derived assets,
  not newly traced vector masters. The supplied pixels remain the authority.

Profile QR labels use forest green for producer codes, neutral ink for selection
codes and a pure white background. Both include the approved one-square C at the
center of a small excavated area, with H error correction and a four-module
outer quiet zone. Finder patterns remain intact. The 160px mark in an 880px code
is a maximum visual footprint, not a guarantee for every payload or print size.
Independently decode representative short and long profile/selection URLs and
actual downloaded labels before release. Producer labels retain a forest outer
rule; selection labels retain an ink rule. Neither implies verification,
ownership or a reviewed restaurant/shop classification.

Sizing and alt text live in `components/brand/chisan-brand.tsx`. Give an image
empty alt text when its link already has an accessible name.

## Motion, voice, access

Motion orients: 150ms feedback, 220ms components, 240ms page arrival, easing
`cubic-bezier(0.2, 0.8, 0.2, 1)`. Use opacity, short translations and small
image emphasis. Honour `prefers-reduced-motion`, including changes made while
the page is open. Never animate thousands of result rows or delay navigation.

The account menu is a native disclosure with progressive open/close motion,
an explicit chevron and bounded scrolling. Escape returns focus to the open
menu's trigger; outside pointer or focus movement closes it. Closed menus never
capture Escape from another control. The account tabs mark the current page.

Page arrival does not remount its children or intercept browser navigation.
`NavigationLink` retains Next.js Link semantics, prefetching and modified clicks;
its pending indicator follows the actual router state. The historical
`ViewTransitionLink` entry point delegates to it. Map cards, the result roster
and category filter links keep prefetch disabled. Province links open
directly in the compact country overview, with no duplicate selector. The
account menu's quick province switch has a bounded, searchable list grouped by
region, a visible current selection and a recoverable empty state. Matching
ignores accents and includes region names. Selecting an option navigates; hovering
an option never navigates. Standard Tab/Enter/Escape operation remains accessible.
There are no custom global keyboard shortcuts or command palette. Producer search
keeps a compact footprint and filters the existing map/list inline. A small
filter icon and search focus open one animated in-place menu for the current
province or country, with the same surface and motion as account settings.
There is no native scope select. Location stays in the explicit map control.
Loading and failure messages distinguish unavailable national data from an empty search.
The category strip keeps equal visible breathing room above and below its
44px controls. Compact pictograms reveal their 12px names on selection, keyboard
focus or pointer hover; touch never depends on hover to identify the active filter. Full base
text is indexed independently of short, match-centred list previews. Text
results retain shared relevance order even when the map moves. Country results
show each producer's municipality and province and retain its own profile URL.

The white footer has readable forest-green links, arranged in a single row on
wide screens and a deliberate grid on narrow ones. A separate decorative rural
panorama follows the links. A small delivery bicycle crosses it once, slowly,
when the scene first enters view. Only transforms animate; reduced motion keeps
a static bicycle. The scene and its motion never capture pointer or keyboard input.

The QR invitation uses the supplied C, which crossfades upward into the familiar
QR icon on hover/focus while its arrow moves slightly right. Activation opens a
native modal dialog with a brief fade and rise. It keeps focus inside, supports
Escape and outside dismissal, restores trigger focus and locks background scroll.
Download and copy remain real actions with local feedback. The producer/selection
eligibility gates and opt-in settings remain unchanged.
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
its illustrated places and cyclist are generic. See [imagery.md](imagery.md)
for the reusable image direction and provenance.

Write with exact nouns and plain uncertainty. The current Spanish public tagline is **Conecta con lo que se produce cerca de ti**.
The English tagline **Connecting local food.** remains available for English surfaces. Layouts expand for translation rather than
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

Outfit's font and license live in `app/_fonts/`; QR canvas typography consumes the
resolved interface font. Review the exports visually and independently decode
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
