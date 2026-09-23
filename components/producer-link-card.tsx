import Image from "next/image";
import { ArrowUpRightIcon, LinkSimpleIcon } from "@phosphor-icons/react/ssr";

/** A reviewed product photo or the producer's identity; no remote preview fetch. */
export function ProducerLinkCard({ href, label, imageSrc, identity = false, locale }: {
  href: string; label: string; imageSrc?: string; identity?: boolean; locale?: string;
}) {
  return <a className="chisan-link-card" href={href} lang={locale} target="_blank" rel="noopener noreferrer">
    <span className={`chisan-link-card__media${identity ? " chisan-link-card__media--identity" : ""}`} aria-hidden="true">
      {imageSrc ? <Image src={imageSrc} alt="" width={240} height={180} sizes="96px" /> : <LinkSimpleIcon size={28} />}
    </span>
    <span className="chisan-link-card__copy"><strong>{label}</strong><small>{new URL(href).hostname.replace(/^www\./, "")}</small></span>
    <ArrowUpRightIcon size={18} aria-hidden="true" />
  </a>;
}
