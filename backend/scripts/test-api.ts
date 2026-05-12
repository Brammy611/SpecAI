import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments with defaults
  const repoUrl = args[0] || "https://github.com/akmalscript/martplace";
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
  console.log("💡 Run for analysis\n");

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
    const ringkasan = analysis.ringkasanDampak;
    const rencana = analysis.rencanaPelaksanaan;
    const spesifikasi = analysis.spesifikasiTerbuka;

    console.log("✅ Analysis Complete! (" + duration + "s)");
    console.log("==================================================");
    console.log(`📁 Files Indexed:       ${data.filesIndexed}`);
    console.log(`📊 Impact Level:       ${ringkasan?.tingkatdampak ?? "-"}`);
    console.log(`🔄 Data Changes:       ${ringkasan?.perubahandata ?? "-"}`);
    console.log(`🛠️  Effort Estimate:    ${ringkasan?.estimasiwaktu ?? "-"}`);
    console.log(`🔥 Risk Level:         ${ringkasan?.tingkatRisiko ?? "-"}`);
    console.log("==================================================\n");

    console.log("📍 KOMPONEN TERDAMPAK:");
    console.log("--------------------------------------------------");
    const komponenList: Array<{ nama: string }> = ringkasan?.komponenTerdampak ?? [];
    if (komponenList.length === 0) {
      console.log("  (tidak ada komponen terdampak)");
    } else {
      komponenList.forEach((komp, i) => {
        console.log(`${i + 1}. ${komp.nama}`);
      });
    }
    console.log("--------------------------------------------------\n");

    console.log("📋 DAFTAR TUGAS (rencanaPelaksanaan):");
    console.log("--------------------------------------------------");
    const daftarTugas: any[] = rencana?.daftarTugas ?? [];
    if (daftarTugas.length === 0) {
      console.log("  (tidak ada tugas)");
    } else {
      daftarTugas.forEach((tugas, i) => {
        const label = typeof tugas === "string" ? tugas : JSON.stringify(tugas);
        console.log(`${i + 1}. ${label}`);
      });
    }
    console.log("--------------------------------------------------\n");

    console.log("📄 SPESIFIKASI TERBUKA (kontenSpec):");
    console.log("==================================================");
    console.log(spesifikasi?.kontenSpec ?? "(tidak ada konten spesifikasi)");
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
