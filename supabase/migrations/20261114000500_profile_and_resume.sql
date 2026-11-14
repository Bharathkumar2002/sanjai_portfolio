-- =============================================================================
-- Profile details, layered banner images and résumé.
--  * workplace (defaults to Canto) and the mobile number (existing contact_phone)
--  * hero_background_image: the low-opacity artwork behind the banner photo
--  * contact_image: photo for the contact section (falls back to hero_image)
--  * résumé file metadata; the file itself lives in Storage under media/resume/
-- =============================================================================

alter table public.site_settings
  add column workplace             text not null default 'Canto' check (char_length(workplace) <= 120),
  add column hero_background_image text check (char_length(hero_background_image) <= 2048),
  add column contact_image         text check (char_length(contact_image) <= 2048),
  add column resume_url            text check (char_length(resume_url) <= 2048),
  add column resume_file_name      text check (char_length(resume_file_name) <= 200),
  add column resume_size_bytes     integer check (resume_size_bytes between 0 and 10485760),
  add column resume_updated_at     timestamptz;

-- Clear placeholders until the real name is provided.
alter table public.site_settings
  alter column designer_name set default '[Your Name]',
  alter column brand_name    set default '[Your Name]';

-- Storage: allow PDF résumés in addition to images.
update storage.buckets
  set allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml',
    'application/pdf'
  ]
  where id = 'media';

drop policy if exists "Admins upload media" on storage.objects;
create policy "Admins upload media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media'
    and (select public.is_admin())
    and (storage.foldername(name))[1] in ('projects', 'services', 'clients', 'site', 'profiles', 'resume')
  );
