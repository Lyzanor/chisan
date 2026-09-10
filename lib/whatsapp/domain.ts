import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { ExtractionTrace } from "../accounts/producer-change-intake";
import type { ProductCandidate } from "../intake/product";

// Compatibility entry point; product rules are shared across intake channels.
export * from "../intake/product";

export type AssistantState = {
  candidate: ProductCandidate;
  productId: string;
  baseRowHash: string;
  baseContentHash: string;
  turns: number;
  lastMessageAt: string;
  extractions: ExtractionTrace[];
  lastProposalId?: string;
  submittedCandidateHash?: string;
};
export const inboundSchema = z.object({
  id: z.string().min(1).max(200),
  from: z.string().regex(/^[1-9]\d{6,14}$/),
  timestamp: z.string().regex(/^\d{1,12}$/),
  type: z.string().max(40),
  text: z.object({ body: z.string().max(4096) }).optional(),
  image: z
    .object({
      id: z.string().regex(/^\d{1,100}$/),
      mime_type: z.enum(["image/jpeg", "image/png"]),
      sha256: z.string().max(100).optional(),
      caption: z.string().max(4096).optional(),
    })
    .optional(),
});
export type InboundMessage = z.infer<typeof inboundSchema>;

export function secretMatches(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function verifyMetaSignature(
  body: Buffer,
  signature: string | null,
  secret: string,
) {
  return (
    !!secret &&
    !!signature &&
    secretMatches(
      signature,
      `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`,
    )
  );
}
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export function parseWebhook(
  payload: unknown,
  phoneId: string,
): InboundMessage[] {
  const envelope = z
    .object({
      object: z.literal("whatsapp_business_account"),
      entry: z.array(
        z.object({
          changes: z.array(
            z.object({
              field: z.string(),
              value: z.object({
                metadata: z.object({ phone_number_id: z.string() }).optional(),
                messages: z.array(z.unknown()).optional(),
              }),
            }),
          ),
        }),
      ),
    })
    .parse(payload);
  const messages = envelope.entry.flatMap((entry) =>
    entry.changes.flatMap((change) => {
      if (
        change.field !== "messages" ||
        change.value.metadata?.phone_number_id !== phoneId
      )
        return [];
      return (change.value.messages ?? []).flatMap((message) => {
        const parsed = inboundSchema.safeParse(message);
        return parsed.success ? [parsed.data] : [];
      });
    }),
  );
  if (messages.length > 100) throw new Error("Webhook batch too large");
  return messages;
}
