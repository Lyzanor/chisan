import { clerkMiddleware } from "@clerk/nextjs/server";
import {
  NextResponse,
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
} from "next/server";

import { isAccountAuthConfigured } from "@/lib/accounts/config";
import {
  resolveAreaCatalog,
  resolveCountryCatalog,
  resolveProducerCatalog,
} from "@/lib/catalog-routing";
import {
  catalogPathSegments,
  needsClerkRequestContext,
} from "@/lib/proxy-scope";
import { CHISAN_REQUEST_PATH_HEADER } from "@/lib/request-path";

const GLOBAL_NOT_FOUND_TARGET = "/__chisan_not_found__/route/terminal/404";

function rewriteToGlobalNotFound(request: NextRequest, requestHeaders: Headers) {
  const destination = request.nextUrl.clone();
  destination.pathname = GLOBAL_NOT_FOUND_TARGET;
  destination.search = "";
  return NextResponse.rewrite(destination, { request: { headers: requestHeaders } });
}

async function continueRequest(request: NextRequest) {
  const segments = catalogPathSegments(request.nextUrl.pathname);
  if (!segments) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CHISAN_REQUEST_PATH_HEADER, request.nextUrl.pathname);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const catalog = segments[0] ?? "";
  if (segments.length === 1) {
    return resolveCountryCatalog(catalog)
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : rewriteToGlobalNotFound(request, requestHeaders);
  }

  if (segments.length === 2) {
    return resolveAreaCatalog(catalog, segments[1])
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : rewriteToGlobalNotFound(request, requestHeaders);
  }

  const producer = await resolveProducerCatalog(catalog, segments[1], segments[2]);
  if (!producer) return rewriteToGlobalNotFound(request, requestHeaders);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

let handleClerkRequest: NextMiddleware | null = null;

function getClerkRequestHandler(): NextMiddleware | null {
  if (handleClerkRequest) return handleClerkRequest;
  if (!isAccountAuthConfigured()) return null;

  handleClerkRequest = clerkMiddleware((_auth, request) =>
    continueRequest(request),
  );
  return handleClerkRequest;
}

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!needsClerkRequestContext(request.nextUrl.pathname)) {
    return continueRequest(request);
  }

  const clerkRequestHandler = getClerkRequestHandler();
  if (!clerkRequestHandler) return continueRequest(request);

  // Authorization and producer ownership must still be checked inside every
  // protected Server Action or Route Handler.
  return clerkRequestHandler(request, event);
}

export const config = {
  matcher: [
    "/acceso/:path*",
    "/registro/:path*",
    "/cuenta/:path*",
    "/admin/:path*",
    "/api",
    "/api/((?!catalog-redirect(?:/|$)).*)",
    "/trpc/:path*",
    "/((?:[a-z]{2}|[a-z]{2,3}-[a-z]{2})(?:/[^/.]+){0,2})",
  ],
};
