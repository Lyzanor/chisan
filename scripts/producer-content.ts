import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  loadProducerContent,
  producerContentPath,
  readProducerContentFile,
} from "../lib/catalog/content";
import {
  contentSourceHash,
  emptyProducerContent,
} from "../lib/catalog/content-schema";
import { findProducerById } from "../lib/catalog/producers";
import {
  applyProducerContent,
  contentRevision,
  validateProducerContent,
} from "../lib/editorial/producer-content";

const usage = `Usage:
  pnpm producer:content init <country> <producer_id> <draft.json>
  pnpm producer:content show <country> <producer_id>
  pnpm producer:content check <draft.json>
  pnpm producer:content apply <reviewed.json> --expect <revision|absent>

init creates a draft, show reports current content and source hashes, check
validates identity/references/assets, apply writes only the reviewed producer
package in this checkout. Review public sources and images before apply.
Run verify:data and inspect the Git diff before committing. No command deploys.`;

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || ["--help", "-h"].includes(command)) {
    console.log(usage);
    return;
  }
  if (command === "init" || command === "show") {
    if (args.length !== (command === "init" ? 3 : 2)) throw new Error(usage);
    const [country, rawId, destination] = args;
    if (!/^[1-9]\d*$/.test(rawId))
      throw new Error("producer_id must be a positive integer.");
    const producerId = Number(rawId);
    const empty = emptyProducerContent(country, producerId);
    const producer = await findProducerById(country, producerId);
    if (!producer)
      throw new Error("Producer not found in the canonical catalog.");
    const filePath = producerContentPath(country, producerId);
    const content = await loadProducerContent(country, producerId);
    if (command === "init") {
      if (path.resolve(destination) === filePath)
        throw new Error(
          "Create the draft outside its publication path; use apply after review.",
        );
      await writeFile(
        destination,
        `${JSON.stringify(content ?? empty, null, 2)}\n`,
        { flag: "wx", mode: 0o600 },
      );
      console.log(`Draft: ${path.resolve(destination)}`);
    } else {
      console.log(
        JSON.stringify(
          {
            producer: { country, producer_id: producerId, name: producer.name },
            revision: await contentRevision(filePath),
            content,
            sourceHashes: Object.fromEntries(
              (["products", "gallery", "links"] as const).map((collection) => [
                collection,
                content[collection].map((item) => ({
                  id: item.id,
                  source_hash: contentSourceHash(collection, item),
                })),
              ]),
            ),
          },
          null,
          2,
        ),
      );
    }
    return;
  }
  if (
    !["check", "apply"].includes(command) ||
    args.length !== (command === "check" ? 1 : 3)
  )
    throw new Error(usage);
  const content = await readProducerContentFile(args[0]);
  await validateProducerContent(content);
  if (command === "check") {
    console.log(
      "Producer content: valid. Editorial truth and image rights require review.",
    );
    return;
  }
  if (args[1] !== "--expect") throw new Error(usage);
  console.log(`Prepared: ${await applyProducerContent(content, args[2])}`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  main().catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Producer content failed.",
    );
    process.exitCode = 1;
  });
}
