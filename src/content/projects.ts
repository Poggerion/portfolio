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
    stack: ["React Native", "TypeScript", "Expo", "Stripe", "PHP", "REST API", "PostgreSQL", "Docker", "pytest", "Gitea", "Azure DevOps"],
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
            fr: "Le Cégep de Sept-Îles est le client d’un système de gestion des stationnements développé par l’ITMI. Ses usagers sont l’ensemble du personnel du Cégep et quelques utilisateurs externes.",
            en: "Cégep de Sept-Îles is the client of a parking management system built by ITMI. Its users are all Cégep staff and a few external users.",
          },
          {
            fr: "Dans l’application mobile, un usager paie son stationnement avec Stripe, selon l’horodateur, à la session ou au mois. Il consulte ses vignettes virtuelles, associées à ses plaques d’immatriculation, et peut ajouter des plaques.",
            en: "In the mobile app, users pay for parking with Stripe, by meter, per session or per month. They see their virtual permits, tied to their licence plates, and can add plates.",
          },
          {
            fr: "Les surveillants vérifient les plaques auprès du serveur : une plaque absente du système mène à une amende. L’administrateur, lui, gère toutes les données du système depuis une interface web contrôlée.",
            en: "Enforcement officers check plates against the server: a plate missing from the system leads to a fine. The administrator manages all the system’s data from a controlled web interface.",
          },
        ],
        constraints: [
          {
            fr: "Distribution interne : l’application n’est pas publiée sur les magasins d’applications.",
            en: "Internal distribution: the app is not published on the app stores.",
          },
          {
            fr: "Les choix techniques étaient déjà décidés : mon rôle était de les mettre en œuvre.",
            en: "The technical choices were already made: my role was to implement them.",
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
              { title: { fr: "Usagers et surveillants", en: "Users and officers" }, detail: { fr: "Personnel du Cégep, quelques utilisateurs externes, surveillants", en: "Cégep staff, a few external users, enforcement officers" } },
              {
                title: { fr: "Application mobile", en: "Mobile app" },
                detail: { fr: "React Native · TypeScript · Expo · paiement Stripe, vignettes, plaques", en: "React Native · TypeScript · Expo · Stripe payment, permits, plates" },
                mine: true,
                link: { label: { fr: "utilisent", en: "use" } },
              },
              {
                title: { fr: "Serveur", en: "Server" },
                detail: { fr: "Nomad, framework interne de l’ITMI, complété pour le projet", en: "Nomad, ITMI’s in-house framework, extended for the project" },
                link: { label: { fr: "requêtes", en: "requests" }, both: true },
              },
              {
                title: { fr: "Interface web administrateur", en: "Admin web interface" },
                detail: { fr: "PHP et langages web · journaux, gestion des données", en: "PHP and web languages · logs, data management" },
                mine: true,
                link: { label: { fr: "administration", en: "administration" }, both: true },
              },
            ],
          },
        ],
        explanation: {
          fr: "Les usagers paient, consultent leurs vignettes et ajoutent leurs plaques dans l’application mobile; les surveillants y vérifient les plaques auprès du serveur. Le serveur repose sur Nomad, un framework interne de l’ITMI, complété pour le projet. L’administrateur consulte les journaux et gère les données dans l’interface web. J’ai développé l’application mobile et l’interface web; le serveur n’est pas détaillé ici.",
          en: "Users pay, view their permits and add plates in the mobile app; enforcement officers use it to check plates against the server. The server is built on Nomad, ITMI’s in-house framework, extended for the project. The administrator reads the logs and manages the data in the web interface. I built the mobile app and the web interface; the server is not detailed here.",
        },
      },
      contributions: [
        {
          fr: "Développement complet de l’application mobile côté client, en React Native, TypeScript et Expo : paiement avec Stripe, vignettes virtuelles, ajout de plaques et vérification des plaques par les surveillants. J’en étais le seul développeur.",
          en: "Built the entire client mobile app in React Native, TypeScript and Expo, as its only developer: Stripe payment, virtual permits, adding plates and plate checks by enforcement officers.",
        },
        {
          fr: "Développement de l’interface web administrateur en PHP et langages web : pages, formulaires et vues où l’administrateur consulte les journaux et efface, ajoute ou modifie les données.",
          en: "Built the admin web interface in PHP and web languages: pages, forms and views where the administrator reads the logs and deletes, adds or edits data.",
        },
        {
          fr: "Mise en œuvre des choix techniques déjà décidés, et amélioration de certains points, comme les interfaces.",
          en: "Implemented the technical choices already made, and improved some parts, such as the interfaces.",
        },
      ],
      decisions: [
        { fr: "Application mobile en React Native avec Expo, écrite en TypeScript, et serveur sur Nomad, le framework interne de l’ITMI : des choix déjà décidés.", en: "Mobile app in React Native with Expo, written in TypeScript, and a server on Nomad, ITMI’s in-house framework: choices already made." },
        { fr: "Paiement avec Stripe : selon l’horodateur, à la session ou au mois.", en: "Payment with Stripe: by meter, per session or per month." },
        { fr: "Administration par une interface web en PHP, distincte de l’application mobile.", en: "Administration through a PHP web interface, separate from the mobile app." },
        { fr: "Distribution interne, sans publication sur les magasins d’applications.", en: "Internal distribution, without publishing on the app stores." },
      ],
      stack: [
        { label: { fr: "Pour ce système", en: "For this system" }, items: ["React Native", "TypeScript", "Expo", "Stripe", "PHP"] },
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
              fr: "Authentification de base et authentification Microsoft.",
              en: "Basic authentication and Microsoft authentication.",
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
        {
          fr: "Paiement, vignettes virtuelles, plaques et vérification par les surveillants réunis dans une seule application.",
          en: "Payment, virtual permits, plates and officer checks in a single app.",
        },
      ],
      limits: [
        { fr: "Aucun nombre d’utilisateurs ni aucune mesure d’usage n’est publié.", en: "No user count or usage figure is published." },
        {
          fr: "Le code appartient à l’ITMI : aucune capture ni extrait n’est publié ici.",
          en: "The code belongs to ITMI: no screenshots or excerpts are published here.",
        },
      ],
      learnings: [
        { fr: "Utiliser des API REST.", en: "Working with REST APIs." },
        { fr: "Déboguer sur différentes plateformes.", en: "Debugging across platforms." },
        { fr: "React et ses hooks, Expo et la mise en cache.", en: "React and its hooks, Expo and caching." },
        { fr: "Intégrer un paiement avec Stripe.", en: "Integrating payment with Stripe." },
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
            fr: "L’ITMI travaille avec un robot quadrupède Spot de Boston Dynamics. En mission autonome, il prend des photos et recueille des données avec un payload de Boston Dynamics : une caméra et des capteurs.",
            en: "ITMI works with a Boston Dynamics Spot quadruped robot. On autonomous missions, it takes photos and collects data with a Boston Dynamics payload: a camera and sensors.",
          },
          {
            fr: "Sur les photos, on voit des capteurs physiques, par exemple de pression : il faut en extraire les données. Les techniciens sur le terrain en ont besoin.",
            en: "The photos show physical gauges, for example pressure gauges, and their readings have to be extracted. Field technicians need them.",
          },
          {
            fr: "J’ai travaillé sur deux points : la gestion de ses missions autonomes, et le traitement automatisé des photos de mission jusqu’aux techniciens.",
            en: "I worked on two things: managing its autonomous missions, and automatically processing mission photos all the way to the technicians.",
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
                detail: { fr: "Photos et données du payload : caméra et capteurs", en: "Photos and payload data: camera and sensors" },
                link: { label: { fr: "mission choisie", en: "selected mission" } },
              },
              {
                title: { fr: "Traitement automatisé", en: "Automated processing" },
                detail: { fr: "Serveur Linux · Python · OCR des valeurs des instruments", en: "Linux server · Python · OCR of the instrument readings" },
                mine: true,
                link: { label: { fr: "téléversement", en: "upload" } },
              },
              {
                title: { fr: "Techniciens sur le terrain", en: "Field technicians" },
                detail: { fr: "Fichier Excel sur SharePoint", en: "Excel file on SharePoint" },
                link: { label: { fr: "valeurs exportées", en: "exported readings" } },
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
          fr: "Avec le prototype, on choisit une mission existante ou on en enregistre une nouvelle. Spot l’exécute de façon autonome et prend des photos. Les photos sont téléversées vers un serveur Linux et traitées automatiquement avec les données du payload : une reconnaissance optique des caractères (OCR) lit les valeurs numériques des instruments photographiés, et ces valeurs sont exportées. Elles arrivent aux techniciens sur le terrain dans un fichier Excel sur SharePoint. À côté, un programme en Rust récupère les données de capteurs extérieurs pour Grafana.",
          en: "With the prototype, you pick an existing mission or record a new one. Spot carries it out autonomously and takes photos. The photos are uploaded to a Linux server and processed automatically with the payload data: optical character recognition (OCR) reads the numeric values of the photographed gauges, and those values are exported. They reach field technicians in an Excel file on SharePoint. Alongside, a Rust program collects outdoor sensor data for Grafana.",
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
          fr: "Traitement automatisé des photos sur le serveur en Python, avec les données du payload : reconnaissance optique des caractères (OCR) des valeurs numériques des instruments photographiés, comme la pression, puis export de ces valeurs vers les techniciens dans un fichier Excel sur SharePoint.",
          en: "Automated photo processing on the server in Python, with the payload data: optical character recognition (OCR) of the numeric values on the photographed gauges, such as pressure, then export of those values to technicians in an Excel file on SharePoint.",
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
        { fr: "Résultats remis aux techniciens dans un fichier Excel sur SharePoint.", en: "Results delivered to technicians in an Excel file on SharePoint." },
        { fr: "Rust pour récupérer les données de capteurs, Grafana pour les exploiter.", en: "Rust to collect the sensor data, Grafana to put it to use." },
      ],
      stack: [
        { label: { fr: "Cet emploi", en: "This job" }, items: ["Python", "Spot SDK", "OpenCV", "Pillow", "NumPy", "Linux", "SharePoint", "Rust", "Grafana"] },
        { label: { fr: "Hiver 2024, auxiliaire de recherche", en: "Winter 2024, research assistant" }, items: ["Python", "Spot SDK"], explored: ["C++"] },
      ],
      results: [
        {
          fr: "Prototype fonctionnel de sélection et d’enregistrement de missions autonomes.",
          en: "A working prototype to select and record autonomous missions.",
        },
        {
          fr: "OCR fonctionnel dans le prototype : les valeurs numériques des instruments photographiés étaient reconnues automatiquement et exportées pour les techniciens sur le terrain.",
          en: "Working OCR in the prototype: the numeric values of the photographed gauges were recognized automatically and exported for field technicians.",
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
          fr: "L’OCR fonctionnait dans un prototype, pas dans une solution industrielle dont la fiabilité aurait été mesurée; le moteur OCR utilisé n’est pas précisé ici.",
          en: "The OCR worked in a prototype, not in an industrial solution with measured reliability; the OCR engine used is not specified here.",
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
    caseStudy: {
      status: { fr: "Projet final de cours · Cégep de Sept-Îles", en: "Final course project · Cégep de Sept-Îles" },
      lede: {
        fr: "Une mission autonome du robot Spot qui repère la source de chaleur la plus élevée avec sa caméra thermique, s’en approche et collecte des données sur place.",
        en: "An autonomous Spot mission that finds the hottest heat source with the robot’s thermal camera, walks toward it and collects data on site.",
      },
      role: {
        fr: "Équipe de deux : scripts de mission adaptés du Spot SDK et intégration sur le robot",
        en: "Team of two: mission scripts adapted from the Spot SDK, and integration on the robot",
      },
      outcome: {
        fr: "Le robot repère la source la plus chaude, s’en approche avec des déviations et collecte son, photos et mesures sur place.",
        en: "The robot finds the hottest source, approaches it with some drift and collects sound, photos and readings on site.",
      },
      client: { fr: "Cours « Objets connectés », Cégep de Sept-Îles", en: "Connected Objects course, Cégep de Sept-Îles" },
      setting: true,
      authorship: "team",
      problem: {
        body: [
          {
            fr: "Projet final du cours « Objets connectés », intitulé « Plateforme robotique Spot connectée » : faire faire au robot Spot une mission autonome qui trouve une source de chaleur et y recueille des données.",
            en: "Final project of the Connected Objects course, titled “Connected Spot robotic platform”: have the Spot robot run an autonomous mission that finds a heat source and collects data there.",
          },
          {
            fr: "Le robot suit une mission enregistrée, cherche la source la plus chaude avec sa caméra thermique, s’en approche, puis collecte sur place du son, des photos et des mesures de capteurs.",
            en: "The robot follows a recorded mission, looks for the hottest source with its thermal camera, walks toward it, then collects sound, photos and sensor readings on site.",
          },
        ],
        constraints: [
          {
            fr: "Le code de base vient de quatre exemples du Spot SDK de Boston Dynamics; seules les modifications et l’intégration sont de l’équipe.",
            en: "The base code comes from four Boston Dynamics Spot SDK examples; only the changes and the integration are the team’s.",
          },
          {
            fr: "Les capteurs Dracal se lisent depuis un conteneur Docker fourni, que l’équipe a dû modifier.",
            en: "The Dracal sensors are read from a provided Docker container, which the team had to modify.",
          },
        ],
      },
      diagram: {
        lanes: [
          {
            label: { fr: "La mission", en: "The mission" },
            nodes: [
              { title: { fr: "Mission Autowalk", en: "Autowalk mission" }, detail: { fr: "Enregistrée à la tablette, trois points", en: "Recorded on the tablet, three waypoints" } },
              {
                title: { fr: "Balayage thermique", en: "Thermal scan" },
                detail: { fr: "Caméra Spot CAM+IR · source de chaleur la plus élevée", en: "Spot CAM+IR camera · hottest heat source" },
                link: { label: { fr: "pendant la mission", en: "during the mission" } },
              },
              {
                title: { fr: "Approche", en: "Approach" },
                detail: { fr: "Orientation selon l’angle de la caméra · avec des déviations", en: "Turns to the camera’s angle · with some drift" },
                link: { label: { fr: "source repérée", en: "source found" } },
              },
              {
                title: { fr: "Collecte sur place", en: "On-site collection" },
                detail: {
                  fr: "Audio, photo, photo infrarouge · capteurs Dracal : température, humidité, gaz",
                  en: "Audio, photo, infrared photo · Dracal sensors: temperature, humidity, gas",
                },
                link: { label: { fr: "arrivée", en: "arrival" } },
              },
            ],
          },
          {
            label: { fr: "Le code sur le robot", en: "The code on the robot" },
            nodes: [
              { title: { fr: "Exemples du Spot SDK", en: "Spot SDK examples" }, detail: { fr: "Boston Dynamics · quatre exemples", en: "Boston Dynamics · four examples" } },
              {
                title: { fr: "Scripts Python de la mission", en: "Python mission scripts" },
                detail: { fr: "Modifications et intégration de l’équipe", en: "Changes and integration by the team" },
                mine: true,
                link: { label: { fr: "adaptés", en: "adapted" } },
              },
            ],
          },
          {
            label: { fr: "Les capteurs", en: "The sensors" },
            nodes: [
              { title: { fr: "Conteneur Docker fourni", en: "Provided Docker container" } },
              {
                title: { fr: "Lecture des capteurs Dracal", en: "Reading the Dracal sensors" },
                detail: {
                  fr: "Écriture des données · docker-compose adapté · lancé sur Spot par SSH avec un script Bash",
                  en: "Writes the data · adapted docker-compose · run on Spot over SSH with a Bash script",
                },
                mine: true,
                link: { label: { fr: "modifié", en: "modified" } },
              },
            ],
          },
        ],
        explanation: {
          fr: "Le robot suit une mission Autowalk enregistrée à la tablette, qui passe par trois points. Pendant la mission, la caméra thermique balaie la zone pour repérer la source de chaleur la plus élevée; le robot s’oriente selon l’angle de la caméra et s’en approche, avec des déviations. Sur place, il collecte du son, des photos, des photos infrarouges et les mesures des capteurs Dracal. Côté code, l’équipe a adapté quatre exemples du Spot SDK et modifié le conteneur Docker fourni pour lire les capteurs.",
          en: "The robot follows an Autowalk mission recorded on the tablet, through three waypoints. During the mission, the thermal camera scans the area for the hottest heat source; the robot turns to the camera’s angle and walks toward it, with some drift. On site, it collects sound, photos, infrared photos and the Dracal sensor readings. On the code side, the team adapted four Spot SDK examples and modified the provided Docker container to read the sensors.",
        },
      },
      contributions: [
        {
          fr: "Scripts Python de la mission, adaptés de quatre exemples du Spot SDK : le code de base vient du SDK, les modifications et l’intégration sont de l’équipe.",
          en: "Python mission scripts adapted from four Spot SDK examples: the base code comes from the SDK, the changes and integration are the team’s.",
        },
        {
          fr: "Modification du conteneur Docker fourni pour lire les capteurs Dracal et écrire les données; adaptation du docker-compose.",
          en: "Modified the provided Docker container to read the Dracal sensors and write the data; adapted the docker-compose file.",
        },
        {
          fr: "Exécution sur Spot par connexion SSH, avec un script Bash lancé pendant la mission.",
          en: "Ran it on Spot over SSH, with a Bash script launched during the mission.",
        },
        { fr: "Rapport final du projet.", en: "The project’s final report." },
      ],
      decisions: [
        {
          fr: "Scripts construits à partir de quatre exemples du Spot SDK, modifiés et intégrés par l’équipe.",
          en: "Scripts built from four Spot SDK examples, modified and integrated by the team.",
        },
        { fr: "Mission Autowalk enregistrée à la tablette.", en: "Autowalk mission recorded on the tablet." },
        {
          fr: "Capteurs lus depuis le conteneur Docker fourni, modifié, et lancé sur le robot par SSH.",
          en: "Sensors read from the provided Docker container, modified and run on the robot over SSH.",
        },
      ],
      stack: [{ label: { fr: "Technologies", en: "Stack" }, items: ["Python", "Spot SDK", "Docker", "docker-compose", "Bash", "SSH"] }],
      results: [
        {
          fr: "Le robot repère la source de chaleur la plus élevée, s’en approche et collecte les données sur place.",
          en: "The robot finds the hottest heat source, walks toward it and collects data on site.",
        },
        {
          fr: "Données recueillies sur place : audio, photo, photo infrarouge, température, humidité et gaz.",
          en: "Data collected on site: audio, photo, infrared photo, temperature, humidity and gas.",
        },
      ],
      limits: [
        {
          fr: "L’approche vers la source se fait avec des déviations : le guidage n’est pas précis.",
          en: "The approach toward the source drifts: the guidance is not precise.",
        },
        {
          fr: "Projet en équipe de deux : la part de chacun n’est pas détaillée ici.",
          en: "A team-of-two project: each person’s share is not detailed here.",
        },
        {
          fr: "Une vidéo de démonstration existe, mais elle n’est pas publiée ici.",
          en: "A demo video exists, but it is not published here.",
        },
      ],
    },
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
            fr: "Le système utilise des capteurs à ultrasons et une caméra. Il a servi en laboratoire et à la maison, pour un usage personnel.",
            en: "The system uses ultrasonic sensors and a camera. It was used in a lab and at home, for personal use.",
          },
          {
            fr: "J’ai mené le projet du cahier des charges jusqu’à la validation des livrables avec le client.",
            en: "I ran the project from the specification to the deliverable sign-off with the client.",
          },
        ],
        constraints: [
          {
            fr: "Un système portable : de petits boîtiers contiennent le système de surveillance et le Raspberry Pi.",
            en: "A portable system: small enclosures hold the monitoring system and the Raspberry Pi.",
          },
          {
            fr: "Trois appareils à faire travailler ensemble : un Arduino, un Raspberry Pi et un appareil Android.",
            en: "Three devices working together: an Arduino, a Raspberry Pi and an Android device.",
          },
        ],
      },
      diagram: {
        lanes: [
          {
            nodes: [
              { title: { fr: "Capteurs", en: "Sensors" }, detail: { fr: "Capteurs à ultrasons", en: "Ultrasonic sensors" } },
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
                detail: { fr: "Java · compte lié au Raspberry Pi · notifications : présence ou absence de personnes", en: "Java · account linked to the Raspberry Pi · notifications: people present or absent" },
                mine: true,
                link: { label: { fr: "communications réseau", en: "network communication" }, both: true },
              },
            ],
          },
        ],
        explanation: {
          fr: "L’Arduino lit les capteurs et transmet leurs informations au Raspberry Pi. Le Raspberry Pi, au centre, traite les requêtes et gère le système. L’application mobile se connecte avec un compte lié au Raspberry Pi et affiche des notifications sur la présence ou l’absence de personnes. Le système comprend aussi une caméra. Le branchement de la caméra, la liaison entre les appareils et la méthode de détection ne sont pas détaillés ici.",
          en: "The Arduino reads the sensors and passes their information to the Raspberry Pi. The Raspberry Pi, at the centre, handles requests and manages the system. The mobile app signs in with an account linked to the Raspberry Pi and shows notifications about people being present or absent. The system also includes a camera. How the camera is connected, the links between the devices and the detection method are not detailed here.",
        },
      },
      contributions: [
        { fr: "Application Android en Java avec Android Studio : l’interface, la connexion par compte liée au Raspberry Pi et les notifications.", en: "Android app in Java with Android Studio: the interface, account sign-in linked to the Raspberry Pi, and notifications." },
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
        { fr: "Système utilisé en laboratoire et à la maison.", en: "System used in a lab and at home." },
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
    caseStudy: {
      status: { fr: "Laboratoires de cours · ÉTS", en: "Course labs · ÉTS" },
      lede: {
        fr: "Comprendre, tester et faire évoluer FinanceJ, une application Java existante, au fil de trois laboratoires du cours LOG240.",
        en: "Understanding, testing and changing FinanceJ, an existing Java application, over three labs of the LOG240 course.",
      },
      role: {
        fr: "Équipe de quatre : rétro-ingénierie, tests boîte noire, unitaires et d’intégration",
        en: "Team of four: reverse engineering, black-box, unit and integration tests",
      },
      outcome: {
        fr: "99 % de couverture sur AccountDAO et CategoryDAO, mesurée avec JaCoCo, et des défauts enregistrés dans GitLab.",
        en: "99% coverage on AccountDAO and CategoryDAO, measured with JaCoCo, and defects logged in GitLab.",
      },
      client: { fr: "LOG240 Tests et maintenance, ÉTS", en: "LOG240 Testing and Maintenance, ÉTS" },
      setting: true,
      authorship: "team",
      problem: {
        body: [
          {
            fr: "FinanceJ est une application Java existante, avec une base de données Apache Derby. Le cours demande de la comprendre, de traiter une demande de changement d’un client, puis de la tester à plusieurs niveaux.",
            en: "FinanceJ is an existing Java application with an Apache Derby database. The course asks students to understand it, handle a client change request, then test it at several levels.",
          },
          {
            fr: "Le travail s’étend sur trois laboratoires : rétro-ingénierie et analyse d’impacts, tests boîte noire, puis tests unitaires et d’intégration avec mesure de la couverture.",
            en: "The work spans three labs: reverse engineering and impact analysis, black-box testing, then unit and integration tests with coverage measurement.",
          },
        ],
        constraints: [
          {
            fr: "Une application existante, dont il faut d’abord retrouver la structure.",
            en: "An existing application, whose structure has to be recovered first.",
          },
          {
            fr: "La couverture de 99 % porte sur deux classes, AccountDAO et CategoryDAO, pas sur toute l’application.",
            en: "The 99% coverage covers two classes, AccountDAO and CategoryDAO, not the whole application.",
          },
        ],
      },
      diagram: {
        lanes: [
          {
            label: { fr: "Trois laboratoires", en: "Three labs" },
            nodes: [
              { title: { fr: "FinanceJ", en: "FinanceJ" }, detail: { fr: "Application Java existante · base Apache Derby", en: "Existing Java application · Apache Derby database" } },
              {
                title: { fr: "Rétro-ingénierie", en: "Reverse engineering" },
                detail: { fr: "Laboratoire 2 · demande de changement client, analyse d’impacts", en: "Lab 2 · client change request, impact analysis" },
                mine: true,
                link: { label: { fr: "comprendre", en: "understand" } },
              },
              {
                title: { fr: "Tests boîte noire", en: "Black-box tests" },
                detail: {
                  fr: "Laboratoire 3 · classes d’équivalence, valeurs frontalières · défauts dans GitLab",
                  en: "Lab 3 · equivalence classes, boundary values · defects in GitLab",
                },
                mine: true,
                link: { label: { fr: "tester de l’extérieur", en: "test from outside" } },
              },
              {
                title: { fr: "Tests unitaires et d’intégration", en: "Unit and integration tests" },
                detail: {
                  fr: "Laboratoire 4 · couche DAO : 99 % sur AccountDAO et CategoryDAO (JaCoCo) · modèle de l’interface et base Derby",
                  en: "Lab 4 · DAO layer: 99% on AccountDAO and CategoryDAO (JaCoCo) · UI model and Derby database",
                },
                mine: true,
                link: { label: { fr: "tester de l’intérieur", en: "test from inside" } },
              },
            ],
          },
        ],
        explanation: {
          fr: "L’équipe a d’abord reconstitué la structure de FinanceJ et mesuré l’impact d’une demande de changement. Elle a ensuite testé ses trois fonctions principales de l’extérieur, par classes d’équivalence et valeurs frontalières, en consignant les défauts dans GitLab. Enfin, elle a écrit des tests unitaires pour la couche d’accès aux données et des tests d’intégration entre le modèle de l’interface et la base Derby, avec la couverture mesurée par JaCoCo.",
          en: "The team first recovered FinanceJ’s structure and assessed the impact of a change request. It then tested the three main functions from the outside, with equivalence classes and boundary values, logging defects in GitLab. Finally, it wrote unit tests for the data access layer and integration tests between the UI model and the Derby database, with coverage measured by JaCoCo.",
        },
      },
      contributions: [
        {
          fr: "Rétro-ingénierie de FinanceJ, gestion d’une demande de changement client et analyse de ses impacts (laboratoire 2).",
          en: "Reverse-engineered FinanceJ, handled a client change request and analysed its impact (lab 2).",
        },
        {
          fr: "Tests boîte noire documentés par classes d’équivalence et valeurs frontalières pour les trois fonctions principales, tests fonctionnels écrits dans le code, défauts enregistrés dans GitLab (laboratoire 3).",
          en: "Black-box tests documented with equivalence classes and boundary values for the three main functions, functional tests written in code, defects logged in GitLab (lab 3).",
        },
        {
          fr: "Tests unitaires de la couche DAO, avec 99 % de couverture sur AccountDAO et CategoryDAO, et tests d’intégration entre le modèle de l’interface et la base Derby (laboratoire 4).",
          en: "Unit tests for the DAO layer, with 99% coverage on AccountDAO and CategoryDAO, and integration tests between the UI model and the Derby database (lab 4).",
        },
        {
          fr: "Analyse de la couverture avec JaCoCo, graphes de flux de contrôle et complexité cyclomatique de McCabe (laboratoire 4).",
          en: "Coverage analysis with JaCoCo, control-flow graphs and McCabe cyclomatic complexity (lab 4).",
        },
      ],
      decisions: [
        {
          fr: "Tests boîte noire construits par classes d’équivalence et valeurs frontalières.",
          en: "Black-box tests built from equivalence classes and boundary values.",
        },
        { fr: "Couverture du code mesurée avec JaCoCo.", en: "Code coverage measured with JaCoCo." },
        {
          fr: "Tests d’intégration qui vérifient que le modèle de l’interface interagit réellement avec la base Derby.",
          en: "Integration tests that check the UI model really talks to the Derby database.",
        },
        {
          fr: "Complexité cyclomatique de McCabe calculée à partir des graphes de flux de contrôle.",
          en: "McCabe cyclomatic complexity computed from control-flow graphs.",
        },
      ],
      stack: [{ label: { fr: "Technologies", en: "Stack" }, items: ["Java", "SQL", "Apache Derby", "JaCoCo", "GitLab"] }],
      results: [
        { fr: "99 % de couverture sur AccountDAO et CategoryDAO, mesurée avec JaCoCo.", en: "99% coverage on AccountDAO and CategoryDAO, measured with JaCoCo." },
        { fr: "Défauts identifiés et enregistrés dans GitLab.", en: "Defects found and logged in GitLab." },
        { fr: "Demande de changement analysée, avec ses impacts.", en: "Change request analysed, with its impact." },
      ],
      limits: [
        {
          fr: "Les 99 % portent sur AccountDAO et CategoryDAO seulement, pas sur toute l’application.",
          en: "The 99% applies to AccountDAO and CategoryDAO only, not to the whole application.",
        },
        {
          fr: "Laboratoires de cours en équipe de quatre : la part de chacun n’est pas détaillée ici.",
          en: "Course labs in a team of four: each person’s share is not detailed here.",
        },
        { fr: "Les rapports ne nomment pas le framework de test utilisé.", en: "The reports do not name the test framework used." },
      ],
    },
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
    caseStudy: {
      status: { fr: "Laboratoire de cours · ÉTS", en: "Course lab · ÉTS" },
      lede: {
        fr: "Une application JavaFX pour afficher et manipuler une image, construite en MVC avec trois vues qui restent synchronisées.",
        en: "A JavaFX app to display and edit an image, built in MVC with three views that stay in sync.",
      },
      role: { fr: "Équipe de trois : application JavaFX, architecture MVC, patron Observateur", en: "Team of three: JavaFX app, MVC architecture, Observer pattern" },
      outcome: {
        fr: "Trois vues indépendantes synchronisées par le patron Observateur/Sujet, avec zoom, translation, annulation, sauvegarde et chargement.",
        en: "Three independent views kept in sync by the Observer/Subject pattern, with zoom, pan, undo, save and load.",
      },
      client: { fr: "LOG121 Conception orientée objet, ÉTS", en: "LOG121 Object-Oriented Design, ÉTS" },
      setting: true,
      authorship: "team",
      problem: {
        body: [
          {
            fr: "Le laboratoire 5 du cours LOG121 porte sur une application JavaFX d’affichage et de manipulation d’image : zoom, translation, annulation, sauvegarde et chargement de fichier.",
            en: "Lab 5 of the LOG121 course is a JavaFX app to display and edit an image: zoom, pan, undo, save and load.",
          },
          {
            fr: "L’enjeu de conception : trois vues indépendantes doivent rester synchronisées quand l’image change.",
            en: "The design challenge: three independent views must stay in sync when the image changes.",
          },
        ],
      },
      diagram: {
        lanes: [
          {
            nodes: [
              { title: { fr: "Utilisateur", en: "User" }, detail: { fr: "Zoom, translation, annulation, sauvegarde, chargement", en: "Zoom, pan, undo, save, load" } },
              {
                title: { fr: "Contrôleur", en: "Controller" },
                detail: { fr: "Reçoit les actions", en: "Receives the actions" },
                mine: true,
                link: { label: { fr: "actions", en: "actions" } },
              },
              {
                title: { fr: "Modèle", en: "Model" },
                detail: { fr: "Sujet observé", en: "Observed subject" },
                mine: true,
                link: { label: { fr: "modifie", en: "updates" } },
              },
              {
                title: { fr: "Trois vues indépendantes", en: "Three independent views" },
                detail: { fr: "Observateurs, mises à jour à chaque changement", en: "Observers, refreshed on every change" },
                mine: true,
                link: { label: { fr: "notifie", en: "notifies" } },
              },
            ],
          },
        ],
        explanation: {
          fr: "L’utilisateur agit sur l’image : zoom, translation, annulation, sauvegarde ou chargement. En MVC, le contrôleur reçoit ces actions et modifie le modèle. Le modèle joue le rôle de sujet : à chaque changement, il prévient ses observateurs, les trois vues, qui se mettent à jour sans dépendre les unes des autres.",
          en: "The user acts on the image: zoom, pan, undo, save or load. In MVC, the controller receives these actions and updates the model. The model is the subject: on every change it notifies its observers, the three views, which refresh without depending on each other.",
        },
      },
      contributions: [
        {
          fr: "Application JavaFX d’affichage et de manipulation d’image : zoom, translation, annulation, sauvegarde et chargement de fichier.",
          en: "A JavaFX app to display and edit an image: zoom, pan, undo, save and load.",
        },
        { fr: "Architecture MVC avec trois vues indépendantes.", en: "MVC architecture with three independent views." },
        {
          fr: "Application de patrons de conception, dont Observateur/Sujet pour synchroniser les vues.",
          en: "Applied design patterns, including Observer/Subject to keep the views in sync.",
        },
      ],
      decisions: [
        { fr: "Modèle, vues et contrôleur séparés (MVC).", en: "Model, views and controller kept apart (MVC)." },
        {
          fr: "Les trois vues synchronisées par le patron Observateur/Sujet, pour qu’elles restent indépendantes.",
          en: "The three views kept in sync by the Observer/Subject pattern, so they stay independent.",
        },
      ],
      stack: [{ label: { fr: "Technologies", en: "Stack" }, items: ["Java", "JavaFX", "MVC", "Observer"] }],
      results: [
        {
          fr: "Application JavaFX avec zoom, translation, annulation, sauvegarde et chargement.",
          en: "A JavaFX app with zoom, pan, undo, save and load.",
        },
        { fr: "Trois vues indépendantes synchronisées par le patron Observateur/Sujet.", en: "Three independent views kept in sync by the Observer/Subject pattern." },
      ],
      limits: [
        {
          fr: "Laboratoire de cours en équipe de trois : la part de chacun n’est pas détaillée ici.",
          en: "A course lab in a team of three: each person’s share is not detailed here.",
        },
        { fr: "Aucune capture de l’application n’est publiée ici.", en: "No screenshot of the app is published here." },
      ],
    },
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
    caseStudy: {
      status: { fr: "Projet de session · Cégep de Sept-Îles", en: "Session project · Cégep de Sept-Îles" },
      lede: {
        fr: "Un laboratoire virtualisé pour inventorier des postes, gérer des tickets et superviser des machines, avec OCS Inventory, GLPI et Zabbix.",
        en: "A virtualized lab to inventory machines, manage tickets and monitor hosts, with OCS Inventory, GLPI and Zabbix.",
      },
      role: { fr: "Projet de session, rapport remis à mon nom", en: "Session project, report submitted under my name" },
      outcome: {
        fr: "Postes inventoriés et synchronisés dans GLPI, hôtes Linux et Windows supervisés par Zabbix, avec alerte par courriel.",
        en: "Machines inventoried and synced into GLPI, Linux and Windows hosts monitored by Zabbix, with an email alert.",
      },
      client: { fr: "Administration serveur II, Cégep de Sept-Îles", en: "Server Administration II, Cégep de Sept-Îles" },
      setting: true,
      authorship: "lab",
      problem: {
        body: [
          {
            fr: "Ce projet de session monte un petit parc informatique virtualisé, puis l’outille : inventaire des postes, gestion des tickets et supervision des machines.",
            en: "This session project builds a small virtualized fleet, then equips it: machine inventory, ticket management and host monitoring.",
          },
          {
            fr: "Le parc comprend un serveur Ubuntu Server 22.04 LTS et des clients Ubuntu et Windows 10, sur un réseau virtuel isolé de VMware ESXi.",
            en: "The fleet has an Ubuntu Server 22.04 LTS server and Ubuntu and Windows 10 clients, on an isolated VMware ESXi virtual network.",
          },
        ],
        constraints: [
          { fr: "Laboratoire de cours, pas un environnement de production.", en: "A course lab, not a production environment." },
          {
            fr: "Le laboratoire impliquait des collègues et une technicienne du département.",
            en: "The lab involved classmates and a department technician.",
          },
        ],
      },
      diagram: {
        lanes: [
          {
            label: { fr: "Réseau du laboratoire", en: "Lab network" },
            nodes: [
              {
                title: { fr: "VMware ESXi", en: "VMware ESXi" },
                detail: { fr: "Hyperviseur · commutateur virtuel, groupes de ports, réseau isolé", en: "Hypervisor · virtual switch, port groups, isolated network" },
                mine: true,
              },
              {
                title: { fr: "Serveur Ubuntu 22.04", en: "Ubuntu 22.04 server" },
                detail: { fr: "IP statique avec Netplan · serveur DHCP (isc-dhcp-server)", en: "Static IP with Netplan · DHCP server (isc-dhcp-server)" },
                mine: true,
                link: { label: { fr: "machine virtuelle", en: "virtual machine" } },
              },
              {
                title: { fr: "Clients Ubuntu et Windows 10", en: "Ubuntu and Windows 10 clients" },
                detail: { fr: "Adresses attribuées par DHCP · connectivité validée par ping", en: "Addresses from DHCP · connectivity checked with ping" },
                link: { label: { fr: "DHCP", en: "DHCP" } },
              },
            ],
          },
          {
            label: { fr: "Inventaire et tickets", en: "Inventory and tickets" },
            nodes: [
              { title: { fr: "Agents OCS Inventory", en: "OCS Inventory agents" }, detail: { fr: "Clients Windows et Linux", en: "Windows and Linux clients" }, mine: true },
              {
                title: { fr: "Serveur OCS Inventory", en: "OCS Inventory server" },
                detail: { fr: "MariaDB, Apache, PHP, Perl, Composer", en: "MariaDB, Apache, PHP, Perl, Composer" },
                mine: true,
                link: { label: { fr: "inventaire", en: "inventory" } },
              },
              {
                title: { fr: "GLPI", en: "GLPI" },
                detail: {
                  fr: "Plugin OCS, import et synchronisation · tickets, rôles usager, technicien, administrateur",
                  en: "OCS plugin, import and sync · tickets, user, technician and admin roles",
                },
                mine: true,
                link: { label: { fr: "import", en: "import" } },
              },
            ],
          },
          {
            label: { fr: "Supervision", en: "Monitoring" },
            nodes: [
              { title: { fr: "Agents Zabbix", en: "Zabbix agents" }, detail: { fr: "Clients Linux et Windows", en: "Linux and Windows clients" }, mine: true },
              {
                title: { fr: "Serveur Zabbix", en: "Zabbix server" },
                detail: { fr: "Gabarits Linux et Windows · interface web", en: "Linux and Windows templates · web interface" },
                mine: true,
                link: { label: { fr: "supervision", en: "monitoring" } },
              },
              {
                title: { fr: "Administrateurs", en: "Administrators" },
                detail: { fr: "Courriel en cas d’utilisation élevée des ressources", en: "Email on high resource usage" },
                link: { label: { fr: "alerte", en: "alert" } },
              },
            ],
          },
        ],
        explanation: {
          fr: "Sur l’hyperviseur VMware ESXi, un réseau virtuel isolé relie un serveur Ubuntu et des clients Ubuntu et Windows 10, qui reçoivent leur adresse du serveur DHCP. Des agents envoient l’inventaire des postes à OCS Inventory, synchronisé avec GLPI, où se gèrent les tickets. D’autres agents remontent l’état des machines à Zabbix, qui prévient les administrateurs par courriel quand les ressources sont trop sollicitées.",
          en: "On the VMware ESXi hypervisor, an isolated virtual network links an Ubuntu server and Ubuntu and Windows 10 clients, which get their address from the DHCP server. Agents send the machine inventory to OCS Inventory, synced with GLPI, where tickets are handled. Other agents report the hosts’ state to Zabbix, which emails the administrators when resources run high.",
        },
      },
      contributions: [
        {
          fr: "Réseau virtuel sur VMware ESXi : commutateur virtuel, groupes de ports, réseau isolé; recréation d’un groupe de ports et réattribution des adaptateurs réseau des machines virtuelles.",
          en: "Virtual network on VMware ESXi: virtual switch, port groups, isolated network; recreated a port group and reassigned the virtual machines’ network adapters.",
        },
        {
          fr: "Serveur Ubuntu : adresse IP statique et passerelle avec Netplan, serveur DHCP qui adresse les clients Ubuntu et Windows 10.",
          en: "Ubuntu server: static IP and gateway with Netplan, a DHCP server addressing the Ubuntu and Windows 10 clients.",
        },
        {
          fr: "OCS Inventory : serveur avec MariaDB, Apache, PHP, Perl et Composer, base de données, agents sur les clients Windows et Linux.",
          en: "OCS Inventory: server with MariaDB, Apache, PHP, Perl and Composer, its database, agents on the Windows and Linux clients.",
        },
        {
          fr: "GLPI : installation, plugin OCS Inventory, import et synchronisation des ordinateurs, scénario de tickets avec types, groupes et rôles usager, technicien et administrateur.",
          en: "GLPI: installation, OCS Inventory plugin, import and sync of the computers, a ticket scenario with types, groups and user, technician and admin roles.",
        },
        {
          fr: "Zabbix : serveur et base de données, interface web, agents Linux et Windows, hôtes déclarés avec des gabarits, alerte par courriel aux administrateurs.",
          en: "Zabbix: server and database, web interface, Linux and Windows agents, hosts declared with templates, email alert to administrators.",
        },
      ],
      decisions: [
        {
          fr: "Virtualisation sur VMware ESXi, un hyperviseur de type 1, avec un réseau isolé.",
          en: "Virtualization on VMware ESXi, a type 1 hypervisor, with an isolated network.",
        },
        { fr: "Adressage dynamique des clients par un serveur DHCP sur Ubuntu.", en: "Dynamic client addressing by a DHCP server on Ubuntu." },
        {
          fr: "OCS Inventory synchronisé avec GLPI par son plugin, pour relier l’inventaire et les tickets.",
          en: "OCS Inventory synced with GLPI through its plugin, linking inventory and tickets.",
        },
        { fr: "Supervision Zabbix avec des gabarits par système d’exploitation.", en: "Zabbix monitoring with per-OS templates." },
      ],
      stack: [
        {
          label: { fr: "Technologies", en: "Stack" },
          items: ["VMware ESXi", "Ubuntu Server 22.04", "Windows 10", "Netplan", "DHCP", "Apache", "MariaDB", "PHP", "Perl", "OCS Inventory", "GLPI", "Zabbix"],
        },
      ],
      results: [
        {
          fr: "Clients adressés par DHCP et connectivité validée par ping, après le diagnostic d’un blocage causé par le pare-feu Windows.",
          en: "Clients addressed by DHCP and connectivity checked with ping, after diagnosing a block caused by the Windows firewall.",
        },
        { fr: "Machines inventoriées et synchronisées entre OCS Inventory et GLPI.", en: "Machines inventoried and synced between OCS Inventory and GLPI." },
        { fr: "Scénario de tickets mené jusqu’à la résolution et la fermeture.", en: "A ticket scenario carried through to resolution and closing." },
        { fr: "Hôtes Linux et Windows supervisés, avec une alerte par courriel configurée.", en: "Linux and Windows hosts monitored, with an email alert set up." },
      ],
      limits: [
        {
          fr: "Laboratoire de cours, pas un environnement de production : aucune mesure n’est publiée.",
          en: "A course lab, not a production environment: no figures are published.",
        },
        { fr: "Aucune automatisation n’est documentée dans ce projet.", en: "No automation is documented in this project." },
        {
          fr: "Le projet ne porte pas sur la sécurité ni le durcissement des serveurs.",
          en: "The project does not cover security or server hardening.",
        },
        {
          fr: "Les identifiants et adresses du laboratoire ne sont pas publiés.",
          en: "The lab’s credentials and addresses are not published.",
        },
      ],
    },
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
    caseStudy: {
      status: { fr: "Travaux de cours · Cégep de Sept-Îles", en: "Coursework · Cégep de Sept-Îles" },
      lede: {
        fr: "Des applications web en C# : une API REST ASP.NET Core, un client Blazor qui la consomme, une application Blazor Server de gestion universitaire et un guide pour publier l’API sur IIS.",
        en: "Web apps in C#: an ASP.NET Core REST API, a Blazor client that consumes it, a Blazor Server university management app, and a guide to publishing the API on IIS.",
      },
      role: { fr: "Travaux de cours; auteur du guide de déploiement sur IIS", en: "Coursework; author of the IIS deployment guide" },
      outcome: {
        fr: "Un client Blazor qui lit, ajoute, modifie et supprime des données par une API REST ASP.NET Core, et un guide pour publier cette API sur IIS.",
        en: "A Blazor client that reads, adds, edits and deletes data through an ASP.NET Core REST API, and a guide to publishing that API on IIS.",
      },
      client: { fr: "Cours .NET et bases de données, Cégep de Sept-Îles", en: ".NET and database courses, Cégep de Sept-Îles" },
      setting: true,
      authorship: "course",
      problem: {
        body: [
          {
            fr: "Deux cours du DEC, « Exploiter un système de gestion de base de données » (automne 2023) et « Développement web transactionnel » (hiver 2024), portent sur des applications .NET reliées à une base de données.",
            en: "Two college courses, Database Management Systems (fall 2023) and Transactional Web Development (winter 2024), cover .NET applications backed by a database.",
          },
          {
            fr: "Le fil principal : une API REST ASP.NET Core avec Entity Framework Core, un client Blazor qui la consomme, et la mise en service de l’API sur IIS.",
            en: "The main thread: an ASP.NET Core REST API with Entity Framework Core, a Blazor client that consumes it, and putting the API into service on IIS.",
          },
        ],
        constraints: [
          {
            fr: "Travaux de cours; la part faite en équipe n’est pas précisée ici.",
            en: "Coursework; the share done in a team is not specified here.",
          },
          {
            fr: "Le contrôleur de l’API part de la génération automatique de Visual Studio, ensuite commentée et intégrée.",
            en: "The API controller starts from Visual Studio’s scaffolding, then commented and integrated.",
          },
        ],
      },
      diagram: {
        lanes: [
          {
            label: { fr: "API REST et client", en: "REST API and client" },
            nodes: [
              { title: { fr: "Client Blazor", en: "Blazor client" }, detail: { fr: "Api.razor · HttpClient", en: "Api.razor · HttpClient" }, mine: true },
              {
                title: { fr: "API REST ASP.NET Core", en: "ASP.NET Core REST API" },
                detail: { fr: "CRUD · contrôleur généré par Visual Studio, commenté et intégré", en: "CRUD · controller scaffolded by Visual Studio, commented and integrated" },
                mine: true,
                link: { label: { fr: "GET, POST, PUT, DELETE", en: "GET, POST, PUT, DELETE" }, both: true },
              },
              {
                title: { fr: "Entity Framework Core", en: "Entity Framework Core" },
                detail: { fr: "Migrations", en: "Migrations" },
                mine: true,
                link: { label: { fr: "accès aux données", en: "data access" }, both: true },
              },
              {
                title: { fr: "Base de données", en: "Database" },
                detail: { fr: "Type non précisé pour ce travail", en: "Type not specified for this work" },
                link: { both: true },
              },
            ],
          },
          {
            label: { fr: "Mise en service de l’API", en: "Putting the API into service" },
            nodes: [
              { title: { fr: "Guide IIS", en: "IIS guide" }, detail: { fr: "Rédigé en mai 2024", en: "Written in May 2024" }, mine: true },
              {
                title: { fr: "IIS", en: "IIS" },
                detail: { fr: "Site, pool d’applications, droits d’accès", en: "Site, application pool, permissions" },
                link: { label: { fr: "installation", en: "setup" } },
              },
              {
                title: { fr: "Réseau interne", en: "Internal network" },
                detail: { fr: "Règle de pare-feu entrante", en: "Inbound firewall rule" },
                link: { label: { fr: "accès", en: "access" } },
              },
            ],
          },
          {
            label: { fr: "Gestion universitaire", en: "University management" },
            nodes: [
              {
                title: { fr: "Application Blazor Server", en: "Blazor Server app" },
                detail: { fr: "Étudiants, cours, inscriptions · services", en: "Students, courses, enrolments · services" },
                mine: true,
              },
              {
                title: { fr: "Entity Framework Core", en: "Entity Framework Core" },
                detail: { fr: "Migrations successives", en: "Successive migrations" },
                mine: true,
                link: { both: true },
              },
              { title: { fr: "SQL Server", en: "SQL Server" }, detail: { fr: "SQL Express", en: "SQL Express" }, link: { both: true } },
            ],
          },
        ],
        explanation: {
          fr: "Le client Blazor envoie ses requêtes GET, POST, PUT et DELETE à l’API REST ASP.NET Core, qui passe par Entity Framework Core pour lire et écrire les données. Le guide décrit comment publier cette API sur IIS et l’ouvrir au réseau interne. À côté, l’application Blazor Server de gestion universitaire gère étudiants, cours et inscriptions dans SQL Server, aussi avec Entity Framework Core.",
          en: "The Blazor client sends GET, POST, PUT and DELETE requests to the ASP.NET Core REST API, which uses Entity Framework Core to read and write data. The guide explains how to publish this API on IIS and open it to the internal network. Alongside, the Blazor Server university management app handles students, courses and enrolments in SQL Server, also with Entity Framework Core.",
        },
      },
      contributions: [
        {
          fr: "Client Blazor (Api.razor) qui consomme l’API REST avec HttpClient : lecture, ajout, modification et suppression.",
          en: "A Blazor client (Api.razor) that consumes the REST API with HttpClient: read, add, edit and delete.",
        },
        {
          fr: "API REST ASP.NET Core Web API avec Entity Framework Core et migrations; contrôleur parti de la génération automatique de Visual Studio, commenté et intégré.",
          en: "An ASP.NET Core Web API with Entity Framework Core and migrations; the controller starts from Visual Studio scaffolding, commented and integrated.",
        },
        {
          fr: "Application Blazor Server de gestion universitaire (étudiants, cours, inscriptions) avec Entity Framework Core, SQL Server, des services et des migrations successives.",
          en: "A Blazor Server university management app (students, courses, enrolments) with Entity Framework Core, SQL Server, services and successive migrations.",
        },
        {
          fr: "Guide de déploiement de l’API sur IIS, dont je suis l’auteur : installation d’IIS, site, pool d’applications, droits d’accès et règle de pare-feu entrante.",
          en: "A guide to deploying the API on IIS, which I wrote: installing IIS, site, application pool, permissions and inbound firewall rule.",
        },
      ],
      decisions: [
        { fr: "Client Blazor séparé de l’API REST; ils communiquent par HTTP.", en: "A Blazor client separate from the REST API; they talk over HTTP." },
        { fr: "Accès aux données par Entity Framework Core et ses migrations.", en: "Data access through Entity Framework Core and its migrations." },
        {
          fr: "Publication sur IIS avec son pool d’applications et une règle de pare-feu entrante.",
          en: "Publishing on IIS with its application pool and an inbound firewall rule.",
        },
      ],
      stack: [{ label: { fr: "Technologies", en: "Stack" }, items: ["C#", "ASP.NET Core", "Blazor", "Entity Framework Core", "SQL Server", "IIS"] }],
      around: [
        {
          heading: { fr: "Autres travaux .NET du DEC", en: "Other .NET coursework" },
          body: {
            fr: "Cours « Exploiter un système de gestion de base de données », automne 2023.",
            en: "Database Management Systems course, fall 2023.",
          },
          points: [
            { fr: "Applications C# WinForms connectées à SQL Server avec ADO.NET.", en: "C# WinForms apps connected to SQL Server with ADO.NET." },
            {
              fr: "Entity Framework : DbContext, DbSet, migrations par annotations et Fluent API.",
              en: "Entity Framework: DbContext, DbSet, migrations with annotations and the Fluent API.",
            },
            {
              fr: "Applications ASP.NET Core MVC : contrôleurs, vues et opérations CRUD avec Entity Framework et SQL Server.",
              en: "ASP.NET Core MVC apps: controllers, views and CRUD operations with Entity Framework and SQL Server.",
            },
          ],
        },
      ],
      results: [
        {
          fr: "Client Blazor qui couvre les quatre opérations GET, POST, PUT et DELETE, vérifié dans le code source.",
          en: "A Blazor client covering the four operations GET, POST, PUT and DELETE, checked in the source code.",
        },
        { fr: "Application de gestion universitaire avec migrations successives de la base.", en: "A university management app with successive database migrations." },
        { fr: "Guide IIS rédigé pour rendre l’API disponible sur le réseau interne.", en: "An IIS guide written to make the API available on the internal network." },
      ],
      limits: [
        { fr: "Travaux de cours, pas des applications en production.", en: "Coursework, not production applications." },
        { fr: "La base de données utilisée par l’API REST n’est pas précisée ici.", en: "The database behind the REST API is not specified here." },
      ],
    },
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
    caseStudy: {
      status: { fr: "Travaux de cours · Cégep de Sept-Îles", en: "Coursework · Cégep de Sept-Îles" },
      lede: {
        fr: "Deux sites PHP avec MySQL qui gèrent des comptes : connexion, rôles, activation par courriel, double authentification TOTP et connexion OAuth.",
        en: "Two PHP sites with MySQL that manage accounts: sign-in, roles, email activation, TOTP two-factor and OAuth sign-in.",
      },
      role: { fr: "Travaux de cours en PHP et MySQL, code commenté", en: "PHP and MySQL coursework, commented code" },
      outcome: {
        fr: "Comptes avec rôles usager et administrateur, double authentification TOTP par code QR et connexion OAuth Google, Facebook et GitHub.",
        en: "Accounts with user and admin roles, TOTP two-factor with a QR code, and Google, Facebook and GitHub OAuth sign-in.",
      },
      client: { fr: "Programmation environnement Internet, Cégep de Sept-Îles", en: "Internet Programming, Cégep de Sept-Îles" },
      setting: true,
      authorship: "course",
      problem: {
        body: [
          {
            fr: "Le cours « Programmation environnement Internet » (hiver 2024) porte sur des sites web complets en PHP avec MySQL.",
            en: "The Internet Programming course (winter 2024) covers complete PHP websites with MySQL.",
          },
          {
            fr: "Le premier travail gère la connexion et les rôles; le second renforce l’inscription et la connexion : activation par courriel, double authentification et connexion par des comptes externes.",
            en: "The first assignment handles sign-in and roles; the second strengthens sign-up and sign-in: email activation, two-factor authentication and sign-in with external accounts.",
          },
        ],
        constraints: [{ fr: "Travaux de cours, pas des sites en production.", en: "Coursework, not production sites." }],
      },
      diagram: {
        lanes: [
          {
            label: { fr: "TP1 : connexion et rôles", en: "Assignment 1: sign-in and roles" },
            nodes: [
              { title: { fr: "Connexion", en: "Sign-in" }, detail: { fr: "Table d’usagers · password_verify", en: "User table · password_verify" }, mine: true },
              {
                title: { fr: "Session", en: "Session" },
                detail: { fr: "Pages protégées", en: "Protected pages" },
                mine: true,
                link: { label: { fr: "mot de passe vérifié", en: "password checked" } },
              },
              {
                title: { fr: "Rôle", en: "Role" },
                detail: { fr: "Usager : page personnelle · administrateur : gestion des comptes", en: "User: personal page · admin: account management" },
                mine: true,
                link: { label: { fr: "selon le rôle", en: "by role" } },
              },
            ],
          },
          {
            label: { fr: "TP2 : inscription et connexion renforcée", en: "Assignment 2: stronger sign-up and sign-in" },
            nodes: [
              { title: { fr: "Inscription", en: "Sign-up" }, detail: { fr: "Validation d’unicité · reCAPTCHA", en: "Uniqueness checks · reCAPTCHA" }, mine: true },
              {
                title: { fr: "Activation", en: "Activation" },
                detail: { fr: "Courriel avec PHPMailer", en: "Email with PHPMailer" },
                mine: true,
                link: { label: { fr: "courriel", en: "email" } },
              },
              {
                title: { fr: "Double authentification", en: "Two-factor" },
                detail: { fr: "TOTP avec code QR (Google2FA, BaconQrCode)", en: "TOTP with a QR code (Google2FA, BaconQrCode)" },
                mine: true,
                link: { label: { fr: "connexion", en: "sign-in" } },
              },
            ],
          },
          {
            label: { fr: "TP2 : comptes externes", en: "Assignment 2: external accounts" },
            nodes: [
              { title: { fr: "Google, Facebook, GitHub", en: "Google, Facebook, GitHub" } },
              {
                title: { fr: "Connexion OAuth", en: "OAuth sign-in" },
                mine: true,
                link: { label: { fr: "OAuth", en: "OAuth" } },
              },
            ],
          },
        ],
        explanation: {
          fr: "Dans le premier site, l’usager se connecte avec un mot de passe vérifié contre son empreinte (password_hash, password_verify); une session protège les pages, et le rôle décide de l’accès : page personnelle pour l’usager, gestion des comptes pour l’administrateur. Dans le second, l’inscription vérifie l’unicité et passe par reCAPTCHA, le compte s’active par courriel, et la connexion peut demander un code TOTP ou passer par Google, Facebook ou GitHub. Dans les deux, le code utilise des requêtes préparées PDO et échappe les sorties avec htmlspecialchars.",
          en: "In the first site, users sign in with a password checked against its hash (password_hash, password_verify); a session protects the pages, and the role decides access: a personal page for users, account management for the admin. In the second, sign-up checks uniqueness and goes through reCAPTCHA, the account is activated by email, and sign-in can ask for a TOTP code or go through Google, Facebook or GitHub. In both, the code uses PDO prepared statements and escapes output with htmlspecialchars.",
        },
      },
      contributions: [
        {
          fr: "TP1 : site multipage avec table d’usagers, mots de passe hachés (password_hash, password_verify), sessions, rôles usager et administrateur, pages protégées, page personnelle et page d’administration des comptes.",
          en: "Assignment 1: a multipage site with a user table, hashed passwords (password_hash, password_verify), sessions, user and admin roles, protected pages, a personal page and an account admin page.",
        },
        {
          fr: "TP2 : inscription avec validations d’unicité, activation du compte par courriel (PHPMailer), double authentification TOTP avec code QR (Google2FA, BaconQrCode), connexion OAuth Google, Facebook et GitHub, reCAPTCHA.",
          en: "Assignment 2: sign-up with uniqueness checks, email account activation (PHPMailer), TOTP two-factor with a QR code (Google2FA, BaconQrCode), Google, Facebook and GitHub OAuth sign-in, reCAPTCHA.",
        },
        {
          fr: "Code commenté, avec requêtes préparées PDO et échappement des sorties (htmlspecialchars).",
          en: "Commented code, with PDO prepared statements and output escaping (htmlspecialchars).",
        },
      ],
      decisions: [
        {
          fr: "Mots de passe stockés hachés avec password_hash, vérifiés avec password_verify.",
          en: "Passwords stored hashed with password_hash, checked with password_verify.",
        },
        { fr: "Accès aux données par PDO avec des requêtes préparées.", en: "Data access through PDO with prepared statements." },
        { fr: "Deuxième facteur TOTP, configuré par code QR.", en: "A TOTP second factor, set up with a QR code." },
        { fr: "Connexion déléguée par OAuth à Google, Facebook et GitHub.", en: "Sign-in delegated through OAuth to Google, Facebook and GitHub." },
      ],
      stack: [
        {
          label: { fr: "Technologies", en: "Stack" },
          items: ["PHP", "MySQL", "PDO", "PHPMailer", "OAuth", "TOTP", "Google2FA", "BaconQrCode", "reCAPTCHA"],
        },
      ],
      results: [
        { fr: "Deux sites complets avec comptes, rôles et pages protégées.", en: "Two complete sites with accounts, roles and protected pages." },
        { fr: "Double authentification TOTP et connexion OAuth avec trois fournisseurs.", en: "TOTP two-factor and OAuth sign-in with three providers." },
        {
          fr: "Protections vérifiées dans le code : requêtes préparées PDO et htmlspecialchars.",
          en: "Protections checked in the code: PDO prepared statements and htmlspecialchars.",
        },
      ],
      limits: [
        { fr: "Travaux de cours, pas des sites en production.", en: "Coursework, not production sites." },
        {
          fr: "Aucun audit ni test d’intrusion : seules les protections vérifiées dans le code sont mentionnées.",
          en: "No audit or penetration test: only the protections checked in the code are mentioned.",
        },
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
