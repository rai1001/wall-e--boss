import { startOfDay, endOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const now = new Date();
  const start = startOfDay(now).toISOString();
  const end = endOfDay(now).toISOString();
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", user.id)
    .gte("start_at", start)
    .lte("end_at", end)
    .order("start_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ timezone: env.WALLE_TIMEZONE, events: data });
}
