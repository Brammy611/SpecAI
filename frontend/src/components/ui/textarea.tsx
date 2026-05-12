import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className: kelas, ...properti }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-40 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10",
        kelas
      )}
      {...properti}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
