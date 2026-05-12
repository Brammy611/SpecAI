"use client";

import * as React from "react";
import { ArrowUpRight, Clipboard, FileUp, Link2, MessageSquare, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const recentAnalyses = [
  { id: "ana-0412", title: "Billing workflow changes", time: "2 hours ago" },
  { id: "ana-0409", title: "Onboarding SLA rules", time: "Yesterday" },
  { id: "ana-0403", title: "OpenSpec v2 migration", time: "Apr 30" },
];

type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type ImpactAnalysis = {
  businessTranslation: string;
  businessImpact: string;
  impactLevel: "HIGH" | "MEDIUM" | "LOW";
  isBreakingChange: boolean;
  affectedFiles: string[];
  affectedComponents: string[];
  estimatedEffort: string;
  riskLevel: "High" | "Medium" | "Low";
  highlights: string[];
  specMd: string;
};

type AnalysisResponse = {
  ok: boolean;
  repoUrl: string;
  filesIndexed: number;
  analysis: ImpactAnalysis;
};

type AnalysisStatus = "idle" | "fetching" | "analyzing" | "done" | "error";

const blueprintTabs = ["Business Impact", "Affected Files", "Risk Notes", "Spec.md"];

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ImpactBadge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) {
  const colors = {
    HIGH: "bg-red-500/20 text-red-300 border-red-500/30",
    MEDIUM: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    LOW: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wider ${colors[level]}`}>
      {level} IMPACT
    </span>
  );
}

function RiskBar({ level }: { level: "High" | "Medium" | "Low" }) {
  const config = {
    High: { pct: "w-4/5", color: "bg-red-500", label: "High" },
    Medium: { pct: "w-1/2", color: "bg-orange-400", label: "Medium" },
    Low: { pct: "w-1/4", color: "bg-emerald-500", label: "Low" },
  };
  const c = config[level];
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${c.pct} ${c.color} transition-all duration-700`} />
      </div>
      <span className="text-xs font-semibold text-slate-300">{c.label}</span>
    </div>
  );
}

