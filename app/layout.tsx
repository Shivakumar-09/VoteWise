import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoteWise AI — Democracy Should Be Understood in Every Language",
  description:
    "India's premier multilingual AI-powered election assistance platform. Check eligibility, find polling booths, compare candidates, detect fake news, and get instant civic help in 8 languages.",
  keywords: [
    "election",
    "voting",
    "India",
    "voter registration",
    "polling booth",
    "ECI",
    "multilingual",
    "AI",
    "civic tech",
  ],
  authors: [{ name: "VoteWise AI Team" }],
  openGraph: {
    title: "VoteWise AI — Democracy Should Be Understood in Every Language",
    description:
      "Multilingual AI-powered election assistance for every Indian citizen.",
    type: "website",
    locale: "en_IN",
    siteName: "VoteWise AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoteWise AI",
    description:
      "Multilingual AI-powered election assistance for every Indian citizen.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { LanguageProvider } from "@/components/LanguageProvider";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} bg-[#0A0E27]`}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

