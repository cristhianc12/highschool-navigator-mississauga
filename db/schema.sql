-- Anonymous questionnaire responses. No names, emails, IPs or user agents are stored.
create table if not exists quiz_responses (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  schema_v      smallint    not null default 1,
  lang          text        not null check (lang in ('es','en','fr')),
  answers       jsonb       not null,
  fsa           char(3),
  top_schools   text[]      not null default '{}',
  top_programs  text[]      not null default '{}'
);
create index if not exists quiz_responses_created_idx on quiz_responses (created_at);
create index if not exists quiz_responses_answers_gin on quiz_responses using gin (answers);
