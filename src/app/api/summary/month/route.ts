import { endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { classifyDay } from "../../../../domain/dayTypes";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // fetch events for month
  const { data: events } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", user.id)
    .gte("start_at", monthStart.toISOString())
    .lte("end_at", monthEnd.toISOString());

  // fetch day_state for month
  const { data: daysState } = await supabase
    .from("day_state")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", monthStart.toISOString().split("T")[0])
    .lte("date", monthEnd.toISOString().split("T")[0]);

  const result: { date: string; day_type: string; eventos: number; descanso: boolean }[] = [];
  const totalDays = monthEnd.getDate();
  for (let i = 0; i < totalDays; i++) {
    const d = startOfDay(new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1));
    const dateKey = d.toISOString().split("T")[0];
    const dayEvents = (events ?? []).filter((e) => e.start_at.startsWith(dateKey));
    const state = (daysState ?? []).find((ds) => ds.date === dateKey) ?? null;
    const classification = classifyDay(dayEvents ?? [], state);
    result.push({
      date: dateKey,
      day_type: classification.dayType,
      eventos: dayEvents.length,
      descanso: classification.hasDescanso,
    });
  }

  return NextResponse.json({ days: result });
}
