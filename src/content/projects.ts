import type { Project } from "./types";

/**
 * Case studies. The three featured ones open the work section as large cards.
 */
export const projects: Project[] = [
  {
    slug: "parking-platform",
    featured: {
      role: { fr: "Seul développeur de l'application mobile · ITMI", en: "Sole developer of the mobile app · ITMI" },
      impact: {
        fr: "Déployée pour l'ensemble du personnel du Cégep de Sept-Îles et quelques utilisateurs externes.",
        en: "Deployed to all Cégep de Sept-Îles staff and a few external users.",
      },
      stack: ["React Native", "TypeScript", "Expo", "PHP"],
    },
    title: { fr: "Gestion des stationnements", en: "Parking management" },
    summary: {
      fr: "Application mobile React Native (seul développeur) et interface web administrateur en PHP, pour le Cégep de Sept-Îles.",
      en: "A React Native mobile app (sole developer) and a PHP admin web interface, for Cégep de Sept-Îles.",
    },
    involvement: "work",
    team: { fr: "Seul développeur de l'application mobile", en: "Sole developer of the mobile app" },
    context: { fr: "ITMI · emploi et stage", en: "ITMI · internship and job" },
    period: { fr: "2025", en: "2025" },
    domains: ["software", "data"],
    stack: ["React Native", "TypeScript", "Expo", "PHP", "REST API", "PostgreSQL", "Docker", "pytest", "Gitea", "Azure DevOps"],
    sections: [
      {
        heading: { fr: "Contexte", en: "Context" },
        body: {
          fr: "L'ITMI a développé un système de gestion des stationnements destiné au Cégep de Sept-Îles. Il est déployé à l'interne pour l'ensemble du personnel et quelques utilisateurs externes; il n'est pas publié sur les magasins d'applications.",
          en: "ITMI built a parking management system for Cégep de Sept-Îles. It is deployed internally to all staff and a few external users; it is not published on the app stores.",
        },
      },
      {
        heading: { fr: "Ma contribution", en: "My contribution" },
        points: [
          {
            fr: "Développement complet de l'application mobile côté client, en React Native, TypeScript et Expo. J'en étais le seul développeur.",
            en: "Built the entire client mobile app in React Native, TypeScript and Expo, as its only developer.",
          },
          {
            fr: "Développement de l'interface web administrateur en PHP et langages web : pages, formulaires et vues.",
            en: "Built the admin web interface in PHP and web languages: pages, forms and views.",
          },
        ],
      },
      {
        heading: { fr: "Autour du projet, à l'ITMI", en: "Around the project, at ITMI" },
        body: {
          fr: "Pendant la même période, j'ai aussi travaillé sur d'autres aspects des projets de l'équipe.",
          en: "Over the same period, I also worked on other parts of the team's projects.",
        },
        points: [
          {
            fr: "Développement d'API pour Nomad, un framework interne de l'ITMI.",
            en: "APIs for Nomad, an ITMI in-house framework.",
          },
          {
            fr: "Contribution à des endpoints d'API REST, à des composantes backend et à un backend serveur en PHP.",
            en: "Contributions to REST API endpoints, backend components and a PHP server backend.",
          },
          {
            fr: "PostgreSQL : connexion, requêtes et migrations. Docker comme fondement des projets.",
            en: "PostgreSQL: connection, queries and migrations. Docker as the foundation of each project.",
          },
          {
            fr: "Authentification de base, authentification Microsoft et intégration Stripe.",
            en: "Basic authentication, Microsoft authentication and Stripe integration.",
          },
          {
            fr: "Tests automatisés client et serveur en Python avec pytest, incluant des tests de charge.",
            en: "Automated client and server tests in Python with pytest, including load tests.",
          },
        ],
      },
      {
        heading: { fr: "Façon de travailler", en: "How we worked" },
        body: {
          fr: "Sprints et réunions quotidiennes, pull requests et revues de code dans Gitea avec une stratégie de branches, tickets dans Azure DevOps Boards. J'ai aussi assuré la maintenance d'applications en production, formé du personnel et échangé avec les clients.",
          en: "Sprints and daily stand-ups, pull requests and code reviews in Gitea with a branching strategy, tickets in Azure DevOps Boards. I also maintained applications in production, trained staff and worked with clients.",
        },
      },
    ],
    limits: [
      {
        fr: "Le code appartient à l'ITMI : aucune capture ni extrait n'est publié ici.",
        en: "The code belongs to ITMI: no screenshots or excerpts are published here.",
      },
    ],
  },
  {
    slug: "spot-mission-imaging",
    featured: {
      role: { fr: "Conseiller technique · ITMI", en: "Technical advisor · ITMI" },
      impact: {
        fr: "Un prototype fonctionnel qui sélectionne et enregistre des missions autonomes, et des photos de mission traitées automatiquement sur un serveur Linux.",
        en: "A working prototype that selects and records autonomous missions, with mission photos processed automatically on a Linux server.",
      },
      stack: ["Python", "Spot SDK", "OpenCV", "Rust"],
    },
    title: { fr: "Missions et images avec Spot", en: "Spot missions and imaging" },
    summary: {
      fr: "Prototype Python avec le Spot SDK : missions autonomes, photos, traitement sur serveur Linux.",
      en: "Python prototype with the Spot SDK: autonomous missions, photos, processing on a Linux server.",
    },
    involvement: "work",
    team: { fr: "Emploi d'été", en: "Summer job" },
    context: { fr: "ITMI · conseiller technique", en: "ITMI · technical advisor" },
    period: { fr: "Mai – août 2024", en: "May – Aug 2024" },
    domains: ["robotics", "data"],
    stack: ["Python", "Spot SDK", "OpenCV", "Pillow", "NumPy", "Linux", "Rust", "Grafana"],
    sections: [
      {
        heading: { fr: "Contexte", en: "Context" },
        body: {
          fr: "L'ITMI travaille avec un robot quadrupède Spot de Boston Dynamics. J'ai travaillé sur deux aspects : la gestion de ses missions autonomes et le traitement des images et données qu'il recueille.",
          en: "ITMI works with a Boston Dynamics Spot quadruped robot. I worked on two things: managing its autonomous missions, and processing the images and data it collects.",
        },
      },
      {
        heading: { fr: "Ma contribution", en: "My contribution" },
        points: [
          {
            fr: "Prototype fonctionnel en Python avec le Spot SDK : sélection de missions autonomes existantes et enregistrement de nouvelles missions.",
            en: "Working Python prototype with the Spot SDK: selecting existing autonomous missions and recording new ones.",
          },
          {
            fr: "Prise de photos pendant les missions et téléversement vers un serveur Linux, où elles sont traitées avec les données de différents payloads (OpenCV, Pillow, NumPy), puis transmises aux utilisateurs concernés.",
            en: "Photo capture during missions and upload to a Linux server, where they are processed with data from several payloads (OpenCV, Pillow, NumPy), then sent to the people who need them.",
          },
          {
            fr: "Récupération en Rust des données de capteurs extérieurs, exploitées dans Grafana.",
            en: "Rust code to collect outdoor sensor data, used in Grafana.",
          },
          {
            fr: "Formation du personnel et documentation technique.",
            en: "Staff training and technical documentation.",
          },
        ],
      },
      {
        heading: { fr: "Avant cela", en: "Before that" },
        body: {
          fr: "À l'hiver 2024, comme auxiliaire de recherche, j'avais développé une preuve de concept Python avec le Spot SDK, testée et validée, et exploré le C++ avec le même SDK.",
          en: "In winter 2024, as a research assistant, I had built a tested and validated Python proof of concept with the Spot SDK, and explored C++ with the same SDK.",
        },
      },
    ],
    explored: ["C++"],
    limits: [
      {
        fr: "Il s'agit d'un prototype fonctionnel, pas d'un produit commercial. Aucune mesure de performance n'est publiée.",
        en: "This is a working prototype, not a commercial product. No performance figures are published.",
      },
    ],
  },
  {
    slug: "spot-thermal-mission",
    featured: {
      role: { fr: "Projet final · équipe de deux", en: "Final project · team of two" },
      impact: {
        fr: "Le robot repère la source de chaleur la plus élevée avec sa caméra thermique, s'en approche et collecte des données sur place.",
        en: "The robot finds the hottest source with its thermal camera, walks toward it and collects data on site.",
      },
      stack: ["Python", "Spot SDK", "Docker", "Bash"],
    },
    title: { fr: "Spot à la recherche de chaleur", en: "Spot, heat-seeking" },
    summary: {
      fr: "Projet final en équipe de deux : une mission Spot qui repère une source de chaleur et collecte des données.",
      en: "Final project, team of two: a Spot mission that finds a heat source and collects data.",
    },
    involvement: "team",
    team: { fr: "Équipe de deux", en: "Team of two" },
    context: { fr: "Cégep de Sept-Îles · cours « Objets connectés »", en: "Cégep de Sept-Îles · Connected Objects course" },
    period: { fr: "Automne 2023", en: "Fall 2023" },
    domains: ["robotics", "embedded"],
    stack: ["Python", "Spot SDK", "Docker", "docker-compose", "Bash", "SSH"],
    sections: [
      {
        heading: { fr: "La mission", en: "The mission" },
        points: [
          {
            fr: "Une mission Autowalk enregistrée à la tablette, passant par trois points.",
            en: "An Autowalk mission recorded on the tablet, through three waypoints.",
          },
          {
            fr: "La caméra thermique (Spot CAM+IR) balaie la zone pour repérer la source de chaleur la plus élevée.",
            en: "The thermal camera (Spot CAM+IR) scans the area for the hottest source.",
          },
          {
            fr: "Le robot s'oriente selon l'angle de la caméra et se dirige vers la source.",
            en: "The robot turns to the camera's angle and walks toward the source.",
          },
          {
            fr: "Sur place, il collecte audio, photo, photo infrarouge et mesures de température, d'humidité et de gaz.",
            en: "On site, it collects audio, photos, infrared photos and temperature, humidity and gas readings.",
          },
        ],
      },
      {
        heading: { fr: "Ce que nous avons construit", en: "What we built" },
        body: {
          fr: "Des scripts Python adaptés de quatre exemples du Spot SDK de Boston Dynamics : le code de base vient du SDK, les modifications et l'intégration sont les nôtres. Nous avons modifié le conteneur Docker fourni pour lire les capteurs Dracal et écrire les données, adapté le docker-compose, et lancé le tout sur Spot par SSH avec un script Bash pendant la mission.",
          en: "Python scripts adapted from four Boston Dynamics Spot SDK examples: the base code comes from the SDK, the changes and integration are ours. We modified the provided Docker container to read the Dracal sensors and write the data, adapted the docker-compose file, and ran it on Spot over SSH with a Bash script during the mission.",
        },
      },
    ],
    limits: [
      {
        fr: "L'approche vers la source de chaleur se fait avec des déviations : le guidage n'est pas précis.",
        en: "The approach toward the heat source drifts: the guidance is not precise.",
      },
    ],
  },
  {
    slug: "android-raspberry-arduino",
    title: { fr: "Android, Raspberry Pi et Arduino", en: "Android, Raspberry Pi and Arduino" },
    summary: {
      fr: "Projet individuel pour un vrai client, avec une application Android, un Raspberry Pi et un Arduino.",
      en: "Solo project for a real client, with an Android app, a Raspberry Pi and an Arduino.",
    },
    involvement: "solo",
    team: { fr: "Projet individuel", en: "Solo project" },
    context: { fr: "Cégep de Sept-Îles · client : le Cégep et ses professeurs", en: "Cégep de Sept-Îles · client: the college and its teachers" },
    period: { fr: "Hiver 2024", en: "Winter 2024" },
    domains: ["embedded", "software"],
    stack: ["Android", "Android Studio", "Java", "Python", "Raspberry Pi", "Arduino", "GPIO", "I2C", "SPI", "UART", "RTC"],
    sections: [
      {
        heading: { fr: "Le système", en: "The system" },
        points: [
          {
            fr: "Une application Android développée avec Android Studio en Java.",
            en: "An Android app built with Android Studio in Java.",
          },
          {
            fr: "Un Raspberry Pi programmé en Python (traitement local, communications réseau) et un Arduino.",
            en: "A Raspberry Pi programmed in Python (local processing, network communication) and an Arduino.",
          },
          {
            fr: "Protocoles et composants utilisés dans le projet : GPIO, I2C, SPI, UART et horloge temps réel (RTC).",
            en: "Protocols and components used in the project: GPIO, I2C, SPI, UART and a real-time clock (RTC).",
          },
        ],
      },
      {
        heading: { fr: "Gestion de projet", en: "Project management" },
        body: {
          fr: "Cahier des charges, échéancier et documentation; rencontres avec le client et validation des livrables.",
          en: "Specification, schedule and documentation; client meetings and deliverable sign-off.",
        },
      },
    ],
  },
  {
    slug: "test-engineering-java",
    title: { fr: "Tests et maintenance d'une application Java", en: "Testing and maintaining a Java app" },
    summary: {
      fr: "Rétro-ingénierie, tests boîte noire et d'intégration, et tests unitaires atteignant 99 % de couverture sur AccountDAO et CategoryDAO.",
      en: "Reverse engineering, black-box and integration tests, and unit tests reaching 99% coverage on AccountDAO and CategoryDAO.",
    },
    involvement: "team",
    team: { fr: "Équipe de quatre", en: "Team of four" },
    context: { fr: "ÉTS · LOG240 Tests et maintenance", en: "ÉTS · LOG240 Testing and Maintenance" },
    period: { fr: "Automne 2025", en: "Fall 2025" },
    domains: ["software"],
    stack: ["Java", "SQL", "Apache Derby", "JaCoCo", "GitLab"],
    sections: [
      {
        heading: { fr: "Ce que nous avons fait", en: "What we did" },
        points: [
          {
            fr: "Rétro-ingénierie de l'application FinanceJ et analyse d'impacts d'une demande de changement client.",
            en: "Reverse-engineered the FinanceJ application and analysed the impact of a client change request.",
          },
          {
            fr: "Tests boîte noire documentés par classes d'équivalence et valeurs frontalières pour ses trois fonctions principales; défauts enregistrés dans GitLab.",
            en: "Black-box tests documented with equivalence classes and boundary values for its three main functions; defects logged in GitLab.",
          },
          {
            fr: "Tests unitaires de la couche DAO : 99 % de couverture sur AccountDAO et CategoryDAO, mesurée avec JaCoCo.",
            en: "Unit tests for the DAO layer: 99% coverage on AccountDAO and CategoryDAO, measured with JaCoCo.",
          },
          {
            fr: "Tests d'intégration vérifiant que le modèle de l'interface interagit réellement avec la base Derby; graphes de flux et complexité cyclomatique de McCabe.",
            en: "Integration tests checking that the UI model really talks to the Derby database; control-flow graphs and McCabe cyclomatic complexity.",
          },
        ],
      },
    ],
  },
  {
    slug: "javafx-image-editor",
    title: { fr: "Éditeur d'images JavaFX", en: "JavaFX image editor" },
    summary: {
      fr: "Application JavaFX en architecture MVC avec trois vues indépendantes et le patron Observateur.",
      en: "A JavaFX app in MVC with three independent views and the Observer pattern.",
    },
    involvement: "team",
    team: { fr: "Équipe de trois", en: "Team of three" },
    context: { fr: "ÉTS · LOG121 Conception orientée objet", en: "ÉTS · LOG121 Object-Oriented Design" },
    period: { fr: "Automne 2025", en: "Fall 2025" },
    domains: ["software"],
    stack: ["Java", "JavaFX", "MVC", "Observer"],
    sections: [
      {
        heading: { fr: "Ce que nous avons fait", en: "What we did" },
        points: [
          {
            fr: "Affichage et manipulation d'image : zoom, translation, annulation, sauvegarde et chargement de fichier.",
            en: "Image display and editing: zoom, pan, undo, save and load.",
          },
          {
            fr: "Architecture MVC avec trois vues indépendantes, synchronisées par le patron Observateur/Sujet.",
            en: "MVC architecture with three independent views kept in sync with the Observer/Subject pattern.",
          },
        ],
      },
    ],
  },
  {
    slug: "server-infrastructure-lab",
    title: { fr: "Infrastructure, inventaire et supervision", en: "Infrastructure, inventory and monitoring" },
    summary: {
      fr: "Laboratoire virtualisé sous VMware ESXi avec OCS Inventory, GLPI et Zabbix.",
      en: "A virtualized lab on VMware ESXi with OCS Inventory, GLPI and Zabbix.",
    },
    involvement: "course",
    team: { fr: "Projet de session", en: "Session project" },
    context: { fr: "Cégep de Sept-Îles · Administration serveur II", en: "Cégep de Sept-Îles · Server Administration II" },
    period: { fr: "2023", en: "2023" },
    domains: ["data"],
    stack: ["VMware ESXi", "Ubuntu Server 22.04", "Netplan", "DHCP", "Apache", "MariaDB", "PHP", "OCS Inventory", "GLPI", "Zabbix"],
    sections: [
      {
        heading: { fr: "Ce qui a été mis en place", en: "What was set up" },
        points: [
          {
            fr: "Un laboratoire virtualisé sur VMware ESXi : serveur Ubuntu Server 22.04 LTS, clients Ubuntu et Windows 10, réseau virtuel isolé, adressage par DHCP.",
            en: "A virtualized lab on VMware ESXi: an Ubuntu Server 22.04 LTS host, Ubuntu and Windows 10 clients, an isolated virtual network, DHCP addressing.",
          },
          {
            fr: "OCS Inventory et ses agents pour inventorier les postes, synchronisés avec GLPI pour la gestion de tickets.",
            en: "OCS Inventory and its agents to inventory machines, synced with GLPI for ticket management.",
          },
          {
            fr: "Zabbix pour superviser les hôtes Linux et Windows, avec une alerte par courriel en cas d'utilisation élevée des ressources.",
            en: "Zabbix to monitor Linux and Windows hosts, with an email alert on high resource usage.",
          },
        ],
      },
    ],
    limits: [
      {
        fr: "Projet de laboratoire réalisé dans un cours, avec des collègues et une technicienne du département. Ce n'est pas un environnement de production.",
        en: "A lab project done in a course, with classmates and a department technician. It is not a production environment.",
      },
    ],
  },
  {
    slug: "dotnet-web-apps",
    title: { fr: "Applications web .NET", en: ".NET web applications" },
    summary: {
      fr: "Blazor, API REST ASP.NET Core et Entity Framework Core, dans le cadre du DEC.",
      en: "Blazor, ASP.NET Core REST API and Entity Framework Core, during college.",
    },
    involvement: "course",
    team: { fr: "Travaux de cours", en: "Coursework" },
    context: {
      fr: "Cégep de Sept-Îles · Exploiter un SGBD et Développement web transactionnel",
      en: "Cégep de Sept-Îles · Database Management Systems and Transactional Web Development",
    },
    period: { fr: "2023 – 2024", en: "2023 – 2024" },
    domains: ["software", "data"],
    stack: ["C#", "ASP.NET Core", "Blazor", "Entity Framework Core", "SQL Server", "IIS"],
    sections: [
      {
        heading: { fr: "Ce que j'ai construit", en: "What I built" },
        points: [
          {
            fr: "Une application Blazor Server de gestion universitaire (étudiants, cours, inscriptions) avec Entity Framework Core, SQL Server et des migrations successives.",
            en: "A Blazor Server university management app (students, courses, enrolments) with Entity Framework Core, SQL Server and successive migrations.",
          },
          {
            fr: "Une API REST ASP.NET Core, consommée par un client Blazor avec HttpClient (GET, POST, PUT, DELETE).",
            en: "An ASP.NET Core REST API, consumed by a Blazor client with HttpClient (GET, POST, PUT, DELETE).",
          },
          {
            fr: "Un guide de déploiement de l'API sur IIS : site, pool d'applications, droits d'accès et règle de pare-feu.",
            en: "A guide to deploying the API on IIS: site, application pool, permissions and firewall rule.",
          },
          {
            fr: "Des applications ASP.NET Core MVC et C# WinForms connectées à SQL Server avec Entity Framework et ADO.NET.",
            en: "ASP.NET Core MVC and C# WinForms apps connected to SQL Server with Entity Framework and ADO.NET.",
          },
        ],
      },
    ],
  },
  {
    slug: "php-auth-sites",
    title: { fr: "Sites PHP et authentification", en: "PHP sites and authentication" },
    summary: {
      fr: "Comptes, rôles, double authentification TOTP et connexion OAuth, en PHP avec MySQL.",
      en: "Accounts, roles, TOTP two-factor and OAuth sign-in, in PHP with MySQL.",
    },
    involvement: "course",
    team: { fr: "Travaux de cours", en: "Coursework" },
    context: { fr: "Cégep de Sept-Îles · Programmation environnement Internet", en: "Cégep de Sept-Îles · Internet Programming" },
    period: { fr: "Hiver 2024", en: "Winter 2024" },
    domains: ["software"],
    stack: ["PHP", "MySQL", "PDO", "PHPMailer", "OAuth", "TOTP"],
    sections: [
      {
        heading: { fr: "Ce que j'ai construit", en: "What I built" },
        points: [
          {
            fr: "Connexion avec mots de passe hachés, sessions, rôles usager et administrateur, page d'administration des comptes.",
            en: "Sign-in with hashed passwords, sessions, user and admin roles, an account admin page.",
          },
          {
            fr: "Inscription validée, activation du compte par courriel, double authentification TOTP avec code QR, connexion OAuth Google, Facebook et GitHub, reCAPTCHA.",
            en: "Validated sign-up, email account activation, TOTP two-factor with QR code, Google, Facebook and GitHub OAuth sign-in, reCAPTCHA.",
          },
          {
            fr: "Requêtes préparées PDO et échappement des sorties contre les injections.",
            en: "PDO prepared statements and output escaping against injection.",
          },
        ],
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
