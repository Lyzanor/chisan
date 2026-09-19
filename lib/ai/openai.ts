import { z } from "zod";
import { ExtractionFailure } from "./failure";
import type { StructuredAIProvider, StructuredAIRequest } from "./structured";
import { aiUsageSchema } from "./usage";

const reasoningEffortSchema = z.enum([
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
]);
export type OpenAIConfiguration = {
  apiKey: string;
  model: string;
  reasoningEffort?: z.infer<typeof reasoningEffortSchema>;
  maxOutputTokens: number;
};

export function openAIConfiguration(
  environment: Record<string, string | undefined> = process.env,
): OpenAIConfiguration {
  const required = (key: string) => {
    const value = environment[key]?.trim();
    if (!value) throw new Error(`Missing OpenAI configuration: ${key}`);
    return value;
  };
  const effort = (environment.CHISAN_AI_REASONING_EFFORT?.trim() || environment.CHISAN_WHATSAPP_REASONING_EFFORT?.trim());
  const maxOutputTokens = Number(
    (environment.CHISAN_AI_MAX_OUTPUT_TOKENS?.trim() || environment.CHISAN_WHATSAPP_MAX_OUTPUT_TOKENS?.trim()) || 4096,
  );
  if (
    !Number.isInteger(maxOutputTokens) ||
    maxOutputTokens < 1024 ||
    maxOutputTokens > 16384
  )
    throw new Error("Invalid OpenAI output token budget");
  return {
    apiKey: required("OPENAI_API_KEY"),
    model: environment.CHISAN_AI_MODEL?.trim() || required("CHISAN_WHATSAPP_MODEL"),
    reasoningEffort: effort ? reasoningEffortSchema.parse(effort) : undefined,
    maxOutputTokens,
  };
}

export function createOpenAIProvider(configuration: OpenAIConfiguration, fetcher: typeof fetch = fetch): StructuredAIProvider {
  return {
    profile: { provider: "openai", model: configuration.model, reasoningEffort: configuration.reasoningEffort ?? null, maxOutputTokens: configuration.maxOutputTokens },
    generate: (request) => requestOpenAIStructured(configuration, request, fetcher),
  };
}

/** Shared bounded transport; each domain owns its prompt, schema and validation. */
export async function requestOpenAIStructured(
  configuration: OpenAIConfiguration,
  input: StructuredAIRequest,
  fetcher: typeof fetch = fetch,
): ReturnType<StructuredAIProvider["generate"]> {
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
      instructions: input.instructions,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: input.text,
            },
            ...(input.image
              ? [
                  {
                    type: "input_image",
                    detail: "high",
                    image_url: `data:${input.image.mimeType};base64,${input.image.bytes.toString("base64")}`,
                  },
                ]
              : []),
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: input.name,
          strict: true,
          schema: input.schema,
        },
      },
    }),
  }).catch(() => { throw new ExtractionFailure("transport"); });
  const rawId = response.headers.get("x-request-id");
  const requestId = rawId && /^req_[a-f0-9-]{16,80}$/i.test(rawId) ? rawId : undefined;
  const body = await response.json().catch(() => null);
  const parsedUsage = aiUsageSchema.safeParse({
    inputTokens: body?.usage?.input_tokens, outputTokens: body?.usage?.output_tokens,
    totalTokens: body?.usage?.total_tokens,
    cachedInputTokens: body?.usage?.input_tokens_details?.cached_tokens ?? null,
    reasoningTokens: body?.usage?.output_tokens_details?.reasoning_tokens ?? null,
  });
  const usage = parsedUsage.success ? parsedUsage.data : null;
  if (!response.ok) {
    const knownCodes = ["invalid_api_key", "insufficient_permissions", "insufficient_quota", "rate_limit_exceeded", "model_not_found", "invalid_json_schema", "unsupported_value", "invalid_value"];
    const code = knownCodes.includes(body?.error?.code) ? body.error.code : undefined;
    throw new ExtractionFailure("provider_http", response.status, code, requestId, usage);
  }
  if (!body || typeof body !== "object") throw new ExtractionFailure("provider_output", response.status, undefined, requestId, usage);
  if (body.status !== "completed") {
    const reason = ["max_output_tokens", "content_filter"].includes(body.incomplete_details?.reason) ? body.incomplete_details.reason : undefined;
    throw new ExtractionFailure("provider_incomplete", response.status, reason, requestId, usage);
  }
  if (!Array.isArray(body.output)) throw new ExtractionFailure("provider_output", response.status, undefined, requestId, usage);
  const parts = (body.output ?? [])
    .filter((item: { type: string }) => item.type === "message")
    .flatMap(
      (item: { content: { type: string; text?: string }[] }) =>
        item.content,
    );
  if (parts.some((part: { type: string }) => part.type === "refusal"))
    throw new ExtractionFailure("provider_refusal", response.status, undefined, requestId, usage);
  const output = parts
    .filter((part: { type: string }) => part.type === "output_text")
    .map((part: { text: string }) => part.text)
    .join("");

  try { return { value: JSON.parse(output) as unknown, usage, ...(requestId ? { requestId } : {}) }; }
  catch { throw new ExtractionFailure("provider_output", response.status, undefined, requestId, usage); }
}
