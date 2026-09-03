import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { parse } from "csv-parse/sync";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCER_ID_BOOTSTRAP = "0f13bddbad622d455a3b8210eb1d02afd8659ae0";
const BOOTSTRAP_COUNTS = Object.freeze({
  ar: 4,
  be: 1,
  de: 23,
  es: 722,
  ie: 1,
  in: 2,
  it: 13,
  jp: 109,
  us: 10,
  za: 13,
});

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
    ...options,
  });
}

function rawCsvChanges(output) {
  const changes = [];
  for (const line of output.split("\n")) {
    const match =
      /^:\d+ \d+ ([0-9a-f]{40}) ([0-9a-f]{40}) [A-Z]\t(.+\.csv)$/.exec(line);
    if (!match) continue;
    changes.push({ oldOid: match[1], newOid: match[2], file: match[3] });
  }
  return changes;
}

function readBlobs(oids) {
  const uniqueOids = [...new Set(oids)].filter((oid) => !/^0+$/.test(oid));
  if (uniqueOids.length === 0) return new Map();

  const result = spawnSync("git", ["cat-file", "--batch"], {
    cwd: ROOT,
    input: `${uniqueOids.join("\n")}\n`,
    encoding: null,
    maxBuffer: 1024 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr?.toString() || "git cat-file failed");

  const blobs = new Map();
  let offset = 0;
  for (const oid of uniqueOids) {
    const newline = result.stdout.indexOf(10, offset);
    const header = result.stdout.subarray(offset, newline).toString();
    const match = /^[0-9a-f]{40} blob (\d+)$/.exec(header);
    assert.ok(match, `unexpected git cat-file header: ${header}`);
    const size = Number(match[1]);
    blobs.set(oid, result.stdout.subarray(newline + 1, newline + 1 + size).toString("utf8"));
    offset = newline + size + 2;
  }
  return blobs;
}

function csvRows(raw) {
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
  });
}

function catalogLocation(file) {
  const segments = file.replaceAll("\\", "/").split("/");
  return {
    country: segments[2],
    area: segments.at(-1).slice(0, -".csv".length),
  };
}

function deriveBootstrapAliases() {
  const changes = rawCsvChanges(
    git([
      "diff-tree",
      "-r",
      "--no-commit-id",
      "--raw",
      "--abbrev=40",
      "--no-renames",
      PRODUCER_ID_BOOTSTRAP,
      "--",
      "data/csv",
    ]),
  );
  const blobs = readBlobs(changes.flatMap(({ oldOid, newOid }) => [oldOid, newOid]));
  const aliases = new Map();

  for (const { oldOid, newOid, file } of changes) {
    const oldRows = csvRows(blobs.get(oldOid));
    const newRows = csvRows(blobs.get(newOid));
    if (!newRows.length || !("producer_id" in newRows[0])) continue;

    // `slug` and its derived image path were intentionally migrated together;
    // every other pre-existing field must identify one and only one old row.
    const stableFields = Object.keys(oldRows[0] ?? {}).filter(
      (field) =>
        !["slug", "imagen", "producer_id"].includes(field) && field in (newRows[0] ?? {}),
    );
    const signature = (row) => JSON.stringify(stableFields.map((field) => row[field] ?? ""));
    const oldRowsBySignature = new Map();
    for (const row of oldRows) {
      const matches = oldRowsBySignature.get(signature(row)) ?? [];
      matches.push(row);
      oldRowsBySignature.set(signature(row), matches);
    }

    const { country, area } = catalogLocation(file);
    for (const row of newRows) {
      const matches = oldRowsBySignature.get(signature(row)) ?? [];
      const unchangedMatches = matches.filter((candidate) => candidate.slug === row.slug);
      if (unchangedMatches.length === 1) continue;
      assert.equal(
        matches.length,
        1,
        `ambiguous bootstrap identity for ${file} producer_id=${row.producer_id}`,
      );

      const formerRoute = `${country}/${area}/${matches[0].slug}`;
      assert.equal(aliases.has(formerRoute), false, `duplicate historical route ${formerRoute}`);
      aliases.set(formerRoute, Number(row.producer_id));
    }
  }

  return aliases;
}

function readCurrentRoutes() {
  const routes = new Map();
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(file);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".csv")) continue;

      const relative = path.relative(ROOT, file);
      const { country, area } = catalogLocation(relative);
      for (const row of csvRows(fs.readFileSync(file, "utf8"))) {
        const producerId = Number(row.producer_id);
        if (!Number.isSafeInteger(producerId) || producerId <= 0 || !row.slug) continue;
        routes.set(`${country}/${producerId}`, `${area}/${row.slug}`);
      }
    }
  };
  visit(path.join(ROOT, "data/csv"));
  return routes;
}

