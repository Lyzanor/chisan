import { z } from "zod";
import { SITE_ORIGIN } from "../../../lib/site";
import { parseLocationOnboardingStorageValue } from "../../../lib/location/location-onboarding";
import type { CatalogAreaKey } from "../../../lib/location/resolve-catalog-area";

// Narrow read projections of /api/catalog/v1, never a second editable catalog.
const place = z.object({ slug: z.string().regex(/^[a-z0-9-]+$/), name: z.string() });
const discoverySchema = z.object({
  schema_version: z.literal("1.0"),
  countries: z.array(place.extend({
    default_locale: z.string(),
    regions: z.array(place.extend({ areas: z.array(place.extend({ locales: z.array(z.string()) })) })),
  })),
});
const producerSchema = z.object({
  country: z.string(), producer_id: z.number().int().positive(), name: z.string(),
  municipality: z.string(), url: z.string().url(),
  categories: z.array(z.object({ label: z.string() })),
  description: z.object({ text: z.string(), locale: z.string() }).nullable(),
});
const resultsSchema = z.object({
  schema_version: z.literal("1.0"), revision: z.string(),
  total: z.number(), next: z.string().nullable(), producers: z.array(producerSchema),
});
export type MobileArea = CatalogAreaKey & { label: string; countryLabel: string };
export type MobileProducer = z.infer<typeof producerSchema>;
export type MobileResults = z.infer<typeof resultsSchema>;

export function mobileOrigin(value: string | undefined, development: boolean): string {
  const url = new URL(value?.trim() || SITE_ORIGIN);
  if ((url.protocol !== "https:" && !(development && url.protocol === "http:")) ||
      url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Chisan requires an HTTPS origin (HTTP is allowed only for local development).");
  }
  return url.origin;
}

export function catalogAreas(value: unknown): MobileArea[] {
  return discoverySchema.parse(value).countries.flatMap(country => country.regions.flatMap(region =>
    region.areas.map(area => ({ country: country.slug, area: area.slug, label: area.name, countryLabel: country.name }))));
}

export function savedArea(value: string | null, areas: MobileArea[]): MobileArea | null {
  const parsed = parseLocationOnboardingStorageValue(value);
  return areas.find(area => area.country === parsed?.area?.country && area.area === parsed.area.area) ?? null;
}

export function serializeArea(area: CatalogAreaKey): string {
  return JSON.stringify({ onboarding: "resolved", area: { country: area.country, area: area.area } });
}

export function producerSearchPath(area: CatalogAreaKey): string {
  return `/api/catalog/v1/producers?${new URLSearchParams({ country: area.country, area: area.area, limit: "20" })}`;
}

/** Accept only canonical Chisan links or this configured development origin. */
export function webUrl(value: string, origin: string): string {
  const url = new URL(value, origin);
  if (![SITE_ORIGIN, origin].includes(url.origin) || url.username || url.password) throw new Error("Unexpected catalog origin.");
  return new URL(`${url.pathname}${url.search}${url.hash}`, origin).href;
}

export class CatalogChangedError extends Error {}
export class MobileHttpError extends Error {
  constructor(readonly status: number) { super(`Chisan request failed (${status}).`); }
}

export async function fetchJson(origin: string, path: string, token?: string): Promise<unknown> {
  const url = webUrl(path, origin);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal, credentials: "omit", redirect: "error",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (response.status === 409) throw new CatalogChangedError();
    if (!response.ok) throw new MobileHttpError(response.status);
    return await response.json();
  } finally { clearTimeout(timeout); }
}

export async function fetchProducers(origin: string, path: string): Promise<MobileResults> {
  const url = new URL(webUrl(path, origin));
  if (url.pathname !== "/api/catalog/v1/producers") throw new Error("Unexpected catalog page.");
  return resultsSchema.parse(await fetchJson(origin, url.href));
}
