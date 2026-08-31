#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIR, "..");

const DEPLOYMENT_NEUTRAL_PATH_PATTERNS = [
  /^\.github\//,
  /^docs\//,
  /^data\/evidence\//,
  /^data\/csv\/[a-z]{2}\/AGENTS\.md$/,
  /^design\/.*\.md$/,
  /^scripts\/test-[^/]+(?:\.[^/]+)+$/,
  /^AGENTS\.md$/,
  /^README\.md$/,
  /^LICENSE(?:\.[^/]+)?$/,
  /^\.(?:editorconfig|gitattributes|gitignore|prettierignore)$/,
];

function normalizeRepositoryPath(filePath) {
  return filePath.replaceAll("\\", "/").split(path.sep).join("/").replace(/^\.\//, "");
}

export function isDeploymentNeutralPath(filePath) {
  const normalized = normalizeRepositoryPath(filePath);
  return DEPLOYMENT_NEUTRAL_PATH_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function classifyDeploymentChanges(filePaths) {
  const normalized = [...new Set(filePaths.map(normalizeRepositoryPath))].sort();
  return {
    deploymentNeutral: normalized.filter(isDeploymentNeutralPath),
    deploymentRequired: normalized.filter((filePath) => !isDeploymentNeutralPath(filePath)),
  };
}

function commitExists(repositoryRoot, revision) {
  try {
    execFileSync("git", ["rev-parse", "--verify", "--quiet", `${revision}^{commit}`], {
      cwd: repositoryRoot,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

export function collectDeploymentChanges({
  previousSha,
  currentSha = "HEAD",
  repositoryRoot = REPOSITORY_ROOT,
}) {
  if (!previousSha || /^0+$/.test(previousSha)) {
    throw new Error("VERCEL_GIT_PREVIOUS_SHA is unavailable");
  }
  if (!commitExists(repositoryRoot, previousSha)) {
    throw new Error(`previous deployment commit '${previousSha}' is not present in the clone`);
  }
  if (!commitExists(repositoryRoot, currentSha)) {
    throw new Error(`current deployment commit '${currentSha}' is not present in the clone`);
  }

  const output = execFileSync(
    "git",
    ["diff", "--name-only", "--diff-filter=ACDMRTUXB", previousSha, currentSha, "--"],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  return output.split(/\r?\n/).filter(Boolean);
}

function printPaths(label, filePaths) {
  if (filePaths.length === 0) return;
  console.log(`${label} (${filePaths.length}):`);
  for (const filePath of filePaths.slice(0, 20)) console.log(`- ${filePath}`);
  if (filePaths.length > 20) console.log(`- ... and ${filePaths.length - 20} more`);
}

export function evaluateVercelBuild({
  previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA,
  currentSha = process.env.VERCEL_GIT_COMMIT_SHA || "HEAD",
  repositoryRoot = REPOSITORY_ROOT,
} = {}) {
  const changes = collectDeploymentChanges({ previousSha, currentSha, repositoryRoot });
  return {
    ...classifyDeploymentChanges(changes),
    previousSha,
    currentSha,
  };
}

function main() {
  let result;
  try {
    result = evaluateVercelBuild();
  } catch (error) {
    console.log(
      `Vercel build required: unable to classify the deployment safely (${error instanceof Error ? error.message : String(error)}).`,
    );
    process.exitCode = 1;
    return;
  }

  if (result.deploymentRequired.length > 0) {
    console.log("Vercel build required: the push changes deployable product inputs.");
    printPaths("Deployable changes", result.deploymentRequired);
    process.exitCode = 1;
    return;
  }

  console.log("Vercel build skipped: every changed file is deployment-neutral.");
  printPaths("Deployment-neutral changes", result.deploymentNeutral);
  process.exitCode = 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
