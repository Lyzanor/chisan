# Related Producer Content

## Purpose and ownership

An expanded producer profile can show products, a gallery and named links.
These are reviewed editorial records about what the producer makes and does.
They are not live inventory, price offers or a checkout.

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
      "link_ids": ["cheese-details"]
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

## Images

Use reviewed WebP, JPEG or PNG under
`public/productores/<country>/content/<producer_id>/`. Asset names are stable,
independent of the producer's slug. Minimum dimensions are 200 by 200 pixels;
maximum dimensions are 10,000 and the maximum file size is 5 MiB. The checker
verifies actual format/dimensions, existence and containment inside `public/`.

Follow `docs/IMAGES.md` for sourcing, rights and visual review. The existing
main-image composition is not mandatory for a gallery: preserve the image's
honest aspect ratio. A model-generated product or production scene is not
producer evidence. There is no remote image fetch or deployed filesystem upload.
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
review but never rendered. These collections add no Product/Offer JSON-LD,
pricing, availability or search-engine rich-result claim.

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
changes entitlements nor publishes directly to Production. Related-content
changes currently use this local review workflow; the deployed base-field
proposal form does not accept arrays or private upload data. Integrate a future
account editor through a dedicated typed proposal, preserving this same package
and review boundary.

If a process dies with a `.json.lock` file, identify that process/worktree and
inspect the target and temporary files before removing the abandoned lock. A
new attempt must use the current revision; no timeout adopts an unknown edit.

## Visibility and lifecycle

The existing `producer.profile.premium` entitlement controls the complete
expanded block. Inactive entitlement or unavailable account state hides these
collections while keeping approved files intact. Base profiles remain public.
Rendering is on the server, pictures load lazily, and no hidden content enters
base metadata or JSON-LD.

An area/slug move preserves the content path. Before a producer retirement or
merge, inspect related content and account references with `pnpm producer:inspect`.
A merge never silently reassigns content, media or a paid right: review the
surviving producer, migrate chosen items and references explicitly, and remove
the retired package in the same catalog change. A missing producer makes a
package invalid. Delete image assets only after checking all references.
