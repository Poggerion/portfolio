// @vitest-environment jsdom
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CaseStudyView } from "../src/components/case/CaseStudyView";
import { projects } from "../src/content/projects";
import type { Project } from "../src/content/types";
import { ui } from "../src/content/ui";

const FEATURED = ["parking-platform", "spot-mission-imaging", "android-raspberry-arduino"];
const fiveParts = projects.filter((p) => p.caseStudy);

/** The page as served (static HTML, before any script runs). */
function page(p: Project, lang: "fr" | "en") {
  const html = renderToStaticMarkup(createElement(CaseStudyView, { project: p, study: p.caseStudy!, lang }));
  const host = document.createElement("div");
  host.innerHTML = html;
  return host;
}

describe("five-part case studies", () => {
  it("covers exactly the three featured projects of the cahier", () => {
    expect(fiveParts.map((p) => p.slug).sort()).toEqual([...FEATURED].sort());
  });

  it("fills every part: intro, problem, diagram, contributions and choices, results and limits", () => {
    for (const p of fiveParts) {
      const s = p.caseStudy!;
      expect(s.problem.body.length, p.slug).toBeGreaterThan(0);
      expect(s.diagram.lanes.flatMap((l) => l.nodes).length, p.slug).toBeGreaterThan(2);
      expect(s.contributions.length, p.slug).toBeGreaterThan(0);
      expect(s.decisions.length, p.slug).toBeGreaterThan(0);
      expect(s.results.length, p.slug).toBeGreaterThan(0);
      expect(s.limits.length, p.slug).toBeGreaterThan(0);
    }
  });

  it("marks Felipe's own parts in every diagram, and links every box after the first", () => {
    for (const p of fiveParts) {
      const lanes = p.caseStudy!.diagram.lanes;
      expect(lanes.some((l) => l.nodes.some((n) => n.mine)), p.slug).toBe(true);
      for (const l of lanes) l.nodes.forEach((n, i) => expect(!!n.link, `${p.slug} box ${i}`).toBe(i > 0));
    }
  });

  it("renders the parts in order, with contents that lead to each one", () => {
    for (const p of fiveParts) {
      for (const lang of ["fr", "en"] as const) {
        const host = page(p, lang);
        const parts = ui.caseStudy.parts;
        expect([...host.querySelectorAll("h2")].map((h) => h.textContent)).toEqual([
          "02" + parts.problem[lang],
          "03" + parts.how[lang],
          "04" + parts.work[lang],
          "05" + parts.results[lang],
        ]);
        expect(host.querySelector("h1")?.textContent).toBe(p.title[lang]);
        for (const a of host.querySelectorAll("nav a")) expect(host.querySelector(a.getAttribute("href")!), a.textContent!).not.toBeNull();
      }
    }
  });

  it("draws each diagram as ordered boxes, flagged as a simplification", () => {
    for (const p of fiveParts) {
      for (const lang of ["fr", "en"] as const) {
        const host = page(p, lang);
        const figure = host.querySelector("figure")!;
        expect(figure.textContent).toContain(ui.caseStudy.diagramNote[lang]);
        const lanes = figure.querySelectorAll("ol");
        p.caseStudy!.diagram.lanes.forEach((lane, k) => {
          const boxes = [...lanes[k].querySelectorAll(":scope > li")];
          expect(boxes.map((b) => b.textContent)).toEqual(
            lane.nodes.map((n) => (n.link?.label?.[lang] ?? "") + (n.mine ? ui.caseStudy.mine[lang] : "") + n.title[lang] + (n.detail?.[lang] ?? "")),
          );
        });
      }
    }
  });

  it("serves the project's own shape as a still image, for phones and browsers without WebGL", () => {
    for (const p of fiveParts) expect(page(p, "fr").querySelector("img[data-shape]")?.getAttribute("data-shape")).toBe(p.slug);
  });

  it("keeps work around the project folded and apart from it", () => {
    for (const p of fiveParts.filter((p) => p.caseStudy!.around)) {
      const host = page(p, "fr");
      expect(host.querySelectorAll("details:not([open])").length).toBe(p.caseStudy!.around!.length);
    }
  });
});
