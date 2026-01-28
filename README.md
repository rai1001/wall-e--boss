# WALL-E (Supabase + Next.js)

Asistente personal proactivo para Rai (tuteo, tono familia). Stack obligatorio: **Next.js App Router en Vercel + Supabase (Auth/DB/Storage/Edge)**. Sin FastAPI, sin Docker.

## Estructura
- `/src/app` — rutas Next.js (App Router). API Routes en `/src/app/api/*`.
- `/src/domain` — lógica pura (clasificación de día, plan A/B/C, briefing, intent parser).
- `/src/lib` — clientes Supabase y helpers de env/auth.
- `/supabase` — migrations y seed.
- `/docs` — specs y planes (`PROJECT_SPEC.md`, `docs/plans/2026-01-28-supabase-next-rework.md`).

## Prerrequisitos
- Node 20+ con corepack (pnpm).
- Supabase CLI configurada y proyecto creado.

## Variables de entorno
Copiar `.env.example` a `.env.local` y rellenar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `WALLE_TIMEZONE=Europe/Madrid`
- Stubs: `GOOGLE_CLIENT_ID/SECRET`, `OPENAI_API_KEY`
- Opcional actual: `AI_STUDIO_API_KEY` si usas tu proveedor de IA Studio.

## Comandos
- `pnpm install`
- `pnpm dev` — arranca Next.js (API + UI).
- `pnpm lint`
- `pnpm test` — Vitest (plan engine + intent parser).

## Supabase
1) `supabase db reset` (o `db push`) para aplicar `/supabase/migrations/20260128000000_base.sql`.
2) `supabase db seed --file supabase/seed.sql` opcional (datos demo).
3) Habilitar Auth (email/anon). RLS ya definido para `user_id = auth.uid()`.

## Deploy Vercel
- Conectar repo y setear env vars anteriores.
- `vercel.json` incluye crons:
  - `/api/cron/daily-briefing` 08:00 Europe/Madrid (07:00 UTC invierno).
  - `/api/cron/followups` cada 2h.
- Añadir `x-cron-secret` con `CRON_SECRET` en Vercel Scheduler.

## Flujos clave
- `/api/plan/today` clasifica día (NORMAL/LONG/EXTREME/OFF, “eventos”, “DESCANSO”, hueco sospechoso) y guarda planes A/B/C.
- `/api/briefing/today` genera briefing FAMILY/WORK.
- `/api/calendar/sync` inserta mock de eventos (incluye “eventos 100 pax” para probar LONG+buffer).
- `/api/day/confirm-off` marca DESCANSO.
- `/api/followups` lista/gestiona nudges VIP.
- `/api/meetings` crea notas de reunión (stub) y `/api/meetings/export-tasks` convierte action items en tareas.
- UI: `/app/today` muestra briefing, planes, tareas, banner “¿hoy libras?”, nudges, perros/casa, stub reuniones.
- UI: vistas `/app/week` y `/app/month` simplificadas; `/app/settings` guarda preferencias (paseos, followups, auto DESCANSO).
- IA opcional: `AI_STUDIO_API_KEY` (proveedor actual del usuario) para futuras integraciones; dejar `OPENAI_API_KEY` vacío hasta migrar a gpt-4o-mini.

## Tests mínimos
- `src/domain/__tests__/planEngine.test.ts`
- `src/domain/__tests__/intent.test.ts`

## Notas
- IA no obligatoria en V0; deja `OPENAI_API_KEY` vacío y prompts stubs.
- Perros prioridad permanente (10–15m). Casa plantillas 15/30/60. Máster solo en huecos limpios.
