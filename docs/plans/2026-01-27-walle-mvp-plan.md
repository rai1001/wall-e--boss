# WALL-E MVP Monorepo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the WALL-E (tuteo, Rai) monorepo with FastAPI backend, Next.js mobile-first frontend, infra scripts, docs, and minimal tests aligned to PROJECT_SPEC.

**Architecture:** Turborepo-style pnpm workspaces with apps/api (FastAPI + SQLAlchemy 2.0 + Alembic) and apps/web (Next.js 14 + Tailwind). Shared configs at root. Docker Compose for Postgres + Redis. Mock calendar sync feeds briefing/plan generation; Google/OpenAI left as stubs with env placeholders.

**Tech Stack:** pnpm + turbo, Node 20, Next.js 14 (app router, TypeScript, Tailwind), FastAPI + async SQLAlchemy 2.0, Alembic, PostgreSQL, Redis, pytest, ruff, black, eslint, prettier, make.

---

### Task 1: Monorepo Scaffolding & Tooling
**Files:** package.json, pnpm-workspace.yaml, turbo.json, .npmrc, Makefile, .gitignore, .env.example, README.md (stub), CONTRIBUTING.md, CHANGELOG.md  
**Step 1:** Create root workspaces (apps/*, packages/*) and turbo pipeline (dev, lint, test, build).  
**Step 2:** Add root scripts: dev/build/lint/test/format/clean + make wrappers (`make dev`, `make api`, `make web`, `make lint`, `make test`).  
**Step 3:** Add .gitignore (node, python, .env, .venv, .pytest_cache, alembic, .next, dist).  
**Step 4:** Write .env.example with API DB creds, Redis, NEXT_PUBLIC_API_BASE_URL, GOOGLE_* placeholders, OPENAI_* placeholder.  
**Step 5:** Seed README/CONTRIBUTING/CHANGELOG scaffolds referencing spec and commands.  

### Task 2: Infra - Docker Compose
**Files:** docker-compose.yml  
**Step 1:** Define postgres (14+) and redis services with healthchecks and volumes.  
**Step 2:** Add app networks; expose 5432, 6379.  
**Step 3:** Document init credentials matching .env.example.  

### Task 3: API Project Setup
**Files:** apps/api/pyproject.toml, apps/api/requirements.txt, apps/api/requirements-dev.txt, apps/api/app/main.py, apps/api/app/config.py, apps/api/app/db.py, apps/api/app/models.py, apps/api/app/schemas.py, apps/api/app/crud.py, apps/api/app/deps.py, apps/api/app/routers/*.py, apps/api/app/services/briefing.py, apps/api/app/services/plan.py, apps/api/app/services/calendar_mock.py, apps/api/alembic.ini, apps/api/alembic/env.py, apps/api/alembic/versions/*.py, apps/api/tests/conftest.py, apps/api/tests/test_health.py, apps/api/tests/test_tasks.py, apps/api/README.md  
**Step 1 (RED):** Write pytest failing tests for /health and /tasks CRUD (create/list/update/delete).  
**Step 2:** Add FastAPI app scaffolding with async SQLAlchemy engine/session and dependency injection.  
**Step 3:** Implement Task model (Enum priority, tags JSON, status Enum, due_date) + Event model for calendar sync + OffDay flag table.  
**Step 4:** Create routers: health, tasks CRUD, calendar_sync (mock generator + stub for Google), calendar_today (optional), day_confirm_off (optional), briefing_today (rules), plan_today (Plan A/B/C with reasons).  
**Step 5:** Implement services for briefing/plan applying PROJECT_SPEC rules (modo evento DESCANSO, pugs 10/15, casa plantillas 15/30/60/profunda, hueco sospechoso flag).  
**Step 6:** Configure Alembic (env.py with async engine) and create initial migration.  
**Step 7 (GREEN):** Run tests to pass; ensure ruff/black configs in pyproject.  

### Task 4: API Tooling & Scripts
**Files:** apps/api/.env.example (symlink or copy guidance), apps/api/Makefile (optional), scripts in root Makefile.  
**Step 1:** Add uvicorn dev script (pnpm api? or make).  
**Step 2:** Add lint/test commands in package.json referencing `pnpm --filter api ...` or `make api`.  

### Task 5: Frontend Setup (Mobile-First)
**Files:** apps/web/package.json, next.config.mjs, tsconfig.json, tailwind.config.ts, postcss.config.cjs, apps/web/app/layout.tsx, app/page.tsx, app/api/types, components/*, lib/api.ts, styles/globals.css, apps/web/tests (if any), apps/web/.eslintrc.cjs, apps/web/.prettierrc.cjs, apps/web/README.md  
**Step 1:** Initialize Next.js 14 (app router) with Tailwind, eslint, prettier.  
**Step 2:** Define shared types for tasks/plan/briefing matching API.  
**Step 3:** Build “Hoy” page (mobile-first) showing briefing, Plan A/B/C cards, tasks list, quick create/edit form, weekly view list/grid, “Hablar” placeholder button.  
**Step 4:** Add simple data hooks using fetch to API base URL; fallback to mocked data for offline/demo.  
**Step 5:** Apply UI direction from ui-ux-pro-max/superdesign (define palette/typography, avoid generic purple; ensure touch targets >=44px).  

### Task 6: Lint/Format & Quality
**Files:** root prettier config, eslint base, apps/api pyproject ruff/black, apps/web eslint/prettier, turbo.json tasks  
**Step 1:** Configure root prettier + eslint ignores.  
**Step 2:** Add ruff + black config in pyproject; ensure `pnpm lint` runs eslint + ruff.  
**Step 3:** Add `pnpm test` mapping to pytest & frontend tests (none required except API tests).  

### Task 7: Documentation Set
**Files:** All docs listed in PROJECT_SPEC (docs/00-vision.md ... docs/14-deployment.md, docs/adr/*.md, docs/questions.md if ambiguities).  
**Step 1:** Create stubs summarizing required content per spec; ensure DESCANSO/eventos rules captured.  
**Step 2:** Add docs/questions.md with any open items after implementation.  

### Task 8: Verification & Handover
**Files:** n/a  
**Step 1:** Run `pnpm install`, `pnpm lint`, `pnpm test`, `pnpm dev` (or make equivalents) to verify.  
**Step 2:** Update README with tested commands and expected ports.  
**Step 3:** Summarize next steps for Rai (approval flows, Google integration).  

---

Plan complete. Ready to execute with TDD and mobile-first focus. Would you like me to proceed with implementation now? (Default: pnpm + turbo as proposed.)
