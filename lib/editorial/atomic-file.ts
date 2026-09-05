import { randomUUID } from "node:crypto";
import { chmod, open, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
/** Writes a same-directory temporary file and swaps it into place atomically. */
export async function atomicWriteUtf8(
  filePath: string,
  contents: string,
  allowNew = false,
): Promise<void> {
  const fileStats = await stat(filePath).catch((error) => {
    if (allowNew && error.code === "ENOENT") return { mode: 0o644 };
    throw error;
  });
  const directory = path.dirname(filePath);
  const temporaryPath = path.join(
    directory,
    `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`,
  );
  let handle: Awaited<ReturnType<typeof open>> | null = null;
  let renamed = false;

  try {
    handle = await open(temporaryPath, "wx", fileStats.mode & 0o777);
    await chmod(temporaryPath, fileStats.mode & 0o777);
    await handle.writeFile(contents, "utf8");
    await handle.sync();
    await handle.close();
    handle = null;
    await rename(temporaryPath, filePath);
    renamed = true;

    // A directory fsync is unavailable on some filesystems. The rename remains atomic.
    try {
      const directoryHandle = await open(directory, "r");
      try {
        await directoryHandle.sync();
      } finally {
        await directoryHandle.close();
      }
    } catch {
      // Best-effort durability after the atomic rename.
    }
  } finally {
    if (handle) await handle.close().catch(() => undefined);
    if (!renamed) await unlink(temporaryPath).catch(() => undefined);
  }
}
