# Hub del proyecto (Asistente personal)

> Este canvas es nuestro “cuaderno”: ideas, decisiones y checklist de archivos.

## 0) Identidad
- **Nombre del proyecto:** *Asistente Personal* (codename: **Aster**)
- **Elevator pitch (1 frase):** Un asistente **por voz** y **proactivo** que captura notas/reuniones, crea tareas y recordatorios, y **optimiza tu agenda** (trabajo + personal) conectándose a **Google Calendar** y a un **correo dedicado**, incluyendo **plan de hogar** y cuidados de 3 perros.
- **Usuario principal:** Israel (trabajo + personal)
- **Contexto clave:** jornada **continua 8h** + 3 perros + tareas recurrentes de casa.
- **Problema que resolvemos:** Información dispersa + falta de seguimiento → tareas importantes se quedan a medias y la casa se desordena.
- **Métrica de éxito (propuesta):**
  - % notas/reuniones convertidas en tareas
  - % tareas VIP completadas el mismo día
  - adherencia a rutinas (casa/perros) sin fricción
  - nº recordatorios útiles vs molestos (feedback)

---

## 1) Backlog de ideas (captura rápida)

| Idea | Problema | Beneficio | Prioridad | Estado | Notas |
|---|---|---|---|---|---|
| Interacción por voz (push-to-talk) | Fricción al escribir | Captura inmediata | H | idea | “Hablar y listo” |
| Notas de voz → texto | Se pierden ideas | Historial buscable | H | idea | Timestamps + etiquetas |
| Recordatorios por voz | Olvidos | Acción a tiempo | H | idea | Lugar/hora/condición |
| Grabar reuniones + transcripción | Contexto perdido | Archivo completo | H | idea | Consentimiento + “REC” |
| Resumen + decisiones | Notas manuales | Claridad | H | idea | Plantillas por tipo |
| Extraer tareas (action items) | Acciones olvidadas | Seguimiento | H | idea | Dueño/fecha/confianza |
| Conectar Google Calendar | Agenda fragmentada | Contexto automático | H | idea | OAuth + scopes mínimos |
| **Planificador proactivo** (recomendaciones) | Sobrecarga | Mejor día | H | idea | Sugiere mover/recortar |
| Detectar “demasiado junto” (fatiga/conflictos) | Estrés | Prevención | H | idea | Señales + avisos |
| Rellenar huecos con foco | Tiempo muerto | Plan realista | H | idea | Bloques sugeridos |
| **Agenda de casa** (limpieza/mantenimiento) | Caos doméstico | Hogar controlado | H | idea | Plantillas por frecuencia |
| Auto-crear tareas domésticas + timeboxing | Falta rutina | Consistencia | H | idea | Ajusta a calendario |
| Rutina 3 perros (paseos/comida/vet) | Olvidos | Bienestar | H | idea | Reglas + recordatorios |
| Daily briefing (mañana) | Empiezo sin plan | Prioridades claras | H | idea | Agenda + Top tareas |
| Seguimiento VIP durante el día | Procrastinación | Cierre tareas clave | H | idea | Nudges + escalado |
| Quiet hours / no molestar | Notifs molestas | Mejor UX | H | idea | Reglas por contexto |
| Correo dedicado del asistente | Correos mezclados | Triage | M | idea | Labels + reglas |
| Búsqueda semántica ("¿qué se decidió?") | Difícil encontrar | Recuperación rápida | M | idea | Índice de notas/reuniones |

---

## 2) MVP propuesto (primera versión útil)
> Objetivo: **capturar por voz → convertir en acciones → planificar → seguimiento**.

### Historias (MVP)
- **MVP-01 (Voz notas):** “nota…” → guardar (audio + texto + tags).
- **MVP-02 (Tareas/recordatorios):** “recuérdame / tengo que…” → crear tarea (prioridad, due date).
- **MVP-03 (Calendario hoy):** ver agenda de hoy + huecos.
- **MVP-04 (Briefing diario):** briefing cada mañana: agenda + Top 3 VIP + riesgos.
- **MVP-05 (Seguimiento VIP):** si tarea es **Muy importante** o **Trabajo**, seguimiento hasta “hecha”.
- **MVP-06 (Casa v0):** generar **plan diario simple de casa** (15–45 min) en huecos razonables.

### Fuera de MVP (por ahora)
- “Autopilot” que mueve reuniones sin pedir permiso
- Se une a reuniones y graba por sí solo
- Automatización doméstica avanzada (inventario/compras automáticas)

---

## 3) Proactividad, prioridades y seguimiento

### 3.1 Prioridades
- **P0 / Muy importante (VIP):** trabajo crítico o personal urgente.
- **P1 / Importante:** relevante pero no crítico.
- **P2 / Normal:** backlog.

### 3.2 Etiquetas base
- `work`, `personal`, `home`, `dogs`, `health`, `finance`, `admin`

