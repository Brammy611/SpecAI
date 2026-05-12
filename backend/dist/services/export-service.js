"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExport = generateExport;
const jszip_1 = __importDefault(require("jszip"));
async function generateExport(hasilanalisis) {
    const zip = new jszip_1.default();
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
