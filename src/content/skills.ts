import type { Education, SkillGroup } from "./types";

/** Grouped by domain, each with a sentence of evidence instead of a logo wall. Most relevant items first: six are shown, the rest open on demand. */
export const skillGroups: SkillGroup[] = [
  {
    id: "mobile-web",
    domain: "software",
    label: { fr: "Mobile et web", en: "Mobile and web" },
    evidence: {
      fr: "Une application React Native livrée à l'ITMI; des applications Blazor, ASP.NET Core et PHP au DEC.",
      en: "A React Native app shipped at ITMI; Blazor, ASP.NET Core and PHP apps in college.",
    },
    items: ["TypeScript", "React Native", "Expo", "PHP", "C#", "ASP.NET Core", "JavaScript", "Blazor", "Android", "Java"],
  },
  {
    id: "quality",
    domain: "software",
    label: { fr: "Tests et conception", en: "Testing and design" },
    evidence: {
      fr: "Tests pytest à l'ITMI; tests unitaires, d'intégration et boîte noire à l'ÉTS; MVC et patrons de conception.",
      en: "pytest suites at ITMI; unit, integration and black-box testing at ÉTS; MVC and design patterns.",
    },
    items: ["pytest", "JaCoCo", "Git", "Gitea", "Azure DevOps", "Agile/Scrum", "JavaFX", "MVC", "GitLab"],
  },
  {
    id: "robotics",
    domain: "robotics",
    label: { fr: "Robotique et vision", en: "Robotics and vision" },
    evidence: {
      fr: "Missions et traitement d'images avec le robot Spot, en emploi et en projet de cours.",
      en: "Missions and image processing with the Spot robot, at work and in coursework.",
    },
    items: ["Python", "Spot SDK", "OpenCV", "Pillow", "NumPy", "Rust"],
    explored: ["C++"],
  },
  {
    id: "embedded",
    domain: "embedded",
    label: { fr: "Embarqué et objets connectés", en: "Embedded and IoT" },
    evidence: {
      fr: "Projet Android, Raspberry Pi et Arduino pour un client; laboratoires MQTT, Bluetooth Low Energy et LoRaWAN.",
      en: "An Android, Raspberry Pi and Arduino project for a client; MQTT, Bluetooth Low Energy and LoRaWAN labs.",
    },
    items: ["Raspberry Pi", "Arduino", "MQTT", "GPIO", "I2C", "SPI", "UART", "C"],
  },
  {
    id: "data",
    domain: "data",
    label: { fr: "Données", en: "Data" },
    evidence: {
      fr: "PostgreSQL et SQL Server à l'ITMI; Oracle et PL/SQL au DEC; visualisations Grafana.",
      en: "PostgreSQL and SQL Server at ITMI; Oracle and PL/SQL in college; Grafana visualizations.",
    },
    items: ["SQL", "PostgreSQL", "SQL Server", "Oracle", "PL/SQL", "Grafana", "MariaDB", "Entity Framework"],
  },
  {
    id: "infrastructure",
    domain: "data",
    label: { fr: "Systèmes et infrastructure", en: "Systems and infrastructure" },
    evidence: {
      fr: "Docker dans les projets de l'ITMI; serveurs Linux et Windows Server, virtualisation et supervision au DEC.",
      en: "Docker across ITMI projects; Linux and Windows Server, virtualization and monitoring in college.",
    },
    items: ["Docker", "Linux", "Bash", "Windows Server", "VMware ESXi", "Zabbix", "PowerShell", "Maven"],
  },
];

/** In order: the Cégep, then ÉTS. The scan follows the same order, from one facade to the other. */
export const education: Education[] = [
  {
    id: "cegep",
    degree: { fr: "DEC en techniques de l'informatique", en: "College Diploma (DEC) in Computer Science Technology" },
    school: "Cégep de Sept-Îles",
    location: "Sept-Îles",
    period: { fr: "Diplômé en 2024", en: "Graduated 2024" },
    courses: [
      {
        code: { fr: "420-63W", en: "420-63W" },
        title: { fr: "Développement web transactionnel", en: "Transactional Web Development" },
        detail: { fr: "Blazor, API REST ASP.NET Core, Entity Framework Core.", en: "Blazor, ASP.NET Core REST API, Entity Framework Core." },
      },
      {
        code: { fr: "420-54G", en: "420-54G" },
        title: { fr: "Objets connectés", en: "Connected Objects" },
        detail: { fr: "Arduino, MQTT, BLE, LoRaWAN, projet Spot.", en: "Arduino, MQTT, BLE, LoRaWAN, Spot project." },
      },
      {
        // This course and the networking series use short labels instead of a course number.
        code: { fr: "BD", en: "DB" },
        title: { fr: "Bases de données Oracle", en: "Oracle Databases" },
        detail: { fr: "SQL, PL/SQL, modélisation et normalisation.", en: "SQL, PL/SQL, modelling and normalization." },
      },
      {
        code: { fr: "Réseaux", en: "Networking" },
        title: { fr: "Réseaux I à IV", en: "Networking I to IV" },
        detail: {
          fr: "Cours basés sur le curriculum Cisco CCNA : OSPF, VLAN, VPN IPsec.",
          en: "Courses based on the Cisco CCNA curriculum: OSPF, VLANs, IPsec VPN.",
        },
      },
    ],
  },
  {
    id: "ets",
    degree: { fr: "Baccalauréat en génie logiciel", en: "Bachelor's in Software Engineering" },
    school: "École de technologie supérieure (ÉTS)",
    location: "Montréal",
    period: { fr: "2024 – mai 2029 (prévu)", en: "2024 – May 2029 (expected)" },
    courses: [
      {
        code: { fr: "LOG240", en: "LOG240" },
        title: { fr: "Tests et maintenance", en: "Testing and Maintenance" },
        detail: { fr: "Tests unitaires, d'intégration et boîte noire, couverture.", en: "Unit, integration and black-box testing, coverage." },
      },
      {
        code: { fr: "LOG121", en: "LOG121" },
        title: { fr: "Conception orientée objet", en: "Object-Oriented Design" },
        detail: { fr: "JavaFX, MVC, patrons de conception.", en: "JavaFX, MVC, design patterns." },
      },
    ],
  },
];
