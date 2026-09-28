# MoneyPilot — Personal Banking Dashboard

A full-stack personal banking web application built as a **demo/portfolio project**. Users can log in, view their accounts, cards, loans, and transactions in a clean modern dashboard.

> **Security Notice:** This is a demo application for portfolio purposes only. It does **not** connect to real banking APIs, process real payments, or move real money. All data is mock/demo data stored in a local PostgreSQL database. **Do not use this for real financial operations.**

## Tech Stack

### Frontend
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Redux Toolkit (auth + dashboard state)
- Axios (API client with JWT interceptor)
- Next.js middleware + server-side auth guards for protected routes
- lucide-react (icons)

### Backend
- Node.js + NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication (`@nestjs/jwt` + route guard)
- bcrypt (password hashing)
- Zod (request validation pipe)
- `@nestjs/config` (environment configuration)

## Folder Structure

```
moneypilot/
├── apps/
│   ├── api/                    # Backend (NestJS + Prisma)
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database models
│   │   │   └── seed.ts         # Demo data seeder
│   │   ├── src/
│   │   │   ├── config/         # Environment configuration factory
│   │   │   ├── common/         # Guards, pipes, filters, decorators
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # Register, login, me, logout
│   │   │   │   ├── accounts/   # Bank accounts
│   │   │   │   ├── cards/      # Cards
│   │   │   │   ├── loans/      # Loans
│   │   │   │   ├── transactions/ # Transactions with filters
│   │   │   │   ├── dashboard/  # Dashboard summary
│   │   │   │   └── users/      # User profile
│   │   │   ├── prisma/         # Prisma module + service
│   │   │   ├── app.module.ts   # Root Nest module
│   │   │   └── main.ts         # Application entry point
│   │   ├── .env.example
│   │   ├── nest-cli.json
│   │   └── package.json
│   │
│   └── web/                    # Frontend (Next.js App Router)
│       ├── src/
│       │   ├── app/            # App Router routes
│       │   │   ├── (auth)/     # /login, /register (redirects when signed in)
│       │   │   ├── (dashboard)/# Protected /dashboard, /accounts, /accounts/[id],
│       │   │   │               #   /cards, /loans, /transactions, /profile
│       │   │   ├── layout.tsx  # Root layout + Redux providers
│       │   │   └── page.tsx    # Redirects / → /dashboard
│       │   ├── api/            # Axios client + auth API
│       │   ├── components/     # Sidebar, TopBar, StatCard, States, shell
│       │   ├── lib/            # Token cookie helpers + server auth guards
│       │   ├── middleware.ts   # Route protection (replaces ProtectedRoute)
│       │   ├── store/          # Redux Toolkit slices
│       │   ├── types/          # TypeScript types
│       │   └── utils/          # Formatting helpers
│       ├── .env.example
│       ├── next.config.mjs
│       └── package.json
│
├── docker-compose.yml          # PostgreSQL container
├── package.json                # npm workspaces root + shared scripts
├── package-lock.json           # Single lockfile for both workspaces
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js 18.18+ (required by Next.js 15; Node 20 LTS recommended)
- npm 9+ (for workspaces support)
- Docker (for PostgreSQL)

### 1. Install dependencies

This repository is an npm workspaces monorepo, so a single install at the
project root covers both `apps/api` and `apps/web`:

```bash
npm install
```

### 2. Start PostgreSQL with Docker

From the project root:

```bash
docker-compose up -d
```

This starts a PostgreSQL database on `localhost:5432` with database `moneypilot`, user `postgres`, password `postgres`.

### 3. Set up environment variables

```bash
# Backend
cp apps/api/.env.example apps/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env.local
```

| Variable              | App | Purpose                                              |
|-----------------------|-----|------------------------------------------------------|
| `DATABASE_URL`        | api | PostgreSQL connection string                          |
| `JWT_SECRET`          | api | Secret used to sign JWTs — change it                  |
| `PORT`                | api | API port (default `4000`)                             |
| `CLIENT_URL`          | api | Allowed CORS origin (default `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | web | Base URL of the API (default `http://localhost:4000/api`) |

