import { startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const todayDate = startOfDay(new Date()).toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("day_state")
    .upsert({
      user_id: user.id,
      date: todayDate,
      day_type: "OFF",
      off_confirmed: true,
      suspected_off: false,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ day_state: data });
}
