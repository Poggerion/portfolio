import type { Involvement, Localized } from "./types";

/** Interface strings. Content lives in the other files of this folder. */
export const ui = {
  skip: { fr: "Aller au contenu", en: "Skip to content" },
  nav: {
    about: { fr: "À propos", en: "About" },
    work: { fr: "Projets", en: "Work" },
    experience: { fr: "Parcours", en: "Experience" },
    contact: { fr: "Contact", en: "Contact" },
  },
  home: { fr: "Accueil", en: "Home" },
  /** Label of the FR/EN group, in the page's language. */
  language: { fr: "Langue", en: "Language" },
  switchLanguage: { fr: "English version", en: "Version française" },
  scroll: { fr: "Faire défiler", en: "Scroll" },
  sections: {
    about: { fr: "À propos", en: "About" },
    work: { fr: "Projets choisis", en: "Selected work" },
    experience: { fr: "Expérience", en: "Experience" },
    skills: { fr: "Compétences", en: "Skills" },
    education: { fr: "Formation", en: "Education" },
    contact: { fr: "Contact", en: "Contact" },
  },
  contactLead: {
    fr: "Vous offrez un stage à l'hiver 2027 ou un emploi étudiant à Montréal? Écrivez-moi.",
    en: "Offering a winter 2027 internship or a student job in Montréal? Get in touch.",
  },
  email: { fr: "Courriel", en: "Email" },
  copy: { fr: "Copier", en: "Copy" },
  copied: { fr: "Copié", en: "Copied" },
  resume: { fr: "CV (PDF)", en: "Résumé (PDF)" },
  readCase: { fr: "Lire l'étude de cas", en: "Read the case study" },
  backToWork: { fr: "Retour aux projets", en: "Back to work" },
  limits: { fr: "À savoir", en: "Good to know" },
  stack: { fr: "Technologies", en: "Stack" },
  explored: { fr: "exploré", en: "explored" },
  abstractVisual: {
    fr: "Visuel abstrait généré, sans lien avec une capture réelle.",
    en: "Generated abstract visual, not a real screenshot.",
  },
  creative: {
    enter: { fr: "Mode créatif", en: "Creative mode" },
    exit: { fr: "Mode pro", en: "Pro mode" },
    toggleLabel: { fr: "Changer de mode d'affichage", en: "Switch display mode" },
    eyebrow: { fr: "Mode créatif · exploration", en: "Creative mode · explore" },
    title: { fr: "Quatre domaines, un même fil.", en: "Four domains, one thread." },
    hint: {
      fr: "Choisissez un nœud ou un domaine pour voir les projets qui s'y rattachent.",
      en: "Pick a knot or a domain to see the work behind it.",
    },
    escape: { fr: "Échap : revenir au mode pro", en: "Esc: back to pro mode" },
    close: { fr: "Fermer", en: "Close" },
    domains: { fr: "Domaines", en: "Domains" },
    projects: { fr: "Projets", en: "Projects" },
    experience: { fr: "Expérience", en: "Experience" },
    skills: { fr: "Compétences", en: "Skills" },
    viewing: { fr: "Consulté", en: "Viewing" },
    projectCount: { fr: "projets", en: "projects" },
    projectCountOne: { fr: "projet", en: "project" },
  },
  involvement: {
    solo: { fr: "Individuel", en: "Solo" },
    team: { fr: "Équipe", en: "Team" },
    course: { fr: "Cours", en: "Coursework" },
    work: { fr: "Emploi", en: "Work" },
  } satisfies Record<Involvement, Localized>,
} as const;
