export const fallbackLng = "fr";
export const languages = [fallbackLng, "en"];
export const defaultNS = "translation";

export const cookieName = "i18next";
export const headerName = "x-language";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
