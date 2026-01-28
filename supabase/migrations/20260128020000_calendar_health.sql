-- OAuth accounts for external providers (Google Calendar) and health metrics

create table if not exists public.oauth_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  scope text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger oauth_accounts_set_updated
before update on public.oauth_accounts
for each row execute function public.set_updated_at();

alter table public.oauth_accounts enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'oauth_accounts_owner_all' and schemaname = 'public'
  ) then
    create policy "oauth_accounts_owner_all" on public.oauth_accounts
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end$$;

-- Health metrics import (from Health Connect or other sources)
create table if not exists public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  source text not null default 'health_connect',
  steps int default 0,
  hr_avg numeric(6,2),
  sleep_minutes int,
  created_at timestamptz default now()
);

alter table public.health_metrics enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'health_metrics_owner_all' and schemaname = 'public'
  ) then
    create policy "health_metrics_owner_all" on public.health_metrics
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end$$;
