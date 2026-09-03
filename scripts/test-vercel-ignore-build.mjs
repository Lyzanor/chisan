import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyDeploymentChanges,
  isDeploymentNeutralPath,
} from "./vercel-ignore-build.mjs";

test("deployment-neutral repository records do not require a Vercel build", () => {
  const paths = [
    ".github/workflows/verify.yml",
    ".gitignore",
    "AGENTS.md",
    "README.md",
    "data/csv/es/AGENTS.md",
    "data/evidence/es/catalunya/barcelona.jsonl",
    "design/qa/design-qa.md",
    "docs/OPERATIONS.md",
    "docs/candidates/es/barcelona.md",
    "scripts/test-csv-audit.sh",
    "scripts/test-evidence-contract.mjs",
  ];

  for (const filePath of paths) assert.equal(isDeploymentNeutralPath(filePath), true, filePath);
  assert.deepEqual(classifyDeploymentChanges(paths), {
    deploymentNeutral: [...paths].sort(),
    deploymentRequired: [],
  });
});

test("every public or build input requires a Vercel deployment", () => {
  const paths = [
    "app/(application)/page.tsx",
    "components/area-catalog.tsx",
    "data/csv/es/catalunya/barcelona.csv",
    "data/csv/es/translations.ca.csv",
    "data/reference/translation-glossary.json",
    "design/foundations/tokens.css",
    "lib/csv-catalog.ts",
    "next.config.ts",
    "package.json",
    "public/productores/example.webp",
    "scripts/vercel-ignore-build.mjs",
    "vercel.json",
  ];

  for (const filePath of paths) assert.equal(isDeploymentNeutralPath(filePath), false, filePath);
  assert.deepEqual(classifyDeploymentChanges(paths), {
    deploymentNeutral: [],
    deploymentRequired: [...paths].sort(),
  });
});

test("one deployable file makes a mixed push build", () => {
  assert.deepEqual(
    classifyDeploymentChanges([
      "docs/OPERATIONS.md",
      "data/evidence/es/catalunya/barcelona.jsonl",
      "app/(application)/page.tsx",
    ]),
    {
      deploymentNeutral: [
        "data/evidence/es/catalunya/barcelona.jsonl",
        "docs/OPERATIONS.md",
      ],
      deploymentRequired: ["app/(application)/page.tsx"],
    },
  );
});

test("duplicate and platform-specific paths are normalized deterministically", () => {
  assert.deepEqual(
    classifyDeploymentChanges(["./docs/OPERATIONS.md", "docs\\OPERATIONS.md", "./vercel.json"]),
    {
      deploymentNeutral: ["docs/OPERATIONS.md"],
      deploymentRequired: ["vercel.json"],
    },
  );
});
