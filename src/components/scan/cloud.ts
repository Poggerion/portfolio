import * as THREE from "three";

/** Points in the cloud. Phones and small screens draw the first part only. */
export const POINTS = { full: 16384, light: 6144 };

/** One shape: positions in −1..1 on its longest side, intensity 0..1, accent 0 or 1, per point. */
export interface Shape {
  position: Float32Array;
  intensity: Float32Array;
  accent: Float32Array;
}

/** Small deterministic PRNG (mulberry32), so the cloud is the same on every visit. */
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

/** Point on a (2, 3) torus knot, flattened so it reads as a ball of yarn rather than a ring. */
function knot(t: number): [number, number, number] {
  const r = 0.62 + 0.28 * Math.cos(3 * t);
  return [r * Math.cos(2 * t), r * Math.sin(2 * t), 0.42 * Math.sin(3 * t)];
}

/** The ball of yarn: many strands wound around the knot, each strand a line of points. */
export function buildYarn(count = POINTS.full): Shape {
  const rand = rng(7);
  const strands = 140;
  const position = new Float32Array(count * 3);
  const intensity = new Float32Array(count);
  const accent = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const sRand = rng((i % strands) + 1);
    const phase = sRand() * Math.PI * 2;
    const spread = 0.015 + 0.11 * Math.sqrt(sRand());
    const twist = 2 + Math.floor(sRand() * 3);
    const t = rand() * Math.PI * 2;
    const p = knot(t);
    const q = knot(t + 0.001);
    const tan = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
    const tl = Math.hypot(tan[0], tan[1], tan[2]) || 1;
    for (let k = 0; k < 3; k++) tan[k] /= tl;
    const nl = Math.hypot(tan[1], tan[0]) || 1;
    const n = [tan[1] / nl, -tan[0] / nl, 0];
    const b = [tan[1] * n[2] - tan[2] * n[1], tan[2] * n[0] - tan[0] * n[2], tan[0] * n[1] - tan[1] * n[0]];
    const a = phase + twist * t;
    const r = spread * (0.85 + 0.3 * rand());
    for (let k = 0; k < 3; k++) {
      position[i * 3 + k] = (p[k] + (n[k] * Math.cos(a) + b[k] * Math.sin(a)) * r + (rand() - 0.5) * 0.006) / 1.05;
    }
    intensity[i] = 0.35 + 0.65 * rand();
    accent[i] = rand() < 0.008 ? 1 : 0;
  }
  return { position, intensity, accent };
}

/** One point in this many is dust: faint, drifting around the shape, never an accent. */
export const DUST_EVERY = 20;

/** How far dust drifts from where it was placed, on each axis, in shape units (see the shader). */
export const DUST_DRIFT = 0.05;

/** Standard normal sample (Box–Muller). */
function gauss(rand: () => number): number {
  return Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
}

/** Ellipse in shape coordinates: centre and radii. */
export interface Ellipse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/**
 * Dust kept out of a calm region lands in a ring around it: from far enough that its drift never
 * brings it back in, to this many radii further, spread evenly so it does not outline the region.
 */
const CALM_RING_WIDTH = 0.7;

/**
 * Light ambient noise: every DUST_EVERY-th point leaves the shape and floats nearby, faint, so
 * the cloud has some air around it while the shape stays sharp. Most dust stays close; a little
 * drifts further out. `calm`: a region dust stays out of (a face, the contact signature).
 */
export function withDust(shape: Shape, seed: number, calm?: Ellipse): Shape {
  const rand = rng(seed);
  const position = shape.position.slice();
  const intensity = shape.intensity.slice();
  const accent = shape.accent.slice();
  for (let i = 0; i < intensity.length; i += DUST_EVERY) {
    const spread = rand() < 0.75 ? 0.05 + 0.1 * rand() : 0.2 + 0.2 * rand();
    for (let k = 0; k < 3; k++) position[i * 3 + k] += gauss(rand) * spread;
    if (calm) {
      // Moved out along its own direction from the centre, to an even spread over the ring.
      let u = (position[i * 3] - calm.cx) / calm.rx;
      let v = (position[i * 3 + 1] - calm.cy) / calm.ry;
      let r = Math.hypot(u, v);
      const inner = 1 + (1.5 * DUST_DRIFT) / Math.min(calm.rx, calm.ry);
      const outer = inner + CALM_RING_WIDTH;
      if (r < inner) {
        if (r < 1e-6) {
          const a = rand() * Math.PI * 2;
          [u, v, r] = [Math.cos(a), Math.sin(a), 1];
        }
        const out = Math.sqrt(inner * inner + rand() * (outer * outer - inner * inner)) / r;
        position[i * 3] = calm.cx + u * out * calm.rx;
        position[i * 3 + 1] = calm.cy + v * out * calm.ry;
      }
    }
    intensity[i] = 0.18 + 0.27 * rand();
    accent[i] = 0;
  }
  return { position, intensity, accent };
}

