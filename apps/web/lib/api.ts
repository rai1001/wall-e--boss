import type { Briefing, PlanToday, Task, Priority, TaskStatus } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function safeFetch<T>(path: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export async function getBriefing(): Promise<Briefing> {
  return safeFetch<Briefing>("/briefing/today", undefined, {
    day: new Date().toISOString().slice(0, 10),
    mode: "normal",
    is_off_day: false,
    off_day_suspected: false,
    agenda: [{ title: "Agenda de hoy", items: ["(sin eventos)"] }],
    plan_summary: [
      "Plan A: supervivencia (perros esencial + VIP + casa 15)",
      "Plan B: micro-bloque extra",
      "Plan C: si hay hueco largo"
    ],
    top_vip: [],
    dogs: [
      "Paseo al despertar (10-15 min)",
      "Paseo antes de salir",
      "Paseo al volver",
      "Paseo noche"
    ],
    house: [
      "Casa 15: platos, encimera, barrido rápido, basura",
      "Casa 30: + baño rápido o aspirado",
      "Casa 60: zonas + extra rotativo",
      "Profunda: cocina/baño a fondo"
    ]
  });
}

export async function getPlanToday(): Promise<PlanToday> {
  return safeFetch<PlanToday>("/plan/today", undefined, {
    date: new Date().toISOString().slice(0, 10),
    suggestion: "Plan A",
    plans: [
      {
        label: "Plan A (mock)",
        focus: "Supervivencia",
        reason: "Datos mock",
        blocks: ["Perros", "Tarea VIP", "Casa 15"]
      },
      {
        label: "Plan B (mock)",
        focus: "Añadir micro-bloque",
        reason: "Si aparece hueco",
        blocks: ["Plan A", "Micro máster 20 min"]
      },
      {
        label: "Plan C (mock)",
        focus: "Aprovechar hueco largo",
        reason: "Día despejado",
        blocks: ["Plan B", "Bloque foco 60 min"]
      }
    ]
  });
}

export async function listTasks(): Promise<Task[]> {
  return safeFetch<Task[]>("/tasks", undefined, []);
}

export async function createTask(payload: {
  title: string;
  priority: Priority;
  tags: string[];
  due_date?: string | null;
}): Promise<Task> {
  return safeFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ ...payload, status: "pending" })
  });
}

export async function updateTask(
  id: number,
  payload: Partial<{ title: string; priority: Priority; status: TaskStatus; tags: string[]; due_date?: string | null }>
): Promise<Task> {
  return safeFetch<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function deleteTask(id: number): Promise<void> {
  await safeFetch(`/tasks/${id}`, { method: "DELETE" }, undefined);
}
