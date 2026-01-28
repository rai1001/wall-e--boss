import { endOfDay, startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { buildBriefing } from "../../../../domain/briefing";
import { classifyDay } from "../../../../domain/dayTypes";
import { buildPlans } from "../../../../domain/planEngine";

export async function GET(request: Request) {
  const styleParam = new URL(request.url).searchParams.get("style");
  const style = styleParam === "WORK" ? "WORK" : "FAMILY";
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const todayIso = startOfDay(new Date()).toISOString();
  const endIso = endOfDay(new Date()).toISOString();
  const dateKey = todayIso.split("T")[0];

  const [{ data: events }, { data: dayState }, { data: tasks }] = await Promise.all([
    supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", user.id)
      .gte("start_at", todayIso)
      .lte("end_at", endIso),
    supabase.from("day_state").select("*").eq("user_id", user.id).eq("date", dateKey).maybeSingle(),
    supabase.from("tasks").select("*").eq("user_id", user.id),
  ]);

  const classification = classifyDay(events ?? [], dayState ?? null);
  const plan = buildPlans(classification, events ?? [], tasks ?? []);
  const text = buildBriefing(style, classification, plan, tasks ?? []);

  await supabase
    .from("briefings")
    .upsert({ user_id: user.id, date: dateKey, style, text })
    .select("*")
    .single();

  return NextResponse.json({
    text,
    day_type: classification.dayType,
    recommended_option: plan.recommended,
    options: plan.options,
    suspected_off: classification.suspectedOff,
  });
}
