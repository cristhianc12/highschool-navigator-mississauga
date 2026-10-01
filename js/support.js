// Voluntary support link ("buy us a coffee"). Set SUPPORT_URL to the donation page (Ko-fi, Buy Me a Coffee,
// GitHub Sponsors...). While it is empty nothing is shown. It is a plain link: no scripts, no widgets.
export const SUPPORT_URL = "";

const T = {
  es: { p: "Gratis para la comunidad, sin anuncios. Si te sirvió, puedes", a: "invitarnos un café ☕" },
  en: { p: "Free for the community, no ads. If it helped your family, you can", a: "buy us a coffee ☕" },
  fr: { p: "Gratuit pour la communauté, sans publicité. Si ça a aidé ta famille, tu peux", a: "nous offrir un café ☕" },
};

export const supportHtml = (lang) => {
  if (!SUPPORT_URL) return "";
  const t = T[lang] || T.en;
  return `<span class="support">${t.p} <a href="${SUPPORT_URL}" target="_blank" rel="noopener" data-support>${t.a}</a></span>`;
};
