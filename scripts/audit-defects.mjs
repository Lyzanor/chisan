#!/usr/bin/env node

// Cross-province editorial defect audit.
//
// Complements the existing gates rather than duplicating them:
//   check:csv                -> blocking technical contract, per file
//   check:csv:data-quality   -> warnings, per file
//   check:csv:completeness   -> how full the optional fields are, per file
//   check:defects (this)     -> editorial defects the other three cannot see,
//                               because they need cross-file context or a
//                               judgement the contract does not encode.
//
// Advisory only: it never exits non-zero. It answers "what is left to fix and
// where", so a doc never has to freeze a count that rots.
//
// Usage:
//   node scripts/audit-defects.mjs                  every province
//   node scripts/audit-defects.mjs --provincia soria
//   node scripts/audit-defects.mjs --check sinteticas --list
//   node scripts/audit-defects.mjs --check descripcion-generica --plantillas
//   node scripts/audit-defects.mjs --json

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse } from "csv-parse/sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CSV_ROOT = path.join(ROOT, "data", "csv");
const EVIDENCE_ROOT = path.join(ROOT, "data", "evidence");

// A `web` shared by at least this many rows of the same province is a third
// party (regulatory council, market, blog) standing in for the producer's own
// site, not a business group.
const SHARED_DOMAIN_THRESHOLD = 3;

// Descriptions that say nothing about *this* producer: either they narrate our
// own cataloguing process, or they restate the category. Both are published
// verbatim on the detail page. check:csv:data-quality already flags exact
// duplicates per file; this catches the templated ones that happen to be unique
// because the municipality differs.
const GENERIC_DESCRIPTION = [
  /incorporad[oa] al cat[aá]logo provincial/i,
  /revisad[oa] con [A-ZÁÉÍÓÚ]/,
  /con presencia p[uú]blica contrastada/i,
  /queda pendiente fuente propia/i,
  /venta directa o de proximidad/i,
  /vinculad[oa] a (do|dop|igp)\b/i,
  /u otras indicaciones locales/i,
  /^(productor|obrador|bodega|queser[ií]a) local de /i,
];

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : (argv[i + 1] ?? true);
};
const onlyProvincia = flag("provincia");
const onlyCheck = flag("check");
const wantList = argv.includes("--list");
const wantJson = argv.includes("--json");
const wantPlantillas = argv.includes("--plantillas");

