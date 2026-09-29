// Privacy policy text (es / en / fr-CA). Keep it in sync with what api/submit.js actually stores.
export const CONTACT_URL = "https://github.com/cristhianc12/highschool-navigator-mississauga/issues";
export const UPDATED = "2026-09-29";

export const PRIV = {
  es: {
    htmlLang: "es", title: "Política de privacidad | Highschool Navigator", back: "← Volver a la guía",
    h1: "Política de privacidad", updated: "Última actualización",
    tldr: "En corto: este sitio no te pide nombre, correo ni cuenta, no usa cookies y no guarda tu IP. Si haces el cuestionario, nada sale de tu dispositivo a menos que aceptes compartir tus respuestas de forma anónima.",
    sections: [
      { h: "Quiénes somos", p: ["Highschool Navigator Mississauga es un proyecto informativo independiente. No tiene relación con el DPCDSB, el Peel District School Board ni el Fraser Institute."] },
      { h: "La guía", p: ["Explorar la guía no requiere dar datos personales."], ul: [
        "Guardamos en tu navegador (localStorage) solo tus preferencias de idioma, tema y tono, tu «Mi lista» de escuelas y programas guardados, y tu récord en el minijuego. Nunca salen de tu dispositivo.",
        "Mientras haces el cuestionario, tu avance se guarda en esta pestaña del navegador (sessionStorage) para que no pierdas tu resultado si abres otra página. Se queda en tu dispositivo y desaparece al cerrar la pestaña.",
        "Usamos Vercel Web Analytics, que mide visitas de forma agregada, sin cookies y sin identificarte.",
        "Las fuentes y la librería del PDF se sirven desde este mismo sitio: no cargamos recursos de terceros.",
      ] },
      { h: "El cuestionario", p: ["Las respuestas se procesan en tu navegador para mostrarte el resultado. El PDF también se genera en tu dispositivo.", "Solo si marcas «Acepto compartir mis respuestas de forma anónima» y pulsas Enviar, guardamos:"], ul: [
        "el idioma que usabas;",
        "tus respuestas a las preguntas (opciones ya definidas, sin texto libre), incluida la zona general de la ciudad si la elegiste;",
        "las escuelas y programas que te sugerimos;",
        "la fecha del envío (sin hora).",
      ] },
      { h: "Lo que nunca guardamos", ul: [
        "nombre, correo, teléfono, dirección o código postal;",
        "tu dirección IP, agente de usuario o identificadores de dispositivo;",
        "cookies o identificadores para seguirte entre visitas;",
        "texto libre escrito por ti.",
      ] },
      { h: "Para qué usamos los datos", p: ["Solo para entender qué opciones interesan a las familias y mejorar la guía. Los resultados se revisan de forma agregada y nunca se analizan ni publican grupos de menos de 5 respuestas.", "No mostramos publicidad, no vendemos datos, no creamos perfiles de personas y no compartimos las respuestas con terceros."] },
      { h: "Cuánto tiempo", p: ["Las respuestas se eliminan automáticamente a los 24 meses."] },
      { h: "Dónde se alojan", p: ["El sitio se aloja en Vercel y las respuestas en una base de datos Neon (Postgres). Estos proveedores pueden operar servidores fuera de Canadá. La infraestructura de Vercel puede registrar temporalmente direcciones IP en sus propios registros técnicos; nosotros no las guardamos en nuestra base de datos ni las usamos."] },
      { h: "Menores de edad", p: ["La guía está pensada para familias y estudiantes de Grade 8. Si tienes menos de 13 años, usa el sitio con un adulto de tu familia. No pedimos cuentas ni datos de contacto."] },
      { h: "Tus decisiones", p: ["Compartir es totalmente voluntario, y el cuestionario y el PDF funcionan igual sin hacerlo. Como las respuestas enviadas son anónimas, no podemos saber cuáles son las tuyas; por eso no ofrecemos buscarlas ni borrarlas de forma individual. La mejor protección es no enviarlas. Puedes borrar tus preferencias limpiando los datos del sitio en tu navegador."] },
      { h: "Cambios y contacto", p: ["Si esta política cambia, actualizaremos la fecha de arriba. Para dudas o comentarios, abre un mensaje en el repositorio del proyecto."] },
    ],
    contact: "Contacto (repositorio del proyecto)",
    note: "Esta política describe cómo funciona el sitio hoy; no constituye asesoría legal.",
  },
  en: {
    htmlLang: "en", title: "Privacy policy | Highschool Navigator", back: "← Back to the guide",
    h1: "Privacy policy", updated: "Last updated",
    tldr: "In short: this site does not ask for your name, email or an account, does not use cookies and does not store your IP. If you take the questionnaire, nothing leaves your device unless you agree to share your answers anonymously.",
    sections: [
      { h: "Who we are", p: ["Highschool Navigator Mississauga is an independent informational project. It is not affiliated with DPCDSB, the Peel District School Board or the Fraser Institute."] },
      { h: "The guide", p: ["Browsing the guide does not require any personal data."], ul: [
        "We keep only your language, theme and tone preferences, your saved “My list” of schools and programs, and your best score in the mini game in your browser (localStorage). They never leave your device.",
        "While you take the questionnaire, your progress is kept in this browser tab (sessionStorage) so you do not lose your results if you open another page. It stays on your device and disappears when you close the tab.",
        "We use Vercel Web Analytics, which measures visits in aggregate, without cookies and without identifying you.",
        "Fonts and the PDF library are served from this same site: we load no third-party resources.",
      ] },
      { h: "The questionnaire", p: ["Your answers are processed in your browser to show your result. The PDF is also generated on your device.", "Only if you tick “I agree to share my answers anonymously” and press Send do we store:"], ul: [
        "the language you were using;",
        "your answers to the questions (predefined options, no free text), including the broad area of the city if you chose one;",
        "the schools and programs we suggested;",
        "the date of submission (no time).",
      ] },
      { h: "What we never store", ul: [
        "name, email, phone number, address or postal code;",
        "your IP address, user agent or device identifiers;",
        "cookies or identifiers to track you across visits;",
        "free text written by you.",
      ] },
      { h: "What we use the data for", p: ["Only to understand which options interest families and to improve the guide. Results are reviewed in aggregate and groups of fewer than 5 responses are never analyzed or published.", "We show no ads, sell no data, build no profiles of individuals and share no answers with third parties."] },
      { h: "How long we keep it", p: ["Responses are automatically deleted after 24 months."] },
      { h: "Where it is hosted", p: ["The site is hosted on Vercel and the responses in a Neon (Postgres) database. These providers may operate servers outside Canada. Vercel's infrastructure may temporarily log IP addresses in its own technical logs; we do not store them in our database or use them."] },
      { h: "Minors", p: ["The guide is designed for families and Grade 8 students. If you are under 13, use the site with an adult from your family. We do not ask for accounts or contact details."] },
      { h: "Your choices", p: ["Sharing is entirely voluntary, and the questionnaire and PDF work the same without it. Because submitted answers are anonymous, we cannot tell which ones are yours, so we do not offer individual lookup or deletion: the best protection is not to submit them. You can remove your preferences by clearing this site's data in your browser."] },
      { h: "Changes and contact", p: ["If this policy changes, we will update the date above. For questions or feedback, open an issue in the project repository."] },
    ],
    contact: "Contact (project repository)",
    note: "This policy describes how the site works today; it is not legal advice.",
  },
  fr: {
    htmlLang: "fr-CA", title: "Politique de confidentialité | Highschool Navigator", back: "← Retour au guide",
    h1: "Politique de confidentialité", updated: "Dernière mise à jour",
    tldr: "En bref : ce site ne demande ni nom, ni courriel, ni compte, n'utilise pas de témoins (cookies) et ne conserve pas ton adresse IP. Si tu fais le questionnaire, rien ne quitte ton appareil à moins que tu acceptes de partager tes réponses de façon anonyme.",
    sections: [
      { h: "Qui nous sommes", p: ["Highschool Navigator Mississauga est un projet d'information indépendant. Il n'est affilié ni au DPCDSB, ni au Peel District School Board, ni à l'Institut Fraser."] },
      { h: "Le guide", p: ["Consulter le guide n'exige aucune donnée personnelle."], ul: [
        "Nous conservons dans ton navigateur (localStorage) seulement tes préférences de langue, de thème et de ton, ta « Ma liste » d'écoles et de programmes enregistrés, et ton record au mini-jeu. Elles ne quittent jamais ton appareil.",
        "Pendant le questionnaire, ta progression est conservée dans cet onglet du navigateur (sessionStorage) pour que tu ne perdes pas ton résultat si tu ouvres une autre page. Elle reste sur ton appareil et disparaît à la fermeture de l'onglet.",
        "Nous utilisons Vercel Web Analytics, qui mesure les visites de façon agrégée, sans témoins et sans t'identifier.",
        "Les polices et la bibliothèque PDF sont servies depuis ce même site : aucune ressource de tiers n'est chargée.",
      ] },
      { h: "Le questionnaire", p: ["Tes réponses sont traitées dans ton navigateur pour afficher ton résultat. Le PDF est aussi généré sur ton appareil.", "Seulement si tu coches « J'accepte de partager mes réponses de façon anonyme » et que tu appuies sur Envoyer, nous enregistrons :"], ul: [
        "la langue que tu utilisais;",
        "tes réponses aux questions (choix prédéfinis, sans texte libre), y compris le grand secteur de la ville si tu en as choisi un;",
        "les écoles et programmes suggérés;",
        "la date de l'envoi (sans l'heure).",
      ] },
      { h: "Ce que nous ne conservons jamais", ul: [
        "nom, courriel, téléphone, adresse ou code postal;",
        "ton adresse IP, ton agent utilisateur ou des identifiants d'appareil;",
        "des témoins ou identifiants pour te suivre d'une visite à l'autre;",
        "du texte libre écrit par toi.",
      ] },
      { h: "À quoi servent les données", p: ["Uniquement à comprendre quelles options intéressent les familles et à améliorer le guide. Les résultats sont examinés de façon agrégée et les groupes de moins de 5 réponses ne sont jamais analysés ni publiés.", "Nous n'affichons pas de publicité, ne vendons pas de données, ne créons pas de profils de personnes et ne partageons aucune réponse avec des tiers."] },
      { h: "Durée de conservation", p: ["Les réponses sont supprimées automatiquement après 24 mois."] },
      { h: "Où les données sont hébergées", p: ["Le site est hébergé chez Vercel et les réponses dans une base de données Neon (Postgres). Ces fournisseurs peuvent exploiter des serveurs à l'extérieur du Canada. L'infrastructure de Vercel peut consigner temporairement des adresses IP dans ses propres journaux techniques; nous ne les conservons pas dans notre base de données et ne les utilisons pas."] },
      { h: "Mineurs", p: ["Le guide s'adresse aux familles et aux élèves de 8e année. Si tu as moins de 13 ans, utilise le site avec un adulte de ta famille. Nous ne demandons ni compte ni coordonnées."] },
      { h: "Tes choix", p: ["Le partage est entièrement volontaire, et le questionnaire et le PDF fonctionnent de la même façon sans partage. Comme les réponses envoyées sont anonymes, nous ne pouvons pas savoir lesquelles sont les tiennes; nous n'offrons donc pas de recherche ni de suppression individuelle : la meilleure protection est de ne pas les envoyer. Tu peux effacer tes préférences en supprimant les données du site dans ton navigateur."] },
      { h: "Modifications et contact", p: ["Si cette politique change, nous mettrons à jour la date ci-dessus. Pour toute question ou tout commentaire, ouvre un signalement dans le dépôt du projet."] },
    ],
    contact: "Contact (dépôt du projet)",
    note: "Cette politique décrit le fonctionnement actuel du site; elle ne constitue pas un avis juridique.",
  },
};
