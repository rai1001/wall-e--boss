# WALL-E Supabase+Next Rework Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrar el MVP a un stack 100% Supabase + Next.js (App Router) en Vercel, sin FastAPI/Docker, con calendario mock, plan/briefing A/B/C, tareas CRUD y proactividad básica.

**Architecture:** Next.js (app router) sirve UI y API Routes; Supabase Postgres/Auth/Realtime/Storage como backend único; lógica de día/plan/briefing en helpers de dominio compartidos; cron jobs via Vercel hitting API routes con token secreto; tests con Vitest para motor de plan e intent parser.

**Tech Stack:** Next.js 14 + TypeScript strict, Supabase JS client (browser/server), Supabase migrations/seed, ESLint+Prettier, Tailwind, Vitest, vercel.json cron.

---

### Task 1: Repo setup & tooling
**Files:** package.json, pnpm-lock.yaml (generated), tsconfig.json, .eslintrc.cjs, .prettierrc, .npmrc, .gitignore, .env.example, vercel.json, README.md  
1. Init Next.js App Router (pnpm create next-app --ts --app --eslint --tailwind) in root.  
2. Configure pnpm, TypeScript strict, baseUrl `src`.  
3. Add ESLint/Prettier configs aligned to Next.  
4. Add env vars to .env.example (Supabase, CRON_SECRET, WALLE_TIMEZONE, stubs Google/OpenAI).  
5. Add vercel.json with cron to /api/cron/daily-briefing (08:00 Europe/Madrid) and /api/cron/followups (every 2h) using headers x-cron-secret.  

### Task 2: Supabase schema & migrations
**Files:** supabase/config.toml, supabase/migrations/20260128000000_base.sql, supabase/seed.sql  
1. Write migration creating tables profiles, tasks, calendar_events, day_state, plans, briefings, followups with constraints and triggers (updated_at).  
2. Enable RLS; policies select/insert/update/delete by user_id = auth.uid(); profiles policy id = auth.uid().  
3. Seed demo data: profile for current user placeholder, sample tasks (VIP/IMPORTANT/NORMAL), calendar events (eventos 100 pax today, DESCANSO tomorrow, normal block).  
4. Document how to apply migration with Supabase CLI.  

### Task 3: Supabase clients & helpers
**Files:** src/lib/supabase/client.ts, src/lib/supabase/server.ts, src/lib/env.ts, src/lib/auth.ts  
1. Create browser client (uses anon key) and server client (createRouteHandlerClient or service-role for cron with CRON_SECRET).  
2. Helper to get current user/session server-side; enforce user required for app routes.  
3. Env loader with zod to validate required vars.  

### Task 4: Domain logic (pure functions)
**Files:** src/domain/dayTypes.ts, src/domain/planEngine.ts, src/domain/briefing.ts, src/domain/intent.ts  
1. Implement day classification heuristics (eventos/DESCANSO/extreme/long/normal, 100 pax => today+tomorrow long).  
2. Implement plan generator returning options A/B/C with blocks for dogs/house/study/work.  
3. Implement briefing generator (family/work styles).  
4. Implement simple intent parser (rule-based for “nota:”, “recuérdame”, fallback task).  
5. Export pure functions for testing.  

### Task 5: API routes
**Files:** app/api/health/route.ts, app/api/tasks/route.ts, app/api/tasks/[id]/route.ts, app/api/calendar/sync/route.ts, app/api/calendar/today/route.ts, app/api/day/confirm-off/route.ts, app/api/plan/today/route.ts, app/api/briefing/today/route.ts, app/api/cron/daily-briefing/route.ts, app/api/cron/followups/route.ts  
1. Implement CRUD tasks with RLS-safe server client (session-based).  
2. Calendar sync POST: accept events or insert defaults; compute flags; upsert. today GET returns computed events.  
3. Off day confirm: update day_state (OFF, off_confirmed).  
4. Plan today: load events/day_state, classify, generate plans, upsert plans rows, return recommended option.  
5. Briefing today: generate styles, upsert briefings, return payload with plans.  
6. Cron routes: require x-cron-secret == CRON_SECRET; generate briefings both styles; schedule followups (no notifications, just rows).  

### Task 6: UI scaffolding
**Files:** app/layout.tsx, app/page.tsx (redirect), app/login/page.tsx, app/app/(protected)/today/page.tsx, app/app/(protected)/tasks/page.tsx, app/app/(protected)/week/page.tsx, app/app/(protected)/month/page.tsx, app/app/(protected)/settings/page.tsx, components/* (Nav, DayBadge, PlanCards, BriefingCard, TasksList, TaskForm, OffDayBanner, PlanBlocks, IntentInput, ToggleStyle) , styles/globals.css  
1. Auth flow: minimal Supabase Auth UI (email magic link or password) on /login; middleware-like guard in layout to fetch session server-side; if no session → redirect login.  
2. Today page: show day_type badge, toggle FAMILY/WORK, briefing text, plan selector with blocks, tasks list with quick actions (done/snooze/priority), OffDaySuspected banner with buttons wired to API.  
3. Tasks page: CRUD form + list.  
4. Week/Month pages: lightweight summaries (day_type, events count, VIP count).  
5. Settings: display_name/timezone/preferences placeholders stored in profiles.  
6. Voice V0: modal “Hablar” + textarea; uses intent parser to create task.  

### Task 7: Styling & UX rules
**Files:** tailwind.config.ts, styles/globals.css, components design tweaks  
1. Define a compact palette (no generic purple), mobile-first spacing, 44px targets.  
2. Add badges for day_type; banners for libranza; cards for plans with reasons.  
3. Ensure accessibility (aria-label on icon buttons).  

### Task 8: Tests
**Files:** vitest.config.ts, src/domain/__tests__/planEngine.test.ts, src/domain/__tests__/intent.test.ts  
1. Add Vitest setup.  
2. Tests for day classification (eventos, DESCANSO, 100 pax => today+tomorrow long).  
3. Tests for intent parser (nota, recuérdame with due, fallback).  

### Task 9: Docs & questions
**Files:** README.md (update), docs/questions.md (append)  
1. Document setup/run/deploy (Supabase CLI, migrations, env vars, cron).  
2. Add open questions/assumptions if gaps appear during implementation.  

### Task 10: Verification
**Commands:** pnpm lint ; pnpm test ; pnpm dev (manual sanity)  
1. Ensure /api/plan/today and /api/briefing/today work with seed events.  
2. Check OffDaySuspected banner and confirm flow.  
3. Verify cron routes reject without secret.  

---

Plan listo. Elegir ejecución con superpowers:executing-plans o continuar en esta sesión por tareas secuenciales.
