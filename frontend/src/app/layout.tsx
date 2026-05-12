import type { Metadata } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import "../styles/dashboard.css";

const fontutama = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const fontmono = JetBrains_Mono({
  variable: "--font-jetbrains",
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
      className={`${fontutama.variable} ${fontmono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
