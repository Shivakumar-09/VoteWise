# VoteWise AI 🗳️

> **Democracy should be understood in every language.**

India's premier multilingual AI-powered election assistance platform — helping every citizen understand elections, check eligibility, register to vote, find polling booths, compare candidates, and detect fake news.

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Assistant** | Multilingual chat powered by Google Gemini — answers election questions in 8 Indian languages |
| ✅ **Eligibility Checker** | Instant voter eligibility verification with personalized next steps |
| 📍 **Polling Booth Finder** | Find your nearest booth by state, district, or PIN code |
| 📅 **Election Calendar** | Track elections with polling dates, deadlines, and results |
| ⚖️ **Candidate Comparison** | Side-by-side comparison of candidates' assets, cases, education |
| 🔍 **Fake News Detector** | AI-powered verification of election claims against official sources |
| 📝 **Registration Guide** | Step-by-step guides for new registration, corrections, updates |
| 🗳️ **First Time Voter Guide** | Everything first-time voters need to know |
| ♿ **Accessibility Mode** | Large text, high contrast, voice mode, keyboard navigation |

## 🌐 Languages Supported

English · हिन्दी · తెలుగు · தமிழ் · ಕನ್ನಡ · मराठी · বাংলা · اردو

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router) · TypeScript · Tailwind CSS · Framer Motion
- **Backend**: Next.js API Routes · Server Actions
- **Database**: PostgreSQL (Render) via Prisma ORM
- **AI**: Google Gemini 1.5 Flash
- **Deployment**: Vercel (frontend + API) · Render (PostgreSQL)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL database (local or Render)
- Google Gemini API key

### 1. Clone & Install

```bash
git clone https://github.com/your-username/votewise-ai.git
cd votewise-ai
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment

### Vercel (Frontend + Backend)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repository
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
4. Click **Deploy**

### Render PostgreSQL (Database)

1. Go to [render.com](https://render.com) → **New** → **PostgreSQL**
2. Choose the **Free** tier (90 days) or **Starter** plan
3. Set a name: `votewise-db`
4. After creation, copy the **External Database URL**
5. Paste it as `DATABASE_URL` in your Vercel environment variables
6. Run migrations: `npm run db:push` (from local with the Render URL)
7. Seed data: `npm run db:seed`

### Getting a Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API Key**
4. Copy and add to your environment variables

---

## 📁 Project Structure

```
votewise-ai/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── ai-assistant/       # Multilingual AI chat
│   ├── eligibility/        # Voter eligibility checker
│   ├── registration/       # Registration guide
│   ├── calendar/           # Election calendar
│   ├── booth-finder/       # Polling booth finder
│   ├── candidates/         # Candidate comparison
│   ├── fake-news/          # Fake news detector
│   ├── first-voter/        # First time voter guide
│   ├── accessibility/      # Accessibility settings
│   └── api/                # API routes
├── components/             # Reusable React components
├── lib/                    # Utility libraries
│   ├── prisma.ts           # Database client
│   ├── gemini.ts           # AI helper
│   └── utils.ts            # Shared utilities
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data
└── public/                 # Static assets (SVG only)
```

---

## 🔒 Security

- All AI inputs are sanitized and length-limited
- API keys stored in environment variables only
- Input validation on all API routes
- No sensitive data stored in client-side code
- Rate limiting ready (add middleware for production)

---

## 📞 Official Resources

- **National Voter Helpline**: 1950 (Toll-free)
- **ECI Website**: [eci.gov.in](https://www.eci.gov.in)
- **Voter Portal**: [voterportal.eci.gov.in](https://voterportal.eci.gov.in)
- **Voter Helpline App**: Available on Android & iOS

---

## 🏆 Hackathon

Built for **Election Process Education / Civic Tech / AI for Public Good** category.

**Mission**: Make democratic participation accessible to every Indian citizen, regardless of language, literacy, or technical ability.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file.

---

> *VoteWise AI is not affiliated with the Election Commission of India. Always verify information at official ECI sources.*
