import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function TopHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 md:px-10">
      <div className="flex w-full items-center gap-3 md:w-auto">
        <div className="relative flex-1 md:flex-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            placeholder="Search specifications, logs, or blueprints"
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button varian="ghost" ukuran="sm" className="hidden md:inline-flex">
          Docs
        </Button>
        <Button varian="ghost" ukuran="sm" className="hidden md:inline-flex">
          Support
        </Button>
        <Button varian="ghost" ukuran="sm" className="hidden md:inline-flex">
          API
        </Button>
        <Button varian="outline" ukuran="sm">
          Review
        </Button>
        <Button ukuran="sm" className="bg-sky-600 text-white hover:bg-sky-500">
          Deploy
        </Button>
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500"
          type="button"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
