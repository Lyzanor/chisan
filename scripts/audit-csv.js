#!/usr/bin/env node

// Shared by every area CSV, in this order. Its length may grow through the
// repository-wide migration documented in docs/CSV_CONTRACT.md.
const CANONICAL_HEADER = Object.freeze([
  "slug",
  "nombre",
  "municipio",
  "categoria",
  "productos estrella",
  "direccion",
  "descripcion",
  "horario",
  "telefono",
  "correo",
  "web",
  "Facebook",
  "Instagram",
  "Google Maps",
  "lat",
  "lon",
  "imagen",
  "verificacion",
  "Venta online",
  "Canal de venta",
  "categorias adicionales",
  "producer_id",
]);

// Controlled values are matched exactly, not case/diacritic folded: the CSVs are
// the product surface, so 'Sí' or 'VERIFICADO' are drift to fix, not variants to
// accept silently.
const VERIFICATION_COLUMN = "verificacion";
const VERIFICATION_LEVELS = new Set(["pendiente", "parcial", "verificado"]);
const ONLINE_SALES_COLUMN = "Venta online";
const ONLINE_SALES_VALUES = new Set(["sí", "no", "no comprobado"]);
const ONLINE_SALES_DISPLAY_VALUES = "sí, no, no comprobado";
// One address only: a cell holding several separated by ';', '/' or ',' has no
// single usable contact and breaks any consumer that treats it as an email.
const EMAIL_PATTERN = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;
const SALES_CHANNEL_COLUMN = "Canal de venta";
const SALES_CHANNEL_SEPARATOR = "|";
const SALES_CHANNEL_VALUES = new Set([
  "ecommerce",
  "whatsapp",
  "email",
  "telefono",
  "suscripcion",
  "marketplace",
]);
const SALES_CHANNEL_DISPLAY_VALUES =
  "ecommerce, whatsapp, email, telefono, suscripcion, marketplace";
const ADDITIONAL_CATEGORIES_COLUMN = "categorias adicionales";
const PRODUCER_ID_COLUMN = "producer_id";
const CATEGORY_SEPARATOR = "|";
const CENTROID_MAX_DISTANCE_KM = 15;
// Beyond this, the gap is no longer "edge of a large municipal term" but a
// different municipio: a blocking error (wrong lat/lon or wrong municipio).
const CENTROID_BLOCKING_DISTANCE_KM = 100;
// Coordinates copied from a municipality centroid are an explicit coarse
// fallback, not an exact producer location. Count them without emitting one
// warning per row; the full audit summary keeps the limitation visible.
const CENTROID_FALLBACK_TOLERANCE_DEG = 1e-5;
const CENTROIDS_RELATIVE_PATH = "data/reference/municipalities.json";
const CENTROIDS_OVERRIDES_RELATIVE_PATH = "data/reference/municipality-overrides.json";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PRODUCER_ID_PATTERN = /^[1-9]\d*$/;
const COUNTRY_PATTERN = /^[a-z]{2}$/;
const RESERVED_AREA_SLUGS = new Set(["events", "retail"]);
const COUNTRY_GUIDE_HEADINGS = ["## Operating state", "## Country rules", "## Source ceilings"];
let PREFERRED_CATEGORY_ALIASES = new Map();
let VALID_CATEGORIES = new Set();
let RESERVED_PRODUCER_SLUGS = new Set();
// Labels the 2026-06-21 consolidation folded into another one, mapped to their
// replacement. A retired label that is still in VALID_CATEGORIES has rows left
// to migrate; once it reaches zero uses it leaves the valid list and comes back
// only as a contract error. See docs/CSV_CONTRACT.md § Categories.
let RETIRED_CATEGORIES = new Map();

function usage() {
  console.log(`Usage: node scripts/audit-csv.js <csv-or-directory> [...]
       node scripts/audit-csv.js --all
       node scripts/audit-csv.js --changed
       node scripts/audit-csv.js --registry <csv-root>

Scopes:
  --all       Audit every area CSV and the country/region/area registry.
  --changed   Audit CSVs changed against HEAD and the current registry.
  --registry  Audit only a country/region/area registry (mainly useful for tests).
  -h, --help  Show this help.`);
}

function parseArgs(argv, resolvePath) {
  let all = false;
  let changed = false;
  let registry = null;
  let help = false;
  const targets = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--all") {
      all = true;
    } else if (arg === "--changed") {
      changed = true;
    } else if (arg === "--registry") {
      const registryPath = argv[++index];
      if (!registryPath) throw new Error("--registry requires a CSV root path");
      registry = resolvePath(registryPath);
    } else if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (arg.startsWith("--")) {
      throw new Error(`unknown argument '${arg}'`);
    } else {
      targets.push(resolvePath(arg));
    }
  }

  const scopes = Number(all) + Number(changed) + Number(Boolean(registry)) + Number(targets.length > 0);
  if (!help && scopes !== 1) {
    throw new Error("choose exactly one scope: --all, --changed, or one or more paths");
  }

  return { all, changed, registry, help, targets };
}

let dependenciesPromise;