/** Decodes a .bin from scripts/build-clouds.mts: Int16 x, y, z, Uint8 intensity, Uint8 accent. */
export function decodeShape(buffer: ArrayBuffer): Shape {
  const view = new DataView(buffer);
  const count = buffer.byteLength / 8;
  const position = new Float32Array(count * 3);
  const intensity = new Float32Array(count);
  const accent = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const o = i * 8;
    position[i * 3] = view.getInt16(o, true) / 32767;
    position[i * 3 + 1] = view.getInt16(o + 2, true) / 32767;
    position[i * 3 + 2] = view.getInt16(o + 4, true) / 32767;
    intensity[i] = view.getUint8(o + 6) / 255;
    accent[i] = view.getUint8(o + 7);
  }
  return { position, intensity, accent };
}

/**
 * Samples the points of a line of text drawn in the page's display font. Lines after the first
 * carry the accent, like the italic half of the contact title.
 */
export function textShape(lines: string[], font: string, count = POINTS.full): Shape {
  const w = 1200;
  const h = 300 * lines.length;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((line, i) => {
    ctx.font = `${i ? "italic " : ""}220px ${font}`;
    ctx.fillText(line, w / 2, 150 + i * 280, w - 40);
  });
  const data = ctx.getImageData(0, 0, w, h).data;
  const lit: number[] = [];
  for (let k = 0; k < w * h; k += 2) if (data[k * 4 + 3] > 128) lit.push(k);
  const rand = rng(13);
  const position = new Float32Array(count * 3);
  const intensity = new Float32Array(count);
  const accent = new Float32Array(count);
  const half = Math.max(w, h) / 2;
  for (let i = 0; i < count; i++) {
    const k = lit.length ? lit[Math.floor(rand() * lit.length)] : 0;
    const x = (k % w) + rand();
    const y = Math.floor(k / w) + rand();
    position[i * 3] = (x - w / 2) / half;
    position[i * 3 + 1] = -(y - h / 2) / half;
    position[i * 3 + 2] = (rand() - 0.5) * 0.06;
    intensity[i] = 0.55 + 0.45 * rand();
    accent[i] = y > 300 && rand() < 0.85 ? 1 : 0;
  }
  return { position, intensity, accent };
}

/**
 * How a shape moves once formed:
 * - spin: turns on itself (the ball of yarn);
 * - sway: faces the reader, with a very slow sway and a slight lean toward the mouse;
 * - steady: faces the reader and holds still (the contact signature).
 */
export type Motion = "spin" | "sway" | "steady";

/**
 * Limits of the motion at rest. Kept small so the portrait never distorts: features at different
 * depths shift against each other as the cloud turns, so the turn itself stays tiny.
 */
export const MOTION = {
  /** Sway amplitude, radians (about 1.2°). */
  sway: 0.02,
  /** Sway speed, radians per second (one cycle in about 35 s). */
  swaySpeed: 0.18,
  /** Largest lean toward the mouse, radians (1°). */
  pointer: Math.PI / 180,
  /** Breathing amplitude of each point, in shape units. */
  breathe: 0.0015,
  /** How far points lift off while they travel: usual, and on the way to a calm shape. */
  lift: 0.5,
  calmLift: 0.08,
};

