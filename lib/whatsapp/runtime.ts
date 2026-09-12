import "server-only";
import { getDatabase } from "../db";
import { whatsappConfig, whatsappEnabled } from "./config";
import {
  createOpenAIProductExtractor,
  openAIProductConfig,
} from "../intake/openai";
import { downloadImage, sendReply } from "./meta";
import { drainInbox } from "./service";
import {
  extractionCallLimit,
  reserveExtraction,
  withExtractionAllowance,
} from "./budget";

let running: Promise<void> | undefined;

export async function runWhatsAppInbox() {
  if (!whatsappEnabled()) return;
  // Leave pool capacity for the independent, committed allowance reservation.
  // Cross-instance serialization is provided by PostgreSQL in reserveExtraction.
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
  const limit = extractionCallLimit();
  await drainInbox(database, {
    extractor: withExtractionAllowance(
      createOpenAIProductExtractor(openAIProductConfig()),
      () => reserveExtraction(database, limit),
    ),
    image: (image) => downloadImage(image, config),
    send: (sender, reply) => sendReply(sender, reply, config),
  });
}
