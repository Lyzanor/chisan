import Link from "next/link";
import { GUIDES_PATH, listPublishedGuides } from "@/lib/guides/catalog";

export function GuidesLink({ className, locale = "es" }: { className?: string; locale?: "es" | "en" }) {
  if (!listPublishedGuides().length) return null;
  return (
    <Link href={GUIDES_PATH} lang={locale} className={className}>
      {locale === "en" ? "Guides" : "Guías"}
    </Link>
  );
}
