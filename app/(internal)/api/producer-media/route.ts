import {
  getCurrentAccount,
  hasProducerAccess,
  hasStaffAccess,
} from "@/lib/accounts/auth";
import { isProducerChangeSubmissionEnabled } from "@/lib/accounts/config";
import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { createProducerMediaUploadHandler } from "@/lib/accounts/producer-media-http";
export const runtime = "nodejs";
export const POST = createProducerMediaUploadHandler({
  getCurrentAccount,
  hasProducerAccess,
  hasStaffAccess,
  hasActiveProducerPremiumEntitlement,
  isProducerChangeSubmissionEnabled,
  findProducerById,
  getDatabase,
});
