import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DUST_DRIFT, DUST_EVERY, MOTION, POINTS, decodeShape, withDust } from "../src/components/scan/cloud";
import { previewPercent, quebecMarkers, quebecRoute } from "../src/components/scan/MapMarks";
import meta from "../src/components/scan/shape-meta.json";

const dir = join("public", "clouds");
const bins = readdirSync(dir).filter((f) => f.endsWith(".bin"));

function bounds(position: Float32Array, count: number) {
  const b = { minX: 1, maxX: -1, minY: 1, maxY: -1 };
  for (let i = 0; i < count; i++) {
    b.minX = Math.min(b.minX, position[i * 3]);
    b.maxX = Math.max(b.maxX, position[i * 3]);
    b.minY = Math.min(b.minY, position[i * 3 + 1]);
    b.maxY = Math.max(b.maxY, position[i * 3 + 1]);
  }
  return b;
}

describe("point clouds", () => {
  it("has every shape the home page asks for, each with its still preview", () => {
    for (const name of ["face", "quebec", "phone", "spot", "board", "cegep", "ets"]) {
      expect(bins).toContain(`${name}.bin`);
      expect(readdirSync(dir)).toContain(`${name}.webp`);
    }
  });

  it.each(bins)("%s: 16 384 points of 8 bytes, at most 150 KB", (file) => {
    const buf = readFileSync(join(dir, file));
    expect(buf.length).toBe(POINTS.full * 8);
    expect(buf.length).toBeLessThanOrEqual(150 * 1024);
  });

  it.each(bins)("%s: fits −1..1 on its longest side, accents are 0 or 1", (file) => {
    const buf = readFileSync(join(dir, file));
    const shape = decodeShape(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
    const b = bounds(shape.position, POINTS.full);
    expect(Math.max(b.maxX - b.minX, b.maxY - b.minY)).toBeGreaterThan(1.95);
    for (const v of shape.position) expect(Math.abs(v)).toBeLessThanOrEqual(1);
    for (const a of shape.accent) expect([0, 1]).toContain(a);
  });

  it.each(bins)("%s: the first 6 144 points cover the whole shape (phones draw only those)", (file) => {
    const buf = readFileSync(join(dir, file));
    const shape = decodeShape(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
    const all = bounds(shape.position, POINTS.full);
    const light = bounds(shape.position, POINTS.light);
    expect(light.maxX - light.minX).toBeGreaterThan((all.maxX - all.minX) * 0.9);
    expect(light.maxY - light.minY).toBeGreaterThan((all.maxY - all.minY) * 0.9);
  });
});

describe("dust around a shape", () => {
  const shape = decodeShape(new Uint8Array(readFileSync(join(dir, "face.bin"))).buffer);
  const dusty = withDust(shape, 2);

  it("moves only every DUST_EVERY-th point, and keeps it faint and without accent", () => {
    const wrong: number[] = [];
    for (let i = 0; i < POINTS.full; i++) {
      const moved = [0, 1, 2].some((k) => dusty.position[i * 3 + k] !== shape.position[i * 3 + k]);
      const ok =
        i % DUST_EVERY === 0
          ? dusty.intensity[i] < 0.5 && dusty.accent[i] === 0
          : !moved && dusty.intensity[i] === shape.intensity[i] && dusty.accent[i] === shape.accent[i];
      if (!ok) wrong.push(i);
    }
    expect(wrong).toEqual([]);
  });

  it("stays light and is the same on every visit", () => {
    expect(1 / DUST_EVERY).toBeLessThanOrEqual(0.05);
    expect(withDust(shape, 2).position).toEqual(dusty.position);
  });
});

describe("calm portrait", () => {
  const shape = decodeShape(new Uint8Array(readFileSync(join(dir, "face.bin"))).buffer);
  const calm = meta.face.calm;
  const dusty = withDust(shape, 2, calm);

  it("keeps the face free of dust", () => {
    const inside: number[] = [];
    for (let i = 0; i < POINTS.full; i += DUST_EVERY) {
      const u = (dusty.position[i * 3] - calm.cx) / calm.rx;
      const v = (dusty.position[i * 3 + 1] - calm.cy) / calm.ry;
      // Still outside after the shader's drift (up to DUST_DRIFT on each axis).
      if (Math.hypot(u, v) < 1 + (DUST_DRIFT * Math.SQRT2) / Math.min(calm.rx, calm.ry)) inside.push(i);
    }
    expect(inside).toEqual([]);
  });

  it("measures the face on the head, above the shoulders", () => {
    expect(calm.cy).toBeGreaterThan(0);
    expect(calm.rx).toBeGreaterThan(0.3);
    expect(calm.rx).toBeLessThan(0.8);
    expect(Math.abs(calm.cx)).toBeLessThan(0.2);
  });

  it("turns and leans only slightly, and barely lifts points on the way", () => {
    const deg = Math.PI / 180;
    expect(MOTION.sway).toBeLessThanOrEqual(1.5 * deg);
    expect(MOTION.pointer).toBeLessThanOrEqual(1 * deg + 1e-9);
    expect(MOTION.breathe).toBeLessThanOrEqual(0.002);
    expect(MOTION.calmLift).toBeLessThan(MOTION.lift / 4);
  });
});

describe("Québec map labels", () => {
  const shape = decodeShape(new Uint8Array(readFileSync(join(dir, "quebec.bin"))).buffer);
  const sept = quebecMarkers["sept-iles"];
  const mtl = quebecMarkers.montreal;

  it("places Sept-Îles north-east of Montréal, inside the shape", () => {
    for (const [x, y] of [sept, mtl]) {
      expect(Math.abs(x)).toBeLessThanOrEqual(1);
      expect(Math.abs(y)).toBeLessThanOrEqual(1);
    }
    expect(sept[0]).toBeGreaterThan(mtl[0]);
    expect(sept[1]).toBeGreaterThan(mtl[1]);
  });

  it("runs the route from Sept-Îles to Montréal", () => {
    expect(quebecRoute[0]).toEqual(sept);
    expect(quebecRoute[quebecRoute.length - 1]).toEqual(mtl);
  });

  it("puts each label on the orange end of the route in the cloud", () => {
    for (const [x, y] of [sept, mtl]) {
      let near = 0;
      for (let i = 0; i < POINTS.full; i++) {
        if (shape.accent[i] && Math.hypot(shape.position[i * 3] - x, shape.position[i * 3 + 1] - y) < 0.02) near++;
      }
      expect(near).toBeGreaterThan(20);
    }
  });

  it("maps shape coordinates onto the still image", () => {
    expect(previewPercent([0, 0])).toEqual([50, 50]);
    const [x, y] = previewPercent([1, 1]);
    expect(x).toBeCloseTo(96);
    expect(y).toBeCloseTo(4);
    for (const p of [sept, mtl]) {
      for (const v of previewPercent(p)) {
        expect(v).toBeGreaterThan(0);
        expect(v).toBeLessThan(100);
      }
    }
  });
});
