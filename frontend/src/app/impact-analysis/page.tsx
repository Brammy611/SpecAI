"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Link2,
  Download,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/* ─── Types ─── */
type KomponenTerdampak = { nama: string };

type RingkasanDampak = {
  tingkatdampak: string;
  perubahandata: string;
  estimasiwaktu: string;
  tingkatRisiko: string;
  komponenTerdampak: KomponenTerdampak[];
};

type Tugas = { judul?: string; deskripsi?: string; [k: string]: unknown };

type RencanaPelaksanaan = { daftarTugas: (string | Tugas)[] };

type SpesifikasiTerbuka = { kontenSpec: string };

type ImpactAnalysis = {
  ringkasanDampak: RingkasanDampak;
  rencanaPelaksanaan: RencanaPelaksanaan;
  spesifikasiTerbuka: SpesifikasiTerbuka;
};

type AnalysisResponse = {
  ok: boolean;
  repoUrl: string;
  filesIndexed: number;
  analysis: ImpactAnalysis;
};

type AnalysisStatus = "idle" | "analyzing" | "done" | "error";

/* ─── Helpers ─── */
function impactColor(level: string) {
  const u = (level ?? "").toUpperCase();
  if (u.includes("HIGH") || u.includes("TINGGI"))
    return "bg-orange-100 text-orange-700 border-orange-300";
  if (u.includes("MEDIUM") || u.includes("SEDANG"))
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  return "bg-emerald-100 text-emerald-700 border-emerald-300";
}

function riskPct(level: string) {
  const u = (level ?? "").toUpperCase();
  if (u.includes("HIGH") || u.includes("TINGGI")) return "w-4/5";
  if (u.includes("MEDIUM") || u.includes("SEDANG")) return "w-1/2";
  return "w-1/4";
}

function riskBarColor(level: string) {
  const u = (level ?? "").toUpperCase();
  if (u.includes("HIGH") || u.includes("TINGGI")) return "bg-red-500";
  if (u.includes("MEDIUM") || u.includes("SEDANG")) return "bg-orange-400";
  return "bg-emerald-500";
}

function tugasLabel(t: string | Tugas): string {
  if (typeof t === "string") return t;
  return t.judul ?? t.deskripsi ?? JSON.stringify(t);
}

