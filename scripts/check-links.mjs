#!/usr/bin/env node

// Triaje de link-rot para la columna `web`: resuelve cada dominio y lo
// **clasifica**, sin decidir nada. Solo informe; exit 0 siempre.
//
// Un fallo de red es incertidumbre, no prueba de baja
// (`docs/EDITORIAL_POLICY.md`): contrasta por otra vía antes de tocar el CSV.
// No forma parte de ningún gate porque depende de la red y de bloqueos
// anti-bot. Un 403 no es un sitio muerto, y un 200 no es la web del productor.
//
// El resultado se guarda como snapshot fechado en
// `data/reference/web-status.json`. Ese fichero es el producto real del check:
// convierte el paso más caro de una pasada R0/R1 —abrir dominios a mano— en
// una lectura. Caduca: `web` es una afirmación dinámica, igual que
// `Venta online`, así que el informe avisa de la edad de cada dato.
//
// Uso:
//   node scripts/check-links.mjs --area girona,cadiz
//   node scripts/check-links.mjs --all                  (lento: ~8.500 hosts)
//   node scripts/check-links.mjs --offline              lee el snapshot, sin red
//   node scripts/check-links.mjs --offline --area soria --json

import fs from "node:fs";
import path from "node:path";
import dns from "node:dns/promises";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";

const CSV_ROOT = "data/csv";
const SNAPSHOT_PATH = "data/reference/web-status.json";
const BODY_LIMIT = 65536;
// Pasado este tiempo el snapshot ya no sostiene una decisión: se vuelve a mirar.
const STALE_DAYS = 90;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

// Frases de alta precisión de parking/venta de dominios.
const PARKING_PATTERNS = [
  "domain is for sale",
  "this domain is for sale",
  "buy this domain",
  "purchase this domain",
  "dominio en venta",
  "comprar este dominio",
  "este dominio está en venta",
  "sedoparking",
  "sedo.com",
  "parkingcrew",
  "hugedomains",
  "dan.com",
  "afternic",
  "domain parking",
  "parked domain",
  "domainname.shop",
  "nicsell",
  "domain auction",
  "subasta de dominios",
];

// Portadas por defecto de proveedor: el dominio resuelve y devuelve 200, pero
// no hay sitio detrás. Distinto de parking (el dominio está en venta) y de una
// web real en obras.
const PROVIDER_PLACEHOLDER_PATTERNS = [
  "future home of something quite cool",
  "apache2 debian default page",
  "apache2 ubuntu default page",
  "welcome to nginx",
  "index of /",
  "web server is down",
  "plesk default page",
  "cpanel-generated",
  "this domain has been registered",
  "dominio registrado con éxito",
  "sitio web en construcción",
  "página en construcción",
  "coming soon",
  "próximamente disponible",
];

// Solo se buscan en <title> para evitar falsos positivos (p. ej. el municipio
// valenciano de Casinos).
const SPAM_TITLE_PATTERNS = [
  "casino online",
  "online casino",
  "apuestas",
  "slots",
  "tragaperras",
  "viagra",
  "cialis",
  "porn",
  "xxx",
  "escort",
];

const TWO_LEVEL_TLDS = new Set(["com.es", "org.es", "nom.es", "gob.es", "edu.es", "co.uk"]);

const SIGNAL_ORDER = [
  "nxdomain",
  "sin-ns",
  "sin-registro-a",
  "parking",
  "portada-proveedor",
  "contenido-ajeno",
  "redirige",
  "http-404",
  "http-410",
];

function usage() {
  console.log(`Uso: node scripts/check-links.mjs --area <stem>[,<stem>] [opciones]

Opciones:
  --area <stem>         Area(s) to check (e.g. girona,cadiz).
  --all                 Comprueba todos los CSV (lento; ~8.500 hosts).
  --offline             No toca la red: informa desde el snapshot guardado.
  --timeout <ms>        Timeout por URL (defecto 10000).
  --concurrency <n>     Peticiones simultáneas (defecto 6).
  --no-snapshot         No escribe data/reference/web-status.json.
  --json                Salida JSON completa.`);
}

