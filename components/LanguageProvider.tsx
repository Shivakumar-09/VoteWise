"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "English" | "Hindi" | "Telugu" | "Tamil" | "Kannada" | "Marathi" | "Bengali" | "Urdu";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const langMap: Record<Language, string> = {
  English: "en",
  Hindi: "hi",
  Telugu: "te",
  Tamil: "ta",
  Kannada: "kn",
  Marathi: "mr",
  Bengali: "bn",
  Urdu: "ur",
};

import en from "../public/locales/en.json";
import hi from "../public/locales/hi.json";
import te from "../public/locales/te.json";
import ta from "../public/locales/ta.json";
import kn from "../public/locales/kn.json";
import mr from "../public/locales/mr.json";
import bn from "../public/locales/bn.json";
import ur from "../public/locales/ur.json";

const allTranslations: Record<string, any> = {
  en, hi, te, ta, kn, mr, bn, ur
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("English");
  const [translations, setTranslations] = useState<any>(en);

  useEffect(() => {
    // Load from localStorage
    const savedLang = localStorage.getItem("votewise-lang") as Language;
    if (savedLang && langMap[savedLang]) {
      setLanguageState(savedLang);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split("-")[0];
      const detected = Object.keys(langMap).find(
        (key) => langMap[key as Language] === browserLang
      ) as Language;
      if (detected) setLanguageState(detected);
    }
  }, []);

  useEffect(() => {
    const langCode = langMap[language];
    const data = allTranslations[langCode] || en;
    setTranslations(data);
    localStorage.setItem("votewise-lang", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (keyPath: string) => {
    const keys = keyPath.split(".");
    let value = translations;
    for (const key of keys) {
      value = value?.[key];
    }
    return value || keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
