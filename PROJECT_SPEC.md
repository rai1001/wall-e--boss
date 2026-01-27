# WALL-E (Asistente personal) — PROJECT_SPEC

> Documento vivo: requisitos, ideas y checklist para implementar WALL-E.

## 0) Identidad
- **Nombre del asistente/app:** **WALL-E** (W-A-L-L- -E)
- **Cómo llama al usuario:** **Rai**
- **Tratamiento (voz/tono):**
  - **Familia (default):** tuteo, cercano, protector, sin juicio.
  - **Trabajo/reuniones:** tuteo igual, **corto y normal**, sin enrollarse.
- **Personalidad objetivo:** ética primero + “uno más de la familia”; **perros = prioridad permanente**.
- **Contexto clave:** hotel 24/7, turnos variables por **eventos**, días largos hasta madrugada, 3 perros (pugs), estudio de máster IA en huecos.
- **Métrica de éxito (propuesta):**
  - % notas/reuniones convertidas en tareas
  - % tareas VIP completadas el mismo día
  - adherencia a rutinas (casa/perros) sin fricción
  - nº recordatorios útiles vs molestos (feedback)

### 0.1 Reglas obligatorias (core)
- **Modo evento:** si el título del evento del calendario contiene **“eventos”** → activar “modo evento”.
- **Libranza:** si el título contiene **“DESCANSO”** → “modo libranza”.
  - Si WALL-E detecta un **hueco sospechoso** y no ve trabajo/eventos → pregunta: **“Rai, ¿hoy libras?”** y si confirmas, propone/crea “DESCANSO” (según política de aprobación).
- **Proactividad con control:** WALL-E puede **proponer y crear bloques**; cualquier movimiento/cambio real requiere **aprobación explícita de Rai**.
- **Privacidad/ética:** grabación de reuniones solo con consentimiento; explicar en 1 frase cuando pida permiso para acciones sensibles.

---

## 1) Backlog de ideas (captura rápida)

| Idea | Problema | Beneficio | Prioridad | Estado | Notas |
|---|---|---|---|---|---|
| Interacción por voz (push-to-talk) | Fricción al escribir | Captura inmediata | H | idea | “Hablar y listo” |
| Notas de voz → texto | Se pierden ideas | Historial buscable | H | idea | Timestamps + etiquetas |
| Recordatorios por voz | Olvidos | Acción a tiempo | H | idea | Lugar/hora/condición |
| Grabar reuniones + transcripción | Contexto perdido | Archivo completo | H | idea | Consentimiento + indicador “REC” |
| Resumen + decisiones | Notas manuales | Claridad | H | idea | Plantillas por tipo |
| Extraer tareas (action items) | Acciones olvidadas | Seguimiento | H | idea | Dueño/fecha/confianza |
| Conectar Google Calendar | Agenda fragmentada | Contexto automático | H | idea | OAuth + scopes mínimos |
| Correo dedicado del asistente | Correos mezclados | Triage | M | idea | Labels + borradores con aprobación |
| **Planificador proactivo** (recomendaciones) | Sobrecarga | Mejor día | H | idea | Sugiere mover/recortar |
| Detectar “demasiado junto” (fatiga/conflictos) | Estrés | Prevención | H | idea | Señales + avisos |
| Rellenar huecos con foco | Tiempo muerto | Plan realista | H | idea | Bloques sugeridos |
| **Agenda de casa** (limpieza/mantenimiento) | Caos doméstico | Hogar controlado | H | idea | Plantillas por frecuencia |
| Auto-crear tareas domésticas + timeboxing | Falta rutina | Consistencia | H | idea | Ajusta a calendario |
| Rutina 3 perros (paseos/comida/vet) | Olvidos | Bienestar | H | idea | Pugs: paseos cortos |
| Daily briefing (mañana) | Empiezo sin plan | Prioridades claras | H | idea | Agenda + Top tareas |
| Seguimiento VIP durante el día | Procrastinación | Cierre tareas clave | H | idea | Nudges + escalado |
| Quiet hours / no molestar | Notifs molestas | Mejor UX | H | idea | Reglas por contexto |
| Búsqueda semántica (“¿qué se decidió?”) | Difícil encontrar | Recuperación rápida | M | idea | Índice de notas/reuniones |
| **Añadir tareas a mano** (UI rápida) | No todo es por voz | Control total | H | idea | título, prioridad, fecha, tags |
| **Vista semanal** (planificación) | Falta visión | Mejor organización | H | idea | timeboxing o lista por día |
| **Vista mensual** (largo plazo) | Planificar a futuro | Anticipación | M | idea | destacar días largos/eventos |

