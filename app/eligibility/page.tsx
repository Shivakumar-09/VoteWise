"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Loader2, ArrowRight, Info } from "lucide-react";
import { INDIAN_STATES } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

interface EligibilityResult {
  eligible: boolean;
  issues: string[];
  nextSteps: string[];
}

export default function EligibilityPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    age: "",
    citizenship: "indian",
    state: "",
    residencyMonths: "12",
  });
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(form.age),
          citizenship: form.citizenship,
          state: form.state,
          residencyMonths: parseInt(form.residencyMonths),
        }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
      
      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch {
      setError(t("common.error") || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-24 pb-16">
      <div className="page-container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-glow"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="section-heading text-white mb-3">
            {t("eligibility.title") || "Check Your Eligibility"}
          </h1>
          <p className="text-white/60">
            {t("hero.subtitle").split(".")[1] || "Instantly find out if you can vote."}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-strong p-8 border-white/10"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Age */}
              <div className="space-y-2">
                <label className="block text-white/70 text-xs font-bold uppercase tracking-wider">
                  {t("eligibility.age_label") || "Your Age"} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="e.g. 18"
                  className="input-field text-white focus:border-green-500 transition-all"
                  required
                />
                <p className="text-white/20 text-[10px] font-medium uppercase tracking-tighter">
                  {t("eligibility.age_hint") || "Must be 18+ to vote"}
                </p>
              </div>

              {/* Citizenship */}
              <div className="space-y-2">
                <label className="block text-white/70 text-xs font-bold uppercase tracking-wider">
                  {t("eligibility.citizenship_label") || "Citizenship"} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.citizenship}
                  onChange={(e) => setForm({ ...form, citizenship: e.target.value })}
                  className="input-field text-white focus:border-green-500 transition-all"
                  required
                >
                  <option value="indian" className="bg-[#1e293b]">{t("eligibility.citizen_indian") || "Indian Citizen"}</option>
                  <option value="pio" className="bg-[#1e293b]">PIO</option>
                  <option value="foreign" className="bg-[#1e293b]">Foreign National</option>
                  <option value="oci" className="bg-[#1e293b]">OCI</option>
                </select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="block text-white/70 text-xs font-bold uppercase tracking-wider">
                  {t("booth.state") || "State of Residence"} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="input-field text-white focus:border-green-500 transition-all"
                  required
                >
                  <option value="" className="bg-[#1e293b]">Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s} className="bg-[#1e293b]">{s}</option>
                  ))}
                </select>
              </div>

              {/* Residency */}
              <div className="space-y-2">
                <label className="block text-white/70 text-xs font-bold uppercase tracking-wider">
                  {t("eligibility.residency_label") || "Time at Address"}
                </label>
                <select
                  value={form.residencyMonths}
                  onChange={(e) => setForm({ ...form, residencyMonths: e.target.value })}
                  className="input-field text-white focus:border-green-500 transition-all"
                >
                  <option value="0" className="bg-[#1e293b]">Less than 1 month</option>
                  <option value="1" className="bg-[#1e293b]">1–6 months</option>
                  <option value="12" className="bg-[#1e293b]">6+ months</option>
                  <option value="24" className="bg-[#1e293b]">2+ years</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary !bg-gradient-to-r !from-green-500 !to-emerald-600 w-full justify-center text-base py-4 shadow-lg shadow-green-500/20"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}</>
              ) : (
                <>
                  {t("hero.cta_eligibility") || "Check My Eligibility"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Result Area */}
        <div ref={resultsRef}>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-6"
              >
                {/* Verdict Card */}
                <div
                  className={`p-8 rounded-3xl border flex items-center gap-6 shadow-2xl transition-all duration-500 ${
                    result.eligible
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                     result.eligible ? "bg-green-500/20" : "bg-red-500/20"
                  }`}>
                    {result.eligible ? (
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    ) : (
                      <XCircle className="w-10 h-10 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h2
                      className={`text-2xl md:text-3xl font-black font-heading mb-2 ${
                        result.eligible ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {result.eligible
                        ? (t("eligibility.success_title") || "You are Eligible!")
                        : (t("eligibility.fail_title") || "Not Currently Eligible")}
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed">
                      {result.eligible
                        ? (t("eligibility.success_desc") || "Great news! You meet all requirements.")
                        : (t("eligibility.fail_desc") || "Based on the rules, you do not meet all criteria.")}
                    </p>
                  </div>
                </div>

                {/* Next Steps Container */}
                <div className="grid md:grid-cols-2 gap-6">
                   {result.issues.length > 0 && (
                      <div className="glass-card p-6 border-white/5">
                        <h3 className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          Issues Found
                        </h3>
                        <ul className="space-y-3">
                          {result.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-3 text-white/80 text-sm font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                   )}

                   <div className="glass-card p-6 border-white/5">
                      <h3 className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ArrowRight className="w-3 h-3 text-indigo-400" />
                        Recommended Steps
                      </h3>
                      <ul className="space-y-4">
                        {result.nextSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-white/80 text-sm">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs font-black flex items-center justify-center flex-shrink-0">
                              {i + 1}
                            </span>
                            <span dangerouslySetInnerHTML={{ __html: step.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-indigo-400 font-bold hover:underline">$1</a>') }} />
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] pt-6">
                  <Info className="w-3 h-3" />
                  {t("common.call_helpline")}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
