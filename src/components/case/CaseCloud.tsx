"use client";

import { useEffect, useRef, useState } from "react";
import { basePath } from "@/lib/site";
import type { Pose } from "../scan/cloud";
import type { ShapeName } from "../scan/shapes";
import styles from "./CaseStudy.module.css";

/** The ball of yarn holds this long before it becomes the project's shape. */
const INTRO_HOLD_MS = 500;

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    // The test context is released at once, not left to the garbage collector.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

/** Beside the intro text, fading out as the reader scrolls past the intro. */
function poseFor(fade: number): Pose {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return { x: 0.55, y: 0.02, size: Math.min(0.6, (0.42 * w) / h), width: 0.34, opacity: Math.max(0, 1 - fade) };
}

/**
 * The project's own point cloud, as the case study's introduction. Wide screens: the shared
 * Three.js renderer on a fixed canvas beside the intro, the ball of yarn turning into the shape,
 * then gone once the reader is past the intro (nothing is drawn then). Without WebGL: a still image
 * of the same shape in its place. Narrow screens get the still image in the intro instead
 * (CaseStill). Reduced motion: the shape, unmoving.
 */
export function CaseCloud({ shape }: { shape: ShapeName }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.matchMedia("(min-width: 1024px)").matches) return;
    if (!hasWebGL()) {
      const frame = requestAnimationFrame(() => setStill(true));
      return () => cancelAnimationFrame(frame);
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const downloads = new AbortController();
    let cancelled = false;
    const cleanups: (() => void)[] = [() => downloads.abort()];

    const boot = async () => {
      const mod = await import("../scan/cloud");
      const target = await fetch(`${basePath}/clouds/${shape}.bin`, { signal: downloads.signal })
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${shape}: ${r.status}`))))
        .then((b) => mod.withDust(mod.decodeShape(b), 7));
      if (cancelled) return;
      // Faded out by the time the intro has scrolled past: half the screen's height.
      const fade = () => window.scrollY / (window.innerHeight * 0.5);
      const cloud = new mod.ScanCloudRenderer(canvas, mod.POINTS.full, reduced ? target : mod.buildYarn(), poseFor(fade()), reduced);
      canvas.dataset.ready = "";
      canvas.dataset.shape = reduced ? shape : "yarn";
      cloud.play();
      const timer = window.setTimeout(() => {
        cloud.morphTo(target, "sway");
        canvas.dataset.shape = shape;
      }, INTRO_HOLD_MS);
      const onScroll = () => cloud.setPose(poseFor(fade()));
      const onResize = () => {
        cloud.resize();
        onScroll();
      };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType === "mouse") cloud.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      const onVisibility = () => (document.hidden ? cloud.pause() : cloud.play());
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      cleanups.push(() => {
        window.clearTimeout(timer);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        cloud.dispose();
      });
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() =>
      void boot().catch(() => {
        // The shape could not be loaded: its still image instead of an empty space.
        if (!cancelled) setStill(true);
      }),
    );
    return () => {
      cancelled = true;
      cleanups.forEach((c) => c());
    };
  }, [shape]);

  return (
    // Fixed behind the page, outside the text's stacking order, as on the home page. When it falls
    // back to the still image, the intro shows that image instead (CaseStill), so it scrolls away.
    <div className={styles.cloud} data-still={still || undefined}>
      {/* A new canvas per shape: a renderer never reuses the canvas of the one it replaces. */}
      <canvas key={shape} ref={canvasRef} className={styles.canvas} aria-hidden="true" hidden={still} />
    </div>
  );
}

/**
 * The project's shape as a light still image in the intro: always on narrow screens, and on wide
 * screens in place of the cloud when it cannot run (no WebGL, shape not loaded).
 */
export function CaseStill({ shape }: { shape: ShapeName }) {
  const ref = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    // The image may have failed before the page became interactive.
    const img = ref.current;
    if (!img?.complete || img.naturalWidth > 0) return;
    const frame = requestAnimationFrame(() => setMissing(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // A missing image leaves no empty space.
  if (missing) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      className={styles.still}
      src={`${basePath}/clouds/${shape}.webp`}
      alt=""
      width={480}
      height={480}
      data-shape={shape}
      onError={() => setMissing(true)}
    />
  );
}
