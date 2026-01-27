# Modelo de datos
- Postgres por defecto; SQLite para tests.
- Tablas:
  - `tasks` (id serial, title, priority enum, tags json, due_date, status enum, created_at, updated_at)
  - `events` (id, title, start_time, end_time, location, source, is_event_day, is_off_day, created_at)
  - `off_days` (date unique, reason)
- Alembic mantiene migraciones.
