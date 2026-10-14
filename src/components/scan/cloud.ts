import * as THREE from "three";

/** Points in the cloud. Phones and small screens take the first part only. */
export const POINTS = { full: 16384, light: 6144 };

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

/**
 * The ball of yarn as points: many strands wound around the knot, each strand a line of
 * points instead of a filament. Returns positions and, per point, a seed and an accent flag.
 */
export function buildYarn(count: number) {
  const rand = rng(7);
  const strands = 140;
  const position = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const accent = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const s = i % strands;
    const sRand = rng(s + 1);
    const phase = sRand() * Math.PI * 2;
    const spread = 0.015 + 0.11 * Math.sqrt(sRand());
    const twist = 2 + Math.floor(sRand() * 3);
    const t = rand() * Math.PI * 2;
    const p = knot(t);
    const q = knot(t + 0.001);
    const tan = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
    const tl = Math.hypot(tan[0], tan[1], tan[2]) || 1;
    tan[0] /= tl;
    tan[1] /= tl;
    tan[2] /= tl;
    // Normal and binormal from the tangent and the knot's axis.
    let n = [tan[1], -tan[0], 0];
    const nl = Math.hypot(n[0], n[1]) || 1;
    n = [n[0] / nl, n[1] / nl, 0];
    const b = [tan[1] * n[2] - tan[2] * n[1], tan[2] * n[0] - tan[0] * n[2], tan[0] * n[1] - tan[1] * n[0]];
    const a = phase + twist * t;
    const r = spread * (0.85 + 0.3 * rand());
    const jitter = 0.006;
    for (let k = 0; k < 3; k++) {
      position[i * 3 + k] = p[k] + (n[k] * Math.cos(a) + b[k] * Math.sin(a)) * r + (rand() - 0.5) * jitter;
    }
    seed[i] = rand();
    accent[i] = rand() < 0.008 ? 1 : 0;
  }
  return { position, seed, accent };
}

const VERT = /* glsl */ `
attribute float aSeed;
attribute float aAccent;
uniform float uTime;
uniform float uSize;
uniform float uScan;
varying float vAlpha;
varying float vAccent;
varying float vScan;

void main() {
  vec3 p = position;
  // Breathing: each point drifts a little around its place on the strand.
  p += 0.006 * vec3(sin(uTime * 0.7 + aSeed * 40.0), cos(uTime * 0.6 + aSeed * 23.0), sin(uTime * 0.5 + aSeed * 11.0));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = clamp((-mv.z - 5.2) / 1.6, 0.0, 1.0);
  gl_PointSize = uSize * (0.7 + 0.5 * fract(aSeed * 9.1)) * (6.0 / -mv.z);
  // The scan line: a band sweeping down the model, lighting what it crosses.
  float band = 1.0 - smoothstep(0.0, 0.07, abs(position.y - uScan));
  vScan = band;
  vAlpha = (1.0 - depth * 0.7) * (0.35 + 0.65 * fract(aSeed * 7.13));
  vAccent = aAccent;
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
  vec3 c = mix(uInk, uAccent, max(vAccent, vScan * 0.55));
  float a = m * (vAlpha * 0.95 + vScan * 0.6 + vAccent * 0.4) * uOpacity;
  gl_FragColor = vec4(c, a);
}
`;

/** Where the cloud sits: x, y in fractions of the half viewport, size as a fraction of its height. */
export interface Pose {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

/** Renders the ball of yarn on a fixed canvas behind the page. */
export class YarnCloud {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  private group = new THREE.Group();
  private material: THREE.ShaderMaterial;
  private frame = 0;
  private last = 0;
  private start = performance.now();
  private pose: Pose;
  private target: Pose;
  private tilt = { x: 0, y: 0 };
  private tiltTarget = { x: 0, y: 0 };
  private running = false;

  constructor(
    private canvas: HTMLCanvasElement,
    count: number,
    pose: Pose,
    private still: boolean,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    this.renderer.setClearColor(0x000000, 0);
    const { position, seed, accent } = buildYarn(count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geo.setAttribute("aAccent", new THREE.BufferAttribute(accent, 1));
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 2 },
        uScan: { value: 2 },
        uOpacity: { value: pose.opacity },
        uInk: { value: new THREE.Color("#f1f0ed") },
        uAccent: { value: new THREE.Color("#ff6a3d") },
      },
    });
    this.group.add(new THREE.Points(geo, this.material));
    this.group.rotation.set(-0.35, 0.2, 0.3);
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
  }

  setPose(pose: Pose) {
    this.target = pose;
    if (this.still) {
      this.pose = { ...pose };
      this.render();
    }
  }

  /** Pointer in -1..1 on both axes; the cloud leans up to 4° toward it. */
  setPointer(x: number, y: number) {
    const max = (4 * Math.PI) / 180;
    this.tiltTarget = { x: y * max, y: x * max };
  }

  play() {
    if (this.still || this.running) return;
    this.running = true;
    this.last = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  pause() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  private tick = (now: number) => {
    if (!this.running) return;
    this.frame = requestAnimationFrame(this.tick);
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const k = 1 - Math.exp(-dt * 3);
    for (const key of ["x", "y", "size", "opacity"] as const) this.pose[key] += (this.target[key] - this.pose[key]) * k;
    this.tilt.x += (this.tiltTarget.x - this.tilt.x) * k;
    this.tilt.y += (this.tiltTarget.y - this.tilt.y) * k;
    const t = (now - this.start) / 1000;
    this.material.uniforms.uTime.value = t;
    // One sweep every 7 s, from above the model to below it, then a pause.
    const sweep = (t % 7) / 4.5;
    this.material.uniforms.uScan.value = sweep <= 1 ? 1.1 - sweep * 2.2 : 2;
    this.group.rotation.y = 0.2 + t * 0.06 + this.tilt.y;
    this.group.rotation.x = -0.35 + this.tilt.x;
    this.render();
  };

  private render() {
    const { x, y, size, opacity } = this.pose;
    // Visible half height at the model's depth, then place and scale in those units.
    const halfH = Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.z;
    const halfW = halfH * this.camera.aspect;
    this.group.position.set(x * halfW, y * halfH, 0);
    this.group.scale.setScalar((size * halfH * 2) / 2.2);
    this.material.uniforms.uOpacity.value = opacity;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.pause();
    this.group.traverse((o) => {
      if (o instanceof THREE.Points) o.geometry.dispose();
    });
    this.material.dispose();
    this.renderer.dispose();
  }
}
