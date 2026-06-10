#!/usr/bin/env node

const REQUIRED_COLUMNS = [
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
  "Venta online",
  "Facebook",
  "Instagram",
  "Google Maps",
  "lat",
  "lon",
  "verificacion",
];

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
const VERIFICATION_COLUMN = "verificacion";
const VERIFICATION_LEVELS = new Set(["pendiente", "parcial", "verificado"]);
const ONLINE_SALES_COLUMN = "Venta online";
const ONLINE_SALES_VALUES = new Set(["si", "no", "no comprobado"]);
const ONLINE_SALES_DISPLAY_VALUES = "sí, no, no comprobado";
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
const PREFERRED_CATEGORY_ALIASES = new Map([
  ["quesos y lacteos", "Lácteos y quesos"],
  ["lacteos", "Lácteos y quesos"],
  ["vino", "Bodega"],
  ["vinos y bebidas", "Bodega"],
  ["bodega y licores", "Bodega"],
  ["panaderia", "Pan y pastelería"],
  ["panaderia y reposteria", "Pan y pastelería"],
  ["pasteleria y panaderia", "Pan y pastelería"],
  ["dulces y panaderia", "Pan y pastelería"],
  ["pan y reposteria", "Pan y pastelería"],
  ["pan y bolleria", "Pan y pastelería"],
]);

const VALID_CATEGORIES = new Set([
  "Aceite",
  "Aceite y bodega",
  "Aceite y frutos secos",
  "Aceite y vino",
  "Aceitunas y encurtidos",
  "Agua mineral natural",
  "Aperitivos",
  "Aromáticas",
  "Aromáticas y condimentos",
  "Arroz",
  "Arroz ecológico",
  "Aves y arroz",
  "Azafrán",
  "Bebidas",
  "Bodega",
  "Café",
  "Calçots y aceite",
  "Caracoles",
  "Carne",
  "Carnes",
  "Cerveza artesana",
  "Charcutería",
  "Chocolate",
  "Chocolate y cacao",
  "Chocolate y dulces",
  "Churrería",
  "Comida preparada",
  "Condimentos",
  "Congelados",
  "Conservas",
  "Conservas vegetales",
  "Conservas y huerta",
  "Conservas y mermeladas",
  "Despensa artesanal",
  "Despensa ecológica",
  "Destilados y derivados",
  "Destilados y licores",
  "Dulces",
  "Dulces y repostería",
  "Encurtidos",
  "Especias",
  "Flores",
  "Fruta",
  "Fruta y aceite",
  "Fruta y huerta",
  "Fruta y verdura",
  "Fruta, verdura y granja",
  "Frutos rojos",
  "Frutos secos",
  "Harinas y cereales",
  "Harinas, arroz y legumbres",
  "Helados",
  "Helados y postres",
  "Hidromiel",
  "Horchata",
  "Huerta y frutos secos",
  "Huerta y granja",
  "Huevos",
  "Huevos y granja",
  "Infusiones",
  "Infusiones y especias",
  "Legumbres",
  "Legumbres y cereales",
  "Licores",
  "Licores y vermut",
  "Lácteos y quesos",
  "Lúpulo",
  "Mermeladas",
  "Miel",
  "Miel y apicultura",
  "Miel y chocolates",
  "Miel y dulces",
  "Miel y mermeladas",
  "Mostos y zumos",
  "Otros",
  "Pan y pastelería",
  "Pasta artesana",
  "Pato y derivados",
  "Patés",
  "Pescado",
  "Pescado y acuicultura",
  "Pescado y caviar",
  "Pescado y conservas",
  "Pescado y marisco",
  "Pimentón y especias",
  "Platos preparados",
  "Productos ecológicos",
  "Repostería artesana",
  "Sal",
  "Sal y condimentos",
  "Salsas",
  "Setas y hongos",
  "Sidra",
  "Snacks artesanos",
  "Trufa",
  "Trufa y setas",
  "Turrones",
  "Varios",
  "Vermut",
  "Vermut y vinos de licor",
  "Vino y conservas",
  "Vino y frutos secos",
  "Zumos"
]);

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

