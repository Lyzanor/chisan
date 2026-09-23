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
    if (!element || !window.IntersectionObserver) return;
    const targets = new Set<HTMLElement>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        (target as HTMLElement).dataset.revealState = "visible";
        observer.unobserve(target);
      });
    }, { rootMargin: "0px 0px -24px 0px" });
    const discover = () => {
      element.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-stagger] > *").forEach((target) => {
        if (targets.has(target)) return;
        targets.add(target);
        // Content already in view and reduced-motion visits stay visible.
        if (preference.matches || target.getBoundingClientRect().top < window.innerHeight) return;
        target.dataset.revealState = "pending";
        observer.observe(target);
      });
    };
    const stop = () => {
      if (!preference.matches) return;
      observer.disconnect();
      targets.forEach((target) => target.removeAttribute("data-reveal-state"));
    };
    discover();
    // Also cover sections streamed into the shared page shell.
    const additions = new MutationObserver(discover);
    additions.observe(element, { childList: true, subtree: true });
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      additions.disconnect();
      preference.removeEventListener("change", stop);
      targets.forEach((target) => target.removeAttribute("data-reveal-state"));
    };
  }, [pathname]);

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
