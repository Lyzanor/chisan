import path from "node:path";
import { pathToFileURL } from "node:url";
import postgres from "postgres";

import {
  loadProducerContent,
  producerContentPath,
} from "../lib/catalog/content";
import { findProducerById } from "../lib/catalog/producers";
import { contentRevision } from "../lib/editorial/producer-content";
import { inspectProducerReferences } from "../lib/editorial/producer-inspection";

async function main() {
  const [country, rawId, option, ...extra] = process.argv.slice(2);
  if (
    !country ||
    !rawId ||
    !/^[1-9]\d*$/.test(rawId) ||
    extra.length ||
    (option && option !== "--catalog-only")
  ) {
    throw new Error(
      "Usage: pnpm producer:inspect <country> <producer_id> [--catalog-only]",
    );
  }
  const producerId = Number(rawId);
  const producer = await findProducerById(country, producerId);
  if (!producer)
    throw new Error("Producer not found in the canonical catalog.");
  const content = await loadProducerContent(country, producerId);
  let references: Record<string, number> | null = null;
  // Explicit connection only. Never silently inspect a developer's default DB.
  const connection = process.env.CHISAN_CATALOG_INSPECT_DATABASE_URL?.trim();
  if (option !== "--catalog-only" && connection) {
    const client = postgres(connection, {
      max: 1,
      prepare: false,
      connect_timeout: 10,
    });
    try {
      references = await client.begin("read only", async (transaction) =>
        inspectProducerReferences(
          country,
          producerId,
          async (statement, values) => [
            ...(await transaction.unsafe<{ count: string }[]>(statement, [
              ...values,
            ])),
          ],
        ),
      );
    } finally {
      await client.end();
    }
  }
  console.log(
    JSON.stringify(
      {
        producer: {
          country,
          producer_id: producerId,
          name: producer.name,
          area: producer.area,
          slug: producer.slug,
        },
        content: {
          revision: await contentRevision(
            producerContentPath(country, producerId),
          ),
          products: content.products.length,
          gallery: content.gallery.length,
          links: content.links.length,
        },
        accountInspection: references ? "complete" : "not_checked",
        references,
        nextStep: references
          ? "Review references, including historical records, before retiring or merging. Use audited account operations and review related content; this report authorizes no mutation."
          : "Account references remain unknown. Supply an explicit CHISAN_CATALOG_INSPECT_DATABASE_URL with SELECT permission on the listed domain tables; retirement cannot proceed from this report alone.",
      },
      null,
      2,
    ),
  );
  if (!references && option !== "--catalog-only") process.exitCode = 2;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  main().catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Producer inspection failed.",
    );
    process.exitCode = 1;
  });
}
