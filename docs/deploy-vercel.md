# Deploy WALL-E a Vercel (Supabase + Next.js)

## 1) Variables de entorno en Vercel
En Project Settings → Environment Variables (Production y Preview):

- `NEXT_PUBLIC_SUPABASE_URL` = https://rnhjfiwjhtnbddmnjxsh.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sb_publishable_RBooXLO2_RwiEhTq0zru7w_hPvmmrlr
- `SUPABASE_SERVICE_ROLE_KEY` = (service role de tu proyecto)
- `CRON_SECRET` = 884300628ab3ab8667ea7eae709ede26eedadf4e47ddd8ec
- `WALLE_TIMEZONE` = Europe/Madrid
- `GOOGLE_CLIENT_ID` = (de Google Cloud)
- `GOOGLE_CLIENT_SECRET` = (de Google Cloud)
- Opcionales: `AI_STUDIO_API_KEY`, `OPENAI_API_KEY`

## 2) Redirect OAuth de Google
En Google Cloud → Credentials → tu OAuth client:
- Authorized redirect URI: `https://<tu-dominio-vercel>/api/auth/google/callback`
- Para pruebas locales: `http://localhost:3000/api/auth/google/callback`

Scopes mínimos: `https://www.googleapis.com/auth/calendar.readonly`
(añade `calendar.events` si vas a crear/mover eventos).

## 3) Cron Jobs en Vercel
Project Settings → Cron Jobs (Hobby solo permite 1 diario):
- `/api/cron/daily-briefing` → `0 7 * * *` (07:00 UTC ≈ 08:00 Madrid)
- `/api/cron/followups` (modo Hobby) → `0 9 * * *` (1 vez al día).  
Headers ya incluidos en `vercel.json`:
```
"headers": { "x-cron-secret": "884300628ab3ab8667ea7eae709ede26eedadf4e47ddd8ec" }
```
Si necesitas cada 2h, usa plan Pro o un scheduler externo (GitHub Actions/Uptime cron) que haga `POST` a `/api/cron/followups` con ese header.

## 4) Migraciones Supabase
- Local: `supabase db push` (aplica todas las migraciones en `/supabase/migrations`).
- O ejecuta desde tu máquina contra el proyecto: `supabase db push --project-ref rnhjfiwjhtnbddmnjxsh`.
No expongas la service role en Vercel build; las migraciones se corren fuera del deploy.

## 5) Deploy
- Conecta repo → Import Project en Vercel (framework Next.js autodetectado).
- `pnpm` ya en package.json; no requiere build flags extra.

## 6) Pruebas post-deploy
- `/app/today` carga y muestra briefing/plan/tareas.
- `/app/settings` → “Conectar Google Calendar” debe completar OAuth y volver sin error.
- Cron manual: `curl -X POST https://<tu-dominio>/api/calendar/google/sync -H "x-cron-secret: <CRON_SECRET>"` debería insertar eventos en Supabase.

## 7) Salud / Amazfit (Health Connect)
- Endpoint listo: `POST /api/health/import` con pasos/HR/sueño desde app companion Android o agregador externo.

Checklist final:
- [ ] Env vars completas en Vercel
- [ ] Redirect URI añadida en Google
- [ ] Migraciones aplicadas en Supabase
- [ ] Cron Jobs configurados
- [ ] OAuth Calendar probado en producción
