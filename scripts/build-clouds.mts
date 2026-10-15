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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
/** The transform normalize applies to these points, so other positions (a city, a face) can follow it. */
function normalizer(points: Point[]) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const half = Math.max(maxX - minX, maxY - minY) / 2 || 1;
  return { map: (x: number, y: number): [number, number] => [(x - cx) / half, (y - cy) / half], half };
}

function normalize(points: Point[]): Point[] {
  const { map } = normalizer(points);
  return points.map((p) => {
    const [x, y] = map(p.x, p.y);
    return { ...p, x, y, z: Math.max(-1, Math.min(1, p.z)) };
  });
}

/** Ellipse in shape coordinates (centre and radii, −1..1). */
interface Ellipse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/**
 * Facts about the shapes the page needs besides the points, written to public/clouds/meta.json:
 * where the map's cities are, and the part of the portrait to keep free of drifting dust.
 */
const meta: Record<string, { markers?: Record<string, [number, number]>; route?: [number, number][]; calm?: Ellipse }> = {};

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

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Letters redrawn crisp over a sign that the photo renders too blurry to read. */
interface Label {
  /** One entry per line: its text and its width as a share of the box. */
  lines: { text: string; width: number }[];
  /** Box in source pixels, before the crop. */
  box: Box;
  /** Share of all points spent on the letters. */
  share: number;
  /** Grows the box around its centre so small letters still read on screen. */
  grow?: number;
  /** Slant in degrees, like the ÉTS logo. */
  slant?: number;
  /** Font weight (default 800); lighter keeps small letters open. */
  weight?: number;
}

interface PhotoOptions {
  file: string;
  /** Crop in source pixels, before resizing. */
  crop?: Box;
  width: number;
  /**
   * Background to leave out, found by flood fill from the image border (or its top edge only).
   * Global: pixels whose luminance is close to the corners'. Step: pixels close in colour to the
   * neighbour the fill came from, which follows a sky gradient up to the subject's outline.
   */
  mask?: { tolerance: number; from?: "border" | "top"; step?: boolean };
  /** Weight of edges and of brightness in the sampling; gamma sharpens the brightness (default 2). */
  edge: number;
  light: number;
  gamma?: number;
  /** Brightness as luma (default) or as the brightest channel, for coloured lights such as blue LEDs. */
  brightness?: "luma" | "max";
  /**
   * A region drawn with more points and local contrast (CLAHE), such as a face, so its features
   * read: an ellipse (0..1 of the image) with its own weights, blended in over a soft edge.
   */
  focus?: { cx: number; cy: number; rx: number; ry: number; edge: number; light: number; gamma: number; boost: number };
  /** Bright subject on a light background: sample the subject's dark parts too. */
  invert?: boolean;
  /** Which pixels carry the accent, from their colour (0..255) and position (0..1). */
  accent?: (r: number, g: number, b: number, u: number, v: number) => boolean;
  /** Extra weight of accent pixels, so a small sign still gets enough points. */
  accentWeight?: number;
  label?: Label;
  /** Depth from luminance. */
  relief: number;
  /** Depth from a half-ellipsoid (centre and radii in 0..1 of the image), so a head has volume. */
  dome?: { cx: number; cy: number; rx: number; ry: number; depth: number };
  /** Region (0..1 of the image) where the page keeps dust off, recorded in meta under `name`. */
  calm?: { cx: number; cy: number; rx: number; ry: number };
  name?: string;
  seed: number;
}

/** Saturated warm pixels (yellow, orange): the safety colours of Spot. */
const warm = (r: number, g: number, b: number) => Math.max(r, g, b) - Math.min(r, g, b) > 90 && r > 150 && b < 120 && g > 60;

const FONT = "Inter Display, Inter, FreeSans, DejaVu Sans, Arial, sans-serif";

/** Lit pixels of one line of bold text, cropped to the ink. */
async function inkOf(text: string, weight: number): Promise<{ w: number; h: number; lit: number[] }> {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${180 * text.length + 200}" height="420"><text x="100" y="310" fill="#fff" font-family="${FONT}" font-weight="${weight}" font-size="260">${escaped}</text></svg>`;
  const { data, info } = await sharp(Buffer.from(svg)).flatten({ background: "#000" }).greyscale().trim({ threshold: 10 }).raw().toBuffer({ resolveWithObject: true });
  const lit: number[] = [];
  for (let k = 0; k < info.width * info.height; k++) if (data[k] > 128) lit.push(k);
  return { w: info.width, h: info.height, lit };
}