const VERT = /* glsl */ `
attribute vec3 aFrom;
attribute float aFromI;
attribute float aFromA;
attribute float aToI;
attribute float aToA;
attribute float aSeed;
attribute float aDust;
uniform float uTime;
uniform float uSize;
uniform float uProgress;
uniform float uLift;
uniform float uRest;
varying float vAlpha;
varying float vAccent;
varying float vScan;

// Per point: the scan reaches the top of the new shape first, then sweeps down.
float local(float y) {
  float delay = (1.0 - (y + 1.0) * 0.5) * 0.45 + aSeed * 0.08;
  return smoothstep(0.0, 1.0, clamp((uProgress - delay) / 0.47, 0.0, 1.0));
}

void main() {
  float t = local(position.y);
  vec3 p = mix(aFrom, position, t);
  // Points lift off a little while they travel (barely, on the way to the face or the signature).
  p.z += sin(t * 3.14159) * (aSeed - 0.5) * uLift;
  // Breathing at rest, and dust drifting slowly; both fade out for a shape that holds still.
  p += uRest * ${MOTION.breathe.toFixed(4)} * vec3(sin(uTime * 0.7 + aSeed * 40.0), cos(uTime * 0.6 + aSeed * 23.0), sin(uTime * 0.5 + aSeed * 11.0));
  p += uRest * aDust * ${DUST_DRIFT.toFixed(3)} * vec3(sin(uTime * 0.13 + aSeed * 61.0), cos(uTime * 0.11 + aSeed * 37.0), sin(uTime * 0.09 + aSeed * 17.0));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.7 + 0.5 * fract(aSeed * 9.1)) * (6.0 / -mv.z);
  float depth = clamp((-mv.z - 5.2) / 1.6, 0.0, 1.0);
  vScan = sin(t * 3.14159) * (1.0 - aDust);
  vAlpha = (1.0 - depth * 0.7) * mix(aFromI, aToI, t);
  vAccent = mix(aFromA, aToA, t);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uAccent;
uniform float uOpacity;
varying float vAlpha;
varying float vAccent;
varying float vScan;

void main() {
  vec2 d = gl_PointCoord - 0.5;
  float m = smoothstep(0.5, 0.15, length(d));
  vec3 c = mix(uInk, uAccent, max(vAccent, vScan * 0.7));
  float a = m * (vAlpha * 0.95 + vScan * 0.5 + vAccent * 0.35) * uOpacity;
  gl_FragColor = vec4(c, a);
}
`;

/**
 * Where the cloud sits: centre x, y in fractions of the half viewport; the shape fits a box of
 * half-height `size` (fraction of the half viewport height) and half-width `width` (fraction of
 * the half viewport width), so wide shapes (a building) do not run off the screen.
 */
export interface Pose {
  x: number;
  y: number;
  size: number;
  width: number;
  opacity: number;
}

/** Half extents of a shape, dust left out. */
export function extent(shape: Shape): { x: number; y: number } {
  let x = 0.01;
  let y = 0.01;
  for (let i = 0; i < shape.intensity.length; i++) {
    if (i % DUST_EVERY === 0) continue;
    x = Math.max(x, Math.abs(shape.position[i * 3]));
    y = Math.max(y, Math.abs(shape.position[i * 3 + 1]));
  }
  return { x, y };
}

/** Morph from one shape to the next: 1.4 s, the scan sweeping down the new shape. */
const MORPH_S = 1.4;

/** Renders the cloud on a fixed canvas behind the page and morphs it between shapes. */
export class ScanCloudRenderer {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  private group = new THREE.Group();
  private geometry = new THREE.BufferGeometry();
  private material: THREE.ShaderMaterial;
  private frame = 0;
  private last = 0;
  private start = performance.now();
  private pose: Pose;
  private target: Pose;
  private tilt = { x: 0, y: 0 };
  private tiltTarget = { x: 0, y: 0 };
  private yaw = 0.2;
  private motion: Motion = "spin";
  private rest = 1;
  private morph = 1;
  private running = false;
  /** Nothing would change on screen, so no frame is requested until something does (see wake). */
  private asleep = false;
  private current: Shape;
  private ext: { x: number; y: number };
  /** Scale of the group, eased toward the one that fits the current shape in the pose's box. */
  private scale = 0;