function loadCategoryConfig(fs, path) {
  const configPath = path.resolve(__dirname, "../data/reference/categories.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  PREFERRED_CATEGORY_ALIASES = new Map(Object.entries(config.preferredAliases));
  VALID_CATEGORIES = new Set(config.categories);
  RESERVED_PRODUCER_SLUGS = new Set(config.categories.map(slugifySegment));
  RETIRED_CATEGORIES = new Map(Object.entries(config.retiredCategories ?? {}));
}

async function getDependencies() {
  if (!dependenciesPromise) {
    dependenciesPromise = Promise.all([
      import("node:fs"),
      import("node:path"),
      import("node:child_process"),
      import("csv-parse/sync"),
    ]).then(([fs, path, childProcess, csvParse]) => {
      loadCategoryConfig(fs, path);
      return {
        fs,
        path,
        execFileSync: childProcess.execFileSync,
        parse: csvParse.parse,
      };
    });
  }

  return dependenciesPromise;
}

function directoryNames(fs, parent) {
  return fs
    .readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function auditAreaRegistry(root = "data/csv") {
  const { fs, path } = await getDependencies();
  const registryRoot = path.resolve(root);
  const errors = [];
  const areas = new Map();

  if (!fs.existsSync(registryRoot)) {
    return { registryRoot, areas: 0, errors: [`Area registry not found: ${registryRoot}`] };
  }

  for (const country of directoryNames(fs, registryRoot)) {
    if (!COUNTRY_PATTERN.test(country)) {
      errors.push(`country '${country}' must be a lowercase ISO alpha-2 slug`);
    }

    const countryDir = path.join(registryRoot, country);
    const countryGuidePath = path.join(countryDir, "AGENTS.md");
    if (!fs.existsSync(countryGuidePath)) {
      errors.push(`country '${country}' must contain AGENTS.md`);
    } else {
      const headings = fs
        .readFileSync(countryGuidePath, "utf8")
        .split(/\r?\n/)
        .filter((line) => line.startsWith("## "));
      if (JSON.stringify(headings) !== JSON.stringify(COUNTRY_GUIDE_HEADINGS)) {
        errors.push(
          `country guide '${country}/AGENTS.md' must use exactly: ${COUNTRY_GUIDE_HEADINGS.join(", ")}`,
        );
      }
    }

    const manifestPath = path.join(countryDir, "country.json");
    let areaAliases = [];
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        areaAliases = Object.entries(manifest.aliases ?? {});
        for (const [alias] of areaAliases) {
          if (!SLUG_PATTERN.test(alias)) {
            errors.push(`area alias '${country}/${alias}' must be lowercase ASCII kebab-case`);
          }
          if (RESERVED_AREA_SLUGS.has(alias)) {
            errors.push(`area alias '${country}/${alias}' uses reserved route segment '${alias}'`);
          }
        }
      } catch (error) {
        errors.push(`country manifest '${country}/country.json' is not valid JSON: ${error.message}`);
      }
    }

    for (const region of directoryNames(fs, countryDir)) {
      if (!SLUG_PATTERN.test(region)) {
        errors.push(`region '${country}/${region}' must be lowercase ASCII kebab-case`);
      }

      const regionDir = path.join(countryDir, region);
      for (const file of fs.readdirSync(regionDir).sort()) {
        if (!file.endsWith(".csv")) continue;

        const area = file.slice(0, -4);
        const relativePath = path.join(country, region, file);
        if (!SLUG_PATTERN.test(area)) {
          errors.push(`area '${relativePath}' must be lowercase ASCII kebab-case`);
        }
        if (RESERVED_AREA_SLUGS.has(area)) {
          errors.push(`area '${relativePath}' uses reserved route segment '${area}'`);
        }

        const areaKey = `${country}/${area}`;
        const previous = areas.get(areaKey);
        if (previous) {
          errors.push(
            `area slug '${area}' is duplicated within country '${country}' by '${previous}' and '${relativePath}'`,
          );
        } else {
          areas.set(areaKey, relativePath);
        }
      }
    }

    for (const [alias, target] of areaAliases) {
      if (!areas.has(`${country}/${target}`)) {
        errors.push(
          `area alias '${country}/${alias}' targets '${target}', which is not an area in country '${country}'`,
        );
      }
    }
  }

  return { registryRoot, areas: areas.size, errors };
}

function printRegistryReport(result) {
  if (result.errors.length > 0) {
    console.error("Area registry contract failed");
    for (const error of result.errors) console.error(`- ${error}`);
    return false;
  }
  console.log(`Area registry contract OK (${result.areas} areas)`);
  return true;
}

function walkCsvFiles(fs, path, target) {
  if (!fs.existsSync(target)) throw new Error(`path not found: ${target}`);
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (!target.endsWith(".csv")) throw new Error(`not a CSV file: ${target}`);
    return [target];
  }
  if (!stat.isDirectory()) throw new Error(`unsupported path: ${target}`);

  const files = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const child = path.join(target, entry.name);
    if (entry.isDirectory()) files.push(...walkCsvFiles(fs, path, child));
    else if (entry.isFile() && entry.name.endsWith(".csv")) files.push(child);
  }
  return files.sort();
}

