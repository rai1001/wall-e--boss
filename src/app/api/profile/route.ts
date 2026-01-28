import { NextResponse } from "next/server";
import { getUserOrThrow } from "../../../lib/auth";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({
    id: data.id,
    display_name: data.display_name,
    timezone: data.timezone,
    preferences: {
      walk_minutes_min: data.walk_minutes_min ?? 10,
      walk_minutes_max: data.walk_minutes_max ?? 15,
      followup_window: data.followup_window ?? "08:30-20:30",
      allow_auto_off: data.allow_auto_off ?? false,
    },
  });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const body = (await request.json().catch(() => ({}))) as {
    walk_minutes_min?: number;
    walk_minutes_max?: number;
    followup_window?: string;
    allow_auto_off?: boolean;
  };
  const updates = {
    walk_minutes_min: body.walk_minutes_min,
    walk_minutes_max: body.walk_minutes_max,
    followup_window: body.followup_window,
    allow_auto_off: body.allow_auto_off,
    preferences: {
      walk_minutes_min: body.walk_minutes_min,
      walk_minutes_max: body.walk_minutes_max,
      followup_window: body.followup_window,
      allow_auto_off: body.allow_auto_off,
    },
  };
  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
