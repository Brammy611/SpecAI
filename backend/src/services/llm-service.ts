import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";

export type LlmResult = {
  businessTranslation: string;
  businessImpact: string;
  tingkatdampak: "HIGH" | "MEDIUM" | "LOW";
  perubahandata: boolean;
  komponenTerdampak: string[];
  estimasiwaktu: string;
  tingkatRisiko: "High" | "Medium" | "Low";
  highlights: string[];
  codeBackend: string;
  sqlMigrasi: string;
  specMd: string;
};

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
- Implementation tasks

CRITICAL INSTRUCTIONS:
1. DO NOT output empty strings ("") or empty arrays ([]) for businessTranslation, businessImpact, komponenTerdampak, highlights, or specMd!
2. You MUST provide detailed analysis and fill out all fields. If you are unsure, make your best educated guess based on the provided context.
3. Your output must be ONLY valid JSON, without any conversational text outside the JSON block.
4. DO NOT use unescaped markdown code blocks (like \`\`\`sql) inside JSON string values. Escape all newlines as \\n and double quotes as \\".`;
}

function buildUserPrompt(
  businessRequirement: string,
  context: string,
  affectedFiles: string[]
) {
  return `## Business Change Requirement
${businessRequirement}

## Relevant Source Code Context
${context}

## Affected Files (from semantic search)
${affectedFiles.join("\n")}

Now produce the JSON impact analysis.`;
}

function parseJsonContent(rawContent: string): LlmResult {
  // First try to find a ```json ... ``` block
  let jsonString = rawContent;
  const jsonBlockMatch = rawContent.match(/```(?:json)\s*([\s\S]*?)```/);
  
  if (jsonBlockMatch) {
    jsonString = jsonBlockMatch[1];
  } else {
    // If no ```json block, just extract from the first { to the last }
    const startIndex = rawContent.indexOf("{");
    const endIndex = rawContent.lastIndexOf("}");
    if (startIndex !== -1 && endIndex !== -1) {
      jsonString = rawContent.substring(startIndex, endIndex + 1);
    }
  }

  if (!jsonString || !jsonString.trim().startsWith("{")) {
    throw new Error("LLM_JSON_TIDAK_VALID");
  }

  // Escape any unescaped literal newlines inside JSON string values (common LLM hallucination)
  jsonString = jsonString.replace(/(?<=:\s*"(?:[^"\\]|\\.)*)\n(?=(?:[^"\\]|\\.)*")/g, '\\n');

  const parsed = JSON.parse(jsonString.trim()) as Record<string, unknown>;

  return {
    businessTranslation: (parsed.businessTranslation as string) ?? "",
    businessImpact: (parsed.businessImpact as string) ?? "",
    tingkatdampak: (parsed.tingkatdampak as "HIGH" | "MEDIUM" | "LOW") ?? (parsed.impactLevel as "HIGH" | "MEDIUM" | "LOW") ?? "MEDIUM",
    perubahandata: (parsed.perubahandata as boolean) ?? (parsed.isBreakingChange as boolean) ?? false,
    komponenTerdampak: (parsed.komponenTerdampak as string[]) ?? (parsed.affectedComponents as string[]) ?? [],
    estimasiwaktu: (parsed.estimasiwaktu as string) ?? (parsed.estimatedEffort as string) ?? "Unknown",
    tingkatRisiko: (parsed.tingkatRisiko as "High" | "Medium" | "Low") ?? (parsed.riskLevel as "High" | "Medium" | "Low") ?? "Medium",
    highlights: (parsed.highlights as string[]) ?? [],
    codeBackend: (parsed.codeBackend as string) ?? "",
    sqlMigrasi: (parsed.sqlMigrasi as string) ?? "",
    specMd: (parsed.specMd as string) ?? "",
  };
}

async function invokeLlm(
  useLocal: boolean,
  promptSystem: string,
  promptUser: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ollamaBase = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const ollamaLlmModel = process.env.OLLAMA_LLM_MODEL || "gemma3:latest";

  const llm = useLocal
    ? new ChatOllama({ baseUrl: ollamaBase, model: ollamaLlmModel, temperature: 0, format: "json", numCtx: 16384 })
    : new ChatGoogleGenerativeAI({ apiKey, model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash", temperature: 0 });

  const response = await llm.invoke([
    { role: "system", content: promptSystem },
    { role: "user", content: promptUser },
  ]);

  return typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);
}

export async function runImpactAnalysisLLM(
  businessRequirement: string,
  context: string,
  affectedFiles: string[],
  requestId: string
): Promise<LlmResult> {
  const useLocal = process.env.USE_LOCAL_MODEL === "true";
  const promptSystem = buildSystemPrompt();
  const promptUser = buildUserPrompt(businessRequirement, context, affectedFiles);

  try {
    const rawContent = await invokeLlm(useLocal, promptSystem, promptUser);
    return parseJsonContent(rawContent);
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[llm-service] Failed parse attempt (requestId=${requestId}, ts=${timestamp})`, error);

    try {
      const rawContent = await invokeLlm(useLocal, promptSystem, promptUser);
      return parseJsonContent(rawContent);
    } catch (retryError) {
      const retryTimestamp = new Date().toISOString();
      console.error(`[llm-service] LLM failed after retry (requestId=${requestId}, ts=${retryTimestamp})`, retryError);
      const err = new Error("LLM_GAGAL");
      err.name = "LLM_GAGAL";
      throw err;
    }
  }
}
