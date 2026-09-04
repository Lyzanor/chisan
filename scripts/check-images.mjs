#!/usr/bin/env node

import crypto from "node:crypto";
import { detectImage } from "../lib/catalog/image-metadata.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse } from "csv-parse/sync";

import { classifyCatalogCsvPath } from "./lib/catalog-translations.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_CSV_ROOT = path.join(ROOT, "data", "csv");
const DEFAULT_PUBLIC_ROOT = path.join(ROOT, "public");
const SUPPORTED_EXTENSIONS = new Set([".avif", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"]);
const EXPECTED_WIDTH = 1600;
const EXPECTED_HEIGHT = 1200;
const LARGE_ASSET_BYTES = 2 * 1024 * 1024;

function walk(dir, predicate) {
  const entries = [];
  if (!fs.existsSync(dir)) return entries;

  for (const name of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, name);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) entries.push(...walk(fullPath, predicate));
    else if (!predicate || predicate(fullPath)) entries.push(fullPath);
  }
  return entries.sort();
}

function readCsvRows(csvPath) {
  return parse(fs.readFileSync(csvPath, "utf8"), {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });
}

function isSafePublicPath(imagePath) {
  if (!imagePath.startsWith("/")) return false;
  const normalized = path.normalize(imagePath.replace(/^\/+/, ""));
  return !normalized.startsWith("..") && !path.isAbsolute(normalized);
}

function extensionType(extension) {
  if (extension === ".jpg" || extension === ".jpeg") return "jpeg";
  return extension.slice(1);
}

function publicPathFor(publicRoot, assetPath) {
  return `/${path.relative(publicRoot, assetPath).split(path.sep).join("/")}`;
}

function inspectAssetContent(buffer, extension, label, errors, warnings) {
  const metadata = detectImage(buffer);
  if (!metadata) {
    errors.push(`${label}: content is not a recognized supported image`);
    return null;
  }

  const expectedType = extensionType(extension);
  if (metadata.type !== expectedType) {
    warnings.push(`${label}: extension says ${expectedType}, content is ${metadata.type}`);
  }
  if (
    extension === ".webp" &&
    metadata.width !== null &&
    (metadata.width !== EXPECTED_WIDTH || metadata.height !== EXPECTED_HEIGHT)
  ) {
    warnings.push(`${label}: ${metadata.width}x${metadata.height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`);
  }
  return metadata;
}

export function auditImages({
  csvRoot = DEFAULT_CSV_ROOT,
  publicRoot = DEFAULT_PUBLIC_ROOT,
  producersRoot = path.join(publicRoot, "productores"),
} = {}) {
  const errors = [];
  const warnings = [];
  const references = new Map();
  const existingReferences = new Map();
  const csvPaths = walk(csvRoot, (file) => file.endsWith(".csv")).filter(
    (file) => classifyCatalogCsvPath(csvRoot, file).kind === "area",
  );
  let catalogRows = 0;
  let imageReferences = 0;

  for (const csvPath of csvPaths) {
    const csvRelative = path.relative(csvRoot, csvPath);
    const [country, region] = csvRelative.split(path.sep);
    const area = path.basename(csvRelative, ".csv");
    const expectedDir = `/productores/${country}/${region}/${area}/`;

    const rows = readCsvRows(csvPath);
    catalogRows += rows.length;
    for (const row of rows) {
      const imagePath = String(row.imagen || "").trim();
      if (!imagePath) continue;
      imageReferences += 1;
      const rowId = `${path.relative(ROOT, csvPath)}:${row.slug || row.nombre || "unknown"}`;
      const owners = references.get(imagePath) ?? [];
      owners.push(rowId);
      references.set(imagePath, owners);

      if (!isSafePublicPath(imagePath)) {
        errors.push(`${rowId} -> ${imagePath}: must be a safe root-relative public path`);
        continue;
      }
      const extension = path.extname(imagePath).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.has(extension)) {
        errors.push(`${rowId} -> ${imagePath}: unsupported image extension`);
        continue;
      }
      const assetPath = path.join(publicRoot, imagePath.replace(/^\/+/, ""));
      if (!fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
        errors.push(`${rowId} -> ${imagePath}: asset does not exist`);
        continue;
      }
      existingReferences.set(imagePath, assetPath);
      if (!imagePath.startsWith(expectedDir)) {
        warnings.push(`${rowId} -> ${imagePath}: should live under ${expectedDir} (see docs/IMAGES.md)`);
      }
      const expectedStem = String(row.slug || "").trim();
      const actualStem = path.basename(assetPath, extension);
      if (expectedStem && expectedStem !== actualStem) {
        warnings.push(`${rowId} -> ${imagePath}: filename does not match slug`);
      }
    }
  }

  const contentRoot = path.join(path.dirname(csvRoot), "content");
  for (const file of walk(contentRoot, (file) => file.endsWith(".json"))) {
    try {
      const content = JSON.parse(fs.readFileSync(file, "utf8"));
      for (const item of content.gallery ?? []) {
        if (typeof item.src !== "string") continue;
        const owners = references.get(item.src) ?? [];
        owners.push(`${path.relative(ROOT, file)}:${item.id}`);
        references.set(item.src, owners);
      }
    } catch { errors.push(`${file}: invalid related-content JSON`); }
  }
  for (const [imagePath, owners] of references) {
    if (owners.length > 1) {
      warnings.push(`${imagePath}: referenced by multiple rows (${owners.join(", ")})`);
    }
  }

  const producerFiles = walk(producersRoot, (file) => path.basename(file) !== ".gitkeep");
  const producerPublicPaths = new Set(producerFiles.map((assetPath) => publicPathFor(publicRoot, assetPath)));
  const hashes = new Map();
  let producerAssets = 0;
  let totalBytes = 0;
  let legacyAssets = 0;
  let noncanonicalLegacyAssets = 0;
  let largeAssets = 0;

  for (const assetPath of producerFiles) {
    const publicPath = publicPathFor(publicRoot, assetPath);
    const extension = path.extname(assetPath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(extension)) {
      warnings.push(`${publicPath}: unsupported file stored under public/productores`);
      continue;
    }

    producerAssets += 1;
    const buffer = fs.readFileSync(assetPath);
    totalBytes += buffer.length;
    const owners = references.get(publicPath) ?? [];
    const label = owners.length ? `${owners.join(", ")} -> ${publicPath}` : publicPath;

    const metadata = /\/content\/[1-9]\d*\//.test(publicPath)
      ? detectImage(buffer)
      : inspectAssetContent(buffer, extension, label, errors, warnings);
    if (!metadata && /\/content\/[1-9]\d*\//.test(publicPath)) errors.push(`${label}: unrecognized image content`);
    if (metadata && extension !== ".webp") {
      legacyAssets += 1;
      if (metadata.width !== EXPECTED_WIDTH || metadata.height !== EXPECTED_HEIGHT) {
        noncanonicalLegacyAssets += 1;
      }
    }

    if (buffer.length > LARGE_ASSET_BYTES) {
      largeAssets += 1;
      warnings.push(`${label}: ${(buffer.length / 1024 / 1024).toFixed(1)} MiB, normalize before adding more weight`);
    }
    if (publicPath !== "/productores/generica.webp" && owners.length === 0) {
      warnings.push(`${publicPath}: producer asset is not referenced by any CSV row`);
    }
    if (publicPath !== "/productores/generica.webp") {
      const digest = crypto.createHash("sha256").update(buffer).digest("hex");
      const paths = hashes.get(digest) ?? [];
      paths.push(publicPath);
      hashes.set(digest, paths);
    }
  }

  // Canonical assets are covered by the producer inventory above. A legacy
  // root-relative reference elsewhere under public/ still needs content
  // validation even though it is not included in producer inventory metrics.
  for (const [publicPath, assetPath] of existingReferences) {
    if (producerPublicPaths.has(publicPath)) continue;
    const extension = path.extname(assetPath).toLowerCase();
    const owners = references.get(publicPath) ?? [];
    const label = `${owners.join(", ")} -> ${publicPath}`;
    inspectAssetContent(fs.readFileSync(assetPath), extension, label, errors, warnings);
  }

  const duplicateHashes = [...hashes.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([digest, paths]) => ({ digest, paths: paths.sort() }))
    .sort((left, right) => left.paths[0].localeCompare(right.paths[0]));

  return {
    csvFiles: csvPaths.length,
    catalogRows,
    imageReferences,
    referencedAssets: references.size,
    producerAssets,
    totalBytes,
    legacyAssets,
    noncanonicalLegacyAssets,
    largeAssets,
    duplicateHashes,
    errors,
    warnings,
  };
}

