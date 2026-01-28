import { addMinutes, endOfDay, startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { createSupabaseServiceClient } from "../../../../lib/supabase/server";
import { classifyDay } from "../../../../domain/dayTypes";

export async function GET(request: Request) {
  const isVercelCron = Boolean(request.headers.get("x-vercel-cron"));
  const validSecret = env.CRON_SECRET && request.headers.get("x-cron-secret") === env.CRON_SECRET;
  if (!isVercelCron && !validSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  const { data: profiles, error: profileError } = await supabase.from("profiles").select("*");
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

  const now = new Date();
  const todayIso = startOfDay(now).toISOString();
  const endIso = endOfDay(now).toISOString();
  const dateKey = todayIso.split("T")[0];

  for (const profile of profiles ?? []) {
    const [{ data: events }, { data: dayState }] = await Promise.all([
      supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", profile.id)
        .gte("start_at", todayIso)
        .lte("end_at", endIso),
      supabase.from("day_state").select("*").eq("user_id", profile.id).eq("date", dateKey).maybeSingle(),
    ]);
    const classification = classifyDay(events ?? [], dayState ?? null);

    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", profile.id)
      .or("priority.eq.VIP,priority.eq.IMPORTANT,tags.cs.{work}")
      .gte("due_at", todayIso)
      .lte("due_at", endIso);

    const nextMinutes = classification.dayType === "EXTREME" || classification.dayType === "LONG" ? 120 : 90;
    const nextAt = addMinutes(now, nextMinutes).toISOString();

    if (tasks && tasks.length > 0) {
      const rows = tasks.map((t) => ({
        user_id: profile.id,
        task_id: t.id,
        level: 1,
        next_at: nextAt,
        active: true,
      }));
      await supabase.from("followups").upsert(rows);
    }
  }

  return NextResponse.json({ ok: true });
}
