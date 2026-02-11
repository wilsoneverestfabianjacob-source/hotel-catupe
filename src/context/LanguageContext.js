import { createContext, useState, useContext, useEffect } from "react";
import translations from "../translations/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const storedLang = localStorage.getItem("lang");

  const urlLang = window.location.pathname.split("/")[1];

  const map = {
    pt: "pt-MZ",
    "pt-MZ": "pt-MZ",
    en: "en-US",
    "en-US": "en-US",
  };

  const initialLang = map[urlLang] || storedLang || "pt-MZ";

  const [language, setLanguage] = useState(initialLang);

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