const norm = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const hostOf = (url) => {
  const m = (url ?? "").match(/^https?:\/\/(?:www\.)?([^/?#]+)/i);
  return m ? m[1].toLowerCase() : "";
};

// Collapse the proper nouns out of a description so two rows that differ only
// by producer name, municipality or DO reduce to the same shape. Generated
// boilerplate was written from a handful of templates, so grouping by shape
// turns "1.260 rows to rewrite" into "a few dozen decisions": for each shape,
// either it carries a fact that is not already in another column, or the whole
// cluster should be emptied. Runs of capitalised words fold together so
// `Google Maps` or `Ribera del Duero` count as one placeholder.
// A run is a capitalised word plus any further capitalised words, tolerating
// the lowercase particles that sit inside Spanish and Catalan place names
// (`San Vicente de la Sonsierra`, `Ribera del Duero`).
const PROPER_NOUN_RUN =
  /\b\p{Lu}[\p{L}\p{N}·'’-]*(?:(?:\s+(?:de|del|la|las|el|los|y|e|i|d'))*\s+\p{Lu}[\p{L}\p{N}·'’-]*)*/gu;
export const templateShape = (text) =>
  (text ?? "")
    .toString()
    .replace(PROPER_NOUN_RUN, "«…»")
    .replace(/\d+([.,]\d+)?/g, "«n»")
    .replace(/\s+/g, " ")
    .trim();

// Taxonomy drift the per-file near-duplicate warning cannot see, because the
// variants live in different provinces and its normalization does not fold
// plurals. Two shapes, both of which split the app's category filter:
//   - plural/singular of the same label (`Carne` vs `Carnes`)
//   - a combo `X y Y` when `X` or `Y` already exists on its own
// Reported as the minority variant, so the fix is "reassign these rows".
function loadCategoryVariants() {
  // Always across every province, even under --provincia: which spelling is the
  // majority is a property of the catalog, not of the file being inspected.
  // Scoped to one province, Málaga's 2 `Carne` rows would look like the
  // minority variant of its 4 `Carnes`, when nationally it is the reverse.
  const usage = new Map();
  for (const { rows } of readProvinces({ all: true })) {
    for (const row of rows) {
      if (!row.categoria) continue;
      usage.set(row.categoria, (usage.get(row.categoria) ?? 0) + 1);
    }
  }
  const canonical = new Set(usage.keys());
  const variants = new Set();

  // Fold plurals: group labels whose normalized form matches once a trailing
  // `s` is removed from every word, then keep only the majority spelling.
  // Stripping `es` too would turn `carnes` into `carn` and miss the `Carne`
  // pair this check exists for.
  const singular = (label) =>
    norm(label)
      .split(" ")
      .map((word) => word.replace(/s$/, ""))
      .join(" ");
  const byStem = new Map();
  for (const label of canonical) {
    const stem = singular(label);
    if (!byStem.has(stem)) byStem.set(stem, []);
    byStem.get(stem).push(label);
  }
  for (const group of byStem.values()) {
    if (group.length < 2) continue;
    const [, ...losers] = group.sort((a, b) => usage.get(b) - usage.get(a));
    for (const label of losers) variants.add(label);
  }

  // Combo labels that duplicate two categories which already exist on their
  // own, and carry fewer rows than either. `Fruta y verdura` or `Lácteos y
  // quesos` are canonical here, not combos: their halves are not categories.
  // The defect is `Aceite y bodega` (3 rows) next to `Aceite` and `Bodega`.
  const usageOfStem = new Map();
  for (const [label, count] of usage) {
    const stem = singular(label);
    usageOfStem.set(stem, (usageOfStem.get(stem) ?? 0) + count);
  }
  for (const label of canonical) {
    const parts = label.split(/\s+y\s+/i);
    if (parts.length !== 2) continue;
    const halves = parts.map((part) => usageOfStem.get(singular(part)) ?? 0);
    if (halves.some((n) => n === 0)) continue;
    if (usage.get(label) < Math.max(...halves)) variants.add(label);
  }

  return variants;
}

let provinceCache = null;
function readProvinces({ all = false } = {}) {
  if (!provinceCache) {
    provinceCache = [];
    for (const comunidad of fs.readdirSync(CSV_ROOT)) {
      const comunidadDir = path.join(CSV_ROOT, comunidad);
      if (!fs.statSync(comunidadDir).isDirectory()) continue;
      for (const file of fs.readdirSync(comunidadDir)) {
        if (!file.endsWith(".csv")) continue;
        const provincia = file.replace(/\.csv$/, "");
        const rows = parse(fs.readFileSync(path.join(comunidadDir, file), "utf8"), {
          bom: true,
          columns: true,
          skip_empty_lines: true,
        });
        provinceCache.push({ comunidad, provincia, key: `${comunidad}/${provincia}`, rows });
      }
    }
  }
  if (all || !onlyProvincia) return provinceCache;
  return provinceCache.filter((p) => p.provincia === onlyProvincia);
}

function readEvidence(comunidad, provincia) {
  const file = path.join(EVIDENCE_ROOT, comunidad, `${provincia}.jsonl`);
  const keep = new Set();
  if (!fs.existsSync(file)) return keep;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      if (record.action === "keep") keep.add(record.slug);
    } catch {
      // A malformed evidence line is check:evidence's job to report, not ours.
    }
  }
  return keep;
}

// Each check returns the offending rows so --list can name them. The label is
// what a future agent reads to decide whether the item is worth their session.
//
// `kind` decides whether a check belongs in the shared workload:
//   cola  -> a defect: every hit is either fixed or justified as a residual.
//   senal -> a coverage gap that may legitimately stay open forever. Empty is a
//            valid end state, so these never enter the union that drives
//            priority. Counting them there buries the real overlap: with them
//            in, ~5.000 rows look like they sit in two queues; without them,
//            it is ~870, and almost all of it is "row already opened for venta".
export const CHECKS = [
  {
    id: "sinteticas",
    kind: "cola",
    label: "filas sin un solo enlace ni contacto (candidatas a fila sintética)",
    hint: "docs/EDITORIAL_POLICY.md § Decision order: cruzar contra la fuente exhaustiva de la comunidad antes de decidir",
    run: ({ rows }) =>
      rows.filter(
        (r) =>
          !r.web && !r.telefono && !r.correo && !r.Facebook && !r.Instagram && !r["Google Maps"],
      ),
  },
  {
    id: "evidencia-prestada",
    kind: "cola",
    label: "`verificado` cuyo único enlace externo es un pin de Google Maps",
    hint: "un pin es contenido de usuario: prueba que hay un punto, no que el productor esté activo",
    run: ({ rows }) =>
      rows.filter(
        (r) =>
          r.verificacion === "verificado" &&
          !r.web &&
          !r.Instagram &&
          !r.Facebook &&
          r["Google Maps"],
      ),
  },
  {
    id: "web-de-tercero",
    kind: "cola",
    label: `\`web\` compartida por >=${SHARED_DOMAIN_THRESHOLD} filas de la provincia (consejo, mercado o blog haciendo de web propia)`,
    hint: "el enlace prestado hace pasar el gate de `verificado` sin una fuente del productor",
    run: ({ rows }) => {
      const byHost = new Map();
      for (const row of rows) {
        const host = hostOf(row.web);
        if (!host) continue;
        if (!byHost.has(host)) byHost.set(host, []);
        byHost.get(host).push(row);
      }
      return [...byHost.values()]
        .filter((group) => group.length >= SHARED_DOMAIN_THRESHOLD)
        .flat();
    },
  },
  {
    id: "descripcion-generica",
    kind: "cola",
    label: "`descripcion` que no distingue a este productor de otro de su categoría",
    hint: "docs/CSV_CONTRACT.md § Editorial field conventions; se publica tal cual en la ficha",
    run: ({ rows }) =>
      rows.filter((r) => r.descripcion && GENERIC_DESCRIPTION.some((re) => re.test(r.descripcion))),
  },
  // No `geo-sin-check` here on purpose: check:csv already reports it per file
  // as "geo-check skipped", using a centroid lookup with community-aware
  // overrides that this script would have to reimplement. Two tools disagreeing
  // on one metric is worse than one tool owning it.
  {
    id: "categoria-variante",
    kind: "cola",
    label: "`categoria` que es variante minoritaria de otra en uso (plural o combo)",
    hint: "el filtro de la app agrupa por string exacto: estas filas son invisibles desde la etiqueta mayoritaria",
    run: ({ rows }, ctx) => rows.filter((r) => ctx.categoryVariants.has(r.categoria)),
  },
  {
    id: "canal-sin-clasificar",
    kind: "cola",
    label: "`Venta online=sí` sin `Canal de venta`",
    hint: "sabemos que vende pero no cómo se le pide: el dato que hace accionable la fila",
    run: ({ rows }) => rows.filter((r) => r["Venta online"] === "sí" && !r["Canal de venta"]),
  },
  {
    id: "venta-sin-resolver",
    kind: "cola",
    label: "`Venta online=no comprobado`",
    hint: "objetivo 100% resuelto en docs/PROVINCE_COMPLETENESS.md; es el mayor hueco abierto",
    run: ({ rows }) => rows.filter((r) => r["Venta online"] === "no comprobado"),
  },
  {
    id: "sin-imagen",
    kind: "senal",
    label: "sin `imagen`",
    hint: "docs/IMAGES.md; enrich:images por slug con --contact-sheet, nunca --apply en bloque",
    run: ({ rows }) => rows.filter((r) => !r.imagen),
  },
  {
    id: "sin-evidencia",
    kind: "senal",
    label: "filas sin registro `keep` en el ledger de evidencia",
    hint: "la evidencia es opcional y advisory; falta-keep NO es deuda que haya que backfillear",
    run: ({ rows, comunidad, provincia }) => {
      const keep = readEvidence(comunidad, provincia);
      return rows.filter((r) => !keep.has(r.slug));
    },
  },
  {
    id: "pendiente",
    kind: "cola",
    label: "`verificacion=pendiente`",
    hint: "sin revisar: es la única categoría que la app muestra sin ninguna comprobación",
    run: ({ rows }) => rows.filter((r) => r.verificacion === "pendiente"),
  },
];

function main() {
  const provinces = readProvinces();
  if (provinces.length === 0) {
    console.error(onlyProvincia ? `No existe la provincia "${onlyProvincia}".` : "No hay CSV.");
    process.exit(1);
  }

  const ctx = { categoryVariants: loadCategoryVariants() };
  const checks = onlyCheck ? CHECKS.filter((c) => c.id === onlyCheck) : CHECKS;
  if (checks.length === 0) {
    console.error(`Check desconocido "${onlyCheck}". Disponibles: ${CHECKS.map((c) => c.id).join(", ")}`);
    process.exit(1);
  }

  const results = [];
  const queueMembership = new Map(); // `provincia/slug` -> Set of `cola` check ids
  const plantillaRows = [];
  for (const province of provinces) {
    const entry = { provincia: province.provincia, filas: province.rows.length, checks: {} };
    for (const check of checks) {
      const hits = check.run(province, ctx);
      entry.checks[check.id] = wantList || wantJson ? hits.map((r) => r.slug) : hits.length;
      if (check.kind === "cola") {
        for (const row of hits) {
          const key = `${province.provincia}/${row.slug}`;
          if (!queueMembership.has(key)) queueMembership.set(key, new Set());
          queueMembership.get(key).add(check.id);
        }
      }
      if (wantPlantillas && check.id === "descripcion-generica") {
        for (const row of hits) plantillaRows.push({ provincia: province.provincia, row });
      }
    }
    results.push(entry);
  }

  // Priority is per producer, not per check: a row in three queues is still one
  // investigation. Computed here so no document has to freeze the number.
  const union = [...queueMembership.values()];
  const workload = {
    filasEnCola: union.length,
    enDosOMasColas: union.filter((s) => s.size >= 2).length,
  };

  if (wantPlantillas) {
    reportPlantillas(plantillaRows);
    return;
  }

  if (wantJson) {
    console.log(
      JSON.stringify(
        {
          checks: checks.map((c) => ({ id: c.id, label: c.label, kind: c.kind })),
          workload,
          provinces: results,
        },
        null,
        2,
      ),
    );
    return;
  }

  const count = (entry, id) =>
    Array.isArray(entry.checks[id]) ? entry.checks[id].length : entry.checks[id];
  const totalRows = results.reduce((sum, r) => sum + r.filas, 0);

  console.log(`Auditoría de defectos editoriales — ${totalRows} filas en ${results.length} CSV\n`);

  for (const check of checks) {
    const affected = results
      .map((r) => [r.provincia, count(r, check.id)])
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1]);
    const total = affected.reduce((sum, [, n]) => sum + n, 0);

    const suffix = check.kind === "senal" ? " · señal, no cola" : "";
    console.log(`## ${check.id} — ${total} filas en ${affected.length} provincias${suffix}`);
    console.log(`   ${check.label}`);
    if (total > 0) {
      console.log(`   → ${check.hint}`);
      console.log(`   ${affected.map(([p, n]) => `${p}:${n}`).join(" · ")}`);
      if (wantList) {
        for (const entry of results) {
          const slugs = entry.checks[check.id];
          if (Array.isArray(slugs) && slugs.length > 0) {
            console.log(`     ${entry.provincia}: ${slugs.join(", ")}`);
          }
        }
      }
    }
    console.log("");
  }

  if (!onlyCheck) {
    console.log(
      `## carga real — ${workload.filasEnCola} filas en alguna cola, ${workload.enDosOMasColas} en dos o más`,
    );
    console.log("   productores únicos, sin contar las señales: la unidad de trabajo es la fila, no el check");
    console.log("   → una fila en varias colas se investiga una vez y se cierran juntas sus decisiones\n");
  }

  if (!wantList && !onlyCheck) {
    console.log("Detalle por fila: --check <id> --list · una provincia: --provincia <nombre> · JSON: --json");
  }
}

