import { getCurrentAccount } from "@/lib/accounts/auth";
import { createAvatarReadHandler } from "@/lib/accounts/avatar-http";
import { getDatabase } from "@/lib/db";
import { isAccountSystemConfigured } from "@/lib/accounts/config";
export const dynamic = "force-dynamic";
export const GET = createAvatarReadHandler({
  getCurrentAccount,
  getDatabase,
  isEnabled: isAccountSystemConfigured,
});
