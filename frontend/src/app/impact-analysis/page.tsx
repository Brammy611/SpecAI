"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Code2,
  Copy,
  Download,
  Lightbulb,
  Share2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/app-shell";
import { getAuthToken } from "@/lib/auth-token";

/* ─── Types ─── */
type KomponenTerdampak = { nama: string };

type RingkasanDampak = {
  tingkatdampak: string;
  perubahandata: string;
  estimasiwaktu: string;
  tingkatRisiko: string;
  komponenTerdampak: KomponenTerdampak[];
};

type Tugas = { kategori?: string; items?: string[]; judul?: string; deskripsi?: string; [k: string]: unknown };

type RencanaPelaksanaan = { 
  daftarTugas: (string | Tugas)[];
  codeBackend?: string;
  sqlMigrasi?: string;
};

type SpesifikasiTerbuka = { kontenSpec: string };

type ImpactAnalysis = {
  businessTranslation?: string;
  ringkasanDampak: RingkasanDampak;
  rencanaPelaksanaan: RencanaPelaksanaan;
  spesifikasiTerbuka: SpesifikasiTerbuka;
  analysisInsight?: string;
};

type AnalysisResponse = {
  ok: boolean;
  repoUrl: string;
  filesIndexed: number;
  analysis: ImpactAnalysis;
  idAnalisis?: string;
  tautanBerbagi?: string;
  peringatanMVP?: string;
};

/* ─── Helpers ─── */
function impactColor(level: string) {
  const u = (level ?? "").toUpperCase();
  if (!u) return "bg-gray-200 hover:bg-gray-200 text-gray-700";
  if (u.includes("HIGH") || u.includes("TINGGI"))
    return "bg-[#FF9800] hover:bg-[#FF9800] text-white";
  if (u.includes("MEDIUM") || u.includes("SEDANG"))
    return "bg-yellow-500 hover:bg-yellow-500 text-white";
  return "bg-emerald-500 hover:bg-emerald-500 text-white";
}

function riskPct(level: string) {
  const u = (level ?? "").toUpperCase();
  if (!u) return "w-0";
  if (u.includes("HIGH") || u.includes("TINGGI")) return "w-[80%]";
  if (u.includes("MEDIUM") || u.includes("SEDANG")) return "w-1/2";
  return "w-1/4";
}

function riskBarColor(level: string) {
  const u = (level ?? "").toUpperCase();
  if (!u) return "from-gray-300 to-gray-300";
  if (u.includes("HIGH") || u.includes("TINGGI")) return "from-[#FF9800] to-red-500";
  if (u.includes("MEDIUM") || u.includes("SEDANG")) return "from-yellow-400 to-[#FF9800]";
  return "from-emerald-400 to-teal-500";
}

/* ─── Sub-components ─── */
function MetricCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#F2E8E0] bg-[#FCF9F6] p-4 shadow-sm min-h-[100px]">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
        {title}
      </p>
      <div className="mt-auto flex items-end h-full w-full">{children}</div>
    </div>
  );
}

