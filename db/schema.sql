-- Anonymous questionnaire responses (schema v2).
-- Stored: date (no time), language, answers, suggested school/program ids.
-- NOT stored: names, emails, IPs, user agents, cookies, postal codes, timestamps with time.
create table if not exists quiz_responses (
  id            bigint generated always as identity primary key,
  created_on    date        not null default current_date,
  schema_v      smallint    not null default 2,
  lang          text        not null check (lang in ('es','en','fr')),
  answers       jsonb       not null,
  top_schools   text[]      not null default '{}',
  top_programs  text[]      not null default '{}'
);
create index if not exists quiz_responses_created_on_idx on quiz_responses (created_on);

-- Retention: rows older than 24 months are deleted weekly by /api/cleanup (Vercel Cron).
-- Manual equivalent:
--   delete from quiz_responses where created_on < current_date - interval '24 months';

-- Upgrade from schema v1 (idempotent; the API also runs this on first use):
--   alter table quiz_responses add column if not exists created_on date not null default current_date;
--   alter table quiz_responses drop column if exists fsa;
--   alter table quiz_responses drop column if exists created_at;
