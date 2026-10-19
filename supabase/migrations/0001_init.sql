-- =============================================================================
-- Shams Glass — Initial Database Schema
-- Run this script in the Supabase SQL editor of your project.
--
-- After running:
--   1. Create the `product-images` Storage bucket (see SUPABASE_SETUP.md).
--   2. Add storage policies for the bucket.
--   3. Set ADMIN_EMAILS in .env.local.
-- =============================================================================

-- Enable UUID generation.
create extension if not exists "pgcrypto";

-- ===========================================================================
-- categories
-- ===========================================================================
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  created_at  timestamptz not null default now()
);

comment on table categories is 'Product categories managed by the admin dashboard.';

-- Seed default categories (idempotent: skip if already present).
insert into categories (name, slug) values
  ('Clear Glass',             'clear-glass'),
  ('Tempered Glass',          'tempered-glass'),
  ('Laminated Glass',         'laminated-glass'),
  ('Frosted Glass',           'frosted-glass'),
  ('Tinted Glass',            'tinted-glass'),
  ('Decorative Glass',        'decorative-glass'),
  ('Mirrors',                 'mirrors'),
  ('Aluminium Windows',       'aluminium-windows'),
  ('Aluminium Doors',         'aluminium-doors'),
  ('Aluminium Partitions',    'aluminium-partitions'),
  ('Glass Railings',          'glass-railings'),
  ('Shower Enclosures',       'shower-enclosures'),
  ('Curtain Wall Systems',    'curtain-wall-systems'),
  ('Custom Glass Solutions',  'custom-glass-solutions')
on conflict (slug) do nothing;

-- ===========================================================================
-- products
-- ===========================================================================
create table if not exists products (
  id                 uuid        primary key default gen_random_uuid(),
  name               text        not null,
  slug               text        not null unique,
  category_id        uuid        references categories (id) on delete set null,
  short_description  text,
  description        text,
  price              numeric(12, 2),
  price_on_request   boolean     not null default true,
  specifications     jsonb       not null default '[]'::jsonb,
  is_featured        boolean     not null default false,
  is_published       boolean     not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table products is 'Glass and aluminium product listings.';
comment on column products.specifications is
  'Array of {label, value} objects. Example: [{"label":"Thickness","value":"10mm"}]';

-- Index for fast published-first queries.
create index if not exists idx_products_is_published_created
  on products (is_published, created_at desc);

-- Index for category filtering.
create index if not exists idx_products_category_id
  on products (category_id);

-- Index for slug lookups.
create index if not exists idx_products_slug
  on products (slug);

-- Auto-update updated_at.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ===========================================================================
-- product_images
-- ===========================================================================
create table if not exists product_images (
  id            uuid        primary key default gen_random_uuid(),
  product_id    uuid        not null references products (id) on delete cascade,
  storage_path  text        not null,
  alt_text      text,
  sort_order    integer     not null default 0,
  created_at    timestamptz not null default now()
);

comment on table product_images is 'Images stored in Supabase Storage. storage_path is the object key inside the product-images bucket.';

create index if not exists idx_product_images_product_id
  on product_images (product_id, sort_order);

-- ===========================================================================
-- Row Level Security
-- ===========================================================================

-- Enable RLS on all tables.
alter table categories     enable row level security;
alter table products       enable row level security;
alter table product_images enable row level security;

-- ---------------------------------------------------------------------------
-- categories — public read, admin write (service role bypasses RLS)
-- ---------------------------------------------------------------------------
drop policy if exists "categories: public read" on categories;
create policy "categories: public read"
  on categories for select
  using (true);

-- ---------------------------------------------------------------------------
-- products — public reads only published rows; admin reads all
-- ---------------------------------------------------------------------------
drop policy if exists "products: public read published" on products;
create policy "products: public read published"
  on products for select
  using (is_published = true);

-- Admin authenticated users can read all products (draft + published).
-- The ADMIN_EMAILS check is enforced in server-side code; this RLS rule
-- simply allows any authenticated user to read all rows, so the service
-- role bypass is the primary admin write path.
drop policy if exists "products: admin read all" on products;
create policy "products: admin read all"
  on products for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- product_images — public reads images for published products only
-- ---------------------------------------------------------------------------
drop policy if exists "product_images: public read published" on product_images;
create policy "product_images: public read published"
  on product_images for select
  using (
    exists (
      select 1 from products p
      where p.id = product_images.product_id
        and p.is_published = true
    )
  );

drop policy if exists "product_images: admin read all" on product_images;
create policy "product_images: admin read all"
  on product_images for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Note on writes:
-- Inserts, updates, and deletes for products/product_images/categories are
-- performed exclusively by the server-side service role client
-- (lib/supabase/admin.ts), which bypasses RLS entirely. No public or
-- anon write policies are needed (or granted).
-- ---------------------------------------------------------------------------
