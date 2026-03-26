-- Tercih edilen tablo adi: join_posts
-- Eger daha once crm_news_posts olustuysa, bunu join_posts'e tasir.

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'crm_news_posts'
  ) and not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'join_posts'
  ) then
    alter table public.crm_news_posts rename to join_posts;
  end if;
end $$;

create table if not exists public.join_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  description text not null,
  image text,
  platform_links jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  noindex boolean not null default false,
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists join_posts_slug_idx on public.join_posts (slug);
create index if not exists join_posts_published_idx on public.join_posts (is_published, published_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_join_posts_updated_at on public.join_posts;
create trigger trg_join_posts_updated_at
before update on public.join_posts
for each row execute function public.set_updated_at();

-- PostgREST sema cache:
-- notify pgrst, 'reload schema';
