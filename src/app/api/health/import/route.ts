import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

const payloadSchema = z.object({
  date: z.string().date(),
  source: z.string().default("health_connect"),
  steps: z.number().int().optional(),
  hr_avg: z.number().optional(),
  sleep_minutes: z.number().int().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();

  const { error } = await supabase.from("health_metrics").upsert({
    user_id: user.id,
    date: parsed.data.date,
    source: parsed.data.source,
    steps: parsed.data.steps ?? 0,
    hr_avg: parsed.data.hr_avg ?? null,
    sleep_minutes: parsed.data.sleep_minutes ?? null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
