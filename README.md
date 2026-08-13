# Nduthi Festival & Awards Kenya — Digital Voting Platform

A full-stack scaffold for the Nduthi Festival & Awards Kenya voting system, built from
the attached Technical Implementation Document (TID v1.2) and the provided UI
references (landing page, categories page, admin dashboard).

```
nduthi-festival/
  frontend/   React + TypeScript + Vite + Tailwind — public site (landing page fully built)
  backend/    Node.js + TypeScript + Express + Prisma (PostgreSQL) + Socket.IO — API
```

## What's included in this first drop

- **Landing page** — fully built and pixel-matched to the reference design: hero with
  live festival countdown, stats bar, live results grid, browse categories + overall
  leaderboard, how-to-vote steps, sponsors strip, news + "vote counts" CTA, newsletter,
  full header/footer. Brand colors (`#0B8E36` green, `#D61F26` red, `#F5C542` gold) are
  wired into Tailwind exactly as specified in the TID.
- **Categories page** — matches the reference categories screenshot (filter sidebar,
  category rows with vote totals and trend %, "About Categories" and "Every Vote
  Counts" side panels).
- **Backend API** — complete Prisma schema for every entity in TID Section 6, JWT
  auth, the full payment → login → vote → live broadcast workflow (Section 8), and
  route scaffolding for every module in Section 3 (categories, nominees, votes,
  payments, sponsors, news, gallery, events, analytics).
- Placeholder pages (with working navigation) for every other route mentioned in the
  TID — Nominees, Live Results, Sponsors, News, Gallery, Contact, Login, Register —
  so the site is fully click-through today while those pages get built out next.

## Running it locally

**Backend**
```bash
cd backend
cp .env.example .env   # set DATABASE_URL, JWT secrets, etc.
npm install
npm run prisma:migrate
npm run seed
npm run dev             # http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

The frontend's Vite dev server proxies `/api` to `http://localhost:5000`, so once
both are running the site is ready to swap the mock data in `frontend/src/data/mockData.ts`
for real calls via `frontend/src/lib/api.ts`.

## What's next (natural follow-ups, not yet built)

1. Category Voting Page — nominee cards with the compact motorcycle/number-plate
   thumbnail exactly as specified in TID Section 3, wired to `GET /api/categories/:slug`.
2. Payment flow UI (M-Pesa/Airtel/card) + login/register forms wired to the backend's
   `/api/payments` and `/api/auth` routes.
3. Real-time leaderboard updates on the frontend via `frontend/src/lib/socket.ts`
   (the backend already broadcasts `vote:cast` on every successful vote).
4. Admin dashboard UI matching the reference screenshot, backed by `/api/analytics`.
5. Cloudinary image upload wiring for motorcycle photos / number plates.

Let me know which of these you'd like built out next and I'll continue directly from
this scaffold.