### 4. Run Prisma migrations

```bash
cd apps/api
npx prisma migrate dev --name init
```

This also generates the Prisma client. If you ever build the API without having
run a migration (for example on a fresh clone), generate it explicitly first,
otherwise `nest build` fails with implicit-`any` type errors:

```bash
npm run prisma:generate
```

### 5. Seed the database

```bash
npm run seed
```

This creates a demo user with 3 accounts, 3 cards, 3 loans, and 20 transactions.

### 6. Run the backend

```bash
npm run dev:api
```

The API runs on `http://localhost:4000`.

### 7. Run the frontend

```bash
npm run dev:web
```

The frontend runs on `http://localhost:3000`.

## npm Scripts

Run these from the project root:

| Script                    | Description                                 |
|---------------------------|---------------------------------------------|
| `npm run dev:api`         | Start the NestJS API in watch mode          |
| `npm run dev:web`         | Start the Next.js dev server                |
| `npm run build:api`       | Build the API                               |
| `npm run build:web`       | Production build of the frontend            |
| `npm run lint:web`        | Lint the frontend                           |
| `npm run typecheck:web`   | Type-check the frontend                     |
| `npm run prisma:generate` | Generate the Prisma client                  |
| `npm run prisma:migrate`  | Run Prisma migrations                       |
| `npm run seed`            | Seed the database with demo data            |

Inside `apps/web` you can also run `npm run start` to serve the production build.

## Routing & Auth

Routing uses the **Next.js App Router**. Routes live in `apps/web/src/app`, with
two route groups that supply their own layout and auth behaviour:

| Route                | Group          | Notes                                        |
|----------------------|----------------|----------------------------------------------|
| `/`                  | —              | Redirects to `/dashboard`                    |
| `/login`, `/register`| `(auth)`       | Redirect to `/dashboard` when already signed in |
| `/dashboard`         | `(dashboard)`  | Protected, shares the sidebar/top-bar shell  |
| `/accounts`          | `(dashboard)`  | Protected                                    |
| `/accounts/[id]`     | `(dashboard)`  | Protected, dynamic segment                   |
| `/cards`             | `(dashboard)`  | Protected                                    |
| `/loans`             | `(dashboard)`  | Protected                                    |
| `/transactions`      | `(dashboard)`  | Protected                                    |
| `/profile`           | `(dashboard)`  | Protected                                    |

The JWT is stored in a `moneypilot_token` cookie so it can be read on the server.
`src/middleware.ts` redirects unauthenticated requests to `/login` (and signed-in
visitors away from the auth pages), and the group layouts repeat the check
server-side via `src/lib/server-auth.ts` as defence in depth. Redux auth state is
rehydrated on the client by `components/AuthBootstrap.tsx`.

## Demo Login

| Field    | Value                  |
|----------|------------------------|
| Email    | `demo@moneypilot.test` |
| Password | `password123`          |

## Features

- **Dashboard**: Total balance, total debt, monthly spending, active cards, recent transactions, account & loan summaries
- **Accounts**: View savings, current, and investment accounts with masked account numbers
- **Account Detail**: Individual account view with recent transactions
- **Cards**: Debit and credit cards with spending limit progress bars, status indicators
- **Loans & Financing**: Personal, car, home, and education loans with repayment progress
- **Transactions**: Full transaction list with search, account/type/date filters
- **Profile**: User info and logout
- **Auth**: JWT-based login/register with Redux Toolkit state management, protected by Next.js middleware and server-side guards
- **Responsive**: Works on desktop and mobile with collapsible sidebar

## Security Notice

This is a **demo/portfolio project**. It is not production banking software.

- All data is mock/demo data
- No real banking APIs are integrated
- No real payments or money movement
- No real card numbers (all numbers are masked/fake)
- Do not use this application for real financial operations
