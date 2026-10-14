import { describe, expect, it } from "vitest";
import { pickActive, pickVariant } from "../src/lib/active-section";

const boxes = (...tops: number[]) => ["top", "about", "work", "contact"].map((id, i) => ({ id, top: tops[i] }));

describe("pickActive", () => {
  it("starts on the first section", () => {
    expect(pickActive(boxes(0, 900, 1800, 2600), 360, false)).toBe("top");
  });

  it("switches once a section's top crosses the probe line", () => {
    expect(pickActive(boxes(-900, 361, 1200, 2000), 360, false)).toBe("top");
    expect(pickActive(boxes(-900, 360, 1200, 2000), 360, false)).toBe("about");
    expect(pickActive(boxes(-2000, -1100, -200, 700), 360, false)).toBe("work");
  });

  it("keeps the first section active above it", () => {
    expect(pickActive(boxes(120, 900, 1800, 2600), 360, false)).toBe("top");
  });

  it("gives the last section its turn at the bottom of the page", () => {
    expect(pickActive(boxes(-3000, -2100, -1200, 500), 360, true)).toBe("contact");
  });

  it("returns nothing without sections", () => {
    expect(pickActive([], 360, false)).toBeNull();
  });
});

describe("pickVariant", () => {
  it("has no variant before the first marker", () => {
    expect(pickVariant([{ id: "ets", top: 500 }], 360)).toBeNull();
  });

  it("takes the last marker that crossed the probe line", () => {
    const markers = [
      { id: "a", top: -400 },
      { id: "b", top: 200 },
      { id: "c", top: 600 },
    ];
    expect(pickVariant(markers, 360)).toBe("b");
  });
});
