import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadSpecButton } from "@/components/upload-spec-button";
import { spesifikasiyaml } from "@/data/dummy-data";

export function CurrentSpecCard() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Current System (OpenSpec - v1)</CardTitle>
        <CardDescription>API Spec (api-spec-v1.yaml)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="code-surface">
          <pre className="code-content">{spesifikasiyaml.join("\n")}</pre>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <UploadSpecButton />
      </CardFooter>
    </Card>
  );
}
