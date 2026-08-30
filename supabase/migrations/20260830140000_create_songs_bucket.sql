-- The earlier storage migration added RLS policies for the "songs" bucket
-- but never created the bucket itself, so any audio upload/signed-URL call
-- was failing against a bucket that doesn't exist.
insert into storage.buckets (id, name, public)
values ('songs', 'songs', false)
on conflict (id) do nothing;
