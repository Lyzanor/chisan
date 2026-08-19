#!/usr/bin/env node

// Cross-province editorial defect audit.
//
// Complements the existing gates rather than duplicating them:
//   check:csv                -> blocking technical contract, per file
//   check:defects (this)     -> advisory editorial worklist, including defects
//                               that need cross-file context or judgement.
//
// Advisory only: it never exits non-zero. It answers "what is left to fix and
// where", so a doc never has to freeze a count that rots.
//
// Usage:
//   node scripts/audit-defects.mjs                  every province
//   node scripts/audit-defects.mjs --country it
//   node scripts/audit-defects.mjs --area soria
//   node scripts/audit-defects.mjs --check sinteticas --list
//   node scripts/audit-defects.mjs --check descripcion-generica --templates
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
// verbatim on the detail page. Exact duplicates are their own check below; this
// catches templated descriptions that differ only by producer or municipality.
const GENERIC_DESCRIPTION = [
  /incorporad[oa] al cat[aá]logo areal/i,
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
const onlyArea = flag("area");
const onlyCountry = flag("country");
const onlyCheck = flag("check");
const wantList = argv.includes("--list");
const wantJson = argv.includes("--json");
const wantPlantillas = argv.includes("--templates") || argv.includes("--plantillas");

const norm = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const rowCategories = (row) => [
  row.categoria,
  ...(row["categorias adicionales"] ?? "")
    .split("|")
    .map((category) => category.trim()),
].filter(Boolean);

const duplicateRows = (rows, keyOf) => {
  const groups = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.values()].filter((group) => group.length > 1).flat();
};

