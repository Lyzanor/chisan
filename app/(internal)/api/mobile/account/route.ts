import { NextResponse } from "next/server";
import { AccountAuthorizationError, getCurrentAccount } from "@/lib/accounts/auth";
import { isAccountSystemConfigured } from "@/lib/accounts/config";

export const dynamic = "force-dynamic";

// Clerk's middleware validates the native Bearer session. Local account status
// remains authoritative, including suspended/deleted accounts and tombstones.
export async function GET() {
  const headers = { "Cache-Control": "private, no-store", "Vary": "Authorization, Cookie" };
  if (!isAccountSystemConfigured()) return NextResponse.json({ error: "unavailable" }, { status: 503, headers });
  try {
    const account = await getCurrentAccount();
    if (!account) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers });
    return NextResponse.json({ status: "active" }, { headers });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AccountAuthorizationError ? "inactive" : "unavailable" }, {
      status: error instanceof AccountAuthorizationError ? 403 : 503, headers,
    });
  }
}
