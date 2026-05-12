import * as React from "react";
import {
  FileSearch,
  GitPullRequestArrow,
  LayoutDashboard,
  ListChecks,
  NotebookText,
  ScrollText,
  Settings,
} from "lucide-react";


const daftarfitur = [
  { namamenu: "Dashboard", ikon: LayoutDashboard },
  { namamenu: "Change Requests", ikon: GitPullRequestArrow },
  { namamenu: "Impact Analysis", ikon: ListChecks },
  { namamenu: "Blueprints", ikon: ScrollText },
  { namamenu: "History", ikon: NotebookText },
  { namamenu: "OpenSpec Explorer", ikon: FileSearch },
  { namamenu: "Project Settings", ikon: Settings },
];

export function SidebarNavigation() {
  const menuterpilih = "Dashboard";

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-900 px-5 py-6 text-slate-100 md:flex">
      <div className="flex items-center gap-3 px-2">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-100">
          <span className="absolute -inset-0.5 rounded-xl bg-sky-500/20 blur" />
          <span className="relative text-sm font-semibold">SF</span>
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-wide">SpecFlow AI</p>
          <p className="text-xs text-slate-400">v2.4.0 stable</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {daftarfitur.map((itemmenu) => {
          const aktif = itemmenu.namamenu === menuterpilih;

          return (
            <button
              key={itemmenu.namamenu}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                aktif
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
              type="button"
            >
              {React.createElement(itemmenu.ikon, {
                className: "h-4 w-4",
              })}
              <span>{itemmenu.namamenu}</span>
            </button>
          );
        })}
      </nav>

    </aside>
  );
}
