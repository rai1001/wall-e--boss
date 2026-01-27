import { useState } from "react";
import type { Priority } from "../lib/types";

interface Props {
  onCreate: (data: { title: string; priority: Priority; tags: string[]; due_date?: string | null }) => Promise<void>;
  busy?: boolean;
}

export function TaskForm({ onCreate, busy = false }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Normal");
  const [tags, setTags] = useState("work");
  const [dueDate, setDueDate] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({
      title: title.trim(),
      priority,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      due_date: dueDate || null
    });
    setTitle("");
    setTags("work");
    setDueDate("");
    setPriority("Normal");
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Añadir tarea</h3>
        <span className="pill bg-slate-900 text-white">rápido</span>
      </div>
      <input
        className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-slate-700 space-y-1">
          Prioridad
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="VIP">VIP</option>
            <option value="Important">Importante</option>
            <option value="Normal">Normal</option>
          </select>
        </label>
        <label className="text-sm text-slate-700 space-y-1">
          Fecha (opcional)
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </label>
      </div>
      <label className="text-sm text-slate-700 space-y-1">
        Tags (separados por coma)
        <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-slate-900 text-white py-2 font-semibold hover:bg-slate-800 transition disabled:opacity-60"
      >
        {busy ? "Guardando..." : "Crear tarea"}
      </button>
    </form>
  );
}
