"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { setAuthToken } from "@/lib/auth-token";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Login gagal (${res.status}).`);
      }

      if (typeof data?.token !== "string") {
        throw new Error("Token tidak ditemukan di respons.");
      }

      setAuthToken(data.token);
      router.push("/input");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login gagal.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-1 cursor-pointer">
          <span className="font-jakarta font-bold text-xl text-gray-900">
            Spec<span className="text-[#F9A01B]">Flow</span>
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] bg-white rounded-[24px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-8">
          <h1 className="text-2xl font-jakarta font-bold text-gray-900">Login</h1>
          <p className="mt-1 text-sm text-gray-600">
            Masuk untuk menyimpan dan melihat histori analisis.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
                Username / Email
              </label>
              <input
                className="mt-2 w-full bg-white border border-gray-200 rounded-[10px] px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="jane atau jane@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
                Password
              </label>
              <input
                type="password"
                className="mt-2 w-full bg-white border border-gray-200 rounded-[10px] px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-[10px] bg-red-50 border border-red-100 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] font-semibold text-[15px] transition-all duration-200 ${
                isLoading
                  ? "bg-[#CBD5E1] text-white cursor-not-allowed"
                  : "bg-[#F9A01B] text-white hover:bg-[#E58F15] shadow-md shadow-orange-100"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing in…" : "Login"}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-[#FF6B00] hover:text-[#E66000]">
                Register
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
