import assert from "node:assert/strict";
import test from "node:test";

import {
  getAccountAuthConfiguration,
  getAppUrl,
  getBootstrapAdminEmails,
  isAccountFeatureEnabled,
  isProducerChangeSubmissionEnabled,
} from "../lib/accounts/config";
import {
  profileUpgradeGiftGrantSchema,
  profileUpgradeGiftRevokeSchema,
} from "../lib/accounts/input";
import {
  PRODUCER_EDITABLE_FIELDS,
  PRODUCER_STANDARD_EDITABLE_FIELDS,
  hashProducerFields,
  isPremiumProducerPatch,
  isProducerPatch,
  producerEditableFieldsForPremiumAccess,
  readProducerProposalForm,
  safeReturnPath,
  validateProducerProposal,
} from "../lib/accounts/producer-fields";
import {
  PRODUCER_CHANGE_STATUSES,
  PRODUCER_CHANGE_STATUS_DEFINITIONS,
  PRODUCER_CHANGE_VIEWS,
  getProducerChangeStatusDefinition,
  requestedProducerFields,
  resolveProducerChangeStatusSelection,
} from "../lib/accounts/producer-change-workflow";
import {
  normalizeAdminProducerChangeListOptions,
  serializeProducerChangeDetail,
  type AdminProducerChangeDetail,
} from "../lib/admin/producer-change-requests";
import { findProducerById, findProducersByIds } from "../lib/csv-catalog";

test("account auth configuration rejects empty and placeholder Clerk keys", () => {
  const configured = getAccountAuthConfiguration({
    CHISAN_ACCOUNTS_ENABLED: "true",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_Y2xlcmsuZXhhbXBsZS50ZXN0JA==",
    CLERK_SECRET_KEY: "sk_test_abcdefghijklmnopqrstuvwxyz012345",
  });
  assert.equal(configured.featureEnabled, true);
  assert.equal(configured.configured, true);
  assert.deepEqual(configured.missingKeys, []);
  assert.deepEqual(configured.invalidKeys, []);

  const placeholders = getAccountAuthConfiguration({
    CHISAN_ACCOUNTS_ENABLED: "true",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_replace_me",
    CLERK_SECRET_KEY: "sk_test_replace_me",
  });
  assert.equal(placeholders.configured, false);
  assert.deepEqual(placeholders.missingKeys, []);
  assert.deepEqual(placeholders.invalidKeys, [
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
  ]);

  const empty = getAccountAuthConfiguration({
    CHISAN_ACCOUNTS_ENABLED: "true",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "",
    CLERK_SECRET_KEY: "",
  });
  assert.equal(empty.configured, false);
  assert.deepEqual(empty.missingKeys, [
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
  ]);
  assert.deepEqual(empty.invalidKeys, []);

  const disabled = getAccountAuthConfiguration({
    CHISAN_ACCOUNTS_ENABLED: "false",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_Y2xlcmsuZXhhbXBsZS50ZXN0JA==",
    CLERK_SECRET_KEY: "sk_test_abcdefghijklmnopqrstuvwxyz012345",
  });
  assert.equal(disabled.featureEnabled, false);
  assert.equal(disabled.configured, false);

  const switchAbsent = getAccountAuthConfiguration({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_Y2xlcmsuZXhhbXBsZS50ZXN0JA==",
    CLERK_SECRET_KEY: "sk_test_abcdefghijklmnopqrstuvwxyz012345",
  });
  assert.equal(switchAbsent.featureEnabled, false);
  assert.equal(switchAbsent.configured, false);
});

test("Chisan account environment names own feature and bootstrap configuration", () => {
  assert.equal(isAccountFeatureEnabled({ CHISAN_ACCOUNTS_ENABLED: " true " }), true);
  assert.deepEqual(
    [
      ...getBootstrapAdminEmails({
        CHISAN_ADMIN_EMAILS: "Owner@Example.com, staff@example.com ",
      }),
    ],
    ["owner@example.com", "staff@example.com"],
  );
});

test("producer change submissions can be frozen without disabling account review", () => {
  assert.equal(isProducerChangeSubmissionEnabled({}), true);
  assert.equal(
    isProducerChangeSubmissionEnabled({ CHISAN_PRODUCER_CHANGES_ENABLED: "true" }),
    true,
  );
  assert.equal(
    isProducerChangeSubmissionEnabled({ CHISAN_PRODUCER_CHANGES_ENABLED: "false" }),
    false,
  );
  assert.equal(
    isProducerChangeSubmissionEnabled({ CHISAN_PRODUCER_CHANGES_ENABLED: "typo" }),
    false,
  );
});

