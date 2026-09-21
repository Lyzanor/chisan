import { getCurrentAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import { auditEvents } from "@/lib/db/schema";
import { SITE_CONTACT_EMAIL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let name = "";
  let location = "";
  let category = "";
  let contact = "";
  let notes = "";

  try {
    const payload = await request.json();
    name = (payload.name ?? "").trim();
    location = (payload.location ?? "").trim();
    category = (payload.category ?? "").trim();
    contact = (payload.contact ?? "").trim();
    notes = (payload.notes ?? "").trim();

    if (!name) {
      return Response.json(
        { success: false, message: "Por favor, indica el nombre del productor." },
        { status: 400 },
      );
    }

    const subject = encodeURIComponent(`Sugerencia de productor: ${name}`);
    const body = encodeURIComponent(
      `Nombre del productor: ${name}\n` +
      `Ubicación: ${location || "No especificada"}\n` +
      `Categoría o productos: ${category || "No especificada"}\n` +
      `Contacto o enlaces: ${contact || "No especificado"}\n` +
      `Notas adicionales: ${notes || "Ninguna"}\n`,
    );
    const mailtoUrl = `mailto:${SITE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    const account = await getCurrentAccount();
    const database = getDatabase();

    const targetSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 100) || "unnamed";

    if (account?.id) {
      await database.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: account.id,
        actorKey: null,
        action: "candidate.suggested",
        targetType: "producer_candidate",
        targetId: targetSlug,
        metadata: {
          name,
          location,
          category: category || null,
          contact: contact || null,
          notes: notes || null,
          submittedAt: new Date().toISOString(),
          accountEmail: account.email ?? null,
        },
      });
    } else {
      await database.insert(auditEvents).values({
        actorKind: "service",
        actorUserId: null,
        actorKey: "candidate_suggestion",
        action: "candidate.suggested",
        targetType: "producer_candidate",
        targetId: targetSlug,
        metadata: {
          name,
          location,
          category: category || null,
          contact: contact || null,
          notes: notes || null,
          submittedAt: new Date().toISOString(),
          accountEmail: null,
        },
      });
    }

    return Response.json({
      success: true,
      message: "¡Muchas gracias! Hemos recibido tu sugerencia para revisarla.",
      mailtoUrl,
    });
  } catch {
    const subject = encodeURIComponent(`Sugerencia de productor: ${name || "Nuevo"}`);
    const body = encodeURIComponent(
      `Nombre del productor: ${name}\n` +
      `Ubicación: ${location || "No especificada"}\n` +
      `Categoría o productos: ${category || "No especificada"}\n` +
      `Contacto o enlaces: ${contact || "No especificado"}\n` +
      `Notas adicionales: ${notes || "Ninguna"}\n`,
    );
    const mailtoUrl = `mailto:${SITE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    return Response.json({
      success: false,
      message: "No se ha podido guardar la sugerencia directamente, pero puedes enviárnosla por correo.",
      mailtoUrl,
    });
  }
}
