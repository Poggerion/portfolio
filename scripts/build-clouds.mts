/**
 * Builds the point clouds the home page morphs between: `npm run clouds`.
 *
 * Reads the sources in cloud-sources/ (kept out of the repository: photos and references) and
 * writes, per shape, public/clouds/<name>.bin and a still preview public/clouds/<name>.webp.
 *
 * .bin format: exactly 16 384 points of 8 bytes, little-endian:
 *   Int16 x, Int16 y, Int16 z (−1..1 scaled by 32767), Uint8 intensity, Uint8 accent (0 or 1).
 * Points are shuffled, so any prefix is an even sample: phones use the first 6 144.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

export const COUNT = 16384;
export const BYTES_PER_POINT = 8;
const SRC = "cloud-sources";
const OUT = join("public", "clouds");

interface Point {
  x: number;
  y: number;
  z: number;
  i: number;
  accent: boolean;
}

/** Deterministic PRNG (mulberry32), so a rebuild gives the same files. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fits points in −1..1 on their longest side, centred, y up. */
function normalize(points: Point[]): Point[] {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const half = Math.max(maxX - minX, maxY - minY) / 2 || 1;
  return points.map((p) => ({ ...p, x: (p.x - cx) / half, y: (p.y - cy) / half, z: Math.max(-1, Math.min(1, p.z)) }));
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function encode(points: Point[]): Buffer {
  const buf = Buffer.alloc(COUNT * BYTES_PER_POINT);
  points.forEach((p, n) => {
    const o = n * BYTES_PER_POINT;
    buf.writeInt16LE(Math.round(p.x * 32767), o);
    buf.writeInt16LE(Math.round(p.y * 32767), o + 2);
    buf.writeInt16LE(Math.round(p.z * 32767), o + 4);
    buf.writeUInt8(Math.max(0, Math.min(255, Math.round(p.i))), o + 6);
    buf.writeUInt8(p.accent ? 1 : 0, o + 7);
  });
  return buf;
}

/** Still preview: the cloud seen from the front, light points on transparent. */
async function preview(points: Point[], file: string) {
  const size = 480;
  const px = new Float32Array(size * size);
  const accent = new Float32Array(size * size);
  for (const p of points) {
    const x = Math.round(((p.x * 0.92 + 1) / 2) * (size - 1));
    const y = Math.round(((1 - p.y * 0.92) / 2) * (size - 1));
    const k = y * size + x;
    px[k] += 0.25 + (p.i / 255) * 0.6;
    if (p.accent) accent[k] += 1;
  }
  const rgba = Buffer.alloc(size * size * 4);
  for (let k = 0; k < size * size; k++) {
    const a = Math.min(1, px[k]);
    const hot = accent[k] > 0;
    rgba[k * 4] = hot ? 255 : 241;
    rgba[k * 4 + 1] = hot ? 106 : 240;
    rgba[k * 4 + 2] = hot ? 61 : 237;
    rgba[k * 4 + 3] = Math.round(a * 255);
  }
  await sharp(rgba, { raw: { width: size, height: size, channels: 4 } }).webp({ quality: 80 }).toFile(file);
}

/* ---------- Photos: Sobel edges plus luminance, importance-sampled ---------- */

interface PhotoOptions {
  file: string;
  /** Crop in source pixels, before resizing. */
  crop?: { left: number; top: number; width: number; height: number };
  width: number;
  /** Ignore pixels close to the background colour (sampled in the corners). */
  maskBackground?: number;
  /** Weight of edges and of brightness in the sampling. */
  edge: number;
  light: number;
  /** Bright subject on a light background: sample the subject's dark parts too. */
  invert?: boolean;
  /** Saturated warm pixels (yellow, orange) carry the accent. */
  warmAccent?: boolean;
  relief: number;
  seed: number;
}

async function photo(o: PhotoOptions): Promise<Point[]> {
  let img = sharp(join(SRC, o.file)).rotate();
  if (o.crop) img = img.extract(o.crop);
  const { data, info } = await img.resize({ width: o.width }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const lum = new Float32Array(w * h);
  const warm = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) {
    const r = data[k * 3], g = data[k * 3 + 1], b = data[k * 3 + 2];
    lum[k] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    warm[k] = max - min > 90 && r > 150 && b < 120 && g > 60 ? 1 : 0;
  }
  // Background colour: median of the four corners' luminance.
  const corners = [0, w - 1, (h - 1) * w, h * w - 1].map((k) => lum[k]).sort((a, b) => a - b);
  const bg = (corners[1] + corners[2]) / 2;
  // Background: the region close to the corner colour that touches the border (flood fill), so
  // light areas inside the subject (a forehead, teeth, a white shirt) are kept.
  const background = new Uint8Array(w * h);
  if (o.maskBackground !== undefined) {
    const near = (k: number) => Math.abs(lum[k] - bg) <= o.maskBackground!;
    const queue: number[] = [];
    for (let x = 0; x < w; x++) queue.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) queue.push(y * w, y * w + w - 1);
    while (queue.length) {
      const k = queue.pop()!;
      if (background[k] || !near(k)) continue;
      background[k] = 1;
      const x = k % w;
      if (x > 0) queue.push(k - 1);
      if (x < w - 1) queue.push(k + 1);
      if (k >= w) queue.push(k - w);
      if (k < w * (h - 1)) queue.push(k + w);
    }
  }
  const inside = (k: number) => !background[k];

  const weight = new Float32Array(w * h);
  let total = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const k = y * w + x;
      if (!inside(k)) continue;
      const L = (dx: number, dy: number) => lum[k + dy * w + dx];
      const gx = -L(-1, -1) - 2 * L(-1, 0) - L(-1, 1) + L(1, -1) + 2 * L(1, 0) + L(1, 1);
      const gy = -L(-1, -1) - 2 * L(0, -1) - L(1, -1) + L(-1, 1) + 2 * L(0, 1) + L(1, 1);
      const edge = Math.min(1, Math.hypot(gx, gy) / 2);
      const tone = o.invert ? 1 - lum[k] * 0.6 : lum[k];
      const v = o.edge * edge + o.light * tone * tone + 0.02;
      weight[k] = v;
      total += v;
    }
  }
  const rand = rng(o.seed);
  // Cumulative table, then binary search per sample.
  const cdf = new Float64Array(w * h);
  let acc = 0;
  for (let k = 0; k < w * h; k++) cdf[k] = acc += weight[k] / total;
  const points: Point[] = [];
  for (let n = 0; n < COUNT; n++) {
    const r = rand();
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const x = lo % w, y = Math.floor(lo / w);
    points.push({
      x: x + rand() - 0.5,
      y: -(y + rand() - 0.5),
      z: (lum[lo] - 0.5) * o.relief * 2 + (rand() - 0.5) * 0.04,
      i: 70 + lum[lo] * 185,
      accent: !!o.warmAccent && warm[lo] === 1 && rand() < 0.6,
    });
  }
  return normalize(points);
}

