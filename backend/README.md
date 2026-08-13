# Nduthi Festival & Awards Kenya — Backend API

Node.js + TypeScript + Express + Prisma (PostgreSQL) + Socket.IO backend for the
Nduthi Festival & Awards Kenya digital voting platform, built from the Technical
Implementation Document (TID) v1.2.

> The TID recommends NestJS. This scaffold uses **Express + TypeScript** organized
> into NestJS-style modules (routes/controller/service per feature) so it is
> quick to run today, and straightforward to port to NestJS later if you want
> decorators/DI — the module boundaries already match.

## Stack

- Node.js, TypeScript, Express
- PostgreSQL via Prisma ORM
- Socket.IO for real-time leaderboard/vote updates
- JWT auth (access + refresh tokens), bcrypt password hashing
- Helmet, CORS, rate limiting, input validation-ready (zod/express-validator)
- M-Pesa STK Push scaffold (Daraja API) — Airtel Money / card providers follow the same pattern

## Getting started

```bash
cd backend
cp .env.example .env      # fill in your real DB/JWT/M-Pesa values
npm install
npm run prisma:migrate    # creates tables from prisma/schema.prisma
npm run seed               # seeds roles, a super admin, and the 6 award categories
npm run dev                # starts the API on http://localhost:5000
```

Default seeded admin: `admin@nduthiawards.co.ke` / `ChangeMe123!` — change this immediately.

## Folder structure

```
src/
  config/         env loader, Prisma client singleton
  middleware/     auth (JWT), error handling
  modules/        one folder per feature — auth, categories, nominees,
                  votes, payments, sponsors, news, gallery, events, analytics
  sockets/        Socket.IO server + broadcast helper
  utils/          logger, JWT helpers, AppError, response helpers
  app.ts          Express app + middleware pipeline
  server.ts       HTTP server + Socket.IO bootstrap
prisma/
  schema.prisma   full data model (Section 6 of the TID)
  seed.ts         roles + categories + admin seed data
```

## Voting workflow (matches TID Section 8)

1. `POST /api/payments/initiate` — user picks a nominee, payment record created (`PENDING`), M-Pesa STK push triggered.
2. `POST /api/payments/mpesa/callback` — Safaricom confirms the transaction; payment marked `SUCCESS`/`FAILED`.
3. User logs in / registers (`POST /api/auth/login` or `/register`) if not already.
4. `POST /api/votes` — vote is only accepted if the payment is `SUCCESS` and hasn't already been used (one payment = one vote, duplicate prevention enforced in `votes.service.ts`).
5. On success, the API broadcasts `vote:cast` over Socket.IO so every connected client updates leaderboards instantly, no refresh needed.

## Public vs. authenticated routes

Per the TID, **browsing is always public** — categories, nominees, and live leaderboards
require no login. Only payment initiation and vote casting require a JWT. Admin-only
routes (creating categories/nominees/sponsors/news, analytics summary) require the
`SUPER_ADMIN` role.

## Still to wire up before production

- Real Daraja OAuth + STK push request/response handling in `mpesa.service.ts`
- Airtel Money and card (Visa/Mastercard) provider integrations in `payments.service.ts`
- Cloudinary upload endpoints for motorcycle/number-plate/nominee images
- Email sending (verification, password reset) via `nodemailer`
- CAPTCHA on register/login, audit log writes, webhook signature validation