---

## 2) MVP propuesto (primera versión útil)
> Objetivo: **capturar por voz → convertir en acciones → planificar → seguimiento**.

### Historias (MVP)
- **MVP-01 (Voz notas):** “nota…” → guardar (audio + texto + tags).
- **MVP-02 (Tareas/recordatorios por voz):** “recuérdame / tengo que…” → crear tarea (prioridad, due date).
- **MVP-03 (Tareas manuales):** crear/editar tareas a mano (título, prioridad, etiquetas work/home/dogs, fecha).
- **MVP-04 (Calendario hoy):** ver agenda de hoy + detectar modo evento/libranza + huecos.
- **MVP-05 (Briefing diario):** briefing cada mañana: agenda + Top VIP + riesgos + propuesta A/B/C.
- **MVP-06 (Seguimiento VIP):** si tarea es **Muy importante** o **Trabajo**, seguimiento hasta “hecha”.
- **MVP-07 (Casa v0):** generar plan diario simple de casa (15–45 min) en huecos razonables.
- **MVP-08 (Planificación semanal):** vista semanal simple para planificar (tareas, bloques, casa/perros).

### Fuera de MVP (por ahora)
- Se une a reuniones y graba por sí solo
- Autopilot sin aprobación (mover reuniones, enviar emails)
- Automatización doméstica avanzada (inventario/compras automáticas)

---

## 3) Proactividad, prioridades y seguimiento

### 3.1 Prioridades
- **VIP (Muy importante):** trabajo crítico o personal urgente.
- **Importante**
- **Normal**

### 3.2 Etiquetas base
- `work`, `personal`, `home`, `dogs`, `health`, `finance`, `admin`, `study`

### 3.3 Seguimiento VIP (propuesta)
- Ventana de seguimiento: **08:30–20:30** (editable)
- Cadencia: 1er nudge a **+90 min** si no hay progreso → luego cada **2–3 h** (máx 4/día)
- Escalado: si se acerca el deadline (<= 2h) → nudge más directo + sugerir hueco/calendario
- “No molestar”: durante reuniones/servicio, quiet hours, y ventanas que Rai defina
- Comandos: **“posponer 2 horas”**, **“marcar como hecho”**, **“baja prioridad”**

### 3.4 Proactividad (“proactivo con control”)
- WALL-E puede **crear propuestas** y **bloques sugeridos**.
- Cualquier acción que **mueva o cambie** el calendario/tareas ajenas/correos: **requiere aprobación**.
- En días extremos, reduce objetivos a “mínimo viable” y propone replanificación.

---

## 4) Casa y 3 perros (pugs)
- Perros: **Akira** (padre), **Nala** (madre), **Kal‑El** (hijo).
- Paseos: **10 min ideal** / **15 min máximo**.

### 4.1 Paseos por tipo de día
- **Día normal:** 4 paseos cortos (10–15 min) si se puede.
- **Día largo (evento/turno extendido):** 3 paseos cortos + 1 opcional si hay hueco/energía.
- **Día extremo (doble turno):** 3 paseos “esenciales” (mañana / vuelta / al llegar o noche).

### 4.2 Anclas (por defecto)
- Al despertarte
- Antes de salir al trabajo
- A la vuelta del trabajo
- Por la noche (y si hay turno noche, al llegar a casa)

### 4.3 Casa — plantillas
- **15 min (mínimo viable):** platos/encimera, barrido rápido, basura si toca.
- **30 min (normal):** 15 min + baño rápido o aspirado rápido.
- **60 min (general):** limpieza por zonas (cocina/baño/salón) + extras por rotación.
- **Profunda (cuando haya mucho tiempo):** puertas/ventanas, cocina a fondo, baño a fondo, etc.

### 4.4 Reglas de planificación doméstica
- Priorizar micro-bloques (10–25 min) en días cargados.
- Si el día está a tope: casa = mínimo viable y replanificar.
- No meter casa dentro de bloques de trabajo/servicio.

---

## 5) Heurísticas para clasificar el día (normal/largo/extremo)

### 5.1 Señales de “sobrecarga”
- Varios eventos “eventos” el mismo día
- Jornada que termina muy tarde (hasta 00:30–02:00)
- Pocos huecos reales (< 60–90 min)
- Tareas VIP sin hueco asignado

