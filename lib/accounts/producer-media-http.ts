import { and, eq, ne, sql } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { producerChangeRequests, producerMediaUploads } from "@/lib/db/schema";
import { MediaAccessError, uploadProducerMedia } from "./producer-media";
import { ProducerImageError } from "./prepare-producer-image";
import { PRODUCER_MEDIA_LIMITS } from "./producer-media-policy";
export type MediaHttpDependencies = {
  getCurrentAccount: () => Promise<{ id: string } | null>;
  hasProducerAccess: (
    userId: string,
    country: string,
    producerId: number,
  ) => Promise<boolean>;
  hasStaffAccess: (userId: string) => Promise<boolean>;
  hasActiveProducerPremiumEntitlement: (
    country: string,
    producerId: number,
  ) => Promise<boolean>;
  isProducerChangeSubmissionEnabled: () => boolean;
  findProducerById: (country: string, producerId: number) => Promise<unknown>;
  getDatabase: () => Database;
};
const reply = (code: string, status: number) =>
  Response.json(
    { error: code },
    { status, headers: { "Cache-Control": "private, no-store" } },
  );

export function createProducerMediaUploadHandler(
  dependencies: MediaHttpDependencies,
) {
  const {
    getCurrentAccount,
    hasProducerAccess,
    hasActiveProducerPremiumEntitlement,
    isProducerChangeSubmissionEnabled,
    findProducerById,
    getDatabase,
  } = dependencies;
  return async function POST(request: Request) {
    const url = new URL(request.url);
    // Next may normalize request.url to localhost behind a proxy. The browser's
    // Origin must match the actual Host (including port), never an arbitrary
    // forwarded host. Host cannot be changed by a cross-origin browser request.
    const host = request.headers.get("host") ?? url.host;
    const scheme =
      request.headers.get("x-forwarded-proto") ?? url.protocol.slice(0, -1);
    const expectedOrigin = `${scheme}://${host}`;
    if (
      request.headers.get("origin") !== expectedOrigin ||
      request.headers.get("x-chisan-media-rights") !== "confirmed"
    )
      return reply("rights", 403);
    if (!isProducerChangeSubmissionEnabled()) return reply("paused", 503);
    const country = url.searchParams.get("country") ?? "";
    const producerId = Number(url.searchParams.get("producerId"));
    if (
      !/^[a-z]{2}$/.test(country) ||
      !Number.isSafeInteger(producerId) ||
      producerId <= 0
    )
      return reply("access", 404);
    const account = await getCurrentAccount();
    if (!account) return reply("access", 401);
    if (
      !(await hasProducerAccess(account.id, country, producerId)) ||
      !(await hasActiveProducerPremiumEntitlement(country, producerId))
    )
      return reply("access", 403);
    if (!(await findProducerById(country, producerId)))
      return reply("access", 404);
    const length = Number(request.headers.get("content-length"));
    if (length > PRODUCER_MEDIA_LIMITS.inputBytes) return reply("size", 413);
    if (!request.body) return reply("invalid", 400);
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > PRODUCER_MEDIA_LIMITS.inputBytes) {
          await reader.cancel();
          return reply("size", 413);
        }
        chunks.push(value);
      }
      const uploaded = await uploadProducerMedia(
        getDatabase(),
        { userId: account.id, country, producerId },
        Buffer.concat(chunks),
      );
      return Response.json(uploaded, {
        status: 201,
        headers: { "Cache-Control": "private, no-store" },
      });
    } catch (error) {
      if (error instanceof ProducerImageError) return reply(error.code, 422);
      if (error instanceof MediaAccessError)
        return reply(error.code, error.code === "quota" ? 429 : 403);
      return reply("unavailable", 503);
    }
  };
}

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
  "Cross-Origin-Resource-Policy": "same-origin",
  Vary: "Cookie",
};
export function createProducerMediaPreviewHandler(
  dependencies: MediaHttpDependencies,
) {
  const { getCurrentAccount, hasProducerAccess, hasStaffAccess, getDatabase } =
    dependencies;
  return async function GET(
    _request: Request,
    { params }: { params: Promise<{ uploadId: string }> },
  ) {
    const { uploadId } = await params;
    const missing = () =>
      new Response(null, { status: 404, headers: privateHeaders });
    if (
      !/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
        uploadId,
      )
    )
      return missing();
    const account = await getCurrentAccount();
    if (!account) return missing();
    const db = getDatabase();
    const [metadata] = await db
      .select({
        author: producerMediaUploads.authorUserId,
        country: producerMediaUploads.country,
        producerId: producerMediaUploads.producerId,
      })
      .from(producerMediaUploads)
      .where(eq(producerMediaUploads.id, uploadId))
      .limit(1);
    if (!metadata) return missing();
    const author =
      metadata.author === account.id &&
      (await hasProducerAccess(
        account.id,
        metadata.country,
        metadata.producerId,
      ));
    if (!author) {
      if (!(await hasStaffAccess(account.id))) return missing();
      const [proposal] = await db
        .select({ id: producerChangeRequests.id })
        .from(producerChangeRequests)
        .where(
          and(
            ne(producerChangeRequests.status, "draft"),
            sql`${producerChangeRequests.contentChange}->'uploads' @> ${JSON.stringify([{ uploadId }])}::jsonb`,
          ),
        )
        .limit(1);
      if (!proposal) return missing();
    }
    const [image] = await db
      .select({ bytes: producerMediaUploads.bytes })
      .from(producerMediaUploads)
      .where(eq(producerMediaUploads.id, uploadId))
      .limit(1);
    return image
      ? new Response(new Uint8Array(image.bytes), {
          headers: { ...privateHeaders, "Content-Type": "image/webp" },
        })
      : missing();
  };
}
