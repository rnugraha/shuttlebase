# Shuttlebase

Badminton club membership management system. Fastify backend + React frontend.

## Structure

```
backend/   Node.js + Fastify + Prisma 7 + PostgreSQL
frontend/  React 19 + Vite + Tailwind CSS + shadcn/ui
bruno/     API collections for manual testing
```

## Running locally

```bash
# Backend (from backend/)
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, FRONTEND_URL
pnpm dev               # starts on port 3000

# Frontend (from frontend/)
cp .env.example .env   # set VITE_API_URL=http://localhost:3000
pnpm dev               # starts on port 5173
```

## Environment variables

**Backend** (`backend/.env`):
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — secret for signing JWTs
- `FRONTEND_URL` — allowed CORS origin (e.g. `http://localhost:5173`)
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — used by seed script only

**Frontend** (`frontend/.env`):
- `VITE_API_URL` — backend base URL

## Prisma 7 quirks

- `url` is NOT in `prisma/schema.prisma` — it lives in `prisma.config.ts`
- Runtime requires `@prisma/adapter-pg` driver adapter — see `src/lib/prisma.ts`
- After schema changes: `npx prisma migrate dev --name <description>`
- `prisma generate` runs automatically via `postinstall` script on deploy
- Generated client output path: `src/generated/prisma/`

## Database

```bash
# From backend/
npx prisma migrate dev     # apply migrations
npx prisma migrate deploy  # production (Railway runs this manually)
npx prisma db seed         # seed admin + 10 members
npx prisma studio          # browse data
```

## Tests

```bash
# From backend/
pnpm test   # runs vitest against real DB (requires DATABASE_URL in .env)
```

Tests use Fastify `inject()` — no mocking. Each test cleans up after itself.

## Deployment

- **Backend** → Railway. Port comes from `process.env.PORT` (Railway injects 8080). Railway networking must be set to port 8080.
- **Frontend** → Vercel. Set root directory to `frontend`, add `VITE_API_URL` env var pointing to Railway URL.
- After deploying backend, update `FRONTEND_URL` in Railway to match Vercel URL (required for CORS).

## Linting

Biome is configured at the workspace root (`biome.json`) and covers both packages.

```bash
pnpm check    # lint
pnpm format   # auto-format
```
