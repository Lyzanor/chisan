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
const CATEGORY_RELATIONSHIPS = new Set([
  "own-material-output",
  "resale",
  "ingredient",
  "hospitality",
  "incidental-output",
  "unknown",
]);
const CATEGORY_ASSIGNMENT_KEYS = new Set(["primary", "candidates"]);
const CATEGORY_CANDIDATE_KEYS = new Set([
  "category",
  "relationship",
  "evidence",
]);

function assertEnum(value, allowed, field) {
  if (!allowed.has(value)) {
    throw new Error(`Unsupported ${field}: '${value}'`);
  }
}

function assertExactKeys(value, allowed, field) {
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length) {
    throw new Error(`Unsupported ${field} field(s): ${unknown.join(", ")}`);
  }
}

export function evaluateCategoryAssignment(assignment) {
  if (!assignment || typeof assignment !== "object" || Array.isArray(assignment)) {
    throw new Error("categoryAssignment must be an object");
  }
  assertExactKeys(assignment, CATEGORY_ASSIGNMENT_KEYS, "categoryAssignment");

  const primaryCategory = String(assignment.primary ?? "").trim();
  if (!primaryCategory) {
    throw new Error("categoryAssignment.primary is required");
  }
  if (!Array.isArray(assignment.candidates)) {
    throw new Error("categoryAssignment.candidates must be an array");
  }

  const additionalCategories = [];
  const seen = new Set([primaryCategory]);
  for (const candidate of assignment.candidates) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new Error("categoryAssignment candidates must be objects");
    }
    assertExactKeys(candidate, CATEGORY_CANDIDATE_KEYS, "category candidate");
    assertEnum(candidate.relationship, CATEGORY_RELATIONSHIPS, "category relationship");
    assertEnum(candidate.evidence, EVIDENCE_STRENGTHS, "category evidence");

    const category = String(candidate.category ?? "").trim();
    if (!category) {
      throw new Error("category candidate category is required");
    }
    if (
      candidate.relationship !== "own-material-output" ||
      candidate.evidence === "none" ||
      seen.has(category)
    ) {
      continue;
    }

    seen.add(category);
    additionalCategories.push(category);
  }

  return { primaryCategory, additionalCategories };
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

  const decision = {
    action: "keep",
    verification,
    onlineSales,
    salesChannels,
  };

  return facts.categoryAssignment
    ? { ...decision, ...evaluateCategoryAssignment(facts.categoryAssignment) }
    : decision;
}
