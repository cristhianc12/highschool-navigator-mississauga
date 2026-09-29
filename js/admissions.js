// What a family needs to get into a school-level program (DPCDSB regional programs hosted in Mississauga).
// Only facts stated on the official school / board pages, checked in September 2026. Where a page publishes
// no minimum marks, `marks` says so instead of guessing: never invent a cutoff. Keyed by school id (content.js)
// and program id.
const x = (es, en, fr) => ({ es, en, fr });

export const ADM_UI = {
  es: { know: "Bueno saber", src2: "Expectativas de la escuela", h: "Qué necesitas para entrar", elig: "Quién puede aplicar", submit: "Qué debes entregar", marks: "Notas que piden", fee: "Costos", dates: "Fechas", src: "Página oficial de admisión", checked: "Revisado en las páginas oficiales en septiembre de 2026. Los requisitos y fechas de 2027-28 pueden cambiar: confirma siempre en la escuela.", forProgram: "En" },
  en: { know: "Good to know", src2: "School expectations", h: "What you need to get in", elig: "Who can apply", submit: "What you submit", marks: "Marks expected", fee: "Fees", dates: "Dates", src: "Official admission page", checked: "Checked against the official pages in September 2026. 2027-28 requirements and dates may change: always confirm with the school.", forProgram: "At" },
  fr: { know: "Bon à savoir", src2: "Attentes de l'école", h: "Ce qu'il faut pour être admis", elig: "Qui peut faire une demande", submit: "Ce qu'il faut soumettre", marks: "Notes exigées", fee: "Frais", dates: "Dates", src: "Page officielle d'admission", checked: "Vérifié sur les pages officielles en septembre 2026. Les exigences et dates de 2027-2028 peuvent changer : confirme toujours auprès de l'école.", forProgram: "À" },
};

const BOARD_IB_COMP = x(
  "Según el DPCDSB, entrar al IB en Grade 8 es un punto de aplicación competitivo (los otros son la entrada por IB de primaria o en Grade 10).",
  "According to DPCDSB, Grade 8 is a competitive application point for IB (the other routes are IB from elementary school or entry in Grade 10).",
  "Selon le DPCDSB, la 8e année est un point d'accès compétitif au IB (les autres voies sont le IB dès l'élémentaire ou l'entrée en 10e année)."
);
const PREIB_NOTE = x(
  "Grade 9 y 10 son años Pre-IB: cursas el currículo de Ontario, no trabajo IB formal. El Diploma IB empieza en Grade 11.",
  "Grades 9 and 10 are Pre-IB years: you follow the Ontario curriculum, not formal IB work. The IB Diploma starts in Grade 11.",
  "Les 9e et 10e années sont préparatoires : tu suis le curriculum ontarien, pas un travail IB formel. Le diplôme IB commence en 11e année."
);
const STP_STRUCT = x(
  "En St. Paul, en Grade 10 haces dos cursos de Grade 11 (matemáticas MCR3U y World Religions). Las notas IB (1–7) se convierten a porcentaje de Ontario con la tabla IBSO (5 = 84–92 %, 6 = 93–96 %, 7 = 97–100 %). Muchas universidades dan créditos por materias Higher Level con nota 5 o más.",
  "At St. Paul you take two Grade 11 credits in Grade 10 (math MCR3U and World Religions). IB grades (1–7) convert to Ontario percentages with the IBSO table (5 = 84–92%, 6 = 93–96%, 7 = 97–100%). Many universities give credit for Higher Level subjects with a 5 or more.",
  "À St. Paul, tu suis deux cours de 11e année en 10e (maths MCR3U et World Religions). Les notes IB (1 à 7) sont converties en pourcentages ontariens avec le tableau IBSO (5 = 84–92 %, 6 = 93–96 %, 7 = 97–100 %). Plusieurs universités accordent des crédits pour les matières de niveau supérieur avec 5 ou plus."
);
const PEEL_LOTTERY = x(
  "Proceso de Peel: 1) se revisan las notas finales de Grade 7 contra los criterios del programa; 2) quienes cumplen entran a un sorteo al azar que hace el board (no la escuela). Si hay más solicitantes que cupos, decide el sorteo. Quienes viven en la región de Peel van primero. Estudiantes que se identifican como afrodescendientes/negros o de las Primeras Naciones, Inuit o Métis y cumplen los criterios entran sin sorteo.",
  "Peel's process: 1) your final Grade 7 marks are checked against the program criteria; 2) everyone who meets them goes into a random draw run by the board (not the school). If there are more applicants than spots, the draw decides. Students who live in Peel Region are offered spots first. African, Black, First Nations, Inuit and Métis students who self-identify and meet the criteria are admitted without the draw.",
  "Processus de Peel : 1) les notes finales de 7e année sont comparées aux critères du programme; 2) tous ceux qui les remplissent entrent dans un tirage au sort mené par le conseil (pas par l'école). S'il y a plus de candidats que de places, le tirage décide. Les élèves de la région de Peel sont servis en premier. Les élèves africains, noirs, des Premières Nations, inuits ou métis qui s'auto-identifient et remplissent les critères sont admis sans tirage."
);

