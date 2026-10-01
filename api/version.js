// GET /api/version: which build is serving this page (commit, branch and environment). Shown small in the footer so
// production and preview deployments can be told apart. Contains no personal data.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    sha: (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || null,
    branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    env: process.env.VERCEL_ENV || "local",
  });
}