/** Points of a label in source pixels: each line's ink stretched to its slot in the box. */
async function labelPoints(label: Label, count: number, rand: () => number): Promise<[number, number][]> {
  const grow = label.grow ?? 1;
  const { left, top, width, height } = label.box;
  const cx = left + width / 2, cy = top + height / 2;
  const lineH = height / label.lines.length;
  const inks = await Promise.all(label.lines.map((l) => inkOf(l.text, label.weight ?? 800)));
  // Points per line in proportion to the ink each line covers once stretched.
  const area = inks.map((ink, i) => (ink.lit.length / (ink.w * ink.h)) * label.lines[i].width * width * lineH);
  const sum = area.reduce((s, v) => s + v, 0);
  const tan = Math.tan(((label.slant ?? 0) * Math.PI) / 180);
  const out: [number, number][] = [];
  inks.forEach((ink, i) => {
    const n = i === inks.length - 1 ? count - out.length : Math.round((count * area[i]) / sum);
    for (let j = 0; j < n; j++) {
      const k = ink.lit[Math.floor(((j + rand()) / n) * ink.lit.length)];
      const u = ((k % ink.w) + rand()) / ink.w;
      const v = (Math.floor(k / ink.w) + rand()) / ink.h;
      let x = left + u * label.lines[i].width * width;
      const y = top + (i + 0.08 + v * 0.84) * lineH;
      x += tan * (cy - y);
      out.push([cx + (x - cx) * grow, cy + (y - cy) * grow]);
    }
  });
  return out;
}

