import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POINTS, decodeShape } from "../src/components/scan/cloud";

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
