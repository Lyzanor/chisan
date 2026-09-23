# Editorial guides

## Purpose and authority

Guides are a reading entrance to Chisan: explain a food, a place or a production
detail, then connect that explanation to existing producers. The map remains the
catalog's discovery surface. Each article needs context and useful commentary.

`data/guides/es/<slug>.md` owns the published Spanish article: title,
description, introduction, ordered sections, selection commentary, sources,
dates and related guide references. Git versions and publishes those files.
They do not own producer identity, facts, coordinates, contacts or products.
Those continue to belong to the CSV and producer-content contracts.

`lib/guides/schema.ts` owns the representation; `lib/guides/catalog.ts` loads
articles and resolves `(country, producerId)` references; `components/guides/`
renders them. Guide texts are separate from `data/content/`, which belongs to
individual producers, and from territorial research instructions.

Public routes are `/es/guias` and `/es/guias/<slug>`: the library is published
inside the catalog scope of the country it describes and shares that scope's
Spanish root layout. `lib/guides/routes.ts` owns those constants so the proxy
and the build resolve the guide segment without reading the catalog, and
`check:guides` verifies that they agree with the country manifest and that no
published area uses the segment. The first published root paths `/guias` and
`/guias/<slug>` permanently redirect to their canonical scope.
No translated variants are implied. Future translations need explicit language
routes, reviewed copies and reciprocal alternates before publication.

## Editorial strategy

The library is a maintained reference for choosing food and finding its producers.
Search is the primary discovery opportunity for that useful work. Chisan's
Descubrir page is an editorial entrance; Google Discover is a separate, optional
distribution surface, not a reason to turn the library into a daily news feed.

Front matter `kind` states an article's reading role independently of its food
`topic`. Every article has one role; the library presents it once:

| Kind | Reader promise | Maintenance |
| --- | --- | --- |
| `reference` | A durable starting point that answers the broad question and links to deeper reading | Review when a rule, source, explanation or linked example changes; prioritise these in maintenance sessions |
| `practical` | A distinct decision, product family or explicitly bounded territory | Update the relevant product, channel, register or visit information when it changes |
| `seasonal` | Help for a recurring harvest or time of year | Recheck before promoting that season; distinguish typical timing from a documented current campaign |
| `story` | One concrete question, production detail or documented anecdote | Add evidence or correct the explanation when needed; do not manufacture recency |

Reference coverage and the intended boundaries of its supporting reading:

| Reference | Owns the broad answer | Supporting reading owns |
| --- | --- | --- |
| `comprar-directamente-a-productores` | Find the producer, identify the seller and prepare a first order | Product-specific formats, delivery and purchase questions |
| `quesos-de-espana` | Milk, texture, maturation and choosing a cheese | Goat/sheep milk, blues, DOP recognition, orders and the bounded Cabrales visit guide |
| `vinos-de-espana-denominaciones-origen` | Bottle, variety, denomination and producer | Regional reading; Cava's separately evidenced installation inventory |
| `miel-de-espana` | Harvest origin, botanical origin and producer | Label reading, floral comparisons, named DOPs and crystallisation |
| `aceite-oliva-variedades-almazaras` | Category, variety, harvest and format | Named-variety comparisons and ordering from a mill |
| `calendario-frutas-verduras-temporada` | Interpret a dated national calendar and adapt it locally | Seasonal purchase decisions and preserved vegetables |

Other pantry and territorial guides are bounded practical entrances, not competing
national pillars. Each should have a useful next link to the relevant reference;
references link back to the deeper answers they delegate. Use descriptive inline
links at the point of need and a short, relevant `related` list. Avoid linking
every article to every other article or repeating full explanations in each one.

### Expand without saturation

Improve an existing answer before opening another URL. A new article needs a
distinct reader question, adequate evidence and a realistic reason to maintain it.
No publishing quota, required word count, fixed number of selected producers,
annual duplicates, interchangeable regional pages or keyword-only variants.
Search demand is a hypothesis until Search Console provides evidence; the current
structure follows reader tasks and available editorial substance.

Keep the Descubrir/home selection bounded to three articles through the existing
featured selection. A new guide does not automatically become a featured story.
Prioritise reference pieces now. When selecting timely reading, verify its actual
campaign or news hook before promotion; a substantive change in a stable guide
can be the useful update. Never sort the whole library by an artificially renewed
review date to simulate a newspaper.

Recurring seasonal advice keeps its stable slug. A one-off story needs a dated,
attributed fact with continuing explanatory value. Event dates, venue, edition and
exhibitor roster belong to [Events](EVENTS.md), whose edition lifecycle already
handles promotion and expiry. A guide may explain or link to an event but must not
maintain a competing agenda or exhibitor list. Do not copy a future edition from
last year's dates or retain expired attendance promises as current advice.

### Trust and editorial responsibility

