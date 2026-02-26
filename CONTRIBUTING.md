# Contributing to JourKnows Backend

Welcome to the JourKnows backend repository! We appreciate your help and want to make contributing as easy and transparent as possible. 

This guide will help you understand our development workflow, technology stack, and best practices.

## Technology Stack

Our backend is built with the following core technologies:
* **Runtime / Framework:** Node.js, Express, TypeScript
* **Database / ORM:** PostgreSQL, Drizzle ORM
* **Caching:** Redis
* **Validation:** Zod
* **Testing:** Jest, Supertest
* **Linting / Formatting:** ESLint, Prettier, Husky (Git Hooks)

---

## Local Development Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/en/) (v18+ recommended)
* [PostgreSQL](https://www.postgresql.org/)
* [Redis](https://redis.io/)

### 2. Getting Started
1. **Clone the repository:**
   ```bash
   git clone https://github.com/JourKnows/jourknows-backend.git
   cd jourknows-backend
   ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Environment Configuration:**
    Create a `.env` file in the root directory and ensure the following variables are set (reach out to the team for development secrets if needed):
    ```env
    NODE_ENV=development
    DATABASE_URL=postgres://user:password@localhost:5432/jourknows_db
    REDIS_URL=redis://localhost:6379
    ```
4. **Database Setup & Migrations:**
    Using Drizzle ORM, apply the latest database migrations:
    ```bash
    npm run db:migrate
    ```
    *Optionally, to view your database using Drizzle Studio:*
    ```bash
    npm run db:studio
    ```
5. **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The server will start using `nodemon` and auto-restart on file changes.

---

## Development Workflow & Guidelines

### Branches
* `main` - Stable production code. (Do not push directly!)
* `develop` - Active staging branch for the next release.
* **Feature Branches** - Create new feature branches off `develop`. (e.g., `feature/user-auth`, `bugfix/login-error`)

### Code Style (Linting & Formatting)
We enforce code quality using ESLint and Prettier. Please ensure your code passes checks before committing:
```bash
npm run format  # Auto-formats code using Prettier
npm run lint    # Checks for ESLint errors
```
*Note: We use Husky pre-commit hooks. If your code is not formatted properly, the commit will be rejected.*

### Commit Messages (Conventional Commits)
We use `commitlint` with the **Conventional Commits** standard. Your commit messages MUST follow this format:
```
<type>(<optional scope>): <subject>
```
**Allowed Types:**
* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* `refactor`: A code change that neither fixes a bug nor adds a feature
* `test`: Adding missing tests or correcting existing tests
* `chore`: Changes to the build process or auxiliary tools and libraries

**Example of a valid commit message:**
> feat(auth): implement JWT login endpoint

### Database Changes (Drizzle)
If you modify your database schema (usually found in `src/db/schema.ts` or similar):
1. **Generate the migration file:**
   ```bash
   npm run db:generate
   ```
2. **Apply the migration to your local database:**
   ```bash
   npm run db:migrate
   ```
3. Commit both the schema changes and the generated migration files.

### Testing
We use Jest for unit and integration testing. All new features should include corresponding tests.
```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
```

---

## Submitting a Pull Request (PR)

1. Make sure all your changes are pushed to your feature branch.
2. Open a Pull Request from your feature branch aiming at `develop`.
3. Give your PR a descriptive title and fill out the necessary information outlining your changes.
4. Ensure all GitHub Actions / Status Checks (Linting, Tests) pass successfully.
5. Request a review from the Code Owners (`@Siruyy`, `@JohnMarkCapones`).
6. Once approved, the PR can be merged into `develop`.

Happy coding! 🚀