async function getDependencies() {
  if (!dependenciesPromise) {
    dependenciesPromise = Promise.all([
      import("node:fs"),
      import("node:path"),
      import("csv-parse/sync"),
    ]).then(([fs, path, csvParse]) => ({
      fs,
      path,
      parse: csvParse.parse,
    }));
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
  const rawValue = String(value ?? "");
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed !== rawValue) {
    return { error: "contains leading or trailing spaces" };
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

function runContractAudit({ raw, headers, rows, push, centroids, communityHint }) {
  const headerCounts = new Map();
  const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  const slugLines = new Map();

  for (const column of headers) {
    headerCounts.set(column, (headerCounts.get(column) ?? 0) + 1);
  }

  for (const column of missing) {
    push("error", 1, 0, "(header)", `missing required CSV column '${column}'`);
  }

  for (const [column, count] of headerCounts.entries()) {
    if (count > 1) {
      push("error", 1, 0, "(header)", `duplicated CSV column '${column || "(empty)"}'`);
    }
  }

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

    const latRaw = cleanCell(fields.lat);
    const lonRaw = cleanCell(fields.lon);
    const lat = parseCoordinate(latRaw, 90, [2, 1, 3]);
    const lon = parseCoordinate(lonRaw, 180, [1, 2, 3]);
    const verificationRaw = cleanCell(fields[VERIFICATION_COLUMN]);
    const verification = normalizeSearch(verificationRaw);
    const onlineSalesRaw = cleanCell(fields[ONLINE_SALES_COLUMN]);
    const onlineSales = normalizeSearch(onlineSalesRaw);

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
      if (centroid) {
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
    } else if (!VERIFICATION_LEVELS.has(verification)) {
      push(
        "error",
        line,
        id,
        slug,
        `verificacion must be one of: ${[...VERIFICATION_LEVELS].join(", ")}`,
      );
    } else if (verification === "verificado") {
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
    } else if (!ONLINE_SALES_VALUES.has(onlineSales)) {
      push(
        "error",
        line,
        id,
        slug,
        `Venta online must be one of: ${ONLINE_SALES_DISPLAY_VALUES}`,
      );
    }

    const category = cleanCell(fields.categoria);
    if (category && !VALID_CATEGORIES.has(category)) {
      push("error", line, id, slug, `categoria '${category}' is not a valid category`);
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
    const onlineSales = normalizeSearch(cleanCell(fields[ONLINE_SALES_COLUMN]));
    const salesChannelRaw = cleanCell(fields[SALES_CHANNEL_COLUMN]);
    const verification = normalizeSearch(cleanCell(fields[VERIFICATION_COLUMN]));
    const lat = parseCoordinate(fields.lat, 90, [2, 1, 3]);
    const lon = parseCoordinate(fields.lon, 180, [1, 2, 3]);

    // Absence warnings (an optional field is empty) are noise once a human has
    // reviewed the row: `verificado` means the gap is known, not unreviewed. They
    // are downgraded to "suppressed" so verifying a row clears its own noise.
    // Correctness warnings (bad coordinates, duplicates, invalid values) keep
    // firing regardless of verification status because they flag real defects.
    const presence = verification === "verificado" ? "suppressed" : "warning";

    if (!name) {
      push(presence, line, id, slug, "nombre is empty");
    }

    if (!city) {
      push(presence, line, id, slug, "municipio is empty");
    }

    if (!category) {
      push(presence, line, id, slug, "categoria is empty");
    } else {
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
    }

    if (!address) {
      push(presence, line, id, slug, "direccion is empty");
    }

    if (!description) {
      push(presence, line, id, slug, "descripcion is empty");
    } else if (description.length < DESCRIPTION_MIN_LENGTH) {
      push(
        presence,
        line,
        id,
        slug,
        `descripcion is shorter than ${DESCRIPTION_MIN_LENGTH} characters`,
      );
    }

    if (!phone && !email) {
      push(presence, line, id, slug, "telefono and correo are both empty");
    }

    if (!facebook && !instagram) {
      push(presence, line, id, slug, "Facebook and Instagram are both empty");
    }

    if (!googleMaps) {
      push(presence, line, id, slug, "Google Maps is empty");
    }

    if (salesChannelRaw) {
      const tokens = salesChannelRaw
        .split(SALES_CHANNEL_SEPARATOR)
        .map((token) => token.trim())
        .filter(Boolean);
      const invalid = tokens.filter(
        (token) => !SALES_CHANNEL_VALUES.has(normalizeSearch(token)),
      );
      if (invalid.length) {
        push(
          "warning",
          line,
          id,
          slug,
          `Canal de venta has invalid value(s) ${invalid
            .map((value) => `'${value}'`)
            .join(", ")} (allowed: ${SALES_CHANNEL_DISPLAY_VALUES})`,
        );
      }
      if (onlineSales !== "si") {
        push(
          "warning",
          line,
          id,
          slug,
          "Canal de venta is set but Venta online is not 'sí'",
        );
      }
    }

    if (!Number.isNaN(lat) && !Number.isNaN(lon) && (cleanCell(fields.lat) || cleanCell(fields.lon))) {
      if (!hasUsefulAddress(fields)) {
        push(presence, line, id, slug, "coordinates are present but direccion is not useful for location review");
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

    if (category) {
      const normalizedCategory = normalizeSearch(category);
      const variants = categoryVariants.get(normalizedCategory) ?? new Map();
      const lines = variants.get(category) ?? [];
      lines.push(line);
      variants.set(category, lines);
      categoryVariants.set(normalizedCategory, variants);
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

function printReport(mode, issues, { summaryOnly = false } = {}) {
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
      `- suppressed (absent optional fields on verificado rows): ${suppressed.length}`,
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

  runContractAudit({ raw, headers, rows, push, centroids, communityHint });

  if (mode === "quality") {
    runQualityAudit({ headers, rows, push, centroids, communityHint });
  }

  printReport(mode, issues, { summaryOnly });

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  process.exit(errorCount > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
