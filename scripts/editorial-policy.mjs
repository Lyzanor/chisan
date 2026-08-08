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
  // Existing evaluation fixtures predate candidate lifecycle decisions. Their
  // omitted state remains published; new candidate cases declare it explicitly.
  const catalogState = facts.catalogState ?? "published";
  assertEnum(
    catalogState,
    new Set(["published", "candidate"]),
    "catalogState",
  );
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
    new Set(["matching", "other-area", "unknown"]),
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
      "reseller-only",
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

  const isCandidate = catalogState === "candidate";
  const exclusionAction = isCandidate ? "reject" : "purge";

  if (facts.duplicate === "same-unit") {
    return isCandidate
      ? { action: "already-present" }
      : { action: "merge", reason: "duplicate" };
  }
  if (facts.existenceStatus === "nonexistent") {
    return { action: exclusionAction, reason: "nonexistent" };
  }
  if (facts.scope === "not-producer") {
    return { action: exclusionAction, reason: "not-producer" };
  }
  if (facts.scope === "out-of-scope") {
    return { action: exclusionAction, reason: "out-of-scope" };
  }
  if (facts.operatingStatus === "closed") {
    return { action: exclusionAction, reason: "closed" };
  }
  if (facts.territory === "other-area") {
    return { action: exclusionAction, reason: "other-area" };
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

  if (
    isCandidate &&
    !(
      facts.existenceStatus === "confirmed" &&
      facts.scope === "producer" &&
      facts.operatingStatus === "active" &&
      facts.territory === "matching" &&
      ["none", "distinct-unit"].includes(facts.duplicate) &&
      allCorePresent
    )
  ) {
    return { action: "hold" };
  }

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
