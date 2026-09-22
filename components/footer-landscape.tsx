import Image from "next/image";
import { ChisanMascot } from "@/components/brand/chisan-brand";

/** The original illustrated landscape, now travelled by Chisan's character. */
export function FooterLandscape() {
  return (
    <div className="footer-landscape" aria-hidden="true">
      <Image
        className="footer-landscape__scenery"
        src="/brand/ambient/footer-landscape.webp"
        alt=""
        width={2172}
        height={724}
        sizes="100vw"
      />
      <span className="footer-landscape__journey">
        <ChisanMascot state="following" size={80} alt="" />
      </span>
    </div>
  );
}
