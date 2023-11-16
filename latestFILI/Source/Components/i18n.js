// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import English from "../Translations/english.json";
import Hindi from "../Translations/hindi.json";
import Gujarati from "../Translations/gujarati.json";
import Tamil from "../Translations/tamil.json";
import Punjabi from "../Translations/punjabi.json";

const resources = {
  English: { translation: English },
  Hindi: { translation: Hindi },
  Gujarati: { translation: Gujarati },
  Tamil: { translation: Tamil },
  Punjabi: { translation: Punjabi },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  //   lng: Localization.locale,
  fallbackLng: "English",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
