"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Content remains visible without JavaScript, observers, or animation support. */
export function SectionReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches || !entry.target.animate) continue;
          const style = getComputedStyle(element);
          const animation = entry.target.animate(
            [
              { opacity: 0.35, transform: "translateY(16px)" },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: parseFloat(
                style.getPropertyValue("--chisan-motion-page"),
              ),
              easing: style.getPropertyValue("--chisan-ease").trim(),
            },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0.08 },
    );
    element
      .querySelectorAll("[data-reveal]")
      .forEach((section) => observer.observe(section));
    const stop = () => {
      if (preference.matches)
        animations.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stop);
    };
  }, []);
  return (
    <div ref={root} className="home-story">
      {children}
    </div>
  );
}
