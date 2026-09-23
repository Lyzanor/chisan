import { safeReturnPath } from "@/lib/accounts/producer-fields";
import { instagramHandle } from "@/lib/instagram/verification";

import {
  PRODUCER_ONBOARDING_PATH,
  type ProducerClaimChannels,
  type ProducerClaimMethod,
} from "./producer-claim-options";

export * from "./producer-claim-options";

export const OPEN_PRODUCER_CLAIM_STATUSES = [
  "draft",
  "pending",
  "needs_info",
  "approved",
] as const;

export type ProducerIdentity = {
  country: string;
  producerId: number;
};

export function sameProducerIdentity(
  left: ProducerIdentity,
  right: ProducerIdentity,
): boolean {
  return left.country === right.country && left.producerId === right.producerId;
}

// CSV columns that carry the published contact channels a claim can rely on.
export const PRODUCER_CLAIM_CHANNEL_FIELDS = [
  "correo",
  "telefono",
  "Instagram",
  "web",
] as const;

export function producerClaimChannels(
  fields: Record<string, string | undefined>,
): ProducerClaimChannels {
  const value = (name: string) => fields[name]?.trim() || null;
  return {
    email: value("correo")?.toLowerCase() ?? null,
    phone: value("telefono"),
    instagram: instagramHandle(fields.Instagram),
    web: value("web"),
  };
}

export function methodChannelAvailable(
  method: ProducerClaimMethod,
  channels: ProducerClaimChannels,
): boolean {
  if (method === "catalog_email") return channels.email !== null;
  if (method === "catalog_phone") return channels.phone !== null;
  if (method === "instagram") return channels.instagram !== null;
  return true;
}

// A sign-in address verified by the identity provider (an email code or Google
// sign-in) proves control of the published mailbox when it matches exactly.
export function verifiedEmailMatchesCatalog(
  catalogEmail: string | null,
  verifiedEmails: readonly string[],
): boolean {
  if (!catalogEmail) return false;
  const target = catalogEmail.trim().toLowerCase();
  return verifiedEmails.some((email) => email.trim().toLowerCase() === target);
}

export const PRODUCER_CLAIM_CODE_PATTERN = /^\d{6}$/;

export function isProducerOnboardingPath(path: string): boolean {
  return path === PRODUCER_ONBOARDING_PATH || path.startsWith(`${PRODUCER_ONBOARDING_PATH}?`);
}

/** A local path to resume after account setup, or "" when none is usable. */
export function onboardingReturnPath(value: string): string {
  const path = safeReturnPath(value, "");
  return path.startsWith("/cuenta/bienvenida") ? "" : path;
}

export type ClaimFollowUp = {
  /** Whether the claimant must hand the verification code to the reviewer. */
  needsCode: boolean;
  /** What happens next, in order; the claimant's own action comes first. */
  steps: string[];
};

export function claimFollowUp(
  method: string | null,
  channels: Partial<ProducerClaimChannels>,
  signInEmailMatchesCatalog: boolean,
): ClaimFollowUp {
  const approval = "Cuando lo comprobemos, activaremos tu acceso y verás el resultado en tu cuenta.";
  if (method === "catalog_email" && signInEmailMatchesCatalog) {
    return {
      needsCode: false,
      steps: [
        "Tu correo de acceso coincide con el de la ficha, así que ya está comprobado.",
        "El equipo revisa la solicitud; no tienes que hacer nada más.",
        approval,
      ],
    };
  }
  if (method === "catalog_email") {
    return {
      needsCode: true,
      steps: [
        `Te escribiremos a ${channels.email ?? "el correo de la ficha"}.`,
        "Responde desde ese buzón con tu código.",
        approval,
      ],
    };
  }
  if (method === "catalog_phone") {
    return {
      needsCode: true,
      steps: [
        `Te llamaremos al ${channels.phone ?? "teléfono de la ficha"}.`,
        "Cuando te lo pidamos, dinos tu código.",
        approval,
      ],
    };
  }
  if (method === "instagram") {
    return {
      needsCode: false,
      steps: [
        `Ya has demostrado que gestionas @${channels.instagram ?? "el Instagram de la ficha"}.`,
        "El equipo revisa la solicitud; no tienes que hacer nada más.",
        approval,
      ],
    };
  }
  return {
    needsCode: true,
    steps: [
      "Publica tu código en una página de tu web o como registro DNS TXT, o pásaselo a la entidad que te avala.",
      "Comprobaremos lo que nos has indicado en tu solicitud.",
      approval,
    ],
  };
}