// Boilerplate descriptions were generated from templates, so the work is one
// decision per shape, not one per row. Sorted by cluster size: the top entry is
// usually worth more than the whole tail.
function reportPlantillas(entries) {
  if (entries.length === 0) {
    console.log("Sin filas de `descripcion-generica` en el alcance pedido.");
    return;
  }
  const byShape = new Map();
  for (const { provincia, row } of entries) {
    const shape = templateShape(row.descripcion);
    if (!byShape.has(shape)) byShape.set(shape, { filas: [], provincias: new Set() });
    const group = byShape.get(shape);
    group.filas.push({ provincia, slug: row.slug, descripcion: row.descripcion });
    group.provincias.add(provincia);
  }
  const groups = [...byShape.entries()].sort((a, b) => b[1].filas.length - a[1].filas.length);

  console.log(
    `Plantillas de descripción — ${entries.length} filas en ${groups.length} formas distintas\n`,
  );
  for (const [shape, group] of groups) {
    console.log(`## ${group.filas.length} filas · ${[...group.provincias].join(", ")}`);
    console.log(`   ${shape}`);
    console.log(`   ej.: ${group.filas[0].descripcion}`);
    if (wantList) {
      for (const provincia of group.provincias) {
        const slugs = group.filas.filter((f) => f.provincia === provincia).map((f) => f.slug);
        console.log(`     ${provincia}: ${slugs.join(", ")}`);
      }
    }
    console.log("");
  }
  console.log(
    "Decide una vez por forma: si no aporta un hecho ausente de `categoria`/`municipio`, vacía el grupo entero.",
  );
  if (!wantList) console.log("Slugs por grupo: añade --list");
}

// Importable for tests; still a plain CLI when run directly.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
