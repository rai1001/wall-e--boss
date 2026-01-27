'use client';

import { useEffect, useState } from "react";
import { BriefingCard } from "../components/BriefingCard";
import { PlanCards } from "../components/PlanCards";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { WeeklyView } from "../components/WeeklyView";
import { Briefing, PlanToday, Task } from "../lib/types";
import { createTask, deleteTask, getBriefing, getPlanToday, listTasks, updateTask } from "../lib/api";

export default function Home() {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [plan, setPlan] = useState<PlanToday | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    (async () => {
      const [b, p, t] = await Promise.all([getBriefing(), getPlanToday(), listTasks()]);
      setBriefing(b);
      setPlan(p);
      setTasks(t);
    })();
  }, []);

  const refreshTasks = async () => {
    const t = await listTasks();
    setTasks(t);
  };

  const handleCreate = async (payload: { title: string; priority: any; tags: string[]; due_date?: string | null }) => {
    setLoadingTasks(true);
    await createTask(payload as any);
    await refreshTasks();
    setLoadingTasks(false);
  };

  const handleUpdate = async (id: number, patch: Partial<Task>) => {
    setLoadingTasks(true);
    await updateTask(id, patch as any);
    await refreshTasks();
    setLoadingTasks(false);
  };

  const handleDelete = async (id: number) => {
    setLoadingTasks(true);
    await deleteTask(id);
    await refreshTasks();
    setLoadingTasks(false);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">WALL-E</p>
          <h1 className="text-3xl font-bold text-slate-900">Hola Rai, aquí tu día</h1>
          <p className="text-sm text-slate-600">Mobile-first, to-do + briefing + plan.</p>
        </div>
        <button className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm shadow-soft active:scale-95 transition">
          Hablar (placeholder)
        </button>
      </header>

      {briefing && <BriefingCard data={briefing} />}

      {plan && <PlanCards data={plan} />}

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4">
        <TaskList tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />
        <TaskForm onCreate={handleCreate} busy={loadingTasks} />
      </div>

      <WeeklyView tasks={tasks} />
    </main>
  );
}
