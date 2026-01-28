import { addDays, startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { classifyDay } from "../../../../domain/dayTypes";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const today = startOfDay(new Date());

  const daysPromises = Array.from({ length: 7 }).map(async (_, idx) => {
    const day = addDays(today, idx);
    const startIso = day.toISOString();
    const endIso = new Date(day.getTime() + 86400000 - 1).toISOString();
    const dateKey = startIso.split("T")[0];

    const [{ data: events }, { data: dayState }, { data: tasks }] = await Promise.all([
      supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .gte("start_at", startIso)
        .lte("end_at", endIso),
      supabase.from("day_state").select("*").eq("user_id", user.id).eq("date", dateKey).maybeSingle(),
      supabase.from("tasks").select("id,priority,tags,due_at").eq("user_id", user.id),
    ]);

    const classification = classifyDay(events ?? [], dayState ?? null);
    const vipCount = (tasks ?? []).filter((t) => t.priority === "VIP" || t.tags?.includes("work")).length;

    return {
      date: dateKey,
      day_type: classification.dayType,
      events: events?.length ?? 0,
      vip_tasks: vipCount,
    };
  });

  const days = await Promise.all(daysPromises);
  return NextResponse.json({ days });
}
