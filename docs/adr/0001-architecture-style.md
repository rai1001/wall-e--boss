# ADR 0001 - Arquitectura ligera event-driven
## Decisión
Usar arquitectura ligera event-driven (eventos internos) para desacoplar captura (voz/notas), tareas, planificación y notificaciones.
## Contexto
WALL-E necesita evolucionar (voz, calendario, notifs) sin romper flujos existentes.
## Consecuencias
- Servicios pueden publicar/escuchar eventos sin dependencias fuertes.
- Facilita añadir grabación o Google Calendar más adelante.
- Requiere catálogo de eventos y trazabilidad.
