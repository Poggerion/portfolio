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
    status: { fr: "Disponibilité", en: "Availability" },
    based: { fr: "Basé à", en: "Based in" },
    /** The hero's first call to action: the three featured case studies. */
    work: { fr: "Voir les projets phares", en: "See featured work" },
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
  /** Five-part case studies. */
  caseStudy: {
    glance: { fr: "En bref", en: "At a glance" },
    role: { fr: "Rôle", en: "Role" },
    outcome: { fr: "Résultat", en: "Outcome" },
    client: { fr: "Pour qui", en: "For whom" },
    setting: { fr: "Cadre", en: "Setting" },
    period: { fr: "Période", en: "Period" },
    contents: { fr: "Sommaire", en: "Contents" },
    parts: {
      intro: { fr: "Introduction", en: "Introduction" },
      problem: { fr: "Problème et contexte", en: "Problem and context" },
      how: { fr: "Fonctionnement", en: "How it works" },
      work: { fr: "Contributions et choix techniques", en: "Contributions and technical choices" },
      results: { fr: "Résultats et limites", en: "Results and limits" },
    },
    constraints: { fr: "Contraintes connues", en: "Known constraints" },
    /** Diagram tag and contributions heading, by who did the work. */
    authors: {
      mine: { tag: { fr: "Mon travail", en: "My work" }, contributions: { fr: "Ce que j’ai réalisé", en: "What I built" } },
      team: { tag: { fr: "Travail de l’équipe", en: "Team work" }, contributions: { fr: "Ce que l’équipe a réalisé", en: "What the team built" } },
      lab: {
        tag: { fr: "Mis en place dans le laboratoire", en: "Set up in the lab" },
        contributions: { fr: "Ce qui a été mis en place", en: "What was set up" },
      },
      course: { tag: { fr: "Dans mes travaux", en: "In my coursework" }, contributions: { fr: "Ce que j’ai réalisé dans ces travaux", en: "What I built in this coursework" } },
    },
    other: { fr: "Autre partie du système", en: "Other part of the system" },
    diagramNote: {
      fr: "Schéma explicatif et simplifié, pas une capture du système réel.",
      en: "Explanatory, simplified diagram, not a capture of the real system.",
    },
    plainWords: { fr: "En clair", en: "In plain words" },
    decisions: { fr: "Choix techniques confirmés", en: "Confirmed technical choices" },
    results: { fr: "Résultats vérifiés", en: "Verified results" },
    limits: { fr: "Limites", en: "Limits" },
    learnings: { fr: "Apprentissages", en: "Learnings" },
    next: { fr: "Projet suivant", en: "Next project" },
  },
  involvement: {
    solo: { fr: "Individuel", en: "Solo" },
    team: { fr: "Équipe", en: "Team" },
    course: { fr: "Cours", en: "Coursework" },
    work: { fr: "Emploi", en: "Work" },
  } satisfies Record<Involvement, Localized>,
} as const;
