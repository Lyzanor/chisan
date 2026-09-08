// Guides are published inside the catalog scope of the country they describe,
// so the editorial library shares the public URL family it links into. These
// constants stay free of filesystem and catalog reads because the proxy and the
// build configuration resolve the guide segment before any page runs.
export const GUIDES_COUNTRY = "es";
export const GUIDES_LOCALE = "es";
export const GUIDES_SEGMENT = "guias";

// The scope prefix is the country's default-locale form. `check:guides` keeps
// this agreement with the published country manifest verifiable.
export const GUIDES_PATH = `/${GUIDES_COUNTRY}/${GUIDES_SEGMENT}`;

// The library was first published at the site root. Incoming links keep working
// through a permanent redirect declared in the Next.js configuration.
export const LEGACY_GUIDES_PATH = `/${GUIDES_SEGMENT}`;

export function guidePath(slug: string): string {
  return `${GUIDES_PATH}/${slug}`;
}