async function photo(o: PhotoOptions): Promise<Point[]> {
  let img = sharp(join(SRC, o.file)).rotate();
  if (o.crop) img = img.extract(o.crop);
  img = img.resize({ width: o.width }).removeAlpha();
  const { data, info } = await img.clone().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const brightness = (buf: Buffer, k: number) => {
    const r = buf[k * 3], g = buf[k * 3 + 1], b = buf[k * 3 + 2];
    return (o.brightness === "max" ? Math.max(r, g, b) : 0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  };
  const lum = new Float32Array(w * h);
  const accent = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) {
    lum[k] = brightness(data, k);
    accent[k] = o.accent?.(data[k * 3], data[k * 3 + 1], data[k * 3 + 2], (k % w) / w, Math.floor(k / w) / h) ? 1 : 0;
  }
  // Local contrast for the focus region only.
  const contrasted = o.focus
    ? (await img.clahe({ width: Math.round(w / 8), height: Math.round(w / 8), maxSlope: 3 }).raw().toBuffer())
    : data;
  const lumC = new Float32Array(w * h);
  for (let k = 0; k < w * h; k++) lumC[k] = brightness(contrasted, k);

  // Background: the region that touches the border (flood fill), so light areas inside the
  // subject (a forehead, teeth, a white shirt) are kept.
  const background = new Uint8Array(w * h);
  if (o.mask) {
    const { tolerance, from = "border", step = false } = o.mask;
    const corners = (from === "top" ? [0, w - 1] : [0, w - 1, (h - 1) * w, h * w - 1]).map((k) => lum[k]).sort((a, b) => a - b);
    const bg = corners.length === 2 ? (corners[0] + corners[1]) / 2 : (corners[1] + corners[2]) / 2;
    const colourGap = (a: number, b: number) =>
      Math.max(Math.abs(data[a * 3] - data[b * 3]), Math.abs(data[a * 3 + 1] - data[b * 3 + 1]), Math.abs(data[a * 3 + 2] - data[b * 3 + 2])) / 255;
    const near = (k: number, prev: number) => (step ? prev < 0 || colourGap(k, prev) <= tolerance : Math.abs(lum[k] - bg) <= tolerance);
    // Pairs of (pixel, pixel the fill came from).
    const queue: number[] = [];
    for (let x = 0; x < w; x++) {
      queue.push(x, -1);
      if (from === "border") queue.push((h - 1) * w + x, -1);
    }
    if (from === "border") for (let y = 0; y < h; y++) queue.push(y * w, -1, y * w + w - 1, -1);
    while (queue.length) {
      const prev = queue.pop()!;
      const k = queue.pop()!;
      if (background[k] || !near(k, prev)) continue;
      background[k] = 1;
      const x = k % w;
      if (x > 0) queue.push(k - 1, k);
      if (x < w - 1) queue.push(k + 1, k);
      if (k >= w) queue.push(k - w, k);
      if (k < w * (h - 1)) queue.push(k + w, k);
    }
  }

  // Source pixels → this image's pixels.
  const crop = o.crop ?? { left: 0, top: 0, width: w, height: h };
  const scale = w / crop.width;
  const toImage = (sx: number, sy: number): [number, number] => [(sx - crop.left) * scale, (sy - crop.top) * scale];
  // The photo's own letters give way to the redrawn ones.
  let hole = { x0: 0, y0: 0, x1: -1, y1: -1 };
  if (o.label) {
    const g = (o.label.grow ?? 1) * 1.04;
    const { left, top, width, height } = o.label.box;
    const [x0, y0] = toImage(left + (width * (1 - g)) / 2, top + (height * (1 - g)) / 2);
    const [x1, y1] = toImage(left + (width * (1 + g)) / 2, top + (height * (1 + g)) / 2);
    hole = { x0, y0, x1, y1 };
  }

  const weight = new Float32Array(w * h);
  // How much of the focus region each pixel is in, 0..1.
  const inFocus = new Float32Array(w * h);
  let total = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const k = y * w + x;
      if (background[k] || (x >= hole.x0 && x <= hole.x1 && y >= hole.y0 && y <= hole.y1)) continue;
      const sobel = (L: Float32Array) => {
        const at = (dx: number, dy: number) => L[k + dy * w + dx];
        const gx = -at(-1, -1) - 2 * at(-1, 0) - at(-1, 1) + at(1, -1) + 2 * at(1, 0) + at(1, 1);
        const gy = -at(-1, -1) - 2 * at(0, -1) - at(1, -1) + at(-1, 1) + 2 * at(0, 1) + at(1, 1);
        return Math.min(1, Math.hypot(gx, gy) / 2);
      };
      const tone = o.invert ? 1 - lum[k] * 0.6 : lum[k];
      let v = o.edge * sobel(lum) + o.light * tone ** (o.gamma ?? 2) + 0.02;
      if (o.focus) {
        const f = o.focus;
        const d = Math.hypot((x / w - f.cx) / f.rx, (y / h - f.cy) / f.ry);
        const m = Math.min(1, Math.max(0, (1.15 - d) / 0.3));
        inFocus[k] = m;
        if (m > 0) v += m * ((f.edge * sobel(lumC) + f.light * lumC[k] ** f.gamma + 0.02) * f.boost - v);
      }
      v *= accent[k] ? (o.accentWeight ?? 1) : 1;
      weight[k] = v;
      total += v;
    }
  }
  const rand = rng(o.seed);
  const letters = o.label ? Math.round(COUNT * o.label.share) : 0;
  const samples = COUNT - letters;
  // Cumulative table, then binary search per sample.
  const cdf = new Float64Array(w * h);
  let acc = 0;
  for (let k = 0; k < w * h; k++) cdf[k] = acc += weight[k] / total;
  const points: Point[] = [];
  for (let n = 0; n < samples; n++) {
    // Stratified: one sample per slice of the CDF, so the points spread evenly (less clumping).
    const r = (n + rand()) / samples;
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const x = lo % w, y = Math.floor(lo / w);
    let z = (lum[lo] - 0.5) * o.relief * 2 + (rand() - 0.5) * 0.04;
    if (o.dome) {
      const { cx, cy, rx, ry, depth } = o.dome;
      const d = 1 - ((x / w - cx) / rx) ** 2 - ((y / h - cy) / ry) ** 2;
      z += depth * (Math.sqrt(Math.max(0, d)) - 0.5);
    }
    points.push({
      x: x + rand() - 0.5,
      y: -(y + rand() - 0.5),
      z,
      i: 70 + (lum[lo] + (lumC[lo] - lum[lo]) * inFocus[lo]) * 185,
      accent: accent[lo] === 1 && rand() < 0.6,
    });
  }
  if (o.label) {
    for (const [sx, sy] of await labelPoints(o.label, letters, rand)) {
      const [x, y] = toImage(sx, sy);
      points.push({ x, y: -y, z: 0.05 + (rand() - 0.5) * 0.02, i: 255, accent: true });
    }
  }
  if (o.calm && o.name) {
    const { map, half } = normalizer(points);
    const [cx, cy] = map(o.calm.cx * w, -o.calm.cy * h);
    meta[o.name] = { ...meta[o.name], calm: { cx, cy, rx: (o.calm.rx * w) / half, ry: (o.calm.ry * h) / half } };
  }
  // Samples come out in reading order: shuffle so every prefix covers the whole picture.
  return normalize(shuffle(points, rand));
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
  add(alongPath(route, 3000, rand, 0.025), 255, true, 0.1);
  for (const end of [route[0], route[route.length - 1]]) {
    add(Array.from({ length: 300 }, () => {
      const a = rand() * Math.PI * 2, r = 0.2 * Math.sqrt(rand());
      return [end[0] + Math.cos(a) * r, end[1] + Math.sin(a) * r] as [number, number];
    }), 255, true, 0.15);
  }
  // The page labels both cities and draws the direction of the route over the cloud.
  const anchors = route.map((p) => [...p] as [number, number]);
  const points = finish(pts, rand, anchors);
  meta.quebec = { markers: { "sept-iles": anchors[0], montreal: anchors[anchors.length - 1] }, route: anchors };
  return points;
}

