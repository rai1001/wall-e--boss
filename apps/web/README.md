# WALL-E Web (Next.js)

## Ejecutar en dev
```bash
pnpm install
pnpm --filter web dev
```

API base se lee de `NEXT_PUBLIC_API_BASE_URL` (ver `.env.example` en la raíz).

Supabase opcional (placeholder):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Stack
- Next.js 14 (app router)
- Tailwind CSS
- TypeScript

## Pantallas
- Hoy: briefing, Plan A/B/C, tareas, vista semanal básica, botón "Hablar" placeholder.
