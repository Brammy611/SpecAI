import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { RepoFile } from "./repoFetcher";

export interface ImpactAnalysis {
  businessImpact: string;
  impactLevel: "HIGH" | "MEDIUM" | "LOW";
  isBreakingChange: boolean;
  affectedFiles: string[];
  affectedComponents: string[];
  estimatedEffort: string;
  riskLevel: "High" | "Medium" | "Low";
  businessTranslation: string;
  highlights: string[];
  specMd: string;
}

interface VectorEntry {
  doc: Document;
  embedding: number[];
}

/** Cosine similarity between two equal-length vectors */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

/**
 * Chunk repo files, embed them, perform semantic search, then call the LLM
 * to produce a structured impact analysis and a coder recommendation spec.md.
 */
export async function analyzeRepoWithRequirement(
  repoFiles: RepoFile[],
  businessRequirement: string,
  geminiApiKey?: string
): Promise<ImpactAnalysis> {
  const useLocal = process.env.USE_LOCAL_MODEL === "true";

  if (!useLocal) {
    const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required when USE_LOCAL_MODEL is not set.");
    }
  }

  const apiKey = geminiApiKey || process.env.GEMINI_API_KEY || "";
  const ollamaBase = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const ollamaLlmModel = process.env.OLLAMA_LLM_MODEL || "gemma3:latest";
  const ollamaEmbedModel = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text:latest";

  console.log(`[repoAnalyzer] Mode: ${useLocal ? `LOCAL (Ollama @ ${ollamaBase})` : "CLOUD (Google Gemini)"}`);

  // -----------------------------------------------------------------------
  // 1. Chunk all repo files into manageable pieces
  // -----------------------------------------------------------------------
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 200,
  });

  const allDocs: Document[] = [];
  for (const file of repoFiles) {
    if (!file.content.trim()) continue;
    const chunks = await splitter.createDocuments(
      [file.content],
      [{ source: file.path }]
    );
    allDocs.push(...chunks);
  }

  // -----------------------------------------------------------------------
  // 2. Generate embeddings and build in-memory vector store
  // -----------------------------------------------------------------------
  const embeddings = useLocal
    ? new OllamaEmbeddings({ baseUrl: ollamaBase, model: ollamaEmbedModel })
    : new GoogleGenerativeAIEmbeddings({ apiKey, model: "gemini-embedding-2" });

  // Embed documents in batches of 100
  const EMBED_BATCH = 100;
  const vectorStore: VectorEntry[] = [];
  for (let i = 0; i < allDocs.length; i += EMBED_BATCH) {
    const batch = allDocs.slice(i, i + EMBED_BATCH);
    const texts = batch.map((d) => d.pageContent);
    const batchEmbeddings = await embeddings.embedDocuments(texts);
    for (let j = 0; j < batch.length; j++) {
      vectorStore.push({ doc: batch[j], embedding: batchEmbeddings[j] });
    }
  }

  // -----------------------------------------------------------------------
  // 3. Embed the query and retrieve top-k similar chunks
  // -----------------------------------------------------------------------
  const queryEmbedding = await embeddings.embedQuery(businessRequirement);

  const scored = vectorStore.map((entry) => ({
    doc: entry.doc,
    score: cosineSimilarity(entry.embedding, queryEmbedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  const topK = 8;
  const relevantDocs = scored.slice(0, topK).map((s) => s.doc);

  const context = relevantDocs
    .map((doc: Document) => `### File: ${doc.metadata.source as string}\n${doc.pageContent}`)
    .join("\n\n---\n\n");

  const affectedFiles: string[] = [
    ...new Set(relevantDocs.map((doc: Document) => doc.metadata.source as string)),
  ];

  // -----------------------------------------------------------------------
  // 4. LLM — generate structured impact analysis + spec.md
  // -----------------------------------------------------------------------
  const llm = useLocal
    ? new ChatOllama({ baseUrl: ollamaBase, model: ollamaLlmModel, temperature: 0, format: "json", numCtx: 16384 })
    : new ChatGoogleGenerativeAI({ apiKey, model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash", temperature: 0 });

  const systemPrompt = `You are a senior software architect and business analyst.
Given the BUSINESS CHANGE REQUIREMENT and the most relevant SOURCE CODE CONTEXT from the repository,
produce a detailed impact analysis. Your response MUST be valid JSON matching this schema exactly:

{
  "businessTranslation": "<Plain-language explanation of what the business logic shift means>",
  "businessImpact": "<Detailed description of the business impact>",
  "impactLevel": "HIGH" | "MEDIUM" | "LOW",
  "isBreakingChange": true | false,
  "affectedComponents": ["<component or module name>", ...],
  "estimatedEffort": "<e.g. 1-2 Days, 3-5 Days, 1-2 Weeks>",
  "riskLevel": "High" | "Medium" | "Low",
  "highlights": ["<key action item 1>", "<key action item 2>", ...],
  "specMd": "<Complete spec.md markdown recommendation for coders>"
}

The specMd field must be a complete, detailed spec.md in markdown format with:
- Purpose section
- Requirements section with scenarios in GIVEN/WHEN/THEN format
- Affected files list
- Implementation tasks`;

  const userPrompt = `## Business Change Requirement
${businessRequirement}

## Relevant Source Code Context
${context}

## Affected Files (from semantic search)
${affectedFiles.join("\n")}

Now produce the JSON impact analysis.`;

  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  const rawContent = typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);

  console.log("[repoAnalyzer] Raw LLM Response Content:", rawContent);

  // Extract JSON from the response (handle markdown code blocks)
  const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/) ||
    rawContent.match(/(\{[\s\S]*\})/);

  if (!jsonMatch) {
    throw new Error("LLM did not return valid JSON output.");
  }

  const parsed = JSON.parse(jsonMatch[1].trim()) as Record<string, unknown>;

  return {
    businessTranslation: (parsed.businessTranslation as string) ?? "",
    businessImpact: (parsed.businessImpact as string) ?? "",
    impactLevel: (parsed.impactLevel as "HIGH" | "MEDIUM" | "LOW") ?? "MEDIUM",
    isBreakingChange: (parsed.isBreakingChange as boolean) ?? false,
    affectedFiles,
    affectedComponents: (parsed.affectedComponents as string[]) ?? [],
    estimatedEffort: (parsed.estimatedEffort as string) ?? "Unknown",
    riskLevel: (parsed.riskLevel as "High" | "Medium" | "Low") ?? "Medium",
    highlights: (parsed.highlights as string[]) ?? [],
    specMd: (parsed.specMd as string) ?? "",
  };
}

