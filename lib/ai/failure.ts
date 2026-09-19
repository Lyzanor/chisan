import { z } from "zod";
import type { AIUsage } from "./usage";

export type ExtractionFailureKind =
  | "provider_http"
  | "provider_incomplete"
  | "provider_refusal"
  | "provider_output"
  | "transport"
  | "validation"
  | "processing";

export class ExtractionFailure extends Error {
  constructor(
    readonly kind: ExtractionFailureKind,
    readonly status?: number,
    readonly code?: string,
    readonly requestId?: string,
    readonly usage?: AIUsage | null,
  ) {
    super(`Extraction failed: ${kind}`);
  }
}

// Only fixed categories enter logs/audit. Never serialize provider messages,
// validation issues, response bodies, input, images, credentials or stacks.
export function extractionFailureDetails(error: unknown) {
  if (error instanceof ExtractionFailure)
    return { kind: error.kind, status: error.status, code: error.code, requestId: error.requestId };
  return { kind: error instanceof z.ZodError ? "validation" : "processing" };
}
