import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  producerContentPath,
  readProducerContentFile,
} from "../lib/catalog/content";
import { contentSourceHash } from "../lib/catalog/content-schema";
import { validateProducerContent } from "../lib/editorial/producer-content";

export async function checkProducerContent(root = process.cwd()) {
  const directory = path.join(root, "data/content");
  const errors: string[] = [];
  const notices: string[] = [];
  let checked = 0;
  const countries = await readdir(directory, { withFileTypes: true }).catch(
    (error) => {
      if (error.code === "ENOENT") return [];
      throw error;
    },
  );
  for (const country of countries) {
    if (!country.isDirectory()) {
      if (!["README.md", ".gitkeep"].includes(country.name))
        errors.push(`Unexpected content-root entry: ${country.name}`);
      continue;
    }
    for (const file of await readdir(path.join(directory, country.name))) {
      const filePath = path.join(directory, country.name, file);
      try {
        const content = await readProducerContentFile(filePath);
        if (
          filePath !==
          producerContentPath(content.country, content.producer_id, root)
        )
          throw new Error("File path does not match content identity.");
        await validateProducerContent(content, root);
        for (const variant of content.translations) {
          const item = content[variant.collection].find(
            (entry) => entry.id === variant.item_id,
          )!;
          if (
            variant.source_hash !== contentSourceHash(variant.collection, item)
          )
            notices.push(
              `${filePath}: stale ${variant.locale} translation of ${variant.collection}/${variant.item_id}; source text will render.`,
            );
        }
        checked++;
      } catch (error) {
        errors.push(
          `${filePath}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
  return { checked, errors, notices };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  checkProducerContent()
    .then((result) => {
      for (const message of result.errors) console.error(message);
      for (const message of result.notices) console.log(message);
      console.log(
        `Producer content: ${result.checked} packages, ${result.errors.length} errors, ${result.notices.length} notices.`,
      );
      process.exitCode = result.errors.length ? 1 : 0;
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
