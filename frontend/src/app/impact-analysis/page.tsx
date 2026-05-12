"use client";

import * as React from "react";
import { ArrowUpRight, Clipboard, FileUp, Link2, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const recentAnalyses = [
  {
    id: "ana-0412",
    title: "Billing workflow changes",
    time: "2 hours ago",
  },
  {
    id: "ana-0409",
    title: "Onboarding SLA rules",
    time: "Yesterday",
  },
  {
    id: "ana-0403",
    title: "OpenSpec v2 migration",
    time: "Apr 30",
  },
];

const blueprintTabs = ["Architecture", "Data Flow", "API Surface", "Risk Notes"];

type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type AnalysisResult = {
  title: string;
  summary: string;
  highlights: string[];
  blueprint: Record<string, string>;
  shareUrl: string;
};

const emptyBlueprint = {
  Architecture: "Select Analyze Impact to generate the system architecture overview.",
  "Data Flow": "Data flow details will appear once analysis completes.",
  "API Surface": "API surface deltas will be listed here after analysis.",
  "Risk Notes": "Risk notes and mitigations will be generated after analysis.",
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ImpactAnalysisWorkspace() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [repoUrl, setRepoUrl] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [activeTab, setActiveTab] = React.useState(blueprintTabs[0]);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState<string | null>(null);
  const [conversation, setConversation] = React.useState<ConversationMessage[]>([]);
  const [followUpInput, setFollowUpInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleAnalyze = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);

    window.setTimeout(() => {
      const result: AnalysisResult = {
        title: "Impact Analysis Ready",
        summary:
          "We identified 4 impacted modules, 3 new workflows, and 2 API updates required for this change request.",
        highlights: [
          "Update enrollment validation service to enforce new TOEFL rule.",
          "Add campus email verification to identity pipeline.",
          "Expose new /requirements/impact endpoint for downstream teams.",
        ],
        blueprint: {
          Architecture:
            "Service gateway routes to Enrollment API, Validation Service, and OpenSpec Registry. Introduce a new Policy Engine module for rule evaluation.",
          "Data Flow":
            "User input -> Policy Engine -> Enrollment API -> Audit log -> Blueprint export. Data contracts include student status and TOEFL metadata.",
          "API Surface":
            "POST /impact/analyze, PATCH /enrollment/requirements, GET /policy/rules. Introduce new PolicyRule schema.",
          "Risk Notes":
            "Risk: schema drift between OpenSpec and API. Mitigation: add schema sync check in CI.",
        },
        shareUrl: "https://specflow.ai/analysis/ana-0412",
      };

      setAnalysisResult(result);
      setShareUrl(result.shareUrl);
      setIsAnalyzing(false);
    }, 900);
  };

  const handleShare = async () => {
    const url = shareUrl ?? "https://specflow.ai/analysis/ana-0412";
    setShareUrl(url);

    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Failed to copy share URL", error);
    }
  };

  const handleFollowUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!followUpInput.trim()) return;

    const userMessage: ConversationMessage = {
      id: createId(),
      role: "user",
      text: followUpInput.trim(),
    };

    const assistantMessage: ConversationMessage = {
      id: createId(),
      role: "assistant",
      text:
        "Got it. I will refine the impact analysis and highlight the new change request scope.",
    };

    setConversation((prev) => [...prev, userMessage, assistantMessage]);
    setFollowUpInput("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen md:grid-cols-[300px_1fr]">
        <aside className="flex flex-col gap-6 border-b border-slate-800 bg-slate-950 px-6 py-6 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                SpecFlow AI
              </p>
              <h1 className="text-lg font-semibold text-white">Change Workspace</h1>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
              Live
            </span>
          </div>

          <div className="space-y-3">
            <Button className="w-full justify-between bg-sky-500 text-slate-950 hover:bg-sky-400">
              New Analysis
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Button
                varian="outline"
                ukuran="sm"
                className="flex-1 border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="h-4 w-4" />
                Upload
              </Button>
              <Button
                varian="outline"
                ukuran="sm"
                className="flex-1 border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                onClick={handleShare}
              >
                <Link2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400">
              Next review in 12 minutes · Auto-save enabled
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
              <span>Recent</span>
              <span>03</span>
            </div>
            <div className="space-y-2">
              {recentAnalyses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-4 text-sm text-slate-500">
                  No recent analyses yet.
                </div>
              ) : (
                recentAnalyses.map((analysis) => (
                  <button
                    key={analysis.id}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-left transition hover:border-slate-700 hover:bg-slate-900"
                    type="button"
                  >
                    <p className="text-sm font-semibold text-slate-100">
                      {analysis.title}
                    </p>
                    <p className="text-xs text-slate-400">{analysis.time}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500">
              Conversations
            </div>
            <div className="space-y-2">
              {["Current Workspace", "OpenSpec review", "Stakeholder notes"].map(
                (label) => (
                  <button
                    key={label}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
                    type="button"
                  >
                    <span>{label}</span>
                    <MessageSquare className="h-4 w-4 text-slate-500" />
                  </button>
                )
              )}
            </div>
          </div>
        </aside>

        <main className="dashboard-surface flex flex-col gap-8 px-6 py-8 md:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Impact Analysis
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Conversational Change Request
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Capture change signals, validate OpenSpec alignment, and ship a
                technical blueprint in minutes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button varian="outline" ukuran="sm" onClick={handleShare}>
                <Link2 className="h-4 w-4" />
                Share URL
              </Button>
              {shareUrl ? (
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                  <Clipboard className="h-3 w-3" />
                  {shareUrl}
                </div>
              ) : null}
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <Card className="workspace-panel">
              <CardHeader>
                <CardTitle>Change Request Inputs</CardTitle>
                <CardDescription>
                  Provide OpenSpec context, repository URL, and business intent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        OpenSpec File
                      </p>
                      <p className="text-xs text-slate-500">
                        Upload the latest OpenSpec YAML or JSON file.
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300">
                      <FileUp className="h-4 w-4" />
                      Upload OpenSpec
                      <input
                        className="hidden"
                        type="file"
                        accept=".yaml,.yml,.json"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                  {selectedFile ? (
                    <p className="mt-3 text-xs text-slate-600">
                      Selected: {selectedFile.name}
                    </p>
                  ) : (
                    <p className="mt-3 text-xs text-slate-400">
                      No file selected yet.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Repository URL
                  </label>
                  <input
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-300"
                    placeholder="https://github.com/specflow-ai/specflow"
                    value={repoUrl}
                    onChange={(event) => setRepoUrl(event.target.value)}
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Validation will run after analysis.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Business Requirements
                  </label>
                  <Textarea
                    className="mt-2 min-h-[140px] rounded-2xl border-slate-200 bg-white"
                    placeholder="Describe the business change, expected outcomes, and constraints."
                    value={requirements}
                    onChange={(event) => setRequirements(event.target.value)}
                  />
                </div>

                <Button
                  className="w-full bg-slate-900 text-white hover:bg-slate-800"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing Impact..." : "Analyze Impact"}
                </Button>
              </CardContent>
            </Card>

            <Card className="workspace-panel">
              <CardHeader>
                <CardTitle>Inline Impact Result</CardTitle>
                <CardDescription>
                  The analysis summary appears here after impact is generated.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResult ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {analysisResult.title}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {analysisResult.summary}
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {analysisResult.highlights.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-sm text-slate-500">
                    No analysis yet. Run an impact analysis to populate results.
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="workspace-panel">
              <CardHeader>
                <CardTitle>Technical Blueprint</CardTitle>
                <CardDescription>
                  Explore architecture, data flow, API, and risk details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {blueprintTabs.map((tab) => (
                    <button
                      key={tab}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                        activeTab === tab
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700">
                  {analysisResult
                    ? analysisResult.blueprint[activeTab]
                    : emptyBlueprint[activeTab]}
                </div>
              </CardContent>
            </Card>

            <Card className="workspace-panel">
              <CardHeader>
                <CardTitle>Follow-up Conversation</CardTitle>
                <CardDescription>
                  Ask questions to refine the analysis response.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {conversation.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-500">
                      No follow-up yet. Ask a question to continue the
                      conversation.
                    </div>
                  ) : (
                    conversation.map((message) => (
                      <div
                        key={message.id}
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          message.role === "user"
                            ? "bg-slate-900 text-white"
                            : "border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {message.text}
                      </div>
                    ))
                  )}
                </div>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={handleFollowUp}
                >
                  <Textarea
                    className="min-h-[90px] rounded-2xl border-slate-200 bg-white"
                    placeholder="Ask a follow-up about the impact analysis..."
                    value={followUpInput}
                    onChange={(event) => setFollowUpInput(event.target.value)}
                  />
                  <Button className="self-end" ukuran="sm" type="submit">
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
