-- Base schema for WALL-E (Supabase)
-- Run with: supabase db reset/apply

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- helper to keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text default 'Rai',
  timezone text default 'Europe/Madrid',
  created_at timestamptz default now()
);

-- tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  priority text not null check (priority in ('VIP','IMPORTANT','NORMAL')),
  tags text[] not null default '{}',
  due_at timestamptz null,
  status text not null check (status in ('TODO','DOING','DONE','SNOOZED')) default 'TODO',
  source text not null check (source in ('MANUAL','VOICE','CALENDAR','SYSTEM')) default 'MANUAL',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger tasks_set_updated
before update on public.tasks
for each row
execute function public.set_updated_at();

-- calendar_events (mockable)
create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  is_evento boolean not null default false,
  is_descanso boolean not null default false,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

-- day_state
create table public.day_state (
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  day_type text not null check (day_type in ('NORMAL','LONG','EXTREME','OFF')) default 'NORMAL',
  off_confirmed boolean not null default false,
  suspected_off boolean not null default false,
  notes text null,
  updated_at timestamptz default now(),
  primary key (user_id, date)
);

create trigger day_state_set_updated
before update on public.day_state
for each row
execute function public.set_updated_at();

-- plans
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  option text not null check (option in ('A','B','C')),
  summary text not null,
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  unique (user_id, date, option)
);

-- briefings
create table public.briefings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  style text not null check (style in ('FAMILY','WORK')),
  text text not null,
  created_at timestamptz default now(),
  unique (user_id, date, style)
);

-- followups
create table public.followups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  level int not null default 1,
  next_at timestamptz not null,
  active boolean not null default true,
  last_sent_at timestamptz null,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.calendar_events enable row level security;
alter table public.day_state enable row level security;
alter table public.plans enable row level security;
alter table public.briefings enable row level security;
alter table public.followups enable row level security;

-- policies: profiles only self
create policy "profiles_self_select" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid());

-- generic policies by user_id
create policy "tasks_owner_all" on public.tasks
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "calendar_owner_all" on public.calendar_events
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "day_owner_all" on public.day_state
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "plans_owner_all" on public.plans
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "briefings_owner_all" on public.briefings
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "followups_owner_all" on public.followups
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- seed helper: create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Rai'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
