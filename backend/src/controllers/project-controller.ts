import { Request, Response } from "express";

import { fetchRepositoryContent } from "../services/repoFetcher";
import { analyzeImpact, getStoredAnalysis } from "../services/impact-analysis-service";
import { generateExport } from "../services/export-service";
import { AnalisisRequestBody, ErrorResponse } from "../services/analysis-types";
import { prisma } from "../utils/prisma";

export async function analyzeProject(req: Request, res: Response) {
  const payload = req.body as AnalisisRequestBody;
  const repoUrl = payload.repoUrl ?? payload.kontekssistem;
  const businessRequirement = payload.businessRequirement ?? payload.inputperubahan;
  const githubToken = payload.githubToken;
  const requestId = req.headers["x-request-id"]?.toString() ?? "req-unknown";

  if (!repoUrl || !businessRequirement) {
    const response: ErrorResponse = {
      kode: "INPUT_TIDAK_VALID",
      pesan: "repoUrl and businessRequirement are required.",
    };
    res.status(400).json(response);
    return;
  }

  try {
    const startedAt = Date.now();
    const repoFiles = await fetchRepositoryContent(repoUrl, githubToken);

    if (repoFiles.length === 0) {
      const response: ErrorResponse = {
        kode: "REPO_TIDAK_VALID",
        pesan: "No readable text files found in the repository.",
      };
      res.status(422).json(response);
      return;
    }

    const result = await analyzeImpact(repoFiles, businessRequirement, requestId);
    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs > 60_000) {
      console.warn(`[/api/analyze] Processing exceeded 60s (${elapsedMs}ms, requestId=${requestId})`);
    }

    const host = req.get("host") ?? "localhost:5000";
    const protocol = (req.headers["x-forwarded-proto"]?.toString() || req.protocol) ?? "http";
    const tautanBerbagi = `${protocol}://${host}/impact-analysis?id=${encodeURIComponent(result.idAnalisis)}`;

    const userId = (req as any).user?.id as string | undefined;
    if (userId) {
      await prisma.analysisHistory.create({
        data: {
          id: result.idAnalisis,
          userId,
          repoUrl,
          businessRequirement,
          resultData: result.hasilanalisis as any,
        },
      });
    }

    res.json({
      ok: true,
      repoUrl,
      filesIndexed: repoFiles.length,
      analysis: result.hasilanalisis,
      idAnalisis: result.idAnalisis,
      tautanBerbagi,
      peringatanMVP: result.peringatanMVP,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/analyze] Error:", message);
    const response: ErrorResponse = {
      kode: message === "LLM_GAGAL" ? "LLM_GAGAL" : "LLM_GAGAL",
      pesan: "Analysis service unavailable. Please try again.",
    };
    res.status(502).json(response);
  }
}

export async function getAnalysis(req: Request, res: Response) {
  const idParam = req.params.idAnalisis;
  const idAnalisis = Array.isArray(idParam) ? idParam[0] : idParam;
  const hasilanalisis = getStoredAnalysis(idAnalisis);

  if (!hasilanalisis) {
    const response: ErrorResponse = {
      kode: "ANALISIS_TIDAK_DITEMUKAN",
      pesan: "Analysis result not found.",
    };
    res.status(404).json(response);
    return;
  }

  res.status(200).json({ ok: true, idAnalisis, analysis: hasilanalisis });
}

export async function exportAnalysis(req: Request, res: Response) {
  const idParam = req.params.idAnalisis;
  const idAnalisis = Array.isArray(idParam) ? idParam[0] : idParam;
  const hasilanalisis = getStoredAnalysis(idAnalisis);

  if (!hasilanalisis) {
    const response: ErrorResponse = {
      kode: "ANALISIS_TIDAK_DITEMUKAN",
      pesan: "Analysis result not found.",
    };
    res.status(404).json(response);
    return;
  }

  const zipBuffer = await generateExport(hasilanalisis);
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=analysis-${idAnalisis}.zip`
  );
  res.status(200).send(zipBuffer);
}
