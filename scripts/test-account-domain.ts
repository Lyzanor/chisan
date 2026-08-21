import assert from "node:assert/strict";
import test from "node:test";

import { getAccountAuthConfiguration } from "../lib/accounts/config";
import {
  PRODUCER_EDITABLE_FIELDS,
  hashProducerFields,
  isProducerPatch,
  safeReturnPath,
  validateProducerProposal,
} from "../lib/accounts/producer-fields";
import { findProducerById, findProducersByIds } from "../lib/csv-catalog";

test("account auth configuration rejects empty and placeholder Clerk keys", () => {
  const configured = getAccountAuthConfiguration({
    KM0_ACCOUNTS_ENABLED: "true",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_Y2xlcmsuZXhhbXBsZS50ZXN0JA==",
    CLERK_SECRET_KEY: "sk_test_abcdefghijklmnopqrstuvwxyz012345",
  });
  assert.equal(configured.featureEnabled, true);
  assert.equal(configured.configured, true);
  assert.deepEqual(configured.missingKeys, []);
  assert.deepEqual(configured.invalidKeys, []);

  const placeholders = getAccountAuthConfiguration({
    KM0_ACCOUNTS_ENABLED: "true",
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
    KM0_ACCOUNTS_ENABLED: "true",
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
    KM0_ACCOUNTS_ENABLED: "false",
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
