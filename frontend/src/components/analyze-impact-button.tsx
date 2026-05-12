import { Button } from "@/components/ui/button";

type AnalyzeImpactButtonProps = {
  isLoading?: boolean;
  onClick?: () => void;
};

export function AnalyzeImpactButton({
  isLoading = false,
  onClick,
}: AnalyzeImpactButtonProps) {
  return (
    <Button
      className="w-full bg-slate-900 text-white hover:bg-slate-800"
      onClick={onClick}
      disabled={isLoading}
      type="button"
    >
      {isLoading ? "Analyzing Impact..." : "Analyze Impact"}
    </Button>
  );
}
