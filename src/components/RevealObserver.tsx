"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/** Marks [data-reveal] elements as they enter the viewport. One observer for the page. */
export function RevealObserver() {
  const pathname = usePathname();

  // Switching language remounts the root layout and React resets <html>, dropping what the
  // boot script set before first paint. Restore it before the new page paints.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("motion");
    }
    root.toggleAttribute("data-scrolled", window.scrollY > 8);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion")) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const scan = () =>
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    // Content swapped in by client navigation gets observed too.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
