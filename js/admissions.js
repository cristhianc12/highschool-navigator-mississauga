// What a family needs to get into a school-level program (DPCDSB regional programs hosted in Mississauga).
// Only facts stated on the official school / board pages, checked in September 2026. Where a page publishes
// no minimum marks, `marks` says so instead of guessing: never invent a cutoff. Keyed by school id (content.js)
// and program id.
const x = (es, en, fr) => ({ es, en, fr });

export const ADM_UI = {
  es: { h: "Qué necesitas para entrar", elig: "Quién puede aplicar", submit: "Qué debes entregar", marks: "Notas que piden", fee: "Costos", dates: "Fechas", src: "Página oficial de admisión", checked: "Revisado en las páginas oficiales en septiembre de 2026. Los requisitos y fechas de 2027-28 pueden cambiar: confirma siempre en la escuela.", forProgram: "En" },
  en: { h: "What you need to get in", elig: "Who can apply", submit: "What you submit", marks: "Marks expected", fee: "Fees", dates: "Dates", src: "Official admission page", checked: "Checked against the official pages in September 2026. 2027-28 requirements and dates may change: always confirm with the school.", forProgram: "At" },
  fr: { h: "Ce qu'il faut pour être admis", elig: "Qui peut faire une demande", submit: "Ce qu'il faut soumettre", marks: "Notes exigées", fee: "Frais", dates: "Dates", src: "Page officielle d'admission", checked: "Vérifié sur les pages officielles en septembre 2026. Les exigences et dates de 2027-2028 peuvent changer : confirme toujours auprès de l'école.", forProgram: "À" },
};

export const ADMISSIONS = [
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
    marks: x("La página oficial no publica notas mínimas ni requisitos de cursos previos.", "The official page publishes no minimum marks or prerequisite courses.", "La page officielle ne publie ni notes minimales ni cours préalables."),
    fee: x("Aplicación: $40. Si te aceptan: tarifa del programa IB $250 y tarifa de actividades de la escuela $45.", "Application: $40. If accepted: IB program fee $250 and school activity fee $45.", "Demande : 40 $. Si tu es admis : frais du programme IB 250 $ et frais d'activités de l'école 45 $."),
    dates: x("Noche informativa: 11 de noviembre de 2026. Aplicaciones: 16 de noviembre al 16 de diciembre de 2026.", "Information night: Nov 11, 2026. Applications: Nov 16 to Dec 16, 2026.", "Soirée d'information : 11 novembre 2026. Demandes : du 16 novembre au 16 décembre 2026."),
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
    dates: x("Fechas de 2027-28 por confirmar en la página de la escuela.", "2027-28 dates to be confirmed on the school's page.", "Dates 2027-2028 à confirmer sur la page de l'école."),
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
