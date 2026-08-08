#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const registryRoot = path.resolve(process.argv[2] ?? "data/csv");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const countryPattern = /^[a-z]{2}$/;
const countryGuideHeadings = ["## Operating state", "## Country rules", "## Source ceilings"];
const errors = [];
const areas = new Map();

if (!fs.existsSync(registryRoot)) {
  console.error(`Area registry not found: ${registryRoot}`);
  process.exit(1);
}

const directories = (parent) =>
  fs
    .readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

for (const country of directories(registryRoot)) {
  if (!countryPattern.test(country)) {
    errors.push(`country '${country}' must be a lowercase ISO alpha-2 slug`);
  }

  const countryDir = path.join(registryRoot, country);
  const countryGuidePath = path.join(countryDir, "AGENTS.md");
  if (!fs.existsSync(countryGuidePath)) {
    errors.push(`country '${country}' must contain AGENTS.md`);
  } else {
    const headings = fs
      .readFileSync(countryGuidePath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line.startsWith("## "));
    if (JSON.stringify(headings) !== JSON.stringify(countryGuideHeadings)) {
      errors.push(
        `country guide '${country}/AGENTS.md' must use exactly: ${countryGuideHeadings.join(
          ", ",
        )}`,
      );
    }
  }
  for (const region of directories(countryDir)) {
    if (!slugPattern.test(region)) {
      errors.push(`region '${country}/${region}' must be lowercase ASCII kebab-case`);
    }

    const regionDir = path.join(countryDir, region);
    for (const file of fs.readdirSync(regionDir).sort()) {
      if (!file.endsWith(".csv")) continue;

      const area = file.slice(0, -4);
      const relativePath = path.join(country, region, file);
      if (!slugPattern.test(area)) {
        errors.push(`area '${relativePath}' must be lowercase ASCII kebab-case`);
      }

      const previous = areas.get(area);
      if (previous) {
        errors.push(
          `area slug '${area}' is global and duplicated by '${previous}' and '${relativePath}'`,
        );
      } else {
        areas.set(area, relativePath);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Area registry contract failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Area registry contract OK (${areas.size} areas)`);
