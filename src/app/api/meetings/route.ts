import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserOrThrow } from "../../../lib/auth";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

const meetingSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  transcript: z.string().optional(),
  action_items: z.array(z.object({ title: z.string(), priority: z.string().optional(), tags: z.array(z.string()).optional() })).optional(),
});

export async function GET() {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const { data, error } = await supabase.from("meeting_notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ meetings: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = meetingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const { data, error } = await supabase
    .from("meeting_notes")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      summary: parsed.data.summary ?? null,
      transcript: parsed.data.transcript ?? null,
      action_items: parsed.data.action_items ?? [],
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ meeting: data }, { status: 201 });
}
