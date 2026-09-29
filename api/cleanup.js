// GET /api/cleanup: retention job. Deletes questionnaire responses older than 24 months.
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
    const rows = await sql`delete from quiz_responses where created_on < current_date - interval '24 months' returning id`;
    return res.status(200).json({ ok: true, deleted: rows.length });
  } catch (e) {
    // The table may not exist yet (no one has shared anything): nothing to delete.
    if (String(e?.message || "").includes("does not exist")) return res.status(200).json({ ok: true, deleted: 0 });
    return res.status(500).json({ error: "storage_error" });
  }
}
