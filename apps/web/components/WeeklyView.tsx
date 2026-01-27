import { Task } from "../lib/types";

interface Props {
  tasks: Task[];
}

export function WeeklyView({ tasks }: Props) {
  const today = new Date();
  const weekDays = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + idx);
    return d;
  });

  const grouped = weekDays.map((d) => {
    const dayStr = d.toISOString().slice(0, 10);
    const items = tasks.filter((t) => t.due_date === dayStr);
    return { date: d, items };
  });

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Semana</h3>
        <span className="text-xs text-slate-500">vista simple</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {grouped.map(({ date, items }) => (
          <div key={date.toISOString()} className="card shadow-none border border-slate-100">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              {date.toLocaleDateString("es-ES", { weekday: "short" })}
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {date.getDate()} {date.toLocaleDateString("es-ES", { month: "short" })}
            </p>
            <ul className="mt-1 space-y-1 text-xs text-slate-700">
              {items.length ? items.map((t) => <li key={t.id}>• {t.title}</li>) : <li className="text-slate-400">—</li>}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
