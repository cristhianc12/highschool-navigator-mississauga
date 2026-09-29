// Extra information shown when a program card is opened. Only facts confirmed in official sources
// (DPCDSB and Peel program pages, Peel's admissions table and dates). Edit here to update.
// Fields: who (who it is for), reqs (requirements), how (how to apply), keyDates, links.

const x = (es, en, fr) => ({ es, en, fr });
const L = (es, en, fr, u) => ({ l: x(es, en, fr), u });

const DP = "https://www.dpcdsb.org/programs-services/secondary/";
const PEEL = "https://www.peelschools.org/";

const DP_HOW = x(
  "La inscripción se hace en la escuela sede; las fechas se publican en su sitio web y en las charlas informativas. Los programas regionales incluyen una tarifa de aplicación no reembolsable y una tarifa anual del programa. El DPCDSB no da transporte a los programas regionales, salvo que vivas dentro del boundary de la escuela y cumplas los criterios de transporte.",
  "Registration goes through the host school; dates are posted on its website and at the information sessions. Regional programs include a non-refundable application fee and an annual program fee. DPCDSB does not provide transportation to regional programs unless you live within the school's boundary and meet the transportation criteria.",
  "L'inscription se fait à l'école hôte; les dates sont publiées sur son site et lors des séances d'information. Les programmes régionaux comportent des frais de demande non remboursables et des frais annuels de programme. Le DPCDSB n'offre pas de transport vers les programmes régionaux, sauf si vous habitez dans le secteur de l'école et répondez aux critères de transport."
);
const PEEL_HOW = x(
  "Se aplica en línea del 3 de noviembre (8:30 a. m.) al 24 de noviembre de 2026 (11:59 p. m.). Se revisan los criterios de cada programa y quienes los cumplen entran a un sorteo que hace el board. Las primeras ofertas salen el 2 de febrero de 2027 (después de las 3 p. m.). Debes aplicar al programa que corresponde a tu boundary. Hay una tarifa por aplicar y una tarifa anual del programa.",
  "Apply online from November 3 (8:30 a.m.) to November 24, 2026 (11:59 p.m.). Applications are reviewed against each program's criteria and eligible applicants go into a random selection run by the board. First offers go out on February 2, 2027 (after 3 p.m.). You must apply to the program that matches your home boundary. An application fee and an annual program fee apply.",
  "On présente sa demande en ligne du 3 novembre (8 h 30) au 24 novembre 2026 (23 h 59). Les demandes sont évaluées selon les critères de chaque programme, puis les candidats admissibles participent à un tirage au sort mené par le conseil. Les premières offres sont émises le 2 février 2027 (après 15 h). Vous devez demander le programme qui correspond à votre secteur. Des frais de demande et des frais annuels de programme s'appliquent."
);
const PEEL_DATES = x(
  "Ofertas: 1.ª ronda 2 feb 2027, 2.ª 16 feb, 3.ª 23 feb, 4.ª 8 mar 2027. Lista de espera desde el 30 de marzo de 2027.",
  "Offers: round 1 on Feb 2, 2027, round 2 on Feb 16, round 3 on Feb 23, round 4 on Mar 8, 2027. Waitlist opens Mar 30, 2027.",
  "Offres : 1re ronde le 2 févr. 2027, 2e le 16 févr., 3e le 23 févr., 4e le 8 mars 2027. Liste d'attente dès le 30 mars 2027."
);
const G7 = x("Notas finales de Grade 7", "Grade 7 final report card", "Bulletin final de 7e année");

