// POST /api/submit: stores ONE anonymous questionnaire response in Postgres (Neon).
// No names, emails, IPs or user agents are stored. Input is validated against the
// questionnaire definition, so only known question ids and option values are accepted.
import { neon } from "@neondatabase/serverless";
import { QUESTIONS } from "../js/quiz-content.js";
import { SCHOOLS, PROGRAMS } from "../js/content.js";

const LANGS = new Set(["es", "en", "fr"]);
const SCHOOL_IDS = new Set(SCHOOLS.map((s) => s.id));
const PROGRAM_IDS = new Set(PROGRAMS.map((p) => p.id));
const QUESTION_MAP = new Map(QUESTIONS.filter((q) => q.type !== "fsa").map((q) => [q.id, q]));

let sql = null;
let ready = false;

async function ensureTable() {
  if (ready) return;
  await sql`create table if not exists quiz_responses (
    id bigint generated always as identity primary key,
    created_at timestamptz not null default now(),
    schema_v smallint not null default 1,
    lang text not null check (lang in ('es','en','fr')),
    answers jsonb not null,
    fsa char(3),
    top_schools text[] not null default '{}',
    top_programs text[] not null default '{}'
  )`;
  ready = true;
}

function validate(body) {
  if (!body || typeof body !== "object") return null;
  if (body.v !== 1 || !LANGS.has(body.lang)) return null;

  const answers = {};
  if (!body.answers || typeof body.answers !== "object" || Array.isArray(body.answers)) return null;
  for (const [qid, val] of Object.entries(body.answers)) {
    const q = QUESTION_MAP.get(qid);
    if (!q) return null;
    const values = Array.isArray(val) ? val : [val];
    if (values.length === 0 || values.length > (q.max || 1)) return null;
    const valid = new Set(q.o.map((o) => o.v));
    if (!values.every((v) => typeof v === "string" && valid.has(v))) return null;
    answers[qid] = q.type === "multi" ? [...new Set(values)] : values[0];
  }
  if (Object.keys(answers).length === 0) return null;

  let fsa = null;
  if (body.fsa != null) {
    if (typeof body.fsa !== "string" || !/^[A-Z]\d[A-Z]$/.test(body.fsa)) return null;
    fsa = body.fsa;
  }

  const pick = (arr, allowed) => {
    if (!Array.isArray(arr) || arr.length > 8) return null;
    return arr.every((x) => typeof x === "string" && allowed.has(x)) ? arr : null;
  };
  const topSchools = pick(body.topSchools ?? [], SCHOOL_IDS);
  const topPrograms = pick(body.topPrograms ?? [], PROGRAM_IDS);
  if (!topSchools || !topPrograms) return null;

  return { lang: body.lang, answers, fsa, topSchools, topPrograms };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: "storage_not_configured" });

  let body = req.body;
  if (typeof body === "string") {
    if (body.length > 4000) return res.status(413).json({ error: "too_large" });
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "bad_json" }); }
  }
  const data = validate(body);
  if (!data) return res.status(400).json({ error: "invalid_payload" });

  try {
    sql = sql || neon(process.env.DATABASE_URL);
    await ensureTable();
    await sql`insert into quiz_responses (lang, answers, fsa, top_schools, top_programs)
      values (${data.lang}, ${JSON.stringify(data.answers)}::jsonb, ${data.fsa}, ${data.topSchools}::text[], ${data.topPrograms}::text[])`;
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "storage_error" });
  }
}
