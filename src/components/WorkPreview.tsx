"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectGlyph } from "./ProjectGlyph";
import styles from "./sections.module.css";

/** Space kept between the preview, the hovered item and the edges of the window. */
const GAP = 16;
/** Smallest scale used when the window is too short for the full preview. */
const MIN_SCALE = 0.6;

/**
 * Floating abstract visual over the selected work list (fine pointers only). It follows the
 * pointer horizontally and sits above the hovered item (below it near the top of the window),
 * inside the viewport, so it never hides the title being read. Labelled as generated so it
 * never passes for a screenshot.
 */
export function WorkPreview({ caption }: { caption: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const list = document.querySelector<HTMLElement>("[data-work-list]");
    const el = box.current;
    if (!list || !el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // The fixed site header: the preview stays below it.
    const header = document.querySelector<HTMLElement>("body > header");
    let item: HTMLElement | null = null;
    let pointerX = 0;
    let x = 0;
    let y = 0;
    let s = 1;
    let raf = 0;

    // Where the preview should be for the hovered item and the pointer. Recomputed every
    // frame, so scrolling or resizing under a still pointer keeps it in place.
    const target = (): [number, number, number] => {
      const r = item!.getBoundingClientRect();
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const top = (header ? header.getBoundingClientRect().bottom : 0) + GAP;
      const above = r.top - GAP - top;
      const below = vh - r.bottom - 2 * GAP;
      const up = above >= h || (below < h && above >= below);
      const scale = Math.min(1, Math.max(MIN_SCALE, (up ? above : below) / h));
      const sw = w * scale;
      const sh = h * scale;
      const tx = Math.min(Math.max(pointerX - sw / 2, GAP), vw - sw - GAP);
      const ty = up ? Math.max(r.top - GAP - sh, top) : Math.min(r.bottom + GAP, vh - sh - GAP);
      return [tx, ty, scale];
    };

    const apply = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
      // The caption keeps its reading size when the box shrinks.
      el.style.setProperty("--s", String(s));
    };

    const loop = () => {
      const [tx, ty, ts] = target();
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      s += (ts - s) * 0.14;
      apply();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
    };
    const onOver = (e: PointerEvent) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>("[data-glyph]");
      if (!row) return;
      item = row;
      pointerX = e.clientX;
      if (!raf) {
        // First item: appear in place instead of gliding in from the last position.
        [x, y, s] = target();
        apply();
        raf = requestAnimationFrame(loop);
      }
      setIndex(Number(row.dataset.glyph));
    };
    const onLeave = () => {
      setIndex(null);
      cancelAnimationFrame(raf);
      raf = 0;
      item = null;
    };

    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerover", onOver);
    list.addEventListener("pointerleave", onLeave);
    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerover", onOver);
      list.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={box} className={styles.preview} data-visible={index !== null ? "true" : "false"} aria-hidden="true">
      <div className={styles.previewCanvas}>
        {index !== null && <ProjectGlyph key={index} index={index} className={styles.previewGlyph} />}
      </div>
      <span className={`mono ${styles.previewCaption}`}>{caption}</span>
    </div>
  );
}
