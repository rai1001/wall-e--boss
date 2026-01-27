# Integraciones Google
- OAuth pendiente (stubs en `.env.example`: GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI).
- `POST /calendar/sync` usa datos mock; dejar hook para Google Calendar API (events.list + sync tokens).
- Principio: scopes mínimos (calendar.readonly), consentimiento claro.
