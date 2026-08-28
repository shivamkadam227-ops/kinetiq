# KinetiQ — AI-Powered Simulation Engine

> Transform any scientific or technical concept into a dynamic, interactive visual simulation — powered by Google Gemini AI.

![Tech Stack](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) ![Express](https://img.shields.io/badge/Express-000?style=flat-square&logo=express) ![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google) ![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk)

## Architecture

```
kinetiq/
├── frontend/          # Next.js 15 + TailwindCSS + Clerk
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js      # ClerkProvider wrapper
│   │   │   ├── page.js        # Main UI (hero, search, iframe sandbox)
│   │   │   └── globals.css    # Premium dark theme + animations
│   │   └── middleware.js      # Clerk route protection
│   └── .env.local             # Frontend env vars
├── backend/           # Express + Clerk + Gemini
│   ├── server.js              # API server with /api/simulate endpoint
│   └── .env                   # Backend env vars
└── README.md
```

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A [Clerk](https://clerk.com) account (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key

## Setup

### 1. Get your API keys

| Key | Where to get it | File |
|-----|-----------------|------|
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys | `backend/.env` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys | `frontend/.env.local` |
| `GEMINI_API_KEY` | Google AI Studio → Get API Key | `backend/.env` |

### 2. Configure environment variables

**Backend** (`backend/.env`):
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Start the servers

Open **two terminals** from the `kinetiq` root:

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Open the app

Navigate to [http://localhost:3000](http://localhost:3000). Sign in with Clerk, then type any concept to generate a simulation.

## Example Queries

| Concept | Library Used |
|---------|-------------|
| "Interactive 3D solar system" | Three.js |
| "Newton's cradle physics" | Matter.js |
| "Binary search tree visualization" | D3.js |
| "Conway's Game of Life" | p5.js |
| "Double pendulum chaos" | Matter.js / Canvas |
| "Wave interference patterns" | p5.js / Canvas |

## How It Works

1. User types a scientific/technical concept
2. Frontend sends the query + Clerk auth token to the Express backend
3. Backend validates the token via Clerk middleware
4. Gemini AI generates self-contained HTML/CSS/JS simulation code
5. The raw HTML is injected into a sandboxed `<iframe>` via `srcDoc`
6. The simulation runs interactively in the browser

## License

MIT