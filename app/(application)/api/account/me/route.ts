import { NextResponse } from "next/server";

import { getCurrentAccount } from "@/lib/accounts/auth";

export async function GET() {
  const account = await getCurrentAccount().catch(() => null);

  return NextResponse.json(
    { displayName: account?.displayName ?? null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
