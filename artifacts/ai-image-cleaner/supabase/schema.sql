-- ============================================================================
-- AI Image Cleaner - Supabase schema
-- Tables: site_settings, blog_posts  (+ Row Level Security policies)
--
-- Run this in: Supabase Dashboard > SQL Editor  (safe to run multiple times)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- site_settings: simple key/value store for editable site content
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

-- Seed the editable homepage content (used as fallbacks until edited)
insert into public.site_settings (key, value) values
  ('homepage_title',    'Make your image |just right.|'),
  ('homepage_tagline',  'A small set of useful image tools for the moments when "good enough" is not. Quick edits, kept close.')
on conflict (key) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings are publicly readable" on public.site_settings;
create policy "site_settings are publicly readable"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "only admins can write site_settings" on public.site_settings;
create policy "only admins can write site_settings"
  on public.site_settings
  for all
  to authenticated
  using (((auth.jwt() -> 'app_metadata') ->> 'role') = 'admin')
  with check (((auth.jwt() -> 'app_metadata') ->> 'role') = 'admin');

-- ----------------------------------------------------------------------------
-- blog_posts
-- ----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  content           text not null default '',
  excerpt           text not null default '',
  featured_image    text not null default '',
  meta_description  text not null default '',
  status            text not null default 'draft' check (status in ('draft', 'published')),
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "published posts are publicly readable" on public.blog_posts;
create policy "published posts are publicly readable"
  on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "only admins can manage blog_posts" on public.blog_posts;
create policy "only admins can manage blog_posts"
  on public.blog_posts
  for all
  to authenticated
  using (((auth.jwt() -> 'app_metadata') ->> 'role') = 'admin')
  with check (((auth.jwt() -> 'app_metadata') ->> 'role') = 'admin');

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Notes
-- ----------------------------------------------------------------------------
-- * RLS is the server-side gate: the postgrest layer validates every JWT and
--   every query/update against these policies. The browser app additionally
--   hides admin UI, but a forged client can never read drafts, write posts or
--   edit settings - the database rejects those requests.
-- * "admin" is defined by the user's app_metadata.role claim. Assign it when
--   you create the admin user (see scripts/create-admin.mjs) or via
--   Dashboard > Authentication > Users > your user > Set app_metadata to
--   {"role": "admin"}.
-- ============================================================================