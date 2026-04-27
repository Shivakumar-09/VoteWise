import Link from "next/link";
import { Vote, Phone, Globe, Heart } from "lucide-react";

const footerLinks = {
  Tools: [
    { label: "AI Assistant", href: "/ai-assistant" },
    { label: "Eligibility Checker", href: "/eligibility" },
    { label: "Booth Finder", href: "/booth-finder" },
    { label: "Fake News Detector", href: "/fake-news" },
  ],
  Elections: [
    { label: "Election Calendar", href: "/calendar" },
    { label: "Candidate Compare", href: "/candidates" },
    { label: "Registration Guide", href: "/registration" },
  ],
  Resources: [
    { label: "First Time Voter", href: "/first-voter" },
    { label: "Accessibility Mode", href: "/accessibility" },
    { label: "ECI Website", href: "https://www.eci.gov.in" },
    { label: "Voter Portal", href: "https://voterportal.eci.gov.in" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#060918] border-t border-white/10 pt-16 pb-8">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-gradient flex items-center justify-center">
                <Vote className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Vote<span className="text-[#F59E0B]">Wise</span> AI
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Democracy should be understood in every language. Empowering
              Indian citizens with multilingual election intelligence.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-[#F59E0B] font-semibold text-sm mb-1">
                <Phone className="w-4 h-4" />
                National Voter Helpline
              </div>
              <p className="text-white text-2xl font-bold font-heading">1950</p>
              <p className="text-white/40 text-xs mt-0.5">Toll-free · 24×7</p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white text-sm transition-colors"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["English", "हिन्दी", "తెలుగు", "தமிழ்", "ಕನ್ನಡ", "मराठी", "বাংলা", "اردو"].map(
            (lang) => (
              <span
                key={lang}
                className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/60"
              >
                {lang}
              </span>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Built for Bharat &nbsp;·&nbsp; Not affiliated with ECI
          </p>
          <p className="text-white/30 text-sm flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-400" /> for
            democracy · © 2025 VoteWise AI
          </p>
        </div>
      </div>
    </footer>
  );
}
