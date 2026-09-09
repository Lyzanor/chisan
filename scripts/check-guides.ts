import { existsSync } from "node:fs";
import sharp from "sharp";
import {
  GUIDES_PATH,
  GUIDES_SEGMENT,
  readGuides,
  resolveGuidesScope,
} from "../lib/guides/catalog";
import { findProducersByIds, listPublishedCountries } from "../lib/csv-catalog";

async function main() {
  const guides = readGuides();
  // The library is published inside a catalog scope, so its segment must stay
  // free in every published country and agree with the country manifest.
  const scope = resolveGuidesScope();
  for (const country of listPublishedCountries()) {
    for (const region of country.regions) {
      for (const area of region.areas) {
        if (area.slug === GUIDES_SEGMENT)
          throw new Error(
            `Area '${country.slug}/${area.slug}' collides with the guide route segment`,
          );
      }
    }
  }
  for (const guide of guides) {
    const imagePath = `public${guide.cover.src}`;
    if (!existsSync(imagePath)) throw new Error(`${guide.slug}: missing cover`);
    const image = await sharp(imagePath).metadata();
    if (
      image.width !== guide.cover.width ||
      image.height !== guide.cover.height
    )
      throw new Error(`${guide.slug}: cover dimensions disagree with its file`);
    if (guide.cover.checkedAt > new Date().toISOString().slice(0, 10))
      throw new Error(`${guide.slug}: future cover review`);
    // Drafts are checked too, so stale producer references cannot wait until release.
    const references = guide.sections.flatMap((section) =>
      section.type === "producers" ? section.items : [],
    );
    const producers = await findProducersByIds(references);
    producers.forEach((producer, index) => {
      if (!producer)
        throw new Error(
          `${guide.slug}: unknown producer ${references[index].country}:${references[index].producerId}`,
        );
    });
  }
  console.log(
    `Guides: ${guides.length} files validated at ${scope ? GUIDES_PATH : "no published scope"}, including producer identities and related links.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
