import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import backend from "i18next-xhr-backend";

import translationsEN from './en.json'
import translationsAR from './ar.json'

const resources = {
    en: {
        translation: translationsEN
    },
    ar: {
        translation: translationsAR
    }
};

i18n
    .use(detector) // passes i18n down to react-i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(backend)

    .init({
        resources,
        lng: "en",
        fallbackLng: "en", // use en if detected lng is not available

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;



