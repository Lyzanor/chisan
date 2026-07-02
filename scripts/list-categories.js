#!/usr/bin/env node

async function main() {
  const [fs, path] = await Promise.all([import("node:fs"), import("node:path")]);
  const configPath = path.resolve(__dirname, "../data/reference/categories.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  for (const category of config.categories) {
    console.log(category);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
