import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POINTS, decodeShape } from "../src/components/scan/cloud";
import { PROJECT_SHAPES, shapeFor } from "../src/components/scan/shapes";
import { pickProject, shownProject } from "../src/lib/active-section";
import { projects } from "../src/content/projects";

const slugs = projects.map((p) => p.slug);

/** Which cells of a 24 × 24 grid over the shape hold at least a few points. */
function occupancy(name: string): Set<number> {
  const buf = readFileSync(join("public", "clouds", `${name}.bin`));
  const shape = decodeShape(new Uint8Array(buf).buffer);
  const counts = new Map<number, number>();
  for (let i = 0; i < POINTS.full; i++) {
    const cx = Math.min(23, Math.floor(((shape.position[i * 3] + 1) / 2) * 24));
    const cy = Math.min(23, Math.floor(((shape.position[i * 3 + 1] + 1) / 2) * 24));
    counts.set(cy * 24 + cx, (counts.get(cy * 24 + cx) ?? 0) + 1);
  }
  return new Set([...counts].filter(([, n]) => n >= 8).map(([cell]) => cell));
}

describe("project shapes", () => {
  it("gives each of the nine projects its own shape", () => {
    expect(slugs).toHaveLength(9);
    expect(Object.keys(PROJECT_SHAPES).sort()).toEqual([...slugs].sort());
    const shapes = slugs.map((s) => shapeFor("work", null, s));
    expect(new Set(shapes).size).toBe(9);
    // Never a section's shape either.
    for (const s of shapes) expect(["face", "quebec", "spot", "board", "cegep", "ets", "text", "yarn"]).not.toContain(s);
  });

  it("draws nine different figures, not one figure nine times", () => {
    const grids = slugs.map((s) => occupancy(PROJECT_SHAPES[s as keyof typeof PROJECT_SHAPES]));
    for (let a = 0; a < grids.length; a++) {
      for (let b = a + 1; b < grids.length; b++) {
        const shared = [...grids[a]].filter((c) => grids[b].has(c)).length;
        const union = new Set([...grids[a], ...grids[b]]).size;
        expect(shared / union, `${slugs[a]} / ${slugs[b]}`).toBeLessThan(0.5);
      }
    }
  });

  it("shows the first project before the reader reaches one, and each section's own shape elsewhere", () => {
    expect(shapeFor("work", null, null)).toBe("parking-platform");
    expect(shapeFor("experience", null, null)).toBe("spot");
    expect(shapeFor("skills", null, null)).toBe("board");
    expect(shapeFor("about", null, "php-auth-sites")).toBe("php-auth-sites");
    expect(shapeFor("about", null, "unknown")).toBe("quebec");
  });
});

describe("which project shows", () => {
  const read = { section: "work", variant: "dotnet-web-apps", focus: null, hover: null };

  it("follows the project being read in the work section", () => {
    expect(shownProject(read)).toBe("dotnet-web-apps");
    expect(shownProject({ ...read, section: "skills" })).toBeNull();
  });

  it("puts keyboard focus before hover, and hover before scrolling", () => {
    expect(shownProject({ ...read, hover: "php-auth-sites" })).toBe("php-auth-sites");
    expect(shownProject({ ...read, hover: "php-auth-sites", focus: "spot-thermal-mission" })).toBe("spot-thermal-mission");
    expect(shownProject({ ...read, section: "about", hover: "php-auth-sites" })).toBe("php-auth-sites");
  });

  it("goes back to the project being read when the preview ends", () => {
    const previewed = { ...read, focus: "spot-thermal-mission" };
    expect(shownProject({ ...previewed, focus: null })).toBe("dotnet-web-apps");
  });

  it("picks the last project whose top crossed the reading line, or the first one", () => {
    const boxes = [
      { id: "a", top: 500 },
      { id: "b", top: 900 },
    ];
    expect(pickProject(boxes, 360)).toBe("a");
    expect(pickProject([{ id: "a", top: 100 }, { id: "b", top: 300 }, { id: "c", top: 700 }], 360)).toBe("b");
    expect(pickProject([], 360)).toBeNull();
  });
});
