import type { Localized } from "./types";
import { ui } from "./ui";

/**
 * The seven scans of the home page, in reading order. Each section of the page has one; the
 * HUD of the scan panel names what the point cloud shows for it.
 */
export interface ScanSection {
  /** id of the page section (also its anchor). */
  id: string;
  subject: Localized;
  /** Alternative subjects inside the section, keyed by the data-scan-variant of an element. */
  variants?: Record<string, Localized>;
}

export const scanSections: ScanSection[] = [
  { id: "top", subject: { fr: "Portrait · Felipe Portugal", en: "Portrait · Felipe Portugal" } },
  {
    id: "about",
    subject: { fr: "Sept-Îles → Montréal · 50.2°N → 45.5°N", en: "Sept-Îles → Montréal · 50.2°N → 45.5°N" },
  },
  { id: "work", subject: { fr: "Projets · application mobile", en: "Work · mobile app" } },
  { id: "experience", subject: { fr: "Spot · ITMI, Sept-Îles", en: "Spot · ITMI, Sept-Îles" } },
  { id: "skills", subject: { fr: "Carte électronique · Raspberry Pi", en: "Circuit board · Raspberry Pi" } },
  {
    id: "education",
    subject: { fr: "Façade · Cégep de Sept-Îles", en: "Facade · Cégep de Sept-Îles" },
    variants: { ets: { fr: "Façade · ÉTS, Montréal", en: "Facade · ÉTS, Montréal" } },
  },
  {
    id: "contact",
    subject: {
      fr: `« ${ui.contactTitle.a.fr} ${ui.contactTitle.b.fr} »`,
      en: `“${ui.contactTitle.a.en} ${ui.contactTitle.b.en}”`,
    },
  },
];

/** "03/07" for a section id. */
export function scanNumber(id: string): string {
  const index = Math.max(0, scanSections.findIndex((s) => s.id === id));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(index + 1)}/${pad(scanSections.length)}`;
}
