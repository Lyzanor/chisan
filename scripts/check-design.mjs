#!/usr/bin/env node

/*
 * Checks the stylesheets against design/README.md.
 *
 * design/foundations/tokens.css is the only place raw values live. Every rule
 * carries a baseline: the number of findings accepted when the rule was last
 * reviewed. Style findings are review prompts. Undefined `--chisan-*`
 * properties and new undersized interactive targets fail the check, because
 * both break rendering or accessibility without a visible error.
 *
 * Run `node scripts/check-design.mjs --list <rule>` to see the offending lines.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS = "design/foundations/tokens.css";
const STYLE_ROOTS = ["app", "components", "design"];
const SOURCE_ROOTS = ["app", "components", "lib"];

function listFiles(relativeDirectory, matches) {
  const fullDirectory = path.join(ROOT, relativeDirectory);
  if (!fs.existsSync(fullDirectory)) return [];

  return fs
    .readdirSync(fullDirectory, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.join(relativeDirectory, entry.name);
      if (entry.isDirectory()) return entry.name === "node_modules" ? [] : listFiles(relativePath, matches);
      return entry.isFile() && matches(entry.name) ? [relativePath] : [];
    })
    .sort();
}

const SHEETS = STYLE_ROOTS.flatMap((root) => listFiles(root, (name) => name.endsWith(".css"))).sort();
const SOURCES = SOURCE_ROOTS.flatMap((root) => listFiles(root, (name) => /\.(tsx?|jsx?)$/.test(name)));

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const withoutComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "));

// Custom properties declared in any stylesheet or set from component markup.
const DECLARED = new Set();
for (const file of SHEETS) {
  for (const match of withoutComments(read(file)).matchAll(/(--[\w-]+)\s*:/g)) DECLARED.add(match[1]);
}
for (const file of SOURCES) {
  for (const match of read(file).matchAll(/["'`](--[\w-]+)["'`]\s*[:\]]/g)) DECLARED.add(match[1]);
}

const SPACE_SCALE = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128];
const RADII = ["0", "50%", "2px", "inherit"];
const PILL_ALLOWLIST = [".catalog-chip", ".detail-product-list", ".admin-field-tags", ".admin-filter-tabs"];

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
    name: "undefined-token",
    severity: "error",
    baseline: 0,
    describe: "var(--chisan-*) with no declaration or fallback",
    find: (file, css) =>
      [...css.matchAll(/var\(\s*(--chisan-[\w-]+)\s*(,)?/g)]
        .filter((m) => !m[2] && !DECLARED.has(m[1]))
        .map((m) => ({ at: m.index, text: m[1] })),
  },
  {
    name: "raw-colour",
    baseline: 0,
    describe: "colour literals outside design/foundations/tokens.css",
    find: (file, css) =>
      file === TOKENS
        ? []
        : [...css.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi)]
            .filter((m) => !/^rgba?\(\s*var\(/i.test(m[0]))
            .map((m) => ({ at: m.index, text: m[0] })),
  },
  {
    name: "off-scale-space",
    baseline: 9,
    describe: "padding/margin/gap literal off the 4px scale",
    find: (file, css) =>
      file === TOKENS
        ? []
        : [...css.matchAll(/(?:padding|margin|gap)[a-z-]*:\s*([^;}]+)/g)].flatMap((m) =>
            m[1]
              .split(/\s+/)
              .filter((v) => toPx(v) !== null && !SPACE_SCALE.includes(toPx(v)))
              .map((v) => ({ at: m.index, text: `${v} = ${toPx(v)}px` })),
          ),
  },
  {
    name: "raw-font-size",
    baseline: 2,
    describe: "font-size other than a --chisan-font-* role",
    find: (file, css) =>
      file === TOKENS
        ? []
        : [...css.matchAll(/font-size:\s*([^;}]+)/g)]
            .filter((m) => !/^var\(--chisan-font-[\w-]+\)$|^(inherit|1em|100%)$/.test(m[1].trim()))
            .map((m) => ({ at: m.index, text: m[1].trim() })),
  },
  {
    name: "authored-weight",
    baseline: 0,
    describe: "font-weight other than a --chisan-weight-* token, 400 or 500",
    find: (file, css) =>
      [...css.matchAll(/font-weight:\s*([^;}]+)/g)]
        .filter((m) => !/^(var\(--chisan-weight-[\w-]+\)|400|500|inherit|normal)$/.test(m[1].trim()))
        .map((m) => ({ at: m.index, text: m[1].trim() })),
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
    baseline: 1,
    describe: "pill radius outside toggles, filters and tags",
    find: (file, css) =>
      blocks(css)
        .filter(
          (b) =>
            /border-radius:\s*(999px|var\(--chisan-radius-pill\))/.test(b.body) &&
            !PILL_ALLOWLIST.some((allowed) => b.selector.includes(allowed)),
        )
        .map((b) => ({ line: b.line, text: b.selector.replace(/\s+/g, " ").slice(0, 70) })),
  },
  {
    name: "raw-radius",
    baseline: 0,
    describe: "border-radius other than a --chisan-radius-* token, 0, 2px or 50%",
    find: (file, css) =>
      file === TOKENS
        ? []
        : [...css.matchAll(/border-radius:\s*([^;}]+)/g)]
            .filter((m) => {
              const value = m[1].trim();
              if (value.startsWith("calc(")) return false;
              return value.split(/\s+/).some((part) => !part.startsWith("var(--chisan-radius-") && !RADII.includes(part));
            })
            .map((m) => ({ at: m.index, text: m[1].trim() })),
  },
  {
    name: "raw-transition",
    baseline: 2,
    describe: "transition with a literal duration or keyword curve",
    find: (file, css) =>
      [...css.matchAll(/transition(?:-duration|-timing-function)?:\s*([^;}]+)/g)]
        .filter((m) => /(?<![\w-])(\d*\.?\d+m?s|ease(?:-in|-out|-in-out)?)(?![\w-])/.test(m[1]))
        .map((m) => ({ at: m.index, text: m[1].replace(/\s+/g, " ").trim().slice(0, 70) })),
  },
  {
    // Phones are the primary surface: base styles serve them, min-width adds.
    name: "max-width-query",
    baseline: 23,
    describe: "viewport queries capped by max-width instead of min-width",
    find: (file, css) =>
      [...css.matchAll(/@media([^{]*)\{/g)]
        .filter((m) => /max-width|\bwidth\s*</.test(m[1]) && !/min-width|\bwidth\s*>/.test(m[1]))
        .map((m) => ({ at: m.index, text: m[1].trim() })),
  },
  {
    name: "small-target",
    severity: "error",
    baseline: 0,
    describe: "explicit interactive min-height under 44px (heuristic)",
    find: (file, css) =>
      blocks(css).flatMap((block) => {
        const interactive = /(?:^|[\s,>])(?:button|input|select|textarea|a)(?=[\s,.#[:]|$)|(?:__|-)(?:button|link|toggle|trigger|control|submit|chip|input|select)(?=[\s,.#[:]|$)/.test(block.selector);
        if (!interactive) return [];
        return [...block.body.matchAll(/min-height:\s*(\d+)px/g)]
          .filter((match) => Number(match[1]) < 44)
          .map((match) => ({ line: block.line, text: `${block.selector.replace(/\s+/g, " ")} (${match[1]}px)` }));
      }),
  },
];

const listing = process.argv.includes("--list")
  ? process.argv[process.argv.indexOf("--list") + 1]
  : null;

let failed = false;

for (const rule of RULES) {
  const hits = [];
  for (const file of SHEETS) {
    const css = withoutComments(read(file));
    for (const hit of rule.find(file, css)) {
      const line = hit.line ?? css.slice(0, hit.at).split("\n").length;
      hits.push({ file, line, text: hit.text });
    }
  }

  const delta = hits.length - rule.baseline;
  const blocking = rule.severity === "error";
  const status = delta > 0 ? (blocking ? "FAIL" : "NOTE") : delta < 0 ? "DOWN" : "ok  ";
  if (blocking && delta > 0) failed = true;

  const note = delta > 0 ? ` +${delta}` : delta < 0 ? ` — lower baseline to ${hits.length}` : "";
  console.log(
    `${status} ${rule.name.padEnd(18)} ${String(hits.length).padStart(4)}/${String(rule.baseline).padEnd(4)} ${rule.describe}${note}`,
  );

  if (listing === rule.name) {
    for (const hit of hits) console.log(`       ${hit.file}:${hit.line}  ${hit.text}`);
  }
}

if (failed) {
  console.error("\nA blocking design check regressed: an undefined token or an undersized target. Inspect the listed rules.");
  process.exit(1);
}
console.log("\nNo blocking design check regressed. Assess style notices in context.");
