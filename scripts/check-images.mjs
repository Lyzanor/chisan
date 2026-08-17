#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse } from "csv-parse/sync";

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

function webpSize(buffer) {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunk = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (chunk === "VP8X" && data + 10 <= buffer.length) {
      return { width: 1 + buffer.readUIntLE(data + 4, 3), height: 1 + buffer.readUIntLE(data + 7, 3) };
    }
    if (chunk === "VP8 " && data + 10 <= buffer.length) {
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      };
    }
    if (chunk === "VP8L" && data + 5 <= buffer.length) {
      const b0 = buffer[data + 1];
      const b1 = buffer[data + 2];
      const b2 = buffer[data + 3];
      const b3 = buffer[data + 4];
      return {
        width: 1 + (((b1 & 0x3f) << 8) | b0),
        height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      };
    }
    offset = data + size + (size % 2);
  }
  return null;
}

function pngSize(buffer) {
  if (
    buffer.length < 24 ||
    !buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return null;
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function gifSize(buffer) {
  const signature = buffer.toString("ascii", 0, 6);
  if (buffer.length < 10 || (signature !== "GIF87a" && signature !== "GIF89a")) return null;
  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
}

function jpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xd9 || marker === 0xda) return null;
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > buffer.length) return null;
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    }
    offset += 2 + length;
  }
  return null;
}

function isAvif(buffer) {
  if (buffer.length < 16 || buffer.toString("ascii", 4, 8) !== "ftyp") return false;
  return /avif|avis/.test(buffer.toString("ascii", 8, Math.min(buffer.length, 64)));
}

function isSvg(buffer) {
  return /<svg(?:\s|>)/i.test(buffer.toString("utf8", 0, Math.min(buffer.length, 4096)));
}

function detectImage(buffer) {
  const detectors = [
    ["webp", webpSize],
    ["png", pngSize],
    ["gif", gifSize],
    ["jpeg", jpegSize],
  ];
  for (const [type, detector] of detectors) {
    const size = detector(buffer);
    if (size) return { type, ...size };
  }
  if (isAvif(buffer)) return { type: "avif", width: null, height: null };
  if (isSvg(buffer)) return { type: "svg", width: null, height: null };
  return null;
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
  const csvPaths = walk(csvRoot, (file) => file.endsWith(".csv"));
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

    const metadata = inspectAssetContent(buffer, extension, label, errors, warnings);
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
