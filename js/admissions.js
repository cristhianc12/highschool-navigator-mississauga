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

// General registration (every school of the board, not only regional programs). Sources: DPCDSB
// "Secondary Registration" page and Peel's "Register for School" page, checked September 2026.
export const REG_UI = {
  es: { h: "Cómo registrarte en la escuela", steps: "Pasos", docs: "Documentos (originales, en inglés)", dates: "Fechas clave", limited: "Esta escuela tiene registro limitado para 2027-28: confirma cupo con la escuela y el board.", contact: "Contacto de admisiones", src: "Página oficial de registro", note: "Los programas regionales (IB, AP, Artes, Deportes, STEM, Bakery) tienen su propia aplicación: mira las secciones de arriba." },
  en: { h: "How to register at this school", steps: "Steps", docs: "Documents (originals, in English)", dates: "Key dates", limited: "This school has limited registration for 2027-28: confirm space with the school and the board.", contact: "Admissions contact", src: "Official registration page", note: "Regional programs (IB, AP, Arts, Sports, STEM, Bakery) have their own application: see the sections above." },
  fr: { h: "Comment s'inscrire à cette école", steps: "Étapes", docs: "Documents (originaux, en anglais)", dates: "Dates clés", limited: "Cette école a des inscriptions limitées pour 2027-2028 : confirme les places avec l'école et le conseil.", contact: "Contact des admissions", src: "Page officielle d'inscription", note: "Les programmes régionaux (IB, AP, arts, sports, STIM, boulangerie) ont leur propre demande : voir les sections ci-dessus." },
};

export const REGISTRATION = {
  dpcdsb: {
    steps: [
      x("Crea una cuenta en el sistema de aplicación en línea del DPCDSB.", "Create an account in DPCDSB's online application system.", "Crée un compte dans le système de demande en ligne du DPCDSB."),
      x("Completa y envía el formulario de aplicación en línea.", "Complete and submit the online application form.", "Remplis et soumets le formulaire de demande en ligne."),
      x("Recibirás un correo de confirmación con instrucciones sobre los documentos que falten.", "You receive a confirmation email with instructions for any missing documents.", "Tu reçois un courriel de confirmation avec les instructions pour les documents manquants."),
      x("El departamento de Guidance de la escuela te contacta para verificar documentos y el horario de cursos.", "The school's Guidance department contacts you to verify documents and your course schedule.", "Le service d'orientation de l'école te contacte pour vérifier les documents et l'horaire de cours."),
    ],
    docs: [
      x("Acta de nacimiento o pasaporte (prueba de edad).", "Birth certificate or passport (proof of age).", "Certificat de naissance ou passeport (preuve d'âge)."),
      x("Registro de vacunas.", "Immunization records.", "Carnet de vaccination."),
      x("Prueba de ciudadanía canadiense o de estatus.", "Proof of Canadian citizenship.", "Preuve de citoyenneté canadienne."),
      x("Dos comprobantes de domicilio (factura de servicios, impuesto a la propiedad, contrato de arriendo, etc.).", "Two proofs of home address (utility bill, property tax statement, lease agreement, etc.).", "Deux preuves de domicile (facture de services, taxe foncière, bail, etc.)."),
      x("Prueba de apoyo a la escuela separada en inglés, si aplica.", "Proof of English Separate School Support, if applicable.", "Preuve de soutien aux écoles séparées anglaises, le cas échéant."),
    ],
    note: x(
      "Si estás en una primaria del DPCDSB, quedas inscrito automáticamente en la secundaria católica de tu zona para Grade 9. Por la ley provincial de acceso abierto, familias católicas y de escuelas públicas pueden aplicar a escuelas católicas. Estudiantes con necesidades de apoyo: completa además el Entry Planning Form for Students with Differing Abilities.",
      "If you attend a DPCDSB elementary school, you are automatically enrolled in your local Catholic secondary school for Grade 9. Under Ontario's open-access law, both Catholic and public school supporters can apply to Catholic schools. Students who need extra support should also complete the Entry Planning Form for Students with Differing Abilities.",
      "Si tu fréquentes une école élémentaire du DPCDSB, tu es inscrit automatiquement à l'école secondaire catholique de ton secteur pour la 9e année. En vertu de la loi provinciale d'accès ouvert, les familles catholiques et celles des écoles publiques peuvent postuler. Les élèves qui ont besoin de soutien remplissent aussi le formulaire Entry Planning Form for Students with Differing Abilities."
    ),
    contact: "905-890-1221 · admissions@dpcdsb.org",
    url: "https://www.dpcdsb.org/admissions/secondary-school-registration",
    // Schools listed by DPCDSB with limited registration availability for 2027-28.
    limited: ["cardinal ambrozic", "st edmund campion", "st marcellinus", "st roch"],
  },
  peel: {
    steps: [
      x("Crea una cuenta de padres en PowerSchool Enrollment (portal en línea del board) para el registro de Grade 1 a 12.", "Create a parent account in PowerSchool Enrollment (the board's online portal) for Grade 1 to 12 registration.", "Crée un compte parent dans PowerSchool Enrollment (le portail en ligne du conseil) pour l'inscription de la 1re à la 12e année."),
      x("Usa el localizador de escuelas (School Finder) con tu dirección para saber qué escuela te corresponde.", "Use the School Finder with your home address to see which school is yours.", "Utilise le localisateur d'écoles avec ton adresse pour savoir quelle école est la tienne."),
      x("Sigue la guía \"How to Apply\" del board para completar la solicitud y subir los documentos.", "Follow the board's \"How to Apply\" tip sheet to complete the application and upload documents.", "Suis la fiche « How to Apply » du conseil pour remplir la demande et téléverser les documents."),
    ],
    docs: [],
    note: x(
      "La lista exacta de documentos está en la guía \"How to Apply\" del board; no la copiamos aquí para no darte una lista desactualizada.",
      "The exact document list is in the board's \"How to Apply\" tip sheet; we do not copy it here so you do not get an outdated list.",
      "La liste exacte des documents figure dans la fiche « How to Apply » du conseil; nous ne la copions pas ici pour éviter une liste périmée."
    ),
    contact: "",
    url: "https://www.peelschools.org/registration",
  },
};

