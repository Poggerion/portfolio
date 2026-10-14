"use client";

import { useEffect, useRef } from "react";
import { useScan } from "@/lib/scan-store";
import { POINTS, type Pose, type YarnCloud } from "./cloud";
import styles from "./ScanPanel.module.css";

/** Pose of the cloud per section: large beside the hero and the contact, faint behind the reading. */
function poseFor(section: string, wide: boolean): Pose {
  const loud = section === "top" || section === "contact";
  if (wide) return loud ? { x: 0.5, y: -0.02, size: 0.92, opacity: 1 } : { x: 0.62, y: 0, size: 0.86, opacity: 0.24 };
  return loud ? { x: 0.42, y: 0.42, size: 0.5, opacity: 0.55 } : { x: 0.5, y: 0.1, size: 0.6, opacity: 0.1 };
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Fixed canvas behind the page: the ball of yarn, made of points. Three.js loads once the page
 * is idle. Under reduced motion the cloud is drawn once and stays still; without WebGL, nothing.
 */
export function ScanCloud() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudRef = useRef<YarnCloud | null>(null);
  const { section } = useScan();
  const sectionRef = useRef(section);

  useEffect(() => {
    sectionRef.current = section;
    cloudRef.current?.setPose(poseFor(section, window.innerWidth >= 1024));
  }, [section]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasWebGL()) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    const cleanups: (() => void)[] = [];

    const boot = async () => {
      const { YarnCloud } = await import("./cloud");
      if (cancelled) return;
      const wide = () => window.innerWidth >= 1024;
      const cloud = new YarnCloud(canvas, wide() ? POINTS.full : POINTS.light, poseFor(sectionRef.current, wide()), still);
      cloudRef.current = cloud;
      canvas.dataset.ready = "";
      cloud.play();

      const onResize = () => {
        cloud.resize();
        cloud.setPose(poseFor(sectionRef.current, wide()));
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
        cloudRef.current = null;
      });
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => void boot());
    return () => {
      cancelled = true;
      cleanups.forEach((c) => c());
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
