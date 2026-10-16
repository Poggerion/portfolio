// @vitest-environment jsdom
import { createElement, type FunctionComponent } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Hero } from "../src/components/Hero";
import { shapeFor } from "../src/components/scan/shapes";
import { Contact, EducationList, Footer, Work } from "../src/components/sections";
import { profile } from "../src/content/profile";
import { projects } from "../src/content/projects";
import { scanSections } from "../src/content/scan";
import { casePath, type Locale } from "../src/lib/i18n";

function render(component: FunctionComponent<{ lang: Locale }>, lang: Locale) {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(createElement(component, { lang }));
  return host;
}

const hrefs = (host: HTMLElement) => [...host.querySelectorAll("a")].map((a) => a.getAttribute("href")!);

describe("J5 home page for a recruiter", () => {
  // Felipe, J5: parking, the professional Spot work, then the portable monitoring system.
  it("opens the work section with the three approved featured projects, in order", () => {
    for (const lang of ["fr", "en"] as const) {
      const work = render(Work, lang);
      const cards = [...work.querySelectorAll("[data-project]")].map((el) => el.getAttribute("data-project"));
      expect(cards.slice(0, 3)).toEqual(["parking-platform", "spot-mission-imaging", "android-raspberry-arduino"]);
      expect(projects.filter((p) => p.featured).map((p) => p.slug)).toEqual(cards.slice(0, 3));
      // The six others, the heat-seeking Spot project among them; all nine keep their case study link.
      expect(cards.slice(3)).toHaveLength(6);
      expect(cards.slice(3)).toContain("spot-thermal-mission");
      // next/link drops the trailing slash outside the app; the export adds it back.
      const linked = hrefs(work).map((h) => h.replace(/\/$/, ""));
      for (const p of projects) expect(linked).toContain(casePath(lang, p.slug).replace(/\/$/, ""));
    }
  });

  it("lists the ÉTS bachelor's before the Cégep diploma, each with its own facade", () => {
    for (const lang of ["fr", "en"] as const) {
      const items = [...render(EducationList, lang).querySelectorAll("ol > li")];
      expect(items[0].textContent).toMatch(/ÉTS/);
      expect(items[0].textContent).toMatch(/génie logiciel|Software Engineering/);
      expect(items[1].textContent).toMatch(/Cégep de Sept-Îles/);
      expect(items.map((li) => li.getAttribute("data-scan-variant"))).toEqual(["ets", "cegep", "ets"]);
    }
    // Before any entry is reached, and on the ÉTS entries, the cloud is the ÉTS facade.
    expect(shapeFor("education", null, null)).toBe("ets");
    expect(shapeFor("education", "ets", null)).toBe("ets");
    expect(shapeFor("education", "cegep", null)).toBe("cegep");
    const education = scanSections.find((s) => s.id === "education")!;
    expect(education.subject.fr).toMatch(/ÉTS/);
    expect(education.variants?.cegep.fr).toMatch(/Cégep/);
  });

  it("links to no GitHub profile, and keeps email, LinkedIn and the résumé", () => {
    for (const lang of ["fr", "en"] as const) {
      const links = [...hrefs(render(Contact, lang)), ...hrefs(render(Footer, lang)), ...hrefs(render(Hero, lang))];
      expect(links.filter((h) => /github\.com/i.test(h))).toEqual(profile.repositories.map((r) => r.url));
      expect(links).toContain(`mailto:${profile.email}`);
      expect(links).toContain(profile.linkedin);
      expect(links.some((h) => h.endsWith(profile.resume[lang]!))).toBe(true);
    }
  });

  it("says on the first screen who, where he studies, his fields, a result and his availability", () => {
    const expected = {
      fr: [/Étudiant en génie logiciel à l’ÉTS/, /Développement logiciel · Robotique · Systèmes embarqués/, /seul développeur/, /janvier 2027/, /Montréal/],
      en: [/Software engineering student at ÉTS/, /Software development · Robotics · Embedded systems/, /sole developer/, /January 2027/, /Montréal/],
    };
    for (const lang of ["fr", "en"] as const) {
      const hero = render(Hero, lang);
      for (const re of expected[lang]) expect(hero.textContent).toMatch(re);
      const links = hrefs(hero);
      expect(links[0]).toBe("#work");
      expect(links).toContain("#contact");
      expect(hero.querySelector("a[download]")?.getAttribute("href")).toMatch(new RegExp(`${profile.resume[lang]}$`));
    }
  });
});