  constructor(
    canvas: HTMLCanvasElement,
    private count: number,
    first: Shape,
    pose: Pose,
    private still: boolean,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    this.renderer.setClearColor(0x000000, 0);
    const n = POINTS.full;
    const seed = new Float32Array(n);
    const rand = rng(99);
    const dust = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      seed[i] = rand();
      dust[i] = i % DUST_EVERY === 0 ? 1 : 0;
    }
    const attr = (array: Float32Array, size: number) => new THREE.BufferAttribute(array, size).setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute("position", attr(first.position.slice(), 3));
    this.geometry.setAttribute("aFrom", attr(first.position.slice(), 3));
    this.geometry.setAttribute("aFromI", attr(first.intensity.slice(), 1));
    this.geometry.setAttribute("aToI", attr(first.intensity.slice(), 1));
    this.geometry.setAttribute("aFromA", attr(first.accent.slice(), 1));
    this.geometry.setAttribute("aToA", attr(first.accent.slice(), 1));
    this.geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    this.geometry.setAttribute("aDust", new THREE.BufferAttribute(dust, 1));
    this.geometry.setDrawRange(0, count);
    this.current = first;
    this.ext = extent(first);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 2 },
        uProgress: { value: 1 },
        uLift: { value: MOTION.lift },
        uRest: { value: 1 },
        uOpacity: { value: pose.opacity },
        uInk: { value: new THREE.Color("#f1f0ed") },
        uAccent: { value: new THREE.Color("#ff6a3d") },
      },
    });
    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.group.add(points);
    this.scene.add(this.group);
    this.camera.position.set(0, 0, 6);
    this.pose = { ...pose };
    this.target = { ...pose };
    this.resize();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // DPR capped at 1.5: the points are soft anyway.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uSize.value = (w < 768 ? 1.7 : 2.1) * dpr;
    this.render();
    this.wake();
  }

  setPose(pose: Pose) {
    this.target = pose;
    if (this.still) {
      this.pose = { ...pose };
      this.render();
    } else this.wake();
  }

  /** Called after every frame drawn, so overlays (the map's labels) can follow the cloud. */
  onFrame: (() => void) | null = null;

  /** Morph progress toward the current shape, 0..1. */
  get progress() {
    return this.morph;
  }

  /** Pointer in −1..1 on both axes; the cloud leans up to MOTION.pointer toward it. */
  setPointer(x: number, y: number) {
    const max = this.motion === "steady" ? 0 : MOTION.pointer;
    if (this.tiltTarget.x === y * max && this.tiltTarget.y === x * max) return;
    this.tiltTarget = { x: y * max, y: x * max };
    this.wake();
  }

  /**
   * Where a point of the current shape (shape coordinates) is on the page, in CSS pixels, as
   * last drawn. Null when it is behind the camera.
   */
  project(x: number, y: number, z = 0): { x: number; y: number } | null {
    const v = new THREE.Vector3(x, y, z).applyMatrix4(this.group.matrixWorld).project(this.camera);
    if (v.z > 1) return null;
    return { x: ((v.x + 1) / 2) * window.innerWidth, y: ((1 - v.y) / 2) * window.innerHeight };
  }

  /** Morphs to a shape, which then moves as `motion` says. */
  morphTo(shape: Shape, motion: Motion) {
    if (shape === this.current) return;
    const g = this.geometry;
    const from = g.getAttribute("aFrom") as THREE.BufferAttribute;
    const to = g.getAttribute("position") as THREE.BufferAttribute;
    const fromI = g.getAttribute("aFromI") as THREE.BufferAttribute;
    const toI = g.getAttribute("aToI") as THREE.BufferAttribute;
    const fromA = g.getAttribute("aFromA") as THREE.BufferAttribute;
    const toA = g.getAttribute("aToA") as THREE.BufferAttribute;
    const seed = g.getAttribute("aSeed") as THREE.BufferAttribute;
    // Start from where every point is now, even mid-morph (same easing as the shader).
    const p = this.morph;
    for (let i = 0; i < POINTS.full; i++) {
      const y = to.array[i * 3 + 1];
      const delay = (1 - (y + 1) * 0.5) * 0.45 + seed.array[i] * 0.08;
      const c = Math.min(1, Math.max(0, (p - delay) / 0.47));
      const t = c * c * (3 - 2 * c);
      for (let k = 0; k < 3; k++) from.array[i * 3 + k] += (to.array[i * 3 + k] - from.array[i * 3 + k]) * t;
      fromI.array[i] += (toI.array[i] - fromI.array[i]) * t;
      fromA.array[i] += (toA.array[i] - fromA.array[i]) * t;
    }
    (to.array as Float32Array).set(shape.position);
    (toI.array as Float32Array).set(shape.intensity);
    (toA.array as Float32Array).set(shape.accent);
    for (const a of [from, to, fromI, toI, fromA, toA]) a.needsUpdate = true;
    this.current = shape;
    this.ext = extent(shape);
    if (this.motion === "spin" && motion !== "spin") this.yaw = Math.atan2(Math.sin(this.yaw), Math.cos(this.yaw));
    if (motion === "steady") this.tiltTarget = { x: 0, y: 0 };
    this.motion = motion;
    this.material.uniforms.uLift.value = motion === "spin" ? MOTION.lift : MOTION.calmLift;
    this.morph = this.still ? 1 : 0;
    this.material.uniforms.uProgress.value = this.morph;
    if (this.still) this.render();
    this.wake();
  }

  play() {
    if (this.still || this.running) return;
    this.asleep = false;
    this.running = true;
    this.last = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  pause() {
    this.running = false;
    this.asleep = false;
    cancelAnimationFrame(this.frame);
  }

  /** Stops requesting frames until a change wakes the cloud: hidden, or a steady shape at rest. */
  private sleep() {
    this.running = false;
    this.asleep = true;
    cancelAnimationFrame(this.frame);
  }

  private wake() {
    if (this.asleep) this.play();
  }

  private tick = (now: number) => {
    if (!this.running) return;
    this.frame = requestAnimationFrame(this.tick);
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const k = 1 - Math.exp(-dt * 3);
    for (const key of ["x", "y", "size", "width", "opacity"] as const) this.pose[key] += (this.target[key] - this.pose[key]) * k;
    this.scale += (this.fit() - this.scale) * k;
    // Nothing to draw while the cloud is hidden (phones, past the hero): no more frames until
    // the cloud is shown again.
    if (this.pose.opacity < 0.004 && this.target.opacity === 0) return this.sleep();
    this.tilt.x += (this.tiltTarget.x - this.tilt.x) * k;
    this.tilt.y += (this.tiltTarget.y - this.tilt.y) * k;
    const t = (now - this.start) / 1000;
    this.morph = Math.min(1, this.morph + dt / MORPH_S);
    this.material.uniforms.uProgress.value = this.morph;
    this.material.uniforms.uTime.value = t;
    // A steady shape stops breathing once it has formed.
    const rest = this.motion === "steady" && this.morph >= 1 ? 0 : 1;
    this.rest += (rest - this.rest) * k;
    this.material.uniforms.uRest.value = this.rest;
    if (this.motion === "spin") {
      this.yaw += dt * 0.06;
      this.group.rotation.x = -0.35 + this.tilt.x;
    } else {
      // Facing the reader: a very slow sway, or none.
      const sway = this.motion === "sway" ? Math.sin(t * MOTION.swaySpeed) * MOTION.sway : 0;
      this.yaw += (sway - this.yaw) * k;
      this.group.rotation.x += (this.tilt.x - this.group.rotation.x) * k;
    }
    this.group.rotation.y = this.yaw + this.tilt.y;
    if (this.motion === "steady" && this.morph >= 1 && this.rest < 1e-3 && this.settled()) {
      // The signature has formed and holds still: drawn once more exactly at rest, then no frames
      // until something changes.
      this.rest = 0;
      this.material.uniforms.uRest.value = 0;
      this.render();
      return this.sleep();
    }
    this.render();
  };

  /** Pose, size and lean have reached their targets (to well under a pixel). */
  private settled() {
    const near = (a: number, b: number, e = 1e-4) => Math.abs(a - b) < e;
    return (
      (["x", "y", "size", "width", "opacity"] as const).every((key) => near(this.pose[key], this.target[key])) &&
      near(this.scale, this.fit(), 1e-4 * this.scale) &&
      near(this.tilt.x, this.tiltTarget.x, 1e-5) &&
      near(this.tilt.y, this.tiltTarget.y, 1e-5) &&
      near(this.group.rotation.x, this.tilt.x, 1e-5) &&
      near(this.yaw, 0, 1e-5)
    );
  }

  private halves() {
    const halfH = Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.z;
    return { halfH, halfW: halfH * this.camera.aspect };
  }

  /** The largest scale at which the current shape fits the pose's box. */
  private fit() {
    const { halfH, halfW } = this.halves();
    return Math.min((this.pose.size * halfH) / this.ext.y, (this.pose.width * halfW) / this.ext.x);
  }

  private render() {
    const { x, y, opacity } = this.pose;
    const { halfH, halfW } = this.halves();
    if (this.still || !this.scale) this.scale = this.fit();
    this.group.position.set(x * halfW, y * halfH, 0);
    this.group.scale.setScalar(this.scale);
    this.material.uniforms.uOpacity.value = opacity;
    this.renderer.render(this.scene, this.camera);
    this.onFrame?.();
  }

  dispose() {
    this.pause();
    this.onFrame = null;
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    // Frees the canvas's GPU memory now rather than when the canvas is collected. The components
    // give the next renderer a new canvas.
    this.renderer.forceContextLoss();
  }
}
