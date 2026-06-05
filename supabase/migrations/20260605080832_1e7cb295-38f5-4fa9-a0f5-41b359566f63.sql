create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  type text not null,
  scope text not null,
  budget text not null,
  timeline text not null,
  goals text[] not null default '{}',
  message text,
  source text default 'studio-wizard',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

grant insert on public.leads to anon, authenticated;
grant all on public.leads to service_role;

alter table public.leads enable row level security;

create policy "leads_public_insert"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

create index leads_created_at_idx on public.leads (created_at desc);