/**
 * Trims or pads to exactly COUNT points, then shuffles so every prefix is an even sample.
 * `anchors` (positions in the same units as the points) are moved with the points, in place.
 */
function finish(pts: Point[], rand: () => number, anchors?: [number, number][]): Point[] {
  shuffle(pts, rand);
  while (pts.length < COUNT) {
    const p = pts[Math.floor(rand() * pts.length)];
    pts.push({ ...p, x: p.x + (rand() - 0.5) * 0.004, y: p.y + (rand() - 0.5) * 0.004 });
  }
  const kept = shuffle(pts.slice(0, COUNT), rand);
  if (anchors) {
    const { map } = normalizer(kept);
    anchors.forEach((a, k) => (anchors[k] = map(...a)));
  }
  return normalize(kept);
}

/* ---------- Shapes ---------- */

const shapes: Record<string, () => Promise<Point[]> | Point[]> = {
  // Felipe's head and shoulders (portrait 3378 × 5067), the face drawn denser and in local
  // contrast so its features read.
  face: () =>
    photo({
      file: "portrait.jpg",
      crop: { left: 950, top: 40, width: 2100, height: 2150 },
      width: 420,
      mask: { tolerance: 0.1 },
      edge: 3,
      light: 1.2,
      // Gentle tone curve and shallow relief: the eyes keep their points (no dark hollows) and
      // the features do not shift against each other when the cloud turns slightly.
      focus: { cx: 0.5, cy: 0.46, rx: 0.24, ry: 0.3, edge: 0.5, light: 2, gamma: 3, boost: 3 },
      relief: 0.06,
      dome: { cx: 0.5, cy: 0.42, rx: 0.25, ry: 0.34, depth: 0.35 },
      calm: { cx: 0.5, cy: 0.42, rx: 0.27, ry: 0.36 },
      name: "face",
      seed: 3,
    }),
  quebec,
  phone,
  board,
  spot: () =>
    photo({
      file: "spot-reference.png",
      width: 520,
      mask: { tolerance: 0.06 },
      edge: 1.4,
      light: 0.25,
      invert: true,
      accent: warm,
      relief: 0.12,
      seed: 5,
    }),
  // ÉTS, pavillon A at dusk: the round tower and its sign, without the sky and the street.
  ets: () =>
    photo({
      file: "ets-photo.png",
      crop: { left: 0, top: 20, width: 538, height: 268 },
      width: 538,
      mask: { tolerance: 0.035, from: "top", step: true },
      edge: 0.8,
      light: 2,
      gamma: 2.5,
      label: { lines: [{ text: "ÉTS", width: 1 }], box: { left: 243, top: 79, width: 58, height: 21 }, share: 0.07, grow: 1.35, slant: 8 },
      relief: 0.1,
      seed: 11,
    }),
  // Cégep de Sept-Îles: the LED facade and its name, no sky.
  cegep: () =>
    photo({
      file: "cegep-photo.png",
      crop: { left: 860, top: 100, width: 1188, height: 1030 },
      width: 640,
      mask: { tolerance: 0.05, from: "top", step: true },
      edge: 0.4,
      light: 2,
      gamma: 3,
      brightness: "max",
      label: {
        lines: [
          { text: "CÉGEP", width: 0.64 },
          { text: "DE SEPT-ÎLES", width: 1 },
        ],
        box: { left: 965, top: 848, width: 295, height: 100 },
        share: 0.09,
        grow: 1.6,
        weight: 700,
      },
      relief: 0.1,
      seed: 7,
    }),
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
  // Merged, so building one shape keeps the others' entries. Bundled with the page code.
  const file = join("src", "components", "scan", "shape-meta.json");
  const previous = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
  const round = (v: unknown): unknown =>
    typeof v === "number" ? Math.round(v * 1e4) / 1e4 : Array.isArray(v) ? v.map(round) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, round(x)])) : v;
  writeFileSync(file, JSON.stringify(round({ ...previous, ...meta }), null, 2) + "\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
