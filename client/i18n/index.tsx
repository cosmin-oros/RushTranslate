import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEN from "../locales/en.json";
import translationRO from "../locales/ro.json";
import translationFR from "../locales/fr.json";
import translationDE from "../locales/de.json";
import translationIT from "../locales/it.json";
import translationES from "../locales/es.json";
import translationPT from "../locales/pt.json";
import translationRU from "../locales/ru.json";
import translationZH from "../locales/zh.json";
import translationJA from "../locales/ja.json";
import translationAR from "../locales/ar.json";
import translationHI from "../locales/hi.json";
import translationBN from "../locales/bn.json";
import translationKO from "../locales/ko.json";
import translationTR from "../locales/tr.json";
import translationVI from "../locales/vi.json";
import translationNL from "../locales/nl.json";
import translationPL from "../locales/pl.json";
import translationSV from "../locales/sv.json";
import translationTH from "../locales/th.json";

const resources = {
  "ro": { translation: translationRO },
  "en": { translation: translationEN },
  "fr": { translation: translationFR },
  "de": { translation: translationDE },
  "it": { translation: translationIT },
  "es": { translation: translationES },
  "pt": { translation: translationPT },
  "ru": { translation: translationRU },
  "zh": { translation: translationZH },
  "ja": { translation: translationJA },
  "ar": { translation: translationAR },
  "hi": { translation: translationHI },
  "bn": { translation: translationBN },
  "ko": { translation: translationKO },
  "tr": { translation: translationTR },
  "vi": { translation: translationVI },
  "nl": { translation: translationNL },
  "pl": { translation: translationPL },
  "sv": { translation: translationSV },
  "th": { translation: translationTH },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = "en";
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;