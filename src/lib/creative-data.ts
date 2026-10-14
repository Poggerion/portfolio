import { experiences } from "@/content/experience";
import { domains } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import type { Domain } from "@/content/types";
import { ui } from "@/content/ui";
import type { CreativeDomain, CreativeStrings } from "@/components/creative/CreativeLayer";
import { casePath, t, type Locale } from "./i18n";

/** Everything the creative mode shows, resolved for one language on the server. */
export function creativeData(lang: Locale) {
  const list: CreativeDomain[] = domains.map((d) => {
    const own = projects.filter((p) => p.domains.includes(d.id));
    const n = own.length;
    return {
      id: d.id,
      label: t(d.label, lang),
      blurb: t(d.blurb, lang),
      count: `${String(n).padStart(2, "0")} ${t(n === 1 ? ui.creative.projectCountOne : ui.creative.projectCount, lang)}`,
      projects: own.map((p) => ({
        slug: p.slug,
        title: t(p.title, lang),
        meta: `${t(p.period, lang)} · ${t(p.team, lang)}`,
        href: casePath(lang, p.slug),
      })),
      experience: experiences
        .filter((x) => x.domains.includes(d.id))
        .map((x) => ({ title: t(x.heading, lang), meta: `${x.organization} · ${t(x.period, lang)}` })),
      skills: skillGroups
        .filter((g) => g.domain === d.id)
        .map((g) => ({ label: t(g.label, lang), evidence: t(g.evidence, lang), items: g.items })),
    };
  });

  const projectDomains: Record<string, Domain> = Object.fromEntries(projects.map((p) => [p.slug, p.domains[0]]));

  const c = ui.creative;
  const strings: CreativeStrings = {
    eyebrow: t(c.eyebrow, lang),
    title: t(c.title, lang),
    hint: t(c.hint, lang),
    escape: t(c.escape, lang),
    close: t(c.close, lang),
    domains: t(c.domains, lang),
    projects: t(c.projects, lang),
    experience: t(c.experience, lang),
    skills: t(c.skills, lang),
    viewing: t(c.viewing, lang),
    abstractVisual: t(ui.abstractVisual, lang),
  };

  return { domains: list, strings, projectDomains };
}