export const ADMISSIONS = [
  {
    school: "cawthra", prog: "p-arts",
    elig: x("Estudiantes de Grade 8 (y de Grade 9 actual, en la segunda entrada) que viven al sur de la Hwy 401. Quienes viven al norte de la 401 aplican a Mayfield. Estudiantes de otro board o fuera del área pueden aplicar, pero solo reciben oferta en la ronda 2 si hay cupo.", "Grade 8 students (and current Grade 9 students, at the second entry point) who live south of Hwy 401. Students north of the 401 apply to Mayfield. Students from another board or outside the area may apply, but only get an offer in round 2 if space allows.", "Élèves de 8e année (et de 9e actuelle, au deuxième point d'entrée) qui habitent au sud de la 401. Ceux du nord de la 401 postulent à Mayfield. Les élèves d'un autre conseil ou hors secteur peuvent postuler, mais n'obtiennent une offre qu'à la ronde 2 s'il reste de la place."),
    submit: [
      x("Solicitud en línea en el portal RLCP de Peel (no hay solicitud en papel).", "Online application in Peel's RLCP portal (no paper application).", "Demande en ligne dans le portail RLCP de Peel (pas de demande papier)."),
      x("Elegir una sola disciplina: danza, drama, música (instrumental o vocal) o artes visuales. No se puede audicionar para más de una.", "Choose one discipline only: dance, drama, music (instrumental or vocal) or visual arts. You cannot audition for more than one.", "Choisir une seule discipline : danse, art dramatique, musique (instrumentale ou vocale) ou arts visuels. On ne peut pas auditionner pour plus d'une."),
      x("Preparar el material de audición o portafolio de la disciplina (los requisitos se publican en el sitio de la escuela).", "Prepare the audition material or portfolio for that discipline (requirements are posted on the school's site).", "Préparer le matériel d'audition ou le portfolio de la discipline (les exigences sont publiées sur le site de l'école)."),
      x("Si tienes un IEP, envía una copia a cawthrarap@peelsb.com después de aplicar; el IEP no reduce tus posibilidades.", "If you have an IEP, email a copy to cawthrarap@peelsb.com after applying; an IEP does not lower your chances.", "Si tu as un PEI (IEP), envoie-en une copie à cawthrarap@peelsb.com après ta demande; il ne diminue pas tes chances."),
    ],
    marks: x("Se entra por audición o portafolio. Ni el board ni la escuela publican una nota mínima para Artes.", "Entry is by audition or portfolio. Neither the board nor the school publishes a minimum mark for Arts.", "L'entrée se fait par audition ou portfolio. Ni le conseil ni l'école ne publient de note minimale pour les arts."),
    fee: x("Audición: $40 (se paga en línea al aplicar). Programa Regional de Artes: $250 (se paga tras aceptar la oferta) y $250 cada año siguiente.", "Audition fee: $40 (paid online when you apply). Regional Arts program: $250 (paid after you accept an offer) and $250 each following year.", "Audition : 40 $ (payée en ligne à la demande). Programme régional d'arts : 250 $ (payé après l'acceptation de l'offre) et 250 $ chaque année suivante."),
    dates: x("Noche informativa: 27 de octubre de 2026 (presentaciones a las 6 y 7 p. m.). Aplicaciones: 3 al 24 de noviembre de 2026. Las citas de audición se envían por correo antes de las vacaciones de diciembre; las audiciones son en enero. Ofertas: 2 de febrero de 2027 después de las 3 p. m. (ronda 1), 16 de febrero (ronda 2), 23 de febrero (ronda 3), 8 de marzo (ronda 4). Lista de espera desde el 30 de marzo.", "Information night: Oct 27, 2026 (presentations at 6 and 7 p.m.). Applications: Nov 3 to 24, 2026. Audition appointments are emailed before the December break; auditions take place in January. Offers: Feb 2, 2027 after 3 p.m. (round 1), Feb 16 (round 2), Feb 23 (round 3), Mar 8 (round 4). Waitlist from Mar 30.", "Soirée d'information : 27 octobre 2026 (présentations à 18 h et 19 h). Demandes : du 3 au 24 novembre 2026. Les rendez-vous d'audition sont envoyés avant le congé de décembre; les auditions ont lieu en janvier. Offres : 2 février 2027 après 15 h (ronde 1), 16 février (ronde 2), 23 février (ronde 3), 8 mars (ronde 4). Liste d'attente dès le 30 mars."),
    know: [
      x("Sigues el currículo académico normal de Ontario; la diferencia es que tomas tu área principal en los dos semestres y terminas con un paquete de 8 créditos de artes y un certificado del programa.", "You follow the regular Ontario academic curriculum; the difference is that you take your major in both semesters and finish with an 8-credit arts package and a program certificate.", "Tu suis le curriculum ontarien habituel; la différence est que tu suis ta majeure aux deux semestres et termines avec un bloc de 8 crédits en arts et un certificat du programme."),
    ],
    url: "https://cawthrapark.peelschools.org/how-to-apply",
    url2: "https://cawthrapark.peelschools.org/arts-faq",
  },
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
    know: [
      x("Al entrar a Grade 9 eliges qué materias llevarás como Pre-AP: mínimo 1 y máximo 4. No es un paquete cerrado. Camino de cada materia según el mapa \"Advanced Placement Pathways\" de St. Joseph:", "When you enter Grade 9 you choose which subjects to take as Pre-AP: minimum 1, maximum 4. It is not a fixed package. Path for each subject, from St. Joseph's \"Advanced Placement Pathways\" chart:", "En entrant en 9e année, tu choisis les matières suivies en Pre-AP : minimum 1, maximum 4. Ce n'est pas un bloc fixe. Parcours de chaque matière selon le schéma « Advanced Placement Pathways » de St. Joseph :"),
      x("Ciencias: SNC1DP (Gr. 9) → SNC2DP (Gr. 10) → Gr. 11 Pre-AP Biology SBI3UP, Chemistry SCH3UP o Physics SPH3UP → Gr. 12 AP Biology SBI4UP, AP Chemistry SCH4UP o AP Physics SPH4UP.", "Science: SNC1DP (Gr. 9) → SNC2DP (Gr. 10) → Gr. 11 Pre-AP Biology SBI3UP, Chemistry SCH3UP or Physics SPH3UP → Gr. 12 AP Biology SBI4UP, AP Chemistry SCH4UP or AP Physics SPH4UP.", "Sciences : SNC1DP (9e) → SNC2DP (10e) → 11e Pre-AP Biology SBI3UP, Chemistry SCH3UP ou Physics SPH3UP → 12e AP Biology SBI4UP, AP Chemistry SCH4UP ou AP Physics SPH4UP."),
      x("Matemáticas: MPM1DP (Gr. 9) → MPM2DP (Gr. 10) → Pre-AP Functions I MCR3UP (Gr. 11) → Functions II MHF4UP → AP Calculus and Vectors MCV4UP (Gr. 12).", "Math: MPM1DP (Gr. 9) → MPM2DP (Gr. 10) → Pre-AP Functions I MCR3UP (Gr. 11) → Functions II MHF4UP → AP Calculus and Vectors MCV4UP (Gr. 12).", "Maths : MPM1DP (9e) → MPM2DP (10e) → Pre-AP Functions I MCR3UP (11e) → Functions II MHF4UP → AP Calculus and Vectors MCV4UP (12e)."),
      x("Inglés: ENG1DP → ENG2DP → ENG3UP → AP English ENG4UP (Gr. 12).", "English: ENG1DP → ENG2DP → ENG3UP → AP English ENG4UP (Gr. 12).", "Anglais : ENG1DP → ENG2DP → ENG3UP → AP English ENG4UP (12e)."),
      x("Francés: FSF1DP → FSF2DP → FSF3UP → AP French FSF4UP (Gr. 12).", "French: FSF1DP → FSF2DP → FSF3UP → AP French FSF4UP (Gr. 12).", "Français : FSF1DP → FSF2DP → FSF3UP → AP French FSF4UP (12e)."),
      x("Ciencias sociales: Pre-AP Geography CGC1DP (Gr. 9) → Pre-AP Canadian History CHC2DP (Gr. 10) → al menos un curso de estudios sociales de nivel senior (Gr. 11) → AP Economics CIA4UP o AP World History CHY4UP (Gr. 12).", "Social sciences: Pre-AP Geography CGC1DP (Gr. 9) → Pre-AP Canadian History CHC2DP (Gr. 10) → at least one senior-level social studies course (Gr. 11) → AP Economics CIA4UP or AP World History CHY4UP (Gr. 12).", "Sciences sociales : Pre-AP Geography CGC1DP (9e) → Pre-AP Canadian History CHC2DP (10e) → au moins un cours d'études sociales de niveau supérieur (11e) → AP Economics CIA4UP ou AP World History CHY4UP (12e)."),
    ],
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
    fee: x("Audición: $25 (se paga en línea al aplicar y cuenta como depósito si te aceptan). Cuota del programa: $130 (el saldo se paga en línea tras aceptar la oferta). No hay transporte escolar del board para quien vive fuera del área de la escuela.", "Audition fee: $25 (paid online when you apply, counted as a deposit if accepted). Program fee: $130 (the balance is paid online after you accept an offer). The board does not bus Arts students who live outside the school's catchment area.", "Audition : 25 $ (payés en ligne à la demande, comptés comme dépôt si tu es admis). Frais du programme : 130 $ (le solde est payé en ligne après l'acceptation de l'offre). Le conseil n'offre pas de transport aux élèves des arts qui habitent hors du secteur de l'école."),
    dates: x("Noche informativa: 4 de noviembre de 2026, 5:30 p. m. Aplicaciones: 2 de noviembre (2 p. m.) al 9 de diciembre de 2026 (11:59 p. m.). Ofertas ronda 1: 10 de febrero de 2027 después de las 2 p. m. (responder hasta el 16 feb, 3 p. m.). Ronda 2: 17 de febrero (hasta el 24 feb, 3 p. m.). Lista de espera: 11 de marzo al 1 de septiembre de 2027.", "Information night: Nov 4, 2026, 5:30 p.m. Applications: Nov 2 (2 p.m.) to Dec 9, 2026 (11:59 p.m.). Round 1 offers: Feb 10, 2027 after 2 p.m. (reply by Feb 16, 3 p.m.). Round 2: Feb 17 (reply by Feb 24, 3 p.m.). Waitlist: Mar 11 to Sep 1, 2027.", "Soirée d'information : 4 novembre 2026, 17 h 30. Demandes : du 2 novembre (14 h) au 9 décembre 2026 (23 h 59). Offres ronde 1 : 10 février 2027 après 14 h (réponse avant le 16 févr., 15 h). Ronde 2 : 17 février (avant le 24 févr., 15 h). Liste d'attente : du 11 mars au 1er septembre 2027."),
    url: "https://ionas.dpcdsb.org/our-school/departments/regional-arts-program",
  },
  {
    school: "martin", prog: "sports",
    elig: x("Abierto a todo estudiante que entra a Grade 9. No necesitas ser atleta de élite.", "Open to all students entering Grade 9. You do not need to be an elite athlete.", "Ouvert à tous les élèves qui entrent en 9e année. Pas besoin d'être athlète d'élite."),
    submit: [x("Formulario de aplicación del programa; la escuela explica el formulario y el proceso en el open house del 4 de noviembre de 2026. Después de la oferta, te registras en la escuela.", "The program application form; the school explains the form and process at the Nov 4, 2026 open house. After an offer, you register at the school.", "Le formulaire de demande du programme; l'école explique le formulaire et le processus aux portes ouvertes du 4 novembre 2026. Après l'offre, tu t'inscris à l'école.")],
    marks: x("No se piden pruebas ni notas mínimas publicadas. Debes tomar un crédito de educación física cada año.", "No tryout and no published minimum marks. You take a physical education credit every year.", "Aucune sélection ni note minimale publiée. Tu suis un crédit d'éducation physique chaque année."),
    fee: x("Tarifa anual del programa: $200 (incluye excursiones, certificaciones, invitados, transporte y ropa). No hay tarifa de aplicación.", "Annual program fee: $200 (covers field trips, certifications, guest speakers, transportation and apparel). No application fee.", "Frais annuels du programme : 200 $ (sorties, certifications, conférenciers, transport et vêtements). Pas de frais de demande."),
    dates: x("Open house: 4 de noviembre de 2026, 6 p. m. (ahí explican el formulario y el proceso). Fecha límite de aplicación: 10 de diciembre de 2026. Ofertas: 13 de enero de 2027 (respuesta hasta el 20 de enero) y 27 de enero (respuesta hasta el 10 de febrero). Te avisan por correo.", "Open house: Nov 4, 2026, 6 p.m. (the form and process are explained there). Application deadline: Dec 10, 2026. Offers: Jan 13, 2027 (register by Jan 20) and Jan 27 (register by Feb 10). Successful applicants are contacted by email.", "Portes ouvertes : 4 novembre 2026, 18 h (le formulaire et le processus y sont expliqués). Date limite : 10 décembre 2026. Offres : 13 janvier 2027 (inscription avant le 20 janv.) et 27 janvier (avant le 10 févr.). Les candidats retenus sont contactés par courriel."),
    url: "https://martn.dpcdsb.org/our-school/about-us/regional-sports-program",
  },
  {
    school: "goetz", prog: "bakery",
    elig: x("Estudiantes de Grade 8 o Grade 9 con ganas de aprender y mejorar en panadería, entusiastas, responsables y que trabajen bien en equipo.", "Grade 8 or Grade 9 students with a strong desire to learn and improve their baking, who are enthusiastic, dependable team players and ready to grow as leaders in the bakery industry.", "Élèves de 8e ou 9e année qui ont un vif désir d'apprendre et de s'améliorer en boulangerie, enthousiastes, fiables, bons coéquipiers et prêts à devenir des leaders du secteur."),
    submit: [
      x("Descargar y completar la solicitud de la Regional Bakery School 2027-28 (a la fecha de revisión aún no estaba publicada) y su componente escrito.", "Download and complete the Regional Bakery School application 2027-28 (not yet posted when checked) and its written component.", "Télécharger et remplir la demande de la Regional Bakery School 2027-2028 (pas encore publiée lors de la vérification) et sa composante écrite."),
      x("Imprimirla y revisarla con tu profesor (Grade 8) o tu consejero de Guidance (Grade 9) antes de entregarla.", "Print it and review it with your teacher (Grade 8) or your Guidance counsellor (Grade 9) before submitting.", "L'imprimer et la revoir avec ton enseignant (8e) ou ton conseiller en orientation (9e) avant de la remettre."),
      x("Si te aceptan, te registras en Father Michael Goetz y empiezas en septiembre de 2027.", "If accepted, you register at Father Michael Goetz and start in September 2027.", "Si tu es admis, tu t'inscris à Father Michael Goetz et commences en septembre 2027."),
    ],
    marks: x("La página oficial no publica notas mínimas. Lo que piden son la solicitud con su componente escrito y la revisión con tu profesor o consejero. Los cupos son limitados.", "The official page publishes no minimum marks. What they ask for is the application with its written component, reviewed with your teacher or counsellor. Spaces are limited.", "La page officielle ne publie pas de notes minimales. On demande la demande avec sa composante écrite, revue avec ton enseignant ou conseiller. Les places sont limitées."),
    fee: x("La página no publica tarifas. El board no ofrece transporte a este programa.", "The page publishes no fees. The board does not provide transportation to this program.", "La page ne publie pas de frais. Le conseil n'offre pas de transport pour ce programme."),
    dates: x("Fecha límite de la primera ronda: 8 de enero de 2027.", "First-round deadline: Jan 8, 2027.", "Date limite de la première ronde : 8 janvier 2027."),
    know: [x("Son 4 créditos de Hospitality and Tourism con enfoque en panadería (cuentan para Tech y STEM): un curso por semestre desde el segundo semestre de Grade 10, y en el segundo semestre de Grade 12 hay Co-op en panaderías, con posibles oportunidades OYAP.", "It is 4 credits in Hospitality and Tourism with a baking focus (they count toward Tech and STEM): one course per semester from the second semester of Grade 10, and in the second semester of Grade 12 there is Co-op in bakeries, with possible OYAP opportunities.", "Ce sont 4 crédits en accueil et tourisme axés sur la boulangerie (ils comptent pour techno et STIM) : un cours par semestre dès le second semestre de la 10e année, et au second semestre de la 12e, de la coop en boulangerie, avec des possibilités de PAJO.")],
    url: "https://goetz.dpcdsb.org/programs/regional-programs",
  },
  {
    school: "aloysius", prog: "ef",
    elig: x("Estudiantes que viven dentro del límite de Extended French de St. Aloysius Gonzaga (se comprueba en el sitio STOPR, en \"School Eligibility\", incluyendo el programa Extended French antes de la búsqueda).", "Students who live inside St. Aloysius Gonzaga's Extended French boundary (check on the STOPR site under \"School Eligibility\", adding the Extended French program before the search).", "Élèves qui habitent dans le secteur de français prolongé de St. Aloysius Gonzaga (à vérifier sur le site STOPR, sous « School Eligibility », en ajoutant le programme de français prolongé avant la recherche)."),
    submit: [
      x("Estudiantes de las primarias asociadas (Divine Mercy, Our Lady of Mercy, St. Elizabeth Seton, St. Joseph Elementary de Mississauga, St. Rose of Lima): la escuela se pone en contacto a fines de noviembre o inicios de diciembre y reparte los paquetes de registro.", "Students from the feeder elementary schools (Divine Mercy, Our Lady of Mercy, St. Elizabeth Seton, St. Joseph Elementary in Mississauga, St. Rose of Lima): the school contacts them in late November or early December and hands out registration packages.", "Élèves des écoles élémentaires associées (Divine Mercy, Our Lady of Mercy, St. Elizabeth Seton, St. Joseph Elementary de Mississauga, St. Rose of Lima) : l'école les contacte fin novembre ou début décembre et distribue les dossiers d'inscription."),
      x("Estudiantes que no vienen de esas primarias (\"open access\"): completar el registro en línea del board (es solo el primer paso) y luego retirar el paquete en la oficina de la escuela. Los paquetes se aceptan por orden de llegada, numerados (fechas por anunciar).", "Students who do not come from those schools (\"open access\"): complete the board's online registration (only the first step) and then pick up the package at the school office. Packages are accepted first come, first served, numbered as received (dates to be announced).", "Élèves d'ailleurs (« open access ») : remplir l'inscription en ligne du conseil (seulement la première étape), puis récupérer le dossier au bureau de l'école. Les dossiers sont acceptés dans l'ordre d'arrivée, numérotés (dates à annoncer)."),
      x("Estudiantes del DPCDSB fuera del límite: pedir una solicitud de límite flexible (flex boundary) a su escuela secundaria de origen. No hay transporte.", "DPCDSB students outside the boundary: request a flexible boundary letter through their home secondary school. No busing.", "Élèves du DPCDSB hors secteur : demander une lettre de secteur flexible par l'entremise de leur école secondaire de résidence. Pas de transport."),
    ],
    marks: x("No hay nota mínima publicada ni prueba de francés; se basa en el límite, la primaria de origen y el cupo. Cuántas plazas hay en Grade 9 se decide después de registrar a las primarias asociadas y a los demás estudiantes del board.", "No minimum mark and no French test is published; it depends on the boundary, feeder school and available space. The number of Grade 9 spots is set after the feeder schools and other board students are registered.", "Aucune note minimale ni test de français n'est publié; cela dépend du secteur, de l'école d'origine et des places disponibles. Le nombre de places en 9e année est fixé après l'inscription des écoles associées et des autres élèves du conseil."),
    fee: x("Cuota de registro: $45.", "Registration fee: $45.", "Frais d'inscription : 45 $."),
    dates: x("Open house de Grade 8: jueves 12 de noviembre de 2026, 6–8 p. m. Los estudiantes \"open access\" reciben una carta a su casa en algún momento de marzo. Otras fechas del ciclo 2027-28 aún figuran como por anunciar en la página de la escuela.", "Grade 8 Open House: Thursday, Nov 12, 2026, 6–8 p.m. Open-access students get a letter at home sometime in March. Other 2027-28 dates are still listed as to be announced on the school's page.", "Portes ouvertes de 8e année : jeudi 12 novembre 2026, 18 h à 20 h. Les élèves « open access » reçoivent une lettre à la maison en mars. Les autres dates 2027-2028 sont encore à annoncer sur la page de l'école."),
    know: [
      x("Extended French exige 7 créditos de francés: 4 de FSL y 3 en otras materias donde el francés es el idioma de enseñanza. En French Immersion son 10. En Grade 12 puedes presentar el examen DELF (certificado internacional de francés).", "Extended French requires 7 French credits: 4 FSL courses and 3 in other subjects taught in French. French Immersion requires 10. In Grade 12 you can take the DELF exam (an international French certificate).", "Le français prolongé exige 7 crédits de français : 4 de FLS et 3 dans d'autres matières enseignées en français. L'immersion en exige 10. En 12e année, tu peux passer l'examen DELF (certificat international de français)."),
    ],
    url: "https://gonza.dpcdsb.org/programs/regional-program",
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
