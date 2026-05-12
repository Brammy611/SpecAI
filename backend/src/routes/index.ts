import { Router } from "express";
import { analyzeProject, exportAnalysis } from "../controllers/project-controller";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/**
 * POST /api/analyze
 * Body: { repoUrl: string; businessRequirement: string; githubToken?: string }
 * Returns the full ImpactAnalysis JSON.
 */
router.post("/analyze", analyzeProject);
router.get("/analysis/:idAnalisis/export", exportAnalysis);
router.get("/analyze/:idAnalisis/export", exportAnalysis);

export default router;
