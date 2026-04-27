"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";

const registrationTypes = [
  {
    id: "new",
    title: "New Registration",
    emoji: "🆕",
    description: "First-time voter registering for a Voter ID card",
    form: "Form 6",
    documents: [
      "Proof of Age: Aadhaar Card / Birth Certificate / School Leaving Certificate / Passport",
      "Proof of Address: Aadhaar / Utility Bill / Bank Statement / Rental Agreement",
      "Recent passport-size photograph (2 copies)",
      "PAN Card (if available)",
    ],
    steps: [
      "Visit voterportal.eci.gov.in or download the Voter Helpline App",
      "Click on 'New Registration' and select Form 6",
      "Fill in your personal details: name, date of birth, address, constituency",
      "Upload scanned copies of required documents",
      "Submit the form and note down your reference number",
      "Track application status on the portal",
      "Your Voter ID (EPIC card) will be delivered to your address within 30 days",
    ],
    note: "You can also register offline at your nearest Electoral Registration Office (ERO).",
  },
  {
    id: "name",
    title: "Name Correction",
    emoji: "✏️",
    description: "Correct spelling or update name due to marriage/legal change",
    form: "Form 8",
    documents: [
      "Existing Voter ID / EPIC card",
      "Government ID with correct name (Aadhaar / PAN / Passport)",
      "Marriage Certificate (if name changed after marriage)",
      "Affidavit for other name corrections (if applicable)",
    ],
    steps: [
      "Log in to voterportal.eci.gov.in using your registered mobile number",
      "Go to 'Correction of Entries in Electoral Roll'",
      "Select Form 8 and enter your existing Voter ID details",
      "Specify the correction: select 'Name' as the field to correct",
      "Enter the corrected name and upload supporting documents",
      "Submit and track your application status",
      "Correction will be reflected in the next supplementary electoral roll",
    ],
    note: "Name corrections are processed within 30-45 working days.",
  },
  {
    id: "address",
    title: "Address Update",
    emoji: "🏠",
    description: "Update your address if you moved within or across constituencies",
    form: "Form 8A (same constituency) / Form 6 (new constituency)",
    documents: [
      "Existing Voter ID / EPIC card",
      "New address proof: Aadhaar / Utility Bill (last 3 months) / Bank Statement",
      "Passport-size photograph",
    ],
    steps: [
      "Determine if you moved within the same constituency or to a new one",
      "For same constituency: Use Form 8A on voterportal.eci.gov.in",
      "For new constituency: Fill Form 6 as a fresh registration",
      "Fill in new address details completely with PIN code",
      "Upload valid address proof document",
      "Your old voter registration will be automatically cancelled upon approval",
      "New voter ID reflecting new address will be issued",
    ],
    note: "You must update your address before the electoral roll revision deadline.",
  },
  {
    id: "duplicate",
    title: "Duplicate Voter ID",
    emoji: "🔄",
    description: "Get a replacement if your Voter ID is lost, damaged, or stolen",
    form: "Form 002",
    documents: [
      "FIR copy (if Voter ID is stolen — mandatory)",
      "Self-declaration / Affidavit for lost card",
      "Aadhaar or other identity proof",
      "Recent passport-size photograph",
    ],
    steps: [
      "If stolen: File an FIR at the nearest police station and keep a copy",
      "Visit voterportal.eci.gov.in → 'Related Service' → 'Replacement of EPIC'",
      "Fill Form 002 with your Voter ID number (or Aadhaar if ID lost)",
      "Upload FIR copy (for theft) or self-declaration affidavit (for loss)",
      "Pay the applicable fee (usually nominal/free depending on state)",
      "Collect the duplicate EPIC from ERO office or get it delivered",
    ],
    note: "You can download a digital copy of your Voter ID from DigiLocker instantly.",
  },
];

export default function RegistrationPage() {
  const [open, setOpen] = useState<string>("new");

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-24 pb-16">
      <div className="page-container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="section-heading text-white mb-3">
            Registration <span className="gradient-text">Guide</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Step-by-step guidance for every type of voter registration —
            new voters, corrections, address changes, and more.
          </p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {registrationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setOpen(type.id)}
              className={`p-3 rounded-xl text-center transition-all ${
                open === type.id
                  ? "bg-indigo-600/20 border border-indigo-500/50 text-white"
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="text-2xl mb-1">{type.emoji}</div>
              <p className="text-xs font-medium leading-tight">{type.title}</p>
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {registrationTypes.map((type) => (
            <motion.div
              key={type.id}
              layout
              className={`rounded-2xl border overflow-hidden transition-colors ${
                open === type.id
                  ? "border-indigo-500/40 bg-indigo-600/5"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => setOpen(open === type.id ? "" : type.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.emoji}</span>
                  <div>
                    <h2 className="text-white font-bold text-base">{type.title}</h2>
                    <p className="text-white/50 text-sm">{type.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="badge badge-indigo text-xs hidden sm:flex">{type.form}</span>
                  {open === type.id ? (
                    <ChevronDown className="w-5 h-5 text-white/50" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-white/50" />
                  )}
                </div>
              </button>

              {/* Accordion Body */}
              <AnimatePresence initial={false}>
                {open === type.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 space-y-6">
                      {/* Form label */}
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span className="text-indigo-300 text-sm font-semibold">
                          Required Form: {type.form}
                        </span>
                      </div>

                      {/* Documents */}
                      <div>
                        <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">
                          📄 Documents Required
                        </h3>
                        <ul className="space-y-2">
                          {type.documents.map((doc, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-white/70 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Steps */}
                      <div>
                        <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">
                          🪜 Step-by-Step Process
                        </h3>
                        <ol className="space-y-3">
                          {type.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Note */}
                      {type.note && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-start gap-2">
                          <span className="flex-shrink-0">💡</span>
                          {type.note}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 p-6 rounded-2xl glass-card-strong text-center">
          <p className="text-white/70 text-sm mb-4">
            Ready to register? Visit the official Voter Portal:
          </p>
          <a
            href="https://voterportal.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            <ExternalLink className="w-4 h-4" />
            Open Voter Portal (ECI)
          </a>
          <p className="text-white/30 text-xs mt-4">
            Or call National Voter Helpline: <strong className="text-white/50">1950</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
