-- Optional seed data for WALL-E
insert into public.profiles (id, display_name, timezone)
values
  ('00000000-0000-0000-0000-000000000000', 'Rai', 'Europe/Madrid')
on conflict (id) do nothing;

-- sample calendar events for today/tomorrow
with today as (
  select current_date as d
)
insert into public.calendar_events (user_id, title, start_at, end_at, is_evento, is_descanso, meta)
select
  '00000000-0000-0000-0000-000000000000',
  'eventos 100 pax',
  (t.d + time '10:00') at time zone 'Europe/Madrid',
  (t.d + time '18:00') at time zone 'Europe/Madrid',
  true,
  false,
  '{"location":"hotel","note":"prueba LONG"}'::jsonb
from today t
union all
select
  '00000000-0000-0000-0000-000000000000',
  'DESCANSO',
  (t.d + 1 + time '09:00') at time zone 'Europe/Madrid',
  (t.d + 1 + time '23:00') at time zone 'Europe/Madrid',
  false,
  true,
  '{}'::jsonb
from today t
union all
select
  '00000000-0000-0000-0000-000000000000',
  'Bloque trabajo',
  (t.d + time '08:00') at time zone 'Europe/Madrid',
  (t.d + time '12:00') at time zone 'Europe/Madrid',
  false,
  false,
  '{}'::jsonb
from today t;

-- sample tasks
insert into public.tasks (user_id, title, priority, tags, due_at, status, source)
values
  ('00000000-0000-0000-0000-000000000000', 'Pedir a proveedor', 'VIP', '{work}', now() + interval '4 hour', 'TODO', 'MANUAL'),
  ('00000000-0000-0000-0000-000000000000', 'Llevar a Nala al vet', 'VIP', '{health,dogs}', now() + interval '1 day', 'TODO', 'MANUAL'),
  ('00000000-0000-0000-0000-000000000000', 'Casa 15 min', 'NORMAL', '{home}', null, 'TODO', 'SYSTEM'),
  ('00000000-0000-0000-0000-000000000000', 'Master: repaso IA 20m', 'IMPORTANT', '{study}', now() + interval '2 day', 'TODO', 'MANUAL');

-- meeting note sample
insert into public.meeting_notes (user_id, title, summary, action_items)
values (
  '00000000-0000-0000-0000-000000000000',
  'Reunión proveedores',
  'Resumen rápido de prueba',
  '[{"title":"Confirmar pedido martes","priority":"IMPORTANT","tags":["work"]}]'::jsonb
) on conflict do nothing;

-- suggested blocks sample
insert into public.suggested_blocks (user_id, date, blocks)
values (
  '00000000-0000-0000-0000-000000000000',
  current_date,
  '[
    {"type":"DOG_WALK","label":"Paseo despertar","minutes":10},
    {"type":"HOUSE","label":"Casa 15","minutes":15},
    {"type":"STUDY","label":"Máster 20","minutes":20}
  ]'::jsonb
)
on conflict do nothing;

-- preferences seed
update public.profiles
set preferences = jsonb_build_object(
  'quiet_hours', '22:00-08:00',
  'allow_auto_off', true
),
allow_auto_off = true;
