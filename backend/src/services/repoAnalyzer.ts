import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { RepoFile } from "./repoFetcher";
import { runImpactAnalysisLLM } from "./llm-service";

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
  codeBackend?: string;
  sqlMigrasi?: string;
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
  geminiApiKey?: string,
  requestId?: string
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

  const parsed = await runImpactAnalysisLLM(
    businessRequirement,
    context,
    affectedFiles,
    requestId ?? "unknown"
  );

  return {
    businessTranslation: parsed.businessTranslation ?? "",
    businessImpact: parsed.businessImpact ?? "",
    impactLevel: parsed.tingkatdampak ?? "MEDIUM",
    isBreakingChange: parsed.perubahandata ?? false,
    affectedFiles,
    affectedComponents: parsed.komponenTerdampak ?? [],
    estimatedEffort: parsed.estimasiwaktu ?? "Unknown",
    riskLevel: parsed.tingkatRisiko ?? "Medium",
    highlights: parsed.highlights ?? [],
    specMd: parsed.specMd ?? "",
    codeBackend: parsed.codeBackend ?? "",
    sqlMigrasi: parsed.sqlMigrasi ?? "",
  };
}

