-- =============================================================================
-- Row Level Security
--
--  * Visitors (anon) can read published portfolio content and site settings.
--  * Visitors submit contact messages only through submit_contact_message(),
--    which validates input and applies duplicate / rate-limit checks.
--  * Only users whose profile has role = 'admin' can modify anything or read
--    contact messages. A signed-in non-admin has the same rights as a visitor.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- is_admin(): security definer so policies can read profiles without
-- recursing into the profiles RLS policies.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.projects          enable row level security;
alter table public.project_images    enable row level security;
alter table public.services          enable row level security;
alter table public.clients           enable row level security;
alter table public.site_settings     enable row level security;
alter table public.contact_messages  enable row level security;

-- Defence in depth: visitors never write directly to any table.
revoke insert, update, delete, truncate on all tables in schema public from anon;
-- Contact messages are only ever inserted through the RPC below.
revoke insert on public.contact_messages from authenticated;
-- Nobody but the database owner may truncate.
revoke truncate on all tables in schema public from authenticated;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy "Users read own profile; admins read all"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

-- Only admins can change profiles (prevents users promoting themselves).
create policy "Admins update profiles"
  on public.profiles for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create policy "Published projects are public"
  on public.projects for select
  to anon, authenticated
  using (is_published or (select public.is_admin()));

create policy "Admins insert projects"
  on public.projects for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins update projects"
  on public.projects for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins delete projects"
  on public.projects for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- project_images: visible when the parent project is visible
-- ---------------------------------------------------------------------------
create policy "Images of published projects are public"
  on public.project_images for select
  to anon, authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.projects p
      where p.id = project_images.project_id and p.is_published
    )
  );

create policy "Admins insert project images"
  on public.project_images for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins update project images"
  on public.project_images for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins delete project images"
  on public.project_images for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create policy "Published services are public"
  on public.services for select
  to anon, authenticated
  using (is_published or (select public.is_admin()));

create policy "Admins insert services"
  on public.services for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins update services"
  on public.services for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins delete services"
  on public.services for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------
create policy "Published clients are public"
  on public.clients for select
  to anon, authenticated
  using (is_published or (select public.is_admin()));

create policy "Admins insert clients"
  on public.clients for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins update clients"
  on public.clients for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins delete clients"
  on public.clients for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- site_settings (single row; readable by everyone)
-- ---------------------------------------------------------------------------
create policy "Site settings are public"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Admins insert site settings"
  on public.site_settings for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins update site settings"
  on public.site_settings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- contact_messages: admins only (inserts go through the RPC)
-- ---------------------------------------------------------------------------
create policy "Admins read messages"
  on public.contact_messages for select to authenticated
  using ((select public.is_admin()));

create policy "Admins update messages"
  on public.contact_messages for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins delete messages"
  on public.contact_messages for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- submit_contact_message(): the only way visitors can create a message.
-- Validates input, rejects duplicates and rate-limits by email and IP hash.
-- Errors are raised with stable message codes the app maps to friendly text.
-- ---------------------------------------------------------------------------
create or replace function public.submit_contact_message(
  p_name          text,
  p_email         text,
  p_subject       text,
  p_message       text,
  p_project_type  text default null,
  p_ip_hash       text default null,
  p_user_agent    text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name     text := btrim(coalesce(p_name, ''));
  v_email    text := lower(btrim(coalesce(p_email, '')));
  v_subject  text := btrim(coalesce(p_subject, ''));
  v_message  text := btrim(coalesce(p_message, ''));
  v_type     text := nullif(btrim(coalesce(p_project_type, '')), '');
  v_ip       text := nullif(btrim(coalesce(p_ip_hash, '')), '');
  v_id       uuid;
begin
  if char_length(v_name) not between 2 and 120 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;
  if char_length(v_email) > 254 or v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if char_length(v_subject) not between 2 and 160 then
    raise exception 'invalid_subject' using errcode = '22023';
  end if;
  if char_length(v_message) not between 10 and 5000 then
    raise exception 'invalid_message' using errcode = '22023';
  end if;
  if v_type is not null and char_length(v_type) > 80 then
    raise exception 'invalid_project_type' using errcode = '22023';
  end if;

  -- Same sender, same message within 24h: treat as a duplicate submission.
  if exists (
    select 1 from public.contact_messages m
    where m.email = v_email
      and md5(m.message) = md5(v_message)
      and m.created_at > now() - interval '24 hours'
  ) then
    raise exception 'duplicate_message' using errcode = 'P0001';
  end if;

  -- Rate limits: 3 per email per hour, 5 per IP per hour, 100 site-wide per hour.
  if (select count(*) from public.contact_messages m
      where m.email = v_email and m.created_at > now() - interval '1 hour') >= 3
     or (v_ip is not null and (select count(*) from public.contact_messages m
      where m.ip_hash = v_ip and m.created_at > now() - interval '1 hour') >= 5)
     or (select count(*) from public.contact_messages m
      where m.created_at > now() - interval '1 hour') >= 100
  then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.contact_messages (name, email, subject, project_type, message, ip_hash, user_agent)
  values (v_name, v_email, v_subject, v_type, v_message, left(v_ip, 128), left(p_user_agent, 512))
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text, text, text, text) to anon, authenticated;
