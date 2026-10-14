/**
 * Procedural geometry for the sculpture: a bundle of fine filaments braided along a
 * torus-knot spine, each one breathing with low-frequency noise.
 *
 * In the creative mode the same filaments reorganize into four smaller knots, one per
 * domain. Each domain has its own knot type, so the four clusters read as distinct
 * systems made from one material.
 *
 * Pure TypeScript, no Three.js import: the same code feeds the WebGL scene and the
 * static SVG fallback, so both always show the same object.
 */

export type Vec3 = [number, number, number];

export interface SculptureParams {
  filaments: number;
  /** Points per filament. */
  samples: number;
  /** Torus knot winding numbers. */
  p: number;
  q: number;
  /** Size of the knot. */
  radius: number;
  /** Average distance of filaments from the spine. */
  spread: number;
  /** Turns each filament makes around the spine over one loop. */
  twist: number;
  seed: number;
}

export const defaultParams: SculptureParams = {
  filaments: 140,
  samples: 220,
  p: 2,
  q: 3,
  radius: 1,
  spread: 0.2,
  twist: 3,
  seed: 7,
};

export interface ClusterSpec {
  p: number;
  q: number;
  radius: number;
  center: Vec3;
}

/**
 * Creative-mode composition, in the order software, robotics, embedded, data.
 * Trefoil, (3,4), cinquefoil and (3,5) knots: four systems, one material.
 */
export const clusterSpecs: ClusterSpec[] = [
  { p: 2, q: 3, radius: 0.5, center: [-1.3, 0.62, 0.1] },
  { p: 3, q: 4, radius: 0.5, center: [1.3, 0.62, -0.15] },
  { p: 2, q: 5, radius: 0.5, center: [-1.3, -0.72, -0.1] },
  { p: 3, q: 5, radius: 0.5, center: [1.3, -0.72, 0.15] },
];

/** On-screen radius of a cluster, as a multiple of its knot radius (filaments spread past the spine). */
export const CLUSTER_REACH = 1.25;

/** Screen rectangle in CSS px, y down; right and bottom are coordinates, not insets. */
export interface ScreenRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ClusterFitOptions {
  /** On-screen rotation of the composition, radians, counter-clockwise. */
  rotation: number;
  /** Names sit under every knot; otherwise above the upper row and under the lower one. */
  labelsBelow: boolean;
  /** Room a name takes past its knot, px (0 while names are hidden). */
  labelHeight: number;
  /** Half width kept around each knot centre for its name, px. */
  labelHalfWidth: number;
  /** Largest scale, px per model unit. */
  maxScale: number;
}

export interface ClusterFit {
  /** px per model unit. */
  scale: number;
  /** Screen position of the composition's origin, px. */
  x: number;
  y: number;
}

/**
 * Largest scale at which the four clusters and their names fit in `rect`, and the origin
 * that centres them there. Names are anchored at 0.95 of the cluster radius, as the
 * creative interface places them.
 */
export function fitClusters(rect: ScreenRect, o: ClusterFitOptions): ClusterFit {
  const cos = Math.cos(o.rotation);
  const sin = Math.sin(o.rotation);
  const pts = clusterSpecs.map(({ center: [x, y], radius }) => ({
    x: x * cos - y * sin,
    y: -(x * sin + y * cos),
    r: radius * CLUSTER_REACH,
  }));
  const midY = pts.reduce((s, p) => s + p.y, 0) / pts.length;

  const bounds = (s: number) => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of pts) {
      const r = p.r * s;
      const half = Math.max(r, o.labelHalfWidth);
      const named = Math.max(r, r * 0.95 + o.labelHeight);
      const above = !o.labelsBelow && p.y < midY;
      minX = Math.min(minX, p.x * s - half);
      maxX = Math.max(maxX, p.x * s + half);
      minY = Math.min(minY, p.y * s - (above ? named : r));
      maxY = Math.max(maxY, p.y * s + (above ? r : named));
    }
    return { minX, maxX, minY, maxY };
  };

  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;
  const fits = (s: number) => {
    const b = bounds(s);
    return b.maxX - b.minX <= w && b.maxY - b.minY <= h;
  };
  // Extents grow monotonically with the scale, so bisection finds the largest one that fits.
  let lo = 0;
  let hi = o.maxScale;
  if (fits(hi)) lo = hi;
  else {
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) lo = mid;
      else hi = mid;
    }
  }
  const b = bounds(lo);
  return {
    scale: lo,
    x: (rect.left + rect.right - b.minX - b.maxX) / 2,
    y: (rect.top + rect.bottom - b.minY - b.maxY) / 2,
  };
}

