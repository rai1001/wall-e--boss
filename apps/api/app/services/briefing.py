from datetime import date
from typing import List

from app.models import Task, Priority
from app.schemas import BriefingResponse, BriefingSection


def _mode(events) -> str:
    if any("descanso" in e.title.lower() for e in events):
        return "libranza"
    if any("eventos" in e.title.lower() for e in events):
        return "evento"
    return "normal"


def _detect_off_day(events, tasks) -> bool:
    return len(events) == 0 and len(tasks) == 0


def build_briefing(day: date, tasks: List[Task], events) -> BriefingResponse:
    mode = _mode(events)
    off_suspected = _detect_off_day(events, tasks)

    agenda_items = [
        f"{e.start_time.strftime('%H:%M')} - {e.end_time.strftime('%H:%M')} {e.title}"
        for e in sorted(events, key=lambda e: e.start_time)
    ]

    agenda_section = BriefingSection(title="Agenda de hoy", items=agenda_items or ["(sin eventos)"])

    vip = [t.title for t in tasks if t.priority == Priority.VIP]
    top_vip = vip[:3]

    dogs = [
        "Paseo al despertar (10-15 min)",
        "Paseo antes de salir",
        "Paseo al volver",
        "Paseo noche / al llegar si turno noche",
    ]

    house = [
        "Casa 15: platos, encimera, barrido rápido, basura si toca",
        "Casa 30: + baño rápido o aspirado",
        "Casa 60: zonas + extra rotativo",
        "Profunda: cocina/baño a fondo cuando haya tiempo",
    ]

    plan_summary = [
        "Plan A: supervivencia (perros esencial + VIP + casa 15)",
        "Plan B: A + micro-bloque máster/casa",
        "Plan C: si hay huecos largos reales",
    ]

    return BriefingResponse(
        day=day.isoformat(),
        mode=mode,
        is_off_day=mode == "libranza",
        off_day_suspected=off_suspected,
        agenda=[agenda_section],
        plan_summary=plan_summary,
        top_vip=top_vip,
        dogs=dogs,
        house=house,
    )
