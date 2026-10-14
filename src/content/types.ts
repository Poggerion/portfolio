export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A string available in every locale. Presentation code never branches on language. */
export type Localized<T = string> = Record<Locale, T>;

/** The four areas the creative mode lets visitors explore. */
export type Domain = "software" | "robotics" | "embedded" | "data";

/** How Felipe was involved. Shown on every project so team work is never presented as solo work. */
export type Involvement = "solo" | "team" | "course" | "work";

export interface Role {
  title: Localized;
  period: Localized;
}

export interface Experience {
  id: string;
  organization: string;
  organizationDetail?: Localized;
  /** Rendered only when present. */
  location?: string;
  period: Localized;
  /** ISO-like sortable start, used only for ordering. */
  start: string;
  heading: Localized;
  roles?: Role[];
  /** Label shown above highlights that cover several roles without attributing each one to a role. */
  highlightsLabel?: Localized;
  highlights: Localized[];
  stack: string[];
  /** Technologies that were only explored, never shipped. Rendered differently. */
  explored?: string[];
  domains: Domain[];
  /** Case study that tells this experience in depth, if any. */
  caseStudy?: string;
}

export interface CaseStudySection {
  heading: Localized;
  body?: Localized;
  points?: Localized[];
}

export interface Project {
  slug: string;
  title: Localized;
  /** One-line summary for cards and the creative mode. */
  summary: Localized;
  involvement: Involvement;
  /** Who did the work, written out (e.g. "Team of two"). */
  team: Localized;
  context: Localized;
  period: Localized;
  domains: Domain[];
  stack: string[];
  explored?: string[];
  /** Case study body. */
  sections: CaseStudySection[];
  /** Honest limits a reader should know (e.g. prototype, approximate behaviour). */
  limits?: Localized[];
  featured?: boolean;
}

export interface SkillGroup {
  id: string;
  label: Localized;
  domain: Domain;
  /** Short sentence saying where the skills were used, instead of a logo wall. */
  evidence: Localized;
  items: string[];
  explored?: string[];
}

export interface Education {
  id: string;
  degree: Localized;
  school: string;
  location: string;
  period: Localized;
  /** code: the official course number when known, otherwise a short localized label. */
  courses: { code: Localized; title: Localized; detail: Localized }[];
}
