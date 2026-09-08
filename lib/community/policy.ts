import { z } from "zod";
import { ACCOUNT_ROUTES } from "../accounts/config";

export const TIMELINE_PATH = ACCOUNT_ROUTES.timeline;
export const FOLLOWING_PATH = ACCOUNT_ROUTES.favorites;
export const COMMUNITY_PATH = "/cuenta/comunidad";
export const TIMELINE_PAGE_SIZE = 20;
export const timelineFilterSchema = z.enum(["all", "posts", "activity"]);
export type TimelineFilter = z.infer<typeof timelineFilterSchema>;
const cursorSchema = z
  .object({
    at: z.iso.datetime(),
    id: z.string().regex(/^[uc]:[0-9a-f-]{36}$/),
  })
  .strict();
export function encodeTimelineCursor(cursor: z.infer<typeof cursorSchema>) {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}
export function decodeTimelineCursor(value?: string) {
  if (!value || value.length > 300) return null;
  try {
    return cursorSchema.parse(
      JSON.parse(Buffer.from(value, "base64url").toString()),
    );
  } catch {
    return null;
  }
}

/** The deployed catalog must contain the reviewed change; proposal text is never a rendering source. */
export function isPublishedChange(
  patch: Record<string, string>,
  fields: Record<string, string>,
  requestedContentHash: string | null,
  publishedContentHash: string,
) {
  const normalize = (value: string) =>
    value.normalize("NFC").replace(/\r\n?/g, "\n");
  return (
    (Object.keys(patch).length > 0 || requestedContentHash !== null) &&
    Object.entries(patch).every(
      ([key, value]) => normalize(fields[key] ?? "") === normalize(value),
    ) &&
    (requestedContentHash === null ||
      requestedContentHash === publishedContentHash)
  );
}
