# ADR 0002 - Almacenamiento y cifrado
## Decisión
Datos en Postgres; secretos via `.env`; sin claves reales en repo. Cifrado en reposo delegado a infraestructura (no implementado en v0).
## Contexto
MVP con datos personales limitados; prioridad es no exponer credenciales.
## Consecuencias
- Facil migrar a KMS/Secret Manager en futuro.
- Necesario limpiar datos mock en prod.
