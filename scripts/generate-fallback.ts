/**
 * Renders the sculpture's static fallback (no WebGL, reduced motion, first paint)
 * from the same geometry the WebGL scene uses. Output: public/sculpture.svg
 * Run with: node scripts/generate-fallback.ts
 */
import { writeFileSync } from "node:fs";
import { buildStatic, defaultParams, type Vec3 } from "../src/lib/sculpture/geometry.ts";

const params = { ...defaultParams, filaments: 90, samples: 140 };
const lines = buildStatic(params);

// Same resting rotation as the WebGL scene.
const rx = -0.55;
const ry = 0.35;
function rotate([x, y, z]: Vec3): Vec3 {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}

const size = 1000;
const scale = 330;
const paths = lines.map((line) => {
  const pts = line.map(rotate);
  const depth = pts.reduce((s, p) => s + p[2], 0) / pts.length;
  const d = pts
    .map((p, i) => `${i ? "L" : "M"}${Math.round(size / 2 + p[0] * scale)} ${Math.round(size / 2 - p[1] * scale)}`)
    .join("") + "Z";
  return { d, depth };
});
paths.sort((a, b) => a.depth - b.depth);
const minD = paths[0].depth;
const maxD = paths[paths.length - 1].depth;

const body = paths
  .map(({ d, depth }) => {
    const k = (depth - minD) / (maxD - minD || 1);
    const opacity = (0.16 + 0.5 * k).toFixed(2);
    return `<path d="${d}" stroke-opacity="${opacity}"/>`;
  })
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none" stroke="#c9c8c4" stroke-width="0.6" stroke-linejoin="round">${body}</svg>\n`;
writeFileSync(new URL("../public/sculpture.svg", import.meta.url), svg);
console.log(`public/sculpture.svg: ${(svg.length / 1024).toFixed(1)} KB, ${paths.length} filaments`);
