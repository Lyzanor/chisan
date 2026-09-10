import { z } from "zod";

export const extractionTraceSchema = z.strictObject({
  // Earlier pilot records predate this field and used the OpenAI adapter.
  provider: z.string().min(1).max(80).default("openai"),
  model: z.string().min(1).max(160),
  reasoningEffort: z.string().min(1).max(80).nullable(),
  promptVersion: z.string().min(1).max(80),
  maxOutputTokens: z.number().int().positive().max(1_000_000),
  messageId: z.string().min(1).max(200),
  inputKind: z.enum(["text", "image"]),
  at: z.iso.datetime(),
  candidateHash: z.string().regex(/^[a-f0-9]{64}$/),
});
export type ExtractionTrace = z.infer<typeof extractionTraceSchema>;

// Set by the server adapter, never read from FormData or model output. Store on
// the submission audit event in the same transaction as the immutable proposal.
const whatsappIntakeFacts = {
  channel: z.literal("whatsapp"),
  candidateHash: z.string().regex(/^[a-f0-9]{64}$/),
  launchOn: z.iso.date().nullable(),
  extractions: z.array(extractionTraceSchema).min(1).max(12),
};
const matchesLastExtraction = (value: {
  candidateHash: string;
  extractions: ExtractionTrace[];
}) => value.extractions.at(-1)?.candidateHash === value.candidateHash;
export const producerChangeIntakeSchema = z.union([
  z.strictObject({ version: z.literal(1), channel: z.literal("web") }),
  // Preserve the meaning of earlier explicitly confirmed pilot proposals.
  z
    .strictObject({
      ...whatsappIntakeFacts,
      version: z.literal(1),
      confirmationMessageId: z.string().min(1).max(200),
      confirmedAt: z.iso.datetime(),
    })
    .refine(matchesLastExtraction, "Candidate must match the last extraction"),
  z
    .strictObject({
      ...whatsappIntakeFacts,
      version: z.literal(2),
      submittedMessageId: z.string().min(1).max(200),
      receivedAt: z.iso.datetime(),
      replacesRequestId: z.uuid().nullable(),
    })
    .refine(matchesLastExtraction, "Candidate must match the last extraction"),
]);
export type ProducerChangeIntake = z.infer<typeof producerChangeIntakeSchema>;

export function readProducerChangeIntake(
  events: readonly { action: string; metadata: Record<string, unknown> }[],
): ProducerChangeIntake | null {
  const event = events.find(
    (item) => item.action === "producer_change.submitted",
  );
  const parsed = producerChangeIntakeSchema.safeParse(event?.metadata.intake);
  // Historical proposals do not have a structured source. Do not infer one
  // from user-editable notes or silently classify missing records as web.
  return parsed.success ? parsed.data : null;
}
