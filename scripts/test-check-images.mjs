#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { auditImages } from "./check-images.mjs";

function webp(width, height, marker = 0) {
  const buffer = Buffer.alloc(30, marker);
  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(22, 4);
  buffer.write("WEBP", 8, "ascii");
  buffer.write("VP8X", 12, "ascii");
  buffer.writeUInt32LE(10, 16);
  buffer.writeUIntLE(width - 1, 24, 3);
  buffer.writeUIntLE(height - 1, 27, 3);
  return buffer;
}

const root = fs.mkdtempSync(path.join(os.tmpdir(), "km0-images-"));
try {
  const csvRoot = path.join(root, "data", "csv");
  const publicRoot = path.join(root, "public");
  const areaDir = path.join(publicRoot, "productores", "xx", "region", "area");
  fs.mkdirSync(path.join(csvRoot, "xx", "region"), { recursive: true });
  fs.mkdirSync(areaDir, { recursive: true });

  fs.writeFileSync(
    path.join(csvRoot, "xx", "region", "area.csv"),
    [
      "slug,imagen,future optional field",
      "good-a,/productores/xx/region/area/good-a.webp,ignored safely",
      "good-b,/productores/xx/region/area/good-b.webp,ignored safely",
      "wrong-type,/productores/xx/region/area/wrong-type.png,ignored safely",
      "missing,/productores/xx/region/area/missing.webp,ignored safely",
      "unsafe,/../../outside.webp,ignored safely",
      "corrupt,/legacy/corrupt.webp,ignored safely",
      "",
    ].join("\n"),
  );

  const shared = webp(1600, 1200);
  fs.writeFileSync(path.join(areaDir, "good-a.webp"), shared);
  fs.writeFileSync(path.join(areaDir, "good-b.webp"), shared);
  fs.writeFileSync(path.join(areaDir, "wrong-type.png"), webp(800, 600, 1));
  fs.mkdirSync(path.join(publicRoot, "legacy"), { recursive: true });
  fs.writeFileSync(path.join(publicRoot, "legacy", "corrupt.webp"), "not an image");

  const result = auditImages({
    csvRoot,
    publicRoot,
    producersRoot: path.join(publicRoot, "productores"),
  });

  assert.equal(result.csvFiles, 1);
  assert.equal(result.catalogRows, 6);
  assert.equal(result.imageReferences, 6);
  assert.equal(result.referencedAssets, 6);
  assert.equal(result.producerAssets, 3);
  assert.equal(result.legacyAssets, 1);
  assert.equal(result.noncanonicalLegacyAssets, 1);
  assert.equal(result.duplicateHashes.length, 1);
  assert.deepEqual(result.duplicateHashes[0].paths, [
    "/productores/xx/region/area/good-a.webp",
    "/productores/xx/region/area/good-b.webp",
  ]);
  assert.ok(result.errors.some((error) => error.includes("asset does not exist")));
  assert.ok(result.errors.some((error) => error.includes("safe root-relative")));
  assert.ok(result.errors.some((error) => error.includes("content is not a recognized supported image")));
  assert.ok(result.warnings.some((warning) => warning.includes("extension says png, content is webp")));
  assert.equal(result.errors.length, 3);

  console.log("check:images tests OK");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
