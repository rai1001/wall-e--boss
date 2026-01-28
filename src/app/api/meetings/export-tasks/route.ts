import { NextResponse } from "next/server";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  const { meeting_id } = (await request.json().catch(() => ({}))) as { meeting_id?: string };
  if (!meeting_id) return NextResponse.json({ error: "meeting_id required" }, { status: 400 });
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const { data: meeting, error } = await supabase.from("meeting_notes").select("*").eq("id", meeting_id).eq("user_id", user.id).single();
  if (error || !meeting) return NextResponse.json({ error: error?.message ?? "not found" }, { status: 404 });

  const items: { title: string; priority?: string; tags?: string[] }[] = meeting.action_items ?? [];
  if (items.length === 0) return NextResponse.json({ created: 0 });

  const rows = items.map((i) => ({
    user_id: user.id,
    title: i.title,
    priority: (i.priority as "VIP" | "IMPORTANT" | "NORMAL") ?? "IMPORTANT",
    tags: i.tags ?? ["work"],
    status: "TODO",
    source: "SYSTEM",
  }));
  const { data: tasks, error: taskError } = await supabase.from("tasks").insert(rows).select("*");
  if (taskError) return NextResponse.json({ error: taskError.message }, { status: 400 });
  return NextResponse.json({ created: tasks?.length ?? 0, tasks });
}