export const PROGRAM_INFO = {
  // ---------------------------------------------------------------- DPCDSB
  ap: {
    who: x("Para estudiantes que quieren cursos de nivel universitario mientras están en la secundaria y pueden tomar más de un AP.", "For students who want university-level courses while in high school and may take more than one AP.", "Pour les élèves qui veulent des cours de niveau universitaire au secondaire et qui peuvent suivre plus d'un cours AP."),
    reqs: [x("Elige materia por materia; no es un paquete cerrado.", "You choose subject by subject; it is not a fixed package.", "On choisit matière par matière; ce n'est pas un ensemble fixe."), x("Los exámenes AP pueden darte créditos o ubicación avanzada en la universidad.", "AP exams can earn university credit or advanced standing.", "Les examens AP peuvent donner des crédits ou une place avancée à l'université.")],
    how: DP_HOW,
    links: [L("Página del DPCDSB", "DPCDSB program page", "Page du DPCDSB", DP + "advanced-placement")],
  },
  ib: {
    who: x("Para estudiantes que buscan un diploma preuniversitario estructurado y exigente, con seis grupos de materias.", "For students seeking a structured, demanding pre-university diploma with six subject groups.", "Pour les élèves qui cherchent un diplôme préuniversitaire structuré et exigeant, avec six groupes de matières."),
    reqs: [x("Diploma de dos años (Grade 11 y 12), con una secuencia previa en Grade 9 y 10.", "Two-year diploma (Grade 11 and 12), with a preparatory sequence in Grade 9 and 10.", "Diplôme de deux ans (11e et 12e année), avec une séquence préparatoire en 9e et 10e année."), x("Es un paquete integrado: no se toman materias sueltas como en AP.", "It is an integrated package: you do not take single subjects as in AP.", "C'est un ensemble intégré : on ne suit pas des matières isolées comme en AP.")],
    how: DP_HOW,
    links: [L("Página del DPCDSB", "DPCDSB program page", "Page du DPCDSB", DP + "international-baccalaureate")],
  },
  steam: {
    who: x("Para estudiantes a quienes les gusta aprender con proyectos: ciencia, tecnología, ingeniería, artes y matemáticas.", "For students who like learning through projects: science, technology, engineering, arts and math.", "Pour les élèves qui aiment apprendre par projets : sciences, technologie, ingénierie, arts et mathématiques."),
    reqs: [x("Está abierto a estudiantes que entran a Grade 9 en la región de Peel y el condado de Dufferin.", "Open to students entering Grade 9 in Peel Region and Dufferin County.", "Ouvert aux élèves qui entrent en 9e année dans la région de Peel et le comté de Dufferin."), x("Grade 9 a 12. La inscripción en St. Joan of Arc abre en octubre; en Brampton, en noviembre (fechas por confirmar).", "Grades 9–12. Registration at St. Joan of Arc opens in October; at the Brampton sites, in November (dates to be confirmed).", "9e à 12e année. L'inscription à St. Joan of Arc ouvre en octobre; aux sites de Brampton, en novembre (dates à confirmer).")],
    how: DP_HOW,
    links: [L("Página del DPCDSB", "DPCDSB program page", "Page du DPCDSB", DP + "regional-stem-program")],
  },
  arts: {
    who: x("Para estudiantes que quieren estudiar danza, teatro, música, medios o artes visuales dentro de la secundaria.", "For students who want to study dance, drama, music, media or visual arts within high school.", "Pour les élèves qui veulent étudier la danse, le théâtre, la musique, les médias ou les arts visuels au secondaire."),
    reqs: [x("Puede pedir audición o portafolio; los requisitos los publica cada escuela sede.", "May require an audition or portfolio; each host school publishes its requirements.", "Peut exiger une audition ou un portfolio; chaque école hôte publie ses exigences.")],
    how: DP_HOW,
    links: [L("Página del DPCDSB", "DPCDSB program page", "Page du DPCDSB", DP + "regional-arts-program")],
  },
  sports: {
    who: x("Para estudiantes interesados en deporte, condición física y liderazgo. No es solo para atletas de élite.", "For students interested in sport, fitness and leadership. It is not only for elite athletes.", "Pour les élèves intéressés par le sport, le conditionnement physique et le leadership. Pas seulement pour les athlètes d'élite."),
    reqs: [x("Puede conectar con un SHSM de Sports.", "Can connect to a Sports SHSM.", "Peut se relier à une MHS en sports.")],
    how: DP_HOW,
    links: [L("Página del DPCDSB", "DPCDSB program page", "Page du DPCDSB", DP + "regional-sports-program"), L("Programa en St. Martin", "Program at St. Martin", "Programme à St. Martin", "https://martn.dpcdsb.org/our-school/about-us/regional-sports-program")],
  },
  bakery: {
    who: x("Para estudiantes que quieren un camino técnico de panadería dentro de una secundaria general.", "For students who want a technical bakery pathway inside a general high school.", "Pour les élèves qui veulent une voie technique en boulangerie au sein d'une école secondaire générale."),
    reqs: [x("Grade 10 a 12: cuatro cursos de panadería, con Co-op u OYAP.", "Grades 10–12: four bakery courses, with Co-op or OYAP.", "10e à 12e année : quatre cours de boulangerie, avec éducation coopérative ou PAJO."), x("Primer año: 2026-27.", "First year: 2026-27.", "Première année : 2026-2027.")],
    how: DP_HOW,
    links: [L("Página del DPCDSB", "DPCDSB program page", "Page du DPCDSB", DP + "bakery-school"), L("Folleto del programa", "Program flyer", "Dépliant du programme", "https://www.dpcdsb.org/download/556428")],
  },
  fi: {
    who: x("Para estudiantes que ya cursaron French Immersion en primaria (desde Grade 1) y quieren continuar.", "For students who took French Immersion in elementary (from Grade 1) and want to continue.", "Pour les élèves qui ont suivi l'immersion française à l'élémentaire (dès la 1re année) et veulent poursuivre."),
    reqs: [x("Cada centro recibe estudiantes de primarias asignadas.", "Each centre takes students from designated elementary schools.", "Chaque centre accueille des élèves d'écoles élémentaires désignées.")],
    how: DP_HOW,
    links: [L("Página del DPCDSB", "DPCDSB program page", "Page du DPCDSB", DP + "french-immersion-program"), L("Preguntas frecuentes", "FAQ", "Foire aux questions", "https://www.dpcdsb.org/download/538930")],
  },
  ef: {
    who: x("Para estudiantes que quieren más francés que el programa básico, sin ser inmersión completa.", "For students who want more French than the core program, without full immersion.", "Pour les élèves qui veulent plus de français que le programme de base, sans immersion complète."),
    reqs: [x("Seis secundarias del DPCDSB ofrecen el programa. Cada centro recibe estudiantes de primarias asignadas.", "Six DPCDSB high schools offer the program. Each centre takes students from designated elementary schools.", "Six écoles secondaires du DPCDSB offrent le programme. Chaque centre accueille des élèves d'écoles élémentaires désignées.")],
    how: DP_HOW,
    links: [L("Página del DPCDSB", "DPCDSB program page", "Page du DPCDSB", DP + "extended-french-program")],
  },
  alt: {
    who: x("Para estudiantes que buscan una alternativa a la secundaria tradicional.", "For students looking for an alternative to traditional high school.", "Pour les élèves qui cherchent une solution de rechange au secondaire traditionnel."),
    reqs: [x("Confirma los requisitos y el proceso en el sitio de la escuela.", "Confirm requirements and process on the school's website.", "Confirmez les exigences et le processus sur le site de l'école.")],
    how: DP_HOW,
    links: [L("Página del DPCDSB", "DPCDSB program page", "Page du DPCDSB", DP + "alternative-education"), L("Sitio de St. Oscar Romero", "St. Oscar Romero website", "Site de St. Oscar Romero", "https://romer.dpcdsb.org/")],
  },

  // ------------------------------------------------------------------ Peel
  "p-ap": {
    who: x("Para estudiantes muy motivados que quieren prepararse para la universidad con cursos AP.", "For highly motivated students who want to prepare for university with AP courses.", "Pour les élèves très motivés qui veulent se préparer à l'université avec des cours AP."),
    reqs: [G7, x("Evaluación presencial de matemáticas y lectoescritura.", "In-person numeracy and literacy assessment.", "Évaluation en personne en numératie et en littératie.")],
    keyDates: x("Evaluación presencial: 5 de diciembre de 2026 (Central Peel y John Fraser; hora la define la escuela).", "In-person assessment: December 5, 2026 (Central Peel and John Fraser; time set by the school).", "Évaluation en personne : 5 décembre 2026 (Central Peel et John Fraser; l'heure est fixée par l'école)."),
    how: PEEL_HOW, dates: PEEL_DATES,
    links: [L("Página de Peel", "Peel program page", "Page de Peel", PEEL + "advanced-placement")],
  },
  "p-ib": {
    who: x("Para estudiantes que buscan el Diploma IB. Se llega por MYP (Glenforest, Turner Fenton) o por Pre-IB (Erindale, Harold M. Brathwaite).", "For students seeking the IB Diploma. You get there through MYP (Glenforest, Turner Fenton) or Pre-IB (Erindale, Harold M. Brathwaite).", "Pour les élèves qui visent le diplôme du BI. On y accède par le PEI (Glenforest, Turner Fenton) ou le pré-BI (Erindale, Harold M. Brathwaite)."),
    reqs: [G7, x("Evaluación presencial (excepto en Erindale SS).", "In-person assessment (except at Erindale SS).", "Évaluation en personne (sauf à Erindale SS)."), x("Entrada en Grade 11: notas finales de Grade 9, matemáticas de Grade 10 y MCR3U, y francés académico de Grade 10 (FSF2D, FIF2D o FEF2D).", "Grade 11 entry: Grade 9 final marks, Grade 10 math and MCR3U, and Grade 10 Academic French (FSF2D, FIF2D or FEF2D).", "Entrée en 11e année : notes finales de 9e année, mathématiques de 10e année et MCR3U, et français théorique de 10e année (FSF2D, FIF2D ou FEF2D).")],
    keyDates: x("Evaluación presencial: 12 de diciembre de 2026 (Glenforest, Harold M. Brathwaite y Turner Fenton). Erindale no tiene evaluación.", "In-person assessment: December 12, 2026 (Glenforest, Harold M. Brathwaite and Turner Fenton). Erindale has no assessment.", "Évaluation en personne : 12 décembre 2026 (Glenforest, Harold M. Brathwaite et Turner Fenton). Erindale n'a pas d'évaluation."),
    how: PEEL_HOW, dates: PEEL_DATES,
    links: [L("Página de Peel", "Peel program page", "Page de Peel", PEEL + "ib")],
  },
  "p-arts": {
    who: x("Para estudiantes que quieren estudiar danza, teatro, música o artes visuales, con audición o portafolio.", "For students who want to study dance, drama, music or visual arts, with an audition or portfolio.", "Pour les élèves qui veulent étudier la danse, le théâtre, la musique ou les arts visuels, avec audition ou portfolio."),
    reqs: [G7, x("Respuesta escrita (5 preguntas).", "Written response (5 questions).", "Réponse écrite (5 questions)."), x("Audición (música vocal o instrumental, danza, teatro) o portafolio (artes visuales).", "Audition (vocal or instrumental music, dance, drama) or portfolio (visual arts).", "Audition (musique vocale ou instrumentale, danse, théâtre) ou portfolio (arts visuels).")],
    keyDates: x("Audiciones: 27 y 28 de enero de 2027 (Cawthra Park y Mayfield; hora la define la escuela).", "Auditions: January 27 and 28, 2027 (Cawthra Park and Mayfield; time set by the school).", "Auditions : 27 et 28 janvier 2027 (Cawthra Park et Mayfield; l'heure est fixée par l'école)."),
    how: PEEL_HOW, dates: PEEL_DATES,
    links: [L("Página de Peel", "Peel program page", "Page de Peel", PEEL + "arts")],
  },
  "p-scitech": {
    who: x("Para estudiantes interesados en STEM con aprendizaje práctico y alianzas con universidades e industria.", "For students interested in STEM with hands-on learning and partnerships with post-secondary institutions and industry.", "Pour les élèves intéressés par les STIM avec un apprentissage pratique et des partenariats avec des établissements postsecondaires et l'industrie."),
    reqs: [G7, x("No pide respuesta escrita, audición ni evaluación presencial.", "No written response, audition or in-person assessment.", "Aucune réponse écrite, audition ni évaluation en personne.")],
    how: PEEL_HOW, dates: PEEL_DATES,
    links: [L("Página de Peel", "Peel program page", "Page de Peel", PEEL + "scitech")],
  },
  "p-ibt": {
    who: x("Para estudiantes que quieren negocios y tecnología con proyectos, emprendimiento y robótica.", "For students who want business and technology through projects, entrepreneurship and robotics.", "Pour les élèves qui veulent les affaires et la technologie par projets, l'entrepreneuriat et la robotique."),
    reqs: [G7, x("Video de máximo 1 min 30 s.", "Video submission (max 1 min 30 s).", "Vidéo de 1 min 30 s maximum.")],
    how: PEEL_HOW, dates: PEEL_DATES,
    links: [L("Página de Peel", "Peel program page", "Page de Peel", PEEL + "international-business-and-technology")],
  },
  "p-tet": {
    who: x("Para estudiantes interesados en la industria del transporte terrestre, marítimo y aeroespacial.", "For students interested in the land, marine and aerospace transportation industries.", "Pour les élèves intéressés par les industries du transport terrestre, maritime et aérospatial."),
    reqs: [G7, x("Respuesta escrita (4 preguntas).", "Written response (4 questions).", "Réponse écrite (4 questions).")],
    how: PEEL_HOW, dates: PEEL_DATES,
    links: [L("Página de Peel", "Peel program page", "Page de Peel", PEEL + "transportation-engineering-and-technology")],
  },
  "p-strings": {
    who: x("Para estudiantes que quieren estudiar un instrumento de cuerda, desde principiante hasta avanzado.", "For students who want to study a string instrument, from beginner to advanced.", "Pour les élèves qui veulent étudier un instrument à cordes, du débutant à l'avancé."),
    reqs: [G7, x("Respuesta escrita (2 preguntas).", "Written response (2 questions).", "Réponse écrite (2 questions)."), x("Audición.", "Audition.", "Audition.")],
    keyDates: x("Audición: 5 de diciembre de 2026 en Central Peel; en Port Credit, fecha por confirmar.", "Audition: December 5, 2026 at Central Peel; at Port Credit, date to be confirmed.", "Audition : 5 décembre 2026 à Central Peel; à Port Credit, date à confirmer."),
    how: PEEL_HOW, dates: PEEL_DATES,
    links: [L("Página de Peel", "Peel program page", "Page de Peel", PEEL + "strings")],
  },
  "p-trades": {
    who: x("Para estudiantes que aprenden haciendo y quieren un camino hacia oficios especializados (Judith Nyman y West Credit).", "For hands-on learners who want a pathway into skilled trades (Judith Nyman and West Credit).", "Pour les élèves qui apprennent en faisant et veulent une voie vers les métiers spécialisés (Judith Nyman et West Credit)."),
    reqs: [G7, x("En Judith Nyman: respuesta escrita (1 pregunta), un artefacto a tu elección y una encuesta de intereses; la audición la define la escuela.", "At Judith Nyman: written response (1 question), an artifact of your choice and a survey of interest; audition set by the school.", "À Judith Nyman : réponse écrite (1 question), un artefact de votre choix et un sondage d'intérêts; l'audition est fixée par l'école."), x("En West Credit: un artefacto y una audición.", "At West Credit: an artifact and an audition.", "À West Credit : un artefact et une audition.")],
    keyDates: x("Audición en West Credit: 27 de enero de 2027. En Judith Nyman, por confirmar. También hay entrada en Grade 11.", "West Credit audition: January 27, 2027. Judith Nyman: to be confirmed. Grade 11 entry is also available.", "Audition à West Credit : 27 janvier 2027. Judith Nyman : à confirmer. Une entrée en 11e année est aussi offerte."),
    how: PEEL_HOW, dates: PEEL_DATES,
    links: [L("Página de Peel", "Peel program page", "Page de Peel", PEEL + "regional-skilled-trades-program")],
  },
};

export const PEEL_MAIN_LINK = { l: x("Todos los RLCP de Peel", "All Peel RLCPs", "Tous les RLCP de Peel"), u: PEEL + "secondary-regional-learning-choice-programs" };
