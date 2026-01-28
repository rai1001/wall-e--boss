import { endOfDay, startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { classifyDay } from "../../../../domain/dayTypes";
import { buildPlans } from "../../../../domain/planEngine";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const todayIso = startOfDay(new Date()).toISOString();
  const endIso = endOfDay(new Date()).toISOString();
  const dateKey = todayIso.split("T")[0];

  const [{ data: events }, { data: dayState }, { data: tasks }, { data: profile }] = await Promise.all([
    supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", user.id)
      .gte("start_at", todayIso)
      .lte("end_at", endIso),
    supabase.from("day_state").select("*").eq("user_id", user.id).eq("date", dateKey).maybeSingle(),
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("priority", { ascending: true }),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ]);

  let classification = classifyDay(events ?? [], dayState ?? null);
  if (classification.suspectedOff && profile?.allow_auto_off) {
    classification = { ...classification, dayType: "OFF", suspectedOff: false };
    await supabase
      .from("day_state")
      .upsert({ user_id: user.id, date: dateKey, day_type: "OFF", off_confirmed: true, suspected_off: false });
  }
  const plan = buildPlans(classification, events ?? [], tasks ?? []);

  // persist plan options
  const planRows = plan.options.map((opt) => ({
    user_id: user.id,
    date: dateKey,
    option: opt.option,
    summary: opt.summary,
    blocks: opt.blocks,
  }));
  await supabase.from("plans").upsert(planRows);

  // if evento 100 pax -> mark tomorrow long
  if (classification.tomorrowLong) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = tomorrow.toISOString().split("T")[0];
    await supabase
      .from("day_state")
      .upsert({ user_id: user.id, date: tomorrowKey, day_type: "LONG", suspected_off: false, off_confirmed: false });
  }

  return NextResponse.json({
    day_type: classification.dayType,
    recommended_option: plan.recommended,
    options: plan.options,
    suspected_off: classification.suspectedOff,
  });
}

export async function PATCH(request: Request) {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const dateKey = new Date().toISOString().split("T")[0];
  const { option } = (await request.json().catch(() => ({}))) as { option?: "A" | "B" | "C" };
  if (!option) return NextResponse.json({ error: "option required" }, { status: 400 });
  // For V0 we just mark in day_state notes; no side effects on external calendars.
  await supabase
    .from("day_state")
    .upsert({ user_id: user.id, date: dateKey, notes: `option:${option}` })
    .eq("user_id", user.id)
    .eq("date", dateKey);
  return NextResponse.json({ ok: true, option });
}
