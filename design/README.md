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
brand/chisan-reference.png   supplied identity sheet (pixel source)
brand/assets/            generated metadata and icon exports
public/brand/            lossless SVG wrappers for the supplied identity
references/              selected image direction and external inspiration
qa/design-qa.md          current visual verification
qa/history/              dated historical checks, not current specifications
```

## Ownership and working defaults

`app/_components/site-root-shell.tsx` imports, in this order:

```
app/globals.css  →  foundations/tokens.css  →  adapters/web.css
                →  adapters/experience.css  →  adapters/category-themes.css
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
silhouette; the favicon retains the supplied white-on-green artwork.

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
- The distance icon in the producer-list header opens a disclosure that filters the current province by an explicit browser
  position or manual coordinates. It intersects text and category, uses kilometres
  in a straight line, and keeps the centre out of URLs and persistent storage.
- Searching filters producer name, locality, category and description without
  introducing another catalog source or changing the URL.
- Hovering or focusing a list row previews the exact producer on the map and
  linked producer surface. A restrained `moss-pale` row treatment preserves
  the connection. In area discovery, clicking or pressing Enter opens the
  producer profile; pointer dwell (120 ms) or keyboard focus centers its map
  preview without changing the URL. Marker activation remains the durable
  URL selection. The large selected surface is the only map preview: synchronized
  maps do not also show a producer tooltip.
- On small area-discovery screens, the producer list is an always-visible,
  attached roster below the map. Profile producer selections may use an
  attached non-modal disclosure; its open state uses `moss-pale` and a `moss`
  edge, never a floating shadow.
- Public selections and their private previews show exactly the chosen producers.
  Fit the whole mapped set on opening and preserve one stable roster, including
  unmapped profile links. Geography never groups or ranks a selection. Keep the
  map above the optional QR invitation; title and description provide context.
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

The follow action is one icon target at the end of the name row. Pointer hover
and keyboard focus unfold its label with a short width animation; a touch screen
unfolds it on the first tap and acts on the second, so the action is never taken
unseen. The label overlays free space, so the name never reflows. The
reviewed main photo starts beside the title, with small gallery thumbnails.
On mobile it fills the header width below the
name, municipality and categories, before the description. The inline gallery
uses thumbnails and swipe without a counter or arrow bar. Premium uses the dedicated green header token
independently of ownership.

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
both products and links exist. The standalone gallery is rendered in the hero.
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
`brand/chisan-reference.png`. Its initial C contains two detached squares in the
upper-right opening: the larger square above/right and the smaller one below/left.
The separate icon at the right of the reference is the favicon, never an appended
part of the wordmark. The same initial C is extracted for producer and selection QR
centres. Current exports and their roles are listed in [brand/README.md](brand/README.md).

- Use the wordmark above 112px of width and the C for square affordances.
- Preserve the supplied proportions and both squares; do not redraw or typeset it.
- Keep the tagline as separate live text and the reversed logo as the same silhouette.
- No extra containers, motifs or favicon appended to the wordmark.
- `public/brand/chisan-wordmark.svg` and `chisan-mark.svg` preserve the existing
  public URLs as lossless embedded-PNG wrappers. These are raster-derived assets,
  not newly traced vector masters. The supplied pixels remain the authority.

Profile QR labels use forest green for producer codes, neutral ink for selection
codes and a pure white background. Both include the approved two-square C at the
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
`ViewTransitionLink` entry point delegates to it. Only the presented map card prefetches a producer profile; the large result
roster and category filter links keep prefetch disabled. Province links open
directly in the compact country overview, with no duplicate selector. The
account menu's quick province switch has a bounded, searchable list grouped by
region, a visible current selection and a recoverable empty state. Matching
ignores accents and includes region names. Selecting an option navigates; hovering
an option never navigates. Standard Tab/Enter/Escape operation remains accessible.
There are no custom global keyboard shortcuts or command palette. Producer search
keeps a stable, compact footprint and filters the existing map/list inline.

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
The active row has a fine green rule, soft fill and map-pin indicator. Its compact
photo card follows the actual producer point, placed above or below and constrained
to the visible map and browser viewport, below the sticky header. It no longer sits
at the bottom of the discovery map. The latest preview remains reachable when the
pointer crosses to its card; another producer, outside click or Escape replaces or
dismisses it. Hover/focus does not alter the URL or reorder rows. Marker activation
retains the existing URL selection; clicking the card or row opens the profile.
Other maps may retain their existing card placement until reviewed. Combining the
roster and preview into a single component is deferred.

Producer photography is documentary — real production, people and places in
available light. It remains sharp and truthful. Generic category decoration is
a separate brand layer: high-key food still lifes, genuine-looking texture,
natural colour, pure-white margins and very low display opacity. Generated
category assets must never become a real producer's product photo or evidence.
The footer uses fine forest-green pen/engraving with sparse gold accents;
its illustrated places and cyclist are generic. See [imagery.md](imagery.md)
for the reusable image direction and provenance.

Write with exact nouns and plain uncertainty. The current Spanish public tagline is **Conectando la alimentación local.**
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
- [ ] No horizontal overflow at 390px.
- [ ] Checked in one long or non-Latin locale.

Record material decisions and browser evidence in [`qa/design-qa.md`](qa/design-qa.md).
Routine edits that preserve the system need only the verification relevant to
the change. Avoid duplicating the same design rule in product contracts.

## Regenerating the brand assets

Run `node design/brand/build-favicon.cjs`. The generator extracts the left
wordmark, its initial C and the separate right-hand favicon from
`design/brand/chisan-reference.png`. It preserves the source alpha silhouette,
applies flat forest/white to wordmark exports, and pads the standalone C for the
QR quiet area. It writes the public SVG wrappers, metadata PNGs and
`app/favicon.ico` with 16, 32, 48 and 256px frames. The Apple export is flattened
on forest green for the system mask. No font tracing or image-model redraw occurs.

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
