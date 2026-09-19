import "server-only";
import { createOpenAIProvider, openAIConfiguration } from "./openai";
import { withAIAllowance, type StructuredAIProvider } from "./structured";
import type { Database } from "../db";
import { aiCallLimit, reserveAIAttempt } from "./allowance";
import { auditEvents } from "../db/schema";
import { aiRequestReportSchema } from "./usage";

function providerKey(environment: Record<string, string | undefined> = process.env) {
  return environment.CHISAN_AI_PROVIDER?.trim() || "openai";
}

// A single composition boundary, not a registry. Add an adapter here when a
// second provider is actually used; domain services and channels stay intact.
export function createAIProvider(database: Database, capability: string, environment: Record<string, string | undefined> = process.env,
  target: { type: string; id: string } = { type: "ai_capability", id: capability }): StructuredAIProvider {
  if (providerKey(environment) !== "openai") throw new Error("Unsupported Chisan AI provider");
  const provider = createOpenAIProvider(openAIConfiguration(environment));
  return withAIAllowance(provider, () => reserveAIAttempt(database, aiCallLimit(environment), capability), async (report) => {
    await database.insert(auditEvents).values({ actorKind: "system", actorKey: "chisan-ai",
      action: `ai.request_${report.outcome}`, targetType: target.type, targetId: target.id,
      metadata: { ...aiRequestReportSchema.parse(report), capability } });
  });
}

export function aiProviderLabel(environment: Record<string, string | undefined> = process.env) {
  if (providerKey(environment) === "openai") return "OpenAI";
  throw new Error("Unsupported Chisan AI provider");
}
