/** On-demand handoff of a staff-reviewed private snapshot into a Git draft. */
import { readFile, writeFile, mkdir, access, unlink } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import sharp from "sharp";
import { eventSchema } from "../lib/events/schema";

async function main() {
  const index = process.argv.indexOf("--snapshot");
  if (index < 0 || !process.argv[index + 1]) throw new Error("Usage: pnpm event:prepare --snapshot <private-export.json>");
  const snapshot = z.object({ schemaVersion: z.literal(1), proposalId: z.uuid(), version: z.number().int().positive(), event: eventSchema, imageBase64: z.string().max(2_100_000) }).strict().parse(JSON.parse(await readFile(process.argv[index + 1], "utf8")));
  if (snapshot.event.status !== "draft" || snapshot.event.featuredInDiscover || snapshot.event.image || !snapshot.event.plan) throw new Error("Only unpublished event drafts with a reviewed plan can be prepared");
  const filename = `${snapshot.event.slug}-plan.webp`;
  if (snapshot.event.plan.src !== `/editorial/events/${filename}`) throw new Error("Unexpected plan path");
  const bytes = Buffer.from(snapshot.imageBase64, "base64");
  const metadata = await sharp(bytes, { limitInputPixels: 24_000_000 }).metadata();
  if (bytes.length > 1572864 || metadata.format !== "webp" || metadata.width !== snapshot.event.plan.width || metadata.height !== snapshot.event.plan.height) throw new Error("Image does not match the proposal");
  const eventPath = path.resolve("data/events/es", `${snapshot.event.slug}.json`);
  const imagePath = path.resolve("public/editorial/events", filename);
  for (const target of [eventPath, imagePath]) {
    try { await access(target); } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") continue; throw error; }
    throw new Error(`Refusing to overwrite ${target}; review changes to existing editions manually`);
  }
  await mkdir(path.dirname(eventPath), { recursive: true });
  await mkdir(path.dirname(imagePath), { recursive: true });
  await writeFile(imagePath, bytes, { flag: "wx" });
  try { await writeFile(eventPath, `${JSON.stringify(snapshot.event, null, 2)}\n`, { flag: "wx" }); }
  catch (error) { await unlink(imagePath); throw error; }
  console.log(`Prepared draft ${eventPath}. Verify sources, venue, attendance, positions and rights; add the separate official poster before publishing. Run pnpm check:events and the publication gates. The private snapshot must not be committed.`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : "Event preparation failed"); process.exitCode = 1; });
