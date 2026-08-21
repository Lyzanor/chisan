import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { isAccountAuthConfigured } from "@/lib/accounts/config";

const handleClerkRequest = isAccountAuthConfigured() ? clerkMiddleware() : null;

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!handleClerkRequest) {
    return NextResponse.next();
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
