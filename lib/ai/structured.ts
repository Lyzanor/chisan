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
  generate(request: StructuredAIRequest): Promise<unknown>;
};

/** Reserve outside the provider request, once, including failed requests. */
export function withAIAllowance(provider: StructuredAIProvider, reserve: () => Promise<void>): StructuredAIProvider {
  return {
    profile: provider.profile,
    async generate(request) {
      await reserve();
      return provider.generate(request);
    },
  };
}
