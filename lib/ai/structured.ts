import { ExtractionFailure, extractionFailureDetails } from "./failure";
import type { AIUsage, AIRequestReport } from "./usage";

/** Provider-neutral request shared by Chisan's structured AI capabilities.
 * Domain services own prompts, schemas, validation, authorization and review.
 * Providers never receive database handles or executable tools.
 */
export type StructuredAIRequest = {
  name: string;
  instructions: string;
  text: string;
  schema: Record<string, unknown>;
  image?: { bytes: Buffer; mimeType: "image/jpeg" | "image/png" | "image/webp" };
};

export type StructuredAIProvider = {
  profile: { provider: string; model: string; reasoningEffort: string | null; maxOutputTokens: number };
  generate(request: StructuredAIRequest): Promise<{ value: unknown; usage: AIUsage | null; requestId?: string }>;
};

/** Reserve outside the provider request, once, including failed requests. */
export function withAIAllowance(provider: StructuredAIProvider, reserve: () => Promise<void>, record?: (report: AIRequestReport) => Promise<void>): StructuredAIProvider {
  return {
    profile: provider.profile,
    async generate(request) {
      await reserve();
      const started = Date.now();
      let result: Awaited<ReturnType<StructuredAIProvider["generate"]>>;
      try { result = await provider.generate(request); }
      catch (error) {
        await record?.({ ...provider.profile, outcome: "failed", durationMs: Date.now() - started,
          usage: error instanceof ExtractionFailure ? error.usage ?? null : null, failure: extractionFailureDetails(error) });
        throw error;
      }
      await record?.({ ...provider.profile, outcome: "completed", durationMs: Date.now() - started,
        usage: result.usage, ...(result.requestId ? { requestId: result.requestId } : {}) });
      return result;
    },
  };
}
