# Related Producer Content

## Purpose and ownership

An expanded producer profile can show products, a gallery and named links.
These are reviewed editorial records about what the producer makes and does.
Products can include a recorded price and a link to the product in an external
shop. Chisan does not provide live inventory, guaranteed quotes or checkout.

`data/content/<country>/<producer_id>.json` holds one atomic package for an
existing `(country, producer_id)`. The area CSV still owns identity, base facts
and the producer registry. The package survives area and slug changes. It never
registers a country, area or producer, and PostgreSQL is not a published-content
overlay. Sources remain in the producer's evidence ledger; Git records review.

The machine contract is `lib/catalog/content-schema.ts`. Additive capabilities
are introduced there with their consumers and tests, without widening all area
CSVs. `version` identifies the format. Unknown fields are rejected so misspelt
or unsupported content cannot disappear silently.

## Format

The following is a fictional format example, not a catalog decision:

```json
{
  "version": 1,
  "country": "es",
  "producer_id": 123,
  "products": [
    {
      "id": "aged-cheese",
      "name": "Queso curado",
      "description": "Texto revisado sobre este queso.",
      "locale": "es",
      "media_ids": ["cheese"],
      "link_ids": ["cheese-details"],
      "purchase_url": "https://example.org/shop/cheese",
      "price": { "amount": "8.50", "currency": "EUR" },
      "updated_on": "2026-09-06"
    }
  ],
  "gallery": [
    {
      "id": "cheese",
      "src": "/productores/es/content/123/cheese.webp",
      "alt": "Pieza de queso curado",
      "caption": "",
      "locale": "es",
      "width": 1600,
      "height": 1200,
      "credit": ""
    }
  ],
  "links": [
    {
      "id": "cheese-details",
      "label": "Conocer el queso",
      "url": "https://example.org/queso",
      "locale": "es"
    }
  ],
  "translations": []
}
```

Array order is presentation order. Item IDs are stable lowercase kebab-case
keys unique within their collection and producer. Editing or reordering an item
does not rename it. A product may refer to several gallery items or links; all
references must resolve within the same package. Removing a referenced item
requires updating its references in the same edit. Empty collections are valid.

Products have a public name, optional description, source locale and references.
Gallery items have a local image, meaningful alternative text, optional caption,
source locale, actual dimensions and optional attribution. Links have a clear
public label, source locale and HTTP(S) URL without credentials. A repeated URL
uses one link record. Base contact links and legacy highlighted links remain
compatible; prefer this collection for newly added repeated links.

The current resource bounds are 50 products, 100 gallery images, 50 links and
1 MiB per package. These limits control payload size and can be revised in the
shared schema for a demonstrated need. They are not editorial targets.

## Purchase links, prices and product dates

Optional `purchase_url` is the complete HTTP(S) product URL in the shop, without
credentials. It is distinct from editorial `link_ids`; producers can edit it
directly. The public button names the shop destination and opens it separately.
Payment, order handling and current terms belong to that shop.

Optional `price` contains `amount` as decimal text with exactly two digits after
the dot (0.00 to 999999.99) and `currency: "EUR"`. The editor accepts a comma or
dot and normalizes valid input before submission. This Spain-first release
supports EUR only. The price describes the product and format in its text;
there is no inferred unit, tax treatment, shipping cost, discount, availability
or validity period. A missing price or link is omitted, never inferred as zero
or unavailable. The public UI asks visitors to confirm current shop conditions.

`updated_on` is an exact ISO calendar day in UTC. For producer proposals, the
server dates each changed/new product when submitted for review. This records
the latest accepted edit's submission day; it is not the approval/deployment day
or a price guarantee. Name, description, language, price, URL, attachments and
changes to referenced image/link content count. Reordering products, unrelated
gallery changes and producer base edits do not. Client-supplied dates are
ignored; drafts keep the published date (new draft products remain undated).
Approval freezes that snapshot and publication retains it. Local editorial
changes must set the actual reviewed edit day. Publication rejects future dates
and commerce records without a date. Older records without commerce remain
valid without dates; optional fields have no defaults, preserving legacy hashes.

The UI shows “Actualizado esta semana” for the current Monday-to-Sunday UTC week,
then “Actualizado este mes” for the current UTC month, then “Actualizado en el
último año” for the preceding calendar-year interval. Older records show the
exact date. Every date also has an ISO `time[datetime]`, exact accessible label
and tooltip. Equivalent Catalan and English labels share these boundaries.

