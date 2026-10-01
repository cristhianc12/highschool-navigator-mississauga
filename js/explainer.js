// "AP vs IB vs regular" explainer for the whole GTA. The statements are general (boards differ, and the guide says so);
// the "Where" row is built from the collected program data (see explainerHtml in app.js). No promises about university credit.
const x = (es, en, fr) => ({ es, en, fr });

export const EXPLAINER = {
  h: x("AP, IB o escuela regular: ¿en qué se diferencian?", "AP, IB or regular high school: what is the difference?", "AP, BI ou école secondaire régulière : quelle différence?"),
  p: x(
    "Son tres caminos distintos, no niveles de «mejor» o «peor». Aquí tienes lo esencial para comparar antes de las charlas.",
    "They are three different paths, not levels of “better” or “worse”. Here is what matters when comparing them before the info sessions.",
    "Ce sont trois parcours différents, pas des niveaux de « meilleur » ou de « moins bon ». Voici l'essentiel pour les comparer avant les séances d'information."
  ),
  cols: [
    { id: "ap", head: x("AP", "AP", "AP"), tag: "ap" },
    { id: "ib", head: x("IB", "IB", "BI"), tag: "ib" },
    { id: "reg", head: x("Regular", "Regular", "Régulier"), tag: null },
  ],
  rows: [
    { l: x("Qué es", "What it is", "Ce que c'est"), c: [
      x("Cursos de nivel universitario, materia por materia.", "University-level courses, one subject at a time.", "Cours de niveau universitaire, matière par matière."),
      x("Un diploma completo de dos años con seis grupos de materias y requisitos centrales.", "A complete two-year diploma with six subject groups plus core requirements.", "Un diplôme complet de deux ans avec six groupes de matières et des exigences communes."),
      x("El programa completo de la secundaria de Ontario, con opciones como SHSM, Co-op y créditos duales.", "The full Ontario high school program, with options such as SHSM, Co-op and dual credits.", "Le programme complet du secondaire en Ontario, avec des options comme les MHS, l'éducation coopérative et la double reconnaissance."),
    ] },
    { l: x("Cuánto te comprometes", "How much you commit", "Ton engagement"), c: [
      x("Lo que elijas: un AP o varios. Algunos consejos tienen una preparación AP desde Grade 9.", "As much as you choose: one AP or several. Some boards offer an AP Prep stream from Grade 9.", "Autant que tu choisis : un cours AP ou plusieurs. Certains conseils offrent une préparation AP dès la 9e année."),
      x("El paquete completo en Grade 11 y 12, normalmente tras una preparación en Grade 9 y 10 (en algunos consejos se empieza en Grade 11).", "The whole package in Grades 11–12, usually after a preparation sequence in Grades 9–10 (some boards start in Grade 11).", "L'ensemble complet en 11e et 12e année, généralement après une préparation en 9e et 10e année (certains conseils commencent en 11e)."),
      x("Flexible: armas tu horario cada año.", "Flexible: you build your timetable each year.", "Flexible : tu construis ton horaire chaque année."),
    ] },
    { l: x("Exámenes y créditos", "Exams and credit", "Examens et crédits"), c: [
      x("Los exámenes AP pueden dar créditos o ubicación avanzada en la universidad (depende de cada universidad).", "AP exams can earn university credit or advanced standing (policies vary by university).", "Les examens AP peuvent donner des crédits ou une place avancée à l'université (selon l'université)."),
      x("Los exámenes y trabajos del IB cuentan para el diploma; las universidades pueden dar créditos o ubicación avanzada (depende de cada una).", "IB exams and coursework count toward the diploma; universities may give credit or advanced standing (policies vary).", "Les examens et travaux du BI comptent pour le diplôme; les universités peuvent accorder des crédits ou une place avancée (selon l'université)."),
      x("Diploma de secundaria de Ontario (OSSD).", "Ontario Secondary School Diploma (OSSD).", "Diplôme d'études secondaires de l'Ontario (DESO)."),
    ] },
    { l: x("Dónde", "Where", "Où"), c: [null, null, x("Todas las escuelas.", "Every school.", "Toutes les écoles.")] },
    { l: x("Cómo se entra", "How you get in", "Comment y entrer"), c: [
      x("Depende del consejo: en algunos se aplica a un programa regional o especializado (a veces con revisión de boletines, evaluación o sorteo); en otros basta con elegir cursos AP en Grade 11 y 12 en tu escuela.", "It depends on the board: in some you apply to a regional or specialized program (sometimes with a report card review, an assessment or a random selection); in others you simply pick AP courses in Grades 11–12 at your school.", "Cela dépend du conseil : dans certains, on demande un programme régional ou spécialisé (parfois avec revue des bulletins, évaluation ou tirage au sort); dans d'autres, il suffit de choisir des cours AP en 11e et 12e année à son école."),
      x("Casi siempre se aplica, a la escuela de tu zona o por una solicitud central del consejo, a veces con evaluación, ensayo o sorteo si hay pocos cupos. Los pasos y fechas cambian según el consejo: mira «Cómo aplicar».", "You almost always apply, to the school that serves your area or through the board's central application, sometimes with an assessment, an essay or a random selection when spaces are limited. Steps and dates differ by board: see How to apply.", "On postule presque toujours, à l'école de ton secteur ou par la demande centrale du conseil, parfois avec évaluation, essai ou tirage au sort si les places sont limitées. Les étapes et les dates varient selon le conseil : voir « Postuler »."),
      x("Automática según tu boundary, o pides traslado.", "Automatic by your boundary, or you request a transfer.", "Automatique selon ton secteur, ou tu demandes un transfert."),
    ] },
    { l: x("Puede irte bien si…", "It might suit you if…", "Ça peut te convenir si…"), c: [
      x("Te gusta el reto en materias concretas, pero quieres flexibilidad.", "You like a challenge in specific subjects but want flexibility.", "Tu aimes le défi dans des matières précises, mais tu veux de la flexibilité."),
      x("Quieres un camino estructurado y exigente, con mezcla amplia de materias, escritura e investigación.", "You want a structured, demanding path with a broad mix of subjects, writing and research.", "Tu veux un parcours structuré et exigeant, avec un large éventail de matières, de l'écriture et de la recherche."),
      x("Prefieres variedad, otros programas (artes, oficios, Co-op) o una carga más liviana.", "You prefer variety, other programs (arts, trades, Co-op) or a lighter load.", "Tu préfères la variété, d'autres programmes (arts, métiers, coop) ou une charge plus légère."),
    ] },
    { l: x("Ten en cuenta", "Keep in mind", "À garder en tête"), c: [
      x("Los programas especializados pueden cobrar tarifas y el transporte puede ser tu responsabilidad. La carga sube en Grade 11 y 12.", "Specialized programs may charge fees, and transportation may be your family's responsibility. The workload rises in Grades 11–12.", "Les programmes spécialisés peuvent exiger des frais, et le transport peut être à ta charge. La charge augmente en 11e et 12e année."),
      x("Carga exigente: además de las materias, el diploma incluye ensayo extendido, teoría del conocimiento y servicio (CAS). Las tarifas y el transporte dependen del consejo.", "Demanding workload: besides the subjects, the diploma includes an extended essay, theory of knowledge and service (CAS). Fees and transportation depend on the board.", "Charge exigeante : en plus des matières, le diplôme comprend un mémoire, la théorie de la connaissance et le service (CAS). Les frais et le transport dépendent du conseil."),
      x("Pregunta a la escuela por sus opciones de SHSM y Co-op.", "Ask the school about its SHSM and Co-op options.", "Renseigne-toi auprès de l'école sur ses options de MHS et de coop."),
    ] },
  ],
  note: x(
    "Las universidades no tratan igual el AP y el IB: revisa las políticas de las que te interesan. Fuente: las páginas de programas de cada consejo.",
    "Universities do not treat AP and IB the same way: check the policies of the ones you are interested in. Source: each board's program pages.",
    "Les universités ne traitent pas l'AP et le BI de la même façon : consulte les politiques de celles qui t'intéressent. Source : les pages de programmes de chaque conseil."
  ),
  whereNone: x("Aún sin datos verificados.", "No verified data yet.", "Pas encore de données vérifiées."),
  whereMore: x("Ver las escuelas", "See the schools", "Voir les écoles"),
  see: x("Ver detalles", "View details", "Voir les détails"),
};
