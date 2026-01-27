from datetime import date, datetime, time, timedelta
from typing import List

from app.schemas import EventCreate


def generate_mock_events(day: date) -> List[EventCreate]:
    start_base = datetime.combine(day, time(hour=10))
    events = [
        EventCreate(
            title="eventos 80 pax",
            start_time=start_base,
            end_time=start_base + timedelta(hours=4),
            location="Hotel cocina",
            source="mock",
            is_event_day=True,
        ),
        EventCreate(
            title="Brief equipo",
            start_time=datetime.combine(day, time(hour=9)),
            end_time=datetime.combine(day, time(hour=9, minute=30)),
            location="Oficina",
            source="mock",
        ),
    ]

    # If Sunday, propose descanso
    if day.weekday() == 6:
        events.append(
            EventCreate(
                title="DESCANSO",
                start_time=datetime.combine(day, time(hour=0)),
                end_time=datetime.combine(day, time(hour=23, minute=59)),
                source="mock",
                is_off_day=True,
            )
        )
    return events
