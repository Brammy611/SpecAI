"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getAuthToken } from "@/lib/auth-token";

export default function InputPage() {
  const router = useRouter();

  const [repoUrl, setRepoUrl] = React.useState("");
  const [requirementText, setRequirementText] = React.useState("");
  const [githubToken, setGithubToken] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  const isTextAreaEmpty = requirementText.trim() === "";

  async function handleAnalyze() {
    if (isTextAreaEmpty) {
      setTouched(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            repoUrl: repoUrl,
            businessRequirement: requirementText,
            githubToken: githubToken.trim() || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Analysis failed (${response.status}). Please try again.`);
      }

      // Save result and original input to sessionStorage
      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      sessionStorage.setItem("userRequirement", requirementText);
      if (repoUrl) sessionStorage.setItem("userRepoUrl", repoUrl);

      // Redirect to impact analysis page
      router.push("/impact-analysis");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Analysis failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const isButtonDisabled = isLoading || isTextAreaEmpty;

  return (
    <AppShell>
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      {/* Simple Header */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => router.push('/')}>
          <span className="font-jakarta font-bold text-xl text-gray-900">
            Spec<span className="text-[#F9A01B]">Flow</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-16 px-4 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-[32px] md:text-[44px] font-jakarta font-bold text-gray-900 leading-tight mb-4 tracking-tight">
            Transform Business Requirements<br />
            into <span className="text-[#F9A01B]">Technical Impact Analysis</span>
          </h1>
          <p className="text-[15px] font-medium text-gray-700 max-w-xl mx-auto">
            Analyze software architecture changes with AI-powered engineering workflows.
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-[900px] bg-white rounded-[24px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-10 flex flex-col gap-8">
          
          {/* Repo Section */}
          <div className="bg-[#FBF9FC] border border-[#F0EAF4] rounded-[16px] p-6">
            <label htmlFor="repo-url" className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 9V4"></path>
                <circle cx="12" cy="3" r="1"></circle>
                <path d="M14.6 13.5l4.3 2.5"></path>
                <circle cx="19.5" cy="16.5" r="1"></circle>
                <path d="M9.4 13.5l-4.3 2.5"></path>
                <circle cx="4.5" cy="16.5" r="1"></circle>
              </svg>
              Connect Repository
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="repo-url"
                type="url"
                className="flex-1 bg-white border border-gray-200 rounded-[8px] px-4 py-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
                placeholder="https://github.com/org/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={isLoading}
              />
              <input
                id="github-token"
                type="password"
                className="w-full sm:w-[220px] bg-white border border-gray-200 rounded-[8px] px-4 py-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
                placeholder="GitHub Token (opsional)"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Requirement Section */}
          <div className="flex flex-col">
            <label htmlFor="requirement-text" className="text-[11px] font-bold text-gray-500 tracking-widest uppercase mb-3 ml-1">
              WRITE YOUR REQUIREMENT
            </label>
            
            <div className={`border rounded-[12px] overflow-hidden flex flex-col bg-white transition-colors ${touched && isTextAreaEmpty ? "border-red-400 shadow-[0_0_0_1px_rgba(248,113,113,1)]" : "border-gray-200 focus-within:border-gray-400"}`}>
              <textarea
                id="requirement-text"
                className="w-full p-5 text-[15px] text-gray-700 placeholder-gray-400 focus:outline-none resize-y min-h-[160px] leading-relaxed"
                placeholder="Tambahkan TOEFL minimal 450 saat pengajuan SKL"
                value={requirementText}
                onChange={(e) => {
                  setRequirementText(e.target.value);
                  if (touched) setTouched(false);
                }}
                disabled={isLoading}
              />
              
              <div className="px-5 py-3 flex justify-end items-center border-t border-transparent">
                <div className="flex items-center gap-1.5 text-gray-400 text-[13px] italic">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Describe business changes in natural language.
                </div>
              </div>
            </div>

            {touched && isTextAreaEmpty && (
              <p className="text-red-500 text-sm mt-2 ml-1" role="alert">
                Please describe your business requirement before analyzing.
              </p>
            )}

            {/* API Error message */}
            {error && (
              <div className="mt-4 p-4 rounded-[8px] bg-red-50 border border-red-100 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}
            
            {/* Analyze Button Container */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-[12px] font-semibold text-[15px] transition-all duration-200 ${
                  isButtonDisabled
                    ? "bg-[#CBD5E1] text-white cursor-not-allowed"
                    : "bg-[#F9A01B] text-white hover:bg-[#E58F15] shadow-md shadow-orange-100 transform hover:-translate-y-0.5"
                }`}
                onClick={handleAnalyze}
                disabled={isButtonDisabled}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill="currentColor" stroke="none"/>
                    <path d="M18 16L18.5 18.5L21 19L18.5 19.5L18 22L17.5 19.5L15 19L17.5 18.5L18 16Z" fill="currentColor" stroke="none"/>
                  </svg>
                )}
                {isLoading ? "Analyzing..." : "Analyze Impact"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AppShell>
  );
}

