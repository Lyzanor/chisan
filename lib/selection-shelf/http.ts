import { z } from "zod";
import { ProducerImageError } from "../accounts/prepare-producer-image";
import { SHELF_LIMITS, ShelfError, shelfInputSchema } from "./policy";
import type { createSelectionShelfService } from "./service";

const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
  "Cross-Origin-Resource-Policy": "same-origin",
  Vary: "Cookie",
};
type Dependencies = {
  enabled: () => boolean;
  account: () => Promise<{ id: string; termsAcceptedAt: Date | null } | null>;
  service: () => ReturnType<typeof createSelectionShelfService>;
  schedule: (id: string) => void;
};
const reply = (error: string, status: number) => Response.json({ error }, { status, headers });

export async function readShelfBody(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit) throw new ProducerImageError("size");
  if (!request.body) throw new ProducerImageError("invalid");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.length;
      if (length > limit) { await reader.cancel(); throw new ProducerImageError("size"); }
      chunks.push(chunk.value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks);
}

export function createShelfMutationHandler(deps: Dependencies, operation: "upload" | "review" | "withdraw" | "publish" | "correct" | "search" | "event" | "export-event") {
  return async (request: Request) => {
    if (!deps.enabled()) return reply("unavailable", 503);
    const url = new URL(request.url);
    const origin = `${request.headers.get("x-forwarded-proto") ?? url.protocol.slice(0, -1)}://${request.headers.get("host") ?? url.host}`;
    if (request.headers.get("origin") !== origin || request.headers.get("x-chisan-shelf") !== "1") return reply("access", 403);
    try {
      const account = await deps.account();
      if (!account?.termsAcceptedAt) return reply("access", 401);
      const service = deps.service();
      if (operation === "upload") {
        if (request.headers.get("x-chisan-shelf-consent") !== "1") return reply("consent", 422);
        const context = request.headers.get("x-chisan-image-context");
        if (context && context.length > 7000) return reply("invalid", 422);
        const input = context ? shelfInputSchema.parse(JSON.parse(decodeURIComponent(context))) : undefined;
        const requestId = request.headers.get("x-chisan-shelf-request");
        if (requestId && !z.uuid().safeParse(requestId).success) return reply("invalid", 422);
        const id = await service.submit(account.id, await readShelfBody(request, SHELF_LIMITS.inputBytes), "web", requestId ?? undefined, input);
        deps.schedule(id);
        return Response.json({ id }, { status: 202, headers });
      }
      const raw = JSON.parse((await readShelfBody(request, 40_000)).toString("utf8"));
      if (operation === "withdraw") {
        const { id } = z.object({ id: z.uuid() }).strict().parse(raw);
        await service.withdraw(account.id, id);
        return Response.json({ ok: true }, { headers });
      }
      if (operation === "event") return Response.json(await service.requestEvent(account.id, raw), { headers });
      if (operation === "export-event") return Response.json(await service.exportEvent(account.id, raw), { headers });
      if (operation === "search") {
        const { id, query } = z.object({ id: z.uuid(), query: z.string().max(100) }).strict().parse(raw);
        return Response.json({ candidates: await service.search(account.id, id, query) }, { headers });
      }
      if (operation === "correct") return Response.json(await service.correct(account.id, raw), { headers });
      const result = operation === "publish" ? await service.publish(account.id, raw) : await service.review(account.id, raw);
      if (operation === "review" && raw.action === "analyze") deps.schedule(raw.id);
      return Response.json(result, { headers });
    } catch (error) {
      if (error instanceof ShelfError) return reply(error.code, ({ access: 403, missing: 404, changed: 409, selection: 422, quota: 429, budget: 429, invalid: 422, profile: 422 })[error.code]);
      if (error instanceof ProducerImageError) return reply(error.code, error.code === "size" ? 413 : 422);
      if (error instanceof z.ZodError || error instanceof SyntaxError || error instanceof URIError) return reply("invalid", 422);
      return reply("unavailable", 503);
    }
  };
}

export function createShelfImageHandler(deps: Pick<Dependencies, "enabled" | "account" | "service">) {
  return async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const missing = () => new Response(null, { status: 404, headers });
    const { id } = await params;
    if (!deps.enabled() || !z.uuid().safeParse(id).success) return missing();
    try {
      const service = deps.service();
      let bytes = await service.readImage(id);
      if (!bytes) {
        const account = await deps.account();
        if (account) bytes = await service.readImage(id, account.id);
      }
      return bytes ? new Response(new Uint8Array(bytes), { headers: { ...headers, "Content-Type": "image/webp" } }) : missing();
    } catch { return missing(); }
  };
}
