import "server-only";

import { loadMessages } from "@/lib/i18n/messages";

// Public and account presentation is Spanish while Chisan focuses on Spain.
// Stored language preferences cannot override this publication decision.
export async function readApplicationLocalePreference() {
  return "es" as const;
}

export async function loadApplicationPresentation() {
  const locale = await readApplicationLocalePreference();
  const messages = await loadMessages(locale);
  return { explicitLocale: locale, locale, messages };
}