function derivePostBootstrapAliases(currentRoutes) {
  const committedChanges = rawCsvChanges(
    git([
      "log",
      "--format=",
      "--raw",
      "--abbrev=40",
      "--no-renames",
      `${PRODUCER_ID_BOOTSTRAP}..HEAD`,
      "--",
      "data/csv",
    ]),
  );
  const workingChanges = rawCsvChanges(
    git(["diff", "HEAD", "--raw", "--abbrev=40", "--no-renames", "--", "data/csv"]),
  );
  const observations = [...committedChanges, ...workingChanges].flatMap(
    ({ oldOid, newOid, file }) => [
      { oid: oldOid, file },
      { oid: newOid, file },
    ],
  ).filter(({ oid }) => !/^0+$/.test(oid));
  const blobs = readBlobs(observations.map(({ oid }) => oid));
  const historicalRoutes = new Map();

  for (const { oid, file } of observations) {
    const rows = csvRows(blobs.get(oid));
    if (!rows.length || !("producer_id" in rows[0])) continue;
    const { country, area } = catalogLocation(file);
    for (const row of rows) {
      const producerId = Number(row.producer_id);
      if (!Number.isSafeInteger(producerId) || producerId <= 0 || !row.slug) continue;
      const identity = `${country}/${producerId}`;
      const routes = historicalRoutes.get(identity) ?? new Set();
      routes.add(`${area}/${row.slug}`);
      historicalRoutes.set(identity, routes);
    }
  }

  const aliases = new Map();
  for (const [identity, routes] of historicalRoutes) {
    const canonicalRoute = currentRoutes.get(identity);
    if (!canonicalRoute) continue;
    const [country, producerId] = identity.split("/");
    for (const formerRoute of routes) {
      if (formerRoute === canonicalRoute) continue;
      const key = `${country}/${formerRoute}`;
      const existing = aliases.get(key);
      assert.ok(
        existing === undefined || existing === Number(producerId),
        `historical route ${key} was assigned to multiple producer IDs`,
      );
      aliases.set(key, Number(producerId));
    }
  }
  return aliases;
}

function deriveMergeAliases(currentRoutes) {
  const producerIdsByRoute = new Map();
  for (const [identity, currentRoute] of currentRoutes) {
    const [country, producerId] = identity.split("/");
    const key = `${country}/${currentRoute}`;
    assert.equal(
      producerIdsByRoute.has(key),
      false,
      `duplicate current producer route ${key}`,
    );
    producerIdsByRoute.set(key, Number(producerId));
  }

  const aliases = new Map();
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(file);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".jsonl")) continue;

      const segments = path.relative(ROOT, file).replaceAll("\\", "/").split("/");
      const country = segments[2];
      const area = entry.name.slice(0, -".jsonl".length);
      for (const line of fs.readFileSync(file, "utf8").split("\n")) {
        if (!line.trim()) continue;
        const record = JSON.parse(line);
        if (record.action !== "merge") continue;

        const producerId = producerIdsByRoute.get(
          `${country}/${area}/${record.targetSlug}`,
        );
        assert.ok(
          producerId,
          `merge target ${country}/${area}/${record.targetSlug} has no current producer_id`,
        );
        const formerRoute = `${country}/${area}/${record.slug}`;
        const existing = aliases.get(formerRoute);
        assert.ok(
          existing === undefined || existing === producerId,
          `merge route ${formerRoute} was assigned to multiple producer IDs`,
        );
        aliases.set(formerRoute, producerId);
      }
    }
  };
  visit(path.join(ROOT, "data/evidence"));
  return aliases;
}

function readStoredAliases() {
  const aliases = new Map();
  for (const country of fs.readdirSync(path.join(ROOT, "data/csv")).sort()) {
    const manifestPath = path.join(ROOT, "data/csv", country, "country.json");
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    for (const [formerRoute, producerId] of Object.entries(
      manifest.producerRouteAliases ?? {},
    )) {
      aliases.set(`${country}/${formerRoute}`, producerId);
    }
  }
  return aliases;
}

test("producerRouteAliases cover every demonstrable historical route", () => {
  assert.doesNotThrow(
    () => git(["cat-file", "-e", `${PRODUCER_ID_BOOTSTRAP}^`]),
    "full Git history is required to verify historical producer routes",
  );

  const bootstrapAliases = deriveBootstrapAliases();
  assert.equal(bootstrapAliases.size, 898);
  const bootstrapCounts = {};
  for (const key of bootstrapAliases.keys()) {
    const country = key.split("/")[0];
    bootstrapCounts[country] = (bootstrapCounts[country] ?? 0) + 1;
  }
  assert.deepEqual(bootstrapCounts, BOOTSTRAP_COUNTS);

  const currentRoutes = readCurrentRoutes();
  const requiredAliases = new Map([
    ...bootstrapAliases,
    ...derivePostBootstrapAliases(currentRoutes),
  ]);
  const mergeAliases = deriveMergeAliases(currentRoutes);
  const storedAliases = readStoredAliases();

  for (const [formerRoute, producerId] of requiredAliases) {
    assert.equal(
      storedAliases.get(formerRoute),
      producerId,
      `missing or incorrect historical route alias ${formerRoute}`,
    );
  }

  for (const [formerRoute, producerId] of storedAliases) {
    assert.ok(
      requiredAliases.get(formerRoute) === producerId ||
        mergeAliases.get(formerRoute) === producerId,
      `${formerRoute} is not demonstrated by producer history or a merge tombstone`,
    );
    const [country, ...routeSegments] = formerRoute.split("/");
    const canonicalRoute = currentRoutes.get(`${country}/${producerId}`);
    assert.ok(canonicalRoute, `${formerRoute} has no current producer_id destination`);
    assert.notEqual(routeSegments.join("/"), canonicalRoute, `${formerRoute} is canonical`);
  }
});
