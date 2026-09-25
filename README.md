# MoneyPilot — Personal Banking Dashboard

A full-stack personal banking web application built as a **demo/portfolio project**. Users can log in, view their accounts, cards, loans, and transactions in a clean modern dashboard.

> **Security Notice:** This is a demo application for portfolio purposes only. It does **not** connect to real banking APIs, process real payments, or move real money. All data is mock/demo data stored in a local PostgreSQL database. **Do not use this for real financial operations.**

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit (auth + dashboard state)
- Axios (API client with JWT interceptor)
- React Router
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
│   └── web/                    # Frontend (React + Vite)
│       ├── src/
│       │   ├── api/            # Axios client + auth API
│       │   ├── components/     # Sidebar, TopBar, StatCard, States
│       │   ├── pages/          # Login, Register, Dashboard, etc.
│       │   ├── store/          # Redux Toolkit slices
│       │   ├── types/          # TypeScript types
│       │   └── utils/          # Formatting helpers
│       ├── .env.example
│       └── package.json
│
├── docker-compose.yml          # PostgreSQL container
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)

### 1. Install dependencies

```bash
# Install backend dependencies
cd apps/api
npm install

# Install frontend dependencies
cd ../web
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
cp apps/web/.env.example apps/web/.env
```

### 4. Run Prisma migrations

```bash
cd apps/api
npx prisma migrate dev --name init
```

### 5. Seed the database

```bash
cd apps/api
npm run seed
```

This creates a demo user with 3 accounts, 3 cards, 3 loans, and 20 transactions.

### 6. Run the backend

```bash
cd apps/api
npm run dev
```

The API runs on `http://localhost:4000`.

### 7. Run the frontend

```bash
cd apps/web
npm run dev
```

The frontend runs on `http://localhost:5173`.

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
- **Auth**: JWT-based login/register with Redux Toolkit state management
- **Responsive**: Works on desktop and mobile with collapsible sidebar

## Security Notice

This is a **demo/portfolio project**. It is not production banking software.

- All data is mock/demo data
- No real banking APIs are integrated
- No real payments or money movement
- No real card numbers (all numbers are masked/fake)
- Do not use this application for real financial operations
