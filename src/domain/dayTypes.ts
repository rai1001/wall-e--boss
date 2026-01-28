export type CalendarEvent = {
  id?: string;
  title: string;
  start_at: string;
  end_at: string;
  is_evento: boolean;
  is_descanso: boolean;
};

export type DayState = {
  day_type?: "NORMAL" | "LONG" | "EXTREME" | "OFF";
  off_confirmed?: boolean;
  suspected_off?: boolean;
};

export type DayClassification = {
  dayType: "NORMAL" | "LONG" | "EXTREME" | "OFF";
  hasEvento: boolean;
  hasDescanso: boolean;
  suspectedOff: boolean;
  tomorrowLong: boolean;
  reason: string;
};

const isBigEvento = (title: string) =>
  /eventos?.*100|100.*eventos?/i.test(title);

export function classifyDay(events: CalendarEvent[], dayState: DayState | null): DayClassification {
  const hasDescanso = events.some((e) => e.is_descanso);
  const offConfirmed = Boolean(dayState?.off_confirmed);

  const eventoEvents = events.filter((e) => e.is_evento);
  const hasEvento = eventoEvents.length > 0;
  const bigEvento = events.some((e) => isBigEvento(e.title));

  const latestEnd = events.reduce((acc, ev) => {
    const d = new Date(ev.end_at);
    return d.getTime() > acc ? d.getTime() : acc;
  }, 0);

  let dayType: DayClassification["dayType"] = "NORMAL";
  let reason = "normal";
  let tomorrowLong = false;

  if (hasDescanso || offConfirmed || dayState?.day_type === "OFF") {
    dayType = "OFF";
    reason = "descanso";
  } else if (eventoEvents.length >= 2) {
    dayType = "EXTREME";
    reason = "varios eventos";
  } else if (bigEvento) {
    dayType = "LONG";
    tomorrowLong = true;
    reason = "evento 100 pax";
  } else if (hasEvento) {
    dayType = "LONG";
    reason = "evento";
  } else if (latestEnd > 0) {
    const endHour = new Date(latestEnd).getUTCHours();
    if (endHour >= 23) {
      dayType = "LONG";
      reason = "termina tarde";
    }
  } else if (dayState?.day_type === "LONG" || dayState?.day_type === "EXTREME") {
    dayType = dayState.day_type;
    reason = "persisted";
  }

  const suspectedOff = dayState?.suspected_off ?? events.length === 0;

  return {
    dayType,
    hasEvento,
    hasDescanso,
    suspectedOff,
    tomorrowLong,
    reason,
  };
}