export const ADMISSIONS = [
  {
    school: "erindale", prog: "p-ib",
    elig: x("Estudiantes de Grade 8 que viven en el área de Erindale (Pre-IB). No pueden aplicar quienes están en Canadá con visa de estudiante internacional; con permiso de trabajo o de estudio sí.", "Grade 8 students who live in Erindale's program area (Pre-IB). International visa students cannot apply; students here on work or study permits can.", "Élèves de 8e année qui habitent le secteur d'Erindale (pré-IB). Les élèves internationaux avec visa ne peuvent pas postuler; ceux avec permis de travail ou d'études le peuvent."),
    submit: [
      x("Solicitud en línea en el portal RLCP de Peel. Si vienes de otro board o de una escuela privada, sube el boletín final de Grade 7 (estudiantes de Peel: se carga solo).", "Online application in Peel's RLCP portal. If you come from another board or a private school, upload your final Grade 7 report card (Peel students: it loads automatically).", "Demande en ligne dans le portail RLCP de Peel. Si tu viens d'un autre conseil ou d'une école privée, téléverse ton bulletin final de 7e année (élèves de Peel : chargé automatiquement)."),
      x("No hay evaluación presencial en Erindale.", "There is no in-person assessment at Erindale.", "Aucune évaluation en personne à Erindale."),
    ],
    marks: x(
      "Criterio oficial: tus notas finales de Grade 7 (el corte numérico no se publica). La escuela recomienda, además, un promedio de al menos 80 % en Grade 8 y al menos 80 % en inglés, ciencias y matemáticas; también pide buenos hábitos de trabajo, dominio del lenguaje y compromiso con el francés. Es una recomendación, no una regla escrita.",
      "Official criterion: your final Grade 7 marks (the numeric cutoff is not published). The school also recommends at least an 80% average in Grade 8 and at least 80% in English, Science and Math, plus solid work habits, strong language skills and commitment to French. That is a recommendation, not a written cutoff.",
      "Critère officiel : tes notes finales de 7e année (le seuil chiffré n'est pas publié). L'école recommande aussi une moyenne d'au moins 80 % en 8e année et au moins 80 % en anglais, sciences et maths, de bonnes habitudes de travail, une bonne maîtrise de la langue et un engagement envers le français. C'est une recommandation, pas un seuil écrit."
    ),
    fee: x("Aplicación: $40 (no reembolsable). Programa de Grade 9: $250. Después: Grade 10 $257.50; Diploma IB (Grades 11 y 12) $2,780 en 4 pagos de $695. Debes traer laptop y comprar una calculadora gráfica TI-nSpire CX II.", "Application: $40 (non-refundable). Grade 9 program: $250. Later: Grade 10 $257.50; IB Diploma (Grades 11 and 12) $2,780 in 4 payments of $695. You must bring a laptop and buy a TI-nSpire CX II graphing calculator.", "Demande : 40 $ (non remboursable). Programme de 9e année : 250 $. Ensuite : 10e année 257,50 $; diplôme IB (11e et 12e) 2 780 $ en 4 versements de 695 $. Ordinateur portable requis et calculatrice graphique TI-nSpire CX II à acheter."),
    dates: x("Noche informativa presencial: 21 de octubre de 2026, 6:30–7:30 p. m. Aplicaciones: 3 de noviembre (8:30 a. m.) al 24 de noviembre de 2026 (11:59 p. m.). Ofertas: ronda 1 el 2 de febrero de 2027 (responder hasta el 5 feb), ronda 2 el 16 de febrero (hasta el 19 feb). Lista de espera del 18 de febrero al 9 de septiembre de 2027. Entrada en Grade 11: Grade 10 math, MCR3U y francés académico de Grade 10.", "In-person information night: Oct 21, 2026, 6:30–7:30 p.m. Applications: Nov 3 (8:30 a.m.) to Nov 24, 2026 (11:59 p.m.). Offers: round 1 on Feb 2, 2027 (reply by Feb 5), round 2 on Feb 16 (reply by Feb 19). Waitlist Feb 18 to Sep 9, 2027. Grade 11 entry: Grade 10 math, MCR3U and Grade 10 Academic French.", "Soirée d'information en personne : 21 octobre 2026, 18 h 30–19 h 30. Demandes : du 3 novembre (8 h 30) au 24 novembre 2026 (23 h 59). Offres : ronde 1 le 2 février 2027 (réponse avant le 5 févr.), ronde 2 le 16 février (avant le 19 févr.). Liste d'attente du 18 février au 9 septembre 2027. Entrée en 11e année : maths de 10e, MCR3U et français théorique de 10e."),
    know: [PEEL_LOTTERY, PREIB_NOTE],
    url: "https://erindale.peelschools.org/application-process-and-timelines-for-gr-9-september-2026-admission",
    url2: "https://erindale.peelschools.org/expectations-pathway-to-success",
  },
  {
    school: "glenforest", prog: "p-ib",
    elig: x("Estudiantes de Grade 8 del área de Glenforest (MYP, que lleva al Diploma IB). Estudiantes de Peel DSB deben vivir en su área; de otros boards y escuelas privadas también pueden aplicar. Se pide comprobante de domicilio.", "Grade 8 students from Glenforest's catchment area (MYP, which leads to the IB Diploma). Peel DSB students must live in the catchment; students from other boards and private schools may also apply. Proof of address is required.", "Élèves de 8e année du secteur de Glenforest (PEI, qui mène au diplôme IB). Les élèves du Peel DSB doivent habiter le secteur; ceux d'autres conseils ou d'écoles privées peuvent aussi postuler. Preuve de domicile exigée."),
    submit: [
      x("Solicitud en línea en el portal RLCP de Peel. No se piden cartas de recomendación ni paquete en papel.", "Online application in Peel's RLCP portal. No reference letters and no paper package.", "Demande en ligne dans le portail RLCP de Peel. Ni lettres de recommandation ni dossier papier."),
      x("Boletín final de Grade 7 (se carga solo para estudiantes de Peel; los demás lo suben).", "Final Grade 7 report card (loads automatically for Peel students; others upload it).", "Bulletin final de 7e année (chargé automatiquement pour les élèves de Peel; les autres le téléversent)."),
    ],
    marks: x(
      "La escuela decide con las notas finales de Grade 7. Dice que los requisitos cambian cada año y que, en general, quienes cumplen o superan los estándares de Ontario entran al sorteo. El estándar provincial de Ontario es el Nivel 3 (70–79 %). El corte exacto no se publica.",
      "The school decides from your final Grade 7 marks. It says the requirements vary year to year and that, in general, students who meet or exceed Ontario standards enter the draw. The Ontario provincial standard is Level 3 (70–79%). The exact cutoff is not published.",
      "L'école décide d'après les notes finales de 7e année. Elle indique que les exigences varient d'une année à l'autre et qu'en général les élèves qui atteignent ou dépassent les normes ontariennes entrent dans le tirage. La norme provinciale est le niveau 3 (70–79 %). Le seuil exact n'est pas publié."
    ),
    fee: x("Aplicación: $40 (no reembolsable). Programa de Grade 9 y de Grade 10 (MYP): $309 cada uno. Diploma IB (Grades 11 y 12): $2,785 en 4 pagos de $696.25 (montos de la última ronda publicada).", "Application: $40 (non-refundable). Grade 9 and Grade 10 (MYP) fee: $309 each. IB Diploma (Grades 11 and 12): $2,785 in 4 payments of $696.25 (amounts from the last published round).", "Demande : 40 $ (non remboursable). Frais de 9e et 10e année (PEI) : 309 $ chacune. Diplôme IB (11e et 12e) : 2 785 $ en 4 versements de 696,25 $ (montants de la dernière ronde publiée)."),
    dates: x("Aplicaciones de 2027-28: 3 al 24 de noviembre de 2026 (mismo calendario del board). No es por orden de llegada.", "2027-28 applications: Nov 3 to Nov 24, 2026 (board-wide calendar). It is not first come, first served.", "Demandes 2027-2028 : du 3 au 24 novembre 2026 (calendrier du conseil). Ce n'est pas premier arrivé, premier servi."),
    know: [PEEL_LOTTERY, PREIB_NOTE],
    url: "https://glenforest.peelschools.org/ib-admissions-faqs",
  },
  {
    school: "johnfraser", prog: "p-ap",
    elig: x("Estudiantes de Grade 8 que viven al sur de la Hwy 401 en la región de Peel.", "Grade 8 students who live south of Hwy 401 in Peel Region.", "Élèves de 8e année qui habitent au sud de la 401 dans la région de Peel."),
    submit: [
      x("Solicitud en línea en el portal RLCP de Peel (boletín de Grade 7; los de otros boards lo suben).", "Online application in Peel's RLCP portal (Grade 7 report card; other boards upload it).", "Demande en ligne dans le portail RLCP de Peel (bulletin de 7e année; les autres conseils le téléversent)."),
      x("Evaluación presencial de matemáticas y lectoescritura el 5 de diciembre de 2026.", "In-person numeracy and literacy assessment on Dec 5, 2026.", "Évaluation en personne en numératie et en littératie le 5 décembre 2026."),
    ],
    marks: x("El corte numérico de notas no se publica. Se evalúan tus notas de Grade 7 y la evaluación presencial; el AP es un programa de cupo limitado.", "The numeric marks cutoff is not published. Your Grade 7 marks and the in-person assessment are reviewed; AP has limited spots.", "Le seuil chiffré n'est pas publié. Tes notes de 7e année et l'évaluation en personne sont examinées; le AP a un nombre de places limité."),
    fee: x("Aplicación: $40. Cuota anual del AP regional de Peel: $250 (dato publicado por Central Peel, la otra sede).", "Application: $40. Annual Peel regional AP fee: $250 (published by Central Peel, the other host).", "Demande : 40 $. Frais annuels du AP régional de Peel : 250 $ (publié par Central Peel, l'autre école hôte)."),
    dates: x("Aplicaciones: 3 al 24 de noviembre de 2026. Noche informativa: 22 de octubre de 2026 (virtual, hora por confirmar).", "Applications: Nov 3 to Nov 24, 2026. Information night: Oct 22, 2026 (virtual, time to be confirmed).", "Demandes : du 3 au 24 novembre 2026. Soirée d'information : 22 octobre 2026 (virtuelle, heure à confirmer)."),
    know: [PEEL_LOTTERY],
    url: "https://johnfraser.peelschools.org/advanced-placement",
  },
  {
    school: "joseph", prog: "ap",
    elig: x("Estudiantes de Grade 8 que viven en Mississauga, del DPCDSB, del Peel DSB o de escuelas privadas.", "Grade 8 students who live in Mississauga, from DPCDSB, Peel DSB or private schools.", "Élèves de 8e année qui habitent Mississauga, du DPCDSB, du Peel DSB ou d'écoles privées."),
    submit: [
      x("Foto o escaneo del boletín final de Grade 7 y el boletín más reciente de Grade 8.", "Pictures or scans of your final Grade 7 report card and your most recent Grade 8 report card.", "Photos ou numérisations du bulletin final de 7e année et du plus récent de 8e année."),
      x("Una muestra de escritura a partir de un tema que da la escuela.", "A writing sample based on a prompt the school gives.", "Un échantillon d'écriture à partir d'un sujet donné par l'école."),
      x("Usar una cuenta de Gmail como único medio de contacto durante la aplicación.", "Use a Gmail account as your only form of contact during the application.", "Utiliser un compte Gmail comme seul moyen de contact pendant la demande."),
    ],
    marks: x(
      "No hay una nota mínima publicada. Es un programa de cupo limitado para estudiantes de alto rendimiento y automotivados, que trabajan bien solos y en equipo.",
      "No minimum mark is published. It is a limited-enrolment program for high-achieving, self-motivated students who work well alone and with others.",
      "Aucune note minimale n'est publiée. C'est un programme à effectif limité pour des élèves très performants et motivés, qui travaillent bien seuls et en équipe."
    ),
    fee: x("Tarifa de aplicación: $25.", "Application fee: $25.", "Frais de demande : 25 $."),
    dates: x("Paquete de aplicación: 4 de diciembre de 2026. Ofertas desde el 14 de diciembre. Confirmar que quieres AP: 8 de enero de 2027. Paquete de registro: 18 de enero de 2027. También se puede aplicar a Grade 10 con cupo muy limitado.", "Application package due Dec 4, 2026. Offers start Dec 14. AP intention due Jan 8, 2027. Registration package due Jan 18, 2027. Grade 10 entry is possible but space is very limited.", "Dossier de demande : 4 décembre 2026. Offres dès le 14 décembre. Intention AP : 8 janvier 2027. Dossier d'inscription : 18 janvier 2027. Entrée en 10e année possible, mais places très limitées."),
    url: "https://joess.dpcdsb.org/programs/guidance-courses/advanced-placement-program",
  },
  {
    school: "paul", prog: "ib",
    elig: x("Estudiantes de Grade 8 (entrada a Grade 9 IB Prep) que viven dentro del límite del programa en Mississauga: al sur de la Hwy 403, al este de la Hwy 410 y al sur de la Hwy 401. Pueden venir de escuelas católicas, públicas o privadas.", "Grade 8 students (entry to Grade 9 IB Prep) who live inside the program boundary in Mississauga: south of Hwy 403, east of Hwy 410 and south of Hwy 401. Catholic, public and private school students can apply.", "Élèves de 8e année (entrée en 9e IB préparatoire) qui habitent dans le secteur du programme à Mississauga : au sud de la 403, à l'est de la 410 et au sud de la 401. Écoles catholiques, publiques ou privées."),
    submit: [
      x("Formulario de aplicación en línea con los documentos que pide la escuela.", "The online application form with the documents the school asks for.", "Le formulaire de demande en ligne avec les documents demandés par l'école."),
      x("Pago de la tarifa de aplicación por SchoolCash Online.", "Payment of the application fee through SchoolCash Online.", "Paiement des frais de demande par SchoolCash Online."),
    ],
    marks: x("La escuela no publica una nota mínima ni cursos previos. No es \"entra cualquiera\": el board describe el acceso a IB en Grade 8 como un punto de aplicación competitivo, con cupos limitados.", "The school publishes no minimum mark or prerequisite courses. That does not mean anyone gets in: the board describes Grade 8 IB entry as a competitive application point with limited spaces.", "L'école ne publie ni note minimale ni cours préalables. Cela ne veut pas dire que tout le monde est admis : le conseil décrit l'entrée en IB en 8e année comme un point d'accès compétitif, à places limitées."),
    fee: x("Aplicación: $40. Si te aceptan: tarifa del programa IB $250 y tarifa de actividades de la escuela $45.", "Application: $40. If accepted: IB program fee $250 and school activity fee $45.", "Demande : 40 $. Si tu es admis : frais du programme IB 250 $ et frais d'activités de l'école 45 $."),
    dates: x("Noche informativa: 11 de noviembre de 2026. Aplicaciones: 16 de noviembre al 16 de diciembre de 2026. Las ofertas se envían por correo desde principios de diciembre (la propia página tiene fechas que se contradicen; confírmalas con la escuela).", "Information night: Nov 11, 2026. Applications: Nov 16 to Dec 16, 2026. Offers go out by email from early December (the school's own page has dates that contradict each other; confirm them with the school).", "Soirée d'information : 11 novembre 2026. Demandes : du 16 novembre au 16 décembre 2026. Les offres sont envoyées par courriel dès début décembre (la page de l'école contient des dates contradictoires; confirme-les avec l'école)."),
    know: [BOARD_IB_COMP, PREIB_NOTE, STP_STRUCT],
    url: "https://pauls.dpcdsb.org/programs/i-b-program",
  },
  {
    school: "sfx", prog: "ib",
    elig: x("Estudiantes de Grade 8 que viven en Mississauga dentro del rectángulo formado por las autopistas: al norte y al oeste de la Hwy 403 y la Hwy 410, hasta la Hwy 407 al norte. Escuelas católicas, públicas o privadas.", "Grade 8 students who live in Mississauga inside the rectangle formed by the highways: north and west of Hwy 403 and Hwy 410, up to Hwy 407 in the north. Catholic, public and private schools.", "Élèves de 8e année qui habitent Mississauga dans le rectangle formé par les autoroutes : au nord et à l'ouest des 403 et 410, jusqu'à la 407 au nord. Écoles catholiques, publiques ou privées."),
    submit: [
      x("Portafolio de aplicación IB de la escuela, completado en una sola sesión y subido a un formulario de Google.", "The school's IB application portfolio, completed in one session and uploaded to a Google form.", "Le portfolio de demande IB de l'école, rempli en une seule séance et téléversé dans un formulaire Google."),
      x("Comprobante del pago de la tarifa de aplicación.", "Proof that the application fee was paid.", "Preuve du paiement des frais de demande."),
    ],
    marks: x("La página oficial no publica notas mínimas; la decisión se basa en el portafolio de aplicación.", "The official page publishes no minimum marks; the decision is based on the application portfolio.", "La page officielle ne publie pas de notes minimales; la décision repose sur le portfolio de demande."),
    fee: x("Aplicación: $40. Tarifa adicional del programa Pre-IB de Grade 9: $250.", "Application: $40. Additional Grade 9 Pre-IB program fee: $250.", "Demande : 40 $. Frais supplémentaires du programme pré-IB de 9e année : 250 $."),
    dates: x("Portafolio: del 5 de noviembre al 4 de diciembre de 2026. Ofertas por correo: viernes 18 de diciembre de 2026, 3 p. m. Responder a la oferta: 8 de enero de 2027. Paquete de registro: 28 y 29 de enero y 1 de febrero de 2027.", "Portfolio window: Nov 5 to Dec 4, 2026. Offers by email: Friday Dec 18, 2026 at 3 p.m. Reply to the offer by Jan 8, 2027. Registration package: Jan 28, 29 and Feb 1, 2027.", "Portfolio : du 5 novembre au 4 décembre 2026. Offres par courriel : vendredi 18 décembre 2026 à 15 h. Réponse à l'offre : 8 janvier 2027. Dossier d'inscription : 28, 29 janvier et 1er février 2027."),
    know: [BOARD_IB_COMP, PREIB_NOTE],
    url: "https://stfxs.dpcdsb.org/programs/i-b-program",
  },
  {
    school: "iona", prog: "arts",
    elig: x("Estudiantes que entran a Grade 9 y quieren estudiar artes: artes visuales, drama, danza o música.", "Students entering Grade 9 who want to study the arts: visual arts, drama, dance or music.", "Élèves qui entrent en 9e année et veulent étudier les arts : arts visuels, art dramatique, danse ou musique."),
    submit: [
      x("Artes visuales: un dibujo de observación (naturaleza muerta) con tiempo limitado.", "Visual arts: a drawing from direct observation (still life) in a set amount of time.", "Arts visuels : un dessin d'observation (nature morte) en temps limité."),
      x("Drama: un monólogo (clásico, contemporáneo o escrito por ti).", "Drama: one monologue (classic, contemporary or self-written).", "Art dramatique : un monologue (classique, contemporain ou de ta création)."),
      x("Danza: un solo de un minuto en el estilo que elijas.", "Dance: a one-minute solo in the style of your choice.", "Danse : un solo d'une minute dans le style de ton choix."),
      x("Música: no necesitas experiencia en banda; puedes mostrar piano, guitarra, bajo o percusión si tienes.", "Music: no concert-band experience needed; you may show piano, guitar, bass or percussion if you play.", "Musique : aucune expérience en harmonie requise; tu peux présenter piano, guitare, basse ou percussions si tu en joues."),
    ],
    marks: x("La página oficial no publica notas mínimas; lo que pesa es la audición o el portafolio.", "The official page publishes no minimum marks; the audition or portfolio is what counts.", "La page officielle ne publie pas de notes minimales; l'audition ou le portfolio compte."),
    fee: x("Tarifa de audición: $25 (se paga en línea y se aplica como depósito si te aceptan).", "Audition fee: $25 (paid online, applied as a deposit if accepted).", "Frais d'audition : 25 $ (payés en ligne, appliqués comme dépôt si tu es admis)."),
    dates: x("En la ronda anterior las solicitudes abrieron a fines de octubre y cerraron a inicios de diciembre; las fechas de 2027-28 aún deben confirmarse.", "In the previous round applications opened in late October and closed in early December; 2027-28 dates still need to be confirmed.", "Lors de la ronde précédente, les demandes ont ouvert fin octobre et fermé début décembre; les dates de 2027-2028 restent à confirmer."),
    url: "https://ionas.dpcdsb.org/our-school/departments/regional-arts-program",
  },
  {
    school: "martin", prog: "sports",
    elig: x("Abierto a todo estudiante que entra a Grade 9. No necesitas ser atleta de élite.", "Open to all students entering Grade 9. You do not need to be an elite athlete.", "Ouvert à tous les élèves qui entrent en 9e année. Pas besoin d'être athlète d'élite."),
    submit: [x("Registro en el programa (la escuela indica el proceso; el board dice que se hace en noviembre o diciembre).", "Program registration (the school explains the process; the board says it takes place in November or December).", "Inscription au programme (l'école explique le processus; le conseil indique novembre ou décembre).")],
    marks: x("No se piden pruebas ni notas mínimas publicadas. Debes tomar un crédito de educación física cada año.", "No tryout and no published minimum marks. You take a physical education credit every year.", "Aucune sélection ni note minimale publiée. Tu suis un crédit d'éducation physique chaque année."),
    fee: x("Tarifa anual del programa: $200 (incluye excursiones, certificaciones, invitados, transporte y ropa). No hay tarifa de aplicación.", "Annual program fee: $200 (covers field trips, certifications, guest speakers, transportation and apparel). No application fee.", "Frais annuels du programme : 200 $ (sorties, certifications, conférenciers, transport et vêtements). Pas de frais de demande."),
    dates: x("Registro en noviembre o diciembre (fechas por confirmar).", "Registration in November or December (dates to be confirmed).", "Inscription en novembre ou décembre (dates à confirmer)."),
    url: "https://martn.dpcdsb.org/our-school/about-us/regional-sports-program",
  },
  {
    school: "joan", prog: "steam",
    elig: x("Abierto a estudiantes que entran a Grade 9 en la región de Peel y el condado de Dufferin.", "Open to students entering Grade 9 in Peel Region and Dufferin County.", "Ouvert aux élèves qui entrent en 9e année dans la région de Peel et le comté de Dufferin."),
    submit: [x("Registro en la escuela sede; el proceso se explica en la charla informativa.", "Registration at the host school; the process is explained at the information session.", "Inscription à l'école hôte; le processus est expliqué à la séance d'information.")],
    marks: x("La página oficial no pide notas mínimas ni otros requisitos académicos.", "The official page states no minimum marks or other academic requirements.", "La page officielle n'exige ni notes minimales ni autres exigences scolaires."),
    fee: x("No se publican tarifas en la página del board.", "No fees are published on the board's page.", "Aucun frais n'est publié sur la page du conseil."),
    dates: x("El registro en St. Joan of Arc abre en octubre (fecha por confirmar).", "Registration at St. Joan of Arc opens in October (date to be confirmed).", "L'inscription à St. Joan of Arc ouvre en octobre (date à confirmer)."),
    url: "https://www.dpcdsb.org/programs-services/secondary/regional-stem-program",
  },
];

/** Admission entries for a program (all hosts) or for one school (all its programs). */
export const admissionsForProgram = (progId) => ADMISSIONS.filter((a) => a.prog === progId);
export const admissionsForSchool = (schoolId) => ADMISSIONS.filter((a) => a.school === schoolId);
