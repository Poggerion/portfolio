"use client";

import { useEffect, useRef } from "react";
import { SculptureModel, defaultParams } from "@/lib/sculpture/geometry";

/** Knot family per project, so each case study has its own abstract signature. */
const KNOTS: [number, number][] = [
  [2, 3],
  [3, 4],
  [2, 5],
  [3, 5],
  [2, 7],
  [3, 7],
  [4, 5],
  [3, 8],
  [5, 6],
];

export function glyphSpec(index: number) {
  const [p, q] = KNOTS[index % KNOTS.length];
  return { p, q, seed: 31 + index * 7 };
}

/**
 * Small abstract knot drawn with Canvas 2D from the same geometry as the main sculpture.
 * Decorative only: it never stands for a real screenshot.
 */
export function ProjectGlyph({
  index,
  className,
  density = 1,
}: {
  index: number;
  className?: string;
  density?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { p, q, seed } = glyphSpec(index);
    const model = new SculptureModel({
      ...defaultParams,
      p,
      q,
      seed,
      filaments: Math.round(34 * density),
      samples: 150,
      spread: 0.24,
    });
    const F = model.params.filaments;
    const S = model.params.samples;
    const buf = new Float32Array(model.vertexCount * 3);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    let t0 = performance.now();

    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const time = reduced ? 0 : (now - t0) / 1000;
      model.write(buf, { time: time * 0.8, morph: 0 });
      const ry = 0.4 + time * 0.12;
      const rx = -0.5;
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const scale = (Math.min(w, h) * dpr) / 3.1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 0.7 * dpr;
      ctx.lineJoin = "round";
      for (let f = 0; f < F; f++) {
        ctx.beginPath();
        let depth = 0;
        for (let i = 0; i <= S; i++) {
          const o = (f * S + (i % S)) * 3;
          const x = buf[o];
          const y = buf[o + 1];
          const z = buf[o + 2];
          const x1 = x * cy + z * sy;
          const z1 = -x * sy + z * cy;
          const y2 = y * cx - z1 * sx;
          const z2 = y * sx + z1 * cx;
          depth += z2;
          const px = canvas.width / 2 + x1 * scale;
          const py = canvas.height / 2 - y2 * scale;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        const k = Math.min(1, Math.max(0, depth / S + 0.6));
        ctx.strokeStyle = `rgba(214, 213, 209, ${0.12 + 0.42 * k})`;
        ctx.stroke();
      }
      if (!reduced && visible) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !reduced) {
        t0 = performance.now() - 2000;
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [index, density]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
