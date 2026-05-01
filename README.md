# shuttlebase

Badminton club membership management system.

## Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Fastify 5
- **Database**: PostgreSQL via Prisma 7 + `@prisma/adapter-pg`
- **Auth**: JWT (`@fastify/jwt`) + bcrypt
- **Validation**: Zod
- **Language**: TypeScript
- **Linting/Formatting**: Biome
- **Testing**: Vitest + Fastify inject
- **API Client**: Bruno

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **UI**: shadcn/ui + Tailwind CSS v4
- **HTTP**: Axios
- **Language**: TypeScript

## Getting started

### Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in the values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/shuttlebase
JWT_SECRET=your-secret-here
```

Run migrations and seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Scripts

### Backend (`cd backend`)

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm test` | Run tests |
| `npm run check` | Lint and format check |
| `npm run format` | Auto-fix formatting |

### Frontend (`cd frontend`)

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Lint |

## API

All `/members` routes require a `Bearer` token in the `Authorization` header.

### Auth

| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Login and receive a JWT |

### Members

| Method | Path | Description |
|---|---|---|
| GET | `/members` | List all members |
| GET | `/members/:id` | Get a member by ID |
| POST | `/members` | Create a member |
| PATCH | `/members/:id` | Update a member |
| DELETE | `/members/:id` | Deactivate a member |

### Other

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |

## Seed credentials

Set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in your `.env` before running `npx prisma db seed`.
