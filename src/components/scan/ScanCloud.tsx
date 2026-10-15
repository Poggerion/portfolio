"use client";

import { useEffect, useRef, useState } from "react";
import { ui } from "@/content/ui";
import { shownProject } from "@/lib/active-section";
import { t, type Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { useScan } from "@/lib/scan-store";
import type { Ellipse, Motion, Pose, ScanCloudRenderer, Shape } from "./cloud";
import { MapMarks, followCloud } from "./MapMarks";
import meta from "./shape-meta.json";
import { SHAPE_NAMES, shapeFor, type ShapeName } from "./shapes";
import styles from "./ScanPanel.module.css";

/** The ball of yarn turns, the contact signature holds still once written, the rest sway very slightly. */
function motionFor(name: ShapeName): Motion {
  return name === "yarn" ? "spin" : name === "text" ? "steady" : "sway";
}

/**
 * Wide screens: the cloud fills the right part of the page beside the text, all the way down.
 * Narrow screens: it only shows, faint, behind the hero (elsewhere it would sit behind the text).
 * Each shape fits its box whatever its proportions (see Pose).
 */
function poseFor(section: string): Pose {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w >= 1024) return { x: 0.53, y: -0.02, size: Math.min(0.72, (0.4 * w) / h), width: 0.38, opacity: 1 };
  return { x: 0.45, y: 0.4, size: 0.5, width: 0.9, opacity: section === "top" ? 0.3 : 0 };
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** On arrival the ball of yarn holds this long before it turns into the face. */
const INTRO_HOLD_MS = 1200;
/** The map's labels appear once the morph is this far along (the route ends at the bottom, drawn last). */
const MARKS_AT = 0.9;

/**
 * Fixed canvas behind the page. The ball of yarn appears, then becomes Felipe's face, then takes
 * the shape of each section as the reader scrolls; in the work section, the shape of the project
 * being read, or of the one previewed by focus or hover. Three.js loads once the page is idle.
 * Under reduced motion the shapes change without moving; without WebGL, a still image of the
 * shape (with the map's labels), and the contact signature as dotted type.
 */
export function ScanCloud({ lang }: { lang: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const marksRef = useRef<HTMLDivElement>(null);
  const apply = useRef<() => void>(() => {});
  const scan = useScan();
  const name = shapeFor(scan.section, scan.variant, shownProject(scan));
  const wantedName = useRef(name);
  const section = useRef(scan.section);
  const [noWebGL, setNoWebGL] = useState(false);
  const [missing, setMissing] = useState<string | null>(null);
  const fallback = noWebGL && name !== "text" && name !== missing ? name : null;

  useEffect(() => {
    wantedName.current = name;
    section.current = scan.section;
    apply.current();
  }, [name, scan.section]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasWebGL()) {
      const frame = requestAnimationFrame(() => setNoWebGL(true));
      return () => cancelAnimationFrame(frame);
    }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let introDone = still;
    // Stops the downloads still running when the page goes (or the language changes).
    const downloads = new AbortController();
    const cleanups: (() => void)[] = [() => downloads.abort()];

    const boot = async () => {
      const mod = await import("./cloud");
      if (cancelled) return;
      const count = window.innerWidth >= 1024 ? mod.POINTS.full : mod.POINTS.light;
      const cache = new Map<ShapeName, Promise<Shape>>();
      const load = (shape: ShapeName): Promise<Shape> => {
        let p = cache.get(shape);
        if (!p) {
          if (shape === "yarn") p = Promise.resolve(mod.buildYarn());
          else if (shape === "text") {
            const title = document.getElementById("contact-title");
            const family = title ? getComputedStyle(title).fontFamily : "serif";
            const lines = [t(ui.contactTitle.a, lang), t(ui.contactTitle.b, lang)];
            p = document.fonts
              .load(`220px ${family}`)
              .catch(() => [])
              .then(() => mod.textShape(lines, family));
          } else {
            p = fetch(`${basePath}/clouds/${shape}.bin`, { signal: downloads.signal })
              .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${shape}: ${r.status}`))))
              .then(mod.decodeShape);
          }
          // Every shape gets the same light dust around it, drawn from its own seed. None lands
          // on the face or on the signature.
          p = p.then((s) => mod.withDust(s, SHAPE_NAMES.indexOf(shape) + 1, calmFor(shape, s, mod.extent)));
          // A failed download is forgotten, so a later visit to that shape tries again.
          p.catch(() => cache.delete(shape));
          cache.set(shape, p);
        }
        return p;
      };

      const first = still ? await load(wantedName.current).catch(() => load("yarn")) : await load("yarn");
      if (cancelled) return;
      const cloud: ScanCloudRenderer = new mod.ScanCloudRenderer(canvas, count, first, poseFor(section.current), still);
      canvas.dataset.ready = "";

      let wanted: ShapeName | null = null;
      let shown: ShapeName = still ? wantedName.current : "yarn";
      canvas.dataset.shape = shown;
      // The map's labels follow the cloud, once the map has formed.
      const syncMarks = () => {
        const marks = marksRef.current;
        if (!marks) return;
        const visible = shown === "quebec" && cloud.progress >= MARKS_AT;
        if (visible) followCloud(marks, (x, y, z) => cloud.project(x, y, z));
        if (visible !== marks.hasAttribute("data-show")) marks.toggleAttribute("data-show", visible);
      };
      const show = (target: ShapeName, shape: Shape) => {
        shown = target;
        canvas.dataset.shape = target;
        cloud.morphTo(shape, motionFor(target));
        syncMarks();
      };
      cloud.onFrame = syncMarks;
      cloud.play();
      apply.current = () => {
        if (!introDone) return;
        const target = wantedName.current;
        cloud.setPose(poseFor(section.current));
        if (target === wanted) return;
        wanted = target;
        load(target)
          .then((shape) => {
            // Only the latest request is shown: a shape that arrives after the reader moved on is
            // kept for later, not displayed.
            if (!cancelled && wanted === target) show(target, shape);
          })
          .catch(() => {
            // The file could not be read: the neutral ball of yarn rather than a wrong shape.
            if (cancelled || wanted !== target) return;
            wanted = null;
            void load("yarn").then((yarn) => {
              if (!cancelled && wanted === null) show("yarn", yarn);
            });
          });
      };
      if (still) apply.current();
      else
        window.setTimeout(() => {
          introDone = true;
          apply.current();
        }, INTRO_HOLD_MS);

      // The other shapes download in the background, one at a time, once the first is on screen.
      const queue = SHAPE_NAMES.filter((n) => n !== "yarn" && n !== "text");
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
      const next = () => {
        const n = queue.shift();
        if (n && !cancelled) void load(n).catch(() => {}).finally(() => idle(next));
      };
      idle(next);

      const onResize = () => {
        cloud.resize();
        cloud.setPose(poseFor(section.current));
      };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType === "mouse") cloud.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      const onVisibility = () => (document.hidden ? cloud.pause() : cloud.play());
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      cleanups.push(() => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        cloud.dispose();
      });
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => void boot());
    return () => {
      cancelled = true;
      apply.current = () => {};
      cleanups.forEach((c) => c());
    };
  }, [lang]);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" hidden={noWebGL} />
      {!noWebGL && <MapMarks ref={marksRef} />}
      {fallback && (
        <div className={styles.still}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/clouds/${fallback}.webp`}
            alt=""
            width={480}
            height={480}
            data-shape={fallback}
            onError={() => setMissing(fallback)}
          />
          {fallback === "quebec" && <MapMarks still />}
        </div>
      )}
      {noWebGL && name === "text" && (
        // The signature as dotted type, where the cloud would write it.
        <p className={styles.signature} aria-hidden="true">
          <span>{t(ui.contactTitle.a, lang)}</span>
          <span className={styles.signatureAccent}>{t(ui.contactTitle.b, lang)}</span>
        </p>
      )}
    </>
  );
}

/** Where dust must not land: the face (measured when the shape is built) and the signature. */
function calmFor(name: ShapeName, shape: Shape, extent: (s: Shape) => { x: number; y: number }): Ellipse | undefined {
  if (name === "face") return meta.face.calm;
  if (name === "text") {
    const e = extent(shape);
    return { cx: 0, cy: 0, rx: e.x * 1.15, ry: e.y * 1.5 };
  }
  return undefined;
}
