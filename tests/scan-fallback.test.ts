// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { ScanCloud } from "../src/components/scan/ScanCloud";
import { scanStore, type ScanState } from "../src/lib/scan-store";

/** The cloud as a browser without WebGL shows it, on a given section. */
async function withoutWebGL(section: string, more: Partial<ScanState> = {}) {
  scanStore.reset();
  scanStore.update({ section, live: true, ...more });
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  await act(async () => root.render(createElement(ScanCloud, { lang: "fr" })));
  // The fallback is switched on at the next animation frame.
  await act(() => new Promise((r) => setTimeout(r, 50)));
  mounted.push(root);
  return host;
}

const mounted: Root[] = [];

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
  window.requestAnimationFrame ??= (cb) => window.setTimeout(() => cb(performance.now()), 16);
  window.cancelAnimationFrame ??= (id) => window.clearTimeout(id);
});

afterEach(() => {
  mounted.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("scan panel without WebGL", () => {
  it("writes the contact signature instead of leaving the panel empty", async () => {
    const host = await withoutWebGL("contact");
    const signature = host.querySelector("p[aria-hidden='true']");
    expect(signature?.textContent).toBe("Au plaisird’échanger.");
    expect(host.querySelector("canvas")?.hidden).toBe(true);
  });

  it("labels Sept-Îles and Montréal on the still map", async () => {
    const host = await withoutWebGL("about");
    expect(host.querySelector("img")?.getAttribute("src")).toMatch(/\/clouds\/quebec\.webp$/);
    const marks = [...host.querySelectorAll<HTMLElement>("[data-mark]")];
    expect(marks.map((m) => m.textContent)).toEqual(["01 Sept-ÎlesCégep · ITMI", "02 MontréalÉTS"]);
    for (const m of marks) expect(m.style.left).toMatch(/%$/);
  });

  it("shows the project being read, then the one previewed: focus over hover", async () => {
    const host = await withoutWebGL("work", { variant: "javafx-image-editor" });
    const still = () => host.querySelector("img")?.getAttribute("data-shape");
    expect(still()).toBe("javafx-image-editor");
    await act(async () => scanStore.update({ hover: "php-auth-sites" }));
    expect(still()).toBe("php-auth-sites");
    await act(async () => scanStore.update({ focus: "spot-thermal-mission" }));
    expect(still()).toBe("spot-thermal-mission");
    await act(async () => scanStore.update({ focus: null, hover: null }));
    expect(still()).toBe("javafx-image-editor");
  });

  it("shows the still portrait, without map labels, at the top", async () => {
    const host = await withoutWebGL("top");
    expect(host.querySelector("img")?.getAttribute("src")).toMatch(/\/clouds\/face\.webp$/);
    expect(host.querySelector("[data-mark]")).toBeNull();
  });
});
