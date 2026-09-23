// Client-safe claim vocabulary shared by the onboarding screens and the server.

// Ownership is proved through a channel the catalog already published before
// the claim, never through one the claimant supplies. `other` covers a code on
// the producer website, an attestation from a collective and similar proof.
export const PRODUCER_CLAIM_METHODS = [
  "catalog_email",
  "catalog_phone",
  "instagram",
  "other",
] as const;

export type ProducerClaimMethod = (typeof PRODUCER_CLAIM_METHODS)[number];

export const PRODUCER_CLAIM_METHOD_LABELS: Record<string, string> = {
  catalog_email: "Correo publicado en la ficha",
  catalog_phone: "Teléfono publicado en la ficha",
  instagram: "Instagram publicado en la ficha",
  other: "Otra vía: web, aval de una entidad u otra prueba",
  // Methods offered before 2026-09-23; kept so historical claims stay readable.
  business_email: "Correo del negocio (método anterior)",
  website: "Web del productor (método anterior)",
  phone: "Teléfono del negocio (método anterior)",
  document: "Documento privado (método anterior)",
};

// How the claimant relates to the producer; context for the reviewer only.
export const PRODUCER_CLAIM_ROLES = [
  "owner",
  "family_or_team",
  "representative",
] as const;

export type ProducerClaimRole = (typeof PRODUCER_CLAIM_ROLES)[number];

export const PRODUCER_CLAIM_ROLE_LABELS: Record<ProducerClaimRole, string> = {
  owner: "Soy titular, socio o socia",
  family_or_team: "Soy de la familia o del equipo",
  representative: "Llevo su gestión o comunicación",
};

export type ProducerClaimChannels = {
  email: string | null;
  phone: string | null;
  instagram: string | null;
  web: string | null;
};

// Producer onboarding: search, confirm, choose a route, describe the relation.
export const PRODUCER_ONBOARDING_PATH = "/cuenta/reclamaciones/nueva";

// Screens after the search; they live in the `paso` query parameter.
export const CLAIM_WIZARD_STEPS = ["ficha", "verificacion", "relacion"] as const;
export type ClaimWizardStep = (typeof CLAIM_WIZARD_STEPS)[number];

export function parseClaimWizardStep(value: string | null | undefined): ClaimWizardStep | null {
  return CLAIM_WIZARD_STEPS.find((step) => step === value) ?? null;
}