/** Small deterministic PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Point on a (p, q) torus knot, slightly flattened so the form reads as sculpture, not a ring. */
export function knot(t: number, { p, q, radius }: { p: number; q: number; radius: number }): Vec3 {
  const r = radius * (0.62 + 0.28 * Math.cos(q * t));
  return [r * Math.cos(p * t), r * Math.sin(p * t), radius * 0.42 * Math.sin(q * t)];
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function normalize(a: Vec3): Vec3 {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
}

export interface Frames {
  /** Flat arrays, 3 floats per sample. */
  pts: Float32Array;
  normals: Float32Array;
  binormals: Float32Array;
}

/**
 * Rotation-minimizing frames along a closed knot (parallel transport). The leftover
 * holonomy angle is unwound evenly so filaments close without a seam.
 */
export function spineFrames(samples: number, spec: { p: number; q: number; radius: number }, center: Vec3 = [0, 0, 0]): Frames {
  const pts: Vec3[] = [];
  const tangents: Vec3[] = [];
  for (let i = 0; i < samples; i++) pts.push(knot((i / samples) * Math.PI * 2, spec));
  for (let i = 0; i < samples; i++) {
    tangents.push(normalize(sub(pts[(i + 1) % samples], pts[(i - 1 + samples) % samples])));
  }
  const transported: Vec3[] = [];
  const n0 = normalize(cross(tangents[0], [0, 0, 1]));
  let n = n0;
  for (let i = 0; i <= samples; i++) {
    const tg = tangents[i % samples];
    const d = dot(n, tg);
    n = normalize([n[0] - d * tg[0], n[1] - d * tg[1], n[2] - d * tg[2]]);
    transported.push(n);
  }
  const end = transported[samples];
  const b0 = cross(tangents[0], n0);
  const holonomy = Math.atan2(dot(end, b0), dot(end, n0));

  const out: Frames = {
    pts: new Float32Array(samples * 3),
    normals: new Float32Array(samples * 3),
    binormals: new Float32Array(samples * 3),
  };
  for (let i = 0; i < samples; i++) {
    const tg = tangents[i];
    const nt = transported[i];
    const bt = cross(tg, nt);
    const a = (-holonomy * i) / samples;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const nn: Vec3 = [nt[0] * ca + bt[0] * sa, nt[1] * ca + bt[1] * sa, nt[2] * ca + bt[2] * sa];
    const bn = cross(tg, nn);
    out.pts.set([pts[i][0] + center[0], pts[i][1] + center[1], pts[i][2] + center[2]], i * 3);
    out.normals.set(nn, i * 3);
    out.binormals.set(bn, i * 3);
  }
  return out;
}

const OCTAVES = [1, 2, 3, 5];

export interface FrameState {
  time: number;
  /** 0 = editorial knot, 1 = four domain clusters. */
  morph: number;
  /** Optional point (model space) that gently pushes filaments away, e.g. under the cursor. */
  repel?: { x: number; y: number; z: number; radius: number; strength: number } | null;
}

/**
 * Precomputed model. All trig that depends only on the sample index is tabulated once,
 * so a frame costs two trig calls per vertex.
 */
export class SculptureModel {
  readonly params: SculptureParams;
  readonly vertexCount: number;
  /** Per filament: domain index 0..3. */
  readonly domain: Uint8Array;
  /** Per filament: random 0..1 (tone, pulse phase, morph delay). */
  readonly seed: Float32Array;

  private readonly main: Frames;
  private readonly clusters: Frames[];
  private readonly angle: Float32Array;
  private readonly offset: Float32Array;
  private readonly delay: Float32Array;
  /** filaments × octaves: amplitude (normalized), phase, speed. */
  private readonly octAmp: Float32Array;
  private readonly octPhase: Float32Array;
  private readonly octSpeed: Float32Array;
  /** samples × octaves: sin/cos of (f · t). */
  private readonly sinFT: Float32Array;
  private readonly cosFT: Float32Array;
  /** samples: sin/cos of (q · t) for the swell, and t itself. */
  private readonly sinQT: Float32Array;
  private readonly cosQT: Float32Array;
  private readonly tAt: Float32Array;

  constructor(params: SculptureParams = defaultParams) {
    this.params = params;
    const { filaments: F, samples: S } = params;
    this.vertexCount = F * S;
    this.main = spineFrames(S, params);
    this.clusters = clusterSpecs.map((c) => spineFrames(S, c, c.center));

    const r = rng(params.seed);
    this.domain = new Uint8Array(F);
    this.seed = new Float32Array(F);
    this.angle = new Float32Array(F);
    this.offset = new Float32Array(F);
    this.delay = new Float32Array(F);
    const K = OCTAVES.length;
    this.octAmp = new Float32Array(F * K);
    this.octPhase = new Float32Array(F * K);
    this.octSpeed = new Float32Array(F * K);
    const norm = OCTAVES.reduce((s, f) => s + 1 / f, 0);
    for (let f = 0; f < F; f++) {
      this.domain[f] = f % 4;
      this.angle[f] = r() * Math.PI * 2;
      this.offset[f] = 0.15 + Math.pow(r(), 1.6) * 1.1;
      this.seed[f] = r();
      this.delay[f] = r();
      for (let k = 0; k < K; k++) {
        this.octAmp[f * K + k] = 1 / OCTAVES[k] / norm;
        this.octPhase[f * K + k] = r() * Math.PI * 2;
        this.octSpeed[f * K + k] = 0.3 + OCTAVES[k] * 0.07;
      }
    }

    this.sinFT = new Float32Array(S * K);
    this.cosFT = new Float32Array(S * K);
    this.sinQT = new Float32Array(S);
    this.cosQT = new Float32Array(S);
    this.tAt = new Float32Array(S);
    for (let i = 0; i < S; i++) {
      const t = (i / S) * Math.PI * 2;
      this.tAt[i] = t;
      this.sinQT[i] = Math.sin(params.q * t);
      this.cosQT[i] = Math.cos(params.q * t);
      for (let k = 0; k < K; k++) {
        this.sinFT[i * K + k] = Math.sin(OCTAVES[k] * t);
        this.cosFT[i * K + k] = Math.cos(OCTAVES[k] * t);
      }
    }
  }

  /** Write every vertex position for `state` into `out` (vertexCount × 3 floats). */
  write(out: Float32Array, state: FrameState) {
    const { filaments: F, samples: S, spread, twist } = this.params;
    const K = OCTAVES.length;
    const { time, morph } = state;
    const repel = state.repel ?? null;
    const swellSin = Math.sin(time * 0.2);
    const swellCos = Math.cos(time * 0.2);
    const cb = new Float32Array(K);
    const sb = new Float32Array(K);
    let o = 0;

    for (let f = 0; f < F; f++) {
      // Per-filament octave offsets for this frame: sin(ft + b) = sin(ft)cos(b) + cos(ft)sin(b).
      for (let k = 0; k < K; k++) {
        const b = this.octPhase[f * K + k] + time * this.octSpeed[f * K + k];
        cb[k] = Math.cos(b) * this.octAmp[f * K + k];
        sb[k] = Math.sin(b) * this.octAmp[f * K + k];
      }
      // Staggered morph: each filament leaves and lands at its own moment.
      let m = (morph - this.delay[f] * 0.35) / 0.65;
      m = m < 0 ? 0 : m > 1 ? 1 : m;
      m = m * m * (3 - 2 * m);
      const lift = Math.sin(Math.PI * m) * 0.45;
      const needMain = m < 1;
      const needCluster = m > 0;
      const cf = this.clusters[this.domain[f]];
      const angle = this.angle[f];
      const offset = this.offset[f];

      for (let i = 0; i < S; i++) {
        let n = 0;
        for (let k = 0; k < K; k++) n += this.sinFT[i * K + k] * cb[k] + this.cosFT[i * K + k] * sb[k];
        const t = this.tAt[i];
        // sin(qt + 0.2·time)
        const sq = this.sinQT[i] * swellCos + this.cosQT[i] * swellSin;
        const swell = 1 + 0.45 * sq + 0.3 * n;
        const a = angle + twist * t + 0.5 * n + time * 0.05;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const j = i * 3;

        let x = 0;
        let y = 0;
        let z = 0;
        if (needMain) {
          const P = this.main.pts;
          const N = this.main.normals;
          const B = this.main.binormals;
          const rad = spread * offset * swell;
          x = P[j] + (N[j] * ca + B[j] * sa) * rad;
          y = P[j + 1] + (N[j + 1] * ca + B[j + 1] * sa) * rad;
          z = P[j + 2] + (N[j + 2] * ca + B[j + 2] * sa) * rad;
        }
        if (needCluster) {
          const P = cf.pts;
          const N = cf.normals;
          const B = cf.binormals;
          const rad = spread * 0.55 * offset * swell;
          const cx = P[j] + (N[j] * ca + B[j] * sa) * rad;
          const cy = P[j + 1] + (N[j + 1] * ca + B[j + 1] * sa) * rad;
          const cz = P[j + 2] + (N[j + 2] * ca + B[j + 2] * sa) * rad;
          if (needMain) {
            x += (cx - x) * m;
            y += (cy - y) * m;
            z += (cz - z) * m;
            // Swirl outward mid-flight so the reorganization reads as motion, not a crossfade.
            z += lift * Math.sin(t * 2 + angle);
            x += lift * 0.35 * Math.cos(t * 3 + angle);
          } else {
            x = cx;
            y = cy;
            z = cz;
          }
        }

        if (repel) {
          const dx = x - repel.x;
          const dy = y - repel.y;
          const d2 = dx * dx + dy * dy;
          const r2 = repel.radius * repel.radius;
          if (d2 < r2) {
            const k = (1 - d2 / r2) * repel.strength;
            const d = Math.sqrt(d2) || 1;
            x += (dx / d) * k;
            y += (dy / d) * k;
          }
        }

        out[o++] = x;
        out[o++] = y;
        out[o++] = z;
      }
    }
  }
}

/** Convenience: full geometry at rest, as arrays of points per filament. */
export function buildStatic(params: SculptureParams = defaultParams): Vec3[][] {
  const model = new SculptureModel(params);
  const buf = new Float32Array(model.vertexCount * 3);
  model.write(buf, { time: 0, morph: 0 });
  const result: Vec3[][] = [];
  for (let f = 0; f < params.filaments; f++) {
    const line: Vec3[] = [];
    for (let i = 0; i < params.samples; i++) {
      const o = (f * params.samples + i) * 3;
      line.push([buf[o], buf[o + 1], buf[o + 2]]);
    }
    result.push(line);
  }
  return result;
}
