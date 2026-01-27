# Arquitectura
- Monorepo pnpm + turbo: `apps/api` (FastAPI), `apps/web` (Next.js).
- API: FastAPI + SQLAlchemy async + Alembic; endpoints health, tasks CRUD, calendar sync mock, briefing/plan.
- Front: Next.js app router, Tailwind, mobile-first.
- Infra: Docker Compose (Postgres, Redis). Makefile y scripts turbo.
- Eventos internos (ver catalogo) para desacoplar futuras features de voz/notifs.
