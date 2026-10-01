// GET /api/cleanup: retention job. Deletes questionnaire responses and usage totals older than 24 months.
// Scheduled weekly by Vercel Cron (see vercel.json). If CRON_SECRET is set in the project,
// Vercel sends it as "Authorization: Bearer <secret>" and any other caller is rejected.
import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "unauthorized" });
  }
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: "storage_not_configured" });
  try {
    const sql = neon(process.env.DATABASE_URL);
    // A table may not exist yet (nothing shared / no statistics yet): then there is nothing to delete.
    const run = async (q) => { try { return (await q).length; } catch (e) { if (String(e?.message || "").includes("does not exist")) return 0; throw e; } };
    const deleted = await run(sql`delete from quiz_responses where created_on < current_date - interval '24 months' returning id`);
    const metrics = await run(sql`delete from metrics_daily where day < current_date - interval '24 months' returning day`);
    return res.status(200).json({ ok: true, deleted, metrics });
  } catch {
    return res.status(500).json({ error: "storage_error" });
  }
}
