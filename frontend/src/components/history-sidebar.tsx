"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, History, LogIn, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearAuthToken, getAuthToken } from "@/lib/auth-token";

type HistoryItem = {
  id: string;
  repoUrl: string | null;
  businessRequirement: string | null;
  createdAt: string;
};

const COLLAPSE_KEY = "sf_sidebar_collapsed";

function truncate(text: string, max = 44) {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function HistorySidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = React.useState(false);
  const [items, setItems] = React.useState<HistoryItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const token = getAuthToken();

  React.useEffect(() => {
    try {
      const v = localStorage.getItem(COLLAPSE_KEY);
      if (v === "1") setCollapsed(true);
    } catch {
      // ignore
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }

  async function loadHistory() {
    if (!token) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Failed to load history (${res.status}).`);
      }
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load history.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    // Reload when route changes (e.g. after a new analysis is created).
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, token]);

  function handleLogout() {
    clearAuthToken();
    try {
      sessionStorage.removeItem("analysisResult");
    } catch {
      // ignore
    }
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 border-r border-gray-100 bg-white",
        collapsed ? "w-[72px]" : "w-[300px]"
      )}
    >
      <div className={cn("flex h-full flex-col", collapsed ? "px-3" : "px-4")}>
        <div className="flex items-center justify-between gap-2 py-4">
          <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center")}
          >
            <div className="h-9 w-9 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold">
              SF
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="text-sm font-semibold text-gray-900">SpecFlow</div>
                <div className="text-xs text-gray-500">History</div>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "h-9 w-9 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 mx-auto" />
            ) : (
              <ChevronLeft className="h-4 w-4 mx-auto" />
            )}
          </button>
        </div>

        <div className={cn("mt-2 flex-1", collapsed ? "" : "pr-1")}
        >
          <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "")}
          >
            <History className="h-4 w-4 text-gray-500" />
            {!collapsed && (
              <div className="text-xs font-bold tracking-widest uppercase text-gray-500">
                Analysis History
              </div>
            )}
          </div>

          <div className={cn("mt-3", collapsed ? "" : "")}
          >
            {!token && (
              <div className={cn("rounded-xl border border-gray-200 bg-white p-3", collapsed && "hidden")}>
                <p className="text-sm text-gray-600">
                  Login untuk menyimpan dan melihat histori analisis.
                </p>
                <div className="mt-3">
                  <Link href="/login">
                    <Button className="w-full rounded-xl bg-[#FF6B00] text-white hover:bg-[#E66000]">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {token && (
              <>
                {loading && !collapsed && (
                  <p className="text-sm text-gray-500">Loading…</p>
                )}
                {error && !collapsed && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <div className={cn("mt-2 flex flex-col gap-1", collapsed && "items-center")}
                >
                  {items.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => router.push(`/impact-analysis?id=${encodeURIComponent(it.id)}`)}
                      className={cn(
                        "w-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-left",
                        collapsed ? "h-10 w-10 flex items-center justify-center" : "px-3 py-2"
                      )}
                      title={it.businessRequirement ?? it.repoUrl ?? it.id}
                    >
                      {collapsed ? (
                        <span className="text-xs font-bold text-gray-700">{String(items.indexOf(it) + 1)}</span>
                      ) : (
                        <>
                          <div className="text-sm font-semibold text-gray-900">
                            {truncate(it.businessRequirement || "(no requirement)")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {truncate(it.repoUrl || "(no repo)", 52)}
                          </div>
                        </>
                      )}
                    </button>
                  ))}

                  {items.length === 0 && !loading && !collapsed && (
                    <p className="text-sm text-gray-500">
                      Belum ada histori.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="py-4">
          {token ? (
            <Button
              varian="outline"
              onClick={handleLogout}
              className={cn(
                "w-full rounded-xl",
                collapsed && "w-10 px-0 justify-center"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && "Logout"}
            </Button>
          ) : (
            <Link href="/register" className={cn(collapsed && "hidden")}>
              <Button varian="outline" className="w-full rounded-xl">
                Create account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
