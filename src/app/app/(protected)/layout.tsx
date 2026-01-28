"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";

const navItems = [
  { href: "/app/today", label: "Hoy" },
  { href: "/app/tasks", label: "Tareas" },
  { href: "/app/week", label: "Semana" },
  { href: "/app/month", label: "Mes" },
  { href: "/app/settings", label: "Ajustes" },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };
    run();
  }, [router]);

  if (loading) return <div className="p-4 text-sm text-gray-600">Cargando sesión...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="font-semibold">WALL-E</span>
          <nav className="flex gap-3 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1 ${
                  pathname.startsWith(item.href) ? "bg-emerald-600 text-white" : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
