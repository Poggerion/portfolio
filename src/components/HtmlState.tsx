"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const BACK_TO_SECTION = "back-to-section";

/**
 * Switching language remounts the root layout and React resets <html>, dropping what the boot
 * script set before first paint. Restores it before the new page paints.
 *
 * Also keeps Back working after an in-page link (J5). A plain "#section" link adds a history entry
 * without the router's state, and the router ignores a Back onto such an entry: going back from a
 * case study to "/fr/#work" changed the address but kept the case study on screen. The entry gets
 * the page's router state as soon as it is created; if one still slips through, the page is
 * loaded again at the address shown and taken to its section.
 */
export function HtmlState() {
  const pathname = usePathname();
  const shown = useRef(pathname);
  const routerState = useRef<unknown>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    root.toggleAttribute("data-scrolled", window.scrollY > 8);
  }, []);

  // The router writes its state for the page before effects run.
  useEffect(() => {
    shown.current = pathname;
    if (window.history.state) routerState.current = window.history.state;
  }, [pathname]);

  useEffect(() => {
    let back = false;
    try {
      back = sessionStorage.getItem(BACK_TO_SECTION) === "1";
      sessionStorage.removeItem(BACK_TO_SECTION);
    } catch {}
    const target = back && window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
    target?.scrollIntoView({ block: "start" });

    const strip = (path: string | null) => (path ?? "").replace(/\/$/, "");
    const samePage = () => strip(window.location.pathname).endsWith(strip(shown.current));
    const onPopState = (event: PopStateEvent) => {
      if (event.state) {
        routerState.current = event.state;
        return;
      }
      if (samePage()) {
        // A new #section entry on the page being shown: give it the page's router state.
        if (routerState.current) window.history.replaceState(routerState.current, "", window.location.href);
        return;
      }
      try {
        sessionStorage.setItem(BACK_TO_SECTION, "1");
      } catch {}
      window.location.reload();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return null;
}
