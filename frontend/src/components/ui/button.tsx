import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const variastombol = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      varian: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
        ghost: "text-slate-700 hover:bg-slate-100",
      },
      ukuran: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      varian: "default",
      ukuran: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variastombol> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className: kelas, varian, ukuran, ...properti }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(variastombol({ varian, ukuran, className: kelas }))}
        {...properti}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, variastombol };
