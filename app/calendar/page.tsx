"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";

const elections = [
  {
    id: 1,
    title: "West Bengal Assembly Election 2026",
    type: "STATE_ASSEMBLY",
    state: "West Bengal",
    status: "UPCOMING",
    pollingDate: "April - May 2026",
    resultDate: "May 2026",
    deadline: "March 2026",
    description: "294 constituencies across West Bengal",
    phases: 8,
  },
  {
    id: 2,
    title: "Tamil Nadu Assembly Election 2026",
    type: "STATE_ASSEMBLY",
    state: "Tamil Nadu",
    status: "UPCOMING",
    pollingDate: "April 2026",
    resultDate: "May 2026",
    deadline: "March 2026",
    description: "234 constituencies in Tamil Nadu",
    phases: 1,
  },
  {
    id: 3,
    title: "Kerala Assembly Election 2026",
    type: "STATE_ASSEMBLY",
    state: "Kerala",
    status: "UPCOMING",
    pollingDate: "April 2026",
    resultDate: "May 2026",
    deadline: "March 2026",
    description: "140 constituencies in Kerala",
    phases: 1,
  },
  {
    id: 4,
    title: "Assam Assembly Election 2026",
    type: "STATE_ASSEMBLY",
    state: "Assam",
    status: "UPCOMING",
    pollingDate: "April 2026",
    resultDate: "May 2026",
    deadline: "March 2026",
    description: "126 constituencies in Assam",
    phases: 3,
  },
  {
    id: 5,
    title: "Uttar Pradesh Assembly Election 2027",
    type: "STATE_ASSEMBLY",
    state: "Uttar Pradesh",
    status: "UPCOMING",
    pollingDate: "February - March 2027",
    resultDate: "March 2027",
    deadline: "January 2027",
    description: "403 constituencies across Uttar Pradesh",
    phases: 7,
  },
  {
    id: 6,
    title: "Punjab Assembly Election 2027",
    type: "STATE_ASSEMBLY",
    state: "Punjab",
    status: "UPCOMING",
    pollingDate: "February 2027",
    resultDate: "March 2027",
    deadline: "January 2027",
    description: "117 constituencies in Punjab",
    phases: 1,
  },
  {
    id: 7,
    title: "Lok Sabha General Election 2024",
    type: "GENERAL",
    state: "National",
    status: "COMPLETED",
    pollingDate: "April 19 – June 1, 2024",
    resultDate: "June 4, 2024",
    deadline: "March 12, 2024",
    description: "543 constituencies across India",
    phases: 7,
  },
  {
    id: 8,
    title: "Bihar Assembly Election 2025",
    type: "STATE_ASSEMBLY",
    state: "Bihar",
    status: "COMPLETED",
    pollingDate: "October 2025",
    resultDate: "November 2025",
    deadline: "September 2025",
    description: "243 constituencies in Bihar",
    phases: 3,
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  UPCOMING: { label: "Upcoming", className: "badge-yellow" },
  ONGOING: { label: "Ongoing", className: "badge-green" },
  COMPLETED: { label: "Completed", className: "badge-indigo" },
  POSTPONED: { label: "Postponed", className: "badge-red" },
};

const typeConfig: Record<string, { label: string; emoji: string }> = {
  GENERAL: { label: "General (Lok Sabha)", emoji: "🏛️" },
  STATE_ASSEMBLY: { label: "State Assembly", emoji: "🏢" },
  LOCAL_BODY: { label: "Local Body", emoji: "🏘️" },
  BY_ELECTION: { label: "By-Election", emoji: "📋" },
  RAJYA_SABHA: { label: "Rajya Sabha", emoji: "⚖️" },
};

export default function CalendarPage() {
  const [selectedState, setSelectedState] = useState("All");
  const states = ["All", ...new Set(elections.map((e) => e.state))].sort();

  const filteredElections = selectedState === "All" 
    ? elections 
    : elections.filter((e) => e.state === selectedState);

  const upcoming = filteredElections.filter((e) => e.status === "UPCOMING");
  const past = filteredElections.filter((e) => e.status !== "UPCOMING");

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 transition-colors duration-300">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 mb-6 shadow-lg shadow-amber-500/20">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="section-heading text-foreground mb-3">
            Election <span className="gradient-text">Calendar</span>
          </h1>
          <p className="text-foreground/60 max-w-lg mx-auto">
            Track national, state, and local elections with important dates and deadlines across India.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold text-foreground/70 uppercase tracking-wider">Filter by State</span>
          </div>
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="input-field max-w-[240px] !py-2 shadow-sm"
          >
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-foreground font-bold text-xl mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              Upcoming Elections
            </h2>
            <div className="space-y-6">
              {upcoming.map((election, i) => (
                <motion.div
                  key={election.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card-strong p-8 border-l-4 border-[#F59E0B] hover:shadow-xl transition-shadow"
                >
                  <ElectionCard election={election} />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          selectedState !== "All" && (
            <div className="mb-12 text-center p-12 glass-card opacity-60">
              <p className="text-foreground/50">No upcoming elections found for {selectedState}.</p>
            </div>
          )
        )}

        {/* Reminder banner */}
        <div className="mb-12 p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-foreground/70 text-sm leading-relaxed">
            <strong className="text-foreground font-bold">Registration Tip:</strong> Check your
            voter registration status at least 2 months before election day.
            Visit{" "}
            <a href="https://voterportal.eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline transition-all">
              voterportal.eci.gov.in
            </a>{" "}
            or call <strong className="text-foreground font-bold">1950</strong>.
          </p>
        </div>

        {/* Past Elections */}
        {past.length > 0 && (
          <div>
            <h2 className="text-foreground font-bold text-xl mb-6">Recent Elections</h2>
            <div className="space-y-4">
              {past.map((election, i) => (
                <motion.div
                  key={election.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-6 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <ElectionCard election={election} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ElectionCard({ election }: { election: typeof elections[0] }) {
  const status = statusConfig[election.status];
  const type = typeConfig[election.type];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{type.emoji}</span>
            <span className="text-foreground/40 text-xs font-bold uppercase tracking-wider">{type.label}</span>
          </div>
          <h3 className="text-foreground font-bold text-2xl group-hover:text-indigo-600 transition-colors">{election.title}</h3>
          <p className="text-foreground/50 text-sm mt-1 leading-relaxed">{election.description}</p>
        </div>
        <span className={`badge ${status.className} !px-4 !py-1.5 shadow-sm`}>{status.label}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/5 group-hover:border-indigo-500/20 transition-all">
          <p className="text-foreground/40 text-xs mb-2 flex items-center gap-1.5 font-bold uppercase tracking-tight">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Registration Deadline
          </p>
          <p className="text-foreground text-sm font-bold">{election.deadline}</p>
        </div>
        <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/5 group-hover:border-indigo-500/20 transition-all">
          <p className="text-foreground/40 text-xs mb-2 flex items-center gap-1.5 font-bold uppercase tracking-tight">
            <Calendar className="w-3.5 h-3.5 text-amber-400" /> Polling Date
          </p>
          <p className="text-foreground text-sm font-bold">{election.pollingDate}</p>
        </div>
        <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/5 group-hover:border-indigo-500/20 transition-all">
          <p className="text-foreground/40 text-xs mb-2 flex items-center gap-1.5 font-bold uppercase tracking-tight">
            <MapPin className="w-3.5 h-3.5 text-rose-400" /> Results
          </p>
          <p className="text-foreground text-sm font-bold">{election.resultDate}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-foreground/5 flex items-center gap-3">
        <span className="px-2.5 py-1 rounded-lg bg-foreground/5 text-foreground/50 text-[10px] font-black uppercase tracking-widest">{election.phases} Phase{election.phases > 1 ? "s" : ""}</span>
        <span className="text-foreground/10 text-xl font-thin">|</span>
        <span className="px-2.5 py-1 rounded-lg bg-indigo-600/5 text-indigo-600/70 text-[10px] font-black uppercase tracking-widest">{election.state}</span>
      </div>
    </div>
  );
}