test("application origin is canonical and ignores invalid overrides", () => {
  assert.equal(getAppUrl({}), "https://chisan.app");
  assert.equal(
    getAppUrl({ NEXT_PUBLIC_APP_URL: "https://preview.example.test/path" }),
    "https://preview.example.test",
  );
  assert.equal(
    getAppUrl({ NEXT_PUBLIC_APP_URL: "javascript:alert(1)" }),
    "https://chisan.app",
  );
  assert.equal(getAppUrl({ NEXT_PUBLIC_APP_URL: "not a URL" }), "https://chisan.app");
});

function validFields(): Record<string, string> {
  return {
    ...Object.fromEntries(PRODUCER_EDITABLE_FIELDS.map(({ key }) => [key, ""])),
    nombre: "Example producer",
    municipio: "Example town",
    categoria: "Miel",
    "Venta online": "no comprobado",
  };
}

test("producer proposals return only changed allowlisted fields", () => {
  const current = validFields();
  const proposal = {
    ...current,
    descripcion: "Keeps bees on its productive unit.",
    descripcion_locale: "en",
  };
  const result = validateProducerProposal(proposal, current);

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.patch, {
    descripcion: "Keeps bees on its productive unit.",
    descripcion_locale: "en",
  });
  assert.equal(isProducerPatch(result.patch), true);
  assert.equal(isProducerPatch({ producer_id: "999" }), false);
  assert.equal(isProducerPatch({ verificacion: "pendiente" }), false);
});

test("description and source locale are validated and proposed as one pair", () => {
  const current = validFields();
  const missingLocale = validateProducerProposal(
    { ...current, descripcion: "Produces honey." },
    current,
  );
  assert.equal(missingLocale.ok, false);
  if (!missingLocale.ok) {
    assert.match(missingLocale.errors.descripcion_locale, /source language/i);
  }

  const localeWithoutDescription = validateProducerProposal(
    { ...current, descripcion_locale: "en" },
    current,
  );
  assert.equal(localeWithoutDescription.ok, false);
  if (!localeWithoutDescription.ok) {
    assert.match(localeWithoutDescription.errors.descripcion_locale, /description is empty/i);
  }

  const existing = {
    ...current,
    descripcion: "Produces honey.",
    descripcion_locale: "en",
  };
  const changedDescription = validateProducerProposal(
    { ...existing, descripcion: "Produces honey and beeswax." },
    existing,
  );
  assert.equal(changedDescription.ok, true);
  if (changedDescription.ok) {
    assert.deepEqual(changedDescription.patch, {
      descripcion: "Produces honey and beeswax.",
      descripcion_locale: "en",
    });
  }

  const frenchSource = validateProducerProposal(
    {
      ...current,
      descripcion: "Produit du miel sur son exploitation.",
      descripcion_locale: "fr",
    },
    current,
  );
  assert.equal(frenchSource.ok, true);
  if (frenchSource.ok) {
    assert.deepEqual(frenchSource.patch, {
      descripcion: "Produit du miel sur son exploitation.",
      descripcion_locale: "fr",
    });
  }
});

test("producer descriptions enforce the shared Unicode limit and reject source-page payloads", () => {
  const current = validFields();
  const withinLimit = validateProducerProposal(
    { ...current, descripcion: "🍯".repeat(400), descripcion_locale: "es" },
    current,
  );
  assert.equal(withinLimit.ok, true);

  const overLimit = validateProducerProposal(
    { ...current, descripcion: "🍯".repeat(401), descripcion_locale: "es" },
    current,
  );
  assert.equal(overLimit.ok, false);
  if (!overLimit.ok) assert.match(overLimit.errors.descripcion, /maximum 400/);

  for (const descripcion of [
    "<nav>Inicio</nav> Produce miel.",
    "Produce miel. Fuente: https://example.com/ficha",
    "Produce_x000d_miel.",
  ]) {
    const result = validateProducerProposal(
      { ...current, descripcion, descripcion_locale: "es" },
      current,
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.errors.descripcion, /cannot contain/);
  }
});

