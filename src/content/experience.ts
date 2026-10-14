import type { Experience } from "./types";

/** Shared ITMI 2025 contributions are never attributed to one role. */
export const experiences: Experience[] = [
  {
    id: "itmi-software",
    organization: "ITMI",
    organizationDetail: {
      fr: "Institut technologique de maintenance industrielle",
      en: "Institut technologique de maintenance industrielle",
    },
    period: { fr: "janv. 2025 – sept. 2025", en: "Jan 2025 – Sep 2025" },
    start: "2025-01",
    heading: { fr: "Développement logiciel", en: "Software development" },
    roles: [
      {
        title: {
          fr: "Assistant développeur en visualisation de données industrielles",
          en: "Assistant Developer, Industrial Data Visualization",
        },
        period: { fr: "mai – sept. 2025", en: "May – Sep 2025" },
      },
      {
        title: {
          fr: "Stagiaire développeur en visualisation de données industrielles",
          en: "Developer Intern, Industrial Data Visualization",
        },
        period: { fr: "janv. – mai 2025", en: "Jan – May 2025" },
      },
    ],
    highlightsLabel: {
      fr: "Contributions de janv. à sept. 2025, les deux fonctions confondues",
      en: "Contributions, Jan – Sep 2025, both roles combined",
    },
    highlights: [
      {
        fr: "Développé seul l'application mobile côté client d'un système de gestion des stationnements, déployé à l'interne pour le personnel du Cégep de Sept-Îles et quelques utilisateurs externes.",
        en: "Sole developer of the client mobile app for a parking management system, deployed internally to Cégep de Sept-Îles staff and a few external users.",
      },
      {
        fr: "Développé l'interface web administrateur du même système en PHP et langages web : pages, formulaires et vues.",
        en: "Built the admin web interface for the same system in PHP and web languages: pages, forms and views.",
      },
      {
        fr: "Développé des visualisations de données industrielles avec PHP et Grafana, et des fonctionnalités d'une application web de gestion d'inventaire et de contrats en PHP.",
        en: "Built industrial data visualizations with PHP and Grafana, and features of a PHP inventory and contract management web app.",
      },
      {
        fr: "Développé des API pour Nomad, un framework interne de l'ITMI.",
        en: "Built APIs for Nomad, an ITMI in-house framework.",
      },
      {
        fr: "Contribué à des endpoints d'API REST, à des composantes backend et à un backend serveur en PHP, dans des projets conteneurisés avec Docker.",
        en: "Contributed to REST API endpoints, backend components and a PHP server backend, in Docker-based projects.",
      },
      {
        fr: "Établi la connexion PostgreSQL, écrit des requêtes et des migrations; conçu des schémas et requêtes SQL Server pour certaines plateformes web.",
        en: "Set up the PostgreSQL connection, wrote queries and migrations; designed SQL Server schemas and queries for some web platforms.",
      },
      {
        fr: "Mis en place l'authentification de base, l'authentification Microsoft et l'intégration Stripe.",
        en: "Implemented basic authentication, Microsoft authentication and Stripe integration.",
      },
      {
        fr: "Écrit en Python avec pytest des tests automatisés client et serveur, incluant des tests de charge.",
        en: "Wrote automated client and server tests in Python with pytest, including load tests.",
      },
      {
        fr: "Travaillé en Agile/Scrum avec pull requests et revues de code dans Gitea, et tickets dans Azure DevOps Boards.",
        en: "Worked in Agile/Scrum with pull requests and code reviews in Gitea and tickets in Azure DevOps Boards.",
      },
    ],
    stack: ["React Native", "TypeScript", "Expo", "PHP", "REST API", "PostgreSQL", "SQL Server", "Docker", "Grafana", "pytest"],
    domains: ["software", "data"],
    caseStudy: "parking-platform",
  },
  {
    id: "itmi-robotics",
    organization: "ITMI",
    period: { fr: "mai 2024 – août 2024", en: "May 2024 – Aug 2024" },
    start: "2024-05",
    heading: { fr: "Conseiller technique, systèmes embarqués", en: "Technical Advisor, Embedded Systems" },
    highlights: [
      {
        fr: "Développé en Python avec le Spot SDK un prototype fonctionnel : sélection de missions autonomes existantes et enregistrement de nouvelles missions.",
        en: "Built a working prototype in Python with the Spot SDK: selecting existing autonomous missions and recording new ones.",
      },
      {
        fr: "Mis en place la prise de photos pendant les missions et leur téléversement vers un serveur Linux, où elles sont traitées automatiquement avec les données des payloads (OpenCV, Pillow, NumPy).",
        en: "Set up photo capture during missions and upload to a Linux server, where the images are processed automatically with payload data (OpenCV, Pillow, NumPy).",
      },
      {
        fr: "Développé en Rust la récupération de données de capteurs extérieurs, exploitées dans Grafana.",
        en: "Wrote Rust code to collect outdoor sensor data, used in Grafana.",
      },
      {
        fr: "Formé le personnel et rédigé la documentation technique.",
        en: "Trained staff and wrote technical documentation.",
      },
    ],
    stack: ["Python", "Spot SDK", "Rust", "OpenCV", "Pillow", "NumPy", "Linux", "Grafana"],
    domains: ["robotics", "data"],
    caseStudy: "spot-mission-imaging",
  },
  {
    id: "itmi-research",
    organization: "ITMI",
    period: { fr: "Hiver 2024", en: "Winter 2024" },
    start: "2024-01",
    heading: { fr: "Auxiliaire de recherche", en: "Research Assistant" },
    highlights: [
      {
        fr: "Développé une preuve de concept en Python avec le Spot SDK, avec tests et validation.",
        en: "Built a Python proof of concept with the Spot SDK, including testing and validation.",
      },
      {
        fr: "Exploité différents capteurs et payloads de la plateforme Spot.",
        en: "Worked with various sensors and payloads on the Spot platform.",
      },
    ],
    stack: ["Python", "Spot SDK"],
    explored: ["C++"],
    domains: ["robotics"],
  },
  {
    id: "cisss",
    organization: "CISSS de la Côte-Nord",
    period: { fr: "Été 2023 (stage) · automne 2023", en: "Summer 2023 (intern) · fall 2023" },
    start: "2023-05",
    heading: { fr: "Opérateur en informatique", en: "IT Operator" },
    highlights: [
      {
        fr: "Remplacé et configuré des postes de travail et des portables; déployé des mises à jour sous Windows.",
        en: "Replaced and configured workstations and laptops; deployed Windows updates.",
      },
      {
        fr: "Assisté les techniciens : soutien matériel et logiciel, remplacement de composants, câblage.",
        en: "Supported technicians: hardware and software support, component replacement, cabling.",
      },
      {
        fr: "Installé et configuré des applications et du matériel réseau.",
        en: "Installed and configured applications and network hardware.",
      },
    ],
    stack: ["Windows"],
    domains: ["data"],
  },
];

export const capra = {
  title: { fr: "CAPRA, équipe logiciel", en: "CAPRA, software team" },
  context: { fr: "Club étudiant de robotique · ÉTS", en: "Student robotics club · ÉTS" },
  period: { fr: "Automne 2024", en: "Fall 2024" },
  detail: {
    fr: "Recherche de composantes pour plateformes robotiques, tests de performance matérielle et de compatibilité.",
    en: "Researched components for robotic platforms; ran hardware performance and compatibility tests.",
  },
};