/* ---------- Procedural shapes ---------- */

/** Spreads n points along a polyline, evenly by length. */
function alongPath(path: [number, number][], n: number, rand: () => number, jitter: number): [number, number][] {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    lens.push(l);
    total += l;
  }
  const out: [number, number][] = [];
  for (let k = 0; k < n; k++) {
    let d = rand() * total;
    let i = 0;
    while (i < lens.length - 1 && d > lens[i]) d -= lens[i++];
    const t = lens[i] ? d / lens[i] : 0;
    const [ax, ay] = path[i], [bx, by] = path[i + 1];
    out.push([ax + (bx - ax) * t + (rand() - 0.5) * jitter, ay + (by - ay) * t + (rand() - 0.5) * jitter]);
  }
  return out;
}

function rectPath(x: number, y: number, w: number, h: number, r = 0): [number, number][] {
  if (!r) return [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  const pts: [number, number][] = [];
  const corner = (cx: number, cy: number, a0: number) => {
    for (let s = 0; s <= 6; s++) {
      const a = a0 + (s / 6) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  corner(x + w - r, y + h - r, 0);
  corner(x + r, y + h - r, Math.PI / 2);
  corner(x + r, y + r, Math.PI);
  corner(x + w - r, y + r, (3 * Math.PI) / 2);
  pts.push(pts[0]);
  return pts;
}

function fillRect(x: number, y: number, w: number, h: number, n: number, rand: () => number): [number, number][] {
  return Array.from({ length: n }, () => [x + rand() * w, y + rand() * h] as [number, number]);
}

/** A phone: rounded body, notch, a parking app with a map and a reservation card. */
function phone(): Point[] {
  const rand = rng(11);
  const pts: Point[] = [];
  const add = (xy: [number, number][], i: number, accent = false, z = 0) =>
    xy.forEach(([x, y]) => pts.push({ x, y, z: z + (rand() - 0.5) * 0.03, i, accent }));
  add(alongPath(rectPath(-0.5, -1, 1, 2, 0.14), 3600, rand, 0.012), 240);
  add(alongPath(rectPath(-0.46, -0.95, 0.92, 1.9, 0.11), 1400, rand, 0.008), 150);
  add(alongPath(rectPath(-0.12, 0.86, 0.24, 0.05, 0.025), 300, rand, 0.006), 220);
  // Map: street grid with parking spots.
  for (let k = 0; k < 6; k++) add(alongPath([[-0.42, 0.75 - k * 0.12], [0.42, 0.75 - k * 0.12]], 260, rand, 0.006), 110);
  for (let k = 0; k < 6; k++) add(alongPath([[-0.36 + k * 0.15, 0.78], [-0.36 + k * 0.15, 0.1]], 230, rand, 0.006), 110);
  add(fillRect(0.0, 0.33, 0.11, 0.08, 500, rand), 255, true, 0.05);
  // Reservation card and button.
  add(alongPath(rectPath(-0.4, -0.45, 0.8, 0.45, 0.04), 900, rand, 0.006), 200);
  for (let k = 0; k < 3; k++) add(fillRect(-0.34, -0.12 - k * 0.09, 0.45 - k * 0.1, 0.025, 260, rand), 170);
  add(fillRect(-0.4, -0.78, 0.8, 0.14, 1700, rand), 235, false, 0.03);
  add(alongPath([[-0.18, -0.92], [0.18, -0.92]], 160, rand, 0.004), 200);
  return finish(pts, rand);
}

/** A single-board computer: board, 40-pin header, chips, ports and traces. */
function board(): Point[] {
  const rand = rng(23);
  const pts: Point[] = [];
  const add = (xy: [number, number][], i: number, accent = false, z = 0) =>
    xy.forEach(([x, y]) => pts.push({ x, y, z: z + (rand() - 0.5) * 0.03, i, accent }));
  add(alongPath(rectPath(-1, -0.65, 2, 1.3, 0.06), 2600, rand, 0.01), 230);
  for (const [cx, cy] of [[-0.88, 0.53], [0.52, 0.53], [-0.88, -0.53], [0.52, -0.53]]) {
    add(alongPath(Array.from({ length: 25 }, (_, s) => [cx + Math.cos((s / 24) * Math.PI * 2) * 0.05, cy + Math.sin((s / 24) * Math.PI * 2) * 0.05] as [number, number]), 120, rand, 0.004), 200);
  }
  // 2 × 20 header.
  for (let c = 0; c < 20; c++) for (let r = 0; r < 2; r++) add(fillRect(-0.74 + c * 0.065, 0.5 + r * 0.065, 0.03, 0.03, 18, rand), 250, false, 0.08);
  // Chips.
  add(fillRect(-0.45, -0.2, 0.42, 0.42, 1500, rand), 120, false, 0.05);
  add(alongPath(rectPath(-0.45, -0.2, 0.42, 0.42), 500, rand, 0.004), 240, false, 0.06);
  add(fillRect(0.12, -0.05, 0.26, 0.2, 700, rand), 110, false, 0.04);
  add(alongPath(rectPath(0.12, -0.05, 0.26, 0.2), 300, rand, 0.004), 230, false, 0.05);
  // Ports on the right edge.
  for (let k = 0; k < 3; k++) {
    add(fillRect(0.72, 0.18 - k * 0.32, 0.3, 0.24, 700, rand), 170, false, 0.12);
    add(alongPath(rectPath(0.72, 0.18 - k * 0.32, 0.3, 0.24), 300, rand, 0.004), 245, false, 0.13);
  }
  // Traces: right-angle runs from the chip to the header and the ports.
  for (let k = 0; k < 14; k++) {
    const x0 = -0.42 + k * 0.028;
    const y1 = 0.25 + (k % 4) * 0.05;
    add(alongPath([[x0, 0.22], [x0, y1], [-0.7 + k * 0.065, y1], [-0.7 + k * 0.065, 0.48]], 150, rand, 0.003), 150);
  }
  for (let k = 0; k < 8; k++) {
    const y0 = -0.17 + k * 0.045;
    add(alongPath([[-0.03, y0], [0.06, y0], [0.06 + k * 0.01, y0 - 0.25], [0.7, y0 - 0.25]], 140, rand, 0.003), 150);
  }
  // Status LEDs.
  add(fillRect(-0.95, -0.45, 0.04, 0.04, 140, rand), 255, true, 0.06);
  add(fillRect(-0.95, -0.35, 0.04, 0.04, 140, rand), 255, true, 0.06);
  return finish(pts, rand);
}

/** Québec from Natural Earth (public domain), with the route Sept-Îles → Montréal as the accent. */
function quebec(): Point[] {
  const rand = rng(31);
  const { rings } = JSON.parse(readFileSync(join(SRC, "quebec.json"), "utf8")) as { rings: [number, number][][] };
  const lat0 = 52;
  const proj = ([lon, lat]: [number, number]): [number, number] => [lon * Math.cos((lat0 * Math.PI) / 180), lat];
  const pts: Point[] = [];
  const add = (xy: [number, number][], i: number, accent = false, z = 0) =>
    xy.forEach(([x, y]) => pts.push({ x, y, z: z + (rand() - 0.5) * 0.25, i, accent }));
  const projected = rings.map((r) => r.map(proj));
  const perimeter = projected.map((r) => r.reduce((s, p, k) => (k ? s + Math.hypot(p[0] - r[k - 1][0], p[1] - r[k - 1][1]) : 0), 0));
  const totalPerimeter = perimeter.reduce((a, b) => a + b, 0);
  projected.forEach((r, k) => add(alongPath(r, Math.round((7000 * perimeter[k]) / totalPerimeter), rand, 0.12), 225));
  // Sparse fill inside the mainland ring (even-odd test).
  const main = projected[0];
  const inPoly = (x: number, y: number) => {
    let c = false;
    for (let a = 0, b = main.length - 1; a < main.length; b = a++) {
      const [xa, ya] = main[a], [xb, yb] = main[b];
      if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) c = !c;
    }
    return c;
  };
  const xs = main.map((p) => p[0]), ys = main.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let filled = 0;
  while (filled < 5200) {
    const x = minX + rand() * (maxX - minX), y = minY + rand() * (maxY - minY);
    if (!inPoly(x, y)) continue;
    pts.push({ x, y, z: (rand() - 0.5) * 0.3, i: 60 + rand() * 60, accent: false });
    filled++;
  }
  // The route along the St. Lawrence, then the two ends.
  const route = (
    [
      [-66.38, 50.21], [-68.15, 49.22], [-69.72, 48.14], [-71.21, 46.81], [-72.54, 46.34], [-73.57, 45.5],
    ] as [number, number][]
  ).map(proj);
  add(alongPath(route, 3000, rand, 0.05), 255, true, 0.1);
  for (const end of [route[0], route[route.length - 1]]) {
    add(Array.from({ length: 300 }, () => {
      const a = rand() * Math.PI * 2, r = 0.35 * Math.sqrt(rand());
      return [end[0] + Math.cos(a) * r, end[1] + Math.sin(a) * r] as [number, number];
    }), 255, true, 0.15);
  }
  return finish(pts, rand);
}

/**
 * Stand-in for ÉTS building A until Felipe sends his own photo: a long facade with a grid of
 * windows and a central entrance.
 */
function facade(): Point[] {
  const rand = rng(41);
  const pts: Point[] = [];
  const add = (xy: [number, number][], i: number, accent = false, z = 0) =>
    xy.forEach(([x, y]) => pts.push({ x, y, z: z + (rand() - 0.5) * 0.03, i, accent }));
  add(alongPath(rectPath(-1, -0.5, 2, 1), 2600, rand, 0.01), 230);
  add(alongPath([[-1.03, 0.5], [1.03, 0.5]], 600, rand, 0.01), 250, false, 0.05);
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 16; c++) {
      if (r < 2 && c >= 7 && c <= 8) continue;
      const x = -0.94 + c * 0.118, y = 0.3 - r * 0.17;
      add(alongPath(rectPath(x, y, 0.07, 0.11), 70, rand, 0.003), 180);
      add(fillRect(x + 0.01, y + 0.01, 0.05, 0.09, 30, rand), 90 + rand() * 120, false, -0.02);
    }
  }
  add(alongPath(rectPath(-0.12, -0.5, 0.24, 0.32), 500, rand, 0.004), 240, false, 0.04);
  add(fillRect(-0.1, -0.48, 0.2, 0.28, 400, rand), 200, false, 0.02);
  return finish(pts, rand);
}

