import "server-only";
import { getDatabase } from "../db";
import { whatsappConfig, whatsappEnabled } from "./config";
import {
  createOpenAIProductExtractor,
  openAIProductConfig,
} from "../intake/openai";
import { downloadImage, sendReply } from "./meta";
import { drainInbox } from "./service";

export async function runWhatsAppInbox() {
  if (!whatsappEnabled()) return;
  const config = whatsappConfig();
  await drainInbox(getDatabase(), {
    extractor: createOpenAIProductExtractor(openAIProductConfig()),
    image: (image) => downloadImage(image, config),
    send: (sender, reply) => sendReply(sender, reply, config),
  });
}
