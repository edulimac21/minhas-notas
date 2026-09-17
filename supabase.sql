create table if not exists public.notes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.notes enable row level security;
create policy "le propria nota" on public.notes for select using (auth.uid() = user_id);
create policy "cria propria nota" on public.notes for insert with check (auth.uid() = user_id);
create policy "altera propria nota" on public.notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);