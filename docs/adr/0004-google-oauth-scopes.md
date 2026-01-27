# ADR 0004 - Google OAuth scopes
## Decisión
Usar `calendar.readonly` inicialmente; no escribir ni borrar eventos hasta aprobación explícita.
## Contexto
Necesitamos sincronizar agenda sin riesgo de cambios no deseados.
## Consecuencias
- `POST /calendar/sync` queda en mock; hook listo para integrar Google.
- Tendremos que ampliar scopes cuando se requiera escritura.