/* ─── Main Page ─── */
function ImpactAnalysisPageInner() {
  const searchParams = useSearchParams();
  const [result, setResult] = React.useState<AnalysisResponse | null>(null);
  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [userRepoUrl, setUserRepoUrl] = React.useState<string | null>(null);
  const [userRequirement, setUserRequirement] = React.useState<string | null>(null);
  const [loadingRemote, setLoadingRemote] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem("analysisResult");
      if (raw) {
        setResult(JSON.parse(raw) as AnalysisResponse);
      }
      setUserRepoUrl(sessionStorage.getItem("userRepoUrl"));
      setUserRequirement(sessionStorage.getItem("userRequirement"));
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    if (result?.idAnalisis === id) return;

    // If sessionStorage doesn't contain the analysis (e.g., opened shared URL), fetch from backend.
    let cancelled = false;
    (async () => {
      setLoadingRemote(true);
      setLoadError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
        const token = getAuthToken();

        // Prefer authenticated history endpoint so we can restore requirement/repo for the banner.
        const primaryUrl = token
          ? `${baseUrl}/api/history/${encodeURIComponent(id)}`
          : `${baseUrl}/api/analysis/${encodeURIComponent(id)}`;

        const response = await fetch(primaryUrl, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await response.json();

        if (!response.ok) {
          // If history endpoint failed (e.g. not logged in / wrong user), fall back to public endpoint.
          if (token) {
            const fallback = await fetch(`${baseUrl}/api/analysis/${encodeURIComponent(id)}`);
            const fbData = await fallback.json();
            if (!fallback.ok) {
              const msg = fbData?.pesan || fbData?.error || `Failed to load analysis (${fallback.status}).`;
              throw new Error(msg);
            }

            const normalizedFallback: AnalysisResponse = {
              ok: true,
              repoUrl: fbData?.repoUrl ?? userRepoUrl ?? "",
              filesIndexed: fbData?.filesIndexed ?? 0,
              analysis: fbData?.analysis,
              idAnalisis: fbData?.idAnalisis ?? id,
            };

            if (!cancelled) {
              setResult(normalizedFallback);
              sessionStorage.setItem("analysisResult", JSON.stringify(normalizedFallback));
            }
            return;
          }

          const msg = data?.pesan || data?.error || `Failed to load analysis (${response.status}).`;
          throw new Error(msg);
        }

        const normalized: AnalysisResponse = {
          ok: true,
          repoUrl: data?.repoUrl ?? userRepoUrl ?? "",
          filesIndexed: data?.filesIndexed ?? 0,
          analysis: data?.analysis,
          idAnalisis: data?.idAnalisis ?? data?.idAnalisis ?? id,
        };

        if (!cancelled) {
          setResult(normalized);
          sessionStorage.setItem("analysisResult", JSON.stringify(normalized));

          if (typeof data?.businessRequirement === "string" && data.businessRequirement.trim()) {
            setUserRequirement(data.businessRequirement);
            sessionStorage.setItem("userRequirement", data.businessRequirement);
          }
          if (typeof data?.repoUrl === "string" && data.repoUrl.trim()) {
            setUserRepoUrl(data.repoUrl);
            sessionStorage.setItem("userRepoUrl", data.repoUrl);
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load analysis.";
        if (!cancelled) setLoadError(msg);
      } finally {
        if (!cancelled) setLoadingRemote(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, result?.idAnalisis, userRepoUrl]);

  const analysis = result?.analysis;
  const ringkasan = analysis?.ringkasanDampak;
  const rencana = analysis?.rencanaPelaksanaan;
  const spesifikasi = analysis?.spesifikasiTerbuka;

  const specContent = spesifikasi?.kontenSpec?.trim() || "";
  const hasSpec = Boolean(specContent);

  const backendSnippet = rencana?.codeBackend?.trim() || "";
  const sqlSnippet = rencana?.sqlMigrasi?.trim() || "";

  const affectedModules = (ringkasan?.komponenTerdampak ?? [])
    .map((k) => (k?.nama ?? "").trim())
    .filter(Boolean);

  const executionTasks = React.useMemo(() => {
    const raw = rencana?.daftarTugas ?? [];
    const out: Array<{ title: string; category?: string; desc?: string }> = [];

    for (const t of raw) {
      if (typeof t === "string") {
        const title = t.trim();
        if (title) out.push({ title });
        continue;
      }

      const category =
        (typeof t.kategori === "string" && t.kategori.trim())
          ? t.kategori.trim()
          : (typeof t.judul === "string" && t.judul.trim())
            ? t.judul.trim()
            : undefined;

      if (Array.isArray(t.items) && t.items.length > 0) {
        for (const item of t.items) {
          const title = typeof item === "string" ? item.trim() : "";
          if (title) out.push({ title, category });
        }
        continue;
      }

      if (typeof t.deskripsi === "string" && t.deskripsi.trim()) {
        out.push({
          title: category ?? "Task",
          category,
          desc: t.deskripsi.trim(),
        });
      }
    }

    return out;
  }, [rencana?.daftarTugas]);

  /* ── Share URL ── */
  async function handleShare() {
    const id = result?.idAnalisis;
    const url = id
      ? `${window.location.origin}/impact-analysis?id=${encodeURIComponent(id)}`
      : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      /* ignore */
    }
  }

  /* ── Copy Code ── */
  async function handleCopyCode() {
    if (!hasSpec) return;
    const code = specContent;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      /* ignore */
    }
  }

  /* ── Download Spec ── */
  function handleDownload() {
    if (!hasSpec) return;
    const content = specContent;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spec.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-4">
        <Link href="/" className="flex items-center gap-1 cursor-pointer">
          <span className="font-jakarta font-bold text-xl text-gray-900">
            Spec<span className="text-[#F9A01B]">Flow</span>
          </span>
        </Link>
        <Link href="/input">
          <Button className="rounded-full bg-[#FF6B00] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E66000]">
            New Analysis
          </Button>
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">

        {(loadingRemote || loadError || !analysis) && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {loadingRemote && (
              <p className="text-sm text-gray-600">Loading analysis…</p>
            )}
            {loadError && (
              <p className="text-sm text-red-600">{loadError}</p>
            )}
            {!loadingRemote && !loadError && !analysis && (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-600">
                  No analysis data found. Please run a new analysis.
                </p>
                <Link href="/input">
                  <Button className="rounded-full bg-[#FF6B00] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E66000]">
                    Go to Input
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* ── Input Summary Banner ── */}
        <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[140px] flex flex-col justify-between">
          <p className="text-gray-600 font-medium text-lg pr-8">
            {userRequirement || "-"}
          </p>
          <div className="flex justify-end items-center gap-1.5 text-gray-400 mt-6">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm italic">Your describe business change</span>
          </div>
        </div>

        {/* ── Business Translation Header Row ── */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between pt-2">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-[#4B3B8B] mb-3">
              Business Translation
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {analysis?.businessTranslation?.trim() || "-"}
            </p>
          </div>
          <div className="flex items-center gap-3 md:mt-2 shrink-0">
            <Button
              varian="ghost"
              onClick={handleShare}
              className="text-[#FF6B00] hover:text-[#E66000] hover:bg-orange-50 font-semibold text-sm h-10 px-4 transition-colors"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {copiedUrl ? "Copied!" : "Share URL"}
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!hasSpec}
              className="bg-[#FF6B00] hover:bg-[#E66000] text-white font-semibold text-sm h-10 px-6 rounded-full shadow-sm transition-colors"
            >
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-100" />

        {/* ── Metrics Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard title="IMPACT LEVEL">
            <Badge
              className={cn(
                "font-bold text-[10px] tracking-wider rounded-full px-3 py-0.5",
                impactColor(ringkasan?.tingkatdampak ?? "")
              )}
            >
              {((ringkasan?.tingkatdampak || "N/A") + "").toUpperCase()} IMPACT
            </Badge>
          </MetricCard>

          <MetricCard title="BREAKING CHANGE">
            <span className="text-2xl font-bold text-[#4B3B8B]">
              {typeof ringkasan?.perubahandata === "boolean"
                ? ringkasan.perubahandata
                  ? "YES"
                  : "NO"
                : "N/A"}
            </span>
          </MetricCard>

          <MetricCard title="AFFECTED COMPONENTS">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-[#4B3B8B] leading-none">
                {ringkasan?.komponenTerdampak?.length ?? 0}
              </span>
              <span className="text-sm font-semibold text-gray-500">Modules</span>
            </div>
          </MetricCard>

          <MetricCard title="ESTIMATED EFFORT">
            <span className="text-2xl font-bold text-[#4B3B8B]">
              {ringkasan?.estimasiwaktu || "N/A"}
            </span>
          </MetricCard>

          <MetricCard title="RISK LEVEL">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-end">
                <span className="text-xs font-bold text-red-600">
                  {ringkasan?.tingkatRisiko || "N/A"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    riskPct(ringkasan?.tingkatRisiko ?? ""),
                    riskBarColor(ringkasan?.tingkatRisiko ?? "")
                  )}
                />
              </div>
            </div>
          </MetricCard>
        </div>

        {/* ── Execution Plan & Open Spec Columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {affectedModules.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#4B3B8B] text-sm">
                    Affected Modules
                  </h3>
                  <span className="text-xs font-semibold text-gray-500">
                    {affectedModules.length} items
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {affectedModules.map((m) => (
                    <div
                      key={m}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                    >
                      <p className="font-mono text-xs text-gray-700 break-all">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <Tabs defaultValue="tasks" className="w-full flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3 bg-[#FDFDFD]">
                  <h3 className="font-semibold text-[#4B3B8B] text-sm">Execution Plan</h3>
                  <TabsList className="h-9 p-1 bg-gray-100 rounded-full">
                    <TabsTrigger
                      value="tasks"
                      className="rounded-full px-4 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500"
                    >
                      Task
                    </TabsTrigger>
                    {backendSnippet && (
                      <TabsTrigger
                        value="backend"
                        className="rounded-full px-4 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500"
                      >
                        Backend
                      </TabsTrigger>
                    )}
                    {sqlSnippet && (
                      <TabsTrigger
                        value="database"
                        className="rounded-full px-4 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500"
                      >
                        Database
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <div className="p-6 flex-1 min-h-[420px]">
                  {/* Tasks Tab */}
                  <TabsContent value="tasks" className="m-0 space-y-6">
                    {executionTasks.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No tasks were generated by the analysis.
                      </p>
                    )}

                    {executionTasks.map((t, i) => {
                      return (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#EBEBFE] text-[#4B3B8B] font-bold text-[13px] flex items-center justify-center">
                            {i + 1}
                          </div>
                          <div className="pt-1.5 flex flex-col gap-1.5">
                            {t.category && t.category.toLowerCase() !== "general" && (
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                {t.category}
                              </p>
                            )}
                            <h4 className="font-bold text-[#4B3B8B] text-sm">
                              {t.title}
                            </h4>
                            {t.desc && (
                              <p className="text-gray-500 text-[13px] leading-relaxed">
                                {t.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </TabsContent>

                  {/* Backend Tab */}
                  {backendSnippet && (
                    <TabsContent value="backend" className="m-0">
                      <pre className="overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-blue-300 min-h-[360px]">
                        {backendSnippet}
                      </pre>
                    </TabsContent>
                  )}

                  {/* Database Tab */}
                  {sqlSnippet && (
                    <TabsContent value="database" className="m-0">
                      <pre className="overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-yellow-300 min-h-[360px]">
                        {sqlSnippet}
                      </pre>
                    </TabsContent>
                  )}
                </div>
              </Tabs>
            </div>

            {/* Analysis Insight Card */}
            <div className="rounded-xl border border-[#EBE3D5] bg-[#FDF8E8] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#9A7D3A]">
                <Lightbulb className="h-5 w-5" />
                <h3 className="font-bold text-xs tracking-widest uppercase">
                  ANALYSIS INSIGHT
                </h3>
              </div>
              <p className="text-[#846A31] text-sm leading-relaxed italic">
                {analysis?.analysisInsight?.trim() || "-"}
              </p>
            </div>
          </div>

          {/* Right Column - Open Spec */}
          <div className="rounded-xl bg-[#282A36] text-gray-300 shadow-xl overflow-hidden flex flex-col h-full border border-gray-800 min-h-[500px]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#21222C] border-b border-[#36384A]">
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-300">
                <Code2 className="h-4 w-4 text-gray-400" />
                Open Spec — schema.yaml
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-[#282A36]">
              <div className="p-5 font-mono text-xs leading-relaxed whitespace-pre" style={{ color: "#F8F8F2" }}>
                {hasSpec ? specContent : "# Spec not available from analysis"}
              </div>
            </div>

            <div className="px-4 py-3 border-t border-[#36384A] flex justify-end bg-[#21222C]">
              <button
                onClick={handleCopyCode}
                disabled={!hasSpec}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
              >
                {copiedCode ? (
                  <span className="text-green-400">Copied!</span>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy code
                  </>
                )}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    </AppShell>
  );
}

export default function ImpactAnalysisPage() {
  return (
    <React.Suspense
      fallback={
        <AppShell>
          <div className="min-h-screen bg-white font-sans text-gray-900">
            <div className="mx-auto max-w-6xl px-4 py-10">
              <p className="text-sm text-gray-600">Loading…</p>
            </div>
          </div>
        </AppShell>
      }
    >
      <ImpactAnalysisPageInner />
    </React.Suspense>
  );
}
