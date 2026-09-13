import { createHash } from "node:crypto";
import { z } from "zod";
import { PRODUCER_EXPANDED_FIELD_DEFINITIONS } from "../catalog/producer-schema";
import { DESCRIPTION_SOURCE_LOCALES } from "../i18n/locale-registry";

export const NEWS_FIELD = "mensaje a la comunidad";
export const NEWS_LOCALE_FIELD = "mensaje_comunidad_locale";
const definition = PRODUCER_EXPANDED_FIELD_DEFINITIONS.find(
  (field) => field.key === NEWS_FIELD,
)!;

// Storage key and limits belong to the ordinary producer editor. Publication
// dates remain owned by editorial materialization, never by an AI candidate.
export const newsCandidateSchema = z.strictObject({
  text: z.string().trim().min(1).max(definition.maxLength),
  locale: z.enum(DESCRIPTION_SOURCE_LOCALES),
});
export type NewsCandidate = z.infer<typeof newsCandidateSchema>;
export const newsCandidateHash = (news: NewsCandidate) =>
  createHash("sha256")
    .update(JSON.stringify({ kind: "news", ...newsCandidateSchema.parse(news) }))
    .digest("hex");
