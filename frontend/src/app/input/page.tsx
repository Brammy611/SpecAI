"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Footer } from "@/components/landing/Footer";

export default function InputPage() {
  const [repoUrl, setRepoUrl] = React.useState("");
  const [requirementText, setRequirementText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  const isFormIncomplete = repoUrl.trim() === "" || requirementText.trim() === "";

  async function handleAnalyze() {
    if (isFormIncomplete) {
      setTouched(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            repo_url: repoUrl,
            requirement: requirementText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Analysis failed (${response.status}). Please try again.`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = await response.json();

      // Alert success
      alert("Inputan berhasil disimpan di backend (di dalam folder backend/data)!");
      
      // Reset form
      setRepoUrl("");
      setRequirementText("");
      setTouched(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Analysis failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-spec-bg font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-spec-bg border-b border-spec-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-jakarta font-bold text-xl tracking-tight">
                <span className="text-spec-text-primary">Spec</span>
                <span className="text-spec-orange">Flow</span>
              </Link>
              <div className="h-4 w-px bg-spec-border hidden sm:block"></div>
              <Link 
                href="/" 
                className="hidden sm:flex items-center gap-2 text-spec-text-secondary hover:text-spec-text-primary transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
            
            <div className="flex sm:hidden">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-spec-text-secondary hover:text-spec-text-primary transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Title Area */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-[44px] font-jakarta font-bold text-spec-text-primary leading-tight mb-4">
            Transform Business Requirements<br />
            into <span className="text-spec-orange">Technical Impact Analysis</span>
          </h1>
          <p className="text-[15px] md:text-base text-spec-text-primary font-medium max-w-xl mx-auto">
            Analyze software architecture changes with AI-powered engineering workflows.
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-4xl bg-white border border-spec-border rounded-[24px] shadow-sm p-6 sm:p-10">
          
          {/* Repo URL Field */}
          <div className="mb-8">
            <label htmlFor="repo-url" className="flex items-center gap-2 text-xs font-semibold text-spec-text-primary uppercase tracking-wide mb-3">
              <svg className="w-4 h-4 text-spec-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <input
              id="repo-url"
              type="url"
              className={`w-full border rounded-xl px-4 py-3 text-sm text-spec-text-primary placeholder:text-spec-text-secondary focus:outline-none transition-all font-mono
                ${repoUrl.trim() === "" ? "bg-[#FCF8FB] border-spec-border" : "bg-white border-spec-orange/50 ring-1 ring-spec-orange/20"}
                focus:border-spec-orange focus:ring-2 focus:ring-spec-orange/20`}
              placeholder="https://github.com/org/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Requirement Text Area */}
          <div className="mb-8">
            <label htmlFor="requirement-text" className="block text-xs font-semibold text-spec-text-secondary uppercase tracking-wide mb-3">
              WRITE YOUR REQUIREMENT
            </label>
            <div className={`relative border rounded-[16px] overflow-hidden transition-all ${touched && isTextAreaEmpty ? "border-red-400 ring-2 ring-red-400/20" : requirementText.trim() !== "" ? "border-spec-orange/50 ring-1 ring-spec-orange/20" : "border-spec-border focus-within:ring-2 focus-within:ring-spec-orange/20 focus-within:border-spec-orange"}`}>
              <textarea
                id="requirement-text"
                className="w-full bg-white px-5 py-4 text-sm text-spec-text-primary placeholder:text-spec-text-secondary focus:outline-none resize-none"
                placeholder="Tambahkan TOEFL minimal 450 saat pengajuan SKL"
                rows={6}
                value={requirementText}
                onChange={(e) => {
                  setRequirementText(e.target.value);
                  if (touched) setTouched(false);
                }}
                disabled={isLoading}
              />
              <div className="bg-white border-t border-spec-border/50 px-5 py-3 flex justify-end">
                <div className="flex items-center gap-2 text-xs text-spec-text-secondary italic">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Describe business changes in natural language.
                </div>
              </div>
            </div>
            {touched && isFormIncomplete && (
              <p className="mt-2 text-xs text-red-500" role="alert">
                Please fill in both the repository link and the business requirement.
              </p>
            )}
          </div>

          {/* API Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100" role="alert">
              {error}
            </div>
          )}

          {/* CTA Button */}
          <div className="flex justify-end mt-4">
            <button
              id="analyze-btn"
              type="button"
              className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[14px] transition-all
                ${isFormIncomplete 
                  ? "bg-[#cbd5e1] text-white cursor-not-allowed opacity-80" 
                  : "bg-gradient-to-r from-spec-yellow to-spec-orange text-white shadow-md hover:scale-105 hover:shadow-lg"} 
                ${isLoading ? "opacity-70 cursor-wait" : ""}
              `}
              onClick={handleAnalyze}
              disabled={isFormIncomplete || isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Impact
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

