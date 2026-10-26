-- À exécuter dans Supabase > SQL Editor.
-- Les seuls accès navigateur autorisés sont la lecture des formations publiées
-- et les opérations d'un utilisateur authentifié inscrit dans manager_access.

create table if not exists public.manager_access (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.manager_access enable row level security;
grant select on public.manager_access to authenticated;

drop policy if exists "Managers can read their own access" on public.manager_access;
create policy "Managers can read their own access"
  on public.manager_access for select
  to authenticated
  using (user_id = (select auth.uid()));

create table if not exists public.formations (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 5000),
  training_date date not null,
  weekdays smallint[] not null check (
    cardinality(weekdays) between 1 and 7
    and weekdays <@ array[1,2,3,4,5,6,7]::smallint[]
  ),
  start_time time not null,
  end_time time not null check (end_time > start_time),
  location text not null default '',
  published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Safe to re-run on an existing project: add the field without removing records.
alter table public.formations
  add column if not exists location text not null default '';

-- Existing rows are retained; the constraint applies to new and updated rows.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.formations'::regclass
      and conname = 'formations_location_allowed'
  ) then
    alter table public.formations
      add constraint formations_location_allowed
      check (location in ('Lycée El Moutanabbi', 'Association Iligh')) not valid;
  end if;
end
$$;

alter table public.formations enable row level security;
grant select on public.formations to anon, authenticated;
grant insert, update, delete on public.formations to authenticated;

drop policy if exists "Anyone can read published formations" on public.formations;
create policy "Anyone can read published formations"
  on public.formations for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Managers can insert formations" on public.formations;
create policy "Managers can insert formations"
  on public.formations for insert
  to authenticated
  with check (
    exists (select 1 from public.manager_access where user_id = (select auth.uid()))
    and created_by = (select auth.uid())
  );

drop policy if exists "Managers can update formations" on public.formations;
create policy "Managers can update formations"
  on public.formations for update
  to authenticated
  using (exists (select 1 from public.manager_access where user_id = (select auth.uid())))
  with check (exists (select 1 from public.manager_access where user_id = (select auth.uid())));

drop policy if exists "Managers can delete formations" on public.formations;
create policy "Managers can delete formations"
  on public.formations for delete
  to authenticated
  using (exists (select 1 from public.manager_access where user_id = (select auth.uid())));
