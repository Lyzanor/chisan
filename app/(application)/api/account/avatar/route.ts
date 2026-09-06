import { getCurrentAccount } from "@/lib/accounts/auth";
import { createAvatarMutationHandler } from "@/lib/accounts/avatar-http";
import { getDatabase } from "@/lib/db";
import { isAccountSystemConfigured } from "@/lib/accounts/config";
export const dynamic = "force-dynamic";
export const POST = createAvatarMutationHandler({
  getCurrentAccount,
  getDatabase,
  isEnabled: isAccountSystemConfigured,
});
export const DELETE = POST;
