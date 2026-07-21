#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.join(__dirname, "..");
const CSV_ROOT = path.join(ROOT, "data", "csv");
const PUBLIC_ROOT = path.join(ROOT, "public");
const PRODUCERS_ROOT = path.join(PUBLIC_ROOT, "productores");
const SUPPORTED_EXTENSIONS = new Set([".avif", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"]);
const EXPECTED_WIDTH = 1600;
const EXPECTED_HEIGHT = 1200;

function walk(dir, predicate) {
  const entries = [];
  if (!fs.existsSync(dir)) return entries;

  for (const name of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, name);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      entries.push(...walk(fullPath, predicate));
      continue;
    }
    if (!predicate || predicate(fullPath)) {
      entries.push(fullPath);
    }
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
      return {
        width: 1 + buffer.readUIntLE(data + 4, 3),
        height: 1 + buffer.readUIntLE(data + 7, 3),
      };
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
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function gifSize(buffer) {
  const signature = buffer.toString("ascii", 0, 6);
  if (buffer.length < 10 || (signature !== "GIF87a" && signature !== "GIF89a")) return null;
  return {
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8),
  };
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
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) return null;

    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }

    offset += 2 + length;
  }

  return null;
}

function imageSize(assetPath) {
  const ext = path.extname(assetPath).toLowerCase();
  const buffer = fs.readFileSync(assetPath);
  if (ext === ".webp") return webpSize(buffer);
  if (ext === ".png") return pngSize(buffer);
  if (ext === ".gif") return gifSize(buffer);
  if (ext === ".jpg" || ext === ".jpeg") return jpegSize(buffer);
  return null;
}

function printSample(title, items) {
  if (!items.length) return;
  console.log(title);
  for (const item of items.slice(0, 20)) {
    console.log(`- ${item}`);
  }
  if (items.length > 20) {
    console.log(`- ... ${items.length - 20} more`);
  }
}

const errors = [];
const warnings = [];
const references = new Map();
const csvPaths = walk(CSV_ROOT, (file) => file.endsWith(".csv"));

for (const csvPath of csvPaths) {
  // Assets mirror the CSV layout: /productores/<comunidad>/<provincia>/.
  const csvRelative = path.relative(CSV_ROOT, csvPath);
  const comunidad = csvRelative.split(path.sep)[0];
  const provincia = path.basename(csvRelative, ".csv");
  const expectedDir = `/productores/${comunidad}/${provincia}/`;

  for (const row of readCsvRows(csvPath)) {
    const imagePath = String(row.imagen || "").trim();
    if (!imagePath) continue;

    const rowId = `${path.relative(ROOT, csvPath)}:${row.slug || row.nombre || "unknown"}`;
    references.set(imagePath, rowId);

    if (!isSafePublicPath(imagePath)) {
      errors.push(`${rowId} -> ${imagePath}: must be a safe root-relative public path`);
      continue;
    }

    const ext = path.extname(imagePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      errors.push(`${rowId} -> ${imagePath}: unsupported image extension`);
      continue;
    }

    const assetPath = path.join(PUBLIC_ROOT, imagePath.replace(/^\/+/, ""));
    if (!fs.existsSync(assetPath)) {
      errors.push(`${rowId} -> ${imagePath}: asset does not exist`);
      continue;
    }

    if (!imagePath.startsWith(expectedDir)) {
      warnings.push(`${rowId} -> ${imagePath}: should live under ${expectedDir} (see docs/IMAGES.md)`);
    }

    const expectedStem = String(row.slug || "").trim();
    const actualStem = path.basename(assetPath, ext);
    if (expectedStem && expectedStem !== actualStem) {
      warnings.push(`${rowId} -> ${imagePath}: filename does not match slug`);
    }

    const size = ext === ".webp" ? imageSize(assetPath) : null;
    if (size && (size.width !== EXPECTED_WIDTH || size.height !== EXPECTED_HEIGHT)) {
      warnings.push(
        `${rowId} -> ${imagePath}: ${size.width}x${size.height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`,
      );
    }
  }
}

const producerAssets = walk(PRODUCERS_ROOT, (file) => SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase()));
for (const assetPath of producerAssets) {
  const publicPath = `/${path.relative(PUBLIC_ROOT, assetPath).split(path.sep).join("/")}`;
  if (publicPath === "/productores/generica.webp") continue;
  if (!references.has(publicPath)) {
    warnings.push(`${publicPath}: producer asset is not referenced by any CSV row`);
  }
}

printSample("Image audit errors", errors);
printSample("Image audit warnings", warnings);

console.log("Image asset audit summary");
console.log(`- csv files: ${csvPaths.length}`);
console.log(`- referenced images: ${references.size}`);
console.log(`- producer assets: ${producerAssets.length}`);
console.log(`- errors: ${errors.length}`);
console.log(`- warnings: ${warnings.length}`);

if (errors.length > 0) {
  process.exit(1);
}

console.log("- status: OK");
