"use client";

import * as React from "react";

import { HistorySidebar } from "@/components/history-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <div className="flex min-h-screen w-full">
        <HistorySidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
