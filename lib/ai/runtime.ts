import "server-only";
import { createOpenAIProvider, openAIConfiguration } from "./openai";
import { withAIAllowance, type StructuredAIProvider } from "./structured";
import type { Database } from "../db";
import { aiCallLimit, reserveAIAttempt } from "./allowance";

function providerKey(environment = process.env) {
  return environment.CHISAN_AI_PROVIDER?.trim() || "openai";
}

// A single composition boundary, not a registry. Add an adapter here when a
// second provider is actually used; domain services and channels stay intact.
export function createAIProvider(database: Database, capability: string, environment = process.env): StructuredAIProvider {
  if (providerKey(environment) !== "openai") throw new Error("Unsupported Chisan AI provider");
  const provider = createOpenAIProvider(openAIConfiguration(environment));
  return withAIAllowance(provider, () => reserveAIAttempt(database, aiCallLimit(environment), capability));
}

export function aiProviderLabel(environment = process.env) {
  if (providerKey(environment) === "openai") return "OpenAI";
  throw new Error("Unsupported Chisan AI provider");
}
