import Image from "next/image";
import { ChisanMascot } from "@/components/brand/chisan-brand";

/** Chisan watches the shared countryside and city landscape from one corner. */
export function FooterLandscape() {
  return (
    <div className="footer-landscape" aria-hidden="true">
      <Image
        className="footer-landscape__scenery"
        src="/brand/ambient/footer-landscape-urban.webp"
        alt=""
        width={2172}
        height={724}
        sizes="100vw"
      />
      <span className="footer-landscape__journey">
        <ChisanMascot state="catalog" size={56} alt="" />
      </span>
    </div>
  );
}