test("producer proposals enforce cross-field and format invariants", () => {
  const current = validFields();
  const result = validateProducerProposal(
    {
      ...current,
      telefono: "600 11 22 33",
      web: "javascript:alert(1)",
      lat: "41.4",
      lon: "",
      "Venta online": "no",
      "Canal de venta": "ecommerce",
      "categorias adicionales": "Miel|Inventada",
    },
    current,
  );

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.match(result.errors.telefono, /E\.164/);
  assert.match(result.errors.web, /HTTP/);
  assert.match(result.errors.lon, /together/);
  assert.match(result.errors["Canal de venta"], /only valid/);
  assert.match(result.errors["categorias adicionales"], /catalog value/);
});

test("producer text fields reject spreadsheet formula prefixes", () => {
  const current = validFields();
  for (const prefix of ["=SUM(A1:A2)", "+1+1", "-1+1", "@SUM(A1:A2)"]) {
    const result = validateProducerProposal({ ...current, descripcion: prefix }, current);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.errors.descripcion, /spreadsheet formula/);
  }

  const validNumericFields = validateProducerProposal(
    { ...current, telefono: "+34600112233", lat: "-10", lon: "-20" },
    current,
  );
  assert.equal(validNumericFields.ok, true);
});

test("expanded profile fields are hidden from non-premium proposal input", () => {
  assert.equal(
    producerEditableFieldsForPremiumAccess(false),
    PRODUCER_STANDARD_EDITABLE_FIELDS,
  );
  assert.equal(
    producerEditableFieldsForPremiumAccess(true),
    PRODUCER_EDITABLE_FIELDS,
  );

  const form = new FormData();
  for (const [key, value] of Object.entries(validFields())) form.set(key, value);
  form.set("visitas guiadas", "sí");
  form.set("mensaje a la comunidad", "A hidden premium submission.");
  form.set("mensaje_comunidad_locale", "en");
  form.set("video", "https://youtu.be/dQw4w9WgXcQ");
  form.set("quien hay detras", "A hidden team profile.");
  form.set("quien_hay_detras_locale", "en");
  form.set("historia", "A hidden origin story.");
  form.set("historia_locale", "en");
  const raw = readProducerProposalForm(form, PRODUCER_STANDARD_EDITABLE_FIELDS);
  assert.equal("visitas guiadas" in raw, false);
  assert.equal("mensaje a la comunidad" in raw, false);
  assert.equal("video" in raw, false);
  assert.equal("quien hay detras" in raw, false);
  assert.equal("historia" in raw, false);

  const current = {
    ...validFields(),
    "visitas guiadas": "no",
    "mensaje a la comunidad": "Existing reviewed message.",
    mensaje_comunidad_locale: "en",
  };
  const result = validateProducerProposal(
    { ...raw, "visitas guiadas": "sí" },
    current,
    PRODUCER_STANDARD_EDITABLE_FIELDS,
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.candidate["visitas guiadas"], "no");
    assert.equal(result.candidate["mensaje a la comunidad"], "Existing reviewed message.");
    assert.equal(isPremiumProducerPatch(result.patch), false);
  }
});

test("administrative premium gifts require durable producer keys and reasons", () => {
  assert.equal(
    profileUpgradeGiftGrantSchema.safeParse({
      country: "ES",
      producerId: "49",
      reason: "Launch partner selected for an audited Chisan pilot.",
    }).success,
    true,
  );
  assert.equal(
    profileUpgradeGiftGrantSchema.safeParse({
      country: "es",
      producerId: "49",
      reason: "gift",
    }).success,
    false,
  );
  assert.equal(
    profileUpgradeGiftRevokeSchema.safeParse({
      confirmation: "revoke",
      entitlementId: "00000000-0000-4000-8000-000000000049",
      reason: "The documented pilot access period has ended.",
    }).success,
    true,
  );
  assert.equal(
    profileUpgradeGiftRevokeSchema.safeParse({
      confirmation: "yes",
      entitlementId: "00000000-0000-4000-8000-000000000049",
      reason: "The documented pilot access period has ended.",
    }).success,
    false,
  );
});

