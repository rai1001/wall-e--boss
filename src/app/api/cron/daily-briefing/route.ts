import { endOfDay, startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { createSupabaseServiceClient } from "../../../../lib/supabase/server";
import { classifyDay } from "../../../../domain/dayTypes";
import { buildPlans } from "../../../../domain/planEngine";
import { buildBriefing } from "../../../../domain/briefing";

export async function GET(request: Request) {
  if (!env.CRON_SECRET || request.headers.get("x-cron-secret") !== env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  const { data: profiles, error: profileError } = await supabase.from("profiles").select("*");
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

  const todayIso = startOfDay(new Date()).toISOString();
  const endIso = endOfDay(new Date()).toISOString();
  const dateKey = todayIso.split("T")[0];

  for (const profile of profiles ?? []) {
    const { data: events } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", profile.id)
      .gte("start_at", todayIso)
      .lte("end_at", endIso);
    const { data: dayState } = await supabase
      .from("day_state")
      .select("*")
      .eq("user_id", profile.id)
      .eq("date", dateKey)
      .maybeSingle();
    const { data: tasks } = await supabase.from("tasks").select("*").eq("user_id", profile.id);

    const classification = classifyDay(events ?? [], dayState ?? null);
    const plan = buildPlans(classification, events ?? [], tasks ?? []);
    const planRows = plan.options.map((opt) => ({
      user_id: profile.id,
      date: dateKey,
      option: opt.option,
      summary: opt.summary,
      blocks: opt.blocks,
    }));
    await supabase.from("plans").upsert(planRows);

    const familyText = buildBriefing("FAMILY", classification, plan, tasks ?? []);
    const workText = buildBriefing("WORK", classification, plan, tasks ?? []);
    await supabase.from("briefings").upsert([
      { user_id: profile.id, date: dateKey, style: "FAMILY", text: familyText },
      { user_id: profile.id, date: dateKey, style: "WORK", text: workText },
    ]);
  }

  return NextResponse.json({ ok: true, processed: profiles?.length ?? 0 });
}
