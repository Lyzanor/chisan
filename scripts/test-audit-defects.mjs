#!/usr/bin/env node

// Guards the two pieces of check:defects that steer planning rather than just
// reporting: which checks count as workload, and how boilerplate descriptions
// collapse into templates.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CATEGORY_MARKERS, CHECKS, loadCategoryVariants, loadCrossTemplate, templateShape } from "./audit-defects.mjs";

const registry = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/reference/categories.json"),
    "utf8",
  ),
);

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

test("every retired category is replaced by one that is still valid", () => {
  // A retirement whose target was itself retired would send an editor to a
  // label the contract rejects, and would make the migration a chain instead
  // of a single reassignment.
  const valid = new Set(registry.categories);
  for (const [label, target] of Object.entries(registry.retiredCategories)) {
    assert.ok(valid.has(target), `${label} points at ${target}, which is not a valid category`);
    assert.ok(
      !(target in registry.retiredCategories),
      `${label} points at ${target}, which is itself retired`,
    );
  }
});

test("a retired label leaves the valid list as soon as nothing uses it", () => {
  // G-CAT-2's exit condition, executable. A retired label stays valid only
  // while it still carries rows — otherwise every other agent's gate would go
  // red on data they did not touch. So each one must be showing up in the
  // migration queue: if it is not, its rows are gone and it should have been
  // dropped from `categories` in the same lot.
  const variants = loadCategoryVariants();
  const stillValid = Object.keys(registry.retiredCategories).filter((label) =>
    registry.categories.includes(label),
  );
  for (const label of stillValid) {
    assert.ok(
      variants.has(label),
      `'${label}' is retired but still valid, and no row uses it: drop it from data/reference/categories.json`,
    );
  }
});

test("the migration queue counts as workload, not as a coverage signal", () => {
  assert.equal(CHECKS.find((c) => c.id === "categoria-variante").kind, "cola");
});

// Cross-template detection, on synthetic rows only: hardcoding real producers
// would turn the check into the brand list it exists to avoid.
const crossTemplate = (rows) =>
  loadCrossTemplate([
    {
      provincia: "test",
      rows: rows.map((r, i) => ({
        slug: `fila-${i}`,
        nombre: "",
        categoria: "",
        "productos estrella": "",
        descripcion: "",
        ...r,
      })),
    },
  ]);
const flagged = (rows) => [...crossTemplate(rows).keys()].map((k) => k.replace("test/", ""));

test("star products naming another category's products is flagged", () => {
  assert.deepEqual(
    flagged([
      { nombre: "Heladería Sintética", categoria: "Helados", "productos estrella": "Quesos y lácteos" },
    ]),
    ["fila-0"],
  );
});

test("star products that back up their own category are left alone", () => {
  assert.deepEqual(
    flagged([
      { nombre: "Heladería Sintética", categoria: "Helados", "productos estrella": "Helados artesanos y sorbetes" },
    ]),
    [],
  );
});

test("a mixed producer that lists both categories is not contamination", () => {
  // The defect is a row describing *only* another category. A producer that
  // genuinely does two things names its own among them.
  assert.deepEqual(
    flagged([
      { nombre: "Casa Sintética", categoria: "Aceite", "productos estrella": "Aceite de oliva, vino tinto" },
    ]),
    [],
  );
});

test("a foreign noun used as an ingredient is not a second product line", () => {
  // "sobaos con chocolate" is a bakery, not a chocolatier: the noun after
  // con/de modifies the product before it.
  assert.deepEqual(
    flagged([
      { nombre: "Obrador Sintético", categoria: "Pan y pastelería", "productos estrella": "Sobaos con chocolate" },
    ]),
    [],
  );
});

test("the trade name is not evidence of a product", () => {
  // "Conservas Senra" filed under Pescado: the only word naming another
  // category comes from the brand, so there is nothing to show an editor.
  assert.deepEqual(
    flagged([
      { nombre: "Conservas Sintéticas", categoria: "Pescado", "productos estrella": "Conservas Sintéticas" },
    ]),
    [],
  );
});

test("a category with no markers is never judged by them", () => {
  // `Otros` and `Despensa artesanal` are catch-alls: the absence of their own
  // nouns proves nothing, so a marker must not convict them.
  assert.equal(CATEGORY_MARKERS["Despensa artesanal"], undefined);
  assert.deepEqual(
    flagged([
      { nombre: "Casa Sintética", categoria: "Despensa artesanal", "productos estrella": "queso curado y miel" },
    ]),
    [],
  );
});

test("star products holding a taxonomy label are flagged whatever the category", () => {
  // Structural, not lexical: the field is supposed to list products, so a bare
  // category label in it is the anomaly even for a catch-all category, and
  // even when the brand repeats it.
  assert.deepEqual(
    flagged([
      {
        nombre: "Aceitunas Sintéticas",
        categoria: "Despensa artesanal",
        "productos estrella": "Aceitunas y encurtidos",
      },
    ]),
    ["fila-0"],
  );
});

test("a retired label in star products is not contamination by itself", () => {
  // `Platos preparados` was folded into `Comida preparada`: same category,
  // stale spelling. Comparing without resolving it would invent a defect.
  assert.deepEqual(
    flagged([
      { nombre: "Casa Sintética", categoria: "Comida preparada", "productos estrella": "Platos preparados" },
    ]),
    [],
  );
});

test("empty star products cannot contradict anything", () => {
  assert.deepEqual(
    flagged([{ nombre: "Casa Sintética", categoria: "Aceite", "productos estrella": "" }]),
    [],
  );
});

test("every marker category is a category the contract accepts", () => {
  const valid = new Set(registry.categories);
  for (const category of Object.keys(CATEGORY_MARKERS)) {
    assert.ok(
      valid.has(category) || category in registry.retiredCategories,
      `${category} has markers but is not a known category`,
    );
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