### 3.3 Seguimiento VIP (propuesta)
- Ventana de seguimiento: **08:30–20:30** (editable)
- Cadencia: 1er nudge a **+90 min** si no hay progreso → luego cada **2–3 h** (máx 4/día)
- Escalado: si se acerca el deadline (<= 2h) → nudge más directo + sugerir un hueco en calendario
- “No molestar”: durante reuniones, quiet hours, y ventanas que el usuario defina
- Comandos de control: **“posponer 2 horas”**, **“marcar como hecho”**, **“baja prioridad”**

### 3.4 Proactividad (modelo: "proactivo con control")
- El asistente **puede sugerir** mover tareas / crear bloques / reordenar.
- En v0, el asistente **no reprograma eventos existentes** sin confirmación explícita.
- Sí puede crear **propuestas de agenda** (A/B/C) y tú eliges.

### 3.5 Señales de “sobrecarga” (heurísticas iniciales)
- Demasiadas reuniones seguidas (p.ej. 3+ bloques sin descanso)
- Pocos huecos de foco (< 60–90 min en el día)
- Tareas VIP sin hueco asignado
- Día con > N compromisos personales + trabajo continuo

---

## 4) Casa y 3 perros (catálogo inicial)
> Esto se convierte en **plantillas** que se auto-generan según tu calendario.

### 4.1 Rutina perros (base)
- Paseo 1 (mañana): 15–30 min
- Paseo 2 (mediodía): 15–30 min
- Paseo 3 (tarde/noche): 20–40 min
- Comida (1–2 veces/día) + agua
- Semanal: higiene/cepillado
- Mensual: antiparasitario (si aplica)

### 4.2 Casa (ejemplo de plantilla)
- Diario (10–20 min): platos, encimera, barrido rápido, sacar basura (si toca)
- 2–3 veces/semana (20–40 min): aspirar, baño rápido
- Semanal (45–90 min): limpieza a fondo por zonas
- Quincenal/mensual: cristales, nevera, horno, etc.

### 4.3 Reglas de planificación doméstica
- Priorizar **micro-bloques** (10–25 min) en días cargados.
- Si el día está a tope, mover casa a “mínimo viable” + replanificar al siguiente hueco.
- Nunca colocar tareas domésticas dentro de tu **bloque de trabajo continuo (8h)**.

---

## 5) Event-driven (propuesta: sí, ligero)
> Eventos internos para desacoplar: voz/audio → transcripción → intent → tareas → briefing → notifs → planificación.

### 5.1 Catálogo de eventos
| Evento | Productor | Consumidor(es) | Payload | Versión | Notas |
|---|---|---|---|---|---|
| `VoiceInputCaptured` | VoiceUI | SpeechToText | audioUri, sessionId | v1 | push-to-talk |
| `TranscriptGenerated` | SpeechToText | IntentParser, Indexer | text, lang, sessionId | v1 | |
| `IntentParsed` | IntentParser | Task/Reminder/Notes | intentType, entities | v1 | NLU simple |
| `NoteCreated` | Notes | UI, Indexer | noteId, tags | v1 | |
| `TaskCreated` | TaskService | UI, Notifier | taskId, priority, due | v1 | |
| `TaskCompleted` | UI/TaskService | FollowUpEngine | taskId, completedAt | v1 | |
| `ReminderScheduled` | ReminderService | Notifier | reminderId, when | v1 | |
| `CalendarSynced` | CalendarSync | Planner | window, stats | v1 | incremental |
| `WorkScheduleImported` | CalendarSync | Planner | workBlocks[] | v1 | jornada 8h |
| `HouseholdTemplateApplied` | HomeService | Planner | templateId, chores[] | v1 | |
| `DogCareScheduled` | HomeService | Planner/Notifier | walks[], feeding[] | v1 | 3 perros |
| `PlanGenerated` | Planner | UI, Notifier | planId, date, blocks[] | v1 | agenda propuesta |
| `RescheduleSuggested` | Planner | UI | options[] | v1 | A/B/C |
| `DailyBriefingGenerated` | Briefing | Notifier, UI | briefingId, date | v1 | |
| `FollowUpTriggered` | FollowUpEngine | Notifier | taskId, level | v1 | VIP tracking |

### 5.2 Reglas rápidas
- Un evento = **hecho ocurrido** (pasado), nombre en pasado.
- Trazabilidad: `eventId`, `occurredAt`, `correlationId`.
- Versionado: compatibilidad hacia atrás cuando sea posible.

---

## 6) Lista de archivos a crear (MD + estructura)

### Root
- [ ] `README.md`
- [ ] `CONTRIBUTING.md`
- [ ] `CHANGELOG.md`
- [ ] `.gitignore`