test("expanded profile proposals validate video, long-form prose, visits and links", () => {
  const current = validFields();
  const valid = validateProducerProposal(
    {
      ...current,
      "visitas guiadas": "sí",
      "mensaje a la comunidad": "🍯".repeat(1_000),
      mensaje_comunidad_locale: "es",
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "quien hay detras": "Ana y Luis dirigen esta unidad productiva.",
      quien_hay_detras_locale: "es",
      historia: "La explotación comenzó en 1987.",
      historia_locale: "es",
      "enlace destacado 1": "https://news.example/interview",
      "enlace destacado 2": "https://producer.example/story",
    },
    current,
  );
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(isPremiumProducerPatch(valid.patch), true);
    assert.deepEqual(valid.patch, {
      "visitas guiadas": "sí",
      "mensaje a la comunidad": "🍯".repeat(1_000),
      mensaje_comunidad_locale: "es",
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "quien hay detras": "Ana y Luis dirigen esta unidad productiva.",
      quien_hay_detras_locale: "es",
      historia: "La explotación comenzó en 1987.",
      historia_locale: "es",
      "enlace destacado 1": "https://news.example/interview",
      "enlace destacado 2": "https://producer.example/story",
    });
  }

  const invalid = validateProducerProposal(
    {
      ...current,
      "visitas guiadas": "quizá",
      "mensaje a la comunidad": "🍯".repeat(1_001),
      mensaje_comunidad_locale: "",
      video: "https://vimeo.com/123456",
      "quien hay detras": "Equipo sin idioma.",
      quien_hay_detras_locale: "",
      historia: "🌱".repeat(4_001),
      historia_locale: "es",
      "enlace destacado 1": "ftp://example.com/article",
      "enlace destacado 2": "https://example.com/second",
    },
    current,
  );
  assert.equal(invalid.ok, false);
  if (!invalid.ok) {
    assert.match(invalid.errors["visitas guiadas"], /yes, no/i);
    assert.match(invalid.errors["mensaje a la comunidad"], /maximum 1000/i);
    assert.match(invalid.errors.mensaje_comunidad_locale, /source language/i);
    assert.match(invalid.errors.video, /YouTube/i);
    assert.match(invalid.errors.quien_hay_detras_locale, /source language/i);
    assert.match(invalid.errors.historia, /maximum 4000/i);
    assert.match(invalid.errors["enlace destacado 1"], /HTTP/i);
  }

  const linkOrder = validateProducerProposal(
    { ...current, "enlace destacado 2": "https://example.com/second" },
    current,
  );
  assert.equal(linkOrder.ok, false);
  if (!linkOrder.ok) {
    assert.match(linkOrder.errors["enlace destacado 2"], /link 1/i);
  }

  const duplicateLinks = validateProducerProposal(
    {
      ...current,
      "enlace destacado 1": "https://example.com",
      "enlace destacado 2": "https://example.com/",
    },
    current,
  );
  assert.equal(duplicateLinks.ok, false);
  if (!duplicateLinks.ok) {
    assert.match(duplicateLinks.errors["enlace destacado 2"], /different/i);
  }

  const preservedLinkSpelling = validateProducerProposal(
    { ...current, "enlace destacado 1": "https://example.com" },
    current,
  );
  assert.equal(preservedLinkSpelling.ok, true);
  if (preservedLinkSpelling.ok) {
    assert.equal(
      preservedLinkSpelling.candidate["enlace destacado 1"],
      "https://example.com",
    );
  }

  const credentialedLink = validateProducerProposal(
    {
      ...current,
      "enlace destacado 1": "https://reporter:secret@example.com/article",
    },
    current,
  );
  assert.equal(credentialedLink.ok, false);
  if (!credentialedLink.ok) {
    assert.match(
      credentialedLink.errors["enlace destacado 1"],
      /embedded credentials/i,
    );
  }

  for (const formula of ["=1+1", "+1+1", "-1+1", "@SUM(A1:A2)"]) {
    const formulaMessage = validateProducerProposal(
      {
        ...current,
        "mensaje a la comunidad": formula,
        mensaje_comunidad_locale: "es",
      },
      current,
    );
    assert.equal(formulaMessage.ok, false);
    if (!formulaMessage.ok) {
      assert.match(
        formulaMessage.errors["mensaje a la comunidad"],
        /spreadsheet formula/i,
      );
    }
  }
});

