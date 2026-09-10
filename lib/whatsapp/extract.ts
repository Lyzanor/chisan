// Compatibility entry point. Runtime composition selects the actual adapter.
export {
  extractProduct,
  extractionProfile,
  type ExtractionConfiguration,
} from "../intake/openai";
export {
  PRODUCT_EXTRACTION_PROMPT_VERSION,
  type ExtractionInput,
} from "../intake/extractor";
