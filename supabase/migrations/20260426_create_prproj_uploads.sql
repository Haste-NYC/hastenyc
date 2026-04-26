create table public.prproj_uploads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  file_name text not null,
  file_size bigint not null,
  storage_path text not null,
  premiere_version text,
  created_at timestamptz not null default now()
);

create index prproj_uploads_email_idx on public.prproj_uploads (email);
create index prproj_uploads_created_at_idx on public.prproj_uploads (created_at desc);

alter table public.prproj_uploads enable row level security;