function printSample(title, items) {
  if (!items.length) return;
  console.log(title);
  for (const item of items.slice(0, 20)) console.log(`- ${item}`);
  if (items.length > 20) console.log(`- ... ${items.length - 20} more`);
}

function printReport(result, { showDuplicates = false } = {}) {
  printSample("Image audit errors", result.errors);
  printSample("Image audit warnings", result.warnings);

  if (showDuplicates && result.duplicateHashes.length) {
    console.log("Duplicate image hashes requiring visual review");
    for (const cluster of result.duplicateHashes) {
      console.log(`- ${cluster.digest.slice(0, 12)} (${cluster.paths.length})`);
      for (const publicPath of cluster.paths) console.log(`  - ${publicPath}`);
    }
  }

  console.log("Image asset audit summary");
  console.log(`- csv files: ${result.csvFiles}`);
  console.log(`- catalog rows: ${result.catalogRows}`);
  console.log(
    `- image coverage: ${result.imageReferences}/${result.catalogRows} (${(
      (100 * result.imageReferences) /
      Math.max(result.catalogRows, 1)
    ).toFixed(1)}%)`,
  );
  console.log(`- unique referenced assets: ${result.referencedAssets}`);
  console.log(`- producer assets: ${result.producerAssets}`);
  console.log(`- producer asset size: ${(result.totalBytes / 1024 / 1024).toFixed(1)} MiB`);
  console.log(`- legacy non-WebP assets: ${result.legacyAssets}`);
  console.log(`- noncanonical legacy dimensions: ${result.noncanonicalLegacyAssets}`);
  console.log(`- assets over 2 MiB: ${result.largeAssets}`);
  console.log(
    `- duplicate hash clusters: ${result.duplicateHashes.length}${showDuplicates ? "" : " (inspect with --duplicates)"}`,
  );
  console.log(`- errors: ${result.errors.length}`);
  console.log(`- warnings: ${result.warnings.length}`);
  console.log(`- status: ${result.errors.length ? "FAILED" : "OK"}`);
}

function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node scripts/check-images.mjs [--duplicates]");
    return;
  }
  const unknown = args.filter((arg) => arg !== "--duplicates");
  if (unknown.length) {
    console.error(`Unknown argument(s): ${unknown.join(", ")}`);
    process.exitCode = 1;
    return;
  }
  const result = auditImages();
  printReport(result, { showDuplicates: args.includes("--duplicates") });
  process.exitCode = result.errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}
