"use client";

import { useEffect } from "react";
import { scanSections } from "@/content/scan";
import { pickActive, pickVariant, PROBE } from "@/lib/active-section";
import { scanStore } from "@/lib/scan-store";

const ids = scanSections.map((s) => s.id);

/** Follows the reader through the home page and publishes the active section to the scan store. */
export function ScanTracker() {
  useEffect(() => {
    let frame = 0;
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
      const markers = Array.from(document.querySelectorAll<HTMLElement>(`#${section} [data-scan-variant]`), (el) => ({
        id: el.dataset.scanVariant ?? "",
        top: top(el),
      }));
      scanStore.set({ section, variant: pickVariant(markers, probe), live: true });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      scanStore.set({ section: ids[0], variant: null, live: false });
    };
  }, []);
  return null;
}
