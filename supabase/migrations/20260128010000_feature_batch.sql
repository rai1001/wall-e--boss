-- Preferences and meeting notes additions

alter table public.profiles
  add column if not exists preferences jsonb not null default '{}'::jsonb,
  add column if not exists followup_window text not null default '08:30-20:30',
  add column if not exists walk_minutes_min int not null default 10,
  add column if not exists walk_minutes_max int not null default 15,
  add column if not exists allow_auto_off boolean not null default false;

-- Meeting notes
create table if not exists public.meeting_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  transcript text null,
  summary text null,
  action_items jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.meeting_notes enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'meeting_notes_owner_all' and schemaname = 'public'
  ) then
    create policy "meeting_notes_owner_all" on public.meeting_notes
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end$$;

-- Suggested blocks per day
create table if not exists public.suggested_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  unique (user_id, date)
);

alter table public.suggested_blocks enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'suggested_blocks_owner_all' and schemaname = 'public'
  ) then
    create policy "suggested_blocks_owner_all" on public.suggested_blocks
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end$$;
