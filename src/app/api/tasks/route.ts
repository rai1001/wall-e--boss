import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserOrThrow } from "../../../lib/auth";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

const taskSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(["VIP", "IMPORTANT", "NORMAL"]).default("NORMAL"),
  tags: z.array(z.string()).default([]),
  due_at: z.string().datetime().optional().nullable(),
  status: z.enum(["TODO", "DOING", "DONE", "SNOOZED"]).default("TODO"),
  source: z.enum(["MANUAL", "VOICE", "CALENDAR", "SYSTEM"]).default("MANUAL"),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  let query = supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (date) {
    query = query.filter("due_at", "gte", `${date}T00:00:00`).filter("due_at", "lte", `${date}T23:59:59`);
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ tasks: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = taskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...parsed.data, user_id: user.id })
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ task: data }, { status: 201 });
}
