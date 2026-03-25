-- ─────────────────────────────────────────────────────────────────────────────
-- SEED ANALYTICS — Tablas iniciales
-- Ejecutar en Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Configuración de cada funnel
create table if not exists funnels (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,          -- ej. "seed-mexico"
  nombre        text not null,                 -- ej. "Seminario SEED México"
  fb_pixel_id   text default '',               -- ID del Pixel de Facebook
  ghl_webhook   text default '',               -- URL webhook GoHighLevel
  activo        boolean default true,
  created_at    timestamptz default now()
);

-- Leads registrados
create table if not exists registros (
  id            uuid primary key default gen_random_uuid(),
  funnel_slug   text not null references funnels(slug),
  nombre        text not null,
  email         text not null,
  telefono      text not null,
  desde_slide   int default 0,                 -- desde qué paso fue a registrarse
  utm_source    text default '',
  utm_medium    text default '',
  utm_campaign  text default '',
  utm_content   text default '',
  utm_term      text default '',
  created_at    timestamptz default now()
);

-- Eventos de comportamiento en el funnel
create table if not exists eventos (
  id            uuid primary key default gen_random_uuid(),
  funnel_slug   text not null,
  session_id    text not null,                 -- ID anónimo de sesión
  tipo          text not null,                 -- step_view | cta_click
  slide_numero  int,
  utm_source    text default '',
  utm_medium    text default '',
  utm_campaign  text default '',
  created_at    timestamptz default now()
);

-- Funnel inicial del proyecto actual
insert into funnels (slug, nombre) values ('seed-mexico', 'Seminario SEED México')
on conflict (slug) do nothing;

-- Índices para el dashboard
create index if not exists idx_registros_funnel  on registros(funnel_slug);
create index if not exists idx_registros_fecha   on registros(created_at);
create index if not exists idx_eventos_funnel    on eventos(funnel_slug);
create index if not exists idx_eventos_session   on eventos(session_id);
