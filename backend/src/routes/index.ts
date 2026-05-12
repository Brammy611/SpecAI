import { Router } from "express";
import { analyzeProject, exportAnalysis, getAnalysis } from "../controllers/project-controller";
import { register, login, getMe } from "../controllers/auth-controller";
import { listHistory, getHistoryById } from "../controllers/history-controller";
import { optionalAuth, requireAuth } from "../middleware/auth-middleware";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", requireAuth, getMe);

/**
 * POST /api/analyze
 * Body: { repoUrl: string; businessRequirement: string; githubToken?: string }
 * Returns the full ImpactAnalysis JSON.
 */
// Allow saving history when user is logged in; still supports guest analysis.
router.post("/analyze", optionalAuth, analyzeProject);
router.get("/analysis/:idAnalisis", getAnalysis);
router.get("/analysis/:idAnalisis/export", exportAnalysis);
router.get("/analyze/:idAnalisis/export", exportAnalysis);

// History (requires login)
router.get("/history", requireAuth, listHistory);
router.get("/history/:id", requireAuth, getHistoryById);

export default router;
