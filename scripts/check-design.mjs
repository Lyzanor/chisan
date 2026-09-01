#!/usr/bin/env node

/*
 * Checks the stylesheets against design/README.md.
 *
 * The app predates the design system, so every rule carries a baseline: the
 * number of violations that existed when the rule was written. The check fails
 * when a count rises. Fix violations, lower the baseline, never raise it.
 *
 * Run `node scripts/check-design.mjs --list <rule>` to see the offending lines.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS = "design/foundations/tokens.css";
const STYLE_ROOTS = ["app", "components", "design"];

function listStyles(relativeDirectory) {
  const fullDirectory = path.join(ROOT, relativeDirectory);
  if (!fs.existsSync(fullDirectory)) return [];

  return fs
    .readdirSync(fullDirectory, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.join(relativeDirectory, entry.name);
      if (entry.isDirectory()) return listStyles(relativePath);
      return entry.isFile() && entry.name.endsWith(".css") ? [relativePath] : [];
    })
    .sort();
}

const SHEETS = STYLE_ROOTS.flatMap(listStyles).sort();

// Design tokens are the one place raw values are allowed to appear.
const SPACE_SCALE = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128];
const RADII = ["0", "999px", "50%", "2px", "4px", "8px"];
const PILL_ALLOWLIST = [
  ".catalog-chip",
  ".detail-service-chips",
  ".detail-product-list",
  ".admin-field-tags",
  ".admin-filter-tabs",
];

/** Split a stylesheet into { selector, body, line } blocks. */
function blocks(css) {
  const found = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of css.matchAll(re)) {
    const selector = match[1].trim();
    if (selector.startsWith("@")) continue;
    found.push({
      selector,
      body: match[2],
      line: css.slice(0, match.index).split("\n").length,
    });
  }
  return found;
}

function toPx(value) {
  const match = /^([\d.]+)(rem|px)$/.exec(value);
  if (!match) return null;
  return match[2] === "rem" ? Number(match[1]) * 16 : Number(match[1]);
}

const RULES = [
  {
    name: "raw-colour",
    baseline: 71,
    describe: "colour literals outside design/foundations",
    find: (file, css) =>
      file === TOKENS
        ? []
        : [...css.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi)]
            .filter((m) => !/^rgb\(\s*var\(/i.test(m[0]))
            .map((m) => ({ at: m.index, text: m[0] })),
  },
  {
    name: "off-scale-space",
    baseline: 190,
    describe: "padding/margin/gap off the 4px scale",
    find: (file, css) =>
      [...css.matchAll(/(?:padding|margin|gap)[a-z-]*:\s*([^;}]+)/g)].flatMap((m) =>
        m[1]
          .split(/\s+/)
          .filter((v) => toPx(v) !== null && !SPACE_SCALE.includes(toPx(v)))
          .map((v) => ({ at: m.index, text: `${v} = ${toPx(v)}px` })),
      ),
  },
  {
    name: "type-scale",
    baseline: 80,
    describe: "font-size below 12px or off the type scale",
    find: (file, css) =>
      [...css.matchAll(/font-size:\s*([^;}]+)/g)]
        .filter((m) => {
          const px = toPx(m[1].trim());
          return px !== null && (px < 12 || ![12, 13, 14, 16, 18].includes(px));
        })
        .map((m) => ({ at: m.index, text: m[1].trim() })),
  },
  {
    name: "authored-weight",
    baseline: 0,
    describe: "authored CSS font-weight other than 400 or 500",
    find: (file, css) =>
      [...css.matchAll(/font-weight:\s*(\d+)/g)]
        .filter((m) => !["400", "500"].includes(m[1]))
        .map((m) => ({ at: m.index, text: m[1] })),
  },
  {
    name: "serif-fallback",
    baseline: 0,
    describe: "serif in a font-family fallback chain",
    find: (file, css) =>
      [...css.matchAll(/font-family:[^;}]*(?<!sans-)\b(serif|Georgia|Mincho)\b[^;}]*/gi)].map((m) => ({
        at: m.index,
        text: m[0].replace(/\s+/g, " ").slice(0, 70),
      })),
  },
  {
    name: "decorative-pill",
    baseline: 13,
    describe: "999px radius outside filters and tags",
    find: (file, css) =>
      blocks(css)
        .filter(
          (b) =>
            /border-radius:\s*999px/.test(b.body) &&
            !PILL_ALLOWLIST.some((allowed) => b.selector.includes(allowed)),
        )
        .map((b) => ({ line: b.line, text: b.selector.replace(/\s+/g, " ").slice(0, 70) })),
  },
  {
    name: "off-scale-radius",
    baseline: 1,
    describe: "border-radius outside 0 / 4px / 8px / 999px",
    find: (file, css) =>
      [...css.matchAll(/border-radius:\s*([^;}]+)/g)]
        .filter((m) => {
          const value = m[1].trim();
          if (value.startsWith("var(") || value.startsWith("calc(")) return false;
          return value.split(/\s+/).some((part) => !RADII.includes(part));
        })
        .map((m) => ({ at: m.index, text: m[1].trim() })),
  },
  {
    name: "small-target",
    baseline: 12,
    describe: "interactive min-height under 44px",
    find: (file, css) =>
      [...css.matchAll(/min-height:\s*(\d+)px/g)]
        .filter((m) => Number(m[1]) < 44)
        .map((m) => ({ at: m.index, text: `${m[1]}px` })),
  },
];

const listing = process.argv.includes("--list")
  ? process.argv[process.argv.indexOf("--list") + 1]
  : null;

let failed = false;

for (const rule of RULES) {
  const hits = [];
  for (const file of SHEETS) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    const css = fs.readFileSync(full, "utf8");
    for (const hit of rule.find(file, css)) {
      const line = hit.line ?? css.slice(0, hit.at).split("\n").length;
      hits.push({ file, line, text: hit.text });
    }
  }

  const delta = hits.length - rule.baseline;
  const status = delta > 0 ? "FAIL" : delta < 0 ? "DOWN" : "ok  ";
  if (delta > 0) failed = true;

  const note = delta > 0 ? ` +${delta}` : delta < 0 ? ` — lower baseline to ${hits.length}` : "";
  console.log(
    `${status} ${rule.name.padEnd(18)} ${String(hits.length).padStart(4)}/${String(rule.baseline).padEnd(4)} ${rule.describe}${note}`,
  );

  if (listing === rule.name) {
    for (const hit of hits) console.log(`       ${hit.file}:${hit.line}  ${hit.text}`);
  }
}

if (failed) {
  console.error("\nA design rule regressed. Fix it, or justify it in design/README.md.");
  process.exit(1);
}
console.log("\nNo design rule regressed.");
