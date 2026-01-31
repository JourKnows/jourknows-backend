
# JourKnows Backend (Express + TypeScript)

This is the backend repository for the JourKnows platform, built with **Express.js**, **TypeScript**, and **Prisma**. It follows a **Layered Architecture** to ensure scalability and maintainability.

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

### 2. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env
```
Update `.env` with your local credentials if needed.

### 3. Start Infrastructure (Docker)
We use Docker Compose to run Postgres and Redis locally.
```bash
# If you have a docker-compose.yml (Create one if needed)
docker-compose up -d
```
*Alternatively, use your own local Postgres/Redis instances.*

### 4. Initialize Database
Run the Prism migrations to create tables in your local DB:
```bash
npx prisma migrate dev --name init
```

### 5. Start the Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.
Visit `http://localhost:3000/health` to verify it's working.

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
We use **Prisma ORM**. The schema is located at `prisma/schema.prisma`.

*   **View DB GUI**: `npx prisma studio`
*   **Create Migration**: `npx prisma migrate dev --name <migration_name>` (Run this after changing schema.prisma)
*   **Generate Client**: `npx prisma generate` (Run this if TypeScript complains about missing models)

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
