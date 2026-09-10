"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import { whatsappConfig, whatsappEnabled } from "@/lib/whatsapp/config";
import { createLink, unlink } from "@/lib/whatsapp/service";

export type LinkState = { error?: string; url?: string; expiresAt?: string };
export async function linkWhatsApp(
  _previous: LinkState,
  form: FormData,
): Promise<LinkState> {
  const account = await requireCurrentAccount("/cuenta/whatsapp");
  if (!account.termsAcceptedAt || !whatsappEnabled())
    return { error: "El piloto de WhatsApp todavía no está disponible." };
  const parsed = z
    .object({
      producerId: z.coerce
        .number()
        .int()
        .positive()
        .max(Number.MAX_SAFE_INTEGER),
      timeZone: z.enum(["Europe/Madrid", "Atlantic/Canary"]),
      consent: z.literal("on"),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      error:
        "Selecciona el productor, la zona horaria y acepta el uso de mensajes y fotos para preparar propuestas.",
    };
  try {
    const config = whatsappConfig();
    const token = await createLink(getDatabase(), {
      userId: account.id,
      country: "es",
      producerId: parsed.data.producerId,
      timeZone: parsed.data.timeZone,
    });
    revalidatePath("/cuenta/whatsapp");
    return {
      url: `https://wa.me/${config.number}?text=${encodeURIComponent(`VINCULAR ${token}`)}`,
      expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    };
  } catch {
    return {
      error:
        "No se ha podido generar el enlace. Comprueba tu acceso al productor y al perfil ampliado.",
    };
  }
}
export async function unlinkWhatsApp() {
  const account = await requireCurrentAccount("/cuenta/whatsapp");
  await unlink(getDatabase(), account.id);
  revalidatePath("/cuenta/whatsapp");
}
