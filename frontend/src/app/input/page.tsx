"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function InputPage() {
  const router = useRouter();

  const [repoUrl, setRepoUrl] = React.useState("");
  const [requirementText, setRequirementText] = React.useState("");
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

      const data = await response.json();

      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      router.push("/impact-analysis");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Analysis failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="input-shell">
      {/* Header */}
      <header className="input-header">
        <div className="input-logo-container">
          <div className="input-logo-circle"></div>
          <span className="input-logo-text">SpecFlow</span>
          <span className="input-logo-beta">BETA</span>
        </div>
      </header>

      <div className="input-header-divider"></div>

      {/* Hero */}
      <main className="input-main">
        <div className="input-hero">
          <h1 className="input-hero-title">
            Transform Business Requirements<br />
            into <span className="input-hero-highlight">Technical Impact Analysis</span>
          </h1>
        </div>

        {/* Form Card */}
        <div className="input-card">
          {/* Repo URL Field */}
          <div className="input-repo-container">
            <label htmlFor="repo-url" className="input-repo-label">
              <svg className="input-repo-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              className="input-repo-field"
              placeholder="https://github.com/org/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Requirement Text Area */}
          <div className="input-req-container">
            <label htmlFor="requirement-text" className="input-req-label">
              WRITE YOUR REQUIREMENT
            </label>
            <div className={`input-req-wrapper ${touched && isTextAreaEmpty ? "input-req-wrapper--error" : ""}`}>
              <textarea
                id="requirement-text"
                className="input-req-textarea"
                placeholder="Tambahkan TOEFL minimal 450 saat pengajuan SKL"
                rows={6}
                value={requirementText}
                onChange={(e) => {
                  setRequirementText(e.target.value);
                  if (touched) setTouched(false);
                }}
                disabled={isLoading}
              />
              <div className="input-req-footer">
                <div className="input-req-hint">
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
              <p className="input-error-hint" role="alert">
                Please describe your business requirement before analyzing.
              </p>
            )}
          </div>

          {/* API Error message */}
          {error && (
            <div className="input-api-error" role="alert">
              {error}
            </div>
          )}

          {/* CTA Button */}
          <div className="input-action-container">
            <button
              id="analyze-btn"
              type="button"
              className={`input-analyze-btn ${isLoading ? "loading" : ""}`}
              onClick={handleAnalyze}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="input-spinner" aria-hidden="true" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="input-analyze-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill="currentColor" stroke="none"/>
                    <path d="M18 16L18.5 18.5L21 19L18.5 19.5L18 22L17.5 19.5L15 19L17.5 18.5L18 16Z" fill="currentColor" stroke="none"/>
                  </svg>
                  Analyze Impact
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

