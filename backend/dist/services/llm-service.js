"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runImpactAnalysisLLM = runImpactAnalysisLLM;
const google_genai_1 = require("@langchain/google-genai");
const ollama_1 = require("@langchain/ollama");
function buildSystemPrompt() {
    return `You are a senior software architect and business analyst.
Given the BUSINESS CHANGE REQUIREMENT and the most relevant SOURCE CODE CONTEXT from the repository,
produce a detailed impact analysis. Your response MUST be valid JSON matching this schema exactly:

{
  "businessTranslation": "<Plain-language explanation of what the business logic shift means>",
  "businessImpact": "<Detailed description of the business impact>",
  "tingkatdampak": "HIGH" | "MEDIUM" | "LOW",
  "perubahandata": true | false,
  "komponenTerdampak": ["<component or module name>", ...],
  "estimasiwaktu": "<e.g. 1-2 Days, 3-5 Days, 1-2 Weeks>",
  "tingkatRisiko": "High" | "Medium" | "Low",
  "highlights": ["<key action item 1>", "<key action item 2>", ...],
  "codeBackend": "<backend snippet or empty string>",
  "sqlMigrasi": "<sql migration or empty string>",
  "specMd": "<Complete spec.md markdown recommendation for coders>"
}

The specMd field must be a complete, detailed spec.md in markdown format with:
- Purpose section
- Requirements section with scenarios in GIVEN/WHEN/THEN format
- Affected files list
- Implementation tasks`;
}
function buildUserPrompt(businessRequirement, context, affectedFiles) {
    return `## Business Change Requirement
${businessRequirement}

## Relevant Source Code Context
${context}

## Affected Files (from semantic search)
${affectedFiles.join("\n")}

Now produce the JSON impact analysis.`;
}
function parseJsonContent(rawContent) {
    const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        rawContent.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
        throw new Error("LLM_JSON_TIDAK_VALID");
    }
    const parsed = JSON.parse(jsonMatch[1].trim());
    return {
        businessTranslation: parsed.businessTranslation ?? "",
        businessImpact: parsed.businessImpact ?? "",
        tingkatdampak: parsed.tingkatdampak ?? "MEDIUM",
        perubahandata: parsed.perubahandata ?? false,
        komponenTerdampak: parsed.komponenTerdampak ?? [],
        estimasiwaktu: parsed.estimasiwaktu ?? "Unknown",
        tingkatRisiko: parsed.tingkatRisiko ?? "Medium",
        highlights: parsed.highlights ?? [],
        codeBackend: parsed.codeBackend ?? "",
        sqlMigrasi: parsed.sqlMigrasi ?? "",
        specMd: parsed.specMd ?? "",
    };
}
async function invokeLlm(useLocal, promptSystem, promptUser) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const ollamaBase = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const ollamaLlmModel = process.env.OLLAMA_LLM_MODEL || "gemma3:latest";
    const llm = useLocal
        ? new ollama_1.ChatOllama({ baseUrl: ollamaBase, model: ollamaLlmModel, temperature: 0, format: "json", numCtx: 16384 })
        : new google_genai_1.ChatGoogleGenerativeAI({ apiKey, model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash", temperature: 0 });
    const response = await llm.invoke([
        { role: "system", content: promptSystem },
        { role: "user", content: promptUser },
    ]);
    return typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
}
async function runImpactAnalysisLLM(businessRequirement, context, affectedFiles, requestId) {
    const useLocal = process.env.USE_LOCAL_MODEL === "true";
    const promptSystem = buildSystemPrompt();
    const promptUser = buildUserPrompt(businessRequirement, context, affectedFiles);
    try {
        const rawContent = await invokeLlm(useLocal, promptSystem, promptUser);
        return parseJsonContent(rawContent);
    }
    catch (error) {
        const timestamp = new Date().toISOString();
        console.error(`[llm-service] Failed parse attempt (requestId=${requestId}, ts=${timestamp})`, error);
        try {
            const rawContent = await invokeLlm(useLocal, promptSystem, promptUser);
            return parseJsonContent(rawContent);
        }
        catch (retryError) {
            const retryTimestamp = new Date().toISOString();
            console.error(`[llm-service] LLM failed after retry (requestId=${requestId}, ts=${retryTimestamp})`, retryError);
            const err = new Error("LLM_GAGAL");
            err.name = "LLM_GAGAL";
            throw err;
        }
    }
}
