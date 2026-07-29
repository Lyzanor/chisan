#!/usr/bin/env node

// Exact 20-column header shared by all province CSVs, in this order.
// Documented in docs/CSV_CONTRACT.md, section "Canonical header".
const CANONICAL_HEADER = [
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
];

const DESCRIPTION_MIN_LENGTH = 30;
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
const CENTROID_MAX_DISTANCE_KM = 15;
// Beyond this, the gap is no longer "edge of a large municipal term" but a
// different municipio: a blocking error (wrong lat/lon or wrong municipio).
const CENTROID_BLOCKING_DISTANCE_KM = 100;
const CENTROIDS_RELATIVE_PATH = "data/reference/municipios.json";
const CENTROIDS_OVERRIDES_RELATIVE_PATH = "data/reference/municipios-overrides.json";
let PREFERRED_CATEGORY_ALIASES = new Map();
let VALID_CATEGORIES = new Set();
// Labels the 2026-06-21 consolidation folded into another one, mapped to their
// replacement. A retired label that is still in VALID_CATEGORIES has rows left
// to migrate; once it reaches zero uses it leaves the valid list and comes back
// only as a contract error. See docs/CSV_CONTRACT.md § Categories.
let RETIRED_CATEGORIES = new Map();

const MAP_ADDRESS_HINT_KEYWORDS = [
  "avinguda",
  "avenida",
  "avda",
  "cami",
  "calle",
  "carrer",
  "carretera",
  "ctra",
  "disseminat",
  "finca",
  "hostal",
  "lonja",
  "masia",
  "mercabarna",
  "paratge",
  "passatge",
  "passeig",
  "placa",
  "plaza",
  "poligon",
  "ronda",
  "travessera",
  "urbanizacion",
  "urbanitzacio",
];
const MAP_ADDRESS_PLACEHOLDER_MARKERS = [
  "adreca no publica",
  "contacte",
  "contacto",
  "distribucion",
  "distribucio",
  "nomada",
  "no publica",
  "servei a domicili",
  "servicio por encargo",
  "sin local fijo",
  "sin local abierto al publico",
  "venta ambulante",
  "venta online",
];

function parseArgs(argv, resolvePath) {
  let mode = "quality";
  let csvPath = "data/csv/catalunya/barcelona.csv";
  let summaryOnly = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--mode" && argv[index + 1]) {
      mode = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith("--mode=")) {
      mode = arg.slice("--mode=".length);
      continue;
    }

    if (arg === "--summary-only") {
      summaryOnly = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      csvPath = arg;
    }
  }

  if (mode !== "contract" && mode !== "quality") {
    console.error(`Error: unsupported mode '${mode}'. Use 'contract' or 'quality'.`);
    process.exit(1);
  }

  return {
    mode,
    csvPath: resolvePath(csvPath),
    summaryOnly,
  };
}

let dependenciesPromise;

