import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

export function UploadSpecButton() {
  return (
    <Button varian="outline" ukuran="sm" className="gap-2">
      <Upload className="h-4 w-4" />
      Upload New Spec
    </Button>
  );
}