### Documentación
- [ ] `docs/00-vision.md` (visión, usuarios, métricas)
- [ ] `docs/01-mvp.md` (MVP, in/out, roadmap)
- [ ] `docs/02-user-stories.md`
- [ ] `docs/03-ux-voice.md` (comandos, flows, fallback)
- [ ] `docs/04-architecture.md`
- [ ] `docs/05-domain-model.md`
- [ ] `docs/06-event-catalog.md`
- [ ] `docs/07-integrations-google.md` (Calendar/Gmail)
- [ ] `docs/08-notifications.md` (briefing, nudges, quiet hours)
- [ ] `docs/09-planning-engine.md` (proactividad + heurísticas)
- [ ] `docs/10-household.md` (catálogo casa + perros)
- [ ] `docs/11-security-privacy.md`
- [ ] `docs/12-data-model.md`
- [ ] `docs/13-deployment.md`

### Decisiones
- [ ] `docs/adr/0001-architecture-style.md`
- [ ] `docs/adr/0002-storage-and-encryption.md`
- [ ] `docs/adr/0003-privacy-and-consent.md`
- [ ] `docs/adr/0004-google-oauth-scopes.md`
- [ ] `docs/adr/0005-notification-strategy.md`
- [ ] `docs/adr/0006-voice-stt-tts.md`
- [ ] `docs/adr/0007-proactivity-and-automation.md`

---

## 7) Briefing diario (plantilla + ejemplos)

### 7.1 Plantilla (mañana)
1) **Agenda de hoy**
- Citas clave: médico/veterinario
- Reuniones especiales
- Eventos (calendario contiene “eventos”)
- Bloques de trabajo estimados (incluye día largo/doble si aplica)

2) **Acciones operativas (hotel / cocina)**
- ¿Hay que hacer **pedidos** para algún evento?
- Rutinas por día de semana (si toca): revisar apartados, etiquetados, tareas del equipo

3) **Top VIP (hoy)**
- Médico
- Veterinario
- Evento importante
- Cualquier tarea marcada como **Muy importante** o **Trabajo** con deadline hoy

4) **Huecos recomendados (y para qué usarlos)**
- Prioridad: **perros** (paseos ancla) + volver a casa si toca
- Luego: **máster** (programación/IA) en micro-bloques realistas (10–30 min)

5) **Plan propuesto (A/B/C)**
- **A (supervivencia):** casa mínimo 15 min + perros esencial + VIP
- **B (equilibrado):** A + 1 micro-bloque extra (máster o casa) si hay hueco
- **C (ambicioso):** solo si hay huecos largos

6) **Confirmación por voz**
- “Elige A/B/C” o “replanifica”

### 7.2 Ejemplos de briefing (voz)
**Día normal (sin eventos):**
- “Hoy tienes [agenda]. No hay eventos. VIP: [x]. Te propongo plan B: 15 min casa + 25 min máster a las [hora] + paseos en [horas]. ¿A/B/C?”

**Día largo (evento o doble turno):**
- “Hoy es día largo: empiezas a las [hora] y terminas sobre [hora]. Prioridad perros: paseo al despertar, antes de salir, al volver y uno corto al llegar. Plan A recomendado: casa 15 min, máster solo si aparece un hueco de 15–20 min. ¿Confirmas A?”

**Turno doble / caos:**
- “Día extremo. VIP: [x]. Hoy hacemos mínimo viable: perros esencial + casa 15 min. Te preparo opciones para mover ‘nevera/baño’ al día [X] con más hueco. ¿A?”

---

## 8) Rutinas de trabajo (cocina) por día de semana
> Estas rutinas generan tareas automáticamente si detectamos que ese día toca.

- **Domingo/Lunes:** recorrido de apartados → ¿falta pedido? ¿stock? ¿pendientes?
- **Jueves:** revisión fuerte de pedidos (eventos + base)
- **Diario (si aplica):** comprobar etiquetados, tareas del equipo, checklist de cierre

### 8.1 Plantillas de tareas (ejemplos)
- “Revisar stock cámaras / nevera / seco”
- “Revisar pedidos eventos (próx 7 días)”
- “Confirmar proveedores / entregas”
- “Revisar etiquetado y rotación”
- “Revisar tareas asignadas al equipo (checklist)”

---

## 9) Próximos pasos (los más valiosos ahora)
- [ ] Definir **palabra clave exacta** en calendario para activar modo evento (p.ej. “eventos” ✅)
- [ ] Crear **rutina perros** con duraciones (corta/media/larga) según día normal/largo
- [ ] Definir 3 plantillas de casa: **15 min / 30 min / 60–90 min**
- [ ] Escribir `docs/08-notifications.md` con plantilla de briefing y reglas de nudges
- [ ] Escribir `docs/09-planning-engine.md` con heurísticas: día normal/largo/extremo
- [ ] Redactar ADR-0007 (proactividad: qué automatiza vs qué pide confirmación)
