"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/** Animate arrival without delaying navigation or remounting page state. */
export function PageMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const surface = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = surface.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element?.animate || preference.matches) return;

    const styles = getComputedStyle(element);
    const animation = element.animate(
      [
        { opacity: 0.7, transform: "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: parseFloat(styles.getPropertyValue("--chisan-motion-page")),
        easing: styles.getPropertyValue("--chisan-ease").trim(),
      },
    );
    const stop = () => {
      if (preference.matches) animation.cancel();
    };
    preference.addEventListener("change", stop);
    return () => {
      animation.cancel();
      preference.removeEventListener("change", stop);
    };
  }, [pathname]);

  return (
    <div className="site-content" ref={surface}>
      {children}
    </div>
  );
}
