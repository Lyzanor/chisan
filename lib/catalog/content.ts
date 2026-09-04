import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import { findProducerById } from "./producers";
import {
  emptyProducerContent,
  localizeProducerContent,
  PRODUCER_CONTENT_LIMITS,
  producerContentSchema,
  type ProducerContent,
} from "./content-schema";

export function producerContentPath(
  country: string,
  producerId: number,
  root = process.cwd(),
): string {
  // Validate identifiers before using them in a filesystem path.
  emptyProducerContent(country, producerId);
  return path.join(root, "data/content", country, `${producerId}.json`);
}

export async function readProducerContentFile(
  filePath: string,
): Promise<ProducerContent> {
  if ((await stat(filePath)).size > PRODUCER_CONTENT_LIMITS.bytes)
    throw new Error("Producer content exceeds the file-size limit.");
  return producerContentSchema.parse(
    JSON.parse(await readFile(filePath, "utf8")),
  );
}

export const loadProducerContent = cache(
  async (
    country: string,
    producerId: number,
    locale?: string,
  ): Promise<ProducerContent> => {
    const producer = await findProducerById(country, producerId);
    if (!producer) return emptyProducerContent(country, producerId);
    let content: ProducerContent;
    try {
      content = await readProducerContentFile(
        producerContentPath(country, producerId),
      );
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      )
        return emptyProducerContent(country, producerId);
      throw error;
    }
    if (content.country !== country || content.producer_id !== producerId)
      throw new Error("Producer content identity does not match its path.");
    return locale ? localizeProducerContent(content, locale) : content;
  },
);
