"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PlanBlock = {
  type: string;
  label: string;
  minutes: number;
};

type PlanOption = {
  option: "A" | "B" | "C";
  summary: string;
  blocks: PlanBlock[];
  reasons: string[];
};

type PlanResponse = {
  day_type: string;
  recommended_option: "A" | "B" | "C";
  options: PlanOption[];
  suspected_off: boolean;
};

type BriefingResponse = {
  text: string;
  day_type: string;
  recommended_option: "A" | "B" | "C";
  options: PlanOption[];
  suspected_off: boolean;
};

type Task = {
  id: string;
  title: string;
  priority: string;
  tags: string[];
  status: string;
};

type Followup = {
  id: string;
  next_at: string;
  level: number;
  tasks?: Task;
};

type MeetingNote = {
  id: string;
  title: string;
  summary?: string;
  action_items?: { title: string; tags?: string[] }[];
};

const priorityColor: Record<string, string> = {
  VIP: "bg-rose-500",
  IMPORTANT: "bg-amber-500",
  NORMAL: "bg-slate-500",
};

export default function TodayPage() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [style, setStyle] = useState<"FAMILY" | "WORK">("FAMILY");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingSummary, setMeetingSummary] = useState("");
  const [meetingActionItems, setMeetingActionItems] = useState("");
  const [meetings, setMeetings] = useState<MeetingNote[]>([]);

  const loadData = async (selectedStyle = style) => {
    setLoading(true);
    const [planRes, briefingRes, tasksRes, followRes, meetingRes] = await Promise.all([
      fetch("/api/plan/today", { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/briefing/today?style=${selectedStyle}`, { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/tasks", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/followups", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/meetings", { cache: "no-store" }).then((r) => r.json()),
    ]);
    setPlan(planRes);
    setBriefing(briefingRes);
    setTasks(tasksRes.tasks ?? []);
    setFollowups(followRes.followups ?? []);
    setMeetings(meetingRes.meetings ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmOff = async () => {
    await fetch("/api/day/confirm-off", { method: "POST" });
    setMessage("Marcado como DESCANSO");
    loadData();
  };

  const clearSuspected = async () => {
    await loadData();
  };

  const handleFollowAction = async (followupId: string, action: "done" | "snooze" | "lower") => {
    await fetch("/api/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followup_id: followupId, action }),
    });
    loadData();
  };

  const submitMeeting = async () => {
    const actionItems = meetingActionItems
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((title) => ({ title, tags: ["work"] }));
    await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: meetingTitle || "Reunión", summary: meetingSummary, action_items: actionItems }),
    });
    setMeetingTitle("");
    setMeetingSummary("");
    setMeetingActionItems("");
    loadData();
  };

  if (loading || !plan || !briefing) {
    return <div className="text-slate-200">Cargando plan de hoy...</div>;
  }

  return (
    <div className="space-y-4 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Tipo de día</p>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold">{plan.day_type}</span>
            {plan.suspected_off ? (
              <span className="rounded-full bg-amber-600 px-3 py-1 text-xs">¿Hoy libras?</span>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => {
              setStyle("FAMILY");
              loadData("FAMILY");
            }}
            className={`rounded-full px-3 py-1 ${style === "FAMILY" ? "bg-emerald-500 text-slate-900" : "bg-slate-800"}`}
          >
            Familia
          </button>
          <button
            onClick={() => {
              setStyle("WORK");
              loadData("WORK");
            }}
            className={`rounded-full px-3 py-1 ${style === "WORK" ? "bg-emerald-500 text-slate-900" : "bg-slate-800"}`}
          >
            Trabajo
          </button>
        </div>
      </div>

      {plan.suspected_off ? (
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4">
          <p className="text-sm font-semibold">Rai, veo hueco grande. ¿Hoy libras?</p>
          <div className="mt-2 flex gap-2 text-sm">
            <button onClick={confirmOff} className="rounded-full bg-amber-500 px-3 py-1 font-semibold text-slate-900">
              Sí, marca DESCANSO
            </button>
            <button onClick={clearSuspected} className="rounded-full border border-amber-500 px-3 py-1 text-amber-200">
              No, sigue normal
            </button>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Briefing {style === "FAMILY" ? "familia" : "trabajo"}</h2>
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-900">
            Plan {plan.recommended_option}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">{briefing.text}</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Plan A/B/C</h3>
          <span className="text-xs text-slate-400">Recomendado: {plan.recommended_option}</span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {plan.options.map((opt) => (
            <div
              key={opt.option}
              className={`rounded-xl border p-3 text-sm ${
                opt.option === plan.recommended_option ? "border-emerald-500 bg-emerald-500/10" : "border-slate-800 bg-slate-950"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase">Plan {opt.option}</span>
                <span className="text-[11px] text-slate-400">{opt.summary}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {opt.blocks.map((b, idx) => (
                  <li key={idx} className="flex items-center justify-between rounded bg-slate-800/60 px-2 py-1">
                    <span>{b.label}</span>
                    <span className="text-xs text-slate-300">{b.minutes}m</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-lg font-semibold">Perros y casa</h3>
        <p className="text-sm text-slate-300">Paseos esenciales (10–15m) y plantillas de casa.</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {["Despertar", "Antes de salir", "Vuelta", "Noche"].map((slot) => (
            <span key={slot} className="rounded-full bg-slate-800 px-3 py-1">
              Paseo {slot}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2 text-xs">
          {["Casa 15", "Casa 30", "Casa 60", "Profunda"].map((casa) => (
            <span key={casa} className="rounded-full bg-emerald-600/20 px-3 py-1 text-emerald-200">
              {casa}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Nudges VIP</h3>
          <span className="text-xs text-slate-400">{followups.length} pendientes</span>
        </div>
        <div className="mt-2 space-y-2">
          {followups.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <div>
                <p className="text-sm font-semibold">{f.tasks?.title}</p>
                <p className="text-[11px] text-slate-400">Próximo nudge: {new Date(f.next_at).toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <button onClick={() => handleFollowAction(f.id, "done")} className="rounded-full bg-emerald-500 px-3 py-1 text-slate-900">
                  Hecho
                </button>
                <button onClick={() => handleFollowAction(f.id, "snooze")} className="rounded-full bg-slate-800 px-3 py-1">
                  Posponer
                </button>
                <button onClick={() => handleFollowAction(f.id, "lower")} className="rounded-full bg-amber-500 px-3 py-1 text-slate-900">
                  Bajar prio
                </button>
              </div>
            </div>
          ))}
          {followups.length === 0 ? <p className="text-sm text-slate-400">Sin nudges ahora.</p> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-lg font-semibold">Reuniones (stub)</h3>
        <div className="mt-2 space-y-2 text-sm">
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Título"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Resumen corto"
            value={meetingSummary}
            onChange={(e) => setMeetingSummary(e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Action items (uno por línea)"
            value={meetingActionItems}
            onChange={(e) => setMeetingActionItems(e.target.value)}
          />
          <button onClick={submitMeeting} className="rounded-full bg-emerald-500 px-4 py-2 font-semibold text-slate-900">
            Guardar y crear tareas
          </button>
        </div>
        <div className="mt-3 space-y-1 text-xs">
          {meetings.map((m) => (
            <div key={m.id} className="rounded border border-slate-800 bg-slate-950 px-3 py-2">
              <p className="font-semibold">{m.title}</p>
              <p className="text-slate-400">{m.summary}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tareas</h3>
          <Link href="/app/tasks" className="text-xs text-emerald-300 underline">
            Ver todas
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${priorityColor[task.priority] ?? "bg-slate-500"}`} />
                <div>
                  <p className="text-sm">{task.title}</p>
                  <p className="text-[11px] text-slate-400">{task.tags.join(", ")}</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase">{task.status}</span>
            </div>
          ))}
          {tasks.length === 0 ? <p className="text-sm text-slate-400">Sin tareas hoy.</p> : null}
        </div>
      </div>

      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
    </div>
  );
}
