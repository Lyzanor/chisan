# Producer Images

This guide covers image sourcing, composition, application, and review. The
published `imagen` field contract lives in `docs/CSV_CONTRACT.md`;
`npx pnpm check:images` validates catalog assets.

Images are optional. Confirm the producer identity, `producer_id`, and `slug`
first. An empty cell is better than the wrong brand.

## Source selection

Prefer visual identity attributable to the producer, in this order:

1. `Organization.logo` from the official site's JSON-LD.
2. A logo or wordmark published on that site.
3. An official `og:image` that clearly shows the brand.
4. The profile image of an official social account.
5. A sufficiently large favicon.
6. A reputable institutional source only when no usable first-party source
   exists.

A logo normally takes priority over a product photograph. A producer-authored
photo is an acceptable fallback only when it unmistakably represents the
producer. Do not use stock imagery, generated imagery, competitors, generic
directories, public-funding badges, awards, or an unreviewed top-ranked result.

A parent, group, or appellation brand is not automatically the producer's
identity. If the productive unit publishes no attributable visual identity,
leave `imagen` empty.

`enrich:images` inspects only the `web` URL already published in the CSV. It
does not discover external sources or prove ownership, licensing, or identity;
its ranking only orders candidates for human review.

## Output format

- New asset: WebP, **1600×1200** (4:3), quality 90.
- Canonical path:
  `/productores/<country>/<region>/<area>/<slug>.webp`.
- Logo background: `#F3F0E8`, centred with visible breathing room.
- Target logo long edge: about 960 px.
- Do not upscale a logo or photograph beyond 3× its source dimensions.
- Reject sources below 200 px on the long edge.
- Do not store originals, contact sheets, or variants under `public/`.
- Add one asset per producer. Legacy formats remain valid, but files above
  2 MiB require review and normalization.

Light-background removal and near-white-ink darkening are topological: they
change only the background connected to the edge and retain internal holes.
Never apply them to an image classified as a photograph.

## Safe enrichment workflow

Install the optional dependencies only when sourcing or composing images:

```bash
python3 -m pip install -r scripts/requirements-image-tools.txt
```

Generate candidates:

```bash
npx pnpm enrich:images --area [area] --contact-sheet .tmp/images/[area]
```

Add `--slug [slug]` for one producer and `--allow-photos` when photographs are
in scope. Use an empty output directory so runs cannot mix. The command does not
change the catalog; it writes contact sheets and `candidates.json` with the URL,
score, dimensions, and full SHA-256 digest of each displayed composition.

`--max-candidates` (default 5) budgets what reaches the sheet: it counts only
candidates that download and clear the minimum size, so a template that
declares a dead icon family cannot hide the page's own logo behind the cap.
Unreadable candidates draw on a separate fixed budget that bounds wasted
requests and never renders anything.

Inspect the sheet and confirm that the image belongs to the producer rather
than its parent, web agency, plugin, certification body, directory, or funding
programme. The short identifier on the sheet is the start of the full
`candidates.json` digest.

Apply exactly one reviewed composition:

```bash
npx pnpm enrich:images --area [area] --apply \
  --slug [slug] --candidate [sha256]
```

Use `--replace` only to replace a published asset and repeat `--allow-photos`
when the approved candidate is a photograph. Repeat non-default discovery
limits when applying. `--apply` downloads the candidates again, accepts only a
matching digest, derives the canonical path, and changes only `imagen`. It
aborts if the CSV changed. There is no bulk apply or automatic first choice.

Inspect the diff and run:

```bash
npx pnpm check:images
```

## Quality review

The image check blocks unsafe paths, unsupported formats, missing files, and
unrecognizable content. It warns about non-canonical paths or names, unexpected
WebP dimensions, extension/content mismatches, orphan assets, and files above
2 MiB. To review duplicate hashes, run:

```bash
npx pnpm check:images -- --duplicates
```

A shared hash can be legitimate for a group or multi-site producer. Between
unrelated brands it often reveals a plugin, marketplace, directory, award,
institution, or funding logo. Duplicates are review signals, not automatic
decisions, and do not catch unique junk.

Also reject consent, accessibility, chat, payment, loader, and placeholder
graphics; theme, CMS, host, and agency marks; tourism or certification badges;
directory branding; full-page screenshots; empty cards; and parent identity
that is not the producer's public identity. Local junk patterns inform the
area review but do not automatically become global rules.
