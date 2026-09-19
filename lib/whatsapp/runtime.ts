import "server-only";
import { createShelfWhatsAppHandler } from "../selection-shelf/whatsapp";
import { runSelectionShelfQueue, shelfCatalog } from "../selection-shelf/server";
import { getDatabase } from "../db";
import { whatsappConfig, whatsappEnabled } from "./config";
import { createAIProvider } from "../ai/runtime";
import { createProductExtractor } from "../intake/extractor";
import type { ProductExtractor } from "../intake/extractor";
import { downloadImage, sendReply } from "./meta";
import { drainInbox } from "./service";

let running: Promise<void> | undefined;

export async function runWhatsAppInbox() {
  if (!whatsappEnabled()) return;
  // Leave pool capacity for the independent, committed allowance reservation.
  // Cross-instance serialization is provided by PostgreSQL in reserveAIAttempt.
  if (running) return running;
  running = runInbox();
  try {
    await running;
  } finally {
    running = undefined;
  }
}

async function runInbox() {
  const config = whatsappConfig();
  const database = getDatabase();
  let productExtractor: ProductExtractor | undefined;
  const configuredExtractor = () => productExtractor ??= createProductExtractor(createAIProvider(database, "producer-intake"));
  await drainInbox(database, {
    shelf: createShelfWhatsAppHandler({ catalog: shelfCatalog, image: (image) => downloadImage(image, config) }),
    extractor: {
      get profile() { return configuredExtractor().profile; },
      async extract(input) {
        const extractor = configuredExtractor();
        return extractor.extract(input);
      },
    },
    image: (image) => downloadImage(image, config),
    send: (sender, reply) => sendReply(sender, reply, config),
  });
  // One shelf proposal per invocation; duplicate receipts cannot repeat inference.
  await runSelectionShelfQueue();
}
