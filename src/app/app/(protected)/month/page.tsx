"use client";

import { useEffect, useState } from "react";

export default function MonthPage() {
  const [days, setDays] = useState<{ date: string; day_type: string; eventos: number; descanso: boolean }[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/summary/month", { cache: "no-store" });
      const json = await res.json();
      setDays(json.days ?? []);
    };
    load();
  }, []);

  return (
    <div className="space-y-4 text-slate-100">
      <h1 className="text-xl font-semibold">Mes</h1>
      <div className="grid grid-cols-7 gap-2 text-xs">
        {days.map((d) => (
          <div key={d.date} className="rounded-lg border border-slate-800 bg-slate-900 p-2">
            <p className="font-semibold">{d.date.split("-")[2]}</p>
            <p className="text-[11px] text-slate-400">{d.day_type}</p>
            {d.descanso ? <p className="text-[10px] text-emerald-300">DESCANSO</p> : null}
            {d.eventos > 0 ? <p className="text-[10px] text-amber-300">Eventos: {d.eventos}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
