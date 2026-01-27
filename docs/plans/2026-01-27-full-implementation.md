# WALL-E Full Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tener la app WALL-E operativa (API + Web) con datos mock, calidad mínima (lint/tests), docker infra, y documentación alineada al PROJECT_SPEC.

**Architecture:** Monorepo pnpm+turborepo; FastAPI async + Postgres/Redis; Next.js app router mobile-first; mocks para calendar/Google/OpenAI; docker-compose para servicios base.

**Tech Stack:** pnpm/turbo, FastAPI, SQLAlchemy 2, Alembic, PostgreSQL, Redis, Next.js 14, Tailwind, Jest/Vitest (opcional), pytest, ruff/black, eslint/prettier.

---

### Task 1: Preparación entorno y dependencias
**Files:** package.json, pnpm-lock.yaml, .env.example  
**Step 1:** Instalar deps `pnpm install` en raíz.  
**Step 2:** Revisar/actualizar `.env.example` para API/WEB (DB/Redis/Supabase/Google/OpenAI).  
**Step 3:** Generar `.env` local (no commitear).  
**Step 4:** Guardar lockfile actualizado.  
**Step 5:** Commit `chore: deps ready`.

### Task 2: Infra docker + Make/turbo
**Files:** docker-compose.yml, Makefile, turbo.json  
**Step 1:** Probar `docker compose up -d` (Postgres/Redis).  
**Step 2:** Validar `make dev` (turbo dev) arranca web+api.  
**Step 3:** Ajustar puertos/dependeOn si falla.  
**Step 4:** Commit `chore: dev infra works`.

### Task 3: Base API salud + DB wiring
**Files:** apps/api/app/db.py, app/main.py, app/routers/health.py, alembic/env.py  
**Step 1:** Test failing (health endpoint integration).  
**Step 2:** Implementar health y creación de tablas en startup (lifespan).  
**Step 3:** Alembic upgrade head.  
**Step 4:** Pytest.  
**Step 5:** Commit `feat(api): health + db bootstrap`.

### Task 4: Modelo y CRUD tareas (TDD)
**Files:** app/models.py, schemas.py, crud.py, routers/tasks.py, tests/test_tasks.py  
**Step 1:** Escribir tests CRUD (create/list/update/delete).  
**Step 2:** Implementar modelo Task (priority/status/tags/due_date).  
**Step 3:** CRUD con SQLAlchemy async + serialización Pydantic.  
**Step 4:** Pytest.  
**Step 5:** Commit `feat(api): tasks CRUD`.

### Task 5: Mock calendario + endpoints auxiliares
**Files:** services/calendar_mock.py, routers/calendar.py, crud.py  
**Step 1:** Añadir generación de eventos mock (eventos/DESCANSO).  
**Step 2:** Endpoints `/calendar/sync`, `/calendar/today`, `/day/confirm-off`.  
**Step 3:** Pytest básico (lista no vacía tras sync).  
**Step 4:** Commit `feat(api): calendar mock + off-day stub`.

### Task 6: Briefing y Plan A/B/C
**Files:** services/briefing.py, services/plan.py, routers/briefing.py, routers/plan.py, tests nuevos  
**Step 1:** Tests que validen modo evento/libranza, top VIP, perros, casa, plan suggestion.  
**Step 2:** Implementar lógica según PROJECT_SPEC (eventos/DESCANSO, pugs 10-15, casa 15/30/60/profunda, hueco sospechoso).  
**Step 3:** Pytest.  
**Step 4:** Commit `feat(api): briefing & plan`.

### Task 7: Esquema DB y migraciones finales
**Files:** alembic/versions/*.py, README.md api  
**Step 1:** Generar migración actualizada (tasks/events/off_days).  
**Step 2:** `alembic upgrade head` contra Postgres docker.  
**Step 3:** Documentar comando en README.  
**Step 4:** Commit `chore(api): migrations aligned`.

### Task 8: Lint/format backend
**Files:** pyproject.toml, apps/api/package.json  
**Step 1:** Ajustar ruff config (lint.* section) y black.  
**Step 2:** Correr `pnpm --filter api lint` y `python -m black app`.  
**Step 3:** Fix warnings.  
**Step 4:** Commit `chore(api): lint clean`.

### Task 9: Web UI “Hoy”
**Files:** apps/web/app/page.tsx, components/*, lib/api.ts, styles/globals.css  
**Step 1:** Consumir API real con fetch (base URL env) + fallback mock.  
**Step 2:** Render Briefing, Plan A/B/C, lista tareas, form rápido, vista semanal, botón “Hablar” placeholder.  
**Step 3:** Asegurar mobile-first (touch targets ≥44px).  
**Step 4:** Smoke test `pnpm --filter web dev` + manual.  
**Step 5:** Commit `feat(web): home today view`.

### Task 10: Crear/editar tareas UI
**Files:** components/TaskForm.tsx, TaskList.tsx, lib/api.ts  
**Step 1:** Añadir edición inline/estado done/borrar; manejar loading/errors.  
**Step 2:** Validar tipos (TS strict).  
**Step 3:** ESLint/Prettier.  
**Step 4:** Commit `feat(web): task management UI`.

### Task 11: Vista semanal simple
**Files:** components/WeeklyView.tsx  
**Step 1:** Alinear con due_date y eventos (si hay).  
**Step 2:** Asegurar responsive (2–4 cols).  
**Step 3:** Commit `feat(web): weekly view`.

### Task 12: Lint/format frontend
**Files:** apps/web/.eslintrc.cjs, tailwind.config.ts, tsconfig.json  
**Step 1:** `pnpm --filter web lint` y `pnpm --filter web format`.  
**Step 2:** Corregir reglas accesibilidad (aria-label en icon-only, etc.).  
**Step 3:** Commit `chore(web): lint clean`.

### Task 13: E2E local sanity
**Files:** n/a  
**Step 1:** `docker compose up -d` (db/redis).  
**Step 2:** `make dev` y probar `/health`, `/tasks`, `/briefing/today`, UI “Hoy” carga mock.  
**Step 3:** Documentar comandos quickstart en README.  
**Step 4:** Commit `chore: local smoke doc`.

### Task 14: Docs y ADRs finales
**Files:** docs/*.md, docs/adr/*.md, docs/plans/YYYY-MM-DD-implementation.md  
**Step 1:** Escribir este plan en `docs/plans/2026-01-27-full-implementation.md`.  
**Step 2:** Actualizar docs/questions.md si quedan dudas.  
**Step 3:** Commit `docs: full implementation plan`.

### Task 15: Verificación final
**Files:** n/a  
**Step 1:** `pnpm lint`, `pnpm test` (pytest), `make dev` smoke.  
**Step 2:** Etiquetar pendientes (Google Calendar real, STT real).  
**Step 3:** Commit `chore: final verification notes`.
