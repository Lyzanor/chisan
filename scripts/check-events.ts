import { existsSync } from "node:fs";
import sharp from "sharp";
import { findProducersByIds, listPublishedCountries } from "../lib/csv-catalog";
import { EVENTS_PATH, EVENTS_SEGMENT, readEvents, resolveEventsScope } from "../lib/events/catalog";

async function main() {
  const events = readEvents();
  const scope = resolveEventsScope();
  if (scope && `${scope.pathPrefix}/${EVENTS_SEGMENT}` !== EVENTS_PATH) throw new Error("Event route and scope disagree");
  for (const country of listPublishedCountries()) {
    for (const region of country.regions) {
      for (const area of region.areas) {
        if (area.slug === EVENTS_SEGMENT) throw new Error(`Event route collides with ${country.slug}/${area.slug}`);
      }
    }
  }
  const slugs = new Set<string>();
  for (const event of events) {
    if (slugs.has(event.slug)) throw new Error(`Duplicate event slug: ${event.slug}`);
    slugs.add(event.slug);
    if (event.status === "published" && !scope) throw new Error(`${event.slug}: no published scope`);
    const rows = await findProducersByIds(event.exhibitors, event.locale);
    rows.forEach((row, index) => {
      if (!row) throw new Error(`${event.slug}: unknown producer ${event.exhibitors[index].producerId}`);
    });
    for (const [kind, asset] of [["image", event.image], ["plan", event.plan]] as const) {
      if (!asset) continue;
      const imagePath = `public${asset.src}`;
      if (!existsSync(imagePath)) throw new Error(`${event.slug}: missing ${kind} ${imagePath}`);
      const dimensions = await sharp(imagePath).metadata();
      if (dimensions.width !== asset.width || dimensions.height !== asset.height) throw new Error(`${event.slug}: ${kind} dimensions disagree with file`);
      if (asset.checkedAt > new Date().toISOString().slice(0, 10)) throw new Error(`${event.slug}: future ${kind} review date`);
    }
    for (const source of event.sources) {
      if (source.checkedAt > new Date().toISOString().slice(0, 10)) throw new Error(`${event.slug}: future source review date`);
    }
  }
  console.log(`Events: ${events.length} files validated, including producer identities, venue coordinates and plan assets.`);
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
