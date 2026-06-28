#!/usr/bin/env node
// match-dar.mjs — Helper de verificación (NO es fuente de verdad).
//
// Cruza las filas de UN municipio de un CSV de provincia contra el dataset
// DAR "venda de proximitat" de la Generalitat (Socrata `xmyy-7xqi`) por
// teléfono / email / apellidos normalizados. Acelera la verificación profunda
// de Barcelona (ver docs/verificacion/barcelona.md): confirma existencia
// (→ parcial), detecta dups registre↔marca y sugiere recats vía `productes`.
//
// El match por tel/email es municipi-agnóstico (caza productores fichados en
// un municipio vecino). DAR confirma existencia, NO venta online.
//
// Uso:
//   node scripts/match-dar.mjs "<municipio>" [--csv <ruta>] [--all]
//     --csv  CSV de provincia (def. data/csv/catalunya/barcelona.csv)
//     --all  incluir todas las filas, no solo `pendiente`
//
// El DAR se cachea en /tmp/dar.csv (se descarga si falta).

import fs from "node:fs";

const DAR_URL =
  "https://analisi.transparenciacatalunya.cat/resource/xmyy-7xqi.csv?$limit=6000";
const DAR_CACHE = "/tmp/dar.csv";

// --- parser CSV mínimo (campos entre comillas, comas y CRLF) ---
function parseCSV(text) {
  const rows = [];
  let field = "",
    row = [],
    inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
const toObjects = (rows) => {
  const head = rows[0];
  return rows
    .slice(1)
    .filter((r) => r.length === head.length)
    .map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
};

const fold = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
const phone9 = (s) => {
  const d = (s || "").replace(/\D/g, "");
  return d.length >= 9 ? d.slice(-9) : "";
};
const STOP = new Set([
  "de", "la", "el", "i", "y", "del", "les", "els", "sl", "scp", "sccl",
  "sat", "sa", "cb", "s", "l", "c", "p", "can",
]);
const tokens = (s) =>
  fold(s)
    .replace(/[.,()'’\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOP.has(t));
const push = (map, k, v) => {
  if (!k) return;
  if (!map.has(k)) map.set(k, []);
  map.get(k).push(v);
};

async function loadDar() {
  if (!fs.existsSync(DAR_CACHE)) {
    process.stderr.write("Descargando DAR…\n");
    const res = await fetch(DAR_URL);
    if (!res.ok) throw new Error("DAR fetch failed: " + res.status);
    fs.writeFileSync(DAR_CACHE, await res.text());
  }
  return toObjects(parseCSV(fs.readFileSync(DAR_CACHE, "utf8")));
}

// --- args ---
const argv = process.argv.slice(2);
let municipio = null,
  csvPath = "data/csv/catalunya/barcelona.csv",
  all = false;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--csv") csvPath = argv[++i];
  else if (argv[i] === "--all") all = true;
  else municipio = argv[i];
}
if (!municipio) {
  console.error('Uso: node scripts/match-dar.mjs "<municipio>" [--csv <ruta>] [--all]');
  process.exit(1);
}

const dar = await loadDar();
for (const d of dar) {
  d._ph = phone9(d.tel_fon);
  d._em = fold(d.correu);
  d._tok = new Set(tokens(`${d.nom_productor} ${d.marca_comercial || ""}`));
  d._mun = fold(d.municipi);
}
const darByPhone = new Map(),
  darByEmail = new Map();
for (const d of dar) {
  push(darByPhone, d._ph, d);
  push(darByEmail, d._em, d);
}

const prov = toObjects(parseCSV(fs.readFileSync(csvPath, "utf8")));
const munFold = fold(municipio);
let rows = prov.filter((r) => fold(r.municipio) === munFold);
if (!all) rows = rows.filter((r) => fold(r.verificacion) === "pendiente");

const seenPh = new Map(),
  seenEm = new Map();
for (const r of rows) {
  push(seenPh, phone9(r.telefono), r.slug);
  push(seenEm, fold(r.correo), r.slug);
}

function bestMatch(r) {
  const ph = phone9(r.telefono),
    em = fold(r.correo);
  if (ph && darByPhone.has(ph)) return { d: darByPhone.get(ph)[0], why: "tel" };
  if (em && darByEmail.has(em)) return { d: darByEmail.get(em)[0], why: "email" };
  const tk = new Set(tokens(r.nombre));
  let best = null,
    bestN = 0;
  for (const d of dar) {
    let n = 0;
    for (const t of tk) if (d._tok.has(t)) n++;
    if (n > bestN) {
      bestN = n;
      best = d;
    }
  }
  if (best && bestN >= 2)
    return { d: best, why: `cognoms×${bestN}${best._mun === munFold ? "+mun" : "≠mun"}` };
  return null;
}

console.log(`\n== ${municipio} (${csvPath}) — ${rows.length} ${all ? "filas" : "pendientes"} ==\n`);
const matchedDar = new Set();
for (const r of rows) {
  const m = bestMatch(r);
  if (m) {
    matchedDar.add(m.d);
    const d = m.d;
    console.log(`✓ ${r.slug}  [${r.categoria}]  «${r.nombre}»`);
    console.log(`    DAR(${m.why}): ${d.nom_productor}${d.marca_comercial ? ` · marca=${d.marca_comercial}` : ""} · [${d.municipi}]`);
    console.log(`    productes: ${(d.productes || "").slice(0, 72)}`);
    console.log(`    venda_directa=${d.venda_directa} circuit_curt=${d.venda_circuit_curt} · tel=${d.tel_fon} · ${d.correu}`);
  } else {
    console.log(`·  ${r.slug}  [${r.categoria}]  «${r.nombre}»  — sin match DAR  (web=${(r.web || "").slice(0, 34)} IG=${r.Instagram ? "sí" : "-"})`);
  }
}

const dups = [...seenPh.entries(), ...seenEm.entries()].filter(([, v]) => v.length > 1);
if (dups.length) {
  console.log(`\n-- posibles dups internos (tel/email compartido) --`);
  for (const [k, v] of dups) console.log(`   ${k}: ${v.join(" , ")}`);
}

const cand = dar.filter((d) => d._mun === munFold && !matchedDar.has(d));
if (cand.length) {
  console.log(`\n-- DAR en ${municipio} NO casados (candidatos futuros) --`);
  for (const d of cand)
    console.log(`   ${d.nom_productor}${d.marca_comercial ? ` (${d.marca_comercial})` : ""} · ${(d.productes || "").slice(0, 42)} · ${d.tel_fon}`);
}
console.log("");
