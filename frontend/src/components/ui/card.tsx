import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className: kelas, ...properti }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        kelas
      )}
      {...properti}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className: kelas, ...properti }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 px-6 pt-6", kelas)}
    {...properti}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className: kelas, ...properti }, ref) => (
  <h3
    ref={ref}
    className={cn("text-base font-semibold text-slate-900", kelas)}
    {...properti}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className: kelas, ...properti }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", kelas)}
    {...properti}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className: kelas, ...properti }, ref) => (
  <div ref={ref} className={cn("px-6", kelas)} {...properti} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className: kelas, ...properti }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center px-6 pb-6", kelas)}
    {...properti}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
