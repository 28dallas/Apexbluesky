create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  description text not null,
  social_caption text not null,
  download_url text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  provider text not null default 'zernio',
  platform text not null default 'tiktok',
  status text not null default 'pending' check (status in ('pending', 'posting', 'published', 'failed')),
  provider_post_id text,
  platform_post_url text,
  error_message text,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.products enable row level security;
alter table public.social_posts enable row level security;

create policy "Anyone can read published products" on public.products
  for select using (status = 'published');

-- Writes are only performed by the protected publishing worker with the service role.
