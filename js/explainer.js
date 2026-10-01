// "AP vs IB vs regular" explainer. Facts come from DPCDSB and Peel program pages and Peel's admissions
// table; general statements avoid promises about university credit (policies vary by university).
const x = (es, en, fr) => ({ es, en, fr });

export const EXPLAINER = {
  h: x("AP, IB o escuela regular: ¿en qué se diferencian?", "AP, IB or regular high school: what is the difference?", "AP, BI ou école secondaire régulière : quelle différence?"),
  p: x(
    "Son tres caminos distintos, no niveles de «mejor» o «peor». Aquí tienes lo esencial para comparar antes de las charlas.",
    "They are three different paths, not levels of “better” or “worse”. Here is what matters when comparing them before the info sessions.",
    "Ce sont trois parcours différents, pas des niveaux de « meilleur » ou de « moins bon ». Voici l'essentiel pour les comparer avant les séances d'information."
  ),
  cols: [
    { id: "ap", head: x("AP", "AP", "AP"), program: "ap" },
    { id: "ib", head: x("IB", "IB", "BI"), program: "ib" },
    { id: "reg", head: x("Regular", "Regular", "Régulier"), program: null },
  ],
  rows: [
    { l: x("Qué es", "What it is", "Ce que c'est"), c: [
      x("Cursos de nivel universitario, materia por materia.", "University-level courses, one subject at a time.", "Cours de niveau universitaire, matière par matière."),
      x("Un diploma completo de dos años con seis grupos de materias y requisitos centrales.", "A complete two-year diploma with six subject groups plus core requirements.", "Un diplôme complet de deux ans avec six groupes de matières et des exigences communes."),
      x("El programa completo de la secundaria de Ontario, con opciones como SHSM, Co-op y créditos duales.", "The full Ontario high school program, with options such as SHSM, Co-op and dual credits.", "Le programme complet du secondaire en Ontario, avec des options comme les MHS, l'éducation coopérative et la double reconnaissance."),
    ] },
    { l: x("Cuánto te comprometes", "How much you commit", "Ton engagement"), c: [
      x("Lo que elijas: un AP o varios.", "As much as you choose: one AP or several.", "Autant que tu choisis : un cours AP ou plusieurs."),
      x("El paquete completo en Grade 11 y 12, tras una secuencia de preparación en Grade 9 y 10.", "The whole package in Grades 11–12, after a preparation sequence in Grades 9–10.", "L'ensemble complet en 11e et 12e année, après une séquence de préparation en 9e et 10e année."),
      x("Flexible: armas tu horario cada año.", "Flexible: you build your timetable each year.", "Flexible : tu construis ton horaire chaque année."),
    ] },
    { l: x("Exámenes y créditos", "Exams and credit", "Examens et crédits"), c: [
      x("Los exámenes AP pueden dar créditos o ubicación avanzada en la universidad (depende de cada universidad).", "AP exams can earn university credit or advanced standing (policies vary by university).", "Les examens AP peuvent donner des crédits ou une place avancée à l'université (selon l'université)."),
      x("Los exámenes y trabajos del IB cuentan para el diploma; las universidades pueden dar créditos o ubicación avanzada (depende de cada una).", "IB exams and coursework count toward the diploma; universities may give credit or advanced standing (policies vary).", "Les examens et travaux du BI comptent pour le diplôme; les universités peuvent accorder des crédits ou une place avancée (selon l'université)."),
      x("Diploma de secundaria de Ontario (OSSD).", "Ontario Secondary School Diploma (OSSD).", "Diplôme d'études secondaires de l'Ontario (DESO)."),
    ] },
    { l: x("Dónde (ejemplos)", "Where (examples)", "Où (exemples)"), c: [
      x("St. Joseph (DPCDSB) y John Fraser (Peel).", "St. Joseph (DPCDSB) and John Fraser (Peel).", "St. Joseph (DPCDSB) et John Fraser (Peel)."),
      x("St. Francis Xavier y St. Paul (DPCDSB); en Peel, MYP en Glenforest y Pre-IB en Erindale.", "St. Francis Xavier and St. Paul (DPCDSB); in Peel, MYP at Glenforest and Pre-IB at Erindale.", "St. Francis Xavier et St. Paul (DPCDSB); à Peel, PEI à Glenforest et pré-BI à Erindale."),
      x("Todas las escuelas.", "Every school.", "Toutes les écoles."),
    ] },
    { l: x("Cómo se entra", "How you get in", "Comment y entrer"), c: [
      x("Se aplica al programa regional. En Peel se suma una evaluación presencial de matemáticas y lectoescritura.", "You apply to the regional program. Peel adds an in-person numeracy and literacy assessment.", "On demande le programme régional. Peel ajoute une évaluation en personne en numératie et en littératie."),
      x("Se aplica al programa regional. En Peel, la entrada en Grade 9 pide evaluación presencial (menos en Erindale); la de Grade 11 pide matemáticas de Grade 10, MCR3U y francés académico de Grade 10.", "You apply to the regional program. In Peel, Grade 9 entry needs an in-person assessment (except Erindale); Grade 11 entry needs Grade 10 math, MCR3U and Grade 10 Academic French.", "On demande le programme régional. À Peel, l'entrée en 9e année exige une évaluation en personne (sauf Erindale); l'entrée en 11e année exige les mathématiques de 10e année, MCR3U et le français théorique de 10e année."),
      x("Automática según tu boundary, o pides traslado.", "Automatic by your boundary, or you request a transfer.", "Automatique selon ton secteur, ou tu demandes un transfert."),
    ] },
    { l: x("Puede irte bien si…", "It might suit you if…", "Ça peut te convenir si…"), c: [
      x("Te gusta el reto en materias concretas, pero quieres flexibilidad.", "You like a challenge in specific subjects but want flexibility.", "Tu aimes le défi dans des matières précises, mais tu veux de la flexibilité."),
      x("Quieres un camino estructurado y exigente, con mezcla amplia de materias, escritura e investigación.", "You want a structured, demanding path with a broad mix of subjects, writing and research.", "Tu veux un parcours structuré et exigeant, avec un large éventail de matières, de l'écriture et de la recherche."),
      x("Prefieres variedad, otros programas (artes, oficios, Co-op) o una carga más liviana.", "You prefer variety, other programs (arts, trades, Co-op) or a lighter load.", "Tu préfères la variété, d'autres programmes (arts, métiers, coop) ou une charge plus légère."),
    ] },
    { l: x("Ten en cuenta", "Keep in mind", "À garder en tête"), c: [
      x("Los programas regionales cobran una tarifa por aplicar y una tarifa anual. La carga sube en Grade 11 y 12.", "Regional programs charge an application fee and an annual program fee. The workload rises in Grades 11–12.", "Les programmes régionaux exigent des frais de demande et des frais annuels. La charge augmente en 11e et 12e année."),
      x("Carga exigente: además de las materias, el diploma incluye ensayo extendido, teoría del conocimiento y servicio (CAS). Se aplican las tarifas de los programas regionales.", "Demanding workload: besides the subjects, the diploma includes an extended essay, theory of knowledge and service (CAS). Regional program fees apply.", "Charge exigeante : en plus des matières, le diplôme comprend un mémoire, la théorie de la connaissance et le service (CAS). Les frais des programmes régionaux s'appliquent."),
      x("Pregunta a la escuela por sus opciones de SHSM y Co-op.", "Ask the school about its SHSM and Co-op options.", "Renseigne-toi auprès de l'école sur ses options de MHS et de coop."),
    ] },
  ],
  note: x(
    "Las universidades no tratan igual el AP y el IB: revisa las políticas de las que te interesan. Fuente: páginas de programas del DPCDSB y de Peel.",
    "Universities do not treat AP and IB the same way: check the policies of the ones you are interested in. Source: DPCDSB and Peel program pages.",
    "Les universités ne traitent pas l'AP et le BI de la même façon : consulte les politiques de celles qui t'intéressent. Source : pages des programmes du DPCDSB et de Peel."
  ),
  see: x("Ver detalles", "View details", "Voir les détails"),
};
