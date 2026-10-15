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

/** One box of a case study diagram, and the link that leads into it from the box before. */
export interface FlowNode {
  title: Localized;
  detail?: Localized;
  /** Built by Felipe: drawn with the accent and named in the legend. */
  mine?: boolean;
  /** The link from the previous box. Left out on the first box of a lane. */
  link?: { label?: Localized; both?: boolean };
}

/**
 * The five-part case study (V2): what a recruiter reads on the first screen, then the problem, a
 * diagram, the work and the choices, and the verified results. Every statement is in
 * facts_felipe.md or in Felipe's own validations; what is unknown is left out, not guessed.
 */
export interface CaseStudy {
  /** Kind of work, shown above the title (e.g. "Job · ITMI"). */
  status: Localized;
  /** One plain sentence: what the project is. */
  lede: Localized;
  /** At a glance, on the first screen. */
  role: Localized;
  outcome: Localized;
  /** Who the work was for. */
  client: Localized;
  problem: { body: Localized[]; constraints?: Localized[] };
  diagram: {
    lanes: { label?: Localized; nodes: FlowNode[] }[];
    /** The diagram in plain words, for readers who skip it and for screen readers. */
    explanation: Localized;
  };
  contributions: Localized[];
  /** Technical choices of the project that are confirmed, whoever made them. */
  decisions: Localized[];
  stack: { label: Localized; items: string[]; explored?: string[] }[];
  /** Further work around the project, kept apart from it. */
  around?: { heading: Localized; body?: Localized; points?: Localized[] }[];
  results: Localized[];
  limits: Localized[];
  /** Only what Felipe has stated. */
  learnings?: Localized[];
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
  /** Case study body (pages not yet rewritten in the five-part form). */
  sections?: CaseStudySection[];
  /** Five-part case study; replaces `sections` and `limits` on the page when present. */
  caseStudy?: CaseStudy;
  /** Honest limits a reader should know (e.g. prototype, approximate behaviour). */
  limits?: Localized[];
  /** Featured projects get a large card with the fields below. */
  featured?: {
    /** Felipe's role, in a few words. */
    role: Localized;
    /** One sentence on what the work achieved. */
    impact: Localized;
    /** Three or four technologies for the card. */
    stack: string[];
    /** A real image of the project, when one exists (file under public/projects/<slug>/). */
    cover?: { src: string; alt: Localized; width: number; height: number };
  };
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
