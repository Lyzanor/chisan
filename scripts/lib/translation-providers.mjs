const DEFAULT_LM_STUDIO_BASE_URL = "http://127.0.0.1:1234/v1";
const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_BASE_MS = 500;
const MAX_RETRIES = 5;
const MAX_RETRY_DELAY_MS = 10_000;
const REASONING_EFFORTS = new Set(["none", "minimal", "low", "medium", "high", "xhigh"]);

export const OPENAI_COMPATIBLE_RESPONSE_SCHEMA = Object.freeze({
  type: "object",
  additionalProperties: false,
  properties: {
    translations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string", minLength: 1 },
          text: { type: "string", minLength: 1 },
        },
        required: ["id", "text"],
      },
    },
  },
  required: ["translations"],
});

function responseSchemaForEntries(entries) {
  const ids = entries.map(({ id }) => id);
  if (ids.length === 0 || new Set(ids).size !== ids.length) {
    throw new Error("openai-compatible batches require unique non-empty entry ids");
  }

  return {
    ...OPENAI_COMPATIBLE_RESPONSE_SCHEMA,
    properties: {
      ...OPENAI_COMPATIBLE_RESPONSE_SCHEMA.properties,
      translations: {
        ...OPENAI_COMPATIBLE_RESPONSE_SCHEMA.properties.translations,
        minItems: ids.length,
        maxItems: ids.length,
        items: {
          ...OPENAI_COMPATIBLE_RESPONSE_SCHEMA.properties.translations.items,
          properties: {
            ...OPENAI_COMPATIBLE_RESPONSE_SCHEMA.properties.translations.items.properties,
            id: { type: "string", enum: ids },
          },
        },
      },
    },
  };
}

function positiveInteger(value, label, fallback) {
  if (value === undefined || value === "") return fallback;
  if (!/^[1-9]\d*$/.test(String(value))) {
    throw new Error(`${label} must be a positive integer`);
  }
  return Number(value);
}

function boundedNonNegativeInteger(value, label, fallback, maximum) {
  if (value === undefined || value === "") return fallback;
  if (!/^\d+$/.test(String(value)) || Number(value) > maximum) {
    throw new Error(`${label} must be an integer between 0 and ${maximum}`);
  }
  return Number(value);
}

function completionsUrl(baseUrl) {
  const url = new URL(baseUrl);
  if (!/^https?:$/.test(url.protocol)) {
    throw new Error("CHISAN_TRANSLATION_BASE_URL must use http or https");
  }
  url.pathname = url.pathname.replace(/\/+$/, "");
  if (!url.pathname.endsWith("/chat/completions")) {
    url.pathname = `${url.pathname}/chat/completions`;
  }
  return url.toString();
}

export function readOpenAICompatibleConfig(env = process.env) {
  const model = String(env.CHISAN_TRANSLATION_MODEL ?? "").trim();
  if (!model) {
    throw new Error(
      "CHISAN_TRANSLATION_MODEL is required (LM Studio may use the identifier of its loaded model)",
    );
  }

  const baseUrl = String(
    env.CHISAN_TRANSLATION_BASE_URL ?? DEFAULT_LM_STUDIO_BASE_URL,
  ).trim();
  const apiKey = String(env.CHISAN_TRANSLATION_API_KEY ?? "").trim();
  const engineVersion = String(env.CHISAN_TRANSLATION_ENGINE_VERSION ?? model).trim();
  if (!engineVersion) throw new Error("CHISAN_TRANSLATION_ENGINE_VERSION must not be empty");
  const reasoningEffort = String(env.CHISAN_TRANSLATION_REASONING_EFFORT ?? "").trim();
  if (reasoningEffort && !REASONING_EFFORTS.has(reasoningEffort)) {
    throw new Error(
      "CHISAN_TRANSLATION_REASONING_EFFORT must be none, minimal, low, medium, high or xhigh",
    );
  }

  return {
    endpoint: completionsUrl(baseUrl),
    apiKey,
    model,
    engine: "openai-compatible",
    engineVersion,
    reasoningEffort,
    timeoutMs: positiveInteger(
      env.CHISAN_TRANSLATION_TIMEOUT_MS,
      "CHISAN_TRANSLATION_TIMEOUT_MS",
      DEFAULT_TIMEOUT_MS,
    ),
    maxRetries: boundedNonNegativeInteger(
      env.CHISAN_TRANSLATION_MAX_RETRIES,
      "CHISAN_TRANSLATION_MAX_RETRIES",
      DEFAULT_MAX_RETRIES,
      MAX_RETRIES,
    ),
    retryBaseMs: boundedNonNegativeInteger(
      env.CHISAN_TRANSLATION_RETRY_BASE_MS,
      "CHISAN_TRANSLATION_RETRY_BASE_MS",
      DEFAULT_RETRY_BASE_MS,
      MAX_RETRY_DELAY_MS,
    ),
  };
}

