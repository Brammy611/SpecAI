"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { dashboardOutput } from "@/data/dummy-data";

const executionTabs = ["✓ Task", "Backend", "Database"] as const;

const impactBadgeStyles = {
  High: { label: "HIGH IMPACT", className: "badge badge-high" },
  Medium: { label: "MEDIUM IMPACT", className: "badge badge-medium" },
  Low: { label: "LOW IMPACT", className: "badge badge-low" },
};

const riskConfig = {
  High: { label: "High", className: "risk-high", percent: 82 },
  Medium: { label: "Medium", className: "risk-medium", percent: 52 },
  Low: { label: "Low", className: "risk-low", percent: 24 },
};

type ExecutionTab = (typeof executionTabs)[number];
type ImpactLevel = keyof typeof impactBadgeStyles;
type RiskLevel = keyof typeof riskConfig;

const impactBadgeLookup: Record<ImpactLevel, {
  label: string;
  className: string;
}> = impactBadgeStyles;

const keywordMap = {
  ts: new Set(["const", "let", "function", "return", "if", "else", "throw", "new"]),
  sql: new Set(["SELECT", "FROM", "WHERE", "ALTER", "TABLE", "ADD", "CONSTRAINT", "CREATE", "INSERT", "UPDATE", "DELETE", "CHECK"]),
  yaml: new Set(["openapi", "info", "title", "version", "description", "servers", "paths", "post", "get", "put", "delete", "summary", "parameters", "responses"]),
};

function highlightCodeLine(line: string, language: "ts" | "sql" | "yaml") {
  const parts: React.ReactNode[] = [];
  const regex = /(".*?"|'.*?'|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  let lastIndex = 0;

  for (const match of line.matchAll(regex)) {
    const matchText = match[0];
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      parts.push(line.slice(lastIndex, matchIndex));
    }

    let className = "";
    if (matchText.startsWith("\"") || matchText.startsWith("'")) {
      className = "code-string";
    } else if (language === "sql") {
      const upper = matchText.toUpperCase();
      if (keywordMap.sql.has(upper)) {
        className = "code-keyword";
      }
    } else if (language === "yaml") {
      const lower = matchText.toLowerCase();
      const isKey = line.slice(matchIndex + matchText.length).trimStart().startsWith(":");
      if (isKey || keywordMap.yaml.has(lower)) {
        className = "code-keyword";
      }
    } else if (keywordMap.ts.has(matchText)) {
      className = "code-keyword";
    } else if (language === "ts" && line.includes(`${matchText}(`)) {
      className = "code-function";
    }

    if (className) {
      parts.push(
        <span key={`${matchIndex}-${matchText}`} className={className}>
          {matchText}
        </span>
      );
    } else {
      parts.push(matchText);
    }

    lastIndex = matchIndex + matchText.length;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
}

function renderCodeBlock(lines: string[], language: "ts" | "sql" | "yaml") {
  return (
    <div className="code-block">
      {lines.map((line, index) => (
        <div className="code-line" key={`${language}-${index}`}>
          <span className="code-line-number">{index + 1}</span>
          <span className="code-line-text">{highlightCodeLine(line, language)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ImpactAnalysisWorkspace() {
  const [requirements, setRequirements] = React.useState("");
  const [executionTab, setExecutionTab] = React.useState<ExecutionTab>(
    executionTabs[0]
  );

  const analysisResult = {
    businessTranslation: dashboardOutput.businessTranslation,
    overview: dashboardOutput.overview,
    executionPlan: dashboardOutput.executionPlan,
    openSpecYaml: dashboardOutput.openSpecYaml,
  };

  return (
    <div className="impact-shell">
      <header className="impact-header">
        <div className="impact-logo">
          <span className="impact-logo-dot" />
          <span className="impact-logo-text">SpecFlow</span>
        </div>
      </header>

      <main className="impact-main">
        <section className="impact-input">
          <div className="impact-textarea">
            {requirements || "Describe business changes in natural language."}
          </div>
        </section>

        <Card className="impact-card">
          <CardHeader>
            <CardTitle>Business Translation</CardTitle>
          </CardHeader>
          <CardContent className="impact-translation-body">
            <p className="impact-body-text">{analysisResult.businessTranslation}</p>
          </CardContent>
        </Card>

        <section className="impact-overview">
          <h3 className="impact-section-title">Overview</h3>
          <div className="overview-grid">
            <div className="metric-card">
              <p className="metric-label">Impact Level</p>
              <div className={impactBadgeLookup[analysisResult.overview.impactLevel as ImpactLevel].className}>
                {impactBadgeLookup[analysisResult.overview.impactLevel as ImpactLevel].label}
              </div>
            </div>
            <div className="metric-card">
              <p className="metric-label">Breaking Change</p>
              <p
                className={`metric-value ${
                  analysisResult.overview.breakingChange
                    ? "text-rose-600"
                    : "text-slate-500"
                }`}
              >
                {analysisResult.overview.breakingChange ? "YES" : "NO"}
              </p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Affected Components</p>
              <p className="metric-value">
                {analysisResult.overview.affectedComponents.length} Modules
              </p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Estimated Effort</p>
              <p className="metric-value">{analysisResult.overview.estimatedEffort}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Risk Level</p>
              <div className="risk-row">
                <div className="risk-bar">
                  <span
                    className={`risk-bar-fill ${riskConfig[analysisResult.overview.riskLevel as RiskLevel].className}`}
                    style={{
                      width: `${riskConfig[analysisResult.overview.riskLevel as RiskLevel].percent}%`,
                    }}
                  />
                </div>
                <span className="risk-label">
                  {riskConfig[analysisResult.overview.riskLevel as RiskLevel].label}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="impact-lower">
          <Card className="impact-card">
            <CardHeader>
              <CardTitle className="impact-card-title">Execution Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="tab-group">
                {executionTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-pill ${executionTab === tab ? "tab-pill-active" : "tab-pill-inactive"}`}
                    type="button"
                    onClick={() => setExecutionTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {executionTab === "✓ Task" ? (
                <div className="space-y-4">
                  {analysisResult.executionPlan.tasks.map((group) => (
                    <div key={group.category} className="task-group">
                      <div className={`task-badge task-badge-${group.color}`}>
                        {group.category}
                      </div>
                      <div className="space-y-2">
                        {group.items.map((item) => (
                          <label key={item} className="task-item">
                            <input type="checkbox" className="task-checkbox" disabled />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : executionTab === "Backend" ? (
                <div className="code-surface">
                  {renderCodeBlock(analysisResult.executionPlan.backendCode, "ts")}
                </div>
              ) : (
                <div className="code-surface">
                  {renderCodeBlock(analysisResult.executionPlan.databaseSql, "sql")}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="impact-card">
            <CardHeader className="text-center">
              <CardTitle className="impact-card-title">Open Spec</CardTitle>
              {/* <CardDescription>Caption 1</CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="code-surface">
                {renderCodeBlock(analysisResult.openSpecYaml ?? [], "yaml")}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
