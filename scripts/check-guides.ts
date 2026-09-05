import { readGuides } from "../lib/guides/catalog";
import { findProducersByIds } from "../lib/csv-catalog";

async function main() {
  const guides = readGuides();
  for (const guide of guides) {
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
    `Guides: ${guides.length} files validated, including producer identities and related links.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
