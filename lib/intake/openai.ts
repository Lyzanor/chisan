// Compatibility adapter for the original product-intake API.
import { createOpenAIProvider, type OpenAIConfiguration } from "../ai/openai";
import { createProductExtractor, extractProductCandidate, type ExtractionInput } from "./extractor";
export { openAIConfiguration as openAIProductConfig } from "../ai/openai";
export type { OpenAIConfiguration as ExtractionConfiguration } from "../ai/openai";

export function createOpenAIProductExtractor(configuration: OpenAIConfiguration, fetcher: typeof fetch = fetch) {
  return createProductExtractor(createOpenAIProvider(configuration, fetcher));
}
export function extractionProfile(configuration: OpenAIConfiguration) {
  return createOpenAIProductExtractor(configuration).profile;
}
export function extractProduct(input: ExtractionInput, configuration: OpenAIConfiguration, fetcher: typeof fetch = fetch) {
  return extractProductCandidate(createOpenAIProductExtractor(configuration, fetcher), input);
}
