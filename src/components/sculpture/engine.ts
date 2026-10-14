import * as THREE from "three";
import { CLUSTER_REACH, SculptureModel, clusterSpecs, defaultParams, fitClusters } from "@/lib/sculpture/geometry";
import type { Domain } from "@/content/types";
import type { StageInsets } from "@/lib/stage-insets";

export const domainOrder: Domain[] = ["software", "robotics", "embedded", "data"];

/** Where the sculpture sits. x, y: fraction of the half viewport (-1..1). size: fraction of viewport height. */
export interface Layout {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface ClusterScreen {
  domain: Domain;
  x: number;
  y: number;
  r: number;
}

export interface EngineCallbacks {
  onReady?: () => void;
  onHover?: (domain: Domain | null) => void;
  onSelect?: (domain: Domain) => void;
  /** Screen positions of the four clusters, while the creative mode is visible. */
  onClusters?: (clusters: ClusterScreen[]) => void;
}

export type Quality = "high" | "low";

const VERT = /* glsl */ `
attribute float aT;
attribute float aSeed;
attribute float aDomain;
uniform float uTime;
uniform float uReveal;
uniform vec4 uLight;
varying float vAlpha;
varying float vPulse;
varying float vAccent;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;

  float depth = clamp((-mv.z - 4.6) / 2.8, 0.0, 1.0);
  float light = aDomain < 0.5 ? uLight.x : aDomain < 1.5 ? uLight.y : aDomain < 2.5 ? uLight.z : uLight.w;

  // Intro: each filament draws itself along its length, staggered.
  float edge = uReveal * 1.4 - aSeed * 0.4;
  float revealed = 1.0 - smoothstep(edge - 0.06, edge, aT);

  // A faint signal travelling along each filament.
  float p = fract(aT - uTime * 0.045 - aSeed * 5.0);
  vPulse = smoothstep(0.972, 1.0, p) * (0.35 + 0.65 * aSeed) * revealed;

  float tone = 0.4 + 0.6 * fract(aSeed * 7.13);
  vAlpha = (1.0 - depth * 0.72) * tone * light * revealed;
  vAccent = clamp(light - 1.0, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uPulseColor;
uniform vec3 uAccent;
uniform float uOpacity;
uniform float uBase;
varying float vAlpha;
varying float vPulse;
varying float vAccent;

void main() {
  vec3 c = mix(uColor, uAccent, vAccent * 0.6);
  c = mix(c, uPulseColor, vPulse);
  float a = (vAlpha * uBase + vPulse * 0.55) * uOpacity;
  gl_FragColor = vec4(c, a);
}
`;

const DUST_VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uSize;
varying float vA;
void main() {
  vec3 p = position;
  p.x += sin(uTime * 0.11 + aSeed * 40.0) * 0.08;
  p.y += cos(uTime * 0.09 + aSeed * 23.0) * 0.08;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.6 + aSeed) * (6.0 / -mv.z);
  vA = 0.25 + 0.75 * fract(aSeed * 13.7);
}
`;

const DUST_FRAG = /* glsl */ `
uniform float uOpacity;
varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float m = smoothstep(0.5, 0.0, length(d));
  gl_FragColor = vec4(vec3(0.85), m * vA * 0.32 * uOpacity);
}
`;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Approximate diameter of the editorial knot in model units, used to size layouts. */
const KNOT_DIAMETER = 2.7;
/** Half extents of the creative composition in model units (fallback fit). */
const CREATIVE_EXTENT = { x: 2.05, y: 1.45 };
/** Room a domain name takes past its knot (hairline, name, count), CSS px. */
const LABEL_ROOM = 68;
/** Half width kept around each knot centre for its name, CSS px. */
const LABEL_HALF_WIDTH = 96;
/** Creative scale bounds, px per model unit: never a speck, calm on large screens (perHeight: of the visible height). */
const CREATIVE_SCALE = { min: 24, max: 260, perHeight: 0.235 };
/** Up to this width the domain panel is a bottom sheet that hides the names. Same breakpoint as CreativeLayer. */
const SHEET_MAX_WIDTH = 760;
/** Frame pacing, ms: 60 fps at most, 30 fps while the sculpture sits faint behind text. */
const FRAME_MS = 1000 / 60;
const AMBIENT_FRAME_MS = 1000 / 30;
/** Filament update interval for each adaptive step, ms. */
const WRITE_MS = [1000 / 60, 1000 / 30, 1000 / 20];
/** Adaptive quality: evaluation window, ms, and the main-thread cost (ms per update) that counts as heavy or light. */
const PROBE_MS = 2500;
const COST_HEAVY = 8;
const COST_LIGHT = 5;

/** What the adaptive quality measures over one window, in ms. */
interface Probe {
  start: number;
  /** Main-thread time of each frame that updated the filaments (write, upload, render). */
  costs: number[];
  /** Intervals between animation frames, rendered or skipped: the screen's cadence, or its rAF cap. */
  ticks: number[];
  /** Intervals between rendered frames, and the pacing interval each one aimed for. */
  frames: number[];
  aims: number[];
}

const noInsets: StageInsets = { top: 0, right: 0, bottom: 0, left: 0 };

export class SculptureEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  private group = new THREE.Group();
  private model: SculptureModel;
  private positions: Float32Array;
  private geometry = new THREE.BufferGeometry();
  private material: THREE.ShaderMaterial;
  private dustMaterial: THREE.ShaderMaterial;
  private raf = 0;
  private running = false;
  /** Timestamp of the last rendered frame, and of the last animation frame (rendered or skipped). */
  private last = -1;
  private lastTick = -1;
  private nextFrame = 0;
  private nextWrite = 0;
  private time = 0;
  private announced = false;

  /** Adaptive quality: pixel ratio cap for this quality, whether it is lowered to 1, and the write step. */
  private readonly ratioCap: number;
  private ratioDown = false;
  private writeStep = 0;
  private probe: Probe = { start: 0, costs: [], ticks: [], frames: [], aims: [] };
  /** No step back up before this time; the hold doubles each time the device struggles again. */
  private holdUntil = 0;
  private backoff = 8000;

  private layout: Layout = { x: 0.4, y: 0, size: 0.9, opacity: 0 };
  private layoutTarget: Layout = { x: 0.4, y: 0, size: 0.9, opacity: 1 };
  private placed = false;
  private creative = false;
  private panelOpen = false;
  private insets: StageInsets = noInsets;
  /** Damped scale of the creative composition, world units per model unit (0 until first used). */
  private creativeScale = 0;
  private morph = 0;
  private morphFrom = 0;
  private morphTo = 0;
  private morphStart = 0;
  private readonly morphDuration: number;
  private reveal = 0;
  private revealStart = -1;
  private light = new THREE.Vector4(1, 1, 1, 1);
  private lightTarget = new THREE.Vector4(1, 1, 1, 1);
  private pointer = new THREE.Vector2(0, 0);
  private pointerSmooth = new THREE.Vector2(0, 0);
  private pointerActive = false;
  private scrollTurn = 0;
  private flow = 1;
  private portrait = false;
  private width = 0;
  private height = 0;
  /** Height of the visible viewport; the canvas itself is 100lvh and can reach under mobile toolbars. */
  private visibleHeight = 1;
  private lastClusterReport = "";
  private hovered: Domain | null = null;
  private raycaster = new THREE.Raycaster();
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private tmp = new THREE.Vector3();

  constructor(
    private canvas: HTMLCanvasElement,
    private quality: Quality,
    private callbacks: EngineCallbacks = {},
    reducedMotion = false,
  ) {
    this.morphDuration = reducedMotion ? 1 : 1300;
    this.ratioCap = quality === "high" ? 2 : 1.5;
    // No depth buffer (nothing is depth tested), MSAA only where pixels are still coarse, and the
    // default GPU: a decorative scene should not wake a discrete one.
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      depth: false,
      antialias: Math.min(window.devicePixelRatio || 1, this.ratioCap) < 2,
    });
    this.renderer.setClearColor(0x000000, 0);

    const params =
      quality === "high" ? defaultParams : { ...defaultParams, filaments: 84, samples: 160 };
    this.model = new SculptureModel(params);
    const { filaments: F, samples: S } = params;
    this.positions = new Float32Array(this.model.vertexCount * 3);
    this.model.write(this.positions, { time: 0, morph: 0 });

    const aT = new Float32Array(this.model.vertexCount);
    const aSeed = new Float32Array(this.model.vertexCount);
    const aDomain = new Float32Array(this.model.vertexCount);
    for (let f = 0; f < F; f++) {
      for (let i = 0; i < S; i++) {
        const v = f * S + i;
        aT[v] = i / S;
        aSeed[v] = this.model.seed[f];
        aDomain[v] = this.model.domain[f];
      }
    }
    const index = new Uint32Array(F * S * 2);
    let k = 0;
    for (let f = 0; f < F; f++) {
      for (let i = 0; i < S; i++) {
        index[k++] = f * S + i;
        index[k++] = f * S + ((i + 1) % S);
      }
    }
    const posAttr = new THREE.BufferAttribute(this.positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute("position", posAttr);
    this.geometry.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
    this.geometry.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
    this.geometry.setAttribute("aDomain", new THREE.BufferAttribute(aDomain, 1));
    this.geometry.setIndex(new THREE.BufferAttribute(index, 1));
    this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 3.5);

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: reducedMotion ? 1 : 0 },
        uLight: { value: this.light },
        uColor: { value: new THREE.Color("#c4c3bf") },
        uPulseColor: { value: new THREE.Color("#ffffff") },
        uAccent: { value: new THREE.Color("#a9b6c6") },
        uOpacity: { value: 0 },
        uBase: { value: quality === "high" ? 0.2 : 0.3 },
      },
    });
    const lines = new THREE.LineSegments(this.geometry, this.material);
    lines.frustumCulled = false;
    this.group.add(lines);

    // Fine dust around the sculpture for depth.
    const dustCount = quality === "high" ? 520 : 260;
    const dust = new Float32Array(dustCount * 3);
    const dustSeed = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.pow(Math.random(), 0.6) * 2.2;
      const s = Math.sqrt(1 - u * u);
      dust.set([r * s * Math.cos(th), r * u * 0.8, r * s * Math.sin(th)], i * 3);
      dustSeed[i] = Math.random();
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
    dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(dustSeed, 1));
    this.dustMaterial = new THREE.ShaderMaterial({
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        // Set with the pixel ratio in resize().
        uSize: { value: 2.2 },
        uOpacity: { value: 0 },
      },
    });
    const points = new THREE.Points(dustGeo, this.dustMaterial);
    points.frustumCulled = false;
    this.group.add(points);

    this.group.rotation.set(-0.55, 0.35, 0);
    this.scene.add(this.group);
    this.camera.position.set(0, 0, 6);

    this.resize();
    if (reducedMotion) this.reveal = 1;
  }

  /** Start the render loop. The intro draw-in begins on the first frame. */
  start() {
    if (this.running || this.renderer.getContext().isContextLost()) return;
    this.running = true;
    this.last = -1;
    this.lastTick = -1;
    // Skip the first second (shader compile, first upload) before judging the device.
    this.resetProbe(performance.now() + 1000);
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** The WebGL context came back after a loss: draw again and report readiness anew. */
  restore() {
    this.announced = false;
    this.lastClusterReport = "";
    this.start();
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const vv = window.visualViewport;
    // Setting the canvas size clears it, so only when it actually changes (toolbars and zoom fire resizes too).
    if (w !== this.width || h !== this.height) {
      this.width = w;
      this.height = h;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
    this.applyPixelRatio();
    this.visibleHeight = Math.min(h, vv ? vv.height * vv.scale : window.innerHeight) || h;
    // Same rule as the creative interface, which shows the bottom sheet in exactly these viewports.
    this.portrait = window.innerHeight > window.innerWidth * 1.15;
  }

  /** Device pixel ratio (zoom, another monitor) within the cap, lowered to 1 when the device struggles. */
  private applyPixelRatio() {
    const ratio = Math.min(window.devicePixelRatio || 1, this.ratioDown ? 1 : this.ratioCap);
    if (ratio !== this.renderer.getPixelRatio()) this.renderer.setPixelRatio(ratio);
    // Point sizes are in device pixels: keep the dust the same size on screen.
    this.dustMaterial.uniforms.uSize.value = 2.2 * ratio;
  }

  setLayout(layout: Layout) {
    // The first pose is taken as is (only the opacity fades in), so phones never see the desktop pose slide away.
    if (!this.placed) {
      this.placed = true;
      Object.assign(this.layout, { x: layout.x, y: layout.y, size: layout.size });
    }
    this.layoutTarget = layout;
  }

  setCreative(creative: boolean) {
    if (creative === this.creative) return;
    this.creative = creative;
    this.morphFrom = this.morph;
    this.morphTo = creative ? 1 : 0;
    this.morphStart = performance.now();
  }

  /** The domain panel takes part of the screen: the composition makes room. */
  setPanel(open: boolean) {
    this.panelOpen = open;
  }

  /** Screen areas the creative interface covers; the composition fits in the rest of the visible viewport. */
  setInsets(insets: StageInsets) {
    this.insets = insets;
  }

  /** Light one cluster (hover) and/or keep one selected. */
  setFocus(hover: Domain | null, selected: Domain | null) {
    const v = [1, 1, 1, 1];
    if (this.creative) {
      const focus = hover ?? selected;
      if (focus) {
        for (let i = 0; i < 4; i++) v[i] = domainOrder[i] === focus ? 1.9 : 0.38;
      }
    }
    this.lightTarget.set(v[0], v[1], v[2], v[3]);
  }

  setPointer(nx: number, ny: number) {
    this.pointer.set(nx, ny);
    this.pointerActive = true;
  }

  setScroll(turn: number, velocity: number) {
    this.scrollTurn = turn;
    this.flow = 1 + Math.min(Math.abs(velocity) * 0.004, 2.5);
  }

  /** Pointer move on the canvas in creative mode: hover clusters. */
  pick(clientX: number, clientY: number): Domain | null {
    const clusters = this.clusterScreens();
    let best: Domain | null = null;
    let bestD = Infinity;
    for (const c of clusters) {
      const d = Math.hypot(clientX - c.x, clientY - c.y);
      if (d < c.r * 1.15 && d < bestD) {
        best = c.domain;
        bestD = d;
      }
    }
    if (best !== this.hovered) {
      this.hovered = best;
      this.callbacks.onHover?.(best);
    }
    return best;
  }

  click(clientX: number, clientY: number) {
    const d = this.pick(clientX, clientY);
    if (d) this.callbacks.onSelect?.(d);
  }

  dispose() {
    this.stop();
    this.geometry.dispose();
    this.material.dispose();
    this.dustMaterial.dispose();
    this.renderer.dispose();
  }

  private visibleHalf() {
    const halfH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
    return { halfW: halfH * this.camera.aspect, halfH };
  }

  private clusterScreens(): ClusterScreen[] {
    this.group.updateMatrixWorld();
    const { halfH } = this.visibleHalf();
    const pxPerUnit = this.height / (2 * halfH);
    return clusterSpecs.map((c, i) => {
      this.tmp.set(c.center[0], c.center[1], c.center[2]).applyMatrix4(this.group.matrixWorld);
      const depthScale = this.camera.position.z / (this.camera.position.z - this.tmp.z);
      this.tmp.project(this.camera);
      return {
        domain: domainOrder[i],
        x: (this.tmp.x * 0.5 + 0.5) * this.width,
        y: (-this.tmp.y * 0.5 + 0.5) * this.height,
        r: c.radius * CLUSTER_REACH * this.group.scale.x * pxPerUnit * depthScale,
      };
    });
  }

  private tick = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.tick);
    // The device is judged on steady frames, not on the short morph between modes.
    const probe = this.probe;
    const measuring = now >= probe.start && this.morph === this.morphTo;
    if (measuring && this.lastTick >= 0) {
      const gap = now - this.lastTick;
      if (gap > 0 && gap < 1000) probe.ticks.push(gap);
    }
    this.lastTick = now;

    // Paced by time, so high-refresh screens never multiply the work. Faint behind text, 30 fps is plenty.
    const ambient = this.layoutTarget.opacity < 0.3 && !this.creative && this.morph === 0 && this.reveal >= 1;
    const interval = ambient ? AMBIENT_FRAME_MS : FRAME_MS;
    // 2 ms of slack absorbs timestamp jitter, so a 60 Hz screen keeps every frame.
    if (now < this.nextFrame - 2) return;
    this.nextFrame = Math.max(this.nextFrame + interval, now + interval / 2);

    // rAF timestamps can predate start(): never let a negative step drive the damping backwards.
    if (this.last < 0) this.last = now;
    else if (measuring) {
      probe.frames.push(now - this.last);
      probe.aims.push(interval);
    }
    const frameMs = Math.max(0, now - this.last);
    // Capped so a stalled frame never jumps, but loose enough that slow devices still keep pace.
    const dt = Math.min(frameMs / 1000, 0.1);
    this.last = now;

    if (this.revealStart < 0) this.revealStart = now;
    if (this.reveal < 1) {
      this.reveal = Math.min(1, (now - this.revealStart) / 2600);
      this.material.uniforms.uReveal.value = easeInOutCubic(this.reveal);
    }

    // Morph tween (fixed duration so the mode change always takes the same time).
    if (this.morph !== this.morphTo) {
      const p = Math.min(1, (now - this.morphStart) / this.morphDuration);
      this.morph = this.morphFrom + (this.morphTo - this.morphFrom) * easeInOutCubic(p);
      if (p >= 1) this.morph = this.morphTo;
    }

    // Damped layout and light. The editorial size keeps following the page; the creative
    // composition has its own scale, held while the mode closes so the clusters gather back calmly.
    const { halfW, halfH } = this.visibleHalf();
    const k = 1 - Math.exp(-dt * 3.2);
    const L = this.layout;
    const P = this.layoutTarget;
    const C = this.creative ? this.creativeTarget(halfW, halfH) : null;
    L.x += ((C ? C.x : P.x) - L.x) * k;
    L.y += ((C ? C.y : P.y) - L.y) * k;
    L.size += (P.size - L.size) * k;
    L.opacity += ((C ? 1 : P.opacity) - L.opacity) * (1 - Math.exp(-dt * 2.4));
    if (C) this.creativeScale = this.creativeScale > 0 ? this.creativeScale + (C.scale - this.creativeScale) * k : C.scale;
    this.light.lerp(this.lightTarget, 1 - Math.exp(-dt * 6));
    this.pointerSmooth.lerp(this.pointer, 1 - Math.exp(-dt * 2.5));

    const proScale = (L.size * 2 * halfH) / KNOT_DIAMETER;
    const scale = proScale + (this.creativeScale - proScale) * this.morph;
    this.group.scale.setScalar(scale);
    this.group.position.set(L.x * halfW, L.y * halfH, 0);

    // Rotation: slow drift + scroll + pointer in the editorial pose; settles flat for the clusters.
    const drift = this.time * 0.035;
    const m = this.morph;
    const rx = (-0.55 + this.pointerSmooth.y * 0.18 + Math.sin(drift * 0.7) * 0.06) * (1 - m) + this.pointerSmooth.y * 0.08 * m;
    const ry = (0.35 + drift + this.scrollTurn + this.pointerSmooth.x * 0.28) * (1 - m) + this.pointerSmooth.x * 0.12 * m;
    const rz = this.portrait ? (-Math.PI / 2) * m : 0;
    this.group.rotation.set(rx, ry, rz);

    this.time += dt * this.flow;
    this.flow += (1 - this.flow) * (1 - Math.exp(-dt * 1.5));

    // The filaments update at a bounded rate (lower when the device struggles); between
    // updates the frame still moves through the group transform.
    const t0 = performance.now();
    // Each step lowers the rate even when rendering is already paced (e.g. 30 fps ambient).
    const writeMs = Math.max(interval * (this.writeStep + 1), WRITE_MS[this.writeStep]);
    const write = now >= this.nextWrite - 2;
    if (write) {
      this.nextWrite = Math.max(this.nextWrite + writeMs, now + writeMs / 2);
      this.model.write(this.positions, { time: this.time, morph: this.morph, repel: this.repelPoint() });
      (this.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    this.material.uniforms.uTime.value = this.time;
    this.material.uniforms.uOpacity.value = L.opacity;
    this.dustMaterial.uniforms.uTime.value = this.time;
    this.dustMaterial.uniforms.uOpacity.value = L.opacity * (0.6 + 0.4 * this.reveal);
    this.renderer.render(this.scene, this.camera);

    if (write && measuring) probe.costs.push(performance.now() - t0);
    if (measuring) this.adapt(now);

    if (!this.announced) {
      this.announced = true;
      this.callbacks.onReady?.();
    }

    if (this.morph > 0.92 && this.callbacks.onClusters) {
      const clusters = this.clusterScreens();
      const key = clusters.map((c) => `${c.x | 0},${c.y | 0},${c.r | 0}`).join("|");
      if (key !== this.lastClusterReport) {
        this.lastClusterReport = key;
        this.callbacks.onClusters(clusters);
      }
    }
  };

  /**
   * Where the creative composition goes: position as a fraction of the half viewport, scale in
   * world units per model unit. It fits, names included, in the visible viewport minus what the
   * interface covers (intro, panel or sheet, hint), centred there.
   */
  private creativeTarget(halfW: number, halfH: number): { x: number; y: number; scale: number } {
    const { top, right, bottom, left } = this.insets;
    if (!top && !right && !bottom && !left) return this.fallbackTarget(halfW, halfH);
    const ppu = this.height / (2 * halfH);
    const W = this.width;
    const H = this.visibleHeight;
    // Names are hidden while a bottom sheet is up.
    const names = !(this.panelOpen && (this.portrait || window.innerWidth <= SHEET_MAX_WIDTH));
    // Breathing room inside the free area; it also absorbs the slight perspective of the outer knots.
    const pad = Math.min(40, Math.max(16, Math.min(W, H) * 0.04));
    const fit = fitClusters(
      { left: left + pad, top: top + pad, right: W - right - pad, bottom: H - bottom - pad },
      {
        rotation: this.portrait ? -Math.PI / 2 : 0,
        labelsBelow: this.portrait,
        labelHeight: names ? LABEL_ROOM : 0,
        labelHalfWidth: names ? LABEL_HALF_WIDTH : 0,
        maxScale: Math.min(CREATIVE_SCALE.max, H * CREATIVE_SCALE.perHeight),
      },
    );
    return {
      x: (fit.x - W / 2) / ppu / halfW,
      y: (this.height / 2 - fit.y) / ppu / halfH,
      scale: Math.max(fit.scale, CREATIVE_SCALE.min) / ppu,
    };
  }

  /** Until the interface reports what it covers: the composition as first designed. */
  private fallbackTarget(halfW: number, halfH: number) {
    const ex = this.portrait ? CREATIVE_EXTENT.y : CREATIVE_EXTENT.x;
    const ey = this.portrait ? CREATIVE_EXTENT.x : CREATIVE_EXTENT.y;
    const fit = Math.min(halfW / ex, (halfH * 0.78) / ey) * 0.86;
    const wide = this.width / Math.max(this.height, 1) >= 1.45;
    const [x, y, size] = this.portrait
      ? [0, this.panelOpen ? 0.48 : -0.06, this.panelOpen ? 0.56 : 1]
      : this.panelOpen
        ? [-0.32, -0.02, 0.74]
        : [wide ? 0.2 : 0.14, -0.04, wide ? 1 : 0.92];
    return { x, y, scale: fit * size };
  }

  /** Cursor position on the sculpture's plane, in model space, so filaments part around it. */
  private repelPoint() {
    if (!this.pointerActive || this.layout.opacity < 0.4) return null;
    this.raycaster.setFromCamera(this.pointerSmooth, this.camera);
    this.plane.constant = -this.group.position.z;
    if (!this.raycaster.ray.intersectPlane(this.plane, this.tmp)) return null;
    this.group.worldToLocal(this.tmp);
    return { x: this.tmp.x, y: this.tmp.y, z: 0, radius: 0.55, strength: 0.07 };
  }

  private resetProbe(start: number) {
    this.probe.start = start;
    this.probe.costs.length = 0;
    this.probe.ticks.length = 0;
    this.probe.frames.length = 0;
    this.probe.aims.length = 0;
  }

  /**
   * Adaptive quality, judged every few seconds on the main-thread cost of an update and on late
   * frames. A frame is late against its own pacing interval or the screen's cadence, whichever is
   * longer, so a 30 Hz rAF cap (low power modes) reads as normal. Late frames, or a cadence under
   * 22 fps, lower the pixel ratio first; heavy updates lower the update rate. Light, steady windows
   * step back up, after a hold that doubles each time the device struggles again.
   */
  private adapt(now: number) {
    const p = this.probe;
    if (now - p.start < PROBE_MS || p.costs.length < 10 || p.frames.length < 10) return;
    // Median and low percentile: a lone stall (garbage collection, a busy page) never decides.
    const cost = p.costs.sort((a, b) => a - b)[p.costs.length >> 1];
    const cadence = p.ticks.sort((a, b) => a - b)[Math.floor(p.ticks.length * 0.1)];
    let late = 0;
    for (let i = 0; i < p.frames.length; i++) if (p.frames[i] > 1.5 * Math.max(p.aims[i], cadence)) late++;
    const lateShare = late / p.frames.length;
    this.resetProbe(now);

    const janky = lateShare > 0.2 || cadence > 45;
    if (janky || cost > COST_HEAVY) {
      if (janky && !this.ratioDown && Math.min(window.devicePixelRatio || 1, this.ratioCap) > 1) {
        this.ratioDown = true;
        this.applyPixelRatio();
      } else if (this.writeStep < WRITE_MS.length - 1) {
        this.writeStep++;
      } else return;
      this.holdUntil = now + this.backoff;
      this.backoff = Math.min(this.backoff * 2, 64000);
    } else if (cost < COST_LIGHT && lateShare < 0.05 && now >= this.holdUntil) {
      if (this.writeStep > 0) {
        this.writeStep--;
      } else if (this.ratioDown) {
        this.ratioDown = false;
        this.applyPixelRatio();
      } else return;
      this.holdUntil = now + 2 * PROBE_MS;
    }
  }
}

export function pickQuality(): Quality {
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return cores <= 4 || mem <= 4 || coarse ? "low" : "high";
}
