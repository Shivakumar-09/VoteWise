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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("English");
  const [translations, setTranslations] = useState<any>({});

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
    // Fetch translations
    const loadTranslations = async () => {
      try {
        const res = await fetch(`/locales/${langMap[language]}.json`);
        
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Not JSON");
        }

        const data = await res.json();
        setTranslations(data);
      } catch (error) {
        console.error("Failed to load translations:", error);
        
        // Try fallback to English if not already English
        if (language !== "English") {
          try {
            const res = await fetch("/locales/en.json");
            if (res.ok) {
              const data = await res.json();
              setTranslations(data);
            }
          } catch (e) {
            console.error("English fallback failed too", e);
          }
        }
      }
    };
    loadTranslations();
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
