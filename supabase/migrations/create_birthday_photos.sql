create table if not exists public.birthday_photos (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  label text not null default '',
  url text not null,
  imagekit_file_id text,
  created_at timestamptz not null default now(),
  constraint birthday_photos_year_check check (year between 2000 and 2100)
);

create index if not exists birthday_photos_year_created_at_idx
  on public.birthday_photos (year, created_at desc);

create unique index if not exists birthday_photos_imagekit_file_id_uniq
  on public.birthday_photos (imagekit_file_id)
  where imagekit_file_id is not null;

alter table public.birthday_photos enable row level security;

create policy "Public can read birthday photos"
  on public.birthday_photos
  for select
  using (true);