function parseArgs(argv) {
  const args = {
    areas: [],
    all: false,
    offline: false,
    timeout: 10000,
    concurrency: 6,
    json: false,
    snapshot: true,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") {
      args.json = true;
    } else if (arg === "--all") {
      args.all = true;
    } else if (arg === "--offline") {
      args.offline = true;
    } else if (arg === "--no-snapshot") {
      args.snapshot = false;
    } else if (arg === "--area") {
      const value = argv[++i];
      if (!value) throw new Error("--area requiere un valor");
      args.areas.push(
        ...value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      );
    } else if (arg === "--timeout") {
      args.timeout = Number(argv[++i]);
      if (!Number.isInteger(args.timeout) || args.timeout <= 0) {
        throw new Error("--timeout requiere milisegundos > 0");
      }
    } else if (arg === "--concurrency") {
      args.concurrency = Number(argv[++i]);
      if (!Number.isInteger(args.concurrency) || args.concurrency <= 0) {
        throw new Error("--concurrency requiere un entero > 0");
      }
    } else if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else {
      throw new Error(`Argumento desconocido: ${arg}`);
    }
  }
  // En modo offline no hay coste de red, así que "sin filtro" es todo el
  // catálogo; con red, exigir alcance explícito evita barridos accidentales.
  if (!args.offline && !args.all && args.areas.length === 0) {
    usage();
    throw new Error("Indica --area o --all.");
  }
  return args;
}

function listCsvFiles(stems) {
  const files = fs
    .readdirSync(CSV_ROOT, { recursive: true })
    .map((file) => String(file))
    .filter((file) => file.endsWith(".csv"))
    .map((file) => path.join(CSV_ROOT, file))
    .sort();
  if (!stems.length) return files;
  const wanted = new Set(stems);
  const matched = files.filter((file) => wanted.has(path.basename(file, ".csv")));
  for (const stem of stems) {
    if (!matched.some((file) => path.basename(file, ".csv") === stem)) {
      console.error(`Aviso: no existe data/csv/**/${stem}.csv`);
    }
  }
  return matched;
}

export function registrableDomain(hostname) {
  const host = hostname.replace(/^www\./i, "").toLowerCase();
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join(".");
  if (TWO_LEVEL_TLDS.has(lastTwo)) return parts.slice(-3).join(".");
  return lastTwo;
}

// ---------------------------------------------------------------------------
// Clasificación: función pura sobre el resultado de un sondeo.
//
// Está separada de la red a propósito. Es la única parte con reglas
// editoriales —qué cuenta como señal y qué como incertidumbre— y por tanto la
// única que hay que poder probar; las pruebas usan fixtures y nunca abren un
// socket.
// ---------------------------------------------------------------------------

const matchIn = (haystack, patterns) => patterns.find((pattern) => haystack.includes(pattern));

/**
 * @param {object} probe
 * @param {string} probe.url            URL pedida
 * @param {string} [probe.finalUrl]     URL tras seguir redirecciones
 * @param {number} [probe.status]       código HTTP
 * @param {string} [probe.body]         cuerpo (ya recortado), si era HTML
 * @param {string} [probe.errorCode]    código de error de red (ENOTFOUND…)
 * @param {string} [probe.errorMessage] mensaje del error
 * @param {boolean} [probe.aborted]     el timeout saltó
 * @param {"ok"|"nxdomain"|"sin-ns"|"desconocido"} [probe.dns]
 *        veredicto de la consulta NS, solo cuando la resolución falló
 */
