# Producer Images

This guide covers image sourcing, composition, application, and review. The
published `imagen` field contract lives in `docs/CSV_CONTRACT.md`;
`npx pnpm check:images` validates catalog assets.

Images are optional. Confirm the producer identity, `producer_id`, and `slug`
first. An empty cell is better than the wrong brand.

Automated `enrich:images` discovery inspects only the `web` URL already
published in the CSV. A row without `web` is out of scope for that sweep, not a
reason to invent an image. An explicitly downloaded asset may still enter the
same review bundle through `--source-file` when an official social account or
the institutional fallback below attributes it. The tool does not prove
ownership, licensing, or identity; its ranking only orders candidates for human
review.

This workflow composes attributable source material into a consistent catalog
asset. It never synthesizes a logo, product photograph, premises, or other
visual identity for a real producer.

## Source selection

Prefer visual identity attributable to the producer, in this order:

1. `Organization.logo` from the official site's JSON-LD.
2. A logo or wordmark published on that site.
3. An official `og:image` that clearly shows the brand.
4. The profile image of an official social account.
5. A sufficiently large favicon.
6. A reputable institutional source only when no usable first-party source
   exists and the published image is explicitly attributable to the producer;
   the institution's own mark is never a substitute.

A logo normally takes priority over a product photograph. A producer-authored
photo is an acceptable fallback only when it unmistakably represents the
producer. Do not use stock imagery, generated imagery, competitors, generic
directories, public-funding badges, awards, or an unreviewed top-ranked result.

A parent, group, or appellation brand is not automatically the producer's
identity. If the productive unit publishes no attributable visual identity,
leave `imagen` empty.

## Output format

- New asset: WebP, **1600×1200** (4:3), quality 90.
- Canonical path:
  `/productores/<country>/<region>/<area>/<slug>.webp`, derived from the CSV
  location. There is no path flag to pass or to get wrong.
- Logo background: `#F3F0E8`, centred with visible breathing room.
- Target logo long edge: about 960 px.
- Do not upscale a logo or photograph beyond 3× its source dimensions.
- Reject sources below 200 px on the long edge.
- Do not store originals, contact sheets, or variants under `public/`.
- Publish at most one primary asset per row. Legacy formats remain valid, but
  files above 2 MiB require review and normalization.

Light-background removal and near-white-ink darkening are topological: they
change only the background connected to the edge and retain internal holes.
Never apply them to an image classified as a photograph.

## Workflow

Install the optional dependencies only when sourcing or composing images:

```bash
python3 -m pip install -r scripts/requirements-image-tools.txt
```

Start a country pass by measuring the signal, not by treating every empty cell
as an error:

```bash
npx pnpm check:defects -- --country es --check sin-imagen
npx pnpm enrich:images --country es --inventory \
  > .tmp/images/es-inventory-before.json
```

Classify the empty rows into three lanes: an official `web` that can be swept,
an official social account that needs manual review, or no attributable visual
source yet. The inventory records the complete four-way matrix (`web` with or
without social, social only, or neither), the country totals, and every area, so
it is also the closure checklist. Only the website lane is automatically
discovered. A country pass is still a queue of area passes: `--area` is
intentional because the area directory is the unit of review and staged batch
application. Keep separate directories and decisions files; never combine
cached digests from different areas.

**Sweep** one area into its own directory under `.tmp/`:

```bash
npx pnpm enrich:images --area [area] --contact-sheet .tmp/images/[area]
```

The destination must be new or empty. `.tmp/` is ignored by Git, so the cache is
local resumable work rather than shared provenance; keep it until the area has
been reviewed and applied.

`--area` takes the name as it is spoken. Accents, case, and the exonyms
recorded in `data/csv/<country>/country.json` all resolve, so `Girona`,
`Berlín`, `Milán`, `Bavaria`, and `Londres` reach the right CSV. An unknown
name reports the closest area slugs rather than guessing. If the same area slug
exists in more than one country, resolution stops instead of silently choosing
one; repeat the command with the canonical country slug, for example
`--country es`.

Narrow the target with `--categoria` when the request does:

