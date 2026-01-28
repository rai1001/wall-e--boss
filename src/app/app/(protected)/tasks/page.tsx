"use client";

import { FormEvent, useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  priority: "VIP" | "IMPORTANT" | "NORMAL";
  tags: string[];
  status: "TODO" | "DOING" | "DONE" | "SNOOZED";
};

const priorities: Task["priority"][] = ["VIP", "IMPORTANT", "NORMAL"];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("NORMAL");
  const [tags, setTags] = useState("");

  const loadTasks = async () => {
    const res = await fetch("/api/tasks");
    const json = await res.json();
    setTasks(json.tasks ?? []);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTasks();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) }),
    });
    setTitle("");
    setTags("");
    await loadTasks();
  };

  const setStatus = async (id: string, status: Task["status"]) => {
    await fetch(`/api/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    await loadTasks();
  };

  const remove = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    await loadTasks();
  };

  return (
    <div className="space-y-4 text-slate-100">
      <h1 className="text-xl font-semibold">Tareas</h1>
      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          placeholder="Etiquetas separadas por coma (work,home,dogs)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400">Añadir tarea</button>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
            <div>
              <p className="text-sm font-semibold">{task.title}</p>
              <p className="text-[11px] text-slate-400">
                {task.priority} · {task.tags.join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setStatus(task.id, task.status === "DONE" ? "TODO" : "DONE")}
                className="rounded-full bg-slate-800 px-3 py-1"
              >
                {task.status === "DONE" ? "Reabrir" : "Hecho"}
              </button>
              <button onClick={() => setStatus(task.id, "SNOOZED")} className="rounded-full bg-slate-800 px-3 py-1">
                Posponer
              </button>
              <button onClick={() => remove(task.id)} className="rounded-full bg-rose-600 px-3 py-1 text-slate-50">
                Borrar
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 ? <p className="text-sm text-slate-400">Sin tareas aún.</p> : null}
      </div>
    </div>
  );
}
