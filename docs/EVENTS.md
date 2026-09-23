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

`exhibitors` contains reviewed catalog identities and the stand number printed
by the organizer. Multiple producers may share a collective stand. The optional
`plan` holds a credited local copy of the organizer's image, its source URL,
dimensions, review date and normalized points (0–1). A point must reference an
exhibitor in the same event. A point marks that exhibitor's stand on the event
plan; it is not a new productive coordinate. Dense plans show one selected
point at a time, with the numbered original visible and an exhibitor list to
choose from. The existing shelf image and origin-map interaction is reused for
viewing, without using shelf records or its photo analysis workflow as event
storage.

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