### 5.2 Eventos grandes (cocina)
- Si hay un evento grande (ej. “eventos 100 pax” o similar), marcar **2 días largos** (producción + cierre) aunque el calendario marque 8h: asumir buffer.

---

## 6) Briefing diario (plantilla)
### 6.1 Plantilla (mañana)
1) **Agenda de hoy**
   - médico/veterinario, reuniones especiales
   - “eventos” / “DESCANSO”
   - indicador de día normal/largo/extremo
2) **Operativa (hotel/cocina) — dinámica**
   - Si hay “eventos”: pedidos + prep + check etiquetados crítico
   - Si no hay “eventos”: operación base (stock rápido + rotación + tareas equipo)
   - Si es largo/extremo: mínimo imprescindible (apaga fuegos)
3) **Top VIP**
   - médico/vet/evento importante + tareas VIP con deadline hoy
4) **Huecos recomendados (prioridad)**
   - perros (anclas)
   - descanso si día largo
   - máster IA (micro-bloques 10–30 min) si hueco limpio
5) **Plan A/B/C**
   - **A:** supervivencia (perros esencial + VIP + casa 15)
   - **B:** A + 1 micro-bloque extra (máster o casa) si hay hueco
   - **C:** solo si hay huecos largos reales
6) **Confirmación**
   - “¿A, B o C?” + comandos: posponer / hecho / replanifica

### 6.2 Estilo de voz (ejemplo corto, trabajo)
- “Rai: hoy hay eventos y pinta día largo. Operativa: pedidos + prep + etiquetado crítico. Perros esencial. Casa 15. ¿Plan A?”

---

## 7) Arquitectura (event-driven ligera)
> Eventos internos para desacoplar: voz → transcripción → intent → tareas → planificación → briefing → notificaciones.

### 7.1 Catálogo de eventos (internos)
- `VoiceInputCaptured`
- `TranscriptGenerated`
- `IntentParsed`
- `NoteCreated`
- `TaskCreated`
- `TaskCompleted`
- `ReminderScheduled`
- `CalendarSynced`
- `OffDaySuspected` (detecta hueco sospechoso)
- `OffDayConfirmed` (Rai confirma “libro”)
- `WorkScheduleImported`
- `HouseholdTemplateApplied`
- `DogCareScheduled`
- `PlanGenerated`
- `RescheduleSuggested`
- `DailyBriefingGenerated`
- `FollowUpTriggered`

---

## 8) Lista de archivos a crear (MD + estructura)

### Root
- [ ] `README.md`
- [ ] `PROJECT_SPEC.md` (este documento)
- [ ] `CONTRIBUTING.md`
- [ ] `CHANGELOG.md`
- [ ] `.gitignore`

### Documentación
- [ ] `docs/00-vision.md`
- [ ] `docs/01-mvp.md`
- [ ] `docs/02-user-stories.md`
- [ ] `docs/03-ux-voice.md`
- [ ] `docs/04-ux-planning-views.md` (tareas manuales + vistas día/semana/mes)
- [ ] `docs/05-architecture.md`
- [ ] `docs/06-domain-model.md`
- [ ] `docs/07-event-catalog.md`
- [ ] `docs/08-integrations-google.md`
- [ ] `docs/09-notifications.md`
- [ ] `docs/10-planning-engine.md`
- [ ] `docs/11-household.md`
- [ ] `docs/12-security-privacy.md`
- [ ] `docs/13-data-model.md`
- [ ] `docs/14-deployment.md`

### Decisiones (ADRs)
- [ ] `docs/adr/0001-architecture-style.md`
- [ ] `docs/adr/0002-storage-and-encryption.md`
- [ ] `docs/adr/0003-privacy-and-consent.md`
- [ ] `docs/adr/0004-google-oauth-scopes.md`
- [ ] `docs/adr/0005-notification-strategy.md`
- [ ] `docs/adr/0006-voice-stt-tts.md`
- [ ] `docs/adr/0007-proactivity-and-automation.md`

---

## 9) Próximos pasos (los más valiosos ahora)
- [x] Palabra clave en calendario para modo evento: **“eventos”**
- [x] Paseos pugs: **10 min ideal / 15 min máximo**
- [x] Casa: plantillas **15 / 30 / 60** + profunda cuando haya tiempo
- [ ] Escribir `docs/09-notifications.md` (briefing + estilo familia/trabajo corto)
- [ ] Escribir `docs/10-planning-engine.md` (normal/largo/extremo + Plan A/B/C)
- [ ] ADR-0007: proactividad (proponer/crear bloques; mover/cambiar requiere aprobación de Rai)
