import type { Project } from "./types";

/**
 * Case studies. The three featured ones open the work section as large cards.
 */
export const projects: Project[] = [
  {
    slug: "parking-platform",
    featured: {
      role: { fr: "Seul développeur de l’application mobile · ITMI", en: "Sole developer of the mobile app · ITMI" },
      impact: {
        fr: "Déployée pour l’ensemble du personnel du Cégep de Sept-Îles et quelques utilisateurs externes.",
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
    team: { fr: "Seul développeur de l’application mobile", en: "Sole developer of the mobile app" },
    context: { fr: "ITMI · emploi et stage", en: "ITMI · internship and job" },
    period: { fr: "2025", en: "2025" },
    domains: ["software", "data"],
    stack: ["React Native", "TypeScript", "Expo", "PHP", "REST API", "PostgreSQL", "Docker", "pytest", "Gitea", "Azure DevOps"],
    caseStudy: {
      status: { fr: "Emploi et stage · ITMI", en: "Internship and job · ITMI" },
      lede: {
        fr: "Une application mobile et une interface d’administration pour le système de gestion des stationnements que l’ITMI a développé pour le Cégep de Sept-Îles.",
        en: "A mobile app and an admin interface for the parking management system ITMI built for Cégep de Sept-Îles.",
      },
      role: {
        fr: "Seul développeur de l’application mobile; interface web administrateur en PHP",
        en: "Sole developer of the mobile app; PHP admin web interface",
      },
      outcome: {
        fr: "Déployée à l’interne pour l’ensemble du personnel du Cégep de Sept-Îles et quelques utilisateurs externes.",
        en: "Deployed internally to all Cégep de Sept-Îles staff and a few external users.",
      },
      client: { fr: "Cégep de Sept-Îles", en: "Cégep de Sept-Îles" },
      problem: {
        body: [
          {
            fr: "Le Cégep de Sept-Îles est le client d’un système de gestion des stationnements développé par l’ITMI. Le système a deux faces : une application mobile pour ses usagers et une interface web pour l’administrer.",
            en: "Cégep de Sept-Îles is the client of a parking management system built by ITMI. The system has two sides: a mobile app for its users and a web interface to administer it.",
          },
          {
            fr: "Ses usagers sont l’ensemble du personnel du Cégep et quelques utilisateurs externes.",
            en: "Its users are all Cégep staff and a few external users.",
          },
        ],
        constraints: [
          {
            fr: "Distribution interne : l’application n’est pas publiée sur les magasins d’applications.",
            en: "Internal distribution: the app is not published on the app stores.",
          },
          {
            fr: "Le code et les interfaces appartiennent à l’ITMI : rien de confidentiel n’est montré ici.",
            en: "The code and interfaces belong to ITMI: nothing confidential is shown here.",
          },
        ],
      },
      diagram: {
        lanes: [
          {
            nodes: [
              { title: { fr: "Usagers", en: "Users" }, detail: { fr: "Personnel du Cégep et quelques utilisateurs externes", en: "Cégep staff and a few external users" } },
              {
                title: { fr: "Application mobile", en: "Mobile app" },
                detail: { fr: "React Native · TypeScript · Expo", en: "React Native · TypeScript · Expo" },
                mine: true,
                link: { label: { fr: "utilisent", en: "use" } },
              },
              {
                title: { fr: "Système de gestion des stationnements", en: "Parking management system" },
                detail: { fr: "ITMI · non détaillé ici", en: "ITMI · not detailed here" },
                link: { label: { fr: "échanges", en: "exchanges" }, both: true },
              },
              {
                title: { fr: "Interface web administrateur", en: "Admin web interface" },
                detail: { fr: "PHP et langages web · pages, formulaires, vues", en: "PHP and web languages · pages, forms, views" },
                mine: true,
                link: { label: { fr: "administration", en: "administration" }, both: true },
              },
            ],
          },
        ],
        explanation: {
          fr: "Les usagers passent par l’application mobile; l’administration du système se fait dans l’interface web. J’ai développé ces deux parties. Le reste du système n’est pas détaillé ici.",
          en: "Users go through the mobile app; the system is administered in the web interface. I built both parts. The rest of the system is not detailed here.",
        },
      },
      contributions: [
        {
          fr: "Développement complet de l’application mobile côté client, en React Native, TypeScript et Expo. J’en étais le seul développeur.",
          en: "Built the entire client mobile app in React Native, TypeScript and Expo, as its only developer.",
        },
        {
          fr: "Développement de l’interface web administrateur en PHP et langages web : pages, formulaires et vues.",
          en: "Built the admin web interface in PHP and web languages: pages, forms and views.",
        },
      ],
      decisions: [
        { fr: "Application mobile en React Native avec Expo, écrite en TypeScript.", en: "Mobile app in React Native with Expo, written in TypeScript." },
        { fr: "Administration par une interface web en PHP, distincte de l’application mobile.", en: "Administration through a PHP web interface, separate from the mobile app." },
        { fr: "Distribution interne, sans publication sur les magasins d’applications.", en: "Internal distribution, without publishing on the app stores." },
      ],
      stack: [
        { label: { fr: "Pour ce système", en: "For this system" }, items: ["React Native", "TypeScript", "Expo", "PHP"] },
        { label: { fr: "À l’ITMI, même période", en: "At ITMI, same period" }, items: ["REST API", "PostgreSQL", "Docker", "pytest", "Gitea", "Azure DevOps"] },
      ],
      around: [
        {
          heading: { fr: "Façon de travailler", en: "How we worked" },
          body: {
            fr: "Sprints et réunions quotidiennes, pull requests et revues de code dans Gitea avec une stratégie de branches, tickets dans Azure DevOps Boards. J’ai aussi assuré la maintenance d’applications en production, formé du personnel et échangé avec les clients.",
            en: "Sprints and daily stand-ups, pull requests and code reviews in Gitea with a branching strategy, tickets in Azure DevOps Boards. I also maintained applications in production, trained staff and worked with clients.",
          },
        },
        {
          heading: { fr: "Autres travaux à l’ITMI, même période", en: "Other work at ITMI, same period" },
          body: {
            fr: "Ces travaux touchent d’autres projets de l’équipe, pas seulement les stationnements.",
            en: "This work covers other team projects, not only the parking system.",
          },
          points: [
            {
              fr: "API REST et composantes backend en PHP pour Nomad, un framework interne de l’ITMI, avec PostgreSQL (connexion, requêtes, migrations), dans des projets conteneurisés avec Docker.",
              en: "REST APIs and PHP backend components for Nomad, an ITMI in-house framework, with PostgreSQL (connection, queries, migrations), in Docker-based projects.",
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
      ],
      results: [
        {
          fr: "Application déployée à l’interne pour l’ensemble du personnel du Cégep de Sept-Îles et quelques utilisateurs externes.",
          en: "App deployed internally to all Cégep de Sept-Îles staff and a few external users.",
        },
      ],
      limits: [
        { fr: "Aucun nombre d’utilisateurs ni aucune mesure d’usage n’est publié.", en: "No user count or usage figure is published." },
        {
          fr: "Le code appartient à l’ITMI : aucune capture ni extrait n’est publié ici.",
          en: "The code belongs to ITMI: no screenshots or excerpts are published here.",
        },
      ],
    },
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
    team: { fr: "Emploi d’été", en: "Summer job" },
    context: { fr: "ITMI · conseiller technique", en: "ITMI · technical advisor" },
    period: { fr: "Mai – août 2024", en: "May – Aug 2024" },
    domains: ["robotics", "data"],
    stack: ["Python", "Spot SDK", "OpenCV", "Pillow", "NumPy", "Linux", "Rust", "Grafana"],
    explored: ["C++"],
    caseStudy: {
      status: { fr: "Emploi d’été · ITMI", en: "Summer job · ITMI" },
      lede: {
        fr: "Gérer les missions autonomes du robot Spot de l’ITMI et traiter automatiquement les photos qu’il prend en mission.",
        en: "Managing the autonomous missions of ITMI’s Spot robot, and automatically processing the photos it takes on missions.",
      },
      role: { fr: "Conseiller technique, systèmes embarqués", en: "Technical Advisor, Embedded Systems" },
      outcome: {
        fr: "Un prototype fonctionnel qui sélectionne et enregistre des missions autonomes, et des photos de mission traitées automatiquement sur un serveur Linux.",
        en: "A working prototype that selects and records autonomous missions, with mission photos processed automatically on a Linux server.",
      },
      client: { fr: "ITMI, Sept-Îles", en: "ITMI, Sept-Îles" },
      problem: {
        body: [
          {
            fr: "L’ITMI travaille avec un robot quadrupède Spot de Boston Dynamics. En mission autonome, il prend des photos et recueille des données avec différents payloads.",
            en: "ITMI works with a Boston Dynamics Spot quadruped robot. On autonomous missions, it takes photos and collects data with several payloads.",
          },
          {
            fr: "J’ai travaillé sur deux points : la gestion de ses missions autonomes, et le traitement automatisé des photos de mission jusqu’aux personnes qui en ont besoin.",
            en: "I worked on two things: managing its autonomous missions, and automatically processing mission photos all the way to the people who need them.",
          },
          {
            fr: "Avant cet emploi, à l’hiver 2024, j’avais déjà travaillé sur Spot comme auxiliaire de recherche : une preuve de concept Python avec le Spot SDK, testée et validée, et une exploration du C++ avec le même SDK.",
            en: "Before this job, in winter 2024, I had already worked on Spot as a research assistant: a Python proof of concept with the Spot SDK, tested and validated, and an exploration of C++ with the same SDK.",
          },
        ],
      },
      diagram: {
        lanes: [
          {
            label: { fr: "Missions et photos", en: "Missions and photos" },
            nodes: [
              {
                title: { fr: "Prototype de missions", en: "Mission prototype" },
                detail: { fr: "Python · Spot SDK · choisir ou enregistrer une mission", en: "Python · Spot SDK · pick or record a mission" },
                mine: true,
              },
              {
                title: { fr: "Spot en mission autonome", en: "Spot on an autonomous mission" },
                detail: { fr: "Photos et données des payloads", en: "Photos and payload data" },
                link: { label: { fr: "mission choisie", en: "selected mission" } },
              },
              {
                title: { fr: "Traitement automatisé", en: "Automated processing" },
                detail: { fr: "Serveur Linux · OpenCV, Pillow, NumPy", en: "Linux server · OpenCV, Pillow, NumPy" },
                mine: true,
                link: { label: { fr: "téléversement", en: "upload" } },
              },
              {
                title: { fr: "Personnes concernées", en: "People who need them" },
                detail: { fr: "Résultats transmis", en: "Results sent" },
                link: { label: { fr: "transmission", en: "sent" } },
              },
            ],
          },
          {
            label: { fr: "En parallèle", en: "Alongside" },
            nodes: [
              { title: { fr: "Capteurs extérieurs", en: "Outdoor sensors" }, detail: { fr: "Différents capteurs", en: "Several sensors" } },
              {
                title: { fr: "Récupération des données", en: "Data collection" },
                detail: { fr: "Rust", en: "Rust" },
                mine: true,
                link: {},
              },
              { title: { fr: "Grafana", en: "Grafana" }, detail: { fr: "Données exploitées", en: "Data put to use" }, link: {} },
            ],
          },
        ],
        explanation: {
          fr: "Avec le prototype, on choisit une mission existante ou on en enregistre une nouvelle. Spot l’exécute de façon autonome et prend des photos. Les photos sont téléversées vers un serveur Linux, traitées automatiquement avec les données des payloads, puis transmises aux personnes concernées. À côté, un programme en Rust récupère les données de capteurs extérieurs pour Grafana.",
          en: "With the prototype, you pick an existing mission or record a new one. Spot carries it out autonomously and takes photos. The photos are uploaded to a Linux server, processed automatically with the payload data, then sent to the people who need them. Alongside, a Rust program collects outdoor sensor data for Grafana.",
        },
      },
      contributions: [
        {
          fr: "Prototype fonctionnel en Python avec le Spot SDK : sélection de missions autonomes existantes et enregistrement de nouvelles missions.",
          en: "Working Python prototype with the Spot SDK: selecting existing autonomous missions and recording new ones.",
        },
        {
          fr: "Prise de photos pendant les missions et téléversement vers un serveur Linux.",
          en: "Photo capture during missions and upload to a Linux server.",
        },
        {
          fr: "Traitement automatisé des photos sur le serveur avec les données de différents payloads (OpenCV, Pillow, NumPy), puis transmission aux utilisateurs concernés.",
          en: "Automated processing of the photos on the server with data from several payloads (OpenCV, Pillow, NumPy), then delivery to the people who need them.",
        },
        {
          fr: "Récupération en Rust des données de différents capteurs extérieurs, exploitées dans Grafana.",
          en: "Rust code to collect data from several outdoor sensors, used in Grafana.",
        },
        { fr: "Formation du personnel et documentation technique.", en: "Staff training and technical documentation." },
      ],
      decisions: [
        { fr: "Missions pilotées en Python avec le Spot SDK de Boston Dynamics.", en: "Missions driven in Python with the Boston Dynamics Spot SDK." },
        { fr: "Traitement des photos sur un serveur Linux, après téléversement.", en: "Photo processing on a Linux server, after upload." },
        { fr: "Traitement d’images en Python avec OpenCV, Pillow et NumPy.", en: "Image processing in Python with OpenCV, Pillow and NumPy." },
        { fr: "Rust pour récupérer les données de capteurs, Grafana pour les exploiter.", en: "Rust to collect the sensor data, Grafana to put it to use." },
      ],
      stack: [
        { label: { fr: "Cet emploi", en: "This job" }, items: ["Python", "Spot SDK", "OpenCV", "Pillow", "NumPy", "Linux", "Rust", "Grafana"] },
        { label: { fr: "Hiver 2024, auxiliaire de recherche", en: "Winter 2024, research assistant" }, items: ["Python", "Spot SDK"], explored: ["C++"] },
      ],
      results: [
        {
          fr: "Prototype fonctionnel de sélection et d’enregistrement de missions autonomes.",
          en: "A working prototype to select and record autonomous missions.",
        },
        {
          fr: "Photos de mission traitées automatiquement sur le serveur, puis transmises aux personnes concernées.",
          en: "Mission photos processed automatically on the server, then sent to the people who need them.",
        },
        { fr: "Données de capteurs extérieurs exploitées dans Grafana.", en: "Outdoor sensor data put to use in Grafana." },
        { fr: "Personnel formé et documentation technique rédigée.", en: "Staff trained and technical documentation written." },
      ],
      limits: [
        {
          fr: "Il s’agit d’un prototype fonctionnel, pas d’un produit commercial.",
          en: "This is a working prototype, not a commercial product.",
        },
        {
          fr: "Aucune mesure de performance n’est publiée : ni cadence, ni volume, ni précision.",
          en: "No performance figures are published: no rate, volume or accuracy.",
        },
        { fr: "Aucune vidéo de démonstration n’est disponible.", en: "No demo video is available." },
      ],
    },
  },
  {
    slug: "spot-thermal-mission",
    featured: {
      role: { fr: "Projet final · équipe de deux", en: "Final project · team of two" },
      impact: {
        fr: "Le robot repère la source de chaleur la plus élevée avec sa caméra thermique, s’en approche et collecte des données sur place.",
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
            fr: "Le robot s’oriente selon l’angle de la caméra et se dirige vers la source.",
            en: "The robot turns to the camera’s angle and walks toward the source.",
          },
          {
            fr: "Sur place, il collecte audio, photo, photo infrarouge et mesures de température, d’humidité et de gaz.",
            en: "On site, it collects audio, photos, infrared photos and temperature, humidity and gas readings.",
          },
        ],
      },
      {
        heading: { fr: "Ce que nous avons construit", en: "What we built" },
        body: {
          fr: "Des scripts Python adaptés de quatre exemples du Spot SDK de Boston Dynamics : le code de base vient du SDK, les modifications et l’intégration sont les nôtres. Nous avons modifié le conteneur Docker fourni pour lire les capteurs Dracal et écrire les données, adapté le docker-compose, et lancé le tout sur Spot par SSH avec un script Bash pendant la mission.",
          en: "Python scripts adapted from four Boston Dynamics Spot SDK examples: the base code comes from the SDK, the changes and integration are ours. We modified the provided Docker container to read the Dracal sensors and write the data, adapted the docker-compose file, and ran it on Spot over SSH with a Bash script during the mission.",
        },
      },
    ],
    limits: [
      {
        fr: "L’approche vers la source de chaleur se fait avec des déviations : le guidage n’est pas précis.",
        en: "The approach toward the heat source drifts: the guidance is not precise.",
      },
    ],
  },
  {
    slug: "android-raspberry-arduino",
    title: { fr: "Surveillance portable avec Android, Raspberry Pi et Arduino", en: "Portable monitoring with Android, Raspberry Pi and Arduino" },
    summary: {
      fr: "Projet individuel pour un vrai client : un système de surveillance portable avec un Raspberry Pi central, un Arduino pour les capteurs et une application Android.",
      en: "Solo project for a real client: a portable monitoring system with a central Raspberry Pi, an Arduino for the sensors and an Android app.",
    },
    involvement: "solo",
    team: { fr: "Projet individuel", en: "Solo project" },
    context: { fr: "Cégep de Sept-Îles · client : le Cégep et ses professeurs", en: "Cégep de Sept-Îles · client: the college and its teachers" },
    period: { fr: "Hiver 2024", en: "Winter 2024" },
    domains: ["embedded", "software"],
    stack: ["Android", "Android Studio", "Java", "Python", "Raspberry Pi", "Arduino", "GPIO", "I2C", "SPI", "UART", "RTC"],
    caseStudy: {
      status: { fr: "Projet individuel · Cégep de Sept-Îles", en: "Solo project · Cégep de Sept-Îles" },
      lede: {
        fr: "Un système de surveillance portable : des capteurs lus par un Arduino, un Raspberry Pi au centre et une application mobile avec des notifications sur la présence ou l’absence de personnes.",
        en: "A portable monitoring system: sensors read by an Arduino, a Raspberry Pi at the centre, and a mobile app with notifications about people being present or absent.",
      },
      role: {
        fr: "Seul sur le projet : application Android, Raspberry Pi, Arduino et gestion de projet",
        en: "Solo: Android app, Raspberry Pi, Arduino and project management",
      },
      outcome: {
        fr: "Mené pour un client réel, le Cégep et ses professeurs : cahier des charges, échéancier, rencontres et validation des livrables.",
        en: "Run for a real client, the college and its teachers: specification, schedule, meetings and deliverable sign-off.",
      },
      client: { fr: "Cégep de Sept-Îles et ses professeurs", en: "Cégep de Sept-Îles and its teachers" },
      problem: {
        body: [
          {
            fr: "Le Cégep de Sept-Îles et ses professeurs étaient les clients de ce projet : un système de surveillance portable, avec des notifications sur la présence ou l’absence de personnes.",
            en: "Cégep de Sept-Îles and its teachers were the clients of this project: a portable monitoring system with notifications about people being present or absent.",
          },
          {
            fr: "J’ai mené le projet du cahier des charges jusqu’à la validation des livrables avec le client.",
            en: "I ran the project from the specification to the deliverable sign-off with the client.",
          },
        ],
        constraints: [
          {
            fr: "Un système portable, réparti sur trois appareils : un Arduino, un Raspberry Pi et un appareil Android.",
            en: "A portable system spread over three devices: an Arduino, a Raspberry Pi and an Android device.",
          },
        ],
      },
      diagram: {
        lanes: [
          {
            nodes: [
              { title: { fr: "Capteurs", en: "Sensors" }, detail: { fr: "Type non précisé ici", en: "Type not specified here" } },
              {
                title: { fr: "Arduino", en: "Arduino" },
                detail: { fr: "Acquisition par capteurs", en: "Sensor acquisition" },
                mine: true,
                link: { label: { fr: "acquisition", en: "acquisition" } },
              },
              {
                title: { fr: "Raspberry Pi", en: "Raspberry Pi" },
                detail: { fr: "Unité centrale · traitement des requêtes, gestion du système · Python", en: "Central unit · request handling, system management · Python" },
                mine: true,
                link: { label: { fr: "transmission", en: "transmission" } },
              },
              {
                title: { fr: "Application Android", en: "Android app" },
                detail: { fr: "Java · notifications : présence ou absence de personnes", en: "Java · notifications: people present or absent" },
                mine: true,
                link: { label: { fr: "communications réseau", en: "network communication" }, both: true },
              },
            ],
          },
        ],
        explanation: {
          fr: "L’Arduino lit les capteurs et transmet leurs informations au Raspberry Pi. Le Raspberry Pi, au centre, traite les requêtes et gère le système. L’application mobile affiche des notifications sur la présence ou l’absence de personnes. Les capteurs, la liaison entre les appareils et la méthode de détection ne sont pas détaillés ici.",
          en: "The Arduino reads the sensors and passes their information to the Raspberry Pi. The Raspberry Pi, at the centre, handles requests and manages the system. The mobile app shows notifications about people being present or absent. The sensors, the links between the devices and the detection method are not detailed here.",
        },
      },
      contributions: [
        { fr: "Application Android en Java avec Android Studio : l’interface et ses notifications.", en: "Android app in Java with Android Studio: the interface and its notifications." },
        { fr: "Programme Python sur le Raspberry Pi : traitement local et communications réseau.", en: "Python program on the Raspberry Pi: local processing and network communication." },
        { fr: "Programmation de l’Arduino pour l’acquisition par capteurs et la transmission au Raspberry Pi.", en: "Arduino programming for sensor acquisition and transmission to the Raspberry Pi." },
        {
          fr: "Gestion de projet : cahier des charges, échéancier, documentation, rencontres avec le client et validation des livrables.",
          en: "Project management: specification, schedule, documentation, client meetings and deliverable sign-off.",
        },
      ],
      decisions: [
        {
          fr: "Trois rôles séparés : l’Arduino pour l’acquisition, le Raspberry Pi comme unité centrale, l’application mobile comme interface.",
          en: "Three separate roles: the Arduino for acquisition, the Raspberry Pi as the central unit, the mobile app as the interface.",
        },
        { fr: "Python sur le Raspberry Pi, Java pour l’application Android.", en: "Python on the Raspberry Pi, Java for the Android app." },
        {
          fr: "Protocoles et composants utilisés dans le projet : GPIO, I2C, SPI, UART et horloge temps réel (RTC).",
          en: "Protocols and components used in the project: GPIO, I2C, SPI, UART and a real-time clock (RTC).",
        },
      ],
      stack: [
        { label: { fr: "Technologies", en: "Stack" }, items: ["Android", "Android Studio", "Java", "Python", "Raspberry Pi", "Arduino", "GPIO", "I2C", "SPI", "UART", "RTC"] },
      ],
      results: [
        { fr: "Système réalisé seul pour un client réel, le Cégep et ses professeurs.", en: "A system built alone for a real client, the college and its teachers." },
        { fr: "Livrables validés avec le client.", en: "Deliverables signed off with the client." },
      ],
      limits: [
        {
          fr: "Aucune photo ni vidéo du système n’est disponible : le schéma ci-dessus est une illustration.",
          en: "No photo or video of the system is available: the diagram above is an illustration.",
        },
      ],
    },
  },
  {
    slug: "test-engineering-java",
    title: { fr: "Tests et maintenance d’une application Java", en: "Testing and maintaining a Java app" },
    summary: {
      fr: "Rétro-ingénierie, tests boîte noire et d’intégration, et tests unitaires atteignant 99 % de couverture sur AccountDAO et CategoryDAO.",
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
            fr: "Rétro-ingénierie de l’application FinanceJ et analyse d’impacts d’une demande de changement client.",
            en: "Reverse-engineered the FinanceJ application and analysed the impact of a client change request.",
          },
          {
            fr: "Tests boîte noire documentés par classes d’équivalence et valeurs frontalières pour ses trois fonctions principales; défauts enregistrés dans GitLab.",
            en: "Black-box tests documented with equivalence classes and boundary values for its three main functions; defects logged in GitLab.",
          },
          {
            fr: "Tests unitaires de la couche DAO : 99 % de couverture sur AccountDAO et CategoryDAO, mesurée avec JaCoCo.",
            en: "Unit tests for the DAO layer: 99% coverage on AccountDAO and CategoryDAO, measured with JaCoCo.",
          },
          {
            fr: "Tests d’intégration vérifiant que le modèle de l’interface interagit réellement avec la base Derby; graphes de flux et complexité cyclomatique de McCabe.",
            en: "Integration tests checking that the UI model really talks to the Derby database; control-flow graphs and McCabe cyclomatic complexity.",
          },
        ],
      },
    ],
  },
  {
    slug: "javafx-image-editor",
    title: { fr: "Éditeur d’images JavaFX", en: "JavaFX image editor" },
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
            fr: "Affichage et manipulation d’image : zoom, translation, annulation, sauvegarde et chargement de fichier.",
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
            fr: "Zabbix pour superviser les hôtes Linux et Windows, avec une alerte par courriel en cas d’utilisation élevée des ressources.",
            en: "Zabbix to monitor Linux and Windows hosts, with an email alert on high resource usage.",
          },
        ],
      },
    ],
    limits: [
      {
        fr: "Projet de laboratoire réalisé dans un cours, avec des collègues et une technicienne du département. Ce n’est pas un environnement de production.",
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
        heading: { fr: "Ce que j’ai construit", en: "What I built" },
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
            fr: "Un guide de déploiement de l’API sur IIS : site, pool d’applications, droits d’accès et règle de pare-feu.",
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
        heading: { fr: "Ce que j’ai construit", en: "What I built" },
        points: [
          {
            fr: "Connexion avec mots de passe hachés, sessions, rôles usager et administrateur, page d’administration des comptes.",
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
