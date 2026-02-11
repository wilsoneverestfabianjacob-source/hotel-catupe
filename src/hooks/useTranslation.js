import { useLanguage } from "../context/LanguageContext";
import translations from "../translations/translations";

export function useTranslation() {
  const { language } = useLanguage();

  const map = {
    pt: "pt-MZ",
    "pt-MZ": "pt-MZ",
    en: "en-US",
    "en-US": "en-US",
  };

  const lang = map[language] || "pt-MZ";

  function t(key) {
    const value = translations[lang][key];

    if (Array.isArray(value)) return value;
    if (typeof value === "object" && value !== null) return value;

    return value || key;
  }

  return { t };
}
