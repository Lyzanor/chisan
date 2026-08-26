#!/usr/bin/env node

import childProcess from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const USAGE =
  "Usage: pnpm producer:ids:locked --countries <country[,country...]> -- <materialization command>";
const REMOTE_STALE_AFTER_MS = 4 * 60 * 60 * 1000;

function parseArguments(argv) {
  const separator = argv.indexOf("--");
  if (separator < 0 || separator === argv.length - 1) throw new Error(USAGE);

  const options = argv.slice(0, separator);
  const command = argv.slice(separator + 1);
  const countries = [];
  for (let index = 0; index < options.length; index += 1) {
    if (options[index] !== "--countries" || !options[index + 1]) throw new Error(USAGE);
    countries.push(...options[index + 1].split(","));
    index += 1;
  }
  const normalized = [...new Set(countries.map((country) => country.trim().toLowerCase()).filter(Boolean))].sort();
  if (!normalized.length || normalized.some((country) => !/^[a-z]{2}$/.test(country))) {
    throw new Error(USAGE);
  }
  return { countries: normalized, command };
}

function resolveGitCommonDirectory() {
  return childProcess
    .execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
      cwd: process.cwd(),
      encoding: "utf8",
    })
    .trim();
}

function readOwner(lockDirectory) {
  try {
    return JSON.parse(fs.readFileSync(path.join(lockDirectory, "owner.json"), "utf8"));
  } catch {
    return null;
  }
}

function processExists(pid) {
  if (!Number.isSafeInteger(pid) || pid < 1) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code === "EPERM";
  }
}

function lockIsStale(lockDirectory, owner) {
  if (owner?.hostname === os.hostname()) return !processExists(owner.pid);
  const timestamp = Date.parse(owner?.startedAt ?? "");
  if (Number.isFinite(timestamp)) return Date.now() - timestamp > REMOTE_STALE_AFTER_MS;
  try {
    return Date.now() - fs.statSync(lockDirectory).mtimeMs > REMOTE_STALE_AFTER_MS;
  } catch {
    return false;
  }
}

function ownerDescription(owner) {
  if (!owner) return "owner metadata is not available";
  return [
    `pid=${owner.pid ?? "unknown"}`,
    `host=${owner.hostname ?? "unknown"}`,
    `started=${owner.startedAt ?? "unknown"}`,
    `cwd=${owner.cwd ?? "unknown"}`,
    `command=${owner.command ?? "unknown"}`,
  ].join(" ");
}

function acquireCountryLock(lockRoot, country, commandText) {
  const lockDirectory = path.join(lockRoot, `${country}.lock`);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      fs.mkdirSync(lockDirectory);
      const owner = {
        token: crypto.randomUUID(),
        pid: process.pid,
        hostname: os.hostname(),
        startedAt: new Date().toISOString(),
        cwd: process.cwd(),
        command: commandText,
      };
      fs.writeFileSync(path.join(lockDirectory, "owner.json"), `${JSON.stringify(owner, null, 2)}\n`, "utf8");
      return { country, lockDirectory, owner };
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      const owner = readOwner(lockDirectory);
      if (attempt === 0 && lockIsStale(lockDirectory, owner)) {
        fs.rmSync(lockDirectory, { recursive: true, force: true });
        continue;
      }
      throw new Error(`producer_id allocation for '${country}' is already locked (${ownerDescription(owner)})`);
    }
  }
  throw new Error(`could not acquire producer_id lock for '${country}'`);
}

function releaseLock(lock) {
  const current = readOwner(lock.lockDirectory);
  if (current?.token === lock.owner.token) {
    fs.rmSync(lock.lockDirectory, { recursive: true, force: true });
  }
}

async function run() {
  const { countries, command } = parseArguments(process.argv.slice(2));
  for (const country of countries) {
    if (!fs.existsSync(path.join(process.cwd(), "data", "csv", country, "country.json"))) {
      throw new Error(`unknown catalog country '${country}'`);
    }
  }

  const lockRoot = path.join(resolveGitCommonDirectory(), "chisan-locks", "producer-ids");
  fs.mkdirSync(lockRoot, { recursive: true });
  const acquired = [];
  try {
    const commandText = command.join(" ");
    for (const country of countries) acquired.push(acquireCountryLock(lockRoot, country, commandText));

    const child = childProcess.spawn(command[0], command.slice(1), {
      cwd: process.cwd(),
      env: {
        ...process.env,
        CHISAN_PRODUCER_ID_LOCK_COUNTRIES: countries.join(","),
      },
      stdio: "inherit",
    });
    const forward = (signal) => child.kill(signal);
    process.once("SIGINT", forward);
    process.once("SIGTERM", forward);
    const result = await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("exit", (code, signal) => resolve({ code, signal }));
    });
    process.removeListener("SIGINT", forward);
    process.removeListener("SIGTERM", forward);
    if (result.signal) {
      process.kill(process.pid, result.signal);
      return;
    }
    process.exitCode = result.code ?? 1;
  } finally {
    for (const lock of acquired.reverse()) releaseLock(lock);
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