```bash
npx pnpm enrich:images --area "Milán" --categoria quesos \
  --contact-sheet .tmp/images/milano-quesos
```

The match is loose and covers `categorias adicionales`, so `quesos` selects
`Lácteos y quesos`. The run prints the categories it resolved and how many rows
it will sweep; an unmatched category lists what the area actually has instead of
sweeping nothing. Add `--slug [slug]` for one producer and `--allow-photos` when
photographs or ambiguous header identity images are in scope. An explicit logo
signal remains a logo even when its filename also contains a generic word such
as `hero`; a producer-named header image without explicit logo evidence is
ambiguous, keeps logo-style composition, and is excluded without that flag.
`--max-candidates 3` is a good default; raising
`--threshold` reduces review time at the cost of coverage. Failed downloads and undersized
assets do not consume that review cap; a separate fixed ceiling bounds wasted
requests. The sweep changes nothing: it writes contact sheets, a versioned
`candidates.json` manifest with the catalog path, producer identity, source URL,
candidate subject, score, dimensions, and full SHA-256 digest of each
composition. `compositions/` holds the lossless reviewed pixels and `assets/`
holds the exact WebP bytes bound to the manifest by a second digest. Runtime
varies with site failures and timeouts. If areas are swept concurrently, keep
concurrency small and bounded, with one directory per area. Expect a minority
of rows to yield a usable image — around half where producers own their domain,
fewer where they publish under a collective brand.

Network discovery rejects credentials and non-public destinations, pins each
connection to the IP addresses validated for that URL, ignores environment
proxies, and repeats the process for every redirect. It also caps URL, metadata,
HTML and image sizes, blocks external SVG resources, and bounds raster pixels
and the SVG surface before decoding. These safety limits are not evidence that
a candidate is trustworthy. Each composition and its frozen WebP is written to
the review bundle as soon as it is ready; contact sheets then load only one page
of candidates at a time, so a large area does not retain the whole sweep in
memory.

The current bundle format is version 3. Version 2 already froze exact WebP
bytes, while version 1 contains only the composed PNG and must re-encode it on
apply. Both older versions preserve the previous visual classification, so a
new unpublished v1/v2 decision must be re-swept or explicitly acknowledged
with `--allow-photos`; an exact decision already published remains idempotent.
Re-sweep a v1 bundle before resuming it on a machine with a different
Pillow/libwebp version. Encoder-independent byte stability applies to v2 and
v3 bundles.

Keep the directory. It is the unit of resumable work: an area swept today can be
reviewed and applied over several sittings, or weeks later, without touching the
network again. On apply, the manifest binds each candidate to the same catalog
path, `producer_id`, `slug`, and `web` that produced it. Unrelated CSV edits and
earlier accepted decisions may coexist; a changed identity or source URL
requires a new sweep. Sweeps left in a session-scoped scratchpad are lost work.

**Review** the sheets before applying anything. The scorer ranks candidates; it
cannot tell a producer's brand from its parent's logo, a subsidy banner or an
agency credit, all of which score well. Confirm each image belongs to the
producer rather than its parent, web agency, plugin, certification body,
directory, or funding programme. The identifier on each tile starts its digest.

For a large pass, a shortlist may prioritize first-party logo fields, strong
name matches, adequate source dimensions, and compositions not shared by
several producers. That filter only orders human review; it never authorizes an
automatic first choice. Reappearing candidates whose image was removed in Git
or rejected in a local decisions note need reinforced review of the current
source and saved composition before they can be reconsidered.

Record accepted rows in a decisions file in the same directory, one
`<slug> <digest>` per line. Blank lines and `#` comments are ignored, so it
doubles as the note of what was rejected and why. Because `.tmp/` is local and
ignored, those comments are working context rather than durable catalog policy:
read them before reconsidering a candidate, but do not turn them into a global
rule or an irreversible tombstone.

**Apply** the reviewed batch:

```bash
npx pnpm enrich:images --area [area] --apply \
  --from .tmp/images/[area] --decisions .tmp/images/[area]/decisions.txt
```

