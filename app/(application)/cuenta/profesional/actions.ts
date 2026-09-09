"use server";
import { revalidatePath } from "next/cache";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getBusinessService } from "@/lib/b2b/runtime";
import { B2B_ROOT } from "@/lib/b2b/policy";
import { BusinessError } from "@/lib/b2b/service";
import { ZodError } from "zod";
export async function businessAction(
  _previous: { error?: string; success?: string; id?: string },
  form: FormData,
): Promise<{ error?: string; success?: string; id?: string }> {
  const account = await requireCurrentAccount(B2B_ROOT);
  const service = getBusinessService();
  const text = (key: string) => String(form.get(key) ?? "");
  try {
    if (text("payload").length > 16000)
      throw new BusinessError("La solicitud es demasiado larga.");
    const payload = JSON.parse(text("payload"));
    let id: string | undefined;
    switch (text("operation")) {
      case "profile":
        await service.saveProfile(account.id, payload);
        break;
      case "terms":
        await service.saveTerms(account.id, payload);
        break;
      case "create":
        id = await service.create(account.id, payload);
        break;
      case "reply":
        await service.reply(account.id, payload);
        break;
      case "close":
        await service.close(account.id, payload.id);
        break;
      default:
        throw new BusinessError("Acción desconocida.");
    }
    revalidatePath(B2B_ROOT, "layout");
    return { success: "Guardado.", id };
  } catch (error) {
    if (error instanceof BusinessError) return { error: error.message };
    if (error instanceof ZodError) {
      const labels: Record<string, string> = {
        businessName: "Nombre del negocio",
        activity: "Actividad",
        products: "Productos",
        quantity: "Cantidad",
        unit: "Unidad",
        weeklyCapacity: "Capacidad semanal",
        capacityUnit: "Unidad de capacidad",
        minimumOrder: "Pedido mínimo",
        orderUnit: "Unidad del pedido mínimo",
        deliveryDays: "Días de reparto",
        deliveryRadiusKm: "Radio de reparto",
        deliveryOrigin: "Origen del reparto",
        deliveryArea: "Zona de reparto",
        leadTimeHours: "Antelación",
        notes: "Notas",
        frequency: "Frecuencia",
        deliveryLocation: "Lugar de entrega",
        message: "Mensaje",
        body: "Mensaje",
      };
      return {
        error: error.issues
          .map(
            (issue) =>
              `${labels[String(issue.path.at(-1))] ?? "Datos"}: ${issue.code === "custom" ? issue.message : issue.code === "too_big" ? "Supera el máximo permitido." : "Completa o revisa este campo."}`,
          )
          .join(" "),
      };
    }
    if (error instanceof SyntaxError)
      return { error: "Revisa los datos del formulario." };
    console.error(
      "Business action failed",
      error instanceof Error ? error.name : "unknown",
    );
    return { error: "No se ha podido guardar. Inténtalo de nuevo." };
  }
}
