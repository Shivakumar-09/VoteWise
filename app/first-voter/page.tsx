"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

const sections = [
  {
    id: "how-voting-works",
    emoji: "🗳️",
    title: "How Voting Works in India",
    content: [
      {
        heading: "The Voting Process",
        points: [
          "India uses Electronic Voting Machines (EVMs) — simple, tamper-proof devices.",
          "Your constituency determines which candidates appear on your ballot.",
          "You vote for ONE candidate by pressing the button next to their name and party symbol.",
          "A VVPAT slip appears briefly so you can verify your vote was recorded correctly.",
          "Your vote is 100% secret — no one can see who you voted for.",
          "Each voter gets only one vote — enforced by indelible ink on your finger.",
        ],
      },
    ],
  },
  {
    id: "what-to-carry",
    emoji: "🎒",
    title: "What to Carry on Polling Day",
    content: [
      {
        heading: "Accepted Identity Documents (any ONE)",
        points: [
          "Voter ID Card (EPIC) — the primary ID",
          "Aadhaar Card",
          "Passport",
          "PAN Card",
          "Driving License",
          "Bank / Post Office Passbook with photograph",
          "MNREGA Job Card with photograph",
          "MP/MLA/MLC identity cards",
          "Official ID cards issued by Central or State Government",
        ],
      },
    ],
  },
  {
    id: "polling-day-checklist",
    emoji: "📋",
    title: "Polling Day Checklist",
    content: [
      {
        heading: "Before You Go",
        points: [
          "Check your name on the voter list at voterportal.eci.gov.in",
          "Verify your polling booth address and timing (7 AM – 6 PM)",
          "Carry a valid photo ID",
          "Plan your travel — arrive early to avoid long queues",
          "Know which candidate you want to vote for",
        ],
      },
      {
        heading: "At the Booth",
        points: [
          "Join the queue — special queues for elderly and disabled voters",
          "Show your ID to the Presiding Officer at the registration desk",
          "Press the button next to your chosen candidate — wait for the beep",
          "Check the VVPAT slip (visible for 7 seconds) to verify your vote",
          "Walk out — your vote is cast!",
        ],
      },
    ],
  },
  {
    id: "myths-vs-facts",
    emoji: "🔍",
    title: "Myths vs Facts",
    content: [],
    myths: [
      {
        myth: "EVMs can be hacked remotely via Bluetooth or WiFi",
        fact: "EVMs are standalone devices with no network connectivity. They are tested rigorously by ECI before every election.",
      },
      {
        myth: "If I don't vote, my vote is automatically given to a party",
        fact: "Completely false. Unused votes are simply not counted. No party benefits from votes not cast.",
      },
      {
        myth: "NOTA means the election will be re-held if NOTA wins",
        fact: "NOTA only registers your dissatisfaction. Even if NOTA gets the most votes, the candidate with the second-highest votes wins.",
      },
      {
        myth: "You need Voter ID specifically — no other ID works",
        fact: "ECI accepts 12 alternative photo IDs including Aadhaar, Passport, PAN Card, Driving License, and more.",
      },
    ],
  },
];

export default function FirstVoterPage() {
  const [openSection, setOpenSection] = useState<string>("how-voting-works");

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-24 pb-16">
      <div className="page-container max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="section-heading text-white mb-3">
            First Time <span className="gradient-text">Voter Guide</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Everything you need to know before you cast your very first vote.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setOpenSection(sec.id)}
              className={`p-3 rounded-xl text-center transition-all ${
                openSection === sec.id
                  ? "bg-indigo-600/20 border border-indigo-500/50 text-white"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="text-2xl mb-1">{sec.emoji}</div>
              <p className="text-xs font-medium leading-tight">{sec.title.split(" ").slice(0, 3).join(" ")}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              layout
              className={`rounded-2xl border overflow-hidden ${
                openSection === section.id
                  ? "border-indigo-500/40 bg-indigo-600/5"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <button
                onClick={() => setOpenSection(openSection === section.id ? "" : section.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.emoji}</span>
                  <h2 className="text-white font-bold text-base">{section.title}</h2>
                </div>
                {openSection === section.id ? (
                  <ChevronDown className="w-5 h-5 text-white/50 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0" />
                )}
              </button>

              {openSection === section.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 pb-6 space-y-6"
                >
                  {section.content.map((block, bi) => (
                    <div key={bi}>
                      <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">
                        {block.heading}
                      </h3>
                      <ul className="space-y-2">
                        {block.points.map((point, pi) => (
                          <li key={pi} className="flex items-start gap-2.5 text-white/70 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {"myths" in section && section.myths && (
                    <div className="space-y-4">
                      {section.myths.map((item, i) => (
                        <div key={i} className="rounded-xl overflow-hidden">
                          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-t-xl">
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-red-300 text-xs font-bold uppercase tracking-wide mb-1">Myth</p>
                              <p className="text-white/80 text-sm">{item.myth}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 border-t-0 rounded-b-xl">
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-green-300 text-xs font-bold uppercase tracking-wide mb-1">Fact</p>
                              <p className="text-white/80 text-sm">{item.fact}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-center">
          <p className="text-2xl mb-2">🗳️</p>
          <h3 className="text-white font-bold text-lg mb-2">Ready to Vote!</h3>
          <p className="text-white/60 text-sm mb-4">Still have questions? Our AI assistant answers in your language.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/ai-assistant" className="btn-primary">🤖 Ask AI Assistant</a>
            <a href="/eligibility" className="btn-secondary border-white/20 text-white">Check My Eligibility</a>
          </div>
        </div>
      </div>
    </div>
  );
}
