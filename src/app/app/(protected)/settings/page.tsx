"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [walkMin, setWalkMin] = useState(10);
  const [walkMax, setWalkMax] = useState(15);
  const [followWindow, setFollowWindow] = useState("08:30-20:30");
  const [allowAutoOff, setAllowAutoOff] = useState(false);
  const [saving, setSaving] = useState(false);
  const [googleConnected] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const json = await res.json();
      setWalkMin(json.preferences?.walk_minutes_min ?? 10);
      setWalkMax(json.preferences?.walk_minutes_max ?? 15);
      setFollowWindow(json.preferences?.followup_window ?? "08:30-20:30");
      setAllowAutoOff(json.preferences?.allow_auto_off ?? false);
      // naive check: if oauth exists, backend could expose flag; for now, optimistic false.
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walk_minutes_min: walkMin,
        walk_minutes_max: walkMax,
        followup_window: followWindow,
        allow_auto_off: allowAutoOff,
      }),
    });
    setSaving(false);
  };

  return (
    <div className="space-y-4 text-slate-100">
      <h1 className="text-xl font-semibold">Ajustes</h1>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm w-32">Paseos (min)</label>
          <input
            type="number"
            className="w-20 rounded bg-slate-950 px-2 py-1 text-sm border border-slate-700"
            value={walkMin}
            onChange={(e) => setWalkMin(Number(e.target.value))}
          />
          <span className="text-sm">a</span>
          <input
            type="number"
            className="w-20 rounded bg-slate-950 px-2 py-1 text-sm border border-slate-700"
            value={walkMax}
            onChange={(e) => setWalkMax(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm w-32">Ventana followups</label>
          <input
            className="flex-1 rounded bg-slate-950 px-2 py-1 text-sm border border-slate-700"
            value={followWindow}
            onChange={(e) => setFollowWindow(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm w-32">Auto DESCANSO</label>
          <input type="checkbox" checked={allowAutoOff} onChange={(e) => setAllowAutoOff(e.target.checked)} />
          <span className="text-xs text-slate-400">Permitir marcar descanso automáticamente</span>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-2">
        <h2 className="text-lg font-semibold">Integraciones</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Google Calendar</p>
            <p className="text-xs text-slate-400">{googleConnected ? "Conectado" : "No conectado"}</p>
          </div>
          <a
            href="/api/auth/google"
            className="rounded-full bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-400"
          >
            {googleConnected ? "Reautorizar" : "Conectar"}
          </a>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Health Connect / Amazfit</p>
            <p className="text-xs text-slate-400">Usar app companion Android para subir pasos/HR/sueño.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
