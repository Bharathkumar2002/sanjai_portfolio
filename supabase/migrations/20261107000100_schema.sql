-- =============================================================================
-- Portfolio schema: tables, constraints, indexes, timestamps.
-- RLS policies live in 20261107000200_security.sql, storage in ..._storage.sql.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user. `role = 'admin'` grants dashboard access.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text check (char_length(full_name) <= 120),
  avatar_url  text check (char_length(avatar_url) <= 2048),
  role        text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile automatically for every new auth user (role defaults to viewer).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users that existed before this migration ran.
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table public.projects (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(btrim(title)) between 1 and 160),
  slug               text not null unique
                       check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  category           text not null check (char_length(btrim(category)) between 1 and 60),
  short_description  text not null default '' check (char_length(short_description) <= 320),
  description        text not null default '' check (char_length(description) <= 10000),
  cover_image        text check (char_length(cover_image) <= 2048),
  client_name        text check (char_length(client_name) <= 120),
  project_year       smallint check (project_year between 1950 and 2100),
  design_process     text not null default '' check (char_length(design_process) <= 10000),
  challenges         text not null default '' check (char_length(challenges) <= 10000),
  outcome            text not null default '' check (char_length(outcome) <= 10000),
  is_featured        boolean not null default false,
  is_published       boolean not null default false,
  display_order      integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index projects_published_order_idx on public.projects (is_published, display_order, created_at desc);
create index projects_featured_idx on public.projects (display_order) where is_published and is_featured;
create index projects_category_idx on public.projects (category);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- project_images: gallery images belonging to a project
-- ---------------------------------------------------------------------------
create table public.project_images (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.projects (id) on delete cascade,
  image_url      text not null check (char_length(image_url) between 1 and 2048),
  alt_text       text not null default '' check (char_length(alt_text) <= 300),
  caption        text check (char_length(caption) <= 300),
  display_order  integer not null default 0,
  created_at     timestamptz not null default now()
);

create index project_images_project_order_idx on public.project_images (project_id, display_order);

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create table public.services (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(btrim(title)) between 1 and 120),
  short_description  text not null default '' check (char_length(short_description) <= 200),
  description        text not null default '' check (char_length(description) <= 4000),
  image_url          text check (char_length(image_url) <= 2048),
  deliverables       text[] not null default '{}' check (cardinality(deliverables) <= 20),
  is_published       boolean not null default true,
  display_order      integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index services_published_order_idx on public.services (is_published, display_order);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- clients: "trusted by" logos
-- ---------------------------------------------------------------------------
create table public.clients (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(btrim(name)) between 1 and 120),
  logo_url       text check (char_length(logo_url) <= 2048),
  website_url    text check (char_length(website_url) <= 2048 and website_url ~* '^https?://'),
  is_published   boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index clients_published_order_idx on public.clients (is_published, display_order);

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- site_settings: single-row table holding all editable website copy
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id                  smallint primary key default 1 check (id = 1),
  brand_name          text not null default 'Your Name',
  designer_name       text not null default 'Your Name',
  role_title          text not null default 'Graphic Designer',

  hero_greeting       text not null default 'Hey, I''m a',
  hero_headline       text not null default E'Creative\n*Designer*',
  hero_tagline        text not null default 'Great design should feel effortless.',
  hero_intro          text not null default 'I help ambitious brands look as good as they are — through identity, packaging and visual storytelling.',
  hero_image          text,

  about_eyebrow       text not null default 'Behind the Designs',
  about_headline      text not null default 'Creating Visual Experiences That Make Brands Stand Out',
  about_intro         text not null default '',
  about_bio           text not null default '',
  about_philosophy    text not null default '',
  about_experience    text not null default '',
  about_image         text,
  years_experience    smallint check (years_experience between 0 and 80),
  projects_completed  integer check (projects_completed between 0 and 100000),
  clients_served      integer check (clients_served between 0 and 100000),

  availability        text not null default 'Available for new projects',
  contact_email       text not null default '',
  contact_phone       text not null default '',
  location            text not null default '',
  instagram_url       text not null default '',
  behance_url         text not null default '',
  linkedin_url        text not null default '',
  dribbble_url        text not null default '',
  x_url               text not null default '',

  seo_title           text not null default 'Graphic Designer Portfolio',
  seo_description     text not null default 'Brand identity, packaging and visual design portfolio.',
  og_image            text,

  updated_at          timestamptz not null default now(),

  constraint site_settings_text_lengths check (
    char_length(brand_name) <= 60 and char_length(designer_name) <= 80 and char_length(role_title) <= 80
    and char_length(hero_greeting) <= 80 and char_length(hero_headline) <= 120
    and char_length(hero_tagline) <= 160 and char_length(hero_intro) <= 600
    and char_length(about_eyebrow) <= 80 and char_length(about_headline) <= 200
    and char_length(about_intro) <= 1500 and char_length(about_bio) <= 4000
    and char_length(about_philosophy) <= 2000 and char_length(about_experience) <= 2000
    and char_length(availability) <= 120 and char_length(contact_email) <= 254
    and char_length(contact_phone) <= 40 and char_length(location) <= 120
    and char_length(seo_title) <= 120 and char_length(seo_description) <= 320
  )
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 2 and 120),
  email         text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject       text not null check (char_length(subject) between 2 and 160),
  project_type  text check (char_length(project_type) <= 80),
  message       text not null check (char_length(message) between 10 and 5000),
  is_read       boolean not null default false,
  ip_hash       text check (char_length(ip_hash) <= 128),
  user_agent    text check (char_length(user_agent) <= 512),
  created_at    timestamptz not null default now()
);

create index contact_messages_created_idx on public.contact_messages (created_at desc);
create index contact_messages_unread_idx on public.contact_messages (created_at desc) where not is_read;
create index contact_messages_email_created_idx on public.contact_messages (email, created_at desc);
create index contact_messages_ip_created_idx on public.contact_messages (ip_hash, created_at desc) where ip_hash is not null;
