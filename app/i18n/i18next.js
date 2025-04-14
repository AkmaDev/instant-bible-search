import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { fallbackLng, languages, defaultNS } from "./settings";

const runsOnServerSide = typeof window === "undefined";

i18next
  .use(initReactI18next) // Intégration avec React
  .use(LanguageDetector) // Détection automatique de la langue
  .use(
    resourcesToBackend((language, namespace) =>
      import(`@/public/locales/${language}/${namespace}.json`)
    )
  ) // Importation dynamique des ressources
  .init({
    supportedLngs: languages,
    fallbackLng,
    lng: undefined, // La langue sera détectée automatiquement côté client
    fallbackNS: defaultNS,
    defaultNS,
    detection: {
      order: ["path", "htmlTag", "cookie", "navigator"],
    },
    preload: runsOnServerSide ? languages : [], // Précharger les langues côté serveur
  });

export default i18next;