const hostOf = (url) => {
  const m = (url ?? "").match(/^https?:\/\/(?:www\.)?([^/?#]+)/i);
  return m ? m[1].toLowerCase() : "";
};

const isCoordinateOnlyMapsUrl = (value) => {
  try {
    const url = new URL(value);
    const googleHost = /^([a-z0-9-]+\.)*google\.[a-z.]+$/i.test(url.hostname);
    const query = (url.searchParams.get("query") ?? "").trim();
    return (
      googleHost &&
      /^\/maps\/search\/?$/.test(url.pathname) &&
      !url.searchParams.get("query_place_id")?.trim() &&
      /^-?\d{1,2}(?:\.\d+)?\s*,\s*-?\d{1,3}(?:\.\d+)?$/.test(query)
    );
  } catch {
    return false;
  }
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
// variants live in different provinces. Three shapes, all of which split the
// app's category filter:
//   - a label the 2026-06-21 consolidation retired, still carrying rows
//   - plural/singular of the same label (`Carne` vs `Carnes`)
//   - a combo `X y Y` when `X` or `Y` already exists on its own
// The first comes from the registry, which records the decision; the other two
// are inferred from usage, and catch drift no consolidation ever ruled on.
// Reported as the minority variant, so the fix is "reassign these rows".
// Product nouns strong enough to name a category on their own, in the four
// languages the catalog publishes in. Nouns only: no brands, and no process
// words several categories share ("obrador", "molino", "artesano"), which is
// what made the first draft of this detector flag every almazara called
// "Molino de …". A category with no entry here is never judged by markers,
// because then the absence of its own nouns proves nothing — that is why
// `Otros`, `Despensa artesanal` and `Comida preparada` are deliberately absent.
export const CATEGORY_MARKERS = {
  Aceite: ["aceite", "aceites", "aove", "oliva", "olivar", "almazara", "arbequina", "picual", "hojiblanca", "oli", "olivera", "trull"],
  Miel: ["miel", "mieles", "polen", "propoleo", "jalea", "colmena", "colmenar", "apicola", "apicultura", "mel", "ezti"],
  // `vermut` is deliberately in both lists: it is an aromatized wine, and some
  // sixty wineries make one as a side line, so the noun alone does not say the
  // row is filed wrong. It still catches the real thing, because a vermouth
  // maker filed under another category has no wine noun to match either.
  Vino: ["vino", "vinos", "vi", "vins", "vinho", "cava", "cavas", "caves", "bodega", "bodegas", "celler", "cellers", "vina", "vinas", "vinedo", "vinya", "vinyes", "vinicola", "espumoso", "albarino", "verdejo", "raim", "ardo", "txakoli", "txakolina", "vermut", "vermuts", "vermu", "vermouth"],
  Sidra: ["sidra", "sidras", "sidre", "llagar", "sagardo", "sagardoa", "sagardotegia"],
  Vermut: ["vermut", "vermuts", "vermu", "vermouth"],
  Sake: ["sake", "sakes", "junmai", "ginjo", "daiginjo", "nihonshu"],
  Carne: ["embutido", "embutidos", "embotit", "embotits", "fuet", "botifarra", "llonganissa", "chorizo", "xorico", "jamon", "jamones", "pernil", "salchichon", "sobrasada", "morcilla", "cecina", "chacina", "chacinas", "carne", "carnes", "carnicos", "carnica", "carniceria", "carn", "carns"],
  "Lácteos y quesos": ["queso", "quesos", "queixo", "formatge", "formatges", "gazta", "mato", "yogur", "iogurt", "leche", "llet", "esnea", "requeson", "cuajada", "mantequilla", "lacteos"],
  "Pan y cereal": ["pan", "panes", "pa", "panets", "ogi", "coca", "ensaimada", "bolleria", "croissant", "hogaza", "panaderia", "pasteleria", "pastel", "pasteles", "pastis", "pastissos", "pastisseria", "confiteria", "reposteria", "galleta", "galletas", "magdalena", "magdalenas", "empanada", "torta", "tortas", "mantecado", "mantecados", "polvoron", "polvorones", "pestino", "pestinos", "hojaldre", "hojaldres", "rosquilla", "rosquillas", "churro", "churros", "panellet", "panellets", "tortell", "harina", "harinas", "farina", "farines", "espelta", "molienda", "arroz", "arros"],
  Cerveza: ["cerveza", "cervezas", "cervesa", "cerveses", "birra", "lupulo", "garagardo"],
  Conservas: ["conserva", "conservas", "conserves", "escabeche", "pisto", "aceituna", "aceitunas", "olives", "encurtido", "encurtidos", "banderilla", "banderillas"],
  Legumbres: ["alubia", "alubias", "judia", "judias", "garbanzo", "garbanzos", "cigro", "cigrons", "lenteja", "lentejas", "llentia", "llenties", "faba", "fabas", "legumbre", "legumbres", "llegum", "llegums", "mongeta", "mongetes"],
  "Fruta y verdura": ["hortaliza", "hortalizas", "hortalisses", "horta", "huerta", "verdura", "verduras", "verdures", "fruta", "frutas", "fruita", "fruites", "tomate", "tomates", "tomaquet", "cereza", "cerezas", "cirera", "cireres", "naranja", "naranjas", "taronja", "patata", "patatas", "patates", "calcot", "calcots", "carxofa", "carxofes", "pesol", "pesols", "bleda", "bledes", "pebrot", "pebrots", "espinac", "espinacs", "moniato", "albercoc", "albercocs", "pressec", "pressecs", "poma", "carbasso"],
  Pescado: ["pescado", "pescados", "peix", "peixos", "arrain", "marisco", "mariscos", "marisc", "atun", "bacalao", "anchoa", "anchoas", "mejillon", "mejillones", "salazon", "salazones"],
  Huevos: ["huevo", "huevos", "ou", "ous", "ovo", "ovos", "ponedora", "ponedoras"],
  "Frutos secos": ["almendra", "almendras", "ametlla", "ametlles", "avellana", "avellanas", "avellanes", "nuez", "nueces", "pistacho", "pistachos", "castana", "castanas", "castanya"],
  Setas: ["trufa", "trufas", "tofona", "tofones", "seta", "setas", "bolet", "bolets", "hongo", "hongos", "boletus", "champinon", "champinones"],
  Chocolate: ["chocolate", "chocolates", "xocolata", "cacao", "bombon", "bombones"],
  "Destilados y licores": ["licor", "licores", "licors", "orujo", "aguardiente", "ginebra", "ginebras", "destileria", "pacharan"],
  Helados: ["helado", "helados", "gelat", "gelats", "gelateria", "sorbete", "sorbetes"],
};

// Rows whose `productos estrella` describes a category not assigned to the
// row: the 2026-06-21 bulk import copied that field, and the description with
// it, across category boundaries.
//
// Only `productos estrella` triggers. `descripcion` was measured as a trigger
// too and rejected: it is prose, so it flags legitimate mentions (a brewery
// ageing beer in wine casks, a pastry made with olive oil) at a rate that
// buries the real hits. Read it as corroboration once a row is flagged — it is
// usually the field that tells you which of the two is the corrupted one.
export function loadCrossTemplate(rows) {
  const registry = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data", "reference", "categories.json"), "utf8"),
  );
  const canonical = (label) => registry.retiredCategories?.[label] ?? label;
  // A retired label and its replacement are the same category: comparing
  // without resolving them turns taxonomy drift into fake contamination.
  const labels = new Map();
  for (const label of [...registry.categories, ...Object.keys(registry.retiredCategories ?? {})]) {
    labels.set(norm(label), canonical(label));
  }
  const markers = new Map(Object.entries(CATEGORY_MARKERS).map(([c, m]) => [canonical(c), m]));

  const wordsOf = (text) => new Set(norm(text).split(" ").filter(Boolean));
  // A noun introduced by "con"/"de" is a flavour or an ingredient of the
  // product before it, not a product line: "sobaos con chocolate" is a bakery,
  // "queso de oveja con aceite" is a dairy. Only the head nouns count as
  // evidence of another category.
  const MODIFIER_HEADS = new Set(["con", "de", "del", "amb", "al", "a"]);
  const headWordsOf = (text) => {
    const tokens = norm(text).split(" ").filter(Boolean);
    return new Set(tokens.filter((_, i) => i === 0 || !MODIFIER_HEADS.has(tokens[i - 1])));
  };
  const categoriesNamedBy = (text, { heads = false } = {}) => {
    const found = new Set();
    for (const part of text.split(/[,;|/]/)) {
      const label = labels.get(norm(part));
      if (label) found.add(label);
    }
    const words = heads ? headWordsOf(text) : wordsOf(text);
    for (const [category, nouns] of markers) {
      if (nouns.some((noun) => words.has(noun))) found.add(category);
    }
    return found;
  };

  const hits = new Map(); // `area/slug` -> categories named instead
  for (const { area, rows: provinceRows } of rows) {
    for (const row of provinceRows) {
      const estrella = (row["productos estrella"] ?? "").trim();
      if (!estrella || !row.categoria) continue;
      const assigned = new Set(rowCategories(row).map(canonical));
      // The trade name is not a product: "Conservas Senra" does not make a
      // fish cannery a preserves maker, and dropping its words is what stops
      // the check from reading brands as evidence.
      const brand = wordsOf(row.nombre);
      const foreign = categoriesNamedBy(
        norm(estrella)
          .split(" ")
          .filter((word) => !brand.has(word))
          .join(" "),
        { heads: true },
      );

      // Every comma-separated item is a taxonomy label, so the field holds
      // categories instead of products. The anomaly is structural, not lexical:
      // it survives the brand overlap ("Aceitunas Oliber" filed under `Despensa
      // artesanal`) and does not need `own` to have markers.
      const parts = estrella.split(/[,;|]/).map((p) => norm(p)).filter(Boolean);
      if (parts.length && parts.every((p) => labels.has(p))) {
        const named = [...new Set(parts.map((p) => labels.get(p)))];
        if (!named.some((category) => assigned.has(category))) {
          hits.set(`${area}/${row.slug}`, named);
          continue;
        }
      }

      if (![...assigned].some((category) => markers.has(category))) continue;
      if ([...categoriesNamedBy(estrella)].some((category) => assigned.has(category))) continue;
      for (const category of assigned) foreign.delete(category);
      if (foreign.size) hits.set(`${area}/${row.slug}`, [...foreign]);
    }
  }
  return hits;
}

export function findCategoryVariants(usage, retiredCategories = {}) {
  const canonical = new Set(usage.keys());
  const variants = new Set();

  // Retired labels that still carry rows. Registry, not heuristic: these were
  // ruled on once and the ruling has to survive the fact that some of them are
  // now the majority spelling in their own province.
  for (const label of Object.keys(retiredCategories)) {
    if (usage.has(label)) variants.add(label);
  }

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
  // The defect is `Aceite y vino` (7 rows) next to `Aceite` and `Vino`.
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

export function loadCategoryVariants() {
  // Always across every province, even under --area: which spelling is the
  // majority is a property of the catalog, not of the file being inspected.
  // Scoped to one province, Málaga's 2 `Carne` rows would look like the
  // minority variant of its 4 `Carnes`, when nationally it is the reverse.
  const usage = new Map();
  for (const { rows } of readAreas({ all: true })) {
    for (const row of rows) {
      for (const category of rowCategories(row)) {
        usage.set(category, (usage.get(category) ?? 0) + 1);
      }
    }
  }
  const registry = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data", "reference", "categories.json"), "utf8"),
  );
  return findCategoryVariants(usage, registry.retiredCategories ?? {});
}

let areaCache = null;
export function filterAreas(areas, { country = "", area = "" } = {}) {
  return areas.filter(
    (entry) => (!country || entry.country === country) && (!area || entry.area === area),
  );
}

function readAreas({ all = false } = {}) {
  if (!areaCache) {
    areaCache = [];
    for (const country of fs.readdirSync(CSV_ROOT)) {
      const countryDir = path.join(CSV_ROOT, country);
      if (!fs.statSync(countryDir).isDirectory()) continue;
      for (const region of fs.readdirSync(countryDir)) {
        const regionDir = path.join(countryDir, region);
        if (!fs.statSync(regionDir).isDirectory()) continue;
        for (const file of fs.readdirSync(regionDir)) {
          if (!file.endsWith(".csv")) continue;
          const area = file.replace(/\.csv$/, "");
          const rows = parse(fs.readFileSync(path.join(regionDir, file), "utf8"), {
            bom: true,
            columns: true,
            skip_empty_lines: true,
          });
          areaCache.push({
            country,
            region,
            area,
            key: `${country}/${region}/${area}`,
            rows,
          });
        }
      }
    }
  }
  if (all) return areaCache;
  return filterAreas(areaCache, { country: onlyCountry, area: onlyArea });
}

// slug -> fecha de la fuente más reciente del registro `keep`. La fecha es lo
// único que la evidencia sabe y el CSV no: cuándo se vio la prueba.
function readEvidence(country, region, area) {
  const file = path.join(EVIDENCE_ROOT, country, region, `${area}.jsonl`);
  const keep = new Map();
  if (!fs.existsSync(file)) return keep;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      if (record.action !== "keep") continue;
      const checked = (record.sources ?? [])
        .map((source) => source.checkedAt)
        .filter(Boolean)
        .sort()
        .pop();
      keep.set(record.slug, checked ?? "");
    } catch {
      // A malformed evidence line is check:evidence's job to report, not ours.
    }
  }
  return keep;
}

const STALE_DAYS = 365;
const staleBefore = new Date(Date.now() - STALE_DAYS * 86400000)
  .toISOString()
  .slice(0, 10);

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
    hint: "docs/EDITORIAL_POLICY.md § Decision order: cruzar contra la fuente exhaustiva de la region antes de decidir",
    run: ({ rows }) =>
      rows.filter(
        (r) =>
          !r.web && !r.telefono && !r.correo && !r.Facebook && !r.Instagram && !r["Google Maps"],
      ),
  },
  {
    id: "identidad-duplicada",
    kind: "cola",
    label: "mismo `nombre + municipio` normalizado en varias filas del área",
    hint: "compara unidad productiva, contacto y dominio; fusiona solo si es la misma unidad",
    run: ({ rows }) =>
      duplicateRows(rows, (row) => {
        const name = norm(row.nombre);
        const municipality = norm(row.municipio);
        return name && municipality ? `${name}|${municipality}` : "";
      }),
  },
  {
    id: "descripcion-duplicada",
    kind: "cola",
    label: "misma `descripcion` larga publicada en varias filas del área",
    hint: "una descripción compartida suele ser plantilla; vacíala o escribe solo hechos propios",
    run: ({ rows }) =>
      duplicateRows(rows, (row) => {
        const description = norm(row.descripcion);
        return description.length >= 30 ? description : "";
      }),
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
    id: "maps-sin-ficha",
    kind: "cola",
    label: "`Google Maps` abre solo un pin de coordenadas, no una ficha del productor",
    hint: "verifica una ficha de la misma unidad y publica su query_place_id; si no existe, vacía Google Maps y conserva lat/lon",
    run: ({ rows }) => rows.filter((r) => isCoordinateOnlyMapsUrl(r["Google Maps"])),
  },
  {
    id: "web-de-tercero",
    kind: "cola",
    label: `\`web\` compartida por >=${SHARED_DOMAIN_THRESHOLD} filas de la area (consejo, mercado o blog haciendo de web propia)`,
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
  // on one metric is worse than one tool owning it. The centroid-fallback count
  // stays there for the same reason: check:csv prints it as "centroid fallback
  // coordinates" off the same lookup.
  //
  // What is left is the one geographic state no gate measures at all. A row with
  // both cells empty never reaches that centroid block, so it is not an error,
  // not a warning, and not in either count: it simply is not on the map.
  {
    id: "sin-coordenada",
    kind: "senal",
    label: "sin `lat`/`lon`: la fila no aparece en el mapa",
    hint: "docs/GEOLOCATION.md; el punto es la unidad productiva, y una celda vacía es mejor que un punto convincente y equivocado",
    // Both cells: a half-filled pair is a blocking contract error and belongs to
    // check:csv, not to an advisory coverage count.
    run: ({ rows }) => rows.filter((r) => !r.lat && !r.lon),
  },
  {
    id: "categoria-variante",
    kind: "cola",
    label: "categoría primaria o adicional retirada del registro, o variante minoritaria de otra en uso",
    hint: "los filtros leen ambas columnas con tokens exactos: corrige la variante en el campo donde aparezca",
    run: ({ rows }, ctx) =>
      rows.filter((row) =>
        rowCategories(row).some((category) => ctx.categoryVariants.has(category)),
      ),
  },
  {
    id: "plantilla-cruzada",
    kind: "cola",
    label: "`productos estrella` describe una categoría no asignada a la fila",
    hint: "candidatos, no veredictos: decide si sobra el producto o falta/cambia una categoría con evidencia suficiente",
    run: ({ rows, area }, ctx) =>
      rows.filter((r) => ctx.crossTemplate.has(`${area}/${r.slug}`)),
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
    hint: "el mayor hueco abierto; el criterio de sí/no/no comprobado está en docs/EDITORIAL_POLICY.md",
    run: ({ rows }) => rows.filter((r) => r["Venta online"] === "no comprobado"),
  },
  {
    id: "sin-imagen",
    kind: "senal",
    label: "sin `imagen`",
    hint: "docs/IMAGES.md; revisa --contact-sheet y aplica un slug con el --candidate aprobado",
    run: ({ rows }) => rows.filter((r) => !r.imagen),
  },
  {
    id: "sin-evidencia",
    kind: "senal",
    label: "filas sin registro `keep` en el ledger de evidencia",
    hint: "la evidencia es opcional y advisory; falta-keep NO es deuda que haya que backfillear",
    run: ({ rows, country, region, area }) => {
      const keep = readEvidence(country, region, area);
      return rows.filter((r) => !keep.has(r.slug));
    },
  },
  {
    id: "venta-caducada",
    kind: "senal",
    label: `\`Venta online=sí\` con la fuente vista hace más de ${STALE_DAYS} días`,
    hint: "reabre la tienda y actualiza `checkedAt` en el registro `keep`; docs/EVIDENCE_CONTRACT.md",
    run: ({ rows, country, region, area }) => {
      const keep = readEvidence(country, region, area);
      return rows.filter((r) => {
        if (r["Venta online"] !== "sí") return false;
        const checked = keep.get(r.slug);
        // Sin registro no hay fecha: eso lo cuenta `sin-evidencia`, no esto.
        return Boolean(checked) && checked < staleBefore;
      });
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
  const provinces = readAreas();
  if (provinces.length === 0) {
    if (onlyArea) {
      console.error(`No existe la area "${onlyArea}" en el alcance pedido.`);
    } else if (onlyCountry) {
      console.error(`No existe el país "${onlyCountry}".`);
    } else {
      console.error("No hay CSV.");
    }
    process.exit(1);
  }

  const ctx = {
    categoryVariants: loadCategoryVariants(),
    crossTemplate: loadCrossTemplate(provinces),
  };
  const checks = onlyCheck ? CHECKS.filter((c) => c.id === onlyCheck) : CHECKS;
  if (checks.length === 0) {
    console.error(`Check desconocido "${onlyCheck}". Disponibles: ${CHECKS.map((c) => c.id).join(", ")}`);
    process.exit(1);
  }

  const results = [];
  const queueMembership = new Map(); // `area/slug` -> Set of `cola` check ids
  const plantillaRows = [];
  for (const province of provinces) {
    const entry = { area: province.area, filas: province.rows.length, checks: {} };
    for (const check of checks) {
      const hits = check.run(province, ctx);
      entry.checks[check.id] = wantList || wantJson ? hits.map((r) => r.slug) : hits.length;
      if (check.kind === "cola") {
        for (const row of hits) {
          const key = `${province.area}/${row.slug}`;
          if (!queueMembership.has(key)) queueMembership.set(key, new Set());
          queueMembership.get(key).add(check.id);
        }
      }
      if (wantPlantillas && check.id === "descripcion-generica") {
        for (const row of hits) plantillaRows.push({ area: province.area, row });
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
      .map((r) => [r.area, count(r, check.id)])
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1]);
    const total = affected.reduce((sum, [, n]) => sum + n, 0);

    const suffix = check.kind === "senal" ? " · señal, no cola" : "";
    console.log(`## ${check.id} — ${total} filas en ${affected.length} areas${suffix}`);
    console.log(`   ${check.label}`);
    if (total > 0) {
      console.log(`   → ${check.hint}`);
      console.log(`   ${affected.map(([p, n]) => `${p}:${n}`).join(" · ")}`);
      if (wantList) {
        for (const entry of results) {
          const slugs = entry.checks[check.id];
          if (Array.isArray(slugs) && slugs.length > 0) {
            console.log(`     ${entry.area}: ${slugs.join(", ")}`);
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
    console.log(
      "Detalle por fila: --check <id> --list · un país: --country <iso> · una area: --area <nombre> · JSON: --json",
    );
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
  for (const { area, row } of entries) {
    const shape = templateShape(row.descripcion);
    if (!byShape.has(shape)) byShape.set(shape, { filas: [], areas: new Set() });
    const group = byShape.get(shape);
    group.filas.push({ area, slug: row.slug, descripcion: row.descripcion });
    group.areas.add(area);
  }
  const groups = [...byShape.entries()].sort((a, b) => b[1].filas.length - a[1].filas.length);

  console.log(
    `Plantillas de descripción — ${entries.length} filas en ${groups.length} formas distintas\n`,
  );
  for (const [shape, group] of groups) {
    console.log(`## ${group.filas.length} filas · ${[...group.areas].join(", ")}`);
    console.log(`   ${shape}`);
    console.log(`   ej.: ${group.filas[0].descripcion}`);
    if (wantList) {
      for (const area of group.areas) {
        const slugs = group.filas.filter((f) => f.area === area).map((f) => f.slug);
        console.log(`     ${area}: ${slugs.join(", ")}`);
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
