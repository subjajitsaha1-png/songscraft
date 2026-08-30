create policy "Users can read their own song files"
  on storage.objects for select to authenticated
  using (bucket_id = 'songs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can upload their own song files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'songs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own song files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'songs' and (storage.foldername(name))[1] = auth.uid()::text);