import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputkelas: ClassValue[]) {
  return twMerge(clsx(inputkelas));
}