This writes the frozen reviewed WebP with no network access, so what was
approved is what lands even if the producer's site or a local WebP encoder has
changed since. It validates canonical slugs and paths, verifies the composition
and asset digests against the producer-specific manifest entry, and changes
only `imagen`. Every row is resolved before writing; the batch is staged, the
CSV is replaced last, and detected replacement failures trigger a best-effort
rollback of asset bytes. A destination that already exists — including an
orphan asset — requires `--replace`; a destination that was absent is installed
without clobbering a file created concurrently. CSV and replacement-asset bytes
are checked up to immediately before their swaps, which detects ordinary
concurrent changes but is not an operating-system compare-and-swap guarantee.
A multi-file filesystem update cannot be crash-atomic: after a process or
machine interruption, run the image and changed-CSV checks before resuming.
Append to the decisions file and re-run to continue an area; rows whose CSV
already carries the canonical path and whose asset matches the frozen bytes are
skipped. Use `--replace` only to overwrite a published asset, and repeat
`--allow-photos` when an approved candidate is not an explicit current-format
logo.

Without `--from`, `--apply --slug [slug] --candidate [sha256]` still handles a
single producer by fetching again. Repeat `--allow-photos` and any non-default
`--threshold` or `--max-candidates` used during discovery so the reviewed
candidate remains in scope. Either way there is one reviewed digest per row and
no automatic first choice.

Inspect the intended CSV cells and assets while iterating, then run
`npx pnpm check:csv:changed` and `npx pnpm check:images`. The final data gate is
`npx pnpm verify:data`. Capture the same inventory after the pass and compare
the totals and every area; a country is not closed merely because the largest
areas were processed:

```bash
npx pnpm enrich:images --country es --inventory \
  > .tmp/images/es-inventory-after.json
```

## Rows without an official website

The tool deliberately has no social-media scraping mode. When the CSV already
links an official Facebook or Instagram account, a reviewer may manually
download its profile image only after confirming that the account and image
identify the exact productive unit. Feed that local file and its attributable
official page into the same versioned review workflow; do not edit the CSV or
copy it into `public/` by hand:

```bash
npx pnpm enrich:images --country es --area [area] --slug [slug] \
  --source-file .tmp/images/manual/[slug].png \
  --source-reference https://www.instagram.com/[official-account]/ \
  --subject logo --contact-sheet .tmp/images/[area]-manual-[slug]
```

Use `--subject photo --allow-photos` only for an unmistakably producer-authored
fallback photograph. Review the resulting sheet, put its digest in a decisions
file, and apply it with the normal `--from` command. The source file remains a
local review input; the bundle freezes and validates the normalized WebP.

Do not use avatars from reviewers, Google Maps contributors, search-result
thumbnails, retailers, directories, or inferred parent brands. If the profile
is inaccessible, the image is ambiguous, or no attributable source exists,
leave `imagen` empty. `sin-imagen` remains an editorial signal, not a structural
failure.

## Quality review

Reject consent, accessibility, chat, payment, loader, and placeholder graphics;
theme, CMS, host, and agency marks; appellation, tourism, and certification
seals; public-funding banners; awards and fairs; directory, market, and
territorial branding; suppliers; full-page screenshots; empty cards; and parent
identity that is not the producer's public identity. Local junk patterns inform
the area review but do not automatically become global rules.

Two signals surface on the sheet and may point beyond the image candidate:

- A composition marked **`SHARED`** was offered to more than one producer. It
  may be legitimate group branding, or it may come from a collective site — an
  appellation council, market, parent group, or directory. Investigate the rows
  and correct `web` only when the published URL is actually wrong; do not turn
  the duplicate signal into an automatic edit.
- A tile showing an unrelated business may mean a lapsed domain, redirect,
  shared template, or extraction failure. Verify the current URL before
  correcting or clearing `web`.

After applying, look at the saved `.webp` files rather than a re-render of the
sources. It is the only pass that sees what was actually published.

The image check blocks unsafe paths, unsupported formats, missing files, and
unrecognizable content. It warns about non-canonical paths or names, unexpected
WebP dimensions, extension/content mismatches, orphan assets, and files above
2 MiB. `npx pnpm check:images -- --duplicates` reviews duplicate hashes across
the catalog; they are review signals, not automatic decisions, and do not catch
unique junk.
