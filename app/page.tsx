"use client";

import { motion, useInView, type Variants, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  CheckCircle,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  ShieldCheck,
  BookOpen,
  Accessibility,
  ArrowRight,
  Star,
  TrendingUp,
  Globe2,
  Zap,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function HomePage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Bot,
      color: "from-indigo-500 to-purple-600",
      label: t("sidebar.ai_assistant"),
      desc: t("hero.subtitle").split(".")[0], // Simplified
      href: "/ai-assistant",
      badge: "Gemini 1.5",
    },
    {
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
      label: t("sidebar.eligibility"),
      desc: t("hero.subtitle").split(".")[1],
      href: "/eligibility",
      badge: t("hero.cta_eligibility"),
    },
    {
      icon: MapPin,
      color: "from-rose-500 to-pink-600",
      label: t("sidebar.booth_finder"),
      desc: t("hero.subtitle").split(".")[2],
      href: "/booth-finder",
      badge: t("hero.cta_booth"),
    },
    {
      icon: CalendarIcon,
      color: "from-amber-500 to-yellow-600",
      label: t("sidebar.election_guide"),
      desc: t("ai_assistant.welcome_message").split(".")[0],
      href: "/calendar",
      badge: "LIVE",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px] -z-10" />

        <div className="page-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-foreground leading-[1.05] tracking-tight mb-8"
          >
            {t("hero.title_part1")} <br />
            <span className="gradient-text">{t("hero.title_gradient")}</span> <br />
            {t("hero.title_part2")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-foreground/50 text-lg md:text-xl leading-relaxed mb-12 px-4"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <Link href="/ai-assistant" className="btn-primary w-full sm:w-auto px-10 py-4 text-lg shadow-glow">
              <Bot className="w-5 h-5" />
              {t("hero.cta_ai")}
            </Link>
            <Link href="/eligibility" className="btn-gold w-full sm:w-auto px-10 py-4 text-lg">
              <CheckCircle className="w-5 h-5" />
              {t("hero.cta_eligibility")}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-foreground/5 pt-12"
          >
            {[
              { label: "States & UTs Covered", value: 36, suffix: "" },
              { label: "Constituencies", value: 543, suffix: "" },
              { label: "Languages Supported", value: 8, suffix: "" },
              { label: "AI Accuracy", value: 98, suffix: "%" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-1">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-foreground/30 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-background/50">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Everything You Need <br /> To <span className="gradient-text">Vote Smart</span>
              </h2>
              <p className="text-foreground/40 text-lg">
                Comprehensive digital tools to simplify the largest democratic exercise in the world.
              </p>
            </div>
            <Link href="/ai-assistant" className="group flex items-center gap-2 text-indigo-400 font-bold hover:text-foreground transition-colors">
              Explore All Tools <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Link href={f.href} className="group block h-full">
                  <div className="feature-card h-full flex flex-col items-start relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`} />
                    
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="flex items-center justify-between w-full mb-3">
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{f.badge}</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-indigo-500 transition-colors" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-indigo-400 transition-colors">{f.label}</h3>
                    <p className="text-foreground/40 text-sm leading-relaxed mb-6 flex-1">{f.desc}</p>
                    
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      Try Now <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CALL TO ACTION ──────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-indigo-600/10 blur-[120px] -z-10" />
        
        <div className="page-container max-w-4xl">
          <div className="glass-card-strong p-12 text-center relative overflow-hidden border-indigo-500/30">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
            
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Be a <span className="gradient-text">Wise Voter</span> Today
            </h2>
            <p className="text-foreground/50 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of Indian citizens using AI to understand their democratic rights and participate in building the nation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
               <Link href="/ai-assistant" className="btn-primary px-10 py-4 rounded-2xl shadow-glow">
                 Launch Assistant
               </Link>
               <button className="px-10 py-4 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground font-bold hover:bg-foreground/10 transition-all">
                 Read Guides
               </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
