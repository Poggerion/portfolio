"use client";

import { useEffect } from "react";
import { scanSections } from "@/content/scan";
import { pickActive, pickProject, pickVariant, PROBE } from "@/lib/active-section";
import { scanStore } from "@/lib/scan-store";

const ids = scanSections.map((s) => s.id);

/** A hovered project stays previewed this long after the pointer leaves, so the cloud does not flicker. */
export const HOVER_RELEASE_MS = 300;

/** The project item an event happened in, if any. */
function projectOf(target: EventTarget | null): string | null {
  return (target as Element | null)?.closest?.("#work [data-project]")?.getAttribute("data-project") ?? null;
}

/** Focus the reader can see (keyboard), not the focus a mouse click leaves on a link. */
function visibleFocus(el: Element): boolean {
  try {
    return el.matches(":focus-visible");
  } catch {
    return true;
  }
}

/**
 * Follows the reader through the home page and publishes to the scan store the active section,
 * the project being read in the work section, and the project previewed by keyboard focus or by
 * the mouse (touch has no hover: nothing depends on it).
 */
export function ScanTracker() {
  useEffect(() => {
    let frame = 0;
    let releaseTimer = 0;
    const update = () => {
      frame = 0;
      const top = (el: Element) => el.getBoundingClientRect().top;
      const boxes = ids.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: top(el) }] : [];
      });
      const probe = window.innerHeight * PROBE;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const section = pickActive(boxes, probe, atBottom) ?? ids[0];
      const markers = (selector: string, attr: string) =>
        Array.from(document.querySelectorAll<HTMLElement>(`#${section} ${selector}`), (el) => ({ id: el.getAttribute(attr) ?? "", top: top(el) }));
      const variant =
        section === "work"
          ? pickProject(markers("[data-project]", "data-project"), probe)
          : pickVariant(markers("[data-scan-variant]", "data-scan-variant"), probe);
      scanStore.update({ section, variant, live: true });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onPointerOver = (e: PointerEvent) => {
      const project = projectOf(e.target);
      if (e.pointerType !== "mouse" || !project) return;
      window.clearTimeout(releaseTimer);
      scanStore.update({ hover: project });
    };
    const onPointerOut = (e: PointerEvent) => {
      const project = projectOf(e.target);
      if (e.pointerType !== "mouse" || !project || projectOf(e.relatedTarget) === project) return;
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => scanStore.update({ hover: null }), HOVER_RELEASE_MS);
    };
    const onFocusIn = (e: FocusEvent) => {
      const project = projectOf(e.target);
      scanStore.update({ focus: project && visibleFocus(e.target as Element) ? project : null });
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!projectOf(e.relatedTarget)) scanStore.update({ focus: null });
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(releaseTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      scanStore.reset();
    };
  }, []);
  return null;
}
