import { safeReturnPath } from "@/lib/accounts/producer-fields";
import { redirect } from "next/navigation";
export function redirectWithMessage(
  path: string,
  kind: "error" | "notice",
  message: string,
): never {
  const url = new URL(safeReturnPath(path), "https://chisan.invalid");
  url.searchParams.set(kind, message.slice(0, 300));
  redirect(`${url.pathname}${url.search}`);
}

export function producerEditPath(country: string, producerId: number): string {
  return `/cuenta/productores/${encodeURIComponent(country)}/${producerId}/editar`;
}
