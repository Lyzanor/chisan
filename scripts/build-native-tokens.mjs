import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync("design/foundations/tokens.css", "utf8");
const colors = Object.fromEntries([...source.matchAll(/--chisan-color-([\w-]+):\s*(#[\da-f]+);/gi)].map(([, key, value]) => [key, value]));
const output = `${JSON.stringify(colors, null, 2)}\n`;
const target = "design/adapters/native-colors.json";
if (process.argv.includes("--check")) {
  if (readFileSync(target, "utf8") !== output) throw new Error("Run pnpm build:mobile-tokens after changing brand colors.");
} else {
  writeFileSync(target, output);
}
