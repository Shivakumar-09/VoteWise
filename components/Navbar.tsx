"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Vote,
  Globe,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { SUPPORTED_LANGUAGES } from "@/lib/utils";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 md:left-64 right-0 z-40 transition-all duration-300 h-16 flex items-center ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-foreground/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="w-full px-6 flex items-center justify-between">
        {/* Mobile Logo Only */}
        <div className="md:hidden flex items-center gap-2">
           <Vote className="w-6 h-6 text-indigo-500" />
           <span className="font-heading font-bold text-foreground">VoteWise</span>
        </div>

        {/* Desktop Breadcrumb/Context (Optional) */}
        <div className="hidden md:flex items-center gap-2 text-foreground/40 text-sm">
           <Sparkles className="w-4 h-4" />
           <span>{t("hero.badge")}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm hover:bg-foreground/10 transition-all"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">{language}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 glass-card border border-white/15 py-1 z-50 shadow-2xl"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.name as any);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                        language === lang.name
                          ? "text-indigo-400 bg-indigo-600/10"
                          : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-foreground/30 text-[10px] uppercase">{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
          >
            {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
          </button>

          {/* Ask AI CTA */}
          <Link
            href="/ai-assistant"
            className="hidden sm:flex btn-primary !py-2 !px-4 !text-xs !rounded-xl"
          >
            {t("navbar.ask_ai")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
