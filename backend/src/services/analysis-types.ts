export interface KomponentDampak {
  nama: string;
}

export interface DaftarTugas {
  kategori: string;
  items: string[];
}

export interface RingkasanDampak {
  tingkatdampak: "HIGH" | "MEDIUM" | "LOW";
  perubahandata: boolean;
  komponenTerdampak: KomponentDampak[];
  estimasiwaktu: string;
  tingkatRisiko: "High" | "Medium" | "Low";
  magnitudeRisiko: number;
}

export interface RencanaPelaksanaan {
  daftarTugas: DaftarTugas[];
  codeBackend: string;
  sqlMigrasi: string;
}

export interface SpesifikasiTerbuka {
  tersedia: boolean;
  kontenSpec: string;
}

export interface HasilAnalisis {
  businessTranslation: string;
  businessImpact: string;
  ringkasanDampak: RingkasanDampak;
  highlights: string[];
  rencanaPelaksanaan: RencanaPelaksanaan;
  spesifikasiTerbuka: SpesifikasiTerbuka;
}

export interface AnalisisRequestBody {
  inputperubahan: string;
  kontekssistem: string;
  repoUrl?: string;
  businessRequirement?: string;
  githubToken?: string;
}

export interface ErrorResponse {
  kode: string;
  pesan: string;
}
