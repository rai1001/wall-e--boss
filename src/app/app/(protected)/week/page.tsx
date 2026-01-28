"use client";

import { useEffect, useState } from "react";

type DaySummary = {
  date: string;
  day_type: string;
  events: number;
  vip_tasks: number;
};

export default function WeekPage() {
  const [days, setDays] = useState<DaySummary[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/summary/week", { cache: "no-store" });
      const json = await res.json();
      setDays(json.days ?? []);
    };
    load();
  }, []);

  return (
    <div className="space-y-4 text-slate-100">
      <h1 className="text-xl font-semibold">Semana</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {days.map((day) => (
          <div key={day.date} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <p className="text-sm font-semibold">{day.date}</p>
            <p className="text-xs text-slate-400">Tipo: {day.day_type}</p>
            <p className="text-xs text-slate-400">Eventos: {day.events}</p>
            <p className="text-xs text-slate-400">VIP: {day.vip_tasks}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
