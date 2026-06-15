const EVIDENCE_STRENGTHS = new Set([
  "primary",
  "reliable",
  "secondary",
  "none",
]);
const SALES_CHANNELS = new Set([
  "ecommerce",
  "whatsapp",
  "email",
  "telefono",
  "suscripcion",
  "marketplace",
]);

function assertEnum(value, allowed, field) {
  if (!allowed.has(value)) {
    throw new Error(`Unsupported ${field}: '${value}'`);
  }
}

export function evaluateEditorialFacts(facts) {
  assertEnum(
    facts.existenceStatus,
    new Set(["confirmed", "nonexistent", "unknown"]),
    "existenceStatus",
  );
  assertEnum(
    facts.scope,
    new Set(["producer", "not-producer", "out-of-scope", "unknown"]),
    "scope",
  );
  assertEnum(
    facts.operatingStatus,
    new Set(["active", "closed", "unknown"]),
    "operatingStatus",
  );
  assertEnum(
    facts.territory,
    new Set(["matching", "other-province", "unknown"]),
    "territory",
  );
  assertEnum(
    facts.duplicate,
    new Set(["none", "same-unit", "distinct-unit", "unknown"]),
    "duplicate",
  );
  assertEnum(
    facts.onlineSalesEvidence,
    new Set([
      "usable-channel",
      "checked-none",
      "temporary-failure",
      "not-checked",
    ]),
    "onlineSalesEvidence",
  );

  for (const field of [
    "identityEvidence",
    "activityEvidence",
    "municipalityEvidence",
  ]) {
    assertEnum(facts[field], EVIDENCE_STRENGTHS, field);
  }

  if (!Array.isArray(facts.onlineSalesChannels)) {
    throw new Error("onlineSalesChannels must be an array");
  }
  for (const channel of facts.onlineSalesChannels) {
    assertEnum(channel, SALES_CHANNELS, "online sales channel");
  }

  if (facts.duplicate === "same-unit") {
    return { action: "merge", reason: "duplicate" };
  }
  if (facts.existenceStatus === "nonexistent") {
    return { action: "purge", reason: "nonexistent" };
  }
  if (facts.scope === "not-producer") {
    return { action: "purge", reason: "not-producer" };
  }
  if (facts.scope === "out-of-scope") {
    return { action: "purge", reason: "out-of-scope" };
  }
  if (facts.operatingStatus === "closed") {
    return { action: "purge", reason: "closed" };
  }
  if (facts.territory === "other-province") {
    return { action: "purge", reason: "other-province" };
  }

  const confirmed = new Set(["primary", "reliable"]);
  const allCoreConfirmed =
    facts.existenceStatus === "confirmed" &&
    facts.scope === "producer" &&
    facts.operatingStatus === "active" &&
    facts.territory === "matching" &&
    confirmed.has(facts.identityEvidence) &&
    confirmed.has(facts.activityEvidence) &&
    confirmed.has(facts.municipalityEvidence);
  const allCorePresent = [
    facts.identityEvidence,
    facts.activityEvidence,
    facts.municipalityEvidence,
  ].every((value) => value !== "none");

  let verification = "pendiente";
  if (allCoreConfirmed) {
    verification = "verificado";
  } else if (allCorePresent) {
    verification = "parcial";
  }

  let onlineSales = "no comprobado";
  let salesChannels = [];
  if (facts.onlineSalesEvidence === "usable-channel") {
    if (facts.onlineSalesChannels.length === 0) {
      throw new Error(
        "usable-channel evidence requires at least one online sales channel",
      );
    }
    onlineSales = "sí";
    salesChannels = [...new Set(facts.onlineSalesChannels)].sort();
  } else if (facts.onlineSalesEvidence === "checked-none") {
    onlineSales = "no";
  }

  return {
    action: "keep",
    verification,
    onlineSales,
    salesChannels,
  };
}
