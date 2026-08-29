import { buildAdSenseAdsTxt } from "@/lib/programmatic-ads";

export const dynamic = "force-static";

export function GET() {
  const content = buildAdSenseAdsTxt();

  if (!content) {
    return new Response("Not found\n", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(content, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=86400",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
