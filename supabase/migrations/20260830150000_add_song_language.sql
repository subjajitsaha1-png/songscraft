-- Songs are now primarily generated in Indian languages/styles; track the
-- requested language explicitly so the generation prompt and any future
-- filtering/UI can use it directly instead of guessing from style tags.
alter table public.songs
  add column if not exists language text not null default 'hindi';
