import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  priority: z.enum(["VIP", "IMPORTANT", "NORMAL"]).optional(),
  tags: z.array(z.string()).optional(),
  due_at: z.string().datetime().nullable().optional(),
  status: z.enum(["TODO", "DOING", "DONE", "SNOOZED"]).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const { data, error } = await supabase
    .from("tasks")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ task: data });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const { id } = await params;
  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
