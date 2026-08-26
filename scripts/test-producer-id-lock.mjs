import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";

const script = path.resolve("scripts/with-producer-id-lock.mjs");

function fixture() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-producer-lock-"));
  childProcess.execFileSync("git", ["init", "-q"], { cwd: directory });
  fs.mkdirSync(path.join(directory, "data/csv/es"), { recursive: true });
  fs.writeFileSync(path.join(directory, "data/csv/es/country.json"), "{}\n");
  return directory;
}

function command(directory, childSource) {
  return childProcess.spawn(process.execPath, [
    script,
    "--countries",
    "es",
    "--",
    process.execPath,
    "-e",
    childSource,
  ], {
    cwd: directory,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

async function result(child) {
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  const code = await new Promise((resolve) => child.once("exit", resolve));
  return { code, stdout, stderr };
}

async function waitForLock(directory) {
  const lock = path.join(directory, ".git/chisan-locks/producer-ids/es.lock/owner.json");
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (fs.existsSync(lock)) return lock;
    await delay(10);
  }
  throw new Error("lock did not appear");
}

test("serializes producer_id materialization per country", async (context) => {
  const directory = fixture();
  context.after(() => fs.rmSync(directory, { recursive: true, force: true }));

  const holder = command(directory, "setTimeout(() => {}, 800)");
  await waitForLock(directory);
  const contender = command(directory, "");
  const blocked = await result(contender);
  assert.notEqual(blocked.code, 0);
  assert.match(blocked.stderr, /producer_id allocation for 'es' is already locked/);
  assert.equal((await result(holder)).code, 0);

  const successor = await result(command(directory, ""));
  assert.equal(successor.code, 0, successor.stderr);
});

test("recovers a lock left by a dead local process", async (context) => {
  const directory = fixture();
  context.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const lock = path.join(directory, ".git/chisan-locks/producer-ids/es.lock");
  fs.mkdirSync(lock, { recursive: true });
  fs.writeFileSync(path.join(lock, "owner.json"), `${JSON.stringify({
    token: "abandoned",
    pid: 9_999_999,
    hostname: os.hostname(),
    startedAt: new Date().toISOString(),
  })}\n`);

  const recovered = await result(command(directory, ""));
  assert.equal(recovered.code, 0, recovered.stderr);
  assert.equal(fs.existsSync(lock), false);
});
