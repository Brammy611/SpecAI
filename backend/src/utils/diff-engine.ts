export function calculateImpactLevel(nilai?: string): "HIGH" | "MEDIUM" | "LOW" {
  const upper = (nilai ?? "").toUpperCase();
  if (upper === "HIGH" || upper === "MEDIUM" || upper === "LOW") {
    return upper as "HIGH" | "MEDIUM" | "LOW";
  }
  return "MEDIUM";
}

export function detectBreakingChange(nilai?: boolean): boolean {
  return Boolean(nilai);
}

export function normalizeRiskLevel(nilai?: string): "High" | "Medium" | "Low" {
  const upper = (nilai ?? "").toUpperCase();
  if (upper === "HIGH") return "High";
  if (upper === "LOW") return "Low";
  return "Medium";
}

export function calculateRiskMagnitude(level: "High" | "Medium" | "Low"): number {
  if (level === "High") return 85;
  if (level === "Low") return 20;
  return 50;
}

export function normalizeEffort(estimasi?: string): string {
  const value = (estimasi ?? "").trim();
  if (!value) return "1-2 Days";
  const hasUnit = /(day|days|week|weeks|month|months|hour|hours)/i.test(value);
  return hasUnit ? value : `${value} Days`;
}
