// @vitest-environment jsdom
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/fr/work/parking-platform/", useRouter: () => ({ push: () => {} }) }));

const { LanguageSwitch } = await import("../src/components/LanguageSwitch");

describe("J6 accessibility", () => {
  // WCAG 2.5.3: a link's accessible name contains the text it shows, so voice control users can
  // say "EN" to follow it.
  it("names the language link after the code it shows, in the target language", () => {
    for (const [lang, code, target] of [["fr", "EN", "en"], ["en", "FR", "fr"]] as const) {
      const host = document.createElement("div");
      host.innerHTML = renderToStaticMarkup(createElement(LanguageSwitch, { lang }));
      const link = host.querySelector("a")!;
      expect(link.textContent).toBe(code);
      expect(link.getAttribute("aria-label")!.startsWith(`${code}, `)).toBe(true);
      expect(link.getAttribute("lang")).toBe(target);
      expect(link.getAttribute("href")).toMatch(new RegExp(`^/${target}/work/parking-platform/?$`));
    }
  });
});
