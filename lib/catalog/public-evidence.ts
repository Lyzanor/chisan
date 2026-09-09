import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** Only public source URLs and their review dates; never notes or claim material. */
export async function loadPublicProducerSources(
  country: string,
  region: string,
  area: string,
  slug: string,
): Promise<{ url: string; checkedAt: string }[]> {
  if (
    ![country, region, area].every((value) =>
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
    )
  )
    return [];
  try {
    const ledger = await readFile(
      path.join(
        process.cwd(),
        "data/evidence",
        country,
        region,
        `${area}.jsonl`,
      ),
      "utf8",
    );
    for (const line of ledger.split("\n")) {
      if (!line.trim()) continue;
      const record = JSON.parse(line);
      if (
        record.action !== "keep" ||
        record.slug !== slug ||
        !Array.isArray(record.sources)
      )
        continue;
      return record.sources.flatMap(
        (source: { url?: unknown; checkedAt?: unknown }) => {
          if (
            typeof source.url !== "string" ||
            typeof source.checkedAt !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt)
          )
            return [];
          try {
            const url = new URL(source.url);
            return ["https:", "http:"].includes(url.protocol) &&
              !url.username &&
              !url.password
              ? [{ url: url.href, checkedAt: source.checkedAt }]
              : [];
          } catch {
            return [];
          }
        },
      );
    }
  } catch {
    /* A missing ledger never prevents the CSV profile from rendering. */
  }
  return [];
}
