-- Doctors -------------------------------------------------------------
create table if not exists public.doctors (
  id              text primary key,
  name            text not null,
  title           text not null,
  image           text not null,
  email           text not null,
  education_tr    text[] not null default '{}',
  education_en    text[] not null default '{}',
  education_ar    text[],
  bio_tr          text not null default '',
  bio_en          text not null default '',
  bio_ar          text,
  bio_ru          text not null default '',
  bio_ka          text not null default '',
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- News ----------------------------------------------------------------
create table if not exists public.news (
  id              uuid primary key default gen_random_uuid(),
  image           text not null,
  name_tr         text not null default '',
  name_en         text not null default '',
  name_ar         text not null default '',
  name_ru         text not null default '',
  name_ka         text not null default '',
  designation_tr  text not null default '',
  designation_en  text not null default '',
  designation_ar  text not null default '',
  designation_ru  text not null default '',
  designation_ka  text not null default '',
  quote_tr        text not null default '',
  quote_en        text not null default '',
  quote_ar        text not null default '',
  quote_ru        text not null default '',
  quote_ka        text not null default '',
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Units (Birimler) ----------------------------------------------------
create table if not exists public.units (
  id          uuid primary key default gen_random_uuid(),
  tr          text not null,
  en          text not null,
  ar          text not null,
  ru          text not null,
  ka          text not null,
  type        text not null check (type in ('surgical','internal')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Doctor ↔ Unit (çoklu branş) -----------------------------------------
create table if not exists public.doctor_units (
  doctor_id   text not null references public.doctors(id) on delete cascade,
  unit_id     uuid not null references public.units(id)   on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (doctor_id, unit_id)
);

-- Row Level Security: public READ, writes only via service role --------
alter table public.doctors      enable row level security;
alter table public.news         enable row level security;
alter table public.units        enable row level security;
alter table public.doctor_units enable row level security;

drop policy if exists "public read doctors" on public.doctors;
create policy "public read doctors" on public.doctors for select using (true);

drop policy if exists "public read news" on public.news;
create policy "public read news" on public.news for select using (true);

drop policy if exists "public read units" on public.units;
create policy "public read units" on public.units for select using (true);

drop policy if exists "public read doctor_units" on public.doctor_units;
create policy "public read doctor_units" on public.doctor_units for select using (true);
-- (No insert/update/delete policies: the service-role key bypasses RLS;
--  the anon key therefore cannot write.)

-- Storage bucket for uploaded images ----------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
