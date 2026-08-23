import assert from "node:assert/strict";
import test from "node:test";

import {
  getAccountAuthConfiguration,
  getAppUrl,
  getBootstrapAdminEmails,
  isAccountFeatureEnabled,
} from "../lib/accounts/config";
import {
  PRODUCER_EDITABLE_FIELDS,
  hashProducerFields,
  isProducerPatch,
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

test("Chisan account environment names take precedence with a temporary KM0 fallback", () => {
  assert.equal(isAccountFeatureEnabled({ KM0_ACCOUNTS_ENABLED: "true" }), true);
  assert.equal(
    isAccountFeatureEnabled({
      CHISAN_ACCOUNTS_ENABLED: "false",
      KM0_ACCOUNTS_ENABLED: "true",
    }),
    false,
  );

  assert.deepEqual(
    [...getBootstrapAdminEmails({ KM0_ADMIN_EMAILS: "legacy@example.com" })],
    ["legacy@example.com"],
  );
  assert.deepEqual(
    [
      ...getBootstrapAdminEmails({
        CHISAN_ADMIN_EMAILS: "Owner@Example.com",
        KM0_ADMIN_EMAILS: "legacy@example.com",
      }),
    ],
    ["owner@example.com"],
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
  const proposal = { ...current, descripcion: "Keeps bees on its productive unit." };
  const result = validateProducerProposal(proposal, current);

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.patch, {
    descripcion: "Keeps bees on its productive unit.",
  });
  assert.equal(isProducerPatch(result.patch), true);
  assert.equal(isProducerPatch({ producer_id: "999" }), false);
  assert.equal(isProducerPatch({ verificacion: "verificado" }), false);
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

test("producer row hashes are stable across object key order", () => {
  assert.equal(
    hashProducerFields({ nombre: "A", municipio: "B" }),
    hashProducerFields({ municipio: "B", nombre: "A" }),
  );
  assert.notEqual(
    hashProducerFields({ nombre: "A", municipio: "B" }),
    hashProducerFields({ nombre: "A", municipio: "C" }),
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
