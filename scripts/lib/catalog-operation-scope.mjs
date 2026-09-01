import fs from "node:fs";
import path from "node:path";

const COUNTRY_SLUG = /^[a-z]{2}$/;

function readPublicationStatus(manifest, manifestPath) {
  const status = manifest.publicationStatus ?? "published";
  if (status !== "published" && status !== "standby") {
    throw new Error(
      `${manifestPath}: publicationStatus must be either 'published' or 'standby'`,
    );
  }
  return status;
}

export function listPublishedCatalogCountrySlugs(csvRoot) {
  return fs
    .readdirSync(csvRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && COUNTRY_SLUG.test(entry.name))
    .flatMap((entry) => {
      const manifestPath = path.join(csvRoot, entry.name, "country.json");
      if (!fs.existsSync(manifestPath)) return [];
      let manifest;
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      } catch (error) {
        throw new Error(
          `${manifestPath}: cannot parse country manifest (${error instanceof Error ? error.message : error})`,
        );
      }
      return readPublicationStatus(manifest, manifestPath) === "published"
        ? [entry.name]
        : [];
    })
    .sort();
}

/**
 * Operational tools default only when the publication policy identifies one
 * unambiguous active country. Explicit --country scopes remain available for
 * every catalog country, including standby countries.
 */
export function resolveDefaultCatalogCountry(csvRoot) {
  const countries = listPublishedCatalogCountrySlugs(csvRoot);
  if (countries.length !== 1) {
    const found = countries.length ? countries.join(", ") : "none";
    throw new Error(
      `A country was not specified and the catalog has ${countries.length} published countries (${found}); pass --country explicitly`,
    );
  }
  return countries[0];
}
