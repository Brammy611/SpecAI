import type { Metadata } from "next";
import { JetBrains_Mono, Sora, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import "../styles/dashboard.css";
import "../styles/input-page.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fontutama = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const fontmono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const fontjakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpecFlow AI Dashboard",
  description:
    "SpecFlow AI dashboard for business requirement impact analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
      lang="en"
      className={cn("h-full", "antialiased", fontutama.variable, fontmono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
