# Editorial events

## Authority and scope

`data/events/es/<slug>.json` owns a reviewed event edition: its title, calendar
dates, venue coordinates, official source, identity image, editorial selection and optional
exhibitor plan. Git reviews and publishes these files. The producer roster uses
only `(country, producerId)` references to the canonical CSV catalog; an event
file cannot register a producer or change a producer's facts or coordinates.
An event is separate from a personal selection or account-owned shelf. It has
an editorial lifecycle rather than an owner's entitlement or proposal lifecycle.

Routes are `/es/eventos` and `/es/eventos/<slug>`. The stable slug includes the
edition year so historical pages retain their dates and sources. `status: draft`
keeps a file out of public routes, Descubrir and sitemap. A published edition
remains available after it ends. `featuredInDiscover: true` is an explicit
editorial choice; Descubrir only shows such editions through their final local
calendar date. The event's `timeZone` determines that cutoff.

`lib/events/schema.ts` validates the representation; `lib/events/read-model.ts`
owns the published event read model; `lib/events/catalog.ts` resolves current
producer identity and public routes; `components/events/`
renders the page. Published HTML and structured data show the same start/end
dates and venue. The venue latitude/longitude identifies where the fair happens.
The shared producer map identifies where exhibitors produce. These must never
be substituted for each other.

## Event imagery

Every published edition has a reviewed `image`: an official logo or poster,
stored under `public/editorial/events/`. Preserve its aspect ratio and record
alt text, dimensions, credit, source URL, rights context and actual review date.
The event card, page heading and social metadata use this identity image. It is
separate from the optional exhibitor plan; a plan must not silently stand in for
an event's identity. Drafts may omit the image while research is in progress.

## Exhibitors and plans

`exhibitors` contains reviewed catalog identities and how each one takes part.
`presence` is `stand` (the default: the producer staffs a stall), `dish` (a
participating kitchen names the producer as the source of an ingredient) or
`activity` (the producer leads or supplies a programme item). A stand may carry
the stand number printed by the organizer; multiple producers may share a
collective stand. A dish or activity presence needs a short `note` naming the
dish or session, and never has a stand number or plan point. Link a dish only
when the organizer or kitchen names the producer; an origin label such as a
DOP, an agrarian park or "Pyrenean lamb" is not a producer. Kitchens,
distributors and brands remain unlinked. Without a plan, the page lists
producers grouped by presence below the origin map, and a note leads that
producer's map card. The optional
`plan` holds a credited local copy of the organizer's image, its source URL,
dimensions, review date and normalized points (0–1). A point must reference an
exhibitor in the same event. A point marks that exhibitor's stand on the event
plan; it is not a new productive coordinate. When a displayed venue plan shows
only general areas, keep `points` empty and show the grouped presence list;
never assign producer pins to approximate zones. The shared presence viewer
keeps the physical image and producer origins mounted together, with one
identity selection and a searchable drawer. Nearby image
targets merge into an explicit position chooser at small scales; a selected
position always uses its exact normalized point. Collective stands show all
linked producers before choosing one. Counts use unique catalog identities,
independently of stand counts or wine/food categories.

`lib/annotated-producer-image.ts` owns the derived presentation contract and
identity/position resolution. The URL carries `highlight=country:id` and an
optional `point` for the exact image occurrence. A map selection shows every
appearance of that producer; choosing an image occurrence retains its optional
product ID. Missing productive coordinates remain explicitly unavailable, never
replaced by the venue. Event and shelf adapters share viewing components without
using shelf records or photo analysis as event storage. Venue coordinates,
credits and editorial detail remain available in the bottom disclosure.
The event's directions action opens Google Maps for the venue coordinates,
matching producer-profile directions. A selected producer appears directly
below the origin map in the shared image-and-map viewer, using the same
catalog-backed image, description and profile link as other map selections;
the stand or image position remains visible above that card.

The published roster can be a subset of the organizer's full exhibitor list:
only confidently reconciled, published Chisan producers receive profile links.
The original plan remains linked for all exhibitors, including shops,
restaurants, collective stands and producers not in Chisan. Participation,
stand assignment, date and venue need the organizer's current evidence; similar
names and a producer's nearby municipality are insufficient. Do not let image
matching publish a producer relationship automatically.

## Editing and verification

Create a draft JSON file and give each factual source an HTTPS URL and actual
`checkedAt` date. Confirm the venue pin from the organizer's map or another
specific source; do not infer it from the producer map. Review each linked
producer and point against the official exhibitor list and plan. Store a local
plan asset under `public/editorial/events/`, with attribution and rights context.
Set `publishedAt` only when the edition is approved for release, and update
`updatedAt` after substantive review.

Run `pnpm check:events`, `pnpm verify:data` and the applicable code gate. The
checker validates structure, asset dimensions, publication scope and existing
producer IDs. It cannot prove that a plotted point hits the right stand or that
an exhibitor will attend. Inspect the rendered image at phone width and wide
width before publishing. Release and rollback follow [Operations](OPERATIONS.md).

## Account proposals from images

An active Pro-capable account can prepare independent image selections at
`/cuenta/estanteria` using a shelf photo, plan, poster or programme page. These
private inputs and owner-confirmed selections belong to the account; the public
editorial event remains Git-owned. Uploading a document does not verify that its
sender represents the organizer. Existing editorial editions such as Escumostra
are not automatically assigned to an account.

After checking catalog matches, the owner can submit an event request with its
calendar, venue name, organizer and official source. `selection_shelves.event_request`
stores that private request and an immutable snapshot of the selected points,
separate from personal follows. Staff see it in `/admin/estanterias`, verify
attendance and positions, locate the venue independently, and export a private
versioned bundle. The `selection_shelf.event_exported` audit connects the source
account proposal and intended edition slug. Account IDs never enter the public
JSON. Corrections to the requested roster require a fresh owner submission;
the export uses the submitted snapshot, not a subsequently changed selection.

Run `pnpm event:prepare --snapshot <private-export.json>` on demand to prepare
an unpublished JSON and image in the normal editorial locations. The command
validates the bundle and image and refuses to overwrite existing editions or
assets. Never commit the private export. Review its source dates, image rights,
venue and associations, add a separate official identity poster, then publish
through the normal event checks and Git workflow. Existing editions are updated
by reviewing the proposal against their current files; account submissions never
overwrite them automatically. Preparation alone is neither approval nor deployment.

The input currently accepts JPEG/PNG/WebP images, including a photograph or
screenshot of a programme page, not multipage PDFs. The detector locates printed
names in lists and only maps names onto stands when a printed legend explicitly
establishes the association. Producer origins always come from the catalog.
