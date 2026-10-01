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

-- Usage statistics (counts only; see api/track.js). One row = one combination of coarse labels for one day.
-- NOT stored: IP, user agent string, cookies, session or visitor ids, exact times, free text, search words.
-- Country/province come from the request headers Vercel adds (e.g. CA / ON), never the IP itself.
create table if not exists metrics_daily (
  day     date    not null,
  event   text    not null,                 -- pv, visit, school_open, outbound, filter, quiz, ...
  a       text    not null default '',      -- first label (e.g. school id, filter name, link kind)
  b       text    not null default '',      -- second label (e.g. where it was opened, filter value, link host)
  lang    text    not null,                 -- es | en | fr
  device  text    not null,                 -- mobile | tablet | desktop
  os      text    not null,                 -- android | ios | chromeos | windows | macos | linux | other
  browser text    not null,                 -- chrome | safari | firefox | edge | samsung | opera | other
  vp      text    not null,                 -- viewport width band: xs <480, sm <768, md <1024, lg <1440, xl
  country text    not null default '',
  region  text    not null default '',      -- province, only for Canada
  n       integer not null default 0,
  primary key (day, event, a, b, lang, device, os, browser, vp, country, region)
);
create index if not exists metrics_daily_event_idx on metrics_daily (event, day);

-- Retention: rows older than 24 months are deleted weekly by /api/cleanup.
