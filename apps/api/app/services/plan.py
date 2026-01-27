from datetime import date
from typing import List, Tuple

from app.models import Priority, Task
from app.schemas import PlanBlock, PlanTodayResponse


def _classify_day(events) -> Tuple[str, bool]:
    mode = "normal"
    has_eventos = any("eventos" in e.title.lower() for e in events)
    has_descanso = any("descanso" in e.title.lower() for e in events)
    if has_descanso:
        mode = "libranza"
    elif has_eventos:
        mode = "evento"
    long_day = any(getattr(e, "end_time", None) and e.end_time.hour >= 20 for e in events)
    if long_day and mode != "libranza":
        mode = f"{mode}-largo" if mode != "evento" else "evento-largo"
    return mode, has_descanso


def build_plan_today(day: date, tasks: List[Task], events) -> PlanTodayResponse:
    mode, is_off = _classify_day(events)
    vip_tasks = [t.title for t in tasks if t.priority == Priority.VIP]
    important_tasks = [t.title for t in tasks if t.priority == Priority.Important]

    plan_a_blocks = [
        "Perros: paseos 10-15 min (despertar, antes de salir, vuelta, noche)",
        "Tareas VIP primero" if vip_tasks else "Revisar agenda rápida",
        "Casa 15 min (platos + barrido + basura)"
    ]
    plan_b_blocks = plan_a_blocks + [
        "Micro-bloque máster IA 20-30 min" if important_tasks else "Micro-bloque casa extra 15 min"
    ]
    plan_c_blocks = plan_b_blocks + ["Bloque foco 45-60 min si hay hueco limpio"]

    plans = [
        PlanBlock(label="Plan A (supervivencia)", focus="Cumplir mínimos", reason="Día cargado o incierto", blocks=plan_a_blocks),
        PlanBlock(label="Plan B (sostenido)", focus="Añadir un extra", reason="Si aparece un hueco corto limpio", blocks=plan_b_blocks),
        PlanBlock(label="Plan C (amplio)", focus="Aprovechar huecos largos", reason="Si el día se despeja", blocks=plan_c_blocks),
    ]

    suggestion = "Plan A" if mode.startswith("evento") or is_off else "Plan B" if vip_tasks else "Plan A"

    return PlanTodayResponse(
        date=day.isoformat(),
        suggestion=suggestion,
        plans=plans,
    )
