import { and, eq, inArray, or } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { userPresentation, users } from "@/lib/db/schema";
import {
  AvatarImageError,
  AVATAR_INPUT_BYTES,
  readAvatarBody,
} from "./avatar-image";
import { replaceUserAvatar, UserPresentationError } from "./user-presentation";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
  "Cross-Origin-Resource-Policy": "same-origin",
  Vary: "Cookie",
};
type Dependencies = {
  isEnabled?: () => boolean;
  getDatabase: () => Database;
  getCurrentAccount: () => Promise<{ id: string } | null>;
};
export function createAvatarMutationHandler(deps: Dependencies) {
  return async (request: Request) => {
    const url = new URL(request.url);
    const expectedOrigin = `${request.headers.get("x-forwarded-proto") ?? url.protocol.slice(0, -1)}://${request.headers.get("host") ?? url.host}`;
    const reply = (error: string, status: number) =>
      Response.json({ error }, { status, headers: privateHeaders });
    if (deps.isEnabled && !deps.isEnabled()) return reply("unavailable", 503);
    if (
      request.headers.get("origin") !== expectedOrigin ||
      request.headers.get("x-chisan-avatar") !== "1"
    )
      return reply("access", 403);
    try {
      const account = await deps.getCurrentAccount();
      if (!account) return reply("access", 401);
      if (Number(request.headers.get("content-length")) > AVATAR_INPUT_BYTES)
        return reply("size", 413);
      if (request.method !== "DELETE" && !request.body)
        return reply("invalid", 400);
      const bytes =
        request.method === "DELETE"
          ? null
          : await readAvatarBody(request.body!);
      const result = await replaceUserAvatar(
        deps.getDatabase(),
        account.id,
        bytes,
      );
      return Response.json(result, { headers: privateHeaders });
    } catch (error) {
      if (error instanceof AvatarImageError) return reply(error.message, 422);
      if (error instanceof UserPresentationError)
        return reply(error.code, error.code === "quota" ? 429 : 403);
      return reply("unavailable", 503);
    }
  };
}
export function createAvatarReadHandler(deps: Dependencies) {
  return async (
    _request: Request,
    { params }: { params: Promise<{ avatarId: string }> },
  ) => {
    const { avatarId } = await params;
    const missing = () =>
      new Response(null, { status: 404, headers: privateHeaders });
    if (deps.isEnabled && !deps.isEnabled()) return missing();
    if (
      !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
        avatarId,
      )
    )
      return missing();
    try {
      const db = deps.getDatabase();
      const identity = and(
        eq(userPresentation.avatarId, avatarId),
        eq(users.status, "active"),
      );
      const query = (viewerId?: string) =>
        db
          .select({ bytes: userPresentation.avatarBytes })
          .from(userPresentation)
          .innerJoin(users, eq(users.id, userPresentation.userId))
          .where(
            and(
              identity,
              or(
                eq(userPresentation.favoritesAttributionEnabled, true),
                inArray(users.publicProfileVisibility, ["public", "unlisted"]),
                viewerId ? eq(users.id, viewerId) : undefined,
              ),
            ),
          )
          .limit(1);
      let [avatar] = await query();
      if (!avatar) {
        const account = await deps.getCurrentAccount();
        if (account) [avatar] = await query(account.id);
      }
      return avatar?.bytes
        ? new Response(new Uint8Array(avatar.bytes), {
            headers: { ...privateHeaders, "Content-Type": "image/webp" },
          })
        : missing();
    } catch {
      return missing();
    }
  };
}
