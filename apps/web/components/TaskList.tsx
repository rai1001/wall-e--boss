import { Task } from "../lib/types";

interface Props {
  tasks: Task[];
  onUpdate: (id: number, patch: Partial<Task>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const priorityColors: Record<string, string> = {
  VIP: "bg-amber-300 text-amber-900",
  Important: "bg-moss/20 text-moss-800",
  Normal: "bg-slate-200 text-slate-800"
};

export function TaskList({ tasks, onUpdate, onDelete }: Props) {
  return (
    <section className="card space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Tareas</h3>
        <span className="text-xs text-slate-500">{tasks.length} abiertas</span>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border border-slate-100 rounded-xl p-3 bg-white/90 flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`pill ${priorityColors[task.priority]}`}>{task.priority}</span>
                {task.due_date && (
                  <span className="pill bg-slate-900/10 text-slate-800">
                    {new Date(task.due_date).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
                  </span>
                )}
                <span className="pill bg-slate-100 text-slate-700 capitalize">{task.status}</span>
              </div>
              <p className="text-sm text-slate-900 font-semibold mt-1">{task.title}</p>
              <p className="text-xs text-slate-500 mt-1">{task.tags?.join(", ")}</p>
            </div>
            <div className="flex items-center gap-2">
              {task.status !== "done" && (
                <button
                  className="text-xs px-3 py-2 rounded-lg bg-amber-300 text-amber-900"
                  onClick={() => onUpdate(task.id, { status: "done" })}
                >
                  Hecho
                </button>
              )}
              <button
                className="text-xs px-3 py-2 rounded-lg bg-slate-900 text-white"
                onClick={() => onDelete(task.id)}
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && <p className="text-sm text-slate-600">Sin tareas por ahora.</p>}
      </ul>
    </section>
  );
}
