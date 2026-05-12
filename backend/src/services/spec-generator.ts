import { HasilAnalisis } from "./analysis-types";

export function generateSpec(hasilanalisis: HasilAnalisis): string {
  const tujuan = hasilanalisis.businessImpact || "Impact analysis specification.";
  const highlights = hasilanalisis.highlights.length
    ? hasilanalisis.highlights
    : ["No highlights available."];

  const tasks = hasilanalisis.rencanaPelaksanaan.daftarTugas
    .flatMap((grup) => grup.items.map((item) => `- [ ] ${item}`))
    .join("\n");

  return `# Impact Analysis Spec\n\n## Purpose\n${tujuan}\n\n## MODIFIED Requirements\n\n### Requirement: Highlights summary\nThe system SHALL provide actionable highlights for the change.\n\n#### Scenario: Highlights available\n- **WHEN** impact analysis completes\n- **THEN** the system SHALL surface key highlights\n\n## Context\n- Generated from structured impact analysis data.\n\n## Decisions\n- Derived from structured analysis results.\n\n## Risks\n- LLM output quality can vary; validation applied server-side.\n\n## Implementation Tasks\n${tasks || "- [ ] No tasks generated."}\n`;
}
