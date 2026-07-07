#!/usr/bin/env node

// Triaje de link-rot para la columna `web` (solo informe; exit 0 siempre).
// Un fallo de red es incertidumbre, no prueba de baja (docs/EDITORIAL_POLICY.md):
// contrasta por otra vía antes de tocar el CSV. No forma parte de ningún gate
// porque depende de la red y de bloqueos anti-bot.

import fs from "node:fs";
import path from "node:path";

import { parse } from "csv-parse/sync";

const CSV_ROOT = "data/csv";
const BODY_LIMIT = 65536;
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

const SIGNAL_ORDER = ["dns", "parking", "contenido-ajeno", "redirige", "http-404", "http-410"];

function usage() {
  console.log(`Uso: node scripts/check-links.mjs --provincia <stem>[,<stem>] [opciones]

Opciones:
  --provincia <stem>    Provincia(s) a comprobar (ej. girona,cadiz). Requerido salvo --all.
  --all                 Comprueba los 50 CSV (lento; úsalo con criterio).
  --timeout <ms>        Timeout por URL (defecto 10000).
  --concurrency <n>     Peticiones simultáneas (defecto 6).
  --json                Salida JSON completa.`);
}

function parseArgs(argv) {
  const args = { provincias: [], all: false, timeout: 10000, concurrency: 6, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") {
      args.json = true;
    } else if (arg === "--all") {
      args.all = true;
    } else if (arg === "--provincia") {
      const value = argv[++i];
      if (!value) throw new Error("--provincia requiere un valor");
      args.provincias.push(
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
  if (!args.all && args.provincias.length === 0) {
    usage();
    throw new Error("Indica --provincia o --all.");
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

function registrableDomain(hostname) {
  const host = hostname.replace(/^www\./i, "").toLowerCase();
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join(".");
  if (TWO_LEVEL_TLDS.has(lastTwo)) return parts.slice(-3).join(".");
  return lastTwo;
}

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

async function classifyUrl(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": USER_AGENT, accept: "text/html,*/*;q=0.8" },
    });
    const startDomain = registrableDomain(new URL(url).hostname);
    const finalUrl = new URL(response.url || url);
    const endDomain = registrableDomain(finalUrl.hostname);

    if (response.status === 404 || response.status === 410) {
      try {
        await response.body?.cancel();
      } catch {
        // sin cuerpo que liberar
      }
      return { tag: `http-${response.status}`, level: "señal", detail: `HTTP ${response.status}` };
    }
    if (response.status >= 400) {
      try {
        await response.body?.cancel();
      } catch {
        // sin cuerpo que liberar
      }
      const hint = response.status === 403 || response.status === 429 ? " (¿bloqueo anti-bot?)" : "";
      return { tag: `http-${response.status}`, level: "incertidumbre", detail: `HTTP ${response.status}${hint}` };
    }

    let body = "";
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      body = (await readCapped(response, BODY_LIMIT)).toLowerCase();
    } else {
      try {
        await response.body?.cancel();
      } catch {
        // sin cuerpo que liberar
      }
    }

    const parking = PARKING_PATTERNS.find((pattern) => body.includes(pattern));
    if (parking) return { tag: "parking", level: "señal", detail: `patrón «${parking}»` };

    const titleMatch = body.match(/<title[^>]*>([^<]*)</i);
    const title = (titleMatch?.[1] ?? "").trim();
    // Límite de palabra para evitar falsos positivos por subcadena
    // (p. ej. «especialista» contiene «cialis»).
    const spam = SPAM_TITLE_PATTERNS.find((pattern) =>
      new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(title),
    );
    if (spam) {
      return { tag: "contenido-ajeno", level: "señal", detail: `título: «${title.slice(0, 70)}»` };
    }

    if (endDomain !== startDomain) {
      return {
        tag: "redirige",
        level: "señal",
        detail: `→ ${finalUrl.hostname} (¿rebrand legítimo o dominio revendido?)`,
      };
    }
    return { tag: "ok", level: "ok", detail: `HTTP ${response.status}` };
  } catch (error) {
    if (error?.name === "AbortError" || error?.name === "TimeoutError") {
      return { tag: "timeout", level: "incertidumbre", detail: `sin respuesta en ${timeoutMs} ms` };
    }
    const code = String(error?.cause?.code ?? error?.code ?? "");
    if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
      return { tag: "dns", level: "señal", detail: `DNS no resuelve (${code})` };
    }
    const message = String(error?.cause?.message ?? error?.message ?? "");
    if (code.startsWith("CERT") || code.includes("SSL") || /certificate/i.test(message)) {
      return { tag: "tls", level: "incertidumbre", detail: code || "error de certificado" };
    }
    return { tag: "conexion", level: "incertidumbre", detail: (code || message).slice(0, 80) };
  } finally {
    clearTimeout(timer);
  }
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = listCsvFiles(args.all ? [] : args.provincias);

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

  const urls = [...rowsByUrl.keys()];
  console.error(
    `Comprobando ${urls.length} URLs únicas (${[...rowsByUrl.values()].reduce((sum, list) => sum + list.length, 0)} filas) con concurrencia ${args.concurrency}…`,
  );
  const classified = await runPool(urls, args.concurrency, (url) => classifyUrl(url, args.timeout));

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
    console.log(JSON.stringify({ findings, sharedDomains }, null, 2));
    return;
  }

  const signals = findings.filter((finding) => finding.level === "señal");
  const uncertain = findings.filter((finding) => finding.level === "incertidumbre");
  const ok = findings.length - signals.length - uncertain.length;

  const printFinding = (finding) => {
    for (const fila of finding.filas) {
      console.log(`  [${finding.tag}] ${fila} · ${finding.url} · ${finding.detail}`);
    }
  };

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

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
