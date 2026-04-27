"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, ChevronDown, Award, Briefcase, BookOpen, Scale } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  party: string;
  partyShort?: string;
  symbol?: string;
  constituency: string;
  state: string;
  education?: string;
  assets?: string;
  liabilities?: string;
  criminalCases: number;
  experience?: string;
  age?: number;
  gender?: string;
  election: { title: string; type: string };
}

const elections = [
  { id: "lok-2024", label: "Lok Sabha 2024", dbId: "" },
  { id: "tel-2023", label: "Telangana Assembly 2023", dbId: "" },
];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [electionFilter, setElectionFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (electionFilter) params.append("electionId", electionFilter);

    fetch(`/api/candidates?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCandidates(data.candidates || []);
        setSelected([]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [electionFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const compareList = candidates.filter((c) => selected.includes(c.id));

  const fields = [
    { key: "party", label: "Party", icon: Award },
    { key: "constituency", label: "Constituency", icon: Scale },
    { key: "age", label: "Age", icon: Users },
    { key: "education", label: "Education", icon: BookOpen },
    { key: "experience", label: "Experience", icon: Briefcase },
    { key: "assets", label: "Declared Assets", icon: Scale },
    { key: "liabilities", label: "Liabilities", icon: Scale },
    { key: "criminalCases", label: "Criminal Cases", icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-24 pb-16">
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="section-heading text-white mb-3">
            Candidate <span className="gradient-text">Comparison</span>
          </h1>
          <p className="text-white/60">
            Select up to 3 candidates for a side-by-side comparison.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <select
            value={electionFilter}
            onChange={(e) => setElectionFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">All elections</option>
            {elections.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
          {selected.length > 0 && (
            <span className="badge badge-indigo">
              {selected.length} selected (max 3)
            </span>
          )}
        </div>

        {/* Candidate selection */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card p-5 animate-pulse h-40" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {candidates.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => toggleSelect(c.id)}
                className={`text-left glass-card p-5 transition-all ${
                  selected.includes(c.id)
                    ? "border-indigo-500 bg-indigo-600/10 shadow-glow"
                    : "hover:border-white/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="text-2xl mb-1">{c.symbol || "🏛️"}</div>
                    <h3 className="text-white font-bold text-base">{c.name}</h3>
                    <p className="text-white/60 text-xs">
                      {c.partyShort || c.party} · {c.constituency}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      selected.includes(c.id)
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-white/30"
                    }`}
                  >
                    {selected.includes(c.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="badge badge-indigo text-xs">{c.state}</span>
                  {c.criminalCases > 0 && (
                    <span className="badge badge-red text-xs">{c.criminalCases} case{c.criminalCases > 1 ? "s" : ""}</span>
                  )}
                  {c.age && (
                    <span className="badge badge-yellow text-xs">Age {c.age}</span>
                  )}
                </div>
              </motion.button>
            ))}

            {candidates.length === 0 && (
              <div className="col-span-3 text-center py-16 text-white/40">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No candidates found. Try a different filter or run the database seed.</p>
              </div>
            )}
          </div>
        )}

        {/* Comparison table */}
        {compareList.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-strong overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/50 text-sm font-medium w-36">Field</th>
                  {compareList.map((c) => (
                    <th key={c.id} className="text-left p-4">
                      <div className="text-2xl mb-1">{c.symbol || "🏛️"}</div>
                      <p className="text-white font-bold text-base">{c.name}</p>
                      <p className="text-white/50 text-xs">{c.party}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map(({ key, label }) => (
                  <tr key={key} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/50 text-sm">{label}</td>
                    {compareList.map((c) => {
                      const val = c[key as keyof Candidate];
                      const display = val !== null && val !== undefined ? String(val) : "—";
                      return (
                        <td key={c.id} className="p-4 text-white text-sm">
                          {key === "criminalCases" ? (
                            <span
                              className={`badge text-xs ${
                                Number(val) === 0 ? "badge-green" : "badge-red"
                              }`}
                            >
                              {Number(val) === 0 ? "✓ None" : `⚠ ${val} case(s)`}
                            </span>
                          ) : (
                            display
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-white/30 text-xs p-4 border-t border-white/10">
              Data sourced from affidavits filed with Election Commission of India. Always verify at eci.gov.in.
            </p>
          </motion.div>
        )}

        {selected.length === 1 && (
          <div className="text-center text-white/40 text-sm mt-4">
            Select 1 more candidate to start comparing
          </div>
        )}
      </div>
    </div>
  );
}
