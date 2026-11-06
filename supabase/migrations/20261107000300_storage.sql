-- =============================================================================
-- Storage: one public bucket, "media", organised by folder:
--   projects/  services/  clients/  site/  profiles/
-- Files are publicly readable by URL (the bucket is public) but cannot be
-- listed by visitors. Only admins can upload, replace or delete files.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins read media objects"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "Admins upload media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media'
    and (select public.is_admin())
    and (storage.foldername(name))[1] in ('projects', 'services', 'clients', 'site', 'profiles')
  );

create policy "Admins update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "Admins delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
