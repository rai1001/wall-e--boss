# Despliegue
- Dependencias: Node 20, Python 3.11, Postgres, Redis.
- Contenedores: usar `docker-compose.yml` en dev; para prod separar servicios y variables.
- Migraciones: `alembic upgrade head`.
- Frontend: `pnpm --filter web build && next start`.
- Backend: `uvicorn app.main:app --host 0.0.0.0 --port 8000` detrás de reverse proxy.
