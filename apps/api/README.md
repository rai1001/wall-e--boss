# WALL-E API (FastAPI)

## Ejecutar en dev
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

> Nota: usa Python 3.11/3.12; pydantic-core aún no publica wheel estable para 3.13.

## Migraciones
```bash
alembic upgrade head
```

## Tests
```bash
pytest
```

## Endpoints clave
- `GET /health`
- CRUD `/tasks`
- `POST /calendar/sync` (mock)
- `GET /briefing/today`
- `GET /plan/today`
- `GET /calendar/today` (opcional)
- `POST /day/confirm-off` (opcional)
