
# JourKnows Backend (Express + TypeScript)

This is the backend repository for the JourKnows platform, built with **Express.js**, **TypeScript**, and **Drizzle ORM**. It follows a **Layered Architecture** to ensure scalability and maintainability.

## Table of Contents
- [JourKnows Backend (Express + TypeScript)](#jourknows-backend-express--typescript)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
    - [1. Clone \& Install](#1-clone--install)
    - [2. Configure Environment](#2-configure-environment)
    - [3. Start Infrastructure (Docker)](#3-start-infrastructure-docker)
    - [4. Initialize Database](#4-initialize-database)
    - [5. Start the Server](#5-start-the-server)
  - [Project Architecture](#project-architecture)
  - [Database \& Migrations](#database--migrations)
  - [Development Workflow](#development-workflow)
    - [Git Flow \& Commit Hygiene](#git-flow--commit-hygiene)
    - [Testing](#testing)

---

## Prerequisites
Ensure you have the following installed:
*   **Node.js**: v20 or higher (`node -v`)
*   **npm**: v10+
*   **Docker Desktop**: Required for running the local Database and Redis easily.

---

## Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd jourknows-backend
npm install
```

### 2. Configure Supabase Environment
Backend developers must create their own free "Development" project on Supabase to properly test authentication and database queries without affecting staging.
1. Create a new project on [Supabase](https://supabase.com).
2. Create your environment file: `cp .env.example .env`
3. Update `.env` with your new database connection string and API keys (found in Project Settings -> API):
   ```env
   DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0.pooler.supabase.com:6543/postgres"
   SUPABASE_URL="https://xxx.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

### 3. Start Local Redis
The backend uses Redis for API rate-limiting against DDoS attacks. Quickly spin it up via Docker:
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```
*(Add `REDIS_URL="redis://127.0.0.1:6379"` to your `.env`. If you skip this, the server will boot but rate-limiting will be disabled).*

### 4. Initialize Database & Seed Admin
Push the Drizzle ORM schema to your new Supabase database, then run the local terminal script to seed your first Admin CMS account:
```bash
npm run db:generate
npm run db:migrate
npm run seed:admin
```

### 5. Start the Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.
Visit `http://localhost:3000/health/db` to confirm your Supabase connection is active!

---

## Project Architecture

We strictly follow a **Layered Architecture**. Please do not put business logic in controllers.

```text
src/
├── app.ts              # Express App Setup (Middlewares)
├── server.ts           # Entry Point (Starts Listener)
├── config/             # Environment Variables (Zod schema)
│
├── routes/             # 1. API Routes (Defines Endpoints)
│   └── index.ts
│
├── controllers/        # 2. Request Handlers (Req/Res processing)
│   └── article.controller.ts
│
├── services/           # 3. Business Logic (The "Brain")
│   └── article.service.ts
│
├── repositories/       # 4. Data Access (Prisma Queries)
│   └── article.repository.ts
│
├── middlewares/        # Custom Express Middlewares (Auth, Error)
├── utils/              # Helper functions (Redis, Logger)
└── jobs/               # Background Cron Jobs (e.g., Cleanup)
```

---

## Database & Migrations
We use **Drizzle ORM**. The schema is located at `src/db/schema.ts`.

*   **View DB GUI**: `npm run db:studio` (Runs Drizzle Studio)
*   **Generate Migrations**: `npm run db:generate` (Run this after changing schema.ts)
*   **Apply Migrations**: `npm run db:migrate` (Applies changes to the database)

---

## Development Workflow

### Git Flow & Commit Hygiene
We enforce **Conventional Commits** using Husky.
*   **Branching**: ANY new code must be done on a feature branch.
    *   Command: `git checkout -b feature/my-new-feature`
    *   **Never** push directly to `develop` or `main`.
*   **Pull Requests**: Target the `develop` branch.
*   **Commits**: Must follow: `type(scope): description`.
    *   ✅ `feat(auth): add login endpoint`
    *   ❌ `added login`

### Testing
*   **Unit Tests**: `npm test`
*   **Linting**: `npm run lint`

All tests and lint checks must pass before pushing (Husky will block you otherwise).

---
