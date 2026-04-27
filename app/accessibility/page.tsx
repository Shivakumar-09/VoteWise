"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Accessibility, Type, Sun, Mic, Keyboard, CheckCircle2 } from "lucide-react";

const features = [
  {
    id: "large-text",
    icon: Type,
    title: "Large Text Mode",
    description: "Increase font size across the entire platform for easier reading.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "high-contrast",
    icon: Sun,
    title: "High Contrast Mode",
    description: "Switch to a high-contrast black & white theme for maximum visibility.",
    color: "from-amber-500 to-yellow-600",
  },
  {
    id: "voice-mode",
    icon: Mic,
    title: "Voice Mode",
    description: "Use voice commands to interact with the AI assistant hands-free.",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "keyboard-nav",
    icon: Keyboard,
    title: "Keyboard Navigation",
    description: "Full keyboard accessibility — tab, enter, and arrow key support.",
    color: "from-purple-500 to-violet-600",
  },
];

const shortcuts = [
  { keys: ["Tab"], action: "Move to next element" },
  { keys: ["Shift", "Tab"], action: "Move to previous element" },
  { keys: ["Enter", "Space"], action: "Activate button / open link" },
  { keys: ["Esc"], action: "Close modal / dropdown" },
  { keys: ["Arrow keys"], action: "Navigate within menus" },
  { keys: ["Alt", "H"], action: "Go to Home page" },
  { keys: ["Alt", "A"], action: "Open AI Assistant" },
  { keys: ["Alt", "E"], action: "Open Eligibility Checker" },
];

export default function AccessibilityPage() {
  const [active, setActive] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setActive((prev) => {
      const next = { ...prev, [id]: !prev[id] };

      // Apply large text
      if (id === "large-text") {
        if (next[id]) {
          document.documentElement.classList.add("large-text");
        } else {
          document.documentElement.classList.remove("large-text");
        }
      }

      // Apply high contrast
      if (id === "high-contrast") {
        if (next[id]) {
          document.documentElement.classList.add("high-contrast");
        } else {
          document.documentElement.classList.remove("high-contrast");
        }
      }

      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-24 pb-16">
      <div className="page-container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-6">
            <Accessibility className="w-8 h-8 text-white" />
          </div>
          <h1 className="section-heading text-white mb-3">
            Accessibility <span className="gradient-text">Mode</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            VoteWise AI is built for everyone. Enable the accessibility features
            that work best for you.
          </p>
        </div>

        {/* Feature toggles */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {features.map((feat, i) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-5 transition-all ${
                active[feat.id]
                  ? "border-indigo-500/50 bg-indigo-600/10"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <feat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => toggle(feat.id)}
                  aria-pressed={!!active[feat.id]}
                  aria-label={`Toggle ${feat.title}`}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0A0E27] border ${
                    active[feat.id] ? "bg-green-500 border-green-400" : "bg-slate-800 border-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 rounded-full shadow transition-transform ${
                      active[feat.id] ? "translate-x-6 bg-white" : "translate-x-0 bg-slate-400"
                    }`}
                    style={{ width: "1.125rem", height: "1.125rem" }}
                  />
                </button>
              </div>

              {active[feat.id] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center gap-1.5 text-green-400 text-xs font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Keyboard shortcuts */}
        <div className="glass-card-strong p-6">
          <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            Keyboard Shortcuts
          </h2>
          <div className="space-y-2">
            {shortcuts.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <span className="text-white/60 text-sm">{s.action}</span>
                <div className="flex items-center gap-1">
                  {s.keys.map((k) => (
                    <kbd
                      key={k}
                      className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-white/80 text-xs font-mono"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Helpline */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600/15 to-purple-600/15 border border-indigo-500/25 text-center">
          <p className="text-white/70 text-sm mb-1">
            Need additional assistance? Our AI is voice-enabled and supports 8 languages.
          </p>
          <p className="text-white/40 text-xs">
            📞 Or call: <strong className="text-white/60">National Voter Helpline 1950</strong> (Toll-free · 24×7)
          </p>
        </div>
      </div>
    </div>
  );
}
