#!/usr/bin/env node

// Guards the two pieces of check:defects that steer planning rather than just
// reporting: which checks count as workload, and how boilerplate descriptions
// collapse into templates.

import assert from "node:assert/strict";

import { CHECKS, templateShape } from "./audit-defects.mjs";

let passed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed += 1;
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(`  ${error.message}`);
    process.exitCode = 1;
  }
};

test("every check declares a kind", () => {
  for (const check of CHECKS) {
    assert.ok(
      check.kind === "cola" || check.kind === "senal",
      `${check.id} has kind ${JSON.stringify(check.kind)}`,
    );
  }
});

test("coverage gaps that may stay open forever are señales, not colas", () => {
  // Empty is a valid end state for both: images are a 60% target and evidence
  // is advisory. Counting them as workload inflates the union ~6x and buries
  // the real overlap.
  const senales = CHECKS.filter((c) => c.kind === "senal").map((c) => c.id);
  assert.deepEqual(senales.sort(), ["sin-evidencia", "sin-imagen"]);
});

test("published falsehood is always a cola", () => {
  for (const id of ["sinteticas", "pendiente", "evidencia-prestada", "web-de-tercero"]) {
    const check = CHECKS.find((c) => c.id === id);
    assert.ok(check, `missing check ${id}`);
    assert.equal(check.kind, "cola", `${id} must count as workload`);
  }
});

test("same template, different producer and town, folds to one shape", () => {
  const a =
    "Bodega de la DOCa Rioja situada en Agoncillo, incorporada al catálogo provincial de La Rioja y revisada con Google Maps.";
  const b =
    "Quesería de la DOP Cameros situada en Munilla, incorporada al catálogo provincial de La Rioja y revisada con Google Maps.";
  assert.equal(templateShape(a), templateShape(b));
});

test("multi-word place names collapse to a single placeholder", () => {
  const one = "Productor local de miel en Corera, revisado con Google Maps.";
  const two = "Productor local de miel en San Vicente de la Sonsierra, revisado con Google Maps.";
  assert.equal(templateShape(one), templateShape(two));
});

test("a real producer fact keeps its own shape", () => {
  // The point of grouping is to empty clusters that say nothing. A description
  // carrying a specific fact must not be swept into the boilerplate group.
  const boilerplate = "Productor local de miel en Corera, revisado con Google Maps.";
  const specific = "Colmenar trashumante de 400 colmenas que elabora miel de romero cruda.";
  assert.notEqual(templateShape(boilerplate), templateShape(specific));
});

test("numbers are placeholders too, so counts do not split a template", () => {
  assert.equal(
    templateShape("Obrador con 3 tiendas propias."),
    templateShape("Obrador con 12 tiendas propias."),
  );
});

test("empty description is a shape, not a crash", () => {
  assert.equal(templateShape(""), "");
  assert.equal(templateShape(null), "");
  assert.equal(templateShape(undefined), "");
});

if (process.exitCode) {
  console.error(`\naudit-defects: ${passed} passed, some failed.`);
} else {
  console.log(`audit-defects: ${passed} checks passed.`);
}
