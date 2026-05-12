export const spesifikasiyaml = [
  "openapi: 3.0.0",
  "info:",
  "  title: Graduation Request API",
  "  version: 1.0.0",
  "  description: API for SKL submission workflow",
  "servers:",
  "  - url: https://api.kampus.ac.id",
  "paths:",
  "  /request-skl:",
  "    post:",
  "      summary: Create graduation letter request",
  "      parameters:",
  "        - name: student_id",
  "          in: query",
  "          required: true",
  "      responses:",
  "        '200':",
  "          description: Request successful",
];

export const dashboardOutput = {
  businessTranslation:
    "We are tightening enrollment validation by requiring TOEFL verification for international applicants, which adds a new checkpoint before approval.",
  overview: {
    impactLevel: "High" as const,
    breakingChange: true,
    affectedComponents: ["Enrollment Service", "Policy Engine", "Identity Pipeline", "Notifications"],
    estimatedEffort: "2-3 Days",
    riskLevel: "High" as const,
  },
  executionPlan: {
    tasks: [
      {
        category: "DB",
        color: "emerald",
        items: [
          "Add TOEFL requirement flag to student profile",
          "Backfill existing international student records",
        ],
      },
      {
        category: "Backend",
        color: "teal",
        items: [
          "Validate TOEFL score during enrollment review",
          "Expose validation error details in response",
          "Add audit log for policy decision",
        ],
      },
      {
        category: "Testing",
        color: "orange",
        items: [
          "Add integration test for TOEFL missing",
          "Update regression suite for enrollment rules",
        ],
      },
    ],
    backendCode: [
      "const payload = parseEnrollment(input);",
      "if (!payload.toeflScore) {",
      "  throw new ValidationError(\"TOEFL score is required\");",
      "}",
      "return policyEngine.evaluate(payload);",
    ],
    databaseSql: [
      "ALTER TABLE student_profiles",
      "  ADD COLUMN toefl_score INTEGER;",
      "ALTER TABLE student_profiles",
      "  ADD CONSTRAINT toefl_score_required",
      "  CHECK (toefl_score IS NULL OR toefl_score >= 80);",
    ],
  },
  openSpecYaml: spesifikasiyaml,
};