Public JSON-LD has an ordered `ItemList` of identity-bound `Product` nodes. A
real product with both a price and shop URL may have an `Offer` with only the
recorded price, currency and destination. Dates belong to the describing
`WebPageElement.dateModified`, not directly to `Product`. No stock, checkout,
ratings or search-engine rich-result eligibility is inferred. See
[Product](https://schema.org/Product), [Offer](https://schema.org/Offer) and
[dateModified](https://schema.org/dateModified). These multi-product profile
pages do not promise Google's [single-product rich results](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).

The public API and WebMCP expose these optional typed values with the same
visibility and `is_demo` flag. Only `(es, 12439)` is a demonstration: its prices
and profile URLs are explicitly fictional in the UI/API, and no `Offer` is
emitted for them. The three examples exercise 3.80, 6.50 and 9.90 EUR, with all
purchase links targeting its own Chisan profile. This is not a pricing source
or a commercial exception for any other producer.

## Images

Use reviewed WebP, JPEG or PNG under
`public/productores/<country>/content/<producer_id>/`. Asset names are stable,
independent of the producer's slug. Minimum dimensions are 200 by 200 pixels;
maximum dimensions are 10,000 and the maximum file size is 5 MiB. The checker
verifies actual format/dimensions, existence and containment inside `public/`.

Follow `docs/IMAGES.md` for sourcing, rights and visual review. The existing
main-image composition is not mandatory for a gallery: preserve the image's
honest aspect ratio. A model-generated product or production scene is not
producer evidence. There is no remote image fetch or deployed catalog-filesystem upload. The private account upload workflow below accepts local files.
Keep originals and private permissions outside the public package.

## Localization

Every item declares its actual source language. Reviewed translations are
optional entries with `collection`, `item_id`, `locale`, `source_hash` and
`values`. Translate exactly `name`/`description` for products, `alt`/`caption`
for gallery items, or `label` for links. `show` reports the source hashes.
The hash covers the source locale and translatable text, normalized to NFC/LF.
A translation cannot change URLs, asset paths, item identity or relationships.

Rendering prefers the current reviewed translation, then the item's original
text with its explicit HTML `lang`. Product names and producer speech remain
usable before every language is translated. Stale translations are retained for
review but never rendered. Prices, purchase URLs and dates are language-neutral;
a price-only change does not invalidate a prose translation. Public product
structured data follows the visibility boundary below.

## Editing and publication

1. Use `pnpm producer:content show <country> <producer_id>` to read the current
   package and its revision. `init` writes a new local draft without overwriting
   an existing file; it copies existing content when there is any.
2. Edit the draft. Check facts against public sources, choose reviewed assets,
   and update the producer's public evidence when the decision needs it.
3. Run `pnpm producer:content check <draft.json>`. Review the complete result,
   including source-language text, image alt text, links and collection order.
4. Run `pnpm producer:content apply <reviewed.json> --expect <revision>`; for a
   new package use `absent`. The command refuses a dirty target, stale revision,
   unknown producer, dangling reference or invalid asset. It acquires an
   exclusive local lock and atomically replaces this producer's package.
5. Inspect the diff, run `pnpm verify:data` and commit the package, required
   assets and evidence together. Apply the normal release procedure.

`apply` is an editorial tool, not a producer authorization bypass. It neither
changes entitlements nor publishes directly to Production. Named links and translations use this local review workflow. Products and gallery items also have the account editor described below. Private upload material becomes public only after review and Git publication.

If a process dies with a `.json.lock` file, identify that process/worktree and
inspect the target and temporary files before removing the abandoned lock. A
new attempt must use the current revision; no timeout adopts an unknown edit.

## Producer product editor

An active producer member with the exact `producer.profile.premium` entitlement
can add, edit, reorder and remove products in the existing profile editor. The
form exposes names, descriptions, original languages, photos, references to
reviewed links, an optional shop URL and an optional EUR price. Images can be uploaded, described, credited, assigned to products,
reordered and removed with undo. It has a preview, explicit draft saving and
submission for review. Link creation and translation editing remain local
editorial work.

The server stores `content_change` alongside the existing CSV patch in
`producer_change_requests`. This strict, versioned proposal contains the complete
reviewed base package, its semantic SHA-256, the requested ordered products and
the resulting package SHA-256. Object-key ordering does not affect these hashes;
array ordering does. It is a review snapshot, never a second published catalog.
Version 1 proposals retain the product-only contract. Version 2 also carries the
requested ordered gallery and an immutable prepared-upload manifest. The server
copies links and retained translations from the canonical base and rejects
unknown references, changed binary paths without prepared uploads, and uploads
belonging to another author or producer. Retiring a product or image removes its
translation records. Changed source text leaves old translations stale; the existing loader
renders source text until a reviewed translation is current.

Draft updates require the same author, producer and lock version. Submission
requires an actual field or product change and the author's explanation. Saved
drafts must satisfy the structural contract; an unnamed product is reported as
an error with its input retained. After submission the reviewed payload is
immutable. The editor, reviewer and publication workflow recheck exact access;
premium expiry keeps approved content and drafts intact while blocking further
premium edits and publication.

Approval allows `pnpm producer:change materialize <id>` to prepare the JSON and
CSV together. A product-only proposal is valid; it also receives the approved
change date in the CSV. If that date is already current, only the JSON needs a
Git change. The v2 publication receipt records independent CSV and content
hashes. Finalization requires the exact approved package in the same commit as
any changed CSV row and still present at HEAD. A stale file, competing draft,
invalid asset, revoked right or concurrent edit cannot be silently overwritten.
The v1 operator functions reject requests containing product changes.

The short CSV `productos estrella` summary remains a separately reviewed base
field: product edits never silently rewrite it. The public profile reads the
approved CSV and package after the normal Git release and deployment.

## Private image uploads

The premium editor accepts JPEG, PNG and WebP files up to 3 MiB each. It requires
an explicit declaration of permission to publish. The server checks the active
member and exact producer premium entitlement before preparation and again under
transaction locks before persistence. The request requires the same origin;
neither arbitrary URLs nor client-chosen storage paths are accepted.

Preparation checks actual file signatures, decodes pixels, rejects animation,
limits input to 24 million pixels and 10,000 px per edge, corrects EXIF orientation,
and strips metadata including GPS. It preserves aspect ratio without enlarging,
outputs WebP at up to 1,600 px per edge and 512 KiB, and requires at least
200 × 200 px after resizing. SHA-256 identifies the exact prepared bytes.
The source file and its original filename are not stored.

For this bounded first version, `producer_media_uploads` in PostgreSQL is a
private proposal inbox: normalized binary bytes plus author, producer identity,
dimensions, digest, rights declaration time and creation time. It is not a public
media store or an editable published catalog. It uses the existing private account
infrastructure; no additional object-storage service or token is required.
A future object-store adapter can move the bytes without changing the public
JSON/CSV authority or the review manifest.

The profile editor accepts up to 20 images in total, including product pictures.
Previously reviewed larger packages remain editable at their current size. The
inbox permits at most 60 prepared images per producer and 30 upload attempts per
account per day; attempts with invalid files also count. Identical bytes from the
same author and producer reuse their prepared record. Saving/submitting is
blocked while files are uploading. Errors retain completed images and entered
text, and recent uploads can be recovered when reopening the editor.

Private preview responses are authenticated, same-origin, `no-store` and excluded
from image optimization. Only the uploader with active membership can preview
unsubmitted images; authorized staff can preview submitted proposal attachments.
Premium expiry does not delete saved proposals. Upload bytes and identity are
immutable, and referenced files cannot be deleted during an open proposal or
within 90 days of a terminal review/publication outcome. On subsequent uploads,
the inbox cleans unreferenced files older than 30 days and expired terminal
attachments. Original files never enter the database, JSON, Git or public URLs.

The reviewer sees both gallery snapshots, captions, credits, order and product
assignments. The existing publication lease prepares images and JSON together.
The operator copies verified bytes to
`public/productores/<country>/content/<producer_id>/<sha256>.webp` before writing
the package. Writes are atomic, do not overwrite a competing asset, and rollback
removes only the execution's own unchanged files. Finalization proves that the
reviewed image bytes exist in the materializing commit and at current HEAD.
Commit the images, JSON and any changed CSV row together, then deploy normally.

The JSON `gallery` is the shared image collection. Images referenced by products
appear with those products, including caption and credit; unassigned images form
the standalone gallery without duplicates. Removing an image from a proposal
also removes its product references in the same change. Removing approved media
from a package does not immediately delete historical Git assets.

### Chisan demonstration fixture

Only `(es, 12439)` is the declared test producer. Its three fictional products
have three generated illustrations; five additional generated scenes exercise
the standalone gallery. Every image is visibly credited and captioned as
fictional demonstration material. This exception does not permit generated
imagery as evidence or visual identity for real producers. See
[demo image provenance](CHISAN_DEMO_MEDIA.md).

## Visibility and lifecycle

The existing `producer.profile.premium` entitlement controls the complete
expanded block. Inactive entitlement or unavailable account state hides these
collections while keeping approved files intact. Base profiles remain public.
Rendering is on the server, pictures load lazily, and no hidden content enters
base metadata or JSON-LD. The same entitlement-gated server component renders
the visible product JSON-LD; it disappears with the expanded block.

An area/slug move preserves the content path. Before a producer retirement or
merge, inspect related content and account references with `pnpm producer:inspect`.
A merge never silently reassigns content, media or a paid right: review the
surviving producer, migrate chosen items and references explicitly, and remove
the retired package in the same catalog change. A missing producer makes a
package invalid. Delete image assets only after checking all references.
