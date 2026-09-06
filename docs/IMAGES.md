# Producer Images

This guide owns image sourcing and human review; `docs/CSV_CONTRACT.md` owns the
published `imagen` field. Images are optional. Confirm identity, `producer_id`
and `slug` first: an empty cell is better than the wrong brand.

The workflow below prepares the primary `imagen`. Gallery and product pictures
use the paths, formats and dimensions in `docs/PRODUCER_CONTENT.md`. For those,
prefer photographs showing the producer's actual work or products and preserve
their useful aspect ratio. Use producer-supplied or licensed material with
permission for reuse, and retain required attribution. A gallery does not need
the primary image's logo composition.

Automated discovery inspects only the published official `web`; attributed
official social or institutional material may enter through the manual source
workflow. Ranking orders candidates but proves neither ownership nor identity.
Chisan composes attributable source material and never synthesizes visual
identity for a real producer.

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

A logo normally takes priority over a producer-authored photograph. Never use
stock or generated imagery, competitors, directories, public-funding or award
graphics, or an unreviewed top-ranked result. A parent, group or appellation
brand is not automatically the producer; leave `imagen` empty when attribution
is unclear.

## Primary-image output format

- New asset: WebP, **1600×1200** (4:3), quality 90.
- Canonical path:
  `/productores/<country>/<region>/<area>/<slug>.webp`, derived from the CSV
  location. There is no path flag to pass or to get wrong.
- Logo background: `#F3F0E8`, centred with visible breathing room.
- Target logo long edge: about 960 px.
- Do not upscale a logo or photograph beyond 3× its source dimensions.
- Reject sources below 200 px on the long edge.
- Do not store originals, contact sheets, or variants under `public/`.
- Publish at most one primary asset per row. Legacy formats remain valid; files
  above 2 MiB require review and normalization.

## Workflow

Install the optional dependencies only when composing images:

```bash
python3 -m pip install -r scripts/requirements-image-tools.txt
```

Start with an inventory; an empty image is a signal, not an error:

```bash
npx pnpm check:defects -- --country es --check sin-imagen
npx pnpm enrich:images --country es --inventory \
  > .tmp/images/es-inventory-before.json
```

Classify rows into official-site discovery, manual official-source review, or no
attributable source. Work by area and keep each bundle and decisions file
separate. Only the website lane is discovered automatically.

**Sweep** one area into its own directory under `.tmp/`:

```bash
npx pnpm enrich:images --area [area] --contact-sheet .tmp/images/[area]
```

The sweep changes no catalog data. Keep its ignored local bundle until review and
application; it binds candidates to the source and producer identity that
created them. A changed identity or `web` requires a new sweep. Filters, bundle
compatibility, safety limits and tuning options belong to the command's `--help`
and validation errors.

**Review** every selected tile before applying anything. Confirm that the image
belongs to the producer rather than a parent, agency, plugin, certification
body, directory or funding programme. Shortlists may order review but never
authorize an automatic first choice; previously removed or rejected candidates
need fresh scrutiny.

Record accepted rows in a decisions file in the same directory, one
`<slug> <digest>` per line. Comments may retain local working context, but the
ignored file is not durable catalog policy or an evidence tombstone.

**Apply** the reviewed batch:

```bash
npx pnpm enrich:images --area [area] --apply \
  --from .tmp/images/[area] --decisions .tmp/images/[area]/decisions.txt
```

Apply writes the frozen reviewed WebP, validates its producer binding and changes
only `imagen`; an existing destination requires explicit `--replace`. There is
one reviewed digest per row and no automatic choice.

Inspect the final CSV cells and saved assets, then capture the inventory again;
a country is not complete merely because its largest areas were processed:

```bash
npx pnpm enrich:images --country es --inventory \
  > .tmp/images/es-inventory-after.json
```

Close the batch under `docs/EDITORIAL.md` and the data gates in `AGENTS.md`.

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

Reject interface or placeholder graphics; platform, agency, certification,
funding, directory or territorial marks; screenshots; and any parent or
third-party identity that is not the producer. Local junk patterns inform review
without becoming global rules.

Two signals surface on the sheet and may point beyond the image candidate:

- A **`SHARED`** composition may be legitimate group branding or a collective,
  market, parent or directory asset. Investigate; do not edit automatically.
- A tile showing an unrelated business may mean a lapsed domain, redirect,
  shared template, or extraction failure. Verify the current URL before
  correcting or clearing `web`.

After applying, look at the saved `.webp` files rather than a re-render of the
sources. It is the only pass that sees what was actually published.

`check:images` blocks unsafe, missing or unrecognizable assets and reports
non-canonical or suspicious files. Duplicate hashes are review signals, not
automatic decisions, and do not catch unique junk.


## Premium producer uploads and the declared demo

The account editor accepts private image proposals using the preparation,
permissions and retention contract in `docs/PRODUCER_CONTENT.md`. Producers must
confirm permission to publish; staff still review identity, rights, captions and
attribution before Git publication. A valid decoder result is not editorial
approval. Product assignment preserves image credits in the public product card.

The explicitly fictional Chisan test producer `(es, 12439)` uses generated
illustrations solely to exercise its three product pictures and five gallery
pictures. Their captions and credits identify them as demonstrations. This
exception never establishes evidence or visual identity for a real producer;
`docs/CHISAN_DEMO_MEDIA.md` records the prompt set.
