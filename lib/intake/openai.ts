import { z } from "zod";
import { ExtractionFailure } from "./failure";
import {
  PRODUCT_EXTRACTION_PROMPT_VERSION,
  productInterpretationOutputSchema,
  productExtractionInstructions,
  extractProductCandidate,
  type ProductExtractor,
  type ExtractionInput,
} from "./extractor";

const reasoningEffortSchema = z.enum([
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
]);
export type ExtractionConfiguration = {
  apiKey: string;
  model: string;
  reasoningEffort?: z.infer<typeof reasoningEffortSchema>;
  maxOutputTokens: number;
};

export function openAIProductConfig(
  environment: Record<string, string | undefined> = process.env,
): ExtractionConfiguration {
  const required = (key: string) => {
    const value = environment[key]?.trim();
    if (!value) throw new Error(`Missing OpenAI product configuration: ${key}`);
    return value;
  };
  const effort = environment.CHISAN_WHATSAPP_REASONING_EFFORT?.trim();
  const maxOutputTokens = Number(
    environment.CHISAN_WHATSAPP_MAX_OUTPUT_TOKENS?.trim() || 4096,
  );
  if (
    !Number.isInteger(maxOutputTokens) ||
    maxOutputTokens < 1024 ||
    maxOutputTokens > 16384
  )
    throw new Error("Invalid OpenAI product output token budget");
  return {
    apiKey: required("OPENAI_API_KEY"),
    model: required("CHISAN_WHATSAPP_MODEL"),
    reasoningEffort: effort ? reasoningEffortSchema.parse(effort) : undefined,
    maxOutputTokens,
  };
}

export function extractionProfile(
  configuration: ExtractionConfiguration,
): ProductExtractor["profile"] {
  return {
    provider: "openai",
    model: configuration.model,
    reasoningEffort: configuration.reasoningEffort ?? null,
    promptVersion: PRODUCT_EXTRACTION_PROMPT_VERSION,
    maxOutputTokens: configuration.maxOutputTokens,
  };
}

export function createOpenAIProductExtractor(
  configuration: ExtractionConfiguration,
  fetcher: typeof fetch = fetch,
): ProductExtractor {
  return {
    profile: extractionProfile(configuration),
    async extract(input) {
      const response = await fetcher("https://api.openai.com/v1/responses", {
        method: "POST",
        signal: AbortSignal.timeout(30_000),
        headers: {
          Authorization: `Bearer ${configuration.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: configuration.model,
          store: false,
          max_output_tokens: configuration.maxOutputTokens,
          ...(configuration.reasoningEffort
            ? { reasoning: { effort: configuration.reasoningEffort } }
            : {}),
          instructions: productExtractionInstructions(input),
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: JSON.stringify({
                    previous: input.previous,
                    previousNews: input.previousNews ?? null,
                    message: input.text,
                  }),
                },
                ...(input.image
                  ? [
                      {
                        type: "input_image",
                        detail: "high",
                        image_url: `data:image/jpeg;base64,${input.image.toString("base64")}`,
                      },
                    ]
                  : []),
              ],
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "chisan_product_candidate",
              strict: true,
              schema: z.toJSONSchema(productInterpretationOutputSchema),
            },
          },
        }),
      }).catch(() => { throw new ExtractionFailure("transport"); });
      const rawId = response.headers.get("x-request-id");
      const requestId = rawId && /^req_[a-f0-9-]{16,80}$/i.test(rawId) ? rawId : undefined;
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const knownCodes = ["invalid_api_key", "insufficient_permissions", "insufficient_quota", "rate_limit_exceeded", "model_not_found", "invalid_json_schema", "unsupported_value", "invalid_value"];
        const code = knownCodes.includes(body?.error?.code) ? body.error.code : undefined;
        throw new ExtractionFailure("provider_http", response.status, code, requestId);
      }
      if (!body || typeof body !== "object") throw new ExtractionFailure("provider_output", response.status, undefined, requestId);
      if (body.status !== "completed") {
        const reason = ["max_output_tokens", "content_filter"].includes(body.incomplete_details?.reason) ? body.incomplete_details.reason : undefined;
        throw new ExtractionFailure("provider_incomplete", response.status, reason, requestId);
      }
      if (!Array.isArray(body.output)) throw new ExtractionFailure("provider_output", response.status, undefined, requestId);
      const parts = (body.output ?? [])
        .filter((item: { type: string }) => item.type === "message")
        .flatMap(
          (item: { content: { type: string; text?: string }[] }) =>
            item.content,
        );
      if (parts.some((part: { type: string }) => part.type === "refusal"))
        throw new ExtractionFailure("provider_refusal", response.status, undefined, requestId);
      const output = parts
        .filter((part: { type: string }) => part.type === "output_text")
        .map((part: { text: string }) => part.text)
        .join("");

      try { return JSON.parse(output) as unknown; }
      catch { throw new ExtractionFailure("provider_output", response.status, undefined, requestId); }
    },
  };
}

// Preserve the previous callable API while keeping validation provider-neutral.
export function extractProduct(
  input: ExtractionInput,
  configuration: ExtractionConfiguration,
  fetcher: typeof fetch = fetch,
) {
  return extractProductCandidate(
    createOpenAIProductExtractor(configuration, fetcher),
    input,
  );
}
