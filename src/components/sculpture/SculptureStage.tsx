"use client";

import { useEffect, useRef, useState } from "react";
import { experience } from "@/lib/experience-store";
import { selectDomain } from "@/lib/mode";
import { stageInsets, type StageInsets } from "@/lib/stage-insets";
import type { ClusterScreen, Layout, SculptureEngine } from "./engine";
import styles from "./SculptureStage.module.css";

/** Pose of the sculpture at each point of the editorial page. */
function poses(portrait: boolean) {
  return portrait
    ? {
        hero: { x: 0.32, y: 0.36, size: 0.5, opacity: 0.85 },
        ambient: { x: 0.55, y: 0.1, size: 0.55, opacity: 0.1 },
        contact: { x: 0.3, y: 0.42, size: 0.42, opacity: 0.7 },
      }
    : {
        hero: { x: 0.44, y: 0.02, size: 0.98, opacity: 1 },
        ambient: { x: 0.68, y: -0.04, size: 0.95, opacity: 0.13 },
        contact: { x: 0.5, y: 0.08, size: 0.85, opacity: 0.9 },
      };
}

function mix(a: Layout, b: Layout, t: number): Layout {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    size: a.size + (b.size - a.size) * t,
    opacity: a.opacity + (b.opacity - a.opacity) * t,
  };
}

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Publishes cluster screen positions to the creative interface without React renders. */
export const clusterBus = {
  last: [] as ClusterScreen[],
  listeners: new Set<(c: ClusterScreen[]) => void>(),
  emit(c: ClusterScreen[]) {
    this.last = c;
    this.listeners.forEach((l) => l(c));
  },
};

/**
 * Fixed WebGL canvas behind the home page. Loads Three.js only after the page is idle,
 * and only when WebGL works and the visitor has not asked for reduced motion.
 * Otherwise the static render in the hero stays in place.
 */
export function SculptureStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SculptureEngine | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      if (reduced || !hasWebGL()) {
        experience.set({ sceneOff: true });
        return;
      }
      let mod: typeof import("./engine");
      try {
        mod = await import("./engine");
      } catch {
        experience.set({ sceneOff: true });
        return;
      }
      if (cancelled) return;
      let engine: SculptureEngine;
      try {
        engine = new mod.SculptureEngine(canvas, mod.pickQuality(), {
          onReady: () => {
            document.documentElement.classList.add("scene-ready");
            experience.set({ sceneReady: true, sceneOff: false });
          },
          onHover: (d) => experience.set({ hover: d }),
          onSelect: (d) => selectDomain(experience.get().domain === d ? null : d),
          onClusters: (c) => clusterBus.emit(c),
        });
      } catch {
        experience.set({ sceneOff: true });
        return;
      }
      engineRef.current = engine;
      setActive(true);

      let portrait = window.innerHeight > window.innerWidth * 1.15;
      let lastY = window.scrollY;
      let lastT = performance.now();

      const updateScroll = () => {
        const y = window.scrollY;
        const now = performance.now();
        const vel = ((y - lastY) / Math.max(now - lastT, 1)) * 16;
        lastY = y;
        lastT = now;
        const vh = window.innerHeight;
        const p = poses(portrait);
        let layout = mix(p.hero, p.ambient, smooth(y / (vh * 0.9)));
        const contact = document.getElementById("contact");
        if (contact) {
          const r = contact.getBoundingClientRect();
          const t = smooth((vh - r.top) / (vh * 0.8));
          layout = mix(layout, p.contact, t);
        }
        engine.setLayout(layout);
        engine.setScroll(y * 0.0007, vel);
      };

      const onResize = () => {
        portrait = window.innerHeight > window.innerWidth * 1.15;
        engine.resize();
        updateScroll();
      };

      // Zoom or a move to another monitor changes the pixel ratio, not always with a resize event.
      let ratioQuery: MediaQueryList | null = null;
      const watchRatio = () => {
        ratioQuery?.removeEventListener("change", onRatio);
        ratioQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
        ratioQuery.addEventListener("change", onRatio);
      };
      const onRatio = () => {
        onResize();
        watchRatio();
      };

      const onInsets = (v: StageInsets) => engine.setInsets(v);

      const onPointer = (e: PointerEvent) => {
        engine.setPointer((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        if (experience.get().mode === "creative") {
          const target = e.target as HTMLElement | null;
          // Only pick clusters when the pointer is over the scene itself, not over the interface.
          if (target === canvas) engine.pick(e.clientX, e.clientY);
        }
      };

      const onClick = (e: MouseEvent) => {
        if (experience.get().mode !== "creative") return;
        const target = e.target as HTMLElement | null;
        if (target === canvas) engine.click(e.clientX, e.clientY);
      };

      const sync = () => {
        const s = experience.get();
        engine.setCreative(s.mode === "creative");
        engine.setFocus(s.hover, s.domain);
        engine.setPanel(s.mode === "creative" && !!s.domain);
        canvas.dataset.mode = s.mode;
      };

      const onVisibility = () => (document.hidden ? engine.stop() : engine.start());

      // A lost context (GPU reset, too many contexts) leaves a blank canvas: fall back to the
      // static render and the creative grid until the browser restores it.
      const onContextLost = () => {
        engine.stop();
        // Some browsers paint a lost context white: take the canvas off screen.
        setActive(false);
        clusterBus.last = [];
        document.documentElement.classList.remove("scene-ready");
        experience.set({ sceneReady: false, sceneOff: true });
      };
      const onContextRestored = () => {
        setActive(true);
        experience.set({ sceneOff: false });
        engine.restore();
      };

      updateScroll();
      sync();
      engine.setInsets(stageInsets.value);
      const unsub = experience.subscribe(sync);
      stageInsets.listeners.add(onInsets);
      window.addEventListener("scroll", updateScroll, { passive: true });
      window.addEventListener("resize", onResize);
      window.visualViewport?.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("click", onClick);
      document.addEventListener("visibilitychange", onVisibility);
      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);
      watchRatio();
      engine.start();

      cleanup = () => {
        unsub();
        stageInsets.listeners.delete(onInsets);
        window.removeEventListener("scroll", updateScroll);
        window.removeEventListener("resize", onResize);
        window.visualViewport?.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("click", onClick);
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
        ratioQuery?.removeEventListener("change", onRatio);
        engine.dispose();
        engineRef.current = null;
        // A layer mounted later must wait for the next engine's clusters, not replay these.
        clusterBus.last = [];
        document.documentElement.classList.remove("scene-ready");
        experience.set({ sceneReady: false });
      };
    };

    // Wait for the page to settle so the 3D never competes with first paint.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idle = w.requestIdleCallback
      ? w.requestIdleCallback(() => void boot(), { timeout: 900 })
      : window.setTimeout(() => void boot(), 300);

    return () => {
      cancelled = true;
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup?.();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} data-active={active ? "true" : "false"} aria-hidden="true" />;
}
