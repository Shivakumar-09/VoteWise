"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  Info
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

type Verdict = "LIKELY_TRUE" | "UNVERIFIED" | "LIKELY_FALSE" | "MISLEADING";

interface AnalysisResult {
  verdict: Verdict;
  confidence: number;
  explanation: string;
  redFlags: string[];
  officialSources: string[];
}

export default function FakeNewsPage() {
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const verdictConfig: Record<Verdict, { label: string; color: string; icon: any; bgColor: string; borderColor: string }> = {
    LIKELY_TRUE: {
      label: t("fake_news.verdict_true") || "Likely True",
      color: "text-green-400",
      icon: CheckCircle2,
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    UNVERIFIED: {
      label: t("fake_news.verdict_unverified") || "Unverified",
      color: "text-amber-400",
      icon: HelpCircle,
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
    },
    LIKELY_FALSE: {
      label: t("fake_news.verdict_false") || "Likely False",
      color: "text-red-400",
      icon: XCircle,
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    MISLEADING: {
      label: t("fake_news.verdict_misleading") || "Misleading",
      color: "text-orange-400",
      icon: AlertTriangle,
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
  };

  const rawSamples = t("fake_news.samples");
  const sampleTexts = Array.isArray(rawSamples) ? rawSamples : [
    "The election dates have been changed due to a court order.",
    "EVMs can be hacked using a Bluetooth device.",
    "Aadhaar card is now the only valid ID for voting."
  ];

  const analyze = async () => {
    if (!content.trim() || content.length < 20) {
      setError(t("fake_news.error_too_short") || "Please enter at least 20 characters.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/fake-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setResult(data);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch {
      setError(t("common.error") || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const config = result ? verdictConfig[result.verdict] : null;
  const VerdictIcon = config?.icon;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 transition-colors duration-300">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 mb-8 shadow-glow"
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="section-heading text-foreground mb-4">
            {t("sidebar.fake_news")}
          </h1>
          <p className="text-foreground/50 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            {t("hero.subtitle").split(".")[3] || "Paste any election news to verify with AI."}
          </p>
        </div>

        {/* Input section */}
        <div className="grid lg:grid-cols-5 gap-10">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-3"
           >
              <div className="glass-card-strong p-8 border-foreground/10 shadow-premium">
                <div className="mb-6 space-y-2">
                   <label className="text-foreground/40 font-black text-[10px] uppercase tracking-[0.2em]">{t("fake_news.placeholder") || "Content to analyze"}</label>
                   <textarea
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     placeholder="Paste news content here..."
                     className="input-field min-h-[280px] resize-none text-base leading-relaxed"
                   />
                </div>

                {error && (
                  <div className="flex items-center gap-3 mb-8 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 text-rose-500">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-bold uppercase tracking-widest leading-tight">{error}</p>
                  </div>
                )}

                <button
                  onClick={analyze}
                  disabled={loading}
                  className="btn-primary !bg-gradient-to-r !from-red-600 !to-orange-600 w-full justify-center text-lg py-5 shadow-lg shadow-red-600/20"
                >
                  {loading ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing...</>
                  ) : (
                    <><ShieldCheck className="w-6 h-6" /> {t("fake_news.analyze_btn") || "Analyze Content"}</>
                  )}
                </button>
              </div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-2 space-y-8"
           >
              <div className="glass-card p-8 border-foreground/5 shadow-premium">
                <h3 className="text-foreground/40 font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Try Sample Claims
                </h3>
                <div className="space-y-4">
                  {sampleTexts.map((text: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setContent(text)}
                      className="w-full text-left p-5 rounded-2xl bg-foreground/5 border border-foreground/5 text-foreground/60 text-xs font-bold hover:text-indigo-500 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all leading-relaxed"
                    >
                      "{text}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 shadow-sm">
                 <h4 className="text-foreground font-black text-sm mb-3 flex items-center gap-2">
                   <Info className="w-4 h-4 text-indigo-500" />
                   How it works?
                 </h4>
                 <p className="text-foreground/50 text-xs leading-relaxed font-medium">
                   Our AI cross-references the content with historical data, official Election Commission press releases, and established fact-checking patterns.
                 </p>
              </div>
           </motion.div>
        </div>

        {/* Results Area */}
        <div ref={resultsRef} className="scroll-mt-24">
          <AnimatePresence>
          {result && config && VerdictIcon && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 space-y-8"
            >
              {/* Verdict Highlight */}
              <div className={`p-10 rounded-[2.5rem] border-2 shadow-premium overflow-hidden relative ${config.bgColor} ${config.borderColor}`}>
                <div className="absolute top-0 right-0 w-80 h-80 bg-current opacity-[0.05] blur-3xl -z-10" />
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 text-center md:text-left">
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-2 border-current flex-shrink-0 shadow-lg ${config.bgColor}`}>
                    <VerdictIcon className={`w-14 h-14 ${config.color.replace('text-', 'text-opacity-100 ')}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                      <h2 className={`text-4xl md:text-5xl font-black font-heading ${config.color}`}>
                        {config.label}
                      </h2>
                      <div className="inline-flex items-center justify-center gap-3 px-4 py-1.5 rounded-full bg-background/50 border border-foreground/10 shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[11px] font-black text-foreground uppercase tracking-widest">{result.confidence}% Confidence</span>
                      </div>
                    </div>

                    <p className="text-foreground/80 text-xl font-medium leading-relaxed mb-8 italic">
                      "{result.explanation}"
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-3">
                       <div className="flex justify-between text-[11px] font-black text-foreground/30 uppercase tracking-[0.2em]">
                          <span>Analysis Score</span>
                          <span>{result.confidence}%</span>
                       </div>
                       <div className="w-full h-4 bg-foreground/10 rounded-full overflow-hidden p-1 border border-foreground/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence}%` }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                            className={`h-full rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] ${
                              result.verdict === "LIKELY_TRUE" ? "bg-green-500" :
                              result.verdict === "LIKELY_FALSE" ? "bg-rose-500" :
                              result.verdict === "MISLEADING" ? "bg-orange-500" : "bg-amber-500"
                            }`}
                          />
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Flags & Sources */}
              <div className="grid md:grid-cols-2 gap-8">
                {result.redFlags.length > 0 && (
                  <div className="glass-card p-8 border-rose-500/10 shadow-premium">
                    <h3 className="text-rose-500 font-black text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4" /> Red Flags Detected
                    </h3>
                    <ul className="space-y-4">
                      {result.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-4 text-foreground/80 text-sm font-bold">
                          <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.officialSources.length > 0 && (
                  <div className="glass-card p-8 border-indigo-500/10 shadow-premium">
                    <h3 className="text-indigo-500 font-black text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4" /> Verify Official Sources
                    </h3>
                    <div className="space-y-4">
                      {result.officialSources.map((src, i) => (
                        <a
                          key={i}
                          href={src.startsWith("http") ? src : `https://${src}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-foreground/5 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group"
                        >
                          <span className="text-foreground/60 text-xs font-bold truncate max-w-[240px] uppercase tracking-tighter">{src}</span>
                          <ExternalLink className="w-4 h-4 text-indigo-500 group-hover:scale-125 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center pt-12">
                 <div className="flex items-center justify-center gap-3 text-foreground/20 text-[10px] font-black uppercase tracking-[0.3em]">
                    <Info className="w-4 h-4" />
                    {t("common.call_helpline")}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
