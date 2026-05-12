import JSZip from "jszip";

import { HasilAnalisis } from "./analysis-types";

export async function generateExport(hasilanalisis: HasilAnalisis): Promise<Buffer> {
  const zip = new JSZip();

  const specContent = hasilanalisis.spesifikasiTerbuka.kontenSpec || "";
  const migrationSql = hasilanalisis.rencanaPelaksanaan.sqlMigrasi || "";
  const backendSnippet = hasilanalisis.rencanaPelaksanaan.codeBackend || "";

  const tasksContent = hasilanalisis.rencanaPelaksanaan.daftarTugas
    .flatMap((grup) => grup.items.map((item) => `- [ ] ${item}`))
    .join("\n") || "- [ ] No tasks available.";

  zip.file("spec.md", specContent);
  zip.file("migration.sql", migrationSql);
  zip.file("tasks.md", tasksContent);
  zip.file("backend-snippet.ts", backendSnippet);

  return zip.generateAsync({ type: "nodebuffer" });
}
