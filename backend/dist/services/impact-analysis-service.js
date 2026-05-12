"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoredAnalysis = getStoredAnalysis;
exports.analyzeImpact = analyzeImpact;
const crypto_1 = __importDefault(require("crypto"));
const repoAnalyzer_1 = require("./repoAnalyzer");
const diff_engine_1 = require("../utils/diff-engine");
const spec_generator_1 = require("./spec-generator");
const analisisStore = new Map();
function getStoredAnalysis(idAnalisis) {
    return analisisStore.get(idAnalisis)?.hasilanalisis ?? null;
}
async function analyzeImpact(repoFiles, businessRequirement, requestId) {
    const analysis = await (0, repoAnalyzer_1.analyzeRepoWithRequirement)(repoFiles, businessRequirement, undefined, requestId);
    const tingkatdampak = (0, diff_engine_1.calculateImpactLevel)(analysis.impactLevel);
    const tingkatRisiko = (0, diff_engine_1.normalizeRiskLevel)(analysis.riskLevel);
    const magnitudeRisiko = (0, diff_engine_1.calculateRiskMagnitude)(tingkatRisiko);
    const ringkasanDampak = {
        tingkatdampak,
        perubahandata: (0, diff_engine_1.detectBreakingChange)(analysis.isBreakingChange),
        komponenTerdampak: (analysis.affectedComponents ?? []).map((nama) => ({ nama })),
        estimasiwaktu: (0, diff_engine_1.normalizeEffort)(analysis.estimatedEffort),
        tingkatRisiko,
        magnitudeRisiko,
    };
    const rencanaPelaksanaan = {
        daftarTugas: analysis.highlights.length
            ? [{ kategori: "general", items: analysis.highlights }]
            : [],
        codeBackend: analysis.codeBackend ?? "",
        sqlMigrasi: analysis.sqlMigrasi ?? "",
    };
    const spesifikasiTerbuka = {
        tersedia: Boolean(analysis.specMd && analysis.specMd.trim()),
        kontenSpec: analysis.specMd ?? "",
    };
    const hasilanalisis = {
        businessTranslation: analysis.businessTranslation ?? "",
        businessImpact: analysis.businessImpact ?? "",
        ringkasanDampak,
        highlights: analysis.highlights ?? [],
        rencanaPelaksanaan,
        spesifikasiTerbuka,
    };
    if (!spesifikasiTerbuka.tersedia) {
        hasilanalisis.spesifikasiTerbuka = {
            tersedia: false,
            kontenSpec: "",
        };
    }
    else {
        hasilanalisis.spesifikasiTerbuka = {
            tersedia: true,
            kontenSpec: (0, spec_generator_1.generateSpec)(hasilanalisis),
        };
    }
    const idAnalisis = crypto_1.default.randomBytes(4).toString("hex");
    // Prefer UUID so it can be used as a stable DB id for analysis history.
    // Fall back for older runtimes.
    const idStable = typeof crypto_1.default.randomUUID === "function" ? crypto_1.default.randomUUID() : idAnalisis;
    analisisStore.set(idStable, {
        hasilanalisis,
        createdAt: new Date().toISOString(),
    });
    return {
        idAnalisis: idStable,
        hasilanalisis,
        tautanBerbagi: `https://localhost:5000/api/analysis/${idStable}`,
        peringatanMVP: "Result stored in-memory only; links will expire on restart.",
    };
}
