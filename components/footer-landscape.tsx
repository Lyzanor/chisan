"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** One quiet delivery journey when the illustrated footer first enters view. */
export function FooterLandscape() {
  const scene = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const element = scene.current;
    if (!element || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setArrived(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scene} className="footer-landscape" data-arrived={arrived || undefined} aria-hidden="true">
      <Image className="footer-landscape__scenery" src="/brand/ambient/footer-landscape.webp" alt="" width={2172} height={724} sizes="100vw" />
      <span className="footer-landscape__journey">
        <Image src="/brand/ambient/footer-bicycle.webp" alt="" width={1254} height={1254} sizes="112px" />
      </span>
    </div>
  );
}
