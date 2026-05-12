import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AnalyzeImpactButton } from "@/components/analyze-impact-button";

export function RequirementInputCard() {
  const contohinput =
    "Tambahkan TOEFL minimal 450 saat mengajukan SKL\nBatasi pengajuan hanya untuk mahasiswa aktif\nValidasi email harus email kampus";

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>New Business Request (Natural Language)</CardTitle>
        <CardDescription>Ceritakan perubahan alur bisnis terbaru</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <Textarea placeholder={contohinput} />
        <p className="text-xs text-slate-500">
          Tips: jelaskan perubahan dalam bahasa natural.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <AnalyzeImpactButton />
        <p className="text-xs text-slate-500">
          Sistem akan menganalisis perubahan dan menghasilkan technical blueprint.
        </p>
      </CardFooter>
    </Card>
  );
}
