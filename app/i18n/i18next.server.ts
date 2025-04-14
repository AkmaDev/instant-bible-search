import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { fallbackLng, languages, defaultNS } from "./settings";

i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) =>
    import(`@/public/locales/${language}/${namespace}.json`)
  ))
  .init({
    supportedLngs: languages,
    fallbackLng,
    fallbackNS: defaultNS,
    defaultNS,
    preload: languages, // ← seulement ici sur le serveur
  });

export default i18next;
