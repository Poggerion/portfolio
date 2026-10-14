import { describe, expect, it } from "vitest";
import { SculptureModel, buildStatic, defaultParams } from "../src/lib/sculpture/geometry";

describe("sculpture geometry", () => {
  it("is deterministic", () => {
    expect(buildStatic()).toEqual(buildStatic());
  });

  it("closes every filament without a seam", () => {
    const lines = buildStatic({ ...defaultParams, filaments: 20, samples: 200 });
    for (const line of lines) {
      const a = line[0];
      const b = line[line.length - 1];
      const step = Math.hypot(line[1][0] - a[0], line[1][1] - a[1], line[1][2] - a[2]);
      const gap = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      expect(gap).toBeLessThan(step * 3);
    }
  });

  it("stays finite and bounded through the whole creative morph", () => {
    const model = new SculptureModel({ ...defaultParams, filaments: 40, samples: 120 });
    const buf = new Float32Array(model.vertexCount * 3);
    for (const morph of [0, 0.25, 0.5, 0.75, 1]) {
      model.write(buf, { time: 12.3, morph, repel: { x: 0, y: 0, z: 0, radius: 0.4, strength: 0.1 } });
      for (const v of buf) {
        expect(Number.isFinite(v)).toBe(true);
        expect(Math.abs(v)).toBeLessThan(3);
      }
    }
  });

  it("assigns filaments evenly to the four domains", () => {
    const model = new SculptureModel(defaultParams);
    const counts = [0, 0, 0, 0];
    model.domain.forEach((d) => counts[d]++);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });
});
