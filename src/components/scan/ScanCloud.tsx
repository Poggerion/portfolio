"use client";

import { useEffect, useRef, useState } from "react";
import { ui } from "@/content/ui";
import { t, type Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { useScan } from "@/lib/scan-store";
import type { Pose, ScanCloudRenderer, Shape } from "./cloud";
import styles from "./ScanPanel.module.css";

/** Built shapes in public/clouds/ (npm run clouds); "yarn" and "text" are made in the browser. */
type ShapeName = "yarn" | "face" | "quebec" | "phone" | "spot" | "board" | "cegep" | "ets" | "text";

const NAMES: ShapeName[] = ["yarn", "face", "quebec", "phone", "spot", "board", "cegep", "ets", "text"];

/** The shape each section shows, and the one a hovered project shows. */
function shapeFor(section: string, variant: string | null, project: string | null): ShapeName {
  if (project) {
    if (project.startsWith("spot-")) return "spot";
    if (project === "android-raspberry-arduino" || project === "server-infrastructure-lab") return "board";
    return "phone";
  }
  switch (section) {
    case "about":
      return "quebec";
    case "work":
      return "phone";
    case "experience":
      return "spot";
    case "skills":
      return "board";
    case "education":
      return variant === "ets" ? "ets" : "cegep";
    case "contact":
      return "text";
    default:
      return "face";
  }
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

/** A hovered project keeps its shape this long after the pointer leaves, so the cloud does not flicker. */
const HOVER_RELEASE_MS = 300;
/** On arrival the ball of yarn holds this long before it turns into the face. */
const INTRO_HOLD_MS = 1200;

/**
 * Fixed canvas behind the page. The ball of yarn appears, then becomes Felipe's face, then takes
 * the shape of each section as the reader scrolls. Three.js loads once the page is idle. Under
 * reduced motion the shapes change without moving; without WebGL, a still image of the shape.
 */
export function ScanCloud({ lang }: { lang: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apply = useRef<() => void>(() => {});
  const { section, variant } = useScan();
  const state = useRef({ section, variant, project: null as string | null });
  const [noWebGL, setNoWebGL] = useState(false);
  const fallback = noWebGL && section !== "contact" ? shapeFor(section, variant, null) : null;

  useEffect(() => {
    state.current.section = section;
    state.current.variant = variant;
    apply.current();
  }, [section, variant]);

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
    let releaseTimer = 0;
    const cleanups: (() => void)[] = [];

    const boot = async () => {
      const mod = await import("./cloud");
      if (cancelled) return;
      const count = window.innerWidth >= 1024 ? mod.POINTS.full : mod.POINTS.light;
      const cache = new Map<ShapeName, Promise<Shape>>();
      const load = (name: ShapeName): Promise<Shape> => {
        let p = cache.get(name);
        if (!p) {
          if (name === "yarn") p = Promise.resolve(mod.buildYarn());
          else if (name === "text") {
            const title = document.getElementById("contact-title");
            const family = title ? getComputedStyle(title).fontFamily : "serif";
            const lines = [t(ui.contactTitle.a, lang), t(ui.contactTitle.b, lang)];
            p = document.fonts
              .load(`220px ${family}`)
              .catch(() => [])
              .then(() => mod.textShape(lines, family));
          } else {
            p = fetch(`${basePath}/clouds/${name}.bin`)
              .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.statusText))))
              .then(mod.decodeShape);
          }
          // Every shape gets the same light dust around it, drawn from its own seed.
          p = p.then((shape) => mod.withDust(shape, NAMES.indexOf(name) + 1));
          cache.set(name, p);
        }
        return p;
      };

      const s0 = state.current;
      const first = still ? await load(shapeFor(s0.section, s0.variant, null)) : await load("yarn");
      if (cancelled) return;
      const cloud: ScanCloudRenderer = new mod.ScanCloudRenderer(canvas, count, first, poseFor(s0.section), still);
      canvas.dataset.ready = "";
      cloud.play();

      let wanted: ShapeName | null = null;
      apply.current = () => {
        if (!introDone) return;
        const s = state.current;
        const name = shapeFor(s.section, s.variant, s.project);
        cloud.setPose(poseFor(s.section));
        if (name === wanted) return;
        wanted = name;
        load(name)
          .then((shape) => {
            if (!cancelled && wanted === name) cloud.morphTo(shape, name === "yarn");
          })
          .catch(() => {});
      };
      if (still) apply.current();
      else
        window.setTimeout(() => {
          introDone = true;
          apply.current();
        }, INTRO_HOLD_MS);

      // The other shapes load in the background, once the first one is on screen.
      const rest: ShapeName[] = ["face", "quebec", "phone", "spot", "board", "cegep", "ets"];
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
      idle(() => rest.forEach((n) => void load(n).catch(() => {})));

      const onResize = () => {
        cloud.resize();
        cloud.setPose(poseFor(state.current.section));
      };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType === "mouse") cloud.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      // Hovering or focusing a project shows its shape; it returns 300 ms after the pointer leaves.
      const onOver = (e: Event) => {
        const el = (e.target as Element | null)?.closest?.("#work [data-project]");
        if (!el) return;
        window.clearTimeout(releaseTimer);
        state.current.project = el.getAttribute("data-project");
        apply.current();
      };
      const onOut = (e: Event) => {
        const el = (e.target as Element | null)?.closest?.("#work [data-project]");
        const next = (e as FocusEvent).relatedTarget as Element | null;
        if (!el || (next && el.contains(next))) return;
        window.clearTimeout(releaseTimer);
        releaseTimer = window.setTimeout(() => {
          state.current.project = null;
          apply.current();
        }, HOVER_RELEASE_MS);
      };
      const onVisibility = () => (document.hidden ? cloud.pause() : cloud.play());
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);
      document.addEventListener("focusin", onOver);
      document.addEventListener("focusout", onOut);
      document.addEventListener("visibilitychange", onVisibility);
      cleanups.push(() => {
        window.clearTimeout(releaseTimer);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
        document.removeEventListener("focusin", onOver);
        document.removeEventListener("focusout", onOut);
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
      {fallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.still} src={`${basePath}/clouds/${fallback}.webp`} alt="" width={480} height={480} />
      )}
    </>
  );
}
