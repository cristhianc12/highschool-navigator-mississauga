// Verified per-school details beyond the regional programs: SHSM sectors, other programs and official links.
// Sources: each school's own website (DPCDSB: <code>.dpcdsb.org, Peel: <name>.peelschools.org), read on 2026-09-29.
// Names are kept as published (English). Only what the school pages state is listed; if a school does not
// appear here with SHSM information, it means the page did not name any (confirm with the school).

import { ROSTER } from "./data/roster.js";

const D = (code) => ({ site: `https://${code}.dpcdsb.org/`, cal: `https://${code}.dpcdsb.org/programs/course-calendar`, src: "dpcdsb" });
const P = (sub) => ({ site: `https://${sub}.peelschools.org/`, src: "peel" });

export const EXTRAS = {
  // ---------------- DPCDSB ----------------
  goetz: { ...D("goetz"), shsm: ["ICT", "Arts & Culture"] },
  pocock: { ...D("pocok"), shsm: ["Arts & Culture", "Hospitality & Tourism", "Transportation"] },
  cabot: { ...D("cabot"), shsm: ["ICT", "Business"] },
  sfx: { ...D("stfxs") },
  loyola: { ...D("loyol"), shsm: ["Sports (Recreation and Performance)"] },
  aloysius: { ...D("gonza"), shsm: ["Business (Accounting and Innovative Management)", "The Environment (Achieving Careers in the Environment)"] },
  joseph: { ...D("joess") },
  paul: { ...D("pauls"), shsm: ["Health & Wellness"] },
  iona: { ...D("ionas"), shsm: ["Business (Marketing Management)", "Arts & Culture"] },
  joan: { ...D("joana") },
  martin: { ...D("martn") },
  marcellinus: { ...D("marcl"), shsm: ["Hospitality & Tourism", "Arts & Culture"] },
  ascension: { ...D("ascen"), shsm: ["Business"] },
  carmel: { ...D("carms"), shsm: ["ICT"] },
  romero: { ...D("romer") },

  // ---------------- Peel ----------------
  johnfraser: { ...P("johnfraser"), shsm: ["Arts & Culture", "Aviation & Aerospace", "Health & Wellness"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  streetsville: { ...P("streetsville"), shsm: ["Sports"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  lornepark: { ...P("lorneparkss"), shsm: ["Sports"], other: ["Extended French", "Co-operative Education", "Dual Credit", "OYAP"] },
  portcredit: { ...P("portcredit"), shsm: ["Justice, Community Safety & Emergency Services", "Manufacturing"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  cawthra: { ...P("cawthrapark"), shsm: ["Arts & Culture", "Health & Wellness"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  glenforest: { ...P("glenforest"), shsm: ["Construction", "Information & Communications Technology"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  mississ: { ...P("mississauga"), shsm: ["Health & Wellness"], other: ["Advanced Placement (school program)", "Alternative Pathways to Progress", "Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  erindale: { ...P("erindale"), shsm: ["Justice, Community Safety & Emergency Services"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  meadowvale: { ...P("meadowvale"), shsm: ["Business", "Construction", "Information & Communications Technology"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  stephenlewis: { ...P("stephenlewis"), shsm: ["Science & Environmental", "Sports", "Non-Profit & Education"], other: ["Advanced Placement (school program, new in Sep 2026)", "Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  rickhansen: { ...P("rickhansen"), shsm: ["Construction", "Hospitality & Tourism", "Manufacturing"], other: ["Advanced Placement (school program)", "Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  applewood: { ...P("applewoodheights"), shsm: ["Justice, Community Safety & Emergency Services", "Sports"], other: ["Dual Credit", "OYAP", "Pathways programs"] },
  lma: { ...P("lincolnmalexander"), shsm: ["Hospitality & Tourism", "Transportation"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  clarkson: { ...P("clarksonss"), shsm: ["Sports"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  tlkennedy: { ...P("tlkennedy"), shsm: ["Business", "Information & Communications Technology"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  westcredit: { ...P("westcredit"), shsm: ["Construction", "Hospitality"], other: ["Co-operative Education", "Dual Credit", "OYAP", "Pathways programs"] },
  gordon: { shsm: ["Hospitality & Tourism"], other: [], src: "peel" },
};

// Every other GTA school gets its official website from Ontario open data until its scraped details are published.
const https = (u) => (/^https?:\/\//i.test(u) ? u : "https://" + u).replace(/^http:/i, "https:");
for (const r of ROSTER) if (!EXTRAS[r.id] && r.site) EXTRAS[r.id] = { site: https(r.site), src: r.board };
