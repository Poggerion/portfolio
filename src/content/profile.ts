import type { Domain, Localized } from "./types";

export const profile = {
  name: "Felipe Portugal",
  /** Aesthetic signature, not a job title. */
  signature: {
    fr: "Construire au-delà du code.",
    en: "Building beyond code.",
  } satisfies Localized,
  /** Shown under the name in the hero. */
  role: { fr: "Étudiant en génie logiciel", en: "Software engineering student" } satisfies Localized,
  /** Hero hook: what he has built, in one sentence. */
  hook: {
    fr: "Du téléphone au robot : une application mobile déployée au Cégep de Sept-Îles, des outils Python pour le robot Spot, et une passion pour l’IA et les systèmes embarqués.",
    en: "From phone to robot: a mobile app deployed at Cégep de Sept-Îles, Python tools for the Spot robot, and a passion for AI and embedded systems.",
  } satisfies Localized,
  /** Meta description and social previews. */
  tagline: {
    fr: "Étudiant en génie logiciel à l’ÉTS, intéressé par le développement logiciel, la robotique et les systèmes connectés.",
    en: "Software engineering student at ÉTS, interested in software development, robotics and connected systems.",
  } satisfies Localized,
  location: "Montréal, Québec",
  coordinates: "45.50° N  73.57° W",
  email: "felipe-alberto.padilla-portugal.1@ens.etsmtl.ca",
  linkedin: "https://www.linkedin.com/in/felipe-portugal-151a75225",
  linkedinLabel: "linkedin.com/in/felipe-portugal-151a75225",
  github: "https://github.com/Poggerion",
  githubLabel: "github.com/Poggerion",
  languages: { fr: "Français, anglais, espagnol", en: "French, English, Spanish" } satisfies Localized,
  /** Résumé PDFs in public/cv/, without the phone number. A null hides every résumé link. */
  resume: {
    fr: "/cv/felipe-portugal-cv-fr.pdf",
    en: "/cv/felipe-portugal-cv-en.pdf",
  } as Record<"fr" | "en", string | null>,
  studies: {
    fr: "ÉTS, baccalauréat prévu en mai 2029",
    en: "ÉTS, bachelor’s expected May 2029",
  } satisfies Localized,
  status: {
    fr: "Recherche un stage · hiver 2027",
    en: "Seeking an internship · winter 2027",
  } satisfies Localized,
  availability: [
    {
      label: { fr: "Stage visé", en: "Internship" },
      value: {
        fr: "4 mois, du 5 janvier au 23 avril 2027. Ouvert à 8 mois (janvier à août 2027).",
        en: "4 months, January 5 to April 23, 2027. Open to 8 months (January to August 2027).",
      },
    },
    {
      label: { fr: "Horaire", en: "Schedule" },
      value: {
        fr: "Temps plein, 35 h/semaine. Disponible dès maintenant à temps partiel.",
        en: "Full time, 35 h/week. Available part time right now.",
      },
    },
    {
      label: { fr: "Lieu", en: "Location" },
      value: {
        fr: "Montréal et environs, hybride de préférence",
        en: "Montréal area, hybrid preferred",
      },
    },
    {
      label: { fr: "Diplôme", en: "Graduation" },
      value: { fr: "Baccalauréat prévu en mai 2029", en: "Bachelor’s expected May 2029" },
    },
  ] satisfies { label: Localized; value: Localized }[],
  about: [
    {
      fr: "Je suis passionné par l’intelligence artificielle et les systèmes embarqués.",
      en: "I’m passionate about artificial intelligence and embedded systems.",
    },
    {
      fr: "Mon parcours a commencé au Cégep de Sept-Îles, avec un DEC en techniques de l’informatique. J’ai ensuite travaillé à l’Institut technologique de maintenance industrielle (ITMI) : d’abord en robotique, sur le robot Spot de Boston Dynamics en Python et sur la récupération de données de capteurs en Rust, puis sur un système de gestion des stationnements. J’ai été le seul développeur de son application mobile, et j’ai développé son interface web administrateur en PHP.",
      en: "My path started at Cégep de Sept-Îles, with a college diploma in computer science technology. I then worked at the Institut technologique de maintenance industrielle (ITMI): first in robotics, on Boston Dynamics' Spot robot in Python and on sensor data collection in Rust, then on a parking management system. I was the sole developer of its mobile app, and I built its admin web interface in PHP.",
    },
    {
      fr: "Je poursuis aujourd’hui un baccalauréat en génie logiciel à l’ÉTS, à Montréal, et je cherche un stage pour l’hiver 2027.",
      en: "I’m now completing a bachelor’s in software engineering at ÉTS in Montréal, and looking for a winter 2027 internship.",
    },
  ] satisfies Localized[],
};

export const domains: { id: Domain; label: Localized; blurb: Localized }[] = [
  {
    id: "software",
    label: { fr: "Logiciel", en: "Software" },
    blurb: {
      fr: "Applications mobiles et web, API REST, tests.",
      en: "Mobile and web apps, REST APIs, testing.",
    },
  },
  {
    id: "robotics",
    label: { fr: "Robotique", en: "Robotics" },
    blurb: {
      fr: "Missions et traitement d’images avec le robot Spot.",
      en: "Missions and image processing with the Spot robot.",
    },
  },
  {
    id: "embedded",
    label: { fr: "Systèmes embarqués", en: "Embedded Systems" },
    blurb: {
      fr: "Android, Raspberry Pi, Arduino et leurs protocoles.",
      en: "Android, Raspberry Pi, Arduino and their protocols.",
    },
  },
  {
    id: "data",
    label: { fr: "Données et infrastructure", en: "Data & Infrastructure" },
    blurb: {
      fr: "Bases de données, visualisation, serveurs et supervision.",
      en: "Databases, visualization, servers and monitoring.",
    },
  },
];
