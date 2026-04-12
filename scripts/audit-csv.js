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
  "Facebook",
  "Instagram",
  "Google Maps",
  "lat",
  "lon",
  "fecha_revision",
];

const DESCRIPTION_MIN_LENGTH = 30;
const REVIEW_WARNING_DAYS = 60;
const REVIEW_EXPIRED_DAYS = 90;
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
  let csvPath = "Km0-productores.csv";

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

function parseCoordinate(rawValue) {
  const cleaned = cleanCell(rawValue);
  if (!cleaned) {
    return null;
  }

  const normalized = cleaned.replace(",", ".");
  const parsed = Number.parseFloat(normalized);
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
  const query = url.searchParams.get("query");
  const placeId = url.searchParams.get("query_place_id");
  const api = url.searchParams.get("api");

  if (!host.includes("google.")) {
    return "must point to a Google Maps host";
  }

  if (!url.pathname.startsWith("/maps/search")) {
    return "must use /maps/search";
  }

  if (api !== "1") {
    return "must include api=1";
  }

  if (!query) {
    return "must include a non-empty query";
  }

  if (!placeId) {
    return "must include a non-empty query_place_id";
  }

  return null;
}

function parseStrictDate(value) {
  const cleaned = cleanCell(value);
  if (!cleaned) {
    return { empty: true, date: null };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return { empty: false, error: "must use YYYY-MM-DD" };
  }

  const [year, month, day] = cleaned.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return { empty: false, error: "is not a real calendar date" };
  }

  return { empty: false, date };
}

function daysSince(date, now) {
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / 86400000);
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

function runContractAudit({ headers, rows, push }) {
  const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  for (const column of missing) {
    push("error", 1, 0, "(header)", `missing required CSV column '${column}'`);
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

    const reviewDate = parseStrictDate(fields.fecha_revision);
    if (reviewDate.error) {
      push("error", line, id, slug, `fecha_revision ${reviewDate.error}`);
    }

    const latRaw = cleanCell(fields.lat);
    const lonRaw = cleanCell(fields.lon);
    const lat = parseCoordinate(latRaw);
    const lon = parseCoordinate(lonRaw);

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
  }
}

function runQualityAudit({ rows, push }) {
  const now = new Date();
  const slugLines = new Map();
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
    const reviewDate = parseStrictDate(fields.fecha_revision);
    const lat = parseCoordinate(fields.lat);
    const lon = parseCoordinate(fields.lon);

    if (!name) {
      push("warning", line, id, slug, "nombre is empty");
    }

    if (!city) {
      push("warning", line, id, slug, "municipio is empty");
    }

    if (!category) {
      push("warning", line, id, slug, "categoria is empty");
    }

    if (!address) {
      push("warning", line, id, slug, "direccion is empty");
    }

    if (!description) {
      push("warning", line, id, slug, "descripcion is empty");
    } else if (description.length < DESCRIPTION_MIN_LENGTH) {
      push(
        "warning",
        line,
        id,
        slug,
        `descripcion is shorter than ${DESCRIPTION_MIN_LENGTH} characters`,
      );
    }

    if (!phone && !email) {
      push("warning", line, id, slug, "telefono and correo are both empty");
    }

    if (!facebook && !instagram) {
      push("warning", line, id, slug, "Facebook and Instagram are both empty");
    }

    if (!googleMaps) {
      push("warning", line, id, slug, "Google Maps is empty");
    }

    if (reviewDate.empty) {
      push("warning", line, id, slug, "fecha_revision is empty");
    } else if (reviewDate.date) {
      const reviewAgeDays = daysSince(reviewDate.date, now);
      if (reviewAgeDays > REVIEW_EXPIRED_DAYS) {
        push(
          "warning",
          line,
          id,
          slug,
          `fecha_revision is expired (${reviewAgeDays} days old, threshold ${REVIEW_EXPIRED_DAYS})`,
        );
      } else if (reviewAgeDays > REVIEW_WARNING_DAYS) {
        push(
          "warning",
          line,
          id,
          slug,
          `fecha_revision needs attention (${reviewAgeDays} days old, threshold ${REVIEW_WARNING_DAYS})`,
        );
      }
    }

    if (!Number.isNaN(lat) && !Number.isNaN(lon) && (cleanCell(fields.lat) || cleanCell(fields.lon))) {
      if (!hasUsefulAddress(fields)) {
        push("warning", line, id, slug, "coordinates are present but direccion is not useful for map display");
      }
    }

    if (slug) {
      const lines = slugLines.get(slug) ?? [];
      lines.push(line);
      slugLines.set(slug, lines);
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

  for (const [slug, lines] of slugLines.entries()) {
    if (lines.length > 1) {
      for (const line of lines) {
        push("warning", line, line - 1, slug, `slug is duplicated on lines ${lines.join(", ")}`);
      }
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

function printReport(mode, issues) {
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  const title =
    mode === "contract" ? "CSV contract audit" : "CSV data-quality audit";

  console.log(`${title} summary`);
  console.log(`- errors: ${errors.length}`);
  console.log(`- warnings: ${warnings.length}`);

  if (!issues.length) {
    console.log("- status: OK");
    return;
  }

  console.log("");
  for (const issue of issues) {
    console.log(
      `${issue.severity.toUpperCase()} line ${issue.line} · id ${issue.id} · slug ${issue.slug}: ${issue.message}`,
    );
  }
}

async function main() {
  const { path } = await getDependencies();
  const { mode, csvPath } = parseArgs(process.argv.slice(2), (targetPath) =>
    path.resolve(process.cwd(), targetPath),
  );
  const { headers, rows } = await readCsv(csvPath);
  const { issues, push } = createIssueCollector();

  runContractAudit({ headers, rows, push });

  if (mode === "quality") {
    runQualityAudit({ rows, push });
  }

  printReport(mode, issues);

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  process.exit(errorCount > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
