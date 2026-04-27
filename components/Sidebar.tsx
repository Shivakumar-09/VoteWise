"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckCircle,
  MapPin,
  ShieldCheck,
  Bot,
  Calendar,
  BookOpen,
  Accessibility,
  Menu,
  X,
  Vote,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const sidebarItems = [
  { id: "dashboard", icon: LayoutDashboard, href: "/", translationKey: "sidebar.home" },
  { id: "ai-assistant", icon: Bot, href: "/ai-assistant", translationKey: "sidebar.ai_assistant" },
  { id: "booth-finder", icon: MapPin, href: "/booth-finder", translationKey: "sidebar.booth_finder" },
  { id: "calendar", icon: Calendar, href: "/calendar", translationKey: "sidebar.election_guide" },
  { id: "eligibility", icon: CheckCircle, href: "/eligibility", translationKey: "sidebar.eligibility" },
  { id: "registration", icon: BookOpen, href: "/registration", translationKey: "guides.registration" },
  { id: "fake-news", icon: ShieldCheck, href: "/fake-news", translationKey: "sidebar.fake_news" },
  { id: "accessibility", icon: Accessibility, href: "/accessibility", translationKey: "guides.accessibility" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] p-2 rounded-xl bg-indigo-600 text-white md:hidden shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0A0E27]/80 backdrop-blur-xl border-r border-white/10 z-50">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-gradient flex items-center justify-center shadow-glow">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-white">
              Vote<span className="text-[#F59E0B]">Wise</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? "bg-indigo-600 text-white shadow-glow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-indigo-400"}`} />
                  <span className="font-medium text-sm">{t(item.translationKey || `sidebar.${item.id}`)}</span>
                </div>
                {isActive && <motion.div layoutId="sidebar-dot" className="w-1.5 h-1.5 rounded-full bg-white" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Emergency</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#F59E0B]">Helpline: 1950</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-72 h-screen bg-[#0A0E27] border-r border-white/10 z-[56] md:hidden p-6"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-gradient flex items-center justify-center">
                  <Vote className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-xl text-white">VoteWise</span>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${isActive
                        ? "bg-indigo-600 text-white"
                        : "text-white/60 hover:text-white"
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{t(item.translationKey || `sidebar.${item.id}`)}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
