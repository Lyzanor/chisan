// This adapter follows the 2026-09-05 W3C draft (document.modelContext).
// navigator.modelContext + unregisterTool supports earlier Chromium previews.
export type CatalogToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};
type Tool = CatalogToolDefinition & {
  annotations: {
    readOnlyHint: boolean;
    untrustedContentHint: boolean;
    consequentialHint: boolean;
  };
  execute: (
    input: Record<string, unknown>,
    options?: { signal?: AbortSignal },
  ) => Promise<unknown>;
};
export type ModelContext = {
  registerTool: (
    tool: Tool,
    options?: { signal: AbortSignal },
  ) => void | Promise<void>;
  unregisterTool?: (name: string) => void | Promise<void>;
};

export function findModelContext(
  document: { modelContext?: ModelContext },
  navigator: { modelContext?: ModelContext },
) {
  if (typeof document.modelContext?.registerTool === "function")
    return document.modelContext;
  if (typeof navigator.modelContext?.registerTool === "function")
    return navigator.modelContext;
  return null;
}

export function catalogToolPath(name: string, input: Record<string, unknown>) {
  const args = { ...input };
  let path: string;
  if (name === "chisan_catalog") path = "/api/catalog/v1";
  else if (name === "chisan_search_producers")
    path = "/api/catalog/v1/producers";
  else if (name === "chisan_get_producer") {
    if (
      typeof args.country !== "string" ||
      !/^[a-z]{2}$/.test(args.country) ||
      typeof args.producer_id !== "number" ||
      !Number.isSafeInteger(args.producer_id) ||
      args.producer_id < 1
    )
      throw new Error("A valid country and numeric producer_id are required.");
    path = `/api/catalog/v1/producers/${args.country}/${args.producer_id}`;
    delete args.country;
    delete args.producer_id;
  } else throw new Error("Unknown Chisan tool.");
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(args)) {
    if (typeof value !== "string" && typeof value !== "number")
      throw new Error("Tool parameters must be strings or numbers.");
    query.set(key, String(value));
  }
  return query.size ? `${path}?${query}` : path;
}

// Serialize setup/cleanup per context, including async registration and React
// Strict Mode remounts. Never clear tools belonging to another integration.
const lifecycle = new WeakMap<ModelContext, Promise<void>>();
export function registerCatalogTools(
  context: ModelContext,
  definitions: readonly CatalogToolDefinition[],
  fetcher: typeof fetch = fetch,
) {
  const controller = new AbortController();
  const registered: string[] = [];
  const report = () => {
    console.warn(
      "Chisan WebMCP registration unavailable; the public JSON API remains available.",
    );
  };
  const registration = (lifecycle.get(context) ?? Promise.resolve()).then(
    async () => {
      for (const definition of definitions) {
        if (controller.signal.aborted) break;
        try {
          await context.registerTool(
            {
              ...definition,
              annotations: {
                readOnlyHint: true,
                untrustedContentHint: true,
                consequentialHint: false,
              },
              execute: async (input, options) => {
                if (!input || typeof input !== "object" || Array.isArray(input))
                  throw new Error("Tool input must be an object.");
                const signal = options?.signal
                  ? AbortSignal.any([controller.signal, options.signal])
                  : controller.signal;
                signal.throwIfAborted();
                const response = await fetcher(
                  catalogToolPath(definition.name, input),
                  {
                    credentials: "omit",
                    headers: { Accept: "application/json" },
                    signal,
                  },
                );
                const result = await response.json();
                if (!response.ok)
                  throw new Error(
                    result.error?.message ?? "Public catalog request failed.",
                  );
                return result;
              },
            },
            { signal: controller.signal },
          );
          registered.push(definition.name);
        } catch {
          if (!controller.signal.aborted) report();
        }
      }
    },
  );
  lifecycle.set(context, registration);
  return () => {
    controller.abort();
    const cleanup = registration.then(async () => {
      if (context.unregisterTool)
        for (const name of registered) {
          try {
            await context.unregisterTool(name);
          } catch {
            report();
          }
        }
    });
    lifecycle.set(context, cleanup);
  };
}