/* ─── Sub-components ─── */
function OverviewCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function RiskBar({ level }: { level: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 rounded-full bg-gray-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            riskPct(level),
            riskBarColor(level)
          )}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700">{level || "—"}</span>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ImpactAnalysisPage() {
  const [repoUrl, setRepoUrl] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [githubToken, setGithubToken] = React.useState("");
  const [status, setStatus] = React.useState<AnalysisStatus>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<AnalysisResponse | null>(null);
  const [copied, setCopied] = React.useState(false);

  const isLoading = status === "analyzing";
  const analysis = result?.analysis;
  const ringkasan = analysis?.ringkasanDampak;
  const rencana = analysis?.rencanaPelaksanaan;
  const spesifikasi = analysis?.spesifikasiTerbuka;

  /* ── Analyze ── */
  async function handleAnalyze() {
    if (isLoading) return;
    if (!repoUrl.trim()) {
      setErrorMsg("Masukkan GitHub repository URL.");
      return;
    }
    if (!requirements.trim()) {
      setErrorMsg("Deskripsikan perubahan bisnis yang diinginkan.");
      return;
    }
    setErrorMsg(null);
    setResult(null);
    setStatus("analyzing");

    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          businessRequirement: requirements.trim(),
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data as AnalysisResponse);
      setStatus("done");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  /* ── Share URL ── */
  async function handleShare() {
    const url = `${window.location.origin}/impact-analysis?repo=${encodeURIComponent(repoUrl)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  /* ── Download Spec ── */
  function handleDownload() {
    const content = spesifikasi?.kontenSpec ?? "";
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spec.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#f5f7f9] font-sans">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          {/* Logo dot */}
          <div className="h-7 w-7 rounded-full bg-teal-500" />
          <span className="text-base font-semibold text-gray-800">SpecFlow</span>
          <Badge
            variant="outline"
            className="ml-1 rounded-full border-gray-300 px-2 py-0 text-[10px] font-semibold uppercase tracking-widest text-gray-400"
          >
            Beta
          </Badge>
        </div>
        <Button
          id="share-url-btn"
          onClick={handleShare}
          className="rounded-full bg-orange-500 px-5 text-white shadow-sm hover:bg-orange-600"
          size="sm"
        >
          <Link2 className="mr-1.5 h-3.5 w-3.5" />
          {copied ? "Copied!" : "Share URL"}
        </Button>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* ── Back ── */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          back
        </Link>

        {/* ── Input Area ── */}
        <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-5 space-y-4">
          <textarea
            id="requirements-input"
            rows={3}
            className="w-full resize-none rounded-xl border-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            placeholder="Describe business changes in natural language."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <Separator className="border-teal-200" />
          <div className="flex flex-wrap gap-3">
            <input
              id="repo-url-input"
              className="flex-1 min-w-[200px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-teal-400 transition-colors"
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <input
              id="github-token-input"
              type="password"
              className="flex-1 min-w-[160px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-teal-400 transition-colors"
              placeholder="GitHub Token (optional)"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />
            <Button
              id="analyze-btn"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="rounded-lg bg-orange-500 px-6 text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Menganalisis..." : "Analyze"}
            </Button>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}
        </div>

        {/* ── Business Translation ── */}
        {ringkasan?.perubahandata && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
              <FileText className="h-4 w-4 text-teal-600" />
            </div>
            <h2 className="mb-1 text-lg font-semibold text-gray-800">
              Business Translation
            </h2>
            <p className="text-sm leading-relaxed text-gray-500">
              {ringkasan.perubahandata}
            </p>
          </div>
        )}

        {/* ── Overview ── */}
        {analysis && (
          <div>
            <h3 className="mb-4 text-center text-base font-semibold text-gray-700">
              Overview
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {/* Impact Level */}
              <OverviewCard label="Impact Level">
                <span
                  className={cn(
                    "inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
                    impactColor(ringkasan?.tingkatdampak ?? "")
                  )}
                >
                  {ringkasan?.tingkatdampak || "—"} IMPACT
                </span>
              </OverviewCard>

              {/* Breaking Change — derived from perubahan data / tingkat */}
              <OverviewCard label="Breaking Change">
                {(() => {
                  const lvl = (ringkasan?.tingkatdampak ?? "").toUpperCase();
                  const isBreaking = lvl.includes("HIGH") || lvl.includes("TINGGI");
                  return (
                    <p
                      className={cn(
                        "text-base font-bold",
                        isBreaking ? "text-red-500" : "text-gray-400"
                      )}
                    >
                      {isBreaking ? "YES" : "NO"}
                    </p>
                  );
                })()}
              </OverviewCard>

              {/* Affected Components */}
              <OverviewCard label="Affected Components">
                <p className="text-base font-bold text-gray-800">
                  {ringkasan?.komponenTerdampak?.length ?? 0} Modules
                </p>
              </OverviewCard>

              {/* Estimated Effort */}
              <OverviewCard label="Estimated Effort">
                <p className="text-base font-bold text-gray-800">
                  {ringkasan?.estimasiwaktu || "—"}
                </p>
              </OverviewCard>

              {/* Risk Level */}
              <OverviewCard label="Risk Level">
                <RiskBar level={ringkasan?.tingkatRisiko ?? ""} />
              </OverviewCard>
            </div>
          </div>
        )}

        {/* ── Execution Plan + Open Spec ── */}
        {analysis && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Execution Plan */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-center text-base font-semibold text-gray-800">
                Execution Plan
              </h3>
              <Tabs defaultValue="tasks">
                <TabsList className="mb-4 w-full rounded-full bg-gray-100 p-1">
                  <TabsTrigger
                    value="tasks"
                    className="flex-1 rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    ✓ Task
                  </TabsTrigger>
                  <TabsTrigger
                    value="components"
                    className="flex-1 rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Components
                  </TabsTrigger>
                  <TabsTrigger
                    value="spec-preview"
                    className="flex-1 rounded-full text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Spec
                  </TabsTrigger>
                </TabsList>

                {/* Tasks */}
                <TabsContent value="tasks" className="space-y-1">
                  {(rencana?.daftarTugas ?? []).length === 0 ? (
                    <p className="text-sm text-gray-400">Tidak ada tugas.</p>
                  ) : (
                    <ul className="space-y-1.5 text-sm text-gray-700 font-mono">
                      {(rencana?.daftarTugas ?? []).map((t, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 text-[10px] text-gray-400">
                            &nbsp;
                          </span>
                          <span className="leading-relaxed">{tugasLabel(t)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>

                {/* Components */}
                <TabsContent value="components" className="space-y-1.5">
                  {(ringkasan?.komponenTerdampak ?? []).length === 0 ? (
                    <p className="text-sm text-gray-400">Tidak ada komponen.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {(ringkasan?.komponenTerdampak ?? []).map((k, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
                          {k.nama}
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>

                {/* Spec preview inside tabs */}
                <TabsContent value="spec-preview">
                  <pre className="max-h-64 overflow-auto rounded-xl bg-gray-900 p-4 font-mono text-xs leading-relaxed text-emerald-300 whitespace-pre-wrap">
                    {spesifikasi?.kontenSpec || "Tidak ada spesifikasi."}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>

            {/* Open Spec */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-center text-base font-semibold text-gray-800">
                Open Spec
              </h3>
              <p className="mt-1 mb-4 text-center text-sm text-gray-400">
                A structured spec.md ready for immediate handoff.
              </p>
              <div className="flex-1 overflow-hidden rounded-xl bg-[#0d1117]">
                <pre className="h-full max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed text-emerald-300 whitespace-pre-wrap">
                  {spesifikasi?.kontenSpec
                    ? spesifikasi.kontenSpec
                        .split("\n")
                        .map((line, i) => (
                          <React.Fragment key={i}>
                            <span className="select-none text-gray-600 mr-3">
                              {String(i + 1).padStart(2, " ")}
                            </span>
                            {line}
                            {"\n"}
                          </React.Fragment>
                        ))
                    : "Tidak ada spesifikasi yang digenerate."}
                </pre>
              </div>
              <Button
                id="download-spec-btn"
                onClick={handleDownload}
                disabled={!spesifikasi?.kontenSpec}
                className="mt-4 w-full rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40"
              >
                <Download className="mr-2 h-4 w-4" />
                Download File
              </Button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-sm">Menganalisis repository, mohon tunggu…</p>
          </div>
        )}

        {/* Idle hint */}
        {status === "idle" && (
          <div className="py-10 text-center text-sm text-gray-400">
            Masukkan repository URL dan deskripsi perubahan, lalu klik{" "}
            <span className="font-semibold text-orange-500">Analyze</span>.
          </div>
        )}
      </div>
    </div>
  );
}
