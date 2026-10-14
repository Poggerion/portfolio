import type { Involvement, Localized } from "./types";

/** Interface strings. Content lives in the other files of this folder. */
export const ui = {
  skip: { fr: "Aller au contenu", en: "Skip to content" },
  nav: {
    about: { fr: "À propos", en: "About" },
    work: { fr: "Projets", en: "Work" },
    experience: { fr: "Expérience", en: "Experience" },
    skills: { fr: "Compétences", en: "Skills" },
    education: { fr: "Formation", en: "Education" },
    contact: { fr: "Contact", en: "Contact" },
  },
  mainNav: { fr: "Navigation principale", en: "Main navigation" },
  home: { fr: "Accueil", en: "Home" },
  /** Label of the FR/EN group, in the page's language. */
  language: { fr: "Langue", en: "Language" },
  switchLanguage: { fr: "English version", en: "Version française" },
  contactMe: { fr: "Me contacter", en: "Get in touch" },
  downloadResume: { fr: "Télécharger le CV", en: "Download résumé" },
  hero: {
    status: { fr: "Statut", en: "Status" },
    based: { fr: "Basé à", en: "Based in" },
    studies: { fr: "Études", en: "Studies" },
  },
  sections: {
    about: { fr: "À propos", en: "About" },
    work: { fr: "Projets choisis", en: "Selected work" },
    experience: { fr: "Expérience", en: "Experience" },
    skills: { fr: "Compétences", en: "Skills" },
    education: { fr: "Formation", en: "Education" },
    contact: { fr: "Contact", en: "Contact" },
  },
  /** Contact title in two halves, the second in italics. The point cloud writes it too. */
  contactTitle: {
    a: { fr: "Au plaisir", en: "Always happy" },
    b: { fr: "d’échanger.", en: "to talk." },
  },
  contactLead: {
    fr: "Je suis disponible pour un stage à l’hiver 2027, à Montréal. Le courriel reste le moyen le plus simple de me joindre.",
    en: "I’m available for a winter 2027 internship in Montréal. Email is the easiest way to reach me.",
  },
  email: { fr: "Courriel", en: "Email" },
  copy: { fr: "Copier", en: "Copy" },
  copied: { fr: "Copié", en: "Copied" },
  resume: { fr: "CV (PDF)", en: "Résumé (PDF)" },
  readCase: { fr: "Lire l’étude de cas", en: "Read the case study" },
  otherProjects: { fr: "Autres projets", en: "More projects" },
  showMore: { fr: "Voir plus", en: "Show more" },
  showLess: { fr: "Voir moins", en: "Show less" },
  more: { fr: "autres", en: "more" },
  backToWork: { fr: "Retour aux projets", en: "Back to work" },
  limits: { fr: "À savoir", en: "Good to know" },
  stack: { fr: "Technologies", en: "Stack" },
  explored: { fr: "exploré", en: "explored" },
  involvement: {
    solo: { fr: "Individuel", en: "Solo" },
    team: { fr: "Équipe", en: "Team" },
    course: { fr: "Cours", en: "Coursework" },
    work: { fr: "Emploi", en: "Work" },
  } satisfies Record<Involvement, Localized>,
} as const;
