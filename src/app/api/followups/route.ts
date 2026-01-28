import { NextResponse } from "next/server";
import { getUserOrThrow } from "../../../lib/auth";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const { data, error } = await supabase
    .from("followups")
    .select("*, tasks(*)")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("next_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ followups: data });
}

export async function POST(request: Request) {
  const { action, followup_id } = (await request.json().catch(() => ({}))) as { action?: "done" | "snooze" | "lower"; followup_id?: string };
  if (!action || !followup_id) return NextResponse.json({ error: "action and followup_id required" }, { status: 400 });
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();

  if (action === "done") {
    await supabase.from("tasks").update({ status: "DONE" }).eq("id", (await supabase.from("followups").select("task_id").eq("id", followup_id).single()).data?.task_id);
    await supabase.from("followups").update({ active: false, last_sent_at: new Date().toISOString() }).eq("id", followup_id).eq("user_id", user.id);
    return NextResponse.json({ ok: true });
  }

  if (action === "snooze") {
    const nextAt = new Date(Date.now() + 90 * 60 * 1000).toISOString();
    await supabase.from("followups").update({ next_at: nextAt }).eq("id", followup_id).eq("user_id", user.id);
    return NextResponse.json({ ok: true, next_at: nextAt });
  }

  if (action === "lower") {
    await supabase.from("tasks").update({ priority: "NORMAL" }).eq("id", (await supabase.from("followups").select("task_id").eq("id", followup_id).single()).data?.task_id);
    await supabase.from("followups").update({ active: false }).eq("id", followup_id).eq("user_id", user.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
