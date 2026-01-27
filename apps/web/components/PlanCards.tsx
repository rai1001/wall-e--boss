import { PlanToday } from "../lib/types";

interface Props {
  data: PlanToday;
}

export function PlanCards({ data }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Plan A/B/C</h2>
        <span className="pill bg-amber-300 text-amber-900">Sugiere: {data.suggestion}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.plans.map((plan) => (
          <article key={plan.label} className="card hover:shadow-lg transition">
            <p className="text-xs uppercase tracking-widest text-slate-500">{plan.focus}</p>
            <h3 className="text-lg font-semibold text-slate-900">{plan.label}</h3>
            <p className="text-sm text-slate-600 mb-2">{plan.reason}</p>
            <ul className="space-y-1 text-sm text-slate-800">
              {plan.blocks.map((b, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="h-2 w-2 rounded-full bg-slate-900 mt-1" />
                  {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
