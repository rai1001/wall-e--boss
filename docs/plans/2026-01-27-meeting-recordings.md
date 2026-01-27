# WALL-E – Grabación, Transcripción y Resumen de Reuniones (Gemini 2.5 Flash)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans task-by-task. Follow subagent-driven-development for each task.

**Goal:** Permitir subir/grabar audios de reuniones/notas, transcribirlos con Gemini 2.5 Flash (API Google GenAI) y generar resúmenes + action items que alimenten tareas/briefing.

**Architecture:** FastAPI expone endpoints de upload + transcribe/resume; audio se almacena temporalmente (disk/S3 stub). Llama a Gemini API vía `google-genai` Python SDK. Frontend Next.js agrega UI “Reuniones”: subida de archivo o captura micro (placeholder), muestra estado y resultados (transcript/resumen/action items). Todo mockeable con flag si no hay claves.

**Tech Stack:** FastAPI, google-genai SDK, pydantic, Next.js 14, fetch API, optional MediaRecorder (navigator). ENV: `GEMINI_API_KEY`.

---

### Task R1: Backend – Config Gemini client
**Files:** apps/api/app/config.py, app/services/gemini_client.py (nuevo), .env.example  
**Steps:**  
1) Añadir `GEMINI_API_KEY` a .env.example.  
2) Crear helper `get_gemini_client()` usando `google.genai`.  
3) Manejar error si no hay API key (levantar HTTP 503).

### Task R2: Backend – Modelo MeetingAudio + storage stub
**Files:** app/models.py, alembic migration, schemas.py, crud.py  
**Steps:**  
1) Tabla `meeting_audios` (id, title, source, file_path, status[pending/transcribed/failed], transcript, summary, action_items JSON, created_at).  
2) CRUD helpers create/update.  
3) Migration Alembic.

### Task R3: Backend – Endpoint upload
**Files:** app/routers/meetings.py (nuevo)  
**Steps:**  
1) `POST /meetings/upload` acepta `multipart/form-data` (file + title).  
2) Guarda en `temp/meetings/<uuid>.wav` (crear carpeta).  
3) Crea registro status=pending; devuelve id/status.  
4) Validar mime (wav/mp3/m4a/webm).  

### Task R4: Backend – Transcribe + resumir
**Files:** app/services/transcribe.py (nuevo), app/routers/meetings.py  
**Steps:**  
1) Servicio `transcribe_and_summarize(meeting_id)` lee file, llama Gemini `models.generate_content` con audio part + prompt: transcribe (idioma auto), incluir timestamps MM:SS, speaker diarization simple, luego resumen bullets y action items.  
2) Endpoint `POST /meetings/{id}/process` dispara tarea síncrona (v0).  
3) Actualiza status/transcript/summary/action_items.  
4) Manejo de errores: marca failed y reason.  

### Task R5: Backend – GET meeting results
**Files:** app/routers/meetings.py, schemas.py  
**Steps:**  
1) `GET /meetings/{id}` retorna transcript, summary, action_items, status.  
2) `GET /meetings` lista últimos N.  

### Task R6: Frontend – UI página “Reuniones”
**Files:** apps/web/app/meetings/page.tsx, components/MeetingUpload.tsx, MeetingList.tsx  
**Steps:**  
1) Form upload (archivo + título) → POST `/meetings/upload`; muestra status.  
2) Botón “Procesar” llama `/meetings/{id}/process`; muestra spinner.  
3) Lista resultados: transcript collapsible, resumen y action items (convertir action items en lista de tareas sugeridas).  
4) Si API no disponible, fallback mock.  

### Task R7: Frontend – Hook API client
**Files:** apps/web/lib/api.ts  
**Steps:**  
1) Funciones `uploadMeeting`, `processMeeting`, `getMeeting`, `listMeetings`.  
2) Manejar errores/redirecciones.  

### Task R8: Integración con tareas (opcional v0.1)
**Files:** app/routers/meetings.py, crud.py, routers/tasks.py  
**Steps:**  
1) Endpoint `POST /meetings/{id}/export-tasks` crea Task por cada action_item (priority=Important, tag=work).  
2) En UI botón “Crear tareas” por meeting.  

### Task R9: Tests backend
**Files:** apps/api/tests/test_meetings.py  
**Steps:**  
1) Test upload -> pending status.  
2) Mock Gemini client para transcribe; assert summary/action_items set; status=transcribed.  
3) Test export-tasks crea Tasks.  

### Task R10: Lint/Docs
**Files:** README.md, docs/08-integrations-google.md, docs/09-notifications.md  
**Steps:**  
1) Documentar uso `GEMINI_API_KEY`, formatos soportados y límites (<=10 min free per prompt; audio per prompt 9.5h but billable; see quota).  
2) Update ADR-0006 (voz) con Gemini audio.  
3) `pnpm lint`, `pytest`.  

---

Notas de operación:  
- Model recomendado: `gemini-2.5-flash` (rápido, audio). Para mejor timestamps usar `gemini-2.5-pro` si disponible.  
- Límites: audio máx ~8.4–9.5h / prompt; 1 archivo/prompt; 32 tokens/seg (coste).  
- Riesgos: timestamps inestables en Gemini 3 (véase reports comunidad dic 2025), considerar formato MM:SS en prompt y fallback a 2.5.  

Listo para ejecución por subagentes.***
