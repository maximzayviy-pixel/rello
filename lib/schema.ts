// Simple SQL helpers; run once to init tables
export const SQL = {
  init: `
  create table if not exists users (
    id serial primary key,
    tg_id bigint unique not null,
    username text,
    first_name text,
    last_name text,
    balance_xtr bigint not null default 0,
    pet_level int not null default 1,
    pet_xp bigint not null default 0,
    taps_today int not null default 0,
    tap_power int not null default 1,
    tap_multiplier int not null default 1,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  create table if not exists payments (
    id serial primary key,
    tg_id bigint not null,
    invoice_payload text not null,
    amount_xtr bigint not null,
    status text not null default 'pending',
    created_at timestamptz not null default now()
  );

  create table if not exists taps (
    id bigserial primary key,
    tg_id bigint not null,
    amount int not null,
    created_at timestamptz not null default now()
  );

  create table if not exists upgrades (
    id serial primary key,
    code text unique not null,
    title text not null,
    description text,
    price_xtr bigint not null,
    effect jsonb not null
  );

  create table if not exists weekly_pools (
    id serial primary key,
    week_start date not null unique,
    total_xtr bigint not null default 0,
    prize_xtr bigint not null default 0,
    distributed boolean not null default false,
    created_at timestamptz not null default now()
  );

  create table if not exists growth_scores (
    id bigserial primary key,
    tg_id bigint not null,
    week_start date not null,
    growth bigint not null default 0,
    unique (tg_id, week_start)
  );

  create index if not exists idx_scores_week on growth_scores(week_start desc, growth desc);
  `
};
