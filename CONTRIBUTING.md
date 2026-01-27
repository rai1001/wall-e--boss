# Contribuir a WALL-E

1. Lee `PROJECT_SPEC.md` antes de tocar código.
2. Usa TDD: escribe el test, veríficalo fallando, implementa, vuelve a pasar.
3. Formato/lint:
   - Python: `ruff` + `black`
   - Web: `eslint` + `prettier`
4. Comandos:
   - `pnpm lint` / `pnpm test` / `pnpm dev`
   - `make dev` disponible
5. No subir claves reales. Usa `.env.example`.
6. Documenta decisiones en `docs/adr/`.
7. Respeta el tono: el asistente es WALL-E y llama al usuario Rai.
