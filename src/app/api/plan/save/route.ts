import { NextResponse } from "next/server";
import { getUserOrThrow } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

type Block = {
  type: string;
  label: string;
  minutes: number;
  anchor?: string;
  suggested_time?: string;
};

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const user = await getUserOrThrow();
  const body = (await request.json().catch(() => ({}))) as { blocks?: Block[] };
  if (!body.blocks) return NextResponse.json({ error: "blocks required" }, { status: 400 });
  const dateKey = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("suggested_blocks")
    .upsert({ user_id: user.id, date: dateKey, blocks: body.blocks });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
