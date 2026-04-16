create table public.mailing_list (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'download',
  created_at timestamptz default now()
);

alter table public.mailing_list enable row level security;
