import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  "design/README.md",
  ...fs
    .readdirSync("docs")
    .filter((name) => name.endsWith(".md"))
    .map((name) => `docs/${name}`),
];
const errors = [];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  // Explicit Markdown links and named contract pointers, excluding example paths.
  const references = [
    ...[...source.matchAll(/\]\(([^)\s]+\.md)(?:#[^)]*)?\)/g)].map((match) => ({
      target: match[1],
      relative: true,
    })),
    ...[...source.matchAll(/`((?:docs\/|design\/)[^`<>*]+\.md)`/g)].map(
      (match) => ({ target: match[1], relative: false }),
    ),
  ];
  for (const { target, relative } of references) {
    if (/^[a-z]+:/.test(target)) continue;
    const destination = path.resolve(
      relative ? path.dirname(file) : root,
      target,
    );
    if (!fs.existsSync(destination))
      errors.push(`${file}: missing document ${target}`);
  }
}
for (const error of [...new Set(errors)]) console.error(error);
console.log(
  `Documentation: ${files.length} entry points, ${errors.length} broken references.`,
);
process.exitCode = errors.length ? 1 : 0;
