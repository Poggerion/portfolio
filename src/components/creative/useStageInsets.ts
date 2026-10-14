"use client";

import { useEffect, type RefObject } from "react";
import { stageInsets } from "@/lib/stage-insets";

/** Same rule as the engine: tall viewports stack the composition vertically. */
const isPortrait = () => window.innerHeight > window.innerWidth * 1.15;

/**
 * Publishes the screen areas the creative interface covers (header, intro, panel or bottom
 * sheet, Escape hint) so the 3D composition can fit in what is left. Offsets are used rather
 * than bounding boxes, so entrance transforms (slide-ins, rising text) never skew the result.
 */
export function useStageInsets({
  open,
  panelOpen,
  sheet,
  panelKey,
  intro,
  panel,
  escape,
}: {
  open: boolean;
  panelOpen: boolean;
  sheet: boolean;
  /** Changes when a different panel element mounts. */
  panelKey: string | null;
  intro: RefObject<HTMLElement | null>;
  panel: RefObject<HTMLElement | null>;
  escape: RefObject<HTMLElement | null>;
}) {
  useEffect(() => () => stageInsets.reset(), []);

  useEffect(() => {
    if (!open) {
      stageInsets.reset();
      return;
    }
    let raf = 0;
    let live = true;

    const measure = () => {
      raf = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const header = document.querySelector("header");
      let top = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
      let right = 0;
      let bottom = 0;
      let left = 0;

      // The intro steps aside while a panel is open.
      const introEl = intro.current;
      if (!panelOpen && introEl) {
        const introRight = introEl.offsetLeft + introEl.offsetWidth;
        const introBottom = introEl.offsetTop + introEl.offsetHeight;
        if (isPortrait() || introRight > w * 0.6) top = Math.max(top, introBottom);
        else left = introRight;
      }

      const panelEl = panel.current;
      if (panelOpen && panelEl) {
        if (sheet) bottom = h - panelEl.offsetTop;
        else right = w - panelEl.offsetLeft;
      }

      // offsetParent is null while the hint is display: none (touch screens, open sheet).
      const escapeEl = escape.current;
      if (escapeEl?.offsetParent) bottom = Math.max(bottom, h - escapeEl.offsetTop);

      const clamp = (v: number, max: number) => Math.round(Math.min(Math.max(v, 0), max));
      stageInsets.set({ top: clamp(top, h), right: clamp(right, w), bottom: clamp(bottom, h), left: clamp(left, w) });
    };

    const schedule = () => {
      if (live && !raf) raf = requestAnimationFrame(measure);
    };

    measure();
    const vv = window.visualViewport;
    window.addEventListener("resize", schedule);
    vv?.addEventListener("resize", schedule);
    document.fonts?.addEventListener("loadingdone", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    const header = document.querySelector("header");
    for (const el of [intro.current, panel.current, header]) if (el && ro) ro.observe(el);

    return () => {
      live = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
      vv?.removeEventListener("resize", schedule);
      document.fonts?.removeEventListener("loadingdone", schedule);
      ro?.disconnect();
    };
  }, [open, panelOpen, sheet, panelKey, intro, panel, escape]);
}