function changedCsvFiles(fs, path, execFileSync, root) {
  const files = new Set();
  const collect = (args) => {
    let output = "";
    try {
      output = execFileSync("git", args, {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      return;
    }
    for (const relative of output.split(/\r?\n/).filter(Boolean)) {
      const absolute = path.join(root, relative);
      if (relative.endsWith(".csv") && fs.existsSync(absolute)) files.add(absolute);
    }
  };

  collect(["diff", "--name-only", "--diff-filter=ACMR", "--", "data/csv"]);
  collect(["diff", "--name-only", "--diff-filter=ACMR", "--cached", "--", "data/csv"]);
  collect(["ls-files", "--others", "--exclude-standard", "--", "data/csv"]);
  return [...files].sort();
}

async function resolveCsvFiles(args) {
  const { fs, path, execFileSync } = await getDependencies();
  const root = path.resolve(__dirname, "..");
  if (args.all) return walkCsvFiles(fs, path, path.join(root, "data", "csv"));
  if (args.changed) return changedCsvFiles(fs, path, execFileSync, root);
  return [...new Set(args.targets.flatMap((target) => walkCsvFiles(fs, path, target)))].sort();
}

async function resolveIdentityCsvFiles(args, auditedFiles) {
  if (!args.changed || auditedFiles.length === 0) return auditedFiles;

  const { fs, path } = await getDependencies();
  const csvRoot = path.resolve(__dirname, "..", "data", "csv");
  const countries = new Set(
    auditedFiles
      .map((csvPath) => path.relative(csvRoot, csvPath).split(path.sep)[0])
      .filter((country) => COUNTRY_PATTERN.test(country)),
  );

  return [...countries]
    .flatMap((country) => walkCsvFiles(fs, path, path.join(csvRoot, country)))
    .sort();
}

function cleanCell(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

// `œ` and `æ` are single letters with no Unicode decomposition, so NFD leaves
// them intact and `Belœil` never meets a row spelling itself `Beloeil`. They are
// folded here and identically in scripts/build-municipality-centroids.js: the
// centroid keys are produced by that normalizer and looked up by this one, so
// the two must agree letter for letter.
function normalizeSearch(value) {
  return cleanCell(value)
    .replace(/[œŒ]/g, "oe")
    .replace(/[æÆ]/g, "ae")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readAdditionalCategories(value) {
  const raw = cleanCell(value);
  return raw ? raw.split(CATEGORY_SEPARATOR).map((token) => token.trim()) : [];
}

function categoryReplacement(category) {
  return (
    RETIRED_CATEGORIES.get(category) ??
    PREFERRED_CATEGORY_ALIASES.get(normalizeSearch(category))
  );
}

function slugifySegment(value) {
  return cleanCell(value)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/ł/g, "l")
    .replace(/ð/g, "d")
    .replace(/þ/g, "th")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function parseCoordinate(rawValue, maxAbs, integerDigits) {
  const cleaned = cleanCell(rawValue);
  if (!cleaned) {
    return null;
  }

  const normalized = cleaned.replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  const digits = cleaned.replace(/[^\d]/g, "");
  const sign = cleaned.startsWith("-") ? -1 : 1;
  const looksLikeGroupedCoordinate = /^-?\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?$/.test(cleaned);

  if (!looksLikeGroupedCoordinate || !digits) {
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }

  for (const wholeDigits of integerDigits) {
    if (digits.length <= wholeDigits) {
      continue;
    }

    const inferred = sign * Number.parseFloat(
      `${digits.slice(0, wholeDigits)}.${digits.slice(wholeDigits)}`,
    );

    if (Number.isFinite(inferred) && Math.abs(inferred) <= maxAbs) {
      return inferred;
    }
  }

  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function readUrl(value) {
  const trimmed = cleanCell(value);

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { error: "must use http or https" };
    }

    return { url };
  } catch {
    return { error: "is not a valid URL" };
  }
}

function matchesHost(hostname, matcher) {
  const host = hostname.toLowerCase();
  return host === matcher || host.endsWith(`.${matcher}`);
}

function validateGoogleMapsUrl(url) {
  const host = url.hostname.toLowerCase();
  const isGoogleMapsHost =
    /^([a-z0-9-]+\.)*google\.[a-z.]+$/i.test(host) && url.pathname.startsWith("/maps");
  const isGoogleMapsShortUrl = host === "maps.app.goo.gl";

  if (!isGoogleMapsHost && !isGoogleMapsShortUrl) {
    return "must point to a Google Maps URL";
  }

  return null;
}

function isCoordinateMapsQuery(query) {
  const match = cleanCell(query).match(
    /^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/,
  );
  if (!match) {
    return false;
  }

  const lat = Number.parseFloat(match[1]);
  const lon = Number.parseFloat(match[2]);
  return Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

function googleMapsQualityWarnings(url) {
  const host = url.hostname.toLowerCase();
  if (host === "maps.app.goo.gl") {
    return [
      "shortened maps.app.goo.gl URL is opaque; use a canonical /maps/search/?api=1 URL",
    ];
  }

  if (!/^\/maps\/search\/?$/.test(url.pathname)) {
    return [
      "copied interface URL is not canonical; use a /maps/search/?api=1 URL",
    ];
  }

  const warnings = [];
  const query = url.searchParams.get("query") ?? "";
  const placeId = cleanCell(url.searchParams.get("query_place_id"));

  if (url.searchParams.get("api") !== "1") {
    warnings.push("search URL must include api=1");
  }
  if (!cleanCell(query)) {
    warnings.push("search URL must include a non-empty query");
  } else if (!placeId) {
    if (isCoordinateMapsQuery(query)) {
      warnings.push(
        "coordinate-only link opens a pin, not a producer listing; leave Google Maps empty unless a matching query_place_id is verified",
      );
    } else {
      warnings.push(
        "textual search has no query_place_id and does not anchor a specific place",
      );
    }
  }

  return warnings;
}

// A social link is only useful when it reaches the producer's own profile.
// Facebook's /p/<name>-<id> and /pages/<name> and /profile.php?id= forms are all
// real pages, so only the network's own surfaces are rejected here.
function socialProfileError(url) {
  const segments = url.pathname.split("/").filter(Boolean);

  if (!segments.length) {
    return "points to the network home page, not a producer profile";
  }

  const [first] = segments;

  if (first === "_n" || first === "explore") {
    return "points to a feed or explore page, not a producer profile";
  }

  if (first === "pages" && segments.length === 1) {
    return "points to the pages index, not a producer profile";
  }

  if (first === "p" && matchesHost(url.hostname, "instagram.com")) {
    return "points to a single post, not a producer profile";
  }

  return null;
}

function validateImagePath(value) {
  const cleaned = cleanCell(value);

  if (!cleaned) {
    return null;
  }

  if (!cleaned.startsWith("/")) {
    return "must be a root-relative asset path under /public";
  }

  if (!/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(cleaned)) {
    return "must use a supported image extension";
  }

  return null;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function loadCentroids() {
  const { fs, path } = await getDependencies();
  const mainPath = path.join(__dirname, "..", CENTROIDS_RELATIVE_PATH);
  if (!fs.existsSync(mainPath)) return null;
  const main = JSON.parse(fs.readFileSync(mainPath, "utf8"));
  const overridesPath = path.join(__dirname, "..", CENTROIDS_OVERRIDES_RELATIVE_PATH);
  const overrides = fs.existsSync(overridesPath)
    ? JSON.parse(fs.readFileSync(overridesPath, "utf8"))
    : {};
  return { main, overrides };
}

// `data/csv/<country>/<region>/<area>.csv`. Both centroid files are keyed by
// country first, because a municipio name only means one thing inside one
// country: `Chiba` is a Japanese city and `Chiva` a Valencian one, and they
// normalize to the same key. Inside a country the overrides disambiguate
// homonyms by region, so both segments are the scope of a lookup.
function inferScope(csvPath) {
  const normalized = String(csvPath ?? "").replace(/\\/g, "/");
  const match = /(?:^|\/)data\/csv\/([^/]+)\/([^/]+)\//.exec(normalized);
  return match ? { country: match[1], region: match[2] } : { country: null, region: null };
}

function pickCandidate(entry, scope) {
  if (Array.isArray(entry)) {
    if (!scope.region) return null;
    return entry.find((c) => c.region === scope.region) ?? null;
  }
  return entry;
}

// Spellings of one `municipio` worth trying against the centroid lookup, most
// literal first. Three shapes appear in the CSVs and only the first was handled:
//   `Ciudad - Distrito`            -> the city
//   `Puente la Reina / Gares`      -> either half; both name the same town
//   `Granollers (Palou)`           -> either half, and the order is not stable:
//                                     Catalonia writes both `municipi (llogaret)`
//                                     and `llogaret (municipi)`
// Only one half is normally a municipio, so trying them in order picks it. When
// both are, the first wins and the distance check is what catches a bad guess —
// this resolves a lookup, it does not assert the row is right.
function municipioCandidates(municipio) {
  const candidates = [municipio];
  const push = (value) => {
    const trimmed = value.trim();
    if (trimmed && !candidates.includes(trimmed)) candidates.push(trimmed);
  };
  push(municipio.split(" - ")[0]);
  for (const part of municipio.split(/\s*\/\s*|\s*[()]\s*/)) push(part);
  return candidates;
}

function lookupCentroid(centroids, municipio, scope) {
  if (!centroids || !municipio || !scope.country) return null;
  const main = centroids.main[scope.country];
  const overrides = centroids.overrides[scope.country] ?? {};
  if (!main) return null;
  const keys = municipioCandidates(municipio).map(normalizeSearch);
  // An override is the curated answer for a name already known to be
  // ambiguous, so it decides on its own — including deciding to say nothing
  // when no community matches. Letting a stray `main` entry outvote it would
  // undo the disambiguation it exists for.
  for (const key of keys) {
    if (overrides[key]) return pickCandidate(overrides[key], scope);
  }
  const resolved = keys.map((key) => main[key]).filter(Boolean);
  if (!resolved.length) return null;

  // Several halves resolve. A bilingual pair names one town — `Ujué / Uxue`
  // and `Roncal / Erronkari` land on the same coordinates — so they agree. A
  // homonym does not: `La Floresta (Sant Cugat del Vallès)` resolves both to
  // the Lleida municipality and to Sant Cugat, 96 km apart, and picking the
  // first would invent a 96 km gap on a correct row. Trust the lookup only
  // while the candidates agree inside the tolerance the distance check itself
  // uses; otherwise return nothing, which is what these rows got before.
  const [first, ...rest] = resolved;
  const disagrees = rest.some(
    (candidate) =>
      haversineKm(first.lat, first.lon, candidate.lat, candidate.lon) > CENTROID_MAX_DISTANCE_KM,
  );
  return disagrees ? null : first;
}

// The nearest centroid is a hint for the editor, so it stays inside the row's
// own country: "closest centroid is Alix (1.6 km)" helps, a town two countries
// away does not.
function flattenCentroids(centroids, country) {
  if (!centroids || !country) return [];
  if (!centroids._flat) {
    Object.defineProperty(centroids, "_flat", { value: new Map(), enumerable: false });
  }
  const cached = centroids._flat.get(country);
  if (cached) return cached;
  const flat = [];
  const collect = (entry) => {
    if (!entry) return;
    if (Array.isArray(entry)) {
      for (const candidate of entry) {
        if (candidate && typeof candidate.lat === "number") flat.push(candidate);
      }
    } else if (typeof entry.lat === "number") {
      flat.push(entry);
    }
  };
  for (const value of Object.values(centroids.main?.[country] || {})) collect(value);
  for (const value of Object.values(centroids.overrides?.[country] || {})) collect(value);
  centroids._flat.set(country, flat);
  return flat;
}

// Closest municipio centroid to a coordinate. Used to turn a "far from the
// declared municipio" warning into an actionable "this pin actually sits in X".
function findNearestCentroid(centroids, country, lat, lon) {
  let best = null;
  let bestKm = Infinity;
  for (const candidate of flattenCentroids(centroids, country)) {
    const km = haversineKm(lat, lon, candidate.lat, candidate.lon);
    if (km < bestKm) {
      bestKm = km;
      best = candidate;
    }
  }
  return best ? { centroid: best, distance: bestKm } : null;
}

// Shared message for the "coords far from the declared municipio" checks. Adds
// the closest municipio centroid when it differs, so an editor can tell which
// field (municipio or lat/lon) is wrong.
function describeCentroidGap(centroids, scope, lat, lon, declared, distance, limitKm) {
  const nearest = findNearestCentroid(centroids, scope.country, lat, lon);
  const nearestNote =
    nearest && normalizeSearch(nearest.centroid.label) !== normalizeSearch(declared.label)
      ? `; closest centroid is ${nearest.centroid.label} (${nearest.distance.toFixed(1)} km) — check whether municipio or lat/lon is wrong`
      : "";
  return `lat/lon is ${distance.toFixed(1)} km from ${declared.label} centroid (threshold ${limitKm} km)${nearestNote}`;
}

async function readCsv(csvPath) {
  const { fs, parse } = await getDependencies();

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found at ${csvPath}`);
  }

  const raw = fs.readFileSync(csvPath, "utf8");
  const firstLine = raw.split(/\r?\n/, 1)[0].replace(/^\uFEFF/, "");
  const headers = firstLine.split(",").map((value) => value.trim());
  const rows = parse(raw, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }).map((row) =>
    Object.fromEntries(Object.entries(row).map(([key, value]) => [key.trim(), cleanCell(value)])),
  );

  return { raw, headers, rows };
}

function createIssueCollector() {
  const issues = [];

  function push(severity, line, id, slug, message) {
    issues.push({
      severity,
      line,
      id,
      slug: slug || "(empty)",
      message,
    });
  }

  return { issues, push };
}

function runContractAudit({ raw, headers, rows, push, centroids, scope, stats }) {
  const slugLines = new Map();
  stats.rows += rows.length;

  // The canonical-header comparison below is positional, so it already covers a
  // missing, duplicated, extra or reordered column, with a message naming the
  // exact position.
  const mismatchIndex = CANONICAL_HEADER.findIndex((column, index) => headers[index] !== column);
  if (mismatchIndex !== -1 || headers.length !== CANONICAL_HEADER.length) {
    const detail =
      mismatchIndex === -1
        ? `it has ${headers.length} columns instead of ${CANONICAL_HEADER.length}`
        : `column ${mismatchIndex + 1} is '${headers[mismatchIndex] ?? "(missing)"}' instead of '${CANONICAL_HEADER[mismatchIndex]}'`;
    push(
      "error",
      1,
      0,
      "(header)",
      `header does not match the canonical header (${detail}); see docs/CSV_CONTRACT.md`,
    );
  }

  if (/\r/.test(raw ?? "")) {
    push("error", 1, 0, "(file)", "line endings must be LF, found CR/CRLF (see .gitattributes)");
  }

  if ((raw ?? "").charCodeAt(0) === 0xfeff) {
    push("error", 1, 0, "(file)", "file must not start with a UTF-8 BOM (usually a spreadsheet export)");
  }

  const validators = {
    web: () => null,
    Facebook: (url) =>
      matchesHost(url.hostname, "facebook.com") ? null : "must point to facebook.com",
    Instagram: (url) =>
      matchesHost(url.hostname, "instagram.com") ? null : "must point to instagram.com",
    "Google Maps": (url) => validateGoogleMapsUrl(url),
  };

  for (const [index, fields] of rows.entries()) {
    const line = index + 2;
    const producerId = cleanCell(fields[PRODUCER_ID_COLUMN]);
    const id = producerId || index + 1;
    const slug = cleanCell(fields.slug);

    if (!producerId) {
      push("error", line, id, slug, `${PRODUCER_ID_COLUMN} is required`);
    } else if (!PRODUCER_ID_PATTERN.test(producerId)) {
      push(
        "error",
        line,
        id,
        slug,
        `${PRODUCER_ID_COLUMN} must be a positive base-10 integer without leading zeroes`,
      );
    } else if (!Number.isSafeInteger(Number(producerId))) {
      push("error", line, id, slug, `${PRODUCER_ID_COLUMN} must be a safe integer`);
    }

    if (!slug) {
      push("error", line, id, slug, "slug is required");
    } else if (!SLUG_PATTERN.test(slug)) {
      push("error", line, id, slug, "slug must be lowercase ASCII words separated by '-'");
    } else if (RESERVED_PRODUCER_SLUGS.has(slug)) {
      push("error", line, id, slug, `slug '${slug}' is reserved for a category route`);
    }

    if (slug) {
      const lines = slugLines.get(slug) ?? [];
      lines.push(line);
      slugLines.set(slug, lines);
    }

    // Identity fields the product cannot render a useful row without: the title,
    // the town it is placed in, and the facet it is filtered by.
    for (const column of ["nombre", "municipio", "categoria"]) {
      if (!cleanCell(fields[column])) {
        push("error", line, id, slug, `${column} is required`);
      }
    }

    const latRaw = cleanCell(fields.lat);
    const lonRaw = cleanCell(fields.lon);
    const lat = parseCoordinate(latRaw, 90, [2, 1, 3]);
    const lon = parseCoordinate(lonRaw, 180, [1, 2, 3]);
    const verificationRaw = cleanCell(fields[VERIFICATION_COLUMN]);
    const onlineSalesRaw = cleanCell(fields[ONLINE_SALES_COLUMN]);
    const hasValidCoordinates =
      Boolean(latRaw && lonRaw) && !Number.isNaN(lat) && !Number.isNaN(lon);

    if (!latRaw && !lonRaw) stats.withoutCoordinates += 1;
    else if (hasValidCoordinates) stats.withCoordinates += 1;

    if ((latRaw && !lonRaw) || (!latRaw && lonRaw)) {
      push("error", line, id, slug, "lat and lon must both be present or both be empty");
    }

    if (latRaw) {
      if (Number.isNaN(lat)) {
        push("error", line, id, slug, "lat is not a valid coordinate");
      } else if (lat < -90 || lat > 90) {
        push("error", line, id, slug, "lat must be between -90 and 90");
      }
    }

    if (lonRaw) {
      if (Number.isNaN(lon)) {
        push("error", line, id, slug, "lon is not a valid coordinate");
      } else if (lon < -180 || lon > 180) {
        push("error", line, id, slug, "lon must be between -180 and 180");
      }
    }

    // Coordinates so far from the declared municipio that they belong to a
    // different town: almost always a swapped/wrong lat/lon or a wrong municipio.
    if (centroids && hasValidCoordinates) {
      const centroid = lookupCentroid(centroids, cleanCell(fields.municipio), scope);
      if (!centroid) {
        // No centroid for this municipio (pedanía, or a spelling the lookup does
        // not carry): the row silently escapes every geography check, so count it
        // instead of letting the gap disappear.
        stats.geoSkipped += 1;
      } else {
        stats.geoChecked += 1;
        if (
          Math.abs(lat - centroid.lat) <= CENTROID_FALLBACK_TOLERANCE_DEG &&
          Math.abs(lon - centroid.lon) <= CENTROID_FALLBACK_TOLERANCE_DEG
        ) {
          stats.geoFallback += 1;
        }
        const distance = haversineKm(lat, lon, centroid.lat, centroid.lon);
        if (distance > CENTROID_BLOCKING_DISTANCE_KM) {
          push(
            "error",
            line,
            id,
            slug,
            describeCentroidGap(centroids, scope, lat, lon, centroid, distance, CENTROID_BLOCKING_DISTANCE_KM),
          );
        } else if (distance > CENTROID_MAX_DISTANCE_KM) {
          push(
            "warning",
            line,
            id,
            slug,
            describeCentroidGap(centroids, scope, lat, lon, centroid, distance, CENTROID_MAX_DISTANCE_KM),
          );
        }
      }
    }

    for (const [column, validateHost] of Object.entries(validators)) {
      const parsedUrl = readUrl(fields[column]);

      if (parsedUrl === null) {
        continue;
      }

      if (parsedUrl.error) {
        push("error", line, id, slug, `${column}: ${parsedUrl.error}`);
        continue;
      }

      const hostError = validateHost(parsedUrl.url);
      if (hostError) {
        push("error", line, id, slug, `${column}: ${hostError}`);
        continue;
      }

      if (column === "Facebook" || column === "Instagram") {
        const profileError = socialProfileError(parsedUrl.url);
        if (profileError) push("warning", line, id, slug, `${column}: ${profileError}`);
      }

      if (column === "Google Maps") {
        for (const warning of googleMapsQualityWarnings(parsedUrl.url)) {
          push("warning", line, id, slug, `Google Maps: ${warning}`);
        }
      }
    }

    const imagePathError = validateImagePath(fields.imagen);
    if (imagePathError) {
      push("error", line, id, slug, `imagen: ${imagePathError}`);
    }

    if (!verificationRaw) {
      push("error", line, id, slug, "verificacion is required");
    } else if (!VERIFICATION_LEVELS.has(verificationRaw)) {
      push(
        "error",
        line,
        id,
        slug,
        `verificacion must be one of: ${[...VERIFICATION_LEVELS].join(", ")}`,
      );
    } else if (verificationRaw === "verificado") {
      const hasCoords =
        !Number.isNaN(lat) &&
        !Number.isNaN(lon) &&
        Boolean(latRaw || lonRaw);
      const hasExternalLink = Boolean(
        cleanCell(fields.web) ||
          cleanCell(fields["Google Maps"]) ||
          cleanCell(fields.Facebook) ||
          cleanCell(fields.Instagram),
      );
      if (!hasCoords || !hasExternalLink) {
        push(
          "error",
          line,
          id,
          slug,
          "verificacion verificado requires coordinates and at least one external link",
        );
      }
    }

    if (!onlineSalesRaw) {
      push("error", line, id, slug, "Venta online is required");
    } else if (!ONLINE_SALES_VALUES.has(onlineSalesRaw)) {
      push(
        "error",
        line,
        id,
        slug,
        `Venta online must be one of: ${ONLINE_SALES_DISPLAY_VALUES}`,
      );
    }

    // Canal de venta stays optional (empty = not classified yet), but a value
    // that is present must be usable: known tokens, and an actual online sale to
    // describe.
    const salesChannelRaw = cleanCell(fields[SALES_CHANNEL_COLUMN]);
    if (salesChannelRaw) {
      const invalid = salesChannelRaw
        .split(SALES_CHANNEL_SEPARATOR)
        .map((token) => token.trim())
        .filter(Boolean)
        .filter((token) => !SALES_CHANNEL_VALUES.has(token));

      if (invalid.length) {
        push(
          "error",
          line,
          id,
          slug,
          `Canal de venta has invalid value(s) ${invalid
            .map((value) => `'${value}'`)
            .join(", ")} (allowed: ${SALES_CHANNEL_DISPLAY_VALUES})`,
        );
      }

      if (onlineSalesRaw !== "sí") {
        push("error", line, id, slug, "Canal de venta is set but Venta online is not 'sí'");
      }
    }

    const emailRaw = cleanCell(fields.correo);
    if (emailRaw && !EMAIL_PATTERN.test(emailRaw)) {
      push(
        "error",
        line,
        id,
        slug,
        `correo: '${emailRaw}' must be a single valid email address`,
      );
    }

    const category = cleanCell(fields.categoria);
    if (category && !VALID_CATEGORIES.has(category)) {
      // Naming the replacement matters more than the rejection: most of these
      // are a retired label typed again, not a new one being proposed.
      const replacement = categoryReplacement(category);
      push(
        "error",
        line,
        id,
        slug,
        replacement
          ? `categoria '${category}' was retired; use '${replacement}'`
          : `categoria '${category}' is not a valid category`,
      );
    }

    const additionalCategories = readAdditionalCategories(
      fields[ADDITIONAL_CATEGORIES_COLUMN],
    );
    const seenAdditionalCategories = new Set();
    for (const additionalCategory of additionalCategories) {
      if (!additionalCategory) {
        push(
          "error",
          line,
          id,
          slug,
          `${ADDITIONAL_CATEGORIES_COLUMN} contains an empty token; join categories with a single '${CATEGORY_SEPARATOR}'`,
        );
        continue;
      }

      if (additionalCategory === category) {
        push(
          "error",
          line,
          id,
          slug,
          `${ADDITIONAL_CATEGORIES_COLUMN} repeats primary categoria '${category}'`,
        );
      }

      if (seenAdditionalCategories.has(additionalCategory)) {
        push(
          "error",
          line,
          id,
          slug,
          `${ADDITIONAL_CATEGORIES_COLUMN} repeats '${additionalCategory}'`,
        );
      }
      seenAdditionalCategories.add(additionalCategory);

      if (!VALID_CATEGORIES.has(additionalCategory)) {
        const replacement = categoryReplacement(additionalCategory);
        push(
          "error",
          line,
          id,
          slug,
          replacement
            ? `${ADDITIONAL_CATEGORIES_COLUMN} '${additionalCategory}' was retired; use '${replacement}'`
            : `${ADDITIONAL_CATEGORIES_COLUMN} '${additionalCategory}' is not a valid category`,
        );
      }
    }

    const phoneRaw = cleanCell(fields.telefono);
    if (phoneRaw && !/^\+\d{7,15}$/.test(phoneRaw)) {
      push(
        "error",
        line,
        id,
        slug,
        `telefono: '${phoneRaw}' must be in strict E.164 format (e.g. +34600112233)`,
      );
    }
  }

  for (const [slug, lines] of slugLines.entries()) {
    if (lines.length > 1) {
      for (const line of lines) {
        push("error", line, line - 1, slug, `slug is duplicated on lines ${lines.join(", ")}`);
      }
    }
  }

}

function createStats() {
  return {
    rows: 0,
    withCoordinates: 0,
    withoutCoordinates: 0,
    geoChecked: 0,
    geoSkipped: 0,
    geoFallback: 0,
  };
}

function addStats(total, current) {
  for (const key of Object.keys(total)) total[key] += current[key];
}

async function auditCsv(csvPath, centroids) {
  const { issues, push } = createIssueCollector();
  const stats = createStats();
  const scope = inferScope(csvPath);
  let rows = [];

  try {
    const parsed = await readCsv(csvPath);
    rows = parsed.rows;
    runContractAudit({
      raw: parsed.raw,
      headers: parsed.headers,
      rows,
      push,
      centroids,
      scope,
      stats,
    });
  } catch (error) {
    push("error", 1, 0, "(file)", `cannot parse CSV: ${error.message}`);
  }

  return { csvPath, issues, stats, rows, scope };
}

async function auditCountryIdentities(sources, reportPaths = sources.map((source) => source.csvPath)) {
  const { path } = await getDependencies();
  const root = path.resolve(__dirname, "..");
  const reportSet = new Set(reportPaths.map((csvPath) => path.resolve(csvPath)));
  const producerIds = new Map();
  const slugs = new Map();

  const add = (registry, country, value, owner) => {
    const key = `${country}\0${value}`;
    const owners = registry.get(key) ?? [];
    owners.push(owner);
    registry.set(key, owners);
  };

  for (const source of sources) {
    const country = source.scope.country;
    if (!country) continue;
    source.rows.forEach((fields, index) => {
      const producerId = cleanCell(fields[PRODUCER_ID_COLUMN]);
      const slug = cleanCell(fields.slug);
      const owner = {
        csvPath: path.resolve(source.csvPath),
        line: index + 2,
        producerId,
        slug,
      };
      if (
        PRODUCER_ID_PATTERN.test(producerId) &&
        Number.isSafeInteger(Number(producerId))
      ) {
        add(producerIds, country, producerId, owner);
      }
      if (SLUG_PATTERN.test(slug)) add(slugs, country, slug, owner);
    });
  }

  const issues = [];
  const collect = (registry, field) => {
    for (const [key, owners] of registry.entries()) {
      if (owners.length < 2) continue;
      const separator = key.indexOf("\0");
      const country = key.slice(0, separator);
      const value = key.slice(separator + 1);
      const locations = owners
        .map((owner) => `${path.relative(root, owner.csvPath)}:${owner.line}`)
        .join(", ");
      for (const owner of owners) {
        if (!reportSet.has(owner.csvPath)) continue;
        issues.push({
          csvPath: owner.csvPath,
          severity: "error",
          line: owner.line,
          id: owner.producerId || owner.line - 1,
          slug: owner.slug || "(empty)",
          message: `${field} '${value}' is duplicated within country '${country}' at ${locations}`,
        });
      }
    }
  };

  collect(producerIds, PRODUCER_ID_COLUMN);
  collect(slugs, "slug");
  return issues;
}

async function loadHeadCountryIdentitySnapshots(countries) {
  const { path, execFileSync, parse } = await getDependencies();
  const root = path.resolve(__dirname, "..");
  const snapshots = new Map();

  for (const country of countries) {
    let relativeFiles;
    try {
      relativeFiles = execFileSync(
        "git",
        ["ls-tree", "-r", "--name-only", "HEAD", "--", `data/csv/${country}`],
        {
          cwd: root,
          encoding: "utf8",
          maxBuffer: 20 * 1024 * 1024,
          stdio: ["ignore", "pipe", "ignore"],
        },
      )
        .split(/\r?\n/)
        .filter((relativePath) => relativePath.endsWith(".csv"));
    } catch {
      continue;
    }
    if (relativeFiles.length === 0) continue;

    const readHeadFile = (relativePath) =>
      execFileSync("git", ["show", `HEAD:${relativePath}`], {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      });
    const firstRaw = readHeadFile(relativeFiles[0]);
    const firstHeaders = firstRaw
      .split(/\r?\n/, 1)[0]
      .replace(/^\uFEFF/, "")
      .split(",")
      .map((value) => value.trim());

    // The repository-wide bootstrap is intentionally exempt: the HEAD side has
    // no durable key yet, so there is no historical identity to preserve.
    if (!firstHeaders.includes(PRODUCER_ID_COLUMN)) continue;

    const owners = [];
    let completeIdentitySchema = true;
    for (const relativePath of relativeFiles) {
      const raw = relativePath === relativeFiles[0] ? firstRaw : readHeadFile(relativePath);
      const headers = raw
        .split(/\r?\n/, 1)[0]
        .replace(/^\uFEFF/, "")
        .split(",")
        .map((value) => value.trim());
      if (!headers.includes(PRODUCER_ID_COLUMN)) {
        completeIdentitySchema = false;
        break;
      }

      const rows = parse(raw, { columns: true, bom: true, skip_empty_lines: true });
      rows.forEach((row, index) => {
        const fields = Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key.trim(), cleanCell(value)]),
        );
        owners.push({
          csvPath: path.resolve(root, relativePath),
          line: index + 2,
          producerId: cleanCell(fields[PRODUCER_ID_COLUMN]),
          slug: cleanCell(fields.slug),
        });
      });
    }

    if (completeIdentitySchema) snapshots.set(country, owners);
  }

  return snapshots;
}

async function auditCountryIdentityHistory(
  sources,
  reportPaths = sources.map((source) => source.csvPath),
) {
  const { path } = await getDependencies();
  const reportSet = new Set(reportPaths.map((csvPath) => path.resolve(csvPath)));
  const countries = new Set(
    reportPaths
      .map((csvPath) => inferScope(csvPath).country)
      .filter((country) => COUNTRY_PATTERN.test(country ?? "")),
  );
  const snapshots = await loadHeadCountryIdentitySnapshots(countries);
  const currentByCountry = new Map();

  for (const source of sources) {
    const country = source.scope.country;
    if (!snapshots.has(country)) continue;
    const owners = currentByCountry.get(country) ?? [];
    source.rows.forEach((fields, index) => {
      const producerId = cleanCell(fields[PRODUCER_ID_COLUMN]);
      if (
        !PRODUCER_ID_PATTERN.test(producerId) ||
        !Number.isSafeInteger(Number(producerId))
      ) {
        return;
      }
      owners.push({
        csvPath: path.resolve(source.csvPath),
        line: index + 2,
        producerId,
        slug: cleanCell(fields.slug),
      });
    });
    currentByCountry.set(country, owners);
  }

  const issues = [];
  const push = (owner, message) => {
    if (!reportSet.has(owner.csvPath)) return;
    issues.push({
      csvPath: owner.csvPath,
      severity: "error",
      line: owner.line,
      id: owner.producerId,
      slug: owner.slug || "(empty)",
      message,
    });
  };

  for (const [country, headOwnersRaw] of snapshots.entries()) {
    const headOwners = headOwnersRaw.filter(
      (owner) =>
        PRODUCER_ID_PATTERN.test(owner.producerId) &&
        Number.isSafeInteger(Number(owner.producerId)) &&
        SLUG_PATTERN.test(owner.slug),
    );
    const headById = new Map(headOwners.map((owner) => [owner.producerId, owner]));
    const headBySlug = new Map(headOwners.map((owner) => [owner.slug, owner]));
    const currentOwners = currentByCountry.get(country) ?? [];

    for (const owner of currentOwners) {
      const previousByCurrentSlug = headBySlug.get(owner.slug);
      if (
        previousByCurrentSlug &&
        previousByCurrentSlug.producerId !== owner.producerId
      ) {
        push(
          owner,
          `${PRODUCER_ID_COLUMN} changed for HEAD slug '${owner.slug}': expected '${previousByCurrentSlug.producerId}', found '${owner.producerId}'`,
        );
        continue;
      }

    }

    const headMax = headOwners.reduce(
      (maximum, owner) => Math.max(maximum, Number(owner.producerId)),
      0,
    );
    const newOwnersById = new Map();
    for (const owner of currentOwners) {
      if (!headById.has(owner.producerId) && !newOwnersById.has(owner.producerId)) {
        newOwnersById.set(owner.producerId, owner);
      }
    }
    const newOwners = [...newOwnersById.values()].sort(
      (left, right) => Number(left.producerId) - Number(right.producerId),
    );
    newOwners.forEach((owner, index) => {
      const expected = headMax + index + 1;
      if (Number(owner.producerId) !== expected) {
        push(
          owner,
          `new ${PRODUCER_ID_COLUMN} '${owner.producerId}' must continue country '${country}' sequence at '${expected}'`,
        );
      }
    });
  }

  return issues;
}

function printStats(stats) {
  console.log(`- rows: ${stats.rows}`);
  console.log(`- rows with coordinates: ${stats.withCoordinates}`);
  console.log(`- rows without coordinates: ${stats.withoutCoordinates}`);
  console.log(`- rows checked against a municipio centroid: ${stats.geoChecked}`);
  console.log(
    `- geo-check skipped (municipio centroid not uniquely resolved): ${stats.geoSkipped} rows`,
  );
  console.log(`- centroid fallback coordinates: ${stats.geoFallback}`);
}

function printSingleReport(issues, stats) {
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  console.log("CSV audit summary");
  console.log(`- errors: ${errors.length}`);
  console.log(`- warnings: ${warnings.length}`);
  printStats(stats);
  console.log(`- status: ${errors.length ? "FAILED" : "OK"}`);

  if (issues.length) console.log("");
  for (const issue of issues) {
    console.log(
      `${issue.severity.toUpperCase()} line ${issue.line} · id ${issue.id} · slug ${issue.slug}: ${issue.message}`,
    );
  }
}

function warningKind(message) {
  if (message.startsWith("Google Maps:")) return "Google Maps migration";
  if (message.startsWith("Facebook:") || message.startsWith("Instagram:")) {
    return "social profile";
  }
  if (message.startsWith("lat/lon is ")) return "geography 15–100 km";
  return "other";
}

async function main() {
  const { path } = await getDependencies();
  let args;
  try {
    args = parseArgs(process.argv.slice(2), (targetPath) => path.resolve(process.cwd(), targetPath));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    usage();
    process.exitCode = 1;
    return;
  }
  if (args.help) {
    usage();
    return;
  }
  if (args.registry) {
    const valid = printRegistryReport(await auditAreaRegistry(args.registry));
    process.exitCode = valid ? 0 : 1;
    return;
  }

  let files;
  try {
    files = await resolveCsvFiles(args);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const root = path.resolve(__dirname, "..");
  let registry = null;
  if (args.all || args.changed) {
    registry = await auditAreaRegistry(path.join(root, "data", "csv"));
  }

  if (args.changed && files.length === 0) {
    console.log("No changed CSV files under data/csv.");
  }

  const centroids = files.length ? await loadCentroids() : null;
  const results = [];
  for (const csvPath of files) results.push(await auditCsv(csvPath, centroids));

  const identityFiles = await resolveIdentityCsvFiles(args, files);
  const resultsByPath = new Map(
    results.map((result) => [path.resolve(result.csvPath), result]),
  );
  const identitySources = [];
  for (const csvPath of identityFiles) {
    const resolvedPath = path.resolve(csvPath);
    const result = resultsByPath.get(resolvedPath);
    if (result) {
      identitySources.push(result);
      continue;
    }
    try {
      const { rows } = await readCsv(resolvedPath);
      identitySources.push({ csvPath: resolvedPath, rows, scope: inferScope(resolvedPath) });
    } catch {
      // The unchanged sibling is loaded only to detect country-wide collisions.
      // Its own parse/contract errors remain the responsibility of --all.
    }
  }
  const identityIssues = await auditCountryIdentities(identitySources, files);
  for (const issue of identityIssues) {
    resultsByPath.get(path.resolve(issue.csvPath))?.issues.push(issue);
  }
  if (args.changed) {
    const historyIssues = await auditCountryIdentityHistory(identitySources, files);
    for (const issue of historyIssues) {
      resultsByPath.get(path.resolve(issue.csvPath))?.issues.push(issue);
    }
  }

  if (!args.all && !args.changed && results.length === 1) {
    printSingleReport(results[0].issues, results[0].stats);
    process.exitCode = results[0].issues.some((issue) => issue.severity === "error") ? 1 : 0;
    return;
  }

  const totalStats = createStats();
  let errors = registry?.errors.length ?? 0;
  let warnings = 0;
  let failedFiles = 0;
  const warningFiles = [];
  const warningKinds = new Map();

  if (registry?.errors.length) {
    console.log("Area registry contract failed");
    for (const error of registry.errors) console.log(`- ${error}`);
    console.log("");
  }

  for (const result of results) {
    addStats(totalStats, result.stats);
    const fileErrors = result.issues.filter((issue) => issue.severity === "error");
    const fileWarnings = result.issues.filter((issue) => issue.severity === "warning");
    errors += fileErrors.length;
    warnings += fileWarnings.length;
    for (const issue of fileWarnings) {
      const kind = warningKind(issue.message);
      warningKinds.set(kind, (warningKinds.get(kind) ?? 0) + 1);
    }
    if (fileErrors.length) {
      failedFiles += 1;
      console.log(`CSV audit failed: ${path.relative(root, result.csvPath)}`);
      for (const issue of result.issues) {
        console.log(
          `- ${issue.severity.toUpperCase()} line ${issue.line} · slug ${issue.slug}: ${issue.message}`,
        );
      }
      console.log("");
    } else if (fileWarnings.length) {
      warningFiles.push([path.relative(root, result.csvPath), fileWarnings.length]);
    }
  }

  if (args.all && warningKinds.size) {
    console.log("CSV audit warning summary");
    for (const [kind, count] of [...warningKinds].sort((left, right) => right[1] - left[1])) {
      console.log(`- ${kind}: ${count}`);
    }
    console.log("");
  } else if (warningFiles.length) {
    console.log("CSV audit warnings by file");
    for (const [file, count] of warningFiles) console.log(`- ${file}: ${count}`);
    console.log("");
  }

  console.log("CSV audit summary");
  console.log(`- registry: ${registry ? `${registry.areas} areas` : "not checked"}`);
  console.log(`- files: ${results.length}`);
  console.log(`- failed files: ${failedFiles}`);
  console.log(`- errors: ${errors}`);
  console.log(`- warnings: ${warnings}`);
  printStats(totalStats);
  console.log(`- status: ${errors ? "FAILED" : "OK"}`);

  process.exitCode = errors ? 1 : 0;
}

module.exports = { CANONICAL_HEADER, auditAreaRegistry };

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
