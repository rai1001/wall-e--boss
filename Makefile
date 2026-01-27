SHELL := /bin/sh

.PHONY: dev api web docker-up docker-down lint test format clean

dev: docker-up
	@pnpm dev

api:
	@cd apps/api && uvicorn app.main:app --reload --host 0.0.0.0 --port $${API_PORT:-8000}

web:
	@pnpm --filter web dev

docker-up:
	@docker compose up -d

docker-down:
	@docker compose down

lint:
	@pnpm lint

test:
	@pnpm test

format:
	@pnpm format

clean:
	@pnpm clean