function loadCategoryConfig(fs, path) {
  const configPath = path.resolve(__dirname, "../data/reference/categories.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  PREFERRED_CATEGORY_ALIASES = new Map(Object.entries(config.preferredAliases));
  VALID_CATEGORIES = new Set(config.categories);
  RETIRED_CATEGORIES = new Map(Object.entries(config.retiredCategories ?? {}));
}

async function getDependencies() {
  if (!dependenciesPromise) {
    dependenciesPromise = Promise.all([
      import("node:fs"),
      import("node:path"),
      import("csv-parse/sync"),
    ]).then(([fs, path, csvParse]) => {
      loadCategoryConfig(fs, path);
      return {
        fs,
        path,
        parse: csvParse.parse,
      };
    });
  }

  return dependenciesPromise;
}

function cleanCell(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeSearch(value) {
  return cleanCell(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Grouping key for the near-duplicate category warning. `normalizeSearch` only
// folds case and accents, so `Carne` and `Carnes` sitting in the same CSV never
// tripped it. Strip a trailing `s` per word and they collapse; stripping `es`
// too would turn `carnes` into `carn` and lose the pair this exists for.
function categoryStem(value) {
  return normalizeSearch(value)
    .split(" ")
    .map((word) => word.replace(/s$/, ""))
    .join(" ");
}

function slugifySegment(value) {
  return cleanCell(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
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

function inferCommunitySlug(csvPath) {
  const normalized = String(csvPath ?? "").replace(/\\/g, "/");
  const match = /(?:^|\/)data\/csv\/([^/]+)\//.exec(normalized);
  return match ? match[1] : null;
}

function pickCandidate(entry, communityHint) {
  if (Array.isArray(entry)) {
    if (!communityHint) return null;
    return entry.find((c) => c.community === communityHint) ?? null;
  }
  return entry;
}

function lookupCentroid(centroids, municipio, communityHint) {
  if (!centroids || !municipio) return null;
  const stripped = municipio.split(" - ")[0].trim();
  const key1 = normalizeSearch(municipio);
  const key2 = normalizeSearch(stripped);
  const override = centroids.overrides[key1] || centroids.overrides[key2];
  if (override) {
    return pickCandidate(override, communityHint);
  }
  return centroids.main[key1] || centroids.main[key2] || null;
}

function flattenCentroids(centroids) {
  if (!centroids) return [];
  if (centroids._flat) return centroids._flat;
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
  for (const value of Object.values(centroids.main || {})) collect(value);
  for (const value of Object.values(centroids.overrides || {})) collect(value);
  Object.defineProperty(centroids, "_flat", { value: flat, enumerable: false });
  return flat;
}

// Closest municipio centroid to a coordinate. Used to turn a "far from the
// declared municipio" warning into an actionable "this pin actually sits in X".
function findNearestCentroid(centroids, lat, lon) {
  let best = null;
  let bestKm = Infinity;
  for (const candidate of flattenCentroids(centroids)) {
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
function describeCentroidGap(centroids, lat, lon, declared, distance, limitKm) {
  const nearest = findNearestCentroid(centroids, lat, lon);
  const nearestNote =
    nearest && normalizeSearch(nearest.centroid.label) !== normalizeSearch(declared.label)
      ? `; closest centroid is ${nearest.centroid.label} (${nearest.distance.toFixed(1)} km) — check whether municipio or lat/lon is wrong`
      : "";
  return `lat/lon is ${distance.toFixed(1)} km from ${declared.label} centroid (threshold ${limitKm} km)${nearestNote}`;
}

function hasUsefulAddress(fields) {
  const rawAddress = cleanCell(fields.direccion);
  const normalizedAddress = normalizeSearch(rawAddress);

  if (!normalizedAddress) {
    return false;
  }

  const comparableValues = [
    fields.municipio,
    fields.categoria,
    fields["productos estrella"],
    fields.nombre,
  ]
    .map(normalizeSearch)
    .filter(Boolean);

  if (comparableValues.includes(normalizedAddress)) {
    return false;
  }

  if (/@/.test(rawAddress)) {
    return false;
  }

  if (/\d/.test(rawAddress) || /[,;/]/.test(rawAddress)) {
    return true;
  }

  if (MAP_ADDRESS_HINT_KEYWORDS.some((keyword) => normalizedAddress.includes(keyword))) {
    return true;
  }

  if (MAP_ADDRESS_PLACEHOLDER_MARKERS.some((marker) => normalizedAddress.includes(marker))) {
    return false;
  }

  const tokenCount = normalizedAddress.split(" ").filter(Boolean).length;
  return tokenCount >= 3 && normalizedAddress.length >= 18;
}

async function readCsv(csvPath) {
  const { fs, parse } = await getDependencies();

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV not found at ${csvPath}`);
    process.exit(1);
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

function runContractAudit({ raw, headers, rows, push, centroids, communityHint, stats }) {
  const slugLines = new Map();

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
      `header is not the canonical ${CANONICAL_HEADER.length}-column header (${detail}); see docs/CSV_CONTRACT.md`,
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
    const id = index + 1;
    const slug = cleanCell(fields.slug);

    if (!slug) {
      push("error", line, id, slug, "slug is required");
    } else if (slugifySegment(slug) !== slug) {
      push("error", line, id, slug, "slug must be lowercase ASCII words separated by '-'");
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
    if (centroids && latRaw && lonRaw && !Number.isNaN(lat) && !Number.isNaN(lon)) {
      const centroid = lookupCentroid(centroids, cleanCell(fields.municipio), communityHint);
      if (!centroid) {
        // No centroid for this municipio (pedanía, or a spelling the lookup does
        // not carry): the row silently escapes every geography check, so count it
        // instead of letting the gap disappear.
        stats.geoSkipped += 1;
      } else {
        const distance = haversineKm(lat, lon, centroid.lat, centroid.lon);
        if (distance > CENTROID_BLOCKING_DISTANCE_KM) {
          push(
            "error",
            line,
            id,
            slug,
            describeCentroidGap(centroids, lat, lon, centroid, distance, CENTROID_BLOCKING_DISTANCE_KM),
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
      const replacement =
        RETIRED_CATEGORIES.get(category) ??
        PREFERRED_CATEGORY_ALIASES.get(normalizeSearch(category));
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

function runQualityAudit({ rows, push, centroids, communityHint }) {
  const nameCityLines = new Map();
  const categoryVariants = new Map();
  // The same normalized descripcion on several rows is almost always template
  // boilerplate inherited from a bulk import, not a producer-specific text.
  // Short descriptions are skipped: below the minimum length they already get
  // the optional-gap note and are too generic to prove a shared template.
  const descriptionLines = new Map();

  for (const [index, fields] of rows.entries()) {
    const line = index + 2;
    const id = index + 1;
    const slug = cleanCell(fields.slug);
    const name = cleanCell(fields.nombre);
    const city = cleanCell(fields.municipio);
    const category = cleanCell(fields.categoria);
    const description = cleanCell(fields.descripcion);
    const address = cleanCell(fields.direccion);
    const phone = cleanCell(fields.telefono);
    const email = cleanCell(fields.correo);
    const facebook = cleanCell(fields.Facebook);
    const instagram = cleanCell(fields.Instagram);
    const googleMaps = cleanCell(fields["Google Maps"]);
    const lat = parseCoordinate(fields.lat, 90, [2, 1, 3]);
    const lon = parseCoordinate(fields.lon, 180, [1, 2, 3]);

    // Core-field gaps are real defects and always warn. Optional-field gaps
    // (address, description, contact, social, Google Maps) are not defects:
    // editorial policy treats empty as valid, and check:csv:completeness already
    // tracks their coverage as a percentage. They are pushed as "suppressed" so
    // they never add per-row noise here, whatever the verification status.
    const optionalGap = "suppressed";

    // nombre, municipio and categoria being non-empty is a blocking contract
    // rule; only the label preference is a matter of degree.
    if (category) {
      const preferredCategory = PREFERRED_CATEGORY_ALIASES.get(normalizeSearch(category));
      if (preferredCategory && category !== preferredCategory) {
        push(
          "warning",
          line,
          id,
          slug,
          `categoria should use preferred label '${preferredCategory}' instead of '${category}'`,
        );
      }
      // Retired labels still in the valid list: the rows the consolidation
      // never reached, plus the ones typed again afterwards. The app groups by
      // exact string, so whoever filters the replacement never sees these.
      const replacesRetired = RETIRED_CATEGORIES.get(category);
      if (replacesRetired && VALID_CATEGORIES.has(category)) {
        push(
          "warning",
          line,
          id,
          slug,
          `categoria '${category}' was retired; reassign to '${replacesRetired}' or argue the label back into data/reference/categories.json`,
        );
      }
    }

    for (const column of ["Facebook", "Instagram"]) {
      const parsedUrl = readUrl(fields[column]);
      if (!parsedUrl || parsedUrl.error) {
        continue;
      }
      const profileError = socialProfileError(parsedUrl.url);
      if (profileError) {
        push("warning", line, id, slug, `${column}: ${profileError}`);
      }
    }

    if (!address) {
      push(optionalGap, line, id, slug, "direccion is empty");
    }

    if (!description) {
      push(optionalGap, line, id, slug, "descripcion is empty");
    } else if (description.length < DESCRIPTION_MIN_LENGTH) {
      push(
        optionalGap,
        line,
        id,
        slug,
        `descripcion is shorter than ${DESCRIPTION_MIN_LENGTH} characters`,
      );
    }

    if (!phone && !email) {
      push(optionalGap, line, id, slug, "telefono and correo are both empty");
    }

    if (!facebook && !instagram) {
      push(optionalGap, line, id, slug, "Facebook and Instagram are both empty");
    }

    if (!googleMaps) {
      push(optionalGap, line, id, slug, "Google Maps is empty");
    }

    if (!Number.isNaN(lat) && !Number.isNaN(lon) && (cleanCell(fields.lat) || cleanCell(fields.lon))) {
      if (!hasUsefulAddress(fields)) {
        push(optionalGap, line, id, slug, "coordinates are present but direccion is not useful for location review");
      }

      const centroid = lookupCentroid(centroids, city, communityHint);
      if (centroid) {
        const distance = haversineKm(lat, lon, centroid.lat, centroid.lon);
        // Beyond the blocking distance the contract audit raises an error, so
        // this warning covers only the "edge of term vs. neighbour" band.
        if (
          distance > CENTROID_MAX_DISTANCE_KM &&
          distance <= CENTROID_BLOCKING_DISTANCE_KM
        ) {
          push(
            "warning",
            line,
            id,
            slug,
            describeCentroidGap(centroids, lat, lon, centroid, distance, CENTROID_MAX_DISTANCE_KM),
          );
        }
      }
    }

    const normalizedNameCity = [normalizeSearch(name), normalizeSearch(city)]
      .filter(Boolean)
      .join("|");
    if (normalizedNameCity) {
      const lines = nameCityLines.get(normalizedNameCity) ?? [];
      lines.push(line);
      nameCityLines.set(normalizedNameCity, lines);
    }

    if (description.length >= DESCRIPTION_MIN_LENGTH) {
      const normalizedDescription = normalizeSearch(description);
      if (normalizedDescription) {
        const lines = descriptionLines.get(normalizedDescription) ?? [];
        lines.push(line);
        descriptionLines.set(normalizedDescription, lines);
      }
    }

    if (category) {
      const stem = categoryStem(category);
      const variants = categoryVariants.get(stem) ?? new Map();
      const lines = variants.get(category) ?? [];
      lines.push(line);
      variants.set(category, lines);
      categoryVariants.set(stem, variants);
    }
  }

  for (const [key, lines] of nameCityLines.entries()) {
    if (key && lines.length > 1) {
      for (const line of lines) {
        push(
          "warning",
          line,
          line - 1,
          rows[line - 2]?.slug ?? "",
          `nombre + municipio looks duplicated on lines ${lines.join(", ")}`,
        );
      }
    }
  }

  for (const [, lines] of descriptionLines.entries()) {
    if (lines.length > 1) {
      for (const line of lines) {
        push(
          "warning",
          line,
          line - 1,
          rows[line - 2]?.slug ?? "",
          `descripcion is duplicated on lines ${lines.join(", ")} (shared template boilerplate; write producer-specific descriptions)`,
        );
      }
    }
  }

  for (const [, variants] of categoryVariants.entries()) {
    if (variants.size > 1) {
      const formattedVariants = [...variants.entries()]
        .map(([variant, lines]) => `${variant} [${lines.join(", ")}]`)
        .join("; ");

      for (const [, lines] of variants.entries()) {
        for (const line of lines) {
          push(
            "warning",
            line,
            line - 1,
            rows[line - 2]?.slug ?? "",
            `categoria has near-duplicate variants: ${formattedVariants}`,
          );
        }
      }
    }
  }
}

function printReport(mode, issues, { summaryOnly = false, stats = { geoSkipped: 0 } } = {}) {
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  const suppressed = issues.filter((issue) => issue.severity === "suppressed");
  const visible = issues.filter((issue) => issue.severity !== "suppressed");
  const title =
    mode === "contract" ? "CSV contract audit" : "CSV data-quality audit";

  console.log(`${title} summary`);
  console.log(`- errors: ${errors.length}`);
  console.log(`- warnings: ${warnings.length}`);
  if (suppressed.length) {
    console.log(
      `- suppressed (absent optional fields; tracked by check:csv:completeness): ${suppressed.length}`,
    );
  }
  if (stats.geoSkipped) {
    console.log(
      `- geo-check skipped (municipio not in data/reference/municipios.json): ${stats.geoSkipped} rows`,
    );
  }

  if (!visible.length) {
    console.log("- status: OK");
    return;
  }

  if (summaryOnly) {
    return;
  }

  console.log("");
  for (const issue of visible) {
    console.log(
      `${issue.severity.toUpperCase()} line ${issue.line} · id ${issue.id} · slug ${issue.slug}: ${issue.message}`,
    );
  }
}

async function main() {
  const { path } = await getDependencies();
  const { mode, csvPath, summaryOnly } = parseArgs(process.argv.slice(2), (targetPath) =>
    path.resolve(process.cwd(), targetPath),
  );
  const { raw, headers, rows } = await readCsv(csvPath);
  const { issues, push } = createIssueCollector();

  const centroids = await loadCentroids();
  const communityHint = inferCommunitySlug(csvPath);
  const stats = { geoSkipped: 0 };

  runContractAudit({ raw, headers, rows, push, centroids, communityHint, stats });

  if (mode === "quality") {
    runQualityAudit({ headers, rows, push, centroids, communityHint });
  }

  printReport(mode, issues, { summaryOnly, stats });

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  process.exit(errorCount > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
