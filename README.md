# WALL-E Monorepo

Asistente personal de Rai (tuteo, tono familia). Backend FastAPI + Frontend Next.js (mobile-first). Ver `PROJECT_SPEC.md` para requisitos funcionales obligatorios.

## Estructura
- `apps/api`: FastAPI + SQLAlchemy 2.0 + Alembic
- `apps/web`: Next.js 14 (app router) + Tailwind
- `packages`: configs compartidas (futuro)

## Prerrequisitos
- Node 20+
- pnpm 9
- Python 3.11+ (soporta 3.13 gracias a pydantic-core >=2.41)
- Docker (compose v2)
- Opcional Supabase: añade `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en tu `.env`
- Gemini: define `GEMINI_API_KEY` para transcripción/resumen de reuniones.

## Comandos rápidos
- `make dev` — levanta docker-compose y corre turbo dev (api + web)
- `pnpm dev` — idem usando turbo
- `pnpm lint` — eslint + ruff
- `pnpm test` — pytest (API) y tests web (si los hay)

## Variables de entorno
Copiar `.env.example` a `.env` en raíz (API) y `apps/web/.env.example` a `.env.local` para el frontend. Sin claves reales:
- API: DB, REDIS, GEMINI_API_KEY.
- Web: NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.

## Documentación
Documentos en `docs/` y ADRs en `docs/adr/`. Plan actual en `docs/plans/2026-01-27-walle-mvp-plan.md`.

## Licencia
Uso interno (no definida).
