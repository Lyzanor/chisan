export const PUBLIC_PROFILE_VISIBILITIES = [
  "private",
  "unlisted",
  "public",
] as const;

export type PublicProfileVisibility =
  (typeof PUBLIC_PROFILE_VISIBILITIES)[number];

const PUBLIC_HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;

const RESERVED_PUBLIC_HANDLES = new Set([
  "account",
  "acceso",
  "admin",
  "about",
  "api",
  "chisan",
  "cuenta",
  "contact",
  "events",
  "help",
  "how-we-work",
  "our-purpose",
  "privacy",
  "registro",
  "retail",
  "robots",
  "sitemap",
  "support",
  "u",
]);

export function normalizePublicHandle(value: string): string {
  return value.trim().toLowerCase();
}

export function publicHandleProblem(value: string): string | null {
  const handle = normalizePublicHandle(value);
  if (!PUBLIC_HANDLE_PATTERN.test(handle)) {
    return "Use 3–40 lowercase letters, numbers or hyphens, starting and ending with a letter or number.";
  }
  if (RESERVED_PUBLIC_HANDLES.has(handle)) {
    return "That public handle is reserved.";
  }
  return null;
}

export function isPublicProfileVisible(
  visibility: PublicProfileVisibility,
): boolean {
  return visibility === "unlisted" || visibility === "public";
}

export function isPublicProfileIndexable(
  visibility: PublicProfileVisibility,
): boolean {
  return visibility === "public";
}
