import type { Ref } from "react";
import { mapMarks } from "@/content/scan";
import meta from "./shape-meta.json";
import styles from "./ScanPanel.module.css";

type Point = [number, number];

/** City positions and route on the Québec shape (shape coordinates), from scripts/build-clouds.mts. */
export const quebecMarkers = meta.quebec.markers as Record<(typeof mapMarks)[number]["id"], Point>;
export const quebecRoute = meta.quebec.route as Point[];

/** Depth of the route's points in the cloud, so the labels sit on them. */
const ROUTE_Z = 0.1;

/** Spread of the still previews (preview() in scripts/build-clouds.mts): the shape covers 92 % of the image. */
export const PREVIEW_SPREAD = 0.92;

/** Where a point of a shape sits on its still preview, in % of the image from the top left. */
export function previewPercent([x, y]: Point): Point {
  return [((x * PREVIEW_SPREAD + 1) / 2) * 100, ((1 - y * PREVIEW_SPREAD) / 2) * 100];
}

/**
 * Labels for Sept-Îles and Montréal and a light travelling along the route between them, drawn
 * over the Québec map. `still`: placed on the still image (no WebGL); otherwise the cloud moves
 * them every frame with followCloud.
 */
export function MapMarks({ still = false, ref }: { still?: boolean; ref?: Ref<HTMLDivElement> }) {
  const route = still ? quebecRoute.map((p) => previewPercent(p).join(",")).join(" ") : undefined;
  return (
    <div ref={ref} className={styles.marks} data-still={still ? "" : undefined} aria-hidden="true">
      <svg className={styles.route} viewBox={still ? "0 0 100 100" : undefined} preserveAspectRatio="none">
        <polyline points={route} pathLength={100} vectorEffect="non-scaling-stroke" />
      </svg>
      {mapMarks.map((m) => {
        const [left, top] = previewPercent(quebecMarkers[m.id]);
        return (
          <span
            key={m.id}
            className={styles.mark}
            data-mark={m.id}
            data-side={m.side}
            style={still ? { left: `${left}%`, top: `${top}%` } : undefined}
          >
            <span className={styles.markDot} />
            <span className={`mono ${styles.markText}`}>
              <span className={styles.markName}>
                <span className={styles.markOrder}>{m.order}</span> {m.name}
              </span>
              <span className={styles.markDetail}>{m.detail}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** Moves the labels and the route onto the cloud as last drawn. `project`: shape → CSS pixels. */
export function followCloud(el: HTMLElement, project: (x: number, y: number, z: number) => { x: number; y: number } | null) {
  for (const mark of el.querySelectorAll<HTMLElement>("[data-mark]")) {
    const p = project(...quebecMarkers[mark.dataset.mark as keyof typeof quebecMarkers], ROUTE_Z);
    if (p) mark.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
  }
  const points = quebecRoute.map(([x, y]) => project(x, y, ROUTE_Z));
  if (points.every(Boolean)) {
    el.querySelector("polyline")?.setAttribute("points", points.map((p) => `${p!.x.toFixed(1)},${p!.y.toFixed(1)}`).join(" "));
  }
}