Apply Google's [people-first guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
as editorial judgement, not an E-E-A-T score or a checklist of ranking signals.
Chisan is the visible organisational author. Keep the linked explanation of the
project, AI assistance, sources, scope and correction channel. Add a named author,
expert reviewer, visit, interview or tasting only when the person, work, date and
supporting evidence actually exist. Sources and a byline cannot stand in for
first-hand experience.

State the useful answer early, explain distinctions with attributable examples,
and make limitations specific to the claim. Replace unsupported superlatives,
sensory verdicts, health promises and common-method claims with facts or a concrete
question. Location does not prove raw-material origin; a producer's certification
does not cover its whole range. Do not turn necessary caveats into the article's
main content. Preserve documented history, production details and original useful
comparisons; shorten repetition rather than removing substance for a word target.

Use primary sources for standards, regulations and current claims; read the source
actually linked. Catalog-backed examples link to their canonical producer profiles.
Keep a source's real consultation date. State the edition and limits of older
reference material (for example, a national commercialisation calendar is not a
forecast of this year's local harvest). Attribute a producer's tasting note as
their description, never as Chisan's own experience.

### Living references and review

For a maintenance session, begin with references affected by a documented change,
then their supporting articles. Check the claim and source, producer relationships,
internal links and any commercial/visit information being recommended. Add a useful
new fact or correction in place; do not insert unrelated recent anecdotes solely
to make an article look current. A source becoming unavailable is a reason to
review its claim, not to invent replacement evidence.

After a substantive revision, set `updatedAt` and a short `revisionSummary` describing
what changed for the reader. Keep `publishedAt` fixed. The visible note does not
claim all sources were newly consulted; each source keeps its own `checkedAt`.
The full history stays in Git. No review-date bumps for builds, styling, spelling,
taxonomy-only changes or unrelated catalog updates. If a review finds no change,
do not imply a new edition of the article.

This is on-demand editorial work, not a new automation, CMS or standing queue.
Before seasonal promotion, verify the season's claims again. After measured
Search Console data is available, look at queries and pages together: impressions,
clicks and CTR for the intended questions, overlap between pages, and useful onward
visits to producers when measurable. Assess Google Discover separately when its
report is available; neither eligibility nor a traffic spike is proof of quality.

## Article shape

Articles combine explanatory prose, commented producer selections, an optional
map, editorial criteria and sources. Each states its scope; introductory coverage
does not establish a complete inventory, a tasting report or measured demand.
The files in `data/guides/` hold the current library and topic coverage.

Each article is a Markdown document with YAML front matter for identity, title,
description, publication status, dates, topic, source metadata and related slugs.
It also holds `kind` and an optional `revisionSummary` for substantive updates.
The introduction, explanatory sections, producer commentary and selection criteria
are authored as ordinary CommonMark. There is no parallel JSON text store.

`lib/guides/markdown.ts` parses the document into the validated rendering model in
`schema.ts`. This in-memory model is derived, never a second editable authority.
Markdown is rendered without executable MDX or raw HTML. Inline Markdown image
embeds render as contextual figures with captions. Every article requires a `cover` in front matter with
`src`, `alt`, pixel `width` and `height`, `credit`, HTTPS `sourceUrl` and
`licenseUrl`, and the actual `checkedAt` date. Local WebP files live under
`public/editorial/guides/`; the guide gate checks existence, uniqueness and intrinsic dimensions.
The article displays source and license attribution; cards use the same image
as a decorative thumbnail beside the linked headline. Metadata includes the
cover in Article, Open Graph and Twitter output.

Licensed context photography must fit the subject, and its caption must distinguish
an illustrative scene from evidence about a named producer, denomination or territory.
Each published guide uses a distinct cover to avoid visual repetition across the guide
library. It does not enter producer CSV image fields. The current context photographs
come from Unsplash under the linked Unsplash License, with credits retained in each article.
Replace a cover with a more specific documentary image when suitable licensed material exists.

Use `## Section title {#stable-anchor}` for a section. The explicit anchor is
optional, but recommended to preserve incoming links when a heading changes.
Use `## Nuestro criterio editorial {#criterio-editorial}` for the required
editorial criteria section. It renders in the shared attribution area.

A producer selection is an ordinary section with introductory prose and one
`### [Readable name](producer:es:10555)` heading per producer, followed by its
Markdown commentary. The label makes the source readable; public names and URLs
always resolve from the canonical identity. Put `<!-- mapa -->` at the end of the
selection to offer its map. Every referenced producer must exist. Repeated IDs,
malformed identities, misplaced map markers, invalid metadata, duplicate anchors
and unknown related guide slugs fail validation. A map includes exactly its
section's references; multiple selection sections are supported.

Names, images, coordinates and current profile URLs resolve from the CSV catalog.
Article covers use the explicit image and provenance fields above. Maps open
with the article through the shared producer-map renderer and contain exactly the selected
producers with published coordinates. Unmapped producers keep their article entry
and profile link. Marker activation uses the shared name-description-image card,
point focus and outside/Escape dismissal used by area maps. Selection stays local
to each embedded map, so several article maps do not overwrite one another.
Neither map position nor payment determines membership.

The homepage and footer expose the section. Producer profiles derive their
“Aparece en estas guías” links from article identity references. There is no
separate manually maintained reverse-link list. Only published guides appear.

## Where the texts live and how to update them

The immediate editing interface is the repository. An editor can request changes
in Codex or edit a Markdown file directly, for example: “Update the cheese guide with
these two producers and explain their milk.”

1. Open `data/guides/es/<slug>.md`. For a new guide, copy an existing article,
   choose a durable filename/slug and set `status: "draft"`. Draft dates are
   internal working values; set `publishedAt` to the actual first publication
   date when the article becomes ready.
2. Research each claim. Edit Markdown prose, sources and producer commentary.
   Base factual corrections belong in the canonical CSV workflow, not an article
   overlay. Keep producer references in their stable `producer:es:ID` heading links.
3. Run `pnpm check:guides` and `pnpm verify:data`. Validation checks file/slug
   agreement, section anchors, source metadata, dates, related guides and
   producer existence. It cannot prove a claim or denomination membership.
4. Preview with `pnpm dev` and inspect text, links and map. Drafts return 404 on
   public routes. To preview a draft, temporarily set it to published locally;
   retain that status only after editorial review.
5. Set `updatedAt` and explain the change in `revisionSummary` after a substantive
   revision of the article. Retain the original
   `publishedAt`; change each source's `checkedAt` only when consulted. Builds,
   spelling fixes and unrelated catalog edits do not imply a new article review.
6. Review the diff and commit only the intended scope. Publish through the normal
   Git/Vercel workflow in [Operations](OPERATIONS.md). Local edits are not a
   production release. No deployed request writes guide files.

Rendering, schema, route and policy changes require `pnpm verify:ai` and the
responsive browser checks in [Design](../design/README.md). Rollback is a reviewed
Git revert. Keep public slugs stable; a rename needs a permanent redirect and
updates to incoming references.

An administration editor can be added later. It should save private drafts and
review proposals in PostgreSQL, then materialize approved changes into these same
files, with server-side editorial permissions, validation and audit. It must not
become a second published text store or let producer entitlement purchase editorial
inclusion. There is no administrative guide editor in the current implementation.

## Library expansion

Each article has a distinct subject and a stated scope. Expand substantive
coverage in place, keeping stable slugs, rather than publishing annual duplicates
or empty regional variants.

“Mejores productores de queso” can become an explicit editorial selection after
criteria and comparative evidence exist. Until then, use a title explaining what
the guide helps the reader do. Do not fabricate rankings, visits, tastings or
awards, or put a year in an evergreen slug.

## Wine denominations

The `Vino` category is not a denomination registry. A producer's membership of a
wine DOP or IGP is a reviewed certification in its own row: `certificaciones`
includes `dop` or `igp`, and `certificaciones_detalle` begins with the exact
protected name (`DOP Cava; …`), followed by the issuer and the certified operator,
installation or scope published by the governing body. The evidence ledger cites
that dated register. This is the typed relationship consumers use to select a
denomination; guide metadata never becomes a second producer registry.

Research each relationship individually against the governing body's current
register. Municipality, province, map boundaries, brand names and product prose
cannot establish membership, and a winery can make wines with different
designations. A collective brand outside the denomination, such as Corpinnat or
Clàssic Penedès, is not membership of DOP Cava.

Claim “all” only for a dated register reconciled installation by installation. The
Cava guide lists every catalog producer whose row records `DOP Cava`. When the
council publishes a new list, repeat that reconciliation: certify matched rows,
admit or hold new installations, remove the certification when a producer leaves,
and update the article in the same change. Publish other denomination articles only
when each has distinct substance and enough supported producer references.

## Search and publication

Published guides have server-rendered text and profile links, self-canonical URLs,
Spanish language metadata, Open Graph/Twitter metadata and dated sitemap entries.
`Article` and `BreadcrumbList` JSON-LD match visible titles, attribution, dates and
sources, with safe serialization. No ratings or offers are synthesized. The shared
public-discovery flag controls indexing; country publication state gates guides.

Drafts are absent from navigation, static routes, sitemap and related reading;
unknown guide paths return 404. Maps are progressive enhancement: text and producer
links remain available without JavaScript.

Follow Google's [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content):
provide original useful detail and accurate titles and attribution; avoid thin
mass-produced pages and artificial freshness. There are no ranking or rich-result
promises. Performance assessments need measured impressions, clicks and
guide-to-profile visits alongside coverage and factual usefulness.

Google's [Discover guidance](https://developers.google.com/search/docs/appearance/google-discover)
also permits useful older content and describes that traffic as supplemental.
Use accurate headlines and representative credited images; avoid clickbait or
claims that an article is breaking news. Guide metadata allows
`max-image-preview:large`. Prefer landscape images at least 1200px wide, with
enough resolution and a meaningful crop; the new guide covers are 1600×900.
Keep visible attribution, dates and Article metadata consistent. There is no
special Discover schema or publishing-frequency guarantee.
