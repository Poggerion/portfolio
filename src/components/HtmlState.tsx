"use client";

import { useLayoutEffect } from "react";

/**
 * Switching language remounts the root layout and React resets <html>, dropping what the boot
 * script set before first paint. Restores it before the new page paints.
 */
export function HtmlState() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    root.toggleAttribute("data-scrolled", window.scrollY > 8);
  }, []);
  return null;
}