/** Trims or pads to exactly COUNT points, then shuffles so every prefix is an even sample. */
function finish(pts: Point[], rand: () => number): Point[] {
  shuffle(pts, rand);
  while (pts.length < COUNT) {
    const p = pts[Math.floor(rand() * pts.length)];
    pts.push({ ...p, x: p.x + (rand() - 0.5) * 0.004, y: p.y + (rand() - 0.5) * 0.004 });
  }
  return normalize(shuffle(pts.slice(0, COUNT), rand));
}

/* ---------- Shapes ---------- */

const shapes: Record<string, () => Promise<Point[]> | Point[]> = {
  // Head and shoulders from Felipe's portrait (3378 × 5067).
  face: () =>
    photo({
      file: "portrait.jpg",
      crop: { left: 950, top: 40, width: 2100, height: 2150 },
      width: 380,
      maskBackground: 0.1,
      edge: 3,
      light: 1.2,
      relief: 0.2,
      seed: 3,
    }),
  quebec,
  phone,
  board,
  spot: () =>
    photo({ file: "spot-reference.png", width: 520, maskBackground: 0.06, edge: 1.4, light: 0.25, invert: true, warmAccent: true, relief: 0.12, seed: 5 }),
  ets: facade,
  // The lit facade with its pixel trees and the name, without the sky on the left.
  cegep: () =>
    photo({ file: "cegep-reference.png", crop: { left: 112, top: 0, width: 163, height: 170 }, width: 163, edge: 0.5, light: 1.6, relief: 0.1, seed: 7 }),
};

async function main() {
  mkdirSync(OUT, { recursive: true });
  const only = process.argv.slice(2);
  for (const [name, make] of Object.entries(shapes)) {
    if (only.length && !only.includes(name)) continue;
    const points = await make();
    if (points.length !== COUNT) throw new Error(`${name}: ${points.length} points`);
    const bin = encode(points);
    writeFileSync(join(OUT, `${name}.bin`), bin);
    await preview(points, join(OUT, `${name}.webp`));
    console.log(`${name}: ${COUNT} points, ${(bin.length / 1024).toFixed(0)} KB`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
