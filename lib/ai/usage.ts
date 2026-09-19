import { z } from "zod";

const tokens = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const aiUsageSchema = z.object({
  inputTokens: tokens,
  outputTokens: tokens,
  totalTokens: tokens,
  cachedInputTokens: tokens.nullable(),
  reasoningTokens: tokens.nullable(),
});
export type AIUsage = z.infer<typeof aiUsageSchema>;

/** Safe numeric diagnostics only; never retain prompts, photos or response text. */
export const aiRequestReportSchema = z.object({
  provider: z.string().max(80), model: z.string().max(160),
  reasoningEffort: z.string().max(40).nullable(), maxOutputTokens: tokens,
  outcome: z.enum(["completed", "failed"]), durationMs: tokens,
  usage: aiUsageSchema.nullable(), requestId: z.string().max(160).optional(),
  failure: z.object({ kind: z.string().max(40), status: tokens.optional(),
    code: z.string().max(80).optional(), requestId: z.string().max(160).optional() }).optional(),
});
export type AIRequestReport = z.infer<typeof aiRequestReportSchema>;