test("producer-authored profile prose preserves internal spaces and canonical LF line breaks", () => {
  const current = validFields();
  const form = new FormData();
  for (const [key, value] of Object.entries(current)) form.set(key, value);
  form.set(
    "mensaje a la comunidad",
    "Primera línea.  Dos espacios.\r\nSegunda línea.",
  );
  form.set("mensaje_comunidad_locale", "es");
  form.set("quien hay detras", "Ana y Luis.  Equipo familiar.\r\nSegunda línea.");
  form.set("quien_hay_detras_locale", "es");
  form.set("historia", "Comenzó en 1987.\r\nContinúa hoy.");
  form.set("historia_locale", "es");

  const raw = readProducerProposalForm(form);
  const expectedMessage = "Primera línea.  Dos espacios.\nSegunda línea.";
  assert.equal(raw["mensaje a la comunidad"], expectedMessage);
  assert.equal(
    raw["quien hay detras"],
    "Ana y Luis.  Equipo familiar.\nSegunda línea.",
  );
  assert.equal(raw.historia, "Comenzó en 1987.\nContinúa hoy.");

  const result = validateProducerProposal(raw, current);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.candidate["mensaje a la comunidad"], expectedMessage);
    assert.deepEqual(result.patch, {
      "mensaje a la comunidad": expectedMessage,
      mensaje_comunidad_locale: "es",
      "quien hay detras": "Ana y Luis.  Equipo familiar.\nSegunda línea.",
      quien_hay_detras_locale: "es",
      historia: "Comenzó en 1987.\nContinúa hoy.",
      historia_locale: "es",
    });
  }

  assert.notEqual(
    hashProducerFields({ "mensaje a la comunidad": "Línea.  Dos espacios." }),
    hashProducerFields({ "mensaje a la comunidad": "Línea. Dos espacios." }),
  );
  assert.notEqual(
    hashProducerFields({ "mensaje a la comunidad": "Primera.\nSegunda." }),
    hashProducerFields({ "mensaje a la comunidad": "Primera. Segunda." }),
  );
});

test("producer row hashes are stable across object key order", () => {
  assert.equal(
    hashProducerFields({ nombre: "A", municipio: "B" }),
    hashProducerFields({ municipio: "B", nombre: "A" }),
  );
  assert.notEqual(
    hashProducerFields({ nombre: "A", municipio: "B" }),
    hashProducerFields({ nombre: "A", municipio: "C" }),
  );
  assert.notEqual(
    hashProducerFields({ descripcion: "Same prose", descripcion_locale: "en" }),
    hashProducerFields({ descripcion: "Same prose", descripcion_locale: "es" }),
  );
});

test("producer-change workflow covers every durable status exactly once", () => {
  assert.deepEqual(Object.keys(PRODUCER_CHANGE_STATUS_DEFINITIONS), [
    ...PRODUCER_CHANGE_STATUSES,
  ]);
  for (const status of PRODUCER_CHANGE_STATUSES) {
    const definition = getProducerChangeStatusDefinition(status);
    assert.ok(definition.label);
    assert.ok(definition.nextAction);
    assert.equal(typeof definition.requiresOperatorAction, "boolean");
  }

  const groupedStatuses = Object.entries(PRODUCER_CHANGE_VIEWS)
    .filter(([view]) => view !== "all")
    .flatMap(([, definition]) => [...definition.statuses]);
  assert.deepEqual(new Set(groupedStatuses), new Set(PRODUCER_CHANGE_STATUSES));
  assert.equal(groupedStatuses.length, PRODUCER_CHANGE_STATUSES.length);
});

test("producer-change filters normalize views, exact statuses and pagination", () => {
  assert.deepEqual(resolveProducerChangeStatusSelection("CSV"), {
    key: "csv",
    label: "CSV workflow",
    statuses: ["approved", "applying"],
    kind: "view",
  });
  assert.equal(resolveProducerChangeStatusSelection("approved").kind, "status");
  assert.equal(resolveProducerChangeStatusSelection("unknown").key, "all");

  const normalized = normalizeAdminProducerChangeListOptions({
    status: "attention",
    query: "  Chisan   Barcelona  ",
    page: -10,
    pageSize: 10_000,
  });
  assert.equal(normalized.selection.key, "attention");
  assert.equal(normalized.query, "Chisan Barcelona");
  assert.equal(normalized.page, 1);
  assert.equal(normalized.pageSize, 100);
});

