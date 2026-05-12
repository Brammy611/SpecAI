import { Router, Request, Response } from "express";
import { fetchRepositoryContent } from "../services/repoFetcher";
import { analyzeRepoWithRequirement } from "../services/repoAnalyzer";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/**
 * POST /api/analyze
 * Body: { repoUrl: string; businessRequirement: string; githubToken?: string }
 * Returns the full ImpactAnalysis JSON.
 */
router.post("/analyze", async (req: Request, res: Response) => {
  const { repoUrl, businessRequirement, githubToken } = req.body as {
    repoUrl?: string;
    businessRequirement?: string;
    githubToken?: string;
  };

  if (!repoUrl || !businessRequirement) {
    res.status(400).json({
      error: "Both repoUrl and businessRequirement are required.",
    });
    return;
  }

  try {
    // Step 1: Fetch repository content via GitHub REST API
    const repoFiles = await fetchRepositoryContent(repoUrl, githubToken);

    if (repoFiles.length === 0) {
      res.status(422).json({
        error: "No readable text files found in the repository.",
      });
      return;
    }

    // Step 2: Run RAG analysis + LLM impact generation
    const analysis = await analyzeRepoWithRequirement(
      repoFiles,
      businessRequirement
    );

    res.json({
      ok: true,
      repoUrl,
      filesIndexed: repoFiles.length,
      analysis,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/analyze] Error:", message);
    res.status(500).json({ error: message });
  }
});

export default router;
