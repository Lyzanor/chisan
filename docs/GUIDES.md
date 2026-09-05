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

Public routes are `/guias` and `/guias/<slug>`, with a stable Spanish root layout.
No translated variants are implied. Future translations need explicit language
routes, reviewed copies and reciprocal alternates before publication.

## First edition and article shape

The first edition contains 31 Spanish articles, grouped into cheese, wine, honey,
olive oil, pantry and territory themes. Articles combine explanatory prose,
commented producer selections, an optional map, editorial criteria and sources.
Their stated scope is introductory; they are not complete inventories or tasting
reports. Search volumes have not been measured.

Each article is a Markdown document with YAML front matter for identity, title,
description, publication status, dates, topic, source metadata and related slugs.
The introduction, explanatory sections, producer commentary and selection criteria
are authored as ordinary CommonMark. There is no parallel JSON text store.

`lib/guides/markdown.ts` parses the document into the validated rendering model in
`schema.ts`. This in-memory model is derived, never a second editable authority.
Markdown is rendered without executable MDX or raw HTML. Images require a future
explicit provenance contract; inline Markdown image embeds are not rendered.

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
The initial presentation uses typography and article context. Documentary
photography can be added with an explicit article image and provenance. Maps load
on request through the shared producer-map renderer and contain exactly the selected
producers with published coordinates. Unmapped producers keep their article entry
and profile link. Neither map position nor payment determines membership.

The homepage and footer expose the section. Producer profiles derive their
“Aparece en estas guías” links from article identity references. There is no
separate manually maintained reverse-link list. Only published guides appear.

## Where the texts live and how to update them

The immediate editing interface is the repository. An editor can request changes
in Codex or edit a JSON file directly, for example: “Update the cheese guide with
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
5. Set `updatedAt` after a substantive revision of the article. Retain the original
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

## First-edition library and expansion

The 31 articles implement the initial editorial plan. Each has a distinct subject
and a stated scope. Expand their substantive coverage in place, keeping stable
slugs, rather than publishing annual duplicates or empty regional variants.

“Mejores productores de queso” can become an explicit editorial selection after
criteria and comparative evidence exist. Until then, use a title explaining what
the guide helps the reader do. Do not fabricate rankings, visits, tastings or
awards, or put a year in an evergreen slug.

## Wine denominations

The current `Vino` category is not a normalized denomination registry. The next
wine pass should assemble an official DOP/IGP reference inventory with exact names,
official record URLs and review dates. Claim “all” only after reconciling coverage
against that dated inventory.

Research producer/product-to-denomination relationships individually. Municipality,
province, map boundaries and winery names cannot establish membership. A winery
can make wines with different designations. Until a typed relationship contract
is needed, keep sourced explanations in the article; do not create an unowned
producer registry in guide metadata. Publish denomination articles only when each has
distinct substance and enough supported producer references.

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
promises. Later measure impressions, clicks and guide-to-profile visits alongside
coverage and factual usefulness.
