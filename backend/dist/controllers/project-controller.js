"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeProject = analyzeProject;
exports.getAnalysis = getAnalysis;
exports.exportAnalysis = exportAnalysis;
const repoFetcher_1 = require("../services/repoFetcher");
const impact_analysis_service_1 = require("../services/impact-analysis-service");
const export_service_1 = require("../services/export-service");
const prisma_1 = require("../utils/prisma");
async function analyzeProject(req, res) {
    const payload = req.body;
    const repoUrl = payload.repoUrl ?? payload.kontekssistem;
    const businessRequirement = payload.businessRequirement ?? payload.inputperubahan;
    const githubToken = payload.githubToken;
    const requestId = req.headers["x-request-id"]?.toString() ?? "req-unknown";
    if (!repoUrl || !businessRequirement) {
        const response = {
            kode: "INPUT_TIDAK_VALID",
            pesan: "repoUrl and businessRequirement are required.",
        };
        res.status(400).json(response);
        return;
    }
    try {
        const startedAt = Date.now();
        const repoFiles = await (0, repoFetcher_1.fetchRepositoryContent)(repoUrl, githubToken);
        if (repoFiles.length === 0) {
            const response = {
                kode: "REPO_TIDAK_VALID",
                pesan: "No readable text files found in the repository.",
            };
            res.status(422).json(response);
            return;
        }
        const result = await (0, impact_analysis_service_1.analyzeImpact)(repoFiles, businessRequirement, requestId);
        const elapsedMs = Date.now() - startedAt;
        if (elapsedMs > 60000) {
            console.warn(`[/api/analyze] Processing exceeded 60s (${elapsedMs}ms, requestId=${requestId})`);
        }
        const host = req.get("host") ?? "localhost:5000";
        const protocol = (req.headers["x-forwarded-proto"]?.toString() || req.protocol) ?? "http";
        const tautanBerbagi = `${protocol}://${host}/impact-analysis?id=${encodeURIComponent(result.idAnalisis)}`;
        const userId = req.user?.id;
        if (userId) {
            await prisma_1.prisma.analysisHistory.create({
                data: {
                    id: result.idAnalisis,
                    userId,
                    repoUrl,
                    businessRequirement,
                    resultData: result.hasilanalisis,
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
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[/api/analyze] Error:", message);
        const response = {
            kode: message === "LLM_GAGAL" ? "LLM_GAGAL" : "LLM_GAGAL",
            pesan: "Analysis service unavailable. Please try again.",
        };
        res.status(502).json(response);
    }
}
async function getAnalysis(req, res) {
    const idParam = req.params.idAnalisis;
    const idAnalisis = Array.isArray(idParam) ? idParam[0] : idParam;
    const hasilanalisis = (0, impact_analysis_service_1.getStoredAnalysis)(idAnalisis);
    if (!hasilanalisis) {
        const response = {
            kode: "ANALISIS_TIDAK_DITEMUKAN",
            pesan: "Analysis result not found.",
        };
        res.status(404).json(response);
        return;
    }
    res.status(200).json({ ok: true, idAnalisis, analysis: hasilanalisis });
}
async function exportAnalysis(req, res) {
    const idParam = req.params.idAnalisis;
    const idAnalisis = Array.isArray(idParam) ? idParam[0] : idParam;
    const hasilanalisis = (0, impact_analysis_service_1.getStoredAnalysis)(idAnalisis);
    if (!hasilanalisis) {
        const response = {
            kode: "ANALISIS_TIDAK_DITEMUKAN",
            pesan: "Analysis result not found.",
        };
        res.status(404).json(response);
        return;
    }
    const zipBuffer = await (0, export_service_1.generateExport)(hasilanalisis);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=analysis-${idAnalisis}.zip`);
    res.status(200).send(zipBuffer);
}
