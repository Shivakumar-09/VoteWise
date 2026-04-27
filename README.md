<div align="center">
  <h1>VoteWise AI 🗳️</h1>
  <p><strong>Democracy should be understood in every language.</strong></p>
  <p>India's premier multilingual AI-powered election assistance platform — helping every citizen understand elections, check eligibility, register to vote, find polling booths, compare candidates, and detect fake news.</p>
  
  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&style=for-the-badge)](https://vercel.com)
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&style=for-the-badge)](https://nextjs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?logo=Prisma&logoColor=white&style=for-the-badge)](https://prisma.io/)
</div>

<br />

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🤖 **Multilingual AI Assistant** | Instant, accurate election guidance powered by Google Gemini in **8 Indian languages**. |
| 📍 **Smart Polling Booth Finder** | GPS-enabled map search. Uses the **Haversine formula** to calculate precise distances and travel times to your nearest booth. |
| 🔍 **AI Fake News Detector** | Combat election misinformation. Paste any WhatsApp forward or news snippet, and the AI verifies it against official sources. |
| ✅ **Eligibility Checker** | Real-time voter eligibility verification with personalized next-step guides. |
| ⚖️ **Candidate Comparison** | Unbiased side-by-side comparison of candidates' assets, criminal records, and educational backgrounds. |
| 📅 **Live Election Calendar** | Track critical election dates, polling phases, and results. |
| 📝 **Registration Guide** | Step-by-step documentation for new voter registration, corrections, and address updates. |
| ♿ **Accessibility First** | Designed with high contrast, large typography, and simple navigation for all age groups. |

---

## 🌐 8 Languages Supported
*Our mission is to break the language barrier in civic participation.*
> **English · हिन्दी (Hindi) · తెలుగు (Telugu) · தமிழ் (Tamil) · ಕನ್ನಡ (Kannada) · मराठी (Marathi) · বাংলা (Bengali) · اردو (Urdu)**

---

## 🚀 Extreme Performance Optimizations

VoteWise AI is built to be blazing fast, even on slow mobile networks:
- **Next.js Package Optimization:** Strict barrel-file tree-shaking for `lucide-react` and `framer-motion` via `next.config.ts`, slashing JavaScript bundle sizes.
- **Resource Pre-connections:** `<link rel="preconnect">` tags for Google Fonts and Maps establish early TLS connections, cutting down latency.
- **Lazy Loading & Memory Management:** Heavy elements like Google Maps are strictly lazy-loaded. Database connection pools are memoized globally to prevent PostgreSQL exhaustion during high traffic.
- **Smart Fallbacks:** If the database is unreachable, the system intelligently falls back to simulated dynamic coordinates to ensure the app never crashes.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion
- **Backend**: Next.js API Routes (Serverless) 
- **Database**: PostgreSQL (Render) via Prisma ORM 7 (`@prisma/adapter-pg`)
- **AI Intelligence**: Google Gemini 1.5 Flash (Low latency, high accuracy)

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key

### 1. Clone & Install
```bash
git clone https://github.com/Shivakumar-09/VoteWise.git
cd VoteWise
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key-here"
```

### 3. Database Initialization
```bash
# Push schema to your database
npm run db:push

# Seed the database with official data
npm run db:seed
```

### 4. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## ☁️ One-Click Deployment (Vercel)

This project is fully optimized for Vercel deployment with automated database generation.

1. Push your code to GitHub.
2. Go to [Vercel.com](https://vercel.com) and import the repository.
3. Add the **Environment Variables** (`DATABASE_URL`, `GEMINI_API_KEY`, etc.).
4. Click **Deploy**. 
*(The custom `postinstall: "prisma generate"` script in `package.json` ensures your database connects perfectly during the build phase.)*

---

## 📞 Official Civic Resources
*   **National Voter Helpline**: `1950` (Toll-free)
*   **ECI Official Website**: [eci.gov.in](https://www.eci.gov.in)
*   **Voter Portal**: [voters.eci.gov.in](https://voters.eci.gov.in)

---

## 🏆 Hackathon Context

Built for the **Civic Tech / AI for Public Good** category.
**Mission**: Make democratic participation accessible to every Indian citizen, regardless of language, literacy, or technical ability, while actively combating the spread of election misinformation.

---

## 📄 License & Disclaimer

MIT License — see [LICENSE](LICENSE) file.

> ⚠️ *VoteWise AI is an independent Civic Tech platform and is NOT officially affiliated with the Election Commission of India. Always verify critical election data at official ECI sources.*