export function classifyProbe(probe) {
  const { url, finalUrl, status, body = "", errorCode = "", errorMessage = "", aborted } = probe;

  if (aborted) {
    return { tag: "timeout", level: "incertidumbre", detail: "sin respuesta dentro del timeout" };
  }

  if (errorCode || errorMessage) {
    // El dominio no resuelve. Distinguir por qué importa: NXDOMAIN es "no
    // existe", sin NS es "existe pero está sin delegar" (típico de caducado), y
    // delegado sin registro A es "hay dominio, no hay host". Las tres son
    // señales fuertes, pero cuentan historias distintas al revisar la fila.
    if (errorCode === "ENOTFOUND" || errorCode === "EAI_AGAIN") {
      if (probe.dns === "nxdomain") {
        return { tag: "nxdomain", level: "señal", detail: "el dominio no existe" };
      }
      if (probe.dns === "sin-ns") {
        return {
          tag: "sin-ns",
          level: "señal",
          detail: "dominio registrado pero sin servidores de nombres",
        };
      }
      if (probe.dns === "ok") {
        return {
          tag: "sin-registro-a",
          level: "señal",
          detail: "dominio delegado, pero el host no tiene registro A",
        };
      }
      // EAI_AGAIN sin veredicto es un fallo del resolver, no del dominio.
      return { tag: "dns", level: "incertidumbre", detail: `DNS no resuelve (${errorCode})` };
    }
    if (errorCode === "ECONNREFUSED") {
      return { tag: "conexion-rechazada", level: "señal", detail: "conexión rechazada" };
    }
    if (
      errorCode.startsWith("CERT") ||
      errorCode.startsWith("ERR_TLS") ||
      errorCode.includes("SSL") ||
      errorCode === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
      errorCode === "DEPTH_ZERO_SELF_SIGNED_CERT" ||
      /certificate|altnames/i.test(errorMessage)
    ) {
      // El sitio existe; lo que falla es su certificado. Nunca es prueba de
      // baja: el catálogo ya se topó con esto en sitios institucionales vivos.
      return { tag: "tls", level: "incertidumbre", detail: errorCode || "error de certificado" };
    }
    if (errorCode === "ETIMEDOUT" || errorCode === "UND_ERR_CONNECT_TIMEOUT") {
      return { tag: "timeout", level: "incertidumbre", detail: "sin respuesta dentro del timeout" };
    }
    return {
      tag: "conexion",
      level: "incertidumbre",
      detail: (errorCode || errorMessage).slice(0, 80),
    };
  }

  if (status === 404 || status === 410) {
    return { tag: `http-${status}`, level: "señal", detail: `HTTP ${status}` };
  }
  if (status >= 400) {
    const hint = status === 403 || status === 429 ? " (¿bloqueo anti-bot?)" : "";
    return { tag: `http-${status}`, level: "incertidumbre", detail: `HTTP ${status}${hint}` };
  }

  const lower = body.toLowerCase();

  const parking = matchIn(lower, PARKING_PATTERNS);
  if (parking) return { tag: "parking", level: "señal", detail: `patrón «${parking}»` };

  const placeholder = matchIn(lower, PROVIDER_PLACEHOLDER_PATTERNS);
  if (placeholder) {
    return { tag: "portada-proveedor", level: "señal", detail: `patrón «${placeholder}»` };
  }

  const titleMatch = lower.match(/<title[^>]*>([^<]*)</i);
  const title = (titleMatch?.[1] ?? "").trim();
  // Límite de palabra para evitar falsos positivos por subcadena
  // (p. ej. «especialista» contiene «cialis»).
  const spam = SPAM_TITLE_PATTERNS.find((pattern) =>
    new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(title),
  );
  if (spam) {
    return { tag: "contenido-ajeno", level: "señal", detail: `título: «${title.slice(0, 70)}»` };
  }

  if (finalUrl) {
    const startDomain = registrableDomain(new URL(url).hostname);
    const endDomain = registrableDomain(new URL(finalUrl).hostname);
    if (endDomain !== startDomain) {
      return {
        tag: "redirige",
        level: "señal",
        detail: `→ ${new URL(finalUrl).hostname} (¿rebrand legítimo o dominio revendido?)`,
      };
    }
  }
  return { tag: "ok", level: "ok", detail: `HTTP ${status}` };
}

// ---------------------------------------------------------------------------
// Sondeo: la parte que sí toca la red.
// ---------------------------------------------------------------------------

async function readCapped(response, limit) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: false });
  let text = "";
  try {
    while (text.length < limit) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // ignorar: solo liberamos la conexión
    }
  }
  return text.slice(0, limit);
}

// Solo se llama cuando la resolución ya falló: separa "no existe" de
// "registrado sin delegar" y de "delegado sin host".
async function dnsVerdict(hostname) {
  const domain = registrableDomain(hostname);
  try {
    const ns = await dns.resolveNs(domain);
    return ns.length ? "ok" : "sin-ns";
  } catch (error) {
    const code = String(error?.code ?? "");
    if (code === "ENOTFOUND") return "nxdomain";
    if (code === "ENODATA" || code === "SERVFAIL") return "sin-ns";
    return "desconocido";
  }
}

