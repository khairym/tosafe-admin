import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import backend from "i18next-xhr-backend";

import ar from "./localization/ar.json";
import en from "./localization/en.json";

const resources = {
  ar: {
    translation: ar,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(detector) // passes i18n down to react-i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(backend)
  .init({
    resources,
    lng: localStorage.getItem("lang") || "en",
    fallbackLng: "en", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