function parseResponseContent(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (content && typeof content === "object") return content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("openai-compatible response did not contain message.content");
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("openai-compatible response content was not valid JSON");
  }
}

function isRetryableStatus(status) {
  return status === 429 || (status >= 500 && status <= 599);
}

function retryDelayMs(response, attempt, baseMs) {
  const retryAfter = response.headers?.get?.("retry-after");
  if (retryAfter && /^\d+(?:\.\d+)?$/.test(retryAfter)) {
    return Math.min(Math.ceil(Number(retryAfter) * 1_000), MAX_RETRY_DELAY_MS);
  }
  return Math.min(baseMs * 2 ** attempt, MAX_RETRY_DELAY_MS);
}

const defaultSleep = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export function createOpenAICompatibleAdapter({
  env = process.env,
  fetchImpl = globalThis.fetch,
  sleepImpl = defaultSleep,
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("A fetch implementation is required");
  if (typeof sleepImpl !== "function") throw new Error("A sleep implementation is required");
  const config = readOpenAICompatibleConfig(env);

  return {
    engine: config.engine,
    model: config.model,
    engineVersion: config.engineVersion,
    /**
     * @param {{
     *   systemPrompt: string,
     *   targetLocale: string,
     *   entries: Array<{id: string, sourceLocale: string, text: string}>,
     *   glossary: {
     *     localeInstructions: Record<string, string>,
     *     protectedTerms: string[],
     *   },
     *   repair?: {
     *     previousText: string | null,
     *     validationError: string,
     *   } | null,
     * }} request
     */
    async translate({ systemPrompt, targetLocale, entries, glossary, repair = null }) {
      const headers = { "content-type": "application/json" };
      if (config.apiKey) headers.authorization = `Bearer ${config.apiKey}`;
      const body = JSON.stringify({
        model: config.model,
        temperature: 0,
        ...(config.reasoningEffort
          ? { reasoning_effort: config.reasoningEffort }
          : {}),
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              target_locale: targetLocale,
              locale_instruction: glossary.localeInstructions[targetLocale] ?? "",
              protected_terms: glossary.protectedTerms,
              entries: entries.map(({ id, sourceLocale, text }) => ({
                id,
                source_locale: sourceLocale,
                text,
              })),
              ...(repair
                ? {
                    repair_context: {
                      previous_text: repair.previousText,
                      validation_error: repair.validationError,
                    },
                  }
                : {}),
            }),
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "chisan_catalog_translations",
            strict: true,
            schema: responseSchemaForEntries(entries),
          },
        },
      });

      for (let attempt = 0; attempt <= config.maxRetries; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
        let response;
        try {
          response = await fetchImpl(config.endpoint, {
            method: "POST",
            headers,
            signal: controller.signal,
            body,
          });
        } catch (error) {
          if (error?.name === "AbortError") {
            throw new Error(`openai-compatible request timed out after ${config.timeoutMs} ms`);
          }
          // Network and client errors are not safely classifiable as provider
          // throttling/transience, so the editorial command fails immediately.
          throw error;
        } finally {
          clearTimeout(timeout);
        }

        if (response.ok) return parseResponseContent(await response.json());
        if (!isRetryableStatus(response.status) || attempt === config.maxRetries) {
          throw new Error(`openai-compatible request failed with HTTP ${response.status}`);
        }
        await sleepImpl(retryDelayMs(response, attempt, config.retryBaseMs));
      }

      throw new Error("openai-compatible request exhausted its retry budget");
    },
  };
}

// Tests inject this adapter directly. It never reads environment variables or
// performs network I/O, which keeps fixture generation visibly separate from
// editorial provider configuration.
/**
 * @param {{
 *   translations?: Record<string, string>,
 *   handler?: (request: any, callIndex: number) => any,
 *   engine?: string,
 *   model?: string,
 *   engineVersion?: string,
 * }} [options]
 */
export function createFixtureTranslationAdapter({
  translations = {},
  handler,
  engine = "fixture",
  model = "fixture-model",
  engineVersion = "fixture-v1",
} = {}) {
  const calls = [];

  return {
    engine,
    model,
    engineVersion,
    calls,
    async translate(request) {
      calls.push(structuredClone(request));
      if (handler) return handler(request, calls.length - 1);
      return {
        translations: request.entries.map((entry) => {
          const value = translations[entry.id];
          if (typeof value !== "string") {
            throw new Error(`fixture adapter has no translation for '${entry.id}'`);
          }
          return { id: entry.id, text: value };
        }),
      };
    },
  };
}