export default function ImpactAnalysisWorkspace() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [repoUrl, setRepoUrl] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [githubToken, setGithubToken] = React.useState("");
  const [activeTab, setActiveTab] = React.useState(blueprintTabs[0]);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResponse | null>(null);
  const [status, setStatus] = React.useState<AnalysisStatus>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [shareUrl, setShareUrl] = React.useState<string | null>(null);
  const [conversation, setConversation] = React.useState<ConversationMessage[]>([]);
  const [followUpInput, setFollowUpInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (status === "fetching" || status === "analyzing") return;

    if (!repoUrl.trim()) {
      setErrorMsg("Please enter a GitHub repository URL.");
      return;
    }
    if (!requirements.trim()) {
      setErrorMsg("Please describe the business change requirement.");
      return;
    }

    setErrorMsg(null);
    setAnalysisResult(null);
    setStatus("fetching");

    try {
      setStatus("analyzing");
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
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      setAnalysisResult(data as AnalysisResponse);
      setStatus("done");
      setShareUrl(`${window.location.origin}/impact-analysis?repo=${encodeURIComponent(repoUrl)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(message);
      setStatus("error");
    }
  };

  const handleShare = async () => {
    const url = shareUrl ?? window.location.href;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard may not be available in all contexts
    }
  };

  const handleFollowUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!followUpInput.trim()) return;
    const userMessage: ConversationMessage = { id: createId(), role: "user", text: followUpInput.trim() };
    const assistantMessage: ConversationMessage = {
      id: createId(),
      role: "assistant",
      text: "Got it. I will refine the impact analysis and highlight the new change request scope.",
    };
    setConversation((prev) => [...prev, userMessage, assistantMessage]);
    setFollowUpInput("");
  };

  const analysis = analysisResult?.analysis;

  function renderBlueprintContent() {
    if (!analysis) {
      const placeholders: Record<string, string> = {
        "Business Impact": "The business impact will appear here after analysis.",
        "Affected Files": "Affected files will be listed here after analysis.",
        "Risk Notes": "Risk notes and mitigations will be generated after analysis.",
        "Spec.md": "The generated coder spec.md will appear here after analysis.",
      };
      return <p className="text-sm text-slate-500">{placeholders[activeTab]}</p>;
    }

    switch (activeTab) {
      case "Business Impact":
        return (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-slate-300">{analysis.businessImpact}</p>
          </div>
        );
      case "Affected Files":
        return (
          <ul className="space-y-2">
            {analysis.affectedFiles.map((f) => (
              <li key={f} className="rounded-lg bg-slate-800/60 px-3 py-2 font-mono text-xs text-slate-300">
                {f}
              </li>
            ))}
          </ul>
        );
      case "Risk Notes":
        return (
          <div className="space-y-3">
            <RiskBar level={analysis.riskLevel} />
            <p className="mt-3 text-sm text-slate-400">
              Risk Level: <span className="font-semibold text-slate-200">{analysis.riskLevel}</span>
              {" · "}
              Breaking Change: <span className={`font-bold ${analysis.isBreakingChange ? "text-red-400" : "text-slate-400"}`}>
                {analysis.isBreakingChange ? "YES" : "NO"}
              </span>
            </p>
            <p className="text-sm text-slate-400">Estimated Effort: <span className="font-semibold text-slate-200">{analysis.estimatedEffort}</span></p>
          </div>
        );
      case "Spec.md":
        return (
          <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 font-mono text-xs leading-relaxed text-emerald-300 whitespace-pre-wrap">
            {analysis.specMd || "No spec.md generated."}
          </pre>
        );
      default:
        return null;
    }
  }

  const isLoading = status === "fetching" || status === "analyzing";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen md:grid-cols-[300px_1fr]">
        {/* ── Sidebar ── */}
        <aside className="flex flex-col gap-6 border-b border-slate-800 bg-slate-950 px-6 py-6 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">SpecAI</p>
              <h1 className="text-lg font-semibold text-white">Change Workspace</h1>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Live</span>
          </div>

          <div className="space-y-3">
            <Button className="w-full justify-between bg-sky-500 text-slate-950 hover:bg-sky-400">
              New Analysis <ArrowUpRight className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Button
                className="flex-1 border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="h-4 w-4" /> Upload
              </Button>
              <Button
                className="flex-1 border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                onClick={handleShare}
              >
                <Link2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
              <span>Recent</span><span>03</span>
            </div>
            <div className="space-y-2">
              {recentAnalyses.map((a) => (
                <button key={a.id} className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-left transition hover:border-slate-700 hover:bg-slate-900" type="button">
                  <p className="text-sm font-semibold text-slate-100">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Conversations</div>
            <div className="space-y-2">
              {["Current Workspace", "OpenSpec review", "Stakeholder notes"].map((label) => (
                <button key={label} className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-slate-700 hover:bg-slate-900" type="button">
                  <span>{label}</span>
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex flex-col gap-8 bg-slate-900 px-6 py-8 md:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Impact Analysis</p>
              <h2 className="text-3xl font-semibold text-slate-100">Repository Change Analyzer</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Enter a GitHub repository and describe a business change — SpecAI will fetch the code, run RAG analysis, and generate an impact report.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" onClick={handleShare}>
                <Link2 className="h-4 w-4" /> Share URL
              </Button>
              {shareUrl && (
                <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-400">
                  <Clipboard className="h-3 w-3" /> {shareUrl}
                </div>
              )}
            </div>
          </header>

          {/* ── Overview cards (shown after analysis) ── */}
          {analysis && (
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                <p className="mb-1 text-xs text-slate-500">Impact Level</p>
                <ImpactBadge level={analysis.impactLevel} />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                <p className="mb-1 text-xs text-slate-500">Breaking Change</p>
                <p className={`text-lg font-bold ${analysis.isBreakingChange ? "text-red-400" : "text-slate-400"}`}>
                  {analysis.isBreakingChange ? "YES" : "NO"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                <p className="mb-1 text-xs text-slate-500">Affected Components</p>
                <p className="text-lg font-bold text-slate-100">{analysis.affectedComponents.length} Modules</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                <p className="mb-1 text-xs text-slate-500">Estimated Effort</p>
                <p className="text-lg font-bold text-slate-100">{analysis.estimatedEffort}</p>
              </div>
            </section>
          )}

          {/* ── Business Translation panel ── */}
          {analysis?.businessTranslation && (
            <section className="rounded-2xl border border-sky-800/40 bg-sky-900/10 px-6 py-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sky-400">Business Translation</p>
              <p className="text-sm leading-relaxed text-slate-300">{analysis.businessTranslation}</p>
            </section>
          )}

          {/* ── Input + Results ── */}
          <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <Card className="border-slate-800 bg-slate-800/30">
              <CardHeader>
                <CardTitle className="text-slate-100">Change Request Inputs</CardTitle>
                <CardDescription className="text-slate-400">Provide a GitHub repo URL and describe the business change.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* File upload */}
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">OpenSpec File</p>
                      <p className="text-xs text-slate-500">Upload optional OpenSpec YAML/JSON.</p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500">
                      <FileUp className="h-4 w-4" /> Upload OpenSpec
                      <input className="hidden" type="file" accept=".yaml,.yml,.json" onChange={handleFileChange} ref={fileInputRef} />
                    </label>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected yet."}
                  </p>
                </div>

                {/* Repo URL */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    GitHub Repository URL
                  </label>
                  <input
                    id="repo-url-input"
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-sky-500"
                    placeholder="https://github.com/owner/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                </div>

                {/* GitHub Token */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    GitHub Token <span className="normal-case text-slate-600">(optional, for private repos)</span>
                  </label>
                  <input
                    id="github-token-input"
                    type="password"
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-sky-500"
                    placeholder="ghp_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                  />
                </div>

                {/* Business Requirements */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Business Change Requirement
                  </label>
                  <Textarea
                    id="business-requirements-input"
                    className="mt-2 min-h-[140px] rounded-2xl border-slate-700 bg-slate-900 text-slate-200 placeholder:text-slate-600 focus:border-sky-500"
                    placeholder="Describe the business change, expected outcomes, and constraints..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                </div>

                {/* Error */}
                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-2xl border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Analyze button */}
                <Button
                  id="analyze-impact-button"
                  className="w-full bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-60"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {status === "fetching" ? "Fetching Repository..." : status === "analyzing" ? "Analyzing with RAG + LLM..." : "Analyze Impact"}
                </Button>

                {status === "done" && analysisResult && (
                  <p className="text-center text-xs text-slate-500">
                    ✓ Indexed {analysisResult.filesIndexed} files
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-800/30">
              <CardHeader>
                <CardTitle className="text-slate-100">Inline Impact Result</CardTitle>
                <CardDescription className="text-slate-400">Key highlights from the analysis appear here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis ? (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-slate-100">Impact Analysis Ready</p>
                    <p className="text-sm text-slate-400">{analysis.businessImpact}</p>
                    <div className="grid gap-3">
                      {analysis.highlights.map((item) => (
                        <div key={item} className="rounded-2xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-slate-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-sm text-slate-500">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Running analysis, this may take a minute…</span>
                      </div>
                    ) : (
                      "No analysis yet. Enter a repo URL and business requirement, then click Analyze Impact."
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* ── Blueprint Tabs ── */}
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-slate-800 bg-slate-800/30">
              <CardHeader>
                <CardTitle className="text-slate-100">Technical Blueprint</CardTitle>
                <CardDescription className="text-slate-400">Explore impact details, affected files, risk, and the generated spec.md.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {blueprintTabs.map((tab) => (
                    <button
                      key={tab}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                        activeTab === tab ? "bg-sky-500 text-slate-950" : "border border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                      }`}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/60 px-5 py-4">
                  {renderBlueprintContent()}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-800/30">
              <CardHeader>
                <CardTitle className="text-slate-100">Follow-up Conversation</CardTitle>
                <CardDescription className="text-slate-400">Ask questions to refine the analysis response.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {conversation.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-4 text-sm text-slate-500">
                      No follow-up yet. Ask a question to continue the conversation.
                    </div>
                  ) : (
                    conversation.map((message) => (
                      <div key={message.id} className={`rounded-2xl px-4 py-3 text-sm ${message.role === "user" ? "bg-sky-500 text-slate-950" : "border border-slate-700 bg-slate-900 text-slate-300"}`}>
                        {message.text}
                      </div>
                    ))
                  )}
                </div>
                <form className="flex flex-col gap-3" onSubmit={handleFollowUp}>
                  <Textarea
                    className="min-h-[90px] rounded-2xl border-slate-700 bg-slate-900 text-slate-200 placeholder:text-slate-600"
                    placeholder="Ask a follow-up about the impact analysis..."
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                  />
                  <Button className="self-end bg-slate-700 text-slate-200 hover:bg-slate-600" type="submit">
                    Send follow-up
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
