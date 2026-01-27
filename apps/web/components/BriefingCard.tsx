import { Briefing } from "../lib/types";

interface Props {
  data: Briefing;
}

export function BriefingCard({ data }: Props) {
  return (
    <section className="card space-y-3">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Hoy</p>
          <h2 className="text-xl font-bold text-slate-900">Briefing</h2>
          <p className="text-sm text-slate-600">
            Modo: <span className="font-semibold">{data.mode}</span>{" "}
            {data.is_off_day && <span className="pill bg-amber-200 text-amber-800">DESCANSO</span>}
          </p>
        </div>
        <div className="pill bg-slate-900 text-white">
          {new Date(data.day).toLocaleDateString("es-ES", { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </header>

      <div className="space-y-2">
        {data.agenda.map((section) => (
          <div key={section.title}>
            <p className="title">{section.title}</p>
            <ul className="mt-1 space-y-1 text-sm text-slate-700">
              {section.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="card bg-white/80 shadow-none border border-slate-100">
          <p className="title">Top VIP</p>
          <ul className="mt-1 space-y-1 text-slate-700">
            {data.top_vip.length ? data.top_vip.map((item, idx) => <li key={idx}>• {item}</li>) : <li>Sin VIP hoy</li>}
          </ul>
        </div>
        <div className="card bg-white/80 shadow-none border border-slate-100">
          <p className="title">Plan A/B/C</p>
          <ul className="mt-1 space-y-1 text-slate-700">
            {data.plan_summary.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="card bg-moss/5 border border-moss/20 shadow-none">
          <p className="title">Pugs</p>
          <ul className="mt-1 space-y-1 text-slate-700">
            {data.dogs.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="card bg-amber/10 border border-amber/30 shadow-none">
          <p className="title">Casa</p>
          <ul className="mt-1 space-y-1 text-slate-700">
            {data.house.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      {data.off_day_suspected && (
        <div className="bg-slate-900 text-white rounded-xl p-3 text-sm">
          Hueco sospechoso: Rai, ¿hoy libras?
        </div>
      )}
    </section>
  );
}
