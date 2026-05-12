"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateImpactLevel = calculateImpactLevel;
exports.detectBreakingChange = detectBreakingChange;
exports.normalizeRiskLevel = normalizeRiskLevel;
exports.calculateRiskMagnitude = calculateRiskMagnitude;
exports.normalizeEffort = normalizeEffort;
function calculateImpactLevel(nilai) {
    const upper = (nilai ?? "").toUpperCase();
    if (upper === "HIGH" || upper === "MEDIUM" || upper === "LOW") {
        return upper;
    }
    return "MEDIUM";
}
function detectBreakingChange(nilai) {
    return Boolean(nilai);
}
function normalizeRiskLevel(nilai) {
    const upper = (nilai ?? "").toUpperCase();
    if (upper === "HIGH")
        return "High";
    if (upper === "LOW")
        return "Low";
    return "Medium";
}
function calculateRiskMagnitude(level) {
    if (level === "High")
        return 85;
    if (level === "Low")
        return 20;
    return 50;
}
function normalizeEffort(estimasi) {
    const value = (estimasi ?? "").trim();
    if (!value)
        return "1-2 Days";
    const hasUnit = /(day|days|week|weeks|month|months|hour|hours)/i.test(value);
    return hasUnit ? value : `${value} Days`;
}
