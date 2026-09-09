"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const InternalNavigationContext = createContext(false);

/** Animate arrival without delaying navigation or remounting page state. */
export function PageMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [entry, setEntry] = useState({ pathname, internal: pathname !== "/" });
  if (entry.pathname !== pathname) setEntry({ pathname, internal: true });
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
    <InternalNavigationContext.Provider value={entry.internal}>
      <div className="site-content" ref={surface}>
        {children}
      </div>
    </InternalNavigationContext.Provider>
  );
}
