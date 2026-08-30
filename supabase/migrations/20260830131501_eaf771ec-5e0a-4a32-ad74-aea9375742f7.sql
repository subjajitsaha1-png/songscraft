create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null default 'Untitled',
  prompt text not null default '',
  lyrics text,
  style_tags text[] not null default '{}',
  instrumental boolean not null default false,
  duration_seconds int,
  status text not null default 'pending' check (status in ('pending','processing','completed','failed')),
  audio_url text,
  cover_url text,
  provider_job_id text,
  error_message text,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.songs to authenticated;
grant all on public.songs to service_role;

alter table public.songs enable row level security;

create policy "Users can view their own songs" on public.songs for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert their own songs" on public.songs for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own songs" on public.songs for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own songs" on public.songs for delete to authenticated using (auth.uid() = user_id);

alter publication supabase_realtime add table public.songs;