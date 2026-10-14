import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { experiences } from "../src/content/experience";
import { profile } from "../src/content/profile";
import { projects } from "../src/content/projects";
import { locales } from "../src/content/types";
import { content, published } from "./content-texts";

describe("content", () => {
  it("has every localized field in both languages", () => {
    const check = (value: unknown, path: string) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const keys = Object.keys(value);
        if (keys.includes("fr") || keys.includes("en")) {
          for (const l of locales) expect(value, `${path} missing ${l}`).toHaveProperty(l);
          return;
        }
        for (const [k, v] of Object.entries(value)) check(v, `${path}.${k}`);
      } else if (Array.isArray(value)) value.forEach((v, i) => check(v, `${path}[${i}]`));
    };
    check(content, "content");
  });

  it("uses unique, URL-safe case study slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("links experiences only to existing case studies", () => {
    for (const xp of experiences) {
      if (xp.caseStudy) expect(projects.some((p) => p.slug === xp.caseStudy)).toBe(true);
    }
  });

  it("links only to Felipe's own GitHub profile", () => {
    const links = published.match(/github\.com\/[\w-]+/gi) ?? [];
    for (const l of links) expect(l.toLowerCase()).toBe("github.com/poggerion");
  });

  it("links only to résumé PDFs that exist", () => {
    for (const l of locales) {
      const r = profile.resume[l];
      if (r === null) continue;
      expect(r).toMatch(/\.pdf$/);
      expect(existsSync(join("public", r)), r).toBe(true);
    }
  });

  it("has a 1200×630 share image per language", () => {
    for (const l of locales) {
      const png = readFileSync(join("public", "og", `og-${l}.png`));
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
    }
  });
});