async function probeUrl(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": USER_AGENT, accept: "text/html,*/*;q=0.8" },
    });
    const contentType = response.headers.get("content-type") ?? "";
    let body = "";
    if (response.status < 400 && contentType.includes("text/html")) {
      body = await readCapped(response, BODY_LIMIT);
    } else {
      try {
        await response.body?.cancel();
      } catch {
        // sin cuerpo que liberar
      }
    }
    return { url, finalUrl: response.url || url, status: response.status, body };
  } catch (error) {
    const aborted = error?.name === "AbortError" || error?.name === "TimeoutError";
    const errorCode = String(error?.cause?.code ?? error?.code ?? "");
    const errorMessage = String(error?.cause?.message ?? error?.message ?? "");
    const probe = { url, errorCode, errorMessage, aborted };
    if (!aborted && (errorCode === "ENOTFOUND" || errorCode === "EAI_AGAIN")) {
      probe.dns = await dnsVerdict(new URL(url).hostname);
    }
    return probe;
  } finally {
    clearTimeout(timer);
  }
}

// Reintento único, y solo para lo que puede ser un tropiezo de red. Un timeout
// se clasifica como timeout, no como caída: reintentar una señal firme
// (NXDOMAIN, parking) solo gastaría tiempo.
const RETRYABLE = new Set(["timeout", "conexion", "dns"]);

async function classifyUrl(url, timeoutMs) {
  let result = classifyProbe(await probeUrl(url, timeoutMs));
  if (RETRYABLE.has(result.tag)) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    result = classifyProbe(await probeUrl(url, timeoutMs * 2));
  }
  return result;
}

async function runPool(items, concurrency, worker) {
  const queue = [...items.entries()];
  const results = new Array(items.length);
  async function drain() {
    while (queue.length) {
      const [index, item] = queue.shift();
      results[index] = await worker(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, drain));
  return results;
}

// ---------------------------------------------------------------------------
// Snapshot
// ---------------------------------------------------------------------------

export function readSnapshot(file = SNAPSHOT_PATH) {
  if (!fs.existsSync(file)) return { generatedAt: null, urls: {} };
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return { generatedAt: data.generatedAt ?? null, urls: data.urls ?? {} };
  } catch {
    return { generatedAt: null, urls: {} };
  }
}

function writeSnapshot(previous, fresh, today, file = SNAPSHOT_PATH) {
  // Merge: una tanda por area no debe borrar lo que ya se sabe del resto.
  const urls = { ...previous.urls, ...fresh };
  const ordered = Object.fromEntries(Object.keys(urls).sort().map((key) => [key, urls[key]]));
  const payload = {
    generatedAt: today,
    nota:
      "Snapshot de resolución de la columna `web`. Afirmación dinámica: caduca. " +
      "Clasifica, no decide — un 403 no es un sitio muerto y un 200 no prueba que la web sea del productor. " +
      "Regenerar con `pnpm check:links --all`.",
    urls: ordered,
  };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
  return Object.keys(ordered).length;
}

const daysBetween = (from, to) =>
  Math.round((Date.parse(to) - Date.parse(from)) / (1000 * 60 * 60 * 24));

// ---------------------------------------------------------------------------

function collectRows(files) {
  const rowsByUrl = new Map();
  const rowsByDomain = new Map();
  for (const file of files) {
    const key = path.relative(CSV_ROOT, file).replace(/\\/g, "/").replace(/\.csv$/, "");
    const rows = parse(fs.readFileSync(file), { bom: true, columns: true, skip_empty_lines: true });
    for (const row of rows) {
      const url = (row.web ?? "").trim();
      if (!url) continue;
      const slug = `${key}/${(row.slug ?? "").trim()}`;
      if (!rowsByUrl.has(url)) rowsByUrl.set(url, []);
      rowsByUrl.get(url).push(slug);
      let domain;
      try {
        domain = registrableDomain(new URL(url).hostname);
      } catch {
        continue;
      }
      if (!rowsByDomain.has(domain)) rowsByDomain.set(domain, new Set());
      rowsByDomain.get(domain).add(slug);
    }
  }
  return { rowsByUrl, rowsByDomain };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = listCsvFiles(args.all || args.offline ? args.areas : args.areas);
  const { rowsByUrl, rowsByDomain } = collectRows(files);
  const urls = [...rowsByUrl.keys()];
  const today = new Date().toISOString().slice(0, 10);
  const previous = readSnapshot();

  let classified;
  let sinDato = 0;
  if (args.offline) {
    classified = urls.map((url) => {
      const stored = previous.urls[url];
      if (!stored) {
        sinDato += 1;
        return { tag: "sin-dato", level: "incertidumbre", detail: "no está en el snapshot" };
      }
      return stored;
    });
  } else {
    console.error(
      `Comprobando ${urls.length} URLs únicas (${[...rowsByUrl.values()].reduce((sum, list) => sum + list.length, 0)} filas) con concurrencia ${args.concurrency}…`,
    );
    classified = await runPool(urls, args.concurrency, (url) => classifyUrl(url, args.timeout));
    if (args.snapshot) {
      const fresh = Object.fromEntries(
        urls.map((url, index) => [url, { ...classified[index], checkedAt: today }]),
      );
      const total = writeSnapshot(previous, fresh, today);
      console.error(`Snapshot actualizado: ${SNAPSHOT_PATH} (${total} URLs).`);
    }
  }

  const findings = urls.map((url, index) => ({
    url,
    filas: rowsByUrl.get(url),
    ...classified[index],
  }));
  const sharedDomains = [...rowsByDomain.entries()]
    .filter(([, slugs]) => slugs.size > 1)
    .map(([domain, slugs]) => ({ domain, filas: [...slugs].sort() }))
    .sort((a, b) => b.filas.length - a.filas.length);

  if (args.json) {
    console.log(JSON.stringify({ generatedAt: previous.generatedAt, findings, sharedDomains }, null, 2));
    return;
  }

  const signals = findings.filter((finding) => finding.level === "señal");
  const uncertain = findings.filter((finding) => finding.level === "incertidumbre");
  const ok = findings.length - signals.length - uncertain.length;

  const printFinding = (finding) => {
    const age =
      finding.checkedAt && finding.checkedAt !== today
        ? ` · visto hace ${daysBetween(finding.checkedAt, today)} d`
        : "";
    for (const fila of finding.filas) {
      console.log(`  [${finding.tag}] ${fila} · ${finding.url} · ${finding.detail}${age}`);
    }
  };

  if (args.offline) {
    const stale = findings.filter(
      (f) => f.checkedAt && daysBetween(f.checkedAt, today) > STALE_DAYS,
    ).length;
    console.log(
      `Leído del snapshot de ${previous.generatedAt ?? "(sin fecha)"} — ${urls.length} URLs en alcance` +
        (sinDato ? `, ${sinDato} sin dato` : "") +
        (stale ? `, ${stale} con más de ${STALE_DAYS} días` : ""),
    );
  }

  console.log("");
  console.log(`— Señales (candidatas a acción tras contraste): ${signals.length} URL(s) —`);
  for (const tag of SIGNAL_ORDER) {
    signals.filter((finding) => finding.tag === tag).forEach(printFinding);
  }
  signals.filter((finding) => !SIGNAL_ORDER.includes(finding.tag)).forEach(printFinding);

  console.log("");
  console.log(
    `— Incertidumbre técnica (no prueba baja; 403/429/timeout suelen ser anti-bot): ${uncertain.length} URL(s) —`,
  );
  uncertain.forEach(printFinding);

  if (sharedDomains.length) {
    console.log("");
    console.log(`— Dominios compartidos por varias filas (¿fuente sectorial como web propia?) —`);
    for (const shared of sharedDomains) {
      console.log(`  ${shared.domain} — ${shared.filas.length} filas: ${shared.filas.join(", ")}`);
    }
  }

  console.log("");
  console.log(`Resumen: ${ok} ok · ${signals.length} señales · ${uncertain.length} incertidumbre.`);
  console.log(
    "Regla dura: un fallo técnico no prueba una baja; contrasta por otra vía antes de retirar web, venta o fila.",
  );
}

// Importable para las pruebas; sigue siendo un CLI cuando se ejecuta directo.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
