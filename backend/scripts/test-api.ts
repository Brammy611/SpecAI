import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments with defaults
  const repoUrl = args[0] || "https://github.com/AlvinHarist/tomat";
  const businessRequirement = args[1] || "We need to add a cart.";
  const githubToken = process.env.GITHUB_TOKEN || "";

  console.log("\n==================================================");
  console.log("🚀 Starting Repo AI Analyzer CLI Test Client");
  console.log("==================================================");
  console.log(`📡 Targeting Backend:  ${BACKEND_URL}`);
  console.log(`📦 Repository URL:     ${repoUrl}`);
  console.log(`📝 Requirement:        "${businessRequirement}"`);
  if (githubToken) {
    console.log(`🔑 GitHub Token:       Provided (masked)`);
  } else {
    console.log(`🔑 GitHub Token:       None (using public endpoint)`);
  }
  console.log("==================================================\n");

  console.log("⏳ Sending request to analyze repository...");
  console.log("💡 (This takes some time as it fetches files, embeds, and runs Google Gemini LLM analysis...)\n");

  try {
    const startTime = Date.now();
    const response = await axios.post(`${BACKEND_URL}/api/analyze`, {
      repoUrl,
      businessRequirement,
      githubToken: githubToken || undefined,
    });
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    const data = response.data;
    if (!data.ok || !data.analysis) {
      throw new Error("Invalid response format received from backend.");
    }

    const analysis = data.analysis;

    console.log("✅ Analysis Complete! (" + duration + "s)");
    console.log("==================================================");
    console.log(`📁 Files Indexed:       ${data.filesIndexed}`);
    console.log(`📊 Impact Level:       ${analysis.impactLevel}`);
    console.log(`⚠️  Breaking Change:    ${analysis.isBreakingChange ? "YES" : "NO"}`);
    console.log(`🛠️  Effort Estimate:    ${analysis.estimatedEffort}`);
    console.log(`🔥 Risk Level:         ${analysis.riskLevel}`);
    console.log("==================================================\n");

    console.log("💡 BUSINESS TRANSLATION:");
    console.log("--------------------------------------------------");
    console.log(analysis.businessTranslation);
    console.log("--------------------------------------------------\n");

    console.log("📍 IMPACTED COMPONENTS:");
    console.log("--------------------------------------------------");
    analysis.affectedComponents.forEach((comp: string, i: number) => {
      console.log(`${i + 1}. ${comp}`);
    });
    console.log("--------------------------------------------------\n");

    console.log("🌟 HIGHLIGHTS / ACTIONS:");
    console.log("--------------------------------------------------");
    analysis.highlights.forEach((hl: string, i: number) => {
      console.log(`• ${hl}`);
    });
    console.log("--------------------------------------------------\n");

    console.log("📂 SEMANTICALLY AFFECTED FILES FOUND:");
    console.log("--------------------------------------------------");
    analysis.affectedFiles.forEach((file: string, i: number) => {
      console.log(`  - ${file}`);
    });
    console.log("--------------------------------------------------\n");

    console.log("📄 GENERATED SPECIFICATION (spec.md):");
    console.log("==================================================");
    console.log(analysis.specMd);
    console.log("==================================================\n");

  } catch (err: any) {
    console.error("\n❌ Error running analysis!");
    if (err.code === "ECONNREFUSED") {
      console.error(`🔌 Connection refused! Is the backend server running on ${BACKEND_URL}?`);
      console.error("👉 Please run 'npm run dev' inside the backend folder first.\n");
    } else if (err.response) {
      console.error(`💥 Backend responded with status ${err.response.status}:`);
      console.error(JSON.stringify(err.response.data, null, 2) + "\n");
    } else {
      console.error(err.message || err);
      console.error("\n");
    }
    process.exit(1);
  }
}

main();
