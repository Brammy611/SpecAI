import crypto from "crypto";

import { analyzeRepoWithRequirement } from "./repoAnalyzer";
import { RepoFile } from "./repoFetcher";
import {
  HasilAnalisis,
  RingkasanDampak,
  RencanaPelaksanaan,
  SpesifikasiTerbuka,
} from "./analysis-types";
import {
  calculateImpactLevel,
  calculateRiskMagnitude,
  detectBreakingChange,
  normalizeEffort,
  normalizeRiskLevel,
} from "../utils/diff-engine";
import { generateSpec } from "./spec-generator";

type StoredAnalysis = {
  hasilanalisis: HasilAnalisis;
  createdAt: string;
};

const analisisStore = new Map<string, StoredAnalysis>();


export function getStoredAnalysis(idAnalisis: string): HasilAnalisis | null {
  return analisisStore.get(idAnalisis)?.hasilanalisis ?? null;
}

export async function analyzeImpact(
  repoFiles: RepoFile[],
  businessRequirement: string,
  requestId: string
): Promise<{
  idAnalisis: string;
  hasilanalisis: HasilAnalisis;
  tautanBerbagi: string;
  peringatanMVP: string;
}> {
  const analysis = await analyzeRepoWithRequirement(
    repoFiles,
    businessRequirement,
    undefined,
    requestId
  );

  const tingkatdampak = calculateImpactLevel(analysis.impactLevel);
  const tingkatRisiko = normalizeRiskLevel(analysis.riskLevel);
  const magnitudeRisiko = calculateRiskMagnitude(tingkatRisiko);

  const ringkasanDampak: RingkasanDampak = {
    tingkatdampak,
    perubahandata: detectBreakingChange(analysis.isBreakingChange),
    komponenTerdampak: (analysis.affectedComponents ?? []).map((nama) => ({ nama })),
    estimasiwaktu: normalizeEffort(analysis.estimatedEffort),
    tingkatRisiko,
    magnitudeRisiko,
  };

  const rencanaPelaksanaan: RencanaPelaksanaan = {
    daftarTugas: analysis.highlights.length
      ? [{ kategori: "general", items: analysis.highlights }]
      : [],
    codeBackend: analysis.codeBackend ?? "",
    sqlMigrasi: analysis.sqlMigrasi ?? "",
  };

  const spesifikasiTerbuka: SpesifikasiTerbuka = {
    tersedia: Boolean(analysis.specMd && analysis.specMd.trim()),
    kontenSpec: analysis.specMd ?? "",
  };

  const hasilanalisis: HasilAnalisis = {
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
  } else {
    hasilanalisis.spesifikasiTerbuka = {
      tersedia: true,
      kontenSpec: generateSpec(hasilanalisis),
    };
  }

  const idAnalisis = crypto.randomBytes(4).toString("hex");
  // Prefer UUID so it can be used as a stable DB id for analysis history.
  // Fall back for older runtimes.
  const idStable = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : idAnalisis;

  analisisStore.set(idStable, {
    hasilanalisis,
    createdAt: new Date().toISOString(),
  });
  const publicBaseUrl =
    process.env.PUBLIC_BASE_URL ||
    "https://codecatalyst.hackathon.sev-2.com";

  return {
    idAnalisis: idStable,
    hasilanalisis,
    tautanBerbagi: `${publicBaseUrl}/api/analysis/${idStable}`,
    peringatanMVP: "Result stored in-memory only; links will expire on restart.",
  };
}
