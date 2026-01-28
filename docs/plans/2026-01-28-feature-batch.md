# WALL-E Feature Batch (Nudges, Planner, Perros/Casa, Meeting Stub)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Añadir funcionalidades UX clave sin salir del stack Supabase+Next: nudges/seguimiento VIP in-app, vistas semana/mes, edición de bloques sugeridos, panel perros/casa, preferencias usuario, alertas de hueco sospechoso/evento grande, intent parser mejorado, y stub de reuniones → tareas.

**Architecture:** Nuevas API Routes en Next (App Router) con Supabase server client; tablas extra para preferencias y meeting notes; UI en páginas existentes (Today/Tasks/Week/Month/Settings). Sin servicios externos.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Supabase JS/SSR, Tailwind, Vitest (tests de dominio).

---

### Task 1: Schema & migrations
**Files:** supabase/migrations/20260128010000_feature_batch.sql, supabase/seed.sql  
1. Add preferences columns to profiles (preferences jsonb, followup_window, walk_minutes_min/max, allow_auto_off).  
2. Add table meeting_notes (id, user_id, title, transcript, summary, action_items jsonb, created_at).  
3. Add table suggested_blocks (id, user_id, date, blocks jsonb, created_at, unique per user/date).  
4. Seed preferences defaults and sample meeting note/action items.  

### Task 2: Domain tweaks
**Files:** src/domain/intent.ts  
1. Expand parser: detect “estudio X min”, “paseo”, “pedido”, “vet”; set priority/tags; parse simple duration to minutes tag.  

### Task 3: API - followups & plan editing
**Files:** src/app/api/followups/route.ts, src/app/api/plan/today/route.ts (extend), src/app/api/plan/save/route.ts  
1. GET /api/followups → list active followups for user.  
2. PATCH /api/plan/today → allow selecting recommended option.  
3. POST /api/plan/save → persist edited blocks to suggested_blocks and update plans row.  

### Task 4: API - meetings stub
**Files:** src/app/api/meetings/route.ts, src/app/api/meetings/export-tasks/route.ts  
1. POST create meeting note (title, transcript?, summary?, action_items []).  
2. GET list meeting notes.  
3. POST export-tasks: create tasks from action_items (priority IMPORTANT, tag work).  

### Task 5: UI Today enhancements
**Files:** src/app/app/(protected)/today/page.tsx, src/components/* (if split)  
1. Add banner for big evento (title contains “100”).  
2. Show dogs & casa panels (anchors, template buttons).  
3. Show nudges list (followups) with acciones Hecho/Posponer/Bajar prioridad.  
4. Show meeting stub card: textarea summary + action items quick add -> calls API.  

### Task 6: Week/Month views
**Files:** src/app/app/(protected)/week/page.tsx, src/app/app/(protected)/month/page.tsx  
1. Week: fetch plans/day_state/events summary; show chips day_type/events/VIP.  
2. Month: simple grid current month with marks for eventos/DESCANSO/day_type.  

### Task 7: Settings
**Files:** src/app/app/(protected)/settings/page.tsx  
1. Form to update preferences (walk mins, followup window, allow_auto_off, quiet hours stub).  
2. Persist to profiles (preferences jsonb).  

### Task 8: Tests update
**Files:** src/domain/__tests__/intent.test.ts  
1. Add case for “pasear a Akira 15 min” tagging dogs.  

### Task 9: Docs
**Files:** README.md, docs/questions.md  
1. Update README quickstart with new endpoints/features.  
2. Add questions if any gaps remain.  

### Task 10: Verify
**Commands:** pnpm lint; pnpm test; pnpm dev (manual sanity today/week).  

---
