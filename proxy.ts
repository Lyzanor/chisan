import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { isAccountAuthConfigured } from "@/lib/accounts/config";
import {
  resolveAreaCatalog,
  resolveCountryCatalog,
  resolveKnownCatalogScope,
  resolveProducerCatalog,
} from "@/lib/catalog-routing";
import { isCatalogScopeSegment } from "@/lib/i18n/catalog-scope";
import { CHISAN_REQUEST_PATH_HEADER } from "@/lib/request-path";

const GLOBAL_NOT_FOUND_TARGET = "/__chisan_not_found__/route/terminal/404";

function requestHeadersWithPath(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CHISAN_REQUEST_PATH_HEADER, request.nextUrl.pathname);
  return requestHeaders;
}

function rewriteToGlobalNotFound(request: NextRequest, requestHeaders: Headers) {
  const destination = request.nextUrl.clone();
  destination.pathname = GLOBAL_NOT_FOUND_TARGET;
  destination.search = "";
  return NextResponse.rewrite(destination, { request: { headers: requestHeaders } });
}

async function continueWithRequestPath(request: NextRequest) {
  const requestHeaders = requestHeadersWithPath(request);
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const catalog = segments[0] ?? "";
  if (!isCatalogScopeSegment(catalog) || segments.length > 3) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const knownScope = resolveKnownCatalogScope(catalog);
  if (!knownScope) {
    return rewriteToGlobalNotFound(request, requestHeaders);
  }

  if (segments.length === 1) {
    return resolveCountryCatalog(catalog)
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : rewriteToGlobalNotFound(request, requestHeaders);
  }

  if (segments.length === 3) {
    const producer = await resolveProducerCatalog(catalog, segments[1], segments[2]);
    if (!producer) return rewriteToGlobalNotFound(request, requestHeaders);
  } else if (!resolveAreaCatalog(catalog, segments[1])) {
    return rewriteToGlobalNotFound(request, requestHeaders);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

const handleClerkRequest = isAccountAuthConfigured()
  ? clerkMiddleware((_auth, request) => continueWithRequestPath(request))
  : null;

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!handleClerkRequest) {
    return await continueWithRequestPath(request);
  }

  // Proxy establishes Clerk's request context. Authorization and producer
  // ownership must still be checked inside every protected Server Action or
  // Route Handler.
  return handleClerkRequest(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
