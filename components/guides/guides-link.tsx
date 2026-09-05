import Link from "next/link";
import { listPublishedGuides } from "@/lib/guides/catalog";

export function GuidesLink({ className }: { className?: string }) {
  if (!listPublishedGuides().length) return null;
  return (
    <Link href="/guias" lang="es" className={className}>
      Guías
    </Link>
  );
}
