// Compatibility entry point. The same accumulated allowance now serves all AI capabilities.
export { aiCallLimit as extractionCallLimit, reserveAIAttempt as reserveExtraction, AIAllowanceExhausted as WhatsAppBudgetExhausted } from "../ai/allowance";
import type { ProductExtractor } from "../intake/extractor";

export function withExtractionAllowance(
  extractor: ProductExtractor,
  reserve: () => Promise<void>,
): ProductExtractor {
  return {
    profile: extractor.profile,
    async extract(input) {
      await reserve();
      return extractor.extract(input);
    },
  };
}