test("producer-change detail exposes a stable durable execution record", () => {
  const createdAt = new Date("2026-08-23T10:00:00.000Z");
  const updatedAt = new Date("2026-08-23T10:05:00.000Z");
  const leaseExpiresAt = new Date("2026-08-23T10:15:00.000Z");
  const materializedAt = new Date("2026-08-23T10:04:00.000Z");
  const changeId = "00000000-0000-4000-8000-000000000101";
  const executionId = "00000000-0000-4000-8000-000000000102";
  const sourceHeadSha = "1".repeat(40);
  const expectedRowHash = "2".repeat(64);
  const baseRowHash = "3".repeat(64);
  const worktreeKey = "4".repeat(64);
  const detail: AdminProducerChangeDetail = {
    change: {
      id: changeId,
      authorUserId: "00000000-0000-4000-8000-000000000103",
      country: "es",
      producerId: 232,
      status: "applying",
      baseRowHash,
      baseSnapshot: { nombre: "Before" },
      patch: { nombre: "After" },
      requiredEntitlementKey: null,
      authorNote: null,
      lockVersion: 3,
      reviewerUserId: "00000000-0000-4000-8000-000000000104",
      decisionNote: "Evidence checked.",
      failureReason: null,
      appliedCommitSha: null,
      submittedAt: createdAt,
      reviewedAt: createdAt,
      appliedAt: null,
      createdAt,
      updatedAt,
    },
    execution: {
      id: executionId,
      status: "materialized",
      operatorKey: "operator:codex-production",
      worktreeKey,
      sourceHeadSha,
      expectedRowHash,
      leaseExpiresAt,
      csvPath: "data/csv/es/cataluna/barcelona.csv",
      materializedAt,
      appliedCommitSha: null,
      finishedAt: null,
      errorMessage: null,
      createdAt,
      updatedAt,
    },
    producer: null,
    producerName: "After",
    publicPath: null,
    author: {
      id: "00000000-0000-4000-8000-000000000103",
      displayName: "Producer",
    },
    reviewer: {
      id: "00000000-0000-4000-8000-000000000104",
      displayName: "Reviewer",
    },
    audit: [],
    diff: [
      { key: "nombre", label: "Name", before: "Before", requested: "After", current: null },
    ],
    catalog: { state: "missing", currentHash: null, requestedHash: expectedRowHash },
  };

  const record = serializeProducerChangeDetail(detail);

  assert.deepEqual(record.execution, {
    id: executionId,
    status: "materialized",
    operatorKey: "operator:codex-production",
    worktreeKey,
    sourceHeadSha,
    expectedRowHash,
    leaseExpiresAt: "2026-08-23T10:15:00.000Z",
    csvPath: "data/csv/es/cataluna/barcelona.csv",
    materializedAt: "2026-08-23T10:04:00.000Z",
    recoveryEligibleAt: "2026-08-24T10:04:00.000Z",
    appliedCommitSha: null,
    finishedAt: null,
    errorMessage: null,
    createdAt: "2026-08-23T10:00:00.000Z",
    updatedAt: "2026-08-23T10:05:00.000Z",
  });
  assert.equal(
    record.operatorCommands.recoverTemplate,
    `npx pnpm producer:change recover ${changeId} ${executionId} --reason "<documented reason>"`,
  );
});

test("requested producer state is derived from the stored base plus patch", () => {
  assert.deepEqual(
    requestedProducerFields({
      baseSnapshot: { nombre: "Before", municipio: "Barcelona" },
      patch: { nombre: "After", descripcion: "Updated description" },
    }),
    {
      nombre: "After",
      municipio: "Barcelona",
      descripcion: "Updated description",
    },
  );
});

test("return paths cannot escape the application origin", () => {
  assert.equal(safeReturnPath("/es/almeria/test?highlight=x"), "/es/almeria/test?highlight=x");
  assert.equal(safeReturnPath("https://attacker.example"), "/cuenta");
  assert.equal(safeReturnPath("//attacker.example"), "/cuenta");
  assert.equal(safeReturnPath("/\\attacker.example"), "/cuenta");
});

test("catalog identity lookup follows country plus immutable producer ID", async () => {
  const producer = await findProducerById("es", 232);
  assert.equal(producer?.country, "es");
  assert.equal(producer?.producerId, 232);

  const batch = await findProducersByIds([
    { country: "es", producerId: 232 },
    { country: "invalid", producerId: 232 },
    { country: "es", producerId: 0 },
  ]);
  assert.equal(batch[0]?.producerId, 232);
  assert.equal(batch[1], null);
  assert.equal(batch[2], null);
});
