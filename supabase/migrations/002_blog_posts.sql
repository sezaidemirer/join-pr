create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_en text,
  slug text not null unique,
  category text,
  category_en text,
  description text not null,
  description_en text,
  content text not null,
  content_en text,
  image text,
  is_published boolean not null default true,
  noindex boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on blog_posts (is_published, published_at desc);
